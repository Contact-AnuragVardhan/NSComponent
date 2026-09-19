<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<link rel="icon" href="data:;base64,iVBORw0KGgo=">
<link href="/JSLib/lib/css/com/org/nsPagination.css" rel="stylesheet">
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<title>Pagination Demo</title>
<style>
/* because bootstarp.css overrides body margin to 0px   */
body
{
	margin:4px;
	padding:4px;
}
.example {
    position: relative;
    margin: 15px 0;
    padding: 39px 19px 14px;
    background-color: white;
    border: 1px solid #DDD;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.example::after {
    content: "Example";
    position: absolute;
    top: -1px;
    left: -1px;
    padding: 3px 7px;
    font-size: 12px;
    font-weight: bold;
    background-color: whiteSmoke;
    border: 1px solid #DDD;
    color: #9DA0A4;
    -webkit-border-radius: 4px 0 4px 0;
    -moz-border-radius: 4px 0 4px 0;
    border-radius: 4px 0 4px 0;
}

.display 
{
    min-height: 40px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f5f5f5;
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
    text-align: center;
}
</style>
</head>
<body onload="initialize()">
	
	<div>View 
		<select id="cmbPageSize" onchange="pageSizeChangeHandler()">
		  <option value="3">3</option>
		  <option value="5">5</option>
		  <option value="10">10</option>
		  <option value="25">25</option>
		  <option value="50">50</option>
		  <option value="100">100</option>
		</select>
		records.
	</div>
	<br/>
	<div>
		 <input id="txtPageNumber" type="number" min="0" max="100" step="1" value="1">
		 <button type="button" onclick="changePageNumber()">Change Page</button>
	</div>
	<br/>
	<br/>
	<div id="divBootstrapDemo"></div>
	<br/>
	<div id="divDemo"></div>
	<div class="example">
        <div id="divPage" class="display"></div>
        <div id="divPageControl"></div>
    </div>
    <div id="anchorUnderline">
		Underline Below
	</div>
	<button onclick="addUnderline()">Add Line</button>
	<script type="text/javascript" src="/JSLib/lib/com/org/util/nsUtil.js"></script>
	<script type="text/javascript" src="/JSLib/lib/com/org/util/nsPagination.js"></script>
	<script>
	function addUnderline()
	{
		var util = new NSUtil();
		var element = document.querySelector("#anchorUnderline");
		var setting = {lineWidth:100,lineHeight:4,lineColor:"blue"};
		util.addAnimatedLineOnHover(element,setting);
	}
	</script>
	<script type="text/javascript">
		var nsPagination = null; 
		var nsPagination1 = null; 
		function initialize()
		{
			var divParent = document.querySelector("#divPageControl");
			var setting = {
					parent:divParent,
					totalRecords : 30,
					pageSize : parseInt(document.querySelector("#cmbPageSize").value),
					containerStyle:"pagination",
					activeStyle:"active",
					disabledStyle:"disabled",
					textFirst:"Home",
					textLast:"Last",
					textPrev:"Prev",
					textNext:"Next",
					showFirstLast:true
			}
			nsPagination = new NSPagination(setting);
			nsPagination.util.addEvent(divParent,nsPagination.PAGE_CHANGE,pageChangeHandler);
			nsPagination.setSelectedPage(2);
			
			var divParent1 = document.querySelector("#divDemo");
			var setting = {
					parent:divParent1,
					totalRecords : 100,
					pageSize : parseInt(document.querySelector("#cmbPageSize").value)
			}
			nsPagination1 = new NSPagination(setting);
			nsPagination1.util.addEvent(divParent1,nsPagination1.PAGE_CHANGE,pageChangeHandler1);
		}
		
		function pageChangeHandler(event)
		{
			console.log("OldPage::" + event.oldIndex + ",NewPage::" + event.newIndex);
			document.querySelector("#divPage").innerHTML = "Page " + event.newIndex;
		}
		
		function pageChangeHandler1(event)
		{
			console.log("OldPage::" + event.oldIndex + ",NewPage::" + event.newIndex);
		}
		
		function pageSizeChangeHandler()
		{
			nsPagination.changePageSize(parseInt(document.querySelector("#cmbPageSize").value));
			nsPagination1.changePageSize(parseInt(document.querySelector("#cmbPageSize").value));
		}
		
		function changePageNumber()
		{
			nsPagination.selectPage(parseInt(document.querySelector("#txtPageNumber").value));
			nsPagination1.selectPage(parseInt(document.querySelector("#txtPageNumber").value));
		}
	</script>
</body>
</html>