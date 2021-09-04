let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let rect = new Sanim.RectObject(300, 450, 50, 50, true); //creating a rectangle
scene.addObject(rect);//adding the created rectangle
scene.play();//playing the scene animation frame

rect.props.lineWidth = 10;//giving the stroke line a width of 10px
rect.props.strokeStyle = "crimson";//giving it the stroke color of crimson

rect.addEvent("click", function(e){
    e.canvasTargetObject.props.fillStyle = "orange";
}, function(e){
    e.canvasTargetObject.props.fillStyle = "crimson";
});//changes the background color to orange when object is clicked on and to crimson when the click is not on the object.

let childRect = new Sanim.RectObject(10, 10, 20, 20, true);
rect.addChild(childRect);//adding the childRect 
childRect.props = {
    lineWidth: 5,
    strokeStyle: "skyblue",
    fillStyle: "green"
}

let anim = new Sanim.Animation(scene);//creating animation object to be used
rect.fadeOut(anim, 3000);//fades out the object in 3 seconds.

rect.fadeIn(anim, 1000);//fades in within a second.

let func = new Sanim.Function ({
      xScale:25,
      yScale:-25,
      x:-4,
      y:0,
      delay:30,
      compute: function(){
        this.y = Math.pow(this.x, 2);
      },
      constraint: function(){
        return this.x <= 4.002;
      },
      increment: function(){
        this.x+=0.05;
      }
});//defining the Function object

let path = rect.motionPath(func);//creates an instance to move the object through a path on the scene.
path.start();//starting the motion