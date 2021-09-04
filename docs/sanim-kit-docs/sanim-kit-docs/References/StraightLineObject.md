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

let canvas = document.createElement("canvas");//creating the canvas element.
let context = canvas.getContext("2d");//getting the drawing context

let scene = new Scene(context);//creating the scene

let line = new Sanim.StraightLineObject(100, 100, 500, 300);//creating the line
circle.props = {
    lineWidth:5,
    strokeStyle:"crimson",
}//defining the properties of the line
scene.addObject(line);//adding the created line to scene.
scene.play();//playing the scene animation frame
```

## StraightLineObject References
The following are the properties and methods accessible on *Sanim.StraightLineObject*.

### StraightLineObject.xEnd
This property holds the *x* ending position of the line.

### StraightLineObject.yEnd
This property holds the *y* ending position of the line.


*Sanim.StraightLineObject* inherits directly from *Sanim.PathObject*, thus it inherits all the properties and methods accessible on *Sanim.PathObject*.
Checkout the references for the properties and methods.