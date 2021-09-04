## The Scene
The Scene is the graphical term that describes the world of our graphics project.

To add new Scene use *Sanim.Scene* constructor with a canvas 2d context property.

```javascript
import Sanim from "sanim-kit";

let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
var scene = new Sanim.Scene(context);
```

Then you can start drawing your graphics unto the scene

## References

### Scene.color
This property of the scene sets the background color of the scene. 

```js
scene.color = "green";
//Will give the scene background color of green
```
The color schemes that are acceptable include.
  - RGB color scheme
  - Hexadecimal color scheme
  - And specifying the color by the name
 
### Scene.context
This property of the Scene holds the canvas drawing context.

```js
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
var scene = new Sanim.Scene(context);
```

### Scene.isParentWorld
This property of the scene hold a boolean value which specifies if the scene is the parent scene or a child scene. 
This is very useful in cases where we have more than one drawing canvas. You can assign one of the canvas to a parent scene and the rest assigned to child scene objects.

```js
scene.isParentWorld = true;
//Will make the scene a parent.
```
By default the property is set to *false*

### Scene.clearBeforeRender
This property sets if the previous frame of the scene should be cleared before another is frame is rendered. The value is a boolean value.
```js
scene.clearBeforeRender = "false";
//Will make each new frame render on top the previous frame.
```
The default value is *true*

### Scene.objects
This property holds the array of objects added to the Scene.
The array is empty if no object has been added to the scene.

### Scene.animationObjects
This property holds the array of animation objects tied to the scene.

### Scene.width
This property holds the width property of the scene, hence it defines the width of the scene.
```js
scene.width = 600;
//Gives the scene width of 600 pixels in dimension.
```

### Scene.height
This property holds the height of the scene, hence it defines the height of the scene.
```js
scene.height = 500;
//Gives the scene height of 500 pixels in dimension.
```
### Scene.canvasContextProperties
This property holds and defines the default rendering properties for objects to be rendered on the scene.
```js
scene.canvasContextProperties.globalApha = 0;
//Will make scene objects completely transparent by default
```
Below is the default value of the property.

```js
Scene.canvasContextProperties = {
		globalAlpha: 1,
		globalCompositeOperation: "source-over",
		filter: "none",
		imageSmoothingEnabled: true,
		imageSmoothingQuality: "low",
		strokeStyle: "#a52a2a",
		fillStyle: "#ffffff",
		shadowOffsetX: 0,
		shadowOffsetY: 0,
		shadowBlur: 0,
		shadowColor: "rgba(0, 0, 0, 0)",
		lineWidth:1.0000000168623835e-16,
		lineCap: "butt",
		lineJoin: "miter",
		miterLimit: 10,
		lineDashOffset: 0,
		font: "10px sans-serif",
		textAlign: "start",
		textBaseline: "alphabetic",
		direction: "ltr"
	}
```
The HTML 2d rendering context properties for reference on the properties above.

### Scene.playAnimation
This property is a boolean value which specifies if the frames of the scene should be rendered or not.
The default value is *true*
### Scene.play(interval)
This method creates and starts animation loop for rendering on the scene.
```js
scene.play(100);
//Creates a rendering loop at an interval of 100 milliseconds.
```

### Scene.pause()
This method stops an existing animation loop on the scene if any.

```js
scene.pause();
//Stops the loop and clears the interval/setTimeout
```
### Scene.addObject()
This method adds an object to the scene for rendering.
An object will not appear on the scene if it is not added to the scene.

```js
let rect = new Sanim.RectObject(100, 100, 300, 200, true);//creates object
scene.addObject(rect);//adding object to the scene 
```
It takes a parameter of object to be added to scene.

### Scene.removeObject()
This method removes an object from the scene.

```js
scene.removeObject(rect);
//removes the rect object
```
It takes a parameter of the object to be removed.

### Scene.addChild()
This method works exactly as *Scene.addObject()* method.

### Scene.removeChild()
This method works exactly as *Scene.removeObject()* method

### Scene.camera 
This property holds the camera object that is tied to the scene. The default value is *null*, signifying that there is no camera on the scene.

### Scene.setCamera()
This method sets the camera of the scene
```js
var cam = new Sanim.Camera();
scene.setCamera(cam);
```
It takes a parameter of the camera object to be set on the scene

### Scene.player
This property holds player object that is tied to the scene.
The default value is *null*, signifying that there is no player on the scene.

### Scene.setPlayer()
This method sets the player for the scene.

```js
let rect = new Sanim.RectObject(100, 100, 300, 200, true);//creates object
scene.addObject(rect);//adding object to the scene
let player = new Sanim.Player(rect);//creates a player using object created
scene.setPlayer(player);//sets the player
```
The takes a parameter of the player object to be set for the scene.

### Scene.createGrid()
This method creates a grid and adds it to the scene. The grid created will fit perfectly on the scene

It takes two parameters which are the *xScale* and *yScale* of the grid to be created.

```js
let grid = scene.createGrid(100, 100);
//Creates a grid that fits to the scene
```
It returns an object which has 3 properties.
  - the grid create, *grid*
  - the actual scene of the grid created, *gridScene*
  - the integration object for the canvas tied to the gridScene, *integration*
 
The grid create does not render on the scene from which the *createGrid* method is called. This is because of performance purposes. 
The grid is rendered on a new Scene object, hence a new canvas is usually created, and an *Integration* object is created for the canvas.

### Scene.render()
This method renders the objects added to the scene unto the canvas when called.

```js
scene.render();
//renders the scene objects
```
### Scene.runAnimation()
This method runs the animation objects that is tied to the scene when called.

```js
scene.runAnimation();
//Runs the animation objects tied to the scene
```
### Scene.radian()
This method takes a parameter of angle in degrees and returns angle in radian.

```js
let halfPi = scene.radian(90);
//halfPi will be PI divided by 2
```
### Scene.requestFullscreen()
This method requests fullscreen with focus on the *parentElement* of the scene canvas when called.

```js
scene.requestFullscreen();
//request fullscreen on the browser window
```
### Scene.cancelRequestFullscreen()
This method cancels the request for full screen, hence it will remove fullscreen on the browser window.
```js
scene.cancelRequestFullscreen();
//Removes fullscreen on browser window.
```
### Scene.flush()
This method flushes the scene of it's objects and animations when called.
This will make the *objects* array and *animationObjects* array properties of the scene empty.

```js
scene.flush();
//removes the objects on the scene including animation objects.
```
### Scene.flushObjects()
This method flushes the scene of it's objects only and does not remove the animation objects.

```js
scene.flushObjects();
//flushes the objects added to the scene
```

### Scene.flushAnimations()
This method flushes the scene of it's animation objects only and does not remove the objects added to the scene.

```js
scene.flushAnimations();
//Flushes the animation objects added to the scene.
```

### Scene.executeOnRender()
This method gets executed each time the  render method of the scene is called.
By default the method is not set.

But you can overwrite the method to add a custom functionality that you would want to execute whenever the render method is called.

```js
scene.executeOnRender = function (){
    console.log("Scene has just be rendered");
//Put block of code to be executed each time the render method is called.
}
```


