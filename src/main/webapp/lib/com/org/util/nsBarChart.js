function NSBarChart(nsChart,nsUtil)
{
	this.__nsChart = nsChart;
	this.util = nsUtil;
};

NSBarChart.prototype.__create = function()
{
	var nsChart = this.__nsChart;
	var self = this;
	var createSVG = function()
	{
		var svg = nsChart.__createSVG.bind(nsChart)(id + "svg",null,width,height,null);
		return svg;
	};
	var getMaxData = function()
	{
		var arrMaxValues = [];
		var maxFunction = nsChart.__maxArrayValue.bind(nsChart);
		for(var count = 0;count < data.length;count++) 
		{
            if (typeof data[count] === "number") 
            {
            	arrMaxValues.push(data[count]);
            } 
            else if(self.util.isArray(data[count]) && properties.barType === "grouped") 
            {
            	arrMaxValues.push(maxFunction(data[count]));
            } 
            else if(self.util.isArray(data[count]) && properties.barType === "stacked") 
            {
            	arrMaxValues.push(nsChart.__sumArray.bind(nsChart)(data[count]));
            }
        }
        var max = maxFunction(arrMaxValues);
		return max;
	};
	var getYPos = function(value)
    {
        if (value > scale.max || value < scale.min) 
        {
            return null;
        }
        var yPos = ((value - scale.min) / (scale.max - scale.min));
        yPos *= (height - properties.gutterTop - properties.gutterBottom);
        yPos = height - properties.gutterBottom - yPos;

        return yPos;
    };
    var getColor = function(type,index,innerIndex)
    {
    	var color = "black";
    	if(type === "normal")
    	{
    		color = (properties.colors.length === data.length) ? properties.colors[index] : properties.colors[0];
    	}
    	else
    	{
    		color = (properties.colors.length === data[index].length) ? properties.colors[innerIndex] : properties.colors[0];
    	}
    	return color;
    };
    var createBars = function ()
    {
    	var lineWidth = 1; 
    	var strokestyle = "rgba(0,0,0,0)";
        var xPos = properties.gutterLeft + properties.horizontalMargin;
        var yPos = getYPos(0);
        var shadowID = id + "shadow";
        if (properties.enableShadow) 
        {
        	nsChart.__createShadow.bind(nsChart)(def,shadowID,properties.shadowSetting);
        }
        var barIndex = 0;
        var tempHeight = 0;
        var tempWidth = 0;
        var color = "";
        // Go through the bars
        for (var count = 0;count < data.length;count++) 
        {
            if (typeof data[count] === "number") 
            {
            	color = getColor("normal",count);
            	tempHeight = Math.abs((data[count] / (scale.max - scale.min)) * properties.graphHeight),
            	tempWidth  = (properties.graphWidth / data.length) - (2 * properties.horizontalMargin);
                var rect = nsChart.__createTag({
                    parent: svg,
                    type: "rect",
                    attribute: {
                        stroke: strokestyle,
                        fill: color,
                        x: xPos,
                        y: yPos - (data[count] >  0 ? tempHeight : 0),
                        width: tempWidth,
                        height: tempHeight,
                        "stroke-width": lineWidth,
                        //"data-tooltip": (prop.tooltips) && prop.tooltips.length) ? prop.tooltips[count] : "",
                        "data-index": count,
                        "data-sequential-index": barIndex,
                        "data-value": data[count],
                        filter: properties.enableShadow ? "url(#" + shadowID + ")" : ""
                    }
                });
                self.__coords.push({
                    object: rect,
                    x:      xPos,
                    y:      yPos - (data[count] >  0 ? tempHeight : 0),
                    width:  tempWidth,
                    height: tempHeight
                });
                // Add the tooltip data- attribute
                /*if (!RG.SVG.isNull(prop.tooltips) && prop.tooltips[count]) {

                    var obj = this;

                    //
                    // Add tooltip event listeners
                    //
                    (function (idx, seq)
                    {
                        rect["on" + prop.tooltipsEvent] = function (e)
                        {
                            // Show the tooltip
                            RG.SVG.tooltip(obj, {
                                object: obj,
                                index: idx,
                                barIndex: seq,
                                text: prop.tooltips[seq],
                                event: e
                            });
                            
                            // Highlight the rect that has been clicked on
                            obj.highlight(e.target);

                        };
                        
                        rect.onmousemove = function (e)
                        {
                            e.target.style.cursor = "pointer"
                        };
                    })(count, barIndex);
                }*/
                xPos += (properties.horizontalMargin * 2) + tempWidth;
                barIndex++;
            } 
            else if(self.util.isArray(data[count]) && properties.barType === "grouped") 
            {
                var outerSegment = (properties.graphWidth / data.length);
                var innerSegment = (properties.graphWidth / data.length) - (2 * properties.horizontalMargin);

                // Loop through the group
                for (var innerCount = 0;innerCount < data[count].length;innerCount++) 
                {
                	color = getColor("grouped",count,innerCount);
                    tempHeight = Math.abs((data[count][innerCount] / (scale.max - scale.min)) * properties.graphHeight);
                    tempWidth  = ((innerSegment - ((data[count].length - 1) * properties.horizontalMarginGrouped)) / data[count].length);
                    xPos = properties.gutterLeft + (count * outerSegment) + (innerCount * tempWidth) + properties.horizontalMargin + (innerCount * properties.horizontalMarginGrouped);
                    var rect = nsChart.__createTag({
                    	parent: svg,
                        type: "rect",
                        attribute: {
                            stroke: strokestyle,//prop["strokestyle"],
                            fill: color,
                            x: xPos,
                            y: yPos - (data[count][innerCount] >  0 ? tempHeight : 0),
                            width: tempWidth,
                            height: tempHeight,
                            "stroke-width": lineWidth,
                            "data-index": count,
                            "data-sequential-index": barIndex,
                            //"data-tooltip": (!RG.SVG.isNull(prop.tooltips) && prop.tooltips.length) ? prop.tooltips[barIndex] : "",
                            "data-value": data[count][innerCount],
                            filter: properties.enableShadow ? "url(#" + shadowID + ")" : ""
                        }
                    });
                
                    self.__coords.push({
                        object: rect,
                        x: xPos,
                        y: yPos - (data[count][innerCount] >  0 ? tempHeight : 0),
                        width: tempWidth,
                        height: tempHeight
                    });



                // Add the tooltip data- attribute
                /*if (!RG.SVG.isNull(prop.tooltips) && prop.tooltips[barIndex]) {
                
                    var obj = this;

                
                    //
                    // Add tooltip event listeners
                    //
                    (function (idx, seq)
                    {
                        rect["on" + prop.tooltipsEvent] = function (e)
                        {
                            // Show the tooltip
                            RG.SVG.tooltip(obj, {
                                object: obj,
                                index: idx,
                                barIndex: seq,
                                text: prop.tooltips[seq],
                                event: e
                            });
                            
                            // Highlight the rect that has been clicked on
                            obj.highlight(e.target);

                        };
                        
                        rect.onmousemove = function (e)
                        {
                            e.target.style.cursor = "pointer"
                        };
                    })(count, barIndex);
                }*/
                    ++barIndex;
                }
            }
            else if(self.util.isArray(data[count]) && properties.barType === "stacked") 
            {
                var section = (properties.graphWidth / data.length);
                // Intialise the Y coordinate to the bottom gutter
                var y = height - properties.gutterBottom;
                for (var innerCount=0;innerCount < data[count].length;innerCount++) 
                {
                	color = getColor("stacked",count,innerCount);
                    var tempHeight  = Math.abs((data[count][innerCount] / (scale.max - scale.min)) * properties.graphHeight);
                    var tempWidth = section - (2 * properties.horizontalMargin);
                    var x = properties.gutterLeft + (count * section) + properties.horizontalMargin;
                    y = y - tempHeight;

                    // If this is the first iteration of the loop and a shadow
                    // is requested draw a rect here to create it.
                    if (innerCount === 0 && properties.enableShadow) 
                    {
                        
                        var fullHeight = Math.abs((nsChart.__sumArray.bind(nsChart)(data[count]) / (scale.max - scale.min)) * properties.graphHeight);
                        var rect = nsChart.__createTag({
                            svg: svg,
                            type: "rect",
                            attribute: {
                                fill: "white",
                                x: x,
                                y: height - properties.gutterBottom - fullHeight,
                                width: tempWidth,
                                height: fullHeight,
                                "stroke-width": 0,
                                "data-index": count,
                                filter: "url(#" + shadowID + ")"
                            }
                        });
                        
                        self.__stackedBackfaces[count] = rect;
                    }
                    // Create the visible bar
                    var rect = nsChart.__createTag({
                        parent: svg,
                        type: "rect",
                        attribute: {
                            stroke: strokestyle,//prop["strokestyle"],
                            fill: color,
                            x: x,
                            y: y,
                            width: tempWidth,
                            height: tempHeight,
                            "stroke-width": lineWidth,
                            "data-index": count,
                            "data-sequential-index": barIndex,
                            //"data-tooltip": (!RG.SVG.isNull(prop.tooltips) && prop.tooltips.length) ? prop.tooltips[barIndex] : "",
                            "data-value": data[count][innerCount]
                        }
                    });
                    self.__coords.push({
                        object: rect,
                        x:      x,
                        y:      y,
                        width:  tempWidth,
                        height: tempHeight
                    });



                // Add the tooltip data- attribute
                /*if (!RG.SVG.isNull(prop.tooltips) && prop.tooltips[barIndex]) 
                {
                
                    var obj = this;

                
                    //
                    // Add tooltip event listeners
                    //
                    (function (idx, seq)
                    {
                        rect["on" + prop.tooltipsEvent] = function (e)
                        {
                            // Show the tooltip
                            RG.SVG.tooltip(obj, {
                                object: obj,
                                index: idx,
                                barIndex: seq,
                                text: prop.tooltips[seq],
                                event: e
                            });
                            
                            // Highlight the rect that has been clicked on
                            obj.highlight(e.target);
                        };
                        
                        rect.onmousemove = function (e)
                        {
                            e.target.style.cursor = "pointer"
                        };
                    })(count, barIndex);
                }*/
                    ++barIndex;
                }
            }
        }
    };
	var createChart = function()
	{
		properties.graphWidth = width - properties.gutterLeft - properties.gutterRight;
		properties.graphHeight = height - properties.gutterTop - properties.gutterBottom;
        var max = getMaxData();
        if (typeof properties.yMax === "number") 
        {
            max = properties.yMax;
        }
        if (properties.yMin === "center") 
        {
            var replicate = true;
            properties.yMin   = 0;
        }
        scale = nsChart.__getGraphScale({
        	 labelCount:properties.yLabelCount,
             max:max,
             min:Number(properties.yMin),
             isNumber:typeof properties.yMax === "number",
             decimals:properties.decimals,
             callback:properties.yLabelCallback
        });
        //for creating -ve yaxis if replicable
        if (replicate) 
        {
        	scale = nsChart.__getGraphScale({
	           	 	labelCount:properties.yLabelCount,
	                max:scale.max,
	                min:scale.max * -1,
	                isNumber:typeof properties.yMax === "number",
	                decimals:properties.decimals,
	                callback:properties.yLabelCallback
        		});
        }
        properties.yMax = scale.max;
        properties.yMin = scale.min;
        nsChart.__createBackground.bind(nsChart)(svg,"bar",properties,width,height,data);
        if(properties.title && properties.title.length > 0)
        {
        	nsChart.__createTitle.bind(nsChart)(svg,properties.title,width,properties.gutterTop,properties.titleSetting)
        }
        createBars();
        nsChart.__createXAxis.bind(nsChart)(svg,"bar",properties,width,height,data,getYPos);
        nsChart.__createYAxis.bind(nsChart)(svg,properties,height,scale);
	};
	var option = nsChart.__option;
	if(option && option["data"] && option["data"].length > 0)
	{
		option["textSetting"] = option["textSetting"] ? option["textSetting"] : {}; 
		option["backgroundSetting"] = option["backgroundSetting"] ? option["backgroundSetting"] : {};
		option["titleSetting"] = option["titleSetting"] ? option["titleSetting"] : {};
		option["shadowSetting"] = option["shadowSetting"] ? option["shadowSetting"] : {};
		
		var properties =
	    {
	        gutterLeft: this.util.isUndefinedOrNull(option["gutterLeft"]) ? 25 : parseInt(option["gutterLeft"]),
	        gutterRight: this.util.isUndefinedOrNull(option["gutterRight"]) ? 25 : parseInt(option["gutterRight"]),
	        gutterTop: this.util.isUndefinedOrNull(option["gutterTop"]) ? 25 : parseInt(option["gutterTop"]),
	        gutterBottom: this.util.isUndefinedOrNull(option["gutterBottom"]) ? 25 : parseInt(option["gutterBottom"]),
	        barType: option["barType"] || "grouped",
	        yMax: this.util.isUndefinedOrNull(option["yMax"]) ? null : Number(option["yMax"]),
	        yMin: this.util.isUndefinedOrNull(option["yMin"]) ? 0 : Number(option["yMin"]),
	        enableYLabel:this.util.isUndefinedOrNull(option["enableYLabel"]) ? true : Boolean.parse(option["enableYLabel"]),
	        yLabelCount:this.util.isUndefinedOrNull(option["yLabelCount"]) ? 5 : parseInt(option["yLabelCount"]),
	        yAxisColor:option["yAxisColor"] || "black",
	        yLabelCallback: (option["yLabelCallback"] ? this.util.getFunction(option["yLabelCallback"]) : null),
	        enableXLabel:this.util.isUndefinedOrNull(option["enableXLabel"]) ? true : Boolean.parse(option["enableXLabel"]),
	        xLabel:option["xLabel"] || [],
	        xLabelPosition:option["xLabelPosition"] || "section",
	        xAxisColor:option["xAxisColor"] || "black",
	        xLabelAxisGap:this.util.isUndefinedOrNull(option["xLabelAxisGap"]) ? 5 : parseInt(option["xLabelAxisGap"]),
	        decimals: this.util.isUndefinedOrNull(option["decimals"]) ? 0 : parseInt(option["decimals"]),
	        horizontalMargin: this.util.isUndefinedOrNull(option["horizontalMargin"]) ? 3 : parseInt(option["horizontalMargin"]),
	        horizontalMarginGrouped: this.util.isUndefinedOrNull(option["horizontalMarginGrouped"]) ? 2 : parseInt(option["horizontalMarginGrouped"]),
	        colors: (option["colors"] && option["colors"].length > 0) ? option["colors"] : ["black"],
	        textSetting:{
	        	color: option["textSetting"]["font"] || "black",
	            font: option["textSetting"]["font"] || "Arial,Verdana,Segoe UI,sans-serif",
	            size: this.util.isUndefinedOrNull(option["textSetting"]["size"]) ? 12 : parseInt(option["textSetting"]["size"]),
	            isBold: Boolean.parse(option["textSetting"]["isBold"]),
	            isItalic: Boolean.parse(option["textSetting"]["isItalic"]),
	        },
	        enableBackground:this.util.isUndefinedOrNull(option["enableBackground"]) ? true : Boolean.parse(option["enableBackground"]),
	        backgroundSetting:{
	        	enableHorizontallines:this.util.isUndefinedOrNull(option["backgroundSetting"]["enableHorizontallines"]) ? true : Boolean.parse(option["backgroundSetting"]["enableHorizontallines"]),
	        	enableVerticalLines:this.util.isUndefinedOrNull(option["backgroundSetting"]["enableVerticalLines"]) ? true : Boolean.parse(option["backgroundSetting"]["enableVerticalLines"]),
	        	enableBorder:this.util.isUndefinedOrNull(option["backgroundSetting"]["enableBorder"]) ? true : Boolean.parse(option["backgroundSetting"]["enableBorder"]),
	        	color:option["backgroundSetting"]["color"] || "#ddd",
	        	lineWidth:this.util.isUndefinedOrNull(option["backgroundSetting"]["lineWidth"]) ? 1 : parseInt(option["backgroundSetting"]["lineWidth"]),
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
	        }
	    };
	    var id = nsChart.__getID();
	    var element = nsChart.__element;
		var data = option["data"];
		var width = element.offsetWidth;
		var height = element.offsetHeight;
		var svg = createSVG();
		var def = nsChart.__createDef(svg);
		this.__coords = [];
	    this.__stackedBackfaces = [];
	    var scale = null;
	    
	    element.style.display = "inline-block";
	    createChart();
	    element.appendChild(svg);
	}
};

