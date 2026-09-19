 var NSToolBar = (function()
{
	var NSToolBar = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		this.selection = nsEditor.__selection;
		
		this.__parentContainer = null;
		this.__divToolBarContainer = null;
		this.__divToolBarContent = null;
		this.__editorDropDown = null;
		
		this.__groupedContainer = null;
		this.__btnGrouped = null;
		this.__groupedContainerDropdown = null;
		this.__groupedContainerDropdownContent = null;
		
		this.__nsToolTipInElement = null;
		this.__config = null;
		this.__toolBarPadding = null;
		this.__groupedTools = [];
		
		this.__windowClickRef = null;
		
		this.__arrowSVG = "<svg class=\"nsEditorIcon nsEditorIconArrow\" viewBox=\"0 0 10 10\"><path d=\"M.941 4.523a.75.75 0 1 1 1.06-1.06l3.006 3.005 3.005-3.005a.75.75 0 1 1 1.06 1.06l-3.549 3.55a.75.75 0 0 1-1.168-.136L.941 4.523z\"></path></svg>"
		
		this.__initialize = function()
		{
			var self = this;
			this.__nsEditor.__listenInternalEvent("resize",this.__resizeHandler.bind(this));
			this.__nsEditor.__listenInternalEvent("lineNumberVisibilityChanged",function(event){
				self.__divToolBarContainer.style.paddingLeft = (self.__nsEditor.__divLineNumberContainer.offsetWidth + 10) + "px";
			});
			this.__nsEditor.__listenInternalEvent("iframeInitialized",function(event){
				if(self.__nsEditor.__frameContentWindow)
				{
					self.util.addEvent(self.__nsEditor.__frameContentWindow,"click",self.__windowClickRef);
				}
			});
			this.__nsEditor.__listenInternalEvent("viewSourceChanged",function(event){
				var isDefaultDisabled = event.detail.isSourceMode;
				var item = event.detail.item;
				var key = event.detail.key;
				var arrKeys = Object.keys(self.__nsEditor.__toolBarButton);
				for(var count = 0;count < arrKeys.length;count++)
				{
					var itemKey = arrKeys[count];
					var toolBarItem = self.__nsEditor.__toolBarButton[itemKey];
					if(item != toolBarItem)
					{
						var disabled = toolBarItem.checkDisability ? toolBarItem.checkDisability(itemKey,toolBarItem,item,key,isDefaultDisabled) : true;
						self.__makeToolBarItemDisabled(toolBarItem,(isDefaultDisabled ? disabled : !disabled));
					}
				}
			});
			this.__nsEditor.__listenInternalEvent("textAreaInitialized",function(event){
				setTimeout(function()
				{
					self.__updateToolBarGrouping.call(self)
				}, 500)
			});
		};
		
		this.getToolBarContainer = function()
		{
			return this.__divToolBarContainer;
		};
		
		this.createToolBar = function()
		{
			this.__parentContainer = this.__nsEditor.__divOuterContainer;
			this.__config = this.__nsEditor.__config;
			this.__nsToolTipInElement = new this.util.nsToolTipInElement();
			this.__divToolBarContainer = this.util.createDiv(this.__nsEditor.getID() + "toolbarcontainer","nsEditorToolBarContainer");
			this.__parentContainer.appendChild(this.__divToolBarContainer);
			this.__divToolBarContent = this.util.createDiv(this.__nsEditor.getID() + "toolbarcontent","nsEditorToolBarContent");
			this.__divToolBarContainer.appendChild(this.__divToolBarContent);
			if(this.__config["enableToolBar"])
			{
				this.__createToolBarComponents();
			}
			else
			{
				this.__nsEditor.__handleVisibilityOfComponent(this.__divToolBarContainer,"enableToolBar");
			}
			this.__initSticy();
			if(!this.__windowClickRef)
			{
				this.__windowClickRef = this.__windowClickHandler.bind(this);
				this.util.addEvent(this.__nsEditor.__context,"click",this.__windowClickRef);
			}
			this.__editorDropDown =  this.util.createElement("ul",this.__nsEditor.getID() + "dropDown","nsEditorToolBarDropdown");
			this.__nsEditor.__compFixed.appendChild(this.__editorDropDown);
		};
		
		this.updateToolbar = function(element)
		{
			var self = this;
			var checkForTags = function(arrTags,item)
			{
				if(arrTags && arrTags.length > 0)
				{
					var tempElement = element;
					while (tempElement && tempElement.nodeType == 1) 
					{
						if (arrTags.indexOf(tempElement.tagName.toLowerCase()) > -1) 
						{
							self.__makeToolBarItemActive(item,true);
						}
						tempElement = tempElement.parentNode;
					}
				}
			};
			var checkForCSS = function(objCSS,item)
			{
				if(objCSS)
				{
					var tempElement = element;
					while (tempElement && tempElement.nodeType == 1) 
					{
						var arrCSS = Object.keys(objCSS);
						for(var cssCount = 0;cssCount < arrCSS.length;cssCount++)
						{
							if(isCSSValuePresentInElement(arrCSS[cssCount],objCSS[arrCSS[cssCount]]))
							{
								self.__makeToolBarItemActive(item,true);
							}
						}
						tempElement = tempElement.parentNode;
					}
					self.__nsEditor.__selection.setFocus();
				}
			};
			var isCSSValuePresentInElement = function(property,value)
			{
				var cssValue = self.util.getStyleValue(element,property);
				if(cssValue)
				{
					if(typeof (value) === "function")
					{
						var callback = value;
						if(callback && callback(cssValue.toString().toLowerCase()))
						{
							return true;
						}
					}
					else if(cssValue.toString().toLowerCase() === value)
					{
						return true;
					}
				}
				return false;
			};
			
			var arrKeys = Object.keys(this.__nsEditor.__toolBarButton);
			for(var count = 0;count < arrKeys.length;count++)
			{
				var key = arrKeys[count];
				var item = this.__nsEditor.__toolBarButton[key];
				this.__makeToolBarItemActive(item,false);
				var arrTags = item.tags;
				checkForTags(arrTags,item);
				var css = item.css;
				checkForCSS(css,item);
			}
		};
		
		this.destroy = function() 
		{
			if(this.__stickyScrollRef)
	    	{
	    		this.util.removeEvent(this.__nsEditor.__context,"scroll wheel mousewheel",this.__stickyScrollRef);
	    		this.__stickyScrollRef = null;
	    	}
			if(this.__windowClickRef)
			{
				this.util.removeEvent(this.__nsEditor.__context,"click",this.__windowClickRef);
				if(this.__nsEditor.__frameContentWindow)
				{
					this.util.removeEvent(this.__nsEditor.__frameContentWindow,"click",this.__windowClickRef);
				}
				this.__windowClickRef = null;
			}
		};
		
		this.__createToolBarComponents = function()
		{
			this.util.removeAllChildren(this.__divToolBarContent);
			if(this.__config["toolBarButton"] && this.__config["toolBarButton"].length > 0)
			{
				for(var count = 0;count < this.__config["toolBarButton"].length;count++)
				{
					var key = this.__config["toolBarButton"][count];
					if(this.__nsEditor.__toolBarButton[key])
					{
						this.__createToolBarButton(this.__nsEditor.__toolBarButton[key],this.__divToolBarContent,key);
						this.__updateShortKeyDictionary(this.__nsEditor.__toolBarButton[key],this.__divToolBarContent,key);
					}
				}
			}
		};
		
		this.__createToolBarButton = function(item,parent,key)
		{
			if(item)
			{
				var self = this;
				var btnItem =  this.util.createElement("button",null,"nsEditorToolBarButton");
				btnItem.innerHTML = item.html;
				if(item.tooltip && item.tooltip.length > 0)
				{
					this.__nsToolTipInElement.addToolTip(btnItem,item.tooltip);
				}
				if(item.isDropdown)
				{
					this.util.addStyleClass(btnItem,"nsEditorToolBarButtonDropdown");
					btnItem.appendChild(this.util.getElementFromHtml(this.__arrowSVG));
					this.util.addEvent(btnItem,"click",(function(item){
						return function(event){
							self.__toolBarDropdownClickHandler.call(self,item,key,event);
						};
					})(item));
				}
				else
				{
					this.util.addEvent(btnItem,"click",(function(item){
						return function(event){
							self.__toolBarButtonClickHandler.call(self,item,key,event);
						};
					})(item));
				}
				if(parent)
				{
					parent.appendChild(btnItem);
				}
				item.control = btnItem;
				item.selected = false;
				return btnItem;
			}
			return null;
		};
		
		this.__updateShortKeyDictionary = function(item,parent,key)
		{
			if(item)
			{
				if(item.shortKey)
				{
					var shortKey = item.shortKey;
					if(!this.util.isArray(shortKey))
					{
						shortKey = [shortKey];
					}
					for(var count = 0;count < shortKey.length;count++)
					{
						var tempKey = shortKey[count].toLowerCase();
						if(this.__nsEditor.__objShortKey[tempKey])
						{
							this.util.warning("NSEditor",tempKey + " has already been assigned to " + this.__nsEditor.__objShortKey[tempKey].key + ". It will overriden by " + key + ".")
						}
						this.__nsEditor.__objShortKey[tempKey] = {item: item,parent: parent,key: key};
					}
				}
				var arrItem = item.dataSource;
				if(arrItem && arrItem.length > 0)
				{
					for(var count = 0;count < arrItem.length;count++)
					{
						var childItem = arrItem[count];
						if(childItem.hasOwnProperty("htmlKey"))
						{
							childItem = this.__nsEditor.__toolBarButton[childItem["htmlKey"]];
						}
						if(childItem)
						{
							this.__updateShortKeyDictionary(childItem,item,childItem.value);
						}
					}
				}
			}
		}
		
		this.__makeToolBarItemActive = function(item,isActive)
		{
			if(item && this.__nsEditor.__config.enableToolBarActive)
			{
				item.selected = isActive;
				if(item.control)
				{
					isActive ? this.util.addStyleClass(item.control,"nsEditorToolBarItemActive") : this.util.removeStyleClass(item.control,"nsEditorToolBarItemActive");
				}
			}
		};
		
		this.__makeToolBarItemDisabled = function(item,isDisabled)
		{
			if(item)
			{
				item.selected = false;
				item.disabled = isDisabled;
				if(item.control)
				{
					isDisabled ? this.util.addStyleClass(item.control,"nsEditorToolBarButtonDisabled") : this.util.removeStyleClass(item.control,"nsEditorToolBarButtonDisabled");
				}
			}
		};
		
		this.__createToolBarDropdown = function(parentItem,key,event)
		{
			var arrItem = parentItem.dataSource;
			if(arrItem && arrItem.length > 0)
			{
				var self = this;
				this.util.removeAllChildren(this.__editorDropDown);
				for(var count = 0;count < arrItem.length;count++)
				{
					var item = arrItem[count];
					var value = item.value;
					if(item.hasOwnProperty("htmlKey"))
					{
						item = this.__nsEditor.__toolBarButton[item["htmlKey"]];
					}
					if(item)
					{
						var child = this.util.createElement("li",null,"nsEditorToolBarDropdownItem");
						child.innerHTML = item.html;
						child.setAttribute("data-nsEditor-value",value);
						this.util.addEvent(child,"click",(function(item){
							return function(event){
								self.__toolBarButtonClickHandler.call(self,item,key,event);
							};
						})(item));
						this.__editorDropDown.appendChild(child);
					}
				}
				this.__placeElementByEvent(this.__editorDropDown,event,{left: -22,top: 15});
				return this.__editorDropDown;
			}
			return null;
		};
		
		this.__toolBarDropdownClickHandler = function(item,key,event)
		{
			var dropdown = this.__createToolBarDropdown(item,event);
			if(dropdown)
			{
				this.__showToolBarDropdown(dropdown);
				this.editorUtil.stopEvent(event);
			}
		};
		
		this.__toolBarButtonClickHandler = function(item,key,event)
		{
			if(item)
			{
				if(!this.__nsEditor.getDisabled())
				{
					if(item.command)
					{
						this.__nsEditor.__executeCommand(item.command,item,key);
					}
					if(item.click)
					{
						item.click(item,key,event);
					}
					this.__makeToolBarItemActive(item,true);
				}
			}
		};
		
		this.__windowClickHandler = function(event)
		{
			//if(this.hasFocus())
			//{
				if (!this.util.hasStyleClass(event.target,"nsEditorToolBarButtonDropdown")) 
				{
					this.__hideToolBarDropdown();
				}
				this.__hideGroupedPopUp();
			//}
		};
		
		this.__showToolBarDropdown = function(dropdown)
		{
			if(!this.__isToolBarDropdownVisible())
			{
				dropdown = dropdown || this.__editorDropDown;
				var con = this.__isGroupedPopUpVisible() ? null : this.__parentContainer;
				var maxZIndex = this.util.getMaxZIndex(con);
				if(maxZIndex > 0)
				{
					var parent = dropdown.parentNode;
					parent.style.zIndex = maxZIndex + 1;
					dropdown.style.zIndex = maxZIndex + 1;
				}
				this.util.addStyleClass(dropdown,"nsEditorToolBarDropdownShow");
			}
		};
		
		this.__hideToolBarDropdown = function(dropdown)
		{
			dropdown = dropdown || this.__editorDropDown;
			this.util.removeStyleClass(dropdown,"nsEditorToolBarDropdownShow");
			var parent = dropdown.parentNode;
			parent.style.zIndex = "";
			dropdown.style.zIndex = "";
		};
		
		this.__isToolBarDropdownVisible = function(dropdown)
		{
			dropdown = dropdown || this.__editorDropDown;
			return this.util.hasStyleClass(dropdown,"nsEditorToolBarDropdownShow");
		};
		
		this.__resizeHandler = function(event)
		{
			var origEvent = event.originalEvent;
			this.__hideToolBarDropdown();
			this.__hideToolBarDropdown();
			this.__updateToolBarGrouping();
			this.__stickyScrollHandler(event);
		};
		
		this.__updateToolBarGrouping = function()
		{
			if (this.__divToolBarContainer && this.__divToolBarContainer.parentNode) 
			{
				var beforeGroupedTools = this.__groupedTools.length;
				var hasToolGrouped = false;

				while(this.__isToolbarOverflowing()) 
				{
					this.__groupLastTool();
					hasToolGrouped = true;
				}
				if (!hasToolGrouped && this.__groupedTools.length) 
				{
					while(this.__groupedTools.length && !this.__isToolbarOverflowing()) 
					{
						this.__ungroupFirstTool();
					}
					if (this.__isToolbarOverflowing()) 
					{
						this.__groupLastTool();
					}
				}
				if (this.__groupedTools.length !== beforeGroupedTools) 
				{
					this.__nsEditor.__dispatchInternalEvent("toolbarUpdate");
				}
			}
			this.__createHorizontalSeparator
		};
		
		this.__isToolbarOverflowing = function()
		{
			var win = this.__nsEditor.__getWindow();
			var arrToolBar = this.__nsEditor.__config.toolBarButton;
			var retValue = false;
			if(win && arrToolBar && arrToolBar.length) 
			{
				//uiDirection for later use
				var uiDir = "ltr";
				var toolbarRect = this.__divToolBarContainer.getBoundingClientRect();
				var lastChildRect = this.__divToolBarContainer.lastChild.getBoundingClientRect();
				if (!this.__toolBarPadding) 
				{
					var cssProperty = (uiDir == "ltr") ? "paddingRight" : "paddingLeft";
					//this.__toolBarPadding = this.util.getStyleValue(this.__divToolBarContainer,cssProperty,false,true,win);
					var computedStyle = win.getComputedStyle(this.__divToolBarContainer);
					this.__toolBarPadding = parseInt(computedStyle[cssProperty]);
				}
				if (uiDir == "ltr") 
				{
					//console.log(lastChildRect.right + " > " + (toolbarRect.right - this.__toolBarPadding));
					retValue = (lastChildRect.right) > (toolbarRect.right - this.__toolBarPadding);
				} 
				else 
				{
					retValue = lastChildRect.left < toolbarRect.left + this.__toolBarPadding;
				}
			}
			return retValue;
		};
		
		this.__groupLastTool = function()
		{
			if (!this.__groupedTools.length) 
			{
				this.__divToolBarContainer.appendChild(this.__getOverflowContainer());
			}
			var arrItem = this.__divToolBarContent.querySelectorAll(".nsEditorToolBarButton");
			if(arrItem && arrItem.length)
			{
				var btnItem = arrItem[arrItem.length - 1];
				this.__addToolInParent(btnItem,this.__groupedContainerDropdownContent,true);
				this.__groupedTools.unshift(btnItem);
				this.__refreshDividerInGroupedContent();
			}
		};
		
		this.__ungroupFirstTool = function()
		{
			var btnItem = this.__groupedTools[0];//this.__groupedContainerDropdownContent.querySelectorAll(".nsEditorToolBarButton")[0];
			this.__addToolInParent(btnItem,this.__divToolBarContent,false);
			this.__groupedTools.splice(0,1);
			if (!this.__groupedTools.length) 
			{
				this.__divToolBarContainer.removeChild(this.__getOverflowContainer());
			}
			//this.__refreshDividerInGroupedContent();
		};
		
		this.__getOverflowContainer = function()
		{
			if(!this.__groupedContainer)
			{
				this.__groupedContainer = this.util.createDiv(null,"nsEditorToolBarOveflowCon");
				this.__btnGrouped =  this.util.createElement("button",null,"nsEditorToolBarButton");
				this.__btnGrouped.innerHTML = "<i class='ns-icon ns-editor-vertical-dots' aria-hidden='true'></i>"; 
				this.__nsToolTipInElement.addToolTip(this.__btnGrouped,"Show Tools");
				this.__groupedContainer.appendChild(this.__btnGrouped);
				this.util.addEvent(this.__btnGrouped,"click",this.__handleOverflowClick.bind(this));
				var content = "<div class=\"nsEditorToolBarOveflowDropdown\">\r\n" + 
						"	<div class=\"nsEditorToolBarOveflowDropdownToolbar\">\r\n" + 
						"		<div class=\"nsEditorToolBarOveflowDropdownContent\">\r\n" + 
						"		</div>\r\n" + 
						"	</div>\r\n" + 
						"</div>";
				this.__groupedContainerDropdown = this.util.getElementFromHtml(content);
				this.__nsEditor.__compFixed.appendChild(this.__groupedContainerDropdown);
				this.__groupedContainerDropdownContent = this.__groupedContainerDropdown.querySelector(".nsEditorToolBarOveflowDropdownContent");
			}
			return this.__groupedContainer;
		};
		
		this.__refreshDividerInGroupedContent = function()
		{
			var arrItem = this.__groupedContainerDropdownContent.querySelectorAll(".nsEditorToolBarHorizontalSeparator");
			for(var count = arrItem.length - 1;count > -1;count--)
			{
				this.__groupedContainerDropdownContent.removeChild(arrItem[count]);
			}
			arrItem = this.__groupedContainerDropdownContent.querySelectorAll(".nsEditorToolBarButton");
			var afterElement = 3;
			for(var count = afterElement - 1;count < arrItem.length;count = count + afterElement)
			{
				var btn = arrItem[count];
				var div = this.util.createDiv(null,"nsEditorToolBarHorizontalSeparator");
				this.util.insertAfterElement(btn,div);
			}
		};
		
		this.__addToolInParent = function(btnItem,parent,isFirst)
		{
			isFirst ? parent.insertBefore(btnItem,parent.firstChild) : parent.appendChild(btnItem);
		};
		
		this.__handleOverflowClick = function(event)
		{
			this.__isGroupedPopUpVisible() ? this.__hideGroupedPopUp() : this.__showGroupedPopUp();
			this.editorUtil.stopEvent(event);
		};
		
		this.__showGroupedPopUp = function()
		{
			if(!this.__isGroupedPopUpVisible())
			{
				var con = this.__groupedContainerDropdown;
				this.util.addStyleClass(con,"nsEditorToolBarOveflowDropdownVisible");
				var rect = this.__groupedContainerDropdownContent.getBoundingClientRect();
				con.style.width = rect.width + "px";
				//console.log(con.getBoundingClientRect().width + " == " + this.__groupedContainerDropdownContent.getBoundingClientRect().width);
				this.__placeElementByEvent(con,event,{left: (-1 * rect.width) ,top: ((this.__btnGrouped.getBoundingClientRect().height) / 2)});
				var maxZIndex = this.util.getMaxZIndex(this.__parentContainer);
				if(maxZIndex > 0)
				{
					var parent = con.parentNode;
					parent.style.zIndex = maxZIndex + 1;
					con.style.zIndex = maxZIndex + 2;
				}
			}
		};
		
		this.__hideGroupedPopUp = function()
		{
			if(this.__groupedContainerDropdown)
			{
				var con = this.__groupedContainerDropdown;
				this.util.removeStyleClass(con,"nsEditorToolBarOveflowDropdownVisible");
				con.style.width = "";
				var parent = con.parentNode;
				parent.style.zIndex = "";
				con.style.zIndex = "";
			}
		};
		
		this.__isGroupedPopUpVisible = function()
		{
			return this.util.hasStyleClass(this.__groupedContainerDropdown,"nsEditorToolBarOveflowDropdownVisible");
		};
		
		//part for sticky header
	    
	    this.__stickyScrollRef = null;
	    this.__compDuplicate = null;
	    this.__isSticked = false;
	    this.__initSticy = function () 
		{
	    	if(!this.__stickyScrollRef)
	    	{
	    		this.__stickyScrollRef = this.__stickyScrollHandler.bind(this);
	    		this.util.addEvent(this.__nsEditor.__context,"scroll wheel mousewheel",this.__stickyScrollRef);
	    	}
		};
		
		this.__stickyScrollHandler = function (event) 
		{
			//event = this.util.getEvent(event);
			var win = this.__nsEditor.__context;
			var doc = this.__nsEditor.__dom.doc;
			var container = this.__parentContainer;
			var scrollTop = win.pageYOffset || (doc.documentElement && doc.documentElement.scrollTop) || 0;
			var offsetEditor = this.editorUtil.getOffset(container,true,doc);
			var hasScroll = (scrollTop > offsetEditor.top && scrollTop  < offsetEditor.top + offsetEditor.height);
			var enableInMobile = this.__config.enableStickyToolbarForMobile && this.__isDeviceMobile();
			var performSticky = !this.__isSourceMode && hasScroll && !enableInMobile;
			if(this.__config.enableStickyToolbar && this.__config.enableToolBar)
			{
				if(performSticky)
				{
					this.__makeSticky(this.__divToolBarContainer);
				}
				else
				{
					this.__removeSticky(this.__divToolBarContainer);
				}
				this.__nsEditor.__dispatchInternalEvent("stickyChanged",{isSticky: performSticky},{isSticky: performSticky});
			}
		};
		
		this.__isDeviceMobile = function() 
		{
			return false;
		};
		
		this.__makeSticky = function(comp) 
		{
			var container = this.__parentContainer;
			if(!this.__isSticked)
			{
				this.__createDuplicate(comp);
				this.util.addStyleClass(container,"nsEditorSticky");
				this.__isSticked = true;
			}
			var style = {top: 0,width: container.offsetWidth};
			this.util.css(comp,style);
			if(this.__nsEditor.__browserDetail.isMSIE && this.__compDuplicate)
			{
				style = {height: comp.offsetHeight};
				this.util.css(this.__compDuplicate,style);
			}
		};
		
		this.__removeSticky = function(comp) 
		{
			if(this.__isSticked)
			{
				var container = this.__parentContainer;
				var style = {top: "",width: ""};
				this.util.css(comp,style);
				this.util.removeStyleClass(container,"nsEditorSticky");
				this.__isSticked = false;
			}
		};
		
		this.__createDuplicate = function(comp) 
		{
			if(this.__nsEditor.__browserDetail.isMSIE && !this.__compDuplicate)
			{
				this.__compDuplicate = this.util.createDiv(null,"nsEditorStickyToolbar");
				comp.parentNode.insertBefore(this.__compDuplicate,comp);
			}
		};
		
		this.isToolbarSticky = function() 
		{
			return this.util.hasStyleClass(this.__parentContainer,"nsEditorSticky");
		};
	    
	    //end of sticky header
		
		this.__createHorizontalSeparator = function()
		{
			var comp = this.util.createElement("span",null,"nsEditorToolBarVerticalSeparator");
			return comp;
		};
		
		this.__placeElementByEvent = function(element,event,posOffset)
		{
			posOffset = posOffset || {left: 0,top: 0};
			var offset = this.util.getEventPosition(event);
			element.style.left = (offset.left + (posOffset.left * 1)) + "px";
			element.style.top = (offset.top + (posOffset.top * 1)) + "px";
		};
		
		this.__initialize();
	};
		
	return NSToolBar;
})();
nsModuleExport(__nsGlobal,"NSToolBar",NSToolBar);