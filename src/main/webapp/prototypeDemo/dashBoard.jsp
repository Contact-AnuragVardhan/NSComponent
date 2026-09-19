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
			width: 400px !important;
		    height: 500px;
			background: white;
		   	padding: 0px 0px 0px 0px;
		    -webkit-border-radius: 4px;
		    -moz-border-radius: 4px;
		    -ms-border-radius: 4px;
		    -o-border-radius: 4px;
		    border-radius: 4px;
		    /*border: 5px solid #157fcc !important;*/
		    /*border-width: 5px;
		    border-style: solid;
		    border-color: #157fcc;*/
		    background-color: white;
		    padding-right: 0px !important; 
    		padding-left: 0px !important;
		}
		/*.panelTitleBar {
		    padding: 5px 2px 5px 5px;
		    background-color: #157fcc;
		    font-size: 12px;
		    text-align: left;
		    color: #ffffff;
		    font-weight: bold;
		    height: 8%;
		    min-height: 20px;
		    max-height: 20px;
		}*/
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
        .divTest
        {
        	list-style: none;
		    border: 1px solid #CCC;
		    background: #F6F6F6;
		    font-family: "Tahoma";
		    color: #1C94C4;
        }
        .divPanelTest
        {
        	height:400px;
        }
        [draggable] 
        {
		  -moz-user-select: none;
		  -khtml-user-select: none;
		  -webkit-user-select: none;
		  user-select: none;
		  /* Required to make elements draggable in old WebKit */
		  -khtml-user-drag: element;
		  -webkit-user-drag: element;
		}
		.drag
		{
			opacity:0.4;
		}
		
	</style>
	<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
	<link href="../lib/css/com/org/nsDashboard.css" rel="stylesheet">
	<link href="../lib/css/com/org/nsPanel.css" rel="stylesheet">
	<!--  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">-->
	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script src="../lib/com/org/util/nsSVG.js"></script>
	<script src="../lib/com/org/util/nsDragDrop.js"></script>
	<script src="../lib/com/org/prototype/base/nsContainerBase.js"></script>
	<script src="../lib/com/org/prototype/nsPanel.js"></script>
	<script src="../lib/com/org/util/nsDashboard.js"></script>
 </head>
<body onload="init();">
	<!--  <div class="container-fluid sortable">
	    <div class="col-sm-4 divTest">Item 1</div>
	    <div class="col-sm-4 divTest">Item 2</div>
	    <div class="col-sm-4 divTest">Item 3</div>
	    <div class="col-sm-4 divTest">Item 4</div>
	    <div class="col-sm-4 divTest">Item 5</div>
	    <div class="col-sm-4 divTest">Item 6</div>
	</div>-->
	
	<div id="divDashboard">
<!-- 	    <div id="div1" class="col-sm-1 divPanelTest"></div> -->
<!-- 	    <div id="div2" class="col-sm-1 divPanelTest"></div> -->
<!-- 	    <div id="div3" class="col-sm-1 divPanelTest"></div> -->
<!-- 	    <div id="div4" class="col-sm-1 divPanelTest"></div> -->
<!-- 	    <div id="div5" class="col-sm-1 divPanelTest"></div> -->
<!-- 	    <div id="div6" class="col-sm-1 divPanelTest"></div> -->
	</div>
	
	<!--  <div id="divDemo" style="width:400px;height:400px;" class="panel"></div>
	<br/>
	<div id="divDemo1" style="width:400px;height:400px;" class="panel"></div> -->
	<script>
		/*$(function() {
			$('.sortable').sortable();
		});*/
	</script>
	
	<script>
		function init()
		{
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
			var setting = {title:"Demo",titleHtml:"<i class='icon-move icon-1'></i>&nbsp;&nbsp;Demo",minWidth:300,minHeight:300,enablePopUp:false,enableModal:false,enableCollapse:true,enableMinimization:true,
						   enableFullScreen:true,enableDrag:false, 
			  			   enableResize:true,enableTitleDblClick:false,enableMoveOnClick:false,
			  			   customClass:{container:"panel",titleBar:"panelTitleBar",titleBarContent:"panelTitleBarContent",iconConatiner:null,icon:null,body:null},
					  	   templateUrl:"../demo/demoTemplate.jsp"};
			//,minimizeAddRemoveElementCallback:minimizeAddRemoveElement
			var panelCount = 6;
			var arrSetting = [];
			for(var count = 0;count < panelCount;count++)
			{
				arrSetting[count] = JSON.parse(JSON.stringify(setting));
				arrSetting[count]["title"] = "Demo" + (count + 1);
				arrSetting[count]["titleHtml"] = "<i class='icon-move icon-1'></i>&nbsp;&nbsp;Demo&nbsp;" + (count + 1);
			}
			var divDashboard = document.getElementById("divDashboard");
			var dashBoardSetting = {container:divDashboard,panelClass:"divPanelTest",panelDragClass:"drag",panelHoverClass:"over",panelCount:panelCount,panelPerRow:3,arrPanelSetting:arrSetting};
			var nsDashboard = new NSDashboard(dashBoardSetting);
			var arrPanels =  nsDashboard.getAllPanel();
			for(var count = 0;count < arrPanels.length;count++)
			{
				var nsPanel = arrPanels[count];
				util.addEvent(nsPanel.getBaseElement(),NSDashboard.PANEL_DRAG_START,panelEventHandler);
				util.addEvent(nsPanel.getBaseElement(),NSDashboard.PANEL_DRAG_ENTER,panelEventHandler);
				util.addEvent(nsPanel.getBaseElement(),NSDashboard.PANEL_DRAG_OVER,panelEventHandler);
				util.addEvent(nsPanel.getBaseElement(),NSDashboard.PANEL_DRAG_LEAVE,panelEventHandler);
				util.addEvent(nsPanel.getBaseElement(),NSDashboard.PANEL_DROP,panelEventHandler);
				util.addEvent(nsPanel.getBaseElement(),NSDashboard.PANEL_DRAG_END,panelEventHandler);
			}
		
		}
		function panelEventHandler(event)
		{
			console.log("Event is " + event.type + " and element is " + event.detail.element.id);
		}
		
	</script>
</body>
