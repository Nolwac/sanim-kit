---
id: sanim-object
title: The root object Sanim Kit, SanimObject
sidebar_label: SanimObject
---

## SanimObject
All the objects that can be added to the scene inherit from *Sanim.SanimObject* constructor.

It holds all the features that can help you create your own custom object to be added to the scene.

```js
import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let rect = new Sanim.RectObject(300, 450, 50, 50, true); //creating a rectangle
scene.addObject(rect);//adding the created rectangle
scene.play();//playing the scene animation frame
```
The above block of code creates a rectangle from a *Sanim.RectObject* which inherits from *Sanim.SanimObject* constructor.

## SanimObject References
Here are the properties and methods accessible in *Sanim.SanimObject*

### SanimObject.path2DObject
This property holds the canvas rendering context *Path2D* object created for rendering the object.

### SanimObject.children
This property holds the array of children objects added to a given *Sanim.SanimObject*

### SanimObject.props
This property is an object that defines the properties for rendering a *Sanim.SanimObject*.

The property names are to be used as is with the *HTML5 2d rendering context properties*.

You can define the rendering properties individually by accessing the property names individually.

```js
rect.props.lineWidth = 10;//giving the stroke line a width of 10px
rect.props.strokeStyle = "crimson";//giving it the stroke color of crimson
```
Or you can define them collectively through the *SanimObject.props* property.
But this will change the object entirely.

```js
rect.props = {
    lineWidth: 10,
    strokeStyle: "crimson"
}
```
The best way to set the properties would be to use the Javascript *Object.assign* method. Doing it this way will keep whatever property that has been set earlier and will only overwrite the properties that has been modified.

```js
Object.assign(rect.props, {lineWidth:10, strokeStyle:"crimson"});
```
If a value is not set for a given property then the Sanim-kit will use the value set for the property on *Sanim.Scene.canvasContextProperties*.

The default values for the properties are shown below.

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
### SanimObject.parentObject
This property holds the parent of an object. If the object was not added to the scene as a child object to another object, then the value will be *null*

### SanimObject.translationMatrix
This property holds an array of values consisting of the *x* and *y* parameters for object translation.

### SanimObject.skewMatrix
This property holds an array of values consisting of the *x* and *y* parameters for performing skewing transformation on object.

### SanimObject.scaleMatrix
This property holds an array of values consisting of the *x* and *y* parameters for performing scaling transformation on object.

### SanimObject.transformationMatrix
This property holds an array of values consisting of the 6 parameters for perform transformation on object.
The parameters required are:

### SanimObject.rotationAngle
This property holds the rotation angle of an object in radians. This value is used in applying rotational transformation on object.

### SanimObject.transformationOrigin
This property defines the transformation origin for an object

### SanimObject.renderingTransformationOrigin
*SanimObject.transformationOrigin* is not used for rendering the object to scene, it only holds the integrity of the desired rendering origin. So this property provides the rendering transformation origin. 

*This property may change as the object is rendered. Hence make no attempt to set your transformation origin using this property, use renderingTransformationOrigin instead*
### SanimObject.transformWithParent
This property holds a boolean value that defines if an object should transform with it's parent whenever a transformation is applied on it's parent object.
The default value is *true*.

### SanimObject.translateWithParent
This property holds a boolean value that defines if an object should translate with it's parent whenever a translation transformation is applied on it's parent object.
The default value is *true*. 

### SanimObject.skewWithParent
This property holds a boolean value that defines if an object should skew with it's parent whenever a skewing transformation is applied on it's parent object.
The default value is *true*. 

### SanimObject.scaleWithParent
This property holds a boolean value that defines if an object should scale with it's parent whenever a scaling transformation is applied on it's parent object.
The default value is *true*. 

### SanimObject.rotateWithParent
This property holds a boolean value that defines if an object should rotate with it's parent whenever a rotation transformation is applied on it's parent object.
The default value is *true*. 

### SanimObject.noTransformationWithParent
This property holds a boolean value that defines if an object should not transform with it's immediate parent object whenever a transformation is applied on it's immediate parent object.
The default value is *false*. 

### SanimObject.noAncestorTransformation
This property holds a boolean value that defines if an object should not transform with it's ancestors objects and not it's immediate parent object whenever a transformation is applied on any of it's ancestor objects.
The default value is *false*. 

### SanimObject.isInPath()
This method checks if an *x*, *y* coordinate (a point) is within the path of an object.
The method returns a boolean value.
It returns *true* if the point is in the path and *false* if otherwise.

```js
rect.isInPath(200, 300);//will return false since the point  200, 300 is not within the  rectangle area.
```

*Note that, the method does not take into consideration transformations done on object. So always consider that while calling the method.*

### SanimObject.addEvent()
This method associates a browser-user event with the object.
Use this method to add events (click, mousemove, drag, etc) as you would do with *HTML DOM addEventListener* method.

It takes 3 parameters.
  - the event type
  - the event callback function when the specified event type is being performed on the object.
  - (optional) the event callback function when the specified event type is not being performed on the object


```js
rect.addEvent("click", function(e){
    e.canvasTargetObject.props.fillStyle = "orange";
});//changes the background color to orange when object is clicked on
```
The above code snippet will change the background color of the rect object to orange when it is clicked on.

