<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="Cache-Control" Content="no-cache">
	<meta http-equiv="Pragma" Content="no-cache">
	<meta http-equiv="Expires" Content="0">
	<title>Progress Bar Demo</title>
	<script src="../lib/com/org/util/nsImport.js"></script>
</head>
<body onload="createProgressBar()">
	<nsimport file="nsProgressBar.js">
	<script>
		var progressBar = null;
		var progressTimer = null;
		var count = 0;
		var totalCount=38;
		
		function createProgressBar()
		{
			progressBar = document.createElement("ns-progressbar");
			showProgressBar();
		}
		
		function showProgressBar()
		{
			progressBar.show("templateDemo","ProgressBar Demo",true,true);
			progressTimer=setInterval(function(){loadProgress();},1000);
			progressBar.addEventListener("CLOSE", closeHandler);
		}
		
		function loadProgress()
		{	
			count++;
			if(count > totalCount)
			{
				count = 0;
			}
			progressBar.progressBarCallBack(count,totalCount);
		}

		function closeHandler()
		{
			alert("Loader Closed");
		}
	</script>
	<template id="templateDemo">
		<div style="width:100%;margin:auto;text-align:center;font-weight:bold;">
			Please wait for the file to get Downloaded
		</div>
	</template>
	<a onclick="showProgressBar();">Click here to open the overlay</a>
</body>
</html>
