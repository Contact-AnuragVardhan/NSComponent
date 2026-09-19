function NSScroller(setting)
{
	this.__component = component;
	
	this.__setting = setting;
	this.__config = null;
	this.util = new NSUtil();
	
	this.__verticalScroller = null;//verticalTrackWrapper
	this.__verticalTrack = null;
	this.__verticalHandle = null;
	this.__verticalUpButton = null;
	this.__verticalDownButton = null;
	
	this.__horizontalScroller = null;//horizontalTrackWrapper
	this.__horizontalTrack = null;
	this.__horizontalHandle = null;
	this.__horizontalLeftButton = null;
	this.__horizontalRightButton = null;
	this.__corner = null;
	
	this.__initialize();
};

NSScroller.prototype.__initialize = function()
{
	if(this.__setting && this.__setting["component"])
	{
		this.__component = this.__setting["component"];
		this.__config = {
				enableVerticalScroll:(this.util.isUndefinedOrNull(this.__setting["enableVerticalScroll"])) ? true : Boolean.parse(this.__setting["enableVerticalScroll"]),
				enableHorizontalScroll:(this.util.isUndefinedOrNull(this.__setting["enableHorizontalScroll"])) ? true : Boolean.parse(this.__setting["enableHorizontalScroll"]),
		};
		this.__createElements(); 
	}
	
};

NSScroller.prototype.__createElements = function()
{
	
};

NSScroller.prototype.__createHorizontalScroller = function()
{
	
};

NSScroller.prototype.__createVerticalScroller = function()
{
	
};