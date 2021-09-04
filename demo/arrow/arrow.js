

window.onload = function(){
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var scene = new Sanim.Scene(context);
  scene.color = "black";
  scene.isParentWorld = true;
  var anim = new Sanim.Animation(scene);
  scene.context.canvas.width = window.innerWidth;
  scene.context.canvas.height = window.innerHeight;
  scene.render();
  //scene.playAnimation = false;
  var arrow = new Sanim.Xandra(scene,100, 400, anim);
  arrow.props={
    fillStyle:"crimson",
    strokeStyle:"orange",
    lineWidth:2
  }
  var textFont = {
    font:"20px bold",
    strokeStyle:"crimson",
    lineWidth:2
  }
  //arrow.fragments = 4;
  arrow.left(scene.radian(60));
  arrow.forward(200);
  arrow.right(scene.radian(60));
  arrow.backward(100);
  arrow.penUp();
  arrow.forward(100);
  arrow.penDown();
  arrow.forward(100);
  arrow.penUp();
  arrow.backward(100);
  arrow.penDown();
  arrow.left(scene.radian(30));
  arrow.backward(50);
  arrow.penUp();
  arrow.forward(50);
  arrow.right(scene.radian(120));
  arrow.penDown();
  arrow.forward(50);
  arrow.penUp();
  arrow.backward(50);
  arrow.left(scene.radian(150));
  arrow.backward(70);
  arrow.left(scene.radian(90))
  arrow.penDown();
  arrow.arc(70, scene.radian(60));
  var theta = new Sanim.TextObject("π=90", arrow.currentX-30, arrow.currentY+30);
  theta.props = textFont;
  arrow.addChild(theta);
  theta.hide();
  theta.fadeIn(anim, 1000);
  //theta.subscript()
  //arrow.fadeOut(anim, 1000);

}