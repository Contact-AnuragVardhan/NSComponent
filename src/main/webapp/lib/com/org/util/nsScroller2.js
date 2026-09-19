
"use strict";

function NSScroller2(setting)
{	
	this.__setting = setting;
	
	this.util = new NSUtil();	
	
	this.__config = null;
    this.__id = null;
    
    this.__divParentContainer = null;
    this.__divContentContainer = null;
    
    this.__divHorizontalScrollContainer = null;
    this.__divHorizontalLeftArrow = null;
    this.__divHorizontalScrollPane = null;
    this.__divHorizontalScrollBar = null;
    this.__divHorizontalRightArrow = null;
    
    this.__divVerticalScrollContainer = null;
    this.__divVerticalUpArrow = null;
    this.__divVerticalScrollPane = null;
    this.__divVerticalScrollBar = null;
    this.__divVerticalDownArrow = null;
    
    this.__divScrollBarCorner = null;
    
    this.__scrollBarWidth = 0;
    this.__componentDimension = {outerWidth:0,outerHeight:0};
    this.__orignalContentScroll = {scrollLeft:0,scrollTop:0};
    this.__objHorizontalScroll = {};
    this.__objVerticalScroll = {};
    this.__draggedScrollBar = null;
    this.__isHorizontal = false;
    this.__isScrolling = false;
    this.__animationInterval = null;
	this.__scrollTriggerInterval = null;
    
    this.__documentMouseUpRef = null;
    this.__windowResizeRef = null;
    this.__documentMouseMoveRef = null;
    
    
    this.__initialize();
};

NSScroller2.prototype.__initialize = function()
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
			this.__scroll(true);
			this.__scroll(false);
		}
	}
};

NSScroller2.prototype.__createElements = function()
{
	this.__createParents();
	this.__componentDimension = {outerWidth:this.util.getOuterWidth(this.__config.component),outerHeight:this.util.getOuterHeight(this.__config.component)};
	this.__orignalContentScroll = {scrollLeft:this.__divContentContainer.scrollLeft,scrollTop:this.__divContentContainer.scrollTop};
	var isHorizontalScrollBarNeeded = this.__isHorizontalScrollBarNeeded();
	var isVerticalScrollBarNeeded = this.__isVerticalScrollBarNeeded();
	if(isHorizontalScrollBarNeeded)
	{
		this.__createHorizontalScrollBar();
	}
	if(isVerticalScrollBarNeeded)
	{
		this.__createVerticalScrollBar();
	}
	if(isHorizontalScrollBarNeeded && isVerticalScrollBarNeeded)
	{
		this.__createCornerElement();
	}
	if(isHorizontalScrollBarNeeded)
	{
		this.__calculateHorizontalDimension();
	}
	if(isVerticalScrollBarNeeded)
	{
		this.__calculateVerticalDimension();
	}
};

NSScroller2.prototype.__createParents = function()
{
	var id = this.__getID();
	this.__divParentContainer = this.util.createDiv(id + "ScrollParentContainer","nsScrollParentContainer");
	this.__divContentContainer = this.util.createDiv(id + "ScrollContentContainer","nsScrollContentContainer");
	var component = this.__config.component;
	this.__divParentContainer.style.cssText = component.style.cssText;
	var rectComponent= component.getBoundingClientRect();
	this.__divParentContainer.style.width = rectComponent.width + "px";
	this.__divParentContainer.style.height = rectComponent.height + "px";
	component.parentNode.appendChild(this.__divParentContainer);
	//component.style.width = "100%"; 
	//component.style.height = "100%";
	this.__divParentContainer.appendChild(this.__divContentContainer);
	this.__divContentContainer.appendChild(component);
};

NSScroller2.prototype.__createHorizontalScrollBar = function()
{
	var id = this.__getID();
	this.__divHorizontalScrollContainer = this.util.createDiv(id + "HorizontalScrollContainer","nsScrollHorizontalScrollContainer");
	this.__divHorizontalLeftArrow = this.util.createDiv(id + "HorizontalLeftArrow","nsScrollHorizontalLeftArrow");
	this.__divHorizontalScrollPane = this.util.createDiv(id + "HorizontalScrollPane","nsScrollHorizontalScrollPane");
	this.__divHorizontalScrollBar = this.util.createDiv(id + "HorizontalScrollBar","nsScrollHorizontalScrollBar");
	this.__divHorizontalRightArrow = this.util.createDiv(id + "HorizontalRightArrow","nsScrollHorizontalRightArrow");
	
	this.__divParentContainer.appendChild(this.__divHorizontalScrollContainer);
	this.__divHorizontalScrollContainer.appendChild(this.__divHorizontalLeftArrow);
	this.__divHorizontalScrollContainer.appendChild(this.__divHorizontalScrollPane);
	this.__divHorizontalScrollPane.appendChild(this.__divHorizontalScrollBar);
	this.__divHorizontalScrollContainer.appendChild(this.__divHorizontalRightArrow);
	
	this.__divContentContainer.style.paddingBottom = this.__scrollBarWidth + "px";
};

