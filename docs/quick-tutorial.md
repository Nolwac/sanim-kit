---
id: quick-tutorial
title: Quick Tutorial
sidebar_label: Quick Tutorial
---

## Quick Tutorial (prerequisite = HTML5 Canvas basics)
You can follow up the tutorial without having knowledge of the HTML5 Canvas. But if you have prior knowledge of the HTML5 Canvas, things will be a lot understandable for you. Anyway you can give the tutorial a try.

## Creating a scene
A scene is basically the world of your simulation or animation. The scene houses the 2d drawing context object, hence the scene is what controls how shapes and objects are drawn. To include the scene you first import the scene if you are using a task runner, but if you are not using any task runner, then you don't need to do any import.

```javascript
import Sanim from "sanim-kit";

const scene = new Sanim.Scene(context);
```

The context is an optional parameter, if not provided, Sanim kit will generate a canvas drawing context for the scene. But depending on how you want to customize your world, you might want to provide the context yourself. Here is how you can do that.

In your HTML file create a canvas element as shown below:

```html
<div><canvas id="canvas"></canvas></div>
```
Note: It is strongly advised that you put your canvas inside a div element.

Then in your JavaScript you can reference the canvas element as shown below:

```javascript
const canvas = document.getElementById("canvas");

const context = canvas.getContext("2d");

//You can now pass the context to the Sanim.Scene constructor.
```

For more information on The HTML5 Canvas context, you can check this reference from Mozilla developer community.

One thing you have to do again is to give your scene a width and height, using the below program statements.

```javascript
scene.context.canvas.height = window.innerHeight;
//This will make it take the height of the webpage
scene.context.canvas.width = window.innerWidth;
//This will make it take the width of the web page
```

Then you can as well change the color of the scene using the below program statement.

```javascript
scene.color = "black";
//Makes the scene have a black background color.
```

But you will not see the effect until the scene is rendered.

```javascript
scene.render();
//Rendering the scene
```
### Result:
<iframe src="/demo/quick-tutorials/index.html" id="demo-frame-1" style="width:100%; height: 200px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

So once you have your scene setup you can proceed to draw graphics on the scene.

## Creating an Object and adding it to the Scene

Now we have created the scene, let's create an object and add it to the scene.

```javascript
let rect  = new Sanim.RectObject(100, 100, 200, 400, true);
```

The Sanim.RectObject draws a rectangle to the scene. It takes 4 compulsory parameters, which are:

  + The **x** and **y** starting position to draw the rectangle respectively.
  + The **width** and **height** of the rectangle respectively. 

Then it takes an optional parameter, **fillRect**, which denotes if the rectangle should be filled with color or not. The default value is false. So if you want the rectangle to be filled with color then you have to set the property to be true. This properties can be dynamically changed in the program.

### Adding the object to the scene

As you have scene the rectangle does not appear in the scene. This is because it have not been added to the scene. There are two methods available for adding an object to the scene.

 *scene.addObject(object)* and *scene.addChild(object)* 

The two methods does exactly same thing, there is no difference, it was made so for the sake of convenience.

So to add the object to the scene we will write the below line of code:
```javascript
scene.addObject(rect);
```
Then finally we will have to render the scene to the canvas using the  *scene.render()* method
```javascript
scene.render();
```
Or we render just the rect object alone using *rect.render()* method.
```javascript
rect.render();
```

Note: *scene.render()* renders every object that has been added to the scene while *rect.render()* renders only the rect object.

What we can do again is to change the color property of the rect object we created. We can do this by referencing the *rect.props* object as shown below.

```javascript
rect.props.fillStyle = "lightgreen";
//Applying a light green color to it.
```
Note: that any changes you want to apply to the object or scene must come before the scene or object is rendered. You can call the render method as many times as desired so as to rerender an object or scene after some changes.
You can also use RGB and hexadecimal color scheme as accepted by the HTML5 Canvas drawing context.

Now you can go back and preview on your web browser and you should see the rectangle on the scene as shown below.

### Result:
<iframe src="/demo/quick-tutorials/rect-object.html" id="demo-frame-2" style="width:100%; height: 600px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-2').contentDocument.location.reload(true);">Reload</button>

## Applying Transformation on the Object

Drawing a dummy rectangle to the canvas is not anything fun! It is fun when we can perform transformation on this objects we have rendered to the scene.

Here are the transformations effects on objects that are available in Sanim kit at this moment.

**rotate** , **scale**, **skew**, **translate** and **transform**

For instance I we can rotate the object by an angle using the following line of code:

```javascript
rect.rotate(Math.PI/4);
//applying 90 degrees rotation.
rect.render();//this will create a copy of the object in the scene, if done this way

scene.render();//this will remove the effect of the above program statement, technically it rerenders the scene.

```

