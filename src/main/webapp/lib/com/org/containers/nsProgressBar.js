var nsProgressBar = Object.create(nsContainerBase);

nsProgressBar.initializeComponent = function() 
{
	this.base.initializeComponent();
	this.__modal = null;
	this.__divParentLoader = null;
	this.__divMessage = null;
	this.__divLoader = null;
	this.__divLoaderBar = null;
	this.__divLoaderText = null;
	
	this.__modal = document.createElement("ns-modal");
	this.util.addEvent(this.__modal,"CLOSE",this.__modalCloseHandler.bind(this));
};

nsProgressBar.setComponentProperties = function() 
{
	this.base.setComponentProperties();
};

nsProgressBar.propertyChange = function(attrName, oldVal, newVal, setProperty) 
{
	this.base.propertyChange(attrName, oldVal, newVal, setProperty);
};

nsProgressBar.show = function(bodyTemplateID,title,isTitleRequired,isDragable)
{
	this.__createParentLoader(bodyTemplateID);
	this.__modal.showModal(this.__divParentLoader,title,isTitleRequired,true,true,isDragable);
};

nsProgressBar.remove = function()
{
	this.__modal.closeModal();
};

nsProgressBar.progressBarCallBack = function(filesDownloaded,totalFiles)
{
	var progressBarText = Math.round((filesDownloaded * 100)/totalFiles) + "% downloaded";
	var progressBarWidth = Math.round((filesDownloaded * 100)/totalFiles);
	this.__divLoaderBar.style.width = progressBarWidth + '%';
	this.__divLoaderText.innerHTML = progressBarText;
};

nsProgressBar.__createParentLoader = function(bodyTemplateID)
{
	this.__divParentLoader = this.util.createDiv("divParentLoader");
	this.__divParentLoader.style.padding = "25px";
	this.__divParentLoader.style.paddingTop = "7%";
	this.__divParentLoader.appendChild(this.__createLoader());
	if(bodyTemplateID)
	{
		this.__divMessage = this.util.createDiv("divMessage");
		this.util.addTemplateInContainer(this.__divMessage,bodyTemplateID);
		this.__divParentLoader.appendChild(this.__divMessage);
	}
	return this.__divParentLoader;
};

nsProgressBar.__createLoader = function()
{
	this.__divLoader = this.util.createDiv("divLoader","nsProgressBarLoader");
	this.__divLoader.style.width = "100%";
	this.__createLoaderBar();
	this.__divLoader.appendChild(this.__divLoaderBar);
	this.__createLoaderText();
	this.__divLoader.appendChild(this.__divLoaderText);
	
	return this.__divLoader;
};

nsProgressBar.__createLoaderBar = function()
{
	this.__divLoaderBar = this.util.createDiv("divLoaderBar","nsProgressBarLoaderBar");	
};

nsProgressBar.__createLoaderText = function()
{
	this.__divLoaderText = this.util.createDiv("divLoaderText","nsProgressBarLoaderText");	
};

nsProgressBar.__modalCloseHandler = function(event)
{
	this.util.dispatchEvent(this,"CLOSE");
};

document.registerElement("ns-progressbar", {prototype: nsProgressBar});