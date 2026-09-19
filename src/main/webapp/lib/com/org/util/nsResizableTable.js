"use strict";
/*https://www.brainbell.com/javascript/making-resizable-table-js.html*/
var NSResizableTable = (function()
{
	function NSResizableTable(table,setting,doc)
	{
		this.__table = table;
		this.__setting = setting;
		this.__doc = doc;
		this.util = new NSUtil();	
		
		this.__config = null;
		this.__dom = null;
	    this.__id = null;
	    this.__origTableProp = {};
	    this.__arrResizer = [];
	    this.__objDrag = null;
	    this.__initialize();
	};
	
	NSResizableTable.prototype.__initialize = function()
	{
		if(this.util.hasStyleClass(this.__table,"nsResizableTable"))
		{
			this.util.warning("NSResizableTable","Table has already been processed");
			return;
		}
		this.__dom = this.util.getDomVariables();
		this.__setSetting();
		this.util.addStyleClass(this.__table,"nsResizableTable");
		this.__initCols();
	};
	
	NSResizableTable.prototype.__setSetting = function()
	{
		var setting = this.__setting ? this.__setting : {};
		this.__config = {
				getRowCallback: setting["getRowCallback"]
		}
	};
	
	NSResizableTable.prototype.__initCols = function()
	{
		var table = this.__table;
		var row = table.getElementsByTagName("tr")[0];
		if(this.__config.getRowCallback)
		{
			row = this.__config.getRowCallback(table,this)
		}
		var arrCols = row ? row.children : null;
		if(arrCols)
		{
			this.__origTableProp["overflow"] = table.style.overflow;
			table.style.overflow = "hidden";
			var tableHeight = table.offsetHeight;
			for (var count=0;count < arrCols.length;count++)
			{
				var col = arrCols[count];
				var resizer = this.__createResizer(count,tableHeight);
				col.appendChild(resizer);
				this.util.addStyleClass(col,"nsResizableTableColumn");
				this.__addEventToResizer(resizer);
				this.__arrResizer.push(resizer);
			}
		}
	};
	
	NSResizableTable.prototype.__createResizer = function(colIndex,height)
	{
		var doc = this.__doc || this.__dom.doc;
		var id = this.__getID() + "_col" + colIndex;
		var resizer = this.util.createDiv(id,"nsColumnResizer",doc);
		resizer.style.height = height + "px";
		return resizer;
	};
	
	NSResizableTable.prototype.__addEventToResizer = function(resizer)
	{
		var self = this;
		var resizeEventHandler = function(event)
		{
			event = self.util.getEvent(event);
			event.stopPropagation();
			event.preventDefault();
			event.stopImmediatePropagation();
		};
		this.util.addEvent(resizer,"mousedown touchstart",this.__resizerMouseDownHandler.bind(this,resizer));
		this.util.addEvent(resizer,"click",resizeEventHandler);
		this.util.addEvent(resizer,"dblclick",resizeEventHandler);
		this.util.addEvent(resizer,"mouseover",this.__resizerMouseOverHandler.bind(this,resizer));
		this.util.addEvent(resizer,"mouseout",this.__resizerMouseOutHandler.bind(this,resizer));
	};
	
	NSResizableTable.prototype.__resizerMouseDownHandler = function(resizer,event)
	{
		event = this.util.getEvent(event);
		var doc = this.__doc || this.__dom.doc;
		resizer = event.target;
		this.__objDrag = {dragging: true,resizer: resizer};
		this.__objDrag.resizerMouseMove = this.__resizerMouseOverHandler.bind(this,resizer);
		this.__objDrag.resizerMouseUp = this.__resizerMouseOutHandler.bind(this,resizer);
		this.util.addEvent(resizer,"mouseover",this.__objDrag.resizerMouseMove);
		this.util.addEvent(resizer,"mouseout",this.__objDrag.resizerMouseUp);
		this.__objDrag.docMouseMove = this.__docMouseMoveHandler.bind(this,resizer);
		this.__objDrag.docMouseUp = this.__docMouseUpHandler.bind(this,resizer);
		this.util.addEvent(doc,"mousemove touchmove",this.__objDrag.docMouseMove);
		this.util.addEvent(doc,"mouseup",this.__objDrag.docMouseUp);
		this.__objDrag.currentColumn = event.target.parentElement;
		this.__objDrag.nextColumn = this.__objDrag.currentColumn.nextElementSibling;
		this.__objDrag.pageX = event.pageX; 
		var padding = this.__getPaddingDiff(this.__objDrag.currentColumn);
		this.__objDrag.currentColumnWidth = this.__objDrag.currentColumn.offsetWidth - padding;
		if (this.__objDrag.nextColumn)
		{
			this.__objDrag.nextColumnWidth = this.__objDrag.nextColumn.offsetWidth - padding;
		}
		var item = {column: this.__objDrag.currentColumn,index: this.__objDrag.currentColumn.cellIndex};
		this.__dispatchEvent(NSResizableTable.COLUMN_RESIZING_START,item,item);
	};
	
	NSResizableTable.prototype.__resizerMouseOverHandler = function(resizer,event)
	{
		//if(this.__objDrag && this.__objDrag.dragging)
		//{
			event = this.util.getEvent(event);
			this.util.addStyleClass(event.target,"nsColumnResizerMoving");
		//}
	};
	
	NSResizableTable.prototype.__resizerMouseOutHandler = function(resizer,event)
	{
		//if(this.__objDrag && this.__objDrag.dragging)
		//{
			event = this.util.getEvent(event);
			this.util.removeStyleClass(event.target,"nsColumnResizerMoving");
		//}
	};
	
	NSResizableTable.prototype.__docMouseMoveHandler = function(resizer,event)
	{
		if(this.__objDrag && this.__objDrag.dragging)
		{
			event = this.util.getEvent(event);
			if(this.__objDrag.currentColumn)
			{
				this.util.makeBodyUnselectable();
				var diffX = event.pageX - this.__objDrag.pageX;
				if(this.__objDrag.nextColumn)
				{
					this.__objDrag.nextColumn.style.width = (this.__objDrag.nextColumnWidth - diffX) + "px";
				}
				this.__objDrag.currentColumn.style.width = (this.__objDrag.currentColumnWidth + diffX) + "px";
				var item = {column: this.__objDrag.currentColumn,index: this.__objDrag.currentColumn.cellIndex};
				this.__dispatchEvent(NSResizableTable.COLUMN_RESIZING,item,item);
			}
		}
	};
	
	NSResizableTable.prototype.__docMouseUpHandler = function(resizer,event)
	{
		if(this.__objDrag)
		{
			event = this.util.getEvent(event);
			var doc = this.__doc || this.__dom.doc;
			this.util.removeEvent(this.__objDrag.resizer,"mouseover",this.__objDrag.resizerMouseMove);
			this.util.removeEvent(this.__objDrag.resizer,"mouseout",this.__objDrag.resizerMouseUp);
			this.util.removeEvent(doc,"mousemove touchmove",this.__objDrag.docMouseMove);
			this.util.removeEvent(doc,"mouseup",this.__objDrag.docMouseUp);
			this.util.makeBodySelectable();
			var currentColumn = this.__objDrag.currentColumn;
			this.__objDrag = null;
			event.stopImmediatePropagation();
			var item = {column: currentColumn,index: currentColumn.cellIndex};
			this.__dispatchEvent(NSResizableTable.COLUMN_RESIZING_END,item,item);
		}
	};
	
	/*********************************Start of Util Function*******************************/
	NSResizableTable.prototype.__getID = function()
	{
		if(!this.__id)
		{
			this.__id = "compResizableTable" + this.util.getUniqueId();
		}
		return this.__id;
	};
	
	NSResizableTable.prototype.__getPaddingDiff = function(column)
	{
		if (this.util.getStyleValue(column,"box-sizing") == "border-box")
		{
			return 0;
		}
		var padLeft = this.util.getStyleValue(column,"padding-left");
		var padRight = this.util.getStyleValue(column,"padding-right");
		return (parseInt(padLeft) + parseInt(padRight));
	 };
	 
	 NSResizableTable.prototype.__dispatchEvent = function(eventType,data,param,bubbles,cancelable)
	 {
		this.util.dispatchEvent(this.__table,eventType,data,param,bubbles,cancelable);
	 };
	/*********************************End of Util Function*******************************/
	
	NSResizableTable.prototype.destroy = function()
	{
		for(var key in this.__origTableProp)
		{
			this.__table.style[key] = this.__origTableProp[key];
		}
		this.__origTableProp = {};
	};
	
	NSResizableTable.COLUMN_RESIZING_START = "columnResizingStart";
	NSResizableTable.COLUMN_RESIZING = "columnResizing";
	NSResizableTable.COLUMN_RESIZING_END = "columnResizingEnd";
	
	return NSResizableTable;
})();
nsModuleExport(__nsGlobal,"NSResizableTable",NSResizableTable);