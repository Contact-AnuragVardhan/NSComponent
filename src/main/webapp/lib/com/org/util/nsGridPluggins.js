"use strict";
var NSGridEditor = (function()
{
	var NSGridEditor = function(nsGrid)
	{
		this.__nsGrid = nsGrid;
		this.util = this.__nsGrid.util;
		
		this.__config = {editType:NSGrid.EDITOR_EDITTYPE_CELL,clickType:NSGrid.EDITOR_EDITING_DOUBLECLICK,stopEditingOnGridFocusOut:false,enableMultipleEdit:false};
		this.__defaultCellSetting = {type:NSGrid.EDITOR_TYPE_TEXT,params:null,customEditor:null,validator:null,isCellEditableCallback:null};
		
		this.__table = null;
		
		this.__objEditor = {};
		this.__tblClickRef = null;
		this.__tblEventRef = null;
		
		this.initialize = function()
		{
			if(this.__nsGrid.__enableEditable)
			{
				var editorSetting = this.__nsGrid.__editorSetting;
				if(!editorSetting)
				{
					editorSetting = {};
				}
				this.__config = {
						editType:editorSetting.editType || this.__config.editType,
						clickType:editorSetting.clickType || this.__config.clickType,
						stopEditingOnGridFocusOut: Boolean.parse(editorSetting.stopEditingOnGridFocusOut),
						enableMultipleEdit: Boolean.parse(editorSetting.enableMultipleEdit)
				};
				this.__table = this.__nsGrid.__tblCenterBody;
				if(this.__config.editType != NSGrid.EDITOR_EDITING_NOCLICK)
				{
					//if(!this.__tblClickRef)
					//{
						this.__tblClickRef = this.__tblClickHandler.bind(this);
						this.util.addEvent(this.__table,"click", this.__tblClickRef);
					//}
					//if(!this.__tblEventRef)
					//{
						var mouseEvent = this.__getMouseEventType();
						this.__tblEventRef = this.__tblEventHandler.bind(this);
						this.util.addEvent(this.__table,mouseEvent, this.__tblEventRef);
					//}
				}
				if(!this.__documentKeyEventRef)
				{
					this.__documentKeyEventRef = this.__documentKeyEventHandler.bind(this);
					this.util.addEvent(document,"keydown", this.__documentKeyEventRef);
				}
				if(this.__config.stopEditingOnGridFocusOut)
				{
					this.__nsGrid.__listenInternalEvent("blur",this.__tblBlurHandler.bind(this));
				}
			}
		};
		
		this.edit = function(element,rowIndex)
		{
			element = this.__getElement(element,rowIndex);
			if(element)
			{
				this.__handleEditors(element);
			}
		};
		
		this.cancelEdit = function(element,rowIndex)
		{
			element = this.__getElement(element,rowIndex);
			this.__callCancelForEditors(element);
		};
		
		this.saveEdit = function(element,rowIndex)
		{
			element = this.__getElement(element,rowIndex);
			this.__callSaveForEditors(element);
		};
		
		/*
		 * returns array of key and value
		 * if element is null then it returns all editor instances
		 */
		this.getEditorInstances = function(element,rowIndex)
		{
			element = this.__getElement(element,rowIndex);
			return this.__getAllEditors(element);
		};
		
		this.processColumnObject = function(objColumn)
		{
			if(objColumn)
			{
				if(!objColumn.hasOwnProperty("enableEditable"))
				{
					objColumn.enableEditable = this.__nsGrid.__enableEditable;
				}
				if(objColumn["editorSetting"])
				{
					if(!objColumn["editorSetting"].hasOwnProperty("type") || !objColumn["editorSetting"]["type"])
					{
						objColumn["editorSetting"]["type"] = this.__defaultCellSetting.type;
					}
					if(objColumn["editorSetting"].hasOwnProperty("customEditor"))
					{
						var customEditor = objColumn["editorSetting"]["customEditor"];
						if (typeof customEditor === "string" || customEditor instanceof String)
						{
							if(this.util.isFunction(customEditor))
							{
								objColumn["editorSetting"]["customEditor"] = this.__nsGrid.__context[customEditor];
							}
						}
					}
				}
			}
		};
		
		this.isOtherKeyNavigationValid = function(event,cell)
		{
			var hasFocus = false;
			if(this.__config.editType == NSGrid.EDITOR_EDITTYPE_CELL)
			{
				hasFocus = this.__hasCellFocus(cell);
			}
			else
			{
				var row = this.util.findParent(cell,"TR");
				hasFocus = this.__hasRowFocus(row);
			}
			return !hasFocus;
		};
		
		this.resetVariables = function() 
		{
			this.__objEditor = {};
		};
		
		this.__documentKeyEventHandler = function(event)
		{
			if(this.__hasEditor())
			{
				event = this.util.getEvent(event);
		    	var keyCode = this.util.KEYCODE;
		    	if (event.keyCode == keyCode.ENTER) 
		      	{
		    		this.__callSaveForEditors();
		      	}
		      	else if (event.keyCode == keyCode.TAB) 
		      	{
		      		this.__callSaveForEditors();
		      		event.preventDefault();
		      	}
		      	else if (event.keyCode == keyCode.ESC) 
		      	{
		      		this.__callCancelForEditors();
		      		this.__callDestroyForRowEditors();
		        	event.preventDefault();
		      	}
		    	this.__callRowEditorsFunction("handleKeyDown",[event,event.keyCode]);
			}
		};
		
		/*
		 * for editType = cell 
		 * combination can be this.__getElement(cellIndex,rowIndex),this.__getElement(cell),this.__getElement(dataField,rowIndex)
		 * 
		 * for editType = row 
		 * combination can be this.__getElement(rowIndex),this.__getElement(row)
		 * 
		 */
		
		this.__getElement = function(element,rowIndex)
		{
			var retValue = null;
			if(!this.util.isUndefinedOrNull(element))
			{
				if(this.__config.editType == NSGrid.EDITOR_EDITTYPE_CELL)
				{
					if(this.util.isNumber(element))
					{
						if(this.util.isUndefinedOrNull(rowIndex))
						{
							return null;
						}
						var row = this.__nsGrid.__getRowByIndex(parseInt(rowIndex));
						if(row && row.cells && row.cells.length > element)
						{
							retValue = row.cells[element];
						}
					}
					else if(this.util.isElement(element))
					{
						if(element.nodeName == "TD")
						{
							retValue = element;
						}
					}
					else if(this.util.isString(element))
					{
						if(this.util.isUndefinedOrNull(rowIndex))
						{
							return null;
						}
						var cellIndex = this.__nsGrid.__getColumnIndexByObject(this.__nsGrid.__getColumnObjectByDataField(element));
						if(!this.util.isUndefinedOrNull(cellIndex))
						{
							var row = this.__nsGrid.__getRowByIndex(parseInt(rowIndex));
							if(row && row.cells && row.cells.length > cellIndex)
							{
								retValue = row.cells[cellIndex];
							}
						}
					}
				}
				else
				{
					if(this.util.isNumber(element))
					{
						retValue = this.__nsGrid.__getRowByIndex(element);
					}
					else if(this.util.isElement(element))
					{
						if(element.nodeName == "TR")
						{
							retValue = element;
						}
						else
						{
							retValue = this.util.findParent(element,"TR");
						}
					}
					//in this case row will be blank as through dataField we cannot fetch row 
					else if(this.util.isString(element))
					{
						
					}
				}
			}
			return retValue;
		};
		
		this.__tblClickHandler = function(event)
		{
			event = this.util.getEvent(event);
			var target = this.util.getTarget(event);
			var parentType = this.__getTargetType();
			var parent = this.util.findParent(target,parentType);
			if(parent)
			{
				var arrRowIndexes = Object.keys(this.__objEditor);
				if(arrRowIndexes && arrRowIndexes.length > 0)
				{
					if(!this.__config.enableMultipleEdit)
					{
						if(parentType == "TR")
						{
							//same row clicked so just return;
							var objEditors = this.__getEditorsForRow(parent);
							if(objEditors)
							{
								var arrCellIndex = Object.keys(objEditors);
								if(arrCellIndex && arrCellIndex.length > 0)
								{
									/*var cellIndex = arrCellIndex[0];
									var cellItem = objEditors[cellIndex];
									cellItem.editor.setFocus();*/
									return;
								}
							}
							else
							{
								this.__commitRowEditorChanges();
							}
						}
						else
						{
							//same cell clicked so just return;
							var editor = this.__getEditor(null,parent);
							if(editor)
							{
								editor.setFocus();
								return;
							}
							else
							{
								this.__commitRowEditorChanges();
							}
						}
					}
				}
			}
		};
		
		this.__tblEventHandler = function(event)
		{
			event = this.util.getEvent(event);
			var target = this.util.getTarget(event);
			var parentType = this.__getTargetType();
			var parent = this.util.findParent(target,parentType);
			if(parent)
			{
				this.__handleEditors(parent);
			}
		};
		
		this.__tblBlurHandler = function(event,detail)
		{
			this.__callSaveForEditors();
		};
		
		this.__popUpWrapperMouseDownHandler = function(event)
		{
			event = this.util.getEvent(event);
			event.stopPropagation();
		};
		
		this.__hasCellFocus = function(cell,editor)
		{
			var hasFocus = false;
			editor = cell ? this.__getEditor(null,cell) : editor;
			if(editor)
			{
				var element = editor.getElement();
				var hasFocusFunction = editor.hasFocus;
				if(hasFocusFunction && this.util.isFunction(hasFocusFunction))
				{
					hasFocus = hasFocusFunction(); 
				}
				else
				{
					hasFocus = (element === document.activeElement);
				}
			}
			return hasFocus;
		};
		
		this.__hasRowFocus = function(row)
		{
			if(row)
			{
				var arrEditor = this.__getOnlyEditors(row);
				if(arrEditor && arrEditor.length > 0)
				{
					for(var count = 0;count < arrEditor.length;count++)
					{
						var hasFocus = this.__hasCellFocus(null,arrEditor[count]);
						if(hasFocus)
						{
							return true;
						}
					}
					var activeElement = document.activeElement;
					if(activeElement)
					{
						var activeRow = this.util.findParent(activeElement,"TR");
						if(activeRow && activeRow == row)
						{
							return true;
						}
					}
				}
			}
			return false;
		};
		
		this.__handleEditors = function(element)
		{
			if(element.nodeName == "TD")
			{
				this.__handleCellEditor(element);
			}
			else
			{
				this.__handleRowEditors(element);
			}
		};
		
		this.__callSaveForEditors = function(element)
		{
			if(element && element.nodeName == "TD")
			{
				this.__callSaveForEditor(element);
			}
			else
			{
				this.__callSaveForRowEditors(element);
			}
		};
		
		this.__callCancelForEditors = function(element)
		{
			if(element && element.nodeName == "TD")
			{
				this.__callCancelForEditor(element);
			}
			else
			{
				this.__callCancelForRowEditors(element);
			}
		};
		
		this.__handleRowEditors = function(row)
		{
			if(row)
			{
				var arrCells = row.cells;
				if(arrCells && arrCells.length > 0)
				{
					for(var count = 0;count < arrCells.length;count++)
					{
						this.__handleCellEditor(arrCells[count]);
					}
				}
			}
		};
		
		this.__commitRowEditorChanges = function(row)
		{
			var arrEditor = this.__getOnlyEditors(row);
			if(arrEditor && arrEditor.length > 0)
			{
				for(var count = 0;count < arrEditor.length;count++)
				{
					this.__commitEditorChanges(null,arrEditor[count]);
				}
			}
		};
		
		this.__callSaveForRowEditors = function(row)
		{
			var arrEditor = this.__getOnlyEditors(row);
			if(arrEditor && arrEditor.length > 0)
			{
				for(var count = 0;count < arrEditor.length;count++)
				{
					this.__callSaveForEditor(null,arrEditor[count]);
				}
			}
		};
		
		this.__callCancelForRowEditors = function(row)
		{
			var arrEditor = this.__getOnlyEditors(row);
			if(arrEditor && arrEditor.length > 0)
			{
				for(var count = 0;count < arrEditor.length;count++)
				{
					this.__callCancelForEditor(null,arrEditor[count]);
				}
			}
		};
		
		this.__callDestroyForRowEditors = function(row)
		{
			var arrEditor = this.__getOnlyEditors(row);
			if(arrEditor && arrEditor.length > 0)
			{
				for(var count = 0;count < arrEditor.length;count++)
				{
					this.__callDestroyForEditor(null,arrEditor[count]);
				}
			}
		};
		
		this.__callRowEditorsFunction = function(functionRef,param,defaultValue,row)
		{
			var arrEditor = this.__getOnlyEditors(row);
			if(arrEditor && arrEditor.length > 0)
			{
				for(var count = 0;count < arrEditor.length;count++)
				{
					this.__callEditorFunction(arrEditor[count],functionRef,param,defaultValue,true);
				}
			}
		};
		
		this.__hasEditor = function()
		{
			var arrEditor = this.__getOnlyEditors();
			if(arrEditor && arrEditor.length > 0)
			{
				return true;
			}
			return false;
		};
		
		this.__getOnlyEditors = function(row)
		{
			var arrRet = [];
			if(this.util.isUndefinedOrNull(row))
			{
				var arrEditor = this.__getAllEditors();
				for(var count = 0;count < arrEditor.length;count++)
				{
					var cellItem = arrEditor[count];
					arrRet.push(cellItem.editor);
				}
			}
			else
			{
				if(this.util.isNumber(row))
				{
					row = this.__nsGrid.__getRowByIndex(row);
				}
				var objEditors = this.__getEditorsForRow(row);
				if(objEditors)
				{
					for(var cellIndex in objEditors)
					{
						var cellItem = objEditors[cellIndex];
						arrRet.push(cellItem.editor);
					}
				}
			}
			return arrRet;
		};
		
		this.__getAllEditors = function(element)
		{
			var arrRet = [];
			if(this.__objEditor)
			{
				if(element)
				{
					if(element.nodeName == "TD")
					{
						element = this.util.findParent(element,"TR");
					}
					if(element)
					{
						var objEditors = this.__getEditorsForRow(element);
						if(objEditors)
						{
							var rowIndex = parseInt(element.getAttribute("ns-index"));
							var itemInfo = this.__nsGrid.__getItemByIndex(rowIndex);
							for(var cellIndex in objEditors)
							{
								var cellItem = rowItem[cellIndex];
								var colInfo = this.__nsGrid.__getColumnObject(cellIndex);
								arrRet.push({rowIndex: rowIndex,item: itemInfo,cellIndex: cellIndex,colInfo: colInfo,cellItem: cellItem,editor: cellItem.editor});
							}
						}
					}
				}
				else
				{
					for(var rowIndex in this.__objEditor)
					{
						var rowItem = this.__objEditor[rowIndex];
						var itemInfo = this.__nsGrid.__getItemByIndex(rowIndex);
						for(var cellIndex in rowItem)
						{
							var cellItem = rowItem[cellIndex];
							var colInfo = this.__nsGrid.__getColumnObject(cellIndex);
							arrRet.push({rowIndex: rowIndex,item: itemInfo,cellIndex: cellIndex,colInfo: colInfo,cellItem: cellItem,editor: cellItem.editor});
						}
					}
				}
			}
			return arrRet;
		};
		
		this.__handleCellEditor = function(cell,event,item)
		{
			if(cell)
			{
				var editor = this.__getEditor(null,cell);
				if(!editor)
				{
					var colIndex = cell.cellIndex;
					var objColumn = this.__nsGrid.__getColumnObject(colIndex);
					if(objColumn && objColumn.enableEditable)
					{
						var row = cell.parentNode;
						var rowIndex = this.__nsGrid.__getIndexFromRow(row);
						if(!item)
						{
							item = this.__nsGrid.__getItemByIndex(rowIndex);
						}
						if(item)
						{
							if(this.__isCellEditable(objColumn,item,cell,colIndex,row,rowIndex))
						    {
								var callback = function(row,cell,editor)
						    	{
						    		this.__insertEditorInObj(editor,row,cell);
						    	};
						    	this.__createEditor(cell,objColumn,row,rowIndex,item,callback.bind(this,row,cell));
						    	
								if(event)
								{
									event.preventDefault();
								}
						    }
						}
					}
				}
			}
		};
		
		this.__createEditor = function(cell,objColumn,row,rowIndex,item,paramCallback)
		{
			var self = this;
			var createPopUpWrapper = function()
			{
				var container = document.body;
		      	var wrapper = self.util.createDiv(null,"nsGridEditorPopUp");
		      	container.appendChild(wrapper);
		      	return wrapper;
			};
			var addChildInPopUp = function(element,parent)
			{
				parent.appendChild(element);
			};
			var addChild = function(element)
			{
				divChild.innerHTML = "";
				divChild.appendChild(element);
			};
			var commitChanges = function()
			{
				self.__callSaveForEditor.call(self,cell,editor);
			};
			var cancelChanges = function()
			{
				self.__callCancelForEditor.call(self,cell,editor);
			};
			var position = this.__getPosition(cell);
			var editorSetting = this.__getEditorSetting(objColumn);
			var divChild = cell.querySelector("." + this.__nsGrid.__CLASS_CELL_CHILD);
		    var currentValue = item[objColumn.dataField];
			var editorFunction = this.__getEditorFunction(editorSetting);
			var setting = {cell:cell,row:row,item:item,rowIndex:rowIndex,cellIndex:cell.cellIndex,position:position,defaultValue:currentValue,
					commitChanges:commitChanges,cancelChanges:cancelChanges,validator:editorSetting.validator,setting:editorSetting,column:objColumn,api:this.__nsGrid};
			var callback = function(editorFunction)
			{
				var editor = new editorFunction();
				var retVal = editor.init(setting);
				var initCallback = function(bodyCompInstance)
				{
					var element = editor.getElement();
					var isPopUp = editor.isPopUp();
					var popUpWrapper = null;
					if(isPopUp)
					{
						popUpWrapper = createPopUpWrapper();
						popUpWrapper.style.top = (position.top - 5) + "px";
						popUpWrapper.style.left = (position.left - 5) + "px";
						this.__callEditorFunction(editor,"setPopUpWrapper",popUpWrapper,null,false);
						addChildInPopUp(element,popUpWrapper);
						if(this.__config.stopEditingOnGridFocusOut)
						{
							//stop propagation of event on document level so that pop up is not closed
							this.util.addEvent(popUpWrapper,"mousedown", this.__popUpWrapperMouseDownHandler.bind(this));
							this.__nsGrid.__addTouchEvent(popUpWrapper);
						}
					}
					else
					{
						addChild(element);
					}
					this.__callEditorFunction(editor,"elementAdded",null,null,false);
					var config = {cell:cell,row:row,divChild:divChild,setting:editorSetting,column:objColumn,item:item,isPopUp:isPopUp,element:element,popUpWrapper:popUpWrapper};
					editor[this.__getAttributeKey("config")] = config;
				};
				this.util.resolveFunctionOrPromise(retVal,initCallback.bind(this));
				paramCallback && paramCallback(editor);
			};
			this.util.resolveFunctionOrPromise(editorFunction,callback.bind(this));
		};
		
		this.__isCellEditable = function(objColumn,item,cell,cellIndex,row,rowIndex)
		{
			if(this.__nsGrid.__isCellEditable(objColumn,item,cell,cellIndex,row,rowIndex))
			{
				var editorSetting = this.__getEditorSetting(objColumn);
				if(editorSetting && editorSetting.isCellEditableCallback)
				{
					return editorSetting.isCellEditableCallback(objColumn,item,cell,cellIndex,row,rowIndex,item[this.__nsGrid.__fieldRowLevel]);
				}
				return true;
			}
			return false;
		};
		
		this.__callSaveForEditor = function(cell,editor)
		{
			editor = cell ? this.__getEditor(null,cell) : editor;
			if(editor)
			{
				this.__callEditorFunction(editor,"save",null,null,false);
				this.__commitEditorChanges(cell,editor);
			}
			else
			{
				this.util.warning("NSGrid","Editor For cell could not be found");
			}
		};
		
		this.__callCancelForEditor = function(cell,editor)
		{
			editor = cell ? this.__getEditor(null,cell) : editor;
			if(editor)
			{
				this.__callEditorFunction(editor,"cancel",null,null,false);
				var config = editor[this.__getAttributeKey("config")];
				var cell = config.cell;
				var row = config.row;
				var objColumn = config.column;
				var item = config.item;
				var editorSetting = config.setting;
				var setValue = item[objColumn.dataField];
				this.__setCellValue(cell,setValue,item,row,objColumn,editorSetting);
				this.__callDestroyForEditor(cell,editor);
			}
			else
			{
				this.util.warning("NSGrid","Editor For cell could not be found");
			}
		};
		
		this.__callDestroyForEditor = function(cell,editor)
		{
			editor = cell ? this.__getEditor(null,cell) : editor;
			if(editor)
			{
				this.__callEditorFunction(editor,"destroy",null,null,false);
				var config = editor[this.__getAttributeKey("config")];
				var element = null;
				if(config.isPopUp)
				{
					element = config.popUpWrapper;
				}
				else
				{
					element = editor.getElement();
					
				}
				if(element && element.parentNode)
		    	{
					element.parentNode.removeChild(element);
		    	}
				this.__deleteEditor(null,cell,editor);
			}
			else
			{
				this.util.warning("NSGrid","Editor For cell could not be found");
			}
		};
		
		this.__commitEditorChanges = function(cell,editor)
		{
			editor = cell ? this.__getEditor(null,cell) : editor;
			if(editor)
			{
				var self = this;
				var destroyEditor = function()
				{
					self.__callDestroyForEditor.call(self,cell);
				};
				var config = editor[this.__getAttributeKey("config")];
				var cell = config.cell;
				var row = config.row;
				var objColumn = config.column;
				var item = config.item;
				var editorSetting = config.setting;
				var value = editor.getValue();
				var isValid = this.__callEditorFunction(editor,"validate",null,true,false);
				if(isValid)
				{
					var setValue = item[objColumn.dataField];
					
					var hasValueChanged = this.__callEditorFunction(editor,"hasValueChanged",setValue,null,null,false);
					if(hasValueChanged == null)
					{
						hasValueChanged = !(setValue === value);
					}
					destroyEditor();
					if(hasValueChanged)
					{
						setValue = value;
					}
					this.__setCellValue(cell,setValue,item,row,objColumn,editorSetting);
				}
			}
			else
			{
				//this.util.warning("NSGrid","Editor For cell could not be found");
			}
		};
		
		this.__callEditorFunction = function(editor,functionRef,param,defaultValue,checkCellFocus)
		{
			if(editor && editor[functionRef] && this.util.isFunction(editor[functionRef]))
			{
				checkCellFocus = Boolean.parse(checkCellFocus);
				if(!checkCellFocus || this.__hasCellFocus(null,editor))
				{
					var retValue = null;
					/*var config = editor[this.__getAttributeKey("config")];
					if(config)
					{
						console.log(config.column.dataField + " :: " + config.item[config.column.dataField]);
					}*/
					var retValue = null;
					if(param && this.util.isArray(param) && param.length > 0)
					{
						retValue = editor[functionRef].apply(null,param);
					}
					else
					{
						retValue = editor[functionRef](param);
					}
					if(!this.util.isUndefinedOrNull(retValue))
					{
						return retValue;
					}
				}
			}
			return defaultValue;
		};
		
		this.__setCellValue = function(cell,newValue,item,row,objColumn,editorSetting)
		{
			if(cell)
			{
				var colIndex = cell.cellIndex;
				var rowIndex = this.__nsGrid.__getIndexFromRow(row);
				var currentValue = item[objColumn.dataField];
				item[objColumn.dataField] = newValue;
				this.__nsGrid.updateItemInDataSource(item);
				this.__nsGrid.updateRowByIndex(rowIndex);
				this.__nsGrid.__dispatchEvent(NSGrid.EDITOR_CELL_VALUE_CHANGED,cell,{cellIndex:colIndex,rowIndex:rowIndex,cell:cell,row:row,newValue:newValue,oldValue:currentValue,item:item});
			}
		};
		
		this.__getAttributeKey = function(key)
		{
			return "__" + this.__nsGrid.__fieldPrefix + "_" + key;
		};
		
		this.__getPosition = function(element) 
		{
		      var position = {
		        top: element.offsetTop,
		        left: element.offsetLeft,
		        bottom: 0,
		        right: 0,
		        width: this.util.getOuterWidth(element),
		        height: this.util.getOuterHeight(element),
		        visible: true};
		      position.bottom = position.top + position.height;
		      position.right = position.left + position.width;
	
		      // walk up the tree
		      var offsetParent = element.offsetParent;
		      while ((element = element.parentNode) != document.body) 
		      {
		        if (position.visible && element.scrollHeight != element.offsetHeight && this.util.getStyleValue(element,"overflowY",false) != "visible") 
		        {
		          	position.visible = position.bottom > element.scrollTop && position.top < element.scrollTop + element.clientHeight;
		        }
		        if (position.visible && element.scrollWidth != element.offsetWidth && this.util.getStyleValue(element,"overflowX",false) != "visible") 
		        {
		          	position.visible = position.right > element.scrollLeft && position.left < element.scrollLeft + element.clientWidth;
		        }
		        position.left -= element.scrollLeft;
		        position.top -= element.scrollTop;
		        if (element === offsetParent) 
		        {
		          	position.left += element.offsetLeft;
		          	position.top += element.offsetTop;
		          	offsetParent = element.offsetParent;
		        }
		        position.bottom = position.top + position.height;
		        position.right = position.left + position.width;
		      }
	
		      return position;
		};
		
		this.__getMouseEventType = function()
		{
			var retValue = "dblclick";
			switch(this.__config.clickType)
			{
				case NSGrid.EDITOR_EDITING_SINGLECLICK:
					retValue = "click";
				break;
				case NSGrid.EDITOR_EDITING_DOUBLECLICK:
					retValue = "dblclick";
				break;
				case NSGrid.EDITOR_EDITING_NOCLICK:
					retValue = "";
				break;
			}
			return retValue;
		};
		
		this.__getEditorSetting = function(objColumn)
		{
			var editorSetting = objColumn.editorSetting;
			if(!editorSetting)
			{
				editorSetting = this.__defaultCellSetting;
			}
			return editorSetting;
		};
		
		this.__getEditorFunction = function(editorSetting)
		{
			var retFunction = null;
			if(editorSetting)
			{
				switch(editorSetting.type)
				{
					case NSGrid.EDITOR_TYPE_TEXT:
						retFunction = this.__nsTextEditor;
					break;
					case NSGrid.EDITOR_TYPE_TEXTAREA:
						retFunction = this.__nsTextAreaEditor;
					break;
					case NSGrid.EDITOR_TYPE_CUSTOM:
						retFunction = editorSetting.customEditor;
					break;
				}
			}
			return retFunction;
		};
		
		this.__getTargetType = function()
		{
			if(this.__config.editType == NSGrid.EDITOR_EDITTYPE_ROW)
			{
				return "TR";
			}
			return "TD";
		};
		
		this.__insertEditorInObj = function(editor,row,cell)
		{
			var item = this.__getRowCellInfo(row,cell);
			if(item && item.cellIndex > -1)
			{
				if(!this.__config.enableMultipleEdit)
				{
					var parentType = this.__getTargetType();
					if(parentType == "TR")
					{
						if(this.__objEditor[item.rowIndex] && this.__objEditor[item.rowIndex][item.cellIndex])
						{
							this.__objEditor[item.rowIndex][item.cellIndex] = {};
						}
					}
					else
					{
						this.__objEditor = {};
					}
				}
				if(!this.__objEditor[item.rowIndex])
				{
					this.__objEditor[item.rowIndex] = {};
				}
				if(!this.__objEditor[item.rowIndex][item.cellIndex])
				{
					this.__objEditor[item.rowIndex][item.cellIndex] = {};
				}
				if(!this.__objEditor[item.rowIndex][item.cellIndex].editor)
				{
					this.__objEditor[item.rowIndex][item.cellIndex].editor = editor;
				}
			}
		};
		
		this.__getEditor = function(row,cell)
		{
			var item = this.__getRowCellInfo(row,cell);
			if(item && item.cellIndex > -1)
			{
				if(this.__objEditor && this.__objEditor[item.rowIndex] && this.__objEditor[item.rowIndex][item.cellIndex] && this.__objEditor[item.rowIndex][item.cellIndex].editor)
				{
					return this.__objEditor[item.rowIndex][item.cellIndex].editor;
				}
			}
			return null;
		};
		
		this.__getEditorsForRow = function(row)
		{
			var item = this.__getRowCellInfo(row,null);
			if(item)
			{
				if(this.__objEditor && this.__objEditor[item.rowIndex])
				{
					return this.__objEditor[item.rowIndex];
				}
			}
			return null;
		};
		
		this.__deleteEditor = function(row,cell,editor)
		{
			if(editor)
			{
				cell = cell ? cell : this.util.findParent(editor.getElement(),"TD");
			}
			var item = this.__getRowCellInfo(row,cell);
			if(item && item.cellIndex > -1)
			{
				if(this.__objEditor && this.__objEditor[item.rowIndex] && this.__objEditor[item.rowIndex][item.cellIndex] && this.__objEditor[item.rowIndex][item.cellIndex].editor)
				{
					delete this.__objEditor[item.rowIndex][item.cellIndex];
					var objKeys = Object.keys(this.__objEditor[item.rowIndex]);
					if(!objKeys || objKeys.length == 0)
					{
						delete this.__objEditor[item.rowIndex];
					}
				}
			}
		};
		
		this.__deleteEditorsForRow = function(row)
		{
			var item = this.__getRowCellInfo(row,null);
			if(item)
			{
				if(this.__objEditor && this.__objEditor[item.rowIndex])
				{
					var rowEditors = this.__objEditor[item.rowIndex];
					for(var cellIndex in rowEditors)
					{
						if(rowEditors[cellIndex].editor)
						{
							delete rowEditors[cellIndex].editor;
						}
					}
				}
			}
		};
		
		this.__getRowCellInfo = function(row,cell)
		{
			var self = this;
			var getInfo = function(rowIndex,cellIndex,rowRet,cellRet)
			{
				var itemInfo = self.__nsGrid.__getItemByIndex(rowIndex);
				var colInfo = self.__nsGrid.__getColumnObject(cellIndex);
				return {rowIndex: rowIndex,cellIndex: cellIndex,rowInfo: itemInfo,colInfo: colInfo,row: rowRet,cell: cellRet};
			};
			
			if(!this.util.isUndefinedOrNull(row) && !this.util.isUndefinedOrNull(cell))
			{
				var rowIndex = -1;
				var cellIndex = -1;
				var rowRet = null;
				var cellRet = null;
				if(this.util.isElement(row))
				{
					rowIndex = parseInt(row.getAttribute("ns-index"));
					rowRet = row;
				}
				if(this.util.isNumber(row))
				{
					rowIndex = parseInt(row);
					rowRet = this.__nsGrid.__getRowByIndex(rowIndex);
				}
				if(this.util.isElement(cell))
				{
					cellIndex = parseInt(cell.cellIndex);
					cellRet = cell;
				}
				if(this.util.isNumber(cell))
				{
					cellIndex = parseInt(cell);
					cellRet = rowRet.cells[cellIndex];
				}
				var retItem = getInfo(rowIndex,cellIndex,rowRet,cellRet);
				return retItem;
			}
			else if(!this.util.isUndefinedOrNull(cell))
			{
				var rowIndex = -1;
				var cellIndex = -1;
				var rowRet = null;
				var cellRet = null;
				if(this.util.isElement(cell))
				{
					cellIndex = parseInt(cell.cellIndex);
					cellRet = cell;
				}
				if(this.util.isNumber(cell))
				{
					cellIndex = parseInt(cell);
					cellRet = rowRet.cells[cellIndex];
				}
				rowRet = cellRet.parentElement;
				rowIndex = parseInt(rowRet.getAttribute("ns-index"));
				var retItem = getInfo(rowIndex,cellIndex,rowRet,cellRet);
				return retItem;
			}
			
			else if(!this.util.isUndefinedOrNull(row))
			{
				var rowIndex = -1;
				var rowRet = null;
				
				if(this.util.isElement(row))
				{
					rowIndex = parseInt(row.getAttribute("ns-index"));
					rowRet = row;
				}
				if(this.util.isNumber(row))
				{
					rowIndex = parseInt(row);
					rowRet = this.__nsGrid.__getRowByIndex(rowIndex);
				}
				var itemInfo = this.__nsGrid.__getItemByIndex(rowIndex);
				return {rowIndex: rowIndex,cellIndex: -1,rowInfo: itemInfo,colInfo: null,row: rowRet,cell: null};
			}
			
			return null;
		};
    
		this.__destroy = function()
		{
			if(this.__tblClickRef)
			{
				this.__nsGrid.__removeTouchEvent(this.__table);
				this.util.removeEvent(this.__table,"click", this.__tblClickRef);
				this.__tblClickRef = null;
			}
			if(this.__tblEventRef)
			{
				var mouseEvent = this.__getMouseEventType();
				this.util.removeEvent(this.__table,mouseEvent, this.__tblEventRef);
				this.__tblEventRef = null;
			}
			
			if(this.__documentKeyEventRef)
			{
				this.util.removeEvent(document,"keydown", this.__documentKeyEventRef);
				this.__documentKeyEventRef = null;
			}
		};
		
		this.__nsTextEditor = function() 
		{
		    var input;
		    var defaultValue;
		    var setting = null;
		    var self = this;
		    var util = new NSUtil();
		    
		    this.init = function(config) 
		    {
		    	setting = config;
		    	var editorSetting = setting.setting;
		    	var params = this.__getParams(editorSetting.params);
		    	input = util.createElement("input",null,"nsTextEditor"); 
		    	defaultValue = setting.defaultValue;
		      	input.value = defaultValue;
		      	input.style.width = "98%";
		      	if(params.cssClass)
		      	{
		      		util.addStyleClass(input,params.cssClass);
		      	}
		    };
		    
		    this.getElement = function()
		    {
		    	return input;
		    };
		    
		    this.elementAdded = function()
		    {
		    	util.addEvent(input,"click",function(event){
		    		event = util.getEvent(event);
		    		self.setFocus();
		    		//the below line stops propagation and hence document click handler is not fired in handleCellSelector
		    		//event.stopPropagation();
		    		//event.stopImmediatePropagation();
		    		event.preventDefault();
		    	});
		    	input.focus();
		      	input.select();
		    };
		    
		    this.handleKeyDown = function(event,keyCode) 
		    {
		    	var objKeyCode = util.KEYCODE;
		    	if (keyCode == objKeyCode.LEFT && keyCode == objKeyCode.RIGHT) 
		      	{
		    		event.stopImmediatePropagation();
		      	} 
		    };
		    
		    this.getValue = function() 
		    {
		      	return input.value;
		    };
		    
		    this.destroy = function() 
		    {
		    	
		    };
		    
		    this.setFocus = function()
		    {
		    	input.focus();
		    	//setTimeout(function(){input.selectionStart = input.selectionEnd = 10000; }, 0);
		    	input.selectionEnd = input.selectionStart = input.value.length;
		    };
		    
		    this.hasValueChanged = function(currentValue) 
		    {
		      	return (!(input.value == "" && currentValue == null)) && (input.value != currentValue);
		    };
			
		    this.validate = function() 
		    {
		    	if(setting.validator)
		    	{
		    		return setting.validator(input,input.value);
		    	}
		      	return true;
		    };
		    
		    this.isPopUp = function()
		    {
		    	return false;
		    };
		    
		    this.save = function() 
		    {
		    	
		    };
	
		    this.cancel = function() 
		    {
		      	input.value = defaultValue;
		    };
		    
		    this.setPopUpWrapper = function(popUpWrapper) 
		    {
		    	
		    };
		    
		    this.__getParams = function(params)
		    {
		    	if(!params)
		    	{
		    		params = {};
		    	}
		    	params = {
		    		cssClass: params.cssClass || null,
		    	};
		    	
		    	return params;
		    };
	
		};
	
		this.__nsTextAreaEditor = function() 
		{
		    var input, wrapper, parentWrapper;
		    var defaultValue;
		    var util = new NSUtil();
		    var setting = null;
		    var self = this;
			
		    this.init = function (config) 
		    {
		    	setting = config;
		    	var editorSetting = setting.setting;
		    	var params = this.__getParams(editorSetting.params);
		      	wrapper = util.createDiv(null,"nsGridTextAreaEditor");
		      	input = util.createElement("textarea",null,"nsGridTextArea"); 
		      	if(params.cssClass.textArea)
		      	{
		      		util.addStyleClass(input,params.cssClass.textArea);
		      	}
		      	input.setAttribute("hidefocus",true);
		      	input.setAttribute("rows",params.rows);
		      	wrapper.appendChild(input);
		      	wrapper.appendChild(document.createElement("br"));
		      	var buttonWrapper = util.createDiv(null);
		      	buttonWrapper.style.textAlign = "right";
		      	wrapper.appendChild(buttonWrapper);
		      	var btnSave = util.createElement("button",null,params.cssClass.saveButton);
		      	btnSave.appendChild(document.createTextNode(params.saveButtonText));
		      	util.addEvent(btnSave,"click",this.__saveHandler);
		      	buttonWrapper.appendChild(btnSave);
		      	buttonWrapper.appendChild(document.createTextNode(" "));
		      	var btnCancel = util.createElement("button",null,params.cssClass.cancelButton);
		      	btnCancel.appendChild(document.createTextNode(params.cancelButtonText));
		      	buttonWrapper.appendChild(btnCancel);
		      	util.addEvent(btnCancel,"click",this.__cancelHandler);
		      	defaultValue = setting.defaultValue;
		      	input.value = defaultValue;
		    };
		    
		    this.getElement = function()
		    {
		    	return wrapper;
		    };
		    
		    this.elementAdded = function()
		    {
		    	input.focus();
		      	input.select();
		    };
	
		    this.handleKeyDown = function(event,keyCode) 
		    {
		    	event = util.getEvent(event);
		    	var objKeyCode = util.KEYCODE;
		      	if (keyCode == objKeyCode.ENTER && event.ctrlKey) 
		      	{
		        	self.save();
		      	} 
		    };
		    
		    this.getValue = function() 
		    {
		      	return input.value;
		    };
		    
		    this.destroy = function() 
		    {
		    	
		    };
		    
		    this.setFocus = function()
		    {
		    	input.focus();
		    };
		    
		    this.hasFocus = function()
		    {
		    	return input === document.activeElement;
		    };
	
		    this.hasValueChanged = function(currentValue) 
		    {
		      	return (!(input.value == "" && currentValue == null)) && (input.value != currentValue);
		    };
	
		    this.validate = function() 
		    {
		    	if(setting.validator)
		    	{
		    		return setting.validator(input,input.value);
		    	}
		      	return true;
		    };
		    
		    this.isPopUp = function()
		    {
		    	return true;
		    };
		    
		    this.save = function () 
		    {
		    	
		    };
	
		    this.cancel = function () 
		    {
		      	input.value = defaultValue;
		      	
		    };
		    
		    this.setPopUpWrapper = function(popUpWrapper) 
		    {
		    	parentWrapper = popUpWrapper;
		    };
		    
		    //non framework function
		    this.__saveHandler = function(event)
		    {
		    	setting.commitChanges();
		    };
		    
		    this.__cancelHandler = function(event)
		    {
		    	setting.cancelChanges();
		    };
		    
		    this.__getParams = function(params)
		    {
		    	if(!params)
		    	{
		    		params = {};
		    	}
		    	if(!params.cssClass)
		    	{
		    		 params.cssClass = {};
		    	}
		    	var cssClass = {
		    			textArea: params.cssClass["textArea"] || null,
		    			saveButton: params.cssClass["saveButton"] || null,
		    			cancelButton: params.cssClass["cancelButton"] || null
		    	};
		    	params = {
		    		rows: params.rows || 5,
		    		cssClass: cssClass,
		    		saveButtonText: params.saveButtonText || "Save",
		    		cancelButtonText: params.cancelButtonText || "Cancel",
		    	};
		    	
		    	return params;
		    };
		    
		};
		
	};
	return NSGridEditor;
})();
nsModuleExport(__nsGlobal,"NSGridEditor",NSGridEditor);

