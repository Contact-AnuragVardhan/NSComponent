function NSPieChart(nsChart,nsUtil)
{
	this.__nsChart = nsChart;
	this.util = nsUtil;
};

NSPieChart.prototype.__create = function()
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

	    // Work out the startAngle and endAngle angles for the data
	    for (var count = 0;count < data.length;count++) 
	    {
	        startAngle = angle;
	        section = ((data[count] / sum) * TWOPIE);
	        endAngle = startAngle + section;
	
	        var separation  = nsChart.__getRadiusEndPoint(startAngle + (section / 2),properties.separation[count]);
	        var separationX = separation[1];
	        var separationY = separation[0];
	
	        self.__sectionDetails[count] = {
	            startAngle:startAngle,
	            endAngle:endAngle,
	            angle:endAngle - startAngle,
	            halfway:((endAngle - startAngle) / 2) + startAngle,
	            cx: centerX + (parseInt(separationX) || 0),
	            cy: centerY - (parseInt(separationY) || 0),
	            radius: radius
	        };
	
	        // Increase the angle at which we startAngle drawing the next section at
	        angle += (endAngle - startAngle);
	    }
	    var shadowID = id + "shadow";
        if (drawShadow) 
        {
        	nsChart.__createShadow.bind(nsChart)(def,shadowID,properties.shadowSetting);
        }
	    //below loop creates section
        for (var count = 0;count < self.__sectionDetails.length;count++) 
	    {
        	color = getColor(count);
	        var path = nsChart.__getSectionPath.bind(nsChart)(self.__sectionDetails[count].startAngle,self.__sectionDetails[count].endAngle,
	        											self.__sectionDetails[count].cx,self.__sectionDetails[count].cy,radius);
	        var arc = nsChart.__createTag({
			        	parent: svg,
			            type: "path",
			            attribute: {
			            	 d: path + " L {1} {2} Z".format(
			 	                    self.__sectionDetails[count].cx,
			 	                    self.__sectionDetails[count].cy
			 	                ),
			 	                fill: color,
			 	                stroke: strokestyle,
			 	                "stroke-width": lineWidth,
			 	                //"data-tooltip": (!RG.SVG.isNull(prop.tooltips) && prop.tooltips.length) ? prop.tooltips[i] : "",
			 	                "data-index": count,
			 	                "data-value": data[count],
			 	                "data-startAngle-angle": self.__sectionDetails[count].startAngle,
			 	                "data-endAngle-angle": self.__sectionDetails[count].endAngle,
			 	                "data-radius": radius,
			 	                filter: drawShadow ? "url(#" + shadowID + ")" : ""
			            }
		    });
	        self.__sectionDetails[count].object = arc;
	        
	        /*if (prop.tooltips && prop.tooltips[i] && arguments[0] === false) 
	        {
	            (function (index, obj)
	            {
	                arc.addEventListener(prop.tooltipsEvent, function (e)
	                {
	                    // Show the tooltip
	                    RG.SVG.tooltip(obj, {
	                        object: obj,
	                        index: index,
	                        sequentialIndex: index,
	                        text: prop.tooltips[index],
	                        event: e
	                    });
	                    
	                    // Highlight the rect that has been clicked on
	                    obj.highlight(e.target);
	                    
	                    var highlight = RG.SVG.REG.get("highlight");
	                    
	                    if (prop.tooltipsEvent === "mousemove") {
	                        highlight.style.cursor = "pointer";
	                    }
	                    
	                }, false);
	
	                // Install the event listener that changes the
	                // cursor if necessary
	                if (prop.tooltipsEvent === "click") {
	                    arc.addEventListener("mousemove", function (e)
	                    {
	                        e.target.style.cursor = "pointer";
	                    }, false);
	                }
	                
	            }(i, this));
	        }*/
	    }
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

