"use strict"; 
var nsPanel = Object.create(nsContainerBase);
//http://codepen.io/zz85/pen/gbOoVP
//http://jsfiddle.net/3jMQD/
//https://github.com/zz85/sparks.js
nsPanel.initializeComponent = function() 
{
	this.base.initializeComponent();
	this.DRAG_STARTING = "dragStaring";
	this.DRAGGING = "dragging";
	this.DRAG_END = "dragEnd";
	this.RESIZE_STARTING = "resizeStaring";
	this.RESIZING = "resizing";
	this.RESIZE_END = "resizeEnd";
	this.MINIMIZE_STARTING = "minimizeStarting";
	this.MINIMIZE_END = "minimizeEnd";
	this.MAXIMIZE_STARTING = "maximizeStarting";
	this.MAXIMIZE_END = "maximizeEnd";
	
	this.__nsPanel = null;
};

nsPanel.setSetting = function(setting)
{
	this.__nsPanel = new NSPanel(this,setting);
	this.base.__setPrototype(this.__nsPanel);
};

nsPanel.openModal = function()
{
	this.__nsPanel.openModal.call(this.__nsPanel);
};

nsPanel.closeModal = function()
{
	this.__nsPanel.closeModal.call(this.__nsPanel);
};

document.registerElement("ns-panel", {prototype: nsPanel});