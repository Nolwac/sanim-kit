/* This is a complete new program and is not tied to the rest of the programs that have been written*/

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";
scene.play();// playing animations created on the scene
const pen = new Sanim.Xandra(scene, 300, 400);//instantiating the object
// setting the properties of the pen
pen.props={
    strokeStyle:"crimson",
    lineWidth:2
}

const func = new Sanim.Function({
  xScale:40,
  yScale:-20,
  x:-4,
  y:0,
  delay:200,
  type:"line",
  size:2,
  compute: function(){
    this.y = Math.pow(this.x, 2);//quadratic function y = x^2
  },
  constraint: function(){
    return this.x <= 4.002;//x ranging from -4 to 4
  },
  increment: function(){
    this.x+=0.2;//x to be incremented by 0.2
  }
});

const grapher = pen.graph(func);//drawing the defined quadratic function
pen.penUp();//raising the pen so it does not start drawing the function from the current position
grapher.start();//This will start drawing the function