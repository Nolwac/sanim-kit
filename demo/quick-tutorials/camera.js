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
let rect  = new Sanim.RectObject(100, 100, 200, 400, true);
scene.addObject(rect);
rect.props.fillStyle = "lightgreen";
scene.render();
//Rendering the scene
rect.rotate(Math.PI/4);
//applying 90 degrees rotation.
scene.render();

const animation = new Sanim.Animation(scene);

animation.sleep(1000);
//Adding 1000 mili seconds delay
animation.execute(function(){rect.rotate(scene.radian(45))});
//We rotate the rect object 45 degrees
animation.sleep(1000);//1000 mili seconds delay
animation.execute(function(){rect.rotate(scene.radian(45))});
//Rotating the rect object by 45 degrees again
animation.sleep(1000);//1000 mili seconds delay
scene.play();

//creating another rectangle
let rect2  = new Sanim.RectObject(100, 100, 200, 100, true);
//adding the new object to scene
scene.addObject(rect2);

//create the camera object
const cam = new Sanim.Camera();
//Add the camera to the scene.
scene.setCamera(cam);
//Zoom into the canvas.
cam.scaleZoom(2);
//This will scale the size of objects in the canvas by 2.