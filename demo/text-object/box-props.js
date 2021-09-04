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

text.boxProps = {
    paddingX:20,//20 pixels padding
    paddingY:40,
    fillStyle:"white",//background color
    strokeStyle:"crimson",//border line color
    lineWidth:5//border line width
}
text.fillBox = true;//specifying that text box should be filled