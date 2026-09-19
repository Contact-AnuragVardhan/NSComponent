<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Image Processor Demo</title>
	<style>
.lblLabel {
    margin-right: 1em;
    font-weight: bold;
    color: #900;
}

.lblValue {
    margin-right: 1em;
    color: black;
}

	</style>
  <link rel="stylesheet" href="../lib/css/com/org/nsImageProcessor.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />
</head>
<body onload="onload()">
	
	<div style="width:500px;height:400px;overflow:hidden;border: 1px solid #000!important;float: left;">
		<input type="file" id="imageFileInput" accept=".jpg, .jpeg, .png" />
	    <img id="preview" alt="Download.jpeg"/>
    </div>
    <!--  <img src="https://unsplash.it/500/500/?random" id="image3" crossOrigin="Anonymous" onload="uploadTestImage()"/> -->
    <div style="width:500px;height:400px;overflow:hidden;border: 1px solid #000!important;">
	    <div style="width:500px;height:380px;overflow:hidden;border: 1px solid #000!important;">
	    	<img src="http://localhost:8080/JSLib/prototypeDemo/images/cat.png" id="image3" style="width:100%;" />
	    </div>
	    <button style="float:right;" onclick="uploadTestImage()">Click</button>
	</div>
    
    <br/><br/>
    <div class="demo">
    	<div style="float: left; width: 50%;">
    		
    		<div style="width:100px;height:100px;overflow:hidden;margin-left:5px;">
				<img id="imgCropPreview" />
			</div>
			<br/>
			<button onclick="saveImage()">Save Image</button>
			<br/>
			<div id="temp" style="width:500px;height:500px;">
				
			</div>
			<br/>
			<br/>
			<br/>
			<div id="temp1">
				
			</div>
		   
		    <form onsubmit="return false;">
				<label class="lblLabel">X1 <label id="lblx1" class="lblValue" />0</label></label>
				<label class="lblLabel">Y1 <label id="lbly1" class="lblValue" />0</label></label>
				<label class="lblLabel">X2 <label id="lblx2" class="lblValue" />0</label></label>
				<label class="lblLabel">Y2 <label id="lbly2" class="lblValue" />0</label></label>
				<label class="lblLabel">Width <label id="lblwidth" class="lblValue" />0</label></label>
				<label class="lblLabel">Height <label id="lblheight" class="lblValue" />0</label></label>
			</form>
			
			<div style="margin: 20px 0;">

				<span class="requiresjcrop">
					<button id="setSelect" onclick="setSelect()">setSelect</button>
					<button id="animateTo">animateTo</button>
					<button id="release">Release</button>
					<button id="disable">Disable</button>
				</span>

				<button id="enable" style="display:none;">Re-Enable</button>
				<button id="unhook">Destroy!</button>
				<button id="rehook" style="display:none;">Attach Jcrop</button>

			</div>
  		</div>
  	</div>
    
    <script src="../lib/com/org/util/nsUtil.js"></script>
     <script src="../lib/com/org/util/nsAjax.js"></script>
    <script src="../lib/com/org/util/nsImageProcessor.js"></script>
    <script>
    function onload()
    {
    	/*var orignalImage = document.querySelector("#imgCropPreview");
    	var src = orignalImage.src;
    	orignalImage.removeAttribute('src');
    	orignalImage.removeAttribute('crossOrigin');
    	if (src.match(/^https?:\/\/|^\/\//)) {
			orignalImage.setAttribute('crossOrigin', 'anonymous');
        }
    	orignalImage.src = src;*/
    }
    
    document.getElementById('imageFileInput').addEventListener('change', function() {
        var file = this.files[0];
        callProcessorImage(file,null,document.getElementById("preview"),true,function(url,objImageProcessor){
        	/*objImageProcessor.getBase64(function(strBase64){
        		objImageProcessor.getThumbnail(strBase64, 100, 100, function(base64ThumbnailUrl) {
            		setImageUrl(document.getElementById("preview"),base64ThumbnailUrl);
            	});
        	});*/
        	setImageUrl(document.getElementById("preview"),url);
        	objImageProcessor.initializeResize();
        	objImageProcessor.initializeMove();
        	//var croppr = new Croppr('#preview');
        });
    }, false);
    var staticImageProcessor = null;
    function uploadTestImage()
    {
    	staticImageProcessor = callProcessorImage(document.getElementById("image3"),null,null,false,function(url,objImageProcessor){
					        	setImageUrl(document.getElementById("image3"),url);
					        	if(!staticImageProcessor)
					        	{
					        		staticImageProcessor = objImageProcessor;
					        	}
					        	//objImageProcessor.initializeResize();
					        	//objImageProcessor.initializeMove();
					        	//var croppr = new Croppr('#image3');
					        });
    }
    
    //document.getElementById("image3").addEventListener("load",uploadTestImage);

    function setImageUrl(img,url) {
    	img.setAttribute('src', url);
    };
    
    function callProcessorImage(element,fileName,resizeMoveImage,isUpload,uploadSuccessCallback)
    {
    	var cropSelectCallback = function(image,point)
    	{
    		//console.log(point);
    		if (point.width && point.height)
    		{
    			/*var scaleX = 100 / point.width;
    		    var scaleY = 100 / point.height;
    		    var imgPreview = document.querySelector("#imgCropPreview");
    		    imgPreview.style.width = Math.round(scaleX * image.naturalWidth) + "px";
    		    imgPreview.style.height = Math.round(scaleY * image.naturalHeight) + "px";
    		    imgPreview.style.marginLeft = (-1 * Math.round(scaleX * point.x1)) + "px";
    		    imgPreview.style.marginTop = (-1 * Math.round(scaleY * point.y1)) + "px";*/
    		    
    		    for(var key in point)
    		    {
    		    	document.querySelector("#lbl" + key).innerHTML = point[key];
    		    }
    		}
    	    
    	};
    	//menus:["move","resize"],
    	var magnifyProps = {resultElement:"temp"};
    	var setting = {element:element,uploadUrl:"../imageProcessor",image:resizeMoveImage,resizeShowOnClick:false,
    			showMenu:true,resizeMeasurement:true,resizeMaxWidth:9000,resizeMaxHeight:9000,resizeMinWidth:50,resizeMinHeight:50,
    			cropPreviewImages:["imgCropPreview"],
    			magnifyProps:magnifyProps,
    			uploadSuccessCallback:uploadSuccessCallback,uploadFailureCallback:function(response){
    		console.log(response);
    	},uploadProgressCallback:function(loaded,total){
    		var percentage = Math.floor((loaded / total) * 100) + '%';
    		console.log(loaded + " / " + total + " = " + percentage);
    	},validateUploadNameCallback:function(orignalFileName){
    		return (fileName ? fileName : orignalFileName);
    	},cropSelectingCallback:cropSelectCallback,cropSelectedCallback:cropSelectCallback};
    	var imageProcessor = new NSImageProcessor(setting);
    	staticImageProcessor = imageProcessor;
    	if(isUpload)
    	{
    		imageProcessor.uploadImage();
    	}
    	return imageProcessor;
    }
    
    function setSelect()
    {
    	var point = {x1:345,y1:174,x2:420,y2:285};
    	staticImageProcessor.cropSetSelect(point);
    }
    
    function saveImage()
    {
    	var img = document.getElementById("imgCropPreview");
    	var rect = img.getBoundingClientRect();
    	const elem = document.createElement('canvas');
    	elem.width = rect.width;
    	elem.height = rect.height;
    	const ctx = elem.getContext('2d');
    	ctx.drawImage(img, 0, 0, rect.width, rect.height);
    	var imageType = "image/jpeg";
    	var data = ctx.canvas.toDataURL(imageType);
    	downloadFile(data,imageType,"jpeg");
    }
    
    function downloadFile(text,uri,fileType,event) 
	{
		if(text && fileType)
		{
			var fileName = "Download(2.8.2019_12.17).jpeg";
			if ("Blob" in window) 
			{
				
				if ("msSaveOrOpenBlob" in window.navigator) 
				{
					var blobObject = null;
					if(text instanceof Blob)
					{
						blobObject = text;
					}
					else if(!(text instanceof ArrayBuffer) && text.indexOf("base64") > -1)
					{
						blobObject = dataURItoBlob(text);
					}
					else
					{
						blobObject = new Blob([text], { type: uri});
					}
					window.navigator.msSaveOrOpenBlob(blobObject,fileName);
				}
				else
				{
					var hrefvalue = null;
					if(text instanceof ArrayBuffer)
					{
						var blobObject = new Blob([text], {type: uri});
						hrefvalue = URL.createObjectURL(blobObject);
					}
					else if(text instanceof Blob)
					{
						hrefvalue = URL.createObjectURL(text);
					}
					else
					{
						if(text.indexOf("data:") === -1)
						{
							uri = "data:" + uri;
						}
						if(text.indexOf(";base64,") === -1)
						{
							var base64String = ";base64," + window.btoa(window.unescape(encodeURIComponent(text)));
							hrefvalue = uri + base64String;
						}
						else
						{
							hrefvalue = text;
						}
					}
					
				    var anchor = document.createElement("a");
				    if ("webkitURL" in window) 
				    {
				          // Chrome allows the link to be clicked without actually adding it to the DOM.
				    	//hrefvalue = window.webkitURL.createObjectURL([hrefvalue]);
				    }
				    else
				    {
				    	//hrefvalue = window.URL.createObjectURL([hrefvalue]);
				    	anchor.style.display = 'none';
				        document.body.appendChild(anchor);
				        this.util.addEvent(anchor,"click",function(event){
				    		document.body.removeChild(event.target);
				    	});
				    }
				    anchor.setAttribute("href",hrefvalue);
				    anchor.setAttribute("download",fileName);
				    anchor.setAttribute("target","_blank");
				    anchor.innerHTML = "Download File";
				    /*if(window.URL && window.URL.revokeObjectURL)
				    {
				    	window.URL.revokeObjectURL(hrefvalue);
				    }*/
				    anchor.click();
				    if(event)
				    {
				    	event.preventDefault();
				    }
				}
			}
		}
	}
    
    function dataURItoBlob(dataURI) 
	{
	    // convert base64/URLEncoded data component to raw binary data held in a string
	    var byteString = null;
	    var uintArray = null;
	    var mimeString = null;
	    if (dataURI.split(',')[0].indexOf('base64') >= 0)
	    {
	    	 byteString = window.atob(dataURI.split(',')[1]);
	    }
	    else
	    {
	    	 byteString = decodeURIComponent(dataURI.split(',')[1]);
	    }
	    // separate out the mime component
	    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	    // write the bytes of the string to a typed array
	    uintArray = new Uint8Array(byteString.length);
	    for (var count = 0; count < byteString.length; count++) 
	    {
	    	uintArray[count] = byteString.charCodeAt(count);
	    }
	
	    return new Blob([uintArray], {type:mimeString});
	}
    
    </script>

</body>
</html>