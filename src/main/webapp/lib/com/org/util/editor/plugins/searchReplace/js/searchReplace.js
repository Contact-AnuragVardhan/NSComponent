var NSEditorSearchReplace = (function()
{
	var NSEditorSearchReplace = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		
		this.__refsSearch = {};
		this.__selSearchElement = null;
		
		this.setSettings = function()
		{
			var self = this;
			this.__nsEditor.__toolBarButton["searchReplace"] ={html:"<i class='ns-icon ns-editor-search' aria-hidden='true'></i>",tooltip:"Search Or Replace",showAsMenu: true,
												   			isDropdown:true,
												   			dataSource:[{value:"Search",html:"<span>Search</span>",tooltip:"Search",shortKey:"ctrl+f",
														   				  click:function(item,key,event)
																		  {
																			  self.__searchClickHandler.call(self,event);
																		  }},
																		  {value:"Replace",html:"<span>Replace</span>",tooltip:"Replace",shortKey:"ctrl+h",
																		  click:function(item,key,event)
																		  {
																			  self.__replaceClickHandler.call(self,event);
																		  }},
																		],
										   					  checkDisability: function(toolBarKey,toolBarItem,item,itemKey,isDefaultDisabled)
															  {
																  if(itemKey === "viewSourceCode")
																  {
																	  return true;
																  }
																  return false;
															   }
															};
		};
		
		this.initialize = function()
		{
		};
		
		this.componentsInitialized = function()
		{
			var self = this;
			this.__nsEditor.__listenInternalEvent("stickyChanged",this.__applySearchSticky.bind(this));
			this.__nsEditor.__listenInternalEvent("keydown mousedown",function(event){
				if(self.__isSearchCompVisible()) 
				{
					self.__selSearchElement = self.selection.getElementUnderCursor();
					self.__updateSearchCount();
				}
			});
		};
		
		this.resized = function(event)
		{
			
		};
		
		this.destroy = function()
		{
			if(this.__nsTablePicker)
			{
				this.__nsTablePicker.remove();
			}
		};
		
		this.__searchClickHandler = function(event)
		{
			this.__createSearchComponents();
			this.__showSearchComp();
			this.__hideReplaceComp();
		};
		
		this.__replaceClickHandler = function(event)
		{
			this.__searchClickHandler();
			this.__showReplaceComp();
		};
		
		this.__createSearchComponents = function()
		{
			if(!this.__refsSearch.wrapper || !this.__refsSearch.wrapper.parentNode)
			{
				var self = this;
				this.__setSearchContainer();
				this.__nsEditor.__divTextAreaContainer.appendChild(this.__refsSearch.wrapper);
				this.util.addEvent(this.__refsSearch.close,"click",this.__hideSearchComp.bind(this));
				var prevNextClick = this.__prevNextClickHandler.bind(this);
				this.util.addEvent([this.__refsSearch.previous,this.__refsSearch.next],"click",prevNextClick);
				this.util.addEvent(this.__refsSearch.moreoption,"click",this.__toggleReplaceComp.bind(this));
				this.util.addEvent(this.__refsSearch.replaceButton,"click",this.__btnReplaceClickHandler.bind(this));
				this.util.addEvent(this.__refsSearch.replaceAllButton,"click",this.__btnReplaceAllClickHandler.bind(this));
				this.util.addEvent(this.__refsSearch.search,"keydown",this.util.debounce(function(event)
				{
					event = self.util.getEvent(event);
					switch (event.key) 
					{
						case self.util.KEYCODE.ENTER:
						{
							self.editorUtil.stopEvent(event);
							/*if (editor.e.fire('searchNext')) {
								this.close();
							}*/
						}
						break;
						default:
						{
							self.__updateSearchCount();
						}
					}
				},10));
			}
		};
		
		this.__setSearchContainer = function()
		{
			var html = "<div data-ns-ref=\"wrapper\" class=\"nsEditorSearchWrapper\">\r\n" + 
					"	 <div class=\"nsEditorSearchContainer\">\r\n" + 
					"		<div class=\"nsEditorSearchContent\">\r\n" + 
					"			<div class=\"nsEditorSearchInputCountWrapper\">\r\n" + 
					"				<table cellpadding=\"0\" cellspacing=\"0\" class=\"nsEditorSearchInputCountOuterContainer\">\r\n" + 
					"					<tbody>\r\n" + 
					"						<tr>\r\n" + 
					"							<td class=\"nsEditorSearchInputContainer\">\r\n" + 
					"								<input data-ns-ref=\"search\" type=\"text\" spellcheck=\"false\" class=\"nsEditorSearchInput\" placeholder=\"Find\">\r\n" + 
					"							</td>\r\n" + 
					"							<td class=\"nsEditorSearchCountContainer\">\r\n" + 
					"								<span data-ns-ref=\"count\" class=\"nsEditorSearchCount\">0 of 0</span>\r\n" + 
					"							</td>\r\n" + 
					"						</tr>\r\n" + 
					"					</tbody>\r\n" + 
					"				</table>\r\n" + 
					"			</div>\r\n" + 
					"			<div class=\"nsEditorSearchButtonContainer\">\r\n" + 
					"				<button data-ns-ref=\"next\" type=\"button\" tabindex=\"-1\" class=\"nsEditorSearchButton nsEditorSearchButtonNext\">\r\n" + 
					"					<span class=\"nsEditorSearchButtonIconWrap\">" +
					"						<i class=\"ns-icon ns-editor-next\" aria-hidden=\"true\"></i>\r\n" + 
					"					</span>\r\n" + 
					"				</button>\r\n" +
					"				<button data-ns-ref=\"previous\" type=\"button\" tabindex=\"-1\" class=\"nsEditorSearchButton nsEditorSearchButtonPrevious\">\r\n" + 
					"					<span class=\"nsEditorSearchButtonIconWrap\">\r\n" + 
					"						<i class=\"ns-icon ns-editor-prev\" aria-hidden=\"true\"></i>\r\n" +
					"					</span>\r\n" + 
					"				</button>\r\n" + 
					"			</div>\r\n" +
					"			<div class=\"nsEditorSearchButtonContainer\">\r\n" + 
					"				<button data-ns-ref=\"moreoption\" type=\"button\" tabindex=\"-1\" class=\"nsEditorSearchButton nsEditorSearchButtonMoreOption\">\r\n" + 
					"					<span class=\"nsEditorSearchButtonIconWrap\">\r\n" + 
					"						<i data-ns-ref=\"moreoptionicon\" class=\"ns-icon ns-editor-expand-bold\" aria-hidden=\"true\"></i>\r\n" +
					"					</span>\r\n" + 
					"				</button>\r\n" + 
					"			</div>\r\n" + 
					"			<div class=\"nsEditorSearchButtonContainer\">\r\n" + 
					"				<button data-ns-ref=\"close\" type=\"button\" tabindex=\"-1\" class=\"nsEditorSearchButton nsEditorSearchButtonClose\">\r\n" + 
					"					<span class=\"nsEditorSearchButtonIconWrap\">\r\n" + 
					"						<i class=\"ns-icon ns-editor-close-bold\" aria-hidden=\"true\"></i>\r\n" +
					"					</span>\r\n" + 
					"				</button>\r\n" + 
					"			</div>\r\n" + 
					"		</div>\r\n" + 
					"   	<div data-ns-ref=\"replaceWrapper\" class=\"nsEditorReplaceContainer\">\r\n" + 
					"			<input data-ns-ref=\"replaceInput\" class=\"nsEditorReplaceInput\" placeholder=\"Replace\" aria-label=\"Replace Field\">\r\n" + 
					"			<div class=\"nsEditorReplaceButtonWrapper\">\r\n" + 
					"				<span class=\"nsEditorReplaceButtonContainer\" tabindex=\"-1\">\r\n" + 
					"					<button data-ns-ref=\"replaceButton\" class=\"nsEditorReplaceButton nsEditorReplaceButtonReplace\">Replace</button>\r\n" + 
					"				</span>\r\n" + 
					"				<span class=\"nsEditorReplaceButtonContainer\" tabindex=\"-1\">\r\n" + 
					"					<button data-ns-ref=\"replaceAllButton\" class=\"nsEditorReplaceButton nsEditorReplaceButtonReplaceAll\">Replace All</button>\r\n" + 
					"				</span>\r\n" + 
					"			</div>\r\n" + 
					"		</div>"
					"	</div>\r\n" +
					"</div>";
			
			this.__refsSearch = this.util.getReferenceFromHtml(html).refs;
			return this.__refsSearch.wrapper;
		};
		
		this.__prevNextClickHandler = function(event)
		{
			if(this.__refsSearch.search.value && this.__refsSearch.search.value.trim().length)
			{
				this.editorUtil.stopEvent(event);
				var textArea = this.__nsEditor.__getTextArea();
				var searchElement = this.selection.getElementUnderCursor();
				var isNext = event.currentTarget == this.__refsSearch.next;
				this.__searchTextSelect({startNode: searchElement || textArea.firstChild,text: this.__refsSearch.search.value,next:isNext});
			}
		};
		
		this.__btnReplaceClickHandler = function(event)
		{
			if(this.__refsSearch.replaceInput.value && this.__refsSearch.replaceInput.value.trim().length && 
					this.__refsSearch.search.value && this.__refsSearch.search.value.trim().length)
			{
				this.editorUtil.stopEvent(event);
				var textArea = this.__nsEditor.__getTextArea();
				var searchElement = this.selection.getElementUnderCursor();
				this.__searchTextReplace({startNode: searchElement || textArea.firstChild,text: this.__refsSearch.search.value,replaceText:this.__refsSearch.replaceInput.value});
			}
		};
		
		this.__btnReplaceAllClickHandler = function(event)
		{
			if(this.__refsSearch.replaceInput.value && this.__refsSearch.replaceInput.value.trim().length && 
					this.__refsSearch.search.value && this.__refsSearch.search.value.trim().length)
			{
				this.editorUtil.stopEvent(event);
				var textArea = this.__nsEditor.__getTextArea();
				var searchElement = this.selection.getElementUnderCursor();
				searchElement = searchElement || textArea.firstChild;
				while(this.__searchTextReplace({startNode: searchElement,text: this.__refsSearch.search.value,replaceText:this.__refsSearch.replaceInput.value}))
				{
					searchElement = this.selection.getElementUnderCursor();
				}
			}
		};
		
		this.__showSearchComp = function()
		{
			if(!this.__isSearchCompVisible())
			{
				this.__nsEditor.__dispatchInternalEvent("hideAllPopup",{container: this.__refsSearch.wrapper},{container: this.__refsSearch.wrapper});
				this.util.addStyleClass(this.__refsSearch.wrapper,"nsEditorSearchVisible");
				this.__applySearchSticky();
				this.__selSearchElement = this.selection.getElementUnderCursor();
				var selectedText = this.selection.getSelection() ? this.selection.getSelection().toString() : "";
				if (selectedText) 
				{
					this.__refsSearch.search.value = selectedText;
				}
				else
				{
					this.__refsSearch.search.value = "";
				}
				this.__updateSearchCount();
				selectedText ? this.__refsSearch.search.select() : this.__refsSearch.search.focus();
			}
		};
		
		this.__hideSearchComp = function(event)
		{
			this.util.removeStyleClass(this.__refsSearch.wrapper,"nsEditorSearchVisible");
		};
		
		this.__isSearchCompVisible = function()
		{
			return (this.__refsSearch.wrapper && this.__refsSearch.wrapper.parentNode && this.util.hasStyleClass(this.__refsSearch.wrapper,"nsEditorSearchVisible"));
		};
		
		this.__showReplaceComp = function(event)
		{
			if(!this.__isReplaceCompVisible())
			{
				this.__refsSearch.replaceInput.value = "";
				this.util.addStyleClass(this.__refsSearch.replaceWrapper,"nsEditorReplaceContainerVisible");
				this.util.addStyleClass(this.__refsSearch.moreoptionicon,"ns-editor-collapse-bold");
				this.util.removeStyleClass(this.__refsSearch.moreoptionicon,"ns-editor-expand-bold"); 
			}
		};
		
		this.__hideReplaceComp = function(event)
		{
			this.util.removeStyleClass(this.__refsSearch.replaceWrapper,"nsEditorReplaceContainerVisible");
			this.util.removeStyleClass(this.__refsSearch.moreoptionicon,"ns-editor-collapse-bold");
			this.util.addStyleClass(this.__refsSearch.moreoptionicon,"ns-editor-expand-bold"); 
		};
		
		this.__toggleReplaceComp = function()
		{
			return this.__isReplaceCompVisible() ? this.__hideReplaceComp() : this.__showReplaceComp();
		};
		
		this.__isReplaceCompVisible = function()
		{
			return (this.__refsSearch.replaceWrapper && this.__refsSearch.replaceWrapper.parentNode && this.util.hasStyleClass(this.__refsSearch.replaceWrapper,"nsEditorReplaceContainerVisible"));
		};
		
		
		this.__updateSearchCount = function()
		{
			if(this.__isSearchCompVisible())
			{
				this.__refsSearch.search.value.length ? this.util.addStyleClass(this.__refsSearch.count,"nsEditorSearchCountVisible") : this.util.removeStyleClass(this.__refsSearch.count,"nsEditorSearchCountVisible");
				var objCount = this.__getTextCounts(this.__refsSearch.search.value);
				this.__refsSearch.count.innerHTML = objCount.index + "/" + objCount.count;
			}
		};
		
		this.__applySearchSticky = function()
		{
			var isSticky = this.__nsEditor.__toolBar.isToolbarSticky();
			if(this.__isSearchCompVisible())
			{
				var css = {};
				if(isSticky)
				{
					this.util.addStyleClass(this.__refsSearch.wrapper,"nsEditorSearchWrapperSticky");
					var rect = this.__nsEditor.__toolBar.__divToolBarContainer.getBoundingClientRect();
					//css = {top: rect.top + rect.height,left: rect.left + rect.width};
					css = {top: rect.top + rect.height,right: rect.left};
				}
				else
				{
					this.util.removeStyleClass(this.__refsSearch.wrapper,"nsEditorSearchWrapperSticky");
					css = {top: "",left: "",right: ""};
				}
				this.util.css(this.__refsSearch.wrapper,css);
			}
		};
		
		//calcCounts
		this.__getTextCounts = function(text)
		{
			var isInArray = function(paramBound,paramArrBound)
			{
				for(var count = 0;count < paramArrBound.length;count++)
				{
					var tempBound = paramArrBound[count];
					if(tempBound.startContainer == paramBound.startContainer && tempBound.endContainer == paramBound.endContainer &&
						tempBound.startOffset == paramBound.startOffset && tempBound.endOffset == paramBound.endOffset)
					{
						return true;
					}
				}
				return false;
			};
			var objRet = {index: 0,count: 0};
			var doc = this.__nsEditor.__getDocument();
			var textArea = this.__nsEditor.__getTextArea();
			var range = this.selection.getRange();
			var startNode = textArea.firstChild;
			var arrBound = [];
			var bound = null;
			while(startNode && text.length) 
			{
				bound = this.__searchText({startNode: startNode,text: text,next: true,deep: 0,range: (bound || doc.createRange())});
				if(bound)
				{
					if (isInArray(bound,arrBound)) 
					{
						break;
					}
					arrBound.push(bound);
					startNode = bound.startContainer;
					objRet.count++;
					if (range && isInArray(range, [bound])) 
					{
						objRet.index = objRet.count;
					}
				}
				else 
				{
					startNode = null;
				}
			}
			return objRet;
		};
		
		//objParam has properties startNode,text,next,deep,range
		//find
		this.__searchText = function(objParam)
		{
			if (objParam.startNode && objParam.text.length) 
			{
				var textArea = this.__nsEditor.__getTextArea();
				objParam.sentence = "";
				objParam.bound = {startContainer: null,startOffset: null,endContainer: null,endOffset: null};
				var siblingProperty = objParam.next ? "nextSibling" : "previousSibling";
				var childProperty = objParam.next ? "firstChild" : "lastChild";
				var self = this;
				this.util.findNodeWithCurrent(objParam.startNode,function(node) 
				{
					if(node && self.__isSearchNode.call(self,objParam,node))
					{
						return true;
					}
					return false;
	            },textArea,siblingProperty,childProperty);
				if (objParam.bound.startContainer && objParam.bound.endContainer) 
				{
					return objParam.bound;
				}
				if (!objParam.deep) 
				{
					this.__selSearchElement = objParam.next ? textArea.firstChild : textArea.lastChild;
					return this.__searchText({startNode: this.__selSearchElement,text: objParam.text,next: objParam.next,deep: objParam.deep + 1,range: objParam.range});
				}
			}
		};
		
		//objParam has properties text,next,deep,range,sentence,bound
		this.__isSearchNode = function(objParam,paramNode)
		{
			if (this.util.isTextNode(paramNode) && paramNode.nodeValue != null && paramNode.nodeValue.length)
			{
				var win = this.__nsEditor.__getWindow();
				var value = paramNode.nodeValue;
				if (!objParam.next && paramNode === objParam.range.startContainer) 
				{
					value = !objParam.deep ? value.substr(0, objParam.range.startOffset) : value.substr(objParam.range.endOffset);
				} 
				else if (objParam.next && paramNode === objParam.range.endContainer) 
				{
					value = !objParam.deep ? value.substr(objParam.range.endOffset) : value.substr(0, objParam.range.startOffset);
				}
				var tmpSentence = objParam.next ? objParam.sentence + value : value + objParam.sentence;
				var part = this.__searchSomePart(objParam.text,tmpSentence,objParam.next);
				if(part != false) 
				{
					var currentPart = this.__searchSomePart(objParam.text,value,objParam.next);
					if (currentPart === true) 
					{
						currentPart = this.editorUtil.trim(objParam.text);
					} 
					else if(currentPart === false) 
					{
						currentPart = this.__searchSomePart(value,objParam.text,objParam.next);
						if (currentPart === true) 
						{
							currentPart = this.editorUtil.trim(value);
						}
					}
					var currentPartIndex = this.__searchSomePartIndex(objParam.text,value,objParam.next) || 0;
					if(((objParam.next && !objParam.deep) || (!objParam.next && objParam.deep)) && paramNode.nodeValue.length - value.length > 0)
					{
						currentPartIndex += paramNode.nodeValue.length - value.length;
					}
					if (objParam.bound.startContainer == null) 
					{
						objParam.bound.startContainer = paramNode;
						objParam.bound.startOffset = currentPartIndex;
					}
					if (part !== true) 
					{
						objParam.sentence = tmpSentence;
					} 
					else 
					{
						objParam.bound.endContainer = paramNode;
						objParam.bound.endOffset = currentPartIndex;
						objParam.bound.endOffset += currentPart.length;
						return true;
					}
				}
				else
				{
					objParam.sentence = "";
					objParam.bound = {startContainer: null,startOffset: null,endContainer: null,endOffset: null};
				}
			}
			else if (this.editorUtil.isBlock(paramNode,win) && objParam.sentence != "") 
			{
				objParam.sentence = objParam.next ? objParam.sentence + " " : " " + objParam.sentence;
			}

			return false;
		};
		
		//objParam has properties startNode,text,next
		//findAndSelect
		this.__searchTextSelect = function(objParam)
		{
			var doc = this.__nsEditor.__getDocument();
			objParam.range = this.selection.getRange();
			objParam.deep = 0;
			var bound = this.__searchText(objParam);
			if (bound && bound.startContainer && bound.endContainer) 
			{
				var range = doc.createRange();
				try 
				{
					range.setStart(bound.startContainer,bound.startOffset);
					range.setEnd(bound.endContainer,bound.endOffset);
					this.selection.selectRange(range);
				} 
				catch (error) 
				{
					console.debug(error);
				}
				this.__scrollToNode(bound.startContainer);
				this.__selSearchElement = bound.startContainer;
				this.__updateSearchCount();
				return true;
			}
			return false;
		};
		
		//objParam has properties startNode,text,replaceText
		//findAndReplace
		this.__searchTextReplace = function(objParam)
		{
			var doc = this.__nsEditor.__getDocument();
			objParam.next = true;
			objParam.range = this.selection.getRange();
			objParam.deep = 0;
			var bound = this.__searchText(objParam);
			if (bound && bound.startContainer && bound.endContainer) 
			{
				var range = doc.createRange();
				try 
				{
					range.setStart(bound.startContainer,bound.startOffset);
					range.setEnd(bound.endContainer,bound.endOffset);
					range.deleteContents();
					var textNode = doc.createTextNode(objParam.replaceText);
					range.insertNode(textNode);
					this.selection.selectElement(textNode);
					this.__scrollToNode(textNode);
				} 
				catch (error) 
				{
					console.debug(error);
				}
				this.__updateSearchCount();
				return true;
			}
			return false;
		};
		
		this.__searchSomePart = function(text,sentence,start,getIndex)
		{
			start = this.util.isUndefinedOrNull(start) ? true : Boolean.parse(start);
			getIndex = Boolean.parse(getIndex);
			text = this.editorUtil.trim(text.toLowerCase());
			sentence = sentence.toLowerCase();

			var textIndex = start ? 0 : text.length - 1;
			var length = 0;
			var startAtIndex = null;
			var inc = start ? 1 : -1;
			var tmp = [];

			for (var count = (start ? 0 : sentence.length - 1); !this.util.isUndefined(sentence[count]);count += inc) 
			{
				var some = (text[textIndex] === sentence[count]);
				if (some || (startAtIndex != null && this.editorUtil.SPACE_REG_EXP.test(sentence[count]))) 
				{
					if (startAtIndex == null || !start) 
					{
						startAtIndex = count;
					}
					tmp.push(sentence[count]);
					if(some) 
					{
						length += 1;
						textIndex += inc;
					}
				} 
				else 
				{
					startAtIndex = null;
					tmp.length = 0;
					length = 0;
					textIndex = start ? 0 : text.length - 1;
				}

				if (length === text.length) 
				{
					return getIndex ? startAtIndex : true;
				}
			}
			if (getIndex) 
			{
	            return this.util.isUndefinedOrNull(startAtIndex) ? startAtIndex : false;
	        }
			if(tmp.length) 
			{
				return start ? tmp.join('') : tmp.reverse().join('');
			}
			return false;
		};
		
		this.__searchSomePartIndex = function(text,sentence,start)
		{
			start = this.util.isUndefinedOrNull(start) ? true : Boolean.parse(start);
	        return this.__searchSomePart(text,sentence,start,true);
		};
		
		this.__scrollToNode = function(node)
		{
			var textArea = this.__nsEditor.__getTextArea();
			var parent = this.editorUtil.getClosestElement(node,this.util.isElement,textArea);
			if (!parent) 
			{
				parent = this.util.findPrevNode(node,this.util.isElement,textArea);
			}
			if(parent && parent != textArea)
			{
				parent.scrollIntoView();
			}
		};
	};
	
	NSEditor.prototype.registerPlugin("searchReplace",NSEditorSearchReplace);
	
	return NSEditorSearchReplace;
})();
nsModuleExport(__nsGlobal,"NSEditorSearchReplace",NSEditorSearchReplace);