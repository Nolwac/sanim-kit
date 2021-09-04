---
id: straight-line-object
title: Drawing Straight Lines with the StraightLineObject
sidebar_label: StraightLineObject
---

## StraightLineObject
Sanim-kit provides *Sanim.StraightLineObject* which allows drawing of straight lines on the scene.
It inherits directly from *Sanim.PathObject*.
*Sanim.StraightLineObject* constructor takes 4 parameters.
  - the x starting position of the line in pixels.
  - the y starting position of the line in pixels.
   - the x ending position of the line in pixels.
  - the y ending position of the line in pixels.

```js
import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let line = new Sanim.StraightLineObject(100, 100, 500, 300);//creating the line
line.props = {
    lineWidth:5,
    strokeStyle:"crimson",
}//defining the properties of the line
scene.addObject(line);//adding the created line to scene.
scene.play();//playing the scene animation frame
```

### Result:
<iframe src="/demo/straight-line-object/index.html" id="demo-frame-1" style="width:100%; height: 400px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## StraightLineObject References
The following are the properties and methods accessible on *Sanim.StraightLineObject*.

### StraightLineObject.xEnd
This property holds the *x* ending position of the line.

### StraightLineObject.yEnd
This property holds the *y* ending position of the line.


*Sanim.StraightLineObject* inherits directly from *Sanim.PathObject*, thus it inherits all the properties and methods accessible on *Sanim.PathObject*.
Checkout the references for the properties and methods.