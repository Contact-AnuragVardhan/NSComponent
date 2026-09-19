var nsDividerBox = Object.create(nsContainerBase);

nsDividerBox.initializeComponent = function() 
{
	this.base.initializeComponent();
	this.DIRECTION_VERTICAL = "vertical";
	this.DIRECTION_HORIZONTAL = "horizontal";
	this.DIVIDER_DIMENSION = 6;
	//should be 5 to avoid overlapping of two dividers but for collapsible it is 0
	this.DEFAULT_MIN_DIMENSION = 0;

	this.__direction = null;
	this.__ghostDivider = null;
	this.__beforeOffset = 0;
	this.__afterOffset = 0;
	this.__arrDivider = [];
	this.__measuringProperty = null;
	this.__isResizing = false;
	this.__isCollapsing = false;

	this.__currentDivider = null;
	this.__currentDividerObject = null;
	this.__offsetDimension = 0;
	this.__collapsingElement = null;
	
	this.__documentMouseMoveRef = null;
	this.__documentMouseUpRef = null;
};

nsDividerBox.setComponentProperties = function() 
{
	this.base.setComponentProperties();
	if(this.hasAttribute("direction")) 
	{
		this.__direction = this.getAttribute("direction");
	}
	if(this.hasAttribute("beforeOffset")) 
	{
		this.__beforeOffset = parseFloat(this.getAttribute("beforeOffset"));
	}
	if(this.hasAttribute("afterOffset")) 
	{
		this.__afterOffset =  parseFloat(this.getAttribute("afterOffset"));
	}
	if(this.hasAttribute("labelClass"))
	{
		this.util.addStyleClass(this.label,this.getAttribute("labelClass"));
	}
	this.__createComponents();
};

nsDividerBox.removeComponent = function()
{
	if(this.__documentMouseMoveRef)
	{
		this.util.removeEvent(document,"mousemove",this.__documentMouseMoveRef);
		this.__documentMouseMoveRef = null;
	}
	if(this.__documentMouseUpRef)
	{
		this.util.removeEvent(document,"mouseup",this.__documentMouseUpRef);
		this.__documentMouseUpRef = null;
	}
	this.base.removeComponent();
};

nsDividerBox.__createComponents = function()
{
	if(this.__direction == this.DIRECTION_HORIZONTAL)
	{
		this.__setVariables(true);
		this.__setHorizontalComponents();
	}
	else
	{
		this.__setVariables(false);
		this.__setVerticalComponents();
	}
};

nsDividerBox.__setVariables = function(isHorizontal)
{
	if(isHorizontal)
	{
		this.__measuringProperty = "top";
	}
	else
	{
		this.__measuringProperty = "left";
	}
	var offset = this.util.getOffSet(this);
	this.__offsetDimension = offset[this.__measuringProperty];
};

nsDividerBox.__setHorizontalComponents = function() 
{
	this.__setComponent("height","minHeight","nsHorizontal");
};

nsDividerBox.__setVerticalComponents = function() 
{
	this.__setComponent("width","minWidth","nsVertical");
};

