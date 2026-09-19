var NSTablePicker = (function()
{
	var NSTablePicker = function(setting)
	{
		var self = this;
		var config = {};
	    
	    var util = null;
	    var win = null;
		var doc = null;
		var deviceSupport = null;
		var parent = null;
	    var container = null;
	    var tblContainerCon = null;
	    var tblContainer = null;
	    var labelContainerCon = null;
	    var labelContainer = null;
	    var arrCells = [];
	    var strDefaultStyle = "";
	    var nsPopUp = null;
	    var id = null;
		
		var initialize = function()
		{
			if(!setting)
			{
				setting = {};
			}
			util = new NSUtil();
			var obj = util.getDomVariables();
    		win = obj.win;
    		doc = obj.doc;
    		deviceSupport = util.getSupportedEvents();
			config = {
			    context: setting["context"] || win,
			    isPopUp: Boolean.parse(setting["isPopUp"]),
			    popUpPos: setting["popUpPos"] || util.POS_BOTTOMRIGHT,
			    trigger: setting["trigger"],
			    triggerEvent: setting["triggerEvent"] || "click",
			    closeOnOutsideClick: util.isUndefinedOrNull(setting["closeOnOutsideClick"]) ? true : Boolean.parse(setting["closeOnOutsideClick"]),
			    element: setting["element"],
				width: setting["width"] || 200,
				height: setting["height"] || 200,
				cellWidth: setting["cellWidth"] || 20,
				cellHeight: setting["cellHeight"] || 20,
				rowCount: setting["rowCount"] || 10,
				columnCount: setting["columnCount"] || 10,
				enableShowDimension: util.isUndefinedOrNull(setting["enableShowDimension"]) ? true : Boolean.parse(setting["enableShowDimension"]),
				theme: setting["theme"] || "White",
				cellMouseOverCallback: setting["cellMouseOverCallback"],
				cellMouseOutCallback: setting["cellMouseOutCallback"],
				cellClickCallback: setting["cellClickCallback"],
				popUpOpenCallback: setting["popUpOpenCallback"],
				popUpCloseCallback: setting["popUpCloseCallback"],
			};
			if (!config.isPopUp && !config.element) 
			{
				util.throwNSError("NSTablePicker","Element in setting is missing");
	        }
	   		if(!setting.customClass)
    		{
    			setting.customClass = {};
    		}
    		config.customClass = {
    				container:setting.customClass["container"],
    				tableContainer:setting.customClass["tableContainer"],
    				table:setting.customClass["table"],
    				rowContainer:setting.customClass["rowContainer"],
    				row:setting.customClass["row"],
    				cellContainer:setting.customClass["cellContainer"],
    				cell:setting.customClass["cell"],
    				labelContainer:setting.customClass["labelContainer"],
    				label:setting.customClass["label"]
    		};

			createComponent();
		};
		
		var createComponent = function()
		{
			if(container)
			{
				if(container.parentElement)
				{
					container.parentElement.removeChild(container);
				}
				resetVars();
			}
			if(config.isPopUp)
			{
				var popUpSetting = {type:"div",width:null,position:config.popUpPos,closeOnOutsideClick:config.closeOnOutsideClick
									,hideOrRemoveOnOutsideClick: "hide",width: "auto"};
				nsPopUp = new util.nsPopUp(popUpSetting);
				nsPopUp.create();
				parent = nsPopUp.getPopUp();
				if(config.trigger)
				{
					if(util.isElement(config.trigger))
					{
						util.addEvent(config.trigger,config.triggerEvent,handleTriggerEvent);
					}
					else
					{
						util.warning("NSTablePicker","Trigger is not a element");
					}
				}
			}
			else
			{
				parent = config.element;
			}
			container = util.createDiv(getID() + "Container","nsTablePicker");
			parent.appendChild(container);
			setTheme(config.theme);
			applyCustomClass(container,"container");
			var radius = util.getStyleValue(container, "border-radius", true);
			createTable(config.rowCount,config.columnCount);
			createLabel();
			if(!radius)
			{
				radius = 0;
			}
			else
			{
				radius = util.getDimensionAsNumber(container,radius);
			}
			if(radius)
			{
				radius = parseInt(radius,10) * 2;
			}
			var labelHeight = 0;
			if(labelContainerCon)
			{
				labelHeight = labelContainerCon.offsetHeight;
			}
			//for Firefox
			//container.style.width = (config.width + radius) + "px";
			//container.style.height = (config.height + radius + labelHeight) + "px";
			/*var paddingLeft = util.getStyleValue(tblContainerCon, "padding-left", true);
			if(!paddingLeft)
			{
				paddingLeft = 0;
			}
			else
			{
				paddingLeft = util.getDimensionAsNumber(tblContainerCon,paddingLeft);
			}
			var paddingRight = util.getStyleValue(tblContainerCon, "padding-right", true);
			if(!paddingRight)
			{
				paddingRight = 0;
			}
			else
			{
				paddingRight = util.getDimensionAsNumber(tblContainerCon,paddingRight);
			}
			tblContainerCon.style.width = (config.width + paddingLeft + paddingRight) + "px";*/
			tblContainerCon.style.height = (config.height) + "px";
			/*if(labelContainerCon)
			{
				var orignalValue = parent.style.display;
				parent.style.display = "block";
				tblContainerCon.style.height = (container.offsetHeight - labelContainerCon.offsetHeight) + "px";
				parent.style.display = (orignalValue) ? orignalValue : "";
			}*/
			calculateCellDimensions();
		};
		
		var calculateCellDimensions = function()
		{
			if(!config.cellWidth || !config.cellHeight)
			{
				var orignalValue = parent.style.display;
				parent.style.display = "block";
				if(!config.cellWidth)
				{
					var availableWidth = tblContainer.offsetWidth;
					config.cellWidth = availableWidth / config.columnCount;
				}
				if(!config.cellHeight)
				{
					var availableHeight = tblContainer.offsetHeight;
					config.cellHeight = availableHeight / config.rowCount;
				}
				parent.style.display = (orignalValue) ? orignalValue : "";
			}
			if(config.cellWidth && config.cellHeight)
			{
				var id = getID() + "Container";
				util.addCSSClassInDOM(["#" + id + ".nsTablePicker .nsTableCellContainer"],["width:" + config.cellWidth + "px;height:" + config.cellHeight + "px;"]);
			}
		};
		
		var createLabel = function()
		{
			if(config.enableShowDimension)
			{
				labelContainerCon = util.createDiv(null,"nsTablePickerLblCon");
				applyCustomClass(labelContainerCon,"labelContainer");
				labelContainer = util.createDiv(null,"nsTablePickerLbl");
				applyCustomClass(labelContainer,"label");
				labelContainerCon.appendChild(labelContainer);
				container.appendChild(labelContainerCon);
			}
		};
		
		var createTable = function(rowCount,colCount)
		{
			tblContainerCon = util.createDiv(null,"nsTablePickerTblCon");
			applyCustomClass(tblContainerCon,"tableContainer");
			tblContainer = util.createDiv(null,"nsTablePickerTbl");
			for(var rowIndex = 0;rowIndex < rowCount;rowIndex++)
			{
				var rowCon = createRow(rowIndex,colCount);
				tblContainer.appendChild(rowCon);
			}
			applyCustomClass(tblContainer,"table");
			tblContainerCon.appendChild(tblContainer);
			container.appendChild(tblContainerCon);
		};
		
		var createRow = function(rowIndex,colCount)
		{
			var rowContainer = util.createDiv(null,"nsTableRowContainer");
			rowContainer.setAttribute("ns-row-index",rowIndex);
			applyCustomClass(rowContainer,"rowContainer");
			var row = util.createDiv(null,"nsTableRow");
			for(var cellIndex = 0;cellIndex < colCount;cellIndex++)
			{
				var cellCon = createCell(rowIndex,cellIndex,row);
				row.appendChild(cellCon);
			}
			applyCustomClass(row,"row");
			rowContainer.appendChild(row);
			return rowContainer;
		};
		
		var createCell = function(rowIndex,cellIndex,row)
		{
			var cellContainer = util.createDiv(null,"nsTableCellContainer");
			cellContainer.setAttribute("ns-row-index",rowIndex);
			cellContainer.setAttribute("ns-cell-index",cellIndex);
			applyCustomClass(cellContainer,"cellContainer");
			var cell = util.createDiv(null,"nsTableCell");
			cellContainer.appendChild(cell);
			applyCustomClass(cell,"cell");
			strDefaultStyle = cell.className;
			util.addEvent(cellContainer,"mouseover",cellMouseOverHandler.bind(null,cell,rowIndex,cellIndex));
			util.addEvent(cellContainer,"mouseout",cellMouseOutHandler.bind(null,cell,rowIndex,cellIndex));
			util.addEvent(cellContainer,"click",cellClickHandler.bind(null,cell,rowIndex,cellIndex));
			arrCells.push({rowIndex: rowIndex,cellIndex: cellIndex,row: row,cell: cell,cellContainer: cellContainer});
			return cellContainer;
		};
		
		var cellMouseOverHandler = function(cell,rowIndex,cellIndex,event)
		{
			event = util.getEvent(event);
			if(config.cellMouseOverCallback)
			{
				config.cellMouseOverCallback(event,cell,rowIndex + 1,cellIndex + 1);
			}
		    if (event.target)
		    {
		    	var xPos = (cellIndex + 1) * config.width / config.columnCount;
			    var yPos = (rowIndex + 1) * config.height / config.rowCount;
		    }
		    renderCells(rowIndex,cellIndex);
		    refreshLabel(xPos,yPos,rowIndex,cellIndex);
		};
		
		var cellMouseOutHandler = function(cell,rowIndex,cellIndex,event)
		{
			event = util.getEvent(event);
			if(config.cellMouseOutCallback)
			{
				config.cellMouseOutCallback(event,cell,rowIndex + 1,cellIndex + 1);
			}
			renderCells(null,null);
			refreshLabel(0,0,null,null);
		};
		
		var cellClickHandler = function(cell,rowIndex,cellIndex,event)
		{
			event = util.getEvent(event);
			event.preventDefault();
			if(config.cellClickCallback)
			{
				config.cellClickCallback(event,cell,rowIndex + 1,cellIndex + 1);
			}
		};
		
		var renderCells = function(activeRowIndex,activeCellIndex)
		{
			for(var cellCount = 0;cellCount < arrCells.length;cellCount++)
			{
				var item = arrCells[cellCount];
				var styleClass = strDefaultStyle;
                if (item.rowIndex == activeRowIndex && item.cellIndex === activeCellIndex) 
                {
                	styleClass += " nsTableCellActive";
                } 
                else if (item.rowIndex <= activeRowIndex && item.cellIndex <= activeCellIndex) 
                {
                	styleClass += " nsTableCellSelected";
                } 

                /*if(item.rowIndex <= selectedRow && item.cellIndex <= selectedColumn) 
                {
                  	styleClass += " nsTableCellActive";
                }*/
                item.cell.setAttribute("class",styleClass);
			}
		};
		
		var refreshLabel = function(xPos,yPos,activeRowIndex,activeCellIndex)
		{
			if(config.enableShowDimension)
			{
				if(activeRowIndex == null)
				{
					labelContainer.innerHTML = "";
				}
				else
				{
					labelContainer.innerHTML = (activeRowIndex + 1)  + " x " + (activeCellIndex + 1);
				}
			}
		};
		
		var applyCustomClass = function(element,type)
    	{
    		if(element && type && config.customClass[type])
    		{
    			util.addStyleClass(element,config.customClass[type]);
    		}
    	};
    	
    	var handleTriggerEvent= function(event)
    	{
    		if(nsPopUp)
    		{
    			event = util.getEvent(event);
    			event.stopPropagation();
    			if(nsPopUp.isOpen())
    			{
    				close(event);
    			}
    			else
    			{
    				open(event);
    			}
    		}
    	};
    	
    	var resetVars = function()
    	{
    		container = null;
			arrCells = [];
			strDefaultStyle = "";
    	};
    	
    	var getID = function()
    	{
    		if(!id)
    		{
    			var comp = config.isPopUp ? (config.trigger ? config.trigger : null) : config.element;
    			if(comp)
    			{
    				if(comp.hasAttribute("id"))
        			{
        				id = comp.getAttribute("id");
        			}
        			else if(comp.hasAttribute("name"))
        			{
        				id = comp.getAttribute("name");
        			}
    			}
    			if(!id)
    			{
    				id = "comp" + util.getUniqueId();
    			}
    		}
    		return id;
    	};
		
		var setTheme = function(theme) 
    	{
    		if(container && config.theme)
    		{
    			util.removeStyleClass(container,"nsTablePicker" + config.theme);
    			config.theme = theme;
    			util.addStyleClass(container,"nsTablePicker" + config.theme);
    		}
    	};
    	
    	var open = function(event) 
    	{
    		if(nsPopUp)
    		{
    			nsPopUp.show();
    			if(config.trigger)
    			{
    				nsPopUp.placePopUp(config.trigger);
    			}
    			else if(event)
    			{
    				nsPopUp.placePopUp(event);
    			}
    			if(config.popUpOpenCallback)
    			{
    				config.popUpOpenCallback(event,self);
    			}
    		}
    		else
    		{
    			util.warning("NSTablePicker","PopUp is not enabled");
    		}
    	};
    	
    	var close = function(event) 
    	{
    		if(nsPopUp)
    		{
    			nsPopUp.hide();
    			if(config.popUpCloseCallback)
    			{
    				config.popUpCloseCallback(event,self);
    			}
    		}
    		else
    		{
    			util.warning("NSTablePicker","PopUp is not enabled");
    		}
    	};
    	
    	var remove = function()
    	{
    		if(nsPopUp)
    		{
    			nsPopUp.remove();
    			nsPopUp = null;
    		}
    		else if(container)
    		{
    			if(container.parentElement)
				{
					container.parentElement.removeChild(container);
				}
    		}
    		resetVars();
    	};
    	
    	var isOpen = function() 
    	{
    		if(nsPopUp)
    		{
    			return nsPopUp.isOpen();
    		}
    		return false;
    	};
		
		initialize();
		
		self.setTheme = setTheme;
		self.open = open;
		self.close = close;
		self.remove = remove;
		self.isOpen = isOpen;
	};
	
	return NSTablePicker;
})();
nsModuleExport(__nsGlobal,"NSTablePicker",NSTablePicker);