var NSGridKeyboard = (function()
{
	var NSGridKeyboard = function(nsGrid)
	{
		this.__nsGrid = nsGrid;
		this.util = this.__nsGrid.util;
		
		var self = this;
		
		this.keyDownHandler = function(event,keyCode)
		{
			var isShiftCtrlPressed = this.__nsGrid.__isShiftPressed || this.__nsGrid.__isCtrlPressed;
			var source = this.__nsGrid.__objGrid.__getFlatSource();
			//key Up
			if(keyCode === this.util.KEYCODE.UP && isShiftCtrlPressed && this.__enableMultipleSelection)
			{
				if(this.__nsGrid.__lastNavigationDirection && this.__nsGrid.__lastNavigationDirection === this.__nsGrid.NAVIGATION_DOWN)
				{
					return this.__keyBoardSelectionHandler(event,this.__nsGrid.NAVIGATION_UP);
				}
				if(this.__nsGrid.__selectedIndex != 0)
				{
					this.__nsGrid.__selectedIndex--;
					this.__nsGrid.__navigationIndex--;
					while(!this.__nsGrid.__isMouseHoverAllowed(this.__nsGrid.__selectedIndex))
					{
						this.__nsGrid.__selectedIndex--;
						this.__nsGrid.__navigationIndex--;
					}
					return this.__keyBoardSelectionHandler(event,this.__nsGrid.NAVIGATION_UP);
				}
			}
			//key down
			else if(keyCode === this.util.KEYCODE.DOWN && isShiftCtrlPressed && this.__nsGrid.__enableMultipleSelection)
			{
				if(this.__nsGrid.__lastNavigationDirection && this.__nsGrid.__lastNavigationDirection === this.__nsGrid.NAVIGATION_UP)
				{
					return this.__keyBoardSelectionHandler(event,this.__nsGrid.NAVIGATION_DOWN);
				}
				if(source && this.__nsGrid.__selectedIndex != source.length - 1)
				{
					this.__nsGrid.__selectedIndex++;
					this.__nsGrid.__navigationIndex++;
					while(!this.__nsGrid.__isMouseHoverAllowed(this.__nsGrid.__selectedIndex))
					{
						this.__nsGrid.__selectedIndex++;
						this.__nsGrid.__navigationIndex++;
					}
					return this.__keyBoardSelectionHandler(event,this.__nsGrid.NAVIGATION_DOWN);
				}
			}
			else if(keyCode === this.__nsGrid.util.KEYCODE.UP)
			{
				if(source && this.__nsGrid.__navigationIndex === -1)
				{
					this.__nsGrid.__navigationIndex = source.length - 1;
				}
				if(this.__nsGrid.__navigationIndex > 0)
				{
					return this.__keyBoardNavigationHandler(event,this.__nsGrid.NAVIGATION_UP);
				}
			}
			else if(keyCode === this.util.KEYCODE.DOWN)
			{
				if(source)
				{
					return this.__keyBoardNavigationHandler(event,this.__nsGrid.NAVIGATION_DOWN);
				}
			}
			else if(keyCode === this.util.KEYCODE.ENTER)
			{
				this.__nsGrid.__clearAllRowSelection(false);
				var row = this.__getkeyboardNavigationRow();
				if(row)
				{
					this.__nsGrid.__markRowSelected(this.__nsGrid.__getIndexFromRow(row));
				}
			}
		};
		
		this.__keyBoardNavigationHandler = function(event,direction)
		{
			var self = this;
			var lastIndex = this.__nsGrid.__navigationIndex;
			var currentIndex = this.__nsGrid.__navigationIndex;
			(direction === this.__nsGrid.NAVIGATION_UP) ? currentIndex--:currentIndex++;
			while(!this.__nsGrid.__isMouseHoverAllowed(currentIndex))
			{
				(direction === this.__nsGrid.NAVIGATION_UP) ? currentIndex--:currentIndex++;
			}
			var endHandler = function()
			{
				self.__nsGrid.__navigationIndex = currentIndex;
				var row = self.__getkeyboardNavigationRow();
				var index = -1;
				var item = null;
				if(row)
				{
					var source = self.__nsGrid.__objGrid.__getFlatSource();
					index = self.__nsGrid.__getIndexFromRow(row);
					item = self.__nsGrid.__getItemByIndex(index, source);
				}
				self.__nsGrid.__dispatchEvent(NSGrid.ROW_NAVIGATED,item,{rowIndex:index,item:item,row:row});
				self.__nsGrid.__lastNavigationDirection = null;
			};
			if(this.__nsGrid.__enableVirtualScroll)
			{
				var virtualHandler = function()
				{
					var item = self.__nsGrid.__getVisibleItemByIndex.call(self.__nsGrid,null,currentIndex);
					if(item)
					{
						var index = item[self.__nsGrid.__fieldIndex];
						self.__setVirtualRowHoverField.call(self,index);
						self.__virtualRowHover.call(self);
						endHandler();
					}
				};
				this.__nsGrid.scrollToIndex(currentIndex,false);
				
				setTimeout(function()
				{ 
					virtualHandler();
				},0);
				//this.__setVirtualRowHover(currentIndex);
			}
			else
			{
				var row = this.__nsGrid.__getRowFromContainer(lastIndex);
				var currentRow = this.__nsGrid.__getRowFromContainer(currentIndex);
				if(currentRow)
				{
					this.util.removeStyleClass(row,"nsRowHover");
					this.util.addStyleClass(currentRow,"nsRowHover");
					this.__refreshScrollPosition(currentRow,direction);
					endHandler();
				}
			}
			event.preventDefault();
			return false;
		};
	
		this.__keyBoardSelectionHandler = function(event,direction)
		{
			var selectedIndex = this.__nsGrid.__selectedIndex;
			if(this.__nsGrid.__isRowSelected(selectedIndex))
			{
				this.__nsGrid.__markRowUnselected(selectedIndex);
			}
			else
			{
				this.__nsGrid.__markRowSelected(selectedIndex);
			}
			if(direction === this.__nsGrid.NAVIGATION_DOWN)
			{
				if(this.__nsGrid.__enableVirtualScroll)
				{
					this.__nsGrid.scrollToIndex(selectedIndex,false);
				}
				else if(Math.floor(selectedIndex % this.__nsGrid.__pageSize) === 0)
				{
					var row = this.__nsGrid.__getRowByIndex(selectedIndex);
					this.__refreshScrollPosition(row,this.__nsGrid.NAVIGATION_DOWN);
				}
			}
			else if(direction === this.__nsGrid.NAVIGATION_UP)
			{
				if(this.__nsGrid.__enableVirtualScroll)
				{
					this.__nsGrid.scrollToIndex(selectedIndex,false);
				}
				else
				{
					var row = this.__nsGrid.__getRowByIndex(selectedIndex);
					this.__refreshScrollPosition(row,this.__nsGrid.NAVIGATION_UP);
				}
			}
			this.__nsGrid.__lastNavigationDirection = direction;
			event.preventDefault();
			return false;
		};
	
		this.__refreshScrollPosition = function(row,direction)
		{
			if(!this.__isElementInView(row))
			{
				this.__scrollToRow(row,direction);
			}
		};
		
		this.__isElementInView = function(row)
		{
			var cellBottom = 0;
		    var parentBottom = 0;
		    var cellTop = 0;
		    var parentTop = 0;
			if(row)
			{
				var scrollParent = this.__nsGrid.__divCenterTableBodyContainer;
				var listChild = row;//.querySelector(".nsListChild");
				if(scrollParent && listChild)
				{
					var cellRect = listChild.getBoundingClientRect();
		            parentTop = 0;
		            var rectScrollParent = scrollParent.getBoundingClientRect();
		            parentBottom = rectScrollParent.height;
		            cellTop =  cellRect.top - rectScrollParent.top;
		            cellBottom = cellTop + cellRect.height;
				}
			}
			return cellBottom <= parentBottom && cellTop >= parentTop;
		};
	
		this.__scrollToRow = function(row,direction)
		{
			if(row)
			{
				var scrollParent = this.__nsGrid.__divCenterTableBodyContainer;
				var rowRect = row.getBoundingClientRect();
				var currentScroll = scrollParent.scrollTop;
				scrollParent.scrollTop = (direction === this.__nsGrid.NAVIGATION_UP) ? (currentScroll - rowRect.height) : (currentScroll + rowRect.height);
			}
			/*if(row)
			{
				var scrollParent = this.__nsGrid.__divCenterTableBodyContainer;
				var rowRect = row.getBoundingClientRect();
				var rowTop = rowRect.top;
				var rowBottom = rowTop + rowRect.height;
				var scrollParentHeight = scrollParent.getBoundingClientRect().height;
				var currentScroll = scrollParent.scrollTop;
				// scroll up
				if (rowTop < 0)// && 
				{
					scrollParent.scrollTop = currentScroll + rowTop;
					return;
				}
				// scroll down
				//else if (direction === this.__nsGrid.NAVIGATION_UP)//rowBottom  > scrollParentHeight
				//{
					var scrollAmount = rowBottom - scrollParentHeight;
					console.log(rowBottom + "-" + scrollParentHeight + " = " + scrollAmount)
					scrollParent.scrollTop = currentScroll + scrollAmount;
				//}
			}*/
		};
	
		this.__getkeyboardNavigationRow = function()
		{
			var row = null;
			if(this.__nsGrid.__enableVirtualScroll)
			{
				row = this.__nsGrid.__tblCenterBody.tBodies[0].querySelector(".nsRowHover");
			}
			else
			{
				row = this.__nsGrid.__getRowFromContainer(this.__nsGrid.__navigationIndex);
			}
			return row;
		};
		
		this.__virtualRowHover = function()
		{
			var arrRows = this.__nsGrid.__getBodyBodyRow(this.__nsGrid.__tblCenterBody);
			if(this.__nsGrid.__hasBodyRows() && arrRows.length > 0 && this.__nsGrid.__arrInternalSource)
			{
				var row = null;
				var index = null;
				var item = null;
				for(var count = 0; count < arrRows.length; count++) 
				{
					row = arrRows[count];
					index = this.__nsGrid.__getIndexFromRow(row);
					item = this.__nsGrid.__getItemByIndex(index);
					(item && item[this.__nsGrid.__fieldHover]) ? this.util.addStyleClass(row,"nsRowHover") : this.util.removeStyleClass(row,"nsRowHover");
				}
			}
		};
		
		this.__setVirtualRowHoverField = function(indexToSet)
		{
			if(this.util.isUndefinedOrNull(indexToSet))
			{
				indexToSet = -1;
			}
			var source = this.__nsGrid.__objGrid.__getFlatSource();
			if(source)
			{
				var item = null;
				for(var count = 0; count < source.length; count++) 
				{
					var item = source[count];
					if(item)
					{
						item[this.__nsGrid.__fieldHover] = (item[this.__nsGrid.__fieldIndex] === indexToSet); 
					}
				}
			}
		};
		
		this.__setVirtualRowHover = function(indexToSet)
		{
			if(this.__nsGrid.__enableVirtualScroll)
			{
				if(this.util.isUndefinedOrNull(indexToSet))
				{
					indexToSet = 0;
				}
				var item = this.__nsGrid.__getVisibleItemByIndex(null,indexToSet);
				if(item)
				{
					this.__nsGrid.__navigationIndex = indexToSet;
					var index = item[this.__nsGrid.__fieldIndex];
					this.__setVirtualRowHoverField(index);
					this.__virtualRowHover();
				}
				
			}
		};
		
		this.__setRowHover = function(indexToSet)
		{
			if(this.util.isUndefinedOrNull(indexToSet))
			{
				indexToSet = 0;
			}
			if(this.__nsGrid.__enableVirtualScroll)
			{
				this.__setVirtualRowHover(indexToSet);
			}
			else
			{
				if(this.util.isUndefinedOrNull(indexToSet))
				{
					indexToSet = 0;
				}
				this.__nsGrid.__navigationIndex = indexToSet;
				var row = this.__nsGrid.__getRowFromContainer(this.__nsGrid.__navigationIndex);
				this.util.addStyleClass(row,"nsRowHover");
			}
		};
	};
	return NSGridKeyboard;
})();
nsModuleExport(__nsGlobal,"NSGridKeyboard",NSGridKeyboard);

