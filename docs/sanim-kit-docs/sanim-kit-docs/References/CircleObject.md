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

let canvas = document.createElement("canvas");//creating the canvas element.
let context = canvas.getContext("2d");//getting the drawing context

let scene = new Scene(context);//creating the scene

let circle = new Sanim.CircleObject(100, 100, 50, true);//creating the circle
circle.props = {
    lineWidth:5,
    strokeStyle:"green",
    fillStyle:"crimson"
}//defining the properties of the circle
scene.addObject(circle);//adding the created circle to scene.
scene.play();//playing the scene animation frame
```

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