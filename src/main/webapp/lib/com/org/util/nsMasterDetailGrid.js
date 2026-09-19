 "use strict"; 
var NSMasterDetailGrid = (function()
{
	function NSMasterDetailGrid(nsGrid,nsUtil) 
	{
		this.__nsGrid = nsGrid;
		this.util = nsUtil;
		
		this.__ARROW_COLLAPSE_PATH = "M 0 9.99994L 6.10352e-005 -3.05176e-005L 5 5.00006L 0 9.99994 Z";
		this.__ARROW_EXPANDED_PATH = "M 0 3.05176e-005L 9.99994 9.15527e-005L 4.99988 5.00003L 0 3.05176e-005 Z";
		this.__CLASS_ARROW = "nsGridArrowFill";
		this.__rowCounter = -1;
		this.__masterDetailHasChildField = "hasChildren";
		this.__masterDetailHasChildCallback = null;
		//Detail Grid Settings
		this.__masterDetailColumns = null;
		this.__masterDetailGetDataSourceCallback = null;
		this.__masterDetailGridSetting = null;
		this.__masterDetailDoesGridRefreshEverytimeCallback = null;
		this.__masterDetailGridDetailHtmlCallback = null;
		//End of Detail Grid Settings
		//Custom Detail Renderer
		this.__masterDetailDetailRenderer = null;
		this.__masterDetailDetailRendererParam = null;
		//End of Custom Detail Renderer
		this.__masterDetailHeight = -1;
		this.__filteringRendering = false;//flag which stops the Detail Component being Rendered while filtering id going on 
		
		this.__detailCell = this.__nsGrid.__fieldPrefix + "_detail_cell";
		this.__detailIndicatorField = this.__nsGrid.__fieldPrefix + "_detail_indicator_field";
		this.__detailCompInstance = this.__nsGrid.__fieldPrefix + "_detail_component_instance";
		this.__detailCompParentItem = this.__nsGrid.__fieldPrefix + "_detail_parent_item";
		this.__detailCompElement = this.__nsGrid.__fieldPrefix + "_detail_element";
		this.__detailCompGridIns = this.__nsGrid.__fieldPrefix + "_grid_instance";
	}
	/********************************Common Functions for Grid ****************************************/
	NSMasterDetailGrid.prototype.__initialize = function ()
	{
		var gridSetting = this.__nsGrid.__setting;
		var setting = gridSetting.masterDetailSetting;
		if(setting)
		{
			if(setting.hasOwnProperty("hasChildField"))
			{
				this.__masterDetailHasChildField = setting["hasChildField"];
			}
			else if(setting.hasOwnProperty("hasChildCallback"))
			{
				this.__masterDetailHasChildCallback = setting["hasChildCallback"];
				this.__masterDetailHasChildCallback = this.util.getFunction(this.__masterDetailHasChildCallback);
			}
			if(setting.hasOwnProperty("detailColumns"))
			{
				this.__masterDetailColumns = setting["detailColumns"];
			}
			if(setting.hasOwnProperty("detailDataSourceCallback"))
			{
				this.__masterDetailGetDataSourceCallback = setting["detailDataSourceCallback"];
				this.__masterDetailGetDataSourceCallback = this.util.getFunction(this.__masterDetailGetDataSourceCallback);
			}
			if(setting.hasOwnProperty("detailGridSetting"))
			{
				this.__masterDetailGridSetting = setting["detailGridSetting"];
			}
			if(setting.hasOwnProperty("gridRefreshEverytimeCallback"))
			{
				this.__masterDetailDoesGridRefreshEverytimeCallback = setting["gridRefreshEverytimeCallback"];
				this.__masterDetailDoesGridRefreshEverytimeCallback = this.util.getFunction(this.__masterDetailDoesGridRefreshEverytimeCallback);
			}
			if(setting.hasOwnProperty("gridHtmlCallback"))
			{
				this.__masterDetailGridDetailHtmlCallback = setting["gridHtmlCallback"];
				this.__masterDetailGridDetailHtmlCallback = this.util.getFunction(this.__masterDetailGridDetailHtmlCallback);
			}
			if(setting.hasOwnProperty("detailRenderer"))
			{
				this.__masterDetailDetailRenderer = setting["detailRenderer"];
				this.__masterDetailDetailRenderer = this.util.getFunction(this.__masterDetailDetailRenderer);
			}
			if(setting.hasOwnProperty("detailRendererParam"))
			{
				this.__masterDetailDetailRendererParam = setting["detailRendererParam"];
			}
			if(setting.hasOwnProperty("detailHeight"))
			{
				this.__masterDetailHeight = parseInt(setting["detailHeight"]);
			}
			if(!this.__masterDetailHasChildField && !this.__masterDetailHasChildCallback)
			{
				this.util.throwNSError("NSGrid","Enter either childDetectionField or childDetectionCallback value in masterDetailSetting.");
			}
			if(!(((this.__masterDetailColumns && this.__masterDetailColumns.length) && this.__masterDetailGetDataSourceCallback) || this.__masterDetailDetailRenderer))
			{
				this.util.throwNSError("NSGrid","Enter either detailColumns and detailDataSourceCallback or detailRenderer value in masterDetailSetting.");
			}
		}
	};
	
	NSMasterDetailGrid.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty) 
	{
		var attributeName = attrName.toLowerCase();
	};
	
	NSMasterDetailGrid.prototype.dataSource = function(source)
	{
		this.__addChildrenToSource(this.__nsGrid.__dataSource);
		this.__nsGrid.__arrWrapper = this.__nsGrid.__dataSource.slice(0);
		this.__nsGrid.__arrFilteredGroupedSource = this.__nsGrid.__arrWrapper.slice(0);
		this.__setWrapperSource(this.__nsGrid.__arrWrapper,0,-1,0,true,true,true);
		this.__nsGrid.__updateTotalRecords(this.__rowCounter);
		if(this.__nsGrid.__enablePagination && this.__nsGrid.__isPaginationModeAuto)
		{
			if(this.__nsGrid.__isPaginationTypeScroll)
			{
				this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0);//this.__nsGrid.__arrFlatHierarchicalSource.slice(0,this.__nsGrid.__INFINITE_SCROLL_INITIAL_LOAD);
				this.__nsGrid.__paginationFetchRecordCallBack = this.__addRowsforScrollPagination.bind(this);
			}
			else 
			{
				this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0,this.__nsGrid.__pageSize);
				this.__nsGrid.__createPaginationControl(this.__nsGrid.__divOuterContainer);
				this.__nsGrid.__paginationFetchRecordCallBack = this.__addRowsforPagePagination.bind(this);
			}
		}
		else
		{
			this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0);//this.__nsGrid.__arrWrapper.slice(0);
		}
	};
	
	NSMasterDetailGrid.prototype.addItemsAsChildren = function(item,arrChildren)
	{
		if(item && arrChildren && arrChildren.length > 0)
		{
			if(!item[this.__nsGrid.__childField])
			{
				item[this.__nsGrid.__childField] = [];
			}
			item[this.__nsGrid.__childField].push.apply(item[this.__nsGrid.__childField], arrChildren);
			this.__setWrapperSource(this.__nsGrid.__arrWrapper,0,-1,0,true,false,false);
			this.__nsGrid.__updateTotalRecords(this.__rowCounter);
			if(!(this.__nsGrid.__enablePagination && this.__nsGrid.__isPaginationModeAuto))
			{
				this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0);
				item[this.__nsGrid.__fieldRowVisible] = true;
				item[this.__nsGrid.__fieldIsCollapsed] = false;
		   		var row = this.__nsGrid.__getRowFromItem(item);
		   		var rowIndex = this.__nsGrid.__getIndexByItem(item);
		   		this.__nsGrid.__showHideRow(rowIndex,null,false);
			}
		}
	};
	
	NSMasterDetailGrid.prototype.afterGridRendered = function()
	{
		this.__nsGrid.__expandCollapseAll(true);
	};
	
	NSMasterDetailGrid.prototype.afterFiltering = function(isReset)
	{
		var self = this;
		//first expand all the rows so that the indexes of detail items are valid and then collapse the rows after 0 sec.
		//while this collapsing and expanding happens .. disable the detail component to be called/created for performance.
		this.__filteringRendering = true;
		this.__nsGrid.__expandCollapseAll(false);
		setTimeout(function() {
			self.__nsGrid.__expandCollapseAll(true);
			setTimeout(function(){
				//reset the flag so that the detail compoent can be created again
				self.__filteringRendering = false;
			}, 50);
		},0);
	};
	
	NSMasterDetailGrid.prototype.arrowClickHandler = function(parentItem,isCollapse)
	{
		if(!isCollapse && parentItem && parentItem[this.__nsGrid.__fieldHasChild]) 
		{
			var childIndex = parentItem[this.__nsGrid.__fieldIndex] + 1;
			var childItem = this.__nsGrid.__getItemByIndex(childIndex);
			if(childItem) {
				/*var childRow = childItem[this.__nsGrid.__fieldRow];
				if(childRow) {
					var childCell = childRow.firstChild;
					this.__renderDetailCell(childCell,childItem,item,childRow);
				}*/
				this.expandCollapseHandler(childItem,isCollapse);
			}
		}
	};
	
	NSMasterDetailGrid.prototype.expandCollapseHandler = function(item,isCollapse)
	{
		if(!isCollapse && item && item[this.__detailIndicatorField]) 
		{
			var row = item[this.__nsGrid.__fieldRow];
			if(row) 
			{
				var cell = row.firstChild;
				this.__renderDetailCell(cell,item,null,row);
			}
		}
	};
	
	NSMasterDetailGrid.prototype.__createBodyBody = function(dataSet,startIndex,endIndex)
	{
	    if(dataSet && dataSet.length > 0)
	    {
	    	for (var rowIndex = startIndex; rowIndex < endIndex; rowIndex++)
		    {
	    		var item = dataSet[rowIndex];
	    		this.__createRow(item);
		    }
	    }
	};
	
	NSMasterDetailGrid.prototype.__setSourceForAsync = function()
	{
		this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0);
	};
	
	NSMasterDetailGrid.prototype.__createRowAsync = function(item,index,array)
	{
		this.__createRow(item);
	};
	
	NSMasterDetailGrid.prototype.__createBodyBodyVirtual = function(dataSet,totalRows,level)
	{
		if(dataSet && dataSet.length > 0)
	    {
	    	if(totalRows > dataSet.length)
	    	{
	    		totalRows = dataSet.length;
	    	}
	    	else if(this.__nsGrid.__enableVariableRowHeight)
	    	{
	    		totalRows = totalRows + this.__nsGrid.__extraRowCountForVariableHeight;
	    	}
	    	this.__createBodyBody(dataSet,0,totalRows);
	    }
	};
	
	NSMasterDetailGrid.prototype.__createBody = function()
	{
	};
	
	NSMasterDetailGrid.prototype.__checkForAdditionalColumns = function()
	{
	};
	
	NSMasterDetailGrid.prototype.__setMeasurement = function()
	{
	};
	
	NSMasterDetailGrid.prototype.__addSVGInPage = function(objSVG)
	{
		objSVG.addPath("svgArrowDown",this.__ARROW_EXPANDED_PATH,"0 0 16 16");
		objSVG.addPath("svgArrowRight",this.__ARROW_COLLAPSE_PATH,"0 0 16 16");
	};
	
	NSMasterDetailGrid.prototype.__setWrapperSource = function(source,offset,parentIndex,level,setFieldIndex,setIsCollapsed,setItemVisible)
	{
		if(source)
		{
			if(level === 0)
			{
				if(!offset)
				{
					offset = 0;
				}
				this.__nsGrid.__arrFlatHierarchicalSource = [];
				this.__rowCounter = offset;
			}
			var length = source.length;
			var count = 0;
			var item = null;
			/*if(this.__nsGrid.__renderInCachedMode)
			{
				for (count = 0; count < length; count++) 
				{
					item = source[count];
					this.__rowCounter++;
					this.__nsGrid.__arrFlatHierarchicalSource.push(item);
					this.__setRowItemProperty(item,parentIndex,level,setFieldIndex,setIsCollapsed,setItemVisible);
					var colLength = this.__nsGrid.__columns.length;
					var arrCellsText = [];
					for (var colIndex = 0; colIndex < colLength; colIndex++)
			        {
			        	var colItem = this.__nsGrid.__columns[colIndex];
			            var cellDiv = this.util.createDiv(null);
			            this.__nsGrid.__addCellText(null,item,cellDiv,colItem,colIndex);
			            arrCellsText.push(cellDiv);
			        }
					item[this.__nsGrid.__fieldCellText] = arrCellsText;
				}
			}
			else
			{*/
			for (count = 0; count < length; count++) 
			{
				item = source[count];
				this.__rowCounter++;
				this.__nsGrid.__arrFlatHierarchicalSource.push(item);
				this.__setRowItemProperty(item,parentIndex,level,setFieldIndex,setIsCollapsed,setItemVisible);
			}
			//}
		}
	};
	
	/*useVisibleIndex flag is used when we want to use visible index,generally true for all cases except for expandCollapse all due to performance issues*/  
	NSMasterDetailGrid.prototype.__resetDataInBody = function(fromIndex,toIndex,fromRowIndex,useVisibleIndex)
	{
		if(!fromRowIndex)
		{
			fromRowIndex = 0;
		}
		var row = null;
		var item = null;
		var arrRows = this.__nsGrid.__tblCenterBodyBody.rows;
		var rowLength = arrRows.length;
		var length = this.__nsGrid.__arrFlatHierarchicalSource.length;
		var indexCount = fromIndex;
		var rowCount = fromRowIndex;
		for(var count = fromIndex; count < length; count++)
		{
			if(this.__nsGrid.__enableVirtualScroll && useVisibleIndex)
			{
				item = this.__nsGrid.__getVisibleItemByIndex(this.__nsGrid.__arrFlatHierarchicalSource,count);
			}
			else
			{
				item = this.__nsGrid.__arrFlatHierarchicalSource[count];
			}
			//breaking if item not found as if large data set is rendered and after collapse all the while scrolling after a while item is null still it goes to end of data set which are hidden
			if(item)
			{
				if(item[this.__nsGrid.__fieldRowVisible])
				{
					if(rowLength <= rowCount) // || indexCount > toIndex
					{
						break;
					}
					row = arrRows[rowCount];
					this.__resetRow(row,item);
					indexCount++;
					rowCount++;
				}
			}
			else
			{
				break;
			}
		}
		for(var rowIndex = rowCount;rowIndex < rowLength;rowIndex++)
		{
			row = arrRows[rowIndex];
			row.style.display = "none";
			row.setAttribute("ns-index",null);
			row.setAttribute("ns-level",null);
			row.setAttribute("ns-parent-index",null);
		}
	};
	
	NSMasterDetailGrid.prototype.__updateCellText = function(row,cell,item,colItem,rowIndex,colIndex)
	{
		if(cell && item && colItem)
		{
			this.util.removeAllChildren(cell);
			var cellDiv = this.util.createDiv(null);
			var divText = this.__setBodyCellProperty(row,cell,cellDiv,item,rowIndex,colItem,colIndex,item[this.__nsGrid.__fieldParentIndex],item[this.__nsGrid.__fieldRowLevel]);
			//this.__nsGrid.__highlightDiv(divText,colIndex);
			cell.appendChild(cellDiv);
		}
	};
	
	NSMasterDetailGrid.prototype.__getFlatSource = function()
	{
		return this.__nsGrid.__arrFlatHierarchicalSource;
	};
	
	NSMasterDetailGrid.prototype.__isCellEditable = function(objColumn,item,cell,cellIndex,row,rowIndex)
	{
		return true;
	};
	
	NSMasterDetailGrid.prototype.__handleOnDemandClick = function(item,event)
	{
	};
	NSMasterDetailGrid.prototype.__ignoreFieldsForDeepCopy = function()
	{
		return [this.__detailCompInstance, this.__detailCompParentItem];
	};
	/********************************End of Common Functions for Grid ****************************************/
	NSMasterDetailGrid.prototype.__createRow = function(item,itemIndex,isAdd)
	{
		// && (!item[this.__detailCompParentItem] || item[this.__detailCompParentItem][this.__nsGrid.__fieldIsCollapsed])
		if(item && item[this.__nsGrid.__fieldRowVisible])
		{
			isAdd = this.util.isUndefinedOrNull(isAdd) ? true : Boolean.parse(isAdd);
			var row = this.util.createElement("TR");
			item[this.__nsGrid.__fieldRowHtml] = row;
			var index = item[this.__nsGrid.__fieldIndex];
			var level = item[this.__nsGrid.__fieldRowLevel];
			var parentIndex = item[this.__nsGrid.__fieldParentIndex];
			row.setAttribute("ns-index",index);
			row.setAttribute("ns-level",level);
			if(item[this.__nsGrid.__fieldHasParent])
		    {
				row.setAttribute("ns-parent-index",parentIndex);
		    }
			this.__nsGrid.__setBodyRowProperty(row,item,index);
			this.__nsGrid.__applyCustomClass(row,"bodyRow");
			var colLength = this.__nsGrid.__columns.length;
			if(item[this.__detailIndicatorField]) {
				if(!item[this.__detailCell]) {
					var cell =  this.__nsGrid.__createBodyRowCell(row,0,true);
					cell.setAttribute("colspan",this.__nsGrid.__columns.length);
					var cellDiv = cell.firstChild;
					if(this.__masterDetailHeight > 0) {
						cell.style.height = this.__masterDetailHeight + "px";
						cellDiv.style.height = "100%";
					}
					else {
						cell.style.height = "auto";
					}
					if(item[this.__detailCompElement]) {
						cellDiv.appendChild(item[this.__detailCompElement]);
					}
					else {
						//this.__renderDetailCell(cell,item,null,row);
					}
					item[this.__detailCell] = cell;
				}
				else {
					row.appendChild(item[this.__detailCell]);
				}
			}
			else {
				for (var colIndex = 0; colIndex < colLength; colIndex++)
			    {
					var colItem = this.__nsGrid.__columns[colIndex];
					var cell =  this.__nsGrid.__createBodyRowCell(row,colIndex,true);
		            var cellDiv = cell.firstChild;
		            var divText = this.__setBodyCellProperty(row,cell,cellDiv,item,index,colItem,colIndex,parentIndex,level);
		            //this.__nsGrid.__highlightDiv(divText,colIndex);
		            cell.appendChild(cellDiv);
		            this.__nsGrid.__setBodyCellProperties.bind(this.__nsGrid)(cell);
			    }
			}
			if(isAdd)
			{
				var addRow = true;
				if(!this.util.isUndefinedOrNull(itemIndex) && itemIndex > 0 && this.__nsGrid.__tblCenterBodyBody.children 
						&& this.__nsGrid.__tblCenterBodyBody.children.length >= itemIndex)
				{
					var prevRow = this.__nsGrid.__tblCenterBodyBody.children[itemIndex - 1]; //this.__nsGrid.__getRowByIndex(itemIndex);
					if(prevRow)
					{
						this.__nsGrid.__tblCenterBodyBody.insertBefore(row,prevRow);
						addRow = false;
					}
				}
				if(addRow)
				{
					this.__nsGrid.__tblCenterBodyBody.appendChild(row);
				}
			}
			this.__nsGrid.__createFixedBodyRow(row);
			return row;
		}
		return null;
	};
	
	NSMasterDetailGrid.prototype.__updateRow = function(row,item)
	{
		if(row && item)
		{
			var index = item[this.__nsGrid.__fieldIndex];
			var level = item[this.__nsGrid.__fieldRowLevel];
			var parentIndex = item[this.__nsGrid.__fieldParentIndex];
			row.setAttribute("ns-index",index);
			row.setAttribute("ns-level",level);
			if(item[this.__nsGrid.__fieldHasParent])
		    {
				row.setAttribute("ns-parent-index",parentIndex);
		    }
			else
			{
				row.setAttribute("ns-parent-index",null);
			}
			if(item[this.__nsGrid.__fieldSelected])
			{
				this.util.addStyleClass(row,this.__nsGrid.__CLASS_SELECTED_ROW);
			}
			else
			{
				this.util.removeStyleClass(row,this.__nsGrid.__CLASS_SELECTED_ROW);
			}
			var cells = row.cells;
			for (var colIndex = 0; colIndex < this.__nsGrid.__columns.length; colIndex++)
	        {
				var cell = cells[colIndex];
				var colItem = this.__nsGrid.__columns[colIndex];
				this.__updateCellText(row,cell,item,colItem,index,colIndex);
	        }
		}
	};
	
	NSMasterDetailGrid.prototype.__setRowItemProperty = function(item,parentIndex,level,setFieldIndex,setIsCollapsed,setItemVisible)
	{
		if(item)
		{
			var totalRowCount = this.__rowCounter;
			if(setFieldIndex || this.util.isUndefinedOrNull(item[this.__nsGrid.__fieldIndex]))
			{
				item[this.__nsGrid.__fieldIndex] = totalRowCount;
			}
			item[this.__nsGrid.__fieldVisibleIndex] = totalRowCount;
			item[this.__nsGrid.__fieldRowLevel] = level;
			var hasChild = false;
			if((item[this.__nsGrid.__childField] && item[this.__nsGrid.__childField].length > 0))
		    {
		    	hasChild = true;
		    	this.__setWrapperSource(item[this.__nsGrid.__childField],0,totalRowCount,level + 1,setFieldIndex,setIsCollapsed,setItemVisible);
		    }
			item[this.__nsGrid.__fieldParentIndex] = parentIndex;
			if(parentIndex > -1)
		    {
				item[this.__nsGrid.__fieldHasParent] = true;
		    }
			else
			{
				item[this.__nsGrid.__fieldHasParent] = false;
			}
			item[this.__nsGrid.__fieldHasChild] = hasChild;
			if(setItemVisible || this.util.isUndefinedOrNull(item[this.__nsGrid.__fieldRowVisible]))
			{
				item[this.__nsGrid.__fieldRowVisible] = true;
				
			}
			if(setIsCollapsed || this.util.isUndefinedOrNull(item[this.__nsGrid.__fieldIsCollapsed]))
			{
				item[this.__nsGrid.__fieldIsCollapsed] = true;//Boolean.parse(item[this.__detailIndicatorField]);
			}
		}
	};
	
	
	NSMasterDetailGrid.prototype.__setBodyCellProperty = function(row,cell,cellDiv,item,currentIndex,colItem,colIndex,parentIndex,level)
	{
		var hierarchicalPadding = 0;
		var divText = null;
		if(colItem && colItem.hasOwnProperty("dataField") && colItem["dataField"])
		{
			if(colIndex == 0 && item[this.__nsGrid.__childField]  && item[this.__nsGrid.__childField].length > 0)
	        {
	        	this.util.addStyleClass(cellDiv,this.__nsGrid.__CLASS_GROUP_CELL);
	        	this.__nsGrid.__createArrow(item,currentIndex,cellDiv,item[this.__nsGrid.__fieldIsCollapsed],colItem);
	        	var cellText = this.util.createDiv(null,this.__nsGrid.__CLASS_CELL_CHILD);
	        	cellText.style.verticalAlign = "top";
	        	divText = cellText;
	        	if(this.__nsGrid.__renderInCachedMode)
	        	{
	        		var arrCellsText = item[this.__nsGrid.__fieldCellText];
	        		cellText.innerHTML = arrCellsText[colIndex].outerHTML;
	        	}
	        	else
	        	{
	        		this.__nsGrid.__addCellText(row,item,cellText,colItem,colIndex);
	        	}
	        	this.util.addStyleClass(cellText,"nsGroupCellText");
	        	cellDiv.appendChild(cellText);
	        }
	        else
	        {
	        	this.util.addStyleClass(cellDiv,this.__nsGrid.__CLASS_CELL_CHILD);
	        	if(this.__nsGrid.__renderInCachedMode)
	        	{
	        		var arrCellsText = item[this.__nsGrid.__fieldCellText];
	        		cellDiv.innerHTML = arrCellsText[colIndex].outerHTML;
	        	}
	        	else
	        	{
	        		this.__nsGrid.__addCellText(row,item,cellDiv,colItem,colIndex);
	        	}
	        	divText = cellDiv;
	        	//24 = 16(Arrow Width) + 6(Arrow Parent Padding) + 2(cellDiv horizontalGap between elements shown in debugger)
	        	hierarchicalPadding = 24;
	        }
	        if(colIndex == 0)
	        {
	        	var paddingLeft = (10 * level) + hierarchicalPadding;
	        	if(level === 0 || !this.__nsGrid.__showExpandCollapseIcon)
	        	{
	        		paddingLeft += 2;
	        	}
	        	cell.style.paddingLeft = paddingLeft + "px";
	        }
		}
		this.__nsGrid.__addPriorityClassInCell(cell,colItem);
		return divText;
	};
	
	NSMasterDetailGrid.prototype.__createArrow = function(compArrow,objSVG,arrowID,isCollapsed,item,colItem)
	{
		 if(this.__nsGrid.__isRowExpansionIconCustom())
		 {
			 this.__setArrowDirection(compArrow,isCollapsed,colItem);
		 }
		 else
		 {
			 var svg = objSVG.addSVG(compArrow,arrowID + "svg",this.__CLASS_ARROW,null,null,null,null,null,null,true);
			 this.util.addStyleClass(svg,this.__CLASS_ARROW + "Theme");
			 if(isCollapsed)
			 {
				 objSVG.addUse(svg,arrowID + "use",null,"#svgArrowRight");
			 }
			 else
			 {
				 objSVG.addUse(svg,arrowID + "use",null,"#svgArrowDown");
			 }
		 }
	};
	
	NSMasterDetailGrid.prototype.__setArrowDirection = function(compArrow,isCollapsed,colItem)
	{
		if(this.__nsGrid.__isRowExpansionIconCustom())
		{
			if(isCollapsed)
			{
				compArrow.innerHTML = this.__nsGrid.__getCustomIcon("rowCollapsed");
			}
			else
			{
				compArrow.innerHTML = this.__nsGrid.__getCustomIcon("rowExpanded");
			}
		}
		else
		{
			var objSVG = new NSSvg();
			var useID = compArrow.getAttribute("id") + "use";
			if(isCollapsed)
			{
				objSVG.changeUseHref(useID,"#svgArrowRight");
			}
			else
			{
				objSVG.changeUseHref(useID,"#svgArrowDown");
			}
		}
	};
	
	NSMasterDetailGrid.prototype.__resetRow = function(row,item)
	{
		var index = item[this.__nsGrid.__fieldIndex];
		row.style.display = "";
		row.setAttribute("ns-index",index);
		item[this.__nsGrid.__fieldRowHtml] = row;
		this.__updateRow(row,item);
	};
	
	NSMasterDetailGrid.prototype.__addRowsforScrollPagination = function(fromRecord,toRecord,pageSize)
	{
		var arrArray = this.__nsGrid.__arrFlatHierarchicalSource.slice(fromRecord,toRecord + 1); 
		this.__nsGrid.__addRemoveRowCallInternal = true;
		this.__nsGrid.addRows(arrArray);
	};
	
	NSMasterDetailGrid.prototype.__addRowsforPagePagination = function(fromRecord,toRecord,pageSize)
	{
		//slice returns index range from fromRecord to toRecord - 1 hence adding 1 
		//this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(fromRecord,toRecord + 1);
		this.__nsGrid.__resetDataInBody(fromRecord,toRecord);
	};
	
	NSMasterDetailGrid.prototype.__addChildrenToSource = function(arrSource)
	{
		if(arrSource) {
			for(var count = 0;count < arrSource.length;count++) {
				var item = arrSource[count];
				if(!item[this.__nsGrid.__childField] || !item[this.__nsGrid.__childField].length) {
					var hasChildren = this.__hasChildren(item);
					if(hasChildren) {
						var childItem = this.util.cloneObject(item, true);
						childItem[this.__detailIndicatorField] = true;
						//only call detail component when its not between filtering
						if(!this.__filteringRendering) {
							childItem[this.__detailCompInstance] = this.__getRendererInstance(item);
						}
						childItem[this.__detailCompParentItem] = item;
						item[this.__nsGrid.__childField] = [childItem];
					}
				}
			}
		}
	};
	
	NSMasterDetailGrid.prototype.__getRendererInstance = function(parentItem)
	{
		var objRenderer = null;
		if(this.__masterDetailColumns && this.__masterDetailColumns.length) 
		{
			objRenderer = this.__getGridRenderer(this,this.__masterDetailColumns,this.__masterDetailGridSetting);
		}
		else 
		{
			objRenderer = new this.__masterDetailDetailRenderer();
		}
		return objRenderer;
	};
	
	NSMasterDetailGrid.prototype.__hasChildren = function(item)
	{
		if(item) {
			if(item.hasOwnProperty(this.__masterDetailHasChildField)) {
				return Boolean.parse(item[this.__masterDetailHasChildField]);
			}
			if(this.__masterDetailHasChildCallback) {
				return this.__masterDetailHasChildCallback(item);
			}
		}
		return false;
	};
	
	NSMasterDetailGrid.prototype.__renderDetailCell = function(cell,item,parentItem,row)
	{
		if(cell && item) {
			if(!parentItem) {
				parentItem = item[this.__detailCompParentItem];
			}
			var compInstance = item[this.__detailCompInstance];
			var cellDiv = cell.firstChild;
	        this.util.addStyleClass(cellDiv,"nsBodyDataGridCellMasterDetailCon");
	        var params = {};
	        if(this.__masterDetailDetailRendererParam) {
	        	params = this.util.cloneObject(this.__masterDetailDetailRendererParam,true);
	        }
	        params.masterData = parentItem;
	        params.container = cellDiv;
	        params.cell = cell;
	        params.row = row;
	        params.rowIndex = item[this.__nsGrid.__fieldIndex];
	        //only call detail component when its not between filtering
	        if(compInstance && !this.__filteringRendering) {
		        if(!item[this.__detailCompElement] || !compInstance.renderEverytime || compInstance.renderEverytime(params)) {
		        	var callback = function() {
		        		var childComp = this.__callComponentFunction(compInstance,"getElement",null,null,true);
				        //var childComp = compInstance.getElement();
				        cellDiv.innerHTML = "";
				        cellDiv.appendChild(childComp);
				        item[this.__detailCompElement] = childComp;
				        this.__callComponentFunction(compInstance,"elementAdded",params,null,false);
		        	};
		        	var res = this.__callComponentFunction(compInstance,"init",params,null,true);
		        	this.util.resolveFunctionOrPromise(res,callback.bind(this));
		        }
		    }
		}
	}
	
	NSMasterDetailGrid.prototype.__callComponentFunction = function(compIns,functionRef,param,defaultValue,throwError)
	{
		if(compIns && compIns[functionRef] && this.util.isFunction(compIns[functionRef]))
		{
			var retValue = null;
			var retValue = null;
			if(param && this.util.isArray(param) && param.length > 0)
			{
				retValue = compIns[functionRef].apply(null,param);
			}
			else
			{
				retValue = compIns[functionRef](param);
			}
			if(!this.util.isUndefinedOrNull(retValue))
			{
				return retValue;
			}
		}
		else if(throwError) {
			this.util.throwNSError("NSGrid","Function " + functionRef + " should be present in detail renderer.");
		}
		return defaultValue;
	};
	
	NSMasterDetailGrid.prototype.__getGridRenderer = function(parent,columns,setting) 
	{
		function GridRenderer() {
		  this.con = null;
		  this.gridCon = null;
		  this.params = null;
		  this.item = null;
		  this.objGrid = null;
		  this.arrSource = [];
		}
		
		GridRenderer.prototype.init = function(params) {
			this.params = parent.util.cloneObject(params);
			this.item = params.masterData;
			if(parent.__masterDetailGridDetailHtmlCallback) 
			{
				var html = parent.__masterDetailGridDetailHtmlCallback(params);
				if(html) 
				{
					var objComp = parent.util.getReferenceFromHtml(html);
					if(objComp.refs && objComp.refs["detailGrid"]) 
					{
						this.con = objComp.element;
						this.gridCon = objComp.refs["detailGrid"];
						return;
					}
				}
			}
			this.con = parent.util.createElement("div");
			this.con.style.height = "100%";
			this.gridCon = this.con;
			var container = params.container;
			parent.util.addStyleClass(container,"nsMasterDetailGridContainer");
		};
		
		GridRenderer.prototype.getElement = function() {
		  	return this.con;
		};
		
		GridRenderer.prototype.elementAdded = function(params) {
			this.__getGridObject();
		};
		
		GridRenderer.prototype.renderEverytime = function(params) {
			if(parent.__masterDetailDoesGridRefreshEverytimeCallback) {
				return parent.__masterDetailDoesGridRefreshEverytimeCallback(params);
			}
			return true;
		};
		//private function
		GridRenderer.prototype.__setGridSource = function(arrSource)
		{
			this.arrSource = arrSource;
			this.objGrid.dataSource.call(this.objGrid,this.arrSource);
		};
		
		GridRenderer.prototype.__getGridObject = function(arrSource) {
			
			var masterItem = this.item;
			this.objGrid = new NSGrid(this.gridCon,setting);
			this.objGrid.setColumn(columns);
			this.params.gridContainer = this.gridCon;
			this.params.setDataSource = this.__setGridSource.bind(this);
			parent.__masterDetailGetDataSourceCallback(this.params);
			return this.objGrid;
		};
		return new GridRenderer();
	};
	
	return NSMasterDetailGrid;
})();
nsModuleExport(__nsGlobal,"NSMasterDetailGrid",NSMasterDetailGrid);