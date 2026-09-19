"use strict";
var NSModel = (function()
{
	function NSModel(nsEvent) 
	{
		var self = this;
		var ajax = null; 
		
		var initialize = function()
		{
			ajax = new NSAjax();
		};
		
		var addEventListener  = function(event,callback)
		{
			return nsEvent.addListener(event,callback);
		};
		
		var removeEventListener = function(event,callback)
		{
			return nsEvent.removeListener(event,callback);
		};
		
		var hasEventListener = function(event,callback)
		{
			return nsEvent.hasListener(event,callback);
		};
		
		var dispatchEvent = function(event,details)
		{
			return nsEvent.dispatch(event,details);
		}; 
		
		initialize();
		
		self.addEventListener = addEventListener;
		self.removeEventListener = removeEventListener;
		self.hasEventListener = hasEventListener;
		self.dispatchEvent = dispatchEvent;
		self.ajax = ajax;
	};
	
	return NSModel;
})();
nsModuleExport(__nsGlobal,"NSModel",NSModel);