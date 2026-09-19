var NSImageProcessor = (function()
{
	function NSImageProcessor(setting)
	{
		var self = this;
		var util = null;
		var config = {};
		
		//adding below variables to control the functionality for later use 
		var enableUpload = false;
		var enableResize = false;
		var resizeInitialized = false;
		var enableMove = false;
		var moveInitialized = false;
		var enableCrop = false;
		var cropInitialized = false;
		var enableMagnify = false;
		var magnifyInitialized = false;
		
		var container = null;
		var menuContainer = null;
		var objState = {};
		var orignalImageParam = {};
		var objResizer = {nw:null,ne:null,sw:null,se:null};
		var resizeCanvas = null;
		var resizeClonedImage = null;
		var resizeTarget = null;
		var moveContainer = null;
		var cropperContainers = {orignalImage:null,image:null,croppedImage:null,outerContainer: null,container: null,imgContainer: null,
								 dragContainer: null,tracker: null,moveTracker: null,
								 dragBars:{},borders:{},handles:{}};
		var cropperVars = {xScale:0,yScale:0,zIndex:350,boundX:0,boundY:0};
		var cropCoords = {x1:0,y1:0,x2:0,y2:0,ox:0,oy:0};
		var cropBackgroundOpacity = 0.6;
		var magnifierContainers = {image:null,resultElement:null,lensElement:null};
		var magnifierVars = {ratioX:null,ratioY:null};
		var menuDefault = {
				move:{action:"move",title:"Move",html:"<i class='fa fa-arrows' aria-hidden='true'></i>",callback:function(event){
					hideResizer();
					hideCrop();
					hideMagnifier();
					initializeMove();
					showMove();
				}},
				crop:{action:"crop",title:"Crop",html:"<i class='fa fa-crop' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideResizer();
					hideMagnifier();
					initailizeCrop();
				}},
				resize:{action:"resize",title:"Resize",html:"<i class='fa fa-expand' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideCrop();
					hideMagnifier();
					initializeResize();
					showResizer();
				}},
				fullscreen:{action:"fullscreen",title:"Full Screen",html:"<i class='fa fa-play' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideResizer();
					hideCrop();
					hideMagnifier();
					fullScreen();
				}},
				zoomin:{action:"zoomin",title:"Zoom In",html:"<i class='fa fa-search-plus' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideResizer();
					//hideCrop();
					hideMagnifier();
					zoomIn();
				}},
				zoomout:{action:"zoomout",title:"Zoom Out",html:"<i class='fa fa-search-minus' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideResizer();
					//hideCrop();
					hideMagnifier();
					zoomOut();
				}},
				rotateleft:{action:"rotateleft",title:"Rotate Left",html:"<i class='fa fa-rotate-left' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideResizer();
					//hideCrop();
					hideMagnifier();
					rotateLeft();
				}},
				rotateright:{action:"rotateright",title:"Rotate Right",html:"<i class='fa fa-rotate-right' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideResizer();
					//hideCrop();
					hideMagnifier();
					rotateRight();
				}},
				fliphorizontal:{action:"fliphorizontal",title:"Flip Horizontal",html:"<i class='fa fa-arrows-h' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideResizer();
					//hideCrop();
					hideMagnifier();
					scaleX();
				}},
				flipvertical:{action:"flipvertical",title:"Flip Vertical",html:"<i class='fa fa-arrows-v' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideResizer();
					//hideCrop();
					hideMagnifier();
					scaleY();
				}},
				download:{action:"download",title:"Download",html:"<i class='fa fa-download' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideMagnifier();
					download();
				}},
				magnify:{action:"magnify",title:"Magnify",html:"<i class='fa fa-search' aria-hidden='true'></i>",callback:function(event){
					hideMove();
					hideResizer();
					hideCrop();
					initializeMagnifier();
				}},
		};
		var zooming = false;
		var rotating = false;
		var scaling = false;
		var animating = false;
		
		var documentMouseMoveRef = null;
		var documentMouseUpRef = null;
		var documentTouchMoveRef = null;
		var documentTouchEndRef = null;
		var documentClickRef = null;
		
		var initialize = function()
		{
			util = new NSUtil();
			if(!setting)
			{
				setting = {};
			}
			config = {
				element : setting["element"],
				image: setting["image"] || setting["element"],
				uploadUrl: setting["uploadUrl"],
				uploadUrlCallback: setting["uploadUrlCallback"],
				uploadName: setting["uploadName"],
				//should use this function if src is getting changed dynamically
				validateUploadNameCallback: setting["validateUploadNameCallback"],
				uploadSuccessCallback: setting["uploadSuccessCallback"],
				uploadFailureCallback: setting["uploadFailureCallback"],
				uploadProgressCallback: setting["uploadProgressCallback"],
				resizeShowOnClick: Boolean.parse(setting["resizeShowOnClick"]),
				resizeEnableConstrain: Boolean.parse(setting["resizeEnableConstrain"]),
				resizeShowResizers: setting["resizeShowResizers"],
				resizeMinWidth: setting["resizeMinWidth"] || 100,
				resizeMaxWidth: setting["resizeMaxWidth"] || 800,
				resizeMinHeight: setting["resizeMinHeight"] || 100,
				resizeMaxHeight: setting["resizeMaxHeight"] || 800,
				//if this flag is true then when the image resizes, image width changes else image base64 changes
				resizeMeasurement: Boolean.parse(setting["resizeMeasurement"]),
				showMenu: (util.isUndefinedOrNull(setting["showMenu"]) ? true : Boolean.parse(setting["showMenu"])),
				menus: setting["menus"],// can be object of items with action as key to override default HTML or title or array of string to take default html and title
				zoomMinRatio: setting["zoomMinRatio"] || 0.01,
				zoomMaxRatio: setting["zoomMaxRatio"] || 100,
				zoomRatio: setting["zoomRatio"] || 0.1,
				cropExpectedWidth: setting["cropExpectedWidth"] || 0,
				cropExpectedHeight: setting["cropExpectedHeight"] || 0,
				cropEnableMove: (util.isUndefinedOrNull(setting["cropEnableMove"]) ? true : Boolean.parse(setting["cropEnableMove"])),
				cropEnableResize: (util.isUndefinedOrNull(setting["cropEnableResize"]) ? true : Boolean.parse(setting["cropEnableResize"])),
				cropEnableSelect: (util.isUndefinedOrNull(setting["cropEnableSelect"]) ? true : Boolean.parse(setting["cropEnableSelect"])),
				cropDragBars: setting["cropDragBars"] || ["n","s","e","w"],
				cropHandles: setting["cropHandles"] || ["n","s","e","w","nw","ne","se","sw"],
				cropDisabledColor:setting["cropHandles"] || "black",
				cropMinX:setting["cropMinX"] || 0,
				cropMaxX:setting["cropMaxX"] || 0,
				cropMinY:setting["cropMinY"] || 0,
				cropMaxY:setting["cropMaxY"] || 0,
				cropAspectRatio:setting["cropAspectRatio"] || 0,
				cropSelectingCallback: setting["cropSelectingCallback"],
				cropSelectedCallback: setting["cropSelectedCallback"],
				cropReleasedCallback: setting["cropReleasedCallback"],
				cropPreviewImages: setting["cropPreviewImages"],
				magnifyProps:setting["magnifyProps"] || {resultElement:null},
				menuWidth: setting["menuWidth"] || 33,
			};
			resizeCanvas = util.createElement("canvas");
			setImageOrignalParam(); 
			createMenu();
			var resizeImage = config.image;
			documentClickRef = function(event){
				if(enableResize && config.resizeShowOnClick)
				{
					hideResizer();
				}
				if(config.showMenu)
	        	{
					hideMenu(event);
					hideResizer();
					hideCrop();
					hideMagnifier();
	        	}
			};
			util.addEvent(resizeImage,"click",function(event){
				event = util.getEvent(event);
				if(config.showMenu)
	        	{
					showMenu(event);
					event.stopPropagation();
	        	}
				else if(enableResize && config.resizeShowOnClick)
				{
					showResizer();
					event.stopPropagation();
				}
			});
    		util.addEvent(document,"click",documentClickRef);
		};
		
		var setImageOrignalParam = function()
		{
			if(config.image)
			{
				handleImageForOrigin(config.image);
				var image = config.image;
				var rect = image.getBoundingClientRect();
				orignalImageParam = rect;
				orignalImageParam.naturalWidth = image.naturalWidth;
				orignalImageParam.naturalHeight = image.naturalHeight;
				orignalImageParam.style = image.style;
				orignalImageParam.src = image.src;
				orignalImageParam.image = image;
				orignalImageParam.parentNode = image.parentNode;
			}
		};
		
		var uploadImage = function()
		{
			enableUpload = true;
			if(enableUpload)
			{
				if(config.element)
				{
					var uploadImageToServer = function(strBase64)
	            	{
						if(strBase64)
						{
							strBase64 = strBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
		                    var param = {imageData:encodeURIComponent(strBase64),fileName:encodeURIComponent(fileName)};
		                    var header = {"Content-Type": "application/x-www-form-urlencoded"};
		                    var setting = {header:header};
							var ajax = new NSAjax();
							ajax.post(url,param,setting).then(
									function(response) 
									{
										config.uploadSuccessCallback && config.uploadSuccessCallback(response,self);
				                    	setImageOrignalParam();
									},
									function(response) 
									{ 
										config.uploadFailureCallback && config.uploadFailureCallback(response,self);
									}
							);
							
		                    /*var setting = {method:"POST",url:url,param:param,header:header,successHandler:function(response){
		                    	config.uploadSuccessCallback && config.uploadSuccessCallback(response,self);
		                    	setImageOrignalParam();
		                    },errorHandler:function(response){
		                    	config.uploadFailureCallback && config.uploadFailureCallback(response,self);
		                    },progressHandler:function(loaded,total){
		                    	config.uploadProgressCallback && config.uploadProgressCallback(loaded,total,self);
		                    }};
		                    var ajax = new util.ajax(setting);*/
						}
	            	};
					
					var element = config.element;
					if(element["nodeName"] && element["nodeName"].toLowerCase() === "img")
	            	{
						var src = element.getAttribute("src");
						if(src)
						{
							if(src.startsWith("data"))
							{
								uploadImageToServer(src);
								return;
							}
						}
	            	}
					var url = config.uploadUrl;
					var fileName = getFileName();
					if(!url && config.uploadUrlCallback)
					{
						var fileType = getFileType();
						url = config.uploadUrlCallback(fileName,fileType,self);
					}
					getBase64(uploadImageToServer);
				}
			}
		};
		
		var getBase64 = function(callback)
        {
			var element = config.element;
        	if(element)
        	{
        		var callCallback = function(strBase64)
        		{
        			if(callback)
        			{
        				callback(strBase64,self);
        			}
        		};
        		var getImageBase64 = function()
        		{
        			var fileType = getFileType();
        			var path = element.src;
        			var image = document.createElement('img');
                    document.body.appendChild(image);
                    image.setAttribute("style","display:none");
                    image.setAttribute("src", path);
                    var imgCanvas = document.createElement("canvas");
                    var imgContext = imgCanvas.getContext("2d");
                    imgCanvas.width = image.width;
                    imgCanvas.height = image.height;
                    imgContext.drawImage(image, 0, 0, image.width, image.height);
                    var base64String = null;
                    base64String = imgCanvas.toDataURL(fileType);
                    document.body.removeChild(image);
                    callCallback(base64String);
        		};
        		var getFileBase64 = function()
        		{
        			var reader = new FileReader();
            		reader.readAsDataURL(element);
            		if(reader.result)
            		{
            			callCallback(reader.result);
            		}
            		else
            		{
            			reader.onload = function () 
            			{
            				callCallback(reader.result);
                 		};
                 		reader.onerror = function (error) 
                 		{
                 			if(config.uploadFailureCallback)
                 			{
                 				config.uploadFailureCallback(error,self);
                 			}
               		     	//console.log('Error: ', error);
               		    };
            		}
        		};
        		if(element["nodeName"] && element["nodeName"].toLowerCase() === "img")
            	{
        			getImageBase64();
            	}
        		else if(element instanceof File)
            	{
        			getFileBase64();
            	}
        	}
        };
        
        var getThumbnail = function(strBase64, height, width, callback) 
        {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var image = new Image();
            image.src = strBase64;
            image.onload = function() 
            {
                ctx.drawImage(image, 0, 0, width, height);
                callback && callback(canvas.toDataURL(),self);
            };
        };
        
        var initailizeCrop = function()
		{
			enableCrop = true;
			if(enableCrop && !cropInitialized)
			{
				cropInitialized = true;
				createCropContainers();
			}
		};
        
        var initializeResize = function()
        {
        	enableResize = true;
        	if(enableResize)
        	{
        		if(!config.resizeShowResizers || config.resizeShowResizers.length === 0)
        		{
        			config.resizeShowResizers = ["NW","NE","SW","SE"];
        		}
        		var resizeImage = config.image;
            	if(resizeImage && resizeImage["nodeName"] && resizeImage["nodeName"].toLowerCase() === "img")
            	{
            		resizeInitialized = true;
            		var position = util.getStyleValue(resizeImage,"position",true);
            		if(position === "absolute")
            		{
            			console.warn("NSImageProcessor:Image has position as absolute which might show unexpected behaviour while resizing");
            		}
            		if (position === "static") 
            		{
            			resizeImage.style.position = "relative";
            		}
            		if(!config.resizeShowOnClick && !config.showMenu)
            		{
            			showResizer();
            		}
            	}
            	
        	}
        	config.image.style.transform = null;
        };
        
        var initializeMove = function()
        {
        	enableMove = true;
        	if(enableMove && !moveInitialized)
        	{
        		var moveImage = config.image;
            	if(moveImage && moveImage["nodeName"] && moveImage["nodeName"].toLowerCase() === "img")
            	{
            		if(!config.showMenu)
            		{
            			showMove();
            		}
            	}
            	moveInitialized = true;
        	}
        };
        
        var zoomIn = function()
        {
        	zoom(0.1);
        };
        
        var zoomOut = function()
        {
        	zoom(-0.1);
        };
        
        var rotateLeft = function()
        {
        	rotateTo(-90);
        };
        
        var rotateRight = function()
        {
        	rotateTo(90);
        };
        
        var flipHorizontal = function()
        {
        	scaleX();
        };
        
        var flipVertical = function()
        {
        	scaleY();
        };
        
        var fullScreen = function()
        {
        	var image = config.image;
        	if(image)
        	{
        		util.addStyleClass("nsImageFullscreen");
        	}
        	if (image.requestFullscreen) 
        	{
        		image.requestFullscreen();
            }
            else if (image.msRequestFullscreen) 
            {
            	image.msRequestFullscreen();               
            }
            else if (image.mozRequestFullScreen) 
            {
            	image.mozRequestFullScreen();      
            }
            else if (image.webkitRequestFullscreen) 
            {
            	image.webkitRequestFullscreen();       
            } 
            else 
            {
                console.error("NSImageProcessor:Fullscreen is not supported on your browser");
            } 
        };
        
        var download = function(option)
        {
        	var orignalImage = config.image;
        	if(orignalImage)
        	{
        		option = option || {};
        		var image = orignalImage;
        		var canvas = null;
    			var ctx = null;
    			var initializeCanvas = function(tempImage,innerPoint)
    			{
    				console.log(innerPoint);
    				console.log(orignalImage);
    				canvas = util.createElement("canvas");
        			ctx = canvas.getContext("2d");
        			canvas.width = innerPoint.canvasWidth;
                    canvas.height = innerPoint.canvasHeight;
        			if (option.backgroundColor) 
        			{
        				ctx.fillStyle = option.backgroundColor;
        				ctx.fillRect(0, 0,innerPoint.canvasWidth,innerPoint.canvasHeight);
        			}
			        ctx.drawImage(tempImage,innerPoint.x,innerPoint.y,innerPoint.width,innerPoint.height,innerPoint.cx,innerPoint.cy,innerPoint.canvasWidth,innerPoint.canvasHeight);
			        return canvas.toDataURL();
    			};
        		if(cropInitialized)
        		{
        			point = getCropFixed();
            		point = getUnscaledObject(point);
        			var croppedImage = cropperContainers.croppedImage;
        			var width = point.x2 - point.x1;
        	        var height = point.y2 - point.y1;
        	        var canvasWidth = point.width || width;
                    var canvasHeight = point.height || height;
                    var src = initializeCanvas(croppedImage,{x:point.x1,y:point.y1,width:width,height:height,cx:0,cy:0,canvasWidth:canvasWidth,canvasHeight:canvasHeight});
        			image = new Image();
        			image.src = src;
        			image.alt = orignalImage.alt;
        		}
        		else if(config.resizeMeasurement)
        		{
        			image = new Image();
        			handleImageForOrigin(image,orignalImage.src);
        			image.alt = orignalImage.alt;
        			var fileType = getFileType();
        			var width = orignalImage.clientWidth;
        			var height = orignalImage.clientHeight;
        			var src = initializeCanvas(image,{x:0,y:0,width:width,height:height,cx:0,cy:0,canvasWidth:width,canvasHeight:height});
        			image.src = src;
        		}
        		var anchor = util.createElement("a");
        		anchor.href = image.src;
        		anchor.download = option.fileName || image.alt;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
        	}
        };
        
        var cropSetSelect = function(point)
        {
        	hideMove();
			hideResizer();
			initailizeCrop();
        	if(enableCrop && cropInitialized)
			{
	        	if(point)
	        	{
	        		var scaledPoint = {};
	        		scaledPoint.x = point.x1 / cropperVars.xScale;
	        		scaledPoint.y = point.y1 / cropperVars.yScale;
	        		scaledPoint.x2 = point.x2 / cropperVars.xScale;
	        		scaledPoint.y2 = point.y2 / cropperVars.yScale;
	        		refreshCropHandles(scaledPoint);
	        		cropFireSelectCallback(config.cropSelectedCallback);
	        		setCropHandlesEnability(true);
	        	}
			}
        };
        
        var destroy = function()
        {
        	hideResizer();
        	if(documentClickRef)
        	{
        		util.removeEvent(document,"click",documentClickRef);
            	documentClickRef = null;
        	}
        };
        
        var zoom = function(ratio,event)
        {
        	var image = config.image;//getImage();
    		var rect = image.getBoundingClientRect();
        	ratio = Number(ratio);
        	if (ratio < 0) 
        	{
                ratio = 1 / (1 - ratio);
            } 
        	else 
        	{
                ratio = 1 + ratio;
            }
        	ratio = (rect.width * ratio / image.naturalWidth);
        	zoomTo(image,ratio,event);
        };
        
        var zoomTo = function(image,ratio,event)
        {
        	//for some reason the transition call back is not working for the first time in zooming
        	//if(!animating)
        	//{
	        	if(util.isNumber(ratio))
	        	{
	        		addTransition(image,function(tempEvent){
	        			zooming = false;
	        			updateCropContainers();
	        		});
	        		var rect = image.getBoundingClientRect();
	        		var minZoomRatio = Math.max(0.01, config.zoomMinRatio);
	                var maxZoomRatio = Math.min(100, config.zoomMaxRatio);
	                ratio = Math.min(Math.max(ratio, minZoomRatio), maxZoomRatio);
	                if (event && ratio > 0.95 && ratio < 1.05) 
	                {
	                    ratio = 1;
	                }
	                var newWidth = image.naturalWidth * ratio;
	                var newHeight = image.naturalHeight * ratio;
	                var oldRatio = rect.width / image.naturalWidth;
	                var left = rect.left;
	                var top = rect.top;
	                if(event)
	                {
	                	
	                }
	                else
	                {
	                	left -=  (newWidth - rect.width) / 2;
	                	top -=  (newHeight - rect.height) / 2;
	                }
	                //image.style.marginLeft = left + "px";
	                //image.style.marginTop = top + "px";
	                setImageMeasurement(newWidth,newHeight,image);
	                zooming = true;
	        	}
        	//}
        };
        
        var rotateTo = function(degree) 
        {
        	if(!animating)
        	{
        		if(util.isNumber(degree))
	        	{
	        		var image = config.image;
	        		addTransition(image,function(tempEvent){
	        			rotating = false;
	        			hideCrop();
	        		});
	            	var rotateValue = getTransformValue(image)["rotate"];
	            	degree = ((rotateValue || 0) + Number(degree));
	            	setTransformValue(image,"rotate",rotateValue + "deg",degree + "deg");
	            	rotating = true;
	        	}
        	}
        };
        
        var scaleX = function()
        {
        	scale("X");
        };
        
        var scaleY = function()
        {
        	scale("Y");
        };
        
        var scale = function(axis)
        {
        	if(!animating)
        	{
        		if(axis)
	        	{
	        		var image = config.image;
	        		addTransition(image,function(tempEvent){
	        			scaling = false;
	        			hideCrop();
	        		});
	        		var propName = "scale" + axis.toUpperCase();
	            	var oldValue = getTransformValue(image)[propName];
	            	var scaleValue = (-1 * (oldValue || 1));
	            	setTransformValue(image,propName,oldValue,scaleValue);
	            	scaling = true;
	        	}
        	}
        };
        
        var setTransformValue = function(image,propName,oldValue,newValue)
        {
        	var transform = image.style.transform;
        	if(transform)
        	{
        		var newPropValue = propName + "(" + newValue + ")";
        		if(transform.indexOf(propName) === -1)
        		{
        			transform += " " + newPropValue;
        		}
        		else
        		{
        			var existingValue = propName + "(" + oldValue + ")";
        			transform = transform.replaceAll(existingValue, newPropValue);
        		}
        	}
        	else
        	{
        		transform = " " + propName + "(" + newValue + ")";
        	}
        	if(transform)
        	{
        		image.style.transform = transform;
        	}
        };
        
        var getTransformValue = function(element)
        {
        	var retValue = {};
			var transform = element.style.transform;
			if(transform)
			{
				var numberPattern = /[+-]?\d+(?:\.\d+)?/g;
				var arrTrans = transform.split(" ");
				if(arrTrans && arrTrans.length > 0)
				{
					for(var count = 0;count < arrTrans.length;count++)
					{
						var arrDegree = arrTrans[count].split("(");
						if(arrDegree && arrDegree.length > 1)
						{
							var value = arrDegree[1].match(numberPattern).join([]);
							retValue[arrDegree[0]] = parseInt(value);
						}
					}
				}
			}
			return retValue;
        };
        
        var addTransition = function(image,callback)
        {
        	var transition = new util.transition(image,function(event){
    			util.removeStyleClass(image,"nsImageTransition");
    			transition.removeListener();
    			animating = false;
    			if(callback)
    			{
    				callback(event);
    			}
    		});
    		util.addStyleClass(image,"nsImageTransition");
    		animating = true;
        };
        
        var createMenu = function()
        {
        	if(config.showMenu)
        	{
        		menuContainer = util.createDiv(null,"nsImageToolbar nsImageHidden");
        		var createComponent = function(item)
        		{
        			if(item)
        			{
        				var button = util.createElement("button",null,"nsImageToolbarButton");
        				button.setAttribute("data-nsAction",item.action);
        				button.setAttribute("title",item.title);
        				button.innerHTML = item.html;
        				util.addEvent(button,"click",function(event){
        					menuClickHandler(item,event);
        				});
        				menuContainer.appendChild(button);
        			}
        		};
        		var menus = config.menus;
        		if(!menus || (util.isArray(menus) && menus.length > 0))
        		{
        			menus = menuDefault;
        		}
        		if(util.isArray(config.menus))
        		{
        			for(var count = 0;count < config.menus.length; count++)
        			{
        				var item = menuDefault[config.menus[count].toLowerCase()];
        				createComponent(item);
        			}
        		}
        		else
        		{
        			for(var menuKey in menus)
        			{
        				var item = menuDefault[menuKey.toLowerCase()];
        				if(item)
        				{
        					if(menus[menuKey].hasOwnProperty("title"))
        					{
        						item.title = menus[menuKey].title;
        					}
        					if(menus[menuKey].hasOwnProperty("html"))
        					{
        						item.html = menus[menuKey].html;
        					}
        					createComponent(item);
        				}
        			}
        		}
        		document.body.appendChild(menuContainer);
        	}
        };
        
        var menuClickHandler = function(item,event)
        {
        	event = util.getEvent(event);
        	event.stopPropagation();
        	if(item && item["callback"])
        	{
        		item["callback"](event);
        	}
        };
        
        var showResizer = function()
        {
        	if(enableResize && resizeInitialized)
        	{
        		createContainer();
	        	util.addStyleClass(container,"nsImageResizeEnabled");
	    		var resizeImage = config.image;
	    		//as crop functionality sets height 
	    		resizeImage.style.height = null;
	    		addImageToContainer();
	    		var createResizer = function(postion,classEnd)
        		{
        			objResizer[postion] = util.createElement("span",null,"nsImageResizeHandle nsImageResizeHandle" + classEnd);
        			container.appendChild(objResizer[postion]);
                	util.addEvent(objResizer[postion],"mousedown",startResize);
                	util.addEvent(objResizer[postion],"touchstart",startResize);
                	util.addEvent(objResizer[postion],"click",stopPropagation);
        		};
        		for(var count = 0;count < config.resizeShowResizers.length;count++)
        		{
        			var pos = config.resizeShowResizers[count];
        			if(!objResizer[pos])
        			{
        				createResizer(pos.toLowerCase(),pos.toUpperCase());
        			}
        		}
        	}
        };
        
        var hideResizer = function()
        {
        	if(enableResize && resizeInitialized)
        	{
	        	util.removeStyleClass(container,"nsImageResizeEnabled");
	        	removeImageFromContainer();
	        	for(var pos in objResizer)
	    		{
	    			if(objResizer[pos] && objResizer[pos].parentNode)
	    			{
	    				objResizer[pos].parentNode.removeChild(objResizer[pos]);
	    			}
	    		}
	        	objResizer = {nw:null,ne:null,sw:null,se:null};
	        	if(container && container.parentNode)
	        	{
	        		container.parentNode.removeChild(container);
	        	}
	        	container = null;
	        	resizeInitialized = false;
        	}
        };
        
        var showMove = function()
        {
        	if(enableMove)
        	{
        		var moveImage = config.image;
	        	if(container && container.parentNode)
	    		{
	        		moveContainer = container;
	    		}
	        	else
	        	{
	        		moveContainer = moveImage;
	        	}
	        	util.addStyleClass(moveContainer,"nsImageMoveContainer");
	        	util.addEvent(moveImage,"mousedown",startMoving);
	    		util.addEvent(moveImage,"touchstart",startMoving);
        	}
        };
        
        var hideMove = function()
        {
        	if(enableMove)
        	{
        		if(moveContainer)
            	{
            		var moveImage = config.image;
                	util.removeStyleClass(moveContainer,"nsImageMoveContainer");
                	util.removeEvent(moveImage,"mousedown",startMoving);
            		util.removeEvent(moveImage,"touchstart",startMoving);
            		moveContainer = null;
            	}
        	}
        };
        
        var showMenu = function(event)
        {
        	if(config.showMenu)
        	{
        		util.removeStyleClass(menuContainer,"nsImageHidden");
            	var moveImage = config.image;
            	var parent = getImageParentContainer();
            	if(!parent)
            	{
            		parent = moveImage;
            	}
            	var rect = parent.getBoundingClientRect();
            	var menuRect = menuContainer.getBoundingClientRect();
            	var position = util.getEventPosition(event);
            	var top = rect.top + rect.height;
            	var left = rect.left + (rect.width / 2) - (menuRect.width / 2);
            	var arrToolButtons = menuContainer.querySelectorAll("button.nsImageToolbarButton");
            	var width = (arrToolButtons.length * config.menuWidth);
            	menuContainer.style.left = left + "px";
            	menuContainer.style.top = top + "px";
            	menuContainer.style.width = width + "px";
        	}
        };
        
        var hideMenu = function(event)
        {
        	if(config.showMenu)
        	{
        		util.addStyleClass(menuContainer,"nsImageHidden");
        	}
        };
        
        var addImageToContainer = function()
        {
        	var resizeImage = config.image;
        	if(!util.isChildInParent(container,resizeImage))
        	{
        		resizeClonedImage = new Image();
            	resizeClonedImage.src = resizeImage.src;
            	resizeImage.parentNode.insertBefore(container,resizeImage);
            	resizeImage.parentNode.removeChild(resizeImage);
            	container.appendChild(resizeImage);
            	container.style.left = resizeImage.style.left;
            	container.style.top = resizeImage.style.top;
            	resizeImage.style.left = null;
            	resizeImage.style.top = null;
        	}
        	return container;
        };
        
        var removeImageFromContainer = function()
        {
        	var resizeImage = config.image;
        	var imageParentContainer = container;
        	if(container && container.parentNode && util.isChildInParent(container,resizeImage))
        	{
        		var resizeImage = config.image;
            	container.parentNode.insertBefore(resizeImage,container);
            	container.parentNode.removeChild(container);
            	resizeImage.style.left = container.style.left;
            	resizeImage.style.top = container.style.top;
        	}
        };
        
        var startMoving = function(event)
        {
        	event = util.getEvent(event);
        	resizeTarget = util.getTarget(event);
        	event.preventDefault();
        	event.stopPropagation();
        	hideMenu(event);
		    saveState(event,moveContainer);
		    addDocumentHandler(moving,endMoving);
		};
		
		var endMoving = function(event)
		{
			resizeTarget = null;
			objState = {};
			showMenu(event);
			event.preventDefault();
			removeDocumentHandler();
		};
		
		var moving = function(event)
		{
			var mousePos = {};
			event.preventDefault();
			event.stopPropagation();
			var touches = event.touches;
			var windowTop  = window.pageYOffset || document.documentElement.scrollTop;
		    var windowLeft = window.pageXOffset || document.documentElement.scrollLeft; 
		    mousePos.x = (event.clientX || event.pageX || touches[0].clientX) + windowLeft; 
		    mousePos.y = (event.clientY || event.pageY || touches[0].clientY) + windowTop;
		    var offset = {
		    	'left': mousePos.x - (objState.mouse_x - objState.container_left),
			    'top': mousePos.y - (objState.mouse_y - objState.container_top) 
		    };
		    util.setOffSet(moveContainer,offset);
		    //handling pinch zoom gesture while moving
		    if(objState.touches && objState.touches.length > 1 && touches.length > 1)
		    {
		    	 var width = objState.container_width;
		    	 var height = objState.container_height;
			     var clientX = objState.touches[0].clientX - objState.touches[1].clientX;
			     clientX = clientX * clientX; 
			     var clientY = objState.touches[0].clientY - objState.touches[1].clientY;
			     clientY = clientY * clientY; 
			     var dist1 = Math.sqrt(clientX + clientY);
			      
			     clientX = event.touches[0].clientX - touches[1].clientX;
			     clientX = clientX * clientX; 
			     clientY = event.touches[0].clientY - touches[1].clientY;
			     clientY = clientY * clientY;
			     var dist2 = Math.sqrt(clientX + clientY);

			     var ratio = dist2 /dist1;

			     width = width * ratio;
			     height = height * ratio;
			     // To improve performance you might limit how often setImageMeasurement() is called
			     setImageMeasurement(width, height,resizeClonedImage);
		    }
		};
        
        var startResize = function(event)
        {
        	event = util.getEvent(event);
        	resizeTarget = util.getTarget(event);
        	event.preventDefault();
        	event.stopPropagation();
        	hideMenu(event);
        	saveState(event,container);
        	addDocumentHandler(resizing,endResize);
		};
		
		var endResize = function(event)
		{
			resizeTarget = null;
			objState = {};
			showMenu(event);
			event.preventDefault();
			removeDocumentHandler();
		};
		
		var resizing = function(event)
		{
			if(resizeTarget)
			{
				var mousePos = {};
				var width,height,left,top;
				var windowTop  = window.pageYOffset || document.documentElement.scrollTop;
			    var windowLeft = window.pageXOffset || document.documentElement.scrollLeft; 
			    mousePos.x = (event.clientX || event.pageX || event.touches[0].clientX) + windowLeft; 
			    mousePos.y = (event.clientY || event.pageY || event.touches[0].clientY) + windowTop;
			    if(resizeTarget == objResizer.se)
			    {
			    	width = mousePos.x - objState.container_left;
				    height = mousePos.y  - objState.container_top;
				    left = objState.container_left;
				    top = objState.container_top;
			    }
			    else if(resizeTarget == objResizer.sw)
			    {
			    	width = objState.container_width - (mousePos.x - objState.container_left);
				    height = mousePos.y - objState.container_top;
				    left = mousePos.x;
				    top = objState.container_top;
			    }
			    else if(resizeTarget == objResizer.nw)
			    {
			    	width = objState.container_width - (mousePos.x - objState.container_left);
				    height = objState.container_height - (mousePos.y - objState.container_top);
				    left = mousePos.x;
				    top = mousePos.y;
				    if(config.resizeEnableConstrain || event.shiftKey)
				    {
				        top = mousePos.y - ((width / resizeClonedImage.width * resizeClonedImage.height) - height);
				    }
			    }
			    else if(resizeTarget == objResizer.ne)
			    {
			    	width = mousePos.x - objState.container_left;
				    height = objState.container_height - (mousePos.y - objState.container_top);
				    left = objState.container_left;
				    top = mousePos.y;
				    if(config.resizeEnableConstrain || event.shiftKey)
				    {
				        top = mousePos.y - ((width / resizeClonedImage.width * resizeClonedImage.height) - height);
				    }
			    }
			    // Optionally maintain aspect ratio
			    if(config.resizeEnableConstrain || event.shiftKey)
			    {
			    	height = width / resizeClonedImage.width * resizeClonedImage.height;
			    }
			    if(width > config.resizeMinWidth && height > config.resizeMinHeight && width < config.resizeMaxWidth && height < config.resizeMaxHeight)
			    {
			    	setImageMeasurement(width, height,resizeClonedImage); 
			    	util.setOffSet(container,{left:left,top:top});
			    }
			}
		};
		
		var setImageMeasurement = function(width, height,image)
		{
			var resizeImage = config.image;
			if(config.resizeMeasurement)
			{
				resizeImage.style.width = width + "px";
			}
			else
			{
				var fileTye = getFileType();
				resizeCanvas.width = width;
				resizeCanvas.height = height;
				resizeCanvas.getContext("2d").drawImage(image, 0, 0, width, height);   
				resizeImage.setAttribute("src",resizeCanvas.toDataURL(fileTye));
			}
		};
		
		var saveState = function(event,tempContainer)
		{
			var objContainer = tempContainer.getBoundingClientRect();
			objState.container_width = objContainer.width;
		    objState.container_height = objContainer.height;
		    objState.container_left = objContainer.left; 
		    objState.container_top = objContainer.top;
		    var windowTop  = window.pageYOffset || document.documentElement.scrollTop;
		    var windowLeft = window.pageXOffset || document.documentElement.scrollLeft; 
		    objState.mouse_x = (event.clientX || event.pageX || event.touches[0].clientX) + windowLeft; 
		    objState.mouse_y = (event.clientY || event.pageY || event.touches[0].clientY) + windowTop;
			
			// This is a fix for mobile safari
			// For some reason it does not allow a direct copy of the touches property
			if(typeof event.touches !== 'undefined')
			{
				objState.touches = [];
				for(var count = 0;count < event.touches;count++)
				{
					var touch = event.touches[count];
					objState.touches[count] = {};
					objState.touches[count].clientX = 0 + touch.clientX;
					objState.touches[count].clientY = 0 + touch.clientY;
				}
			}
		    objState.evnt = event;
		};
		
		var addDocumentHandler = function(moveHandler,endHandler)
		{
			if(!documentMouseMoveRef)
			{
				documentMouseMoveRef = moveHandler;
				util.addEvent(document.documentElement,"mousemove",documentMouseMoveRef);
				
			}
			if(!documentMouseUpRef)
			{
				documentMouseUpRef = endHandler;
				util.addEvent(document.documentElement,"mouseup",documentMouseUpRef);
			}
			if(!documentTouchMoveRef)
			{
				documentTouchMoveRef = moveHandler;
				util.addEvent(document.documentElement,"touchmove",documentTouchMoveRef);
				
			}
			if(!documentTouchEndRef)
			{
				documentTouchEndRef = endHandler;
				util.addEvent(document.documentElement,"touchend",documentTouchEndRef);
				
			}
		};
		
		var removeDocumentHandler = function()
		{
			if(documentMouseMoveRef)
			{
				util.removeEvent(document.documentElement,"mousemove",documentMouseMoveRef);
				documentMouseMoveRef = null;
			}
			if(documentMouseUpRef)
			{
				util.removeEvent(document.documentElement,"mouseup",documentMouseUpRef);
				documentMouseUpRef = null;
			}
			if(documentTouchMoveRef)
			{
				util.removeEvent(document.documentElement,"touchmove",documentTouchMoveRef);
				documentTouchMoveRef = null;
			}
			if(documentTouchEndRef)
			{
				util.removeEvent(document.documentElement,"touchend",documentTouchEndRef);
				documentTouchEndRef = null;
			}
		};
		
		var createCropContainers = function()
		{
			if(enableCrop && cropInitialized)
        	{
				var image = config.image;
				//to remove any transform added as result of rotate and flip functionality
				image.style.transform = null;
				var rect = image.getBoundingClientRect();
				handleImageForOrigin(image);
				var width = 0;
				var height = 0;
				if(rect.width == 0 || rect.height == 0)
				{
					var tempImage = new Image();
					var tempRect = tempImage.getBoundingClientRect();
				    tempImage.setAttribute("src",image.getAttribute("src"));
				    width = tempRect.width;
				    height = tempRect.height;
				}
				else
				{
					width = rect.width;
				    height = rect.height;
				}
				var orignalImage = image.cloneNode(true);
				orignalImage.removeAttribute("id");
				image.style.width = width + "px";
				//image.style.height = height + "px";
				util.addStyleClass(image,"nsImageCloned");
				var prop = setPreCropSize(image,config.cropExpectedWidth,config.cropExpectedHeight,width,height,true);
				var newWidth = prop.width;
				var newHeight = prop.height;
				var outerContainer = createContainer();
				addImageToContainer();
				util.addStyleClass(outerContainer, "nsImageCropperOuterContainer");
				util.css(outerContainer,{"background-color": config.cropDisabledColor,width: newWidth + "px",height: newHeight + "px"});
				var imageCropperContainer = util.createDiv(null,"nsImageCropperContainer");
				outerContainer.appendChild(imageCropperContainer);
				var imageContainer = util.createDiv(null,"nsImageCropperImageContainer");
				imageCropperContainer.appendChild(imageContainer);
				var dragContainer = util.createDiv(null,"nsImageCropperDragContainer nsImageHidden");
				imageCropperContainer.appendChild(dragContainer);
				outerContainer.appendChild(imageCropperContainer);
				var boundary = 2;
				var tracker = util.createDiv(null,"nsImageCropperTracker"); 
				tracker.style.width = (newWidth + (boundary * 2)) + "px";
				tracker.style.height = (newHeight + (boundary * 2)) + "px";
				tracker.style.top = (-1 * boundary) + "px";
				tracker.style.left = (-1 * boundary) + "px";
				util.addEvent(tracker,"mousedown",cropNewSelection);
				util.addEvent(tracker,"touchstart",cropNewSelection);
				util.addEvent(tracker,"click",stopPropagation);
				outerContainer.appendChild(tracker);
				
				var croppedImage = util.createElement("img",null,"nsImageCloned");
				croppedImage.style.width = newWidth + "px";
				//croppedImage.style.height = newHeight + "px";
				var src = image.getAttribute("src");
				handleImageForOrigin(croppedImage,src);
				croppedImage.setAttribute("src",src);
				imageContainer.appendChild(croppedImage);
				
				cropperVars.docOffset = util.getOffSet(image);
				cropperVars.boundX = newWidth;
				cropperVars.boundY = newHeight;
				cropperVars.orignalWidth = newWidth;
				cropperVars.orignalHeight = newHeight;
				cropperContainers = {orignalImage:orignalImage,image:image,croppedImage:croppedImage,outerContainer: outerContainer,container: imageCropperContainer,
									 imgContainer: imageContainer,dragContainer: dragContainer,tracker: tracker,moveTracker:null,dragBars:{},borders:{},handles:{}};
				createCropDragbars();
				createCropHandles();
				createCropBorders();
				
				if(config.cropEnableMove)
				{
					var mouseDownHandler = function(event)
					{
						return handleDragMouseDownHandler(event,"move");
					};
					var moveTracker = util.createDiv(null,"nsImageCropperTracker nsImageCropperMoveTracker");
					util.addEvent(moveTracker,"mousedown",mouseDownHandler);
					util.addEvent(moveTracker,"touchstart",mouseDownHandler);
					util.addEvent(moveTracker,"click",stopPropagation);
					imageContainer.appendChild(moveTracker);
					cropperContainers.moveTracker = moveTracker;
				}
				
				initializeCropPreviewImages(image);
        	}
		};
		
		var updateCropContainers = function()
		{	
			if(enableCrop && cropInitialized)
        	{
				var image = cropperContainers.image;
				var rect = image.getBoundingClientRect();
				var prop = setPreCropSize(image,config.cropExpectedWidth,config.cropExpectedHeight,rect.width,rect.height,false);
				var newWidth = prop.width;
				var newHeight = prop.height;
				//cropperContainers.outerContainer.style.width = newWidth + "px";
				//cropperContainers.outerContainer.style.height = newHeight + "px";
				var boundary = 2;
				cropperContainers.tracker.style.width = (newWidth + (boundary * 2)) + "px";
				cropperContainers.tracker.style.height = (newHeight + (boundary * 2)) + "px";
				cropperContainers.croppedImage.style.width = newWidth + "px";
				//cropperContainers.croppedImage.style.height = newHeight + "px";
				cropperVars.boundX = newWidth;
				cropperVars.boundY = newHeight;
				cropperVars.orignalWidth = newWidth;
				cropperVars.orignalHeight = newHeight;
				updateCropSelection(false);
        	}
		};
		
		var hideCrop = function()
		{
			if(enableCrop && cropInitialized)
        	{
				var removeChild = function(node)
				{
					if(node && node.parentNode)
					{
						node.parentNode.removeChild(node);
					}
				};
				var image = config.image;
	        	util.removeStyleClass(container,"nsImageCropperOuterContainer");
	        	util.removeStyleClass(image,"nsImageCloned");
	        	removeImageFromContainer();
	        	removeChild(cropperContainers.container);
	        	removeChild(cropperContainers.tracker);
	        	cropperContainers = {orignalImage:null,image:null,croppedImage:null,outerContainer:null,container:null,
						 imgContainer: null,dragContainer: null,tracker: null,moveTracker:null,dragBars:{},borders:{},handles:{}};
	        	cropperVars = {xScale:0,yScale:0,zIndex:350,boundX:0,boundY:0};
	    		cropCoords = {x1:0,y1:0,x2:0,y2:0,ox:0,oy:0};
	    		image.style.opacity = null;
	    		removeChild(container);
	    		container = null;
	        	cropInitialized = false;
        	}
		};
		
		var createCropDragbars = function()
		{
			if (config.cropDragBars && config.cropDragBars.length > 0)
			{
				for(var count = 0;count < config.cropDragBars.length;count++)
				{
					var div = createCropHandleDragbarsComp(config.cropDragBars[count],cropperVars.zIndex++,"nsImageDragBar nsImageDragBar-");
					cropperContainers.dragBars[config.cropDragBars[count]] = div;
				}
			}
		};
		
		var createCropHandles = function()
		{
			if (config.cropHandles && config.cropHandles.length > 0)
			{
				var handleOpacity = 0.5;
				for(var count = 0;count < config.cropHandles.length;count++)
				{
					var div = createCropHandleDragbarsComp(config.cropHandles[count],cropperVars.zIndex++,"nsImageHandle nsImageHandle-");
					div.style.opacity = handleOpacity;
					cropperContainers.handles[config.cropHandles[count]] = div;
				}
			}
		};
		
		var createCropBorders = function()
		{
			if (config.cropDragBars && config.cropDragBars.length > 0)
			{
				for(var count = 0;count < config.cropDragBars.length;count++)
				{
					var cssClass = "";
					switch(config.cropDragBars[count])
					{
						case "n":
							cssClass = "nsImageBorder nsImageBorderHorizontal";
						break;
						case "s":
							cssClass = "nsImageBorder nsImageBorderHorizontal nsImageBorderHorizontalBottom";
						break;
						case "e":
							cssClass = "nsImageBorder nsImageBorderVertical nsImageBorderVerticalRight";
						break;
						case "w":
							cssClass = "nsImageBorder nsImageBorderVertical";
						break;
					}
					var div = createCropBorderComp(cssClass);
					cropperContainers.borders[config.cropDragBars[count]] = div;
				}
			}
		};
		
		var createCropHandleDragbarsComp = function(direction,zIndex,baseCssClass)
		{
			var mouseDownHandler = function(event)
			{
				return handleDragMouseDownHandler(event,direction);
			};
			var div = util.createDiv(null,baseCssClass + direction);
			div.style.zIndex = zIndex;
			util.addEvent(div,"mousedown",mouseDownHandler);
			util.addEvent(div,"touchstart",mouseDownHandler);
			util.addEvent(div,"click",stopPropagation);
			cropperContainers.dragContainer.appendChild(div);
			return div;
		};
		
		var createCropBorderComp = function(cssClass)
		{
			var borderOpacity = 0.4;
			var div = util.createDiv(null,cssClass);
			div.style.opacity = borderOpacity;
			cropperContainers.imgContainer.appendChild(div);
			return div;
		};
		
		var cropNewSelection = function(event)
		{
			event = getEvent(event);
			if (!config.disabled && config.cropEnableSelect) 
			{
				cropperVars.docOffset = util.getOffSet(cropperContainers.image);
				setCropHandlesEnability(false);
				cropperContainers.tracker.style.cursor = "crosshair";
				var position = getMouseAbsolutePos(event);
				setCropPressed(position);
				updateCropSelection(false);
				addDocumentHandler(trackerMouseMoveHandler,trackerMouseUpHandler);
				event.stopPropagation();
				event.preventDefault();
		    }
		};
		
		var trackerMouseMoveHandler = function(event)
		{
			cropperContainers.tracker.style.zIndex = 450;
			event = getEvent(event);
			var point = getMouseAbsolutePos(event);
			setCropCurrent(point);
			updateCropSelection(false);
			event.preventDefault();
		};
		
		var trackerMouseUpHandler = function(event)
		{
			cropperContainers.tracker.style.zIndex = 280;
			event = getEvent(event);
			var point = getCropFixed();
			if(point.w > 0 && point.h > 0)
			{
				setCropHandlesEnability(true);
				refreshCropHandles();
			}
			else
			{
				releaseCropHandles();
			}
			cropperContainers.tracker.style.cursor = (config.cropEnableSelect ? "crosshair" : "default");
			removeDocumentHandler();
			event.preventDefault();
			event.stopPropagation();
		};
		
		var handleDragMouseDownHandler = function(event,direction)
		{
			event = getEvent(event);
			if (!config.disabled && !(!config.cropEnableMove && direction === "move")) 
			{
				cropperVars.docOffset = util.getOffSet(cropperContainers.image);
				var position = getMouseAbsolutePos(event);
				initiateCropDragMode(direction,position);
				event.stopPropagation();
				event.preventDefault();
			}
		};
		
		var initiateCropDragMode = function(direction,position)
		{
			cropperVars.docOffset = util.getOffSet(cropperContainers.image);
			if (direction === "move") 
			{
				cropperContainers.tracker.style.cursor = "move";
				cropperVars.movePos = position;
				addDocumentHandler(startCropMover,trackerMouseUpHandler);
		    }
			else
			{
				cropperContainers.tracker.style.cursor = direction + "-resize";
				var point = getCropFixed();
			    var oppDir = getCropOppositeDirection(direction);
			    var cropCorner = getCropCorner(getCropOppositeDirection(oppDir));
			    setCropPressed(getCropCorner(oppDir));
			    setCropCurrent(cropCorner);
			    cropperVars.dragDirection = direction;
			    cropperVars.dragPoint = point;
			    addDocumentHandler(startCropDragger,trackerMouseUpHandler);
			}
		};
		
		var startCropDragger = function(event)
		{
			event = getEvent(event);
			var position = getMouseAbsolutePos(event);
			var dragDirection = cropperVars.dragDirection;
			var dragPoint = cropperVars.dragPoint;
			if (config.cropAspectRatio) 
		    {
				switch (dragDirection) 
				{
		          	case "e":
		          		position[1] = dragPoint.y + 1;
		          		break;
		          	case "w":
		          		position[1] = dragPoint.y + 1;
		          		break;
		          	case "n":
		          		position[0] = dragPoint.x + 1;
		          		break;
		          	case "s":
		          		position[0] = dragPoint.x + 1;
		          		break;
		        }
		    }
			else
			{
				switch (dragDirection) 
				{
		          	case "e":
		          		position[1] = dragPoint.y2;
		          		break;
		          	case "w":
		          		position[1] = dragPoint.y2;
		          		break;
		          	case "n":
		          		position[0] = dragPoint.x2;
		          		break;
		          	case "s":
		          		position[0] = dragPoint.x2;
		          		break;
		        }
			}
			setCropCurrent(position);
			updateCropSelection(false);
		};
		
		var startCropMover = function(event)
	    {
			event = getEvent(event);
			var position = getMouseAbsolutePos(event);
			var points = [position[0] - cropperVars.movePos[0],position[1] - cropperVars.movePos[1]];
			moveCropOffset(points);
			cropperVars.movePos = position;
			updateCropSelection(false);
	    };
	    
	    var getCropOppositeDirection = function(direction)
	    {
	    	var mapDirection = {"n":{dir:"sw"},"s":{dir:"nw"},"e":{dir:"nw"},"w":{dir:"ne"},"ne":{dir:"sw"},"nw":{dir:"se"},"se":{dir:"nw"},"sw":{dir:"ne"}};
	    	return mapDirection[direction].dir;
	    };
		
		var setPreCropSize = function(image,expectedWidth,expectedHeight,currentWidth,currentHeight,isSetImage)
		{
			var newWidth = currentWidth;
	        var newHeight = currentHeight;
	        if ((newWidth > expectedWidth) && expectedWidth > 0) 
	        {
	        	newWidth = expectedWidth;
	        	newHeight = (expectedWidth / currentWidth) * height;
	        }
	        if ((newHeight > expectedHeight) && expectedHeight > 0) 
	        {
	        	newHeight = expectedHeight;
	        	newWidth = (expectedHeight / currentHeight) * height;
	        }
	        cropperVars.xScale = currentWidth / newWidth;
	        cropperVars.yScale = currentHeight / newHeight;
	        if(isSetImage)
	        {
	        	image.style.width = newWidth + "px";
		        //image.style.height = newHeight + "px";
	        }
	        return {width:newWidth,height:newHeight};
		};
		
		var setCropHandlesEnability = function(isEnable)
		{
			cropperVars.seehandles = isEnable;
			var dragContainer = cropperContainers.dragContainer;
			if(isEnable)
			{
				if(config.cropEnableResize)
				{
					util.removeStyleClass(dragContainer,"nsImageHidden");
				}
			}
			else
			{
				util.addStyleClass(dragContainer,"nsImageHidden");
				resetCropPreviewImages();
			}
		};
		
		var refreshCropHandles = function(point)
		{
			if(!point)
			{
				point = getCropFixed();
			}
	        setCropPressed([point.x,point.y]);
	        setCropCurrent([point.x2,point.y2]);
	        updateCropSelection(false);
		};
		
		var releaseCropHandles = function()
		{
			setCropHandlesEnability(false);
			cropperContainers.image.style.opacity = 1;
			if(config.cropReleasedCallback)
			{
				config.cropReleasedCallback(cropperContainers.orignalImage);
			}
		};
		
		var getMouseAbsolutePos = function(event)
		{
			event = util.getEvent(event);
			return [(event.pageX - cropperVars.docOffset.left), (event.pageY - cropperVars.docOffset.top)];
		};
		
		var updateCropSelection = function(isSelect)
		{
			var point = getCropFixed();
			cropperContainers.container.style.width = Math.round(point.w) + "px";
			cropperContainers.container.style.height = Math.round(point.h) + "px";
			moveCropSelectionTo(point.x,point.y);
			util.removeStyleClass(cropperContainers.container,"nsImageHidden");
			cropperContainers.image.style.opacity = cropBackgroundOpacity;
			point = getUnscaledObject(point);
			var eventType = "";
			var callback = null;
			if(isSelect) 
			{
				callback = config.cropSelectedCallback;
		    } 
			else 
			{
				callback = config.cropSelectingCallback;
		    }
			cropFireSelectCallback(callback,point);
		};
		
		var moveCropSelectionTo = function(xPos,yPos)
		{
			cropperContainers.croppedImage.style.left = Math.round(-1 * xPos) + "px";
			cropperContainers.croppedImage.style.top = Math.round(-1 * yPos) + "px";
			cropperContainers.container.style.left = Math.round(xPos) + "px";
			cropperContainers.container.style.top = Math.round(yPos) + "px";
		};
		
		var setCropPressed = function(pos)
	    {
	        pos = getCropRebound(pos);
	        cropCoords.x2 = cropCoords.x1 = pos[0];
	        cropCoords.y2 = cropCoords.y1 = pos[1];
	    };
	    
	    var setCropCurrent = function(pos)
	    {
	        pos = getCropRebound(pos);
	        cropCoords.ox = pos[0] - cropCoords.x2;
	        cropCoords.oy = pos[1] - cropCoords.y2;
	        cropCoords.x2 = pos[0];
	        cropCoords.y2 = pos[1];
	    };
	    
	    var moveCropOffset = function(offset)
	    {
	        var ox = offset[0];
	        var oy = offset[1];

	        if (0 > cropCoords.x1 + ox) 
	        {
	        	ox -= ox + cropCoords.x1;
	        }
	        if (0 > cropCoords.y1 + oy) 
	        {
	        	oy -= oy + cropCoords.y1;
	        }
	        if (cropperVars.boundY < cropCoords.y2 + oy) 
	        {
	        	oy += cropperVars.boundY - (cropCoords.y2 + oy);
	        }
	        if (cropperVars.boundX < cropCoords.x2 + ox) 
	        {
	        	ox += cropperVars.boundX - (cropCoords.x2 + ox);
	        }

	        cropCoords.x1 += ox;
	        cropCoords.x2 += ox;
	        cropCoords.y1 += oy;
	        cropCoords.y2 += oy;
	    };
	    
	    var getCropCorner = function(ord)
	    {
	        var c = getCropFixed();
	        switch (ord) 
	        {
		        case 'ne':
		          return [c.x2, c.y];
		        case 'nw':
		          return [c.x, c.y];
		        case 'se':
		          return [c.x2, c.y2];
		        case 'sw':
		          return [c.x, c.y2];
	        }
	    };
		
		var getCropFixed = function()
	    {
	        if (config.cropAspectRatio) 
	        {
	        	
	        }
	        else
	        {
	        	return getCoordRect();
	        }
	    };
		
		var getCropRebound = function (point)
	    {
	        if (point[0] < 0)
	        {
	        	point[0] = 0;
	        }
	        if (point[1] < 0)
	        {
	        	point[1] = 0;
	        }
	        if (point[0] > cropperVars.boundX)
	        {
	        	point[0] = cropperVars.boundX;
	        }
	        if (point[1] > cropperVars.boundY)
	        {
	        	point[1] = cropperVars.boundY;
	        }
	        return [Math.round(point[0]), Math.round(point[1])];
	    };
		
	    var flipCropCoords = function (x1, y1, x2, y2)
	    {
	        var xa = x1;
	        var xb = x2;
	        var ya = y1;
	        var yb = y2;
	        if (x2 < x1) 
	        {
	        	xa = x2;
	        	xb = x1;
	        }
	        if (y2 < y1) 
	        {
	        	ya = y2;
	        	yb = y1;
	        }
	        return [xa, ya, xb, yb];
	    };
		
		var getCoordRect = function()
	    {
	        var xSize = cropCoords.x2 - cropCoords.x1;
	        var ySize = cropCoords.y2 - cropCoords.y1;
	        var delta;
	
	        if (config.cropMaxX && (Math.abs(xSize) > config.cropMaxX)) 
	        {
	        	cropCoords.x2 = (xSize > 0) ? (cropCoords.x1 + config.cropMaxX) : (cropCoords.x1 - config.cropMaxX);
	        }
	        if (config.cropMaxY && (Math.abs(ySize) > config.cropMaxY)) 
	        {
	        	cropCoords.y2 = (ySize > 0) ? (cropCoords.y1 + config.cropMaxY) : (cropCoords.y1 - config.cropMaxY);
	        }
	        if (config.cropMinY / cropperVars.yScale && (Math.abs(ySize) < config.cropMinY / cropperVars.yScale)) 
	        {
	        	cropCoords.y2 = (ySize > 0) ? (cropCoords.y1 + config.cropMinY / cropperVars.yScale) : (cropCoords.y1 - config.cropMinY / cropperVars.yScale);
	        }
	        if (config.cropMinX / cropperVars.xScale && (Math.abs(xSize) < config.cropMinX / cropperVars.xScale)) 
	        {
	        	cropCoords.x2 = (xSize > 0) ? (cropCoords.x1 + config.cropMinX / cropperVars.xScale) : (cropCoords.x1 - config.cropMinX / cropperVars.xScale);
	        }
	        if (cropCoords.x1 < 0) 
	        {
	        	cropCoords.x2 -= cropCoords.x1;
	        	cropCoords.x1 -= cropCoords.x1;
	        }
	        if (cropCoords.y1 < 0) 
	        {
	        	cropCoords.y2 -= cropCoords.y1;
	        	cropCoords.y1 -= cropCoords.y1;
	        }
	        if (cropCoords.x2 < 0) 
	        {
	        	cropCoords.x1 -= cropCoords.x2;
	        	cropCoords.x2 -= cropCoords.x2;
	        }
	        if (cropCoords.y2 < 0) 
	        {
	        	cropCoords.y1 -= cropCoords.y2;
	        	cropCoords.y2 -= cropCoords.y2;
	        }
	        if (cropCoords.x2 > cropperVars.boundX) 
	        {
	        	delta = cropCoords.x2 - cropperVars.boundX;
	        	cropCoords.x1 -= delta;
	        	cropCoords.x2 -= delta;
	        }
	        if (cropCoords.y2 > cropperVars.boundY) 
	        {
	        	delta = cropCoords.y2 - cropperVars.boundY;
	        	cropCoords.y1 -= delta;
	        	cropCoords.y2 -= delta;
	        }
	        if (cropCoords.x1 > cropperVars.boundX) 
	        {
	        	delta = cropCoords.x1 - cropperVars.boundY;
	        	cropCoords.y2 -= delta;
	        	cropCoords.y1 -= delta;
	        }
	        if (cropCoords.y1 > cropperVars.boundY) 
	        {
	        	delta = cropCoords.y1 - cropperVars.boundY;
	        	cropCoords.y2 -= delta;
	        	cropCoords.y1 -= delta;
	        }
	
	        return getCoordObject(flipCropCoords(cropCoords.x1, cropCoords.y1, cropCoords.x2, cropCoords.y2));
	    };
		
		var getCoordObject= function(arrPoint)
		{
			return {
		          x: arrPoint[0],
		          y: arrPoint[1],
		          x2: arrPoint[2],
		          y2: arrPoint[3],
		          w: arrPoint[2] - arrPoint[0],
		          h: arrPoint[3] - arrPoint[1]
		    };
		};
		
		var getUnscaledObject = function(point)
	    {
		      return {
		        x1: point.x * cropperVars.xScale,
		        y1: point.y * cropperVars.yScale,
		        x2: point.x2 * cropperVars.xScale,
		        y2: point.y2 * cropperVars.yScale,
		        width: point.w * cropperVars.xScale,
		        height: point.h * cropperVars.yScale
		      };
		};
		
		var cropFireSelectCallback = function(callback,point)
		{
			if(!point)
			{
				point = getCropFixed();
    			point = getUnscaledObject(point);
			}
			updateCropPreviewImages(cropperContainers.orignalImage,point,cropperVars.orignalWidth,cropperVars.orignalHeight);
			if(callback)
			{
				callback(cropperContainers.orignalImage,point);
			}
		};
		
		var initializeCropPreviewImages = function(orignalImage)
		{
			if(config.cropPreviewImages)
			{
				if(!util.isArray(config.cropPreviewImages))
				{
					config.cropPreviewImages = [config.cropPreviewImages];
				}
				var initImage = function(image)
		    	{
		    		if (image)
		    		{
		    			image.setAttribute("src",orignalImage.getAttribute("src"));
		    			handleImageForOrigin(image);
		    			image.style.width = "100%";
		    		}
		    	};
				for(var count = 0;count < config.cropPreviewImages.length;count++)
				{
					var image = util.getElement(config.cropPreviewImages[count]);
					initImage(image);
				}
			}
		};
		
		var updateCropPreviewImages = function(orignalImage,point,orignalWidth,orignalHeight)
		{
			if(config.cropPreviewImages && config.cropPreviewImages.length > 0  && point.width && point.height)
			{
				var resizeImage = function(image)
		    	{
		    		if (image)
		    		{
		    		    image.style.width = Math.round(scaleX * naturalWidth) + "px";
		    		    image.style.height = Math.round(scaleY * naturalHeight) + "px";
		    		    image.style.marginLeft = (-1 * Math.round(scaleX * point.x1)) + "px";
		    		    image.style.marginTop = (-1 * Math.round(scaleY * point.y1)) + "px";
		    		}
		    	};
		    	var scaleX = 100 / point.width;
    		    var scaleY = 100 / point.height;
		    	var naturalWidth = orignalWidth || orignalImage.naturalWidth;
		    	var naturalHeight = orignalHeight|| orignalImage.naturalHeight;
				for(var count = 0;count < config.cropPreviewImages.length;count++)
				{
					var image = util.getElement(config.cropPreviewImages[count]);
					resizeImage(image);
				}
			}
		};
		
		var resetCropPreviewImages = function()
		{
			if(config.cropPreviewImages)
			{
				if(!util.isArray(config.cropPreviewImages))
				{
					config.cropPreviewImages = [config.cropPreviewImages];
				}
				var resetImage = function(image)
		    	{
		    		if (image)
		    		{
		    			image.style.width = "100%";
		    			image.style.height = null;
		    		    image.style.marginLeft = null;
		    		    image.style.marginTop = null;
		    		}
		    	};
				for(var count = 0;count < config.cropPreviewImages.length;count++)
				{
					var image = util.getElement(config.cropPreviewImages[count]);
					resetImage(image);
				}
			}
		};
		
		var handleImageForOrigin = function(image,src)
		{
			if(image)
			{
				src = src || image.src;
				image.removeAttribute("crossorigin");
		    	if (src.match(/^https?:\/\/|^\/\//) && image.getAttribute("crossorigin") != "anonymous") 
		    	{
		    		image.removeAttribute("crossorigin");
		    		image.removeAttribute("src");
		    		image.setAttribute("crossorigin","anonymous");
		        }
		    	if(!image.src)
		    	{
		    		image.src = src;
		    	}
			}
		};
		
		var createContainer = function()
		{
			if(!container)
			{
				container = util.createDiv(null,"nsImageContainer");
			}
			return container;
		};
		
		var getImageParentContainer = function()
		{
			var parent = null;
			var image = config.image;
        	if(cropInitialized)
    		{
        		parent = cropperContainers.outerContainer;
    		}
        	else if(image.parentNode.tagName != "BODY" && image.parentNode.tagName != "HTML")
        	{
        		parent = image.parentNode;
        	}
        	return parent;
		};
		
		var getImage = function()
		{
			var image = config.image;
        	if(cropInitialized)
    		{
        		image = cropperContainers.croppedImage;
    		}
        	return image;
		};
		
		var stopPropagation = function(event)
		{
			event = util.getEvent(event);
    		event.stopPropagation();
		};
		
		var getEvent = function(event)
		{
			event = util.getEvent(event);
			if(event.touches)
			{
				var touches = event.touches;
				event.pageX = touches[0].clientX;
				event.pageY = touches[0].clientY;
			}
			return event;
		};
        
        var getFileName = function()
        {
        	var element = config.element;
			var fileName = config.uploadName;
			if(!fileName)
			{
				if(element["nodeName"] && element["nodeName"].toLowerCase() === "img")
	        	{
					var src = element.getAttribute("src");
					if(src)
					{
						var arrFile = src.split("/");
						fileName = arrFile[arrFile.length - 1];
					}
	        	}
				else if(element instanceof File)
	        	{
					fileName = element.name;
					fileType = element.type;
	        	}
				if(config.validateUploadNameCallback)
				{
					fileName = config.validateUploadNameCallback(fileName,self);
				}
			}
			if(!fileName)
			{
				util.throwNSError("NSImageProcessor","Image Name is not accessible.Set the property uploadName in setting.");
			}
			config.uploadName = fileName;
			return fileName;
        };
        
        var getFileType = function()
        {
        	var element = config.element;
        	var fileType = null;
			if(element["nodeName"] && element["nodeName"].toLowerCase() === "img")
        	{
				var src = element.getAttribute("src");
				if(src)
				{
					var fileName = getFileName();
					var arrName = fileName.split(".");
					fileType = "image/" + arrName[1];
				}
        	}
			else if(element instanceof File)
        	{
				fileType = element.type;
        	}
			return fileType;
        };
        
        var initializeMagnifier = function()
        {
        	enableMagnify = true;
			if(enableMagnify && !magnifyInitialized)
			{
				magnifyInitialized = true;
				createMagnifyContainers();
			}
        };
        
        var createMagnifyContainers = function()
        {
        	if(enableMagnify && magnifyInitialized)
        	{
				var image = config.image;
				var prop = config.magnifyProps;
				var outerContainer = createContainer();
				addImageToContainer();
				util.addStyleClass(outerContainer, "nsImageMagnifierOuterContainer");
				var resultElement = prop.resultElement;
				if(resultElement)
				{
					resultElement = util.getElement(resultElement);
				}
				else
				{
					resultElement = util.createDiv(null);
					resultElement.style.width = image.offsetWidth + "px";
					resultElement.style.height = image.offsetHeight + "px";
					outerContainer.appendChild(resultElement);
				}
				util.addStyleClass(resultElement, "nsImageMagnifierResult");
				var lensElement = util.createDiv(null,"nsImageMagnifierLens");
				image.parentElement.insertBefore(lensElement, image);
				var ratioX = resultElement.offsetWidth / lensElement.offsetWidth;
				var ratioY = resultElement.offsetHeight / lensElement.offsetHeight;
				resultElement.style.backgroundImage = "url('" + image.src + "')";
				resultElement.style.backgroundSize = (image.width * ratioX) + "px " + (image.height * ratioY) + "px";
				util.addEvent(lensElement,"mousemove",magnifierMouseMove);
				util.addEvent(image,"mousemove",magnifierMouseMove);
				util.addEvent(lensElement,"touchmove",magnifierMouseMove);
				util.addEvent(image,"touchmove",magnifierMouseMove);
				magnifierContainers = {image:image,resultElement:resultElement,lensElement:lensElement};
				magnifierVars = {ratioX:ratioX,ratioY:ratioY};
        	}
        };
        
        var magnifierMouseMove = function(event)
        {
        	var event = getEvent(event);
        	var position = getCursorPosition(event);
        	var image =  magnifierContainers.image;
        	var lensElement = magnifierContainers.lensElement;
        	var resultElement = magnifierContainers.resultElement;
        	var x = position.x - (lensElement.offsetWidth / 2);
            var y = position.y - (lensElement.offsetHeight / 2);
            var calcWidth = image.width - lensElement.offsetWidth;
            if (x > calcWidth) 
            {
            	x = calcWidth;
            }
            var calcHeight = image.height - lensElement.offsetHeight;
            if (y > calcHeight) 
            {
            	y = calcHeight;
            }
            x = Math.max(0,x);  
            y = Math.max(0,y);  
            lensElement.style.left = x + "px";
            lensElement.style.top = y + "px";
            resultElement.style.backgroundPosition = "-" + (x * magnifierVars.ratioX) + "px -" + (y * magnifierVars.ratioY) + "px";
        	event.preventDefault();
        };
        
        var hideMagnifier = function()
        {
        	if(enableMagnify && magnifyInitialized)
        	{
				var removeChild = function(node)
				{
					if(node && node.parentNode)
					{
						node.parentNode.removeChild(node);
					}
				};
				var image = config.image;
				var lensElement = magnifierContainers.lensElement;
				util.removeEvent(lensElement,"mousemove",magnifierMouseMove);
				util.removeEvent(image,"mousemove",magnifierMouseMove);
				util.removeEvent(lensElement,"touchmove",magnifierMouseMove);
				util.removeEvent(image,"touchmove",magnifierMouseMove);
	        	removeImageFromContainer();
	        	magnifierContainers = {image:null,resultElement:null,lensElement:null};
				magnifierVars = {ratioX:null,ratioY:null};
	    		image.style.opacity = null;
	    		removeChild(container);
	    		container = null;
	    		magnifyInitialized = false;
        	}
        	
        };
        
        var getCursorPosition = function(event)
        {
        	var image = magnifierContainers.image;
        	event = getEvent(event);
        	var rect = image.getBoundingClientRect();
        	var x = event.pageX - rect.left;
            var y = event.pageY - rect.top;
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return {x : x, y : y};
        };
        
        
        self.uploadImage = uploadImage;
        self.getBase64 = getBase64;
        self.getThumbnail = getThumbnail;
        self.initializeResize = initializeResize;
        self.initializeMove = initializeMove;
        self.zoomIn = zoomIn;
        self.zoomOut = zoomOut;
        self.rotateLeft = rotateLeft;
        self.rotateRight = rotateRight;
        self.flipHorizontal = flipHorizontal;
        self.flipVertical = flipVertical;
        self.fullScreen = fullScreen;
        self.download = download;
        self.cropSetSelect = cropSetSelect;
        self.destroy = destroy;
		
		initialize();
	};
	
	return NSImageProcessor;
})();
nsModuleExport(__nsGlobal,"NSImageProcessor",NSImageProcessor);