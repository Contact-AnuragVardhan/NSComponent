var NSDragDrop = (function()
{
	var NSDragDrop = function(setting)
	{
		this.ITEM_DROPPING = "itemDropping";
		this.ITEM_DROPPED = "itemDropped";
		this.DRAG_STARTING = "dragStarting";
		this.DRAG_STARTED = "dragStarted";
		this.DRAGGING = "dragging";
		this.DRAG_END = "dragEnd";
		
		this.__setting = setting;
		this.util = new NSUtil();
		this.__id = null;
		this.__config = null;
		this.__data = null;
		
		this.__parentContainerType = null;
		this.__divMovable = null;
		this.__compPlaceholder = null;
		this.__itemPosition = null;
		this.__objSelectedItem = {scrollableContainer:null,containment:null};
		this.__lastTarget = null;
		this.__isDragging = false;
		this.__holdTimeoutInterval = -1;
		this.__documentMouseMoveRef = null;
		this.__documentMouseUpRef = null;
		this.__documentMouseMoveHoldRef = null;
		this.__documentMouseUpHoldRef = null;
		
		this.__initialize();
	};
	
	NSDragDrop.prototype.remove = function() 
	{ 
		
	};
	
	NSDragDrop.prototype.setDragData = function(data) 
	{ 
		this.__data = data;
	};
	
	NSDragDrop.prototype.getDragData = function() 
	{ 
		return this.__data;
	};
	
	NSDragDrop.prototype.__initialize = function()
	{
		if(this.__setting)
		{
			this.__config = {
					container: this.__setting["container"] || null,
					childNodeType: this.__setting["childNodeType"] || null,
					isContainerDraggable:(this.util.isUndefinedOrNull(this.__setting["isContainerDraggable"]) ? true : Boolean.parse(this.__setting["isContainerDraggable"])),
					isContainerDroppable:(this.util.isUndefinedOrNull(this.__setting["isContainerDroppable"]) ? true : Boolean.parse(this.__setting["isContainerDroppable"])),
					enableDragByHandle: Boolean.parse(this.__setting["enableDragByHandle"]),
					dragHandlerClass: this.__setting["dragHandlerClass"] || "nsDragHandler",
					enableDragAfterHold: Boolean.parse(this.__setting["enableDragAfterHold"]),
					enableCloneMode: Boolean.parse(this.__setting["enableCloneMode"]),
					holdTime:(this.util.isUndefinedOrNull(this.__setting["holdTime"]) ? 500 : parseInt(this.__setting["holdTime"])),
					createCloneCallback: (this.__setting["createCloneCallback"] ? this.util.getFunction(this.__setting["createCloneCallback"]) : null),
					createPlaceholderCallback: (this.__setting["createPlaceholderCallback"] ? this.util.getFunction(this.__setting["createPlaceholderCallback"]) : null),
					nodeDroppableCallback: (this.__setting["nodeDroppableCallback"] ? this.util.getFunction(this.__setting["nodeDroppableCallback"]) : null),
					nodeDraggableCallback: (this.__setting["containerDroppableCallback"] ? this.util.getFunction(this.__setting["containerDroppableCallback"]) : null),
					insertNodeCallback: (this.__setting["insertNodeCallback"] ? this.util.getFunction(this.__setting["insertNodeCallback"]) : null),
					moveNodeCallback: (this.__setting["moveNodeCallback"] ? this.util.getFunction(this.__setting["moveNodeCallback"]) : null),
					removeNodeCallback: (this.__setting["removeNodeCallback"] ? this.util.getFunction(this.__setting["removeNodeCallback"]) : null),
					nodeDragHoverClass: this.__setting["nodeDragHoverClass"] || "nsNodeDragHover",
					nodeDraggingClass: this.__setting["nodeDraggingClass"] || "nsNodeDraggingClass"
			};
			if(this.__config.container && this.__config.childNodeType)
			{
				this.__parentContainerType = this.__config.container.tagName;
				this.__prepareContainer();
				this.__initializeChildren();
			}
		}
	};
	
	NSDragDrop.prototype.__initializeChildren = function()
	{
		var arrChildNode = this.__config.container.getElementsByTagName(this.__config.childNodeType);
		var childNode = null;
		for (var count = 0; count < arrChildNode.length; count++) 
		{
			childNode = arrChildNode[count];
			this.__prepareChildNode(childNode,count);
		}
	};
	
	NSDragDrop.prototype.__prepareContainer = function()
	{
		var container = this.__config.container;
		var nsObject = {};
		nsObject.id = this.__getID(); 
		nsObject.isDraggable = this.__config.isContainerDraggable;
		nsObject.isDroppable = this.__config.isContainerDroppable;
		nsObject.insertNode = this.__insertNode.bind(this);
		nsObject.moveNode = this.__moveNode.bind(this);
		nsObject.removeNode = this.__removeNode.bind(this);
		container.nsObject = nsObject;
		var draggableClass = nsObject.isDraggable ? "nsDraggableContainer" : "nsNonDraggableContainer";
		var droppableClass = nsObject.isDroppable ? "nsDroppableContainer" : "nsNonDroppableContainer";
		this.util.addStyleClass(container,draggableClass);	
		this.util.addStyleClass(container,droppableClass);
		var containerWebNode = this.util.getWebComponentElement(container);
		containerWebNode.nsObject = nsObject;
	};
	
	NSDragDrop.prototype.__prepareChildNode = function(childNode,index)
	{
		var isDragEnabled = this.__isNodeDraggable(childNode);
		var isDropEnabled = this.__isNodeDroppable(childNode);
		var nsObject = {};
		nsObject.parent = this.__config.container;
		nsObject.index = index;
		this.util.removeStyleClass(childNode,this.__config.nodeDragHoverClass);
		if(isDragEnabled) 
		{
			nsObject.position = this.util.getOffSet(childNode);
			this.util.addStyleClass(childNode,"nsNodeDragEnabled");	
			if(this.__config.enableDragByHandle)
			{
				var handle = childNode.querySelector("." + this.__config.dragHandlerClass);
				if(handle)
				{
					this.util.addEvent(handle,"mousedown",this.__childMouseDownHandler.bind(this));
					this.util.addEvent(handle,"touchstart",this.__childMouseDownHandler.bind(this));
					this.util.addEvent(childNode,"mousedown",this.__dragStartPreventHandler.bind(this));
					this.util.addEvent(childNode,"touchstart",this.__dragStartPreventHandler.bind(this));
				}
			}
			else if(this.__config.enableDragAfterHold)
			{
				this.util.addEvent(childNode,"mousedown",this.__childHoldMouseDownHandler.bind(this));
				this.util.addEvent(childNode,"touchstart",this.__childHoldMouseDownHandler.bind(this));
			}
			else
			{
				this.util.addEvent(childNode,"mousedown",this.__childMouseDownHandler.bind(this));
				this.util.addEvent(childNode,"touchstart",this.__childMouseDownHandler.bind(this));
			}
		}
		else
		{
			this.util.addStyleClass(childNode,"nsNodeDragDisable");					
		}
		nsObject.dragEnabled = isDragEnabled;
		nsObject.dropEnabled = isDropEnabled;
		childNode.nsObject = nsObject;
		var childWebNode = this.util.getWebComponentElement(childNode);
		childWebNode.nsObject = nsObject;
	};
	
	NSDragDrop.prototype.__childHoldMouseDownHandler= function(event)
	{
		this.__clearHoldTime();
		var self = this;
		this.__holdTimeoutInterval = setTimeout(function () {
	         self.__childMouseDownHandler.bind(self)(event);
	       },this.__config.holdTime);
		this.__addDocumentHoldListener();
	};
	
	NSDragDrop.prototype.__documentMouseMoveHoldHandler = function(event)
	{
		this.__clearHoldTime();
	};
	
	NSDragDrop.prototype.__documentMouseUpHoldHandler = function(event)
	{
		this.__clearHoldTime();
	};
	
	NSDragDrop.prototype.__childMouseDownHandler= function(event)
	{
		if(!this.__isDragging)
		{
			this.__clearHoldTime();
			event = this.util.getEvent(event);
		    var target = this.util.getTarget(event);
		    target = this.util.findParent(target,this.__config.childNodeType);
		    if(target && target["nsObject"] && target["nsObject"]["dragEnabled"] && target["nsObject"]["parent"] 
		    	&& target["nsObject"]["parent"]["nsObject"] && target["nsObject"]["parent"]["nsObject"]["isDraggable"])
			{
		    	var cancelled = this.util.dispatchEvent(this.__config.container,this.DRAG_STARTING,{node:target},{node:target},true,true);
		 		if(!cancelled)
		 		{
			    	this.__isDragging = true;
			    	this.__addDocumentListener();
			    	//TODO: Find parent with scroll
			    	this.__objSelectedItem.scrollableContainer = document.documentElement;
			    	//TODO: Find parent for containment
			    	this.__objSelectedItem.containment = document.body;
			    	this.__itemPosition = this.__positionStarted(event,target,this.__objSelectedItem.scrollableContainer);
				    this.util.makeBodyUnselectable();
				    // remove text selection (Chrome, FF, Opera, Safari)
				    if (window.getSelection) 
				    {
						window.getSelection().removeAllRanges();
					}
					// IE8
					else if (document.selection && document.selection.type === "Text") 
					{
						try 
						{
							document.selection.empty();
						}
						catch (error) 
						{
						}
					}
				    if(!this.__config.enableCloneMode)
					{
						this.__compPlaceholder = this.__createPlaceholder(target);
						this.__compPlaceholder = this.util.getWebComponentElement(this.__compPlaceholder);
						this.util.insertAfterElement(target,this.__compPlaceholder);
					}
					this.__divMovable = this.__cloneNode(target);
					this.util.addStyleClass(target,this.__config.nodeDraggingClass);
					this.__movePosition(event,this.__divMovable,this.__itemPosition,this.__objSelectedItem.containment,"absolute",this.__objSelectedItem.scrollableContainer);
					//adding offset to movable component if enableDragAfterHold is true so that users see that a clone has been created
					if(this.__config.enableDragAfterHold)
					{
						var rectMovable = this.__divMovable.getBoundingClientRect();
						this.__divMovable.style.left = (rectMovable.left + 5) + "px";
						this.__divMovable.style.top = (rectMovable.top + 5) + "px";
					}
					this.util.dispatchEvent(this.__config.container,this.DRAG_STARTED,target,{item:target});
					//assuming data has been set as this is last step before dragging starts
					target["nsObject"]["data"] = this.util.cloneObject(this.__data);
					event.stopPropagation();
		 		}
			}
			return false;
		}
	};
	
	NSDragDrop.prototype.__documentMouseMoveHandler = function(event)
	{
		if(this.__divMovable)
		{
			var orignalNode = null;
			if(this.__divMovable["nsObject"] && this.__divMovable["nsObject"]["orignalNode"])
			{
				orignalNode = this.__divMovable["nsObject"]["orignalNode"];
			}
			event = this.util.getEvent(event);
			var objTargetElement = this.__getTargetElementDetails(event,orignalNode);
			var targetX = objTargetElement.x;
		    var targetY = objTargetElement.y;
		    var targetElement = objTargetElement.element;
		    if(this.__lastTarget)
		    {
		    	this.util.removeStyleClass(this.__lastTarget,this.__config.nodeDragHoverClass);
		    }
		    this.__movePosition(event,this.__divMovable,this.__itemPosition, this.__objSelectedItem.containment,"absolute",this.__objSelectedItem.scrollableContainer);
		    if(targetElement && targetElement["nsObject"] && targetElement["nsObject"]["parent"] 
	    		&& targetElement["nsObject"]["parent"]["nsObject"] && targetElement["nsObject"]["parent"]["nsObject"]["isDroppable"])
		    {
		    	var container = objTargetElement.parent;
			    var objTargetNSObject = targetElement["nsObject"];
			    if(this.__config.enableCloneMode)
			    {
			    	this.util.addStyleClass(targetElement,this.__config.nodeDragHoverClass);
			    }
			    else
			    {
			    	if (this.__lastTarget !== targetElement) 
			    	{
			    		var placeholderIndex = this.__getPlaceHolderIndex(container);
				        if (placeholderIndex < 0) 
				        {
				        	this.__insertBefore(targetElement);
				        } 
				        else 
				        {
				        	if (placeholderIndex <= objTargetNSObject.index) 
					        {
				        		this.__insertAfter(targetElement);
					        } 
					        else 
					        {
					        	this.__insertBefore(targetElement);
					        }
				        }
			        }
			    }
		    }
	 	    var data = {node:orignalNode,x:targetX,y:targetY,targetNode:targetElement};
	 	    this.util.dispatchEvent(this.__config.container,this.DRAGGING,data,{item:data});
		    this.util.preventDefault(event);
		    this.__lastTarget = targetElement;
		    return false;
		}
	};
	
	NSDragDrop.prototype.__documentMouseUpHandler = function(event)
	{
		this.__removeDocumentListener();
		if(this.__divMovable)
		{
			var orignalNode = null;
			var nodeData = null;
			if(this.__divMovable["nsObject"] && this.__divMovable["nsObject"]["orignalNode"])
			{
				orignalNode = this.__divMovable["nsObject"]["orignalNode"];
				if(orignalNode && orignalNode["nsObject"])
				{
					nodeData = orignalNode["nsObject"]["data"];
				}
			}
			event = this.util.getEvent(event);
			var objTargetElement = null;
			var isPlaceholder = false;
			if(this.__config.enableCloneMode)
			{
				objTargetElement = this.__getTargetElementDetails(event,orignalNode);
			}
			else
			{
				objTargetElement = this.__getPlaceholderDetails(event);
				isPlaceholder = true;
			}
			var targetX = objTargetElement.x;
		    var targetY = objTargetElement.y;
		    var hasElementChanged = false;
		    var targetElement = objTargetElement.element;
		    if(targetElement && (isPlaceholder || targetElement["nsObject"] && targetElement["nsObject"]["parent"] 
				&& targetElement["nsObject"]["parent"]["nsObject"] && targetElement["nsObject"]["parent"]["nsObject"]["isDroppable"]))
		    {
		    	var container = objTargetElement.parent;
		    	if(container && container.tagName.toLowerCase() === "tbody")
		    	{
		    		container = this.util.findParent(container,"table");
		    	}
		    	var objTargetNSObject = null;
		    	var targetIndex = -1;
		    	if(this.__config.enableCloneMode)
				{
		    		objTargetNSObject = targetElement["nsObject"];
		    		targetIndex = objTargetNSObject["index"];
				}
		    	else
		    	{
		    		targetIndex = Array.prototype.indexOf.call(targetElement.parentNode.children,targetElement);
		    	}
		    	var item = (nodeData ? nodeData : {});
		    	item.targetNode = targetElement;
		    	item.node = orignalNode;
		    	if(container)
		    	{
		    		var cancelled = this.util.dispatchEvent(container,this.ITEM_DROPPING,item,{item:item},true,true);
			 		if(!cancelled)
			 		{
			 			if(orignalNode === targetElement)
			 			{
			 				hasElementChanged = false;
			 				this.__animateInvalidDrop(orignalNode);
			 				console.debug("Item has not changed");
			 			}
			 		    if(this.__isSameContainer(container))
			 		    {
			 		    	if(orignalNode["nsObject"]["index"] !== targetIndex)
			 		    	{
			 		    		this.__moveNode(orignalNode,targetIndex,targetElement,nodeData);
			 		    		hasElementChanged = true;
			 		    	}
			 		    }
			 		    else
			 		    {
			 		    	this.__removeNode(orignalNode,nodeData);
			 		    	if(container["nsObject"] && container["nsObject"]["insertNode"])
			 		    	{
			 		    		container["nsObject"]["insertNode"](orignalNode,targetIndex,targetElement,nodeData);
			 		    	}
			 		    	hasElementChanged = true;
			 		    }
			 		    this.util.dispatchEvent(container,this.ITEM_DROPPED,item,{item:item},true,false);
			 		}
			 		else
					{
			 			hasElementChanged = false;
			 			this.__animateInvalidDrop(orignalNode);
						console.debug("Item drop was cancelled");
					}
		    	}
		    	else
				{
			    	hasElementChanged = false;
					this.__animateInvalidDrop(orignalNode);
					console.debug("Item was dropped at invalid location");
				}
		    }
		    else
			{
		    	hasElementChanged = false;
				this.__animateInvalidDrop(orignalNode);
				console.debug("Item was dropped at invalid location");
			}
		    if(hasElementChanged)
		    {
		    	this.__dragEndCleanUp();
		    }
		    this.util.dispatchEvent(this.__config.container,this.DRAG_END,orignalNode,{item:orignalNode},true,false);
			this.util.preventDefault(event);
		    event.stopPropagation();
			return false;
		}
		this.__dragEndCleanUp();
	};
	
	NSDragDrop.prototype.__dragStartPreventHandler = function(event)
	{
		event = this.util.getEvent(event);
		this.util.preventDefault(event);
	    event.stopPropagation();
	};
	
	NSDragDrop.prototype.__addDocumentListener = function() 
	{
		if(!this.__documentMouseMoveRef)
		{
			this.__documentMouseMoveRef = this.__documentMouseMoveHandler.bind(this);
			this.util.addEvent(document,"mousemove",this.__documentMouseMoveRef);
		}
		if(!this.__documentMouseUpRef)
		{
			this.__documentMouseUpRef = this.__documentMouseUpHandler.bind(this);
			this.util.addEvent(document,"mouseup",this.__documentMouseUpRef);
		}
	};
	
	NSDragDrop.prototype.__removeDocumentListener = function() 
	{
		if(this.__documentMouseMoveRef)
		{
			this.util.removeEvent(document,"mousemove",this.__documentMouseMoveRef);
			this.__documentMouseMoveRef = null;
		}
		if(!this.__documentMouseUpRef)
		{
			this.util.removeEvent(document,"mouseup",this.__documentMouseUpRef);
			this.__documentMouseUpRef = null;
		}
	};
	
	NSDragDrop.prototype.__addDocumentHoldListener = function() 
	{
		if(!this.__documentMouseMoveHoldRef)
		{
			this.__documentMouseMoveHoldRef = this.__documentMouseMoveHoldHandler.bind(this);
			this.util.addEvent(document,"mousemove",this.__documentMouseMoveHoldRef);
		}
		if(!this.__documentMouseUpHoldRef)
		{
			this.__documentMouseUpHoldRef = this.__documentMouseUpHoldHandler.bind(this);
			this.util.addEvent(document,"mouseup",this.__documentMouseUpHoldRef);
		}
	};
	
	NSDragDrop.prototype.__removeDocumentHoldListener = function() 
	{
		if(this.__documentMouseMoveHoldRef)
		{
			this.util.removeEvent(document,"mousemove",this.__documentMouseMoveHoldRef);
			this.__documentMouseMoveHoldRef = null;
		}
		if(!this.__documentMouseUpHoldRef)
		{
			this.util.removeEvent(document,"mouseup",this.__documentMouseUpHoldRef);
			this.__documentMouseUpHoldRef = null;
		}
	};
	
	NSDragDrop.prototype.__animateInvalidDrop = function(orignalNode)
	{
		if(this.__divMovable && orignalNode)
		{
			var self = this;
			var transitionEndCallback = function()
			{
				self.util.removeStyleClass(self.__divMovable,"nsAnimateGhost");
				self.__dragEndCleanUp();
				self.__resetChildren();
			};
			if(this.__config.enableCloneMode)
			{
				this.util.addStyleClass(this.__divMovable,"nsAnimateGhost");
				var transition = new this.util.transition(this.__divMovable,transitionEndCallback);
		    	var objSourceNSObject = orignalNode["nsObject"];
		    	this.__divMovable.style.left = (objSourceNSObject.position.left) + "px";
		    	this.__divMovable.style.top = (objSourceNSObject.position.top ) + "px";
			}
			else
			{
				transitionEndCallback();
			}
		}
	};
	
	NSDragDrop.prototype.__resetChildren = function()
	{
		var arrChildNode = this.__config.container.getElementsByTagName(this.__config.childNodeType);
		var childNode = null;
		for (var count = 0; count < arrChildNode.length; count++) 
		{
			childNode = arrChildNode[count];
			this.util.removeStyleClass(childNode,this.__config.nodeDragHoverClass);
		}
	};
	
	NSDragDrop.prototype.__clearHoldTime = function()
	{
		if(this.__holdTimeoutInterval > -1)
		{
			clearTimeout(this.__holdTimeoutInterval);
		}
		this.__holdTimeoutInterval = -1;
		this.__removeDocumentHoldListener();
	};
	
	NSDragDrop.prototype.__insertNode = function(node,index,currentElement,nodeData)
	{
		if(this.__config.insertNodeCallback)
		{
			this.__config.insertNodeCallback(this.__config.container,node,index,currentElement,nodeData);
		}
		else
		{
			var container = this.__config.container;
			if(this.__parentContainerType.toLowerCase() === "table")
			{
				currentElement.parentNode.insertBefore(node,currentElement);
			}
			else
			{
				container.insertBefore(node,currentElement);
			}
		}
		this.__initializeChildren();
	};
	
	NSDragDrop.prototype.__moveNode = function(node,index,currentElement,nodeData)
	{
		if(this.__config.moveNodeCallback)
		{
			this.__config.moveNodeCallback(this.__config.container,node,index,currentElement,nodeData);
		}
		else
		{
			var container = this.__config.container;
			if(this.__parentContainerType.toLowerCase() === "table")
			{
				currentElement.parentNode.insertBefore(node,currentElement);
			}
			else
			{
				//this.util.insertAfterElement(currentElement,node);
				container.insertBefore(node,currentElement);
			}
		}
		this.__initializeChildren();
	};
	
	NSDragDrop.prototype.__removeNode = function(node,nodeData)
	{
		if(this.__config.removeNodeCallback)
		{
			this.__config.removeNodeCallback(this.__config.container,node,nodeData);
		}
		else
		{
			var container = this.__config.container;
			if(this.__parentContainerType.toLowerCase() === "table")
			{
				node.parentNode.removeChild(node);
			}
			else
			{
				//if not clone mode then element is already removed
				if(this.__config.enableCloneMode)
				{
					container.removeChild(node);
				}
			}
		}
		this.__initializeChildren();
	};
	
	NSDragDrop.prototype.__getTargetElementDetails = function(event,orignalNode)
	{
		var targetX = event.pageX - document.documentElement.scrollLeft;
	    var targetY = event.pageY - (window.pageYOffset || document.documentElement.scrollTop);
	    var targetElement = document.elementFromPoint(targetX, targetY);
	    var parent = null;
	    var childNodeType = null;
	    var arrElement = [];
	    var prevElement = null;
	    while(this.util.isElement(targetElement) && targetElement.tagName !== "HTML" && targetElement.tagName !== "BODY")
	    {
	    	if(targetElement === prevElement)
	    	{
	    		//console.log("Stop");
	    	}
	    	prevElement = targetElement;
	    	//console.log(targetElement.tagName + "," + targetElement.textContent);
	    	if(targetElement.tagName === this.__config.childNodeType)
	    	{
	    		childNodeType = targetElement;
	    	}
	    	else if(this.__parentContainerType.toLowerCase() === "table")
	    	{
	    		childNodeType = this.util.findParent(targetElement,this.__config.childNodeType);
	    		if(!childNodeType)
	    		{
	    			childNodeType = this.util.findChild(targetElement,this.__config.childNodeType);
	    		}
	    	}
	    	childNodeType = this.util.getWebComponentElement(childNodeType);
	    	if(childNodeType && childNodeType !== orignalNode && childNodeType["nsObject"] && childNodeType["nsObject"]["dropEnabled"])
	    	{
	    		targetElement = childNodeType;
	    		break;
	    	}
	    	arrElement.push({element:targetElement,display:targetElement.style.display});
	    	targetElement.style.display = "none";//pointerEvents = "none";
	    	
	    	targetElement = document.elementFromPoint(targetX, targetY);
	    }
	    for(var count = 0;count < arrElement.length;count++)
	    {
	    	arrElement[count].element.style.display = arrElement[count].display;//pointerEvents = "";
	    }
	    if(!this.util.isElement(targetElement) || targetElement.tagName === "HTML")
	    {
	    	targetElement = null;
	    }
	    if(targetElement)
	    {
	        if(!this.util.hasStyleClass(targetElement,this.__config.nodeDraggingClass))
	    	{
	        	//if not child then check parent
	        	var tmpTarget = targetElement.querySelector("." + this.__config.nodeDraggingClass);
	        	if(!tmpTarget)
	        	{
	        		tmpTarget = this.util.findParentBySelector(targetElement,"." + this.__config.nodeDraggingClass);
	        	}
	        	if(tmpTarget)
	        	{
	        		targetElement = tmpTarget;
	        	}
	    	}
	        if(targetElement["nsObject"] && targetElement["nsObject"]["parent"])
	    	{
	        	parent = targetElement["nsObject"]["parent"];
	    	}
	    }
	    return {element:targetElement,parent:parent,x:targetX,y:targetY};
	};
	
	NSDragDrop.prototype.__getPlaceholderDetails = function(event)
	{
		var targetX = event.pageX - document.documentElement.scrollLeft;
	    var targetY = event.pageY - (window.pageYOffset || document.documentElement.scrollTop);
		return {element:this.__compPlaceholder,parent:this.__compPlaceholder.parentNode,x:targetX,y:targetY};
	};
	
	NSDragDrop.prototype.__cloneNode = function(node)
	{
		var id = this.__getID();
		var divMovable = this.util.createDiv(id + "clonedItem", "nsDraggableCloneItem");
		var clonedNode = null;
		var rectContainer = this.__config.container.getBoundingClientRect();
		if(this.__config.createCloneCallback)
		{
			var containerConfiguration = {width:rectContainer.width,height:rectContainer.height};
			clonedNode = this.__config.createCloneCallback(node,containerConfiguration);
			clonedNode.setAttribute("id","comp" + id + "ClonedNode");
			divMovable.appendChild(clonedNode);
		}
		else
		{
			var container = this.__config.container.cloneNode(false);
			container.setAttribute("id","comp" + id + "ClonedContainer");
			if(this.__config.enableCloneMode)
			{
				clonedNode = node.cloneNode(true);
				clonedNode.setAttribute("id","comp" + id + "ClonedNode");
			}
			else
			{
				clonedNode = node;
			}
			container.appendChild(clonedNode);
			container.style.width = rectContainer.width + "px";
			try
			{
				divMovable.appendChild(container);
			}
			catch(error)
			{
				this.util.getWebComponentElement(divMovable).appendChild(container);
				//divMovable.appendChild(container);
			}
		}
		document.body.appendChild(divMovable);
		if (divMovable.setCapture) 
		{
			divMovable.setCapture();
		}
		if(node.nsObject)
		{
			var objCloned = {};//this.util.cloneObject(node.nsObject);
			objCloned.orignalNode = node;
			divMovable.nsObject = objCloned;
			clonedNode.nsObject = objCloned;
		}
		return divMovable;
	};
	
	NSDragDrop.prototype.__createPlaceholder = function(node) 
	{
		var placeHolder = null;
		if(this.__config.createPlaceholderCallback)
		{
			placeHolder = this.__config.createPlaceholderCallback(node);
		}
		else
		{
			placeHolder = this.util.createElement(this.__config.childNodeType);
			placeHolder.className  = node.className;
			this.util.addStyleClass(placeHolder,"nsDraggablePlaceholder");
			var rect = node.getBoundingClientRect();
			placeHolder.style.width = rect.width + "px";
			placeHolder.style.height = rect.height + "px";
		}
		return placeHolder;
	};
	
	NSDragDrop.prototype.__isNodeDraggable = function(node) 
	{
		var retValue = true;
		if(node)
		{
			if(this.__config.nodeDraggableCallback)
			{
				retValue = this.__config.nodeDraggableCallback(node);
			}
		}
		return retValue;
	};
	
	NSDragDrop.prototype.__isNodeDroppable = function(node) 
	{
		var retValue = true;
		if(node)
		{
			node = this.util.findParent(node,this.__config.childNodeType);
			if(this.__config.nodeDroppableCallback)
			{
				retValue = this.__config.nodeDroppableCallback(node);
			}
		}
		return retValue;
	};
	
	NSDragDrop.prototype.__insertBefore = function(targetElement) 
	{
		if(this.__compPlaceholder && targetElement)
		{
			// Ensure the placeholder is visible in the target (unless it's a table row)
		    if (this.util.getStyleValue(this.__compPlaceholder,"display") !== 'table-row') 
		    {
		    	this.__compPlaceholder.style.display = "block";
		    }
		    if(!this.__config.enableCloneMode)
		    {
		    	targetElement.parentNode.insertBefore(this.__compPlaceholder,targetElement);
			    //dragItemInfo.moveTo(targetScope.sortableScope, targetScope.index());
		    }
		}
	};
	
	NSDragDrop.prototype.__insertAfter = function(targetElement) 
	{
		if(this.__compPlaceholder && targetElement)
		{
			// Ensure the placeholder is visible in the target (unless it's a table row)
		    if (this.util.getStyleValue(this.__compPlaceholder,"display") !== 'table-row') 
		    {
		    	this.__compPlaceholder.style.display = "block";
		    }
		    if(!this.__config.enableCloneMode)
		    {
		    	this.util.insertAfterElement(targetElement,this.__compPlaceholder);
		    	//dragItemInfo.moveTo(targetScope.sortableScope, targetScope.index() + 1);
		    }
		    
		}
	};
	
	NSDragDrop.prototype.__getPlaceHolderIndex = function(targetElement) 
	{
		if(targetElement)
		{
			if(this.util.hasStyleClass(targetElement,"nsDraggablePlaceholder"))
			{
				return 0;
		    }
			var arrChildNode = targetElement.getElementsByTagName(this.__config.childNodeType);
			var childNode = null;
			for (var count = 0; count < arrChildNode.length; count++) 
			{
				childNode = arrChildNode[count];
				if(this.util.hasStyleClass(childNode,"nsDraggablePlaceholder"))
				{
					return count;
				}
			}
		}
	    return -1;
	};
	
	NSDragDrop.prototype.__isSameContainer = function(container) 
	{
		if(container && container.nsObject) 
		{
			return this.__config.container.nsObject["id"] === container.nsObject["id"];
		}
		return false;
	};
	
	NSDragDrop.prototype.__dragEndCleanUp = function() 
	{
		this.util.makeBodySelectable();
		this.__isDragging = false;
		if(this.__divMovable)
		{
			if(this.__divMovable["nsObject"] && this.__divMovable["nsObject"]["orignalNode"])
			{
				var orignalNode = this.__divMovable["nsObject"]["orignalNode"];
				this.util.removeStyleClass(orignalNode,this.__config.nodeDragHoverClass);
				this.util.removeStyleClass(orignalNode,this.__config.nodeDraggingClass);
			}
			this.__divMovable.parentNode.removeChild(this.__divMovable);
			this.__divMovable = null;
		}
		if(this.__lastTarget)
	    {
	    	this.util.removeStyleClass(this.__lastTarget,this.__config.nodeDragHoverClass);
	    	this.__lastTarget = null;
	    }
		if(this.__compPlaceholder)
		{
			this.__compPlaceholder.parentNode.removeChild(this.__compPlaceholder);
			this.__compPlaceholder = null;
		}
		this.__itemPosition = null;
		this.__objSelectedItem = {scrollableContainer:null,containment:null};
	};
	
	NSDragDrop.prototype.__getOffset = function(element,scrollableContainer) 
	{
		var boundingClientRect = element.getBoundingClientRect();
	    if (!scrollableContainer) 
	    {
	    	scrollableContainer = document.documentElement;
	    }
	    var retValue = { width: boundingClientRect.width || element.offsetWidth,
	    	height: boundingClientRect.height || element.offsetHeight,
	    	top: boundingClientRect.top + (window.pageYOffset || scrollableContainer.scrollTop - scrollableContainer.offsetTop),
	    	left: boundingClientRect.left + (window.pageXOffset || scrollableContainer.scrollLeft - scrollableContainer.offsetLeft)
	    };
	    return retValue;
	};
	
	NSDragDrop.prototype.__positionStarted = function(event,target,scrollableContainer) 
	{
		var position = {};
		position.offsetX = event.pageX - this.__getOffset(target, scrollableContainer).left;
		position.offsetY = event.pageY - this.__getOffset(target, scrollableContainer).top;
		position.startX = position.lastX = event.pageX;
		position.startY = position.lastY = event.pageY;
		position.nowX = position.nowY = position.distX = position.distY = position.dirAx = 0;
		position.dirX = position.dirY = position.lastDirX = position.lastDirY = position.distAxX = position.distAxY = 0;
	    return position;
	};
	
	NSDragDrop.prototype.__calculatePosition = function(position,event) 
	{
		 position.lastX = position.nowX;
	     position.lastY = position.nowY;
	
	     // mouse position this events
	     position.nowX = event.pageX;
	     position.nowY = event.pageY;
	
	     // distance mouse moved between events
	     position.distX = position.nowX - position.lastX;
	     position.distY = position.nowY - position.lastY;
	
	     // direction mouse was moving
	     position.lastDirX = position.dirX;
	     position.lastDirY = position.dirY;
	
	     // direction mouse is now moving (on both axis)
	     position.dirX = position.distX === 0 ? 0 : position.distX > 0 ? 1 : -1;
	     position.dirY = position.distY === 0 ? 0 : position.distY > 0 ? 1 : -1;
	
	     // axis mouse is now moving on
	     var newAx = Math.abs(position.distX) > Math.abs(position.distY) ? 1 : 0;
	
	     // calc distance moved on this axis (and direction)
	     if (position.dirAx !== newAx) 
	     {
	       position.distAxX = 0;
	       position.distAxY = 0;
	     } 
	     else 
	     {
	       position.distAxX += Math.abs(position.distX);
	       if (position.dirX !== 0 && position.dirX !== position.lastDirX) 
	       {
	         position.distAxX = 0;
	       }
	
	       position.distAxY += Math.abs(position.distY);
	       if (position.dirY !== 0 && position.dirY !== position.lastDirY) 
	       {
	         position.distAxY = 0;
	       }
	     }
	     position.dirAx = newAx;
	};
	
	NSDragDrop.prototype.__movePosition = function(event,element,position,container,cssPosition,scrollableContainer) 
	{
		var bounds;
	    var useRelative = (cssPosition === 'relative');
	    element.x = event.pageX - position.offsetX;
	    element.y = event.pageY - position.offsetY;
	
	    if (container) 
	    {
	      bounds = this.__getOffset(container, scrollableContainer);
	      if (useRelative) 
	      {
	        // reduce positioning by bounds
	        element.x -= bounds.left;
	        element.y -= bounds.top;
	
	        // reset bounds
	        bounds.left = 0;
	        bounds.top = 0;
	      }
	
	      if (element.x < bounds.left) 
	      {
	    	  element.x = bounds.left;
	      } 
	      else if (element.x >= bounds.width + bounds.left - this.__getOffset(element).width) 
	      {
	    	  element.x = bounds.width + bounds.left - this.__getOffset(element).width;
	      }
	      if (element.y < bounds.top) 
	      {
	    	  element.y = bounds.top;
	      } 
	      else if (element.y >= bounds.height + bounds.top - this.__getOffset(element).height) 
	      {
	    	  element.y = bounds.height + bounds.top - this.__getOffset(element).height;
	      }
	    }
	    element.style.left = element.x + 'px';
	    element.style.top = element.y + 'px';
	    
	    this.__calculatePosition(position, event);
	};
	
	NSDragDrop.prototype.__getID = function()
	{
		if(!this.__id)
		{
			if(this.__config.container.hasAttribute("id"))
			{
				this.__id = this.__config.container.getAttribute("id");
			}
			else if(this.__config.container.hasAttribute("name"))
			{
				this.__id = this.__config.container.getAttribute("name");
			}
			else
			{
				this.__id = "comp" + this.util.getUniqueId();
			}
		}
		return this.__id;
	};
	
	return NSDragDrop;
})();
nsModuleExport(__nsGlobal,"NSDragDrop",NSDragDrop);