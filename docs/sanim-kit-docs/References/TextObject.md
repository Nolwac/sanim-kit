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

let canvas = document.createElement("canvas");//creating the canvas element.
let context = canvas.getContext("2d");//getting the drawing context

let scene = new Scene(context);//creating the scene

let text = new Sanim.TextObject("Sanim-kit", 100, 100, true);//creating the text
rect.props = {
    font:"40px bold arial",
    fillStyle:"crimson"
}//defining the properties of the text
scene.addObject(text);//adding the created text to scene.
scene.play();//playing the scene animation frame
```

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


*Sanim.TextObject* inherits directly from *Sanim.SanimObject*, thus it inherits all the properties and methods accessible on *Sanim.SanimObject*.
Checkout the references for the properties and methods.