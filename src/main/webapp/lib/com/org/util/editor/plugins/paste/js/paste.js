var NSEditorPaste = (function()
{
	var NSEditorPaste = function(nsEditor,callback)
	{
		this.__nsEditor = nsEditor;
		this.__callback = callback;
		this.util = nsEditor.util;
		
		this.__divTemp = null;
		this.__savedCursorPosition = null;
		this.__observer = null;
		this.__arrLinks = {};
		this.__regexAllowedTags; //E
		this.__regexAllowedAttrs; //G
		this.__regexRemoveTags; //F
		this.__regexStyleProps; //H
		this.__allowLocalImages = false;
		this.__allowComments = true;
		this.__body = null;
		this.__fullPage = false;
		this.__imageDetails = null;
		
		
        this.__allowedTags = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "queue", "rp", "rt", "ruby", "s", "samp", "script", "style", "section", "select", "small", "source", "span", "strike", "strong", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "var", "video", "wbr"];
		this.__removeTags = ["script", "style"];
		this.__allowedAttrs = ["accept", "accept-charset", "accesskey", "action", "align", "allowfullscreen", "allowtransparency", "alt", "async", "autocomplete", "autofocus", "autoplay", "autosave", "background", "bgcolor", "border", "charset", "cellpadding", "cellspacing", "checked", "cite", "class", "color", "cols", "colspan", "content", "contenteditable", "contextmenu", "controls", "coords", "data", "data-.*", "datetime", "default", "defer", "dir", "dirname", "disabled", "download", "draggable", "dropzone", "enctype", "for", "form", "formaction", "frameborder", "headers", "height", "hidden", "high", "href", "hreflang", "http-equiv", "icon", "id", "ismap", "itemprop", "keytype", "kind", "label", "lang", "language", "list", "loop", "low", "max", "maxlength", "media", "method", "min", "mozallowfullscreen", "multiple", "muted", "name", "novalidate", "open", "optimum", "pattern", "ping", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "reversed", "rows", "rowspan", "sandbox", "scope", "scoped", "scrolling", "seamless", "selected", "shape", "size", "sizes", "span", "src", "srcdoc", "srclang", "srcset", "start", "step", "summary", "spellcheck", "style", "tabindex", "target", "title", "type", "translate", "usemap", "value", "valign", "webkitallowfullscreen", "width", "wrap"];
        this.__allowedStyleProps = [".*"];
        this.__wordDeniedTags = [];
        this.__wordDeniedAttrs = [];
        this.__wordAllowedStyleProps = ["font-family", "font-size", "background", "color", "width", "text-align", "vertical-align", "background-color", "padding", "margin", "height", "margin-top", "margin-left", "margin-right", "margin-bottom", "text-decoration", "font-weight", "font-style"];
        this.__linkProtocols = ["mailto", "tel", "sms", "notes", "data"];
        this.__HTML5Map = {B: "STRONG",I: "EM",STRIKE: "S"};
        this.__blockTags = ["address", "article", "aside", "audio", "blockquote", "canvas", "details", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul", "video"];
        this.__voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"];
 
		this.__shape = {}; 
	
		
		this.setSettings = function()
		{
			this.__nsEditor.__config["pasteFromWordMode"] = this.__nsEditor.__setting["pasteFromWordMode"] || NSEditor.PASTEFROMWORD_MODE_CLEANFORMAT;
			//allows images that have local path (file://) on paste.
			this.__nsEditor.__config["pasteFromWordEnableLocalImages"] = this.util.isUndefinedOrNull(this.__nsEditor.__setting["pasteFromWordEnableLocalImages"]) ? true : Boolean.parse(this.__nsEditor.__setting["pasteFromWordEnableLocalImages"]);
			//The list of allowed CSS attributes to be used for tags on paste.
			this.__nsEditor.__config["pasteFromWordAllowedStyleProps"] = this.__nsEditor.__setting["pasteFromWordAllowedStyleProps"] || this.__wordAllowedStyleProps;
			//Attributes that are removed when pasting something into the editor.
			this.__nsEditor.__config["pasteFromWordDeniedAttrs"] = this.__nsEditor.__setting["pasteFromWordDeniedAttrs"] || this.__wordDeniedAttrs;
			//Tags that are removed together with their content when pasting something into editor.
			this.__nsEditor.__config["pasteFromWordDeniedTags"] = this.__nsEditor.__setting["pasteFromWordDeniedTags"] || this.__wordDeniedTags;

			
		};
		
		this.initialize = function()
		{
			
		};
		
		this.componentsInitialized = function()
		{
			if(!this.__divTemp)
			{
				this.__divTemp =  document.createElement("div");
	        	this.util.addStyleClass(this.__divTemp,"nsEditorHidden");
	        	document.body.appendChild(this.__divTemp);
	        	this.__divTemp.setAttribute("contenteditable",true);
	        	this.__nsEditor.__listenInternalEvent("beforepaste",this.__textAreaBeforePasteListener.bind(this));
	        	this.__nsEditor.__listenInternalEvent("paste",this.__textAreaPasteListener.bind(this));
			}
			this.__body = this.__nsEditor.__isModeTextArea() ? this.__nsEditor.__compTextArea : this.__nsEditor.__getIFrameBody();
		};
		
		this.resized = function(event)
		{
			
		};
		
		this.destroy = function()
		{
		};
		
		this.__textAreaBeforePasteListener = function(event)
		{
			var eventDetail = event.detail;
			if(window.clipboardData && window.clipboardData.getData) 
            {
				var orignalEvent = eventDetail.orignalEvent;
				this.__nsEditor.__saveSelection();
				if (window["MutationObserver"])
	            {
					this.__observer = new MutationObserver(this.__mutationObserver.bind(this,null,orignalEvent));
	        		var config = { attributes: false, childList: true, characterData: true, subtree: true };
	        		this.__observer.observe(this.__divTemp, config);
	            }
				this.__divTemp.focus();
				var range = document.createRange();
				range.selectNodeContents((this.__divTemp));
				var selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
            }
		};
		
		this.__textAreaPasteListener = function(event)
		{
			var eventDetail = event.detail;
			if(eventDetail && this.__isWordContent(eventDetail.html))
			{
				this.__callCallback(event,eventDetail.text,eventDetail.html,eventDetail.rtf);
				var orignalEvent = eventDetail.orignalEvent;
				orignalEvent.stopPropagation();
				orignalEvent.preventDefault();
			}
		};
				
		this.__mutationObserver = function(text,pasteEvent)
		{
			this.__observer.disconnect();
			this.__observer = null;
			var html = this.__divTemp.innerHTML;
			this.util.removeAllChildren(this.__divTemp);
			if(!text && window.clipboardData && window.clipboardData.getData)
			{
				text = window.clipboardData.getData("Text");
			}
			this.__callCallback(event,text,html,null);
		};
		
		this.__callCallback = function(event,text,html,rtf)
		{
			html = this.__handleWordContent(event,text,html,rtf);
			if(html)
			{
				this.__pasteHtmlAtCursor(html,false,true);
			}
		};
		
		this.__saveSelection = function()
		{
			var element = this.__nsEditor.__isModeTextArea() ? this.__nsEditor.__compTextArea : this.__nsEditor.__frameContentWindow;
			var range = this.__nsEditor.__getRange();
			var cursorPosition = this.__nsEditor.__getCursorPosition();
			return {start : cursorPosition,end: range.toString().length};
		};
		
		this.__restoreSelection = function(savedSelection)
		{
			this.__nsEditor.__restoreSelection();
			this.__nsEditor.__setFocusOnControl(true);
		};
		
		this.__pasteHtmlAtCursor = function(html,setCursorInNode,isPastedContentSelected)
		{
			this.__restoreSelection();
			this.__nsEditor.__insertHTML(html);
		};
		
		this.__handleWordContent = function(event,textContent,htmlContent,rtfContent)
		{
			var retHtml = null; 
			switch(this.__nsEditor.__config["pasteFromWordMode"])
			{
				case NSEditor.PASTEFROMWORD_MODE_PROMPT:
					var self = this;
					var promotCallback = function(event,isKeepFormatting)
					{
						retHtml = self.__formatWord.call(self,htmlContent,rtfContent,isKeepFormatting);
						if(retHtml)
						{
							self.__pasteHtmlAtCursor(retHtml,false,true);
						}
					};
					this.__nsEditor.__callPromptBox("Formatted Text Detected","The pasted content has some formatting. Do you want to keep the format or clean it up? ","Keep","Clean",
							function(event){
								promotCallback(event,true);
							},
							function(event){
								promotCallback(event,false);
							}
					);
				break;
				case NSEditor.PASTEFROMWORD_MODE_CLEANFORMAT:
					retHtml = this.__formatWord(htmlContent,rtfContent,false);
				break;
				case NSEditor.PASTEFROMWORD_MODE_KEEPFORMAT:
					retHtml = this.__formatWord(htmlContent,rtfContent,true);
				break;
			}
			return retHtml;
		};
		
		this.__formatWord = function(htmlContent,rtfContent,isKeepFormatting)
		{
			var wordAllowedStyleProps = this.__wordAllowedStyleProps;
			if(!isKeepFormatting)
			{
				this.__wordAllowedStyleProps = [];
			}
			if(htmlContent.indexOf("<colgroup>") === 0)
			{
				htmlContent = "<table>" + htmlContent + "</table>";
			}
			htmlContent = htmlContent.replace(/<span[\n\r ]*style='mso-spacerun:yes'>[\r\n\u00a0 ]*<\/span>/g, "&nbsp;");
			htmlContent = this.__getHtml(htmlContent,rtfContent);
			var div = this.util.createDiv(null);
			div.innerHTML = htmlContent;
			this.__cleanBlankSpaces(div);
			htmlContent = div.innerHTML;
			htmlContent = this.__cleanEmptyTagsAndDivs(htmlContent);
			htmlContent = htmlContent.replace(/\u200b/g, "");
			htmlContent = this.__cleanPaste(htmlContent);
			this.__wordAllowedStyleProps = wordAllowedStyleProps;

			return htmlContent;
		};
		
		this.__getHtml = function(htmlContent,rtfContent)
		{
			var self = this;
			var processUnicode = function(node)
			{
				if (node.nodeType == Node.TEXT_NODE && /\n|\u00a0/.test(node.data)) 
				{
	                if (!/\S| /.test(node.data))
	                {
	                	if(node.data == " ")
	                	{
	                		node.data = "\u200b";
	                		return true;
	                	}
	                	else
	                	{
	                		if(node.parentNode)
	                		{
	                			node.parentNode.removeChild(node);
	                		}
	                		return false;
	                	}
	                }
	                node.data = node.data.replace(/\n/gi, " ");
	            }
	            return true;
			};
			var processImage = function(node)
			{
				 if(node.nodeType != Node.ELEMENT_NODE || "V:IMAGEDATA" != node.tagName && "IMG" != node.tagName || self.__formatImageAndShape(node, rtfContent))
				 {
					 
				 };
				 return true;
			};
			var processNode = function(node)
			{
				if (node.nodeType == Node.TEXT_NODE)
				{
					node.data = node.data.replace(/<br>(\n|\r)/gi, "<br>");
					return false;
				}
				if (node.nodeType == Node.ELEMENT_NODE) 
				{
					 if (self.__hasStyleTag(node)) 
					 {
						 var parentNode = node.parentNode;
	                     var previousSibling = node.previousSibling;
	                     var tempNode = self.__processListContainer(node, objStyle);
	                     var child = previousSibling ? previousSibling.nextSibling : parentNode.firstChild;
	                     if(child)
	                     {
	                    	 parentNode.insertBefore(tempNode, child);
	                     }
	                     else
	                     {
	                    	 parentNode.appendChild(tempNode);
	                     }
	                     return false;
					 }
					 return self.__formatNodeAndChildren(node, objStyle);
				}
				if(node.nodeType == Node.COMMENT_NODE)
				{
					self.__removeNode(node);
					return false;
				}
				return true;
			};
			var processBrAndImg = function(node)
			{
				if (node.nodeType == Node.ELEMENT_NODE) 
				{
					 var tagName = node.tagName;
					 var arrBRImg = ["BR", "IMG"];
					 if(!node.innerHTML && arrBRImg.indexOf(tagName) == -1)
					 {
						 var parentNode = node.parentNode;
						 while(parentNode)
						 {
							 self.__removeNode(node);
							 node = parentNode;
							 if(!node.innerHTML)
							 {
								 parentNode = node.parentNode;
							 }
							 else
							 {
								 parentNode = null;
							 }
						 }
						 return false; 
					 }
					 self.__processStyleForNode(node);
				}
				return true;
			};
			
			htmlContent = htmlContent.replace(/[.\s\S\w\W<>]*(<html[^>]*>[.\s\S\w\W<>]*<\/html>)[.\s\S\w\W<>]*/i, "$1");
			this.__formatVShape(htmlContent);
			var domParser = new DOMParser();
			var docWord = domParser.parseFromString(htmlContent, "text/html");
			var docHead = docWord.head;
			var docBody = docWord.body;
			var objStyle = this.__getStyles(docHead);
			
			this.__processNode(docBody,processUnicode);
			this.__processNode(docBody,processImage);
			this.__processNode(docBody,processNode);
			this.__processNode(docBody,processBrAndImg);
			
			var outerHtml = docBody.outerHTML;
			var allowedStyleProps = this.__allowedStyleProps;
			this.__allowedStyleProps = this.__wordAllowedStyleProps;
			var html = this.__cleanHtml(outerHtml,this.__wordDeniedTags,this.__wordDeniedAttrs,false);
			this.__allowedStyleProps = allowedStyleProps;
			
			return html;
		};
		
		this.__cleanBlankSpaces = function(node)
		{
			if(node)
			{
				var filterNode = function(textNode)
				{
					return (textNode.textContent.match(/([ \n]{2,})|(^[ \n]{1,})|([ \n]{1,}$)/g) != null);
				};
				if(["SCRIPT", "STYLE", "PRE"].indexOf(node.tagName))
				{
					return false;
				}
				var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT,filterNode,false);
				while (treeWalker.nextNode())
				{
					var currentNode = treeWalker.currentNode;
					if(this.__isTagNotScript(currentNode.parentNode,true))
					{
						var isBlock = this.__isNodeBlock(currentNode.parentNode) || (currentNode.parentNode == this.__body);
						var textContent = currentNode.textContent.replace(/(?!^)( ){2,}(?!$)/g, " ").replace(/\n/g, " ").replace(/^[ ]{2,}/g, " ").replace(/[ ]{2,}$/g, " ");
						if(isBlock)
						{
							 var previousSibling = currentNode.previousSibling;
	                         var nextSibling = currentNode.nextSibling;
	                         if(previousSibling && nextSibling && textContent == " ")
	                         {
	                        	 if(this.__isNodeBlock(previousSibling) && this.__isNodeBlock(nextSibling))
	                        	 {
	                        		 textContent = "";
	                        	 }
	                        	 else
	                        	 {
	                        		 textContent = " ";
	                        	 }
	                         }
	                         else if(previousSibling)
	                         {
	                        	 textContent = textContent.replace(/^ */, "");
	                         }
	                         else if(nextSibling)
	                         {
	                        	 textContent = textContent.replace(/ *$/, "");
	                         }
						}
						currentNode.textContent = textContent;
					}
				}
			}
		};
		
		this.__cleanEmptyTagsAndDivs = function(htmlContent)
		{
			var div = this.util.createDiv(null);
			div.innerHTML = htmlContent;
			var arrElements = Array.prototype.slice.call(div.querySelectorAll(":scope > div:not([style]), td > div:not([style]), th > div:not([style]), li > div:not([style])"));
			var elements = this.__trimElements(arrElements);
			while(elements.length > 0)
			{
				var element = elements[elements.length - 1];
				var defaultTag = this.__getDefaultTag();
				if(defaultTag && defaultTag != "div")
				{
					var blocktags = this.__blockTags.join(", ");
					if(element.querySelector(blocktags))
					{
						element.outerHTML = element.innerHTML;
					}
					else
					{
						element.outerHTML = "<" + defaultTag + ">" + element.innerHTML + "</" + defaultTag + ">";
					}
				}
				else
				{
					var arrChild = element.querySelectorAll("*");
					if(arrChild.length == 0 || arrChild[arrChild.length - 1].tagName !== "BR" && element.innerText.length === 0)
					{
						element.outerHTML = element.innerHTML + "<br>";
					}
					else
					{
						element.outerHTML = element.innerHTML;
					}
				}
				arrElements = Array.prototype.slice.call(div.querySelectorAll(":scope > div:not([style]), td > div:not([style]), th > div:not([style]), li > div:not([style])"));
				elements = this.__trimElements(arrElements);
			}
			arrElements = Array.prototype.slice.call(div.querySelectorAll("div:not([style])"));
			elements = this.__trimElements(arrElements);
			while(elements.length > 0)
			{
				for(var count = 0;count < elements.length;count++)
				{
					var element = elements[count];
					var html = element.innerHTML.replace(/\u0009/gi, "").trim();
					element.outerHTML = html;
				}
				arrElements = Array.prototype.slice.call(div.querySelectorAll("div:not([style])"));
				elements = this.__trimElements(arrElements);
			}
			
			return div.innerHTML;
		};
		
		this.__cleanPaste = function(htmlContent)
		{
			 if(htmlContent.toLowerCase().indexOf("<body") >= 0)
			 {
				 htmlContent = htmlContent.replace(/[.\s\S\w\W<>]*<body[^>]*>[\s]*([.\s\S\w\W<>]*)[\s]*<\/body>[.\s\S\w\W<>]*/gi, "$1");
			 }
			 htmlContent = htmlContent.replace(/ \n/g, " ").replace(/\n /g, " ").replace(/([^>])\n([^<])/g, "$1 $2");
			 if(htmlContent.indexOf('id="docs-internal-guid') >= 0)
			 {
				 htmlContent = htmlContent.replace(/^[\w\W\s\S]* id="docs-internal-guid[^>]*>([\w\W\s\S]*)<\/b>[\w\W\s\S]*$/g, "$1");
			 }
			 
			 return htmlContent;
		};
		
		this.__cleanHtml = function(outerHtml,deniedTags,deniedAttrs)
		{
			if(!deniedTags)
			{
				deniedTags = [];
			}
			if(!deniedAttrs)
			{
				deniedAttrs = [];
			}
			var htmlAllowedTags = this.util.cloneObject(this.__allowedTags,true);
			for(var count = 0;count < deniedTags.length;count++)
			{
				if(htmlAllowedTags.indexOf(deniedTags[count]) > -1)
				{
					htmlAllowedTags.splice(htmlAllowedTags.indexOf(deniedTags[count]), 1);
				}
			}
			var htmlAllowedAttrs = this.util.cloneObject(this.__allowedAttrs,true);
			for(var count = 0;count < deniedAttrs.length;count++)
			{
				if(htmlAllowedAttrs.indexOf(deniedAttrs[count]) > -1)
				{
					htmlAllowedAttrs.splice(htmlAllowedAttrs.indexOf(deniedAttrs[count]), 1);
				}
			}
			//htmlAllowedAttrs.push("data-nsEditor-.*");
			htmlAllowedAttrs.push("nsEditor-.*");
			this.__regexAllowedTags = new RegExp("^" + htmlAllowedTags.join("$|^") + "$","gi");
			this.__regexAllowedAttrs = new RegExp("^" + htmlAllowedAttrs.join("$|^") + "$","gi");
			this.__regexRemoveTags = new RegExp("^" + this.__removeTags.join("$|^") + "$","gi");
			this.__regexStyleProps = this.__allowedStyleProps.length > 0 ? new RegExp("((^|;|\\s)" + this.__allowedStyleProps.join(":.+?(?=;|$))|((^|;|\\s)") + ":.+?(?=(;)|$))","gi") : null;
			outerHtml = this.__handleMainTags(outerHtml,this.__handleElementTags.bind(this),true);
			return outerHtml;
		};
		
		this.__handleMainTags = function(outerHtml,callback,isExtractHead)
		{
			outerHtml = this.__formatOuterHtml(outerHtml);
			var outerHtmlCopy = outerHtml;
			var header = null;
			if(this.__fullPage)
			{
				outerHtmlCopy = this.__extractNode(outerHtml, "body") || (outerHtml.indexOf("<body") >= 0 ? "" : outerHtml);
			}
			if(isExtractHead)
			{
				header =  this.__extractNode(outerHtml, "head") || "";
			}
			outerHtmlCopy = this.__handleDifferentContent(outerHtmlCopy,callback);
			if(header)
			{
				header = this.__handleDifferentContent(header,callback);
			}
			var html = this.__getMainHtml(outerHtmlCopy,header,outerHtml);
			return this.__handleScript(html);
		};
		
		this.__handleScript = function(html) 
		{
			var self = this;
			html = html.replace(/\[EDITOR\.SCRIPT ([\d]*)\]/gi, function(str, index) 
            {
                return self.__removeTags.indexOf("script") >= 0 ? "" : I[parseInt(index, 10)];
            });
			html = html.replace(/\[EDITOR\.NOSCRIPT ([\d]*)\]/gi,function(str, index) 
            {
                return self.__removeTags.indexOf("noscript") >= 0 ? "" : I[parseInt(index, 10)].replace(/\&lt;/g, "<").replace(/\&gt;/g, ">");
            });
			//html = html.replace(/<img((?:[\w\W]*?)) data-nsEditor-src="/g, '<img$1 src="');
			return html;
        };
		
		this.__handleElementTags = function(node)
		{
			var arrChildren = this.__getContents(node);
			for(var count = 0;count < arrChildren.length; count++)
			{
				if(arrChildren[count].nodeType != Node.TEXT_NODE)
				{
					this.__handleElementTags(arrChildren[count]);
				}
			}
			this.__handleSpecificTags(node);
		};
		
		this.__handleSpecificTags = function(node) 
		{
            if (node.tagName == "SPAN"  && (node.getAttribute("class") || "").indexOf("nsEditor-marker") >= 0)
            {
            	return false;
            }
            if(node.tagName == "PRE")
            {
            	this.__replaceNewLineWithBR(node);
            }
            if(node.nodeType == Node.ELEMENT_NODE)
            {
            	/*if(node.getAttribute("data-nsEditor-src") && node.getAttribute("data-nsEditor-src").indexOf("blob:") !== 0)
            	{
            		node.setAttribute("data-nsEditor-src", this.__sanitizeURL(this.__getTextContent(node.getAttribute("data-nsEditor-src"))));
            	}*/
            	if(node.getAttribute("href"))
                {
                	node.setAttribute("href", this.__sanitizeURL(this.__getTextContent(node.getAttribute("href"))));
                }
                if(node.getAttribute("src"))
                {
                	node.setAttribute("src", this.__sanitizeURL(this.__getTextContent(node.getAttribute("src"))));
                }
                if(["TABLE", "TBODY", "TFOOT", "TR"].indexOf(node.tagName) >= 0)
                {
                	node.innerHTML = node.innerHTML.trim();
                }
            }
            if (!this.__allowLocalImages && node.nodeType == Node.ELEMENT_NODE && "IMG" == node.tagName && node.getAttribute("data-nsEditor-src") && 0 === node.getAttribute("data-nsEditor-src").indexOf("file://"))
            {
            	node.parentNode.removeChild(node);
            	return false;
            }
            if (node.nodeType == Node.ELEMENT_NODE && this.__HTML5Map[node.tagName] && "" === this.__getAttributesAsString(node)) 
            {
                var tag = this.__HTML5Map[node.tagName];
                var html = "<" + tag + ">" + node.innerHTML + "</" + tag + ">";
                node.insertAdjacentHTML("beforebegin", html);
                node = node.previousSibling;
                node.parentNode.removeChild(node.nextSibling);
            }
            if (this.__allowComments || node.nodeType != Node.COMMENT_NODE)
            {
            	if (node.tagName && node.tagName.match(this.__regexRemoveTags))
            	{
            		node.parentNode.removeChild(node);
            	}
                else if (node.tagName && !node.tagName.match(this.__regexAllowedTags))
                {
                	if("svg" === node.tagName)
                	{
                		node.parentNode.removeChild(node);
                	}
                	else if(this.__nsEditor.isSafari && "path" == node.tagName && node.parentNode && "svg" == node.parentNode.tagName)
                	{
                		node.outerHTML = node.innerHTML;
                	}
                }
                else 
                {
                    var attributes = node.attributes;
                    if(attributes)
                    {
                    	for (var count = attributes.length - 1; count >= 0; count--) 
                    	{
                            var attribute = attributes[count];
                            var arrName = attribute.nodeName.match(this.__regexAllowedAttrs);
                            var arrValue = null;
                            if(attribute.nodeName === "style" && this.__allowedStyleProps.length > 0) 
                            {
                            	arrValue = attribute.value.match(this.__regexStyleProps);
                            }
                            if(arrName && arrValue)
                            {
                            	attribute.value = this.__addSemicolon(arrValue.join(";"));
                            }
                            else if((!arrName || attribute.nodeName == "style" && !arrValue))
                            {
                            	node.removeAttribute(attribute.nodeName);
                            }
                        }
                    }
                }
            }
            else if(node.data.indexOf("[EDITOR") !== 0)
            {
            	node.parentNode.removeChild(node);
            }
        };
		
		this.__handleDifferentContent = function(outerHtml,callback)
		{
			var domParser = new DOMParser(); 
			var html = domParser.parseFromString(outerHtml, "text/html");
			var body = html.body;
			var retValue = "";
			if(body)
			{
				var arrContent = this.__getContents(body);
				for(var count = 0;count < arrContent.length;count++)
				{
					callback(arrContent[count]);
				}
				arrContent = this.__getContents(body);
				for(var count = 0;count < arrContent.length;count++)
				{
					retValue += this.__replaceCustomNode(arrContent[count]);
				}
			}
			return retValue;
		};
		
		this.__replaceCustomNode = function(node,isReplaceTextNode)
		{
			if (node.nodeType == Node.COMMENT_NODE)
			{
				return "<!--" + node.nodeValue + "-->";
			}
            if (node.nodeType == Node.TEXT_NODE)
            {
            	return isReplaceTextNode ? node.textContent.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : node.textContent.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\u00A0/g, "&nbsp;").replace(/\u0009/g, "");
            }
            if (node.nodeType != Node.ELEMENT_NODE)
            {
            	return node.outerHTML;
            }
            if (node.nodeType == Node.ELEMENT_NODE && ["STYLE", "SCRIPT", "NOSCRIPT"].indexOf(node.tagName) >= 0)
            {
            	return node.outerHTML;
            }
            if (node.nodeType == Node.ELEMENT_NODE && "svg" == node.tagName) 
            {
                var div = this.util.createDiv(null);
                var clonedNode = node.cloneNode(true);
                div.appendChild(clonedNode);
                return div.innerHTML;
            }
            if ("IFRAME" == node.tagName)
            {
            	return node.outerHTML.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">");
            }
            var childNodes = node.childNodes;
            if (childNodes.length === 0)
            {
            	return node.outerHTML;
            }
            var html = "";
            for (var count = 0;count < childNodes.length;count++)
            {
            	if(node.tagName === "PRE")
            	{
            		isReplaceTextNode = true;
            	}
            	html += this.__replaceCustomNode(childNodes[count],isReplaceTextNode);
            }
            html = this.__openTagString(node) + html +  this.__closeTagString(node);
            return html;
		};
		
		this.__getMainHtml = function(bodyHtml,node,html)
		{
			if (this.__fullPage) 
			{
                var docType = this.__extractDoctype(html);
                var htmlText = this.__handleStyle(this.__extractNodeAttrs(html, "html"));
                node = null == node ? this.__extractNode(html, "head") || "<title></title>" : node;
                var head = this.__handleStyle(this.__extractNodeAttrs(html, "head"));
                var body = this.__handleStyle(this.__extractNodeAttrs(html, "body"));
                return docType + "<html" + htmlText + "><head" + head + ">" + node + "</head><body" + body + ">" + bodyHtml + "</body></html>";
            }
            return bodyHtml;
		};
		
		this.__handleStyle = function(attribute)
		{
			for(var key in attribute)
			{
				if(attribute[key])
				{
					var arrKey = key.match(this.__regexAllowedAttrs);
					var arrValue = null;
					if(key === "style" && this.__allowedStyleProps.length > 0)
					{
						arrValue = attribute[key].match(H);
					}
					if(arrKey && arrValue)
					{
						attribute[key] = this.__addSemicolon(arrValue.join(";"));
					}
					else if(!arrKey || key == "style" || !arrValue)
					{
						delete attribute[key];
					}
				}
			}
			var retValue = "";
			var arrKey = Object.keys(attribute).sort();
			for (var count = 0;count < arrKey.length;count++)
			{
				var key = arrKey[count];
				retValue += attribute[key].indexOf('"') < 0 ? " " + key + '="' + attribute[key] + '"' : " " + key + "='" + attribute[key] + "'";
			}
			return retValue;
		};
		
		this.__formatOuterHtml = function(outerHtml)
		{
			var arrPush= [];
			outerHtml = outerHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, function(html) {
                 arrPush.push(html);
                 return "[EDITOR.SCRIPT " + (arrPush.length - 1) + "]";
            });
            outerHtml = outerHtml.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, function(html) {
                arrPush.push(html);
                return "[EDITOR.NOSCRIPT " + (arrPush.length - 1) + "]";
            });
            //outerHtml = outerHtml.replace(/<img((?:[\w\W]*?)) src="/g, '<img$1 data-nsEditor-src="');
			return outerHtml;
		};
		
		this.__getHtmlBody = function(htmlContent)
		{
			htmlContent = htmlContent.replace(/[.\s\S\w\W<>]*(<html[^>]*>[.\s\S\w\W<>]*<\/html>)[.\s\S\w\W<>]*/i, "$1");
			
		};
		
		this.__processStyleForNode = function(node)
		{
			var style = node.getAttribute("style");
			if(style)
			{
				style = this.__formatCSSClass(style);
				if(style && style.slice(-1) != ";")
				{
					style += ";";
				}
				var formattedStyle = style.match(/(^|\S+?):.+?;{1,1}/gi);
				if(formattedStyle)
				{
					var objProp = {};
					for (var count = 0; count < formattedStyle.length; count++) 
					{
						var styleValue = formattedStyle[count];
						var arrStyleValue = styleValue.split(":");
						if(arrStyleValue.length === 2 && (arrStyleValue[0] != "text-align" || node.tagName != "SPAN"))
						{
							objProp[arrStyleValue[0]] = arrStyleValue[1];
						}
					}
					var finalStyle = "";
					for(var prop in objProp)
					{
						if(objProp[prop])
						{
							if(prop == "font-size" && objProp[prop].slice(-3) == "pt;")
							{
								var value = null;
								try
								{
									value = parseFloat(objProp[prop].slice(0, -3), 10);
								}
								catch(error)
								{
									
								}
								if(value)
								{
									value = Math.round(1.33 * value);
									objProp[prop] = value + "px;";
								}
							}
							finalStyle += prop + ":" + objProp[prop];
						}
					}
					if(finalStyle)
					{
						node.setAttribute("style",finalStyle);
					}
				}
			}
		};
		
		this.__processNode = function(node,callback)
		{
			if(callback(node))
			{
				var child = node.firstChild;
				while(child)
				{
					var childCopy = child;
					var prevChild = child.previousSibling;
					child = child.nextSibling;
					this.__processNode(childCopy,callback);
					childCopy.previousSibling || childCopy.nextSibling || childCopy.parentNode || !child || prevChild == child.previousSibling || !child.parentNode ? childCopy.previousSibling || childCopy.nextSibling || childCopy.parentNode || !child || child.previousSibling || child.nextSibling || child.parentNode || (prevChild ? child = prevChild.nextSibling ? prevChild.nextSibling.nextSibling : null : node.firstChild && (child = node.firstChild.nextSibling)) : child = prevChild ? prevChild.nextSibling : node.firstChild;
					/*if(childCopy.previousSibling || childCopy.nextSibling || childCopy.parentNode || !child || prevChild == child.previousSibling)
					{
						if(child && child.parentNode)
						{
							child = prevChild ? prevChild.nextSibling : node.firstChild;
						}
						else if(childCopy.previousSibling || childCopy.nextSibling || childCopy.parentNode || !child || child.previousSibling || 
								child.nextSibling || child.parentNode)
						{
							if(prevChild)
							{
								child = prevChild.nextSibling ? prevChild.nextSibling.nextSibling : null;
							}
							else if(node.firstChild)
							{
								child = node.firstChild.nextSibling;
							}
						}
							
					}*/
				}
			}
			
		};
		
		this.__processListContainer = function(node,objStyle)
		{
			var regex = /[0-9a-zA-Z]./gi;
	        var isContainerol = false;
	        if(node.firstElementChild && node.firstElementChild.firstElementChild && node.firstElementChild.firstElementChild.firstChild)
	        {
	        	isContainerol = isContainerol || regex.test(node.firstElementChild.firstElementChild.firstChild.data || "");
	        }
	        if(!isContainerol && node.firstElementChild.firstElementChild.firstElementChild && node.firstElementChild.firstElementChild.firstElementChild.firstChild)
	        {
	        	isContainerol = isContainerol || regex.test(node.firstElementChild.firstElementChild.firstElementChild.firstChild.data || "");
	        }
	        var container = isContainerol ? "ol" : "ul";
	        var style = this.__formatListStyle(node);
	        var htmlContent = this.__getListItemHtml(node,objStyle);
	        var html = "<" + container + "><li>" + htmlContent;
	        var nextNode = node.nextElementSibling;
	        var parentNode = node.parentNode;
	        this.__removeNode(node);
	        node = null;
	        while(nextNode && this.__hasStyleTag(nextNode))
	        {
	        	var prevElement = nextNode.previousElementSibling;
	        	var formattedStyle = this.__formatListStyle(nextNode);
	        	if(formattedStyle > style)
	        	{
	        		var list = this.__processListContainer(nextNode,objStyle);
	        		html += list.outerHTML;
	        	}
	        	else if(formattedStyle < style)
	        	{
	        		break;
	        	}
	        	else
	        	{
	        		html += "</li><li>" + this.__getListItemHtml(nextNode,objStyle);
	        	}
	        	style = formattedStyle;
	        	if(nextNode.previousElementSibling || nextNode.nextElementSibling || nextNode.parentNode)
	        	{
	        		var nodeTemp = nextNode;
	        		nextNode = nextNode.nextElementSibling;
	        		this.__removeNode(nodeTemp);
	        		nodeTemp = null;
	        	}
	        	else
	        	{
	        		nextNode = prevElement ? prevElement.nextElementSibling : parentNode.firstElementChild;
	        	}
	        }
	        html += "</li></" + container + ">";
	        var div = this.util.createDiv(null);
	        div.innerHTML = html;
	        return div.firstElementChild;
		};
		
		this.__getListItemHtml = function(node,objStyle)
		{
			var self = this;
			var processNode = function(node)
			{
				 if(node.nodeType == Node.ELEMENT_NODE && node.getAttribute("style") == "mso-list:Ignore")
				 {
					 node.parentNode.removeChild(node);
				 }
				 self.__formatNodeAndChildren(node,objStyle);
				 return true;
			};
			var clonedNode = node.cloneNode(true);
			var arrHeader = ["H1", "H2", "H3", "H4", "H5", "H6"];
            if (arrHeader.indexOf(node.tagName) > -1) 
            {
                var dupNode = document.createElement(node.tagName.toLowerCase());
                dupNode.setAttribute("style", node.getAttribute("style"));
                dupNode.innerHTML = clonedNode.innerHTML;
                clonedNode.innerHTML = dupNode.outerHTML;
            }
            this.__processNode(clonedNode,processNode);
            var html = clonedNode.innerHTML;
            html = html.replace(/<!--[\s\S]*?-->/gi, "");
            return html;
		};
		
		this.__formatNodeAndChildren = function(node,objStyle)
		{
			var arrScript = ["SCRIPT", "APPLET", "EMBED", "NOFRAMES", "NOSCRIPT"];
			var tagName = node.tagName;
			node.firstElementChild && (node.firstElementChild.tagName == "I" ? this.__replaceNode(node.firstElementChild, "em") : 
				node.firstElementChild.tagName == "B" && this.__replaceNode(node.firstElementChild, "strong"));
			if(arrScript.indexOf(tagName) != -1)
			{
				this.__removeNode(node);
				return false;
			}
			/*if (node.firstElementChild)
			{
				if(node.firstElementChild.tagName == "I")
				{
					this.__replaceNode(node.firstElementChild, "em");
				}
				else if(node.firstElementChild.tagName == "B")
				{
					this.__replaceNode(node.firstElementChild, "strong");
				}
				if(arrScript.indexOf(tagName) != -1)
				{
					this.__removeNode(node);
					return false;
				}
			}*/
			if(tagName)
			{
				var arrMeta = ["META", "LINK", "XML", "ST1:", "O:", "W:", "FONT"];
	            for (var count = 0; count < arrMeta.length; count++)
	            {
	            	if (tagName.indexOf(arrMeta[count]) > -1)
	            	{
	            		if(node.innerHTML)
	            		{
	            			node.outerHTML = node.innerHTML;
	            		}
	            		this.__removeNode(node);
	            		return false;
	            	}
	            }
	            if (tagName != "TD") 
	            {
	                var cssClassAttr = node.getAttribute("class");
	                if (objStyle && cssClassAttr) 
	                {
	                	cssClassAttr = this.__formatCSSClass(cssClassAttr);
	                    var arrCssClass = cssClassAttr.split(" ");
	                    for (var count = 0;count < arrCssClass.length; count++) 
	                    {
	                        var cssClass = arrCssClass[count];
	                        var arrCSS = [];
	                        var dotCSS = "." + cssClass;
	                        arrCSS.push(dotCSS);
	                        dotCSS = tagName.toLowerCase() + dotCSS;
	                        arrCSS.push(dotCSS);
	                        for (var innerCount = 0;innerCount < arrCSS.length;innerCount++)
	                        {
	                        	if(objStyle[arrCSS[innerCount]])
	                        	{
	                        		this.__setFormatStyle(node,objStyle[arrCSS[innerCount]]);
	                        	}
	                        }
	                    }
	                    node.removeAttribute("class");
	                }
	                if(objStyle && objStyle[tagName.toLowerCase()])
	            	{
	                	this.__setFormatStyle(node,objStyle[tagName.toLowerCase()]);
	            	}
	            }
	            var arrHeaderTags = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "PRE"];
	            if (arrHeaderTags.indexOf(tagName) > -1) 
	            {
	                var cssClass = node.getAttribute("class");
	                var prop = tagName.toLowerCase() + "." + cssClass;
	                if (cssClass)
	                {
	                	if(arrHeaderTags && arrHeaderTags[prop])
	                	{
	                		this.__setFormatStyle(node, arrHeaderTags[prop]);
	                	}
	                	if(cssClass.toLowerCase().indexOf("mso") > -1)
	                	{
	                		 var formattedCSS = this.__formatCSSClass(cssClass);
	                		 formattedCSS = formattedCSS.replace(/[0-9a-z-_]*mso[0-9a-z-_]*/gi, "");
	                		 formattedCSS ? node.setAttribute("class", formattedCSS) : node.removeAttribute("class");
	                	}
	                }
	                var style = node.getAttribute("style");
	                var modifiedStyle = null;
	                if (style) 
	                {
	                    var textAlignStyle = style.match(/text-align:.+?[; "]{1,1}/gi);
	                    if(textAlignStyle)
	                    {
	                    	modifiedStyle = textAlignStyle[textAlignStyle.length - 1].replace(/(text-align:.+?[; "]{1,1})/gi, "$1");
	                    }
	                }
	                this.__formatCSSAlign(node);
	            }
	            if (tagName === "TR" && this.__formatTR(node,objStyle),
	            		tagName === "A" && !node.attributes.getNamedItem("href") && node.innerHTML && (node.outerHTML = node.innerHTML),
	            		tagName != "TD" && tagName != "TH" || node.innerHTML || (node.innerHTML = "<br>"),
	            		tagName === "TABLE" && (node.style.width = "100%"),
	            		node.getAttribute("lang") && node.removeAttribute("lang"),
	            		node.getAttribute("style") && -1 != node.getAttribute("style").toLowerCase().indexOf("mso")) 
	            		{
	                        var style = this.__formatCSSClass(node.getAttribute("style"));
	                        style = style.replace(/[0-9a-z-_]*mso[0-9a-z-_]*:.+?(;{1,1}|$)/gi, ""),
	                        style ? node.setAttribute("style", style) : node.removeAttribute("style")
	                    }
	            /*if(tagName === "TR")
	            {
	            	this.__formatTR(node,objStyle);
	            }
	            if(tagName === "A" && !node.attributes.getNamedItem("href") && node.innerHTML)
	            {
	            	node.outerHTML = node.innerHTML;
	            }
	            if(tagName != "TD" && tagName != "TH")
	            {
	            	node.innerHTML ? (node.innerHTML = "<br>") : null;
	            }
	            if(tagName === "TABLE")
	            {
	            	node.style.width = "100%";
	            }
	            if(node.getAttribute("lang"))
	            {
	            	node.removeAttribute("lang");
	            }
	            if(node.getAttribute("style") && node.getAttribute("style").toLowerCase().indexOf("mso") > -1)
	            {
	            	var style = this.__formatCSSClass(node.getAttribute("style"));
	            	style = style.replace(/[0-9a-z-_]*mso[0-9a-z-_]*:.+?(;{1,1}|$)/gi, "");
	            	style ? node.setAttribute("style", style) : node.removeAttribute("style");
	            }*/
			}
            return true;
		};
		
		this.__formatTR = function(node,objStyle)  
        {
			this.__removeAllNodeAttribute(node);
			var child = node.firstElementChild;
			var totalWidth = 0;
			var hasWidth = false;
			var width = null;
			while(child)
			{
				if(child.firstElementChild && child.firstElementChild.tagName.indexOf("W:") > -1)
				{
					child.innerHTML = child.firstElementChild.innerHTML;
					width = child.getAttribute("width");
				}
				if(width || hasWidth)
				{
					hasWidth = true;
				}
				totalWidth += parseInt(width, 10);
				if(!child.firstChild || child.firstChild && child.firstChild.data == " ")
				{
					if(child.firstChild)
					{
						this.__removeNode(child.firstChild);
					}
					child.innerHTML = "<br>";
				}
				var grandChild = child.firstElementChild;
				while(grandChild)
				{
					if(grandChild.tagName != "P" || this.__hasStyleTag(grandChild) || (child.children.length == 1))
					{
						this.__formatCSSAlign(grandChild);
						grandChild = grandChild.nextElementSibling;
					}
				}
				if(objStyle)
				{
					 var cssClass = child.getAttribute("class");
	                 if(cssClass) 
	                 {
	                	 cssClass = this.__formatCSSClass(cssClass);
	                	 var formattedCSS = cssClass.match(/xl[0-9]+/gi);
	                     if(formattedCSS) 
	                     {
	                    	 var cssTemp = formattedCSS[0];
	                    	 var dotStyle = "." + cssTemp;
	                    	 if(objStyle[dotStyle])
	                    	 {
	                    		 this.__setFormatStyle(child,objStyle[dotStyle]);
	                    	 }
	                     }
	                 }
	                 if(objStyle["td"])
                	 {
	                	 this.__setFormatStyle(child,objStyle["td"]);
                	 }
				}
				var style = child.getAttribute("style");
				if(style)
				{
					style = this.__formatCSSClass(style);
					if(style && style.slice(-1) != ";")
					{
						style += ";";
					}
				}
				var valign = child.getAttribute("valign");
				if(!valign && style)
				{
					 var verticalAlign = style.match(/vertical-align:.+?[; "]{1,1}/gi);
					 if(verticalAlign)
					 {
						 valign = verticalAlign[verticalAlign.length - 1].replace(/vertical-align:(.+?)[; "]{1,1}/gi, "$1");
					 }
				}
				var textAlignValue = null;
				if(style)
				{
					var textAlign = style.match(/text-align:.+?[; "]{1,1}/gi);
					if(textAlign)
					{
						textAlignValue = textAlign[textAlign.length - 1].replace(/text-align:(.+?)[; "]{1,1}/gi, "$1");
					}
					if(textAlignValue == "general")
					{
						textAlignValue = null;
					}
				}
				var backgroundColor = null;
				if (style) 
				{
                    var background = style.match(/background:.+?[; "]{1,1}/gi);
                    if(background)
                    {
                    	backgroundColor = background[background.length - 1].replace(/background:(.+?)[; "]{1,1}/gi, "$1");
                    }
                }
				if(valign)
				{
					child.style["vertical-align"] = valign;
				}
				if(textAlignValue)
				{
					child.style["text-align"] = textAlignValue;
				}
				if(backgroundColor)
				{
					child.style["background-color"] = backgroundColor;
				}
				if(width)
				{
					child.setAttribute("width", width);
				}
				child = child.nextElementSibling;
			}
			child = node.firstElementChild;
			while(child)
			{
				width = child.getAttribute("width");
				if(hasWidth)
				{
					 child.removeAttribute("width");
				}
				else
				{
					child.setAttribute("width", 100 * parseInt(width, 10) / totalWidth + "%");
				}
				child = child.nextElementSibling;
			}
        };
		
		this.__setFormatStyle = function(node,objStyle,isOrignal) 
		{
            if (objStyle) 
            {
                var style = node.getAttribute("style");
                style && ";" != style.slice(-1) && (style += ";"),
                objStyle && ";" != objStyle.slice(-1) && (objStyle += ";"),
                objStyle = objStyle.replace(/\n/gi, "");
                var newStyle = null;
                newStyle = isOrignal ? (style || "") + style : style + (style || "");
                node.setAttribute("style", newStyle);
            }
        };
        
        this.__formatCSSAlign = function(node)  
        {
            var parentNode = node.parentNode;
            var align = node.getAttribute("align");
            if(align)
            {
            	if(parentNode && parentNode.tagName == "TD")
            	{
            		var newStyle = parentNode.getAttribute("style") + "text-align:" + align + ";";
            		parentNode.setAttribute("style", newStyle);
            		node.removeAttribute("align");
            	}
            	else
            	{
            		node.style["text-align"] = align;
            		node.removeAttribute("align");
            	}
            }
        };
		
		this.__formatCSSClass = function(cssClass) 
		{
            return cssClass.replace(/\n|\r|\n\r|&quot;/g, "");
        };
		
		this.__replaceNode = function(node,nodeType) 
		{
			var newNode = this.util.createElement(nodeType);
            for (var count = 0; count < node.attributes.length; count++) 
            {
                var attributeName = node.attributes[count].name;
                newNode.setAttribute(attributeName, node.getAttribute(attributeName));
            }
            newNode.innerHTML = node.innerHTML;
            node.parentNode.replaceChild(newNode, node);
            return newNode;
        };
		
		this.__removeNode = function(node)
		{
            if(node.parentNode)
            {
            	node.parentNode.removeChild(node);
            }
        };
		
		this.__formatListStyle = function(node)
		{
			return node.getAttribute("style").replace(/\n/gi, "").replace(/.*level([0-9]+?).*/gi, "$1");
		};
		
		this.__hasStyleTag = function(node)
		{
			if (!node.getAttribute("style") || !/mso-list:[\s]*l/gi.test(node.getAttribute("style").replace(/\n/gi, "")))
			{
				return false;
			}
            try 
            {
                if (!node.querySelector('[style="mso-list:Ignore"]'))
                {
                	return false;
                }
            } 
            catch (error) 
            {
                return false;
            }
            return true;
		};
		
		this.__formatVShape = function(htmlContent)
		{
			var arrShape = htmlContent.split("v:shape");
			 for (var count = 1; count < arrShape.length; count++) 
			 {
				 var shape = arrShape[count];
				 var shapeID = shape.split(' id="')[1]; 
				 if (shapeID && shapeID.length > 1) 
				 {
					 shapeID = shapeID.split('"')[0];
					 var spID = shape.split(' o:spid="')[1];
					 if(spID && spID.length > 1)
					 {
						 spID = spID.split('"')[0];
						 this.__shape[shapeID] = spID;
					 }
				 }
			 }
		};
		
		this.__formatImageAndShape = function(node,rtfCode)
		{
			if(node.tagName == "IMG") 
			{
				var applyStyle = function(element,styleName)
				{
					if(element && element.hasAttribute(styleName))
					{
						element.style[styleName] = element.getAttribute(styleName) + "px";
						delete element.removeAttribute(styleName);
					}
				};
				var src = node.getAttribute("src");
				var alt = node.getAttribute("alt");
				if (src && src.match(/^file:\/\//) && alt && (alt.match(/^https?:\/\//) || alt.match(/^http?:\/\//)))
				{
					node.setAttribute("src",node.getAttribute("alt"));
					node.setAttribute("data-nseditor-src",node.getAttribute("src"));
					applyStyle(node,"width");
					applyStyle(node,"height");
					return;
				}
			}
			var spId = null;
			if(rtfCode)
			{
				if ("IMG" == node.tagName) 
				{
					 var src = node.getAttribute("src");
					 if (!src || src.indexOf("file://") === -1)
					 {
						 return;
					 }
					 spId = this.__shape[node.getAttribute("v:shapes")];
					 if(!spId)
					 {
						 spId = node.getAttribute("v:shapes");
					 }
				}
			}
			else
			{
				spId = node.parentNode.getAttribute("o:spid");
			}
			node.removeAttribute("height");
			if(spId)
			{
				 
				 if(!this.__imageDetails)
				 {
					 this.__getImageDetails(rtfCode);
				 }
	             var imageDetails = this.__imageDetails[spId.substring(7)];
	             if(imageDetails) 
	             {
	                 var base64 = this.__getBase64FromHex(imageDetails.hex);
	                 var src = "data:" + imageDetails.type + ";base64," + base64;
	                 if(node.tagName == "IMG")
	                 {
	                	 node.src = src;
	                 }
	                 else
	                 {
	                	 var img = this.util.createElement("img",null,node.parentNode.getAttribute("style"));
	                	 img.src = src;
	                	 node.parentNode.parentNode.insertBefore(img, node.parentNode);
	                	 node.parentNode.parentNode.removeChild(node.parentNode);
	                 }
	             }
			}
		};
		
		this.__getImageDetails = function(rtfCode)
		{
			this.__imageDetails = {};
			this.__populateImageDetails(rtfCode,"i","\\shppict");
			this.__populateImageDetails(rtfCode,"s","\\shp{");
		};
		
		this.__populateImageDetails = function(rtfCode,tagInit,splitTag)
		{
			var arrCode = rtfCode.split(splitTag);
			for(var count = 1;count < arrCode.length;count++)
			{
				 var code = arrCode[count];
				 code = code.split("shplid");
				 if(code.length > 1)
				 {
					 code = code[1];
					 var tagID = "";
					 for (var codeLength = 0; codeLength < code.length;codeLength++)
					 {
						 if(code[codeLength] != "\\" && code[codeLength] != "{" && code[codeLength] != " "  && code[codeLength] != "\r" &&  code[codeLength] != "\n")
					     {
							 tagID += code[codeLength];
					     }
						 else
						 {
							 break;
						 }
					 }
					 var blipTag = code.split("bliptag");
					 if (blipTag && blipTag.length < 2)
					 {
						 continue;
					 }
					 var imageType = null;
					 if(blipTag[0].indexOf("pngblip") > -1)
					 {
						 imageType = "image/png";
					 }
					 else if(blipTag[0].indexOf("jpegblip") > -1)
				     {
						 imageType = "image/jpeg";
				     }
					 if(!imageType)
					 {
						 continue;
					 }
					 var blipTagSplit = blipTag[1].split("}");
	                 if (blipTagSplit && blipTagSplit.length < 2)
	                 {
	                	 continue;
	                 }
	                 var arrHexCode = [];
	                 if (blipTagSplit.length > 2 && blipTagSplit[0].indexOf("blipuid") != -1)
	                 {
	                	 arrHexCode = blipTagSplit[1].split(" ");
	                 }
                     else 
                     {
                    	arrHexCode = blipTagSplit[0].split(" ");
                        if (arrHexCode && arrHexCode.length < 2)
                        {
                        	continue;
                        }
                        arrHexCode.shift();
                     }
	                 this.__imageDetails[tagInit + tagID] = {type: imageType,hex: arrHexCode.join("")};
				 }
			}
		};
		
		this.__getBase64FromHex = function(hexCode)
		{
			var arrChars = hexCode.match(/[0-9a-f]{2}/gi);
			var arrBase64 = [];
			for(var count = 0;count < arrChars.length;count++)
			{
				arrBase64.push(String.fromCharCode(parseInt(arrChars[count], 16)));
			}
			return btoa(arrBase64.join(""));
		};
		
		
		this.__getStyles = function(wordHead)
		{
			var objStyle = {};
			var arrStyleTag = wordHead.getElementsByTagName("style");
			if(arrStyleTag.length > 0)
			{
				var arrStyle =  arrStyleTag[0].innerHTML.match(/[\S ]+\s+{[\s\S]+?}/gi);
				if(arrStyle)
				{
					for(var count = 0;count < arrStyle.length ;count++)
					{
						var style = arrStyle[count];
						var styleTitle =  style.replace(/([\S ]+\s+){[\s\S]+?}/gi, "$1");
						var styleBody = style.replace(/[\S ]+\s+{([\s\S]+?)}/gi, "$1");
						styleTitle = styleTitle.replace(/^[\s]|[\s]$/gm, "");
						styleTitle = styleTitle.replace(/\n|\r|\n\r/g, "");
						styleBody = styleBody.replace(/^[\s]|[\s]$/gm, "");
						styleBody = styleBody.replace(/\n|\r|\n\r/g, "");
						var arrStyleTitle = styleTitle.split(", ");
						for(var innerCount = 0;innerCount < arrStyleTitle.length ;innerCount++)
						{
							objStyle[arrStyleTitle[innerCount]] = styleBody;
						}
					}
				}
			}
			return objStyle;
		};
		
		this.__applyStyle = function(document,selector, style)
		{
			var convertCSSTextToString = function(styles)
			{
				var arrStyle = [];
				for (var style in styles)
				{
					arrStyle.push(style + ':' + styles[style]);
				}
				return arrStyle.join( '; ' );
			};
			var arrElements = document.querySelectorAll(selector);
			for (var count = 0;count < arrElements.length;count++)
			{
				var element = arrElements[count];
				var existingStyle = this.__parseCssText(element.getAttribute("style"));
				if(!existingStyle)
				{
					existingStyle = {};
				}
				for (var key in style ) 
				{
					existingStyle[key] = style[key];
				}
				element.setAttribute("style",convertCSSTextToString(existingStyle));
			}
		};
		
		this.__parseCssText = function(text,format)
		{
			var objReturn = {};
			if(text)
			{
				text = this.__normalizeHexadecimal(text);
				//IE issue for semicolon
				if (text && text !== ';')
				{
					var trim = function(str)
					{
						return str.replace(/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g,"");
					};
					text.replace( /&quot;/g, '"' ).replace( /\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(match,name,value ) {
						if (format) 
						{
							name = name.toLowerCase();
							if (name === "font-family")
							{
								value = value.replace( /\s*,\s*/g, ',' );
							}
							value = trim(value);
						}
						objReturn[name] = value;
					} );
				}
			}
			return objReturn;
		};
		
		this.__normalizeHexadecimal = function(text)
		{
			if(text)
			{
				text = text.replace( /#(([0-9a-f]{3}){1,2})($|;|\s+)/gi, function( match, hexColor, hexColorPart, separator ) {
					var normalizedHexColor = hexColor.toLowerCase();
					if ( normalizedHexColor.length == 3 ) {
						var parts = normalizedHexColor.split( '' );
						normalizedHexColor = [ parts[ 0 ], parts[ 0 ], parts[ 1 ], parts[ 1 ], parts[ 2 ], parts[ 2 ] ].join( '' );
					}
					return '#' + normalizedHexColor + separator;
				});
			}
			return text;
		};
		
		this.__removeAllNodeAttribute = function(node) 
		{
			var arrAttribute = node.attributes;
            for(var count = arrAttribute.length - 1; count >= 0; count--) 
            {
                var attribute = arrAttribute[count];
                node.removeAttribute(attribute.nodeName);
            }
        };
		
        this.__extractNode = function(element,nodeName) 
        {
            return this.__runRegexReturnIndex(element, "<" + nodeName + "[^>]*?>([\\w\\W]*)</" + nodeName + ">", 1);
        };
        
        this.__runRegexReturnIndex = function(str,regex,index) 
        {
        	 var regExp = new RegExp(regex,"gi");
        	 var value = regExp.exec(str);
        	 if(value && value.length > index)
        	 {
        		 return value[index];
        	 }
        	 return null;
        };
        
        this.__getContents = function(node)
        {
        	 return node && "IFRAME" != node.tagName ? Array.prototype.slice.call(node.childNodes || []) : [];
        };
        
        this.__openTagString = function(node) 
        {
            return "<" + node.tagName.toLowerCase() + this.__getAttributesAsString(node) + ">";
        };
        
        this.__closeTagString = function(node) 
        {
            return "</" + node.tagName.toLowerCase() + ">";
        };
        
        this.__getAttributesAsString = function(node)
        {
        	var retValue = "";
        	var objAttr = this.__getAttributes(node);
        	var attrKeys = Object.keys(objAttr).sort();
        	for(var count = 0; count < attrKeys.length;count++)
        	{
        		var key = attrKeys[count];
        		var value = objAttr[key];
        		if(value.indexOf("'") < 0 && value.indexOf('"') >= 0)
        		{
        			retValue += " " + key + "='" + value + "'";
        		}
        		else if(value.indexOf('"') >= 0 && value.indexOf("'") >= 0)
        		{
        			value = value.replace(/"/g, "&quot;");
        			retValue += " " + key + '="' + value + '"';
        		}
        		else
        		{
        			retValue += " " + key + '="' + value + '"';
        		}
        	}
        	return retValue;
        };
        
        this.__getAttributes = function(node)
        {
        	var retValue = {};
        	var attributes = node.attributes;
        	if(attributes)
        	{
        		for (var count = 0;count < attributes.length; count++) 
        		{
                    var attribute = attributes[count];
                    retValue[attribute.nodeName] = attribute.value;
                }
        	}
        	return retValue;
        };
        
        this.__replaceNewLineWithBR = function(node) 
        {
            var html = node.innerHTML;
            if(html.indexOf("\n") >= 0)
            {
            	node.innerHTML = html.replace(/\n/g, "<br>");
            }
        };
        
        this.__getTextContent = function(strValue) 
        {
            var div = this.util.createDiv(null);
            div.innerText = strValue;
            return div.textContent;
        };
        
        this.__sanitizeURL = function(url) 
        {
            /*var regex = /^([A-Za-z]:(\\){1,2}|[A-Za-z]:((\\){1,2}[^\\]+)+)(\\)?$/i;
            return /^(https?:|ftps?:|)\/\//i.test(url) ? url : regex.test(url) ? url : new RegExp("^(" + this.__linkProtocols.join("|") + "):\\/\\/","i").test(url) ? url : url = encodeURIComponent(url).replace(/%23/g, "#").replace(/%2F/g, "/").replace(/%25/g, "%").replace(/mailto%3A/gi, "mailto:").replace(/file%3A/gi, "file:").replace(/sms%3A/gi, "sms:").replace(/tel%3A/gi, "tel:").replace(/notes%3A/gi, "notes:").replace(/data%3Aimage/gi, "data:image").replace(/blob%3A/gi, "blob:").replace(/webkit-fake-url%3A/gi, "webkit-fake-url:").replace(/%3F/g, "?").replace(/%3D/g, "=").replace(/%26/g, "&").replace(/&amp;/g, "&").replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%2B/g, "+").replace(/%40/g, "@").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/%7B/g, "{").replace(/%7D/g, "}");*/
        	return url;
        };
        
        this.__addSemicolon = function(str)
        {
        	 var retValue = str.replace(new RegExp(";;","gi"),";");
        	 retValue = retValue.replace(new RegExp("^;","gi"),"");
        	 if(retValue.charAt(retValue.length) !=  ";")
        	 {
        		 retValue += ";";
        	 }
        	 return retValue;
        };
        
        this.__extractDoctype = function(html)
        {
        	var retValue = (this.__runRegexReturnIndex(html,"<!DOCTYPE([^>]*?)>", 0) || "<!DOCTYPE html>").replace(/\n/g, " ").replace(/ {2,}/g, " ");
        	return retValue;
        };
        
        this.__extractNodeAttrs = function(html,attribute)
        {
        	var value = this.__runRegexReturnIndex(html,"<" + attribute + "([^>]*?)>", 1) || "";
        	var div = this.util.createDiv(null);
        	div.innerHTML = value;
        	return this.__getAttributes(div);
        };
        
        this.__isTagNotScript = function(node,isScript)
        {
        	if(node && node !== this.__body)
        	{
        		if(isScript)
        		{
        			if(["PRE", "SCRIPT", "STYLE"].indexOf(node.tagName) > -1)
        			{
        				return true;
        			}
        			else 
        			{
        				return this.__isTagNotScript(node.parentNode,isScript);
        			}
        		}
        		else
        		{
        			return (["PRE", "SCRIPT", "STYLE"].indexOf(node.tagName) > -1);
        		}
        	}
        	return false;
        };
        
        this.__isNodeBlock = function(node) 
        {
            return node ? node.nodeType != Node.ELEMENT_NODE ? false : this.__blockTags.indexOf(node.tagName.toLowerCase()) >= 0 : false;
        };
        
        this.__trimElements = function(arrElements)
        {
        	for (var count = arrElements.length - 1;count >= 0; count--)
        	{
        		if(arrElements[count].attributes && arrElements[count].attributes.length > 0)
        		{
        			arrElements.splice(count, 1);
        		}
        	}
        	return arrElements;
        };
        
        this.__getDefaultTag = function()
        {
        	return "p";
        };
		
		this.__isWordContent = function(htmlContent) 
		{
		    //return /<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i.test(htmlContent) || /class="OutlineElement/.test(htmlContent) || /id="?docs\-internal\-guid\-/.test(htmlContent);
			var officeMetaRegexp = /<meta\s*name=(?:\"|\')?generator(?:\"|\')?\s*content=(?:\"|\')?microsoft/gi;
			var wordRegexp = /(class=\"?Mso|style=(?:\"|\')[^\"]*?\bmso\-|w:WordDocument|<o:\w+>|<\/font>)/;
			var isOfficeContent = officeMetaRegexp.test( htmlContent ) || wordRegexp.test( htmlContent );
			return isOfficeContent;
		};
	};
	
	//Whether to prompt the user about the clean up of content being pasted from Microsoft Word.
	NSEditor.PASTEFROMWORD_MODE_PROMPT = "prompt";
	//Removes text formatting when pasting content into the editor, but keeps the content's structure.
	NSEditor.PASTEFROMWORD_MODE_CLEANFORMAT = "cleanFormat";
	//keeps text formatting when pasting content into the editor.
	NSEditor.PASTEFROMWORD_MODE_KEEPFORMAT = "keepFormat";
	
	NSEditor.prototype.registerPlugin("paste",NSEditorPaste);
	
	return NSEditorPaste;
})();
nsModuleExport(__nsGlobal,"NSEditorPaste",NSEditorPaste);
