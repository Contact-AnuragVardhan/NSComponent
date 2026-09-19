var nsBanner = Object.create(nsContainerBase);

nsBanner.initializeComponent = function() 
{
	this.base.initializeComponent();
	this.INFO_TITLE = "info";
	this.WARNING_TITLE = "warning";
	this.ERROR_TITLE = "error";
	
	this.__arrOpenDiv = new Array();
	this.__arrCustomDiv = new Array();
	this.util.addEvent(window,"scroll",this.__scrollHandler.bind(this));
};

nsBanner.setComponentProperties = function() 
{
	this.base.setComponentProperties();
};

nsBanner.propertyChange = function(attrName, oldVal, newVal, setProperty) 
{
	this.base.propertyChange(attrName, oldVal, newVal, setProperty);
};

nsBanner.showInfo = function(message)
{
	this.__createDialog(this.INFO_TITLE,"nsInfoBanner",message);
};

nsBanner.showWarning = function(message)
{
	this.__createDialog(this.WARNING_TITLE,"nsWarningBanner",message);
};

nsBanner.showError = function(message)
{
	this.__createDialog(this.ERROR_TITLE,"nsErrorBanner",message);
};

nsBanner.showCustom = function(templateID)
{
	if(templateID)
	{
		this.closeAllBanner();
		var id = this.__getBannerId(templateID);
		var divBanner = this.util.createDiv(id);
	    document.body.insertBefore(divBanner,document.body.childNodes[0]);
	    divBanner.style.width = "100%";
	    this.__updateOpenBanner(id,"insert",true);
	    this.util.addTemplateInContainer(divBanner,templateID);
	}
};

nsBanner.closeAllCustomBanners = function()
{
    if(this.__arrCustomDiv && this.__arrCustomDiv.length > 0)
    {
    	//reverse as the array is getting deleted also
	    for(var count = this.__arrCustomDiv.length; count >= 0 ;count--)
	    {
	    	this.__closeBanner(this.__arrCustomDiv[count]);
	    }
    }
};

nsBanner.closeAllNonCustomBanners = function()
{
    if(this.__arrOpenDiv && this.__arrOpenDiv.length > 0)
    {
    	//reverse as the array is getting deleted also
	    for(var count = this.__arrOpenDiv.length; count >= 0 ;count--)
	    {
	    	this.__closeBanner(this.__arrOpenDiv[count]);
	    }
    }
};


nsBanner.closeAllBanner = function()
{
	this.closeAllCustomBanners();
    this.closeAllNonCustomBanners();
};

nsBanner.__createDialog = function(bannerType,styleClass,message) 
{
	this.closeAllCustomBanners();
	var id = this.__getBannerId(bannerType);
	var divBanner=document.getElementById(id);
    if(!divBanner)
    {
       divBanner = this.util.createDiv(id,styleClass);
       document.body.insertBefore(divBanner,document.body.childNodes[0]);
    }
    divBanner.style.width = "100%";
    divBanner.innerHTML = message;
    //since innerHTML has been overridden hence we need to the button again(every time)
    var btnClose = this.__createBannerCloseButton();
    divBanner.appendChild(btnClose);
    
	this.__updateOpenBanner(id,"insert",false);
    return divBanner;
};

nsBanner.__createBannerCloseButton = function()
{
    var btnClose = document.createElement("a");
    btnClose.setAttribute("href","javascript:void(0)");
    btnClose.className = "nsCloseBannerButton";
    btnClose.onmouseover = function() { this.className = "nsCloseBannerButton_hover"; };
    btnClose.onmouseout = function() { this.className = "nsCloseBannerButton"; };
    btnClose.style.textDecoration="none";
    if(this.util.isBrowserIE())
    {
        btnClose.style.styleFloat = "right";
    }
    else
    {
        btnClose.style.cssFloat = "right";
    }
    btnClose.style.clear = "both";
    btnClose.style.paddingRight = "10px";
    btnClose.innerHTML = "X";
    btnClose.onclick = this.__closeBannerHandler.bind(this);
    return btnClose;
};

//operation value can be "insert","remove"
nsBanner.__updateOpenBanner = function(id,operation,isCustom)
{
	if(!this.__arrOpenDiv)
	{
		this.__arrOpenDiv = new Array();
	}
	if(!this.__arrCustomDiv)
	{
		this.__arrCustomDiv = new Array();
	}
	if(operation === "insert")
	{
		if(isCustom && this.__arrCustomDiv.indexOf(id) === -1)
		{
			this.__arrCustomDiv.splice(0,0,id);
		}
		else if(this.__arrOpenDiv.indexOf(id) === -1)
		{
			this.__arrOpenDiv.splice(0,0,id);
		}
	}
	else if(operation === "remove")
	{
		if(this.__arrCustomDiv.indexOf(id) > -1)
		{
			this.__arrCustomDiv.splice(this.__arrCustomDiv.indexOf(id),1);
		}
		else if(this.__arrOpenDiv.indexOf(id) > -1)
		{
			this.__arrOpenDiv.splice(this.__arrOpenDiv.indexOf(id),1);
		}
	}
};

nsBanner.__closeBannerHandler = function(event)
{
    var target = this.util.getTarget(event);
    if(target && target.parentNode)
    {
		var divBannerId = target.parentNode.id;
		this.__closeBanner(divBannerId);
    }
};

nsBanner.__scrollHandler = function(event)
{  
   if(this.__arrOpenDiv && this.__arrOpenDiv.length > 0)
   {
	   for(var count = 0; count < this.__arrOpenDiv.length ;count++)
	   {
			var divBanner = document.getElementById(this.__arrOpenDiv[count]);
			this.__positionBanner(divBanner,"nsFixedElement");
			divBanner.style.top = ((count * divBanner.offsetHeight)) + "px";
	   }
   }
   else if(this.__arrCustomDiv && this.__arrCustomDiv.length > 0)
   {
	   for(var count = 0; count < this.__arrCustomDiv.length ;count++)
	   {
			var divBanner = document.getElementById(this.__arrCustomDiv[count]);
			this.__positionBanner(divBanner,"nsFixedElement");
			divBanner.style.top = ((count * divBanner.offsetHeight)) + "px";
	   }
   }
};

nsBanner.__closeBanner = function(bannerID)
{
    if(bannerID)
    {
		this.util.removeDiv(bannerID);
        this.__updateOpenBanner(bannerID,"remove");
    }
};


nsBanner.__positionBanner = function(divBanner,styleName)
{
   if(divBanner)
   {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if(scrollTop > divBanner.offsetHeight)
        {
        	this.util.addStyleClass(divBanner,styleName);
        }
        else
        {
        	this.util.removeStyleClass(divBanner,styleName);
        }
   }
};

//bannerType can be "info","warning","error"
nsBanner.__getBannerId = function(bannerType) 
{
	return (this.getID() + bannerType);
};


document.registerElement("ns-banner", {prototype: nsBanner});