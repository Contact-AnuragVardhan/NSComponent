var NSTablePluggins = (function()
{
	var NSTablePluggins = function(nsEditor)
	{
		/*this.nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;*/
		this.__tblUtil = null;
		
		this.__objTables = {};
		this.__objUIFunc = null;
		
		this.__processedTableIDAttribute = "data-ns-editor-table-id";
		
		this.__rowSubMenu = [{key:"above",label:"Insert row above",toolTip:"Insert row above"},
							 {key:"below",label:"Insert row below",toolTip:"Insert row below"}];

		this.__columnSubMenu = [{key:"before",label:"Insert column before",toolTip:"Insert column before"},
					 			{key:"after",label:"Insert column after",toolTip:"Insert column after"}];
		
		this.__cellSubMenu = [{key:"mergeCells",label:"Merge cells",toolTip:"Merge cells"},
					  {key:"verticalSplit",label:"Vertical split",toolTip:"Vertical split"},
					  {key:"horizontalSplit",label:"Horizontal split",toolTip:"Horizontal split"}];
		
		this.__alignSubMenu = [{key:"top",label:"Top",toolTip:"Align Top"},
						  {key:"middle",label:"Middle",toolTip:"Align Middle"},
						  {key:"bottom",label:"Bottom",toolTip:"Align Bottom"},
						  {key:"normal",label:"Normal",toolTip:"Align Normal"},
						  {key:"left",label:"Left",toolTip:"Align Left"},
						  {key:"right",label:"Right",toolTip:"Align Right"},
						  {key:"center",label:"Center",toolTip:"Align Center"},
						  {key:"justify",label:"Justify",toolTip:"Align Justify"}];
		
		this.__removeSubMenu = [{key:"table",label:"Delete Table",toolTip:"Delete Table"},
							  {key:"row",label:"Delete Row",toolTip:"Delete Row"},
							  {key:"column",label:"Delete Column",toolTip:"Delete Column"},
							  {key:"cell",label:"Empty Cell",toolTip:"Empty Cell"}];
		
		this.__objMenu = null;
		
		this.CLASS_SELECTED_CELL = "nsEditorSelectedCell";
		
		this.initialize = function()
		{
			this.__objMenu = { remove: {html: "<i class=\"ns-icon ns-editor-trash\" aria-hidden=\"true\"></i>",toolTip:"Remove",subMenu:this.__removeSubMenu,subMenuClickHandler:this.__removeClickHandler.bind(this)},
							   row: {html: "<i class=\"ns-icon ns-editor-bars\" aria-hidden=\"true\"></i>",toolTip:"Row",subMenu:this.__rowSubMenu,subMenuClickHandler:this.__rowClickHandler.bind(this)},
							   column: {html: "<i class=\"ns-icon ns-editor-layout\" aria-hidden=\"true\"></i>",toolTip:"Column",subMenu:this.__columnSubMenu,subMenuClickHandler:this.__columnClickHandler.bind(this)},
							   cell: {html: "<i class=\"ns-icon ns-editor-square\" aria-hidden=\"true\"></i>",toolTip:"Cell",subMenu:this.__cellSubMenu,subMenuClickHandler:this.__cellClickHandler.bind(this)},
							   alignment: {html: "<i class=\"ns-icon ns-editor-align-left\" aria-hidden=\"true\"></i>",toolTip:"Alignment",subMenu:this.__alignSubMenu,subMenuClickHandler:this.__alignClickHandler.bind(this)},
							   header: {html: "<i class=\"ns-icon ns-editor-header\" aria-hidden=\"true\"></i>",toolTip:"Table Header",menuClickHandler:this.__headerClickHandler.bind(this)},
							 };
		};
		
		this.setSettings = function()
		{
			var tableSetting = this.nsEditor.__setting["tableSetting"];
			if(!tableSetting)
			{
				tableSetting = {};
			}
			var tableConfig = {};
			tableConfig = {
					enableColumnResize : this.util.isUndefinedOrNull(tableSetting["enableColumnResize"]) ? true : Boolean.parse(tableSetting["enableColumnResize"]),
			};
			this.nsEditor.__config["tableSetting"] = tableConfig;
		};
		
		this.componentsInitialized = function()
		{
			this.nsEditor.__listenInternalEvent("tableAdded", this.__initTable.bind(this));
			this.nsEditor.__listenInternalEvent("mousedown mouseup", this.__handleMouseEvents.bind(this));
			this.nsEditor.__listenInternalEvent("dblclick click", this.__handleClickEvents.bind(this));
			
			this.__tblUtil = new NSTableUtil(this.nsEditor.__getDocument(),this.nsEditor.__getWindow());
			this.__objUIFunc = this.nsEditor.__getUtilInstance("uiFunc","tablePluggins",this.name,this,null);
		};
		
		this.resized = function(event)
		{
			
		};
		
		this.destroy = function()
		{
			
		};
		
		this.getSelectedCells = function(table)
		{
			var arrCells = null;
			if(table)
			{
				arrCells = table.querySelectorAll("." + this.CLASS_SELECTED_CELL);
			}
			else
			{
				var textArea = this.nsEditor.__getTextArea();
				arrCells = textArea.querySelectorAll("." + this.CLASS_SELECTED_CELL);
			}
			return arrCells; 
		};
		
		this.__initTable = function(event)
		{
			if(this.editorUtil.isEditable())
			{
				if(event.detail && event.detail.table)
				{
					var table = event.detail.table;
					if(!table.hasAttribute(this.__processedTableIDAttribute))
					{
						var id = "compNSEditorTable" + this.util.getUniqueId();
						table.setAttribute(this.__processedTableIDAttribute,id);
						var resizableTable = this.__createResizableTable(table);
						var popUp = this.__createPopup(table);
						this.__objTables[id] = {table: table,resizableTable: resizableTable,popUp: popUp};
					}
				}
			}
		};
		
		this.__handleMouseEvents = function(event)
		{
			var item = event.detail;
			var element = item.element;
			var parentElement = item.parentElement;
			var orignalEvent = item.orignalEvent;
			var cell = this.editorUtil.isCell(element) ? element : (this.editorUtil.isCell(parentElement) ? parentElement : null);
			if(cell)
			{
				var table = this.util.findParent(cell,"TABLE");
				var id = table.getAttribute(this.__processedTableIDAttribute);
				if(id)
				{
					var popUp = this.__objTables[id].popUp;
					if(popUp)
					{
						switch(orignalEvent.type)
						{
							case "mousedown":
								popUp.hide();
							break;
							case "mouseup":
								this.__highlightCell(cell,table);
								this.selection.saveSelection();
								/*var offset = {left: -40,top: 17}
								popUp.show(cell,orignalEvent,offset);*/
								
								popUp.show(cell,orignalEvent);
							break;
						}
					}
				}
			}
		};
		
		this.__handleClickEvents = function(event)
		{
			
		};
		
		this.__clearTableSelectedCells = function(table)
		{
			var arrCells = this.getSelectedCells(table);
			for(var count = 0;count < arrCells.length;count++)
			{
				this.util.removeStyleClass(arrCells[count],this.CLASS_SELECTED_CELL);
			}
		};
		
		this.__highlightCell = function(cell,table)
		{
			var textArea = this.nsEditor.__getTextArea();
			this.__clearTableSelectedCells();
			if(cell)
			{
				this.util.addStyleClass(cell,this.CLASS_SELECTED_CELL);
			}
		};
		
		this.__createResizableTable = function(table)
		{
			var setting = {getRowCallback: this.__getRow.bind(this)};
			var nsResizableTable = new NSResizableTable(table,setting,this.nsEditor.__getDocument());
			return nsResizableTable;
		};
		
		this.__createPopup = function(table)
		{
			var setting = {title: "Edit Table",enableArrow: true,contentCallback: this.__getPopUpBody.bind(this,table)};
			var inlinePopUp = this.nsEditor.__getUtilInstance("inlinePopup","tablePopUp",this.name,this,setting);
			this.util.addEvent(table,"click",this.__tblClickHandler.bind(this));
			return inlinePopUp;
		};
		
		this.__tblClickHandler = function(event)
		{
			this.editorUtil.stopEvent(event);
		};
		
		this.__getRow = function(table,objResizableTable)
		{
			if(table && table.tBodies && table.tBodies.length > 0 && table.tBodies[0].rows && table.tBodies[0].rows.length > 0)
			{
				return table.tBodies[0].rows[0];
			}
			return null;
		};
		
		this.__getPopUpBody = function(table,container,objPopup,objTablePluggin)
		{
			var index = 0;
			for(var key in this.__objMenu)
			{
				var item = this.__objMenu[key];
				var arrSubMenu = null;
				if(index % 3 == 0)
				{
					var compSep = objPopup.getHorizontalSeparator();
					container.appendChild(compSep);
				}
				if(item.subMenu && item.subMenu.length)
				{
					arrSubMenu = this.__getSubMenu(table,objPopup,item.subMenu,item,key);
				}
				var menu = this.__createMenuItem(table,objPopup,item.html,item.toolTip,arrSubMenu,item,key);
				container.appendChild(menu);
				index++;
			}
		};
		
		this.__createMenuItem = function(table,objPopup,contentHtml,tooltip,subMenu,item,menuName)
		{
			var handler = (subMenu && subMenu.length) ? null : this.__menuClickHandler.bind(this,table,item,null,menuName);
			var menu = objPopup.getMenuItem(null,null,contentHtml,tooltip,subMenu,handler);
			return menu;
		};
		
		this.__getSubMenu = function(table,objPopup,arrSubMenu,parentItem,parentMenu)
		{
			var arrRet = [];
			for(var count = 0;count < arrSubMenu.length;count++)
			{
				var item = arrSubMenu[count];
				var handler = this.__menuClickHandler.bind(this,table,item,parentItem,parentMenu);
				var anchor = objPopup.getSubMenuItem(null,null,item.label,item.toolTip,handler);
				arrRet.push(anchor);
			}
			return arrRet;
		};
		
		this.__menuClickHandler = function(table,item,parentItem,parentMenuName,event)
		{
			var textArea = this.nsEditor.__getTextArea();
			event = this.util.getEvent(event);
			var self = this;
			/*var cell = this.editorUtil.isCell(event.target) ? event.target : this.util.findParentByCallback(event.target,function(node){
				node && self.editorUtil.isCell(node);
			},textArea);*/
			var arrCells = this.getSelectedCells(table);
			if(arrCells && arrCells.length)
			{
				var cell = arrCells[0];
				var row = this.util.findParent(cell,"TR");
				var rowIndex = row.rowIndex;
				var cellIndex = cell.cellIndex;
				this.selection.restoreSelection();
				if(parentItem && parentItem.subMenuClickHandler)
				{
					parentItem.subMenuClickHandler(arrCells,row,table,cellIndex,rowIndex,item,parentItem,parentMenuName,event);
				}
				else if(item && item.menuClickHandler)
				{
					item.menuClickHandler(arrCells,row,table,cellIndex,rowIndex,item,parentMenuName,event);
				}
			}
			else
			{
				this.util.warning("NSEditor","Selected Cell is not found in Editor");
			}
			
		};
		
		this.__rowClickHandler = function(arrCells,row,table,cellIndex,rowIndex,item,parentItem,parentMenuName,event)
		{
			var self = this;
			var callback = function(newCell,newRow,paramTable,colIndex,rowReference,isInsertBelow)
			{
				self.util.removeStyleClass(newCell,self.CLASS_SELECTED_CELL);
			};
			switch(item.key)
			{
				case "above":
					this.__tblUtil.insertRow(table,row,false,callback); 
				break;
				case "below":
					this.__tblUtil.insertRow(table,row,true,callback);
				break;
			}
			this.__refreshIndexInTable(table);
		};
		
		this.__columnClickHandler = function(arrCells,row,table,cellIndex,rowIndex,item,parentItem,parentMenuName,event)
		{
			var self = this;
			var callback = function(newCell,paramTable,refIndex,isInsertAfter)
			{
				self.util.removeStyleClass(newCell,self.CLASS_SELECTED_CELL);
			};
			switch(item.key)
			{
				case "before":
					this.__tblUtil.insertColumn(table,cellIndex,false,callback); 
				break;
				case "after":
					this.__tblUtil.insertColumn(table,cellIndex,true,callback); 
				break;
			}
			this.__refreshIndexInTable(table);
		};
		
		this.__cellClickHandler = function(arrCells,row,table,cellIndex,rowIndex,item,parentItem,parentMenuName,event)
		{
			switch(item.key)
			{
				case "mergeCells":
					this.__tblUtil.mergeSelectedCells(arrCells,table);
				break;
				case "verticalSplit":
					this.__tblUtil.splitCellsVertical(arrCells,table);
				break;
				case "horizontalSplit":
					this.__tblUtil.splitCellsHorizontal(arrCells,table);
				break;
			}
			this.__clearTableSelectedCells(table);
			this.__refreshIndexInTable(table);
		};
		
		this.__alignClickHandler = function(arrCells,row,table,cellIndex,rowIndex,item,parentItem,parentMenuName,event)
		{			
			switch(item.key)
			{
				case "top":
				case "middle":
				case "bottom":
				case "normal":
					this.__objUIFunc.setVerticalAlignForNodes(item.key,arrCells);
				break;
				case "left":
				case "right":
				case "center":
				case "justify":
					this.__objUIFunc.setHorizontalAlignForNodes(item.key,arrCells);
				break;
			}
		};
		
		this.__removeClickHandler = function(arrCells,row,table,cellIndex,rowIndex,item,parentItem,parentMenuName,event)
		{
			switch(item.key)
			{
				case "table":
					this.editorUtil.removeNode(table);
				break;
				case "row":
					this.__tblUtil.removeRow(table,rowIndex);
					this.__refreshIndexInTable(table);
				break;
				case "column":
					this.__tblUtil.removeColumn(table,cellIndex);
					this.__refreshIndexInTable(table);
				break;
				case "cell":
					for(var cellIndex = 0;cellIndex < arrCells.length;cellIndex++)
					{
						var cell = arrCells[cellIndex];
						this.util.removeAllChildren(cell);
					}
				break;
			}
		};
		
		this.__headerClickHandler = function(arrCells,row,table,cellIndex,rowIndex,item,menuName,event)
		{
			
		};
		
		this.__refreshIndexInTable = function(table)
		{
			NSEditorTable.setIndexInTable(table);
		};
		
	};
	
	NSEditor.prototype.registerPlugin("tablePluggins",NSTablePluggins);
	
	return NSTablePluggins;
})();
nsModuleExport(__nsGlobal,"NSTablePluggins",NSTablePluggins);