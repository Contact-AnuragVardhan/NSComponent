var NSFooterComp = (function()
{
	var NSFooterComp = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		
		this.__compElementPathContainerContainer = null;
		this.__compElementPath = null;
		this.__compWords = null;
		this.__compChars = null;
		
		this.__excludeSpace = true;
		
		this.setSettings = function()
		{
			this.__nsEditor.__config["enableElementPath"] = this.util.isUndefinedOrNull(this.__nsEditor.__setting["enableElementPath"]) ? true : Boolean.parse(this.__nsEditor.__setting["enableElementPath"]);
			this.__nsEditor.__config["enableWordsCount"] = this.util.isUndefinedOrNull(this.__nsEditor.__setting["enableWordsCount"]) ? true : Boolean.parse(this.__nsEditor.__setting["enableWordsCount"]);
			this.__nsEditor.__config["enableCharsCount"] = this.util.isUndefinedOrNull(this.__nsEditor.__setting["enableCharsCount"]) ? true : Boolean.parse(this.__nsEditor.__setting["enableCharsCount"]);
		};
		
		this.initialize = function()
		{
		};
		
		this.componentsInitialized = function()
		{
			if(this.__nsEditor.__config["enableElementPath"])
			{
				this.__compElementPathContainer = this.util.createElement("div",null,"nsEditorElementPathContainer");
				this.__nsEditor.__divFooterLeftContainer.appendChild(this.__compElementPathContainer);
				this.__compElementPath = this.util.createElement("ul",null,"nsEditorElementPath");
				this.__compElementPathContainer.appendChild(this.__compElementPath);
			}
			if(this.__nsEditor.__config["enableWordsCount"])
			{
				this.__compWords = this.util.createElement("span",null,"nsEditorWordsContainer");
				this.__nsEditor.__divFooterRightContainer.appendChild(this.__compWords);
			}
			if(this.__nsEditor.__config["enableCharsCount"])
			{
				this.__compChars = this.util.createElement("span",null,"nsEditorCharsContainer");
				this.__nsEditor.__divFooterRightContainer.appendChild(this.__compChars);
			}
			this.__nsEditor.__listenInternalEvent("change keyup",this.__keyEventHandler.bind(this));
			this.__nsEditor.__listenInternalEvent("mousedown change keyup click selectionchange selectionstart",this.__pathChangeHandler.bind(this));
			this.__refreshFooterComp();
			this.__setElementPath();
		};
		
		this.resized = function(event)
		{
			
		};
		
		this.destroy = function()
		{
		};
		
		this.__keyEventHandler = function(event)
		{
			//var eventDetail = event.detail;
			//var orignalEvent = eventDetail.orignalEvent;
			this.__refreshFooterComp();
		};
		
		this.__pathChangeHandler = function(event)
		{
			//var eventDetail = event.detail;
			//var orignalEvent = eventDetail.orignalEvent;
			this.__setElementPath();
		};
		
		this.__refreshFooterComp = function()
		{
			if(this.__compWords)
			{
				this.__compWords.innerHTML = "Words: " + this.__getWordCount();
			}
			if(this.__compChars)
			{
				this.__compChars.innerHTML = "Chars: " + this.__getCharCount();
			}
		};
		
		this.__setElementPath = function()
		{
			if(this.__compElementPath)
			{
				var element = this.selection.getElementUnderCursor();
				this.__compElementPath.innerHTML = "";
				//var html = "";
				if(element)
				{
					var textArea = this.__nsEditor.__getTextArea();
					var self = this;
					var scanParent = function(paramElement)
					{
						 if(paramElement && textArea !== paramElement && !self.util.isTextNode(paramElement)) 
						 {
							 var name = paramElement.nodeName.toLowerCase();
							 var path = self.__getXPathByElement(paramElement,textArea).replace(/^\//, "");
							 var li = self.__getLI(paramElement,path,name,"Select " + name);
							 if(self.__compElementPath.firstChild)
							 {
								 self.__compElementPath.insertBefore(self.__getSeparatorLI(),self.__compElementPath.firstChild);
							 }
							 self.__compElementPath.insertBefore(li,self.__compElementPath.firstChild);
							 //html = name + (html ? " > " : "") + html;
							 //console.log(html);
						 }
					};
					this.util.findParentByCallback(element,scanParent,textArea);
				}
				//this.__compElementPathContainer.innerHTML = html ? ("Path: " + html) : "";
			}
		};
		
		this.__getSeparatorLI = function() 
		{
			var html = "<li> > </li>";
			var li = this.util.getElementFromHtml(html);
            var a = li.firstChild;
            return li;
		};
		
		this.__getLI = function(bindElement, path, name, title) 
		{
			var html = "<li class=\"nsEditorElementPathItem\"><a role=\"button\" data-nseditor-path=\"" + path + "\" href=\"javascript:void(0)\" title=\"" + title + "\" tabindex=\"-1\"'>" + name + "</a></li>";
            var li = this.util.getElementFromHtml(html);
            var a = li.firstChild;
            this.util.addEvent(a,"click",this.__selectPathHandler.bind(this,bindElement,path,name));
            //this.util.addEvent(a,"contextmenu",this.__contextMenuHandler.bind(this,bindElement));
            return li;
        };
        
        this.__getXPathByElement = function(element, textArea)
        {
        	if (!element || element.nodeType !== 1) 
        	{
                return "";
            }
            if (!element.parentNode || textArea === element) 
            {
                return "";
            }
            if (element.id) 
            {
                return "//*[@id='" + element.id + "']";
            }
            var arrSameElement = [].filter.call(element.parentNode.childNodes, function (node) { return node.nodeName === element.nodeName; });
            var parentPath = this.__getXPathByElement(element.parentNode, textArea);
            var indexString = arrSameElement.length > 1 ? "[" + (Array.from(arrSameElement).indexOf(element) + 1) + "]": "";
            var retString = parentPath + "/" +  element.nodeName.toLowerCase() + indexString;
            return retString;
        };
        
        this.__selectPathHandler = function(element,path,name,event)
        {
        	try 
        	{
        		var doc = this.__nsEditor.__getDocument();
        		var textArea = this.__nsEditor.__getTextArea();
                var pathElements = doc.evaluate(path,textArea, null, XPathResult.ANY_TYPE, null);
                var selectedElement = pathElements.iterateNext();
                if (selectedElement) 
                {
                	this.selection.selectElement(selectedElement);
                    return;
                }
            }
            catch (error) 
            { 
            }
            this.selection.selectElement(element);
            return;
        };
		
		this.__getWordCount = function()
		{
			var wordcount = 0;
			var html = this.__nsEditor.__getHtmlFromTextArea() || "";
			if(html.replace(/\s*<[^>]*?>\s*/g, '') !== '') 
			{
	            if (html.trim() !== "") 
	            {
	            	//remove inline tags without adding spaces
	            	html = html.replace(/<\/?(b|i|em|strong|span|u|strikethrough|a|img|small|sub|sup|label)( [^>*?])?>/gi, '');
	            	//replace adjacent tags with possible space between with a space
	            	html = html.replace(/(<[^>]*?>\s*<[^>]*?>)/ig, ' ');
	            	//remove any singular tags
	                html = html.replace(/(<[^>]*?>)/ig, '');
	                //condense spacing
	                html = html.replace(/\s+/ig, ' ');
	                //count remaining non-space strings
	                wordcount = html.match(/\S+/g).length; 
	            }
	        }
			return wordcount;
		};
		
		this.__getCharCount = function()
		{
			var text = this.__nsEditor.__getTextFromTextArea() || "";
			text = text.replace(/(\r\n|\n|\r)/gm,"").replace(/^\s+/g,' ').replace(/\s+$/g, ' ');
			text = this.__excludeSpace ? text.replace(this.editorUtil.SPACE_REG_EXP, "") : text;
			var charcount = text.length;
			return charcount;
		};
		
		NSEditor.prototype.getWordCount = function()
		{
			var objFooterComp = this.__pluginsInstances["footercomp"].instance;
			return objFooterComp.__getWordCount();
		};
		
		NSEditor.prototype.getCharCount = function()
		{
			var objFooterComp = this.__pluginsInstances["footercomp"].instance;
			return objFooterComp.__getCharCount();
		};
		
	};
	
	NSEditor.prototype.registerPlugin("footercomp",NSFooterComp);
	
	return NSFooterComp;
})();
nsModuleExport(__nsGlobal,"NSFooterComp",NSFooterComp);