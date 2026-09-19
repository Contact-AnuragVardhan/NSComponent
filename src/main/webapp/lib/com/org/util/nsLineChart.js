function NSLineChart(nsChart,nsUtil)
{
	this.__nsChart = nsChart;
	this.util = nsUtil;
};

NSLineChart.prototype.__create = function()
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
            else if(self.util.isArray(data[count]) && (!properties.enableArea || !properties.enableAreaStacked)) 
            {
            	arrMaxValues.push(maxFunction(data[count]));
            } 
            else if(self.util.isArray(data[count]) && properties.enableArea && properties.enableAreaStacked) 
            {
            	for (var innerCount = 0;innerCount < data[count].length;innerCount++) 
            	{
            		arrMaxValues[innerCount] = arrMaxValues[innerCount]  || 0;
            		arrMaxValues[innerCount] = arrMaxValues[innerCount] + data[count][innerCount];
                    // add missing data to create stack 
                    data[count][innerCount] = arrMaxValues[innerCount];
                }
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
    var getColor = function(index)
    {
    	var color = (properties.colors.length > index) ? properties.colors[index] : properties.colors[0];
    	return color;
    };
    // redraw the line for it to appear over the fill
    var redrawLines = function()
    {
    	var color = null;
    	var path = null;
        if (properties.enableSpline) 
        {
            for (var count = 0;count < self.__coordsSpline.length;count++) 
            {
                color = getColor(count);
                path = "";
                // create the path
                for (var innerCount=0; innerCount< self.__coordsSpline[count].length;innerCount++) 
                {
                	var startsWith = (innerCount === 0) ? "M" : "L";
                	path += (startsWith + "{1} {2} ").format(
                            	self.__coordsSpline[count][innerCount][0],
                            	self.__coordsSpline[count][innerCount][1]
                        	);
                }
                nsChart.__createTag({
		        	parent: svg,
		            type: "path",
		            attribute: {
			            	d: path,
	                        stroke: color,
	                        "fill":"none",
	                        "stroke-width": lineWidth,
	                        "stroke-linecap": "round",
	                        "stroke-linejoin": "round",
		 	                filter: properties.enableShadow ? "url(#" + shadowID + ")" : ""
		            }
                });
            }
        } 
        else 
        {
        	for (var count = 0;count < self.__coords.length;count++)
        	{
        		color = getColor(count);
                path = "";
        		 // create the path
        		for (var innerCount=0;innerCount < self.__coords[count].length;innerCount++)
        		{
        			var startsWith = (innerCount === 0) ? "M" : "L";
        			path += (startsWith + "{1} {2} ").format(
                        	self.__coords[count][innerCount][0],
                        	self.__coords[count][innerCount][1]
                    	);
                }
        		 nsChart.__createTag({
 		        	parent: svg,
 		            type: "path",
 		            attribute: {
 			            	d: path,
 	                        stroke: color,
 	                        "fill":"none",
 	                        "stroke-width": lineWidth,
 	                        "stroke-linecap": "round",
 	                        "stroke-linejoin": "round",
 		 	                filter: properties.enableShadow ? "url(#" + shadowID + ")" : ""
 		            }
                 });
            }
        }
    };
    var calculateSpline = function(t,P0,P1,P2,P3)
    {
        return 0.5 * ((2 * P1) +
                     ((0-P0) + P2) * t +
                     ((2*P0 - (5*P1) + (4*P2) - P3) * (t*t) +
                     ((0-P0) + (3*P1)- (3*P2) + P3) * (t*t*t)));
    };
    var createSpline = function(arrCoordinates)
    {
        var xCoords = [];
        var interval = (properties.graphWidth - (2 * properties.horizontalMargin)) / (arrCoordinates.length - 1);
        var coordsSpline = [];
        //convert multi dimensional array to take only y dimension
        for (var count = 0; count < arrCoordinates.length;count++) 
        {
            if (self.util.isArray(arrCoordinates[count]) && arrCoordinates[count].length === 2) 
            {
                arrCoordinates[count] = Number(arrCoordinates[count][1]);
            }
        }
        //create points array with arrCoordinates[0] placed in arrPoints[0] && arrPoints[1],similarly arrCoordinates[lastIndex] repeated in arrPoints[lastIndex - 1] and arrPoints[lastIndex] 
        var arrPoints = [arrCoordinates[0]];
        for (var count = 0; count < arrCoordinates.length;count++) 
        {
        	arrPoints.push(arrCoordinates[count]);
        }
        arrPoints.push(arrCoordinates[arrCoordinates.length - 1] + (arrCoordinates[arrCoordinates.length - 1] - arrCoordinates[arrCoordinates.length - 2]));
        for (var count = 1;count < arrPoints.length - 2;count++)
        {
            for (var innerCount = 0;innerCount < 10;innerCount++) 
            {
                var yCoord = calculateSpline(innerCount / 10, arrPoints[count-1], arrPoints[count], arrPoints[count+1], arrPoints[count+2]);
                xCoords.push(((count - 1) * interval) + (innerCount * (interval / 10)) + properties.gutterLeft + properties.horizontalMargin);
                coordsSpline.push([xCoords[xCoords.length - 1],yCoord]);
            }
        }
        // create the last section
        coordsSpline.push([((count-1) * interval) + properties.gutterLeft + properties.horizontalMargin,arrPoints[count]]);
        
        return coordsSpline;
    };
    var createPoints = function(index,arrData,arrCoordinates,setting)
    {
    	color = getColor(index);
    	for (var count = 0; count < arrData.length;count++)
    	{
            if (typeof arrData[count] === "number") 
            {
            	
                switch(setting.style) 
                {
                    case "filledCircle":
                    	nsChart.__createTag({
        		        	parent: svg,
        		            type: "circle",
        		            attribute: {
        		            	cx: arrCoordinates[index][count][0],
                                cy: arrCoordinates[index][count][1],
                                r: setting.size,
                                "fill": color
        		            }
                        });
                    break;
                    case "circle":
                    	//innerCircle
                    	nsChart.__createTag({
        		        	parent: svg,
        		            type: "circle",
        		            attribute: {
        		            	cx: arrCoordinates[index][count][0],
                                cy: arrCoordinates[index][count][1],
                                r: setting.size,
                                "fill": color
        		            }
                        });
                        //outerCircle
                        nsChart.__createTag({
        		        	parent: svg,
        		            type: "circle",
        		            attribute: {
        		            	cx: arrCoordinates[index][count][0],
                                cy: arrCoordinates[index][count][1],
                                r: setting.size - 1,
                                "fill": "white"
        		            }
                        });
                }
            }
        }
    };
    var createLine = function(arrData,index)
    {
        var arrCoordinates = [];
        var arrPath = [];
        var arrFillPath = null;
        var color = getColor(index);
        var filledOpacity = 1;
        var isMultipleDataset = (self.util.isObject(data[0]) && self.util.isObject(data[1])) ? true : false;
        // generate the x & y points
        for (var count = 0;count < arrData.length;count++) 
        {
            var xPos = (((properties.graphWidth - (2 * properties.horizontalMargin)) / (arrData.length - 1) * count) + properties.gutterLeft + properties.horizontalMargin);
            var yPos = getYPos(arrData[count]);
            arrCoordinates.push([xPos,yPos]);
        }
        // get path for lines
        for (var count=0;count< arrCoordinates.length;count++) 
        {
        	var startsWith = (count === 0) ? "M" : "L";
        	arrPath.push((startsWith + "{1} {2}").format(arrCoordinates[count][0], arrCoordinates[count][1]));
        }
        self.__coords[index] = self.util.cloneObject(arrCoordinates);
        if (properties.enableSpline) 
        {
            self.__coordsSpline[index] = createSpline(arrCoordinates);
        }
        // get the fill part if area is enabled
        if (properties.enableArea) 
        {
            if (properties.enableSpline) 
            {
                arrFillPath = ["M{1} {2}".format(
                    self.__coordsSpline[index][0][0],
                    self.__coordsSpline[index][0][1]
                )];
                
                for (var count = 1;count < self.__coordsSpline[index].length;count++) 
                {
                    arrFillPath.push("L{1} {2}".format(
                        self.__coordsSpline[index][count][0],
                        self.__coordsSpline[index][count][1]
                    ));
                }
            } 
            else 
            {
                arrFillPath = self.util.cloneObject(arrPath);
            }
            arrFillPath.push("L{1} {2}".format(
                self.__coords[index][self.__coords[index].length - 1][0],
                index > 0 && properties.enableAreaStacked ? (properties.enableSpline ? self.__coordsSpline[index - 1][self.__coordsSpline[index - 1].length - 1][1] : self.__coords[index - 1][self.__coords[index - 1].length - 1][1]) : getYPos(0)
            ));
            if (index > 0 && properties.enableAreaStacked) 
            {
                if (properties.enableSpline) 
                {
                    for (var count = self.__coordsSpline[index - 1].length - 1;count >= 0;count--) 
                    {
                        arrFillPath.push("L{1} {2}".format(
                            self.__coordsSpline[index - 1][count][0],
                            self.__coordsSpline[index - 1][count][1]
                        ));
                    }
                }
                else 
                {
                    for (var count = self.__coords[index - 1].length - 1;count >= 0;count--) 
                    {
                        arrFillPath.push("L{1} {2}".format(
                            self.__coords[index - 1][count][0],
                            self.__coords[index - 1][count][1]
                        ));
                    }
                }
            }
            else 
            {
                // for bottom left corner and the +1 is so that the fill do not go over the axis
                arrFillPath.push("L{1} {2}".format(
                    self.__coords[index][0][0] + 1,
                    getYPos(0)
                ));
            }
            arrFillPath.push("L{1} {2}".format(
                self.__coords[index][0][0] + 1,
                self.__coords[index][0][1]
            ));
            // create the fill
            var objFillPath = nsChart.__createTag({
	        	parent: svg,
	            type: "path",
	            attribute: {
	            	d: arrFillPath.join(" "),
                    stroke: "rgba(0,0,0,0)",
                    "fill": color,
                    "fill-opacity": filledOpacity,
                    "stroke-width": 1
	            }
            });
            if (properties.areaClickHandler) 
            {
            	self.util.addEvent(objFillPath,"click",function(event){
            		properties.enableAreaClick(event,arrData,index);
            	});
            	self.util.addEvent(objFillPath,"mousemove",function(event){
            		event = self.util.getEvent(event);
            		event.target.style.cursor = "pointer";
            	});
            }
        }
        if (properties.enableShadow) 
        {
        	nsChart.__createShadow.bind(nsChart)(def,shadowID,properties.shadowSetting);
        }
        var path = [];
        // add the paths
        if (properties.enableSpline) 
        {
            // coordinates to path conversion
            path = ["M{1} {2}".format(
                self.__coordsSpline[index][0][0],
                self.__coordsSpline[index][0][1]
            )];
            for (var count = 1;count < self.__coordsSpline[index].length;count++) 
            {
            	path.push("L{1} {2}".format(
                    self.__coordsSpline[index][count][0],
                    self.__coordsSpline[index][count][1]
                ));
            }
            path = path.join(" ");
        } 
        else 
        {
            path = self.util.cloneObject(arrPath);
            if (properties.enableArea && properties.enableAreaStacked && index > 0) 
            {
                for(var count = self.__coords[index-1].length - 1;count >= 0;count--) 
                {
                	path.push("L{1} {2}".format(
                        self.__coords[index - 1][count][0],
                        self.__coords[index - 1][count][1]
                    ));
                }
            }
            path = path.join(" ");
        }
        //create line
        var line = nsChart.__createTag({
        	parent: svg,
            type: "path",
            attribute: {
            	d: path,
                stroke: color,
                "fill":"none",
                "stroke-width": (isMultipleDataset && properties.enableArea && properties.enableAreaStacked) ? 0.1 : lineWidth,
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                filter: properties.enableShadow ? "url(#" + shadowID + ")" : ""
            }
        });
        if(properties.enablePoints)
        {
        	createPoints(index,arrData,self.__coords,properties.pointSetting)
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
        nsChart.__createBackground.bind(nsChart)(svg,"line",properties,width,height,data);
        if(properties.title && properties.title.length > 0)
        {
        	nsChart.__createTitle.bind(nsChart)(svg,properties.title,width,properties.gutterTop,properties.titleSetting)
        }
        nsChart.__createXAxis.bind(nsChart)(svg,"line",properties,width,height,data,getYPos);
        nsChart.__createYAxis.bind(nsChart)(svg,properties,height,scale);
        // for Multiple lines
        if (self.util.isArray(data[0])) 
        {
            for (var count = 0;count < data.length;count++) 
            {
            	createLine(data[count],count);
            }
            if (properties.enableArea && properties.enableAreaStacked) 
            {
            	redrawLines();
            }
        } 
        else 
        {
        	createLine(data,0);
        }
	};
	var option = nsChart.__option;
	if(option && option["data"] && option["data"].length > 0)
	{
		option["textSetting"] = option["textSetting"] ? option["textSetting"] : {}; 
		option["backgroundSetting"] = option["backgroundSetting"] ? option["backgroundSetting"] : {};
		option["titleSetting"] = option["titleSetting"] ? option["titleSetting"] : {};
		option["shadowSetting"] = option["shadowSetting"] ? option["shadowSetting"] : {};
		option["pointSetting"] = option["pointSetting"] ? option["pointSetting"] : {};
		
		var properties =
	    {
	        gutterLeft: this.util.isUndefinedOrNull(option["gutterLeft"]) ? 25 : parseInt(option["gutterLeft"]),
	        gutterRight: this.util.isUndefinedOrNull(option["gutterRight"]) ? 25 : parseInt(option["gutterRight"]),
	        gutterTop: this.util.isUndefinedOrNull(option["gutterTop"]) ? 25 : parseInt(option["gutterTop"]),
	        gutterBottom: this.util.isUndefinedOrNull(option["gutterBottom"]) ? 25 : parseInt(option["gutterBottom"]),
	        enableSpline:Boolean.parse(option["enableSpline"]),
	        enableArea:Boolean.parse(option["enableArea"]),
	        enableAreaStacked:Boolean.parse(option["enableAreaStacked"]),
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
	        },
	        enablePoints:Boolean.parse(option["enablePoints"]),
	        pointSetting:{
	        	style:option["pointSetting"]["style"] || "circle", //can also be "filledCircle",
	        	size:this.util.isUndefinedOrNull(option["pointSetting"]["size"]) ? 5 : parseInt(option["pointSetting"]["size"]),
	        }
	    };
	    var id = nsChart.__getID();
	    var shadowID = id + "shadow";
	    var lineWidth = 1;
	    var element = nsChart.__element;
		var data = option["data"];
		var width = element.offsetWidth;
		var height = element.offsetHeight;
		var svg = createSVG();
		var def = nsChart.__createDef(svg);
		this.__coords = [];
	    this.__coordsSpline = [];
	    var scale = null;
	    
	    element.style.display = "inline-block";
	    createChart();
	    element.appendChild(svg);
	}
};