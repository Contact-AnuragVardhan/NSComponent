<!DOCTYPE html>
<html lang="en">
<head>
  <title>TabNavigator Demo</title>
  
  <style>
	* {
	  box-sizing: border-box;
	}
	html 
	{
    	line-height: 1.15;
    	background-color: #eee;
    }
	.container
	{
		margin-right: auto;
		margin-left: auto;
		padding: 1rem;
		max-width: 32rem;
		height: 30%;
	}
	.header
	{
		font-size: 1.5rem;
		margin-top: 1rem;
	    margin-bottom: 1rem;
	    color: rgba(0,0,0,.9);
	    font-weight: 200;
	}
	.contentHeight
	{
		height:259px !important;
	}
	
	
	</style>
  <link href="/JSLib/lib/css/com/org/nsComponent.css" rel="stylesheet">
  <link href="/JSLib/lib/css/com/org/nsCarousel.css" rel="stylesheet">
  <link href="/JSLib/lib/css/com/org/nsTabNavigator.css" rel="stylesheet">
  <script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
  <script src="/JSLib/lib/com/org/util/nsScrollAnimator.js"></script>
  <script src="/JSLib/lib/com/org/prototype/base/nsContainerBase.js"></script>
  <script src="/JSLib/lib/com/org/util/nsCarousel.js"></script>
  <script src="/JSLib/lib/com/org/prototype/nsTabNavigator.js"></script>
</head>
<body>

