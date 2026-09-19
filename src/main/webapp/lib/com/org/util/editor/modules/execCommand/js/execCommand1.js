 var NSExecCommand = (function()
{
	var NSExecCommand = function(nsEditor)
	{
    	this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		this.selection = nsEditor.__selection;
		this.doc = null;
		this.win = null;
		this.root = null;
		this.__addingCSS;
		
		var self = this;
		var browser = null;
		var objCommand = {};
		var objCommandWithExec = {};
		
		this.initialize = function()
		{
			this.__nsEditor.__listenInternalEvent("textAreaInitialized",function(){
				self.doc = self.__nsEditor.__getDocument();
				self.win = self.__nsEditor.__getWindow();
				self.root = self.__nsEditor.__getTextArea();
			});
			var browser = self.util.getBrowser();
			objCommand = {bold:{tag:function(){
					return browser.isMSIE ? "strong" : "b";
				},css: {"font-weight": "bold"}},
				italic: {tag:function(){
					return browser.isMSIE ? "em" : "i";
				},css: {"font-style": "italic"} },
				underline: {tag:"u",css: {"text-decoration": "underline"},override: false},
				strikethrough: {tag:"s",css: {"text-decoration": "line-through"},override: false},
				justifycenter:{css: {"text-align": "center"}},
				justifyleft: {css: {"text-align": "left"}},
				justifyright: {css: {"text-align": "right"}},
				justifyfull: {css: {"text-align": "justify"}},
				subscript: {tag:"sub",css: {"vertical-align": "sub"}},
				superscript: {tag:"sup",css: {"vertical-align": "super"}},
				
				undo: {},
				redo: {},
				outdent: {css: {"margin-left": "-25"}},
				indent: {css: {"margin-left": "+25"}},
				fontname: {css:{"font-family": "##args##"}},
				fontsize: {"7": {css: {"font-size": "xx-large"}},
						   "6": {css: {"font-size": "x-large"}},
						   "5": {css: {"font-size": "large"}},
						   "4": {css: {"font-size": "medium"}},
						   "3": {css: {"font-size": "small"}},
						   "2": {css: {"font-size": "x-small"}},
						   "1": {css: {"font-size": "xx-small"}}},
				forecolor: {css:{"color": "##args##"}},
				backcolor: {css:{"background-color": "##args##"}},
			};
			objCommandWithExec = {
				insertorderedlist: {exec: this.handleList.bind(this),type: "ol"},
				insertunorderedlist: {exec: this.handleList.bind(this),type: "ul"},
			};
		};
		
		this.execute = function(commandName,showDefaultUI,valueArgument)
		{
			var item = objCommand[commandName.toLowerCase()];
			if(item)
			{
				if(!item.css && valueArgument && item[valueArgument])
				{
					item = item[valueArgument];
				}
				if(item.tag || item.css)
				{
					var tag = item.tag;
					if(this.util.isFunction(tag))
					{
						tag = tag(commandName,item);
					}
					if(!this.__nsEditor.__config.enableTagsForProps && item.css)
					{
						tag = null;
					}
					var css = item.css;
					if(item.css && valueArgument)
					{
						css = {}
						for(var prop in item.css)
						{
							var key = this.util.convertCSSPropToJS(prop);
							var value = item.css[prop];
							if(value == "##args##")
							{
								value = valueArgument;
							}
							css[key] = value;
						}
					}
					this.applyStyle({tag: tag,css: css});
					return true;
				}
			}
			else if(objCommandWithExec[commandName.toLowerCase()])
			{
				item = objCommandWithExec[commandName.toLowerCase()];
				if(item.exec)
				{
					return item.exec(item);
				}
			}
			
			return false;
		};
		
		this.applyStyle = function(option)
		{
			option.tag = option.tag || "span";
			
			var savedSelection = null;
			if(this.selection.isCollapsed())
			{
				var span = this.util.createElement("span",null,"nsEditorElement nsEditorSelectedWrapper",this.doc);
				this.selection.insertNode(span,false,false);
				this.selection.setCursorIn(span);
				savedSelection = this.selection.saveSelection(false,true);
				this.replaceNode(span,option.tag);
				this.editorUtil.removeNode(span);
			}
			else
			{
				/*var origDomSelection = this.selection.getSelection();
				if(origDomSelection && (origDomSelection.anchorNode == origDomSelection.focusNode))
				{
					option.selectedNode = origDomSelection.anchorNode;
				}*/
				var origRange = this.selection.getSelection().getRangeAt(0);
				savedSelection = this.selection.saveSelection(false,true);
				this.editorUtil.mergeTextNodes(this.root.firstChild);
				this.insertTagRestoringSize(this.replaceNode.bind(this),option);
			}
			this.selection.restoreSelection(savedSelection);
		};
		
		//Select.prototype.wrapInTag
		this.insertTagRestoringSize = function(tagOrCallback,option)
		{
			var arrElement = this.root.querySelectorAll("*[style*=font-size]");
			var arrFontsEle = [];
			for(var count = 0;count < arrElement.length;count++)
			{
				var element = arrElement[count];
				if(element && element.style && element.style.fontSize)
				{
					arrFontsEle.push({element: element,size: element.style.fontSize.toString()});
				}
			}
			var font = this.util.createElement("font",null,"nsEditorElement nsEditorSelectedWrapper",this.doc);
			font.setAttribute("size","7");
			this.editorUtil.insertNodeWrappingRange(font);
			//this.doc.execCommand('fontsize', false, '7');
			for(var count = 0;count < arrFontsEle.length;count++)
			{
				var item = arrFontsEle[count];
				if(item.element && item.element.style && item.size)
				{
					item.element.style.fontSize = item.size;
				}
			}
			var result = [];
			var arrFonts = this.root.querySelectorAll('font[size="7"]');
			for(var count = 0;count < arrFonts.length;count++)
			{
				var font = arrFonts[count];
				try
				{
					if (tagOrCallback && this.util.isFunction(tagOrCallback)) 
					{
						tagOrCallback(font,option);
					} 
					else if(tagOrCallback)
					{
						result.push(this.util.replaceElement(font,tagOrCallback,null,null,this.doc));
					}
				}
				finally
				{
					if (font.parentNode) 
					{
						this.util.insertElementParentsParent(font);
	                }
				}
			}
		};
		
		//applyToElement
		this.replaceNode = function(node,option)
		{
			var self = this;
			var defaultTag = "span";
			if(this.checkSuitableParent(node,option) || this.checkSuitableChild(node,option) || this.checkClosestWrapper(node,option) || this.unwrapChildren(node,option)) 
			{
				return false;
			}
			if (this.__addingCSS == null) 
			{
				//WRAP
				this.__addingCSS = true;
			}
			if (this.__addingCSS != true) 
			{
				return false;
			}
			var wrapper = node;
			if (this.editorUtil.isTagBlock(option.tag)) 
			{
				var ulReg = /^(ul|ol|li|td|th|tr|tbody|table)$/i;
				var parent = this.util.findParentByCallback(node,function(paramNode){
						if (paramNode && self.editorUtil.isBlock(paramNode,self.win)) 
						{
							if (ulReg.test(option.tag) || !ulReg.test(node.nodeName)) 
							{
								return true;
							}
						}
						return false;
					},this.root);
				if (parent) 
				{
					wrapper = parent;
				} 
				else 
				{
					wrapper = this.wrapUnwrappedText(node);
				}
			}

			var newWrapper = this.util.replaceElement(wrapper,option.tag,null,null,this.doc);
			this.util.addStyleClass(newWrapper,"nsEditorSpan")
			if(this.editorUtil.isTagBlock(option.tag)) 
			{
				this.postProcessListElement(newWrapper,option);
			}
			//&& this.__nsEditor.__config["enterElement"] == option.tag
			if(option.css && defaultTag == option.tag) 
			{
				this.util.css(newWrapper,option.css);
			}
			return true;
		};
		
		this.checkSuitableParent = function(node,option) 
		{
			var parentNode = node.parentNode;
			var nextNode = !this.util.findNextNode(node,this.isNormalNode.bind(this,option),parentNode);
			var prevNode = !this.util.findPrevNode(node,this.isNormalNode.bind(this,option),parentNode);
			var isSuit = this.isSuitableElement(option,parentNode,false);
			var isBlock = !this.editorUtil.isBlock(parentNode,this.win);
			var isTag = this.editorUtil.isTagBlock(option.tag);
			//&& !this.util.findNextNode(node,this.isNormalNode.bind(this,option),parentNode)
			//&& !this.util.findPrevNode(node,this.isNormalNode.bind(this,option),parentNode) 
			if (parentNode  
				&& this.isSuitableElement(option,parentNode,false) && parentNode != this.root &&
				(!this.editorUtil.isBlock(parentNode,this.win) || this.editorUtil.isTagBlock(option.tag))) 
			{
				this.toggleStyles(parentNode,option);
				return true;
			}

			return false;
		};
		
		this.checkSuitableChild = function(node,option)
		{
			var firstChild = node.firstChild;
			if (firstChild && !this.util.findNextNode(firstChild,this.isNormalNode.bind(this,option),node) &&
				!this.util.findPrevNode(firstChild,this.isNormalNode.bind(this,option),node) &&
				this.isSuitableElement(option,firstChild,false)) 
			{
				this.toggleStyles(firstChild,option);
				return true;
			}

			return false;
		};
		
		this.checkClosestWrapper = function(node,option) 
		{
			var wrapper = this.editorUtil.getClosestElement(node,this.isSuitableElement.bind(this,option),this.root);
			if (wrapper) 
			{
				if (this.editorUtil.isTagBlock(option.tag)) 
				{
					this.toggleStyles(wrapper,option);
					return true;
				}
				var leftRange = this.selection.createRange();
				leftRange.setStartBefore(wrapper);
				leftRange.setEndBefore(node);
				var leftFragment = leftRange.extractContents();
				if ((!leftFragment.textContent || !this.editorUtil.trim(leftFragment.textContent).length) && leftFragment.firstChild) 
				{
					this.util.insertElementParentsParent(leftFragment.firstChild);
				}
				if (wrapper.parentNode) 
				{
					wrapper.parentNode.insertBefore(leftFragment,wrapper);
				}
				leftRange.setStartAfter(node);
				leftRange.setEndAfter(wrapper);

				var rightFragment = leftRange.extractContents();
				if ((!rightFragment.textContent || !this.editorUtil.trim(rightFragment.textContent).length) && rightFragment.firstChild) 
				{
					this.util.insertElementParentsParent(rightFragment.firstChild);
				}
				this.util.insertAfterElement(wrapper,rightFragment);
				this.toggleStyles(wrapper,option);
				return true;
			}
			return false;
		};
		
		this.unwrapChildren = function(node,option)
		{
			var needUnwrap = [];
			var firstElementSuit;
			if(node.firstChild) 
			{
				var self = this;
				this.util.findNode(node.firstChild,function(paramNode)
				{
					if(paramNode && self.isSuitableElement(paramNode)) 
					{
						if (firstElementSuit === undefined) 
						{
							firstElementSuit = true;
						}
						needUnwrap.push(paramNode);
					} 
					else 
					{
						if(firstElementSuit === undefined) 
						{
							firstElementSuit = false;
						}
					}
					return false;
				},node,true);
			}
			for(var count = 0;count < needUnwrap.length;count++)
			{
				var paramNode = needUnwrap[count];
				this.util.insertElementParentsParent(paramNode);
			}
			return firstElementSuit;
		}
		
		this.toggleStyles = function(node,option) 
		{
			var css = option.css;
			var element = option.tag || "span";
			var defaultTag = "span";
			var elementIsDefault = (defaultTag == node.nodeName.toLowerCase());
			if (css && elementIsDefault)
			{
				for(var key in css)
				{
					var nodeValue = this.util.getStyleValue(node,key,false,true,this.win);
					var valueToBeSet = this.normalizeCssValue(key,css[key]);
					if(nodeValue && /color/i.test(key) && /^rgb/i.test(nodeValue.toString())) 
					{
						nodeValue = this.util.colorToHex(nodeValue.toString()) || nodeValue;
					}
					//console.log(key + "," + nodeValue + "," + valueToBeSet);
					if (this.__addingCSS == false || (nodeValue == valueToBeSet)) 
					{
						this.util.css(node,key,'');
						if(this.__addingCSS == undefined) 
						{
							//UNWRAP
							this.__addingCSS = false;
						}
					}
					else 
					{
						this.util.css(node, key, css[key]);
						if(this.__addingCSS == undefined) 
						{
							//WRAP
							this.__addingCSS = true;
						}
					}
				}
			}
			var isBlock = this.editorUtil.isBlock(node,this.root);
			var isSuitableInline = !isBlock && (!node.hasAttribute('style') || node.nodeName.toLowerCase() != defaultTag);
			var isSuitableBlock = !isSuitableInline && isBlock && node.nodeName.toLowerCase() == element;
			if (isSuitableInline || isSuitableBlock) 
			{
				// toggle `<strong>test</strong>` toWYSIWYG `test`, and
				// `<span style="">test</span>` toWYSIWYG `test`
				this.util.insertElementParentsParent(node);
				if(this.__addingCSS == undefined) 
				{
					this.__addingCSS = false;
				}
			}
		};
		
		this.isSuitableElement = function(option,node,strict)
		{
			if(node) 
			{
				strict = this.util.isUndefinedOrNull(strict) ? true : Boolean.parse(strict);
				var element = option.tag || this.__nsEditor.__config["enterElement"];
				var elementIsDefault = (this.__nsEditor.__config["enterElement"] == option.tag);
				var elmHasSameStyle = this.isStyleValueExists(node,option.css);
				var elmIsSame = (node.nodeName.toLowerCase() == element);

				return (((!elementIsDefault || !strict) && elmIsSame) || (elmHasSameStyle && this.isNormalNode(option,node)));
			}
			return false;
		};
		
		this.isStyleValueExists = function(node,objStyle)
		{
			var matches = false;
			if(node && this.util.isElement(node) && !this.util.hasStyleClass(node,"nsEditorSelectedWrapper")) 
			{
				matches = true;
				var style = this.win.getComputedStyle(node);
				for(var styleProp in objStyle)
				{
					if(style[styleProp] != objStyle[styleProp])
					{
						matches = false;
						break;
					}
				}
			}
			return matches;
		};

		this.isNormalNode = function(option,node) 
		{
			return (node != null && !this.editorUtil.isEmptyTextNode(node) && !this.selection.isSelectionWrapper(node));
		};
		
		this.normalizeCssValue = function(key,value)
		{
			switch (this.util.toKebabCase(key)) 
			{
				case 'font-weight':
					switch (value.toString().toLowerCase()) {
						case '700':
						case 'bold':
							return "bold";

						case '400':
						case 'normal':
							return "normal";

						case '900':
						case 'heavy':
							return "heavy";
					}

					return this.util.isNumeric(value) ? Number(value) : value;
			}

			if (/color/i.test(key) && /^rgb/i.test(value.toString())) 
			{
				return this.util.colorToHex(value.toString()) || value;
			}
			return value;
		};

		
		this.postProcessListElement = function(wrapper,option) 
		{
	        if (/^(OL|UL)$/i.test(option.tag) && wrapper.tagName.toLowerCase() == option.tag.toLowerCase()) 
	        {
	            var li = this.util.replaceElement(wrapper,"li",null,null,this.doc);
	            var ul = this.editorUtil.wrapNode(li,option.tag);
	            if(ul) 
	            {
	                wrapper = ul;
	            }
	        }
	    };
	    
	    /********* List related functions *******************/
		
		this.handleList = function(item)
		{
			var selection = this.selection.getSelection();
			var anchorNode = selection.anchorNode;
			if(anchorNode) 
			{
				var container = anchorNode.nodeType != Node.TEXT_NODE && anchorNode.nodeType != Node.COMMENT_NODE ? anchorNode : anchorNode.parentElement;
				var range = selection.getRangeAt(0);
				//selected all list
				if(range.commonAncestorContainer && range.commonAncestorContainer.nodeName.toLowerCase() == item.type) 
				{
					this.removeList(range);
				}
				//selected li
				else if (container.nodeName.toLowerCase() == "li") 
				{
					this.removeListItem(container,range,selection,item.type);
				}
				else
				{
					this.createList(container,range,selection,item.type);
				}
				return true;
			}
		};
		
		this.createList = function(container,range,selection,type)
		{
			var fragment = range.extractContents();
			var list = this.doc.createElement(type);
			list.setAttribute("class","nsExecCommandList");
			var li = this.doc.createElement("li");
			li.style.cssText = container.style.cssText;
			li.appendChild(fragment);
			list.appendChild(li);
			range.insertNode(list);
			selection.selectAllChildren(list);
		};
		
		this.removeList = function(range)
		{
			var list = range.commonAncestorContainer;
			if(list.childNodes && list.childNodes.length) 
			{
				var arrChildren = list.childNodes;
				for(var count = 0;count < arrChildren.length;count++)
				{
					var child = arrChildren[count];
					if(child.childNodes && child.childNodes.length > 1 && 
					   child.firstChild.nodeType != Node.TEXT_NODE &&
					   child.firstChild.nodeType != Node.COMMENT_NODE)
					{
						var span = this.doc.createElement("span");
						span.setAttribute("class","nsExecListCommand");
						for(var childCount = 0;childCount < child.childNodes.length;childCount++)
						{
							span.appendChild(child.childNodes[childCount]);
						}
				        list.parentElement.insertBefore(span,list);
					}
					else 
					{
				        var text = this.doc.createTextNode(child.textContent);
				        list.parentElement.insertBefore(text,list);
				    }
				}
			}
			list.parentElement.removeChild(list);
		};
		
		this.removeListItem = function(container,range,selection,type) 
		{
			this.movePreviousListItem(container,type);
			this.moveNextListItem(container,type);
			var span = this.doc.createElement("span");
			span.setAttribute("class","nsExecListCommand");
			span.style.cssText = container.style.cssText;
			var fragment = range.extractContents();
			span.appendChild(fragment);
			var dest = container.parentElement.nextElementSibling ? container.parentElement.nextElementSibling : container.parentElement.parentElement.lastChild;
			container.parentElement.parentElement.insertBefore(span,dest);
			selection.selectAllChildren(container);
			var list = container.parentElement;
			list.removeChild(container);
			if(!list.childNodes || !list.childNodes.length) 
			{
			    list.parentElement.removeChild(list);
			}
		};
		
		this.movePreviousListItem = function(container,type) 
		{
			if (container.previousElementSibling && container.previousElementSibling.nodeName.toLowerCase() == "li") 
			{
			    var list = this.moveListItem(container.previousElementSibling,true,type);
			    if (list) 
			    {
			    	container.parentElement.parentElement.insertBefore(list,container.parentElement);
			    }
			}
		};
		
		this.moveNextListItem = function(container,type) 
		{
			if (container.nextElementSibling && container.nextElementSibling.nodeName.toLowerCase() == "li") 
			{
			    var list = this.moveListItem(container.nextElementSibling,false,type);
			    if(list) 
			    {
			    	if(container.parentElement.nextSibling)
			    	{
			    		container.parentElement.parentElement.insertBefore(list,container.parentElement.nextSibling);
			    	}
			    	else
			    	{
			    		container.parentElement.parentElement.appendChild(list);
			    	}
			    }
			}
		};
		
		this.moveListItem = function(sibling,isPrevious,type) 
		{
			if(!sibling || sibling.nodeName.toLowerCase() != "li") 
			{
			    return null;
			}
			var children = [];
			while (sibling && sibling.nodeName.toLowerCase() == "li") 
			{
			    children.push(sibling);
			    sibling = isPrevious ? sibling.previousElementSibling : sibling.nextElementSibling;
			}
			if (!children || children.length <= 0) 
			{
			    return null;
			}
			var list = this.doc.createElement(type);
			list.setAttribute("class","nsExecCommandList");
			if(isPrevious) 
			{
				children.reverse();
			}
			for(var count = 0;count < children.length;count++)
			{
				list.appendChild(children[count]);
			}
			return list;
		};
		
		/********* end of List related functions *******************/
		
	    this.initialize();
		
    };
	
	return NSExecCommand;
})();
nsModuleExport(__nsGlobal,"NSExecCommand",NSExecCommand);