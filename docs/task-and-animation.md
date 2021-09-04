---
id: task-and-animation
title: Animation References
sidebar_label: Task and Animation
---


## Task and Animation(Task scheduler) objects

One of the prime purposes of Sanim kit is animation, so Sanim kit is equipped with methods that allow you perform wonderful animations under the **Animation** and **Task** objects.
Sanim kit animations are built on the concept that you have tasks and would want to schedule how this tasks are run and possibly repeat a task as it pleases you.

## Task Object
Since the idea of animation in Sanim kit is built on the ideology of having a *Task* and scheduling how the task should run, then there needs to be a way of creating this task. That is what the *Sanim.Task* constructor provides.
 To create the task we need to pass a an object which controls how the task will be executed to the *Sanim.Task* constructor. Below are the list of properties that should be included in the object to overwrite existing properties or methods.

## Animation Object
The Animation object allows schedules process and also add a delay if you wish.

This scheduled processes can either be set to happen asynchronously (at same time) or one after the other following the order in which they were scheduled.
To create the animation object, use the *Sanim.Animation()* constructor.

```js
import Sanim from "sanim-kit";

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
```

The constructor takes one parameter which must be a *Sanim.Scene* object.

## Animation object References
Here are the properties and methods accessible in the Animation object.

### Animation.world
This property holds the scene object the Animation object tied to.
The value is usually provided at the initialization of the object.

### Animation.tasks
This property holds the array of *Sanim.Task* objects that have been scheduled by the Animation object.

### Animation.animationOn
This property defines if the schedules under the animation object should run.
It holds a boolean value.
When *true* the tasks scheduled will run else the tasks will not run.
The default value is *true*.

### Animation.asynchronous
This property holds a boolean value that defines if the *Sanim.Task* objects scheduled should run asynchronously (together) or one after the other.

When *true* the tasks will run asynchronously else the task will run one after the other.
The default value is *false*.

### Animation.execute()
This method takes a function as parameter, creates a *Sanim.Task* object with the function and schedules the task.

Literally what it does is to schedule a function execution.

```js
function rotate(){
    rect.rotate(scene.radian(45));//rotates the rect object by 45 degrees
}
anim.execute(rotate);//scheduling the rotation
```

### Animation.sleep()
This method takes one parameter, which is the amount of time in milliseconds  the animation object(the scheduler) should sleep without executing anything. In the real sense, the animation object is not sleeping, because the sleep method creates a scheduled task of it's own.

```js
anim.sleep(2000); //sleeps the animation scheduler for 2 second.
anim.execute(function(){rect.x+=200});//adds 200px to the x position of rect.
```

The above code snippet will sleep the scheduler(the animation object, using scheduler seems more realistic) by 2000 milliseconds which is equivalent to 2 seconds. Then moves the *rect* object by 200px horizontally.

### Animation.setInterval()
This method schedules a function to be executed at a given interval of time.

It takes a parameter of an object that specifies the looping function to be scheduled for execution at an interval and and time interval.

```js
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

//This method call returns the task scheduled  for the interval.
```
Below is the result of what have been done so far.

### Result:
<iframe src="/demo/task-and-animation/index.html" id="demo-frame-1" style="width:100%; height: 200px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

### Animation.clearInterval()
This method clears an already scheduled interval.
It takes a parameter of the scheduled interval to clear.

```js
anim.clearInterval(interval);//clears the interval task.
```
The *Sanim.Task* provided has to be an interval task.


### Animation.schedule() 
this method schedules a *Sanim.Task* object so it takes one parameter which is the Task to be scheduled.

```js
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
```
### Result:
<iframe src="/demo/task-and-animation/schedule.html" id="demo-frame-2" style="width:100%; height: 220px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-2').contentDocument.location.reload(true);">Reload</button>

### Animation.animateTask()
This method sets a single scheduled task for animation.

It takes 1 parameter of the task object to animate.

## Task Object
Since the idea of animation in Sanim-kit is built on the ideology of having a *Task* and scheduling how the task should run, then there needs to be a way of creating this task. That is what the *Sanim.Task* constructor provides.
 To create the task we need to pass a an object which controls how the task will be executed to the *Sanim.Task* constructor.

```js
let task2 = new Sanim.Task({
    status: true,
    obj: rect,//assigning obj as the rect
    execute: function (){
         this.obj.width += 100;//adding 100px to width of the rect
         this.status = false;
    },
    animationStatus: function(){
        return status;
    }
});
anim.sleep(1000);//1 sec delay
anim.schedule(task2);//scheduling the task
```
### Task Constructor Parameter property options.

Below are the list of properties that should be included in the object to overwrite existing properties or methods.

  - *execute* method. This is the method of the object that defines the block of code to be executed.
  - *animationStatus* method. This is the method that defines when the desires animation for the task is done. It should always return a boolean. Returning *true* means that the animation for the given task is still in progress and returning false means that the animation for the task is done.

## Task Object References
Below are the properties and methods available in the *Sanim.Task* object.

### Task.obj
This property holds the object that defines the properties and method for task animation.
This property is usually passed as a parameter when calling the *Sanim.Task* object constructor.

### Task.ended
This property defines if the task has been scheduled or not.
It holds a boolean whose value is *true* when the Task has been scheduled and *false* when otherwise.

### Task.executeOnStartOnly()
This method defines code blocks that should be executed at the very start of the animation for a given task.

Hence if you wish to execute a code block at the start of a task's animation then overwrite this method to put your block of code.

### Task.onEnded()
This method defines code blocks that should be executed at the end of the animation for a given task.

Hence if you wish to execute a code block at the end of a task's animation, then overwrite this method to put your block of code.

### Task.reset()
This method resets the animation properties of  a *Sanim.Task* object.
It takes an *optional* object parameter specifying which properties of task that should be reset and the resetting values.

If this method is called it sets that the task have not finished running. Hence it may provide opportunity for the task to run longer or repeatedly when used the right way.

```js
task2.reset({status:true});//reset task2
```
The above line of code sets *status* property to be true since status defines if the task has been executed or not.

### Task.repeat()
This method repeats a task animation.
It takes an *optional* object parameter which defines properties to reset before attempting to repeat the task.

```js
task.repeat({status:true});//resets and repeats task
```




