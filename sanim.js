function fitCanvasToScreen(ctx, color){
	//this sets the canvas to fill the width of the screen
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.fillStyle = color;
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
}
function Object(){
	this.lineWidth = 0.0000000000000001;//setting the lineWidth to a very low value so that the lines does not show by default
	this.children  = []; //list of children embedded in the object
	this.isInPath = function(x, y){
		this.render(); // we have to re-render for the canvas context to catch this as the latest rendering since
		//the latest path is what isPointInPath looks at;
		return this.world.context.isPointInPath(x,y);
	}
	this.setWorld = function(world){
		//this sets the world of the object
		this.world = world;
	}
	this.addEvent = function (eventType, eventResponse){
		//this function is going to stand for as the event listeener function that is going to be doing the work of the normal event listener that
		//DOM elements listens to
		var obj = this;// trying to reassign the object to allow the eventlistener function to be able to see it as it is
		this.world.context.canvas.addEventListener(eventType, function(e){
			if(obj.isInPath(e.clientX, e.clientY)){
				e.canvasTargetObject = obj;//setting the object to be the canvas target so that it can be refered to in the event response function
				eventResponse(e);//fire the event response
			}else{
				//do nothing in this case.
			}
		});
	}
	this.addChild = function(obj){
		//this method adds a child object to an object
		if(!this.world){
			//this will throw an error as there is no world related to the parent object
			throw("can not add child object to parent as the parent have not been added to a world(scene)");
		}else{
			obj.x = obj.xInitial + this.x;//setting the origin of the child object to be with respect to the origin of the parent object
			obj.y = obj.yInitial + this.y;//we are using the initial settings because it is tamper proof;
			obj.world = this.world;//setting the world of the child object to be same as the world of the parent object
			this.children.push(obj);//adding the child object to the list of children to the parent object
		}

	}
	this.removeChild = function(obj){
		//this method removes a child object from the parent
		var index = this.children.indexOf(obj);
		if(0 <= index){
			this.children.splice(index, 1);//this removes the object from the list of children but does not change other setttings of the object
		}//this does not throw an error if such object does not exist as child to the parent object
	}
	this.renderChildren =function(){
		this.children.forEach((obj) => {
			obj.render();
		})
	}
}
function Player(obj){
	//this constructor function takes care of all the operations that has to do with having a player on the scene;
	this.object = obj;//this sets the object that is going to be the controller in the scene instance.
	this.minOffsetX = 0; //the minimum offset of the player from the edge of the viewport on x-axis
	this.minOffsetY = 0; //the minimum offset of the player from the edge of the viewport on y-axis
	this.maxOffsetX = 0; //the maximum offset of the player from the edge of the viewport on x-axis
	this.maxOffsetY = 0; //the maximum offset of the player from the edge of the viewport on y-axis
	this.coupleToCamera = true;//this states if the player should be coupled with camera or not, if true the camera will be moving with the player
	this.makeCameraAdjustments = function(){
		//this method makes all the neccessary adjustments that need to be made to camera with respect to the players position at that time.
		if(this.world && this.coupleToCamera === true){
			//checking to be sure that the player has been attached to a scene and that the coupleToCamera setting has been set to true before performing neccessary computations
			var Xp = this.world.camera.x;//camera position on the x-axis
			var Yp = this.world.camera.y;//camera position on the y-axis
			var Vw = this.world.context.canvas.width;// the width of the viewport
			var Vh = this.world.context.canvas.height;// the height of the viewport
			var Px = this.object.x/this.world.camera.perspective;//player origin position on x-axis
			var Py = this.object.y/this.world.camera.perspective;//player origin position on y-axis
			var Ph = this.object.height/this.world.camera.perspective;//player height
			var Pw = this.object.width/this.world.camera.perspective;//player width
			//the reason for dividing by the camera's perspective is to make sure that the values that will be using for the calculation is with respect to the camera's view
			var ofX = this.minOffsetX;//player min offset from viewport on x-axis
			var ofY = this.minOffsetY;//player min offset from viewport on y-axis
			if(Xp >= (Px - ofX)){
				//checking to know if a part of the player is outside the viewport of the camera by the left hand side.
				this.world.camera.x = Px - ofX//adjusting the camera position on the x-axis
			}
			if(Yp >= (Py - ofY)){
				//checking to know if a part of the player is outside the viewport of the camera by the top side.
				this.world.camera.y = Py - ofY//adjusting the camera position on the y-axis
			}
			if((Yp + Vh) <= (Py + ofY + Ph)){
				//checking to know if a part of the player is outside the viewport of the camera by the bottom side.
				this.world.camera.y = (Py + ofY + Ph)-Vh //adjusting the camera position on the y-axis
			}
			if((Xp + Vw) <= (Px + ofX + Pw)){
				//checking to know if a part of the player is outside the viewport of the camera by the bottom side.
				this.world.camera.x = (Px + ofX + Pw)-Vw //adjusting the camera position on the x-axis
			}
		}else{
			//if no scene then the programs below will take place
		}

	}
	this.render = function(){
		//this renders the player to the scene
		this.makeCameraAdjustments();//making camera adjustments
		this.world.render(); //re-rendering the scene after adjustments
	}
}
function RectObject(x, y, width, height, color= 'black', fillColor = null){
	//this constructor function is for the rectangle object, this takes care of the operations that has to do with the objects in the canvas
	this.x = x, this.y = y, this.width = width, this.height = height, this.color = color, this.fillColor = fillColor;
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	this.render = function(){
		//this renders the object to the canvas
		this.world.context.strokeStyle = this.color;
		this.world.context.lineWidth = this.lineWidth;
		if(this.world.camera){
			var xStart = (this.x/this.world.camera.perspective)-this.world.camera.x, yStart = (this.y/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			var width = this.width/this.world.camera.perspective, height = this.height/this.world.camera.perspective; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
		}else{
			var xStart = this.x, yStart = this.y;
		}
		if(this.fillColor){
			this.world.context.fillStyle = this.fillColor;
			this.world.context.fillRect(xStart, yStart, width, height);
		}
		//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object 
		this.world.context.beginPath();
		this.world.context.moveTo(xStart, yStart);
		this.world.context.lineTo(xStart, yStart+height);
		this.world.context.lineTo(xStart+width, yStart+height);
		this.world.context.lineTo(xStart+width, yStart);
		this.world.context.closePath();
		this.world.context.stroke();
		this.renderChildren();
		
	}
	Object.call(this);
}

function PathObject(paths){
	/*
	This is the definition for a canvas path object.
	This object gives more functionality to the canvas path, it literally make the path an object instead of just a path.
	*/
	this.paths = paths;
	this.render = function(){
		this.world.context.beginPath();
		for(var i = 0;i<this.paths.length;i++){
			if(i==0){
				this.world.context.moveTo(this.paths[i][0], this.paths[i][1]);
			}else if(i==this.paths.length-1){
				this.world.context.lineTo(this.paths[i][0], this.paths[i][1]);
				this.world.context.closePath();
				this.world.context.stroke();
			}else{
				this.world.context.lineTo(this.paths[i][0], this.paths[i][1]);
			}
			
		}
	}

	this.isInPath = function(x, y){
		this.render(); // we have to re-render for the canvas context to catch this as the latest rendering since
		//the latest path is what isPointInPath looks at;
		return this.world.context.isPointInPath(x,y);
	}

}

function Camera(){
	this.x = 0, this.y =0, this.z = 0, this.perspective = 1, this.width = window.innerWidth, this.height = window.innerHeight;
	this.position = function(x, y, z){
		//this function sets the position of the camera on the canvas
		this.x = x, this.y = y; this.z =z;
	}
	this.setProperties = function(x,y,z,perspective){
		//this method helps to reset the camera parameters or features
		this.position(x,y,z); //This sets the position of the camera
		this.perspective = perspective; //this sets the perspective of the camera
	}
	this.setDimmension = function(width, height){
		//this sets the camera's area of view or viewport.
		this.width = width;
		this.height = height;
	}
}

function Scene(context){
	this.context = context; // holds the canvas context to which the graphics will be rendered to
	this.color = "orange";
	this.camera = null; // holds the camera added to the world
	this.player = null; // holds the player in the scene if exist
	this.lights = new Array(); // holds the lights added to the scene
	this.objects = new Array(); //holds the objects added to the scene

	this.addObject = function(object){
		//this adds an object to the scene
		object.world = this;
		this.objects.push(object);
	}
	this.removeObject = function(obj){
		//this method removes a child object from the scene
		var index = this.objects.indexOf(obj);
		if(0 <= index){
			this.objects.splice(index, 1);//this removes the object from the list of objects but does not change other setttings of the object
		}//this does not throw an error if such object does not exist as child object to the scene
	}
	this.setCamera = function(camera){
		//this adds a camera to the scene
		camera.world = this; // setting the world of the camera too
		this.camera=camera; // setting the camera of the world
	}
	this.setPlayer = function(player){
		//this adds a camera to the scene
		player.world = this; //setting the world of the player too
		this.player=player; //setting the player of the world
	}
	this.render = function(){
		//this renders the scene to the canvas
		fitCanvasToScreen(this.context, this.color);
		if(this.player){
			//check that the player is visible in the seen;
			this.player.makeCameraAdjustments();// making camera adjustments with respect to the position of the player in the viewport
		}else{
			//do something here, maybe alert user that there is no player in the scene yet
		}
		for(var i=0; this.objects.length>i; i++){
			obj = this.objects[i];
			obj.render();
		}
	}
	this.requestFullscreen = function(){
		//this function requests full screen for the whole canvas
		this.context.canvas.requestFullscreen()//works on chrome but not all the browsers, find the webkit versions for the other browsers
	}
	this.cancelRequestFullscreen = function(){
		//this function cancels the fullscreen mode for the canvas
		this.context.canvas.cancelRequestFullscreen()// works on chrome but not all the browsers, so find the webkit versions for the other browers
	}
}
function Histogram(data, obj){
	/*
	This object definition takes a statistical data and converts it to a histogram object; a histogram graphing of the give  data.

	to achieve this we need to consider that a histogram has a equal spacing of the bars, so we will be having the expression below;
	values = [array of values]; => representing the number of occurence
	nums = [array of values] => representing the component values, or items.
	the maximum of the values => max(values) will be the minimum size of the Y-axis of the graph, so let the height of the graph be L
	let L = height of the graph
	we may set L = max(values) + 20;
	let W be the widthe of the bars.
	let S be the spacing of the bars.
	then each of the bars representing the values will be placed at positions indexOfValue(S+W);
	*/
	this.data = data;
	this.obj = obj;
	obj.children.push(this);
	this.world = obj.world;
	this.controlWidth = this.obj.width;
	this.controlHeight = this.obj.height;
	this.scaleWithParent = true;//a boolean field that sets if the graph should scale with the object it is embedded into or not.
	this.offsetX = 10;
	this.offsetY = 10;
	this.strokeWidth = 2;
	this.strokeColor = 'magenta';
	this.fillStyle = 'magenta';
	this.graphOffsetY = 10;//this is the distance from the max bar to the tip of the line of the y-axis
	this.render = function(){
		if(this.scaleWithParent){
			//making sure that the graph scales with the object it is embedded into if it is set to scale as the object scales
			this.controlWidth = this.obj.width;
			this.controlHeight = this.obj.height;
		}
		if(this.world.camera){
			var xStart = ((this.obj.x + this.offsetX)/this.world.camera.perspective)-this.world.camera.x, yStart = ((this.obj.y + this.offsetY)/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			var controlWidth = this.controlWidth/this.world.camera.perspective, controlHeight = (this.controlHeight - this.graphOffsetY)/this.world.camera.perspective; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
			var graphOffsetY = this.graphOffsetY/this.world.camera.perspective;
			var offsetX = this.offsetX/this.world.camera.perspective, offsetY = this.offsetY/this.world.camera.perspective;
		}else{
			var xStart = this.obj.x + this.offsetX, yStart = this.obj.y + this.offsetY;
			var controlWidth = this.controlWidth, controlHeight = this.controlHeight;
			var graphOffsetY = this.graphOffsetY;
			var offsetX = this.offsetX, offsetY = this.offsetY;
		}
		c = this.obj.world.context;
		console.log(this.obj.world.context);
		var d = new Array(...this.data); //trying to make a clone of the original data
		var maxD = Math.max(...d);//the maximum value in the list;
		var controlRatio = (controlHeight-offsetY*2)/(maxD); //the ratio that makes sure that everything shows up in the screen
		var barWidth = 3*(controlWidth-2*offsetX)/(4*d.length);//calculating for the width of the bars
		var barSpacing = barWidth/3;
		var graphHeight = maxD*controlRatio + graphOffsetY;
		c.strokeStyle = this.strokeColor;
		c.lineWidth = this.strokeWidth;
		c.moveTo(xStart, yStart);
		c.lineTo(xStart, yStart+graphHeight);
		c.moveTo(xStart, yStart+graphHeight);
		c.lineTo(d.length*(barWidth + barSpacing) + xStart, yStart + graphHeight);
		c.stroke()
		for(var i=0; i<d.length; i++){
			c.fillStyle = this.fillStyle;
			c.fillRect(i*(barWidth+barSpacing) + xStart + this.strokeWidth-2, yStart + graphHeight - data[i]*controlRatio, barWidth, data[i]*controlRatio);
		}

	}

}