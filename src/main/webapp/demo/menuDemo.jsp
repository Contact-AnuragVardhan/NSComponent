<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Menu Demo</title>
<style>
.list 
{
	margin: 1em;
	float: left;
}

.list  UL 
{
	padding: 0px;
	margin: 0em 1em;
}

.list LI 
{
	width: 100px;
	border: solid 1px #2AA7DE;
	background: #e7e5e4;
	padding: 5px 5px;
	margin: 2px 0px;
	list-style: none;
}

.divClick 
{
    width: 200px;
    height: 80px;
    background: #e7e5e4;
    color: #000000;
    padding: 4em .5em;
    margin: 1em;
    float: left;
}
	
</style>
<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
<link href="../lib/css/com/org/nsMenu.css" rel="stylesheet">

<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
<script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
<script src="/JSLib/lib/com/org/util/nsMenu.js"></script>
</head>
<body onload="loadHandler();">
	<div id="myList" class="list">
			<ul>
				<li index="1">Item 1</li>
				<li index="2">Item 2</li>
				<li index="3">Item 3</li>
				<li index="4">Item 4</li>
				<li index="5">Item 5</li>
				<li index="6">Item 6</li>
			</ul>
	</div>
	
	<div id="divClick" class="divClick" >Click Here for Menu</div>
	<div id="divDoubleClick" class="divClick" >Double Click Here for Menu</div>
	<script>
	var dataSource = [{
		title: 'Menu 1',
		iconHTML: '<i class="fa fa-folder-open"></i>',
		header: true,
		handler: menuClickHandler
	},{
		title: 'Menu 2',
		iconHTML: '<i class="fa fa-reply"></i>',
		disabled:true,
		separatorBelow:true,
		handler: menuClickHandler
	},{
		title: 'Menu 3',
		iconHTML: '<i class="fa fa-users"></i>',
		children: [{
			title: 'Menu 3.1',
			iconHTML: '<img src="../demo/assets/images/cut.png"></img>',
			handler: menuClickHandler
		}, {
			title: 'Menu 3.2',
			children:[{
					title: 'Menu 3.2.1 ',
					handler: menuClickHandler
				}, {
					title: 'Menu 3.2.2',
					children:[{
						title: 'Menu 3.2.2.1 ',
						header: true,
						handler: menuClickHandler
					}, {
						title: 'Menu 3.2.2.2',
						handler: menuClickHandler
					}]
				}]
		}]
	} ];

	function loadHandler()
	{
		
			var settingContextMenu = {parent:document.querySelector("#myList"),dataSource:dataSource,isContextMenu:true};
			var settingRuntimeMenu = {parent:document.querySelector("#myList"),isContextMenu:true,createRunTime:true,sourceProvider:dataSourceProvider};
			var settingClickMenu = {parent:document.querySelector("#divClick"),dataSource:dataSource,isContextMenu:false,eventType:"mouseover"};
			var settingDoubleClickMenu = {parent:document.querySelector("#divDoubleClick"),dataSource:dataSource,isContextMenu:false,eventType:"dblclick"};
			var ulMenu = new NSMenu(settingRuntimeMenu);
			var divClickMenu = new NSMenu(settingClickMenu);
			var divDoubleClickMenu = new NSMenu(settingDoubleClickMenu);
	}
	
	function dataSourceProvider(component)
	{
		var source = [];
		if(component && component.hasAttribute("index"))
		{
			var index = parseInt(component.getAttribute("index"));
			for(var count = index;count < 10;count++)
			{
				var item = {title: 'Menu ' + count,iconHTML: '<i class="fa fa-folder-open"></i>',handler: menuClickHandler};
				if(count === index)
				{
					item.header = true;
				}
				source.push(item);
			}
		}
		return source;
	}
	
	function menuClickHandler(target,item)
	{
		if(item)
		{
			console.log("Menu with text " + item.title + " was selected for Target " + target.getAttribute("index") + " with text as "  + target.innerHTML);			
		}
	}
	</script>
	
</body>
</html>