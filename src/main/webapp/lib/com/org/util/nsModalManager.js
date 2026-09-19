"use strict";
var NSModalManager = (function()
{
	function NSModalManager() 
	{
		var self = this;
		var context = window;
		var arrModal = [];
		
		var alert = function(message,title,callback,setting)
		{
			var nsAlert = new NSMessageBox(setting);
			nsAlert.alert(message,title,callback);
			formatMessageBox(nsAlert);
			arrModal.push(nsAlert);
			return nsAlert;
		};
		
		var confirm = function(message,title,confirmCallback,cancelCallback,setting)
		{
			var nsConfirm = new NSMessageBox(setting);
			nsConfirm.confirm(message,title,confirmCallback,cancelCallback);
			formatMessageBox(nsConfirm);
			arrModal.push(nsConfirm);
			return nsConfirm;
		};
		
		var custom = function(setting)
		{
			var nsCustom = new NSMessageBox();
			nsCustom.custom(cancelCallback);
			formatMessageBox(nsCustom);
			arrModal.push(nsCustom);
			return nsCustom;
		};
		
		var formatMessageBox = function(msgBox)
		{
			if(msgBox)
			{
				var util = new NSUtil();
				util.addEvent(window,NSPanel.CLOSED,closeHandler);
			}
		};
		
		var closeHandler = function(event)
		{
			var item = event.item;
			
		};
		
		self.alert = alert;
		self.confirm = confirm;
		self.custom = custom;
	};

	return NSModalManager;
})();
nsModuleExport(__nsGlobal,"NSModalManager",NSModalManager);