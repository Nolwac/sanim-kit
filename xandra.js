function Pen(scene, x, y, animation){
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
  this.fillColor = "crimson";
  this.strokeColor = "white";
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
    
      this.animation.instantly(function (){
        if(self.draw===true){
          func();
          if(self.world.playAnimation === false && self.play===true){
            self.renderLast();
          }
        }else{
          self.moveToCurrentPosition(x, y);
        }
      });

    this.animation.sleep(this.interval);
  }
  this.moveToCurrentPosition = function(x, y){
    //this method moves the cursor to it's calculated current position
    var lastPath = this.path.initialPaths[this.path.initialPaths.length-1];
    if(lastPath.pathMethod=="moveTo"){
      lastPath.params[0]=x;
      lastPath.params[1]=y;
    }else{
      var path = {pathMethod:"moveTo", params:[x, y]};
      this.path.appendPath(path);
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
  this.mov = function(length){
    
    var cord = this.calculateLandingPosition(length);
    var x = this.currentX;//to hold previous positions
    var y = this.currentY;
    this.currentX = cord.x;
    this.currentY = cord.y
    
    var self = this;
    this.execute(function(){
      var path = {pathMethod:"lineTo", params:[cord.x, cord.y]};
      self.path.appendPath(path);
      //below is where the sanim path object is being created for this movement
      self.pathObjects.push(self.makeObject(x, y, [path]));
    });
  }
  this.forward = function (length){
    //this moves it forward
    this.mov(Math.abs(length))//making sure that it is forward
  }
  this.backward = function(length){
    //this moves it backward
    this.mov(-Math.abs(length))//making sure that it is backward
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
    
    var initialTurnAngle = this.turnAngle;
    var params = this.computeArcParams(radius, angle, concave);
    this.turnAngle = params.angle;
    //below is cordinate at the center of drawn circle
    this.currentX = params.x;
    this.currentY = params.y;
    //calculating new cordinate
    var newCord = this.calculateLandingPosition(radius, Math.PI - angle);
    this.currentX = newCord.x;
    this.currentY = newCord.y;
    this.turnAngle = newCord.angle - Math.PI/2;
    
    var self = this;
    this.execute(function(){
      
      self.path.appendPath(params.path);
      self.pathObjects.push(self.makeObject(params.path.params[0], params.path.params[1], [params.path]));
    });
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
    this.animation.instantly(function (){
      self.draw = false;
    });//so that nothing gets drawn
  }
  this.penDown = function (){
    //this method triggers the pen to be brought down for drawing
    var self = this;
    var x = this.currentX;
    var y = this.currentY;
    this.animation.instantly(function (){
      self.draw = true;
    });
  }
  this.setPosition = function (x, y){
    //this method sets the position of the pen in the it's drawing canvas with respect to it's origin
    this.currentX = x;
    this.currentY = y;
    var self = this;
    this.execute(function (){
      self.path.appendPath({pathMethod:"lineTo", params:[x, y]})
    });
    //this.moveToCurrentPosition();
  }
  this.makeObject = function(x, y, paths){
    //this method makes the pathObject
    var newPaths = [{pathMethod:"moveTo", params:[x, y]}, ...paths];
    var obj = new PathObject(0, 0, newPaths);
    obj.props={
      fillStyle:this.fillColor,
      strokeStyle:this.strokeColor,
      lineWidth:this.path.props.lineWidth
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
    this.path.addChild(last);
    last.render();
  }
  this.make = function (){
    this.path = new PathObject(this.x, this.y, [{pathMethod:"moveTo", params:[this.currentX,this.currentY]}]);
    this.world.addObject(this.path);
  }
  
  var self = this.animation;
  this.animation.instantly = function(func){
    //performs an instant animation
    var instance = new AnimationInstance({
      world:self.world,
      status:true,
      execute: function (){
        func();
        this.status=false;
      },
      animationStatus: function (){
        return status;
      }
    });
    self.addAnimationInstance(instance)
  }
}

window.onload = function(){
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var scene = new Scene(context);
  scene.color = "black";
  var rect = new PathObject (170,100,[{pathMethod:"arc", params:[0,0, 100, Math.PI*3/2, Math.PI*2+Math.PI/4,false]}], true, true);
  rect.props={
    fillStyle:"green",
    lineWidth:4
  }
  scene.addObject(rect);
  scene.isParentWorld = true;
  
  scene.context.canvas.width = window.innerWidth;
  scene.context.canvas.height = window.innerHeight;
  scene.render();
  scene.playAnimation = false;
  
  
  var pen = new Pen(scene, 200,200);
  pen.make();
  //pen.play = false;
  pen.path.props={
    fillStyle:"crimson",
    strokeStyle:"orange",
    lineWidth:4
  }
  pen.interval = 10;
  function test1(){
    pen.forward(200);
    pen.left(scene.radian(90));
    pen.backward(200);
    pen.left(scene.radian(90))
    pen.forward(200)
    pen.right(scene.radian(225))
    pen.forward(200);
    pen.arc(100, scene.radian(180));
    pen.forward(100);
  }
  function test2(){
    for(var i=1; i<=100; i++){
      pen.forward(i*2);
      pen.left(scene.radian(170))
    }
  }
  function drawCircle(x, y, radius, pen){
  	if(radius>=5){
  		drawCircle(x-radius, y, radius/2, pen)
  		drawCircle(x+radius, y, radius/2, pen)
  		drawCircle(x, y-radius, radius/2, pen)
  		//pen.arc(radius, Math.PI*2)
  	}else{
  	  
      pen.penUp()
  		pen.setPosition(x, y)
  		pen.penDown()
  		//pen.color(random.choice(colors))
  		//pen.circle(radius)
      pen.arc(radius, Math.PI*2)
  	}
  }
  function oneTwo(){
    pen.penUp()
    test1()
    //pen.penUp();
    pen.setPosition(300, 300);
    pen.penDown()
    test2()
    pen.penUp()
    pen.setPosition(300, 900);
    pen.penDown();
    pen.setPosition(400,800)
    pen.setPosition(200, 800)
    pen.penUp();
    pen.setPosition(300, 1000);
    pen.penDown();
    test2();
    
  }
  drawCircle(300,300, 200, pen);
  //oneTwo();
  //pen.path.fillPath = true;

}