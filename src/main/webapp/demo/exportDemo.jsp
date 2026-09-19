<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Export Demo</title>
<link rel="stylesheet" type="text/css" href="../lib/css/com/org/nsComponent.css"></link>
<style>
.nsExportDemo 
{
	margin:0px;
	padding:0px;
	width:100%;
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
	width:100%;
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
<script>

</script>
</head>
<body onload="initialize()">
	<div id="divTable" class="nsExportDemo"></div>
	<div id="divTableDestination" class="nsExportDemo"></div>
	<br/>
	<button type="button" onclick="exportInExcel(event);">Export In Excel </button>
	<button type="button" onclick="exportInCsv(event);">Export In CSV </button>
	<button type="button" onclick="exportInWord(event);">Export In Word </button>
	<button type="button" onclick="exportInPPT(event);">Export In Powerpoint </button>
	<button type="button" onclick="exportInText(event);">Export In Text </button>
	<button type="button" onclick="exportInXML(event);">Export In XML </button>
	<button type="button" onclick="exportInPDF(event);">Export In PDF </button>
	<button type="button" onclick="exportInJSON(event);">Export In JSON </button>
	<button type="button" onclick="exportAsImage(event);">Export As Image </button>
	<button type="button" onclick="exportAsXSLX(event);">Export As XSLX </button>
	<button type="button" onclick="exportAsDOCX(event);">Export As DOCX </button>
	<br/>
	<div id="page-content">
		aaaa
	</div>
	<br/>
	<button type="button" onclick="exportDivAsDOCX(event);">Export Div As DOCX </button>	
	<button type="button" onclick="exportDivAsDOC(event);">Export Div As DOC </button>
	
	
	<script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
	<script src="/JSLib/lib/com/org/util/nsZip.js"></script>
	<script src="/JSLib/lib/com/org/util/nsXlsxExport.js"></script>
	<script src="/JSLib/lib/com/org/util/nsDocxExport.js"></script>
	<script src="/JSLib/lib/com/org/util/nsExport.js"></script>
	<script src="/JSLib/lib/com/org/util/nsTableRowMover.js"></script>
	<script src="/JSLib/demo/js/dataGenerator.js"></script>
	
	<script type="text/javascript">
		var arrColumn = [{dataField:"id",header:"Id",width:"50px"},
		                 {dataField:"firstname",header:"First Name",width:"200px"},
		                 {dataField:"lastname",header:"Last Name",width:"200px"},
		                 {dataField:"productname",header:"Product Name",width:"200px"},
		                 {dataField:"price",header:"Price",width:"200px"},
		                 {dataField:"quantity",header:"Quantity",width:"150px"}];
		var table = null;
		var body = null;
		function generateTable() 
		{
			var util = new NSUtil();
			var totalRowCount = 200;
			var arrItem = generatePersonData(0,totalRowCount,true);
		    var divTable = document.getElementById("divTable");
		    table = document.createElement("table");
		    table.setAttribute("id","tblData");
		    util.addStyleClass(table,"nsExportDemo");
		    var header = table.createTHead();
			var headerRow = header.insertRow(-1);
			for (var colIndex = 0; colIndex < arrColumn.length; colIndex++)
		    {
		        var colItem = arrColumn[colIndex];
		        var headerCell = headerRow.insertCell(-1);
				headerCell.style.width = (colItem["width"]);
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
			        bodyCell.style.width = (colItem["width"]);
		    		var textNode = document.createTextNode(item[colItem["dataField"]]);
		    		bodyCell.appendChild(textNode);
			    }
		    }
	    	divTable.appendChild(table);
	    	//processLargeArrayAsync(arrItem,renderData,2,this);
		   
		}
		
		function generateDestinationTable()
		{
			var util = new NSUtil();
			var divTable = document.getElementById("divTableDestination");
			var destTable = document.createElement("table");
			destTable.setAttribute("id","tblDestData");
			util.addStyleClass(destTable,"nsExportDemo");
		    var header = destTable.createTHead();
			var headerRow = header.insertRow(-1);
			for (var colIndex = 0; colIndex < arrColumn.length; colIndex++)
		    {
		        var colItem = arrColumn[colIndex];
		        var headerCell = headerRow.insertCell(-1);
				headerCell.style.width = (colItem["width"]);
				var headerTextNode = document.createTextNode(colItem["header"]);
				headerCell.appendChild(headerTextNode);
		    }
			body = document.createElement("tbody");
			destTable.appendChild(body);
			divTable.appendChild(destTable);
		}
		//http://www.redips.net/javascript/drag-and-drop-table-content/
		function initialize()
		{
			generateTable();
			generateDestinationTable();
			var setting = {table:table,isSameTableMove:true,dropEndHandler:dropEndHandler};
			var rowMover = new NSTableRowMover(setting);
		}
		
		function dropEndHandler(currentRow,targetTable,targetRow)
		{
			console.log(currentRow + "," + targetTable + "," + targetRow);
			if(currentRow && targetTable && targetTable.tBodies && targetTable.tBodies.length > 0)
			{
				targetTable.tBodies[0].appendChild(currentRow.cloneNode(true));
			}
		}
		
		function renderData(item,index,arrSource)
		{
			console.log("Rendering Index::" + index);
			var bodyRow = body.insertRow(-1);
    		for (var colIndex = 0; colIndex < arrColumn.length; colIndex++)
		    {
		        var colItem = arrColumn[colIndex];
		        var bodyCell = bodyRow.insertCell(-1);
		        bodyCell.style.width = (colItem["width"]);
	    		var textNode = document.createTextNode(item[colItem["dataField"]]);
	    		bodyCell.appendChild(textNode);
		    }
		}
		
		function processLargeArrayAsync(array,fn,maxTimePerChunk,completeHandler,context) {
			console.log(context);
		    context = context || window;
		    maxTimePerChunk = maxTimePerChunk || 200;
		    var index = 0;

		    function now() {
		        return new Date().getTime();
		    }

		    function doChunk() {
		        var startTime = now();
		        while (index < array.length && (now() - startTime) <= maxTimePerChunk) {
		            // callback called with args (value, index, array)
		            fn.call(context, array[index], index, array);
		            ++index;
		        }
		        if (index < array.length) {
		            // set Timeout for async iteration
		            setTimeout(doChunk, 1);
		        }
		        else if(completeHandler){
		        	completeHandler.call(context);
	            }
		    }    
		    doChunk();    
		}
	</script>
	<script>
	function exportInExcel(event)
	{
		var nsExport = new NSExport(table,"Demo");
		var setting = {type:"xls",event:event,sheetName:"Demo Sheet",element:null};
		nsExport.excel(setting);
	}
	function exportInCsv(event)
	{
		var nsExport = new NSExport(table,"Demo");
		nsExport.csv(event);
	}
	
	function exportInWord(event)
	{
		var nsExport = new NSExport(table,"Demo");
		var setting = {type:"doc",event:event,orientation:null,element:null,pageBreakTag:null};
		nsExport.word(setting);
	}
	
	function exportInPPT(event)
	{
		var nsExport = new NSExport(table,"Demo");
		var setting = {event:event,element:null};
		nsExport.powerpoint(setting);
	}
	
	function exportInText(event)
	{
		var nsExport = new NSExport(table,"Demo");
		nsExport.text(event);
	}
	
	function exportInXML(event)
	{
		var nsExport = new NSExport(table,"Demo");
		nsExport.xml(event);
	}
	
	function exportInJSON(event)
	{
		var nsExport = new NSExport(table,"Demo");
		nsExport.json(event);
	}
	
	function exportInPDF(event)
	{
		var nsExport = new NSExport(table,"Demo");
		nsExport.pdf(event);
	}
	
	function exportAsImage(event)
	{
		var nsExport = new NSExport(table,"Demo");
		var setting = {type:null,event:event};
		nsExport.image(setting);
	}
	function exportAsXSLX(event)
	{
		var nsExport = new NSExport(table,"Demo");
		var setting = {type:"xlsx",event:event,sheetName:"Demo Sheet",element:null};
		nsExport.excel(setting);
	}
	function exportAsDOCX(event)
	{
		var nsExport = new NSExport(table,"Demo");
		var setting = {type:"docx",event:event,orientation:"portrait",element:null,pageBreakTag:null};
		nsExport.word(setting);
	}
	function exportDivAsDOCX(event)
	{
		var nsExport = new NSExport(null,"Demo");
		var setting = {type:"docx",event:event,orientation:"portrait",element:document.querySelector("#page-content"),pageBreakTag:"<pagebreak></pagebreak>",enablePageNumber:true};
		nsExport.word(setting);
	}
	function exportDivAsDOC(event)
	{
		var nsExport = new NSExport(null,"Demo");
		var setting = {type:"doc",event:event,orientation:"portrait",element:document.querySelector("#page-content"),pageBreakTag:"<pagebreak></pagebreak>",enablePageNumber:true};
		nsExport.word(setting);
	}
	
	</script>
</body>
</html>