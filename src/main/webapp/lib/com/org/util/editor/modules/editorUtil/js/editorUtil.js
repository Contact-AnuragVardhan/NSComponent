 var NSEditorUtil = (function()
{
	var NSEditorUtil = function(nsEditor)
	{
    	this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.selection = nsEditor.__selection;
		
		this.REGEX_BLOCK = /^(PRE|DIV|P|LI|H[1-6]|BLOCKQUOTE|TD|TH|TABLE|BODY|HTML|FIGCAPTION|FIGURE|DT|DD)$/i;
		this.REGEX_KEY_REMOVAL_TAGS = /^(IMG|BR|IFRAME|SCRIPT|INPUT|TEXTAREA|HR)$/i;
		this.REGEX_EMPTY_TAGS = /^(IMG|BR|IFRAME|SCRIPT|INPUT|TEXTAREA|HR|TABLE)$/i;
		this.SPACE_REG_EXP  = /[\s\n\t\r\uFEFF\u200b]+/g;
		this.SPACE_REG_EXP_START = /^[\s\n\t\r\uFEFF\u200b]+/g;
		this.SPACE_REG_EXP_END = /[\s\n\t\r\uFEFF\u200b]+$/g;
		this.INVISIBLE_SPACE =  '\uFEFF';
		this.INVISIBLE_SPACE_REG_EXP =  /[\uFEFF]/g;

		
		this.ZERO_WIDTH_SPACE = String.fromCharCode(8203),
		
		//isOrContains
		this.isExistsInsideEditor = function(node)
		{
			var textArea = this.__nsEditor.__getTextArea();
    		var parent = this.util.findParentByCallback(node,function(paramElement){
				return paramElement === textArea || (paramElement && paramElement.parentNode === textArea);
			},textArea);
    		return !this.util.isUndefinedOrNull(parent);
		};
		
		//closest
		this.getClosestElement = function(element,tags,root)
		{
			var condition;
	        if (typeof tags === 'function') 
	        {
	            condition = tags;
	        }
	        else if (tags instanceof RegExp) 
	        {
	            condition = function (tag) 
	            { 
	            	return tag && tags.test(tag.nodeName); 
	            };
	        }
	        else 
	        {
	            condition = function (tag) 
	            {
	                return tag && new RegExp('^(' + tags + ')$', 'i').test(tag.nodeName);
	            };
	        }
	        return this.util.findParentByCallback(element, condition, root);
		};
		
		this.isNode = function(element, win) 
		{
	        if (!element) 
	        {
	            return false;
	        }
	        if(!win)
	        {
	        	win = this.__nsEditor.__getWindow();
	        }
	        if (typeof win === 'object' && win && (typeof win.Node === 'function' || typeof win.Node === 'object')) 
	        {
	            return element instanceof win.Node;
	        }
	        return false;
	    };
		
		this.isBlock = function(element, win) 
		{
	        if(element && typeof element === "object")
	        {
	        	var isNode = this.isNode(element, win);
	        	var isBlock = this.REGEX_BLOCK.test(element.nodeName);
	        	if(isNode && !isBlock)
	        	{
	        		var display = this.util.getStyleValue(element,"display");
	        		if(display && display == "block")
	        		{
	        			isBlock = true;
	        		}
	        	}
	        	if(isNode && isBlock)
	        	{
	        		return true;
	        	}
	        }
	        return false; 
	    };
	    
	    //elementIsBlock
	    this.isTagBlock = function(tag) 
		{
	    	(tag && this.REGEX_BLOCK.test(tag));
		};
	    
	    this.isTable = function(element, win) 
	    {
	        return this.isNode(element, win) && /^(TABLE|THEAD|TBODY|TR|TH|TD)$/i.test(typeof element === 'string' ? element : element.nodeName);
	    }
		
	    this.isCell = function(element, win) 
	    {
	    	return this.isNode(element, win) && /^(td|th)$/i.test(typeof element === 'string' ? element : element.nodeName);
		};
		
		this.isImage = function(element, win) 
		{
		    return this.isNode(element, win) && /^(img|svg|picture|canvas)$/i.test(typeof element === 'string' ? element : element.nodeName);
		};
		
		//isMediaComponent
	    this.isCustomMedia = function(element)
	    {
	    	return element && (/nsEditorMediaContainerContainer/.test(element.className));
	    };
	    
	    //isComponent
	    this.isCustomMediaOrTable = function(element) 
	    {
	        return element && (this.isCustomMedia(element) || /^(TABLE|HR)$/.test(element.nodeName));
	    };

	    this.isFormatElement = function(element) 
	    {
	    	return element && element.nodeType == 1 && /^(P|DIV|H[1-6]|PRE|LI|TH|TD)$/i.test(element.nodeName) && !this.isCustomMediaOrTable(element) && !this.containsNode(element,"div");
	    };
	    
	    this.isRangeFormatElement = function(element) 
	    {
	        return element && element.nodeType === 1 && (/^(BLOCKQUOTE|OL|UL|FIGCAPTION|TABLE|THEAD|TBODY|TR|TH|TD)$/i.test(element.nodeName));
	    };
	    
	    this.isMedia = function(node) 
	    {
	        return node && /^(IMG|IFRAME|AUDIO|VIDEO|CANVAS)$/i.test(typeof node === 'string' ? node : node.nodeName);
	    };
	    
	    this.isBreak = function (node) 
	    {
	        return node && /^BR$/i.test(typeof node === 'string' ? node : node.nodeName);
	    };
	    
	    this.isList = function (node) 
	    {
	    	 return node && /^(OL|UL)$/i.test(typeof node === 'string' ? node : node.nodeName);
	    };
	    
	    this.isListCell = function (node) 
	    {
	    	return node && /^LI$/i.test(typeof node === 'string' ? node : node.nodeName);
	    };
	    
	    this.isAnchor = function(node) 
	    {
	    	return node && /^A$/i.test(typeof node === 'string' ? node : node.nodeName);
	    };
	    
	    this.trim = function(value) 
	    {
	    	return value.replace(this.SPACE_REG_EXP_END, "").replace(this.SPACE_REG_EXP_START, "");
	    };
		
		this.getOffset = function(element,recursive,doc) 
		{
			recursive = Boolean.parse(recursive);
			doc = doc ? doc : this.__nsEditor.__getDocument();
			var body = doc.body;
			var win = doc.defaultView || doc.parentWindow;
			var docElem = doc.documentElement || {clientTop: 0,clientLeft: 0,scrollTop: 0,scrollLeft: 0};
		    var scrollTop = win.pageYOffset || docElem.scrollTop || body.scrollTop;
		    var scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		    var clientTop = docElem.clientTop || body.clientTop || 0;
		    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		    var topValue = null;
		    var leftValue = null;
		    var rect = element.getBoundingClientRect();
		    if(!recursive && !this.__nsEditor.__isModeTextArea())
		    {
		    	 var offset = this.getOffset(this.__nsEditor.__compTextArea,true);
		         topValue = rect.top + offset.top;
		         leftValue = rect.left + offset.left;
		    }
		    else
		    {
		    	topValue = rect.top + scrollTop - clientTop;
		        leftValue = rect.left + scrollLeft - clientLeft;
		    }
		    return {
		        top: Math.round(topValue),
		        left: Math.round(leftValue),
		        width: rect.width,
		        height: rect.height
		    };
		};
		
		this.getOffsetFromEditor = function(element,textArea,doc) 
		{
			textArea = textArea ? textArea : this.__nsEditor.__getTextArea();
			var offsetLeft = 0;
	        var offsetTop = 0;
	        var offsetElement = element.nodeType === 3 ? element.parentElement : element;

	        while (offsetElement && !this.util.hasStyleClass(offsetElement,"nsEditor") && offsetElement !== textArea) 
	        {
	            offsetLeft += offsetElement.offsetLeft;
	            offsetTop += offsetElement.offsetTop;
	            offsetElement = offsetElement.offsetParent;
	        }
	        var iframe = !this.__nsEditor.__isModeTextArea();
	        return {
	            left: offsetLeft + (iframe ? textArea.offsetLeft : 0),
	            top: (offsetTop - textArea.scrollTop) + (iframe ? textArea.parentElement.offsetTop : 0)
	        };
		};
		
		this.getContentWidth = function(element,win) 
		{
		    var getValue = function (value) 
		    {
		    	if(value)
		    	{
		    		return parseInt(value, 10);
		    	}
		    	return 0;
		    };
		    var style = win.getComputedStyle(element);
		    var width = element.offsetWidth;
		    var paddingLeft = getValue(style.getPropertyValue("padding-left"));
		    var paddingRight = getValue(style.getPropertyValue("padding-right"));
		    return (width - paddingLeft - paddingRight);

		};
		
		this.isEditable = function(element) 
		{
			element = element ? element : this.__nsEditor.__getTextArea();
	        if(element && element.nodeType === 1 && Boolean.parse(element.getAttribute("contenteditable")))
	        {
	        	return true;
	        }
	        return false;
	    };
	    
	    this.isNonEditable = function (element) 
	    {
	        return element && element.nodeType === 1 && !Boolean.parse(element.getAttribute("contenteditable"));
	    };
	    
	    this.isEmptyTextNode = function(node) 
	    {
	        if((this.util.isTextNode(node) && (!node.nodeValue || node.nodeValue.replace(this.INVISIBLE_SPACE_REG_EXP, "") .length === 0)))
	        {
	        	return true;
	        }
	        return false;
	    };
	    
	    this.isEmptyNode = function(node,regexNonEmptyTags) 
	    {
	    	if(!node) 
			{
	            return true;
	        }
			if(this.util.isTextNode(node))
			{
				return node.nodeValue === null || node.nodeValue.trim().length === 0;
			}
			regexNonEmptyTags = regexNonEmptyTags || /^(img|svg|canvas|input|textarea|form)$/;
			if(regexNonEmptyTags.test(node.nodeName.toLowerCase()))
			{
				return false;
			}
			var self = this;
			var value = this.util.loopAllChildren(node,function(paramNode) 
			{
                if ((self.util.isTextNode(paramNode) && paramNode.nodeValue !== null &&
                    paramNode.nodeValue.trim().length !== 0) ||
                    (self.util.isElement(paramNode) && regexNonEmptyTags.test(paramNode.nodeName.toLowerCase()))) 
                {
                    return false;
                }
            });
			return value;
	    };
	    
	    //to find whether element is a node related to the text style
	    this.isTextStyleElement = function (element) 
	    {
	        return element && element.nodeType !== 3 && /^(strong|span|font|b|var|i|em|u|ins|s|strike|del|sub|sup|mark|a|label|code)$/i.test(element.nodeName);
	    };
	    
	    this.getCharLength = function(content,charCounterType) 
	    {
            return /byte/.test(charCounterType) ? this.getByteLength(content) : content.length;
        }
	    
	    this.getByteLength = function(strExp) 
	    {
	    	var win = this.__nsEditor.__getWindow();
	    	var browserDetail = this.__nsEditor.__browserDetail;
	        var encoder = win.encodeURIComponent;
	        var cr = 0;
	        var cl;
	        //edge
	        if (browserDetail.isIE && !browserDetail.isMSIE) 
	        {
	            cl = win.unescape(encoder(strExp.toString())).length;
	            if (encoder(strExp.toString()).match(/(%0A|%0D)/gi) !== null) 
	            {
	                cr = encoder(strExp.toString()).match(/(%0A|%0D)/gi).length;
	            }
	        } 
	        else 
	        {
	            cl = (new win.TextEncoder('utf-8').encode(strExp.toString())).length;
	        }
	        if (encoder(strExp.toString()).match(/(%0A|%0D)/gi) !== null) 
            {
                cr = encoder(strExp.toString()).match(/(%0A|%0D)/gi).length;
            }
            return cl + cr;
	    }
	    
	    this.compareElements = function(element1, element2) 
	    {
	    	var objRet = {};
	        var ele1 = element1;
	        var bNode = element2;
	        while (ele1 && ele2 && ele1.parentNode !== ele2.parentNode) 
	        {
	            ele1 = ele1.parentNode;
	            ele2 = ele2.parentNode;
	        }
	        if (!ele1 || !ele2) 
	        {
	        	objRet = {ancestor: null,element1: element1,element2: element2, result: 0};
	        }
	        else 
	        {
	        	var children = ele1.parentNode.childNodes;
		        var aIndex = this.getIndexFromArray(children, ele1);
		        var bIndex = this.getIndexFromArray(children, ele2);
		        var result = aIndex > bIndex ? 1 : aIndex < bIndex ? -1 : 0;
		        objRet = {ancestor: ele1.parentNode,element1: element1,element2: element2,result: result};
	        }
	        return objRet;
	    };
	    
	    this.getIndexFromArray = function(arrData,value) 
	    {
	    	var index = arrData.findIndex(function(paramValue,index,arr){
	    		if(paramValue == value)
	    		{
	    			return true;
	    		}
	    	});
	    	return index;
	    };
	    
	    this.setElementPosition = function(controller, referEl, position, offset)
	    {
	    	var rtl = false;
	    	offset = offset ? offset :  {left: 0, top: 0};
	    	var body = this.__nsEditor.__getTextArea();
	    	if (rtl)
	    	{
	    		offset.left *= -1;
	    	}
            var offset = this.getOffsetFromEditor(referEl,body);
            controller.style.visibility = 'hidden';
            controller.style.display = 'block';

            // Height value of the arrow element is 11px
            var topMargin = position === 'top' ? -(controller.offsetHeight + 2) : (referEl.offsetHeight + 12);
            controller.style.top = (offset.top + topMargin + offset.top) + 'px';

            var l = offset.left - body.scrollLeft + offset.left;
            var controllerW = controller.offsetWidth;
            var referElW = referEl.offsetWidth;

            // rtl (Width value of the arrow element is 22px)
            if (rtl) 
            {
                var rtlW = (controllerW > referElW) ? controllerW - referElW : 0;
                var rtlL = rtlW > 0 ? 0 : referElW - controllerW;
                controller.style.left = (l - rtlW + rtlL) + 'px';
                
                if (rtlW > 0) 
                {
                    controller.firstElementChild.style.left = ((controllerW - 14 < 10 + rtlW) ? (controllerW - 14) : (10 + rtlW)) + 'px';
                }
                
                var overSize = body.offsetLeft - controller.offsetLeft;
                if (overSize > 0) 
                {
                    controller.style.left = '0px';
                    controller.firstElementChild.style.left = overSize + 'px';
                }
            } 
            else 
            {
                controller.style.left = l + 'px';

                var overSize = body.offsetWidth - (controller.offsetLeft + controllerW);
                if (overSize < 0) 
                {
                    controller.style.left = (controller.offsetLeft + overSize) + 'px';
                    //controller.firstElementChild.style.left = (20 - overSize) + 'px';
                } 
                else 
                {
                    //controller.firstElementChild.style.left = '20px';
                }
            }

            controller.style.visibility = '';
	    };
	    
	    this.stopEvent = function(event)
	    {
	    	event = this.util.getEvent(event);
	    	event.preventDefault();
	    	event.stopPropagation();
	    	event.stopImmediatePropagation();
	    };
	    
	    //isWysiwygDiv
	    this.containsNode = function (node,type) 
	    {
	    	if(node)
	    	{
	    		var textArea = this.__nsEditor.__getTextArea();
	    		if(textArea.contains(node))
	    		{
	    			if(type)
	    			{
	    				return this.util.isElementOfType(node,type);
	    			}
	    			else
	    			{
	    				return true;
	    			}
	    		}
	    	}
	        return false;
	    };
	    
	    this.onlyZeroWidthSpace = function(text) 
	    {
	    	var onlyZeroWidthRegExp = new RegExp('^' + String.fromCharCode(8203) + '+$');
	        if (typeof text !== 'string')
	        {
	        	text = text.textContent;
	        }
	        return text === '' || onlyZeroWidthRegExp.test(text);
	    };
	    
	    this.getFormatElement = function(element,callback) 
	    {
	        if (element)
	        {
		        while (element) 
		        {
		            if (this.containsNode(element,"div"))
		            {
		            	return null;
		            }
		            if (this.isRangeFormatElement(element))
		            {
		            	element.firstElementChild;
		            }
		            if (this.isFormatElement(element))
		            {
		            	if(!callback || callback(element))
		            	{
		            		return element;
		            	}
		            }
		            element = element.parentNode;
		        }
	        }
	        return null;
	    };
	    
	    //safeRemove
	    this.removeNode = function(node) 
	    {
	    	if (node && node.parentNode)
	    	{
	    		node.parentNode.removeChild(node);
	    	}
	    };
	    
	    this.isIgnoreNodeChange = function (element) 
	    {
	        return element && element.nodeType !== 3 && (this.isNonEditable(element) || !this.isTextStyleElement(element));
	    };
	    
	    //wrap
	    this.wrapNode = function(currentNode,newParent)
	    {
			if(currentNode.parentNode) 
			{
				var doc = this.__nsEditor.__getDocument();
				var wrapper = this.util.isString(newParent) ? this.util.createElement(tag,null,null,doc) : newParent;
				this.selection.saveSelection();
				currentNode.parentNode.insertBefore(wrapper,currentNode);
				wrapper.appendChild(currentNode);
				this.selection.restoreSelection();
				return wrapper;
			}
	    };
	    
	    //wrapInline
	    this.wrapAllInlineSiblings = function (node,tag) 
	    {
	    	this.selection.saveSelection();
	    	var doc = this.__nsEditor.__getDocument();
	    	var win = this.__nsEditor.__getWindow();
	    	var textArea = this.__nsEditor.__getTextArea();
	        var startNode = node;
	        var endNode = node;
	        var findNext = false;
	        do 
	        {
	            findNext = false;
	            var tmpNode = startNode.previousSibling;
	            if (tmp && !this.isBlock(tmp,win)) 
	            {
	                findNext = true;
	                startNode = tmpNode;
	            }
	        } 
	        while(findNext);
	        do 
	        {
	            findNext = false;
	            var tmpNode = endNode.nextSibling;
	            if (tmpNode && !this.isBlock(tmp,win)) 
	            {
	                findNext = true;
	                endNode = tmpNode;
	            }
	        } 
	        while(findNext);
	        var parent = this.util.isString(tag) ? doc.createElement(tag) : tag;
	        if (startNode.parentNode) 
	        {
	            startNode.parentNode.insertBefore(parent,startNode);
	        }
	        var nextNode = startNode;
	        while(nextNode) 
	        {
	        	nextNode = startNode.nextSibling;
	            parent.appendChild(startNode);
	            if (startNode === endNode || !nextNode) 
	            {
	                break;
	            }
	            startNode = nextNode;
	        }
	        this.selection.restoreSelection();
	        return parent;
	    };
	    
	    //normalizeNode
	    this.mergeTextNodes = function(node)
	    {
	    	if(node)
	    	{
	    		if (this.util.isTextNode(node) && node.nodeValue != null && node.parentNode) 
	    		{
	    			while (this.util.isTextNode(node.nextSibling)) 
	    			{
	    				if (node.nextSibling.nodeValue != null) 
	    				{
	    					node.nodeValue += node.nextSibling.nodeValue;
	    				}
	    				node.nodeValue = node.nodeValue.replace(this.INVISIBLE_SPACE_REG_EXP,"");
	    				this.removeNode(node.nextSibling);
	    			}
	    		} else 
	    		{
	    			this.mergeTextNodes(node.firstChild);
	    		}
	    		this.mergeTextNodes(node.nextSibling);
	    	}
	    };
	    
	    this.insertNodeWrappingRange = function(node)
	    {
	    	if(node)
	    	{
	    		if(!this.selection)
	    		{
	    			this.selection = this.__nsEditor.__selection;
	    		}
	    		if(this.selection.isCollapsed())
				{
					this.selection.insertNode(node,false,false);
				}
				else
				{
					var range = this.selection.getRange();
					var fragment = range.extractContents();
					node.appendChild(fragment);
					range.insertNode(node);
				}
	    	}
	    }
	    
    };
	
	return NSEditorUtil;
})();
nsModuleExport(__nsGlobal,"NSEditorUtil",NSEditorUtil);