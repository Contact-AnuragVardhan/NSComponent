<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>List Demo</title>
<!-- <script src="http://cdnjs.cloudflare.com/ajax/libs/document-register-element/0.4.5/document-register-element.js"></script> -->
<script src="../lib/com/org/util/nsImport.js"></script>

<style>
   /*label {
  display: block;
  padding: 5px 5px 5px;	
  
  background-color: #2175bc;
  color: #fff;
  text-decoration: none;
  } 
  label:hover {
  border-left: 10px solid #1c64d1;
  border-right: 10px solid #5ba3e0;
  background-color: #2586d7;
  color: #fff;
  }*/
  
  	.hbox 
	{
	  overflow-x:auto;
	  text-align: center;
	}
	.hbox > * 
	{
	   display: inline-block;
	   vertical-align: middle;
	}
	.header 
	{
		position: relative;
	    font-weight: bold;
	    background: #808080;
	    color: white;
	    text-transform: uppercase;
	    padding-left: 10px;
	}
	.header > * 
	{
  	  position: absolute;
  	  top: 0; left: 0; bottom: 0; right: 0;
	}
	
	#lstDemo:focus
	{
		outline:solid 1px green;
	}
	
	ul:focus 
	{
    	outline:solid 1px green;
	}
	
	.handle 
	{
	  cursor: move;
	  position: absolute;
	  top: 0px;
	}
	
	.other 
	{
 	 margin-left: 20px;
	}
	.rightList 
	{
    	float: left;
    	margin-left: 10px;
    }
  
</style>

</head>
<body onload="loadHandler();" style="overflow:hidden;">
	<template id="templateDemo">
			<div accessor-name="rendererBody" class="hbox">
				<input type="checkbox" accessor-name="chk"  >
				<label accessor-name="label1"></label>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<label accessor-name="label2"></label>
			</div>
	</template>
 	<nsimport file="nsList.js">
 	</nsimport>
	<input id="txtFilter" class="nsFilter nsSearchInlineTextBox" type="text" placeholder="Filter" 
	 	    style="width: 279px;" onkeyup="filterKeyUpHandler(event);">
	<div id="divContainer" style="width:100%;">
		<ns-List id="lstDemo" style="height:300px;width:300px;float:left;">
		</ns-List>
