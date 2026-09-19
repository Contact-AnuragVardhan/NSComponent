"use strict";
var NSFloatingLabel = (function()
{
	function NSFloatingLabel(setting) 
	{
		var config = null;
		
		var self = this;
		var util = null;
		
		var container = null;
		var conContainer = null;
		var control = null;
		var label = null;
		var id = null;
		var parentElement = null;
		var isTxtBoxID = false;
		var typeCssClass = null;
        
        var initialize = function()
    	{
    		util = new NSUtil();
    		if(!setting)
    		{
    			setting = {};
    		}
    		config = {
    				container: setting["container"],
    				control: setting["control"],
    				label: setting["label"],
    				controlType: setting["controlType"] || (setting.control ? setting.control.nodeName.toLowerCase() : null) || "input",
    				inputType: setting["inputType"] || "text",// used when controlType is "input"
    				position: setting["position"] ? (setting["position"].charAt(0).toUpperCase() + setting["position"].slice(1)) : "Top",
    				topPosition: setting["topPosition"] ? (setting["topPosition"].charAt(0).toUpperCase() + setting["topPosition"].slice(1)) : "Middle",
    				theme: setting["theme"] ? (setting["theme"].charAt(0).toUpperCase() + setting["theme"].slice(1)) : "White"
    		};
    		if(!config.container && !config.control)
    		{
    			util.throwNSError("NSFloatingLabel","Enter a valid container or a control");
    		}
    		if(!config.label || !config.label.length)
    		{
    			util.throwNSError("NSFloatingLabel","Enter a valid Label");
    		}
    		if(!setting.customClass)
    		{
    			setting.customClass = {};
    		}
    		config.customClass = {container:setting.customClass["container"],control:setting.customClass["control"],controlFocus:setting.customClass["controlFocus"],
    							  label:setting.customClass["label"]};
    		setTypeCssClass();
    		createComponent();
    		setTheme(config.theme);
    	};
    	
    	var createComponent = function()
    	{
    		control = config.control;
    		var txtID = null;
    		if(control)
    		{
    			txtID = getID();
    			if(!isTxtBoxID)
    			{
    				txtID = txtID + "Txt";
    				control.setAttribute("id",txtID);
    				control.setAttribute("name",txtID);
    			}
    			container = util.createElement("div",getID() + "Container",getContainerClass());
    			parentElement = control.parentElement;
    			parentElement.insertBefore(container,control);
    		}
    		else
    		{
    			container = config.container;
    			util.addStyleClass(container,getContainerClass());
    			txtID = getID() + "TxtLabel";
    			control = util.createElement(config.controlType,txtID,null);
    			if(config.controlType == "input")
    			{
    				control.setAttribute("type",config.inputType);
    			}
    			control.setAttribute("name",txtID);
    		}
    		control.setAttribute("placeholder",config.label);
    		conContainer = util.createElement("div",getID() + "ConContainer","nsFloatingLabelConatiner");
    		util.addStyleClass(control,"nsFloatingLabelControl " + ((config.controlType == "input") ? "nsFloatingLabelInput" : "nsFloatingLabelTextArea"));
    		util.addEvent(control,"focus",controlFocusListener);
    		util.addEvent(control,"blur",controlBlurListener);
    		util.addEvent(control,"change input blur reset",controlEventListener);
    		conContainer.appendChild(control);
    		applyCustomClass(container,"container");
    		applyCustomClass(control,"control");
    		label = util.createElement("label",txtID + "Label","nsFloatingLabelLabel");
    		label.setAttribute("for",txtID);
    		label.innerHTML = config.label;
    		applyCustomClass(label,"label");
    		conContainer.appendChild(label);
    		container.appendChild(conContainer);
    	};
    	
    	var controlFocusListener = function(event)
    	{
    		event = util.getEvent(event);
    		controlEventListener(event);
    		util.addStyleClass(container,"nsFloatingLabelFocus");
    		util.addStyleClass(control,"nsFloatingLabelControlFocus");
    	};
    	
    	var controlBlurListener = function(event)
    	{
    		event = util.getEvent(event);
    		controlEventListener(event);
    		util.removeStyleClass(container,"nsFloatingLabelFocus");
    		util.removeStyleClass(control,"nsFloatingLabelControlFocus");
    	};
    	
    	var controlEventListener = function(event)
    	{
    		event = util.getEvent(event);
    		manageFocusCss((control.value && control.value.length) ? true : false);
    		redispatchEvent(event);
    	};
    	
    	var manageFocusCss = function(isSet)
    	{
    		isSet ? addFocusCss() : removeFocusCss();
    	};
    	
    	var addFocusCss = function()
    	{
    		util.addStyleClass(container,"nsFloatingLabelActive");
    		util.addStyleClass(control,typeCssClass);
			applyCustomClass(control,"controlFocus");
			applyCustomClass(label,"label");
    	};
    	
    	var removeFocusCss = function()
    	{
    		util.removeStyleClass(container,"nsFloatingLabelActive");
    		util.removeStyleClass(control,typeCssClass);
			removeCustomClass(control,"controlFocus");
			removeCustomClass(label,"label");
    	};
    	
    	var getContainerClass = function()
    	{
    		var retValue = "nsFloatingLabel nsFloatingLabel" + config.position;
    		if(config.position == "Top")
    		{
    			retValue += " nsFloatingLabel" + config.position + config.topPosition;
    		}
    		return retValue;
    	};
    	
    	var getID = function()
    	{
    		if(!id)
    		{
    			if(config.control && (config.control.hasAttribute("id") || config.control.hasAttribute("name")))
        		{
    				id = config.control.getAttribute("id") || config.control.getAttribute("name");
    				isTxtBoxID = true;
        		}
        		else if(config.container && (config.container.hasAttribute("id") || config.container.hasAttribute("name")))
        		{
        			id = config.container.getAttribute("id") || config.container.getAttribute("name");
        		}
    			else
    			{
    				id = "comp" + util.getUniqueId();
    			}
    		}
    		return id;
    	};
    	
    	var applyCustomClass = function(element,type)
    	{
    		if(element && type && config.customClass[type])
    		{
    			util.addStyleClass(element,config.customClass[type]);
    		}
    	};
    	
    	var removeCustomClass = function(element,type)
    	{
    		if(element && type && config.customClass[type])
    		{
    			util.removeStyleClass(element,config.customClass[type]);
    		}
    	};
    	
    	var setTypeCssClass = function()
    	{
    		var controlType = null;
    		switch(config.controlType.toLowerCase())
    		{
    			case "input":
    				controlType = "Input";
    			break;
    			case "textarea":
    				controlType = "TextArea";
        		break;
        		default:
        			controlType = "Input";
        		break;
    		}
    		typeCssClass = "nsFloatingLabel" + controlType + "Active";
    	};
    	
    	var redispatchEvent = function(event)
    	{
    		//control is not given but container is given as input
    		if(!parentElement)
    		{
    			util.redispatchEvent(container,event);
    		}
    	};
    	
    	var setAttribute = function(prop,value)
    	{
    		control.setAttribute(prop,value);
    	};
    	
    	var getAttribute = function(prop)
    	{
    		return control.getAttribute(prop);
    	};
    	
    	var value = function(value)
    	{
    		if(!util.isUndefined(value))
    		{
    			control.value = value;
    		}
    		return control.value;
    	};
    	
    	var getControl = function()
    	{
    		return control;
    	};
    	
    	var setTheme = function(theme) 
    	{
    		if(container && config.theme)
    		{
    			util.removeStyleClass(container,"nsFloatingLabel" + config.theme);
    			config.theme = theme;
    			util.addStyleClass(container,"nsFloatingLabel" + config.theme);
    		}
    	};
    	
    	var destroy = function() 
    	{
    		if(container && control)
    		{
    			if(parentElement)
        		{
        			parentElement.insertBefore(control,container);
        			container.parentElement.removeChild(container);
        			container = null;
        			if(!isTxtBoxID)
        			{
        				control.setAttribute("id",null);
        				control.setAttribute("name",null);
        			}
        		}
    		}
    		else
    		{
    			conContainer.parentElement.removeChild(conContainer);
    		}
    	};
    	
    	initialize();
    	
    	self.value = value;
    	self.getAttribute = getAttribute;
    	self.setAttribute = setAttribute;
    	self.setTheme = setTheme;
    	self.getControl = getControl;
    	self.destroy = destroy;
	};
	
	return NSFloatingLabel;
})();
nsModuleExport(__nsGlobal,"NSFloatingLabel",NSFloatingLabel);