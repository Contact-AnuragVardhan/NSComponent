<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Test</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link href="../lib/css/com/org/nsComponent.css" rel="stylesheet" media="all" />
  <link href="../lib/css/com/org/nsScroller.css" rel="stylesheet" media="all" />
  <style>
  	.content{
  		margin: 0;
    	padding: 10px;
    	min-width: 300px;
  	}
  	.moveAble {
	  	display:none;
	    position: absolute;
	    top:0px;
	    right:10px;
	    z-index: 1000;
	}

	.info {
	  background-color:red;
	  height: 100px;
	  width:100px;
	}
	</style>
</head>
<body>
	<div id="divContainer" style="width:500px;height:500px;">
		<div id="divBody" style="width:100%;height:100%;">
			<div id="divContent">
	            <h3>Vertical and horizontal scrollbar</h3>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <p class="content">Content in Scrollbar</p>
	            <div style="width:1000px;"><h3>End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great</h3></div>
	        </div>
	    </div>
	</div>
	<br/>
	<br/>
	<button type="button" onclick="addParagraph();">Add Paragraph</button>
	<button type="button" onclick="removeParagraph();">Remove Paragraph</button>
	
	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script src="../lib/com/org/util/nsScrollAnimator.js"></script>
  	<script src="../lib/com/org/util/nsScroller.js"></script>
	<script>
		var scroller = null;
		var assigned = false;
		
		function initialize()
		{
			var element = document.querySelector('#divBody');
			var setting = {element:element,verticalElement:element,horizontalElement:element,enableCustomHandler:false,verticalScrollButtons:{enable:true},horizontalScrollButtons:{enable:true},
							scrollHeight: element.scrollHeight,scrollWidth: element.scrollWidth,enableMoveOnClick:true,enableAnimation:true};
			var scroller2 = new NSScroller(setting);
			//element.addEventListener(NSScroller.SCROLLING,customScrollHandler);
		}
		
		function customScrollHandler(event)
		{
			var eventItem = event;
			var direction = eventItem.direction;
			var scrollPos = eventItem.newScrollPos;
			var oldScrollPos = eventItem.oldScrollPos;
			if(direction == "vertical")
			{
				document.querySelector('#divBody').scrollTop = scrollPos;
			}
			else
			{
				document.querySelector('#divBody').scrollLeft = scrollPos;
			}
			
		}
		
		function addParagraph()
		{
			var element = document.querySelector('#divContent');
			element.innerHTML += "<br/><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id assumenda et fugiat placeat enim quas, voluptas odio aperiam in quibusdam beatae eaque minima. Consequuntur pariatur, doloremque, odit dolorem ullam sunt!</p>";
		}
		
		function removeParagraph()
		{
			var element = document.querySelector('#divContent');
			var arrP = element.getElementsByTagName("p");
			var arrbr = element.getElementsByTagName("br");
			if(arrP.length > 0)
			{
				element.removeChild(arrP[arrP.length - 1]);	
			}
			if(arrbr.length > 0)
			{
				element.removeChild(arrbr[arrbr.length - 1]);	
			}
		}
		
		window.onload = initialize;
			
	</script>


</body>
</html>