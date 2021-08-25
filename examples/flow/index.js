
var colors = ['purple', 'green', 'orange', 'crimson', 'white', 'pink', 'blue'];
function findMaxNI(numbersArray){
  //this function finds the maximum number in a n*m array of numbers and also the m with the maximum length
  var maxValue = 0 //array to hold the maximum numbers
  var maxLength = 0;
  for(var i=0; i<numbersArray.length; i++){
    var max = Math.max(...numbersArray[i]);//maximum number in the current array
    if(maxLength < numbersArray[i].length){//checking if the length of the current array is greatere than the max length
      maxLength = numbersArray[i].length;//assigning the max length to be the length of the array
    }
    if(maxValue < max){
      maxValue = max;
    }

  }
  return {maxLength:maxLength, maxValue:maxValue};
}


function FlowAnim(numbersArray, x, y, span, scene){
  this.numbersArray = numbersArray;
  this.animationBox = new Sanim.RectObject(x, y, span, span);
  scene.addObject(this.animationBox);//addding the box to the scene
  this.flowing = false;
  this.anim = new Sanim.Animation(scene);
  this.delay = 100;//for applying delay to the simulation
  this.anim.asynchronous = false;//removing the asynchronous action

  this.flowRight = function(numbers){
    /*
    this method takes an array and flows the items in the array towards to the right
    */
    var firstNumber = numbers [0];
    for(var i=0; i<numbers.length; i++){
      i = i%numbers.length;
      if(i != 0){
        numbers[i-1] = numbers[i];
        numbers [i] = firstNumber;
      }
    }
  }
  this.flowLeft = function(numbers){
    /*
    This method takes and array and flows the items in the array towards to the left
    */
    var lastNumber = numbers [numbers.length-1];
    for(var i=numbers.length-1; i>=0; i--){
      i = i%numbers.length;
      if(i != numbers.length-1){
        numbers[i+1] = numbers[i];
        numbers[i] = lastNumber;
      }
    }
  }

  this.flowNumbers = function(right=true){
    /*
    This method flows the numbersArray property of the object by the numbers in each array and not by the arrays
    The boolean right specifies if it should flow towards to the right or not
    */
    for(var n=0; n<this.numbersArray.length; n++){
      if(right==true){
        this.flowRight(this.numbersArray[n]);
      }else{
        this.flowLeft(this.numbersArray[n]);
      }
    }
  }

  this.flow = function(right=true, numbers=false){
    /*
    right means that the flow is set to be towards to the right and numbers means that the flow is set to be by
    numbers in each array and not by arrays
    */
    if(numbers == true){
      this.flowNumbers(right);
    }else{
      if(right==true){
        this.flowRight(this.numbersArray);
      }else{
        this.flowLeft(this.numbersArray);
      }
    }
    this.visualize();//visualizing the flow
  }

  this.visualize = function(){
    //this method visualizes the current state of the animation on the canvas(scene)
    this.animationBox.flushChildren();
    var max = findMaxNI(this.numbersArray);
    var  maxValue = max.maxValue;//storing the maximum value in the collection
    var maxLength = max.maxLength;//storing the length of array in the collection
    var spacing = this.animationBox.width/(maxValue*(maxLength-1));
    for(var i=0; i<this.numbersArray.length; i++){
      for(var j=0; j<this.numbersArray[i].length; j++){
        var circle = new Sanim.CircleObject(j*spacing*maxValue, i*spacing*maxValue, this.numbersArray[i][j]*spacing/2, true);
        circle.props = {
          fillStyle:colors[[this.numbersArray[i][j]%colors.length]],
        }
        this.animationBox.addChild(circle);
      }
    }

  }
}


window.onload = function(){
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var scene = new Sanim.Scene(context);
  scene.color = "black";
  scene.isParentWorld = true;
  scene.context.canvas.width = window.innerWidth;
  scene.context.canvas.height = window.innerHeight;
  var anim = new Sanim.Animation(scene);
/* First flow instance */
  var flow = new FlowAnim([
    [1,2,3,4,5,6,7],
    [2,3,4,5,6,7,1],
    [3,4,5,6,7,1,2],
    [4,5,6,7,1,2,3],
    [5,6,7,1,2,3,4],
    [6,7,1,2,3,4,5],
    [7,1,2,3,4,5,6],
    ],100, 100, 200, scene);

/*second flow instance */
  var flow2 = new FlowAnim([
    [1,2,3,4,5,6,7],
    [1,2,3,4,5,6,7],
    [1,2,3,4,5,6,7],
    [1,2,3,4,5,6,7],
    [1,2,3,4,5,6,7],
    [1,2,3,4,5,6,7],
    [1,2,3,4,5,6,7],
    ],400, 100, 200, scene);
  flow2.flow(100);

/*third flow instance */
  var flow3 = new FlowAnim([
    [1,1,1,1,1,1,1],
    [1,2,2,2,2,2,1],
    [1,2,3,3,3,2,1],
    [1,2,3,4,3,2,1],
    [1,2,3,3,3,2,1],
    [1,2,2,2,2,2,1],
    [1,1,1,1,1,1,1],
    ],100, 400, 200, scene);

/*fourth flow instance */
  var flow4 = new FlowAnim([
    [1,2,3,4,3,2,1],
    [2,3,4,5,4,3,2],
    [3,4,5,6,5,4,3],
    [4,5,6,7,6,5,4],
    [3,4,5,6,5,4,3],
    [2,3,4,5,4,3,2],
    [1,2,3,4,3,2,1],
    ],400, 400, 200, scene);

  anim.setInterval({
    loop:function(){
      flow.flow(false, false);
      flow4.flowNumbers(false);

      flow3.flow(true, false);
      flow2.flow(false, true);
    }
  });
  setInterval(function(){flow4.flow(false, false);}, 100);

  scene.play();
}
