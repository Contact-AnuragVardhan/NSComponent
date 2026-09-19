"use strict";
var NSToast = (function()
{
	function NSToast(setting) 
	{
		var config = null;
		
		var self = this;
		var util = null;
		var container = null;
		var divToast = null;
		
		var objPosition = {};
        var objIcon = {success:{css:"nsToastIconSuccess",svg:"<svg height=\"###height###\" width=\"###width###\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M11.12,18.32,19.6,9.83h0l.71-.71a.5.5,0,0,0,0-.7L18.89,7a.5.5,0,0,0-.7,0l-.71.71h0l-7.42,7.42L6.52,11.6h0l-.71-.71a.5.5,0,0,0-.7,0L3.69,12.31a.5.5,0,0,0,0,.7l.71.71h0L9,18.32A1.52,1.52,0,0,0,11.12,18.32Z\" fill=\"###fill###\"/></svg>"},
        			   info:{css:"nsToastIconInfo",svg:"<svg height=\"###height###\" width=\"###width###\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12,4a8,8,0,1,0,8,8A8,8,0,0,0,12,4ZM10.67,7.26A.26.26,0,0,1,10.93,7H13a.33.33,0,0,1,.33.33V8.67A.33.33,0,0,1,13,9H11a.33.33,0,0,1-.33-.33Zm3.66,9.41A.33.33,0,0,1,14,17H10a.33.33,0,0,1-.33-.33v-1a.34.34,0,0,1,.33-.34h.67V12H10a.33.33,0,0,1-.33-.33v-1a.34.34,0,0,1,.33-.34h3a.34.34,0,0,1,.33.34v4.66H14a.34.34,0,0,1,.33.34Z\" fill=\"###fill###\"/></svg>"},
        			   warning:{css:"nsToastIconWarning",svg:"<svg height=\"###height###\" width=\"###width###\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M20.83,18,13.08,4.72a1.26,1.26,0,0,0-2.16,0L3.17,18A1.25,1.25,0,0,0,4.25,19.9h15.5A1.25,1.25,0,0,0,20.83,18ZM11.09,8.67h1.82a.51.51,0,0,1,.51.51l-.2,4.12a.5.5,0,0,1-.51.5H11.29a.5.5,0,0,1-.51-.5l-.2-4.12A.51.51,0,0,1,11.09,8.67ZM12,17.53A1.5,1.5,0,1,1,13.5,16,1.5,1.5,0,0,1,12,17.53Z\" fill=\"###fill###\"/></svg>"},
        			   error:{css:"nsToastIconError",svg:"<svg height=\"###height###\" width=\"###width###\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M14.83,12,18,8.82A1,1,0,0,0,18,7.4L16.6,6a1,1,0,0,0-1.42,0L12,9.17,8.82,6A1,1,0,0,0,7.4,6L6,7.4A1,1,0,0,0,6,8.82L9.17,12,6,15.18A1,1,0,0,0,6,16.6L7.4,18a1,1,0,0,0,1.42,0L12,14.83,15.18,18a1,1,0,0,0,1.42,0L18,16.6a1,1,0,0,0,0-1.42Z\" fill=\"###fill###\"/></svg>"}};
        var objAnimation = {}; 
        
        var initialize = function()
    	{
    		util = new NSUtil();
    		if(!setting)
    		{
    			setting = {};
    		}
    		config = {
    				text: setting["text"] || "",
    				headerText: setting["headerText"] || "",
    				enableAnimation: (util.isUndefinedOrNull(setting["enableAnimation"])) ? true : Boolean.parse(setting["enableAnimation"]),
    				animationType: setting["animationType"] || "fade",
    				enableClose: (util.isUndefinedOrNull(setting["enableClose"])) ? true : Boolean.parse(setting["enableClose"]),
    				enableAutoHide: (util.isUndefinedOrNull(setting["enableAutoHide"])) ? true : Boolean.parse(setting["enableAutoHide"]),
    				autoHideInterval: (util.isUndefinedOrNull(setting["autoHideInterval"]) || isNaN(parseInt(setting["autoHideInterval"],10))) ? 5000 : setting["autoHideInterval"],
    				maxToastsInPos: setting["maxToastsInPos"],
    				position: setting["position"] || "top-right",
    				icon: setting["icon"],
    				theme: setting["theme"] || "White",
    				beforeAddCallback: (setting["beforeAddCallback"] ? util.getFunction(setting["beforeAddCallback"]) : null),
    				afterAddCallback: (setting["afterAddCallback"] ? util.getFunction(setting["afterAddCallback"]) : null),
    				beforeRemoveCallback: (setting["beforeRemoveCallback"] ? util.getFunction(setting["beforeRemoveCallback"]) : null),
    				afterRemoveCallback: (setting["afterRemoveCallback"] ? util.getFunction(setting["afterRemoveCallback"]) : null),
    				clickCallback: (setting["clickCallback"] ? util.getFunction(setting["clickCallback"]) : null),
    		};
    		if(!setting.customClass)
    		{
    			setting.customClass = {};
    		}
    		config.customClass = {container:setting.customClass["container"],header:setting.customClass["header"],body:setting.customClass["body"],closeButton:setting.customClass["closeButton"]};
    		
    		initPosition();
    		initAnimation();
    		addClassInDOM();
    		
    		createToast();
    		setTheme(config.theme);
    		positionToast();
    		showToast();
    		autoCloseToast();
    	};
    	
    	var addClassInDOM = function()
    	{
    		var objProps = {height:"30px",width:"30px",fill:"black"};
    		for(var key in objIcon)
    		{
    			var svgText = objIcon[key].svg;
    			for(var prop in objProps)
    			{
    				svgText = svgText.replaceAll("###" + prop + "###",objProps[prop]);
    			}
    			var svgBase64 = util.convertSvgToBase64(svgText);
    			util.addCSSClassInDOM([".nsToastContainer" + config.theme + " ." + objIcon[key].css],["background-image:url('" + svgBase64 + "');"]);
    		}
    	};
    	
    	var initPosition = function()
    	{
    		objPosition = {"top-left":{css:"top-left"},"top-right":{css:"top-right"},"bottom-left":{css:"bottom-left"},"bottom-right":{css:"bottom-right"},
    				"top-center":{css:"top-center",cssFunc:function(container){
    					return {
    						left:((window.outerWidth / 2) - (util.getOuterWidth(container) / 2)) + "px",
    						top: 20 + "px"
    					};
    				}},
    				"mid-center":{css:"mid-center",cssFunc:function(container){
    					return {
    						left:((window.outerWidth / 2) - (util.getOuterWidth(container) / 2)) + "px",
    						top:((window.outerHeight / 2) - (util.getOuterHeight(container) / 2)) + "px",
    					};
    				}},
    				"bottom-center":{css:"bottom-center",cssFunc:function(container){
    					return {
    						left:((window.outerWidth / 2) - (util.getOuterWidth(container) / 2)) + "px",
                            bottom: 20 + "px"
    					};
    				}}
    		};
    	};
    	
    	var initAnimation = function()
    	{
    		objAnimation = {fade:{add:function(callback){
    			util.fadeIn(divToast,callback);
    		},remove:function(callback){
    			util.fadeOut(divToast,callback);
    		}},slide:{add:function(callback){
    			util.slideDown(divToast,null,callback);
    		},remove:function(callback){
    			util.slideUp(divToast,null,callback);
    		}}};
    	};
    	
    	var createToast = function()
    	{
    		container = document.querySelector(".nsToastContainer.nsToast-" + config.position);
    		if(!container)
    		{
    			container = util.createDiv(null,"nsToastContainer");
    			document.body.appendChild(container);
    		}
    		divToast = util.createDiv(null,"nsToast");
    		applyCustomClass(divToast,"container");
    		if(config.enableClose)
    		{
    			var spanClose = util.createElement("span",null,"nsToastClose");
    			spanClose.innerHTML = "&times;";
    			applyCustomClass(spanClose,"closeButton");
    			util.addEvent(spanClose,"click",closeToast);
    			divToast.appendChild(spanClose);
    		}
    		if(config.headerText)
    		{
    			var header = util.createElement("h2",null,"nsToastHeader");
    			header.innerHTML = config.headerText;
    			applyCustomClass(header,"header");
    			divToast.appendChild(header);
    		}
    		if(!(config.text instanceof Array))
    		{
    			config.text = [config.text];
    		}
    		var ul = util.createElement("ul",null,"nsToastBody");
    		for (var count = 0; count < config.text.length; count++) 
    		{
                var li = util.createElement("li",null,"nsToastBodyElement");
                li.setAttribute("data-ns-index" , count);
                li.innerHTML = config.text[count];
                applyCustomClass(li,"body");
                ul.appendChild(li);
            }
    		divToast.appendChild(ul);
    		if(config.icon) 
    		{
               util.addStyleClass(divToast,"nsToastHasIcon");
               if(objIcon[config.icon]) 
               {
            	   util.addStyleClass(divToast,objIcon[config.icon].css);
               }
            }
            container.appendChild(divToast);
            //util.addStyleClass(divToast,"nsToastHidden");
            if (config.maxToastsInPos && !isNaN(parseInt(config.maxToastsInPos),10)) 
            {
            	var arrToast = container.querySelectorAll(".nsToast");
                var prevCount = arrToast.length;
                var excessCount = prevCount - config.maxToastsInPos;
                if (excessCount > 0) 
                {
                	for(var count = 0;count < excessCount;count++)
                	{
                		container.removeChild(arrToast[count]);
                	}
                }
            }
    	};
    	
    	var positionToast = function()
    	{
    		var item = objPosition[config.position];
    		if(item)
    		{
    			if(item.css)
    			{
    				util.addStyleClass(container,"nsToast-" + item.css);
    			}
    			if(item.cssFunc)
    			{
    				var css = item.cssFunc(container);
    				util.css(container,css);
    			}
    		}
    		else if ( typeof config.position === "object") 
    		{
                var css = {
                    top : config.position.top ? config.position.top : "auto",
                    bottom : config.position.bottom ? config.position.bottom : "auto",
                    left : config.position.left ? config.position.left : "auto",
                    right : config.position.right ? config.position.right : "auto"
                };
                util.css(container,css);
            }
    		else
    		{
    			util.addStyleClass(container,"top-right");
    		}
    	};
    	
    	var closeToast = function(event)
    	{
    		event = util.getEvent(event);
    		event.preventDefault();
    		removeToast();
    	};
    	
    	var removeToast = function()
    	{
    		var remove = function()
    		{
    			if(divToast && divToast.parentElement)
    			{
    				divToast.parentElement.removeChild(divToast);
    			}
    			callCallback(divToast,"afterRemoveCallback");
    			divToast = null;
    		};
    		if(config.enableAnimation)
    		{
    			var item = objAnimation[config.animationType.toLowerCase()];
    			if(item && item.remove)
    			{
    				item.remove(function(){
						remove();
					});
    			}
    			else
    			{
    				callCallback(divToast,"beforeRemoveCallback");
					remove();
    			}
    		}
    		else
    		{
    			callCallback(divToast,"beforeRemoveCallback");
    			remove();
    		}
    	};
    	
    	var showToast = function()
    	{
    		var show = function()
    		{
    			util.removeStyleClass(divToast,"nsToastHidden");
    			callCallback(divToast,"afterAddCallback");
    		};
    		if(config.enableAnimation)
    		{
    			var item = objAnimation[config.animationType.toLowerCase()];
    			if(item && item.add)
    			{
    				item.add(function(){
    					show();
					});
    			}
    			else
    			{
    				callCallback(divToast,"beforeAddCallback");
					show();
    			}
    		}
    		else
    		{
    			callCallback(divToast,"beforeAddCallback");
    			show();
    		}
    	};
    	
    	var autoCloseToast = function()
    	{
    		if(config.enableAutoHide)
    		{
    			window.setTimeout(function()
    			{
    				removeToast();
    			}, config.autoHideInterval);
    		}
    	};
    	
    	var callCallback = function(element,callbackName)
    	{
    		if(config[callbackName])
    		{
    			config[callbackName](element);
    		}
    	};
    	
    	var applyCustomClass = function(element,type)
    	{
    		if(element && type && config.customClass[type])
    		{
    			util.addStyleClass(element,config.customClass[type]);
    		}
    	};
    	
    	var setTheme = function(theme) 
    	{
    		if(container && config.theme)
    		{
    			util.removeStyleClass(container,"nsToastContainer" + config.theme);
    			config.theme = theme;
    			util.addStyleClass(container,"nsToastContainer" + config.theme);
    		}
    	};
    	
    	var close = function() 
    	{
    		removeToast();
    	};
    	
    	var closeAll = function() 
    	{
    		if(container)
    		{
    			util.removeAllChildren(container);
    		}
    	};
    	
    	initialize();
    	
    	self.setTheme = setTheme;
    	self.close = close;
    	self.closeAll = closeAll;
	};
	
	return NSToast;
})();
nsModuleExport(__nsGlobal,"NSToast",NSToast);