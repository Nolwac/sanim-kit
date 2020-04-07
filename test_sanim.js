window.onload = function(){
	var c = document.getElementById('canvas').getContext('2d');
	var scene = new Scene(c);
	var obj1 = new rectObject(0,0, 50, 50, 'brown', 'green');
	var plr = new player(obj1);
	var obj2 = new rectObject(500, 30, 200, 100, 'white', 'white');
	scene.addObject(obj2);
	scene.addObject(obj1);
	var hist = new Histogram([100, 300, 500, 700, 800, 400, 100], obj1);
	console.log('I am here now');
	//hist.render();
	var camera = new Camera();
	camera.setProperties(0,0,0,1);
	scene.setCamera(camera);//this sets the scene of the camera to the new camera that we just created;
	plr.minOffsetX = 50;
	plr.minOffsetY = 70;
	scene.setPlayer(plr);//setting the player in the scene
	scene.render()
	// c.canvas.addEventListener('mousemove', function(e){
	// 	var x = e.clientX, y = e.clientY;
	// 	console.log(obj1.isInPath(x,y))
	// });
	obj1.addEvent('click', function(e){
		console.log('I have been clicked on');
		console.log(e.canvasTargetObject)
		var objt = e.canvasTargetObject;
		objt.x +=200;
		scene.render();
	});
	obj2.addEvent('click', function(e){
		console.log('obj2 have been clicked on');
		console.log(e.canvasTargetObject)
		var objt = e.canvasTargetObject;
		objt.height +=200;
		scene.render();
	});
	// function animation(){
	// 	window.requestAnimationFrame(animation);
	// 	obj1.x +=2;
	// 	obj1.y +=1;
	// 	obj2.width +=2;
	// 	obj2.height +=2;
	// 	obj1.color = 'brown';
	// 	scene.render();
	// 	c.canvas.addEventListener('mousemove', function(e){
	// 		var x = e.clientX, y = e.clientY;
	// 	});

	// }
	// animation();
}