//dimensionProperty will be height,width
//minDimensionProperty will be minHeight,minWidth
//cssClassPrefix will be "nsHorizontal" and "nsVertical"
nsDividerBox.__setComponent = function(dimensionProperty,minDimensionProperty,cssClassPrefix) 
{
	this.util.addStyleClass(this,cssClassPrefix + "ResizerContainer");
	var children = this.children;
	var arrChildElement = [];
	var childCount = -1;
	for (var count = 0; count < children.length; count++) 
	{
		var child = children[count];
		var item = {child:child,dimension:child.getBoundingClientRect()};
		arrChildElement[++childCount] = item;
		/*if(child)
	    {
			if(this.util.isElement(child) && child.nodeName != "SCRIPT")
			{
				var item = {child:child,dimension:child.getBoundingClientRect()};
				arrChildElement[++childCount] = item;
			}
			else
			{
				this.removeChild(child);
			}
	    }*/
	}
	var totalDimensionAllocated = 0;
	for (var count = 0; count < arrChildElement.length; count++) 
	{
		var item = arrChildElement[count];
		var child =  item.child;
		var expectedChildDimension = item.dimension[dimensionProperty];
		child.setAttribute("ns-collapsible",true);
		child.setAttribute("ns-collapsed",false);
		this.util.addStyleClass(child,"nsResizerChild");
		this.util.addStyleClass(child,cssClassPrefix + "ResizerChild");
		//substracting the dimension of the divider from its calculated dimension 
		if(count < arrChildElement.length - 1)
		{
			expectedChildDimension = expectedChildDimension - this.DIVIDER_DIMENSION;
		}
		var childDimension = expectedChildDimension;
		child.style[this.__measuringProperty] = totalDimensionAllocated + "px";
		child.style[dimensionProperty] = childDimension + "px";
		var minDimension = this.DEFAULT_MIN_DIMENSION;
		var offsetDimension = 0;
		if(child.style[minDimensionProperty])
		{
			minDimension = this.util.getDimensionAsNumber(child,child.style[minDimensionProperty]);
		}
		offsetDimension = totalDimensionAllocated;
		if(count === 0)
		{
			offsetDimension -= this.__beforeOffset;
		}
		var objDivider = {beforeElement:child, afterElement:null, 
						  beforeElementMinDimension:minDimension, afterElementMinDimension:0,
				  		  beforeElementTopDimension:offsetDimension,afterElementTopDimension:0,
				  		  beforeElementNextSiblingTop:offsetDimension,afterElementNextSiblingTop:0,
				  		  orignalBeforeElementDimension:0,orignalAfterElementDimension:0,
				  		  fromDimension:offsetDimension + minDimension,toDimension:0,
				  		  lastPositiontop:-1,lastPositionleft:-1,collapseElementString:"before"};
		totalDimensionAllocated += childDimension;
		objDivider.orignalBeforeElementDimension = totalDimensionAllocated;
		objDivider.beforeElementNextSiblingTop = totalDimensionAllocated;
		if(count != 0)
		{
			//setting the next element for previous Divider for global Divider Array
			var prevDividerID = this.__getDividerID(count - 1);
			var objPrevDivider = this.__arrDivider[prevDividerID];
			objPrevDivider.afterElement = child;
			if(count === arrChildElement.length - 1 && count > 1)
			{
				objPrevDivider.collapseElementString = "after";
				totalDimensionAllocated += this.__afterOffset;
			}
			objPrevDivider.afterElementMinDimension = minDimension;
			objPrevDivider.orignalAfterElementDimension = totalDimensionAllocated;
			objPrevDivider.afterElementTopDimension = offsetDimension;
			objPrevDivider.toDimension = totalDimensionAllocated;
			objPrevDivider.afterElementNextSiblingTop = totalDimensionAllocated;
			
			this.__arrDivider[prevDividerID] = objPrevDivider;
		}
		if(count < arrChildElement.length - 1)
		{
			var divider = this.__getDivider(count,arrChildElement.length - 2,cssClassPrefix);
			var dividerDimension = this.DIVIDER_DIMENSION;
			divider.style[dimensionProperty] = dividerDimension + "px";
			divider.style[this.__measuringProperty] = totalDimensionAllocated + "px";
			totalDimensionAllocated += dividerDimension;
			this.util.addEvent(divider,"mousedown",this.__dividerMouseDownHandler.bind(this));
			this.insertBefore(divider,objDivider.afterElement);
			//setting the global Divider Array
			this.__arrDivider[divider.id] = objDivider;
		}
	}
};

