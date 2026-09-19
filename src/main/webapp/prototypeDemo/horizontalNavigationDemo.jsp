<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Horizontal Navigation Demo</title>
<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: 'Inter';
    font-size: 16px;
}



.navigationGray {
    background-color: #d3d3d3;
    color: #000;
}

.navigationBlue {
	background-color: #03a9f5;
    color: #fff;
}

.navigationBlack {
	background-color: #000;
    color: #fff;
}
</style>
<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link href="../lib/css/com/org/nsHorizontalNavigation.css" rel="stylesheet">

<script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
<script src="/JSLib/lib/com/org/prototype/nsHorizontalNavigation.js"></script>
</head>
<body onload="loadHandler();">
	<div id="conNav" class="navigationGray">
	</div>
	<br/>
	<br/>
	<div class="fixed">
			<select id="cmbTheme" class="themeDropdown" onchange="themeChangehandler(event)">
			</select>
	</div>
	<script>
	function menuClickHandler(event,item)
	{
		if(item)
		{
			console.log("Menu with text " + item.title + " was selected.");			
		}
	}
	var dataSource = [{
		title: 'Menu 1',
		iconBeforeHtml: '<i class="fa fa-folder-open"></i>',
		click: menuClickHandler
	},{
		title: 'Menu 2',
		iconBeforeHtml: '<i class="fa fa-reply"></i>',
		disabled:true,
		click: menuClickHandler
	},{
		title: 'Menu 3',
		iconBeforeHtml: '<i class="fa fa-users"></i>',
		children: [{
			title: 'Menu 3.1',
			iconBeforeHtml: '<img src="../demo/assets/images/cut.png"></img>',
			click: menuClickHandler
		}, 
		{
			title: 'Menu 3.2',
			iconBeforeHtml: '<i class="fa fa-users"></i>',
			children:[{
					title: 'Menu 3.2.1 ',
					iconBeforeHtml: '<i class="fa fa-users"></i>',
					click: menuClickHandler
				}, {
					title: 'Menu 3.2.2',
					iconBeforeHtml: '<i class="fa fa-users"></i>',
					children:[{
						title: 'Menu 3.2.2.1 ',
						iconBeforeHtml: '<i class="fa fa-users"></i>',
						click: menuClickHandler
					}, {
						title: 'Menu 3.2.2.2',
						iconBeforeHtml: '<i class="fa fa-users"></i>',
						click: menuClickHandler
					}]
				}]
		}]
	},{
		title: 'Menu 4',
		iconBeforeHtml: '<i class="fa fa-link"></i>',
		link: "http://www.google.com",
		attributes: {"target": "_blank"}
	},{
		title: 'Menu 5',
		iconBeforeHtml: '<i class="fa fa-users"></i>',
		children: [{
			title: 'Menu 5.1',
			iconBeforeHtml: '<img src="../demo/assets/images/cut.png"></img>',
			click: menuClickHandler
		}, 
		{
			title: 'Menu 5.2',
			iconBeforeHtml: '<i class="fa fa-users"></i>',
			children:[{
					title: 'Menu 5.2.1 ',
					iconBeforeHtml: '<i class="fa fa-users"></i>',
					click: menuClickHandler
				}, {
					title: 'Menu 5.2.2',
					iconBeforeHtml: '<i class="fa fa-users"></i>',
					children:[{
						title: 'Menu 5.2.2.1 ',
						iconBeforeHtml: '<i class="fa fa-users"></i>',
						click: menuClickHandler
					}, {
						title: 'Menu 5.2.2.2',
						iconBeforeHtml: '<i class="fa fa-users"></i>',
						click: menuClickHandler
					}]
				}]
		}]
	}
	];
	
	var arrTheme = [{label:"Gray",value:"Gray",selected:true},{label:"Blue",value:"Blue",selected:false},{label:"Black",value:"Black",selected:false}];
	var nsNav = null;
	
	function loadHandler()
	{
		var setting = {dataSource: dataSource,enableOpenOnClick: true,enableAnimation: false}
		nsNav = new NSHorizontalNavigation(document.getElementById("conNav"),setting);
		initializeThemeDropdown();
	}
	
	function initializeThemeDropdown()
	{
		var cmbTheme = document.getElementById("cmbTheme");
	    for(var count = cmbTheme.options.length - 1 ;count >= 0 ; count--)
	    {
	    	cmbTheme.remove(count);
	    }
	    for(var count = 0 ;count < arrTheme.length ; count++)
	    {
	    	var option = document.createElement("option");
	    	var item = arrTheme[count];
	    	option.text = item["label"];
	    	option.value = item["value"];
	    	if(item.selected)
	    	{
	    		option.selected = true;
	    	}
	    	cmbTheme.add(option);
	    }
	}
	function themeChangehandler(event)
	{
		var cmbTheme = document.getElementById("cmbTheme");
		if(cmbTheme && cmbTheme.value != "")
		{
			var color = cmbTheme.value;
			nsNav.setTheme(color);
			document.getElementById("conNav").setAttribute("class","navigation" + color);
		}
	}
	
	
	</script>
	
</body>
</html>