const canvas = document.getElementById("canvas");

const context = canvas.getContext("2d");

//You can now pass the context to the Sanim.Scene constructor.
const scene = new Sanim.Scene(context);

scene.context.canvas.height = window.innerHeight;
//This will make it take the height of the webpage
scene.context.canvas.width = window.innerWidth;
//This will make it take the width of the web page
scene.color = "black";
//Makes the scene have a black background color.
scene.render();
//Rendering the scene