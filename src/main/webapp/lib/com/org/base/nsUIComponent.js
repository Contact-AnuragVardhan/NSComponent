var nsUIComponent = Object.create(HTMLDivElement.prototype);

nsUIComponent.INITIALIZE = "initialize";
nsUIComponent.CREATION_COMPLETE = "creationComplete";
nsUIComponent.PROPERTY_CHANGE = "propertyChange";
nsUIComponent.REMOVE = "remove";

/*start of private variables */
nsUIComponent.base = null;
nsUIComponent.util = null;
nsUIComponent.nsTip = null;
nsUIComponent.__setProperty = true; 
nsUIComponent.__isCreationCompleted = false;
nsUIComponent.__isAttachedCallbackComplete = false;
nsUIComponent.__id = null;
nsUIComponent.__shadow = null;
nsUIComponent.__coreElement = null;
nsUIComponent.__resizeHandlerRef = null;
nsUIComponent.__scrollHandlerRef = null;
nsUIComponent.__autoApplyChanges = true;
nsUIComponent.__applyTipToCoreComp = false;
nsUIComponent.__showCustomValidation = false;
/*end of private variables */

/*start of functions */
nsUIComponent.__setBase = function() 
{
	if(this.__proto__ && this.__proto__.__proto__)
	{
		this.base = this.__proto__.__proto__;
	}
};

nsUIComponent.__setID = function()
{
	if(this.hasAttribute("id"))
	{
		this.__id = this.getAttribute("id");
	}
	else if(this.hasAttribute("name"))
	{
		this.__id = this.getAttribute("name");
	}
	else
	{
		this.__id = "comp" + this.util.getUniqueId();
	}
};

nsUIComponent.createdCallback = function() 
{
	this.util = new NSUtil();
	this.__setBase();
	this.__setID();
	this.initializeComponent();
	this.__resizeHandlerRef = this.resizeHandler.bind(this);
	this.__scrollHandlerRef = this.resizeHandler.bind(this);
	this.util.addEvent(window,"resize",this.__resizeHandlerRef);
	this.util.addEvent(window,"scroll",this.__scrollHandlerRef);
	this.dispatchCustomEvent(this.INITIALIZE);
};
nsUIComponent.attachedCallback = function()
{
	//set __autoApplyChanges = false to stop attachedCallback making chnages and these changes can then be applied by calling applyChanges()
	if(this.__autoApplyChanges)
	{
		this.__isAttachedCallbackComplete = false;
		this.__setProperty = false;
		this.util.addStyleClass(this,"nsContainer");
		this.setComponentProperties();
		this.checkForToolTip();
		if(this.__coreElement)
		{
			if(this.hasAttribute("class")) 
			{
				this.setCoreComponentProperty("class");
			}
			if(this.hasAttribute("enabled"))
			{
				this.setCoreComponentProperty("enabled");
			}
			this.util.addEvent(this.__coreElement,"invalid",this.__invalidEventHandler.bind(this));
		}
		if(this.hasAttribute("showCustomValidation")) 
		{
			this.__showCustomValidation = Boolean.parse(this.getAttribute("showCustomValidation"));
		}
		this.dispatchCustomEvent(this.CREATION_COMPLETE);
		this.__isAttachedCallbackComplete = true;
	}
};
nsUIComponent.attributeChangedCallback = function(attrName, oldVal, newVal)
{
	//below condition is to stop this method from getting fired when any property change in attachedCallback triggers this method
	if(this.__isAttachedCallbackComplete)
	{
		var data = {};
		data.propertyName = attrName;
		data.oldValue = oldVal;
		data.newValue = newVal;
		this.dispatchCustomEvent(this.PROPERTY_CHANGE,data);
		var attributeName = attrName.toLowerCase();
		this.setCoreComponentProperty(attributeName);
		if(!this.nsTip)
		{
			if(attributeName === "tooltip" || attributeName === "nspintip")
			{
				this.checkForToolTip();
			}
			if(attributeName === "tooltiptype")
			{
				this.checkForToolTip();
			}
		}
		//call child handler if parent is not handling it
		this.propertyChange(attrName, oldVal, newVal, this.__setProperty);
		this.__setProperty = true;
	}
};
nsUIComponent.detachedCallback = function()
{
	this.dispatchCustomEvent(this.REMOVE);
	if(this.__resizeHandlerRef)
	{
		this.util.removeEvent(window,"resize",this.__resizeHandlerRef);
		this.__resizeHandlerRef = null;
	}
	if(this.__scrollHandlerRef)
	{
		this.util.removeEvent(window,"scroll",this.__scrollHandlerRef);
		this.__scrollHandlerRef = null;
	}
	if(this.nsTip)
	{
		this.nsTip.destroyObject();
		this.nsTip = null;
	}
	this.removeComponent();
};
nsUIComponent.resizeHandler = function(event) 
{
	//this.dispatchCustomEvent(this.RESIZE);
	this.componentResized(event);
};
nsUIComponent.__invalidEventHandler = function(event)
{
	if(this.__showCustomValidation)
	{
		event = this.util.getEvent(event);
		event.preventDefault();
		var param = {position:"right",showOnMouseHover:false,text:this.__coreElement.validationMessage,style:"background-color: #e13c37",animation:true};
		var component = this;
		if(this.__applyTipToCoreComp)
		{
			component = this.__coreElement;
		}
		if(!this.nsTip)
		{
			this.nsTip = new NSPinTip(component,param);
		}
		if(this.nsTip && !this.nsTip.isVisible())
		{
			this.nsTip.show(this.__coreElement.validationMessage);
		}
	}
};

