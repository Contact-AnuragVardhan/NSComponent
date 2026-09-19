/**Configuration options:
 * Grid Options:
 * 
 * enableToolTipForTruncateText (boolean)(defaultValue:false) : if this flag is true and truncateToFit is true for a column then toolTip will be shown as Custom ToolTip.
 * 																if this Flag is false and truncateToFit is true for a column then toolTip will be shown as Title.
 * 
 * enableVariableRowHeight (boolean) : if this flag is true then rows in the Grid will vary according to the height of the content.
 *                                     if this Flag is false the row will take the height of rowHeight if defined else 
 *                                     if virtual scroll is enabled then takes the calculated height of the row. 
 * 
 * Pagination Options:
 * For Infinite Scroll:
 * bottomPercentageForAddRows (integer) : percentage from the bottom of the view port that triggers the add rows for infinite scroll (defaultValue:15)
 * 
 * 
 * For Virtual Scroll Scroll:
 * enableVirtualScroll (boolean) : if this flag is true then virtual Scroll is enabled (defaultValue:false)
 * enableDataRefreshOnScrollEnd (boolean) : if this flag is true and enableVirtualScroll is true then data is refreshed when user stops scrolling 
 * 											(recommended when data is huge and view port height is very limited) (defaultValue:false)
 * dataRefreshfireDelay (integer) : delay the subsequent data Refresh after scroll ends if enableDataRefreshOnScrollEnd is true , in milliseconds
 *                                  if no delay is required the set the value to 0 (defaultValue:100)
 *                                  
 *                                  
 * Column Related Properties:
 * 
 * headerText :   Mandatory Field. Text for the header of this column.
 * dataField:  Mandatory Field. The name of the field or property in the data provider item associated with the column.
 * sortField: The name of the field or property in the data provider item on which column should be sorted.
 * toolTipField : The name of the field or property in the data provider item on which toolTip should be shown for the column.
 * width: The width of the column
 * sortable: A flag that indicates whether the user can click on the header of this column to sort the data provider.
 * resizable:  A flag that indicates whether the user is allowed to resize the width of the column.
 * draggable:  A flag that indicates whether the user is allowed to drag the column to a new position If true, the user can drag the the column headers to a new position
 * minWidth : The minimum width of the column.
 * sortDescending: Indicates whether the column sort is in ascending order, false, or descending order, true.
 * labelFunction :  A function that determines the text to display in this column.
 * toolTipRenderer : A function that determines the text to display as toolTip in this column.
 * itemRenderer:  A function for item renderer instances that display the data for each item in the column.
 * template: represents a template for rendering the cell.
 * setData: A function which gets called for setting the data in a cell when template is defined.
 * headerTemplate : represents a template for rendering the header.
 * filterRenderer: A function that returns HTML for  the filter on the column.
 * groupRenderer: A function that returns HTML for  the Group Renderer  on the column if grid is in Grouping Mode.
 * headerTruncateToFit: : If this property is true, and the header cell size is smaller than its text, the text of the header cell is truncated using a localizable string, such as "...".
 * truncateToFit: If this property is true, and the cell size is smaller than its text, the text of the cell is truncated using a localizable string, such as "...".
 * showMenu: If this property is true, this shows the column level Menu
 * priority: It sets the priority for the column to be visible if Grids  enableResponsive property is true and responsiveMode is columnToggle 
 * 
 */

"use strict";
var nsGrid = Object.create(nsContainerBase);

nsGrid.initializeComponent = function() 
{
	this.base.initializeComponent();
	this.GRID_TYPE_HIERARCHICAL = "hierarchical";
	this.GRID_TYPE_GROUP = "group";
	this.GRID_TYPE_NORMAL = "normal";
	this.ITEM_UNSELECTED = "itemUnselected";
	this.ITEM_SELECTED = "itemSelected";
	this.ITEM_UNSELECTED = "itemUnselected";
	this.PAGINATION_TYPE_SCROLL = "scroll";
	this.PAGINATION_TYPE_PAGES = "pages";
	this.PAGINATION_MODE_AUTO = "auto";
	this.PAGINATION_MODE_MANUAL = "manual";
	this.RESPONSIVE_MODE_STACK = "stack";
	this.RESPONSIVE_MODE_COLUMN_TOGGLE = "columnToggle";
	this.ADVANCED_FILTER_TEXT = "text";
	this.ADVANCED_FILTER_NUMBER = "number";
	this.ADVANCED_FILTER_LIST = "list";
	//this.initializeDOM(ns.NSDATAGRID_CSS);
	
	this.__OUTER_CONTAINER_ID = "divDataSet";
	this.__TITLE_CONTAINER_ID = "divTitleBar";
	this.__TABLE_HEADER_CONTAINER_WRAPPER_ID = "divHeaderContainerWrapper";
	this.__TABLE_BODY_CONTAINER_WRAPPER_ID = "divBodyContainerWrapper";
	this.__TABLE_LEFT_HEADER_CONTAINER_ID = "divLeftHeaderContainer";
	this.__TABLE_LEFT_HEADER_ID = "tblLeftHeader";
	this.__TABLE_LEFT_BODY_CONTAINER_ID = "divLeftBodyContainer";
	this.__TABLE_LEFT_BODY_ID = "tblLeftBody";
	this.__TABLE_CENTER_HEADER_CONTAINER_ID = "divCenterHeaderContainer";
	this.__TABLE_CENTER_HEADER_ID = "tblCenterHeader";
	this.__TABLE_CENTER_BODY_CONTAINER_ID = "divCenterBodyContainer";
	this.__TABLE_CENTER_BODY_ID = "tblCenterBody";
	this.__TABLE_RIGHT_HEADER_CONTAINER_ID = "divRightHeaderContainer";
	this.__TABLE_RIGHT_HEADER_ID = "tblRightHeader";
	this.__TABLE_RIGHT_BODY_CONTAINER_ID = "divRightBodyContainer";
	this.__TABLE_RIGHT_BODY_ID = "tblRightBody";
	this.__PAGINATION_CONTROL_ID = "divPagination";
	
	this.__CLASS_TABLE = "nsDataGridTable";
	this.__CLASS_TITLEBAR = "nsDataGridTitleBar";
	this.__CLASS_TABLE_HEADER_CELL = "nsDataGridHeader";
	this.__CLASS_TABLE_HEADER_DROPPABLE_CELL = "nsDataGridDroppableHeader";
	this.__CLASS_BODY_CONTAINER = "nsDataGridBodyContainer";
	this.__CLASS_ODD_ROW = "nsDataGridOddRow";
	this.__CLASS_EVEN_ROW = "nsDataGridEvenRow";
	this.__CLASS_GROUP_CELL = "nsGroupCell";
	this.__CLASS_CELL_CHILD = "nsCellChild";
	
	this.__DEFAULT_COLUMN_WIDTH = 100;
	this.__INFINITE_SCROLL_PADDING = 40;
	this.__INFINITE_SCROLL_INITIAL_LOAD = 250;
	
	this.__columns = [];
	this.__orignalColumns = [];
	this.__selectedItems = [];
	
	this.__title = null;
	this.__type = this.GRID_TYPE_NORMAL;
	this.__dataSource = [];
	this.__enableHierarchical = false;
	this.__enableGrouping = false;
	this.__enableMouseHover = false;
	this.__enableMultiSelection = false;
	this.__customScrollerRequired = false;
	this.__columnResizable = false;
	this.__columnDraggable = false;
	this.__enableContextMenu = false;
	this.__enableVariableRowHeight = false;
	this.__enableFilter = false;
	this.__enableAdvancedFilter = false;
	this.__enableToolTipForTruncateText = false;
	this.__childField = "children";
	this.__rowKeyField = null;
	this.__isParentRowField = "ns-isParentRow";
	this.__groupByField = null;
	this.__columnMinWidth = 50;
	this.__pageSize = 50;
	this.__rowHeight = -1;
	this.__noDataMessage = "No matching records found";
	//stores initial Column Count 
	this.__initialColumnCount = 0;
	this.__initialTableWidth = 0;
	this.__enablePagination = false;
	this.__enableVirtualScroll = false;
	this.__enableDataRefreshOnScrollEnd = false;
	this.__enableServerCall = false;
	this.__enableExport = false;
	this.__enableResponsive = false;
	this.__isPaginationTypeScroll = true;
	this.__isPaginationModeAuto = true;
	
	this.__isResponsiveModeStack = true;
	this.__isResponsiveModeColumnToggle = false;
	this.__totalRecords = 0;
	this.__contextMenuProvider = null;
	this.__contextMenuSetting = null;
	this.__responsiveMode = this.RESPONSIVE_MODE_STACK;
	this.__fetchRecordCallBack = null;
	//for Virtual Scroll
	this.__virtualRowHeight = 0;
	this.__rowCount = 0;
	this.__extraRowCountForVariableHeight = 20;
	this.__scrollOffsetPosition = 0;
	this.__lastScrollPosition = 0;
	this.__lastItemBegin = -1;
	this.__lastItemEnd = -1;
	this.__virtualDataRefreshInterval = -1;
	this.__virtualScrollEndInterval = -1;
	this.__dataRefreshfireDelay = 100;
	this.__divVirtualScrollParent = null;
	this.__divVirtualScroller = null;
	
	this.__divOuterContainer = null;
	this.__divTableWrapper = null;
	this.__divTableHeaderContainerWrapper = null;
	this.__divTableBodyContainerWrapper = null;
	this.__divCenterTableHeaderContainer = null;
	this.__tblCenterHeader = null;
	this.__divCenterTableBodyContainer = null;
	this.__tblCenterBody = null;
	this.__tblCenterBodyBody = null;
	//stores whether mouse is on GridLine
	this.__onGridLine = false;
	this.__addRemoveRowCallInternal = false;
	//cell which is being resized
	this.__resizingHeader = null;
	this.__resizingHeaderCell = null;
	this.__resizingBodyCell = null;
	this.__resizeHandler = null;
	
	this.__bodyScrollPos = 0;
	//for Page type Pagination
	this.__nsPagination = null;
	//for Infinite Scroll Pagination
	this.__bottomPercentageForAddRows = 15;
	this.__processArrayAsync = null;
	this.__rowsRendered = false;
	this.__stopScroll = false;
	this.__lastScrollPos = [0,0];
	//for Fixed Column 
	this.__leftFixedColumn = 0;
	this.__rightFixedColumn = 0;
	this.__enableFixedColumnAnimation = false;
	this.__arrFixedLeftCells = [];
	this.__arrFixedRightCells = [];
	this.__fixedTimerTimeout = -1;
	//for Row Mover
	this.__enableRowMove = false;
	this.__isSameTableMove = false;
	this.__rowMoverDropEndHandler = null;
	//flag to figure out that text of cell is cached or not
	//generally for IE this should be true to improve performance except when we are using Virtual scrolling
	this.__renderInCachedMode = false;
	
	this.__loader = null;
	this.__scroller = null;
	this.__groupCollection = null;
	this.__groupSource = null;
	this.__contextMenu = null;
	this.__exportMenu = null;
	this.__exportFileName = null;
	this.__exportMenuDataSource = [{id: 0,title: 'XLS',iconHTML: '<i class="fa fa-file-excel-o fa-lg"></i>'},
	                               {id: 1,title: 'CSV',iconHTML: '<i class="fa fa-file-excel-o fa-lg"></i>',separatorBelow:true},
	                               {id: 2,title: 'DOC',iconHTML: '<i class="fa fa-file-word-o fa-lg"></i>'},
	                               {id: 3,title: 'TEXT',iconHTML: '<i class="fa fa-file-text-o fa-lg"></i>',separatorBelow:true},
	                               {id: 4,title: 'XML',iconHTML: '<i class="fa fa-file-code-o fa-lg"></i>'},
	                               {id: 5,title: 'JSON',iconHTML: '<i class="fa fa-file-o" fa-lg></i>',separatorBelow:true},
	                               {id: 6,title: 'PDF',iconHTML: '<i class="fa fa-file-pdf-o fa-lg"></i>'},
	                               {id: 7,title: 'IMAGE',iconHTML: '<i class="fa fa-file-picture-o fa-lg"></i>',separatorBelow:true},
	                               {id: 8,title: 'XLSX',iconHTML: '<i class="fa fa-file-excel-o fa-lg"></i>'},
	                               {id: 9,title: 'DOCX',iconHTML: '<i class="fa fa-file-word-o fa-lg"></i>'}];
	this.__imgUtil = null;
	this.__arrWrapper = null;
	this.__arrInternalSource = null;
	this.__arrFlatHierarchicalSource = [];
	this.__fieldIndex = this.getID() + "_row_index";
	this.__fieldRow = this.getID() + "_row";
	this.__fieldRowHtml = this.getID() + "_row";
	this.__fieldRowLevel = this.getID() + "_row_level";
	this.__fieldRowVisible = this.getID() + "_row_visible";
	this.__fieldParentIndex = this.getID() + "_parent_index";
	this.__fieldHasChild = this.getID() + "_row_hasChild";
	this.__fieldHasParent = this.getID() + "_row_hasParent";
	this.__fieldIsCollapsed = this.getID() + "_row_isCollapsed";
	this.__fieldRowArrow = this.getID() + "row_arrow";
	this.__fieldCellText = this.getID() + "cell_text";
	this.__fieldColIndex = this.getID() + "_col_index";
	this.__fieldColSortedAsc = this.getID() + "_col_sorted_asc";
	this.__fieldColVisible = this.getID() + "_col_visible";
	
	this.__headerClickRef = null;
	this.__headerMouseOverRef = null;
	this.__headerMouseOutRef = null;
	this.__headerMouseMoveRef = null;
	this.__headerMouseDownRef = null;
	this.__doResizeRef = null;
	this.__endResizeRef = null;
	this.__synchronizeTablesRef = null;
	this.__divCenterTableBodyMouseUpRef = null;
	this.__bodyScrollRef = null;
	
	this.__objGrid = null;
	this.__nsGridColumnMove = null;
	this.__nsGridSort = null;
	this.__nsGridFilter = null;
	this.__nsToolTipInElement = null;
};

nsGrid.setComponentProperties = function() 
{
	this.base.setComponentProperties();
	if(this.hasAttribute("nsTitle"))
	{
		this.__title = this.getAttribute("nsTitle");
	}
	if(this.hasAttribute("type"))
	{
		this.__type = this.getAttribute("type");
	}
	if(this.hasAttribute("enableMouseHover"))
	{
		this.__enableMouseHover = Boolean.parse(this.getAttribute("enableMouseHover"));
	}
	if(this.hasAttribute("enableMultiSelection"))
	{
		this.__enableMultiSelection = Boolean.parse(this.getAttribute("enableMultiSelection"));
	}
	if(this.hasAttribute("childField"))
	{
		this.__childField = this.getAttribute("childField");
	}
	if(this.hasAttribute("rowKeyField"))
	{
		this.__rowKeyField = this.getAttribute("rowKeyField");
	}
	else
	{
		this.__rowKeyField = this.__fieldIndex;
	}
	if(this.hasAttribute("groupByField"))
	{
		this.__groupByField = this.getAttribute("groupByField");
	}
	if(this.hasAttribute("columnMinWidth"))
	{
		this.__columnMinWidth = this.getAttribute("columnMinWidth");
	}
	if(this.hasAttribute("customScrollerRequired"))
	{
		this.__customScrollerRequired =  Boolean.parse(this.getAttribute("customScrollerRequired"));
	}
	if(this.hasAttribute("columnResizable"))
	{
		this.__columnResizable =  Boolean.parse(this.getAttribute("columnResizable"));
	}
	if(this.hasAttribute("columnDraggable"))
	{
		this.__columnDraggable = Boolean.parse(this.getAttribute("columnDraggable"));
	}
	if(this.hasAttribute("enablePagination"))
	{
		this.__enablePagination = Boolean.parse(this.getAttribute("enablePagination"));
	}
	if(this.hasAttribute("paginationType"))
	{
		this.__paginationType = this.getAttribute("paginationType");
	}
	if(this.hasAttribute("paginationMode"))
	{
		this.__paginationMode =  this.getAttribute("paginationMode");
	}
	if(this.hasAttribute("enableAsyncLoadPagination"))
	{
		this.__enableAsyncLoadPagination = Boolean.parse(this.getAttribute("enableAsyncLoadPagination"));
	}
	if(this.hasAttribute("pageSize"))
	{
		this.__pageSize = parseInt(this.getAttribute("pageSize"));
	}
	if(this.hasAttribute("totalRecords"))
	{
		this.__totalRecords =  parseInt(this.getAttribute("totalRecords"));
	}
	if(this.hasAttribute("fetchRecordCallBack"))
	{
		this.__fetchRecordCallBack =  this.getAttribute("fetchRecordCallBack");
		this.__fetchRecordCallBack = this.util.getFunction(this.__fetchRecordCallBack);
	}
	if(this.hasAttribute("enableContextMenu"))
	{
		this.__enableContextMenu = Boolean.parse(this.getAttribute("enableContextMenu"));
	}
	if(this.hasAttribute("contextMenuProvider"))
	{
		this.__contextMenuProvider =  this.getAttribute("contextMenuProvider");
		this.__contextMenuProvider = this.util.getFunction(this.__contextMenuProvider);
	}
	if(this.hasAttribute("enableFilter"))
	{
		this.__enableFilter = Boolean.parse(this.getAttribute("enableFilter"));
	}
	if(this.hasAttribute("enableAdvancedFilter"))
	{
		this.__enableAdvancedFilter = Boolean.parse(this.getAttribute("enableAdvancedFilter"));
	}
	if(this.hasAttribute("enableVirtualScroll"))
	{
		this.__enableVirtualScroll = Boolean.parse(this.getAttribute("enableVirtualScroll"));
	}
	if(this.hasAttribute("enableDataRefreshOnScrollEnd"))
	{
		this.__enableDataRefreshOnScrollEnd = Boolean.parse(this.getAttribute("enableDataRefreshOnScrollEnd"));
	}
	if(this.hasAttribute("dataRefreshfireDelay") && parseInt(this.getAttribute("dataRefreshfireDelay")) > -1)
	{
		this.__dataRefreshfireDelay = parseInt(this.getAttribute("dataRefreshfireDelay"));
	}
	if(this.hasAttribute("bottomPercentageForAddRows") && parseInt(this.getAttribute("bottomPercentageForAddRows") > 0))
	{
		this.__bottomPercentageForAddRows = parseInt(this.getAttribute("bottomPercentageForAddRows"));
	}
	if(this.hasAttribute("enableServerCall"))
	{
		this.__enableServerCall = Boolean.parse(this.getAttribute("enableServerCall"));
	}
	if(this.hasAttribute("rowHeight"))
	{
		this.__rowHeight =  parseInt(this.getAttribute("rowHeight"));
	}
	if(this.hasAttribute("enableExport"))
	{
		this.__enableExport =  Boolean.parse(this.getAttribute("enableExport"));
	}
	if(this.hasAttribute("exportFileName"))
	{
		this.__exportFileName = this.getAttribute("exportFileName");
	}
	if(this.hasAttribute("enableResponsive"))
	{
		this.__enableResponsive =  Boolean.parse(this.getAttribute("enableResponsive"));
	}
	if(this.hasAttribute("responsiveMode"))
	{
		this.__responsiveMode = this.getAttribute("responsiveMode");
	}
	if(this.hasAttribute("noDataMessage"))
	{
		this.__noDataMessage = this.getAttribute("noDataMessage");
	}
	if(this.hasAttribute("leftFixedColumn"))
	{
		this.__leftFixedColumn =  parseInt(this.getAttribute("leftFixedColumn"));
	}
	if(this.hasAttribute("rightFixedColumn"))
	{
		this.__rightFixedColumn =  parseInt(this.getAttribute("rightFixedColumn"));
	}
	if(this.hasAttribute("enableFixedColumnAnimation"))
	{
		this.__enableFixedColumnAnimation =  Boolean.parse(this.getAttribute("enableFixedColumnAnimation"));
	}
	if(this.hasAttribute("enableRowMove"))
	{
		this.__enableRowMove =  Boolean.parse(this.getAttribute("enableRowMove"));
	}
	if(this.hasAttribute("isSameTableMove"))
	{
		this.__isSameTableMove =  Boolean.parse(this.getAttribute("isSameTableMove"));
	}
	if(this.hasAttribute("rowMoverDropEndHandler"))
	{
		this.__rowMoverDropEndHandler = this.getAttribute("rowMoverDropEndHandler");
		this.__rowMoverDropEndHandler = this.util.getFunction(this.__rowMoverDropEndHandler);
	}
	if(this.hasAttribute("renderInCachedMode"))
	{
		this.__renderInCachedMode =  Boolean.parse(this.getAttribute("renderInCachedMode"));
	}
	if(this.hasAttribute("enableVariableRowHeight"))
	{
		this.__enableVariableRowHeight =  Boolean.parse(this.getAttribute("enableVariableRowHeight"));
	}
	if(this.hasAttribute("enableToolTipForTruncateText"))
	{
		this.__enableToolTipForTruncateText =  Boolean.parse(this.getAttribute("enableToolTipForTruncateText"));
	}
	this.__setGridType();
	this.__objGrid.__initialize();
	this.__setPaginationType();
	this.__setPaginationMode();
	this.__setResponsiveMode();
	this.__checkForVirtualMode();
	this.__addSVGInPage();
	this.__addStyleInDOM();
};

