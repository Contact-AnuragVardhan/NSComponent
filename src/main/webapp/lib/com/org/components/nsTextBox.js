var nsTextBox = Object.create(nsContainerBase);

nsTextBox.initializeComponent = function() 
{
	this.base.initializeComponent();
	this.ITEM_SELECTED = "itemSelected";
	this.ITEM_UNSELECTED = "itemUnselected";
	this.TYPE_AUTOTEXT = "text";
	this.TYPE_AUTOCOMPLETE = "autocomplete";
	this.TYPE_EMAIL = "email";
	this.TYPE_NUMBER = "number";
	this.TYPE_PASSWORD = "password";
	this.TYPE_URL = "url";
	
	this.__nsTextBox = null;
};

nsTextBox.setSetting = function(setting)
{
	this.__nsTextBox = new NSTextBox(this,setting);
	this.base.__setPrototype(this.__nsTextBox);
};

nsTextBox.dataSource = function(source)
{
	this.__nsTextBox.dataSource.call(this.__nsTextBox,source);
};

nsTextBox.setText = function(text)
{
	this.__nsTextBox.setText.call(this.__nsTextBox,text);
};

nsTextBox.getText = function()
{
	return this.__nsTextBox.getText.call(this.__nsTextBox);
};

nsTextBox.getSelectedItem = function()
{
	return this.__nsTextBox.getSelectedItem.call(this.__nsTextBox);
};

nsTextBox.getSelectedItems = function()
{
	return this.__nsTextBox.getSelectedItems.call(this.__nsTextBox);
};

document.registerElement("ns-textBox", {prototype: nsTextBox});