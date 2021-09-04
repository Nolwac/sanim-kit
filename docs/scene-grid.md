---
id: scene-grid
title: Adding grid to the scene
sidebar_label: Adding Grid
---

## Grid
Sanim-kit provide object that allows us to work with grid on the scene.

### Creating grid
To create grid we use *Sanim.Grid* object constructor.

```js
import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black
scene.render();//rendering to apply changes

//----------- adding a grid -----------

let grid = new Sanim.Grid(scene, scene, 50, 50);//creating grid.
grid.createAndRender(true, true);//creating grid boxes and calibrations and rendering them to the scene.
```
The constructor takes 4 parameters which are
  - the parent of the scene (can be a SanimObject or Scene object)
  - the scene to draw grid on
  - the *xScale* of the grid calibration
  - the *yScale* of the grid calibration

### Result:
<iframe src="/demo/scene-grid/index.html" id="demo-frame-1" style="width:100%; height: 600px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## References
Below are the properties and method references of the Grid object.

### Grid.parent
This property holds and defines the parent object of the grid.
The parent can be:
  - a *SanimObject* (RectObject, CircleObject, etc). OR
  - a *Scene* object
The default value of this property is provided when the *Sanim.Grid* object constructor is called.

### Grid.width
This property defines the width of the grid.
The default value is given by the width of the parent provided when the *Sanim.Grid* object constructor is called.

### Grid.height
This property defines the height of the grid.
The default value is given by the height of the parent provided when the *Sanim.Grid* object constructor is called

### Grid.world
This property defines the scene on which the grid.

The default value is given by the scene provided when the *Sanim.Grid* object constructor is called.

### Grid.xScale
This property defines the x-axis scale of the grid calibration.

The default value is given by the *xScale* parameter provided when the *Sanim.Grid* object constructor is called.

### Grid.yScale
This property defines the y-axis scale of the grid calibration.

The default value is given by the *yScale* parameter provided when the *Sanim.Grid* object constructor is called

### Grid.gridBoxes
This property holds the array of grid boxes.
The grid consists of boxes and each of the boxes is a *Sanim.RectObject* .

The *gridBoxes* property holds the array of the box Rect Objects.

### Grid.calibrations
This property holds the array of grid calibrations.
The grid has calibrations on the x and y axis  and each of the calibration is a *Sanim.TextObject* 

The *calibrations* property holds the array of the Text Objects.

### Grid.xOrigin
This property defines the  x-origin position of the  grid.

The default value is an expression of the width property of the *parent* parameter provided when the *Sanim.Grid* object constructor is called.
The value is half of the parent width so as to make the x-origin be at the center of the parent.

### Grid.yOrigin
This property defines the  y-origin position of the  grid.

The default value is an expression of the height property of the *parent* parameter provided when the *Sanim.Grid* object constructor is called.

The value is half of the parent height so as to make the y-origin be at the middle of the parent.

### Grid.posXNum
The defines the number of calibrations by the positive *x - axis* of the grid.

The default value is a function of the parent width.

### Grid.negXNum
The defines the number of calibrations by the negative *x - axis* of the grid.

The default value is a function of the parent width.

### Grid.posYNum
The defines the number of calibrations by the positive *y - axis* of the grid.

The default value is a function of the parent height.

### Grid.negYNum
The defines the number of calibrations by the negative *y - axis* of the grid.

The default value is a function of the parent height.

### Grid.xAxis
This property holds the *x-axis* line of the grid.
The default value is *null* until the *createAxis* method of the grid is called.

### Grid.yAxis
This property holds the *y-axis* line of the grid.
The default value is *null* until the *createAxis* method of the grid is called.

### Grid.props
This property defines the default rendering properties settings for the grid calibration and grid box objects.
```js
Grid.props = {
    lineWidth:1,
    fillStyle:"white",
    strokeStyle:"white",
    globalAlpha:0.4
  }
//The default values
```
### Grid.createGridBox()
This method creates a grid box on the 
coordinate of the grid provided in the parameter.

