<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>List Demo</title>

<!-- <script src="../lib/com/org/util/nsImport.js"></script> -->

<style>
body * {
    box-sizing: content-box;
    box-sizing: initial;
    -webkit-font-smoothing: antialiased;
}
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
			height:35%;
			flex: 1 1 auto;
    		padding-left: 25px;
    		padding-top: 50px;
		}
		
</style>

<style>
  	.hbox 
	{
	  overflow-x:auto;
	  text-align: center;
	}
	.hbox > * 
	{
	   display: inline-block;
	   vertical-align: middle;
	}
	.header 
	{
		position: relative;
	    font-weight: bold;
	    background: #808080;
	    color: white;
	    text-transform: uppercase;
	    padding-left: 10px;
	}
	.header > * 
	{
  	  position: absolute;
  	  top: 0; left: 0; bottom: 0; right: 0;
	}
	
	#lstDemo:focus
	{
		outline:solid 1px green;
	}
	
	ul:focus 
	{
    	outline:solid 1px green;
	}
	
	.handle 
	{
	  cursor: move;
	  position: absolute;
	  top: 0px;
	}
	
	.other 
	{
 	 margin-left: 20px;
	}
	.rightList 
	{
    	float: left;
    	margin-left: 10px;
    }
  
</style>

<style>
.tooltiptext {
    /*visibility: hidden;
    opacity: 0;*/
    position: absolute;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    z-index: 10;
    transition: opacity 0.3s;
}

.tooltiptext::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent #555;
}

.tooltip-left {
    top: -5px;
    bottom: auto;
    left: 298px;
}

.tooltiptext {
    visibility: visible;
    opacity: 1;
}
</style>



<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
<link href="../lib/css/com/org/nsList.css" rel="stylesheet">
<link href="../lib/css/com/org/nsMenu.css" rel="stylesheet">
<link href="../lib/css/com/org/nsScroller.css" rel="stylesheet">
<link href="../lib/css/com/org/nsConsole.css" rel="stylesheet">
<link href="/JSLib/lib/css/com/org/nsVirtualScroll.css" rel="stylesheet">

