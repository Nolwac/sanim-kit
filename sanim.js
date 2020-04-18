function fitCanvasToScreen(ctx, color){
	//this sets the canvas to fill the width of the screen
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.fillStyle = color;
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
}
function Animation(world){
	//this object has all the animations types as its methods
	//the animation object sets the scene to be continually rerendering by creating a javascript animation frame that continually rerenders it
	this.speedReference = 0.01;
	window.sanimKitSpeedReference = this.speedReference;//setting the speed reference number gloabally;
	this.setSpeedReference = function(value){
		//this method sets the speed animation speed reference number
		this.speedReference = value;
		window.sanimKitSpeedReference = this.speedReference;//setting it globally as well
	}

	this.world = world;//setting the scene
	this.animationOn = false;//property that will be used to put out animation and allow another object to start animation
	this.asynchronous = true;//this allows the animations to occur at same time for all the object and not one at a time, then the other
	world.animationFrame = this;//setting the animation frame of the world
	this.animationEasingFunction = {
		//this object will hold animation easing functions like quadratic
		quadraticFast: function(counter, value){
			//returns the exponential of given value
			counter+=window.sanimKitSpeedReference;
			value = counter*counter;
			return [counter, value];
		},
		constant: function(counter, value){
			//returns the value given
			return [counter, value];
		}
	}

	this.AEF = this.animationEasingFunction;//for the sake of convenience using the framework as the later is very long
	var self = this;
	this.linear = function(obj, direction, speed, easingFunction, length){
		//this moves the object linearly towards to the right
		var distanceControl = 0;//distance control variable to check when we have reached the specified speed
		var initialSpeed = speed;
		var easingControl = 1, counter=1;//this is for applying easing to the animation;
		function animate(){
			var animationFrame = window.requestAnimationFrame(animate);
			if(obj.world.playAnimation && (self.animationOn==false || obj.animationStarted==true || self.asynchronous==true)){
				obj.animationStarted = true;//toggling the state of the obj animation started check property
				self.animationOn = true;//toggling the state of the animation object animation check
				speed = initialSpeed*window.sanimKitSpeedReference*easingControl;//setting the speed with reference to the speed reference of the Animation object
				//by placing the above line of code inside the animate function instead of above it, it means that changing the world speed reference affects
				//the speed of the object while the animation is still ongoing
				var execFunc = easingFunction(counter, easingControl);//updating the easing controller to apply easing effect
				counter = execFunc[0], easingControl = execFunc[1];
				if(length){
					if(distanceControl >= length){
						if(direction=='LEFT'){
							obj.x=obj.xInitial - length;
						}else if(direction=='RIGHT'){
							obj.x=obj.xInitial + length;
						}else if(direction=='UP'){
							obj.y=obj.yInitial - length;
						}else if(direction=='DOWN'){
							obj.y=obj.yInitial + length;
						}
						window.cancelAnimationFrame(animationFrame);//trying to cancel the animation frame once the desired length has been reached
						self.animationOn = false;//putting off the animation to give way for another animation to take place
					}
					distanceControl += speed;
				}
				if(direction=='LEFT'){
					obj.animationLinearLeft=animationFrame;
					obj.x-=speed;
				}else if(direction=='RIGHT'){
					obj.animationLinearRight=animationFrame;
					obj.x+=speed;
				}else if(direction=='UP'){
					obj.animationLinearUp=animationFrame;
					obj.y-=speed;
				}else if(direction=='DOWN'){
					obj.animationLinearDown=animationFrame;
					obj.y+=speed;
				}
				if(length){
					if(distanceControl >= length){
						window.cancelAnimationFrame(animationFrame);//trying to cancel the animation frame once the desired length has been reached
						self.animationOn = false;//putting off the animationn for another animation to take place
					}
					distanceControl += speed;
				}
				//obj.world.render();
			}
		}
		animate();

	}

	this.executeFunction = function(func){
		//this method executes a function as long as the animation frame is on
		function animate(){
			//this function does the actual execution of the function over and over again
			window.requestAnimationFrame(animate);
			func();//executing the function;
		}//this animation frame can be cancelled with the javascript cancelAnimationFrame API, using animation ID that is returned
		return animate();//returning animation ID
	}
	this.animationSequence = function(sequence){
		//this method executes an animation sequence. what this means is that it executes animation one after the other as specified by the user
		//for(seq in sequence)
	}
	// function sceneAnimator(){
	// 	window.requestAnimationFrame(sceneAnimator);
	// 	if(world.playAnimation){
	// 		world.render();//rendering the scene inside the animation frame
	// 	}
	// }
	// this.sceneAnimator = sceneAnimator();
}
function SanimObject(){
	this.lineWidth = 0.0000000000000001;//setting the lineWidth to a very low value so that the lines does not show by default
	this.children  = []; //list of children embedded in the object
	this.props = new Object();
	this.parentObject  = null;
	this.animationStarted = false;
	this.isInPath = function(x, y){
		// this.render(); // we have to re-render for the canvas context to catch this as the latest rendering since
		//the latest path is what isPointInPath looks at;
		return this.world.context.isPointInPath(x,y);
	}
	this.setWorld = function(world){
		//this sets the world of the object
		this.world = world;
	}
	this.addEvent = function (eventType, eventResponseIfOnObject, eventResponseIfNotOnObject=function(){}){
		//this function is going to stand for as the event listeener function that is going to be doing the work of the normal event listener that
		//DOM elements listens to
		var obj = this;// trying to reassign the object to allow the eventlistener function to be able to see it as it is
		this.world.context.canvas.addEventListener(eventType, function(e){
			e.canvasTargetObject = obj;//setting the object to be the canvas target so that it can be refered to in the event response function
			if(obj.isInPath(e.clientX, e.clientY)){
				eventResponseIfOnObject(e);//fire the event response if the event occurred on the object
			}else{
				eventResponseIfNotOnObject(e);//fire the event response if the event did not occur on the object
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
			this.world.objects.push(obj);//also adding it to the list of objects in the scene
			obj.parentObject = this;//setting the parent object of the added object to this object
		}

	}
	this.removeChild = function(obj){
		//this method removes a child object from the parent
		var obj_index = this.children.indexOf(obj);//the index in the parent object children list
		var scene_index = this.world.objects.indexOf(obj);//the index in the in the scene's objects list
		if(0 <= obj_index){
			this.children.splice(obj_index, 1);//this removes the object from the list of children but does not change other setttings of the object
			this.world.objects.splice(scene_index, 1);// removing it from the scene too
			obj.parentObject = null;//setting the parent object property of the object being removed to null
		}//this does not throw an error if such object does not exist as child to the parent object
	}
	this.renderChildren =function(){
		this.children.forEach((obj) => {
			obj.render();
		})
	}
	this.implementAfterAddedToScene = function(){
		return null;//doing nothing at this point
	}
	this.move = function(movementType, direction, speed, easingFunction, length){
		//this moves an object in a specific way determined by a given path movement object
		//movementType, direction, speed and easingFunction must be specified
		movementType(this, direction, speed, easingFunction, length);

	}
	this.scale = function(arguments){
		//the function execution here for scaling
		//find out the mathematics behind the implementation of this and have it implemented
	}
	this.rotate = function(arguments){
		//the function execution comes here for rotation
		//find out the mathematics behind the implementation of this and have it implemented
	}
	this.translate = function(arguments){
		//the function execution comes here for translation
		//find out the mathematics behind the implementation of this and have it implemented
	}
	this.transform = function(arguments){
		//the function exectution comes here for transformation
		//find out the mathematics behind the implementation of this and have it implemented
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
function ButtonObject(x, y, width, height, fillRect = false){
	RectObject.call(this, x, y, width, height, fillRect);
	this.implementAfterAddedToScene = function(){
		var cursor = this.world.context.canvas.style.cursor;
		this.addEvent('mousemove', function(e){
			if(e.canvasTargetObject.isInPath(e.clientX, e.clientY)==true){
				e.target.style.cursor = 'pointer';
			}
		}, function(e){
			e.target.style.cursor = cursor;
		});
	}
}

function RectObject(x, y, width, height, fillRect = false){
	//this constructor function is for the rectangle object, this takes care of the operations that has to do with the objects in the canvas
	this.x = x, this.y = y, this.width = width, this.height = height, this.fillRect = fillRect;
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	this.render = function(){
		if(this.parentObject){
			//checking if the object has parent, so we could readjust to fit to the parent object
			this.x = this.xInitial + this.parentObject.x;
			this.y = this.yInitial + this.parentObject.y;
		}
		//this renders the object to the canvas
		Object.assign(this.world.context, this.world.canvasContextProperties);//making sure that the setting are reset to what it was originally
		Object.assign(this.world.context, this.props);
		if(this.world.camera){
			var xStart = (this.x/this.world.camera.perspective)-this.world.camera.x, yStart = (this.y/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			var width = this.width/this.world.camera.perspective, height = this.height/this.world.camera.perspective; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
		}else{
			var xStart = this.x, yStart = this.y;
			var width = this.width, height = this.height;
		}
		if(this.fillRect==true){
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
		//this.renderChildren();
		
	}
	SanimObject.call(this);
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
		//this.render(); // we have to re-render for the canvas context to catch this as the latest rendering since
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
	this.playAnimation = true;//setting if animation should play or not
	window.context = context;//testing and debuggiing purposes
	this.canvasContextProperties = {
		//this sets up the initial canvas properties and only this properties that one should changewhile making use of this framework.
		//this hack enables user of this framework to be able to apply canvas properties normally to the framework's objects
		globalAlpha: 1,
		globalCompositeOperation: "source-over",
		filter: "none",
		imageSmoothingEnabled: true,
		imageSmoothingQuality: "low",
		strokeStyle: "#a52a2a",
		fillStyle: "#ffffff",
		shadowOffsetX: 0,
		shadowOffsetY: 0,
		shadowBlur: 0,
		shadowColor: "rgba(0, 0, 0, 0)",
		lineWidth:1.0000000168623835e-16,
		lineCap: "butt",
		lineJoin: "miter",
		miterLimit: 10,
		lineDashOffset: 0,
		font: "10px sans-serif",
		textAlign: "start",
		textBaseline: "alphabetic",
		direction: "ltr"
	}

	this.addObject = function(object){
		//this adds an object to the scene
		object.world = this;
		this.objects.push(object);
		object.implementAfterAddedToScene();//this is a hack to implement somethings which demand that object be added to scene before implemented
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
		// this.render()//rerendering to adjust to the change in width and hieght of the canvas
	}
	this.cancelRequestFullscreen = function(){
		//this function cancels the fullscreen mode for the canvas
		this.context.canvas.cancelRequestFullscreen()// works on chrome but not all the browsers, so find the webkit versions for the other browers
		// this.render();
	}
	var world = this;
	function sceneAnimator(){
		window.requestAnimationFrame(sceneAnimator);
		if(world.playAnimation){
			world.render();//rendering the scene inside the animation frame
		}
	}
	this.sceneAnimator = sceneAnimator();
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

function ImageObject(filePath, x, y, width, height){
	//this is the function that will take care of playing a video in the canvas. 
	//the hack is that the video is placed on the canvas as an image so as the canvas rerenders the frames of the video is being displayed
	//while the audio of the video is being played by the browser as the video is element itself is hidden
	this.x = x, this.y = y, this.width = width, this.height = height;
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	this.filePath = filePath, this.media = new Image();
	this.media.src = filePath;
	this.render = function(){
		if(this.parentObject){
			//checking if the object has parent, so we could readjust to fit to the parent object
			this.x = this.xInitial + this.parentObject.x;
			this.y = this.yInitial + this.parentObject.y;
		}
		//this renders the object to the canvas
		Object.assign(this.world.context, this.world.canvasContextProperties);//making sure that the setting are reset to what it was originally
		Object.assign(this.world.context, this.props);
		if(this.world.camera){
			var xStart = (this.x/this.world.camera.perspective)-this.world.camera.x, yStart = (this.y/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			var width = this.width/this.world.camera.perspective, height = this.height/this.world.camera.perspective; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
		}else{
			var xStart = this.x, yStart = this.y;
			var width = this.width, height = this.height;
		}
		
		//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object 
		this.world.context.beginPath();
		this.world.context.moveTo(xStart, yStart);
		this.world.context.lineTo(xStart, yStart+height);
		this.world.context.lineTo(xStart+width, yStart+height);
		this.world.context.lineTo(xStart+width, yStart);
		this.world.context.closePath();
		this.world.context.stroke();
		//this.renderChildren(); this object should not have children

		this.world.context.drawImage(this.media, this.x, this.y, this.width, this.height)
		
	}
	this.setMedia=function(filePath){
		//this methods sets the path for the image
		this.filePath = filePath;
		this.media.src = filePath;
	}
	SanimObject.call(this);
}

function VideoObject(filePath, x, y, width, height, world){
	//this method is rendering video to the canvas
	//Note it is not adviceable to play a video with on the canvas, but this hack can work the wonder
	//also note that image can only be placed when the Scene has an animation frame
	this.x = x, this.y = y, this.width = width, this.height = height;
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	var video  = document.createElement('video');//creating the video element
	document.body.appendChild(video);//appending the video element to the DOM
	// var source = document.createElement('source');//creating the video source
	// video.appendChild(source);//this appends the source element to the video
	video.style.display = '';
	video.setAttribute('controls', 'true');
	//video.addChild
	video.setAttribute('src', filePath);//setting video file path in the source
	video.setAttribute('type', 'video/mp4');//setting the media file type
	//console.log(video, ' is the video')
	this.media = video;
	console.log(video.paused)
	//video.autoplay = true;
	//this.media.play();
	var self = this;
	window.video = this.media;
	this.world = world;
	this.world.video = this;
	this.renderVideo = function(){
		//self renders the object to the canvas
		Object.assign(self.world.context, self.world.canvasContextProperties);//making sure that the setting are reset to what it was originally
		Object.assign(self.world.context, self.props);
		if(self.world.camera){
			var xStart = (self.x/self.world.camera.perspective)-self.world.camera.x, yStart = (self.y/self.world.camera.perspective)-self.world.camera.y;//self is defines the starting poisiton of the path to be drawn
			var width = self.width/self.world.camera.perspective, height = self.height/self.world.camera.perspective; //self tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
		}else{
			var xStart = self.x, yStart = self.y;
			var width = self.width, height = self.height;
		}
		
		//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object 
		self.world.context.beginPath();
		self.world.context.moveTo(xStart, yStart);
		self.world.context.lineTo(xStart, yStart+height);
		self.world.context.lineTo(xStart+width, yStart+height);
		self.world.context.lineTo(xStart+width, yStart);
		self.world.context.closePath();
		self.world.context.stroke();
		//self.renderChildren(); self object should not have children
		self.world.context.drawImage(self.media, self.x, self.y, self.width, self.height)
		if(self.media.paused != true){
			console.log(self.x, self.y, self.width, self.height, self.world.context, ' playing video')
			requestAnimationFrame(function(){self.renderVideo()}, 20);
		}
		
		
	}
	this.media.addEventListener('play', function(e){
		self.renderVideo()
	})
	SanimObject.call(this);
	this.render = function(){}
}