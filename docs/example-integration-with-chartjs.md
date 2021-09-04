---
id: example-integration-with-chartjs
title: Integrating DOM elements in the scene
sidebar_label: Example integration with ChartJS
---


# Integrating ChartJS
ChartJS is a statistical chart library in Javascript, it is quite easy to use and also lightweight. This is an example on how to use ChartJS with Sanim-Kit. The steps illustrated in this example can as well be followed to integrate other canvas 2D and 3D drawing libraries with Sanim-Kit.

The first thing to do is to create the HTML file for the project. In the HTML file, we link to the ChartJS library code, *chart.min.js*. We will also link to Sanim-Kit's *sanim.js* file, which is the library code. Finally we will have to link to our own custom Javascript file where we want to write our Javascript code at the bottom.
Note: *the choice of which library to place at the top before the other, is left to the developer. Also if you are using NodeJS and its package managers with some module bundlers, you might not want to link to any library file but instead install the libraries and import them from you custom Javascript file.*

### *index.html*

```html

<!DOCTYPE html>
<html>
<head>
	<title>Integration with ChartJS</title>
	<meta charset="utf-8">
	<script type="text/javascript" src="sanim.js"></script>
	<script type="text/javascript" src="chart.min.js"></script>
	<style type="text/css">
		body{
			margin:0px;
			padding:0px;
			overflow: hidden;
		}
	</style>
</head>
<body>
	<div><canvas id="canvas"></canvas></div>
	<div id="chart-holder">
		<!-- wrapping the chart canvas inside a div which will be extended to an integration object
		The reason for this is to make the chart responsive -->
		<canvas id="chart"></canvas>
	</div>
	<script type="text/javascript" src="index.js"></script>
</body>
</html>
```
In the Javascript file, we do all the initial setups required by Sanim-Kit. Then what we would want to do is to make *chart-holder* HTML element a pseudo SanimObject using the *Sanim.Integration* constructor. You can checkout how the constructor is used also the methods and properties that come with the object. The purpose of this is so that we can use Sanim-Kit to control ChartJS drawing canvas, we can perform scaling, rotation, pushing, translate and do some other cool stuffs to the canvas once it is made an Integration object. As you will soon see, one will barely notice that the chart is not a core part of the functionalities of Sanim-Kit. By this way you can make your application robust and flexible. You can use as may graphics drawing libraries (be it canvas, svg or direct DOM) together at once with this feature and still have some interactivity between them and Sanim-Kit.

As can be seen in the HTML code, the drawing canvas for ChartJS was wrapped in *chart-holder* HTML element, this is to make the chart response when it is drawn as illustrated by ChartJS in their documentation. You can bypass the wrapper on your own and make the chart canvas the Integration object directly to see the difference. Once that is done we write our ChartJS chart program, and we are good to go.

### *index.js*

```js

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
const scene = new Sanim.Scene(context);//creating scene
//making it take entire dimension of the screen
scene.context.canvas.height = window.innerHeight;
scene.context.canvas.width = window.innerWidth;
scene.color = "black";//setting the color to black

// getting the chart canvas wrapper
const chartElem = document.getElementById("chart-holder");

//creating the integration object for the chart canvas wrapper
let chartObj = new Sanim.Integration(chartElem, 100, 100, 300, 300);
scene.addObject(chartObj);//adding the object to the scene

//---------------- ChartJS --------------------------
let chartContext = document.getElementById("chart").getContext('2d');
// creating the ChartJS chart on the chart canvas
const chart = new Chart(chartContext, {
    type: 'line',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

scene.play();//playing the scene animation frame


```
### Result:
<iframe src="/demo/example-integration-with-chartjs/index.html" id="demo-frame-1" style="width:100%; height: 300px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-1').contentDocument.location.reload(true);">Reload</button>

Let's try to scale and move the chart for you to have a feel of what can be done with this. Add the below Javascript code snippet to the already existing one.


```js

let anim = new Sanim.Animation(scene);//creating animation object
function animate(){
    chartObj.height = chartObj.height*1.2; 
    chartObj.width = chartObj.width*1.2;
    chartObj.x = chartObj.x+10;
    chartObj.y = chartObj.y+30;
}

function reverse(){
    chartObj.height = chartObj.height/1.2; 
    chartObj.width = chartObj.width/1.2;
    chartObj.x = chartObj.x-10;
    chartObj.y = chartObj.y-30;
}

anim.execute(function(){chartObj.x = 0; chartObj.y = 50;});
anim.sleep(2000);// 2 seconds delay

const n = 10;
const delay = 100;
for(let i=0; i<n; i++){
    anim.execute(animate);// repeating n times
    anim.sleep(delay);// delay
}

anim.sleep(2000);// 2 seconds delay

for(let i=0; i<n; i++){
    anim.execute(reverse);// repeating n times
    anim.sleep(delay);// delay
}
```
### Result:
<iframe src="/demo/example-integration-with-chartjs/animate-chart.html" id="demo-frame-2" style="width:100%; height: 500px; background-color: black;"></iframe><br/>
<button onclick="document.getElementById('demo-frame-2').contentDocument.location.reload(true);">Reload</button>

And that is how you can use ChartJS and any other Javascript drawing library with Sanim-Kit.