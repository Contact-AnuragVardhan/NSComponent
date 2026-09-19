

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
		<div style="display: inline-block;width:33%;">
			<p> Basic Calendar</p>
			<div id="divSimpleCal">
			</div>
			<div id="divSimpleCalSelectedDate" style="height:30px;">
			</div>
		</div>
		<div style="display: inline-block;width:33%;">
			<p>Calendar with Min and Max date</p>
			<div id="divCalMinMax">
			</div>
			<div id="divCalMinMaxSelectedDate" style="height:30px;">
			</div>
		</div>
		<div style="display: inline-block;width:33%;">
			<p>Calendar with Disabled Date (date less than today is disabled)</p>
			<div id="divCalDisabled">
			</div>
			<div id="divCalDisabledSelectedDate" style="height:30px;">
			</div>
		</div>
	</div>
	<div class="container">
		<div style="display: inline-block;width:33%;">
			<p>Calendar With Footer</p>
			<div id="divFooterCal">
			</div>
			<div id="divFooterCalSelectedDate" style="height:30px;">
			</div>
		</div>
	</div>
	
	
	<script>
		var util = null;
		function initialize()
		{
			util = new NSUtil();
			initailizeSimpleCal();
			initailizeMinMaxCal();
			initailizeDisabledCal();
			initailizeFooterCal();
		}
		
		function initailizeSimpleCal()
		{
			var divSimpleCal = document.querySelector("#divSimpleCal");
			var nsCalendar = new NSCalendar(divSimpleCal);
			util.addEvent(divSimpleCal,NSCalendar.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divSimpleCalSelectedDate = document.querySelector("#divSimpleCalSelectedDate");
						divSimpleCalSelectedDate.innerHTML = event.detail;
					});
		}
		
		function initailizeMinMaxCal()
		{
			var divCalMinMax = document.querySelector("#divCalMinMax");
			var minDate = "02/10/2007";
			var maxDate = "11/10/2020";
			var inputDateFormat = "MM/dd/yyyy";
			var setting = {inputDateFormat:inputDateFormat,minDate:minDate,maxDate:maxDate,selectedDate:new Date()};
			var nsCalendar = new NSCalendar(divCalMinMax,setting);
			util.addEvent(divCalMinMax,NSCalendar.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divCalMinMaxSelectedDate = document.querySelector("#divCalMinMaxSelectedDate");
						divCalMinMaxSelectedDate.innerHTML = event.detail;
					});
		}
		
		function initailizeDisabledCal()
		{
			var divCalDisabled = document.querySelector("#divCalDisabled");
			var setting = {markDayDisabled:function(date){
				var todayDate = new Date();
				if(date < todayDate)
				{
					return false;
				}
				return true;
			}};
			var nsCalendar = new NSCalendar(divCalDisabled,setting);
			util.addEvent(divCalDisabled,NSCalendar.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divCalDisabledSelectedDate = document.querySelector("#divCalDisabledSelectedDate");
						divCalDisabledSelectedDate.innerHTML = event.detail;
					});
		}
		
		function initailizeFooterCal()
		{
			var divFooterCal = document.querySelector("#divFooterCal");
			var divFooter = document.createElement("div");
			util.addStyleClass(divFooter,"calFooter");
			var span = document.createElement("span");
			util.addStyleClass(span,"btn-group");
			var btnToday = document.createElement("button");
			util.addStyleClass(btnToday,"btn btn-sm btn-info");
			btnToday.addEventListener("click",function(){
				nsCalendar.setTodayDate();
			});
			btnToday.innerHTML = "Today";
			span.appendChild(btnToday);
			var btnClear = document.createElement("button");
			util.addStyleClass(btnClear,"btn btn-sm btn-danger");
			btnClear.addEventListener("click",function(){
				nsCalendar.reset();
			});
			btnClear.innerHTML = "Clear";
			span.appendChild(btnClear);
			divFooter.appendChild(span);
			var setting = {showFooter:true,footerContent:divFooter};
			var nsCalendar = new NSCalendar(divFooterCal,setting);
			util.addEvent(divFooterCal,NSCalendar.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divFooterCalSelectedDate = document.querySelector("#divFooterCalSelectedDate");
						divFooterCalSelectedDate.innerHTML = event.detail;
					});
		}
		
	</script>
</body>