<div class="container">
	<h3 class="header">Basic Tabs</h3>
	<div>
		<ul id="conDemo1">
			        <li><a href="#tab-1-1" data-ns-default>Tab-1</a></li>
			        <li><a href="#tab-1-2">Tab-2</a></li>
			        <li><a href="#tab-1-3">Tab-3</a></li>
			        <li><a href="#tab-1-4" data-ns-hidden>Tab-4</a></li>
			        <li><a href="#tab-1-5" data-ns-disabled>Tab-5</a></li>
			        <li><a href="#tab-1-6">Tab-6</a></li>
			        <li><a href="#tab-1-7">Tab-7</a></li>
			        <li><a href="#tab-1-8">Tab-8</a></li>
			        <li><a href="#tab-1-9">Tab-9</a></li>
			        <li><a href="#tab-1-10">Tab-10</a></li>
			        <li><a href="#tab-1-11">Tab-11</a></li>
			        <li><a href="#tab-1-12">Tab-12</a></li>
		</ul>
		<div id="conDemo1ContentParent">
		    <div id="tab-1-1">
		        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu scelerisque eros. Fusce ante orci, hendrerit sit amet metus sit amet, venenatis sodales felis. Morbi vel mi in leo dignissim convallis in a neque. Suspendisse sollicitudin nibh non dapibus condimentum. Etiam sit amet arcu ultricies, porttitor justo eget, scelerisque urna. Praesent non ligula nec ligula euismod condimentum eget sed augue. Ut feugiat, turpis id sollicitudin vestibulum, tellus massa adipiscing nisl, quis cursus nisl arcu vel ipsum.</p>
		    </div>
		    <div id="tab-1-2">
		        <p>Quisque sodales sodales lacus pharetra bibendum. Etiam commodo non velit ac rhoncus. Mauris euismod purus sem, ac adipiscing quam laoreet et. Praesent vulputate ornare sem vel scelerisque. Ut dictum augue non erat lacinia, sed lobortis elit gravida. Proin ante massa, ornare accumsan ultricies et, posuere sit amet magna. Praesent dignissim, enim sed malesuada luctus, arcu sapien sodales sapien, ut placerat eros nunc vel est. Donec tristique mi turpis, et sodales nibh gravida eu. Etiam odio risus, porttitor non lacus id, rhoncus tempus tortor. Curabitur tincidunt molestie turpis, ut luctus nibh sollicitudin vel. Sed vel luctus nisi, at mattis metus. Aenean ultricies dolor est, a congue ante dapibus varius. Nulla at auctor nunc. Curabitur accumsan feugiat felis ut pretium. Praesent semper semper nisi, eu cursus augue.</p>
		    </div>
		    <div id="tab-1-3">
		        <p>Mauris facilisis elit ut sem eleifend accumsan molestie sit amet dolor. Pellentesque dapibus arcu eu lorem laoreet, vitae cursus metus mattis. Nullam eget porta enim, eu rutrum magna. Duis quis tincidunt sem, sit amet faucibus magna. Integer commodo, turpis consequat fermentum egestas, leo odio posuere dui, elementum placerat eros erat id augue. Nullam at eros eget urna vestibulum malesuada vitae eu mauris. Aliquam interdum rhoncus velit, quis scelerisque leo viverra non. Suspendisse id feugiat dui. Nulla in aliquet leo. Proin vel magna sed est gravida rhoncus. Mauris lobortis condimentum nibh, vitae bibendum tortor vehicula ac. Curabitur posuere arcu eros.</p>
		    </div>
		    <div id="tab-1-4">
		        <p>Donec egestas facilisis sapien sit amet euismod. Donec mollis lectus neque, in consectetur magna sodales et. Nam rutrum libero vitae magna sollicitudin aliquet. In tristique ultrices euismod. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse pretium congue sodales. Curabitur egestas, metus sed ultrices suscipit, metus nibh vehicula ligula, vel volutpat sapien nibh sed quam. Etiam elementum nisi eu risus congue, ut eleifend lectus ultricies. Vivamus in ligula fermentum, bibendum sapien eget, pretium est. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec ut ante non risus rutrum faucibus.</p>
		    </div>
		    <div id="tab-1-5">
		        <p>Proin dignissim faucibus odio sollicitudin sagittis. Phasellus aliquet, erat vitae mollis consectetur, enim lectus ornare libero, et porta mi dui eu tellus. Morbi lobortis, elit at euismod porta, magna lacus mattis massa, a lacinia ligula risus et lectus. Sed et aliquam ligula. Nunc venenatis orci magna, quis facilisis sem porta non. Nunc sodales arcu in consectetur malesuada. Maecenas varius justo lacus, scelerisque viverra tellus luctus eu. Nam imperdiet ultricies suscipit. Ut urna mauris, eleifend quis lacinia non, mollis id libero. Praesent pharetra viverra ipsum at posuere. Quisque commodo tortor nec hendrerit faucibus. Fusce convallis urna et vehicula tincidunt. Duis sed vehicula justo, eu placerat nisi. Donec facilisis augue non turpis semper, eget condimentum mauris malesuada. Nunc in dignissim mi, sed laoreet felis.</p>
		    </div>
		    <div id="tab-1-6">
		        <p>This is tab 6.</p>
		    </div>
		    <div id="tab-1-7">
		        <p>This is tab 7.</p>
		    </div>
		    <div id="tab-1-8">
		        <p>This is tab 8.</p>
		    </div>
		    <div id="tab-1-9">
		        <p>This is tab 9.</p>
		    </div>
		    <div id="tab-1-10">
		        <p>This is tab 10.</p>
		    </div>
		    <div id="tab-1-11">
		        <p>This is tab 11.</p>
		    </div>
		    <div id="tab-1-12">
		        <p>This is tab 12.</p>
		    </div>
		 </div>
	</div>
