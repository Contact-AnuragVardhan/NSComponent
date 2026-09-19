<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Panel Demo</title>
	<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
	<style>
		body,html
		{
			margin:0px;
			padding:0px;
			height:100%;
			background:#FFFFFF;
		}
		.panel
		{
			width: 400px;
		    height: 500px;
			background: white;
		   	padding: 0px 0px 0px 0px;
		    -webkit-border-radius: 4px;
		    -moz-border-radius: 4px;
		    -ms-border-radius: 4px;
		    -o-border-radius: 4px;
		    border-radius: 4px;
		    border-width: 5px;
		    border-style: solid;
		    border-color: #157fcc;
		    background-color: white;
		}
		.panelTitleBar {
		    padding: 5px 2px 5px 5px;
		    background-color: #157fcc;
		    font-size: 12px;
		    text-align: left;
		    color: #ffffff;
		    font-weight: bold;
		    height: 8%;
		    min-height: 20px;
		    max-height: 20px;
		}
		.panelTitleBarContent{
			color: #fefefe;
		    font-weight: bold;
		    font-size: large;
		}
		.container 
		{
	      	background-color: blue;
		}
        .elem{
            background-color: green;
            -webkit-user-select: none;
            -moz-user-select: none;
            -o-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;     
            user-select: none;
        }
	</style>
	<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
	<link href="../lib/css/com/org/nsPanel.css" rel="stylesheet">
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
	<link href="http://fontawesome.io/3.2.1/assets/font-awesome/css/font-awesome.css" rel="stylesheet">
	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script src="../lib/com/org/util/nsSVG.js"></script>
	<script src="../lib/com/org/prototype/base/nsContainerBase.js"></script>
	<script src="../lib/com/org/prototype/nsPanel.js"></script>
 </head>
<body onload="onLoad()">
	<select id="cmbAnimate">
	</select>
	<button onclick="openModal()">Open</button>
	<script>
		var arrAnimation = [{label:"zoom",value:"zoom"},
		                    {label:"top",value:"Top"},
		                    {label:"bottom",value:"Bottom"},
		                    {label:"left",value:"Left"},
		                    {label:"right",value:"right"},
		                    {label:"flip X",value:"flipX"},
		                    {label:"flip Y",value:"flipY"},
		                    {label:"roll",value:"roll"},
		                    {label:"bounce",value:"bounce"},
		                    {label:"rotate",value:"rotate"},
						];
		var nsDemo = null; 
		function onLoad()
		{
			var select = document.getElementById('cmbAnimate');
			for (var i = 0; i< arrAnimation.length; i++)
			{
				var item = arrAnimation[i];
			    var opt = document.createElement('option');
			    opt.value = item.value;
			    opt.innerHTML = item.label;
			    select.appendChild(opt);
			}
		}
		function openModal()
		{
			var select = document.getElementById('cmbAnimate');
			var util = new NSUtil();
			var toolBarDetails = {
					minimize:{iconHTML:null,title:"Minimize"},
					maximize:{iconHTML:null,title:"Maximize"},
					expand:{iconHTML:null,title:"Expand"},
					collapse:{iconHTML:null,title:"Collapse"},
					fullScreen:{iconHTML:"<i class='icon-fullscreen icon-1' style='pointer-events: none;'></i>",title:"Click here for Full Screen"},
					restore:{iconHTML:"<i class='fa fa-window-restore fa-1'></i>",title:"Click here to Restore"},
					close:{iconHTML:null,title:"Close"}
			};
			var setting = {title:"Modal Demo",minWidth:300,minHeight:300,enableModal:true,enableModalAnimation:true,
							enableDrag:true,enableResize:true,
					  		customClass:{container:null,titleBar:"panelTitleBar",titleBarContent:"panelTitleBarContent",iconConatiner:null,icon:null,body:null},
					  		templateUrl:"../demo/demoTemplate.jsp",toolBarDetails:toolBarDetails};
			nsDemo = new NSPanel(null,setting);
			var divDemo = nsDemo.getBaseElement();
			divDemo.style.width = "400px";
			divDemo.style.height = "400px";
			divDemo.setAttribute("class","panel");
			util.addEvent(divDemo,NSPanel.DRAG_STARTING,dragStartingHandler);
			util.addEvent(divDemo,NSPanel.DRAGGING,draggingHandler);
			util.addEvent(divDemo,NSPanel.DRAG_END,dragEndHandler);
			util.addEvent(divDemo,NSPanel.RESIZE_STARTING,resizeStartingHandler);
			util.addEvent(divDemo,NSPanel.RESIZING,resizingHandler);
			util.addEvent(divDemo,NSPanel.RESIZE_END,resizeEndHandler);
			util.addEvent(divDemo,NSPanel.MINIMIZE_STARTING,minimizeStartingHandler);
			util.addEvent(divDemo,NSPanel.MINIMIZE_END,minimizeEndHandler);
			util.addEvent(divDemo,NSPanel.MAXIMIZE_STARTING,maximizeStartingHandler);
			util.addEvent(divDemo,NSPanel.MAXIMIZE_END,maximizeEndHandler);
			nsDemo.open(select.options[select.selectedIndex].value);
		}
		
		function templateLoadHandler(content)
		{
			console.log(content);
		}
		
		function dragStartingHandler(event)
		{
			console.log("Drag Starting");
		}
		
		function draggingHandler(event)
		{
			console.log("Dragging at point:: x=" + event.detail.x + ",y=" + event.detail.y);
		}
		
		function dragEndHandler(event)
		{
			console.log("Drag Ended");
		}
		
		function resizeStartingHandler(event)
		{
			console.log("Resize Starting");
		}
		
		function resizingHandler(event)
		{
			console.log("Resizing with measurement:: width=" + event.detail.width + ",height=" + event.detail.height);
		}
		
		function resizeEndHandler(event)
		{
			console.log("Resize Ended");
		}
		
		function minimizeStartingHandler(event)
		{
			console.log("Minimize Starting");
		}
		
		function minimizeEndHandler(event)
		{
			console.log("Minimize Ended");
		}
		
		function maximizeStartingHandler(event)
		{
			console.log("Maximize Starting");
		}
		
		function maximizeEndHandler(event)
		{
			console.log("Maximize Ended");
		}
	</script>
</body>