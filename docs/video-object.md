---
id: video-object
title: Adding Media to our project
sidebar_label: VideoObject
---

## VideoObject
Sanim-kit provides *Sanim.VideoObject* which allows drawing of video frames on the scene.
It inherits directly from *Sanim.SanimObject*.
*Sanim.VideoObject* constructor takes 5 parameters.
  - the file path which is a string value.
  - the x position of the video in pixels.
  - the y starting position of the video in pixels.
  - the width of the video in pixels.
  - the height of the video in pixels.

```js

import Sanim from "sanim-kit";

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let video = new Sanim.VideoObject("nwafor.mp4", 20, 20, 350, 200);//creating the video
video.props = {
    lineWidth:5,
    strokeStyle:"crimson",
}//defining the properties of the video. drawing a line around the video
scene.addObject(video);//adding the created video to scene.
video.media.play();//playing the video
scene.play();//playing the scene animation frame
```

### Result:
<iframe src="/demo/video-object/index.html" id="demo-frame-1" style="width:100%; height: 300px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## VideoObject References

*Sanim.VideoObject* inherits directly from *Sanim.SanimObject*, thus it inherits all the properties and methods accessible on *Sanim.ImageObject*.
Checkout the references for the properties and methods.