</div>
<div class="container">
	<h3 class="header">Tabs with different Elements</h3>
   <div id="conDemo2">
	  <button data-nav="#tab-2-1"><span>London</span></button>
	  <button data-nav="#tab-2-2" data-ns-default><span>Paris</span></button>
	  <button data-nav="#tab-2-3"><span>Tab-8</span></button>
	  <button data-nav="#tab-2-4" data-ns-disabled><span>Tab-9</span></button>
	  <button data-nav="#tab-2-5"><span>Tab-10</span></button>
	</div>
	<div id="conDemo2ContentParent">
	    <div id="tab-2-1">
	        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu scelerisque eros. Fusce ante orci, hendrerit sit amet metus sit amet, venenatis sodales felis. Morbi vel mi in leo dignissim convallis in a neque. Suspendisse sollicitudin nibh non dapibus condimentum. Etiam sit amet arcu ultricies, porttitor justo eget, scelerisque urna. Praesent non ligula nec ligula euismod condimentum eget sed augue. Ut feugiat, turpis id sollicitudin vestibulum, tellus massa adipiscing nisl, quis cursus nisl arcu vel ipsum.</p>
	    </div>
	    <div id="tab-2-2">
	        <p>Quisque sodales sodales lacus pharetra bibendum. Etiam commodo non velit ac rhoncus. Mauris euismod purus sem, ac adipiscing quam laoreet et. Praesent vulputate ornare sem vel scelerisque. Ut dictum augue non erat lacinia, sed lobortis elit gravida. Proin ante massa, ornare accumsan ultricies et, posuere sit amet magna. Praesent dignissim, enim sed malesuada luctus, arcu sapien sodales sapien, ut placerat eros nunc vel est. Donec tristique mi turpis, et sodales nibh gravida eu. Etiam odio risus, porttitor non lacus id, rhoncus tempus tortor. Curabitur tincidunt molestie turpis, ut luctus nibh sollicitudin vel. Sed vel luctus nisi, at mattis metus. Aenean ultricies dolor est, a congue ante dapibus varius. Nulla at auctor nunc. Curabitur accumsan feugiat felis ut pretium. Praesent semper semper nisi, eu cursus augue.</p>
	    </div>
	    <div id="tab-2-3">
	        <p>Mauris facilisis elit ut sem eleifend accumsan molestie sit amet dolor. Pellentesque dapibus arcu eu lorem laoreet, vitae cursus metus mattis. Nullam eget porta enim, eu rutrum magna. Duis quis tincidunt sem, sit amet faucibus magna. Integer commodo, turpis consequat fermentum egestas, leo odio posuere dui, elementum placerat eros erat id augue. Nullam at eros eget urna vestibulum malesuada vitae eu mauris. Aliquam interdum rhoncus velit, quis scelerisque leo viverra non. Suspendisse id feugiat dui. Nulla in aliquet leo. Proin vel magna sed est gravida rhoncus. Mauris lobortis condimentum nibh, vitae bibendum tortor vehicula ac. Curabitur posuere arcu eros.</p>
	    </div>
	    <div id="tab-2-4">
	        <p>Donec egestas facilisis sapien sit amet euismod. Donec mollis lectus neque, in consectetur magna sodales et. Nam rutrum libero vitae magna sollicitudin aliquet. In tristique ultrices euismod. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse pretium congue sodales. Curabitur egestas, metus sed ultrices suscipit, metus nibh vehicula ligula, vel volutpat sapien nibh sed quam. Etiam elementum nisi eu risus congue, ut eleifend lectus ultricies. Vivamus in ligula fermentum, bibendum sapien eget, pretium est. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec ut ante non risus rutrum faucibus.</p>
	    </div>
	    <div id="tab-2-5">
	        <p>Proin dignissim faucibus odio sollicitudin sagittis. Phasellus aliquet, erat vitae mollis consectetur, enim lectus ornare libero, et porta mi dui eu tellus. Morbi lobortis, elit at euismod porta, magna lacus mattis massa, a lacinia ligula risus et lectus. Sed et aliquam ligula. Nunc venenatis orci magna, quis facilisis sem porta non. Nunc sodales arcu in consectetur malesuada. Maecenas varius justo lacus, scelerisque viverra tellus luctus eu. Nam imperdiet ultricies suscipit. Ut urna mauris, eleifend quis lacinia non, mollis id libero. Praesent pharetra viverra ipsum at posuere. Quisque commodo tortor nec hendrerit faucibus. Fusce convallis urna et vehicula tincidunt. Duis sed vehicula justo, eu placerat nisi. Donec facilisis augue non turpis semper, eget condimentum mauris malesuada. Nunc in dignissim mi, sed laoreet felis.</p>
	    </div>
    </div>
    <div>
    	<button onClick="refreshTabNav(event)">Refresh Tab After Dynmically Adding Children</button>
    </div>
</div>
<div class="container">
	<h3 class="header">Dynamic Tabs</h3>
   <div id="conDemo3">
	</div>
	<div id="conDemo3ContentParent">
    </div>
