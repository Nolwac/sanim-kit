let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let image = new Sanim.ImageObject("/demo/image-object/sanim_logo.png", 100, 100, 300, 300);//creating the image
image.props = {
    lineWidth:5,
    strokeStyle:"crimson",
}//defining the properties of the image. drawing a line around the image
scene.addObject(image);//adding the created image to scene.
scene.play();//playing the scene animation frame