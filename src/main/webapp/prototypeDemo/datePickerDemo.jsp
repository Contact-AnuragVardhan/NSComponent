<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Date Picker Demo</title>
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
			
		}
	</style>
	
	<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
	<link href="../lib/css/com/org/nsCalendar.css" rel="stylesheet">
	<link href="../lib/css/com/org/nsDatePicker.css" rel="stylesheet">
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script src="../lib/com/org/util/nsDateUtil.js"></script>
	<script src="../lib/com/org/util/nsSVG.js"></script>
	<script src="../lib/com/org/prototype/base/nsContainerBase.js"></script>
	<!--  <script src="/JSLib/generated/js/nsDatePicker.min.js"></script> -->
	<script src="../lib/com/org/prototype/nsCalendar.js"></script>
	<script src="../lib/com/org/prototype/nsDatePicker.js"></script>
 </head>
 
<body onload="initialize()">
	<div class="container">
		<div style="display: inline-block;width:33%;">
			<p> Basic Date Picker</p>
			<div id="divSimple">
			</div>
			<div id="divSimpleSelectedDate" style="height:30px;">
			</div>
		</div>
		<div style="display: inline-block;width:33%;">
			<p>Date Picker with Min Max date</p>
			<div id="divMinMax">
			</div>
			<div id="divMinMaxSelectedDate" style="height:30px;">
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
			<p>Date Picker with Disabled Textbox</p>
			<div id="divDisabledTextBox">
			</div>
			<div id="divDisabledTextBoxSelectedDate" style="height:30px;">
			</div>
		</div>
		<div style="display: inline-block;width:33%;">
			<p>Date Picker with Custom Button</p>
			<div id="divCustomButton">
			</div>
			<div id="divCustomButtonSelectedDate" style="height:30px;">
			</div>
		</div>
		<div style="display: inline-block;width:33%;">
			<p>Date Picker With Footer</p>
			<div id="divFooterCal">
			</div>
			<div id="divFooterCalSelectedDate" style="height:30px;">
			</div>
		</div>
	</div>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<br/>
	<div class="container">
		<div style="display: inline-block;width:33%;">
			<p>Date Picker With Footer and Timezone</p>
			<div id="divFooterTimezoneCal">
			</div>
			<div id="divFooterCalTimezoneSelectedDate" style="height:30px;">
			</div>
		</div>
		<div id="divWithTime" style="display: none;width:33%;">
			<p>Date Picker With Time</p>
			<div id="divTime">
			</div>
			<div id="divTimeSelectedDate" style="height:30px;">
			</div>
		</div>
		<div style="display: inline-block;">
			<button id="btnWithTimeVisibility" onClick="toggleVisibilityWithTime()">Show Date Picker With Time</button>
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
			initailizeDisabledTextBox();
			initailizeCustomButton();
			initailizeFooterCal();
			initailizeFooterTimezoneCal();
			initailizeSimpleCalWithTime();
		}
		
		function initailizeSimpleCal()
		{
			var divSimple = document.querySelector("#divSimple");
			var nsDatePicker = new NSDatePicker(divSimple);
			util.addEvent(divSimple,NSDatePicker.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divSimpleCalSelectedDate = document.querySelector("#divSimpleSelectedDate");
						divSimpleCalSelectedDate.innerHTML = event.detail;
					});
		}
		
		function initailizeMinMaxCal()
		{
			var divMinMax = document.querySelector("#divMinMax");
			var minDate = "02/10/2007";
			var maxDate = "11/10/2020";
			var inputDateFormat = "MM/dd/yyyy";
			var setting = {inputDateFormat:inputDateFormat,minDate:minDate,maxDate:maxDate,selectedDate:new Date()};
			var nsDatePicker = new NSDatePicker(divMinMax,setting);
			util.addEvent(divMinMax,NSDatePicker.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divMinMaxSelectedDate = document.querySelector("#divMinMaxSelectedDate");
						divMinMaxSelectedDate.innerHTML = event.detail;
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
			var nsDatePicker = new NSDatePicker(divCalDisabled,setting);
			util.addEvent(divCalDisabled,NSDatePicker.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divMinMaxSelectedDate = document.querySelector("#divMinMaxSelectedDate");
						divCalDisabledSelectedDate.innerHTML = event.detail;
					});
		}
		
		function initailizeDisabledTextBox()
		{
			var divDisabledTextBox = document.querySelector("#divDisabledTextBox");
			var setting = {enableTextBoxDisabled:true};
			var nsDatePicker = new NSDatePicker(divDisabledTextBox,setting);
			util.addEvent(divDisabledTextBox,NSDatePicker.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divDisabledTextBoxSelectedDate = document.querySelector("#divDisabledTextBoxSelectedDate");
						divDisabledTextBoxSelectedDate.innerHTML = event.detail;
					});
		}
		
		function initailizeCustomButton()
		{
			var divCustomButton = document.querySelector("#divCustomButton");
			var setting = {buttonHtml:"<i class='glyphicon glyphicon-calendar'></i>",placeHolder:"yyyy-mm-dd",dateOutputFormat:"yyyy-MM-dd"};
			var nsDatePicker = new NSDatePicker(divCustomButton,setting);
			util.addEvent(divCustomButton,NSDatePicker.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divCustomButtonSelectedDate = document.querySelector("#divCustomButtonSelectedDate");
						divCustomButtonSelectedDate.innerHTML = event.detail;
					});
		}
		
		function initailizeFooterCal()
		{
			var divFooterCal = document.querySelector("#divFooterCal");
			var divFooter = document.createElement("div");
			util.addStyleClass(divFooter,"calFooter");
			var span = document.createElement("span");
			util.addStyleClass(span,"btn-group pull-left");
			var btnToday = document.createElement("button");
			util.addStyleClass(btnToday,"btn btn-sm btn-info");
			btnToday.onclick = function(){
				nsDatePicker.setTodayDate();
				setTimeout(() => {
					nsDatePicker.closeCalendar();
				},500);
			};
			/*btnToday.addEventListener("click",function(){
				nsDatePicker.setTodayDate();
			});*/
			btnToday.innerHTML = "Today";
			span.appendChild(btnToday);
			var btnClear = document.createElement("button");
			util.addStyleClass(btnClear,"btn btn-sm btn-danger");
			btnClear.addEventListener("click",function(){
				nsDatePicker.reset();
			});
			btnClear.innerHTML = "Clear";
			span.appendChild(btnClear);
			var btnClose = document.createElement("button");
			util.addStyleClass(btnClose,"btn btn-sm btn-success pull-right");
			btnClose.addEventListener("click",function(){
				nsDatePicker.closeCalendar();
			});
			btnClose.innerHTML = "Close";
			divFooter.appendChild(span);
			divFooter.appendChild(btnClose);
			var setting = {showFooter:true,footerContent:divFooter};
			var nsDatePicker = new NSDatePicker(divFooterCal,setting);
			util.addEvent(divFooterCal,NSDatePicker.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divFooterCalSelectedDate = document.querySelector("#divFooterCalSelectedDate");
						divFooterCalSelectedDate.innerHTML = event.detail;
					});
		}
		
		function initailizeSimpleCalWithTime()
		{
			var divFooterCal = document.querySelector("#divFooterCal");
			var divFooter = document.createElement("div");
			util.addStyleClass(divFooter,"calFooter");
			var span = document.createElement("span");
			util.addStyleClass(span,"btn-group pull-left");
			var btnToday = document.createElement("button");
			util.addStyleClass(btnToday,"btn btn-sm btn-info");
			btnToday.onclick = function(){
				nsDatePicker.setTodayDate();
				nsDatePicker.closeCalendar();
			};
			/*btnToday.addEventListener("click",function(){
				nsDatePicker.setTodayDate();
			});*/
			btnToday.innerHTML = "Today";
			span.appendChild(btnToday);
			var btnClear = document.createElement("button");
			util.addStyleClass(btnClear,"btn btn-sm btn-danger");
			btnClear.addEventListener("click",function(){
				nsDatePicker.reset();
				//nsDatePicker.closeCalendar();
			});
			btnClear.innerHTML = "Clear";
			span.appendChild(btnClear);
			var btnClose = document.createElement("button");
			util.addStyleClass(btnClose,"btn btn-sm btn-success pull-right");
			btnClose.addEventListener("click",function(){
				nsDatePicker.closeCalendar();
			});
			btnClose.innerHTML = "Close";
			divFooter.appendChild(span);
			divFooter.appendChild(btnClose);
			
			
			var divTime = document.querySelector("#divTime");
			var timeSetting = {showSeconds: false,}
			//dateOutputFormat: "MM/dd/yyyy HH:mm",
			var setting = {showTime:true, timeSetting: timeSetting, showFooter:true,footerContent:divFooter,isAbsolutePosition: true};
			var nsDatePicker = new NSDatePicker(divTime,setting);
			util.addEvent(divSimple,NSDatePicker.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divTimeSelectedDate = document.querySelector("#divTimeSelectedDate");
						divTimeSelectedDate.innerHTML = event.detail;
					});
		}
		
		function toggleVisibilityWithTime() {
			var divWithTime = document.getElementById("divWithTime");
			var isShown = (divWithTime.style.display === "inline-block");
			var startingText = "";
			if(isShown) {
				divWithTime.style.display = "none";
				startingText = "Show";
			}
			else {
				divWithTime.style.display = "inline-block";
				startingText = "Hide";
			}
			var btnWithTimeVisibility = document.getElementById("btnWithTimeVisibility");
			btnWithTimeVisibility.innerHTML = startingText + " Date Picker With Time";
		}
		
		var arrTimezone = [
            { name: "(GMT -12:00) Eniwetok, Kwajalein", value: "-12:00"},
            { name: "(GMT -11:00) Midway Island, Samoa", value: "-11:00"},
            { name: "(GMT -10:00) Hawaii", value: "-10:00"},
            { name: "(GMT -9:30) Taiohae", value: "-09:50"},
            { name: "(GMT -9:00) Alaska", value: "-09:00"},
            { name: "(GMT -8:00) Pacific Time (US &amp; Canada)", value: "-08:00"},
            { name: "(GMT -7:00) Mountain Time (US &amp; Canada)", value: "-07:00"},
            { name: "(GMT -6:00) Central Time (US &amp; Canada), Mexico City", value: "-06:00"},
            { name: "(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima", value: "-05:00"},
            { name: "(GMT -4:30) Caracas", value: "-04:50"},
            { name: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz", value: "-04:00"},
            { name: "(GMT -3:30) Newfoundland", value: "-03:50"},
            { name: "(GMT -3:00) Brazil, Buenos Aires, Georgetown", value: "-03:00"},
            { name: "(GMT -2:00) Mid-Atlantic", value: "-02:00"},
            { name: "(GMT -1:00) Azores, Cape Verde Islands", value: "-01:00", selected:true},
            { name: "(GMT) Western Europe Time, London, Lisbon, Casablanca", value: "+00:00"},
            { name: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris", value: "+01:00"},
            { name: "(GMT +2:00) Kaliningrad, South Africa", value: "+02:00"},
            { name: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg", value: "+03:00"},
            { name: "(GMT +3:30) Tehran", value: "+03:50"},
            { name: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi", value: "+04:00"},
            { name: "(GMT +4:30) Kabul", value: "+04:50"},
            { name: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent", value: "+05:00"},
            { name: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi", value: "+05:50"},
            { name: "(GMT +5:45) Kathmandu, Pokhara", value: "+05:75"},
            { name: "(GMT +6:00) Almaty, Dhaka, Colombo", value: "+06:00"},
            { name: "(GMT +6:30) Yangon, Mandalay", value: "+06:50"},
            { name: "(GMT +7:00) Bangkok, Hanoi, Jakarta", value: "+07:00"},
            { name: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong", value: "+08:00"},
            { name: "(GMT +8:45) Eucla", value: "+08:75"},
            { name: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk", value: "+09:00"},
            { name: "(GMT +9:30) Adelaide, Darwin", value: "+09:50"},
            { name: "(GMT +10:00) Eastern Australia, Guam, Vladivostok", value: "+10:00"},
            { name: "(GMT +10:30) Lord Howe Island", value: "+10:50"},
            { name: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia", value: "+11:00"},
            { name: "(GMT +11:30) Norfolk Island", value: "+11:50"},
            { name: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka", value: "+12:00"},
            { name: "(GMT +12:45) Chatham Islands", value: "+12:75"},
            { name: "(GMT +13:00) Apia, Nukualofa", value: "+13:00"},
            { name: "(GMT +14:00) Line Islands, Tokelau", value: "+14:00"}
        ];
	
		function initailizeFooterTimezoneCal()
		{
			var divFooterTimezoneCal = document.querySelector("#divFooterTimezoneCal");
			var divFooter = document.createElement("div");
			util.addStyleClass(divFooter,"calFooter");
			var span = document.createElement("span");
			util.addStyleClass(span,"btn-group pull-left");
			var btnToday = document.createElement("button");
			util.addStyleClass(btnToday,"btn btn-sm btn-info");
			btnToday.onclick = function(){
				nsDatePicker.setTodayDate();
				setTimeout(() => {
					nsDatePicker.closeCalendar();
				},500);
			};
			/*btnToday.addEventListener("click",function(){
				nsDatePicker.setTodayDate();
			});*/
			btnToday.innerHTML = "Today";
			span.appendChild(btnToday);
			var btnClear = document.createElement("button");
			util.addStyleClass(btnClear,"btn btn-sm btn-danger");
			btnClear.addEventListener("click",function(){
				nsDatePicker.reset();
			});
			btnClear.innerHTML = "Clear";
			span.appendChild(btnClear);
			var select = document.createElement("select");
			for (var count = 0; count < arrTimezone.length; count++) 
			{
			    var option = document.createElement("option");
			    option.text = arrTimezone[count].name;
			    option.value = arrTimezone[count].value;
			    select.appendChild(option);
			}
			span.appendChild(select);
			var btnClose = document.createElement("button");
			util.addStyleClass(btnClose,"btn btn-sm btn-success pull-right");
			btnClose.addEventListener("click",function(){
				nsDatePicker.closeCalendar();
			});
			btnClose.innerHTML = "Close";
			divFooter.appendChild(span);
			divFooter.appendChild(btnClose);
			var setting = {showFooter:true,footerContent:divFooter,calendarWidth:300};
			var nsDatePicker = new NSDatePicker(divFooterTimezoneCal,setting);
			util.addEvent(divFooterTimezoneCal,NSDatePicker.DATE_SELECTED,function(event)
					{
						console.log(event.detail);
						var divFooterCalTimezoneSelectedDate = document.querySelector("#divFooterCalTimezoneSelectedDate");
						divFooterCalTimezoneSelectedDate.innerHTML = event.detail;
					});
		}
	</script>
</body>