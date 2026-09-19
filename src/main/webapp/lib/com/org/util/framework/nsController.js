"use strict";
var NSController = (function()
{
	function NSController(item) 
	{
		var self = this;
		var element = null;
		var model = null;
		var util = null;
		var nsBind = null;
		var childController = [];
		
		var initialize = function()
		{
			model = {};
			util = new NSModel(item.event);
		};
		
		var addChildCallbacks = function(arrCallback)
		{
			if(arrCallback)
			{
				childController = arrCallback;
			}
		};
		
		var process = function(argElement)
		{
			element = argElement;
			if(element && item && item.controller)
			{
				item.controller(model,util,item.uid);
				if(childController && childController.length > 0)
				{
					for(var index = 0;index < childController.length;index++)
					{
						var itemChild = childController[index];
						if(itemChild && itemChild.controller)
						{
							itemChild.controller(model,util,itemChild.uid);
						}
					}
				}
				if(model)
				{
					for(var key in model)
					{
						if(typeof model[key] === "function")
						{
							injectFunction(model,key,model);
						}
					}
				}
				//if(!nsBind)
				//{
				nsBind = new NSBinding(element,model);
				//}
				element.style.display = "";
			}
		};
		
		var injectFunction = function(model,key,context)
		{
			if(model[key])
			{
				model[key] = (function() 
				{
				    var cachedFunction = model[key];
				    return function() 
				    {
				    	preFunctionCall(cachedFunction,arguments);
				    	var retValue = cachedFunction.apply(context,arguments);
				        postFunctionCall(cachedFunction,arguments);
				        return retValue;
				    };
				}());
			}
		};
		
		var preFunctionCall = function(funct,funcArguments)
		{
			console.debug("starting ...");
			console.debug(funct.toString);
		};
		
		var postFunctionCall = function(funct,funcArguments)
		{
			console.debug("ending ...");
			console.debug(funct.toString);
		};
		
		initialize();
		
		self.addChildCallbacks = addChildCallbacks;
		self.process = process;
	};
	
	return NSController;
})();
nsModuleExport(__nsGlobal,"NSController",NSController);