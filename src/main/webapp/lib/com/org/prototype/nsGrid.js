"use strict";
var NSGrid = (function()
{
	function NSGrid(component,setting) 
	{
		//this.base.call(this);
		this.GRID_TYPE_HIERARCHICAL = "hierarchical";
		this.GRID_TYPE_GROUP = "group";
		this.GRID_TYPE_NORMAL = "normal";
		this.GRID_TYPE_MASTER_DETAIL = "masterdetail";
		this.PAGINATION_TYPE_SCROLL = "scroll";
		this.PAGINATION_TYPE_PAGES = "pages";
		this.PAGINATION_MODE_AUTO = "auto";
		this.PAGINATION_MODE_MANUAL = "manual";
		this.RESPONSIVE_MODE_STACK = "stack";
		this.RESPONSIVE_MODE_COLUMN_TOGGLE = "columnToggle";
		this.MULTICOLUMN_KEY_SHIFT = "shift";
		this.MULTICOLUMN_KEY_CTRL = "ctrl";
		this.MULTICOLUMN_KEY_ALT = "alt";
		
		this.NAVIGATION_UP = "up";
		this.NAVIGATION_DOWN = "down";
		
		//this.initializeDOM(ns.NSDATAGRID_CSS);
		
		this.__OUTER_CONTAINER_ID = "divDataSet";
		this.__TITLE_CONTAINER_ID = "divTitleBar";
		this.__TABLE_HEADER_CONTAINER_WRAPPER_ID = "divHeaderContainerWrapper";
		this.__TABLE_BODY_CONTAINER_WRAPPER_ID = "divBodyContainerWrapper";
		this.__TABLE_FOOTER_CONTAINER_WRAPPER_ID = "divFooterContainerWrapper";
		this.__TABLE_LEFT_HEADER_CONTAINER_ID = "divLeftHeaderContainer";
		this.__TABLE_LEFT_HEADER_ID = "tblLeftHeader";
		this.__TABLE_LEFT_BODY_CONTAINER_ID = "divLeftBodyContainer";
		this.__TABLE_LEFT_BODY_ID = "tblLeftBody";
		this.__TABLE_LEFT_FOOTER_CONTAINER_ID = "divLeftFooterContainer";
		this.__TABLE_LEFT_FOOTER_ID = "tblLeftFooter";
		this.__TABLE_CENTER_HEADER_CONTAINER_ID = "divCenterHeaderContainer";
		this.__TABLE_CENTER_HEADER_ID = "tblCenterHeader";
		this.__TABLE_CENTER_BODY_CONTAINER_ID = "divCenterBodyContainer";
		this.__TABLE_CENTER_BODY_ID = "tblCenterBody";
		this.__TABLE_CENTER_FOOTER_CONTAINER_ID = "divCenterFooterContainer";
		this.__TABLE_CENTER_FOOTER_ID = "tblCenterFooter";
		this.__TABLE_RIGHT_HEADER_CONTAINER_ID = "divRightHeaderContainer";
		this.__TABLE_RIGHT_HEADER_ID = "tblRightHeader";
		this.__TABLE_RIGHT_BODY_CONTAINER_ID = "divRightBodyContainer";
		this.__TABLE_RIGHT_BODY_ID = "tblRightBody";
		this.__TABLE_RIGHT_FOOTER_CONTAINER_ID = "divRightFooterContainer";
		this.__TABLE_RIGHT_FOOTER_ID = "tblRightFooter";
		this.__PAGINATION_CONTROL_ID = "divPagination";
		
		this.__CLASS_TABLE = "nsDataGridTable";
		this.__CLASS_TITLEBAR = "nsDataGridTitleBar";
		this.__CLASS_TABLE_HEADER_CELL = "nsDataGridHeader";
		this.__CLASS_TABLE_HEADER_DROPPABLE_CELL = "nsDataGridDroppableHeader";
		this.__CLASS_BODY_CONTAINER = "nsDataGridBodyContainer";
		this.__CLASS_ODD_ROW = "nsDataGridOddRow";
		this.__CLASS_EVEN_ROW = "nsDataGridEvenRow";
		this.__CLASS_SELECTED_ROW = "nsDataGridSelection";
		this.__CLASS_GROUP_CELL = "nsGroupCell";
		this.__CLASS_CELL_CHILD = "nsCellChild";
		
		this.__DEFAULT_COLUMN_WIDTH = 100;
		this.__INFINITE_SCROLL_PADDING = 40;
		this.__INFINITE_SCROLL_INITIAL_LOAD = 250;
		
		this.__columns = [];
		this.__orignalColumns = [];
		this.__orignalItemKey = [];
		this.__navigationIndex = -1;
		this.__selectedIndex = -1;
		this.__selectedItem = null;
		this.__selectedIndexes = [];
		this.__selectedItems = [];
		this.__lastNavigationDirection = null;
	
		this.__title = null;
		this.__type = this.GRID_TYPE_NORMAL;
		this.__dataSource = null;
		this.__arrColumns = null;
		this.__context = window;
		this.__enableHierarchical = false;
		this.__enableGrouping = false;
		this.__enableMasterDetail = false;
		this.__enableMouseHover = false;
		this.__mouseHoverColor = "#CCCCCC";
		this.__enableColumnMouseHover = false;
		this.__enableMultipleSelection = false;
		this.__enableKeyboardNavigation = false;
		this.__enableCustomScrollBar = false;
		this.__columnResizable = false;
		this.__columnDraggable = false;
		this.__columnSortable = true;
		this.__columnAutoSize = false;
		this.__enableContextMenu = false;
		this.__enableVariableRowHeight = false;
		this.__enableFilter = false;
		this.__filterFunction = null;
		this.__hierarchyFilterChildrenFunction = null;
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
		this.__enableColumnSetting = false;
		this.__enableRowSelection = true;
		this.__enableCellSelection = false;
		this.__enableMultiCellSelection = false;
		this.__enableMultiSort = false;
		this.__enableEditable = false;
		this.__showExpandCollapseIcon = true;
		this.__isPopUp = false; 
		this.__isPaginationTypeScroll = true;
		this.__isPaginationModeAuto = true;
		
		this.__isResponsiveModeStack = true;
		this.__isResponsiveModeColumnToggle = false;
		this.__totalRecords = 0;
		this.__contextMenuProvider = null;
		this.__contextMenuSetting = null;
		this.__responsiveMode = this.RESPONSIVE_MODE_STACK;
		this.__paginationFetchRecordCallBack = null;
		this.__eventDispatcher = null;
		this.__heightOffset = null;
		this.__editorSetting = null;
		//for Virtual Scroll
		this.__virtualScrollSetting = {};
		this.__nsVirtualScroll = null; 
		this.__virtualRowHeight = 0;
		//for DataRefreshOnScrollEnd
		this.__dataRefreshfireDelay = 100;
		
		this.__scrollOffsetPosition = 0;
		this.__componentResizingInterval = -1;
		this.__divPagination = null;
		
		this.__divOuterContainer = null;
		this.__divTableWrapper = null;
		this.__divTableHeaderContainerWrapper = null;
		this.__divTableBodyContainerWrapper = null;
		this.__divTableFooterContainerWrapper = null;
		this.__divCenterTableHeaderContainer = null;
		this.__tblCenterHeader = null;
		this.__tblCenterHeaderBody = null;
		this.__divCenterTableBodyContainer = null;
		this.__tblCenterBody = null;
		this.__tblCenterBodyBody = null;
		this.__divCenterTableFooterContainer = null;
		this.__tblCenterFooter = null;
		this.__tblCenterFooterBody = null;
		//stores whether mouse is on GridLine
		this.__onGridLine = false;
		this.__addRemoveRowCallInternal = false;
		this.__lastBodyCellFocus = null;
		this.__isColumnResizing = false;
		
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
		this.__enableFooter = false;
		this.__tableRectFixedColumn = null;
		//for Row Mover
		this.__enableRowMove = false;
		this.__isSameTableMove = false;
		this.__rowMoverDropEndHandler = null;
		//flag to figure out that text of cell is cached or not
		//generally for IE this should be true to improve performance except when we are using Virtual scrolling
		this.__renderInCachedMode = false;
		this.__customClass = {};
		//for Multicolumn Sort
		this.__multiColumnKey = this.MULTICOLUMN_KEY_SHIFT;
		this.__isMultiColumnKeyPressed = false;
		this.__dateComponent = null;
		
		this.__headerExtraRowCount = 0;
		
		this.__loader = null;
		this.__scroller = null;
		this.__scrollerSetting = {};
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
		this.__arrFilteredGroupedSource = [];
		// This flag stops componentResized code to be called first time 
		this.__isComponentResizedCallCorrect = false;
		this.__customScrollBarSetting = {};
		//Custom Scrollbar Tooltip
		this.__enableScrollBarTip = false;
		this.__scrollBarTipLabelFunction = null;
		this.__divScrollTipContainer = null;
		this.__divScrollTipText = null;
		this.__scrollTipInterval = null;
		 //queue up the functions not called as Creation Complete called later
		this.__queueFunc = [];
		//if columns total width is less than parent still Table will fill all the width if this flag is true 
		this.__fillParentWidth = true;
		this.__enableAutoResize = false;
		
		this.__fieldPrefix = "ns_field";
		this.__fieldIndex = this.__fieldPrefix + "_row_index";
		this.__fieldVisibleIndex = this.__fieldPrefix + "_row_visible_index";
		this.__fieldRow = this.__fieldPrefix + "_row";
		this.__fieldRowHtml = this.__fieldPrefix + "_row";
		this.__fieldRowLevel = this.__fieldPrefix + "_row_level";
		this.__fieldRowVisible = this.__fieldPrefix + "_row_visible";
		this.__fieldRowHover = this.__fieldPrefix + "_row_hover";
		this.__fieldParentIndex = this.__fieldPrefix + "_parent_index";
		this.__fieldHasChild = this.__fieldPrefix + "_row_hasChild";
		this.__fieldHasParent = this.__fieldPrefix + "_row_hasParent";
		this.__fieldIsCollapsed = this.__fieldPrefix + "_row_isCollapsed";
		this.__fieldRowArrow = this.__fieldPrefix + "row_arrow";
		this.__fieldCellText = this.__fieldPrefix + "cell_text";
		this.__fieldSelected = this.__fieldPrefix + "_selected";
		this.__fieldColIndex = this.__fieldPrefix + "_col_index";
		this.__fieldColSortedAsc = this.__fieldPrefix + "_col_sorted_asc";
		this.__fieldColVisible = this.__fieldPrefix + "_col_visible";
		
		this.__isShiftPressed = false;
		this.__isCtrlPressed = false;
		
		this.__synchronizeTablesRef = null;
		this.__divCenterTableBodyMouseUpRef = null;
		this.__bodyScrollRef = null;
		this.__keyDownRef = null;
		this.__keyUpRef = null;
		this.__tableCellNavigatorEventRef = null;
		this.__tableCellSelectionEventRef = null;
		
		//mobile touch events
		this.__enableTouchEvents = true;
		this.__objTouchEvents = new Map();
		
		this.__objGrid = null;
		this.__nsGridColumnMove = null;
		this.__nsGridColumnResize = null;
		this.__nsGridSort = null;
		this.__nsGridFilter = null;
		this.__nsGridKeyboard = null;
		this.__nsToolTipInElement = null;
		this.__nsTableCellNavigator = null;
		this.__nsCellSelection = null;
		this.__multiCellSelectionSetting = null;
		this.__icons = {menu:null,filter:null,sortAscending:null,sortDescending:null,columnMove:null,exportButton:null,columnSetting:null,rowExpanded:null,rowCollapsed:null};
		this.__nsGridEditor = null;
		this.__nsPopUpColumnSetting = null;
		this.__setting = setting;
		this.base.__setBaseComponent.call(this,component,true);
	};
	nsExtendPrototype(NSContainerBase,NSGrid);
	NSGrid.prototype.constructor = NSGrid;
	
	NSGrid.prototype.initializeComponent = function() 
	{
		this.base.initializeComponent.call(this);
		this.__setFields();
		this.__setSetting();
	};
	
	NSGrid.prototype.setComponentProperties = function() 
	{
		this.base.setComponentProperties.call(this);
		this.__initializePluggins();
		this.__setGridType();
		this.__objGrid.__initialize();
		this.__addListenerForBody();
		this.__setPaginationType();
		this.__setPaginationMode();
		this.__setResponsiveMode();
		this.__checkForVirtualMode();
		this.__addSVGInPage();
		this.__addStyleInDOM();
		if(this.__arrColumns)
		{
			this.setColumn(this.__arrColumns);
		}
		if(this.__dataSource)
		{
			this.dataSource(this.__dataSource);
		}
		if(this.__queueFunc && this.__queueFunc.length > 0)
		{
			for(var count = this.__queueFunc.length - 1;count > -1;count--)
			{
				this.__queueFunc[count]();
				this.__queueFunc.splice(count, 1);
			}
		}
	};
	
	NSGrid.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty)
	{
		if(setProperty)
		{
			this.__setting[attrName] = newVal;
			this.__objGrid.propertyChange(attrName, oldVal, newVal, setProperty);
		}
		this.base.propertyChange.call(this,attrName, oldVal, newVal, setProperty);
	};
	
	NSGrid.prototype.blurHandler = function(event)
	{
		this.base.blurHandler.call(this);
		this.__dispatchInternalEvent("blur");
	};
	
	NSGrid.prototype.componentResized = function(event,force) 
	{
		//console.log("In Grid componentResized");
		if(this.__enableAutoResize || force)
		{
			if(this.__isComponentResizedCallCorrect || this.__isPopUp)
			{
				var baseMeasurement = this.__baseComponent.getBoundingClientRect();
				if(!this.__lastBaseMeasurement || this.__lastBaseMeasurement.height !== baseMeasurement.height || this.__lastBaseMeasurement.width !== baseMeasurement.width)
				{
					//if (this.__componentResizingInterval != -1)
					//{
						clearTimeout(this.__componentResizingInterval);
						this.__componentResizingInterval = -1;
					//}
					var self = this;
					if(this.util.hasStyleClass(this.__baseComponent,"nsMobileStackGrid"))
					{
						this.__componentResizingInterval = setTimeout(
						function()
						{ 
							self.__componentResizingInterval = -1;
							if(self.__divOuterContainer)
							{
								console.log("In Resize" + self.__tblCenterBody.style.width);
								self.__setComponentHeight.bind(self)();
								self.__setOuterContainerMeasurement.bind(self)();
								var scrollBarWidth = self.util.getScrollBarWidth(self.__getVerticalScrollableContainer());
								var width = self.__divOuterContainer.getBoundingClientRect().width - scrollBarWidth;
								self.__setTableWidth.call(self,width);
								self.__setBodyMeasurement();
								self.__lastBaseMeasurement = self.__baseComponent.getBoundingClientRect();
							}
						},500);
					}
					else
					{
						this.__componentResizingInterval = setTimeout(
						function()
						{ 
							self.__componentResizingInterval = -1;
							self.reRender.call(self);
							self.base.componentResized.call(self,event);
						},500);
					}
				}
			}
			this.__isComponentResizedCallCorrect = true;
		}
	};
	
	NSGrid.prototype.setHeightOffset = function(offset)
	{
		this.__heightOffset = offset;
		this.__setComponentHeight();
		this.reRender();
	};
	
	NSGrid.prototype.__setSetting = function()
	{
		var setting = this.__setting;
		if(setting)
		{
			if(this.hasAttribute("nsTitle"))
			{
				this.__title = this.getAttribute("nsTitle");
			}
			if(this.hasAttribute("type"))
			{
				this.__type = this.getAttribute("type");
				if(!this.__type)
				{
					this.__type = this.GRID_TYPE_NORMAL;
				}
			}
			if(this.hasAttribute("context"))
			{
				this.__context = this.getAttribute("context");
			}
			if(this.hasAttribute("enableMouseHover"))
			{
				this.__enableMouseHover = Boolean.parse(this.getAttribute("enableMouseHover"));
			}
			if(this.hasAttribute("mouseHoverColor") && this.getAttribute("mouseHoverColor"))
			{
				this.__mouseHoverColor = this.getAttribute("mouseHoverColor");
			}
			if(this.hasAttribute("enableMultipleSelection"))
			{
				this.__enableMultipleSelection = Boolean.parse(this.getAttribute("enableMultipleSelection"));
			}
			if(this.hasAttribute("enableKeyboardNavigation"))
			{
				this.__enableKeyboardNavigation =  Boolean.parse(this.getAttribute("enableKeyboardNavigation"));
			}
			if(this.hasAttribute("enableColumnMouseHover"))
			{
				this.__enableColumnMouseHover =  Boolean.parse(this.getAttribute("enableColumnMouseHover"));
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
			if(this.hasAttribute("enableCustomScrollBar"))
			{
				this.__enableCustomScrollBar =  Boolean.parse(this.getAttribute("enableCustomScrollBar"));
			}
			if(this.hasAttribute("customScrollBarSetting"))
			{
				this.__scrollerSetting = this.getAttribute("customScrollBarSetting");
			}
			if(this.hasAttribute("columnResizable"))
			{
				this.__columnResizable =  Boolean.parse(this.getAttribute("columnResizable"));
			}
			if(this.hasAttribute("columnDraggable"))
			{
				this.__columnDraggable = Boolean.parse(this.getAttribute("columnDraggable"));
			}
			if(this.hasAttribute("columnAutoSize"))
			{
				this.__columnAutoSize = Boolean.parse(this.getAttribute("columnAutoSize"));
			}
			if(this.hasAttribute("columnSortable"))
			{
				this.__columnSortable = Boolean.parse(this.getAttribute("columnSortable"));
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
			if(this.hasAttribute("paginationFetchRecordCallBack"))
			{
				this.__paginationFetchRecordCallBack =  this.getAttribute("paginationFetchRecordCallBack");
				this.__paginationFetchRecordCallBack = this.util.getFunction(this.__paginationFetchRecordCallBack);
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
			if(this.hasAttribute("filterFunction"))
			{
				this.__filterFunction = this.getAttribute("filterFunction");
				this.__filterFunction = this.util.getFunction(this.__filterFunction);
			}
			if(this.hasAttribute("hierarchyFilterChildrenFunction"))
			{
				this.__hierarchyFilterChildrenFunction = this.getAttribute("hierarchyFilterChildrenFunction");
				this.__hierarchyFilterChildrenFunction = this.util.getFunction(this.__hierarchyFilterChildrenFunction);
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
			if(this.hasAttribute("enableColumnSetting"))
			{
				this.__enableColumnSetting =  Boolean.parse(this.getAttribute("enableColumnSetting"));
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
			if(this.hasAttribute("enableRowSelection"))
			{
				this.__enableRowSelection =  Boolean.parse(this.getAttribute("enableRowSelection"));
			}
			if(this.hasAttribute("enableCellSelection"))
			{
				this.__enableCellSelection =  Boolean.parse(this.getAttribute("enableCellSelection"));
			}
			if(this.hasAttribute("enableMultiCellSelection"))
			{
				this.__enableMultiCellSelection =  Boolean.parse(this.getAttribute("enableMultiCellSelection"));
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
			if(this.hasAttribute("heightOffset"))
			{
				this.__heightOffset =  this.getAttribute("heightOffset");
			}
			if(this.hasAttribute("enableMultiSort"))
			{
				this.__enableMultiSort =  Boolean.parse(this.getAttribute("enableMultiSort"));
			}
			if(this.hasAttribute("enableEditable"))
			{
				this.__enableEditable =  Boolean.parse(this.getAttribute("enableEditable"));
			}
			if(this.hasAttribute("editorSetting"))
			{
				this.__editorSetting =  this.getAttribute("editorSetting");
			}
			if(this.hasAttribute("multiColumnKey") && this.getAttribute("multiColumnKey"))
			{
				this.__multiColumnKey =  this.getAttribute("multiColumnKey");
			}
			if(this.hasAttribute("enableFooter"))
			{
				this.__enableFooter =  Boolean.parse(this.getAttribute("enableFooter"));
			}
			if(this.hasAttribute("dataSource"))
			{
				this.__dataSource = this.getAttribute("dataSource");
			}
			if(this.hasAttribute("columns"))
			{
				this.__arrColumns = this.getAttribute("columns");
			}
			if(this.hasAttribute("headerExtraRowCount"))
			{
				this.__headerExtraRowCount = parseInt(this.getAttribute("headerExtraRowCount"));
			}
			if(this.hasAttribute("customClass"))
			{
				this.__customClass = this.getAttribute("customClass");
				if(!this.__customClass)
				{
					this.__customClass = {};
				}
			}
			if(this.hasAttribute("theme") && this.getAttribute("theme"))
			{
				this.__theme = this.getAttribute("theme");
			}
			if(this.hasAttribute("showExpandCollapseIcon"))
			{
				this.__showExpandCollapseIcon = this.util.isUndefinedOrNull(this.getAttribute("showExpandCollapseIcon")) ? true : Boolean.parse(this.getAttribute("showExpandCollapseIcon"));
			}
			if(this.hasAttribute("dateComponent") && this.getAttribute("dateComponent"))
			{
				this.__dateComponent = this.getAttribute("dateComponent");
			}
			//isPopUp should be true if the grid is used in cases like autocomplete so that componentResized is called multiple times so that width is adjusted properly
			if(this.hasAttribute("isPopUp"))
			{
				this.__isPopUp =  Boolean.parse(this.getAttribute("isPopUp"));
			}
			//eventDispatcher to support different frameworks 
			if(this.hasAttribute("eventDispatcher"))
			{
				this.__eventDispatcher =  this.getAttribute("eventDispatcher");
				this.__eventDispatcher = this.util.getFunction(this.__eventDispatcher);
			}
			if(this.hasAttribute("multiCellSelectionSetting"))
			{
				this.__multiCellSelectionSetting = this.getAttribute("multiCellSelectionSetting");
			}
			else
			{
				this.__multiCellSelectionSetting = {scrollableElement:null,enableFillHandle:false,enableKeyboardNavigation:true,enableCopy:true,enablePaste:true,cellClass:null,areaClass:null,areaClassLeft:null,areaClassRight:null,areaClassTop:null,areaClassBottom:null};
			}
			if(this.hasAttribute("icons"))
			{
				this.__icons =  this.getAttribute("icons");
			}
			if(this.hasAttribute("enableTouchEvents"))
			{
				this.__enableTouchEvents = Boolean.parse(this.getAttribute("enableTouchEvents"));
			}
			if(this.hasAttribute("enableAutoResize"))
			{
				this.__enableAutoResize = Boolean.parse(this.getAttribute("enableAutoResize"));
			}
			if(this.hasAttribute("fillParentWidth"))
			{
				this.__fillParentWidth = Boolean.parse(this.getAttribute("fillParentWidth"));
			}
			if(this.hasAttribute("customScrollBarSetting"))
			{
				this.__customScrollBarSetting = this.getAttribute("customScrollBarSetting");
			}
			else
			{
				this.__customScrollBarSetting = {verticalScrollButtons: {enable: true},horizontalScrollButtons:{enable: true}};
			}
			if(this.hasAttribute("virtualScrollSetting"))
			{
				this.__virtualScrollSetting = this.getAttribute("virtualScrollSetting");
			}
			else
			{
				this.__virtualScrollSetting = {pageSize: null,pagesRendered: null,enableScrollDelay: false,scrollInterval: null,resizeInterval: null,enableLoader: false,getLoaderComponent: null};
			}
			if(this.hasAttribute("components"))
			{
				this.__components = this.getAttribute("components");
			}
			else
			{
				this.__components = {datePicker: null};
			}
			if(this.__enableVirtualScroll)
			{
				if(this.hasAttribute("enableScrollBarTip"))
				{
					this.__enableScrollBarTip =  Boolean.parse(this.getAttribute("enableScrollBarTip"));
				}
				if(this.hasAttribute("scrollBarTipLabelFunction"))
				{
					this.__scrollBarTipLabelFunction = this.getAttribute("scrollBarTipLabelFunction");
					this.__scrollBarTipLabelFunction = this.util.getFunction(this.__scrollBarTipLabelFunction);
				}
			}
		}
	};
	
	NSGrid.prototype.hasAttribute = function(attributeName)
	{
		return (this.__setting.hasOwnProperty(attributeName) || this.__setting.hasOwnProperty(attributeName.toLowerCase()));
	};
	
	NSGrid.prototype.getAttribute = function(attributeName)
	{
		var value = this.__setting[attributeName];
		if(this.util.isUndefined(value))
		{
			value = this.__setting[attributeName.toLowerCase()];
		}
		return value;
	};
	
	NSGrid.prototype.deviceViewChanged = function(conditionTrue,queryIndex,query) 
	{
		queryIndex = parseInt(queryIndex);
		var self = this;
		var refresh = function()
		{
			if(self.__nsVirtualScroll)
			{
				self.__nsVirtualScroll.refresh(true);
				self.__divCenterTableBodyContainer.scrollTop = 0;
			}
		};
		if(this.__isResponsiveModeStack)
		{
			if(conditionTrue)
			{
				this.util.addStyleClass(this.__baseComponent,"nsMobileStackGrid");
				refresh();
			}
			else
			{
				this.util.removeStyleClass(this.__baseComponent,"nsMobileStackGrid");
				refresh();
			}
			this.componentResized(null,true);
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
			var reset = function()
			{
				self.util.removeStyleClass(self.__baseComponent,"nsMobileColumnToggleGrid960");
				self.util.removeStyleClass(self.__baseComponent,"nsMobileColumnToggleGrid800");
				self.util.removeStyleClass(self.__baseComponent,"nsMobileColumnToggleGrid640");
				self.util.removeStyleClass(self.__baseComponent,"nsMobileColumnToggleGrid480");
				self.util.removeStyleClass(self.__baseComponent,"nsMobileColumnToggleGrid320");
			};
			if(postFix)
			{
				reset();
				if(postFix != ">960" && conditionTrue)
				{
					this.util.addStyleClass(this.__baseComponent,className + postFix);
				}
				refresh();
			}
		}
		this.base.deviceViewChanged.call(this,conditionTrue,query);
	};
	
	//call this function when outer container width or height changes and enableAutoResize is false
	NSGrid.prototype.reRender = function()
	{
		if(this.__divOuterContainer)
		{
			this.__setComponentHeight();
			this.__setOuterContainerMeasurement();
			//done the below so that if the width of cell is in % then it will take its corresponding value after resize
			this.__setTableWidth(null);
			this.__renderBody(false);
			this.__lastBaseMeasurement = this.__baseComponent.getBoundingClientRect();
		}
	};
	
	NSGrid.prototype.getGridState = function()
	{
		var data = {};
		data.columns = this.__columns;
		return data;
	};
	
	//setState name conflicts with react setState method
	NSGrid.prototype.setGridState = function(data)
	{
		if(data)
		{
			if(data["columns"] && data["columns"].length > 0)
			{
				this.__createColumnProvider(data["columns"]);
			}
		}
	};
	
	NSGrid.prototype.setColumn = function(arrColumns)
	{
		//moving __initializePluggins here to ensure that the Pluggins are downloaded and then they are initialized
		this.__initializePluggins();
		if(arrColumns && arrColumns.length > 0)
		{
			this.__orignalColumns = arrColumns;
			this.__objGrid.__checkForAdditionalColumns();
			this.__processPinnedColumn();
			for(var count = 0;count < this.__orignalColumns.length;count++)
			{
				var item = this.__orignalColumns[count];
				//reset column visibility initially
				this.__setColumnVisibility(count,true,item);
				this.__processColumnObject(item,count);
			}
		}
		else
		{
			this.__orignalColumns = [];
		}
		this.__columns = this.__orignalColumns.slice(0);
	};
	
	NSGrid.prototype.setContextMenuSetting = function(contextMenuSetting)
	{
		this.__contextMenuSetting = contextMenuSetting;
	};
	
	NSGrid.prototype.dataSource = function(source,isReset)
	{
		if(!this.util.isUndefined(source))
		{
			//var start = new Date().getTime();
			if(this.util.isUndefinedOrNull(isReset))
			{
				isReset = true;
			}
			this.__dataSource = source;
			if(this.__isCreationCompleted)
			{
				this.__rowsRendered = false;
				if(isReset)
				{
					this.__setComponentHeight();
				}
				this.__resetPluggins();
				this.__createStructure();
				this.__callPlugginsInitialize();
				this.__addColumnPseudoStyle();
				if(this.__dataSource && this.__dataSource.length > 0 && this.__dataSource[0])
				{
					this.__orignalItemKey = Object.keys(this.__dataSource[0]);
					this.__objGrid.dataSource();
				}
				else
				{
					this.__arrWrapper = [];
					this.__arrInternalSource = [];
					this.__updateTotalRecords(0);
				}
				this.__setMeasurement();
				if(isReset)
				{
					this.__nsGridSort.reset();
				}
				this.__setHeaderSortFunction();
				if(isReset || !this.__processDefaultSort())
				{
					this.__renderBody(false);
				}
				this.__handleHiddenColumn();
				this.__addRowHeightInDOM();
				//setTimeout(function(){ self.__dispatchEvent(NSGrid.GRID_RENDERED); }, 700);
				if(this.__enableAutoResize)
				{
					this.attachResizeListener();
				}
				this.__objGrid.afterGridRendered();
				this.__dispatchEvent(NSGrid.GRID_RENDERED);
				
				/*var end = new Date().getTime();
				var time = end - start;
				console.debug('Execution time: ' + (time / 1000.0));*/
			}
			else
			{
				//always add as the first item so that when execute we can start from end and remove the elements
				this.__queueFunc.splice(0, 0, this.dataSource.bind(this,source,isReset));
			}
		}
		return this.__dataSource;
	};
	
	NSGrid.prototype.getOrignalItem = function(item)
	{
		if(item && this.__orignalItemKey && this.__orignalItemKey.length > 0)
		{
			var retItem = {};
			var key = null;
			for(var count = 0;count < this.__orignalItemKey.length;count++)
			{
				key = this.__orignalItemKey[count];
				if(!this.util.startsWith(key,this.__fieldPrefix))
				{
					retItem[key] = item[key];
				}
			}
			return retItem;
		}
		return item;
	};
	
	NSGrid.prototype.addRows = function(source)
	{
		this.__stopScroll = true;
		if(source && source.length > 0)
		{
			var startIndex = this.__arrInternalSource.length;
			if(!this.__addRemoveRowCallInternal)
	   	 	{
				this.__objGrid.__setWrapperSource(source,startIndex,-1,0,true);
	   	 	}
			//this logic might be wrong for filtered result or sorted list
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
	
	NSGrid.prototype.removeRows = function(arrIndex)
	{
		if(!this.__enableHierarchical && !this.__enableGrouping && !this.__enableMasterDetail && arrIndex && arrIndex.length > 0)
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
	
	NSGrid.prototype.groupBy = function(groupByField)
	{
		if(this.__enableGrouping && groupByField && groupByField.length > 0)
		{
			if(this.__setting)
			{
				this.__setting["groupByField"] = groupByField;
			}
			this.propertyChange("groupByField",this.__groupByField,groupByField,true);
		}
	};
	
	NSGrid.prototype.expandAll = function()
	{
		if(this.__enableHierarchical || this.__enableGrouping || this.__enableMasterDetail)
		{
			this.__expandCollapseAll(false);
		}
	};
	
	NSGrid.prototype.collapseAll = function()
	{
		if(this.__enableHierarchical || this.__enableGrouping || this.__enableMasterDetail)
		{
			this.__expandCollapseAll(true);
		}
	};
	
	NSGrid.prototype.expandByRow = function(element,rowIndex)
	{
		this.expandCollapseByRow(element,rowIndex,false);
	};
	
	NSGrid.prototype.collapseByRow = function(element,rowIndex)
	{
		this.expandCollapseByRow(element,rowIndex,true);
	};
	
	NSGrid.prototype.expandByKeyField = function(keyFieldValue) 
	{
		this.expandCollapseByKeyField(keyFieldValue,false);
	};
	
	NSGrid.prototype.collapseByKeyField = function(keyFieldValue) 
	{
		this.expandCollapseByKeyField(keyFieldValue,true);
	};
	
	NSGrid.prototype.expandCollapseByKeyField = function(keyFieldValue,isCollapse)
	{
		if(!this.util.isUndefinedOrNull(keyFieldValue))
		{
			var item = this.__getItemBykeyField(keyFieldValue);
			if(item)
			{
				var index = this.__getIndexByItem(item);
				this.expandCollapseByRow(null,index,isCollapse);
			}
		}
	};
	
	NSGrid.prototype.expandCollapseByRow = function(element,rowIndex,isCollapse)
	{
		if(element)
		{
			element = this.util.findParent(element,"TR");
			if(element)
			{
				rowIndex = parseInt(element.getAttribute("ns-index"));
			}
		}
		if(rowIndex > 0)
		{
			if(this.util.isUndefinedOrNull(isCollapse)) {
				isCollapse = this.__isRowCollapsed(null,rowIndex);
				isCollapse = !isCollapse;
			}
			rowIndex = parseInt(rowIndex);
			this.__showHideRow(rowIndex,element,isCollapse);
			var item = this.__getItemByIndex(rowIndex);
			this.__objGrid.arrowClickHandler(item,isCollapse);
		}
		else 
		{
			this.util.warning("NSGrid","Row Index starts with index 1.");
		}
	};
	
	NSGrid.prototype.getRowInfo = function(row)
	{
		if(row)
		{
			var objInfo = {};
			objInfo.rowIndex = parseInt(row.getAttribute("ns-index"));
			objInfo.rowLevel = parseInt(row.getAttribute("ns-level"));
			objInfo.rowParentIndex = parseInt(row.getAttribute("ns-parent-index"));
			objInfo.item = this.__getItemByIndex(objInfo.rowIndex);
			objInfo.rowOrignalIndex = objInfo.item[this.__fieldVisibleIndex];
			return objInfo;
		}
		return null;
	};
	
	NSGrid.prototype.getCellInfo = function(cell)
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
	
	NSGrid.prototype.getItemInfo = function(objItem)
	{
		var objReturn = null;
		if(!this.util.isUndefinedOrNull(objItem))
		{
			var target = null;
			var event = this.util.getEvent(objItem);
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
			else if(this.util.isNumber(objItem))
			{
				var index = parseInt(objItem);
				var item = this.__getItemByIndex(index);
				if(item)
				{
					/*if(item[this.__fieldRow])
					{
						objReturn = this.getRowInfo(item[this.__fieldRow]);
					}
					else
					{*/
						objReturn = {};
						objReturn.rowIndex = item[this.__fieldIndex];
						objReturn.rowOrignalIndex = item[this.__fieldVisibleIndex];
						objReturn.rowLevel = item[this.__fieldRowLevel];
						objReturn.rowParentIndex = item[this.__fieldParentIndex];
						objReturn.parentItem = this.__getItemByIndex(objReturn.rowParentIndex);
						objReturn.item = item;
					//}
				}
			}
			else if (this.util.isObject(objItem) && objItem.hasOwnProperty(this.__fieldIndex)) 
			{
            	var objReturn = {};
                objReturn.rowIndex = objItem[this.__fieldIndex];
                objReturn.rowOrignalIndex = objItem[this.__fieldVisibleIndex];
                objReturn.rowLevel = objItem[this.__fieldRowLevel];
                objReturn.rowParentIndex = objItem[this.__fieldParentIndex];
                objReturn.item = objItem;
            }
		}
		return objReturn;
	};
	
	NSGrid.prototype.getItemInfoByKeyField = function(keyFieldValue)
	{
		var objReturn = null;
		if(!this.util.isUndefinedOrNull(keyFieldValue))
		{
			var item = this.__getItemBykeyField(keyFieldValue);
			if(item)
			{
				objReturn = this.getItemInfo(item);
			}
		}
		return objReturn;
	};
	
	NSGrid.prototype.cascadeValues = function(event,callBack)
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
			var rowIndex = objCellInfo.rowIndex;
			var retIndex = this.__getActualIndex(flatSource,rowIndex);
			if(retIndex !== rowIndex)
			{
				rowIndex = (retIndex + 1);
			}
			var groupItem = objCellInfo["item"];//flatSource[rowIndex];
			if(groupItem)
			{
				groupItem[dataField] = cascadeValue;
			}
			for(var count = rowIndex;count < flatSource.length;count ++)
			{
				var item = flatSource[count];
				var childRow = item[this.__fieldRow];
				if(item[this.__fieldRowLevel] !== objCellInfo.rowLevel)
				{
					var isSetValue = false;
	                var setValue = null;
	                if(childRow && item[this.__fieldRowVisible])
	                {
	                   var childCell = childRow.cells[cellIndex];
	                   if(childCell.getElementsByTagName(control.tagName).length > 0)
	                   {
	                      var childControl = childCell.getElementsByTagName(control.tagName)[0];
	                      if(childControl)
	                      {
	                             if(callBack)
	                             {
	                                callBack(control,childControl,item,dataField,cellIndex,colItem,childCell,row);
	                                isSetValue = false;
	                             }
	                             else
	                             {
	                                setValue = this.util.setControlValue(childControl,cascadeValue);
	                                isSetValue = true;
	                             }
	                      }
	                   }
	                   else if(callBack)
		               {
		                  callBack(control,null,item,dataField,cellIndex,colItem,null,row);
		                  isSetValue = false;
		               }
		               else
		               {
		            	  setValue = cascadeValue;
		                  isSetValue = true;
		               }
	                }
	                else if(callBack)
	                {
	                    callBack(control,null,item,dataField,cellIndex,colItem,null,row);
	                    isSetValue = false;
	                }
	                else
	                {
	                   setValue = cascadeValue;
	                   isSetValue = true;
	                }
	                if(isSetValue)
	                {
	                   item[dataField] = setValue;
	                }
	                this.updateItemInDataSource(item);
				}
				else
				{
					break;
				}
			}
		}
	};
	
	NSGrid.prototype.setFontSize = function(fontSize)
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
	NSGrid.prototype.addColumn = function(objColumn)
	{
		if(objColumn)
		{
			this.__processColumnObject(objColumn,this.__columns.length);
			if(!this.__isColumnExist(objColumn["dataField"]))
			{
				this.__editColumnArray("add",objColumn);
				var headerRow = this.__getHeaderHeaderRow(this.__tblCenterHeader);
				if(headerRow)
				{
					var headerBodyRow = this.__getHeaderBodyRow(this.__tblCenterHeader);
					var rendererRow = this.__getHeaderFilterRow(this.__tblCenterHeader);
					if(headerBodyRow)
					{
						this.__createHeaderColGroup(objColumn);
						this.__createHeaderHeaderCell(objColumn,headerRow);
					    this.__createHeaderBodyCell(objColumn,headerBodyRow,rendererRow,this.__columns.length - 1);
					}
				}
				var bodyRow = this.__getBodyHeaderRow(this.__tblCenterBody);
		    	if(bodyRow)
				{
		    		var arrRows = this.__getBodyBodyRow(this.__tblCenterBody);
		    		if(arrRows && arrRows.length > 0)
		    		{
		    			var arrItems = this.__arrInternalSource;
			    		this.__createBodyColGroup(objColumn);
			    		this.__createBodyHeaderCell(objColumn,bodyRow);
			    		var row = null;
			    		var item = null;
			    		for (var rowCount = 0; rowCount < arrRows.length; rowCount++) 
			    		{
			    			row = arrRows[rowCount];
			    			item = arrItems[rowCount];
			    			var colIndex = this.__columns.length - 1;
			    			var cell = this.__createBodyRowCell(row,colIndex,true);
			    			this.__setBodyCellProperty(row,cell,item,objColumn,colIndex,-1,0,true);
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
		this.util.warning("NSGrid","Please pass valid Column object to be added.");
		return false;
	};
	
	//programmatic method to call deviceViewChanged
	NSGrid.prototype.changeDeviceView = function(conditionTrue)
	{
		this.deviceViewChanged(conditionTrue);
	};
	
	NSGrid.prototype.hideColumn = function(column)
	{
		var index = this.__getColumnIndexForSwapOrRemove(column);
		if(index > -1)
		{
			if(this.__isColumnValidForSwapOrRemove(index,"hidden"))
			{
				//this.__removeHeaderCell(index);
				//this.__removeBodyColumn(index);
				//this.__removeFooterColumn(index);
				this.__editColumnArray("hide",index);
				this.__setColumnVisibility(index,false);
				this.__alignTables(false);
				this.__addColumnPseudoStyle();
				return true;
			}
		}
		return false;
	};
	
	NSGrid.prototype.showColumn = function(column)
	{
		var index = this.__getColumnIndexForSwapOrRemove(column);
		if(index > -1)
		{
			this.__editColumnArray("show",index);
			this.__setColumnVisibility(index,true,column);
			return true;
		}
		return false;
	};
	
	NSGrid.prototype.swapColumns = function(sourceColumn,destinationColumn)
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
				this.__swapOrMoveFooterCell("swap",sourceIndex,destinationIndex);
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
	
	NSGrid.prototype.moveColumn = function(column,toIndex)
	{
		var sourceIndex = this.__getColumnIndexForSwapOrRemove(column);
		toIndex = this.__getColumnIndexForSwapOrRemove(toIndex);
		if(sourceIndex > -1 && toIndex > -1 && sourceIndex !== toIndex)
		{
			var sourceValid = this.__isColumnValidForSwapOrRemove(sourceIndex,"moved");
			var destinationValid = this.__isColumnValidForSwapOrRemove(toIndex,"moved");
			if(sourceValid && destinationValid)
			{
				this.__swapOrMoveHeaderCell("move",sourceIndex,toIndex);
				this.__swapOrMoveBodyCell("move",sourceIndex,toIndex);
				this.__swapOrMoveFooterCell("move",sourceIndex,toIndex);
				var currentColumn = this.__columns[toIndex];
				var direction = "no";
				if((currentColumn && currentColumn.pinned) || this.__columns[sourceIndex].pinned)
				{
					this.__columns[sourceIndex].pinned = null;
					if(currentColumn.pinned)
					{
						direction = currentColumn.pinned;
						this.__columns[sourceIndex].pinned = currentColumn.pinned;
					}
					this.__updateFixedColCounts();
					this.__createFixedRows();
				}
				this.__alignTables(false);
				//this.__setFixedCellsPosition();
				this.__columns[sourceIndex][this.__fieldColIndex] = toIndex;
				this.util.moveArrayItem(this.__columns,sourceIndex,toIndex);
				var smallIndex = Math.min(sourceIndex,toIndex);
				for(var count = smallIndex;count < this.__columns.length;count++)
				{
					this.__columns[count][this.__fieldColIndex] = count;
				}
				this.__addColumnPseudoStyle();
				this.__updateColumnClassForFixedColumns(toIndex,direction);
				this.__addStyleForFixedColumns();
				return true;
			}
		}
		return false;
	};
	
	NSGrid.prototype.sortBy = function(column,isAscending)
	{
		var index = this.__getColumnIndexForSwapOrRemove(column);
		var headerBodyRow = this.__getHeaderBodyRow(this.__tblCenterHeader);
		if(index > -1 && headerBodyRow)
		{
			var arrHeaderCells = headerBodyRow.cells;
			var cell = arrHeaderCells[index];
		    var columnDetail = this.__getColumnObject(cell.getAttribute("currentColumnIndex"));
		    this.__nsGridSort.handle(cell,columnDetail,false,isAscending);
		}
	};
	
	NSGrid.prototype.autoResizeColumn = function(column)
	{
		var index = this.__getColumnIndexForSwapOrRemove(column);
		this.__nsGridColumnResize.autoResize(index);
	};
	
	NSGrid.prototype.pinColumn = function(column,direction)
	{
		var index = this.__getColumnIndexForSwapOrRemove(column);
		var columnDetail = this.__getColumnObject(index);
		if(columnDetail)
		{
			if(columnDetail.pinned != direction)
			{
				var toIndex = -1;
				switch(direction)
				{
					case "left":
						for(var count = 0;count < this.__columns.length;count++)
						{
							if(this.__columns[count].pinned != "left")
							{
								toIndex = count;
								break;
							}
						}
					break;
					case "right":
						//this.__columns = this.__orignalColumns.slice(0);
						for(var count = this.__columns.length - 1;count > -1;count--)
						{
							if(this.__columns[count].pinned != "right")
							{
								toIndex = count;
								break;
							}
						}
					break;
					
				}
				var update = false;
				if(toIndex > -1)
				{
					if(this.moveColumn(index,toIndex)) {
						update = true;
					}
				}
				else {
					update = true;
					toIndex = index;
				}
				if(update) {
					columnDetail.pinned = direction;
					this.__updateFixedColCounts();
					this.__createFixedRows();
					//this.__setFixedCellsPosition();
					this.__updateColumnClassForFixedColumns(toIndex,direction);
					this.__addStyleForFixedColumns();
				}
			}
		}
	};
	
	NSGrid.prototype.updateRowByIndex = function(index)
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
	
	NSGrid.prototype.updateRowByKeyField = function(keyFieldValue)
	{
		var item = this.__getItemBykeyField(keyFieldValue);
		if(item)
		{
			var row = this.__getRowFromItem(item);
			if(row && parseInt(row.getAttribute("ns-index")) === item[this.__fieldIndex])
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
	
	NSGrid.prototype.updateCellByIndex = function(index,dataField)
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
	
	NSGrid.prototype.updateCellByKeyField = function(keyFieldValue,dataField)
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
	
	NSGrid.prototype.updateItemInDataSource = function(item)
	{
		this.__updateItemInSource(item);
	};
	
	NSGrid.prototype.getGroupedSource = function()
	{
		return this.__arrFilteredGroupedSource;
	};
	
	NSGrid.prototype.setSelectedItems = function(arrItems)
	{
		if(arrItems && arrItems.length > 0)
		{
			var source = this.__getAllItems();
			if(source)
			{
				this.__clearAllRowSelection(true);
				var length = arrItems.length;
				var item = null;
				var index = -1;
				for(var count = 0;count < length;count++)
				{
					item = arrItems[count];
					index = this.__getIndexByItem(item);
					if(index > -1 && source && index < source.length)
					{
						this.__setIndex(index,true);
					}
				}
			}
		}
	};
	
	NSGrid.prototype.addSelectedItems = function(arrItems)
	{
		if(arrItems && arrItems.length > 0)
		{
			var source = this.__getAllItems();
			if(source)
			{
				var length = arrItems.length;
				var item = null;
				var index = -1;
				for(var count = 0;count < length;count++)
				{
					item = arrItems[count];
					index = this.__getIndexByItem(item);
					if(index > -1 && source)// && index < source.length
					{
						this.__setIndex(index,true);
					}
				}
			}
		}
	};
	
	NSGrid.prototype.removeSelectedItems = function(arrItems)
	{
		if(arrItems && arrItems.length > 0)
		{
			var source = this.__getAllItems();
			if(source)
			{
				var length = arrItems.length;
				var item = null;
				var index = -1;
				for(var count = 0;count < length;count++)
				{
					item = arrItems[count];
					index = this.__getIndexByItem(item);
					if(index > -1 && source)// && index < source.length
					{
						this.__markRowUnselected(index);
					}
				}
			}
		}
	};
	
	NSGrid.prototype.setSelectedItem = function(item)
	{
		this.setSelectedItems([item]);
	};
	
	NSGrid.prototype.setSelectedIndexes = function(arrSelectedIndex)
	{
		if(arrSelectedIndex && arrSelectedIndex.length > 0)
		{
			var source = this.__getAllItems();
			if(source)
			{
				var length = arrSelectedIndex.length;
				var index = -1;
				for(var count = 0;count < length;count++)
				{
					index = arrSelectedIndex[count];
					if(index > -1 && source && index < source.length)
					{
						this.__setIndex(index,true);
					}
				}
			}
		}
	};
	
	NSGrid.prototype.setSelectedIndex = function(selectedIndex)
	{
		this.setSelectedIndexes([selectedIndex]);
	};
	
	NSGrid.prototype.unSelectItems = function(arrItems)
	{
		this.removeSelectedItems(arrItems);
	};
	
	NSGrid.prototype.unSelectItem = function(arrItems)
	{
		this.unSelectItems([arrItems]);
	};
	
	NSGrid.prototype.unSelectIndexes = function(arrSelectedIndex)
	{
		
	};
	
	NSGrid.prototype.unSelectIndex = function(selectedIndex)
	{
		this.unSelectIndexes([selectedIndex]);
	};
	
	NSGrid.prototype.getSelectedIndex = function()
	{
		return this.__selectedIndex;
	};
	
	NSGrid.prototype.getSelectedItem = function()
	{
		return this.__selectedItem;
	};
	
	NSGrid.prototype.getSelectedIndexes = function()
	{
		return this.__selectedIndexes;
	};
	
	NSGrid.prototype.getSelectedItems = function()
	{
		return this.__selectedItems;
	};
	
	NSGrid.prototype.deselectAll = function()
	{
		this.__clearAllRowSelection(true);
	};
	
	NSGrid.prototype.filter = function(filter,setting,enableHighlighting,recordLimit)
	{
		this.__nsGridFilter.__handleFiltering(filter,setting,enableHighlighting,recordLimit);
		this.__nsGridFilter.setFiltersInControls(filter);
	};
	
	NSGrid.prototype.resetFilters = function()
	{
		this.__nsGridFilter.clearFilters();
		this.__nsGridFilter.resetFilters();
	};
	
	NSGrid.prototype.getFilteredData = function()
	{
		return this.__arrInternalSource;
	};
	
	NSGrid.prototype.highlightText = function(dataField,text)
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
						this.util.unHighlightText(divText,"nsTextHighlight");
						this.util.highlightText(divText,text,"nsTextHighlight");
					}
				}
		    }
		}
	};
	
	NSGrid.prototype.unHighlightText = function()
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
						this.util.unHighlightText(divText,"nsTextHighlight");
					}
				}
		    }
	    }
	};
	
	//call this function if the Grid has Fixed Columns and the header calculation is not perfect due to external elements
	//call this function after all the elements are rendered by javascript
	NSGrid.prototype.fixFixedHeader = function()
	{
		this.__renderBody(false);
	};
	
	NSGrid.prototype.setSelectedRows = function(arrIndex)
	{
		/*if(arrIndex && arrIndex.length > 0)
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
		}*/
	};
	
	NSGrid.prototype.scrollToIndex = function(selectedIndex,animationRequired)
	{
		selectedIndex = parseInt(selectedIndex);
		var source = this.__objGrid.__getFlatSource();
		if(selectedIndex > -1 && source && selectedIndex < source.length)
		{
			var item = this.__getItemByIndex(selectedIndex);
			if(item)
			{
				if(this.__enableVirtualScroll)
				{
					if(this.__enableCustomScrollBar)
					{
						var targetDimension = this.__virtualRowHeight * selectedIndex;
						this.__setCustomScrollBarScrollTop(targetDimension);
					}
					else
					{
						if(this.__nsVirtualScroll)
						{
							//because in list index is index+1
							this.__nsVirtualScroll.scrollToIndex(selectedIndex,animationRequired);
						}
					}
				}
				else
				{
					var targetDimension = -1;
					if(item[this.__fieldRowHtml])
					{
						targetDimension = (item[this.__fieldRowHtml].offsetTop);
					}
					var scrollTarget = this.__divCenterTableBodyContainer;
					if(animationRequired)
					{
						var animation = new this.util.animation(scrollTarget,[
			       	  	    {
			       	  	      time: 500,
			       	  	      property:"scrollTop",
			       	  	      target: targetDimension,
			       	  	    }
			       	  	]);
			   	  	  	animation.animate();
					}
					else
					{
						scrollTarget.scrollTop = targetDimension;
					}
				}
			}
		}
	};
	
	NSGrid.prototype.setNoDataMessage = function(message)
	{
		if(message && message.length > 0)
		{
			this.__noDataMessage = message;
		}
	};
	
	NSGrid.prototype.renderHeaderExtraRows = function()
	{
		this.__createHeaderExtraRows();
	};
	
	//Editor related public functions
	
	/*
	 * for editType = cell 
	 * combination can be this.editByIndex(cellIndex,rowIndex),this.editByIndex(rowIndex,dataField)
	 * 
	 * for editType = row 
	 * combination can be this.editByIndex(rowIndex)
	 * 
	 */
	NSGrid.prototype.editByIndex = function(index,dataField)
	{
		if(this.util.isUndefinedOrNull(dataField))
		{
			this.__nsGridEditor.edit(index);
		}
		else
		{
			this.__nsGridEditor.edit(dataField,index);
		}
	};
	
	/*
	 * for editType = cell 
	 * combination can be this.editByKeyField(keyFieldValue,dataField)
	 * 
	 * for editType = row 
	 * combination can be this.editByKeyField(keyFieldValue)
	 * 
	 */
	NSGrid.prototype.editByKeyField = function(keyFieldValue,dataField)
	{
		var item = this.__getItemBykeyField(keyFieldValue);
		var rowIndex = this.__getIndexByItem(item);
		this.editByIndex(rowIndex,dataField);
	};
	
	/*
	 * for editType = cell 
	 * combination can be this.editByItem(item,dataField)
	 * 
	 * for editType = row 
	 * combination can be this.editByItem(item)
	 * 
	 */
	NSGrid.prototype.editByItem = function(item,dataField)
	{
		var rowIndex = this.__getIndexByItem(item);
		this.editByIndex(rowIndex,dataField);
	};
	
	/*
	 * for editType = cell 
	 * combination can be this.editStopByIndex(cellIndex,rowIndex,isCancel),this.editStopByIndex(rowIndex,dataField,isCancel)
	 * 
	 * for editType = row 
	 * combination can be this.editStopByIndex(rowIndex,null,isCancel)
	 * 
	 */
	NSGrid.prototype.editStopByIndex = function(index,dataField,isCancel)
	{
		var self = this;
		isCancel = Boolean.parse(isCancel);
		var callLater = function(param1,param2)
		{
			if(isCancel)
			{
				self.__nsGridEditor.cancelEdit(param1,param2);
			}
			else
			{
				self.__nsGridEditor.saveEdit(param1,param2);
			}
		};
		if(this.util.isUndefinedOrNull(dataField))
		{
			callLater(index);
		}
		else
		{
			callLater(dataField,index);
		}
	};
	
	/*
	 * for editType = cell 
	 * combination can be this.editStopByKeyField(keyFieldValue,dataField,isCancel)
	 * 
	 * for editType = row 
	 * combination can be this.editStopByKeyField(keyFieldValue,null,isCancel)
	 * 
	 */
	NSGrid.prototype.editStopByKeyField = function(keyFieldValue,dataField,isCancel)
	{
		var item = this.__getItemBykeyField(keyFieldValue);
		var rowIndex = this.__getIndexByItem(item);
		this.editStopByIndex(rowIndex,dataField,isCancel);
	};
	
	/*
	 * for editType = cell 
	 * combination can be this.editStopByItem(item,dataField,isCancel)
	 * 
	 * for editType = row 
	 * combination can be this.editStopByItem(item,null,isCancel)
	 * 
	 */
	NSGrid.prototype.editStopByItem = function(item,dataField,isCancel)
	{
		var rowIndex = this.__getIndexByItem(item);
		this.editStopByIndex(rowIndex,dataField,isCancel);
	};
	
	NSGrid.prototype.getEditorInstances = function(element,dataField)
	{
		if(this.__nsGridEditor)
		{
			if(this.util.isUndefinedOrNull(dataField))
			{
				return this.__nsGridEditor.getEditorInstances(element);
			}
			else
			{
				this.__nsGridEditor.getEditorInstances(dataField,element);
			}
		}
		return null;
	};
	
	NSGrid.prototype.addItemsAsChildren = function(item,arrChildren)
	{
		this.__objGrid.addItemsAsChildren(item,arrChildren);
	};
	//end of editor related public functions
	
	NSGrid.prototype.removeComponent = function()
	{
		if(this.__scroller)
		{
			this.__scroller.remove();
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
			this.util.removeEvent(this.__getVerticalScrollableContainer(),"scroll",this.__bodyScrollRef);
			this.__bodyScrollRef = null;
		}
		if(this.__synchronizeTablesRef)
		{
			this.util.removeEvent(this.__getHorizontalScrollableContainer(),"scroll",this.__synchronizeTablesRef);
			this.__synchronizeTablesRef = null;
		}
		if(this.__divCenterTableBodyMouseUpRef)
		{
			this.util.removeEvent(document,"mouseup",this.__divCenterTableBodyMouseUpRef);
			this.__divCenterTableBodyMouseUpRef = null;
		}
		if(this.__keyDownRef)
		{
			this.util.removeEvent(document.body,"keydown",this.__keyDownRef);
			this.__keyDownRef = null;
		}
		if(this.__keyUpRef)
		{
			this.util.removeEvent(document.body,"keyup",this.__keyUpRef);
			this.__keyUpRef = null;
		}
		if(this.__nsGridFilter)
		{
			this.__nsGridFilter.remove();
		}
		if(this.__nsPopUpColumnSetting)
		{
			this.__nsPopUpColumnSetting.remove();
			this.__nsPopUpColumnSetting = null;
		}
		if(this.__nsVirtualScroll)
		{
			this.__nsVirtualScroll.destroy();
			this.__nsVirtualScroll = null;
		}
		if(this.__divOuterContainer && this.__divOuterContainer.parentElement) {
			this.__divOuterContainer.parentElement.removeChild(this.__divOuterContainer);
		}
		this.base.removeComponent.call(this);
	};
	
	NSGrid.prototype.__setFields = function()
	{
		var id = this.getID();
		this.__fieldPrefix = "ns_field";
		this.__fieldIndex = this.__fieldPrefix + "_row_index" + id;
		this.__fieldVisibleIndex = this.__fieldPrefix + "_row_visible_index" + id;
		this.__fieldRow = this.__fieldPrefix + "_row" + id;
		this.__fieldRowHtml = this.__fieldPrefix + "_row" + id;
		this.__fieldRowLevel = this.__fieldPrefix + "_row_level" + id;
		this.__fieldRowVisible = this.__fieldPrefix + "_row_visible" + id;
		this.__fieldRowHover = this.__fieldPrefix + "_row_hover" + id;
		this.__fieldParentIndex = this.__fieldPrefix + "_parent_index" + id;
		this.__fieldHasChild = this.__fieldPrefix + "_row_hasChild" + id;
		this.__fieldHasParent = this.__fieldPrefix + "_row_hasParent" + id;
		this.__fieldIsCollapsed = this.__fieldPrefix + "_row_isCollapsed" + id;
		this.__fieldRowArrow = this.__fieldPrefix + "row_arrow" + id;
		this.__fieldCellText = this.__fieldPrefix + "cell_text" + id;
		this.__fieldSelected = this.__fieldPrefix + "_selected" + id;
		this.__fieldColIndex = this.__fieldPrefix + "_col_index" + id;
		this.__fieldColSortedAsc = this.__fieldPrefix + "_col_sorted_asc" + id;
		this.__fieldColVisible = this.__fieldPrefix + "_col_visible" + id;
	};
	
	NSGrid.prototype.__processColumnObject = function(objColumn,index)
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
			if(this.__columnSortable)
			{
				objColumn["sortable"] = this.util.isUndefinedOrNull(objColumn["sortable"]) ? true : Boolean.parse(objColumn["sortable"]);
			}
			objColumn["sortDescending"] = Boolean.parse(objColumn["sortDescending"]);
			objColumn["truncateToFit"] = Boolean.parse(objColumn["truncateToFit"]);
			objColumn["headerTruncateToFit"] = Boolean.parse(objColumn["headerTruncateToFit"]);
			objColumn["sortField"] = objColumn["sortField"] ? objColumn["sortField"] :  objColumn["dataField"];
			if(this.__columnResizable)
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
			if(this.__columnDraggable)
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
			if(this.__columnAutoSize && objColumn["resizable"])
			{
				if(objColumn.hasOwnProperty("autoSize"))
				{
					objColumn["autoSize"] = Boolean.parse(objColumn["autoSize"]);
				}
				else
				{
					objColumn["autoSize"] = true;
				}
			}
			else
			{
				objColumn["autoSize"] = false;
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
				objColumn["groupRenderer"] = this.util.getFunction(objColumn["groupRenderer"]);
			}
			//itemRendrer property gets precedence over template
			if(objColumn.hasOwnProperty("itemRenderer"))
			{
				objColumn["itemRenderer"] = this.util.getFunction(objColumn["itemRenderer"]);
			}
			else if(objColumn.hasOwnProperty("template") && objColumn["template"])
			{
				//setData should be before template for checking
				if(objColumn.hasOwnProperty("setData"))
				{
					objColumn["setData"] = this.util.getFunction(objColumn["setData"]);
				}
				objColumn.templateRenderer = this.util.getTemplate(objColumn["template"]);
			}
			else if(objColumn.hasOwnProperty("labelFunction"))
			{
				objColumn["labelFunction"] = this.util.getFunction(objColumn["labelFunction"]);
			}
			if(objColumn.hasOwnProperty("headerRenderer"))
			{
				objColumn["headerRenderer"] = this.util.getFunction(objColumn["headerRenderer"]);
			}
			else if(objColumn.hasOwnProperty("headerTemplate") && objColumn["headerTemplate"])
			{
				objColumn.headerTemplate = this.util.getTemplate(objColumn["headerTemplate"]);
			}
			if(!objColumn.hasOwnProperty("toolTipField") && objColumn.hasOwnProperty("toolTipRenderer"))
			{
				objColumn["toolTipRenderer"] = this.util.getFunction(objColumn["toolTipRenderer"]);
			}
			if(objColumn.hasOwnProperty("extraRowHeaderRenderer"))
			{
				objColumn["extraRowHeaderRenderer"] = this.util.getFunction(objColumn["extraRowHeaderRenderer"]);
			}
			if(objColumn.hasOwnProperty("footerRenderer"))
			{
				objColumn["footerRenderer"] = this.util.getFunction(objColumn["footerRenderer"]);
			}
			if(objColumn.hasOwnProperty("exportGetBodyTextFunction"))
			{
				objColumn["exportGetBodyTextFunction"] = this.util.getFunction(objColumn["exportGetBodyTextFunction"]);
			}
			if(objColumn.hasOwnProperty("exportGetFooterTextFunction"))
			{
				objColumn["exportGetFooterTextFunction"] = this.util.getFunction(objColumn["exportGetFooterTextFunction"]);
			}
			if(objColumn.hasOwnProperty("excelStyleHeaderFunction"))
			{
				objColumn["excelStyleHeaderFunction"] = this.util.getFunction(objColumn["excelStyleHeaderFunction"]);
			}
			if(objColumn.hasOwnProperty("excelStyleBodyFunction"))
			{
				objColumn["excelStyleBodyFunction"] = this.util.getFunction(objColumn["excelStyleBodyFunction"]);
			}
			if(objColumn.hasOwnProperty("excelStyleFooterFunction"))
			{
				objColumn["excelStyleFooterFunction"] = this.util.getFunction(objColumn["excelStyleFooterFunction"]);
			}
			if(this.__isResponsiveModeColumnToggle)
			{
				if(!objColumn.hasOwnProperty("priority"))
				{
					objColumn.priority = 6;
				}
				objColumn.priority = parseInt(objColumn.priority);
			}
			var isColumnFixed = this.__isColumnFixed(index);
			if(!isColumnFixed)
			{
				if(objColumn.hasOwnProperty("hideable"))
				{
					objColumn["hideable"] = Boolean.parse(objColumn["hideable"]);
				}
				else
				{
					objColumn["hideable"] = true;
				}
			}
			else
			{
				objColumn["hideable"] = false;
			}
			this.__processIconsInColumn(objColumn);
			this.__nsGridFilter.processColumnObject(objColumn);
			this.__nsGridEditor.processColumnObject(objColumn);
		}
		return objColumn;
	};
	
	NSGrid.prototype.__processPinnedColumn = function()
	{
		if(this.__orignalColumns && this.__orignalColumns.length > 0)
		{
			for(var count = 0;count < this.__leftFixedColumn;count++)
			{
				this.__orignalColumns[count].pinned = "left";
			}
			for(var count = this.__orignalColumns.length - 1,colCount = 0;count > -1 && colCount < this.__rightFixedColumn;count--,colCount++)
			{
				this.__orignalColumns[count].pinned = "right";
			}
			var arrLeft = [];
			var arrCenter = [];
			var arrRight = [];
			for(var count = 0;count < this.__orignalColumns.length;count++)
			{
				if(this.__orignalColumns[count].pinned)
				{
					if(this.__orignalColumns[count].pinned == "left")
					{
						arrLeft.push(this.__orignalColumns[count]);
					}
					else if(this.__orignalColumns[count].pinned == "right")
					{
						arrRight.push(this.__orignalColumns[count]);
					}
					else
					{
						arrCenter.push(this.__orignalColumns[count]);
					}
				}
				else
				{
					arrCenter.push(this.__orignalColumns[count]);
				}
			}
			this.__orignalColumns = arrLeft.concat(arrCenter).concat(arrRight); 
		}
	};
	
	NSGrid.prototype.__updateFixedColCounts = function()
	{
		this.__leftFixedColumn = 0;
		this.__rightFixedColumn = 0;
		for(var count = 0;count < this.__columns.length;count++)
		{
			if(this.__columns[count].pinned)
			{
				if(this.__columns[count].pinned == "left")
				{
					this.__leftFixedColumn++;
				}
				else if(this.__columns[count].pinned == "right")
				{
					this.__rightFixedColumn++;
				}
			}
		}
	};
	
	NSGrid.prototype.__processIconsInColumn = function(objColumn)
	{
		if(objColumn)
		{
			var itemIcons = objColumn["icons"];
			var icons = null;
			if(itemIcons)
			{
				icons = {};
				icons.menu = itemIcons["menu"] || this.__icons["menu"];
				icons.filter = itemIcons["filter"] || this.__icons["filter"];
				icons.sortAscending = itemIcons["sortAscending"] || this.__icons["sortAscending"];
				icons.sortDescending = itemIcons["sortDescending"] || this.__icons["sortDescending"];
				icons.columnMove = itemIcons["columnMove"] || this.__icons["columnMove"];
			}
			else if(this.__icons)
			{
				icons = this.util.cloneObject(this.__icons,true);
				delete icons.exportButton;
				delete icons.rowExpanded;
				delete icons.rowCollapsed;
			}
			if(icons)
			{
				objColumn.icons = icons;
			}
		}
	};
	
	NSGrid.prototype.__isColumnExist = function(dataField)
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
	
	NSGrid.prototype.__createStructure = function()
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
			var paddingLeft = this.util.getDimensionAsNumber(this.__baseComponent,this.util.getStyleValue(this.__baseComponent,"padding-left"));
			var paddingTop = this.util.getDimensionAsNumber(this.__baseComponent,this.util.getStyleValue(this.__baseComponent,"padding-top"));
			var marginLeft = this.util.getDimensionAsNumber(this.__baseComponent,this.util.getStyleValue(this.__baseComponent,"margin-left"));
			var marginTop = this.util.getDimensionAsNumber(this.__baseComponent,this.util.getStyleValue(this.__baseComponent,"margin-top"));
			var setting = {offsetX:(-1 * (bodyPaddingLeft + bodyMarginLeft + paddingLeft + marginLeft)),offsetY:(-1 * (bodyPaddingTop + bodyMarginTop + paddingTop + marginTop))};
			this.util.addAnimatedLineOnHover(spanTitle,setting);
		}
		this.__createCustomScroller();
		this.__createScrollTip();
	};
	
	NSGrid.prototype.__createOuterContainer = function()
	{
		if(this.__divOuterContainer)
		{
			this.removeComponent();
			this.__divOuterContainer = null;
		}
		this.__divOuterContainer = this.util.createDiv(this.getID() + this.__OUTER_CONTAINER_ID,"nsDataGridContainer");
		this.__applyTheme(this.__divOuterContainer,"nsDataGridContainer");
		this.__applyCustomClass(this.__divOuterContainer,"outerContainer");
		this.__setOuterContainerMeasurement();
		this.addChild(this.__divOuterContainer);
		return this.__divOuterContainer;
	};
	
	NSGrid.prototype.__setOuterContainerMeasurement = function()
	{
		if(this.__divOuterContainer)
		{
			var width = this.util.getStyleValue(this.__baseComponent,"width");
			var height = this.util.getStyleValue(this.__baseComponent,"height");
			var rectBase = this.__baseComponent.getBoundingClientRect();
			if(rectBase.width > 0)
			{
				width = rectBase.width + "px";
			}
			if(rectBase.height > 0)
			{
				height = rectBase.height + "px";
			}
			this.__divOuterContainer.style.width = width;
			this.__divOuterContainer.style.height = height;
		}
	};
	
	NSGrid.prototype.__createTitleBar= function(parentElement)
	{
		if(parentElement && ((this.__title && this.__title.length > 0) || this.__enableExport || this.__enableColumnSetting))
		{
			var divTitleBar = this.util.createDiv(this.getID() + this.__TITLE_CONTAINER_ID,this.__CLASS_TITLEBAR);
			this.util.addStyleClass(divTitleBar,"nsDataGridTitleBarTheme");
			this.__applyCustomClass(divTitleBar,"titleBar");
			if(this.__title && this.__title.length > 0)
			{
				var spanTitle = document.createElement("span");
				var titleText = document.createTextNode(this.__title);
				spanTitle.appendChild(titleText);
				divTitleBar.appendChild(spanTitle);
			}
			var spanRight = document.createElement("span");
			spanRight.style.float = "right";
			divTitleBar.appendChild(spanRight);
			if(this.__enableColumnSetting)
			{
				var spanExport = document.createElement("span");
				spanExport.style.cursor = "pointer";
				if(this.__icons.columnSetting)
				{
					spanExport.innerHTML = this.__icons.columnSetting;
				}
				else
				{
					var objSVG = new NSSvg();
					var exportID = new NSSvgShapes().__COLUMNSETTING_ICON_ID;
					var svg = objSVG.addSVG(spanExport,exportID + "exportsvg","nsColumnSetting");
					this.util.addStyleClass(svg,"nsColumnSettingTheme");
					objSVG.addUse(svg,exportID + "use",null,"#" + exportID);
				}
				spanRight.appendChild(spanExport);
				var self = this;
				this.util.addEvent(spanExport,"click",function(event){
					self.__createColumnSettingUI.call(self,spanExport,event);
				});
			}
			if(this.__enableExport)
			{
				var spanExport = document.createElement("span");
				spanExport.style.paddingLeft = "5px";
				spanExport.style.cursor = "pointer";
				if(this.__icons.exportButton)
				{
					spanExport.innerHTML = this.__icons.exportButton;
				}
				else
				{
					var objSVG = new NSSvg();
					var exportID = new NSSvgShapes().__EXPORT_ICON_ID;
					var svg = objSVG.addSVG(spanExport,exportID + "exportsvg","nsExportIcon");
					this.util.addStyleClass(svg,"nsExportIconTheme");
					objSVG.addUse(svg,exportID + "use",null,"#" + exportID);
				}
				spanRight.appendChild(spanExport);
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
	
	NSGrid.prototype.__createColumnSettingUI = function(parentElement,event)
	{
		if(!this.__nsPopUpColumnSetting)
		{
			var self = this;
			var itemRenderer = function(item,labelField,fieldIndex,isDisabled,listItem)
			{
				if(item)
				{
					var divRenderer = self.util.createElement("span",null,"nsFilterListRenderer");
					var label = self.util.createElement("label");
					var checkBox = self.util.createElement("input",null,"nsFilterListRendererCheckBox");
					checkBox.setAttribute("type","checkbox");
					var visible = item[this.__fieldColVisible];
					if(self.util.isUndefinedOrNull(visible))
					{
						visible = true;
					}
					checkBox.checked = visible;
					this.util.addEvent(checkBox,"click",checkBoxClickHandler.bind(self,item));
					label.style.fontWeight = "400";
					label.style.cursor = "pointer";
					checkBox.style.marginRight = "5px";
					label.appendChild(checkBox);
					label.appendChild(document.createTextNode(item["headerText"] || item["dataField"]));
					divRenderer.appendChild(label);
					return divRenderer;
				}
				return null;
			};
			
			var checkBoxClickHandler = function(item,event)
			{
				var target = self.util.getTarget(event);
				var checked = target.checked;
				var index = this.__getColumnIndexByObject(item);
				var counter = 0;
				for(var count = 0;count < arrSource.length;count++)
				{
					if(self.util.isUndefinedOrNull(arrSource[count][this.__fieldColVisible]) || arrSource[count][this.__fieldColVisible])
					{
						counter++;
					}
				}
				var strMsg = "Atleast 1 Column should be selected in Column Configuration";
				if(counter == 1 && !checked)
				{
					target.checked = !checked;
					console.log(strMsg);
					return;
				}
				item[this.__fieldColVisible] = checked;
				this.__setColumnVisibility(index,checked,item);
				//if(checked)
				//{
					self.__alignTables(true);
					self.__addStyleForFixedColumns();
					//self.__setFixedCellsPosition();
				//}
			};
			var popUpSetting = {id:this.getID() + "columnSettingContainer",type:"div",width:275,position:this.util.POS_BOTTOMLEFT,closeOnOutsideClick:true,hideOrRemoveOnOutsideClick:"hide",closeRequired:true};
			this.__nsPopUpColumnSetting = new this.util.nsPopUp(popUpSetting);
			this.__nsPopUpColumnSetting.create();
			var popUp = this.__nsPopUpColumnSetting.getPopUp();
			var self = this;
			this.util.addEvent(popUp,"click",function(event){
				event = self.util.getEvent(event);
				event.stopImmediatePropagation();
			});
			var divList = this.util.createDiv();
			var lstColumn = this.util.createElement("div",null,"nsFilterList");
			lstColumn.style.height = "300px";
			divList.appendChild(lstColumn);
			popUp.appendChild(divList);
			var arrSource = this.__getColumnSettingSource();
			var setting = {labelField:"label",enableVirtualScroll:false,enableDragDrop:false,enableDragByHandle:false,enableMultipleSelection:true,enableKeyboardNavigation:false,
					   customScrollerRequired:false,enableMouseHover:true,enableMouseHoverAnimation:false,itemRenderer:itemRenderer.bind(this)};
			setting["dataSource"] = arrSource;
			var objNSList = new NSList(lstColumn,setting);
		}
		this.__nsPopUpColumnSetting.show();
		this.__nsPopUpColumnSetting.placePopUp(event);
		event.stopPropagation();
	};
	
	NSGrid.prototype.__getColumnSettingSource = function()
	{
		var arrSource = [];
		for(var count = 0;count < this.__columns.length;count++)
		{
			var objColumn = this.__columns[count];
			if(objColumn["hideable"])
			{
				arrSource.push(objColumn);
			}
		}
		return arrSource;
	};
	
	NSGrid.prototype.__createTableStructure= function(parentElement)
	{
		if(parentElement)
		{
			this.__divTableWrapper = this.util.createDiv(this.getID() + "TableWrapper","nsTableWrapper");
			parentElement.appendChild(this.__divTableWrapper);
			this.__divTableHeaderContainerWrapper = this.util.createDiv(this.getID() + this.__TABLE_HEADER_CONTAINER_WRAPPER_ID,"nsGridHeaderContainer");
			this.__divTableWrapper.appendChild(this.__divTableHeaderContainerWrapper);
			this.__divTableBodyContainerWrapper = this.util.createDiv(this.getID() + this.__TABLE_BODY_CONTAINER_WRAPPER_ID,"nsGridBodyContainer");
			this.__divTableWrapper.appendChild(this.__divTableBodyContainerWrapper);
			this.__divTableFooterContainerWrapper = this.util.createDiv(this.getID() + this.__TABLE_FOOTER_CONTAINER_WRAPPER_ID,"nsGridFooterContainer");
			this.__divTableWrapper.appendChild(this.__divTableFooterContainerWrapper);
			this.__createHeader();
			this.__createBody();
			this.__createFooter();
		}
	};
	
	NSGrid.prototype.__createPaginationControl= function(parentElement)
	{
		if(parentElement)
		{
			if(this.__divPagination)
			{
				this.util.removeAllChildren(this.__divPagination);
				this.__divPagination.parentElement.removeChild(this.__divPagination);
				this.__divPagination = null;
			}
			this.__divPagination = this.util.createDiv(this.getID() + this.__PAGINATION_CONTROL_ID,"nsGridPagination");
			parentElement.appendChild(this.__divPagination);
			var setting = {
					parent:this.__divPagination,
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
			this.__nsPagination.util.addEvent(this.__divPagination,this.__nsPagination.PAGE_CHANGE,this.__pageChangeHandler.bind(this));
		}
	};
	
	NSGrid.prototype.__pageChangeHandler= function(event)
	{
		if(!event)
		{
			event = {oldIndex:0,newIndex:1,fromRecord:0,toRecord:this.__pageSize - 1};
		}
		console.log("OldPage::" + event.oldIndex + ",NewPage::" + event.newIndex);
		if(this.__paginationFetchRecordCallBack && this.__totalRecords > event.fromRecord)
		{
			this.__paginationFetchRecordCallBack(event.fromRecord,event.toRecord,this.__pageSize);
		}
	};
	
	/******************************Header Creation *************************************/
	NSGrid.prototype.__createHeader = function()
	{
		this.__divCenterTableHeaderContainer = this.__createHeaderContainer(this.__divTableHeaderContainerWrapper,this.__divCenterTableHeaderContainer,this.getID() + this.__TABLE_CENTER_HEADER_CONTAINER_ID,this.getID() + this.__TABLE_CENTER_HEADER_ID);
		this.__tblCenterHeader = this.__divCenterTableHeaderContainer.firstChild;
		var divHeaderCorner = this.util.createDiv(null,"nsHeaderBarCorner");
		this.__divTableHeaderContainerWrapper.appendChild(divHeaderCorner);
		this.__createHeaderRows();
	};
	
	NSGrid.prototype.__createHeaderContainer= function(tableContainer,headerContainer,containerID,tableID)
	{
		if(headerContainer)
		{
			headerContainer.parentNode.removeChild(headerContainer);
		}
		headerContainer = this.__createTableAndParent(containerID,"nsDataGridHeaderContainer",tableID);
		tableContainer.appendChild(headerContainer);
		return headerContainer;
	};
	
	NSGrid.prototype.__createHeaderRows= function()
	{
		if(this.__tblCenterHeader && this.__columns && this.__columns.length > 0)
		{
			var header = this.__tblCenterHeader.createTHead();
			var headerRow = header.insertRow(-1);
		    headerRow.style.height = "auto";
		    this.__tblCenterHeaderBody = document.createElement("tbody");
			this.__tblCenterHeader.appendChild(this.__tblCenterHeaderBody);
		    var bodyRow = this.__tblCenterHeaderBody.insertRow(-1);
		    this.util.addStyleClass(bodyRow,"nsGridHeaderRow");
			this.__applyCustomClass(bodyRow,"headerRow");
		    var rendererRow = this.__tblCenterHeaderBody.insertRow(-1);
		    this.util.addStyleClass(rendererRow,"nsGridFilterRow");
			this.__applyCustomClass(rendererRow,"filterRow");
		    for (var colIndex = 0; colIndex < this.__columns.length; colIndex++)
		    {
		    	var colItem = this.__columns[colIndex];
		    	this.__createHeaderColGroup(colItem);
		        this.__createHeaderHeaderCell(colItem,headerRow);
		        this.__createHeaderBodyCell(colItem,bodyRow,rendererRow,colIndex);
		    }
		}
	};
	
	NSGrid.prototype.__createHeaderExtraRows = function()
	{
		var headerBodyRow = this.__getHeaderBodyRow(this.__tblCenterHeader);
		if(this.__headerExtraRowCount > 0 && headerBodyRow)
		{
			var arrExtraRow = this.__getHeaderExtraRow(this.__tblCenterHeader);
			if(arrExtraRow && arrExtraRow.length > 0)
			{
				for (var rowIndex = arrExtraRow.length - 1; rowIndex > -1; rowIndex--)
			    {
					this.__tblCenterHeader.deleteRow(arrExtraRow[rowIndex].rowIndex);
			    }
			}
			for (var rowIndex = 0; rowIndex < this.__headerExtraRowCount; rowIndex++)
		    {
				var extraRow = this.__tblCenterHeaderBody.insertRow(-1);
				this.util.addStyleClass(extraRow,"nsHeaderExtraRow");
				this.__applyCustomClass(extraRow,"extraHeaderRow");
				this.__applyCustomClass(extraRow,"extraHeaderRow" + rowIndex);
				for (var colIndex = 0; colIndex < this.__columns.length; colIndex++)
			    {
					this.__createHeaderExtraCell(this.__columns[colIndex],extraRow,rowIndex,colIndex);
			    }
		    }
		}
	};
	
	NSGrid.prototype.__createHeaderColGroup = function(colItem)
	{
		if(colItem)
		{
			var colgroup = document.createElement("colgroup");
			colgroup.setAttribute("id",this.getID() + "HeaderColGroup" + colItem.dataField);
			this.util.addStyleClass(colgroup,"nsGridColGroup");
			this.util.addStyleClass(colgroup,"nsGridColGroupHeader");
			this.__tblCenterHeader.appendChild(colgroup);
		}
	};
	
	NSGrid.prototype.__createHeaderHeaderCell = function(colItem,headerRow)
	{
		if(colItem && headerRow)
		{
			var headerCell = headerRow.insertCell(-1);
			this.util.addStyleClass(headerCell,"nsGridCell");
			headerCell.style.padding = "0px"; 
			headerCell.style.width = colItem["width"]; 
			this.__addPriorityClassInCell(headerCell,colItem);
		}
	};
	
	NSGrid.prototype.__createHeaderExtraCell = function(colItem,extraHeaderRow,rowIndex,colIndex)
	{
		if(colItem && extraHeaderRow)
		{
			var extraHeaderCell = extraHeaderRow.insertCell(-1);
			var colID = this.getID() + "colExtra" + colItem["dataField"] + rowIndex + colIndex;
			extraHeaderCell.setAttribute("id",colID);
			this.util.addStyleClass(extraHeaderCell,"nsGridCell");
			this.util.addStyleClass(extraHeaderCell,"nsDataGridHeaderRenderer");
			this.util.addStyleClass(extraHeaderCell,"nsDataGridHeaderRendererTheme");
			this.__addStyleForFixedCell(extraHeaderCell,colIndex);
			//this.__nsGridFilter.addFilterRenderer(rendererRow,rendererCell,colItem,index,colID);
			this.__addPriorityClassInCell(extraHeaderCell,colItem);
			var divHeaderRendererContainer = this.util.createDiv(null); 
			extraHeaderCell.appendChild(divHeaderRendererContainer);
			var itemRenderer = colItem["extraRowHeaderRenderer"];
			if(itemRenderer)
			{
				var objRenderer = itemRenderer(colItem["dataField"],colItem,this.__arrFilteredGroupedSource,rowIndex,colIndex,extraHeaderCell,extraHeaderRow);
				var callback = function(objRenderer)
				{
					if(objRenderer)
					{
						if(this.util.isString(objRenderer))
						{
							var compSpan = document.createElement("span");
							compSpan.innerHTML = objRenderer;
							divHeaderRendererContainer.appendChild(compSpan);
						}
						else
						{
							divHeaderRendererContainer.appendChild(objRenderer);
						}
					}
				};
				this.util.resolveFunctionOrPromise(objRenderer,callback.bind(this));
			}
		}
	};
	
	NSGrid.prototype.__createHeaderBodyCell = function(colItem,bodyRow,rendererRow,index)
	{
		if(colItem && bodyRow && rendererRow)
		{
			var bodyCell = bodyRow.insertCell(-1);
			var colID = this.getID() + "ColHeader" + colItem["dataField"];
			bodyCell.setAttribute("id",colID);
			this.util.addStyleClass(bodyCell , "nsGridCell");
			this.util.addStyleClass(bodyCell , this.__CLASS_TABLE_HEADER_CELL);
			this.util.addStyleClass(bodyCell , "nsDataGridHeaderTheme");
			this.__addStyleForFixedCell(bodyCell,index);
			this.__applyCustomClass(bodyCell,"headerCell");
			bodyCell.setAttribute("orignalColumnIndex",index);
		    bodyCell.setAttribute("currentColumnIndex",index);
		    
	        this.util.addEvent(bodyCell,"click",this.__headerClickHandler.bind(this));
	        this.util.addEvent(bodyCell,"mouseover",this.__headerMouseOverHandler.bind(this));
	        this.util.addEvent(bodyCell,"mouseout",this.__headerMouseOutHandler.bind(this));
	        this.util.addEvent(bodyCell,"mousedown",this.__headerMouseDownHandler.bind(this));
	        
	        var divCell = this.util.createDiv(colID + "container","nsDataGridHeaderCellContainer"); 
	        bodyCell.appendChild(divCell);
	        if(colItem["draggable"])
			{
	        	var objSVG = new NSSvg();
				this.util.addStyleClass(bodyCell , this.__CLASS_TABLE_HEADER_DROPPABLE_CELL);
				var divMove = this.util.createDiv(colID + "move","nsHeaderMove");
				if(this.__getColumnCustomIcon(colItem,"columnMove"))
				{
					divMove.innerHTML = this.__getColumnCustomIcon(colItem,"columnMove");
				}
				else
				{
					var iconID = new NSSvgShapes().__MOVE_ICON_ID;
					var svg = objSVG.addSVG(divMove,divMove.id + iconID + "svg","nsMoveIcon",null,null,null,null,null,null,false);
					objSVG.addUse(svg,divMove.id + "use",null,"#" + iconID);
				}
				divCell.appendChild(divMove);
			}
			var divText = this.util.createDiv(colID + "text");
			divCell.appendChild(divText);
			this.__addHeaderRenderer(divText,colItem,index);
			if(colItem.hasOwnProperty("sortable") && colItem["sortable"])
			{
				var divSorting = this.util.createDiv(colID + "SortContainer","nsGridSortContainer");
				divCell.appendChild(divSorting);
				if(!this.__isSortingIconCustom(colItem))
				{
					var divSortAsc = this.util.createDiv(colID + "SortAsc","nsSortAsc"); 
					divSorting.appendChild(divSortAsc);
					var divSortSpacer = this.util.createDiv(colID + "SortSpacer","nsSortSpacer"); 
					divSorting.appendChild(divSortSpacer);
					var divSortDesc = this.util.createDiv(colID + "SortDesc","nsSortDesc"); 
					divSorting.appendChild(divSortDesc);
				}
			}
			if(colItem["showMenu"])
			{
				var objSVG = new NSSvg();
				var arrMenu = this.__getHeaderMenuDataProvider(bodyCell);
				if(arrMenu && arrMenu.length > 0)
				{
					var divMenuContainer = this.util.createDiv(colID + "MenuContainer");
					if(this.__getColumnCustomIcon(colItem,"menu"))
					{
						divMenuContainer.innerHTML = this.__getColumnCustomIcon(colItem,"menu");
					}
					else
					{
						var svg = objSVG.addSVG(divMenuContainer,colID + "menusvg","nsMenuArrowSVG",null,null,null,null,null,null,true);
						objSVG.addUse(svg,colID + "use","nsMenuUse","#svgCircleDownArrow");
					}
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
			this.__nsGridColumnResize.addResizeIndicator(bodyRow,bodyCell,divCell,colItem,colID);
			var rendererCell = rendererRow.insertCell(-1);
			this.util.addStyleClass(rendererCell,"nsGridCell");
			this.util.addStyleClass(rendererCell,"nsDataGridHeaderRenderer");
			this.util.addStyleClass(rendererCell,"nsDataGridHeaderRendererTheme");
			this.__addStyleForFixedCell(rendererCell,index);
			this.__applyCustomClass(rendererCell,"filterCell");
			this.__nsGridFilter.addFilterRenderer(rendererRow,rendererCell,colItem,index,colID);
			this.__addPriorityClassInCell(bodyCell,colItem);
			this.__addPriorityClassInCell(rendererCell,colItem);
		}
	};
	
	NSGrid.prototype.__addHeaderRenderer = function(div,colItem,colIndex)
	{
		if(colItem)
		{
			var templateRenderer = colItem["headerTemplate"];
			var itemRenderer = colItem["headerRenderer"];
			if(itemRenderer)
			{
				var objRenderer = itemRenderer(colItem,colIndex);
				var callback = function(objRenderer)
				{
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
				};
				this.util.resolveFunctionOrPromise(objRenderer,callback.bind(this));
			}
			else if(templateRenderer)
			{
				div.appendChild(templateRenderer.cloneNode(true));
			}
			else
			{
				this.util.addStyleClass(div,"nsHeaderText");
				this.util.addStyleClass(div,"nsHeaderTextTheme");
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
	
	NSGrid.prototype.__setHeaderSortFunction = function()
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
	
	NSGrid.prototype.__setHeaderSortFunctionForItem = function(colItem,dataSource)
	{
		if(colItem)
		{
			if(colItem.hasOwnProperty("sortField") && colItem["sortField"] && colItem.hasOwnProperty("sortable") && colItem["sortable"] === true)
	    	{
				//In case of addColumn() dataSource will be null 
				if(!dataSource)
				{
					dataSource = this.__getAllItems();
				}
	    		var item = null;
	    		for(var count = 0; count < dataSource.length; count++)
	            {
	                 item = dataSource[count][colItem["sortField"]];
	                 if(!this.util.isUndefined(item) && item != null && item != "")
	                 {
	                	 break;
	                 }
	            }
	    		if(!this.util.isUndefined(item) && item != null && item != "")
	            {
	            	colItem.sortFunction = this.__nsGridSort.determineSortFunction(item,colItem);
	            }
	            else
	            {
	            	colItem.sortFunction = "__sortCaseInsensitive";
	            }
	    	}
		}
	};
	
	NSGrid.prototype.__removeHeaderCell = function(colIndex)
	{
		if(colIndex > -1 && colIndex < this.__columns.length)
		{
			var headerRow = this.__getHeaderHeaderRow(this.__tblCenterHeader);
			if(headerRow)
			{
				headerRow.deleteCell(colIndex);
				var headerBodyRow = this.__getHeaderBodyRow(this.__tblCenterHeader);
				var rendererRow = this.__getHeaderFilterRow(this.__tblCenterHeader);
				headerBodyRow ? headerBodyRow.deleteCell(colIndex) : null;
				rendererRow ? rendererRow.deleteCell(colIndex) : null;
			}
			return true;
		}
		return false;
	};
	
	NSGrid.prototype.__swapOrMoveHeaderCell = function(functionality,sourceIndex,destinationIndex)
	{
		if(this.__isColumnIndexValid(sourceIndex) && this.__isColumnIndexValid(destinationIndex))
		{
			var headerRow = this.__getHeaderHeaderRow(this.__tblCenterHeader);
			if(headerRow)
			{
				var arrRows = this.__getBodyBodyRow(this.__tblCenterHeader);
	    		if(arrRows && arrRows.length > 0)
	    		{
					var arrHeaderCells = headerRow.cells;
					this.__swapCell(arrHeaderCells[sourceIndex],arrHeaderCells[destinationIndex]);
					for (var rowIndex = 0; rowIndex < arrRows.length; rowIndex++)
				    {
						var arrCells = arrRows[rowIndex].cells;
						if(rowIndex === 0)
						{
							arrCells[sourceIndex].setAttribute("currentColumnIndex",destinationIndex);
							arrCells[destinationIndex].setAttribute("currentColumnIndex",sourceIndex);
						}
						if(functionality === "swap")
						{
							this.__swapCell(arrCells[sourceIndex],arrCells[destinationIndex]);
						}
						else 
						{
							this.__moveCell(arrCells[sourceIndex],destinationIndex);
							if(rowIndex === 0)
							{
								var smallIndex = Math.min(sourceIndex,destinationIndex);
								for(var count = smallIndex;count < arrCells.length;count++)
								{
									arrCells[count].setAttribute("currentColumnIndex",count);
								}
							}
						}
				    }
				}
				return true;
			}
		}
		return false;
	};
	
	NSGrid.prototype.__removeHeader = function()
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
	/******************************Footer Creation **********************************************/
	NSGrid.prototype.__createFooter = function()
	{
		if(this.__enableFooter)
		{
			this.__divCenterTableFooterContainer = this.__createFooterContainer(this.__divTableFooterContainerWrapper,this.__divCenterTableFooterContainer,this.getID() + this.__TABLE_CENTER_FOOTER_CONTAINER_ID,this.getID() + this.__TABLE_CENTER_FOOTER_ID);
			this.__tblCenterFooter = this.__divCenterTableFooterContainer.firstChild;
			var divFooterCorner = this.util.createDiv(null,"nsFooterBarCorner");
			this.__divCenterTableFooterContainer.appendChild(divFooterCorner);
		}
	};
	
	NSGrid.prototype.__createFooterContainer= function(tableContainer,footerContainer,containerID,tableID)
	{
		if(footerContainer)
		{
			footerContainer.parentNode.removeChild(footerContainer);
		}
		footerContainer = this.__createTableAndParent(containerID,"nsDataGridFooterContainer",tableID);
		tableContainer.appendChild(footerContainer);
		return footerContainer;
	};
	
	NSGrid.prototype.__createFooterRows = function()
	{
		if(this.__enableFooter && this.__tblCenterFooter && this.__columns && this.__columns.length > 0)
		{
			this.util.removeAllChildren(this.__tblCenterFooter);
			var footer = this.__tblCenterFooter.createTHead();
			var footerRow = footer.insertRow(-1);
		    footerRow.style.height = "auto";
		    this.__tblCenterFooterBody = document.createElement("tbody");
			this.__tblCenterFooter.appendChild(this.__tblCenterFooterBody);
		    var bodyRow = this.__tblCenterFooterBody.insertRow(-1);
		    this.util.addStyleClass(bodyRow,"nsGridFooterRow");
			this.__applyCustomClass(bodyRow,"footerRow");
		    for (var colIndex = 0; colIndex < this.__columns.length; colIndex++)
		    {
		    	var colItem = this.__columns[colIndex];
		    	this.__createFooterColGroup(colItem);
		        this.__createFooterHeaderCell(colItem,footerRow);
		        this.__createFooterBodyCell(colItem,bodyRow,0,colIndex);
		    }
		    this.__createFixedFooterRow(footerRow);
		    var arrRows = this.__tblCenterFooterBody.rows;
		    for (var rowIndex = 0; rowIndex < arrRows.length; rowIndex++)
		    {
		    	 this.__createFixedFooterRow(arrRows[rowIndex]);
		    }
		    if(this.__enableCustomScrollBar && this.__scroller)
			{
		    	this.__divTableFooterContainerWrapper.style.height = null;
				this.__divTableFooterContainerWrapper.style.height = (2 * this.__divTableFooterContainerWrapper.offsetHeight) + "px";
			}
		}
	};
	
	NSGrid.prototype.__createFooterColGroup = function(colItem)
	{
		if(colItem)
		{
			var colgroup = document.createElement("colgroup");
			colgroup.setAttribute("id",this.getID() + "FooterColGroup" + colItem.dataField);
			this.util.addStyleClass(colgroup,"nsGridColGroup");
			this.util.addStyleClass(colgroup,"nsGridColGroupFooter");
			this.__tblCenterFooter.appendChild(colgroup);
		}
	};
	
	NSGrid.prototype.__createFooterHeaderCell = function(colItem,headerRow)
	{
		if(colItem && headerRow)
		{
			var footerCell = headerRow.insertCell(-1);
			this.util.addStyleClass(footerCell,"nsGridCell");
			footerCell.style.padding = "0px"; 
			footerCell.style.width = colItem["width"]; 
			this.__addPriorityClassInCell(footerCell,colItem);
		}
	};
	
	NSGrid.prototype.__createFooterBodyCell = function(colItem,bodyRow,rowIndex,colIndex)
	{
		if(colItem && bodyRow)
		{
			var bodyCell = bodyRow.insertCell(-1);
			var colID = this.getID() + "ColFooter" + colItem["dataField"];
			bodyCell.setAttribute("id",colID);
			this.util.addStyleClass(bodyCell , "nsGridCell");
			this.util.addStyleClass(bodyCell , "nsDataGridFooter");
			this.util.addStyleClass(bodyCell , "nsDataGridFooterTheme");
			this.__addStyleForFixedCell(bodyCell,colIndex);
			this.__applyCustomClass(bodyCell,"footerCell");
			bodyCell.setAttribute("orignalColumnIndex",colIndex);
		    bodyCell.setAttribute("currentColumnIndex",colIndex);
		    
	        /*this.util.addEvent(bodyCell,"click",this.__headerClickHandler.bind(this));
	        this.util.addEvent(bodyCell,"mouseover",this.__headerMouseOverHandler.bind(this));
	        this.util.addEvent(bodyCell,"mouseout",this.__headerMouseOutHandler.bind(this));
	        this.util.addEvent(bodyCell,"mousedown",this.__headerMouseDownHandler.bind(this));*/
	        
	        var divCell = this.util.createDiv(colID + "container","nsDataGridFooterCellContainer"); 
	        bodyCell.appendChild(divCell);
			var divText = this.util.createDiv(colID + "text");
			divCell.appendChild(divText);
			var itemRenderer = colItem["footerRenderer"];
			if(itemRenderer)
			{
				var objRenderer = itemRenderer(colItem["dataField"],colItem,this.__arrFilteredGroupedSource,rowIndex,colIndex,bodyCell,bodyRow);
				var callback = function(objRenderer)
				{
					if(objRenderer)
					{
						if(this.util.isString(objRenderer))
						{
							var compSpan = document.createElement("span");
							compSpan.innerHTML = objRenderer;
							divText.appendChild(compSpan);
						}
						else
						{
							divText.appendChild(objRenderer);
						}
					}
				};
				this.util.resolveFunctionOrPromise(objRenderer,callback.bind(this));
			}
			this.__addPriorityClassInCell(bodyCell,colItem);
		}
	};
	
	NSGrid.prototype.__removeFooterColumn= function(colIndex)
	{
		if(colIndex > -1 && colIndex < this.__columns.length)
		{
			var bodyRow = this.__getBodyHeaderRow(this.__tblCenterFooter);
			if(bodyRow)
		    {
				var arrRows = this.__getBodyBodyRow(this.__tblCenterFooter);
		    	if(arrRows && arrRows.length > 0)
				{
		    		bodyRow.deleteCell(colIndex);
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
	
	NSGrid.prototype.__swapOrMoveFooterCell = function(functionality,sourceIndex,destinationIndex)
	{
		if(this.__isColumnIndexValid(sourceIndex) && this.__isColumnIndexValid(destinationIndex))
		{
			var bodyRow = this.__getBodyHeaderRow(this.__tblCenterFooter);
			if(bodyRow)
			{
				var arrRows = this.__getBodyBodyRow(this.__tblCenterFooter);
				if(arrRows && arrRows.length > 0)
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
	
	/******************************End of Footer Creation *************************************/
	/******************************Body Creation **********************************************/
	NSGrid.prototype.__createBody = function()
	{	
		this.__divCenterTableBodyContainer = this.__createTableAndParent(this.getID() + this.__TABLE_CENTER_BODY_CONTAINER_ID,this.__CLASS_BODY_CONTAINER,this.getID() + this.__TABLE_CENTER_BODY_ID);
		if(this.__enableFooter)
		{
			this.util.addStyleClass(this.__divCenterTableBodyContainer,"nsDataGridBodyContainerWithFooter");
		}
		this.__divTableBodyContainerWrapper.appendChild(this.__divCenterTableBodyContainer);
		this.__tblCenterBody = this.__divCenterTableBodyContainer.firstChild;
		var header = this.__tblCenterBody.createTHead();
	    this.__tblCenterBodyBody =  document.createElement("tbody");
		this.__tblCenterBody.appendChild(this.__tblCenterBodyBody);
		if(!this.__enableVirtualScroll && this.__enablePagination && this.__isPaginationTypeScroll)
		{
			this.__bodyScrollRef = this.__bodyScrollHandler.bind(this);
			this.util.addEvent(this.__getVerticalScrollableContainer(),"scroll",this.__bodyScrollRef);
		}
		this.__objGrid.__createBody();
	};
	
	NSGrid.prototype.__renderBody = function(fromSort,fromFilter)
	{
		var isReset = fromSort || fromFilter;
		var self = this;
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
			self.__navigationIndex = -1;
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
		//for some reason the body is to be destroyed so that row we store in items is not stale
		// need to fix this
		if(!this.__enableVirtualScroll)
		{
			resetTable(this.__tblCenterBody);
			this.__tblCenterBodyBody = createBody();
			if(this.__divCenterTableBodyContainer)
			{
				this.__divCenterTableBodyContainer.scrollTop = 0;
			}
		    this.__lastScrollPos = [0,0];
		}
		if(this.__enableContextMenu)
		{
			this.__initializeContextMenu();
		}
		this.__createBodyHeader();
		this.__createHeaderExtraRows();
		this.__createFixedHeaderRows();
		this.__createFooterRows();
		if(this.__enableVirtualScroll)
		{
			this.__setNSVirtualScroll(this.__arrInternalSource);
		}
		else if(this.__enablePagination && this.__isPaginationTypeScroll)
		{
			addBodyInTable(this.__tblCenterBody,this.__tblCenterBodyBody);
			var source = this.__arrInternalSource.slice(0);
			var resetInternalSource = false;
			if(this.__isPaginationModeAuto || this.__rowsRendered)
			{
				this.__arrInternalSource = source.slice(0,this.__INFINITE_SCROLL_INITIAL_LOAD);
				resetInternalSource = true;
			}
			this.__createBodyBody(this.__arrInternalSource,0,this.__arrInternalSource.length);
			if(resetInternalSource) {
				this.__arrInternalSource = source.slice(0);
			}
			if((this.__isPaginationModeAuto || this.__rowsRendered) && this.__enableAsyncLoadPagination && this.__totalRecords > this.__getTotalRows()) 
			{
				this.__arrInternalSource = source.slice(0);//this.__objGrid.__setSourceForAsync();
				this.__processArrayAsync = new this.util.processArrayAsync(this.__arrInternalSource,this.__createRowAsync,20,this.__asyncSourceCompleteHandler,this);
				this.__processArrayAsync.start(this.__getTotalRows());
			}
		}
		else if(this.__enablePagination && !this.__isPaginationTypeScroll && this.__isPaginationModeAuto)
		{
			this.__createBodyBody(this.__arrInternalSource,0,this.__pageSize);
			addBodyInTable(this.__tblCenterBody,this.__tblCenterBodyBody);
		}
		else 
		{
			this.__createBodyBody(this.__arrInternalSource,0,this.__arrInternalSource.length);
			addBodyInTable(this.__tblCenterBody,this.__tblCenterBodyBody);
		}
		if(!fromSort)
		{
			if(this.__enablePagination && !this.__isPaginationTypeScroll)
			{
				this.__createPaginationControl(this.__divOuterContainer);
			}
			this.__setBodyMeasurement();
		}
		if(this.__enablePagination && !this.__isPaginationTypeScroll && this.__isPaginationModeAuto)
		{
			if(this.__arrInternalSource && this.__arrInternalSource.length > 0)
			{
				this.__divPagination ? this.__divPagination.style.display = "" : null;
			}
			else
			{
				this.__divPagination ? this.__divPagination.style.display = "none" : null;
			}
		}
		this.__alignTables(isReset);
		//this.__setFixedCellsPosition();
		if(this.__enableRowMove)
		{
			var setting = {table:this.__tblCenterBody,isSameTableMove:this.__isSameTableMove,dragEndHandler:this.__rowMoverDropEndHandler};
			var rowMover = new NSTableRowMover(setting);
		}
		var self = this;
		if(this.__enableCellSelection)
		{
			if(this.__nsTableCellNavigator)
			{
				this.__nsTableCellNavigator.destroy();
				if(this.__tableCellNavigatorEventRef)
				{
					this.util.removeEvent(self.__tblCenterBody,NSTableCellNavigator.CELL_SELECTED,this.__tableCellNavigatorEventRef);
					this.util.removeEvent(self.__tblCenterBody,NSTableCellNavigator.CELL_UNSELECTED,this.__tableCellNavigatorEventRef);
					this.util.removeEvent(self.__tblCenterBody,NSTableCellNavigator.CELL_SELECTABLE,this.__tableCellNavigatorEventRef);
					this.__tableCellNavigatorEventRef = null;
				}
				this.__nsTableCellNavigator = null;
			}
			var keyNavigationValid = function(event,cell)
			{
				return self.__nsGridEditor.isOtherKeyNavigationValid(event,cell);
			};
			this.__nsTableCellNavigator = new NSTableCellNavigator(self.__tblCenterBody,{keyNavigationValid:keyNavigationValid});
			this.__tableCellNavigatorEventRef = this.__tableCellNavigatorEventHandler.bind(this);
			this.util.addEvent(self.__tblCenterBody,NSTableCellNavigator.CELL_SELECTED,this.__tableCellNavigatorEventRef);
			this.util.addEvent(self.__tblCenterBody,NSTableCellNavigator.CELL_UNSELECTED,this.__tableCellNavigatorEventRef);
			this.util.addEvent(self.__tblCenterBody,NSTableCellNavigator.CELL_SELECTABLE,this.__tableCellNavigatorEventRef);
		}
		if(this.__enableMultiCellSelection)
		{
			if(this.__nsCellSelection)
			{
				this.__nsCellSelection.destroy();
				if(this.__tableCellSelectionEventRef)
				{
					this.util.removeEvent(self.__tblCenterBody,NSCellSelection.SELECTION_START,this.__tableCellSelectionEventRef);
					this.util.removeEvent(self.__tblCenterBody,NSCellSelection.SELECTION_END,this.__tableCellSelectionEventRef);
					this.util.removeEvent(self.__tblCenterBody,NSCellSelection.SET_CELL_VALUE,this.__tableCellSelectionEventRef);
					this.__tableCellSelectionEventRef = null;
				}
				this.__nsCellSelection = null;
			}
			var editors = [];
			for (var colIndex = 0; colIndex < this.__columns.length; colIndex++)
		    {
				var colItem = this.__columns[colIndex];
				if(colItem["multiSelectionEditor"])
				{
					editors.push({type:NSCellSelection.EDITORS[colItem["multiSelectionEditor"]]});
				}
				else
				{
					editors.push({type:NSCellSelection.EDITORS[NSGrid.MULTI_SELECTION_EDITORS_TEXT]});
				}
		    }
			var setting = this.__multiCellSelectionSetting; 
			setting.editors = editors;
			this.__nsCellSelection = new NSCellSelection(self.__tblCenterBody,setting);
			this.__tableCellSelectionEventRef = this.__tableCellSelectionEventHandler.bind(this);
			this.util.addEvent(self.__tblCenterBody,NSCellSelection.SELECTION_START,this.__tableCellSelectionEventRef);
			this.util.addEvent(self.__tblCenterBody,NSCellSelection.SELECTION_END,this.__tableCellSelectionEventRef);
			this.util.addEvent(self.__tblCenterBody,NSCellSelection.SET_CELL_VALUE,this.__tableCellSelectionEventRef);
		}
		this.__addMediaQueries();
		this.__addStyleForFixedColumns();
		//this.__updateFixedColumnsForAllTables();
	};
	
	NSGrid.prototype.__setNSVirtualScroll = function(source)
	{
		var length = 0;
		if(source && source.length)
		{
			for(var count = 0;count < source.length;count++)
			{
				if(source[count][this.__fieldRowVisible])
				{
					length++;
				}
			}
		}
		if(this.__nsVirtualScroll)
		{
			this.__nsVirtualScroll.dataSource(length);
		}
		else
		{
			if(length > 0)
			{
				var self = this;
				var pageChangedHandler = function(page) {
					//self.__updateStickyColumns(self.__tblCenterBody);
				}
				var setting = {scrollElement: this.__divCenterTableBodyContainer,contentElement: this.__tblCenterBodyBody,itemTag: "tr",totalLength: length,getItemComponent:this.__getRowComponentForVirtual.call(this),
								getEmptyItemComponent:this.__getEmptyRowComponentForVirtual.call(this),pageChanged: pageChangedHandler};
				var virtualScrollSetting = this.__virtualScrollSetting;
				var arrCopyFields = ["pageSize","pagesRendered","enableScrollDelay","scrollInterval","resizeInterval","enableLoader","getLoaderComponent"];
				var field = null;
				for(var count = 0;count < arrCopyFields.length;count++)
				{
					field = arrCopyFields[count];
					if(!this.util.isUndefinedOrNull(virtualScrollSetting[field]))
					{
						setting[field] = virtualScrollSetting[field];
					}
				}
				this.__nsVirtualScroll = new NSVirtualScroll(setting);
			}
			else if(this.__tblCenterBodyBody)
			{
				this.__tblCenterBodyBody.innerHTML = "";
				this.__tblCenterBodyBody.appendChild(this.__createNoDataRow());
			}
		}
	};
	
	NSGrid.prototype.__getRowComponentForVirtual = function()
	{
		var grid = this;
		var CreateRow = function(index)
		{
			this.__index = index;
			this.__grid =  grid;
			this.__item = null;
			this.__row = null;
		};
		CreateRow.prototype.getElement = function()
		{
			if(!this.__row)
			{
				if(this.__grid.__type == this.__grid.GRID_TYPE_NORMAL)
				{
					this.__item = this.__grid.__arrInternalSource[this.__index];
				}
				else
				{
					this.__item = this.__grid.__getVisibleItemByIndex(null,this.__index);
				}
				this.__row = this.__grid.__createBodyRow(this.__item,false);
			}
			return this.__row;
		};
		return CreateRow;
	};
	
	NSGrid.prototype.__getEmptyRowComponentForVirtual = function()
	{
		var grid = this;
		var CreateEmptyRow = function()
		{
			this.__grid = grid;
			this.__row = null;
		};
		CreateEmptyRow.prototype.getElement = function()
		{
			if(!this.__row)
			{
				this.__row = this.__grid.__createNoDataRow.call(this.__grid);
			}
			return this.__row;
		};
		return CreateEmptyRow;
	};
	
	NSGrid.prototype.__createCustomScroller = function()
	{
		if(this.__enableCustomScrollBar && !this.__scroller)
		{
			var setting = {verticalElement:this.__getVerticalScrollableContainer(),horizontalElement:this.__getHorizontalScrollableContainer(),enableCustomHandler: true,verticalScrollButtons:this.__customScrollBarSetting.verticalScrollButtons,horizontalScrollButtons:this.__customScrollBarSetting.horizontalScrollButtons,enableMoveOnClick: true};
			for (var key in setting) 
			{ 
				this.__scrollerSetting[key] = setting[key]; 
			}
			this.__scroller = new NSScroller(this.__scrollerSetting);
			var customScrollHandler = this.__customScrollHandler.bind(this);
			this.util.addEvent(this.__scrollerSetting.verticalElement,NSScroller.SCROLLING,customScrollHandler);
			if(this.__scrollerSetting.verticalElement != this.__scrollerSetting.horizontalElement)
			{
				this.util.addEvent(this.__scrollerSetting.horizontalElement,NSScroller.SCROLLING,customScrollHandler);
			}
		}
	};
	
	NSGrid.prototype.__customScrollHandler = function(event)
	{
		var self = this;
		var virtualVerHandler = function()
		{
			//self.__setVirtualScroll.bind(self)(scrollPos,event);
		};
		var dataRefreshVerHandler = function()
		{
			
		};
		var asyncLoadVerHandler = function()
		{
			
		};
		var paginationVerHandler = function()
		{
			
		};
		var normalVerHandler = function()
		{
			self.__getVerticalScrollableContainer().scrollTop = scrollPos;
		};
		var normalHorHandler = function()
		{
			self.__getHorizontalScrollableContainer().scrollLeft = scrollPos;
		};
		var objCondition = {virtualScroll:{eligible:this.__enableVirtualScroll,verHandler:virtualVerHandler,horHandler:normalHorHandler},
							dataRefreshOnEnd:{eligible:this.__enableDataRefreshOnScrollEnd,verHandler:dataRefreshVerHandler,horHandler:normalHorHandler},
							asyncLoad:{eligible:this.__enableAsyncLoadPagination,verHandler:asyncLoadVerHandler,horHandler:normalHorHandler},
							pagination:{eligible:(this.__enablePagination && this.__isPaginationTypeScroll),verHandler:paginationVerHandler,horHandler:normalHorHandler},
							normal:{eligible:true,verHandler:normalVerHandler,horHandler:normalHorHandler}
						   };
		var eventItem = event;
		var direction = eventItem.direction;
		var scrollPos = eventItem.scrollPos;
		var oldScrollPos = eventItem.oldScrollPos;
		for(var key in objCondition)
		{
			var item = objCondition[key];
			if(item.eligible)
			{
				if(direction == "vertical")
				{
					if(item.verHandler)
					{
						item.verHandler();
					}
				}
				else
				{
					if(item.horHandler)
					{
						item.horHandler();
					}
				}
				break;
			}
		}
	};
	
	NSGrid.prototype.__createScrollTip = function() 
	{
		if(this.__enableScrollBarTip && !this.__divScrollTipContainer)
		{
			this.__divScrollTipContainer = this.util.createDiv(this.getID() + "ScrollTipContainer","nsGridScrollTipContainer");
			this.__divScrollTipText = this.util.createDiv(this.getID() + "ScrollTipText","nsGridScrollTipText");
			this.__divScrollTipContainer.appendChild(this.__divScrollTipText);
			var divTri = this.util.createDiv(this.getID() + "ScrollTipTriangle","nsGridScrollTipTriangle");
			this.__divScrollTipContainer.appendChild(divTri);
			this.addChild(this.__divScrollTipContainer);
		}
	};
	
	NSGrid.prototype.__createRowAsync= function(item,index,array)
	{
		this.__objGrid.__createRowAsync(item,index,array);
		console.log(index + " rendererd");
	};
	
	NSGrid.prototype.__asyncSourceCompleteHandler= function()
	{
		console.log("CompleteHandler");
	};
	
	NSGrid.prototype.__createBodyHeader= function()
	{
		if(this.__tblCenterBody)
		{
			//for some reason this method is called multiple times on load so checking if colgroup is already created or not
			var isColGroupCreated = false;
			if(this.__columns && this.__columns.length > 0 && document.getElementById(this.getID() + "BodyColGroup" + this.__columns[0].dataField))
			{
				isColGroupCreated = true;
			}
			//In case of Virtual scroll thead will be present
			var header = this.__tblCenterBody.querySelector("thead");
			if(!header)
			{
				header = this.__tblCenterBody.createTHead();
			}
			var headerRow = header.insertRow(-1);
		    headerRow.style.height = "auto";
		    for (var colIndex = 0; colIndex < this.__columns.length; colIndex++)
		    {
		        var colItem = this.__columns[colIndex];
		        if(!isColGroupCreated)
		        {
		        	this.__createBodyColGroup(colItem);
		        }
		        this.__createBodyHeaderCell(colItem,headerRow);
		    }
		}
	};
	
	NSGrid.prototype.__createBodyColGroup = function(colItem)
	{
		if(colItem)
		{
			var colgroup = document.createElement("colgroup");
			colgroup.setAttribute("id",this.getID() + "BodyColGroup" + colItem.dataField);
			this.util.addStyleClass(colgroup,"nsGridColGroup");
			this.util.addStyleClass(colgroup,"nsGridColGroupBody");
			this.__tblCenterBody.appendChild(colgroup);
		}
	};
	
	NSGrid.prototype.__createBodyHeaderCell= function(colItem,headerRow)
	{
		if(colItem && headerRow)
		{
			var headerCell = headerRow.insertCell(-1);
			this.util.addStyleClass(headerCell,"nsGridCell");
			headerCell.style.width = (colItem["width"]);
		    headerCell.style.height = "0px";
		    headerCell.style.padding = "0px";
		    this.__addPriorityClassInCell(headerCell,colItem);
		}
	};
	
	NSGrid.prototype.__resetDataInBody= function(fromIndex,toIndex,fromRowIndex,useVisibleIndex)
	{
		this.__objGrid.__resetDataInBody(fromIndex,toIndex,fromRowIndex,useVisibleIndex);
	};
	
	NSGrid.prototype.__createBodyBody= function(dataSet,startIndex,endIndex,callAsync)
	{
		this.__stopScroll = true;
	    if(dataSet && dataSet.length > 0)
	    {
	    	this.__objGrid.__createBodyBody(dataSet,startIndex,endIndex);
	    }
	    else
	    {
	    	this.__tblCenterBodyBody.appendChild(this.__createNoDataRow());
	    }
	    this.__stopScroll = false;
	    if(callAsync && this.__processArrayAsync)
	    {
	    	this.__processArrayAsync.start(this.__getTotalRows());
	    }
	};
	
	NSGrid.prototype.__setBodyRowProperty = function(row,item,rowIndex)
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
			if(!this.__enableColumnMouseHover)
			{
			    var className = ((rowIndex % 2) === 0) ? this.__CLASS_EVEN_ROW : this.__CLASS_ODD_ROW;
			    this.util.addStyleClass(row,"nsGridRow " + className);
			}
		    if(this.__enableMouseHover)
		    {
		    	this.util.addEvent(row,"mouseover",this.__rowMouseHover.bind(this));
			    this.util.addEvent(row,"mouseout",this.__rowMouseOut.bind(this));
		    }
		    this.util.addEvent(row,"click",this.__rowClickHandler.bind(this));
		    this.util.addEvent(row,"dblclick",this.__rowDblClickHandler.bind(this));
		}
	};
	
	NSGrid.prototype.__createBodyRow = function(item,isAdd)
	{
		return this.__objGrid.__createRow(item,null,isAdd);
	};
	
	NSGrid.prototype.__createBodyRowAt = function(item,index)
	{
		if(item && index > -1)
	    {
			return this.__objGrid.__createRow(item,index);
	    }
		return null;
	};
	
	NSGrid.prototype.__createBodyRowCell= function(row,colIndex,createDiv)
	{
		var cell =  row.insertCell(-1);
    	this.util.addStyleClass(cell,"nsGridCell");
    	this.util.addStyleClass(cell , "nsBodyDataGridCell");
    	this.util.addStyleClass(cell , "nsBodyDataGridCellTheme");
    	this.__addStyleForFixedCell(cell,colIndex);
    	this.__applyCustomClass(cell,"bodyCell");
    	if(colIndex === 0)
    	{
    		this.__applyCustomClass(cell,"firstBodyColumn");
    	}
    	else
    	{
    		this.__applyCustomClass(cell,"nonFirstBodyColumn");
    	}
		if(createDiv)
		{
			var cellDiv = this.util.createDiv(null);
		    cell.appendChild(cellDiv);
		}
	    return cell;
	};
	
	NSGrid.prototype.__setBodyCellProperties= function(cell)
	{
		if(cell)
		{
			var handler = this.__bodyCellEventHandler.bind(this);
			if(this.__enableColumnMouseHover)
			{
				this.util.addEvent(cell,"mouseover",handler);
				this.util.addEvent(cell,"mouseleave",handler);
			}
			this.util.addEvent(cell,"click",handler);
			this.util.addEvent(cell,"dblclick",handler);
			//this.__setClassForFixedColumn(cell);
		}
	};
	
	NSGrid.prototype.__setBodyCellProperty = function(row,cell,item,colItem,colIndex,parentIndex,level,isReset)
	{
		var hierarchicalPadding = 0;
		if(colItem && colItem.hasOwnProperty("dataField") && colItem["dataField"])
		{
			var cellDiv = cell.firstChild;
	        if((this.__enableHierarchical || this.__enableGrouping || this.__enableMasterDetail) && colIndex == 0 && item.hasOwnProperty(this.__childField) && item[this.__childField]  && item[this.__childField].length > 0)
	        {
	        	this.util.addStyleClass(cellDiv,this.__CLASS_GROUP_CELL);
	        	var isCollapsed = false;
	        	if(!isReset && item.hasOwnProperty(this.__fieldIsCollapsed))
	 	        {
	        		isCollapsed = item[this.__fieldIsCollapsed];
	 	        }
	        	//this.__createArrow(parentIndex,cellDiv,isCollapsed);
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
	        	if(this.__enableHierarchical || this.__enableMasterDetail)
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
	
	NSGrid.prototype.__removeBodyColumn= function(colIndex)
	{
		if(colIndex > -1 && colIndex < this.__columns.length)
		{
			var bodyRow = this.__getBodyHeaderRow(this.__tblCenterBody);
			if(bodyRow)
		    {
				var arrRows = this.__getBodyBodyRow(this.__tblCenterBody);
		    	if(arrRows && arrRows.length > 0)
				{
		    		bodyRow.deleteCell(colIndex);
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
	
	NSGrid.prototype.__swapOrMoveBodyCell = function(functionality,sourceIndex,destinationIndex)
	{
		if(this.__isColumnIndexValid(sourceIndex) && this.__isColumnIndexValid(destinationIndex))
		{
			var bodyRow = this.__getBodyHeaderRow(this.__tblCenterBody);
			if(bodyRow)
			{
				var arrRows = this.__getBodyBodyRow(this.__tblCenterBody);
				if(arrRows && arrRows.length > 0)
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
	
	NSGrid.prototype.__createArrow = function(item,parentRowCount,parentElement,isCollapsed,colItem)
	{
		 if(parentElement && this.__showExpandCollapseIcon)
		 {
			 var cellArrowParent = this.util.createDiv(null,"nsArrowParent");
			 var arrowID = this.getID() + "compArrow" + parentRowCount;
			 var compArrow = this.util.createDiv(arrowID,"nsArrow");
			 //compArrow.style.paddingTop = "3px";
			 compArrow.setAttribute("ns-parent-row-count",parentRowCount);
			 
			 var objSVG = new NSSvg();
			 this.__objGrid.__createArrow(compArrow,objSVG,arrowID,isCollapsed,item,colItem);
			 this.util.addEvent(compArrow,"click",this.__arrowClickHandler.bind(this));
			 cellArrowParent.appendChild(compArrow);
			 parentElement.appendChild(cellArrowParent);
			 item[this.__fieldRowArrow] = compArrow;
			 return compArrow;
		 }
		 return null;
	};
	
	NSGrid.prototype.__setArrowDirection = function(compArrow,isCollapsed)
	{
		if(compArrow)
		{
			var parent = this.util.findParent(compArrow,"TD");
			var colIndex = parseInt(parent.getAttribute("currentColumnIndex"));
			var colItem = this.__getColumnObject(colIndex);
			this.__objGrid.__setArrowDirection(compArrow,isCollapsed,colItem);
		}
	};
	
	NSGrid.prototype.__isArrowCollapsed = function(compArrow)
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
	
	NSGrid.prototype.__isRowCollapsed = function(element,rowIndex)
	{
		if(element)
		{
			element = this.util.findParent(element,"TR");
			if(element)
			{
				rowIndex = parseInt(element.getAttribute("ns-index"));
			}
		}
		if(rowIndex > -1)
		{
			var item = this.__getItemByIndex(rowIndex);
			if(item)
			{
				return item[this.__fieldIsCollapsed];
			}
		}
		return false;
	};
	
	NSGrid.prototype.__createNoDataRow = function()
	{
		var row = document.createElement("tr");
		this.util.addStyleClass(row,"nsNoRecordsFound");
		row.style.height = "auto";
		var cell = row.insertCell(-1);
		cell.setAttribute("colspan",this.__columns.length);
		var textNode = document.createTextNode(this.__noDataMessage);
		cell.appendChild(textNode);
		return row;
	};
	/******************************Fixed Column ***************************************/
	NSGrid.prototype.__createFixedRows = function()
	{
		this.__createFixedHeaderRows();
		this.__createFixedBodyRows();
		this.__createFixedFooterRows();
	};
	
	NSGrid.prototype.__createFixedHeaderRows = function()
	{
		this.__arrFixedLeftCells = [];
		this.__arrFixedRightCells = [];
		var centerHeaderHeaderCells = [];
		var centerHeaderBodyCells = [];
		var centerHeaderRendererCells = [];
		var centerBodyHeaderCells = []; 
		var arrExtraHeaderCells = [];
		var centerHeaderRow = this.__getHeaderHeaderRow(this.__tblCenterHeader);
		if(centerHeaderRow)
		{
			centerHeaderHeaderCells = centerHeaderRow.cells;
		}
		var centerBodyRow = this.__getHeaderBodyRow(this.__tblCenterHeader);
		if(centerBodyRow)
		{
			centerHeaderBodyCells = centerBodyRow.cells;
			var centerRendererRow = this.__getHeaderFilterRow(this.__tblCenterHeader);
			centerHeaderRendererCells = centerRendererRow ? centerRendererRow.cells : null;
			var arrExtraRow = this.__getHeaderExtraRow(this.__tblCenterHeader);
			if(arrExtraRow && arrExtraRow.length > 0)
			{
				for (var rowIndex = 0; rowIndex < arrExtraRow.length; rowIndex++)
			    {
					var row = arrExtraRow[rowIndex];
					arrExtraHeaderCells.push(row.cells);
			    }
			}
		}
		var centerHeaderRow =  this.__getBodyHeaderRow(this.__tblCenterBody);
		if(centerHeaderRow)
		{
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
		    	for (var rowIndex = 0; rowIndex < arrExtraHeaderCells.length; rowIndex++)
			    {
		    		var extraCell = arrExtraHeaderCells[rowIndex][colIndex];
			    	setCellProperties(arrFixed,extraCell,isLeftDirection);
			    }
		    }
		};
		this.__callFixedArrayCallback.bind(this)(setCells);
	};
	
	NSGrid.prototype.__createFixedBodyRows = function()
	{
		var headerRow = this.__getBodyHeaderRow(this.__tblCenterBody);
		if(headerRow)
		{
			this.__createFixedBodyRow(headerRow);
		}
		var arrRows = this.__getBodyBodyRow(this.__tblCenterBody);
		if(arrRows && arrRows.length > 0)
		{
			for(var count = 0; count < arrRows.length; count++) 
			{
				var row = arrRows[count];
				this.__createFixedBodyRow(row);
			}
		}
	};
	
	NSGrid.prototype.__createFixedBodyRow = function(row)
	{
		/*var centerBodyBodyCells = row.cells;
		var setCellProperties = this.__setFixedCellProperties.bind(this);
		var setCells = function(arrFixed,startIndex,endIndex,isLeftDirection)
		{
		    for (var colIndex = startIndex; colIndex < endIndex; colIndex++)
		    {
		    	var fixedCell = centerBodyBodyCells[colIndex];
		    	setCellProperties(arrFixed,fixedCell,isLeftDirection);
		    }
		};
		this.__callFixedArrayCallback.bind(this)(setCells);*/
	};
	
	NSGrid.prototype.__createFixedFooterRows = function()
	{
		var headerRow = this.__getBodyHeaderRow(this.__tblCenterFooter);
		if(headerRow)
		{
			this.__createFixedFooterRow(headerRow);
		}
		var arrRows = this.__getBodyBodyRow(this.__tblCenterFooter);
		if(arrRows && arrRows.length > 0)
		{
			for(var count = 0; count < arrRows.length; count++) 
			{
				var row = arrRows[count];
				this.__createFixedFooterRow(row);
			}
		}
	};
	
	NSGrid.prototype.__createFixedFooterRow = function(row)
	{
		/*var centerBodyBodyCells = row.cells;
		var setCellProperties = this.__setFixedCellProperties.bind(this);
		var setCells = function(arrFixed,startIndex,endIndex,isLeftDirection)
		{
		    for (var colIndex = startIndex; colIndex < endIndex; colIndex++)
		    {
		    	var fixedCell = centerBodyBodyCells[colIndex];
		    	setCellProperties(arrFixed,fixedCell,isLeftDirection);
		    }
		};
		this.__callFixedArrayCallback.bind(this)(setCells);*/
	};
	
	NSGrid.prototype.__callFixedArrayCallback = function(callBack)
	{
		/*if(this.__leftFixedColumn > 0 && this.__columns && this.__columns.length > this.__leftFixedColumn)
		{
			callBack(this.__arrFixedLeftCells,0,this.__leftFixedColumn,true);
		}
		if(this.__rightFixedColumn > 0 && this.__columns && this.__columns.length > this.__rightFixedColumn)
		{
			callBack(this.__arrFixedRightCells,this.__columns.length - this.__rightFixedColumn,this.__columns.length,false);
		}*/
	};
	
	NSGrid.prototype.__setFixedCellProperties = function(arrFixed,cell,isLeftDirection)
	{
		/*this.__setFixedBackground(cell);
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
		}*/
		arrFixed.push(cell);
	};
	
	NSGrid.prototype.__setFixedBackground = function(cell) 
	{
		var row = cell.parentNode;
		var cellBackground = this.util.getStyleValue(cell,"background-color",false);
		cellBackground = (cellBackground == "transparent" || cellBackground == "rgba(0, 0, 0, 0)") ? null : cellBackground;
	
		var rowBackground = this.util.getStyleValue(row,"background-color",false);
		rowBackground = (rowBackground == "transparent" || rowBackground == "rgba(0, 0, 0, 0)") ? null : rowBackground;
	
		var background = rowBackground ? rowBackground : "white";
		background = cellBackground ? cellBackground : background;
		
		cell.style.backgroundColor = background;
	};
	
	NSGrid.prototype.__setFixedCellsPosition = function()
	{
		/*var divBodyContainer = this.__getVerticalScrollableContainer();
		var divHorContainer = this.__getHorizontalScrollableContainer();
		var scrollWidth = divHorContainer.scrollWidth;
		var clientWidth = divHorContainer.clientWidth;
		var scrollHeight = divBodyContainer.scrollHeight;
		var clientHeight = divBodyContainer.clientHeight;
		var top = divBodyContainer.scrollTop;
		var left = divHorContainer.scrollLeft;
		var right = scrollWidth - clientWidth - left;
		for(var count = 0;count < this.__arrFixedLeftCells.length;count++)
		{
			var cell = this.__arrFixedLeftCells[count];
			cell.style.right = null; 
			cell.style.left = left + "px";
		}
		for(var count = 0;count < this.__arrFixedRightCells.length;count++)
		{
			var cell = this.__arrFixedRightCells[count];
			cell.style.left = null;
			cell.style.right = right + "px";
		}*/
	};
	
	/*NSGrid.prototype.__setClassForFixedColumn = function(cell)
	{
		this.__setFixedBackground(cell);
		this.util.addStyleClass(cell,"nsFixedDataGridCell");
		if(this.__leftFixedColumn > 0 && this.__columns && this.__columns.length > this.__leftFixedColumn)
		{
			if(cell.cellIndex === (this.__leftFixedColumn - 1))
			{
				this.util.addStyleClass(cell,"nsFixedLeftLastCell");
			}
		}
		if(this.__rightFixedColumn > 0 && this.__columns && this.__columns.length > this.__rightFixedColumn)
		{
			if(cell.cellIndex === (this.__columns.length - this.__rightFixedColumn))
			{
				this.util.addStyleClass(cell,"nsFixedRightFirstCell");
			}
		}
	}*/
	
	NSGrid.prototype.__updateFixedColumnsForAllTables = function() 
	{
		this.__updateStickyColumns(this.__tblCenterHeader);
		this.__updateStickyColumns(this.__tblCenterBody);
		this.__updateStickyColumns(this.__tblCenterFooter);
	}
	
	NSGrid.prototype.__updateStickyColumns = function(table,recalculate) 
	{
		var arrRows = this.__getBodyBodyRow(table);
		if(arrRows && arrRows.length) {
			var stickyStartStates = this.__getFixedColumnIndicatorArray("Left",recalculate);
			var stickyEndStates = this.__getFixedColumnIndicatorArray("Right",recalculate);
			var row = arrRows[0];
			var cellWidths = this.__getCellWidths(row, recalculate);
			var startPositions = this.__getStickyStartColumnPositions(cellWidths, stickyStartStates);
			var endPositions = this.__getStickyEndColumnPositions(cellWidths, stickyEndStates);

			var lastStickyStart = stickyStartStates.lastIndexOf(true);
			var firstStickyEnd = stickyEndStates.indexOf(true);
			for(var rowIndex = 0;rowIndex < arrRows.length;rowIndex++) 
			{
				row = arrRows[rowIndex];
				var arrCells = row.cells;
		        for (var cellIndex = 0;cellIndex < arrCells.length;cellIndex++) 
		        {
		        	const cell = arrCells[cellIndex]
		        	if (stickyStartStates[cellIndex]) 
		        	{
		        		this.__addStickyStyle(cell,"Left",startPositions[cellIndex],cellIndex === lastStickyStart);
		        		this.__setFixedBackground(cell);
		        	}
		        	if (stickyEndStates[cellIndex]) 
		        	{
		        		this.__addStickyStyle(cell,"Right", endPositions[cellIndex],cellIndex === firstStickyEnd);
		        		this.__setFixedBackground(cell);
		        	}
		        }
		     }
		}
	}
	
	NSGrid.prototype.__getFixedColumnIndicatorArray = function(direction,recalculate) 
	{
		var fieldName = "__cachedFixed" + direction + "Indicator";
		var arrIndicator = this[fieldName];
		var directionLower = direction.toLowerCase();
		if(!recalculate && arrIndicator && arrIndicator.length) {
			return arrIndicator;
		}
		var arrRet = [];
		for(var count = 0; count < this.__columns.length;count++)
		{
			var objColumn = this.__columns[count];
			if(objColumn.pinned && objColumn.pinned == directionLower) {
				arrRet.push(true);
			}
			else {
				arrRet.push(false);
			}
		}
		this[fieldName] = arrRet;
		return arrRet;
	}
	
	NSGrid.prototype.__getCellWidths = function(row,recalculate)
	{
		if(!recalculate && this.__cachedCellWidths && this.__cachedCellWidths.length) {
			return this.__cachedCellWidths;
		}
		var cellWidths = [];
	    var firstRowCells = row.children;
	    for (var i = 0; i < firstRowCells.length; i++) {
	      var cell = firstRowCells[i];
	      cellWidths.push(cell.getBoundingClientRect().width);
	    }
	    this.__cachedCellWidths = cellWidths;
	    return cellWidths;
	}
	
	NSGrid.prototype.__getStickyStartColumnPositions = function(widths,stickyStates)
	{
	    var positions = [];
	    var nextPosition = 0;
	
	    for (var i = 0; i < widths.length; i++) {
	      if (stickyStates[i]) {
	        positions[i] = nextPosition;
	        nextPosition += widths[i];
	      }
	    }
	
	    return positions;
	}
	
	NSGrid.prototype.__getStickyEndColumnPositions = function(widths,stickyStates)
	{
		var positions = [];
		var nextPosition = 0;

	    for (var i = widths.length; i > 0; i--) {
	      if (stickyStates[i]) {
	        positions[i] = nextPosition;
	        nextPosition += widths[i];
	      }
	    }

	    return positions;
	}
	
	NSGrid.prototype.__addStickyStyle = function(element,direction,dirValue,isBorderElement) 
    {
		var directionLower = direction.toLowerCase();
	    element.classList.add("nsFixedDataGridCell");
	    if (isBorderElement) {
	    	element.classList.add("nsFixed" + direction + "LastCell");
	    }
	    element.style[directionLower] = dirValue + "px";
	    //element.style.zIndex = this._getCalculatedZIndex(element);
	    /*if (this._needsPositionStickyOnElement) {
	      element.style.cssText += 'position: -webkit-sticky; position: sticky; ';
	    }*/
	}
	
	NSGrid.prototype.__isColumnFixed = function(index)
	{
		return ((index < this.__leftFixedColumn) || ((this.__orignalColumns.length - this.__rightFixedColumn) <= index));
	};
	
	NSGrid.prototype.__isFixedColumnApplied = function()
	{
		return ((this.__leftFixedColumn > 0) || (this.__rightFixedColumn > 0));
	};
	
	NSGrid.prototype.__addStyleForFixedCell = function(cell,colIndex)
	{
		var isColumnFixed = this.__isColumnFixed(colIndex);
		if(isColumnFixed) 
		{
			this.util.addStyleClass(cell,"nsFixedDataGridCell");
			if(colIndex === (this.__leftFixedColumn - 1))
			{
				this.util.addStyleClass(cell,"nsFixedLeftLastCell");
			}
			else if(colIndex === (this.__columns.length - this.__rightFixedColumn))
			{
				this.util.addStyleClass(cell,"nsFixedRightFirstCell");
			}
		}
	}
	
	NSGrid.prototype.__updateColumnClassForFixedColumns = function(index,direction)
	{
		var self = this;
		var refreshCellClass = function(arrRows) 
		{
			if(arrRows && arrRows.length) 
			{
				for(var count = 0;count < arrRows.length;count++) 
				{
					var cell = arrRows[count].cells[index];
					if(direction == "left" || direction == "right") 
					{
						self.util.addStyleClass(cell,"nsFixedDataGridCell");
						self.util.addStyleClass(cell,"nsFixedDataGridCell" + self.util.toCamelCase(direction));
					}
					else 
					{
						self.util.removeStyleClass(cell,"nsFixedDataGridCell");
						self.util.removeStyleClass(cell,"nsFixedDataGridCellLeft");
						self.util.removeStyleClass(cell,"nsFixedDataGridCellRight");
					}
				}
			}
		}
		if(this.__tblCenterHeaderBody) {
			var arrHeaderRows = this.__tblCenterHeaderBody.rows;
			refreshCellClass(arrHeaderRows);
		}
		if(this.__tblCenterBodyBody) {
			var arrBodyRows = this.__tblCenterBodyBody.rows;
			refreshCellClass(arrBodyRows);
		}
		if(this.__tblCenterFooterBody) {
			var arrFooterRows = this.__tblCenterFooterBody.rows;
			refreshCellClass(arrFooterRows);
		}
		this.__updateColumnClassForFixedLastColumns();
	}
	
	NSGrid.prototype.__updateColumnClassForFixedLastColumns = function()
	{
		var self = this;
		var leftIndex = this.__leftFixedColumn - 1;
		var rightIndex = this.__columns.length - this.__rightFixedColumn;
		
		var resetCellClassByCon = function(con) 
		{
			if(con) 
			{
				var arrCell = con.querySelectorAll(".nsFixedLeftLastCell");
				if(arrCell && arrCell.length) 
				{
					for(var count = 0;count < arrCell.length;count++) 
					{
						var cell = arrCell[count];
						self.util.removeStyleClass(cell,"nsFixedLeftLastCell");
					}
				}
				arrCell = con.querySelectorAll(".nsFixedRightFirstCell");
				if(arrCell && arrCell.length) 
				{
					for(var count = 0;count < arrCell.length;count++) 
					{
						var cell = arrCell[count];
						self.util.removeStyleClass(cell,"nsFixedRightFirstCell");
					}
				}
			}
		}
		
		var refreshCellInRow = function(row) {
			if(row) {
				if(row.cells.length > leftIndex) {
					var cell = row.cells[leftIndex];
					self.util.addStyleClass(cell,"nsFixedLeftLastCell");
				}
				if(row.cells.length > rightIndex) {
					var cell = row.cells[rightIndex];
					self.util.addStyleClass(cell,"nsFixedRightFirstCell");
				}
			}
		}
		
		var refreshCellClass = function(arrRows) {
			if(arrRows && arrRows.length) {
				for(var count = 0;count < arrRows.length;count++) {
					refreshCellInRow(arrRows[count]);
				}
			}
		}
		
		var refreshCellInVirtual = function(row) {
			resetCellClassByCon(row);
			refreshCellInRow(row);
			return row;
		}
		
		if(this.__isFixedColumnApplied()) {
			if(this.__tblCenterHeaderBody) {
				resetCellClassByCon(this.__tblCenterHeaderBody);
				var arrHeaderRows = this.__tblCenterHeaderBody.rows;
				refreshCellClass(arrHeaderRows);
			}
			if(this.__tblCenterBodyBody) {
				resetCellClassByCon(this.__tblCenterBodyBody);
				var arrBodyRows = this.__tblCenterBodyBody.rows;
				refreshCellClass(arrBodyRows);
			}
			if(this.__tblCenterFooterBody) {
				resetCellClassByCon(this.__tblCenterFooterBody);
				var arrFooterRows = this.__tblCenterFooterBody.rows;
				refreshCellClass(arrFooterRows);
			}
			if(this.__nsVirtualScroll) {
				this.__nsVirtualScroll.updateItems(refreshCellInVirtual);
			}
			
		}
	}
	
	NSGrid.prototype.__addStyleForFixedColumns = function()
	{
		var styleId = "nsGridFixedColumnStyle";
		var arrStyle = [];
		var table = this.__tblCenterHeader;
		var arrRows = this.__getBodyBodyRow(table);
		if(arrRows && arrRows.length && this.__columns) {
			var styleTemplate = ".nsGridHeaderRow > .nsGridCell:nth-child(###index###),.nsGridFilterRow > .nsGridCell:nth-child(###index###)," +
					".nsHeaderExtraRow > .nsGridCell:nth-child(###index###),.nsGridRow > .nsGridCell:nth-child(###index###)," +
					".nsGridFooterRow > .nsGridCell:nth-child(###index###) {\r\n" + 
					"    ###pos###;\r\n" +
					"}"
			var tableRect = table.getBoundingClientRect();
			//|| tableRect.x > 0
			if(!this.__tableRectFixedColumn) {
				this.__tableRectFixedColumn = tableRect;
			}
			else {
				tableRect = this.__tableRectFixedColumn;
			}
			var row = arrRows[1];
			var arrCells = row.cells;
			if(this.__leftFixedColumn > 0 && this.__columns.length > this.__leftFixedColumn)
    		{
		        for (var cellIndex = 0;cellIndex < arrCells.length;cellIndex++) 
		        {
		        	var cell = arrCells[cellIndex];
		        	var cellRect = cell.getBoundingClientRect();
	    			if(cell.cellIndex < this.__leftFixedColumn)
	    			{
	    			    var left = cellRect.x - tableRect.x;
	    			    var cellStyle = styleTemplate.replace(/###index###/g,cell.cellIndex + 1);
	    			    cellStyle = cellStyle.replace("###pos###","left: " + left + "px");
	    			    arrStyle.push(cellStyle);
	    			}
	    			else 
	    			{
	    				break;
	    			}
		        }
			}
			if(this.__rightFixedColumn > 0 && this.__columns.length > this.__rightFixedColumn)
			{
				var totalWidth = 0;
				var startingRightColIndex = this.__columns.length - this.__rightFixedColumn;
				for (var cellIndex = arrCells.length - 1;cellIndex > -1;cellIndex--) 
		        {
		        	var cell = arrCells[cellIndex];
		        	var cellRect = cell.getBoundingClientRect();
		        	if(cell.cellIndex >= startingRightColIndex)
	    			{
		        		var right = 0;
	    				if(cellIndex !== arrCells.length - 1) 
	    				{
	    					right = totalWidth;
	    				}
	    				totalWidth += cellRect.width;
	    				var cellStyle = styleTemplate.replace(/###index###/g,cell.cellIndex + 1);
	    			    cellStyle = cellStyle.replace("###pos###","right: " + right + "px");
	    			    arrStyle.push(cellStyle);
	    			}
		        	else 
	    			{
	    				break;
	    			}
		        }
			}
	        var styleElement = document.querySelector("#" + styleId);
	        if (styleElement) {
	          styleElement.parentNode.removeChild(styleElement);
	        }
	        this.util.addStylesToHead(styleId,arrStyle);
		}
	};
	
	
	/******************************End of Fixed Column logic **************************/
	/******************************Event Listeners *************************************/
	
	NSGrid.prototype.__arrowClickHandler = function(event)
	{
		event = this.util.getEvent(event);
		var target = this.util.getTarget(event);
		target = this.util.findParent(target,"DIV");
		if(target && target.hasAttribute("ns-parent-row-count"))
		{
			var rowIndex = target.getAttribute("ns-parent-row-count");
			var isCollapse = this.__isArrowCollapsed(target);
			rowIndex = parseInt(rowIndex);
			if(rowIndex > -1)
			{
				var item = this.__getItemByIndex(rowIndex);
				if(item[this.__childField]  && item[this.__childField].length > 0)
		        {
					this.__showHideRow(rowIndex,target,!isCollapse);
		        }
				else 
				{
					this.__objGrid.__handleOnDemandClick(item,event);
				}
				this.__objGrid.arrowClickHandler(item,!isCollapse);
			}
		}
		event.stopImmediatePropagation();
	};
	
	NSGrid.prototype.__headerClickHandler = function(event)
	{
		if(this.__onGridLine)
		{
			 return;
		}
	     var target = this.util.getTarget(event);
	     //adding the below condition so that if we add a span or a font and click on it then we should navigate till we find the header object
	     target = this.util.findParent(target,"TD");
	     var columnDetail = this.__getColumnObject(target.getAttribute("currentColumnIndex"));
	     this.__nsGridSort.handle(target,columnDetail,this.__isMultiColumnKeyPressed);
	};
	
	NSGrid.prototype.__headerMouseOverHandler = function(event)
	{
		var target = this.util.getTarget(event);
		target = this.util.findParent(target,"TD");
		this.__headerMouseMoveRef = this.__headerMouseMoveHandler.bind(this);
		this.util.addEvent(target,"mousemove",this.__headerMouseMoveRef);
	};
	
	NSGrid.prototype.__headerMouseOutHandler = function(event)
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
	
	NSGrid.prototype.__headerMouseMoveHandler = function(event)
	{
		event = this.util.getEvent(event);
		var target = this.util.getTarget(event);
		target = this.util.findParent(target,"TD");
		if(target)
		{
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
		}
	};
	
	NSGrid.prototype.__headerMouseDownHandler = function(event)
	{
		event = this.util.getEvent(event);
	    var target = this.util.getTarget(event);
	    target = this.util.findParent(target,"TD");
	    if(target)
		{
	    	var objColumn = this.__getColumnObject(target.getAttribute("currentColumnIndex"));
		    if(objColumn)
			{
		    	if(objColumn["resizable"])
		    	{
		    		//this.__nsGridColumnResize.startResize(event,target);
		    	}
		    	if(objColumn["draggable"])
		    	{
				   this.__nsGridColumnMove.handle(event,target);
		    	}
			}
		}
	};
	
	NSGrid.prototype.__headerMenuClickHandler = function(event)
	{
		 event = this.util.getEvent(event);
	     event.stopImmediatePropagation();
	};
	
	NSGrid.prototype.__bodyCellEventHandler = function(event)
	{
		event = this.util.getEvent(event);
		var target = this.util.getTarget(event);
	    target = this.util.findParent(target,"TD");
	    if(target)
	    {
	    	var index = target.cellIndex;
			switch(event.type)
			{
				case "mouseover":
					var colGroup = document.getElementById(this.getID() + "BodyColGroup" + this.__columns[index].dataField);
					this.util.addStyleClass(colGroup,"nsGridCellHover");
				break;
				case "mouseleave":
					var colGroup = document.getElementById(this.getID() + "BodyColGroup" + this.__columns[index].dataField);
					this.util.removeStyleClass(colGroup,"nsGridCellHover");
				break;
				case "click":
					/*if(this.__lastBodyCellFocus)
					{
						this.util.removeStyleClass(this.__lastBodyCellFocus,"nsCellFocus");
						if(this.__enableCellSelection)
						{
							var row = this.util.findParent(this.__lastBodyCellFocus,"TR");
							var rowIndex = this.__getIndexFromRow(this.__lastBodyCellFocus);
							var item = this.__getItemByIndex(rowIndex);
							this.__dispatchEvent(NSGrid.CELL_UNSELECTED,item,{cellIndex:this.__lastBodyCellFocus.cellIndex,rowIndex:rowIndex,item:item,cell:this.__lastBodyCellFocus,row:row});
						}
						this.__lastBodyCellFocus = null;
					}*/
					var row = this.util.findParent(target,"TR");
				    var rowIndex = this.__getIndexFromRow(row);
				    var item = this.__getItemByIndex(rowIndex);
				    this.__dispatchEvent(NSGrid.CELL_CLICKED,item,{cellIndex:index,rowIndex:rowIndex,item:item,cell:target,row:row});
				    /*if(this.__enableCellSelection)
				    {
				    	this.util.addStyleClass(target,"nsCellFocus");
						this.__dispatchEvent(NSGrid.CELL_SELECTED,item,{cellIndex:index,rowIndex:rowIndex,item:item,cell:target,row:row});
						this.__lastBodyCellFocus = target;
				    }*/
				break;
				case "dblclick":
					var row = this.util.findParent(target,"TR");
				    var rowIndex = this.__getIndexFromRow(row);
				    var item = this.__getItemByIndex(rowIndex);
				    this.__dispatchEvent(NSGrid.CELL_DOUBLE_CLICKED,item,{cellIndex:index,rowIndex:rowIndex,item:item,cell:target,row:row});
				break;
			}
	    }
	};
	
	NSGrid.prototype.__getHeaderMenuDataProvider = function(target)
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
					source.push({id:"sort",title: "Sort",children:[{id:"sortAsc",title: "Ascending"},{id:"sortDesc",title: "Descending"}]});
				}
				if(objColumn["draggable"])
				{
					source.push({id:"pin",title: "Pin",children:[{id:"pinLeft",title: "Left"},{id:"pinRight",title: "Right"},{id:"pinNo",title: "No Pin"}]});
				}
				if(objColumn["hideable"] && this.__isColumnValidForSwapOrRemove(colIndex))
				{
					source.push({id:"hideColumn",title: "Hide Column"});
				}
				if(objColumn["autoSize"])
				{
					source.push({id:"autoSize",title: "Autosize Column"});
				}
			}
		}
		return source;
	};
	
	NSGrid.prototype.__headerMenuHandler = function(target,item)
	{
		if(target && item)
		{
			target = this.util.findParent(target,"TD");
			var objColumn = this.__getColumnObject(target.getAttribute("currentColumnIndex"));
			if(objColumn)
			{
				var colIndex = objColumn[this.__fieldColIndex];
				switch(item["id"])
				{
					case "sortAsc":
						this.sortBy(colIndex,true);
					break;
					case "sortDesc":
						this.sortBy(colIndex,false);
					break;
					case "hideColumn":
						this.hideColumn(colIndex);
					break;
					case "autoSize":
						this.autoResizeColumn(colIndex);
					break;
					case "pinLeft":
						this.pinColumn(colIndex,"left");
					break;
					case "pinRight":
						this.pinColumn(colIndex,"right");
					break;
					case "pinNo":
						this.pinColumn(colIndex,"no");
					break;
				}
			}
		}
	};
	
	NSGrid.prototype.__rowMouseHover = function(event)
	{
		 event = this.util.getEvent(event);
	     var target = this.util.getTarget(event);
	     target = this.util.findParent(target,"TR");
		 var index = this.__getIndexFromRow(target);
		 if(target && index > -1 && this.__isMouseHoverAllowed(index))
	     {
			 this.util.addStyleClass(target,"nsRowHover");
			 this.__navigationIndex = index;
			 var item = this.__getItemByIndex(index);
			 this.__dispatchEvent(NSGrid.ROW_NAVIGATED,item,{rowIndex:index,item:item,row:target});
	     }
	};
	
	NSGrid.prototype.__rowMouseOut = function(event)
	{
		 var target = this.util.getTarget(event);
		 target = this.util.findParent(target,"TR");
	     if(target)
	     {
	    	 this.util.removeStyleClass(target,"nsRowHover");
	     }
	};
	
	NSGrid.prototype.__rowClickHandler= function(event)
	{
		event = this.util.getEvent(event);
	    var target = this.util.getTarget(event);
	    target = this.util.findParent(target,"TR");
	    var index = this.__getIndexFromRow(target);
	    var item = this.__getItemByIndex(index);
		this.__dispatchEvent(NSGrid.ROW_CLICKED,item,{rowIndex:index,item:item,row:target});
		if(this.__enableRowSelection)
		{
		    this.__setIndex(index,false);
		}
	    this.__lastNavigationDirection = null;
	};
	
	NSGrid.prototype.__rowDblClickHandler= function(event)
	{
		event = this.util.getEvent(event);
	    var target = this.util.getTarget(event);
	    target = this.util.findParent(target,"TR");
	    var index = this.__getIndexFromRow(target);
	    var item = this.__getItemByIndex(index);
		this.__dispatchEvent(NSGrid.ROW_DOUBLE_CLICKED,item,{rowIndex:index,item:item,row:target});
	};
	
	NSGrid.prototype.__setIndex = function(index,isMultiSelect)
	{
		if(index > -1)
		{
			isMultiSelect = Boolean.parse(isMultiSelect);
			if (this.__isShiftPressed && this.__enableMultipleSelection)
		    {
		    	this.__multiSectionHandler(index);
		    }
		    else if(isMultiSelect || (this.__isCtrlPressed && this.__enableMultipleSelection))
		    {
		    	if(this.__isRowSelected(index))
		    	{
		    		this.__markRowUnselected(index);
		    	}
		    	else
		    	{
		    		this.__markRowSelected(index);
		    	}
		    }
		    else
		    {
		    	this.__clearAllRowSelection(false);
		    	this.__markRowSelected(index);
		    } 
		}
	};
	
	NSGrid.prototype.__bodyScrollHandler = function(event)
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
						this.__paginationFetchRecordCallBack(fromRecord,toRecord,this.__pageSize);
					}
				}
		    }
		}
		this.__lastScrollPos = [target.scrollLeft,target.scrollTop];
		this.__bodyScrollPos = target.scrollTop;
	};
	
	NSGrid.prototype.__infiniteScrollEnabler = function(event)
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
	
	/******************************End of Event Listeners*************************************/
	
	/******************************************************Start of Selection Functions*************************************************************/
	NSGrid.prototype.__isMouseHoverAllowed = function(index)
	{
		/*var item = this.__getItemByIndex(index);
		if(item)
		{
			return !item[this.__fieldDisableHover];
		}*/
		return true;
	};
	
	NSGrid.prototype.__markRowSelected= function(index)
	{
		if(index > -1)
	    {
	        if(!this.__isRowSelected(index))
	        {
	        	this.__setMultiSelectedVars(index,true);
	            this.__setValuesForSelectedRow(index);
	        	if(this.__enableVirtualScroll)
	        	{
	        		this.__virtualRowSelection();
	        	}
	        	else
	        	{
	        		var row = this.__getRowByIndex(index);
	            	this.util.addStyleClass(row,this.__CLASS_SELECTED_ROW); 
	        	}
	        }
	    }
	};
	
	NSGrid.prototype.__markRowUnselected= function(index)
	{
		if(this.__isRowSelected(index) && this.__isMouseHoverAllowed(index))
	    {
	    	var isUnselected = this.__setMultiSelectedVars(index,false);
	        if(isUnselected)
	        {
	        	this.__setValuesForUnselectedRow(index);
	        }
	        if(this.__enableVirtualScroll)
	    	{
	    		this.__virtualRowSelection();
	    	}
	    	else
	    	{
	    		var row = this.__getRowByIndex(index);
	    		this.util.removeStyleClass(row,this.__CLASS_SELECTED_ROW);
	    	}
	    }
	};
	
	NSGrid.prototype.__setValuesForSelectedRow = function(index)
	{
		if(index > -1 && this.__isMouseHoverAllowed(index))
		{
			var item = this.__getItemByIndex(index);
			if(item)
			{
				item[this.__fieldSelected] = true;
			    this.__selectedIndex = index;
			    this.__navigationIndex = index;
			    this.__dispatchEvent(NSGrid.ROW_SELECTED,item,{index:index});
			}
		}
	};
	
	NSGrid.prototype.__setValuesForUnselectedRow = function(index)
	{
		if(index > -1 && this.__isMouseHoverAllowed(index))
		{
			var item = this.__getItemByIndex(index);
			if(item)
			{
				item[this.__fieldSelected] = false;
				this.__dispatchEvent(NSGrid.ROW_UNSELECTED,item,{index:index});
			}
		}
	};
	
	NSGrid.prototype.__virtualRowSelection = function()
	{
		var arrRows = this.__getAllBodyRows();
		if(arrRows && arrRows.length > 0 && this.__arrInternalSource)
		{
			var row = null;
			var index = null;
			var item = null;
			for(var count = 0; count < arrRows.length; count++) 
			{
				row = arrRows[count];
				index = this.__getIndexFromRow(row);
				item = this.__getItemByIndex(index);
				if(item && this.__isMouseHoverAllowed(index))
				{
					if(item[this.__fieldSelected])
					{
						//DONOT REPLACE WITH __markRowSelected
						this.util.addStyleClass(row,this.__CLASS_SELECTED_ROW); 
					}
					else
					{
						//DONOT REPLACE WITH __markRowUnselected
						this.util.removeStyleClass(row,this.__CLASS_SELECTED_ROW);
					}
				}
			}
		}
	};
	
	NSGrid.prototype.__clearAllRowSelection= function(setIndexVariables)
	{
		var size = this.__selectedIndexes.length;
	    for (var count = size - 1; count >= 0 ; count--)
	    {
	    	var index = this.__selectedIndexes[count];
	        this.__markRowUnselected(index);
	    }
	    this.__setMultiSelectedVars(-1,true);
	    if(setIndexVariables)
	    {
	    	this.__selectedIndex = -1;
	        this.__navigationIndex = -1;
	    }
	};
	
	NSGrid.prototype.__tableCellNavigatorEventHandler = function(event)
	{
		switch(event.type)
		{
			case NSTableCellNavigator.CELL_SELECTED:
				var cell = event.cell;
				this.util.addStyleClass(cell,"nsCellFocus");
				var row = event.row;
			    var rowIndex = this.__getIndexFromRow(row);
			    var item = this.__getItemByIndex(rowIndex);
			    this.__dispatchEvent(NSGrid.CELL_SELECTED,item,{cellIndex:event.cellIndex,rowIndex:rowIndex,item:item,cell:cell,row:row});
			break;
			case NSTableCellNavigator.CELL_UNSELECTED:
				var cell = event.cell;
				this.util.removeStyleClass(cell,"nsCellFocus");
				var row = event.row;
				var rowIndex = this.__getIndexFromRow(row);
				var item = this.__getItemByIndex(rowIndex);
				this.__dispatchEvent(NSGrid.CELL_UNSELECTED,item,{cellIndex:event.cellIndex,rowIndex:rowIndex,item:item,cell:cell,row:row});
			break;
			case NSTableCellNavigator.CELL_SELECTABLE:
				//var cell = event.cell;
				//var row = event.row;	
			break;
		}
	};
	
	NSGrid.prototype.__tableCellSelectionEventHandler = function(event)
	{
		switch(event.type)
		{
			case NSCellSelection.SELECTION_START:
				console.debug("Selection Started");
			break;
			case NSCellSelection.SELECTION_END:
				console.debug("Selection Ended with cells " + event.selectedCells);
			break;
			case NSCellSelection.SET_CELL_VALUE:
				var cellIndex = event.cellIndex;
				var cell = event.cell;
				var row = event.row;
				var dataToBeSet = event.dataToBeSet;
				var rowIndex = this.__getIndexFromRow(row);
				var item = this.__getItemByIndex(rowIndex);
				var headerBodyRow = this.__getHeaderBodyRow(this.__tblCenterHeader);
				if(headerBodyRow)
				{
					var headerCell = headerBodyRow.cells[cellIndex];
					var columnDetail = this.__getColumnObject(headerCell.getAttribute("currentColumnIndex"));
					if(item && columnDetail)
					{
						item[columnDetail["dataField"]] = dataToBeSet;
						this.updateItemInDataSource(item);
						this.__updateCellText(row,cell,item,columnDetail,rowIndex,columnDetail[self.__fieldColIndex]);
					}
				}	
			break;
		}
	};
	
	NSGrid.prototype.__resetPluggins = function()
	{
		//this.__nsGridSort.resetVariables();
		//this.__nsGridColumnMove = new NSGridColumnMove(this);
		if(this.__nsGridFilter)
		{
			this.__nsGridFilter.resetVariables();
		}
		if(this.__nsGridEditor)
		{
			this.__nsGridEditor.resetVariables();
		}
		//this.__nsToolTipInElement = new this.util.nsToolTipInElement();
	};
	
	NSGrid.prototype.__callPlugginsInitialize = function()
	{
		if(this.__nsGridEditor)
		{
			this.__nsGridEditor.initialize();
		}
	};
	
	NSGrid.prototype.__multiSectionHandler= function(lastIndex)
	{
		 if(!lastIndex)
		 {
			 return;
		 }
		 if (this.__selectedItems.length === 0)
		 {
			 this.__isRowSelected(lastIndex);
		     return;
		 }
		 var firstIndex = this.__selectedIndexes[this.__selectedIndexes.length - 1];
		 if(lastIndex === firstIndex)
		 {
			 this.__markRowUnselected(lastIndex);
			 return;
		 }
		 var isDown = lastIndex > firstIndex;
		 var isSelection = !this.__isRowSelected(lastIndex);
		 var counter = firstIndex;
		 do
		 {
			  counter = isDown ? (counter + 1) : (counter - 1);
			  if (isSelection)
			  {
				  this.__markRowSelected(counter);
			  }
			  else
			  {
				  this.__markRowUnselected(counter);
			  }
		 }
		 while(counter != lastIndex);
	};
	
	NSGrid.prototype.__setMultiSelectedVars = function(index,add)
	{
		if(index === -1)
		{
			this.__selectedItems = [];	
			this.__selectedIndexes = [];	
		}
		else if(add)
		{
			var data = this.__getItemByIndex(index);
			this.__selectedItems.push(data);
			this.__selectedIndexes.push(index);
		}
		else
		{
			var isUnselected = false;
			for (var count= 0; count < this.__selectedIndexes.length ; count++)
	        {
	            if (this.__selectedIndexes[count] === index)
	            {
	                this.__selectedItems.splice(count,1);
	                this.__selectedIndexes.splice(count,1);
	                isUnselected = true;
	                break;
	            }
	        }
			return isUnselected;
		}
		
		return true;
	};
	
	NSGrid.prototype.__isRowSelected= function(index)
	{
		if(index > -1)
	    {
	    	var item = this.__getItemByIndex(index);
	    	if(item)
	    	{
	    		return item[this.__fieldSelected];
	    	}
	    }   
	    return false;
	};
	
	NSGrid.prototype.__setVisibilityOfColumn = function(index,isVisible)
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
	
	NSGrid.prototype.__keyDownHandler = function(event)
	{
		if(this.hasFocus())
		{
			event = this.util.getEvent(event);
			if(this.__enableMultiSort)
			{
				this.__isMultiColumnKeyPressed = event[this.__multiColumnKey + "Key"];
			}
			this.__isShiftPressed = event.shiftKey;
			this.__isCtrlPressed = event.ctrlKey;
			var isShiftCtrlPressed = this.__isShiftPressed || this.__isCtrlPressed;
			var keyCode = this.util.getKeyUnicode(event);
			if(this.__enableKeyboardNavigation)
			{
				this.__nsGridKeyboard.keyDownHandler(event,keyCode);
			}
			if(keyCode === this.util.KEYCODE.SHIFT)
			{
				this.util.makeBodyUnselectable();
			}
		}
	};
	
	NSGrid.prototype.__keyUpHandler = function(event)
	{
		if(this.util.getKeyUnicode(event) === this.util.KEYCODE.CTRL)
		{
			this.__isCtrlPressed = false;
		}
		if(this.util.getKeyUnicode(event) === this.util.KEYCODE.SHIFT)
		{
			this.__isShiftPressed = false;
			this.util.makeBodySelectable();
		}
		if(this.util.getKeyUnicode(event) === this.util.KEYCODE[this.__multiColumnKey.toUpperCase()] && this.__enableMultiSort)
		{
			this.__isMultiColumnKeyPressed = false;
		}
	};
	
	/******************************************************End of Selection Functions*************************************************************/
	/******************************************************Start of Filter Logic*************************************************************/
	NSGrid.prototype.__highlightDiv = function(divText,colIndex)
	{
		this.__nsGridFilter.__highlightDiv(divText,colIndex);
	};
	/******************************************************End of Filter Logic*************************************************************/
	/******************************************************Start of Context Menu*************************************************************/
	
	NSGrid.prototype.__initializeContextMenu = function()
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
	
	NSGrid.prototype.__getContextMenuDataProvider = function(cell)
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
	
	NSGrid.prototype.__createTableAndParent = function(containerID,containerStyle,tableID)
	{
		var divTableContainer = this.util.createDiv(containerID,containerStyle); 
		var table = document.createElement("TABLE");
		table.setAttribute("id",tableID);
		this.util.addStyleClass(table , this.__CLASS_TABLE);
		this.util.addStyleClass(table , "nsDataGridTableTheme");
		divTableContainer.appendChild(table);
		return divTableContainer;
	};
	
	NSGrid.prototype.__setMeasurement = function()
	{
		this.__bodyScrollPos = 0;
	};
	
	NSGrid.prototype.__addListenerForBody = function()
	{
		if(!this.__keyDownRef)
		{
			this.__keyDownRef = this.__keyDownHandler.bind(this);
			this.util.addEvent(document,"keydown",this.__keyDownRef);
		}
		if(!this.__keyUpRef)
		{
			this.__keyUpRef = this.__keyUpHandler.bind(this);
			this.util.addEvent(document,"keyup",this.__keyUpRef);
		}
	};
	
	NSGrid.prototype.__setBodyMeasurement = function()
	{
		var divTitleBar = this.util.getElement(this.getID() + this.__TITLE_CONTAINER_ID);
		var divPagination = this.util.getElement(this.getID() + this.__PAGINATION_CONTROL_ID);
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
		var scrollBarWidth = this.util.getScrollBarWidth(this.__divCenterTableBodyContainer);
		this.__divCenterTableHeaderContainer.style.width = (this.__divCenterTableBodyContainer.offsetWidth - scrollBarWidth) + "px";
		this.__initialTableWidth = containerWidth - scrollBarWidth;
		if(!this.__synchronizeTablesRef)
		{
			this.__synchronizeTablesRef = this.__synchronizeTables.bind(this);
			this.util.addEvent(this.__getHorizontalScrollableContainer(),"scroll",this.__synchronizeTablesRef);
		}
	};
	
	NSGrid.prototype.__alignTables = function(fromSort)
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
		var footerCells = getCells(this.__tblCenterFooter);
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
				(footerCells && footerCells.length > 0) ? setCellWidth(footerCells,count,widthToBeSet) : null;
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
			if(this.__fillParentWidth && this.__initialTableWidth > totalWidth)
			{
				totalWidth = this.__initialTableWidth;
			}
			this.__setTableWidth(totalWidth); 
		}
	};
	
	NSGrid.prototype.__synchronizeTables = function(event) 
	{
		var target = this.util.getTarget(event);
		//if(this.__scroller)
		//{
		//	this.__divCenterTableHeaderContainer.scrollLeft = event.scrollLeft;
		//}
		//else
		//{
			
			this.__divCenterTableHeaderContainer.scrollLeft = target.scrollLeft;
			(target != this.__divCenterTableBodyContainer) ? this.__divCenterTableBodyContainer.scrollLeft = target.scrollLeft : null;
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
				//self.__setFixedCellsPosition.bind(self)();
			},250);
		}
		else
		{
			//this.__setFixedCellsPosition();
		}
	};
	
	NSGrid.prototype.__setTableWidth = function(totalWidth) 
	{
		var setWidth = function(tbl)
		{
			tbl ? tbl.style.width = totalWidth : null;
		};
		if(this.util.isUndefinedOrNull(totalWidth))
		{
			totalWidth = null;
		}
		else
		{
			totalWidth = totalWidth + "px";
		}
		setWidth(this.__tblCenterHeader);
		setWidth(this.__tblCenterBody);
		setWidth(this.__tblCenterFooter);
	};
	
	NSGrid.prototype.__expandCollapseAll = function(isCollapse)
	{
		if(!this.__enableVirtualScroll && this.__getTotalRows() < this.__totalRecords)
		{
			this.util.warning("NSGrid","Please let all the rows to render.");
			return;
		}
		var dataSource = this.__arrInternalSource;
		if(dataSource && dataSource.length > 0)
		{
			if(this.__enableVirtualScroll)
			{
				this.__setCustomScrollBarScrollTop(0);
			}
			if(this.__getVerticalScrollableContainer())
			{
				this.__getVerticalScrollableContainer().scrollTop = 0;
			}
		    this.__lastScrollPos = [0,0];
		    this.__lastScrollPosition = 0;
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
	
	NSGrid.prototype.__expandCollapseAllNormal = function(dataSource,isCollapse)
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
			this.__objGrid.expandCollapseHandler(item,isCollapse);
		}
		this.__showHideAllArrows(isCollapse);
	};
	
	NSGrid.prototype.__expandCollapseAllVirtual = function(dataSource,isCollapse)
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
			//this.__objGrid.expandCollapseHandler(item,isCollapse);
		}
		this.__showHideAllArrows(isCollapse);
		this.__updateVisibleIndex(null,0);
		this.__setNSVirtualScroll(this.__arrInternalSource);
		for(var count = 0;count < dataSource.length;count++)
		{
			var item = dataSource[count];
			this.__objGrid.expandCollapseHandler(item,isCollapse);
		}
	};
	
	NSGrid.prototype.__showHideRow = function(rowIndex,compArrow,isCollapse)
	{
		if(rowIndex > 0)
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
					item[this.__fieldIsCollapsed] = isCollapse;
					//this.__updateItemInSource(item);
					this.__setNSVirtualScroll(this.__arrInternalSource);
				}
				else
				{
					this.__showHideRowNormal(item,arrChildItems,startIndex,rowLevel,isCollapse);
					this.__setArrowDirection(compArrow,isCollapse);
					item[this.__fieldIsCollapsed] = isCollapse;
				}
			}
		}
	};
	
	NSGrid.prototype.__showHideRowNormal = function(item,arrChildItems,startIndex,rowLevel,isCollapse)
	{
		if(arrChildItems && arrChildItems.length > 0)
		{
			if(isCollapse)
			{
				var retIndex = this.__getActualIndex(arrChildItems,startIndex);
				if(retIndex !== startIndex)
				{
					startIndex = (retIndex + 1);
				}
			}
			var rowItem = null;
			for(var count = startIndex;count < arrChildItems.length;count++)
			{
				rowItem = arrChildItems[count];
				var row = rowItem[this.__fieldRowHtml];
				if(!row)
				{
					this.__createBodyRowAt(rowItem,rowItem[this.__fieldIndex]);
					row = rowItem[this.__fieldRowHtml];
					this.__updateSourceIndex();
				}
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
	
	NSGrid.prototype.__showHideRowVirtual = function(item,arrChildItems,startIndex,rowLevel,isCollapse)
	{
		if(arrChildItems && arrChildItems.length > 0)
		{
			if(isCollapse)
			{
				var retIndex = this.__getActualIndex(arrChildItems,startIndex);
				if(retIndex !== startIndex)
				{
					startIndex = (retIndex + 1);
				}
			}
			var rowItem = null;
			for(var count = startIndex;count < arrChildItems.length;count++)
			{
				rowItem = arrChildItems[count];
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
			var index = item[this.__fieldIndex];
			//this.__updateVisibleIndex(null,index - 1);
			//done the below for MasterDetail Grid .. if there is an issue in Hierarchical or Grouping Grid while filtering then use a callback to get the index like afterFilter which we will override only for MasterDetailGrid with the below condition
			//var sendIndex = (index % 2) == 0 ? index : index - 1;
			//this.__updateVisibleIndex(null,sendIndex);
			this.__updateVisibleIndex(null,index);
		}
	};
	
	NSGrid.prototype.__showHideAllArrows = function(isCollapse)
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
	
	NSGrid.prototype.__isNodeLastParent = function(item)
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
	
	NSGrid.prototype.__updateSourceIndex = function(source)
	{
		if(!source)
		{
			source = this.__getAllItems();
		}
		var item = null;
		var row = null;
		var length = source.length;
		for(var count = 0;count < length;count++)
		{
			item = source[count];
			var index = (this.__enableHierarchical || this.__enableGrouping || this.__enableMasterDetail) ? (count + 1) : count;
			item[this.__fieldIndex] = index;
			row = item[this.__fieldRowHtml];
			if(row && this.util.isElementOfType(row,"tr"))
			{
				row.setAttribute("ns-index",index);
				var compArrow = row.querySelector(".nsArrow");
				if(compArrow)
				{
					compArrow.setAttribute("ns-parent-row-count",index);
					var arrowID = this.getID() + "compArrow" + index;
					compArrow.setAttribute("id",arrowID);
					var compSvg = compArrow.querySelector("svg");
					if(compSvg)
					{
						var svgID = arrowID + "svg";
						compSvg.setAttribute("id",svgID);
					}
					var compUse = compArrow.querySelector("use");
					if(compUse)
					{
						var useID = arrowID + "use";
						compUse.setAttribute("id",useID);
					}
				}
			}
		}
	};
	
	NSGrid.prototype.__applyCustomClass = function(element,type)
	{
		if(this.__customClass && element && type)
		{
			var itemProperty = {"outerContainer":{property:"outerContainer",defaultValue:null},
							    "titleBar":{property:"titleBar",defaultValue:null},
							    "headerRow":{property:"headerRow",defaultValue:null},
							    "headerCell":{property:"headerCell",defaultValue:null},
							    "filterRow":{property:"filterRow",defaultValue:null},
							    "filterCell":{property:"filterCell",defaultValue:null},
							    "bodyRow":{property:"bodyRow",defaultValue:null},
							    //for Hierarchies and Grouping grid
							    "firstBodyColumn":{property:"firstBodyColumn",defaultValue:null},
							    "nonFirstBodyColumn":{property:"nonFirstBodyColumn",defaultValue:null}
							   };
			if(itemProperty[type])
			{
				if(this.__customClass[itemProperty[type]["property"]])
				{
					this.util.addStyleClass(element,this.__customClass[itemProperty[type]["property"]]);
				}
				else if(itemProperty[type]["defaultValue"])
				{
					this.util.addStyleClass(element,itemProperty[type]["defaultValue"]);
				}
			}
		}
	};
	
	NSGrid.prototype.__addCellText = function(row,item,div,colItem,colIndex)
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
				var arrAllChildItems = this.__getAllChildItemsForGroup(null,item);
				var objRenderer = groupRenderer(item,dataField,item[this.__fieldIndex],colIndex,row,item[this.__childField],item[this.__objGrid.__childrenCountField],arrAllChildItems,parseInt(item[this.__fieldRowLevel]) + 1);
				var callback = function(objRenderer)
				{
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
				};
				this.util.resolveFunctionOrPromise(objRenderer,callback.bind(this));
			}
			else if(!isGroupedParent && itemRenderer)
			{
				var objRenderer = itemRenderer(item,dataField,item[this.__fieldIndex],colIndex,row);
				var callback = function(objRenderer)
				{
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
				};
				this.util.resolveFunctionOrPromise(objRenderer,callback.bind(this));
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
			else if(dataField)
		    {
				var text = null;
				if(dataField.includes(".")) 
				{
					text = this.util.getValueByKeys(item,dataField);
				}
				else if(item.hasOwnProperty(dataField)) 
				{
					text = item[dataField];
				}
				if(text)
				{
					div.appendChild(document.createTextNode(text));
				}
		    }
			this.__highlightDiv(div,colIndex);
			if(toolTipField)
			{
				toolTipText = item[toolTipField];
			}
			else if(toolTipRenderer)
			{
				toolTipText = toolTipRenderer(item,dataField,item[this.__fieldIndex],colIndex,row);
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
			var callback = function(toolTipText)
			{
				if(toolTipText && toolTipText !== "")
				{
					this.__nsToolTipInElement.addToolTip(div,toolTipText);
				}
			};
			this.util.resolveFunctionOrPromise(toolTipText,callback.bind(this));
		}
	};
	
	NSGrid.prototype.__updateCellText = function(row,cell,item,colItem,rowIndex,colIndex)
	{
		this.__objGrid.__updateCellText(row,cell,item,colItem,rowIndex,colIndex);
	};
	
	NSGrid.prototype.__setDataInTemplateRenderer = function(cellItem,data,dataField,setData,colItem,row)
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
	
	NSGrid.prototype.__setRendererInData = function(cellItem,data,row)
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
	
	NSGrid.prototype.__setRendererProperties = function(cellItem)
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
	
	NSGrid.prototype.__calculateCellExpectedHeight = function(templateRenderer)
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
	
	NSGrid.prototype.__setRowHover = function(indexToSet)
	{
		if(this.__nsGridKeyboard)
		{
			this.__nsGridKeyboard.__setRowHover(indexToSet);
		}
	};
	
	NSGrid.prototype.__getAllItems = function()
	{
		return this.__objGrid.__getFlatSource();
	};
	
	NSGrid.prototype.__isCellEditable = function(objColumn,item,cell,cellIndex,row,rowIndex)
	{
		return this.__objGrid.__isCellEditable(objColumn,item,cell,cellIndex,row,rowIndex);
	};
	
	NSGrid.prototype.__getImmediateChildItems = function(arrItems,item)
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
			var retIndex = this.__getActualIndex(arrChild,startIndex);
			if(retIndex !== startIndex)
			{
				startIndex = (retIndex + 1);
			}
			/*//for Filter condition
			//(startIndex + 1) as __fieldIndex starts from 1
			if(arrChild.length < startIndex || arrChild[startIndex][this.__fieldIndex] !== (startIndex + 1))
			{
				var rowItem = null;
				for(var count = 0;count < arrChild.length;count++)
				{
					rowItem = arrChild[count];
					if(rowItem[this.__fieldIndex] === startIndex)
					{
						startIndex = (count + 1);
						break;
					}
				}
			}*/
			//end of Filter condition
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
	
	//generally used for Filter condition
	NSGrid.prototype.__getActualIndex = function(arrChild,startIndex,addCompareOne)
	{
		//(startIndex + 1) as __fieldIndex starts from 1
		//if(arrChild && arrChild.length < startIndex || arrChild[startIndex][this.__fieldIndex] !== (startIndex + 1))
		//if(arrChild && arrChild.length > startIndex && arrChild[startIndex][this.__fieldIndex] !== (startIndex + 1))
		if(arrChild && (arrChild.length <= startIndex || arrChild[startIndex][this.__fieldIndex] !== (startIndex + 1)))
		{
			var compareIndex = startIndex;
			if(addCompareOne)
			{
				compareIndex += 1;
			}
			var rowItem = null;
			for(var count = 0;count < arrChild.length;count++)
			{
				rowItem = arrChild[count];
				if(rowItem[this.__fieldIndex] === compareIndex)
				{
					return count;
				}
			}
		}
		return startIndex;
	};
	
	NSGrid.prototype.__getAllChildItems = function(arrItems,item)
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
	
	NSGrid.prototype.__getAllChildItemsForGroup = function(arrItems,item)
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
				var hasChild = itemChild[this.__fieldHasChild];
				if(rowLevel >= parseInt(itemChild[this.__fieldRowLevel]))
				{
					break;
				}
				//in group collection we are giving values for rows which are not generated by grid
				if(!hasChild)
				{
					arrItems.push(itemChild);
				}
			}
		}
		return arrItems;
	};
	
	NSGrid.prototype.__getAllVisibleItems = function()
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
	
	NSGrid.prototype.__getFirstVisibleItemBeforeIndex = function(itemIndex)
	{
		var arrItems = this.__getAllItems();
		if(arrItems && arrItems.length > 0)
		{
			var retIndex = this.__getActualIndex(arrItems,itemIndex);
			if(retIndex !== itemIndex)
			{
				itemIndex = (retIndex + 1);
			}
			/*if(arrItems.length < itemIndex || arrItems[itemIndex][this.__fieldIndex] !== (itemIndex + 1))
			{
				var rowItem = null;
				for(var count = 0;count < arrItems.length;count++)
				{
					rowItem = arrItems[count];
					if(rowItem[this.__fieldIndex] === itemIndex)
					{
						itemIndex = (count + 1);
						break;
					}
				}
			}*/
			for(var count = itemIndex;count >= 0;count--)
			{
				var item = arrItems[count];
				if(item && item[this.__fieldRowVisible] && item[this.__fieldVisibleIndex] > -1)
				{
					return item;
				}
			}
		}
		return null;
	};
	
	NSGrid.prototype.__getVisibleItemByIndex = function(source,index)
	{
		var arrItems = source;
		if(!arrItems)
		{
			arrItems = this.__getAllItems();
		}
		if(arrItems && arrItems.length > 0)
		{
			var self = this; 
			var findItem = function(itemCompare)
			{
				 return (itemCompare[self.__fieldVisibleIndex] === (index + 1));
			};
			return arrItems.find(findItem);
		}
		return null;
	};
	
	NSGrid.prototype.__updateVisibleIndex = function(source,fromIndex)
	{
		var arrItems = source;
		if(!arrItems)
		{
			arrItems = this.__getAllItems();
		}
		if(this.util.isUndefinedOrNull(fromIndex))
		{
			fromIndex = 0;
		}
		if(arrItems && arrItems.length > 0)
		{
			var visibleRowIndex = 1;
			if(fromIndex > 0)
			{
				var visibleItem = this.__getFirstVisibleItemBeforeIndex(fromIndex);
				if(visibleItem)
				{
					visibleRowIndex = visibleItem[this.__fieldVisibleIndex];
					fromIndex = visibleItem[this.__fieldIndex] - 1;
					var retIndex = this.__getActualIndex(arrItems,fromIndex,true);
					if(retIndex !== fromIndex)
					{
						fromIndex = retIndex;
					}
					/*//for Filter condition
					//(startIndex + 1) as __fieldIndex starts from 1
					if(arrItems.length < fromIndex || arrItems[fromIndex][this.__fieldIndex] !== (fromIndex + 1))
					{
						var rowItem = null;
						for(var count = 0;count < arrItems.length;count++)
						{
							rowItem = arrItems[count];
							if(rowItem[this.__fieldIndex] === (fromIndex + 1))
							{
								fromIndex = count;
								break;
							}
						}
					}
					//end of Filter condition*/
				}
			}
			var length = arrItems.length;
			var item = null;
			for(var count = fromIndex; count < length; count++)
			{
				item = arrItems[count];
				if(item)
				{
					if(item[this.__fieldRowVisible])
					{
						item[this.__fieldVisibleIndex] = visibleRowIndex;
						visibleRowIndex++;
					}
					else
					{
						item[this.__fieldVisibleIndex] = -1;
					}
				}
			}
		}
	};
	
	NSGrid.prototype.__updateVisibleIndexByRow = function(source,arrAllItems)
	{
		if(source)
		{
			var arrItems = arrAllItems;
			if(!arrItems)
			{
				arrItems = this.__getAllItems();
			}
			var length = source.length;
			var item = null;
			var objVisibleIndex = {};
			for(var count = 0; count < length; count++)
			{
				item = source[count];
				if(item)
				{
					var index = item[this.__fieldIndex];
					objVisibleIndex[index] = item;
				}
			}
			if(arrItems && arrItems.length > 0)
			{
				length = arrItems.length;
				item = null;
				var visibleRowIndex = 1;
				for(var count = 0; count < length; count++)
				{
					item = arrItems[count];
					var index = item[this.__fieldIndex];
					if(this.util.isUndefinedOrNull(objVisibleIndex[index]))
					{
						item[this.__fieldVisibleIndex] = -1;
						item[this.__fieldRowVisible] = false;
					}
					else
					{
						item[this.__fieldVisibleIndex] = visibleRowIndex;
						item[this.__fieldRowVisible] = true;
						objVisibleIndex[index][this.__fieldVisibleIndex] = visibleRowIndex;
						objVisibleIndex[index][this.__fieldRowVisible] = true;
						visibleRowIndex++;
					}
				}
			}
			
		}
	};
	
	NSGrid.prototype.__getArrow = function(rowCount)
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
	
	NSGrid.prototype.__getAllArrows = function(divParent)
	{
		if(!divParent)
		{
			divParent = this.__tblCenterBody;
		}
		return divParent.querySelectorAll(".nsArrow");
	};
	
	NSGrid.prototype.__getAllBodyRows = function()
	{
		if(this.__tblCenterBodyBody && this.__tblCenterBodyBody.rows)
		{
			return this.__tblCenterBodyBody.rows;
		}
		return null;
	};
	
	NSGrid.prototype.__getTotalRows = function()
	{
		if(this.__tblCenterBodyBody && this.__tblCenterBodyBody.rows)
		{
			return this.__tblCenterBodyBody.rows.length;
		}
		return 0;
	};
	
	NSGrid.prototype.__getIndexFromRow = function(row)
	{
		if(row)
		{
			return parseInt(row.getAttribute("ns-index"));
		}
		return -1;
	};
	
	NSGrid.prototype.__getRowFromItem = function(item)
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
	
	NSGrid.prototype.__getRowByIndex = function(index)
	{
		var row = null;
		if(index > -1)
		{
			var item = this.__getItemByIndex(index);
			row = this.__getRowFromItem(item);
		}
		return row;
	};
	
	NSGrid.prototype.__getRowFromContainer = function(index)
	{
		var arrRows = this.__getBodyBodyRow(this.__tblCenterBody);
		if(this.__hasBodyRows() && arrRows.length > index)
		{
			return arrRows[index];
		}
		return null;
	};
	
	NSGrid.prototype.__hasBodyRows = function()
	{
		var arrRows = this.__getBodyBodyRow(this.__tblCenterBody);
		if(arrRows && arrRows.length > 0)
		{
			return true;
		}
		return false;
	};
	
	NSGrid.prototype.__getItemByIndex = function(indexToFind,source)
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
	
	NSGrid.prototype.__getItemBykeyField = function(keyFieldValue,source)
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
	
	NSGrid.prototype.__getIndexByItem = function(itemToFind,source)
	{
		if(!source)
		{
			source = this.__getAllItems();
		}
		if(itemToFind && source && source.length > 0)
		{
			for(var count = 0;count < source.length;count++)
			{
				var item = source[count];
				if(item && item[this.__fieldIndex] === itemToFind[this.__fieldIndex])
				{
					return item[this.__fieldIndex];
				}
			}
		}
		return -1;
	};
	
	NSGrid.prototype.__getColumnObject = function(index,arrColumn)
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
	
	NSGrid.prototype.__getColumnIndexByObject = function(objColumn,arrColumn)
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
	
	NSGrid.prototype.__getColumnObjectByDataField = function(dataField,arrColumn)
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
	
	NSGrid.prototype.__getColumnIndexForSwapOrRemove = function(column,arrColumn)
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
			this.util.warning("NSGrid","Please pass valid column information.");
		}
		return index;
	};
	
	NSGrid.prototype.__isColumnValidForSwapOrRemove = function(columnIndex,operation)
	{
		if(this.__isColumnIndexValid(columnIndex))
		{
			if((this.__enableHierarchical && columnIndex === 0) || (this.__enableGrouping && (columnIndex === 0 || this.__columns[columnIndex]["dataField"] === this.__groupByField)) 
					|| (this.__enableMasterDetail && columnIndex === 0))
			{
				if(operation)
				{
					this.util.warning("NSGrid","This column cannot be " + operation + ".");
				}
				return false;
			}
			return true;
		}
		return false;
		
	};
	
	NSGrid.prototype.__swapCell = function(sourceCell,destinationCell)
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
	
	NSGrid.prototype.__moveCell = function(fromCell,toIndex)
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
	
	NSGrid.prototype.__createColumnProvider = function(arrColumns)
	{
		if(arrColumns && arrColumns.length > 0)
		{
			var hasColumnProviderChanged = this.__hasColumnProviderChanged(arrColumns);
			var self = this;
			var getOrignalColumnInfo = function(dataField)
			{
				for (var count = 0;count < self.__orignalColumns.length;count++)
				{
					var colOrigItem = self.__orignalColumns[count];
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
	
	NSGrid.prototype.__hasColumnProviderChanged = function(arrColumns)
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
	
	NSGrid.prototype.__processDefaultSort = function()
	{
		for(var count = 0; count < this.__columns.length;count++)
		{
			var objColumn = this.__columns[count];
			if(objColumn.hasOwnProperty(this.__fieldColSortedAsc) && objColumn[this.__fieldColSortedAsc] != null)
			{
				var headerBodyRow = this.__getHeaderBodyRow(this.__tblCenterHeader);
				var arrHeaderCells = headerBodyRow.cells;
				var cell = arrHeaderCells[count];
				this.__nsGridSort.handle(cell,objColumn,false,objColumn[this.__fieldColSortedAsc]);
				return true;
			}
		}
		return false;
	};
	
	NSGrid.prototype.__editColumnArray = function(mode,item)
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
	
	NSGrid.prototype.__isColumnIndexValid = function(columnIndex)
	{
		if(columnIndex > -1 && columnIndex < this.__columns.length)
		{
			return true;
		}
		return false;
		
	};
	
	NSGrid.prototype.__isMouseOnElement = function(element, currentX, currentY)
	{
		var offset = this.util.getCumulativeOffset(element);
		return (currentY >= offset.y &&
				currentY <  offset.y + element.offsetHeight &&
	            currentX >= offset.x + element.offsetWidth - 5 &&
	            currentX <  offset.x + element.offsetWidth);
	};
	
	NSGrid.prototype.__updateTotalRecords = function(totalCount)
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
	
	NSGrid.prototype.__addPriorityClassInCell = function(cell,colItem)
	{
		if(this.__isResponsiveModeColumnToggle && cell && colItem)
		{
			this.util.addStyleClass(cell,"column-priority-" + colItem["priority"]);
		}
	};
	
	NSGrid.prototype.__setGridType = function()
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
		else if(this.__type === this.GRID_TYPE_MASTER_DETAIL)
		{
			this.__enableMasterDetail = true;
			this.__objGrid = new NSMasterDetailGrid(this,this.util);
		}
		else
		{
			this.__objGrid = new NSFlatGrid(this,this.util);
		}
	};
	
	NSGrid.prototype.__callFunctionInsideGridType = function(functionName,...args)
	{
		this.util.callFunctionOfObject(this.__objGrid,functionName,...args);
	};
	
	NSGrid.prototype.__setPaginationType = function()
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
	
	NSGrid.prototype.__setPaginationMode = function()
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
	
	NSGrid.prototype.__setResponsiveMode = function()
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
	
	NSGrid.prototype.__checkForVirtualMode = function()
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
	
	NSGrid.prototype.__setCustomScrollBarScrollTop = function(scrollTop)
	{
		if(this.__enableCustomScrollBar)
		{
			if(this.__scroller)
			{
				this.__scroller.setScrollTop(scrollTop);
			}
		}
	};
	
	NSGrid.prototype.__getHorizontalScrollableContainer = function() 
	{
		var container = this.__enableFooter ? this.__divCenterTableFooterContainer : this.__divCenterTableBodyContainer;
		return container;
	};
	
	NSGrid.prototype.__getVerticalScrollableContainer = function() 
	{
		var container = this.__divCenterTableBodyContainer;
		return container;
	};
	
	NSGrid.prototype.__addSVGInPage = function()
	{
		if(typeof NSSvg != 'undefined')
		{
			var objSVG = new NSSvg();
			var svgShapes = new NSSvgShapes();
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
				svgShapes.addExportInPage();
			}
			if(this.__enableColumnSetting)
			{
				svgShapes.addColumnSettingIcon();
			}
			if(this.__enableFilter)
			{
				svgShapes.addFilterIcon();
				svgShapes.addSearchIcon();
			}
			this.__objGrid.__addSVGInPage(objSVG);
			svgShapes.addMoveIcon();
			svgShapes.addLeftIcon();
			svgShapes.addRightIcon();
		}
		else
		{
			this.util.warning("NSGrid","NSSvg has not been included so the icons might not appear");
		}
		this.__imgUtil = new this.util.image();
	};
	
	NSGrid.prototype.__addStyleInDOM = function()
	{
		if(this.__enableMouseHover)
	    {
			//this.util.addCSSClassInDOM(["#" + this.getID() + " .nsGridRow:hover > td"],["background-color: " + this.__mouseHoverColor + "!important;"]);
	    }
	};
	
	NSGrid.prototype.__addRowHeightInDOM = function()
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
	
	NSGrid.prototype.__initializePluggins = function()
	{
		if(!this.__nsGridSort)
		{
			this.__nsGridSort = new NSGridSort(this);
			this.__nsGridColumnMove = new NSGridColumnMove(this);
			this.__nsGridFilter = new NSGridFilter(this);
			this.__nsGridColumnResize = new NSGridColumnResize(this);
			this.__nsGridEditor = new NSGridEditor(this);
			this.__nsToolTipInElement = new this.util.nsToolTipInElement();
			if(this.__enableKeyboardNavigation)
			{
				this.__nsGridKeyboard = new NSGridKeyboard(this);
			}
		}
	};
	
	NSGrid.prototype.__getCellDetailsForEditing = function(item,dataField)
	{
		if(this.__nsGridEditor)
		{
			if(item)
			{
				var colItem = this.__getColumnObjectByDataField(dataField);
				if(colItem)
				{
					var colIndex = colItem[this.__fieldColIndex];
					var row = this.__getRowFromItem(item);
					if(row)
					{
						var cells = row.cells;
						var cell = cells[colIndex];
						return {cell: cell,item: item};
					}
				}
			}
		}
		return null;
	};
	
	NSGrid.prototype.__handleHiddenColumn = function()
	{
		var length = this.__columns.length;
		for(var count = 0;count < length;count++)
		{
			var objColumn = this.__columns[count];
			if(objColumn[this.__fieldColVisible] === false)
			{
				this.__setColumnVisibility(count,false,objColumn);
			}
		}
	};
	
	NSGrid.prototype.__setColumnVisibility = function(index,isVisible,item)
	{
		var headerColGroupID = null;
		var bodyColGroupID = null;
		var objColumn = null;
		if(item)
		{
			if(this.util.isString(item))
			{
				objColumn = this.__getColumnObjectByDataField(item);
			}
			else if(this.util.isNumber(item))
			{
				objColumn = this.__getColumnObject(item);
			}
			else
			{
				objColumn = item;
			}
			if(objColumn)
			{
				headerColGroupID = this.getID() + "HeaderColGroup" + objColumn.dataField;
				bodyColGroupID = this.getID() + "BodyColGroup" + objColumn.dataField;
			}
		}
		if(isVisible)
		{
			this.util.removeCSSClassInDOM(["#" + this.getID() + " :nth-child(" + (index + 1) +").nsGridCell"]);
			if(objColumn)
			{
				this.util.removeCSSClassInDOM(["#" + headerColGroupID + ", #" + bodyColGroupID]);
			}
			
		}
		else
		{
			this.util.addCSSClassInDOM(["#" + this.getID() + " :nth-child(" + (index + 1) +").nsGridCell"],["display:none;"]);
			if(objColumn)
			{
				this.util.addCSSClassInDOM(["#" + headerColGroupID + ", #" + bodyColGroupID],["display:none;"]);
			}
		}
	};
	
	NSGrid.prototype.__addColumnPseudoStyle = function()
	{
		var arrClass = [];
		var arrCSSText = [];
		var headerBodyRow = this.__getHeaderBodyRow(this.__tblCenterHeader);
		if(headerBodyRow)
		{
			var headerCells = headerBodyRow.cells;
			var colIndex = 0;
			var cell = null;
	        for(colIndex = 0; colIndex < headerCells.length; colIndex++)
	        {
	        	cell = headerCells[colIndex];
	        	arrClass.push("#" + this.getID() + ".nsMobileStackGrid td:nth-of-type(" + (colIndex + 1) + "):before");
	        	var text = cell.textContent.trim();
	        	if(text && text.length > 0)
	        	{
	        		text = text + ": ";
	        	}
	        	arrCSSText.push("content: '" + text + "';");
	        }
		}
		this.util.addCSSClassInDOM(arrClass,arrCSSText,false);
	};
	
	NSGrid.prototype.__updateItemInSource = function(item)
	{
		if(item)
		{
			this.__updateItemInArray(this.__dataSource,item);
			this.__updateItemInArray(this.__arrWrapper,item);
			this.__updateItemInArray(this.__arrInternalSource,item);
			this.__updateItemInArray(this.__arrFlatHierarchicalSource,item,true);
			this.__updateItemInArray(this.__arrFilteredGroupedSource,item);
		}
	};
	
	NSGrid.prototype.__updateItemInArray = function(source,item,excludeChildren)
	{
		var isFound = false;
		if(source && source.length > 0 && item)
		{
			excludeChildren = Boolean.parse(excludeChildren);
			var length = source.length;
			var tempItem = {};
			var arrChildItems = [];
			for(var count = 0;count < length;count++)
			{
				tempItem = source[count];
				if(tempItem[this.__fieldIndex] === item[this.__fieldIndex])
				{
					source[count] = item;
					isFound = true;
					break;
				}
				if((this.__enableHierarchical || this.__enableGrouping || this.__enableMasterDetail) && !excludeChildren)
				{
					arrChildItems = tempItem[this.__childField];
					if(arrChildItems && arrChildItems.length > 0)
					{
						isFound = this.__updateItemInArray(arrChildItems,item,excludeChildren);
						if(isFound)
						{
							break;
						}
					}
				}
			}
		}
		return isFound;
	};
	
	NSGrid.prototype.__setComponentHeight = function()
	{
		var offset = this.util.getNumber(this.__heightOffset);
		if(offset > 0)
		{
			var compHeight = this.util.getBodyDimension().height;
			this.__baseComponent.style.height = (compHeight - offset) + "px";
		}
	};
	
	//to get header row which has column width
	NSGrid.prototype.__getHeaderHeaderRow = function(table)
	{
		var headerRow = null;
		if(table && table.tHead && table.tHead.rows && table.tHead.rows.length > 0)
		{
			headerRow = table.tHead.rows[0];
		}
		return headerRow;
	};
	
	//to get header row which has column header Name
	NSGrid.prototype.__getHeaderBodyRow = function(table)
	{
		var headerBodyRow = null;
		if(table)
		{
			headerBodyRow = table.querySelector(".nsGridHeaderRow");
		}
		return headerBodyRow;
	};
	
	NSGrid.prototype.__getHeaderFilterRow = function(table)
	{
		var headerFilterRow = null;
		if(table)
		{
			headerFilterRow = table.querySelector(".nsGridFilterRow");
		}
		return headerFilterRow;
	};
	
	NSGrid.prototype.__getHeaderExtraRow = function(table)
	{
		var arrExtraRows = null;
		if(table)
		{
			arrExtraRows = table.querySelectorAll(".nsHeaderExtraRow");
		}
		return arrExtraRows;
	};
	
	//to get body row which has column width
	NSGrid.prototype.__getBodyHeaderRow = function(table)
	{
		var bodyRow = null;
		if(table && table.tHead && table.tHead.rows && table.tHead.rows.length > 0)
	    {
			bodyRow = table.tHead.rows[0];
		}
		return bodyRow;
	};
	
	NSGrid.prototype.__getBodyBodyRow = function(table)
	{
		var arrRows = null;
		if(table && table.tBodies && table.tBodies.length > 0 && table.tBodies[0].rows && table.tBodies[0].rows.length > 0)
		{
    		arrRows = table.tBodies[0].rows;
		}
		return arrRows;
	};
	
	NSGrid.prototype.__getCustomIcon = function(iconField)
	{
		if(this.__icons && this.__icons[iconField])
		{
			return this.__icons[iconField];
		}
		return null;
	};
	
	NSGrid.prototype.__getColumnCustomIcon = function(colItem,iconField)
	{
		if(colItem && colItem.icons && colItem.icons[iconField])
		{
			return colItem.icons[iconField];
		}
		return null;
	};
	
	NSGrid.prototype.__isSortingIconCustom = function(colItem)
	{
		if(this.__getColumnCustomIcon(colItem,"sortAscending") && this.__getColumnCustomIcon(colItem,"sortDescending"))
		{
			return true;
		}
		return false;
	};
	
	NSGrid.prototype.__isRowExpansionIconCustom = function()
	{
		if(this.__getCustomIcon("rowExpanded") && this.__getCustomIcon("rowCollapsed"))
		{
			return true;
		}
		return false;
	};
	
	NSGrid.prototype.__getViewportHeight = function()
	{
		return this.__divTableHeaderContainerWrapper.offsetHeight + this.__divTableBodyContainerWrapper.offsetHeight + this.__divTableFooterContainerWrapper.offsetHeight;
	};
	
	NSGrid.prototype.__dispatchEvent = function(eventType,data,param,bubbles,cancelable)
	{
		if(this.__eventDispatcher)
		{
			this.__eventDispatcher(eventType,data,param,bubbles,cancelable);
		}
		else
		{
			this.util.dispatchEvent(this.__baseComponent,eventType,data,param,bubbles,cancelable);
		}
	};
	
	NSGrid.prototype.__dispatchInternalEvent = function(eventType,data,param,bubbles,cancelable)
	{
		this.util.dispatchEvent(this.__baseComponent,this.__getInternalEvent(eventType),data,param,bubbles,cancelable);
	};
	
	NSGrid.prototype.__listenInternalEvent = function(eventType,callback)
	{
		this.util.addEvent(this.__baseComponent,this.__getInternalEvent(eventType),function(event){
			callback(event,event.detail);
		});
	};
	
	NSGrid.prototype.__getInternalEvent = function(eventType)
	{
		return "__" + eventType;
	};
	/******************************End of Custom Function *************************************/
	/******************************Touch Related Function *************************************/
	NSGrid.prototype.__addTouchEvent = function(element)
	{
		var objTouch = null;
		if(element && this.__enableTouchEvents)
		{
			if(this.__objTouchEvents.has(element))
			{
				objTouch = this.__objTouchEvents.get(element);
			}
			else
			{
				objTouch = new NSTouchToMouse(element);
				this.__objTouchEvents.set(element,objTouch);
			}
		}
		return objTouch;
	};
	
	NSGrid.prototype.__removeTouchEvent = function(element)
	{
		var objTouch = null;
		if(element && this.__enableTouchEvents)
		{
			if(this.__objTouchEvents.has(element))
			{
				/*objTouch = this.__objTouchEvents.get(element);
				this.__objTouchEvents.delete(objTouch);*/
			}
		}
		return objTouch;
	};
	
	/******************************End of Touch Related Function *************************************/
	/******************************Loader Related Function *************************************/
	NSGrid.prototype.showLoader = function()
	{
		if(!this.__loader)
		{
			this.__loader = new this.util.loader(this.__divOuterContainer);
		}
		this.__loader.show();
	};
	
	NSGrid.prototype.hideLoader = function()
	{
		if(this.__loader)
		{
			this.__loader.hide();
		}
	};
	/******************************End of Loader Related Function *************************************/
	/******************************Start of Export Related Function *************************************/
	NSGrid.prototype.__exportHandler = function(target,item)
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
			    	var setting = {type:"xls",event:null,sheetName:this.__exportFileName,element:null,properties:item};
			    	nsExport.excel(setting);
			        break;
			    case 1:
			    	nsExport.csv();
			        break;
			    case 2:
			    	var setting = {type:"doc",event:null,orientation:null,element:null};
			    	nsExport.word(setting);
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
			    	var setting = {type:"xlsx",event:null,sheetName:this.__exportFileName,element:null,properties:item};
			    	nsExport.excel(setting);
			        break;
			    case 9:
			    	var setting = {type:"doc",event:null,orientation:null,element:null};
			    	nsExport.word(setting);
			        break;
			}
		}
	};
	
	//Events
	NSGrid.GRID_RENDERED = "gridRendered";
	NSGrid.ROW_SELECTED = "rowSelected";
	NSGrid.ROW_UNSELECTED = "rowUnselected";
	NSGrid.ROW_CLICKED = "rowClicked";
	NSGrid.ROW_DOUBLE_CLICKED = "rowDoubleClicked";
	NSGrid.ROW_NAVIGATED = "rowNavigated";
	NSGrid.CELL_SELECTED = "cellSelected";
	NSGrid.CELL_UNSELECTED = "cellUnselected";
	NSGrid.CELL_CLICKED = "cellClicked";
	NSGrid.CELL_DOUBLE_CLICKED = "cellDoubleClicked";
	NSGrid.SORT_CHANGING = "sortChanging";
	NSGrid.SORT_CHANGED = "sortChanged";
	NSGrid.ADVANCED_FILTER_CLOSING = "advancedFilterClosing";
	NSGrid.FILTER_CHANGING = "filterChanging";
	NSGrid.FILTER_CHANGED = "filterChanged";
	NSGrid.FILTER_RESETTED = "filterResetted";
	NSGrid.COLUMN_RESIZING = "columnResizing";
	NSGrid.COLUMN_RESIZED = "columnResized";
	NSGrid.COLUMN_MOVING = "columnMoving";
	NSGrid.COLUMN_MOVED = "columnMoved";
	NSGrid.MULTI_SELECTION_EDITORS_TEXT = "TEXT";
	NSGrid.MULTI_SELECTION_EDITORS_TEXTAREA = "TEXTAREA";
	NSGrid.EDITOR_CELL_VALUE_CHANGED = "editorCellValueChanged";
	
	
	//Editors
	NSGrid.EDITOR_EDITTYPE_CELL = "cell";
	NSGrid.EDITOR_EDITTYPE_ROW = "row";
	NSGrid.EDITOR_EDITING_SINGLECLICK = "singleClick";
	NSGrid.EDITOR_EDITING_DOUBLECLICK = "doubleClick";
	NSGrid.EDITOR_EDITING_NOCLICK = "noClick";
	NSGrid.EDITOR_TYPE_TEXT = "text";
	NSGrid.EDITOR_TYPE_TEXTAREA = "textArea";
	NSGrid.EDITOR_TYPE_CUSTOM = "custom";
	
	NSGrid.FILTER_TYPE_DATE = "date";
	NSGrid.ADVANCED_FILTER_TEXT = "text";
	NSGrid.ADVANCED_FILTER_NUMBER = "number";
	NSGrid.ADVANCED_FILTER_LIST = "list";
	NSGrid.ADVANCED_FILTER_DATE = "date";
	
	
	return NSGrid;
})();
nsModuleExport(__nsGlobal,"NSGrid",NSGrid);