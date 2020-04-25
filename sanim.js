function fitCanvasToScreen(ctx, color){
	//this sets the canvas to fill the width of the screen
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.canvas.style.backgroundColor = color;
	ctx.canvas.parentElement.style.overflow = 'hidden';
	//ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
}
function Animation(world){
	//this object has all the animations types as its methods
	//the animation object sets the scene to be continually rerendering by creating a javascript animation frame that continually rerenders it
	this.speedReference = 0.01;
	window.sanimKitSpeedReference = this.speedReference;//setting the speed reference number gloabally;
	this.animationInstances = new Array();
	
	this.world = world;//setting the scene
	this.animationOn = false;//property that will be used to put out animation and allow another object to start animation
	this.asynchronous = true;//this allows the animations to occur at same time for all the object and not one at a time, then the other
	world.animationObjects.push(this)//pushing the animation to the scene so that it can take effect
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
	this.setSpeedReference = function(value){
		//this method sets the speed animation speed reference number
		this.speedReference = value;
		window.sanimKitSpeedReference = this.speedReference;//setting it globally as well
	}

	this.linear = function(obj, direction, speed, easingFunction, length){
		//this moves the object linearly towards to the right

		var animationInstance = new AnimationInstance({
			speed:speed,
			direction:direction,
			distanceControl:0,//distance control variable to check when we have reached the specified speed
			initialSpeed:speed,
			easingControl:1, 
			counter: 1,//this is for applying easing to the animation;
			length: length,
			obj:obj,
			world:obj.world,
			easingFunction:easingFunction,
			execute: function(){
					this.speed = this.initialSpeed*window.sanimKitSpeedReference*this.easingControl;//setting the speed with reference to the speed reference of the Animation object
					//by placing the above line of code inside the animate function instead of above it, it means that changing the world speed reference affects
					//the speed of the object while the animation is still ongoing
					var execFunc = this.easingFunction(this.counter, this.easingControl);//updating the easing controller to apply easing effect
					this.counter = execFunc[0], this.easingControl = execFunc[1];
					if(this.length){
						if(this.distanceControl >= this.length){
							if(this.direction=='LEFT'){
								this.obj.x=this.obj.xInitial - this.length;
							}else if(this.direction=='RIGHT'){
								this.obj.x=this.obj.xInitial + this.length;
							}else if(this.direction=='UP'){
								this.obj.y=this.obj.yInitial - this.length;
							}else if(this.direction=='DOWN'){
								this.obj.y=this.obj.yInitial + this.length;
							}
						}
						this.distanceControl += this.speed;
					}
					if(this.direction=='LEFT'){
						this.obj.x-=this.speed;
					}else if(this.direction=='RIGHT'){
						this.obj.x+=this.speed;
					}else if(this.direction=='UP'){
						this.obj.y-=this.speed;
					}else if(direction=='DOWN'){
						this.obj.y+=this.speed;
					}
					//obj.world.render();
			}, 
			animationStatus: function(){
				if(this.length){
					if(this.distanceControl >= this.length){
						return false;//putting off the animationn for another animation to take place
					}else{
						return true;
					}
					//this.distanceControl += this.speed;
				}else{
					return true;
				}
			}
		});
		self.addAnimationInstance(animationInstance);//adding the animation instance to the animation object
		animationInstance.reset= function(param){
			//this resets the animation instance so that the animation could take place again;
			this.pauseAnimation = false;
			this.animationStarted = false;
			Object.assign(this.obj, {
				distanceControl:0,
				easingControl:1, 
				counter: 1
			});
			if(param){
				Object.assign(this.obj, param);
				if(param.speed){
					this.obj.initialSpeed = param.speed;
				}
				if(param.obj){
					this.obj.world = param.obj.world;
				}
			}
			
		}
		return animationInstance;
	}

	this.animateInstances = function(){
		//this method executes a function as long as the animation frame is on
		for(var i=0; this.animationInstances.length>i; i++){
			var instance = this.animationInstances[i];
			if(instance.obj.world.playAnimation && (this.animationOn==false || instance.animationStarted==true || this.asynchronous==true) && instance.pauseAnimation==false){
				instance.animationStarted=true;
				this.animationOn = true;//toggling the state of the animation object animation check
				instance.obj.execute();//executing the function;
				if(instance.obj.animationStatus()==false){
					//window.cancelAnimationFrame(animationFrame);
					this.animationOn=false;
					instance.pauseAnimation = true;
					instance.animationStarted = false;
					var instanceIndex = this.animationInstances.indexOf(instance);
					this.animationInstances.splice(instanceIndex, 1);//removing the instance from the list to populating the list with unecessary intances
					instance.added = false;//putting that the instance is no longer added since it has been removed from the animation object
					instance.onEnded();//running something once the instance is finishe
					break;
				}
			}
		}
	}

	
	this.addAnimationInstance = function(animationInstance){
		if(this.animationInstances.indexOf(animationInstance) < 0){
			animationInstance.animationObject = this;
			animationInstance.added = true;
			this.animationInstances.push(animationInstance);
		}else{
			throw('You are attempting to add an already existing animation instance');//making the developer aware of the mistake
		}
	}
	this.animationSequence = function(sequence){
		//this method executes an animation sequence. what this means is that it executes animation one after the other as specified by the user
		//for(seq in sequence)
	}
}
function AnimationInstance(obj){
	//this creates an animation instance to allow control of the animation timeline
	this.obj = null;//note that this object could as well be an animation instance to
	//this.repeatCheck = false;
	if(obj != null){
		this.obj = obj;
		obj.animationInstance = this;//setting the animation instance of the object to be this
		this.pauseAnimation=false;//setting that animation on that instance is not paused by default
	}
	this.animationStarted = false;//setting that the animation have not started on that instance by default
	this.added = false;
	this.onEnded = function(){}//this is what happens when the animation finishes, i.e for this animation instance
	this.reset= function(param){
		//this resets the animation instance so that the animation could take place again;
		this.pauseAnimation = false;
		this.animationStarted = false;
		if(param){
			Object.assign(this.obj, param);
		}
		
	}
	this.repeat = function(param){
		var self = this;
		function checkStatus(){
			if(self.added == true){
				var checkingFrame = window.requestAnimationFrame(checkStatus);//this animation frame keeps checking to know whent the instance has been removed from animation so as to trigger for it to be repeated
			}else{
				self.reset(param);
				if(self.animationObject){
					self.animationObject.addAnimationInstance(self);
					if(checkingFrame){
						window.cancelAnimationFrame(checkingFrame);
					}
				}
			}
		}
		checkStatus();
	}
}
function SanimObject(){
	this.lineWidth = 0.0000000000000001;//setting the lineWidth to a very low value so that the lines does not show by default
	this.children  = []; //list of children embedded in the object
	this.props = new Object();
	this.parentObject  = null;
	this.animationStarted = false;
	this.pauseAnimation = false;//this property can be used to pause all animation on an object
	this.translationMatrix = [0,0];
	this.initialTransformationMatrix = [0, 0];//setting the initial transformation matrix
	this.skewMatrix = [0,0];
	this.scaleMatrix = [1, 1];
	this.transformationMatrix = [
								1, 0, 0, 
								1, 0, 0
								];
	this.rotationAngle = 0;
	this.isInPath = function(x, y){
		this.render(); // we have to re-render for the canvas context to catch this as the latest rendering since
		//the latest path is what isPointInPath looks at;
		var status =  this.world.context.isPointInPath(x,y);
		this.world.render();
		return status;
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
		return movementType(this, direction, speed, easingFunction, length);
		
	}
	this.applyTransformation = function(){
		//this method applies the transformation properties to the canvas
		this.world.context.save()//saving the state of the canvas
		var x = this.renderingX + 0.5*this.renderingWidth;//trying to make the transformation take place at the center of the object
		var y = this.renderingY + 0.5*this.renderingHeight;
		this.world.context.translate(x, y);//changing transformation orgin to the center of the object
		this.world.context.transform(...this.transformationMatrix);//applying the transformation
		this.world.context.transform(1, ...this.skewMatrix, 1, 0, 0);//transformation for skewing
		this.world.context.rotate(this.rotationAngle);//applying the rotation
		this.world.context.scale(...this.scaleMatrix);//applying the scaling transformation
		this.world.context.translate(...this.translationMatrix);
		this.world.context.translate(-x, -y);//translating back to the origin
	}

	this.removeTransformation = function(){
		//this method removes the transformation that has been applied on the canvas so that other objects in the canvas will not be affected
		//this.world.context.rotate(-this.rotationAngle);//removing the rotation by setting it to the default rotation value;
		this.world.context.restore();//restoring the state of the canvas
	}
	this.scale = function(x, y){
		//the function execution here for scaling
		//find out the mathematics behind the implementation of this and have it implemented
		this.scaleMatrix[0] *= x;
		this.scaleMatrix[1] *= y;
	}
	this.rotate = function(angle){
		//the function execution comes here for rotation
		//find out the mathematics behind the implementation of this and have it implemented
		this.rotationAngle += (Math.PI/180)*angle;
	}
	this.translate = function(x, y){
		//the function execution comes here for translation
		//find out the mathematics behind the implementation of this and have it implemented
		this.translationMatrix[0] += x;
		this.translationMatrix[1] += y;
	}
	this.skew= function(angleX, angleY){
		//this skews the object
		this.skewMatrix[0] += (Math.PI/180)*angleX;
		this.skewMatrix[1] += (Math.PI/180)*angleY;
	}
	this.transform = function(transformationMatrix){
		//the function exectution comes here for transformation
		//find out the mathematics behind the implementation of this and have it implemented
		if(this.transformationMatrix.length == transformationMatrix.length){
			this.transformationMatrix[0] *= transformationMatrix[0];
			this.transformationMatrix[1] += transformationMatrix[1];
			this.transformationMatrix[2] += transformationMatrix[2];
			this.transformationMatrix[3] *= transformationMatrix[3];
			this.transformationMatrix[4] += transformationMatrix[4];
			this.transformationMatrix[5] += transformationMatrix[5];
			/*
			  the 2D transformation matrix is of this form: | a   c | | x |
															|       | |   |
															| b   d | | y |

				where the transformationParameters that should be provided is of the form [a, b, c, d, translationX, translationY]
			*/
		}else{
			throw('the transformation matrix provided is not in the correct dimmension or length');
		}
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
		if(this.world && this.coupleToCamera === true && this.world.camera != null){
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
				e.target.style.cursor = 'pointer';
		}, function(e){
			e.target.style.cursor = cursor;
		});
	}
}
function TextObject(text, x, y, fillText= false){
	//this is a text object
	//note that at this point camera features does not affect the text properties like width and height
	SanimObject.call(this);//referencing the sanim object
	this.x = x, this.y = y, this.fillText = fillText;
	this.fillBox = false;
	this.width = 220;
	this.height = 10;
	this.renderingWidth = this.width;
	this.renderingHeight = this.height;
	this.text = text;
	this.textMeasurement = null;
	this.boxProps = {paddingX:0, paddingY:0};
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	this.render = function(){
		Object.assign(this.world.context, this.world.canvasContextProperties);//making sure that the setting are reset to what it was originally
		Object.assign(this.world.context, this.props);
		this.textMeasurement = this.world.context.measureText(this.text);
		this.width = this.textMeasurement.width;
		if(this.props.font){
			//trying the extract the width property of the text from the font information that was given
			var str = this.props.font;
			this.height = parseFloat(str.substring(str.search(/[0-9]+px/), str.search(/[0-9]px/)+1))*(36/50);// this finds extracts the width of the text from the text
		}
		if(this.parentObject){
			//checking if the object has parent, so we could readjust to fit to the parent object
			this.x = this.xInitial + this.parentObject.x;
			this.y = this.yInitial + this.parentObject.y;
		}
		if(this.world.camera){
			 this.renderingX = (this.x/this.world.camera.perspective)-this.world.camera.x, this.renderingY = (this.y/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			this.renderingWidth = (this.width+this.boxProps.paddingX*2)/this.world.camera.perspective, this.renderingHeight = (this.height+this.boxProps.paddingY*2)/this.world.camera.perspective; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
		}else{
			this.renderingX = this.x, this.renderingY = this.y;
			this.renderingWidth = this.width + this.boxProps.paddingX*2, this.renderingHeight = this.height+this.boxProps.paddingY*2;
		}
		Object.assign(this.world.context, this.world.canvasContextProperties);//reseting the change so that the changes for the text box itself could be applied
		Object.assign(this.world.context, this.boxProps);//assigning the textbox properties
		this.applyTransformation();//applyiing transformation properties
		if(this.fillBox==true){
			this.world.context.fillRect(this.renderingX, this.renderingY, this.renderingWidth, this.renderingHeight);
		}
		//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object 
		this.world.context.beginPath();
		this.world.context.moveTo(this.renderingX, this.renderingY);
		this.world.context.lineTo(this.renderingX, this.renderingY+this.renderingHeight);
		this.world.context.lineTo(this.renderingX+this.renderingWidth, this.renderingY+this.renderingHeight);
		this.world.context.lineTo(this.renderingX+this.renderingWidth, this.renderingY);
		this.world.context.closePath();
		this.world.context.stroke();
		Object.assign(this.world.context, this.world.canvasContextProperties);//reseting again to apply text properties
		Object.assign(this.world.context, this.props);//applying textproperties
		this.renderText();
		this.removeTransformation();//removing setted transformation properties so it does not affect the next object

	}
	this.renderText = function(){
		//this method renders the actual text to the canvas
		if(this.fillText==true){
			this.world.context.fillText(this.text, this.renderingX+this.boxProps.paddingX, this.renderingY+this.renderingHeight-this.boxProps.paddingY);
		}
		this.world.context.strokeText(this.text, this.renderingX+this.boxProps.paddingX, this.renderingY+this.renderingHeight-this.boxProps.paddingY);
	}
}
function RectObject(x, y, width, height, fillRect = false){
	//this constructor function is for the rectangle object, this takes care of the operations that has to do with the objects in the canvas
	this.x = x, this.y = y, this.width = width, this.height = height, this.fillRect = fillRect;
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	this.renderingX = this.x, this.renderingY = this.y, this.renderingWidth = this.width, this.renderingHeight= this.height;
	this.render = function(){
		//this renders the object to the canvas
		Object.assign(this.world.context, this.world.canvasContextProperties);//making sure that the setting are reset to what it was originally
		Object.assign(this.world.context, this.props);
		if(this.parentObject){
			//checking if the object has parent, so we could readjust to fit to the parent object
			this.x = this.xInitial + this.parentObject.x;
			this.y = this.yInitial + this.parentObject.y;
		}
		if(this.world.camera){
			 this.renderingX = (this.x/this.world.camera.perspective)-this.world.camera.x, this.renderingY = (this.y/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			this.renderingWidth = this.width/this.world.camera.perspective, this.renderingHeight = this.height/this.world.camera.perspective; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
		}else{
			this.renderingX = this.x, this.renderingY = this.y;
			this.renderingWidth = this.width, this.renderingHeight = this.height;
		}
		this.applyTransformation();
		if(this.fillRect==true){
			this.world.context.fillRect(this.renderingX, this.renderingY, this.renderingWidth, this.renderingHeight);
		}
		//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object 
		this.world.context.beginPath();
		this.world.context.moveTo(this.renderingX, this.renderingY);
		this.world.context.lineTo(this.renderingX, this.renderingY+this.renderingHeight);
		this.world.context.lineTo(this.renderingX+this.renderingWidth, this.renderingY+this.renderingHeight);
		this.world.context.lineTo(this.renderingX+this.renderingWidth, this.renderingY);
		this.world.context.closePath();
		this.world.context.stroke();
		//this.renderChildren();
		this.removeTransformation();//removing setted transformation properties so it does not affect the next object
		
	}
	SanimObject.call(this);
}

function PathObject(x, y, paths, closePath=true, fillPath=false){
	/*
	This is the definition for a canvas path object.
	This object gives more functionality to the canvas path, it literally make the path an object instead of just a path.
	*/
	this.x = x, this.y = y, this.fillPath = fillPath, this.closePath = this.closePath;
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	this.paths = paths;
	this.initialPaths = this.paths;
	this.renderingX = this.x, this.renderingY = this.y, this.renderingPaths = this.paths
	this.render = function(){
		Object.assign(this.world.context, this.world.canvasContextProperties);//making sure that the setting are reset to what it was originally
		Object.assign(this.world.context, this.props);
		if(this.parentObject){
			//checking if the object has parent, so we could readjust to fit to the parent object
			this.x = this.xInitial + this.parentObject.x;
			this.y = this.yInitial + this.parentObject.y;
		}
		if(this.world.camera){
			this.renderingX = (this.x/this.world.camera.perspective)-this.world.camera.x, this.renderingY = (this.y/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
		}else{
			this.renderingX = this.x, this.renderingY = this.y;
			
		}
		this.applyTransformation();
		this.world.context.beginPath();
		this.world.context.moveTo(this.x, this.y);
		for(var i = 0;i<this.paths.length;i++){
			if(this.parentObject){
				if(this.paths[i].pathType == 'lineTo'){
					this.paths[i].params[0] = this.initialPaths[i].params[0] + this.parentObject.x;
					this.paths[i].params[1] = this.initialPaths[i].params[1] + this.parentObject.y;
				}else if(this.paths[i].pathType == 'arcTo'){
					this.paths[i].params[0] = this.initialPaths[i].params[0] + this.parentObject.x;
					this.paths[i].params[1] = this.initialPaths[i].params[1] + this.parentObject.y;
					this.paths[i].params[2] = this.initialPaths[i].params[2] + this.parentObject.x;
					this.paths[i].params[3] = this.initialPaths[i].params[3] + this.parentObject.y;
				}else if(this.paths[i].pathType == 'bezierCurveTo'){
					this.paths[i].params[0] = this.initialPaths[i].params[0] + this.parentObject.x;
					this.paths[i].params[1] = this.initialPaths[i].params[1] + this.parentObject.y;
					this.paths[i].params[2] = this.initialPaths[i].params[2] + this.parentObject.x;
					this.paths[i].params[3] = this.initialPaths[i].params[3] + this.parentObject.y;
					this.paths[i].params[4] = this.initialPaths[i].params[4] + this.parentObject.x;
					this.paths[i].params[5] = this.initialPaths[i].params[5] + this.parentObject.y;
				}else if(this.paths[i].pathType == 'quadraticCurveTo'){
					this.paths[i].params[0] = this.initialPaths[i].params[0] + this.parentObject.x;
					this.paths[i].params[1] = this.initialPaths[i].params[1] + this.parentObject.y;
					this.paths[i].params[2] = this.initialPaths[i].params[2] + this.parentObject.x;
					this.paths[i].params[3] = this.initialPaths[i].params[3] + this.parentObject.y;
				}else if(this.paths[i].pathType == 'arc'){
					this.paths[i].params[0] = this.initialPaths[i].params[0] + this.parentObject.x;
					this.paths[i].params[1] = this.initialPaths[i].params[1] + this.parentObject.y;
				}
			}
			if(this.world.camera){
				for(var j=0; j<this.renderingPaths[i].params.length; j++){
					this.renderingPaths[i].params[j] = this.renderingPaths[i].params[j]/this.world.camera.perspective;
				}
				if(this.paths[i].pathType == 'lineTo'){
					this.renderingPaths[i].params[0] = this.renderingPaths[i].params[0]/this.world.camera.perspective;
					this.renderingPaths[i].params[1] = this.renderingPaths[i].params[1]/this.world.camera.perspective;
				}else if(this.paths[i].pathType == 'arcTo'){
					for(var j=0; j<renderingPaths[i].params.length-2; j++){
						this.renderingPaths[i].params[j] = this.renderingPaths[i].params[j]/this.world.camera.perspective;
					}/*below is an alternative*/
					// this.renderingPaths[i].params[0] = this.renderingPaths[i].params[0]/this.world.camera.perspective;
					// this.renderingPaths[i].params[1] = this.renderingPaths[i].params[1]/this.world.camera.perspective;
					// this.renderingPaths[i].params[2] = this.renderingPaths[i].params[2]/this.world.camera.perspective;
					// this.renderingPaths[i].params[3] = this.renderingPaths[i].params[3]/this.world.camera.perspective;
				}else if(this.paths[i].pathType == 'bezierCurveTo'){
					for(var j=0; j<renderingPaths[i].params.length; j++){
						this.renderingPaths[i].params[j] = this.renderingPaths[i].params[j]/this.world.camera.perspective;
					}/*below is an alternative*/
					// this.renderingPaths[i].params[0] = this.renderingPaths[i].params[0]/this.world.camera.perspective;
					// this.renderingPaths[i].params[1] = this.renderingPaths[i].params[1]/this.world.camera.perspective;
					// this.renderingPaths[i].params[2] = this.renderingPaths[i].params[2]/this.world.camera.perspective;
					// this.renderingPaths[i].params[3] = this.renderingPaths[i].params[3]/this.world.camera.perspective;
					// this.renderingPaths[i].params[4] = this.renderingPaths[i].params[4]/this.world.camera.perspective;
					// this.renderingPaths[i].params[5] = this.renderingPaths[i].params[5]/this.world.camera.perspective;
				}else if(this.paths[i].pathType == 'quadraticCurveTo'){
					for(var j=0; j<renderingPaths[i].params.length; j++){
						this.renderingPaths[i].params[j] = this.renderingPaths[i].params[j]/this.world.camera.perspective;
					}/*below is an alternative*/
					// this.renderingPaths[i].params[0] = this.renderingPaths[i].params[0]/this.world.camera.perspective;
					// this.renderingPaths[i].params[1] = this.renderingPaths[i].params[1]/this.world.camera.perspective;
					// this.renderingPaths[i].params[2] = this.renderingPaths[i].params[2]/this.world.camera.perspective;
					// this.renderingPaths[i].params[3] = this.renderingPaths[i].params[3]/this.world.camera.perspective;
				}else if(this.paths[i].pathType == 'arc'){
					this.renderingPaths[i].params[0] = this.renderingPaths[i].params[0]/this.world.camera.perspective;
					this.renderingPaths[i].params[1] = this.renderingPaths[i].params[1]/this.world.camera.perspective;
				}
			}else{
				this.renderingPaths[i].params = new Array(...this.paths[i].params);
			}
			if(this.paths[i].pathType == 'lineTo'){
				this.world.context.lineTo(...this.paths[i].params);
			}else if(this.paths[i].pathType == 'arcTo'){
				this.world.context.arcTo(...this.paths[i].params);
			}else if(this.paths[i].pathType == 'bezierCurveTo'){
				this.world.context.bezierCurveTo(...this.paths[i].params);
			}else if(this.paths[i].pathType == 'quadraticCurveTo'){
				this.world.context.quadraticCurveTo(...this.paths[i].params);
			}else if(this.paths[i].pathType == 'arc'){
				this.world.context.arc(...this.paths[i].params);
			}
		}
		if(this.closePath==true){
			this.world.context.closePath();

		}
		this.world.context.stroke();
		if(this.fillPath==true){
			this.world.context.fill()
		}
	}
	SanimObject.call(this);

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
	this.color = "white";
	this.camera = null; // holds the camera added to the world
	this.player = null; // holds the player in the scene if exist
	this.lights = new Array(); // holds the lights added to the scene
	this.objects = new Array(); //holds the objects added to the scene
	this.playAnimation = true;//setting if animation should play or not
	window.context = context;//testing and debuggiing purposes
	this.animationObjects = new Array();
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
		for(var i=0; this.animationObjects.length>i; i++){
			var animation = this.animationObjects[i];
			animation.animateInstances();//making the animations that have been added to the scene
		}
		for(var i=0; this.objects.length>i; i++){
			var obj = this.objects[i];
			obj.render();
		}
	}
	this.requestFullscreen = function(){
		//this function requests full screen for the whole canvas
		var canvas = this.context.canvas.parentElement; //targetting the parent element of the canvas
		if (canvas.requestFullscreen) {
		    canvas.requestFullscreen();
		} else if (canvas.mozRequestFullScreen) { /* Firefox */
		    canvas.mozRequestFullScreen();
		} else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		    canvas.webkitRequestFullscreen();
		} else if (canvas.msRequestFullscreen) { /* IE/Edge */
		    canvas.msRequestFullscreen();
		}
	}
	this.cancelRequestFullscreen = function(){
		if (document.exitFullscreen) {
		    document.exitFullscreen();
		} else if (document.mozCancelFullScreen) { /* Firefox */
		    document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
		    document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) { /* IE/Edge */
		    document.msExitFullscreen();
		}
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
	this.renderingX = this.x, this.renderingY = this.y, this.renderingWidth = this.width, this.renderingHeight= this.height;
	this.filePath = filePath, this.media = new Image();
	this.media.src = filePath;
	this.render = function(){
		//this renders the object to the canvas
		Object.assign(this.world.context, this.world.canvasContextProperties);//making sure that the setting are reset to what it was originally
		Object.assign(this.world.context, this.props);
		if(this.parentObject){
			//checking if the object has parent, so we could readjust to fit to the parent object
			this.x = this.xInitial + this.parentObject.x;
			this.y = this.yInitial + this.parentObject.y;
		}
		if(this.world.camera){
			 this.renderingX = (this.x/this.world.camera.perspective)-this.world.camera.x, this.renderingY = (this.y/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			this.renderingWidth = this.width/this.world.camera.perspective, this.renderingHeight = this.height/this.world.camera.perspective; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
		}else{
			this.renderingX = this.x, this.renderingY = this.y;
			this.renderingWidth = this.width, this.renderingHeight = this.height;
		}
		this.applyTransformation();
		//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object
		this.world.context.drawImage(this.media, this.renderingX, this.renderingY, this.renderingWidth, this.renderingHeight)
		this.world.context.beginPath();
		this.world.context.moveTo(this.renderingX, this.renderingY);
		this.world.context.lineTo(this.renderingX, this.renderingY+this.renderingHeight);
		this.world.context.lineTo(this.renderingX+this.renderingWidth, this.renderingY+this.renderingHeight);
		this.world.context.lineTo(this.renderingX+this.renderingWidth, this.renderingY);
		this.world.context.closePath();
		this.world.context.stroke();
		//this.renderChildren();
		this.removeTransformation();//removing setted transformation properties so it does not affect the next object

		
	}
	this.setMedia=function(filePath){
		//this methods sets the path for the image
		this.filePath = filePath;
		this.media.src = filePath;
	}
	SanimObject.call(this);
}

function VideoObject(filePath, x, y, width, height){
	//this method is rendering video to the canvas
	//Note it is not adviceable to play a video with on the canvas, but this hack can work the wonder
	//also note that image can only be placed when the Scene has an animation frame
	ImageObject.call(this, filePath, x, y, width, height);
	var video  = document.createElement('video');//creating the video element
	document.body.appendChild(video);//appending the video element to the DOM
	video.style.display = 'none';
	video.setAttribute('src', filePath);//setting video file path in the source
	this.media = video;
	var self = this;
	window.video = this.media;
}

function AudioObject(filePath){
	var audio = document.createElement('audio');
	audio.setAttribute('src', filePath);
	document.body.appendChild(audio);
	audio.style.display = 'none';
	this.media = audio;
}

function Integration(element, x, y, width, height){
	//this allows you integrate a new drawing canvas to an existing drawing canvas to be used with sanim or any other canvas drawing library
	SanimObject.call(this);
	this.x = x, this.y = y, this.width = width, this.height = height,
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	this.renderingX = this.x, this.renderingY = this.y, this.renderingWidth = this.width, this.renderingHeight= this.height;
	this.element = element;//stating the context property of the embed
	this.scaleMatrix = [1, 1];
	console.log(this.element.style)
	this.translationMatrix = [0, 0];
	this.render = function(){
		Object.assign(this.world.context, this.world.canvasContextProperties);//making sure that the setting are reset to what it was originally
		Object.assign(this.world.context, this.props);
		if(this.parentObject){
			//checking if the object has parent, so we could readjust to fit to the parent object
			this.x = this.xInitial + this.parentObject.x;
			this.y = this.yInitial + this.parentObject.y;
		}
		if(this.world.camera){
			 this.renderingX = (this.x/this.world.camera.perspective)-this.world.camera.x, this.renderingY = (this.y/this.world.camera.perspective)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			this.renderingWidth = this.width/this.world.camera.perspective, this.renderingHeight = this.height/this.world.camera.perspective; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's perspective
		}else{
			this.renderingX = this.x, this.renderingY = this.y;
			this.renderingWidth = this.width, this.height = this.renderingHeight;
		}
		this.applyTransformation();
		this.element.style.width=this.renderingWidth + 'px';
		this.element.style.height = this.renderingHeight + 'px';
		this.element.style.position = 'absolute';
		this.element.style.top = this.renderingY + 'px';
		this.element.style.left = this.renderingX + 'px';
		// if(this.renderingWidth + this.renderingX > this.world.context.canvas.width || this.renderingHeight + this.renderingY > this.world.context.canvas.height){
		// 	//trying to hide the element if the specified height, width relative to the starting positions is greater than the scenes canvas position
		// 	this.element.style.display = 'none';
		// }
	}
	
	this.applyTransformation = function(){
		//this applies the transformation on this integrated element
		var angle = Math.round((this.rotationAngle/Math.PI) * 180);
		this.element.style.transform = 'matrix('+this.transformationMatrix[0]+', '+this.transformationMatrix[1] +', ' + this.transformationMatrix[2]+ ', ' + this.transformationMatrix[3]+', ' + this.transformationMatrix[4]+', '+ this.transformationMatrix[5]+')';
	}
	delete this.rotate;
	delete this.skew;
	delete this.scale;
	delete this.removeTransformation;
	delete this.translate;
	delete this.translationMatrix;
	delete this.scaleMatrix;
	delete this.rotationMatrix;
	delete this.skewMatrix;
	delete this.rotationAngle;
}