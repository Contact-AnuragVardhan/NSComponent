var NSEditor = (function()
{
	function NSEditor(component,setting) 
	{
		this.__orignalTextArea = component;
		this.__setting = setting;
		
		this.__context = window;
		
		this.editorUtil = null;
		this.__config = null;
		this.__selection = null;
		this.__toolBar = null;
		this.__execCommand = null;
		this.__stack = null;
		
		this.__divOuterContainer = null;
		this.__divTabContainer = null;
		this.__divBodyContainer = null;
		this.__divFooterContainer = null;
		this.__divFooterLeftContainer = null;
		this.__divFooterRightContainer = null;
		this.__divLineNumberContainer = null;
		this.__divTextAreaContainer = null;
		this.__compTextArea = null;
		this.__divLineNumberWrapper = null;
		this.__frameContentWindow = null;
		this.__frameContentDoc = null;
		this.__frameBody = null;
		this.__txtSourceCode = null;
		this.__iframePrint = null;
		
		this.__textAreaScrollRef = null;
		this.__textAreaResizeRef = null;
		this.__textAreaKeyUpRef = null;
		this.__textAreaKeyDownRef = null;
		
		this.__textAreaObserver = null; 
		this.__orignalTextAreaObserver = null; 
		this.__timeOutInterval = null;
		this.__lastTextAreaHeight = 0; 
		this.__lastTextAreaWidth = 0;
		this.__paddingHorizontal = 0;
		this.__browserDetail = null;
		this.__dom = null;
		this.__accessibleKeys = null;
		this.__toolBarButton = null;
		this.__objShortKey = {};
		this.__isDisabled = false;
		this.__isFrameDesignModeEnabled = false;
		this.__isSourceMode = false;
		this.__isInternalHTMLChange = false;
		this.__hasRendered = false;
		this.__renderedInterval = null;
		this.__resizeInterval = null;
		//this.__defaultContent = "<p class='nsEditorLineElement'><br></p>";
		this.__defaultContent = null;
		 //queue up the functions not called as Creation Complete called later
		this.__queueFunc = [];
		
		this.__pluginsInstances = {};
		this.__utilInstance = {};
		
		this.__compPlaceHolder = null;
		this.__placeHolderToggleRef = null;
		this.__compFixed = null;
		this.__funcID = null;
		
		this.__init();
		
		this.base.__setBaseComponent.call(this,this.__divOuterContainer);
	};
	nsExtendPrototype(NSContainerBase,NSEditor);
	NSEditor.prototype.constructor = NSEditor;
	
	NSEditor.prototype.initializeComponent = function() 
	{
		this.base.initializeComponent.call(this);
		this.__browserDetail = this.util.getBrowser();
		this.__dom = this.util.getDomVariables();
		this.__accessibleKeys = {ctrl:{str:"ctrl",isPressed:function(event,keyCode){
			return (event.ctrlKey || event.metaKey || keyCode === 91 || keyCode === 92 || keyCode === 224);
		}},
		shift:{str:"shift",isPressed:function(event,keyCode){
			return event.shiftKey;
		}},
		alt:{str:"alt",isPressed:function(event,keyCode){
			return event.altKey;
		}},
		}
		
		this.__toolBarButton = {"bold":{html:"<i class='ns-icon ns-editor-bold' aria-hidden='true'></i>",tooltip:"Bold",tags: ["b", "strong"],css: {fontWeight: "bold"},shortKey:["ctrl+b"],command:"bold",showAsMenu: true},
				   "italic":{html:"<i class='ns-icon ns-editor-italics' aria-hidden='true'></i>",tooltip:"Italic",tags: ["i", "em"],css: {fontStyle: "italic"},shortKey: ["ctrl+i"],command:"italic",showAsMenu: true},
				   "underline":{html:"<i class='ns-icon ns-editor-underline' aria-hidden='true'></i>",tooltip:"Underline",tags: ["u"],css: {textDecoration: "underline"},shortKey: ["ctrl+u"],command:"underline",showAsMenu: true},
				   "strikeThrough":{html:"<i class='ns-icon ns-editor-strikethrough' aria-hidden='true'></i>",tooltip:"Strikethrough",tags: ["s", "strike"],css: {textDecoration: "line-through"},shortKey: ["ctrl+shift+s"],command:"strikeThrough",showAsMenu: true},
				   "justifyCenter":{html:"<i class='ns-icon ns-editor-align-center' aria-hidden='true'></i>",tooltip:"Justify Center",css: {textAlign: "center"},command:"justifyCenter"},
				   "justifyLeft":{html:"<i class='ns-icon ns-editor-align-left' aria-hidden='true'></i>",tooltip:"Justify Left",css: {textAlign: "left"},command:"justifyLeft"},
				   "justifyRight":{html:"<i class='ns-icon ns-editor-align-right' aria-hidden='true'></i>",tooltip:"Justify Right",css: {textAlign: "right"},command:"justifyRight"},
				   "justifyFull":{html:"<i class='ns-icon ns-editor-align-justify' aria-hidden='true'></i>",tooltip:"Justify Full",tags: ["s", "strike"],css: {textAlign: "justify"},command:"justifyFull"},
				   "subscript":{html:"<i class='ns-icon ns-editor-subscript' aria-hidden='true'></i>",tooltip:"Subscript",tags: ["sub"],command:"subscript",showAsMenu: true},
				   "superscript":{html:"<i class='ns-icon ns-editor-superscript' aria-hidden='true'></i>",tooltip:"Superscript",tags: ["sup"],command:"superscript",showAsMenu: true},
				  
				   "paragraph":{html:"<p>Normal</p>",tooltip:"Paragraph",command: "FormatBlock",
						   		    "arguments": (this.__browserDetail.isMSIE || this.__browserDetail.isSafari) ? "<p>" : "p",tags:["p"]},
				   "header1":{html:"<h1>Heading 1</h1>",tooltip:"Header 1",
					   				 command: "FormatBlock",
							   		 "arguments": "<h1>",tags: ["h1"]},
			   	   "header2":{html:"<h2>Heading 2</h2>",tooltip:"Header 2",
			   		   		  command: "FormatBlock",
		   				 	  "arguments": "<h2>",tags: ["h2"]},
				   "header3":{html:"<h3>Heading 3</h3>",tooltip:"Header 3",
					   		  command: "FormatBlock",
							  "arguments": "<h3>",tags: ["h3"]},
				   "header4":{html:"<h4>Heading 4</h4>",tooltip:"Header 4",
					   		  command: "FormatBlock",
			   		  		 "arguments": "<h4>",tags: ["h4"]},
				   "orderedList":{html:"<i class='ns-icon ns-editor-ordered-list' aria-hidden='true'></i>",tooltip:"Ordered List",command:"insertorderedlist",afterCommand:this.__orderedListHandler.bind(this),showAsMenu: true},
				   "unorderedList":{html:"<i class='ns-icon ns-editor-unordered-list' aria-hidden='true'></i>",tooltip:"Unordered List",command:"insertunorderedlist",afterCommand:this.__orderedListHandler.bind(this),showAsMenu: true},
				   "undo":{html:"<i class='ns-icon ns-editor-undo' aria-hidden='true'></i>",tooltip:"Undo",shortKey:["ctrl+z"],command:"undo",showAsMenu: true},
				   "redo":{html:"<i class='ns-icon ns-editor-redo' aria-hidden='true'></i>",tooltip:"Redo",shortKey:["ctrl+y"],command:"redo",showAsMenu: true},
				   "outdent":{html:"<i class='ns-icon ns-editor-decrease-indent' aria-hidden='true'></i>",tooltip:"Decrease Indent",command:"outdent",showAsMenu: true},
				   "indent":{html:"<i class='ns-icon ns-editor-increase-indent' aria-hidden='true'></i>",tooltip:"Increase Indent",command:"indent",showAsMenu: true},
				   "viewSourceCode":{html:"<i class='ns-icon ns-editor-source' aria-hidden='true'></i>",tooltip:"View Source Code",click: this.__viewSourceCodeHandler.bind(this),showAsMenu: true},
				   "clear":{html:"<i class='ns-icon ns-editor-new-doc' aria-hidden='true'></i>",tooltip:"Empty Document",click: this.__emptyDocHandler.bind(this),showAsMenu: true},
				   "print":{html:"<i class='ns-icon ns-editor-print' aria-hidden='true'></i>",tooltip:"Print",click: this.__printHandler.bind(this),showAsMenu: true},
				   "preview":{html:"<i class='ns-icon ns-editor-preview' aria-hidden='true'></i>",tooltip:"Preview",click: this.__previewHandler.bind(this),showAsMenu: true},
				   "pageBreakForPrinting":{html:"<i class='ns-icon ns-editor-bookmark' aria-hidden='true'></i>",tooltip:"Insert Page Break for Printing",click: this.__pageBreakForPrintingHandler.bind(this),showAsMenu: true},
				   "horizontalRule":{html:"<i class='ns-icon ns-editor-minus' aria-hidden='true'></i>",tooltip:"Insert Horizontal Line",command:"insertHorizontalRule",tags:["hr"],showAsMenu: true},
				   "fontFamily":{html:"<i class='ns-icon ns-editor-font' aria-hidden='true'></i>",tooltip:"Font Family",showAsMenu: true,
			   			isDropdown:true,
			   			dataSource:[{value:"Arial",html:"<span style=\"font-family: Arial\">Arial</span>",tooltip:"Arial",command:"fontName","arguments":"Arial"},
			   			            {value:"Arial Black",html:"<span style=\"font-family: Arial Black\">Arial Black</span>",tooltip:"Arial Black",command:"fontName","arguments":"Arial Black"},
			   			            {value:"Courier",html:"<span style=\"font-family: Courier\">Courier</span>",tooltip:"Courier",command:"fontName","arguments":"Courier"},
			   			            {value:"Courier New",html:"<span style=\"font-family: Courier New\">Courier New</span>",tooltip:"Courier New",command:"fontName","arguments":"Courier New"},
			   			            {value:"Comic Sans MS",html:"<span style=\"font-family: Comic Sans MS\">Comic Sans MS</span>",tooltip:"Comic Sans MS",command:"fontName","arguments":"Comic Sans MS"},
			   			            {value:"Courier",html:"<span style=\"font-family: Courier\">Courier</span>",tooltip:"Courier",command:"fontName","arguments":"Courier"},
			   			            {value:"Georgia",html:"<span style=\"font-family: Georgia\">Georgia</span>",tooltip:"Georgia",command:"fontName","arguments":"Georgia"},
			   			            {value:"Impact",html:"<span style=\"font-family: Impact\">Impact</span>",tooltip:"Impact",command:"fontName","arguments":"Impact"},
			   			            {value:"Lucida Grande",html:"<span style=\"font-family: Lucida Grande\">Lucida Grande</span>",tooltip:"Lucida Grande",command:"fontName","arguments":"Lucida Grande"},
			   			            {value:"Lucida Sans",html:"<span style=\"font-family: Lucida Sans\">Lucida Sans</span>",tooltip:"Lucida Sans",command:"fontName","arguments":"Lucida Sans"},
			   			            {value:"Serif",html:"<span style=\"font-family: Serif\">Serif</span>",tooltip:"Serif",command:"fontName","arguments":"Serif"},
			   			            {value:"Sans",html:"<span style=\"font-family: Sans\">Sans</span>",tooltip:"Sans",command:"fontName","arguments":"Sans"},
			   			            {value:"Tahoma",html:"<span style=\"font-family: Tahoma\">Tahoma</span>",tooltip:"Tahoma",command:"fontName","arguments":"Tahoma"},
			   			            {value:"Times",html:"<span style=\"font-family: Times\">Times</span>",tooltip:"Times",command:"fontName","arguments":"Times"},
			   			            {value:"Times New Roman",html:"<span style=\"font-family: Times New Roman\">Times New Roman</span>",tooltip:"Times New Roman",command:"fontName","arguments":"Times New Roman"},
			   			            {value:"Verdana",html:"<span style=\"font-family: Verdana\">Verdana</span>",tooltip:"Verdana",command:"fontName","arguments":"Verdana"}]},
				   "fontSize":{html:"<i class='ns-icon ns-editor-font-size' aria-hidden='true'></i>",tooltip:"Font Size",showAsMenu: true,
					   		    isDropdown:true,dataSource:[]},
				   "paragraphFormat":{html:"<i class='ns-icon ns-editor-paragraph' aria-hidden='true'></i>",tooltip:"Paragraph Format",showAsMenu: true,
					   			isDropdown:true,
					   			dataSource:[{value:"paragraph",htmlKey:"paragraph"},
					   			            {value:"header1",htmlKey:"header1"},
					   			            {value:"header2",htmlKey:"header2"},
					   			            {value:"header3",htmlKey:"header3"},
					   			            {value:"header4",htmlKey:"header4"}]},
 			       "align":{html:"<i class='ns-icon ns-editor-align-left' aria-hidden='true'></i>",tooltip:"Align",showAsMenu: true,
	 			    	  		isDropdown:true,
	 			    	  		dataSource:[{value:"justifyCenter",htmlKey:"justifyCenter"},
	 			    	  		            {value:"justifyLeft",htmlKey:"justifyLeft"},
	 			    	  		            {value:"justifyRight",htmlKey:"justifyRight"},
	 			    	  		            {value:"justifyFull",htmlKey:"justifyFull"}]},
	 		       "color":{html:"<i class='ns-icon ns-editor-font-color' aria-hidden='true'></i>",tooltip:"Font Color",showAsMenu: true,
	 						   isDropdown:true,dataSource:[]},
	 			   "backgroundColor":{html:"<i class='ns-icon ns-editor-background-color' aria-hidden='true'></i>",tooltip:"Background Color",showAsMenu: true,
		 					   isDropdown:true,dataSource:[]},
				 };
		//the browser doesnot allow font size > 7
		var arrFontSize = [{label:"xx-large",style:"xx-large",value:7},
		                   {label:"x-large",style:"x-large",value:6},
		                   {label:"large",style:"large",value:5},
		                   {label:"medium",style:"medium",value:4},
		                   {label:"small",style:"small",value:3},
		                   {label:"x-small",style:"x-small",value:2},
		                   {label:"xx-small",style:"xx-small",value:1}];
		var fontDataSource = [];
		for(var count = 0;count < arrFontSize.length;count++)
		{
			var item = arrFontSize[count];
			fontDataSource.push({value:item.label,html:"<span style=\"font-size: " + item.style + "\">" + item.label + "</span>",command:"fontsize","arguments":item.value});
		}
		this.__toolBarButton["fontSize"].dataSource = fontDataSource;
		var arrForeColor = [{label:"#000000",style:"#000000",value:"#000000"},
		                    {label:"#0000FF",style:"#0000FF",value:"#0000FF"},
							{label:"#30AD23",style:"#30AD23",value:"#30AD23"},
							{label:"#FF7F00",style:"#FF7F00",value:"#FF7F00"},
							{label:"#FF0000",style:"#FF0000",value:"#FF0000"},
							{label:"#FFFF00",style:"#FFFF00",value:"#FFFF00"},
							{label:"#FFFFFF",style:"#FFFFFF",value:"#FFFFFF"}];
		var foreColorDataSource = [];
		for(var count = 0;count < arrForeColor.length;count++)
		{
			var item = arrForeColor[count];
			foreColorDataSource.push({value:item.label,html:"<span style=\"color: " + item.style + "\">" + item.label + "</span>",command:"forecolor","arguments":item.value});
		}
		this.__toolBarButton["color"].dataSource = foreColorDataSource;
		var arrBackColor = [{label:"#000000",style:"#000000",value:"#000000"},
		                    {label:"#0000FF",style:"#0000FF",value:"#0000FF"},
							{label:"#30AD23",style:"#30AD23",value:"#30AD23"},
							{label:"#FF7F00",style:"#FF7F00",value:"#FF7F00"},
							{label:"#FF0000",style:"#FF0000",value:"#FF0000"},
							{label:"#FFFF00",style:"#FFFF00",value:"#FFFF00"},
							{label:"#FFFFFF",style:"#FFFFFF",value:"#FFFFFF"}];
		var backColorDataSource = [];
		for(var count = 0;count < arrBackColor.length;count++)
		{
			var item = arrBackColor[count];
			backColorDataSource.push({value:item.label,html:"<span style=\"color: " + item.style + "\">" + item.label + "</span>",command:"backcolor","arguments":item.value});
		}
		this.__toolBarButton["backgroundColor"].dataSource = backColorDataSource;
		this.__initializeModules();
		this.__initializePlugins();
		this.__setSetting();
		this.__initDefault();
		this.__initializeTools();
		this.__callInitializeInPluggin();
		this.__createComponent();
		this.attachResizeListener();
	};
	
	NSEditor.prototype.setComponentProperties = function() 
	{
		this.base.setComponentProperties.call(this);
	};
	
	NSEditor.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty)
	{
		var attributeName = attrName.toLowerCase();
		this.base.propertyChange.call(this,attrName, oldVal, newVal, setProperty);
	};
	
	NSEditor.prototype.removeComponent = function() 
	{
		this.base.removeComponent.call(this);
		this.util.removeStyleClass(this.__dom.doc.body,"nsEditorPresent");
		this.__callDestroyInPluggin();
		clearTimeout(this.__resizeInterval);
		var listenerComponent = this.__getListenerComponent();
		if(this.__textAreaScrollRef)
		{
			var element = this.__getScrollableComponent();
			this.util.removeEvent(element,"scroll",this.__textAreaScrollRef);
			this.__textAreaScrollRef = null;
		}
		if(this.__textAreaResizeRef)
		{
			this.util.removeEvent(listenerComponent,"resize",this.__textAreaResizeRef);
			this.__textAreaResizeRef = null;
		}
		if(this.__textAreaKeyUpRef)
		{
			this.util.removeEvent(listenerComponent,"keyup",this.__textAreaKeyUpRef);
			this.__textAreaKeyUpRef = null;
		}
		if(this.__textAreaKeyDownRef)
		{
			this.util.removeEvent(listenerComponent,"keydown",this.__textAreaKeyDownRef);
			this.__textAreaKeyDownRef = null;
		}
		this.__toolBar.destroy();
		if(this.__orignalTextAreaObserver)
		{
			this.__orignalTextAreaObserver.disconnect();
			this.__orignalTextAreaObserver = null;
		}
		if(this.__textAreaObserver)
		{
			this.__textAreaObserver.disconnect();
			this.__textAreaObserver = null;
		}
		if(this.__divOuterContainer)
		{
			if(this.__divOuterContainer.parentNode)
			{
				this.__divOuterContainer.parentNode.removeChild(this.__divOuterContainer);
			}
			this.__divOuterContainer = null;
		}
		if(this.__orignalTextArea)
		{
			this.util.removeStyleClass(this.__orignalTextArea,"nsEditorTextAreaHidden");
		}
		if(this.__iframePrint)
		{
			if(this.__iframePrint.parentNode)
			{
				this.__iframePrint.parentNode.removeChild(this.__iframePrint);
			}
			this.__iframePrint = null;
		}
	};
	
	NSEditor.prototype.componentResized = function(event) 
	{
		var baseMeasurement = this.__baseComponent.getBoundingClientRect();
		if(!this.__lastBaseMeasurement || this.__lastBaseMeasurement.height !== baseMeasurement.height || this.__lastBaseMeasurement.width !== baseMeasurement.width)
		{
			event = this.util.getEvent(event);
			clearTimeout(this.__resizeInterval);
			var self = this;
			this.__resizeInterval = setTimeout(function(){
				self.__dispatchInternalEvent("resize",{orignalEvent:event},{orignalEvent:event});
				self.__callResizedInPluggin([event]);
				self.base.componentResized.call(self,event);
			}, 250);
		}
	};
	
	NSEditor.prototype.registerPlugin = function(name,pluggin) 
	{
		if(name && pluggin)
		{
			if(!NSEditor.__plugins)
			{
				NSEditor.__plugins = {};
			}
			if(!NSEditor.__plugins[name])
			{
				NSEditor.__plugins[name] = pluggin;
			}
		}
	};
	
	NSEditor.prototype.registerUtil = function(name,util) 
	{
		if(name && util)
		{
			if(!NSEditor.__util)
			{
				NSEditor.__util = {};
			}
			if(!NSEditor.__util[name])
			{
				NSEditor.__util[name] = util;
			}
		}
	};
	
	//if setting["enableLineNumber"] is true then the components for line Number is created and then 
	// with toggleLineNumber function the Line Number visibility can be toggled
	NSEditor.prototype.toggleLineNumber = function() 
	{
		this.__config["enableLineNumber"] = !this.__config["enableLineNumber"];
		this.__setLineNumberVisibility(this.__config["enableLineNumber"]);
	};
	
	NSEditor.prototype.setDisabled = function(isDisabled) 
	{
		this.__isDisabled = isDisabled;
	};
	
	NSEditor.prototype.getDisabled = function() 
	{
		return this.__isDisabled;
	};
	
	NSEditor.prototype.getText = function() 
	{
		var text = this.__getTextFromTextArea();
		return (text ? text.replace(/(\r\n|\n|\r)/gm, "") : "");
	};
	
	NSEditor.prototype.setText = function(text) 
	{
		this.__setTextIntoTextArea(text);
	};
	
	NSEditor.prototype.getHtml = function() 
	{
		return this.__getHtmlFromTextArea();
	};
	
	NSEditor.prototype.setHtml = function(html) 
	{
		this.__setHtmlIntoTextArea(html);
	};
	
	NSEditor.prototype.__initDefault = function()
	{
		//item in autoSuggestTriggers will be {keyCode: 32, ctrlKey: true,shiftKey: false, preventDefault: true}
		if(!this.__config["autoSuggestTriggers"])
		{
			this.__config["autoSuggestTriggers"] = [];
		}
		if(!this.__config["mode"])
		{
			this.__config["mode"] = NSEditor.MODE_TEXTAREA;
		}
		this.__setDefaultContent();
	};
	
	NSEditor.prototype.__setDefaultContent = function()
	{
		this.__defaultContent = this.__getDefaultContent();
	};
	
	NSEditor.prototype.__getDefaultContent = function(asHtml)
	{
		asHtml = this.util.isUndefinedOrNull(asHtml) ? true : Boolean.parse(asHtml);
		var defaultElement = this.util.createElement(this.__config["enterElement"],null,"nsEditorLineElement");
		if(defaultElement)
		{
			defaultElement.innerHTML = "<br>"; 
		}
		else 
		{
			this.util.throwNSError("NSEditor","Enter a valid enterElement property");
		}
		return asHtml ? (defaultElement ? defaultElement.outerHTML : null) : defaultElement;
	};
	
	NSEditor.prototype.__setSetting = function()
	{
		if(!this.__setting)
		{
			this.__setting = {};
		}
		if(!this.__config)
		{
			this.__config = {};
		}
		var setting = this.__setting;
		if(setting)
		{
			if(setting.hasOwnProperty("context"))
			{
				this.__context = setting["context"];
			}
			this.__config = {
					enableToolBar: this.util.isUndefinedOrNull(this.__setting["enableToolBar"]) ? true : Boolean.parse(this.__setting["enableToolBar"]),
					toolBarButton: this.__setting["toolBarButton"],
					enableReadOnly: Boolean.parse(this.__setting["enableReadOnly"]),
					width: this.__setting["width"] || "auto",
				    height: this.__setting["height"] || "auto",
				    minWidth: this.__setting["minWidth"] || 200,
					minHeight: this.__setting["minHeight"] || 200,
					maxWidth: this.__setting["maxWidth"] || "100%",
					maxHeight: this.__setting["maxHeight"] || "100%",
				    theme: this.__setting["theme"] || "White",
				    //if this property is true then if bold is selected then in dom we use <b> or <strong> tag etc
				    //else we use style to do the same
				    enableTagsForProps: Boolean.parse(this.__setting["enableTagsForProps"]),
					enableSpellCheck: this.util.isUndefinedOrNull(this.__setting["enableSpellCheck"]) ? true : Boolean.parse(this.__setting["enableSpellCheck"]),
					enableTabBar: Boolean.parse(this.__setting["enableTabBar"]),
					enableLineNumber: Boolean.parse(this.__setting["enableLineNumber"]),
					enableToolBarActive: Boolean.parse(this.__setting["enableToolBarActive"]),
					enableAutoSuggest: Boolean.parse(this.__setting["enableAutoSuggest"]),
					autoSuggestTriggers: this.__setting["autoSuggestTriggers"],
					mode: this.__setting["mode"],
					placeholder: this.__setting["placeholder"],
					enterElement: this.__setting["enterElement"] || "p",// should ideally be <p> or <div> as others can create problems
					maxCharCount: this.util.isUndefinedOrNull(this.__setting["maxCharCount"]) ? null : parseInt(this.__setting["maxCharCount"]),
					charCounterType: this.__setting["charCounterType"] || "char", //char, byte, byte-html
					enableStickyToolbar: this.util.isUndefinedOrNull(this.__setting["enableStickyToolbar"]) ? true : Boolean.parse(this.__setting["enableStickyToolbar"]),
					enableStickyToolbarForMobile: this.util.isUndefinedOrNull(this.__setting["enableStickyToolbarForMobile"]) ? true : Boolean.parse(this.__setting["enableStickyToolbarForMobile"]),
					promptBoxCallback: this.__setting["promptBoxCallback"] ? this.util.getFunction(this.__setting["promptBoxCallback"]) : null,
			};
		}
		this.__callSetSettingsInPluggin();
		if(this.__config.enableToolBar && (!this.__config.toolBarButton || this.__config.toolBarButton.length == 0))
		{
			this.__config.toolBarButton = [];
			for(var key in this.__toolBarButton)
			{
				if(this.__toolBarButton[key].showAsMenu)
				{
					this.__config.toolBarButton.push(key);
				}
			}
		}
	};
	
	NSEditor.prototype.__init = function()
	{
		this.__divOuterContainer = document.createElement("div");
		this.__divOuterContainer.setAttribute("class","nsEditor nsEditorOuterContainer");
		if(this.__orignalTextArea && this.__orignalTextArea.parentNode)
		{
			if(this.__orignalTextArea.nextSibling)
			{
				this.__orignalTextArea.parentNode.insertBefore(this.__divOuterContainer, this.__orignalTextArea.nextSibling);
			}
			else
			{
				this.__orignalTextArea.parentNode.appendChild(this.__divOuterContainer);
			}
		}
		else
		{
			document.body.appendChild(this.__divOuterContainer);
		}
	};
	
	NSEditor.prototype.__initializeTools = function()
	{
	};
	
	NSEditor.prototype.__createComponent = function()
	{
		this.util.addStyleClass(this.__dom.doc.body,"nsEditorPresent");
		this.__createFixedComp();
		this.__toolBar.createToolBar();
		this.__createTabBar();
		this.__createBody();
		this.__createFooter();
		this.__createPlaceHolder();
		if(this.__isModeTextArea())
		{
			this.__initTextArea();
		}
		/*if(this.__isModeTextArea())
		{
			this.__callTextAreaFunc();
		}*/
	};
	
	NSEditor.prototype.__renderComplete = function()
	{
		var self = this;
		var callback = function()
		{
			if(self.__hasRendered)
			{
				if(self.__renderedInterval)
				{
					clearInterval(self.__renderedInterval);
					self.__renderedInterval = null;
				}
				if(self.__queueFunc && self.__queueFunc.length > 0)
				{
					for(var count = self.__queueFunc.length - 1;count > -1;count--)
					{
						self.__queueFunc[count]();
						self.__queueFunc.splice(count, 1);
					}
				}
			}
		};
		this.__renderedInterval = setInterval(callback, 300);
	};
	
	NSEditor.prototype.__callTextAreaFunc = function()
	{
		this.__callComponentsInitializedInPluggin();
		this.__setStyles();
		this.__renderComplete();
	};
	
	NSEditor.prototype.__resizeCallback = function(forciblyCalc,delayPeriod)
	{
		var self = this;
		var callback = function()
		{
			self.__setBodyStyle(forciblyCalc);
			self.__resizeIframe();
			self.__drawLineNumbers(1);
		};
		if(!delayPeriod)
		{
			delayPeriod = 0;
		}
		setTimeout(callback,delayPeriod);
	};
	
	NSEditor.prototype.__setStyles = function(delayPeriod)
	{
		var self = this;
		var callback = function()
		{
			var css = {};
			css.minWidth = self.__config.minWidth;
			css.minHeight = self.__config.minHeight;
			var maxWidth = self.__config.maxWidth;
			css.maxWidth = maxWidth;
			self.util.css(self.__divOuterContainer,css);
			self.__width(self.__config.width);
			self.__height(self.__config.height);
			
			//delay while rendering as the toolBox is taking time to get its height
			self.__setBodyStyle(false,false);
		};
		if(!delayPeriod)
		{
			delayPeriod = 0;
		}
		setTimeout(callback,delayPeriod);
	};
	
	NSEditor.prototype.__setBodyStyle = function(forciblyCalc,isDelay)
	{
		var self = this;
		var callback = function()
		{
			var setHeight = function(value)
			{
				var arrCon = [self.__divLineNumberContainer,self.__divTextAreaContainer,self.__compTextArea];//self.__getIFrameBody()
				for(var count = 0;count < arrCon.length;count++)
				{
					var con = arrCon[count];
					if(con)
					{
						self.util.css(con,"height",value);
					}
				}
			};
			forciblyCalc = Boolean.parse(forciblyCalc);
			var height = "auto";
			if(self.__config.height == "auto" && !forciblyCalc)
			{
				setHeight("auto");
			}
			else
			{
				var totalHeight = self.__divOuterContainer.offsetHeight;
				var nonEditorHeight = self.__getNonEditorHeight();
				height = totalHeight - nonEditorHeight;
				if(forciblyCalc)
				{
					setHeight("");
				}
			}
			self.__heightBody(height);
			self.__setBodyMinHeight();
		};
		if(isDelay)
		{
			setTimeout(callback,100);
		}
		else
		{
			callback();
		}
	};
	
	NSEditor.prototype.__setBodyMinHeight = function()
	{
		var nonEditorHeight = this.__getNonEditorHeight();
		var minHeight = this.__config.minHeight - nonEditorHeight;
		this.util.css(this.__divBodyContainer,"minHeight",minHeight);
		var arrCon = [this.__divLineNumberContainer,this.__divTextAreaContainer,this.__compTextArea,this.__getIFrameBody()];//
		for(var count = 0;count < arrCon.length;count++)
		{
			var con = arrCon[count];
			if(con)
			{
				this.util.css(con,"minHeight",minHeight - 2);
			}
		}
		this.__hasRendered = true;
	};
	
	NSEditor.prototype.__getNonEditorHeight = function()
	{
		var totalHeight = 0;
		if(this.__toolBar.__divToolBarContainer)
		{
			totalHeight += this.__toolBar.__divToolBarContainer.offsetHeight;
		}
		if(this.__divTabContainer)
		{
			totalHeight += this.__divTabContainer.offsetHeight;
		}
		if(this.__divFooterContainer)
		{
			totalHeight += this.__divFooterContainer.offsetHeight;
		}
		return totalHeight;
	};
	
	
	
	NSEditor.prototype.__createTabBar = function()
	{
		this.__divTabContainer = this.util.createDiv(this.getID() + "tabcontainer","nsEditorTabContainer");
		this.__divOuterContainer.appendChild(this.__divTabContainer);
		if(this.__config["enableTabBar"])
		{
			//this.__createToolBarComponents();
		}
		else
		{
			this.__handleVisibilityOfComponent(this.__divTabContainer,"enableTabBar");
		}
	};
	
	NSEditor.prototype.__createBody = function()
	{
		this.__divBodyContainer = this.util.createDiv(this.getID() + "bodycontainer","nsEditorBodyContainer");
		this.__divLineNumberContainer = this.util.createDiv(this.getID() + "linenumbercontainer","nsEditorLineNumberContainer");
		this.__divTextAreaContainer = this.util.createDiv(this.getID() + "textareacontainer","nsEditorTextAreaContainer");
		this.__divBodyContainer.appendChild(this.__divLineNumberContainer);
		this.__divBodyContainer.appendChild(this.__divTextAreaContainer);
		this.__divOuterContainer.appendChild(this.__divBodyContainer);
		this.__compTextArea = this.__createTextArea();
		this.__divTextAreaContainer.appendChild(this.__compTextArea);
	};
	
	NSEditor.prototype.__createTextArea = function()
	{
		var divTextArea = null;
		var content = "";
		if(this.__isModeTextArea())
		{
			//do not add class here as it will get overriden from if orignalTextArea has class
			divTextArea = this.util.createDiv(this.getID() + "textArea",null);
			if(!this.__config.enableReadOnly)
			{
				divTextArea.setAttribute("contenteditable",true);
				divTextArea.setAttribute("spellcheck",this.__config.enableSpellCheck);
			}
			if(this.__orignalTextArea)
			{
				if(this.__orignalTextArea.value.length > 0)
				{
					content = this.__orignalTextArea.value;
				}
				var arrAttributes = ["tabIndex"];
				var arrNewAttributes = ["tabIndex"];
				for(var count = 0;count < arrAttributes.length;count++)
				{
					if(this.__orignalTextArea.getAttribute(arrAttributes[count]))
					{
						divTextArea.setAttribute(arrNewAttributes[count],this.__orignalTextArea.getAttribute(arrAttributes[count]));
					}
				}
			}
			else if(this.__config.defaultValue && this.__config.defaultValue.length > 0)
			{
				divTextArea.appendChild(this.__dom.doc.createTextNode(this.__config.defaultValue));
			}
			this.util.addStyleClass(divTextArea,"nsEditorTextArea");
		}
		else
		{
			divTextArea = this.util.createElement("iframe",this.getID() + "textArea","nsEditorTextAreaIFrame");
			if(this.__context.location.protocol === "https:")
			{
				divTextArea.setAttribute("src","about:blank");
			}
			divTextArea.setAttribute("frameborder","0");
			divTextArea.setAttribute("allowtransparency","true");
			divTextArea.setAttribute("tabindex","-1");
			if(this.__orignalTextArea)
			{
				/*if(this.__orignalTextArea.getAttribute("tabindex"))
				{
					divTextArea.setAttribute("tabindex",this.__orignalTextArea.getAttribute("tabindex"));
				}*/
				if(this.__orignalTextArea.value.length > 0)
				{
					content = this.__orignalTextArea.value;
				}
			}
			var styleHtml = "html\r\n" + 
					"		{\r\n" + 
					"			margin:0px;\r\n" + 
					"			height:auto;\r\n" + 
					"		}\r\n" + 
					"		.nsEditorBody\r\n" + 
					"		{\r\n" + 
					"			height:auto;\r\n" + 
					"			background:transparent;\r\n" + 
					"			color:#000000;\r\n" + 
					"			position:relative;\r\n" + 
					"			z-index: 2;\r\n" +
					"			-webkit-user-select:auto;\r\n" + 
					"			margin:0px;\r\n" + 
					"			min-height:50px;\r\n" + 
					"			padding: 5px;\r\n" +
					"			overflow: auto;\r\n" +
					"		}\r\n" + 
					"		.nsEditorBody:after\r\n" + 
					"		{\r\n" + 
					"			content:\'\';\r\n" + 
					"			display:block;\r\n" + 
					"			clear:both;\r\n" + 
					"		}\r\n" + 
					"		.nsEditorBody::-moz-selection\r\n" + 
					"		{\r\n" + 
					"			background:#b5d6fd;\r\n" + 
					"			color:#000;\r\n" + 
					"		}\r\n" + 
					"		.nsEditorBody::selection\r\n" + 
					"		{\r\n" + 
					"			background:#b5d6fd;\r\n" + 
					"			color:#000;\r\n" + 
					"		}\r\n" + 
					"		.nsEditorBody.nsEditorBodyWithLineNumber\r\n" + 
					"		{\r\n" + 
					"			padding: 0px;\r\n" +
					"			padding-top: 5px;\r\n" + 
					"			padding-right: 5px;\r\n" + 			
					"		}\r\n" + 
					"		.nsEditorBody.nsEditorBodyWithLineNumber .nsEditorLineElement\r\n" + 
					"		{\r\n" + 
					"			margin:0;\r\n" + 
					"			font-size: 12px;\r\n" +
					"			line-height: 15px !important;\r\n" +
					"		}\r\n" + 
					"		.nsEditorPageBreak\r\n" + 
					"		{\r\n" + 
					"			clear: both !important;\r\n" + 
					"    		width: 100% !important;\r\n" + 
					"    		border-top: #999 1px dotted !important;\r\n" + 
					"    		border-bottom: #999 1px dotted !important;\r\n" + 
					"    		padding: 0 !important;\r\n" + 
					"    		height: 7px !important;\r\n" + 
					"    		cursor: default !important;\r\n" + 
					"		}";
			var arrStyle = this.__callAddStyleIFrameInPluggin(style);
			if(arrStyle && arrStyle.length > 0)
			{
				for(var count = 0;count < arrStyle.length;count++)
				{
					styleHtml += arrStyle[count].value;
				}
			}
			var arrStyle = this.__dom.doc.querySelectorAll("style");
			if(arrStyle && arrStyle.length > 0)
			{
				for(var count= 0;count < arrStyle.length; count++)
				{
					var style = arrStyle[count].cloneNode(true);
					styleHtml += "\n" + style.outerHTML;
				}
			}
			var arrLink = this.__dom.doc.querySelectorAll("link");
			if(arrLink && arrLink.length > 0)
			{
				for(var count= 0;count < arrLink.length; count++)
				{
					var link = this.__dom.doc.createElement("link");
					link.rel = arrLink[count].rel;
					link.href = arrLink[count].href;
					link.type = "text/css";
					link.media = "all";
					styleHtml += "\n" + link.outerHTML;
				}
			}
			var html = "<html><head><style>" + styleHtml + "</style></head><body class=\"nsEditorBody" + (this.__config["enableLineNumber"] ? " nsEditorBodyWithLineNumber" : "") + "\" contenteditable=\" " + !this.__config.enableReadOnly + "\" aria-disabled=\"false\" spellcheck=\"" + this.__config.enableSpellCheck +"\" dir=\"auto\">" + content + "</body></html>";
			this.__enableIFrameDesignMode(divTextArea,html);
		}
		if(!content && this.__config.defaultValue && this.__config.defaultValue.length > 0)
		{
			content = this.__config.defaultValue;
		}
		//for Mozilla showing cursor
		if(content)
		{
			content = this.__getWrappedContent(content);
		}
		else
		{
			content = this.__defaultContent;
		}
		this.__config.defaultValue = content;
		if(this.__orignalTextArea)
		{
			this.util.addStyleClass(this.__orignalTextArea,"nsEditorTextAreaHidden");
			if(!this.__config["placeholder"] && this.__orignalTextArea.getAttribute("placeholder"))
			{
				this.__config["placeholder"] = this.__orignalTextArea.getAttribute("placeholder");
			}
		}
		this.util.addStyleClass(divTextArea,"nsEditorTextAreaGeneric");
		
		return divTextArea;
	};
	
	NSEditor.prototype.__initTextArea = function()
	{
		var listenerComponent = this.__getListenerComponent();
		var clickListener = this.__isModeTextArea() ? this.__compTextArea : this.__frameContentDoc;
		var body = this.__isModeTextArea() ? this.__compTextArea : this.__getIFrameBody();
		var self = this;
		
		var genericListerener = function(event)
		{
			event = self.util.getEvent(event);
			if(event.type == "blur")
			{
				if(!self.getDisabled())
				{
					self.__selection.saveSelection();
				}
			}
			var element = event.target;
			var parentElement = element.parentNode;
			var item = {orignalEvent:event,element: element,parentElement: parentElement};
			self.__dispatchInternalEvent(event.type,item,item);
		};
		
		var eventListener = function(event){
			event = self.util.getEvent(event);
			//var target = self.util.getTarget(event);
			self.__selection.saveSelection();
			//self.__updateToolbar(target);
		};
		var pasteListener = function(event)
		{
			event = self.util.getEvent(event);
			switch(event.type)
			{
				case "beforepaste":
					self.__dispatchInternalEvent("beforepaste",{orignalEvent:event},{orignalEvent:event});
					break;
				case "paste":
					var content = self.__getPastedHTML(event);
					if(!content)
					{
						content = {};
					}
					content.orignalEvent = event;
					self.__dispatchInternalEvent("paste",content,content);
					break;
			}
		};
		
		if(this.__config.defaultValue)
		{
			body.innerHTML = this.__config.defaultValue;
		}
		var nonClickEvents = "keydown keyup keypress mousedown mouseup mousemove copy cut dragstart drop dragover touchstart touchend touchmove focus blur";
		var clickEvents = "selectionchange selectionstart dblclick click paste";
		this.util.addEvent(listenerComponent,nonClickEvents,genericListerener);
		this.util.addEvent(clickListener,clickEvents,genericListerener);
		//this.util.addEvent(listenerComponent,"keydown",this.__textAreaKeyDownHandler.bind(this));
		//this.util.addEvent(listenerComponent,"keyup mouseup mouseout focusout",eventListener);
		this.util.addEvent(clickListener,"beforepaste paste",pasteListener);
		this.util.addEvent(clickListener,"click",this.__textAreaClickHandler.bind(this));
		/*if(!this.__isModeTextArea())
		{
			this.__callTextAreaFunc();
		}*/
		this.__createLineNumberComponents();
		this.__callTextAreaFunc();
		this.__dispatchInternalEvent("textAreaInitialized");
		this.__textAreaObserver = new MutationObserver(this.__textAreaChangeHandler.bind(this));
		var observerConfig = {attributes:false,childList:true,characterData:true,subtree:true};
		this.__textAreaObserver.observe(body, observerConfig);
	};
	
	NSEditor.prototype.__enableIFrameDesignMode = function(iframe,html)
	{
		if(iframe && !this.__isFrameDesignModeEnabled)
		{
			this.__frameContentWindow = this.__getIFrameContentWindow(iframe);
			try 
			{
				this.__frameContentDoc = this.__frameContentWindow.document;
				this.__frameContentDoc.open();
				this.__frameContentDoc.write(html);
				this.__frameContentDoc.close();
            } 
			catch (error) 
			{
                //console.debug(error);
            }
            if (this.__dom.doc.contentEditable) 
			{
            	this.__frameContentDoc.designMode = "On";
            	this.__isFrameDesignModeEnabled = true;
            } 
			else if (this.__dom.doc.designMode !== null) 
			{
                try 
				{
                	this.__frameContentDoc.designMode = "on";
                	this.__isFrameDesignModeEnabled = true;
                } 
				catch (error) 
				{
                    //console.debug(error);
                }
            }
            if(this.__isFrameDesignModeEnabled)
            {
            	this.__setIframeStyle();
            	this.__initTextArea();
            	this.__dispatchInternalEvent("iframeInitialized");
            }
            var self = this;
            this.__timeOutInterval = setTimeout(function () 
		    {
            	self.__timeOutInterval = null;
            	self.__enableIFrameDesignMode.call(self,iframe,html);
		    }, 500);
		}
		else
		{
			clearTimeout(this.__timeOutInterval);
			this.__timeOutInterval = null;
		}
	};
	
	NSEditor.prototype.__setIframeStyle = function()
	{
		if(this.__config.height == "auto")
		{
			var doc = this.__getDocument();
			if(doc.documentElement)
			{
				doc.documentElement.style.overflowY = "hidden";
			}
			//this.util.addEvent(doc,"readystatechange DOMContentLoaded",this.__resizeIframe.bind(this));
			this.__listenInternalEvent("change", this.__resizeIframe.bind(this));
		}
	};
	
	NSEditor.prototype.__resizeIframe = function()
	{
		if(!this.__isModeTextArea() && this.__config.height == "auto")
		{
			var iframe = this.__compTextArea;
			var body = this.__getIFrameBody();
			if(iframe && body)
			{
				this.util.css(iframe,"height",body.offsetHeight);
			}
		}
	};
	
	NSEditor.prototype.__createLineNumberComponents = function()
	{
		var listenerComponent = this.__getListenerComponent();
		if(this.__config["enableLineNumber"])
		{
			this.util.addStyleClass(this.__divOuterContainer,"nsEditorWithLineNumber");
			//var textWidth = this.__width();
			//var baseMeasurement = this.__compTextArea.getBoundingClientRect();
			this.__divLineNumberWrapper = this.util.createDiv(this.getID() + "linenumberwrapper","nsEditorLineNumberWrapper");
			this.__divLineNumberContainer.appendChild(this.__divLineNumberWrapper);
			this.__queueFunc.splice(0, 0, this.__drawLineNumbers.bind(this,1));
			this.__paddingHorizontal = parseInt(this.util.getStyleValue(this.__divOuterContainer,"border-left-width",false)) +
									parseInt(this.util.getStyleValue(this.__divOuterContainer,"border-right-width",false)) + 
									parseInt(this.util.getStyleValue(this.__divOuterContainer,"padding-left",false)) + 
									parseInt(this.util.getStyleValue(this.__divOuterContainer,"padding-right",false));
			//this.__setWidth(textWidth - this.__paddingHorizontal);
			//this.__lastTextAreaHeight = this.__compTextArea.offsetHeight; 
			//this.__lastTextAreaWidth = this.__compTextArea.offsetWidth;
			if(!this.__textAreaScrollRef)
			{
				this.__textAreaScrollRef = this.__textAreaScrollHandler.bind(this);
				var element = this.__getScrollableComponent();
				this.util.addEvent(element,"scroll",this.__textAreaScrollRef);
			}
			if(!this.__textAreaResizeRef)
			{
				this.__textAreaResizeRef = this.__textAreaResizeHandler.bind(this);
				this.util.addEvent(listenerComponent,"resize",this.__textAreaResizeRef);
			}
		}
		else
		{
			if(this.__divLineNumberContainer && this.__divLineNumberContainer.parentElement)
			{
				this.__divLineNumberContainer.parentElement.removeChild(this.__divLineNumberContainer);
				this.__divLineNumberContainer = null;
			}
			this.util.removeStyleClass(this.__divOuterContainer,"nsEditorWithLineNumber");
		}
		if(this.__config["enableAutoSuggest"])
		{
			if(!this.__textAreaKeyUpRef)
			{
				this.__textAreaKeyUpRef = this.__textAreaKeyUpHandler.bind(this);
				this.util.addEvent(listenerComponent,"keyup",this.__textAreaKeyUpRef);
			}
			if(!this.__textAreaKeyDownRef)
			{
				this.__textAreaKeyDownRef = this.__textAreaKeyDownHandler.bind(this);
				this.util.addEvent(listenerComponent,"keydown",this.__textAreaKeyDownRef);
			}
		}
		//observer to watch if orignalTextArea has some style changed
		if(!this.__orignalTextAreaObserver && this.__orignalTextArea)
		{
			this.__orignalTextAreaObserver = new MutationObserver(this.__orignalTextAreaStyleChangeHandler.bind(this));
			this.__orignalTextAreaObserver.observe(this.__orignalTextArea, {attributes:true,attributeFilter:["style"]});
		}
		this.__setLineNumberVisibility(this.__config["enableLineNumber"]);
	};
	
	NSEditor.prototype.__createFooter = function()
	{
		this.__divFooterContainer = this.util.createDiv(this.getID() + "footercontainer","nsEditorFooterContainer");
		this.__divFooterLeftContainer = this.util.createDiv(this.getID() + "footerleftcontainer","nsEditorFooterLeftContainer");
		this.__divFooterContainer.appendChild(this.__divFooterLeftContainer);
		this.__divFooterRightContainer = this.util.createDiv(this.getID() + "footerrightcontainer","nsEditorFooterRightContainer");
		this.__divFooterContainer.appendChild(this.__divFooterRightContainer);
		this.__divOuterContainer.appendChild(this.__divFooterContainer);
	};
	
	NSEditor.prototype.__textAreaKeyDownHandler = function(event)
	{
		event = this.util.getEvent(event);
		if(!this.getDisabled())
		{
			if (event.keyCode === this.util.KEYCODE.BACKSPACE) 
			{ 
				if (this.__isTextAreaBlank()) 
				{ 
					event.stopPropagation(); // prevent remove single empty tag
					event.preventDefault();
				}
			}
			else
			{
				var keyCode = event.keyCode;
				var arrAccessKey = [];
				var strKey = "";
				for(var key in this.__accessibleKeys) 
				{
					if(this.__accessibleKeys[key].isPressed(event,keyCode))
					{
						arrAccessKey.push(this.__accessibleKeys[key]);
						strKey += "+" + this.__accessibleKeys[key].str;
					}
				}
				if(arrAccessKey.length)
				{
					if(strKey && strKey.length > 1)
					{
						strKey = strKey.substring(1);
					}
					strKey += "+" + String.fromCharCode(keyCode);
					var keyItem = this.__objShortKey[strKey.toLowerCase()];
					if(keyItem)
					{
						this.__toolBar.__toolBarButtonClickHandler(keyItem.item,keyItem.key,event);
						this.editorUtil.stopEvent(event);
					}
				}
			}
		}
	};
	
	NSEditor.prototype.__textAreaKeyUpHandler = function(event)
	{
		 /*if (decls.isVisible())
         {
             decls.setFilter(getFilterText());
         }*/
	};
	
	NSEditor.prototype.__textAreaClickHandler = function(event)
	{
		var target = this.util.getTarget(event);
		this.__toolBar.updateToolbar(target);
	};
	
	NSEditor.prototype.__textAreaScrollHandler = function(event)
	{
		if(!this.__timeOutInterval)
		{
			var lineNumberHeight = 15;
			var self = this;
			this.__timeOutInterval = setTimeout( function() 
			{
				var listenerComponent = self.__getScrollComponent();
				var scrollTop = listenerComponent.scrollTop;
				var firstLine = Math.floor((scrollTop / lineNumberHeight) + 1);
				var remainingScroll = (scrollTop / lineNumberHeight) % 1;

				self.__drawLineNumbers(firstLine);
				self.__divLineNumberWrapper.style.marginTop = (-1 * (remainingScroll * lineNumberHeight)) + "px";
				self.__timeOutInterval = null;
			}, 150);
		}
	};
	
	NSEditor.prototype.__textAreaResizeHandler = function(event)
	{
		
	};
	
	NSEditor.prototype.__orignalTextAreaStyleChangeHandler = function(arrMutation)
	{
		for(var count = 0;count < arrMutation.length;count++)
		{
			var mutation = arrMutation[count];
			if (mutation.type == "attributes") 
	        {
	        	
	        }
			
		}
	};
	
	NSEditor.prototype.__textAreaChangeHandler= function(arrMutation)
	{
		if(!this.__isInternalHTMLChange)
		{
			//this.__setDefaultTag();
			this.__dispatchInternalEvent("change");
			//this.__resizeIframe();
		}
		for(var count = 0;count < arrMutation.length;count++)
		{
			var mutation = arrMutation[count];
			//if child is added
			if (mutation.type === 'childList') 
			{
				//if height is auto
				if(this.__config.height == "auto" && this.__divLineNumberContainer)
				{
					this.__drawLineNumbers(1);
				}
	        }
		}
	};
	
	NSEditor.prototype.__drawLineNumbers = function(fromLine)
	{
		if(this.__divLineNumberWrapper)
		{
			this.util.removeAllChildren(this.__divLineNumberWrapper);
			this.arrLinesElement = [];
			var comp = this.__getScrollComponent();
			var measurement = comp.getBoundingClientRect();
			var containerHeight = measurement.height;
			while((this.__divLineNumberWrapper.offsetHeight - containerHeight) <= 0)
			{
				var divLineNumber = this.util.createDiv(this.getID() + "linenumber","nsEditorLineNumber");
				divLineNumber.appendChild(this.__dom.doc.createTextNode(fromLine));
				this.__divLineNumberWrapper.appendChild(divLineNumber);
				this.arrLinesElement.push(divLineNumber);
				fromLine++;
			}
		}
		return fromLine;
	};
	
	NSEditor.prototype.__setLineNumberVisibility = function(isVisible) 
	{
		if(this.__setting["enableLineNumber"])
		{
			this.__config["enableLineNumber"] = isVisible;
			this.__handleVisibilityOfComponent(this.__divLineNumberContainer,"enableLineNumber");
			this.__dispatchInternalEvent("lineNumberVisibilityChanged",{isVisible: isVisible},{isVisible: isVisible});
		}
	};
	
	NSEditor.prototype.__handleVisibilityOfComponent = function(component,property) 
	{
		this.__setting[property] ? this.util.removeStyleClass(component,"nsEditorComponentHidden") : this.util.addStyleClass(component,"nsEditorComponentHidden");
	};
	
	NSEditor.prototype.__handleKeySpecialKeys = function(event) 
	{
		// escape, left, right
        if (event.keyCode === 27 || event.keyCode === 37 || event.keyCode === 39)
        {
            setVisible(false);
        }
        // up
        else if (event.keyCode === 38)
        {
            moveSelected(-1);
            event.preventDefault();
            event.stopPropagation();
        }
        // down
        else if (event.keyCode === 40)
        {
            moveSelected(1);
            event.preventDefault();
            event.stopPropagation();
        }
        // page up 
        else if (event.keyCode === 33)
        {
            moveSelected(-5);
            event.preventDefault();
        }
        // page down
        else if (event.keyCode === 34)
        {
            moveSelected(5);
            event.preventDefault();
        }
	};
	
	NSEditor.prototype.__getTextFromTextArea = function() 
	{
		var text = null;
		if(this.__isModeTextArea())
		{
			text  = this.__compTextArea.textContent || this.__compTextArea.innerText;
		}
		else
		{
			text = this.__getIFrameText();
		}
		return text;
	};
	
	NSEditor.prototype.__getHtmlFromTextArea = function() 
	{
		var text = null;
		if(this.__isModeTextArea())
		{
			text  = this.__compTextArea.innerHTML;
		}
		else
		{
			text = this.__getIFrameContent();
		}
		if(text)
		{
			text = text.replace(/^(<p[^>]*>(&nbsp;|&#160;|\s|\u00a0|<br \/>|)<\/p>[\r\n]*|<br \/>[\r\n]*)$/, "");
		}
		return text;
	};
	
	NSEditor.prototype.__setTextIntoTextArea = function(text) 
	{
		if(this.__isModeTextArea())
		{
			this.__compTextArea.innerText = text;
		}
		else
		{
			this.__setIFrameText(text);
		}
		//this.__dispatchInternalEvent("change");
	};
	
	NSEditor.prototype.__setHtmlIntoTextArea = function(html) 
	{
		if(this.__isModeTextArea())
		{
			this.__compTextArea.innerHTML = html;
		}
		else
		{
			this.__setIFrameContent(html);
		}
		//this.__dispatchInternalEvent("change");
	};
	
	//functions related to IFrame
	NSEditor.prototype.__getIFrameText = function() 
	{
		var iframeBody = this.__getIFrameBody();
	    return (iframeBody ? (iframeBody.textContent || iframeBody.innerText) : null);
	};
	
	NSEditor.prototype.__getIFrameContent = function() 
	{
		var iframeBody = this.__getIFrameBody();
	    return (iframeBody ? iframeBody.innerHTML : null);
	};
	
	NSEditor.prototype.__setIFrameText = function(text) 
	{
		var iframeBody = this.__getIFrameBody();
	    iframeBody ? iframeBody.innerText = text : null;
	};
	
	NSEditor.prototype.__setIFrameContent = function(html) 
	{
		var iframeBody = this.__getIFrameBody();
	    iframeBody ? iframeBody.innerHTML = html : null;
	};
	
	NSEditor.prototype.__getIFrameContentWindow = function(iframe) 
	{
		if(this.__isModeTextArea())
		{
			return null;
		}
		var contentWindow = null;
		if (iframe.contentWindow)
		{
			contentWindow = iframe.contentWindow;
		}
		else if(iframe.contentDocument)
		{
			if(iframe.contentDocument.defaultView)
			{
				contentWindow = iframe.contentDocument.defaultView;
			}
			else if (iframe.contentDocument.document)
	        {
	        	contentWindow = iframe.contentDocument.document;
	        }
	        else
	        {
	        	contentWindow = iframe.contentDocument;
	        }
		}
		return contentWindow;
	};
	
	NSEditor.prototype.__getIFrameBody = function() 
	{
		if(this.__isModeTextArea())
		{
			return null;
		}
		//if(!this.__frameBody)
		//{
			this.__frameBody = this.__getIFrameDocument().getElementsByTagName("body")[0];
		//}
	    return this.__frameBody;
	};
	
	NSEditor.prototype.__getIFrameDocument = function()  
	{
	    return this.__isModeTextArea() ? null : (this.__compTextArea.contentDocument || this.__compTextArea.contentWindow.document);
	};
	
	NSEditor.prototype.__disableStyleWithCSS = function() 
	{
		if (this.__browserDetail.isFirefox) 
		{
			//disable style while inserting in firefox design Mode
			try 
			{
				this.__frameContentDoc.execCommand("styleWithCSS", false, false);
			} 
			catch (error) 
			{
				try 
				{
					this.__frameContentDoc.execCommand("useCSS", false, true);
				} 
				catch (error2) 
				{
				}
			}
		}
	};
	//end of functions related to IFrame
	NSEditor.prototype.__executeCommand = function(commandName,config,key) 
	{
		if(!config)
		{
			config = {};
		}
		var command = config.command || commandName;
		var args = config["arguments"];
		if(config.execCommand)
		{
			config.execCommand.apply(this);
		}
		else 
		{
			var doc = this.__dom.doc;
			if(!this.__isModeTextArea())
			{
				doc = this.__frameContentDoc;
				this.__disableStyleWithCSS();
			}
			// in Firefox untrusted JavaScript is not allowed to access the clipboard
			try 
			{
				this.__dispatchInternalEvent("beforeExecCommand",config,config);
				if(config.beforeCommand)
				{
					config.beforeCommand(config,key);
				}
				this.__selection.restoreSelection();
				this.__selection.setFocus();
				this.__execCommand.execute(command, false, args);
				//doc.execCommand(command, false, args);
				this.__selection.saveSelection();
				if(config.afterCommand)
				{
					config.afterCommand(config,key);
				}
				this.__dispatchInternalEvent("afterExecCommand",config,config);
			} 
			catch (error) 
			{
				console.error(error);
			}
		}
		//this.__dispatchInternalEvent("change");
	};
	
	NSEditor.prototype.__orderedListHandler = function(item,key,event)
	{
		/*var element = this.__selection.getElementUnderCursor();
		var textArea = this.__getTextArea();
		var parent = this.util.findParentByCallback(element, function(node) 
		{ 
			return node && /^UL|OL$/i.test(node.nodeName);
		}, textArea);
        if (parent && this.util.isElementOfType(parent.parentNode,"p")) 
        {
            var selection = this.__selection.saveSelection();
            this.util.insertElementParentsParent(parent.parentNode);
            for(var count = 0;count < parent.childNodes.length;count++)
            {
            	var li = parent.childNodes[count];
            	if (this.util.isElementOfType(li.lastChild,"br")) 
            	{
            		this.editorUtil.removeNode(li.lastChild);
                }
            }
            this.__selection.restoreSelection(selection);
        }*/
        //editor.setEditorValue();
	};
	
	NSEditor.prototype.__viewSourceCodeHandler = function(item,key,event)
	{
		if(!this.__txtSourceCode)
		{
			this.__txtSourceCode = this.util.createElement("textarea",this.getID() + "sourcetextArea","nsEditorSourceTextArea");
			//this.__txtSourceCode.setAttribute("disabled",true);
			this.__divTextAreaContainer.appendChild(this.__txtSourceCode);
		}
		//view source is shown then show editor
		if (this.__isSourceMode)
		{
			this.util.addStyleClass(this.__txtSourceCode,"nsEditorTextAreaHidden");
			this.util.removeStyleClass(this.__compTextArea,"nsEditorTextAreaHidden");
			this.setHtml(this.__txtSourceCode.value);
			//processItems(false);
		}
		//view source is not shown then show viewsource text area
		else
		{
			var html = this.__getHtmlFromTextArea();
			this.util.removeStyleClass(this.__txtSourceCode,"nsEditorTextAreaHidden");
			this.util.addStyleClass(this.__compTextArea,"nsEditorTextAreaHidden");
			this.__txtSourceCode.value = html;
			//processItems(true);
		}
		this.__isSourceMode = !this.__isSourceMode;
		this.__placeHolderToggleRef();
		this.__dispatchInternalEvent("viewSourceChanged",{isSourceMode: this.__isSourceMode,item: item,key: key}, {isSourceMode: this.__isSourceMode,item: item,key: key});
	};
	
	NSEditor.prototype.__emptyDocHandler = function(item,key,event)
	{
		var body = this.__getTextArea();
		body.innerHTML = this.__config.defaultValue;
	};
	
	NSEditor.prototype.__printHandler = function(item,key,event)
	{
		if(this.__isModeTextArea())
		{
			if(!this.__iframePrint)
			{
				this.__iframePrint = this.util.createElement("iframe",this.getID() + "EditorPrintFrame","nsEditorPrint");
				this.__iframePrint.name = this.getID() + "EditorPrintFrame";
				this.__dom.doc.body.appendChild(this.__iframePrint);
			}
			var content =  this.__getHtmlFromTextArea();
			var html = "<!DOCTYPE html><html><head><title>" + this.__dom.doc.title + "</title>";
			var arrStyle = this.__dom.doc.querySelectorAll("style");
			if(arrStyle && arrStyle.length > 0)
			{
				for(var count= 0;count < arrStyle.length; count++)
				{
					var style = arrStyle[count].cloneNode(true);
					html += "\n" + style.outerHTML;
				}
			}
			var arrLink = this.__dom.doc.querySelectorAll("link");
			if(arrLink && arrLink.length > 0)
			{
				for(var count= 0;count < arrLink.length; count++)
				{
					var link = this.__dom.doc.createElement("link");
					link.rel = arrLink[count].rel;
					link.href = arrLink[count].href;
					link.type = "text/css";
					link.media = "all";
					html += "\n" + link.outerHTML;
				}
			}
			html +="</head><body class=\"nsEditorBody\" dir=\"auto\"><div>" + content + "</div></body></html>";
			var self = this;
			this.__iframePrint.onload = function() 
			{
                setTimeout(function() 
                {
                	var frame = self.__context.frames[self.getID() + "EditorPrintFrame"];
                	frame.focus();
                	frame.print();
                	self.__context.focus();
                }, 0);
            };
            var contentWindow = this.__iframePrint.contentWindow;
            contentWindow.document.open();
            contentWindow.document.write(html);
            contentWindow.document.close();
		}
		else
		{
			this.__executeCommand("print",item,"print");
		}
	};
	
	NSEditor.prototype.__previewHandler = function(item,key,event)
	{
		var content =  this.__getHtmlFromTextArea();
		content = "<div class='" + this.__getTextArea().getAttribute("class") + "'>" + content + "</div>";
		var objWindow = this.__context.open("","_blank");
		if(!objWindow)
		{
			throw this.util.throwNSError("NSEditor","Preview window was not opened.Please deactivate PopUp Blocker for this application");
		}
		objWindow.mimeType = "text/html";
		var width = this.__getTextArea().offsetWidth + "px !important";
		var bodyCssClass =  this.__divOuterContainer.getAttribute("class") + " nsEditorBody";
		if(this.__isModeTextArea())
		{
			var html = "";
            var arrStyle = this.__dom.doc.querySelectorAll("style");
            if(arrStyle && arrStyle.length > 0)
			{
				for(var count= 0;count < arrStyle.length; count++)
				{
					var style = arrStyle[count].cloneNode(true);
					html += "\n" + style.outerHTML;
				}
			}
			var arrLink = this.__dom.doc.querySelectorAll("link");
			if(arrLink && arrLink.length > 0)
			{
				for(var count= 0;count < arrLink.length; count++)
				{
					var link = this.__dom.doc.createElement("link");
					link.rel = arrLink[count].rel;
					link.href = arrLink[count].href;
					link.type = "text/css";
					link.media = "all";
					html += "\n" + link.outerHTML;
				}
			}
            objWindow.document.write('' +
                '<!DOCTYPE html><html>' +
                '<head>' +
                '<meta charset="utf-8" />' +
                '<meta name="viewport" content="width=device-width, initial-scale=1">' +
                '<title>' + "Preview" + '</title>' +
                html +
                '</head>' +
                '<body class="' + bodyCssClass + '" style="width:' + width + '; border:1px solid #ccc; margin:10px auto !important; height:auto !important;">' + content + '</body>' +
                '</html>'
            );
            
		}
		else
		{
			objWindow.document.write('' +
                '<!DOCTYPE html><html>' +
                '<head>' +
                this.__getDocument().head.innerHTML +
                '<style>body {overflow:auto !important; width:' + width + '; border:1px solid #ccc; margin: 10px auto !important; height:auto !important;}</style>' +
                '</head>' +
                '<body ' + bodyCssClass + '>' + content + '</body>' +
                '</html>'
            );
		}
	};
	
	NSEditor.prototype.__pageBreakForPrintingHandler = function(item,key,event)
	{
		var divPageBreak = "<div class=\"nsEditorPageBreak\" style=\"page-break-after: always\" title=\"Page Break\"></div>";
		this.__selection.insertHTML(divPageBreak);
	};
	
	NSEditor.prototype.__getScrollComponent = function() 
	{
		var component = this.__isModeTextArea() ? this.__divTextAreaContainer : this.__getIFrameBody();
		return component;
	};
	
	NSEditor.prototype.__getScrollableComponent = function() 
	{
		var element = this.__isModeTextArea() ? this.__divTextAreaContainer : this.__frameContentWindow;
		return element;
	};
	
	NSEditor.prototype.__getTextArea = function() 
	{
		var component = this.__isModeTextArea() ? this.__compTextArea : this.__getIFrameBody();
		return component;
	};
	
	NSEditor.prototype.__getDocument = function() 
	{
		var component = this.__isModeTextArea() ? this.__dom.doc : this.__getIFrameDocument();
		return component;
	};
	
	NSEditor.prototype.__getWindow = function() 
	{
		var component = this.__isModeTextArea() ? this.__context : this.__frameContentWindow;
		return component;
	};
	
	NSEditor.prototype.__getListenerComponent = function() 
	{
		var listenerComponent = this.__isModeTextArea() ? this.__compTextArea : this.__frameContentWindow;
		return listenerComponent;
	};

	NSEditor.prototype.__isModeTextArea = function() 
	{
		return (this.__config["mode"] !== NSEditor.MODE_IFRAME);
	};
	
	NSEditor.prototype.__resizeContainer = function(width,height) 
	{
		this.__setHeight(height);
		this.__setWidth(width);
		this.__handleLineNumberOnResize();
	};
	
	NSEditor.prototype.__dispatchEvent = function(eventType,data,param,bubbles,cancelable)
	{
		this.util.dispatchEvent(this.__baseComponent,eventType,data,param,bubbles,cancelable);
	};
	
	NSEditor.prototype.__dispatchInternalEvent = function(eventType,data,param,bubbles,cancelable)
	{
		this.util.dispatchEvent(this.__baseComponent,this.__getInternalEvent(eventType),data,param,bubbles,cancelable);
	};
	
	NSEditor.prototype.__listenInternalEvent = function(eventType,callback)
	{
		this.util.addEvent(this.__baseComponent,this.__getInternalEvent(eventType),callback);
	};
	
	NSEditor.prototype.__removeInternalEvent = function(eventType,callback)
	{
		this.util.removeEvent(this.__baseComponent,this.__getInternalEvent(eventType),callback);
	};
	
	NSEditor.prototype.__addEvent = function(eventType,listener)
	{
		this.util.addEvent(this.__baseComponent,eventType,listener);
	};
	
	NSEditor.prototype.__getInternalEvent = function(eventType)
	{
		var retType = "";
		var joinBy = " ";
		var arrEventType = eventType.split(" ");
		for(var count = 0;count < arrEventType.length;count++)
		{
			retType += joinBy + "__" + arrEventType[count];
		}
		if(retType)
		{
			retType = retType.substring(joinBy.length);
		}
		return retType;
	};
	
	NSEditor.prototype.__height = function(height)
	{
		if(!this.util.isUndefinedOrNull(height))
		{
			this.util.css(this.__divOuterContainer,"height",height);
		}
		var baseMeasurement = this.__divOuterContainer.getBoundingClientRect();
		return baseMeasurement.height;
	};
	
	NSEditor.prototype.__width = function(width)
	{
		if(!this.util.isUndefinedOrNull(width))
		{
			this.util.css(this.__divOuterContainer,"width",width);
		}
		var baseMeasurement = this.__divOuterContainer.getBoundingClientRect();
		return baseMeasurement.width;
	};
	
	NSEditor.prototype.__heightBody = function(height)
	{
		if(!this.util.isUndefinedOrNull(height))
		{
			this.util.css(this.__divBodyContainer,"height",height);
		}
		var baseMeasurement = this.__divBodyContainer.getBoundingClientRect();
		return baseMeasurement.height;
	};
	
	NSEditor.prototype.__handleLineNumberOnResize = function()
	{
		if(this.__divLineNumberWrapper)
		{
			var lineNumberHeight = 15;
			var listenerComponent = this.__getScrollComponent();
			
			var scrollTop = listenerComponent.scrollTop;
			var firstLine = Math.floor((scrollTop / lineNumberHeight) + 1);
			var remainingScroll = (scrollTop / lineNumberHeight) % 1;

			this.__drawLineNumbers(firstLine);
			this.__divLineNumberWrapper.style.marginTop = (-1 * (remainingScroll * lineNumberHeight)) + "px";
			this.__paddingHorizontal = parseInt(this.util.getStyleValue(this.__divOuterContainer,"border-left-width",false)) +
									parseInt(this.util.getStyleValue(this.__divOuterContainer,"border-right-width",false)) + 
									parseInt(this.util.getStyleValue(this.__divOuterContainer,"padding-left",false)) + 
									parseInt(this.util.getStyleValue(this.__divOuterContainer,"padding-right",false));
		}
	};
	
	NSEditor.prototype.__getWrappedContent = function(content) 
	{
		if(content)
		{
			var isPFound = content.match(/<\/?p>/gi);
			if (!isPFound) 
			{
				return "<p>" + content + "</p>";
			}
		}
		return content;
	};
	
	NSEditor.prototype.__setDefaultTag = function()
	{
		var text = this.__getTextFromTextArea();
		var htmlText = this.__getHtmlFromTextArea();
		if(text && text.trim().length === 0 && htmlText != this.__defaultContent)
		{
			this.__isInternalHTMLChange = true;
			var body = this.__getTextArea();
			body.innerHTML = this.__defaultContent;
			this.__isInternalHTMLChange = false;
		}
	};
	
	NSEditor.prototype.__getPastedHTML = function(event)
	{
		var objReturn = {text:"",html:"",rtf:""};
		if (this.__context.clipboardData && this.__context.clipboardData.getData) 
        { 
			
        }
		else if (event.clipboardData && event.clipboardData.getData) 
        {
			objReturn.text = event.clipboardData.getData("text/plain");
			objReturn.html = event.clipboardData.getData("text/html");
			objReturn.rtf = event.clipboardData.getData("text/rtf");
        }
		return objReturn;
	};
	
	//Placeholder functions
	NSEditor.prototype.__createPlaceHolder = function() 
	{
		if(this.__config["placeholder"])
		{
			if(!this.__compPlaceHolder)
			{
				this.__compPlaceHolder = this.util.createElement("span",this.getID() + "Placeholder","nsEditorPlaceholder");
				this.__compPlaceHolder.appendChild(this.__dom.doc.createTextNode(this.__config["placeholder"]));
			}
			if(!this.editorUtil.isEditable())
			{
				this.__removePlaceHolder();
			}
			if(!this.__placeHolderToggleRef)
			{
				this.__placeHolderToggleRef = this.util.debounce(this.__togglePlaceHolder.bind(this),10);
				this.__placeHolderToggleRef();
				this.__addListenerToPlaceHolder();
			}
		}
	};
	
	NSEditor.prototype.__addListenerToPlaceHolder = function() 
	{
		this.__listenInternalEvent("textAreaInitialized change focus keyup mouseup keydown mousedown changePlace",this.__placeHolderToggleRef);
	};
	
	NSEditor.prototype.__setPlaceHolderPosition = function() 
	{
		if(this.__isPlaceHolderVisible())
		{
			var doc = this.__getDocument();
			var win = this.__getWindow();
			if(doc && win)
			{
				var getPropValue = function(value)
				{
					if(value == "")
					{
						return 0;
					}
					return parseInt(value, 10);
				};
				var textArea = this.__getTextArea();
				var marginTop = 0;
				var marginLeft = 0;
				var paddingTop = 0;
				var paddingLeft = 0;
				var firstChild = textArea.firstChild;
				var textAreaStyle = win.getComputedStyle(textArea);
				var css = {};
				if(firstChild && this.util.isElement(firstChild))
				{
					 var childStyle = win.getComputedStyle(firstChild);
			         marginTop = getPropValue(childStyle.getPropertyValue("margin-top"));
			         marginLeft = getPropValue(childStyle.getPropertyValue("margin-left"));
			         paddingTop = getPropValue(childStyle.getPropertyValue("padding-top"));
			         paddingLeft = getPropValue(childStyle.getPropertyValue("padding-left"));
			         css = {fontSize: getPropValue(childStyle.getPropertyValue("font-size")),lineHeight: getPropValue(childStyle.getPropertyValue("line-height"))};
				}
				else
				{
					 css = {fontSize: getPropValue(textAreaStyle.getPropertyValue("font-size")),lineHeight: getPropValue(textAreaStyle.getPropertyValue("line-height"))};
				}
				css.display = "block";
				css.marginTop = Math.max(getPropValue(textAreaStyle.getPropertyValue("margin-top")), marginTop);
				css.marginLeft = Math.max(getPropValue(textAreaStyle.getPropertyValue("margin-left")), marginLeft);
				css.paddingTop = Math.max(getPropValue(textAreaStyle.getPropertyValue("padding-top")), paddingTop);
				css.paddingLeft = Math.max(getPropValue(textAreaStyle.getPropertyValue("padding-left")), paddingLeft);
				this.util.css(this.__compPlaceHolder,css);
			}
		}
	};
	
	NSEditor.prototype.__togglePlaceHolder = function() 
	{
		if(this.__compPlaceHolder)
		{
			var visible = true;
			if(this.__txtSourceCode)
			{
				visible = false;
			}
			else
			{
				visible = this.__isTextAreaBlank();
			}
			visible ? this.__addPlaceHolder() : this.__removePlaceHolder();
		}
	};
	
	NSEditor.prototype.__addPlaceHolder = function() 
	{
		if(!this.__isPlaceHolderVisible())
		{
			this.__divTextAreaContainer.appendChild(this.__compPlaceHolder);
		}
		this.__setPlaceHolderPosition();
	};
	
	NSEditor.prototype.__removePlaceHolder = function() 
	{
		if(this.__isPlaceHolderVisible())
		{
			this.__compPlaceHolder.parentNode.removeChild(this.__compPlaceHolder);
		}
	};
	
	NSEditor.prototype.__isPlaceHolderVisible = function() 
	{
		return (this.__compPlaceHolder && this.__compPlaceHolder.parentNode);
	};
	
	//end of Placeholder functions
	//FixedDiv functions (for Modal,ContextMenu etc)
	NSEditor.prototype.__createFixedComp = function() 
	{
		if(!this.__compFixed)
		{
			this.__compFixed = this.util.createDiv(this.getID() + "_FixedComp","nsEditorFixedComp");
			this.__dom.doc.body.appendChild(this.__compFixed);
		}
	};
	
	NSEditor.prototype.__getFixedComp = function() 
	{
		if(!this.__compFixed)
		{
			this.__createFixedComp();
		}
		return this.__compFixed;
	};
	
	NSEditor.prototype.__isTextAreaBlank = function() 
	{
		/*var textArea = this.__getTextArea();
		if(textArea.children.length === 0)
		{
			return true;
		}
		var getText = function(paramText)
		{
			var regex = /[\uFEFF]/g;
			paramText = paramText.replace(regex,"");
			paramText = paramText.replace(/(\r\n|\n|\r)/gm,"");
			return paramText;
		};
		if(textArea.children.length === 1)
		{
			var firstChild = textArea.firstChild;
			if(this.editorUtil.REGEX_EMPTY_TAGS.test(firstChild.nodeName))
			{
				return false;
			}
			var text = this.__getTextFromTextArea();
			if(getText(text).length == 0)
			{
				return true;
			}
		}
		var self = this;
		var isEmpty = function(paramNode)
		{
			if(!paramNode) 
			{
	            return true;
	        }
			if(self.util.isTextNode(paramNode))
			{
				return paramNode.nodeValue === null || paramNode.nodeValue.trim().length === 0;
			}
			var regexNonEmptyTags = /^(img|svg|canvas|input|textarea|form)$/;
			if(regexNonEmptyTags.test(paramNode.nodeName.toLowerCase()))
			{
				return false;
			}
			if(self.util.isElement(paramNode))
			{
				var text = paramNode.textContent || paramNode.innerText;
				if(getText(text).length == 0)
				{
					return true;
				}
			}
			if(!self.util.isElement(paramNode))
			{
				return true;
			}
			return false;
		};
		var arrElements = textArea.querySelectorAll("*");
		for(var count = 0;count < arrElements.length;count++)
		{
			var ele = arrElements[count];
			if(!isEmpty(ele) && !(ele.tagName.toLowerCase() == "br"))
			{
				return false;
			}
		}
		return true;*/
		var textArea = this.__getTextArea();
		if (textArea.firstChild) 
		{
			var self = this;
			var firstChild = textArea.firstChild;
		    if(this.editorUtil.REGEX_EMPTY_TAGS.test(firstChild.nodeName))
		    {
		    	return false;
		    }
		    var nextNode = this.util.findNextNode(firstChild,function(node) 
		    { 
		    	return node && !self.editorUtil.isEmptyTextNode(node); 
		    }, textArea);
		    if (this.util.isTextNode(firstChild) && !nextNode) 
		    {
		    	return self.editorUtil.isEmptyTextNode(firstChild);
		    }
		    if (!nextNode) 
		    {
		    	var value = this.util.loopAllChildren(firstChild,function(paramElement) 
		    	{ 
		    		return self.editorUtil.isEmptyNode(paramElement) || self.util.isElementOfType(paramElement,"br"); 
		    	});
		    	if(value)
		    	{
		    		return true;
		    	}
		    }
		    return false;
	    }
	    return true;   
	};
	
	NSEditor.prototype.__getStyleValue = function(styleValue) 
	{
        return parseInt(styleValue, 10) || 0;
    };
    
    NSEditor.prototype.__initializeModules = function() 
	{
    	this.editorUtil = new NSEditorUtil(this);
		this.__selection = new NSSelection(this);
		this.__toolBar = new NSToolBar(this);
		this.__execCommand = new NSExecCommand(this);
		this.__stack = new NSStack(this);
	};
    
    //section of functions for util
    NSEditor.prototype.__getUtilClass = function(utilClassName) 
	{
		if(NSEditor.__util)
		{
			for(var utilName in NSEditor.__util)
			{
				if(utilName == utilClassName)
				{
					return NSEditor.__util[utilName];
				}
			}
		}
		this.util.throwNSError("NSEditor",utilClassName + " util has not been loaded.");
	};
	
	NSEditor.prototype.__getUtilInstance = function(utilClassName,utilInstanceID,plugginName,objPluggin,utilSetting) 
	{
		var utilClass = this.__getUtilClass(utilClassName);
		if(utilClass)
		{
			!this.__utilInstance[utilClassName] && (this.__utilInstance[utilClassName] = {});
			!this.__utilInstance[utilClassName][utilInstanceID] && (this.__utilInstance[utilClassName][utilInstanceID] = {});
			var objUtilPluggin = this.__utilInstance[utilClassName][utilInstanceID][plugginName];
			if(objUtilPluggin && objUtilPluggin.instance)
			{
				return objUtilPluggin.instance;
			}
			var objUtil = new utilClass(this,objPluggin,utilSetting);
			objUtil.id = utilInstanceID;
			objUtil.selection = this.__selection;
			objUtil.util = this.util;
			objUtil.editorUtil = this.editorUtil;
			var item = {instance: objUtil,instanceID: utilInstanceID,plugginInstance: objPluggin,utilSetting: utilSetting};
			this.__utilInstance[utilClassName][utilInstanceID][plugginName] = item;
			return objUtil;
		}
	};
	//end of section of functions for util
    
	//section of functions for pluggin
	NSEditor.prototype.__initializePlugins = function() 
	{
		this.__pluginsInstances = {};
		if(NSEditor.__plugins)
		{
			for(var plugginName in NSEditor.__plugins)
			{
				var objPlugin = new NSEditor.__plugins[plugginName](this);
				objPlugin.nsEditor = this;
				objPlugin.selection = this.__selection;
				objPlugin.util = this.util;
				objPlugin.editorUtil = this.editorUtil;
				this.__pluginsInstances[plugginName] = {prototype: NSEditor.__plugins[plugginName],instance: objPlugin};
			}
		}
	};
	
	NSEditor.prototype.__callSetSettingsInPluggin = function() 
	{
		this.__callFunctionInPlugins("setSettings");
		this.__dispatchInternalEvent("setSettings");
	};
	
	NSEditor.prototype.__callInitializeInPluggin = function() 
	{
		this.__callFunctionInPlugins("initialize");
		this.__dispatchInternalEvent("initialize");
	};
	
	NSEditor.prototype.__callComponentsInitializedInPluggin = function() 
	{
		this.__callFunctionInPlugins("componentsInitialized");
		this.__dispatchInternalEvent("componentsInitialized");
	};
	
	NSEditor.prototype.__callDestroyInPluggin = function() 
	{
		this.__callFunctionInPlugins("destroy");
		this.__dispatchInternalEvent("destroy");
	};
	
	NSEditor.prototype.__callResizedInPluggin = function() 
	{
		this.__callFunctionInPlugins("resized");
		this.__dispatchInternalEvent("resized");
	};
	
	NSEditor.prototype.__callAddStyleIFrameInPluggin = function() 
	{
		return this.__callFunctionInPlugins("addStyleInIFrame");
		this.__dispatchInternalEvent("addStyleInIFrame");
	};
	
	NSEditor.prototype.__callFunctionInPlugins = function(functionName,arrParams) 
	{
		var arrRetValue = [];
		if(this.__pluginsInstances)
		{
			for(var plugginName in this.__pluginsInstances)
			{
				var objPlugin = this.__pluginsInstances[plugginName].instance;
				if(objPlugin && objPlugin[functionName])
				{
					var retValue = objPlugin[functionName].apply(objPlugin,arrParams);
					if(!this.util.isUndefined(retValue))
					{
						arrRetValue.push({name: plugginName,value: retValue});
					}
				}
			}
		}
		return arrRetValue;
	};
	
	NSEditor.prototype.__callPromptBox = function(titleHtml,message,okText,cancelText,okHandler,cancelHandler) 
	{
		if(this.__config["promptBoxCallback"])
		{
			this.__config["promptBoxCallback"](titleHtml,message,okText,cancelText,okHandler,cancelHandler);
		}
		else
		{
			var closeConfirmBox = function(event)
			{
				this.__dom.doc.body.removeChild(divContainer);
			};
			var divContainer = this.util.createDiv("nsEditorConfirmContainer","nsEditorPromptOvelay");
			var content = "<div class='nsEditorPrompt'>" +
	    						"<header>" +
	    							"<h3> " + titleHtml + " </h3> " +
	    							"<i id='nsEditorIconClose' class='fa fa-close'></i>" +
	    						"</header>" +
	        					"<div class='nsEditorPromptBody'>" +
	        						" <p> " + message + " </p> " +
	        					"</div>" +
	        					"<footer>" +
							         "<div class='controls'>" +
							             " <button id='btnEditorConfirmOk' class='nsEditorPromptButton nsEditorPromptButtonDanger'>" + okText + "</button> " +
							             " <button id='btnEditorConfirmCancel' class='nsEditorPromptButton nsEditorPromptButtonDefault'>" + cancelText + "</button> " +
							         "</div>" +
							    "</footer>" +
						   "</div>";
			divContainer.innerHTML = content;
			this.__dom.doc.body.insertBefore(divContainer,this.__dom.doc.body.firstChild);
			this.util.addEvent(this.__dom.doc.getElementById("nsEditorIconClose"),"click",closeConfirmBox);
			this.util.addEvent(this.__dom.doc.getElementById("btnEditorConfirmOk"),"click",function(event){
				if(okHandler)
				{
					okHandler(event);
				}
				closeConfirmBox();
			});
			this.util.addEvent(this.__dom.doc.getElementById("btnEditorConfirmCancel"),"click",function(event){
				if(cancelHandler)
				{
					cancelHandler(event);
				}
				closeConfirmBox();
			});
		}
	};
	//end of section of functions for pluggin

	NSEditor.prototype.__addElement = function (node,config) 
	{
		this.__selection.restoreSelection();
		if(node)
		{
			config = config || {};
			var doc = this.__getDocument();
			var win = this.__getWindow();
			var textArea = this.__getTextArea();
			var html = this.getHtml();
			if(html == this.__defaultContent)
			{
				this.util.removeAllChildren(textArea);
			}
			var element = this.__selection.getElementUnderCursor();
	        var isCollapsed = this.__selection.isCollapsed();
	        if (element && isCollapsed) 
	        {
	        	var self = this;
	        	var blockElement = this.editorUtil.getClosestElement(element,function(node) 
	        	{ 
	        		return self.editorUtil.isBlock(node,win); 
	        	},textArea);
	            if (config.insertAfterSelectedNode && blockElement && blockElement !== textArea) 
	            {
	            	if(!config.insertAfterNodeCallback || config.insertAfterNodeCallback(blockElement))
	            	{
	            		this.__selection.setCursorAfter(blockElement);
	            	}
	            }
	        }
	        this.__selection.insertNode(doc.createTextNode("\n"));
	        this.__selection.insertNode(node,Boolean.parse(config.insertCursorAfter));
	        config.afterInsertCallback && config.afterInsertCallback();
	        if(config.dispatchEvents && config.dispatchEvents.length)
	        {
	        	for(var count = 0;count < config.dispatchEvents.length;count++)
	        	{
	        		var itemEvent = config.dispatchEvents[count];
	        		this.__dispatchInternalEvent(itemEvent.name,itemEvent.args,itemEvent.args);
	        	}
	        }
		}
	};
	
	
    
    NSEditor.prototype.__checkCharCount = function(element,charCounterType) 
    {
    	var maxCount = this.__config.maxCharCount
        if (maxCount) 
        {
            var countType = charCounterType || this.__config.charCounterType;
            var length = this.editorUtil.getCharLength((typeof element === "string" ? element : this.__isCharTypeHTML() ? element.outerHTML : element.textContent), countType);
            if (length > 0 && length + this.__getCharCount(countType) > maxCount) 
            {
            	//TODO:indicate here that character has increased maxCharCount
                return false;
            }
        }
        return true;
    };
    
    NSEditor.prototype.__getCharCount = function(charCounterType) 
    {
        charCounterType = (typeof charCounterType === "string") ? charCounterType : this.__config.charCounterType;
        var count = this.editorUtil.getCharLength((this.__isCharTypeHTML() ? this.getHtml() : this.getText()), charCounterType);
        return count;
    };

	//function related to Media sources like img,audio,video
	NSEditor.prototype.__createCustomMediaContainerContainer = function(mediaContainer,cssClass,contenteditable) 
	{
		contenteditable = Boolean.parse(contenteditable);
        var container = this.util.createDiv(null,"nsEditorMediaContainerContainer");
        if(cssClass)
        {
        	this.util.addStyleClass(cssClass);
        }
        container.setAttribute("contenteditable",contenteditable);
        if(mediaContainer)
        {
        	container.appendChild(mediaContainer);
        }
        return container;
    };

    NSEditor.prototype.__createCustomMediaContainer = function(element,parent) 
    {
        var container = this.util.createDiv(null,"nsEditorMediaContainer");
        if(element)
        {
        	container.appendChild(element);
        }
        if(parent)
        {
        	parent.appendChild(container);
        }
        return container;
    };

    NSEditor.prototype.__createCustomMediaCaption = function(caption,parent) 
    {
        var divCaption = this.util.createDiv(null,"nsEditorMediaCaption");
        divCaption.setAttribute("contenteditable", true);
        var divContent = this.util.createDiv(null,"nsEditorMediaCaptionContent");
        divContent.innerHTML = caption;
        divCaption.appendChild(divContent);
        if(parent)
        {
        	parent.appendChild(divCaption);
        }
        return divCaption;
    };
	
	//end of function related to Media sources like img,audio,video
	
	NSEditor.prototype.__isCharTypeHTML = function() 
    {
		return (this.__config.charCounterType == "byte-html")
    };
    	
	//function using the editor
	NSEditor.prototype.__funcExecuted = function(funcID) 
	{
		this.__funcID = funcID;
	};
	
	NSEditor.prototype.__isFuncExecuted = function(funcID) 
	{
		var retValue = (this.__funcID == funcID);
		return retValue;
	};
	
	//end of function using the editor 
    
	NSEditor.TOOLBAR_BUTTONS_BOLD = "bold";
	NSEditor.TOOLBAR_BUTTONS_ITALIC = "italic";
	NSEditor.TOOLBAR_BUTTONS_UNDERLINE = "underline";
	NSEditor.TOOLBAR_BUTTONS_STRIKETHROUGH = "strikeThrough";
	NSEditor.TOOLBAR_BUTTONS_SUBSCRIPT = "subscript";
	NSEditor.TOOLBAR_BUTTONS_SUPERSCRIPT = "superscript";
	NSEditor.TOOLBAR_BUTTONS_FONTFAMILY = "fontFamily";
	NSEditor.TOOLBAR_BUTTONS_FONTSIZE = "fontSize";
	NSEditor.TOOLBAR_BUTTONS_PARAGRAPHFORMAT = "paragraphFormat";
	NSEditor.TOOLBAR_BUTTONS_ALIGN = "align";
	NSEditor.TOOLBAR_BUTTONS_ORDEREDLIST = "orderedList";
	NSEditor.TOOLBAR_BUTTONS_UNORDEREDLIST = "unorderedList";
	NSEditor.TOOLBAR_BUTTONS_UNDO = "undo";
	NSEditor.TOOLBAR_BUTTONS_REDO = "redo";
	NSEditor.MODE_TEXTAREA = "textArea";
	NSEditor.MODE_IFRAME = "iframe";
	
	return NSEditor;
})();
nsModuleExport(__nsGlobal,"NSEditor",NSEditor);