```js
let box = grid.createGridBox(2, 3);
//Will create a grid box on the grid coordinate x = 2 and y = 3

box.render();//renders the box
```
The box is not rendered until the *render* method of the box object is called.

*Note that the parameter provided is not   the scene coordinate in pixels but the grid coordinate system with respect to the grid x-origin and y-origin positions as (0,0).*

### Grid.createGridBoxes()
This method creates the grid boxes based on the properties of the grid object.
The *gridBoxes* array is flushed before creating the new sets of grid boxes when this method is called.
```js
grid.createBoxes();//create grid boxes from grid properties
grid.renderBoxes();//renders the boxes in the gridBoxes array
```
The grid boxes is not rendered until the *renderBoxes* method of the grid object is called.

### Grid.getBox()
This method gets a grid box based on the  x and y coordinate of the grid provided in the parameter.

```js
let box = grid.getBox(2, 3);//gets the grid box at the provided x and y coordinate of the grid
```
The method returns *null* if no box is found.

### Grid.removeBox()
This method removes a grid box from the *gridBoxes* array and also removes it from the scene.
It takes a parameter of the grid box to remove.

```js
grid.removeBox(box);//removes the box object provided
```

### Grid.createAxis()
This method creates the x and y axis lines of the grid.

```js
grid.createAxis();//creates the axis lines
grid.render();//renders the grid
```

### Grid.calibrate()
This method create a calibration and returns the calibration text object created.
It takes x and y coordinate of the grid to be calibrated.

```js
let calib = grid.calibrate(2, 4);//creates the calibration
calib.render();//renders the calibration
```
### Grid.calibrateAxis()
This method calibrates the x and y axis lines of the grid.

```js
grid.calibrateAxis();//creates the calibration
grid.renderCalibrations();//render the calibrations in the *calibrations* array of the grid object
```
### Grid.getCalibration()
This method gets a calibration using the x and y parameters provided as the x and y coordinate of the calibration on the grid.

```js
let calib = grid.getCalibration(2, 4);//gets the calibration
calib.scale(2, 2);//scales the width and height by 2
```
### Grid.removeCalibration()
This method removes a calibration provided in the parameter from the *calibrations* array and removes it from the scene.

```js
grid.remove(calib);//remove the calib, calibration text Object
```
### Grid.createAndRender()
This method creates the grid boxes, calibrations and axis lines depending on the parameter provided and renders them afterwards.
It takes 2 parameters:
  - axis, Boolean value specifying if to create axis lines. Default value is true
  - calibration, Boolean value specifying if to create calibrations. Default value is true.

```js
grid.createAndRender(true, true);
//Creates the axis lines, grid boxes and calibrations, afterwards renders them.
```
### Grid.renderBoxes()
This method renders the grid boxes in the *gridBoxes* array when called.

```js
grid.renderBoxes();// renders the grid boxes
```

### Grid.renderCalibrations()
This method renders the calibrations in the *calibrations* array.

```js
grid.renderCalibrations();//renders the calibrations
```
### Grid.render()
This method renders the axis lines, grid boxes and calibrations.

```js
grid.render();//renders the grid
```
### Grid.point()
This method reveals a point on the grid by making a small circular point on the x and y coordinate if the grid provided in the parameter.
It takes the following parameters:
  - x coordinate on the grid.
  - y coordinate on the grid.
  - radius of circular point. Default value is 5.

The method returns the point.

```js
let point = grid.point(2, 2, 10);//reveals the coordinate using a circular point of radius 10.
```
### Grid.place()
This method places an object on a given x and y coordinate on the grid.
Parameters include:
  - the *SanimObject* to be placed
  - x coordinate on the grid
  - y coordinate on the grid

```js
let rect = new RectObject (100, 100, 50, 50, true);//creating a rectangle
scene.addObject(rect);//adding the rect to the scene
grid.place(rect, -2, 2);//placing the rect on the given coordinate of the grid
```



