
var nsGroup = Object.create(nsUIComponent);

nsGroup.initializeComponent = function() 
{
	this.base.initializeComponent();
	console.log("In initializeComponent");
	var checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.name = "name";
	checkbox.value = "value";
	checkbox.id = "id";

	var label = document.createElement('label')
	label.htmlFor = "id";
	label.appendChild(document.createTextNode('Check'));

	this.appendChild(checkbox);
	this.appendChild(label);
};

document.registerElement('ns-group', {prototype: nsGroup});
