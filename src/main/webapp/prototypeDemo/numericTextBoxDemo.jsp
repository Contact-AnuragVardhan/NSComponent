<html>
	<head>
		<style>
		.textBox
		{
			font-size: 14px;
		}
		.container-fluid {
		    padding-right: 15px;
		    padding-left: 15px;
		    margin-right: auto;
		    margin-left: auto;
		}
		.control-section {
			width: 100%;
			position: relative;
		    min-height: 1px;
		    padding-right: 15px;
		    padding-left: 15px;
		    padding-top: 20px;
		    padding-bottom: 20px;
		    min-height: 350px;
		}
		.content-wrapper {
			width: 35%;
			margin: 0 auto;
			min-width: 185px;
		}
		
		.e-float-input.e-numeric.e-input-group {
			margin-top: 40px;
		}
		
		.control-label {
			padding: 24px 0px 10px 0px;
			
		}
		</style>
		<link href="/JSLib/lib/css/com/org/nsNumericTextBox.css" rel="stylesheet">
	</head>
<body onload="initialize()">
	<div class="container-fluid">
		<div class="control-section">
			<div class="content-wrapper">
				<div class="control-label">Numeric TextBox (Initial Value set to 10)</div>
				<input id="txtNumeric" type="text" readonly>
				<div class="control-label">Integer TextBox</div>
				<input id="txtInteger" type="text">
				<div class="control-label">Hyphen Separator TextBox (hyphen after 4 numbers)</div>
				<input id="txtSeparator" type="text">
				<div class="control-label">Range TextBox (enter number between 0 and 1000)</div>
				<input id="txtRange" type="text">
				<div class="control-label">Percentage TextBox</div>
				<input id="txtPercent" type="text">
				<div class="control-label">USD TextBox</div>
				<input id="txtUSD" type="text">
				<div class="control-label">Euro TextBox</div>
				<input id="txtEuro" type="text">
				<div class="control-label">Yen TextBox</div>
				<input id="txtYen" type="text">
				<div class="control-label">Custom Format (Phone Number)</div>
				<input id="txtCustom" type="text">
			</div>
			<button onclick="setDisability()">Set Disability</button>
			<button onclick="setReadonly()">Set Readonly</button>
		</div>
	</div>
	<script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
	<script src="/JSLib/lib/com/org/util/nsNumericTextBox.js"></script>
	<script>
		function initialize()
		{
			var customClass= {outerContainer:"textBox"};
			
			var txtNumeric = document.querySelector("#txtNumeric");
			var numericSetting = {input:txtNumeric,decimals:3,enableThousand:false,value:10,customClass:customClass};
			var numericTextBox = new NSNumericTextBox(numericSetting);
			
			var txtInteger = document.querySelector("#txtInteger");
			var intSetting = {input:txtInteger,enableDecimals:false,customClass:customClass};
			var intTextBox = new NSNumericTextBox(intSetting);
			
			var txtSeparator = document.querySelector("#txtSeparator");
			var sepSetting = {input:txtSeparator,enableDecimals:false,thousandSeparator:"-",grouping:4,enableSpinner:false,customClass:customClass};
			var sepTextBox = new NSNumericTextBox(sepSetting);
			
			var txtRange = document.querySelector("#txtRange");
			var rangeSetting = {input:txtRange,enableDecimals:false,min:0,max:1000,customClass:customClass};
			var rangeTextBox = new NSNumericTextBox(rangeSetting);
			
			var txtPercent = document.querySelector("#txtPercent");
			var perSetting = {input:txtPercent,type:"per",decimals:2,customClass:customClass,step:0.01};
			var perTextBox = new NSNumericTextBox(perSetting);
			
			var txtUSD = document.querySelector("#txtUSD");
			var usdSetting = {input:txtUSD,type:"usd",decimals:2,customClass:customClass,min:0};
			var usdTextBox = new NSNumericTextBox(usdSetting);
			
			var txtEuro = document.querySelector("#txtEuro");
			var euroSetting = {input:txtEuro,type:"euro",decimals:2,customClass:customClass,min:0};
			var euroTextBox = new NSNumericTextBox(euroSetting);
			
			var txtYen = document.querySelector("#txtYen");
			var yenSetting = {input:txtYen,type:"yen",decimals:2,customClass:customClass,min:0};
			var yenTextBox = new NSNumericTextBox(yenSetting);
			
			var txtCustom = document.querySelector("#txtCustom");
			var customSetting = {input:txtCustom,type:"custom",format:"###-###-####",value:"20193"};
			var customTextBox = new NSNumericTextBox(customSetting);
		}
		
		function setDisability()
		{
			var txtNumeric = document.querySelector("#txtNumeric");
			txtNumeric.readOnly = false;
			txtNumeric.disabled = !txtNumeric.disabled;
		}
		
		function setReadonly()
		{
			var txtNumeric = document.querySelector("#txtNumeric");
			txtNumeric.disabled = false;
			txtNumeric.readOnly = !txtNumeric.readOnly;
		}
	</script>
</body>
</html>