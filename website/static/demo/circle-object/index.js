let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let circle = new Sanim.CircleObject(100, 100, 50, true);//creating the circle
circle.props = {
    lineWidth:5,
    strokeStyle:"green",
    fillStyle:"crimson"
}//defining the properties of the circle
scene.addObject(circle);//adding the created circle to scene.
scene.play();//playing the scene animation frame