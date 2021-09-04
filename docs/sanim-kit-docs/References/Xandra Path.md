## Xandra Pen path

The concept of the Xandra path(or Xandra pen path) is that Xandra has a pen on her hand with which she creates or draws a path on the scene.

It is similar to what you have in Python Turtle graphics and the Xandra Pen object shares some methods in come with the Turtle graphics library of Python except that Xandra Pen object uses lowerCamel case which is Javascript developers custom for naming. And of course Xandra Pen path does not have some the methods available in the Turtle graphics library of Python, vice versa.

To create a Xandra Pen path we need to do that through the Xandra object of Sanim-kit which also has an alias of Pen.

```js
import Sanim from 'sanim-kit';

var pen = new Sanim.Xandra(x, y, scene);
         // OR
var pen = new Sanim.Pen(300, 300, scene);
```

The constructor take the following parameters.
  - *x* starting position of the path.
  - *y* starting position of the path.
  - the scene on which the drawing should be made on.

Note that: Xandra pen is an extension of *Sanim.PathObject* which is an extension of *Sanim.SanimObject*, so it has all the properties and methods that a regular *SanimObject* posseses.

Now we can start drawing paths using the pen.

To draw a square we add the following block of code.

```javascript
pen.forward(200);//moves 200px forward
pen.left(scene.radian(90));//turn left by 90 degrees
pen.forward(200);
pen.left(scene.radian(90));
pen.forward(200);
pen.left(scene.radian(90));
pen.forward(200);
```

If you are fan to the Turtle graphics library of Python, you wouldn't need any additional explanation to understand how the piece of code above works.

The left method of the pen turns the invisible cursor towards to the left by the angle provided. Note that the angle is in radian so in order to work with degrees, we use the radian method of the scene object.

The forward method of the pen moves the invisible cursor forward by the distance in pixel provided.

So the end point is that the pen draws a square 200 by 200 pixels in dimension.

## Xandra Pen Path References
The following are the properties and methods  accessible in Xandra path object.

### Pen.world
This property defines the scene on which the path is to be drawn.

### Pen.animation
This property defines the *Sanim.Animation* object to be used for the drawing animation.

### Pen.turnAngle
This property holds the current direction of the pen in radian.

### Pen.currentX
This property holds the current *x* position of the pen relative to the pen's *x* starting position.

### Pen.currentY
This property holds the current *y* position of the pen relative to the pen's *y* starting position.

### Pen.interval
This property defines the interval of time for the drawing animation.

### Pen.fragments
This property defines the number of fragments for each path to be drawn.

```js
pen.fragments = 4;//this will make 
```
