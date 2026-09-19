"use strict";
function NSChart(element,option) 
{
	this.__element = element;
	this.__option = option;
	this.util = new NSUtil();
	this.__id = null;
	this.__nsChartComp = null;
	
	this.namespace = "http://www.w3.org/2000/svg";
	this.xmlns = "http://www.w3.org/2000/xmlns/";
	this.xlink = "http://www.w3.org/1999/xlink";
	this.version = "1.2";
	
	this.base.__setBaseComponent.call(this,element);
};

nsExtendPrototype(NSContainerBase,NSChart);
NSChart.prototype.constructor = NSChart;

NSChart.prototype.initializeComponent = function() 
{
	this.base.initializeComponent.call(this);
	this.__setSetting();
};

NSChart.prototype.setComponentProperties = function() 
{
	this.base.setComponentProperties.call(this);
	this.__initialize();
};

NSChart.prototype.propertyChange = function(attrName, oldVal, newVal, setProperty)
{
	var attributeName = attrName.toLowerCase();
	this.base.propertyChange.call(this,attrName, oldVal, newVal, setProperty);
};

NSChart.prototype.componentResized = function(event) 
{
	this.base.componentResized(event);
};

NSChart.prototype.removeComponent = function() 
{
	this.base.removeComponent.call(this);
};

NSChart.prototype.__setSetting = function()
{
};

NSChart.prototype.__initialize = function()
{
	if(this.__element && this.__option && this.__option["type"])
	{
		switch(this.__option["type"]) 
		{
		    case "bar":
		    	this.__nsChartComp = new NSBarChart(this,this.util);
		        break;
		    case "pie":
		    	this.__nsChartComp = new NSPieChart(this,this.util);
		        break;
		    case "line":
		    	this.__nsChartComp = new NSLineChart(this,this.util);
		        break;
		    case "donut":
		    	this.__nsChartComp = new NSDonutChart(this,this.util);
		        break;
		}
		if(this.__nsChartComp)
		{
			this.__nsChartComp.__create();
		}
	}
};

NSChart.prototype.__getID = function()
{
	if(!this.__id)
	{
		if(this.__element.hasAttribute("id"))
		{
			this.__id = this.__element.getAttribute("id");
		}
		else if(this.__element.hasAttribute("name"))
		{
			this.__id = this.__element.getAttribute("name");
		}
		else
		{
			this.__id = "comp" + this.util.getUniqueId();
		}
	}
	return this.__id;
};

