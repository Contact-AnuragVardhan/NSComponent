<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Modal Manager Demo</title>
	<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
	<style>
		body,html
		{
			margin:0px;
			padding:0px;
			height:100%;
			background:#FFFFFF;
		}
		.panel
		{
			width: 400px;
		    height: 500px;
			background: white;
		   	padding: 0px 0px 0px 0px;
		    -webkit-border-radius: 4px;
		    -moz-border-radius: 4px;
		    -ms-border-radius: 4px;
		    -o-border-radius: 4px;
		    border-radius: 4px;
		    border-width: 5px;
		    border-style: solid;
		    border-color: #157fcc;
		    background-color: white;
		}
		.panelTitleBar {
		    padding: 5px 2px 5px 5px;
		    background-color: #157fcc;
		    font-size: 12px;
		    text-align: left;
		    color: #ffffff;
		    font-weight: bold;
		    height: 8%;
		    min-height: 20px;
		    max-height: 20px;
		}
		.panelTitleBarContent{
			color: #fefefe;
		    font-weight: bold;
		    font-size: large;
		}
		.container 
		{
	      	background-color: blue;
		}
        .elem{
            background-color: green;
            -webkit-user-select: none;
            -moz-user-select: none;
            -o-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;     
            user-select: none;
        }
	</style>
	
	
	
	<style>
		
		.modal-body
		{
			height:80%;
		}
		.modal-footer
		{
			height:20%;
		}
		
	</style>
	
	<style>
		.modalMessageBody
		{
			height:200px !important;
			overflow-y: scroll;
		}
	</style>
	<link href="../lib/css/com/org/nsComponent.css" rel="stylesheet">
	<link href="../lib/css/com/org/nsPanel.css" rel="stylesheet">
	<link href="../lib/css/com/org/nsMessageBox.css" rel="stylesheet">
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script src="../lib/com/org/util/nsSVG.js"></script>
	<script src="../lib/com/org/prototype/base/nsContainerBase.js"></script>
	<script src="../lib/com/org/prototype/nsPanel.js"></script>
	<script src="../lib/com/org/util/nsMessageBox.js"></script>
	<script src="../lib/com/org/util/nsModalManager.js"></script>
 </head>
