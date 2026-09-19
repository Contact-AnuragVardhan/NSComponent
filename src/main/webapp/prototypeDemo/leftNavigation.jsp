<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.css">

<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
<link href="../lib/css/com/org/nsNavigation.css" rel="stylesheet">
<link href="../lib/css/com/org/nsFloatingLabel.css" rel="stylesheet">
<script src="../lib/com/org/util/nsUtil.js"></script>
<script src="../lib/com/org/util/nsFilter.js"></script>
<script src="../lib/com/org/util/nsFloatingLabel.js"></script>
<script src="../lib/com/org/prototype/base/nsContainerBase.js"></script>
<script src="../lib/com/org/prototype/nsNavigation.js"></script>

<title>Left Navigation demo</title>
 <style>
 	body,html
	{
		margin:0px;
		padding:0px;
		height:100%;
		background:#FFFFFF;
	}
	.themeDropdown 
	{
	    background: none repeat scroll 0 0 transparent;
	    padding: 2px 10px;
	}
	.themeDropdown 
	{
	    color: black;
	    background-color: white;
	}
	div.fixed 
	{
	    position: fixed;
	    top: 0;
	    right: 0;
	    width: 300px;
	}
	.expanded {
	    transform: rotate(90deg);
	}
	
	
 </style>
</head>
<body onload="initialize()">
	<div class="nmPageContainer" style="min-height: 925px;">
		<div id="divNav" class="nmPageNavigation">
				
		</div>
		<div class="fixed">
			<select id="cmbTheme" class="themeDropdown" onchange="themeChangehandler(event)">
			</select>
		</div>
	</div>
	<script>
		var nsNav = null;
		var arrTheme = [{label:"Select Theme",value:"",selected:false},{label:"White",value:"White",selected:true},{label:"Black",value:"Black",selected:false}];
		function initialize()
		{
			initializeThemeDropdown();
			var dataSource = [{menuName:"Home",link:"#Home",iconBeforeHtml:"<i class='fa fa-home' aria-hidden='true'></i>",iconAfterHtml:null,selected: true},
				{menuName:"Basic Elements",link:"#GroupA",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",expanded:true,
				childMenus:[{menuName:"Buttons",link:"#GroupASub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
				            {menuName:"Inputs",link:"#GroupASub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
				            {menuName:"Select",link:"#GroupASub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
				            {menuName:"Checkboxes",link:"#GroupASub4",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
				            {menuName:"Radio Buttons",link:"#GroupASub5",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
				            {menuName:"Switch",link:"#GroupASub6",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"}]},
				  {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
				  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
				              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
				              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
	              {menuName:"Left Navbar",link:"#GroupC",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",expanded:true,
	   			  childMenus:[{menuName:"Left Navbar",link:"#GroupCSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"}]},
	   			{menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
					  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
					              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
					              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
					              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
									  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
									              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
									              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
									              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
													  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
													              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
													              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
													              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																	  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																	              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																	              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
																	              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																					  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																					              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																					              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
																					              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																									  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																									              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																									              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
																									              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																													  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																													              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																													              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
																													              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																																	  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																																	              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																																	              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
																																	              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																																					  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																																					              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																																					              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
																																					              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																																									  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																																									              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																																									              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
																																									              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																																													  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																																													              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																																													              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
																																													              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																																																	  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																																																	              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																																																	              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
																																																	              {menuName:"Top Navbar",link:"#GroupB",iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:"scrollToSection(this)",
																																																					  childMenus:[{menuName:"Navbar Version 1",link:"#GroupBSub1",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)"},
																																																					              {menuName:"Navbar Version 2",link:"#GroupBSub2",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",disabled:true},
																																																					              {menuName:"Navbar Version 3",link:"#GroupBSub3",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:"scrollToSection(this)",selected:true}]},
			];
			var divNav = document.getElementById("divNav");
			//var filterConfig = {label: "Search",position: "Bottom"};
			//var filterConfig = {label: "Search",position: "Right"};
			//var filterConfig = {label: "Search",position: "Top",topPosition: "Top"};
			//var filterConfig = {label: "Search",position: "Top",topPosition: "Bottom"};
			var setting = {header:"NSS2 NAVIGATION",pageHeaderContainer:null,showCollapseIcon:true,iconCollapse:"<i class='fa fa-bars pull-right'></i>",
					titleField:"menuName",childField:"childMenus",iconPosition:"right",iconMenuExpanded:"<i class='fa fa-angle-down'></i>",
					iconMenuCollapsed:"<i class='fa fa-angle-down expanded'></i>",collapseTopOffset:50,enableAnimation:true,
					dataSource:dataSource,enableFilter: true};//filterConfig: filterConfig,
			
			nsNav = new NSNavigation(divNav,setting);
			
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
		    		//nsNav.setTheme(item["value"]);
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
			}
		}
	</script>
</body>
</html>