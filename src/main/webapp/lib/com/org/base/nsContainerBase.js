"use strict";
var nsContainerBase = Object.create(HTMLDivElement.prototype);

nsContainerBase.INITIALIZE = "initialize";
nsContainerBase.CREATION_COMPLETE = "creationComplete";
nsContainerBase.PROPERTY_CHANGE = "propertyChange";
nsContainerBase.REMOVE = "remove";
nsContainerBase.RESIZE = "resize";

/*start of private variables */
nsContainerBase.base = null;
nsContainerBase.__objPrototype = null;
nsContainerBase.__isCreationCompleted = false;
nsContainerBase.__setProperty = true; 
nsContainerBase.__id = null;
nsContainerBase.__shadow = null;
nsContainerBase.__focused = false;
nsContainerBase.__mediaQuery = null;
nsContainerBase.__arrQueries = [];
nsContainerBase.__arrQueriesTrimmed = [];
nsContainerBase.__focusHandlerRef = null;
nsContainerBase.__blurHandlerRef = null;
nsContainerBase.__resizeHandlerRef = null;
/*end of private variables */

/*start of functions */
nsContainerBase.__setBase = function() 
{
	if(this.__proto__ && this.__proto__.__proto__)
	{
		this.base = this.__proto__.__proto__;
	}
};

nsContainerBase.__setPrototype = function(objPrototype) 
{
	this.__objPrototype = objPrototype;
};

nsContainerBase.__setID = function()
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

nsContainerBase.createdCallback = function() 
{
	this.util = new NSUtil();
	this.__setBase();
	this.__setID();
	this.initializeComponent();
	if(!this.__objPrototype)
	{
		this.__focusHandlerRef = this.focusHandler.bind(this);
		this.__blurHandlerRef = this.blurHandler.bind(this);
		this.__resizeHandlerRef = this.resizeHandler.bind(this);
		this.util.addEvent(this,"focus",this.__focusHandlerRef);
		this.util.addEvent(this,"blur",this.__blurHandlerRef);
		this.util.addEvent(window,"resize",this.__resizeHandlerRef);
		this.dispatchCustomEvent(this.INITIALIZE);
	}
};

nsContainerBase.attachedCallback = function()
{
	if(!this.__objPrototype)
	{
		this.__setProperty = false;
		this.util.addStyleClass(this,"nsContainer");
		this.setComponentProperties();
		this.__addMediaQueries();
		this.dispatchCustomEvent(this.CREATION_COMPLETE);
	}
};

nsContainerBase.attributeChangedCallback = function(attrName, oldVal, newVal)
{
	if(this.__objPrototype)
	{
		this.__objPrototype.attributeChangedCallback.call(this.__objPrototype,attrName, oldVal, newVal);
	}
	else
	{
		var data = {};
		data.propertyName = attrName;
		data.oldValue = oldVal;
		data.newValue = newVal;
		this.dispatchCustomEvent(this.PROPERTY_CHANGE,data);
		this.propertyChange(attrName, oldVal, newVal, this.__setProperty);
		this.__setProperty = true;
	}
};

nsContainerBase.detachedCallback = function()
{
	if(this.__objPrototype)
	{
		this.__objPrototype.detachedCallback.call(this.__objPrototype);
	}
	else
	{
		this.dispatchCustomEvent(this.REMOVE);
		if(this.__resizeHandlerRef)
		{
			this.util.removeEvent(window,"resize",this.__resizeHandlerRef);
			this.__resizeHandlerRef = null;
		}
		this.removeComponent();
	}
};

nsContainerBase.__addMediaQueries = function(changed) 
{
	if(this.__arrQueries && this.__arrQueries.length > 0)
	{
		var query = null;
		var mediaQuery = null;
		var trimmedMediaQuery = null;
		for (var count = 0; count < this.__arrQueries.length; count++)
		{ 
			query = this.__arrQueries[count];
			trimmedMediaQuery = query.replace(/ /g, "");
			this.__arrQueriesTrimmed.push(trimmedMediaQuery);
			mediaQuery = window.matchMedia(query);
			mediaQuery.addListener(this.__mediaChangeHandler.bind(this));
			this.__mediaChangeHandler(mediaQuery);
		}
	}
};

nsContainerBase.__mediaChangeHandler = function(changed) 
{
	var conditionTrue = false;
	if(changed.matches) 
	{
		conditionTrue = true;
    } 
	var tempMedia = changed.media.replace(/ /g, "");
	var queryIndex = -1;
	var trimmedMediaQuery = null;
	var length = this.__arrQueriesTrimmed.length;
	for (var count = 0; count < length; count++)
	{ 
		trimmedMediaQuery = this.__arrQueriesTrimmed[count];
		if(conditionTrue)
		{
			console.log(tempMedia);
			console.log(trimmedMediaQuery);
			console.log(tempMedia == trimmedMediaQuery);
		}
		if(tempMedia === trimmedMediaQuery)
		{
			queryIndex = count;
			break;
		}
	}
	this.deviceViewChanged(conditionTrue,queryIndex,changed.media);
};

nsContainerBase.resizeHandler = function(event) 
{
	//this.dispatchCustomEvent(this.RESIZE);
	this.componentResized(event);
};

nsContainerBase.initializeComponent = function() 
{
};

nsContainerBase.setComponentProperties = function() 
{
	this.__isCreationCompleted = true;
};

nsContainerBase.propertyChange = function(attrName, oldVal, newVal, setProperty) 
{
};

nsContainerBase.removeComponent = function() 
{
};

nsContainerBase.componentResized = function(event) 
{
};

nsContainerBase.deviceViewChanged = function(conditionTrue,queryIndex,query) 
{
};

nsContainerBase.initializeDOM = function(requireStyleClass)
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

nsContainerBase.getID = function() 
{
	return this.__id;
};

nsContainerBase.focusHandler = function(event)
{
	this.__focused = true;
};

nsContainerBase.blurHandler = function(event)
{
	this.__focused = false;
};

nsContainerBase.addChild = function(element)
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

nsContainerBase.deleteChild = function(element)
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

nsContainerBase.getElement = function(elementId)
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

nsContainerBase.hasFocus = function()
{
    return this.__focused;
};

nsContainerBase.dispatchCustomEvent = function(eventType,data,bubbles,cancelable) 
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

document.registerElement('ns-containerbase', {prototype: nsContainerBase});