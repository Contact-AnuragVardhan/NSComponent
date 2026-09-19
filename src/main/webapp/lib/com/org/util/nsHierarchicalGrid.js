 "use strict"; 
var NSHierarchicalGrid = (function()
{
	function NSHierarchicalGrid(nsGrid,nsUtil) 
	{
		this.__nsGrid = nsGrid;
		this.util = nsUtil;
		
		this.__ARROW_COLLAPSE_PATH = "M 0 9.99994L 6.10352e-005 -3.05176e-005L 5 5.00006L 0 9.99994 Z";
		this.__ARROW_EXPANDED_PATH = "M 0 3.05176e-005L 9.99994 9.15527e-005L 4.99988 5.00003L 0 3.05176e-005 Z";
		this.__CLASS_ARROW = "nsGridArrowFill";
		this.__rowCounter = -1;
		this.__enableOnDemandHierarchy = false;
		this.__onDemandChildDetectionField = "hasChildren";
		this.__onDemandChildFetchCallback = null;
	}
	/********************************Common Functions for Grid ****************************************/
	NSHierarchicalGrid.prototype.__initialize = function ()
	{
		var setting = this.__nsGrid.__setting;
		if(setting.hasOwnProperty("enableOnDemandHierarchy"))
		{
			this.__enableOnDemandHierarchy = Boolean.parse(setting["enableOnDemandHierarchy"]);
		}
		if(this.__enableOnDemandHierarchy)
		{
			if(setting.hasOwnProperty("onDemandChildDetectionField"))
			{
				this.__onDemandChildDetectionField = setting["onDemandChildDetectionField"];
			}
			if(setting.hasOwnProperty("onDemandChildFetchCallback"))
			{
				this.__onDemandChildFetchCallback = setting["onDemandChildFetchCallback"];
				this.__onDemandChildFetchCallback = this.util.getFunction(this.__onDemandChildFetchCallback);
			}
			if(!this.__onDemandChildDetectionField)
			{
				this.util.throwNSError("NSGrid","Value for onDemandChildDetectionField is not valid");
			}
			if(!this.__onDemandChildFetchCallback)
			{
				this.util.throwNSError("NSGrid","Value for onDemandChildFetchCallback is not valid");
			}
			if(this.__enableVirtualScroll || (this.__nsGrid.__enablePagination && this.__nsGrid.__isPaginationModeAuto))
			{
				this.util.warning("NSGrid","As VirtualScroll or Pagination Mode is true so OnDemandHierarchy will have no impact.");
			}
		}
	};
	
	NSHierarchicalGrid.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty) 
	{
		var attributeName = attrName.toLowerCase();
	};
	
	NSHierarchicalGrid.prototype.dataSource = function(source)
	{
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
	
	NSHierarchicalGrid.prototype.addItemsAsChildren = function(item,arrChildren)
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
	
	NSHierarchicalGrid.prototype.afterGridRendered = function()
	{
	};
	
	NSHierarchicalGrid.prototype.arrowClickHandler = function(parentItem,isCollapse) 
	{
	};
	
	NSHierarchicalGrid.prototype.expandCollapseHandler = function(item,isCollapse)
	{
	};
	
	NSHierarchicalGrid.prototype.__createBodyBody= function(dataSet,startIndex,endIndex)
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
	
	NSHierarchicalGrid.prototype.__setSourceForAsync= function()
	{
		this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0);
	};
	
	NSHierarchicalGrid.prototype.__createRowAsync= function(item,index,array)
	{
		this.__createRow(item);
	};
	
	NSHierarchicalGrid.prototype.__createBodyBodyVirtual= function(dataSet,totalRows,level)
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
	
	NSHierarchicalGrid.prototype.__createBody = function()
	{
	};
	
	NSHierarchicalGrid.prototype.__checkForAdditionalColumns = function()
	{
	};
	
	NSHierarchicalGrid.prototype.__setMeasurement = function()
	{
	};
	
	NSHierarchicalGrid.prototype.__addSVGInPage = function(objSVG)
	{
		objSVG.addPath("svgArrowDown",this.__ARROW_EXPANDED_PATH,"0 0 16 16");
		objSVG.addPath("svgArrowRight",this.__ARROW_COLLAPSE_PATH,"0 0 16 16");
	};
	
	NSHierarchicalGrid.prototype.__setWrapperSource = function(source,offset,parentIndex,level,setFieldIndex,setIsCollapsed,setItemVisible)
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
			if(this.__nsGrid.__renderInCachedMode)
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
			{
				for (count = 0; count < length; count++) 
				{
					item = source[count];
					this.__rowCounter++;
					this.__nsGrid.__arrFlatHierarchicalSource.push(item);
					this.__setRowItemProperty(item,parentIndex,level,setFieldIndex,setIsCollapsed,setItemVisible);
				}
			}
		}
	};
	
	/*useVisibleIndex flag is used when we want to use visible index,generally true for all cases except for expandCollapse all due to performance issues*/  
	NSHierarchicalGrid.prototype.__resetDataInBody= function(fromIndex,toIndex,fromRowIndex,useVisibleIndex)
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
	
	NSHierarchicalGrid.prototype.__updateCellText = function(row,cell,item,colItem,rowIndex,colIndex)
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
	
	NSHierarchicalGrid.prototype.__getFlatSource = function()
	{
		return this.__nsGrid.__arrFlatHierarchicalSource;
	};
	
	NSHierarchicalGrid.prototype.__isCellEditable = function(objColumn,item,cell,cellIndex,row,rowIndex)
	{
		return true;
	};
	
	NSHierarchicalGrid.prototype.__isOnDemandHasChildren = function(item)
	{
		return (this.__enableOnDemandHierarchy && item[this.__onDemandChildDetectionField]);
	};
	
	NSHierarchicalGrid.prototype.__handleOnDemandClick = function(item,event)
	{
		if(item && this.__isOnDemandHasChildren(item))
		{
			if(this.__onDemandChildFetchCallback)
			{
				event = this.util.getEvent(event);
				var rowLevel = item[this.__nsGrid.__fieldRowLevel];
				var rowIndex = this.__nsGrid.__getIndexByItem(item);
				this.__onDemandChildFetchCallback(item,rowIndex,rowLevel,event);
			}
		}
	};
	/********************************End of Common Functions for Grid ****************************************/
	NSHierarchicalGrid.prototype.__createRow = function(item,itemIndex,isAdd)
	{
		if(item && item[this.__nsGrid.__fieldRowVisible])
		{
			isAdd = this.util.isUndefinedOrNull(isAdd) ? true : Boolean.parse(isAdd);
			var row = document.createElement("TR");
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
	
	NSHierarchicalGrid.prototype.__updateRow = function(row,item)
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
	
	NSHierarchicalGrid.prototype.__setRowItemProperty = function(item,parentIndex,level,setFieldIndex,setIsCollapsed,setItemVisible)
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
			if((item[this.__nsGrid.__childField] && item[this.__nsGrid.__childField].length > 0)  || (this.__isOnDemandHasChildren(item)))
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
				item[this.__nsGrid.__fieldIsCollapsed] = this.__isOnDemandHasChildren(item);
			}
		}
	};
	
	
	NSHierarchicalGrid.prototype.__setBodyCellProperty = function(row,cell,cellDiv,item,currentIndex,colItem,colIndex,parentIndex,level)
	{
		var hierarchicalPadding = 0;
		var divText = null;
		if(colItem && colItem.hasOwnProperty("dataField") && colItem["dataField"])
		{
	        if(colIndex == 0 && ((item[this.__nsGrid.__childField]  && item[this.__nsGrid.__childField].length > 0) || (this.__isOnDemandHasChildren(item))))
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
	        	if(level === 0 || !this.__nsGrid.__showExpandCollapseIcon)
	        	{
	        		cell.style.paddingLeft = "1px";
	        	}
	        	else
	        	{
	        		var paddingLeft = (10 * level) + hierarchicalPadding;
	        		cell.style.paddingLeft = paddingLeft + "px";
	        	}
	        }
		}
		this.__nsGrid.__addPriorityClassInCell(cell,colItem);
		return divText;
	};
	
	NSHierarchicalGrid.prototype.__createArrow = function(compArrow,objSVG,arrowID,isCollapsed,item,colItem)
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
	
	NSHierarchicalGrid.prototype.__setArrowDirection = function(compArrow,isCollapsed,colItem)
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
	
	NSHierarchicalGrid.prototype.__resetRow = function(row,item)
	{
		var index = item[this.__nsGrid.__fieldIndex];
		row.style.display = "";
		row.setAttribute("ns-index",index);
		item[this.__nsGrid.__fieldRowHtml] = row;
		this.__updateRow(row,item);
	};
	
	NSHierarchicalGrid.prototype.__addRowsforScrollPagination = function(fromRecord,toRecord,pageSize)
	{
		//console.log("In __addRowsforScrollPagination " + fromRecord + "," + toRecord + "," + pageSize);
		var arrArray = this.__nsGrid.__arrFlatHierarchicalSource.slice(fromRecord,toRecord + 1); 
		this.__nsGrid.__addRemoveRowCallInternal = true;
		this.__nsGrid.addRows(arrArray);
	};
	
	NSHierarchicalGrid.prototype.__addRowsforPagePagination = function(fromRecord,toRecord,pageSize)
	{
		//slice returns index range from fromRecord to toRecord - 1 hence adding 1 
		//this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(fromRecord,toRecord + 1);
		this.__nsGrid.__resetDataInBody(fromRecord,toRecord);
	};
	
	return NSHierarchicalGrid;
})();
nsModuleExport(__nsGlobal,"NSHierarchicalGrid",NSHierarchicalGrid);