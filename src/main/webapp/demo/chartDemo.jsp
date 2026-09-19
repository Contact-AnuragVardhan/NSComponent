<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="A jquery plugin to create simple donut, bar or line charts with dom nodes, style with css.">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>cssCharts.js - jquery css charts</title>
       

        <link rel="stylesheet" href="../demo/css/chart.css">
		<!--  <script src="../lib/com/org/util/nsUtil.js"></script>-->
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

        

       

        <!--  <div style="padding: 15px; display: inline-block; top: 0; left; 0">-->
          <div style="width: 750px; height: 300px" id="bar-container"></div>
        <!--  </div> -->
        <br/><br/><br/>
        <div style="width: 650px; height: 350px;" id="pie-container"></div>

        

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
			/*var barOption = {
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
			}*/
			/*var barOption = {
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
			}*/
			var barOption = {
					type:"bar",
					data: [[4,3,8],[5,6,9],[7,8,4],[8,4,6],[5,3,6],[8,8,1],[4,3,5]],
					gutterLeft: 50,
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
			
			var pieOption = {
					type:"pie",
					data:[85,48,13,56,79,95],
					labels: ["Alf","Berty","Craig","Dean","Elgar","Fliss"],
		            colors:["#f66", "#6f6", "#66f", "#ff6", "#6ff", "#ccc"],
		            title: "Pie Chart",
		            titleSetting:{
		            	size:18
		            },
		            separation: [0,25,0,0,0,0],
		            enableShadow: true,
			}
			
			var barChart = new NSChart(document.querySelector("#bar-container"),barOption);
			var pieChart = new NSChart(document.querySelector("#pie-container"),pieOption);
		});
	}
	
	var WaveGenerator = (function(){


		// Constructor
		var WaveGenerator = function(resolution, amplitude){
			this.resolution = resolution || 100;
			this.amplitude = amplitude || 1;
			this.gen = genFn();
			this.t = 0;
		};


		// Random wave generator function
		var genFn = function(){
			var mask = 0xff;
			var size = mask + 1;
			var values = new Uint8Array(size * 2);
			for(var i = 0; i < size; i++){
				values[i] = values[size + i] = 0 | (Math.random() * 0xff);
			}
			var lerp = function(t, a, b){
				return a + t * (b - a);
			};
			var fade = function(t){
				return t * t * t * (t * (t * 6 - 15) + 10);
			};
			var grad2d = function(hash, x, y){
				var u = (hash & 2) === 0 ? x : -x;
				var v = (hash & 1) === 0 ? y : -y;
				return u + v;
			};
			return function(x, y){
				var intX = (0 | x) & mask;
				var intY = (0 | y) & mask;
				var fracX = x - (0 | x);
				var fracY = y - (0 | y);
				var r1 = values[intX] + intY;
				var r2 = values[intX + 1] + intY;
				var t1 = fade(fracX);
				var t2 = fade(fracY);

				var a1 = grad2d(values[r1], fracX, fracY);
				var b1 = grad2d(values[r2], fracX - 1, fracY);
				var a2 = grad2d(values[r1 + 1], fracX, fracY - 1);
				var b2 = grad2d(values[r2 + 1], fracX - 1, fracY - 1);
				return lerp(t2, lerp(t1, a1, b1), lerp(t1, a2, b2));
			};
		};


		/**
		 * Returns the next wave in the sequence.
		 * 
		 * @method next
		 * @return {Array<number>} 
		 */
		WaveGenerator.prototype.next = function(){
			this.t += 0.1;
			var data = [];
			for(var i = 0; i < this.resolution; i++){
				var v = this.gen(11 * i / this.resolution, this.t);
				data.push((1 - v) * this.amplitude / 2);
			}
			return data;
		};


		// Return constructor
		return WaveGenerator;

	}());
      </script>
    </body>
</html>