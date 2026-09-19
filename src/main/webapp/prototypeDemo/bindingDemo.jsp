<html>
<head>
	<script src="lib/nsUtil.js"></script>
	<script src="lib/nsBinding.js"></script>
	<script src="bind.js"></script>
	<style>
	.red
	{
		color:red;
	}
	
	.blue
	{
		color:blue;
	}
	</style>
</head>
<body>

<div id="myDiv">
	<span>{{abc}}</span>
	<span>{{tempName.abc}}</span>
 	<input type="text" value="{{tempName.name}}">
	<span data-nsbind-style="color:{{tempColor}}">{{tempName.name}}</span>
	<input type="text" onchange="{{nameChange}}"></input>
	<button onclick="changeColor()">Click</button>
	<button onclick="changeArray()">Change</button>
	<button onclick="changeArraySource()">Change Array Source</button>
	<ul>
          <li nsbind-repeater="{{country in countries}}">
            <strong>  Country Name : </strong> {{country..name}} -
            <strong>  Country Code : </strong> {{country..code}}
			<strong>  color : </strong> {{tempColor}}
            <input type="text" value="{{country..name}}">
            <input type="text" value="{{country..code}}">
          </li>
    </ul>
</div>

<script>
	var objData = {};
	function loadHandler(event) 
	{
		objData = {name:"Anurag",tempColor:"red",tempClass:"red"};
		objData["tempName"] = {name:"Anurag",tempColor:"red"};
		objData["countries"] = [{
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
		objData["nameChange"] = function(event)
		{
			var text = event.target.value;
			objData["name"] = text;
		}
		var nsMvc = new NSBinding("myDiv",objData);
		//console.log(document.querySelector('[data-ns-container]') || document.querySelector('[ns-container]'));
	}
	
	function nameChange(event)
	{
		var text = event.target.value;
		objData["name"] = text;
	}
	
	function changeColor()
	{
		objData["tempColor"] = "blue";
		//objData["tempClass"] = "blue";
		objData["tempName"]["name"] = "Var";
	}
	
	function changeArray()
	{
		//objData["countries"][2]["code"] = "aa";
		//objData["abc"] = "efg";
		objData["tempName"]["abc"] = "efg";
		//objData["countries"][2]["code"] = "aa";
	}
	
	function changeArraySource()
	{
		objData["countries"] = [{
	          name: 'Afghanistan',
	          code: 'AF'
	        }, {
	          name: 'Aland Islands',
	          code: 'AX'
	        }];
	}
    
	window.addEventListener('load', loadHandler);
	
</script>
</body>
</html>
