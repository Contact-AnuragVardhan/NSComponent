<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Calendar Demo</title>
	<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
	<style>
		body,html
		{
			margin:0px;
			padding:0px;
			height:100%;
			background:#FFFFFF;
		}
		.container
		{
			width:100%;
			height:40%;
			flex: 1 1 auto;
    		padding-left: 25px;
    		padding-top: 50px;
		}
		.calFooter
		{
			text-align: center;
		}
	</style>
	
	<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
	<link href="../lib/css/com/org/nsCalendar.css" rel="stylesheet">
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
	<link href="http://fontawesome.io/3.2.1/assets/font-awesome/css/font-awesome.css" rel="stylesheet">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script src="../lib/com/org/util/nsDateUtil.js"></script>
	<script src="../lib/com/org/util/nsSVG.js"></script>
	<script src="../lib/com/org/prototype/base/nsContainerBase.js"></script>
	<script src="../lib/com/org/prototype/nsCalendar.js"></script>
 </head>
 
<body onload="initialize()">
	<div class="container">
		<p> Parse Date to String</p>
		<div style="display: inline-block;width:33%;">
			<div id="divSimpleCal">
			</div>
		</div>
		<input id="txtFormat" type="text" placeholder="Enter Format">
		<button onclick="btnFormatHandler()">Format</button>
	</div>
	
	<div class="container">
		<p> Parse String to Date</p>
		<div style="display: inline-block;width:33%;">
			<input id="txtInputDate" type="text" placeholder="Enter Date">
		</div>
		<input id="txtFormatCal" type="text" placeholder="Enter Format">
		<button onclick="btnParseStringHandler()">Format</button>
	</div>
		
	
	
	<script>
		var util = null;
		function initialize()
		{
			util = new NSUtil();
			initailizeSimpleCal();
			
		}
		var nsCalendar = null;
		function initailizeSimpleCal()
		{
			var divSimpleCal = document.querySelector("#divSimpleCal");
			nsCalendar = new NSCalendar(divSimpleCal);
			util.addEvent(divSimpleCal,NSCalendar.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
					});
		}
		
		function btnFormatHandler()
		{
			var txtFormat = document.querySelector("#txtFormat");
			if(nsCalendar.getSelectedDate() && txtFormat.value.length > 0)
			{
				var nsDateUtil = new NSDateUtil();
				alert(nsDateUtil.format(nsCalendar.getSelectedDate(),txtFormat.value));
			}
		}
		
		function btnParseStringHandler()
		{
			var txtInputDate = document.querySelector("#txtInputDate");
			var txtFormat = document.querySelector("#txtFormatCal");
			if(txtInputDate.value.length > 0 && txtFormat.value.length > 0)
			{
				var nsDateUtil = new NSDateUtil();
				alert(nsDateUtil.parseString(txtInputDate.value,txtFormat.value));
			}
		}
		
		
		
	</script>
</body>