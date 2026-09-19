function NSImport()
{
	this.NS_LOAD = "nsLoad";
	this.__includeContextPath = true;
	this.__contextPath = this.getContextPath();
	this.__extJSURL = this.__contextPath + "/lib/com/ext";
	this.__baseJSURL = this.__contextPath + "/lib/com/org";
	this.__baseCSSURL = this.__contextPath + "/lib/css/com/org";
	this.__dicPath = null;
	this.__baseScriptCount = 0;
	this.__baseFileCount = 0;
	this.__callback = null;
	this.__hasInitialized = false; 
	this.__hasCallBackCalled = false;
	this.__initialise();
	
};

NSImport.prototype.onload = function (callback)
{
	this.__callback = callback;
	this.callCallBack();
};

NSImport.prototype.callCallBack = function ()
{
	//__callback fired from here only when not fired from readImport
	if(this.__hasInitialized)
	{
		if(this.__callback && !this.__hasCallBackCalled)
		{
			this.__hasCallBackCalled = true;
			var util = new NSUtil();
			util.dispatchEvent(window,this.NS_LOAD);
			this.__callback();
		}
	}
};

NSImport.prototype.__initialise = function ()
{
	this.__dicPath = [];
	this.__dicPath["nsComponent.css"] = this.__baseCSSURL + "/nsComponent.css";
	//copied webcomponent.js as IE does not allow to download from cdn site 
	this.__dicPath["webComponent.js"] = this.__extJSURL + "/webcomponents.min.js";
	this.__dicPath["document-register-element.js"] = this.__extJSURL + "document-register-element.js";
	
	this.__dicPath["nsUtil.js"] = this.__baseJSURL + "/util/nsUtil.js";
	this.__dicPath["nsSVG.js"] = this.__baseJSURL + "/util/nsSVG.js";
	this.__dicPath["nsPluggins.js"] = this.__baseJSURL + "/util/nsPluggins.js";
	this.__dicPath["nsPinTip.js"] = this.__baseJSURL + "/util/nsPinTip.js";
	this.__dicPath["nsPinTip.css"] = this.__baseCSSURL + "/nsPinTip.css";
	this.__dicPath["nsUIComponent.js"] = this.__baseJSURL + "/base/nsUIComponent.js";
	this.__dicPath["nsContainerBase.js"] = this.__baseJSURL + "/base/nsContainerBase.js";
	this.__dicPath["nsProtoContainerBase.js"] = this.__baseJSURL + "/prototype/base/nsContainerBase.js";
	this.__dicPath["nsConsole.js"] = this.__baseJSURL + "/util/nsConsole.js";
	this.__dicPath["nsCheckBox.js"] = this.__baseJSURL + "/components/nsCheckBox.js";
	this.__dicPath["nsGroup.js"] = this.__baseJSURL + "/containers/nsGroup.js";
	this.__dicPath["nsDividerBox.js"] = this.__baseJSURL + "/containers/nsDividerBox.js";
	this.__dicPath["nsBanner.js"] = this.__baseJSURL + "/containers/nsBanner.js";
	this.__dicPath["nsProgressBar.js"] = this.__baseJSURL + "/containers/nsProgressBar.js";
	this.__dicPath["nsGrid.js"] = this.__baseJSURL + "/containers/nsGrid.js";
	this.__dicPath["nsProtoGrid.js"] = this.__baseJSURL + "/prototype/nsGrid.js";
	this.__dicPath["nsList.js"] = this.__baseJSURL + "/containers/nsList.js";
	this.__dicPath["nsProtoList.js"] = this.__baseJSURL + "/prototype/nsList.js";
	this.__dicPath["nsTextBox.js"] = this.__baseJSURL + "/components/nsTextBox.js";
	this.__dicPath["nsProtoTextBox.js"] = this.__baseJSURL + "/prototype/nsTextBox.js";
	this.__dicPath["nsMenu.js"] = this.__baseJSURL + "/util/nsMenu.js";
	this.__dicPath["nsMenu.css"] = this.__baseCSSURL + "/nsMenu.css";
	this.__dicPath["nsPagination.js"] = this.__baseJSURL + "/util/nsPagination.js";
	this.__dicPath["nsPagination.css"] = this.__baseCSSURL + "/nsPagination.css";
	this.__dicPath["nsPanel.js"] = this.__baseJSURL + "/containers/nsPanel.js";
	this.__dicPath["nsProtoPanel.js"] = this.__baseJSURL + "/prototype/nsPanel.js";
	this.__dicPath["nsPanel.css"] = this.__baseCSSURL + "/nsPanel.css";
	this.__dicPath["nsDragDrop.js"] = this.__baseJSURL + "/util/nsDragDrop.js";
	this.__dicPath["nsChart.js"] = this.__baseJSURL + "/prototype/nsChart.js";
	
	this.NSMODAL_JS = this.__baseJSURL + "/containers/nsModal.js";
	this.NSMODAL_CSS = this.__baseCSSURL + "/nsModal.css";
	this.NSPROGRESSBAR_CSS = this.__baseCSSURL + "/nsProgressBar.css";
	this.NSDATAGRID_CSS = this.__baseCSSURL + "/nsGrid.css";
	this.NSSCROLLER_CSS = this.__baseCSSURL + "/nsScroller1.css";
	this.NSSCROLLER_JS = this.__baseJSURL + "/util/nsScroller2.js";
	this.NSLIST_CSS = this.__baseCSSURL + "/nsList.css";
	this.NSTEXTBOX_CSS = this.__baseCSSURL + "/nsTextBox.css";
	this.NSEXPORT_JS = this.__baseJSURL + "/util/nsExport.js";
	this.NSFILTER_JS = this.__baseJSURL + "/util/nsFilter.js";
	this.NSFLATGRID_JS = this.__baseJSURL + "/util/nsFlatGrid.js";
	this.NSHIERARCHICALGRID_JS = this.__baseJSURL + "/util/nsHierarchicalGrid.js";
	this.NSGROUPINGGRID_JS = this.__baseJSURL + "/util/nsGroupingGrid.js";
	this.NSGRIDPLUGGIN_JS = this.__baseJSURL + "/util/nsGridPluggins.js";
	this.NSBARCHART_JS = this.__baseJSURL + "/util/nsBarChart.js";
	this.NSPIECHART_JS = this.__baseJSURL + "/util/nsPieChart.js";
	this.NSLINECHART_JS = this.__baseJSURL + "/util/nsLineChart.js";
	this.NSDONUTCHART_JS = this.__baseJSURL + "/util/nsDonutChart.js";
};

