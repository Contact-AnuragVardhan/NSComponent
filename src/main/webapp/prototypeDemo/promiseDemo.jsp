<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Promise Demo</title>
	
	

<body onload="initialize()">
	<h2>JavaScript Callbacks</h2>

	<img id="demo" crossOrigin="Anonymous" ></img>
<script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
<script src="/JSLib/lib/com/org/util/nsPromise.js"></script>
<script>
	function initialize()
	{
		loadImage();

	}
	
	function imgLoad(url) {
	    'use strict';
	    // Create new promise with the Promise() constructor;
	    // This has as its argument a function with two parameters, resolve and reject
	    return new Promise(function (resolve, reject) {
	        // Standard XHR to load an image
	        var request = new XMLHttpRequest();
	        request.open('GET', url);
	        request.responseType = 'blob';
	        
	        // When the request loads, check whether it was successful
	        request.onload = function () {
	            if (request.status === 200) {
	                // If successful, resolve the promise by passing back the request response
	                resolve(request.response);
	            } else {
	                // If it fails, reject the promise with a error message
	                reject(new Error('Image didn\'t load successfully; error code:' + request.statusText));
	            }
	        };
	      
	        request.onerror = function () {
	            // Also deal with the case when the entire request fails to begin with
	            // This is probably a network error, so reject the promise with an appropriate message
	            reject(new Error('There was a network error.'));
	        };
	      
	        // Send the request
	        request.send();
	    });
	}

	function loadImage() {
	    'use strict';
	    // Get a reference to the body element, and create a new image object
	    var body = document.querySelector('body'),
	        myImage = new Image();
	  
	    myImage.crossOrigin = ""; // or "anonymous"
	    
	    // Call the function with the URL we want to load, but then chain the
	    // promise then() method on to the end of it. This contains two callbacks
	    imgLoad('http://i.imgur.com/YzkSFCW.png').then(function (response) {
	        // The first runs when the promise resolves, with the request.reponse specified within the resolve() method.
	        var imageURL = window.URL.createObjectURL(response);
	        myImage.src = imageURL;
	        body.appendChild(myImage);
	        // The second runs when the promise is rejected, and logs the Error specified with the reject() method.
	    }, function (Error) {
	        console.log(Error);
	    });
	}

	
</script>
</body>
</html>
