let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

let rect = new Sanim.RectObject(100, 50, 50, 50, true); //creating a rectangle
scene.addObject(rect);//adding the created rectangle

let anim = new Sanim.Animation(scene);//creating animation object
scene.play();//starting animation loop

function rotate(){
    rect.rotate(scene.radian(45));//rotates the rect object by 45 degrees
}
anim.execute(rotate);//scheduling the rotation

anim.sleep(2000); //sleeps the animation scheduler for 2 second.
anim.execute(function(){rect.x+=200});//adds 200px to the x position of rect.

let rotator = {
    delay: 100,//the time interval
    loop: function(){// function to be looped
        rect.rotate(scene.radian(10));//10 degrees rotation
        if(rect.rotationAngle >= scene.radian(320)){ //checking if 320 degrees angle of rotation has been completed
            this.status = false;//ends the loop
        }
    }
}
let interval = anim.setInterval(rotator, 100);//will execute the loop method of the rotator object every 100 milliseconds until the angle of rotation reaches 320 degrees.

let task = new Sanim.Task({
    status: true,
    obj: rect,//assigning obj as the rect
    execute: function (){
         this.obj.height+=100;//adding 100px to height of the rect
         this.status = false;
    },
    animationStatus: function(){
        return status;
    }
});
anim.sleep(1000);//1 sec delay
anim.schedule(task);//scheduling the task