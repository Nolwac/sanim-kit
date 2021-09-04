---
id: circle-object
title: Circle Object
sidebar_label: Circle Object
---

## CircleObject
Sanim-kit provides *Sanim.CircleObject* which allows drawing of circles on the scene.
It inherits directly from *Sanim.PathObject*.
*Sanim.CircleObject* constructor can takes 4 parameters.
  - the x position of the center of the circle in pixels.
  - the y position of the center of the circle in pixels.
  - the radius of the circle in pixels.
  - (optional) a boolean value which specifies if the circle is to be filled with color or not. The default value is *false*.

```js
import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let circle = new Sanim.CircleObject(100, 100, 50, true);//creating the circle
circle.props = {
    lineWidth:5,
    strokeStyle:"green",
    fillStyle:"crimson"
}//defining the properties of the circle
scene.addObject(circle);//adding the created circle to scene.
scene.play();//playing the scene animation frame
```
### Result:
<iframe src="/demo/circle-object/index.html" id="demo-frame-1" style="width:100%; height: 200px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## CircleObject References
The following are the properties and methods accessible on *Sanim.CircleObject*.

### CircleObject.radius.
This property defines the radius of the circle.
The default value is usually provided when calling the object constructor.

### CircleObject.width.
This property holds the width of the object which is equal to twice the radius.

### CircleObject.height.
This property holds the height of the object which equal to twice the radius.

*Sanim.CircleObject* inherits directly from *Sanim.PathObject*, thus it inherits all the properties and methods accessible on *Sanim.PathObject*.
Checkout the references for the properties and methods.