nsGrid.propertyChange = function(attrName, oldVal, newVal, setProperty) 
{
	if(setProperty)
	{
		this.__objGrid.propertyChange(attrName, oldVal, newVal, setProperty);
	}
	this.base.propertyChange(attrName, oldVal, newVal, setProperty);
};

nsGrid.componentResized = function(event) 
{
	this.__setMeasurement();
	this.__renderBody(false);
	this.base.componentResized(event);
};

nsGrid.deviceViewChanged = function(conditionTrue,queryIndex,query) 
{
	queryIndex = parseInt(queryIndex);
	//console.log(conditionTrue,queryIndex);
	/*if(queryIndex < 0)
	{
		queryIndex = 0;
	}*/
	if(this.__isResponsiveModeStack)
	{
		if(conditionTrue)
		{
			this.util.addStyleClass(this,"nsMobileStackGrid");
		}
		else
		{
			this.util.removeStyleClass(this,"nsMobileStackGrid");
		}
	}
	else if(this.__isResponsiveModeColumnToggle)
	{
		var className = "nsMobileColumnToggleGrid";
		var postFix = "";
		switch(queryIndex)
		{
			case 0:
				postFix = ">960";
				break;
			case 1:
				postFix = "960";
				break;
			case 2:
				postFix = "800";
				break;
			case 3:
				postFix = "640";
				break;
			case 4:
				postFix = "480";
				break;
			case 5:
				postFix = "320";
				break;
		}
		var base = this;
		var reset = function()
		{
			base.util.removeStyleClass(base,"nsMobileColumnToggleGrid960");
			base.util.removeStyleClass(base,"nsMobileColumnToggleGrid800");
			base.util.removeStyleClass(base,"nsMobileColumnToggleGrid640");
			base.util.removeStyleClass(base,"nsMobileColumnToggleGrid480");
			base.util.removeStyleClass(base,"nsMobileColumnToggleGrid320");
		};
		if(postFix)
		{
			reset();
			if(postFix != ">960" && conditionTrue)
			{
				this.util.addStyleClass(this,className + postFix);
			}
		}
	}
	this.base.deviceViewChanged(conditionTrue,query);
};

nsGrid.getState = function()
{
	var data = {};
	data.columns = this.__columns;
	return data;
};

nsGrid.setState = function(data)
{
	if(data)
	{
		if(data["columns"] && data["columns"].length > 0)
		{
			this.__createColumnProvider(data["columns"]);
		}
	}
};

nsGrid.setColumn = function(arrColumns)
{
	//moving __initializePluggins here to ensure that the Pluggins are downloaded and then they are initialized
	this.__initializePluggins();
	if(arrColumns && arrColumns.length > 0)
	{
		this.__orignalColumns = arrColumns;
		this.__objGrid.__checkForAdditionalColumns();
		for(var count = 0;count < this.__orignalColumns.length;count++)
		{
			var item = this.__orignalColumns[count];
			this.__processColumnObject(item,count);
		}
	}
	else
	{
		this.__orignalColumns = [];
	}
	this.__columns = this.__orignalColumns.slice(0);
};

nsGrid.setContextMenuSetting = function(contextMenuSetting)
{
	this.__contextMenuSetting = contextMenuSetting;
};

nsGrid.dataSource = function(source,isInternalCall)
{
	var start = new Date().getTime();
	this.__dataSource = source;
	this.__rowsRendered = false;
	this.__createStructure();
	this.__addColumnPseudoStyle();
	if(this.__dataSource && this.__dataSource.length > 0)
	{
		this.__objGrid.dataSource();
	}
	else
	{
		this.__arrWrapper = [];
		this.__arrInternalSource = [];
		this.__updateTotalRecords(0);
	}
	this.__setMeasurement();
	if(isInternalCall)
	{
		this.__nsGridSort.reset();
	}
	this.__setHeaderSortFunction();
	if(isInternalCall || !this.__processDefaultSort())
	{
		this.__renderBody(false);
	}
	this.__handleHiddenColumn();
	this.__addRowHeightInDOM();
	
	//this.style.display = "";
	var end = new Date().getTime();
	var time = end - start;
	/*
	var dragResizeSetting = {element:this,
			dragEnabled:true,
			resizeEnabled:true,
			minWidth:100,
			minHeight:100};
	this.__nsDragResizeElements = new this.util.nsDragResizeElements(dragResizeSetting);*/
	console.log('Execution time: ' + (time / 1000.0));
};

nsGrid.addRows = function(source)
{
	this.__stopScroll = true;
	if(source && source.length > 0)
	{
		var startIndex = this.__arrInternalSource.length;
		if(!this.__addRemoveRowCallInternal)
   	 	{
			this.__objGrid.__setWrapperSource(source,startIndex);
   	 	}
		this.__arrInternalSource = this.__arrInternalSource.concat(source);
		this.__createBodyBody(this.__arrInternalSource,startIndex,this.__arrInternalSource.length);
   	 	if(!this.__addRemoveRowCallInternal)
   	 	{
   	 		this.__arrWrapper = this.__arrWrapper.concat(source);
   	 		this.__updateTotalRecords();
   	 	}
   	 	this.__addRemoveRowCallInternal = false;
	}
	this.__stopScroll = false;
};

nsGrid.removeRows = function(arrIndex)
{
	if(!this.__enableHierarchical && !this.__enableGrouping && arrIndex && arrIndex.length > 0)
	{
		arrIndex.sort();
   	 	for (var rowIndex = arrIndex.length - 1; rowIndex >= 0; rowIndex--)
	    {
   	 		var index = arrIndex[rowIndex];
   	 		if(index > 0 && index < this.__arrInternalSource.length)
   	 		{
	   	 		//if virtual scroll or Pagination of type Page is enabled then do not remove rows
	   	 		if(!(this.__enableVirtualScroll || (this.__enablePagination && !this.__isPaginationTypeScroll)))
	   	 		{
	   	 			this.__tblCenterBodyBody.deleteRow(index);
	   	 		}
	   	 		this.__arrInternalSource.splice(index, 1);
	   	 		this.__arrWrapper.splice(index, 1);
   	 		}
	    }
   	 	if(!this.__addRemoveRowCallInternal)
	 	{
	 		this.__updateTotalRecords();
	 	}
	 	this.__addRemoveRowCallInternal = false;
	}
};

nsGrid.groupBy = function(groupByField)
{
	if(this.__enableGrouping && groupByField && groupByField.length > 0)
	{
		this.setAttribute("groupByField",groupByField);
	}
};

nsGrid.expandAll = function()
{
	if(this.__enableHierarchical || this.__enableGrouping)
	{
		this.__expandCollapseAll(false);
	}
};

nsGrid.collapseAll = function()
{
	if(this.__enableHierarchical || this.__enableGrouping)
	{
		this.__expandCollapseAll(true);
	}
};

nsGrid.getRowInfo = function(row)
{
	if(row)
	{
		var objInfo = {};
		objInfo.rowIndex = parseInt(row.getAttribute("ns-index"));
		objInfo.rowLevel = parseInt(row.getAttribute("ns-level"));
		objInfo.rowParentIndex = parseInt(row.getAttribute("ns-parent-index"));
		objInfo.item = this.__getItemByIndex(objInfo.rowIndex);
		return objInfo;
	}
	return null;
};

nsGrid.getCellInfo = function(cell)
{
	if(cell)
	{
		var objInfo = {};
		var row = this.util.findParent(cell,"TR");
		if(row)
		{
			objInfo = this.getRowInfo(row);
			objInfo.row = row;
			objInfo.cellIndex = cell.cellIndex;
			return objInfo;
		}
	}
	return null;
};

nsGrid.getItemInfo = function(objItem)
{
	var objReturn = null;
	if(objItem)
	{
		var target = null;
		var event = this.util.getEvent(objItem);
		/*if(objItem instanceof Event || (objItem.hasOwnProperty("originalEvent") && objItem["originalEvent"] instanceof Event))
		{
			target = this.util.getTarget(objItem["originalEvent"]);
		}
		//IE Specific
		else if(objItem instanceof PointerEvent)
		{
			target = this.util.getTarget(objItem["originalEvent"]);
		}*/
		if(event)
		{
			target = this.util.getTarget(event);
		}
		else
		{
			target = objItem;
		}
		if(target && this.util.isElement(target))
		{
			if(this.util.isElementOfType(target,"TR"))
			{
				objReturn = this.getRowInfo(target);
			}
			else if(this.util.isElementOfType("TD"))
			{
				objReturn = this.getCellInfo(target);
			}
			else
			{
				target = this.util.findParent(target,"TD");
				objReturn = this.getCellInfo(target);
			}
				
		}
	}
	return objReturn;
};

nsGrid.cascadeValues = function(event,callBack)
{
	if(this.__enableGrouping)
	{
		var control = this.util.getTarget(event);
		var cell = this.util.findParent(control,"TD");
		var objCellInfo = this.getCellInfo(cell);
		var row = objCellInfo.row;
		var cellIndex = objCellInfo.cellIndex;
		var colItem = this.__columns[cellIndex];
		var dataField = colItem.dataField;
		var cascadeValue = this.util.getControlValue(control);
		var flatSource = this.__objGrid.__getFlatSource();
		var groupItem = flatSource[objCellInfo.rowIndex - 1];
		if(groupItem)
		{
			groupItem[dataField] = cascadeValue;
		}
		for(var count = objCellInfo.rowIndex;count < flatSource.length;count ++)
		{
			var item = flatSource[count];
			var childRow = item[this.__fieldRow];
			if(item[this.__fieldRowLevel] !== objCellInfo.rowLevel)
			{
				var isSuccess = false;
				var setValue = null;
				if(childRow)
				{
					var childCell = childRow.cells[cellIndex];
					if(childCell.getElementsByTagName(control.tagName).length > 0)
					{
						var childControl = childCell.getElementsByTagName(control.tagName)[0];
						if(childControl)
						{
							if(callBack)
							{
								setValue = callBack(control,childControl,item,dataField,cellIndex,colItem,childCell,row);
								isSuccess = true;
							}
							else
							{
								setValue = this.util.setControlValue(childControl,cascadeValue);
								isSuccess = true;
							}
						}
					}
				}
				else
				{
					setValue = cascadeValue;
					isSuccess = true;
				}
				if(isSuccess)
				{
					item[dataField] = setValue;
				}
			}
			else
			{
				break;
			}
		}
	}
};

nsGrid.setFontSize = function(fontSize)
{
	if(this.__tblCenterHeader)
	{
		this.__tblCenterHeader.style.fontSize = fontSize;
	}
	if(this.__tblCenterBody)
	{
		this.__tblCenterBody.style.fontSize = fontSize;
	}
};

//assuming column is added at last
//if reposition then use swapColumn
nsGrid.addColumn = function(objColumn)
{
	if(objColumn)
	{
		this.__processColumnObject(objColumn,this.__columns.length);
		if(!this.__isColumnExist(objColumn["dataField"]))
		{
			this.__editColumnArray("add",objColumn);
			if(this.__tblCenterHeader && this.__tblCenterHeader.tHead && this.__tblCenterHeader.tHead.rows && this.__tblCenterHeader.tHead.rows.length > 0)
			{
				var headerRow = this.__tblCenterHeader.tHead.rows[0];
				if(this.__tblCenterHeader.tBodies && this.__tblCenterHeader.tBodies.length > 0 && this.__tblCenterHeader.tBodies[0].rows && this.__tblCenterHeader.tBodies[0].rows.length > 0)
				{
					var headerBodyRow = this.__tblCenterHeader.tBodies[0].rows[0];
					var rendererRow = this.__tblCenterHeader.tBodies[0].rows[1];
					this.__createHeaderHeaderCell(objColumn,headerRow);
				    this.__createHeaderBodyCell(objColumn,headerBodyRow,rendererRow,this.__columns.length - 1);
				}
			}
			if(this.__tblCenterBody && this.__tblCenterBody.tHead && this.__tblCenterBody.tHead.rows && this.__tblCenterBody.tHead.rows.length > 0)
		    {
				var bodyRow = this.__tblCenterBody.tHead.rows[0];
		    	if(this.__tblCenterBody.tBodies && this.__tblCenterBody.tBodies.length > 0 && this.__tblCenterBody.tBodies[0].rows && this.__tblCenterBody.tBodies[0].rows.length > 0)
				{
		    		var arrRows = this.__tblCenterBody.tBodies[0].rows;
		    		var arrItems = this.__arrInternalSource;
		    		this.__createBodyHeaderCell(objColumn,bodyRow);
		    		var row = null;
		    		var item = null;
		    		for (var rowCount = 0; rowCount < arrRows.length; rowCount++) 
		    		{
		    			row = arrRows[rowCount];
		    			item = arrItems[rowCount];
		    			var cell = this.__createBodyRowCell(row);
		    			this.__setBodyCellProperty(row,cell,item,objColumn,this.__columns.length - 1,-1,0,true);
		    	    }
				}
		    }
			this.__alignTables(false);
			this.__setHeaderSortFunctionForItem(objColumn);
			this.__addColumnPseudoStyle();
		}
		else
		{
			this.showColumn(objColumn["dataField"]);
		}
		return true;
	}
	this.util.warning("nsGrid","Please pass valid Column object to be added.");
	return false;
};

//programmatic method to call deviceViewChanged
nsGrid.changeDeviceView = function(conditionTrue)
{
	this.deviceViewChanged(conditionTrue);
};

nsGrid.hideColumn = function(column)
{
	var index = this.__getColumnIndexForSwapOrRemove(column);
	if(index > -1)
	{
		if(this.__isColumnValidForSwapOrRemove(index,"hidden"))
		{
			//this.__removeHeaderCell(index);
			//this.__removeBodyColumn(index);
			this.__editColumnArray("hide",index);
			this.__setColumnVisibility(index,false);
			this.__alignTables(false);
			this.__addColumnPseudoStyle();
			return true;
		}
	}
	return false;
};

nsGrid.showColumn = function(column)
{
	var index = this.__getColumnIndexForSwapOrRemove(column);
	if(index > -1)
	{
		this.__editColumnArray("show",index);
		this.__setColumnVisibility(index,true);
		return true;
	}
	return false;
};

nsGrid.swapColumns = function(sourceColumn,destinationColumn)
{
	var sourceIndex = this.__getColumnIndexForSwapOrRemove(sourceColumn);
	var destinationIndex = this.__getColumnIndexForSwapOrRemove(destinationColumn);
	if(sourceIndex > -1 && destinationIndex > -1)
	{
		var sourceValid = this.__isColumnValidForSwapOrRemove(sourceIndex,"swapped");
		var destinationValid = this.__isColumnValidForSwapOrRemove(destinationIndex,"swapped");
		if(sourceValid && destinationValid)
		{
			this.__swapOrMoveHeaderCell("swap",sourceIndex,destinationIndex);
			this.__swapOrMoveBodyCell("swap",sourceIndex,destinationIndex);
			this.__alignTables(false);
			this.__columns[sourceIndex][this.__fieldColIndex] = destinationIndex;
			this.__columns[destinationIndex][this.__fieldColIndex] = sourceIndex;
			this.util.swapArrayItems(this.__columns,sourceIndex,destinationIndex);
			this.__addColumnPseudoStyle();
			return true;
		}
	}
	return false;
};

nsGrid.moveColumn = function(column,toIndex)
{
	var sourceIndex = this.__getColumnIndexForSwapOrRemove(column);
	var toIndex = this.__getColumnIndexForSwapOrRemove(toIndex);
	if(sourceIndex > -1 && toIndex > -1 && sourceIndex !== toIndex)
	{
		var sourceValid = this.__isColumnValidForSwapOrRemove(sourceIndex,"moved");
		var destinationValid = this.__isColumnValidForSwapOrRemove(toIndex,"moved");
		if(sourceValid && destinationValid)
		{
			this.__swapOrMoveHeaderCell("move",sourceIndex,toIndex);
			this.__swapOrMoveBodyCell("move",sourceIndex,toIndex);
			this.__alignTables(false);
			this.__columns[sourceIndex][this.__fieldColIndex] = toIndex;
			this.util.moveArrayItem(this.__columns,sourceIndex,toIndex);
			var smallIndex = Math.min(sourceIndex,toIndex);
			for(var count = smallIndex;count < this.__columns.length;count++)
			{
				this.__columns[count][this.__fieldColIndex] = count;
			}
			this.__addColumnPseudoStyle();
			return true;
		}
	}
	return false;
};

nsGrid.sortBy = function(column,isAscending)
{
	var index = this.__getColumnIndexForSwapOrRemove(column);
	if(index > -1 && this.__tblCenterHeader.tBodies && this.__tblCenterHeader.tBodies.length > 0 && this.__tblCenterHeader.tBodies[0].rows && this.__tblCenterHeader.tBodies[0].rows.length > 0)
	{
		var headerBodyRow = this.__tblCenterHeader.tBodies[0].rows[0];
		var arrHeaderCells = headerBodyRow.cells;
		var cell = arrHeaderCells[index];
	    var columnDetail = this.__getColumnObject(cell.getAttribute("currentColumnIndex"));
	    this.__nsGridSort.handle(cell,columnDetail,isAscending);
	}
};