The rotation method takes one argument which is the angle of rotation in radians. But if are not a fan to working with angles in radians, then you could use the *scene.radian(angle_in_degree)* method to convert your angle in degrees to radians. Hence the earlier code will look like this.

```javascript
rect.rotate(scene.radian(90));
```

Then you can preview your code on your favourite web browser and the result should look like this.

### Result:
<iframe src="/demo/quick-tutorials/rect-object-rotate.html" id="demo-frame-3" style="width:100%; height: 600px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-3').contentDocument.location.reload(true);">Reload</button>

For more information on transformation, you can check Sanim Kit's transformation references [put the link to it].

## Applying Animation on object

Being able to add transformation is a little fun but not much fun, there will be more fun if we can perform some animation effect on objects added to the canvas.
To add animation we will use the **Sanim.Animation** object to create animation.

```javascript
const animation = new Sanim.Animation(scene);
```

The parameter it takes is the scene.


But nothing happens because there is no animation effect on the scene yet. So what we can do is to rotate our rect object 2 times and in each time it will be a 45 degrees rotation.

We can do it using the below lines of code:

```javascript
animation.sleep(1000);
//Adding 1000 mili seconds delay
animation.execute(function(){rect.rotate(scene.radian(45))});
//We rotate the rect object 45 degrees
animation.sleep(1000);//1000 mili seconds delay
animation.execute(function(){rect.rotate(scene.radian(45))});
//Rotating the rect object by 45 degrees again
animation.sleep(1000);//1000 mili seconds delay
```
*animation.execute()* method schedules an Task object to execute  a  a given function parameter.

*animation.sleep()* adds a delay to the animation.

Another thing we need to do is to play the animation frame of the scene. By this way all the animation effect will be observed in the scene as the scene will re render at a specific frame rate.
```javascript
scene.play();// playing animation frame for the scene
```
For more information on the scene frame rendering and on animation object, check the animation references.

Now preview the code in your web browser and see the scheduled animations take place.

### Result:
<iframe src="/demo/quick-tutorials/rect-object-animate.html" id="demo-frame-4" style="width:100%; height: 600px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-4').contentDocument.location.reload(true);">Reload</button>

## Adding Camera to the scene

It is a common thing in graphics development to add camera to the scene

You can as well add a camera to the canvas.

```javascript
//creating another rectangle
let rect2  = new Sanim.RectObject(100, 100, 200, 100, true);
//adding the new object to scene
scene.addObject(rect2);

//create the camera object
const cam = new Sanim.Camera();
//Add the camera to the scene.
scene.setCamera(cam);
//Zoom into the canvas.
cam.scaleZoom(2);
//This will scale the size of objects in the canvas by 2.
```
### Result:
<iframe src="/demo/quick-tutorials/camera.html" id="demo-frame-5" style="width:100%; height: 600px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-5').contentDocument.location.reload(true);">Reload</button>

## Adding a Player object
It is a common thing in game development to add a player to the scene. 
One feature of a player is that the camera always follow the player as it moves in the scene.

Sanim-kit has an object that allows you implement some player features.

```javascript
//Create the Player object.
const plr = new Sanim.Player(rect);
```

The player object takes the parameter of the object to be made a player.

```javascript
//Set the player in the scene
scene.setPlayer(plr);
```

It is important to note that a scene can only have one player.

You can also set offset for the player.
Let's say we want the player to have a minimum offset from the edge of the canvas, we can set the player offset properties to do this.

```javascript
plr.minOffsetX = 50;
plr.minOffsetY = 100;
```

Now let's change the position of the player so that we can see the offset properties and player effect on camera position take place.


For a better understanding of this it will be best to use, the animation object we created earlier to move the rect object on the canvas for you to see what happens as the rect object tends to go off the canvas.

But first we are going to set the camera zoom to be 0.25 of its current scale so that the object will be smaller.

```javascript
cam.scaleZoom(0.25);

for(let d = 0; d<=100; d++){
    animObj.execute(function(){rect2.x+=15; rect2.y+=10});
    animObj.sleep(100);//100 milliseconds delay each time.
}
```

### Result:
<iframe src="/demo/quick-tutorials/player.html" id="demo-frame-6" style="width:100%; height: 600px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-6').contentDocument.location.reload(true);">Reload</button>

Now the rect object moves diagonally on the scene until it reaches the position (1500, 1000) of the canvas.
You see that the camera has moved with player (rect2, which is white), that is why the other object in the canvas seems to have gone off the canvas. But the player remained. Also observe that the player never goes off the canvas and that it has an offset from the canvas edges. This was as a result of the minimum offset property set on the player