<body onload="init();">
<!-- 	<template id="templateDemo"> -->
<!-- 		<div> -->
<!-- 		    <p><b>New York</b> is a <a href="/wiki/U.S._state" title="U.S. state">state</a> in the <a href="/wiki/Northeastern_United_States" title="Northeastern United States">Northeastern United States</a> and is the United States' <a href="/wiki/List_of_U.S._states_and_territories_by_area" title="List of U.S. states and territories by area">27th-most extensive</a>, <a href="/wiki/List_of_U.S._states_and_territories_by_population" title="List of U.S. states and territories by population">fourth-most populous</a>, and <a href="/wiki/List_of_U.S._states_by_population_density" title="List of U.S. states by population density">seventh-most densely populated</a> state. New York is bordered by <a href="/wiki/New_Jersey" title="New Jersey">New Jersey</a> and <a href="/wiki/Pennsylvania" title="Pennsylvania">Pennsylvania</a> to the south and <a href="/wiki/Connecticut" title="Connecticut">Connecticut</a>, <a href="/wiki/Massachusetts" title="Massachusetts">Massachusetts</a>, and <a href="/wiki/Vermont" title="Vermont">Vermont</a> to the east. The state has a <a href="/wiki/Maritime_boundary" title="Maritime boundary">maritime border</a> with <a href="/wiki/Rhode_Island" title="Rhode Island">Rhode Island</a> east of <a href="/wiki/Long_Island" title="Long Island">Long Island</a>, as well as an <a href="/wiki/Canada%E2%80%93United_States_border" title="Canada-United States border">international border</a> with the <a href="/wiki/Canadian_provinces" title="Canadian provinces" class="mw-redirect">Canadian provinces</a> of <a href="/wiki/Quebec" title="Quebec">Quebec</a> to the north and <a href="/wiki/Ontario" title="Ontario">Ontario</a> to the west and north. The state of New York is often referred to as <b>New York State</b> to distinguish it from <a href="/wiki/New_York_City" title="New York City">New York City</a>, the state's most populous city and its economic hub.</p> -->
<!-- 		    <p>With an estimated population of nearly 8.5 million in 2014,<sup id="cite_ref-2014NYCest_8-0" class="reference"><a href="#cite_note-2014NYCest-8"><span>[</span>8<span>]</span></a></sup><sup id="cite_ref-NYCest2_9-0" class="reference"><a href="#cite_note-NYCest2-9"><span>[</span>9<span>]</span></a></sup> New York City is the <a href="/wiki/List_of_United_States_cities_by_population" title="List of United States cities by population">most populous city</a> in the United States and the premier gateway for legal <a href="/wiki/Immigration_to_the_United_States" title="Immigration to the United States">immigration to the United States</a>.<sup id="cite_ref-Immigrants2013est_10-0" class="reference"><a href="#cite_note-Immigrants2013est-10"><span>[</span>10<span>]</span></a></sup><sup id="cite_ref-Immigrants2012est_11-0" class="reference"><a href="#cite_note-Immigrants2012est-11"><span>[</span>11<span>]</span></a></sup><sup id="cite_ref-Immigrants2011est_12-0" class="reference"><a href="#cite_note-Immigrants2011est-12"><span>[</span>12<span>]</span></a></sup> The <a href="/wiki/New_York_City_Metropolitan_Area" title="New York City Metropolitan Area" class="mw-redirect">New York City Metropolitan Area</a> is one of the most populous <a href="/wiki/Urban_agglomeration" title="Urban agglomeration">urban agglomerations</a> in the world.<sup id="cite_ref-13" class="reference"><a href="#cite_note-13"><span>[</span>13<span>]</span></a></sup><sup id="cite_ref-14" class="reference"><a href="#cite_note-14"><span>[</span>14<span>]</span></a></sup> New York City is a <a href="/wiki/Global_city" title="Global city">global city</a>,<sup id="cite_ref-15" class="reference"><a href="#cite_note-15"><span>[</span>15<span>]</span></a></sup> exerting a significant impact upon commerce, finance, media, art, fashion, research, technology, education, and entertainment, its fast pace defining the term <i><a href="/wiki/New_York_minute" title="New York minute" class="mw-redirect">New York minute</a></i>.<sup id="cite_ref-FastPaceNYC1_16-0" class="reference"><a href="#cite_note-FastPaceNYC1-16"><span>[</span>16<span>]</span></a></sup> <sup id="cite_ref-NewYorkMinuteDefinition_17-0" class="reference"><a href="#cite_note-NewYorkMinuteDefinition-17"><span>[</span>17<span>]</span></a></sup> The home of the <a href="/wiki/United_Nations_Headquarters" title="United Nations Headquarters" class="mw-redirect">United Nations Headquarters</a>,<sup id="cite_ref-18" class="reference"><a href="#cite_note-18"><span>[</span>18<span>]</span></a></sup> New York City is an important center for international diplomacy<sup id="cite_ref-19" class="reference"><a href="#cite_note-19"><span>[</span>19<span>]</span></a></sup> and has been described as the cultural and financial capital of the world,<sup id="cite_ref-culture1_20-0" class="reference"><a href="#cite_note-culture1-20"><span>[</span>20<span>]</span></a></sup><sup id="cite_ref-culture2_21-0" class="reference"><a href="#cite_note-culture2-21"><span>[</span>21<span>]</span></a></sup><sup id="cite_ref-culture3_22-0" class="reference"><a href="#cite_note-culture3-22"><span>[</span>22<span>]</span></a></sup><sup id="cite_ref-culture4_23-0" class="reference"><a href="#cite_note-culture4-23"><span>[</span>23<span>]</span></a></sup><sup id="cite_ref-WorldEconomicAndFinancialSuperCenter_24-0" class="reference"><a href="#cite_note-WorldEconomicAndFinancialSuperCenter-24"><span>[</span>24<span>]</span></a></sup> as well as the world's most economically powerful city.<sup id="cite_ref-EconomicallyPowerful2015_25-0" class="reference"><a href="#cite_note-EconomicallyPowerful2015-25"><span>[</span>25<span>]</span></a></sup><sup id="cite_ref-WorldEconomicAndFinancialSuperCenter_24-1" class="reference"><a href="#cite_note-WorldEconomicAndFinancialSuperCenter-24"><span>[</span>24<span>]</span></a></sup><sup id="cite_ref-26" class="reference"><a href="#cite_note-26"><span>[</span>26<span>]</span></a></sup> New York City makes up over 40% of the population of New York State. Two-thirds of the state's population lives in the New York City Metropolitan Area, and nearly 40% live on Long Island.<sup id="cite_ref-NYCest2_9-1" class="reference"><a href="#cite_note-NYCest2-9"><span>[</span>9<span>]</span></a></sup> Both the state and New York City were named for the 17th century <a href="/wiki/Duke_of_York" title="Duke of York">Duke of York</a>, future <a href="/wiki/James_II_of_England" title="James II of England">King James II of England</a>. The next four most populous cities in the state are <a href="/wiki/Buffalo,_New_York" title="Buffalo, New York">Buffalo</a>, <a href="/wiki/Rochester,_New_York" title="Rochester, New York">Rochester</a>, <a href="/wiki/Yonkers,_New_York" title="Yonkers, New York">Yonkers</a>, and <a href="/wiki/Syracuse,_New_York" title="Syracuse, New York">Syracuse</a>, while the <a href="/wiki/List_of_U.S._state_capitals" title="List of U.S. state capitals" class="mw-redirect">state capital</a> is <a href="/wiki/Albany,_New_York" title="Albany, New York">Albany</a>.</p> -->
<!-- 		    <p>The earliest Europeans in New York were <a href="/wiki/French_colonization_of_the_Americas" title="French colonization of the Americas">French colonists</a> and <a href="/wiki/Jesuit_missionaries" title="Jesuit missionaries" class="mw-redirect">Jesuit missionaries</a> who arrived southward from settlements at <a href="/wiki/Montreal" title="Montreal">Montreal</a> for trade and proselytizing. New York had been inhabited by tribes of <a href="/wiki/Algonquian_peoples" title="Algonquian peoples">Algonquian</a> and <a href="/wiki/Iroquoian_languages" title="Iroquoian languages">Iroquoian</a>-speaking <a href="/wiki/Indigenous_peoples_of_the_Americas" title="Indigenous peoples of the Americas">Native Americans</a> for several hundred years by the time <a href="/wiki/Dutch_people" title="Dutch people">Dutch</a> settlers moved into the region in the early 17th century. In 1609, the region was first claimed by <a href="/wiki/Henry_Hudson" title="Henry Hudson">Henry Hudson</a> for the Dutch, who built <a href="/wiki/Fort_Nassau_(North_River)" title="Fort Nassau (North River)">Fort Nassau</a> in 1614 at the confluence of the <a href="/wiki/Hudson_River" title="Hudson River">Hudson</a> and <a href="/wiki/Mohawk_River" title="Mohawk River">Mohawk</a> rivers, where the present-day capital of Albany later developed. The Dutch soon also settled <a href="/wiki/New_Amsterdam" title="New Amsterdam">New Amsterdam</a> and parts of the <a href="/wiki/Hudson_Valley" title="Hudson Valley">Hudson Valley</a>, establishing the colony of <a href="/wiki/New_Netherland" title="New Netherland">New Netherland</a>, a multicultural community from its earliest days and a center of trade and immigration. The <a href="/wiki/Kingdom_of_Great_Britain" title="Kingdom of Great Britain">British</a> annexed the colony from the Dutch in 1664. The borders of the British colony, the <a href="/wiki/Province_of_New_York" title="Province of New York">Province of New York</a>, were similar to those of the present-day state.</p> -->
<!-- 		    <p>Many landmarks in New York are well known to both international and domestic visitors, with New York State hosting four of the world's ten most-visited tourist attractions in 2013: <a href="/wiki/Times_Square" title="Times Square">Times Square</a>, <a href="/wiki/Central_Park" title="Central Park">Central Park</a>, <a href="/wiki/Niagara_Falls" title="Niagara Falls">Niagara Falls</a> (shared with Ontario), and <a href="/wiki/Grand_Central_Terminal" title="Grand Central Terminal">Grand Central Terminal</a>.<sup id="cite_ref-Ann_Shields_27-0" class="reference"><a href="#cite_note-Ann_Shields-27"><span>[</span>27<span>]</span></a></sup> New York is home to the <a href="/wiki/Statue_of_Liberty" title="Statue of Liberty">Statue of Liberty</a>, a symbol of the United States and its ideals of freedom, <a href="/wiki/Democracy" title="Democracy">democracy</a>, and opportunity.<sup id="cite_ref-28" class="reference"><a href="#cite_note-28"><span>[</span>28<span>]</span></a></sup> New York's <a href="/wiki/List_of_colleges_and_universities_in_New_York" title="List of colleges and universities in New York">higher education network</a> comprises approximately 200 colleges and universities, including <a href="/wiki/Columbia_University" title="Columbia University">Columbia University</a>, <a href="/wiki/Cornell_University" title="Cornell University">Cornell University</a>, <a href="/wiki/New_York_University" title="New York University">New York University</a>, and <a href="/wiki/Rockefeller_University" title="Rockefeller University">Rockefeller University</a>, which have been ranked among the top 35 in the world.<sup id="cite_ref-29" class="reference"><a href="#cite_note-29"><span>[</span>29<span>]</span></a></sup><sup id="cite_ref-30" class="reference"><a href="#cite_note-30"><span>[</span>30<span>]</span></a></sup></p> -->
		
