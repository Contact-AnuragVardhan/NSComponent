var NSZip = (function()
{
	var NSZip = function(config)
	{
		var self = this;
		var setting = {};
	    
	    var objFiles = {};
	    var util = null;
		
		var initialize = function()
		{
			if(!config)
			{
				config = {};
			}
			/*setting = {
				fileName: config["fileName"] || "download",
				mimeType: config["mimeType"] || "application/zip"
			};
			if (setting.fileName.indexOf(".") === -1) 
			{
				setting.fileName = setting.fileName + ".zip";
	        }*/
			util = new ZipUtil();
		};
		
		var getFile = function(type,mimeType)
		{
			var objRet = null;
			type = type ? type : "blob";
			switch(type) 
			{
				case "blob":
					objRet = getBlob(mimeType);
				break;
			}
			return objRet;
		};
		
		var addFolders = function(arrPath)
		{
			var arrReturn = null;
			if(arrPath && arrPath.length > 0)
			{
				arrReturn = [];
				for(var index = 0;index < arrPath.length;index++)
				{
					arrReturn.push(addFolder(arrPath[index]));
				}
			}
			return arrReturn;
		};
		
		var addFolder = function(path)
		{
			return createFolder(path);
		};
		
		var addFile = function(path,content,prop)
		{
			return createFile(path,content,prop,false);
		};
		
		var createFolder = function(path)
		{
			path = util.addSlashAtEnd(path);
			if(objFiles[path])
			{
				return objFiles[path].zipFile;
			}
			return createFile(path,null,null,true);
		};
		
		var createFile = function(path,content,prop,isDir)
		{
			prop = prop ? prop : {};
			var item = {path: path,content: content,origContent: content};
			item.created = new Date();
			item.dataType = util.getDataType(content);
			item.isDir = isDir ? true : false;
			var parent = util.getParentFolder(path);
			if(parent)
			{
				createFolder(parent);
			}
			item.isBase64 = (item.type == "base64");
			item.isBinary = (item.type == "binary");
			var isUnicodeString = (item.dataType === "string") && item.isBase64 && item.isBinary;
			if (item.type != "binary") 
			{
				item.isBinary = !isUnicodeString;
		    }
			if(item.isDir || !path || !path.length)
			{
				item.dataType = "string";
				item.isBase64 = false;
				item.isBinary = true;
				item.content = "";
			}
			item.content = getContent(item);
			var zipFile = new ZipFile(util,item,self);
			objFiles[path] = {item: item,zipFile: zipFile};
			
			return zipFile;
		};
		
		var getContent = function(item)
		{
			var refine = function(data)
			{
				var dataType = item.dataType;
				if(dataType)
				{
					if(dataType === "string")
					{
						if(item.isBase64)
						{
							data = util.base64Decode(data);
						}
						else if(item.isBinary)
						{
							/*var arrData = new Uint8Array(data.length);
							data = util.fillArrayWithString(data,arrData);*/
						}
					}
					else if (dataType === "arraybuffer") 
					{
			            data = new Uint8Array(item);
			        }
				}
				else
				{
					console.warn("DataType cannot be detected for file " + item.path);
				}
				return data;
			};
			var content = item.content;
			var isBlob = (content instanceof Blob || ['[object File]', '[object Blob]'].indexOf(Object.prototype.toString.call(content)) !== -1);
	        if(isBlob && typeof FileReader !== "undefined") 
	        {
	        	return new Promise(function (resolve, reject) 
	        	{
	                var reader = new FileReader();
	                reader.onload = function(event) 
	                {
	                	item.content = refine(event.target.result);
	                	resolve(event.target.result);
	                };
	                reader.onerror = function(event) 
	                {
	                	console.error(event.target.error);
	                    reject(event.target.error);
	                };
	                reader.readAsArrayBuffer(content);
	        	});
	        }
	        return refine(content);
		};
		
		var clear = function()
		{
		     objFiles = {};
		};
		
		var getBlob = function(mimeType)
		{
			mimeType = mimeType ? mimeType : "application/zip";
			var textOutput = buildFileStream();
			var uInt8Output  = util.buildUint8Array(textOutput);
			clear();
			return new Blob([uInt8Output], { type: setting.mimeType });
		};
		
		var buildFileStream = function(initContent)
		{
			initContent = initContent ? initContent : "";
			var len = Object.keys(objFiles).length;
			var middleContent = "";
			var lL = 0;
	        var cL = 0;
	        for(var path in objFiles)
			{
	        	var file = objFiles[path].item;
				var objHeader = getHeader(file, lL);
				var fileHeader = objHeader.fileHeader;
				var folderHeader = objHeader.folderHeader;
				var content = objHeader.content;
				lL += fileHeader.length + content.length;
	            cL += folderHeader.length;
	            initContent +=  fileHeader + content;
	            middleContent += folderHeader;
			}
			var endContent = buildFolderEnd(len, cL, lL);
	        return initContent + middleContent + endContent;
		};
		
		var getHeader = function(file,offset)
		{
			var content = util.utf8_encode(file.content);
			var path = file.path;
			var created = file.created;
			var utfPath = util.utf8_encode(path);
			var isUTF8 = (utfPath !== path);
			var time = util.convertTime(created);
		    var dt = util.convertDate(created);
		    var extraFields = "";
		    if (isUTF8) 
		    {
	            var uExtraFieldPath = util.decToHex(1, 1) + util.decToHex(util.getFromCrc32Table(utfPath), 4) + utfPath;
	            extraFields = "\x75\x70" + util.decToHex(uExtraFieldPath.length, 2) + uExtraFieldPath;
	        }
		    var header = '\x0A\x00' +
	        (isUTF8 ? '\x00\x08' : '\x00\x00') + // general purpose bit flag
	        '\x00\x00' +
	        util.decToHex(time, 2) + // last modified time
	        util.decToHex(dt, 2) + // last modified date
	        util.decToHex(content ? util.getFromCrc32Table(content) : 0, 4) +
	        util.decToHex(content ? content.length : 0, 4) + // compressed size
	        util.decToHex(content ? content.length : 0, 4) + // uncompressed size
	        util.decToHex(utfPath.length, 2) + // file name length
	        util.decToHex(extraFields.length, 2); // extra field length
	        
		    var fileHeader = 'PK\x03\x04' + header + utfPath + extraFields;
	        var folderHeader = 'PK\x01\x02' + // central header
	            '\x14\x00' +
	            header + // file header
	            '\x00\x00' +
	            '\x00\x00' +
	            '\x00\x00' +
	            (content ? '\x00\x00\x00\x00' : '\x10\x00\x00\x00') + // external file attributes
	            util.decToHex(offset, 4) + // relative offset of local header
	            utfPath + // file name
	            extraFields; // extra field
	        return { fileHeader: fileHeader, folderHeader: folderHeader, content: content || '' };
		};
		
		var buildFolderEnd = function(totalEntries,size,startOffset)
		{
			var retValue = "PK\x05\x06" + "\x00\x00" + "\x00\x00";
			retValue += util.decToHex(totalEntries, 2);
			retValue += util.decToHex(totalEntries, 2);
			retValue += util.decToHex(size, 4);
			retValue += util.decToHex(startOffset, 4);
			retValue += "\x00\x00";
			return retValue;
		};
		
	    var downloadFile = function(fileName,mimeType,type,content)
	    {
	    	fileName = fileName ? fileName : "download";
	    	if (fileName.indexOf(".") === -1) 
			{
				fileName = fileName + ".zip";
	        }
	    	content = content ? content : getFile(type,mimeType);
	    	util.downloadFile(fileName,content);
	    };
	    
	    var ZipFile = function(util,item,objRoot)
	    {
	    	var self = this;
	    	
	    	var addFolder = function(path)
	    	{
	    		return objRoot.addFolder(getPath(path));
	    	};
	    	
	    	var addFile = function(path,content)
	    	{
	    		return objRoot.addFile(getPath(path),content);
	    	};
	    	
	    	var getPath = function(path)
	    	{
	    		return item.path + path;
	    	};
	    	
	    	if(item.isDir)
	    	{
	    		self.addFolder = addFolder;
	    		self.addFile = addFile;
	    	}
	    };
	    
	    var ZipUtil = function()
	    {
	    	var self = this;
	    	var crcTable = [];
	    	var base64Key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    	
	    	var initialize = function()
	    	{
	    		crcTable = makeCRCTable();
	    	};
	    	
	    	//https://stackoverflow.com/questions/18638900/javascript-crc32
	    	var makeCRCTable = function()
	    	{
	    	    var c;
	    	    var crcTable = [];
	    	    for(var n =0; n < 256; n++)
	    	    {
	    	        c = n;
	    	        for(var k =0; k < 8; k++)
	    	        {
	    	            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
	    	        }
	    	        crcTable[n] = c;
	    	    }
	    	    return crcTable;
	    	};
	    	
	    	var getFromCrc32Table = function(content, crc)
	        {
	    		if(typeof content === "undefined" || !content.length) 
	    		{
	    	        return 0;
	    	    }
	    		if(!crc)
	        	{
	        		crc = 0;
	        	}
	        	crc ^= (-1);
	    		var dataType = util.getDataType(content);
	    		if(dataType === "string")
	    		{
		            var ch = 0;
		            var k = 0;
		            var l = 0;
		            var len = content.length;
		            for (var count = 0;count < len;count++) 
		            {
		            	ch = content.charCodeAt(count);
		                k = (crc ^ ch) & 0xFF;
		                l = crcTable[k];
		                crc = (crc >>> 8) ^ l;
		            }
	    		}
	    		else
	    		{
	    			var ch = 0;
		            var k = 0;
		            var l = 0;
	    			var len = content.length;
	    			for (var count = 0;count < len;count++) 
		            {
	    				ch = content[count];
	    				k = (crc ^ ch) & 0xFF;
	    				l = crcTable[k];
	    				crc = (crc >>> 8) ^ l;
		            }
	    		}
	    		return crc ^ (-1);
	        };
	        
	        var buildUint8Array = function(content)
	        {
	        	var retValue = new Uint8Array(content.length);
	            for (var count = 0; count < content.length; count++) 
	            {
	            	retValue[count] = content.charCodeAt(count);
	            }
	            return retValue;
	        };
	        
	        //http://www.navioo.com/javascript/tutorials/Javascript_utf8_encode_1529.html
	        // Encodes an ISO-8859-1 string to UTF-8    
	        var utf8_encode = function(str) 
	    	{
	        	var retValue = "";
	    		var str = str.replace(/\r\n/g, "\n");
	    		var len = str.length;
	    		var start = 0;
	    		var end = 0;
	    		var enc = null;
	    		var ch = null;
	    		for(var count = 0;count < len;count++)
	    		{
	    			ch = str.charCodeAt(count);
	    			enc = null;
	    			if(ch < 128)
	    			{
	    				end++;
	    			}
	    			else if(ch > 127 && ch < 2048)
	    			{
	    				enc = String.fromCharCode(ch >> 6 | 192);
	    				enc += String.fromCharCode((ch & 63) | 128);
	    			}
	    			else
	    			{
	    				enc = String.fromCharCode((ch >> 12) | 224);
	    				enc += String.fromCharCode(((ch >> 6) & 63) | 128);
	    				enc += String.fromCharCode((ch & 63) | 128);
	    			}
	    			if (enc != null) 
	    			{  
    		            if (end > start) 
    		            {  
    		            	retValue += str.substring(start, end);  
    		            }  
    		            retValue += enc;  
    		            start = end = count + 1;  
    		        }  
	    		}
	    		if (end > start) 
	    		{  
	    			retValue += str.substring(start,str.length);  
	    	    } 
	    		return retValue;
	        };
	        
	        //http://www.navioo.com/javascript/tutorials/Javascript_utf8_decode_1528.html
	        // Converts a UTF-8 encoded string to ISO-8859-1    
	        var utf8_decode = function(str) 
	    	{
	        	var arrReturn = [];
	        	var count = 0;
	        	var retCount = 0;
	        	var char1 = 0;
	        	var char2 = 0;
	        	var char3 = 0;  
	            str += "";  
	            while (count < str.length) 
	            {  
	                char1 = str.charCodeAt(count);  
	                if (char1 < 128) 
	                {  
	                    arrReturn[retCount++] = String.fromCharCode(char1);  
	                    count++;  
	                } 
	                else if ((char1 > 191) && (char1 < 224)) 
	                {  
	                    char2 = str.charCodeAt(count+1);  
	                    arrReturn[retCount++] = String.fromCharCode(((char1 & 31) << 6) | (char2 & 63));  
	                    count += 2;  
	                } 
	                else 
	                {  
	                    char2 = str.charCodeAt(count+1);  
	                    char3 = str.charCodeAt(count+2);  
	                    arrReturn[retCount++] = String.fromCharCode(((char1 & 15) << 12) | ((char2 & 63) << 6) | (char3 & 63));  
	                    count += 3;  
	                }  
	            }  
	            return arrReturn.join('');  
	    	};
	        
	        var decToHex = function(number, bytes) 
	        {
	        	var retValue = "";
	        	for(var count = 0;count < bytes;count++)
	    		{
	        		retValue += String.fromCharCode(number & 0xFF);
	        		number = number >>> 8;
	    		}
	        	return retValue;
	        };
	        
	        var fillArrayWithString = function(str,arrData) 
	        {
	        	for (var count = 0;count < str.length;count++) 
	        	{
	        		arrData[count] = str.charCodeAt(count) & 0xFF;
	            }
	            return arrData;
	        };
	        
	        var convertTime = function(date)
	        {
	        	 var hour = date.getUTCHours();
	        	 hour = hour << 6;
	        	 hour = hour | date.getUTCMinutes();
	        	 hour = hour << 5;
	        	 hour = hour | date.getUTCSeconds() / 2;
	        	 return hour;
	        };
	        
	        var convertDate = function(date)
	        {
	        	var retDate = date.getUTCFullYear() - 1980;
	        	retDate = retDate << 4;
	        	retDate = retDate | (date.getUTCMonth() + 1);
	        	retDate = retDate << 5;
	        	retDate = retDate | date.getUTCDate();
	        	return retDate;
	        };
	        
	        var addSlashAtEnd = function(path) 
	    	{
	    	    if (path.slice(-1) !== "/") 
	    	    {
	    	        path += "/";
	    	    }
	    	    return path;
	    	};
	    	
	    	var getParentFolder = function(path) 
	    	{
	    	    if (path.slice(-1) === '/') 
	    	    {
	    	        path = path.substring(0, path.length - 1);
	    	    }
	    	    var lastSlash = path.lastIndexOf('/');
	    	    return (lastSlash > 0) ? path.substring(0, lastSlash) : "";
	    	};
	    	
	    	var getDataType = function(data) 
	    	{
	    	    if (typeof data === "string") 
	    	    {
	    	        return "string";
	    	    }
	    	    if (Object.prototype.toString.call(data) === "[object Array]") 
	    	    {
	    	        return "array";
	    	    }
	    	    if (typeof Buffer !== "undefined" && data instanceof Buffer) 
	    	    {
	    	        return "nodebuffer";
	    	    }
	    	    if (data instanceof Uint8Array) 
	    	    {
	    	        return "uint8array";
	    	    }
	    	    if (data instanceof ArrayBuffer) 
	    	    {
	    	        return "arraybuffer";
	    	    }
	    	};
	    	
	    	var base64Decode = function(data) 
	    	{
	    		var chr1, chr2, chr3;
	    	    var enc1, enc2, enc3, enc4;
	    	    var i = 0, resultIndex = 0;
	    	    
	    	    if(data.indexOf('base64,') > -1)
	    	    {
	    	    	var index = data.indexOf('base64,') + 'base64,'.length;
		    	    data = data.substring(index);
	    	    }
	    	    data = data.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	    	    var totalLength = data.length * 3 / 4;
	    	    if(data.charAt(data.length - 1) === base64Key.charAt(64)) 
	    	    {
	    	        totalLength--;
	    	    }
	    	    if(data.charAt(data.length - 2) === base64Key.charAt(64)) 
	    	    {
	    	        totalLength--;
	    	    }
	    	    //totalLength is base64 expected length
	    	    if (totalLength % 1 !== 0) 
	    	    {
	    	        throw new Error("Invalid base64 data");
	    	    }
	    	    var retValue = new Uint8Array(totalLength|0);
	    	    while (i < data.length) 
	    	    {
	    	        enc1 = base64Key.indexOf(data.charAt(i++));
	    	        enc2 = base64Key.indexOf(data.charAt(i++));
	    	        enc3 = base64Key.indexOf(data.charAt(i++));
	    	        enc4 = base64Key.indexOf(data.charAt(i++));

	    	        chr1 = (enc1 << 2) | (enc2 >> 4);
	    	        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	    	        chr3 = ((enc3 & 3) << 6) | enc4;

	    	        retValue[resultIndex++] = chr1;

	    	        if (enc3 !== 64) 
	    	        {
	    	            retValue[resultIndex++] = chr2;
	    	        }
	    	        if (enc4 !== 64) 
	    	        {
	    	            retValue[resultIndex++] = chr3;
	    	        }
	    	    }

	    	    return retValue;
	    	};
	    	
	    	var downloadFile = function(fileName,content)
	        {
	        	if ("msSaveOrOpenBlob" in window.navigator) 
	        	{
	                window.navigator.msSaveOrOpenBlob(content, fileName);
	            }
	            else 
	            {
	                var element = document.createElement("a");
	                var url = window.URL.createObjectURL(content);
	                element.setAttribute("href", url);
	                element.setAttribute("download", fileName);
	                element.style.display = "none";
	                document.body.appendChild(element);
	                element.click();
	                window.URL.revokeObjectURL(url);
	                document.body.removeChild(element);
	            }
	        };
	        
	        initialize();
	        
	        self.getFromCrc32Table = getFromCrc32Table;
	        self.buildUint8Array = buildUint8Array;
	        self.utf8_encode = utf8_encode;
	        self.utf8_decode = utf8_decode;
	        self.decToHex = decToHex;
	        self.fillArrayWithString = fillArrayWithString;
	        self.convertTime = convertTime;
	        self.convertDate = convertDate;
	        self.addSlashAtEnd = addSlashAtEnd;
	        self.getParentFolder = getParentFolder;
	        self.getDataType = getDataType;
	        self.base64Decode = base64Decode;
	        self.downloadFile = downloadFile;
	    };
	    
		initialize();
		
		self.addFolder = addFolder;
		self.addFolders = addFolders;
		self.addFile = addFile;
		self.getBlob = getBlob;
		self.getFile = getFile;
		self.downloadFile = downloadFile;
	};
	
	return NSZip;
})();
nsModuleExport(__nsGlobal,"NSZip",NSZip);