NSScroller2.prototype.__createVerticalScrollBar = function()
{
	var id = this.__getID();
	
	this.__divVerticalScrollContainer = this.util.createDiv(id + "VerticalScrollContainer","nsScrollVerticalScrollContainer");
	this.__divVerticalUpArrow = this.util.createDiv(id + "VerticalLeftArrow","nsScrollVerticalUpArrow");
	this.__divVerticalScrollPane = this.util.createDiv(id + "VerticalScrollPane","nsScrollVerticalScrollPane");
	this.__divVerticalScrollBar = this.util.createDiv(id + "VerticalScrollBar","nsScrollVerticalScrollBar");
	this.__divVerticalDownArrow = this.util.createDiv(id + "VerticalRightArrow","nsScrollVerticalDownArrow");
	
	this.__divParentContainer.appendChild(this.__divVerticalScrollContainer);
	this.__divVerticalScrollContainer.appendChild(this.__divVerticalUpArrow);
	this.__divVerticalScrollContainer.appendChild(this.__divVerticalScrollPane);
	this.__divVerticalScrollPane.appendChild(this.__divVerticalScrollBar);
	this.__divVerticalScrollContainer.appendChild(this.__divVerticalDownArrow);
	
	this.__divContentContainer.style.paddingRight = this.__scrollBarWidth + "px";
};

NSScroller2.prototype.__createCornerElement = function()
{
	var id = this.__getID();
	this.__divScrollBarCorner = this.util.createDiv(id + "ScrollBarCorner","nsScrollBarCorner");
	this.__divParentContainer.appendChild(this.__divScrollBarCorner);
};


NSScroller2.prototype.__isHorizontalScrollBarNeeded = function()
{
	var component = this.__config.component;
	if(component.scrollWidth > component.clientWidth)
	{
		return true;
	}
	return false;
	/*var parentContainerWidth = this.__divParentContainer.getBoundingClientRect().width;
	if(this.__componentDimension.outerWidth > parentContainerWidth) 
	{
       return true;
    }
	return false;*/
};

NSScroller2.prototype.__isVerticalScrollBarNeeded = function()
{
	var component = this.__config.component;
	if(component.scrollHeight > component.clientHeight)
	{
		return true;
	}
	return false;
	/*var parentContainerHeight = this.__divParentContainer.getBoundingClientRect().height;
	if(this.__componentDimension.outerHeight > parentContainerHeight) 
	{
       return true;
    }
	return false;*/
};

NSScroller2.prototype.__calculateHorizontalDimension = function()
{
	var parentContainerWidth = this.__divParentContainer.getBoundingClientRect().width;
	//TODO: Rename trackSize to paneSize
	this.__objHorizontalScroll.trackSize = this.util.getOuterWidth(this.__divHorizontalScrollPane);
	this.__objHorizontalScroll.scaleFactor = this.util.round(this.__componentDimension.outerWidth / parentContainerWidth,1);
	this.__objHorizontalScroll.scrollThumbSize = (this.__objHorizontalScroll.trackSize / this.__objHorizontalScroll.scaleFactor) - 32;
	console.log(this.__objHorizontalScroll.trackSize + "/" + this.__objHorizontalScroll.scaleFactor + "=" + this.__objHorizontalScroll.scrollThumbSize);
	this.__objHorizontalScroll.scrollFactor = parentContainerWidth / this.__objHorizontalScroll.scrollThumbSize;
	this.__objHorizontalScroll.scrollThumbSize = (this.__objHorizontalScroll.scrollThumbSize < 30 ? 30 : this.__objHorizontalScroll.scrollThumbSize);
	this.__objHorizontalScroll.clickPosition = 0;
	this.__objHorizontalScroll.delta = 0;
    
	this.__divHorizontalScrollPane.style.height = 16 + "px";
    this.__divHorizontalScrollBar.style.width = this.__objHorizontalScroll.scrollThumbSize + "px";
    this.__divHorizontalScrollBar.style.height = 11 + "px";
};