NSImport.prototype.__initialiseImport = function ()
{
	var loadFunction = function()
	{
		this.loadBasicScripts();
	};
	
	if (document.addEventListener) 
	{ 
	    document.addEventListener("DOMContentLoaded", loadFunction.bind(this), false);
	} 
	else if (window.addEventListener) 
	{
	    window.addEventListener("load", loadFunction.bind(this), false);
	} 
	else if (document.attachEvent) 
	{
	    window.attachEvent("onload", loadFunction.bind(this));
	}
	else // very old browser, copy old onload
	{
		window.onload = function() 
		{ 
			loadFunction.bind(this)();
		};
	}
};

NSImport.prototype.loadBasicScripts = function ()
{
	var nsimport = this;
	var basicScriptLoadComplete = function(filePath)
	{
		nsimport.__baseScriptCount--;
		if(nsimport.__baseScriptCount === 0)
		{
			nsimport.loadBaseComponents();
		}
	};
	//if (!this.supportRegisterElement() && !this.supportShadowDOM() && !this.supportImportLink() && !this.supportTemplate())
	//{
		this.__baseScriptCount = 1;
		this.loadScript("webComponent.js",basicScriptLoadComplete);
	//}
	var flag = (this.__baseScriptCount === 0);
	if(flag)
	{
		this.loadBaseComponents();
	}
};

NSImport.prototype.supportRegisterElement = function()
{
	return "registerElement" in document;
};

NSImport.prototype.supportShadowDOM = function()
{
	return "createShadowRoot" in HTMLElement.prototype;
};

NSImport.prototype.supportImportLink = function()
{
	return "import" in document.createElement("link");
};

NSImport.prototype.supportTemplate = function()
{
	return "content" in document.createElement("template");
};


