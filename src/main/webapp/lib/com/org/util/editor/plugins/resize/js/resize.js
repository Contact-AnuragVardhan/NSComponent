var NSEditorResize = (function()
{
	var NSEditorResize = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		
		this.__enableResizeHorizontal = false;
		this.__enableResizeVertical = false;
		this.__objStart = {xPos:0,yPos:0,width:0,height:0,isResized: false};
		this.__docMouseMoveRef = null;
		this.__docMouseUpRef = null;
		
		this.setSettings = function()
		{
			this.__nsEditor.__config["enableResize"] = Boolean.parse(this.__nsEditor.__setting["enableResize"]);
			this.__nsEditor.__config["resizeDirection"] = this.__nsEditor.__setting["resizeDirection"] || NSEditor.RESIZE_DIRECTION_VERTICAL;
			this.__enableResizeHorizontal = (this.__nsEditor.__config["resizeDirection"] == NSEditor.RESIZE_DIRECTION_BOTH || this.__nsEditor.__config["resizeDirection"] == NSEditor.RESIZE_DIRECTION_HORIZONTAL);
			this.__enableResizeVertical = (this.__nsEditor.__config["resizeDirection"] == NSEditor.RESIZE_DIRECTION_BOTH || this.__nsEditor.__config["resizeDirection"] == NSEditor.RESIZE_DIRECTION_VERTICAL);
		};
		
		this.initialize = function()
		{
		};
		
		this.componentsInitialized = function()
		{
			if(this.__nsEditor.__config.enableResize && this.__nsEditor.__config.height != "auto")
			{
				this.__nsEditor.__handleVisibilityOfComponent(this.__nsEditor.__divFooterContainer,"enableResize");
				var spanResizer = this.util.createElement("span",this.__nsEditor.getID() + "Resizer","nsEditorResizer");
				if(this.__nsEditor.__config["resizeDirection"] !==  NSEditor.RESIZE_DIRECTION_BOTH)
				{
					this.util.addStyleClass(spanResizer,"nsEditorResizer" + this.__nsEditor.__config["resizeDirection"]);
				}
				spanResizer.innerHTML = "\u25E2";
				this.util.addEvent(spanResizer,"mousedown touchstart",this.__resizeMouseDownHandler.bind(this));
				this.__nsEditor.__divFooterContainer.appendChild(spanResizer);
				var self = this;
				this.__nsEditor.__listenInternalEvent(NSEditor.EVENT_MAXIMIZED,function(event){
					self.util.addStyleClass(spanResizer,"nsEditorComponentHidden");
				});
				this.__nsEditor.__listenInternalEvent(NSEditor.EVENT_RESTORED,function(event){
					self.util.removeStyleClass(spanResizer,"nsEditorComponentHidden");
				});
			}
		};
		
		this.resized = function(event)
		{
			
		};
		
		this.destroy = function()
		{
			
		};
		
		this.__resizeMouseDownHandler = function(event)
		{
			event = this.util.getEvent(event);
			var outerContainer = this.__nsEditor.__divOuterContainer;
			this.__objStart = {xPos:event.clientX,yPos:event.clientY,width:outerContainer.offsetWidth,height:outerContainer.offsetHeight,isResized: true};
			if(!this.__docMouseMoveRef)
			{
				this.__docMouseMoveRef = this.__docMouseMoveHandler.bind(this);
				this.util.addEvent(this.__nsEditor.__context,"mousemove touchmove",this.__docMouseMoveRef);
			}
			if(!this.__docMouseUpRef)
			{
				this.__docMouseUpRef = this.__docMouseUpHandler.bind(this);
				this.util.addEvent(this.__nsEditor.__context,"mouseup touchend",this.__docMouseUpRef);
			}
			this.__nsEditor.__dispatchInternalEvent("resizeStart");
			event.preventDefault();
		};
		
		this.__docMouseMoveHandler = function(event)
		{
			event = this.util.getEvent(event);
			if(this.__objStart.isResized)
			{
				if (this.__enableResizeHorizontal) 
				{
					var width = this.__objStart.width + event.clientX - this.__objStart.xPos;
					this.__nsEditor.__width(width);
	            }
				if (this.__enableResizeVertical) 
				{
					var height = this.__objStart.height + event.clientY - this.__objStart.yPos;
					this.__nsEditor.__height(height);
	            }
				this.__nsEditor.__resizeCallback();
				this.__nsEditor.__dispatchInternalEvent("resize");
			}
		};
		
		this.__docMouseUpHandler = function(event)
		{
			if(this.__objStart.isResized)
			{
				this.__objStart = {xPos:0,yPos:0,width:0,height:0,isResized: false};
				this.__nsEditor.__dispatchInternalEvent("resizeEnd");
			}
			if(this.__docMouseMoveRef)
			{
				this.util.removeEvent(this.__nsEditor.__context,"mousemove touchmove",this.__docMouseMoveRef);
				this.__docMouseMoveRef = null;
			}
			if(this.__docMouseUpRef)
			{
				this.util.removeEvent(this.__nsEditor.__context,"mouseup touchend",this.__docMouseUpRef);
				this.__docMouseUpRef = null;
			}
		};
	};
	NSEditor.RESIZE_DIRECTION_HORIZONTAL = "horizontal";
	NSEditor.RESIZE_DIRECTION_VERTICAL = "vertical";
	NSEditor.RESIZE_DIRECTION_BOTH = "both";
	NSEditor.prototype.registerPlugin("resize",NSEditorResize);
	
	return NSEditorResize;
})();
nsModuleExport(__nsGlobal,"NSEditorResize",NSEditorResize);