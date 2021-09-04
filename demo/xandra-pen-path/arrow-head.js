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

pen.fragments = 4;//this will make the fragments for each path 4 + 1 = 5

pen.forward(200);//moves 200px forward
pen.left(scene.radian(90));//turn left by 90 degrees
pen.forward(200);
pen.left(scene.radian(90));
pen.forward(200);
pen.left(scene.radian(90));
pen.forward(200);

pen.interval = 100;//changing the interval of time
pen.penUp();// raising the pen so that every drawing that comes after does not show.
pen.right(scene.radian(90));// turning 90 degrees clockwise
pen.backward(300);// going backward by 300 pixels
pen.penDown();// dropping the tip of the pen so that any further drawing shows
pen.arc(150, scene.radian(120));// drawing an arc of radius 150 pixels which will subtend an angle of 120 degrees

pen.stampArrowHead();//stamping arrow head at the current location of the pen, with arrow pointing towards pen direcion.