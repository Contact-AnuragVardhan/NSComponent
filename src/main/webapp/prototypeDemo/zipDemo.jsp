<!DOCTYPE html>
<html lang="en">
<head>
  <title>Zip Demo</title>
  <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
   <script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
  <script src="/JSLib/lib/com/org/util/nsZip.js"></script>
</head>
<body>
<button onclick="download()">Click me!</button>

<script>

function download() 
{
	var zip = new NSZip();
	var folder = zip.addFolder("anurag");
	folder.addFile("anurag.txt","This is a test");
	zip.addFile("vardhan/anurag.xml","<root>This is a test</root>");
	zip.downloadFile();
	
	/*var zip = new NSZip();
	zip.addFile("Hello.txt", "Hello World\n");
	var img = zip.addFolder("images");
	toDataURL(
			  'https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0',
			  function(dataUrl) {
			    console.log('RESULT:', dataUrl);
			    //var idx = dataUrl.indexOf('base64,') + 'base64,'.length;
			    //var content = dataUrl.substring(idx);
			    img.addFile("avatar.png", dataUrl, {type: "base64"});
			    zip.downloadFile();
			  }
	);*/
};

function toDataURL(src, callback, outputFormat) {
	  var img = new Image();
	  img.crossOrigin = 'Anonymous';
	  img.onload = function() {
	    var canvas = document.createElement('CANVAS');
	    var ctx = canvas.getContext('2d');
	    var dataURL;
	    canvas.height = this.naturalHeight;
	    canvas.width = this.naturalWidth;
	    ctx.drawImage(this, 0, 0);
	    dataURL = canvas.toDataURL(outputFormat);
	    callback(dataURL);
	  };
	  img.src = src;
	  if (img.complete || img.complete === undefined) {
	    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
	    img.src = src;
	  }
}

</script>

</body>
</html>