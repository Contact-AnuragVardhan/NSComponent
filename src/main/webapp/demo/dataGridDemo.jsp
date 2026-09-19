<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>DataGrid Demo</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="../lib/com/org/util/nsImport.js"></script>
<script src="../lib/com/org/util/nsTableRowMover.js"></script>
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<link rel="stylesheet" href="../jquery.jscrollpane.css">
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
  <link rel="stylesheet" href="../main.css" type="text/css" />
  <script src="../main.js"></script>
  <script src="../jquery.jscrollpane.js"></script>
  <script type="text/javascript">
  //http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
  //https://github.com/sdecima/javascript-detect-element-resize

</script>
<style>
html,body
{
	height:100%;
}

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

.purple { text-decoration: none; color:purple; }

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
		</div>
	</template>
	<!-- hierarchical,group,normal -->
	<!-- scroll,pages -->
	<!-- auto,manual -->
	<!-- stack,columnToggle -->
	<ns-grid id="dgDemo" nsTitle="Data Grid Demo" type="" renderInCachedMode="false" enableVirtualScroll="false" enableDataRefreshOnScrollEnd="false" dataRefreshfireDelay="100" 
			 enableFilter="true" enableAdvancedFilter="true" enablePagination="false" paginationType="pages" enableAsyncLoadPagination="true"
			 paginationMode="auto" enableMouseHover="false" enableMultiSelection="true" childField="children" rowKeyField="id"
	         style="width:90%;height:30%;" customScrollerRequired="false" groupByField="country,year" columnResizable="true" enableVariableRowHeight="true"
	         columnDraggable="true" pageSize="10" fetchRecordCallBack="addRows" totalRecords="50" rowHeight="171" leftFixedColumn="0" rightFixedColumn="0"
	         enableFixedColumnAnimation="false" enableRowMove="false" isSameTableMove="false" rowMoverDropEndHandler="rowDropEndHandler"
	         enableContextMenu="false" contextMenuProvider="contextMenuProvider" enableExport="true" enableResponsive="true" responsiveMode="stack"
	         columnAutoSize="true" enableCellSelection="false" enableRowSelection="false" enableKeyboardNavigation="false">
	</ns-grid> 
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
	<button type="button" onclick="moveColumn();">Move Column</button>
	<button type="button" onclick="expandAll();">Expand</button>
	<button type="button" onclick="collapseAll();">Collapse</button>
	<button type="button" onclick="sort();">Sort</button>
	<button type="button" onclick="changeGroupBy('year');">Group By Year</button>
	<button type="button" onclick="changeFontSize();">Change Font Size</button>
	<button type="button" onclick="changeGridView();">Toggle Grid View</button>
	<button type="button" onclick="saveState();">Save State</button>
	<button type="button" onclick="resetState();">Reset State</button>
	<br/>
	<br/>
	<!--  <ns-grid id="dgDemoDest" nsTitle="Data Grid Demo" type="" enableVirtualScroll="false" enablePagination="false" paginationType="scroll" 
			 paginationMode="auto" enableMouseHover="true" enableMultiSelection="true" childField="children" 
	         style="width:90%;height:300px;" groupByField="country,year" columnResizable="true"
	         columnDraggable="true" pageSize="10" fetchRecordCallBack="addRows" totalRecords="20" rowHeight="0" leftFixedColumn="2" rightFixedColumn="1"
	         enableContextMenu="false" contextMenuProvider="contextMenuProvider" enableExport="true" enableResponsive="false" responsiveMode="stack">
	</ns-grid> -->
	
	<script>
	var isHierarchical = false;
	
	var hierarchyColumn = [
		{headerText:"Year",dataField:"Year",width:"20%",sortable:true,sortDescending:true,draggable:false,resizable:true,minWidth:50,filterRenderer:filterRenderer,priority:1},
		{headerText:"Quarter",dataField:"Quarter",width:"15%",sortable:true,sortDescending:true,draggable:false,resizable:true,priority:2},
		{headerText:"Seoul",dataField:"Seoul",width:"20%",sortable:true,sortDescending:false,filterTemplate:"headerTemplate",priority:1},
		{headerText:"Tokyo",dataField:"Tokyo",width:"20%",sortable:true,sortDescending:true,priority:3},
		{headerText:"Singapore",dataField:"Singapore",width:"20%",sortable:false,sortDescending:true,priority:4},
		{headerText:"NewYork",dataField:"NewYork",width:"20%",sortable:true,sortDescending:true,priority:5},
		{headerText:"",dataField:"checked",width:"20px",sortable:false,sortDescending:false,isExportable:false,showMenu:false,headerTemplate:"selectAllTemplate"}
		//itemRenderer:"itemRenderer",
		//template:"templateDemo",setData:setData
	];
	
	var column = [
		      		{headerText:"Id",dataField:"id",width:"200px",sortable:true,sortDescending:true,draggable:false,resizable:true,minWidth:50,priority:1,showMenu:true,
		      		 filter:{advancedFilterType:"number"}},
		      		{headerText:"Country",dataField:"country",width:"200px",sortable:true,sortDescending:true,draggable:false,resizable:true,priority:2,showMenu:true,
		      					filter:{enableAdvancedFilter:true}},
		      		{headerText:"Hierarchy",dataField:"hierarchy",width:"200px",sortable:true,sortDescending:false,priority:1,showMenu:true,
		      					filter:{enableAdvancedFilter:true,advancedFilterType:"list"}},
		      		{headerText:"Year",dataField:"year",width:"200px",sortable:true,sortDescending:true,priority:3,groupRenderer:employeeGroupRenderer,showMenu:true},
		      		{headerText:"Price",dataField:"price",toolTipField:"price",width:"200px",sortable:true,sortDescending:true,priority:5,showMenu:true},
		      		{headerText:"Employees",dataField:"employees",width:"200px",sortable:false,sortDescending:true,groupRenderer:employeeGroupRenderer,headerTruncateToFit:true,
		      		 truncateToFit:true,toolTipRenderer:employeeToolTipRenderer,priority:4,showMenu:true,
		      		 filter:{advancedFilterType:"list"}},//toolTipRenderer:employeeToolTipRenderer
		      		{headerText:"Date",dataField:"date",width:"200px",sortable:true,sortDescending:true,labelFunction:dateLabelFunction,filterRenderer:filterRenderer,priority:5,showMenu:true},
		      		{headerText:"",dataField:"checked",width:"40px",sortable:false,sortDescending:false,enableFilter:false,isExportable:false,showMenu:false,itemRenderer:"itemRenderer",
		      		 headerTemplate:"selectAllTemplate",showMenu:true}
		      		//template:"templateDemo",setData:setData itemRenderer:"itemRenderer",
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
	var flatDataSource =[{id: 1, hierarchy: 'NDPI', supervisor: null, country: 'US', employees: null, price: '10.90', year: '1985',checked:true},
						 {id: 2, hierarchy: 'NGFP Head', supervisor: 'Bonnie Tyler', country: 'UK', employees: 'Patel,Samir', price: '9.90', year: '1988'},
						 {id: 3, hierarchy: 'NGFP Corporate Equity Derivative Sales', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
						 {id: 4, hierarchy: 'NGFP Structured Products Sales', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'}, 					                                                                                                                                         
						 {id: 5, hierarchy: 'Non Regulated Entity', supervisor: null, country: 'US', employees: null, price: '10.90', year: '1985'},
						 {id: 6, hierarchy: 'Nomura America Services, LLC', supervisor: 'Bonnie Tyler', country: 'UK', employees: 'Patel,Samir', price: '9.90', year: '1988'},
						 {id: 7, hierarchy: 'OPERATIONS', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
						 {id: 8, hierarchy: 'ENTERPRISE DATA MGMT', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'},  					                                                                                                                                         
					     {id: 9, hierarchy: 'For the good times', supervisor: 'Kenny Rogers', country: 'UK', employees: 'Mucik Master', price: '8.70', year: '1995'},
					     {id: 11, hierarchy: 'Empire Burlesque', supervisor: 'Bob Dylan', country: 'US', employees: 'Columbia', price: '10.90', year: '1985'},
						 {id: 10,hierarchy: 'Big Willie style', supervisor: 'Will Smith', country: 'US', employees: 'Columbia', price: '9.90', year: '1997'},
						 {id: 12, hierarchy: 'Hide your heart', supervisor: 'Bonnie Tyler', country: 'UK', employees: 'CBS Records', price: '9.90', year: '1988'},
					     {id: 13, hierarchy: 'One night only', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
						 {id: 14, hierarchy: 'Romanza', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'},
						 {id: 18, hierarchy: 'Black angel', supervisor: 'Savage Rose', country: 'US', employees: 'Mega', price: '10.90', year: '1995'},
						 {id: 19, hierarchy: 'For the good times', supervisor: 'Kenny Rogers', country: 'UK', employees: 'Mucik Master', price: '8.70', year: '1995'},
						 {id: 20,hierarchy: 'Big Willie style', supervisor: 'Will Smith', country: 'US', employees: 'Columbia', price: '9.90', year: '1997'},
						 {id: 15, hierarchy: 'Pavarotti Gala Concert', supervisor: 'Luciano Pavarotti', country: 'US', employees: 'DECCA', price: '9.90', year: '1991'},
						 {id: 16, hierarchy: 'Picture book', supervisor: 'Simply Red', country: 'US', employees: 'Elektra', price: '7.90', year: '1985'},
						 {id: 17, hierarchy: 'Eros', supervisor: 'Eros Ramazzotti', country: 'US', employees: 'BMG', price: '9.90', year: '1997'},
						 {id: 12, hierarchy: 'Hide your heart', supervisor: 'Bonnie Tyler', country: 'UK', employees: 'CBS Records', price: '9.90', year: '1988'},
					     {id: 13, hierarchy: 'One night only', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
						 {id: 14, hierarchy: 'Romanza', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'},
						 {id: 18, hierarchy: 'Black angel', supervisor: 'Savage Rose', country: 'US', employees: 'Mega', price: '10.90', year: '1995'},
						 {id: 19, hierarchy: 'For the good times', supervisor: 'Kenny Rogers', country: 'UK', employees: 'Mucik Master', price: '8.70', year: '1995'},
						 {id: 20,hierarchy: 'Big Willie style', supervisor: 'Will Smith', country: 'US', employees: 'Columbia', price: '9.90', year: '1997'},
						 {id: 15, hierarchy: 'Pavarotti Gala Concert', supervisor: 'Luciano Pavarotti', country: 'US', employees: 'DECCA', price: '9.90', year: '1991'},
						 {id: 16, hierarchy: 'Picture book', supervisor: 'Simply Red', country: 'US', employees: 'Elektra', price: '7.90', year: '1985'},
						 {id: 17, hierarchy: 'Eros', supervisor: 'Eros Ramazzotti', country: 'US', employees: 'BMG', price: '9.90', year: '1997'},
						 {id: 12, hierarchy: 'Hide your heart', supervisor: 'Bonnie Tyler', country: 'UK', employees: 'CBS Records', price: '9.90', year: '1988'},
					     {id: 13, hierarchy: 'One night only', supervisor: 'Bee Gees', country: 'UK', employees: 'Polydor', price: '10.90', year: '1998'},
						 {id: 14, hierarchy: 'Romanza', supervisor: 'Andrea Bocelli', country: 'US', employees: 'Polydor', price: '10.80', year: '1996'},
						 {id: 18, hierarchy: 'Black angel', supervisor: 'Savage Rose', country: 'US', employees: 'Mega', price: '10.90', year: '1995'},
						 {id: 19, hierarchy: 'For the good times', supervisor: 'Kenny Rogers', country: 'UK', employees: 'Mucik Master', price: '8.70', year: '1995'},
						 {id: 20,hierarchy: 'Big Willie style', supervisor: 'Will Smith', country: 'US', employees: 'Columbia', price: '9.90', year: '1997'},
						 {id: 15, hierarchy: 'Pavarotti Gala Concert', supervisor: 'Luciano Pavarotti', country: 'US', employees: 'DECCA', price: '9.90', year: '1991'},
						 {id: 16, hierarchy: 'Picture book', supervisor: 'Simply Red', country: 'US', employees: 'Elektra', price: '7.90', year: '1985'},
						 {id: 17, hierarchy: 'Eros', supervisor: 'Eros Ramazzotti', country: 'US', employees: 'BMG', price: '9.90', year: '1997'}
						];
	
		function rowDropEndHandler(currentRow,targetTable,targetRow)
		{
			console.log(currentRow + "," + targetTable + "," + targetRow);
			if(currentRow && targetTable && targetTable.tBodies && targetTable.tBodies.length > 0)
			{
				targetTable.tBodies[0].appendChild(currentRow.cloneNode(true));
			}
		};
	
		function xmlToJson(xml) 
		{
			
			// Create the return object
			var obj = {};
	
			if (xml.nodeType == 1) { // element
				// do attributes
				if (xml.attributes.length > 0) {
					for (var j = 0; j < xml.attributes.length; j++) {
						var attribute = xml.attributes.item(j);
						obj[attribute.nodeName] = attribute.nodeValue;
					}
				}
			} else if (xml.nodeType == 3) { // text
				obj = xml.nodeValue;
			}
	
			// do children
			if (xml.hasChildNodes()) {
				for(var i = 0; i < xml.childNodes.length; i++) {
					var item = xml.childNodes.item(i);
					var nodeName = item.nodeName;
					if (typeof(obj[nodeName]) == "undefined") {
						obj[nodeName] = xmlToJson(item);
					} else {
						if (typeof(obj[nodeName].push) == "undefined") {
							var old = obj[nodeName];
							obj[nodeName] = [];
							obj[nodeName].push(old);
						}
						obj[nodeName].push(xmlToJson(item));
					}
				}
			}
			return obj;
		};	
	
		function dateLabelFunction(item,dataField,colItem)
		{
			if(item && item[dataField])
			{
				var date = item[dataField];
				return date.format("mm/dd/yyyy hh:MM:ss TT");
			}
			return "";
		}
		
		function employeeToolTipRenderer(item,dataField)
		{
			if(item && item[dataField])
			{
				return "<span>" + item[dataField] + "</span>";// );
			}
			return null;
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
		
		function employeeGroupRenderer(item,dataField,colIndex,row)
		{
			var htmlText = "";
			if(item && dataField)
			{
				htmlText = "<input type='text' placeholder='Type'>";
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
		
		function anchorClick(event,rowIndex,keyValue)
		{
			//alert(rowIndex);
			 var dgDemo = document.getElementById("dgDemo");
			 var objItem = dgDemo.getItemInfo(event);
			 objItem["item"]["checked"] = true;
			 dgDemo.updateCellByIndex(rowIndex,"checked");
			 //dgDemo.updateCellByKeyField(keyValue,"checked");
			 //dgDemo.updateRowByKeyField(keyValue);
			 console.log(objItem.rowIndex + "," + rowIndex);
			 event.preventDefault();
		}

		
		function anchorClick(event,rowIndex,keyValue)
		{
			//alert(rowIndex);
			 var dgDemo = document.getElementById("dgDemo");
			 var objItem = dgDemo.getItemInfo(event);
			 objItem["item"]["checked"] = true;
			 dgDemo.updateCellByIndex(rowIndex,"checked");
			 //dgDemo.updateCellByKeyField(keyValue,"checked");
			 //dgDemo.updateRowByKeyField(keyValue);
			 console.log(objItem.rowIndex + "," + rowIndex);
			 event.preventDefault();
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
		var xmlRevenueHierarchy = null;
		function loadHandler()
		{
			var connect = new XMLHttpRequest();
			connect.open("GET", "assets/xml/revenuesHierachy.xml", false);
			connect.setRequestHeader("Content-Type", "text/xml");
			connect.send(null);
			  // Place the response in an XML document.
			xmlRevenueHierarchy = connect.responseXML;
			//xmlRevenueHierarchy = xmlToJson(xmlRevenueHierarchy);
			//xmlRevenueHierarchy = xmlRevenueHierarchy.RevenuesAnalysis.RegionalRevenue;
			ns.onload(function()
			{
				var arrItems = [];
				var item = {};
				var dgDemo = document.getElementById("dgDemo");
				//var dgDemoDest = document.getElementById("dgDemoDest");
				var totalRecords = parseInt(dgDemo.getAttribute("totalRecords"));
				if(dgDemo.getAttribute("enablePagination") === "true" && dgDemo.getAttribute("paginationMode") === "manual")
				{
					totalRecords = 250;
				}
				for(var count = 0;count < totalRecords;count++)
				{
					item = {id: count, hierarchy: 'Hierarchy ' + count, supervisor: "Supervisor " + count, country: 'UK', employees: "EmployeesEmployeesEmployees" + count, price: "£" + (10 * count), year: 1985 + count,checked:false};
					if((count % 2) === 0)
					{
						item["country"] = "US";
					}
					var date = new Date();
			        date.setFullYear(2015, Math.floor(Math.random() * 12), Math.floor(Math.random() * 27));
			        date.setHours(Math.floor(Math.random()*23), Math.floor(Math.random()*59), Math.floor(Math.random()*59), 0);
			        item["date"] = date;
					arrItems.push(item);
				}
				if(isHierarchical)
				{
					//dgDemo.setColumn(hierarchyColumn);
					//dgDemo.dataSource(xmlRevenueHierarchy);//dataSource
					//dgDemo.setColumn(column);
					//dgDemo.dataSource(dataSource);
					
				}
				else
				{
					dgDemo.setColumn(column);
					var util = dgDemo.util;
					var localStorageUtil = new util.localStorage();
					var state = localStorageUtil.getData("nsGrid");
					dgDemo.setState(state);
					//dgDemo.dataSource(flatDataSource);
					dgDemo.dataSource(arrItems);
				}
				dgDemo.util.addEvent(dgDemo,dgDemo.ROW_SELECTED,itemSelectHandler);
				dgDemo.util.addEvent(dgDemo,dgDemo.ROW_UNSELECTED,itemUnSelectHandler);
				arrItems = [];
				for(var count = 0;count < 200;count++)
				{
					item = {id: count, hierarchy: 'Hierarchy ' + count, supervisor: "Supervisor " + count, country: 'UK', employees: "EmployeesEmployeesEmployees" + count, price: (10 * count), year: 1985 + count,checked:false};
					var date = new Date();
			        date.setFullYear(2015, Math.floor(Math.random() * 12), Math.floor(Math.random() * 27));
			        date.setHours(Math.floor(Math.random()*23), Math.floor(Math.random()*59), Math.floor(Math.random()*59), 0);
			        item["date"] = date;
					arrItems.push(item);
				}
				//dgDemoDest.setColumn(column);
				//dgDemo.componentResized();
				//dgDemoDest.dataSource(arrItems);
				dgDemo.fixFixedHeader();
				//console.log(dgDemo.__divCenterTableBodyContainer.offsetWidth);
				
			});	
		}
		
		var resizeFn = function(e){
		      console.log('You just resized the green box!');
		    }
		//http://html5demos.com/worker for web worker
		//http://hugoware.net/blog/simulate-threading-using-javascript
		//http://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui
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
		
		function fire()
		{
			var test = "anurag";
			var callback = function (item, index, array) 
			{
				//console.log(item.id + "," + item.hierarchy + "," + item.supervisor + "," + this);
				//divDemo.innerHTML += item.id + "," + item.hierarchy;
			}
			var arrItems = [];
			var item = {};
			var add = function () 
			{
				console.log("finished");
			}
			
			for(var count = 0;count < 100000;count++)
			{
				item = {id: count, hierarchy: 'Hierarchy ' + count, supervisor: "Supervisor " + count, country: 'UK', employees: "EmployeesEmployeesEmployees" + count, price: (10 * count), year: 1985 + count,checked:false};
				var date = new Date();
		        date.setFullYear(2015, Math.floor(Math.random() * 12), Math.floor(Math.random() * 27));
		        date.setHours(Math.floor(Math.random()*23), Math.floor(Math.random()*59), Math.floor(Math.random()*59), 0);
		        item["date"] = date;
				arrItems.push(item);
			}
			processLargeArrayAsync(arrItems,callback,200,this);
		}
		
		
		
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
		
		function moveColumn()
		{
			var dgDemo = document.getElementById("dgDemo");
			//dgDemo.swapColumns(0);
			dgDemo.moveColumn(4,1);
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
		
		function saveState()
		{
			var dgDemo = document.getElementById("dgDemo");
			var state = dgDemo.getState();
			var util = dgDemo.util;
			var localStorageUtil = new util.localStorage();
			localStorageUtil.setData("nsGrid",state);
		}
		
		function resetState()
		{
			var dgDemo = document.getElementById("dgDemo");
			var util = dgDemo.util;
			var localStorageUtil = new util.localStorage();
			localStorageUtil.removeData("nsGrid");
		}
		
		function sort()
		{
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.sortBy("year");
			highlight(dgDemo.__tblBodyBody,"UK","highlight");
			highlight(dgDemo.__tblBodyBody,"Patel","highlight");
		}
		
		function addRows(fromRecord,toRecord,pageSize)
		{
			console.log("In addRows with fromRecord::" + fromRecord + ",toRecord::" + toRecord + ",pageSize::" + pageSize);
			var arrItems = [];
			var item = null;
			for(var count = fromRecord;count <= toRecord;count++)
			{
				item = {id: count, hierarchy: 'Hierarchy ' + count, supervisor: "Supervisor " + count, country: 'UK', employees: "Employees " + count, price: (10 * count), year: 1985 + count,checked:false};
				arrItems.push(item);
			}
			var dgDemo = document.getElementById("dgDemo");
			dgDemo.addRows(arrItems);
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
		
		function highlight(container,what,spanClass) {
		    var content = container.innerHTML,
		        pattern = new RegExp('(>[^<.]*)(' + what + ')([^<.]*)','g'),
		        replaceWith = '$1<span ' + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '">$2</span>$3',
		        highlighted = content.replace(pattern,replaceWith);
		    return (container.innerHTML = highlighted) !== content;
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


<script>
//http://codepen.io/chriscoyier/pen/tIuBL
//https://spion.github.io/posts/intuitive-javascript-array-filtering-function.html
	
</script>
</body>
</html>