nsGrid.updateRowByIndex = function(index)
{
	var item = this.__getItemByIndex(index);
	if(item)
	{
		var row = this.__getRowFromItem(item);
		if(row)
		{
			var cells = row.cells;
			for (var colIndex = 0; colIndex < this.__columns.length; colIndex++)
	        {
				var cell = cells[colIndex];
	        	var colItem = this.__columns[colIndex];
	        	this.__updateCellText(row,cell,item,colItem,index,colIndex);
	        }
		}
	}
};

nsGrid.updateRowByKeyField = function(keyFieldValue)
{
	var item = this.__getItemBykeyField(keyFieldValue);
	if(item)
	{
		var row = this.__getRowFromItem(item);
		if(row)
		{
			var cells = row.cells;
			for (var colIndex = 0; colIndex < this.__columns.length; colIndex++)
	        {
				var cell = cells[colIndex];
	        	var colItem = this.__columns[colIndex];
	        	this.__updateCellText(row,cell,item,colItem,item[this.__fieldIndex],colIndex);
	        }
		}
	}
};

nsGrid.updateCellByIndex = function(index,dataField)
{
	var item = this.__getItemByIndex(index);
	var colItem = this.__getColumnObjectByDataField(dataField);
	if(item && colItem)
	{
		var colIndex = colItem[this.__fieldColIndex];
		var row = this.__getRowFromItem(item);
		if(row)
		{
			var cells = row.cells;
			var cell = cells[colIndex];
			this.__updateCellText(row,cell,item,colItem,index,colIndex);
		}
	}
};

nsGrid.updateCellByKeyField = function(keyFieldValue,dataField)
{
	var item = this.__getItemBykeyField(keyFieldValue);
	var colItem = this.__getColumnObjectByDataField(dataField);
	if(item && colItem)
	{
		var colIndex = colItem[this.__fieldColIndex];
		var row = this.__getRowFromItem(item);
		if(row)
		{
			var cells = row.cells;
			var cell = cells[colIndex];
			this.__updateCellText(row,cell,item,colItem,item[this.__fieldIndex],colIndex);
		}
	}
};

nsGrid.filter = function(filter,setting,enableHighlighting,recordLimit)
{
	this.__nsGridFilter.__handleFiltering(filter,setting,enableHighlighting,recordLimit);
};

nsGrid.resetFilters = function()
{
	this.__nsGridFilter.clearFilters();
	this.__nsGridFilter.resetFilters();
};

nsGrid.highlightText = function(dataField,text)
{
	var colItem = this.__getColumnObjectByDataField(dataField);
	if(colItem)
	{
		var index = colItem[this.__fieldColIndex];
		var arrRows = this.__tblCenterBodyBody.rows;
		var length = arrRows.length;
		for(var rowIndex = 0; rowIndex < length; rowIndex++)
	    {
			var cell = arrRows[rowIndex].cells[index];
			if(cell)
			{
				var divText = cell.querySelector("." + this.__CLASS_CELL_CHILD);
				if(divText)
				{
					this.util.unHighlightText(divText);
					this.util.highlightText(divText,text,"nsTextHighlight");
				}
			}
	    }
	}
};

nsGrid.unHighlightText = function()
{
	var arrRows = this.__tblCenterBodyBody.rows;
	var length = arrRows.length;
	for(var rowIndex = 0; rowIndex < length; rowIndex++)
    {
		var colLength = this.__columns.length;
		for(var colIndex = 0; colIndex < colLength; colIndex++)
	    {
			var cell = arrRows[rowIndex].cells[colIndex];
			if(cell)
			{
				var divText = cell.querySelector("." + this.__CLASS_CELL_CHILD);
				if(divText)
				{
					this.util.unHighlightText(divText);
				}
			}
	    }
    }
};

//call this function if the Grid has Fixed Columns and the header calculation is not perfect due to external elements
//call this function after all the elements are rendered by javascript
nsGrid.fixFixedHeader = function()
{
	this.__renderBody(false);
};

nsGrid.removeComponent = function()
{
	if(this.__scroller)
	{
		this.__scroller.__destroyElements();
		this.__scroller = null;
	}
	if(this.__contextMenu)
	{
		this.__contextMenu.remove();
		this.__contextMenu = null;
	}
	if(this.__exportMenu)
	{
		this.__exportMenu.remove();
		this.__exportMenu = null;
	}
	if(this.__bodyScrollRef)
	{
		this.util.removeEvent(this.__divCenterTableBodyContainer,"scroll",this.__bodyScrollRef);
		this.__bodyScrollRef = null;
	}
	if(this.__synchronizeTablesRef)
	{
		this.util.removeEvent(this.__divCenterTableBodyContainer,"scroll",this.__synchronizeTablesRef);
		this.__synchronizeTablesRef = null;
	}
	if(this.__divCenterTableBodyMouseUpRef)
	{
		this.util.removeEvent(document,"mouseup",this.__divCenterTableBodyMouseUpRef);
		this.__divCenterTableBodyMouseUpRef = null;
	}
	if(this.__nsGridFilter)
	{
		this.__nsGridFilter.remove();
	}
	this.base.removeComponent();
};

nsGrid.__processColumnObject = function(objColumn,index)
{
	if(objColumn)
	{
		objColumn[this.__fieldColIndex] = index;
		if(objColumn.hasOwnProperty("width"))
		{
			var widthUnit = this.util.getDimensionUnit(objColumn["width"]);
			if(widthUnit === 0)
			{
				objColumn["width"] = objColumn["width"] + "px";
			}
		}
		objColumn["sortable"] = Boolean.parse(objColumn["sortable"]);
		objColumn["sortDescending"] = Boolean.parse(objColumn["sortDescending"]);
		objColumn["truncateToFit"] = Boolean.parse(objColumn["truncateToFit"]);
		objColumn["headerTruncateToFit"] = Boolean.parse(objColumn["headerTruncateToFit"]);
		objColumn["sortField"] = objColumn["sortField"] ? objColumn["sortField"] :  objColumn["dataField"];
		var isColumnFixed = this.__isColumnFixed(index);
		if(!isColumnFixed && this.__columnResizable)
		{
			if(objColumn.hasOwnProperty("resizable"))
			{
				objColumn["resizable"] = Boolean.parse(objColumn["resizable"]);
			}
			else
			{
				objColumn["resizable"] = true;
			}
		}
		else
		{
			objColumn["resizable"] = false;
		}
		if(!isColumnFixed && this.__columnDraggable)
		{
			if(objColumn.hasOwnProperty("draggable"))
			{
				objColumn["draggable"] = Boolean.parse(objColumn["draggable"]);
			}
			else
			{
				objColumn["draggable"] = true;
			}
		}
		else
		{
			objColumn["draggable"] = false;
		}
		if(objColumn.hasOwnProperty("showMenu"))
		{
			objColumn["showMenu"] = Boolean.parse(objColumn["showMenu"]);
		}
		else
		{
			objColumn["showMenu"] = false;
		}
		if(objColumn.hasOwnProperty("minWidth"))
		{
			objColumn["minWidth"] = this.util.getDimensionAsNumber(null,objColumn["minWidth"]);
		}
		else
		{
			objColumn["minWidth"] = this.__columnMinWidth;
		}
		if(objColumn.hasOwnProperty("groupRenderer"))
		{
			var groupRenderer = objColumn["groupRenderer"];
			if (typeof groupRenderer === "string" || groupRenderer instanceof String)
			{
				if(this.util.isFunction(groupRenderer))
				{
					objColumn.groupRenderer = window[groupRenderer];
				}
			}
		}
		//itemRendrer property gets precedence over template
		if(objColumn.hasOwnProperty("itemRenderer"))
		{
			var itemRenderer = objColumn["itemRenderer"];
			if (typeof itemRenderer === "string" || itemRenderer instanceof String)
			{
				if(this.util.isFunction(itemRenderer))
				{
					objColumn.itemRenderer = window[itemRenderer];
				}
			}
		}
		else if(objColumn.hasOwnProperty("template") && objColumn["template"])
		{
			//setData should be before template for checking
			if(objColumn.hasOwnProperty("setData"))
			{
				var setData = objColumn["setData"];
				if (typeof setData === "string" || setData instanceof String)
				{
					if(this.util.isFunction(setData))
					{
						objColumn.setData = window[setData];
					}
				}
			}
			objColumn.templateRenderer = this.util.getTemplate(objColumn["template"]);
		}
		else if(objColumn.hasOwnProperty("labelFunction"))
		{
			var labelFunction = objColumn["labelFunction"];
			if (typeof labelFunction === "string" || labelFunction instanceof String)
			{
				if(this.util.isFunction(labelFunction))
				{
					objColumn.labelFunction = window[labelFunction];
				}
			}
		}
		if(objColumn.hasOwnProperty("headerRenderer"))
		{
			var headerRenderer = objColumn["headerRenderer"];
			if (typeof headerRenderer === "string" || headerRenderer instanceof String)
			{
				if(this.util.isFunction(headerRenderer))
				{
					objColumn.headerRenderer = window[headerRenderer];
				}
			}
		}
		else if(objColumn.hasOwnProperty("headerTemplate") && objColumn["headerTemplate"])
		{
			objColumn.headerTemplate = this.util.getTemplate(objColumn["headerTemplate"]);
		}
		if(!objColumn.hasOwnProperty("toolTipField") && objColumn.hasOwnProperty("toolTipRenderer"))
		{
			var toolTipRenderer = objColumn["toolTipRenderer"];
			if (typeof toolTipRenderer === "string" || toolTipRenderer instanceof String)
			{
				if(this.util.isFunction(toolTipRenderer))
				{
					objColumn.toolTipRenderer = window[toolTipRenderer];
				}
			}
		}
		if(this.__isResponsiveModeColumnToggle)
		{
			if(!objColumn.hasOwnProperty("priority"))
			{
				objColumn.priority = 6;
			}
			objColumn.priority = parseInt(objColumn.priority);
		}
		this.__nsGridFilter.processColumnObject(objColumn);
	}
	return objColumn;
};

nsGrid.__isColumnExist = function(dataField)
{
	if(dataField && this.__columns && this.__columns.length > 0)
	{
		for(var count = 0; count < this.__columns.length;count++)
		{
			var objColumn = this.__columns[count];
			if(objColumn["dataField"] == dataField)
			{
				return true;
			}
		}
	}
	return false;
};

nsGrid.__createStructure = function()
{
	var divOuterContainer = this.__createOuterContainer();
	var divTitleBar = this.__createTitleBar(divOuterContainer);
	this.__createTableStructure(divOuterContainer);
	if(divTitleBar && this.__title && this.__title.length > 0)
	{
		var spanTitle = divTitleBar.firstChild;
		var body = document.body || document.getElementsByTagName('body')[0];
		var bodyPaddingLeft = this.util.getDimensionAsNumber(body,this.util.getStyleValue(body,"padding-left"));
		var bodyPaddingTop = this.util.getDimensionAsNumber(body,this.util.getStyleValue(body,"padding-top"));
		var bodyMarginLeft = this.util.getDimensionAsNumber(body,this.util.getStyleValue(body,"margin-left"));
		var bodyMarginTop = this.util.getDimensionAsNumber(body,this.util.getStyleValue(body,"margin-top"));
		var paddingLeft = this.util.getDimensionAsNumber(this,this.util.getStyleValue(this,"padding-left"));
		var paddingTop = this.util.getDimensionAsNumber(this,this.util.getStyleValue(this,"padding-top"));
		var marginLeft = this.util.getDimensionAsNumber(this,this.util.getStyleValue(this,"margin-left"));
		var marginTop = this.util.getDimensionAsNumber(this,this.util.getStyleValue(this,"margin-top"));
		var setting = {offsetX:(-1 * (bodyPaddingLeft + bodyMarginLeft + paddingLeft + marginLeft)),offsetY:(-1 * (bodyPaddingTop + bodyMarginTop + paddingTop + marginTop))};
		this.util.addAnimatedLineOnHover(spanTitle,setting);
	}
};

nsGrid.__createOuterContainer = function()
{
	if(this.__divOuterContainer)
	{
		this.removeComponent();
		this.__divOuterContainer.parentNode.removeChild(this.__divOuterContainer);
		this.__divOuterContainer = null;
	}
	this.__divOuterContainer = this.util.createDiv(this.getID() + this.__OUTER_CONTAINER_ID,"nsDataGridContainer");
	this.__divOuterContainer.style.width = this.util.getStyleValue(this,"width");
	this.__divOuterContainer.style.height = this.util.getStyleValue(this,"height");
	this.addChild(this.__divOuterContainer);
	return this.__divOuterContainer;
};

nsGrid.__createTitleBar= function(parentElement)
{
	if(parentElement && ((this.__title && this.__title.length > 0) || this.__enableExport))
	{
		var divTitleBar = this.util.createDiv(this.getID() + this.__TITLE_CONTAINER_ID,this.__CLASS_TITLEBAR);
		if(this.__title && this.__title.length > 0)
		{
			var spanTitle = document.createElement("span");
			var titleText = document.createTextNode(this.__title);
			spanTitle.appendChild(titleText);
			divTitleBar.appendChild(spanTitle);
		}
		if(this.__enableExport)
		{
			var spanExport = document.createElement("span");
			spanExport.style.cursor = "pointer";
			spanExport.style.float = "right";
			var objSVG = new NSSvg();
			var exportID = new NSSvgShapes().__EXPORT_ICON_ID;
			var svg = objSVG.addSVG(spanExport,exportID + "exportsvg","nsExportIcon");
			objSVG.addUse(svg,exportID + "use",null,"#" + exportID);
			divTitleBar.appendChild(spanExport);
			if(!this.__exportMenu)
			{
				var exportMenuSetting = {parent:spanExport,dataSource:this.__exportMenuDataSource,isContextMenu:false,createRunTime:false,eventType:"click",defaultHandler:this.__exportHandler.bind(this),
						position:this.util.POS_BOTTOMLEFT};
				this.__exportMenu = new NSMenu(exportMenuSetting);
			}
		}
		parentElement.appendChild(divTitleBar);
		return divTitleBar;
	}
	return null;
};

nsGrid.__createTableStructure= function(parentElement)
{
	if(parentElement)
	{
		this.__divTableWrapper = this.util.createDiv(this.getID() + "TableWrapper","nsTableWrapper");
		parentElement.appendChild(this.__divTableWrapper);
		this.__divTableHeaderContainerWrapper = this.util.createDiv(this.getID() + this.__TABLE_HEADER_CONTAINER_WRAPPER_ID);
		this.__divTableWrapper.appendChild(this.__divTableHeaderContainerWrapper);
		this.__divTableBodyContainerWrapper = this.util.createDiv(this.getID() + this.__TABLE_BODY_CONTAINER_WRAPPER_ID);
		this.__divTableWrapper.appendChild(this.__divTableBodyContainerWrapper);
		this.__createHeader();
		this.__createBody();
	}
};

nsGrid.__createPaginationControl= function(parentElement)
{
	if(parentElement)
	{
		var divPagination = this.util.createDiv(this.getID() + this.__PAGINATION_CONTROL_ID,"center");
		parentElement.appendChild(divPagination);
		var setting = {
				parent:divPagination,
				totalRecords : this.__totalRecords,
				pageSize : this.__pageSize,
				//containerStyle:"pagination",
				//activeStyle:"active",
				//disabledStyle:"disabled",
				textFirst:"Home",
				textLast:"Last",
				textPrev:"Prev",
				textNext:"Next",
				showFirstLast:true
		};
		this.__nsPagination = new NSPagination(setting);
		this.__nsPagination.util.addEvent(divPagination,this.__nsPagination.PAGE_CHANGE,this.__pageChangeHandler.bind(this));
	}
};

nsGrid.__pageChangeHandler= function(event)
{
	if(!event)
	{
		event = {oldIndex:0,newIndex:1,fromRecord:0,toRecord:this.__pageSize - 1};
	}
	console.log("OldPage::" + event.oldIndex + ",NewPage::" + event.newIndex);
	if(this.__fetchRecordCallBack && this.__totalRecords > event.fromRecord)
	{
		this.__fetchRecordCallBack(event.fromRecord,event.toRecord,this.__pageSize);
	}
};

/******************************Header Creation *************************************/
nsGrid.__createHeader= function()
{
	this.__divCenterTableHeaderContainer = this.__createHeaderContainer(this.__divTableHeaderContainerWrapper,this.__divCenterTableHeaderContainer,this.getID() + this.__TABLE_CENTER_HEADER_CONTAINER_ID,this.getID() + this.__TABLE_CENTER_HEADER_ID);
	this.__tblCenterHeader = this.__divCenterTableHeaderContainer.firstChild;
	this.__createHeaderRows();
};

nsGrid.__createHeaderContainer= function(tableContainer,headerContainer,containerID,tableID)
{
	if(headerContainer)
	{
		headerContainer.parentNode.removeChild(headerContainer);
	}
	headerContainer = this.__createTableAndParent(containerID,"nsDataGridHeaderContainer",tableID);
	tableContainer.appendChild(headerContainer);
	var table = headerContainer.firstChild;
	return headerContainer;
};

nsGrid.__createHeaderRows= function()
{
	if(this.__tblCenterHeader && this.__columns && this.__columns.length > 0)
	{
		var header = this.__tblCenterHeader.createTHead();
		var headerRow = header.insertRow(-1);
	    headerRow.style.height = "auto";
	    var body = document.createElement("tbody");
		this.__tblCenterHeader.appendChild(body);
	    var bodyRow = body.insertRow(-1);
	    var rendererRow = body.insertRow(-1);
	    for (var colIndex = 0; colIndex < this.__columns.length; colIndex++)
	    {
	    	var colItem = this.__columns[colIndex];
	        this.__createHeaderHeaderCell(colItem,headerRow);
	        this.__createHeaderBodyCell(colItem,bodyRow,rendererRow,colIndex);
	    }
	}
};

nsGrid.__createHeaderHeaderCell = function(colItem,headerRow)
{
	if(colItem && headerRow)
	{
		var headerCell = headerRow.insertCell(-1);
		this.util.addStyleClass(headerCell,"nsGridCell");
		headerCell.style.width = colItem["width"]; 
		this.__addPriorityClassInCell(headerCell,colItem);
	}
};

