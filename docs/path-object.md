---
id: path-object
title: Creating Paths on the Scene
sidebar_label: PathObject
---

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

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let obj = new Sanim.PathObject(200, 200, [{pathMethod:'arc', params:[0, 0, 200, 0, (Math.PI/180)*90, false]}], true, true);
obj.props = {// styling the object
    lineWidth: 3,
    strokeStyle: "orange",
    fillStyle: "crimson"
}
scene.addObject(obj);//adding the created object to scene.
scene.play();//playing the scene animation frame
```
### Result:
<iframe src="/demo/path-object/index.html" id="demo-frame-1" style="width:100%; height: 500px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## PathObject References
The following are the properties and methods accessible on *Sanim.PathObject*.

### PathObject.paths.
This property defines the paths that make up the object
The default value is usually provided when calling the object constructor.
You can modify this value to make changes to the object.

### PathObject.renderingPaths.
This property holds the actual paths used for rendering the object to the scene

### PathObject.initialPaths.
This property holds the original paths of the object, so as to have a record of its integrity.
Note: this value is not to be modified.

### PathObject.closePath.
This property holds a boolean value which specifies if the path should be closed after it is drawn.
The default value may be provided while calling the PathObject constructor.

### PathObject.fillPath.
This property holds a boolean value which specifies if the path should be filled after it is drawn.
The default value may be provided while calling the PathObject constructor.

### PathObject.appendPath()
This takes a path parameter and appends it to the object paths.

```js
let newPath = {pathMethod:'lineTo', params:[300, 300]};//new path to be appended
obj.appendPath(newPath);//appending the new path using the appendPath method
```
### Result:
<iframe src="/demo/path-object/append-path.html" id="demo-frame-2" style="width:100%; height: 600px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-2').contentDocument.location.reload(true);">Reload</button>

*Sanim.PathObject* inherits directly from *Sanim.SanimObject*, thus it inherits all the properties and methods accessible on *Sanim.SanimObject*.
Checkout the references for the properties and methods.