NSChart.prototype.__getGraphScale = function(setting)
{
    var labelCount   = setting.labelCount,
        max          = Number(setting.max),
        min          = Number(setting.min),
        isNumber     = setting.isNumber,
        decimals     = Number(setting.decimals),
        scale        = {max:1,labels:[],values:[]},
        callback     = setting.callback;
    /**
    * Special case for 0
    * 
    * ** Must be first **
    */
    if (!max) 
    {
        var max = 1;
        var value = "";
        for (var count = 0; count < labelCount;count++) 
        {
            value = ((((max - min) / labelCount) + min) * (count + 1)).toFixed(decimals);
            scale.labels.push(this.__getAxisLabel(value,callback));
            scale.values.push(parseFloat(value))
        }
    }
    /**
     * Manually do decimals
     */
	else if (max <= 1 && !isNumber) 
	{
        var arr = [
            1,0.5,
            0.10,0.05,
            0.010,0.005,
            0.0010,0.0005,
            0.00010,0.00005,
            0.000010,0.000005,
            0.0000010,0.0000005,
            0.00000010,0.00000005,
            0.000000010,0.000000005,
            0.0000000010,0.0000000005,
            0.00000000010,0.00000000005,
            0.000000000010,0.000000000005,
            0.0000000000010,0.0000000000005
        ];
        for (var i=0; i<arr.length; ++i) 
        {
            if (max > arr[i]) 
            {
                i--;
                break;
            }
        }
        scale.max = arr[i];
        var value = 0;
        for (var count = 0; count < labelCount;count++) 
        {
            value = ((((arr[i] - min) / labelCount) * (count + 1)) + min).toFixed(decimals);
            scale.labels.push(this.__getAxisLabel(value,callback));
            scale.values.push(parseFloat(value));
        }
    } 
    /**
     * Now comes the scale handling for integer values
     */
	else if (!isNumber) 
	{
        // This accomodates decimals by rounding the max up to the next integer
		var originalMax  = max,
        max = Math.ceil(max);
        var interval = Math.pow(10, Math.max(1, Number(String(Number(max) - Number(min)).length - 1)) );
        var topValue = interval;
        while (topValue < max) 
        {
            topValue += (interval / 2);
        }
        // Handles cases where the max is (for example) 50.5
        if (Number(originalMax) > Number(topValue)) 
        {
            topValue += (interval / 2);
        }
        // Custom if the max is greater than 5 and less than 10
        if (max <= 10) 
        {
            topValue = (Number(originalMax) <= 5 ? 5 : 10);
        }
        scale.max = topValue;
        var value = 0;
        for (var count = 0; count < labelCount;count++) 
        {
        	value = ((((count+1) / labelCount) * (topValue - min)) + min).toFixed(decimals);
            scale.labels.push(this.__getAxisLabel(value,callback));
            scale.values.push(parseFloat(value));
        }
    }
    /**
     * ymax is set and also isNumber
     */
	else if (typeof max === "number" && isNumber) 
	{
		var value = 0;
		for (var count = 0; count < labelCount;count++) 
        {
			value = ((((count + 1) / labelCount) * (max - min)) + min).toFixed(decimals);
            scale.labels.push(this.__getAxisLabel(value,callback));
            scale.values.push(parseFloat(value));
        }
        scale.max = max;
    }
    scale.decimals  = decimals;
    scale.labelCount = labelCount;
    scale.min       = min;
    
    return scale;
};

NSChart.prototype.__createBackground = function(svg,type,option,width,height,data)
{
    if(option.enableBackground) 
    {
    	var backgroundSetting = option.backgroundSetting;
        var arrParts = [];
        if(backgroundSetting.enableHorizontallines) 
        {
            var labelCount = option.yLabelCount;
            for (var count = 0;count < labelCount;count++) 
            {
                arrParts.push("M{1} {2} L{3} {4}".format(
                		option.gutterLeft,
                		option.gutterTop + (option.graphHeight / labelCount) * count,
                		width - option.gutterRight,
                		option.gutterTop + (option.graphHeight / labelCount) * count
                ));
            }
            // Add an extra background grid line to show label below x-axis
            arrParts.push("M{1} {2} L{3} {4}".format(
            			option.gutterLeft,
            			height - option.gutterBottom,
            			width - option.gutterRight,
            			height - option.gutterBottom
            ));
        }
        if(backgroundSetting.enableVerticalLines) 
        {
        	var length = 0; 
            if (type === "line" && this.util.isArray(data[0])) 
            {
                length = data[0].length;
            } 
            else 
            {
                length = data.length;
            }
            var labelCount = length;
            if (option.xLabelPosition === "edge") 
            {
            	labelCount--;
            }
            for (var count = 0;count < labelCount;count++) 
            {
                arrParts.push("M{1} {2} L{3} {4}".format(
                		option.gutterLeft + ((option.graphWidth / labelCount) * count),
                		option.gutterTop,
                		option.gutterLeft + ((option.graphWidth / labelCount) * count),
                		height - option.gutterBottom
                ));
            }
        }
        if (backgroundSetting.enableBorder) 
        {
            arrParts.push("M{1} {2} L{3} {4} L{5} {6} L{7} {8} z".format(
            			option.gutterLeft,
            			option.gutterTop,
            			width - option.gutterRight,
            			option.gutterTop,
            			width - option.gutterRight,
            			height - option.gutterBottom,
            			option.gutterLeft,
            			height - option.gutterBottom
            		  ));
        }
        var path = this.__createTag({
		        	parent: svg,
		            type: "path",
		            attribute: {
		                d: arrParts.join(" "),
		                stroke: backgroundSetting.color,
		                fill: "rgba(0,0,0,0)",
		                "stroke-width": backgroundSetting.lineWidth
		            }
        });
    }
};

