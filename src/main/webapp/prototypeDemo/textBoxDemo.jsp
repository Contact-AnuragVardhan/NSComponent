<!-- https://github.com/darylrowland/angucomplete -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>NS TextBox Demo</title>

 <meta name='viewport' content='width=device-width,initial-scale=1'>
 
 <link href="/JSLib/lib/css/com/org/nsComponent.css" rel="stylesheet">
 <link href="/JSLib/lib/css/com/org/nsList.css" rel="stylesheet">
 <link href="/JSLib/lib/css/com/org/nsTextBox.css" rel="stylesheet">
 
<link href="/JSLib/lib/css/com/org/nsGrid.css" rel="stylesheet" type="text/css" />
 
 <script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
 <script src="/JSLib/lib/com/org/util/nsVirtualScroll.js"></script>
 <script src="/JSLib/lib/com/org/prototype/base/nsContainerBase.js"></script>
  <script src="/JSLib/lib/com/org/util/nsFilter.js"></script>
 <script src="/JSLib/lib/com/org/prototype/nsList.js"></script>
 <script src="/JSLib/lib/com/org/prototype/nsTextBox.js"></script>
 
<script src="/JSLib/lib/com/org/util/nsPluggins.js"></script>
<script src="/JSLib/lib/com/org/util/nsSVG.js"></script>
<script src="/JSLib/lib/com/org/util/nsFlatGrid.js"></script>
<script src="/JSLib/lib/com/org/util/nsGroupingGrid.js"></script>
<script src="/JSLib/lib/com/org/util/nsHierarchicalGrid.js"></script>
<script src="/JSLib/lib/com/org/util/nsGridPluggins.js"></script>
<script src="/JSLib/lib/com/org/prototype/nsGrid.js"></script>
<script src="/JSLib/lib/com/org/util/nsPromise.js"></script>
<script src="/JSLib/lib/com/org/util/nsAjax.js"></script>
 
 <style>
 	
 </style>
 <style>
  	.hbox 
	{
	  overflow-x:hidden;
	  overflow-y:hidden;
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
	
</style>
</head>
<body onload="loadHandler();">
	<template id="templateDemo">
			<div accessor-name="rendererBody" class="hbox" style="height:20px;">
				<label accessor-name="label1"></label>
				<label accessor-name="label2"></label>
			</div>
	</template>
	<section>
	  <h1>Autocomplete With List</h1>
	  <label>
	  	<span class="labelSpan">Single Selection:</span>
	  	<div id="divSingleSelection" style="display:inline-block;"></div>
	  </label> 
	  <br/>
	  <label>
	  	<span class="labelSpan">Server Side Selection:</span>
	  	<div id="divSingleServerSideSelection" style="display:inline-block;"></div>
	  </label> 
	  <br/>
	  <label>
	  	<span class="labelSpan">Multi Selection:</span>
	  	<div id="divMultiSelection" style="display:inline-block;width:400px;"></div>
	  </label>
	</section>
	<section>
	  <h1>Autocomplete With Grid</h1>
	  <label>
	  	<span class="labelSpan">Single Selection:</span>
	  	<div id="divSingleSelectionGrid" style="display:inline-block;"></div>
	  </label> 
	  <br/>
	  <label>
	  	<span class="labelSpan">Server Side Selection:</span>
	  	<div id="divSingleServerSideSelectionGrid" style="display:inline-block;"></div>
	  </label> 
	  <br/>
	  <label>
	  	<span class="labelSpan">Server Side Selection With Smart Filtering:</span>
	  	<div id="divSingleServerSideSmartGrid" style="display:inline-block;"></div>
	  </label> 
	</section>
	<section>
	  <h1>Regex Supportive</h1>
	  <div id="divRegex" style="display: inline-block;"></div> 
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  <div id="divRegexChar" style="display: inline-block;width: 200px;"></div> 
	</section>
	<section>
	  <h1>Min Character and Max Charater Support</h1>
	  <span>
	  	<form action="">
			<div id="divMinMaxCharacter" style="display: inline-block;width: 200px;"></div>
			<input type="submit" value="Submit" >
		</form>
		<label>
			<span class="labelSpan">Min Chacater:</span>
			<input id="txtMinCharacter" type="number" step="1" value="3">
		</label>
		<label>
			<span class="labelSpan">Max Chacater:</span>
			<input id="txtMaxCharacter" type="number" step="1" value="10">
		</label>
		<button id="btnMinMaxCharacter" onclick="applyMinMaxCharacter();">Apply</button>
	  </span>
	</section>
	<section>
	  <h1>Password</h1>
	  <div id="divPassword" style="width: 200px;"></div> 
	</section>
	
	
	<script>
	var nsTextBoxRegex = null;
	var nsTextBoxCharRegex = null;
	var nsTextBoxMinMaxCharacter = null;
	var nsTextBoxPassword = null;
	var nsTextBoxSingleSelection = null;
	var nsTextBoxServerSideSingleSelection = null;
	var nsTextBoxMultiSelection = null;
	var nsTextBoxSingleSelectionGrid = null;
	var nsTextBoxSeverSelectionGrid = null;
	var nsTextBoxSeverSmartSelectionGrid = null;
	
	var baseAPIUrl = "https://restcountries.com/v3.1/name/";
	var labelField = "countryName";
	function loadHandler()
	{
		var divRegex = document.getElementById("divRegex");
		var settingRegex = {placeholder:"Please Enter Numbers Only",type:"text",styleClass:"nsTextBox",restrict:"^[0-9]+$"};	
		nsTextBoxRegex = new NSTextBox(divRegex,settingRegex);
		
		var divRegexChar = document.getElementById("divRegexChar");
		var settingCharRegex = {placeholder:"Please Enter Characters Only",type:"text",styleClass:"nsTextBox",restrict:"^[a-zA-Z]+$"};	
		nsTextBoxCharRegex = new NSTextBox(divRegexChar,settingCharRegex);
		
		var divMinMaxCharacter = document.getElementById("divMinMaxCharacter");
		var settingMinMaxCharacter = {placeholder:"Please Enter Character",type:"text",styleClass:"nsTextBox",minChars:3,maxChars:10,required:true,showCustomValidation:true};	
		nsTextBoxMinMaxCharacter = new NSTextBox(divMinMaxCharacter,settingMinMaxCharacter);
		
		var divPassword = document.getElementById("divPassword");
		var settingPassword = {placeholder:"Password",styleClass:"nsTextBox",displayAsPassword:true};	
		nsTextBoxPassword = new NSTextBox(divPassword,settingPassword);
		
		var divSingleSelection = document.getElementById("divSingleSelection");
		var dropDownSetting = {enableVirtualScroll:true,customScrollerRequired:false,enableMouseHoverAnimation:true};
		var filterSetting = {caseSensitive:false,multiline:false,matchType:new NSFilter().STARTS_WITH};
		var settingAutoComplete = {placeholder:"Search Countries",type:"autocomplete",listWidth:300,required:true,labelField:"name",minSearchStartChars:1,
									enableMultipleSelection:false,enableKeyboardNavigation:true,showCustomValidation:false,splitSearchType:";",
									stopHoveringField:"stopOver",dropDownSetting:dropDownSetting,filterSetting:filterSetting,enableHighlighting:true,
									dataSource:countries,textBoxRendererCallback:textBoxRendererSingleSelectionCallback};
		nsTextBoxSingleSelection = new NSTextBox(divSingleSelection,settingAutoComplete);
		divSingleSelection.addEventListener(NSTextBox.ITEM_SELECTED,selectionHandler);
		divSingleSelection.addEventListener(NSTextBox.ITEM_UNSELECTED,unSelectionHandler);
		
		var divMultiSelection = document.getElementById("divMultiSelection");
		var settingMultiAutoComplete = {placeholder:"Search Countries",type:"autocomplete",listWidth:300,required:true,labelField:"name", 
									enableMultipleSelection:true,enableKeyboardNavigation:true,customScrollerRequired:false,showCustomValidation:false,
									stopHoveringField:"stopOver",dataSource:countries};
		nsTextBoxMultiSelection = new NSTextBox(divMultiSelection,settingMultiAutoComplete);
		
		var divSingleServerSideSelection = document.getElementById("divSingleServerSideSelection");
		var dropDownSetting = {enableVirtualScroll:false,customScrollerRequired:false,enableMouseHoverAnimation:true};
		var filterSetting = {caseSensitive:false,multiline:false,matchType:new NSFilter().STARTS_WITH};
		var settingServerAutoComplete = {enableServerSide:true,placeholder:"Search Countries",type:"autocomplete",listWidth:300,required:true,labelField:labelField,minSearchStartChars:2,
									enableMultipleSelection:false,enableKeyboardNavigation:true,showCustomValidation:false,
									stopHoveringField:"stopOver",dropDownSetting:dropDownSetting,filterSetting:filterSetting,enableHighlighting:true,
									serverSearchCallback:serverSearchCallback};
		nsTextBoxServerSideSingleSelection = new NSTextBox(divSingleServerSideSelection,settingServerAutoComplete);
		
		var divSingleSelectionGrid = document.getElementById("divSingleSelectionGrid");
		var column = [{headerText:"Name",dataField:"name",width:"200px"},
     			      {headerText:"Code",dataField:"code",width:"100px"}
     			     ];
		var dropDownSetting = {columns:column,enableVirtualScroll:true,enableFilter:true,enableAdvancedFilter:true,enablePagination:false};
		var filterSetting = {caseSensitive:false,multiline:false,matchType:new NSFilter().CONTAINS};
		var settingAutoCompleteGrid = {placeholder:"Search Countries",type:"autocomplete",dropDownType:NSTextBox.DROPDOWN_TYPE_GRID,listWidth:300,required:true,labelField:"name",minSearchStartChars:1,
									enableMultipleSelection:false,enableKeyboardNavigation:true,showCustomValidation:false,
									stopHoveringField:"stopOver",dropDownSetting:dropDownSetting,filterSetting:filterSetting,enableHighlighting:true,
									arrGridSearchField:["name","code"],
									dataSource:countries};
		nsTextBoxSingleSelectionGrid = new NSTextBox(divSingleSelectionGrid,settingAutoCompleteGrid);
		
		var divSingleServerSideSelectionGrid =  document.getElementById("divSingleServerSideSelectionGrid");
		var serverColumn = [{headerText:"Name",dataField:labelField,width:"200px"},
	     			      	{headerText:"Region",dataField:"region",width:"100px"},
	     			      	{headerText:"Capital",dataField:"capital",width:"200px"}
	     			       ];
		var dropDownSetting = {columns:serverColumn,enableVirtualScroll:true,enableFilter:true,enableAdvancedFilter:false,enablePagination:false};
		var filterSetting = {caseSensitive:false,multiline:false,matchType:new NSFilter().STARTS_WITH};
		var settingServerAutoCompleteGrid = {enableServerSide:true,placeholder:"Search Countries",type:"autocomplete",dropDownType:NSTextBox.DROPDOWN_TYPE_GRID,
											listWidth:500,required:true,labelField:labelField,minSearchStartChars:2,
											enableMultipleSelection:false,enableKeyboardNavigation:true,showCustomValidation:false,
											stopHoveringField:"stopOver",dropDownSetting:dropDownSetting,filterSetting:filterSetting,enableHighlighting:true,
											isGridOrFilter:true,arrGridSearchField:[labelField,"region"],
											serverSearchCallback:serverGridSearchCallback,textBoxRendererCallback:textBoxRendererServerCallback};
		nsTextBoxSeverSelectionGrid = new NSTextBox(divSingleServerSideSelectionGrid,settingServerAutoCompleteGrid);
		
		var divSingleServerSideSmartGrid =  document.getElementById("divSingleServerSideSmartGrid");
		var serverColumn = [{headerText:"Name",dataField:labelField,width:"200px"},
	     			      	{headerText:"Region",dataField:"region",width:"100px"},
	     			      	{headerText:"Capital",dataField:"capital",width:"200px"}
	     			       ];
		var dropDownSetting = {columns:serverColumn,enableVirtualScroll:true,enableFilter:true,enableAdvancedFilter:false,enablePagination:false};
		var filterSetting = {caseSensitive:false,multiline:false,matchType:new NSFilter().CONTAINS};
		var settingServerSmartAutoCompleteGrid = {enableServerWithSmartSearch:true,placeholder:"Search Countries",type:"autocomplete",dropDownType:NSTextBox.DROPDOWN_TYPE_GRID,
											listWidth:500,required:true,labelField:labelField,minSearchStartChars:3,
											enableMultipleSelection:false,enableKeyboardNavigation:true,showCustomValidation:false,
											stopHoveringField:"stopOver",dropDownSetting:dropDownSetting,filterSetting:filterSetting,enableHighlighting:true,
											isGridOrFilter:true,arrGridSearchField:[labelField,"region"],
											serverSearchCallback:serverGridSmartSearchCallback,textBoxRendererCallback:textBoxRendererServerCallback};
		nsTextBoxSeverSmartSelectionGrid = new NSTextBox(divSingleServerSideSmartGrid,settingServerSmartAutoCompleteGrid);
		
	}
	
	function textBoxRendererSingleSelectionCallback(selectedItem,labelField)
	{
		var selectedString = nsTextBoxSingleSelection.getText() ;
		var retVal = "";
		console.log(selectedString) ;
		selectedString = selectedString.substring(0,selectedString.lastIndexOf(";"))
		if(selectedString!="")
		{
			selectedString = selectedString
		}
		if(selectedItem)
		{
			retVal = (selectedString==''?'':selectedString+';')+ selectedItem["name"] + ";"; ;
		}
		return retVal;
	}
	
	function serverSearchCallback(searchString,filterSetting,enableHighlighting,searchRecordLimit)
	{
		if(searchString && searchString.length > 1)
		{
			var ajax = new NSAjax();
			ajax.get(baseAPIUrl + searchString,{datalength: "10"},{dataType:"json"}).then(
					function(result) 
					{
						var source = populateCountryName(result);
						console.log(source);
						nsTextBoxServerSideSingleSelection.dataSource(source);
					},
					function(error) 
					{ 
						/* handle an error */ 
					}
			);
		}
	}
	
	function serverGridSearchCallback(searchString,filterSetting,enableHighlighting,searchRecordLimit)
	{
		if(searchString && searchString.length > 1)
		{
			var ajax = new NSAjax();
			ajax.get(baseAPIUrl + searchString,{datalength: "10"},{dataType:"json"}).then(
					function(result) 
					{
						var source = populateCountryName(result);
						console.log(source);
						nsTextBoxSeverSelectionGrid.dataSource(source);
					},
					function(error) 
					{ 
						/* handle an error */ 
					}
			);
		}
	}
	

	function serverGridSmartSearchCallback(searchString,filterSetting,enableHighlighting,searchRecordLimit)
	{
		if(searchString && searchString.length > 1)
		{
			var ajax = new NSAjax({dataType:"json"});
			var url = baseAPIUrl + searchString;
			ajax.get(url).then(function(response){
				console.log("Setting Smart Response ",response);
				var source = populateCountryName(response);
				//setTimeout(() => {
					nsTextBoxSeverSmartSelectionGrid.dataSource(source);
				//}, 5000);
				
			}).catch(function(error){
				console.error(error);
			});
		}
	}
	
	function populateCountryName(response) {
		if(response && response.length) {
			for(var index = 0;index < response.length;index++) {
				response[index][labelField] = response[index].name.official;
			}
		}
		return response;
	}
	
	function textBoxRendererServerCallback(item,labelField)
	{
		if(item)
		{
			return (item[labelField] + " (Capital : " + item["capital"] + " )");
		}
		return ""; 
	}
	
	function applyMinMaxCharacter()
	{
		var minChar =  document.querySelector("#txtMinCharacter").value;
		var maxChar =  document.querySelector("#txtMaxCharacter").value;
		nsTextBoxMinMaxCharacter.changeProperty("minChars",minChar);
		nsTextBoxMinMaxCharacter.changeProperty("maxChars",maxChar);
	}
	
	
	function setData(renderer,item,labelField,searchString)
	{
		if(renderer)
		{
			if(item && item[labelField])
			{
				var txtAutoComplete = document.querySelector("#txtAutoComplete");
				var htmlText = item[labelField];
				if(htmlText != txtAutoComplete.getNoMessage())
				{
					if (searchString) 
					{
					      var words = '(' +
					      		searchString.split(/\ /).join(' |').split(/\(/).join('\\(').split(/\)/).join('\\)') + '|' +
					      		searchString.split(/\ /).join('|').split(/\(/).join('\\(').split(/\)/).join('\\)') +
					          ')',
					          exp = new RegExp(words, 'gi');
					      if (words.length) 
					      {
					    	  htmlText = htmlText.replace(exp, "<span class=\"nsTextHighlight\">$1</span>");
					      }
					}
					renderer.rendererBody.label2.innerHTML = "(" + item["code"] + ")";
				}
				renderer.rendererBody.label1.innerHTML = htmlText;
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
			var txtAutoComplete = document.querySelector("#txtAutoComplete");
			renderer.rendererBody.label2.style.display = "none";
			renderer.rendererBody.label1.innerHTML = "";
			renderer.rendererBody.label2.innerHTML = "";
			txtAutoComplete.util.removeStyleClass(renderer.rendererBody,"header");
			txtAutoComplete.util.addStyleClass(renderer.rendererBody,"hbox");
		}
	}
	
	function selectionHandler(event)
	{
		console.log(event.detail);
	}
	
	function unSelectionHandler(event)
	{
		console.log(event.detail);
	}
	
	var countries = [
	                 	{name: 'Afghanistan', code: 'AF'},
	                    {name: 'Aland Islands', code: 'AX'},
	                    {name: 'Albania', code: 'AL'},
	                    {name: 'American Samoa', code: 'AS'},
	                    {name: 'AndorrA', code: 'AD'},
	                    {name: 'Angola', code: 'AO'},
	                    {name: 'Anguilla', code: 'AI'},
	                    {name: 'Antarctica', code: 'AQ'},
	                    {name: 'Antigua and Barbuda', code: 'AG'},
	                    {name: 'Argentina', code: 'AR'},
	                    {name: 'Armenia', code: 'AM'},
	                    {name: 'Aruba', code: 'AW'},
	                    {name: 'Australia', code: 'AU'},
	                    {name: 'Austria', code: 'AT'},
	                    {name: 'Azerbaijan', code: 'AZ'},
	                    {name: 'Bahamas', code: 'BS'},
	                    {name: 'Bahrain', code: 'BH'},
	                    {name: 'Bangladesh', code: 'BD'},
	                    {name: 'Barbados', code: 'BB'},
	                    {name: 'Belarus', code: 'BY'},
	                    {name: 'Belgium', code: 'BE'},
	                    {name: 'Belize', code: 'BZ'},
	                    {name: 'Benin', code: 'BJ'},
	                    {name: 'Bermuda', code: 'BM'},
	                    {name: 'Bhutan', code: 'BT'},
	                    {name: 'Bolivia', code: 'BO'},
	                    {name: 'Bosnia and Herzegovina', code: 'BA'},
	                    {name: 'Botswana', code: 'BW'},
	                    {name: 'Bouvet Island', code: 'BV'},
	                    {name: 'Brazil', code: 'BR'},
	                    {name: 'Brunei Darussalam', code: 'BN'},
	                    {name: 'Bulgaria', code: 'BG'},
	                    {name: 'Burkina Faso', code: 'BF'},
	                    {name: 'Burundi', code: 'BI'},
	                    {name: 'Cambodia', code: 'KH'},
	                    {name: 'Cameroon', code: 'CM'},
	                    {name: 'Canada', code: 'CA'},
	                    {name: 'Cape Verde', code: 'CV'},
	                    {name: 'Cayman Islands', code: 'KY'},
	                    {name: 'Central African Republic', code: 'CF'},
	                    {name: 'Chad', code: 'TD'},
	                    {name: 'Chile', code: 'CL'},
	                    {name: 'China', code: 'CN'},
	                    {name: 'Christmas Island', code: 'CX'},
	                    {name: 'Cocos (Keeling) Islands', code: 'CC'},
	                    {name: 'Colombia', code: 'CO'},
	                    {name: 'Comoros', code: 'KM'},
	                    {name: 'Congo', code: 'CG'},
	                    {name: 'Cook Islands', code: 'CK'},
	                    {name: 'Costa Rica', code: 'CR'},
	                    {name: 'Cote D\'Ivoire', code: 'CI'},
	                    {name: 'Croatia', code: 'HR'},
	                    {name: 'Cuba', code: 'CU'},
	                    {name: 'Cyprus', code: 'CY'},
	                    {name: 'Czech Republic', code: 'CZ'},
	                    {name: 'Denmark', code: 'DK'},
	                    {name: 'Djibouti', code: 'DJ'},
	                    {name: 'Dominica', code: 'DM'},
	                    {name: 'Dominican Republic', code: 'DO'},
	                    {name: 'Ecuador', code: 'EC'},
	                    {name: 'Egypt', code: 'EG'},
	                    {name: 'El Salvador', code: 'SV'},
	                    {name: 'Equatorial Guinea', code: 'GQ'},
	                    {name: 'Eritrea', code: 'ER'},
	                    {name: 'Estonia', code: 'EE'},
	                    {name: 'Ethiopia', code: 'ET'},
	                    {name: 'Falkland Islands (Malvinas)', code: 'FK'},
	                    {name: 'Faroe Islands', code: 'FO'},
	                    {name: 'Fiji', code: 'FJ'},
	                    {name: 'Finland', code: 'FI'},
	                    {name: 'France', code: 'FR'},
	                    {name: 'French Guiana', code: 'GF'},
	                    {name: 'French Polynesia', code: 'PF'},
	                    {name: 'French Southern Territories', code: 'TF'},
	                    {name: 'Gabon', code: 'GA'},
	                    {name: 'Gambia', code: 'GM'},
	                    {name: 'Georgia', code: 'GE'},
	                    {name: 'Germany', code: 'DE'},
	                    {name: 'Ghana', code: 'GH'},
	                    {name: 'Gibraltar', code: 'GI'},
	                    {name: 'Greece', code: 'GR'},
	                    {name: 'Greenland', code: 'GL'},
	                    {name: 'Grenada', code: 'GD'},
	                    {name: 'Guadeloupe', code: 'GP'},
	                    {name: 'Guam', code: 'GU'},
	                    {name: 'Guatemala', code: 'GT'},
	                    {name: 'Guernsey', code: 'GG'},
	                    {name: 'Guinea', code: 'GN'},
	                    {name: 'Guinea-Bissau', code: 'GW'},
	                    {name: 'Guyana', code: 'GY'},
	                    {name: 'Haiti', code: 'HT'},
	                    {name: 'Honduras', code: 'HN'},
	                    {name: 'Hong Kong', code: 'HK'},
	                    {name: 'Hungary', code: 'HU'},
	                    {name: 'Iceland', code: 'IS'},
	                    {name: 'India', code: 'IN'},
	                    {name: 'Indonesia', code: 'ID'},
	                    {name: 'Iraq', code: 'IQ'},
	                    {name: 'Ireland', code: 'IE'},
	                    {name: 'Isle of Man', code: 'IM'},
	                    {name: 'Israel', code: 'IL'},
	                    {name: 'Italy', code: 'IT'},
	                    {name: 'Jamaica', code: 'JM'},
	                    {name: 'Japan', code: 'JP'},
	                    {name: 'Jersey', code: 'JE'},
	                    {name: 'Jordan', code: 'JO'},
	                    {name: 'Kazakhstan', code: 'KZ'},
	                    {name: 'Kenya', code: 'KE'},
	                    {name: 'Kiribati', code: 'KI'},
	                    {name: 'Korea, Republic of', code: 'KR'},
	                    {name: 'Kuwait', code: 'KW'},
	                    {name: 'Kyrgyzstan', code: 'KG'},
	                    {name: 'Latvia', code: 'LV'},
	                    {name: 'Lebanon', code: 'LB'},
	                    {name: 'Lesotho', code: 'LS'},
	                    {name: 'Liberia', code: 'LR'},
	                    {name: 'Libyan Arab Jamahiriya', code: 'LY'},
	                    {name: 'Liechtenstein', code: 'LI'},
	                    {name: 'Lithuania', code: 'LT'},
	                    {name: 'Luxembourg', code: 'LU'},
	                    {name: 'Macao', code: 'MO'},
	                    {name: 'Madagascar', code: 'MG'},
	                    {name: 'Malawi', code: 'MW'},
	                    {name: 'Malaysia', code: 'MY'},
	                    {name: 'Maldives', code: 'MV'},
	                    {name: 'Mali', code: 'ML'},
	                    {name: 'Malta', code: 'MT'},
	                    {name: 'Marshall Islands', code: 'MH'},
	                    {name: 'Martinique', code: 'MQ'},
	                    {name: 'Mauritania', code: 'MR'},
	                    {name: 'Mauritius', code: 'MU'},
	                    {name: 'Mayotte', code: 'YT'},
	                    {name: 'Mexico', code: 'MX'},
	                    {name: 'Moldova, Republic of', code: 'MD'},
	                    {name: 'Monaco', code: 'MC'},
	                    {name: 'Mongolia', code: 'MN'},
	                    {name: 'Montserrat', code: 'MS'},
	                    {name: 'Morocco', code: 'MA'},
	                    {name: 'Mozambique', code: 'MZ'},
	                    {name: 'Myanmar', code: 'MM'},
	                    {name: 'Namibia', code: 'NA'},
	                    {name: 'Nauru', code: 'NR'},
	                    {name: 'Nepal', code: 'NP'},
	                    {name: 'Netherlands', code: 'NL'},
	                    {name: 'Netherlands Antilles', code: 'AN'},
	                    {name: 'New Caledonia', code: 'NC'},
	                    {name: 'New Zealand', code: 'NZ'},
	                    {name: 'Nicaragua', code: 'NI'},
	                    {name: 'Niger', code: 'NE'},
	                    {name: 'Nigeria', code: 'NG'},
	                    {name: 'Niue', code: 'NU'},
	                    {name: 'Norfolk Island', code: 'NF'},
	                    {name: 'Northern Mariana Islands', code: 'MP'},
	                    {name: 'Norway', code: 'NO'},
	                    {name: 'Oman', code: 'OM'},
	                    {name: 'Pakistan', code: 'PK'},
	                    {name: 'Palau', code: 'PW'},
	                    {name: 'Palestinian Territory, Occupied', code: 'PS'},
	                    {name: 'Panama', code: 'PA'},
	                    {name: 'Papua New Guinea', code: 'PG'},
	                    {name: 'Paraguay', code: 'PY'},
	                    {name: 'Peru', code: 'PE'},
	                    {name: 'Philippines', code: 'PH'},
	                    {name: 'Pitcairn', code: 'PN'},
	                    {name: 'Poland', code: 'PL'},
	                    {name: 'Portugal', code: 'PT'},
	                    {name: 'Puerto Rico', code: 'PR'},
	                    {name: 'Qatar', code: 'QA'},
	                    {name: 'Reunion', code: 'RE'},
	                    {name: 'Romania', code: 'RO'},
	                    {name: 'Russian Federation', code: 'RU'},
	                    {name: 'RWANDA', code: 'RW'},
	                    {name: 'Saint Helena', code: 'SH'},
	                    {name: 'Saint Kitts and Nevis', code: 'KN'},
	                    {name: 'Saint Lucia', code: 'LC'},
	                    {name: 'Saint Pierre and Miquelon', code: 'PM'},
	                    {name: 'Samoa', code: 'WS'},
	                    {name: 'San Marino', code: 'SM'},
	                    {name: 'Sao Tome and Principe', code: 'ST'},
	                    {name: 'Saudi Arabia', code: 'SA'},
	                    {name: 'Senegal', code: 'SN'},
	                    {name: 'Serbia and Montenegro', code: 'CS'},
	                    {name: 'Seychelles', code: 'SC'},
	                    {name: 'Sierra Leone', code: 'SL'},
	                    {name: 'Singapore', code: 'SG'},
	                    {name: 'Slovakia', code: 'SK'},
	                    {name: 'Slovenia', code: 'SI'},
	                    {name: 'Solomon Islands', code: 'SB'},
	                    {name: 'Somalia', code: 'SO'},
	                    {name: 'South Africa', code: 'ZA'},
	                    {name: 'Spain', code: 'ES'},
	                    {name: 'Sri Lanka', code: 'LK'},
	                    {name: 'Sudan', code: 'SD'},
	                    {name: 'Suriname', code: 'SR'},
	                    {name: 'Svalbard and Jan Mayen', code: 'SJ'},
	                    {name: 'Swaziland', code: 'SZ'},
	                    {name: 'Sweden', code: 'SE'},
	                    {name: 'Switzerland', code: 'CH'},
	                    {name: 'Syrian Arab Republic', code: 'SY'},
	                    {name: 'Tajikistan', code: 'TJ'},
	                    {name: 'Thailand', code: 'TH'},
	                    {name: 'Timor-Leste', code: 'TL'},
	                    {name: 'Togo', code: 'TG'},
	                    {name: 'Tokelau', code: 'TK'},
	                    {name: 'Tonga', code: 'TO'},
	                    {name: 'Trinidad and Tobago', code: 'TT'},
	                    {name: 'Tunisia', code: 'TN'},
	                    {name: 'Turkey', code: 'TR'},
	                    {name: 'Turkmenistan', code: 'TM'},
	                    {name: 'Tuvalu', code: 'TV'},
	                    {name: 'Uganda', code: 'UG'},
	                    {name: 'Ukraine', code: 'UA'},
	                    {name: 'United Arab Emirates', code: 'AE'},
	                    {name: 'United Kingdom', code: 'GB'},
	                    {name: 'United States', code: 'US'},
	                    {name: 'Uruguay', code: 'UY'},
	                    {name: 'Uzbekistan', code: 'UZ'},
	                    {name: 'Vanuatu', code: 'VU'},
	                    {name: 'Venezuela', code: 'VE'},
	                    {name: 'Vietnam', code: 'VN'},
	                    {name: 'Virgin Islands, British', code: 'VG'},
	                    {name: 'Virgin Islands, U.S.', code: 'VI'},
	                    {name: 'Wallis and Futuna', code: 'WF'},
	                    {name: 'Western Sahara', code: 'EH'},
	                    {name: 'Yemen', code: 'YE'},
	                    {name: 'Zambia', code: 'ZM'},
	                    {name: 'Zimbabwe', code: 'ZW'}
	                ];
	</script>
	
</body>


</html>