NSImport.prototype.loadBaseComponents = function ()
{
	var nsimport = this;
	nsimport.__baseFileCount = 10;
	var baseLoadComplete = function(filePath)
	{
		nsimport.__baseFileCount--;
		if(nsimport.__baseFileCount === 0)
		{
			if(!window["nsConsole"])
			{
				window["nsConsole"] = new NSConsole();
				nsConsole.disable();
			}
			nsimport.readImport();
		}
	};
	this.loadScript("nsComponent.css",baseLoadComplete);
	this.loadScript("nsUtil.js",baseLoadComplete);
	this.loadScript("nsSVG.js",baseLoadComplete);
	this.loadScript("nsPinTip.js",baseLoadComplete);
	this.loadScript("nsPinTip.css",baseLoadComplete);
	this.loadScript("nsUIComponent.js",baseLoadComplete);
	this.loadScript("nsContainerBase.js",baseLoadComplete);
	this.loadScript("nsProtoContainerBase.js",baseLoadComplete);
	this.loadScript("nsConsole.js",baseLoadComplete);
	this.loadScript("nsPluggins.js",baseLoadComplete);
};

NSImport.prototype.readImport = function ()
{
	var list = document.getElementsByTagName("nsimport");
	if(list && list.length > 0)
	{
		var nsimport = this;
		var arrFiles = [];
		for(var count = 0;count < list.length;count++)
	    {
	         var fileName = list[count].getAttribute("file");
	         this.getRelatedFiles(arrFiles,fileName);
	         arrFiles.push(fileName);
	    }
		nsimport.__baseFileCount = arrFiles.length;
		var loadComplete = function(filePath)
		{
			nsimport.__baseFileCount--;
			if(nsimport.__baseFileCount === 0)
			{
				nsimport.__hasInitialized = true;
				nsimport.callCallBack();
			}			
		};
		for(var count = 0;count < arrFiles.length;count++)
	    {
	         var fileName = arrFiles[count];
	         this.loadScript(fileName,loadComplete);
	    }
	}
	else
	{
		this.__hasInitialized = true;
		this.callCallBack();
	}
};

NSImport.prototype.getRelatedFiles = function(arrFiles,fileName)
{
	if(fileName === "nsProgressBar.js")
	{
		arrFiles.push(this.NSMODAL_JS);
		arrFiles.push(this.NSMODAL_CSS);
		arrFiles.push(this.NSPROGRESSBAR_CSS);
	}
	else if(fileName === "nsGrid.js")
	{
		arrFiles.push(this.__dicPath["nsProtoGrid.js"]);
		arrFiles.push(this.NSDATAGRID_CSS);
		arrFiles.push(this.NSSCROLLER_CSS);
		arrFiles.push(this.NSSCROLLER_JS);
		arrFiles.push(this.__dicPath["nsMenu.css"]);
		arrFiles.push(this.__dicPath["nsMenu.js"]);
		arrFiles.push(this.__dicPath["nsPagination.css"]);
		arrFiles.push(this.__dicPath["nsPagination.js"]);
		arrFiles.push(this.NSEXPORT_JS);
		arrFiles.push(this.NSFILTER_JS);
		arrFiles.push(this.NSFLATGRID_JS);
		arrFiles.push(this.NSHIERARCHICALGRID_JS);
		arrFiles.push(this.NSGROUPINGGRID_JS);
		arrFiles.push(this.NSGRIDPLUGGIN_JS);
		arrFiles.push(this.NSLIST_CSS);
		arrFiles.push(this.__dicPath["nsProtoList.js"]);
		arrFiles.push(this.__dicPath["nsList.js"]);
	}
	else if(fileName === "nsList.js")
	{
		arrFiles.push(this.__dicPath["nsDragDrop.js"]);
		arrFiles.push(this.__dicPath["nsProtoList.js"]);
		arrFiles.push(this.NSLIST_CSS);
		arrFiles.push(this.NSFILTER_JS);
		arrFiles.push(this.NSSCROLLER_CSS);
		arrFiles.push(this.NSSCROLLER_JS);
		arrFiles.push(this.__dicPath["nsMenu.css"]);
		arrFiles.push(this.__dicPath["nsMenu.js"]);
	}
	else if(fileName === "nsTextBox.js")
	{
		arrFiles.push(this.NSSCROLLER_CSS);
		arrFiles.push(this.NSSCROLLER_JS);
		arrFiles.push(this.NSLIST_CSS);
		arrFiles.push(this.__dicPath["nsProtoList.js"]);
		arrFiles.push(this.NSTEXTBOX_CSS);
		arrFiles.push(this.__dicPath["nsProtoTextBox.js"]);
	}
	else if(fileName === "nsMenu.js")
	{
		arrFiles.push(this.__dicPath["nsMenu.css"]);
	}
	else if(fileName === "nsPanel.js")
	{
		arrFiles.push(this.__dicPath["nsProtoPanel.js"]);
		arrFiles.push(this.__dicPath["nsPanel.css"]);
	}
	else if(fileName === "nsChart.js")
	{
		arrFiles.push(this.NSBARCHART_JS);
		arrFiles.push(this.NSPIECHART_JS);
		arrFiles.push(this.NSLINECHART_JS);
		arrFiles.push(this.NSDONUTCHART_JS);
	}
};

