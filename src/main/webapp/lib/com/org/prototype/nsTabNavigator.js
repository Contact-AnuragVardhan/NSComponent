var NSTabNavigator = (function()
{
	function NSTabNavigator(component,setting) 
	{
		this.__setting = setting;
		this.__config = null;
		
		this.__animationType = {fade:{css:"nsAnimateOpacity"},
								left:{css:"nsAnimateLeft"},
								right:{css:"nsAnimateRight"},
								top:{css:"nsAnimateTop"},
								bottom:{css:"nsAnimateBottom"},
								zoom:{css:"nsAnimateZoom"},
								slide:{css:"nsAnimateSlide",init:function(tabNav){
									if(!tabNav.carousel)
									{
										if(tabNav.__config.contentParent != this.__doc)
										{
											var setting = {element:tabNav.__config.contentParent,enableTouch: false,enable3DAnimation: false,
													enableDirectionNavigation: false,enablePageNavigation: false,postionBuffer:0};
											var carousel = new NSCarousel(setting);
											tabNav.carousel = carousel;
										}
										else
										{
											tabNav.util.warning("NSTabNavigator","Slide Animation cannot be applied on document.");
										}
									}
								},setIndex: function(tabNav,index,item){
									if(tabNav.carousel)
									{
										tabNav.carousel.setPage(index);
									}
								}
								
								},
							};
		this.__isVertical = false;
		this.__navInterval = null;
		this.__overflowIsAnimating = false;
		this.__overFlowScrollPos = 0;
		this.__compIndicator = null;
		this.__animationItem = null;
		this.__objBrowser = null;
		
		this.base.__setBaseComponent.call(this,component,true);
	};
	nsExtendPrototype(NSContainerBase,NSTabNavigator);
	NSTabNavigator.prototype.constructor = NSTabNavigator;
	
	NSTabNavigator.prototype.reRender = function()
	{
		this.__resizeHandler();
	};
	
	NSTabNavigator.prototype.initializeComponent = function() 
	{
		this.base.initializeComponent.call(this);
		this.__setSetting();
	};
	
	NSTabNavigator.prototype.setComponentProperties = function() 
	{
		this.base.setComponentProperties.call(this);
		this.__objBrowser = this.util.getBrowser();
		this.__initTabs();
	};
	
	NSTabNavigator.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty)
	{
		var attributeName = attrName.toLowerCase();
		this.base.propertyChange.call(this,attrName, oldVal, newVal, setProperty);
	};
	
	NSTabNavigator.prototype.componentResized = function(event) 
	{
		this.base.componentResized(event);
	};
	
	NSTabNavigator.prototype.removeComponent = function() 
	{
		this.base.removeComponent.call(this);
	};
	
	NSTabNavigator.prototype.renderAddedComponents = function() 
	{
		//assuming ContentSelector as Unique key here
		if(this.__config.arrObjTabs && this.__config.arrObjTabs.length) {
			var objTabs = this.__config.arrObjTabs.reduce(function(obj, item, index) {
				  obj[item.contentSelector] = {item: item, index: index, found: false};
				  return obj;
			}, {});
			var arrTabs = this.__config.tabContainer.querySelectorAll(this.__config.tabParentElement);
			for(var count = 0;count < arrTabs.length;count++)
			{
				var objTab = this.__getTabObject(arrTabs[count]);
				if(objTab)
				{
					//exists
					if(objTabs[objTab.contentSelector]) {
						objTabs[objTab.contentSelector].found = true;
					}
					//not exists
					else {
						this.__config.arrObjTabs.push(objTab);
						this.__initTab(objTab);
					}
				}
			}
			var contentSelector = null;
			for (contentSelector in objTabs) {
			    if (objTabs.hasOwnProperty(contentSelector) && !objTabs[contentSelector].found) {
			    	this.__config.arrObjTabs.splice(objTabs[contentSelector].index,1);
			    }
			}
		}
		//this.__setDefault();
		this.__resizeHandler();
	};
	
	NSTabNavigator.prototype.__setSetting = function()
	{
		var setting = this.__setting;
		if(!setting)
		{
			setting = {};
		}
		this.__config = {
			context: setting["context"] || this.__win,
			enableCreateTabs: Boolean.parse(setting["enableCreateTabs"]),
			arrTabs: setting["arrTabs"],
			tabParentElement: (this.util.isUndefined(setting["tabParentElement"])) ? "li" : setting["tabParentElement"],
			tabElement: setting["tabElement"] || "a",
			tabAttribute: setting["tabAttribute"] || "href",
			contentParent: this.util.isUndefinedOrNull(setting["contentParent"]) ? this.__doc : this.util.getElement(setting["contentParent"]),
			event: setting["event"] || "click",
			tabTemplateCallback: setting["tabTemplateCallback"],
			enableHashChange: Boolean.parse(setting["enableHashChange"]),
			enableClose: Boolean.parse(setting["enableClose"]),
			enableAnimation: Boolean.parse(setting["enableAnimation"]),
			animationType: setting["animationType"] || "Fade",
			enableOverflow: this.util.isUndefinedOrNull(setting["enableOverflow"]) ? true : Boolean.parse(setting["enableOverflow"]),
			extraLeftButtons:setting["extraLeftButtons"],
			extraRightButtons:setting["extraRightButtons"],
			overflowScrollDistance: setting["overflowScrollDistance"] ||  300,
			overflowScrollDuration: setting["overflowScrollDuration"] ||  300,
			enableIndicator: this.util.isUndefinedOrNull(setting["enableIndicator"]) ? true : Boolean.parse(setting["enableIndicator"]),
		};
	};
	
	NSTabNavigator.prototype.__initTabs = function()
	{
		this.__config.arrObjTabs = [];
		if(this.__config.contentParent != this.__doc)
		{
			this.util.addStyleClass(this.__config.contentParent,"nsTabContentParent");
			this.__applyTheme(this.__config.contentParent,"nsTabContentParent");
		}
		this.__config.tabContainer = this.__baseComponent;
		if(this.__config.enableCreateTabs)
		{
			if(this.__config.arrTabs && this.__config.arrTabs.length > 0)
			{
				this.__createTabs();
			}
			else
			{
				this.util.throwNSError("NSTabNavigator","arrTabs property is blank for creating Dynamic Tabs.");
			}
		}
		var parentElement = this.__config.tabContainer.parentElement;
		var divParentParentParent = this.util.createDiv(this.getID() + "ParentParentParent","nsTabNavigatorParentParentParent");
		var divParentParent = this.util.createDiv(this.getID() + "ParentParent","nsTabNavigatorParentParent");
		var divParent = this.util.createDiv(this.getID() + "Parent","nsTabNavigatorParent");
		divParentParent.appendChild(divParent);
		divParentParentParent.appendChild(divParentParent);
		parentElement.insertBefore(divParentParentParent,this.__config.tabContainer);
		divParent.appendChild(this.__config.tabContainer);
		this.__config.tabContainerParent = divParent;
		this.__config.tabContainerParentParent = divParentParent;
		this.__config.tabContainerParentParentParent = divParentParentParent;
		var isLeftNavigator = (this.__config.enableOverflow || (this.__config.extraLeftButtons && this.__config.extraLeftButtons.length > 0));
		var isRightNavigator = (this.__config.enableOverflow || (this.__config.extraRightButtons && this.__config.extraRightButtons.length > 0));
		if(isLeftNavigator)
		{
			var divLeftNavigator = this.util.createDiv(this.getID() + "Left","nsTabNavigatorLeft");
			divParentParent.insertBefore(divLeftNavigator,divParent);
			this.__config.leftNavigator = divLeftNavigator;
		}
		if(isRightNavigator)
		{
			var divRightNavigator = this.util.createDiv(this.getID() + "Right","nsTabNavigatorRight");
			divParentParent.appendChild(divRightNavigator);
			this.__config.rightNavigator = divRightNavigator;
		}
		if(this.__config.enableOverflow)
		{
			this.__createOverflowComp();
		}
		this.util.addStyleClass(this.__config.tabContainer,"nsTabNavigator");
		this.__applyTheme(this.__config.tabContainer,"nsTabNavigator");
		var arrTabs = this.__config.tabContainer.querySelectorAll(this.__config.tabParentElement);
		for(var count = 0;count < arrTabs.length;count++)
		{
			var objTab = this.__getTabObject(arrTabs[count]);
			if(objTab)
			{
				this.__config.arrObjTabs.push(objTab);
				this.__initTab(objTab);
			}
		}
		if(this.__config.enableIndicator)
		{
			this.__createIndicator();
		}
		this.__setDefault();
		this.__resizeHandler();
	};
	
	NSTabNavigator.prototype.__createTabs = function()
	{
		if(this.__config.arrTabs && this.__config.arrTabs.length > 0)
		{
			for(var count = 0;count < this.__config.arrTabs.length;count++)
			{
				var item = this.__config.arrTabs[count];
				var tab = this.util.createElement(this.__config.tabElement);
				tab.appendChild(this.__doc.createTextNode(item.tab));
				var tabParent = this.util.createElement(this.__config.tabParentElement);
				tabParent.appendChild(tab);
				this.__config.tabContainer.appendChild(tabParent);
				var contentID = item.contentId;
				if(item.content)
				{
					contentID = this.getID() + "-" + item.tab;
					var divContent = this.util.createDiv(contentID);
					divContent.innerHTML = item.content;
					this.__config.contentParent.appendChild(divContent);
				}
				tab.setAttribute(this.__config.tabAttribute,"#" + contentID);
				if(item.isDisabled)
				{
					tab.setAttribute("data-ns-disabled","true");
				}
				if(item.isHidden)
				{
					tab.setAttribute("data-ns-hidden","true");
				}
				if(item.isDefault)
				{
					tab.setAttribute("data-ns-default","true");
				}
				if(item.indicatorColor)
				{
					tab.setAttribute("data-ns-indicatorcolor",item.indicatorColor);
				}
			}
		}
	};
	
	NSTabNavigator.prototype.__createIndicator = function()
	{
		if(!this.__compIndicator)
		{
			this.__compIndicator = this.util.createElement("span",this.getID() + "Indicator","nsTabIndicator");
			this.__applyTheme(this.__compIndicator,"nsTabIndicator");
			this.__config.tabContainer.appendChild(this.__compIndicator);
		}
	};
	
	NSTabNavigator.prototype.__moveIndicator = function(item)
	{
		if(this.__compIndicator)
		{
			 var textPosition = item.tabContainer.getBoundingClientRect();
	         var container = this.__config.tabContainer.getBoundingClientRect().left;
	         var distance = textPosition.left - container;
             var scroll = this.__config.tabContainer.scrollLeft;
             this.__compIndicator.style.transform = "translateX(" + (distance + scroll) + "px) scaleX(" + textPosition.width * 0.01 + ")";
             if (item.indicatorColor) 
             {
            	 this.__compIndicator.style.backgroundColor = item.indicatorColor;
             }
		}
	};
	
	NSTabNavigator.prototype.__resizeHandler = function()
	{
		//IE Bug not taking the Height
		//if(this.__objBrowser.isMSIE)
		//{
			if(this.__config.tabContainer.offsetHeight > 0)
			{
				var height = this.__config.tabContainer.offsetHeight + "px";
				var parentID = this.getID() + "ParentParentParent";
				this.util.addCSSClassInDOM(["#" + parentID,"#" + parentID + " #" + this.getID() + "Left","#" + parentID + " #" + this.getID() + "Right"],["max-height:" + height + ";","max-height:" + height + ";","max-height:" + height + ";"]);
			}
		//}
		if(this.__config.enableOverflow)
		{
			var overflowValue = this.__checkOverflow(this.__config.tabContainerParent,this.__config.tabContainer);
			switch(overflowValue)
			{
				case "none":
					this.__setOverflowCompDisplay(false);
					this.__setOverflowCompEnabled(true,true);
				break;
				case "both":
					this.__setOverflowCompEnabled(true,true);
					this.__setOverflowCompDisplay(true);
				break;
				case "left":
					this.__setOverflowCompEnabled(true,false);
					this.__setOverflowCompDisplay(true);
				break;
				case "right":
					this.__setOverflowCompEnabled(false,true);
					this.__setOverflowCompDisplay(true);
				break;
			}
		}
	};
	
	NSTabNavigator.prototype.__createOverflowComp = function()
	{
		var divOverflowLeft = this.util.createDiv(null,"nsTabNav nsTabLeftArrow");
		this.__applyTheme(divOverflowLeft,"nsTabNav");
		divOverflowLeft.innerHTML = "<svg viewBox=\"0 0 40 40\" fill=\"currentColor\" height=\"100%\" width=\"100%\" style=\"vertical-align: middle;\"><g><path d=\"m25.7 12.3l-7.7 7.7 7.7 7.7-2.3 2.3-10-10 10-10z\"></path></g></svg>";
		this.__config.leftNavigator.appendChild(divOverflowLeft);
		this.util.addEvent(divOverflowLeft,"mousedown",this.__navMouseDownHandler.bind(this,"left"));
		this.util.addEvent(divOverflowLeft,"mouseup mouseleave",this.__navMouseLeaveHandler.bind(this,"left"));
		this.__config.leftNav = divOverflowLeft;
		var divOverflowRight = this.util.createDiv(null,"nsTabNav nsTabRightArrow");
		this.__applyTheme(divOverflowRight,"nsTabNav");
		divOverflowRight.innerHTML = "<svg viewBox=\"0 0 40 40\" fill=\"currentColor\" height=\"100%\" width=\"100%\" style=\"vertical-align: middle;\"><g><path d=\"m16.6 10l10 10-10 10-2.3-2.3 7.7-7.7-7.7-7.7z\"></path></g></svg>";
		this.__config.rightNavigator.appendChild(divOverflowRight);
		this.util.addEvent(divOverflowRight,"mousedown",this.__navMouseDownHandler.bind(this,"right"));
		this.util.addEvent(divOverflowRight,"mouseup mouseleave",this.__navMouseLeaveHandler.bind(this,"right"));
		this.__config.rightNav = divOverflowRight;
	};
	
	NSTabNavigator.prototype.__navMouseDownHandler = function(direction,event)
	{
		event = this.util.getEvent(event);
		event.stopPropagation();
		var tabContainer = this.__config.tabContainer;
		//var left = tabContainer.scrollLeft;
		var scrollDistance = this.__config.overflowScrollDistance;
		var maxScrollLeft = tabContainer.scrollWidth - tabContainer.clientWidth;
		var scrollerAnimate = null;
		var self = this;
		var leftHandler = function()
		{
			var left = tabContainer.scrollLeft;
			if(left > 0)
			{
				self.__overFlowScrollPos = Math.max(left - scrollDistance,0);
				//tabContainer.scrollLeft = (left - scrollDistance);
				animate(self.__overFlowScrollPos);
				self.__overflowIsAnimating = true;
			}
			else
			{
				self.__navMouseLeaveHandler.call(self,"left",event);
			}
		};
		var rightHandler = function()
		{
			var left = tabContainer.scrollLeft;
			if(maxScrollLeft > left)
			{
				var outerWidth = self.util.getOuterWidth(tabContainer);
				self.__overFlowScrollPos = Math.min(left + tabContainer.scrollWidth - outerWidth);
				//tabContainer.scrollLeft = (left + scrollDistance);
				animate(left + scrollDistance);
				self.__overflowIsAnimating = true;
			}
			else
			{
				self.__navMouseLeaveHandler.call(self,"left",event);
			}
		};
		var animate = function(newPos)
		{
			var scrollAnimateSetting = {element: tabContainer,direction:"horizontal",callback: callback};
      		scrollerAnimate = new NSScrollAnimator(scrollAnimateSetting);
      		scrollerAnimate.scrollTo(newPos);
		};
		var callback = function()
		{
			scrollerAnimate.stop();
			self.__overflowIsAnimating = false;
		};
		if(this.__navInterval)
		{
			clearInterval(this.__navInterval);
			this.__navInterval = null;
		}
		var func = (direction == "left") ? leftHandler : rightHandler;
		func();
		this.__navInterval = setInterval(function(){
			if(!self.__overflowIsAnimating)
			{
				func();
			}
	    }, this.__config.overflowScrollDuration);
	};
	
	NSTabNavigator.prototype.__navMouseLeaveHandler = function(direction,event)
	{
		this.__overflowIsAnimating = false;
		if(this.__navInterval)
		{
			clearInterval(this.__navInterval);
			this.__navInterval = null;
			var self = this;
			setTimeout(function(){
				self.__resizeHandler.call(self);
			}, this.__config.overflowScrollDuration);
		}
	};
	
	NSTabNavigator.prototype.__setOverflowCompDisplay = function(isVisible)
	{
		var display = isVisible ? "" : "none";
		if(this.__config.leftNav)
		{
			this.__config.leftNav.style.display = display;
		}
		if(this.__config.rightNav)
		{
			this.__config.rightNav.style.display = display;
		}
	};
	
	NSTabNavigator.prototype.__setOverflowCompEnabled = function(isLeftEnabled,isRightEnabled)
	{
		if(this.__config.leftNav)
		{
			isLeftEnabled ? this.util.removeStyleClass(this.__config.leftNav,"nsTabNavDisabled") : this.util.addStyleClass(this.__config.leftNav,"nsTabNavDisabled");
		}
		if(this.__config.rightNav)
		{
			isRightEnabled ? this.util.removeStyleClass(this.__config.rightNav,"nsTabNavDisabled") : this.util.addStyleClass(this.__config.rightNav,"nsTabNavDisabled");
		}
	};
	
	NSTabNavigator.prototype.__setDefault = function()
	{
		for(var count = 0;count < this.__config.arrObjTabs.length;count++)
		{
			var item = this.__config.arrObjTabs[count];
			if(item.isActive)
			{
				item.tabContainer[this.__config.event]();
				break;
			}
		}
		if(!item || !item.isActive)
		{
			item = this.__config.arrObjTabs[0];
			item.isActive = true;
			item.tabContainer[this.__config.event]();
		}
	};
	
	NSTabNavigator.prototype.__showTab = function(item)
	{
		var retValue = false;
		if(this.__isItemNavigatable(item) && (!this.__config.selectedItem || this.__config.selectedItem.tab != item.tab))
		{
			for(var count = 0;count < this.__config.arrObjTabs.length;count++)
			{
				var itemComp = this.__config.arrObjTabs[count];
				if(itemComp.tab == item.tab)
				{
					var itemDispatch = {tab:itemComp.tab,text:itemComp.tab.textContent,attributeValue:itemComp.contentSelector,content:itemComp.content};
					var cancelled = this.util.dispatchEvent(this.__baseComponent,NSTabNavigator.TAB_CHANGE_STARTING,itemDispatch,{selectedTab: itemDispatch},null,true);
					if(cancelled)
					{
						console.debug("NSTabNavigator: Tab Moved was cancelled");
					}
					else
					{
						this.__config.selectedItem = itemComp;
						itemComp.isActive = true;
						this.util.addStyleClass(itemComp.tabContainer,"nsTabContainerActive");
						this.__updateContent(itemComp);
						retValue = true;
						if(this.__config.enableHashChange) 
						{
		                    if(history.pushState) 
		                    {
		                        if (!this.__win.location.origin) 
		                        {
		                        	this.__win.location.origin = this.__win.location.protocol + "//" + this.__win.location.hostname + (this.__win.location.port ? ':' + this.__win.location.port: '');
		                        }
		                        history.pushState(null, null, this.__win.location.origin + this.__win.location.pathname + this.__win.location.search + itemComp.contentSelector);
		                    } 
		                    else 
		                    {
		                    	this.__win.location.hash = itemComp.contentSelector;
		                    }
		                }
						this.__moveIndicator(itemComp);
						this.util.dispatchEvent(this.__baseComponent,NSTabNavigator.TAB_CHANGED,itemDispatch,{selectedTab: itemDispatch});
					}
					this.util.dispatchEvent(this.__baseComponent,NSTabNavigator.TAB_CHANGE_END,itemDispatch,{selectedTab: itemDispatch});
				}
				else
				{
					itemComp.isActive = false;
					this.util.removeStyleClass(itemComp.tabContainer,"nsTabContainerActive");
					this.util.removeStyleClass(itemComp.content,"nsTabContentActive");
				}
			}
		}
		return retValue;
	};
	
	NSTabNavigator.prototype.__updateContent = function(item)
	{
		if(item)
		{
			this.util.addStyleClass(item.content,"nsTabContentActive");
			if(this.__animationItem && this.__animationItem.setIndex)
			{
				var index = this.__getIndexByItem(item);
				this.__animationItem.setIndex(this,index,item);
			}
			
		}
		
	};
	
	NSTabNavigator.prototype.__getTabObject = function(tabContainer)
	{
		if(tabContainer)
		{
			var objReturn = {};
			objReturn.tabContainer = tabContainer;
			objReturn.tab = tabContainer.querySelector(this.__config.tabElement);
			objReturn.contentSelector = objReturn.tab.getAttribute(this.__config.tabAttribute) || objReturn.tabContainer.getAttribute(this.__config.tabAttribute);
			objReturn.content = this.__getContent(objReturn.contentSelector);
			if(objReturn.content)
			{
				objReturn.isDisabled = objReturn.tab.hasAttribute("data-ns-disabled") || objReturn.tabContainer.hasAttribute("data-ns-disabled");
				objReturn.isHidden = objReturn.tab.hasAttribute("data-ns-hidden") || objReturn.tabContainer.hasAttribute("data-ns-hidden");
				objReturn.isActive = objReturn.tab.hasAttribute("data-ns-default") || objReturn.tabContainer.hasAttribute("data-ns-default");
				objReturn.indicatorColor = objReturn.tab.hasAttribute("data-ns-indicatorcolor") ? objReturn.tab.getAttribute("data-ns-indicatorcolor") : (objReturn.tabContainer.hasAttribute("data-ns-indicatorcolor") ? objReturn.tabContainer.hasAttribute("data-ns-indicatorcolor") : null);
				return objReturn;
			}
		}
		return null;
	};
	
	NSTabNavigator.prototype.__initTab = function(item)
	{
		if(item)
		{
			this.util.addEvent(item.tabContainer,this.__config.event,this.__tabClickHandler.bind(this,item));
			this.util.addStyleClass(item.tabContainer,"nsTabContainer");
			this.util.addStyleClass(item.tab,"nsTab");
			this.util.addStyleClass(item.content,"nsTabContent");
			this.__applyTheme(item.content,"nsTabContent");
			if(item.isHidden)
			{
				item.tab.setAttribute('aria-selected', 'false');
				item.tab.setAttribute('tabindex', '-1');
				this.util.addStyleClass(item.tabContainer,"nsTabContainerHidden");
			}
			else if(item.isDisabled)
			{
				this.util.addStyleClass(item.tabContainer,"nsTabContainerDisabled");
			}
			if(this.__config.enableClose && this.__isItemNavigatable(item))
			{
				var spanClose = this.util.createElement("span",null,"nsTabClose");
				spanClose.innerHTML = "&times;";
				item.tabContainer.appendChild(spanClose);
				item.close = spanClose;
				this.util.addEvent(spanClose,"click",this.__tabCloseHandler.bind(this,item));
				this.util.addStyleClass(item.tab,"nsTabWithClose");
			}
			if(this.__config.enableAnimation && this.__config.animationType)
			{
				if(this.__animationType[this.__config.animationType.toLowerCase()])
				{
					this.__animationItem = this.__animationType[this.__config.animationType.toLowerCase()];
					this.util.addStyleClass(item.content,this.__animationItem.css);
					if(this.__animationItem.init)
					{
						this.__animationItem.init(this);
					}
				}
				else
				{
					this.util.warning("NSTabNavigator","Please mention a valid animation Type.");
				}
			}
		}
	};
	
	NSTabNavigator.prototype.__tabClickHandler = function(item,event)
	{
		var hasChanged = this.__showTab(item);
		event = this.util.getEvent(event);
		event.preventDefault();
		/*if(this.__config.enableHashChange)
		{
			if(!hasChanged)
			{
				event.preventDefault();
			}
		}
		else
		{
			event.preventDefault();
		}*/
	};
	
	NSTabNavigator.prototype.__tabCloseHandler = function(item,event)
	{
		if(item)
		{
			event = this.util.getEvent(event);
			event.preventDefault();
			event.stopPropagation();
			item.isHidden = true;
			item.tab.setAttribute('aria-selected', 'false');
			item.tab.setAttribute('tabindex', '-1');
			this.util.addStyleClass(item.tabContainer,"nsTabContainerHidden");
			var prevItem = this.__getPrevActiveItem(item);
			if(prevItem)
			{
				this.__showTab(prevItem);
			}
			else
			{
				var nextItem = this.__getNextActiveItem(item);
				if(nextItem)
				{
					this.__showTab(nextItem);
				}
				else
				{
					this.util.addStyleClass(item.content,"nsTabContentHidden");
					this.util.removeStyleClass(item.content,"nsTabContentActive");
				}
			}
		}
	};
	
	NSTabNavigator.prototype.__isItemNavigatable = function(item)
	{
		if(item)
		{
			if(item.isHidden || item.isDisabled)
			{
				return false;
			}
			return true;
		}
		return false;
	};
	
	NSTabNavigator.prototype.__getContent = function(contentSelector)
	{
		if(contentSelector)
		{
			var content = this.__config.contentParent.querySelector(contentSelector);
			return content;
		}
		return null;
	};
	
	NSTabNavigator.prototype.__getPrevActiveItem = function(item)
	{
		var prevItem = null;
		if(item)
		{
			for(var count = 0;count < this.__config.arrObjTabs.length;count++)
			{
				var itemComp = this.__config.arrObjTabs[count];
				if(itemComp.tab == item.tab)
				{
					break;
				}
				if(this.__isItemNavigatable(itemComp))
				{
					prevItem = itemComp;
				}
			}
		}
		return prevItem;
	};
	
	NSTabNavigator.prototype.__getNextActiveItem = function(item)
	{
		var nextItem = null;
		if(item)
		{
			var index = this.__getIndexByItem(item);
			if(index > -1)
			{
				for(var count = index + 1;count < this.__config.arrObjTabs.length;count++)
				{
					var itemComp = this.__config.arrObjTabs[count];
					if(this.__isItemNavigatable(itemComp))
					{
						nextItem = itemComp;
						break;
					}
				}
			}
			
		}
		return nextItem;
	};
	
	NSTabNavigator.prototype.__getIndexByItem = function(item)
	{
		for(var count = 0;count < this.__config.arrObjTabs.length;count++)
		{
			var itemComp = this.__config.arrObjTabs[count];
			if(itemComp.tab == item.tab)
			{
				return count;
			}
		}
		return -1;
	};
	
	NSTabNavigator.prototype.__checkOverflow = function(parentElement,scrollElement)
	{
		if(!parentElement || !scrollElement || !this.__isElementVisible(parentElement))
		{
			return "none";
		}
		/*var parentElementWidth = this.__isVertical ? parentElement.offsetHeight : parentElement.offsetWidth;
        var scrollElementWidth = this.__isVertical ? scrollElement.offsetHeight : scrollElement.offsetWidth;
        if (parentElementWidth === scrollElementWidth) 
        {
            itemWidth = this.itemWidthCal(this.scrollModule ? this.getScrollCntEle(innerItem) : innerItem);
        }*/
		var outerWidth = this.util.getOuterWidth(scrollElement);
		if(scrollElement.scrollWidth > outerWidth)
		{
			if((scrollElement.scrollWidth - outerWidth != scrollElement.scrollLeft) && scrollElement.scrollLeft != 0)
			{
				return "both";
			}
			//right disabled
			else if(scrollElement.scrollWidth - outerWidth == scrollElement.scrollLeft)
			{
				return "left";
			}
			//left disabled
			else if(scrollElement.scrollLeft == 0) 
			{
				return "right";
			}
		}
		return "none";
	};
	
	NSTabNavigator.prototype.__itemWidthCal = function(element)
	{
		
	};
	
	NSTabNavigator.prototype.__isElementVisible = function(element)
	{
		return (element.style.visibility === "" && element.offsetWidth > 0);
	};
	
	NSTabNavigator.TAB_CHANGE_STARTING = "tabChangeStarting";
	NSTabNavigator.TAB_CHANGED = "tabChanged";
	NSTabNavigator.TAB_CHANGE_END = "tabChangeEnd";
	
	return NSTabNavigator;
})();
nsModuleExport(__nsGlobal,"NSTabNavigator",NSTabNavigator);