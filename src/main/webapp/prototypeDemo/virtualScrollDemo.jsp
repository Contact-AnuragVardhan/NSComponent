<!DOCTYPE html>
<html lang="en">
<head>
  <title>Virtual Scroll Demo</title>
  <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
  <meta name="viewport" content="initial-scale=1.0,maximum-scale=1.0,height=device-height,width=device-width,user-scalable = no">
  
  <style>
  	body,html	
   {
		margin:0px;
		padding:0px;
		height:100%;
   }
   .container
   {
		max-width: 850px;
		height:40%;
		flex: 1 1 auto;
	  	padding-left: 5px;
	  	padding-top: 10px;
	  	margin-left:16px;
   }
   .container p
   {
   		margin: 0px;
   		margin-bottom: 5px;
   }
   .container h3
   {
   		margin: 0px;
   		margin-bottom: 5px;
   		display: inline-block;
   }
  	.tableCon
  	{
  		max-height: 200px;
  		overflow: auto;
  		width:100%;
	}
	.tbl td
	{
		text-align: center;
	}
	.listCon
  	{
  		width:200px;
  		max-height: 200px;
  		overflow: auto;
  		margin-bottom: 16px;
	}
	.lst
	{
		list-style: none;
		margin-top:0px;
	}
	.listCon li
	{
		
	}
	/*.listConHor
  	{
  		height:70px;
  		max-width: 200px;
  		overflow: auto;
	}
	.lstHor
	{
		list-style: none;
		margin-left:0px;
		display: flex;
		flex-direction:row;
		flex-wrap: nowrap;
	}
	.lstHor li
	{
		display: inline-block;
		list-style-type: none;
		margin-right: 16px;
	}*/
	
	.listConHor .horCon {
  height: 200px;
    width: 200px;
    border: 1px solid black;
}

.listConHor .wrapper {
  display: flex;
  flex-direction: row;
  min-height: 100%;
}

.listConHor .item {
  width: 50px;
  writing-mode: vertical-lr;
}
	
  </style>
  
  <link href="/JSLib/lib/css/com/org/nsVirtualScroll.css" rel="stylesheet">
</head>
<body onload="init()">

<div class="container">
  <p><h3>Table Example</h3>(all select to test heavy UI Elements)</p>
  <div id="divTableCon" class="tableCon">
    <table class="tbl">
      <tbody id="tblBody">
      </tbody>
    </table>
  </div>
</div>
<div class="container">
  <p><h3>Vertical List Example</h3></p>
  <div id="divListCon" class="listCon">
    <ul id="lst" class="lst">
    </ul>
  </div>
  <div style="margin-bottom:16px;">
  	  <input type="number" id="txtScrollTo" min="10" max="100" placeholder="Scroll To" required />
	  <input type="button" value="Scroll To" onclick="scrollToIndex();"/>
  </div>
  <div>
  	<input id="txtFilter" type="text" placeholder="Filter" onkeyup="filterKeyUpHandler(event);">
  </div>
</div>

<div class="container">
  <p><h3>Horizontal List Example</h3></p>
  <div class="listConHor">
  	<div id="divHorListCon" class="horCon">
  		<div id="lstHor" class="wrapper" >
  		</div>
  	</div>
  </div>
  
  <!--  <div id="divHorListCon" class="listConHor">
    <ul id="lstHor" class="lstHor">
    </ul>
  </div>
</div>-->

 <script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
 <script src="/JSLib/lib/com/org/util/nsVirtualScroll.js"></script>

<script>
var objTableVirtualScroll = null;
var objListVirtualScroll = null;
var objHorListVirtualScroll = null;
var arrListItems = [];
var arrHorListItems = [];
var timeOutID = null;
function init()
{
	initTable();
	initList();
	initHorList();
}

function initTable()
{
	var arrItems = getSource(1000,10);
	var setting = {scrollElement: "divTableCon",contentElement: "tblBody",items: arrItems,pageSize: 10,pagesRendered: 2};
	objTableVirtualScroll = new NSVirtualScroll(setting);
}

function initList()
{
	var lst = document.getElementById("lst");
	arrListItems = [];
	for (var count = 1;count < 10000;count++) 
	{
		var li = document.createElement("li");
		li.innerHTML = "<b>" + count +"</b>::" + getRandomString(5);
		arrListItems.push(li);
	}
	//lst.innerHTML = arrItems.join("");
	var setting = {scrollElement: "divListCon",contentElement: lst,items: arrListItems};
	objListVirtualScroll = new NSVirtualScroll(setting);
}

function initHorList()
{
	/*var lstHor = document.getElementById("lstHor");
	arrHorListItems = [];
	for (var count = 1;count < 10000;count++) 
	{
		var li = document.createElement("li");
		li.innerHTML = "<b>" + count +"</b>::" + getRandomString(5);
		arrHorListItems.push(li);
	}
	var setting = {direction: NSVirtualScroll.DIRECTION_HORIZONTAL,scrollElement: "divHorListCon",contentElement: lstHor,items: arrHorListItems};
	objHorListVirtualScroll = new NSVirtualScroll(setting);*/
	
	var lstHor = document.getElementById("lstHor");
	arrHorListItems = [];
	for (var count = 1;count < 10000;count++) 
	{
		var div = document.createElement("div");
		div.setAttribute("class","item");
		div.innerHTML = "Item #" + count;
		arrHorListItems.push(div);
	}
	var setting = {direction: NSVirtualScroll.DIRECTION_HORIZONTAL,scrollElement: "divHorListCon",contentElement: lstHor,items: arrHorListItems};
	objHorListVirtualScroll = new NSVirtualScroll(setting);
}

function scrollToIndex()
{
	if(objListVirtualScroll)
	{
		var txtScrollTo = document.getElementById("txtScrollTo");
		if(txtScrollTo.value.trim().length > 0)
		{
			objListVirtualScroll.scrollToIndex(txtScrollTo.value,true);	
		}
		else
		{
			alert("Please enter a Scroll To Index");
		}
	}
}

function filterKeyUpHandler(event)
{
	if(objListVirtualScroll)
	{
		 var txtFilter = document.getElementById("txtFilter");
		 if(timeOutID) 
		 {
		  	clearTimeout(timeOutID);
		 }
		 timeOutID = setTimeout(function() 
	     {
			var arrFilter = []; 
			var value = txtFilter.value.toUpperCase();
			if(value == "")
			{
				arrFilter = arrListItems;
			}
			else
			{
				for(var count = 0;count < arrListItems.length;count++) 
		        {
		        	var li = arrListItems[count];
		          	var index = li.textContent.toUpperCase().indexOf(value);
		          	if(index > -1)
		          	{
		          		arrFilter.push(li);
		          	}
		        }
			}
	        
	        objListVirtualScroll.dataSource(arrFilter);
	     }, 500);
	}
}

function getRandomString(length) 
{
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for(var i = 0; i < length; i++) 
	{
	 	result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function getSource(rowTotal,colTotal)
{
	var arrItems = [];
	var select = '<select id="mySelect">' +
				    '<option>Apple</option>' +
				    '<option>Orange</option>' +
				    '<option>Pineapple</option>' +
				    '<option>Banana</option>' +
				  '</select>';
	for (var rowCount = 1;rowCount < rowTotal;rowCount++) 
	{
		var html = '<td><b>' + rowCount +'</b></td>';
		for (var colCount = 1;colCount < colTotal;colCount++) 
		{
			html += '<td>' + select +'</td>';
		}
		arrItems.push('<tr>' + html + '</tr>');
	}
	return arrItems;
}


</script>

</body>
</html>