nsGrid.__createHeaderBodyCell = function(colItem,bodyRow,rendererRow,index)
{
	if(colItem && bodyRow && rendererRow)
	{
		var bodyCell = bodyRow.insertCell(-1);
		var colID = this.getID() + "col" + colItem["dataField"];
		bodyCell.setAttribute("id",colID);
		this.util.addStyleClass(bodyCell , "nsGridCell");
		this.util.addStyleClass(bodyCell , this.__CLASS_TABLE_HEADER_CELL);
		bodyCell.setAttribute("orignalColumnIndex",index);
	    bodyCell.setAttribute("currentColumnIndex",index);
	    
	    this.__headerClickRef = this.__headerClickHandler.bind(this);
    	this.__headerMouseOverRef = this.__headerMouseOverHandler.bind(this);
    	this.__headerMouseOutRef = this.__headerMouseOutHandler.bind(this);
    	this.__headerMouseDownRef = this.__headerMouseDownHandler.bind(this);
        this.util.addEvent(bodyCell,"click",this.__headerClickRef);
        this.util.addEvent(bodyCell,"mouseover",this.__headerMouseOverRef);
        this.util.addEvent(bodyCell,"mouseout",this.__headerMouseOutRef);
        this.util.addEvent(bodyCell,"mousedown",this.__headerMouseDownRef);
        
        var divCell = this.util.createDiv(colID + "container","nsDataGridHeaderCellContainer"); 
        bodyCell.appendChild(divCell);
        if(colItem["draggable"])
		{
			this.util.addStyleClass(bodyCell , this.__CLASS_TABLE_HEADER_DROPPABLE_CELL);
			var divMove = this.util.createDiv(colID + "move","nsHeaderMove");
			var imgMove = this.__imgUtil.getMoveIcon("Move Column");
			divMove.appendChild(imgMove);
			divCell.appendChild(divMove);
		}
		var divText = this.util.createDiv(colID + "text");
		divCell.appendChild(divText);
		this.__addHeaderRenderer(divText,colItem,index);
		if(colItem.hasOwnProperty("sortable") && colItem["sortable"])
		{
			var divSorting = this.util.createDiv(colID + "SortContainer");
			divCell.appendChild(divSorting);
			var divSortAsc = this.util.createDiv(colID + "SortAsc","nsSortAsc"); 
			divSorting.appendChild(divSortAsc);
			var divSortSpacer = this.util.createDiv(colID + "SortSpacer","nsSortSpacer"); 
			divSorting.appendChild(divSortSpacer);
			var divSortDesc = this.util.createDiv(colID + "SortDesc","nsSortDesc"); 
			divSorting.appendChild(divSortDesc);
		}
		if(colItem["showMenu"])
		{
			var arrMenu = this.__getHeaderMenuDataProvider(bodyCell);
			if(arrMenu && arrMenu.length > 0)
			{
				var divMenuContainer = this.util.createDiv(colID + "MenuContainer");
				var objSVG = new NSSvg();
				var svg = objSVG.addSVG(divMenuContainer,colID + "menusvg","nsMenuArrowSVG",null,null,null,null,null,null,true);
				objSVG.addUse(svg,colID + "use","nsMenuUse","#svgCircleDownArrow");
				divCell.appendChild(divMenuContainer);
				
				var menuSetting = {parent:divMenuContainer,isContextMenu:false,createRunTime:false,dataSource:arrMenu,targetType:"TD"
								,defaultHandler:this.__headerMenuHandler.bind(this),eventHandler:this.__headerMenuClickHandler.bind(this)
								,position:this.util.POS_BOTTOMRIGHT};
				//place the menu for 2nd last and last column to bottom right
				if(index === this.__columns.length - 1 || index === this.__columns.length - 2)
				{
					menuSetting.position = this.util.POS_BOTTOMLEFT;
				}
				var headerMenu = new NSMenu(menuSetting);
			}
		}
		var rendererCell = rendererRow.insertCell(-1);
		this.util.addStyleClass(rendererCell,"nsGridCell");
		this.util.addStyleClass(rendererCell,"nsDataGridHeaderRenderer");
		this.__nsGridFilter.addFilterRenderer(rendererRow,rendererCell,colItem,index,colID);
		this.__addPriorityClassInCell(bodyCell,colItem);
		this.__addPriorityClassInCell(rendererCell,colItem);
	}
};

nsGrid.__addHeaderRenderer = function(div,colItem,colIndex)
{
	if(colItem)
	{
		var templateRenderer = colItem["headerTemplate"];
		var itemRenderer = colItem["headerRenderer"];
		if(itemRenderer)
		{
			var objRenderer = itemRenderer(colItem,colIndex);
			if(objRenderer)
			{
				if(this.util.isString(objRenderer))
				{
					var compSpan = document.createElement("span");
					compSpan.innerHTML = objRenderer;
					div.appendChild(compSpan);
				}
				else
				{
					div.appendChild(objRenderer);
				}
			}
		}
		else if(templateRenderer)
		{
			div.appendChild(templateRenderer.cloneNode(true));
		}
		else
		{
			this.util.addStyleClass(div,"nsHeaderText");
			var headerText = " ";
			if(colItem.hasOwnProperty("headerText") && colItem["headerText"])
	        {
	        	headerText = colItem["headerText"];
	        }
			var headerTextNode = document.createTextNode(headerText);
			div.appendChild(headerTextNode);
		}
		if(colItem["headerTruncateToFit"])
		{
			this.util.addStyleClass(div,"nsTruncateToFit");
			if(this.__enableToolTipForTruncateText)
			{
				this.__nsToolTipInElement.addToolTip(div,div.textContent);
			}
			else
			{
				div.setAttribute("title",div.textContent);
			}
		}
	}
};

nsGrid.__setHeaderSortFunction = function()
{
	if(this.__arrWrapper && this.__arrWrapper.length > 0)
    {
		if(this.__columns && this.__columns.length > 0)
		{
			var dataSource = this.__getAllItems();
	        for(var colIndex = 0; colIndex < this.__columns.length; colIndex++)
	        {
	        	var colItem = this.__columns[colIndex];
	        	this.__setHeaderSortFunctionForItem(colItem,dataSource);
	        }
		}
    } 
};

nsGrid.__setHeaderSortFunctionForItem = function(colItem,dataSource)
{
	if(colItem)
	{
		if(colItem.hasOwnProperty("dataField") && colItem["dataField"] && colItem.hasOwnProperty("sortable") && colItem["sortable"] === true)
    	{
			//In case of addColumn() dataSource will be null 
			if(!dataSource)
			{
				dataSource = this.__getAllItems();
			}
    		var item = null;
    		for(var count = 0; count < dataSource.length; count++)
            {
                 item = dataSource[count][colItem["dataField"]];
                 if(!this.util.isUndefined(item) && item != null && item != "")
                 {
                	 break;
                 }
            }
    		if(!this.util.isUndefined(item) && item != null && item != "")
            {
            	colItem.sortFunction = this.__nsGridSort.determineSortFunction(item);
            }
            else
            {
            	colItem.sortFunction = "__sortCaseInsensitive";
            }
    	}
	}
};

nsGrid.__removeHeaderCell = function(colIndex)
{
	if(colIndex > -1 && colIndex < this.__columns.length)
	{
		if(this.__tblCenterHeader && this.__tblCenterHeader.tHead && this.__tblCenterHeader.tHead.rows && this.__tblCenterHeader.tHead.rows.length > 0)
		{
			var headerRow = this.__tblCenterHeader.tHead.rows[0];
			if(this.__tblCenterHeader.tBodies && this.__tblCenterHeader.tBodies.length > 0 && this.__tblCenterHeader.tBodies[0].rows && this.__tblCenterHeader.tBodies[0].rows.length > 0)
			{
				headerRow.deleteCell(colIndex);
				var headerBodyRow = this.__tblCenterHeader.tBodies[0].rows[0];
				var rendererRow = this.__tblCenterHeader.tBodies[0].rows[1];
				headerBodyRow.deleteCell(colIndex);
				rendererRow.deleteCell(colIndex);
			}
		}
		return true;
	}
	return false;
};

nsGrid.__swapOrMoveHeaderCell = function(functionality,sourceIndex,destinationIndex)
{
	if(this.__isColumnIndexValid(sourceIndex) && this.__isColumnIndexValid(destinationIndex))
	{
		if(this.__tblCenterHeader && this.__tblCenterHeader.tHead && this.__tblCenterHeader.tHead.rows && this.__tblCenterHeader.tHead.rows.length > 0)
		{
			var headerRow = this.__tblCenterHeader.tHead.rows[0];
			if(this.__tblCenterHeader.tBodies && this.__tblCenterHeader.tBodies.length > 0 && this.__tblCenterHeader.tBodies[0].rows && this.__tblCenterHeader.tBodies[0].rows.length > 0)
			{
				var arrHeaderCells = headerRow.cells;
				this.__swapCell(arrHeaderCells[sourceIndex],arrHeaderCells[destinationIndex]);
				var headerBodyRow = this.__tblCenterHeader.tBodies[0].rows[0];
				var rendererRow = this.__tblCenterHeader.tBodies[0].rows[1];
				var arrBodyCells = headerBodyRow.cells;
				var arrRendererCells = rendererRow.cells;
				arrBodyCells[sourceIndex].setAttribute("currentColumnIndex",destinationIndex);
				arrBodyCells[destinationIndex].setAttribute("currentColumnIndex",sourceIndex);
				if(functionality === "swap")
				{
					this.__swapCell(arrBodyCells[sourceIndex],arrBodyCells[destinationIndex]);
					this.__swapCell(arrRendererCells[sourceIndex],arrRendererCells[destinationIndex]);
				}
				else 
				{
					this.__moveCell(arrBodyCells[sourceIndex],destinationIndex);
					this.__moveCell(arrRendererCells[sourceIndex],destinationIndex);
					var smallIndex = Math.min(sourceIndex,destinationIndex);
					for(var count = smallIndex;count < arrBodyCells.length;count++)
					{
						arrBodyCells[count].setAttribute("currentColumnIndex",count);
					}
				}
			}
			return true;
		}
	}
	return false;
};

nsGrid.__removeHeader = function()
{
	if(this.__tblCenterHeader && this.__tblCenterHeader.tHead)
	{
		this.__tblCenterHeader.deleteTHead();
	}
	if(this.__tblCenterHeader.tBodies && this.__tblCenterHeader.tBodies.length > 0)
    {
    	this.__tblCenterHeader.removeChild(this.__tblCenterHeader.tBodies[0]);
    }
};
/******************************End of Header Creation *************************************/

/******************************Body Creation **********************************************/
nsGrid.__createBody = function()
{	
	this.__divCenterTableBodyContainer = this.__createTableAndParent(this.getID() + this.__TABLE_CENTER_BODY_CONTAINER_ID,this.__CLASS_BODY_CONTAINER,this.getID() + this.__TABLE_CENTER_BODY_ID);
	this.__divTableBodyContainerWrapper.appendChild(this.__divCenterTableBodyContainer);
	this.__tblCenterBody = this.__divCenterTableBodyContainer.firstChild;
	if(this.__enableVirtualScroll)
	{
		this.__divVirtualScrollParent = this.util.createDiv(this.__divTableBodyContainerWrapper.id  + "scrollParent","nsGridScrollerCauseParent");
		this.__divVirtualScroller = this.util.createDiv(this.__divTableBodyContainerWrapper.id  + "scroll","nsGridScrollerCause");
		this.__divVirtualScroller.innerHTML = "&nbsp;";
		this.__divVirtualScrollParent.appendChild(this.__divVirtualScroller);
		this.__divTableBodyContainerWrapper.appendChild(this.__divVirtualScrollParent);
		this.util.addStyleClass(this.__divCenterTableBodyContainer,"nsDataGridBodyContainerVirtual");
		this.__bodyScrollRef = this.__bodyScrollVirtualHandler.bind(this);
		this.util.addEvent(this.__divVirtualScrollParent,"scroll",this.__bodyScrollRef);
		this.util.addEvent(this.__divCenterTableBodyContainer,"mousewheel",this.__bodyMousewheelVirtualHandler.bind(this));
	}
	else if(this.__enablePagination && this.__isPaginationTypeScroll)
	{
		this.__bodyScrollRef = this.__bodyScrollHandler.bind(this);
		this.util.addEvent(this.__divCenterTableBodyContainer,"scroll",this.__bodyScrollRef);
	}
	this.__objGrid.__createBody();
};

nsGrid.__setVirtualMesaurement = function()
{
	this.__divCenterTableBodyContainer.style.position = "relative";
	this.__tblCenterBody.style.position = "absolute";
	this.__tblCenterBody.style.top = "0px";
	this.__tblCenterBody.style.left = "0px";
	this.__divCenterTableBodyContainer.scrollTop = 0;
	this.__setVirtualVariables(true,false,false,false);
};

nsGrid.__setVirtualVariables = function(isReset,overrideDefault,isCollapse,isIndividualRowCollapse)
{
	var divScroll = this.__divVirtualScroller;
	if(this.__arrInternalSource && this.__arrInternalSource.length > 0)
	{
		var totalRecords = 0;
		var scrollHeight = 0;
		var virtualRowHeight = 0;
		if(isReset)
		{
			var availableHeight = 0;//this.util.getStyleValue(this,"height",false);
			if(this.hasAttribute("nsHeight"))
			{
				availableHeight = this.util.getDimensionAsNumber(this,this.getAttribute("nsHeight"));
			}
			else if(this.style.height != "")
			{
				availableHeight  = this.util.getDimensionAsNumber(this,this.style.height);
			}
			else
			{
				availableHeight  = this.offsetHeight;
			}
			if(this.__rowHeight > 0)
			{
				this.__virtualRowHeight = this.__rowHeight;
			}
			else
			{
				this.__objGrid.__createBodyBody(this.__arrInternalSource,0,1);
				var item = this.__arrInternalSource[0];
				var row = item[this.__fieldRowHtml];
			    this.__virtualRowHeight = row.offsetHeight;
			    this.__tblCenterBodyBody.deleteRow(0);
			}
			//Start of workaround for IE issue of limitation of scrollTop Value
			//In IE 11 it is 1533917px 
			//Logic is that this.__divCenterTableBodyContainer.scrollHeight gives max scrollTop Value hence if scrollHeight exceeds this.__divCenterTableBodyContainer.scrollHeight then reset scrollHeight value to this.__divCenterTableBodyContainer.scrollHeight
			//and recalculate rowHeight (this.__virtualRowHeight) value;
			scrollHeight = (this.__totalRecords * this.__virtualRowHeight);
			divScroll.style.maxHeight = scrollHeight + "px";
			divScroll.style.height = scrollHeight + "px";
			//if Custom scroll is there then te recalculation is not required
			if(this.__divVirtualScrollParent.scrollHeight < scrollHeight)
			{
				scrollHeight = this.__divVirtualScrollParent.scrollHeight;
				this.__virtualRowHeight = scrollHeight/this.__totalRecords;
			}
			//end of workaround for IE issue of limitation of scrollTop Value
			this.__rowCount = Math.round(availableHeight/this.__virtualRowHeight) * 2;
			divScroll.style.maxHeight = scrollHeight + "px";
			divScroll.style.height = scrollHeight + "px";
			this.__lastScrollPosition = 0;
			totalRecords = this.__totalRecords;
			virtualRowHeight = this.__virtualRowHeight;
		}
		else
		{
			var row = this.__tblCenterBody.tBodies[0].rows[0];
			virtualRowHeight = this.__virtualRowHeight;
			if(overrideDefault)
			{
				if(!this.__enableVariableRowHeight || (this.__enableVariableRowHeight && isCollapse && !isIndividualRowCollapse))
				{
					 virtualRowHeight = row.offsetHeight;
				}
			}
			else
			{
				virtualRowHeight = row.offsetHeight;
			}
			totalRecords = this.__totalRecords;
			if(this.__enableHierarchical || this.__enableGrouping)
			{
				totalRecords = this.__getAllVisibleItems();
			}
		}
		scrollHeight = (totalRecords * virtualRowHeight);
		this.__scrollOffsetPosition = virtualRowHeight;
		//giving it a bit of padding if variableRowHeight is not true
		//if variableRowHeight is true then we are already adding extra rows which will handle the padding
		if(!this.__enableVariableRowHeight)
		{
			scrollHeight = scrollHeight + 50;
		}
		divScroll.style.maxHeight = scrollHeight + "px";
		divScroll.style.height = scrollHeight + "px";
	}
	else
	{
		this.__virtualRowHeight = 0;
		this.__rowCount = 0;
		this.__scrollOffsetPosition = 0;
		this.__lastScrollPosition = 0;
		divScroll.style.height = 0 + "px";
	}
};

nsGrid.__renderBody = function(fromSort)
{
	if(this.__processArrayAsync)
    {
		this.__processArrayAsync.stop();
    }
	var resetTable = function(tblData)
	{
		if(tblData)
		{
			tblData.deleteTHead();
		    if(tblData.tBodies && tblData.tBodies.length > 0)
		    {
		    	tblData.removeChild(tblData.tBodies[0]);
		    }
		}
	};
	var createBody = function()
	{
		return document.createElement("tbody");
	};
	var addBodyInTable = function(tblData,tblBody)
	{
		if(tblData && tblBody)
		{
			tblData.appendChild(tblBody);
		}
	};
	resetTable(this.__tblCenterBody);
	this.__tblCenterBodyBody = createBody();
    this.__divCenterTableBodyContainer.scrollTop = 0;
    this.__lastScrollPos = [0,0];
	if(this.__enableContextMenu)
	{
		this.__initializeContextMenu();
	}
	this.__createBodyHeader();
	this.__createFixedHeaderRows();
	if(this.__enableVirtualScroll)
	{
		addBodyInTable(this.__tblCenterBody,this.__tblCenterBodyBody);
		this.__setVirtualMesaurement();
		this.__createBodyBodyVirtual(this.__rowCount);
	}
	else if(this.__enablePagination && this.__isPaginationTypeScroll)
	{
		addBodyInTable(this.__tblCenterBody,this.__tblCenterBodyBody);
		var source = this.__arrInternalSource.slice(0);
		if(this.__isPaginationModeAuto || this.__rowsRendered)
		{
			this.__arrInternalSource = source.slice(0,this.__INFINITE_SCROLL_INITIAL_LOAD);
		}
		this.__createBodyBody(this.__arrInternalSource,0,this.__arrInternalSource.length);
		if((this.__isPaginationModeAuto || this.__rowsRendered) && this.__enableAsyncLoadPagination && this.__totalRecords > this.__getTotalRows()) 
		{
			this.__arrInternalSource = source.slice(0);//this.__objGrid.__setSourceForAsync();
			this.__processArrayAsync = new this.util.processArrayAsync(this.__arrInternalSource,this.__createRowAsync,20,this.__asyncSourceCompleteHandler,this);
			this.__processArrayAsync.start(this.__getTotalRows());
		}
	}
	else 
	{
		this.__createBodyBody(this.__arrInternalSource,0,this.__arrInternalSource.length);
		addBodyInTable(this.__tblCenterBody,this.__tblCenterBodyBody);
	}
	if(!fromSort)
	{
		this.__setBodyMeasurement();
	}
	this.__alignTables(fromSort);
	this.__setFixedCellsPosition();
	if(this.__customScrollerRequired && !this.__scroller)
	{
		//this.__scroller = new NSScroller(this.__divCenterTableBodyContainer);
		this.__scroller = new NSScroller({component:this.__divCenterTableBodyContainer});
		//this.__scroller = "anc";
		//scrollPrototype.scrollbar(this.__divCenterTableBodyContainer);
		//$('#dgDemodivCenterBodyContainer').jScrollPane({showArrows: true});
	}
	if(this.__enableRowMove)
	{
		var setting = {table:this.__tblCenterBody,isSameTableMove:this.__isSameTableMove,dropEndHandler:this.__rowMoverDropEndHandler};
		var rowMover = new NSTableRowMover(setting);
	}
	//this does not make elements unselectable
	//this.util.makeElementUnselectable(this.__divCenterTableBodyContainer,true);
};

