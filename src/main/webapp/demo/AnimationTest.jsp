<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<script src="../lib/com/org/util/nsUtil.js"></script>
 <script>
 

function increaseSize() 
{
	  var util = new NSUtil();
	  var animation = new util.animation(document.getElementById("box"),[
	    {
	      time: 1,
	      style:"width",
	      target: 300,
	      animationCompleteHandler:callbackSize
	    }, 
	    {
	      time: 1,
	      style:"height",
	      target: 300,
	      animationCompleteHandler:callbackSize
	    }
	  ]);
	  animation.animate();
}

function decreaseSize() 
{
	  var util = new NSUtil();
	  var animation = new util.animation(document.getElementById("box"),[
	    {
	      time: 1,
	      style:"width",
	      target: 100,
	    }, 
	    {
	      time: 1,
	      style:"height",
	      target: 100,
	    }
	  ]);
	  animation.animate();
}

function callbackSize(item)
{
	console.log("item.style::" + item.style);
}

function increaseScroll() 
{
	  var util = new NSUtil();
	  var animation = new util.animation(document.getElementById("divContent"),[
	    {
	      time: 1,
	      property:"scrollTop",
	      target: 300,
	      animationCompleteHandler:callbackSize
	    }, 
	    {
	      time: 1,
	      property:"scrollLeft",
	      target: 100,
	      animationCompleteHandler:callbackSize
	    }
	  ]);
	  animation.animate();
}

function decreaseScroll() 
{
	  var util = new NSUtil();
	  var animation = new util.animation(document.getElementById("divContent"),[
	    {
	      time: 1,
	      property:"scrollTop",
	      target: 0,
	    }, 
	    {
	      time: 1,
	      property:"scrollLeft",
	      target: 0,
	    }
	  ]);
	  animation.animate();
}



    </script>
</head>
<body>
	 <input type="button" onclick="increaseSize();" value="Increase Size">
	 <input type="button" onclick="decreaseSize();" value="Decrease Size">

    <div id="box" style="background:#f88; width:100px; height:100px"></div>
	<br/><br/>
    <input type="button" onclick="increaseScroll();" value="Increase Scroll">
	 <input type="button" onclick="decreaseScroll();" value="Decrease Scroll">
    <div id="divContent" style="width:200px;height:200px;overflow:auto">
		<div id="divContentBody" style="width:600px;">
           <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet mollitia vero quam, nisi possimus dolorem asperiores, molestiae sit voluptatibus alias consequuntur laudantium repellat ea quidem quaerat rerum perspiciatis iste adipisci.</p>
           <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda earum facilis sed nihil numquam at accusamus eum error eaque alias hic sint rem consequatur impedit tempore, dolor, quos, quae esse?</p>
           <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore maiores maxime corrupti quisquam. Dignissimos sunt error voluptatibus repellat consequatur illo, aliquid nihil maxime veniam repudiandae, provident et sit, reiciendis dicta.</p>
           <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae id amet deserunt voluptate maiores sunt aut eligendi totam nesciunt magnam illo consectetur aspernatur at voluptatem, qui unde ullam omnis voluptates.</p>
           <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id assumenda et fugiat placeat enim quas, voluptas odio aperiam in quibusdam beatae eaque minima. Consequuntur pariatur, doloremque, odit dolorem ullam sunt!</p>
		</div>
	</div>
</body>
</html>