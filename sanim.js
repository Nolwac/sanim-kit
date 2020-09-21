var Sanim = (function(){
	function Animation(world){
		//this object has all the animations types as its methods
		//the animation object sets the scene to be continually rerendering by creating a javascript animation frame that continually rerenders it
		this.speedReference = 0.01;
		window.sanimKitSpeedReference = this.speedReference;//setting the speed reference number gloabally;
		this.tasks = new Array();
		
		this.world = world;//setting the scene
		this.animationOn = false;//property that will be used to put out animation and allow another object to start animation
		this.asynchronous = true;//this allows the animations to occur at same time for all the object and not one at a time, then the other
		world.animationObjects.push(this)//pushing the animation to the scene so that it can take effect

		this.sleep = function(time){
			//this method sleeps the animation with the animation object for a specified period of time in milliseconds
			//this sleep is not windows animation frame based so will not pause while the user is not on tab on the webbrowser
			var sleep = new Task({
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
			this.schedule(sleep);
			return sleep;
		}
	    this.execute = function(func){
	        //performs an instant animation
	        var instance = new Task({
		        world:this.world,
		        status:true,
		        execute: function (){
		        	func();
		            this.status=false;
		        },
		        animationStatus: function (){
		        	return status;
		        }
	    	});
	     	this.schedule(instance)
	    }
		this.setInterval = function(params){
			//this method set an interval for a loop
			var animInstance = new Task(Object.assign({
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
	                if(self.animationStatus()==false){
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
	        this.schedule(animInstance);
	        return animInstance;
		}
		this.clearInterval = function(animInstance){
			//this method clears the set interval if the user wishe to clear the interval
			animInstance.obj.status = false;//and that is all that is needed to clear it, finished
		}

		this.animateTask = function(instance){
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
				var instanceIndex = this.tasks.indexOf(instance);
				this.tasks.splice(instanceIndex, 1);//removing the instance from the list to populating the list with unecessary intances
				instance.added = false;//putting that the instance is no longer added since it has been removed from the animation object
				instance.onEnded();//running something once the instance is finished
			}
		}
		this.animateTasks = function(){
			//this method executes a function as long as the animation frame is on
			if(this.asynchronous===true || this.tasks.length<=0){
				for(var i=0; this.tasks.length>i; i++){
					var instance = this.tasks[i];
					if((this.animationOn==false || instance.animationStarted==true || this.asynchronous==true) && instance.pauseAnimation==false){
						this.animateTask(instance);//animating the instance;
						if(instance.obj.animationStatus()==false){
							break;//breaking the loop since an item in the list of animation instances is being removed, check animateTask method
						}
					}
				}
			}else{
				var instance = this.tasks[0];
				if((this.animationOn==false || instance.animationStarted==true || this.asynchronous==true) && instance.pauseAnimation==false){
					this.animateTask(instance);
				}
			}
		}
		
		this.schedule = function(task){
			if(this.tasks.indexOf(task) < 0){
				task.animationObject = this;
				task.added = true;
				this.tasks.push(task);
			}else{
				throw('You are attempting to add an already existing animation instance');//making the developer aware of the mistake
			}
		}
		this.animationSequence = function(sequence){
			//this method executes an animation sequence. what this means is that it executes animation one after the other as specified by the user
			//for(seq in sequence)
		}
	}
	function Task(obj){
		//this creates an animation instance to allow control of the animation timeline
		this.obj = null;//note that this object could as well be an animation instance to
		//this.repeatCheck = false;
		if(obj != null){
			this.obj = obj;
			obj.task = this;//setting the animation instance of the object to be this
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
			this.animationObject.schedule(newInstance);
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
		this.path2DObject = new Path2D();//this is the path2d object created for the path
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
			//it uses the path2dobject of the object to know if it was pointed to;
			var status =  this.world.context.isPointInPath(this.path2DObject, x, y);
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
				obj.x = obj.initialX + this.x;//setting the origin of the child object to be with respect to the origin of the parent object
				obj.y = obj.initialY + this.y;//we are using the initial settings because it is tamper proof;
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
		this.hide = function(){
			//this method hides an object in the canvas
			this.props.globalAlpha = 0;//setting the global alpha to zero make it invisible
		}
		this.show = function(){
			//this method shows the object in the canvas
			this.props.globalAlpha = 1;
		}
		this.fadeOut = function(anim, time){
			//this method takes an animation object as parameter
			return anim.setInterval({
				obj:this,
				delay:time/100,
				loop: function(){
					if(this.obj.props.globalAlpha === undefined){
						this.obj.props.globalAlpha = this.obj.world.canvasContextProperties.globalAlpha;
					}
					if(this.obj.props.globalAlpha <= 0.01){
						this.status = false;
						this.obj.props.globalAlpha = 0;
					}else{
						this.obj.props.globalAlpha -= 0.01;
					}
				}
			});
		}
		this.fadeIn = function(anim, time){
			//this method takes an animation object as parameter
			return anim.setInterval({
				obj:this,
				delay:time/100,
				loop: function(){
					if(this.obj.props.globalAlpha === undefined){//checking if the global alpha property exist
						this.obj.props.globalAlpha = this.obj.world.canvasContextProperties.globalAlpha;//assigning the default value;
					}
					if(this.obj.props.globalAlpha >= 0.99){
						this.status = false;
						this.obj.props.globalAlpha = 1;
					}else{
						this.obj.props.globalAlpha += 0.01;
					}
				}
			});
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
		this.motionPath = function(equation){
		  //this method moves the object in the canvas through a path using the equation object as a template for the motion path
		  var mover = {
		    obj:this,
		    employ: function (){
		      //this method employs the data from the equation and uses it to perform some functions
		      this.obj.x = this.xOrigin + this.x*this.xScale;
		      this.obj.y = this.yOrigin + this.y*this.yScale;
		    }
		  }
		  Object.assign(mover, equation);//assigning the equation
		  mover.xOrigin = this.x;//changing the origin to the origin of the object
		  mover.yOrigin = this.y;
		  return mover;
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
			//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object 
			//---------------------using the path2d object---------------------
			delete this.path2DObject;//deleting the previous one so it does not stack the existing one to it
			this.path2DObject = new Path2D();//creating new one

			this.path2DObject.moveTo(this.renderingX, this.renderingY);
			this.path2DObject.lineTo(this.renderingX, this.renderingY+this.renderingHeight);
			this.path2DObject.lineTo(this.renderingX+this.renderingWidth, this.renderingY+this.renderingHeight);
			this.path2DObject.lineTo(this.renderingX+this.renderingWidth, this.renderingY);
			this.path2DObject.closePath();
			this.world.context.stroke(this.path2DObject);
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
				this.x = this.initialX + this.parentObject.x;
				this.y = this.initialY + this.parentObject.y;
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
		this.initialX = this.x, this.initialY = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
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
			this.measureFont();
			this.measureText();
			this.alignOriginWithParent();
			this.setRenderingParameters();
			Object.assign(this.world.context, this.world.canvasContextProperties);//reseting the change so that the changes for the text box itself could be applied
			Object.assign(this.world.context, this.boxProps);//assigning the textbox properties
			if(this.world.camera && this.boxProps.lineWidth){
				this.world.context.lineWidth = this.world.context.lineWidth*this.world.camera.zoom;
			}
			this.applyTransformationOrigin();
			this.applyTransformation();//applyiing transformation properties
			//The below lines is trying to create a path for the rect object so as to be able to trace when they is a point in the path and alternative way that it can be done is make a check to know if when the point is within the area of the rect object 
			this.drawPath();
			if(this.fillBox==true){
				this.world.context.fill(this.path2DObject);
			}
			this.setCanvasPropsForObject();//reseting again to apply text properties
			this.measureFont();
			this.renderText();
			this.removeTransformation();//removing setted transformation properties so it does not affect the next object

		}
		this.measureText = function(){
			//-----taking care of measuring the dimension of the text
			this.textMeasurement = this.world.context.measureText(this.text);
			this.width = this.textMeasurement.width;
			this.height = this.renderingFontSize*(36/50);
		}
		this.measureFont = function(){
			//takes care of measuring the font of the text
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
		this.write = function(anim, time, sound=false){
		//this method write the text word by word
			return anim.setInterval({
				text:this.text,
				position:0,//positon of text splice at each time
				obj:this,
				sound:sound,
				delay:time/this.text.length,//the interval of time
				loop:function(){
					//this is the execution
					this.obj.text = this.text.slice(0, this.position);//assigning the spliced text to the text object
					if(this.sound){//checking if they is a sound to play
						if(this.sound.media.paused == true){
							this.sound.media.play();//playing the sound if the sound is paused
						}
					}
					if(this.position >= this.text.length){
						this.status = false;//ending the interval
						if(this.sound){
							this.sound.media.pause();//pausing the sound if the sound is still playing
						}
					}
					this.position++;
				}
			});
		}
		this.superscript = function(text, ratio){
			//this method creates a text object that positions itself like a subscript to the current text object.
			this.render();
			var obj = new TextObject(text, this.width, 2);//putting 2 in the y position to account for canvas offset on text 
			obj.fontSize = parseInt(this.fontSize*ratio);//setting the fontsize to be a fraction of the ration and converting to integer
			Object.assign(obj.props, this.props);//making it's property equal to the parent object
			obj.props.font = this.props.font.replace(String(this.fontSize), String(obj.fontSize));//changing the actual font property
			obj.fillText = this.fillText;//setting the fillText opition to equal the fillText of the parent;
			this.addChild(obj);//adding it to the parent
			return obj;
		}
		this.subscript = function(text, ratio){
			//this method creates a text object that positions itself like a subscript to the current text object.
			obj = this.superscript(text, ratio);
			obj.render();//rendering object so as to use properties calculated during rendering to make adjustments to position
			obj.initialY = this.height-obj.height+2;//making adjustment to the position
			obj.y = obj.initialY;
			return obj;
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
		this.initialX = this.x, this.initialY = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
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
			//next is to draw a path round the object for event listening purpose
			this.drawPath();
			if(this.fillRect==true){
				this.world.context.fill(this.path2DObject);
			}
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
		this.initialX = this.x, this.initialY = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
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
			// if(this.newPath == true){
			// 	this.world.context.beginPath();
			// }
			delete this.path2DObject;//deleting the existing path2d object
			this.path2DObject = new Path2D();//creating a new one
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
					this.path2DObject.moveTo(...this.renderingPaths[i].params);
				}else if(this.paths[i].pathMethod == 'lineTo'){
					this.path2DObject.lineTo(...this.renderingPaths[i].params);
				}else if(this.paths[i].pathMethod == 'arcTo'){
					this.path2DObject.arcTo(...this.renderingPaths[i].params);
				}else if(this.paths[i].pathMethod == 'bezierCurveTo'){
					this.path2DObject.bezierCurveTo(...this.renderingPaths[i].params);
				}else if(this.paths[i].pathMethod == 'quadraticCurveTo'){
					this.path2DObject.quadraticCurveTo(...this.renderingPaths[i].params);
				}else if(this.paths[i].pathMethod == 'arc'){
					this.path2DObject.arc(...this.renderingPaths[i].params);
				}
			}
			if(this.closePath==true){
				this.path2DObject.closePath();

			}
			this.world.context.stroke(this.path2DObject);
			if(this.fillPath==true){
				this.world.context.fill(this.path2DObject)
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
		this.stampArrowHead = function(length = 20, angle=Math.PI/3){
			//this method stamps a cursor to the PathObject
			//add this as an object of it's own instead, arrowPointer
			//the angle provided is the angle of separation between the arrow wings
			if(!this.arrowHead){//checking if there is no existing arrow head so we don't have duplicate arrow head
				var theta = Math.atan((this.y - this.yEnd)/(this.xEnd - this.x));//calculating theta
				if(this.x>this.xEnd){
					theta = theta+Math.PI;
				}
				this.arrowHead = new ArrowHeadObject(this.xEnd-this.x, this.yEnd-this.y, theta, length, angle);
				Object.assign(this.arrowHead.props, this.props);//arrow head inheriting from parent props
				this.addChild(this.arrowHead);//adding the arrow head to the parent object
			}
			
		}
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
		this.playAnimation = false;//setting if animation should play or not
		window.context = context;//testing and debuggiing purposes
		this.isParentWorld = false;
		this.clearBeforeRender = true;//a setting to know if to clear the scene before rendering another frame or to render the next frame with
		//the previous frame on the scene
		this.width = this.context.canvas.width;
		this.height = this.context.canvas.height;
		this.interval = 10;//the interval of time that each frame is rendered
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
					this.fitCanvasToScreen();
				}
				Object.assign(this.context, this.canvasContextProperties)
				this.context.fillStyle = this.color;
				this.context.clearRect(0,0,this.context.canvas.width, this.context.canvas.height);
	      		this.context.fillRect(0,0,this.context.canvas.width, this.context.canvas.height);
				this.width = this.context.canvas.width;
				this.height = this.context.canvas.height;
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
		this.createGrid = function (xScale, yScale){
		  //this method creates a grid and puts it on top the scene. it does this using the grid object
	    var canvas = document.createElement("canvas");//creating the grid scene canvas
	    this.context.canvas.parentElement.appendChild(canvas);//appending the canvas to the parent element of the scene canvas element.This will make them sibblings
	    var context = canvas.getContext("2d");//creating context for the grid scene
	    var integration = new Integration(context.canvas, 0, 0, window.innerWidth, window.innerHeight);//creating an integration object for the grid scene
	    this.addChild(integration);
	    var gridScene = new Scene(context);//creating a new scene to render the grid
	    //gridScene.integration = integration;//assigning the integration to it for easy accessibility later on.
	    this.render();//rendering the scene at least once so as to make sure that the width and height are set before assigning them to the grid scene context
	    context.canvas.width = this.width;
	    context.canvas.height = this.height;
	    gridScene.canvasContextProperties.globalAlpha = 0;//setting the global alpha to 0 so that it will be completely transparent
	    gridScene.render();//rendering the grid scene for height and width property to be set before adding the grid object to it
	    
	    var grid = new Grid(gridScene, gridScene, xScale, yScale);//creating the grid object
	    
	    gridScene.color = "black";//giving it default background color of black
	    // this.grid.createGridBoxes();//creating the grid boxes
	    // this.grid.createAxis();//creating the axis of the grid
	    // this.grid.calibrateAxis();//calibrating the grid
	    gridScene.render();//rendering the grid scene
	    gridScene.pause();//making sure that animation is paused on the grid scene so that the whole world is not overloaded with activities
	    return {
	      grid:grid, 
	      gridScene:gridScene,
	      integration:integration
	    }
		}
		this.runAnimations = function(){
			//this runs the animations that has been scheduled
			for(var i=0; this.animationObjects.length>i; i++){
				var animation = this.animationObjects[i];
				animation.animateTasks();//making the animations that have been added to the scene
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
			this.fitCanvasToScreen();
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
		this.fitCanvasToScreen = function(){
			//this sets the canvas to fill the width of the screen
			this.context.canvas.width = window.innerWidth;
			this.context.canvas.height = window.innerHeight;
			this.context.canvas.style.left = "0px";
			this.context.canvas.style.right = "0px";
			this.context.canvas.style.top = "0px";
			this.context.canvas.style.bottom = "0px";
			this.context.canvas.parentElement.style.overflow = 'hidden';
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
		this.makeFrames = function(interval){
			if(!interval){
				interval = this.interval;
			}
			function animator(){
				world.frameID = window.setTimeout(animator, interval);
				if(world.playAnimation){
					world.render();//rendering the scene inside the animation frame
				}
			}
			animator();
		}
		this.animate = function(interval){
			if(!interval){
				interval = this.interval;
			}
			function animator(){
				world.animationID = window.setTimeout(animator, interval);
				world.runAnimations();//running the computations for the animations on the scene.
			}
			animator();
		}
		this.pause = function(){
			//this cancels all the animations and frame rendering going on
			this.playAnimation = false;
			window.cancelAnimationFrame(this.frameID);
			window.clearTimeout(this.animationID);
		}
		this.play = function(){
			//this plays the animation by restarting it if it has stopped
			this.playAnimation = true;
			this.animate();
			this.makeFrames();
		}
	}


	function ImageObject(filePath, x, y, width, height){
		//this is the function that will take care of playing a video in the canvas. 
		//the hack is that the video is placed on the canvas as an image so as the canvas rerenders the frames of the video is being displayed
		//while the audio of the video is being played by the browser as the video is element itself is hidden
		this.x = x, this.y = y, this.width = width, this.height = height;
		this.initialX = this.x, this.initialY = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
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
		this.initialX = this.x, this.initialY = this.y;//tamper proofing so as to get back to initial value if object is added and removed from another
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
			
			// this.element.width = this.renderingWidth;
			// this.element.height = this.renderingHeight;
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

	function Equation(obj){
	  //this is the constructor function for the equation object
	  if(typeof obj != "object"){
	    throw('parameter must be an object to create an equation');
	  }
	  this.xOrigin = 0;//setting X and Y origins as 0
	  this.yOrigin = 0;
	  this.x = 0;
	  this.y = 0;
	  this.xScale = 1; //this is the scale that will be used for the graphing on the x - axis
	  this.yScale = 1; //this is the scale that will be used on the x-axis
	  this.ended = false; //this sets if the computation should end or not
	  this.delay = 100;
	  this.compute = function(){
	    //this is the method for doing the computation for the equation
	  }
	  this.constraint = function(){
	    //this method puts a contraint on the object
	    return false;//returning false by default 
	  }
	  this.end = function(){
	    //this method states if the computation plot has ended or not
	    this.ended = true;//returning true by default ends the computation plot
	  }
	  this.increment = function(){
	    //this method defines how the values in the equation should be incremented
	  }
	  this.initialize = function(){
	    //this is where initialization can be done before the loop starts
	  }
	  this.start = function(){
	    this.initialize();
	    this.animation = new Animation(this.obj.world);//creating new animation for it to prevent lazy loading
	    this.animation.setInterval(this);
	    //add program statement to kikl the animation instance later on when the plotting is dine
	    //any animation on the xandra object will happen asynchronously with this, so if you want it to happen after this is done, then check to know when it is ended to execute the required animation s
	  }
	  this.loop = function (){
	    if(this.constraint() == true){
	      //do the ploting only when it is within the constraint, since it may be desired to plot the value when it is within
	      //a give constraint and when it is out for harmonic function, so it is best to do it this way to allow developers add
	      //such feature to they software while developing
	      this.employ();//employ the data from the coomputation of the equation. Utilize the method to use the data
	    }
	    if(this.constraint() == false){
	      this.end();
	      if(this.ended === true){
	        this.status = false;
	      }else{
	        this.status = true;
	      }
	    }
	    this.increment();
	    this.compute();
	  }
	  Object.assign(this, obj);//copying the properties from the object given in parameter to the default objec, properties are overwritten
	}

	function Grid(parent, scene, xScale, yScale){
	  this.parent = parent;
	  this.width = parent.width;
	  this.height = parent.height;
	  this.world = scene;//Note that the scene can also be the parent housing the grid
	  this.gridBoxes = new Array();//the grid boxes
	  this.calibrations = new Array();//this holds the calibrations
	  this.xScale = xScale;//scale to be used on x-axis
	  this.yScale = yScale;//scale on y-axis
	  //the above means that each box is a 20*20 pixel box
	  /*Note to change the direction of any axis make the scale on that axis negative of the current scale
	  e.g this.xScale = -100
	  */
	  this.xOrigin = parent.width/2;//the x Origin of the grid
	  this.yOrigin = parent.height/2;//the y origin of tge grid
	  this.posXNum = Math.ceil(this.xOrigin/Math.abs(this.xScale));//number of grid boxes in a single row in the positive x direction measuring from the origin, it is equivalent to number of grid lines in the positive x axis.
	  this.negXNum = this.posXNum;//negative part of the above.
	  this.posYNum = Math.ceil(this.yOrigin/Math.abs(this.yScale));//the above for y
	  this.negYNum = this.posYNum;
	  this.xAxis = null;//the x axis
	  this.yAxis = null;//the y axis
	  this.props = {
	    lineWidth:1,
	    fillStyle:"white",
	    strokeStyle:"white",
	    globalAlpha:0.4
	  }
	  this.createGridBoxes = function (){
	    //this method creates the grid boxes from the parameter of the grid object
	    delete this.gridBoxes;//deleting the previous array
	    this.gridBoxes = new Array();//creating new one
	    for(var x = 0; x<this.posXNum; x++){
	      //for (x, y)
	      for(var y = 0; y<this.posYNum; y++){
	        this.createGridBox(x, y);
	      }
	      //for (x, -y)
	      for(var y = 1; y<=this.negYNum; y++){
	        this.createGridBox(x, -y);
	      }
	      
	    }
	    for(var x = 1; x<=this.negXNum; x++){
	      //for (-x, y)
	      for(var y = 0; y<this.posYNum; y++){
	        this.createGridBox(-x, y);
	      }
	      //for (-x, -y)
	      for(var y = 1; y<=this.negYNum; y++){
	        this.createGridBox(-x, -y);
	      }
	      
	    }
	  }
	  this.createAxis = function (){
	    //this method draws the axis on of the grid
	    this.xAxis = new StraightLineObject(0, this.yOrigin, this.width, this.yOrigin);
	    this.xAxis.props = {
	      lineWidth:4,
	      strokeStyle:"lightgreen",
	      globalAlpha:0.5
	    }
	    
	    this.yAxis = new StraightLineObject(this.xOrigin, 0, this.xOrigin, this.height);
	    this.yAxis.props = {
	      lineWidth:4,
	      strokeStyle:"lightgreen",
	      globalAlpha:0.4
	    }
	    
	    this.parent.addChild(this.xAxis);
	    this.parent.addChild(this.yAxis);
	  }
	  this.calibrateAxis = function (){
	    //this method calibrates the axis
	    //for +x direction
	    for(var x=0; x<=this.posXNum; x++){
	      this.calibrate(x, 0, x);
	    }
	    //for -x direction
	    for(var x=1; x<=this.negXNum; x++){
	      this.calibrate(-x, 0, -x);
	    }
	    //for +y direction 
	    for(var y=0; y<=this.posYNum; y++){
	      this.calibrate(0, y, y);
	    }
	   //for -y direction 
	    for(var y=1; y<=this.negYNum; y++){
	      this.calibrate(0, -y, -y);
	    }
	  }
	  this.calibrate = function (x, y, value){
	    //this method calibrates any point in the grid, given x, y.
	    var calib = new TextObject(value, this.xOrigin + x*this.xScale, this.yOrigin + y*this.yScale, true);
	    
	    this.calibrations.push(calib);
	    calib.xCord = x;
	    calib.yCord = y;
	    calib.value = value;
	    
	    this.parent.addChild(calib);
	    Object.assign(calib.props, this.props);
	    
	    calib.props.font = Math.ceil((Math.abs(this.xScale)+Math.abs(this.yScale))/7) + "px " + "bold italic";
	  }
	  this.createGridBox = function (x, y){
	    //this method takes cordinate parameter on the grid and creates a grid box on that cordinate
	    var box = new RectObject(this.xOrigin + x*this.xScale, this.yOrigin + y*this.yScale, this.xScale, this.yScale);
	    this.gridBoxes.push(box);
	    box.xCord = x;
	    box.yCord = y;
	    this.parent.addChild(box);
	    Object.assign(box.props, this.props);
	  }
	  this.renderBoxes = function(){
	    for(var i=0; i<this.gridBoxes.length; i++){//this will render all the gride boxes
	      this.gridBoxes[i].render();
	    }
	  }
	  this.renderCalibrations = function(){
	    //this method renders the calibrations
	    for(var i=0; i<this.calibrations.length; i++){//this will render all the gride boxes
	      this.calibrations[i].render();
	    }
	  }
	  this.createAndRender = function(axis=true, calibration=true){
	    //this method creates the gridBoxes and the axis with it's calibration and renders it depending on parameter given
	    this.createGridBoxes();
	    this.renderBoxes();
	    if(axis===true){
	      this.createAxis();
	      this.xAxis.render();
	      this.yAxis.render();
	    }
	    if(calibration ===true){
	      this.calibrateAxis();
	      this.renderCalibrations();
	    }
	  }
	  this.render = function (){
	    this.renderBoxes();
	    if(this.xAxis){
	      this.xAxis.render();
	    }
	    if(this.yAxis){
	      this.yAxis.render();
	    }
	    this.renderCalibrations();
	    
	  }
	  this.getBox = function(x, y){
	    //this method gets a box based on it x, y position
	    for(var i = 0; i<this.gridBoxes.length; i++){
	      var box = this.gridBoxes[i];
	      if(box.xCord == x && box.yCord == y){
	        
	        return box;
	        //break;
	      }
	    }
	    return null;
	  }
	  this.getCalibration = function(x, y){
	    for(var i = 0; i<this.calibrations.length; i++){
	      var calib = this.calibrations[i];
	      if(calib.xCord == x && calib.yCord == y){
	        return calib;
	      }
	    }
	    return null;
	  }
	  this.removeBox = function(box){
	    //this method removes the box from the grid.
	    this.parent.removeChild(box);//removes it from the parent object
	    var index = this.gridBoxes.indexOf(box);
	    this.gridBoxes.splice(index, 1);//removing it from the grid boxes array
	    //delete box;//deleting the box object
	  }
	  this.removeCalibration = function(calib){
	    //this method removes the calibration from the grid
	    this.parent.removeChild(calib);//removes it from the parent object
	    var index = this.calibrations.indexOf(calib);
	    this.calibrations.splice(index, 1);//removing it from the calibrations array
	  }
	  this.point = function(x, y, radius = 5){
	    //this reveals a point on the grid
	    var point = new CircleObject(this.xOrigin + x*this.xScale, this.yOrigin + y*this.yScale, radius, true );
	    this.parent.addChild(point);
	    Object.assign(point.props, this.props);
	    point.render();
	    return point;
	  }
	  this.place = function(obj, x, y){
	    //this method places a sanim Object at a particular point on the grid
	    var pX=0, pY=0;//parent X and Y position
	    if(this.parent.x){
	      pX = this.parent.x;
	      pY = this.parent.y;
	    }
	    obj.x = this.xOrigin + x*this.xScale + pX;
	    obj.y = this.yOrigin + y*this.yScale + pY;
	  }
	}
	function ArrowHeadObject(x, y, directionAngle, arrowLength = 20, arrowAngle=Math.PI/3){
		this.directionAngle = directionAngle;//the angle telling the direction the arrow is facing
		this.arrowAngle = arrowAngle;//the angle between the two arrow wings
		this.arrowLength = arrowLength;//the length of the arrow wings
		var pointEx = - Math.cos(this.directionAngle - this.arrowAngle/2)*this.arrowLength;
		var pointEy =  Math.sin(this.directionAngle - this.arrowAngle/2)*this.arrowLength;
		var pointDx = - Math.cos(this.directionAngle + this.arrowAngle/2)*this.arrowLength;
		var pointDy =  Math.sin(this.directionAngle + this.arrowAngle/2)*this.arrowLength;
		var paths = [{pathMethod:"moveTo", params:[pointEx,pointEy]},{pathMethod:"lineTo", params:[0, 0]}, {pathMethod:"lineTo", params:[pointDx, pointDy]}];
		//the above creates the path to be passed while calling sanim path object
		PathObject.call(this, x, y, paths);
		this.alignOriginWithParent = function(){
			//this method sets the rendering origin parameter of the object to align with the parent object
			if(this.parentObject){
				//checking if the object has parent, so we could readjust to fit to the parent object
				this.x = this.initialX + this.parentObject.x;
				this.y = this.initialY + this.parentObject.y;
			}
			var pointEx = - Math.cos(this.directionAngle - this.arrowAngle/2)*this.arrowLength;
			var pointEy =  Math.sin(this.directionAngle - this.arrowAngle/2)*this.arrowLength;
			var pointDx = - Math.cos(this.directionAngle + this.arrowAngle/2)*this.arrowLength;
			var pointDy =  Math.sin(this.directionAngle + this.arrowAngle/2)*this.arrowLength;
			this.initialPaths = [{pathMethod:"moveTo", params:[pointEx,pointEy]},{pathMethod:"lineTo", params:[0, 0]}, {pathMethod:"lineTo", params:[pointDx, pointDy]}];
		
		}
	}
	function Xandra(scene, x, y, animation){
		this.world = scene;
		if(animation){
			this.animation = animation;
		}else{
			this.animation = new Animation (this.world);
		}
		this.x = x;
		this.y = y;
		this.turnAngle = 0;
		this.currentX = 0;// x and y current positions
		this.currentY = 0;
		this.interval = 100;// interval of time for animation to occur
		this.draw = true//this property toggles if the pen is up or down
		this.play = true;//this property sets if the animation should be played or not
		this.fragments = 2;//this is the number of fragments to create for each movement
		this.pathObjects = new Array();//this holds the individual paths drawn.
		this.animation.asynchronous = false;//stopping asynchronous animation

		this.delay = function(time){
			//this method adds a delay to the drawing depending on the parameter given
			this.animation.sleep(time);
		}
		this.execute = function (func){
			//this executes a given function
			var self = this;
			var x = this.currentX;
			var y = this.currentY;

			  this.animation.execute(function (){
			    if(self.draw===true){
			      func();
			      if(self.world.playAnimation === false && self.play===true){
			      	//this hacks makes it possible for Xandra path object to draw on the scene even when the scene frame is off
			      	//to make sure that Xandra path object does not draw, set the play property to false.
			        self.renderLast();
			      }
			    }else{
			      self.moveToCurrentPosition(x, y);
			    }
			  });
			if(this.interval > 0){
			  this.animation.sleep(this.interval);
			}
		}
		this.moveToCurrentPosition = function(x, y){
			//this method moves the cursor to it's calculated current position
			var lastPath = this.initialPaths[this.initialPaths.length-1];
			if(lastPath.pathMethod=="moveTo"){
			  lastPath.params[0]=x;
			  lastPath.params[1]=y;
			}else{
			  var path = {pathMethod:"moveTo", params:[x, y]};
			  this.appendPath(path);
			}


		}
		this.turn = function(angle){
			//this method turns by the provided angle
			this.turnAngle += angle;
			var self = this;
			this.execute(function (){
			  
			});
		}
		this.left = function (angle){
			//this implements the left turn algorithm
			this.turn(Math.abs(angle));
		}
		this.right = function (angle){
			//this method implements the right turn
			this.turn(-Math.abs(angle));
		}
		this.calculateLandingPosition = function (length, angle){// this calculates landing position based on the length it is given
			if(!angle){
			  angle = this.turnAngle;
			}else{
			  angle += this.turnAngle;
			}
			var x = Math.cos(angle) * length;
			var y = Math.sin(angle) * length;
			return {x:this.currentX + x, y:this.currentY - y, angle:angle};

			}
			this.move = function(length){

			this.fragments = Math.floor(Math.abs(this.fragments));
			length = length/(this.fragments+1);
			var self = this;
			for(var i =0; i <= this.fragments; i++){
				(function(){// using IIFE to remove the function scope effect of var.
					var cord = self.calculateLandingPosition(length);
					var x = self.currentX;//to hold previous positions
					var y = self.currentY;
					self.currentX = cord.x;
					self.currentY = cord.y;
					self.execute(function(){
					  var path = {pathMethod:"lineTo", params:[cord.x, cord.y]};
					  self.appendPath(path);
					  //below is where the sanim path object is being created for this movement
					  self.pathObjects.push(self.makeObject(x, y, [path]));
					});
				})();
			}

		}
		this.forward = function (length){
			//this moves it forward
			this.move(Math.abs(length))//making sure that it is forward
		}
		this.backward = function(length){
			//this moves it backward
			this.move(-Math.abs(length))//making sure that it is backward
		}
		this.computeArcParams = function (radius, angle, concave=false){
			//this method computes arc params
			angle = Math.abs(angle);
			var cord = this.calculateLandingPosition(radius, -Math.PI/2);
			var startAngle = Math.PI*3/2 - this.turnAngle;
			var endAngle = angle+startAngle;
			var arcPath = {pathMethod:"arc", params:[cord.x, cord.y, radius, startAngle, endAngle, concave]}
			var turnAngle = cord.angle;

			return {path:arcPath, angle:turnAngle, x:cord.x, y:cord.y}
		}
		this.arc = function(radius, angle, concave=false){
			//this method draws the arc
			//radius = Math.abs(radius);
			var self = this;
			this.fragments = Math.floor(Math.abs(this.fragments));
			angle = angle/(this.fragments + 1);
			for(var i = 0; i<=this.fragments;i++){
				//var initialTurnAngle = this.turnAngle;
				(function(){//using IIFE to execute, as a hack to the function scope effect of var
					var params = self.computeArcParams(radius, angle, concave);
					self.turnAngle = params.angle;
					//below is cordinate at the center of drawn circle
					self.currentX = params.x;
					self.currentY = params.y;
					//calculating new cordinate
					var newCord = self.calculateLandingPosition(radius, Math.PI - angle);
					self.currentX = newCord.x;
					self.currentY = newCord.y;
					self.turnAngle = newCord.angle - Math.PI/2;

					self.execute(function(){
					  
					  self.appendPath(params.path);
					  self.pathObjects.push(self.makeObject(params.path.params[0], params.path.params[1], [params.path], "arc"));
					});
				})();
			}

		}
		this.drawingStatus = function (){
			//this method gets the drawing status
			return this.draw;
		}
		this.getCurrentPosition = function(){
			//this method gets the current position of the pen in the canvas with respect to the origin of the pen
			return {x:this.currentX, y:this.currentY, angle:this.angle};
		}
		this.penUp = function (){
			//this method triggers the raising of the pen
			var self = this;
			this.animation.execute(function (){
			  self.draw = false;
			});//so that nothing gets drawn
		}
		this.penDown = function (){
			//this method triggers the pen to be brought down for drawing
			var self = this;
			var x = this.currentX;
			var y = this.currentY;
			this.animation.execute(function (){
			  self.draw = true;
			});
		}
		this.setPosition = function (x, y){
			//this method sets the position of the pen in the it's drawing canvas with respect to it's origin
			var previousX = this.currentX;//holding previous positions
			var previousY = this.currentY;
			this.currentX = x;
			this.currentY = y;

			var self = this;
			this.execute(function (){
			  var path ={pathMethod:"lineTo", params:[x, y]};
			  self.pathObjects.push(self.makeObject(previousX, previousY, [path]));
			  self.appendPath(path);
			});
			//this.moveToCurrentPosition();
		}
		this.makeObject = function(x, y, paths, type="line"){
			//this method makes the pathObject
			if(type!="arc"){
			  
			  var newPaths = [{pathMethod:"moveTo", params:[x, y]}, ...paths];
			}else{
			  var newPaths = [...paths];
			}
			var obj = new PathObject(0, 0, newPaths);
			obj.props={
			  fillStyle:this.props.fillStyle,
			  strokeStyle:this.props.strokeStyle,
			  lineWidth:this.props.lineWidth
			}
			return obj;

		}
		this.clonePath = function (path){
			//this method clones a path
			var newPath = {pathMethod:path.pathMethod, params:new Array()};
			for(var j=0; j<path.params.length; j++){
				newPath.params.push(path.params[j]);
			}
			return newPath;
		}
		this.clonePaths = function(paths){
			//this method clones an array paths
			var newPaths = new Array();
			for(var i = 0; i<paths.length; i++){//trying to assign the paths to renderingPaths;
				var path = this.clonePath(paths[i]);
				newPaths.push(path);
			}
			return newPaths;
		}
		this.renderLast = function (){
			//this method renders the last object in the array of PathObjects
			var last = this.pathObjects[this.pathObjects.length-1];
			//this.addChild(last);
			last.world = this.world;
			last.x = this.x;
			last.y = this.y;
			last.render();
		}
		this.stampArrowHead = function(length = 20, angle=Math.PI/3){
			//this method stamps a cursor to the PathObject
			//add this as an object of it's own instead, arrowPointer
			//the angle provided is the angle of separation between the arrow wings
			var arrowHead = new ArrowHeadObject(this.currentX, this.currentY, this.turnAngle, length, angle);//creating the arrow head
			Object.assign(arrowHead.props, this.props);//arrow head inheriting from parent props
			var self = this;
			this.execute(function(){//scheduling the arrow to be added to the Xandra path
				self.addChild(arrowHead);//adding the arrow head to the parent object
			});
			return arrowHead;//returning the arrow head so that developer can use it if need be
		}
	  
	  //--------------------graphing---------------------------------------
	  this.graph = function(equation){
	    //this method plots an equation by adding a plot property to the equation
	    var grapher = {
	      xOrigin:this.currentX,
	      yOrigin:this.currentY,
	      obj:this,
	      type:'line',
	      size:0.5,//size of the dot when ploted as a scatter diagram
	      setOrigin : function(){
	        //this method plots the points each time
	        this.compute();
	        if(this.xOrigin+this.x != this.obj.currentX || this.yOrigin+this.y != this.obj.currentY){
	          //checking if the origin + first values (x, y) is different from the obj origin so that we can set point to that origin else we live the xandra's current
	          //position where it is
	          this.obj.setPosition(this.xOrigin+this.x*this.xScale, this.yOrigin+this.y*this.yScale);
	        }
	      },
	      employ: function (){
	        //this method employs the data from the equation and uses it to perform some functions
	        if(this.type === 'line'){
	          //do things with point when it is line
	          this.obj.penDown();
	          this.obj.setPosition(this.x*this.xScale + this.xOrigin, this.y*this.yScale + this.yOrigin);
	        }else if(this.type === 'scatter'){
	          //do things when it is scatter ploting
	          this.obj.penUp();
	          this.obj.setPosition(this.x*this.xScale + this.xOrigin, this.y*this.yScale + this.yOrigin);
	          this.obj.penDown();
	          this.obj.arc(this.size, Math.PI*2);
	        }else if(this.type === 'horizontal-stripe'){
	          //do things when it is a horizontal strip
	          this.obj.penUp();
	          this.obj.setPosition(this.xOrigin, this.y*this.yScale + this.yOrigin);
	          this.obj.penDown();
	          this.obj.setPosition(this.x*this.xScale + this.xOrigin, this.y*this.yScale + this.yOrigin);
	        }else if(this.type === 'vertical-stripe'){
	          //do things when it is a vertical strip
	          this.obj.penUp();
	          this.obj.setPosition(this.x*this.xScale + this.xOrigin, this.yOrigin);
	          this.obj.penDown();
	          this.obj.setPosition(this.x*this.xScale + this.xOrigin, this.y*this.yScale + this.yOrigin);
	        }else if(this.type === 'vector'){
	          //things to implement when it is a vector plotting
	          this.obj.penUp();
	          this.obj.setPosition(this.xOrigin, this.yOrigin);
	          this.obj.penDown();
	          this.obj.setPosition(this.x*this.xScale + this.xOrigin, this.y*this.yScale + this.yOrigin);
	        }
	      }
	    }
	    Object.assign(grapher, equation);
	    grapher.initialize =function(){
	      this.setOrigin();//setting the origin as initialization
	    }
	    return grapher;
	  }

	  var initialPath =[{pathMethod:"moveTo", params:[this.currentX,this.currentY]}];
	  PathObject.call(this, x, y, initialPath);
	  this.world.addObject(this)
	}

	return {
		Scene:Scene,
		Camera:Camera,
		Player:Player,
		SanimObject:SanimObject,
		PathObject:PathObject,
		RectObject:RectObject,
		TextObject:TextObject,
		CircleObject:CircleObject,
		StraightLineObject:StraightLineObject,
		ArrowHeadObject:ArrowHeadObject,
		Grid:Grid,
		Xandra:Xandra,
		ImageObject:ImageObject,
		VideoObject:VideoObject,
		AudioObject:AudioObject,
		Integration:Integration,
		Animation:Animation,
		Task:Task,
		Equation:Equation,
	}
})();

/*
Exporting the module for use below
*/

try{
	var keys = Object.keys(Sanim);// getting the key names of the properties of Sanim
	for(var i = 0; i<keys.length; i++){
		var key = keys[i];//the key at the given index
		exports[key] = Sanim[key];//assign the property to the exports object
	}
}catch(error){
	console.warn("You are not running Sanim-Kit on a server, make sure to refer to Sanim-kit using the keyword Sanim, which is a global variable holding the accessible constructors");
}