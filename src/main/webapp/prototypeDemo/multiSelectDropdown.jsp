<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>MultiSelectDropdown Demo</title>
	<style>
			body,html
			{
				margin:0px;
				padding:0px;
				height:100%;
				background:#FFFFFF;
			}
			body {
			    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
			    font-size: 14px;
			    line-height: 1.42857143;
			    color: #333;
			    background-color: #fff;
			}
			
			.container {
	        	margin: auto;
	        	max-width: 600px;
	        	width: calc(100% - 40px);
	      	}
			
			.listCon 
			{
			  list-style-type: none;
			  padding: 0;
			  margin: 0;
			}
			
			.listCon li 
			{
			  border: 1px solid #ddd;
			  margin-top: -1px; /* Prevent double borders */
			  background-color: #f6f6f6;
			  padding: 3px;
			  text-decoration: none;
			  color: black;
			  display: block;
			  position: relative;
			}
			
			.listCon li:hover 
			{
			  background-color: #eee;
			}
			
			.listCon .text
			{
				width: calc(100% - 15px);
			    white-space: nowrap;
			    overflow: hidden;
			    text-overflow: ellipsis;
			}
			
			.listCon .close {
			  cursor: pointer;
			  position: absolute;
			  top: 50%;
			  right: 0%;
			  padding: 3px 16px;
			  transform: translate(0%, -50%);
			}

			.close:hover {background: #bbb;}
	</style>
	<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
	<link href="../lib/css/com/org/nsMultiSelectDropdown.css" rel="stylesheet">
</head>
<body>
	<div class="container">
		<h1>MultiSelect Dropdown</h1>
		<h3>Simple Usage with Multiple Select:</h3>
		<div id="divDemo" style="width:200px;">
		</div>
		<h3>Multiple Select with Virtual List:</h3>
		<div id="divDemoVirtual" style="width:200px;">
		</div>
		<h3>Multiple Select Label as Horizontal List:</h3>
		<div id="divDemoLabelHorizontalList" style="width:400px;">
		</div>
		<h3>Multiple Select Label as Vertical List:</h3>
		<div id="divDemoLabelVerticalList" style="width:200px;">
		</div>
		<h3>Multiple Select with max items:</h3>
		 <div>
			  <label for="cmbStates">Choose Max States to be selected: </label>
			  <select name="cmbStates" id="cmbStates">
			    <option value="1">1</option>
			    <option value="2">2</option>
			    <option value="3">3</option>
			    <option value="4">4</option>
			    <option value="5" selected>5</option>
			  </select>
			  <button type="button" onclick="labelMaxItems()">Submit</button>
		</div>
		<div id="divDemoMaxItems" style="width:200px;">
		</div>
		<h3>Multiple Select Demo with Position of List at Top and Custom Label:</h3>
		<div id="divDemo1" style="width:200px;">
		</div>
		
	</div>
	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script src="../lib/com/org/prototype/base/nsContainerBase.js"></script>
	<script src="../lib/com/org/util/nsFilter.js"></script>
	<script src="../lib/com/org/prototype/nsMultiSelectDropdown.js"></script>
	
	<script>
		var dropDown1 = null;
		var loadHandler = function()
		{
			simpleUsage();
			virtualList();
			labelHorizontalList();
			labelVerticalList();
			labelMaxItems();
			customLabelPosTop();
		};
		
		var simpleUsage = function()
		{
			var divDemo = document.querySelector("#divDemo");
			var setting = {labelField: "name",listWidth:"500px",listHeight:"400px",placeHolder:"Search State"};
			var dropDown = new NSMultiSelectDropdown(divDemo,setting);
			dropDown.dataSource(states);
		};
		
		var virtualList = function()
		{
			var source = [];
			for (var i = 0; i < 10000; i++) 
			{
				source.push({label:"Item " + (i+1),index:i});
			}
			var divDemoVirtual = document.querySelector("#divDemoVirtual");
			var settingVirtual = {labelField: "label",listWidth:"500px",listHeight:"400px",placeHolder:"Search State",enableVirtualScroll:true};
			var dropDownVirtual = new NSMultiSelectDropdown(divDemoVirtual,settingVirtual);
			divDemoVirtual.addEventListener(NSMultiSelectDropdown.DROPDOWN_CLOSE,function(event){
				console.log("In DROPDOWN_Close divDemoVirtual");
			});
			dropDownVirtual.dataSource(source);
		};
		
		var labelHorizontalList = function()
		{
			var divDemoLabelHorizontalList = document.querySelector("#divDemoLabelHorizontalList");
			var setting = {labelField: "name",labelType: NSMultiSelectDropdown.LABEL_TYPE_HORIZONTAL_LIST,listWidth:"500px",listHeight:"400px",placeHolder:"Search State"};
			var dropDown = new NSMultiSelectDropdown(divDemoLabelHorizontalList,setting);
			divDemoLabelHorizontalList.addEventListener(NSMultiSelectDropdown.DROPDOWN_CLOSE,function(event){
				console.log("In DROPDOWN_Close divDemoLabelHorizontalList");
			});
			dropDown.dataSource(states);
		};
		
		var labelVerticalList = function()
		{
			var divDemoLabelVerticalList = document.querySelector("#divDemoLabelVerticalList");
			var setting = {labelField: "name",labelType: NSMultiSelectDropdown.LABEL_TYPE_VERTICAL_LIST,listWidth:"500px",listHeight:"400px",placeHolder:"Search State"};
			var dropDown = new NSMultiSelectDropdown(divDemoLabelVerticalList,setting);
			dropDown.dataSource(states);
		};
		
		var labelMaxItems = function()
		{
			var cmbStates = document.querySelector("#cmbStates");
			var divDemoMaxItems = document.querySelector("#divDemoMaxItems");
			divDemoMaxItems.innerHTML = "";
			var setting = {labelField: "name",itemAllowedToBeSelected: cmbStates.value,labelType: NSMultiSelectDropdown.LABEL_TYPE_VERTICAL_LIST,listWidth:"500px",listHeight:"400px",placeHolder:"Search State"};
			var dropDown = new NSMultiSelectDropdown(divDemoMaxItems,setting);
			dropDown.dataSource(states);
		};
		
		var customLabelPosTop = function()
		{
			var divDemo1 = document.querySelector("#divDemo1");
			var setting1 = {labelField: "name",listWidth:"500px",listHeight:"400px",placeHolder:"Search State",labelRenderer: labelRenderer,showDropDownIcon: false,position:"top"};
			dropDown1 = new NSMultiSelectDropdown(divDemo1,setting1);
			divDemo1.addEventListener(NSMultiSelectDropdown.DROPDOWN_CLOSE,function(event){
				console.log("In DROPDOWN_Close divDemo1");
			});
			dropDown1.dataSource(states);
		};
		
		var labelRenderer = function(arrItems,arrIndexes,arrTexts,labelField)
		{
			if(arrItems && arrItems.length > 0)
			{
				var util = new NSUtil();
				var ul = util.createElement("ul",null,"listCon");
				for(var count = 0;count < arrItems.length;count++)
				{
					var item = arrItems[count];
					var li = util.createElement("li");
					var div = util.createDiv(null,"text");
	                div.appendChild(document.createTextNode(arrTexts[count]));
	                li.appendChild(div);
					var span = util.createElement("span",null,"close");
					span.innerHTML = "&times;";
					span.setAttribute("data-index",arrIndexes[count]);
					util.addEvent(span,"click",closeItem.bind(null,item,arrIndexes[count]));
					li.appendChild(span);
					ul.appendChild(li);
				}
				return ul;
			}
			return "";
		};
		
		var closeItem = function(item,index,event)
		{
			console.log(index);
			dropDown1.setSelectUnselectItems(index,false);
			//dropDown1.setSelectUnselectItems(item,false);
			event.stopPropagation();
		};
		
		var states = [
		                { name: 'ALABAMA', abbreviation: 'AL'},
		                { name: 'ALASKA', abbreviation: 'AK'},
		                { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
		                { name: 'ARIZONA', abbreviation: 'AZ'},
		                { name: 'ARKANSAS', abbreviation: 'AR'},
		                { name: 'CALIFORNIA', abbreviation: 'CA'},
		                { name: 'COLORADO', abbreviation: 'CO'},
		                { name: 'CONNECTICUT', abbreviation: 'CT'},
		                { name: 'DELAWARE', abbreviation: 'DE'},
		                { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
		                { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
		                { name: 'FLORIDA', abbreviation: 'FL'},
		                { name: 'GEORGIA', abbreviation: 'GA'},
		                { name: 'GUAM', abbreviation: 'GU'},
		                { name: 'HAWAII', abbreviation: 'HI'},
		                { name: 'IDAHO', abbreviation: 'ID'},
		                { name: 'ILLINOIS', abbreviation: 'IL'},
		                { name: 'INDIANA', abbreviation: 'IN'},
		                { name: 'IOWA', abbreviation: 'IA'},
		                { name: 'KANSAS', abbreviation: 'KS'},
		                { name: 'KENTUCKY', abbreviation: 'KY'},
		                { name: 'LOUISIANA', abbreviation: 'LA'},
		                { name: 'MAINE', abbreviation: 'ME'},
		                { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
		                { name: 'MARYLAND', abbreviation: 'MD'},
		                { name: 'MASSACHUSETTS', abbreviation: 'MA'},
		                { name: 'MICHIGAN', abbreviation: 'MI'},
		                { name: 'MINNESOTA', abbreviation: 'MN'},
		                { name: 'MISSISSIPPI', abbreviation: 'MS'},
		                { name: 'MISSOURI', abbreviation: 'MO'},
		                { name: 'MONTANA', abbreviation: 'MT'},
		                { name: 'NEBRASKA', abbreviation: 'NE'},
		                { name: 'NEVADA', abbreviation: 'NV'},
		                { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
		                { name: 'NEW JERSEY', abbreviation: 'NJ'},
		                { name: 'NEW MEXICO', abbreviation: 'NM'},
		                { name: 'NEW YORK', abbreviation: 'NY'},
		                { name: 'NORTH CAROLINA', abbreviation: 'NC'},
		                { name: 'NORTH DAKOTA', abbreviation: 'ND'},
		                { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
		                { name: 'OHIO', abbreviation: 'OH'},
		                { name: 'OKLAHOMA', abbreviation: 'OK'},
		                { name: 'OREGON', abbreviation: 'OR'},
		                { name: 'PALAU', abbreviation: 'PW'},
		                { name: 'PENNSYLVANIA', abbreviation: 'PA'},
		                { name: 'PUERTO RICO', abbreviation: 'PR'},
		                { name: 'RHODE ISLAND', abbreviation: 'RI'},
		                { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
		                { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
		                { name: 'TENNESSEE', abbreviation: 'TN'},
		                { name: 'TEXAS', abbreviation: 'TX'},
		                { name: 'UTAH', abbreviation: 'UT'},
		                { name: 'VERMONT', abbreviation: 'VT'},
		                { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
		                { name: 'VIRGINIA', abbreviation: 'VA'},
		                { name: 'WASHINGTON', abbreviation: 'WA'},
		                { name: 'WEST VIRGINIA', abbreviation: 'WV'},
		                { name: 'WISCONSIN', abbreviation: 'WI'},
		                { name: 'WYOMING', abbreviation: 'WY' }
		            ];
		
		loadHandler();
	</script>
	
</body>
</html>