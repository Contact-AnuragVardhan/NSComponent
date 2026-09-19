"use strict";

function NSScroller(setting)
{	
	this.__setting = setting;
	
	this.util = new NSUtil();	
	
	this.__config = null;
    this.__id = null;
    this.__lastPos = {mouseY:0,scrollFactor:0,scrollPosition:0,to:0,move:0,isMouseDown:false,ratio:0};
    
    this.__parentContainer = null;
    this.__divScrollPane = null;
    this.__divScrollBar = null;
    this.__divScrollUpArrow = null;
    this.__divScrollDownArrow = null;
    
    this.__documentMouseUpRef = null;
    this.__windowResizeRef = null;
    this.__documentMouseMoveRef = null;
    this.__scrollBarWidth = 0;
    
    this.__initialize();
};

NSScroller.prototype.__initialize = function()
{
	if(this.__setting)
	{
		this.__config = 
		{
			component: this.__setting["component"] || null
		};
		if(this.__config.component)
		{
			this.__scrollBarWidth = this.util.getScrollBarWidth();
			this.__createElements(); 
			this.__addEvents();
			this.__scrollHandler();
		    this.__refresh();
		}
	}
};

NSScroller.prototype.__createElements = function()
{
	this.__parentContainer = this.__createParent();
	var id = this.__getID();
	this.__divScrollPane = this.util.createDiv(id + "scrollPane","ssb_st");
	this.__parentContainer.appendChild(this.__divScrollPane);
	this.__divScrollBar = this.util.createDiv(id + "scrollBar","ssb_sb");
	this.__parentContainer.appendChild(this.__divScrollBar);
	this.__divScrollUpArrow = this.util.createDiv(id + "scrollUpArrow","ssb_up");
	this.__parentContainer.appendChild(this.__divScrollUpArrow);
	this.__divScrollDownArrow = this.util.createDiv(id + "scrollDownArrow","ssb_down");
	this.__parentContainer.appendChild(this.__divScrollDownArrow);
};

NSScroller.prototype.__createParent = function()
{
	var container = this.__config.component;
	var parent = container.cloneNode(false);
	parent.setAttribute("id",this.__getID() + "parent");
	parent.style.cssText = container.style.cssText;//document.defaultView.getComputedStyle(parent, "").cssText;
	parent.style.overflow = "hidden";
	container.parentNode.appendChild(parent);
	parent.appendChild(container);
    container.style.position = "absolute";
    container.style.left = container.style.top = "0px";
    container.style.width = container.style.height = "100%";
    
    return parent;
};

NSScroller.prototype.__addEvents = function() 
{
	this.__documentMouseUpRef = this.__documentMouseUpHandler.bind(this);
    this.__documentMouseMoveRef = this.__documentMouseMoveHandler.bind(this);
    this.__windowResizeRef = this.__windowResizeHandler.bind(this);
    
    this.util.addEvent(document,"mouseup",this.__documentMouseUpRef);
    this.util.addEvent(document,"mousemove", this.__documentMouseMoveRef);
	this.util.addEvent(window,"resize",this.__windowResizeRef);
	
	this.util.addEvent(this.__config.component,"scroll",this.__scrollHandler.bind(this));
	this.util.addEvent(this.__divScrollBar,"mousedown",this.__scrollBarMouseDownHandler.bind(this));
	this.util.addEvent(this.__divScrollBar,"mouseover",this.__scrollBarMouseOverHandler.bind(this));
	this.util.addEvent(this.__divScrollBar,"mouseout",this.__scrollBarMouseOutHandler.bind(this));
	this.util.addEvent(this.__divScrollPane,"mousedown",this.__scrollPaneMouseDownHandler.bind(this));
	this.util.addEvent(this.__divScrollUpArrow,"mousedown",this.__scrollUpArrowMouseDownHandler.bind(this));
	this.util.addEvent(this.__divScrollUpArrow,"dblclick",this.__scrollUpArrowMouseDownHandler.bind(this));
	this.util.addEvent(this.__divScrollDownArrow,"mousedown",this.__scrollDownArrowMouseDownHandler.bind(this));
	this.util.addEvent(this.__divScrollDownArrow,"dblclick",this.__scrollDownArrowMouseDownHandler.bind(this));
	
};

NSScroller.prototype.__scrollBarMouseDownHandler = function(event) 
{
	event = this.util.getEvent(event);
	this.__lastPos.screenY = event.screenY;
	this.__lastPos.scrollTop = this.__config.component.scrollTop;
	this.__lastPos.isMouseDown = true;
	this.util.addStyleClass(this.__divScrollBar,"ssb_sb_over");
	
	this.util.preventDefault(event);
};

NSScroller.prototype.__scrollBarMouseOverHandler = function(event) 
{
	if (!this.__lastPos.isMouseDown) 
	{
		this.util.addStyleClass(this.__divScrollBar,"ssb_sb_over");
	}
	this.util.preventDefault(event);
};

NSScroller.prototype.__scrollBarMouseOutHandler = function(event) 
{
	if (!this.__lastPos.isMouseDown) 
	{
		this.util.removeStyleClass(this.__divScrollBar,"ssb_sb_over");
	}
	this.util.preventDefault(event);
};

