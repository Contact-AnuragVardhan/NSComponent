var NSNavigation = (function()
{
	function NSNavigation(component,setting) 
	{
		this.__setting = setting;
		
		this.__navigationContainerParent = null;
		this.__navigationContainer = null;
		this.__conSearch = null;
		this.__txtSearch = null;
		
		this.__config = null;
		this.__domVar = null;
		this.__selectedParentMenuItem = null;
		this.__selectedMenu = null;
		this.__selectedMenuItem = null;
		this.__isNavOpen = false;
		this.__dynamicContainer = null;
		this.__isDataHierarchical = false;
		this.__nsFloatingLabel = null;
		
		this.__fieldPrefix = "__ns_nav_field";
		this.__fieldIsOpen = this.__fieldPrefix + "_open";
		this.__fieldElement = this.__fieldPrefix + "_element";
		this.__fieldChildContainer = this.__fieldPrefix + "_childcontainer";
		this.__fieldChildMenuIconContainer = this.__fieldPrefix + "_menuiconcontainer";
		this.__fieldParentMenuItem = this.__fieldPrefix + "_parentmenuitem";
		
		this.__headerItem = null;
		this.__headerItemHeight = 0;
		this.__interval = null;
		
					
		this.base.__setBaseComponent.call(this,component);
	};
	
	nsExtendPrototype(NSContainerBase,NSNavigation);
	NSNavigation.prototype.constructor = NSNavigation;
	
	NSNavigation.prototype.initializeComponent = function() 
	{
		this.base.initializeComponent.call(this);
		this.__domVar = this.util.getDomVariables();
		this.__setSetting();
	};
	
	NSNavigation.prototype.setComponentProperties = function() 
	{
		this.base.setComponentProperties.call(this);
		if(this.__config.dataSource)
		{
			this.dataSource(this.__config.dataSource);
		}
	};
	
	NSNavigation.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty)
	{
		var attributeName = attrName.toLowerCase();
		this.base.propertyChange.call(this,attrName, oldVal, newVal, setProperty);
	};
	
	NSNavigation.prototype.removeComponent = function() 
	{
		this.base.removeComponent.call(this);
	};
	
	NSNavigation.prototype.componentResized = function(event) 
	{
		this.base.componentResized.call(this,event);
	};
	
	NSNavigation.prototype.isNavOpen = function()
	{
		return this.__isNavOpen;
	};
	
	NSNavigation.prototype.toggleNavigation = function()
	{
		if(this.__isNavOpen)
		{
			this.closeNavigation();
		}
		else
		{
			this.openNavigation();
		}
	};
	
	NSNavigation.prototype.openNavigation = function()
	{
		this.util.dispatchEvent(this.__baseComponent,NSNavigation.NAVIGATION_OPEN_START);
		this.util.removeStyleClass(this.__config.containerElement,"nsNavCollapsed");
		this.__isNavOpen = true;
		var self = this;
		var transitionEndCallback = function()
		{
			self.__resizeContentContainer();
			this.util.dispatchEvent(this.__baseComponent,NSNavigation.NAVIGATION_OPEN_END);
		};
		var transition = new this.util.transition(this.__baseComponent,transitionEndCallback.bind(this));
	};
	
	NSNavigation.prototype.closeNavigation = function()
	{
		this.util.dispatchEvent(this.__baseComponent,NSNavigation.NAVIGATION_CLOSE_START);
		this.util.addStyleClass(this.__config.containerElement,"nsNavCollapsed");
		this.__isNavOpen = false;
		var self = this;
		var transitionEndCallback = function()
		{
			self.__resizeContentContainer();
			this.util.dispatchEvent(this.__baseComponent,NSNavigation.NAVIGATION_CLOSE_END);
		};
		var transition = new this.util.transition(this.__baseComponent,transitionEndCallback.bind(this));
	};
	
	NSNavigation.prototype.getItemByField = function(field,value,source)
	{
		return this.__getItemByField(field,value,source);
	};
	
	NSNavigation.prototype.selectMenu = function(itemOrElement)
	{
		var item = null;
		if(this.util.isElement(itemOrElement))
		{
			item = this.__getItemByElement(itemOrElement);
		}
		else
		{
			item = itemOrElement;
		}
		if(item)
		{
			this.__handleSelectedMenu(item);
			this.__invokeMenuClickHandler(item,null);
		}
	};
	
	NSNavigation.prototype.dataSource = function(source)
	{
		if(source) {
			this.__config.dataSource = source;
			this.__config.orignalDataSource = this.__config.dataSource ? this.__config.dataSource.slice(0) : [];
			this.__isDataHierarchical = false;
			if(source && source.length)
			{
				var item = null;
				for(var count = 0;count < source.length;count++)
				{
					item = source[count];
					if(this.__hasChildren(item))
					{
						this.__isDataHierarchical = true;
						break;
					}
				}
			}
			this.__renderItems();
		}
		return this.__config.dataSource;
	};
	
	NSNavigation.prototype.setTheme = function(theme)
	{
		this.base.setTheme.call(this,theme);
		if(this.__nsFloatingLabel)
		{
			this.__nsFloatingLabel.setTheme(theme);
		}
	};
	
	NSNavigation.prototype.collapse = function(item)
	{
		if(item && item[this.__fieldElement] && this.__hasChildren(item) && item[this.__fieldIsOpen])
		{
			var self = this;
			this.util.removeStyleClass(item[this.__fieldElement],"nsNavItemOpen");
			this.util.removeStyleClass(item[this.__fieldElement],"nsNavItemActive");
			if(item[this.__fieldChildContainer])
			{
				if(this.__config.enableAnimation)
				{
					this.util.slideUp(item[this.__fieldChildContainer],20,function(element){
						self.util.removeStyleClass(item[self.__fieldChildContainer],"nsNavSubNavContainerVisible");
						item[self.__fieldChildMenuIconContainer].innerHTML = self.__config.iconMenuCollapsed;
					});
				}
				else
				{
					this.util.removeStyleClass(item[this.__fieldChildContainer],"nsNavSubNavContainerVisible");
					item[this.__fieldChildMenuIconContainer].innerHTML = this.__config.iconMenuCollapsed;
				}
			}
			item[this.__fieldIsOpen] = false;
		}
	};
	
	NSNavigation.prototype.expand = function(item)
	{
		if(item && item[this.__fieldElement] && this.__hasChildren(item) && !item[this.__fieldIsOpen])
		{
			var self = this;
			this.util.addStyleClass(item[this.__fieldElement],"nsNavItemOpen");
			this.util.addStyleClass(item[this.__fieldElement],"nsNavItemActive");
			if(item[this.__fieldChildContainer])
			{
				if(this.__config.enableAnimation)
				{
					this.util.slideDown(item[this.__fieldChildContainer],20,function(element){
						self.util.addStyleClass(item[self.__fieldChildContainer],"nsNavSubNavContainerVisible");
						item[self.__fieldChildMenuIconContainer].innerHTML = self.__config.iconMenuExpanded;
					});
				}
				else
				{
					this.util.addStyleClass(item[this.__fieldChildContainer],"nsNavSubNavContainerVisible");
					item[this.__fieldChildMenuIconContainer].innerHTML = this.__config.iconMenuExpanded;
				}
			}
			item[this.__fieldIsOpen] = true;
		}
	};
	
	NSNavigation.prototype.__setSetting = function()
	{
		if(!this.__setting)
		{
			this.__setting = {};
		}
		if(!this.__setting["customClass"])
		{
			this.__setting["customClass"] = {};
		}
		this.__config = {
			containerElement: this.__setting["containerElement"] || this.__domVar.doc.body,
			elementsBeforeMenu: this.__setting["elementsBeforeMenu"] || null,
			pageHeaderContainer: this.__setting["pageHeaderContainer"] || null,
			pageContentContainer: this.__setting["pageContentContainer"] || null,
			header: this.__setting["header"] || null,
			showCollapseIcon: this.util.isUndefinedOrNull(this.__setting["showCollapseIcon"]) ? true : Boolean.parse(this.__setting["showCollapseIcon"]),
			iconCollapse: this.__setting["iconCollapse"] || "<i class='fa fa-bars pull-right'></i>",
			dataSource: this.__setting["dataSource"] || null,
			titleField: this.__setting["titleField"] || "title",
			childField: this.__setting["childField"] || "children",
			iconPosition: this.__setting["iconPosition"] || "left",
			iconMenuExpanded: this.__setting["iconMenuExpanded"] || ((this.__setting["iconPosition"] === 'right') ? "<i class='ns-icon ns-navigation-arrow-down'></i>" : "<i class='ns-icon ns-navigation-arrow-down'></i>"),
			iconMenuCollapsed: this.__setting["iconMenuCollapsed"] || ((this.__setting["iconPosition"] === 'right') ? "<i class='ns-icon ns-navigation-arrow-left'></i>" : "<i class='ns-icon ns-navigation-arrow-right'></i>"),
			context: this.__setting["context"] || this.__domVar.win,
			collapseLeftOffset: parseInt(this.__setting["collapseLeftOffset"]) || 0,
			collapseTopOffset: parseInt(this.__setting["collapseTopOffset"]) || 0,
			isPositionAbsolute: this.util.isUndefinedOrNull(this.__setting["isPositionAbsolute"]) ? true : Boolean.parse(this.__setting["isPositionAbsolute"]),
			extraAttribute: this.__setting["extraAttribute"],// to set link for Angular 2 or other framework attributes
			enableAnimation: Boolean.parse(this.__setting["enableAnimation"]),
			enableFilter: this.util.isUndefinedOrNull(this.__setting["enableFilter"]) ? true : Boolean.parse(this.__setting["enableFilter"]),
			filterConfig: this.__setting["filterConfig"] || {},
			customClass:{navContainer:this.__setting.customClass["navContainer"] || null,
					  menuContainer:this.__setting.customClass["menuContainer"] || null,
					  headerMenu:this.__setting.customClass["headerMenu"] || null,
					  menu:this.__setting.customClass["menu"] || null,
					  selectedParentMenu:this.__setting.customClass["selectedParentMenu"] || "nsNavParentSelectedMenu",
					  selectedMenu:this.__setting.customClass["selectedMenu"] || "nsNavSelectedMenu"}
		};
		//same as nsFloatingLabel properties except interval
		var filterConfig = this.__config.filterConfig;
		filterConfig.interval = this.util.isUndefinedOrNull(filterConfig["interval"]) ? 500 : parseInt(filterConfig["interval"]);
		filterConfig.label = filterConfig["label"] || "Filter";
		this.__createStructure();
	};
	
	NSNavigation.prototype.__renderItems = function()
	{
		if(this.__navigationContainer)
		{
			var arrChildren = this.__navigationContainer.children;
			if(arrChildren && arrChildren.length)
			{
				var length = arrChildren.length;
				var child = null;
				for(var count = length - 1;count > -1 ;count--)
				{
					child = arrChildren[count];
					if(child && this.util.hasStyleClass(child,"nsNavigationItem"))
					{
						child.parentElement.removeChild(child);
					}
				}
			}
			//this.util.removeAllChildren(this.__navigationContainer);
			//this.__createHeader(this.__navigationContainer);
			//this.__createSearchComponents(this.__navigationContainer);
			this.__createItems(this.__config.dataSource,this.__navigationContainer,1,null);
		}
	};
	
	NSNavigation.prototype.__createStructure = function()
	{
		if(!this.__navigationContainerParent)
		{
			this.util.removeAllChildren(this.__navigationContainerParent);
			this.__navigationContainerParent = null;
			this.__navigationContainer = null;
		}
		this.openNavigation();
		this.util.addStyleClass(this.__baseComponent,"nsNavMainContainer");
		this.__applyTheme(this.__baseComponent,"nsNavMainContainer");
		if(this.__config.isPositionAbsolute)
		{
			this.util.addStyleClass(this.__baseComponent,"nsNavMainContainerAbsolute");
		}
		this.util.addEvent(this.__baseComponent,"mouseleave",this.__parentMouseEventHandler.bind(this,null,"mouseleave"));
		//header start
		this.__navigationHeaderParent = this.util.createDiv(this.getID() + "HeaderParent","nsNavHeaderParent");
		this.__applyCustomClass(this.__navigationHeaderParent,"navHeader");
		this.__navigationHeader = this.util.createElement("ul",this.getID() + "Header","nsNavHeader");
		this.__applyCustomClass(this.__navigationHeader,"menuHeader");
		this.__addElementsBeforeMenu(this.__navigationHeaderParent);
		this.__createHeader(this.__navigationHeader);
		this.__createSearchComponents(this.__navigationHeader);
		this.__navigationHeaderParent.appendChild(this.__navigationHeader);
		//header end
		//body start
		this.__navigationContainerParent = this.util.createDiv(this.getID() + "ContainerParent","nsNavContainerParent");
		this.__applyCustomClass(this.__navigationContainerParent,"navContainer");
		this.__navigationContainer = this.util.createElement("ul",this.getID() + "Container","nsNavContainer nsNavContainerIcon" + this.util.toCamelCase(this.__config.iconPosition,true));
		this.__applyCustomClass(this.__navigationContainer,"menuContainer");
		this.__navigationContainerParent.appendChild(this.__navigationContainer);
		//body end
		//Footer start
		this.__navigationFooterParent = this.util.createDiv(this.getID() + "FooterParent","nsNavHeaderFooter");
		this.__applyCustomClass(this.__navigationFooterParent,"navFooter");
		//Footer end
		if(this.__config.pageHeaderContainer && this.__config.pageHeaderContainer.offsetHeight > 0)
		{
			this.__baseComponent.style.marginTop = this.__config.pageHeaderContainer.offsetHeight + "px";
		}
		this.__baseComponent.appendChild(this.__navigationHeaderParent);
		this.__baseComponent.appendChild(this.__navigationContainerParent);
		this.__baseComponent.appendChild(this.__navigationFooterParent);
		this.__headerItemHeight = this.__headerItem ? this.__headerItem.offsetHeight : 0;
	};
	
	NSNavigation.prototype.__addElementsBeforeMenu = function(parent)
	{
		if(parent && this.__config.elementsBeforeMenu && this.__config.elementsBeforeMenu.length > 0)
		{
			var length = this.__config.elementsBeforeMenu.length;
			for(var count = 0;count < length;count++)
			{
				var element = this.__config.elementsBeforeMenu[count];
				if(element)
				{
					parent.appendChild(element);
				}
			}
		}
	};
	
	NSNavigation.prototype.__createHeader = function(parent)
	{
		this.__headerItem = this.util.createElement("li",null,"nsNavTitle");
		this.__applyCustomClass(this.__headerItem,"headerMenu");
		if(this.__config.header)
		{
			var span = this.util.createElement("span",null,"nsNavHeaderTitle");
			this.util.addStyleClass(span,"nsNavNonVisibleIcon");
			span.appendChild(this.__domVar.doc.createTextNode(this.__config.header));
			this.__headerItem.appendChild(span);
		}
		if(this.__config.showCollapseIcon)
		{
			var spanIcon = this.util.createElement("span",null,"nsNavVisibleIcon");
			spanIcon.innerHTML = this.__config.iconCollapse;
			this.util.addEvent(spanIcon,"click",this.__toggleIconClickHandler.bind(this));
			this.__headerItem.appendChild(spanIcon);
		}
		parent.appendChild(this.__headerItem);
	};
	
	NSNavigation.prototype.__createSearchComponents = function(parent)
	{
		if(this.__config.enableFilter)
		{
			this.__conSearch = this.util.createElement("li",this.getID() + "SearchContainer","nsNavSearchContainer");
			parent.appendChild(this.__conSearch);
			var filterConfig = this.__config.filterConfig;
			filterConfig.container = this.__conSearch;
			this.__nsFloatingLabel = new NSFloatingLabel(filterConfig);
			this.util.addEvent(this.__conSearch,"input",this.__txtSearchChangeHandler.bind(this));
		}
	};
	
	NSNavigation.prototype.__txtSearchChangeHandler = function(event)
	{
		clearTimeout(this.__interval);
		var self = this;
		this.__interval = setTimeout(function(){
				self.__filterRecord.call(self,self.__nsFloatingLabel.value());
			}, this.__config.filterConfig.interval);
	};
	
	NSNavigation.prototype.__createItems = function(arrItem,parent,level,parentMenuItem)
	{
		if(arrItem)
		{
			if(!this.util.isArray(arrItem))
			{
				arrItem = [arrItem];
			}
			var item = {};
			for(var count = 0;count < arrItem.length;count++)
			{
				item = arrItem[count];
				if(item)
				{
					var li = this.__createItem(item,level,parentMenuItem);
					parent.appendChild(li);
				}
			}
		}
	};
	
	//While Changing this function, see if this change is applicable in __createDynamicItem function
	NSNavigation.prototype.__createItem = function(item,level,parentMenuItem)
	{
		var li = this.util.createElement("li",null,"nsNavigationItem");
		this.__applyCustomClass(li,"menu");
		li.setAttribute("ns-Nav-Level",level);
		if(item["cssClass"])
		{
			this.util.addStyleClass(li,item["cssClass"]);
		}
		if(level == 1)
		{
			this.util.addEvent(li,"mouseenter",this.__parentMouseEventHandler.bind(this,item,"mouseenter"));
			//this.util.addEvent(li,"mouseleave",this.__parentMouseEventHandler.bind(this,item,"mouseleave"));
			//this.util.addEvent(li,"click",this.__parentMouseEventHandler.bind(this,item,"mouseenter"));
		}
		item[this.__fieldElement] = li;
		item[this.__fieldIsOpen] = false;
		if(item["disabled"])
		{
			this.util.addStyleClass(li,"nsNavigationItemDisabled");
		}
		var anchor = this.util.createElement("a",null);
		li.appendChild(anchor);
		if(item["iconBeforeHtml"])
		{
			var spanIcon = this.util.createElement("span");
			this.util.addStyleClass(spanIcon);
			spanIcon.innerHTML = item["iconBeforeHtml"];
			var icon = spanIcon.firstChild;
			anchor.appendChild(icon);
			anchor.appendChild(this.__domVar.doc.createTextNode("\u00A0"));
		}
		var spanText = this.util.createElement("span",null,"nsNavMenuText");
		this.util.addStyleClass(spanText,"nsNavNonVisibleIcon");
		spanText.appendChild(this.__domVar.doc.createTextNode(item[this.__config.titleField]));
		anchor.appendChild(spanText);
		if(item["iconAfterHtml"])
		{
			var spanIcon = this.util.createElement("span");
			spanIcon.innerHTML = item["iconAfterHtml"];
			var icon = spanIcon.firstChild;
			anchor.appendChild(icon);
		}
		var hasChildren = false;
		if(this.__hasChildren(item))
		{
			this.util.addEvent(anchor,"click",this.__parentMenuClickHandler.bind(this,item));
			this.util.addStyleClass(li,"nsNavItemParent");
			anchor.setAttribute("href","javascript:void(0)");
			var spanIcon = this.util.createElement("span");
			this.util.addStyleClass(spanIcon,"nsNavNonVisibleIcon");
			spanIcon.innerHTML = this.__config.iconMenuExpanded;
			if(this.__config.iconPosition == "left")
			{
				anchor.insertBefore(spanIcon,anchor.firstChild);
			}
			else
			{
				this.util.addStyleClass(spanIcon,"nsNavContainerPullRight");
				anchor.appendChild(spanIcon);
			}
			var ul = this.util.createElement("ul",null,"nsNavSubNavContainer");
			this.util.addStyleClass(ul,"nsNavNonVisibleIcon");
			if(this.__config.enableAnimation)
			{
				this.util.addStyleClass(ul,"nsNavSubNavAnimate");
			}
			li.appendChild(ul);
			item[this.__fieldChildMenuIconContainer] = spanIcon;
			item[this.__fieldChildContainer] = ul;
			this.__createItems(item[this.__config.childField],ul,level + 1,item);
			hasChildren = true;
		}
		else
		{
			this.__setLink(anchor,item["link"]);
			this.__setExtraAttrubtesForLink(anchor,item);
		}
		this.util.addEvent(anchor,"click",this.__menuClickHandler.bind(this,item,li,hasChildren));
		if(level > 1)
		{
			this.util.addStyleClass(li,"nsNavigationChildItem");
		}
		if(parentMenuItem)
		{
			item[this.__fieldParentMenuItem] = parentMenuItem;
		}
		if(item["selected"] && !item["disabled"])
		{
			this.__selectMenu(item,li,false);
			this.__invokeMenuClickHandler(item,li);
		}
		if(hasChildren && item["expanded"] && !item["disabled"])
		{
			this.__selectMenu(item,li,true);
		}
		return li;
	};
	
	NSNavigation.prototype.__invokeMenuClickHandler = function(item,li)
	{
		li = li || item[this.__fieldElement];
		if(li)
		{
			var anchor = li.querySelector("a");
			if(anchor)
			{
				anchor.click();
			}
		}
	};
	
	NSNavigation.prototype.__selectMenu = function(item,li,isExpandOnly)
	{
		if(!li && item && item[this.__fieldElement])
		{
			li = item[this.__fieldElement];
		}
		if(item)
		{
			var parentMenuItem = item[this.__fieldParentMenuItem];
			if(isExpandOnly)
			{
				parentMenuItem = item;
			}
			else
			{
				if(li)
				{
					this.__handleSelectedMenu(item,li);
				}
				parentMenuItem = item[this.__fieldParentMenuItem];
			}
			while (parentMenuItem)
			{
				if(parentMenuItem[this.__fieldElement])
				{
					this.util.addStyleClass(parentMenuItem[this.__fieldElement],"nsNavItemOpen");
					if(parentMenuItem[this.__fieldChildContainer])
					{
						this.util.addStyleClass(parentMenuItem[this.__fieldChildContainer],"nsNavSubNavContainerVisible");
					}
					parentMenuItem[this.__fieldIsOpen] = true;
				}
				parentMenuItem = parentMenuItem[this.__fieldParentMenuItem];
			}
		}
	};
	
	NSNavigation.prototype.__menuClickHandler = function(item,li,hasChildren,event)
	{
		event = this.util.getEvent(event);
		if(!hasChildren)
		{
			this.__handleSelectedMenu(item,li);
			if(item["click"])
			{
				if (typeof item["click"] === "string" || item["click"] instanceof String)
				{
					if(this.util.isFunction(item["click"]))
					{
						item["click"] = this.__config.context[item["click"]];
					}
				}
				if(item["click"] && this.util.isFunction(item["click"]))
				{
					item["click"](event,item,li);
				}
			}
			//dont remove it as it is used in React as the page refreshed on click
			event.preventDefault();
			event.stopPropagation();
		}
	};
	
	NSNavigation.prototype.__toggleIconClickHandler = function(event)
	{
		this.__destroyDynamicItem();
		this.toggleNavigation();
	};
	
	NSNavigation.prototype.__parentMenuClickHandler = function(item,event)
	{
		if(item && item[this.__fieldElement])
		{
			item[this.__fieldIsOpen] ? this.collapse(item) : this.expand(item);
			this.__selectedParentMenuItem = item;
		}
		
	};
	
	NSNavigation.prototype.__parentMouseEventHandler = function(item,eventType,event)
	{
		event = this.util.getEvent(event);
		//for some reason event.type is coming as load so passing eventType to listener
		switch(eventType)
		{
			case "mouseenter":
				if(item && item[this.__fieldElement] && !this.__isNavOpen)
				{
					this.__createDynamicItem(item);
				}
				//this.util.addStyleClass(item[this.__fieldElement],"nsNavParentHover");
			break;
			case "mouseleave":
				this.__destroyDynamicItem();
				//this.util.removeStyleClass(item[this.__fieldElement],"nsNavParentHover");
			break;
		}
	};
	
	NSNavigation.prototype.__filterRecord = function(searchText)
	{
		 if(searchText && searchText.length > 0)
		 {
			 var field = this.__config.titleField;
			 var filter = {};
			 filter[field] = searchText;
			 var setting = {};
			 setting[field] = {caseSensitive:false,multiline:false,matchType:new NSFilter().CONTAINS};
			 this.__handleFiltering(filter,setting);
		 }
		 else
		 {
			 this.__resetFiltering();
		 }
	};
	
	NSNavigation.prototype.__resizeContentContainer = function()
	{
		if(this.__config.pageContentContainer)
		{
			this.__config.pageContentContainer.style.marginLeft = this.__baseComponent.offsetWidth + "px";	
		}
	};
	
	NSNavigation.prototype.__getTopOffset = function()
	{
		var offset = 0;
		if(this.__config.elementsBeforeMenu && this.__config.elementsBeforeMenu.length > 0)
		{
			var length = this.__config.elementsBeforeMenu.length;
			for(var count = 0;count < length;count++)
			{
				var element = this.__config.elementsBeforeMenu[count];
				if(element)
				{
					offset += element.offsetHeight;
				}
			}
		}
		if(!this.__isNavOpen)
		{
			offset += this.__headerItemHeight;
		}
		return offset;
	};
	
	NSNavigation.prototype.__handleFiltering = function(filter,setting,recordLimit)
	{
		var eventParam = {filter:filter,setting:setting,recordLimit:recordLimit};
		this.util.dispatchEvent(this.__baseComponent,NSNavigation.FILTER_CHANGING,eventParam,eventParam);
		this.__filteredColumn = [];
		if(filter)
	    {
			 var isHierarchical = this.__isDataHierarchical;
			 this.__config.dataSource = this.__config.orignalDataSource.slice(0);
			 var source = this.__config.dataSource;
		   	 var nsFilter = new NSFilter(source,filter,setting,recordLimit,isHierarchical,this.__config.childField,null,null,["__ns_nav_field_parentmenuitem"]);//this.__nsGrid.__filterFunction,this.__nsGrid.__hierarchyFilterChildrenFunction
		   	 this.__config.dataSource = nsFilter.execute();
		   	 this.__renderItems();
		   	 this.util.dispatchEvent(this.__baseComponent,NSNavigation.FILTER_CHANGED,eventParam,eventParam);
	    }
	};

	NSNavigation.prototype.__resetFiltering = function()
	{
		if(this.__config.orignalDataSource)
		{
			this.util.dispatchEvent(this.__baseComponent,NSNavigation.FILTER_CHANGING,null,null);
			this.__config.dataSource = this.__config.orignalDataSource.slice(0);
			this.__renderItems();
			this.util.dispatchEvent(this.__baseComponent,NSNavigation.FILTER_CHANGED,null,null);
			this.util.dispatchEvent(this.__baseComponent,NSNavigation.FILTER_RESETTED,null,null);
		}
	};
	
	NSNavigation.prototype.__createDynamicItem = function(item)
	{
		this.__destroyDynamicItem();
		var self = this;
		var createChild = function(item,parent,level)
		{
			var li = self.util.createElement("li",null,"nsNavDynamicMenuItem");
			if(item["cssClass"])
			{
				self.util.addStyleClass(li,item["cssClass"]);
			}
			var anchor = self.util.createElement("a",null);
			li.appendChild(anchor);
			if(item["iconBeforeHtml"])
			{
				var spanIcon = self.util.createElement("span");
				self.util.addStyleClass(spanIcon);
				spanIcon.innerHTML = item["iconBeforeHtml"];
				var icon = spanIcon.firstChild;
				anchor.appendChild(icon);
				anchor.appendChild(self.__domVar.doc.createTextNode("\u00A0"));
			}
			var spanText = self.util.createElement("span",null,"nsNavDynamicMenuText");
			spanText.appendChild(self.__domVar.doc.createTextNode(item[self.__config.titleField]));
			anchor.appendChild(spanText);
			if(item["iconAfterHtml"])
			{
				var spanIcon = self.util.createElement("span");
				spanIcon.innerHTML = item["iconAfterHtml"];
				var icon = spanIcon.firstChild;
				anchor.appendChild(icon);
			}
			var hasChildren = false;
			if(self.__hasChildren(item))
			//if(item[self.__config.childField] && item[self.__config.childField].length > 0)
			{
				anchor.setAttribute("href","javascript:void(0)");
				var spanIcon = self.util.createElement("span");
				self.util.addStyleClass(spanIcon,"nsNavNonVisibleIcon");
				spanIcon.innerHTML = self.__config.iconMenuExpanded;
				if(self.__config.iconPosition == "left")
				{
					anchor.insertBefore(spanIcon,anchor.firstChild);
				}
				else
				{
					self.util.addStyleClass(spanIcon,"nsNavContainerPullRight");
					anchor.appendChild(spanIcon);
				}
				createChildren(item[self.__config.childField],li,level + 1);
				hasChildren = true;
			}
			else
			{
				self.__setLink(anchor,item["link"]);
				self.__setExtraAttrubtesForLink(anchor,item);
			}
			self.util.addEvent(anchor,"click",self.__menuClickHandler.bind(self,item,li,hasChildren));
			if(item["disabled"])
			{
				self.util.addStyleClass(li,"nsNavigationItemDisabled");
			}
			if(parent)
			{
				parent.appendChild(li);
			}
			return {li:li,anchor:anchor,hasChildren:hasChildren};
		};
		var createChildren = function(arrItems,parent,level)
		{
			var ul = self.util.createElement("ul",null,"nsNavDynamicSubMenuCont");
			for(var count = 0;count < arrItems.length;count++)
			{
				var item  = arrItems[count];
				createChild(item,ul,level);
			}
			parent.appendChild(ul);
		};
		
		this.__dynamicContainer = this.util.createDiv(this.getID() + "DynamicContainer","nsNavDynamicContainer");
		var spanText = this.util.createElement("span",null,"nsNavDynamicMenuText");
		this.__dynamicContainer.appendChild(spanText);
		if(this.__hasChildren(item))
		{
			spanText.appendChild(this.__domVar.doc.createTextNode(item[this.__config.titleField]));
			createChildren(item[this.__config.childField],this.__dynamicContainer,1);
		}
		else
		{
			this.util.addStyleClass(spanText,"nsNavDynamicSubMenuCont");
			createChild(item,spanText,1);
		}
		this.__baseComponent.appendChild(this.__dynamicContainer);
		var topOffset = this.__getTopOffset();
		var rect = item[this.__fieldElement].getBoundingClientRect();
		this.__dynamicContainer.style.top = (rect.top + this.__config.collapseTopOffset - topOffset) + "px"; 
		this.__dynamicContainer.style.left = (rect.left + this.__navigationContainer.offsetWidth + this.__config.collapseLeftOffset) + "px";
	};
	
	NSNavigation.prototype.__destroyDynamicItem = function()
	{
		if(this.__dynamicContainer && this.__dynamicContainer.parentNode)
		{
			this.__dynamicContainer.parentNode.removeChild(this.__dynamicContainer);
			this.__dynamicContainer = null;
		}
	};
	
	NSNavigation.prototype.__handleSelectedMenu = function(item,li)
	{
		var self = this;
		var selectDeselectParent = function(menuItem,isSelect)
		{
			if(menuItem)
			{
				var parentMenuItem = menuItem[self.__fieldParentMenuItem];
				var func = isSelect ? self.util.addStyleClass : self.util.removeStyleClass;
				while (parentMenuItem)
				{
					if(parentMenuItem[self.__fieldElement])
					{
						func.bind(self.util)(parentMenuItem[self.__fieldElement],self.__config.customClass.selectedParentMenu);
					}
					parentMenuItem = parentMenuItem[self.__fieldParentMenuItem];
				}
			}
		};
		if(!li && item && item[this.__fieldElement])
		{
			li = item[this.__fieldElement];
		}
		if(this.__selectedMenu)
		{
			this.util.removeStyleClass(this.__selectedMenu,this.__config.customClass.selectedMenu);
			this.util.dispatchEvent(this.__baseComponent,NSNavigation.NAVIGATION_MENU_DESELECTED,this.__selectedMenuItem,{item:this.__selectedMenuItem,menu:this.__selectedMenu});
			selectDeselectParent(this.__selectedMenuItem,false);
			this.__selectedMenu = null;
			this.__selectedMenuItem = null;
		}
		this.util.addStyleClass(li,this.__config.customClass.selectedMenu);
		selectDeselectParent(item,true);
		this.__selectedMenu = li;
		this.__selectedMenuItem = item;
		this.util.dispatchEvent(this.__baseComponent,NSNavigation.NAVIGATION_MENU_SELECTED,item,{item:item,menu:li});
	};
	
	NSNavigation.prototype.__resetVariables = function()
	{
		this.__selectedParentMenuItem = null;
		this.__selectedMenu = null;
		this.__selectedMenuItem = null;
	};
	
	NSNavigation.prototype.__applyCustomClass = function(element,type)
	{
		if(element && type && this.__config.customClass[type])
		{
			this.util.addStyleClass(element,this.__config.customClass[type]);
		}
	};
	
	NSNavigation.prototype.__getItemByElement = function(li,source)
	{
		var arrSource = [];
		if(source)
		{
			if(this.util.isArray(source))
			{
				arrSource = source;
			}
			else
			{
				arrSource = [source];
			}
		}
		else
		{
			arrSource = this.__config.dataSource;
		}
		if(li && arrSource && arrSource.length > 0)
		{
			var item = null;
			for(var count = 0;count < arrSource.length;count++)
			{
				item = arrSource[count];
				if(item[this.__fieldElement] == li)
				{
					return item;
				}
				if(this.__hasChildren(item))
				{
					var retItem = this.__getItemByElement(li,item[this.__config.childField]);
					if(retItem)
					{
						return retItem;
					}
				}
			}
		}
		return null;
	};
	
	NSNavigation.prototype.__getItemByField = function(field,value,source)
	{
		var arrSource = [];
		if(source)
		{
			if(this.util.isArray(source))
			{
				arrSource = source;
			}
			else
			{
				arrSource = [source];
			}
		}
		else
		{
			arrSource = this.__config.dataSource;
		}
		if(arrSource && arrSource.length > 0)
		{
			var item = null;
			for(var count = 0;count < arrSource.length;count++)
			{
				item = arrSource[count];
				if(item[field] == value)
				{
					return item;
				}
				if(this.__hasChildren(item))
				{
					var retItem = this.__getItemByField(field,value,item[this.__config.childField]);
					if(retItem)
					{
						return retItem;
					}
				}
			}
		}
		return null;
	};
	
	NSNavigation.prototype.__hasChildren = function(item)
	{
		return (item[this.__config.childField] && item[this.__config.childField].length > 0);
	};
	
	NSNavigation.prototype.__setLink = function(anchor,link)
	{
		if(link)
		{
			anchor.setAttribute("href",link);
			if(this.__config["extraAttribute"])
			{
				anchor.setAttribute(this.__config["extraAttribute"],link);
			}
		}
		else 
		{
			anchor.setAttribute("href","javascript:void(0)");
		}
	};
	
	NSNavigation.prototype.__setExtraAttrubtesForLink = function(anchor,item) {
		if(item.attributes) {
			for (var prop in item.attributes) {
			    if (item.attributes.hasOwnProperty(prop)) {
			        anchor.setAttribute(prop,item.attributes[prop]);
			    }
			}
		}
	};
	
	NSNavigation.NAVIGATION_OPEN_START = "navigationOpenStart";
	NSNavigation.NAVIGATION_OPEN_END = "navigationOpenEnd";
	NSNavigation.NAVIGATION_CLOSE_START = "navigationCloseStart";
	NSNavigation.NAVIGATION_CLOSE_END = "navigationCloseEnd";
	NSNavigation.NAVIGATION_MENU_SELECTED = "navigationMenuSelected";
	NSNavigation.NAVIGATION_MENU_DESELECTED = "navigationMenuDeselected";
	NSNavigation.FILTER_CHANGING = "filterChanging";
	NSNavigation.FILTER_CHANGED = "filterChanged";
	NSNavigation.FILTER_RESETTED = "filterResetted";
	
	return NSNavigation;
})();
nsModuleExport(__nsGlobal,"NSNavigation",NSNavigation);