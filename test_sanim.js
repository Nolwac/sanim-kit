window.onload = function(){
	var c = document.getElementById('canvas').getContext('2d');
	var scene = new Scene(c);
	var obj1 = new ButtonObject(0,0, 50, 50, true);
	var plr = new Player(obj1);
	var obj2 = new RectObject(500, 30, 200, 100, true);
	scene.addObject(obj2);
	scene.addObject(obj1);
	var hist = new Histogram([100, 300, 500, 700, 800, 400, 100], obj2);
	console.log('I am here now');
	//hist.render();
	
	var camera = new Camera();
	camera.setProperties(0,0,0,1);
	scene.setCamera(camera);//this sets the scene of the camera to the new camera that we just created;
	plr.minOffsetX = 50;
	plr.minOffsetY = 70;
	scene.setPlayer(plr);//setting the player in the scene
	var mov = new Animation(scene);
	obj1.props.fillStyle = 'white';
	obj2.props.fillStyle = 'white';
	obj1.props.shadowColor = 'black';
	obj1.props.shadowOffsetY = 5;
	obj1.props.strokeStyle = 'green';
	obj1.props.shadowOffsetX = 5;
	obj1.props.shadowBlur = 20;
	obj1.props.lineCap = "r";
	//obj1.props.scale(5,5);
	scene.render();
	// obj1.addEvent('mousemove', function(e){
	// 	scene.render();
	// 	e.target.style.cursor = 'pointer';
	// });
	obj1.addEvent('click', function(e){
		var objt = e.canvasTargetObject;
		objt.x +=200;
		scene.render();
	});
	obj2.addEvent('click', function(e){
		var objt = e.canvasTargetObject;
		objt.height +=200;
		scene.render();
	});
	obj1.move(mov.linear, 'RIGHT', 100, mov.AEF.quadraticFast, 200);
	mov.executeFunction(function(){
		obj2.y += 2;
	});
}