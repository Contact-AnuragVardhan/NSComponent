<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="A jquery plugin to create simple donut, bar or line charts with dom nodes, style with css.">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Pie Chart Demo</title>

		<script src="../lib/com/org/util/nsImport.js"></script>
        
    </head>
    <body onload="initialize()">
    	<nsimport file="nsChart.js">
 		</nsimport>
      <div class="wrap">
        <div id="divPieBasic" style="width: 650px; height: 350px; padding-left: 100px;" ></div>
        <br/><br/><br/><br/><br/>
        <div id="divSeparationBasic" style="width: 650px; height: 350px;padding-left: 100px;"></div>
      </div>
	
      <script>
	
	function initialize()
	{
		ns.onload(function()
		{
			var pieBasicOption = {
					type:"pie",
					data:[85,48,13,56,79,95],
					labels: ["Alf","Berty","Craig","Dean","Elgar","Fliss"],
		            colors:["#f66", "#6f6", "#66f", "#ff6", "#6ff", "#ccc"],
		            title: "Basic Pie Chart",
		            titleSetting:{
		            	size:18
		            },
		            enableShadow: true,
			}
			
			var pieSeparationOption = {
					type:"pie",
					data:[85,48,13,56,79,95],
					labels: ["Alf","Berty","Craig","Dean","Elgar","Fliss"],
		            colors:["#f66", "#6f6", "#66f", "#ff6", "#6ff", "#ccc"],
		            title: "Separation Pie Chart",
		            titleSetting:{
		            	size:18
		            },
		            separation: [0,15,0,0,30,0],
		            enableShadow: true,
			}
			var pieBasic = new NSChart(document.querySelector("#divPieBasic"),pieBasicOption);
			var pieSeparation = new NSChart(document.querySelector("#divSeparationBasic"),pieSeparationOption);
		});
	}
      </script>
    </body>
</html>