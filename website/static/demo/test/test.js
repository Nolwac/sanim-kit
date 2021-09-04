

window.onload = function(){
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var scene = new Sanim.Scene(context);
  scene.color = "black";
  scene.isParentWorld = true;
  
  scene.context.canvas.width = window.innerWidth;
  scene.context.canvas.height = window.innerHeight;
  scene.render();
  var testCircle = new Sanim.CircleObject(100,100, 20, true);
  testCircle.props = {
    fillStyle:"lightgreen"
  }
  scene.addObject(testCircle);
  scene.render();
  //scene.playAnimation = false;
  
  
  var pen = new Sanim.Xandra(scene, 100, 100);
  //pen.play = false;
  pen.props={
    fillStyle:"crimson",
    strokeStyle:"orange",
    lineWidth:2
  }
  function moveCircle(){
    pen.fragments = 0;
    pen.penUp();
    pen.x = scene.width/2, pen.y=scene.height/2;
    testCircle.x = scene.width/2, testCircle.y = scene.height/2;
    var equation = new Sanim.Equation ({
      xScale:100,
      yScale:-50,
      x:-4,
      y:0,
      delay:30,
      type:"line",
      size:2,
      compute: function(){
        this.y = Math.pow(this.x, 2);
      },
      constraint: function(){
        return this.x <= 4.002;
      },
      increment: function(){
        this.x+=0.05;
      }
    });
    pen.animation.execute(function (){
      var mover = testCircle.motionPath(equation);
      mover.delay = 30;
      var line = pen.graph(equation);
      line.start();
      mover.start();
    });
  }
  //moveCircle();
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
    var equation = new Sanim.Equation({
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
    for(var i=1; i<=n; i++){
      fib = nfib[i-1] + nfib[i];
      nfib[i+1] = fib;
      pen.arc(fib*scale, Math.PI*3);
    }
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
  
 var gd = scene.createGrid(100, 50);
  // gd.grid.posXNum = 3;
  // gd.grid.negXNum = 3;
  // gd.grid.posYNum = 3;
  // gd.grid.negYNum = 3;
  gd.grid.createAndRender();
  gd.gridScene.render();
  var gridBox = gd.grid.getBox(1, 5);
  if (gridBox){
    gridBox.props.fillStyle = "green";
    gridBox.fillRect = true;
    //gridbox.scale(10, 10)
    //gd.gridScene.render();
  }
  gd.grid.point(-2, 6, 10);
  var calib = gd.grid.getCalibration(-2, 0);
  if(calib){
    calib.scale(3, 3);
  }
  var box = gd.grid.getBox(-1, 5);
  gd.grid.removeBox(box);
  var calib2 = gd.grid.getCalibration(-1, 0);
  gd.grid.removeCalibration(calib2);
  //gd.grid.place(testCircle, 3.3, 4);
  gd.gridScene.render();
  testCircle.fadeOut(pen.animation, 1000);
  pen.animation.sleep(1000);
  testCircle.fadeIn(pen.animation, 1000);
  var text = new Sanim.TextObject("How are you doing dear friend", 100, 100, true);
  text.props = {
    font: "40px bold arial"
  }
  scene.addObject(text);
  text.fadeOut(pen.animation, 100);
  text.fadeIn(pen.animation, 1000);
  text.write(pen.animation, 2000);
  var text2 = new Sanim.TextObject("2", 200, 200, true);
  text2.props = {
    font: "120px san-serif",
    fillStyle: "orange"
  }
  scene.addObject(text2);
  text2.superscript('5', 4/10);
  text2.subscript('10', 1/3);

}