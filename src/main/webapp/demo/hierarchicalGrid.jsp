<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>DataGrid Demo</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="../lib/com/org/util/nsImport.js"></script>
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
 <!-- Ionicons -->
<link href="http://code.ionicframework.com/ionicons/2.0.0/css/ionicons.min.css" rel="stylesheet" type="text/css" />
<script src="../demo/js/dateFormat.js"></script>
<!-- <script type="text/javascript" src="//code.jquery.com/jquery-2.1.1.min.js"></script> -->
<!-- <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script> -->
<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment-with-locales.js"></script>
<!-- <script src="//cdn.rawgit.com/Eonasdan/bootstrap-datetimepicker/e8bddc60e73c1ec2475f827be36e1957af72e2ea/src/js/bootstrap-datetimepicker.js"></script> -->
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
  <script src="//code.jquery.com/jquery-1.10.2.js"></script>
  <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<style>
body
{
	margin:10px;
	padding:10px;
}
	td.area {
    background: -moz-linear-gradient(top, rgba(181, 209, 255, 0.34) 0, rgba(181, 209, 255, 0.34) 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(181, 209, 255, 0.34)), color-stop(100%, rgba(181, 209, 255, 0.34)));
    background: -webkit-linear-gradient(top, rgba(181, 209, 255, 0.34) 0, rgba(181, 209, 255, 0.34) 100%);
    background: -o-linear-gradient(top, rgba(181, 209, 255, 0.34) 0, rgba(181, 209, 255, 0.34) 100%);
    background: -ms-linear-gradient(top, rgba(181, 209, 255, 0.34) 0, rgba(181, 209, 255, 0.34) 100%);
    background: linear-gradient(to bottom, rgba(181, 209, 255, 0.34) 0, rgba(181, 209, 255, 0.34) 100%);
    filter: progid: DXImageTransform.Microsoft.gradient(startColorstr='#57b5d1ff', endColorstr='#57b5d1ff', GradientType=0);
    background-color: #fff;
    color: #d3d3d3;
}

.filterContainer{
  padding: 3px 5px;
}
.filter{
	display: table-cell;
  vertical-align: middle;
  padding-left: 5px;
}

.highlight{
    color:#CA2420;
    font-weight:bold;
    font-size:105%;
}

</style>

<style>
	div.l {
    float: left;
    margin: 20px 20px 0 0;
    border: 2px solid #666;
    background: #000;
    height: 150px;
    width: 150px;
    position: relative;
}
.sonic {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
}
canvas {
    display: block;
}
</style>