var NSGridSort = (function()
{
	var NSGridSort = function(nsGrid)
	{
		this.__nsGrid = nsGrid;
		this.util = this.__nsGrid.util;
		this.__arrFields = [];
		
		this.__CLASS_SORTING_ASC = "nsSortedAsc";
		this.__CLASS_SORTING_DESC = "nsSortedDesc";
		
		this.determineSortFunction = function(item,colItem)
		{
			return this.__determineSortFunction(item,colItem);
		};
		
		this.handle = function(header,columnDetail,isMultiColumnSort,customIsAscending)
		{
			this.__handleSorting(header,columnDetail,isMultiColumnSort,customIsAscending);
		};
		
		this.reset = function()
		{
			this.__resetColumnHeaders(false);
		};
		
		this.__handleSorting= function(header,columnDetail,isMultiColumnSort,customIsAscending)
		{
			if(header && columnDetail && columnDetail.sortable)
		    {
				var sortAscending = true;
				var isCustomSort = !this.util.isUndefined(customIsAscending);
				isMultiColumnSort = Boolean.parse(isMultiColumnSort);
				this.__nsGrid.__dispatchEvent(NSGrid.SORT_CHANGING,columnDetail,{columnDetail:columnDetail});
				if (this.util.hasStyleClass(header,this.__CLASS_SORTING_ASC) || this.util.hasStyleClass(header,this.__CLASS_SORTING_DESC))
				{
			        if(this.util.hasStyleClass(header,this.__CLASS_SORTING_ASC))
			        {
			             this.__removeAscendingIndicator(header,columnDetail);
			             sortAscending = false;
			        }
			        else if(this.util.hasStyleClass(header,this.__CLASS_SORTING_DESC))
			        {
			        	this.__removeDescendingIndicators(header,columnDetail);
				       	sortAscending = true;
			        }
				}
			   	else
			   	{
			   		sortAscending = !columnDetail.sortDescending;
			   	}
				if(!isMultiColumnSort)
				{
					this.__arrFields = [];
					this.__resetColumnHeaders(true);
				}
				var isColumnExisting = false;
				for(var count = 0;count < this.__arrFields.length;count++)
				{
					if(this.__arrFields[count]["field"] === columnDetail["sortField"])
					{
						isColumnExisting = true;
						this.__arrFields[count]["sortAscending"] = sortAscending;
					}
				}
				if(!isColumnExisting)
				{
					this.__arrFields.push({field:columnDetail.sortField,sortFunction:columnDetail.sortFunction,sortAscending:sortAscending});
				}
			   	//customIsAscending is passed it overrides the setting in columnDetail
			   	if(isCustomSort)
			   	{
			   		sortAscending = customIsAscending;
			   	}
			   	if(sortAscending)
			    {
			   		this.__addAscendingIndicator(header,columnDetail);
			    }
			   	else
			   	{
			   		this.__addDescendingIndicator(header,columnDetail);
			   	}
			   	if(this.__nsGrid.__enableHierarchical || this.__nsGrid.__enableGrouping || this.__nsGrid.__enableMasterDetail)
			   	{
			   		  this.__sortHierarchicalStructure(this.__nsGrid.__arrWrapper,this.__arrFields); 
			   		  this.__nsGrid.__objGrid.__setWrapperSource(this.__nsGrid.__arrWrapper,0,-1,0,false);
			   		  this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0);
			   	}
			   	else
			   	{
			   		  this.__sortArrOfObjectsByParam(this.__nsGrid.__arrWrapper,this.__arrFields);
			   		  this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(0);
			   	}
			   	//to stop error of horizontal scrollbar position getting reset when sorting
			   	var horScrollPos = 0;
			   	if(this.__nsGrid.__divCenterTableBodyContainer)
			   	{
					horScrollPos = this.__nsGrid.__divCenterTableBodyContainer.scrollLeft;
			   	}
			   	this.__nsGrid.resetFilters();
			   	this.__nsGrid.__renderBody(true,false);
			   	columnDetail[this.__nsGrid.__fieldColSortedAsc] = sortAscending;
			   	if(this.__nsGrid.__divCenterTableBodyContainer && horScrollPos > 0)
			   	{
			   		this.__nsGrid.__divCenterTableBodyContainer.scrollLeft = horScrollPos;
			   	}
			   	this.__nsGrid.__dispatchEvent(NSGrid.SORT_CHANGED,this.__arrFields,{fieldDetails:this.__arrFields});
		    }
			else
			{
				this.util.warning("NSGrid","This column is not sortable.");
			}
		};
	
		this.__sortHierarchicalStructure= function(dataSource,arrFields)
		{
			if(dataSource && dataSource.length > 0)
			{
				for(var count = 0;count < dataSource.length;count++)
				{
					var item = dataSource[count];
					if(this.__nsGrid.__isNodeLastParent(item))
					{
						this.__sortArrOfObjectsByParam(item[this.__nsGrid.__childField],arrFields);
					}
					else if(item[this.__nsGrid.__fieldHasChild])
					{
						this.__sortHierarchicalStructure(item[this.__nsGrid.__childField],arrFields);
					}
				}
			}
		};
		
		//This method is based on Stuart Langridge's "sorttable" code
		this.__determineSortFunction= function(item,colItem)
		{
			  var sortType = colItem.sortType;
			  var sortFunction = "__sortCaseInsensitive";
			  if(sortType == null)
			  {
				  var value = item.toString();
			      if(this.__isDate(item) || value.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/) || value.match(/^\d\d[\/-]\d\d[\/-]\d\d$/))
			      {
			          sortFunction = "__sortDate";
			      }
			      if (value.match(/^[$]/))
			      {
			          sortFunction = "__sortCurrency";
			      }
			      if (value.match(/^[\d\.]+$/) || value.match(/^[+-]?\d*\.?\d+([eE]-?\d+)?$/) || !isNaN(value))
			      {
			          sortFunction = "__sortNumeric";
			      }
			  }
			  else
			  {
				  var objVal = {"date": {func: "__sortDate"},"currency": {func: "__sortCurrency"},"number": {func: "__sortNumeric"},"string": {func: "__sortCaseInsensitive"}};
				  if(objVal[sortType.toLowerCase()])
				  {
					  sortFunction = objVal[sortType.toLowerCase()].func;
				  }
			  }
		      return sortFunction;
		};
	
		this.__sortArrOfObjectsByParam= function(arrToSort,arrFields)
		{
		    arrToSort.sort(function (item1, item2)
		    {
		        var retValue = 0;
		        var objField = null;
		        for (var count = 0; count < arrFields.length; count++) 
		        {
		        	objField = arrFields[count];
		        	if(objField["sortAscending"] == null || objField["sortAscending"] == undefined)
		     	    {
		        		objField["sortAscending"] = true;  // default to true
		     	    }
		        	if (typeof this[objField["sortFunction"]] === "function")
			        {
		        		retValue = this[objField["sortFunction"]](item1,item2,objField["field"],objField["sortAscending"]);
			        }
		        	if (retValue !== 0) 
		        	{
		        		break;
		        	}
		        }
		        return retValue;
		    }.bind(this));
		};
		
		this.__sortCaseInsensitive= function(item1, item2 , sortField, sortAscending)
		{
			if(!item1[sortField] && !item2[sortField])
			{
				return 0;
			}
			var retValue = -1;
			if(!item1[sortField])
			{
				retValue = -1;
			}
			else if(!item2[sortField])
			{
				retValue = 1;
			}
			else
			{
				var firstString = item1[sortField].toLowerCase();
			    var secondString = item2[sortField].toLowerCase();
			      
			    if(firstString == secondString)
			    {
			    	return 0;
			    }
			    if (firstString < secondString)
			    {
			        retValue = -1;
			    }
			    else
			    {
			        retValue = 1;
			    }
			}
			
		    if(sortAscending)
		    {
		        return retValue; 
		    }
		    return (retValue * -1);
		};
		 
		this.__sortDate= function(item1, item2 , sortField, sortAscending)
		{
		      // y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
		      var firstDateString = item1[sortField];
		      var secondDateString = item2[sortField];
		      var firstDate, secondDate, year = -1;
		      if(this.util.isUndefinedOrNull(firstDateString) || this.util.isUndefinedOrNull(secondDateString))
		      {
		    	  var retValue = -1;
		    	  if(this.util.isUndefinedOrNull(firstDateString) && this.util.isUndefinedOrNull(secondDateString))
			      {
			    	  retValue = 0;
			      }
		    	  if(this.util.isUndefinedOrNull(firstDateString))
		    	  {
		    		  retValue = -1;
				  }
				  else if(this.util.isUndefinedOrNull(secondDateString))
				  {
					  retValue = 1;
				  }
		    	  if(sortAscending)
				  {
		    		  return retValue; 
				  }
				  return (retValue * -1);
		      }
		      if(this.__isDate(firstDateString) && this.__isDate(secondDateString))
		      {
		    	  firstDate = this.__convertToDate(firstDateString);
		    	  secondDate = this.__convertToDate(secondDateString);
		    	  if(sortAscending)
		    	  {
		    		  if (firstDate > secondDate) 
		    		  {
		    			  return 1;
		    		  }
		    		  if (firstDate < secondDate)
		    		  {
		    			  return -1;
		    		  }
		    		  return 0;
		    	  }
		    	  else
		    	  {
		    		  if (firstDate > secondDate) 
		    		  {
		    			  return -1;
		    		  }
		    		  if (firstDate < secondDate)
		    		  {
		    			  return 1;
		    		  }
		    		  return 0;
		    	  }
		      }
		     
		      if (firstDateString.length == 10)
		      {
		           firstDate = firstDateString.substr(6,4) + firstDateString.substr(3,2) + firstDateString.substr(0,2);
		      }
		      else
		      {
		           year = firstDateString.substr(6,2);
		           if (parseInt(year) < 50)
		           {
		                year = "20" + year;
		           }
		           else
		           {
		                year = "19" + year;
		           }
		           firstDate = year + firstDateString.substr(3,2) + firstDateString.substr(0,2);
		      }
		     
		      if (secondDateString.length == 10)
		      {
		           secondDate = secondDateString.substr(6,4)+secondDateString.substr(3,2)+secondDateString.substr(0,2);
		      }
		      else
		      {
		           year = secondDateString.substr(6,2);
		           if (parseInt(year) < 50)
		           {
		                year = "20" + year;
		           }
		           else
		           {
		                year = "19" + year;
		           }
		           secondDate = year + secondDateString.substr(3,2) + secondDateString.substr(0,2);
		      }
		     
		      if (firstDate == secondDate)
		      {
		          return 0;
		      }
		      var retValue = -1;
		      if (firstDate < secondDate)
		      {
		          retValue = -1;
		      }
		      else
		      {
		          retValue = 1;
		      }
		      if(sortAscending)
		      {
		          return retValue; 
		      }
		      return (retValue * -1);
		};
	
		this.__sortCurrency= function(item1, item2 , sortField, sortAscending)
		{
		      var firstCurrency = item1[sortField].replace(/[^0-9.]/g,"");
		      var secondCurrency = item2[sortField].replace(/[^0-9.]/g,"");
		      if(sortAscending)
		      {
		          return parseFloat(firstCurrency) - parseFloat(secondCurrency); 
		      }
		      return parseFloat(secondCurrency) - parseFloat(firstCurrency);
		};
	
		this.__sortNumeric= function(item1, item2 , sortField, sortAscending)
		{
		      var firstNumber = parseFloat(item1[sortField]);
		      if (isNaN(firstNumber))
		      {
		          firstNumber = 0;
		      }
		      var secondNumber = parseFloat(item2[sortField]);
		      if (isNaN(secondNumber))
		      {
		          secondNumber = 0;
		      }
		      if(sortAscending)
		      {
		          return (firstNumber - secondNumber);
		      }
		      return (secondNumber - firstNumber);
		};
		
		this.__isDate = function(value) 
		{
			if (Object.prototype.toString.call(value) === '[object Date]') 
			{
				return true;
			}
			if (typeof value.replace === 'function') 
			{
			    value.replace(/^\s+|\s+$/gm, '');
			}
			var dateFormat = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
			var retValue = dateFormat.test(value);
			if(!retValue)
			{
				value = this.__formatDateString(value);
				var parsedDate = Date.parse(value);
				if (isNaN(value) && !isNaN(parsedDate)) 
				{
					retValue = true;
				}
			}
			return retValue;
		};
		
		this.__convertToDate = function(value) 
		{
			var retValue = null;
			if(!this.util.isUndefinedOrNull(value))
		    {
				value = this.__formatDateString(value);
				retValue = new Date(value);
		    }
		    return retValue;
		};
		
		this.__formatDateString = function(value)
		{
			if(this.util.isString(value))
		    {
				//For conditions where date comes like (from sqlserver convert(varchar,date,100)) "May 16 2016  2:25PM" 
				//then new Date returns nan.It should be like "May 16 2016  2:25 PM"
				var ampm = null;
				ampm = ((value.indexOf("AM") > -1) ? "AM" : ((value.indexOf("PM") > -1) ? "PM" : null));
				if(ampm)
				{
					var index = value.indexOf(ampm);
					if(value.charAt(index-1) != " ")
					{
						value = value.substring(0,index) + " " + ampm;
					}
				}
		    }
			return value;
		};
		/******************************Create Sort Components*******************************/
		this.__addAscendingIndicator = function(target,columnDetail)
		{
		     if(target)
		     {
		    	 this.__setSortIcons(target,true,false,columnDetail);
		         this.util.addStyleClass(target,this.__CLASS_SORTING_ASC);
		     }
		};
	
		this.__removeAscendingIndicator= function(target,columnDetail)
		{
		     if(target)
		     {
		          this.util.removeStyleClass(target,this.__CLASS_SORTING_ASC);
		          this.__setSortIcons(target,false,false,columnDetail);
		     }
		};
	
		this.__addDescendingIndicator= function(target,columnDetail)
		{
		    if(target)
		    {
		    	this.__setSortIcons(target,false,true,columnDetail);
		        this.util.addStyleClass(target,this.__CLASS_SORTING_DESC);
		    }
		};
	
		this.__removeDescendingIndicators= function(target,columnDetail)
		{
		     if(target)
		     {
		    	 this.util.removeStyleClass(target,this.__CLASS_SORTING_DESC);
		    	 this.__setSortIcons(target,false,false,columnDetail);
		     }
		};
	
		this.__resetIndicators= function(target,columnDetail)
		{
		     if(target)
		     {
		          this.__removeAscendingIndicator(target,columnDetail);
		          this.__removeDescendingIndicators(target,columnDetail);
		          this.__setSortIcons(target,true,true,columnDetail);
		     }
		};
	
		this.__resetColumnHeaders= function(isInternal)
		{
		     var headerBodyRow = this.__nsGrid.__getHeaderBodyRow(this.__nsGrid.__tblCenterHeader);
		     if (!headerBodyRow)
		     {
		          return;
		     }
		     var headers = headerBodyRow.cells;
		     for (var colCount = 0; colCount < headers.length; colCount++)
		     {
		          this.__resetIndicators(headers[colCount]);
		     }
		     if(isInternal)
		     {
		    	 for (var colCount = 0; colCount < this.__nsGrid.__columns.length; colCount++)
			     {
			    	 this.__nsGrid.__columns[colCount][this.__nsGrid.__fieldColSortedAsc] = null;
			     }
		     }
		};
	
		this.__setSortIcons= function(target,isAscVisible,isDescVisible,columnDetail)
		{
			if(target)
			{
				if(!columnDetail)
				{
					var columnIndex = parseInt(target.getAttribute("currentColumnIndex"));
					columnDetail = this.__nsGrid.__getColumnObject(columnIndex);
				}
				if(columnDetail && this.__nsGrid.__isSortingIconCustom(columnDetail))
				{
					var divSorting = target.querySelector(".nsGridSortContainer");
					if(divSorting)
					{
						divSorting.innerHTML = "";
						if(isAscVisible)
						{
							divSorting.innerHTML += this.__nsGrid.__getColumnCustomIcon(columnDetail,"sortAscending");
						}
						if(isDescVisible)
						{
							divSorting.innerHTML += this.__nsGrid.__getColumnCustomIcon(columnDetail,"sortDescending");
						}
					}
				}
				else
				{
					if(isAscVisible != null)
					{
						 var divSortAsc = document.getElementById(target.getAttribute("id") + "SortAsc");
						 if(divSortAsc)
						 {
							 divSortAsc.style.display = isAscVisible ? "" : "none";
						 }
					}
					if(isDescVisible != null)
					{
						 var divSortDesc = document.getElementById(target.getAttribute("id") + "SortDesc");
						 if(divSortDesc)
						 {
							 divSortDesc.style.display = isDescVisible ? "" : "none";
						 }
					}
				}
			}
		};
		/******************************End of Create Sort Components*******************************/
	};
	return NSGridSort;
})();
nsModuleExport(__nsGlobal,"NSGridSort",NSGridSort);

