<!DOCTYPE html>
<html>

<head>

<!--  <link href="../lib/css/com/org/nsComponent.css" rel="stylesheet"> -->

  <script src="../lib/com/org/util/nsImport.js"></script>
  <link href="../demo/css/styles.css" rel="stylesheet">
 
 <style>
 input.radio{
  display:block;
  margin:4px 0 0 0;
  padding:0;
  width:13px;
  height:13px;
}

.horizontalContainer
{
	border-style: solid;
	border-width: 1px;
	position: absolute;
	top: 150px;
	left: 50px;
	/*width: 80%;*/
}

.verticalContainer
{
	border-style: solid;
	border-width: 1px;
	position: absolute;
	top: 150px;
	left: 50px;
	height:500px;
	/*width: 80%;*/
}

.horizontalContainerTemp
{
	border-style: solid;
	border-width: 1px;
	width:300px;
	
	
	/*width: 80%;*/
}

.ag-fresh .ag-group-expand {
  padding-right: 2px;
}
 </style>
 
</head>

<body onload="onload()">

<!-- 	<nsimport file="nsComponent.css"> -->
<!-- 	<nsimport file="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.6.1/CustomElements.js"> -->
<!-- 	<nsimport file="nsUtil.js"> -->
<!-- 	<nsimport file="nsTip.js"> -->
<!-- 	<nsimport file="nsUIComponent.js"> -->
	<nsimport file="nsGroup.js">
	<nsimport file="nsCheckBox.js">
	<nsimport file="nsCheckBox.js">
	<nsimport file="nsDividerBox.js">

	  <div>
		<input id="check1" type="checkbox" name="check" >
		<label class="choice" for="check1">Checkbox No. 1</label>
		<br>
		<input id="check2" type="checkbox" name="check" value="check2">
		<label class="choice" for="check2">Checkbox No. 2</label>
	</div>
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<ns-checkBox id="chkBox" label="Check" change="selectionChange(event)" toolTip="This is a test" toolTipType="critical"></ns-checkBox>
	<input type="button" value="Change Label" onclick="changeText()">
	</input>
	<input type="button" class="" value="Change Layout" onclick="changeLayout()">
	</input>
	
	 <ns-dividerBox direction="vertical" style="width:90%;height:500px;" class="verticalContainer" afterOffset="2">
		<div id="top-vertical-content" style="width:20%;"><!-- min-Width:90px; -->
			This is Left
		</div>
		<div id="top-vertical-content1" style="min-Width:40px;width:40%">
			<ns-dividerBox direction="horizontal" style="height:500px;" afterOffset="-5">
				<div id="top-content" style="height:25%;"><!-- min-Height:40px; -->
					This is the top part<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
				</div>
				<div id="middle-content1" style="min-Height:20px;height:25%;">
					This is the middle part 1<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
				</div>
				<div id="middle-content2" style="min-Height:20px;height:25%;">
					This is the middle part 2<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
				</div>
				<div id="bottom-content" style="height:25%;"> <!-- min-Height:30px; -->
					This is the bottom part<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
					At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.<br/>
				</div>
			</ns-dividerBox>
		</div>
		<div id="top-vertical-content3" style="width:40%;"><!-- min-Width:40px; -->
			This is Right
		</div>
	</ns-dividerBox>
		
	<!--  <div id="divHorizontalTest" class="horizontalContainer">
		<div id="comp7FB7C5F8-980A-40FF-8A84-6C1434D51237#container" class="nsHorizontalResizerContainer">
			<div id="top-content" class=" nsHorizontalResizerChild" style="top: 0%; height: 20%;">
				This is the top part
			</div>
			<div id="comp7FB7C5F8-980A-40FF-8A84-6C1434D51237#resizer0" class="nsHorizontalResizer" style="height: 1.2%; top: 21.2%;">
			</div>
			<div id="bottom-content" class=" nsHorizontalResizerChild" style="top: 21.2%; height: 25%;">
				This is the bottom part
			</div>
		</div>
	</div>-->
	
	
	<span class="ag-group-expand" style="display: inline;"><svg width="10" height="10"><polygon points="0,0 10,5 0,10"></polygon></svg></span>
	<span class="ag-group-expand" style="display: inline;"><svg width="10" height="10"><polygon points="0,0 5,10 10,0"></polygon></svg></span>
	
	<script>
	var count = 0;
	var layoutDirection = null;
	function onload()
	{
		layoutDirection = nsCheckBox.LayoutDirection_LTR;
		var checkBox  = document.getElementById("chkBox");
		//checkBox.addEventListener("change", selectionChange);
	}
	function changeText()
	{
		count++;
		var checkBox  = document.getElementById("chkBox");
		chkBox.setAttribute("label",("Check" + count));
	}
	function changeLayout()
	{
		var checkBox  = document.getElementById("chkBox");
		checkBox.setAttribute("toolTip","Current Direction is " + layoutDirection);
		if(layoutDirection === nsCheckBox.LayoutDirection_LTR)
		{
			layoutDirection = nsCheckBox.LayoutDirection_RTL;
			checkBox.setAttribute("toolTipType","warning");
		}
		else
		{
			layoutDirection = nsCheckBox.LayoutDirection_LTR;
			checkBox.setAttribute("toolTipType","critical");
		}
		chkBox.setAttribute("layoutdirection",layoutDirection);
		
	}
	function selectionChange(event)
	{
		alert("Selection Change " + event.detail);		
	}
	// 	var checkBox = document.createElement("ns-checkBox");
	// 	checkBox.text = "Check";
	// 	document.body.appendChild(checkBox);     
	</script>

</body>

</html>
