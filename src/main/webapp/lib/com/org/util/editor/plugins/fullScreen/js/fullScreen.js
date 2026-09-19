var NSEditorFullScreen = (function()
{	
	var NSEditorFullScreen = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		
		this.__orignalSetting = {height:null,width: null,changed: false};
		
		this.setSettings = function()
		{
			var self = this;
			this.__nsEditor.__toolBarButton["fullScreen"] = {html:"<i class='ns-icon ns-editor-expand' aria-hidden='true'></i>",tooltip:"Full Screen",showAsMenu: true,
												  checkDisability: function(toolBarKey,toolBarItem,item,itemKey,isDefaultDisabled)
												  {
													  //it should enabled every time
													  return !isDefaultDisabled;
												  },
												  click:function(item,key,event)
												  {
													  self.toggle();
													  event = self.util.getEvent();
													  var iTag = event.target;
													  if(event.target.nodeName.toLowerCase() === "button")
													  {
														  iTag = event.target.children[0];
													  }
													  if(iTag)
													  {
														  if(self.util.hasStyleClass(iTag,"ns-editor-expand"))
														  {
															  self.util.removeStyleClass(iTag,"ns-editor-expand");
															  self.util.addStyleClass(iTag,"ns-editor-collapse");
														  }
														  else
														  {
															  self.util.addStyleClass(iTag,"ns-editor-expand");
															  self.util.removeStyleClass(iTag,"ns-editor-collapse");
														  }
													  }
												  }};
		};
		
		this.initialize = function()
		{
			this.__nsEditor.__listenInternalEvent("toggleFullSize",this.toggle.bind(this));
		};
		
		this.componentsInitialized = function()
		{
			
		};
		
		this.resized = function(event)
		{
			if(this.isFullScreen())
			{
				this.__resizeContainer(false);
			}
		};
		
		this.destroy = function()
		{
			
		};
		
		this.toggle = function()
		{
			this.isFullScreen() ? this.restore() : this.maximize();
		};
		
		this.isFullScreen = function()
		{
			return this.util.hasStyleClass(this.__nsEditor.__divOuterContainer,"nsEditorFullScreen");
		};
		
		this.maximize = function()
		{
			if(!this.isFullScreen())
			{
				var con = this.__nsEditor.__divOuterContainer;
				var zIndex = this.util.getMaxZIndex(con);
				if(zIndex > 0)
				{
					con.style.zIndex = zIndex + 1;
				}
				this.util.addStyleClass(con,"nsEditorFullScreen");
				this.__setParentsPosition(false);
	            this.__resizeContainer(false);
	            this.__nsEditor.__dispatchInternalEvent(NSEditor.EVENT_MAXIMIZED);
	            this.__nsEditor.__dispatchInternalEvent("resizeFullScreen");
				this.__nsEditor.__dispatchEvent(NSEditor.EVENT_MAXIMIZED);
			}
		};
		
		this.restore = function()
		{
			if(this.isFullScreen())
			{
				var con = this.__nsEditor.__divOuterContainer;
				con.style.zIndex = "";
				this.util.removeStyleClass(con,"nsEditorFullScreen");
				this.__setParentsPosition(true);
	            this.__resizeContainer(true);
				this.__nsEditor.__dispatchInternalEvent(NSEditor.EVENT_RESTORED);
				this.__nsEditor.__dispatchInternalEvent("resizeFullScreen");
				this.__nsEditor.__dispatchEvent(NSEditor.EVENT_RESTORED);
			}
		};
		
		this.__setParentsPosition = function(isReset)
		{
			var parent = this.__nsEditor.__divOuterContainer.parentNode;
            while (parent && parent.nodeType !== Node.DOCUMENT_NODE) 
            {
            	isReset ? this.util.removeStyleClass(parent,"nsEditorFullScreenParent") : this.util.addStyleClass(parent,"nsEditorFullScreenParent");
            	parent = parent.parentNode;
            }
		};
		
		this.__resizeContainer = function(isReset)
		{
			var container = this.__nsEditor.__divOuterContainer;
			if(isReset)
			{
				if(this.__orignalSetting.changed)
				{
					var item = {height:this.__orignalSetting.height || "auto",
								width:this.__orignalSetting.width || "auto"};
					this.util.css(container,item);
					this.__orignalSetting = {height:null,width: null,changed: false};
					this.__nsEditor.__resizeCallback(false);
				}
			}
			else
			{
				this.__orignalSetting.height = this.util.getStyleValue(container,"height",false,true);
				this.__orignalSetting.width = this.util.getStyleValue(container,"width",false,true);
				var item = {height:this.__nsEditor.__context.innerHeight,width:this.__nsEditor.__context.innerWidth};
				this.util.css(container,item);
				this.__orignalSetting.changed = true;
				this.__nsEditor.__resizeCallback(true);
			}
		};
		
		NSEditor.prototype.maximize = function()
		{
			var objFullScreen = this.__pluginsInstances["fullScreen"].instance;
			objFullScreen.maximize();
		};
		
		NSEditor.prototype.restore = function()
		{
			var objFullScreen = this.__pluginsInstances["fullScreen"].instance;
			objFullScreen.restore();
		};
		
		NSEditor.prototype.isFullScreen = function()
		{
			var objFullScreen = this.__pluginsInstances["fullScreen"].instance;
			return objFullScreen.isFullScreen();
		};
		
		NSEditor.prototype.toggleFullScreen = function()
		{
			var objFullScreen = this.__pluginsInstances["fullScreen"].instance;
			return objFullScreen.toggle();
		};
		
	};
	NSEditor.TOOLBAR_BUTTONS_FULLSCREEN = "fullScreen";
	NSEditor.EVENT_MAXIMIZED = "maximized";
	NSEditor.EVENT_RESTORED = "restored";
	NSEditor.prototype.registerPlugin("fullScreen",NSEditorFullScreen);
	
	return NSEditorFullScreen;
})();
nsModuleExport(__nsGlobal,"NSEditorFullScreen",NSEditorFullScreen);