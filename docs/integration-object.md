---
id: integration-object
title: Integrating DOM elements in the scene
sidebar_label: Integration Object
---

# Integration Object
The integration object provides an interface for us to add third party graphics to our sanim-kit project or use multiple scene instance on our project by extending a HTML element to a SanimObject.

To create an Integration object we use the Integration constructor passing the following parameters to the constructor
- *element*, the HTML element to be extended to a SanimObject.
- *x*, the position to place the object on the horizontal (x-axis).
- *y*, the position to place the object on the vertical (y-axis).
- *width*, the width of the object.
- *height*, the height of the object.

```js

import Sanim from "sanim-kit";

let elem = document.createElement('div');//creating a div element
elem.style.backgroundColor = "green";//giving the element a color of green

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let obj = new Sanim.Integration(elem, 100, 100, 300, 300);//creating the integration object
scene.addObject(obj);//adding the object to the scene

setTimeout(function(){obj.hide();}, 5000);//hiding the object after 5 seconds
setTimeout(function(){obj.show();}, 10000);//showing the object after 10 seconds
scene.play();//playing the scene animation frame
```
### Result:
<iframe src="/demo/integration-object/index.html" id="demo-frame-1" style="width:100%; height: 500px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

With the integration object we can use multiple scenes on our project. We can layer another scene on top another. By this way we can use third party libraries for drawing graphics on the Canvas together with Sanim-kit

## Integration object Referrences
The integration object excludes some of the method available in the standard SanimObject. Some of these methods include:
- rotate
- skew
- scale
- removeTransformation
- translate
- translationMatrix
- scaleMatrix
- rotationMatrix
- skewMatrix
- rotationAngle
- grow

The following methods are accessible under the *Sanim.Integration* object

### Integration.removeFromDOM()
This method reomves the element fromt the DOM,