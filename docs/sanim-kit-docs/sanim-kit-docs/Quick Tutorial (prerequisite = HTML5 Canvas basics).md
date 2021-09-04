## Quick Tutorial (prerequisite = HTML5 Canvas basics)
You can follow up the tutorial without having knowledge of the HTML5 Canvas. But if you have prior knowledge of the HTML5 Canvas, things will be a lot understandable for you. Anyway you can give the tutorial a try.

## Creating a scene
A scene is basically the world of your simulation or animation. The scene houses the 2d drawing context object, hence the scene is what controls how shapes and objects are drawn. To include the scene you first import the scene if you are seeing a task runner, but if you are not using any task runner, then you don't need to do any import.

```javascript
import Sanim from "sanim-kit";

const scene = new Sanim.Scene(context);
```

The context is an optional parameter, if not provided, Sanim kit will generate a canvas drawing context for the scene. But depending on how you want to customize your world, you might want to provide the context yourself. Here is how you can do that.

In your HTML file create a canvas element as shown below:

```html
<div><canvas id="scene"></canvas></div>
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
scene.height = window.innerHeight;
//This will make it take the height of the webpage
scene.width = window.innerWidth;
//This will make it take the width of the web page
```

Then you can as well change the color of the scene using the below program statement.

```javascript
scene.color = "black";
//Makes the scene have a black background color.
```

But you will not see the effect until the scene is rendered.

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

#### Adding to object to the scene

As you have scene the rectangle does not appear in the scene. This is because it have not been added to the scene. There are two methods available for adding an object to the scene.

 *scene.addObject(object)* and *scene.addChild(object)* 

The two methods does exactly same thing, there is no difference, it was made so for the sake of convenience.

So to add the object to the scene we will write the below line of code:

scene.addObject(rect);

Then finally we will have to render the scene to the canvas using the  *scene.render()* method

scene.render();

Or we render just the rect object alone using *rect.render()* method.

rect.render();

Note: *scene.render()* renders every object that has been added to the scene while *rect.render()* renders only the rect object.

What we can do again is to change the color property of the rect object we created. We can do this by referencing the *rect.props* object as shown below.

```javascript
rect.props.fillStyle = "lightgreen";
//Applying a light green color to it.
```
You can also use RGB and hexadecimal color scheme as accepted by the HTML5 Canvas drawing context.

Now you can go back and preview on your web browser and you should see the rectangle on the scene as shown below.

[Show a screenshot of the scene];

### Applying Transformation on the Object

Drawing a dummy rectangle to the canvas is not anything fun! It is fun when we can perform transformation on this objects we have rendered to the scene.

Here are the transformations effects on objects that are available in Sanim kit at this moment.

**rotate** , **scale**, **skew**, **translate** and **transform**

For instance I we can rotate the object by an angle using the following line of code:

```javascript
rect.rotate(Math.PI/4);
//applying 90 degrees rotation.
rect.render();
```

The rotation method takes one argument which is the angle of rotation in radians. But if are not a fan to working with angles in radians, then you could use the *scene.radian(angle_in_degree)* method to convert your angle in degrees to radians. Hence the earlier code will look like this.

```javascript
rect.rotate(scene.radian(90));
```

Then you can preview your code on your favourite web browser and the result should look like this.

[Show the screenshot]; 

For more information on transformation, you can check Sanim Kit's transformation references [put the link to it].

### Adding Animation to the scene

Being able to add transformation is a little fun but not much fun, there will be more fun if we can perform some animation effect on objects added to the canvas.
To add animation we will use the **Sanim.Animation** object to create animation.

```javascript
const animation = new Sanim.Animation(scene);
```

The parameter it takes is the scene.

Then we have to play the animation using the *play()* method of the animation object.

```javascript
animation.play();
//Playing the animation
```

But nothing happens because there is no animation effect on the scene yet. So what we can do is to rotate our rect object 2 times and in each time it will be a 45 degrees rotation.

We can do it using the below lines of code:

```javascript
animation.sleep(1000);
//Adding 1000 mili seconds delay
animation.execute(function(){rect.rotate(scene.radian(45))});
//We rotate the rect object 45 degrees
animation.sleep(1000);
[Repeat again]
```
*animation.execute()* method schedules an Task object to execute  a  a given function parameter.

*animation.sleep()* adds a delay to the animation.

Another thing we need to do is to play the animation frame of the scene. By this way all the animation effect will be observed in the scene as the scene will re render at a specific frame rate.

scene.play();

For more information on the scene frame rendering and on animation object, check the animation references.

Now preview the code in your web browser and see the scheduled animations take place.

### Adding Camera to the scene

It is a common thing in graphics development to add camera to the scene

You can as well add a camera to the canvas.

```javascript
//create the camera object
var cam = Sanim.Camera();
//Add the camera to the scene.
scene.setCamera(cam);
//Zoom into the canvas.
cam.zoom(2);
//This will scale the size of objects in the canvas by 2.
```


### Adding a Player object
It is a common thing in game development to add a player to the scene. 
One feature of a player is that the camera always follow the player as it moves in the scene.

Sanim-kit has an object that allows you implement some player features.

```javascript
//Create the Player object.
var plr = new Sanim.Player(rect);
```

The player object takes the parameter of the object to be made a player.

```javascript
//Set the player in the scene
scene.setPlayer(plr);
```

It is important to note that a scene can only have one player.

You can also set offset for the player.
Let's say we want the player to have a little offset from the edge of the canvas, we can set the player offset properties to do this.

```javascript
plr.offsetX = 50;
plr.offsetY = 100;
```

Now let's change the position of the player so that we can see the offset properties and player effect on camera position take place.

```javascript
plr.setPosition(1500, 1000);
```

This changes the position of the player, which is the RectObject (rect) we created earlier.

You see that the camera has moved with player, that is why the rest of the other objects in the canvas seems to have gone off the canvas. But the player remained.

For a better understanding of this it will be best to use, the animation object we created earlier to move the rect object on the canvas for you to see what happens as the rect object tends to go off the canvas.

first we have to comment out or remove the previous line of code.

```javascript
//plr.setPosition(1500, 1000);

for(var d = 0; d<=100; d++){
    animObj.execute(function(){rect.x+=15; rect.y+=10}
    animObj.sleep(100);//100 milliseconds delay each time.
}
```

Now the rect object moves diagonally on the scene until it reaches the position (1500, 1000) of the canvas.

