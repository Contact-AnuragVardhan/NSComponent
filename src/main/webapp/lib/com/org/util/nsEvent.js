"use strict";
var NSEvent = (function()
{
	function NSEvent() 
	{
		var self = this;
		var objEvents = {};
		
		var addListener  = function(event, callback)
		{
			if (typeof callback !== 'function') 
			{
		        console.error("The listener callback must be a function");
		        return false;
		    }
			if (typeof event !== 'string') 
			{
		        console.error("The event name must be a string");
		        return false;
		    }
			if (!objEvents[event]) 
			{
				objEvents[event] = {listeners: []};
		    }
			objEvents[event].listeners.push(callback);
			return true;
		};
		
		var removeListener = function(event, callback)
		{
			if (!objEvents[event]) 
			{
		        console.error("The event: " + event + " does not exist");
		        return false;
		    }
			var filter = function(listener)
			{
				return listener.toString() !== callback.toString(); 
			};
			objEvents[event].listeners = objEvents[event].listeners.filter(filter);
			return true;
		};
		
		var hasListener = function(event, callback)
		{
			if (!objEvents[event]) 
			{
		        return false;
		    }
			var filter = function(listener)
			{
				return listener.toString() == callback.toString(); 
			};
			var tempListener = objEvents[event].listeners.filter(filter);
			return !(!tempListener); 
		};
		
		var dispatch = function(event, details)
		{
			var retValue = true;
			if (objEvents[event]) 
			{
				for(var index = 0;index < objEvents[event].listeners.length;index++)
				{
					var listener = objEvents[event].listeners[index];
					retValue = listener({type: event,details: details},details);
					if(retValue !== undefined && retValue !== null && retValue == false)
					{
						return false;
					}
				}
		    }
			else
			{
				console.log("The event: " + event + " does not exist");
			}
			return true;
		};
		
		self.addListener = addListener;
		self.removeListener = removeListener;
		self.hasListener = hasListener;
		self.dispatch = dispatch;
	};
	
	return NSEvent;
})();
nsModuleExport(__nsGlobal,"NSEvent",NSEvent);