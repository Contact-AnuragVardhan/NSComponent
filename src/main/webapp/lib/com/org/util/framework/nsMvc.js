"use strict";
var NSMvc = (function()
{
	function NSMvc(arrRoute,setting) 
	{
		this.util = new NSUtil();
		this.__arrRoute = arrRoute ? arrRoute : [];
		this.__setting = setting;
		this.__mainContainer = null;
		this.__routeContainer = null;
		this.__registeredController = null;
		this.__mapController = {};
		this.__mapPath = {};
		this.__mapIncludes = {};
		this.__nsEvent = null;
		
		this.__routeHandlerRef = null;
		this.__initialize();
	};
	
	NSMvc.prototype.__initialize = function()
	{
		if(this.__setting)
		{
			this.__nsEvent = new NSEvent();
			this.__registeredController = {};
			this.__mainContainer = this.__setting["mainContainer"] ? this.util.getElement(this.__setting["mainContainer"]) : null;
			if(!this.__mainContainer)
			{
				this.__mainContainer = (document.querySelector("[data-ns-container]") || document.querySelector("[ns-container]"));
			}
			this.__routeContainer = this.__setting["routeContainer"] ? this.util.getElement(this.__setting["routeContainer"]) : null;
			if(!this.__routeContainer)
			{
				this.__routeContainer = (document.querySelector("[data-ns-route-container]") || document.querySelector("[ns-route-container]"));
			}
			if(this.__arrRoute && this.__arrRoute.length > 0)
			{
				this.__routeHandlerRef = this.__routeHandler.bind(this);
				var item = {};
				var length = this.__arrRoute.length;
				for(var count = 0;count < length;count++)
				{
					item = this.__arrRoute[count];
					item["handler"] = this.__routeHandlerRef;
				}
			}
			var ajaxEventHandler = this.__ajaxEventHandler.bind(this);
			this.util.addEvent(window,NSAjax.REQUEST_STARTED,ajaxEventHandler);
			this.util.addEvent(window,NSAjax.ALL_REQUEST_COMPLETED,ajaxEventHandler);
			var routeEventHandler = this.__routeEventHandler.bind(this);
			this.util.addEvent(window,NSRouter.NavigationStart,routeEventHandler);
			this.util.addEvent(window,NSRouter.NavigationEnd,routeEventHandler);
			this.util.addEvent(window,NSRouter.NavigationCancel,routeEventHandler);
		}
	};

	NSMvc.prototype.process = function()
	{
		if(this.__setting)
		{
			var self = this;
			var initRouter = function()
			{
				self.__router = new NSRouter(self.__arrRoute, self.__setting);
			};
			if(this.__mainContainer && this.__setting["mainController"])
			{
				this.__processController.call(this,"__mainContainer",this.__setting["mainController"],this.__mainContainer,initRouter);
			}
			else
			{
				initRouter();
			}
		}
	};
	
	NSMvc.prototype.addController = function(name,callback)
	{
		if(name && callback && this.util.isFunction(callback))
		{
			this.__registeredController[name] = callback;
		}
	};

	NSMvc.prototype.addRoute = function(item)
	{
		if(item)
		{
			item["handler"] = this.__routeHandlerRef;
			this.__router.addRoute(item);
		}
	};

	NSMvc.prototype.removeRoute = function(param) 
	{
		this.__router.removeRoute(param);
	};

	NSMvc.prototype.reset = function()
	{
		this.__router.reset();
	};

	NSMvc.prototype.getCurrentRoute = function() 
	{
		return this.__router.getCurrentRoute();
	};

	NSMvc.prototype.callRoute = function(route)
	{
		this.__router.callRoute(route);
	};

	NSMvc.prototype.routeTo = function(route) 
	{
		this.__router.routeTo(route);
	};

	NSMvc.prototype.__routeHandler = function(item) 
	{
		if(item)
		{
			var self = this;
			var route = item["route"];
			var childElement = null;
			var process = function()
			{
				self.__routeContainer.innerHTML = "";
				if(childElement)
				{
					childElement.style.display = "none";
					self.__routeContainer.appendChild(childElement);
				}
				self.__processController.call(self,route,item["controller"],childElement);
				self.__nsEvent.dispatch(NSMvc.ROUTE_CHANGED,item);
			};
			if(this.__routeContainer)
			{
				if(item["templateUrl"])
				{
					var templateLoadHandler = function(templateText)
					{
						if(templateText)
						{
							childElement = self.__getElementFromText(templateText);
							process();
						}
						else
						{
							console.error(item["templateUrl"] + " was not loaded.Please check the URL");
						}
					};
					var templateErrorHandler = function(errorText)
					{
						console.error(item["templateUrl"] + " was not loaded.Please check the URL");
					};
					this.util.getTemplateFromURL(item["templateUrl"],templateLoadHandler,templateErrorHandler);
				}
				if(item["templateId"])
				{
					var template = this.util.getTemplate(item["templateId"]);
					if(template)
					{
						childElement = template.cloneNode(true);
						process();
					}
					else
					{
						console.error(item["templateId"] + " was not loaded.Please check the URL");
					}
				}
				else if(item["template"])
				{
					childElement = this.__getElementFromText(item["template"]);
					process();
				}
			}
		}
	};
	
	NSMvc.prototype.__getElementMap = function(element,arrController,level,parentID,callback)
	{
		if(element && element.querySelectorAll)
		{
			var arrInclude = element.querySelectorAll("ns-include");
			if(arrInclude && arrInclude.length > 0)
			{
				for(var index = 0;index < arrInclude.length;index++)
				{
					var nsInclude = arrInclude[index];
					var url = nsInclude.getAttribute("url");
					var uid = this.__generateUUID();
					var item = {url: url,nsInclude: nsInclude,parent: element,parentID: parentID,level: level,status: "pending",uid: uid};
					this.__mapIncludes[uid] = item;
					if(this.__mapPath[url])
					{
						var childElement = this.__mapPath[url];
						this.__processAfterElement(item,childElement,arrController,callback);
						this.__getElementMap(childElement,arrController,level + 1,uid,callback);
					}
				}
			}
			else if(level == 0)
			{
				callback ? callback() : null;
				return;
			}
			this.__processMap(arrController,callback);
		}
	};
	
	NSMvc.prototype.__processMap = function(arrController,callback)
	{
		for(var key in this.__mapIncludes)
		{
			var item = this.__mapIncludes[key];
			this.__processInclude(item,arrController,callback);
		}
	};
	
	NSMvc.prototype.__processInclude = function(item,arrController,callback)
	{
		var self = this;
		if(item.status == "pending")
		{
			item.status = "processing";
			self.util.getTemplateFromURL(item.url,function(templateText)
			{
				if(templateText)
				{
					var childElement = self.__getElementFromText(templateText);
					self.__processAfterElement.call(self,item,childElement,arrController,callback);
				}
				else
				{
					console.warn(url + " was not loaded.Please check the URL");
					self.__processAfterElement.call(self,item,null,arrController,callback);
				}
			},function(errorText){
				console.warn(url + " was not loaded with details " + errorText);
				self.__processAfterElement.call(self,item,null,arrController,callback);
			});
		}
	};
	
	NSMvc.prototype.__processAfterElement = function(item,childElement,arrController,callback)
	{
		if(childElement)
		{
			if(!this.__mapPath[item.url])
			{
				this.__mapPath[item.url] = childElement;
			}
			childElement = childElement.cloneNode(true);
			if(item.nsInclude.parentElement)
			{
				item.nsInclude.parentElement.replaceChild(childElement,item.nsInclude);
			}
			item.element = childElement;
			var controllerName = item.nsInclude.getAttribute("controller");
			var controller = null;
			if(controllerName)
			{
				controller = this.__registeredController[controllerName];
				arrController.push({controller: controller,uid: item.uid});
			}
			this.__getElementMap(childElement,arrController,item.level + 1,item.uid,callback);
		}
		else
		{
			item.parent.removeChild(item.nsInclude);
		}
		item.status = "completed";
		if(this.__isAllIncludesProcessed())
		{
			callback();
		}
	};
	
	NSMvc.prototype.__isAllIncludesProcessed = function()
	{
		for(var key in this.__mapIncludes)
		{
			var item = this.__mapIncludes[key];
			if(item.status != "completed")
			{
				return false;
			}
		}
		return true;
	};

	NSMvc.prototype.__processController = function(controllerName,controller,childElement,callback)
	{
		var interval = null;
		var process = function()
		{
			if(!self.__mapController[controllerName] && controller)
			{
				var uid = self.__generateUUID();
				self.__mapController[controllerName] = new NSController({controller: controller,uid: uid,event: self.__nsEvent}); 
			}
			if(self.__mapController[controllerName])
			{
				self.__mapController[controllerName].addChildCallbacks(arrCallbacks);
				self.__mapController[controllerName].process(childElement);
			}
			if(callback)
			{
				callback();
			}
		};
		var checkIfElementAdded = function()
		{
			interval = setInterval(function(){
				if(childElement.parentElement)
				{
					clearInterval(interval);
					interval = null;
					process();
				}
			}, 300);
		};
		var self = this;
		if(self.util.isString(controller))
		{
			controller = self.__registeredController[controller];
		}
		this.__mapIncludes = {};
		var arrCallbacks = [];
		this.__getElementMap(childElement,arrCallbacks,0,null,checkIfElementAdded);
		//this.__processElement(childElement,arrCallbacks,0,
	};
	
	NSMvc.prototype.__ajaxEventHandler = function(event)
	{
		if(event.type == NSAjax.REQUEST_STARTED)
		{
			this.__nsEvent.dispatch(NSMvc.AJAX_START,NSMvc.AJAX_START);
		}
		else if(event.type == NSAjax.ALL_REQUEST_COMPLETED)
		{
			this.__nsEvent.dispatch(NSMvc.AJAX_DONE,NSMvc.AJAX_DONE);
		}
	};
	
	NSMvc.prototype.__routeEventHandler = function(event)
	{
		if(event.type == NSRouter.NavigationStart)
		{
			var retValue = this.__nsEvent.dispatch(NSMvc.ROUTE_START,event.route);
			if(!retValue)
			{
				event.preventDefault();
			}
			return retValue;
		}
		else if(event.type == NSRouter.NavigationEnd)
		{
			this.__nsEvent.dispatch(NSMvc.ROUTE_END,event.route);
		}
		else if(event.type == NSRouter.NavigationCancelled)
		{
			this.__nsEvent.dispatch(NSMvc.ROUTE_CANCELLED,event.route);
		}
		return true;
	};

	NSMvc.prototype.__getElementFromText = function(htmlText)
	{
		if(htmlText)
		{
			var div = document.createElement("div");
			div.innerHTML = htmlText;
			if(div["childNodes"] && div["childNodes"].length > 1)
			{
				return div;
			}
			return div.firstChild;
		}
		return null;
	};
	
	//https://jsfiddle.net/xg7tek9j/460/
	NSMvc.prototype.__generateUUID = function() 
	{
	    var d = new Date().getTime();
	    if(Date.now)
	    {
	        d = Date.now(); 
	    }
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	};
	
	NSMvc.ROUTE_CHANGED = "routeChanged";
	NSMvc.AJAX_START = "ajaxStart";
	NSMvc.AJAX_DONE = "ajaxDone";
	NSMvc.ROUTE_START = "routeStart";
	NSMvc.ROUTE_END = "routeEnd";
	NSMvc.ROUTE_CANCELLED = "routeCancelled";
	
	return NSMvc;
})();
nsModuleExport(__nsGlobal,"NSMvc",NSMvc);