NSChart.prototype.__createTitle = function(svg,text,width,gutterTop,option)
{
    this.__createText({
        parent:svg,
        text:text,
        size:option.size || 16,
        xPos:option.xPos || (width / 2),
        yPos:option.yPos || gutterTop - 10,
        halign:option.halign || "center",
        valign:option.valign || "bottom",
        color:option.color || "black",
        isBold:option.isBold,
        isItalic:option.isItalic,
        font:option.font
    });
};

NSChart.prototype.__createXAxis = function(svg,type,option,width,height,data,yPosCallback)
{
    if(option.enableXLabel) 
    {
        var yPos = yPosCallback(0);
        var xPos = option.gutterLeft;
        var startY = yPosCallback(0) - (option.yMin < 0 ? 3 : 0);
        var endY = yPosCallback(0) + 3;
        
        var axis = this.__createTag({
            parent: svg,
            type: "path",
            attribute:{
                d: "M{1} {2} L{3} {4}".format(
                	option.gutterLeft,
                    yPos + 0.01,
                    width - option.gutterRight,
                    yPos
                ),
                fill:option.xAxisColor,
                stroke:option.xAxisColor
            }
        });
        //tickmarks draw
        if (option.xLabelPosition === "section") 
        {
            for (var count = 0;count < data.length;count++) 
            {
            	xPos = option.gutterLeft + ((count + 1) * (option.graphWidth / data.length));
                this.__createTag({
                	parent: svg,
                    type: "path",
                    attribute: {
                        d: "M{1} {2} L{3} {4}".format(
                        	xPos + 0.001,
                            startY,
                            xPos,
                            endY
                        ),
                        stroke:option.xAxisColor
                    }
                });
            }
        }
        else if (option.xLabelPosition === "edge") 
        {
            for (var count = 0;count < (data[0].length - 1);count++) {

                var gap = ((option.graphWidth) / (data[0].length - 1));
                xPos = option.gutterLeft + ((count + 1) * gap);

                this.__createTag({
                	parent: svg,
                    type: "path",
                    attribute: {
                        d: "M{1} {2} L{3} {4}".format(
                        	xPos + 0.001,
                            startY,
                            xPos,
                            endY
                        ),
                        stroke:option.xAxisColor
                    }
                });
            }
        }
       // extra tick if the Y axis is not shown
        if(!option.enableYLabel) 
        {
            this.__createTag({
            	parent: svg,
                type: "path",
                attribute: {
                    d: "M{1} {2} L{3} {4}".format(
                    	option.gutterLeft + 0.001,
                        startY,
                        option.gutterLeft,
                        endY
                    ),
                    stroke:option.xAxisColor
                }
            });
        }
	    // X axis labels
	    if (option.xLabel) 
	    {
	        // Loop through the X labels
	        if (option.xLabelPosition === "section") 
	        {
	            var segment = (width - option.gutterLeft - option.gutterRight) / option.xLabel.length;
	            var xPos = 0; 
	            for (var count = 0;count < option.xLabel.length;count++) 
	            {
	                xPos = option.gutterLeft + (segment / 2) + (count * segment);
	                this.__createText({
	                	parent:svg,
	                    text:option.xLabel[count],
	                    xPos:xPos,
	                    yPos:height - option.gutterBottom + option.xLabelAxisGap,
	                    valign:"top",
	                    halign:"center",
	                    size:(typeof option.textSetting.size === "number" ? option.textSetting.size + "pt" : option.textSetting.size),
	                    isItalic: option.textSetting.isItalic,
	                    font: option.textSetting.font,
	                    isBold: option.textSetting.isBold,
	                    color: option.textSetting.color
	                });
	            }
	        } 
	        else if (option.xLabelPosition === "edge") 
	        {
	        	var horizontalMargin = 0;
	            if (type === "line") 
	            {
	            	horizontalMargin = option.horizontalMargin;
	            }
	            var segment = (option.graphWidth - (2 * horizontalMargin)) / (option.xLabel.length - 1);
	            var xPos = 0; 
	            for (var count = 0;count < option.xLabel.length;count++) 
	            {
	                var xPos = option.gutterLeft + (count * segment) + horizontalMargin;
	                this.__createText({
	                	parent:svg,
	                    text:option.xLabel[count],
	                    xPos:xPos,
	                    yPos:height - option.gutterBottom + option.xLabelAxisGap,
	                    valign:"top",
	                    halign:"center",
	                    size:(typeof option.textSetting.size === "number" ? option.textSetting.size + "pt" : option.textSetting.size),
	                    isItalic: option.textSetting.isItalic,
	                    font: option.textSetting.font,
	                    isBold: option.textSetting.isBold,
	                    color: option.textSetting.color
	                });
	            }
	        }
	    }
    }
};

