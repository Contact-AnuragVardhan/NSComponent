var NSEditorLink = (function()
{	
	var NSEditorLink = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		
		this.name = "link";
		this.__config = null;
		
		this.__modal = null;
		this.__divBody = null;
		this.__divFooter = null;
		this.__id = null;
		
		this.setSettings = function()
		{
			var self = this;
			var setting = this.__nsEditor.__setting.link;
			if(!setting)
			{
				setting = {};
			}
			this.__config = {
					protocol: setting["protocol"]
			    };
			this.__nsEditor.__toolBarButton["link"] = {html:"<i class='ns-icon ns-editor-link' aria-hidden='true'></i>",tooltip:"Link",showAsMenu: true,
												  checkDisability: function(toolBarKey,toolBarItem,item,itemKey,isDefaultDisabled)
												  {
													  if(itemKey === "viewSourceCode")
													  {
														  return true;
													  }
													  return false;
												  },
												  click:function(item,key,event)
												  {
													  self.selection.saveSelection();
													  self.__createElements();
												  }};
		};
		
		this.initialize = function()
		{
			this.__id = this.__nsEditor.getID() + this.name;
		};
		
		this.componentsInitialized = function()
		{
			
		};
		
		this.resized = function(event)
		{
			
		};
		
		this.destroy = function()
		{
			
		};
		
		this.__createElements = function()
		{
			if(!this.__modal)
			{
				var setting = {title: "Add Link",contentCSSClass:"nsEditorLinkModalContent",enableReset: false,contentCallback: this.__getBody.bind(this),footerCallback: this.__getFooter.bind(this)}
				this.__modal = this.__nsEditor.__getUtilInstance("modal","linkModal",this.name,this,setting);
			}
			this.__modal.toggle();
		};
		
		this.__getBody = function(objModal,objLink)
		{
			if(!this.__divBody)
			{
				this.__divBody = this.util.createDiv(this.__id + "LinkModalContentContainer","nsEditorLinkModalContentContainer");
				var html = '<div class="nsEditorLinkModalContentForm">' +
		                        '<label class="nsEditorLinkModalContentFormLabel">URL</label>' +
		                        '<input id="##id##TxtUrl" class="nsEditorLinkModalContentFormTextBox" type="text" />' +
		                    '</div>' +
		                    '<div class="nsEditorLinkModalContentForm">' +
		                        '<label class="nsEditorLinkModalContentFormLabel">Text to display</label>' +
		                    	'<input id="##id##TxtText" class="nsEditorLinkModalContentFormTextBox" type="text" />' +
		                    '</div>' +
		                    '<div class="nsEditorLinkModalContentFormLast">' +
		                        '<label class="nsEditorLinkModalContentFormLabel">' +
		                    		'<input id="##id##ChkNewWindow" type="checkbox" class="nsEditorLinkModalContentFormCheckbox" checked />&nbsp; Open in new tab or window' + 
		                    		'</label>' +
		                    '</div>';
				html = html.replaceAll("##id##",this.__id);
				this.__divBody.innerHTML = html;
			}
	        return this.__divBody;
		};
		
		this.__getFooter = function(objModal,objLink)
		{
			if(!this.__divFooter)
			{
				this.__divFooter = this.util.createDiv(null,"nsEditorLinkFooterContainer");
				this.__divFooter.innerHTML = "<button class=\"nsEditorPrimaryButton nsEditorLinkFooterButton\" title=\"Submit\"><span>Submit</span></button>";
				var btnSubmit = this.__divFooter.querySelector(".nsEditorLinkFooterButton");
				this.util.addEvent(btnSubmit,"click",this.__submitHandler.bind(this));
			}
			return this.__divFooter;
		};
		
		this.__submitHandler = function(event)
		{
			this.editorUtil.stopEvent(event);
			var txtUrl = this.__divBody.querySelector("#" + this.__id + "TxtUrl");
			var txtText = this.__divBody.querySelector("#" + this.__id + "TxtText");
			var chkNewWindow = this.__divBody.querySelector("#" + this.__id + "ChkNewWindow");
			if(txtUrl.value && txtUrl.value.trim().length)
			{
				var url = this.__getLink(txtUrl.value.trim(),this.__config.protocol);
				var anchor = this.util.createElement("a");
				anchor.href = url;
				anchor.textContent = (txtText.value.trim().length) ? txtText.value.trim() : txtUrl.value.trim();
				anchor.target = (chkNewWindow.checked ? "_blank" : "");
				this.__insertLink(anchor);
			}
		};
		
		this.__getLink = function(value,protocol)
		{
	        value = value.trim();
	        var url = !value ? "" : (protocol && value.indexOf('://') === -1 && value.indexOf('#') !== 0) ? protocol + value : value.indexOf('://') === -1 ? '/' + value : value;
	        return url;
		};
		
		this.__insertLink = function(link)
		{
			var arrEvents = [{name:"closeAllPopups"}];
			var config = {insertAfterSelectedNode: false,dispatchEvents: arrEvents};
			this.__nsEditor.__addElement(link,config);
		};
	};
	
	NSEditor.prototype.registerPlugin("link",NSEditorLink);
	
	return NSEditorLink;
})();
nsModuleExport(__nsGlobal,"NSEditorLink",NSEditorLink);