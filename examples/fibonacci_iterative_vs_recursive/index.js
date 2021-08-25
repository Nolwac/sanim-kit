
window.onload = function(){
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var scene = new Sanim.Scene(context);
  scene.color = "black";
  scene.isParentWorld = true;
  scene.context.canvas.width = window.innerWidth;
  scene.context.canvas.height = window.innerHeight;
  var anim = new Sanim.Animation(scene);
  anim.sleep(6000);//sleeping for 6 seconnds to allow fullscreen initiation before the simulation starts
  document.body.onclick = function(){
    // to put the simulation in fullscreen mode once the body is clicked on
    scene.requestFullscreen();
  }
  const dimensions = [//the dimensions of the math solution images
    [345, 37], [241, 43], [713, 38], [892, 29], [242, 48], [132, 38], [343, 37], 
    [189, 44], [141, 40], [149, 49], [231, 54], [391, 51], [72, 35], [261, 49], 
    [154, 40], [113, 28], [613, 34], [236, 36], [127, 33], [344, 36], [344, 36],[191, 40], 
    [134, 37], [138, 36], [225, 39], [306, 37], [57, 33], [234, 39], [140, 34], 
    [87, 35], [593, 36], [114, 36] 
  ];
  function fibIterative(n){
    /*
    This function calculates for the nth member of the fibonnaci series using iterative method
    */
    let num1 = 1;
    let num2 = 1;
    let current = 1;//this variable will hold the current member in the series
    while(n>=2){
      current = num1 + num2;//making the new fibonacci number the sum of the two immediate numbers before it 
      num1 = num2;
      num2 = current;
      n--;//decrementing n by 1 so that the loop could reach a halt
    }
    return current;
  }
  function fibRecursive(n){
    /*
    This function calculates for the nth member of the fibonnaci series using recursive method
    */
    if(n<=1){
      return 1;
    }else{
      return fibRecursive(n-1) + fibRecursive(n-2);
    }
  }
  function fibonacci(num1, num2, n){
    /*
    This function takes the two starting values of a fibonacci series and then adds n more members to the series
    */
    let series = new Array(num1, num2);
    let current;//this variable will hold the current member in the series
    while(n>0){
      current = num1 + num2;//making the new fibonacci number the sum of the two immediate numbers before it 
      num1 = num2;
      num2 = current;
      n--;//decrementing n by 1 so that the loop could reach a halt
      series.push(current);//pushing the current member to the array of the series
    }
    return series;
  }
  function drawNumber(num, x, y, font, color, random=false){
    /*This functions draws the fibonacci number*/
    let text = new Sanim.TextObject(num.toString(), x, y, true);
    scene.addObject(text);//adding the text to the scene
    text.props.font = font;
    text.props.fillStyle = color;
    text.hide();
    text.fadeIn(anim, 200);
    return text;
  }
  function drawFibonacci(series, x, y, font, color, xInterval=60, yInterval=0){
    /*
    This function takes a fibonacci series and renders the fibonacci number to the scene.
    It also returns an array containing the rendered number objects
    x and y arguments are the x and y starting position of the rendering,
    color is the default color of the text objects
    xInterval and yInterval is the interval of space to give for each object rendered
    and font is the default font of the text objects
    */
    let seriesObjs = new Array();//an array to hold the text objects in the series
    for(let i = 0; i<series.length; i++){
      seriesObjs.push(drawNumber(series[i], x+xInterval*i, y+yInterval*i, font, color));
    }
    return seriesObjs;
  }

  function drawSpiral(series, x, y, angle=0){
    /*
    This functions draws the spiral in the series
    angle is the angle in degree to turn before drawing the next
    */
    let spiral = new Sanim.Xandra(scene, x, y, anim);
    spiral.fibObjs = new Array();//array to hold the fibonacci text objects added to the spiral object
    spiral.props = {
      strokeStyle:"lightgreen",
      lineWidth:2
    }
    for(let i = 0; i<series.length; i++){
      let radius = series[i];
      spiral.arc(radius, scene.radian(90));
      let num = new Sanim.TextObject(`${radius}`, spiral.currentX, spiral.currentY, true);
      num.props = {
        fillStyle:"orange",
        font:"15px"
      }
      spiral.fibObjs.push(num);
      spiral.animation.execute(function(){
        spiral.addChild(num);
      });
      spiral.right(scene.radian(angle));
    }
    return spiral;
  }
  function drawRabbits(n, x, y, boxWidth, xInterval, yInterval, cols = 7, centralize = false){
    /*
    This function takes n and draws n number of rabbits to the scene with x and y spacing defined by the xInterval and yInterval
    */
    let width = (boxWidth- cols*(xInterval+1))/cols;//the width of each rabbit image
    let height = width*6/5;//the height of each rabbit image
    let rows = Math.ceil(n/cols);//the number of rows
    let boxHeight = rows*(height + yInterval+1);//the height of the box
    let rabbitBox = new Sanim.RectObject(x, y, boxWidth, boxHeight);//creating the box to hold the rabbits
    scene.addObject(rabbitBox);//adding the box holding the rabbits to the scene
    for(let i=1; i<=rows; i++){//for the rows
      for(let j=1; j<= cols; j++){
        if(rabbitBox.children.length<n){//checking if the number of rabbits has been reached
          let rabbit = new Sanim.ImageObject('images/rabbit.png', x+(j*xInterval)+width*(j-1), y+(i*yInterval)+height*(i-1), width, height);
          rabbitBox.addChild(rabbit);
        }else{
          break;
        }
      }
    }
    if(centralize == true){
      rabbitBox.alignCenter(); rabbitBox.alignMiddle();//centralizing the box
    }
    return rabbitBox;
  }
  function showRabbits(series, x, y, boxWidth){
    /*
    This function simulates rabbit growth using a fibonacci series
    */
    let rabbitBoxes = new Array();//array to hold the boxes holding the rabbit images
    for(let i = 0; i<series.length; i++){
      let n = series[i];
      let rabbitBox = drawRabbits(n, x, y, boxWidth, 20, 20, 10, true);
      let text = new Sanim.TextObject(`${n}`, -100, 0, true);//text object to hold the number of rabbits
      text.props = {
        fillStyle:"crimson",
        font:"50px solid"
      }
      rabbitBox.addChild(text)
      rabbitBox.hide(true);//hiding the rabbitBox and its children
      // rabbitBox.fadeIn(anim, 200, true);//schedulling the rabbit box to show with its children
      anim.execute(function(){rabbitBox.show(true)})
      anim.sleep(1000);
      anim.execute(function(){rabbitBox.hide(true)});
      rabbitBoxes.push(rabbitBox);//pushing the rabbit box into the array holding the rabbit boxes
    }
  }
  function timeIt(n, recursive=true){
    /*
    This function times algorithm for calculating the fibonacci of a number
    and compares it to the time complexity
    */
    let text = new Sanim.TextObject("Calculating...", 20, 20, true);
    let num;//variable to hold the number
    text.props = {
      fillStyle:"lightgreen",
      font:"30px bold"
    }

    scene.addObject(text);
    text.alignCenter();
    text.alignMiddle();
    text.hide();
    let method = new Sanim.TextObject("", 0, 150, true);//to show the method that timing is being done on
    method.props = {
      fillStyle:'orange',
      font: "30px bold"
    }
    scene.addObject(method);
    method.hide();
    let time1; let time2;//to hold the starting and ending time
    let time;//to hold the calculated time
    if(recursive == true){
      method.text = "Using Recursive approach";
    }else{
      method.text = "Using Iterative approach";
    }
    
    method.alignCenter();
    method.fadeIn(anim, 1000);
    text.write(anim, 1000);
    anim.execute(function(){
      time1 = new Date().getTime();//getting the starting time of the calculation
      if(recursive == true){
        num = fibRecursive(n);
      }else{
        num = fibIterative(n);
      }
      time2 = new Date().getTime();//getting the ending time of the calculation
      time = time2 - time1;//getting the exact time in seconds taken
    });
    anim.sleep(1000);
    anim.execute(function(){text.text = "Done!"});//saying that the calculation is done
    text.fadeOut(anim, 1000);
    anim.sleep(1000);
    anim.execute(function(){
      text.text = `Calculated fibonacci number = ${num}, where n = ${n}. Time taken = ${time}`;
      text.alignCenter();
    });
    text.fadeIn(anim, 1000);
    method.fadeOut(anim, 1000);
    anim.execute(function(){scene.removeObject(method); delete method;});
    anim.sleep(1000);//giving a little delay after timing
    return text;
  }
  function graphTime(xScale, xIncrement, xEnd, next, delay=1000){
    scene.flushObjects();
    let offset = 25;//offsets from the edge of the canvas
    let gd = scene.createGrid(100, -100);//creating a grid on the scene
    //--------------making some adjustments to the grid--------------
    gd.grid.xOrigin =  offset;
    gd.grid.yOrigin =  window.innerHeight-offset;
    gd.grid.posXNum = gd.grid.posXNum*2;
    gd.grid.negXNum = 0;
    gd.grid.posYNum = gd.grid.posYNum*2;
    gd.grid.negYNum = 0;
    //----------------adjustment ended ------------------
    gd.grid.createAndRender();//rendering the grid
    let axis = new Sanim.Xandra(scene, window.innerWidth-250, window.innerHeight-200);
    axis.props = {
      lineWidth:4,
      strokeStyle:"lightblue"
    }
    axis.forward(50); axis.forward(50);
    axis.stampArrowHead();
    let xLabel = new Sanim.TextObject(`time(x${100/xScale})`, axis.currentX + 10, axis.currentY, true);
    xLabel.props = {
      fillStyle:"yellow",
      font:"25px bold"
    }
    axis.animation.execute(function(){
      axis.addChild(xLabel);
    });
    axis.penUp();
    axis.setPosition(0, 0);
    axis.penDown();
    axis.left(Math.PI/2);
    axis.forward(50); axis.forward(50);
    axis.stampArrowHead();
    let yLabel = new Sanim.TextObject(`n(x${100/(xScale/10)})`, axis.currentX, axis.currentY-30, true);
    yLabel.props = {
      fillStyle:"red",
      font:"30px bold"
    }
    axis.animation.execute(function(){
      axis.addChild(yLabel);
    });
    let path = new Sanim.Xandra(scene, offset, window.innerHeight-offset);//creating the xandra object to draw the path
    path.props = {
      strokeStyle:"crimson",
      lineWidth:2,
    }
    let path2 = new Sanim.Xandra(scene, offset, window.innerHeight-offset);//creating the xandra object to draw the path
    path2.props = {
      strokeStyle:"orange",
      lineWidth:2,
    }
    let equation = new Sanim.Function({//the function expression for plotting the recursive type
      xScale:xScale,
      yScale:-xScale*10,
      x:0,
      y:0,
      type:"line",
      size:2,
      compute: function(){
        this.x = Math.pow(2, this.y);
      },
      increment: function(){
        this.y+=xIncrement;
      },
      constraint: function(){
        return this.y<=xEnd;
      }
    });
    let grapher = path.graph(equation);
    path.penUp();
    anim.sleep(1000);
    anim.execute(function(){grapher.start()});
    let grapher2 = path2.graph(equation);
    path2.penUp();
    path2.setPosition(0, 0);
    grapher2.compute = function(){this.x = this.y}
    anim.execute(function(){grapher2.start()});
    grapher2.onEnded = function(){
      let rt = new Sanim.TextObject("Recursive", path.currentX+10, path.currentY, true);//the text labeling for recursive graph
      rt.props = {
        fillStyle:"crimson",
        font:"25px bold"
      }
      let it = new Sanim.TextObject("Iterative", path2.currentX+10, path2.currentY, true);//the text labeling for iterative graph
      it.props = {
        fillStyle:"orange",
        font:"25px bold"
      }
      anim.sleep(3000);
      anim.execute(function(){
        path.addChild(rt);
        path2.addChild(it);
        path.stampArrowHead().rotate(scene.radian(-10));
        path2.stampArrowHead().rotate(scene.radian(-80));
        path2.animation.sleep(delay)
        path2.animation.execute(function(){next()});
      });
    }
  }
  function slide1a(delayTime=2000){
    //this is the first slide of the presentation
    //Presenting the fibonacci
    scene.flushObjects();//flushing objects in the scene
    var t = "First what is a fibonacci series?"
    var fibText = new Sanim.TextObject(t, 20, 20, true);
    scene.addObject(fibText);
    fibText.props = {
      fillStyle:"white",
      font:"30px bold"
    }
    fibText.hide();
    fibText.fadeIn(anim, 500);

    var equ = new Sanim.TextObject("f(n) = f(n-1) + f(n-2)", 0, 0, true);
    equ.props = {
      fillStyle:"grey",
      font:"30px italic"
    }
    scene.addObject(equ);
    equ.alignCenter();//aligning it to the center
    equ.alignMiddle();//aligning it to the middle
    equ.hide();
    anim.sleep(1000);
    equ.fadeIn(anim, 1000);
    var objColor = "crimson";
    var fibObjs = drawFibonacci(fibonacci(1, 1, 7), 50, 100, "30px solid", objColor);

    var text = new Sanim.TextObject("", window.innerWidth/2 - 50, window.innerHeight/2, true);//to show how the numbers add up
    text.props = {
      fillStyle:"orange",
      font:"40px solid"
    }
    scene.addObject(text);
    anim.sleep(2000);//pausing for 2 seconds
    equ.fadeOut(anim, 1000);
    anim.sleep(500);
    for(let i = 2; i<fibObjs.length; i++){
      let sf = 1.5;//scaling factor
      let obj = fibObjs[i];//the result of summing
      let num1 = fibObjs[i-2];//the summed numbers
      let num2 = fibObjs[i-1];
      anim.execute(function(){
        num1.props.fillStyle = "white"; num2.props.fillStyle = "white";//changing the color of the summed
        obj.props.fillStyle = 'orange';//changing the color of the summing result in the series
        text.text = `${num1.text} + ${num2.text} = ${obj.text}`;//showing how it was summed
        num1.scale(sf, sf); num2.scale(sf, sf); obj.scale(sf, sf);
      });
      
      anim.sleep(1000);//1 second delay
      anim.execute(function(){
        num1.props.fillStyle = objColor; num2.props.fillStyle = objColor;//changing back the colors of the summed
        obj.props.fillStyle = objColor;//changing back the color of the obj
        num1.scale(1/sf, 1/sf); num2.scale(1/sf, 1/sf); obj.scale(1/sf, 1/sf);//removing the scaling
      });
      anim.execute(function(){
        obj.hide(); num1.hide(); num2.hide();
      })
      anim.sleep(200);
      anim.execute(function(){
        obj.show(); num1.show(); num2.show();
      });
    }
    anim.sleep(5000);
    text.fadeOut(anim, 500);

    //executing the next slide
    anim.sleep(delayTime);
    anim.execute(function(){slide1b()});//executing slide 2
  }
  function slide1b(delayTime=500){
    //this is the first slide of the presentation
    //Presenting the fibonacci
    scene.flushObjects();//flushing objects in the scene
    var t = "The series can start with 0 and 1"
    var fibText = new Sanim.TextObject(t, 20, 20, true);
    scene.addObject(fibText);
    fibText.props = {
      fillStyle:"white",
      font:"30px bold"
    }
    fibText.hide();
    fibText.fadeIn(anim, 500);

    var equ = new Sanim.TextObject("f(n) = f(n-1) + f(n-2)", 0, 0, true);
    equ.props = {
      fillStyle:"grey",
      font:"30px italic"
    }
    scene.addObject(equ);
    equ.alignCenter();//aligning it to the center
    equ.alignMiddle();//aligning it to the middle
    equ.hide();
    anim.sleep(1000);
    equ.fadeIn(anim, 1000);
    var objColor = "crimson";
    var fibObjs = drawFibonacci(fibonacci(0, 1, 8), 50, 100, "30px solid", objColor);

    var text = new Sanim.TextObject("", window.innerWidth/2 - 50, window.innerHeight/2, true);//to show how the numbers add up
    text.props = {
      fillStyle:"orange",
      font:"40px solid"
    }
    scene.addObject(text);
    anim.sleep(2000);//pausing for 2 seconds
    equ.fadeOut(anim, 1000);
    anim.sleep(500);
    for(let i = 2; i<fibObjs.length; i++){
      let sf = 1.5;//scaling factor
      let obj = fibObjs[i];//the result of summing
      let num1 = fibObjs[i-2];//the summed numbers
      let num2 = fibObjs[i-1];
      anim.execute(function(){
        num1.props.fillStyle = "white"; num2.props.fillStyle = "white";//changing the color of the summed
        obj.props.fillStyle = 'orange';//changing the color of the summing result in the series
        text.text = `${num1.text} + ${num2.text} = ${obj.text}`;//showing how it was summed
        num1.scale(sf, sf); num2.scale(sf, sf); obj.scale(sf, sf);
      });
      
      anim.sleep(1000);//1 second delay
      anim.execute(function(){
        num1.props.fillStyle = objColor; num2.props.fillStyle = objColor;//changing back the colors of the summed
        obj.props.fillStyle = objColor;//changing back the color of the obj
        num1.scale(1/sf, 1/sf); num2.scale(1/sf, 1/sf); obj.scale(1/sf, 1/sf);//removing the scaling
      });
      anim.execute(function(){
        obj.hide(); num1.hide(); num2.hide();
      })
      anim.sleep(200);
      anim.execute(function(){
        obj.show(); num1.show(); num2.show();
      });
    }
    anim.sleep(5000);
    text.fadeOut(anim, 500);

    //executing the next slide
    anim.sleep(delayTime);
    anim.execute(function(){slide1c()});//executing slide 2
  }
  function slide1c(delayTime=500){
    //this is the first slide of the presentation
    //Presenting the fibonacci
    scene.flushObjects();//flushing objects in the scene
    var t = "The series can start with any two numbers"
    var fibText = new Sanim.TextObject(t, 20, 20, true);
    scene.addObject(fibText);
    fibText.props = {
      fillStyle:"white",
      font:"30px bold"
    }
    fibText.hide();
    fibText.fadeIn(anim, 500);

    var equ = new Sanim.TextObject("f(n) = f(n-1) + f(n-2)", 0, 0, true);
    equ.props = {
      fillStyle:"grey",
      font:"30px italic"
    }
    scene.addObject(equ);
    equ.alignCenter();//aligning it to the center
    equ.alignMiddle();//aligning it to the middle
    equ.hide();
    anim.sleep(1000);
    equ.fadeIn(anim, 1000);
    var objColor = "crimson";
    var fibObjs = drawFibonacci(fibonacci(-3, 1, 8), 50, 100, "30px solid", objColor);

    var text = new Sanim.TextObject("", window.innerWidth/2 - 50, window.innerHeight/2, true);//to show how the numbers add up
    text.props = {
      fillStyle:"orange",
      font:"40px solid"
    }
    scene.addObject(text);
    anim.sleep(2000);//pausing for 2 seconds
    equ.fadeOut(anim, 1000);
    anim.sleep(500);
    for(let i = 2; i<fibObjs.length; i++){
      let sf = 1.5;//scaling factor
      let obj = fibObjs[i];//the result of summing
      let num1 = fibObjs[i-2];//the summed numbers
      let num2 = fibObjs[i-1];
      anim.execute(function(){
        num1.props.fillStyle = "white"; num2.props.fillStyle = "white";//changing the color of the summed
        obj.props.fillStyle = 'orange';//changing the color of the summing result in the series
        text.text = `${num1.text} + ${num2.text} = ${obj.text}`;//showing how it was summed
        num1.scale(sf, sf); num2.scale(sf, sf); obj.scale(sf, sf);
      });
      
      anim.sleep(1000);//1 second delay
      anim.execute(function(){
        num1.props.fillStyle = objColor; num2.props.fillStyle = objColor;//changing back the colors of the summed
        obj.props.fillStyle = objColor;//changing back the color of the obj
        num1.scale(1/sf, 1/sf); num2.scale(1/sf, 1/sf); obj.scale(1/sf, 1/sf);//removing the scaling
      });
      anim.execute(function(){
        obj.hide(); num1.hide(); num2.hide();
      })
      anim.sleep(200);
      anim.execute(function(){
        obj.show(); num1.show(); num2.show();
      });
    }
    anim.sleep(5000);
    text.fadeOut(anim, 500);

    //executing the next slide
    anim.sleep(delayTime);
    anim.execute(function(){slide2()});//executing slide 2
  }
  function slide2(delayTime=2000){
    //this is the second slide
    scene.flushObjects();
    let spiral = drawSpiral(fibonacci(1, 1, 13), window.innerWidth/2, window.innerHeight/2);
    //spiral.grow(anim, 5, 500);

    anim.sleep(delayTime);
    anim.execute(function(){slide3()});//executing slide 3
  }
  function slide3(delayTime=2000){
    scene.flushObjects();
    var t = "The population growth of rabbits is said to follow the fibonacci sequence";
    var fibText = new Sanim.TextObject(t, 20, 20, true);
    scene.addObject(fibText);
    fibText.props = {
      fillStyle:"white",
      font:"30px bold"
    }
    fibText.hide();
    fibText.fadeIn(anim, 1000);
    let series = fibonacci(1, 2, 8);
    let rabbitBoxes = showRabbits(series, 0, 0, 500);

    anim.sleep(delayTime);
    anim.execute(function(){slide4()});//calling slide4
  }
  function slide4(delayTime=2000){
    scene.flushObjects();
    var t = "Which approach is better?";
    var fibText = new Sanim.TextObject(t, 20, 20, true);
    scene.addObject(fibText);
    fibText.props = {
      fillStyle:"white",
      font:"30px bold"
    }
    fibText.hide();
    fibText.write(anim, 1000);
    let imageContainer = new Sanim.RectObject(0, 0, (311+266)*1.5+50, 200*1.5);//container for the code images
    scene.addObject(imageContainer);
    imageContainer.alignCenter();
    imageContainer.alignMiddle();
    let imageRecursive = new Sanim.ImageObject("images/fibRecursive.png", 0, 0, 311*1.5, 98*1.5);
    imageContainer.addChild(imageRecursive);
    imageRecursive.props = {
      lineWidth:3,
      strokeStyle:"crimson"
    }
    let rText = new Sanim.TextObject("Recursive", 0, -50, true);//text labelling for the recursive method
    rText.props = {
      fillStyle:"crimson",
      font:"40px bold"
    }
    imageRecursive.addChild(rText);
    rText.alignCenter();//aligning it to the center of the parent
    imageRecursive.hide(true);

    let imageIterative = new Sanim.ImageObject("images/fibIterative.png", 311*1.5+50, 0, 266*1.5, 177*1.5);
    imageContainer.addChild(imageIterative);
    imageIterative.props = {
      lineWidth:3,
      strokeStyle:"green"
    }
    let iText = new Sanim.TextObject("Iterative", 0, -50, true);//text labelling for the iterative method
    iText.props = {
      fillStyle:"green",
      font:"40px bold"
    }
    imageIterative.addChild(iText);
    iText.alignCenter();//aligning it to the middle of the parent
    imageIterative.hide(true);

    imageRecursive.fadeIn(anim, 1000);
    imageIterative.fadeIn(anim, 1000);
    anim.sleep(3000);
    rText.write(anim, 500);
    iText.fadeIn(anim, 1000);

    anim.sleep(delayTime);
    anim.execute(function(){slide5()});//calling slide5
  }
  function plotComplexity(x, y, width, height, compute, color, rate=0.5){
    var equation = new Sanim.Function({
      xScale:10,
      yScale:-10,
      y:0,
      x:0,
      compute:compute,
      increment: function(){
        this.x = this.x + rate;
      },
      constraint: function(){
        return this.x < width/this.xScale && this.y < height/Math.abs(this.yScale);
      }
    });//the function expression for drawing the graph of the individual space complexity types
    var plot = new Sanim.Xandra(scene, x, y, anim);//the plotting object
    plot.props = {
      lineWidth:2,
      strokeStyle:color
    }

    /* trying to draw the axis lines */
    plot.left(Math.PI/2);
    plot.forward(height);
    plot.stampArrowHead();
    let yLabel = new Sanim.TextObject("time", plot.currentX-20, plot.currentY-30, true);//the labeling on the y axis
    yLabel.props = {
      fillStyle:"crimson",
      font: "30px bold"
    }
    anim.execute(function(){
      plot.addChild(yLabel);
      yLabel.render();
    });
    plot.penUp();
    plot.setPosition(0,0);
    plot.right(Math.PI/2);
    plot.penDown();
    plot.forward(width);
    plot.stampArrowHead();
    let xLabel = new Sanim.TextObject("n", plot.currentX+10, plot.currentY-15, true);//the labeling on the x axis
    xLabel.props = {
      fillStyle:"lightgreen",
      font: "30px bold"
    }
    anim.execute(function(){
      plot.addChild(xLabel);
      xLabel.render();
    });
    /* end of drawing the axis lines */
    plot.penUp();
    var grapher = plot.graph(equation);
    return grapher;
  }
  function slide5(delayTime=2000){
    scene.flushObjects();
    //this is where I want to put all the calculations for
    var t = new Sanim.TextObject("Considering space complexity and time complexity", 20, 20, true);
    scene.addObject(t);
    t.props = {
      fillStyle:"white",
      font:"30px bold"
    }
    t.hide();
    t.write(anim, 1000);

    var timeC = new Sanim.TextObject("O(T) = time complexity", 20, 300, true);//for the time complexity text
    scene.addObject(timeC);
    timeC.props = {
      fillStyle:"orange",
      font:"30px bold"
    }
    timeC.hide();
    timeC.alignCenter();
    timeC.write(anim, 1000);

    var spaceC = new Sanim.TextObject("O(S) = space complexity", 20, 400, true);//for the space complexity text
    scene.addObject(spaceC);
    spaceC.props = {
      fillStyle:"lightgreen",
      font:"30px bold"
    }
    spaceC.hide();
    spaceC.alignCenter();
    spaceC.fadeIn(anim, 1000);

    anim.sleep(1000);
    timeC.fadeOut(anim, 500);
    spaceC.fadeOut(anim, 500);
    anim.execute(function(){//trying to remove objects that are no longer in use
      scene.removeObject(timeC);
      scene.removeObject(spaceC);
    });
    
    var constant = new Sanim.TextObject("O(20) = constant", 20, 220, true);//for the complexity text
    scene.addObject(constant);
    constant.props = {
      fillStyle:"lightgreen",
      font:"30px bold"
    }
    constant.hide();
    constant.fadeIn(anim, 1000);
    let constantGraph = plotComplexity(280, 300, 200, 200, function(){this.y = 5}, 'orange', 1);

    var linear = new Sanim.TextObject("O(20) = linear", 550, 220, true);//for the complexity text
    scene.addObject(linear);
    linear.props = {
      fillStyle:"lightgreen",
      font:"30px bold"
    }
    linear.hide();
    linear.fadeIn(anim, 1000);
    let linearGraph = plotComplexity(790, 300, 200, 200, function(){this.y = this.x/2;}, 'green', 2);
    
    var quadratic = new Sanim.TextObject("O(n^2) = quadratic", 20, 490, true);//for the complexity text
    scene.addObject(quadratic);
    quadratic.props = {
      fillStyle:"lightgreen",
      font:"30px bold"
    }
    quadratic.hide();
    quadratic.fadeIn(anim, 1000);
    let quadraticGraph = plotComplexity(280, 570, 200, 200, function(){this.y = Math.pow(this.x, 2);}, 'orange');

    var logarithmic = new Sanim.TextObject("O(log(n)) = logarithmic", 520, 490, true);//for the complexity text
    scene.addObject(logarithmic);
    logarithmic.props = {
      fillStyle:"lightgreen",
      font:"25px bold"
    }
    logarithmic.hide();
    logarithmic.fadeIn(anim, 1000);
    let logarithmicGraph = plotComplexity(790, 570, 200, 200, function(){this.y = Math.log10(this.x*10);}, 'orange', 1);

    constantGraph.onEnded = function(){
      linearGraph.start();
    }
    linearGraph.onEnded = function(){
      quadraticGraph.start();
    }
    quadraticGraph.onEnded = function(){
      logarithmicGraph.start();
    }
    logarithmicGraph.onEnded = function(){
      anim.sleep(delayTime);
      anim.execute(function(){scene.playAnimation = true; slide6()});//calling slide6
    }

    anim.execute(function(){scene.playAnimation = false});//hack to improve performance
    constantGraph.start();
    //anim.execute(function(){slide6()});//calling slide6
  }
  function slide6(delayTime=2000){
    scene.flushObjects();
    var t = "Two approaches to computing the fibonacci of a number";
    var fibText = new Sanim.TextObject(t, 20, 20, true);
    scene.addObject(fibText);
    fibText.props = {
      fillStyle:"white",
      font:"30px bold"
    }
    fibText.hide();
    fibText.fadeIn(anim, 1000);
    let test1 = timeIt(40, true);
    anim.execute(function(){scene.removeObject(test1)});//first test using recursive method
    let test2;
    test2 = timeIt(22000000, false);//second test using iterative method

    anim.sleep(delayTime);
    anim.execute(function(){slide7()});//executing slide 7
  }
  function slide7(delayTime=2000){
    graphTime(10, 0.2, 6.4, slide8, delayTime);
  }
  function slide8(delayTime=4000){
    graphTime(1, 1, 40, slide9, delayTime)
  }
  function slide9(delayTime=2000){
    graphTime(10, 0.2, 6.4, slide10, delayTime)
  }
  function showMathSolution(begining, ending, interval = 3000){
    for(let i = begining; i<=ending; i++){
      let imageURL = `images/recursive_step_${i}.png`;
      let imageDimmension = dimensions[i];
      let image = new Sanim.ImageObject(imageURL, 20, 52*(i-begining+1), imageDimmension[0]*1.2, imageDimmension[1]*1.2);
      anim.execute(function(){
        scene.addObject(image);
        image.alignCenter();
        image.hide();
      });
      image.fadeIn(anim, 1000);
      anim.sleep(imageDimmension[0]*imageDimmension[1]/3);
    }
  }
  function slide10(delayTime=2000){
    scene.flushObjects();
    showMathSolution(0, 9);
    anim.sleep(delayTime);
    anim.execute(function(){slide11(3000)});
  }
  function slide11(delayTime=2000){
    scene.flushObjects();
    showMathSolution(10, 19);
    anim.sleep(delayTime);
    anim.execute(function(){slide12(3000)});
  }
  function slide12(delayTime=2000){
    scene.flushObjects();
    showMathSolution(20, 29);
    var t = "This proves that the iterative method is better";
    var finishText = new Sanim.TextObject(t, 20, window.innerHeight - 40, true);
    scene.addObject(finishText);
    finishText.props = {
      fillStyle:"lightgreen",
      font:"30px bold"
    }
    finishText.hide();
    finishText.alignCenter();
    finishText.write(anim, 1000);  
  }

  slide1a();//executing slide 1
  scene.play();
}