/*NSEditor.prototype.__saveSelection = function()
	{
		this.__selectedRange = this.__getInternalRange();
	};*/


/*NSEditor.prototype.__restoreSelection = function() 
	{
		var selection = null;
		var self = this;
		var setTextRange = function(win,doc)
		{
			if(win.getSelection || doc.createRange) 
			{
				selection = win.getSelection();
			    if (self.__selectedRange) 
			    {
			        try 
			        {
			        	selection.removeAllRanges();
			        } 
			        catch (error) 
			        {
			        	doc.body.createTextRange().select();
			        	if(doc.selection)
			        	{
			        		doc.selection.empty();
			        	}
			        }
			        selection.addRange(self.__selectedRange);
			     }
			} 
			else if (doc.selection && self.__selectedRange) 
			{
				self.__selectedRange.select();
			}
		};
		if(this.__isModeTextArea())
		{
			setTextRange(this.__context,this.__dom.doc);
		}
		else
		{
			setTextRange(this.__frameContentWindow,this.__frameContentDoc);
		}
	};
	
	NSEditor.prototype.__createRange = function() 
	{
		var doc = this.__getDocument();
		var range = doc.createRange();
		return range;
	};
	
	NSEditor.prototype.__selectRange = function(range) 
	{
		var selection = this.__getInternalSelection();
		if (selection) 
		{
			selection.removeAllRanges();
			selection.addRange(range);
		}
		this.__dispatchInternalEvent("selectionchange",{range:range},{range:range});
	};
	
	NSEditor.prototype.__getInternalRange = function() 
	{
		var selection = this.__getInternalSelection();
		if (selection) 
		{
			if (selection.rangeCount && selection.rangeCount > 0) 
			{
				return selection.getRangeAt(0);
			} 
			else if (selection.createRange) 
			{
				return selection.createRange();
			}
		}
		return null;
	};

	NSEditor.prototype.__getInternalSelection = function() 
	{
		if(this.__isModeTextArea())
		{
			if (this.__context.getSelection) 
			{
				return this.__context.getSelection();
			} 
			else if (this.__dom.doc.selection) 
			{
			   return this.__dom.doc.selection;
			}
		}
		else
		{
			if (this.__compTextArea.contentWindow) 
			{
				if (this.__compTextArea.contentWindow.getSelection) 
				{
					return this.__compTextArea.contentWindow.getSelection();
				}
				if (this.__compTextArea.contentWindow.selection) 
				{
					return this.__compTextArea.contentWindow.selection;
				}
			}
			if (this.__frameContentDoc.getSelection) 
			{
				return this.__frameContentDoc.getSelection();
			}
			if (this.__frameContentDoc.selection) 
			{
				return this.__frameContentDoc.selection;
			}
		}
		return null;
	};*/

	/*NSEditor.prototype.__getRange = function() 
	{
		//var selection = (this.__context.getSelection) ? this.__context.getSelection() : this.__context.document.selection;
		var selection = this.__getInternalSelection();
		if (selection) 
		{
			if (selection.rangeCount && selection.rangeCount > 0) 
			{ 
				selection.getRangeAt(0);
			} 
			else if (selection.createRange)
			{
				return selection.createRange();
			}
		}
		return null;
	};*/
	
    /*NSEditor.prototype.__getSelection = function()
    {
    	var win = this.__getWindow();
    	return win.getSelection();
    };*/
    
    
    /*NSEditor.prototype.__createDefaultRange = function() 
    {
        this.__setFocusOnControl(true);
        var range = this.__createRange();
        var body = this.__getTextArea();
        var focusElement = body.firstElementChild;
        if (!focusElement) 
        {
        	body.innerHTML = this.__config.defaultValue;
        	focusElement = body.firstElementChild;
        }
        range.setStart(focusElement, 0);
        range.setEnd(focusElement, 0);
        return range;
    };*/


