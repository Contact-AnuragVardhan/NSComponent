<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Drag Drop Demo</title>
<script src="../lib/com/org/util/nsImport.js"></script>
<style>
	html,body {
    	height: 100%;
	}
	.list {
		width:12em;
		list-style: none;
		margin: 0;
		padding: 0;
		border: none;
		}
		
	.list li {
		border-bottom: 1px solid #90bade;
		margin: 0;
		list-style: none;
		list-style-image: none;
		background-color: #D8E9FF;
    	color: #2F4D99;
		text-decoration: none;
		}
		
	.list li:hover {
		background-color: #2586d7;
		color: #fff;
		}
	
	.list li a {
		margin-left: 20px;
		display: block;
		padding: 5px 5px 5px 0.5em;
		width: 80%;
		}
	.list li .handle {
	    cursor: move;
	    float:left;
	    vertical-align:middle;
	}
		
		
</style>

<style>

td, th {
  width: 4rem;
  height: 2rem;
  border: 1px solid #ccc;
  text-align: center;
}
th {
  background: lightblue;
  border-color: white;
}
	

/* drag object (DIV inside table cell) */
.drag {
	margin: auto;
	margin-bottom: 1px;
	margin-top: 1px;
	text-align: center;
	font-size: 10pt;
	width: 70px;
	height: 20px;
	line-height: 20px;
	border-width: 2px;
	border-style: solid;
	background-color: white;
	/* round corners */
	border-radius: 4px; /* Opera, Chrome */
	-moz-border-radius: 4px; /* FF */
}

/* DIV row handlers (blue left column) */
.row {
	width: 20px;
	margin: 2px;
	border-color: SteelBlue;
	background-color: SteelBlue;
	/* round corners */
	border-radius: 14px; /* Opera, Chrome */
	-moz-border-radius: 14px; /* FF */
}

/* row handler TD background color */
.rowhandler {
	background-color: #76ACDA;
}

/* marked cells (forbidden access for header and message line) */
.mark {
	color: white;
	background-color: #aaa;
	text-align: center;
}

</style>
</head>
<body onload="loadHandler();">
<nsimport file="nsDragDrop.js">
</nsimport>
<ul id="lstDemo" class="list">
<!-- 	 <li><div class="handle">:::</div><a href="#">Home</a></li> -->
<!-- 	 <li><div class="handle">:::</div><a href="#">Hidden Cameras</a></li> -->
<!-- 	 <li><div class="handle">:::</div><a href="#">CCTV Cameras</a></li> -->
<!-- 	 <li><div class="handle">:::</div><a href="#">Employee Theft</a></li> -->
<!-- 	 <li><div class="handle">:::</div><a href="#">Helpful Hints</a></li> -->
<!-- 	 <li><div class="handle">:::</div><a href="#">F.A.Q</a></li> -->
<!-- 	 <li><div class="handle">:::</div><a href="#">About Us</a></li> -->
<!-- 	 <li><div class="handle">:::</div><a href="#">Contact Us</a></li> -->
</ul>
<br/>
<br/>
<ul id="lstDemo1" class="list">
	 <li><a href="#">Home</a></li>
</ul>
<center>
	<!-- tables inside this DIV could contain drag-able content  -->
	<div id="drag">
		<table id="tbl1">
		  <tr data-nondroppable>
				<td colspan="6" class="mark"><span>TBL 1</span></td>
		 </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>1</th>
		    <th>2</th>
		    <th>3</th>
		    <th>4</th>
		    <th>5</th>
		  </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>2</th>
		    <td>4</td>
		    <td>6</td>
		    <td>8</td>
		    <td>10</td>
		  </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>3</th>
		    <td>6</td>
		    <td>9</td>
		    <td>12</td>
		    <td>15</td>
		  </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>4</th>
		    <td>8</td>
		    <td>12</td>
		    <td>16</td>
		    <td>20</td>
		  </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>5</th>
		    <td>10</td>
		    <td>15</td>
		    <td>20</td>
		    <td>25</td>
		  </tr>
		</table>
		<br/>
		<br/>
		<table id="tbl2">
		  <tr data-nondroppable>
				<td colspan="6" class="mark"><span>TBL 2</span></td>
		 </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>1</th>
		    <th>2</th>
		    <th>3</th>
		    <th>4</th>
		    <th>5</th>
		  </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>2</th>
		    <td>4</td>
		    <td>6</td>
		    <td>8</td>
		    <td>10</td>
		  </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>3</th>
		    <td>6</td>
		    <td>9</td>
		    <td>12</td>
		    <td>15</td>
		  </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>4</th>
		    <td>8</td>
		    <td>12</td>
		    <td>16</td>
		    <td>20</td>
		  </tr>
		  <tr>
		  	<td class="rowhandler"><div class="drag row"></div></td>
		    <th>5</th>
		    <td>10</td>
		    <td>15</td>
		    <td>20</td>
		    <td>25</td>
		  </tr>
		</table>
	</div>
</center>

<script>
function loadHandler()
{
	var lstDemo = document.querySelector("#lstDemo");
	for (var i=0; i< 100; i++)
	{
	    var li = document.createElement('li');
	    lstDemo.appendChild(li);
	    li.innerHTML="<div class='handle'>:::</div><a href='#'> " + ("List Item" + i) + "</a>";
	}
	var lstDemo1 = document.querySelector("#lstDemo1");
	var tbl1 = document.querySelector("#tbl1");
	var tbl2 = document.querySelector("#tbl2");
	ns.onload(function()
	{
		var setting = {container:lstDemo,childNodeType:"LI",enableDragByHandle:false,dragHandlerClass:"handle",enableCloneMode:false,enableDragAfterHold:false,holdTime:500};
		var nsDragDrop = new NSDragDrop(setting);
		
		var setting1 = {container:lstDemo1,childNodeType:"LI",enableCloneMode:false};
		var nsDragDrop1 = new NSDragDrop(setting1);
		
		var setting2 = {container:tbl1,childNodeType:"TR",enableDragByHandle:true,dragHandlerClass:"rowhandler",enableCloneMode:true,enableDragAfterHold:false,
						nodeDroppableCallback:itemDroppableHandler};//insertNodeCallback:insertTableNode,moveNodeCallback:moveTableNode,removeNodeCallback:removeTableNode
		var nsDragDrop2 = new NSDragDrop(setting2);
		//nsDragDrop2.util.addEvent(tbl1,nsDragDrop2.DRAGGING,itemDroppableHandler);
		
		var setting3 = {container:tbl2,childNodeType:"TR",enableDragByHandle:true,dragHandlerClass:"rowhandler",enableCloneMode:true,enableDragAfterHold:false,
						insertNodeCallback:insertTableNode,moveNodeCallback:moveTableNode,removeNodeCallback:removeTableNode,nodeDroppableCallback:itemDroppableHandler};
		var nsDragDrop3 = new NSDragDrop(setting3);
		//nsDragDrop3.util.addEvent(tbl2,nsDragDrop3.DRAGGING,itemDroppableHandler);

	});
}

function itemDroppableHandler(row)
{
	if(row.hasAttribute("data-nondroppable"))
	{
		return false;
	}
	return true;
}

function insertTableNode(table,moveRow,atIndex,currentRow)
{
	currentRow.parentNode.insertBefore(moveRow,currentRow);
}

function moveTableNode(table,moveRow,atIndex,currentRow)
{
	currentRow.parentNode.insertBefore(moveRow,currentRow);
}

function removeTableNode(table,removeRow)
{
	removeRow.parentNode.removeChild(removeRow);
}

</script>
</body>
</html>