nsGrid.__createRowAsync= function(item,index,array)
{
	this.__objGrid.__createRowAsync(item,index,array);
	console.log(index + " rendererd");
};

nsGrid.__asyncSourceCompleteHandler= function()
{
	console.log("CompleteHandler");
};

nsGrid.__createBodyHeader= function()
{
	var header = this.__tblCenterBody.createTHead();
	var headerRow = header.insertRow(-1);
    headerRow.style.height = "auto";
    for (var colIndex = 0; colIndex < this.__columns.length; colIndex++)
    {
        var colItem = this.__columns[colIndex];
        this.__createBodyHeaderCell(colItem,headerRow);
    }
};

nsGrid.__createBodyHeaderCell= function(colItem,headerRow)
{
	if(colItem && headerRow)
	{
		var headerCell = headerRow.insertCell(-1);
		this.util.addStyleClass(headerCell,"nsGridCell");
		headerCell.style.width = (colItem["width"]);
	    headerCell.style.height = "0px";
	    this.__addPriorityClassInCell(headerCell,colItem);
	}
};

nsGrid.__createBodyBodyVirtual= function(rowCount)
{
	if(this.__arrInternalSource && this.__arrInternalSource.length > 0)
	{
		 this.__objGrid.__createBodyBodyVirtual(this.__arrInternalSource,rowCount);
	}
	else
	{
		this.__createNoDataRow();
	}
};

nsGrid.__resetDataInBody= function(fromIndex,toIndex)
{
	this.__objGrid.__resetDataInBody(fromIndex,toIndex);
};

nsGrid.__createBodyBody= function(dataSet,startIndex,endIndex,callAsync)
{
	this.__stopScroll = true;
    if(dataSet && dataSet.length > 0)
    {
    	this.__objGrid.__createBodyBody(dataSet,startIndex,endIndex);
    }
    else
    {
    	this.__createNoDataRow();
    }
    this.__stopScroll = false;
    if(callAsync && this.__processArrayAsync)
    {
    	this.__processArrayAsync.start(this.__getTotalRows());
    }
};

nsGrid.__setBodyRowProperty = function(row,item,rowIndex)
{
	if(row && item)
	{
		if(!this.__enableVariableRowHeight)
		{
			if(this.__rowHeight > 0)
			{
				row.style.height = this.__rowHeight + "px";
			}
			else if(this.__virtualRowHeight > 0)
			{
				row.style.height = this.__virtualRowHeight + "px";
			}
			else
			{
				row.style.height = "auto";
			}
		}
		this.util.addStyleClass(row , "nsGridRow");
	    var className = ((rowIndex % 2) === 0) ? this.__CLASS_EVEN_ROW : this.__CLASS_ODD_ROW;
	    this.util.addStyleClass(row , className);
	    if(this.__enableMouseHover)
	    {
	    	this.util.addEvent(row,"mouseover",this.__rowMouseHover.bind(this));
		    this.util.addEvent(row,"mouseout",this.__rowMouseHover.bind(this));
	    }
	    this.util.addEvent(row,"click",this.__rowClickHandler.bind(this));
	}
};

nsGrid.__createBodyRowCell= function(row)
{
    var cell = row.insertCell(-1);
    //cell.className = "nsBodyDataGridCell";
    this.util.addStyleClass(cell , "nsGridCell");
    this.util.addStyleClass(cell , "nsBodyDataGridCell");
    var cellDiv = this.util.createDiv(null);
    cell.appendChild(cellDiv);
    return cell;
};

nsGrid.__setBodyCellProperty = function(row,cell,item,colItem,colIndex,parentIndex,level,isReset)
{
	var hierarchicalPadding = 0;
	if(colItem && colItem.hasOwnProperty("dataField") && colItem["dataField"])
	{
		var cellDiv = cell.firstChild;
        if((this.__enableHierarchical || this.__enableGrouping) && colIndex == 0 && item.hasOwnProperty(this.__childField) && item[this.__childField]  && item[this.__childField].length > 0)
        {
        	this.util.addStyleClass(cellDiv,this.__CLASS_GROUP_CELL);
        	var isCollapsed = false;
        	if(!isReset && item.hasOwnProperty(this.__fieldIsCollapsed))
 	        {
        		isCollapsed = item[this.__fieldIsCollapsed];
 	        }
        	this.__createArrow(parentIndex,cellDiv,isCollapsed);
        	var cellText = this.util.createDiv(null,this.__CLASS_CELL_CHILD);
        	cellText.style.verticalAlign = "top";
        	this.__addCellText(row,item,cellText,colItem,colIndex);
        	cellDiv.appendChild(cellText);
        }
        else
        {
        	this.util.addStyleClass(cellDiv,this.__CLASS_CELL_CHILD);
        	this.__addCellText(row,item,cellDiv,colItem,colIndex);
        	//24 = 16(Arrow Width) + 6(Arrow Parent Padding) + 2(cellDiv horizontalGap between elements shown in debugger)
        	hierarchicalPadding = 24;
        }
        if(colIndex == 0)
        {
        	if(this.__enableHierarchical)
            {
            	if(level === 0)
            	{
            		cell.style.paddingLeft = "1px";
            	}
            	else
            	{
            		var paddingLeft = (10 * level) + hierarchicalPadding;
            		cell.style.paddingLeft = paddingLeft + "px";
            	}
            }
        	else if(this.__enableGrouping)
        	{
        		if(level === 0)
        		{
        			cell.style.paddingLeft = "1px";
        		}
        	}
        }
	}
	this.__addPriorityClassInCell(cell,colItem);
};

nsGrid.__removeBodyColumn= function(colIndex)
{
	if(colIndex > -1 && colIndex < this.__columns.length)
	{
		if(this.__tblCenterBody && this.__tblCenterBody.tHead && this.__tblCenterBody.tHead.rows && this.__tblCenterBody.tHead.rows.length > 0)
	    {
			var bodyRow = this.__tblCenterBody.tHead.rows[0];
	    	if(this.__tblCenterBody.tBodies && this.__tblCenterBody.tBodies.length > 0 && this.__tblCenterBody.tBodies[0].rows && this.__tblCenterBody.tBodies[0].rows.length > 0)
			{
	    		bodyRow.deleteCell(colIndex);
	    		var arrRows = this.__tblCenterBody.tBodies[0].rows;
	    		var row = null;
	    		for (var rowCount = 0; rowCount < arrRows.length; rowCount++) 
	    		{
	    			row = arrRows[rowCount];
	    			row.deleteCell(colIndex);
	    	    }
			}
	    }
	}
};

nsGrid.__swapOrMoveBodyCell = function(functionality,sourceIndex,destinationIndex)
{
	if(this.__isColumnIndexValid(sourceIndex) && this.__isColumnIndexValid(destinationIndex))
	{
		if(this.__tblCenterBody && this.__tblCenterBody.tHead && this.__tblCenterBody.tHead.rows && this.__tblCenterBody.tHead.rows.length > 0)
		{
			var bodyRow = this.__tblCenterBody.tHead.rows[0];
			if(this.__tblCenterBody.tBodies && this.__tblCenterBody.tBodies.length > 0 && this.__tblCenterBody.tBodies[0].rows && this.__tblCenterBody.tBodies[0].rows.length > 0)
			{
				var arrHeaderCells = bodyRow.cells;
				if(functionality === "swap")
				{
					this.__swapCell(arrHeaderCells[sourceIndex],arrHeaderCells[destinationIndex]);
				}
				else
				{
					this.__moveCell(arrHeaderCells[sourceIndex],destinationIndex);
				}
				var arrRows = this.__tblCenterBody.tBodies[0].rows;
	    		var row = null;
	    		var arrBodyCells = [];
	    		for (var rowCount = 0; rowCount < arrRows.length; rowCount++) 
	    		{
	    			row = arrRows[rowCount];
	    			arrBodyCells = row.cells;
	    			if(functionality === "swap")
					{
	    				this.__swapCell(arrBodyCells[sourceIndex],arrBodyCells[destinationIndex]);
					}
	    			else
					{
						this.__moveCell(arrBodyCells[sourceIndex],destinationIndex);
					}
	    	    }
			}
			return true;
		}
	}
	return false;
};

nsGrid.__createArrow = function(item,parentRowCount,parentElement,isCollapsed)
{
	 if(parentElement)
	 {
		 var cellArrowParent = this.util.createDiv(null);
		 var arrowID = this.getID() + "compArrow" + parentRowCount;
		 var compArrow = this.util.createDiv(arrowID,"nsArrow");
		 compArrow.style.paddingTop = "3px";
		 compArrow.setAttribute("ns-parent-row-count",parentRowCount);
		 
		 var objSVG = new NSSvg();
		 this.__objGrid.__createArrow(compArrow,objSVG,arrowID,isCollapsed);
		 this.util.addEvent(compArrow,"click",this.__arrowClickHandler.bind(this));
		 cellArrowParent.appendChild(compArrow);
		 parentElement.appendChild(cellArrowParent);
		 item[this.__fieldRowArrow] = compArrow;
		 return compArrow;
	 }
	 return null;
};

nsGrid.__setArrowDirection = function(compArrow,isCollapsed)
{
	if(compArrow)
	{
		var objSVG = new NSSvg();
		var useID = compArrow.getAttribute("id") + "use";
		this.__objGrid.__setArrowDirection(objSVG,useID,isCollapsed);
	}
};

nsGrid.__isArrowCollapsed = function(compArrow)
{
	if(compArrow && compArrow.hasAttribute("ns-parent-row-count"))
	{
		var rowIndex = parseInt(compArrow.getAttribute("ns-parent-row-count"));
		var item = this.__getItemByIndex(rowIndex);
		if(item)
		{
			return item[this.__fieldIsCollapsed];
		}
	}
	return false;
};

nsGrid.__createNoDataRow = function()
{
	var row = this.__tblCenterBodyBody.insertRow(-1);
	this.util.addStyleClass(row,"nsNoRecordsFound");
	row.style.height = "auto";
	var cell = row.insertCell(-1);
	cell.setAttribute("colspan",this.__columns.length);
	var textNode = document.createTextNode(this.__noDataMessage);
	cell.appendChild(textNode);
};
/******************************Fixed Column ***************************************/
nsGrid.__createFixedHeaderRows= function()
{
	this.__arrFixedLeftCells = [];
	this.__arrFixedRightCells = [];
	var centerHeaderHeaderCells = [];
	var centerHeaderBodyCells = [];
	var centerHeaderRendererCells = [];
	var centerBodyHeaderCells = []; 
	if(this.__tblCenterHeader && this.__tblCenterHeader.tHead && this.__tblCenterHeader.tHead.rows && this.__tblCenterHeader.tHead.rows.length > 0)
	{
		var centerHeaderRow = this.__tblCenterHeader.tHead.rows[0];
		centerHeaderHeaderCells = centerHeaderRow.cells;
	}
	if(this.__tblCenterHeader.tBodies && this.__tblCenterHeader.tBodies.length > 0 && this.__tblCenterHeader.tBodies[0].rows && this.__tblCenterHeader.tBodies[0].rows.length > 0)
	{
		var centerBodyRow = this.__tblCenterHeader.tBodies[0].rows[0];
		centerHeaderBodyCells = centerBodyRow.cells;
		var centerRendererRow = this.__tblCenterHeader.tBodies[0].rows[1];
		centerHeaderRendererCells = centerRendererRow.cells;
	}
	if(this.__tblCenterBody && this.__tblCenterBody.tHead && this.__tblCenterBody.tHead.rows && this.__tblCenterBody.tHead.rows.length > 0)
	{
		var centerHeaderRow = this.__tblCenterBody.tHead.rows[0];
		centerBodyHeaderCells = centerHeaderRow.cells;
	}
	var setCellProperties = this.__setFixedCellProperties.bind(this);
	var setCells = function(arrFixed,startIndex,endIndex,isLeftDirection)
	{
		for (var colIndex = startIndex; colIndex < endIndex; colIndex++)
	    {
	    	var headerHeaderCell = centerHeaderHeaderCells[colIndex];
	    	setCellProperties(arrFixed,headerHeaderCell,isLeftDirection);
	    	var headerBodyCell = centerHeaderBodyCells[colIndex];
	    	setCellProperties(arrFixed,headerBodyCell,isLeftDirection);
	    	var headerRendererCell = centerHeaderRendererCells[colIndex];
	    	setCellProperties(arrFixed,headerRendererCell,isLeftDirection);
	    	var bodyHeaderCell = centerBodyHeaderCells[colIndex];
	    	setCellProperties(arrFixed,bodyHeaderCell,isLeftDirection);
	    }
	};
	this.__callFixedArrayCallback.bind(this)(setCells);
};

nsGrid.__createFixedBodyRow = function(row)
{
	var centerBodyBodyCells = row.cells;
	var setCellProperties = this.__setFixedCellProperties.bind(this);
	var setCells = function(arrFixed,startIndex,endIndex,isLeftDirection)
	{
	    for (var colIndex = startIndex; colIndex < endIndex; colIndex++)
	    {
	    	var fixedCell = centerBodyBodyCells[colIndex];
	    	setCellProperties(arrFixed,fixedCell,isLeftDirection);
	    }
	};
	this.__callFixedArrayCallback.bind(this)(setCells);
};

nsGrid.__callFixedArrayCallback = function(callBack)
{
	if(this.__leftFixedColumn > 0 && this.__columns && this.__columns.length > this.__leftFixedColumn)
	{
		callBack(this.__arrFixedLeftCells,0,this.__leftFixedColumn,true);
	}
	if(this.__rightFixedColumn > 0 && this.__columns && this.__columns.length > this.__rightFixedColumn)
	{
		callBack(this.__arrFixedRightCells,this.__columns.length - this.__rightFixedColumn,this.__columns.length,false);
	}
};

nsGrid.__setFixedCellProperties = function(arrFixed,cell,isLeftDirection)
{
	this.__setFixedBackground(cell);
	this.util.addStyleClass(cell,"nsFixedDataGridCell");
	if(isLeftDirection && cell.cellIndex === (this.__leftFixedColumn - 1))
	{
		this.util.addStyleClass(cell,"nsFixedLeftLastCell");
	}
	else if(!isLeftDirection && cell.cellIndex === (this.__columns.length - this.__rightFixedColumn))
	{
		this.util.addStyleClass(cell,"nsFixedRightFirstCell");
	}
	if(this.__enableFixedColumnAnimation)
	{
		this.util.addStyleClass(cell,"nsFixedDataGridCellAnimate");
	}
	arrFixed.push(cell);
};

nsGrid.__setFixedBackground = function(cell) 
{
	var row = cell.parentNode;
	var cellBackground = this.util.getStyleValue(cell,"background-color");
	cellBackground = (cellBackground == "transparent" || cellBackground == "rgba(0, 0, 0, 0)") ? null : cellBackground;

	var rowBackground = this.util.getStyleValue(row,"background-color");
	rowBackground = (rowBackground == "transparent" || rowBackground == "rgba(0, 0, 0, 0)") ? null : rowBackground;

	var background = rowBackground ? rowBackground : "white";
	background = cellBackground ? cellBackground : background;
	
	cell.style.backgroundColor = background;
};

nsGrid.__setFixedCellsPosition = function()
{
	var divBodyContainer = this.__divCenterTableBodyContainer;
	var scrollWidth = divBodyContainer.scrollWidth;
	var clientWidth = divBodyContainer.clientWidth;
	var scrollHeight = divBodyContainer.scrollHeight;
	var clientHeight = divBodyContainer.clientHeight;
	var top = divBodyContainer.scrollTop;
	var left = divBodyContainer.scrollLeft;
	var right = scrollWidth - clientWidth - left;
	for(var count = 0;count < this.__arrFixedLeftCells.length;count++)
	{
		this.__arrFixedLeftCells[count].style.left = left + "px";
	}
	for(var count = 0;count < this.__arrFixedRightCells.length;count++)
	{
		this.__arrFixedRightCells[count].style.right = right + "px";
	}
};

nsGrid.__isColumnFixed = function(index)
{
	return ((index < this.__leftFixedColumn) || ((this.__orignalColumns.length - this.__rightFixedColumn) <= index));
};

nsGrid.__isFixedColumnApplied = function()
{
	return ((this.__leftFixedColumn > 0) || (this.__rightFixedColumn > 0));
};
/******************************End of Fixed Column logic **************************/
/******************************Event Listeners *************************************/

nsGrid.__arrowClickHandler = function(event)
{
	event = this.util.getEvent(event);
	var target = this.util.getTarget(event);
	target = this.util.findParent(target,"DIV");
	if(target && target.hasAttribute("ns-parent-row-count"))
	{
		var rowIndex = target.getAttribute("ns-parent-row-count");
		var isCollapse = this.__isArrowCollapsed(target);
		this.__showHideRow(parseInt(rowIndex),target,!isCollapse);
	}
	event.stopImmediatePropagation();
};

nsGrid.__headerClickHandler= function(event)
{
	if(this.__onGridLine)
	{
		 return;
	}
     var target = this.util.getTarget(event);
     //adding the below condition so that if we add a span or a font and click on it then we should navigate till we find the header object
     target = this.util.findParent(target,"TD");
     var columnDetail = this.__getColumnObject(target.getAttribute("currentColumnIndex"));
     this.__nsGridSort.handle(target,columnDetail);
};

nsGrid.__headerMouseOverHandler = function(event)
{
	var target = this.util.getTarget(event);
	target = this.util.findParent(target,"TD");
	this.__headerMouseMoveRef = this.__headerMouseMoveHandler.bind(this);
	this.util.addEvent(target,"mousemove",this.__headerMouseMoveRef);
};

nsGrid.__headerMouseOutHandler = function(event)
{
	var target =  this.util.getTarget(event);
	target =  this.util.findParent(target,"TD");
	this.__onGridLine = false;
	
	this.util.removeEvent(target,"mousemove",this.__headerMouseMoveRef);
	this.__headerMouseMoveRef = null;
	/*this.util.removeEvent(target,"mousedown",this.__headerMouseDownRef);
	this.__headerMouseDownRef = null;*/
	
	this.util.removeStyleClass(target,"nsResizeHandleActive");
};

nsGrid.__headerMouseMoveHandler = function(event)
{
	event = this.util.getEvent(event);
	var target = this.util.getTarget(event);
	target = this.util.findParent(target,"TD");
	var objColumn = this.__getColumnObject(target.getAttribute("currentColumnIndex"));
	//var offset = this.util.getEventPosition(event);
	if(objColumn && objColumn["resizable"])
	{
		var posEvent = this.util.getEventPosition(event,this.__divCenterTableHeaderContainer);
		if(this.__isMouseOnElement(target,posEvent.left,posEvent.top))
		{
			this.util.addStyleClass(target,"nsResizeHandleActive");
			this.__onGridLine = true;
		}
		else
		{
			this.util.removeStyleClass(target,"nsResizeHandleActive");
			this.__onGridLine = false;
		}
	}
};