/*NSChart.prototype.__createBarChart = function()
{
	this.util.addStyleClass(this.__element.parentNode,"bar");
	var gen = new WaveGenerator(22, 150);
	var data = gen.next();
	//var data = [[4,2,3],[4,5,2],[8,3,5],[4,2,2],[4,2,6]];
	var unit = "Kg";
	var height = this.__element.getBoundingClientRect().height;
	var grid = 0;
	var barWidth = 20;
	var max = 10;
	var id = this.__getID();
	var self = this;
	if(parseInt(grid,10) === 0) 
	{
		this.__element.style.background = "none";
	}
	if(!unit)
	{
		unit = "%";
	}
	var isBlock = function()
	{
		var childLength = data[0].length;
		var isBlock = true;
		if(!childLength)
		{
			isBlock = false;
		}
		return isBlock;
	};
	var maxData = function()
	{
		var maxValue = -1;
		var arrItem = [];
		var item = null;
		var length = data.length;
		if(isBlock())
		{
			var childLength = data[0].length;
			for(var count = 0;count < length;count++)
			{
				arrItem = data[count];
				for(var innerCount = 0;innerCount < childLength;innerCount++)
				{
					item = arrItem[innerCount];
					if(item > maxValue)
					{
						maxValue = item;
					}
				}
			}
		}
		else
		{
			arrItem = data;
			for(var count = 0;count < length;count++)
			{
				item = arrItem[count];
				if(item > maxValue)
				{
					maxValue = item;
				}
			}
		}
		return maxValue;
	};
	var createBlockParent = function()
	{
		var ul = self.util.createElement("ul");
		return ul;
	};
	var createChild = function(value)
	{
		var title = value + unit;
		var percent = (value/max) * 100;
		var li = self.util.createElement("li");
		li.style.height = height + "px";
		var span = self.util.createElement("span");
		span.setAttribute("title",title);
		if(barWidth)
		{
			span.setAttribute("style","height:" + percent + "%;" + "width:" + barWidth + "px;");
		}
		else
		{
			span.setAttribute("style","height:" + percent + "%;");
		}
		li.appendChild(span);
		return li;
	};
	var createGridChild = function(percentageBottom,value)
	{
		var hr = self.util.createElement("hr");
		hr.style.bottom = percentageBottom + "%";
		hr.setAttribute("data-y",value + unit);
		return hr;
	};
	if(maxData() > max || !max)
	{ 
		max = maxData(); 
	}
	var length = data.length;
	var blockParent = null;
	var arrItem = [];
	var item = null;
	var child = null;
	if(isBlock())
	{
		var childLength = data[0].length;
		for(var count = 0;count < length;count++)
		{
			arrItem = data[count];
			blockParent = createBlockParent();
			for(var innerCount = 0;innerCount < childLength;innerCount++)
			{
				item = arrItem[innerCount];
				child = createChild(item);
				blockParent.appendChild(child);
			}
			this.__element.appendChild(blockParent);
		}
	}
	else
	{
		arrItem = data;
		blockParent = createBlockParent();
		for(var count = 0;count < length;count++)
		{
			item = arrItem[count];
			child = createChild(item);
			blockParent.appendChild(child);
		}
		this.__element.appendChild(blockParent);
	}
	var grid = this.util.createDiv(null,"grid");
	for(var count = 0;count < 10;count++)
	{
		var toPerc = (count * 10).toFixed(0);
		var converter = max / 100;
		var toUnit = (toPerc * converter).toFixed(0);
		if(count % 2 === 0)
		{
			var line = createGridChild(toPerc,toUnit);
			grid.appendChild(line);
		}
	}
	this.__element.parentNode.style.width = this.__element.getBoundingClientRect().width + "px";
	this.__element.parentNode.appendChild(grid);
};*/