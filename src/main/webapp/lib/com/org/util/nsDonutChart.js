function NSDonutChart(nsChart,nsUtil)
{
	this.__nsChart = nsChart;
	this.util = nsUtil;
};

NSDonutChart.prototype.__create = function()
{
	var HALFPIE = Math.PI * .4999;
	var PIE = HALFPIE * 2;
	var TWOPIE = PIE * 2;
	var nsChart = this.__nsChart;
	var self = this;
	var createSVG = function()
	{
		var svg = nsChart.__createSVG.bind(nsChart)(id + "svg",null,width,height,null);
		return svg;
	};
	var getColor = function(index)
    {
    	var color = (properties.colors.length === data.length) ? properties.colors[index] : properties.colors[0];
    	return color;
    };
	var createSection = function()
	{
		var lineWidth = 1; 
    	var strokestyle = "rgba(0,0,0,0)";
		var startAngle = 0;
        var endAngle = 0;
        var angle = 0;
        var sum = nsChart.__sumArray(data);
        var section = 0;
        var color = "";

	    
        //In case sections are top of shadow
	    if (drawShadow) 
	    {
	    	drawShadow = false;
	    	createSection();
	    }
	};
	var createLabel = function()
	{
		var xPos = 0,yPos = 0,vAlign = "",hAlign = "";
	    for (var count = 0;count < self.__sectionDetails.length;count++) 
	    {
	    	var endpoint = nsChart.__getRadiusEndPoint(self.__sectionDetails[count].halfway - HALFPIE,self.__sectionDetails[count].radius + 15);
	    	xPos = endpoint[0] + self.__sectionDetails[count].cx;
	        yPos = endpoint[1] + self.__sectionDetails[count].cy;
	        if (self.__sectionDetails[count].halfway > 0 && self.__sectionDetails[count].halfway < HALFPIE) 
	        {
	        	hAlign = "left";
	        	vAlign = "bottom";
	        } 
	        else if (self.__sectionDetails[count].halfway > HALFPIE && self.__sectionDetails[count].halfway < PIE) 
	        {
	        	hAlign = "left";
	            vAlign = "top";
	        } 
	        else if (self.__sectionDetails[count].halfway > PIE && self.__sectionDetails[count].halfway < (HALFPIE + PIE)) 
	        {
	        	hAlign = "right";
	            vAlign = "top";
	        } 
	        else if (self.__sectionDetails[count].halfway > (HALFPIE + PIE) && self.__sectionDetails[count].halfway < TWOPIE) 
	        {
	        	hAlign = "right";
	            vAlign = "top";
	        }
	        
	        nsChart.__createText({
            	parent:svg,
                text:properties.labels[count],
                xPos:xPos,
                yPos:yPos,
                valign:vAlign,
                halign:hAlign,
                size:(typeof properties.textSetting.size === "number" ? properties.textSetting.size + "pt" : properties.textSetting.size),
                isItalic: properties.textSetting.isItalic,
                font: properties.textSetting.font,
                isBold: properties.textSetting.isBold,
                color: properties.textSetting.color
            });
	    }
	};
	var createChart = function()
	{
		properties.graphWidth = width - properties.gutterLeft - properties.gutterRight;
		properties.graphHeight = height - properties.gutterTop - properties.gutterBottom;
        centerX = (properties.graphWidth / 2) + properties.gutterLeft;
        centerY = (properties.graphHeight / 2) + properties.gutterTop;
        radius  = Math.min(properties.graphWidth, properties.graphHeight) / 2;
        // convert separation to array if not
        if (typeof properties.separation === "number" && properties.separation > 0) 
		{
            var separation = properties.separation;
            properties.separation = [];
            for (var count = 0;count < data.length; count++) 
            {
            	properties.separation[count] = separation;
            }
        }
        drawShadow = properties.enableShadow;
        createSection();
        if(properties.title && properties.title.length > 0)
        {
        	nsChart.__createTitle.bind(nsChart)(svg,properties.title,width,properties.gutterTop,properties.titleSetting)
        }
        createLabel();
	};
	var option = nsChart.__option;
	if(option && option["data"] && option["data"].length > 0)
	{
		option["textSetting"] = option["textSetting"] ? option["textSetting"] : {}; 
		option["titleSetting"] = option["titleSetting"] ? option["titleSetting"] : {};
		option["shadowSetting"] = option["shadowSetting"] ? option["shadowSetting"] : {};
		
		var properties =
	    {
	        gutterLeft: this.util.isUndefinedOrNull(option["gutterLeft"]) ? 25 : parseInt(option["gutterLeft"]),
	        gutterRight: this.util.isUndefinedOrNull(option["gutterRight"]) ? 25 : parseInt(option["gutterRight"]),
	        gutterTop: this.util.isUndefinedOrNull(option["gutterTop"]) ? 25 : parseInt(option["gutterTop"]),
	        gutterBottom: this.util.isUndefinedOrNull(option["gutterBottom"]) ? 25 : parseInt(option["gutterBottom"]),
	        colors: (option["colors"] && option["colors"].length > 0) ? option["colors"] : ["black"],
	        margin: this.util.isUndefinedOrNull(option["margin"]) ? 3 : parseInt(option["margin"]),
	        labels:option["labels"] || [],
	        textSetting:{
	        	color: option["textSetting"]["font"] || "black",
	            font: option["textSetting"]["font"] || "Arial,Verdana,Segoe UI,sans-serif",
	            size: this.util.isUndefinedOrNull(option["textSetting"]["size"]) ? 12 : parseInt(option["textSetting"]["size"]),
	            isBold: Boolean.parse(option["textSetting"]["isBold"]),
	            isItalic: Boolean.parse(option["textSetting"]["isItalic"]),
	        },
	        title: option["title"] || "",
	        titleSetting:{
	            size:this.util.isUndefinedOrNull(option["titleSetting"]["xOffset"]) ? 16 : parseInt(option["titleSetting"]["xOffset"]),
	            xPos:this.util.isUndefinedOrNull(option["titleSetting"]["xPos"]) ? null : parseInt(option["titleSetting"]["xPos"]),
	            yPos:this.util.isUndefinedOrNull(option["titleSetting"]["yPos"]) ? null : parseInt(option["titleSetting"]["yPos"]),
	            halign:option["titleSetting"]["halign"] || "center",
	            valign:option["titleSetting"]["valign"] || "bottom",
	            color:option["titleSetting"]["color"] || "black",
	            isBold:Boolean.parse(option["titleSetting"]["isBold"]),
	            isItalic:Boolean.parse(option["titleSetting"]["isItalic"]),
	            font:option["titleSetting"]["font"] || null,
	        },
	        enableShadow:Boolean.parse(option["enableShadow"]),
	        shadowSetting:{
	        	xOffset: this.util.isUndefinedOrNull(option["shadowSetting"]["xOffset"]) ? 2 : parseInt(option["shadowSetting"]["xOffset"]),
	            yOffset: this.util.isUndefinedOrNull(option["shadowSetting"]["yOffset"]) ? 2 : parseInt(option["shadowSetting"]["yOffset"]),
	            blur: this.util.isUndefinedOrNull(option["shadowSetting"]["blur"]) ? 2 : parseInt(option["shadowSetting"]["blur"]),
	            opacity: this.util.isUndefinedOrNull(option["shadowSetting"]["opacity"]) ? 0.25 : parseFloat(option["shadowSetting"]["opacity"]),
	        },
	        //separation can be array if entered by user or number if it wants to apply on all section 
	        separation: this.util.isUndefinedOrNull(option["separation"]) ? 0 : option["separation"],
	    };
		var id = nsChart.__getID();
		var element = nsChart.__element;
		var data = option["data"];
		var width = element.offsetWidth;
		var height = element.offsetHeight;
		var centerX = 0;
        var centerY = null;
        var radius =  null;
        var drawShadow = false;
		var svg = createSVG();
		var def = nsChart.__createDef(svg);
		this.__sectionDetails = [];
		
		element.style.display = "inline-block";
		createChart();
		element.appendChild(svg);
	}
};