<!-- 		<div is="ns-List" id="lstDemo1" style="height:300px;width:300px;"> -->
<!-- 		</div> -->
<!-- 		<ns-List id="lstDemo1" style="height:300px;width:300px;"> -->
<!-- 		</ns-List> -->
	</div>
	
	<div id="navWrapper">
        
    </div>
	<br/>
	<form>
	  <input type="text" id="txtSelectedIndex" placeholder="Enter Selected Index" required><br>
	  <input type="button" name="Submit" value="Submit" onclick="return setSelectedIndex();"/>
	</form>
	<script>	
				var dataSource = [];
				document.getElementById('txtSelectedIndex').onkeydown = function(e) 
				{
				    /*var key = e.keyCode ? e.keyCode : e.which;
				    if ( isNaN( String.fromCharCode(key) ) ) return false;*/
				}
				
				function loadHandler()
				{
					//setChildren();
						
					dataSource = [];
					dataSource1 = [];
					for (var count = 0 ;count < 400; count++)
					{
						var item = {id:count, hierarchy:"Hierarchy " + count,isChecked:true};
						if((count % 10) === 0)
						{
							item["stopOver"] = true;
						}
						dataSource.push(item);
					}
					for (var count = 0 ;count < 2; count++)
					{
						var item1 = {id:count, hierarchy:"Hierarchy " + count,isChecked:true};
						if((count % 10) === 0)
						{
							item1["stopOver"] = true;
						}
						dataSource1.push(item1);
					}
					ns.onload(function(){
						var lstDemo1 = document.createElement("ns-List");
						lstDemo1.setAttribute("id","lstDemo1");
						lstDemo1.style.height = "300px";
						lstDemo1.style.width = "300px";
						lstDemo1.util.addStyleClass(lstDemo1,"rightList");
						document.getElementById("divContainer").appendChild(lstDemo1);
						
						var lstDemo = document.getElementById("lstDemo");
						var setting = {labelField:"hierarchy",enableVirtualScroll:true,enableDragDrop:true,enableDragByHandle:true,dragHandlerClass:"handle",
									   enableMultipleSelection:true,enableKeyboardNavigation:true,customScrollerRequired:false,
									   enableMouseHover:true,enableMouseHoverAnimation:true,disableHoverField:"stopOver",itemRenderer:itemRenderer,disableDraggableFunction:disableDraggableFunction,
							 		   disableDropableFunction:disableDropableFunction};//, template:"templateDemo",setData:"setData"
						setting["dataSource"] = dataSource;
						lstDemo.setSetting(setting);
						lstDemo.util.addEvent(lstDemo,lstDemo.ITEM_SELECTED,itemSelectHandler);
						lstDemo.util.addEvent(lstDemo,lstDemo.ITEM_UNSELECTED,itemUnSelectHandler);
						lstDemo.util.addEvent(lstDemo,lstDemo.ITEM_DROPPING,itemDroppingHandler);
						lstDemo.util.addEvent(lstDemo,lstDemo.ITEM_DROPPED,itemDroppedHandler);
						lstDemo.util.addEvent(lstDemo,lstDemo.DRAG_STARTED,dragStartHandler);
						lstDemo.util.addEvent(lstDemo,lstDemo.DRAG_END,dragEndHandler);
						//var lstDemo1 = document.getElementById("lstDemo1");
						var setting1 = {labelField:"hierarchy",enableVirtualScroll:false,enableDragDrop:true,enableMultipleSelection:true,enableKeyboardNavigation:true,customScrollerRequired:false,
						 		   disableHoverField:"stopOver",itemRenderer:itemRenderer};//, template:"templateDemo",setData:"setData"
						setting1["dataSource"] = dataSource1;
						lstDemo1.setSetting(setting1);
						lstDemo.util.addEvent(lstDemo1,lstDemo1.ITEM_DROPPING,item1DroppingHandler);
					});	
				}
				
				function itemRenderer(item,labelField,fieldIndex,isDisabled,listItem)
				{
					var htmlText = "";
					if(item)
					{
						if(isDisabled)
						{
							htmlText = "<div class='header'>";
						}
						else
						{
							htmlText = "<div class='hbox'>";
							htmlText += "<span class='handle'>:::</span>";
							htmlText += "<span class='other'>";
							htmlText += "<input id='" + ("chk" + fieldIndex) + "' type='checkbox' onchange='checkBox_changeHandler(event)' checked='" + item["isChecked"] + "'>";
							htmlText += "<label>" + item["id"] + "</label>";
							htmlText += "</span>";
						}
						htmlText += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
						htmlText += "<label>" + item[labelField] + "</label>";
						htmlText += "</div>";
					}
					return htmlText;
				}
				
				function setData(renderer,item,labelField,isDisabled,listItem)
				{
					if(renderer)
					{
						var lstDemo = document.getElementById("lstDemo"); 
						if(item && item[labelField])
						{
							if(isDisabled)
							{
								renderer.rendererBody.chk.style.display = "none";
								renderer.rendererBody.label1.style.display = "none";
								renderer.rendererBody.label1.innerHTML = "";
								lstDemo.util.removeStyleClass(renderer.rendererBody,"hbox");
								lstDemo.util.addStyleClass(renderer.rendererBody,"header");
							}
							else
							{
								renderer.rendererBody.chk.onchange = checkBox_changeHandler;
								renderer.rendererBody.chk.style.display = "inline";
								renderer.rendererBody.chk.checked = item["isChecked"];
								renderer.rendererBody.label1.display = "inline";
								renderer.rendererBody.label1.innerHTML = item["id"];
								lstDemo.util.removeStyleClass(renderer.rendererBody,"header");
								lstDemo.util.addStyleClass(renderer.rendererBody,"hbox");
							}
							renderer.rendererBody.label2.innerHTML = item[labelField];
							//renderer.rendererBody.rendererLabel.appendChild(document.createTextNode(item[labelField]));
						}
						else
						{
							clearData(renderer);
						}
					}
				}
				
				function clearData(renderer)
				{
					if(renderer)
					{
						var lstDemo = document.getElementById("lstDemo"); 
						renderer.rendererBody.chk.style.display = "none";
						renderer.rendererBody.label1.style.display = "none";
						renderer.rendererBody.label1.innerHTML = "";
						renderer.rendererBody.label2.innerHTML = "";
						lstDemo.util.removeStyleClass(renderer.rendererBody,"header");
						lstDemo.util.addStyleClass(renderer.rendererBody,"hbox");
					}
				}
				
				function disableDraggableFunction(item,labelField,fieldIndex,isDisabled,listItem)
				{
					return isDisabled;
				}
				
				function disableDropableFunction(item,labelField,fieldIndex,isDisabled,listItem)
				{
					return isDisabled;
				}
				
				function checkBox_changeHandler(event) 
				{					
					var checked = event.target.checked ? "checked":"unchecked";
				    alert(event.target.data["id"] + " is " + checked);
				}
		
				
				function filterKeyUpHandler(event)
				{
					var lstDemo = document.getElementById("lstDemo"); 
					var txtFilter = document.getElementById("txtFilter"); 
					var text = txtFilter.value;
					if(text === "")
					{
						lstDemo.resetFilter();
					}
					else
					{
						lstDemo.filter(text);
					}
				}
				function setSelectedIndex()
				{
					var txtSelectedIndex = document.getElementById('txtSelectedIndex'); 
					var lstDemo = document.getElementById('lstDemo'); 
					lstDemo.setSelectedIndex(txtSelectedIndex.value,true);
					return false;
				}
				
				function itemSelectHandler(event)
				{
					//console.log("Item Selected with details::" + event.detail + " with indexes " + event.target.getSelectedIndexes().toString());
					console.log(event.target.getSelectedItems());
				}
				
				function itemUnSelectHandler(event)
				{
					console.log("Item Unselected with details::" + event.detail  + " with index " + event.index);
				}
				
				function itemDroppingHandler(event)
				{
					var arrItems = event.detail;
					if(event.cancelable)
					{
						//event.preventDefault();
					}
				}
				
				function itemDroppedHandler(event)
				{
					var arrItems = event.detail;
					console.log(arrItems);
				}
				
				function dragStartHandler(event)
				{
					var arrItems = event.detail;
					console.log(arrItems + " dragging");
				}
				
				function dragEndHandler(event)
				{
					var target = event.target;
					var arrItems = event.detail;
					console.log(arrItems + " dragged" + event.target);
					var lstDemo = document.getElementById("lstDemo");
					if(target && target !== lstDemo)
					{
						lstDemo.removeItems(arrItems);	
					}
				}
				
				function item1DroppingHandler(event)
				{
					var arrItems = event.detail;
					if(event.cancelable && arrItems && arrItems.length > 0 && arrItems[0]["ns_field_disableHover"])
					{
						event.preventDefault();
					}
				}

	</script>
	
	<script>
	    function initialize()
		{
			setChildren();
		}
		var lstDemo = null;
		function setChildren()
		{
			var itemRenderer = getTemplate("templateDemo");
			var navWrapper = document.createElement("div");
			document.getElementsByTagName('body')[0].appendChild(navWrapper);
			lstDemo = document.createElement("ul");
			navWrapper.appendChild(lstDemo);
			for(var count = 0; count < 10; count++) 
			{
				var listItem = document.createElement("li");
				listItem.appendChild(itemRenderer.cloneNode(true));
				lstDemo.appendChild(listItem);
				setRendererProperties(listItem);
			}
		}
		
		function setRendererProperties(listItem)
		{
			if(listItem)
			{
				var compChild = null;
				for(var count = 0; count < listItem.children.length; count++) 
				{
					compChild = listItem.children[count];
					Array.prototype.slice.call(compChild.attributes).forEach(function(attribute) 
					{
						if(isFunction(attribute.value))
						{
							 var item = {id:1};
							var newValue = attribute.value + "(this)";
							compChild.removeAttribute(attribute.name);
							compChild.setAttribute(attribute.name,newValue);
							compChild.data = item;
						}
					});
					if(compChild)
					{
						if(compChild.hasAttribute("accessor-name"))
						{
							listItem[compChild.getAttribute("accessor-name")] = compChild;
						}
					}
					setRendererProperties(compChild);
				}
			}
		}
		
		function getTemplate(templateID) 
		 {
			 var templateClone = null;
			 if(templateID)
			 {
				 var template = document.getElementById(templateID);
				 if(template)
				 {
					templateClone = template.content.children[0]; //document.importNode(template.content, true); 
				 }
			 }
			 return templateClone;
		 }
		 
		 function isFunction(refFunction) 
		{
			if(refFunction && ((typeof refFunction == "function") || (typeof window[refFunction] === "function")))
			{
				return true;
			}
			return false;
		};
	</script>
	
</body>
</html>