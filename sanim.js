function fitCanvasToScreen(ctx){
	//this sets the canvas to fill the width of the screen
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.canvas.style.left = "0px";
	ctx.canvas.style.right = "0px";
	ctx.canvas.style.top = "0px";
	ctx.canvas.style.bottom = "0px";
	ctx.canvas.parentElement.style.overflow = 'hidden';
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
	this.fadeObject = function(obj, direction, speed, easingFunction){
		//this is an animation to wipe an object
		// var initial_opacity = obj.props.globalAlpha;
		if(direction == 'IN'){
			obj.props.globalAlpha = 0;
		}else if(direction=='OUT'){
			obj.props.globalAlpha = 1;
		}
		// if(initial_opacity==undefined){
		// 	initial_opacity =1;
		// }
		var animationInstance = new AnimationInstance({
			speed:speed,
			direction:direction,
			opacityControl:0,//distance control variable to check when we have reached the specified speed
			initialSpeed:speed,
			easingControl:1, 
			counter: 1,//this is for applying easing to the animation;
			opacity: 1,
			obj:obj,
			world:obj.world,
			easingFunction:easingFunction,
			execute: function(){
					this.speed = this.initialSpeed*window.sanimKitSpeedReference*this.easingControl;//setting the speed with reference to the speed reference of the Animation object
					//by placing the above line of code inside the animate function instead of above it, it means that changing the world speed reference affects
					//the speed of the object while the animation is still ongoing
					var execFunc = this.easingFunction(this.counter, this.easingControl);//updating the easing controller to apply easing effect
					this.counter = execFunc[0], this.easingControl = execFunc[1];
					if(this.opacity){
						if(this.direction=='IN'){
							if(this.opacityControl >= this.opacity){
								this.obj.props.globalAlpha=this.opacity;
							}
							this.opacityControl += this.speed;
						}else if(this.direction=='OUT'){
							if(this.opacityControl <= this.opacity){
								this.obj.props.globalAlpha=this.opacity;
							}
							this.opacityControl -= this.speed;
						}
					}
					if(this.direction=='IN'){
						this.obj.props.globalAlpha+=this.speed;
					}else if(this.direction=='OUT'){
						this.obj.props.globalAlpha-=this.speed;
					}
					//obj.world.render();
			}, 
			animationStatus: function(){
				if(this.direction=='IN'){
					if(this.opacityControl >= this.opacity){
						return false;
					}else{
						return true;
					}
				}else if(this.direction=='OUT'){
					if(this.opacityControl <= this.opacity){
						return false;
					}else{
						return true;
					}
				}
			},
		});
		self.addAnimationInstance(animationInstance);//adding the animation instance to the animation object
		animationInstance.reset= function(param){
			//this resets the animation instance so that the animation could take place again;
			this.pauseAnimation = false;
			this.animationStarted = false;
			Object.assign(this.obj, {
				opacityControl:0,
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
		animationInstance.executeOnStartOnly = function(){
			//changing the execute on start only so as to make animation repeat iniitial executions possible from here possible from here
			if(this.obj.direction == 'IN'){
				this.obj.obj.props.globalAlpha = 0;
				this.obj.opacity =1;
			}else if(this.obj.direction == 'OUT'){
				this.obj.obj.props.globalAlpha = 1;
				this.obj.opacity =0;
			}
			this.obj.executeOnStartOnly();
		}
		return animationInstance;

	}

	this.sleep = function(time){
		//this method sleeps the animation with the animation object for a specified period of time in milliseconds
		//this sleep is not windows animation frame based so will not pause while the user is not on tab on the webbrowser
		var sleep = new AnimationInstance({
			world:this.world,
			status:true,
			time:time,
			animationStatus: function(){
				return this.status;
			},
			executeOnStartOnly: function(){
				var sleeper = this;
				window.setTimeout(function(){sleeper.status=false;}, sleeper.time);
			}
		});
		this.addAnimationInstance(sleep);
		return sleep;
	}
	this.setInterval = function(params){
		//this method set an interval for a loop
		var animInstance = new AnimationInstance(Object.assign({
          isNotSet:true,
          delay:100,
          status:true,
          world:this.world,
          loop: function(){
          	//the method the user needs to define at most are the methods that do the looping which will replace this one
          	//and the method that checks the status to know when to clear the set interval
          },
          execute:function(){
            var self = this;
            if(this.isNotSet){
              this.interval = setInterval(() => {
                if(self.world.playAnimation==false || self.animationStatus==false){
                	self.status = false;//making sure that it goes off the list of animations to be performed
                    clearInterval(self.interval);
                }else{
                  self.loop();
                }
              }, self.delay);
              this.isNotSet = false;
            } 
          },
          animationStatus: function(){
          	return this.status;//this method should not be overwritten, instead a functionality that makes status to be set to false
          	//should be implemented in the loop method 
          }
        }, params)); 
        this.addAnimationInstance(animInstance);
        return animInstance;
	}
	this.clearInterval = function(animInstance){
		//this method clears the set interval if the user wishe to clear the interval
		animInstance.obj.status = false;//and that is all that is needed to clear it, finished
	}

	this.animateInstance = function(instance){
		//this method animates a single instance
		if(instance.animationStarted==false){
			//instance.obj.executeOnStartOnly();
			instance.executeOnStartOnly();
		}
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
			instance.onEnded();//running something once the instance is finished
		}
	}
	this.animateInstances = function(){
		//this method executes a function as long as the animation frame is on
		if(this.asynchronous===true || this.animationInstances.length<=0){
			for(var i=0; this.animationInstances.length>i; i++){
				var instance = this.animationInstances[i];
				if((this.animationOn==false || instance.animationStarted==true || this.asynchronous==true) && instance.pauseAnimation==false){
					this.animateInstance(instance);//animating the instance;
					if(instance.obj.animationStatus()==false){
						break;//breaking the loop since an item in the list of animation instances is being removed, check animateInstance method
					}
				}
			}
		}else{
			var instance = this.animationInstances[0];
			if((this.animationOn==false || instance.animationStarted==true || this.asynchronous==true) && instance.pauseAnimation==false){
				this.animateInstance(instance);
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
	}else{
		throw('A JavaScript object must be provided to create an animation instance');
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
	this.repeat = function(param){//to repeat an animation instance you have to provide the parameters to reset in other to repeat the animation
		/*
		What we need to do is reset the parameters of the instance and then add it to the list of instances, but the instance and it's obj property is mutable
		so we need to make a copy of the  instance and it's obj property so that when we reset the new instance it would not affect the one that is already running
		*/
		var newInstance = new Object();
		Object.assign(newInstance, this);
		var newObj = new Object();
		Object.assign(newObj, this.obj);
		newInstance.obj=newObj;
		newInstance.reset(param);
		this.animationObject.addAnimationInstance(newInstance);
	}
	this.executeOnStartOnly = function(){
		//this gets done the momement the animation instance starts
		this.obj.executeOnStartOnly();
	}
	if(this.obj.executeOnStartOnly==undefined){
		this.obj.executeOnStartOnly = function(){};//empty function
	}
	if(this.obj.execute==undefined){
		this.obj.execute = function(){};//empty function
	}
	if(this.obj.animationStatus==undefined){
		this.obj.animationStatus = function(){return true};
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
	this.transformationOrigin = [0, 0];//this x and y rendering origin of the object
	this.renderingTransformationOrigin = this.transformationOrigin;
	this.transformWithParent = true;//setting that object always transform with it's parent object if any
	this.translateWithParent = true; //doing similar thing above for translation
	this.skewWithParent = true;//for skewing
	this.rotateWithParent = true;//for rotation
	this.scaleWithParent = true;//for scaling
	this.noTransformationWithParent = false;//with this set to true no parent transformation is ever inherited
	this.noAncestorTransformation = false;//with this set to true no parent or ancestor transformation is ever inherited
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
			this.children.push(obj);//adding the child object to the list of children to the parent object
			this.world.addObject(obj);//also adding it to the list of objects in the scene
			obj.parentObject = this;//setting the parent object of the added object to this object
		}

	}
	this.removeChild = function(obj){
		//this method removes a child object from the parent
		var obj_index = this.children.indexOf(obj);//the index in the parent object children list
		var scene_index = this.world.objects.indexOf(obj);//the index in the in the scene's objects list
		if(0 <= obj_index){
			obj.flushChildren//flushing the children in the object
			this.children.splice(obj_index, 1);//this removes the object from the list of children but does not change other setttings of the object
			this.world.removeObject(obj);// removing it from the scene too
			obj.parentObject = null;//setting the parent object property of the object being removed to null
		}//this does not throw an error if such object does not exist as child to the parent object
	}
	this.flushChildren = function(){
		//this method flushes the children attached to this object
		var children = new Array(...this.children); //de-structuring the children
		var self = this;//safety measures
		children.forEach((child) => {
			self.removeChild(child);//this removes the child
		});
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
	this.hide = function(){
		//this method hides an object in the canvas
		this.props.globalAlpha = 0;//setting the global alpha to zero make it invisible
	}
	this.show = function(){
		//this method shows the object in the canvas
		this.props.globalAlpha = 1;
	}
	this.applyTransformation = function(child={
		transformWithParent:true, scaleWithParent:true, translateWithParent:true, rotateWithParent:true,
		skewWithParent:true, noTransformationWithParent:false, noAncestorTransformation:false
	}){//setting default value as a hack not to make the code longer than neccessary
		//this method applies the transformation properties to the canvas
		// it is very important to note that transformations transcends to the descendants of of an object by default. that is to it's children objects
		var zoom = 1;//default zoom without camera effect
		if(this.world.camera){//checking if to apply camera effect
			zoom = this.world.camera.zoom;//to be used with translation option
		}
		this.world.context.save()//saving the state of the canvas
		if((this.parentObject!=null || this.parentObject!=undefined) && child.noAncestorTransformation==false){
			this.parentObject.applyTransformation(this);//applying parents transformation if parent exist
		}else{//We are not saving the canvas state if the object has a parent because we don't want to overwrite the transformation done by parent 
			
		}
		this.world.context.translate(this.renderingTransformationOrigin[0], this.renderingTransformationOrigin[1]);//changing transformation orgin to the specified transformation origin of the object
		
		if(child.translateWithParent==true && child.noTransformationWithParent==false){
			this.world.context.translate(this.translationMatrix[0]*zoom, this.translationMatrix[1]*zoom);
		}
		if(child.transformWithParent==true && child.noTransformationWithParent==false){
			this.world.context.transform(...this.transformationMatrix);//applying the transformation
		}
		if(child.skewWithParent==true && child.noTransformationWithParent==false){
			this.world.context.transform(1, ...this.skewMatrix, 1, 0, 0);//transformation for skewing
		}
		if(child.rotateWithParent && child.noTransformationWithParent==false){
			this.world.context.rotate(this.rotationAngle);//applying the rotation
		}
		if(child.scaleWithParent && child.noTransformationWithParent==false){
			this.world.context.scale(this.scaleMatrix[0], this.scaleMatrix[1]);//applying the scaling transformation
		}
		
		this.world.context.translate(-this.renderingTransformationOrigin[0], -this.renderingTransformationOrigin[1]);//translating back to the origin
	}
	this.removeTransformation = function(){
		//this method removes the transformation that has been applied on the canvas so that other objects in the canvas will not be affected
		this.world.context.restore();//restoring the state of the canvas
	}
	this.scale = function(x, y){
		//the function execution here for scaling
		//find out the mathematics behind the implementation of this and have it implemented
		this.scaleMatrix[0] *= x;
		this.scaleMatrix[1] *= y;
	}
	this.rotate = function(angle){
		//the function execution comes here for rotation using the rotation angle property of the object
		this.rotationAngle += angle;
	}
	this.translate = function(x, y){
		//the function execution comes here for translation
		//find out the mathematics behind the implementation of this and have it implemented
		this.translationMatrix[0] += x;
		this.translationMatrix[1] += y;
	}
	this.skew= function(angleX, angleY){
		//this skews the object, using the skew matrix property of the object which provides the skew x and y
		this.skewMatrix[0] += angleX;
		this.skewMatrix[1] += angleY;
	}
	this.transform = function(transformationMatrix){
		//the function exectution comes here for transformation using the transformation property
		//find out the mathematics behind the implementation of this
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
	this.drawPath = function(){
		//this method draws a path round th object for event listening purposes
		/*  
			Path2D could serve the purpose but it is not stable yet so could have issue running in some browsers
			var path = new Path2D();
			[canvas api to draw paths];
		*/
		//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object 
		this.world.context.beginPath();
		this.world.context.moveTo(this.renderingX, this.renderingY);
		this.world.context.lineTo(this.renderingX, this.renderingY+this.renderingHeight);
		this.world.context.lineTo(this.renderingX+this.renderingWidth, this.renderingY+this.renderingHeight);
		this.world.context.lineTo(this.renderingX+this.renderingWidth, this.renderingY);
		this.world.context.closePath();
		this.world.context.stroke();
	}
	this.setCanvasPropsForObject = function(){
		//this method sets the canvas props to the objects rendering properties
		Object.assign(this.world.context, this.world.canvasContextProperties);//making sure that the setting are reset to what it was originally
		Object.assign(this.world.context, this.props);
	}
	this.alignOriginWithParent = function(){
		//this method sets the rendering origin parameter of the object to align with the parent object
		if(this.parentObject){
			//checking if the object has parent, so we could readjust to fit to the parent object
			this.x = this.xInitial + this.parentObject.x;
			this.y = this.yInitial + this.parentObject.y;
		}

	}
	this.applyTransformationOrigin = function(){
		//this method applies the transformation origin ready for rendering
		
		this.renderingTransformationOrigin = [this.transformationOrigin[0], this.transformationOrigin[1]];
		if(this.world.camera){
			this.renderingTransformationOrigin[0]=(this.renderingTransformationOrigin[0]*this.world.camera.zoom);
			this.renderingTransformationOrigin[1]=(this.renderingTransformationOrigin[1]*this.world.camera.zoom);
		}
		if(this.setTransformationOriginToCenter === true ){
			//trying to make the transformation take place at the center of the object
			this.renderingTransformationOrigin = [0.5*this.renderingWidth, 0.5*this.renderingHeight];
		}
		this.renderingTransformationOrigin = [this.renderingX+this.renderingTransformationOrigin[0], this.renderingY+this.renderingTransformationOrigin[1]];
		
	}
	this.setRenderingParameters = function(){
		//this method sets the rendering paramters for the object
		if(this.world.camera){
			if(this.props.lineWidth){
				this.world.context.lineWidth = this.world.context.lineWidth*this.world.camera.zoom;
			}
			this.renderingX = (this.x*this.world.camera.zoom)-this.world.camera.x, this.renderingY = (this.y*this.world.camera.zoom)- this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			this.renderingWidth = this.width*this.world.camera.zoom, this.renderingHeight = this.height*this.world.camera.zoom; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's zoom
		}else{
			this.renderingX = this.x, this.renderingY = this.y;
			this.renderingWidth = this.width, this.renderingHeight = this.height;
		}
	}
}
function Player(obj){
	//this constructor function takes care of all the operations that has to do with having a player on the scene;
	this.object = obj;//this sets the object that is going to be the controller in the scene instance.
	obj.playerObject = obj;//setting a playerObject for the object that is now made player
	if(obj.width == undefined || obj.height == undefined){//checking to know if the object has a width and a height
		obj.width = 0, obj.height = 0;
		//the developer has to set a width and height parameter to make the object a player
	}
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
			var Px = this.object.x*this.world.camera.zoom;//player origin position on x-axis
			var Py = this.object.y*this.world.camera.zoom;//player origin position on y-axis
			var Ph = this.object.height*this.world.camera.zoom;//player height
			var Pw = this.object.width*this.world.camera.zoom;//player width
			//the reason for dividing by the camera's zoom is to make sure that the values that will be using for the calculation is with respect to the camera's view
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
		//Note that this camera coupling property does not apply when transformation is done on the object using the canvas methods. Currently 
		//the transformations availble on objects are based on cavas methods

	}
	this.implementAfterAddedToScene = function(){
		//the developer has to put things he wants to implement when the player gets added to the scene here
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
	this.setTransformationOriginToCenter=true;
	this.fontSize=10;
	this.renderingFontSize = this.fontSize;
	this.render = function(){
		//first is to set canvas properties for the object
		this.setCanvasPropsForObject();
		if(this.props.font){
			//trying the extract the width property of the text from the font information that was given
			this.fontSize = this.props.font.substring(this.props.font.search(/[0-9]+px/), this.props.font.search(/[0-9]px/)+1);// this finds extracts the fontSize of the text from the text
		}
		this.renderFont();
		this.textMeasurement = this.world.context.measureText(this.text);
		this.width = this.textMeasurement.width;
		this.height = this.renderingFontSize*(36/50);
		this.alignOriginWithParent();
		this.setRenderingParameters();
		Object.assign(this.world.context, this.world.canvasContextProperties);//reseting the change so that the changes for the text box itself could be applied
		Object.assign(this.world.context, this.boxProps);//assigning the textbox properties
		if(this.world.camera && this.boxProps.lineWidth){
			this.world.context.lineWidth = this.world.context.lineWidth*this.world.camera.zoom;
		}
		this.applyTransformationOrigin();
		this.applyTransformation();//applyiing transformation properties
		if(this.fillBox==true){
			this.world.context.fillRect(this.renderingX, this.renderingY, this.renderingWidth, this.renderingHeight);
		}
		//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object 
		this.drawPath();
		this.setCanvasPropsForObject();//reseting again to apply text properties
		this.renderFont();
		this.renderText();
		this.removeTransformation();//removing setted transformation properties so it does not affect the next object

	}
	this.renderFont = function(){
		//takes care of rendering the font of the integration
		if(this.world.camera){
			this.renderingFontSize = this.fontSize*this.world.camera.zoom;
		}else{
			this.renderingFontSize = this.fontSize;
		}
	
		this.world.context.font = this.world.context.font.replace(String(this.fontSize), String(this.renderingFontSize));
		if(this.world.camera && this.props.lineWidth){
			this.world.context.lineWidth = this.world.context.lineWidth*this.world.camera.zoom;
		}

	}
	this.renderText = function(){
		//this method renders the actual text to the canvas
		var paddingX = 0; var paddingY = 0;
		if(this.world.camera && (this.boxProps.paddingX>0 || this.boxProps.paddingY>0)){
			paddingX = this.boxProps.paddingX*this.world.camera.zoom;
			paddingY = this.boxProps.paddingY*this.world.camera.zoom;
		}
		if(this.fillText==true){
			this.world.context.fillText(this.text, this.renderingX+paddingX, this.renderingY+this.renderingHeight-paddingY);
		}
		this.world.context.strokeText(this.text, this.renderingX+paddingX, this.renderingY+this.renderingHeight-paddingY);
	}
	this.setRenderingParameters = function(){
		//setting the rendering parameters for the button object different from the way others where set
		if(this.world.camera){
			this.renderingX = (this.x*this.world.camera.zoom)-this.world.camera.x, this.renderingY = (this.y*this.world.camera.zoom)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
			this.renderingWidth = (this.width+this.boxProps.paddingX*2)*this.world.camera.zoom, this.renderingHeight = (this.height+this.boxProps.paddingY*2)*this.world.camera.zoom; //this tries to apply the camera effect if the camera is added to the scene, so we are dividing by the world camera's zoom
		}else{
			this.renderingX = this.x, this.renderingY = this.y;
			this.renderingWidth = this.width + this.boxProps.paddingX*2, this.renderingHeight = this.height+this.boxProps.paddingY*2;
		}
	}
}
function RectObject(x, y, width, height, fillRect = false){
	//this constructor function is for the rectangle object, this takes care of the operations that has to do with the objects in the canvas
	SanimObject.call(this);
	this.x = x, this.y = y, this.width = width, this.height = height, this.fillRect = fillRect;
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	this.renderingX = this.x, this.renderingY = this.y, this.renderingWidth = this.width, this.renderingHeight= this.height;
	this.setTransformationOriginToCenter=true;
	this.render = function(){
		//this renders the object to the canvas
		//first is to set canvas properties for the object
		this.setCanvasPropsForObject();
		//second is to align the objects origin with parent
		this.alignOriginWithParent();
		//next is to set the rendering parameters
		this.setRenderingParameters();
		//next is to apply the setted transformation origin for the object
		this.applyTransformationOrigin();
		//next is to apply transformation on the object before rendering
		this.applyTransformation();
		if(this.fillRect==true){
			this.world.context.fillRect(this.renderingX, this.renderingY, this.renderingWidth, this.renderingHeight);
		}
		//next is to draw a path round the object for event listening purpose
		this.drawPath();
		//finally we remove the transformation on the object
		this.removeTransformation();//removing setted transformation properties so it does not affect the next object
		
	}
}

function PathObject(x, y, paths, closePath=true, fillPath=false){
	/*
	This is the definition for a canvas path object.
	This object gives more functionality to the canvas path, it literally make the path an object instead of just a path.
	*/
	this.x = x, this.y = y, this.fillPath = fillPath, this.closePath = this.closePath;
	this.xInitial = this.x, this.yInitial = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
	this.newPath = true;//stating that the object js a new path and not the continuation of another.
	this.paths = paths;
	this.renderingX = this.x, this.renderingY = this.y;
	this.renderingPaths = new Array();
	for(var i = 0; i<paths.length; i++){//trying to assign the paths to renderingPaths;
		var path = {pathMethod:paths[i].pathMethod, params:new Array()};
		for(var j=0; j<paths[i].params.length; j++){
			path.params.push(paths[i].params[j]);
		}
		this.renderingPaths.push(path);
	}

	this.initialPaths = new Array();
	for(var i = 0; i<paths.length; i++){//trying to assign the paths to initialPaths
		var path = {pathMethod:paths[i].pathMethod, params:new Array()};
		for(var j=0; j<paths[i].params.length; j++){
			path.params.push(paths[i].params[j]);
		}
		this.initialPaths.push(path);
	}
	this.appendPath = function(path){
		//this method allows the developer to be able to append path to the already existing path
		var newPath = {pathMethod:path.pathMethod, params:new Array()};
		for(var j=0; j<path.params.length; j++){
			newPath.params.push(path.params[j]);
		}
		this.renderingPaths.push(newPath);
		newPath = {pathMethod:path.pathMethod, params:new Array()};//reseting it to append to the initialPaths
		for(var j=0; j<path.params.length; j++){
			newPath.params.push(path.params[j]);
		}
		this.initialPaths.push(newPath);
		this.paths.push(path);
	}
	this.render = function(){
		this.setCanvasPropsForObject();
		this.alignOriginWithParent();
		if(this.world.camera){
			this.renderingX = (this.x*this.world.camera.zoom)-this.world.camera.x, this.renderingY = (this.y*this.world.camera.zoom)-this.world.camera.y;//this is defines the starting poisiton of the path to be drawn
		}else{
			this.renderingX = this.x, this.renderingY = this.y;
			
		}
		//remove the rest of the general properties that where not used here
		this.applyTransformationOrigin();
		this.applyTransformation();
		if(this.newPath == true){
      this.world.context.beginPath();
		}
		for(var i = 0;i<this.paths.length;i++){
			/* Trying to add the origin to the neccessary parameters of the path methods */
			if(this.paths[i].pathMethod == 'lineTo' || this.paths[i].pathMethod == 'moveTo'){
				this.paths[i].params[0] = this.initialPaths[i].params[0] + this.x;
				this.paths[i].params[1] = this.initialPaths[i].params[1] + this.y;
			}else if(this.paths[i].pathMethod == 'arcTo'){
				this.paths[i].params[0] = this.initialPaths[i].params[0] + this.x;
				this.paths[i].params[1] = this.initialPaths[i].params[1] + this.y;
				this.paths[i].params[2] = this.initialPaths[i].params[2] + this.x;
				this.paths[i].params[3] = this.initialPaths[i].params[3] + this.y;
			}else if(this.paths[i].pathMethod == 'bezierCurveTo'){
				this.paths[i].params[0] = this.initialPaths[i].params[0] + this.x;
				this.paths[i].params[1] = this.initialPaths[i].params[1] + this.y;
				this.paths[i].params[2] = this.initialPaths[i].params[2] + this.x;
				this.paths[i].params[3] = this.initialPaths[i].params[3] + this.y;
				this.paths[i].params[4] = this.initialPaths[i].params[4] + this.x;
				this.paths[i].params[5] = this.initialPaths[i].params[5] + this.y;
			}else if(this.paths[i].pathMethod == 'quadraticCurveTo'){
				this.paths[i].params[0] = this.initialPaths[i].params[0] + this.x;
				this.paths[i].params[1] = this.initialPaths[i].params[1] + this.y;
				this.paths[i].params[2] = this.initialPaths[i].params[2] + this.x;
				this.paths[i].params[3] = this.initialPaths[i].params[3] + this.y;
			}else if(this.paths[i].pathMethod == 'arc'){
				this.paths[i].params[0] = this.initialPaths[i].params[0] + this.x;
				this.paths[i].params[1] = this.initialPaths[i].params[1] + this.y;
			}
			if(this.world.camera){
				if(this.paths[i].pathMethod == 'lineTo' || this.paths[i].pathMethod == 'moveTo'){
					this.renderingPaths[i].params[0] = (this.paths[i].params[0]*this.world.camera.zoom)-this.world.camera.x;
					this.renderingPaths[i].params[1] = (this.paths[i].params[1]*this.world.camera.zoom)-this.world.camera.y;
				}else if(this.paths[i].pathMethod == 'arcTo'){
					this.renderingPaths[i].params[0] = (this.paths[i].params[0]*this.world.camera.zoom) -this.world.camera.x;
					this.renderingPaths[i].params[1] = (this.paths[i].params[1]*this.world.camera.zoom) -this.world.camera.y;
					this.renderingPaths[i].params[2] = (this.paths[i].params[2]*this.world.camera.zoom) -this.world.camera.x;
					this.renderingPaths[i].params[3] = (this.paths[i].params[3]*this.world.camera.zoom) -this.world.camera.y;
					this.renderingPaths[i].params[4] = (this.paths[i].params[4]*this.world.camera.zoom);
				}else if(this.paths[i].pathMethod == 'bezierCurveTo'){
					this.renderingPaths[i].params[0] = (this.paths[i].params[0]*this.world.camera.zoom) -this.world.camera.x;
					this.renderingPaths[i].params[1] = (this.paths[i].params[1]*this.world.camera.zoom) -this.world.camera.y;
					this.renderingPaths[i].params[2] = (this.paths[i].params[2]*this.world.camera.zoom) -this.world.camera.x;
					this.renderingPaths[i].params[3] = (this.paths[i].params[3]*this.world.camera.zoom) -this.world.camera.y;
					this.renderingPaths[i].params[4] = (this.paths[i].params[4]*this.world.camera.zoom) -this.world.camera.x;
					this.renderingPaths[i].params[5] = (this.paths[i].params[5]*this.world.camera.zoom) -this.world.camera.y;
				}else if(this.paths[i].pathMethod == 'quadraticCurveTo'){
					this.renderingPaths[i].params[0] = (this.paths[i].params[0]*this.world.camera.zoom) -this.world.camera.x;
					this.renderingPaths[i].params[1] = (this.paths[i].params[1]*this.world.camera.zoom) -this.world.camera.y;
					this.renderingPaths[i].params[2] = (this.paths[i].params[2]*this.world.camera.zoom) -this.world.camera.x;
					this.renderingPaths[i].params[3] = (this.paths[i].params[3]*this.world.camera.zoom) -this.world.camera.y;
				}else if(this.paths[i].pathMethod == 'arc'){
					this.renderingPaths[i].params[0] = (this.paths[i].params[0]*this.world.camera.zoom) -this.world.camera.x;
					this.renderingPaths[i].params[1] = (this.paths[i].params[1]*this.world.camera.zoom) -this.world.camera.y;
					this.renderingPaths[i].params[2] = (this.paths[i].params[2]*this.world.camera.zoom);
				}
			}else{
				this.renderingPaths[i].params = new Array(...this.paths[i].params);
			}
			if(this.paths[i].pathMethod == 'moveTo'){
				this.world.context.moveTo(...this.renderingPaths[i].params);
			}else if(this.paths[i].pathMethod == 'lineTo'){
				this.world.context.lineTo(...this.renderingPaths[i].params);
			}else if(this.paths[i].pathMethod == 'arcTo'){
				this.world.context.arcTo(...this.renderingPaths[i].params);
			}else if(this.paths[i].pathMethod == 'bezierCurveTo'){
				this.world.context.bezierCurveTo(...this.renderingPaths[i].params);
			}else if(this.paths[i].pathMethod == 'quadraticCurveTo'){
				this.world.context.quadraticCurveTo(...this.renderingPaths[i].params);
			}else if(this.paths[i].pathMethod == 'arc'){
				this.world.context.arc(...this.renderingPaths[i].params);
			}
		}
		if(this.closePath==true){
			this.world.context.closePath();

		}
		this.world.context.stroke();
		if(this.fillPath==true){
			this.world.context.fill()
		}
		//this.world.context.translate(-this.renderingX, -this.renderingY);//returning back to the origin of the canvas
		this.removeTransformation();//removing the transformation applied on the object
	}
	
	SanimObject.call(this);

}
function CircleObject(x, y, radius, fill=false){
	//this object draws a circle on the canvas
	this.radius = radius; this.width = radius*2; this.height = this.width;
	PathObject.call(this, x, y, [{pathMethod:'arc', params:[0, 0, radius, 0, Math.PI*2, false]}], true, fill);//calls the Path object to draw the circle
}
function StraightLineObject(x, y, xEnd, yEnd){
	//this funcion draws a straight line in the canvas
	this.xEnd = xEnd; this.yEnd = yEnd;
	PathObject.call(this, x, y, [{pathMethod:'moveTo', params:[0, 0]}, {pathMethod:'lineTo', params:[xEnd-x, yEnd-y]}], false, false);//drawing the straight path
}
function Camera(){
	this.x = 0, this.y =0, this.z = 0, this.zoom = 1, this.width = window.innerWidth, this.height = window.innerHeight;
	this.position = function(x, y, z){
		//this function sets the position of the camera on the canvas
		this.x = x, this.y = y; this.z =z;
	}
	this.setProperties = function(x,y,z,zoom){
		//this method helps to reset the camera parameters or features
		this.position(x,y,z); //This sets the position of the camera
		this.zoom = zoom; //this sets the zoom of the camera
	}
	this.setDimmension = function(width, height){
		//this sets the camera's area of view or viewport.
		this.width = width;
		this.height = height;
	}
	this.scaleZoom = function(scale){
		//this scales the zoom of the camera
		this.zoom = this.zoom*scale;
	}
}

function Scene(context){
	this.context = context; // holds the canvas context to which the graphics will be rendered to
	this.color = "white";
	this.camera = null; // holds the camera added to the world
	this.player = null; // holds the player in the scene if exist
	this.lights = new Array(); // holds the lights added to the scene
	this.objects = new Array(); //holds the objects added to the scene
	this.animationObjects = new Array();//holds the animation objects in the scene
	this.playAnimation = true;//setting if animation should play or not
	window.context = context;//testing and debuggiing purposes
	this.isParentWorld = false;
	this.clearBeforeRender = true;//a setting to know if to clear the scene before rendering another frame or to render the next frame with
	//the previous frame on the scene
	this.width = this.context.canvas.width;
	this.height = this.context.canvas.height;
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

	this.addObject = function(obj){
		//this adds an object to the scene
		obj.world = this;
		this.objects.push(obj);
		if(obj.isIntegration){
			this.context.canvas.parentElement.appendChild(obj.element);
		}
		obj.implementAfterAddedToScene();//this is a hack to implement somethings which demand that object be added to scene before implemented
		for(var i=0; i<obj.children.length; i++){//adding the objects that the object being added is parent object to
			var childObj = obj.children[i];
			this.addObject(childObj);
		}
	}
	this.removeObject = function(obj){
		//this method removes a child object from the scene
		var index = this.objects.indexOf(obj);
		if(0 <= index){
			this.objects.splice(index, 1);//this removes the object from the list of objects but does not change other setttings of the object
			if(obj.isIntegration){
				obj.removeFromDOM();
			}
			var children = new Array(...obj.children);
			for(var i = 0; i<children.length; i++){
				var childObj = children[i];
				this.removeObject(childObj);
			}
			obj.world = null;
		}//this does not throw an error if such object does not exist as child object to the scene
	}
	this.addChild = function(obj){
		//does same thing as addObject, just for sake of conveniency
		this.addObject(obj);
	}
	this.removeChild = function(obj){
		//does same thing as removeObject, just for sake of conveniency
		this.removeObject(obj);
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
		player.implementAfterAddedToScene();//this is a hack to implement somethings which demand that player be added to scene before implemented
	}
	this.render = function(){
		//this renders the scene to the canvas
		if(this.clearBeforeRender == true){
			if(this.isParentWorld===true){//fit to the screen provided this is the parent world;this.context.canvas.position = 'absolute';
				fitCanvasToScreen(this.context);
			}
			this.context.fillStyle = this.color;
			this.context.fillRect(0,0,this.context.canvas.width, this.context.canvas.height);
		}
		this.executeOnRender();
		if(this.player){
			//check that the player is visible in the seen;
			this.player.makeCameraAdjustments();// making camera adjustments with respect to the position of the player in the viewport
		}else{
			//do something here, maybe alert user that there is no player in the scene yet
		}
		for(var i=0; this.objects.length>i; i++){
			var obj = this.objects[i];
			obj.render();
		}
	}
	this.runAnimations = function(){
		//this runs the animations that has been scheduled
		for(var i=0; this.animationObjects.length>i; i++){
			var animation = this.animationObjects[i];
			animation.animateInstances();//making the animations that have been added to the scene
		}
	}
	this.radian = function(angleInDegree){
		//this method converts an angle from degree to radian
		return (Math.PI/180)*angleInDegree;
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
		fitCanvasToScreen(this.context);
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
		this.context.canvas.width = this.width;
		this.context.canvas.height = this.height;
	}
	this.flush = function(){
		//this method flushes the scene of it's objects and animations
		this.flushObjects();
		this.flushAnimations();
	}
	this.flushObjects = function(){
		//this method flushes the objects that are available
		this.player = null;
		this.lights = new Array();
		//removes every single object
		var objects = new Array(...this.objects);
		for(var i=0; i<objects.length; i++){
			var obj = objects[i];
			this.removeObject(obj);
		}
		this.objects = new Array();
	}
	this.flushAnimations = function(){
		//this method flushes all the animations in the scene
		this.animationObjects = new Array();//resetting the array to a whole new and empty one
	}
	this.executeOnRender = function(){
		//this gets executed whenever the scene renders
	}
	var world = this;
	this.makeFrames = function(){
		function animator(){
			world.frameID = window.requestAnimationFrame(animator);
			if(world.playAnimation){
				world.render();//rendering the scene inside the animation frame
			}
		}
		animator();
	}
	this.animate = function(){
		// this.animationID = window.requestAnimationFrame(this.animate);
		// if(world.playAnimation){
		// 	world.runAnimations();//running the computations for the animations in the scene.
		// }
		function animator(){
			world.animationID = window.requestAnimationFrame(animator);
			//if(world.playAnimation){
				world.runAnimations();//running the computations for the animations in the scene.
			//}
		}
		animator();
	}
	this.pause = function(){
		//this cancels all the animations and frame rendering going on
		this.playAnimation = false;
		window.cancelAnimationFrame(this.frameID);
		window.cancelAnimationFrame(this.animationID);
	}
	this.play = function(){
		//this plays the animation by restarting it if it has stopped
		this.playAnimation = true;
		this.animate();
		this.makeFrames();
	}
	this.play();//this should not always play by default
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
	this.setTransformationOriginToCenter = true;//to set user defined transformation origin developer has to disable this property by setting it to false
	this.render = function(){
		//this renders the object to the canvas
		this.setCanvasPropsForObject();
		this.alignOriginWithParent();
		this.setRenderingParameters();
		this.applyTransformationOrigin();
		this.applyTransformation();
		//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object
		this.world.context.drawImage(this.media, this.renderingX, this.renderingY, this.renderingWidth, this.renderingHeight)
		this.drawPath();
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
	this.translationMatrix = [0, 0];
	this.fontSize = 20;
	this.renderingFontSize = this.fontSize;
	this.isIntegration = true;//to be used later to figure out if the object is an integration object or normal canvas object
	this.render = function(){
		this.setCanvasPropsForObject();
		this.alignOriginWithParent();
		this.setRenderingParameters();
		this.applyTransformation();
		this.element.style.width=this.renderingWidth + 'px';
		this.element.style.height = this.renderingHeight + 'px';
		this.element.style.position = 'absolute';
		this.element.style.top = this.renderingY + 'px';
		this.element.style.left = this.renderingX + 'px';
		this.renderFont();
	}
	
	this.applyTransformation = function(){
		//this applies the transformation on this integrated element
		this.element.style.transform = 'matrix('+this.transformationMatrix[0]+', '+this.transformationMatrix[1] +', ' + this.transformationMatrix[2]+ ', ' + this.transformationMatrix[3]+', ' + this.transformationMatrix[4]+', '+ this.transformationMatrix[5]+')';
	}
	this.applyTransformationOrigin = function(){
		this.element.style.transformationOrigin = this.transformationOrigin[0] + ', '+ this.transformationOrigin[1];//check the proper way later
	}
	this.renderFont = function(){
		//takes care of rendering the font of the integration
		if(this.world.camera){
			this.renderingFontSize = this.fontSize*this.world.camera.zoom;
		}else{
			this.renderingFontSize = this.fontSize;
		}
		this.element.style.fontSize = String(this.renderingFontSize)+'px';
	}
	this.removeFromDOM = function(){
		//this method removes the integration object from the canvas
		this.element.remove();
	}
	this.hide = function(){
		//this method hides the object from the canvas
		this.element.style.display = 'none';//this method hides the html element
	}
	this.show = function(){
		//this method shows the object in the canvas
		this.element.style.display = 'block';
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

/*
Exporting the modules for use below
*/
var Sanim = {
		Scene:Scene,
		Camera:Camera,
		Player:Player,
		SanimObject:SanimObject,
		PathObject:PathObject,
		RectObject:RectObject,
		ButtonObject:ButtonObject,
		TextObject:TextObject,
		ImageObject:ImageObject,
		VideoObject:VideoObject,
		AudioObject:AudioObject,
		Integration:Integration,
		Animation:Animation,
		AnimationInstance:AnimationInstance
	}
// if(typeof exports != undefined){//checking to be sure it is not being used from a script tag
// 	exports.default = Sanim;
// 	exports.Scene = Scene;
// 	exports.Camera = Camera;
// 	exports.Player = Player;
// 	exports.SanimObject = SanimObject;
// 	exports.PathObject = PathObject;
// 	exports.RectObject = RectObject;
// 	exports.ButtonObject = ButtonObject;
// 	exports.TextObject = TextObject;
// 	exports.ImageObject  = ImageObject;
// 	exports.VideoObject = VideoObject;
// 	exports.AudioObject = AudioObject;
// 	exports.Integration = Integration;
// 	exports.Animation = Animation;
// 	exports.AnimationInstance = AnimationInstance;
// }