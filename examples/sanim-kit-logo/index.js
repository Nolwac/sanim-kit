window.onload = function(){
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var scene = new Sanim.Scene(context);
  scene.color = "black";
  scene.isParentWorld = true;
  scene.context.canvas.width = window.innerWidth;
  scene.context.canvas.height = window.innerHeight;
  var anim = new Sanim.Animation(scene);
  function createPen(x, y, color){
    var pen = new Sanim.Xandra(scene, x, y, anim);
    pen.props = {//defining the properties
      strokeStyle:color,
      lineWidth:6,
      lineCap: "round",
    }
    return pen;
  }
  /*---------- Constant variables ------------*/
  var width = 400;
  var height = 400;
  var xStart = (window.innerWidth - width)/2;//trying to place the logo at the center of the canvas
  var yStart = (window.innerHeight - height)/2;//trying to place the logo at the middle of the canvas
  var xCenter = xStart + width/2;//the x center of the logo
  var yCenter = yStart + height/2;// the y center of the logo

  /*------------ The vertical axis arrow -----------*/
  var vtl = createPen(xCenter, yStart+height, "rgb(55,96,146)");//vertical axis
  vtl.delay(100);// 100 milli second delay
  vtl.left(scene.radian(90));//turning right by 90 degrees
  vtl.forward(height);
  vtl.stampArrowHead();

  var curve = createPen(xCenter, yStart + height/4, "rgb(0,176,80)");//the parabolic curve
  curve.props.lineJoin = "round";

  /*---------- The horizontal axis arrow ----------*/
  var htl = createPen(xStart, yStart + height*3/4, "rgb(255,51,51)");//horizontal axis
  htl.delay(100);// 100 milli second delay
  htl.forward(width);
  htl.stampArrowHead();
  

  /*---------------- drawing the curve ------------------*/
  var yScale = height/8;
  var xScale = yScale;
  var quad = new Sanim.Function({//an expression for providing the equation for the inverted quadratic curve
    xScale:xScale,
    yScale:yScale,
    x:-2,
    y:0,
    delay:30,
    type:"line",
    size:2,
    compute: function(){
      this.y = Math.pow(this.x, 2);
    },
    constraint: function(){
      return this.x <= 2.002;
    },
    increment: function(){
      this.x+=0.2;
    }
  });
  var t = "Sanim-kit";//the text to be written
  var f = "50px bold"; //the font of the text
  var m = scene.measureText(t, f).width;//measuring the text
  var textCenter = (window.innerWidth - m)/2;
  var text = new Sanim.TextObject(t, textCenter, yStart+height + m/10, true);
  text.props = {
    fillStyle:'rgb(255,51,51)',
    font:f
  }
  scene.addChild(text);
  var superscript = text.superscript("simulation", 0.4);
  superscript.initialX+=5;//5px offset
  superscript.hide();//hiding the superscript so as to fade it in later on
  superscript.props.fillStyle = "rgb(0,176,80)";
  var subscript = text.subscript("animation", 0.4);
  subscript.initialX+=5;//5px offset fromt the main text
  subscript.hide();//hiding to subscript so as fade it in later on
  subscript.props.fillStyle = "rgb(55,96,146)";
  text.hide();//hiding the main text so as to write it later on
  var drawer = curve.graph(quad);
  drawer.onEnded = function(){
    text.write(anim, 1000); text.fadeOut(anim, 500); text.fadeIn(anim, 500);
    superscript.fadeIn(anim, 500);
    subscript.fadeIn(anim, 500);
  }//writing the text when the curve is done drawing
  curve.animation.execute(function (){
    curve.penUp();
    drawer.start();//starting the drawing of the curve
  });
  
  scene.play();//playing the frames
}