/*NSEditor.prototype.__selectElement = function(node,isInward) 
	{
		if(node)
		{
			isInward = Boolean.parse(isInward);
			var textArea = this.__getTextArea();
			var isExistsInside =  this.editorUtil.loopParents(node,function(paramElement){
										return paramElement === textArea || (paramElement && paramElement.parentNode === textArea);
									},textArea);
			if(isExistsInside)
			{
				var range = this.__createRange();
			    range[isInward ? 'selectNodeContents' : 'selectNode'](node);
			    this.__selectRange(range);
			}
			else
			{
				this.util.warning("NSEditor","Node element must be in editor");
			}
		}
	};
	
	NSEditor.prototype.__isCollapsed = function() 
	{
		var selection = this.__getInternalSelection();
		if(selection)
		{
			for (var count = 0; count < selection.rangeCount; count++) 
			{
	            if (!selection.getRangeAt(count).collapsed) 
	            {
	                return false;
	            }
	        }
		}
        return true;
    };
    
    NSEditor.prototype.__setCursorAfter = function(node) 
	{
    	if(node)
    	{
    		var textArea = this.__getTextArea();
    		var isExistsInside =  this.editorUtil.loopParents(node,function(paramElement){
				return paramElement === textArea || (paramElement && paramElement.parentNode === textArea);
			},textArea);
			if(isExistsInside)
			{
				var range = this.__createRange();
				var fakeNode = null;
		        if (!this.util.isTextNode(node)) 
		        {
		            fakeNode = this.__dom.doc.createTextNode("");
		            range.setStartAfter(node);
		            range.insertNode(fakeNode);
		            range.selectNode(fakeNode);
		        }
		        else 
		        {
		            range.setEnd(node, node.nodeValue !== null ? node.nodeValue.length : 0);
		        }
		        range.collapse(false);
				this.__selectRange(range);
				return fakeNode;
			}
			else
			{
				this.util.warning("NSEditor","Node element must be in editor");
			}
    	}
    	return null;
	};
	
	NSEditor.prototype.__setCursorBefore = function(node) 
	{
    	if(node)
    	{
    		var textArea = this.__getTextArea();
    		var isExistsInside =  this.editorUtil.loopParents(node,function(paramElement){
				return paramElement === textArea || (paramElement && paramElement.parentNode === textArea);
			},textArea);
			if(isExistsInside)
			{
				var range = this.__createRange();
				var fakeNode = null;
		        if (!this.util.isTextNode(node)) 
		        {
		            fakeNode = this.__dom.doc.createTextNode("");
		            range.setStartAfter(node);
		            range.collapse(true);
		            range.insertNode(fakeNode);
		            range.selectNode(fakeNode);
		        }
		        else 
		        {
		            range.setStart(node, node.nodeValue !== null ? node.nodeValue.length : 0);
		        }
		        range.collapse(true);
				this.__selectRange(range);
				return fakeNode;
			}
			else
			{
				this.util.warning("NSEditor","Node element must be in editor");
			}
    	}
    	return null;
	};
	
	NSEditor.prototype.__setCursorIn = function(node,inStart) 
	{
    	if(node)
    	{
    		inStart = (inStart === void 0) ? true : Boolean.parse(inStart);
    		var textArea = this.__getTextArea();
    		var isExistsInside =  this.editorUtil.loopParents(node,function(paramElement){
				return paramElement === textArea || (paramElement && paramElement.parentNode === textArea);
			},textArea);
			if(isExistsInside)
			{
				var range = this.__createRange();
				var startNode = node;
				var lastNode = node;
				do 
				{
		            if(this.util.isTextNode(startNode)) 
		            {
		                break;
		            }
		            lastNode = startNode;
		            startNode = inStart ? startNode.firstChild : startNode.lastChild;
		        } 
				while (startNode);
				if (!startNode) 
				{
		            var fakeNode = this.__dom.doc.createTextNode("");
		            if (!/^(img|br|input)$/i.test(lastNode.nodeName)) 
		            {
		            	lastNode.appendChild(fakeNode);
		            	lastNode = fakeNode;
		            }
		            else 
		            {
		            	startNode = lastNode;
		            }
		        }
				range.selectNodeContents(startNode || lastNode);
		        range.collapse(inStart);
		        this.__selectRange(range);
		        return lastNode;
			}
			else
			{
				this.util.warning("NSEditor","Node element must be in editor");
			}
    	}
    	return null;
	};*/

