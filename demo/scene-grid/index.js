let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black
scene.render();//rendering to apply changes

//----------- adding a grid -----------

let grid = new Sanim.Grid(scene, scene, 50, 50);//creating grid.
grid.createAndRender(true, true);//creating grid boxes and calibrations and rendering them to the scene.