"use strict";
var NSCarousel = (function()
{
	function NSCarousel(setting) 
	{
		var config = null;
		var self = this;
		var util = null;
		
		var win = null;
		var doc = null;
		var deviceSupport = null;
		var objSetUp = {};
		var events  = {};
		
		
        var initialize = function()
    	{
    		util = new NSUtil();
    		var obj = util.getDomVariables();
    		win = obj.win;
    		doc = obj.doc;
    		deviceSupport = util.getSupportedEvents();
    		if(!setting)
    		{
    			setting = {};
    		}
    		config = {
    				context: setting["context"] || win,
    				element: setting["element"],
    				startSlide: parseInt(setting["startSlide"], 10) || 0,
    				visibleSlides: parseInt(setting["visibleSlides"], 10) || 1,
    				enableTouch: util.isUndefinedOrNull(setting["enableTouch"]) ? true : Boolean.parse(setting["enableTouch"]),
    				enableVertical: Boolean.parse(setting["enableVertical"]),
    				enableAutoPlay: Boolean.parse(setting["enableAutoPlay"]),
    				// values between 0 and 1, where 1 means you have to drag to the center of the slide (a value of 1 equals the ios behaviour)
    				minDistanceBeforeSlide: setting["minDistanceBeforeSlide"] || 0.5,               
    				interval: setting["interval"] || 300,
    				allowedSwipeTime: setting["allowedSwipeTime"] || 300,// maximum time allowed to travel that distance
    				threshold: setting["threshold"] || 0,//required min distance traveled to be considered swipe
    				spaceBetween: util.isUndefinedOrNull(setting["spaceBetween"]) ? 0 : setting["spaceBetween"],
    				postionBuffer: util.isUndefinedOrNull(setting["postionBuffer"]) ? 0 : setting["postionBuffer"],		
    				animationType: setting["animationType"] || 'ease-out',
    				enableTouchResistance: util.isUndefinedOrNull(setting["enableTouchResistance"]) ? true : Boolean.parse(setting["enableTouchResistance"]),
    				touchResistanceRatio:setting["touchResistanceRatio"] || 0.85,
    				enablePageNavigation: Boolean.parse(setting["enablePageNavigation"]),
    				enableDirectionNavigation: Boolean.parse(setting["enableDirectionNavigation"]),
    				directionNavigation : setting["directionNavigation"] || {previous: null,next: null},
    				enable3DAnimation: Boolean.parse(setting["enable3DAnimation"]),
    				beforeSlideCallback: (setting["beforeSlideCallback"] ? util.getFunction(setting["beforeSlideCallback"]) : null),
    				afterSlideCallback: (setting["afterSlideCallback"] ? util.getFunction(setting["afterSlideCallback"]) : null),
    				pageRendererCallback: (setting["pageRendererCallback"] ? util.getFunction(setting["pageRendererCallback"]) : null),
    				previousRendererCallback: (setting["previousRendererCallback"] ? util.getFunction(setting["previousRendererCallback"]) : null),
    				nextRendererCallback: (setting["nextRendererCallback"] ? util.getFunction(setting["nextRendererCallback"]) : null)
    		};
    		if(!config.element)
    		{
    			util.throwNSError("NSCarousel","Element in setting is missing");
    		}
    		if(!setting.customClass)
    		{
    			setting.customClass = {};
    		}
    		config.customClass = {container:setting.customClass["container"],previous:setting.customClass["previous"],next:setting.customClass["next"],page:setting.customClass["page"],pageActive:setting.customClass["pageActive"]};

    		createComp();
    	};
    	
    	var createComp = function()
    	{
    		if(!objSetUp.container)
    		{
    			objSetUp.container = util.createDiv(null,"nsCarousel");
    			applyCustomClass(objSetUp.container,"container");
    			var parentElement = config.element.parentElement;
    			parentElement.insertBefore(objSetUp.container,config.element);
    			objSetUp.container.appendChild(config.element);
    			util.addStyleClass(config.element,"nsCarouselSlideContainer");
    			//container.style.visibility = "hidden";
    			setUp();
    			addEventListeners();
    			createPageNavigation();
    			createDirectionNavigation();
    			setActivePage();
    			startAutoPlay();
    			/*if (config.enableContinuous) 
    			{
    				moveSlide(getSlideDesiredIndex(config.startSlide - 1), (-1 * objSetUp.containerWidth), 0);
    				moveSlide(getSlideDesiredIndex(config.startSlide + 1), objSetUp.containerWidth, 0);
    			}*/
    			//container.style.visibility = "visible";
    		}
    	};
    	
    	var setUp = function()
    	{
    		setUpVars();
			//config.element.style[objSetUp.dimensionName] = (objSetUp.dimension * objSetUp.numPages) + "px";
			setUpSlides();
			events  = { start: deviceSupport.touch ? 'touchstart' : deviceSupport.pointerEvents ? 'pointerdown' : 'mousedown',
	    			move:  deviceSupport.touch ? 'touchmove'  : deviceSupport.pointerEvents ? 'pointermove' : 'mousemove',
	    			end:   deviceSupport.touch ? 'touchend touchcancel touchleave' : deviceSupport.pointerEvents ? 'pointerup pointerout pointerleave pointercancel' : 'mouseup mouseout mouseleave',
			  	  };
			util.addStyleClass(objSetUp.container,"nsCarousel" + (objSetUp.isVertical ? "Vertical" : "Horizontal"));
    	};
    	
    	var setUpVars = function()
    	{
    		objSetUp.isVertical = config.enableVertical;
    		objSetUp.slides = config.element.children;
    		objSetUp.numPages = Math.ceil(objSetUp.slides.length / config.visibleSlides);
    		objSetUp.previousPage = null;
    		objSetUp.currentPage = getSlideDesiredIndex(config.startSlide);
    		objSetUp.dimensionName = objSetUp.isVertical ? "height" : "width";
    		objSetUp.dimension = objSetUp.container.getBoundingClientRect()[objSetUp.dimensionName];
    		var padding = 0;
    		if(objSetUp.isVertical)
    		{
    			padding = parseInt(util.getStyleValue(objSetUp.container,'padding-top',true),10) + parseInt(util.getStyleValue(objSetUp.container,'padding-bottom',true),10);
    		}
    		else
    		{
    			padding = parseInt(util.getStyleValue(objSetUp.container,'padding-left',true),10) + parseInt(util.getStyleValue(objSetUp.container,'padding-right',true),10);
    		}
    		objSetUp.dimension = objSetUp.dimension - padding;
    		objSetUp.padding = padding;
    		objSetUp.marginName = objSetUp.isVertical ? "Bottom" : "Right";
    		objSetUp.minDistanceBeforeSlide = config.minDistanceBeforeSlide * (objSetUp.dimension / 2);
    		var spaceBetween = config.spaceBetween;
    		if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) 
    		{
    			spaceBetween = (parseFloat(spaceBetween.replace('%', '')) / 100) * objSetUp.dimension;
    		}
    		objSetUp.spaceBetween = spaceBetween;
    		objSetUp.snapGrid = [];
    		objSetUp.slidesGrid = [];
    		objSetUp.touch = {};
    		objSetUp.isAnimating = false;
    	};
    	
    	var setUpSlides = function()
    	{
    		var index = 0;
    		var slidePosition = 0;
    		var length = objSetUp.slides.length;
    	    while(length--) 
    	    {
    	    	var slide = objSetUp.slides[length];
    	    	util.addStyleClass(slide,"nsCarouselSlide");
    	    	var slideSize = (objSetUp.dimension - ((config.visibleSlides - 1) * objSetUp.spaceBetween)) / config.visibleSlides;
    	    	slide.style[objSetUp.dimensionName] = slideSize + "px";
    	    	objSetUp.slideSize = slideSize;
    	    	slide.style["margin" + objSetUp.marginName] = objSetUp.spaceBetween + "px";
    	    	slide.setAttribute("data-ns-index", length);
    	    	if (index % config.visibleSlides === 0) 
    	    	{ 
    	    		objSetUp.snapGrid.push(slidePosition); 
    	    	}
    	    	objSetUp.slidesGrid.push(slidePosition);
    	        slidePosition = slidePosition + slideSize + objSetUp.spaceBetween;
    	    	//move(0,0);
    	    	index++;
    	    }
    	};
    	
    	var addEventListeners = function()
    	{
    		if(config.enableTouch)
    		{
    			util.addEvent(config.element,events.start,startHandler);
        		//util.addEvent(config.element,events.move,moveHandler);
        		//util.addEvent(config.element,events.end,endHandler);
    		}
    		util.addEvent(config.context,"resize",resize);
    	};
    	
    	var startHandler = function(event)
    	{
    		event = util.getEvent(event);
    		objSetUp.touch.isTouchEvent = (event.type === 'touchstart');
    	    if ((!objSetUp.touch.isTouchEvent && 'which' in event && event.which === 3) ||
    	    		(objSetUp.touch.isTouchEvent && 'button' in event && event.button > 0)) 
    	    { 
    	    	return; 
    	    }
    	    util.addEvent(config.element,events.move,moveHandler);
    		util.addEvent(config.element,events.end,endHandler);
    		objSetUp.touch.start = getCoord(event);
    		objSetUp.touch.touchStartTime = new Date().getTime();
    		delete objSetUp.isScroll;
    		if(!deviceSupport.touch)
    		{
    			event.preventDefault();
    		}
    	};
    	
    	var moveHandler = function(event)
    	{
    		if(objSetUp.touch.start)
    		{
    			event = util.getEvent(event);
    			event.preventDefault();
    			objSetUp.touch.end = getCoord(event);
    		    var diffX = objSetUp.touch.end.x - objSetUp.touch.start.x;
        	    var diffY = objSetUp.touch.end.y - objSetUp.touch.start.y;
        	    var diff = objSetUp.isVertical ? diffY : diffX;
        	    objSetUp.touch.diff = diff;
        	    var swipeDirection = diff > 0 ? 'prev' : 'next';
        	    var prop = objSetUp.isVertical ? "y" : "x";
        	    objSetUp.touch.startTranslate = getTranslate(config.element,prop);
        	    objSetUp.touch.currentTranslate = diff + objSetUp.touch.startTranslate;
        	    console.log( objSetUp.touch.startTranslate + " == " +   objSetUp.touch.currentTranslate);
        	    var disableParentSwiper = true;
        	    if ((diff > 0 && objSetUp.touch.currentTranslate > minTranslate())) 
        	    {
        	        disableParentSwiper = false;
        	        if (config.enableTouchResistance) 
        	        { 
        	        	objSetUp.touch.currentTranslate = (minTranslate() - 1) + (Math.pow((-1 * minTranslate() + objSetUp.touch.startTranslate + diff), config.touchResistanceRatio)); 
        	        }
        	    } 
        	    else if (diff < 0 && objSetUp.touch.currentTranslate < maxTranslate()) 
        	    {
        	        disableParentSwiper = false;
        	        if (config.enableTouchResistance) 
        	        {
        	        	objSetUp.touch.currentTranslate = (maxTranslate() + 1) + (Math.pow((maxTranslate() - objSetUp.touch.startTranslate - diff), config.touchResistanceRatio));
        	        }
        	    }
        	    console.log( objSetUp.touch.startTranslate + " == " +   objSetUp.touch.currentTranslate);
        	    if (disableParentSwiper) 
        	    {
        	        event.preventedByNestedSwiper = true;
        	    }
        	    if (config.threshold > 0) 
        	    {
        	        if (Math.abs(diff) > config.threshold) 
        	        {
        	        	objSetUp.touch.start = objSetUp.touch.end;
        	            objSetUp.touch.currentTranslate = objSetUp.touch.startTranslate;
        	            diffX = objSetUp.touch.end.x - objSetUp.touch.start.x;
                	    diffY = objSetUp.touch.end.y - objSetUp.touch.start.y;
                	    diff = objSetUp.isVertical ? diffY : diffX;
                	    objSetUp.touch.diff = diff;
        	            return;
        	        }
        	        else 
            	    {
        	        	objSetUp.touch.currentTranslate = objSetUp.touch.startTranslate;
    	    	        return;
            	    }
        	    }
        	    setTranslate(config.element,objSetUp.touch.currentTranslate,true);
    		}
    	};
    	
    	var endHandler = function(event)
    	{
    		event = util.getEvent(event);
    		util.removeEvent(config.element,events.move,moveHandler);
    		util.removeEvent(config.element,events.end,endHandler);
    		if (!objSetUp.isScroll) 
    		{
    			var stopIndex = 0;
    		    var groupSize = objSetUp.slideSize;
    		    var currentPos = objSetUp.currentPos;
    		    for (var i = 0; i < objSetUp.slidesGrid.length; i += config.visibleSlides) 
    		    {
    		    	if (typeof objSetUp.slidesGrid[i + config.visibleSlides] !== 'undefined') 
    		    	{
    		    		if (currentPos >= objSetUp.slidesGrid[i] && currentPos < objSetUp.slidesGrid[i + config.visibleSlides]) 
    		    		{
    		    			stopIndex = i;
    		    			groupSize = objSetUp.slidesGrid[i + config.visibleSlides] - objSetUp.slidesGrid[i];
    		    		}
    		    	} 
    		    	else if (currentPos >= objSetUp.slidesGrid[i]) 
    		    	{
    		    		stopIndex = i;
    		    		groupSize = objSetUp.slidesGrid[objSetUp.slidesGrid.length - 1] - objSetUp.slidesGrid[objSetUp.slidesGrid.length - 2];
    		    	}
    		    }
    		    var pageIndex = Math.floor(stopIndex / config.visibleSlides);
        	    var elapsedTime = new Date().getTime() - objSetUp.touch.touchStartTime;
        	    if(elapsedTime <= config.allowedSwipeTime)
        	    {
        	    	if(Math.abs(objSetUp.touch.diff) >= config.threshold)
        	    	{
        	    		objSetUp.touch.swipeDirection = objSetUp.touch.diff < 0 ? 'next' : (objSetUp.touch.diff > 0 ? 'prev' : 'reset') ;
        	    		if(objSetUp.touch.swipeDirection === 'next') 
    	    		    {
    	    		    	setPage(pageIndex + 1);
    	    		    }
    	    		    else if (objSetUp.touch.swipeDirection === 'prev') 
    	    		    {
    	    		    	setPage(pageIndex - 1);
    	    		    }
    	    		    else
    	    		    {
    	    		    	setPage(pageIndex);
    	    		    }
        	    	}
        	    }
    		    
    		}
    		objSetUp.touch = {};
    		event.preventDefault();
    	};
    	
    	var setTranslate = function(element,translate,isTouch)
    	{
    		var animationStyle = getAnimationStyle(translate,isTouch);
     	    var transforms = "";
     		for (var key in animationStyle)
     		{
     			transforms += key + '(' + animationStyle[key] + ') ';
     		}
     	    var elStyle = element.style;
     	    elStyle.webkitTransform = transforms;
     	    elStyle.transform = transforms;
    	};
    	
    	var minTranslate = function() 
    	{
    	    return (-1 * objSetUp.snapGrid[0]);
    	};

    	var maxTranslate = function() 
    	{
    	    return (-1 * objSetUp.snapGrid[objSetUp.snapGrid.length - 1]);
    	};
    	
    	var getCoord = function(event) 
    	{
    	    var eve = deviceSupport.touch ? (event.targetTouches[0] || event.changedTouches[0]) : event;
    	    return {x: eve.pageX,y: eve.pageY };
    	};
    	  
    	var getDistance = function(isVertical) 
    	{
    	    var prop = isVertical ? "y" : "x";
    	    var retValue = 0;
    	    try 
    	    { 
    	    	retValue = objSetUp.touch.end[prop] - objSetUp.touch.start[prop];
    	    } 
    	    catch(error) 
    	    {
    	    	return 0;
    	    }
    	    return retValue;
    	};
    	
    	var move = function(distance,duration,callback) 
    	{
    		var callBackWrapper = function()
    		{
    			if(callback)
    			{
    				callback();
    			}
    			if(config.afterSlideCallback)
    			{
    				config.afterSlideCallback(objSetUp.currentPage,objSetUp.previousPage);
    			}
    		};
    		var isTouch = (objSetUp.touch && objSetUp.touch.isTouchEvent);
    		var animationStyle = getAnimationStyle(null,isTouch);
    		//animate(config.element,animationStyle,{ duration: config.interval, easing:config.animationType,complete: callback });
    		animate(config.element,animationStyle,config.interval,config.animationType,callBackWrapper);
    	};
    	
    	var animate = function(element,properties,duration,ease,callback)
    	{
    		var objTemp = {};
    		function setDuration(duration) 
    		{
    		    if (typeof duration !== 'string') 
    		    {
    		    	duration = duration + "ms";
    		    }
    		    var elStyle = element.style;
  		      	elStyle.webkitTransitionDuration = duration;
  		      	elStyle.transitionDuration = duration;
    		};
    		
    		function setTransform(transform)
    		{
    			 var elStyle = element.style;
    		     elStyle.webkitTransform = transform;
    		     elStyle.transform = transform;
    		};
    		
    		function transitionEnd()
    		{
    			objTemp.isAnimating = false;
				setDuration(0);
				if(callback)
				{
					callback();
				}
    		};
    		
    		function callLater()
    		{
    			if(objTemp.transitionEnd)
    			{
    				util.dispatchEvent(element,"transitionend");
    				util.dispatchEvent(element,"webkitTransitionEnd");
    				/*var event = new Event('transitionend');
            	    element.dispatchEvent(event);
            	    event = new Event('webkitTransitionEnd');
            	    element.dispatchEvent(event);*/
    			}
    		};
    		
    		setDuration(duration);
	    	var transforms = "";
    		for (var key in properties)
    		{
    			transforms += key + '(' + properties[key] + ') ';
    		}
    		setTransform(transforms);
    		//transitionStart(runCallbacks, direction);
    		if (!objTemp.isAnimating) 
    		{
    			objTemp.isAnimating = true;
    			if(!objTemp.transitionEnd)
        		{
        			objTemp.transitionEnd = function(event)
            		{
        				event = util.getEvent(event);
        				if (event.target !== element) 
        				{ 
        					return; 
        				}
        				util.removeEvent(element,"transitionend",objTemp.transitionEnd);
        				util.removeEvent(element,"webkitTransitionEnd",objTemp.transitionEnd);
        				objTemp.transitionEnd = null;
        		        delete objTemp.transitionEnd;
        		        transitionEnd();
            		};
        		}
    			util.addEvent(element,"transitionend",objTemp.transitionEnd);
    			util.addEvent(element,"webkitTransitionEnd",objTemp.transitionEnd);
    			setTimeout(function(){
    				callLater();
    			},duration + 100);
    		}
    	};
    	
    	//from zepto.js
    	/*var animate = function(element,properties,duration,ease,callback)
    	{
    		if(typeof duration == "object")
    		{
    			ease = duration.easing;
    			callback = duration.complete;
    			duration = duration.duration;
    		}
			if (duration === undefined) 
			{
				duration = 0.4;
			}
			var cssValues = {};
			if (typeof properties == "string") 
			{
//    				cssValues[animationName] = properties
//    			    cssValues[animationDuration] = duration + 's'
//    			    cssValues[animationTiming] = (ease || 'linear')
//    			    endEvent = $.fx.animationEnd
			}
			else
			{
				var supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
    	    	var transforms = "";
    	    	var cssProperties = [];
        		for (var key in properties)
        		{
        			if(supportedTransforms.test(key))
        			{
        				transforms += key + '(' + properties[key] + ') ';
        			}
        		    else 
        		    {
        		    	cssValues[key] = properties[key];
        		    	cssProperties.push(dasherize(key));
        		    }
        		}
        		if(transforms)
        		{
        			 cssValues["transform"] = transforms;
        			 cssProperties.push("transform");
        		}
        		if (duration > 0 && typeof properties === 'object') 
        		{
        	        cssValues["transition-property"] = cssProperties.join(', ');
        	        cssValues["transition-duration"] = duration + 's';
        	        cssValues["transition-timing-function"] = (ease || 'linear');
        	    }
			}
    			
    		element.clientLeft;
    		util.css(element,cssValues);
    	};*/
    	
    	var dasherize = function(str) 
    	{
    		return str.toLowerCase()(str.replace(/([a-z])([A-Z])/, '$1-$2'));
    	};
    	
    	var getAnimationStyle = function(position,isTouch) 
    	{
    		if(util.isUndefinedOrNull(position))
    		{
    			var index = objSetUp.currentPage;
        	    if (index >= objSetUp.snapGrid.length) 
        	    { 
        	    	index = snapGrid.length - 1; 
        	    }
        	    //for some reason the currentPos is of by 15px
        	    objSetUp.currentPos = objSetUp.snapGrid[index] + 15 + config.postionBuffer;
        	    position = -1 * objSetUp.currentPos;
    		}
    		else
    		{
    			//objSetUp.currentPos = position;
    		}
    		position = position + "px";
    		//var position = -1 * objSetUp.currentPage * objSetUp.dimension + distance + "px";
    	    var props = {};
    	    if (config.enable3DAnimation) 
    	    {
    	    	props["translate3d"] = (objSetUp.isVertical ? "0," + position : position + ",0") + ",0";
    	    } 
    	    else 
    	    {
    	    	props [objSetUp.isVertical ? "translateY" : "translateX"] = position;
    	    }
    	    return props;
    	};
    	
    	var getTranslate = function(element,axis)
    	{
    		if(!axis)
    		{
    			 axis = "x";
    		}
    		var matrix;
    	    var curTransform;
    	    var transformMatrix;

    	    var curStyle = win.getComputedStyle(element, null);
    	    if (win.WebKitCSSMatrix) 
    	    {
    	        curTransform = curStyle.transform || curStyle.webkitTransform;
    	        if(curTransform.split(',').length > 6) 
    	        {
    	          curTransform = curTransform.split(', ').map(function (a) { return a.replace(',', '.'); }).join(', ');
    	        }
    	        transformMatrix = new win.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    	    } 
    	    else 
    	    {
    	        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    	        matrix = transformMatrix.toString().split(',');
    	    }
    	    if (axis === 'x') 
    	    {
    	        if (win.WebKitCSSMatrix) 
    	        { 
    	        	curTransform = transformMatrix.m41; 
    	        }
    	        // IE10 Matrix
    	        else if (matrix.length === 16) 
    	        { 
    	        	curTransform = parseFloat(matrix[12]); 
    	        }
    	        // Normal Browsers
    	        else 
    	        { 
    	        	curTransform = parseFloat(matrix[4]); 
    	        }
    	    }
    	    else if (axis === 'y') 
    	    {
    	        if (win.WebKitCSSMatrix) 
    	        { 
    	        	curTransform = transformMatrix.m42; 
    	        }
    	        // IE10 Matrix
    	        else if (matrix.length === 16) 
    	        { 
    	        	curTransform = parseFloat(matrix[13]); 
    	        }
    	        // Normal Browsers
    	        else 
    	        { 
    	        	curTransform = parseFloat(matrix[5]); 
    	        }
    	    }
    	    return curTransform || 0;
    	};
    	
    	var getSlideDesiredIndex = function(index)
    	{
    		var retIndex = Math.max(Math.min(index,objSetUp.numPages - 1), 0);//(objSetUp.slides.length + (index % objSetUp.slides.length)) % objSetUp.slides.length;
    		return retIndex;
    	};
    	
    	var getResistanceDistance = function(distance)
    	{
    		if (isFirst() && distance > 0 || isLast() && distance < 0) 
    		{
    			distance /= (1 + Math.abs(distance) / objSetUp.dimension);
    		}
    		return distance;
    	};
    	
    	var createPageNavigation = function()
    	{
    		if(config.enablePageNavigation)
    		{
    			var divPagination = util.createDiv(null,"nsCarouselPageCon");
    			var length = objSetUp.snapGrid.length;
    			var html = "";
    			for (var count = 0; count < length; count++) 
    			{
			          if (config.pageRendererCallback) 
			          {
			        	  html += config.pageRendererCallback(count);
			          } 
			          else 
			          {
			        	  html += "<span class=\"nsCarouselPage\"></span>";
			          }
    			}
    			divPagination.innerHTML = html;
    			var pages = divPagination.querySelectorAll("span");
    			objSetUp.pages = pages;
    			var cssClass= "nsCarouselPage" + (objSetUp.isVertical ? "Vertical" : "Horizontal");
    			for (var count = 0; count < pages.length; count++) 
    			{
    				var page = pages[count];
    				applyCustomClass(page,"page");
    				util.addStyleClass(page,cssClass);
    				page.setAttribute("data-ns-index",count);
    				util.addEvent(page,"click",pageClickHandler.bind(null,count));
    			}
    			objSetUp.container.appendChild(divPagination);
    		}
    	};
    	
    	var setActivePage = function()
    	{
    		if(objSetUp.pages && objSetUp.pages.length > 0)
    		{
    			var pages = objSetUp.pages;
    			var cssClass = "nsCarouselPageActive";
    			if(config.customClass["pageActive"])
    			{
    				cssClass = config.customClass["pageActive"];
    			}
        		for (var count = 0; count < pages.length; count++) 
    			{
        			var page = pages[count];
    				util.removeStyleClass(page,cssClass);
    			};
    			util.addStyleClass(pages[objSetUp.currentPage],cssClass);
    		}
    	};
    	
    	var pageClickHandler = function(index,event)
    	{
    		event = util.getEvent(event);
    		setPage(index);
    		event.stopPropagation();
    		event.stopImmediatePropagation();
    	};
    	
    	var createDirectionNavigation = function()
    	{
    		if(config.enableDirectionNavigation)
    		{
    			if(!config.directionNavigation)
    			{
    				config.directionNavigation = {};
    			}
    			if(!config.directionNavigation.previous)
    			{
    				var divLeftCon = util.createDiv(null,"nsCarouselButtonCon nsCarouselPrevCon");
    				if(config.previousRendererCallback) 
			        {
    					var html = config.previousRendererCallback();
    					divLeftCon.innerHTML = html;
			        }
    				else
    				{
    					var spanLeft = util.createElement("span",null,"nsCarouselButtonNav nsCarouselPrev");
        				divLeftCon.appendChild(spanLeft);
    				}
    				util.addStyleClass(divLeftCon.children[0],"nsCarouselButton nsCarouselButtonPrev");
    				objSetUp.container.appendChild(divLeftCon);
    				config.directionNavigation.previous = divLeftCon;
    			}
    			if(!config.directionNavigation.next)
    			{
    				var divRightCon = util.createDiv(null,"nsCarouselButtonCon nsCarouselNextCon");
    				if(config.nextRendererCallback) 
			        {
    					var html = config.nextRendererCallback();
    					divRightCon.innerHTML = html;
			        }
    				else
    				{
    					var spanRight = util.createElement("span",null,"nsCarouselButtonNav nsCarouselNext");
        				divRightCon.appendChild(spanRight);
    				}
    				util.addStyleClass(divRightCon.children[0],"nsCarouselButton nsCarouselButtonNext");
    				objSetUp.container.appendChild(divRightCon);
    				config.directionNavigation.next = divRightCon;
    			}
    			applyCustomClass(config.directionNavigation.previous,"previous");
    			applyCustomClass(config.directionNavigation.next,"next");
    			util.addEvent(config.directionNavigation.previous,"click",prev);
    			util.addEvent(config.directionNavigation.next,"click",next);
    		}
    	};
    	
    	var applyCustomClass = function(element,type)
    	{
    		if(element && type && config.customClass[type])
    		{
    			util.addStyleClass(element,config.customClass[type]);
    		}
    	};
    	
    	var startAutoPlay = function()
    	{
    		if(config.enableAutoPlay)
    		{
    			stopAutoPlay();
    	    	var func = isLast() ? first : next;
    	    	objSetUp.timeOutInterval = setTimeout(func,config.interval); 
    		}
    	};
    	
    	var stopAutoPlay = function()
    	{
    		if(objSetUp.timeOutInterval)
    		{
    			clearTimeout(objSetUp.timeOutInterval);
        	    objSetUp.timeOutInterval = null;
    		}
    	};
    	
    	var setPage = function(index)
    	{
    		index = util.isUndefinedOrNull(index) ? 0 : index;
    		stopAutoPlay();
    		var newPage = validPage(index);
    		if (objSetUp.currentPage != newPage) 
    		{
    			if(config.beforeSlideCallback)
    			{
    				config.beforeSlideCallback(objSetUp.currentPage,newPage);
    			}
    			objSetUp.previousPage = objSetUp.currentPage;
    			objSetUp.currentPage = newPage;
    		}
    		move(0,config.interval,startAutoPlay);
    		setActivePage();
    	};
    	
    	var first = function()
    	{ 
    		setPage(0);
    	};
    	
    	var next = function()
    	{ 
    		setPage(objSetUp.currentPage + 1);
    	};
    	
    	var prev = function()
    	{ 
    		setPage(objSetUp.currentPage - 1);
    	};
    	
    	var last = function()
    	{ 
    		setPage(objSetUp.numPages - 1);
    	};
    	
    	var isFirst = function()
    	{ 
    		if(objSetUp.currentPage == 0)
    		{
    			return true;
    		}
    		return false;
    	};
    	
    	var isLast = function()
    	{ 
    		if(objSetUp.currentPage == objSetUp.numPages - 1)
    		{
    			return true;
    		}
    		return false;
    	};
    	
    	var validPage = function(index)
    	{ 
    		return Math.max(Math.min(index,objSetUp.numPages - 1), 0);
    	};
    	
    	var visibleSlides = function()
    	{
    	    return objSetUp.slides.slice(objSetUp.currentPage, objSetUp.currentPage + config.visibleSlides);
    	};
    	
    	var resize = function()
    	{
    		setUp();
    	};
    	
    	
    	initialize();
    	
    	self.startAutoPlay = startAutoPlay;
    	self.stopAutoPlay = stopAutoPlay;
    	self.setPage = setPage;
    	self.first = first;
    	self.next = next;
    	self.prev = prev;
    	self.last = last;
    	self.isFirst = isFirst;
    	self.isLast = isLast;
    	self.validPage = validPage;
    	self.visibleSlides = visibleSlides;
    	self.resize = resize;
    	
	};
	
	return NSCarousel;
})();
nsModuleExport(__nsGlobal,"NSCarousel",NSCarousel);