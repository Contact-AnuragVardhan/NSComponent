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
<!--  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<link href="http://code.ionicframework.com/ionicons/2.0.0/css/ionicons.min.css" rel="stylesheet" type="text/css" />
<script src="../demo/js/dateFormat.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment-with-locales.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<script src="//code.jquery.com/jquery-1.10.2.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>-->
  
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
	<ns-grid id="dgDemo" nsTitle="Data Grid Demo" type="group" isSingleLevelGrouping="false" groupColumnHeaderName="Grouped Column" groupColumnFieldName="group" renderInCachedMode="false" 
			enableVirtualScroll="true" enablePagination="false" paginationType="scroll" 
			 paginationMode="auto" enableMouseHover="true" enableMultiSelection="true" childField="children" 
	         style="width:90%;height:300px;" groupByField="country,year" columnResizable="true" enableVariableRowHeight="true"
	         columnDraggable="true" pageSize="10" fetchRecordCallBack="addRows" totalRecords="50" rowHeight="0" leftFixedColumn="0" rightFixedColumn="1"
	         enableFixedColumnAnimation="false" enableRowMove="false" isSameTableMove="false" rowMoverDropEndHandler="rowDropEndHandler"
	         enableToolTipForTruncateText="true"
	         enableContextMenu="false" contextMenuProvider="contextMenuProvider" enableExport="true"  enableResponsive="false" responsiveMode="stack">
	</ns-grid> 
	<br/>
	<br/>
	<button type="button" onclick="showHideLoader();">Show/Hide Loader</button>
	<button type="button" onclick="dataSourceRefreshHandler();">Change DataSource</button>
	<button type="button" onclick="columnRefreshHandler();">Change Column</button>
	<button type="button" onclick="addColumn();">Add Column</button>
	<button type="button" onclick="removeColumn();">Remove Column</button>
	<button type="button" onclick="swapColumns();">Swap Column</button>
	<button type="button" onclick="expandAll();">Expand</button>
	<button type="button" onclick="collapseAll();">Collapse</button>
	<button type="button" onclick="sort();">Sort</button>
	<button type="button" onclick="changeGroupBy('year');">Group By Year</button>
	<button type="button" onclick="changeFontSize();">Change Font Size</button>
	<button type="button" onclick="changeGridView();">Toggle Grid View</button>
	<br/>
	<br/>
	<script>
	
	var column = [
		      		{headerText:"Id",dataField:"id",width:"20%",sortable:true,sortDescending:true,draggable:false,resizable:true,showMenu:true,minWidth:50,filterRenderer:filterRenderer,priority:1},
		      		{headerText:"Country",dataField:"country",width:"15%",sortable:true,sortDescending:true,draggable:false,resizable:true,showMenu:true,filterRenderer:filterRenderer,priority:2},
		      		{headerText:"Hierarchy",dataField:"hierarchy",width:"20%",sortable:true,sortDescending:false,showMenu:true,filterTemplate:"headerTemplate",headerTruncateToFit:true,truncateToFit:true,priority:1},
		      		{headerText:"Year",dataField:"year",width:"20%",sortable:true,sortDescending:true,showMenu:true,filterRenderer:filterRenderer,priority:3},
		      		{headerText:"Employees",dataField:"employeesID",width:"20%",sortable:false,sortDescending:true,filterRenderer:filterRenderer,priority:4,itemRenderer:employeeItemRenderer,groupRenderer:employeeGroupRenderer},
		      		{headerText:"Date",dataField:"date",width:"20%",sortable:true,sortDescending:true,showMenu:true,labelFunction:dateLabelFunction,filterRenderer:filterRenderer,truncateToFit:true,priority:5},
		      		{headerText:"",dataField:"checked",width:"70px",sortable:false,sortDescending:false,itemRenderer:"itemRenderer",isExportable:false,showMenu:false,headerTemplate:"selectAllTemplate"}
		      		//template:"templateDemo",setData:setData itemRenderer:"itemRenderer",
		      	];
	
		function rowDropEndHandler(currentRow,targetTable,targetRow)
		{
			console.log(currentRow + "," + targetTable + "," + targetRow);
			if(currentRow && targetTable && targetTable.tBodies && targetTable.tBodies.length > 0)
			{
				targetTable.tBodies[0].appendChild(currentRow.cloneNode(true));
			}
		};
	
		function dateLabelFunction(item,dataField,colItem)
		{
			if(item && item[dataField])
			{
				var date = item[dataField];
				//return date.format("mm/dd/yyyy hh:MM:ss TT");
				return date
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
		
		function employeeItemRenderer(item,dataField,colIndex,row)
		{
			var htmlText = "";
			if(item && item["employeeSrc"] && dataField)
			{
				var arrEmployee = item["employeeSrc"];
				/*htmlText = "<select onclick='employeeClickHandler(event);' onchange='employeeChangeHandler(event);'>";
				htmlText += "<option value='" + -1 + "'>" + "Select Employee" + "</option>";
				for(var count = 0;count < arrEmployee.length; count++)
				{
					var empItem = arrEmployee[count];
					if(parseInt(item[dataField]) === parseInt(empItem.employeeID))
					{
						htmlText += "<option value='" + empItem.employeeID + "' selected>" + empItem.employee + "</option>";	
					}
					else
					{
						htmlText += "<option value='" + empItem.employeeID + "'>" + empItem.employee + "</option>";
					}
				}
				htmlText += "</select>";*/
				cmbSelect = document.createElement("SELECT");
				cmbSelect.onclick = employeeClickHandler;
				cmbSelect.onchange = employeeGroupChangeHandler;
				cmbSelect.style.width = "100%";
				for(var count = 0;count < arrEmployee.length; count++)
				{
					var empItem = arrEmployee[count];
					if(parseInt(item[dataField]) === parseInt(empItem.employeeID))
					{
						htmlText += "<option value='" + empItem.employeeID + "' selected>" + empItem.employee + "</option>";	
					}
					else
					{
						htmlText += "<option value='" + empItem.employeeID + "'>" + empItem.employee + "</option>";
					}
					//htmlText += "<option value='" + empItem.employeeID + "'>" + empItem.employee + "</option>";
				}
				cmbSelect.innerHTML = htmlText;
			}
			return cmbSelect;
		}
		
		function employeeGroupRenderer(item,dataField,arrChildren,colIndex,row)
		{
			var htmlText = "";
			if(item && arrChildren && arrChildren.length > 0)
			{
				var arrEmployee = [];
				if(arrChildren[0].hasOwnProperty("employeeSrc") && arrChildren[0]["employeeSrc"])
				{
					arrEmployee = arrChildren[0]["employeeSrc"];
				}
				else if(arrChildren[0]["children"] && arrChildren[0]["children"].length > 0 && arrChildren[0]["children"][0].hasOwnProperty("employeeSrc") && arrChildren[0]["children"][0]["employeeSrc"])
				{
					arrEmployee = arrChildren[0]["children"][0]["employeeSrc"];
				}
				htmlText = "<select onclick='employeeClickHandler(event);' onchange='employeeGroupChangeHandler(event);'>";
				htmlText += "<option value='" + -1 + "'>" + "Select Employee" + "</option>";
				for(var count = 0;count < arrEmployee.length; count++)
				{
					var empItem = arrEmployee[count];
					if(parseInt(item[dataField]) === parseInt(empItem.employeeID))
					{
						htmlText += "<option value='" + empItem.employeeID + "' selected>" + empItem.employee + "</option>";	
					}
					else
					{
						htmlText += "<option value='" + empItem.employeeID + "'>" + empItem.employee + "</option>";
					}
					//htmlText += "<option value='" + empItem.employeeID + "'>" + empItem.employee + "</option>";
				}
				htmlText += "</select>";
			}
			return htmlText;
		}
		
		function employeeClickHandler(event)
		{
			event.stopImmediatePropagation();
		}
		
		function employeeGroupChangeHandler(event)
		{
			 var dgDemo = document.getElementById("dgDemo");
			 dgDemo.cascadeValues(event);
		}
		
		function employeeChangeHandler(event)
		{
			 var dgDemo = document.getElementById("dgDemo");
			 dgDemo.getItemInfo(event)["item"]["employeesID"] = event.target.value;
		}
		
		
		function setGroupChange(cascadeControl,childControl,item,dataField,cellIndex,colItem,cell,row)
		{
			var value = null;
			if(cascadeControl && childControl)
			{
				value = cascadeControl.value;
				childControl.value =  value;
			}
			return value;
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
		var xmlRevenueHierarchy = null;
		function loadHandler()
		{
			ns.onload(function()
			{
				var arrItems = [];
				var item = {};
				var count = 0;
				var dgDemo = document.getElementById("dgDemo");
				//var dgDemoDest = document.getElementById("dgDemoDest");
				var totalRecords = parseInt(dgDemo.getAttribute("totalRecords"));
				if(dgDemo.getAttribute("enablePagination") === "true" && dgDemo.getAttribute("paginationMode") === "manual")
				{
					totalRecords = 250;
				}
				var arrEmployee = [];
				for(count = 0;count < 10;count++)
				{
					var item = {};
					item.employee = "Employee " + (count + 1);
					item.employeeID = count;
					arrEmployee.push(item);
				}
				for(var count = 0;count < totalRecords;count++)
				{
					item = {id: count, hierarchy: 'Hierarchy ' + count, supervisor: "Supervisor " + count, country: 'UK', employeeSrc: arrEmployee, employeesID: getRandomInt(0,9), price: (10 * count), year: 1985 + count,checked:false};
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
				dgDemo.setColumn(column);
				//dgDemo.dataSource(flatDataSource);
				dgDemo.dataSource(arrItems);
				
				dgDemo.util.addEvent(dgDemo,dgDemo.ROW_SELECTED,itemSelectHandler);
				dgDemo.util.addEvent(dgDemo,dgDemo.ROW_UNSELECTED,itemUnSelectHandler);
				dgDemo.fixFixedHeader();
			});	
		}
		
		function getRandomInt(min, max) {
			  return Math.floor(Math.random() * (max - min + 1)) + min;
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
		
		function removeColumn()
		{
			var dgDemo = document.getElementById("dgDemo");
			//dgDemo.removeColumn(0);
			dgDemo.removeColumn("country");
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
		
	</script>
	<script>//<![CDATA[
	/*$(window).load(function(){
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
	});*/
	//]]> 
	</script>


<script>
//http://codepen.io/chriscoyier/pen/tIuBL
//https://spion.github.io/posts/intuitive-javascript-array-filtering-function.html
	
</script>
</body>
</html>
