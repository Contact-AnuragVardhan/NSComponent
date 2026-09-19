<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Ajax Demo</title>

<style>
		body,html
		{
			margin:0px;
			padding:0px;
			height:100%;
			background:#FFFFFF;
		}
		.container
		{
			width:100%;
			height:35%;
			flex: 1 1 auto;
    		padding-left: calc(50% - 25px);
		}
		
</style>

</head>
<body>
 	<div class="container">
		 <h3>Demo to load /demo/html/demo.html file</h3>
		 <input type="button" id="btnDemo1" onclick="demo1Handler(event)" value="Load Page" />
	      <div id ="divDemo1" style = "background-color:cc0;">
	         Data Here
	      </div>
	</div>
	<div class="container">
		 <h3>Demo to load data from JSON file</h3>
		 <input type="button" id="btnDemo2" onclick="demo2Handler(event)" value="Load Data" />
	      <div id ="divDemo2" style = "background-color:cc0;">
	         Data Here
	      </div>
	</div>
	<div class="container">
		 <h3>Demp passing Data to the Server</h3>
		 <input id="txtCount" type="number" placeholder="Enter number of rows you want from server">
		 <input type="button" id="btnDemo3" onclick="demo3Handler(event)" value="Send Data" />
	      <div id ="divDemo3" style = "background-color:cc0;">
	         Here
	      </div>
	</div>
	
<!-- 	<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script> -->
	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script src="../lib/com/org/util/nsPromise.js"></script>
	<script src="../lib/com/org/util/nsAjax.js"></script>
	<script src="../lib/com/ext/fetch.js"></script>
	
	<script>	
		var ajax = null;
		
		function loadHandler()
		{
			ajax = new NSAjax();
		}
		
		function demo1Handler(event)
		{
			ajax.get("http://localhost:8080/JSLib/demo/html/demo.html").then(function(response){
				document.querySelector("#divDemo1").innerHTML = response;
			}).catch(function(error){
				console.error(error);
			});
		}
		
		function demo2Handler(event)
		{
			ajax.post("http://localhost:8080/JSLib/demo/html/data.json").then(function(response){
				var html = '';
				for(var count = 0;count < response.length;count++)
				{
					var user = response[count];
					var htmlSegment = '<div class="user">' +
                        '<h2>' + user.firstName + ' ' + user.lastName + '</h2>' +
                        '<div class="email"><a href="email:' + user.email + '">' + user.email + '</a></div>' +
                    '</div>';
					html += htmlSegment;
				}
				document.querySelector("#divDemo2").innerHTML = html;
			}).catch(function(error){
				console.error(error);
			});
		}
		
		function demo3Handler(event)
		{
			var txtCount = document.querySelector("#txtCount");
			if(txtCount.value)
			{
				ajax.post("/JSLib/hierarchicalFirstLevelData",{datalength: txtCount.value},{dataType:"json"}).then(function(response){
					var html = '<table>';
					html +="<tr><th>ID</th><th>First Name</th><th>Last Name</th><th>city</th></tr>";
					for(var count = 0;count < response.length;count++)
					{
						var item = response[count];
						var htmlSegment = '<tr>';
						htmlSegment += '<td>' + item.id + '</td>';
						htmlSegment += '<td>' + item.firstName + '</td>';
						htmlSegment += '<td>' + item.lastName + '</td>';
						htmlSegment += '<td>' + item.city + '</td>';
						htmlSegment += '</tr>';
						html += htmlSegment;
					}
					document.querySelector("#divDemo3").innerHTML = html;
					}).catch(function(error){
						console.error(error);
				});
			}
			else
			{
				alert("Please enter number");
			}
		}
		
		loadHandler();
		
	</script>
	
</body>
</html>