nsDividerBox.__dividerMouseDownHandler = function(event) 
{
	event = this.util.getEvent(event);
	var divider = this.util.getTarget(event);
	if(divider)
	{
		if(!this.util.hasStyleClass(divider,"nsResizerLines"))
		{
			if(!this.util.hasStyleClass(divider,"nsDivider"))
			{
				divider = this.util.findParentBySelector(divider,".nsDivider");
			}
			if(divider)
			{
				this.__createGhost(divider,event);
				var objDivider = this.__arrDivider[divider.id];
				objDivider.beforeElement.setAttribute("ns-collapsed",false);
				objDivider.lastPositiontop = -1;
				objDivider.lastPositionleft = -1;
				this.__currentDivider = divider;
				this.__currentDividerObject = objDivider;
				this.__documentMouseMoveRef = this.__documentMouseMoveHandler.bind(this);
				this.__documentMouseUpRef = this.__documentMouseUpHandler.bind(this);
				this.util.addEvent(document,"mousemove",this.__documentMouseMoveRef);
				this.util.addEvent(document,"mouseup",this.__documentMouseUpRef);
				this.__isResizing = true;
				this.util.preventDefault(event);
			}
		}
	}
};

nsDividerBox.__documentMouseMoveHandler = function (event) 
{
	if(this.__isResizing)
	{
		event = this.util.getEvent(event);
		var posEvent = this.util.getEventPosition(event);
		this.__ghostDivider.style[this.__measuringProperty] = posEvent[this.__measuringProperty] + "px";
	}
};

nsDividerBox.__documentMouseUpHandler = function (event) 
{
	if(this.__documentMouseMoveRef)
	{
		this.util.removeEvent(document,"mousemove",this.__documentMouseMoveRef);
		this.__documentMouseMoveRef = null;
	}
	if(this.__documentMouseUpRef)
	{
		this.util.removeEvent(document,"mouseup",this.__documentMouseUpRef);
		this.__documentMouseUpRef = null;
	}
	if(this.__isResizing)
	{
		this.__performResize(event);
		if(this.__ghostDivider)
		{
			this.__ghostDivider.parentNode.removeChild(this.__ghostDivider);
			this.__ghostDivider = null;
		}
		this.__isResizing = false;
	}
};

nsDividerBox.__collapserClickHandler = function(event)
{
	event = this.util.getEvent(event);
	var target = this.util.getTarget(event);
	target = this.util.findParentBySelector(target,".nsDivider");
	if(target)
	{
		var objDivider = this.__arrDivider[target.id];
		if(objDivider)
		{
			var elementProperty = objDivider.collapseElementString + "Element";
			var dimensionProperty = ((objDivider.collapseElementString === "before") ? "fromDimension" : "toDimension");
			if(Boolean.parse(objDivider[elementProperty].getAttribute("ns-collapsible")))
			{
				this.__currentDivider = target;
				this.__currentDividerObject = objDivider;
				var element = objDivider[elementProperty];
				this.__collapsingElement = element;
				this.util.addStyleClass(target,"nsResizerAnimation");
				objDivider.beforeElement ? this.util.addStyleClass(objDivider.beforeElement,"nsResizerAnimation"):null;
				objDivider.afterElement ? this.util.addStyleClass(objDivider.afterElement,"nsResizerAnimation") : null;
				new this.util.transition(target,this.__animationHandler.bind(this));
				new this.util.transition(objDivider.beforeElement,this.__animationHandler.bind(this));
				new this.util.transition(objDivider.afterElement,this.__animationHandler.bind(this));
				var isCollapsed = Boolean.parse(element.getAttribute("ns-collapsed"));
				this.__isCollapsing = true;
				if(isCollapsed)
				{
					element.style.visibility="inherit";
					var lastDimension = objDivider["lastPosition" + this.__measuringProperty];
					this.__performResize(event,lastDimension);
					objDivider.lastPositiontop = -1;
					objDivider.lastPositionleft = -1;
				}
				else
				{
					var position = this.util.getPosition(target);
					objDivider.lastPositiontop = position.top;
					objDivider.lastPositionleft = position.left;
					console.log(objDivider[dimensionProperty]);
					this.__performResize(event,objDivider[dimensionProperty]);
				}
				element.setAttribute("ns-collapsed",!isCollapsed);
			}
		}
		this.util.preventDefault(event);
		event.stopImmediatePropagation();
	}
};

nsDividerBox.__animationHandler = function(event)
{
	var target = this.util.getTarget(event);
	if(target)
	{
		this.util.removeStyleClass(target,"nsResizerAnimation");
	}
	if(this.__collapsingElement && Boolean.parse(this.__collapsingElement.getAttribute("ns-collapsed")))
	{
		this.__collapsingElement.style.visibility="hidden";
	}
	this.__isCollapsing = false;
	this.__isVisible = !this.__isVisible;
};

