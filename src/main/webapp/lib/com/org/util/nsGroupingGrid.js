 "use strict";
var NSGroupingGrid = (function()
{
	function NSGroupingGrid(nsGrid,nsUtil) 
	{
		this.__nsGrid = nsGrid;
		this.util = nsUtil;
		
		this.__ARROW_COLLAPSE_PATH = "M 10,5.99994L 6,5.99994L 6,9.99994L 4,9.99994L 4,5.99994L 0,5.99994L 0,3.99994L 4,3.99994L 4,-6.10352e-005L 6,-6.10352e-005L 6,3.99994L 10,3.99994L 10,5.99994 Z";
		
		this.__isSingleLevelMode = true; 
		this.__groupSource = null;
		this.__fieldColNameArrow = this.__nsGrid.getID() + "_arrow_field";
		this.__groupColumnFieldName = this.__nsGrid.getID() + "_group_field";
		this.__childrenCountField = this.__nsGrid.getID() + "_children_count_field";
		this.__rowCounter = -1;
	}
	 /********************************Common Functions for Grid ****************************************/
	NSGroupingGrid.prototype.__initialize = function ()
	{
		var setGroupColumn = false;
		if(this.__nsGrid.hasAttribute("isSingleLevelGrouping"))
		{
			this.__isSingleLevelMode =  Boolean.parse(this.__nsGrid.getAttribute("isSingleLevelGrouping"));
		}
		if(this.__nsGrid.hasAttribute("multiLevelGroupColumn"))
		{
			this.__multiLevelGroupColumn = this.__nsGrid.getAttribute("multiLevelGroupColumn");
			if(this.__multiLevelGroupColumn)
			{
				if(this.__multiLevelGroupColumn.dataField)
				{
					this.__groupColumnFieldName = this.__multiLevelGroupColumn.dataField;
				}
				else
				{
					this.__multiLevelGroupColumn.dataField = this.__groupColumnFieldName;
				}
				if(!this.__multiLevelGroupColumn.groupRenderer)
				{
					this.__multiLevelGroupColumn.groupRenderer = this.__groupTextRenderer.bind(this);
				}
			}
			else
			{
				setGroupColumn = true;
			}
		}
		else
		{
			setGroupColumn = true;
		}
		if(setGroupColumn)
		{
			this.__multiLevelGroupColumn = {headerText:"Group",dataField:this.__groupColumnFieldName,width:"100px",enableFilter:true,groupRenderer:this.__groupTextRenderer.bind(this)};
		}
	};
	
	NSGroupingGrid.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty) 
	{
		var attributeName = attrName.toLowerCase();
		if(attributeName === "groupbyfield")
		{
			this.__nsGrid.__groupByField = newVal;
			this.__nsGrid.dataSource(this.__nsGrid.__dataSource,true);
		}
	};
	
	NSGroupingGrid.prototype.dataSource = function(source)
	{
		if(this.__nsGrid.__groupByField && this.__nsGrid.__groupByField.length > 0)
		{
			var arrGroupField = this.__nsGrid.__groupByField.split(",");
			var setting = {childField:this.__nsGrid.__childField,parentLevelIndicatorField:this.__nsGrid.__isParentRowField,isSingleLevel:this.__isSingleLevelMode,groupField:this.__multiLevelGroupColumn.dataField,childrenCountField:this.__childrenCountField};
			var groupCollection = new this.util.groupCollection(this.__nsGrid.__dataSource,setting);
			this.__groupSource = groupCollection.groupBy(arrGroupField);
			if(this.__groupSource)
			{
				this.__nsGrid.__arrWrapper = this.__groupSource.slice(0);
				this.__nsGrid.__arrFilteredGroupedSource =  this.__groupSource.slice(0);
				this.__setWrapperSource(this.__nsGrid.__arrWrapper,0,-1,0,true);
			}
			else
			{
				this.__nsGrid.__arrWrapper = [];
				this.__nsGrid.__arrFilteredGroupedSource =  [];
			}
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
		}
	};
	
	NSGroupingGrid.prototype.addItemsAsChildren = function(item,arrChildren)
	{
	};
	
	NSGroupingGrid.prototype.afterGridRendered = function()
	{
	};
	
	NSGroupingGrid.prototype.arrowClickHandler = function(parentItem,isCollapse) 
	{
	};
	
	NSGroupingGrid.prototype.expandCollapseHandler = function(item,isCollapse)
	{
	};
	
	NSGroupingGrid.prototype.__createBody = function()
	{
	};
	
	NSGroupingGrid.prototype.__createBodyBody= function(dataSet,startIndex,endIndex)
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
	
	NSGroupingGrid.prototype.__setSourceForAsync= function()
	{
		this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0);
	};
	
	NSGroupingGrid.prototype.__createRowAsync= function(item,index,array)
	{
		this.__createRow(item);
	};
	
	NSGroupingGrid.prototype.__createBodyBodyVirtual= function(dataSet,totalRows,level)
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
	
	NSGroupingGrid.prototype.__checkForAdditionalColumns = function()
	{
		var colArrow = {};
		if(this.__isSingleLevelMode)
		{
			colArrow.headerText = "";
			colArrow.dataField = this.__fieldColNameArrow;
			colArrow.width = "50px";
			colArrow.enableFilter = false;
		}
		else
		{
			colArrow = this.__multiLevelGroupColumn;
			var arrGroupField = this.__nsGrid.__groupByField.split(",");
			for(var count = 0;count < arrGroupField.length;count++)
			{
				var field = arrGroupField[count];
				var objField = this.__nsGrid.__getColumnObjectByDataField(field,this.__nsGrid.__orignalColumns);
				if(objField)
				{
					objField[this.__nsGrid.__fieldColVisible] = false;
				}
			}
		}
		colArrow.sortable = false;
		colArrow.sortDescending = true;
		colArrow.draggable = false;
		colArrow.resizable = true;
		colArrow.isExportable = false;
		colArrow.enableEditable = false;
		
		this.__nsGrid.__orignalColumns.splice(0, 0, colArrow);
	};
	
	NSGroupingGrid.prototype.__setMeasurement = function()
	{
	};
	
	NSGroupingGrid.prototype.__addSVGInPage = function(objSVG)
	{
		var minusID = "svgMinus";
		var minusRect = objSVG.createRect(minusID + "Rect",0,0,10,2,null);
		objSVG.addElementInSymbol(minusID,"0 0 16 16",minusRect);
		var plusID = "svgPlus";
		objSVG.addPath(plusID,this.__ARROW_COLLAPSE_PATH,"0 0 16 16");
	};
	
	NSGroupingGrid.prototype.__setWrapperSource = function(source,offset,parentIndex,level,setFieldIndex)
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
					this.__setRowItemProperty(item,parentIndex,level,setFieldIndex);
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
					this.__setRowItemProperty(item,parentIndex,level,setFieldIndex);
				}
			}
		}
	};
	
	/*useVisibleIndex flag is used when we want to use visible index,generally true for all cases except for expandCollapse all due to performance issues*/  
	NSGroupingGrid.prototype.__resetDataInBody= function(fromIndex,toIndex,fromRowIndex,useVisibleIndex)
	{
		if(!fromRowIndex)
		{
			fromRowIndex = 0;
		}
		if(!useVisibleIndex)
		{
			useVisibleIndex = false;
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
	
	NSGroupingGrid.prototype.__updateCellText = function(row,cell,item,colItem,rowIndex,colIndex)
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
	
	NSGroupingGrid.prototype.__getFlatSource = function()
	{
		return this.__nsGrid.__arrFlatHierarchicalSource;
	};
	
	NSGroupingGrid.prototype.__isCellEditable = function(objColumn,item,cell,cellIndex,row,rowIndex)
	{
		if(item && item[this.__nsGrid.__fieldHasChild] > 0)
		{
			return false;
		}
		return true;
	};
	
	NSGroupingGrid.prototype.__handleOnDemandClick = function(item,event)
	{
	};
	
	/********************************End of Common Functions for Grid ****************************************/
	NSGroupingGrid.prototype.__createRow = function(item,itemIndex,isAdd)
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
	
	NSGroupingGrid.prototype.__updateRow = function(row,item)
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
	
	NSGroupingGrid.prototype.__setRowItemProperty = function(item,parentIndex,level,setFieldIndex)
	{
		if(item)
		{
			var totalRowCount = this.__rowCounter;
			if(setFieldIndex)
			{
				item[this.__nsGrid.__fieldIndex] = totalRowCount;
			}
			item[this.__nsGrid.__fieldVisibleIndex] = totalRowCount;
			item[this.__nsGrid.__fieldRowLevel] = level;
			var hasChild = false;
			if(item.hasOwnProperty(this.__nsGrid.__childField) && item[this.__nsGrid.__childField] && item[this.__nsGrid.__childField].length > 0)
		    {
		    	hasChild = true;
		    	this.__setWrapperSource(item[this.__nsGrid.__childField],0,totalRowCount,level + 1,setFieldIndex);
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
			item[this.__nsGrid.__fieldRowVisible] = true;
			item[this.__nsGrid.__fieldIsCollapsed] = false;
		}
	};
	
	NSGroupingGrid.prototype.__setBodyCellProperty = function(row,cell,cellDiv,item,currentIndex,colItem,colIndex,parentIndex,level)
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
	        	if(this.__nsGrid.__showExpandCollapseIcon)
	        	{
	        		this.util.addStyleClass(cellText,"nsGroupCellText");
	        	}
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
	
	NSGroupingGrid.prototype.__createArrow = function(compArrow,objSVG,arrowID,isCollapsed,item,colItem)
	{
		 compArrow.style.paddingTop = "0px";
		 if(this.__nsGrid.__isRowExpansionIconCustom())
		 {
			 this.__setArrowDirection(compArrow,isCollapsed,colItem);
		 }
		 else
		 {
			 var classArrow = "nsGridGroupIcon"; 
			 var svg = objSVG.addSVG(compArrow,arrowID + "svg","nsGridGroupSVG",null,null,null,null,null,null,true);
			 this.util.addStyleClass(svg,classArrow);
			 this.util.addStyleClass(svg,classArrow + "Theme");
			 if(isCollapsed)
			 {
				 objSVG.addUse(svg,arrowID + "use",null,"#svgPlus");
			 }
			 else
			 {
				 objSVG.addUse(svg,arrowID + "use",null,"#svgMinus");
			 }
		 }
	};
	
	NSGroupingGrid.prototype.__setArrowDirection = function(compArrow,isCollapsed,colItem)
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
				objSVG.changeUseHref(useID,"#svgPlus");
			}
			else
			{
				objSVG.changeUseHref(useID,"#svgMinus");
			}
		}
	};
	
	NSGroupingGrid.prototype.__resetRow = function(row,item)
	{
		var index = item[this.__nsGrid.__fieldIndex];
		row.style.display = "";
		row.setAttribute("ns-index",index);
		item[this.__nsGrid.__fieldRowHtml] = row;
		this.__updateRow(row,item);
	};
	
	NSGroupingGrid.prototype.__addRowsforScrollPagination = function(fromRecord,toRecord,pageSize)
	{
		//console.log("In __addRowsforScrollPagination " + fromRecord + "," + toRecord + "," + pageSize);
		var arrArray = this.__nsGrid.__arrFlatHierarchicalSource.slice(fromRecord,toRecord + 1); 
		this.__nsGrid.__addRemoveRowCallInternal = true;
		this.__nsGrid.addRows(arrArray);
	};
	
	NSGroupingGrid.prototype.__addRowsforPagePagination = function(fromRecord,toRecord,pageSize)
	{
		//slice returns index range from fromRecord to toRecord - 1 hence adding 1 
		//this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(fromRecord,toRecord + 1);
		this.__nsGrid.__resetDataInBody(fromRecord,toRecord);
	};
	
	NSGroupingGrid.prototype.__groupTextRenderer = function(data,dataField,rowIndex,columnIndex,row,arrChildren,childrenCount,arrAllChildItems,groupLevel)
	{
		if(data && data.hasOwnProperty(dataField))
		{
			var innerHTML = "<span>" + data[dataField];
			if(childrenCount)
			{
				innerHTML += " &#40;" + childrenCount + "&#41;";
			}
			innerHTML += "</span>";
			return innerHTML;
		}
		return "";
	};
	
	return NSGroupingGrid;
})();
nsModuleExport(__nsGlobal,"NSGroupingGrid",NSGroupingGrid);
