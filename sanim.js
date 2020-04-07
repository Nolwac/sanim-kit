function fitCanvasToScreen(ctx, color){
	//this sets the canvas to fill the width of the screen
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.fillStyle = color;
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
}
function Object(){
	this.lineWidth = 0.0000000000000001;//setting the lineWidth to a very low value so that the lines does not show by default
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
}
function player(obj){
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
function rectObject(x, y, width, height, color= 'black', fillColor = null){
	//this constructor function is for the rectangle object, this takes care of the operations that has to do with the objects in the canvas
	this.x = x, this.y = y, this.width = width, this.height = height, this.color = color, this.fillColor = fillColor;
	this.render = function(){
		//this renders the object to the canvas
		this.world.context.fillStyle = this.fillColor;
		this.world.context.strokeStyle = this.color;
		this.world.context.lineWidth = this.lineWidth;
		if(this.world.camera){
			var xStart = (this.x/this.world.camera.perspective)-this.world.camera.x, yStart = (this.y/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			var width = this.width/this.world.camera.perspective, height = this.height/this.world.camera.perspective; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
			if(this.fillColor){
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
		}else{
			this.world.context.fillRect(this.x, this.y, this.width, this.height);
		}
		
	}
	Object.call(this);
}

function pathObject(paths){
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
	this.setDimmension = function(){
		//this sets the camera's area of view or viewport.
		this.width = width, this.height=height;
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