nsDividerBox.__performResize = function(event,intendedPosition)
{
	var objDivider = this.__currentDividerObject;
	if(!this.__isCollapsing)
	{
		objDivider.beforeElement.style.visibility="inherit";
		objDivider.afterElement.style.visibility="inherit";
	}
	if(this.__direction == this.DIRECTION_VERTICAL)
	{
		var isRelative = true;
		if(!this.util.isNumber(intendedPosition))
		{
			intendedPosition = event.pageX;
			isRelative = false;
		}
		var xPos = this.__getValidVerticalPosition(intendedPosition,objDivider,isRelative);
		if(xPos > -1)
		{
			var expectedAfterElementWidth = objDivider.afterElementNextSiblingTop - xPos;
			this.__currentDivider.style.left = xPos + "px";
			objDivider.beforeElement.style.width = (xPos - objDivider.beforeElementTopDimension) + "px";
			objDivider.afterElement.style.width = expectedAfterElementWidth + "px";
			objDivider.afterElement.style.left = (xPos + this.DIVIDER_DIMENSION) + "px";
			console.log(intendedPosition + "," + objDivider.afterElementNextSiblingTop);
		}
	}
	else if(this.__direction == this.DIRECTION_HORIZONTAL)
	{
		var isRelative = true;
		if(!this.util.isNumber(intendedPosition))
		{
			intendedPosition = event.pageY;
			isRelative = false;
		}
		var yPos = this.__getValidHorizontalPosition(intendedPosition,objDivider,isRelative);
		if(yPos > -1)
		{
			var expectedAfterElementHeight = objDivider.afterElementNextSiblingTop - yPos;
			this.__currentDivider.style.top = yPos + "px";
			objDivider.beforeElement.style.height = (yPos - objDivider.beforeElementTopDimension) + "px";
			objDivider.afterElement.style.height = expectedAfterElementHeight + "px";
			objDivider.afterElement.style.top = (yPos + this.DIVIDER_DIMENSION) + "px";
		}
	}
	this.__recalculateDividerValues();
	
	this.__currentDivider = null;
	this.__currentDividerObject = null;
};

nsDividerBox.__getValidVerticalPosition = function(proposedXPos,objDivider,isRelative)
{
	var xPos = -1;
	if(proposedXPos > -1 && objDivider)
	{
		xPos = proposedXPos;
		if(!isRelative)
		{
			//xPos -= this.__offsetDimension;
		}
		if(xPos < objDivider.fromDimension)
		{
			xPos = objDivider.fromDimension;
		}
		else if(xPos > objDivider.toDimension)
		{
			xPos = objDivider.toDimension;
		}
		var expectedAfterElementWidth = objDivider.afterElementNextSiblingTop - xPos;
		//mouse movement is LEFT
		if(xPos < (objDivider.beforeElementTopDimension + objDivider.beforeElementMinDimension))
		{
			xPos = -1;
		}
		//mouse movement is RIGHT
		else if(expectedAfterElementWidth < objDivider.afterElementMinDimension)
		{
			xPos = -1;
		}
	}
	return xPos;
};

nsDividerBox.__getValidHorizontalPosition = function(proposedYPos,objDivider,isRelative)
{
	var yPos = -1;
	if(proposedYPos > -1 && objDivider)
	{
		yPos = proposedYPos;
		if(!isRelative)
		{
			yPos -= this.__offsetDimension;
		}
		if(yPos < objDivider.fromDimension)
		{
			yPos = objDivider.fromDimension;
		}
		else if(yPos > objDivider.toDimension)
		{
			yPos = objDivider.toDimension;
		}
		var expectedAfterElementHeight = objDivider.afterElementNextSiblingTop - yPos;
		//mouse movement is UP || 
		if(yPos < (objDivider.beforeElementTopDimension + objDivider.beforeElementMinDimension))
		{
			yPos = -1;
		}
		//mouse movement is down
		else if(expectedAfterElementHeight < objDivider.afterElementMinDimension)
		{
			yPos = -1;
		}
	}
	return yPos;
};