var NSGridColumnResize = (function()
{
	var NSGridColumnResize = function(nsGrid)
	{
		this.__nsGrid = nsGrid;
		this.util = this.__nsGrid.util;
		
		//cell which is being resized
		this.__resizingHeader = null;
		this.__resizingHeaderCell = null;
		this.__resizingBodyCell = null;
		this.__resizeHandler = null;
		this.__resizeIndicatorMouseDownInterval = -1;
		this.__resizeIndicatorMouseDownCount = 0;
		
		this.__doResizeRef = null;
		this.__endResizeRef = null;
		
		this.autoResize = function(index)
		{
			if(index > -1)
			{
				var objColumn = this.__nsGrid.__getColumnObject(index);
				if(objColumn)
				{
					if(objColumn["autoSize"]) 
					{
						var preferredWidth = this.__getPreferredWidthForColumn(objColumn);
						if(preferredWidth > 0)
						{
							var cellIndex = objColumn[this.__nsGrid.__fieldColIndex];
							var resizingHeaderCell = this.__getHeaderTopCell(null,cellIndex);
							var resizingBodyCell = this.__getBodyTopCell(null,cellIndex);
							this.__resize(this.__nsGrid.__tblCenterHeader,resizingHeaderCell,preferredWidth,objColumn);
							this.__resize(this.__nsGrid.__tblCenterBody,resizingBodyCell,preferredWidth,objColumn);
							this.__handleColumnResize();
							this.__nsGrid.__dispatchEvent(NSGrid.COLUMN_RESIZED,objColumn,objColumn);
						}
					}
					else 
					{
						this.util.warning("NSGrid","This column with dataField " + objColumn.dataField + " is not autosizable.");
					}
				}
				else {
					this.util.warning("NSGrid","This column details was not found.");
				}
			}
		};
		
		this.addResizeIndicator = function(row,cell,divCellContainer,objColumn,colID)
		{
			 if(objColumn["resizable"])
			 {
				var divResize = this.util.createDiv(null,"nsColumnResizeIndicator");
				this.util.addStyleClass(divResize,"nsColumnResizeIndicatorTheme");
				divResize.title = "Drag to resize the column " + objColumn.headerText;
				//divResize.style.height = this.__nsGrid.__getViewportHeight() + "px";
				//divResize.style.borderRight = '2px solid #0000ff';
				var resizeEventHandler = this.__resizeEventHandler.bind(this);
				//this.util.addEvent(divResize,"mouseover",resizeEventHandler);
				//this.util.addEvent(divResize,"mouseout",resizeEventHandler);
				this.util.addEvent(divResize,"mousedown",resizeEventHandler);
				this.util.addEvent(divResize,"click",resizeEventHandler);
				this.util.addEvent(divResize,"dblclick",resizeEventHandler);
				divCellContainer.appendChild(divResize);
				this.__nsGrid.__addTouchEvent(divResize);
			 }
		};
		
		this.startResize = function(event,target)
		{
			/*if(!this.__nsGrid.__onGridLine)
			{
				return;
			}*/
			this.__nsGrid.__isColumnResizing = true;
			this.util.removeEvent(target,"click",this.__nsGrid.__headerClickRef);
			this.__nsGrid.__headerClickRef = null;
		    this.util.removeEvent(target,"mouseover",this.__nsGrid.__headerMouseOverRef);
		    this.__nsGrid.__headerMouseOverRef = null;
		    this.util.removeEvent(target,"mouseout",this.__nsGrid.__headerMouseOutRef);
		    this.__nsGrid.__headerMouseOutRef = null;
		    this.__nsGrid.__removeTouchEvent(target);
			
			this.__resizingHeader = target;
			this.__resizingHeaderCell = this.__getHeaderTopCell(target);
			this.__resizingBodyCell = this.__getBodyTopCell(target);
			var objColumn = this.__nsGrid.__getColumnObject(this.__resizingHeader.getAttribute("currentColumnIndex"));
			this.__nsGrid.__dispatchEvent(NSGrid.COLUMN_RESIZING,objColumn,objColumn);
			this.__createResizeHandler(event);
			
			this.__doResizeRef = this.__doResize.bind(this);
			this.__endResizeRef = this.__endResize.bind(this);
			this.util.addEvent(document,"mousemove",this.__doResizeRef);
			this.util.addEvent(document,"mouseup",this.__endResizeRef);
			
			event.stopImmediatePropagation();
		};
		
		this.__resize = function(table,cell,desirableWidth,objColumn)
		{
			var cellPaddingLeft = this.util.getDimensionAsNumber(cell,cell.style.paddingLeft);
			var cellPaddingRight = this.util.getDimensionAsNumber(cell,cell.style.paddingRight);
			var pad = parseInt(cellPaddingLeft,10) + parseInt(cellPaddingRight,10);
			if(!objColumn && this.__resizingHeader)
			{
				objColumn = this.__nsGrid.__getColumnObject(this.__resizingHeader.getAttribute("currentColumnIndex"));
			}
			var minWidth = this.__nsGrid.__columnMinWidth;
			if(objColumn)
			{
				minWidth = objColumn["minWidth"];
			}
			var setWidth = Math.max((desirableWidth - pad), minWidth);
			if(objColumn)
			{
				objColumn["width"] = setWidth + "px";
			}
			cell.style.width = setWidth + "px";
		};
	
		this.__doResize = function(event)
		{
			//putting this check as somehow the document evenlistener is not getting detached
			if(!this.__resizingHeader)
			{
				return;
			}
			this.util.makeBodyUnselectable();
			event = this.util.getEvent(event);
			this.__resizeHandler.style.left = this.__getResizeLeftPos(event) + "px";
			
			return false;
		};
	
		this.__endResize = function(event)
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
			this.util.removeEvent(selectedHeader,"mouseout",this.__nsGrid.__headerMouseOutRef);
			this.__nsGrid.__headerMouseOutRef = null;
			this.util.removeEvent(selectedHeader,"click",this.__nsGrid.__headerClickRef);
			this.__nsGrid.__headerClickRef = null;
			this.__nsGrid.__removeTouchEvent(selectedHeader);
			this.util.makeBodySelectable();
			event = this.util.getEvent(event);
			var selectedHeader = this.__resizingHeader;
			var tableHeader = this.__nsGrid.__tblCenterHeader;
			var tableBody = this.__nsGrid.__tblCenterBody;
			var posEvent = this.util.getEventPosition(event,this.__nsGrid.__divCenterTableBodyContainer);
			var desiredWidth = posEvent.left - this.util.getCumulativeOffset(selectedHeader).x;
			this.__resize(tableHeader,this.__resizingHeaderCell,desiredWidth);
			this.__resize(tableBody,this.__resizingBodyCell,desiredWidth);
			if(this.__resizeHandler)
			{
				this.__nsGrid.__divOuterContainer.removeChild(this.__resizeHandler);
			}
			var column = this.__resizingHeader;
			this.__resizingHeader = null;
			this.__resizingHeaderCell = null;
			this.__resizingBodyCell = null;
			this.__resizeHandler = null;
			event.stopImmediatePropagation();
			this.__handleColumnResize();
			var objColumn = this.__nsGrid.__getColumnObject(column.getAttribute("currentColumnIndex"));
			this.__nsGrid.__dispatchEvent(NSGrid.COLUMN_RESIZED,objColumn,objColumn);
			this.__nsGrid.__isColumnResizing = false;
		};
		
		this.__resizeEventHandler = function(event)
		{
			var stopEventPropogation = function()
			{
				event.stopPropagation();
				event.preventDefault();
				event.stopImmediatePropagation();
			};
			event = this.util.getEvent(event);
			var target = this.util.getTarget(event);
			var resizeIndicator = target;
		    target = this.util.findParent(target,"TD");
		    var colIndex = parseInt(target.getAttribute("currentColumnIndex"));
		    //var objColumn = this.__nsGrid.__getColumnObject(colIndex);
			switch(event.type)
			{
				/*case "mouseover":
					if(this.util.hasStyleClass(resizeIndicator,"nsColumnResizeIndicator"))
					{
						var height = this.__nsGrid.__getViewportHeight();
						if(height != resizeIndicator.offsetHeight)
						{
							resizeIndicator.style.height = height + "px";
						}
						resizeIndicator.style.borderRight = '2px solid #0000ff';
					}
				break;
				case "mouseout":
					if(this.util.hasStyleClass(resizeIndicator,"nsColumnResizeIndicator"))
					{
						resizeIndicator.style.borderRight = '';
					}
				break;*/
				case "mousedown":
					var self = this;
					this.__resizeIndicatorMouseDownCount++;
					if (this.__resizeIndicatorMouseDownInterval != -1)
					{
						clearTimeout(this.__resizeIndicatorMouseDownInterval);
						this.__resizeIndicatorMouseDownInterval = -1;
					}
					this.__resizeIndicatorMouseDownInterval = setTimeout(
						function()
						{
							if(self.__resizeIndicatorMouseDownCount > 1)
							{
								self.autoResize(colIndex);
							}
							else
							{
								self.startResize(event,target);
								/*var headerRect = headerCell.getBoundingClientRect();
								var headerHeight = headerCell.offsetHeight;
								var startOffset = headerRect.left - 6;
							    var startWidth = parseInt(headerRect.width, 10);
							    this.__resizeIndicatorHandler.style.top = headerRect.top + "px";
							    this.__resizeIndicatorHandler.style.left = (startOffset + startWidth) + "px";
							    this.__resizeIndicatorHandler.style.height = headerHeight + "px";
								this.__lastHeaderCell = headerCell;*/
							}
							self.__resizeIndicatorMouseDownCount = 0;
						},500);
					stopEventPropogation();
				break;
				case "mouseleave":
				break;
				case "click":
					stopEventPropogation();
				break;
				case "dblclick":
					stopEventPropogation();
				break;
			}
		};
		
		this.__createResizeHandler = function(event)
		{
			this.__resizeHandler = this.util.createDiv(null,"nsResizeHandle");
			this.util.addStyleClass(this.__resizeHandler,"nsResizeHandle" + this.__nsGrid.__theme);
			this.__resizeHandler.style.top = this.util.getCumulativeOffset(this.__resizingHeader,this.__nsGrid.__divTableWrapper).y + "px";
			this.__resizeHandler.style.left = this.__getResizeLeftPos(event) + "px";
			var scrollBarWidth = this.util.getScrollBarWidth(this.__nsGrid.__divCenterTableBodyContainer);
			this.__resizeHandler.style.height = (this.__nsGrid.__divCenterTableHeaderContainer.offsetHeight + this.__nsGrid.__divCenterTableBodyContainer.offsetHeight - scrollBarWidth) + "px";
			var maxZIndex = this.util.getMaxZIndex(this.__resizingHeader); 
			if(maxZIndex > 0)
			{
				this.__resizeHandler.style.zIndex = maxZIndex + 1;
			}
			this.__nsGrid.__divOuterContainer.appendChild(this.__resizeHandler);
		};
		
		this.__getResizeLeftPos = function(event)
		{
			event = this.util.getEvent(event);
			var left = 0;
			var scrollContainer = this.__nsGrid.__getHorizontalScrollableContainer();
			var hasHorizontalScrollbar = scrollContainer.scrollWidth > scrollContainer.clientWidth;
			if(hasHorizontalScrollbar)
			{
				var containerLeft = this.util.getOffSetByRect(this.__nsGrid.__divOuterContainer).left;
			    left = (event.pageX - containerLeft + scrollContainer.scrollLeft);
			}
			else
			{
				var posEvent = this.util.getEventPosition(event);
				left = posEvent.left;
			}
		    return left;
		};
	
		this.__getHeaderTopCell = function(cell,cellIndex)
		{
			if(cell || !this.util.isUndefinedOrNull(cellIndex))
			{
				var index = cell ? cell.cellIndex : cellIndex;
				var headerRow = this.__nsGrid.__getHeaderHeaderRow(this.__nsGrid.__tblCenterHeader);
				if(headerRow && headerRow.cells.length > 0)
				{
					var headerCells = headerRow.cells;
					return headerCells[index];
				}
			}
			return null;
		};
	
		this.__getBodyTopCell = function(cell,cellIndex)
		{
			if(cell || !this.util.isUndefinedOrNull(cellIndex))
			{
				var index = cell ? cell.cellIndex : cellIndex;
				var bodyRow = this.__nsGrid.__getBodyHeaderRow(this.__nsGrid.__tblCenterBody);
				if(bodyRow && bodyRow.cells.length > 0)
				{
					var bodyCells = bodyRow.cells;
					return bodyCells[index];
				}
			}
			return null;
		};
		
		this.__handleColumnResize = function()
		{
			this.__nsGrid.__alignTables(false);
			if(this.__nsGrid.__enableVirtualScroll)
			{
				//this.__nsGrid.__setVirtualVariables(false,false,false,false);
			}
			//this.__nsGrid.__setFixedCellsPosition();
			this.__nsGrid.__addStyleForFixedColumns();
		};
		
		this.__getPreferredWidthForColumn = function(objColumn)
		{
			if(objColumn)
			{
				var self = this;
				var addRows = function(sourceTable)
				{
					var arrRows = sourceTable.tBodies[0].rows;
					for(var count = 0;count < arrRows.length;count++)
					{
						var sourceRow = arrRows[count];
						//Ignore Filter Row
						if(sourceRow && !self.util.hasStyleClass(sourceRow,"nsGridFilterRow") && sourceRow.cells && sourceRow.cells.length)
						{
							var row = document.createElement("TR");
							var cell = row.insertCell(-1);
							cell.innerHTML = sourceRow.cells[objColumn[self.__nsGrid.__fieldColIndex]].innerHTML;
							cell.style.whiteSpace = "nowrap";
							cell.style.width = "";
							var arrChildren = cell.querySelectorAll(".nsTruncateToFit");
							for(var childCount = 0;childCount < arrChildren.length;childCount++)
							{
								var child = arrChildren[childCount];
								self.util.removeStyleClass(child,"nsTruncateToFit");
							}
							body.appendChild(row);
						}
					}
				};
				var dummyTable = this.__nsGrid.__tblCenterBody.cloneNode(false);
				dummyTable.setAttribute("id","nsDummyTable");
				dummyTable.style.width = "auto";
				var body = document.createElement("tbody");
				dummyTable.appendChild(body);
				addRows(this.__nsGrid.__tblCenterHeader);
				addRows(this.__nsGrid.__tblCenterBody);
				//this.__nsGrid.__divCenterTableBodyContainer.appendChild(dummyTable);
				document.body.appendChild(dummyTable);
				var preferredWidth = dummyTable.getBoundingClientRect().width;
				//this.__nsGrid.__divCenterTableBodyContainer.removeChild(dummyTable);
				document.body.removeChild(dummyTable);
				//+1 so that headers doesnot wordwrap
				return preferredWidth + 5;
			}
			return 0;
		};
	};
	return NSGridColumnResize;
})();
nsModuleExport(__nsGlobal,"NSGridColumnResize",NSGridColumnResize);