</div>
<div class="container">
	<h3 class="header">Tabs with Slide Animation</h3>
   <div id="conDemo4">
	  <button data-nav="#tab-4-1"><span>Tab-4-1</span></button>
	  <button data-nav="#tab-4-2" data-ns-default><span>Tab-4-2</span></button>
	  <button data-nav="#tab-4-3"><span>Tab-4-3</span></button>
	  <button data-nav="#tab-4-4" data-ns-disabled><span>Tab-4-4</span></button>
	  <button data-nav="#tab-4-5"><span>Tab-4-5</span></button>
	</div>
	<div id="conDemo4ContentParent">
	    <div id="tab-4-1" class="contentHeight">
	        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu scelerisque eros. Fusce ante orci, hendrerit sit amet metus sit amet, venenatis sodales felis. Morbi vel mi in leo dignissim convallis in a neque. Suspendisse sollicitudin nibh non dapibus condimentum. Etiam sit amet arcu ultricies, porttitor justo eget, scelerisque urna. Praesent non ligula nec ligula euismod condimentum eget sed augue. Ut feugiat, turpis id sollicitudin vestibulum, tellus massa adipiscing nisl, quis cursus nisl arcu vel ipsum.</p>
	    </div>
	    <div id="tab-4-2" class="contentHeight">
	        <p>Quisque sodales sodales lacus pharetra bibendum. Etiam commodo non velit ac rhoncus. Mauris euismod purus sem, ac adipiscing quam laoreet et. Praesent vulputate ornare sem vel scelerisque. Ut dictum augue non erat lacinia, sed lobortis elit gravida. Proin ante massa, ornare accumsan ultricies et, posuere sit amet magna. Praesent dignissim, enim sed malesuada luctus, arcu sapien sodales sapien, ut placerat eros nunc vel est. Donec tristique mi turpis, et sodales nibh gravida eu. Etiam odio risus, porttitor non lacus id, rhoncus tempus tortor. Curabitur tincidunt molestie turpis, ut luctus nibh sollicitudin vel. Sed vel luctus nisi, at mattis metus. Aenean ultricies dolor est, a congue ante dapibus varius. Nulla at auctor nunc. Curabitur accumsan feugiat felis ut pretium. Praesent semper semper nisi, eu cursus augue.</p>
	    </div>
	    <div id="tab-4-3" class="contentHeight">
	        <p>Mauris facilisis elit ut sem eleifend accumsan molestie sit amet dolor. Pellentesque dapibus arcu eu lorem laoreet, vitae cursus metus mattis. Nullam eget porta enim, eu rutrum magna. Duis quis tincidunt sem, sit amet faucibus magna. Integer commodo, turpis consequat fermentum egestas, leo odio posuere dui, elementum placerat eros erat id augue. Nullam at eros eget urna vestibulum malesuada vitae eu mauris. Aliquam interdum rhoncus velit, quis scelerisque leo viverra non. Suspendisse id feugiat dui. Nulla in aliquet leo. Proin vel magna sed est gravida rhoncus. Mauris lobortis condimentum nibh, vitae bibendum tortor vehicula ac. Curabitur posuere arcu eros.</p>
	    </div>
	    <div id="tab-4-4" class="contentHeight">
	        <p>Donec egestas facilisis sapien sit amet euismod. Donec mollis lectus neque, in consectetur magna sodales et. Nam rutrum libero vitae magna sollicitudin aliquet. In tristique ultrices euismod. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse pretium congue sodales. Curabitur egestas, metus sed ultrices suscipit, metus nibh vehicula ligula, vel volutpat sapien nibh sed quam. Etiam elementum nisi eu risus congue, ut eleifend lectus ultricies. Vivamus in ligula fermentum, bibendum sapien eget, pretium est. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec ut ante non risus rutrum faucibus.</p>
	    </div>
	    <div id="tab-4-5" class="contentHeight">
	        <p>Proin dignissim faucibus odio sollicitudin sagittis. Phasellus aliquet, erat vitae mollis consectetur, enim lectus ornare libero, et porta mi dui eu tellus. Morbi lobortis, elit at euismod porta, magna lacus mattis massa, a lacinia ligula risus et lectus. Sed et aliquam ligula. Nunc venenatis orci magna, quis facilisis sem porta non. Nunc sodales arcu in consectetur malesuada. Maecenas varius justo lacus, scelerisque viverra tellus luctus eu. Nam imperdiet ultricies suscipit. Ut urna mauris, eleifend quis lacinia non, mollis id libero. Praesent pharetra viverra ipsum at posuere. Quisque commodo tortor nec hendrerit faucibus. Fusce convallis urna et vehicula tincidunt. Duis sed vehicula justo, eu placerat nisi. Donec facilisis augue non turpis semper, eget condimentum mauris malesuada. Nunc in dignissim mi, sed laoreet felis.</p>
	    </div>
    </div>
