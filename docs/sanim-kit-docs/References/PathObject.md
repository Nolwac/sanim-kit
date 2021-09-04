## PathObject
Sanim-kit provides an object that allows you draw a path on the scene and use them to draw custom shapes on the scene. This functionality is provided through the *Sanim.PathObject*.

The *constructor* takes the following parameters.
  - the x position.
  - the y position.
  - the template for the paths to be drawn.
  - (optional) a boolean value specifying if to close the path after drawing it. Closing the path means connecting the starting point to the ending with a straight line.
  - (optional) a boolean value specifying if to fill the path after drawing it.

The template for the paths follows the naming convention and parameters format for the *HTML5 Canvas 2d context*.
The *paths* is an array with the object items. The objects the array specify the *HTML5 Canvas 2d context* path method and it's parameters through the *pathMethod* and *params* properties of the object respectively.

For a better understanding of how to create paths, checkout the *HTML5 Canvas 2d context* path methods.

```js
import Sanim from "sanim-kit";

let canvas = document.createElement("canvas");//creating the canvas element.
let context = canvas.getContext("2d");//getting the drawing context

let scene = new Scene(context);//creating the scene

let obj = new Sanim.PathObject(200, 200, [{pathMethod:'arc', params:[0, 0, 200, 0, (Math.PI/180)*90, false]}], true, true);
scene.addObject(obj);//adding the created object to scene.
scene.play();//playing the scene animation frame
```