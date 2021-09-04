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