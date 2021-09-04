---
id: camera-and-player
title: Adding Camera and Player
sidebar_label: Adding Camera and Player
---

## Camera and Player

Sanim-kit provides objects that allows you implement some player and camera functionalities on the scene.

## Camera
In computer graphics a camera reveals the viewport to show objects in the scene. 
You may add camera to the scene to control part of the scene that gets displayed and also control the scale of objects in the scene

To add camera, you first create the Camera using *Sanim.Camera* object constructor, the you set the scene camera with the camera object created.

```js
import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let rect = new Sanim.RectObject(100, 50, 50, 50, true); //creating a rectangle
scene.addObject(rect);//adding the created rectangle

let cam = new Sanim.Camera();//creating the camera
scene.setCamera(cam);//setting the scene's camera

scene.play();//starting animation loop
```
The above code snippet will draw a 50 by 50 pixels rectangle on the scene with a camera on the scene which is not visible to you, only the effect can be perceived.
Note that a scene can only have 1 camera at a time.

### Result:
<iframe src="/demo/camera-and-player/index.html" id="demo-frame-1" style="width:100%; height: 250px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

Adding the below line of code will scale all the objects in the scene by the factor of 2.

```js
cam.scaleZoom(2);//zoom in by a factor of 2
```
### Result:
<iframe src="/demo/camera-and-player/scale.html" id="demo-frame-2" style="width:100%; height: 250px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-2').contentDocument.location.reload(true);">Reload</button>

## Camera References
The following are references to properties and methods available in a *Sanim.Camera* object.

### Camera.x
This property defines the camera viewport*x* starting position.

The default value is *0*

### Camera.y
This property defines the camera viewport *y* starting position.

The default value is *0*

### Camera.z
This property defines the camera viewport *z* position.

The default value is *0*

*This property is currently not implemented and so has no effect on rendering*

### Camera.zoom
This property defines the camera zoom index.

The default value is *1* which does no alter the original dimension of objects drawn to the scene.

### Camera.width
This property defines the width property of the camera viewport.

The default value is the *innerWidth* value of the browser window.
 
*Altering this property at the current version of Sanim-kit has no effect on rendering*

### Camera.height
This property defines the width property of the camera viewport.

The default value is the *innerHeight* value of the browser window.
 
*Altering this property at the current version of Sanim-kit has no effect on rendering*

### Camera.position()
This method sets the camera position on the canvas.
It takes a parameter of the x, y, z starting positions to set.

```js
cam.position(100, 50, 100);//set x, y, z properties respectively
```

### Camera.setProperties()
This method sets the camera x, y, z and zoom properties with the parameters provided.

```js
cam.setProperties(50, 100, 50, 0.5);//sets x, y, z and zoom properties respectively
```

### Camera.setDimension()
This method sets the camera width and height properties using the parameters provided. 

```js
cam.setDimension(300, 200);//sets the width to be 300 and height 200
```

### Camera.scaleZoom()
This method scales the camera zoom property by the parameter value provided.

```js
cam.scaleZoom(2);//scales the zoom value by 2
```

## Player
In gaming, it is a common thing to have a player on the scene. The player is usually a regular object which has camera focus on it. Meaning that the camera moves with the players so as to make sure sure that the player always appear on the scene, no matter how it is moved.

Sanim-kit provides the *Player* object which allows some player implementations.
### Adding player to scene
To add a player to the scene, use the *Player* Object constructor passing the object to make a player as the parameter  to create the player. Then set the player on the scene.

```js
let ball = new Sanim.Circle(50, 50, 20, true);//drawing a circle as ball
let plr = new Sanim.Player(ball);//creating a player out of the ball
scene.setPlayer(plr);//setting the player on the scene
```
Note that the scene can only have a single player at a time.

## Player References
The following are the properties and methods available in *Sanim.Player* object.

### Player.object
This property holds the *SanimObject* the player is tied to.

### Player.minOffsetX
This property defines the minimum offset of the *Player.object* on the x directions of the scene.

```js
plr.minOffsetX = 100;
//this will make sure that the player is at least 100 pixels away from the edges of the canvas in the x direction
```
The minOffsetX ensures that the object is at least a value away from the edge of the canvas in the horizontal directions.

### Player.minOffsetY
This property defines the minimum offset of the *Player.object* on the y directions of the scene.

```js
plr.minOffsetY = 75;
//this will make sure that the player is at least 75 pixels away from the edges of the canvas in the y direction
```
The minOffsetY ensures that the object is at least a value away from the edge of the canvas in the vertical directions.

### Player.coupleToCamera
This property is a boolean value which defines if the *Player.object* should be coupled to camera.
If *true* the camera moves with the player. And if *false*, the camera maintains it's position.
The default value is *true*

*There must be a camera set on the scene for this effect to take place*

### Player.makeCameraAdjustments()
This method makes adjustment on the scene based on the player properties when called.
*There must be a camera set on the scene for this effect to take place*

*This method should not be overwritten*

### Player.implementAfterAddedToScene()
This method defines a function that should be implemented immediately the  player is set to the scene.

Overwrite this method to implement custom functionality immediately the player is added to scene.

### Player.render()
This method makes camera adjustment and re-renders the scene for the adjustment to take effect on the scene.
