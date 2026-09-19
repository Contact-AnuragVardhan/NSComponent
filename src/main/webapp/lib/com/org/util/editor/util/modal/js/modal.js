 var NSEditorModal = (function()
{
	var NSEditorModal = function(nsEditor,nsParentPluggin,setting)
	{
		this.__nsEditor = nsEditor;
		this.__nsParentPluggin = nsParentPluggin;
		this.__setting = setting;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		
		this.__divModalMask = null;
		this.__divDragMask = null;
		this.__id = null;
		this.__compOuterContainer = null;
		this.__originalValue = null;
		this.__objDrag = null;
		
		this.__initialize = function()
		{
			this.__setSetting();
			this.__componentsInitialized();
		};
		
		this.__setSetting = function()
		{
			if(!this.__setting)
			{
				throw this.util.throwNSError("NSEditorModal","Setting for Pluggin " + this.__nsParentPluggin.name + " is not defined");
			}
			var config = this.__setting;
			if(!config.contentCallback)
			{
				throw this.util.throwNSError("NSEditorModal","ContentCallback in setting for Pluggin " + this.__nsParentPluggin.name + " is not defined");
			}
			this.__config = {
								container: config["container"] || this.__nsEditor.__getFixedComp(),
								title: config["title"] || "",
								enableDraggable: this.util.isUndefinedOrNull(config["enableDraggable"]) ? true : Boolean.parse(config["enableDraggable"]),
								enableReset: this.util.isUndefinedOrNull(config["enableReset"]) ? true : Boolean.parse(config["enableReset"]),
								showMask: this.util.isUndefinedOrNull(config["showMask"]) ? true : Boolean.parse(config["showMask"]),
								contentCSSClass: config["contentCSSClass"] || "",
								contentCallback: this.util.getFunction(config["contentCallback"]),
								footerCallback: this.util.getFunction(config["footerCallback"]),
								closeCallback: this.util.getFunction(config["closeCallback"]),
								isFullScreen: Boolean.parse(config["isFullScreen"])
						    };
			
		};
		
		this.__componentsInitialized = function()
		{
			this.__createComponents();
			this.__nsEditor.__listenInternalEvent("resized change changePlace readonly",this.hide.bind(this));
			this.__nsEditor.__listenInternalEvent("destroy",this.destroy.bind(this));
		};
		
		this.__createComponents = function()
		{
			this.__id = this.__nsEditor.getID() + this.__nsParentPluggin.name + "EditorModal";
			if(!this.__divModalMask)
			{
				if(this.__config.container.querySelector(".nsEditorModalMask"))
				{
					this.__divModalMask = this.__config.container.querySelector(".nsEditorModalMask");
				}
				else
				{
					this.__divModalMask = this.util.createDiv(this.__id + "ModalMask","nsEditorModalMask");
					this.__config.container.appendChild(this.__divModalMask);
					this.util.addEvent(this.__divModalMask,"click",this.close.bind(this));
					this.util.addEvent(this.__divModalMask,"mouseDown",this.__maskMouseDownHandler.bind(this));
				}
			}
			if(!this.__divDragMask)
			{
				if(this.__config.container.querySelector(".nsEditorModalDragMask"))
				{
					this.__divDragMask = this.__config.container.querySelector(".nsEditorModalDragMask");
				}
				else
				{
					this.__divDragMask = this.util.createDiv(this.__id + "DragMask","nsEditorModalDragMask");
					this.__config.container.appendChild(this.__divDragMask);
					this.util.addEvent(this.__divDragMask,"mouseDown",this.__maskMouseDownHandler.bind(this));
				}
			}
			this.destroy();
			this.__compOuterContainer = this.__getContainer();
			this.__config.container.appendChild(this.__compOuterContainer);
			this.__hide();
		};
		
		this.toggle = function()
		{
			this.isHidden() ? this.show() : this.hide();
		};
		
		this.show = function() 
		{
			if (this.__config.enableReset) 
		    {
				this.reset();
		    }
		    this.showAtCenter();
		};
		
		this.hide = function()
		{
			if (!this.isHidden()) 
			{
				this.__hide();
				this.__nsEditor.__dispatchInternalEvent("modalhide",{modal:this});
		    }
		};
		
		this.showAtCenter = function()
		{
			var doc = this.__nsEditor.__dom.doc;
			var html = doc.documentElement || doc.body;
			var body = doc.body;
			var htmlRect = html.getBoundingClientRect();
			if (this.__config.isFullScreen) 
			{
				var modalContent = this.__compOuterContainer.querySelector(".nsEditorModalContentContainer");
		        this.__compOuterContainer.style.display = "block";

		        var rectContainer = this.__compOuterContainer.getBoundingClientRect();
		        var rectContent = modalContent.getBoundingClientRect();
		        this.__compOuterContainer.style.left = "-100000px";

		        var contentWidth = htmlRect.width - rectContainer.width + rectContent.width;
		        var contentHeight = htmlRect.height - rectContainer.height + rectContent.height;
		        this.util.css(modalContent,{width: contentWidth,height: contentHeight});
		        this.util.css(this.__compOuterContainer,{width: htmlRect.width,height: htmlRect.height,left: 0});
		        
		        this.__originalValue = {
		          html: {
		            overflowX: html.style.overflowX,
		            overflowY: html.style.overflowY
		          },
		          body: {
		            overflowX: body.style.overflowX,
		            overflowY: body.style.overflowY
		          }
		        };
		        var styleOverflow = {overflowX: "hidden",overflowY: "hidden"};
		        this.util.css(doc.documentElement,styleOverflow);
		        this.util.css(body,styleOverflow);
		    } 
			else 
			{
				 this.__compOuterContainer.style.display = "";
			     var popSize = this.__fitSize();
			     var titleBar = this.__compOuterContainer.querySelector(".nsEditorModalTitlebar");
			     var titleHeight = titleBar.offsetHeight | 0;
			     var left = htmlRect.width / 2 - popSize.width / 2;
			     var top = htmlRect.height / 2 - (popSize.height - titleHeight) / 2 - titleHeight;
			     this.__safeSetOffset({left: Math.max(left | 0, 0),top: Math.max(top | 0, 0)});
			     this.util.addStyleClass(this.__compOuterContainer,"nsEditorModalCentered");
		    }
			this.__show();
		};
		
		this.reset = function() 
		{
			if(!this.isDestroyed())
			{
				var divContent = this.__compOuterContainer.querySelector(".nsEditorModalContent");
				var htmlContent = this.__config.contentCallback(this,this.__nsParentPluggin);
				divContent.innerHTML = htmlContent;
			}
		};
		
		this.close = function() 
		{
			if (this.__config.isFullScreen && this.__originalValue) 
			{
				var doc = this.__nsEditor.__dom.doc;
				var body = doc.body;
				var docElement = doc.documentElement;
				this.util.css(docElement,this.__originalValue.html);
		        this.util.css(body,this.__originalValue.body);
		        this.__originalValue = null;
		    }
			this.hide();
		};
		
		this.isHidden = function()
		{
			if(!this.isDestroyed())
			{
				return (this.__compOuterContainer.style.display == "none")
			}
			return true;
		};
		
		this.isDestroyed = function()
		{
			if(this.__compOuterContainer && this.__compOuterContainer.parentElement)
			{
				return false;
			}
			return true;
		};
		
		this.destroy = function()
		{
			if(this.__compOuterContainer && this.__compOuterContainer.parentElement)
			{
				this.__compOuterContainer.parentElement.removeChild(this.__compOuterContainer);
				this.__compOuterContainer = null;
			}
		};
		
		this.__show = function()
		{
			//if (this.isHidden()) 
			//{
				var container = this.__compOuterContainer;
				container.style.display = "";
				var maxZIndex = this.util.getMaxZIndex();
				var zIndex = maxZIndex + 10;
				container.style.zIndex = zIndex;
				this.__nsEditor.__getFixedComp().style.zIndex = zIndex - 4;
				this.__showModalMask(zIndex - 2);
		    //}
		};
		
		this.__hide = function()
		{
			var container = this.__compOuterContainer;
			var style = {display: "none",zIndex: "",width: "",height: ""};
	        this.util.css(container,style);
	        this.__hideModalMask();
		};
		
		this.__fitSize = function()
		{
			var modalBody = this.__compOuterContainer.querySelector(".nsEditorModalBody");
			var modalContent = this.__compOuterContainer.querySelector(".nsEditorModalContentContainer");
			//var rectModalContent = modalContent.getBoundingClientRect();
			var rectModalBody = modalBody.getBoundingClientRect();
			modalBody.style.width = rectModalBody.width + "px";
			modalBody.style.height = rectModalBody.height + "px";
			return rectModalBody;
		};
		
		this.__safeSetOffset = function(offset) 
		{
			var doc = this.__nsEditor.__dom.doc;
			var html = doc.documentElement || doc.body;
			var htmlRect = html.getBoundingClientRect();
		    var rect = this.__compOuterContainer.getBoundingClientRect();
		    var left = offset.left;
		    if (left + rect.width > htmlRect.right) 
		    {
		        left = htmlRect.right - rect.width;
		    }
		    var top = offset.top;
		    if (top + rect.height > htmlRect.bottom) 
		    {
		        top = htmlRect.bottom - rect.height;
		    }
		    this.util.css(this.__compOuterContainer,{left: Math.max(left, 0),top: Math.max(top, 0)});
		};
		
		this.__showModalMask = function(zIndex)
		{
			if(this.__config.showMask)
			{
				this.__setModalMask();
				var style = {display: "",zIndex: zIndex};
		        this.util.css(this.__divModalMask,style);
			}
		};
		
		this.__hideModalMask = function()
		{
			var style = {display: "none",zIndex: "",width:"",height:""};
	        this.util.css(this.__divModalMask,style);
		};
		
		this.__setModalMask = function()
		{
			var doc = this.__nsEditor.__dom.doc;
			var html = doc.documentElement || doc.body;
			var htmlRect = html.getBoundingClientRect();
			var style = {width: htmlRect.width,height: htmlRect.height};
	        this.util.css(this.__divModalMask,style);
		};
		
		this.__maskMouseDownHandler = function(event)
		{
			event = this.util.getEvent(event);
			event.preventDefault();
		};
		
		this.__titleBarMouseDownHandler = function(event)
		{
			if(this.__config.enableDraggable)
			{
				event = this.util.getEvent(event);
				var win = this.__nsEditor.__dom.window;
				var doc = this.__nsEditor.__dom.doc;
				var html = doc.documentElement || doc.body;
				var htmlRect = html.getBoundingClientRect();
				this.__objDrag = {dragging:true,startX: event.clientX,startY: event.clientY,dragging:this.__dragging.bind(this),dragEnd:this.__dragEnd.bind(this)};
				this.util.addEvent(doc,"mousemove",this.__objDrag.dragging);
				this.util.addEvent(doc,"mouseup",this.__objDrag.dragEnd);
				this.util.addEvent(win,"mouseup",this.__objDrag.dragEnd);
				event.preventDefault();
				this.__dragStart(event);
			}
		};
		
		this.__dragStart = function(event)
		{
			this.__objDrag.rect = this.__compOuterContainer.getBoundingClientRect();
			var contentMask = this.__compOuterContainer.querySelector(".nsEditorModalContentMask");
			contentMask.style.visibility = "visible";
			var zIndex = this.__compOuterContainer.style.zIndex;
			this.__showModalMask(zIndex - 1);
		};
		
		this.__dragging = function(event)
		{
			if(this.__objDrag && this.__objDrag.dragging)
			{
				event = this.util.getEvent(event);
				var x = event.clientX - this.__objDrag.startX;
		        var y = event.clientY - this.__objDrag.startY;
		        var offset = {};
		        offset.left = this.__objDrag.rect.left + x;
		        offset.top = this.__objDrag.rect.top + y;
	            this.__safeSetOffset(offset);
		        event.stopPropagation();
			}
		};
		
		this.__dragEnd = function(event)
		{
			if(this.__objDrag)
			{
				var win = this.__nsEditor.__dom.window;
				var doc = this.__nsEditor.__dom.doc;
				this.util.removeEvent(doc,"mousemove",this.__objDrag.dragging);
				this.util.removeEvent(doc,"mouseup",this.__objDrag.dragEnd);
				this.util.removeEvent(win,"mouseup",this.__objDrag.dragEnd);
				if(this.__objDrag.dragging)
				{
					var contentMask = this.__compOuterContainer.querySelector(".nsEditorModalContentMask");
					contentMask.style.visibility = "hidden";
					this.util.removeStyleClass(this.__compOuterContainer,"nsEditorModalCentered");
					//this.__hideModalMask();
				}
				this.__objDrag = null;
			}
		};
		
		this.__getContainer = function()
		{
			var htmlContent = this.__config.contentCallback(this,this.__nsParentPluggin);
			var htmlFooter = this.__config.footerCallback ? this.__config.footerCallback(this,this.__nsParentPluggin) : "";
			var modalContainerClass = this.__config.isFullScreen ? "nsEditorModalContainerFullScreen" : "nsEditorModal nsEditorFor##name##";
			var html = "<div id=\"##id##ModalOuterContainer\" class=\"nsEditorModal nsEditorFor##name##\">\r\n" + 
"							<div id=\"##id##ModalContainer\" class=\"" + modalContainerClass + " nsEditorModalContainer\">\r\n" + 
"								<div id=\"##id##ModalBody\" class=\"nsEditorModalBody\">\r\n" + 
"									<div class=\"nsEditorModalShadow\"></div>\r\n" + 
"									<div id=\"##id##ModalTitlebar\" class=\"nsEditorModalTitlebar\">\r\n" + 
"										<div class=\"nsEditorModalDragHandle\">\r\n" + 
"											<span class=\"nsEditorModalCaption\">\r\n" + 
"												" + this.__config.title + " \r\n" + 
"											</span>\r\n" + 
"										</div>\r\n" + 
"										<div id=\"##id##ModalCloseButtonContainer\" class=\"nsEditorModalCloseButtonContainer\">\r\n" + 
"											<button type=\"button\" data-command=\"close\" class=\"nsEditorModalButton nsEditorModalCloseButton\" aria-label=\"Close\" title=\"Close\">\r\n" + 
"												<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 15.74 15.74\">\r\n" + 
"													<g>\r\n" + 
"														<path d=\"M14.15,11.63l5.61,5.61a1.29,1.29,0,0,1,.38.93,1.27,1.27,0,0,1-.4.93,1.25,1.25,0,0,1-.92.4,1.31,1.31,0,0,1-.94-.4l-5.61-5.61L6.67,19.1a1.31,1.31,0,0,1-.94.4,1.24,1.24,0,0,1-.92-.4,1.27,1.27,0,0,1-.4-.93,1.33,1.33,0,0,1,.38-.93l5.61-5.63L4.79,6a1.26,1.26,0,0,1-.38-.93,1.22,1.22,0,0,1,.4-.92,1.28,1.28,0,0,1,.92-.39,1.38,1.38,0,0,1,.94.38l5.61,5.61,5.61-5.61a1.33,1.33,0,0,1,.94-.38,1.26,1.26,0,0,1,.92.39,1.24,1.24,0,0,1,.4.92,1.29,1.29,0,0,1-.39.93L17,8.81l-2.8,2.82Z\" transform=\"translate(-4.41 -3.76)\"/>\r\n" + 
"													</g>\r\n" + 
"												</svg>\r\n" + 
"											</button>\r\n" + 
"										</div>\r\n" + 
"									</div>\r\n" + 
"									<div id=\"##id##ContentContainer\" class=\"nsEditorModalContentContainer " + this.__config.contentCSSClass + "\">\r\n" + 
"										<span id=\"##id##ContentMask\" class=\"nsEditorModalContentMask\"></span>\r\n" +
"										<div id=\"##id##Content\" class=\"nsEditorModalContent\">\r\n" +
"										</div>\r\n" +
"									</div>\r\n" + 
"									 " + (htmlFooter ? "<div class=\"nsEditorModalFooter\"></div>" : "")  + " \r\n" +
"								</div>\r\n" + 
"							</div>\r\n" + 
"						</div>";
			
			html = html.replaceAll("##id##",this.__id); 
			html = html.replaceAll("##name##",this.__nsParentPluggin.name);
			var compOuterContainer = this.util.getElementFromHtml(html);
			var compContent = compOuterContainer.querySelector(".nsEditorModalContent");
			this.__addCompInParent(compContent,htmlContent)
			var compFooter = compOuterContainer.querySelector(".nsEditorModalFooter");
			if(compFooter)
			{
				this.__addCompInParent(compFooter,htmlFooter)
			}
			var btnClose = compOuterContainer.querySelector(".nsEditorModalCloseButton");
			this.util.addEvent(btnClose,"click",this.close.bind(this));
			var compDragHandle = compOuterContainer.querySelector(".nsEditorModalDragHandle");
			this.util.addEvent(compDragHandle,"mousedown",this.__titleBarMouseDownHandler.bind(this));
			return compOuterContainer;
		};
		
		this.__addCompInParent = function(parent,content)
		{
			if(this.util.isString(content))
			{
				parent.innerHTML = content;
			}
			else
			{
				parent.appendChild(content);
			}
		};
		
		this.__initialize();
	};
	
	NSEditor.prototype.registerUtil("modal",NSEditorModal);
	
	return NSEditorModal;
})();
nsModuleExport(__nsGlobal,"NSEditorModal",NSEditorModal);