nsGrid.__headerMouseDownHandler = function(event)
{
	event = this.util.getEvent(event);
    var target = this.util.getTarget(event);
    target = this.util.findParent(target,"TD");
    var objColumn = this.__getColumnObject(target.getAttribute("currentColumnIndex"));
    if(objColumn)
	{
    	if(objColumn["resizable"])
    	{
    		this.__startResize(event,target);
    	}
    	if(objColumn["draggable"])
    	{
		   this.__nsGridColumnMove.handle(event,target);
    	}
	}
};

nsGrid.__headerMenuClickHandler = function(event)
{
	 event = this.util.getEvent(event);
     event.stopImmediatePropagation();
};

nsGrid.__getHeaderMenuDataProvider = function(target)
{
	var source = [];
	if(target)
	{
		target = this.util.findParent(target,"TD");
		var objColumn = this.__getColumnObject(target.getAttribute("currentColumnIndex"));
		var colIndex = objColumn[this.__fieldColIndex];
		if(objColumn)
		{
			if(objColumn["sortable"])
			{
				source.push({id:1,title: "Sort Ascending"});
				source.push({id:2,title: "Sort Descending"});
			}
			var isColumnFixed = this.__isColumnFixed(colIndex);
			if(!isColumnFixed && this.__isColumnValidForSwapOrRemove(colIndex))
			{
				source.push({id:3,title: "Hide Column"});
			}
		}
	}
	return source;
};

nsGrid.__headerMenuHandler = function(target,item)
{
	if(target && item)
	{
		target = this.util.findParent(target,"TD");
		var objColumn = this.__getColumnObject(target.getAttribute("currentColumnIndex"));
		if(objColumn)
		{
			var colIndex = objColumn[this.__fieldColIndex];
			//Sort Ascending
			if(item["id"] === 1)
			{
				this.sortBy(colIndex,true);
			}
			//Sort Descending
			else if(item["id"] === 2)
			{
				this.sortBy(colIndex,false);
			}
			//Hide Column
			else if(item["id"] === 3)
			{
				this.hideColumn(colIndex);
			}
		}
	}
};

nsGrid.__rowMouseHover= function(event)
{
	 /*event = this.util.getEvent(event);
     var target = this.util.getTarget(event);
     target = this.util.findParent(target,"TR");
     if (event.type == "mouseover")
     {
    	 this.util.addStyleClass(target,"nsDataGridHover");
     }
     else if (event.type == "mouseout")
     {
    	 this.util.removeStyleClass(target,"nsDataGridHover");
     }*/
	 return false;
};

nsGrid.__rowClickHandler= function(event)
{
	event = this.util.getEvent(event);
    var target = this.util.getTarget(event);
    target = this.util.findParent(target,"TR");
    //Multiselection Check
    if (event.shiftKey && this.__enableMultiSelection)
    {
    	this.__multiSectionHandler(target);
    }
    else if(event.ctrlKey && this.__enableMultiSelection)
    {
      if(this.__isRowSelected(target))
      {
    	  this.__markRowUnselected(target);
      }
      else
      {
    	  this.__markRowSelected(target);
      }
    }
    else
    {
    	this.__clearAllRowSelection();
    	this.__markRowSelected(target);
    } 
};

nsGrid.__bodyScrollHandler = function(event)
{
	var target = this.util.getTarget(event);
	if(this.__stopScroll)
	{
		target.scrollLeft = this.__lastScrollPos[0];
		target.scrollTop = this.__lastScrollPos[1];
		console.log(this.__stopScroll);
		return;
	}
	var scrollPos = target.scrollTop;
	var scrollValue = (target.scrollHeight * this.__bottomPercentageForAddRows) /100;
	if(scrollPos > this.__bodyScrollPos)
	{
		if((target.scrollHeight - scrollPos) < scrollValue)
	    {
			if((this.__isPaginationModeAuto || this.__rowsRendered) && this.__enableAsyncLoadPagination)
	        {
				if(this.__totalRecords > this.__getTotalRows())
				{
					if(this.__processArrayAsync)
					{
						this.__processArrayAsync.stop();
					}
					var totalRows = this.__getTotalRows();
					this.__createBodyBody(this.__arrInternalSource,totalRows,totalRows + 20,true);
				}
	        }
			else
			{
				var fromRecord =  this.__getTotalRows();
				if(fromRecord === this.__totalRecords)
				{
					this.__rowsRendered = true;
				}
				else
				{
					var toRecord = fromRecord +  this.__pageSize - 1;
					toRecord = (toRecord < this.__totalRecords) ? toRecord : ((toRecord === this.__totalRecords) ? this.__totalRecords - 1 : this.__totalRecords);
					this.__fetchRecordCallBack(fromRecord,toRecord,this.__pageSize);
				}
			}
	    }
	}
	this.__lastScrollPos = [target.scrollLeft,target.scrollTop];
	this.__bodyScrollPos = target.scrollTop;
};

nsGrid.__infiniteScrollEnabler = function(event)
{
	var target = this.util.getTarget(event);
	var scrollPos = target.scrollTop;
	var itemToBegin = 0;
	var tableTop = 0; 
    if(scrollPos > this.__scrollOffsetPosition)
    {
    	tableTop = scrollPos - this.__scrollOffsetPosition;
    	itemToBegin = Math.ceil(tableTop/this.__virtualRowHeight);
    }
    else
    {
    	tableTop = 0;
    	itemToBegin = 0;
    }
    return (itemToBegin <= this.__getTotalRows());
};

nsGrid.__bodyScrollVirtualHandler = function(event)
{
	var target = this.util.getTarget(event);
	var scrollPos = target.scrollTop;
	if(this.__customScrollerRequired)
	{
		//scrollPos = event.scrollTop;
	}
	//console.log(this.__lastScrollPosition + "," + scrollPos);
	if(this.__lastScrollPosition !== scrollPos)
	{
		var itemToBegin = Math.ceil(scrollPos/this.__virtualRowHeight);
    	var itemToLimit =  Math.ceil(itemToBegin + this.__rowCount);
        //console.log(itemToBegin + "," + itemToLimit);
    	this.__lastItemBegin = itemToBegin;
    	this.__lastItemEnd = itemToLimit;
        //console.log(itemToBegin + "," + itemToLimit);
    	var self = this;
    	if(this.__enableDataRefreshOnScrollEnd)
    	{
    		if (this.__virtualDataRefreshInterval != -1)
    		{
    			clearTimeout(this.__virtualDataRefreshInterval);
    			this.__virtualDataRefreshInterval = -1;
    		}
    		this.__virtualDataRefreshInterval = setTimeout(
        		function()
        		{ 
        			self.__dataRefreshOnScrollEndHandler.bind(self)();
        		},self.__dataRefreshfireDelay);
    	}
    	else
    	{
    		this.__resetDataInBody(itemToBegin,itemToLimit);
    		this.__handleScrollEdgeScenarios();
    	}
	}
	this.__lastScrollPosition = scrollPos;
	if (this.__virtualScrollEndInterval != -1)
	{
		clearTimeout(this.__virtualScrollEndInterval);
		this.__virtualScrollEndInterval = -1;
	}
	this.__virtualScrollEndInterval = setTimeout(
		function()
		{ 
			self.__setFixedCellsPosition.bind(self)();
		},50);
};

nsGrid.__bodyMousewheelVirtualHandler = function(event)
{
	event = this.util.getEvent(event);
	this.util.preventDefault(event);
	var target = this.__divVirtualScrollParent;
	var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    var scrollHeight = 3 * parseInt(this.__virtualRowHeight);
    var currentScrollPos = target.scrollTop;
    var contentHeight = this.__divVirtualScroller.clientHeight;
    //scroll-up
    if(delta === 1)
    {
        if((currentScrollPos - scrollHeight) < 0)
        {
        	target.scrollTop = 0;
        }
        else
        {
        	target.scrollTop = currentScrollPos - scrollHeight;
        }
   }
   else
   {
        if((currentScrollPos + scrollHeight) > contentHeight)
        {
        	target.scrollTop = contentHeight;
        }
        else
        {
        	target.scrollTop = currentScrollPos + scrollHeight;
        }
   }
};

nsGrid.__handleScrollEdgeScenarios = function()
{
	var target = this.__divVirtualScrollParent;
	if(target.scrollHeight - target.scrollTop === target.clientHeight)
	{
		this.__divCenterTableBodyContainer.scrollTop = this.__divCenterTableBodyContainer.scrollHeight;
	}
	if(target.scrollTop === 0)
	{
		this.__divCenterTableBodyContainer.scrollTop = 0;
	}
};

nsGrid.__dataRefreshOnScrollEndHandler = function()
{
	this.__virtualDataRefreshInterval = -1;
	this.__resetDataInBody(this.__lastItemBegin,this.__lastItemEnd);
	this.__handleScrollEdgeScenarios();
	this.__lastItemBegin = -1;
	this.__lastItemEnd = -1;
};

/******************************End of Event Listeners*************************************/

/******************************Column Resize Logic*************************************/

nsGrid.__resize = function(table,cell,desirableWidth)
{
	var cellPaddingLeft = this.util.getDimensionAsNumber(cell,cell.style.paddingLeft);
	var cellPaddingRight = this.util.getDimensionAsNumber(cell,cell.style.paddingRight);
	var pad = parseInt(cellPaddingLeft,10) + parseInt(cellPaddingRight,10);
	var objColumn = this.__getColumnObject(this.__resizingHeader.getAttribute("currentColumnIndex"));
	var minWidth = this.__columnMinWidth;
	if(objColumn)
	{
		minWidth = objColumn["minWidth"];
	}
	var setWidth = Math.max((desirableWidth - pad), minWidth);
	objColumn["width"] = setWidth + "px";
	cell.style.width = setWidth + "px";
};

nsGrid.__startResize = function(event,target)
{
	if(!this.__onGridLine)
	{
		return;
	}
	
	 this.util.removeEvent(target,"click",this.__headerClickRef);
	 this.__headerClickRef = null;
     this.util.removeEvent(target,"mouseover",this.__headerMouseOverRef);
     this.__headerMouseOverRef = null;
     this.util.removeEvent(target,"mouseout",this.__headerMouseOutRef);
     this.__headerMouseOutRef = null;
     /*this.util.removeEvent(target,"mousedown",this.__headerMouseDownRef);
     this.__headerMouseDownRef = null;*/
	
	this.__resizingHeader = target;
	this.__resizingHeaderCell = this.__getHeaderTopCell(target);
	this.__resizingBodyCell = this.__getBodyTopCell(target);
	
	this.__createResizeHandler(event);
	
	this.__doResizeRef = this.__doResize.bind(this);
	this.__endResizeRef = this.__endResize.bind(this);
	this.util.addEvent(document,"mousemove",this.__doResizeRef);
	this.util.addEvent(document,"mouseup",this.__endResizeRef);
	
	event.stopImmediatePropagation();
};

nsGrid.__doResize = function(event)
{
	//putting this check as somehow the document evenlistener is not getting detached
	if(!this.__resizingHeader)
	{
		return;
	}
	this.util.makeBodyUnselectable();
	event = this.util.getEvent(event);
	var posEvent = this.util.getEventPosition(event);
	this.__resizeHandler.style.left = posEvent.left + "px";
	
	return false;
};

nsGrid.__endResize = function(event)
{
	//putting this check as somehow the document evenlistener is not getting detached
	if(!this.__resizingHeader)
	{
		return;
	}
	this.util.removeEvent(document,"mousemove",this.__doResizeRef);
	this.__doResizeRef = null;
	this.util.removeEvent(document,"mouseup",this.__endResizeRef);
	this.__endResizeRef = null;
	this.util.removeEvent(selectedHeader,"mouseout",this.__headerMouseOutRef);
	this.__headerMouseOutRef = null;
	this.util.removeEvent(selectedHeader,"click",this.__headerClickRef);
	this.__headerClickRef = null;
	this.util.makeBodySelectable();
	event = this.util.getEvent(event);
	var selectedHeader = this.__resizingHeader;
	var tableHeader = this.__tblCenterHeader;
	var tableBody = this.__tblCenterBody;
	var posEvent = this.util.getEventPosition(event,this.__divCenterTableBodyContainer);
	var desiredWidth = posEvent.left - this.util.getCumulativeOffset(selectedHeader).x;
	this.__resize(tableHeader,this.__resizingHeaderCell,desiredWidth);
	this.__resize(tableBody,this.__resizingBodyCell,desiredWidth);
	if(this.__resizeHandler)
	{
		document.body.removeChild(this.__resizeHandler);
	}
	this.__resizingHeader = null;
	this.__resizingHeaderCell = null;
	this.__resizingBodyCell = null;
	this.__resizeHandler = null;
	event.stopImmediatePropagation();
	this.__handleColumnResize();
};

nsGrid.__createResizeHandler = function(event)
{
	this.__resizeHandler = this.util.createDiv(null,"nsResizeHandle");
	var posEvent = this.util.getEventPosition(event);
	this.__resizeHandler.style.top = this.util.getCumulativeOffset(this.__resizingHeader).y + "px";
	this.__resizeHandler.style.left = posEvent.left + "px";
	var scrollBarWidth = this.util.getScrollBarWidth(this.__divCenterTableBodyContainer);
	this.__resizeHandler.style.height = (this.__divCenterTableHeaderContainer.offsetHeight + this.__divCenterTableBodyContainer.offsetHeight - scrollBarWidth) + "px";
	var maxZIndex = this.util.getMaxZIndex(this.__resizingHeader); 
	if(maxZIndex > 0)
	{
		this.__resizeHandler.style.zIndex = maxZIndex;
	}
	document.body.appendChild(this.__resizeHandler);
};

nsGrid.__getHeaderTopCell = function(cell)
{
	if(cell)
	{
		var index = cell.cellIndex;
		if(this.__tblCenterHeader && this.__tblCenterHeader.tHead && this.__tblCenterHeader.tHead.rows.length > 0 && this.__tblCenterHeader.tHead.rows[0].cells.length > 0)
		{
			var headerCells = this.__tblCenterHeader.tHead.rows[0].cells;
			return headerCells[index];
		}
	}
	return null;
};

nsGrid.__getBodyTopCell = function(cell)
{
	if(cell)
	{
		var index = cell.cellIndex;
		if(this.__tblCenterBody && this.__tblCenterBody.tHead && this.__tblCenterBody.tHead.rows.length > 0 && this.__tblCenterBody.tHead.rows[0].cells.length > 0)
		{
			var bodyCells = this.__tblCenterBody.tHead.rows[0].cells;
			return bodyCells[index];
		}
	}
	return null;
};

/*******************************************************End of Column Resize Logic*************************************/
/******************************************************Start of Selection Functions*************************************************************/
nsGrid.__isRowSelected= function(row)
{
    if(row)
    {
        return this.util.hasStyleClass(row,"nsDataGridSelection");
    }   
    return false;
};

nsGrid.__markRowSelected= function(row)
{
    if(row)
    {
        if(!this.__isRowSelected(row))
        {
        	this.util.addStyleClass(row,"nsDataGridSelection");   
            this.__selectedItems.push(row);
        	var index = parseInt(row.getAttribute("ns-index"));
        	var item = this.__getItemByIndex(index);
            this.util.dispatchEvent(this,this.ITEM_SELECTED,item,{index:item[this.__rowKeyField]});
        }
    }
};

nsGrid.__markRowUnselected= function(row)
{
    if(this.__isRowSelected(row))
    {
    	this.util.removeStyleClass(row,"nsDataGridSelection");
        for (var count=0; count < this.__selectedItems.length ; count++)
        {
            if (parseInt(this.__selectedItems[count].getAttribute("ns-index")) === parseInt(row.getAttribute("ns-index")))
            {
                this.__selectedItems.splice(count,1);
                break;
            }
        }
        var index = parseInt(row.getAttribute("ns-index"));
        var item = this.__getItemByIndex(index);
        this.util.dispatchEvent(this,this.ITEM_UNSELECTED,item,{index:item[this.__rowKeyField]});
    }
};

nsGrid.__clearAllRowSelection= function()
{
    for (var count=0; count < this.__selectedItems.length ; count++)
    {
        if (this.__selectedItems[count])
        {
        	this.util.removeStyleClass(this.__selectedItems[count],"nsDataGridSelection");
        }
    }
    this.__selectedItems = [];
};

nsGrid.__multiSectionHandler= function(lastRow)
{
	 if(!lastRow)
	 {
		 return;
	 }
	 if (this.__selectedItems.length === 0)
	 {
		 this.__isRowSelected(lastRow);
	     return;
	 }
	 var firstRow = this.__selectedItems[this.__selectedItems.length - 1];
	 if(parseInt(lastRow.getAttribute("ns-index")) === parseInt(firstRow.getAttribute("ns-index")))
	 {
		 this.__markRowUnselected(lastRow);
		 return;
	 }
	 var isDown = (parseInt(lastRow.getAttribute("ns-index")) > parseInt(firstRow.getAttribute("ns-index")));
	 var isSelection = !this.__isRowSelected(lastRow);
	 var navigateRow = firstRow;
	 do
	 {
		  navigateRow = isDown ? navigateRow.nextSibling : navigateRow.previousSibling;
		  if (isSelection)
		  {
			  this.__markRowSelected(navigateRow);
		  }
		  else
		  {
			  this.__markRowUnselected(navigateRow);
		  }
	 }
	 while(parseInt(navigateRow.getAttribute("ns-index")) != parseInt(lastRow.getAttribute("ns-index")));
};

nsGrid.__setVisibilityOfColumn = function(index,isVisible)
{
	var style;
    if (isVisible) 
    {
    	style = "";
    }
    else
    {
    	style = "none";
    }
	var rows = this.__tblCenterHeader.getElementsByTagName("tr");
	for (var count = 0; count < rows.length;count++) 
	{
	     var cells = rows[count].cells;
	     if(cells.length > index)
	     {
	    	 cells[index].style.display = style;
	     }
	     else
	     {
	    	 return;
	     }
	}
	rows = this.__tblCenterBody.getElementsByTagName("tr");
	for (var count = 0; count < rows.length;count++) 
	{
	     var cells = rows[count].cells;
	     cells[index].style.display = style;
	}
	
};

/******************************************************End of Selection Functions*************************************************************/
/******************************************************Start of Filter Logic*************************************************************/
nsGrid.__highlightDiv = function(divText,colIndex)
{
	this.__nsGridFilter.__highlightDiv(divText,colIndex);
};
/******************************************************End of Filter Logic*************************************************************/
/******************************************************Start of Context Menu*************************************************************/

nsGrid.__initializeContextMenu = function()
{
	//if(!this.__contextMenu)
	//{
		var contextMenuSetting = {parent:this.__tblCenterBody,isContextMenu:true,createRunTime:true,sourceProvider:this.__getContextMenuDataProvider.bind(this),targetType:"TD"};
		if(this.__contextMenuSetting)
		{
			for(var key in this.__contextMenuSetting)
			{
				//grid setting should not be overriden by the users
				if(!contextMenuSetting[key])
				{
					contextMenuSetting[key] = this.__contextMenuSetting[key];
				}
			}
		}
		this.__contextMenu = new NSMenu(contextMenuSetting);
	//}
};

