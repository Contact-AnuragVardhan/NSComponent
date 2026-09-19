<!DOCTYPE html>
<html>
<head>
  <title>TablePicker Demo</title>
 
  <link href="/JSLib/lib/css/com/org/nsComponent.css" rel="stylesheet">
  <link href="/JSLib/lib/css/com/org/nsTablePicker.css" rel="stylesheet">
  
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
   .block
   {
   		display: inline-block;
   		width:33%;
   }
   .table
   {
  	  borderCollapse:separate;
   }
  </style>
</head>
<body onload="initialize()">
	<div class="container">
		<div class="block">
			<p>Static Table</p>
			<div id="divStaticTable">
			</div>
		</div>
		<div class="block">
			<p>Static Table with Black Theme</p>
			<div id="divStaticTableBlack">
			</div>
		</div>
		<div class="block">
			<p>Static Table with Custom Class(Table style with borderCollapse as separate)</p>
			<div id="divStaticTableCustomClass">
			</div>
		</div>
	</div>
	<div class="container">
		<div class="block">
			<p>Table as PopUp</p>
			<button id="btnPopUp">Click To Open</button>
		</div>
		<div class="block">
			<p>Table as PopUp with smaller cells</p>
			<button id="btnPopUpSmallerCells">Click To Open</button>
		</div>
		<div class="block">
			<p>Calendar with Disabled Date (date less than today is disabled)</p>
			
		</div>
	</div>
	
	
	

<script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
<script src="/JSLib/lib/com/org/util/nsTablePicker.js"></script>
<script>

function initialize()
{
	handleStaticPicker();
	handleStaticPickerTheme();
	handleStaticPickerCustomClass();
	handleDynamicPicker();
	handleDynamicPickerWithSmallerCells();
}

function handleStaticPicker() 
{
	var element = document.getElementById("divStaticTable");
	var setting = {element: element};
	var tablePicker = new NSTablePicker(setting);
}

function handleStaticPickerTheme() 
{
	var element = document.getElementById("divStaticTableBlack");
	var setting = {element: element,theme:"Black"};
	var tablePicker = new NSTablePicker(setting);
}

function handleStaticPickerCustomClass() 
{
	var element = document.getElementById("divStaticTableCustomClass");
	var customClass={table: "table"};
	var setting = {element: element,customClass: customClass};
	var tablePicker = new NSTablePicker(setting);
}

function handleDynamicPicker()
{
	var btnPopUp = document.getElementById("btnPopUp");
	var setting = {isPopUp: true,trigger: btnPopUp};
	var tablePicker = new NSTablePicker(setting);
}

function handleDynamicPickerWithSmallerCells()
{
	var btnPopUpSmallerCells = document.getElementById("btnPopUpSmallerCells");
	var setting = {isPopUp: true,trigger: btnPopUpSmallerCells, width: 145, height:130,cellWidth: 12,cellHeight: 11, rowCount: 12,columnCount: 12 };
	var tablePicker = new NSTablePicker(setting);
}


</script>

</body>
</html>