/*NSEditor.prototype.__insertNode = function (node, insertCursorAfter,checkCharCount) 
	{
		if(node)
		{
			if (checkCharCount && !this.__checkCharCount(node, null)) 
			{
            	return null;
        	}
			insertCursorAfter = (insertCursorAfter === void 0) ? true : Boolean.parse(insertCursorAfter);
			if (!this.hasFocus() && !this.__isSourceMode) 
	        {
				//this.__restoreSelection();
	            this.__setFocusOnControl(true);
	        }
			if (!this.__isCollapsed()) 
			{
				this.__executeCommand("Delete");
			}
			var tempNode = null;
			var selection = this.__getInternalSelection();
			var textArea = this.__getTextArea();
			if(selection && selection.rangeCount)
			{
				var range = selection.getRangeAt(0);
				if (this.util.isElementInOrParent(range.commonAncestorContainer,textArea)) 
				{
		                if (/^(BR|HR|IMG|VIDEO)$/i.test(range.startContainer.nodeName) && range.collapsed) 
		                {
		                	tempNode = range.startContainer.parentNode;
		                	if(tempNode)
		                	{
		                		tempNode.insertBefore(node, range.startContainer);
		                	}
		                }
		                else 
		                {
		                    range.deleteContents();
		                    range.insertNode(node);
		                }
	            }
	            else 
	            {
	            	textArea.appendChild(node);
	            }
			}
			else 
            {
            	textArea.appendChild(node);
            }
			if (insertCursorAfter) 
			{
	            if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) 
	            {
	            	if(node.lastChild)
	            	{
	            		this.setCursorAfter(node.lastChild);
	            	}
	            }
	            else 
	            {
	                this.__setCursorAfter(node);
	            }
	        }
			this.__dispatchInternalEvent("afterInsertNode");
		}
        
    };*/

NSEditor.prototype.__insertHTML = function(html) 
	{
		if(html && html.length > 0)
		{
			var doc = this.__isModeTextArea() ? this.__dom.doc : this.__frameContentDoc;
			var divTemp = this.__dom.doc.createElement("div");
			divTemp.innerHTML = html;
			var element = divTemp.childNodes[0];
			if(this.__browserDetail.isMSIE)
			{
				this.__executeCommand("insertImage",{"arguments": "##nsEditorImage##"});
				var image = doc.querySelector('img[src="##nsEditorImage##"]');
				if(image)
				{
					image.parentNode.replaceChild(element,image);
				}
			}
			else if (this.__browserDetail.isFirefox) 
			{ 
				range = this.__getInternalRange();
				range.deleteContents();
				range.insertNode(element);
			}
			else
			{
				this.__executeCommand("insertHTML",{"arguments": html});
			}
		}
	};
	
	NSEditor.prototype.__findCurrentElement = function(checkChild) 
	{
		if(!this.__isSourceMode)
		{
			checkChild = (checkChild === void 0) ? true : Boolean.parse(checkChild);
			var selection = this.__getInternalSelection();
			if(selection && selection.rangeCount > 0) 
			{
				var range = selection.getRangeAt(0);
                var node = range.startContainer;
                var isLastChild = false;
                var container = this.__getTextArea();
                if(!this.util.isTextNode(node))
                {
                	node = range.startContainer.childNodes[range.startOffset];
                	if (!node) 
                	{
                        node = range.startContainer.childNodes[range.startOffset - 1];
                        isLastChild = true;
                    }
                	if(node && selection.isCollapsed && !this.util.isTextNode(node)) 
                	{
                		var getChild = function (nodeParam) 
                		{
                            return isLastChild ? nodeParam.lastChild : nodeParam.firstChild;
                        };
                		if (!isLastChild && this.util.isTextNode(node.previousSibling)) 
                		{
                            node = node.previousSibling;
                        }
                        else if (checkChild) 
                        {
                            var current = getChild(node);
                            while (current) 
                            {
                                if (current && this.util.isTextNode(current)) 
                                {
                                    node = current;
                                    break;
                                }
                                current = getChild(current);
                            }
                        }
                	}
                	if(node && !selection.isCollapsed && !this.util.isTextNode(node)) 
                	{
                		var leftChild = node;
                		var rightChild = node;
                        do 
                        {
                            leftChild = leftChild.firstChild;
                            rightChild = rightChild.lastChild;
                        } 
                        while (leftChild && rightChild && !this.util.isTextNode(leftChild));
                        if (leftChild === rightChild && leftChild && this.util.isTextNode(leftChild)) 
                        {
                            node = leftChild;
                        }
                	}
                }
                if(node && this.util.isElementInOrParent(node,container))
                {
                	return node;
                }
			}
		}
		return null;
	};