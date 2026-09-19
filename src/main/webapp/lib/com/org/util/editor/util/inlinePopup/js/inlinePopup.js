 var NSEditorInlinePopup = (function()
{
	var NSEditorInlinePopup = function(nsEditor,nsParentPluggin,setting)
	{
		this.__nsEditor = nsEditor;
		this.__nsParentPluggin = nsParentPluggin;
		this.__setting = setting;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		
		this.__divModalMask = null;
		this.__divDragMask = null;
		this.__id = null;
		this.__compOuterContainer = null;
		this.__originalValue = null;
		this.__objDrag = null;
		this.__docClickRef = null;
		
		this.__initialize = function()
		{
			this.__setSetting();
			this.__componentsInitialized();
		};
		
		this.__setSetting = function()
		{
			if(!this.__setting)
			{
				throw this.util.throwNSError("NSEditorInlinePopup","Setting for Pluggin " + this.__nsParentPluggin.name + " is not defined");
			}
			var config = this.__setting;
			if(!config.contentCallback)
			{
				throw this.util.throwNSError("NSEditorInlinePopup","ContentCallback in setting for Pluggin " + this.__nsParentPluggin.name + " is not defined");
			}
			this.__config = {
								container: config["container"] || this.__nsEditor.__getFixedComp(),
								title: config["title"] || "",
								enableArrow: this.util.isUndefinedOrNull(config["enableArrow"]) ? true : Boolean.parse(config["enableArrow"]),
								contentCallback: this.util.getFunction(config["contentCallback"])
						    };
			
		};
		
		this.__componentsInitialized = function()
		{
			this.__createComponents();
			this.__nsEditor.__listenInternalEvent("resized change changePlace readonly",this.hide.bind(this));
			this.__nsEditor.__listenInternalEvent("destroy",this.destroy.bind(this));
		};
		
		this.__createComponents = function()
		{
			this.__id = this.__nsEditor.getID() + (this.__nsParentPluggin.name ? this.__nsParentPluggin.name : "") + "EditorModal";
			this.destroy();
			this.__compOuterContainer = this.__getContainer();
			this.__config.container.appendChild(this.__compOuterContainer);
			var compArrow = this.__compOuterContainer.querySelector(".nsEditorInlinePopupArrowUp");
			//11 --> border of arrow
			compArrow.style.marginLeft = ((this.__compOuterContainer.offsetWidth / 2) - 11) + "px";
			this.__hide();
			this.util.addEvent(this.__compOuterContainer,"blur",this.__containerBlurHandler.bind(this),true);
			this.util.addEvent(this.__compOuterContainer,"click",this.editorUtil.stopEvent.bind(this.editorUtil));
		};
				
		this.show = function(element,event,offset,direction) 
		{
			this.__showAtElement(element,event,offset,direction);
			this.__nsEditor.__dispatchInternalEvent("inlinePopupShow",{inlinePopup:this});
		};
		
		this.hide = function()
		{
			if (!this.isHidden()) 
			{
				this.__hide();
				this.__nsEditor.__dispatchInternalEvent("inlinePopupHide",{inlinePopup:this});
		    }
		};
				
		this.isHidden = function()
		{
			if(!this.isDestroyed())
			{
				return this.util.hasStyleClass(this.__compOuterContainer,"nsEditorInlinePopupHide")
			}
			return true;
		};
		
		this.isDestroyed = function()
		{
			if(this.__compOuterContainer && this.__compOuterContainer.parentElement)
			{
				return false;
			}
			return true;
		};
		
		this.getHorizontalSeparator = function(id)
		{
			var div = this.util.createDiv(id,"nsEditorInlinePopupHorizontalSeparator");
			return div;
		};
		
		this.getMenuItem = function(id,cssClass,content,toolTipContent,subMenu,handler)
		{
			var button = this.__createButton(id,cssClass,content,toolTipContent);
			if(subMenu && subMenu.length > 0)
			{
				this.util.addStyleClass(button,"nsEditorInlinePopupButtonDropdown");
				var divContainer = this.util.createDiv(null,"nsEditorInlinePopupButtonDropdownContainer");
				divContainer.appendChild(button);
				var divDropdownCon = this.util.createDiv(null,"nsEditorInlinePopupDropdownContainer");
				var compDropdown = this.util.createElement("ul",null,"nsEditorInlinePopupButtonDropdown");
				for(var count = 0;count < subMenu.length;count++)
				{
					var li = subMenu[count];
					compDropdown.appendChild(li);
				}
				divDropdownCon.appendChild(compDropdown);
				divContainer.appendChild(divDropdownCon);
				this.util.addEvent(button,"click",this.__btnHandlerWithSubMenu.bind(this,button,divContainer,divDropdownCon,handler));
				return divContainer;
			}
			else
			{
				this.util.addEvent(button,"click",this.__btnHandler.bind(this,button,handler));
			}
			return button;
		};
		
		this.getSubMenuItem = function(id,cssClass,content,toolTipContent,handler)
		{
			var li = this.util.createElement("li",id,"nsEditorInlinePopupButtonDropdownItem");
			if(cssClass)
			{
				this.util.addStyleClass(li,cssClass);
			}
			var anchor = this.util.createElement("a",null,"nsEditorInlinePopupButtonDropdownItemContent");
			this.__setAttribute(anchor,{tabindex: "-1", role: "option"});
			if(content)
			{
				this.__addCompInParent(anchor,content)
			}
			if(toolTipContent)
			{
				var toolTip = this.__createTooltip(toolTipContent);
				//anchor.appendChild(toolTip);
			}
			li.appendChild(anchor);
			this.util.addEvent(li,"click",this.__btnSubMenuHandler.bind(this,li,handler));
			return li;
		};
		
		this.destroy = function()
		{
			if(this.__compOuterContainer && this.__compOuterContainer.parentElement)
			{
				this.__compOuterContainer.parentElement.removeChild(this.__compOuterContainer);
				this.__compOuterContainer = null;
			}
		};
		
		this.__createButton = function(id,cssClass,content,toolTipContent)
		{
			var button = this.util.createElement("button",id,"nsEditorInlinePopupButton");
			var objAttribute = {type: "button",tabindex: "-1",role:"button","data-title": (toolTip ? toolTip : "")};
			this.__setAttribute(button,objAttribute);
			if(cssClass)
			{
				this.util.addStyleClass(button,cssClass);
			}
			if(content)
			{
				this.__addCompInParent(button,content)
			}
			if(toolTipContent)
			{
				var toolTip = this.__createTooltip(toolTipContent);
				button.appendChild(toolTip);
			}
			return button;
		};
		
		this.__createTooltip = function(toolTipContent)
		{
			var toolTip = this.util.createElement("span",null,"nsEditorInlinePopupButtonTooltip");
			var toolTipText = this.util.createElement("span",null,"nsEditorInlinePopupButtonTooltipText");
			toolTipText.innerHTML = toolTipContent;
			toolTip.appendChild(toolTipText);
			
			return toolTip;
		};
		
		this.__btnHandler = function(button,handler,event)
		{
			event = this.util.getEvent(event);
			this.__commonBtnHandler(button,event);
			handler && handler(event,button);
			this.hide();
		};
		
		this.__btnHandlerWithSubMenu = function(button,container,dropdownContainer,handler,event)
		{
			event = this.util.getEvent(event);
			var self = this;
			this.__commonBtnHandler(button,event,function(btn){
				if(btn != button)
				{
					//var con = btn.parentElement;
					self.util.removeStyleClass(btn,"nsEditorInlinePopupButtonOpen");
				}
			});
			var isDropdownOpen = this.util.hasStyleClass(dropdownContainer,"nsEditorInlinePopupDropdownContainerVisible");
			if(isDropdownOpen)
			{
				this.util.removeStyleClass(button,"nsEditorInlinePopupButtonOpen");
				this.util.removeStyleClass(dropdownContainer,"nsEditorInlinePopupDropdownContainerVisible");
			}
			else
			{
				this.__resetMenuButtons(true);
				this.__resetSubMenuButtons();
				this.util.addStyleClass(button,"nsEditorInlinePopupButtonOpen");
				this.util.addStyleClass(dropdownContainer,"nsEditorInlinePopupDropdownContainerVisible");
			}
			handler && handler(event,button);
		};
		
		this.__btnSubMenuHandler = function(button,handler,event)
		{
			event = this.util.getEvent(event);
			this.__commonBtnHandler(button,event);
			this.hide();
			handler && handler(event,button);
		};
		
		this.__commonBtnHandler = function(button,event,callback)
		{
			var arrButton = this.__compOuterContainer.querySelectorAll(".nsEditorInlinePopupButton");
			for(var count = 0;count < arrButton.length;count++)
			{
				this.util.removeStyleClass(arrButton[count],"nsEditorInlinePopupButtonActive");
				callback && callback(arrButton[count]);
			}
			this.util.addStyleClass(button,"nsEditorInlinePopupButtonActive");
			this.editorUtil.stopEvent(event);
		};
		
		this.__containerBlurHandler = function(event)
		{
			event = this.util.getEvent(event);
			var target = event.target;
			if(!this.__compOuterContainer.contains(target))
			{
				this.editorUtil.stopEvent();
				this.hide();
			}
		};
		
		this.__setAttribute = function(element,item)
		{
			for(var key in item)
			{
				element.setAttribute(key,item[key].toString());
			}
		};
		
		this.__getContainer = function()
		{
			var html = "<div id=\"##id##InlinePopUpOuterContainer\" class=\"nsEditorInlinePopup nsEditorInlinePopupFor##name##\">\r\n" + 
"							" + (this.__config.enableArrow ? "<div id=\"##id##InlinePopUpArrow\" class=\"nsEditorInlinePopupArrow nsEditorInlinePopupArrowUp\"></div>" : "") + "\r\n" +
"							<div id=\"##id##InlinePopUpContentContainer\" class=\"nsEditorInlinePopupContentContainer\"></div> \r\n" +
"						</div>";
			html = html.replaceAll("##id##",this.__id);
			html = html.replaceAll("##name##",(this.__nsParentPluggin.name ? this.__nsParentPluggin.name : ""));
			var compOuterContainer = this.util.getElementFromHtml(html);
			compOuterContainer.setAttribute("tabindex","-1");
			var compContent = compOuterContainer.querySelector(".nsEditorInlinePopupContentContainer");
			var content = this.__config.contentCallback(compContent,this,this.__nsParentPluggin);
			this.__addCompInParent(compContent,content);
			return compOuterContainer;
		};
		
		this.__addCompInParent = function(parent,content)
		{
			if(content)
			{
				if(this.util.isString(content))
				{
					parent.innerHTML = content;
				}
				else
				{
					parent.appendChild(content);
				}
			}
		};
		
		this.__hide = function()
		{
			if (!this.isHidden()) 
			{
				if(this.__docClickRef)
				{
					this.util.removeEvent(this.__nsEditor.__dom.doc,"click",this.__docClickRef);
					this.__docClickRef = null;
				}
				this.__resetMenuButtons();
				this.__resetSubMenuButtons();
				this.util.addStyleClass(this.__compOuterContainer,"nsEditorInlinePopupHide");
			}
		};
		
		this.__showAtElement = function(element,event,offset,direction) 
		{
			this.util.removeStyleClass(this.__compOuterContainer,"nsEditorInlinePopupHide");
			var win = this.__nsEditor.__dom.win;
			var doc = this.__nsEditor.__dom.doc;
			var compTextArea = this.__nsEditor.__compTextArea;
			var self = this;
			var offsetFunc = function(el) 
			{
			    var rect = el.getBoundingClientRect();
			    var scrollLeft = win.pageXOffset || doc.documentElement.scrollLeft;
			    var scrollTop = win.pageYOffset || doc.documentElement.scrollTop;
			    var textAreaRect = {left: 0,top: 0};
			    if(!self.__nsEditor.__isModeTextArea())
			    {
			    	textAreaRect = compTextArea.getBoundingClientRect();
			    }
			    //return { top: rect.top + scrollTop + textAreaRect.top, left: rect.left + scrollLeft  + textAreaRect.left};
			    //looks like rect is including scroll position
			    var width = self.__compOuterContainer.offsetWidth;
			    //11 is top of arrow
			    return { top: rect.top + textAreaRect.top + (11/2) , left: (rect.left + textAreaRect.left - (width/4))};
			}
			direction = direction ? direction : "bottom";
			offset = offset ? offset : {left: 0,top: 0};
			offset.left = offset.left ? offset.left : 0;
			offset.top = offset.top ? offset.top : 0;
			//var eventOffset = this.util.getEventPosition(event);
			var eventOffset = offsetFunc(element);
			this.__compOuterContainer.style.left = (eventOffset.left + offset.left) + "px";
			this.__compOuterContainer.style.top = (eventOffset.top + offset.top + element.offsetHeight) + "px";
			if(!this.__docClickRef)
			{
				this.__docClickRef = this.__documentClickHandler.bind(this);
				this.util.addEvent(this.__nsEditor.__dom.doc,"click",this.__docClickRef);
			}
			/*var self = this;
			setTimeout(function() {
				self.util.removeStyleClass(self.__compOuterContainer,"nsEditorInlinePopupHide");
			}, 50);*/
			//this.__compOuterContainer.focus();
			//this.editorUtil.setElementPosition(this.__compOuterContainer,element,direction);
	    };
	    
	    this.__documentClickHandler = function(event)
	    {
	    	this.hide();
	    };
	    
	    this.__resetMenuButtons = function(excludeActive)
		{
	    	this.__resetBtn("nsEditorInlinePopupButtonOpen");
	    	!excludeActive && this.__resetBtn("nsEditorInlinePopupButtonActive");
		};
		
		this.__resetSubMenuButtons = function()
		{
			this.__resetBtn("nsEditorInlinePopupDropdownContainerVisible");
		};
		
		this.__resetBtn = function(cssClass)
		{
			var arrBtn = this.__compOuterContainer.querySelectorAll("." + cssClass);
			for(var count = 0;count < arrBtn.length;count++)
			{
				this.util.removeStyleClass(arrBtn[count],cssClass);
			}
		};
		
		this.__initialize();
	};
	
	NSEditor.prototype.registerUtil("inlinePopup",NSEditorInlinePopup);
	
	return NSEditorInlinePopup;
})();
nsModuleExport(__nsGlobal,"NSEditorInlinePopup",NSEditorInlinePopup);