In a case where we want to perform some task if the specified event type is being performed on the canvas, but not on the object, we add a third parameter to the method.

```js
rect.addEvent("click", function(e){
    e.canvasTargetObject.props.fillStyle = "orange";
}, function(e){
    e.canvasTargetObject.props.fillStyle = "crimson";
});//changes the background color to orange when object is clicked on and to crimson when the click is not on the object.
```
Just as you would do with *HTML DOM events* you can put the *event object* argument in your callback functions and use it to access the *event object* parameter passed to the callback function by the web browser.

As you can see from the code snippet above, you can access the object the event is tied to using the *canvasTargetObject* property of the event object.

### SanimObject.addChild()
This method adds an object as a child object to the object through which the method is called.
It takes a parameter of the object to be added as a child.

```js
let childRect = new Sanim.RectObject(10, 10, 20, 20, true);
rect.addChild(childRect);//adding the childRect

childRect.props = {// styling the child rect
    lineWidth: 5,
    strokeStyle: "skyblue",
    fillStyle: "green"
}
```
When adding an object as child to another object, make sure to remove it from the previous parent, if it has been added to an object or the scene initially.

Note that the x and y positions of the object is relative to it's parent object. What this means is that if the parent object x and y position is (200, 300) and the child object x and y position is (50, 100) then. Then the actual rendering position of the object is a sum total of it's position with that of it's parent, *(200+50, 300+100) = (250, 400)*.

### SanimObject.removeChild()
This method removes a child object from the object through which the method is called.
It takes one parameter of the object to be removed.

This method does not delete the child object, hence the child object can be added to another object or to the scene directly.

```js
rect.removeChild(childRect);//removes the childRect from the rect 
```

### SanimObject.flushChildren()
This method removes all the children objects in added to this object when called.

### SanimObject.implementAfterAddedToScene()
This method is called the moment an object is being added to the scene, but not on render.
Overwrite this method to add a custom code block to be executed when the object is being added to the scene.

### SanimObject.hide()
This method hides the object when called.

```js
rect.hide();//hides the rect
```

### SanimObject.show()
This method shows the object when called.

```js
rect.show();//shows the object if hidden
```

### SanimObject.fadeOut()
This method fades out the object when called. What this means is that the object gradually disappears with time and not instantaneously.

It takes 2 parameters.
  - the animation object to be used.
  - the time it should take for the object fade out (disappear).

```js
let anim = new Sanim.Animation(scene);//creating animation object to be used
rect.fadeOut(anim, 3000);//fades out the object in 3 seconds.
```

### SanimObject.fadeIn()
This method fades in the object when called. What this means is that the object appears gradually and not instantaneously, if it was hidden.
It takes 2 parameters.
  - the animation object to use
  - the time it should take for the object to fade in.

```js
rect.fadeIn(anim, 1000);//fades in within a second.
```

### SanimObject.scale()
This method scales the object.
It takes 2 parameters.
  - the scaling factor on the x direction
  - the scaling factor on the y direction

```js
rect.scale(1.5, 0.5);//scale the object by 1.5 on the x direction and by 0.5 on the y direction
```

### SanimObject.rotate()
This method rotates the object by a specified angle.
It takes a parameter of the angle of rotation in radians.

```js
rect.rotate(scene.radian(45));//rotates the rect 45 degrees
```
### SanimObject.translate()
This method translates the object by the specified amount.
It takes 2 parameters.
  - the amount of translation on the x direction in pixels.
  - the amount of translation on the y direction in pixels.

```js
rect.translate(50, -40);//translates the object 50 pixels on the x direction and -40 pixels on the y direction.
```
### SanimObject.skew()
This method skews the object by the angles specified.
It takes 2 parameters.
  - the skewing angle on the x direction in radian
  - the skewing angle on the y direction in radian

```js
rect.skew(scene.radian(45), scene.radian(60));//skews the object 45 degrees on x and 60 degrees on y directions.
```
### SanimObject.transform()
This method performs a transformation on the object using transformation parameters provided.
It takes 6 parameters.
  - the horizontal scaling. A value of 1 results in no scaling.
  - the vertical skewing.
  - the horizontal skewing.
  - the vertical scaling. A value of 1 results in no scaling.
  - the amount of translation on the x direction
  - the amount of translation on the y direction.

```js
rect.transform(2, Math.PI/4, Math.PI/4, 1.5, 200, 100);//tranformation on rect object
```

### SanimObject.motionPath()
This method creates an instance to move the object through a path on the scene using *Sanim.Function* object as a template that provides the path of motion.
It takes a parameter of the *Sanim.Function* object to use.

The method returns a copy of the *Sanim.Function* object passed to it, with few modifications.
To start the motion, you need to call the *start* method of the object returned.

```js
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
Watch how most of the example codes plays out. Observe the color properties, the click event, fade in fadeout, child object, and the parabolic motion path added to the object. Click on the object and click on the canvas afterwards to see how the color changes.

### Result:
<iframe src="/demo/sanim-object/index.html" id="demo-frame-1" style="width:100%; height: 600px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

### SanimObject.render()
This method renders the object to the scene when called.