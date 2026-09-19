var NSDatePicker = (function()
{
	function NSDatePicker(component,setting) 
	{
		this.__setting = setting;
		
		this.__context = window;
		this.__dateOutputFormat = "MM/dd/yyyy";
		this.__placeHolder = null;
		this.__buttonHtml = null;
		this.__enableTextBoxDisabled = false;
		this.__customClass = {container:null,textInput:null,button:null,calContainer:null,calHeaderContainer:null,calPrevButton:null,calNextButton:null,calMonthDropdown:null,calYearDropdown:null,calWeekContainer:null,calWeek:null,calDayContainer:null,calDay:null,calFooterContainer:null};
		this.__calendarPos = null;
		this.__calendarWidth = null;
		this.__calendarCellWidth = null;
		this.__isAbsolutePosition = true;
		
		this.__divContainer = null;
		this.__txtBox = null;
		this.__btnActivate = null;
		this.__divCalContainer = null;
		this.__nsPopUp = null;
		this.__maxZIndex = 0;
		
		this.__nsCalendar = null;
		
		this.__documentMouseDownRef = null;
		
		this.base.__setBaseComponent.call(this,component);
	};
	nsExtendPrototype(NSContainerBase,NSDatePicker);
	NSDatePicker.prototype.constructor = NSDatePicker;
	
	NSDatePicker.prototype.initializeComponent = function() 
	{
		this.base.initializeComponent.call(this);
		this.__setSetting();
		this.__initDefault();
		this.__createComponent();
		this.__maxZIndex = this.util.getMaxZIndex();
	};
	
	NSDatePicker.prototype.setComponentProperties = function() 
	{
		this.base.setComponentProperties.call(this);
	};
	
	NSDatePicker.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty)
	{
		var attributeName = attrName.toLowerCase();
		this.base.propertyChange.call(this,attrName, oldVal, newVal, setProperty);
	};
	
	NSDatePicker.prototype.removeComponent = function() 
	{
		this.__removeDocumentMosueHandler();
		this.__removePopUp();
		this.base.removeComponent.call(this);
	};
	
	NSDatePicker.prototype.componentResized = function(event) 
	{
		this.__hideCalendar();
		this.base.componentResized.call(this,event);
	};
	
	NSDatePicker.prototype.getSelectedDate = function() 
	{
		if(this.__nsCalendar)
		{
			return this.__nsCalendar.getSelectedDate();
		}
		return null;
	};
	
	NSDatePicker.prototype.getSelectedDateAsString = function(format) 
	{
		if(this.__nsCalendar)
		{
			return this.__nsCalendar.getSelectedDateAsString(format);
		}
		return null;
	};
	
	NSDatePicker.prototype.setSelectedDate = function(date,format,fireEvent) 
	{
		if(this.__nsCalendar)
		{
			this.__nsCalendar.setSelectedDate(date,format,fireEvent);
		}
		if(date)
		{
			this.__setTextInput(this.getSelectedDate());
		}
		else 
		{
			this.__txtBox.value = "";
		}
	};
	
	NSDatePicker.prototype.setYear = function(year) 
	{
		if(this.__nsCalendar)
		{
			this.__nsCalendar.setYear(year);
		}
	};
	
	NSDatePicker.prototype.setMonth = function(month) 
	{
		if(this.__nsCalendar)
		{
			this.__nsCalendar.setMonth(month);
		}
	};
	
	NSDatePicker.prototype.reset = function() 
	{
		if(this.__nsCalendar)
		{
			this.__nsCalendar.reset();
		}
		this.__setTextInput();
	};
	
	NSDatePicker.prototype.setTodayDate = function() 
	{
		if(this.__nsCalendar)
		{
			this.__nsCalendar.setTodayDate();
		}
		//this.__setTextInput(new Date());
	};
	
	NSDatePicker.prototype.showCalendar = function(isAbsolutePosition) 
	{
		this.__showCalendar(null, isAbsolutePosition);
	};
	
	NSDatePicker.prototype.closeCalendar = function() 
	{
		this.__hideCalendar();
	};
	
	NSDatePicker.prototype.toggleCalendarVisibility = function() 
	{
		this.__toggleCalendarVisibility();
	};
	
	NSDatePicker.prototype.getCalendar = function() 
	{
		return this.__nsCalendar;
	};
	
	NSDatePicker.prototype.getTextBox = function() 
	{
		return this.__txtBox;
	};
	
	NSDatePicker.prototype.getText = function() 
	{
		return this.__txtBox.value;
	};
	
	NSDatePicker.prototype.__setSetting = function()
	{
		if(!this.__setting)
		{
			this.__setting = {};
		}
		var setting = this.__setting;
		if(setting)
		{
			if(setting.hasOwnProperty("context"))
			{
				this.__context = setting["context"];
			}
			if(setting.hasOwnProperty("dateOutputFormat"))
			{
				this.__dateOutputFormat = setting["dateOutputFormat"];
			}
			else if(setting.hasOwnProperty("showTime") && Boolean.parse(setting["showTime"])) {
				this.__dateOutputFormat += " HH:mm";
				if(setting.hasOwnProperty("timeSetting") && setting["timeSetting"].showSeconds) {
					this.__dateOutputFormat += ":ss";
				}
			}
			if(setting.hasOwnProperty("placeHolder"))
			{
				this.__placeHolder = setting["placeHolder"];
			}
			if(setting.hasOwnProperty("buttonHtml"))
			{
				this.__buttonHtml = setting["buttonHtml"];
			}
			if(setting.hasOwnProperty("enableTextBoxDisabled"))
			{
				this.__enableTextBoxDisabled = Boolean.parse(setting["enableTextBoxDisabled"]);
			}
			if(setting.hasOwnProperty("calendarPos"))
			{
				this.__calendarPos = setting["calendarPos"];
			}
			else
			{
				this.__calendarPos = this.util.POS_BOTTOMRIGHT;
			}
			if(setting.hasOwnProperty("calendarWidth"))
			{
				this.__calendarWidth = setting["calendarWidth"];
			}
			if(setting.hasOwnProperty("calendarCellWidth"))
			{
				this.__calendarCellWidth = setting["calendarCellWidth"];
			}
			if(setting.hasOwnProperty("isAbsolutePosition"))
			{
				this.__isAbsolutePosition = Boolean.parse(setting["isAbsolutePosition"]);
			}
			else {
				this.__isAbsolutePosition = true;
			}
			if(setting.hasOwnProperty("theme"))
			{
				this.__theme = setting["theme"];
			}
			var customClass = {};
			if(setting.hasOwnProperty("customClass"))
			{
				customClass = setting["customClass"];
			}
			if(!customClass)
			{
				customClass = {};
			}
			for(var prop in this.__customClass)
			{
				this.__customClass[prop] = (customClass[prop] || null);
			}
		}
	};
	
	NSDatePicker.prototype.__initDefault = function()
	{
		if(!this.__buttonHtml)
		{
			this.__buttonHtml = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" \r\n" + 
								"	 width=\"16px\" height=\"16px\" viewBox=\"0 0 36.447 36.447\" >\r\n" + 
								"<g>\r\n" + 
								"	<g>\r\n" + 
								"		<path d=\"M30.224,3.948h-1.098V2.75c0-1.517-1.197-2.75-2.67-2.75c-1.474,0-2.67,1.233-2.67,2.75v1.197h-2.74V2.75\r\n" + 
								"			c0-1.517-1.197-2.75-2.67-2.75c-1.473,0-2.67,1.233-2.67,2.75v1.197h-2.74V2.75c0-1.517-1.197-2.75-2.67-2.75\r\n" + 
								"			c-1.473,0-2.67,1.233-2.67,2.75v1.197H6.224c-2.343,0-4.25,1.907-4.25,4.25v24c0,2.343,1.907,4.25,4.25,4.25h24\r\n" + 
								"			c2.344,0,4.25-1.907,4.25-4.25v-24C34.474,5.855,32.567,3.948,30.224,3.948z M25.286,2.75c0-0.689,0.525-1.25,1.17-1.25\r\n" + 
								"			c0.646,0,1.17,0.561,1.17,1.25v4.896c0,0.689-0.524,1.25-1.17,1.25c-0.645,0-1.17-0.561-1.17-1.25V2.75z M17.206,2.75\r\n" + 
								"			c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.896c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z M9.125,2.75\r\n" + 
								"			c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.896c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z\r\n" + 
								"			 M31.974,32.198c0,0.965-0.785,1.75-1.75,1.75h-24c-0.965,0-1.75-0.785-1.75-1.75v-22h27.5V32.198z\"/>\r\n" + 
								"		<rect x=\"6.724\" y=\"14.626\" width=\"4.595\" height=\"4.089\"/>\r\n" + 
								"		<rect x=\"12.857\" y=\"14.626\" width=\"4.596\" height=\"4.089\"/>\r\n" + 
								"		<rect x=\"18.995\" y=\"14.626\" width=\"4.595\" height=\"4.089\"/>\r\n" + 
								"		<rect x=\"25.128\" y=\"14.626\" width=\"4.596\" height=\"4.089\"/>\r\n" + 
								"		<rect x=\"6.724\" y=\"20.084\" width=\"4.595\" height=\"4.086\"/>\r\n" + 
								"		<rect x=\"12.857\" y=\"20.084\" width=\"4.596\" height=\"4.086\"/>\r\n" + 
								"		<rect x=\"18.995\" y=\"20.084\" width=\"4.595\" height=\"4.086\"/>\r\n" + 
								"		<rect x=\"25.128\" y=\"20.084\" width=\"4.596\" height=\"4.086\"/>\r\n" + 
								"		<rect x=\"6.724\" y=\"25.54\" width=\"4.595\" height=\"4.086\"/>\r\n" + 
								"		<rect x=\"12.857\" y=\"25.54\" width=\"4.596\" height=\"4.086\"/>\r\n" + 
								"		<rect x=\"18.995\" y=\"25.54\" width=\"4.595\" height=\"4.086\"/>\r\n" + 
								"		<rect x=\"25.128\" y=\"25.54\" width=\"4.596\" height=\"4.086\"/>\r\n" + 
								"	</g>\r\n" + 
								"</g>\r\n" + 
								"</svg>";
		}
	};
	
	NSDatePicker.prototype.__createComponent = function()
	{
		this.util.addStyleClass(this.__baseComponent,"nsDatePicker");
		this.__applyTheme(this.__baseComponent,"nsDatePicker");
		this.__divContainer = this.util.createDiv(this.getID() + "container","nsDatePickerContainer");
		this.__applyCustomClass(this.__divContainer,"container");
		this.__baseComponent.appendChild(this.__divContainer);
		this.__txtBox = this.util.createElement("input",this.getID() + "input","nsDatePickerTextBox");
		this.__txtBox.setAttribute("type","search");
		this.__applyCustomClass(this.__txtBox,"textInput");
		if(this.__placeHolder)
		{
			this.__txtBox.setAttribute("placeholder",this.__placeHolder);
		}
		if(this.__enableTextBoxDisabled)
		{
			this.__txtBox.setAttribute("readOnly",true);
			this.util.addStyleClass(this.__txtBox,"nsDatePickerTextBoxDisabled");
		}
		else
		{
			this.util.addEvent(this.__txtBox,"input",this.__txtBoxKeyHandler.bind(this));
		}
		this.__divContainer.appendChild(this.__txtBox);
		this.__btnActivate = this.util.createElement("button",this.getID() + "button","nsDatePickerButton");
		this.__applyCustomClass(this.__txtBox,"button");
		this.__btnActivate.innerHTML = this.__buttonHtml;
		this.util.addEvent(this.__btnActivate,"click",this.__btnActivateClickHandler.bind(this));
		this.__divContainer.appendChild(this.__btnActivate);
		var popUpSetting = {type:"div",width:null,position:this.__calendarPos,closeOnOutsideClick:false};
		this.__nsPopUp = new this.util.nsPopUp(popUpSetting);
		this.__nsPopUp.create();
		this.__divCalContainer = this.__nsPopUp.getPopUp();
		/*this.__divCalContainer = this.util.createDiv(this.getID() + "calContainer","nsDatePickerCalContainer");
		this.__divContainer.appendChild(this.__divCalContainer);*/
		this.__createCalendar(this.__divCalContainer);
		if(this.getSelectedDate())
		{
			this.__setTextInput(this.getSelectedDate());
		}
	};
	
	NSDatePicker.prototype.__createCalendar = function(parent)
	{
		if(!this.__nsCalendar)
		{
			var setting =  this.util.cloneObject(this.__setting);
			setting.customClass = {};
			for(var prop in this.__customClass)
			{
				if(prop.startsWith("cal"))
				{
					var tempProp = prop.substring(3);
					tempProp = tempProp.charAt(0).toLowerCase() + tempProp.slice(1);
					setting.customClass[tempProp] = this.__customClass[prop];
				}
			}
			setting["width"] = this.__calendarWidth;
			setting["cellWidth"] = this.__calendarCellWidth;
			this.__nsCalendar = new NSCalendar(parent,setting);
			this.util.addEvent(parent,NSCalendar.DATE_SELECTED,this.__dateSelectedHandler.bind(this));
			this.util.addEvent(parent,NSCalendar.DATE_SELECTION_CANCELLED,this.__dateCancelSelectedHandler.bind(this));
		}
	};
	
	NSDatePicker.prototype.__btnActivateClickHandler = function(event)
	{
		//to stop refresh of page
		event = this.util.getEvent(event);
		event.preventDefault();
        event.stopPropagation();
		this.__toggleCalendarVisibility(event);
	};
	
	NSDatePicker.prototype.__txtBoxKeyHandler = function(event)
	{
		var strDate = this.__txtBox.value;
		var nsDateUtil = new NSDateUtil(); 
		var date = nsDateUtil.parseString(strDate,this.__dateOutputFormat);
		if(date)
		{
			this.__nsCalendar.setSelectedDate(date);
		}
		else
		{
			this.__nsCalendar.setSelectedDate(null,null,false);
		}
		this.util.dispatchEvent(this.__baseComponent,NSDatePicker.INPUT_CHANGE,strDate,{date:date,value:strDate});
	};
	
	NSDatePicker.prototype.__documentMouseDownHandler = function(event)
	{
		var target = this.util.getTarget(event);
		var parent = this.util.findParentBySelector(target,".nsDatePickerContainer") || this.util.findParentBySelector(target,".nsCalendar");
		if(!parent)
		{
			this.__hideCalendar();
		}
	};
	
	NSDatePicker.prototype.__dateSelectedHandler = function(event)
	{
		event.stopImmediatePropagation();
		event.stopPropagation();
		var selectedDate = event.detail;
		this.__setTextInput(selectedDate);
		this.__hideCalendar();
		this.util.dispatchEvent(this.__baseComponent,NSDatePicker.DATE_SELECTED,selectedDate,{date:selectedDate});
	};

	NSDatePicker.prototype.__dateCancelSelectedHandler = function(event)
	{
		event.stopImmediatePropagation();
		event.stopPropagation();
		this.__hideCalendar();
	};
	
	NSDatePicker.prototype.__setTextInput = function(date)
	{
		if(date)
		{
			var nsDateUtil = new NSDateUtil(); 
			this.__txtBox.value = nsDateUtil.format(date,this.__dateOutputFormat);
		}
		else
		{
			this.__txtBox.value = "";
		}
	};
	
	NSDatePicker.prototype.__toggleCalendarVisibility = function(event)
	{
		if(this.__isCalendarVisible())
		{
			this.__hideCalendar(event);
		}
		else
		{
			this.__showCalendar(event);
		}
	};
	
	NSDatePicker.prototype.__showCalendar = function(event,isAbsolutePosition)
	{
		if(this.util.isUndefinedOrNull(isAbsolutePosition)) {
			isAbsolutePosition = this.__isAbsolutePosition;
		}
		this.__nsCalendar.__clearCellSelectionExceptSelected();
		//this.util.addStyleClass(this.__divCalContainer,"nsDatePickerCalContainerVisible");
		this.__nsPopUp.show();
		this.__nsPopUp.placePopUp(this.__divContainer,isAbsolutePosition);
		this.__addDocumentMosueHandler();
		this.__divCalContainer.style.zIndex = (this.__maxZIndex > 0) ? (this.__maxZIndex + 1) : 9999;
		this.util.dispatchEvent(this.__baseComponent,NSDatePicker.CALENDAR_OPENED);
	};
	
	NSDatePicker.prototype.__hideCalendar = function(event)
	{
		//this.util.removeStyleClass(this.__divCalContainer,"nsDatePickerCalContainerVisible");
		this.__nsPopUp.hide();
		this.__removeDocumentMosueHandler();
		this.util.dispatchEvent(this.__baseComponent,NSDatePicker.CALENDAR_CLOSED);
	};
	
	NSDatePicker.prototype.__addDocumentMosueHandler = function()
	{
		if(!this.__documentMouseDownRef)
		{
			this.__documentMouseDownRef = this.__documentMouseDownHandler.bind(this);
			this.util.addEvent(document,"mousedown",this.__documentMouseDownRef);
		}
	};
	
	NSDatePicker.prototype.__removeDocumentMosueHandler = function()
	{
		if(this.__documentMouseDownRef)
		{
			this.util.removeEvent(document,"mousedown",this.__documentMouseDownRef);
			this.__documentMouseDownRef = null;
		}
	};
	
	NSDatePicker.prototype.__isCalendarVisible = function()
	{
		return this.util.hasStyleClass(this.__divCalContainer,"nsDatePickerCalContainerVisible");
	};
	
	NSDatePicker.prototype.__applyCustomClass = function(element,type)
	{
		if(element && type && this.__customClass[type])
		{
			this.util.addStyleClass(element,this.__customClass[type]);
		}
	};
	
	NSDatePicker.prototype.__removePopUp = function()
	{
		if(this.__nsPopUp)
		{
			this.__nsPopUp.remove();
			this.__nsPopUp = null;
		}
	};
	
	NSDatePicker.CALENDAR_OPENED = "calendarOpened";
	NSDatePicker.CALENDAR_CLOSED = "calendarClosed";
	NSDatePicker.DATE_SELECTED = "dateSelected";
	NSDatePicker.INPUT_CHANGE = "inputChange";
	
	return NSDatePicker;
})();
nsModuleExport(__nsGlobal,"NSDatePicker",NSDatePicker);