NSScroller2.prototype.__calculateVerticalDimension = function()
{
	var parentContainerHeight = this.__divParentContainer.getBoundingClientRect().height;
	//TODO: Rename trackSize to paneSize
	this.__objVerticalScroll.trackSize = this.util.getOuterHeight(this.__divVerticalScrollPane);
	this.__objVerticalScroll.scaleFactor = this.__componentDimension.outerHeight / parentContainerHeight;
	this.__objVerticalScroll.scrollThumbSize = 15;//(this.__objVerticalScroll.trackSize / this.__objVerticalScroll.scaleFactor);
	this.__objVerticalScroll.scrollFactor = parentContainerHeight / this.__objVerticalScroll.scrollThumbSize;
	this.__objVerticalScroll.scrollThumbSize = (this.__objVerticalScroll.scrollThumbSize < 30 ? 30 : this.__objVerticalScroll.scrollThumbSize);
	this.__objVerticalScroll.clickPosition = 0;
	this.__objVerticalScroll.delta = 0;
	console.log(this.__objVerticalScroll.trackSize / this.__objVerticalScroll.scaleFactor);
    
    this.__divVerticalScrollBar.style.height = this.__objVerticalScroll.scrollThumbSize + "px";
    this.__divVerticalScrollBar.style.width = 11 + "px";
};

NSScroller2.prototype.__addEvents = function() 
{
	this.__documentMouseUpRef = this.__documentMouseUpHandler.bind(this);
    this.__documentMouseMoveRef = this.__documentMouseMoveHandler.bind(this);
    this.__windowResizeRef = this.__windowResizeHandler.bind(this);
    
    this.util.addEvent(document.body,"mouseup",this.__documentMouseUpRef);
    this.util.addEvent(document.body,"mousemove", this.__documentMouseMoveRef);
    this.util.addEvent(document.body,"mouseleave", this.__documentMouseUpRef);
    this.util.addEvent(document.body,"blur", this.__documentMouseUpRef);
	/*this.util.addEvent(window,"resize",this.__windowResizeRef);*/
	
	this.util.addEvent(this.__divContentContainer,"scroll",this.__contentScrollHandler.bind(this));
	this.util.addEvent(this.__divHorizontalScrollBar,"mousedown",this.__horizontalScrollBarMouseDownHandler.bind(this));
	this.util.addEvent(this.__divVerticalScrollBar,"mousedown",this.__verticalScrollBarMouseDownHandler.bind(this));
	this.util.addEvent(this.__divHorizontalLeftArrow,"mousedown",this.__leftArrowMouseDownHandler.bind(this));
	this.util.addEvent(this.__divHorizontalRightArrow,"mousedown",this.__rightArrowMouseDownHandler.bind(this));
	this.util.addEvent(this.__divVerticalUpArrow,"mousedown",this.__upArrowMouseDownHandler.bind(this));
	this.util.addEvent(this.__divVerticalDownArrow,"mousedown",this.__downArrowMouseDownHandler.bind(this));
	
	/*this.util.addEvent(this.__divScrollBar,"mouseover",this.__scrollBarMouseOverHandler.bind(this));
	this.util.addEvent(this.__divScrollBar,"mouseout",this.__scrollBarMouseOutHandler.bind(this));
	this.util.addEvent(this.__divScrollPane,"mousedown",this.__scrollPaneMouseDownHandler.bind(this));
	this.util.addEvent(this.__divScrollUpArrow,"mousedown",this.__scrollUpArrowMouseDownHandler.bind(this));
	this.util.addEvent(this.__divScrollUpArrow,"dblclick",this.__scrollUpArrowMouseDownHandler.bind(this));
	this.util.addEvent(this.__divScrollDownArrow,"mousedown",this.__scrollDownArrowMouseDownHandler.bind(this));
	this.util.addEvent(this.__divScrollDownArrow,"dblclick",this.__scrollDownArrowMouseDownHandler.bind(this));*/
	
};

NSScroller2.prototype.__contentScrollHandler = function(event)
{
	this.__currentContentScroll = {scrollLeft:this.__divContentContainer.scrollLeft,scrollTop:this.__divContentContainer.scrollTop};
	if(this.__currentContentScroll.scrollTop !== this.__orignalContentScroll.scrollTop) 
	{
        this.__scroll(false);
    }
    if(this.__currentContentScroll.scrollLeft !== this.__orignalContentScroll.scrollLeft) 
    {
    	this.__scroll(true);
    }
	if(!this.__isScrolling)
	{
		//can fire an event
	}
	this.__isScrolling = true;
	var self = this;
	clearTimeout(this.__animationInterval);
	this.__animationInterval = setTimeout(function() 
	{
		self.__reset.bind(self)();
    }, 200);
};

NSScroller2.prototype.__horizontalScrollBarMouseDownHandler = function(event) 
{
	this.__scrollBarMouseDownHandler(event,this.__divHorizontalScrollBar,true);
};

