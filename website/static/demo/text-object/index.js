let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let text = new Sanim.TextObject("Sanim-kit", 100, 100, true);//creating the text
text.props = {
    font:"40px bold arial",
    fillStyle:"crimson"
}//defining the properties of the text
scene.addObject(text);//adding the created text to scene.
scene.play();//playing the scene animation frame