/*NSChart.prototype.__createPieChart = function()
{
	this.util.addStyleClass(element.parentNode,"pie");
	var dataSet = [["people",20],["countries",30],["developers",60]];
	var colorSet = "#FBE4DB,#F17F49,#BD380F";
	var id = this.__getID();
	var self = this;
	var createSVG = function()
	{
		var svg = self.__createSVG.bind(self)(id + "svg","svg",null,null,"0 0 400 400");
		return svg;
	};
	var getRandomNumber = function(min,max) 
	{
        return parseInt(Math.random() * (max - min + 1),10) + min;
    };
    var getSectionColor = function(index) 
	{
      	var color;
      	if(colorSet && colorSet.length > index) 
		{
        	color = colorSet[index];
      	}
      	else
		{
        	var hue = getRandomNumber(10, 60); // Hue is a degree on the color wheel from 0 to 360. 0 is red, 120 is green, 240 is blue.
        	var saturation = getRandomNumber(20, 100); // Saturation is a percentage value; 0% means a shade of gray and 100% is the full color.
        	var lightness = getRandomNumber(30, 60); // Lightness is also a percentage; 0% is black, 100% is white.
        	color = "hsl(" + hue + "," + saturation + "%," + lightness + "%)";
      	}
      	return color;
    };
    var createGroup = function(value,pathString,color,title,index)
    {
    	var path = self.__createPath(id + "Path" + index,pathString,"path",color);
		path.setAttribute("data-val", value);
		path.setAttribute("data-title", title);
		var group = self.__createGroup.bind(self)(id + "Group" + index,"pathCont");
		group.appendChild(path);
		return group;
    };
    var createLegend = function(value,color,title,index)
    {
    	var li = self.util.createElement("li",id + "legend" + index);
    	var i = self.util.createElement("i");
    	i.style.background = color;
    	var p = self.util.createElement("p");
    	p.appendChild(document.createTextNode(title+ ": " + value))
    	li.appendChild(i);
    	li.appendChild(p);
    	legendContainer.appendChild(li);
    };
	var createChart = function(arrData)
	{
		if(arrValue && arrValue.length > 0)
		{
			var arrTitles = [];
		    var arrValues = [];
			var length = arrData.length;
			var count = 0;
			for(count = 0;count < length;count++)
			{
				arrTitles.push(arrData[count][0]);
				arrValues.push(arrData[count][1]);
			}
			var totalValue = 0;
			length = arrValues.length;
			for(count = 0;count < length;count++)
			{
				totalValue += arrValues[count];
			}
			var arrSectorAngle = [];
			for(count = 0;count < length;count++)
			{
				arrSectorAngle.push(360 * (arrValues[count] / totalValue));
			}
		    var startAngle = -90;
		    var endAngle = -90;
		    var xFrom = 0,yFrom = 0,xTo = 0,yTo = 0;
		    var color = null,pathString = null;
		    var group = null;
			length = arrSectorAngle.length;
			for(count = 0;count < length;count++)
			{
				 startAngle = endAngle;
		         endAngle = startAngle + arrSectorAngle[count];
		         xFrom = parseInt(Math.round(200 + 195 * Math.cos(Math.PI * startAngle/180)));
		         yFrom = parseInt(Math.round(200 + 195 * Math.sin(Math.PI * startAngle/180)));
		         xTo = parseInt(Math.round(200 + 195 * Math.cos(Math.PI * endAngle/180)));
		         yTo = parseInt(Math.round(200 + 195 * Math.sin(Math.PI * endAngle/180)));
		         pathString = "M200,200  L" + xFrom + "," + yFrom + "  A195,195 0 " + ((endAngle - startAngle > 180) ? 1 : 0) + ",1 " + xTo + "," + yTo + " z";
		         color = getSectionColor(count);
		         group = createGroup(arrValues[count],pathString,color,arrTitles[count],count);
		         createLegend(arrValues[count],color,arrTitles[count],count);
		         svg.insertBefore(group,svg.firstChild);
			}
		}
	};
	var removeToolTip = function()
	{
		var arrElement = document.querySelectorAll(".charts-tip");
		for(var count = arrElement.length - 1;count > -1;count--)
		{
			document.body.removeChild(arrElement[count]);
		}
	};
	var mouseMoveHandler = function(event)
	{
		event = self.util.getEvent(event);
		var target = self.util.getTarget(event);
		mousePosition = {x:event.pageX,y:event.pageY};
        var value = target.getAttribute("data-val");
        var title = target.getAttribute("data-title");
        var color = target.getAttribute("fill");
        if(value)
        {
        	var lastChild = self.__element.querySelector(".pathCont:last-child .path:last-child");
        	var targetClone = target.cloneNode(true);
            var parentClone = target.parentNode.cloneNode(true);
            //console.log(mousePosition.x + "," + mousePosition.y);
            tooltip.setAttribute("style","left:" + mousePosition.x + "px;" + "top:" + mousePosition.y + "px;");
            removeToolTip();
            tooltip.innerHTML = title+ ": " + value;
            document.body.appendChild(tooltip);
        	if(color)
            {
        		target.setAttribute("stroke",color);
            }
        	if(lastChild.getAttribute("id") !== target.getAttribute("id"))
        	{
        		target.parentNode.parentNode.removeChild(target.parentNode);
        		svg.appendChild(parentClone);
        	}
        }
	};
	var mouseLeaveHandler = function(event)
	{
		removeToolTip();
	};
	
	if(colorSet)
	{ 
		colorSet = colorSet.split(","); 
	}
	var mousePosition = {x:0,y:0};
	var arrValue = dataSet;
	var svg = createSVG();
	var legendContainer = this.util.createElement("ul",id + "LegendContainer","pie-legend");
	var tooltip = this.util.createDiv(id + "Tooltip","charts-tip");
	createChart(arrValue);
	element.appendChild(svg);
	element.appendChild(legendContainer);
	this.util.addEvent(element,"mousemove",mouseMoveHandler);
	this.util.addEvent(element,"mouseleave",mouseLeaveHandler);
};*/