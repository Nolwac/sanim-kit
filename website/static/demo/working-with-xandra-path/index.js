const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";
scene.play();// playing animations created on the scene
const pen = new Sanim.Xandra(scene, 100, 300);//instantiating the object
// setting the properties of the pen
pen.props={
    strokeStyle:"crimson",
    lineWidth:2
}
pen.forward(200);//moves 200px forward
pen.left(scene.radian(90));//turn left by 90 degrees
pen.forward(200);
pen.left(scene.radian(90));
pen.forward(200);
pen.left(scene.radian(90));
pen.forward(200);