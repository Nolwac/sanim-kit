let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let arrow = new Sanim.ArrowHeadObject(100, 100, 100, 90, 60);//creating the arrow
arrow.props = {
    lineWidth:5,
    strokeStyle:"crimson",
}//defining the properties of the arrow
scene.addObject(arrow);//adding the created arrow to scene.
scene.play();//playing the scene animation frame
