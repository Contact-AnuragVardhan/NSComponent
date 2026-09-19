<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Export Demo</title>
<script src="../lib/com/org/util/nsUtil.js"></script>
<script src="../lib/com/org/util/nsPluggins.js"></script>
<script type="text/javascript" src="/JSLib/demo/js/dataGenerator.js"></script>
<style>
.nsExportDemo 
{
	margin:0px;
	padding:0px;
	width:400px;
	height:300px;
	overflow:auto;
	box-shadow: 10px 10px 5px #888888;
	border:1px solid #000000;
	
	-moz-border-radius-bottomleft:0px;
	-webkit-border-bottom-left-radius:0px;
	border-bottom-left-radius:0px;
	
	-moz-border-radius-bottomright:0px;
	-webkit-border-bottom-right-radius:0px;
	border-bottom-right-radius:0px;
	
	-moz-border-radius-topright:0px;
	-webkit-border-top-right-radius:0px;
	border-top-right-radius:0px;
	
	-moz-border-radius-topleft:0px;
	-webkit-border-top-left-radius:0px;
	border-top-left-radius:0px;
}
.nsExportDemo table
{
    border-collapse: collapse;
    border-spacing: 0;
	width:1000px;
	height:100%;
	margin:0px;
	padding:0px;
}
.nsExportDemo tr:last-child td:last-child 
{
	-moz-border-radius-bottomright:0px;
	-webkit-border-bottom-right-radius:0px;
	border-bottom-right-radius:0px;
}
.nsExportDemo table tr:first-child td:first-child {
	-moz-border-radius-topleft:0px;
	-webkit-border-top-left-radius:0px;
	border-top-left-radius:0px;
}
.nsExportDemo table tr:first-child td:last-child {
	-moz-border-radius-topright:0px;
	-webkit-border-top-right-radius:0px;
	border-top-right-radius:0px;
}
.nsExportDemo tr:last-child td:first-child{
	-moz-border-radius-bottomleft:0px;
	-webkit-border-bottom-left-radius:0px;
	border-bottom-left-radius:0px;
}.nsExportDemo tr:hover td{
	
}
.nsExportDemo tr:nth-child(odd){ background-color:#aad4ff; }
.nsExportDemo tr:nth-child(even)    { background-color:#ffffff; }.nsExportDemo td{
	vertical-align:middle;
	
	
	border:1px solid #000000;
	border-width:0px 1px 1px 0px;
	text-align:left;
	padding:7px;
	font-size:11px;
	font-family:Arial;
	font-weight:normal;
	color:#000000;
}.nsExportDemo tr:last-child td{
	border-width:0px 1px 0px 0px;
}.nsExportDemo tr td:last-child{
	border-width:0px 0px 1px 0px;
}.nsExportDemo tr:last-child td:last-child{
	border-width:0px 0px 0px 0px;
}
.nsExportDemo thead tr:first-child td{
		background:-o-linear-gradient(bottom, #005fbf 5%, #003f7f 100%);	background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #005fbf), color-stop(1, #003f7f) );
	background:-moz-linear-gradient( center top, #005fbf 5%, #003f7f 100% );
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#005fbf", endColorstr="#003f7f");	background: -o-linear-gradient(top,#005fbf,003f7f);

	background-color:#005fbf;
	border:0px solid #000000;
	text-align:center;
	border-width:0px 0px 1px 1px;
	font-size:14px;
	font-family:Arial;
	font-weight:bold;
	color:#ffffff;
}
.nsExportDemo thead tr:first-child:hover td{
	background:-o-linear-gradient(bottom, #005fbf 5%, #003f7f 100%);	
	background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #005fbf), color-stop(1, #003f7f) );
	background:-moz-linear-gradient( center top, #005fbf 5%, #003f7f 100% );
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#005fbf", endColorstr="#003f7f");	background: -o-linear-gradient(top,#005fbf,003f7f);

	background-color:#005fbf;
}
.nsExportDemo thead tr:first-child td:first-child{
	border-width:0px 0px 1px 0px;
}
.nsExportDemo thead tr:first-child td:last-child{
	border-width:0px 0px 1px 1px;
}
</style>
<style>
	table.table-data{
	background: white;
	border-collapse:collapse;
}

table.table-data tbody{
  background-color: white;
}
table.table-data tbody td{
	border:1px dotted lightgray;
}
.nsSelectionTable tr.nsArea-top > td.nsArea{
  border-top: 2px solid #5292F7;
}
.nsSelectionTable tr.nsArea-bottom > td.nsArea{
  border-bottom: 2px solid #5292F7;
}
.nsSelectionTable td.nsArea.nsArea-left{
  border-left: 2px solid #5292F7;
}
.nsSelectionTable td.nsArea.nsArea-right{
  border-right: 2px solid #5292F7;
}
.nsSelectionTable td.nsArea.nsCell,
.nsSelectionTable td.nsCell{
  border-right: 2px solid #5292F7;
  background: #FAFAFF;
}
.nsSelectionTable.focus td.nsArea.nsCell,
.nsSelectionTable.focus td.nsCell{
  background: #FAFAFF;
  border-right: 2px solid #5292F7;
}
.nsSelectionTable td.nsArea{
	background: #ECF3FF;
}

.nsTextAreaEditor
{
	z-index:10000;
	position:absolute;
	background:white;
	padding:5px;
	border:3px solid gray; 
	-moz-border-radius:10px; 
	border-radius:10px;
}
.nsTextAreaEditor .nsTextArea
{
	backround:white;
	width:250px;
	height:80px;
	border:0;
	outline:0
}

.nsTextEditor 
{
    width: 100%;
    height: 100%;
    border: 0;
    margin: 0;
    background: transparent;
    outline: 0;
    padding: 0;
}

.handle-overlay {
    border: 1px solid white;
    padding: 2px;
    background-color: #5292F7;
    position: absolute;
    width: 1px;
    z-index: 1000;
    cursor: crosshair;
}

.pointerEventsNone {
    pointer-events: none;
}

/*table.table-data thead td{
	background: #F3F3F3;
	border-left:1px solid #CCCCCC;
	border-bottom:1px solid #CCCCCC;
	text-align: center;
}*/

/*tr {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}*/
	
</style>
<script>
	
</script>
</head>
<body onload="initialize()">
	<div id="divTable" class="nsExportDemo table"></div>
	<br/>
	<div id="divTable1" style="position:relative;" >
		<div class="handle-overlay" style="top: 172px; left: 262px; height: 1px; width: 1px;" ondragstart="alert('here')" draggable="true"></div>
	</div>
	<button onClick="selectAll()">Select All</button>
	<button onClick="deselectAll()">Deselect All</button>
	<button onClick="selectRange()">Select Range</button>
	<button onClick="selectCell()">Select Cell</button>
	
	<script>
	
	</script>
	
	<script type="text/javascript">
		var arrColumn = null;
		var table = null;
		var body = null;
		var util = null;
		var nsCellSelection = null;
		var arrItem = [];
		function generateTable() 
		{
			util = new NSUtil();
			var totalRowCount = 200;
			arrItem = generatePersonData(0,totalRowCount,true);
		    var divTable = document.getElementById("divTable");
		    table = document.createElement("table");
		    table.setAttribute("id","tblData");
		    util.addStyleClass(table,"nsExportDemo");
		    util.addStyleClass(table,"table-data");
		    var header = table.createTHead();
			var headerRow = header.insertRow(-1);
			for (var colIndex = 0; colIndex < arrColumn.length; colIndex++)
		    {
		        var colItem = arrColumn[colIndex];
		        var headerCell = headerRow.insertCell(-1);
				headerCell.style.width = colItem["width"];
				var headerTextNode = document.createTextNode(colItem["header"]);
				headerCell.appendChild(headerTextNode);
		    }
			body = document.createElement("tbody");
			table.appendChild(body);
	    	for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++)
		    {
	    		var bodyRow = body.insertRow(-1);
	    		var item = arrItem[rowIndex];
	    		for (var colIndex = 0; colIndex < arrColumn.length; colIndex++)
			    {
			        var colItem = arrColumn[colIndex];
			        var bodyCell = bodyRow.insertCell(-1);
			        bodyCell.id = rowIndex + "-" + colIndex;
			        bodyCell.style.width = (colItem["width"]);
		    		var textNode = document.createTextNode(item[colItem["dataField"]]);
		    		bodyCell.appendChild(textNode);
			    }
		    }
	    	divTable.appendChild(table);
		}
		
		function initialize()
		{
			arrColumn = [{dataField:"id",header:"Id",width:"50px",editor:NSCellSelection.EDITORS.TEXT},
			                 {dataField:"firstname",header:"First Name",width:"200px",editor:NSCellSelection.EDITORS.TEXT},
			                 {dataField:"lastname",header:"Last Name",width:"200px",editor:NSCellSelection.EDITORS.TEXTAREA},
			                 {dataField:"productname",header:"Product Name",width:"200px",editor:NSCellSelection.EDITORS.TEXTAREA},
			                 {dataField:"price",header:"Price",width:"200px",editor:NSCellSelection.EDITORS.TEXT},
			                 {dataField:"quantity",header:"Quantity",width:"150px",editor:NSCellSelection.EDITORS.TEXT}];
			generateTable();
			/*var nsTableCellNavigator = new NSTableCellNavigator(table);
			util.addEvent(table,NSTableCellNavigator.CELL_SELECTED,function(event){
				//console.log(event);
				var cell = event.cell;
				cell.style.backgroundColor = 'green';
				cell.style.color = 'white';
			});
			util.addEvent(table,NSTableCellNavigator.CELL_UNSELECTED,function(event){
				//console.log(event);
				var cell = event.cell;
				cell.style.backgroundColor = '';
				cell.style.color = '';
			});
			util.addEvent(table,NSTableCellNavigator.CELL_SELECTABLE,function(event){
				//console.log(event);
				var cell = event.cell;
				var row = event.row;
				if(cell.cellIndex == 1 && row.rowIndex == 2)
				{
					event.preventDefault();
				}
			});*/
			var editors = [];
			for (var colIndex = 0; colIndex < arrColumn.length; colIndex++)
		    {
				var colItem = arrColumn[colIndex];
				if(colItem["editor"])
				{
					editors.push({type:colItem["editor"]});
				}
				else
				{
					editors.push({type:NSCellSelection.EDITORS.TEXT});
				}
		    }
			var setting = {scrollableElement:null,enableFillHandle:true,enableKeyboardNavigation:true,enableCopy:true,enablePaste:true,cellClass:null,areaClass:null,editors:editors};
			nsCellSelection = new NSCellSelection(table,setting);
			util.addEvent(table,NSCellSelection.SELECTION_START,function(event){
				console.log("Selection Started");
			});
			util.addEvent(table,NSCellSelection.SELECTION_END,function(event){
				console.log("Selection Ended with cells " + event.selectedCells);
			});
			util.addEvent(table,NSCellSelection.SET_CELL_VALUE,function(event){
				var cellIndex = event.cellIndex;
				var cell = event.cell;
				var rowIndex = event.rowIndex;
				var row = event.row;
				var data = event.dataToBeSet;
				cell.innerHTML = data;
				arrItem[rowIndex][cellIndex] = data;
			});
		}
		
		function selectAll()
		{
			nsCellSelection.selectAll();
		}
		
		function deselectAll()
		{
			nsCellSelection.deselectAll();
		}
		
		function selectRange()
		{
			nsCellSelection.selectRange({row:100,col:1},{row:160,col:2});
		}
		
		function selectCell()
		{
			nsCellSelection.selectCell({row:50,col:1});
		}
		
		
	</script>
	
</body>
</html>