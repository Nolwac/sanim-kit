let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let line = new Sanim.StraightLineObject(100, 100, 500, 300);//creating the line
line.props = {
    lineWidth:5,
    strokeStyle:"crimson",
}//defining the properties of the line
scene.addObject(line);//adding the created line to scene.
scene.play();//playing the scene animation frame