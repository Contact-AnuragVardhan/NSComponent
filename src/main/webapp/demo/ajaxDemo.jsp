<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>jQuery UI Autocomplete - Remote JSONP datasource</title>
	<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
	<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
	<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
	<link rel="stylesheet" href="http://jqueryui.com/jquery-wp-content/themes/jqueryui.com/style.css">
	<script src="../lib/com/org/util/nsImport.js"></script>
	<style>
	#city { width: 25em; }
	</style>
	<script>
	/*var getJSON = function(url, successHandler, errorHandler) {
		  var xhr = typeof XMLHttpRequest != 'undefined'
		    ? new XMLHttpRequest()
		    : new ActiveXObject('Microsoft.XMLHTTP');
		  xhr.open('get', url, true);
		  xhr.responseType = 'jsonp';
		  xhr.onreadystatechange = function() {
		    var status;
		    var data;
		    // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
		    if (xhr.readyState == 4) { // `DONE`
		      status = xhr.status;
		      if (status == 200) {
		        successHandler && successHandler(xhr.response);
		      } else {
		        errorHandler && errorHandler(status);
		      }
		    }
		  };
		  xhr.send();
		};*/
		
		function xdr(url, method, data, callback, errback) {
		    var req;
		    
		    if(XMLHttpRequest) {
		        req = new XMLHttpRequest();

		        if('withCredentials' in req) {
		            req.open(method, url, true);
		            req.onerror = errback;
		            req.onreadystatechange = function() {
		                if (req.readyState === 4) {
		                    if (req.status >= 200 && req.status < 400) {
		                        callback(req.responseText);
		                    } else {
		                        errback(new Error('Response returned with non-OK status'));
		                    }
		                }
		            };
		            req.send(data);
		        }
		    } else if(XDomainRequest) {
		        req = new XDomainRequest();
		        req.open(method, url);
		        req.onerror = errback;
		        req.onload = function() {
		            callback(req.responseText);
		        };
		        req.send(data);
		    } else {
		        errback(new Error('CORS not supported'));
		    }
		}
		/*jsonCallback(
				{
					"sites":
					[
						{
							"siteName": "geobytes",
							"domainName": "http://gd.geobytes.com/AutoCompleteCity",
							"description": "geobytes"
						}
					]
				}
			);*/
	$(function() {
		function log( message ) {
			$( "<div>" ).text( message ).prependTo( "#log" );
			$( "#log" ).scrollTop( 0 );
		}

		$( "#city" ).autocomplete({
			source: function( request, response ) {
				console.log(request);
				/*$.ajax({
					type: 'GET',
					url: "http://gd.geobytes.com/AutoCompleteCity?callback=?",
					async: false,
					jsonpCallback: 'jsonCallback',
					//contentType: "application/json",
					dataType: "jsonp",
					data: {
						q: request.term
					},
					success: function( data ) {
						console.log(data);
						response( data );
					}
				});*/
				var util= new NSUtil();
				var setting =  {
					method: "GET",
					//url: "http://api.flickr.com/services/feeds/photos_public.gne",
					url: "http://gd.geobytes.com/AutoCompleteCity",
					dataType: "jsonp",
					param: {
						q: request.term
					},
					successHandler: function( data ) {
						console.log(data);
						response( data );
					}
				};
				var ajax = new util.ajax(setting);
			},
			minLength: 2,
			select: function( event, ui ) {
				log( ui.item ?
					"Selected: " + ui.item.label :
					"Nothing selected, input was " + this.value);
			},
			open: function() {
				$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
			},
			close: function() {
				$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
			}
		});
	});
	</script>
	
	<script type='text/javascript'>//<![CDATA[

// This function will be called when the JSONP script returns. It needs to be evaluated
// before the script with the JSONP call.
var processJSON = function (json) {
   console.log(json);
};

//http://schock.net/articles/2013/02/05/how-jsonp-really-works-examples/
function checkAjaxCall()
{
	var util= new NSUtil();
	var setting =  {
		method: "GET",
		//url: "http://api.flickr.com/services/feeds/photos_public.gne",
		url: "http://gd.geobytes.com/AutoCompleteCity",
		dataType: "jsonp",
		param: {
			q: "Ame"
		},
		successHandler: function(response){
			console.log(response);
		}
	};
	var ajax = new util.ajax(setting);
}

var funcName = "instanceA";

function callAjax()
{
	var a = new Test();
	a.create();
	window[funcName]("test");
}

function Test()
{
}

Test.prototype.create = function()
{
	window["objTest"] = this;
	window[funcName] = function(json){
		window["objTest"].callback(json);
	};
};

Test.prototype.callback = function(json)
{
	alert(json);
	window[funcName] = null;
	window["objTest"] = null;
};

//]]> 

</script>
	
</head>
<body>

<div class="ui-widget">
	<label for="city">Your city: </label>
	<input id="city">
	Powered by <a href="http://geonames.org">geonames.org</a>
</div>

<div class="ui-widget" style="margin-top:2em; font-family:Arial">
	Result:
	<div id="log" style="height: 200px; width: 300px; overflow: auto;" class="ui-widget-content"></div>
</div>
<button type="button" onclick="checkAjaxCall('year');">Send Request</button>
<button type="button" onclick="callAjax();">Call Ajax</button>

<!-- <script src='http://gd.geobytes.com/AutoCompleteCity?callback=processJSON&q=IND'></script> -->




</body>
</html>
