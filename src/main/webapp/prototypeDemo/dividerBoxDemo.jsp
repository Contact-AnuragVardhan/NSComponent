<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
<script src="../lib/com/org/util/nsUtil.js"></script>
<script src="../lib/com/org/prototype/base/nsContainerBase.js"></script>
<script src="../lib/com/org/prototype/nsDividerBox.js"></script>

<title>Divider Box demo</title>
 <style>
 	body,html
	{
		margin:0px;
		padding:0px;
		height:100%;
		background:#FFFFFF;
	}
	.ui-resizable-e {
	    cursor: ew-resize;
	    width: 20px;
	    right: -5px;
	    top: 0;
	    height: 100%;
	}
	.ui-resizable-handle {
	    position: absolute;
	    font-size: 0.1px;
	    z-index: 99999;
	    display: block;
	}
	
 </style>
</head>
<body onload="initialize()">
	 <div id="divVertical" style="height:100%;width:100%" class="verticalContainer">
	 	<div style="width:10%;overflow-y:scroll;" afterOffset="-5">
	 		<div id="top-vertical-content" style="width:1500px;">
				This is Left
			</div>
	 	</div>
		<div id="top-vertical-content3" style="width:90%;">
			This is Right
		</div>
	</div>
	<script>
		function initialize()
		{
			var divVertical = document.querySelector("#divVertical");
			var setting = {direction:"vertical"};
			var dividerBox = new NSDividerBox(divVertical,setting);
			
		}
	</script>
</body>
</html>