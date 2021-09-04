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
