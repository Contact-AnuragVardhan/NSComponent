<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Banner Demo</title>
	<script src="../lib/com/org/util/nsImport.js"></script>
</head>
<body onload="test()"  style="margin: 0px;">
	<script>
		function test()
		{
			//window.onscroll = scrollHandler;
		}
	</script>
  <nsimport file="nsBanner.js">
  <div id="divWrite">
  </div>
  <div id="content">
	  <a href="javascript:void(0)" onclick="showInfo();">Success</a> |
	  <a href="javascript:void(0)" onclick="showWarning();">Warning</a> |
	  <a href="javascript:void(0)" onclick="showError();">Error</a> |
	  <a href="javascript:void(0)" onclick="loadCustom();">Custom</a>
  </div>
  <style>
  	.customBanner 
  	{
		height: 44px;
  		background: #4679bd;
	}
  </style>
  <script>
  	var objBanner = null;
  	function showInfo()
  	{
  		if(!objBanner)
  		{
  			objBanner = document.createElement("ns-banner");
  		}
  		objBanner.showInfo("Your request has been successfully received.");
  	}
  	function showWarning()
  	{
  		if(!objBanner)
  		{
  			objBanner = document.createElement("ns-banner");
  		}
  		objBanner.showWarning("You must enter all required information.");
  	}
  	function showError()
  	{
  		if(!objBanner)
  		{
  			objBanner = document.createElement("ns-banner");
  		}
  		objBanner.showError("You have encountered a critical error.");
  	}
  	function loadCustom()
  	{
  		if(!objBanner)
  		{
  			objBanner = document.createElement("ns-banner");
  		}
  		objBanner.showCustom("templateCustom");
  	}
  </script>
  		<template id="templateCustom">
  			<div id="divCustomBanner" class="customBanner">
  				This is Custom Template Banner
  			</div>
  		</template>
        <p><b>Note:</b> Utility will work in IE7 and IE8 if a !DOCTYPE is specified(&lt;!DOCTYPE html&gt;) at the start of the Page(before &lt;html&gt; tag).</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
		<p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p><p>Some text</p>
</body>
</html>