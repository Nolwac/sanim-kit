window.onload = function(){
	var canvas = document.getElementById('chart_canvas')
	var ctx = canvas.getContext('2d');
	//var body = document.getElementById('sanimkit');

	var c = document.getElementById('canvas').getContext('2d');
	ctx.canvas.width = 200;
	ctx.canvas.height = 200;
	var scene = new Scene(c);
	scene.color = 'orange';
	scene.isParentWorld = true;
	window.scene = scene;
	var obj1 = new ButtonObject(0,0, 50, 50, true);
	var plr = new Player(obj1);
	var obj2 = new RectObject(500, 30, 200, 140, true);
	var text = new TextObject('Hello Sweetest Heart', 0, 100, true);
	var audio = new AudioObject('media/transformers.mp3');
	var intg = new Integration(ctx.canvas, 500, 400, 200, 200);
	var obj3 = new RectObject(500, 400, 200, 200, true);
	var obj4 = new PathObject(200, 200, [{pathType:'lineTo', params:[400, 200]}, {pathType:'arc', params:[200, 200, 200, 0, (Math.PI/180)*90, false]}], true, true);
	//text.maxWidth = 50;
	text.props.font = "bold 40px arial";
	text.props.fillStyle = 'green';
	text.fillBox = true;
	text.boxProps.paddingX = 20;
	text.boxProps.paddingY = 20;
	text.boxProps.fillStyle = 'pink';
	obj4.props.fillStyle = 'blue';
	scene.addObject(obj2);
	scene.addObject(obj1);
	scene.addObject(text);
	scene.addObject(intg);
	scene.addObject(obj3);
	scene.addObject(obj4);
	//var hist = new Histogram([100, 300, 500, 700, 800, 400, 100], obj2);
	
	var camera = new Camera();
	camera.setProperties(0,0,0,1);
	scene.setCamera(camera);//this sets the scene of the camera to the new camera that we just created;
	plr.minOffsetX = 50;
	plr.minOffsetY = 70;
	scene.setPlayer(plr);//setting the player in the scene
	var mov = new Animation(scene);
	var mov2 = new Animation(scene);
	obj1.props.fillStyle = 'white';
	obj2.props.fillStyle = 'white';
	obj1.props.shadowColor = 'black';
	obj1.props.shadowOffsetY = 5;
	obj1.props.strokeStyle = 'green';
	obj1.props.shadowOffsetX = 5;
	obj1.props.shadowBlur = 20;
	obj1.props.lineCap = "r";
	//transformations apply here
	// obj1.rotate(45);
	// obj1.translate(100,100);
	// obj1.scale(4,2);
	//obj1.skew(45, -45);
	//obj1.translate(100, 0);
	//obj1.transform([0.7071, -0.7071, 0.7071, 0.7071, 0, 0]);
	//obj1.transform([0.7071, -0.7071, 0.7071, 0.7071, 0, 0]);
	//text.rotate(90);
	//text.translate(20, 20);
	//transformation ends her
	scene.render();
	window.txt = text.textMeasurement
	obj1.addEvent('click', function(e){
		var objt = e.canvasTargetObject;
		objt.x +=200;
		// audio.media.play();
		// scene.requestFullscreen();
	});
	text.addEvent('mousemove', function(e){
		var objt = e.canvasTargetObject;
		text.props.fillStyle = 'red';
		//scene.render();
	});
	obj4.addEvent('mousemove', function(e){
		var objt = e.canvasTargetObject;
		text.props.fillStyle = 'red';
		console.log('just reached');
		//scene.render();
	});
	function scaleObject(obj, amount){
		var obj = new AnimationInstance({
			world:obj.world,
			obj:obj,
			scaled:0,
			amount:amount,
			execute:function(){
				this.scaled += 2;
				this.obj.width +=2;
				this.obj.height +=2;
			},
			animationStatus: function(){
				if(this.scaled >= this.amount){
					return false;
				}else{
					return true;
				}
			}
		});
		return obj;
	}

	var scaleObjects2 = new AnimationInstance({
		world:obj2.world,
		obj:obj2,
		scaled:0,
		amount:400,
		execute:function(){
			this.scaled += 2;
			this.obj.width +=2;
			this.obj.height +=2;
		},
		animationStatus: function(){
			if(this.scaled >= this.amount){
				return false;
			}else{
				return true;
			}
		}
	});
	//scene.playAnimation = false;
	mov.asynchronous = false;//preventing asychronous animation
	mov2.asynchronous = false;
	obj1.move(mov.linear, 'RIGHT', 100, mov.AEF.quadraticFast, 200);
	mov.sleep(10000);
	obj1.move(mov.linear, 'DOWN', 100, mov.AEF.quadraticFast, 200);
	// intg.move(mov.linear, 'DOWN', 100, mov.AEF.quadraticFast, 200);
	// var down2 = obj2.move(mov.linear, 'DOWN', 100, mov.AEF.quadraticFast, 500);
	// down2.repeat({length:200, speed:500, direction:'UP'});
	// mov.addAnimationInstance(scaleObject(obj1, 200));
	// mov.addAnimationInstance(scaleObjects2);
	// mov.addAnimationInstance(scaleObject(obj1, 100));
	// scaleObjects2.repeat({scaled:0, amount:300});

	// obj2.move(mov2.linear, 'LEFT', 100, mov2.AEF.quadraticFast, 500);
	// obj1.move(mov2.linear, 'DOWN', 100, mov2.AEF.quadraticFast, 200);
	// console.log(mov.animationInstances, 'is the await animation by mov');
	// console.log(mov2.animationInstances, 'is the asynchronous animation by mov2');


	var myChart = new Chart(ctx, {
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
}