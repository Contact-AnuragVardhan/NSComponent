"use strict"; 
var NSTableUtil = (function()
{
	function NSTableUtil(doc,win) 
	{		
		var self = this;
		var util = new NSUtil();
		var dom = util.getDomVariables();
		
		this.doc = doc || dom.doc;
		this.win = win || dom.window;
		
		this.getRowsCount = function(table) 
		{
	        return table.rows.length;
	    };
	    
	    this.getColumnsCount = function(table) 
	    {
	    	var arrFlatRows = getFlattenRows(table);
	        var colCount = arrFlatRows.reduce(function(total,cells,currentIndex,arr) 
	        {
	            return Math.max(total, cells.length);
	        },0);
	        return colCount;
	    };
	    
	    //appendRow
	    this.insertRow = function(table,rowReference,isInsertBelow,callback) 
	    {
	    	var arrRet = [];
	    	var row = null;
	        if (!rowReference) 
	        {
	            var colCount = this.getColumnsCount(table);
	            row = this.doc.createElement("tr");
	            for (var colIndex = 0;colIndex < colCount; colIndex++) 
	            {
	            	var cell = this.doc.createElement("td");
	            	callback && callback(cell,row,table,colIndex,rowReference,isInsertBelow);
	                row.appendChild(cell);
	                arrRet.push(cell);
	            }
	        }
	        else 
	        {
	            row = rowReference.cloneNode(true);
	            var arrCells = rowReference.querySelectorAll("td,th");
	            for (var colIndex = 0;colIndex < arrCells.length; colIndex++) 
	            {
	            	var cell = arrCells[colIndex];
	            	var rowspan = cell.getAttribute("rowspan");
	                if (rowspan && parseInt(rowspan, 10) > 1) 
	                {
	                    var newRowSpan = parseInt(rowspan, 10) - 1;
	                    if(newRowSpan > 1)
	                    {
	                    	cell.getAttribute("rowspan",newRowSpan);
	                    }
	                }
	            }
	            arrCells = row.querySelectorAll("td,th");
	            for (var colIndex = 0;colIndex < arrCells.length; colIndex++) 
	            {
	            	var cell = arrCells[colIndex];
	            	util.removeAllChildren(cell);
	            	callback && callback(cell,row,table,colIndex,rowReference,isInsertBelow);
	                arrRet.push(cell);
	            }
	        }
	        if (isInsertBelow && rowReference && rowReference.nextSibling) 
	        {
	            if(rowReference.parentNode)
	            {
	            	var parent = rowReference.parentNode;
	            	parent.insertBefore(row,rowReference.nextSibling);
	            }
	                
	        }
	        else if (!isInsertBelow && rowReference) 
	        {
	        	if(rowReference.parentNode)
	            {
	            	var parent = rowReference.parentNode;
	            	parent.insertBefore(row,rowReference);
	            }
	        }
	        else 
	        {
	        	var ref = table;
	        	if(table.tBodies && table.tBodies.length)
	        	{
	        		ref = table.tBodies[0];
	        	}
	        	ref.appendChild(row);
	        }
	        return {row: row,cells: arrRet};
	    };
		
		this.removeRow = function(table,rowIndex,callback) 
		{
			var arrRet = [];
			var arrFlatRows = getFlattenRows(table);
			var row = table.rows[rowIndex];
			var arrCells = arrFlatRows[rowIndex];
			for(var colIndex = 0;colIndex < arrCells.length;colIndex++)
			{
				var cell = arrCells[colIndex];
				var dec = false;
				if (rowIndex - 1 >= 0 && arrFlatRows[rowIndex - 1][colIndex] == cell) 
				{
	                dec = true;
	            }
				else if (arrFlatRows[rowIndex + 1] && arrFlatRows[rowIndex + 1][colIndex] === cell) 
				{
	                if (cell.parentNode == row && cell.parentNode.nextSibling) 
	                {
	                    dec = true;
	                    var nextCell = colIndex + 1;
	                    while (arrFlatRows[rowIndex + 1][nextCell] == cell) 
	                    {
	                        nextCell++;
	                    }
	                    var nextRow = util.findNextNode(cell.parentNode, function(element) 
	                    { 
	                    	return util.isElementOfType(element,"tr"); 
	                    },table,true);
	                    if (arrFlatRows[rowIndex + 1][nextCell]) 
	                    {
	                        nextRow.insertBefore(cell,arrFlatRows[rowIndex + 1][nextCell]);
	                    }
	                    else 
	                    {
	                        nextRow.appendChild(cell);
	                    }
	                }
	            }
	            else 
	            {
	            	callback && callback(cell,row,table,colIndex,rowIndex);
	            	removeNode(cell);
	            	arrRet.push(cell);
	            }
				if (dec && (cell.parentNode === row || cell !== arrFlatRows[rowIndex][colIndex - 1])) 
				{
	                var rowSpan = cell.rowSpan;
	                if (rowSpan - 1 > 1) 
	                {
	                    cell.setAttribute("rowspan", (rowSpan - 1).toString());
	                }
	                else 
	                {
	                    cell.removeAttribute("rowspan");
	                }
		        }
			}
			removeNode(row);
			return {row: row,cells: arrRet};
		};
		
		//appendColumn
		this.insertColumn = function(table,refIndex,isInsertAfter,callback)
		{
			var arrRet = [];
			var arrFlatRows = getFlattenRows(table);
	        if (util.isUndefinedOrNull(refIndex) || refIndex < 0) 
	        {
	            refIndex = getColumnsCount(table) - 1;
	        }
	        for (var rowCount = 0;rowCount < arrFlatRows.length;rowCount++) 
	        {
	            var cell = this.doc.createElement("td");
	            var refCell = arrFlatRows[rowCount][refIndex];
	            var isAdded = false;
	            if (isInsertAfter) 
	            {
	            	var newRefIndex = refIndex + 1;
	                if ((arrFlatRows[rowCount] && refCell && newRefIndex >= arrFlatRows[rowCount].length) || refCell !== arrFlatRows[rowCount][newRefIndex]) 
	                {
	                	var parent = refCell.parentNode;
	                	if(parent)
	                	{
	                		if (refCell.nextSibling) 
		                    {
	                			parent.insertBefore(cell,refCell.nextSibling);
		                    }
		                    else 
		                    {
		                    	parent.appendChild(cell);
		                    }
	                		isAdded = true;
	                	}
	                }
	            }
	            else 
	            {
	            	var newRefIndex = refIndex - 1;
	                if (newRefIndex < 0 || (arrFlatRows[rowCount][refIndex] !== arrFlatRows[rowCount][newRefIndex] && arrFlatRows[rowCount][refIndex].parentNode)) 
	                {
	                	var parent = refCell.parentNode;
	                	if(parent)
	                	{
	                		parent.insertBefore(cell,arrFlatRows[rowCount][refIndex]);
	                		isAdded = true;
	                	}
	                }
	            }
	            if(isAdded)
	            {
	            	callback && callback(cell,table,refIndex,isInsertAfter);
	            	arrRet.push(cell);
	            }
	            else 
	            {
	            	var refCell = arrFlatRows[rowCount][refIndex];
	            	var colspan = refCell.getAttribute("colspan");
	            	colspan = colspan ? parseInt(colspan,10) : 1;
	            	colspan++;
	            	refCell.setAttribute("colspan",colspan);
	            }
	        }
	        return arrRet;
		};
		
		this.removeColumn = function(table,colIndex,callback)
		{
			var arrRet = [];
			var arrFlatRows = getFlattenRows(table);
			for(var rowIndex = 0;rowIndex < arrFlatRows.length;rowIndex++)
			{
				var arrCells = arrFlatRows[rowIndex];
				var cell = arrCells[colIndex];
				var dec = false;
				if ((colIndex - 1) >= 0 && arrFlatRows[rowIndex][colIndex - 1] == cell) 
				{
	                dec = true;
	            }
	            else if ((colIndex + 1) < arrCells.length && arrFlatRows[rowIndex][colIndex + 1] == cell) 
	            {
	                dec = true;
	            }
	            else 
	            {
	            	callback && callback(cell,table,colIndex);
	            	removeNode(cell);
	            	arrRet.push(cell);
	            }
				if (dec && (rowIndex - 1 < 0 || cell !== arrFlatRows[rowIndex - 1][colIndex])) 
				{
	                var colspan = cell.colSpan;
	                colspan = (colspan - 1) > 1 ? (colspan - 1) : null;
	                if(colspan)
	                {
	                	cell.setAttribute("colspan",colspan);
	                }
	            }
			}
			return arrRet;
		};
		
		//splitVertical
		this.splitCellsVertical = function(arrCells,table)
		{
			for(var count = 0;count < arrCells.length;count++)
			{
				this.splitCellVertical(arrCells[count],table);
			}
			//Table.normalizeTable(table);
		};
		
		this.splitCellVertical = function(cell,table)
		{
			var objCell = getCoordinates(table,cell);
			 var objProp = {};
            if (cell.colSpan < 2) 
            {
            	getFlattenRows(table, function(paramCell,newRowIndex,newColIndex,colSpan,rowSpan) 
                {
                    if (objCell.rowIndex != newRowIndex && objCell.colIndex == newColIndex && paramCell != cell) 
                    {
                       storeProperties(paramCell,"colspan",paramCell.colSpan + 1, objProp);
                    }
                    return true;
                });
            }
            else 
            {
               storeProperties(cell,"colspan",cell.colSpan - 1,objProp);
            }
            var newCell = this.doc.createElement("td");
			var br = this.doc.createElement("br");
            newCell.appendChild(br);
            if (cell.rowSpan > 1) 
            {
               storeProperties(newCell,"rowspan",cell.rowSpan,objProp);
            }
            var cellWidth = cell.offsetWidth;
            util.insertAfterElement(cell,newCell);
            var calcWidth = cellWidth / table.offsetWidth / 2;
            storeProperties(cell,"width", (calcWidth * 100).toFixed(10) + '%', objProp);
            storeProperties(newCell,"width", (calcWidth * 100).toFixed(10) + '%', objProp);
            executeProperties(objProp);
            //instance(jodit).removeSelection(cell);
		};
		
		//splitHorizontal
		this.splitCellsHorizontal = function(arrCells,table)
		{
			for(var count = 0;count < arrCells.length;count++)
			{
				this.splitCellHorizontal(arrCells[count],table);
			}
			//Table.normalizeTable(table);
		};
		
		this.splitCellHorizontal = function(cell,table)
		{
			var newCell = this.doc.createElement("td");
			var br = this.doc.createElement("br");
            newCell.appendChild(br);
            var objCell = getCoordinates(table,cell);
            var objProp = {};
            if (cell.rowSpan < 2) 
            {
            	var row = util.findParent(cell,"tr");
            	var newRow = this.doc.createElement("tr");
                getFlattenRows(table, function(paramCell,newRowIndex,newColIndex,colSpan,rowSpan) 
                {
                    if (objCell.rowIndex == newRowIndex && objCell.colIndex != newColIndex && paramCell !== cell) 
                    {
                    	storeProperties(paramCell,"rowspan",paramCell.rowSpan + 1,objProp);
                    }
                    return true;
                });
                util.insertAfterElement(row,newRow);
                newRow.appendChild(newCell);
            }
            else 
            {
            	var parentRow = null;
                var afterCell = null;
            	storeProperties(cell,"rowspan",cell.rowSpan - 1,objProp);
                getFlattenRows(table, function(paramCell,newRowIndex,newColIndex,colSpan,rowSpan) 
                {
                    if (newRowIndex > objCell.rowIndex && newRowIndex < objCell.rowIndex + cell.rowSpan 
                    	&& objCell.colIndex > newColIndex && cell.parentNode.rowIndex == newRowIndex) 
                    {
                    	afterCell = paramCell;
                    }
                    if (objCell.rowIndex < newRowIndex && paramCell === cell) 
                    {
                    	parentRow = table.rows[newRowIndex];
                    }
                    return true;
                });
                if (afterCell) 
                {
                	util.insertAfterElement(afterCell,newCell);
                }
                else 
                {
                	parentRow.insertBefore(newCell,parentRow.firstChild);
                }
            }
            if (cell.colSpan > 1) 
            {
            	storeProperties(newCell,"colspan",cell.colSpan,objProp);
            }
            executeProperties(objProp);
            //instance(jodit).removeSelection(cell);
		};
		
		//__mark
		var storeProperties = function(cell,prop,propValue,objProp)
		{
			var cellID = cell.getAttribute("data-cell-util-id");
			if(!cellID)
			{
				cellID = util.getUniqueId();
				cell.setAttribute("data-cell-util-id",cellID);
			}
			if (!objProp[cellID]) 
			{
				objProp[cellID] = {cell: cell,objCellProps: {}};
	        }
			objProp[cellID].objCellProps[prop] = propValue;
		};
		
		//__unmark
		var executeProperties = function(objProp)
		{
			for(var cellID in objProp)
			{
				var cell = objProp[cellID].cell;
				var objCellProps = objProp[cellID].objCellProps;
				for(var prop in objCellProps)
				{
					var propValue =  objCellProps[prop];
					switch(prop) 
					{
	                    case "remove":
	                    	removeNode(cell);
	                    break;
	                    case "rowspan":
	                        (propValue > 1) ? cell.setAttribute("rowspan",propValue) : cell.removeAttribute("rowspan");
	                    break;
	                    case "colspan":
	                    	(propValue > 1) ? cell.setAttribute("colspan",propValue) : cell.removeAttribute("colspan");
	                    break;
	                    case "width":
	                        cell.style.width = propValue;
	                    break;
	                }
				}
				cell.removeAttribute("data-cell-util-id");
			}
		};
		
		//formalCoordinate
		var getCoordinates = function(table,cell,isMax)
		{
			isMax = Boolean.parse(isMax);
			var objRet = {rowIndex: 0,colIndex: 0,width: 1,height: 1};
			var callback = function(paramCell,newRowIndex,newColIndex,colSpan,rowSpan)
			{
				if (cell === paramCell) 
	            {
					objRet.rowIndex = newRowIndex;
					objRet.colIndex = newColIndex;
					objRet.width = colSpan || 1;
					objRet.height = rowSpan || 1;
	                if (isMax) 
	                {
	                	objRet.rowIndex += (rowSpan || 1) - 1;
	                	objRet.colIndex += (colSpan || 1) - 1;
	                }
	                return false;
	            }
				return true;
			};
	        getFlattenRows(table,callback);
	        return objRet;
		};
		
		//formalMatrix
		//returns rows and cells flattening considering colspan's and rowspan's
		// we don't need to handle hidden rows or width = 0 rows as rowIndex will handle it
		var getFlattenRows = function(table,callback) 
		{
	        var arrFlatRows = [[]];
	        if(table && table.rows)
	        {
	        	var arrRows = (table.rows.length) ? table.rows : Array.prototype.slice.call(table.rows);
	        	for(var rowCount = 0; rowCount < arrRows.length; rowCount++) 
	        	{
	        		var arrCells = (arrRows[rowCount].cells.length) ? arrRows[rowCount].cells : Array.prototype.slice.call(arrRows[rowCount].cells);
	                for(var colCount = 0; colCount < arrCells.length; colCount++) 
	                {
	                	var arrRowsTemp = getFlattenCells(arrFlatRows,table,arrCells[colCount],rowCount,callback);
	                	if(!arrRowsTemp)
	                	{
	                		return arrFlatRows;
	                	}
	                	arrFlatRows = arrRowsTemp;
	                	
	                }
	        	}
	        }
	        return arrFlatRows;
	    };
	    
	    var getFlattenCells = function(arrRows,table,cell,rowIndex,callback) 
		{
	    	if(!arrRows[rowIndex])
	    	{
	    		arrRows[rowIndex] = [];
	    	}
	    	var colSpan = cell.colSpan;
	    	var rowSpan = cell.rowSpan;
	    	var colIndex = 0;
	    	while(arrRows[rowIndex][colIndex]) 
	    	{
	    		colIndex++;
	        }
	    	for(var rowCount = 0; rowCount < rowSpan; rowCount++) 
	    	{
	            for(var colCount = 0; colCount < colSpan; colCount++) 
	            {
	                if (!arrRows[rowIndex + rowCount]) 
	                {
	                	arrRows[rowIndex + rowCount] = [];
	                }
	                var newRowIndex = rowIndex + rowCount;
	                var newColIndex = colIndex + colCount;
	                if (callback) 
	                {
	                	var value = callback(cell,newRowIndex,newColIndex,colSpan,rowSpan);
	                	if(!value)
	                	{
	                		return null;
	                	}
	                }
	                arrRows[newRowIndex][newColIndex] = cell;
	            }
	        }
	    	return arrRows;
		};
		
		var removeNode = function(node)
		{
			if (node && node.parentNode)
	    	{
	    		node.parentNode.removeChild(node);
	    	}
		};
	};
	
	return NSTableUtil;
})();
nsModuleExport(__nsGlobal,"NSTableUtil",NSTableUtil);