var NSTextBox = (function()
{
	function NSTextBox(component,setting) 
	{
		this.__setting = setting;
		this.__outerContainer = null;
		this.__textBox = null;
		this.__list = null;
		this.__nsList = null;
		this.__nsGrid = null;
		this.__renderer =  null;
		this.__itemRenderer = null;
		
		this.__context = window;
		this.__dataSource = null;
		this.__type = "text";
		this.__enableAutoComplete = false;
		this.__dropDownType = NSTextBox.DROPDOWN_TYPE_LIST;
		this.__minChars = -1;
		this.__maxChars = -1;
		this.__minSearchStartChars = 1;
		this.__caseSensitive = true;
		this.__required = false;
		this.__placeholder = null;
		this.__displayAsPassword = false;
		this.__enableServerSide = false;
		this.__enableServerWithSmartSearch = false;
		this.__delay = 150;
		this.__listWidth = -1;
		this.__maxListHeight = 300;
		this.__noRecordsFoundMessage = "No Records Found";
		//can be [a-zA-Z0-9,-]
		this.__restrict = null;
		this.__pattern = null;
		this.__styleClass = null;
		this.__dropDownSetting = null;
		this.__serverSearchCallback = null;
		this.__textBoxRendererCallback = null;
		/* arrGridSearchField used when type = "autocomplete" and dropDownType = NSTextBox.DROPDOWN_TYPE_GRID */
		this.__arrGridSearchField = null;
		this.__isGridOrFilter = false;
		
		this.__labelField = "label";
		this.__stopHoveringField = "stopHover";
		this.__labelFunction = null;
		this.__templateID = null;
		this.__setDataCallBack = null;
		this.__enableKeyboardNavigation = false;
		this.__enableMultipleSelection = false;
		this.__multiSelectionSeparator = ";";
		this.__filterSetting = {};
		this.__enableHighlighting = false;
		this.__searchRecordLimit = -1;
		//temp merging Manish's code
		this.__splitSearchType = null;
		
		this.__selectedItem = null;
		this.__selectedItems = [];	
		this.__timerInstance = null;
		this.__isFromItemSelected = false;
		this.__isFromCloseIcon = false;
		this.__isFromSearchTextSever = false;
		this.__lastNavigatedItem = {};
		this.__lastSearchParam = "";
		
		
		this.__keyPressedRef = null;
		this.__pasteRef = null;
		this.__documentClickRef = null;
		this.__documentKeyUpRef = null;
		this.__documentKeyDownRef = null;
		
		this.base.__setBaseComponent.call(this,component);
	};
	nsExtendPrototype(NSContainerBase,NSTextBox);
	NSTextBox.prototype.constructor = NSTextBox;
	
	NSTextBox.prototype.initializeComponent = function() 
	{
		this.base.initializeComponent.call(this);
		this.__setSetting();
	};
	
	NSTextBox.prototype.setComponentProperties = function() 
	{
		this.base.setComponentProperties.call(this);
		this.__createComponents();
		this.__setTextBoxProperty();
		if(this.__dataSource)
		{
			this.dataSource(this.__dataSource);
		}
	};
	
	NSTextBox.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty)
	{
		var attributeName = attrName.toLowerCase();
		var callTextProperty = false;
		if(attributeName === "maxchars")
		{
			this.__maxChars =  parseInt(newVal);
			callTextProperty = true;
		}
		if(attributeName === "minchars")
		{
			this.__minChars =  parseInt(newVal);
		}
		if(attributeName === "minsearchstartchars")
		{
			this.__minSearchStartChars =  parseInt(newVal);
		}
		if(attributeName === "casesensitive")
		{
			this.__caseSensitive = Boolean.parse(newVal);
		}
		if(attributeName === "required")
		{
			this.__required = Boolean.parse(newVal);
			callTextProperty = true;
		}
		if(attributeName === "placeholder")
		{
			this.__placeholder = newVal;
			callTextProperty = true;
		}
		if(attributeName === "delay")
		{
			this.__delay =  parseInt(newVal);
		}
		if(attributeName === "maxlistheight")
		{
			this.__maxListHeight =  parseInt(newVal);
		}
		if(attributeName === "listwidth")
		{
			this.__listWidth =  parseInt(newVal);
		}
		if(attributeName === "labelfield")
		{
			this.__labelField = newVal;
		}
		if(attributeName === "labelfunction")
		{
			this.__labelFunction = newVal;
		}
		if(attributeName === "enablemultipleselection")
		{
			this.__enableMultipleSelection =  Boolean.parse(newVal);
		}
		if(attributeName === "enablekeyboardnavigation")
		{
			this.__enableKeyboardNavigation =  Boolean.parse(newVal);
		}
		if(attributeName === "norecordsfoundmessage")
		{
			this.__noRecordsFoundMessage = newVal;
		}
		if(attributeName === "multiselectionseparator")
		{
			this.__multiSelectionSeparator = newVal;
		}
		if(attributeName === "pattern")
		{
			this.__pattern = newVal;
			callTextProperty = true;
		}
		if(attributeName === "restrict")
		{
			this.__restrict = newVal;
			if(this.util.isValueNull(this.__restrict))
			{
				this.__restrict = null;
			}
			/*else
			{
				this.__restrict = "[" + this.__restrict + "]";
			}*/
			callTextProperty = true;
		}
		if(attributeName === "styleclass")
		{
			this.__styleClass = newVal;
			callTextProperty = true;
		}
		if(attributeName === "filtersetting")
		{
			this.__filterSetting =  newVal;
		}
		if(attributeName === "enablehighlighting")
		{
			this.__enableHighlighting =  Boolean.parse(newVal);
		}
		if(attributeName === "searchrecordlimit")
		{
			this.__searchRecordLimit =  parseInt(newVal);
		}
		if(attributeName === "splitsearchtype")
		{
			this.__splitSearchType =  newVal;
		}
		if(callTextProperty)
		{
			this.__setTextBoxProperty();
		}
		this.base.propertyChange.call(this,attrName, oldVal, newVal, setProperty);
	};
	
	NSTextBox.prototype.dataSource = function(dataSource)
	{
		this.__dataSource = dataSource;
		if(this.__enableAutoComplete)
		{
			this.__setListDataSource(this.__dataSource);
			if(this.__isFromSearchTextSever)
			{
				this.__isFromSearchTextSever = false;
				this.__searchText(this.__getSearchText(this.__textBox.value),true);
				this.__showHideList(true);
			}
			if(!this.__documentClickRef)
			{
				this.__documentClickRef = this.__documentClickHandler.bind(this);
				this.util.addEvent(document,"click",this.__documentClickRef);
			}
			if(this.__enableMultipleSelection)
			{
				if(!this.__documentKeyUpRef)
				{
					this.__documentKeyUpRef = this.__documentKeyUpHandler.bind(this);
					this.util.addEvent(document.body,"keyup",this.__documentKeyUpRef);
				}
				if(!this.__documentKeyDownRef)
				{
					this.__documentKeyDownRef = this.__documentKeyDownHandler.bind(this);
					this.util.addEvent(document.body,"keydown",this.__documentKeyDownRef);
				}
			}
		}
	};
	
	NSTextBox.prototype.componentResized = function(event) 
	{
		this.__updateListPos();
		this.base.componentResized(event);
	};
	
	NSTextBox.prototype.removeComponent = function() 
	{
		if(this.__documentClickRef)
		{
			this.util.removeEvent(document,"click",this.__documentClickRef);
			this.__documentClickRef = null;
		}
		if(this.__documentKeyUpRef)
		{
			this.util.removeEvent(document.body,"keyup",this.__documentKeyUpRef);
			this.__documentKeyUpRef = null;
		}
		if(this.__keyDownRef)
		{
			this.util.removeEvent(document.body,"keydown",this.__documentKeyDownRef);
			this.__documentKeyDownRef = null;
		}
		var control = this.__getNSControl();
		if(control && control.removeComponent)
		{
			control.removeComponent.call(control);
		}
		this.base.removeComponent.call(this);
	};
	
	NSTextBox.prototype.getTextBox = function()
	{
		return this.__textBox;
	};
	
	NSTextBox.prototype.setText = function(text)
	{
		if(this.__textBox)
		{
			if(text && this.__maxChars > -1 && text.length > this.__maxChars)
			{
				text = text.substring(0, this.__maxChars);
			}
			this.__textBox.value = text;
		}
	};
	
	NSTextBox.prototype.getText = function()
	{
		if(this.__textBox)
		{
			return this.__textBox.value;
		}
		return null;
	};
	
	NSTextBox.prototype.setSelectedItems = function(arrItems)
	{
		if(this.__getNSControl())
		{
			this.__getNSControl().setSelectedItems(arrItems);
		}
		//this.setText();
	};
	
	NSTextBox.prototype.setSelectedItem = function(item)
	{
		if(this.__getNSControl())
		{
			this.__getNSControl().setSelectedItem(item);
		}
		//this.setText();
	};
	
	NSTextBox.prototype.setSelectedIndexes = function(arrSelectedIndex)
	{
		if(this.__getNSControl())
		{
			this.__getNSControl().setSelectedIndexes(arrSelectedIndex);
		}
		//this.setText();
	};
	
	NSTextBox.prototype.setSelectedIndex = function(selectedIndex)
	{
		if(this.__getNSControl())
		{
			this.__getNSControl().setSelectedIndex(selectedIndex);
		}
		//this.setText();
	};
	
	NSTextBox.prototype.unSelectItems = function(arrItems)
	{
		if(this.__getNSControl())
		{
			this.__getNSControl().unSelectItems(arrItems);
		}
		//this.setText();
	};
	
	NSTextBox.prototype.unSelectItem = function(item)
	{
		if(this.__getNSControl())
		{
			this.__getNSControl().unSelectItem(item);
		}
		//this.setText();
	};
	
	NSTextBox.prototype.unSelectIndexes = function(arrSelectedIndex)
	{
		if(this.__getNSControl())
		{
			this.__getNSControl().unSelectIndexes(arrSelectedIndex);
		}
		//this.setText();
	};
	
	NSTextBox.prototype.unSelectIndex = function(selectedIndex)
	{
		if(this.__getNSControl())
		{
			this.__getNSControl().unSelectIndexes(selectedIndex);
		}
		//this.setText();
	};
	
	NSTextBox.prototype.unSelectAll = function(fireEvent)
	{
		/*if(this.__getNSControl())
		{
			this.__getNSControl().unSelectIndexes(selectedIndex);
		}*/
		this.setText(null);
		if(fireEvent)
		{
			this.__itemUnSelectHandler();
		}
	};
	
	//IMPORTANT:: not exposing getSelectedIndex and getSelectedIndexes as it will be relative to filtered dataSource
	NSTextBox.prototype.getSelectedItem = function()
	{
		return this.__selectedItem;
	};
	
	NSTextBox.prototype.getSelectedItems = function()
	{
		if(this.__getNSControl())
		{
			return this.__getNSControl().getSelectedItems();
		}
		return this.__selectedItems;
	};
	
	NSTextBox.prototype.__setSetting = function()
	{
		var setting = this.__setting;
		if(setting)
		{
			if(setting.hasOwnProperty("type"))
			{
				this.__type = setting["type"];
			}
			if(setting.hasOwnProperty("context"))
			{
				this.__context = setting["context"];
			}
			if(setting.hasOwnProperty("dropDownType"))
			{
				this.__dropDownType = setting["dropDownType"];
			}
			if(setting.hasOwnProperty("maxChars"))
			{
				this.__maxChars = parseInt(setting["maxChars"]);
			}
			if(setting.hasOwnProperty("minChars"))
			{
				this.__minChars = parseInt(setting["minChars"]);
			}
			if(setting.hasOwnProperty("minSearchStartChars"))
			{
				this.__minSearchStartChars = parseInt(setting["minSearchStartChars"]);
			}
			if(setting.hasOwnProperty("caseSensitive"))
			{
				this.__caseSensitive = Boolean.parse(setting["caseSensitive"]);
			}
			if(setting.hasOwnProperty("required"))
			{
				this.__required = Boolean.parse(setting["required"]);
			}
			if(setting.hasOwnProperty("placeholder"))
			{
				this.__placeholder = setting["placeholder"];
			}
			if(setting.hasOwnProperty("displayAsPassword"))
			{
				this.__displayAsPassword = Boolean.parse(setting["displayAsPassword"]);
			}
			if(setting.hasOwnProperty("enableServerSide"))
			{
				this.__enableServerSide = Boolean.parse(setting["enableServerSide"]);
			}
			if(setting.hasOwnProperty("enableServerWithSmartSearch"))
			{
				this.__enableServerWithSmartSearch = Boolean.parse(setting["enableServerWithSmartSearch"]);
			}
			if(setting.hasOwnProperty("serverSearchCallback"))
			{
				this.__serverSearchCallback = setting["serverSearchCallback"];
				if (typeof this.__serverSearchCallback === "string" || this.__serverSearchCallback instanceof String)
				{
					if(this.util.isFunction(this.__serverSearchCallback))
					{
						this.__serverSearchCallback = this.__context[this.__serverSearchCallback];
					}
				}
			}
			if(setting.hasOwnProperty("textBoxRendererCallback"))
			{
				this.__textBoxRendererCallback = setting["textBoxRendererCallback"];
				if (typeof this.__textBoxRendererCallback === "string" || this.__textBoxRendererCallback instanceof String)
				{
					if(this.util.isFunction(this.__textBoxRendererCallback))
					{
						this.__textBoxRendererCallback = this.__context[this.__textBoxRendererCallback];
					}
				}
			}
			if(setting.hasOwnProperty("delay"))
			{
				this.__delay =  parseInt(setting["delay"]);
			}
			if(setting.hasOwnProperty("maxListHeight"))
			{
				this.__maxListHeight =  parseInt(setting["maxListHeight"]);
			}
			if(setting.hasOwnProperty("listWidth"))
			{
				this.__listWidth =  parseInt(setting["listWidth"]);
			}
			if(setting.hasOwnProperty("labelField"))
			{
				this.__labelField = setting["labelField"];
			}
			if(setting.hasOwnProperty("arrGridSearchField"))
			{
				this.__arrGridSearchField = setting["arrGridSearchField"];
			}
			if(setting.hasOwnProperty("isGridOrFilter"))
			{
				this.__isGridOrFilter = setting["isGridOrFilter"];
			}
			if(setting.hasOwnProperty("stopHoveringField"))
			{
				this.__stopHoveringField = setting["stopHoveringField"];
			}
			if(setting.hasOwnProperty("labelFunction"))
			{
				this.__labelFunction = setting["labelFunction"];
			}
			if(setting.hasOwnProperty("template"))
			{
				this.__templateID = setting["template"];
			}
			if(setting.hasOwnProperty("setDataCallBack"))
			{
				this.__setDataCallBack = setting["setDataCallBack"];
			}
			if(setting.hasOwnProperty("itemRenderer"))
			{
				this.__itemRenderer = setting["itemRenderer"];
				if (typeof this.__itemRenderer === "string" || this.__itemRenderer instanceof String)
				{
					if(this.util.isFunction(this.__itemRenderer))
					{
						this.__itemRenderer = this.__context[this.__itemRenderer];
					}
				}
			}
			if(setting.hasOwnProperty("enableMultipleSelection"))
			{
				this.__enableMultipleSelection =  Boolean.parse(setting["enableMultipleSelection"]);
			}
			if(setting.hasOwnProperty("enableKeyboardNavigation"))
			{
				this.__enableKeyboardNavigation =  Boolean.parse(setting["enableKeyboardNavigation"]);
			}
			if(setting.hasOwnProperty("noRecordsFoundMessage"))
			{
				this.__noRecordsFoundMessage =  setting["noRecordsFoundMessage"];
			}
			if(setting.hasOwnProperty("multiSelectionSeparator"))
			{
				this.__multiSelectionSeparator =  setting["multiSelectionSeparator"];
			}
			if(setting.hasOwnProperty("pattern"))
			{
				this.__pattern =  setting["pattern"];
			}
			if(setting.hasOwnProperty("restrict"))
			{
				this.__restrict =  setting["restrict"];
				if(this.__restrict)
				{
					//this.__restrict = "[" + this.__restrict + "]";
				}
			}
			if(setting.hasOwnProperty("dataSource"))
			{
				this.__dataSource = setting["dataSource"];
			}
			if(setting.hasOwnProperty("styleClass"))
			{
				this.__styleClass = setting["styleClass"];
			}
			if(setting.hasOwnProperty("dropDownSetting"))
			{
				this.__dropDownSetting = setting["dropDownSetting"];
			}
			if(setting.hasOwnProperty("filterSetting"))
			{
				this.__filterSetting = setting["filterSetting"];
			}
			if(setting.hasOwnProperty("enableHighlighting"))
			{
				this.__enableHighlighting = Boolean.parse(setting["enableHighlighting"]);
			}
			if(setting.hasOwnProperty("searchRecordLimit"))
			{
				this.__searchRecordLimit = parseInt(setting["searchRecordLimit"]);
			}
			if(setting.hasOwnProperty("splitSearchType"))
			{
				this.__splitSearchType =  setting["splitSearchType"];
			}
		}
	};
	
	NSTextBox.prototype.__createComponents = function() 
	{
		if(!this.__outerContainer)
		{
			this.__applyTipToCoreComp = true;
			this.__outerContainer = this.util.createDiv(this.getID() + "#container","nsTextBoxContainer");
			this.addChild(this.__outerContainer);
			this.__textBox = this.util.createElement("INPUT",this.getID()+ "#textBox","nsTextBox");
			this.__textBox.setAttribute("type", this.__getType());
			this.util.addEvent(this.__textBox,"blur",this.__textBoxFocusOutHandler.bind(this));
			this.util.addEvent(this.__textBox,"focus",this.__focusInHandler.bind(this));
			//this.util.addEvent(this.__textBox,"search",this.__searchHandler.bind(this));
			if(this.__enableAutoComplete)
			{
				this.util.addStyleClass(this.__outerContainer,"nsTextBoxContainerAutoComplete");
				this.util.addStyleClass(this.__textBox,"nsTextBoxAutoComplete");
				this.__textBox.setAttribute("autocomplete","off");
				if(this.__enableMultipleSelection)
				{
					this.util.addEvent(this.__textBox,"keyup",this.__keyUpMultiSelectionHandler.bind(this));
					this.util.addEvent(this.__textBox,"keydown",this.__keyDownMultiSelectionHandler.bind(this));
					this.util.addStyleClass(this.__outerContainer,"nsTextBoxMultiSelectContainer");
					this.util.addEvent(this.__outerContainer,"click",this.__outerContainerClickHandler.bind(this));
					this.util.addStyleClass(this.__textBox,"nsTextBoxMultiSelect");
				}
				else
				{
					this.util.addEvent(this.__textBox,"keyup",this.__keyUpHandler.bind(this));
					this.util.addEvent(this.__textBox,"keydown",this.__keyDownHandler.bind(this));
				}
			}
			this.__outerContainer.appendChild(this.__textBox);
			this.__createList();
		}
	};
	
	NSTextBox.prototype.__getType = function()
	{
		var textBoxType = "text";
		if(this.__type)
		{
			if(this.__type ===  NSTextBox.TYPE_AUTOCOMPLETE)
			{
				textBoxType = "search";
				this.__enableAutoComplete = true;
			}
			else if(this.__displayAsPassword)
			{
				textBoxType = "password";
			}
			else if(this.__type ===  NSTextBox.TYPE_AUTOTEXT || this.__type ===  NSTextBox.TYPE_EMAIL || this.__type ===  NSTextBox.TYPE_NUMBER || this.__type ===  NSTextBox.TYPE_PASSWORD || this.__type ===  NSTextBox.TYPE_URL)
			{
				textBoxType = this.__type;
			}
		}
		return textBoxType;
	};
	
	
	NSTextBox.prototype.__setTextBoxProperty = function() 
	{
		if(this.__textBox)
		{
			if(this.__required)
			{
				this.__textBox.setAttribute("required", "");
			}
			else
			{
				this.__textBox.removeAttribute("required");   
			}
			if(this.__placeholder && this.__placeholder.length > 0 && !this.__enableMultipleSelection)
			{
				this.__textBox.setAttribute("placeholder", this.__placeholder);
			}
			else
			{
				this.__textBox.removeAttribute("placeholder");
			}
			if(this.__maxChars > -1)
			{
				this.__textBox.setAttribute("maxLength", this.__maxChars);
			}
			if(this.__pattern)
			{
				this.__textBox.setAttribute("pattern", this.__pattern);
			}
			else
			{
				this.__textBox.removeAttribute("pattern");
			}
			if(this.__styleClass)
			{
				this.__setStyleClass(this.__styleClass);
			}
			if(this.__restrict)
			{
				if(!this.__keyPressedRef)
				{
					this.__keyPressedRef = this.__keyPressHandler.bind(this);
					this.util.addEvent(this.__textBox,"keypress",this.__keyPressedRef);
				}
				if(!this.__pasteRef)
				{
					this.__pasteRef = this.__pasteHandler.bind(this);
					this.util.addEvent(this.__textBox,"paste",this.__pasteRef);
				}
			}
			else
			{
				if(this.__keyPressedRef)
				{
					this.util.removeEvent(this.__textBox,"keypress",this.__keyPressedRef);
					this.__keyPressedRef = null;
				}
				if(this.__pasteRef)
				{
					this.util.removeEvent(this.__textBox,"paste",this.__pasteRef);
					this.__pasteRef = null;
				}
			}
		}
		var genericEventHandler = this.__genericTextBoxEvent.bind(this);
		this.util.addEvent(this.__textBox,"change",genericEventHandler);
		this.util.addEvent(this.__textBox,"input",this.__searchHandler.bind(this));
	};
	
	NSTextBox.prototype.__setStyleClass = function(cssClass)
	{
		if(cssClass && cssClass.length > 0)
		{
			this.__textBox.setAttribute("class","");
			this.util.addStyleClass(this.__textBox,cssClass);
		}
	};
	
	NSTextBox.prototype.__outerContainerClickHandler = function(event)
	{
		event = this.util.getEvent(event);
		this.__textBox.focus();
	};
	
	NSTextBox.prototype.__documentKeyUpHandler = function(event)
	{
		event = this.util.getEvent(event);
		var keyCode = this.util.getKeyUnicode(event);
		if(this.__isFocusOnControl() && this.__enableMultipleSelection && (keyCode == this.util.KEYCODE.SHIFT || keyCode == this.util.KEYCODE.CTRL))
		{
			this.__multiSelectHandler();
			this.__hideList();
		}
	};
	
	NSTextBox.prototype.__documentKeyDownHandler = function(event)
	{
		event = this.util.getEvent(event);
		var keyCode = this.util.getKeyUnicode(event);
		if(this.__isFocusOnControl() && this.__enableMultipleSelection && (keyCode == this.util.KEYCODE.BACKSPACE))
		{
			 var arrSelectedItems = this.getSelectedItems();
			 if(arrSelectedItems && arrSelectedItems.length > 0) 
			 {
				 arrSelectedItems.pop();
				 if(this.__getNSControl())
				 {
					 this.setSelectedItems(arrSelectedItems);
				 }
				 this.__selectedItems = arrSelectedItems;
				 this.__refreshMultiSelectTags();
	         }
		}
	};
	
	NSTextBox.prototype.__keyUpHandler = function(event)
	{
		if(this.__isFocusOnControl())
		{
			event = this.util.getEvent(event);
			var keyCode = this.util.getKeyUnicode(event);
			if (keyCode == this.util.KEYCODE.ESC) 
			{
				this.__hideList();
			}
			else if (!(keyCode == this.util.KEYCODE.UP || keyCode == this.util.KEYCODE.DOWN || keyCode == this.util.KEYCODE.ENTER || keyCode == this.util.KEYCODE.SHIFT || keyCode == this.util.KEYCODE.CTRL)) 
			{
				this.__itemUnSelectHandler(event);
				if(!this.__textBox.value || this.__textBox.value == "" || this.__textBox.value.length < this.__minSearchStartChars)
				{
					this.__hideList();
				}
				else
				{
					if(this.__timerInstance)
					{
						clearTimeout(this.__timerInstance);
					}
					var compRef = this;
					this.__timerInstance = setTimeout(
					function()
					{ 
						compRef.__searchText(compRef.__getSearchText(compRef.__textBox.value));
					},this.__delay);
				}
			}
			else if (keyCode == this.util.KEYCODE.UP || keyCode == this.util.KEYCODE.DOWN)
			{
				var nsControl = this.__getNSControl();
				if(nsControl && !nsControl.hasFocus())
				{
					nsControl.setFocus(true);
					nsControl.__setRowHover(0);
					this.__lastNavigatedItem = (nsControl.__arrInternalSource && nsControl.__arrInternalSource.length > 0) ? nsControl.__arrInternalSource[0] : null;
				}
			}
			else
			{
				event.preventDefault();
			}
		}
	};
	
	NSTextBox.prototype.__keyDownHandler = function(event)
	{
		if(this.__isFocusOnControl())
		{
			event = this.util.getEvent(event);
			var keyCode = this.util.getKeyUnicode(event);
			if(keyCode == this.util.KEYCODE.TAB)
			{
				if(this.__lastNavigatedItem)
				{
					this.__itemSelectHandler(null,this.__lastNavigatedItem);
					this.__lastNavigatedItem = null;
				}
			}
		}
	};
	
	NSTextBox.prototype.__keyUpMultiSelectionHandler = function(event)
	{
		if(this.__isFocusOnControl())
		{
			event = this.util.getEvent(event);
			var keyCode = this.util.getKeyUnicode(event);
			//if backspace is pressed then return
			if(keyCode == this.util.KEYCODE.BACKSPACE)
			{
				return;
			}
			if (keyCode == this.util.KEYCODE.ESC) 
			{
				this.__hideList();
			}
			else if(keyCode == this.util.KEYCODE.SHIFT || keyCode == this.util.KEYCODE.CTRL)
			{
				this.__multiSelectHandler();
				this.__hideList();
			}
			
			//key Up
			/*if(keyCode === this.util.KEYCODE.UP && isShiftCtrlPressed && this.__enableMultipleSelection)
			{
			}
			//key down
			else if(keyCode === this.util.KEYCODE.DOWN && isShiftCtrlPressed && this.__enableMultipleSelection)
			{
			}*/
			else if (!(keyCode == this.util.KEYCODE.UP || keyCode == this.util.KEYCODE.DOWN || keyCode == this.util.KEYCODE.ENTER || keyCode == this.util.KEYCODE.SHIFT || keyCode == this.util.KEYCODE.CTRL)) 
			{
				if(!this.__textBox.value || this.__textBox.value == "" || this.__textBox.value.length < this.__minSearchStartChars)
				{
					this.__hideList();
				}
				else
				{
					if(this.__timerInstance)
					{
						clearTimeout(this.__timerInstance);
					}
					var compRef = this;
					this.__timerInstance = setTimeout(
					function()
					{ 
						compRef.__searchText(compRef.__getSearchText(compRef.__textBox.value));
					},this.__delay);
				}
			}
			else
			{
				event.preventDefault();
			}
		}
	};
	
	NSTextBox.prototype.__keyDownMultiSelectionHandler = function(event)
	{
		event = this.util.getEvent(event);
		var currentWidth = this.__textBox.offsetWidth;
		var width = this.__measureString(this.__textBox,this.__textBox.value + event.key) + 4;
		if (width !== currentWidth) 
		{
			this.__textBox.style.width = width + "px";
			this.__updateListPos();
		}
	};
	
	NSTextBox.prototype.__keyPressHandler = function(event)
	{
		if(this.__isFocusOnControl())
		{
			event = this.util.getEvent(event);
			var keyCode = this.util.getKeyUnicode(event);
			var keyPressed = String.fromCharCode(keyCode);
			if(!this.util.checkRegexValue(this.__restrict,keyPressed))
			{
				event.preventDefault();
			}
		}
	};
	
	NSTextBox.prototype.__genericTextBoxEvent = function(event,fireForcefully)
	{
		if(this.__isFocusOnControl() || fireForcefully)
		{
			event = this.util.getEvent(event);
			var cancelled = this.util.dispatchEvent(this.__baseComponent,event.type,this.getText(),{changeEvent:event},null,true);
			if(cancelled)
			{
				event.preventDefault();
			}
		}
	};
	
	NSTextBox.prototype.__documentClickHandler = function(event)
	{
		var closeList = true;
		var target = this.util.getTarget(event);
		if(target && target === this.__textBox)
		{
			closeList = false;
		}
		else
		{
			var targetList = this.util.findParentBySelector(target,".nsTextBoxList");
			if(targetList)
			{
				closeList = false;
			}
		}
		if(closeList)
		{
			this.__hideList();
			this.util.dispatchEvent(this.__baseComponent,NSTextBox.LIST_CLOSED_WITHOUT_SELECTION,this.getText(),{changeEvent:event});
		}
	};
	
	NSTextBox.prototype.__pasteHandler = function(event)
	{
		event = this.util.getEvent(event);
		var pastedText = undefined;
		var text = "";
		if (this.__context.clipboardData && this.__context.clipboardData.getData) 
		{ // IE
		    pastedText = this.__context.clipboardData.getData("Text");
		} 
		else if (event.clipboardData && event.clipboardData.getData) 
		{
		    pastedText = event.clipboardData.getData("text/plain");
		}
		var pastedTextLength = pastedText.length;
		for (var count = 0; count < pastedTextLength; count++) 
		{
			var char = pastedText.charAt(count);
	        if(this.util.checkRegexValue(this.__restrict,char))
	    	{
	        	text += char;
	    	}
	    }
		this.__textBox.value += text;
		event.preventDefault();
	};
	
	NSTextBox.prototype.__focusInHandler = function(event)
	{
		if(this.nsTip)
		{
			this.nsTip.remove();
		}
		if(this.__enableAutoComplete)
		{
			if(this.__textBox.value.length >= this.__minSearchStartChars && this.__dataSource && this.__dataSource.length > 0 && !this.__isFromItemSelected && !this.__isFromCloseIcon)
			{
				this.__setListDataSource(this.__dataSource);
				if(this.__textBox.value.length > 0)
				{
					this.__searchText(this.__getSearchText(this.__textBox.value));
				}
				this.__showHideList(true);
			}
			this.__isFromItemSelected = false;
			this.__isFromCloseIcon = false;
		}
	};
	
	NSTextBox.prototype.__textBoxFocusOutHandler = function(event)
	{
		if(this.__minChars > -1 && this.__textBox.value && this.__textBox.value.length < this.__minChars)
		{
			this.__textBox.setCustomValidity("Please enter atleast " + this.__minChars  + " characters.");
		}
		else 
		{
			this.__textBox.setCustomValidity("");
		}
	};
	
	NSTextBox.prototype.__searchHandler = function(event)
	{
		//the above code is for cross icon clicked when we enter any character
		//it might result in ITEM_UNSELECTED event called multiple times
		if(this.__enableAutoComplete && this.getSelectedItem() && this.__textBox.value == "")
		{
			this.unSelectAll(true);
		}
		this.__genericTextBoxEvent(event,true);
	};
	
	NSTextBox.prototype.__searchText = function(searchString,callClientSearch)
	{
		if(!callClientSearch && this.__isServerSideCall(searchString))
		{
			if(this.__lastSearchParam.toLowerCase() !== searchString.substr(0,this.__minSearchStartChars).toLowerCase())
			{
				if(this.__serverSearchCallback && this.util.isFunction(this.__serverSearchCallback))
				{
					this.__isFromSearchTextSever = true;
					var sendString = searchString;
					if(this.__enableServerWithSmartSearch)
					{
						this.__lastSearchParam = searchString.substr(0,this.__minSearchStartChars);
						sendString = this.__lastSearchParam;
					}
					this.__serverSearchCallback(sendString,this.__filterSetting,this.__enableHighlighting,this.__searchRecordLimit);
				}
				else
				{
					this.util.throwNSError("NSTextBox","ServerSearchCallback attribute doesnot have a valid value");
				}
			}
		}
		else if(this.__dataSource && this.__dataSource.length > 0)
		{
			if(searchString === "")
			{
				//should not have been done like this but grid has method resetFilters and List has resetFilter
				var nsControl = this.__getNSControl();
				var resetFilter = nsControl["resetFilter"] ? nsControl["resetFilter"] : nsControl["resetFilters"];
				resetFilter();
			}
			else
			{
				var control = this.__getNSControl();
				if(this.__isAutoCompleteTypeList())
				{
					control.filter(searchString,this.__filterSetting,this.__enableHighlighting,this.__searchRecordLimit);
				}
				else
				{
					var arrFilterField = this.__arrGridSearchField;
					if(!arrFilterField || arrFilterField.length === 0)
					{
						arrFilterField = [this.__labelField];
					}
					if(this.__isGridOrFilter)
					{
						 var filter = [];
						 var setting = {};
						 for(var count = 0;count < arrFilterField.length;count++)
						 {
							 var field = arrFilterField[count];
							 if(field)
							 {
								 var item = {};
								 item[field] = searchString;
								 setting[field] = this.__filterSetting;
								 filter.push(item);
							 }
						 }
					}
					else
					{
						var filter = {};
						var setting = {};
						for(var count = 0;count < arrFilterField.length;count++)
						{
							var field = arrFilterField[count];
							if(field)
							{
								filter[field] = searchString;
								setting[field] = this.__filterSetting;
							}
						}
					}
					control.filter(filter,setting,this.__enableHighlighting,this.__searchRecordLimit);
				}
			}
			this.__showHideList(true);
		}
	};
	
	NSTextBox.prototype.__isServerSideCall = function(searchString)
	{
		if(this.__enableServerWithSmartSearch)
		{
			var isSearchLength = ((searchString.length === this.__minSearchStartChars) || (searchString.length > this.__minSearchStartChars));
			var isContainsTempSearch = (!this.__dataSource || this.__dataSource.length == 0) || (this.__lastSearchParam.toLowerCase() !== searchString.substr(0,this.__minSearchStartChars).toLowerCase());
			return (isSearchLength && isContainsTempSearch);
		}
		return this.__enableServerSide;
		
	};
	
	NSTextBox.prototype.__createList = function()
	{
		if(!this.__list)
		{
			this.__list = this.util.createDiv(this.getID() + "list","nsTextBoxList");
			this.__list.style.height = this.__maxListHeight + "px";
			this.__outerContainer.appendChild(this.__list);
			if(this.__isAutoCompleteTypeList())
			{
				if(!this.__nsList)
				{
					if(!this.__dropDownSetting)
					{
						this.__dropDownSetting = {};
					}
					var overrideSetting = {labelField:this.__labelField,enableDragDrop:false,enableDragByHandle:false,
							   	   enableMultipleSelection:this.__enableMultipleSelection,enableKeyboardNavigation:this.__enableKeyboardNavigation,
							   	   enableMouseHover:true,enableMouseHoverAnimation:false,disableHoverField:this.__stopHoveringField};
					if(this.__templateID)
					{
						overrideSetting["template"] = this.__templateID;
						overrideSetting["setData"] = this.__setDataCallBack;
					}
					else
					{
						overrideSetting["itemRenderer"] = this.__itemRenderer;
					}
					var setting =  this.util.cloneObject(this.__dropDownSetting);
					for(var key in overrideSetting)
					{
						setting[key] = overrideSetting[key];
					}
					this.__nsList = new NSList(this.__list,setting);
					//this.__updateListPos();
					this.util.addEvent(this.__list,this.__nsList.ITEM_NAVIGATED,this.__itemNavigationHandler.bind(this));
					this.util.addEvent(this.__list,this.__nsList.ITEM_SELECTED,this.__itemSelectHandler.bind(this));
					this.util.addEvent(this.__list,this.__nsList.ITEM_UNSELECTED,this.__itemUnSelectHandler.bind(this));
				}
			}
			else
			{
				if(!this.__nsGrid)
				{
					if(!this.__dropDownSetting)
					{
						this.__dropDownSetting = {};
					}
					var overrideSetting = {type:"",enableMouseHover:true,enableFilter:true,enableAdvancedFilter:false,enablePagination:false, 
					          				columnResizable:false,columnDraggable:false,leftFixedColumn:0,rightFixedColumn:0,
					          				enableRowMove:false,enableContextMenu:false,enableExport:false,enableResponsive:false,
					          				theme:"White",enableCellSelection:false,enableRowSelection:true,enableDragDrop:false,
					          				enableDragByHandle:false,enableMultipleSelection:this.__enableMultipleSelection,
					          				enableKeyboardNavigation:this.__enableKeyboardNavigation,disableHoverField:this.__stopHoveringField,
					          				isPopUp:true};
					/*if(this.__templateID)
					{
						overrideSetting["template"] = this.__templateID;
						overrideSetting["setData"] = this.__setDataCallBack;
					}
					else
					{
						overrideSetting["itemRenderer"] = this.__itemRenderer;
					}*/
					var setting =  this.util.cloneObject(this.__dropDownSetting);
					for(var key in overrideSetting)
					{
						setting[key] = overrideSetting[key];
					}
					for(var count = 0;count < setting["columns"].length;count++)
					{
						var column = setting["columns"][count];
						column["enableFilter"] = false;
					}
					this.__nsGrid = new NSGrid(this.__list,setting);
					this.__nsGrid.setColumn(setting["columns"]);
					//this.__nsGrid.dataSource(arrItems);
					this.util.addEvent(this.__list,NSGrid.ROW_NAVIGATED,this.__itemNavigationHandler.bind(this));
					this.util.addEvent(this.__list,NSGrid.ROW_SELECTED,this.__itemSelectHandler.bind(this));
					this.util.addEvent(this.__list,NSGrid.ROW_UNSELECTED,this.__itemUnSelectHandler.bind(this));
				}
			}
			this.__hideList();
		}
	};
	
	NSTextBox.prototype.__setListDataSource = function(dataSource)
	{
		if(this.__getNSControl())
		{
			var source = this.util.cloneObject(dataSource);
			this.__getNSControl().dataSource(source);
		}
	};
	
	NSTextBox.prototype.__updateListPos = function()
	{
		if(this.__list)
		{
			/*var offset = {left:0,top:1};
            var rect = this.__outerContainer.getBoundingClientRect();
            this.__list.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + offset.left) + 'px';
            this.__list.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + offset.top) + 'px';*/
            if(this.__listWidth > 0)
			{
				this.__list.style.width = this.__listWidth + "px";
			}
			else
			{
				this.__list.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
			}
		}
	};
	
	NSTextBox.prototype.__hideList = function()
	{
		this.__showHideList(false);
	};
	
	NSTextBox.prototype.__showHideList = function(isShow)
	{
		if(this.__list)
		{
			this.__list.style.visibility = isShow ? "" : "hidden";
			//this.__list.style.display = isShow ? "" : "none";
			if(isShow)
			{
				this.__updateListPos();
				var control = this.__getNSControl();
				if(control && control.reRender)
				{
					setTimeout(function(){
						control.reRender.call(control);
					},10);
				}
			}
			else
			{
				this.__getNSControl().setFocus(false);
			}
		}
	};
	
	NSTextBox.prototype.__isListVisible = function()
	{
		if(this.__list)
		{
			return !(this.__list.style.visibility == "hidden");
		}
		return false;
	};
	
	NSTextBox.prototype.__itemNavigationHandler = function(event)
	{
		if(event && event.detail)
		{
			this.__lastNavigatedItem = event.detail;
			if(!this.__enableMultipleSelection)
			{
				//this.__textBox.value = this.__lastNavigatedItem[this.__labelField];
			}
		}
	};
	
	NSTextBox.prototype.__itemSelectHandler = function(event,item)
	{
		var selectedItem = item ? item : ((event && event.detail) ? event.detail : null);
		if(selectedItem)
		{
			 selectedItem = this.__getNSControl().getOrignalItem(selectedItem);
			//console.log(this.__nsList.getSelectedItems());
			this.__selectedItem = selectedItem;
			if(this.__enableMultipleSelection)
			{
				this.__refreshMultiSelectTags();
			}
			else
			{
				this.__textBox.value = this.__getItemText(this.__selectedItem);
				this.__isFromItemSelected = true;
				this.__hideList();
			}
			event ? event.stopPropagation() : null;
			var index = event ? event.index : null;
			this.util.dispatchEvent(this.__baseComponent,NSTextBox.ITEM_SELECTED,selectedItem,{index:index});
		}
	};
	
	NSTextBox.prototype.__itemUnSelectHandler = function(event)
	{
		if(this.__enableMultipleSelection)
		{
			this.__refreshMultiSelectTags();
		}
		//this.__selectedItem = null;
		//this.__selectedItems = [];
		if(event)
		{
			event.stopPropagation();
			this.util.dispatchEvent(this.__baseComponent,NSTextBox.ITEM_UNSELECTED,event.detail,{index:event.index});
		}
		else
		{
			this.util.dispatchEvent(this.__baseComponent,NSTextBox.ITEM_UNSELECTED);
		}
	};
	
	NSTextBox.prototype.__multiSelectHandler = function()
	{
		var nsControl = this.__getNSControl();
		if(nsControl && nsControl.getSelectedItems() && nsControl.getSelectedItems().length > 0)
		{
			this.__selectedItems = this.getSelectedItems();
			this.__refreshMultiSelectTags();
			/*var setText = "";
			for(var count = 0;count < this.__selectedItems.length;count++)
			{
				setText += this.__multiSelectionSeparator + this.__selectedItems[count][this.__labelField];
			}
			if(setText && setText.length > 0)
			{
				this.__textBox.value = setText.substring(1,setText.length);
			}*/
		}
	};
	
	NSTextBox.prototype.__refreshMultiSelectTags = function() 
	{
	    var arrTags = this.__getAllMultiSelectTags();
	    var length = arrTags.length;
	    var tag = null;
	    var count = 0;
	    for(count = length - 1;count > -1;count--)
	    {
	    	tag = arrTags[count];
	    	tag.parentNode.removeChild(tag);
	    }
	    var arrSelectedItems = this.getSelectedItems();
	    if(arrSelectedItems && arrSelectedItems.length > 0) 
	    {
	    	length = arrSelectedItems.length;
	    	for(count = 0; count < length; count++) 
	    	{
	    		tag = this.__createMultiSelectTag(arrSelectedItems[count]);
	    		this.__outerContainer.insertBefore(tag,this.__textBox);
	        }
	    }
	    this.__textBox.value = "";
	};
	
	NSTextBox.prototype.__createMultiSelectTag = function(item) 
	{
		var tag = this.util.createDiv(null,"nsTextBoxMultiSelectTag");
	    var content = this.util.createDiv(null,"nsTextBoxMultiSelectTagText");
	    content.textContent = this.__getItemText(item);
	    tag.appendChild(content);
	    var btnRemove = this.util.createDiv(null,"nsTextBoxMultiSelectTagClose");
	    this.util.addEvent(btnRemove,"click",this.__removeMultiSelectTag.bind(this,tag,item));
	    tag.appendChild(btnRemove);
	    return tag;
	};
	
	NSTextBox.prototype.__removeMultiSelectTag = function(tag,item,event) 
	{
		var selectedItems = this.getSelectedItems();
		var index = selectedItems.indexOf(item);
		if(index > -1) 
		{
			item["ns_field_selected"] = false;
			selectedItems.splice(index,1);
			this.setSelectedItems(selectedItems);
		}
		this.__refreshMultiSelectTags();
		this.__isFromCloseIcon = true;
		event = this.util.getEvent(event);
		if(event)
		{
			event.stopImmediatePropagation();
		}
	};
	
	NSTextBox.prototype.__getAllMultiSelectTags = function() 
	{
		return this.__outerContainer.querySelectorAll(".nsTextBoxMultiSelectTag");
	};
	
	NSTextBox.prototype.__getItemText = function(item)
	{
		var retValue = "";
		if(item)
		{
			var isNoRecord = false;
			if(this.__selectedItem["__ns__index"] === -1)
			{
				isNoRecord = true;
			}
			if(!isNoRecord)
			{
				if(this.__textBoxRendererCallback)
				{
					retValue = this.__textBoxRendererCallback(item,this.__labelField);
				}
				else
				{
					retValue = item[this.__labelField];
				}
			}
		}
		return retValue;
	};
	
	NSTextBox.prototype.__isMouseHoverAllowed = function(item)
	{
		if(item && Boolean.parse(item[this.__stopHoveringField]))
		{
			return false;
		}
		return true;
	};
	
	NSTextBox.prototype.__isFocusOnControl = function()
	{
		if(this.hasFocus() || (document.activeElement == this.__textBox) || (this.__getNSControl() && this.__getNSControl().hasFocus()))
		{
			return true;
		}
		return false;
	};
	
	NSTextBox.prototype.__isAutoCompleteTypeList = function()
	{
		return (this.__dropDownType === NSTextBox.DROPDOWN_TYPE_LIST);
	};
	
	NSTextBox.prototype.__getNSControl = function()
	{
		if(this.__isAutoCompleteTypeList())
		{
			return this.__nsList;
		}
		return this.__nsGrid;
	};
	
	NSTextBox.prototype.__measureString = function(control,text)
	{
		if (!text) 
		{
			return 0;
		}
		var self= this;
		var transferStyles = function(fromControl,toControl,arrProperties) 
		{
			var style = "";
			if (arrProperties) 
			{
				var length = arrProperties.length;
				for (var count = 0; count < length; count++) 
				{
					style += arrProperties[count] + ":" + self.util.getStyleValue(fromControl,arrProperties[count]) + ";";
				}
			} 
			else 
			{
				style = fromControl.getAttribute("style");
			}
			toControl.setAttribute("style",style);
		};
		
		var test = this.util.createElement("test",null,"nsTextBoxTest");
		test.appendChild(document.createTextNode(text)); 
		document.body.appendChild(test);
		transferStyles(control,test,['letterSpacing','fontSize','fontFamily','fontWeight','textTransform']);
		var width = test.offsetWidth;
		document.body.removeChild(test);
	
		return width;
	};
	
	NSTextBox.prototype.__getSearchText = function(searchValue)
	{
		if(searchValue && this.__splitSearchType)
		{
			var arrSplit = searchValue.split(this.__splitSearchType);
			if(arrSplit && arrSplit.length)
			{
				searchValue = arrSplit[arrSplit.length - 1]
			}
		}
		return searchValue;
	};
	
	NSTextBox.ITEM_SELECTED = "itemSelected";
	NSTextBox.ITEM_UNSELECTED = "itemUnselected";
	NSTextBox.TYPE_AUTOTEXT = "text";
	NSTextBox.TYPE_AUTOCOMPLETE = "autocomplete";
	NSTextBox.TYPE_EMAIL = "email";
	NSTextBox.TYPE_NUMBER = "number";
	NSTextBox.TYPE_PASSWORD = "password";
	NSTextBox.TYPE_URL = "url";
	NSTextBox.DROPDOWN_TYPE_LIST = "list";
	NSTextBox.DROPDOWN_TYPE_GRID = "grid";
	NSTextBox.LIST_CLOSED_WITHOUT_SELECTION = "listClosedWithoutSelection";
	
	return NSTextBox;
})();
nsModuleExport(__nsGlobal,"NSTextBox",NSTextBox);