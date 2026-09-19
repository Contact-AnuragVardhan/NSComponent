"use strict"; 
var NSDashboard = (function()
{
	function NSDashboard(setting) 
	{
		var util = new NSUtil();
		var config = null;
		
		var id = null;
		var arrPanel = [];
		var dragElement = null;
		var self = this;
		
		this.getAllPanel = function()
		{
			if(arrPanel && arrPanel.length > 0)
			{
				var arrReturn = [];
				for(var count = 0;count < arrPanel.length;count++)
				{
					arrReturn.push(arrPanel[count].panel);
				}
				return arrReturn;
			}
			return null;
		};
		
		this.getPanel = function(item)
		{
			if(!this.util.isUndefinedOrNull(item))
			{
				var index = -1;
				if(this.util.isElement(item))
				{
					index = parseInt(item.getAttribute("nsDashboardOrgIndex"));
				}
				else if(this.util.isNumber(item))
				{
					index = parseInt(item);
				}
				if(index > -1 && arrPanel.length > index)
				{
					return arrPanel[index].panel;
				}
			}
			return null;
		};
		
		this.removeComponent = function()
		{
			if(arrPanel && arrPanel.length > 0)
			{
				for(var count = 0;count < arrPanel.length;count++)
				{
					if(arrPanel[count].panel)
					{
						arrPanel[count].panel.removeComponent();
					}
				}
			}
		};
		
		var initialize = function()
		{
			if(setting)
			{
				config = {
						container: setting["container"] || null,
						panelClass: setting["panelClass"] || null,
						panelDragClass: setting["panelDragClass"] || null,
						panelHoverClass: setting["panelHoverClass"] || null,
						panelCount: parseInt(setting["panelCount"]),
						panelPerRow: util.isUndefinedOrNull(setting["panelPerRow"]) ? parseInt(setting["panelPerRow"]) : 3,
						arrPanelSetting: setting["arrPanelSetting"] || []
				};
				if(!config.container)
				{
					util.throwException(2001,"NSDashboard","Container property is invalid");
					return;
				}
				if(!config.panelCount)
				{
					util.throwException(2002,"NSDashboard","Enter a valid value for PanelCount property");
					return;
				}
				if(config.panelPerRow == 0)
				{
					util.throwException(2002,"NSDashboard","PanelPerRow property has an invalid value");
					return;
				}
				if(!config.arrPanelSetting)
				{
					util.throwException(2002,"NSDashboard","arrPanelSetting property has an invalid value");
					return;
				}
				if(12 % config.panelPerRow !== 0)
				{
					util.throwException(2001,"NSDashboard","PanelPerRow property should have a value which is divisible by 12");
					return;
				}
				if(config.arrPanelSetting.length != config.panelCount)
				{
					util.throwException(2001,"NSDashboard","arrPanelSetting property should have same length as PanelCount property");
					return;
				}
				createElement();	
			}
		};
		var createElement = function() 
		{
			var classNum = 12 / config.panelPerRow;
			util.addStyleClass(config.container,"nsDashboard");
			util.removeAllChildren(config.container);
			for(var count = 0;count < config.panelCount;count++)
			{
				createPanel(config.arrPanelSetting[count],classNum,count);
			}
		};
		var createPanel = function(setting,classNum,index) 
		{
			var divPanel = util.createDiv(getID() + "NSDashboardPanel" + index,"nsDashboardPanel");
			//util.addStyleClass(divPanel,"col-sm-" + classNum);
			if(config.panelClass)
			{
				util.addStyleClass(divPanel,config.panelClass);
			}
			divPanel.setAttribute("draggable",true);
			divPanel.setAttribute("nsDashboardOrgIndex",index);
			divPanel.setAttribute("nsDashboardCurIndex",index);
			util.addEvent(divPanel,"dragstart",dragStartHandler);
			util.addEvent(divPanel,"dragenter",dragEnterHandler);
			util.addEvent(divPanel,"dragover",dragOverHandler);
			util.addEvent(divPanel,"dragleave",dragLeaveHandler);
			util.addEvent(divPanel,"drop",dropHandler);
			util.addEvent(divPanel,"dragend",dragEndHandler);
			config.container.appendChild(divPanel);
			setting["enablePopUp"] = false;
			setting["enableModal"] = false;
			setting["enableDrag"] = false;
			setting["enableTitleDblClick"] = false;
			setting["enableMoveOnClick"] = false;
			//Resize behaving weirdly so disabling it
			setting["enableResize"] = false;
			setting["minimizeAddRemoveElementCallback"] = minimizeAddRemoveElement;
			var nsPanel = new NSPanel(divPanel,setting);
			util.addEvent(divPanel,NSPanel.MINIMIZE_END,nsPanelEventHandler);
			util.addEvent(divPanel,NSPanel.MAXIMIZE_END,nsPanelEventHandler);
			util.addEvent(divPanel,NSPanel.FULLSCREEN_END,nsPanelEventHandler);
			util.addEvent(divPanel,NSPanel.RESTORE_END,nsPanelEventHandler);
			util.addEvent(divPanel,NSPanel.RESIZE_STARTING,nsPanelEventHandler);
			util.addEvent(divPanel,NSPanel.RESIZE_END,nsPanelEventHandler);
			arrPanel.push({panel:nsPanel,draggable:true});
		};
		
		var nsPanelEventHandler = function(event)
		{
			event = util.getEvent(event);
			var item = arrPanel[parseInt(this.getAttribute("nsDashboardOrgIndex"))];
			if(item)
			{
				var nsPanel = item.panel;
				switch(event.type)
				{
					case NSPanel.MINIMIZE_END:
						item.draggable = false;
					break;
					case NSPanel.MAXIMIZE_END:
						item.draggable = true;
					break;
					case NSPanel.FULLSCREEN_END:
						item.draggable = false;
					break;
					case NSPanel.RESTORE_END:
						item.draggable = true;
					break;
					case NSPanel.RESIZE_STARTING:
						item.draggable = false;
					break;
					case NSPanel.RESIZE_END:
						item.draggable = true;
					break;
				}
			}
		};
		
		var dragStartHandler = function(event) 
		{
			if(arrPanel[parseInt(this.getAttribute("nsDashboardOrgIndex"))].draggable)
			{
				event = util.getEvent(event);
				dragElement = this;
				if(config.panelDragClass)
				{
					util.addStyleClass(dragElement,config.panelDragClass);	
				}
				util.dispatchEvent(dragElement,NSDashboard.PANEL_DRAG_START,{element:dragElement,index:dragElement.getAttribute("nsDashboardCurIndex")},{index:dragElement.getAttribute("nsDashboardCurIndex")});
				event.dataTransfer.effectAllowed = "move";
				event.dataTransfer.setData("text",dragElement.getAttribute("nsDashboardCurIndex"));
			}
		};
		var dragOverHandler = function(event) 
		{
			if(dragElement)
			{
				event = util.getEvent(event);
				if (event.preventDefault) 
				{
					event.preventDefault();
				}
				event.dataTransfer.dropEffect = "move";  
				var index = this.getAttribute("nsDashboardCurIndex");
				util.dispatchEvent(this,NSDashboard.PANEL_DRAG_OVER,{element:this,index:index},{index:index});
			}
			return false;
		};
		var dragEnterHandler = function(event) 
		{
			if(dragElement && config.panelHoverClass)
			{
				util.addStyleClass(this,config.panelHoverClass);
				var index = this.getAttribute("nsDashboardCurIndex");
				util.dispatchEvent(this,NSDashboard.PANEL_DRAG_ENTER,{element:this,index:index},{index:index});
			}
		};
		var dragLeaveHandler = function(event)
		{
			if(dragElement && config.panelHoverClass)
			{
				util.removeStyleClass(this,config.panelHoverClass);	
				var index = this.getAttribute("nsDashboardCurIndex");
				util.dispatchEvent(this,NSDashboard.PANEL_DRAG_LEAVE,{element:this,index:index},{index:index});
			}
		};
		var dropHandler = function(event)
		{
			if(dragElement)
			{
				event = util.getEvent(event);
				if (event.stopPropagation) 
				{
					event.stopPropagation(); 
				}
				if (dragElement != this) 
				{
				  	util.swapElements(dragElement,this);
				  	var currIndex = dragElement.getAttribute("nsDashboardCurIndex");
				  	dragElement.setAttribute("nsDashboardCurIndex",this.getAttribute("nsDashboardCurIndex"));
				  	this.setAttribute("nsDashboardCurIndex",currIndex);
				  	var nsPanel = arrPanel[parseInt(this.getAttribute("nsDashboardOrgIndex"))].panel; 
				  	if(nsPanel)
				  	{
				  		nsPanel.__refreshToolbarIcon();
				  	}
				  	var index = this.getAttribute("nsDashboardCurIndex");
					util.dispatchEvent(this,NSDashboard.PANEL_DROP,{element:this,index:index},{index:index});
				}
				if(config.panelDragClass)
				{
					util.removeStyleClass(dragElement,config.panelDragClass);	
				}
				var nsPanel = arrPanel[parseInt(dragElement.getAttribute("nsDashboardOrgIndex"))].panel; 
			  	if(nsPanel)
			  	{
			  		nsPanel.__refreshToolbarIcon();
			  	}
				dragElement = null;
			}
		  	return false;
		};
		var dragEndHandler = function(event)
		{
			if(config.panelHoverClass)
			{
				for(var count = 0;count < arrPanel.length;count++)
				{
					var divPanel = arrPanel[count].panel.getBaseElement();
					util.removeStyleClass(divPanel,config.panelHoverClass);
				}
			}
			var index = this.getAttribute("nsDashboardCurIndex");
			util.dispatchEvent(this,NSDashboard.PANEL_DRAG_END,{element:this,index:index},{index:index});
		};
		var minimizeAddRemoveElement = function(element,parent,isAdd)
		{
			if(isAdd)
			{
				var index = parseInt(element.getAttribute("nsDashboardCurIndex"));
				util.insertElementAtIndex(parent,element,index);
			}
			else
			{
				parent.removeChild(element);
			}
		};
		var getID = function()
		{
			if(!id)
			{
				if(config.container.hasAttribute("id"))
				{
					id = config.container.getAttribute("id");
				}
				else if(config.container.hasAttribute("name"))
				{
					id = config.container.getAttribute("name");
				}
				else
				{
					id = "comp" + util.getUniqueId();
				}
			}
			return id;
		};
		
		initialize();
	};
	
	NSDashboard.PANEL_DRAG_START = "panelDragStart";
	NSDashboard.PANEL_DRAG_ENTER = "panelDragenter";
	NSDashboard.PANEL_DRAG_OVER = "panelDragover";
	NSDashboard.PANEL_DRAG_LEAVE = "panelDragleave";
	NSDashboard.PANEL_DROP = "panelDrop";
	NSDashboard.PANEL_DRAG_END = "panelDragend";
	
	return NSDashboard;
})();
nsModuleExport(__nsGlobal,"NSDashboard",NSDashboard);