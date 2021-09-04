let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let obj = new Sanim.PathObject(200, 200, [{pathMethod:'arc', params:[0, 0, 200, 0, (Math.PI/180)*90, false]}], true, true);
obj.props = {// styling the object
    lineWidth: 3,
    strokeStyle: "orange",
    fillStyle: "crimson"
}
scene.addObject(obj);//adding the created object to scene.
scene.play();//playing the scene animation frame

let newPath = {pathMethod:'lineTo', params:[300, 300]};//new path to be appended
obj.appendPath(newPath);//appending the new path using the appendPath method