</div>
<script>
	var tabNavigator2 = null;
	function init()
	{
		var ul = document.getElementById("conDemo1");
		var setting1 = {enableClose: true,enableAnimation:true,animationType:"zoom",contentParent:document.getElementById("conDemo1ContentParent"),enableOverflow:true};
		var tabNavigator1 = new NSTabNavigator(ul,setting1);
		var div = document.getElementById("conDemo2");
		var setting2 = {tabParentElement:"button",tabElement:"span",tabAttribute:"data-nav",enableHashChange:true,contentParent:document.getElementById("conDemo2ContentParent")};
		tabNavigator2 = new NSTabNavigator(div,setting2);
		createDynamicTabs();
		ul = document.getElementById("conDemo4");
		var setting4 = {enableAnimation:true,animationType:"slide",tabParentElement:"button",tabElement:"span",tabAttribute:"data-nav",contentParent:document.getElementById("conDemo4ContentParent"),enableOverflow:true};
		var tabNavigator4 = new NSTabNavigator(ul,setting4);
	}
	
	function createDynamicTabs()
	{
		 var colours = [
		            "#867100",
		            "#7F4200",
		            "#99813D",
		            "#40FEFF",
		            "#14CC99", 
		            "#00BAFF",
		            "#0082B2",
		            "#B25D7A",
		            "#00FF17",
		            "#006B49",
		            "#00B27A",
		            "#996B3D",
		            "#CC7014",
		            "#40FF8C",
		            "#FF3400",
		            "#ECBB5E",
		            "#ECBB0C",
		            "#B9D912",
		            "#253A93",
		            "#125FB9",
		        ]
		var content = '<div>' + 
						'<h3>###capital###</h3>' +
						'<p>###capital### is the capital city of ###country###.</p>' +
					  '</div>';
		var arrMap = [{capital:"London", country:"England"},
		              {capital:"Paris", country:"France"},
		              {capital:"Tokyo", country:"Japan"},
		              {capital:"Washington", country:"USA"}];
		var arrSource = [];
		for(var count = 0;count < arrMap.length;count++)
		{
			var item = arrMap[count];
			var sendItem = {};
			sendItem.content = content.replace(new RegExp("###capital###","g"), item.capital);
			sendItem.content = sendItem.content.replace(new RegExp("###country###","g"), item.country);
			sendItem.tab = item.capital;
			if(colours.length > count)
			{
				sendItem.indicatorColor = colours[count];
			}
			arrSource.push(sendItem);
		}
		var div = document.getElementById("conDemo3");
		var setting3 = {enableCreateTabs: true,arrTabs: arrSource,tabParentElement:"button",tabElement:"span",tabAttribute:"data-nav",enableHashChange:true,contentParent:document.getElementById("conDemo3ContentParent")};
		var tabNavigator3 = new NSTabNavigator(div,setting3);
	}
	
	function refreshTabNav(event) {
		var divNav = document.getElementById("conDemo2");
		if(!divNav.querySelector('button[data-nav="#tab-2-6"]')) {
			var tempCon = document.createElement('div');
			tempCon.innerHTML = '<button data-nav="#tab-2-6"><span>Tab-11</span></button>';
			divNav.appendChild(tempCon.firstChild);
		}
		var divParent = document.getElementById("conDemo2ContentParent");
		if(!divParent.querySelector('#tab-2-6')) {
			var tempCon = document.createElement('div');
			tempCon.innerHTML = '<div id="tab-2-6">' + 
		        					'<p>This tab is added dynamically</p>' + 
			    				'</div>';
			divParent.appendChild(tempCon.firstChild);
		}
		tabNavigator2.renderAddedComponents();
	}
	init();
	

</script>

</body>
</html>