"use strict";
var NSMessageBar = (function()
{
	function NSMessageBar(setting) 
	{
		var config = null;
		
		var self = this;
		var util = null;
		var container = null;
		var divContainer = null;
		
        var objSeverity = {success:{containerCss:"nsMessageBarSuccess",css:"nsMessageBarIconSuccess",svg:"<svg height=\"###height###\" width=\"###width###\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M11.12,18.32,19.6,9.83h0l.71-.71a.5.5,0,0,0,0-.7L18.89,7a.5.5,0,0,0-.7,0l-.71.71h0l-7.42,7.42L6.52,11.6h0l-.71-.71a.5.5,0,0,0-.7,0L3.69,12.31a.5.5,0,0,0,0,.7l.71.71h0L9,18.32A1.52,1.52,0,0,0,11.12,18.32Z\" fill=\"###fill###\"/></svg>"},
        			   info:{containerCss:"nsMessageBarInfo",css:"nsMessageBarIconInfo",svg:"<svg height=\"###height###\" width=\"###width###\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12,4a8,8,0,1,0,8,8A8,8,0,0,0,12,4ZM10.67,7.26A.26.26,0,0,1,10.93,7H13a.33.33,0,0,1,.33.33V8.67A.33.33,0,0,1,13,9H11a.33.33,0,0,1-.33-.33Zm3.66,9.41A.33.33,0,0,1,14,17H10a.33.33,0,0,1-.33-.33v-1a.34.34,0,0,1,.33-.34h.67V12H10a.33.33,0,0,1-.33-.33v-1a.34.34,0,0,1,.33-.34h3a.34.34,0,0,1,.33.34v4.66H14a.34.34,0,0,1,.33.34Z\" fill=\"###fill###\"/></svg>"},
        			   warning:{containerCss:"nsMessageBarWarning",css:"nsMessageBarIconWarning",svg:"<svg height=\"###height###\" width=\"###width###\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M20.83,18,13.08,4.72a1.26,1.26,0,0,0-2.16,0L3.17,18A1.25,1.25,0,0,0,4.25,19.9h15.5A1.25,1.25,0,0,0,20.83,18ZM11.09,8.67h1.82a.51.51,0,0,1,.51.51l-.2,4.12a.5.5,0,0,1-.51.5H11.29a.5.5,0,0,1-.51-.5l-.2-4.12A.51.51,0,0,1,11.09,8.67ZM12,17.53A1.5,1.5,0,1,1,13.5,16,1.5,1.5,0,0,1,12,17.53Z\" fill=\"###fill###\"/></svg>"},
        			   error:{containerCss:"nsMessageBarError",css:"nsMessageBarIconError",svg:"<svg height=\"###height###\" width=\"###width###\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M14.83,12,18,8.82A1,1,0,0,0,18,7.4L16.6,6a1,1,0,0,0-1.42,0L12,9.17,8.82,6A1,1,0,0,0,7.4,6L6,7.4A1,1,0,0,0,6,8.82L9.17,12,6,15.18A1,1,0,0,0,6,16.6L7.4,18a1,1,0,0,0,1.42,0L12,14.83,15.18,18a1,1,0,0,0,1.42,0L18,16.6a1,1,0,0,0,0-1.42Z\" fill=\"###fill###\"/></svg>"}};
        var objAnimation = {}; 
        
        var initialize = function()
    	{
    		util = new NSUtil();
    		if(!setting)
    		{
    			setting = {};
    		}
    		config = {
    				detail: setting["detail"] || "",
    				summary: setting["summary"] || "",
    				parent: setting[parent] || document.body,
    				severity: setting["severity"] || "success",
    				enableAnimation: (util.isUndefinedOrNull(setting["enableAnimation"])) ? true : Boolean.parse(setting["enableAnimation"]),
    				animationType: setting["animationType"] || "fade",
    				enableClose: (util.isUndefinedOrNull(setting["enableClose"])) ? true : Boolean.parse(setting["enableClose"]),
    				enableAutoHide: (util.isUndefinedOrNull(setting["enableAutoHide"])) ? true : Boolean.parse(setting["enableAutoHide"]),
    				autoHideInterval: (util.isUndefinedOrNull(setting["autoHideInterval"]) || isNaN(parseInt(setting["autoHideInterval"],10))) ? 5000 : setting["autoHideInterval"],
    				maxBar: setting["maxBar"],
    				enableIcon: (util.isUndefinedOrNull(setting["enableIcon"])) ? true : Boolean.parse(setting["enableIcon"]),
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
    		config.customClass = {container:setting.customClass["container"],summary:setting.customClass["summary"],detail:setting.customClass["detail"],closeButton:setting.customClass["closeButton"]};
    		
    		initAnimation();
    		addClassInDOM();
    		
    		createMessageBar();
    		setTheme(config.theme);
    		showMessageBar();
    		autoCloseMessageBar();
    	};
    	
    	var addClassInDOM = function()
    	{
    		var objProps = {height:"30px",width:"30px",fill:"black"};
    		for(var key in objSeverity)
    		{
    			var svgText = objSeverity[key].svg;
    			for(var prop in objProps)
    			{
    				svgText = svgText.replaceAll("###" + prop + "###",objProps[prop]);
    			}
    			var svgBase64 = util.convertSvgToBase64(svgText);
    			util.addCSSClassInDOM([".nsMessageBarContainer" + config.theme + " ." + objSeverity[key].css + " .nsMessageBarIconChild" ],["background:url('" + svgBase64 + "') no-repeat;"]);
    		}
    	};
    	
    	var initAnimation = function()
    	{
    		objAnimation = {fade:{add:function(callback){
    			util.fadeIn(divContainer,callback);
    		},remove:function(callback){
    			util.fadeOut(divContainer,callback);
    		}},slide:{add:function(callback){
    			util.slideDown(divContainer,null,callback);
    		},remove:function(callback){
    			util.slideUp(divContainer,null,callback);
    		}}};
    	};
    	
    	var createMessageBar = function()
    	{
    		container = document.querySelector(".nsMessageBarContainer");
    		if(!container)
    		{
    			container = util.createDiv(null,"nsMessageBarContainer");
    			if(config.parent.childNodes.length > 0)
    			{
    				config.parent.insertBefore(container,config.parent.childNodes[0]);
    			}
    			else
    			{
    				config.parent.appendChild(container);
    			}
    		}
    		
    		divContainer = util.createDiv(null,"nsMessageBar");
    		var itemSeverity = objSeverity[config.severity];
    		util.addStyleClass(divContainer,itemSeverity.containerCss);
    		applyCustomClass(divContainer,"container");
    		if(config.enableIcon) 
    		{
    		   var spanIcon = util.createElement("span",null,"nsMessageBarIcon");
               util.addStyleClass(spanIcon,itemSeverity.css);
               var spanChild = util.createElement("span",null,"nsMessageBarIconChild");
               spanIcon.appendChild(spanChild);
               divContainer.appendChild(spanIcon);
            }
    		if(util.isString(config.detail))
    		{
    			config.detail = [{summary:config.summary,detail:config.detail}];
    		}
    		var ul = util.createElement("ul",null,"nsMessageBarBody");
    		for (var count = 0; count < config.detail.length; count++) 
    		{
    			var item = config.detail[count];
                var li = util.createElement("li",null,"nsMessageBarBodyElement");
                li.setAttribute("data-ns-index" , count);
                var spanSummary = util.createElement("span",null,"nsMessageBarBodySummary");
                spanSummary.innerHTML = item.summary;
                li.appendChild(spanSummary);
                var spanDetail = util.createElement("span",null,"nsMessageBarBodyDetail");
                spanDetail.innerHTML = item.detail;
                li.appendChild(spanDetail);
                applyCustomClass(li,"body");
                ul.appendChild(li);
            }
    		divContainer.appendChild(ul);
    		if(config.enableClose)
    		{
    			var btnClose = util.createElement("button",null,"nsMessageBarClose");
    			var spanClose = util.createElement("span");
    			spanClose.innerHTML = "&times;";
    			btnClose.appendChild(spanClose);
    			applyCustomClass(btnClose,"closeButton");
    			util.addEvent(btnClose,"click",closeMessageBar);
    			divContainer.appendChild(btnClose);
    		}
    		container.appendChild(divContainer);
    		if (config.maxBar && !isNaN(parseInt(config.maxBar),10)) 
            {
            	var arrBar = container.querySelectorAll(".nsMessageBar");
                var prevCount = arrBar.length;
                var excessCount = prevCount - config.maxBar;
                if (excessCount > 0) 
                {
                	for(var count = 0;count < excessCount;count++)
                	{
                		container.removeChild(arrBar[count]);
                	}
                }
            }
    	};
    	
    	var closeMessageBar = function(event)
    	{
    		event = util.getEvent(event);
    		event.preventDefault();
    		removeMessageBar();
    	};
    	
    	var removeMessageBar = function()
    	{
    		var remove = function()
    		{
    			if(divContainer && divContainer.parentElement)
    			{
    				divContainer.parentElement.removeChild(divContainer);
    			}
    			callCallback(divContainer,"afterRemoveCallback");
    			divContainer = null;
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
    				callCallback(divContainer,"beforeRemoveCallback");
					remove();
    			}
    		}
    		else
    		{
    			callCallback(divContainer,"beforeRemoveCallback");
    			remove();
    		}
    	};
    	
    	var showMessageBar = function()
    	{
    		var show = function()
    		{
    			callCallback(divContainer,"afterAddCallback");
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
    				callCallback(divContainer,"beforeAddCallback");
					show();
    			}
    		}
    		else
    		{
    			callCallback(divContainer,"beforeAddCallback");
    			show();
    		}
    	};
    	
    	var autoCloseMessageBar = function()
    	{
    		if(config.enableAutoHide)
    		{
    			window.setTimeout(function()
    			{
    				removeMessageBar();
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
    			util.removeStyleClass(container,"nsMessageBarContainer" + config.theme);
    			config.theme = theme;
    			util.addStyleClass(container,"nsMessageBarContainer" + config.theme);
    		}
    	};
    	
    	var close = function() 
    	{
    		removeMessageBar();
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
	
	return NSMessageBar;
})();
nsModuleExport(__nsGlobal,"NSMessageBar",NSMessageBar);