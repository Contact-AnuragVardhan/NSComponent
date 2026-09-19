<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<script src="../lib/com/org/util/nsUtil.js"></script>
<title>Util Demo</title>
</head>
<body onload="initialize()">
  <template id="tempReplaceHTMLDemo">
	<div>
	    Google link
	    <a href="http://google.com/#q={{userName}}" target="_blank"><b>{{userName}}</b></a>
	     is for person with name <b>{{fullName}}</b>
	</div>
  </template>
  <div id="divTempReplaceHTMLDemo">
  	<h3>Below is Demo for template binding:</h3>
  </div>
  <script>
  	var util = null;
  	function initialize()
  	{
  		util = new NSUtil();
  		templateReplaceDemo();
  	}
  	
  	function templateReplaceDemo()
  	{
  		var data = [{userName:"jsmith",fullName:"John Smith"},
  		          {userName:"wsmith",fullName:"Will Smith"},
  		      	  {userName:"sbond",fullName:"Shane Bond"},
  		    	  {userName:"sjerry",fullName:"Sharmick Jerry"}];
  		var divTempReplaceHTMLDemo = document.querySelector("#divTempReplaceHTMLDemo");
  		var setting = {startSeparatorTag:"{{",endSeparatorTag:"}}"};
  		var replaceHTMLFromObject = new util.replaceHTMLFromObject(setting);
  		replaceHTMLFromObject.replace("tempReplaceHTMLDemo",data,"divTempReplaceHTMLDemo",false);
  		
  	}
  </script>
</body>
</html>