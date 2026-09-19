var NSEditorTable = (function()
{
	var NSEditorTable = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		
		this.__nsTablePicker = null;
		
		this.setSettings = function()
		{
			var self = this;
			this.__nsEditor.__toolBarButton["table"] = {html:"<i class='ns-icon ns-editor-table' aria-hidden='true'></i>",tooltip:"Table",showAsMenu: true,
												  checkDisability: function(toolBarKey,toolBarItem,item,itemKey,isDefaultDisabled)
												  {
													  if(itemKey === "viewSourceCode")
													  {
														  return true;
													  }
													  return false;
												  },
												  click:function(item,key,event)
												  {
													  self.selection.saveSelection();
													  self.toggle.call(self,event);
												  }};
		};
		
		this.initialize = function()
		{
			this.__initializeTablePicker();
		};
		
		this.componentsInitialized = function()
		{
			
		};
		
		this.resized = function(event)
		{
			
		};
		
		this.addStyleInIFrame = function()
		{
			var style = ".nsEditorBody table\r\n" + 
					"{\r\n" + 
					"    border-collapse: collapse;\r\n" + 
					"    margin-bottom: 10px;\r\n" + 
					"    width:100%;\r\n" + 
					"}\r\n" + 
					"\r\n" + 
					".nsEditorBody table tr \r\n" + 
					"{\r\n" + 
					"    user-select: none;\r\n" + 
					"}\r\n" + 
					"\r\n" + 
					".nsEditorBody table tr td,\r\n" + 
					".nsEditorBody table tr th\r\n" + 
					"{\r\n" + 
					"    border: 1px solid #ddd;\r\n" + 
					"    vertical-align: middle;\r\n" + 
					"    user-select: text;\r\n" + 
					"    padding: 5px 10px;\r\n" + 
					"}\r\n" + 
					"\r\n" + 
					".nsEditorBody table .nsEditorHiddenRow\r\n" + 
					"{\r\n" + 
					"	height: 0px;\r\n" + 
					"    overflow: hidden;\r\n" + 
					"    line-height: 0;\r\n" + 
					"}\r\n" + 
					"\r\n" + 
					".nsEditorBody table .nsEditorHiddenRow td\r\n" + 
					"{\r\n" + 
					"	height: 0;\r\n" + 
					"    padding: 0;\r\n" + 
					"    border-top: 0;\r\n" + 
					"    overflow: hidden;\r\n" + 
					"    line-height: 0;\r\n" + 
					"}";
			return style;
		};
		
		this.destroy = function()
		{
			if(this.__nsTablePicker)
			{
				this.__nsTablePicker.remove();
			}
		};
		
		this.toggle = function(event)
		{
			if(this.__nsTablePicker)
			{
				if(this.__nsTablePicker.isOpen())
				{
					this.__nsTablePicker.close(event);
				}
				else
				{
					this.__nsTablePicker.open(event);
					event.stopPropagation();
				}
			}
			
		};
		
		this.__tablePickerCellClick = function(event,cell,rowIndex,cellIndex)
		{
			this.__nsTablePicker.close(event);
			console.log(rowIndex,cellIndex);
			this.__createTable(rowIndex,cellIndex);
		};
		
		this.__getDefaultValues = function()
		{
			var borderMap = {thin: "0px",medium: "1px",thick: "2px"};
			var doc = this.__nsEditor.__getDocument();
			var textArea = this.__nsEditor.__getTextArea();
			var table = this.util.createElement("table",null,null,doc);
		    table.insertRow(0).insertCell(0).innerHTML = "xxx";
		    textArea.appendChild(table);
		    var td = table.getElementsByTagName("td")[0];
		    var tmpValue = this.util.getStyleValue(table, "border-left-width");
		    var tableBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
		    tmpValue = this.util.getStyleValue(td, "padding-left");
		    var cellPadding = parseInt(borderMap[tmpValue] || tmpValue, 10);
		    tmpValue = this.util.getStyleValue(td, "border-left-width");
		    cellBorder = parseInt(borderMap[tmpValue] || tmpValue, 10);
		    textArea.removeChild(table);
		    return {
		        tableBorder: tableBorder,
		        cellPadding: cellPadding,
		        cellBorder: cellBorder
		    };
		};
		
		this.__getCellWidth = function(colCount)
		{
			var textArea = this.__nsEditor.__getTextArea();
            var doc = this.__nsEditor.__getDocument();
            var parent = textArea;
			var selection = this.selection.getSelection();
			var self = this;
			if(selection && selection.rangeCount)
			{
				var scanParent = function(paramElement)
				{
					return paramElement === textArea || (paramElement && self.editorUtil.isBlock(paramElement,textArea));
				};
				var range = selection.getRangeAt(0);
				var startElement = range.startContainer;
				var blockElement = this.util.findParentByCallback(startElement,scanParent,textArea);
				if(blockElement)
				{
					parent = blockElement;
				}
			}
			var objDefault = this.__getDefaultValues();
			var tableWidth = parent.offsetWidth;
			var extraWidth = (objDefault.cellPadding * 2) - objDefault.cellBorder;
			var cellWidth = Math.floor((tableWidth / colCount) - extraWidth);
			return cellWidth;
		};
		
		this.__createTable = function(rowCount,colCount)
		{
			var textArea = this.__nsEditor.__getTextArea();
            var doc = this.__nsEditor.__getDocument();
			var table = this.util.createElement("table",null,null,doc);
			var thead = this.util.createElement("thead",null,null,doc);
			table.appendChild(thead);
			var tbody = this.util.createElement("tbody",null,null,doc);
			table.appendChild(tbody);
			this.__createFirstRow(doc,table,thead,colCount);
            var firstCell = null;
            var tr = null;
            for (var rowIndex = 1; rowIndex <= rowCount; rowIndex++) 
            {
                tr = this.__createRow(doc,rowIndex,colCount);
                if (!firstCell) 
                {
                	firstCell = tr.children[0];
                }
                tbody.appendChild(doc.createTextNode("\n"));
                tbody.appendChild(tr);
            }
            this.__insertTable(doc,textArea,table,firstCell);
		};
		
		this.__createFirstRow = function(doc,table,thead,colCount)
		{
			var cellWidth = this.__getCellWidth(colCount);
			var tr = this.util.createElement("tr",null,null,doc);
            this.util.addStyleClass(tr,"nsEditorHiddenRow");
            var td = null;
            for (var cellIndex = 1; cellIndex <= colCount; cellIndex++) 
            {
                td = this.util.createElement("td",null,null,doc);
                td.style.width = cellWidth + "px";
                tr.appendChild(td);
            }
            thead.appendChild(tr);
		};
		
		this.__createRow = function(doc,rowIndex,colCount)
		{
			var tr = this.util.createElement("tr",null,null,doc);
			tr.setAttribute("data-ns-row-index",rowIndex);
            for (var cellIndex = 1; cellIndex <= colCount; cellIndex++) 
            {
            	var td = this.__createCell(doc,"td",rowIndex,cellIndex);
                tr.appendChild(doc.createTextNode("\n"));
                tr.appendChild(doc.createTextNode("\t"));
                tr.appendChild(td);
            }
            return tr;
		};
		
		this.__createCell = function(doc,nodeName,rowIndex,cellIndex)
		{
			nodeName = nodeName.toLowerCase();
			var node = this.util.createElement(nodeName,null,null,doc);
			node.setAttribute("data-ns-row-index",rowIndex);
			node.setAttribute("data-ns-cell-index",cellIndex);
			//this.__nsEditor.__nsToolTipInElement.addToolTip(node,"" + cellIndex);
			var div = this.util.createDiv();
			div.appendChild(this.util.createElement("br",null,null,doc));
			node.appendChild(div);
            return node;
		};
		
		this.__insertTable = function(doc,textArea,table,firstCell)
		{
			var self = this;
			var item = {table: table};
			var arrEvents = [{name:"closeAllPopups"},{name:"tableAdded",args:item}];
			var config = {insertAfterSelectedNode: true,insertAfterNodeCallback:function(blockElement){
				return (blockElement && !blockElement.nodeName.match(/^TD|TH|TBODY|TABLE|THEADER|TFOOTER$/));
			},dispatchEvents: arrEvents,afterInsertCallback: function(){
				if(firstCell)
	            {
					self.selection.setCursorIn(firstCell);
					self.util.scrollIntoView(firstCell,textArea,doc);
	            }
			}};
			this.__nsEditor.__addElement(table,config);
		};
		
		this.__initializeTablePicker = function()
		{
			if(!this.__nsTablePicker)
			{
				var setting = {isPopUp: true,width: 145, height:130,cellWidth: 12,cellHeight: 11, rowCount: 12,columnCount: 12, cellClickCallback: this.__tablePickerCellClick.bind(this)  };
				this.__nsTablePicker = new NSTablePicker(setting);
			}
		};
	};
	
	NSEditorTable.setIndexInTable = function(table)
	{
		var util = new NSUtil();
		var arrRow = table.rows;
		for(var rowIndex = 0;rowIndex < arrRow.length;rowIndex++)
		{
			var row = arrRow[rowIndex];
			if(!util.hasStyleClass(row,"nsEditorHiddenRow"))
			{
				row.setAttribute("data-ns-row-index",rowIndex);
				var arrCell = row.cells;
				for(var cellIndex = 0;cellIndex < arrCell.length;cellIndex++)
				{
					var cell = arrCell[cellIndex];
					cell.setAttribute("data-ns-row-index",rowIndex);
					cell.setAttribute("data-ns-cell-index",cellIndex);
				}
			}
		}
	};
	
	NSEditor.prototype.registerPlugin("table",NSEditorTable);
	
	return NSEditorTable;
})();
nsModuleExport(__nsGlobal,"NSEditorTable",NSEditorTable);