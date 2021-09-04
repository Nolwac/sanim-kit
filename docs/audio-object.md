---
id: audio-object
title: Adding Media to our project
sidebar_label: AudioObject
---

## AudioObject
Sanim-kit provides *Sanim.AudioObject* which allows playing of audio on the background.
*Sanim.AudioObject* constructor takes only one parameter.
  - the file path which is a string value.

```js

import Sanim from "sanim-kit";

let audio = new Sanim.AudioObject("nwafor.mp3");//creating the audio
audio.play();//playing the audio
```

### Result:
<iframe src="/demo/audio-object/index.html" id="demo-frame-1" style="width:100%; height: 100px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

## AudioObject References
The following are the properties and methods accessible on *Sanim.AudioObject*.

### AudioObject.media
This is a Javascript *Audio* object.

*Sanim.AudioObject.media* is a Javascript *Audio* object, thus it inherits all the properties and methods accessible on the *Audio* object of Javascript.