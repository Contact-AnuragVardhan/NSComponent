<!-- https://github.com/darylrowland/angucomplete -->
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
 <meta name='viewport' content='width=device-width,initial-scale=1'>
 <script src="../lib/com/org/util/nsImport.js"></script>
 <style>
 	/*from http://www.sanwebe.com/2013/10/css-html-form-styles*/
 	/* #### Dark Matter #### */
	.dark-matter {
	    margin-left: auto;
	    margin-right: auto;
	    max-width: 500px;
	    background: #555;
	    padding: 20px 30px 20px 30px;
	    color: #D3D3D3;
	    text-shadow: 1px 1px 1px #444;
	    border: none;
	    border-radius: 5px;
	    -webkit-border-radius: 5px;
	    -moz-border-radius: 5px;
	}
	.dark-matter h1 {
	    padding: 0px 0px 10px 40px;
	    display: block;
	    border-bottom: 1px solid #444;
	    margin: -10px -30px 30px -30px;
	}
	.dark-matter h1>span {
	    display: block;
	    font-size: 11px;
	}
	.dark-matter label {
	    display: block;
	    margin: 0px 0px 5px;
	}
	.dark-matter .labelSpan {
	    float: left;
	    width: 20%;
	    text-align: right;
	    padding-right: 10px;
	    margin-top: 10px;
	    font-weight: bold;
	}
	.dark-matter input[type="text"], .dark-matter input[type="email"], .dark-matter textarea, .dark-matter select {
	    border: none;
	    color: #525252;
	    margin-bottom: 16px;
	    margin-right: 6px;
	    margin-top: 2px;
	    outline: 0 none;
	    padding: 5px 0px 5px 5px;
	    width: 70%;
	    border-radius: 2px;
	    -webkit-border-radius: 2px;
	    -moz-border-radius: 2px;
	    -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
	}
	.dark-matter select {
	    background: #DFDFDF no-repeat right;
	    background: #DFDFDF no-repeat right;
	    appearance:none;
	    -webkit-appearance:none; 
	    -moz-appearance: none;
	    text-indent: 0.01px;
	    text-overflow: '';
	    width: 70%;
	    height: 35px;
	    color: #525252;
	    line-height: 25px;
	}
	.dark-matter .button {
	    background: #FFCC02;
	    border: none;
	    padding: 10px 25px 10px 25px;
	    color: #585858;
	    border-radius: 4px;
	    -moz-border-radius: 4px;
	    -webkit-border-radius: 4px;
	    text-shadow: 1px 1px 1px #FFE477;
	    font-weight: bold;
	    box-shadow: 1px 1px 1px #3D3D3D;
	    -webkit-box-shadow:1px 1px 1px #3D3D3D;
	    -moz-box-shadow:1px 1px 1px #3D3D3D;
	    float: right;
	}
	
	.dark-matter .button:hover {
	    color: #333;
	    background-color: #EBEBEB;
	}
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
 	<nsimport file="nsTextBox.js">
 	</nsimport>
	<form action="demo_form.asp" method="post" class="dark-matter">
		<h1>Contact Form<span>Please fill all the texts in the fields.</span></h1>
		<p>
			<label>
				<span class="labelSpan">User Name :</span>
				<ns-TextBox id="txtUserName">
				</ns-TextBox> 
			</label>
			<label>
				<span class="labelSpan">Password :</span>
				<ns-TextBox id="txtPassword">
		 		</ns-TextBox>
		 	</label>
			<label>
				<span class="labelSpan">Country :</span>
				<ns-TextBox id="txtAutoComplete">
		 		</ns-TextBox> 
			</label>
			<label>
				<span class="labelSpan">Subject :</span>
				<select name="selection">
					<option value="Job Inquiry">Job Inquiry</option>
					<option value="General Question">General Question</option>
				</select>
			</label>
			<label>
				<span>&nbsp;</span>
				<input type="submit" class="button" value="Submit">
			</label>
		</p>
	</form>
	<form style="max-width:300px;" action="">

		<input type="submit" value="Submit">
	</form>
	<button onclick="toggleRestrict()">Toggle Restrict</button>
	<button onclick="setText()">Set Text</button>
	
	<script>
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
	</script>
	
	<script>
		
		function loadHandler()
		{
			var settingUserName = {placeholder:"User Name",type:"text",styleClass:"nsTextBox",minChars:3,maxChars:10,restrict:"A-Za-z-,", 
									pattern:"[a-zA-Z]{6,12}",required:true,showCustomValidation:true};	
			var settingPassword = {placeholder:"Password",styleClass:"nsTextBox",displayAsPassword:true,required:true,showCustomValidation:true};
			var settingAutoComplete = {placeholder:"Search Countries",type:"autocomplete",listWidth:300,required:true,labelField:"name", 
										enableMultipleSelection:true,enableKeyboardNavigation:true,customScrollerRequired:false,showCustomValidation:true,
										stopHoveringField:"stopOver"};
			ns.onload(function()
			{
				var txtUserName = document.getElementById("txtUserName");
				txtUserName.setSetting(settingUserName);
				var txtPassword = document.getElementById("txtPassword");
				txtPassword.setSetting(settingPassword);
				var txtAutoComplete = document.getElementById("txtAutoComplete");
				settingAutoComplete["dataSource"] = countries;
				txtAutoComplete.setSetting(settingAutoComplete);
				txtAutoComplete.util.addEvent(txtAutoComplete,txtAutoComplete.ITEM_SELECTED,itemSelectHandler);
				txtAutoComplete.util.addEvent(txtAutoComplete,txtAutoComplete.ITEM_UNSELECTED,itemUnSelectHandler);
			});	
		}
		
		function itemSelectHandler(event)
		{
			console.log("Item Selected with details::" + event.detail["name"] + " with total items selected " + event.target.getSelectedItems().length);
			//console.log("Item Selected with details::" + event.detail["name"] + " with index " + event.index);
		}
		
		function itemUnSelectHandler(event)
		{
			console.log("Item Unselected with details::" + event.detail  + " with index " + event.index);
		}
		
		function toggleRestrict() 
		{
		   var txtUserName = document.querySelector("#txtUserName");
		   if(!txtUserName.getAttribute("restrict") || txtUserName.getAttribute("restrict") === "null")
		   {
			   txtUserName.setAttribute("restrict","A-Za-z-,");
		   }
		   else
		   {
			   txtUserName.setAttribute("restrict",null);
		   }
		}
		
		function setText() 
		{
		   var txtUserName = document.querySelector("#txtUserName");
		   txtUserName.setText("This is a for a demo");
		}
		
		var countries = [
		                 	{name: 'Afghanistan', code: 'AF'},
		                    {name: 'Afghanistan', code: 'AF'},
		                    {name: 'Aland Islands', code: 'AX'},
		                    {name: 'Albania', code: 'AL'},
		                    {name: 'Algeria', code: 'DZ'},
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