</head>
<body>
	<template id="templateDemo">
			<div accessor-name="rendererBody" class="hbox">
				<input type="checkbox" accessor-name="chk"  >
				<label accessor-name="label1"></label>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<label accessor-name="label2"></label>
			</div>
	</template>
 	<div class="container" style="height:410px;">
		<div style="display: inline-block;width:33%;">
			<div id="lstServerSideDemo" style="height:400px;"></div>
		</div>
	</div>
	<div class="container">
		<div style="display: inline-block;width:99%;">
			<div>
				<input id="txtFilter" class="nsFilter nsSearchInlineTextBox" type="text" placeholder="Filter" 
				 	    style="width: 279px;" onkeyup="filterKeyUpHandler(event);">
				<div id="divContainer" style="width:100%;">
					<div id="lstDemo" style="height:300px;width:300px;float:left;">
					</div>
			<!-- 		<div is="ns-List" id="lstDemo1" style="height:300px;width:300px;"> -->
			<!-- 		</div> -->
			<!-- 		<ns-List id="lstDemo1" style="height:300px;width:300px;"> -->
			<!-- 		</ns-List> -->
				</div>
				
				<div id="navWrapper">
			        
			    </div>
				<br/>
				<form>
				  <input type="text" id="txtSelectedIndex" placeholder="Enter Selected Index" required><br>
				  <input type="button" name="Submit" value="Submit" onclick="return setSelectedIndex();"/>
				</form>
				
				<br/><br/>
				<input type="button" value="Expand All" onclick="expandAll();"/>
				<input type="button" value="Collapse All" onclick="collapseAll();"/>
			</div>
		</div>
	</div>
	<div class="container">
	 	<div style="display: inline-block;width:33%;">
	 		<div>
				<input type="text" id="txtHierarchyText"  class="nsFilter nsSearchInlineTextBox" placeholder="Enter Hierarchy For Filter"
				  style="width: 279px;" onkeyup="filterHierarchy(event);">
				 <div>
				  <input type="text" id="txtHierarchySelectedIndex" placeholder="Enter Selected Index" required><br>
				  <input type="button" name="Submit" value="Submit" onclick="return setHierarchySelectedIndex();"/>
				</div>
				<div id="lstHeirarchicalDemo" style="height:300px;width:300px;">
				</div>
				<br/>
				<input type="button" value="Expand All" onclick="expandAllHierarchical();"/>
				<input type="button" value="Collapse All" onclick="collapseAllHierarchical();"/>
			</div>
		</div>
	</div>
	<br/>
	<br/>
	<div class="container" style="height:400px;">
		<div style="width:33%;height:100%;">
			<div id="lstCustomScrollDemo" style="height:100%;"></div>
		</div>
	</div>
	
	<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script src="../lib/com/org/util/nsAjax.js"></script>
	<script src="../lib/com/org/util/nsSVG.js"></script>
	<script src="../lib/com/org/util/nsPluggins.js"></script>
	<script src="../lib/com/org/prototype/base/nsContainerBase.js"></script>
	<script src="../lib/com/org/util/nsDragDrop.js"></script>
	<script src="../lib/com/org/util/nsFilter.js"></script>
	<script src="../lib/com/org/util/nsMenu.js"></script>
	<script src="../lib/com/org/prototype/nsList.js"></script>
	<script src="../lib/com/org/util/nsScroller.js"></script>
	<script src="/JSLib/lib/com/org/util/nsVirtualScroll.js"></script>
	<script src="/JSLib/lib/com/org/util/nsConsole.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js" integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=" crossorigin="anonymous"></script>
	
	
	<script>	
					var hierarchicalDataSource =[{id: 0, hierarchy: 'ROOT', supervisor: null, country: 'US', employees: null, price: '10.90', year: '1985',checked:true,children:
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
				var dataSource = [];
				
				document.getElementById('txtSelectedIndex').onkeydown = function(e) 
				{
				    /*var key = e.keyCode ? e.keyCode : e.which;
				    if ( isNaN( String.fromCharCode(key) ) ) return false;*/
				}
				
				var numRows = 200;
				var numLevels = 2;
				
				var rowCount = 0;
				var arrItems = [];
				
				var nsList = null;
				var nsList1 = null;
				var nsListHierarchical = null;
				var nsServerHierarchical = null;
				var nsCustomScrollBarList = null;
				
				function loadHandler()
				{
					//setChildren();
					var nsConsole = new NSConsole();
					dataSource = [];
					dataSource1 = [];
					for (var count = 0 ;count < 400; count++)
					{
						var item = {id:count, hierarchy:"Hierarchy " + count,isChecked:true};
						if((count % 10) === 0)
						{
							item["stopOver"] = true;
						}
						dataSource.push(item);
					}
					for (var count = 0 ;count < 2; count++)
					{
						var item1 = {id:count, hierarchy:"Hierarchy " + count,isChecked:true};
						if((count % 10) === 0)
						{
							item1["stopOver"] = true;
						}
						dataSource1.push(item1);
					}
					var lstDemo1 = document.createElement("div");
					lstDemo1.setAttribute("id","lstDemo1");
					lstDemo1.style.height = "300px";
					lstDemo1.style.width = "300px";
					document.getElementById("divContainer").appendChild(lstDemo1);
					
					var lstDemo = document.getElementById("lstDemo");
					var setting = {labelField:"hierarchy",enableVirtualScroll:false,enableDragDrop:true,enableDragByHandle:true,dragHandlerClass:"handle",
								   enableMultipleSelection:true,enableKeyboardNavigation:true,customScrollerRequired:false,
								   enableMouseHover:true,enableMouseHoverAnimation:true,disableHoverField:"stopOver",itemRenderer:itemRenderer,disableDraggableFunction:disableDraggableFunction,
						 		   disableDropableFunction:disableDropableFunction};//, template:"templateDemo",setData:"setData"
					setting["dataSource"] = [];
					nsList = new NSList(lstDemo,setting);
					nsList.util.addEvent(lstDemo,nsList.ITEM_SELECTED,itemSelectHandler);
					nsList.util.addEvent(lstDemo,nsList.ITEM_UNSELECTED,itemUnSelectHandler);
					nsList.util.addEvent(lstDemo,nsList.ITEM_DROPPING,itemDroppingHandler);
					nsList.util.addEvent(lstDemo,nsList.ITEM_DROPPED,itemDroppedHandler);
					nsList.util.addEvent(lstDemo,nsList.DRAG_STARTED,dragStartHandler);
					nsList.util.addEvent(lstDemo,nsList.DRAG_END,dragEndHandler);
					//var lstDemo1 = document.getElementById("lstDemo1");
					var setting1 = {labelField:"hierarchy",enableHierarchical:true,enableVirtualScroll:false,enableDragDrop:true,
									isDraggable:true,isDroppable:false,
									enableMultipleSelection:true,enableKeyboardNavigation:true,customScrollerRequired:false,
					 		   		disableHoverField:"stopOver",enableDragAfterHold:true,holdTime:300,enableCloneMode:true,enableContextMenu:true,
					 		   		contextMenuProvider:contextMenuProvider,enableTruncateToFit:true,enableToolTipForTruncateText:true,
					 		   		toolTipRenderer:toolTipRenderer};//, template:"templateDemo",setData:"setData",itemRenderer:itemRenderer
					setting1["dataSource"] = hierarchicalDataSource;
					nsList1 = new NSList(lstDemo1,setting1);
					nsList1.util.addStyleClass(lstDemo1,"rightList");
					nsList1.util.addEvent(lstDemo1,nsList1.ITEM_DROPPING,item1DroppingHandler);
					initializeHierarchyList();
					serverSideDemo();
					initalizeCustomScrollList();
					console.info("This is test info");
					console.debug("This is test debug");
					console.warn("This is test warning");
					console.error("This is test error");
				}
				
				function initalizeCustomScrollList()
				{
					var total = 600;
					var arrSource = [];
					for(var count = 0;count < total;count++)
		        	{
						var item = {id:count,name: "Name " + (count + 1)};
						arrSource.push(item);
		        	}
					var lstCustomScrollDemo = document.getElementById("lstCustomScrollDemo");
					var customScrollBarSetting = {enableTooltip: true,verticalScrollButtons: {enable: true},horizontalScrollButtons:{enable: true}};
					var setting = {labelField:"name",enableVirtualScroll:false,enableCustomScrollBar:true,
			 		   			   enableTruncateToFit:true,enableToolTipForTruncateText:true,customScrollBarSetting: customScrollBarSetting};
					setting["dataSource"] = arrSource;
					nsCustomScrollBarList = new NSList(lstCustomScrollDemo,setting);
				}
				
				function serverSideDemo()
				{
					var lstServerSideDemo = document.getElementById("lstServerSideDemo");
					var setting = {labelField:"firstName",enableHierarchical:true,enableVirtualScroll:false,enableDragDrop:false,
							isDraggable:true,isDroppable:false,
							enableMultipleSelection:true,enableKeyboardNavigation:true,customScrollerRequired:false,
			 		   		disableHoverField:"stopOver",enableDragAfterHold:true,holdTime:300,enableCloneMode:true,enableContextMenu:false,
			 		   		contextMenuProvider:contextMenuProvider,enableTruncateToFit:true,enableToolTipForTruncateText:true,
			 		   		toolTipRenderer:toolTipRenderer,
			 		   		enableOnDemandHierarchy:true,onDemandChildDetectionField:"hasChildren",onDemandChildFetchCallback:getNthLevelData};
					//, template:"templateDemo",setData:"setData",itemRenderer:itemRenderer
					//setting["dataSource"] = getFirstLevelData();
					nsServerHierarchical = new NSList(lstServerSideDemo,setting);
					$.ajax({
					    url: '/JSLib/hierarchicalFirstLevelData',
					    type: 'get',
					    data: {datalength: "10"},
					    contentType: "application/json;charset=utf-8",
					    success: function(result) {
					    	console.log(result);
					    }
					});
					/*var ajax = new NSAjax();
					ajax.get("/JSLib/hierarchicalFirstLevelData",{datalength: "10"},{dataType:"json"}).then(
							function(result) 
							{
								console.log(result);
								getParentData(result);
							},
							function(error) 
							{ 
								
							}
					);*/
				}
				
				var lastItem = null;
				function getParentData(result)
				{
					nsServerHierarchical.dataSource(result);
					console.log(result);
				}
				
				function getNthLevelData(item,rowIndex,rowLevel,event)
				{
					var ajax = new NSAjax();
					ajax.get("/JSLib/hierarchicalNonFirstLevelData",{datalength: "10",parentid:item.id},{dataType:"json"}).then(
							function(data) 
							{
								console.log(data);
								if(data && data.length > 0)
								{
									nsServerHierarchical.addItemsAsChildren(item,data);
								}
								else
								{
									item.hasChildren = false;
									nsServerHierarchical.updateListItemByIndex(rowIndex);
								}
							},
							function(error) 
							{ 
								/* handle an error */ 
							}
					);
				}
				
				/*function serverSideDemo()
				{
					var lstServerSideDemo = document.getElementById("lstServerSideDemo");
					var setting = {labelField:"label",enableHierarchical:true,enableVirtualScroll:false,enableDragDrop:false,
							isDraggable:true,isDroppable:false,
							enableMultipleSelection:true,enableKeyboardNavigation:true,customScrollerRequired:false,
			 		   		disableHoverField:"stopOver",enableDragAfterHold:true,holdTime:300,enableCloneMode:true,enableContextMenu:false,
			 		   		contextMenuProvider:contextMenuProvider,enableTruncateToFit:true,enableToolTipForTruncateText:true,
			 		   		toolTipRenderer:toolTipRenderer,
			 		   		enableOnDemandHierarchy:true,onDemandChildDetectionField:"hasChildren",onDemandChildFetchCallback:getNthLevelData};
					//, template:"templateDemo",setData:"setData",itemRenderer:itemRenderer
					//setting["dataSource"] = getFirstLevelData();
					nsServerHierarchical = new NSList(lstServerSideDemo,setting);
					
					var util= new NSUtil();
					var setting =  {
						method: "GET",
						//url: "http://api.flickr.com/services/feeds/photos_public.gne",
						url: "http://www.itis.gov/ITISWebService/jsonservice/getKingdomNames",
						dataType: "jsonp",
						param: {
							jsonp: "getParentData"
						},
						successHandler: function( data ) {
							console.log(data);
							//response( data );
						}
					};
					var ajax = new util.ajax(setting);
				}
				
				var lastItem = null;
				function getParentData(result)
				{
					var arrSource = [];
					if(result && result.kingdomNames)
					{
						for(var count = 0;count < result.kingdomNames.length;count++)
						{
							var tempItem = result.kingdomNames[count];
							if(tempItem)
							{
								var item = {label:tempItem.kingdomName,tsn:tempItem.tsn,detail:tempItem,hasChildren:true};
								arrSource.push(item);
							}
						}
					}
					nsServerHierarchical.dataSource(arrSource);
					
					console.log(result);
				}
				
				function getNthLevelData(item,rowIndex,rowLevel,event)
				{
					var util= new NSUtil();
					lastItem = {item:item,rowIndex:rowIndex,rowLevel:rowLevel,event:event};
					var setting =  {
						method: "GET",
						//url: "http://api.flickr.com/services/feeds/photos_public.gne",
						url: "http://www.itis.gov/ITISWebService/jsonservice/getHierarchyDownFromTSN",
						dataType: "jsonp",
						param: {
							jsonp: "getChildData",
							tsn: item.tsn
						},
						successHandler: function( data ) {
							console.log(data);
							//response( data );
						}
					};
					var ajax = new util.ajax(setting);
				}
				
				function getChildData(result)
				{
					var arrSource = [];
					if(lastItem)
					{
						if(result && result.hierarchyList)
						{
							for(var count = 0;count < result.hierarchyList.length;count++)
				        	{
				        		  var tempItem = result.hierarchyList[count];
				        		  if(tempItem)
				        		  {
				        			  var item = {label:tempItem.taxonName,tsn:tempItem.tsn,detail:tempItem,hasChildren:true};
				        			  arrSource.push(item);
				        		  }
				        	}
						}
						if(arrSource && arrSource.length > 0)
						{
							nsServerHierarchical.addItemsAsChildren(lastItem.item,arrSource);
						}
						else
						{
							lastItem.item.hasChildren = false;
							nsServerHierarchical.updateListItemByIndex(lastItem.rowIndex);
						}
					}
					lastItem = null;
					//console.log(result);
				}*/

				/*function getFirstLevelData()
				{
					var arrItem = [];
					for(var count = 1;count <= 10;count++)
					{
						var item = {id:count + 1,hierarchy: "Hierarchy " + count,hasChildren:true};
						arrItem.push(item);
					}
					return arrItem;
				}
				
				function getNthLevelData()
				{
					
				}*/
				
				function initializeHierarchyList()
				{
					arrItems = []; 
					var lstHeirarchicalDemo = document.getElementById("lstHeirarchicalDemo");
					getDataSource(null,0,arrItems);
					var virtualScrollSetting = {pageSize:10,pagesRendered:2};
					var setting = {labelField:"hierarchy",enableHierarchical:true,enableVirtualScroll:true,virtualScrollSetting: virtualScrollSetting,enableDragDrop:false,
							isDraggable:true,isDroppable:false,
							enableMultipleSelection:true,enableKeyboardNavigation:true,customScrollerRequired:false,
			 		   		disableHoverField:"stopOver",enableDragAfterHold:true,holdTime:300,enableCloneMode:true,enableContextMenu:false,
			 		   		contextMenuProvider:contextMenuProvider,enableTruncateToFit:true,enableToolTipForTruncateText:true,
			 		   		toolTipRenderer:toolTipRenderer};//, template:"templateDemo",setData:"setData",itemRenderer:itemRenderer
					setting["dataSource"] = arrItems;
					nsListHierarchical = new NSList(lstHeirarchicalDemo,setting);
				}
				
				function getDataSource(parentRow, level,arrItems)
				{
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

				var getRandomNumber = function (level){
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
				
				function itemRenderer(item,labelField,fieldIndex,isDisabled,listItem)
				{
					var htmlText = "";
					if(item)
					{
						if(isDisabled)
						{
							htmlText = "<div class='header'>";
						}
						else
						{
							htmlText = "<div class='hbox'>";
							htmlText += "<span class='handle'>:::</span>";
							htmlText += "<span class='other'>";
							htmlText += "<input id='" + ("chk" + fieldIndex) + "' type='checkbox' onchange='checkBox_changeHandler(event)' checked='" + item["isChecked"] + "'>";
							htmlText += "<label>" + item["id"] + "</label>";
							htmlText += "</span>";
						}
						htmlText += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
						htmlText += "<label>" + item[labelField] + "</label>";
						htmlText += "</div>";
					}
					return htmlText;
				}
				
				function toolTipRenderer(item,labelField,fieldIndex,isDisabled,listItem)
				{
					if(item)
					{
						return item[labelField] + " (" + item["id"] + ")";
					}
					return null;
				}
				
				function setData(renderer,item,labelField,isDisabled,listItem)
				{
					if(renderer)
					{
						var lstDemo = document.getElementById("lstDemo"); 
						if(item && item[labelField])
						{
							if(isDisabled)
							{
								renderer.rendererBody.chk.style.display = "none";
								renderer.rendererBody.label1.style.display = "none";
								renderer.rendererBody.label1.innerHTML = "";
								nsList.util.removeStyleClass(renderer.rendererBody,"hbox");
								nsList.util.addStyleClass(renderer.rendererBody,"header");
							}
							else
							{
								renderer.rendererBody.chk.onchange = checkBox_changeHandler;
								renderer.rendererBody.chk.style.display = "inline";
								renderer.rendererBody.chk.checked = item["isChecked"];
								renderer.rendererBody.label1.display = "inline";
								renderer.rendererBody.label1.innerHTML = item["id"];
								nsList.util.removeStyleClass(renderer.rendererBody,"header");
								nsList.util.addStyleClass(renderer.rendererBody,"hbox");
							}
							renderer.rendererBody.label2.innerHTML = item[labelField];
							//renderer.rendererBody.rendererLabel.appendChild(document.createTextNode(item[labelField]));
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
						var lstDemo = document.getElementById("lstDemo"); 
						renderer.rendererBody.chk.style.display = "none";
						renderer.rendererBody.label1.style.display = "none";
						renderer.rendererBody.label1.innerHTML = "";
						renderer.rendererBody.label2.innerHTML = "";
						nsList.util.removeStyleClass(renderer.rendererBody,"header");
						nsList.util.addStyleClass(renderer.rendererBody,"hbox");
					}
				}
				
				function disableDraggableFunction(item,labelField,fieldIndex,isDisabled,listItem)
				{
					return isDisabled;
				}
				
				function disableDropableFunction(item,labelField,fieldIndex,isDisabled,listItem)
				{
					return isDisabled;
				}
				
				function checkBox_changeHandler(event) 
				{					
					var checked = event.target.checked ? "checked":"unchecked";
				    alert(event.target.data["id"] + " is " + checked);
				}
		
				var timeOutID = null;
				function filterKeyUpHandler(event)
				{
					if(timeOutID) 
					{
					  	clearTimeout(timeOutID);
					}
					timeOutID = setTimeout(function() 
				    {
						var lstDemo = document.getElementById("lstDemo"); 
						var txtFilter = document.getElementById("txtFilter"); 
						var text = txtFilter.value;
						if(text === "")
						{
							nsList1.resetFilter();
						}
						else
						{
							nsList1.filter(text);
						}
				    }, 1000);
				}
				function setSelectedIndex()
				{
					var txtSelectedIndex = document.getElementById('txtSelectedIndex'); 
					var lstDemo1 = document.getElementById('lstDemo1'); 
					nsList1.setSelectedIndex(parseInt(txtSelectedIndex.value));
					nsList1.scrollToIndex(txtSelectedIndex.value,true);
					return false;
				}
				
				function itemSelectHandler(event)
				{
					console.log("Item Selected with details::" + event.detail + " with indexes " + event.target.getSelectedIndexes().toString());
					//console.log("Item Selected with details::" + event.detail + " with index " + event.index);
				}
				
				function itemUnSelectHandler(event)
				{
					console.log("Item Unselected with details::" + event.detail  + " with index " + event.index);
				}
				
				function itemDroppingHandler(event)
				{
					var arrItems = event.detail;
					if(event.cancelable)
					{
						//event.preventDefault();
					}
				}
				
				function itemDroppedHandler(event)
				{
					var arrItems = event.detail;
					console.log(arrItems);
				}
				
				function dragStartHandler(event)
				{
					var arrItems = event.detail;
					console.log(arrItems + " dragging");
				}
				
				function dragEndHandler(event)
				{
					var target = event.target;
					var arrItems = event.detail;
					console.log(arrItems + " dragged" + event.target);
					var lstDemo = document.getElementById("lstDemo");
					if(target && target !== lstDemo)
					{
						nsList.removeItems(arrItems);	
					}
				}
				
				function item1DroppingHandler(event)
				{
					var arrItems = event.detail;
					if(event.cancelable && arrItems && arrItems.length > 0 && arrItems[0]["ns_field_disableHover"])
					{
						event.preventDefault();
					}
				}
				
				function expandAll()
				{
					nsList1.expandAll();
				}
				
				function collapseAll()
				{
					nsList1.collapseAll();
				}
				
				function expandAllHierarchical()
				{
					nsListHierarchical.expandAll();
				}
				
				function collapseAllHierarchical()
				{
					nsListHierarchical.collapseAll();
				}
				
				function filterHierarchy(event)
				{
					if(nsListHierarchical)
					{
						var txtHierarchyText = document.getElementById("txtHierarchyText"); 
						var text = txtHierarchyText.value;
						if(text === "")
						{
							nsListHierarchical.resetFilter();
						}
						else
						{
							nsListHierarchical.filter(text);
						}
					}
				}
				function setHierarchySelectedIndex()
				{
					var txtHierarchySelectedIndex = document.getElementById('txtHierarchySelectedIndex'); 
					nsListHierarchical.setSelectedIndex(parseInt(txtHierarchySelectedIndex.value));
					nsListHierarchical.scrollToIndex(txtHierarchySelectedIndex.value,true);
					return false;
				}
				
				
	
	    function initialize()
		{
			setChildren();
		}
		var lstDemo = null;
		function setChildren()
		{
			var itemRenderer = getTemplate("templateDemo");
			var navWrapper = document.createElement("div");
			document.getElementsByTagName('body')[0].appendChild(navWrapper);
			lstDemo = document.createElement("ul");
			navWrapper.appendChild(lstDemo);
			for(var count = 0; count < 10; count++) 
			{
				var listItem = document.createElement("li");
				listItem.appendChild(itemRenderer.cloneNode(true));
				nsList.appendChild(listItem);
				setRendererProperties(listItem);
			}
		}
		
		function setRendererProperties(listItem)
		{
			if(listItem)
			{
				var compChild = null;
				for(var count = 0; count < listItem.children.length; count++) 
				{
					compChild = listItem.children[count];
					Array.prototype.slice.call(compChild.attributes).forEach(function(attribute) 
					{
						if(isFunction(attribute.value))
						{
							 var item = {id:1};
							var newValue = attribute.value + "(this)";
							compChild.removeAttribute(attribute.name);
							compChild.setAttribute(attribute.name,newValue);
							compChild.data = item;
						}
					});
					if(compChild)
					{
						if(compChild.hasAttribute("accessor-name"))
						{
							listItem[compChild.getAttribute("accessor-name")] = compChild;
						}
					}
					setRendererProperties(compChild);
				}
			}
		}
		
		function getTemplate(templateID) 
		 {
			 var templateClone = null;
			 if(templateID)
			 {
				 var template = document.getElementById(templateID);
				 if(template)
				 {
					templateClone = template.content.children[0]; //document.importNode(template.content, true); 
				 }
			 }
			 return templateClone;
		 }
		 
		 function isFunction(refFunction) 
		{
			if(refFunction && ((typeof refFunction == "function") || (typeof window[refFunction] === "function")))
			{
				return true;
			}
			return false;
		};
		
		function contextMenuProvider(item,index)
		{
			console.log(item + "," + index);
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
		
		loadHandler();
	</script>
	
</body>
</html>