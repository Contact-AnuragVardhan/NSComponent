 var NSExecCommand = (function()
{
	var NSExecCommand = function(nsEditor)
	{
    	this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		this.selection = nsEditor.__selection;
		this.doc = null;
		this.root = null;
		
		var self = this;
		var browser = null;
		var objCommand = {};
		var containers = "h1,h2,h3,section,ol,ul,div,p";
		
		this.initialize = function()
		{
			this.__nsEditor.__listenInternalEvent("textAreaInitialized",function(){
				self.doc = self.__nsEditor.__getDocument();
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
				justifycenter:{css: {"text-align": "center"},exec: this.handleAlignment.bind(this)},
				justifyleft: {css: {"text-align": "left"},exec: this.handleAlignment.bind(this)},
				justifyright: {css: {"text-align": "right"},exec: this.handleAlignment.bind(this)},
				justifyfull: {css: {"text-align": "justify"},exec: this.handleAlignment.bind(this)},
				subscript: {tag:"sub",css: {"vertical-align": "sub"}},
				superscript: {tag:"sup",css: {"vertical-align": "super"}},
				insertorderedlist: {exec: this.handleList.bind(this),type: "ol"},
				insertunorderedlist: {exec: this.handleList.bind(this),type: "ul"},
				undo: {},
				redo: {},
				outdent: {css: {"margin-left": "-25"},exec: this.handleDent.bind(this)},
				indent: {css: {"margin-left": "+25"},exec: this.handleDent.bind(this)},
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
		};
		
		this.execute = function(commandName,showDefaultUI,valueArgument)
		{
			var item = objCommand[commandName.toLowerCase()];
			if(item)
			{
				if(valueArgument != null && item[valueArgument])
				{
					item = item[valueArgument];
				}
				if(item)
				{
					var selection = this.selection.getSelection();
					if(item.exec)
					{
						return item.exec(item,selection,containers);
					}
					else if(item.tag || item.css)
					{
						var tag = item.tag;
						if(this.util.isFunction(tag))
						{
							tag = tag(commandName,item);
						}
						var css = item.css;
						if(item.css && valueArgument != null)
						{
							css = {};
							for(var key in item.css)
							{
								css[key.replace("##args##",valueArgument)] = item.css[key].replace("##args##",valueArgument);
							}
						}
						this.applyStyle({tag: tag,css: css,override: item.override},selection,containers);
						return true;
					}
				}
			}
			return false;
		};
		
		this.handleAlignment = function(item,selection,containers)
		{
			var anchorNode = selection.anchorNode;
			var container = this.util.findParent(anchorNode,function(node){
				if(node && self.util.isElement(node) && node.parentNode == self.root)
				{
					return true;
				}
				return false;
			},null,this.root);
			if(container)
			{
				var css = item.css;
				var style = Object.keys(css)[0];
				container.style[style] = this.getStyleValue(container,css,true,containers);
				return true;
			}
			return false;
		};
		
		this.handleDent = function(item,selection,containers)
		{
			var anchorNode = selection.anchorNode;
			var container = this.util.findParent(anchorNode,function(node){
				if(node && self.util.isElement(node) && node.parentNode == self.root)
				{
					return true;
				}
				return false;
			},null,this.root);
			if(container)
			{
				var css = item.css;
				var style = Object.keys(css)[0];
				var value = parseInt(css[style]);
				if(isStyleExists(container,style)) 
				{
				    var oldValue = parseInt(container.style[style]);
				    var newValue = oldValue + (value);
				    container.style[style] = (newValue > 0) ? (newValue + "px") : "";
				    return true;
				}
				else if(value > 0)
				{
					container.style[style] = value + "px";
					return true;
				}
			}
			return false;
		};
		
		/********* List related functions *******************/
		
		this.handleList = function(item,selection,containers)
		{
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
		
		this.applyStyle = function(option,selection,containers)
		{
			var style = Object.keys(option.css)[0];
			var anchorNode = selection.anchorNode;
			//because null == undefined is true, the code will catch both null and undefined.
			var override = (option.override == null) ? true : option.override; 
			if(anchorNode)
			{
				var container = anchorNode.nodeType != Node.TEXT_NODE && anchorNode.nodeType != Node.COMMENT_NODE ? anchorNode : anchorNode.parentElement;
				var sameSelection = container && container.innerText === selection.toString();
			}
			if (sameSelection && !isContainer(containers,container) && container.style[style] !== undefined) 
			{
			    this.updateSelection(container,option.css,override,containers);
			}
			else
			{
				this.replaceSelection(container,option.css,selection,override,containers);
			}
			this.clearEmptyTags();
		};
		
		this.updateSelection = function(container,option,override,containers) 
		{
			var style = Object.keys(option)[0];
			container.style[style] = this.getStyleValue(container,option,override,containers);
			this.cleanChildren(option,container);
			this.flattenChildren(option,container);
		};

		this.replaceSelection = function(container,option,selection,override,containers) 
		{
			var range = selection.getRangeAt(0);
			if (range.commonAncestorContainer) 
			{
				var arrList = ["ol","ul","dl"];
				for(var count = 0;count < arrList.length;count++)
				{
					var listType = arrList[count];
					if(listType == range.commonAncestorContainer.nodeName.toLowerCase())
					{
						if(this.updateSelection(range.commonAncestorContainer,option,override,containers))
						{
							break;
						}
					}
				}
			}
			var fragment = range.extractContents();
			var span = this.createSpan(container,option,override,containers);
			span.appendChild(fragment);
			this.cleanChildren(option, span);
			this.flattenChildren(option, span);
			range.insertNode(span);
			selection.selectAllChildren(span);
		};
		
		this.cleanChildren = function(option,span) 
		{
			if (!span.childNodes || !span.childNodes.length) 
			{
			    return;
			}
			var style = Object.keys(option)[0];
			var value = option[style];
			//direct children style reset
			var arrChildren = span.children;
			for(var count = 0;count < arrChildren.length;count++)
			{
				var element = arrChildren[count];
				if(element.style[style] && element.style[style] == value)
				{
					element.style[style] = "";
				    if(element.getAttribute("style") == "" || element.style === null) 
				    {
				        element.removeAttribute("style");
				    }
				}
			}
			//children's children style reset
			var arrChildren = span.children;
			for(var count = 0;count < arrChildren.length;count++)
			{
				var element = arrChildren[count];
				this.cleanChildren(option,element);
			}
		};
		
		this.flattenChildren = function(option,span) 
		{
			if (!span.childNodes || !span.childNodes.length) 
			{
			    return;
			}
			var style = Object.keys(option)[0];
			var value = option[style];
			//direct children style reset
			var arrChildren = span.children;
			var foundChild = false;
			for(var count = 0;count < arrChildren.length;count++)
			{
				var element = arrChildren[count];
				if(!element.getAttribute("style"))
				{
					foundChild = true;
					var styledChildren = element.querySelectorAll("[style]");
				    if (!styledChildren || styledChildren.length === 0) 
				    {
				        var text = this.doc.createTextNode(element.textContent);
				        element.parentElement.replaceChild(text,element);
				    }
				}
			}
			if(!foundChild)
			{
				//children's children style reset
				arrChildren = span.children;
				for(var count = 0;count < arrChildren.length;count++)
				{
					var element = arrChildren[count];
					this.flattenChildren(option,element);
				}
			}
		};

		this.createSpan = function(container,option,override,containers) 
		{
			var style = Object.keys(option)[0];
			var span = this.doc.createElement("span");
			span.setAttribute("class","nsExecCommand");
			span.style[style] = this.getStyleValue(container,option,override,containers);
			return span;
		}

		this.getStyleValue = function(container,option,override,containers) 
		{
			var style = Object.keys(option)[0];
			var value = option[style];
			if(!container) 
			{
				return value;
			}
			// for style where multiple values can exist at once
			if(!override && isStyleExists(container,style))
			{
				if(isStyleValueExists(container,style,value,override))
				{
					var arrSend = [];
					var arrValue = container.style[style].split(" ");
					for(var count = 0;count < arrValue.length;count++)
					{
						if(arrValue[count] != value)
						{
							arrSend.push(arrValue[count]);
						}
					}
					var cssVal = (arrSend.length ? arrSend.join(" ") : "initial");
					return cssVal.trim();
				}
				else
				{
					return container.style[style] + " " + value;
				}
			}
			if(isStyleValueExists(container,style,value,override)) 
			{
			    return "initial";
			}
			var node = this.findStyleNode(container,style,containers);
			if(isStyleValueExists(node,style,value,override)) 
			{
				return "initial";
			}
			return value;
		};
		
		this.findStyleNode = function(node,style,containers) 
		{
			if(node.nodeName.toUpperCase() == "HTML" || node.nodeName.toUpperCase() == "BODY") 
			{
				return null;
			}
			if(!node.parentNode) 
			{
			    return null;
			}
			/*if(isContainer(containers,node)) 
			{
			    return null;
			}*/
			if(node.style[style]) 
			{
			    return node;
			}
			return this.findStyleNode(node.parentNode,style,containers);
		};
		
		this.clearEmptyTags = function()
		{
			var arrMarker = this.root.querySelectorAll(".nsExecCommand");
			for(var count = arrMarker.length - 1;count > -1;count--)
			{
				var element = arrMarker[count];
				if (!element.innerText) 
				{
					element.parentNode.removeChild(element);
				}
			}
			
		};
		
		var isStyleValueExists = function(container,style,value,override)
		{
			if(isStyleExists(container,style)) 
			{
				if(override)
				{
					return (container.style[style] == value);
				}
				else
				{
					var arrValue = container.style[style].split(" ");
					for(var count = 0;count < arrValue.length;count++)
					{
						if(arrValue[count] == value)
						{
							return true;
						}
					}
				}
			}
			return false;
		};
		
		var isStyleExists = function(container,style)
		{
			if(container) 
			{
				return (container.style[style]);
			}
			return false;
		};
		
		var isContainer = function(containers,container) 
		{
			//to make containers optional
			if(!containers || !containers.length)
			{
				return true;
			}
	        var arrCon = containers.toLowerCase().split(",");
	        return container && container.nodeName && arrCon.indexOf(container.nodeName.toLowerCase()) > -1
	    };
		
	    this.initialize();
    };
	
	return NSExecCommand;
})();
nsModuleExport(__nsGlobal,"NSExecCommand",NSExecCommand);