NSImport.prototype.loadScript = function (fileName,callback)
{
	if(fileName)
    {
	   	var filePath = null;
	   	var fileType = null;
	   	if(fileName.lastIndexOf("/") > 0)
	   	{
	   		filePath =  fileName;
	   	}
	   	else
	   	{
	   		 filePath = this.__dicPath[fileName];
	   	}
	   	if(filePath)
		{
			if (document.getElementById(filePath) == null) 
			{
				if(filePath.indexOf(".") > 0)
				{
					fileType = filePath.substring(filePath.lastIndexOf(".") + 1,filePath.length);
					if(fileType === "js")
					{
						this.includeJavaScriptFile(filePath,callback,"body");
					}
					else if(fileType === "css")
					{
						this.includeCssFile(filePath,callback);
					}
				}
			}
			else if(callback)
			{
				callback();
			}
		}
    }
	
};

//Position can be "head" or "body"
NSImport.prototype.includeJavaScriptFile = function (filePath,callback,position)
{
    if(filePath)
    {
        if(!position)
        {
            position = "body";
        }
        var domPosition = document.getElementsByTagName(position)[0];
        var script = document.createElement("script");
        script.setAttribute("id", filePath);
        script.setAttribute("type","text/javascript");
        script.setAttribute("src",filePath);
        if(callback)
        {
            /*script.onreadystatechange= function ()
            {
                if (this.readyState == "complete")
                {
                    callback();
                }
            };*/
            script.onload = function()
            {
            	callback(filePath);
            }; 
        }
        domPosition.appendChild(script);
    }
};

NSImport.prototype.includeCssFile = function (filePath,callback)
{
    if(filePath)
    {
        var domPosition = document.getElementsByTagName("head")[0];
        var cssFile = document.createElement("link");
        cssFile.setAttribute("id", filePath);
        cssFile.setAttribute("rel", "stylesheet");
        cssFile.setAttribute("type", "text/css");
        cssFile.setAttribute("href", filePath);
        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        if(callback)
        {
            /*cssFile.onreadystatechange= function ()
            {
                if (this.readyState == "complete")
                {
                    callback();
                }
            };*/
            cssFile.onload = function()
            {
            	callback(filePath);
            };
        }
        domPosition.appendChild(cssFile);
    }
};

NSImport.prototype.getContextPath = function() 
{
	if(this.__includeContextPath)
	{
		return window.location.pathname.substring(0, window.location.pathname.indexOf("/",2));
	}
	return "";
};

if (!Function.prototype.bind) 
{
	Function.prototype.bind = function (oThis) 
	{
	    if (typeof this !== "function") 
	    {
	      // closest thing possible to the ECMAScript 5 internal IsCallable function
	      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	    }

	    var aArgs = Array.prototype.slice.call(arguments, 1),
	        fToBind = this,
	        fNOP = function () {},
	        fBound = function () {
	          return fToBind.apply(this instanceof fNOP && oThis
	                                 ? this
	                                 : oThis,
	                               aArgs.concat(Array.prototype.slice.call(arguments)));
	        };

	    fNOP.prototype = this.prototype;
	    fBound.prototype = new fNOP();

	    return fBound;
	};
}

window["ns"] = new NSImport();
ns.__initialiseImport();