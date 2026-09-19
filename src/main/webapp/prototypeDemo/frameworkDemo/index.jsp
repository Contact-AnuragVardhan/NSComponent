<html>
<head>
	<script src="../../lib/com/org/util/nsUtil.js"></script>
	<script src="../../lib/com/org/util/nsEvent.js"></script>
	<script src="../../lib/com/org/util/nsAjax.js"></script>
	<script src="../../lib/com/org/util/nsBinding.js"></script>
	<script src="../../lib/com/org/util/nsRouter.js"></script>
	<script src="../../lib/com/org/util/framework/nsModel.js"></script>
	<script src="../../lib/com/org/util/framework/nsController.js"></script>
	<script src="../../lib/com/org/util/framework/nsMvc.js"></script>
</head>
<body>
<div data-ns-container>
	<template id="mytemplate">
	  <div class="comment"> This is from template tag</div>
	</template>
	<h2>Hello World!</h2>
	<nav>
	      <a href="#about" data-navigo="">About</a>
	      <a href="#usage" data-navigo="">Usage</a>
	      <a href="#download" data-navigo="">Download</a>
	      <a href="#testing" data-navigo="">Run tests</a>
	</nav>
	<div id="myDiv" data-ns-route-container></div>
</div>

<script>
	var util = new NSUtil();
	function loadHandler(event) 
	{
		var arrRoute = [{route:"/about",templateId:"mytemplate",controller:"controllerAbout"},
		                {route:"/usage",templateUrl:"usage.jsp",controller:controllerUsage},
						{route:"/download",template:"This is text from template",controller:controllerDownload},
						{route:"/testing",templateUrl:"usage.jsp",controller:controllerTesting},
						{route:"/",templateUrl:"usage.jsp",controller:controllerTesting}];
		var setting = {mode:"hash",defaultRoute:"/about"};//,templateTarget:"myDiv"
		nsMvc = new NSMvc(arrRoute,setting);
		nsMvc.addController("controllerAbout",function(model)
	    {
	    	console.log("In controllerAbout");
	    });
		nsMvc.addController("childLevel1Controller",function(model)
	    {
	    	console.log("In childLevel1Controller");
	    	model.fieldLevel1 = "fieldLevel1";
	    });
		nsMvc.addController("childLevel2Controller",function(model)
	    {
	    	console.log("In childLevel2Controller");
	    	model.fieldLevel2 = "fieldLevel2";
	    });
	}
    
    function controllerUsage(model)
    {
    	console.log("In controllerUsage");
    	model.name = "Anurag";
    	model.tempColor = "red";
    	model.tempClass = "red";
    	model["tempName"] = {name:"Anurag",tempColor:"red",show:true};
    	model["countries"] = [{
	          name: 'Afghanistan',
	          code: 'AF'
	        }, {
	          name: 'Aland Islands',
	          code: 'AX'
	        }, {
	          name: 'Albania',
	          code: 'AL'
	        }, {
	          name: 'Algeria',
	          code: 'DZ'
	        }, {
	          name: 'American Samoa',
	          code: 'AS'
	        }, {
	          name: 'AndorrA',
	          code: 'AD'
	        }, {
	          name: 'Angola',
	          code: 'AO'
	        }, {
	          name: 'Anguilla',
	          code: 'AI'
	        }, {
	          name: 'Antarctica',
	          code: 'AQ'
	        }, {
	          name: 'Antigua and Barbuda',
	          code: 'AG'
	        }, {
	          name: 'Argentina',
	          code: 'AR'
	     	}];
    	model["nameChange"] = function(event)
		{
			var text = event.target.value;
			model["name"] = text;
		}
    	model["changeColor"] = function(event)
    	{
    		model["tempColor"] = "blue";
    		//objData["tempClass"] = "blue";
    		model["tempName"]["name"] = "Var";
    	}
    	model["changeText"] = function(text)
		{
    		model["countries"][2]["code"] = text;
    		return text;
		}
    	model["changeArray"] = function(event)
    	{
    		alert(model["changeText"]("aa"));
    	}
    	//model.iss
    	model["changeArray"] = function(event)
    	{
    		model["countries"][2]["code"] = "aa";
    	}
    	
    	model["changeDisplay"] = function(event)
    	{
    		model["tempName"]["show"] = !model["tempName"]["show"];
    	}
    	//model.issue = "Issue is from ";
    }
    function controllerDownload(model)
    {
    	console.log("In controllerDownload");
    }
    
    function controllerTesting(model)
    {
    	console.log("In controllerTesting");
    }
    
	
	window.addEventListener('load', loadHandler);
	
</script>
</body>
</html>