</head>
<body onload="loadHandler();">
	<nsimport file="nsGrid.js">
	</nsimport>
	<template id="templateDemo">
			<div accessor-name="rendererBody" class="hbox">
				<input type="checkbox" accessor-name="chk">
			</div>
	</template>
	<template id="headerTemplate">
		<div class="filterContainer">
			<input id="txthierarchy" type="search" results="5" field="hierarchy" class="filter" onkeyup='keyUpHandler(event)'>
		</div>
	</template>
	<template id="selectAllTemplate">
		<div accessor-name="rendererBody" class="hbox">
			<input type="checkbox" onchange="changeHandler(event)">
			<script>
				function changeHandler(event)
				{
					alert("Select All");
				}
			</script>
		</div>
	</template>
	<!-- hierarchical,group,normal -->
	<!-- scroll,pages -->
	<!-- auto,manual -->
	<!-- stack,columnToggle -->
	<ns-grid id="dgDemo" nsTitle="Data Grid Demo" type="hierarchical" renderInCachedMode="false" enableVirtualScroll="true" 
			 enablePagination="false" paginationType="scroll" paginationMode="auto" enableAsyncLoadPagination="false"
			 enableMouseHover="true" enableMultiSelection="true" childField="children" 
	         style="width:90%;height:500px;" groupByField="country,year" columnResizable="true" enableVariableRowHeight="true"
	         columnDraggable="true" pageSize="10" totalRecords="2000" rowHeight="171" leftFixedColumn="0" rightFixedColumn="0"
	         enableContextMenu="false" contextMenuProvider="contextMenuProvider" enableExport="true" enableResponsive="false" responsiveMode="stack">
	</ns-grid>
	<br/>
	<br/>
	<div class="l"><canvas class="sonic" height="70" width="120"></canvas></div>
	<br/>
	<br/>
	<div id="divDemo"></div>
	<br/>
	<br/>
	<button type="button" onclick="showHideLoader();">Show/Hide Loader</button>
	<button type="button" onclick="dataSourceRefreshHandler();">Change DataSource</button>
	<button type="button" onclick="columnRefreshHandler();">Change Column</button>
	<button type="button" onclick="addColumn();">Add Column</button>
	<button type="button" onclick="hideColumn();">Remove Column</button>
	<button type="button" onclick="swapColumns();">Swap Column</button>
	<button type="button" onclick="expandAll();">Expand</button>
	<button type="button" onclick="collapseAll();">Collapse</button>
	<button type="button" onclick="sort();">Sort</button>
	<button type="button" onclick="changeGroupBy('year');">Group By Year</button>
	<button type="button" onclick="changeFontSize();">Change Font Size</button>
	<button type="button" onclick="changeGridView();">Toggle Grid View</button>
	
	<script>
	var isHierarchical = true;
	
	var column = [
		      		{headerText:"Id",dataField:"id",width:"20%",sortable:true,sortDescending:true,draggable:false,resizable:true,minWidth:50,filterRenderer:filterRenderer,priority:1},
		      		{headerText:"Country",dataField:"country",width:"15%",sortable:true,sortDescending:true,draggable:false,resizable:true,filterRenderer:filterRenderer,priority:2},
		      		{headerText:"Hierarchy",dataField:"hierarchy",width:"20%",sortable:true,sortDescending:false,filterTemplate:"headerTemplate",headerTruncateToFit:true,truncateToFit:true,priority:1},
		      		{headerText:"Year",dataField:"year",width:"20%",sortable:true,sortDescending:true,filterRenderer:filterRenderer,priority:3},
		      		{headerText:"Employees",dataField:"employees",width:"20%",sortable:false,sortDescending:true,filterRenderer:filterRenderer,priority:4},
		      		{headerText:"Date",dataField:"date",width:"20%",sortable:true,sortDescending:true,labelFunction:dateLabelFunction,filterRenderer:filterRenderer,priority:5},
		      		{headerText:"",dataField:"checked",width:"40px",sortable:false,sortDescending:false,setData:setData,isExportable:false,showMenu:false,itemRenderer:"itemRenderer",headerTemplate:"selectAllTemplate"}
		      	];
		
	var dataSource =[{id: 0, hierarchy: 'ROOT', supervisor: null, country: 'US', employees: null, price: '10.90', year: '1985',checked:true,children:
						[{id: 1, hierarchy: 'NDPI', supervisor: null, country: 'US', employees: null, price: '10.90', year: '1985',checked:true,children:[
							{id: 2, hierarchy: 'NGFP Head', supervisor: 'Bonnie Tyler', country: 'UK', employees: 'Patel,Samir', price: '9.90', year: '1988',children:[
								{id: 3, hierarchy: 'NGFP Corporate Equity Derivative Sales', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998',children:[
            							{id: 3, hierarchy: 'NGFP Corporate Equity Derivative Sales', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
           								{id: 4, hierarchy: 'NGFP Structured Products Sales', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'}  					                                                                                                                                         
           						]},
								{id: 4, hierarchy: 'NGFP Structured Products Sales', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996',children:[
               							{id: 3, hierarchy: 'NGFP Corporate Equity Derivative Sales', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
           								{id: 4, hierarchy: 'NGFP Structured Products Sales', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'}  					                                                                                                                                         
           						]}  					                                                                                                                                         
						]},
						            ]},
						{id: 5, hierarchy: 'Non Regulated Entity', supervisor: null, country: 'US', employees: null, price: '10.90', year: '1985',children:[
							{id: 6, hierarchy: 'Nomura America Services, LLC', supervisor: 'Bonnie Tyler', country: 'UK', employees: 'Patel,Samir', price: '9.90', year: '1988',children:[
								{id: 7, hierarchy: 'OPERATIONS', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998',children:[
             							{id: 3, hierarchy: 'NGFP Corporate Equity Derivative Sales', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
           								{id: 4, hierarchy: 'NGFP Structured Products Sales', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'}  					                                                                                                                                         
           						]},
								{id: 8, hierarchy: 'ENTERPRISE DATA MGMT', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996',children:[
	      							{id: 3, hierarchy: 'NGFP Corporate Equity Derivative Sales', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
	    							{id: 4, hierarchy: 'NGFP Structured Products Sales', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'}  					                                                                                                                                         
	    						]}  					                                                                                                                                         
							]},
						]},
				        {id: 9, hierarchy: 'For the good times', supervisor: 'Kenny Rogers', country: 'UK', employees: 'Mucik Master', price: '8.70', year: '1995',children:[
							{id: 11, hierarchy: 'Empire Burlesque', supervisor: 'Bob Dylan', country: 'US', employees: 'Columbia', price: '10.90', year: '1985',children:[
          							{id: 3, hierarchy: 'NGFP Corporate Equity Derivative Sales', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
       								{id: 4, hierarchy: 'NGFP Structured Products Sales', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'}  					                                                                                                                                         
       						]},
							{id: 10,hierarchy: 'Big Willie style', supervisor: 'Will Smith', country: 'US', employees: 'Columbia', price: '9.90', year: '1997',children:[
        							{id: 3, hierarchy: 'NGFP Corporate Equity Derivative Sales', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
      								{id: 4, hierarchy: 'NGFP Structured Products Sales', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'}  					                                                                                                                                         
      						]},
							{id: 12, hierarchy: 'Hide your heart', supervisor: 'Bonnie Tyler', country: 'UK', employees: 'CBS Records', price: '9.90', year: '1988',children:[
		  							{id: 3, hierarchy: 'NGFP Corporate Equity Derivative Sales', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
									{id: 4, hierarchy: 'NGFP Structured Products Sales', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'}  					                                                                                                                                         
							]}
				        ]},
				        {id: 13, hierarchy: 'One night only', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998',children:[
							{id: 14, hierarchy: 'Romanza', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996',children:[
								{id: 18, hierarchy: 'Black angel', supervisor: 'Savage Rose', country: 'US', employees: 'Mega', price: '10.90', year: '1995'},
								{id: 4, hierarchy: 'For the good times', supervisor: 'Kenny Rogers', country: 'UK', employees: 'Mucik Master', price: '8.70', year: '1995'},
								{id: 20,hierarchy: 'Big Willie style', supervisor: 'Will Smith', country: 'US', employees: 'Columbia', price: '9.90', year: '1997'},
								{id: 15, hierarchy: 'Pavarotti Gala Concert', supervisor: 'Luciano Pavarotti', country: 'US', employees: 'DECCA', price: '9.90', year: '1991'},
								{id: 16, hierarchy: 'Picture book', supervisor: 'Simply Red', country: 'US', employees: 'Elektra', price: '7.90', year: '1985'},
								{id: 17, hierarchy: 'Eros', supervisor: 'Eros Ramazzotti', country: 'US', employees: 'BMG', price: '9.90', year: '1997'}
                            ]}	
                        ]}
				 ]}];
	
	
		function dateLabelFunction(item,dataField,colItem)
		{
			if(item && item[dataField])
			{
				var date = item[dataField];
				return date.format("mm/dd/yyyy hh:MM:ss TT");
			}
			return "";
		}
	
		function filterRenderer(colItem,colIndex)
		{
			var htmlText = "";
			if(colItem)
			{
				if(colItem["dataField"] === "date")
				{
					htmlText = "<div class='filterContainer'><input type='text' class='date filter' field='date' onchange='keyUpHandler(event)'/></div>";
					
				}
				else 
				{
					var field = colItem["dataField"];
					htmlText = "<div class='filterContainer'><input id='txt" + field + "' type='search' results='5' placeholder='Search " + field +"' +   field='" + field + "' class='filter' " +
								   " onkeyup='keyUpHandler(event)'/></div>";
				}
			}
			return htmlText;
		}
		
		var timeout = null;
		function keyUpHandler(event)
		{
			clearTimeout(timeout);
			timeout = setTimeout(function () {
					filterGrid();
			    }, 500);
		}
		
		function filterGrid()
		{
			var arrID = ["id","country","hierarchy","employees","year","date"];
			 var dgDemo = document.getElementById("dgDemo");
			 //and condition
			 /*var filter = {};
			 var setting = {};
			 for(var count = 0;count < arrID.length ;count++)
			 {
				 var control = document.querySelector("#txt" + arrID[count]);
				 if(control && control.value)
				 {
					 var key = control.getAttribute("field");
					 if(key === "date")
					 {
						 filter[key] = filterDate;
						 setting[key] = {value:control.value};
					 }
					 else
					 {
						 filter[key] = control.value;
						 setting[key] = {caseSensitive:false,multiline:false,matchType:new NSFilter().CONTAINS};
					 } 
				 }
			 }
			 if(filter && Object.keys(filter).length > 0)
			 {
				 dgDemo.filter(filter,setting);
			 }
			 else
			 {
				 dgDemo.resetFilter();
			 }*/
			 //or condition
			 var filter = [];
			 var setting = {};
			 for(var count = 0;count < arrID.length ;count++)
			 {
				 var control = document.querySelector("#txt" + arrID[count]);
				 if(control && control.value)
				 {
					 var item = {};
					 var key = control.getAttribute("field");
					 if(key === "date")
					 {
						 item[key] = filterDate;
						 setting[key] = {value:control.value};
					 }
					 else
					 {
						 item[key] = control.value;
						 setting[key] = {caseSensitive:false,multiline:false,matchType:new NSFilter().CONTAINS};
					 } 
					 if(item)
					 {
						 filter.push(item);
					 }
				 }
			 }
			 if(filter && filter.length > 0)
			 {
				 dgDemo.filter(filter,setting);
			 }
			 else
			 {
				 dgDemo.resetFilter();
			 }
		}
		
		function filterDate(item,setting)
		{
			if(item && setting && setting["value"])
			{
				var value = setting["value"];
				value = value.replace(/\\/g, "");
				var now = moment(item);
				if (moment(value).isAfter(now, 'day'))
				{
					return false;
				}
				return true;
			}
			return false;
		}
		
		function itemRenderer(data,dataField,rowIndex,columnIndex,row)
		{
			/*var selected = data[dataField];
			//row.update();
			if(selected)
			{
				return '<input type="checkbox" checked>';
			}
			else
			{
				return '<input type="checkbox">';
			}*/
			if(data["checked"])
			{
				return "<a href=# class='purple' onclick='anchorClick(event," + rowIndex +"," + data["id"] +")'>" + returnAlphabets("a",rowIndex + 1) + "</a>";
			}
			else
			{
				return "<a href=# onclick='anchorClick(event," + rowIndex +"," + data["id"] +")'>" + returnAlphabets("a",rowIndex + 1) + "</a>";
			}
			/*if(data["checked"])
			{
				return "<a href=# class='purple' onclick='anchorClick(event," + rowIndex +"," + data["id"] +")'>" + "Visit W3Schools.com!" + "</a>";
			}
			else
			{
				return "<a href=# onclick='anchorClick(event," + rowIndex +"," + data["id"] +")'>" + "Visit W3Schools.com!" + "</a>";
			}*/
			
		}
		
		function returnAlphabets(alphabet,count)
		{
			var retValue = "";
			for(var innerCount= 1;innerCount < count;innerCount++)
			{
				retValue += alphabet;
			}
			return retValue;
		}
	
		function setData(renderer,data,dataField,colItem,row)
		{
			if(renderer)
			{
				if(data)
				{
					renderer.rendererBody.chk.onchange = checkBox_changeHandler;
					renderer.rendererBody.chk.checked = data[dataField];
				}
				else
				{
					clearData(renderer);
				}
			}
		}
		
		function clearData(renderer)
		{
			if(renderer)
			{
				renderer.rendererBody.chk.checked = false;
			}
		}
		
		function checkBox_changeHandler(event) 
		{					
			var checked = event.target.checked ? "checked":"unchecked";
			event.target.data["hierarchy"] = event.target.data["hierarchy"] + "1"; 
			event.target.data["checked"] = checked;
		    alert(event.target.data["id"] + " is " + checked);
		    event.target.row.update();
		    event.stopImmediatePropagation();
		}
		function loadHandler()
		{
			ns.onload(function()
			{
				var arrItems = []; 
				var dgDemo = document.getElementById("dgDemo");
				var totalRecords = parseInt(dgDemo.getAttribute("totalRecords"));
				getDataSource(null,0,arrItems);
				dgDemo.setColumn(column);
				dgDemo.dataSource(arrItems);
					
				dgDemo.util.addEvent(dgDemo,dgDemo.ROW_SELECTED,itemSelectHandler);
				dgDemo.util.addEvent(dgDemo,dgDemo.ROW_UNSELECTED,itemUnSelectHandler);
			});	
		}
		
		var numRows = 50;
		var numLevels = 2;
		
		var rowCount = 0;
	    
		function getRandomNumber(level){
			var nCount = 1 + Math.floor(Math.random() * 10);
			
			if (level === 0)
			{
				if (numLevels == 0)
					nCount = numRows;
				else
				{
					var derivative = 1;
					for (var k = 1; k <= numLevels; k++)
						derivative = (derivative * nCount) + 1;

					nCount = numRows / derivative + 1;
					if (nCount < 1000)
						nCount = 1000;
				}
			}
			
			return nCount;
		}

		function getDataSource(parentRow, level,arrItems){
			if (level > numLevels)
				return;
				
			var numChilds = getRandomNumber(level);    
			for (var i = 0; i < numChilds; i++){
				if (rowCount < numRows)
				{
					var item = {id: rowCount, hierarchy: 'hierarchy ' + (rowCount+1).toString(), supervisor: null, country: 'US', employees: null, price: '10.90', year: '1985',checked:true};
					if(level === 1)
					{
						item.hierarchy = 'hie ' + (rowCount+1).toString()
					}
					if(level === 2)
					{
						item.hierarchy = 'hier ' + (rowCount+1).toString()
					}
					if(parentRow)
					{
						if(!parentRow["children"])
						{
							parentRow["children"] = [];
						}
						parentRow["children"].push(item);
					}
					else
					{
						arrItems.push(item);
					}
					rowCount++;
					getDataSource(item, level + 1,arrItems);
				}
			}
		};
		
		var showingLoader = false;
		function showHideLoader()
		{
			var dgDemo = document.getElementById("dgDemo");
			if(showingLoader)
			{
				dgDemo.hideLoader();
			}
			else
			{
				dgDemo.showLoader();
			}
			showingLoader = !showingLoader;
		}
		
		function dataSourceRefreshHandler()
		{
			var dgDemo = document.getElementById("dgDemo");
			if(isHierarchical)
			{
				dgDemo.dataSource(dataSource);
			}
			else
			{
				dgDemo.dataSource(flatDataSource);
			}
			
			//dgDemo.util.addCSSClassInDOM([".nsCellChild"],["color:red;"]);
		}
		
		function columnRefreshHandler()
		{
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.setColumn(column);
			dataSourceRefreshHandler();
		}
		
		function changeGroupBy(fieldName)
		{
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.groupBy(fieldName);
			//dgDemo.setAttribute("groupByField",fieldName);
		}
		
		function changeFontSize()
		{
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.setFontSize("14px");
			//dgDemo.setAttribute("groupByField",fieldName);
		}
		
		var isReflowView = false;
		function changeGridView()
		{
			var dgDemo = document.getElementById("dgDemo");
			isReflowView = !isReflowView;
			dgDemo.changeDeviceView(isReflowView);
		}
		
		function addColumn()
		{
			var column = {};
			column.headerText = "Price";
			column.dataField = "price";
			column.width = "100px";
			column.sortable = true;
			column.sortDescending = true;
			
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.addColumn(column);
			
		}
		
		function hideColumn()
		{
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.hideColumn("country");
		}
		
		function swapColumns()
		{
			var dgDemo = document.getElementById("dgDemo");
			//dgDemo.swapColumns(0);
			dgDemo.swapColumns(3,4);
		}
		
		function expandAll()
		{
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.expandAll();
		}
		
		function collapseAll()
		{
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.collapseAll();
		}
		
		function sort()
		{
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.sortBy("year");
		}
		
		function contextMenuProvider(item,columnIndex,rowIndex)
		{
			console.log(item + "," + columnIndex + "," + rowIndex);
			var index = columnIndex + rowIndex;
			var source = [];
			for(var count = index;count < index + 5;count++)
			{
				source.push({title: 'Menu ' + count,iconHTML: '<i class="fa fa-folder-open"></i>',handler: menuClickHandler});
			}
			return source;
		}
		
		function menuClickHandler(target,item)
		{
			if(item)
			{
				console.log("Menu with text " + item.title + " was selected for Target " + target.nodeName + " with text as "  + target.innerHTML);			
			}
		}
		//https://github.com/NeXTs/Clusterize.js/blob/master/clusterize.js
		function itemSelectHandler(event)
		{
			console.log("Item Selected with details::" + event.detail + " with hierarchy " + event.detail.hierarchy);
			//console.log("Item Selected with details::" + event.detail + " with index " + event.index);
		}
		
		function itemUnSelectHandler(event)
		{
			console.log("Item Unselected with details::" + event.detail  + " with hierarchy " + event.detail.hierarchy);
		}
		
	</script>
	<script>//<![CDATA[
	$(window).load(function(){
		$(function() {
		    $( ".date" ).datepicker({
		    	 showWeek: true,
		         regional: "sv",
		         minDate: "-10Y",
		         maxDate: "+10Y",
		    	showButtonPanel: true,
		        buttonImageOnly: false,
		        showWeekNumber: true,
		        firstDay: 1,
		        showOtherMonths: true,
		        selectOtherMonths: true,
		        changeMonth: true,
		        changeYear: true,
		        showOn: "both",
		    	//dateFormat: 'mm/dd/yyyy',
		    	onClose: function(selected) {
		    		filterGrid();
		       }
		    });
		  });
	});//]]> 
	</script>
</body>
</html>
