<!DOCTYPE html>
<html lang="en">
<head>
  <title>Carousel Demo</title>
  
  <style>
    html, body 
    {
      height: 100%;
    }
    body {
      background: #eee;
      font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
      font-size: 14px;
      color:#000;
      margin: 0;
      padding: 0;
    }
	.container
	{
		margin-right: auto;
		margin-left: auto;
		padding: 1rem;
		height: 30%;
	}
	.header
	{
		font-size: 1.5rem;
		margin-top: 1rem;
	    margin-bottom: 1rem;
	    color: rgba(0,0,0,.9);
	    font-weight: 200;
	}
	
	.containerCon
	{
		width:100%;
		height: calc(100% - 30px);
	}
	
	.conDemo1Container
	{
		box-sizing: content-box;
	    justify-content: center;
	    align-items: center;
	    text-align: center;
	    font-size: 18px;
	    background: #333;
	}
	
	.conDemo1ContainerUl
	{
		margin:10px;
		padding:0px;
	}
	
	.conDemo1Slide
	{
		width:100%;
		height: 100%;
		line-height: 200px;
	}
	
	.page
	{
		width: 20px;
	    height: 20px;
	    text-align: center;
	    line-height: 20px;
	    font-size: 12px;
	    color: #000;
	    opacity: 1;
	    background: rgba(0,0,0,0.2);
	    cursor: pointer;
	    border-radius: 100%;
	}
	
	.pageActive
	{
		color: #fff;
    	background: #007aff;
	}
	
	.nav
	{
		position: absolute;
		width: 20px;
    	height: 100%;
    	cursor: pointer;
    	z-index: 20;
    	background: rgba(0,0,0,0.2) center center no-repeat;
		text-indent: -9999px;
    	overflow: hidden;
    	top:0px;
	}
	
	.prev
	{
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAeCAYAAADOziUSAAAAvElEQVR42q3WIQ7CYBCEUVQNwdSAQSG4So+A5Sok2BqC5QJcgwRVUUOo4AgkeEiWGbECmoruzibfqD9PNp2YmSxOpBKdUIP2qIhiS3S339tFMEIP69/VsSzEOzqWhVo0cywD3dDc38ogJoOYDGIyiMkgJoOYDHKsQN0A9EKLsV+NDfoMgIcxmAzkyECODOTIQI4M5MhAjgzkZMG6hyXBrWMK8OJYBHz/Yecoxir0RLwOrTIYm6K1/xo4JusLObFSWPLLngMAAAAASUVORK5CYII=);
	}
	
	.next
	{
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAeCAYAAADOziUSAAAAu0lEQVR42q3WMQrCUBCE4RRpRNLYWNgKOVCu4BFsBat4CkuvIOQENpLCCwhiYesFXGcgRWBJkd158A+85mvfK8xMFoeV6IDu6ILWGWyPxueJtlGsM3/eBCPYCVkM9NgC3bLg+LJCfQbkyECODOTIQI4M5MhAjgzkaMABmwN+JsAXWs7B2gnoh3aokEFMBjEZxGQQk0FMBjER5LFjDPJYE4c8do1DHjvHIY9t0GOAvqjJvOisRDWqMn8NWX8f3VJqdiTqcAAAAABJRU5ErkJggg==);  
	}
  	
  

  
	
	
	</style>
  <link href="/JSLib/lib/css/com/org/nsCarousel.css" rel="stylesheet">
  <script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
  <script src="/JSLib/lib/com/org/util/nsCarousel.js"></script>
</head>
<body>

<div class="container">
	<h3 class="header">Carousel With Pagination and Navigation</h3>
	<div class="containerCon">
		<ul id="conDemo1" class="conDemo1ContainerUl">
			  <li><div class="conDemo1Slide" style="background: #E01B1B;">1</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #E0A21B;">2</div></li>
		      <li><div class="conDemo1Slide" style="background: #E0E01B;">3</div></li>
		      <li><div class="conDemo1Slide" style="background: #74E01B;">4</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE063;">5</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE0CC;">6</div></li>
		      <li><div class="conDemo1Slide" style="background: #1B91E0;">7</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #1B49E0;">8</div></li>
		      <li><div class="conDemo1Slide" style="background: #461BE0;">9</div></li>
		      <li><div class="conDemo1Slide" style="background: #871BE0;">10</div></li>
		      <li><div class="conDemo1Slide" style="background: #D01BE0;">11</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01BA2;">12</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01B46;">13</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #990;">14</div></li>
		      <li><div class="conDemo1Slide" style="background: #0f0;">15</div></li>
		</ul>
	</div>
