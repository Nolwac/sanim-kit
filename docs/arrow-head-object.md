---
id: arrow-head-object
title: Drawing Arrows with the ArrowHeadObject
sidebar_label: ArrowHeadObject
---

## ArrowHeadObject
Sanim-kit provides *Sanim.ArrowHeadObject* which allows drawing of arrow heads on the scene.
It inherits directly from *Sanim.PathObject*.
*Sanim.ArrowHeadObject* constructor takes 5 parameters.
  - the x position of the arrow head in pixels.
  - the y starting position of the arrow head in pixels.
  - the direction angle (in radians) which defines the direction the arrow head should face.
  - the arrow head length (optional).
  - the angle at the pointing vertex of the arrow head.

```js

import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let arrow = new Sanim.ArrowHeadObject(100, 100, 100, 90, 60);//creating the arrow
arrow.props = {
    lineWidth:5,
    strokeStyle:"crimson",
}//defining the properties of the arrow
scene.addObject(arrow);//adding the created arrow to scene.
scene.play();//playing the scene animation frame
```

### Result:
<iframe src="/demo/arrow-head-object/index.html" id="demo-frame-1" style="width:100%; height: 400px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## ArrowHeadObject References
The following are the properties and methods accessible on *Sanim.ArrowHeadObject*.

### ArrowHeadObject.directionAngle
This property defines the direction the arrow head is pointing towards. It is an angle in radians

### ArrowHeadObject.arrowAngle
This property defines the angle at the pointing vertex of the arrow head.

### ArrowHeadObject.arrowLength
This property defines the length of the arrow head.


*Sanim.ArrowHeadObject* inherits directly from *Sanim.PathObject*, thus it inherits all the properties and methods accessible on *Sanim.PathObject*.
Checkout the references for the properties and methods.