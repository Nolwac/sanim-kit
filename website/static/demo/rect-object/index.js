let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let rect = new Sanim.RectObject(100, 100, 50, 70, true);//creating the rectangle
rect.props = {
    lineWidth:5,
    strokeStyle:"green",
    fillStyle:"crimson"
}//defining the properties of the rectangle
scene.addObject(rect);//adding the created rectangle to scene.
scene.play();//playing the scene animation frame