</div>
<div class="container">
	<h3 class="header">Carousel With Multiple Slides</h3>
	<div class="containerCon">
		<ul id="conDemo2" class="conDemo1ContainerUl">
			  <li><div class="conDemo1Slide" style="background: #E01B1B;">1</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #E0A21B;">2</div></li>
		      <li><div class="conDemo1Slide" style="background: #E0E01B;">3</div></li>
		      <li><div class="conDemo1Slide" style="background: #74E01B;">4</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE063;">5</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE0CC;">6</div></li>
		      <li><div class="conDemo1Slide" style="background: #1B91E0;">7</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #1B49E0;">8</div></li>
		      <li><div class="conDemo1Slide" style="background: #461BE0;">9</div></li>
		      <li><div class="conDemo1Slide" style="background: #871BE0;">10</div></li>
		      <li><div class="conDemo1Slide" style="background: #D01BE0;">11</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01BA2;">12</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01B46;">13</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #990;">14</div></li>
		      <li><div class="conDemo1Slide" style="background: #0f0;">15</div></li>
		</ul>
	</div>
</div>
<div class="container">
	<h3 class="header">Carousel With Auto Slides</h3>
	<div class="containerCon">
		<ul id="conDemo3" class="conDemo1ContainerUl">
			  <li><div class="conDemo1Slide" style="background: #E01B1B;">1</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #E0A21B;">2</div></li>
		      <li><div class="conDemo1Slide" style="background: #E0E01B;">3</div></li>
		      <li><div class="conDemo1Slide" style="background: #74E01B;">4</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE063;">5</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE0CC;">6</div></li>
		      <li><div class="conDemo1Slide" style="background: #1B91E0;">7</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #1B49E0;">8</div></li>
		      <li><div class="conDemo1Slide" style="background: #461BE0;">9</div></li>
		      <li><div class="conDemo1Slide" style="background: #871BE0;">10</div></li>
		      <li><div class="conDemo1Slide" style="background: #D01BE0;">11</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01BA2;">12</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01B46;">13</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #990;">14</div></li>
		      <li><div class="conDemo1Slide" style="background: #0f0;">15</div></li>
		</ul>
	</div>
</div>

<div class="container">
	<h3 class="header">Vertical Carousel</h3>
	<div class="containerCon">
		<ul id="conDemo4" class="conDemo1ContainerUl">
			  <li><div class="conDemo1Slide" style="background: #E01B1B;">1</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #E0A21B;">2</div></li>
		      <li><div class="conDemo1Slide" style="background: #E0E01B;">3</div></li>
		      <li><div class="conDemo1Slide" style="background: #74E01B;">4</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE063;">5</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE0CC;">6</div></li>
		      <li><div class="conDemo1Slide" style="background: #1B91E0;">7</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #1B49E0;">8</div></li>
		      <li><div class="conDemo1Slide" style="background: #461BE0;">9</div></li>
		      <li><div class="conDemo1Slide" style="background: #871BE0;">10</div></li>
		      <li><div class="conDemo1Slide" style="background: #D01BE0;">11</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01BA2;">12</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01B46;">13</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #990;">14</div></li>
		      <li><div class="conDemo1Slide" style="background: #0f0;">15</div></li>
		</ul>
	</div>
