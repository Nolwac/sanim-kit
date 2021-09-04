let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let rect = new Sanim.RectObject(100, 50, 50, 50, true); //creating a rectangle
scene.addObject(rect);//adding the created rectangle

let cam = new Sanim.Camera();//creating the camera
scene.setCamera(cam);//setting the scene's camera

scene.play();//starting animation loop