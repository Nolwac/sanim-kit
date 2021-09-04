---
id: xandra-pen-path
title: Xandra Path References
sidebar_label: Xandra Path References
---

## Xandra Pen path

The concept of the Xandra path(or Xandra pen path) is that Xandra has a pen on her hand with which she creates or draws a path on the scene.

It is similar to what you have in Python Turtle graphics and the Xandra Pen object shares some methods in come with the Turtle graphics library of Python except that Xandra Pen object uses lowerCamel case which is Javascript developers custom for naming. And of course Xandra Pen path does not have some of the methods available in the Turtle graphics library of Python, vice versa.

To create a Xandra Pen path we need to do that through the Xandra object of Sanim-kit.

```js

import Sanim from 'sanim-kit';
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";
scene.play();// playing animations created on the scene
const pen = new Sanim.Xandra(scene, 100, 300);//instantiating the object
// setting the properties of the pen
pen.props={
    strokeStyle:"crimson",
    lineWidth:2
}
```

The constructor take the following parameters.
  - *x* starting position of the path.
  - *y* starting position of the path.
  - the scene on which the drawing should be made on.

Note that: Xandra pen is an extension of *Sanim.PathObject* which is an extension of *Sanim.SanimObject*, so it has all the properties and methods that a regular *SanimObject* posseses.

Now we can start drawing paths using the pen.

To draw a square we add the following block of code.

```javascript

pen.forward(200);//moves 200px forward
pen.left(scene.radian(90));//turn left by 90 degrees
pen.forward(200);
pen.left(scene.radian(90));
pen.forward(200);
pen.left(scene.radian(90));
pen.forward(200);
```
### Result:
<iframe src="/demo/xandra-pen-path/index.html" id="demo-frame-1" style="width:100%; height: 400px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

If you are a fan to the Turtle graphics library of Python, you wouldn't need any additional explanation to understand how the piece of code above works.

The left method of the pen turns the invisible cursor towards to the left by the angle provided. Note that the angle is in radian so in order to work with degrees, we use the radian method of the scene object to convert the degree angle to radian before feeding it the Xandra path method.

The forward method of the pen moves the invisible cursor forward by the distance in pixel provided.

So the end point is that the pen draws a square 200 by 200 pixels in dimension.

## Xandra Pen Path References
The following are the properties and methods  accessible in Xandra path object.

### Xandra.world
This property defines the scene on which the path is to be drawn.

### Xandra.animation
This property defines the *Sanim.Animation* object to be used for drawing the animation.

### Xandra.turnAngle
This property holds the current direction of the pen in radian.

### Xandra.currentX
This property holds the current *x* position of the pen relative to the pen's *x* starting position.

### Xandra.currentY
This property holds the current *y* position of the pen relative to the pen's *y* starting position.

### Xandra.interval
This property defines the interval of time between path drawings, it is similar to frame-rate.

### Xandra.fragments
This property defines the number of fragments for each path to be drawn.

```js

pen.fragments = 4;//this will make the fragments for each path 4 + 1 = 5
pen.interval = 1000;//this will cause 1 second delay between drawn paths
```

### Result:
<iframe src="/demo/xandra-pen-path/fragments.html" id="demo-frame-2" style="width:100%; height: 400px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-2').contentDocument.location.reload(true);">Reload</button>

Note those two properties are time dependent, meaning that it does not affect commands that have already been defined before its reassignment.

### Xandra.delay()
This method delays the drawing the moment it is called by the amount of time provided. It takes only one parameter, which is the time in seconds to delay the drawing.

### Xandra.turn()
This method makes a turn by an angle provided. It takes only one parameter, which is the turn angle in radians. If the value is negative, it will result to a counter-clockwise (left) turn, but if the value is positive it will result to a clockwise (right) turn.

### Xandra.left()
This method makes a counter-clockwise turns by an angle provided. It takes only one parameter, which is the turn angle in radians.

