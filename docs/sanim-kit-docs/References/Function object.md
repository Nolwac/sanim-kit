## Routine
Sanim-kit has a Zen for using *function expression* to define a graph plotting, motion path or timing for program execution.
Hence Sanim-kit provides *Sanim.Function* object that provides template for the parameter definitions of such routine.

The constructor takes a Javascript object as  parameter with the following methods and properties in the object.
  - *x*, which defines the initial position on the *x-axis* .
  - *y* which defines the initial position on the *y-axis*.
  - *xScale* which defines the the scaling factor on the *x-axis*.
  - *yScale* which defines the scaling factor on the *y-axis*.
  - *delay* which defines the interval of time in which the computation should repeat.
  - *compute* a method that defines the computation. Usually the computation should be a mathematical computation but other activities can be incorporated inside the object method.
  - *constraint* a method that defines the constraint (a condition in which the computation should be repeated). Usually this would be a mathematical definition but other kind of definition can be made to provided a more robust functionality.
  - *increment* a method that defines how values used in the computation should be carried or incremented as the computation goes on.

```js
let canvas = document.createElement("canvas");//creating the canvas element.
let context = canvas.getContext("2d");//getting the drawing context

let scene = new Scene(context);//creating the scene

let rect = new Sanim.RectObject(100, 100, 50, 70, true);//creating the rectangle
rect.props = {
    lineWidth:5,
    strokeStyle:"green",
    fillStyle:"crimson"
}//defining the properties of the rectangle
scene.addObject(rect);//adding the created rectangle to scene.
scene.play();//playing the scene animation frame

let func = new Sanim.Function ({
      xScale:25,
      yScale:-25,
      x:-4,
      y:0,
      delay:30,
      compute: function(){
        this.y = Math.pow(this.x, 2);
      },
      constraint: function(){
        return this.x <= 4.002;
      },
      increment: function(){
        this.x+=0.05;
      }
});//defining the Function object

let path = rect.motionPath(func);//creates an instance to move the object through a path on the scene.
path.start();//starting the motion
```