"use strict";
var NSMessageBox = (function()
{
	function NSMessageBox(setting) 
	{
		this.__setting = setting;
		
		this.util = null;
		this.__baseComponent = null;
		this.__nsPanel = null;
		this.__divContainer = null; 
		this.__divBody = null;
		this.__divFooter = null;
		this.__arrButtonInstance = [];
		
		this.__bodyCompInstance = null;
		this.__context = window;
		this.__customClass = {};
		
		this.__initializeComponent();
	};
		
	NSMessageBox.prototype.__initializeComponent = function() 
	{
		this.util = new NSUtil();
		this.__id = "comp" + this.util.getUniqueId();
		this.__setSetting(this.__setting);
		this.__createStructure();
	};	
	
	NSMessageBox.prototype.alert = function(message,title,callback)
	{
		if(message)
		{
			if(this.util.isString(message))
			{
				var setting = {
					bodyContent:message,
					title:title,
					callback:callback
				};
				this.__alert(setting);
			}
			else
			{
				this.__alert(message);
			}
		}
	};
	
	NSMessageBox.prototype.confirm = function(message,title,confirmCallback,cancelCallback)
	{
		if(message)
		{
			if(this.util.isString(message))
			{
				var setting = {
						bodyContent:message,
						title: title,
						confirm:{callback:confirmCallback},
						cancel:{callback:cancelCallback}
				};
				this.__confirm(setting);
			}
			else
			{
				this.__confirm(message);
			}
		}
	};
	
	NSMessageBox.prototype.custom = function(setting)
	{
		if(setting)
		{
			this.__createMessageBox(setting);
		}
	};
	
	NSMessageBox.prototype.close = function()
	{
		if(this.__nsPanel)
		{
			this.__nsPanel.close();
			this.__nsPanel.removeComponent();
			this.__baseComponent = null;
			this.__nsPanel = null;
			if(this.__bodyCompInstance)
			{
				this.__callEditorFunction(this.__bodyCompInstance,"destroy");
			}
		}
	};
	
	NSMessageBox.prototype.removeModal = function()
	{
		if(this.__nsPanel)
		{
			this.__nsPanel.removeModal();
			this.__baseComponent = null;
			this.__nsPanel = null;
			if(this.__bodyCompInstance)
			{
				this.__callEditorFunction(this.__bodyCompInstance,"destroy");
			}
		}
	};
	
	//btnIdentifier can be event,button,label
	NSMessageBox.prototype.changeButtonStyle = function(btnIdentifier,objStyle)
	{
		if(btnIdentifier && objStyle)
		{
			var button =  null;
			if(btnIdentifier instanceof Event)
			{
				button = this.util.getTarget(btnIdentifier);
			}
			else if(this.util.isElement(btnIdentifier) && this.util.isElementOfType(btnIdentifier,"BUTTON"))
			{
				button = btnIdentifier;
			}
			else if(this.util.isString(btnIdentifier))
			{
				var item = null;
				for(var count = 0;count < this.__arrButtonInstance.length;count++)
				{
					item = this.__arrButtonInstance[count];
					if(item && item.label == btnIdentifier)
					{
						button = item.button;
						break;
					}
				}
			}
			if(button)
			{
				this.util.css(button,objStyle);
			}
		}
	};
	
	NSMessageBox.prototype.getPanel = function()
	{
		return this.__nsPanel;
	};
	
	NSMessageBox.prototype.__setSetting = function(setting)
	{
		if(setting)
		{
			if(setting.hasOwnProperty("context"))
			{
				this.__context = setting["context"];
			}
			if(setting.hasOwnProperty("theme"))
			{
				this.__theme = "MessageBox" + setting["theme"];
			}
			var customClass = {};
			if(setting.hasOwnProperty("customClass"))
			{
				customClass = setting["customClass"];
				if(!customClass)
				{
					customClass = {};
				}
			}
			this.__customClass = {messageBody:customClass["messageBody"] || null,
								  messageFooter:customClass["messageFooter"] || null,
								  messageFooterLeft:customClass["messageFooterLeft"] || null,
								  messageFooterRight:customClass["messageFooterRight"] || null};
		}
	};
	
	NSMessageBox.prototype.__createStructure = function()
	{
		this.__createBody();
	};
	
	NSMessageBox.prototype.__createBody = function()
	{
		this.__divContainer = this.util.createDiv(this.__id + "MessageBoxContainer","nsMessageBoxContainer");
		this.__divBody = this.util.createDiv(this.__id + "messageBody","nsMessageBoxBody");
		this.__divFooter = this.util.createDiv(this.__id + "messageFooter","nsMessageBoxFooter");
		this.__divContainer.appendChild(this.__divBody);
		this.__divContainer.appendChild(this.__divFooter);
	};
	
	NSMessageBox.prototype.__createNSPanel = function(setting)
	{
		if(!setting["customClass"])
		{
			setting["customClass"] = {};
		}
		setting["customClass"]["titleBar"] = setting["customClass"]["titleBar"] ? setting["customClass"]["titleBar"] : "nsMessageBoxHeader";
		setting["customClass"]["titleBarContent"] = setting["customClass"]["titleBarContent"] ? setting["customClass"]["titleBarContent"] : "nsMessageBoxTitle";
		if(!setting["toolBarDetails"])
		{
			setting["toolBarDetails"] = {};
		}
		setting["toolBarDetails"]["close"] = setting["toolBarDetails"]["close"] ? setting["toolBarDetails"]["close"] : {iconHTML:'<button type="button" class="nsMessageBoxClose">&times;</button>',title:"Close"};
		setting["content"] = this.__divContainer;
		setting["template"] = null;
		setting["templateUrl"] = null;
		setting["enablePopUp"] = true;
		setting["enableModal"] = true;
		this.__nsPanel = new NSPanel(null,setting);
		this.__baseComponent =  this.__nsPanel.getBaseElement();
		this.util.addEvent(this.__baseComponent,NSPanel.CLOSED,this.__panelClosedHandled.bind(this));
		this.util.addStyleClass(this.__baseComponent,"nsMessageBox");
		//this.__applyTheme(this.__baseComponent,"nsMessageBox");
	};
	
	NSMessageBox.prototype.__panelClosedHandled = function(event)
	{
		if(this.__baseComponent && this.__baseComponent.parentNode)
		{
			this.__baseComponent.parentNode.removeChild(this.__baseComponent);
		}
	};
	
	NSMessageBox.prototype.__setBodyContent = function(content,templateID,templateUrl,component,componentData)
	{
		if(this.__divBody)
		{
			if(!this.__divBody.parentElement) {
				this.__divContainer.appendChild(this.__divBody);
			}
			this.__divBody.innerHTML = "";
			this.__applyCustomClass(this.__divBody,"messageBody");
			if(content)
			{
				if(this.util.isString(content))
				{
					var compSpan = document.createElement("span");
					compSpan.innerHTML = content;
					this.__divBody.appendChild(compSpan);
				}
				else
				{
					this.__divBody.appendChild(content);
				}
			}
			else if(templateID && templateID.length > 0)
			{
				this.__divBody.appendChild(this.util.getTemplate(templateID));
			}
			else if(templateUrl && templateUrl.length > 0)
			{
				var self = this;
				var templateLoadHandler = function(templateText)
				{
					if(templateText)
					{
						self.__divBody.innerHTML = templateText;
					}
					else
					{
						console.error(templateUrl + " was not loaded.Please check the URL");
					}
				};
				var templateErrorHandler = function(errorText)
				{
					console.error(templateUrl + " was not loaded.Please check the URL");
				};
				this.util.getTemplateFromURL(templateUrl,templateLoadHandler,templateErrorHandler);
			}
			else if(component)
			{
				var callback = function(component)
				{
					if(this.__bodyCompInstance)
					{
						this.__bodyCompInstance = null;
					}
					this.__bodyCompInstance = new component();
					var retVal = this.__callEditorFunction(this.__bodyCompInstance,"init",componentData);
					var initCallback = function(bodyCompInstance)
					{
						if(!this.__bodyCompInstance) {
							this.__bodyCompInstance = bodyCompInstance;
						}
						var element = this.__bodyCompInstance.getElement();
						this.__divBody.appendChild(element);
						this.__callEditorFunction(this.__bodyCompInstance,"elementAdded");
						var config = {instance: this.__bodyCompInstance,parentComp: this,element: element};
						this.__bodyCompInstance[this.__getAttributeKey("config")] = config;
					};
					this.util.resolveFunctionOrPromise(retVal,initCallback.bind(this));
				};
				this.util.resolveFunctionOrPromise(component,callback.bind(this));
			}
		}
	};
	
	NSMessageBox.prototype.__callEditorFunction = function(editor,functionRef,param,defaultValue)
	{
		if(editor && editor[functionRef] && this.util.isFunction(editor[functionRef]))
		{
			var retValue = null;
			if(param && this.util.isArray(param) && param.length > 0)
			{
				retValue = editor[functionRef].apply(null,param);
			}
			else
			{
				retValue = editor[functionRef](param);
			}
			if(!this.util.isUndefinedOrNull(retValue))
			{
				return retValue;
			}
		}
		return defaultValue;
	};
	
	NSMessageBox.prototype.__getAttributeKey = function(key)
	{
		return "__" + "ns_msg_field" + "_" + key;
	};
	
	NSMessageBox.prototype.__setFooterContent = function(arrButtons)
	{
		if(this.__divFooter)
		{
			if(!this.__divFooter.parentElement) {
				this.__divContainer.appendChild(this.__divFooter);
			}
			this.__divFooter.innerHTML = "";
			this.__applyCustomClass(this.__divFooter,"messageFooter");
			if(arrButtons)
			{
				var divLeft = this.util.createDiv(null,"nsMessageBoxFooterLeft");
				this.__applyCustomClass(divLeft,"messageFooterLeft");
				this.__divFooter.appendChild(divLeft);
				var divRight = this.util.createDiv(null,"nsMessageBoxFooterRight");
				this.__applyCustomClass(divRight,"messageFooterRight");
				this.__divFooter.appendChild(divRight);
				var item = null;
				var divButton = null;
				var button = null;
				var label =  null;
				for(var index = 0;index < arrButtons.length;index++)
				{
					item = arrButtons[index];
					divButton = this.util.createDiv(null,"nsMessageBoxButtonContainer");
					if(item["parentCssClass"])
					{
						this.util.addStyleClass(divButton, item["parentCssClass"]);
					}
					button = this.util.createElement("button");
					label = item["label"];
					button.innerHTML = label;
					if(item["cssClass"])
					{
						button.setAttribute("class",item["cssClass"]);
					}
					if(item["callback"])
					{
						this.util.addEvent(button,"click",item["callback"]);
					}
					divButton.appendChild(button);
					this.__arrButtonInstance.push({button: button,divButton: divButton,item: item,label: label});
					if(item["horizontalAlign"] || item["horizontalAlign"] == "left")
					{
						divLeft.appendChild(divButton);
					}
					else
					{
						divRight.appendChild(divButton);
					}
				}
			}
		}
	};
	
	NSMessageBox.prototype.__applyCustomClass = function(element,type)
	{
		if(element && type && this.__customClass[type])
		{
			this.util.addStyleClass(element,this.__customClass[type]);
		}
	};
	
	NSMessageBox.prototype.__createMessageBox = function(setting)
	{
		if(this.__setting)
		{
			var arrKeys = Object.keys(this.__setting);
			for(var index = 0;index < arrKeys.length;index++)
			{
				if(this.util.isUndefinedOrNull(setting[arrKeys[index]]))
				{
					setting[arrKeys[index]] = this.__setting[arrKeys[index]];
				}
			}
		}
		if(!setting.hasOwnProperty("theme"))
		{
			setting["theme"] = "White";
		}
		setting["theme"] = "MessageBox" + setting["theme"];
		this.__setSetting(setting);
		this.__createNSPanel(setting);
		this.__setBodyContent(setting["bodyContent"],setting["bodyTemplate"],setting["bodyTemplateUrl"],setting["bodyComponent"],setting["bodyComponentData"]);
		this.__setFooterContent(setting["buttons"]);
		this.__nsPanel.open();
	};
	
	NSMessageBox.prototype.__alert = function(config)
	{
		var self = this;
		var okHandler = function(event)
		{
			event = self.util.getEvent(event);
			event.stopImmediatePropagation();
			self.close();
			if(config["callback"])
			{
				config["callback"](event);
			}
		};
		if(!config)
		{
			config = {};
		}
		config.buttons = [{label:config["buttonLabel"] || "OK",cssClass:config["buttonClass"],parentCssClass: config["parentClass"],horizontalAlign: config["horizontalAlign"],callback:okHandler.bind(this)}];
		this.__createMessageBox(config);
	};
	
	NSMessageBox.prototype.__confirm = function(config)
	{
		var self = this;
		var confirmHandler = function(event)
		{
			event = self.util.getEvent(event);
			event.stopImmediatePropagation();
			self.close();
			if(config["confirm"]["callback"])
			{
				config["confirm"]["callback"](event);
			}
		};
		var cancelHandler = function(event)
		{
			event = self.util.getEvent(event);
			event.stopImmediatePropagation();
			self.close();
			if(config["cancel"]["callback"])
			{
				config["cancel"]["callback"](event);
			}
		};
		if(!config)
		{
			config = {};
		}
		if(!config["confirm"])
		{
			config["confirm"] = {};
		}
		if(!config["cancel"])
		{
			config["cancel"] = {};
		}
		config.buttons = [{label:config["confirm"]["label"] || "OK",cssClass:config["confirm"]["cssClass"] || "",parentCssClass: config["confirm"]["parentCssClass"] || "",horizontalAlign: config["confirm"]["horizontalAlign"],callback:confirmHandler.bind(this)},
                		  {label:config["cancel"]["label"] || "Cancel",cssClass:config["cancel"]["cssClass"] || "",parentCssClass: config["cancel"]["parentCssClass"] || "",horizontalAlign: config["cancel"]["horizontalAlign"],callback:cancelHandler.bind(this)}
						 ];
		this.__createMessageBox(config);
	};
	
	return NSMessageBox;
})();
nsModuleExport(__nsGlobal,"NSMessageBox",NSMessageBox);