nsUIComponent.initializeComponent = function() 
{
};

nsUIComponent.setComponentProperties = function() 
{
	this.__isCreationCompleted = true;
};

nsUIComponent.propertyChange = function(attrName, oldVal, newVal, setProperty) 
{
};

nsUIComponent.removeComponent = function() 
{
};

nsUIComponent.componentResized = function(event) 
{
};

nsUIComponent.initializeDOM = function(requireStyleClass)
{
	if(document.head.createShadowRoot) 
	{
	    if(!this.__shadow)
	    {
	    	this.__shadow = this.createShadowRoot();
	    }
	    if(requireStyleClass)
	    {
	    	var shadow = this.__shadow;
	    	new this.util.ajax(ns.__dicPath["nsComponent.css"], function (response) {
	    		if(response)
	    		{
	    			var sheet = document.createElement("style");
			    	sheet.innerHTML = response;
			    	shadow.appendChild(sheet);
	    		}
		    });
	    	new this.util.ajax(requireStyleClass, function (response) {
	    		if(response)
	    		{
	    			var sheet = document.createElement("style");
			    	sheet.innerHTML = response;
			    	shadow.appendChild(sheet);
	    		}
		    });
	    	
	    }
	}
};

nsUIComponent.setCoreComponentProperty = function(attributeName)
{
	if(this.__coreElement)
	{
		if(attributeName === "class")
		{
			var className = this.getAttribute("class");
			this.util.removeStyleClass(this,className);
			this.util.addStyleClass(this.__coreElement,className);
		}
		else if(attributeName === "enabled")
		{
			this.__coreElement.setAttribute("disabled",!Boolean.parse(this.getAttribute("enabled"))) ;
		}
	}
};

nsUIComponent.getID = function() 
{
	return this.__id;
};

nsUIComponent.addChild = function(element)
{
	if(element)
	{
	    if(this.__shadow)
	    {
	    	 this.__shadow.appendChild(element);
	    }
		else 
		{
		    this.appendChild(element);
		}
	}
};

nsUIComponent.deleteChild = function(element)
{
	if(element)
	{
	    if(this.__shadow)
	    {
	    	 this.__shadow.removeChild(element);
	    }
		else 
		{
		    this.removeChild(element);
		}
	}
};

