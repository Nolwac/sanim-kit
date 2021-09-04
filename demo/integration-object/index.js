let elem = document.createElement('div');//creating a div element
elem.style.backgroundColor = "green";//giving the element a color of green

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let obj = new Sanim.Integration(elem, 100, 100, 300, 300);//creating the integration object
scene.addObject(obj);//adding the object to the scene

setTimeout(function(){obj.hide();}, 5000);//hiding the object after 5 seconds
setTimeout(function(){obj.show();}, 10000);//showing the object after 10 seconds
scene.play();//playing the scene animation frame