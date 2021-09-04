---
id: text-object
title: Writing text to the Scene with TextObject
sidebar_label: TextObject
---

## TextObject
Sanim-kit provides *Sanim.TextObject* which allows drawing of rectangles on the scene.
It inherits directly from *Sanim.SanimObject*.
*Sanim.TextObject* constructor can takes 4 parameters.
  - the text string to be drawn.
  - the x starting position of the text in pixels.
  - the y starting position of the text in pixels.
  - (optional) a boolean value which specifies if the text is to be filled with color or not. The default value is *false*.

```js
import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let text = new Sanim.TextObject("Sanim-kit", 100, 100, true);//creating the text
text.props = {
    font:"40px bold arial",
    fillStyle:"crimson"
}//defining the properties of the text
scene.addObject(text);//adding the created text to scene.
scene.play();//playing the scene animation frame
```
### Result:
<iframe src="/demo/text-object/index.html" id="demo-frame-1" style="width:100%; height: 300px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## TextObject References
The following are the properties and methods accessible on *Sanim.TextObject*.

### TextObject.width.
This property holds the width of the text. The value is dynamically set after the object is created and is proportional to the font specified in the *TextObject.props.font* property. This value can be accessed using the *textMeasurement* property of the object after the *measureText* method of the object is called.

### TextObject.height.
This property holds the height of the text. The value is dynamically set while the text is rendered to the scene.

### TextObject.renderingWidth.
This property holds the rendering width of the text.

### TextObject.renderingHeight.
This property holds the rendering height of the text. The actual rendering width and height of the text is not always same as the specified width and height due to some  rendering parameters that may be provided by camera, player and *parentObject* features.

*Do not attempt to use the value of the renderingWidth and renderingHeight as a fixed reference, since the values may change with every frame rendered.*

### TextObject.boxProps
This property defines the properties of the text container. Events added to the text is with reference to the text container. *TextObject.boxProps* is an extension of  *SanimObject.props* property, hence to style the text container, assign properties to *TextObject.boxProps* as you would assign to *SanimObject.props*.
The extended properties includes the following.
  - *boxProps.paddingX* which specifies the box padding for the text in the x-directions in pixels.
  - *boxProps.paddingY* which specifies the box padding for the text in the y-directions in pixels.

```js
text.boxProps = {
    paddingX:20,//20 pixels padding
    paddingY:40,
    fillStyle:"white",//background color
    strokeStyle:"crimson",//border line color
    lineWidth:5//border line width
}
text.fillBox = true;//specifying that text box should be filled
```
### Result:
<iframe src="/demo/text-object/box-props.html" id="demo-frame-2" style="width:100%; height: 300px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-2').contentDocument.location.reload(true);">Reload</button>

### TextObject.fillBox
This property holds a boolean value which defines if the text container should be filled with color or not.
The default value is *false*, meaning that the container should not be filled.

### TextObject.text
This property defines the text string to be drawn to the scene. The default value is usually provided when creating the object.
*Overwrite this value to change the text drawn to the scene*

### TextObject.textMeasurement
This property is an object that holds the *HTML5 Canvas* text measurements properties of the text drawn to the scene .

### TextObject.fontSize
This property holds the font size of the text to be drawn in pixels.
The default value is *10*. This value can be overwritten via the *props.font* property setting of the object.

### TextObject.renderingFontSize
This property holds the rendering font size of the text in pixels. The actual rendering font size is not always same as the font size due to some  rendering parameters that may be provided by camera, player and *parentObject* features.

*Do not attempt to use the value of the renderingFontSize as a fixed reference, since the values may change with every frame rendered.*

### TextObject.setTransformationOriginToCenter
This property holds a boolean value that defines if the transformation origin should be the center of the text container. The default value is *true*, which implies that the transformation origin should be the center of the text container.

### TextObject.write()
This method writes the text to the scene.
It takes the following arguments:
- The animation instance to be used in writing the text.
- The time duration to write the text in milliseconds.
- (optional) javascript Audio instance to play while writing the text

```js
const anim = new Sanim.Animation(scene);//creating the animation instance to be used for writing the text
anim.sleep(2000);//sleep for 2 seconds before writing the text
text.write(anim, 3000);//writing the text in 3 seconds
```
### Result:
<iframe src="/demo/text-object/text-write.html" id="demo-frame-3" style="width:100%; height: 300px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-3').contentDocument.location.reload(true);">Reload</button>

*Sanim.TextObject* inherits directly from *Sanim.SanimObject*, thus it inherits all the properties and methods accessible on *Sanim.SanimObject*.
Checkout the references for the properties and methods.