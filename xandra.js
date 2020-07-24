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
  this.fragments = 2;//this is the number of fragments to create for eachmovement
  this.fillColor = "crimson";
  this.strokeColor = "green";
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
          }//else if(self.play==true){
          //   self.world.pause();
          //   self.render();
            
          // }
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
  this.mov = function(length){
    
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
  this.make = function (){

  }
  
  //--------------------equation---------------------------------------
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
      apply: function (){
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
      this.apply();//applying the computation
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
CircleObject.prototype.motionPath = function(equation){
    //this method moves the object in the canvas using the equation object
    var mover = {
      obj:this,
      apply: function (){
        console.log(this.yOrigin);
        this.obj.x = this.xOrigin + this.x*this.xScale;
        this.obj.y = this.yOrigin + this.y*this.yScale;
      }
    }
    Object.assign(mover, equation);//assigning the equation
    mover.xOrigin = this.x;//changing the origin to the origin of the object
    mover.yOrigin = this.y;
    return mover;
  }
window.onload = function(){
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var scene = new Scene(context);
  scene.color = "black";
  scene.isParentWorld = true;
  
  scene.context.canvas.width = window.innerWidth;
  scene.context.canvas.height = window.innerHeight;
  scene.render();
  var testCircle = new CircleObject(500,300, 20, true);
  testCircle.props = {
    fillStyle:"lightgreen"
  }
  scene.addObject(testCircle);
  scene.render();
  //scene.playAnimation = false;
  
  
  var pen = new Pen(scene, 500, 300);
  //pen.play = false;
  pen.props={
    fillStyle:"crimson",
    strokeStyle:"orange",
    lineWidth:2
  }
  function moveCircle(){
    pen.fragments = 0;
    pen.penUp();
    var equation = new Equation ({
      xScale:100,
      yScale:50,
      x:-4,
      y:0,
      delay:30,
      type:"line",
      size:2,
      compute: function(){
        this.y = this.x**2;
      },
      constraint: function(){
        return this.x <= 4.002;
      },
      increment: function(){
        this.x+=0.05;
      }
    });
    var mover = testCircle.motionPath(equation);
    mover.delay = 30;
    var line = pen.graph(equation);
    line.start();
    mover.start();
  }
  moveCircle();
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
  	if(radius>=1){
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
    //pen.penUp()
    test1()
    pen.penUp();
    pen.setPosition(300, 300);
    pen.penDown()
    test2()
    pen.penUp()
    pen.setPosition(300, 400);
    pen.penDown();
    pen.setPosition(400,300)
    pen.setPosition(200, 300)
    pen.penUp();
    pen.setPosition(300, 500);
    pen.penDown();
    test2();
    
  }
  function drawPaths(){
    //pen.penDown();
    pen.arc(100, scene.radian(340));
  }
  function plotEquation(){
    //testing ploting of an equation
    pen.x = -150;
    pen.y = 150;
    pen.fragments = 0;
    pen.props.lineWidth =1;
    var equation = new Equation({
      type:'scatter',
      xScale:250,
      yScale:250,
      x:0.8,
      y:0.2,
      lam:4.0,
      n:0,
      size:1,
      delay:1,
      compute: function(){
        this.y = this.y*this.x*(1-this.y);
      },
      constraint: function(){
        return this.n <= 10050.2001;
      },
      increment: function(){
        if(this.n%100==0 && this.x<4){
            this.x+=0.01;
        }else if(this.n%40==0 && this.x<3.53){
          this.x += 0.01;
          
        }else if(this.n%20==0 && this.x<3.25){
          this.x += 0.01;
        }else if(this.x<3){
          this.x+=0.01;
        }
        this.n += 1;
      }
    });
    var graph = pen.graph(equation);
    graph.start();
  }
  function drawFibonnaci(n, scale=5){
    var pen = new Pen(scene, 500, 500);
    pen.fragments = 3;
    pen.props={
      fillStyle:"crimson",
      strokeStyle:"crimson",
      lineWidth:3
    }
    var nfib = [0, 1];
    pen.penDown();
    for(let i=1; i<=n; i++){
      fib = nfib[i-1] + nfib[i];
      nfib[i+1] = fib;
      pen.arc(fib*scale, Math.PI*3);
    };
    return nfib;
  }
  //pen.animation.asynchronous = true;
  pen.fragments = 0;
  pen.interval = 0;
  //drawPaths();
  //drawCircle(300,300, 200, pen);
  //oneTwo();
  pen.penUp();
  //plotEquation();
  //drawFibonnaci(10);
  //pen.path.fillPath = true;

}