var NSGridColumnMove = (function()
{
	var NSGridColumnMove = function(nsGrid)
	{
		this.__MIN_DRAG_OFFSET = 100;
		
		this.__nsGrid = nsGrid;
		this.util = nsGrid.util;
		
		this.__objColumnDrag = null;
		this.__lastDragEvent = null;
		this.__lastDragInfo = null;
		this.__isColumnDragged = false;
		this.__scrollLeft = false;
	    this.__scrollRight = false;
		this.__dragColumnMoveRef = null;
		this.__dragColumnEndRef = null;
		this.__scrollInterval = null;
		this.__animationSteps = null;
		this.__moveAttempts = 0;
		this.__scrollableContainer = null;
		this.__maxZIndex = 0;
		
		this.handle = function(event,target)
		{
			this.__maxZIndex = this.util.getMaxZIndex(target);
			this.__scrollableContainer = this.__nsGrid.__getHorizontalScrollableContainer();
			this.__startColumnMove(event,target);
		};
		
		this.__startColumnMove = function(event,target)
		{
			//should be merging __onGridLine and __isColumnResizing
			if(this.__nsGrid.__isColumnResizing || this.__nsGrid.__onGridLine)
			{
				return;
			}
			var objColumn = this.__nsGrid.__getColumnObject(target.getAttribute("currentColumnIndex"));
			var columnIndex = this.__nsGrid.__getColumnIndexByObject(objColumn);
			if(columnIndex > -1)
			{
				this.__nsGrid.__dispatchEvent(NSGrid.COLUMN_MOVING,objColumn,{columnDetail:objColumn,columnIndex:columnIndex});
				this.__lastDragEvent = event;
				this.__isColumnDragged = true;
				this.__objColumnDrag = {};
				this.__objColumnDrag.source = target;
				this.__objColumnDrag.objColumn = objColumn;
				this.__objColumnDrag.columnIndex = columnIndex;
				var position = this.util.getEventPosition(event,this.__nsGrid.__divCenterTableHeaderContainer);
				this.__objColumnDrag.dragElement = this.__createCopyItem(target,position);
				this.__objColumnDrag.dragElementAdded = false;
				this.__objColumnDrag.position = position;
				this.__dragColumnMoveRef = this.__dragColumnMoveHandler.bind(this);
				this.__dragColumnEndRef = this.__dragColumnEndHandler.bind(this);
				this.util.addEvent(document,"mousemove",this.__dragColumnMoveRef);
				this.util.addEvent(document,"mouseup",this.__dragColumnEndRef);
			}
			event.preventDefault();
		};
	
		this.__dragColumnMoveHandler = function(event)
		{
			event = this.util.getEvent(event);
			var direction = this.__getDragDirection(event);
			this.__lastDragEvent = event;
			
			var position = this.util.getEventPosition(event);
			var leftOffset = this.__objColumnDrag.position.left - position.left;
		    var topOffset = this.__objColumnDrag.position.top - position.top;
		    var dragRadius = (leftOffset * leftOffset) + (topOffset * topOffset);
		    if(!this.__objColumnDrag.dragElementAdded && dragRadius > this.__MIN_DRAG_OFFSET)
		    {
		    	document.body.appendChild(this.__objColumnDrag.dragElement);
		    	this.__objColumnDrag.dragElementAdded = true;
		    }
		    this.__positionDragElement(event);
		    /*var posEvent = this.util.getEventPosition(event);
		    this.__objColumnDrag.dragElement.style.left = posEvent.left + "px";
	        this.__objColumnDrag.dragElement.style.top = posEvent.top + "px";*/
		    if(this.__objColumnDrag.lastDropTarget)
		    {
		    	this.util.removeStyleClass(this.__objColumnDrag.lastDropTarget,"nsDottedCell"); 
		    	this.__objColumnDrag.lastDropTarget = null;
		    }
		    var target = this.util.getTarget(event);
		    var element = this.util.findParentBySelector(target,"." + this.__nsGrid.__CLASS_TABLE_HEADER_DROPPABLE_CELL);
		    if(element != this.__objColumnDrag.source)
		    {
		    	this.util.addStyleClass(element,"nsDottedCell");   
		    	this.__objColumnDrag.lastDropTarget = element;
		    }
		    var objDrag = this.__getDragInfoObject(event,direction);
		    this.__handleScrollMovement(objDrag);
		    event.preventDefault();
		};
	
		this.__dragColumnEndHandler = function(event)
		{
			this.__lastDragEvent = null;
			this.__isColumnDragged = false;
			this.__stopScrollAnimation();
			if(this.__objColumnDrag.lastDropTarget)
		    {
		    	this.util.removeStyleClass(this.__objColumnDrag.lastDropTarget,"nsDottedCell"); 
		    	this.__objColumnDrag.lastDropTarget = null;
		    }
			this.util.removeEvent(document,"mousemove",this.__dragColumnMoveRef);
			this.__dragColumnMoveRef = null;
			this.util.removeEvent(document,"mouseup",this.__dragColumnEndRef);
			this.__dragColumnEndRef = null;
			if(this.__objColumnDrag.dragElementAdded)
			{
				var position = this.util.getEventPosition(event);
				position.top = position.top + this.__nsGrid.__divCenterTableHeaderContainer.scrollTop;
				position.left = position.left + this.__nsGrid.__divCenterTableHeaderContainer.scrollLeft;
				var tablePosition = this.util.getOffSet(this.__nsGrid.__tblCenterHeader);
				if (position.top < tablePosition.top || position.top > (tablePosition.top + this.__nsGrid.__tblCenterHeader.offsetHeight)) 
				{
					this.util.addStyleClass(this.__objColumnDrag.dragElement,"nsGhostHeader");
					var transitionEndCallback = function()
					{
						this.__removeDragElement();
					};
					var transition = new this.util.transition(this.__objColumnDrag.dragElement,transitionEndCallback.bind(this));
					this.__objColumnDrag.dragElement.style.left = (this.__objColumnDrag.position.left - this.__nsGrid.__divCenterTableHeaderContainer.scrollLeft) + "px"; //position.left + "px";
					this.__objColumnDrag.dragElement.style.top = (this.__objColumnDrag.position.top ) + "px";
				    return;
				}
				var targetIndex = this.__getHeaderColumnByPosition(position);
			    if (targetIndex > -1 && targetIndex != this.__objColumnDrag.columnIndex) 
			    {
			    	this.__nsGrid.moveColumn(this.__objColumnDrag.columnIndex,targetIndex);
			    }
			    this.__removeDragElement();
			}
			this.__nsGrid.__dispatchEvent(NSGrid.COLUMN_MOVED,this.__objColumnDrag.objColumn,{columnDetail:this.__objColumnDrag.objColumn,columnIndex:this.__objColumnDrag.columnIndex});
		};
		
		this.__createCopyItem = function(target,position)
		{
			var divDrag = null;
			if(target && position)
			{
				divDrag = this.util.createDiv(this.__nsGrid.getID() + "Drag",this.__nsGrid.__CLASS_TABLE_HEADER_CELL);
				this.util.addStyleClass(divDrag , "nsDataGridHeaderDrag");
				this.util.addStyleClass(divDrag , "nsDataGridHeaderDrag" + this.__nsGrid.__theme);
				divDrag.innerHTML = target.innerHTML;
				divDrag.style.left = (position.left) + "px";
				divDrag.style.top = (position.top) + "px";
				//giving 50px padding to the width if width is very less
				divDrag.style.width = (target.offsetWidth + 50) + "px";
				divDrag.style.height = target.offsetHeight + "px";
				if(this.__maxZIndex > 0)
				{
					divDrag.style.zIndex = this.__maxZIndex + 1;
				}
			}
			return divDrag;
		};
		
		this.__positionDragElement = function(event)
		{
			var posEvent = this.util.getEventPosition(event);
			var rectDragElement = this.__objColumnDrag.dragElement.getBoundingClientRect();
	        var objDimension = this.util.getDocumentDimension();
	        var browserWidth = objDimension.width - 2;
	        var browserHeight = objDimension.height - 2;
	        // put DragElement vertically in middle of cursor
	        var yPos = posEvent.top - (rectDragElement.height / 2);
	        var xPos = posEvent.left;
	        if (browserWidth > 0) 
	        {
	            if ((xPos + this.__objColumnDrag.dragElement.clientWidth) > browserWidth) 
	            {
	            	xPos = browserWidth - this.__objColumnDrag.dragElement.clientWidth;
	            }
	        }
	        if (browserHeight > 0) 
	        {
	            if ((yPos + this.__objColumnDrag.dragElement.clientHeight) > browserHeight) 
	            {
	            	yPos = browserHeight - this.__objColumnDrag.dragElement.clientHeight;
	            }
	        }
	        xPos = Math.max(0,xPos);
	        yPos = Math.max(0,yPos);
	        this.__objColumnDrag.dragElement.style.left = xPos + "px";
	        this.__objColumnDrag.dragElement.style.top = yPos + "px";
		};
		
		this.__removeDragElement = function()
		{
			if(this.__objColumnDrag && this.__objColumnDrag.dragElement)
			{
				document.body.removeChild(this.__objColumnDrag.dragElement);
				this.__objColumnDrag.dragElement = null;
			}
		};
	
		this.__getHeaderColumnByPosition = function(position) 
		{
			var headerBodyRow = this.__nsGrid.__getHeaderBodyRow(this.__nsGrid.__tblCenterHeader);
			if(headerBodyRow)
			{
				var headerBodyRowCells = headerBodyRow.cells;
			    for (var count = 0; count < headerBodyRowCells.length; count++) 
			    {
			    	var cell = headerBodyRowCells[count];
			    	if(this.util.hasStyleClass(cell,this.__nsGrid.__CLASS_TABLE_HEADER_DROPPABLE_CELL))
			    	{
			    		var rowPosition = this.util.getOffSet(cell);
				    	if (rowPosition.left <= position.left && position.left <= rowPosition.left + headerBodyRowCells[count].offsetWidth) 
				    	{
				    		return count;
				    	}
			    	}
			    }
			    return -1;
			}
		};
		
		/*Horizontal Scroll Logic for Edge cases */
		this.__getDragDirection = function(event) 
		{
		    var direction = null;
		    if (this.__lastDragEvent.clientX > event.clientX) 
		    {
		        direction = "left";
		    }
		    else if (this.__lastDragEvent.clientX < event.clientX) 
		    {
		        direction = "right";
		    }
		    return direction;
		};
	
		this.__getDragInfoObject = function(event,direction) 
		{
		    // localise x and y to the target component
		    var rect = this.__nsGrid.__divCenterTableHeaderContainer.getBoundingClientRect();
		    var x = event.clientX - rect.left;
		    var y = event.clientY - rect.top;
		    var objDragInfo = 
		    {
		        event: event,
		        x: x,
		        y: y,
		        direction: direction
		    };
		    return objDragInfo;
		};
	
		this.__handleScrollMovement = function(objDragInfo) 
		{
			this.__lastDragInfo = objDragInfo;
		    if (!objDragInfo || !objDragInfo.direction) 
		    {
		        return;
		    }
		    var adjustedScrollPos = this.__getAdjustedScrollPosition(objDragInfo);
		    this.__setScrollVariables(adjustedScrollPos);
		};
	
		this.__getAdjustedScrollPosition = function(objDragInfo) 
		{
			return objDragInfo.x + this.__scrollableContainer.scrollLeft;
		};
	
		this.__setScrollVariables = function (adjustedScrollPos) 
		{
		    if (this.__scrollableContainer) 
		    {
		        //below logic checks if the scroll should move right or left
		        var xPosLeft = this.__scrollableContainer.scrollLeft;
		        var xPosRight = xPosLeft + this.__scrollableContainer.clientWidth;
		        this.__scrollLeft = adjustedScrollPos < (xPosLeft + 50);
		        this.__scrollRight = adjustedScrollPos > (xPosRight - 100);
		        if(this.__scrollLeft || this.__scrollRight) 
		        {
		            this.__startScrollAnimation();
		        }
		        else 
		        {
		            this.__stopScrollAnimation();
		        }
		    }
		};
	
		this.__startScrollAnimation = function() 
		{
		    if (!this.__scrollInterval) 
		    {
		        this.__animationSteps = 0;
		        this.__moveAttempts = 0;
		        this.__scrollInterval = setInterval(this.__scrollBody.bind(this), 100);
		        if (this.__scrollLeft) 
		        {
		        	this.__setIcon("left",true);
		            //this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_LEFT, true);
		        }
		        else 
		        {
		        	this.__setIcon("right",true);
		            //this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_RIGHT, true);
		        }
		    }
		};
		
		this.__stopScrollAnimation = function () 
		{
		    if (this.__scrollInterval) 
		    {
		        clearInterval(this.__scrollInterval);
		        this.__scrollInterval = null;
		        this.__setIcon("move",false);
		        //this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_MOVE);
		    }
		};
	
		this.__scrollBody = function() 
		{
		    var pixelsToMove;
		    this.__animationSteps++;
		    pixelsToMove = 10 + (this.__animationSteps * 5);
		    if (pixelsToMove > 100) 
		    {
		        pixelsToMove = 100;
		    }
		    var pixelsMoved = 0;
		    if (this.__scrollLeft) 
		    {
		        pixelsMoved = this.__scrollBodyHorizontally(-pixelsToMove);
		    }
		    else if (this.__scrollRight) 
		    {
		        pixelsMoved = this.__scrollBodyHorizontally(pixelsToMove);
		    }
		    if (pixelsMoved !== 0) 
		    {
		        this.__handleScrollMovement(this.__lastDragInfo);
		        this.__moveAttempts = 0;
		    }
		    else 
		    {
		        this.__moveAttempts++;
		        if (this.__moveAttempts > 7) 
		        {
		            if (this.__scrollLeft) 
		            {
		                //this.columnController.setColumnPinned(this.__lastDragInfo.dragItem, column_1.Column.PINNED_LEFT);
		            }
		            else 
		            {
		                //this.columnController.setColumnPinned(this.__lastDragInfo.dragItem, column_1.Column.PINNED_RIGHT);
		            }
		            this.__pushScroll();
		        }
		    }
		};
	
		this.__scrollBodyHorizontally = function(pixels) 
		{
		    var oldScrollPosition = this.__scrollableContainer.scrollLeft;
		    this.__scrollableContainer.scrollLeft = oldScrollPosition + pixels;
		    var newScrollPosition = this.__scrollableContainer.scrollLeft;
		    return newScrollPosition - oldScrollPosition;
		};
	
		this.__pushScroll = function() 
		{
		    if (this.__isColumnDragged) 
		    {
		        this.__handleScrollMovement(this.__lastDragEvent);
		    }
		};
		
		this.__setIcon = function(iconName,animate)
		{
			if(iconName)
			{
				var divDrag = this.__objColumnDrag.dragElement;
				var divMove = divDrag.querySelector(".nsHeaderMove");
				var objSVG = new NSSvg();
				var iconID = null;
				switch(iconName) 
				{
			         case "left":
			        	 iconID = new NSSvgShapes().__MOVE_ICON_ID;
			             break;
			         case "right":
			        	 iconID = new NSSvgShapes().__RIGHT_ICON_ID;
			             break;
			         case "move":
			        	 iconID = new NSSvgShapes().__LEFT_ICON_ID;
			             break;
			         default:
			        	 iconID = null;
			             break;
				}
				if(divMove)
				{
					this.util.removeAllChildren(divMove);
					if(iconID)
					{
						var containerID = divMove.getAttribute("id");
						if(!containerID)
						{
							containerID = this.util.getUniqueId();
						}
						var svg = objSVG.addSVG(divMove,containerID + iconID + "svg","nsMoveIcon",null,null,null,null,null,null,false);
						this.util.addStyleClass(svg,"nsMoveIconTheme");
						objSVG.addUse(svg,containerID + "use",null,"#" + iconID);
					}
					animate ? this.util.addStyleClass(divMove,"nsAnimateLeftToRight") : this.util.removeStyleClass(divMove,"nsAnimateLeftToRight");
				}
			}
		};
		/*End of Horizontal Scroll Logic for Edge cases */
	};
	return NSGridColumnMove;
})();
nsModuleExport(__nsGlobal,"NSGridColumnMove",NSGridColumnMove);