<!-- 		</div> -->
<!-- 	</template> -->
<!-- 	<div id="divDemo" style="width:400px;height:400px;" class="panel"></div> -->
	<button onclick="basicAlert()">Basic Alert</button>
	<button onclick="basicAlertWithCallback()">Basic Alert With Callback</button>
	<button onclick="alertWithOptions()">Alert With Options</button>
	<button onclick="alertWithScroll()">Alert With Scroll</button>
	<button onclick="basicConfirm()">Basic Confirm</button>
	<button onclick="basicConfirmWithCallback()">Basic Confirm With Callback</button>
	<button onclick="confirmWithOptions()">Confirm With Options</button>
	<button onclick="confirmWithScroll()">Confirm With Scroll</button>
	<script>
		var nsAlertDemo = null; 
		var nsConfirmDemo = null; 
		var nsModalManager = null;
		
		var init = function()
		{
			nsModalManager = new NSModalManager();
		};
		
		function basicAlert()
		{
			var util = new NSUtil();
			var toolBarDetails = {
					minimize:{iconHTML:null,title:"Minimize"},
					maximize:{iconHTML:null,title:"Maximize"},
					expand:{iconHTML:null,title:"Expand"},
					collapse:{iconHTML:null,title:"Collapse"},
					fullScreen:{iconHTML:"<i class='icon-fullscreen icon-1' style='pointer-events: none;'></i>",title:"Click here for Full Screen"},
					restore:{iconHTML:"<i class='fa fa-window-restore fa-1'></i>",title:"Click here to Restore"},
					close:{iconHTML:'<button type="button" class="close" data-dismiss="modal">&times;</button>',title:"Close"}
			};
			var setting = {minWidth:100,minHeight:100,enableCollapse:true,enableMinimization:true,
							enableFullScreen:true,enableDrag:true, 
					  		enableResize:true,enableTitleDblClick:true,enableMoveOnClick:true,
					  		customClass:{container:null,titleBar:"modal-header",titleBarContent:"modal-title",iconConatiner:null,icon:null,body:null},
					  		panelSetting:{top:"20%",left:"30%",width:"40%"},
					  		templateUrl:"../demo/demoTemplate.jsp",toolBarDetails:toolBarDetails};
			nsAlertDemo = nsModalManager.alert("This is the basic alert","Basic Alert",null,setting);
			var nsPanel = nsAlertDemo.getPanel();
			var divDemo = nsPanel.getBaseElement();
			util.addEvent(divDemo,NSPanel.DRAG_STARTING,dragStartingHandler);
			util.addEvent(divDemo,NSPanel.DRAGGING,draggingHandler);
			util.addEvent(divDemo,NSPanel.DRAG_END,dragEndHandler);
			util.addEvent(divDemo,NSPanel.RESIZE_STARTING,resizeStartingHandler);
			util.addEvent(divDemo,NSPanel.RESIZING,resizingHandler);
			util.addEvent(divDemo,NSPanel.RESIZE_END,resizeEndHandler);
			util.addEvent(divDemo,NSPanel.MINIMIZE_STARTING,minimizeStartingHandler);
			util.addEvent(divDemo,NSPanel.MINIMIZE_END,minimizeEndHandler);
			util.addEvent(divDemo,NSPanel.MAXIMIZE_STARTING,maximizeStartingHandler);
			util.addEvent(divDemo,NSPanel.MAXIMIZE_END,maximizeEndHandler);
		}
		
		function basicAlertWithCallback()
		{
			var setting = {minWidth:100,minHeight:100};
			var nsMessage = nsModalManager.alert("This is the basic alert with a callback ","Basic Alert",function(){ console.log('This is callback'); },setting);
		}
		
		function alertWithOptions()
		{
			var alertSetting = {minWidth:100,minHeight:100,titleHtml:'<i class="fa fa-bell" style="color: #CA2420;"></i>&nbsp;&nbsp;&nbsp;Alert',bodyContent:null,
								bodyTemplate:null,bodyTemplateUrl:"../demo/demoTemplate.jsp",
								enableModalCloseOnOutsideClick:true,enableModalCloseOnEscape:true,
								buttonLabel:"Done",buttonClass:"btn btn-primary",
								callback:function(event){
									 console.log('This is callback');
								}};
			var nsMessage = nsModalManager.alert(alertSetting);
		}
		
		function alertWithScroll()
		{
			var alertSetting = {minWidth:100,minHeight:100,titleHtml:'<i class="fa fa-bell" style="color: #CA2420;"></i>&nbsp;&nbsp;&nbsp;Alert',bodyContent:null,
								bodyTemplate:null,bodyTemplateUrl:"../demo/demoTemplate.jsp",
								enableModalCloseOnOutsideClick:true,enableModalCloseOnEscape:true,
								buttonLabel:"Done",buttonClass:"btn btn-primary",
								customClass:{container:null,titleBar:null,titleBarContent:null,iconConatiner:null,icon:null,body:null,messageBody:"modalMessageBody",messageFooter:null},
								callback:function(event){
									 console.log('This is callback');
								}};
			var nsMessage = nsModalManager.alert(alertSetting);
		}
		
		function basicConfirm()
		{
			var util = new NSUtil();
			var toolBarDetails = {
					minimize:{iconHTML:null,title:"Minimize"},
					maximize:{iconHTML:null,title:"Maximize"},
					expand:{iconHTML:null,title:"Expand"},
					collapse:{iconHTML:null,title:"Collapse"},
					fullScreen:{iconHTML:"<i class='icon-fullscreen icon-1' style='pointer-events: none;'></i>",title:"Click here for Full Screen"},
					restore:{iconHTML:"<i class='fa fa-window-restore fa-1'></i>",title:"Click here to Restore"},
					close:{iconHTML:'<button type="button" class="close" data-dismiss="modal">&times;</button>',title:"Close"}
			};
			var setting = {minWidth:100,minHeight:100,enableCollapse:true,enableMinimization:true,
							enableFullScreen:true,enableDrag:true, 
					  		enableResize:true,enableTitleDblClick:true,enableMoveOnClick:true,
					  		customClass:{container:null,titleBar:"modal-header",titleBarContent:"modal-title",iconConatiner:null,icon:null,body:null},
					  		panelSetting:{top:"20%",left:"30%",width:"40%"},
					  		templateUrl:"../demo/demoTemplate.jsp",toolBarDetails:toolBarDetails};
			nsConfirmDemo = nsModalManager.confirm("This is the basic confirm","Basic Confirm",null,null,setting);
			var nsPanel = nsConfirmDemo.getPanel();
			var divDemo = nsPanel.getBaseElement();
			util.addEvent(divDemo,NSPanel.DRAG_STARTING,dragStartingHandler);
			util.addEvent(divDemo,NSPanel.DRAGGING,draggingHandler);
			util.addEvent(divDemo,NSPanel.DRAG_END,dragEndHandler);
			util.addEvent(divDemo,NSPanel.RESIZE_STARTING,resizeStartingHandler);
			util.addEvent(divDemo,NSPanel.RESIZING,resizingHandler);
			util.addEvent(divDemo,NSPanel.RESIZE_END,resizeEndHandler);
			util.addEvent(divDemo,NSPanel.MINIMIZE_STARTING,minimizeStartingHandler);
			util.addEvent(divDemo,NSPanel.MINIMIZE_END,minimizeEndHandler);
			util.addEvent(divDemo,NSPanel.MAXIMIZE_STARTING,maximizeStartingHandler);
			util.addEvent(divDemo,NSPanel.MAXIMIZE_END,maximizeEndHandler);
		}
		
		function basicConfirmWithCallback()
		{
			var setting = {title:"Basic Confirm",minWidth:100,minHeight:100};
			var nsMessage = nsModalManager.confirm("This is the basic confirm with a callback ","Confirm",function(){ console.log('This is confirm callback'); },
					function(){ console.log('This is cancel callback'); },setting);
		}
		
		function confirmWithOptions()
		{
			var alertSetting = {minWidth:100,minHeight:100,titleHtml:'<i class="fa fa-bell" style="color: #CA2420;"></i>&nbsp;&nbsp;&nbsp;Confirm',bodyContent:null,
								bodyTemplate:null,bodyTemplateUrl:"../demo/demoTemplate.jsp",
								enableModalCloseOnOutsideClick:true,enableModalCloseOnEscape:true,
								confirm:{label:"OK",cssClass:"btn btn-primary",callback:function(event){console.log("Confirm Clicked");}},
								cancel:{label:"Cancel",cssClass:"btn btn-default",callback:function(event){console.log("Cancel Clicked");}}
								};
			var nsMessage = nsModalManager.confirm(alertSetting);
		}
		
		function confirmWithScroll()
		{
			var alertSetting = {minWidth:100,minHeight:100,titleHtml:'<i class="fa fa-bell" style="color: #CA2420;"></i>&nbsp;&nbsp;&nbsp;Confirm',bodyContent:null,
								bodyTemplate:null,bodyTemplateUrl:"../demo/demoTemplate.jsp",
								enableModalCloseOnOutsideClick:true,enableModalCloseOnEscape:true,
								customClass:{container:null,titleBar:null,titleBarContent:null,iconConatiner:null,icon:null,body:null,messageBody:"modalMessageBody",messageFooter:null},
								confirm:{label:"<i class='fa fa-check'></i>&nbsp;&nbsp;Yes",cssClass:"btn btn-success",callback:function(event){console.log("Yes Clicked");}},
								cancel:{label:"<i class='fa fa-times'></i>&nbsp;&nbsp;No",cssClass:"btn btn-danger",callback:function(event){console.log("No Clicked");}}
								};
			var nsMessage = nsModalManager.confirm(alertSetting);
		}
		
		function templateLoadHandler(content)
		{
			console.log(content);
		}
		
		function dragStartingHandler(event)
		{
			console.log("Drag Starting");
		}
		
		function draggingHandler(event)
		{
			console.log("Dragging at point:: x=" + event.detail.x + ",y=" + event.detail.y);
		}
		
		function dragEndHandler(event)
		{
			console.log("Drag Ended");
		}
		
		function resizeStartingHandler(event)
		{
			console.log("Resize Starting");
		}
		
		function resizingHandler(event)
		{
			console.log("Resizing with measurement:: width=" + event.detail.width + ",height=" + event.detail.height);
		}
		
		function resizeEndHandler(event)
		{
			console.log("Resize Ended");
		}
		
		function minimizeStartingHandler(event)
		{
			console.log("Minimize Starting");
		}
		
		function minimizeEndHandler(event)
		{
			console.log("Minimize Ended");
		}
		
		function maximizeStartingHandler(event)
		{
			console.log("Maximize Starting");
		}
		
		function maximizeEndHandler(event)
		{
			console.log("Maximize Ended");
		}
	</script>
</body>