</div>
<div class="container">
	<h3 class="header">Carousel With Custom Pagination</h3>
	<div class="containerCon">
		<ul id="conDemo5" class="conDemo1ContainerUl">
			  <li><div class="conDemo1Slide" style="background: #E01B1B;">1</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #E0A21B;">2</div></li>
		      <li><div class="conDemo1Slide" style="background: #E0E01B;">3</div></li>
		      <li><div class="conDemo1Slide" style="background: #74E01B;">4</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE063;">5</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE0CC;">6</div></li>
		      <li><div class="conDemo1Slide" style="background: #1B91E0;">7</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #1B49E0;">8</div></li>
		      <li><div class="conDemo1Slide" style="background: #461BE0;">9</div></li>
		      <li><div class="conDemo1Slide" style="background: #871BE0;">10</div></li>
		      <li><div class="conDemo1Slide" style="background: #D01BE0;">11</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01BA2;">12</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01B46;">13</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #990;">14</div></li>
		      <li><div class="conDemo1Slide" style="background: #0f0;">15</div></li>
		</ul>
	</div>
</div>
<div class="container">
	<h3 class="header">Carousel With Custom Navigation</h3>
	<div class="containerCon">
		<ul id="conDemo6" class="conDemo1ContainerUl">
			  <li><div class="conDemo1Slide" style="background: #E01B1B;">1</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #E0A21B;">2</div></li>
		      <li><div class="conDemo1Slide" style="background: #E0E01B;">3</div></li>
		      <li><div class="conDemo1Slide" style="background: #74E01B;">4</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE063;">5</div></li>
		      <li><div class="conDemo1Slide" style="background: #1BE0CC;">6</div></li>
		      <li><div class="conDemo1Slide" style="background: #1B91E0;">7</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #1B49E0;">8</div></li>
		      <li><div class="conDemo1Slide" style="background: #461BE0;">9</div></li>
		      <li><div class="conDemo1Slide" style="background: #871BE0;">10</div></li>
		      <li><div class="conDemo1Slide" style="background: #D01BE0;">11</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01BA2;">12</div></li>
		      <li><div class="conDemo1Slide" style="background: #E01B46;">13</div></li><!-- slide -->
		      <li><div class="conDemo1Slide" style="background: #990;">14</div></li>
		      <li><div class="conDemo1Slide" style="background: #0f0;">15</div></li>
		</ul>
	</div>
</div>
<br/>
<br/>
<script>
	function init()
	{
		var ul = document.getElementById("conDemo1");
		var customClass1 = {container: "conDemo1Container"};
		var setting1 = {element:ul,enable3DAnimation: true,enableDirectionNavigation: true,enablePageNavigation: true,customClass: customClass1};
		var carousel1 = new NSCarousel(setting1);
		
		ul = document.getElementById("conDemo2");
		var customClass2 = {container: "conDemo1Container"};
		var setting2 = {element:ul,visibleSlides: 3,spaceBetween: 30,enableDirectionNavigation: true,enablePageNavigation: true,customClass: customClass2};
		var carousel2 = new NSCarousel(setting2);
		
		ul = document.getElementById("conDemo3");
		var customClass3 = {container: "conDemo1Container"};
		var setting3 = {element:ul,visibleSlides: 3,spaceBetween: 30,enableAutoPlay: true,interval: 1500,customClass: customClass3};
		var carousel3 = new NSCarousel(setting3);
		
		ul = document.getElementById("conDemo4");
		var customClass4 = {container: "conDemo1Container"};
		var setting4 = {element:ul,enableVertical:true,enable3DAnimation:true, enableDirectionNavigation: true,enablePageNavigation: true,customClass: customClass4};
		var carousel4 = new NSCarousel(setting4);
		
		ul = document.getElementById("conDemo5");
		var customClass5 = {container: "conDemo1Container",pageActive:"pageActive"};
		var setting5 = {element:ul,enablePageNavigation: true,customClass: customClass5,pageRendererCallback:function(index){
			return '<span class="page">' + (index + 1) + '</span>';
		}};
		var carousel5 = new NSCarousel(setting5);
		
		ul = document.getElementById("conDemo6");
		var customClass6 = {container: "conDemo1Container"};
		var setting6 = {element:ul,enableDirectionNavigation: true,customClass: customClass6,previousRendererCallback:function(){
			return '<span class="nav prev"></span>';
		},nextRendererCallback:function(){
			return '<span class="nav next"></span>';
		}};
		var carousel6 = new NSCarousel(setting6);
	}
	
	init();
	

</script>

</body>
</html>