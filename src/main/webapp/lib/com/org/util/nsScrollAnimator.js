"use strict";
var NSScrollAnimator = (function()
{
	function NSScrollAnimator(config) 
	{
		var self = this;
		var setting = {};
		
		var util = null;
		var stopScroll = false;
		var start = 0;
		var startTime = 0;
		var destinationOffsetToScroll = 0;
		var animationFunction = {};
		var props = {};
		var propItem = {};
		var interval = null;
		
		var initialize = function()
		{
			if(!config)
			{
				config = {};
			}
			util = new NSUtil();
			initAnimationFunc();
			setting = {
				element: config["element"] || window,
				direction: config["direction"] || "vertical",
				duration: !util.isUndefinedOrNull(config["duration"]) ? parseInt(config["duration"]) : 500,
				easing: config["easing"] || "easeInOutQuad",
				callback: config["callback"] || null,
			};
			if(setting.element === window)
			{
				setting.refElement = document.documentElement;
			}
			else 
			{
				setting.refElement = setting.element;
			}
			props = { vertical:{scroll: "scrollTop", scrollSize: "scrollHeight",client: "clientHeight",offset: "offsetHeight",inner: "innerHeight",offsetPos: "offsetTop",},
					  horizontal:{scroll: "scrollLeft", scrollSize: "scrollWidth",client: "clientWidth",offset: "offsetWidth",inner: "innerWidth",offsetPos: "offsetLeft",}
			};
			propItem = props[setting.direction];
		};
		
		var scrollTo = function(newPos)
		{
			if(!util.isUndefinedOrNull(newPos))
			{
				start = setting.refElement[propItem.scroll];
				startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
				var outerSize = Math.max(setting.refElement[propItem.scrollSize], setting.refElement[propItem.offset], setting.refElement[propItem.offset]);
				var innerSize = setting.refElement[propItem.inner] || setting.refElement[propItem.offset];
				var destinationOffset = typeof newPos === 'number' ? newPos : newPos[propItem.offsetPos];
				destinationOffsetToScroll = Math.round(outerSize - destinationOffset < innerSize ? outerSize - innerSize : destinationOffset);
				animateScroll();
			}
		};
		
		var getMaxScrollPos = function()
		{
			return setting.refElement[propItem.scrollSize] - setting.refElement[propItem.client];
		};
		
		var getScrollPos = function()
		{
			return setting.refElement[propItem.scroll];
		};
		
		var stop = function()
		{
			stopScroll = true;
		};
		
		var animateScroll = function() 
		{
           if (!stopScroll) 
           {
        	   var now = 'now' in window.performance ? performance.now() : new Date().getTime();
        	   var time = Math.min(1, ((now - startTime) / setting.duration));
        	   var timeFunction = animationFunction[setting.easing](time);
        	   var val = Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start);
               setting.refElement[propItem.scroll] = val;
               if (setting.refElement[propItem.scroll] === destinationOffsetToScroll) 
               {
            	   if(setting.callback)
                   {
                	   setting.callback();
                   }
            	   return;
               }
               interval = util.getRequestAnimationFrame.bind(window)(animateScroll);
           }
           else
           {
        	   util.getCancelAnimationFrame.bind(window)(interval);
        	   setting.refElement[propItem.scroll] = destinationOffsetToScroll;
        	   if(setting.callback)
        	   {
        		   setting.callback();
        	   }
           }
       };
       
       var initAnimationFunc = function()
       {
    	   animationFunction = {
				    linear: function(t) {
				      return t;
				    },
				    easeInQuad: function(t) {
				      return t * t;
				    },
				    easeOutQuad: function(t) {
				      return t * (2 - t);
				    },
				    easeInOutQuad: function(t) {
				      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
				    },
				    easeInCubic: function(t) {
				      return t * t * t;
				    },
				    easeOutCubic: function(t) {
				      return (--t) * t * t + 1;
				    },
				    easeInOutCubic: function(t) {
				      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
				    },
				    easeInQuart: function(t) {
				      return t * t * t * t;
				    },
				    easeOutQuart: function(t) {
				      return 1 - (--t) * t * t * t;
				    },
				    easeInOutQuart: function(t) {
				      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
				    },
				    easeInQuint: function(t) {
				      return t * t * t * t * t;
				    },
				    easeOutQuint: function(t) {
				      return 1 + (--t) * t * t * t * t;
				    },
				    easeInOutQuint: function(t) {
				      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
				    }
			};

       };
       
       self.scrollTo = scrollTo;
       self.getScrollPos = getScrollPos;
       self.getMaxScrollPos = getMaxScrollPos;
       self.stop = stop;
		
		initialize();
	};
	return NSScrollAnimator;
})();
nsModuleExport(__nsGlobal,"NSScrollAnimator",NSScrollAnimator);