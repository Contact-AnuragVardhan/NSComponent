 "use strict";
var NSRouter = (function()
{
	function NSRouter(arrRoute,setting) 
	{
		this.util = new NSUtil();
		this.__arrRoute = arrRoute ? arrRoute : [];
		this.__setting = setting;
		this.__domVar = null;
		this.__mode = "hash";
		this.__root = "/";
		this.__getStateCallback = null;
		this.__needsHashChangeListener = true;
		this.__listenerRef = {};
		this.__initialize();
	}
	
	NSRouter.prototype.__initialize = function()
	{
		this.__domVar = this.util.getDomVariables();
		this.__needsHashChangeListener = this.__supportsPopStateOnHashChange();
		var isManual = false;
		var defaultRoute = "/"; 
		if(this.__setting)
		{
			this.__mode = (this.__setting["mode"] && this.__setting["mode"] == "history" && this.__isHistorySupported()) ? "history" : "hash";
			this.__root = this.__setting["root"] ? "/" + this.__removeAllSlashes(this.__setting["root"]) + "/" : "/";
			this.__getStateCallback = this.__setting["getStateCallback"] || null;
			defaultRoute = this.__setting["defaultRoute"] ? this.__setting["defaultRoute"] : defaultRoute;
			isManual = Boolean.parse(this.__setting["isManual"]);
		}
		this.__currentRoute = this.getCurrentRoute();
		this.__listenerRef.popstate = this.__popStateListener.bind(this);
		this.__domVar.win.addEventListener("popstate", this.__listenerRef.popstate);
		if(!isManual)
		{
			if(this.__needsHashChangeListener)
			{
				this.__listenerRef.hashchange = this.__hashChangeListener.bind(this);
				this.__domVar.win.addEventListener("hashchange", this.__listenerRef.hashchange);
			}
			var currentRoute = this.__currentRoute.route;
			if(!currentRoute)
			{
				currentRoute = defaultRoute;
			}
			if(currentRoute)
			{
				this.routeTo(currentRoute);
			}
		}
	};
	
	NSRouter.prototype.addRoute = function(item)
	{
		if(item && this.__arrRoute) 
		{
			this.__arrRoute.push(item);
		}
	};
	
	NSRouter.prototype.removeRoute = function(param) 
	{
		if(param && this.__arrRoute && this.__arrRoute.length > 0)
		{
			var item = {};
			var length = this.__arrRoute.length;
			for(var count = 0;count < length;count++)
			{
				item = this.__arrRoute[count];
				if(item["handler"] === param || item["route"] === param) 
				{
					this.__arrRoute.splice(count, 1); 
					break;
				}
			}
		}
	};
	
	NSRouter.prototype.getCurrentRoute = function() 
	{
		var location = this.__domVar.win.location;
        var pathname = location.pathname;
        var search = location.search;
        var hash = location.hash;
		var route = pathname + search + hash;
		if(!this.__root || !this.__hasRoot(pathname,this.__root))
		{
			console.warn("NSRouter","Root is missing in the path " + route);
		}
		if(this.__root)
		{
			route = this.__removeRoot(route,this.__root);
		}
		return this.__parseRoute(route);
	};
	
	NSRouter.prototype.callRoute = function(route) 
	{
		var currentRoute = route || this.getCurrentRoute().route;
		var item = {};
		var length = this.__arrRoute.length;
		var callHandler = false; 
		for(var count = 0;count < length;count++)
		{
			callHandler = false;
			item = this.__arrRoute[count];
			if(item["route"] instanceof RegExp)
			{
				var match = currentRoute.match(item["route"]);
				if(match) 
				{
					match.shift();
					callHandler = true;
				}
			}
			else if(item["route"] === currentRoute)
			{
				callHandler = true;
			}
			if(callHandler) 
			{
				if(item["handler"])
				{
					item["handler"](item);
				}
				break;
			}		
		}
	};
	
	NSRouter.prototype.routeTo = function(route,state) 
	{
		route = route ? route : "";
		var objRoute = this.__createRouteObject(route);
		var cancelled = this.__dispatchEvent(NSRouter.NavigationStart,{route: objRoute.route},{route: objRoute.route},null,true);
		if(cancelled)
		{
			this.__dispatchEvent(NSRouter.NavigationCancelled,{route: objRoute.route},{route: objRoute.route});
		}
		else 
		{
			var href = this.__createHref(objRoute);
			if(this.__isHistorySupported())
			{
				state = state ? state : (this.__getStateCallback ? this.__getStateCallback(route) : null);
				var objNav = {routeKey: this.__generateKey(objRoute.route), routeState:state};
				this.__domVar.win.history.pushState(objNav,null,href);
			}
			else
			{
				this.__domVar.win.location.href = href;
			}
		}
		this.__dispatchEvent(NSRouter.NavigationEnd,{route: objRoute.route},{route: objRoute.route});
	};
	
	NSRouter.prototype.destroy = function()
	{
		if(this.__listenerRef)
		{
			for(var event in this.__listenerRef)
			{
				this.__domVar.win.removeEventListener(event, this.__listenerRef[event]);
			}
			this.__listenerRef = {};
		}
		this.__arrRoute = [];
		this.__root = "/";
	};
	
	NSRouter.prototype.__popStateListener = function(event)
	{
		if(!this.__needsHashChangeListener)
		{
			this.__hashChangeListener(event);
		}
	};
	
	NSRouter.prototype.__hashChangeListener = function(event)
	{
		//Current route url (getting rid of '#' in hash as well):
		var url = location.hash || "/";
		if(url)
		{
			if(url.charAt(0) === "#")
			{
				url = url.substring(1);
			}
			if(url.charAt(0) != "/")
			{
				url = "/" + url;
			}
		}
	    this.callRoute(url);
	    //console.log(url);
	};
	
	NSRouter.prototype.__createHref = function(objRoute) 
	{
	    return this.__root + this.__createRoute(objRoute);
	};
	
	NSRouter.prototype.__createRoute = function(objRoute) 
	{
		var route = objRoute.route || "/";
		if(objRoute.search && objRoute.search != "?") 
		{
			route += objRoute.search.charAt(0) == "?" ? objRoute.search : "?" + objRoute.search;
		}
		if(objRoute.hash && objRoute.hash != "#") 
		{
			route += objRoute.hash.charAt(0) == "#" ? objRoute.hash : "#" + objRoute.hash;
		}
		return route;
	};
	
	//createLocation
	NSRouter.prototype.__createRouteObject = function(route) 
	{
		var objRet = {};
		if(typeof route == "string")
		{
			objRet = this.__parseRoute(route);
		}
		else
		{
			objRet = route;
		    if (!objRet.route) 
		    {
		    	objRet.route = "";
		    }
		    if(objRet.search) 
		    {
		    	objRet.search = (objRet.search.charAt(0) != "?") ? "?" + objRet.search : objRet.search;
		    } 
		    else 
		    {
		    	objRet.search = "";
		    }
		    if(objRet.hash) 
		    {
		    	objRet.hash = (objRet.hash.charAt(0) != "#") ? "#" + objRet.hash : objRet.hash;
		    } 
		    else 
		    {
		    	objRet.hash = "";
		    }
		}
		try 
		{
			objRet.route = decodeURI(objRet.route);
		} 
		catch(error) 
		{
			throw error;
		}
		if (this.__currentRoute) 
		{
		    // Resolve incomplete/relative pathname relative to current location.
		    if (!objRet.route) 
		    {
		    	objRet.route = currentLocation.route;
		    } 
		    else if(objRet.route.charAt(0) != "/") 
		    {
		    	objRet.route = this.__resolvePathname(location.pathname, currentLocation.pathname);
		    }
		} 
		else 
		{
			if(!objRet.route) 
		    {
				objRet.route = "/";
		    }
		}
		return objRet;
	};
	
	NSRouter.prototype.__parseRoute = function(route) 
	{
		var search = "";
		var hash = "";
		var hashIndex = route.indexOf("#");
		if (hashIndex != -1) 
		{
		   hash = route.substr(hashIndex);
		   route = route.substr(0, hashIndex);
		}
		var searchIndex = route.indexOf("?");
		if(searchIndex !== -1) 
		{
			search = route.substr(searchIndex);
			route = route.substr(0, searchIndex);
		}
		return {route: route,search: search == "?" ? "" : search,hash: hash == "#" ? "" : hash};
	};
	
	NSRouter.prototype.__isModeHistory = function()
	{
		return (this.__mode == "history");
	};
	
	NSRouter.prototype.__addLeadingSlash = function(path) 
	{
		return (!path || path.charAt(0) === '/') ? path : '/' + path;
	};
	
	NSRouter.prototype.__removeLeadingSlash = function(path) 
	{
		return (path && path.charAt(0) === '/') ? path.substr(1) : path;
	};
	
	NSRouter.prototype.__removeTrailingSlash = function(path) 
	{
		return (!path || path.charAt(path.length - 1) === '/') ? path.slice(0, -1) : path;
	};
	
	NSRouter.prototype.__removeAllSlashes = function(path)
	{
		return path.toString().replace(/\/$/, "").replace(/^\/+/, "");
	};
	
	NSRouter.prototype.__hasRoot = function(path,root) 
	{
		return path && root && path.toLowerCase().indexOf(root.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(root.length)) !== -1;
	};
	
	NSRouter.prototype.__removeRoot = function(path,root) 
	{
		return this.__hasRoot(path,root) ? path.substr(root.length) : path;
	};
	
	NSRouter.prototype.__dispatchEvent = function(eventType,data,param,bubbles,cancelable)
	{
		return this.util.dispatchEvent(this.__domVar.win,eventType,data,param,bubbles,cancelable);
	};
	
	NSRouter.prototype.__isHistorySupported = function()
	{
		return (this.__domVar.win.history && this.__domVar.win.history["pushState"]);
	};
		
	NSRouter.prototype.__addCharAtStart = function(path,char)
	{
		return (!path || path.charAt(0) === char) ? path : char + path;
	};
	
	NSRouter.prototype.__supportsPopStateOnHashChange = function() 
	{
		return this.__domVar.win.navigator.userAgent.indexOf('Trident') === -1;
	};
	
	NSRouter.prototype.__generateKey = function(route)
	{
		return Math.random().toString(36).substring(2,8) + "::" + route;
	};
	
	//taken from React resolve-Pathname.js
	NSRouter.prototype.__resolvePathname = function(to, from) 
	{
		  if (from === undefined) from = '';

		  var toParts = (to && to.split('/')) || [];
		  var fromParts = (from && from.split('/')) || [];

		  var isToAbs = to && this.__isAbsolute(to);
		  var isFromAbs = from && this.__isAbsolute(from);
		  var mustEndAbs = isToAbs || isFromAbs;

		  if (to && this.__isAbsolute(to)) {
		    // to is absolute
		    fromParts = toParts;
		  } else if (toParts.length) {
		    // to is relative, drop the filename
		    fromParts.pop();
		    fromParts = fromParts.concat(toParts);
		  }

		  if (!fromParts.length) return '/';

		  var hasTrailingSlash;
		  if (fromParts.length) {
		    var last = fromParts[fromParts.length - 1];
		    hasTrailingSlash = last === '.' || last === '..' || last === '';
		  } else {
		    hasTrailingSlash = false;
		  }

		  var up = 0;
		  for (var i = fromParts.length; i >= 0; i--) {
		    var part = fromParts[i];

		    if (part === '.') {
		    	this.__spliceOne(fromParts, i);
		    } else if (part === '..') {
		    	this.__spliceOne(fromParts, i);
		      up++;
		    } else if (up) {
		    	this.__spliceOne(fromParts, i);
		      up--;
		    }
		  }

		  if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

		  if (
		    mustEndAbs &&
		    fromParts[0] !== '' &&
		    (!fromParts[0] || !this.__isAbsolute(fromParts[0]))
		  )
		    fromParts.unshift('');

		  var result = fromParts.join('/');

		  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

		  return result;
	};
	
	NSRouter.prototype.__isAbsolute = function(pathname) 
	{
		return pathname.charAt(0) === '/';
	};

		
	NSRouter.prototype.__spliceOne = function(list, index) 
	{
		for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) 
		{
			list[i] = list[k];
		}

		list.pop();
	};
	
	NSRouter.NavigationStart = "navigationStart";
	NSRouter.NavigationEnd = "navigationEnd";
	NSRouter.NavigationCancelled = "navigationCancelled";
	NSRouter.NavigationError = "navigationError";
	
	return NSRouter;
})();
nsModuleExport(__nsGlobal,"NSRouter",NSRouter);