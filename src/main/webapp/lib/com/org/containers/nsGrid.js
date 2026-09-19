"use strict";
var nsGrid = Object.create(nsContainerBase);

nsGrid.initializeComponent = function() 
{
	this.base.initializeComponent();
	this.GRID_TYPE_HIERARCHICAL = "hierarchical";
	this.GRID_TYPE_GROUP = "group";
	this.GRID_TYPE_NORMAL = "normal";
	this.ROW_SELECTED = "rowSelected";
	this.ROW_UNSELECTED = "rowUnselected";
	this.PAGINATION_TYPE_SCROLL = "scroll";
	this.PAGINATION_TYPE_PAGES = "pages";
	this.PAGINATION_MODE_AUTO = "auto";
	this.PAGINATION_MODE_MANUAL = "manual";
	this.RESPONSIVE_MODE_STACK = "stack";
	this.RESPONSIVE_MODE_COLUMN_TOGGLE = "columnToggle";
	this.ADVANCED_FILTER_TEXT = "text";
	this.ADVANCED_FILTER_NUMBER = "number";
	this.ADVANCED_FILTER_LIST = "list";
	
	this.__setting = {};
	this.__nsGrid = null;
};

nsGrid.setComponentProperties = function() 
{
	this.base.setComponentProperties();
	this.__setting = {};
	var item = {};
	for(var count = 0;count < this.attributes.length;count++)
	{
		item = this.attributes[count];
		this.__setting[item.name] = item.value;
	}
	var util = new NSUtil();
	util.addEvent(window,ns.NS_LOAD,this.__loadHandler.bind(this));
};

nsGrid.__loadHandler = function(event) 
{
	this.__nsGrid = new NSGrid(this,this.__setting);
};

nsGrid.propertyChange = function(attrName, oldVal, newVal, setProperty) 
{
	this.base.propertyChange(attrName, oldVal, newVal, setProperty);
};

nsGrid.componentResized = function(event) 
{
	this.__nsGrid.componentResized.call(this.__nsGrid,event);
	this.base.componentResized(event);
};

nsGrid.deviceViewChanged = function(conditionTrue,queryIndex,query) 
{
	this.__nsGrid.deviceViewChanged.call(this.__nsGrid,conditionTrue,queryIndex,query);
};

nsGrid.getState = function()
{
	return this.__nsGrid.getState.call(this.__nsGrid);
};

nsGrid.setState = function(data)
{
	if(this.__nsGrid)
	{
		this.__nsGrid.setState.call(this.__nsGrid);
	}
};

nsGrid.setColumn = function(arrColumns)
{
	if(this.__nsGrid)
	{
		this.__nsGrid.setColumn.call(this.__nsGrid,arrColumns);
	}
	else
	{
		this.__setting["columns"] = arrColumns;
	}
};

nsGrid.setContextMenuSetting = function(contextMenuSetting)
{
	this.__nsGrid.setContextMenuSetting.call(this.__nsGrid,contextMenuSetting);
};

nsGrid.dataSource = function(source,isInternalCall)
{
	this.__nsGrid.dataSource.call(this.__nsGrid,source,isInternalCall);
};

nsGrid.addRows = function(source)
{
	this.__nsGrid.addRows.call(this.__nsGrid,source);
};

nsGrid.removeRows = function(arrIndex)
{
	this.__nsGrid.addRows.call(this.__nsGrid,arrIndex);
};

nsGrid.groupBy = function(groupByField)
{
	this.__nsGrid.removeRows.call(this.__nsGrid,groupByField);
};

nsGrid.expandAll = function()
{
	this.__nsGrid.expandAll.call(this.__nsGrid);
};

nsGrid.collapseAll = function()
{
	this.__nsGrid.collapseAll.call(this.__nsGrid);
};

nsGrid.getRowInfo = function(row)
{
	return this.__nsGrid.getRowInfo.call(this.__nsGrid,row);
};

nsGrid.getCellInfo = function(cell)
{
	return this.__nsGrid.getCellInfo.call(this.__nsGrid,cell);
};

nsGrid.getItemInfo = function(objItem)
{
	return this.__nsGrid.getItemInfo.call(this.__nsGrid,objItem);
};

nsGrid.cascadeValues = function(event,callBack)
{
	this.__nsGrid.cascadeValues.call(this.__nsGrid,event,callBack);
};

nsGrid.setFontSize = function(fontSize)
{
	this.__nsGrid.setFontSize.call(this.__nsGrid,fontSize);
};

//assuming column is added at last
//if reposition then use swapColumn
nsGrid.addColumn = function(objColumn)
{
	return this.__nsGrid.addColumn.call(this.__nsGrid,objColumn);
};

//programmatic method to call deviceViewChanged
nsGrid.changeDeviceView = function(conditionTrue)
{
	this.deviceViewChanged(conditionTrue);
};

nsGrid.hideColumn = function(column)
{
	return this.__nsGrid.hideColumn.call(this.__nsGrid,column);
};

nsGrid.showColumn = function(column)
{
	return this.__nsGrid.showColumn.call(this.__nsGrid,column);
};

nsGrid.swapColumns = function(sourceColumn,destinationColumn)
{
	return this.__nsGrid.swapColumns.call(this.__nsGrid,sourceColumn,destinationColumn);
};

nsGrid.moveColumn = function(column,toIndex)
{
	return this.__nsGrid.moveColumn.call(this.__nsGrid,column,toIndex);
};

nsGrid.sortBy = function(column,isAscending)
{
	this.__nsGrid.sortBy.call(this.__nsGrid,column,isAscending);
};

nsGrid.updateRowByIndex = function(index)
{
	this.__nsGrid.updateRowByIndex.call(this.__nsGrid,index);
};

nsGrid.updateRowByKeyField = function(keyFieldValue)
{
	this.__nsGrid.updateRowByKeyField.call(this.__nsGrid,keyFieldValue);
};

nsGrid.updateCellByIndex = function(index,dataField)
{
	this.__nsGrid.updateCellByIndex.call(this.__nsGrid,index,dataField);
};

nsGrid.updateCellByKeyField = function(keyFieldValue,dataField)
{
	this.__nsGrid.updateCellByKeyField.call(this.__nsGrid,keyFieldValue,dataField);
};

nsGrid.filter = function(filter,setting,recordLimit)
{
	this.__nsGrid.filter.call(this.__nsGrid,filter,setting,recordLimit);
};

nsGrid.resetFilters = function()
{
	this.__nsGrid.resetFilters.call(this.__nsGrid);
};

nsGrid.highlightText = function(dataField,text)
{
	this.__nsGrid.highlightText.call(this.__nsGrid,dataField,text);
};

nsGrid.unHighlightText = function()
{
	this.__nsGrid.unHighlightText.call(this.__nsGrid);
};

//call this function if the Grid has Fixed Columns and the header calculation is not perfect due to external elements
//call this function after all the elements are rendered by javascript
nsGrid.fixFixedHeader = function()
{
	this.__nsGrid.fixFixedHeader.call(this.__nsGrid);
};

nsGrid.removeComponent = function()
{
	this.__nsGrid.removeComponent.call(this.__nsGrid);
	this.base.removeComponent();
};

nsGrid.showLoader = function()
{
	this.__nsGrid.showLoader();
};

nsGrid.hideLoader = function()
{
	this.__nsGrid.hideLoader();
};

document.registerElement("ns-grid", {prototype: nsGrid});