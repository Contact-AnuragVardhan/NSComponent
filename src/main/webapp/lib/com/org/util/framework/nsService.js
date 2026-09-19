"use strict";
var NSService = (function()
{
	function NSService(callback) 
	{
		this.__callback = callback;
		this.__ajax = null;
		this.__initialize();
		return this.__callback;
	};
	
	NSService.prototype.__initialize = function()
	{
		if(!this.__ajax)
		{
			this.__ajax = new this.nsAjax();
		}
		if(this.__callback)
		{
			this.__callback = new this.__callback();
			this.__callback["ajax"] = this.__ajax;
		}
	};
	
	NSService.prototype.nsAjax = function()
	{
		var self = this;
		this.__getRequest = function() 
		{
			if (window.ActiveXObject)
			{
				return new ActiveXObject('Microsoft.XMLHTTP');
			}
			else if (window.XMLHttpRequest)
			{
				return new XMLHttpRequest();
			}
			return false;
		};
		
		this.__getParam = function(data)
		{
			var strParam = "";
			var param = data;
			for(var paramKey in param)
			{
				if(param[paramKey])
				{
					strParam += "&" + paramKey + "=" + param[paramKey];
				}
			}
			if(strParam && strParam.length > 1)
			{
				strParam = strParam.substring(1);
			}
			return strParam;
		};
		
		this.__defaultSuccessHandler = function(successHandler,request)
		{
			if(successHandler)
			{
				var responseData = request.responseText;
	            var responseJson = responseData ? JSON.parse(responseData) : responseData;
				successHandler(responseJson);
			}
		};
		
		this.__defaultErrorHandler = function(errorHandler,request)
		{
			if(errorHandler)
			{
				errorHandler(request);
			}
		};
		
		this.processRequest = function(methodType,url,data)
		{
			var objPromise = new Promise(function(resolve,reject)
			{
				var request = self.__getRequest();
				if(request) 
				{
					var strParam = null;
					if (methodType.toUpperCase() === "POST") 
					{
						request.open("POST",url, true);
						request.setRequestHeader("Content-Type", "application/json");
						//request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
						if(data)
						{
							strParam = JSON.stringify(data);
						}
					} 
					else 
					{
						strParam = self.__getParam(data);
						if(strParam && strParam != "")
						{
							url += "?" + strParam;
							//so that send method sends as null for GET
							strParam = null;
						}
						request.open("GET",url, true);
					}
					request.onreadystatechange = function()
			        {
			           if (request.readyState === 4)
			           {
			              if (request.status === 200)
			              {
			                 self.__defaultSuccessHandler(resolve,request);
			              } 
			              else 
			              {
			            	  self.__defaultErrorHandler(reject,request);
			              }
			           }
			           else 
			           {
			              console.log("request processing going on");
			           }
				    };
					//request.responseType = "JSON";
					request.send(strParam);
				}
	   		});
	   		return objPromise;
		}; 		
		this.post = function(url,data)
		{
			return self.processRequest("POST",url,data);
		};
		this.get = function(url,data)
		{
			return self.processRequest("GET",url,data);
		};
	};
	
	return NSService;
})();
nsModuleExport(__nsGlobal,"NSService",NSService);