NSScroller2.prototype.__verticalScrollBarMouseDownHandler = function(event) 
{
	this.__scrollBarMouseDownHandler(event,this.__divVerticalScrollBar,false);
};

NSScroller2.prototype.__scrollBarMouseDownHandler = function(event,scrollBar,isHorizontal) 
{
	event = this.util.getEvent(event);
	var objScroll = this.__getScrollObject(isHorizontal);
	var offset = scrollBar.offsetTop;
	var pos = event.pageY;
	if(isHorizontal)
	{
		offset = scrollBar.offsetLeft;
		pos = event.pageX;
	}
	objScroll.clickPosition = pos - offset;
	this.__draggedScrollBar = scrollBar;
	this.__isHorizontal = isHorizontal;
	this.util.preventDefault(event);
};

NSScroller2.prototype.__leftArrowMouseDownHandler = function(event) 
{
	this.__initiateScroll(true,false);
};

NSScroller2.prototype.__rightArrowMouseDownHandler = function(event) 
{
	this.__initiateScroll(true,true);
};

NSScroller2.prototype.__upArrowMouseDownHandler = function(event) 
{
	this.__initiateScroll(false,false);
};

NSScroller2.prototype.__downArrowMouseDownHandler = function(event) 
{
	this.__initiateScroll(false,true);
};

NSScroller2.prototype.__documentMouseUpHandler = function(event) 
{
	this.__draggedScrollBar = null;
	clearInterval(this.__scrollTriggerInterval);
};

NSScroller2.prototype.__documentMouseMoveHandler = function(event) 
{
	event = this.util.getEvent(event);
	if(this.__draggedScrollBar)
	{
		var objScroll = this.__getScrollObject(this.__isHorizontal);
		if(this.__isHorizontal)
		{
			objScroll.delta = event.pageX - objScroll.clickPosition;
			this.__divContentContainer.scrollLeft = objScroll.delta * objScroll.scrollFactor;
			console.log(this.__divContentContainer.scrollLeft);
		}
		else 
		{
			objScroll.delta = event.pageY - objScroll.clickPosition;
			this.__divContentContainer.scrollTop = objScroll.delta * objScroll.scrollFactor;
		}
	}
};

NSScroller2.prototype.__windowResizeHandler = function(event) 
{
	
};

NSScroller2.prototype.__initiateScroll = function(isHorizontal,isIncrease)
{
	var objScroll = this.__getScrollObject(isHorizontal);
	var interval = (objScroll.scaleFactor >= 2 ? objScroll.scaleFactor / 2 : 1);
	var propStyle  = "scrollTop";
	if(isHorizontal)
	{
		propStyle = "scrollLeft";
	}
	var self = this;
	this.__scrollTriggerInterval = setInterval(function() 
	{
		self.__continueScroll.bind(self)(objScroll,propStyle,isIncrease);
    }, interval);
};

NSScroller2.prototype.__continueScroll = function(objScroll,propStyle,isIncrease)
{
	if(isIncrease)
	{
		this.__divContentContainer[propStyle] += objScroll.scaleFactor;
	}
	else
	{
		this.__divContentContainer[propStyle] -= objScroll.scaleFactor;
	}
};

NSScroller2.prototype.__scroll = function(isHorizontal)
{
	var objScroll = this.__getScrollObject(isHorizontal);
	var scrollBar = this.__getScrollBar(isHorizontal);
	var scrollPosition = 0;
	var propStyle  = "";
	if(isHorizontal)
	{
		scrollPosition =  this.__divContentContainer.scrollLeft;
		propStyle = "left";
	}
	else
	{
		scrollPosition =  this.__divContentContainer.scrollTop;
		propStyle = "top";
	}
	if(objScroll && scrollBar)
	{
		var newScrollPosition = scrollPosition / objScroll.scaleFactor;
		scrollBar.style[propStyle] = newScrollPosition + "px";
	}
};

NSScroller2.prototype.__reset = function() 
{
	this.__isScrolling = false;
};

NSScroller2.prototype.__getScrollObject = function(isHorizontal) 
{
	var objScroll = this.__objVerticalScroll;
	if(isHorizontal)
	{
		objScroll = this.__objHorizontalScroll;
	}
	return objScroll;
};

NSScroller2.prototype.__getScrollBar = function(isHorizontal) 
{
	var scrollBar = this.__divVerticalScrollBar;
	if(isHorizontal)
	{
		scrollBar = this.__divHorizontalScrollBar;
	}
	return scrollBar;
};
/*********************************Start of Util Function*******************************/
NSScroller2.prototype.__getID = function()
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