NSChart.prototype.__createYAxis = function(svg,option,height,scale)
{
    if(option.enableYLabel) 
    {
    	var origHeight = option.graphHeight / option.yLabelCount;
        var yPos = option.gutterTop;
    	var axis = this.__createTag({
            parent: svg,
            type: "path",
            attribute:{
                d: "M{1} {2} L{3} {4}".format(
            		option.gutterLeft,
            		option.gutterTop,
            		option.gutterLeft + 0.001,
            		height - option.gutterBottom
                ),
                fill:option.yAxisColor,
                stroke:option.yAxisColor
            }
        });
        // tickmarks
    	for (var count = 0;count < option.yLabelCount.length;count++) 
        {
    		this.__createTag({
            	parent: svg,
                type: "path",
                attribute: {
                    d: "M{1} {2} L{3} {4}".format(
                    	option.gutterLeft - 3,
                        yPos,
                        option.gutterLeft,
                        yPos + 0.001
                    ),
                    stroke:option.yAxisColor
                }
            });
            yPos += origHeight;
        }
    	 // extra tick if the X axis is not shown or X axis position is not zero
        if(!option.enableXLabel && option.yMin !== 0) 
        {
            this.__createTag({
            	parent: svg,
                type: "path",
                attribute: {
                    d: "M{1} {2} L{3} {4}".format(
                    		option.gutterLeft - 3,
                            height - option.gutterBottom,
                            option.gutterLeft,
                            height - option.gutterBottom - 0.001
                    ),
                    stroke:option.yAxisColor
                }
            });
        }
	    // X axis labels
        var segment = (height - option.gutterTop - option.gutterBottom) / option.yLabelCount;
        for (var count = 0;count < scale.labels.length;count++) 
        {
            yPos = height - option.gutterBottom - (segment * count) - segment;
            this.__createText({
            	parent:svg,
                text:scale.labels[count],
                xPos:option.gutterLeft - 7,
                yPos:yPos,
                valign:"center",
                halign:"right",
                size:(typeof option.textSetting.size === "number" ? option.textSetting.size + "pt" : option.textSetting.size),
                isItalic: option.textSetting.isItalic,
                font: option.textSetting.font,
                isBold: option.textSetting.isBold,
                color: option.textSetting.color
            });
        }
        // add the minimum label
        yPos = height - option.gutterBottom;
        var value = option.yMin.toFixed(option.decimals);
        var text = this.__getAxisLabel(value,option.yLabelCallback);
        this.__createText({
        	parent:svg,
            text:text,
            xPos:option.gutterLeft - 7,
            yPos:yPos,
            valign:"center",
            halign:"right",
            size:(typeof option.textSetting.size === "number" ? option.textSetting.size + "pt" : option.textSetting.size),
            isItalic: option.textSetting.isItalic,
            font: option.textSetting.font,
            isBold: option.textSetting.isBold,
            color: option.textSetting.color
        });
    }
};

