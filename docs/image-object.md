---
id: image-object
title: Adding Media to our project
sidebar_label: ImageObject
---

## ImageObject
Sanim-kit provides *Sanim.ImageObject* which allows drawing of images on the scene.
It inherits directly from *Sanim.SanimObject*.
*Sanim.ImageObject* constructor takes 5 parameters.
  - the file path which is a string value.
  - the x position of the image in pixels.
  - the y starting position of the image in pixels.
  - the width of the image in pixels.
  - the height of the image in pixels.

```js

import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let image = new Sanim.ImageObject("sanim_logo.png", 100, 100, 300, 300);//creating the image
image.props = {
    lineWidth:5,
    strokeStyle:"crimson",
}//defining the properties of the image. drawing a line around the image
scene.addObject(image);//adding the created image to scene.
scene.play();//playing the scene animation frame
```

### Result:
<iframe src="/demo/image-object/index.html" id="demo-frame-1" style="width:100%; height: 500px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## ImageObject References
The following are the properties and methods accessible on *Sanim.ImageObject*.

### ImageObject.filePath
This property defines the path to the media file.

### ImageObject.media
This property defines the Javascript media object.

### ImageObject.setMedia()
This method sets the media. It takes one parameter which is the path to the media file. 


*Sanim.ImageObject* inherits directly from *Sanim.SanimObject*, thus it inherits all the properties and methods accessible on *Sanim.SanimObject*.
Checkout the references for the properties and methods.
