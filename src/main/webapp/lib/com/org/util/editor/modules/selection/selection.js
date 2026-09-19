 var NSSelection = (function()
{
	var NSSelection = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		
		this.__savedSelection = null;
		
		this.__initialize = function()
		{
			
		};
		
		/* Start of selection function */
		this.getSelection = function() 
		{
			if(this.__nsEditor.__isModeTextArea())
			{
				if (this.__nsEditor.__context.getSelection) 
				{
					return this.__nsEditor.__context.getSelection();
				} 
				else if (this.__nsEditor.__dom.doc.selection) 
				{
				   return this.__nsEditor.__dom.doc.selection;
				}
			}
			else
			{
				var contentWindow = this.__nsEditor.__compTextArea.contentWindow;
				if (contentWindow) 
				{
					if (contentWindow.getSelection) 
					{
						return contentWindow.getSelection();
					}
					if (contentWindow.selection) 
					{
						return contentWindow.selection;
					}
				}
				var doc = this.__frameContentDoc;
				if (doc.getSelection) 
				{
					return doc.getSelection();
				}
				if (doc.selection) 
				{
					return doc.selection;
				}
			}
			return null;
		};
		
		//restore
	    this.restoreSelection = function(objSaved) 
		{
	    	objSaved = objSaved || this.__savedSelection;
	    	if(objSaved)
	    	{
	    		if(objSaved instanceof Range)
	    		{
	    			var selection = null;
					var self = this;
					var setTextRange = function(win,doc)
					{
						if(win.getSelection || doc.createRange) 
						{
							selection = win.getSelection();
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
					        selection.addRange(objSaved);
						}
						else if (doc.selection) 
						{
							objSaved.select();
						}
					};
					if(this.__nsEditor.__isModeTextArea())
					{
						setTextRange(this.__nsEditor.__context,this.__nsEditor.__dom.doc);
					}
					else
					{
						setTextRange(this.__nsEditor.__frameContentWindow,this.__nsEditor.__frameContentDoc);
					}
	    		}
	    		else if(this.util.isArray(objSaved))
	    		{
	    			var range = null;
	    			for(var count = 0;count < objSaved.length;count++) 
					{
	    				var item = objSaved[count];
	    				var start = item.start;
	    				var end = item.end;
	    				if(start) 
	    				{
	    					range = this.createRange();
	    					if(item.collapsed || !end) 
	    					{
	    						var previousNode = start.previousSibling;
	    						if(this.util.isTextNode(previousNode)) 
	    						{
	    							range.setStart(previousNode,(previousNode.nodeValue ? previousNode.nodeValue.length : 0));
	    						} 
	    						else 
	    						{
	    							range.setStartBefore(start);
	    						}
	    						this.editorUtil.removeNode(start);
	    						range.collapse(true);
	    					}
	    					else 
	    					{
	    						range.setStartAfter(start);
	    						this.editorUtil.removeNode(start);
	    						range.setEndBefore(end);
	    						this.editorUtil.removeNode(end);
	    					}
	    				}

					}
	    			if(range) 
	    			{
	    				this.selectRange(range);
	    			}
	    		}
	    	}
		};
		
		//save
		this.saveSelection = function(saveSelection,wrapText)
		{
			saveSelection = (saveSelection == null) ? true : Boolean.parse(saveSelection);
			var savedSelection = null;
			if(wrapText)
			{
				savedSelection = [];
				var selection = this.getSelection();
				if(selection && selection.rangeCount) 
				{
					var ranges = [];
					var rangeCount = selection.rangeCount;
					var start = null;
					var end = null;
					for(var count = 0;count < rangeCount;count++) 
					{
						ranges[count] = selection.getRangeAt(count);
						if (ranges[count].collapsed) 
						{
							start = this.__createWrapper(true,ranges[count]);
							savedSelection[count] = {start:start,collapsed:true,startMarker: start.outerHTML};
						} 
						else 
						{
							start = this.__createWrapper(true,ranges[count]);
							end = this.__createWrapper(false,ranges[count]);
							savedSelection[count]  = {start: start,end: end,collapsed: false,startMarker: start.outerHTML,endMarker: end.outerHTML};
						}
					}
					selection.removeAllRanges();
					for(var count = rangeCount - 1;count > -1; --count) 
					{
						var start = savedSelection[count].start;
						if(start) 
						{
							if(savedSelection[count].collapsed) 
							{
								ranges[count].setStartAfter(start);
								ranges[count].collapse(true);
							} 
							else 
							{
								//doing setStartAfter as with setStartBefore the element added gets added before the start selection span
								//ranges[count].setStartBefore(start);
								ranges[count].setStartAfter(start);
								if(savedSelection[count].end) 
								{
									var end = savedSelection[count].end;
									if(end) 
									{
										//doing setEndBefore as with setEndAfter the element added wraps after the end selection span
										//ranges[count].setEndAfter(end);
										ranges[count].setEndBefore(end);
									}
								}
							}
						}
						try 
						{
							selection.addRange(ranges[count].cloneRange());
						} 
						catch(error)
						{
						}
					}
				}
			}
			else 
			{
				savedSelection = this.getRange();
			}
			if(saveSelection)
			{
				this.__savedSelection = savedSelection;
			}
			return savedSelection;
		};
		
		this.__createWrapper = function(isStart,range)
		{
			var clonedRange;
			var doc = this.__nsEditor.__getDocument();
			var textArea = this.__nsEditor.__getTextArea();
			if (range) 
			{
				clonedRange = range.cloneRange();
				clonedRange.collapse(isStart);
			}
			var wrapper = this.util.createElement("span",null,"nsEditorSelectionWrapper nsEditorSelectionWrapper" + (isStart ? "Start" : "End"),doc);
			this.util.css(wrapper,{lineHeight: 0,display:"none"});
			wrapper.appendChild(doc.createTextNode(this.editorUtil.INVISIBLE_SPACE));
			if(clonedRange) 
			{
				if (this.editorUtil.isExistsInsideEditor(isStart ? clonedRange.startContainer : clonedRange.endContainer)) 
				{
					clonedRange.insertNode(wrapper);
				}
			}
			return wrapper;
		};
		
		//isMarker
		this.isSelectionWrapper = function(node)
		{
			node && this.util.hasStyleClass(node,"nsEditorSelectionWrapper");
		}
		
		/* end of selection function */
		
		/* Start of range function */
		
		this.getRange = function() 
		{
			var selection = this.getSelection();
			if (selection) 
			{
				if (selection.rangeCount && selection.rangeCount > 0) 
				{
					return selection.getRangeAt(0);
				} 
				else
				{
					return this.createRange();
				}
			}
			return null;
		};
		
		this.createRange = function() 
		{
			var doc = this.__nsEditor.__getDocument();
			var range = doc.createRange();
			return range;
		};
		
		this.selectRange = function(range,focus) 
		{
			focus = this.util.isUndefinedOrNull(focus) ? true : Boolean.parse(focus);
			if(focus && !this.hasFocus()) 
			{
				this.setFocus();
			}
			var selection = this.getSelection();
			if (selection) 
			{
				selection.removeAllRanges();
				selection.addRange(range);
			}
			this.__nsEditor.__dispatchInternalEvent("selectionchange",{range:range},{range:range});
		};
		
		//select
		this.selectElement = function(node,isInward) 
		{
			if(node)
			{
				isInward = Boolean.parse(isInward);
				var isExistsInside = this.editorUtil.isExistsInsideEditor(node);
				if(isExistsInside)
				{
					var range = this.createRange();
				    range[isInward ? "selectNodeContents" : "selectNode"](node);
				    this.selectRange(range);
				}
				else
				{
					this.util.warning("NSEditor","Node element must be in editor");
				}
			}
		};
		
		this.createDefaultRange = function() 
	    {
			this.setFocus();
	        var range = this.createRange();
	        var body = this.__nsEditor.__getTextArea();
	        var focusElement = body.firstElementChild;
	        if (!focusElement) 
	        {
	        	body.innerHTML = this.__config.defaultValue;
	        	focusElement = body.firstElementChild;
	        }
	        range.setStart(focusElement, 0);
	        range.setEnd(focusElement, 0);
	        return range;
	    };
		
		/* end of range function */
		
		this.insertNode = function(node,insertCursorAfter,checkCharCount) 
		{
			if(node)
			{
				checkCharCount = this.util.isUndefinedOrNull(checkCharCount) ? true : Boolean.parse(checkCharCount);
				if (!this.__nsEditor.__checkCharCount(node, null)) 
				{
	            	return false;
	        	}
				insertCursorAfter = this.util.isUndefinedOrNull(insertCursorAfter) ? true : Boolean.parse(insertCursorAfter);
				if (!this.hasFocus() && !this.__nsEditor.__isSourceMode) 
		        {
					//this.restoreSelection();
		            this.setFocus();
		        }
				if (!this.isCollapsed()) 
				{
					this.__nsEditor.__executeCommand("Delete");
				}
				var tempNode = null;
				var selection = this.getSelection();
				var textArea = this.__nsEditor.__getTextArea();
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
		                this.setCursorAfter(node);
		            }
		        }
				this.__nsEditor.__dispatchInternalEvent("insertedNode");
				return true;
			}
	    };
	    
	    this.insertHTML = function(html) 
	    {
	        if (html) 
	        {
	        	var doc = this.__nsEditor.__getDocument();
	        	var textArea = this.__nsEditor.__getTextArea(); 
	        	var divTemp = doc.createElement("div");
	        	var fragment = doc.createDocumentFragment();
		        if (!this.hasFocus() && !this.__isSourceMode) 
		        {
		            this.setFocus();
		        }
		        if (!this.editorUtil.isNode(html)) 
		        {
		            divTemp.innerHTML = html.toString();
		        }
		        else 
		        {
		            divTemp.appendChild(html);
		        }
		        var lastChild = divTemp.lastChild;
		        if (this.__isSourceMode || !lastChild) 
		        {
		            return;
		        }
		        while (divTemp.firstChild) 
		        {
		            lastChild = divTemp.firstChild;
		            fragment.appendChild(divTemp.firstChild);
		        }
		        if(this.insertNode(fragment, false))
		        {
		        	if (lastChild) 
		        	{
			            this.setCursorAfter(lastChild);
			        }
			        else 
			        {
			            this.setCursorIn(fragment);
			        }
			        var lastEditorElement = textArea.lastChild;
			        while(this.util.isTextNode(lastEditorElement) && lastEditorElement.previousSibling && lastEditorElement.nodeValue &&
			            /^\s*$/.test(lastEditorElement.nodeValue)) 
			        {
			            lastEditorElement = lastEditorElement.previousSibling;
			        }
			        if (lastChild) 
			        {
			            if (lastEditorElement && lastChild === lastEditorElement &&
			            		this.util.isElement(lastChild)) 
			            {
			            	textArea.appendChild(doc.createElement("br"));
			            }
			            this.setCursorAfter(lastChild);
			        }
		        }
		        
	        }
	    };
		
		//remove
		this.removeSelectedContent = function() 
		{
			var selection = this.getSelection();
			var element = this.getElementUnderCursor();
			if (selection && element) 
			{
				for (var count = 0;count < selection.rangeCount; count++) 
				{
					selection.getRangeAt(count).deleteContents();
					selection.getRangeAt(count).collapse(true);
				}
			}
		};

		this.removeNode = function(node)
		{
			var isExistsInside = this.editorUtil.isExistsInsideEditor(node);
    		if(isExistsInside)
			{
    			this.editorUtil.removeNode(node);
			}
    		//afterRemoveNode
    		this.__nsEditor.__dispatchInternalEvent("removedNode",{node: node},{node: node});
		};
		
		this.insertCursorAtPoint = function (xPos,yPos) 
		{
	        var self = this;
	        this.removeMarkers();
	        try 
	        {
	        	var doc = this.__nsEditor.__getDocument();
	        	var range = this.createRange();
	        	if(doc.caretPositionFromPoint) 
	        	{
                    var caret = doc.caretPositionFromPoint(xPos,yPos);
                    if (caret) 
                    {
                        range.setStart(caret.offsetNode,caret.offset);
                    }
                }
	        	else if(doc.caretRangeFromPoint) 
                {
                    var caret = doc.caretRangeFromPoint(xPos,yPos);
                    range.setStart(caret.startContainer, caret.startOffset);
                }
	            range.collapse(true);
	            this.selectRange(range);
	            return true;
	        }
	        catch (error) 
	        { 
	        	
	        }
	        return false;
	    };
	    
	    this.isCollapsed = function() 
	    {
	        var selection = this.getSelection();
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
	    
	    //isFocused
	    this.hasFocus = function () 
	    {
	    	var doc = this.__nsEditor.__getDocument();
	    	var textArea = this.__nsEditor.__getTextArea(); 
	        return (doc.hasFocus && doc.hasFocus() && textArea === doc.activeElement);
	    };
	    
	    this.setFocus = function() 
		{
			if(this.__nsEditor.__isModeTextArea())
			{
				this.__nsEditor.__compTextArea && this.__nsEditor.__compTextArea.focus();
			}
			else
			{
				this.__nsEditor.__frameContentWindow && this.__nsEditor.__frameContentWindow.focus();
			}
		};
		
		//current
		this.getElementUnderCursor = function(parseChildren)
		{
			parseChildren = this.util.isUndefinedOrNull(parseChildren) ? true : Boolean.parse(parseChildren);
	        if (!this.__nsEditor.__isSourceMode) 
	        {
	            var selection = this.getSelection();
	            if (selection && selection.rangeCount > 0) 
	            {
	                var range = selection.getRangeAt(0);
	                var node = range.startContainer
	                var isRight = false;
	                var getChild = function(paramNode) 
	                {
	                    return isRight ? paramNode.lastChild : paramNode.firstChild;
	                };
	                if (!this.util.isTextNode(node)) 
	                {
	                    node = range.startContainer.childNodes[range.startOffset];
	                    if (!node) 
	                    {
	                        node = range.startContainer.childNodes[range.startOffset - 1];
	                        isRight = true;
	                    }
	                    if (node && selection.isCollapsed && !this.util.isTextNode(node)) 
	                    {
	                        if (!isRight && this.util.isTextNode(node.previousSibling)) 
	                        {
	                            node = node.previousSibling;
	                        }
	                        else if (parseChildren) 
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
	                    if (node && !selection.isCollapsed && !this.util.isTextNode(node)) 
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
	                var isExistsInside = this.editorUtil.isExistsInsideEditor(node);
	                if (node && isExistsInside) 
	                {
	                    return node;
	                }
	            }
	        }
	        return null;
		};
		
		this.setCursorAfter = function(node) 
		{
	    	if(node)
	    	{
	    		var isExistsInside = this.editorUtil.isExistsInsideEditor(node);
				if(isExistsInside)
				{
					var range = this.createRange();
					var fakeNode = null;
			        if (!this.util.isTextNode(node)) 
			        {
			            fakeNode = this.__nsEditor.__dom.doc.createTextNode("");
			            range.setStartAfter(node);
			            range.insertNode(fakeNode);
			            range.selectNode(fakeNode);
			        }
			        else 
			        {
			            range.setEnd(node, node.nodeValue !== null ? node.nodeValue.length : 0);
			        }
			        range.collapse(false);
					this.selectRange(range);
					return fakeNode;
				}
				else
				{
					this.util.warning("NSEditor","Node element must be in editor");
				}
	    	}
	    	return null;
		};
		
		this.setCursorBefore = function(node) 
		{
	    	if(node)
	    	{
	    		var isExistsInside = this.editorUtil.isExistsInsideEditor(node);
				if(isExistsInside)
				{
					var range = this.createRange();
					var fakeNode = null;
			        if (!this.util.isTextNode(node)) 
			        {
			            fakeNode = this.__nsEditor.__dom.doc.createTextNode("");
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
					this.selectRange(range);
					return fakeNode;
				}
				else
				{
					this.util.warning("NSEditor","Node element must be in editor");
				}
	    	}
	    	return null;
		};
		
		this.setCursorIn = function(node,inStart) 
		{
	    	if(node)
	    	{
	    		inStart = this.util.isUndefinedOrNull(inStart) ? true : Boolean.parse(inStart);
	    		var isExistsInside = this.editorUtil.isExistsInsideEditor(node);
				if(isExistsInside)
				{
					var range = this.createRange();
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
			            var fakeNode = this.__nsEditor.__dom.doc.createTextNode("");
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
			        this.selectRange(range);
			        return lastNode;
				}
				else
				{
					this.util.warning("NSEditor","Node element must be in editor");
				}
	    	}
	    	return null;
		};
		
		//getHTML
		this.getSelectedHTML = function() 
		{
			var selection = this.getSelection();
	        if (selection && selection.rangeCount > 0) 
	        {
	        	var doc = this.__nsEditor.__getDocument();
	            var range = selection.getRangeAt(0);
	            var clonedSelection = range.cloneContents();
	            var div = doc.createElement("div");
	            div.appendChild(clonedSelection);
	            return div.innerHTML;
	        }
	        return "";
	    };
	    
	    this.getSelectedNodes = function()
	    {
	    	var selection = this.getSelection();
	        if (selection && selection.rangeCount > 0) 
	        {
	        	var self = this;
	        	var arrNodes = [];
	        	var doc = this.__nsEditor.__getDocument();
	        	var textArea = this.__nsEditor.__getTextArea();
	        	var range = selection.getRangeAt(0);
	        	var arrChild = textArea.childNodes;
	        	var elementOffset = (range.startOffset < arrChild.length) ? range.startOffset : arrChild.length - 1;
	        	var start = (range.startContainer == textArea)? arrChild[elementOffset] : range.startContainer;
	            var end = (range.endContainer == textArea) ? arrChild[range.endOffset - 1] : range.endContainer;
	            var callback = function(node)
	            {
	            	if(node && node != textArea && !self.editorUtil.isEmptyTextNode(node) && !self.isSelectionWrapper(node))
	            	{
	            		arrNodes.push(node);
                    }
                    var retValue =  (node == end || (node && node.contains && node.contains(end)));
                    return retValue;
	            };
	            this.util.findNode(start,callback,textArea,true,"nextSibling","");
	            if (arrNodes.length === 0 && this.editorUtil.isEmptyTextNode(start)) 
	            {
	            	arrNodes.push(start);
	            }
	            return arrNodes;
	        }
	        return null;
	    };
	    
	  //eachSelection
	    this.loopSelectedNodes = function(callback)
	    {
	    	if(callback)
	    	{
	    		var arrNodes = this.getSelectedNodes();
		    	if(arrNodes && arrNodes.length)
		    	{
		    		var doc = this.__nsEditor.__getDocument();
		    		var textArea = this.__nsEditor.__getTextArea();
		    		var self = this;
		    		var callbackNode = function(node)
		    		{
		    			if (node != textArea && self.editorUtil.isExistsInsideEditor(node)) 
		    			{
		    				if(node.nodeName.match(/^(UL|OL)$/)) 
		    				{
		                        var arrChild = Array.from(node.childNodes);
		                        if(arrChild && arrChild.length)
		                        {
		                        	for(var count = 0;count < arrChild.length;count++)
		                        	{
		                        		callbackNode(arrChild);
		                        	}
		                        }
		                    }
		    				else
		    				{
		    					if(self.util.isElementOfType(node,"li"))
		    					{
		    						if (node.firstChild) 
		    						{
			                            node = node.firstChild;
			                        }
			                        else 
			                        {
			                            var tempNode = doc.createTextNode("\uFEFF");
			                            node.appendChild(tempNode);
			                            node = tempNode;
			                        }
		    					}
		    					callback(node);
		    				}
	                    }
		    		};
		    		for(count = 0;count < arrNodes.length;count++)
		    		{
		    			var node = arrNodes[count];
		    			callbackNode(node);
		    		}
		    	}
	    	}
	    };
	    
	    /*Select.prototype.wrapInTag = function (tagOrCallback) {
	        var _this = this;
	        selector_1.$$('*[style*=font-size]', this.area).forEach(function (elm) {
	            elm.style &&
	                elm.style.fontSize &&
	                elm.setAttribute('data-font-size', elm.style.fontSize.toString());
	        });
	        this.doc.execCommand('fontsize', false, '7');
	        selector_1.$$('*[data-font-size]', this.area).forEach(function (elm) {
	            var fontSize = elm.getAttribute('data-font-size');
	            if (elm.style && fontSize) {
	                elm.style.fontSize = fontSize;
	                elm.removeAttribute('data-font-size');
	            }
	        });
	        var result = [];
	        selector_1.$$('font[size="7"]', this.area).forEach(function (font) {
	            try {
	                if (checker_1.isFunction(tagOrCallback)) {
	                    tagOrCallback(font);
	                }
	                else {
	                    result.push(Dom_1.Dom.replace(font, tagOrCallback, _this.jodit.create.inside));
	                }
	            }
	            finally {
	                if (font.parentNode) {
	                    Dom_1.Dom.unwrap(font);
	                }
	            }
	        });
	        return result;
	    };
	    Select.prototype.applyCSS = function (cssRules, nodeName, options) {
	        var _this = this;
	        if (nodeName === void 0) { nodeName = 'span'; }
	        var WRAP = 1, UNWRAP = 0, defaultTag = 'SPAN';
	        var mode;
	        var findNextCondition = function (elm) {
	            return elm !== null &&
	                !Dom_1.Dom.isEmptyTextNode(elm) &&
	                !_this.isMarker(elm);
	        };
	        var checkCssRulesFor = function (elm) {
	            return (!Dom_1.Dom.isTag(elm, 'font') &&
	                Dom_1.Dom.isElement(elm) &&
	                ((checker_1.isPlainObject(options) &&
	                    each_1.each(options, function (cssPropertyKey, cssPropertyValues) {
	                        var value = css_1.css(elm, cssPropertyKey, undefined, true);
	                        return (value !== null &&
	                            value !== '' &&
	                            cssPropertyValues.indexOf(value.toString().toLowerCase()) !== -1);
	                    })) ||
	                    (typeof options === 'function' && options(_this.jodit, elm))));
	        };
	        var isSuitElement = function (elm) {
	            if (!elm) {
	                return false;
	            }
	            var reg = RegExp('^' + elm.nodeName + '$', 'i');
	            return ((reg.test(nodeName) ||
	                !!(options && checkCssRulesFor(elm))) &&
	                findNextCondition(elm));
	        };
	        var toggleStyles = function (elm) {
	            if (isSuitElement(elm)) {
	                if (elm.nodeName === defaultTag && cssRules) {
	                    Object.keys(cssRules).forEach(function (rule) {
	                        if (mode === UNWRAP ||
	                            css_1.css(elm, rule) ===
	                                normalize_1.normilizeCSSValue(rule, cssRules[rule])) {
	                            css_1.css(elm, rule, '');
	                            if (mode === undefined) {
	                                mode = UNWRAP;
	                            }
	                        }
	                        else {
	                            css_1.css(elm, rule, cssRules[rule]);
	                            if (mode === undefined) {
	                                mode = WRAP;
	                            }
	                        }
	                    });
	                }
	                if (!Dom_1.Dom.isBlock(elm, _this.win) &&
	                    (!elm.getAttribute('style') || elm.nodeName !== defaultTag)) {
	                    Dom_1.Dom.unwrap(elm);
	                    if (mode === undefined) {
	                        mode = UNWRAP;
	                    }
	                }
	            }
	        };
	        if (this.isCollapsed()) {
	            var clearStyle = false;
	            if (this.current() &&
	                Dom_1.Dom.closest(this.current(), nodeName, this.area)) {
	                clearStyle = true;
	                var closest = Dom_1.Dom.closest(this.current(), nodeName, this.area);
	                if (closest) {
	                    this.setCursorAfter(closest);
	                }
	            }
	            if (nodeName.toUpperCase() === defaultTag || !clearStyle) {
	                var node = this.jodit.create.inside.element(nodeName);
	                node.appendChild(this.jodit.create.inside.text(consts.INVISIBLE_SPACE));
	                this.insertNode(node, false, false);
	                if (nodeName.toUpperCase() === defaultTag && cssRules) {
	                    css_1.css(node, cssRules);
	                }
	                this.setCursorIn(node);
	                return;
	            }
	        }
	        var selInfo = this.save();
	        normalize_1.normalizeNode(this.area.firstChild);
	        this.wrapInTag(function (font) {
	            if (!Dom_1.Dom.next(font, findNextCondition, font.parentNode) &&
	                !Dom_1.Dom.prev(font, findNextCondition, font.parentNode) &&
	                isSuitElement(font.parentNode) &&
	                font.parentNode !== _this.area &&
	                (!Dom_1.Dom.isBlock(font.parentNode, _this.win) ||
	                    consts.IS_BLOCK.test(nodeName))) {
	                toggleStyles(font.parentNode);
	                return;
	            }
	            if (font.firstChild &&
	                !Dom_1.Dom.next(font.firstChild, findNextCondition, font) &&
	                !Dom_1.Dom.prev(font.firstChild, findNextCondition, font) &&
	                isSuitElement(font.firstChild)) {
	                toggleStyles(font.firstChild);
	                return;
	            }
	            if (Dom_1.Dom.closest(font, isSuitElement, _this.area)) {
	                var leftRange = _this.createRange(), wrapper = Dom_1.Dom.closest(font, isSuitElement, _this.area);
	                leftRange.setStartBefore(wrapper);
	                leftRange.setEndBefore(font);
	                var leftFragment = leftRange.extractContents();
	                if ((!leftFragment.textContent ||
	                    !string_1.trim(leftFragment.textContent).length) &&
	                    leftFragment.firstChild) {
	                    Dom_1.Dom.unwrap(leftFragment.firstChild);
	                }
	                if (wrapper.parentNode) {
	                    wrapper.parentNode.insertBefore(leftFragment, wrapper);
	                }
	                leftRange.setStartAfter(font);
	                leftRange.setEndAfter(wrapper);
	                var rightFragment = leftRange.extractContents();
	                if ((!rightFragment.textContent ||
	                    !string_1.trim(rightFragment.textContent).length) &&
	                    rightFragment.firstChild) {
	                    Dom_1.Dom.unwrap(rightFragment.firstChild);
	                }
	                Dom_1.Dom.after(wrapper, rightFragment);
	                toggleStyles(wrapper);
	                return;
	            }
	            var needUnwrap = [];
	            var firstElementSuit;
	            if (font.firstChild) {
	                Dom_1.Dom.find(font.firstChild, function (elm) {
	                    if (elm && isSuitElement(elm)) {
	                        if (firstElementSuit === undefined) {
	                            firstElementSuit = true;
	                        }
	                        needUnwrap.push(elm);
	                    }
	                    else {
	                        if (firstElementSuit === undefined) {
	                            firstElementSuit = false;
	                        }
	                    }
	                    return false;
	                }, font, true);
	            }
	            needUnwrap.forEach(Dom_1.Dom.unwrap);
	            if (!firstElementSuit) {
	                if (mode === undefined) {
	                    mode = WRAP;
	                }
	                if (mode === WRAP) {
	                    css_1.css(Dom_1.Dom.replace(font, nodeName, _this.jodit.create.inside), cssRules && nodeName.toUpperCase() === defaultTag
	                        ? cssRules
	                        : {});
	                }
	            }
	        });
	        this.restore(selInfo);
	    };
	    Select.prototype.splitSelection = function (currentBox) {
	        if (!this.isCollapsed()) {
	            return null;
	        }
	        var leftRange = this.createRange();
	        var range = this.range;
	        leftRange.setStartBefore(currentBox);
	        var cursorOnTheRight = this.cursorOnTheRight(currentBox);
	        var cursorOnTheLeft = this.cursorOnTheLeft(currentBox);
	        var br = null;
	        if (cursorOnTheRight || cursorOnTheLeft) {
	            br = this.jodit.create.inside.element('br');
	            range.insertNode(br);
	            var clearBR = function (start, getNext) {
	                var next = getNext(start);
	                while (next) {
	                    var nextSib = getNext(next);
	                    if (next &&
	                        (Dom_1.Dom.isTag(next, 'br') || Dom_1.Dom.isEmptyTextNode(next))) {
	                        Dom_1.Dom.safeRemove(next);
	                    }
	                    else {
	                        break;
	                    }
	                    next = nextSib;
	                }
	            };
	            clearBR(br, function (n) { return n.nextSibling; });
	            clearBR(br, function (n) { return n.previousSibling; });
	            if (cursorOnTheRight) {
	                leftRange.setEndBefore(br);
	                range.setEndBefore(br);
	            }
	            else {
	                leftRange.setEndAfter(br);
	                range.setEndAfter(br);
	            }
	        }
	        else {
	            leftRange.setEnd(range.startContainer, range.startOffset);
	        }
	        var fragment = leftRange.extractContents();
	        if (currentBox.parentNode) {
	            try {
	                currentBox.parentNode.insertBefore(fragment, currentBox);
	                if (cursorOnTheRight && br && br.parentNode) {
	                    var range_3 = this.createRange();
	                    range_3.setStartBefore(br);
	                    this.selectRange(range_3);
	                }
	            }
	            catch (e) {
	                console.log(e);
	            }
	        }
	        return currentBox.previousElementSibling;
	    };*/
		
		
		/*Select.prototype.cursorInTheEdge = function (start, parentBlock) {
	        var _a;
	        var end = !start, range = (_a = this.sel) === null || _a === void 0 ? void 0 : _a.getRangeAt(0), current = this.current(false);
	        if (!range ||
	            !current ||
	            !Dom_1.Dom.isOrContains(parentBlock, current, true)) {
	            return null;
	        }
	        var container = start ? range.startContainer : range.endContainer;
	        var offset = start ? range.startOffset : range.endOffset;
	        var check = function (elm) {
	            return elm && !Dom_1.Dom.isTag(elm, 'br') && !Dom_1.Dom.isEmptyTextNode(elm);
	        };
	        if (Dom_1.Dom.isText(container)) {
	            var text = container.nodeValue || '';
	            if (end && text.replace(constants_1.INVISIBLE_SPACE_REG_EXP_END, '').length > offset) {
	                return false;
	            }
	            var inv = constants_1.INVISIBLE_SPACE_REG_EXP_START.exec(text);
	            if (start &&
	                ((inv && inv[0].length < offset) || (!inv && offset > 0))) {
	                return false;
	            }
	        }
	        else {
	            var children = Array.from(container.childNodes);
	            if (end) {
	                if (children.slice(offset).some(check)) {
	                    return false;
	                }
	            }
	            else {
	                if (children.slice(0, offset).some(check)) {
	                    return false;
	                }
	            }
	        }
	        var next = start
	            ? Dom_1.Dom.prev(current, check, parentBlock)
	            : Dom_1.Dom.next(current, check, parentBlock);
	        return !next;
	    };
	    Select.prototype.cursorOnTheLeft = function (parentBlock) {
	        return this.cursorInTheEdge(true, parentBlock);
	    };
	    Select.prototype.cursorOnTheRight = function (parentBlock) {
	        return this.cursorInTheEdge(false, parentBlock);
	    };*/
		
		
		this.removeMarkers = function()
		{
			
		};
		
		this.__initialize();
	};
		
	return NSSelection;
})();
nsModuleExport(__nsGlobal,"NSSelection",NSSelection);