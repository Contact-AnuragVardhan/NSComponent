<!DOCTYPE html>
<html lang="en">
<head>
  <title>Touch Event to Mouse Event Demo</title>
  <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
  <meta name="viewport" content="initial-scale=1.0,maximum-scale=1.0,height=device-height,width=device-width,user-scalable = no">
  
</head>
<body onload="initialize()">
	<span id="compTouch" style="width:10px;height:10px; "></span>
	<br/>
	<span id="compPoint" style="width:10px;height:10px; "></span>
	<div id="divTouch" style="width:100%;height:calc(100vh - 200px);background: blue;min-height:250px;" onmousedown="mouseDown()" onmouseup="mouseUp()" onclick="clickHandler()"></div>
	<br/><br/>
	<button onclick="destroy()">Destroy!</button>
	
	<script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
	<script src="/JSLib/lib/com/org/util/nsTouchToMouse.js"></script>
	
	<script>
	var touchToMouse = null;
	function initialize() 
	{
		var divTouch = document.getElementById("divTouch");
		var compPoint = document.getElementById("compPoint");
		var compTouch = document.getElementById("compTouch");
		var setting = {suppressMouseEvent: false,touchStartHandler:function(xPos,yPos,event){
				compPoint.innerHTML = "Touch Start " + xPos + ':' + yPos;
			},
			touchStartHandler:function(xPos,yPos,event){
				compPoint.innerHTML = "Touch Start " + xPos + ':' + yPos;
			},
			touchMoveHandler:function(xPos,yPos,event){
				compPoint.innerHTML = "Touch Move " + xPos + ':' + yPos;
			},
			touchEndHandler:function(xPos,yPos,event){
				compPoint.innerHTML = "Touch End " + xPos + ':' + yPos;
			},
			doubleTapHandler:function(xPos,yPos,event){
				compPoint.innerHTML = "Double Tap " + xPos + ':' + yPos;
			},
			pinchHandler:function(scale,event){
				compPoint.innerHTML = "Pinched " + scale;
			},
		};
		touchToMouse = new NSTouchToMouse(divTouch,setting);
		if(!touchToMouse.isTouchSupported())
		{
			compTouch.innerHTML = "Touch is not supported.";
		}
		if(!touchToMouse.isGestureSupported())
		{
			compTouch.innerHTML += "<br/>Gesture is not supported";
		}
	};
	
	function destroy()
	{
		if(touchToMouse)
		{
			var compPoint = document.getElementById("compPoint");
			touchToMouse.destroy();
			touchToMouse = null;
			compPoint.innerHTML = "";
		}
	}
	
	function mouseDown() 
	{
		var compPoint = document.getElementById("compPoint");
		compPoint.innerHTML += "<br/>Mouse Down handler Fired";
	}
	
	function mouseUp() 
	{
		var compPoint = document.getElementById("compPoint");
		compPoint.innerHTML += "<br/>Mouse Up handler Fired";
	}
	
	function clickHandler() 
	{
		var compPoint = document.getElementById("compPoint");
		compPoint.innerHTML += "<br/>Click handler Fired";
		var divTouch = document.getElementById("divTouch");
		divTouch.style.background = "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")";
	}
	
	</script>

</body>
</html>