nsGrid.__getContextMenuDataProvider = function(cell)
{
	if(cell)
	{
		cell = this.util.findParent(cell,"TD");
		if(cell)
		{
			var row = this.util.findParent(cell,"TR");
			if(row)
			{
				var index = parseInt(row.getAttribute("ns-index"));
				var item = this.__getItemByIndex(index);
				if(item && this.__contextMenuProvider) 
				{
					return this.__contextMenuProvider(item,cell.cellIndex,index);
				}
			}
		}
	}
	return null;
};

/******************************************************End of Context Menu*************************************************************/
/******************************Custom Function *************************************/

nsGrid.__createTableAndParent = function(containerID,containerStyle,tableID)
{
	var divTableContainer = this.util.createDiv(containerID,containerStyle); 
	var table = document.createElement("TABLE");
	table.setAttribute("id",tableID);
	this.util.addStyleClass(table , this.__CLASS_TABLE);
	divTableContainer.appendChild(table);
	return divTableContainer;
};

nsGrid.__setMeasurement = function()
{
	this.__bodyScrollPos = 0;
};

nsGrid.__setBodyMeasurement = function()
{
	var divTitleBar = this.getElement(this.getID() + this.__TITLE_CONTAINER_ID);
	var divPagination = this.getElement(this.getID() + this.__PAGINATION_CONTROL_ID);
	var topHeight = this.__divCenterTableHeaderContainer.offsetHeight;
	if(divTitleBar)
	{
		topHeight += divTitleBar.offsetHeight;
	}
	if(divPagination)
	{
		topHeight += divPagination.offsetHeight;
	}
	var containerHeight = this.__divOuterContainer.offsetHeight;
	var containerWidth = this.__divOuterContainer.offsetWidth;
	var bodyContainerHeight = containerHeight - topHeight;
	this.__divCenterTableBodyContainer.style.height = bodyContainerHeight + "px";
	if(this.__divVirtualScrollParent)
	{
		var viewPortHeight = this.__divCenterTableBodyContainer.clientHeight;
		this.__divVirtualScrollParent.style.maxHeight = viewPortHeight + "px";
		if(this.__enableVariableRowHeight)
		{
			/*while(viewPortHeight > this.__tblCenterBody.offsetHeight && this.__totalRecords > this.__tblCenterBody.rows.length)
			{
				var rowLength = this.__tblCenterBody.rows.length;
				this.__createBodyBody(this.__arrInternalSource,rowLength - 1,rowLength);
			}*/
		}
	}
	var scrollBarWidth = this.util.getScrollBarWidth(this.__divCenterTableBodyContainer);
	this.__divCenterTableHeaderContainer.style.width = (this.__divCenterTableBodyContainer.offsetWidth - scrollBarWidth) + "px";
	this.__initialTableWidth = containerWidth - scrollBarWidth;
	if(!this.__synchronizeTablesRef)
	{
		this.__synchronizeTablesRef = this.__synchronizeTables.bind(this);
		this.util.addEvent(this.__divCenterTableBodyContainer,"scroll",this.__synchronizeTablesRef);
	}
};

nsGrid.__alignTables = function(fromSort)
{
	var getCells = function(tbl)
	{
		if(tbl && tbl.tHead && tbl.tHead.rows.length > 0)
		{
			return tbl.tHead.rows[0].cells;
		}
		return [];
	};
	var setCellWidth = function(arrCells,index,setWidth)
	{
		arrCells[index].style.width = setWidth + "px";
	};
	var headerCells = getCells(this.__tblCenterHeader);
	var bodyCells = getCells(this.__tblCenterBody);
	if(headerCells && headerCells.length > 0 && bodyCells && bodyCells.length > 0)
	{
		var totalWidth = 0;
		var count = 0;
		var widthToBeSet = 0;
		var self = this;
		var setWidths = function()
		{
			totalWidth += widthToBeSet;
			setCellWidth(headerCells,count,widthToBeSet);
			setCellWidth(bodyCells,count,widthToBeSet);
		};
		var setTotalCellWidth = function(arrCells)
		{
			for(count = 0;count < arrCells.length;count++)
			{
				var cell = arrCells[count];
				var item = self.__columns[count];
				widthToBeSet = self.util.getDimensionAsNumber(cell,cell.style.width);
				if(widthToBeSet === 0)
				{
					widthToBeSet = cell.getBoundingClientRect().width;//cell.offsetWidth;
				}
				if(!item.hasOwnProperty(self.__fieldColVisible) || item[self.__fieldColVisible])
				{
					setWidths();
				}
			}
		};
		if(fromSort)
		{
			setTotalCellWidth(headerCells);
		}
		else
		{
			setTotalCellWidth(bodyCells);
		}
		if(this.__initialTableWidth > totalWidth)
		{
			totalWidth = this.__initialTableWidth;
		}
		this.__tblCenterHeader.style.width = totalWidth + "px";
		this.__tblCenterBody.style.width = totalWidth + "px";
	}
};

nsGrid.__synchronizeTables = function(event) 
{
	var target = this.util.getTarget(event);
	//if(this.__scroller)
	//{
	//	this.__divCenterTableHeaderContainer.scrollLeft = event.scrollLeft;
	//}
	//else
	//{
		
		this.__divCenterTableHeaderContainer.scrollLeft = target.scrollLeft;
		//console.log(target.id + "," + target.scrollLeft + "," + this.__divCenterTableHeaderContainer.scrollLeft);
		//console.log(target.scrollLeft + "," + );
	//}
	if(this.__enableFixedColumnAnimation)
	{
		if(this.__fixedTimerTimeout != -1)
		{
			clearTimeout(this.__fixedTimerTimeout);
			this.__fixedTimerTimeout = -1;
		}
		var self = this;
		this.__fixedTimerTimeout = setTimeout(function()
		{ 
			self.__setFixedCellsPosition.bind(self)();
		},250);
	}
	else
	{
		this.__setFixedCellsPosition();
	}
};

nsGrid.__handleColumnResize = function(event)
{
	this.__alignTables(false);
	if(this.__enableVirtualScroll)
	{
		this.__setVirtualVariables(false,false,false,false);
	}
	this.__setFixedCellsPosition();
};

nsGrid.__expandCollapseAll = function(isCollapse)
{
	if(!this.__enableVirtualScroll && this.__getTotalRows() < this.__totalRecords)
	{
		this.util.warning("nsGrid","Please let all the rows to render.");
		return;
	}
	var dataSource = this.__arrInternalSource;
	if(dataSource && dataSource.length > 0)
	{
		if(this.__enableVirtualScroll)
		{
			this.__expandCollapseAllVirtual(dataSource,isCollapse);
		}
		else
		{
			this.__expandCollapseAllNormal(dataSource,isCollapse);
		}
	}
};

nsGrid.__expandCollapseAllNormal = function(dataSource,isCollapse)
{
	for(var count = 0;count < dataSource.length;count++)
	{
		var item = dataSource[count];
		//setting __fieldIsCollapsed here assuming that __showHideAllArrows() will be called after this function
		item[this.__fieldIsCollapsed] = isCollapse;
		if(parseInt(item[this.__fieldRowLevel]) > 0)
		{
			var row = item[this.__fieldRow];
			if(isCollapse)
			{
				row.style.display = "none";
				item[this.__fieldRowVisible] = false;
			}
			else
			{
				row.style.display = "";
				item[this.__fieldRowVisible] = true;
			}
		}
	}
	this.__showHideAllArrows(isCollapse);
};

nsGrid.__expandCollapseAllVirtual = function(dataSource,isCollapse)
{
	for(var count = 0;count < dataSource.length;count++)
	{
		var item = dataSource[count];
		//setting __fieldIsCollapsed here assuming that __showHideAllArrows() will be called after this function
		item[this.__fieldIsCollapsed] = isCollapse;
		if(parseInt(item[this.__fieldRowLevel]) > 0)
		{
			if(isCollapse)
			{
				item[this.__fieldRowVisible] = false;
			}
			else
			{
				item[this.__fieldRowVisible] = true;
			}
		}
	}
	this.__showHideAllArrows(isCollapse);
	this.__objGrid.__resetDataInBody(0,dataSource.length);
	this.__setVirtualVariables(false,true,isCollapse,false);
};

nsGrid.__showHideRow = function(rowIndex,compArrow,isCollapse)
{
	if(rowIndex > -1)
	{
		var item = this.__getItemByIndex(rowIndex);
		if(!compArrow)
		{
			compArrow = this.__getArrow(item[this.__fieldIndex]);
		}
		var rowLevel = parseInt(item[this.__fieldRowLevel]);
		var arrChildItems = [];
		if(item && item[this.__fieldHasChild])
		{
			var startIndex = 0;
			if(isCollapse)
			{
				arrChildItems = this.__arrInternalSource;
				startIndex = rowIndex;
			}
			else
			{
				arrChildItems = this.__getImmediateChildItems(arrChildItems, item);
			}
			if(this.__enableVirtualScroll)
			{
				this.__showHideRowVirtual(item,arrChildItems,startIndex,rowLevel,isCollapse);
			}
			else
			{
				this.__showHideRowNormal(item,arrChildItems,startIndex,rowLevel,isCollapse);
			}
			this.__setArrowDirection(compArrow,isCollapse);
			item[this.__fieldIsCollapsed] = isCollapse;
		}
	}
};

nsGrid.__showHideRowNormal = function(item,arrChildItems,startIndex,rowLevel,isCollapse)
{
	if(arrChildItems && arrChildItems.length > 0)
	{
		for(var count = startIndex;count < arrChildItems.length;count++)
		{
			var rowItem = arrChildItems[count];
			var row = rowItem[this.__fieldRow];
			if(isCollapse)
			{
				if(rowLevel >= parseInt(rowItem[this.__fieldRowLevel]))
				{
					break;
				}
				row.style.display = "none";
				rowItem[this.__fieldRowVisible] = false;
				if(rowItem[this.__fieldHasChild])
				{
					rowItem[this.__fieldIsCollapsed] = true;
					if(rowItem[this.__fieldRowArrow])
					{
						var divArrow = rowItem[this.__fieldRowArrow];
						if(divArrow)
						{
							this.__setArrowDirection(divArrow,true);
						}
					}
				}
			}
			else
			{
				row.style.display = "";
				rowItem[this.__fieldRowVisible] = true;
			}
		}
	}
};

nsGrid.__showHideRowVirtual = function(item,arrChildItems,startIndex,rowLevel,isCollapse)
{
	if(arrChildItems && arrChildItems.length > 0)
	{
		for(var count = startIndex;count < arrChildItems.length;count++)
		{
			var rowItem = arrChildItems[count];
			if(isCollapse)
			{
				if(rowLevel >= parseInt(rowItem[this.__fieldRowLevel]))
				{
					break;
				}
				rowItem[this.__fieldRowVisible] = false;
				if(rowItem[this.__fieldHasChild])
				{
					rowItem[this.__fieldIsCollapsed] = true;
				}
			}
			else
			{
				rowItem[this.__fieldRowVisible] = true;
			}
		}
		var arrRows = this.__tblCenterBodyBody.rows;
		var rowLength = arrRows.length;
		var row = item[this.__fieldRow];
		var index = item[this.__fieldIndex];
		//to get actual rowIndex use row.rowIndex
		this.__objGrid.__resetDataInBody(index,index + rowLength,row.rowIndex);
		this.__setVirtualVariables(false,true,isCollapse,true);
	}
};

nsGrid.__showHideAllArrows = function(isCollapse)
{
	var arrDivs = this.__getAllArrows();
	if(arrDivs && arrDivs.length > 0)
	{
		for(var count = 0;count < arrDivs.length;count++)
		{
			var div = arrDivs[count];
			if(div && div.hasAttribute("ns-parent-row-count"))
			{
				this.__setArrowDirection(div,isCollapse);
			}
		}
	}
};

nsGrid.__isNodeLastParent = function(item)
{
	var retValue = false;
	if(item && item[this.__fieldHasChild])
	{
		var arrChildItems = item[this.__childField];
		if(arrChildItems && arrChildItems.length > 0)
		{
			var hasChild = false;
			for(var count = 0;count < arrChildItems.length;count++)
			{
				var rowItem = arrChildItems[count];
				if(rowItem && rowItem[this.__fieldHasChild])
				{
					hasChild = true;
					break;
				}
			}
			if(!hasChild)
			{
				retValue = true;
			}
		}
	}
	return retValue;
};

nsGrid.__addCellText = function(row,item,div,colItem,colIndex)
{
	if(item && div && colItem)
	{
		var dataField = colItem["dataField"];
		var templateRenderer = colItem["templateRenderer"];
		var setData = colItem["setData"];
		var itemRenderer = colItem["itemRenderer"];
		var labelFunction = colItem["labelFunction"];
		var groupRenderer = colItem["groupRenderer"];
		var truncateToFit = colItem["truncateToFit"];
		var toolTipField = colItem["toolTipField"];
		var toolTipRenderer = colItem["toolTipRenderer"];
		var toolTipText = null;
		var isGroupedParent = (this.__enableGrouping && item[this.__isParentRowField]);
		//for Grouping
		if(isGroupedParent && groupRenderer)
		{
			var objRenderer = groupRenderer(item,dataField,item[this.__childField],colIndex,row);
			if(objRenderer)
			{
				if(this.util.isString(objRenderer))
				{
					var compBodySpan = document.createElement("span");
					compBodySpan.innerHTML = objRenderer;
					div.appendChild(compBodySpan);
				}
				else
				{
					div.appendChild(objRenderer);
				}
			}
		}
		else if(!isGroupedParent && itemRenderer)
		{
			var objRenderer = itemRenderer(item,dataField,item[this.__fieldIndex],colIndex,row);
			if(objRenderer)
			{
				if(this.util.isString(objRenderer))
				{
					var compBodySpan = document.createElement("span");
					compBodySpan.innerHTML = objRenderer;
					div.appendChild(compBodySpan);
				}
				else
				{
					div.appendChild(objRenderer);
				}
			}
		}
		else if(!isGroupedParent && templateRenderer)
		{
			div.appendChild(templateRenderer.cloneNode(true));
			this.__setDataInTemplateRenderer(div,item,dataField,setData,colItem,row);
		}
		else if(!isGroupedParent && labelFunction)
		{
			var text = labelFunction(item,dataField,colItem);
			div.appendChild(document.createTextNode(text));
		}
		else if(item.hasOwnProperty(dataField) && !this.util.isUndefined(item[dataField]) && item[dataField] != null)
	    {
			var text = item[dataField];
			div.appendChild(document.createTextNode(text));
	    }
		this.__highlightDiv(div,colIndex);
		if(toolTipField)
		{
			toolTipText = item[toolTipField];
		}
		else if(toolTipRenderer)
		{
			toolTipText = toolTipRenderer(item,dataField);
		}
		if(truncateToFit)
		{
			this.util.addStyleClass(div,"nsTruncateToFit");
			//This condition is above so that toolTip and title are not set togeather
			if(!toolTipText || toolTipText === "")
			{
				if(this.__enableToolTipForTruncateText)
				{
					toolTipText = div.textContent;
				}
				else
				{
					div.setAttribute("title",div.textContent);
				}
			}
		}
		if(toolTipText && toolTipText !== "")
		{
			this.__nsToolTipInElement.addToolTip(div,toolTipText);
		}
	}
};

nsGrid.__updateCellText = function(row,cell,item,colItem,rowIndex,colIndex)
{
	this.__objGrid.__updateCellText(row,cell,item,colItem,rowIndex,colIndex);
};

nsGrid.__setDataInTemplateRenderer = function(cellItem,data,dataField,setData,colItem,row)
{
	if(cellItem && setData)
	{
		this.__setRendererProperties(cellItem);
		this.__setRendererInData(cellItem,data,row);
		//IE bug
		cellItem.data = data;
		if(this.util.isFunction(setData))
	    {
			var strParam = "(cellItem,data,dataField,colItem,row)"; 
	    	if(this.util.isString(setData))
	    	{
	    		this.util.callFunctionFromString(setData + strParam,function(paramValue){
					if(paramValue === "cellItem")
					{
						return cellItem;
					}
					if(paramValue === "data")
					{
						return data;
					}
					if(paramValue === "dataField")
					{
						return dataField;
					}
					if(paramValue === "colItem")
					{
						return colItem;
					}
					if(paramValue === "row")
					{
						return row;
					}
					return paramValue;
				});
	    	}
	    	else
	    	{
	    		setData(cellItem,data,dataField,colItem,row);
	    	}
	    }
	}
};

nsGrid.__setRendererInData = function(cellItem,data,row)
{
	if(cellItem)
	{
		var compChild = null;
		for(var count = 0; count < cellItem.children.length; count++) 
		{
			compChild = cellItem.children[count];
			if(compChild)
			{
				compChild.data = data;
				compChild.row = row;
			}
			//IE 9 Bug,you got to assign it back
			//listItem.children[count] = compChild;
			this.__setRendererInData(compChild,data,row);
		}
	}
};

nsGrid.__setRendererProperties = function(cellItem)
{
	if(cellItem)
	{
		var compChild = null;
		for(var count = 0; count < cellItem.children.length; count++) 
		{
			compChild = cellItem.children[count];
			var grid = this;
			Array.prototype.slice.call(compChild.attributes).forEach(function(attribute) 
			{
		        if(grid.util.isFunction(attribute.value))
		        {
		        	var newValue = attribute.value + "(this)";
		        	compChild.removeAttribute(attribute.name);
					compChild.setAttribute(attribute.name,newValue);
		        }
			});
			if(compChild)
			{
				if(compChild.hasAttribute("accessor-name"))
				{
					cellItem[compChild.getAttribute("accessor-name")] = compChild;
				}
			}
			this.__setRendererProperties(compChild);
		}
	}
};

nsGrid.__calculateCellExpectedHeight = function(templateRenderer)
{
	var retHeight =  -1;
	if(templateRenderer)
	{
		var tempRenderer = templateRenderer.cloneNode(true);
		tempRenderer.removeAttribute("id");
		this.addChild(tempRenderer);
		retHeight = tempRenderer.offsetHeight;
		if(retHeight <= 0)
		{
			retHeight = this.util.getDimensionAsNumber(tempRenderer,tempRenderer.style.height);
		}
		this.deleteChild(tempRenderer);
	}
	return retHeight;
};

nsGrid.__getAllItems = function()
{
	return this.__objGrid.__getFlatSource();
};

nsGrid.__getImmediateChildItems = function(arrItems,item)
{
	if(!arrItems)
	{
		arrItems = [];
	}
	if(item && item[this.__fieldHasChild])
	{
		var arrChild = this.__arrInternalSource;
		var rowLevel = parseInt(item[this.__fieldRowLevel]);
		var startIndex = item[this.__fieldIndex];
		var length = arrChild.length;
		for(var count = startIndex;count < length;count++)
		{
			var itemChild = arrChild[count];
			var childRowLevel = parseInt(itemChild[this.__fieldRowLevel]);
			if(rowLevel >= childRowLevel)
			{
				break;
			}
			if((rowLevel + 1) === childRowLevel)
			{
				arrItems.push(itemChild);
			}
		}
	}
	return arrItems;
};

