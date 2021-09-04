---
id: rect-object
title: Drawing Rectangles with the Rect Object
sidebar_label: Rect Object
---

## RectObject
Sanim-kit provides *Sanim.RectObject* which allows drawing of rectangles on the scene.
It inherits directly from *Sanim.SanimObject*.
*Sanim.RectObject* constructor can takes 5 parameters.
  - the x starting position of the rectangle in pixels.
  - the y starting position of the rectangle in pixels.
  - the width of the Rectangle in pixels.
  - the height of the Rectangle in pixels.
  - (optional) a boolean value which specifies if the rectangle is to be filled with color or not. The default value is *false*.

```js
import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let rect = new Sanim.RectObject(100, 100, 50, 70, true);//creating the rectangle
rect.props = {
    lineWidth:5,
    strokeStyle:"green",
    fillStyle:"crimson"
}//defining the properties of the rectangle
scene.addObject(rect);//adding the created rectangle to scene.
scene.play();//playing the scene animation frame
```
### Result:
<iframe src="/demo/rect-object/index.html" id="demo-frame-1" style="width:100%; height: 300px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## RectObject References
The following are the properties and methods accessible on *Sanim.RectObject*.

### RectObject.width.
This property defines the width of the rectangle. The value is usually provided while creating the object from *Sanim.RectObject* constructor.

### RectObject.height.
This property defines the height of the rectangle. The value is usually provided while creating the object from *Sanim.RectObject* constructor.

### RectObject.renderingWidth.
This property holds the rendering width of the rectangle.

### RectObject.renderingHeight.
This property holds the rendering height of the rectangle. The actual rendering width and height of the rectangle is not always same as the specified width and height due to some  rendering parameters that may be provided by camera, player and *parentObject* features.

*Do not attempt to use the value of the renderingWidth and renderingHeight as a fixed reference, since the values may change with every frame rendered.*

### RectObject.setTransformationOriginToCenter
This property holds a boolean value that defines if the transformation origin should be the center of the rectangle. The default value is *true*, which implies that the transformation origin should be the center of the rectangle.

*Sanim.RectObject* inherits directly from *Sanim.SanimObject*, thus it inherits all the properties and methods accessible on *Sanim.SanimObject*.
Checkout the references for the properties and methods.