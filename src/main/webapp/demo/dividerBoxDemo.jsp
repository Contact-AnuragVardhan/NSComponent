<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<script src="../lib/com/org/util/nsImport.js"></script>
<title>Insert title here</title>
 <style>
 	body,html
	{
		margin:0px;
		padding:0px;
		height:100%;
		background:#FFFFFF;
	}
	.ui-resizable-e {
	    cursor: ew-resize;
	    width: 20px;
	    right: -5px;
	    top: 0;
	    height: 100%;
	}
	.ui-resizable-handle {
	    position: absolute;
	    font-size: 0.1px;
	    z-index: 99999;
	    display: block;
	}
	
 </style>
</head>
<body>
	<nsimport file="nsDividerBox.js">
	</nsimport>
	
	 <ns-dividerBox direction="vertical" style="height:100%;width:100%" class="verticalContainer">
	 	<div style="width:10%;overflow-y:scroll;">
	 		<div id="top-vertical-content" style="width:1500px;">
				This is Left
			</div>
	 	</div>
		<div id="top-vertical-content3" style="width:90%;">
			This is Right
		</div>
	</ns-dividerBox>
</body>
</html>