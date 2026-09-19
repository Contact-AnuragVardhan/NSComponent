"use strict"; 
var NSFlatGrid = (function()
{
	function NSFlatGrid(nsGrid,nsUtil) 
	{
		this.__nsGrid = nsGrid;
		this.util = nsUtil;
	}
	/********************************Common Functions for Grid ****************************************/
	NSFlatGrid.prototype.__initialize = function ()
	{
		
	};
	
	
	NSFlatGrid.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty) 
	{
		var attributeName = attrName.toLowerCase();
		if(attributeName === "pagesize" && parseInt(newVal) > 0)
		{
			this.__nsGrid.__pageSize = parseInt(newVal);
			this.__nsGrid.dataSource(this.__nsGrid.__dataSource,true);
		}
	};
	
	NSFlatGrid.prototype.dataSource = function(source)
	{
		this.__nsGrid.__arrWrapper = this.__nsGrid.__dataSource.slice(0);
		this.__nsGrid.__arrFilteredGroupedSource = this.__nsGrid.__arrWrapper.slice(0);
		this.__setWrapperSource(this.__nsGrid.__arrWrapper,0,-1,0,true);
		if(this.__nsGrid.__enablePagination)
		{
			/*if(!this.__nsGrid.__isPaginationTypeScroll)
			{
				this.__nsGrid.__createPaginationControl(this.__nsGrid.__divOuterContainer);
			}*/
			if(this.__nsGrid.__isPaginationModeAuto)
			{
				this.__nsGrid.__updateTotalRecords(this.__nsGrid.__arrWrapper.length);
				if(this.__nsGrid.__isPaginationTypeScroll)
				{
					this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(0);//this.__nsGrid.__arrWrapper.slice(0,this.__nsGrid.__INFINITE_SCROLL_INITIAL_LOAD);
					this.__nsGrid.__paginationFetchRecordCallBack = this.__addRowsforScrollPagination.bind(this);
				}
				else 
				{
					this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(0);
					this.__nsGrid.__paginationFetchRecordCallBack = this.__addRowsforPagePagination.bind(this);
				}
			}
			else
			{
				this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(0);
				this.__nsGrid.__updateTotalRecords();
			}
		}
		else
		{
			this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(0);
			this.__nsGrid.__updateTotalRecords();
		}
	};
	
	NSFlatGrid.prototype.addItemsAsChildren = function(item,arrChildren)
	{
	};
	
	NSFlatGrid.prototype.afterGridRendered = function()
	{
	};
	
	NSFlatGrid.prototype.arrowClickHandler = function(parentItem,isCollapse) 
	{
	};
	
	NSFlatGrid.prototype.expandCollapseHandler = function(item,isCollapse)
	{
	};
	
	NSFlatGrid.prototype.__createBody = function()
	{
	};
	
	NSFlatGrid.prototype.__createBodyBody= function(dataSet,startIndex,endIndex)
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
	
	NSFlatGrid.prototype.__setSourceForAsync= function()
	{
		this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(0);
	};
	
	NSFlatGrid.prototype.__createRowAsync= function(item,index,array)
	{
		this.__createRow(item);
	};
	
	NSFlatGrid.prototype.__createBodyBodyVirtual= function(dataSet,totalRows)
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
	
	NSFlatGrid.prototype.__checkForAdditionalColumns = function()
	{
	};
	
	NSFlatGrid.prototype.__addSVGInPage = function(objSVG)
	{
	};
	
	NSFlatGrid.prototype.__setMeasurement = function()
	{
		
	};
	
	NSFlatGrid.prototype.__resetDataInBody= function(fromIndex,toIndex)
	{
		var row = null;
		var item = null;
		var arrRows = this.__nsGrid.__tblCenterBodyBody.rows;
		var rowLength = arrRows.length;
		var length = this.__nsGrid.__arrInternalSource.length;
		var rowCount = 0;
		for(var count = fromIndex; count < length; count++)
	    {
			if(rowLength <= rowCount) 
			{
				break;
			}
			row = arrRows[rowCount];
			item = this.__nsGrid.__arrInternalSource[count];
			if(item)
			{
				this.__resetRow(row,item[this.__nsGrid.__fieldIndex],item);
				rowCount++;
			}
	    }
		for(var rowIndex = rowCount;rowIndex < rowLength;rowIndex++)
		{
			row = arrRows[rowIndex];
			row.style.display = "none";
			row.setAttribute("ns-index",null);
		}
	};
	
	NSFlatGrid.prototype.__setWrapperSource = function(source,offset,parentIndex,level,setFieldIndex)
	{
		if(source)
		{
			if(!offset)
			{
				offset = 0;
			}
			var length = source.length;;
			var count = 0;
			var item = null;
			var index = -1; 
			if(this.__nsGrid.__renderInCachedMode)
			{
				for (count = 0; count < length; count++) 
				{
					item = source[count];
					index = offset + count;
					this.__setRowItemProperty(item,index,setFieldIndex);
					var colLength = this.__nsGrid.__columns.length;
					var arrCellsText = [];
					for (var colIndex = 0; colIndex < colLength; colIndex++)
			        {
			        	var colItem = this.__nsGrid.__columns[colIndex];
			            var cellDiv = this.util.createDiv(null);
			            this.util.addStyleClass(cellDiv,this.__nsGrid.__CLASS_CELL_CHILD);
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
					index = offset + count;
					this.__setRowItemProperty(item,index,setFieldIndex);
				}
			}
		}
	};
	
	NSFlatGrid.prototype.__updateCellText = function(row,cell,item,colItem,rowIndex,colIndex)
	{
		if(cell && item && colItem)
		{
			this.util.removeAllChildren(cell);
			if(this.__nsGrid.__renderInCachedMode)
	    	{
	    		this.__renderCellHTML(row,cell,item,colItem,colIndex);
	    	}
	    	else
	    	{
	    		 this.__renderCellNormal(row,cell,item,colItem,colIndex);
	    	}
		}
	};
	
	NSFlatGrid.prototype.__getFlatSource = function(onlySource)
	{
		return this.__nsGrid.__arrWrapper;
	};
	
	NSFlatGrid.prototype.__isCellEditable = function(objColumn,item,cell,cellIndex,row,rowIndex)
	{
		return true;
	};
	
	NSFlatGrid.prototype.__handleOnDemandClick = function(item,event)
	{
	};
	
	/********************************Common Functions for Grid ****************************************/
	NSFlatGrid.prototype.__createRow = function(item,itemIndex,isAdd)
	{
		if(item)
		{
			isAdd = this.util.isUndefinedOrNull(isAdd) ? true : Boolean.parse(isAdd);
			var row = document.createElement("TR");
			var index = item[this.__nsGrid.__fieldIndex];
			row.setAttribute("ns-index",index);
			item[this.__nsGrid.__fieldRowHtml] = row;
			this.__nsGrid.__setBodyRowProperty(row,item,index);
			this.__nsGrid.__applyCustomClass(row,"bodyRow");
			var colLength = this.__nsGrid.__columns.length;
			for (var colIndex = 0; colIndex < colLength; colIndex++)
		    {
		    	var colItem = this.__nsGrid.__columns[colIndex];
		    	var cell =  this.__nsGrid.__createBodyRowCell(row,colIndex,false);
		    	if(this.__nsGrid.__renderInCachedMode)
		    	{
		    		this.__renderCellHTML(row,cell,item,colItem,colIndex);
		    	}
		    	else
		    	{
		    		 this.__renderCellNormal(row,cell,item,colItem,colIndex);
		    	}
		    	this.__nsGrid.__setBodyCellProperties.bind(this.__nsGrid)(cell);
		    }
			if(isAdd)
			{
				var addRow = true;
				if(!this.util.isUndefinedOrNull(itemIndex) && itemIndex > -1 && this.__nsGrid.__tblCenterBodyBody.children 
						&& this.__nsGrid.__tblCenterBodyBody.children.length > itemIndex)
				{
					var prevRow = this.__nsGrid.__tblCenterBodyBody.children[itemIndex]; //this.__nsGrid.__getRowByIndex(itemIndex);
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
	
	NSFlatGrid.prototype.__renderCellNormal = function(row,cell,item,colItem,colIndex)
	{
		 var cellDiv = this.util.createDiv(null);
	     this.util.addStyleClass(cellDiv,this.__nsGrid.__CLASS_CELL_CHILD);
	     this.__nsGrid.__addCellText(row,item,cellDiv,colItem,colIndex);
	     //this.__nsGrid.__highlightDiv(cellDiv,colIndex);
	     cell.appendChild(cellDiv);
	};
	
	NSFlatGrid.prototype.__renderCellHTML = function(row,cell,item,colItem,colIndex)
	{
		var arrCellsText = item[this.__nsGrid.__fieldCellText];
		cell.innerHTML = arrCellsText[colIndex].outerHTML;
		//this.__nsGrid.__highlightDiv(cell.firstChild,colIndex);
	};
	
	NSFlatGrid.prototype.__updateRow = function(row,item)
	{
		if(row && item)
		{
			if(item[this.__nsGrid.__fieldSelected])
			{
				this.util.addStyleClass(row,this.__nsGrid.__CLASS_SELECTED_ROW);
			}
			else
			{
				this.util.removeStyleClass(row,this.__nsGrid.__CLASS_SELECTED_ROW);
			}
			var index = item[this.__nsGrid.__fieldIndex];
			var cells = row.cells;
			for (var colIndex = 0; colIndex < this.__nsGrid.__columns.length; colIndex++)
	        {
				var cell = cells[colIndex];
	        	var colItem = this.__nsGrid.__columns[colIndex];
	        	this.__updateCellText(row,cell,item,colItem,index,colIndex);
	        }
		}
	};
	
	NSFlatGrid.prototype.__setRowItemProperty = function(item,rowIndex,setFieldIndex)
	{
		if(item)
		{
			if(setFieldIndex)
			{
				item[this.__nsGrid.__fieldIndex] = rowIndex;
			}
			item[this.__nsGrid.__fieldVisibleIndex] = rowIndex + 1;
			item[this.__nsGrid.__fieldRowVisible] = true;
		}
	};
	
	NSFlatGrid.prototype.__resetRow = function(row,index,item)
	{
		row.style.display = "";
		row.setAttribute("ns-index",index);
		item[this.__nsGrid.__fieldRowHtml] = row;
		this.__updateRow(row,item);
	};
	
	NSFlatGrid.prototype.__addRowsforScrollPagination = function(fromRecord,toRecord,pageSize)
	{
		//console.log("In __addRowsforScrollPagination " + fromRecord + "," + toRecord + "," + pageSize);
		var arrArray = this.__nsGrid.__arrInternalSource.slice(fromRecord,toRecord + 1); 
		this.__nsGrid.__addRemoveRowCallInternal = true;
		this.__nsGrid.addRows(arrArray);
	};
	
	NSFlatGrid.prototype.__addRowsforPagePagination = function(fromRecord,toRecord,pageSize)
	{
		//slice returns index range from fromRecord to toRecord - 1 hence adding 1 
		//this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(fromRecord,toRecord + 1);
		this.__nsGrid.__resetDataInBody(fromRecord,toRecord);
	};
	
	return NSFlatGrid;
})();
nsModuleExport(__nsGlobal,"NSFlatGrid",NSFlatGrid);