NSChart.prototype.__createText = function(option)
{
	var setting = {
		parent:option.parent,
		size:option.size,
        isBold:option.isBold,
        font:option.font,
        isItalic:option.isItalic,
        halign:option.halign,
        valign:option.valign,
        text:option.text,
        xPos:option.xPos,
        yPos:option.yPos,
        color:option.color ? option.color : "black"
	};
    if (setting.halign === "right") 
    {
    	setting.halign = "end";
    } 
    else if (setting.halign === "center" || setting.halign === "middle") 
    {
    	setting.halign = "middle";
    } 
    else 
    {
    	setting.halign = "start";
    }
    if (setting.valign === "top") 
    {
    	setting.valign = "hanging";
    } 
    else if (setting.valign === "center" || setting.valign === "middle") 
    {
    	setting.valign = "middle";
    } 
    else 
    {
    	setting.valign = "bottom";
    }
    var text = this.__createTag({
    	parent: setting.parent,
        type: "text",
        attribute: {
            fill:setting.color,
            x: setting.xPos,
            y: setting.yPos,
            "font-size": typeof setting.size === "number" ? setting.size + "pt" : setting.size,
            "font-weight": setting.isBold ? 900 : 100,
            "font-family": setting.font ? setting.font : "Arial, Verdana",
            "font-style": setting.isItalic ? "italic" : "normal",
            "text-anchor": setting.halign,
            "dominant-baseline": setting.valign
        }
    });
    text.appendChild(document.createTextNode(setting.text));
    if(this.util.isBrowserIE && (setting.valign === "hanging")) 
    {
        text.setAttribute("y",setting.yPos + (text.scrollHeight / 2));
    } 
    else if(this.util.isBrowserIE() && setting.valign === "middle") 
    {
        text.setAttribute("y",setting.yPos + (text.scrollHeight / 3));
    }
    
    return text;
};

NSChart.prototype.__createShadow = function(def,id,option)
{
    var filter = this.__createTag({
        parent: def,
        type: "filter",
        attribute: {
            id: id,
            width: "130%",
            height: "130%"
        }
    });

    this.__createTag({
        parent: filter,
        type: "feOffset",
        attribute: {
            result: "offOut",
            "in": "SourceGraphic",
            dx: option.xOffset,
            dy: option.yOffset
        }
    });

    this.__createTag({
        parent: filter,
        type: "feColorMatrix",
        attribute: {
            result: "matrixOut",
            "in": "offOut",
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 {1} 0".format(option.opacity)
        }
    });

    this.__createTag({
        parent: filter,
        type: "feGaussianBlur",
        attribute: {
            result: "blurOut",
            "in": "matrixOut",
            stdDeviation: option.blur
        }
    });

    this.__createTag({
        parent: filter,
        type: "feBlend",
        attribute: {
            "in": "SourceGraphic",
            "in2": "blurOut",
            mode: "normal"
        }
    });
};

NSChart.prototype.__createTag = function(option)
{
    var tag = document.createElementNS(this.namespace,option.type);
    var item = null;
    for (item in option.attribute) 
    {
        if (typeof item === "string") 
        {
            var name = item;
            if (item === "className") 
            {
                name = "class";
            }
            tag.setAttribute(name, String(option.attribute[item]))
        }
    }
    for (item in option.style) 
    {
        if (typeof item === "string") 
        {
            tag.style[item] = String(option.style[item]);
        }
    }
    if (option.parent) 
    {
    	option.parent.appendChild(tag);
    } 
    return tag;
};