NSScroller.prototype.__scrollPaneMouseDownHandler = function(event) 
{
	event = this.util.getEvent(event);
	this.__lastPos.mouseY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	var totalOffsetTop = 0;
	var tempParent = this.__config.component;
	while (tempParent)
	{
		totalOffsetTop += tempParent.offsetTop;
		tempParent = tempParent.offsetParent;
	}
	this.__config.component.scrollTop = (this.__lastPos.mouseY - totalOffsetTop - (this.__lastPos.ratio * this.__config.component.offsetHeight / 2) - this.__scrollBarWidth) / this.__lastPos.ratio;
    this.__scrollBarMouseDownHandler.bind(this)(event);
};

NSScroller.prototype.__scrollUpArrowMouseDownHandler = function(event) 
{
	this.__scrollOnMouseDown(this.__divScrollUpArrow,-1);
	this.util.preventDefault(event);
};

NSScroller.prototype.__scrollDownArrowMouseDownHandler = function(event) 
{
	this.__scrollOnMouseDown(this.__divScrollDownArrow,1);
	this.util.preventDefault(event);
};

NSScroller.prototype.__documentMouseUpHandler = function(event) 
{
	var target = this.util.getTarget(event);
	var component = this.__config.component;
    if(document.releaseCapture) 
	{
    	component.releaseCapture();
	}
    if (component)
	{
		if(target.className.indexOf("scrollbar") > 0)
		{
			this.util.addStyleClass(this.__divScrollBar,"ssb_sb_over");
		}
		else
		{
			this.util.removeStyleClass(this.__divScrollBar,"ssb_sb_over");
			//scrollPrototype.parent.scrollTop = scrollPrototype.top;
		}
	}
    document.onselectstart = '';
    this.__reset();
    this.__lastPos.isMouseDown = false;
};

NSScroller.prototype.__documentMouseMoveHandler = function(event) 
{
	event = this.util.getEvent(event);
	this.__lastPos.mouseY = event.screenY;
    if(this.__lastPos.isMouseDown)
	{
    	var component = this.__config.component;
    	this.__lastPos.top = this.__lastPos.scrollTop + (this.__lastPos.mouseY - this.__lastPos.screenY) / this.__lastPos.ratio;
		var maxValue = component.scrollHeight - ((3 * this.__divScrollBar.offsetHeight) + (2 * this.__divScrollDownArrow.offsetHeight));
		if(this.__lastPos.top >=0 && this.__lastPos.top <= maxValue)
		{
			component.scrollTop = this.__lastPos.top;
			this.__lastPos.ratio = (component.offsetHeight - 2 * this.__scrollBarWidth) / component.scrollHeight;
			//this.__divScrollBar.style.top = Math.floor(this.__scrollBarWidth + this.__lastPos.top  * this.__lastPos.ratio) + "px";
		}
	}
};

NSScroller.prototype.__windowResizeHandler = function(event) 
{
	this.__updateElements.bind(this)();
};

NSScroller.prototype.__scrollOnMouseDown = function(target,scrollFactor) 
{
    if (this.__lastPos.scrollFactor == 0) 
    {
    	this.util.addStyleClass(this.__divScrollBar,"ssb_sb_over");
    	this.__lastPos.scrollFactor = scrollFactor;
    	this.__lastPos.scrollPosition = 400;
        this.__arrowScrollHandler.bind(this)();
    }
};

NSScroller.prototype.__arrowScrollHandler = function()
{
    if (this.__lastPos.scrollFactor!= 0) 
    {
    	this.__config.component.scrollTop += 6 * this.__lastPos.scrollFactor / this.__lastPos.ratio;
    	this.__lastPos.to = setTimeout(this.__arrowScrollHandler.bind(this),this.__lastPos.scrollPosition);
    	this.__lastPos.scrollPosition = 32;
    }
};

NSScroller.prototype.__scrollHandler = function(event)
{
	var component = this.__config.component;
	this.__lastPos.ratio = (component.offsetHeight - 2 * this.__scrollBarWidth) / component.scrollHeight;
	//if(!event)
	//{
	//this.scrollTop
		this.__divScrollBar.style.top = Math.floor(this.__scrollBarWidth + component.scrollTop  * this.__lastPos.ratio) + "px";
	//}
};

NSScroller.prototype.__reset = function() 
{
    clearTimeout(this.__lastPos.to);
    this.__lastPos.scrollFactor = 0;
    return false;
};

NSScroller.prototype.__refresh = function () 
{
	this.__scrollHandler();
	var component = this.__config.component;
	this.__divScrollBar.style.width = this.__divScrollPane.style.width = this.__divScrollUpArrow.style.width = this.__divScrollUpArrow.style.height = this.__divScrollDownArrow.style.width = this.__divScrollDownArrow.style.height = this.__scrollBarWidth + "px";
	this.__divScrollBar.style.height = Math.ceil(Math.max(this.__scrollBarWidth * .5, this.__lastPos.ratio * component.offsetHeight) + 1) + 'px';
}

/*********************************Start of Util Function*******************************/
NSScroller.prototype.__getID = function()
{
	if(!this.__id)
	{
		if(this.__config.component.hasAttribute("id"))
		{
			this.__id = this.__config.component.getAttribute("id");
		}
		else if(this.__config.component.hasAttribute("name"))
		{
			this.__id = this.__config.component.getAttribute("name");
		}
		else
		{
			this.__id = "comp" + this.util.getUniqueId();
		}
	}
	return this.__id;
};
/*********************************End of Util Function*******************************/