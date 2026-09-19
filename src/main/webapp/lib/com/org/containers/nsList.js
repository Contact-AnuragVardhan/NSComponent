"use strict";
var nsList = Object.create(nsContainerBase);

nsList.initializeComponent = function() 
{
	this.base.initializeComponent();
	this.ITEM_SELECTED = "itemSelected";
	this.ITEM_UNSELECTED = "itemUnselected";
	this.ITEM_NAVIGATED = "itemNavigated";
	this.NAVIGATION_UP = "up";
	this.NAVIGATION_DOWN = "down";
	this.ITEM_DROPPING = "itemDropping";
	this.ITEM_DROPPED = "itemDropped";
	this.DRAG_STARTED = "dragStarted";
	this.DRAG_END = "dragEnd";
	
	this.__nsList = null;
};

nsList.setSetting = function(setting)
{
	this.__nsList = new NSList(this,setting);
	this.base.__setPrototype(this.__nsList);
};

nsList.dataSource = function(source)
{
	this.__nsList.dataSource.call(this.__nsList,source);
};

nsList.removeItems = function(arrObject)
{
	this.__nsList.removeItems.call(this.__nsList,arrObject);
};

nsList.setSelectedIndex = function(selectedIndex,animationRequired)
{
	this.__nsList.setSelectedIndex.call(this.__nsList,selectedIndex,animationRequired);
};

nsList.getSelectedIndex = function()
{
	return this.__nsList.getSelectedIndex.call(this.__nsList);
};

nsList.getSelectedItem = function()
{
	return this.__nsList.getSelectedItem.call(this.__nsList);
};

nsList.getSelectedIndexes = function()
{
	return this.__nsList.getSelectedIndexes.call(this.__nsList);
};

nsList.getSelectedItems = function()
{
	return this.__nsList.getSelectedItems.call(this.__nsList);
};

nsList.deselectAll = function()
{
	this.__nsList.deselectAll.call(this.__nsList);
};

nsList.filter = function(strData,setting,enableHighlighting,recordLimit)
{
	this.__nsList.filter.call(this.__nsList,strData,setting,enableHighlighting,recordLimit);
};

nsList.resetFilter = function()
{
	this.__nsList.resetFilter.call(this.__nsList);
};

document.registerElement("ns-list", {prototype: nsList});