### Xandra.right()
This method makes a clockwise turns by an angle provided. It takes only one parameter, which is the turn angle in radians.

### Xandra.forward()
This method draws a straight forward path in the current direction by the distance provided. It takes only one parameter, which is the distance in pixels to draw the path.

### Xandra.backward()
This method draws a straight backward path in the current direction by the distance provided. It takes only one parameter, which is the distance in pixels to draw the path.

### Xandra.penUp()
This method hides every drawing that comes after it is called. It's effect is like raising a drawing pen.

### Xandra.penDown()
This method shows every drawing made after it is called. It's effect is like dropping the tip of the drawing pen on the drawing board (canvas).

### Xandra.arc()
This method draws an arc based on the parameters provided. It takes 2 parameters:
*radius* - The radius of the arc.
*angle* - The angle subtended at the end of drawing the arc.

```js

pen.interval = 100;//changing the interval of time, remove the first so as to speed up the drawing
pen.penUp();// raising the pen so that every drawing that comes after does not show.
pen.right(scene.radian(90));// turning 90 degrees clockwise
pen.backward(300);// going backward by 300 pixels
pen.penDown();// dropping the tip of the pen so that any further drawing shows
pen.arc(150, scene.radian(120));// drawing an arc of radius 150 pixels which will subtend an angle of 120 degrees
```

### Result:
<iframe src="/demo/xandra-pen-path/arc.html" id="demo-frame-3" style="width:100%; height: 400px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-3').contentDocument.location.reload(true);">Reload</button>

### Xandra.drawingStatus()
This method returns true if the drawing to be made at that point in time will be visible and returns false if otherwise.

### Xandra.getCurrentPosition()
This method returns the current position of the pen, when it is called.

### Xandra.setPosition()
This method sets the pens position, relative to the pens starting position when instantiating the Xandra path object. It takes 2 parameters:
*x* - the position on the x-axis relative to the starting position on the x-axis.
*y* - the position on the y-axis relative to the starting position on the y-axis.

### Xandra.stampArrowHead()
This method stamps an arrow head at the current location of the pen. The arrow head points towards the current direction of the pen. It can take 2 parameters:
*length* - The length of the arrow head in pixels.
*angle* - The angle formed by the two edges of the arrow head, i.e angle formed at the pointing vertex of the arrow head
It returns the *Sanim.ArrowHeadObject* created.

### Result:
<iframe src="/demo/xandra-pen-path/arrow-head.html" id="demo-frame-4" style="width:100%; height: 400px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-4').contentDocument.location.reload(true);">Reload</button>

### Xandra.graph()
This method creates a grapher. The grapher draws a mathematical function using the pen. It takes only one parameter which is the *Sanim.Function* object to be graphed by the pen. The method returns the grapher.

```js
/* This is a complete new program and is not tied to the rest of the programs that have been written*/
import Sanim from 'sanim-kit';

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";
scene.play();// playing animations created on the scene
const pen = new Sanim.Xandra(scene, 300, 400);//instantiating the object
// setting the properties of the pen
pen.props={
    strokeStyle:"crimson",
    lineWidth:2
}

const func = new Sanim.Function({
  xScale:40,
  yScale:-20,
  x:-4,
  y:0,
  delay:200,
  type:"line",
  size:2,
  compute: function(){
    this.y = Math.pow(this.x, 2);//quadratic function y = x^2
  },
  constraint: function(){
    return this.x <= 4.002;//x ranging from -4 to 4
  },
  increment: function(){
    this.x+=0.2;//x to be incremented by 0.2
  }
});

const grapher = pen.graph(func);//drawing the defined quadratic function
pen.penUp();//raising the pen so it does not start drawing the function from the current position
grapher.start();//This will start drawing the function
```

### Result:
<iframe src="/demo/xandra-pen-path/graph.html" id="demo-frame-5" style="width:100%; height: 500px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-5').contentDocument.location.reload(true);">Reload</button>

