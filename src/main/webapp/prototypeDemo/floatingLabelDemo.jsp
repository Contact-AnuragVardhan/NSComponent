<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link href="../lib/css/com/org/nsFloatingLabel.css" rel="stylesheet">
<script src="../lib/com/org/util/nsUtil.js"></script>
<script src="../lib/com/org/util/nsFloatingLabel.js"></script>


<title>Floating Label demo</title>
 <style>
 	body,html
	{
		margin:0px;
		padding:0px;
		height:100%;
		background:#FFFFFF;
    	font-family: "Open Sans", sans-serif;
    	color: #424242;
	}
	.container
	{
		width:100%;
		height:30%;
		flex: 1 1 auto;
   		padding-left: 25px;
   		padding-top: 50px;
	}
	
	.conItem
	{
		display: inline-block;
		width:20%;
	}
	
	div.fixed 
	{
	    position: fixed;
	    top: 0;
	    right: 0;
	    width: 300px;
	}
	
	.width30per
	{
		width: 30% !important;
	}
	
	.width40per
	{
		width: 40% !important;
	}
	
	
	
 </style>
</head>
<body onload="initialize()">
	<div class="fixed">
			<select id="cmbTheme" class="themeDropdown" onchange="themeChangehandler(event)">
			</select>
	</div>
	<div class="container">
		<p>Top Label</p>
		<div class="conItem">
			<p>Container as input and Control as Input and Position as Top</p>
			<div id="divTopTopContainerInput" oninput="eventHandler(event)">
			</div>
		</div>
		<div class="conItem">
			<p>Container as input and Control as Input and Position as Middle</p>
			<div id="divTopMiddleContainerInput" oninput="eventHandler(event)">
			</div>
		</div>
		<div class="conItem">
			<p>Container as input and Control as Text Area and Position as Bottom</p>
			<div id="divTopBottomContainerInput" oninput="eventHandler(event)">
			</div>
		</div>
		<div class="conItem">
			<p>Text Area Control as input and Position as Middle</p>
			<textarea id="textTopMiddleTextArea"></textarea>
		</div>
	</div>
	<div class="container">
		<p>Bottom Label</p>
		<div class="conItem">
			<p>Container as input and Control as Input</p>
			<div id="divBottomContainerInput" oninput="eventHandler(event)">
			</div>
		</div>
		<div class="conItem">
			<p>Container as input and Control as TextArea</p>
			<div id="divBottomContainerTextArea">
			</div>
		</div>
		<div class="conItem">
			<p>Input Control as input</p>
			<input id="txtBottomInput" type="text">
		</div>
		<div class="conItem">
			<p>Text Area Control as input</p>
			<textarea id="textBottomTextArea"></textarea>
		</div>
	</div>
	<div class="container">
		<p>Right Label</p>
		<div class="conItem">
			<p>Container as input and Control as Input</p>
			<div id="divRightContainerInput">
			</div>
		</div>
		<div class="conItem">
			<p>Container as input and Control as Input</p>
			<div id="divRightContainerTextArea">
			</div>
		</div>
		<div class="conItem">
			<p>Input Control as input</p>
			<input id="txtRightInput" type="text">
		</div>
		<div class="conItem">
			<p>Text Area Control as input</p>
			<textarea id="textRightTextArea"></textarea>
		</div>
	</div>
	<script>
	
		var arrTheme = [{label:"Select Theme",value:"",selected:false},{label:"White",value:"White",color:"#424242",selected:true},{label:"Black",value:"Black",color:"#FFFFFF",selected:false}];
		
		var nsLabelTopTopConInput = null;
		var nsLabelTopMiddleConInput = null;
		var nsLabelTopBottomConInput = null;
		var nsLabelTopMiddleTextArea = null;
		
		var nsLabelBottomConInput = null;
		var nsLabelBottomConTextArea = null;
		var nsLabelBottomInput = null;
		var nsLabelBottomTextArea = null;
		
		var nsLabelRightConInput = null;
		var nsLabelRightConTextArea = null;
		var nsLabelRightInput = null;
		var nsLabelRightTextArea = null;
		function initialize()
		{
			initializeThemeDropdown();
			initializeTop();
			initializeBottom();
			initializeRight();
			
		}
		
		function initializeTop()
		{
			var divTopTopContainerInput = document.getElementById("divTopTopContainerInput");
			var settingContainer = {container: divTopTopContainerInput,label: "Search",topPosition: "Top"};
			nsLabelTopTopConInput = new NSFloatingLabel(settingContainer);
			
			var divTopMiddleContainerInput = document.getElementById("divTopMiddleContainerInput");
			var settingContainer = {container: divTopMiddleContainerInput,label: "Search"};
			nsLabelTopMiddleConInput = new NSFloatingLabel(settingContainer);
			
			var divTopBottomContainerInput = document.getElementById("divTopBottomContainerInput");
			var settingContainer = {container: divTopBottomContainerInput,label: "Search",topPosition: "Bottom"};
			nsLabelTopBottomConInput = new NSFloatingLabel(settingContainer);
			
			var textTopMiddleTextArea = document.getElementById("textTopMiddleTextArea");
			var settingContainer = {control: textTopMiddleTextArea,label: "Search",topPosition: "Middle"};
			nsLabelTopMiddleTextArea = new NSFloatingLabel(settingContainer);
		}
		
		function initializeBottom()
		{
			var divBottomContainerInput = document.getElementById("divBottomContainerInput");
			var settingContainer = {container: divBottomContainerInput,label: "Search",position: "Bottom"};
			nsLabelBottomConInput = new NSFloatingLabel(settingContainer);
			
			var divBottomContainerTextArea = document.getElementById("divBottomContainerTextArea");
			settingContainer = {container: divBottomContainerTextArea,label: "Text Area",position: "Bottom",controlType: "textarea"};
			nsLabelBottomConTextArea = new NSFloatingLabel(settingContainer);
			
			var txtBottomInput = document.getElementById("txtBottomInput");
			settingContainer = {control: txtBottomInput,label: "Enter Text",position: "Bottom"};
			nsLabelBottomInput = new NSFloatingLabel(settingContainer);
			
			var textBottomTextArea = document.getElementById("textBottomTextArea");
			settingContainer = {control: textBottomTextArea,label: "Enter Text in Text Area",position: "Bottom"};
			nsLabelBottomTextArea = new NSFloatingLabel(settingContainer);
		}
		
		function initializeRight()
		{
			var divRightContainerInput = document.getElementById("divRightContainerInput");
			var settingContainer = {container: divRightContainerInput,label: "Search",position: "Right"};
			nsLabelRightConInput = new NSFloatingLabel(settingContainer);
			
			var divRightContainerTextArea = document.getElementById("divRightContainerTextArea");
			settingContainer = {container: divRightContainerTextArea,label: "Text Area",position: "Right",controlType: "textarea",customClass:{label: "width30per"}};
			nsLabelRightConTextArea = new NSFloatingLabel(settingContainer);
			
			var txtRightInput = document.getElementById("txtRightInput");
			settingContainer = {control: txtRightInput,label: "Enter Text",position: "Right",customClass:{label: "width30per"}};
			nsLabelRightInput = new NSFloatingLabel(settingContainer);
			
			var textRightTextArea = document.getElementById("textRightTextArea");
			settingContainer = {control: textRightTextArea,label: "Enter Text in Text Area",position: "Right",customClass:{label: "width40per"}};
			nsLabelRightTextArea = new NSFloatingLabel(settingContainer);
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
			if(cmbTheme && cmbTheme.selectedIndex > -1 && cmbTheme.value != "")
			{
				var item = arrTheme[cmbTheme.selectedIndex];
				var color = cmbTheme.value;
				document.body.style.background = color;
				document.body.style.color = item.color;
				
				nsLabelTopTopConInput.setTheme(color);
				nsLabelTopMiddleConInput.setTheme(color);
				nsLabelTopBottomConInput.setTheme(color);
				nsLabelTopMiddleTextArea.setTheme(color);
				
				nsLabelBottomConInput.setTheme(color);
				nsLabelBottomConTextArea.setTheme(color);
				nsLabelBottomInput.setTheme(color);
				nsLabelBottomTextArea.setTheme(color);
				
				nsLabelRightConInput.setTheme(color);
				nsLabelRightConTextArea.setTheme(color);
				nsLabelRightInput.setTheme(color);
				nsLabelRightTextArea.setTheme(color);
			}
		}
		
		function eventHandler(event)
		{
			console.log(event);
		}
	</script>
</body>
</html>