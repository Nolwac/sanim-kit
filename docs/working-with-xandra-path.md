---
id: working-with-xandra-path
title: Working with the Xandra Path Object
sidebar_label: Quick tutorial on the Xandra Path Object
---

## Xandra Pen path

The concept of the Xandra path(or Xandra pen path) is that Xandra has a pen on her hand with which she creates or draws a path on the scene.

It is similar to what you have in Python Turtle graphics and the Xandra Pen object shares some methods in come with the Turtle graphics library of Python except that Xandra Pen object uses lowerCamel case which is Javascript developers custom for naming.

To create a Xandra Pen path we need to do that through the Xandra object of Sanim-kit.

```javascript
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

the object take a parameter of x and y position followed by the scene on which the drawing will be made on.

Note that: Xandra pen is an extension of the Path object which is a SanimObject, so it has all the properties and methods that a regular SanimObject has.

Now we can start drawing paths using the pen.

### Drawing a Square

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

If you are fan to the Turtle graphics library of Python, you wouldn't need any additional explanation to understand how the piece of code above works.

The left method of the pen turns the invisible cursor towards to the left by the angle provided. Note that the angle is in radian so in order to work with degrees, we use the radian method of the scene object.

The forward method of the pen moves the invisible cursor forward by the distance in pixel provided.

So the end point is that the pen draws a square 200 by 200 in dimension.

### Result:
<iframe src="/demo/working-with-xandra-path/index.html" id="demo-frame-1" style="width:100%; height: 400px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

