  var NSElementResizer = (function()
{
	var NSElementResizer = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		this.__config = {};
		
		this.__container = null;
		this.__compTopLeft = null;
		this.__compTopRight = null;
		this.__compBottomLeft = null;
		this.__compBottomRight = null;
		this.__compSize = null;
		this.__doc = null;
		this.__win = null;
		this.__textArea = null;
		
		this.__isElementResized = false;
        this.__isShown = false;
        this.__element = null;
        this.__objResizer = {};
        this.__resizerRef = null;
		
		
		this.setSettings = function()
		{
			var setting = this.__nsEditor.__setting.elementResizer;
			if(!setting)
			{
				setting = {};
			}
			this.__config = {
								resizableElements: setting["resizableElements"] || "img, iframe",//"img, table, iframe"
								enableShowSize: this.util.isUndefinedOrNull(setting["enableShowSize"]) ? true : Boolean.parse(setting["enableShowSize"]),
								hideSizeInterval: setting["hideSizeInterval"] || 1000,
								sizeLabelFunction: setting["sizeLabelFunction"] ? this.util.getFunction(setting["sizeLabelFunction"]) : null,
								minWidth: setting["minWidth"] || 50,
								minHeight: setting["minHeight"] || 50,
						    };
		};
		
		this.initialize = function()
		{
		};
		
		this.componentsInitialized = function()
		{
			this.__doc = this.__nsEditor.__getDocument();
			this.__win = this.__nsEditor.__getWindow();
			this.__textArea = this.__nsEditor.__getTextArea();
			this.__createComponents();
			this.__nsEditor.__listenInternalEvent("change",this.__changeHandler.bind(this));
			this.__nsEditor.__listenInternalEvent("changePlace",this.__addListeners.bind(this));
			this.__nsEditor.__listenInternalEvent("readonly",this.__readonlyHandler.bind(this));
			this.__nsEditor.__listenInternalEvent("hideResizer",this.__hide.bind(this));
			this.__nsEditor.__listenInternalEvent("maximized",this.__fullScreenHandler);
			this.__addListeners();
			this.__changeHandler();
		};
		
		this.resized = function(event)
		{
			
		};
		
		this.destroy = function()
		{
		};
		
		this.__createComponents = function()
		{
			if(!this.__container)
			{
				this.__container = this.util.createElement("div",null,"nsElemEditorResizer",this.__doc);
				this.__compTopLeft = this.__createResizer("nsEditorResizerTopLeft");
				this.__compTopRight = this.__createResizer("nsEditorResizerTopRight");
				this.__compBottomLeft = this.__createResizer("nsEditorResizerBottomLeft");
				this.__compBottomRight = this.__createResizer("nsEditorResizerBottomRight");
				if(this.__config.enableShowSize)
				{
					this.__compSize = this.util.createElement("span",null,"nsEditorResizerSize",this.__doc);
					this.__container.appendChild(this.__compSize);
				}
			}
		};
		
		this.__createResizer = function(cssClass)
		{
			var comp = this.util.createElement("div",null,"nsEditorResizerComp " + cssClass,this.__doc);
			this.util.addEvent(comp,"mousedown touchstart",this.__resizeClickHandler.bind(this,comp));
			this.__container.appendChild(comp);
			return comp;
		};
		
		this.__addListeners = function(event)
		{
			this.__nsEditor.__listenInternalEvent("keydown", this.__keydownHandler.bind(this));
			this.__nsEditor.__listenInternalEvent("resize", this.__updateCompSize.bind(this));
			this.__nsEditor.__listenInternalEvent("mouseup keydown touchend",this.__clickOutsideHandler.bind(this));
			this.util.addEvent([this.__win,this.__textArea],"scroll",this.__scrollHandler.bind(this));
		};
		
		this.__addListenerToElement = function(element,type)
		{
			if(element)
			{
				this.util.addEvent(element,"click",this.__elementClickHandler.bind(this,element,type));
				this.util.addEvent(element,"mousedown",this.__elementMouseDownHandler.bind(this,element,type));
				this.util.addEvent(element,"dragstart",this.__hide.bind(this));
			}
		};
		
		this.__elementClickHandler = function(element,type,event)
		{
			if (this.__element !== element || !this.__isShown) 
			{
				event = this.util.getEvent(event);
				event.stopImmediatePropagation();
                this.__element = element;
                this.__show();
                if (type == "img" && !this.__element.complete)
                {
                	this.util.addEvent(this.__element,"load",this.__updateCompSize);
                }
            }
		};
		
		this.__elementMouseDownHandler = function(element,type,event)
		{
			if(this.__nsEditor.__browserDetail.isMSIE && type == "img")
			{
				event = this.util.getEvent(event);
				event.preventDefault();
			}
		};
		
		this.__resizeClickHandler = function(compResier,event)
		{
			if (this.__element && this.__element.parentNode) 
			{
				event = this.util.getEvent(event);
				event.preventDefault();
				event.stopImmediatePropagation();
				this.__isElementResized = true;
				this.__objResizer.resizer = compResier;
				this.__objResizer.width = this.__element.offsetWidth;
				this.__objResizer.height = this.__element.offsetHeight;
				this.__objResizer.ratio = this.__objResizer.width / this.__objResizer.height;
				this.__objResizer.startX = event.clientX;
				this.__objResizer.startY = event.clientY;
				this.__nsEditor.__dispatchInternalEvent("hidePopup");
				this.__resizerRef = this.__resizeHandler.bind(this); 
				this.__nsEditor.__listenInternalEvent("mousemove touchmove", this.__resizerRef);
	        }
			else
			{
				this.__hide();
			}
		};
		
		this.__resizeHandler = function(event)
		{
			 if (this.__isElementResized && this.__element) 
			 {
				 event = this.util.getEvent(event);
				 event = event.orignalEvent;
				 event = this.util.getEvent(event)
				 event.stopImmediatePropagation();
				 var diffX = event.clientX - this.__objResizer.startX;
				 var diffY = event.clientY - this.__objResizer.startY;
				 var cssClass = this.__objResizer.resizer.className;
	             var newWidth = 0;
	             var newHeight = 0;
	             var isLeft = cssClass.match(/Left/);
	             var isTop = cssClass.match(/Top/);
	             var leftMul = isLeft ?  -1 : 1;
	             var topMul = isTop ?  -1 : 1;
	             var isImage = this.util.isElementOfType(this.__element,"img");
	             if(isImage)
	             {
	            	 if (diffX) 
	            	 {
	            		 newWidth = this.__objResizer.width + leftMul * diffX;
	            		 newHeight = Math.round(newWidth / this.__objResizer.ratio);
	                 }
	            	 else 
	            	 {
	            		 newHeight = this.__objResizer.height + topMul * diffY;
	            		 newWidth = Math.round(newHeight * this.__objResizer.ratio);
	                 }
	            	 var maxWidth = this.util.getInnerWidth(this.__textArea,this.__win);
	            	 if (newWidth > maxWidth) 
	            	 {
	            		 newWidth = maxWidth;
	            		 newHeight = Math.round(newWidth / this.__objResizer.ratio);
	            	 }
	             }
	             else
	             {
	            	 newWidth = this.__objResizer.width + leftMul * diffX;
	            	 newHeight = this.__objResizer.height + topMul * diffY;
	             }
	             if (newWidth > this.__config.minWidth) 
	             {
	            	 if (newWidth < this.__container.offsetWidth) 
	            	 {
	            		 this.__element.style.width = newWidth + "px";
	                 }
	                 else 
	                 {
	                	 this.__element.style.width = "100%";
	                 }
	             }
	             if (newHeight > this.__config.minHeight) 
	             {
	            	 this.__element.style.height = newHeight + "px";
	             }
	             this.__updateCompSize();
                 this.__updateSizeLabel(this.__element.offsetWidth,this.__element.offsetHeight);
			 }
		};
		
		this.__clickOutsideHandler = function(event)
		{
			//var eventDetail = event.detail;
			//console.log("In __clickOutsideHandler " + eventDetail.orignalEvent.type);
			if (this.__isShown) 
			{
                if (this.__isElementResized) 
                {
                	var event = this.util.getEvent(event);
                    //_this.jodit.unlock();
                    this.__isElementResized = false;
                    //this.jodit.setEditorValue();
                    event.stopImmediatePropagation();
                    this.__nsEditor.__removeInternalEvent("mousemove touchmove", this.__resizerRef);
                    this.__resizerRef = null;
                }
                else 
                {
                    this.__hide();
                }
            }
		};
		
		this.__changeHandler = function(event)
		{
			 if(this.__isShown) 
			 {
				 if (!this.__element || !this.__element.parentNode) 
				 {
					 this.__hide();
		         }
		         else 
		         {
		        	 this.__updateCompSize();
		         }
		     }
			 if(!this.__nsEditor.isRemoved() && !this.__nsEditor.__isSourceMode)
			 {
				 var arrElements = this.__textArea.querySelectorAll(this.__config.resizableElements);
				 for(var count = 0;count < arrElements.length;count++)
				 {
					 var element = arrElements[count];
					 var processed = Boolean.parse(element.getAttribute("ns-editor-processed"));
					 var type = element.tagName.toLowerCase();
					 if(!processed && (type == "img" || type == "table"))
				     {
						 element.setAttribute("ns-editor-processed",true);
						 this.__addListenerToElement(element,type);
				     }
				 }
			 }
		};
		
		this.__readonlyHandler = function(event)
		{
			var eventDetail = event.detail;
			if(eventDetail && eventDetail.isReadOnly)
			{
				this.__hide();
			}
		};
		
		this.__scrollHandler = function(event)
		{
			if (this.__isShown && !this.__isElementResized) 
			{
                this.__hide();
            }
		};
		
		this.__keydownHandler = function(event)
		{
			event = this.util.getEvent(event);
			var keyCode = event.which || event.keyCode;
			if(this.__isShown && keyCode === this.util.KEYCODE.DELETE && this.__element && !this.util.isElementOfType(this.__element,"table")) 
			{
				this.__deleteHandler(event);
	        }
		};
		
		this.__fullScreenHandler = function(event)
		{
			if(this.__isShown)
			{
				var zIndex = this.util.getStyleValue(this.__nsEditor.__divOuterContainer,"z-index");
				this.__container.style.zIndex = zIndex;
			}
		};
		
		this.__deleteHandler = function(event)
		{
			if(this.__element)
			{
				if(this.__element.parentNode)
				{
					this.__element.parentNode.removeChild(this.__element);
				}
	            this.__hide();
	            event.preventDefault();
			}
		};
		
		this.__updateCompSize = function()
		{
			if(this.__isShown && !this.__nsEditor.isRemoved())
			{
				if(this.__element && this.__container) 
				{
					var parent = this.__container.parentNode || this.__doc.documentElement;
	                var parentPos = this.editorUtil.getOffset(parent,true);
	                var elementPos = this.editorUtil.getOffset(this.__element,false);
	                var left = parseInt(this.__container.style.left || "0", 10);
	                var top = parseInt(this.__container.style.top || "0", 10);
	                var width = this.__container.offsetWidth;
	                var height = this.__container.offsetHeight;
	                var newTop = elementPos.top - 1 - parentPos.top;
	                var newLeft = elementPos.left - 1 - parentPos.left;
	                if (top !== newTop || left !== newLeft || width !== this.__element.offsetWidth || height !== this.__element.offsetHeight) 
	                {
	                	var style = {top: newTop, left: newLeft, width: this.__element.offsetWidth, height: this.__element.offsetHeight};
	                	/*console.log(parentPos);
	                	console.log(elementPos);
	                	console.log(style);*/
	                	this.util.css(this.__container,style);
	                	this.__nsEditor.__dispatchInternalEvent("changesize");
	                }
				}
			}
		};
		
		this.__updateSizeLabel = function(width,height)
		{
			if(this.__compSize)
			{
				if (width < this.__compSize.offsetWidth || height < this.__compSize.offsetHeight) 
				{
					this.__showHideSizeComp(false);
			    }
				else
				{
					this.__showHideSizeComp(true);
					var label = width + " x " + height;
					if(this.__config.sizeLabelFunction)
					{
						label = this.__config.sizeLabelFunction(width,height);
					}
					else
					{
						this.__compSize.textContent = label
					}
					var self = this;
					setTimeout(function(){ 
						self.__showHideSizeComp.call(self,false); 
					}, this.__config.hideSizeInterval);
				}
			}
		};
		
		this.__show = function()
		{
			if(!this.__isShown && this.editorUtil.isEditable())
			{
				this.__isShown = true;
				this.__nsEditor.__divBodyContainer.appendChild(this.__container);
				this.__updateCompSize();
			}
		};
		
		this.__hide = function()
		{
			this.__isElementResized = false;
	        this.__isShown = false;
	        this.__element = null;
	        if(this.__container.parentNode)
	        {
	        	this.__container.parentNode.removeChild(this.__container);
	        }
		};
		
		this.__showHideSizeComp = function(isShow)
		{
			if(this.__compSize)
			{
				this.__compSize.style.opacity = isShow ? "1" : "0";
			}
		};
		
	};
	
	NSEditor.prototype.registerPlugin("elementResizer",NSElementResizer);
	
	return NSElementResizer;
})();
nsModuleExport(__nsGlobal,"NSElementResizer",NSElementResizer);