var NSGridFilter = (function()
{
	var NSGridFilter = function(nsGrid)
	{
		this.SEARCH_INTERVAL = 500;
		this.__nsGrid = nsGrid;
		this.__enableApply = true;
		this.__isOrFilter = false;
		
		this.util = nsGrid.util;
		this.isFiltered = false;
		this.__interval = null;
		this.__objControl = {};
		this.__filteredColumn = [];
		this.__objAdvancedFilterSetting = {};
		this.__nsPopUp = null;
		this.__maxZIndex = -1;
		this.__documentClickRef = null;
		this.__documentKeyUpRef = null;
		
		this.processColumnObject = function(objColumn)
		{
			if(this.__nsGrid.__enableFilter)
			{
				if(objColumn.hasOwnProperty("enableFilter"))
				{
					objColumn.enableFilter = Boolean.parse(objColumn["enableFilter"]);
				}
				else
				{
					objColumn.enableFilter = true;
				}
				if(objColumn.enableFilter)
				{
					var objFilter = objColumn["filter"];
					if(objFilter)
					{
						if(objFilter.hasOwnProperty("filterRenderer"))
						{
							var filterRenderer = objFilter["filterRenderer"];
							if (typeof filterRenderer === "string" || filterRenderer instanceof String)
							{
								if(this.util.isFunction(filterRenderer))
								{
									objFilter.filterRenderer = this.__nsGrid.__context[filterRenderer];
								}
							}
						}
						else if(objFilter.hasOwnProperty("filterTemplate") && objFilter["filterTemplate"])
						{
							objFilter.filterTemplate = this.util.getTemplate(objFilter["filterTemplate"]);
						}
						else if(objFilter.hasOwnProperty("type") && objFilter["type"] == NSGrid.FILTER_TYPE_DATE)
						{
							this.__setDefaultDatePicker();
							objFilter.filterDateComponent = new this.__nsGrid.__components["datePicker"]();
						}
						else 
						{
							objFilter.filterRenderer = this.__defaultRenderer.bind(this);
						}
						if(this.__nsGrid.__enableAdvancedFilter)
						{
							if(objFilter.hasOwnProperty("enableAdvancedFilter"))
							{
								objFilter.enableAdvancedFilter = Boolean.parse(objFilter["enableAdvancedFilter"]);
							}
							else
							{
								objFilter.enableAdvancedFilter = true;
							}
							objFilter["advancedFilterType"] = objFilter["advancedFilterType"] ? objFilter["advancedFilterType"] : NSGrid.ADVANCED_FILTER_TEXT;
							if(objFilter.hasOwnProperty("advancedFilterHandler"))
							{
								var advancedFilterHandler = objFilter["advancedFilterHandler"];
								if (typeof advancedFilterHandler === "string" || advancedFilterHandler instanceof String)
								{
									if(this.util.isFunction(advancedFilterHandler))
									{
										objFilter.advancedFilterHandler = this.__nsGrid.__context[advancedFilterHandler];
									}
								}
							}
						}
						else
						{
							objFilter.enableAdvancedFilter = false;
						}
					}
					else
					{
						objColumn["filter"] = {filterRenderer:this.__defaultRenderer.bind(this),enableAdvancedFilter:this.__nsGrid.__enableAdvancedFilter,advancedFilterType:NSGrid.ADVANCED_FILTER_TEXT};
					}
				}
			}
		};
		
		this.addFilterRenderer = function(rendererRow,rendererCell,colItem,colIndex,colID)
		{
			if(this.__nsGrid.__enableFilter && colItem && colItem["enableFilter"])
			{
				var objFilter = colItem["filter"];
				if(objFilter)
				{
					var divHeaderRendererContainer = this.util.createDiv(colID + "rendererContainer","nsFilterParentContainer"); 
					rendererCell.appendChild(divHeaderRendererContainer);
					var dataField = colItem["dataField"];
					var type = objFilter["type"];
					var templateRenderer = objFilter["filterTemplate"];
					var itemRenderer = objFilter["filterRenderer"];
					var dateComponent = objFilter["filterDateComponent"];
					if(dateComponent && type == NSGrid.FILTER_TYPE_DATE)
					{
						var config = objFilter["config"] || {};
						this.dateRenderer(dateComponent,dataField,divHeaderRendererContainer,config,objFilter,this.dateSelectedHandler.bind(this,objFilter));
						this.__objControl[dataField] = {control:dateComponent,config:config,type:"date"};
					}
					else if(itemRenderer)
					{
						var objRenderer = itemRenderer(colItem,colIndex,rendererCell,rendererRow);
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
					}
					else if(templateRenderer)
					{
						divHeaderRendererContainer.appendChild(templateRenderer.cloneNode(true));
					}
					if(objFilter && objFilter["enableAdvancedFilter"])
					{
						var rendererID = this.__getRendererID(dataField);
						var divFilterIconContainer = this.util.createDiv(rendererID + "FilterIconContainer","nsFilterIconContainer");
						divFilterIconContainer.setAttribute("field",dataField);
						this.util.addEvent(divFilterIconContainer,"click",this.__filterIconClickHandler.bind(this));
						if(this.__nsGrid.__getColumnCustomIcon(colItem,"filter"))
						{
							divFilterIconContainer.innerHTML = this.__nsGrid.__getColumnCustomIcon(colItem,"filter");
						}
						else
						{
							var objSVG = new NSSvg();
							var filterID = new NSSvgShapes().__FILTER_ICON_ID;
							var svg = objSVG.addSVG(divFilterIconContainer,rendererID + "filtersvg","nsFilterIconSVG",null,null,null,null,null,null,true);
							objSVG.addUse(svg,rendererID + "use",null,"#" + filterID);
						}
						this.util.addStyleClass(divHeaderRendererContainer,"nsAdvancedFilterParentContainer");
						divHeaderRendererContainer.appendChild(divFilterIconContainer);
					}
				}
			}
		};
		
		this.dateRenderer = function(dateComponent,dataField,parent,config,objFilter,dateSelectedHandler)
		{
			config.dateSelectedHandler = this.dateSelectedHandler.bind(this,objFilter,config);//dateSelectedHandler;
			dateComponent.init(config);
			var element = dateComponent.getElement();
			if(element)
			{
				element.setAttribute("field",dataField);
				parent.appendChild(element);
				dateComponent.elementAdded();
			}
			else
			{
				this.util.warning("NSGrid","Date Component UI is null.");
			}
		};
		
		this.dateSelectedHandler = function(objFilter,config,isTyping)
		{
			var dateComponent = objFilter["filterDateComponent"];
			if(dateComponent)
			{
				var date = dateComponent.getDate();
				var target = this.util.getTarget(event);
				//clear advanced Filter object if coming from normal filter
				if(!this.__nsPopUp)
				{
					var dataField = target.getAttribute("field");
					if(dataField)
					{
						this.__objAdvancedFilterSetting[dataField] = null;
					}
				}
				if(isTyping)
				{
					clearTimeout(this.__interval);
					var base = this;
					this.__interval = setTimeout(function(){
							base.__filterGrid.bind(base)();
					}, this.SEARCH_INTERVAL);
				}
				else
				{
					this.__filterGrid.bind(this)();
				}
			}
		};
		
		this.setFiltersInControls = function(filter)
		{
			if(this.__nsGrid.__enableFilter && this.__objControl && filter)
			{
				 for(var field in this.__objControl)
				 {
					 if(filter[field])
				     {
						 var control = this.__objControl[field];
						 if(control && control.control)
						 {
							 if(control.type == "date")
							 {
								 control.control.setDate(filter[field]);
							 }
							 else if(control.type == "text")
							 {
								 control.control.value = filter[field];
							 }
						 }
				     }
				 }
			}
		};
		
		this.resetFilters = function()
		{
			if(this.__nsGrid.__enableFilter && this.__objControl)
			{
				 for(var field in this.__objControl)
				 {
					 var control = this.__objControl[field];
					 if(control && control.control)
					 {
						 if(control.type == "date" && control.control.getDate())
						 {
							 control.control.setDate(null);
						 }
						 else if(control.type == "text" && control.control.value)
						 {
							 control.control.value = "";
						 }
					 }
				 }
				 this.__resetFiltering();
			}
		};
		
		this.remove = function()
		{
			if(this.__documentClickRef)
			{
				this.util.removeEvent(document,"click", this.__documentClickRef, false);
				this.__documentClickRef = null;
			}
			if(this.__documentKeyUpRef)
			{
				this.util.removeEvent(document,"keyup", this.__documentKeyUpRef, false);
				this.__documentKeyUpRef = null;
			}
		};
		
		this.clearFilters = function() 
		{
			 for(var field in this.__objControl)
			 {
				 var control = this.__objControl[field];
				 if(control && control.control)
				 {
					 if(control.type == "date" && control.control.getDate())
					 {
						 control.control.setDate(null);
					 }
					 else if(control.type == "text" && control.control.value)
					 {
						 control.control.value = "";
					 }
				 }
			 }
			 this.__objAdvancedFilterSetting = {};
		};
		
		this.resetVariables = function() 
		{
			this.__filteredColumn = [];
			this.__objAdvancedFilterSetting = [];
		};
		
		this.__initialize = function()
		{
			if(!this.__documentClickRef)
			{
				this.__documentClickRef = this.__documentClickHandler.bind(this);
				this.util.addEvent(document,"click", this.__documentClickRef);
			}
			if(!this.__documentKeyUpRef)
			{
				this.__documentKeyUpRef = this.__documentKeyUpHandler.bind(this);
				this.util.addEvent(document,"keyup", this.__documentKeyUpRef);
			}
			this.__maxZIndex = this.util.getMaxZIndex();
			this.__injectInNSGrid();
		};
		
		this.__defaultRenderer = function(colItem,colIndex,cell,row)
		{
			if(colItem)
			{
				var objFilter = colItem["filter"];
				var dataField = colItem["dataField"];
				var headerText = colItem["headerText"];
				var rendererID = this.__getRendererID(dataField);
				var divRenderer = this.util.createDiv(rendererID,"nsFilterContainer");
				var txtFilter = this.util.createElement("input","txt" + rendererID,"nsFilter");
				//this.util.addStyleClass(txtFilter,"nsSearchInlineTextBox");
				txtFilter.setAttribute("type","search");
				txtFilter.setAttribute("autocomplete","off");
				txtFilter.setAttribute("field",dataField);
				//txtFilter.setAttribute("placeholder","Search " + headerText);
				this.util.addEvent(txtFilter,"input",this.__txtInputChangeHandler.bind(this));
				//this.util.addEvent(txtFilter,"search",this.__txtInputChangeHandler.bind(this));
				//var divSearch = this.util.getSearchTextBox(txtFilter);
				//txtFilter.style.width = (cell.offsetWidth / 2) + "px";
				divRenderer.appendChild(txtFilter);
				this.__objControl[dataField] = {control:txtFilter,type:"text"};
				return divRenderer;
			}
			return null;
		};
		
		this.__txtInputChangeHandler = function(event)
		{
			var target = this.util.getTarget(event);
			var dataField = target.getAttribute("field");
			if(dataField)
			{
				this.__objAdvancedFilterSetting[dataField] = null;
			}
			clearTimeout(this.__interval);
			var base = this;
			this.__interval = setTimeout(function(){
					base.__filterGrid.bind(base)();
				}, this.SEARCH_INTERVAL);
		};
		
		this.__filterIconClickHandler = function(event)
		{
			var target = this.util.getTarget(event);
			target = this.util.getWebComponentElement(target);
			if(target && !this.util.hasStyleClass(target,"nsFilterIconContainer"))
			{
				target = this.util.findParentBySelector(target,".nsFilterIconContainer");
			}
			var dataField = target.getAttribute("field");
			var objColumn = this.__nsGrid.__getColumnObjectByDataField(dataField);
			var objFilter = objColumn["filter"];
			if(this.__nsPopUp)
			{
				this.__removePopUp();
			}
			var control = this.__objControl[dataField];
			if(control && control.control)
			{
				(control.type == "date") ? control.control.setDate(null) : control.control.value = "";
			}
			var colID = this.__getRendererID(dataField);
			var popUpPos = objFilter["advancedFilterPopUpPos"];
			if(!popUpPos)
			{
				popUpPos = this.util.POS_BOTTOMLEFT;
				if(objColumn[this.__nsGrid.__fieldColIndex] === 0 || (this.__nsGrid.__enableGrouping && objColumn[this.__nsGrid.__fieldColIndex] === 1))
				{
					popUpPos = this.util.POS_BOTTOMRIGHT; 
				}
			}
			var popUpSetting = {id:colID + "detailFilterContainer",type:"div",width:275,position:popUpPos,closeOnOutsideClick:true};
			this.__nsPopUp = new this.util.nsPopUp(popUpSetting);
			this.__nsPopUp.create();
			var popUp = this.__nsPopUp.getPopUp();
			if(this.__maxZIndex > 0)
			{
				popUp.style.zIndex = this.__maxZIndex + 1;
			}
			this.util.addEvent(popUp,"click",this.__detailFilterClickHandler.bind(this));
			var advancedFilterType = objFilter["advancedFilterType"];
			if(objFilter.advancedFilterHandler)
			{
				objFilter.advancedFilterHandler(dataField,this.__nsPopUp,this.__objAdvancedFilterSetting,this.__getRendererID(dataField),this.__enableApply,
						this.__createApplySection.bind(this),this.__advanceFilterGrid.bind(this),this.__removePopUp.bind(this));
			}
			else if(advancedFilterType === NSGrid.ADVANCED_FILTER_TEXT)
			{
				this.__getTextDetailFilter(dataField,objFilter);
			}
			else if(advancedFilterType === NSGrid.ADVANCED_FILTER_NUMBER)
			{
				this.__getNumberDetailFilter(dataField,objFilter);
			}
			else if(advancedFilterType === NSGrid.ADVANCED_FILTER_LIST)
			{
				this.__getListDetailFilter(dataField,objFilter);
			}
			else if(advancedFilterType === NSGrid.ADVANCED_FILTER_DATE)
			{
				this.__getDateDetailFilter(dataField,objFilter);
			}
			this.__nsPopUp.show();
			this.__nsPopUp.placePopUp(event);
			//event.stopImmediatePropagation();
			event.stopPropagation();
		};
		
		this.__filterGrid = function()
		{
			 var conditionFilter = null;
			 if(this.__isOrFilter)
			 {
				 var filter = [];
				 var setting = {};
				 for(var field in this.__objControl)
				 {
					 var control = this.__objControl[field];
					 if(control && control.control)
					 {
						 if(control.type == "date" && control.control.getDate())
						 {
							 var item = {};
							 item[field] = control.control.getDate();
							 var config = control.config || {};
							 setting[field] = {matchType:"equals",type:"date"};
							 for(var key in config)
							 {
								 if(this.util.isUndefined(setting[field][key]))
								 {
									 setting[field][key] = config[key];
								 }
							 }
							 filter.push(item);
						 }
						 else if(control.type == "text" && control.control.value)
						 {
							 var item = {};
							 item[field] = control.control.value;
							 setting[field] = {caseSensitive:false,multiline:false,matchType:new NSFilter().CONTAINS};
							 filter.push(item);
						 }
					 }
				 }
				 conditionFilter = filter;
			 }
			 else
			 {
				 var filter = {};
				 var setting = {};
				 for(var field in this.__objControl)
				 {
					 var control = this.__objControl[field];
					 if(control && control.control)
					 {
						 if(control.type == "date" && control.control.getDate())
						 {
							 filter[field] = control.control.getDate();
							 var config = control.config || {};
							 setting[field] = {matchType:"equals",type:"date"};
							 for(var key in config)
							 {
								 if(this.util.isUndefined(setting[field][key]))
								 {
									 setting[field][key] = config[key];
								 }
							 }
						 }
						 else if(control.type == "text" && control.control.value)
						 {
							 filter[field] = control.control.value;
							 setting[field] = {caseSensitive:false,multiline:false,matchType:new NSFilter().CONTAINS};
						 }
					 }
				 }
				 conditionFilter = Object.keys(filter);
			 }
			 var isReset = false;
			 if(filter && conditionFilter && conditionFilter.length > 0)
			 {
				 this.__handleFiltering(filter,setting);
			 }
			 else
			 {
				 this.__resetFiltering();
				 isReset = true;
			 }
			 this.__nsGrid.__callFunctionInsideGridType("afterFiltering",isReset);
		};
		
		this.__advanceFilterGrid = function()
		{
			 var fieldSetting = null;
			 var field = null;
			 var conditionFilter = null;
			 if(this.__isOrFilter)
			 {
				 var filter = [];
				 var setting = {};
				 var item = null;
				 for(field in this.__objAdvancedFilterSetting)
				 {
					 fieldSetting = this.__objAdvancedFilterSetting[field];
					 if(fieldSetting)
					 {
						 if(fieldSetting.type == NSGrid.ADVANCED_FILTER_DATE)
						 {
							 item = {};
							 item[field] = new Date();
							 filter.push(item);
							 var config = fieldSetting.config || {};
							 setting[field] = {matchType1:fieldSetting.firstSelectValue,firstDate:fieldSetting.firstDate,operation:fieldSetting.operationSelectValue,
									 matchType2:fieldSetting.secondSelectValue,secondDate:fieldSetting.secondDate,
									 type:NSGrid.ADVANCED_FILTER_DATE};
							 for(var key in config)
							 {
								 if(this.util.isUndefined(setting[field][key]))
								 {
									 setting[field][key] = config[key];
								 }
							 }
							
						 }
						 else if(fieldSetting["arrText"] && fieldSetting["arrTextField"])
						 {
							 var arrTextField = fieldSetting["arrTextField"];
							 var arrText = fieldSetting["arrText"];
							 var length = arrText.length;
							 filter[field] = [];
							 for(var count = 0;count < length;count++)
							 {
								 item = {};
								 item[field] = arrText[count][arrTextField];
								 filter.push(item);
							 }
							 setting[field] = {caseSensitive:fieldSetting.caseSensitive,multiline:false,matchType:fieldSetting.matchType};
						 }
						 else
						 {
							 item = {};
							 item[field] = fieldSetting.text;
							 filter.push(item);
							 setting[field] = {caseSensitive:fieldSetting.caseSensitive,multiline:false,matchType:fieldSetting.matchType};
						 }
					 }
				 }
				 conditionFilter = filter;
			 }
			 else
			 {
				 var filter = {};
				 var setting = {};
				 for(field in this.__objAdvancedFilterSetting)
				 {
					 fieldSetting = this.__objAdvancedFilterSetting[field];
					 if(fieldSetting)
					 {
						 if(fieldSetting.type == NSGrid.ADVANCED_FILTER_DATE)
						 {
							 filter[field] = new Date();
							 var config = fieldSetting.config || {};
							 setting[field] = {matchType1:fieldSetting.firstSelectValue,firstDate:fieldSetting.firstDate,operation:fieldSetting.operationSelectValue,
									 matchType2:fieldSetting.secondSelectValue,secondDate:fieldSetting.secondDate,
									 type:NSGrid.ADVANCED_FILTER_DATE};
							 for(var key in config)
							 {
								 if(this.util.isUndefined(setting[field][key]))
								 {
									 setting[field][key] = config[key];
								 }
							 }
						 }
						 else if(fieldSetting["arrText"] && fieldSetting["arrTextField"])
						 {
							 var arrTextField = fieldSetting["arrTextField"];
							 var arrText = fieldSetting["arrText"];
							 var length = arrText.length;
							 filter[field] = [];
							 for(var count = 0;count < length;count++)
							 {
								 filter[field].push(arrText[count][arrTextField]);
							 }
							 setting[field] = {caseSensitive:fieldSetting.caseSensitive,multiline:false,matchType:fieldSetting.matchType};
						 }
						 else
						 {
							 filter[field] = fieldSetting.text;
							 setting[field] = {caseSensitive:fieldSetting.caseSensitive,multiline:false,matchType:fieldSetting.matchType};
						 }
					 }
				 }
				 conditionFilter = Object.keys(filter);
			 }
			 var isReset = false;
			 if(filter && conditionFilter && conditionFilter.length > 0)
			 {
				 this.__handleFiltering(filter,setting);
			 }
			 else
			 {
				 this.__resetFiltering();
				 isReset = true;
			 }
			 this.__nsGrid.__callFunctionInsideGridType("afterFiltering",isReset);
		};
		
		this.__handleFiltering = function(filter,setting,enableHighlighting,recordLimit)
		{
			if(this.__nsGrid.__enableFilter)
			{
				var eventParam = {filter:filter,setting:setting,recordLimit:recordLimit};
				this.__nsGrid.__dispatchEvent(NSGrid.FILTER_CHANGING,eventParam,eventParam);
				this.__filteredColumn = [];
				if(filter)
			    {
					 if(this.util.isUndefinedOrNull(enableHighlighting))
					 {
						enableHighlighting = true;
					 }
					 var isHierarchical = false;
					 var source = this.__nsGrid.__arrWrapper;
					 if(this.__nsGrid.__enableHierarchical || this.__nsGrid.__enableGrouping || this.__nsGrid.__enableMasterDetail)
					 {
						 isHierarchical = true;
					 }
				   	 var nsFilter = new NSFilter(source,filter,setting,recordLimit,isHierarchical,this.__nsGrid.__childField,
				   			 this.__nsGrid.__filterFunction,this.__nsGrid.__hierarchyFilterChildrenFunction,
				   			 (this.__nsGrid.__objGrid.__ignoreFieldsForDeepCopy && this.__nsGrid.__objGrid.__ignoreFieldsForDeepCopy())
				   	 );
				   	 this.__nsGrid.__arrInternalSource = nsFilter.execute();
				   	 this.__nsGrid.__arrFilteredGroupedSource =  this.__nsGrid.__arrInternalSource.slice(0);
				   	 if(enableHighlighting)
				   	 {
					   	 if(filter instanceof Array) 
				  	     {
					   		 for (var count = 0; count < filter.length; count++) 
					         {
					 	   		var item = filter[count];
					 	   		var key = Object.keys(item)[0];
					 	   		var colItem = this.__nsGrid.__getColumnObjectByDataField(key);
					 	   		this.__filteredColumn.push({field:key,text:item[key],item:colItem});
					         }
				  	     }
				  		 else if(typeof(filter) === "object") 
				  	     {
				  	        for(var key in filter) 
				  	        {
				  	        	var colItem = this.__nsGrid.__getColumnObjectByDataField(key);
				  	        	this.__filteredColumn.push({field:key,text:filter[key],item:colItem});
				  	        }
				  	     }
				   	 }
				   	 if(isHierarchical)
				   	 {
				   		this.__nsGrid.__objGrid.__setWrapperSource(this.__nsGrid.__arrInternalSource,0,-1,0,false);
				   		this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0); 
				   	 }
				   	 this.__nsGrid.__updateTotalRecords();
				   	 this.__nsGrid.__updateVisibleIndexByRow(this.__nsGrid.__arrInternalSource);
				   	 this.__nsGrid.__renderBody(false,true);
				   	 this.isFiltered = true;
				   	 this.__nsGrid.__dispatchEvent(NSGrid.FILTER_CHANGED,eventParam,eventParam);
			    }
			}
		};
	
		this.__resetFiltering = function()
		{
			if(this.__nsGrid.__enableFilter)
			{
				if(this.__nsGrid.__dataSource)
				{
					this.__nsGrid.__dispatchEvent(NSGrid.FILTER_CHANGING,null,null);
					this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrWrapper.slice(0);
					this.__nsGrid.__arrFilteredGroupedSource =  this.__nsGrid.__arrInternalSource.slice(0);
					this.__filteredColumn = [];
					if(this.__nsGrid.__enableHierarchical || this.__nsGrid.__enableGrouping || this.__nsGrid.__enableMasterDetail)
					{
						this.__nsGrid.__objGrid.__setWrapperSource(this.__nsGrid.__arrInternalSource,0,-1,0,false);
						this.__nsGrid.__arrInternalSource = this.__nsGrid.__arrFlatHierarchicalSource.slice(0); 
					}
					this.__nsGrid.__updateTotalRecords();
					this.__nsGrid.__updateVisibleIndexByRow(this.__nsGrid.__arrInternalSource);
					this.__nsGrid.__renderBody(false,true);
					this.isFiltered = false;
					this.__nsGrid.__dispatchEvent(NSGrid.FILTER_CHANGED,null,null);
					this.__nsGrid.__dispatchEvent(NSGrid.FILTER_RESETTED,null,null);
					//this.unHighlightText();
				}
			}
		};
	
		this.__highlightDiv = function(divText,colIndex)
		{
			var length = this.__filteredColumn.length;
			for (var count = 0; count < length; count++) 
		    {
				var item = this.__filteredColumn[count].item;
				if(item)
				{
					var type = (item.filter && item.filter.type) ? item.filter.type : "text";
					if(type == "text" && item[this.__nsGrid.__fieldColIndex] === colIndex)
					{
						var text = this.__filteredColumn[count].text;
						this.util.highlightText(divText,text,"nsTextHighlight");
					}
				}
		    }
		};
		
		this.__documentClickHandler = function(event) 
		{
			event = this.util.getEvent(event);
			this.__removePopUp();
			this.__nsGrid.__dispatchEvent(NSGrid.ADVANCED_FILTER_CLOSING);
			/*var target = this.util.getTarget(event);
			if(!(target && target.getAttribute("id") && target.getAttribute("id").endsWith("FilterIconContainer")))
			{
				this.__removePopUp();
				this.util.preventDefault(event);
			}*/
		};
	
	
		this.__documentKeyUpHandler = function(event) 
		{
			event = this.util.getEvent(event);
			if(event.keyCode === this.util.KEYCODE.ESC) 
			{
				this.__removePopUp();
				this.__nsGrid.__dispatchEvent(NSGrid.ADVANCED_FILTER_CLOSING);
			}
		};
		
		this.__detailFilterClickHandler = function(event)
		{
			event = this.util.getEvent(event);
			event.stopImmediatePropagation();
		};
		
		this.__removePopUp = function()
		{
			if(this.__nsPopUp)
			{
				this.__nsPopUp.remove();
				this.__nsPopUp = null;
			}
		};
		
		this.__getTextDetailFilter = function(dataField,objFilter)
		{
			var self = this;
			var txtInputChangeHandler = function()
			{
				clearTimeout(self.__interval);
				self.__interval = setTimeout(function(){
						handleTextFilter();
					}, self.SEARCH_INTERVAL);
			};
			var handleTextFilter = function()
			{
				var item = null;
				var text = null;
				if(txtFilter.value && txtFilter.value !== "")
				{
					text = txtFilter.value;
					item = {text:text,caseSensitive:chkSensitive.checked,matchType:arrOptions[cmbFilter.selectedIndex].value,sensitiveChecked:chkSensitive.checked,
							optionIndex:cmbFilter.selectedIndex,textInputText:txtFilter.value,type:NSGrid.ADVANCED_FILTER_TEXT};
				}
				self.__objAdvancedFilterSetting[dataField] = item;
				self.__advanceFilterGrid.bind(self)();
				if(self.__enableApply)
				{
					self.__removePopUp();
				}
			};
			var resetTextFilter = function()
			{
				self.__objAdvancedFilterSetting[dataField] = null;
				self.__advanceFilterGrid.bind(self)();
				self.__removePopUp();
			};
			var createSelect = function(arrSource,strID,prevField)
			{
				var divSelect = self.util.createElement("span",colID + strID + "detailFilterSelectContainer");
				var cmbFilter = self.util.createElement("select",colID + strID + "detailFilterSelect","nsFilterSelect");
				cmbFilter.style.height = "25px";
				var option = null;
				var item = null;
				var label = null;
				for(var count = 0;count < arrSource.length;count++)
				{
					item = arrSource[count];
					option = document.createElement("option");
					label = document.createTextNode(item["label"]);
					option.appendChild(label);
					option.setAttribute("value", item["id"]);
					cmbFilter.appendChild(option);
				}
				if(objPrev && objPrev[prevField])
				{
					cmbFilter.selectedIndex = objPrev[prevField];
				}
				divSelect.style.display = "inline-block";
				divSelect.style.width = "40%";
				divSelect.appendChild(cmbFilter);
				divUpperContainer.appendChild(divSelect);
				return cmbFilter;
			};
			var createCheckbox = function(text,strID,prevField)
			{
				var divCheckbox = self.util.createElement("span",colID + strID + "detailFilterCheckboxContainer");
				var label = self.util.createElement("label",colID + strID + "detailFilterLabel",null);
				var checkbox = self.util.createElement("input",colID + strID + "detailFilterCheckbox",null);
				checkbox.setAttribute("type","checkbox");
				label.appendChild(checkbox);
				if(text)
				{
					label.appendChild(document.createTextNode(text));
				}
				if(objPrev && objPrev[prevField])
				{
					checkbox.setAttribute("checked",true);
				}
				label.style.fontWeight = "400";
				label.style.cursor = "pointer";
				checkbox.style.marginRight = "5px";
				divCheckbox.style.paddingTop = "5px";
				divCheckbox.style.display = "inline-block";
				divCheckbox.appendChild(label);
				divLowerContainer.appendChild(divCheckbox);
				return checkbox;
			};
			var nsFilter = new NSFilter();
			var arrOptions = [{id:1,label:"Contains",value:nsFilter.CONTAINS},
			                  {id:2,label:"Exact",value:nsFilter.EXACT},
			                  {id:3,label:"Starts With",value:nsFilter.STARTS_WITH},
			                  {id:4,label:"Ends With",value:nsFilter.ENDS_WITH}];
			var objPrev = this.__objAdvancedFilterSetting[dataField];
			var colID = this.__getRendererID(dataField);
			var divDetailFilterContainer = this.__nsPopUp.getPopUp();
			//divDetailFilterContainer.style.width = "275px";
			divDetailFilterContainer.style.padding = "10px";
			var divUpperContainer = this.util.createDiv(colID + "detailFilterUpperContainer");
			divUpperContainer.style.paddingBottom = "8px";
			var divLowerContainer = this.util.createDiv(colID + "detailFilterLowerContainer");
			var cmbFilter = createSelect(arrOptions,"options","optionIndex");
			var divTextInput = this.util.createElement("span",colID + "detailFilterTextInputContainer");
			divTextInput.style.float = "right";
			divTextInput.style.width = "60%";
			var txtFilter = this.util.createElement("input",colID + "detailFilterTextInput","nsFilterTextInput");
			txtFilter.setAttribute("placeholder", "Enter Value here");
			txtFilter.style.width = "100%";
			if(objPrev && objPrev["textInputText"])
			{
				txtFilter.value = objPrev["textInputText"];
			}
			//var divSearch = this.util.getSearchTextBox(txtFilter);
			//this.util.addStyleClass(divSearch,"nsFilterSearchTextBox");
			divTextInput.appendChild(txtFilter);
			divUpperContainer.appendChild(divTextInput);
			var chkSensitive = createCheckbox("Case Sensitive","sensitive","sensitiveChecked");
			if(this.__enableApply)
			{
				this.__createApplySection.bind(this)(colID,divLowerContainer,handleTextFilter,resetTextFilter);
			}
			else
			{
				this.util.addEvent(chkSensitive,"click",handleTextFilter);
				this.util.addEvent(cmbFilter,"change",handleTextFilter);
				this.util.addEvent(txtFilter,"keyup",txtInputChangeHandler);
			}
			divDetailFilterContainer.appendChild(divUpperContainer);
			divDetailFilterContainer.appendChild(divLowerContainer);
		};
		
		this.__getNumberDetailFilter = function(dataField,objFilter)
		{
			var self = this;
			var txtInputChangeHandler = function()
			{
				clearTimeout(self.__interval);
				self.__interval = setTimeout(function(){
						handleNumberFilter();
					}, self.SEARCH_INTERVAL);
			};
			var handleNumberFilter = function()
			{
				var item = null;
				var text = null;
				if(txtFilter.value && txtFilter.value !== "")
				{
					text = arrOptions[cmbFilter.selectedIndex].sign + txtFilter.value;
					item = {text:text,caseSensitive:false,matchType:new NSFilter().CONTAINS,index:cmbFilter.selectedIndex,textInputText:txtFilter.value,type:NSGrid.ADVANCED_FILTER_NUMBER};
				}
				self.__objAdvancedFilterSetting[dataField] = item;
				self.__advanceFilterGrid.bind(self)();
				if(self.__enableApply)
				{
					self.__removePopUp();
				}
			};
			var resetNumberFilter = function()
			{
				self.__objAdvancedFilterSetting[dataField] = null;
				self.__advanceFilterGrid.bind(self)();
				self.__removePopUp();
			};
			
			var arrOptions = [{id:1,label:"<=",toolTip:"Less than Equals To",sign:"<="},
			                  {id:2,label:">=",toolTip:"Greater than Equals To",sign:">="},
			                  {id:3,label:"<",toolTip:"Less than",sign:"<"},
			                  {id:4,label:">",toolTip:"Greater than",sign:">"},
			                  {id:5,label:"=",toolTip:"Equals",sign:""}];
			var objPrev = this.__objAdvancedFilterSetting[dataField];
			var colID = this.__getRendererID(dataField);
			var divDetailFilterContainer = this.__nsPopUp.getPopUp();
			//divDetailFilterContainer.style.width = "225px";
			divDetailFilterContainer.style.padding = "10px";
			var divUpperContainer = this.util.createDiv(colID + "detailFilterUpperContainer");
			divUpperContainer.style.paddingBottom = "8px";
			var divLowerContainer = this.util.createDiv(colID + "detailFilterLowerContainer");
			var divSelect = this.util.createElement("span",colID + "detailFilterSelectContainer");
			var cmbFilter = this.util.createElement("select",colID + "detailFilterSelect","nsFilterSelect");
			cmbFilter.style.height = "25px";
			divSelect.style.display = "inline-block";
			divSelect.style.width = "20%";
			var option = null;
			var item = null;
			var label = null;
			for(var count = 0;count < arrOptions.length;count++)
			{
				item = arrOptions[count];
				option = document.createElement("option");
				label = document.createTextNode(item["label"]);
				option.appendChild(label);
				//option.setAttribute("text", item["label"]);
				option.setAttribute("value", item["id"]);
				cmbFilter.appendChild(option);
			}
			if(objPrev && objPrev["index"])
			{
				cmbFilter.selectedIndex = objPrev["index"];
			}
			divSelect.appendChild(cmbFilter);
			divUpperContainer.appendChild(divSelect);
			var divTextInput = this.util.createElement("span",colID + "detailFilterTextInputContainer");
			var txtFilter = this.util.createElement("input",colID + "detailFilterTextInput","nsFilterTextInput");
			txtFilter.setAttribute("placeholder", "Enter Value here");
			if(objPrev && objPrev["textInputText"])
			{
				txtFilter.value = objPrev["textInputText"];
			}
			divTextInput.style.float = "right";
			divTextInput.style.width = "80%";
			txtFilter.style.width = "100%";
			divTextInput.appendChild(txtFilter);
			divUpperContainer.appendChild(divTextInput);
			if(this.__enableApply)
			{
				this.__createApplySection.bind(this)(colID,divLowerContainer,handleNumberFilter,resetNumberFilter);
			}
			else
			{
				this.util.addEvent(cmbFilter,"change",handleNumberFilter);
				this.util.addEvent(txtFilter,"keyup",txtInputChangeHandler);
			}
			divDetailFilterContainer.appendChild(divUpperContainer);
			divDetailFilterContainer.appendChild(divLowerContainer);
		};
		
		this.__getListDetailFilter = function(dataField,objFilter)
		{
			var self = this;
			var itemRenderer = function(item,labelField,fieldIndex,isDisabled,listItem)
			{
				if(item)
				{
					var divRenderer = self.util.createElement("span",colID + "filterListContainer" + item["id"] ,"nsFilterListRenderer");
					var label = self.util.createElement("label");
					var checkBox = self.util.createElement("input",null,"nsFilterListRendererCheckBox");
					checkBox.setAttribute("type","checkbox");
					checkBox.checked = Boolean.parse(item["selected"]);
					this.util.addEvent(checkBox,"click",checkBoxClickHandler);
					label.style.fontWeight = "400";
					label.style.cursor = "pointer";
					checkBox.style.marginRight = "5px";
					label.appendChild(checkBox);
					label.appendChild(document.createTextNode(item[labelField]));
					divRenderer.appendChild(label);
					return divRenderer;
				}
				return null;
			};
			var txtInputChangeHandler = function()
			{
				clearTimeout(self.__interval);
				self.__interval = setTimeout(function(){
						handleListFilter(true);
					}, self.SEARCH_INTERVAL);
			};
			var handleListFilter = function(isReset)
			{
				var item = null;
				var text = null;
				var text = txtFilter.value;
				if(text === "")
				{
					objNSList.resetFilter();
				}
				else
				{
					var setting = {caseSensitive:false,multiline:false,matchType:new NSFilter().CONTAINS};
					objNSList.filter(text,setting,true);
				}
				if(isReset)
				{
					arrSelected = objNSList.__arrInternalSource;
				}
			};
			var checkBoxClickHandler = function(event)
			{
				var target = self.util.getTarget(event);
				var checked = target.checked;
				target = self.util.findParent(target,"li");
				var source = objNSList.__arrInternalSource;
				var index = objNSList.__getIndexFromTarget(target);
				if(index > -1)
				{
					tempItem = objNSList.__getItemByIndex(index);
					if(tempItem)
					{
						var selectedIndex = source.findIndex(findIndexfromSelectedArray);
						if(checked && selectedIndex > -1)
						{
							arrSelected.push(tempItem);
						}
						else if(!checked && selectedIndex > -1)
						{
							for(var count = 0;count < arrSelected.length;count++)
							{
								if(arrSelected[count].id == selectedIndex)
								{
									arrSelected.splice(count,1);
									break;
								}
							}
						}
						tempItem["selected"] = checked;
					}
					setSelectAllCheckBox();
				}
			};
			
			var chkSelectAllClickHandler = function(event)
			{
				if(arrSource)
				{
					var length = arrSource.length;
					var checked = chkSelectAll.checked;
					var source = objNSList.__arrInternalSource;
					var item = null;
					for(var count = 0;count < length;count++)
					{
						item = arrSource[count];
						item["selected"] = checked;
					}
					if(source)
					{
						for(var count = 0;count < source.length;count++)
						{
							item = source[count];
							item["selected"] = checked;
						}
					}
					if(checked)
					{
						arrSelected = self.util.cloneObject(arrSource);
					}
					else
					{
						arrSelected = [];
					}
					objNSList.__renderBody(false);
				}
			};
			
			var setSelectAllCheckBox = function()
			{
				var isAllSelected = isSelectedAll();
				var isNoneSelected = isUnselectedAll();
				if(isAllSelected)
				{
					chkSelectAll.indeterminate = false;
					chkSelectAll.checked = true;
				}
				else if(isNoneSelected)
				{
					chkSelectAll.indeterminate = false;
					chkSelectAll.checked = false;
				}
				else
				{
					chkSelectAll.indeterminate = true;
				}
			};
			
			var findIndexfromSelectedArray = function(element,index,array)
			{
				return (element["id"] === tempItem["id"]);
			};
			
			var isSelectedAll = function()
			{
				if(arrSource && arrSelected)
				{
					return (arrSource.length === arrSelected.length);
				}
				return false;
			};
			
			var isUnselectedAll = function()
			{
				if(arrSelected)
				{
					return (arrSelected.length === 0);
				}
				return true;
			};
			
			var handleMainFilter = function()
			{
				var arrTemp = [];
				if(arrSelected && arrSelected.length > 0)
				{
					for(var count = 0;count < arrSelected.length;count++)
					{
						if(arrSelected[count]["selected"])
						{
							arrTemp.push(arrSelected[count]);
						}
					}
				}
				var item = {arrText:arrTemp,arrTextField:"label",caseSensitive:true,matchType:new NSFilter().EXACT,arrSelected:arrSelected,textInputText:txtFilter.value,type:NSGrid.ADVANCED_FILTER_LIST};
				self.__objAdvancedFilterSetting[dataField] = item;
				self.__advanceFilterGrid.bind(self)();
				if(self.__enableApply)
				{
					self.__removePopUp();
				}
			};
			var resetMainFilter = function()
			{
				self.__objAdvancedFilterSetting[dataField] = null;
				self.__advanceFilterGrid.bind(self)();
				self.__removePopUp();
			};
			
			var tempItem = null;
			var objPrev = this.__objAdvancedFilterSetting[dataField];
			if(!objPrev)
			{
				objPrev = {};
			}
			var arrSelected = objPrev["arrSelected"];
			var arrSource = this.__getUniqueValues(this.__nsGrid.__objGrid.__getFlatSource(),dataField,arrSelected);
			if(!arrSelected)
			{
				arrSelected = this.util.cloneObject(arrSource);
			}
			var colID = this.__getRendererID(dataField);
			var divDetailFilterContainer = this.__nsPopUp.getPopUp();
			//divDetailFilterContainer.style.width = "240px";
			divDetailFilterContainer.style.padding = "10px";
			var divUpperContainer = this.util.createDiv(colID + "detailFilterUpperContainer");
			divUpperContainer.style.paddingBottom = "8px";
			var divLowerContainer = this.util.createDiv(colID + "detailFilterLowerContainer");
			var divTextInput = this.util.createDiv(colID + "detailFilterTextInputContainer","nsFilterLineContainer");
			this.util.addStyleClass(divTextInput,"nsFilterLineContainerTheme");
			divTextInput.setAttribute("style","height:29px;");
			var txtFilter = this.util.createElement("input",colID + "detailFilterTextInput","nsFilterTextInput");
			txtFilter.setAttribute("placeholder", "Enter Value here");
			txtFilter.style.width = "100%";
			if(objPrev["textInputText"])
			{
				txtFilter.value = objPrev["textInputText"];
			}
			this.util.addEvent(txtFilter,"keyup",txtInputChangeHandler);
			divTextInput.appendChild(txtFilter);
			divUpperContainer.appendChild(divTextInput);
			divDetailFilterContainer.appendChild(divUpperContainer);
			divDetailFilterContainer.appendChild(divLowerContainer);
			var divList = this.util.createDiv(colID + "detailFilterListContainer");
			var lstFilter = this.util.createElement("div",colID + "detailFilterList","nsFilterList");
			lstFilter.style.height = "300px";
			divList.appendChild(lstFilter);
			divUpperContainer.appendChild(divList);
			var setting = {labelField:"label",enableVirtualScroll:false,enableDragDrop:false,enableDragByHandle:false,enableMultipleSelection:true,enableKeyboardNavigation:false,
						   customScrollerRequired:false,enableMouseHover:true,enableMouseHoverAnimation:false,itemRenderer:itemRenderer.bind(this)};
			setting["dataSource"] = arrSource;
			var objNSList = new NSList(lstFilter,setting);
			
			var divSelectAll = this.util.createElement("span",colID + "detailFilterSelectAllContainer","nsFilterLineContainer");
			this.util.addStyleClass(divSelectAll,"nsFilterLineContainerTheme");
			var label = self.util.createElement("label");
			var chkSelectAll = self.util.createElement("input",null,"nsFilterListRendererCheckBox");
			chkSelectAll.setAttribute("type","checkbox");
			this.util.addEvent(chkSelectAll,"click",chkSelectAllClickHandler);
			label.appendChild(chkSelectAll);
			label.appendChild(document.createTextNode("Select All"));
			label.style.fontWeight = "400";
			label.style.cursor = "pointer";
			chkSelectAll.style.marginRight = "5px";
			divSelectAll.style.paddingTop = "5px";
			divSelectAll.style.display = "inline-block";
			divSelectAll.appendChild(label);
			divLowerContainer.appendChild(divSelectAll);
			if(this.__enableApply)
			{
				this.__createApplySection.bind(this)(colID,divLowerContainer,handleMainFilter,resetMainFilter);
			}
			handleListFilter(false);
			setSelectAllCheckBox();
		};
		
		this.__getDateDetailFilter = function(dataField,objFilter)
		{
			var self = this;
			this.__setDefaultDatePicker();
			var arrOptions = [{text:"Equals",value:"equals"},
			                  {text:"Greater than",value:"greaterThan"},
			                  {text:"Less than",value:"lessThan"},
			                  {text:"Not equal",value:"notEqual"}];
			var arrOptOption = [{text:"And",value:"and"},
			                  {text:"OR",value:"or"}];
			var createSelect = function(id,css)
			{
				var select =  self.util.createElement("select",id,css);
				for(var count = 0;count < arrOptions.length;count++)
				{
					var item = arrOptions[count];
					var option = self.util.createElement("option");
					option.setAttribute("value", item.value);
					var text = document.createTextNode(item.text);
					option.appendChild(text);
					select.appendChild(option);
				}
				return select;
			};
			var handleMainFilter = function()
			{
				var item = {type:NSGrid.ADVANCED_FILTER_DATE,selectFirst:selectFirst,firstSelectIndex:selectFirst.selectedIndex,firstSelectValue:selectFirst.options[selectFirst.selectedIndex].value,
							compFirstDate:compFirstDate,firstDate:compFirstDate.getDate(),
							operationSelect:select,operationSelectedIndex:select.selectedIndex,operationSelectValue:select.options[select.selectedIndex].value,
							selectSecond:selectSecond,secondSelectIndex:selectSecond.selectedIndex,secondSelectValue:selectSecond.options[selectSecond.selectedIndex].value,
							compSecondDate:compSecondDate,secondDate:compSecondDate.getDate(),config:dateConfig,
							divUpperContainer:divUpperContainer,divLowerContainer:divLowerContainer
						};
				self.__objAdvancedFilterSetting[dataField] = item;
				self.__advanceFilterGrid.bind(self)();
				if(self.__enableApply)
				{
					self.__removePopUp();
				}
			};
			var resetMainFilter = function()
			{
				self.__objAdvancedFilterSetting[dataField] = null;
				self.__advanceFilterGrid.bind(self)();
				self.__removePopUp();
			};
			var divDetailFilterContainer = this.__nsPopUp.getPopUp();
			divDetailFilterContainer.style.padding = "10px";
			var dateConfig = objFilter["advancedFilterConfig"] || {};
			var filterConfig = objFilter["config"] || {};
			for(var key in filterConfig)
			{
				if(this.util.isUndefined(dateConfig[key]))
				{
					dateConfig[key] = filterConfig[key];
				}
			}
			dateConfig["filterManually"] = this.__enableApply;
			var objPrev = this.__objAdvancedFilterSetting[dataField];
			if(objPrev)
			{
				var divUpperContainer = objPrev.divUpperContainer;
				var divLowerContainer = objPrev.divLowerContainer;
				var selectFirst = objPrev.selectFirst;
				selectFirst.selectedIndex = objPrev.firstSelectIndex;
				var compFirstDate = objPrev.compFirstDate;
				compFirstDate.setDate(objPrev.firstDate);
				var select = objPrev.operationSelect;
				select.selectedIndex = objPrev.operationSelectedIndex;
				var selectSecond = objPrev.selectSecond;
				selectSecond.selectedIndex = objPrev.secondSelectIndex;
				var compSecondDate = objPrev.compSecondDate;
				compSecondDate.setDate(objPrev.secondDate);
				divDetailFilterContainer.appendChild(divUpperContainer);
				divDetailFilterContainer.appendChild(divLowerContainer);
			}
			else
			{
				/*if(!objPrev)
				{
					objPrev = {};
				}*/
				var colID = this.__getRendererID(dataField);
				var divUpperContainer = this.util.createDiv(colID + "detailFilterUpperContainer");
				divUpperContainer.style.paddingBottom = "8px";
				var divLowerContainer = this.util.createDiv(colID + "detailFilterLowerContainer");
				var divFirstSelect = this.util.createDiv(colID + "detailFirstSelectContainer","nsGridFilterFirstSelectContainer");
				this.util.addStyleClass(divFirstSelect,"nsGridFilterFirstSelectContainerTheme");
				//divFirstSelect.setAttribute("style","height:29px;");
				var selectFirst =  createSelect(colID + "detailFirstSelect","nsGridFilterFirstSelect");
				divFirstSelect.appendChild(selectFirst);
				divUpperContainer.appendChild(divFirstSelect);
				//selectFirst.selectedIndex = this.util.isUndefinedOrNull(objPrev.firstSelectIndex) ? 0 : objPrev.firstSelectIndex;
				
				var divFirstDate = this.util.createDiv(colID + "detailFirstDateContainer","nsGridFilterFirstDateContainer");
				this.util.addStyleClass(divFirstDate,"nsGridFilterFirstDateContainerTheme");
				divUpperContainer.appendChild(divFirstDate);
				var compFirstDate = new this.__nsGrid.__components["datePicker"]();
				this.dateRenderer(compFirstDate,dataField,divFirstDate,dateConfig,objFilter);
				
				var divOption = this.util.createDiv(colID + "detailOptionContainer","nsGridFilterOptionContainer");
				this.util.addStyleClass(divOption,"nsGridFilterOptionContainerTheme");
				var select =  this.util.createElement("select",null,"nsGridFilterOptOption");
				for(var count = 0;count < arrOptOption.length;count++)
				{
					var item = arrOptOption[count];
					var option = this.util.createElement("option");
					option.setAttribute("value", item.value);
					var text = document.createTextNode(item.text);
					option.appendChild(text);
					select.appendChild(option);
				}
				divOption.appendChild(select);
				divUpperContainer.appendChild(divOption);
				//select.selectedIndex = this.util.isUndefinedOrNull(objPrev.operationSelectedIndex) ? 0 : objPrev.operationSelectedIndex;
				
				
				var divSecondSelect = this.util.createDiv(colID + "detailSecondSelectContainer","nsGridFilterSecondSelectContainer");
				this.util.addStyleClass(divSecondSelect,"nsGridFilterSecondSelectContainerTheme");
				//divSecondSelect.setAttribute("style","height:29px;");
				var selectSecond =  createSelect(colID + "detailSecondSelect","nsGridFilterSecondSelect");
				divSecondSelect.appendChild(selectSecond);
				divUpperContainer.appendChild(divSecondSelect);
				//selectSecond.selectedIndex = this.util.isUndefinedOrNull(objPrev.secondSelectIndex) ? 0 : objPrev.secondSelectIndex;
				
				var divSecondDate = this.util.createDiv(colID + "detailSecondDateContainer","nsGridFilterSecondDateContainer");
				this.util.addStyleClass(divSecondDate,"nsGridFilterSecondDateContainerTheme");
				divUpperContainer.appendChild(divSecondDate);
				var compSecondDate = new this.__nsGrid.__components["datePicker"]();
				this.dateRenderer(compSecondDate,dataField,divSecondDate,dateConfig,objFilter);
				divDetailFilterContainer.appendChild(divUpperContainer);
				divDetailFilterContainer.appendChild(divLowerContainer);
				if(this.__enableApply)
				{
					this.__createApplySection.bind(this)(colID,divLowerContainer,handleMainFilter,resetMainFilter);
				}
			}
		};
		
		this.__createApplySection = function(colID,parent,applyClickHandler,resetClickHandler)
		{
			var divApplyButton = this.util.createDiv(colID + "detailFilterApplyButtonContainer","nsFilterButtonDiv");
			this.util.addStyleClass(divApplyButton,"nsFilterButtonDivTheme");
			var btnFilter = this.util.createElement("button",colID + "detailFilterApply","nsFilterButton");
			this.util.addStyleClass(btnFilter,"nsButton");
			this.util.addStyleClass(btnFilter,"nsButtonGreen");
			this.util.addStyleClass(btnFilter,"nsButtonShadow");
			this.util.addStyleClass(btnFilter,"nsButtonFont12");
			btnFilter.innerHTML = "Filter";
			divApplyButton.appendChild(btnFilter);
			var btnCancel = this.util.createElement("button",colID + "detailFilterReset","nsFilterButton");
			this.util.addStyleClass(btnCancel,"nsButton");
			this.util.addStyleClass(btnCancel,"nsButtonGrey");
			this.util.addStyleClass(btnCancel,"nsButtonShadow");
			this.util.addStyleClass(btnCancel,"nsButtonFont12");
			btnCancel.innerHTML = "Cancel";
			divApplyButton.appendChild(btnCancel);
			divApplyButton.style.float = "right";
			parent.appendChild(divApplyButton);
			this.util.addEvent(btnFilter,"click",applyClickHandler);
			this.util.addEvent(btnCancel,"click",resetClickHandler);
		};
		
		this.__getRendererID = function(dataField)
		{
			return (this.__nsGrid.getID() + "col" + dataField + "renderer");
		};
		
		this.__getUniqueValues = function(arrSource,dataField,arrSelected)
		{
			var findItem = function(element, index, array) 
			{
				return (item["value"] === element["value"]);
			};
			var arrReturn = null;
			var item = {};
			if(arrSource && arrSource.length > 0 && dataField)
			{
				var objMap = {};
				var value = "";
				var length = arrSource.length;
				var count = 0;
				var arrTemp = [];
				var itemPrev = {};
				arrReturn = [];
			    for(count = 0; count < length;count++)
			    {
			    	value = arrSource[count][dataField];
			    	if(value)
			    	{
			    		objMap[value] = value;
			    	}
			    }
			    arrTemp = Object.keys(objMap);
			    length = arrTemp.length;
			    if(length > 0)
			    {
			    	for(count = 0; count < length;count++)
				    {
				    	value = arrTemp[count];
				    	item = {id:count,label:value,value:value,selected:true};
				    	//if arrSelected is present and then item is not found then it is unselected
				    	//if arrSelected is not present then all Items are selected
				    	if(arrSelected)
				    	{
				    		itemPrev = arrSelected.find(findItem);
				    		if(itemPrev)
				    		{
				    			item["selected"] = itemPrev["selected"];
				    		}
				    		else
				    		{
				    			item["selected"] = false;
				    		}
				    	}
				    	arrReturn.push(item);
				    }
			    }
			}
			return arrReturn;
		};
		
		this.__setDefaultDatePicker = function()
		{
			if(!this.__nsGrid.__components)
			{
				this.__nsGrid.__components = {};
			}
			if(!this.__nsGrid.__components["datePicker"])
			{
				var dateComp = function()
				{
					var setting = null;
					var div = null;
					var objDate = null;
				    var self = this;
				    var util = new NSUtil();
				    
				    var init = function(config) 
				    {
						setting = getParam(config);
						if(!setting)
						{
							setting = {};
						}
						setting.dateOutputFormat = setting.dateOutputFormat ? setting.dateOutputFormat : "MM/dd/yyyy";
						//setting.placeHolder = setting.placeHolder ? setting.placeHolder : setting.dateOutputFormat;
						div = util.createDiv(null,"nsGridDatePicker"); 
						//div.style.width = "90%";
						div.style.display = "inline-block";
				    };
				    
				    var getElement = function()
				    {
				    	return div;
				    };
				    
				    var elementAdded = function()
				    {
				    	objDate = new NSDatePicker(div,setting);
						util.addEvent(div,NSDatePicker.DATE_SELECTED,function(event)
						{
							dateSelected(event.detail,false);
						});
						util.addEvent(div,NSDatePicker.INPUT_CHANGE,function(event)
						{
							dateSelected(event.detail,true);
						});
				    };
				    
				    var dateSelected = function(date,isType)
				    {
				    	if(util.isUndefinedOrNull(setting.filterManually) || !setting.filterManually)
				    	{
				    		setting.dateSelectedHandler(isType);
				    	}
				    };
				    
				    var getDate = function()
				    {
				    	return objDate.getSelectedDate();
				    };
				    
				    var setDate = function(date,fireEvent)
				    {
				    	objDate.setSelectedDate(date,null,false);
				    };
				    
				    var getParam = function(param)
				    {
				    	if(!param)
				    	{
				    		param = {};
				    	}
				    	/*param = {
				    		cssClass: param.cssClass || null,
				    	};*/
				    	return param;
				    };
				    
				    self.init = init;
				    self.getElement = getElement;
				    self.elementAdded = elementAdded;
				    self.getDate = getDate;
				    self.setDate = setDate;
				};
				
				this.__nsGrid.__components["datePicker"] = dateComp;
			}
		};
		
		this.__injectInNSGrid = function()
		{
			NSGrid.FILTER_TYPE_DATE = "date";
			NSGrid.ADVANCED_FILTER_TEXT = "text";
			NSGrid.ADVANCED_FILTER_NUMBER = "number";
			NSGrid.ADVANCED_FILTER_LIST = "list";
			NSGrid.ADVANCED_FILTER_DATE = "date";
		};
		this.__initialize();
	};
	return NSGridFilter;
})();
nsModuleExport(__nsGlobal,"NSGridFilter",NSGridFilter);