nsGrid.__getAllChildItems = function(arrItems,item)
{
	if(!arrItems)
	{
		arrItems = [];
	}
	if(item && item[this.__fieldHasChild])
	{
		var arrChild = this.__arrInternalSource;
		var rowLevel = parseInt(item[this.__fieldRowLevel]);
		var startIndex = item[this.__fieldIndex];
		var length = arrChild.length;
		for(var count = startIndex;count < length;count++)
		{
			var itemChild = arrChild[count];
			if(rowLevel >= parseInt(itemChild[this.__fieldRowLevel]))
			{
				break;
			}
			arrItems.push(itemChild);
		}
	}
	return arrItems;
};

nsGrid.__getAllVisibleItems = function()
{
	var totalRecords = 0;
	var arrItems = this.__getAllItems();
	if(arrItems && arrItems.length > 0)
	{
		for(var count = 0;count < arrItems.length;count++)
		{
			var item = arrItems[count];
			if(item && item[this.__fieldRowVisible])
			{
				totalRecords += 1;
			}
		}
	}
	return totalRecords;
};

nsGrid.__getArrow = function(rowCount)
{
	var arrDivs = this.__getAllArrows();
	if(arrDivs && arrDivs.length > 0)
	{
		for(var count = 0;count < arrDivs.length;count++)
		{
			var div = arrDivs[count];
			if(div && div.hasAttribute("ns-parent-row-count"))
			{
				var rowParentCount = div.getAttribute("ns-parent-row-count");
				if(rowParentCount && rowParentCount == rowCount)
				{
					return div;
				}
			}
		}
	}
};

nsGrid.__getAllArrows = function(divParent)
{
	if(!divParent)
	{
		divParent = this.__tblCenterBody;
	}
	return divParent.querySelectorAll(".nsArrow");
};

nsGrid.__getTotalRows = function()
{
	if(this.__tblCenterBodyBody && this.__tblCenterBodyBody.rows)
	{
		return this.__tblCenterBodyBody.rows.length;
	}
	return 0;
};

nsGrid.__getRowFromItem = function(item)
{
	var row = null;
	if(item)
	{
		row = item[this.__fieldRow];
		var index = item[this.__fieldIndex];
		//below case is true if row reference has been removed due to virtual scroll 
		if(!row || row.rowIndex === -1)
		{
			var arrRows = this.__tblCenterBodyBody.querySelectorAll('[ns-index="' + index + '"]');
			if(arrRows && arrRows.length > 0)
			{
				row = arrRows[0];
			}
		}
	}
	return row;
};

nsGrid.__getItemByIndex = function(indexToFind,source)
{
	if(!source)
	{
		source = this.__objGrid.__getFlatSource();
	}
	if(source && source.length > 0)
	{
		for(var count = 0;count < source.length;count++)
		{
			var item = source[count];
			if(item && item[this.__fieldIndex] === indexToFind)
			{
				return item;
			}
		}
	}
	return null;
};

nsGrid.__getItemBykeyField = function(keyFieldValue,source)
{
	if(!source)
	{
		source = this.__objGrid.__getFlatSource();
	}
	if(source && source.length > 0)
	{
		for(var count = 0;count < source.length;count++)
		{
			var item = source[count];
			if(item && item[this.__rowKeyField] === keyFieldValue)
			{
				return item;
			}
		}
	}
	return null;
};

nsGrid.__getColumnObject = function(index,arrColumn)
{
	if(!arrColumn)
	{
		arrColumn = this.__columns;
	}
	index = parseInt(index);
	if(arrColumn && index > -1 && index < arrColumn.length)
	{
		var item = null;
		for(var count = 0;count < arrColumn.length;count++)
		{
			item = arrColumn[count];
			if(item[this.__fieldColIndex] === index)
			{
				return item;
			}
		}
	}
	return null;
};

nsGrid.__getColumnIndexByObject = function(objColumn,arrColumn)
{
	if(!arrColumn)
	{
		arrColumn = this.__columns;
	}
	if(arrColumn && objColumn)
	{
		for(var count = 0;count < arrColumn.length;count++)
		{
			if(arrColumn[count][this.__fieldColIndex] === objColumn[this.__fieldColIndex])
			{
				return count;
			}
		}
	}
	return -1;
};

nsGrid.__getColumnObjectByDataField = function(dataField,arrColumn)
{
	if(!arrColumn)
	{
		arrColumn = this.__columns;
	}
	if(arrColumn && dataField)
	{
		for(var count = 0;count < arrColumn.length;count++)
		{
			var item = arrColumn[count];
			if(item["dataField"] === dataField)
			{
				return item;
			}
		}
	}
	return null;
};

nsGrid.__getColumnIndexForSwapOrRemove = function(column,arrColumn)
{
	if(!arrColumn)
	{
		arrColumn = this.__columns;
	}
	var index = -1;
	//checking below like this because column = 0 then column will return false;
	if(!this.util.isUndefined(column) && column != null)
	{
		if(this.util.isNumber(column) && arrColumn && column < arrColumn.length)
		{
			index = column;
		}
		else if(this.util.isString(column))
		{
			for(var count = 0;count < arrColumn.length;count++)
			{
				var item = arrColumn[count];
				if(item["dataField"] === column)
				{
					index = count;
					break;
				}
			}
		}
	}
	else
	{
		this.util.warning("nsGrid","Please pass valid column information.");
	}
	return index;
};

nsGrid.__isColumnValidForSwapOrRemove = function(columnIndex,operation)
{
	if(this.__isColumnIndexValid(columnIndex))
	{
		if((this.__enableHierarchical && columnIndex === 0) || (this.__enableGrouping && (columnIndex === 0 || this.__columns[columnIndex]["dataField"] === this.__groupByField)))
		{
			if(operation)
			{
				this.util.warning("nsGrid","This column cannot be " + operation + ".");
			}
			return false;
		}
		return true;
	}
	return false;
	
};

nsGrid.__swapCell = function(sourceCell,destinationCell)
{
	if(sourceCell && destinationCell)
	{
		var destinationCellIndex = destinationCell.cellIndex;
		this.__moveCell(destinationCell,sourceCell.cellIndex);
		this.__moveCell(sourceCell,destinationCellIndex);
		return true;
	}
	return false;
};

nsGrid.__moveCell = function(fromCell,toIndex)
{
	if(fromCell && toIndex > -1)
	{
		var row = fromCell.parentNode;
		row.removeChild(fromCell);
		row.insertBefore(fromCell,row.cells[toIndex]);
		return true;
	}
	return false;
};

nsGrid.__createColumnProvider = function(arrColumns)
{
	if(arrColumns && arrColumns.length > 0)
	{
		var hasColumnProviderChanged = this.__hasColumnProviderChanged(arrColumns);
		console.log(hasColumnProviderChanged);
		var base = this;
		var getOrignalColumnInfo = function(dataField)
		{
			for (var count = 0;count < base.__orignalColumns.length;count++)
			{
				var colOrigItem = base.__orignalColumns[count];
				if(colOrigItem["dataField"] === dataField)
				{
					return colOrigItem;
				}
			}
			return null;
		};
		this.__columns = [];
		for (var count = 0;count < arrColumns.length;count++)
		{
			var objColumn = arrColumns[count];
			var columnInfo = getOrignalColumnInfo(objColumn["dataField"]);
			if(columnInfo)
			{
				if(objColumn.hasOwnProperty(this.__fieldColSortedAsc) && objColumn[this.__fieldColSortedAsc] != null)
				{
					columnInfo[this.__fieldColSortedAsc] = objColumn[this.__fieldColSortedAsc];
				}
				if(objColumn.hasOwnProperty(this.__fieldColIndex) && objColumn[this.__fieldColIndex] != null)
				{
					columnInfo[this.__fieldColIndex] = objColumn[this.__fieldColIndex];
				}
				if(objColumn.hasOwnProperty(this.__fieldColVisible) && objColumn[this.__fieldColVisible] != null)
				{
					columnInfo[this.__fieldColVisible] = objColumn[this.__fieldColVisible];
				}
				if(!hasColumnProviderChanged && objColumn.hasOwnProperty("width") && objColumn["width"] != null)
				{
					columnInfo["width"] = objColumn["width"];
				}
				var index = columnInfo[this.__fieldColIndex];
				if(this.__columns[index])
				{
					this.__columns.splice(index, 0, columnInfo);
				}
				else
				{
					this.__columns[index] = columnInfo;
				}
			}
		}
	}
	else
	{
		this.__columns = this.__orignalColumns.slice(0);
	}
};

nsGrid.__hasColumnProviderChanged = function(arrColumns)
{
	if(!arrColumns || !this.__orignalColumns || this.__orignalColumns.length !== arrColumns.length)
	{
		return true;
	}
	var length = this.__orignalColumns.length;
	var count = 0;
	for(count = 0;count < length;count++)
	{
		var colItem = this.__orignalColumns[count];
		for(var innerCount = 0;innerCount < length;innerCount++)
		{
			if(colItem["dataField"] === arrColumns[innerCount]["dataField"])
			{
				break;
			}
		}
	}
	return (count !== length);
};

nsGrid.__processDefaultSort = function()
{
	for(var count = 0; count < this.__columns.length;count++)
	{
		var objColumn = this.__columns[count];
		if(objColumn.hasOwnProperty(this.__fieldColSortedAsc) && objColumn[this.__fieldColSortedAsc] != null)
		{
			var headerBodyRow = this.__tblCenterHeader.tBodies[0].rows[0];
			var arrHeaderCells = headerBodyRow.cells;
			var cell = arrHeaderCells[count];
			this.__nsGridSort.handle(cell,objColumn,objColumn[this.__fieldColSortedAsc]);
			return true;
		}
	}
	return false;
};

nsGrid.__editColumnArray = function(mode,item)
{
	//item should be column object
	if(mode === "add")
	{
		this.__columns[this.__columns.length] = item;
		this.__orignalColumns[this.__orignalColumns.length] = item;
	}
	else if(mode === "swap")
	{
		
	}
	//item should be column index
	else if(mode === "hide")
	{
		var colItem = this.__columns[item];
		colItem[this.__fieldColVisible] = false;
	}
	else if(mode === "show")
	{
		var colItem = this.__columns[item];
		colItem[this.__fieldColVisible] = true;
	}
};

nsGrid.__isColumnIndexValid = function(columnIndex)
{
	if(columnIndex > -1 && columnIndex < this.__columns.length)
	{
		return true;
	}
	return false;
	
};

nsGrid.__isMouseOnElement = function(element, currentX, currentY)
{
	var offset = this.util.getCumulativeOffset(element);
	return (currentY >= offset.y &&
			currentY <  offset.y + element.offsetHeight &&
            currentX >= offset.x + element.offsetWidth - 5 &&
            currentX <  offset.x + element.offsetWidth);
};

nsGrid.__updateTotalRecords = function(totalCount)
{
	if(!totalCount)
	{
		totalCount = this.__arrInternalSource.length; 
	}
	//update total Rows if no server side call and pagination mode is manual
	if(!(this.__enableServerCall || (this.__enablePagination && !this.__isPaginationModeAuto)) || this.__rowsRendered)
	{
		this.__totalRecords = totalCount;
	}
};

nsGrid.__addPriorityClassInCell = function(cell,colItem)
{
	if(this.__isResponsiveModeColumnToggle && cell && colItem)
	{
		this.util.addStyleClass(cell,"column-priority-" + colItem["priority"]);
	}
};

nsGrid.__setGridType = function()
{
	if(this.__type === this.GRID_TYPE_HIERARCHICAL)
	{
		this.__enableHierarchical = true;
		this.__objGrid = new NSHierarchicalGrid(this,this.util);
	}
	else if(this.__type === this.GRID_TYPE_GROUP)
	{
		this.__enableGrouping = true;
		this.__objGrid = new NSGroupingGrid(this,this.util);
	}
	else
	{
		this.__objGrid = new NSFlatGrid(this,this.util);
	}
};

nsGrid.__setPaginationType = function()
{
	if(!this.__paginationType || this.__paginationType === this.PAGINATION_TYPE_SCROLL)
	{
		this.__isPaginationTypeScroll = true;
	}
	else
	{
		this.__isPaginationTypeScroll = false;
	}
};

nsGrid.__setPaginationMode = function()
{
	if(!this.__paginationMode || this.__paginationMode === this.PAGINATION_MODE_AUTO)
	{
		this.__isPaginationModeAuto = true;
	}
	else
	{
		this.__isPaginationModeAuto = false;
	}
	if(!(this.__isPaginationTypeScroll && this.__isPaginationModeAuto))
	{
		this.__enableAsyncLoadPagination = false;
	}
};

nsGrid.__setResponsiveMode = function()
{
	if(this.__enableResponsive)
	{
		if(!this.__responsiveMode || this.__responsiveMode === this.RESPONSIVE_MODE_STACK)
		{
			this.__isResponsiveModeStack = true;
			this.__isResponsiveModeColumnToggle = false;
			this.__arrQueries = ["only screen and (max-width: 760px),(min-device-width: 768px) and (max-device-width: 1024px)"];
		}
		else
		{
			this.__arrQueries = ["only screen and (min-width: 960px)",
			                     "only screen and (max-width: 960px) and (min-width: 800px)",
			                     "only screen and (max-width: 800px) and (min-width: 640px)",
			                     "only screen and (max-width: 640px) and (min-width: 480px)",
			                     "only screen and (max-width: 480px) and (min-width: 320px)",
			                     "only screen and (max-width: 320px)"];
			this.__isResponsiveModeColumnToggle = true;
			this.__isResponsiveModeStack = false;
		}
	}
	else
	{
		this.__isResponsiveModeColumnToggle = false;
		this.__isResponsiveModeStack = false;
	}
	
};

nsGrid.__checkForVirtualMode = function()
{
	if(this.__enableVirtualScroll)
	{
		/*if(this.__enableHierarchical || this.__enableGrouping)
		{
			this.__enableVirtualScroll = false;
		}*/
		if(this.__enablePagination)
		{
			this.__enableVirtualScroll = false;
		}
	}
};

nsGrid.__addSVGInPage = function()
{
	var objSVG = new NSSvg();
	//for header Menu
	var circleDownArrowID = "svgCircleDownArrow";
	var groupDown = objSVG.createGroup(circleDownArrowID + "group");
	var circle = objSVG.createCircle(circleDownArrowID + "circle",8,8,8,null);
	groupDown.appendChild(circle);
	var polygon = objSVG.createPolygon(circleDownArrowID + "polygon","2,5.5 14,5.5 8,11.5","nsMenuArrow");
	groupDown.appendChild(polygon);
	objSVG.addElementInSymbol(circleDownArrowID,"0 0 16 16",groupDown);
	if(this.__enableExport)
	{
		var svgShapes = new NSSvgShapes();
		svgShapes.addExportInPage();
	}
	if(this.__enableFilter)
	{
		var svgShapes = new NSSvgShapes();
		svgShapes.addFilterIcon();
		svgShapes.addSearchIcon();
	}
	this.__objGrid.__addSVGInPage(objSVG);
	this.__imgUtil = new this.util.image();
};

nsGrid.__addStyleInDOM = function()
{
	if(this.__enableMouseHover)
    {
		this.util.addCSSClassInDOM(["#" + this.getID() + " .nsGridRow:hover > td"],["background-color: #CCCCCC!important;"]);
    }
};

nsGrid.__addRowHeightInDOM = function()
{
	if(!this.__enableVariableRowHeight)
	{
		var rowHeight = null;
		if(this.__rowHeight > 0)
		{
			rowHeight = this.__rowHeight + "px";
		}
		else if(this.__virtualRowHeight > 0)
		{
			rowHeight = this.__virtualRowHeight + "px";
		}
		if(rowHeight)
	    {
			this.util.addCSSClassInDOM(["#" + this.getID() + " .nsBodyDataGridCell > div"],["max-height:" + rowHeight + ";"]);
	    }
	}
};

nsGrid.__initializePluggins = function()
{
	if(!this.__nsGridSort)
	{
		this.__nsGridSort = new NSGridSort(this);
		this.__nsGridColumnMove = new NSGridColumnMove(this);
		this.__nsGridFilter = new NSGridFilter(this);
		this.__nsToolTipInElement = new this.util.nsToolTipInElement();
	}
};

nsGrid.__handleHiddenColumn = function()
{
	var length = this.__columns.length;
	for(var count = 0;count < length;count++)
	{
		var objColumn = this.__columns[count];
		if(objColumn[this.__fieldColVisible] === false)
		{
			this.__setColumnVisibility(count,false);
		}
	}
};

nsGrid.__setColumnVisibility = function(index,isVisible)
{
	if(isVisible)
	{
		this.util.removeCSSClassInDOM(["#" + this.getID() + " .nsGridCell:nth-child(" + (index + 1) +")"]);
	}
	else
	{
		this.util.addCSSClassInDOM(["#" + this.getID() + " .nsGridCell:nth-child(" + (index + 1) +")"],["display:none;"]);
	}
};

nsGrid.__addColumnPseudoStyle = function()
{
	var arrClass = [];
	var arrCSSText = [];
	if(this.__tblCenterHeader.tBodies && this.__tblCenterHeader.tBodies.length > 0 && this.__tblCenterHeader.tBodies[0].rows && this.__tblCenterHeader.tBodies[0].rows.length > 0)
	{
		var headerCells = this.__tblCenterHeader.tBodies[0].rows[0].cells;
		var colIndex = 0;
		var cell = null;
        for(colIndex = 0; colIndex < headerCells.length; colIndex++)
        {
        	cell = headerCells[colIndex];
        	arrClass.push("#" + this.getID() + ".nsMobileStackGrid td:nth-of-type(" + (colIndex + 1) + "):before");
        	arrCSSText.push("content: '" + cell.textContent.trim() + "';");
        }
	}
	this.util.addCSSClassInDOM(arrClass,arrCSSText,false);
};
/******************************End of Custom Function *************************************/
/******************************Loader Related Function *************************************/
nsGrid.showLoader = function()
{
	if(!this.__loader)
	{
		this.__loader = new this.util.loader(this.__divOuterContainer);
	}
	this.__loader.show();
};

nsGrid.hideLoader = function()
{
	if(this.__loader)
	{
		this.__loader.hide();
	}
};
/******************************End of Loader Related Function *************************************/
/******************************Start of Export Related Function *************************************/
nsGrid.__exportHandler = function(target,item)
{
	if(item)
	{
		if(!this.__exportFileName || this.__exportFileName === "")
		{
			this.__exportFileName = "Download";
		}
		var nsExport = new NSExport(this,this.__exportFileName);
		switch (item.id) 
		{
		    case 0:
		    	nsExport.excel("xls",this.__exportFileName);
		        break;
		    case 1:
		    	nsExport.csv();
		        break;
		    case 2:
		    	nsExport.word("doc");
		        break;
		    case 3:
		    	nsExport.text();
		        break;
		    case 4:
		    	nsExport.xml();
		        break;
		    case 5:
		    	nsExport.json();
		        break;
		    case 6:
		    	nsExport.pdf();
		        break;
		    case 7:
		    	nsExport.image();
		        break;
		    case 8:
		    	nsExport.excel("xlsx",this.__exportFileName);
		        break;
		    case 9:
		    	nsExport.word("docx");
		        break;
		}
	}
};
/******************************End of Export Related Function *************************************/
document.registerElement("ns-grid", {prototype: nsGrid});