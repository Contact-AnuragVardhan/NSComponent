//getRange_addLine
    NSEditor.prototype.__getNonEditableRange = function(range,container) 
    {
        if (this.__isValidSelection(range)) 
        {
            var textArea = this.__getTextArea();
            var element = this.util.getElementFromHtml(this.__defaultContent);
            textArea.insertBefore(element, container && container != textArea ? container.nextElementSibling : textArea.firstElementChild);
            this.__setRange(element.firstElementChild, 0,element.firstElementChild, 1);
            range = this.__objSelection.selectionNode;
        }
        return range;
    };
    
  //_selectionVoid
    NSEditor.prototype.__isValidSelection = function(range) 
    {
    	var editorUtil = this.editorUtil;
        var cac = range.commonAncestorContainer;
        return (editorUtil.containsNode(range.startContainer,"div") && editorUtil.containsNode(range.endContainer,"div")) || /FIGURE/i.test(cac.nodeName) 
        		|| editorUtil.isMedia(cac) || editorUtil.isCustomMedia(cac);
    };
    
    NSEditor.prototype.__insertNode = function(element,addAfterElement,checkCharCount) 
	{
		if (checkCharCount && !this.__checkCharCount(element, null)) 
		{
            return null;
        }
		var editorUtil = this.editorUtil;
		var textArea = this.__getTextArea();
		var doc = this.__getDocument();
		var self = this;
        var isFormats = ((editorUtil.isFormatElement(element) || editorUtil.isRangeFormatElement(element))) || editorUtil.isCustomMediaOrTable(element);

        if (!addAfterElement && isFormats) 
        {
            var range = this.__getRange();
            if (range.startOffset !== range.endOffset || range.startContainer !== range.endContainer) 
            {
                var item = this.__removeNode();
                if (item.container.nodeType === 3 || editorUtil.isBreak(item.container)) 
                {
                    var depthFormat = this.nsUtil.findParent(item.container,function(paramElement) 
                    { 
                    	return editorUtil.isRangeFormatElement(paramElement) || editoreditoreditorUtil.isListCell(paramElement);
                    },null,textArea);
                    addAfterElement = editorUtil.splitElement(item.container,item.offset, !depthFormat ? 0 : editorUtil.getElementDepth(depthFormat) + 1);
                    if (addAfterElement)
                    {
                    	addAfterElement = addAfterElement.previousSibling;
                    }
                }
            }
        }

        var range = (!addAfterElement && !isFormats) ? this.__getNonEditableRange(this.__getRange(), null) : this.__getRange();
        var commonCon = range.commonAncestorContainer;
        var startOff = range.startOffset;
        var endOff = range.endOffset;
        var formatRange = range.startContainer === commonCon && editorUtil.isFormatElement(commonCon);
        var startCon = formatRange ? commonCon.childNodes[startOff] : range.startContainer;
        var endCon = formatRange ? commonCon.childNodes[endOff] : range.endContainer;
        var parentNode, originAfter = null;
        if (!addAfterElement) 
        {
            parentNode = startCon;
            if (startCon.nodeType === 3) 
            {
                parentNode = startCon.parentNode;
            }
            //No Select range node 
            if (range.collapsed) 
            {
                if (commonCon.nodeType === 3) 
                {
                    if (commonCon.textContent.length > endOff) 
                    {
                    	addAfterElement = commonCon.splitText(endOff);
                    }
                    else 
                    {
                    	addAfterElement = commonCon.nextSibling;
                    }
                } 
                else 
                {
                    if (!editorUtil.isBreak(parentNode)) 
                    {
                        var c = parentNode.childNodes[startOff];
                        var focusNode = (c && c.nodeType === 3 && editorUtil.onlyZeroWidthSpace(c) && editorUtil.isBreak(c.nextSibling)) ? c.nextSibling : c;
                        if (focusNode) 
                        {
                            if (!focusNode.nextSibling) 
                            {
                                parentNode.removeChild(focusNode);
                                addAfterElement = null;
                            } 
                            else 
                            {
                                addAfterElement = (editorUtil.isBreak(focusNode) && !editorUtil.isBreak(element)) ? focusNode : focusNode.nextSibling;
                            }
                        } 
                        else 
                        {
                            addAfterElement = null;
                        }
                    } 
                    else 
                    {
                        addAfterElement = parentNode;
                        parentNode = parentNode.parentNode;
                    }
                }
            } 
            else 
            { 
            	// Select range nodes
                var isSameContainer = (startCon === endCon);
                if (isSameContainer) 
                {
                    if (this.__isEdgePoint(endCon, endOff))
                    {
                    	addAfterElement = endCon.nextSibling;
                    }
                    else 
                    {
                    	addAfterElement = endCon.splitText(endOff);
                    }
                    var removeNode = startCon;
                    if (!this.__isEdgePoint(startCon, startOff))
                    {
                    	removeNode = startCon.splitText(startOff);
                    }
                    parentNode.removeChild(removeNode);
                    if (parentNode.childNodes.length === 0 && isFormats) 
                    {
                        parentNode.innerHTML = '<br>';
                    }
                }
                else 
                {
                    var removedTag = this.__removeNode();
                    var container = removedTag.container;
                    var prevContainer = removedTag.prevContainer;
                    if (container && container.childNodes.length === 0 && isFormats) 
                    {
                        if (editorUtil.isFormatElement(container)) 
                        {
                            container.innerHTML = '<br>';
                        } 
                        else if (editorUtil.isRangeFormatElement(container)) 
                        {
                            container.innerHTML = this.__defaultContent;
                        }
                    }
                    if (!isFormats && prevContainer) 
                    {
                        parentNode = (prevContainer.nodeType == 3) ? prevContainer.parentNode : prevContainer;
                        if (parentNode.contains(container)) 
                        {
                            addAfterElement = container;
                            while (addAfterElement.parentNode === parentNode) 
                            {
                                addAfterElement = addAfterElement.parentNode;
                            }
                        } 
                        else 
                        {
                            addAfterElement = null;
                        }
                    } 
                    else 
                    {
                        parentNode = isFormats ? commonCon : container;
                        addAfterElement = isFormats ? endCon : null;
                    }
                    while (addAfterElement && !editorUtil.isFormatElement(addAfterElement) && addAfterElement.parentNode !== commonCon) 
                    {
                        addAfterElement = addAfterElement.parentNode;
                    }
                }
            }
        }
        // has addAfterElement
        else 
        {
            parentNode = addAfterElement.parentNode;
            addAfterElement = addAfterElement.nextSibling;
            originAfter = true;
        }
        // --- insert node ---
        try 
        {
            if (editorUtil.isFormatElement(element) || editorUtil.isRangeFormatElement(element) || 
            	(!editorUtil.isListCell(parentNode) && editorUtil.isCustomMediaOrTable(element))) 
            {
                var oldParent = parentNode;
                if (editorUtil.isList(addAfterElement)) 
                {
                    parentNode = addAfterElement;
                    addAfterElement = null;
                } 
                else if (editorUtil.isListCell(addAfterElement)) 
                {
                    parentNode = addAfterElement.previousElementSibling || addAfterElement;
                } 
                else if (!originAfter && !addAfterElement) 
                {
                    var item = this.__removeNode();
                    var container = item.container.nodeType === 3 ? (editorUtil.isListCell(editorUtil.getFormatElement(item.container, null)) ? 
                    		item.container : (editorUtil.getFormatElement(item.container, null) || item.container.parentNode)) : item.container;
                    var rangeCon = editorUtil.containsNode(container,"div") || editorUtil.isRangeFormatElement(container);
                    parentNode = rangeCon ? container : container.parentNode;
                    addAfterElement = rangeCon ? null : container.nextSibling;
                }
                if (oldParent.childNodes.length === 0 && parentNode !== oldParent)
                {
                	editorUtil.removeItem(oldParent);
                }
            }

            if (isFormats && !editorUtil.isRangeFormatElement(parentNode) && !editorUtil.isListCell(parentNode) 
            		&& !editorUtil.containsNode(parentNode,"div")) 
            {
                addAfterElement = parentNode.nextElementSibling;
                parentNode = parentNode.parentNode;
            }
            parentNode.insertBefore(element, parentNode === addAfterElement ? parentNode.lastChild : addAfterElement);
        } 
        catch (error) 
        {
            parentNode.appendChild(element);
        } 
        finally 
        {
            //if (freeFormat && (editorUtil.isFormatElement(element) || editorUtil.isRangeFormatElement(element))) 
            //{
              //  element = this.__setIntoFreeFormat(element);
            //}

            if (!editorUtil.isCustomMediaOrTable(element)) 
            {
                var offset = 1;
                if (element.nodeType === 3) 
                {
                    var previous = element.previousSibling;
                    var next = element.nextSibling;
                    var previousText = (!previous ||  previous.nodeType === 1 || editorUtil.onlyZeroWidthSpace(previous)) ? "" : previous.textContent;
                    var nextText = (!next || next.nodeType === 1 || editorUtil.onlyZeroWidthSpace(next)) ? "" : next.textContent;
                    if (previous && previousText.length > 0) 
                    {
                        element.textContent = previousText + element.textContent;
                        editorUtil.removeItem(previous);
                    }
                    if (next && next.length > 0) 
                    {
                        element.textContent += nextText;
                        editorUtil.removeItem(next);
                    }

                    var newRange = {
                        container: element,
                        startOffset: previousText.length,
                        endOffset: element.textContent.length - nextText.length
                    };
                    this.__setRange(element, newRange.startOffset, element, newRange.endOffset);
                    return newRange;
                } 
                else if (!editorUtil.isBreak(element) && editorUtil.isFormatElement(parentNode)) 
                {
                    var zeroWidth = null;
                    if (!element.previousSibling || editorUtil.isBreak(element.previousSibling)) 
                    {
                        zeroWidth = doc.createTextNode(editorUtil.ZERO_WIDTH_SPACE);
                        element.parentNode.insertBefore(zeroWidth, element);
                    }
                    if (!element.nextSibling || editorUtil.isBreak(element.nextSibling)) 
                    {
                        zeroWidth = doc.createTextNode(editorUtil.ZERO_WIDTH_SPACE);
                        element.parentNode.insertBefore(zeroWidth, element.nextSibling);
                    }
                    if (editorUtil.isIgnoreNodeChange(element)) 
                    {
                        element = element.nextSibling;
                        offset = 0;
                    }
                }
                this.__setRange(element, offset, element, offset);
            }
        }
        //this.history.push(true);
        return element;

	};
	
	NSEditor.prototype.__removeNode = function() 
	{
		var itemRet = {container: null,offset: offset,prevContainer: null};
		return itemRet;
	};
	
	NSEditor.prototype.__isEdgePoint = function(container, offset) 
    {
        return (offset === 0) || (!container.nodeValue && offset === 1) || (offset === container.nodeValue.length);
    };
    
    NSEditor.prototype.__setIntoFreeFormat = function(node) 
    {
        var parentNode = node.parentNode;
        let nodeChildren, lastNode;
        var editorUtil = this.editorUtil;
        
        while (editorUtil.isFormatElement(node) || editorUtil.isRangeFormatElement(node)) 
        {
            nodeChildren = node.childNodes;
            lastNode = null;
            while (nodeChildren[0]) 
            {
                lastNode = nodeChildren[0];
                if (editorUtil.isFormatElement(lastNode) || editorUtil.isRangeFormatElement(lastNode)) 
                {
                    this.__setIntoFreeFormat(lastNode);
                    if (!node.parentNode)
                    {
                    	break;
                    }
                    nodeChildren = node.childNodes;
                    continue;
                }
                parentNode.insertBefore(lastNode, node);
            }
            
            if (node.childNodes.length === 0)
            {
            	editorUtil.removeItem(node);
            }
            node = this.util.createElement("br");
            parentNode.insertBefore(node, lastNode.nextSibling);
        }
        return node;
    };
    
    NSEditor.prototype.__getRange = function() 
    {
        var range = this.__objSelection.range || this.__createDefaultRange();
        var selection = this.__getSelection();
        var body = this.__getTextArea();
        if (range.collapsed === selection.isCollapsed || !body.contains(selection.focusNode)) 
        {
        	return range;
        }
        if (selection.rangeCount > 0) 
        {
        	this.__objSelection.range = selection.getRangeAt(0);
            return this.__objSelection.range;
        } 
        else 
        {
            var anchorNode = selection.anchorNode;
            var focusNode = selection.focusNode;
            var anchorOffset = selection.anchorOffset;
            var focusOffset = selection.focusOffset;
            var compareValue = this.editorUtil.compareElements(anchorNode,focusNode);
            var rightDir = compareValue.ancestor && (compareValue.result === 0 ? anchorOffset <= focusOffset : compareValue.result > 1 ? true : false);
            return this.__setRange(
                rightDir ? anchorNode : focusNode,
                rightDir ? anchorOffset : focusOffset,
                rightDir ? focusNode : anchorNode,
                rightDir ? focusOffset : anchorOffset
            );
        }
    };
    
    NSEditor.prototype.__setRange = function(startContainer,startOffset,endContainer,endOffset) 
    {
    	if (startContainer && endContainer)
    	{
    		if (startOffset > startContainer.textContent.length) 
    		{
    			startOffset = startContainer.textContent.length;
    		}
            if (endOffset > endContainer.textContent.length)
            { 
            	endOffset = endContainer.textContent.length;
            }
            var range = this.__createRange();
            try 
            {
                range.setStart(startContainer, startOffset);
                range.setEnd(endContainer, endOffset);
            } 
            catch (error) 
            {
                this.__setFocusOnControl();
                return;
            }
            var selection = this.__getSelection();
            if (selection.removeAllRanges) 
            {
                selection.removeAllRanges();
            }
            selection.addRange(range);
            this.__setSelectedNode();
            if (!this.__isModeTextArea()) 
            {
            	this.__setFocusOnControl();
            }
            return range;
    	}
    	return null;
    };
    
  //__editorRange
	NSEditor.prototype.__setSelectedNode = function() 
	{
        var selection = this.__getSelection();
        if (!selection) 
        {
        	return null;
        }
        var range = null;
        var selectionNode = null;
        if (selection.rangeCount > 0) 
        {
            range = selection.getRangeAt(0);
        } 
        else 
        {
            range = this.__createDefaultRange();
        }
        this.__objSelection.range = range;
        if (range.collapsed) 
        {
            selectionNode = range.commonAncestorContainer;
        } 
        else 
        {
            selectionNode = selection.extentNode || selection.anchorNode;
        }
        this.__objSelection.selectionNode = selectionNode;
    };