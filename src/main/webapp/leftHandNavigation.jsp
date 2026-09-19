<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.css">

<link href="lib/css/com/org/nsComponent.css" rel="stylesheet">
<link href="lib/css/com/org/nsNavigation.css" rel="stylesheet">
<script src="lib/com/org/util/nsUtil.js"></script>
<script src="lib/com/org/prototype/base/nsContainerBase.js"></script>
<script src="lib/com/org/prototype/nsNavigation.js"></script>
<style>
body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 400;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
</head>
<body class="nsNavBodyWhite" onload="init();">
	<nav id="divMenu">
		
	</nav>
	<div class="content-wrapper" style="min-height: 901px;">
	</div>
	
<script>
	function init()
	{
		var dataSource = [{menuName:"Hierarchies",link:null,iconBeforeHtml:"<i class='fa fa-sitemap'></i>",iconAfterHtml:null,click:null,
							childMenus:[{menuName:"Manage Hierarchies",link:"#hm",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:null}]},
						  {menuName:"Tasks",link:null,iconBeforeHtml:"<i class='fa fa-tasks'></i>",iconAfterHtml:null,click:null,
							  childMenus:[{menuName:"Pending Tasks / Reviews",link:"#pendingTask",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:null},
							              {menuName:"Historical Reviews",link:"#historicalReview",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:null},
							  			  {menuName:"Outstanding Tasks",link:"#outstandingTask",iconBeforeHtml:"<i class='fa fa-circle-o'></i>",iconAfterHtml:null,click:null}]},
						  {menuName:"Contacts",link:"#about",iconBeforeHtml:"<i class='fa fa-home'></i>",iconAfterHtml:null,click:null}
						];
		var setting = {header:"NSS2 NAVIGATION",showCollapseIcon:true,iconCollapse:"<i class='fa fa-bars pull-right'></i>",
						titleField:"menuName",childField:"childMenus",iconPosition:"right",iconMenuExpanded:"<i class='fa fa-angle-left'></i>",
						iconMenuCollapsed:"<i class='fa fa-angle-left'></i>",enableAnimation:false,
						dataSource:dataSource};
		
		var divMenu = document.getElementById("divMenu");
		var nsNav = new NSNavigation(divMenu,setting);
		
	}
</script>

<script>




</script>

</body>
</html>