NSChart.prototype.__createSVG = function(id,className,width,height,viewBox,disableEvents)
{
	var svg = document.createElementNS(this.namespace, "svg");
	svg.setAttribute("xmlns", this.namespace);
	svg.setAttributeNS(this.xmlns, "xmlns:xlink", this.xlink);
	svg.setAttribute("version", this.version);
	if(id)
	{
		svg.setAttribute("id",id);
	}
	if(className)
	{
		 this.util.addStyleClass(svg,className);
	}
	if(this.util.isNumber(width))
	{
		svg.setAttribute("width", width);
	}
	if(this.util.isNumber(height))
	{
		svg.setAttribute("height", height);
	}
	if(viewBox)
	{
		svg.setAttribute("viewBox", viewBox);
	}
	if(this.util.isUndefined(disableEvents) || disableEvents === null)
	{
		disableEvents = false;
	}
	if(disableEvents)
	{
		svg.style.pointerEvents = "none";
	}
	return svg;
};

NSChart.prototype.__createGroup = function(id,className) 
{
	 var group = document.createElementNS(this.namespace, "g");
	 if(id)
	 {
		 group.setAttribute("id", id);
	 }
	 if(className)
	 {
		 this.util.addStyleClass(group,className);
	 }
	 return group;
};

NSChart.prototype.__createPath = function(id,pathString,className,fill) 
{
	 var path = document.createElementNS (this.namespace, "path");
	 if(id)
	 {
		 path.setAttribute("id", id);
	 }
	 path.setAttribute("d", pathString);
	 if(className)
	 {
		 this.util.addStyleClass(path,className);
	 }
	 if(fill)
	 {
		 path.setAttribute("fill", fill);
	 }
	 return path;
};

NSChart.prototype.__createDef = function(svg)
{
    var def = this.__createTag({
    	parent: svg,
        type: "defs"
    });
    return def
};

NSChart.prototype.__maxArrayValue = function(array)
{
    var max = null
    if (typeof array === "number") 
    {
        return array;
    }
    if(this.util.isUndefinedOrNull(array)) 
    {
        return 0;
    }
    var length = array.length;
    for(var count = 0;count < length;count++) 
    {
        if (typeof array[count] === "number") 
        {
            var value = arguments[1] ? Math.abs(array[count]) : array[count];            
            if (typeof max === "number") 
            {
                max = Math.max(max, value);
            } 
            else 
            {
                max = value;
            }
        }
    }
    return max;
};

NSChart.prototype.__sumArray = function(array)
{
    if (typeof array === "number") 
    {
        return array;
    }
    if(this.util.isUndefinedOrNull(array)) 
    {
        return 0;
    }
    var sum = 0;
    var length = array.length;
    for(var count = 0;count < length;count++) 
    {
        if (typeof array[count] === "number") 
        {
        	sum += array[count];
        }
    }
    return sum;
};

NSChart.prototype.__getAxisLabel = function(value,callback)
{
	var label = value;
	if(callback)
	{
		label = callback(value);
    	if(!label)
    	{
    		label = value;
    	}
	}
	return label;
};

NSChart.prototype.__getRadiusEndPoint = function(angle,radius)
{
    var x = Math.cos(angle) * radius;
    var y = Math.sin(angle) * radius;
    return [x, y];
};

NSChart.prototype.__svgPoints = function(cx,cy,angle,radius)
{
    return {
    	x:(cx + (radius * Math.cos(angle))),
    	y:(cy + (radius * Math.sin(angle)))
    };
};

NSChart.prototype.__getSectionPath = function(startAngle,endAngle,cx,cy,radius)
{
    // circles start at the top 
    startAngle -= 1.57;
    endAngle   -= 1.57;
    var start = this.__svgPoints(cx,cy,endAngle,radius);
    var end = this.__svgPoints(cx,cy,startAngle,radius);
    var largeArcFlag = (endAngle - startAngle) <= 3.14 ? "0" : "1";
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
};