nsDividerBox.__recalculateDividerValues = function()
{
	var count =  parseInt(this.__currentDivider.getAttribute("ns-index"));
	var beforeDividerID = this.__getDividerID(count - 1);
	var objPrevDivider = this.__arrDivider[beforeDividerID];
	if(objPrevDivider)
	{
		objPrevDivider.afterElementTopDimension = this.util.getDimensionAsNumber(objPrevDivider.afterElement,objPrevDivider.afterElement.style[this.__measuringProperty]);
		var dividerDimension = this.util.getDimensionAsNumber(this.__currentDivider,this.__currentDivider.style[this.__measuringProperty]);
		objPrevDivider.toDimension = dividerDimension - objPrevDivider.afterElementMinDimension;
		var nextSibling = objPrevDivider.afterElement.nextElementSibling;
		if(nextSibling)
		{
			var nextSiblingDimension = this.util.getDimensionAsNumber(nextSibling,nextSibling.style[this.__measuringProperty]);
			//substracting this as sometimes the dimension calculation has some limitations
			objPrevDivider.afterElementNextSiblingTop = nextSiblingDimension - this.DIVIDER_DIMENSION;
		}
	}
	var nextDividerID = this.__getDividerID(count + 1);
	var objNextDivider = this.__arrDivider[nextDividerID];
	if(objNextDivider)
	{
		objNextDivider.beforeElementTopDimension = this.util.getDimensionAsNumber(objNextDivider.beforeElement,objNextDivider.beforeElement.style[this.__measuringProperty]);
		objNextDivider.fromDimension = objNextDivider.beforeElementTopDimension + objNextDivider.beforeElementMinDimension;
		var nextSibling = objNextDivider.beforeElement.nextElementSibling;
		if(nextSibling)
		{
			var nextSiblingDimension = this.util.getDimensionAsNumber(nextSibling,nextSibling.style[this.__measuringProperty]);
			objNextDivider.beforeElementNextSiblingTop = nextSiblingDimension;
		}
	}
};

//cssClassPrefix will be "nsHorizontal" and "nsVertical"
nsDividerBox.__getDivider = function(count,totalChild,cssClassPrefix)
{
	var dividerID  = this.__getDividerID(count);
	var divider = this.util.createDiv(dividerID,"nsDivider");
	this.util.addStyleClass(divider,cssClassPrefix + "Resizer");
	divider.setAttribute("ns-index",count);
	if(count === 0 || count === totalChild)
	{
		var dividerLines = this.util.createElement("span",null,"nsResizerLines");
		this.util.addStyleClass(dividerLines,cssClassPrefix + "ResizerLines");
		divider.appendChild(dividerLines);
		this.util.addEvent(dividerLines,"click",this.__collapserClickHandler.bind(this));
	}
	return divider;
};

nsDividerBox.__createGhost = function(divider,event)
{
	this.__ghostDivider = divider.cloneNode(true);
	var objDivider = this.__arrDivider[divider.id];
	//this.__ghostDivider.setAttribute("style","{position:absolute;}");
	var posEvent = this.util.getEventPosition(event);
	var offset = this.util.getCumulativeOffset(divider);
	this.__ghostDivider.style.top = offset.y + "px";
	this.__ghostDivider.style.left = offset.x + "px";
	var rectDivider = divider.getBoundingClientRect();
	this.__ghostDivider.style.height = rectDivider.height + "px";
	this.__ghostDivider.style.width = rectDivider.width + "px";
	var maxZIndex = this.util.getMaxZIndex(divider); 
	if(maxZIndex > 0)
	{
		this.__ghostDivider.style.zIndex = (maxZIndex + 1);
	}
	document.body.appendChild(this.__ghostDivider);
};

nsDividerBox.__getDividerID = function(count)
{
	return this.getID() + "#resizer" + count;
};

document.registerElement("ns-dividerBox", {prototype: nsDividerBox});