nsUIComponent.getElement = function(elementId)
{
	if(this.__shadow) 
	{
		if(elementId && elementId.length > 0)
		{
			return this.__shadow.getElementById(elementId);
		}
	} 
    return this.util.getElement(elementId);
};

nsUIComponent.applyChanges = function()
{
	var origValue = this.__autoApplyChanges;
	this.__autoApplyChanges = true;
	this.attachedCallback();
	this.__autoApplyChanges = origValue;
};

nsUIComponent.checkForToolTip = function() 
{
	if(this.hasAttribute("nsPinTip"))
	{
		//this.__coreElement.setAttribute("nsPinTip",this.getAttribute("nsPinTip"));
		var position = null;
		if(this.hasAttribute("nsPinTipPos"))
		{
			position = this.getAttribute("nsPinTipPos");
		}
		if(!this.nsTip)
		{
			var param = {position:position,showOnMouseHover:true,text:this.getAttribute("nsPinTip")};
			var component = this;
			if(this.__applyTipToCoreComp)
			{
				component = this.__coreElement;
			}
			this.nsTip = new NSPinTip(component,param);
		}
	}
	else
	{
		if(this.hasAttribute("toolTip"))
		{
			var message = this.getAttribute("toolTip");
			var type = "";
			if(this.hasAttribute("toolTipType"))
			{
				type = this.getAttribute("toolTipType");
			}
			this.addToolTip(type,message);
		}
		else
		{
			this.removeToolTip();
		}
	}
};

nsUIComponent.addToolTip = function(type,message) 
{
	this.removeToolTip();
	this.util.addStyleClass(this,"nsTooltip");
	var title = "";
	var toolTipClass = "nsTooltipClassic";
	switch(type)
	{
		case "critical":
			title = "Critical";
			toolTipClass = "nsTooltipCritical";
		break;
		case "help":
			title = "Help";
			toolTipClass = "nsTooltipHelp";
		break;
		case "info":
			title = "Information";
			toolTipClass = "nsTooltipInfo";
		break;
		case "warning":
			title = "Warning";
			toolTipClass = "nsTooltipWarning";
		break;
	}
	var toolTip = document.createElement("SPAN");
	toolTip.setAttribute("id",this.getID() + "#toolTip");
	if(title && title != "")
	{
		compTitle = document.createElement("em");
		compTitle.appendChild(document.createTextNode(title));
		toolTip.appendChild(compTitle);
		this.util.addStyleClass(toolTip,"nsTooltipCustom");
	}
	this.util.addStyleClass(toolTip,toolTipClass);
	var toolTipText = document.createTextNode(message);
	toolTip.appendChild(toolTipText);
	this.appendChild(toolTip);
};

nsUIComponent.removeToolTip = function()
{
	var toolTip = document.getElementById(this.getID() + "#toolTip");
	if(toolTip)
	{
		this.removeChild(toolTip);
		this.util.removeStyleClass(this,"nsTooltip");
	}
};

nsUIComponent.dispatchCustomEvent = function(eventType,data,bubbles,cancelable) 
{
	if(this.util.isUndefined(data))
	{
		data = null;
	}
	if(typeof bubbles == "undefined")
	{
		bubbles = true;
	}
	if(typeof cancelable == "undefined")
	{
		cancelable = true;
	}
	var event = new CustomEvent(eventType, 
	{
		detail: data,
		bubbles: bubbles,
		cancelable: cancelable
	});
	if (this.hasAttribute(eventType)) 
	{
		var attributeValue = this.getAttribute(eventType);
		if(attributeValue)
		{
			this.util.callFunctionFromString(attributeValue,function(paramValue){
				if(paramValue === 'true' || paramValue === 'false')
				{
					return Boolean.parse(paramValue);
				}
				else if(paramValue === 'this')
				{
					return this;
				}
				else if(paramValue === 'event')
				{
					return event;
				}
				return paramValue;
			});
		}
	}
	this.dispatchEvent(event);
};
/*end of functions */

document.registerElement('ns-uicomponent', {prototype: nsUIComponent});