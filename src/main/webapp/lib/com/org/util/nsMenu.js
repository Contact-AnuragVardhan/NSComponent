 "use strict"; 
var NSMenu = (function()
{
	function NSMenu(setting) 
	{
		this.util = new NSUtil();
		this.DEFAULT_POSITION = this.util.POS_BOTTOMRIGHT;
		
		this.__setting = setting;
		this.__config = null;
		
		this.__id = null;
		this.__popUp = null;
		this.__nsPopUp = null;
		this.__fieldItem = null;
		this.__fieldItemChild = null;
		this.__fieldChild = "children";
		this.__isInternalCall = false;
		this.__suppressDocumentHandler = false;
		
		this.__documentClickRef = null;
		this.__documentKeyUpRef = null;
		this.__lastSelectedTarget = null;
		
		this.__initialize();
	}
	
	NSMenu.prototype.create = function (dataSource) 
	{ 
		if(dataSource && (this.__config.createRunTime || this.__isInternalCall))
		{
			if(this.__popUp)
			{
				this.remove();
			}
			this.__isInternalCall = false;
			this.__config.dataSource = dataSource;
			this.__popUp = this.__createElement(true,this.__config.dataSource);
			this.util.addStyleClass(this.__nsPopUp,"nsMainMenu");
		}
	};
	
	NSMenu.prototype.remove = function () 
	{ 
		if(this.__config.createRunTime || this.__isInternalCall)
		{
			this.__isInternalCall = false;
			this.__nsPopUp.remove();
			this.__popUp = null;
		}
	};
	
	NSMenu.prototype.show = function (event) 
	{ 
		event = this.util.getEvent(event);
		this.__nsPopUp.hideOtherNSPopUp();
		if(this.__config.createRunTime)
		{
			this.__isInternalCall = true;
			var dataSource = null;
			if(this.__config.sourceProvider)
			{
				dataSource = this.__config.sourceProvider(this.__lastSelectedTarget);
			}
			if(dataSource && dataSource.length > 0)
			{
				this.create(dataSource);
			}
			else
			{
				this.util.preventDefault(event);
				return;
			}
		}
		this.__nsPopUp.show();
		this.__nsPopUp.placePopUp(event);
		if(!this.__documentClickRef)
		{
			this.__documentClickRef = this.__documentClickHandler.bind(this);
			this.util.addEvent(document.documentElement,"click", this.__documentClickRef);
		}
		if(!this.__documentKeyUpRef)
		{
			this.__documentKeyUpRef = this.__documentKeyUpHandler.bind(this);
			this.util.addEvent(document.documentElement,"keyup", this.__documentKeyUpRef);
		}
		this.util.preventDefault(event);
	};
	NSMenu.prototype.hide = function() 
	{
		this.__lastSelectedTarget = null;
		this.__hideAllSubMenus();
		if(this.__config.createRunTime)
		{
			this.__isInternalCall = true;
			this.remove();
		}
		else
		{
			this.__nsPopUp.hide();
		}
		if(this.__documentClickRef)
		{
			this.util.removeEvent(document.documentElement,"click", this.__documentClickRef, false);
			this.__documentClickRef = null;
		}
		if(this.__documentKeyUpRef)
		{
			this.util.removeEvent(document.documentElement,"keyup", this.__documentKeyUpRef, false);
			this.__documentKeyUpRef = null;
		}
	};
	
	NSMenu.prototype.__initialize = function ()
	{
		if(this.__setting)
		{
			//eventHandler:extra eventHandler which developer wants to execute on the event i.e. click,customEvent etc
			this.__config = {
					parent: this.__setting["parent"] || null,
					dataSource: this.__setting["dataSource"] || null,
					isContextMenu: (this.util.isUndefined(this.__setting["isContextMenu"]) || this.__setting["isContextMenu"] === null) ? true : Boolean.parse(this.__setting["isContextMenu"]),
					eventType: this.__setting["eventType"] || "click",
					createRunTime: (this.util.isUndefined(this.__setting["createRunTime"]) || this.__setting["createRunTime"] === null) ? false : Boolean.parse(this.__setting["createRunTime"]),
					sourceProvider: this.__setting["sourceProvider"] || null,
					targetType: this.__setting["targetType"] || null,
					defaultHandler: (this.__setting["defaultHandler"] ? this.util.getFunction(this.__setting["defaultHandler"]) : null),
					eventHandler: (this.__setting["eventHandler"] ? this.util.getFunction(this.__setting["eventHandler"]) : null),
					position: this.__setting["position"] || this.DEFAULT_POSITION,
					width: parseInt(this.__setting["width"]) || -1
				};
			if(this.__config.parent)
			{
				var popUpSetting = {id:this.__getID() + "menu",type:"ul",width:this.__config.width,position:this.__config.position};
				this.__nsPopUp = new this.util.nsPopUp(popUpSetting);
				this.__fieldItem = this.__getID() + "_item";
				this.__fieldItemChild = this.__getID() + "_child";
				if(!this.__config.createRunTime)
				{
					this.__isInternalCall = true;
					this.create(this.__config.dataSource);
				}
				if(this.__config.isContextMenu)
				{
					this.util.addEvent(this.__config.parent,"contextmenu", this.__parentContextMenuHandler.bind(this));
				}
				else
				{
					this.util.addEvent(this.__config.parent,this.__config.eventType, this.__parentClickHandler.bind(this),false);
				}
			}
		}
	};
	
	NSMenu.prototype.__createElement = function(isRoot,dataSource) 
	{
		var parentNode = null;
		if(dataSource && dataSource.length > 0)
		{
			if(isRoot)
			{
				parentNode = this.__nsPopUp.create();
			}
			else
			{
				parentNode = document.createElement("ul"); 
				this.util.addStyleClass(parentNode,"nsMenu");
				if(this.__config.width > -1)
				{
					parentNode.style.width = this.__config.width + "px";
				}
			}
			for (var count = 0; count < dataSource.length; count++) 
			{
				var item = dataSource[count];
				this.__createItem(item,parentNode);
			}
		}
		return parentNode;
	};
	
	NSMenu.prototype.__createItem = function(item,parent)
	{
		var menuItem = null;
		if(item)
		{
			menuItem = document.createElement("li");
			this.util.addStyleClass(menuItem,"nsMenuItem");
			if(item["header"])
			{
				this.util.addStyleClass(menuItem,"nsHeader");
			}
			if(item["disabled"])
			{
				this.util.addStyleClass(menuItem,"nsDisabled");
			}
			var button = document.createElement("BUTTON");
			this.util.addStyleClass(button,"nsMenuButton");
			if(item["iconHTML"])
			{
				var spanIcon = document.createElement("span");
				this.util.addStyleClass(spanIcon,"nsMenuAlign");
				spanIcon.innerHTML = item["iconHTML"];
				button.appendChild(spanIcon);
			}
			var spanText = document.createElement("span");
			this.util.addStyleClass(spanText,"nsMenuText");
			spanText.appendChild(document.createTextNode(item["title"]));
			button.appendChild(spanText);
			menuItem.appendChild(button);
			this.util.addEvent(menuItem,"click",this.__itemClickHandler.bind(this));
			this.util.addEvent(menuItem,"mouseenter",this.__itemMouseOverHandler.bind(this));
			this.util.addEvent(menuItem,"mouseleave",this.__itemMouseOutHandler.bind(this));
			if(item[this.__fieldChild]) 
			{
				this.util.addStyleClass(menuItem,"nsSubMenu");
		    	var subMenu = this.__createElement(false,item[this.__fieldChild]);
		    	if(subMenu)
		    	{
		    		this.util.addStyleClass(subMenu,"nsSubMenuContainer");
			    	menuItem.appendChild(subMenu);
			    	item[this.__fieldItemChild] = subMenu;
			    	menuItem.setAttribute("hasChild",true);
		    	}
			}
			else
			{
				menuItem.setAttribute("hasChild",false);
			}
			if(parent)
			{
				parent.appendChild(menuItem);
				if(item["separatorBelow"])
				{
					var lineMenuItem = document.createElement("li");
					this.util.addStyleClass(lineMenuItem,"nsMenuSeparator");
					parent.appendChild(lineMenuItem);
				}
			}
			item[this.__fieldItem] = menuItem;
		}
		return menuItem;
	};
	
	NSMenu.prototype.__itemClickHandler = function(event) 
	{
		event = this.util.getEvent(event);
		var target = this.util.getTarget(event);
		target = this.util.findParent(target,"LI");
		var item = this.__getItem(target,this.__config.dataSource);
		if(item)
		{
			var handler = null;
			if(item["handler"])
			{
				handler = this.util.getFunction(item["handler"]);
			}
			if(!handler)
			{
				handler = this.__config.defaultHandler;
			}
			if(handler)
			{
				handler(this.__lastSelectedTarget,item);
			}
		}
		this.hide();
		event.stopImmediatePropagation();
	};
	
	NSMenu.prototype.__itemMouseOverHandler = function(event) 
	{
		var target = this.util.getTarget(event);
		target = this.util.findParent(target,"LI");
		if(target.getAttribute("hasChild") === "true")
		{
			var item = this.__getItem(target,this.__config.dataSource);
			if(item && item[this.__fieldItemChild])
			{
				var childMenu = item[this.__fieldItemChild];
				this.util.addStyleClass(childMenu,"nsShowMenu");
			}
		}
	};
	
	NSMenu.prototype.__itemMouseOutHandler = function(event) 
	{
		var target = this.util.getTarget(event);
		target = this.util.findParent(target,"LI");
		if(target.getAttribute("hasChild") === "true")
		{
			var item = this.__getItem(target,this.__config.dataSource);
			if(item && item[this.__fieldItemChild])
			{
				var childMenu = item[this.__fieldItemChild];
				this.util.removeStyleClass(childMenu,"nsShowMenu");
			}
		}
	};
	
	NSMenu.prototype.__documentClickHandler = function(event) 
	{
		event = this.util.getEvent(event);
		/*if(!this.__config.isContextMenu && this.__isParentPresent(event.target,this.__config.parent))
		{
			return;
		}*/
		//commenting this so that menu closes on click in Grid
		/*if(this.__suppressDocumentHandler)
		{
			this.__suppressDocumentHandler = false;
			return;
		}*/
		this.hide();
	};
	
	
	NSMenu.prototype.__documentKeyUpHandler = function(event) 
	{
		event = this.util.getEvent(event);
		if(event.keyCode === this.util.KEYCODE.ESC) 
		{
			this.hide();
		}
	};
	
	NSMenu.prototype.__parentContextMenuHandler = function(event)
	{
		if(this.__config.eventHandler)
		{
			this.__config.eventHandler(event);
		}
		this.__setLastSelectedTarget(this.util.getTarget(event));
		this.show(event);
	};
	
	NSMenu.prototype.__parentClickHandler = function(event)
	{
		if(this.__config.eventHandler)
		{
			this.__config.eventHandler(event);
		}
		this.__setLastSelectedTarget(this.util.getTarget(event));
		//below condition to make documentClickhandler aware that do not hide the menu,hence put only for click handler
		if(this.__config.eventType === "click")
		{
			this.__suppressDocumentHandler = true;
			event.stopPropagation();
		}
		this.show(event);
	};
	
	NSMenu.prototype.__getItem = function(objItem,dataSource)
	{
		if(objItem)
		{
			for (var count = 0; count < dataSource.length; count++) 
			{
				var item = dataSource[count];
				if(item[this.__fieldItem] == objItem)
				{
					return item;
				}
				if(item.hasOwnProperty(this.__fieldChild))
				{
					var childItem = this.__getItem(objItem,item[this.__fieldChild]);
					if(childItem)
					{
						return childItem;
					}
				}
			}
		}
		return null;
	};
	
	NSMenu.prototype.__hideAllSubMenus = function()
	{
		var arrSubMenus = this.__popUp.querySelectorAll("ul");
		if(arrSubMenus && arrSubMenus.length > 0)
		{
			var subMenu = null;
			for(var count = 0;count < arrSubMenus.length;count++)
			{
				subMenu = arrSubMenus[count];
				this.util.removeStyleClass(subMenu,"nsShowMenu");
			}
		}
	};
	
	NSMenu.prototype.__setLastSelectedTarget = function(target)
	{
		if(target && this.__config.targetType)
		{
			target = this.util.findParent(target,this.__config.targetType);
		}
		this.__lastSelectedTarget = target;
	};
	
	NSMenu.prototype.__getID = function()
	{
		if(!this.__id)
		{
			if(this.__config.parent.hasAttribute("id"))
			{
				this.__id = this.__config.parent.getAttribute("id");
			}
			else if(this.__config.parent.hasAttribute("name"))
			{
				this.__id = this.__config.parent.getAttribute("name");
			}
			else
			{
				this.__id = "comp" + this.util.getUniqueId();
			}
		}
		return this.__id;
	};
	
	NSMenu.prototype.__isParentPresent =  function(node,parentNode) 
	{
		while (node && node!== document.body)
		{
			if(node.id === parentNode.id) 
			{
				return true;
			}
			node = node.parentNode;
		}
		return false;
	};
	
	return NSMenu;
})();
nsModuleExport(__nsGlobal,"NSMenu",NSMenu);