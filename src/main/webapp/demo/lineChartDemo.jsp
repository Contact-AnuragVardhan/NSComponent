<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="A jquery plugin to create simple donut, bar or line charts with dom nodes, style with css.">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Line Chart Demo</title>
       
		 <script src="../lib/com/org/util/nsImport.js"></script>
		 
    </head>
    <body onload="initialize()">
    	<nsimport file="nsChart.js">
 		</nsimport>
      <div class="wrap">
			<div id="divLineBasic" style="width: 750px; height: 300px" ></div>
			<br/><br/><br/>
			<div id="divLineMultiple" style="width: 750px; height: 300px"></div>
			<br/><br/><br/>
			<div id="divLineSpline" style="width: 750px; height: 300px"></div>
			<br/><br/><br/>
			<div id="divLineSplineArea" style="width: 750px; height: 300px"></div>
			<br/><br/><br/>
			<div id="divLineSplineAreaStacked" style="width: 750px; height: 300px"></div>
			
      </div>
	
    <script>
    function setYLabel(value)
	{
		return value;
	}
	function initialize()
	{
		ns.onload(function()
		{
			var lineBasicOption = {
					type:"line",
					data: [0.05,0.06,0.01,0.06,0.09,0.02,0.07],
					gutterLeft: 50,
					gutterBottom: 50,
					enableYLabel:true,
					yLabelCallback:setYLabel,
					yAxisColor: "rgba(0,0,0,0.5)",
					enableXLabel:true,
					xLabel: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
		            xLabelPosition:"section",
		            xAxisColor: "rgba(0,0,0,0.5)",
		            xLabelAxisGap: 10,
		            decimals:2,
		            horizontalMargin: 0,
		            colors:["#c66","#6c6","#66c"],
		            title: "Basic Line Chart",
		            titleSetting:{
		            	size:18
		            },
		            enablePoints:true,
		            enableShadow: false,
			}
			var lineMultipleOption = {
					type:"line",
					data: [[19,165,132,111,185,149,199],
			                [48,46,51,94,84,25,65],
			                [35,26,15,23,43,12,26]],
					gutterLeft: 50,
					gutterBottom: 50,
					enableYLabel:true,
					yLabelCallback:setYLabel,
					yAxisColor: "rgba(0,0,0,0.5)",
					enableXLabel:true,
					xLabel: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
		            xLabelPosition:"section",
		            xAxisColor: "rgba(0,0,0,0.5)",
		            xLabelAxisGap: 10,
		            decimals:2,
		            horizontalMargin: 0,
		            colors:["#c66","#6c6","#66c"],
		            title: "Multi Line Chart",
		            titleSetting:{
		            	size:18
		            },
		            enablePoints:true,
		            pointSetting:{
		            	style:"filledCircle",
		            	size:3
		            },
		            enableShadow:true,
			}
			var lineSplineOption = {
					type:"line",
					data: [[4,1,8,6,3,5,4,2,9,3,6,3],
			                [1,9,6,3,4,6,8,5,5,5,2,8],
			                [4,6,3,5,2,8,9,5,6,5,6,1],
			                [4,8,6,3,5,4,2,5,1,6,9,9]],
					gutterLeft: 50,
					gutterBottom: 50,
					enableSpline:true,
					enableYLabel:true,
					yLabelCallback:setYLabel,
					yAxisColor: "rgba(0,0,0,0.5)",
					enableXLabel:true,
					xLabel: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
		            xLabelPosition:"section",
		            xAxisColor: "rgba(0,0,0,0.5)",
		            xLabelAxisGap: 10,
		            decimals:2,
		            horizontalMargin: 0,
		            colors:["#c66","#6c6","#66c"],
		            title: "Spline Line Chart",
		            titleSetting:{
		            	size:18
		            },
		            enablePoints:false,
		            enableShadow: false,
			}
			var lineSplineAreaOption = {
					type:"line",
					data: [[4,8,6,1,5,12,5,3,6,4,9,9],
				            [8,2,6,15,10,5,5,8,6,8,9,5]],
					gutterLeft: 75,
					gutterLeft: 75,
		            gutterRight: 25,
		            gutterBottom: 35,
					enableSpline:true,
					enableArea:true,
			        enableAreaStacked:false,
					enableYLabel:true,
					yLabelCallback:setYLabel,
					yAxisColor: "rgba(0,0,0,0.5)",
					enableXLabel:true,
					xLabel: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		            xLabelPosition:"section",
		            xAxisColor: "rgba(0,0,0,0.5)",
		            xLabelAxisGap: 10,
		            decimals:2,
		            horizontalMargin: 15,
		            colors:["#f66", "#6f6", "#66f", "#ff6", "#6ff", "#ccc"],
		            title: "Spline Line Area Chart",
		            titleSetting:{
		            	size:18
		            },
		            enablePoints:false,
		            enableShadow: false,
			}
			var lineSplineAreaStackedOption = {
					type:"line",
					data: [[4,8,6,1,5,12,5,3,6,4,9,9],
				            [8,2,6,15,10,5,5,8,6,8,9,5]],
					gutterLeft: 75,
					gutterLeft: 75,
		            gutterRight: 25,
		            gutterBottom: 35,
					enableSpline:true,
					enableArea:true,
			        enableAreaStacked:true,
					enableYLabel:true,
					yLabelCallback:setYLabel,
					yAxisColor: "rgba(0,0,0,0.5)",
					enableXLabel:true,
					xLabel: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		            xLabelPosition:"section",
		            xAxisColor: "rgba(0,0,0,0.5)",
		            xLabelAxisGap: 10,
		            decimals:2,
		            horizontalMargin: 15,
		            colors:["#f66", "#6f6", "#66f", "#ff6", "#6ff", "#ccc"],
		            title: "Spline Line Area Chart",
		            titleSetting:{
		            	size:18
		            },
		            enablePoints:false,
		            enableShadow: false,
			}
			
			var lineBasic = new NSChart(document.querySelector("#divLineBasic"),lineBasicOption);
			var lineMultiple = new NSChart(document.querySelector("#divLineMultiple"),lineMultipleOption);
			var lineSpline = new NSChart(document.querySelector("#divLineSpline"),lineSplineOption);
			var lineSplineArea = new NSChart(document.querySelector("#divLineSplineArea"),lineSplineAreaOption);
			var lineSplineAreaStacked = new NSChart(document.querySelector("#divLineSplineAreaStacked"),lineSplineAreaStackedOption);
			
			
		});
	}
      </script>
    </body>
</html>