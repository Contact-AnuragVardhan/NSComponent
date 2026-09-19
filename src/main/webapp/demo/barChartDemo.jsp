<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="A jquery plugin to create simple donut, bar or line charts with dom nodes, style with css.">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bar Chart Demo</title>
       

		 <script src="../lib/com/org/util/nsImport.js"></script>
 		<style>

        <style>
          /* page specific styles*/
          h1{text-align:center;font-family:sans-serif;font-size:28px;color:#333;padding:40px 0 0 0;}
          h2{text-align:center;font-family:sans-serif;font-size:18px;color:#333;padding:40px 0 0 0;}
          hr{width:60%;height:1px;background:none;border:none;border-bottom:1px dashed rgba(0,0,0,0.1);outline:none;margin:40px auto 60px auto;}

          .desc p{text-align:center;font-size:16px;color:rgba(0,0,0,0.6);padding:20px 0 0 0;font-family:sans-serif;}
          .desc a{color:blue;}
          .wrap{margin:0 auto;width:640px;padding-bottom:100px;}
          #line{width:400px;}
          /* page specific styles*/
        </style>
    </head>
    <body onload="initialize()">
    	<nsimport file="nsChart.js">
 		</nsimport>
      <div class="wrap">
         <div id="divBarNormal" style="width: 750px; height: 300px" ></div>
         <br/><br/><br/>
         <div id="divBarGrouped" style="width: 750px; height: 300px" ></div>
         <br/><br/><br/>
         <div id="divBarStacked" style="width: 750px; height: 300px" ></div>
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
			var barNormalOption = {
					type:"bar",
					data: [4,8,6,3,5,2,4],
					enableXLabel:true,
					xLabel: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
		            horizontalMargin: 20,
		            colors:["#f00"],
		            backgroundSetting:{
			        	enableHorizontallines:true,
			        	enableVerticalLines:false,
			        	enableBorder:false
			        },
		            title: "Normal Chart",
		            titleSetting:{
		            	size:18
		            },
			}
			var barGroupedOption = {
					type:"bar",
					data: [[1,-2],[4,5],[4,2],[6,9],[4,3],[4,-3],[-4,8]],
					barType:"grouped",
					yMax: 20,
	                yMin: -5,
					enableYLabel:true,
					yLabelCount:5,
					yLabelCallback:setYLabel,
					yAxisColor: "rgba(0,0,0,0.5)",
					enableXLabel:true,
					xLabel: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
		            xLabelPosition:"section",
		            xAxisColor: "rgba(0,0,0,0.5)",
		            decimals:0,
		            horizontalMargin: 20,
		            horizontalMarginGrouped: 5,
		            colors:["#7CB5EC","#434348"],
	                title: "Grouped Chart",
	                titleSetting:{
	                	size:18
	                },
	                enableShadow: true,
			}
			var barStackedOption = {
					type:"bar",
					data: [[4,3,8],[5,6,9],[7,8,4],[8,4,6],[5,3,6],[8,8,1],[4,3,5]],
					//gutterLeft: 50,
					barType:"stacked",
					yMax: 30,
					enableYLabel:true,
					yLabelCount:5,
					yLabelCallback:setYLabel,
					yAxisColor: "rgba(0,0,0,0.5)",
					enableXLabel:true,
					xLabel: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
		            xLabelPosition:"section",
		            xAxisColor: "rgba(0,0,0,0.5)",
		            xLabelAxisGap: 10,
		            decimals:0,
		            horizontalMargin: 20,
		            colors:["#c66","#6c6","#66c"],
		            title: "Stacked Chart",
		            titleSetting:{
		            	size:18
		            },
		            enableShadow: false,
			}
			var barNormalChart = new NSChart(document.querySelector("#divBarNormal"),barNormalOption);
			var barGroupedChart = new NSChart(document.querySelector("#divBarGrouped"),barGroupedOption);
			var barStackedChart = new NSChart(document.querySelector("#divBarStacked"),barStackedOption);
			
		});
	}
      </script>
    </body>
</html>