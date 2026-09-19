"use strict";
var NSBinding = (function()
{
	function NSBinding(element,model) 
	{
		this.__PROCESSED_CLASS = "nsBinded";
		this.util = new NSUtil();
		this.__element = this.util.getElement(element);
		this.__orignalModel = model;
		this.__model = model;
		this.__mapKeys = {};
		//structure is this.__mapRepeaterKeys["customer..name"]["customer in customers"][0]=node
		this.__mapRepeaterKeys = {};
		this.__arrCondition = [];
		this.__processRepeater = false;
		
		this.__initialize();
	};
	NSBinding.VALUE_CHANGED = "valueChanged";
	
	NSBinding.prototype.__initialize = function()
	{
		var model = this.__model;
		try
		{
			this.__model = JSON.parse(JSON.stringify(model));
		}
		catch(error)
		{
			this.__model = JSON.parse(this.util.stringifyOnce(model));
		}
		this.__parse(this.__element,-1);
		this.__processRepeater = true;
		this.__handleConditions(this.__arrCondition);
		this.__applyWatcher();
		this.__applyRepeaterWatcher();
	};
	
	NSBinding.prototype.__applyWatcher = function()
	{
		var self = this;
		var initializeProperty = function(key)
		{
			var itemParentOrignal = null;
			var itemParentRef = null;
			var item = null;
			var finalKey = "";
			var arrkey = key.split(".");
			for(var count = 0;count < arrkey.length;count++)
			{
				if(count === 0)
				{
					itemParentOrignal = self.__orignalModel;
					itemParentRef = self.__model;
				}
				else
				{
					itemParentOrignal = itemParentOrignal[finalKey];
					itemParentRef = itemParentRef[finalKey];
				}
				if(!itemParentOrignal)
				{
					break;
				}
				finalKey = arrkey[count];
				item = itemParentOrignal[finalKey];
			}
			if(self.util.isUndefinedOrNull(item) && key.indexOf("..") === -1)
			{
				if(key.indexOf(".") === -1)
				{
					itemParentRef[key] = null;
					itemParentOrignal[key] = null;
					item = "";
				}
				else
				{
					var arrTempKey = key.split(".");
					itemParentOrignal = self.__orignalModel;
					itemParentRef = self.__model;
					for(var count = 0;count < arrTempKey.length;count++)
					{
						if(self.util.isUndefined(itemParentOrignal[arrTempKey[count]]))
						{
							var value = (count === (arrTempKey.length - 1)) ? null : {};
							itemParentOrignal[arrTempKey[count]] = value;
							itemParentRef[arrTempKey[count]] = value;
						}
						if(count !== (arrTempKey.length - 1))
						{
							itemParentOrignal = itemParentOrignal[arrTempKey[count]];
							itemParentRef = itemParentRef[arrTempKey[count]];
						}
					}
					item = "";
				}
			}
			//if(!self.util.isUndefinedOrNull(item))
			//{
				if (typeof item !== "object") 
				{
					var itemTemp = {
		            	enumerable: true,
		            	configurable: true,
		                get: function() 
		                {
		                	return self.__getObject.bind(self)(itemParentRef,finalKey,key);
		                },
		                set: function(value)
		                {
		                    self.__setObject.bind(self)(value,itemParentRef,finalKey,key);
		                }
		            };
		            Object.defineProperty(itemParentOrignal,finalKey,itemTemp);
		        } 
			//}
		};
		Object.keys(this.__mapKeys).forEach(initializeProperty,self.__element);
	};
	
	NSBinding.prototype.__setObject = function(value,item,finalKey,orignalKey)
	{
	    var changer = this.__watcher(item,finalKey,value);
	    var oldValue = item[finalKey];
	    item[finalKey] = value;
	    this.__observing(this.__element,changer,orignalKey);
	    this.__observingRepeaters(changer,orignalKey,null);
	    var sendValue = {key:orignalKey,newValue:value,oldValue:oldValue};
	    this.util.dispatchEvent(this.__element,NSBinding.VALUE_CHANGED,sendValue,sendValue);
	};
	
	NSBinding.prototype.__getObject = function(item,finalKey,orignalKey)
	{
		var arrTempKey = finalKey.split(".");
		var tempKey = arrTempKey[arrTempKey.length - 1];
	    return item[tempKey];
	};
	
	NSBinding.prototype.__parse = function(node,index,isRepeater,item,repeaterCondition,itemOrignal)
	{
		if(node)
		{
			var isTextNode = this.__isTextNode(node);
			if(!isTextNode && !isRepeater && this.util.hasAttribute(node,"nsbind-repeater"))
			{
				isRepeater = true;
			}
			if(isRepeater)
			{
				if(this.__processRepeater)
				{
					if(isTextNode)
					{
						this.__parseRepeaterTextNode(node,index,isRepeater,item,repeaterCondition,itemOrignal);
					}
					else
					{
						this.__parseRepeaterElement(node,index,isRepeater,item,repeaterCondition,itemOrignal);
					}
					if(node["childNodes"] && node["childNodes"].length > 0)
					{
						var arrChild = node.childNodes;
						var length = node.childNodes.length;
						var child = null;
						for(var count = 0;count < length;count++)
						{
							child = arrChild[count];
							this.__parse(child,index,isRepeater,item,repeaterCondition,itemOrignal);
						}
					}
				}
				else
				{
					this.__createConditionAttributes(node);
				}
			}
			else
			{
				if(isTextNode)
				{
					this.__parseTextNode(node,index);
				}
				else
				{
					this.__parseElement(node,index);
				}
				if(node["childNodes"] && node["childNodes"].length > 0)
				{
					var arrChild = node.childNodes;
					var length = node.childNodes.length;
					var child = null;
					for(var count = 0;count < length;count++)
					{
						child = arrChild[count];
						this.__parse(child,index);
					}
				}
			}
			
		}
	};
	
	NSBinding.prototype.__parseElement = function(element)
	{
		if(element)
		{
	        this.__parseAttributes(element);
			this.util.addStyleClass(element,this.__PROCESSED_CLASS);
		}
	};
	
	NSBinding.prototype.__parseTextNode = function(textNode)
	{
		if(textNode)
		{
			var arrBindingKeys = this.__getBindingVariables(textNode.textContent);
			if(arrBindingKeys && arrBindingKeys.length > 0)
			{
				var arrValues = this.__getValuesFromObject(arrBindingKeys);
				if(arrValues && arrValues.length > 0) 
				{ 
					this.__mapAttribute(textNode,"nodeValue",arrBindingKeys);
					this.__performAttributeBinding(textNode,arrBindingKeys,arrValues);
	            }
			}
		}
	};
	
	NSBinding.prototype.__parseAttributes = function(node,index) 
	{
		if(node && node["attributes"] && node["attributes"].length > 0)
		{
			var arrAttributes = node.attributes;
			var length = node.attributes.length;
			var attribute = null;
			var arrBindingKeys = null;
			var arrValues = null;
			var self = this;
			for(var count = 0;count < length;count++)
			{
				arrBindingKeys = [];
				arrValues = [];
				attribute = arrAttributes[count];
				if(attribute && attribute.name && attribute.value && attribute.value.indexOf("{{") > -1 && attribute.value.indexOf("..") === -1)
				{
					if(attribute.name.length > 2 && attribute.name.substring(0,2) === "on")
					{
						var eventName = attribute.name.substring(2);
			            var arrFunctionName = this.__getBindingVariables(attribute.value);
			            if(arrFunctionName && arrFunctionName.length > 0)
			            {
			            	var functionName = null;
			            	for(var innerCount = 0;innerCount < arrFunctionName.length;innerCount++)
			 	            {
			            		functionName = arrFunctionName[innerCount];
			 	            	if(this.__orignalModel[functionName] && this.util.isFunction(this.__orignalModel[functionName]))
			 		            {
			 		            	this.__registerEvent(node,eventName,this.__orignalModel[functionName].bind(this.__model));
			 		            }
			 	            }
			            	node.setAttribute(attribute.name,"");
			            }
			        }
					//nsbind-style as in IE in style when we give {{}} it removes it 
					else if(attribute.name === "style" || this.__isAttributeNameSame(attribute.name,"nsbind-style"))
					{
						var arrStyleProp = attribute.value.split(";");
						if(arrStyleProp && arrStyleProp.length > 0)
						{
							var style = node.style;
							var arrProp = [];
							var jsProp = "";
							for(var styleCount = 0;styleCount < arrStyleProp.length;styleCount++)
							{
								arrProp = arrStyleProp[styleCount].split(":");
								jsProp = this.util.convertCSSPropToJS(arrProp[0]);
								arrBindingKeys = this.__getBindingVariables(arrProp[1]);
								if(arrBindingKeys && arrBindingKeys.length > 0)
								{
									arrValues = this.__getValuesFromObject(arrBindingKeys);
									this.__mapAttribute(node,arrProp[0],arrBindingKeys,true,jsProp);
									var newValue = this.__performAttributeBinding(node,arrBindingKeys,arrValues,arrProp[1]);
									style[jsProp] = newValue;
								}
							}
						}
					}
					else if(this.__isAttributeNameSame(attribute.name,"nsbind-show"))
					{
						arrBindingKeys = this.__getBindingVariables(attribute.value);
						if(arrBindingKeys && arrBindingKeys.length > 0)
						{
							var style = node.style;
							var jsProp = this.util.convertCSSPropToJS("display");
							arrValues = this.__getValuesFromObject(arrBindingKeys);
							var value = (arrValues && arrValues.length > 0 && !Boolean.parse(arrValues[0])) ? "none" : "";
							this.__mapAttribute(node,attribute.name,arrBindingKeys);
							this.__mapAttribute(node,jsProp,arrBindingKeys,true,jsProp);
							var newValue = this.__performAttributeBinding(node,arrBindingKeys,arrValues,attribute.value);
							attribute.value = newValue;
							style[jsProp] = value;
						}
					}
					else
					{
						arrBindingKeys = this.__getBindingVariables(attribute.value);
						if(arrBindingKeys && arrBindingKeys.length > 0)
						{
							arrValues = this.__getValuesFromObject(arrBindingKeys);
							this.__mapAttribute(node,attribute.name,arrBindingKeys);
							var newValue = this.__performAttributeBinding(node,arrBindingKeys,arrValues,attribute.value);
							attribute.value = newValue;
						}
					}
					var property = this.__getInputProperty(node);
					if(property && property === attribute.name && arrBindingKeys && arrBindingKeys.length > 0)
					{
						var arrItemRef = [];
						arrBindingKeys.forEach(function(fromKey,keyIndex) 
				    	{
				    		var itemRef = self.__getModelObject(fromKey,true);
				    		arrItemRef[keyIndex] = itemRef;
						});
						this.__checkForInput(node,property,arrItemRef,arrBindingKeys,false);
					}
				}
			}
			if(node.firstChild && node.firstChild.textContent.trim().length && node.childNodes.length < 1)
			{
				this.__parseTextNode(node.firstChild);
			}
		}
	};
	
	NSBinding.prototype.__mapAttribute = function(node,attributeName,arrKeys,isStyle,styleProp) 
	{
		if(node && attributeName && arrKeys && arrKeys.length > 0)
		{
			var item = {};
		    var self = this;
		    arrKeys.forEach(function(key) 
		    {
		        if (!self.__mapKeys[key])
		        {
		        	self.__mapKeys[key] = [];
		        }
		        item = {node:node,attributeName:attributeName,html:node.outerHTML};
		        if(isStyle && styleProp)
		        {
		        	item["styleProp"] = styleProp;
		        }
		        self.__mapKeys[key].push(item);
		    });
		}
	};
	
	NSBinding.prototype.__getModelObject = function(key,isOrignalItem)
	{
		var itemParent = null;
		var item = null;
		var finalKey = "";
		var arrkey = [];
		var isRepeater = false;
		if(key.indexOf("..") === -1)
		{
			arrkey = key.split(".");
		}
		else
		{
			arrkey = key.split("..");
			isRepeater = true;
		}
		for(var count = 0;count < arrkey.length;count++)
		{
			if(count === 0)
			{
				itemParent = (isOrignalItem) ? this.__orignalModel : this.__model;
			}
			else
			{
				itemParent = itemParent[finalKey];
			}
			if(!itemParent)
			{
				break;
			}
			finalKey = arrkey[count];
			item = itemParent[finalKey];
			if(this.util.isUndefined(item))
			{
				var value = (count === (arrkey.length - 1)) ? null : {};
				itemParent[finalKey] = value;
				if(value === null)
				{
					item = "";
				}
				else
				{
					item = value;
				}
			}
		}
		return {itemParent:itemParent,finalKey:finalKey,item:item};
	};
	
	NSBinding.prototype.__getValuesFromObject = function(arrKeys,item) 
	{
	    var arrValues = [];
	    var objItem = item || this.__model;
	    var self = this;
	    if (arrKeys && arrKeys.length > 0) 
	    {
	    	arrKeys.forEach(function(fromKey) 
	    	{
	    		var itemRef = self.__getModelObject(fromKey);
	    		if(itemRef && itemRef.itemParent)
	    		{
	    			if(self.util.isUndefined(itemRef.itemParent[itemRef.finalKey]))
	    			{
	    				itemRef.itemParent[itemRef.finalKey] = null;
	    			}
	    			Object.keys(itemRef.itemParent).forEach(
		            function(itemKey) 
		            {
		                if (itemRef.finalKey === itemKey) 
		                {
		                	if(itemRef.itemParent[itemKey] === null)
		                	{
		                		arrValues.push("");
		                	}
		                	else
		                	{
		                		arrValues.push(itemRef.itemParent[itemKey]);
		                	}
		                }
		            });
		            if (itemRef.itemParent && typeof itemRef.itemParent === "number" || typeof itemRef.itemParent === "string") 
		            {
		            	if(itemRef.itemParent === null)
	                	{
	                		arrValues.push("");
	                	}
	                	else
	                	{
	                		arrValues.push(itemRef.itemParent);
	                	}
		            }
	    		}
	        });
	    }
	    return arrValues;
	};
	
	NSBinding.prototype.__observing = function(element,itemChange,mapKey)
	{
	    var oldItem = itemChange.obj;
	    var affectedKey = itemChange.name;
	    var affectedNodes = this.__mapKeys[mapKey] || [];
	    var self = this;
	    affectedNodes.forEach(function(item) 
	    {
	    	if(item["styleProp"])
	    	{
	    		var value  = oldItem[affectedKey];
	    		if(item["styleProp"] == "display" && self.util.isBoolean(value))
	    		{
	    			value = Boolean.parse(value) ? "" : "none";
	    		}
	    		item.node.style[item["styleProp"]] = value;
	    	}
	    	/*if(self.__isTextNode(item.node))
			{
	    		item.node[item.attributeName] = oldItem[affectedKey];
			}
	    	else
	    	{
	    		item.node.setAttribute(item.attributeName,oldItem[affectedKey]);
	    	}*/
	    	else
	    	{
	    		if(self.util.isFunction(item.node.setAttribute))
	    		{
	    			item.node.setAttribute(item.attributeName,oldItem[affectedKey]);
	    		}
	    		//for IE
	    		else if(self.__isTextNode(item.node) && item.attributeName == "nodeValue")
	    		{
	    			item.node.innerHTML = oldItem[affectedKey];
	    		}
	    		else
	    		{
	    			item.node[item.attributeName] = oldItem[affectedKey];
	    		}
	    	}
	    });
	};
	
	NSBinding.prototype.__watcher = function(item, key, newValue)
	{
		var retItem = {name:key,obj:item,oldValue:item[key]};
		if (item[key] !== newValue) 
		{
			retItem["type"] = "updated";
	    } 
		else 
		{
			retItem["type"] = "";
	    }
	    return retItem;
	};
	/******************************************************************************** Start of Repeater related functions *********************************************************/
	NSBinding.prototype.__applyRepeaterWatcher = function(forIndex)
	{
		if(this.util.isUndefinedOrNull(forIndex))
		{
			forIndex = -1;
		}
		var self = this;
		var loopOuterProperty = function(key)
		{
			//key will be like "customer..name"
			if(key && key.indexOf("..") > -1)
			{
				var arrRepeaterkey = key.split("..");
				if(arrRepeaterkey && arrRepeaterkey.length >= 2)
				{
					for(var innerKey in self.__mapRepeaterKeys[key])
					{
						//innerKey will be like "customer in customers"
						initializeProperty(innerKey,key,self.__mapRepeaterKeys[key][innerKey],arrRepeaterkey[1]);
					}
				}
			}
		};
		//repeaterCondition will be like "customer in customers"
		//repeaterKey will be like "customer..name"
		//key will be name
		var initializeProperty = function(repeaterCondition,repeaterKey,arrObjControl,key)
		{
			//for normal attributes the normal setters and getters will take care
			var arrRepeaterCondition = repeaterCondition.split(" ");
			var itemParentOrignal = null;
			var itemParentRef = null;
			var item = null;
			var itemRef = null;
			var finalKey = "";
			var arrkey = arrRepeaterCondition[2].split("."); 
			for(var count = 0;count < arrkey.length;count++)
			{
				if(count === 0)
				{
					itemParentOrignal = self.__orignalModel;
					itemParentRef = self.__model;
				}
				else
				{
					itemParentOrignal = itemParentOrignal[finalKey];
					itemParentRef = itemParentRef[finalKey];
				}
				if(!itemParentOrignal)
				{
					break;
				}
				finalKey = arrkey[count];
				item = itemParentOrignal[finalKey];
				itemRef = itemParentRef[finalKey];
			}
			if(item && self.util.isArray(item) && item.length > 0)
			{
				if(forIndex > -1)
				{
					self.__bindRepeaterObject.bind(self)(item,forIndex,itemRef,key,finalKey,repeaterKey,repeaterCondition);
				}
				else
				{
					for(var index = 0;index < arrObjControl.length;index++)
					{
						self.__bindRepeaterObject.bind(self)(item,index,itemRef,key,finalKey,repeaterKey,repeaterCondition);
					}
				}
			}
		};
		Object.keys(this.__mapRepeaterKeys).forEach(loopOuterProperty,self.__element);
	};
	
	NSBinding.prototype.__bindRepeaterObject = function(item,index,itemRef,key,finalKey,repeaterKey,repeaterCondition)
	{
		var self = this;
		var keyItem = item[index];
		var itemTemp = {
	        	enumerable: true,
	        	configurable: true,
	            get: function() 
	            {
	            	return self.__getRepeaterObject.bind(self)(itemRef[index],key,keyItem,index,finalKey,repeaterKey,itemRef,repeaterCondition);
	            },
	            set: function(value){
	            	self.__setRepeaterObject.bind(self)(value,itemRef[index],key,keyItem,index,finalKey,repeaterKey,itemRef,repeaterCondition);
	            }//
	        };
	    Object.defineProperty(item[index],key,itemTemp);
	};
	
	NSBinding.prototype.__setRepeaterObject = function(value,item,finalKey,mappingItem,arrayIndex,arrayName,orignalKey,arrData,repeaterCondition)
	{
	    var changer = this.__repeaterWatcher(arrData,item,finalKey,value,arrayIndex,arrayName,orignalKey);
	    item[finalKey] = value;
	    this.__observingRepeaters(changer,orignalKey,repeaterCondition);
	};
	
	NSBinding.prototype.__getRepeaterObject = function(item,finalKey,mappingItem,arrayIndex,arrayName,orignalKey,repeaterCondition)
	{
		var arrTempKey = finalKey.split(".");
		var tempKey = arrTempKey[arrTempKey.length - 1];
	    return item[tempKey];
	};
	
	NSBinding.prototype.__parseRepeaterElement = function(element,index,isRepeater,item,repeaterCondition,itemOrignal)
	{
		if(element)
		{
	        this.__parseRepeaterAttributes(element,index,isRepeater,item,repeaterCondition,itemOrignal);
			this.util.addStyleClass(element,this.__PROCESSED_CLASS);
		}
	};
	
	NSBinding.prototype.__parseRepeaterTextNode = function(textNode,index,isRepeater,item,repeaterCondition,itemOrignal)
	{
		if(textNode)
		{
			var arrBindingKeys = this.__getBindingVariables(textNode.textContent);
			if(arrBindingKeys && arrBindingKeys.length > 0)
			{
				var arrValues = this.__getRepeaterValuesFromObject(arrBindingKeys,item);
				if(arrValues && arrValues.length > 0) 
				{ 
					this.__mapRepeaterAttribute(textNode,"nodeValue",arrBindingKeys,index,repeaterCondition);
					this.__performAttributeBinding(textNode,arrBindingKeys,arrValues,null);
	            }
			}
		}
	};
	
	NSBinding.prototype.__createConditionAttributes = function(node)
	{
		if(node && node["attributes"] && node["attributes"].length > 0)
		{
			var arrAttributes = node.attributes;
			var length = node.attributes.length;
			var attribute = null;
			for(var count = 0;count < length;count++)
			{
				attribute = arrAttributes[count];
				if(attribute && attribute.name && attribute.value)
				{
					if(this.__isAttributeNameSame(attribute.name,"nsbind-repeater"))
					{
						this.__pushCondition(node,attribute);
					}
				}
			}
		}
	};
	
	NSBinding.prototype.__parseRepeaterAttributes = function(node,index,isRepeater,item,repeaterCondition,itemOrignal) 
	{
		if(node && node["attributes"] && node["attributes"].length > 0)
		{
			var arrAttributes = node.attributes;
			var length = node.attributes.length;
			var attribute = null;
			var arrBindingKeys = null;
			var arrValues = null;
			var isRepeaterCondition = false;
			var self = this;
			for(var count = 0;count < length;count++)
			{
				isRepeaterCondition = false;
				arrBindingKeys = [];
				arrValues = [];
				attribute = arrAttributes[count];
				if(attribute && attribute.name && attribute.value && attribute.value.indexOf("{{") > -1)
				{
					if(attribute.value.indexOf("..") !== -1 && !this.util.hasAttribute(node,"nsbind-repeater"))
					{
						var arrBindingKeys = this.__getBindingVariables(attribute.value);
						if(arrBindingKeys && arrBindingKeys.length > 0)
						{
							var arrValues = this.__getRepeaterValuesFromObject(arrBindingKeys,item);
							this.__mapRepeaterAttribute(node,attribute.name,arrBindingKeys,index,repeaterCondition);
							var newValue = this.__performAttributeBinding(node,arrBindingKeys,arrValues,attribute.value);
							attribute.value = newValue;
							isRepeaterCondition = true;
						}
					}
					else if(attribute.name.length > 2 && attribute.name.substring(0,2) === "on")
					{
						var eventName = attribute.name.substring(2);
			            var arrFunctionName = this.__getBindingVariables(attribute.value);
			            if(arrFunctionName && arrFunctionName.length > 0)
			            {
			            	var functionName = null;
			            	for(var innerCount = 0;innerCount < arrFunctionName.length;innerCount++)
			 	            {
			            		functionName = arrFunctionName[innerCount];
			 	            	if(this.__orignalModel[functionName] && this.util.isFunction(this.__orignalModel[functionName]))
			 		            {
			 		            	this.__registerEvent(node,eventName,this.__orignalModel[functionName].bind(this.__model));
			 		            }
			 	            }
			            	node.removeAttribute(attribute.name);
			            }
			        }
					//nsbind-style as in IE in style when we give {{}} it removes it 
					else if(attribute.name === "style" || this.__isAttributeNameSame(attribute.name,"nsbind-style"))
					{
						var arrStyleProp = attribute.value.split(";");
						if(arrStyleProp && arrStyleProp.length > 0)
						{
							var style = node.style;
							var arrProp = [];
							var jsProp = "";
							for(var styleCount = 0;styleCount < arrStyleProp.length;styleCount++)
							{
								arrProp = arrStyleProp[styleCount].split(":");
								jsProp = this.util.convertCSSPropToJS(arrProp[0]);
								var arrBindingKeys = this.__getBindingVariables(arrProp[1]);
								if(arrBindingKeys && arrBindingKeys.length > 0)
								{
									var arrValues = this.__getRepeaterValuesFromObject(arrBindingKeys);
									this.__mapRepeaterAttribute(node,arrProp[0],arrBindingKeys,index,repeaterCondition,true,jsProp);
									var newValue = this.__performAttributeBinding(node,arrBindingKeys,arrValues,arrProp[1]);
									style[jsProp] = newValue;
								}
							}
						}
					}
					else
					{
						var arrBindingKeys = this.__getBindingVariables(attribute.value);
						if(arrBindingKeys && arrBindingKeys.length > 0)
						{
							var arrValues = this.__getRepeaterValuesFromObject(arrBindingKeys);
							this.__mapRepeaterAttribute(node,attribute.name,arrBindingKeys,index,repeaterCondition);
							var newValue = this.__performAttributeBinding(node,arrBindingKeys,arrValues,attribute.value);
							attribute.value = newValue;
						}
					}
					var property = this.__getInputProperty(node);
					if(property && property === attribute.name && arrBindingKeys && arrBindingKeys.length > 0)
					{
						var arrItemRef = [];
						arrBindingKeys.forEach(function(fromKey,keyIndex) 
				    	{
				    		var itemRef = isRepeaterCondition ? self.__getRepeaterModelObject(fromKey,itemOrignal,index) : self.__getRepeaterModelObject(fromKey,self.__orignalModel);
				    		arrItemRef[keyIndex] = itemRef;
						});
						this.__checkForInput(node,property,arrItemRef,arrBindingKeys,false);
					}
				}
			}
			if(node.firstChild && node.firstChild.textContent.trim().length && node.childNodes.length < 1)
			{
				this.__parseTextNode(node.firstChild);
			}
		}
	};
	
	NSBinding.prototype.__mapRepeaterAttribute = function(node,attributeName,arrKeys,index,repeaterCondition,isStyle,styleProp) 
	{
		if(node && attributeName && arrKeys && arrKeys.length > 0)
		{
			var item = {};
		    var self = this;
		    arrKeys.forEach(function(key) 
		    {
		        if (!self.__mapRepeaterKeys[key])
		        {
		        	self.__mapRepeaterKeys[key] = {};
		        }
		        if(!self.__mapRepeaterKeys[key][repeaterCondition])
		        {
		        	self.__mapRepeaterKeys[key][repeaterCondition] = [];
		        }
		        if(!self.__mapRepeaterKeys[key][repeaterCondition][index])
		        {
		        	self.__mapRepeaterKeys[key][repeaterCondition][index] = [];
		        }
		        item = {node:node,attributeName:attributeName,html:node.outerHTML,index:index};
		        if(isStyle && styleProp)
		        {
		        	item["styleProp"] = styleProp;
		        }
		        self.__mapRepeaterKeys[key][repeaterCondition][index].push(item);
		    });
		}
	};
	
	NSBinding.prototype.__handleConditions = function(conditions)
	{
		if(conditions)
		{
			var self = this;
			conditions.forEach(function(objItem) 
			{
				self.__createRepeaterElements.bind(self)(objItem);
		    });
		}
	};
	
	//parameter is item from __arrCondition
	NSBinding.prototype.__createRepeaterElements = function(item)
	{
		if(item && item.node && item.arrData)
		{
			var length = item.arrData.length;
			this.util.removeAttribute(item.nodeOrig,"nsbind-repeater");
			item.lastNode = item.node;
			for(var count = 0;count < length;count++)
			{
				this.__createRepeaterNode(item,count);
			}
			if(item.node.parentNode)
			{
				item.parentNode = item.node.parentNode;
				item.node.parentNode.removeChild(item.node);
			}
		}
	};
	
	NSBinding.prototype.__createRepeaterNode = function(itemCondition,index)
	{
		if(itemCondition)
		{
			var cloneNode = itemCondition.nodeOrig.cloneNode(true);
			cloneNode.setAttribute("nsbind-index",index);
			if(itemCondition.lastNode)
			{
				if(itemCondition.lastNode.parentNode)
				{
					this.util.insertAfterElement(itemCondition.lastNode,cloneNode);
				}
				else if(itemCondition.parentNode)
				{
					itemCondition.parentNode.appendChild(cloneNode);
				}
				else
				{
					console.warn("Repeater has no parent node with detials " + item.lastNode);
				}
			}
			this.__parse(cloneNode,index,true,itemCondition.arrData[index],itemCondition.condition,itemCondition.arrDataOrig);
			itemCondition.lastNode = cloneNode;
		}
	};
	
	NSBinding.prototype.__pushCondition = function(node,attribute)
	{
		if(node)
		{
			var condition = this.util.getAttribute(node,"nsbind-repeater");
			condition = condition.substring(2, condition.length - 2).trim();
			var arrCondition = condition.split(" ");
			if(arrCondition && arrCondition.length > 2)
			{
				var key = arrCondition[2];
				var itemRef = this.__getRepeaterModelObject(key);
				if(itemRef)
				{
					if(itemRef.itemOrignal && this.util.isArray(itemRef.itemOrignal) && itemRef.itemParentOrig)
					{
						itemRef.itemOrignal = this.__convertToNSArray(itemRef.itemOrignal,itemRef.item);
						itemRef.itemParentOrig[key] = itemRef.itemOrignal;
						//itemRef.item = this.__convertToNSArray(itemRef.item);
						itemRef.itemParent[key] = itemRef.item;
						this.__applyWatcherOnArray(itemRef);
					}
					itemRef.orignalKey = key;
					itemRef.node = node;
					itemRef.nodeOrig = node.cloneNode(true);
					itemRef.condition = condition;
					var obj = {type:"repeater",itemParent:itemRef.itemParent,itemParentOrig:itemRef.itemParentOrig,arrData:itemRef.item,arrDataOrig:itemRef.itemOrignal,finalKey:itemRef.finalKey,orignalKey:itemRef.orignalKey,node:itemRef.node,nodeOrig:itemRef.nodeOrig,condition:itemRef.condition};
					this.__arrCondition.push(obj);
				}
			}
		}
	};
	
	NSBinding.prototype.__applyWatcherOnArray = function(itemRef)
	{
		var self = this;
		var initializeProperty = function()
		{
			if (typeof item !== "object") 
			{
				var itemTemp = {
	            	enumerable: true,
	            	configurable: true,
	                get: function() 
	                {
	                	return itemRef.itemOrignal;
	                },
	                set: function(value)
	                {
	                    self.__processArray.bind(self)(itemRef,value);
	                }
	            };
	            Object.defineProperty(itemRef.itemParentOrig,itemRef.finalKey,itemTemp);
	        } 
		};
		initializeProperty();
	};
	
	NSBinding.prototype.__processArray = function(itemRef,newValue)
	{
		var key = itemRef.finalKey;
		itemRef.item = newValue;
		itemRef.itemOrignal = newValue;
		itemRef.itemOrignal = this.__convertToNSArray(itemRef.itemOrignal,itemRef.item);
		//itemRef.itemParentOrig[key] = itemRef.itemOrignal;
		itemRef.itemParent[key] = itemRef.item;
		if(this.__arrCondition && this.__arrCondition.length > 0)
		{
			for(var count = 0;count < this.__arrCondition.length;count++)
			{
				var item = this.__arrCondition[count];
				if(item.condition == itemRef.condition && item.finalKey == itemRef.finalKey)
				{
					itemRef.parentNode = (itemRef.parentNode) ? itemRef.parentNode : item.parentNode;
					if(itemRef.parentNode)
					{
						this.util.removeAllChildren(itemRef.parentNode);
						this.util.removeStyleClass(itemRef.parentNode,this.__PROCESSED_CLASS);
					}
					item.arrData = itemRef.item;
					item.arrDataOrig = itemRef.itemOrignal;
					item.node = itemRef.node;
					for(var outerKey in this.__mapRepeaterKeys)
					{
						for(var innerKey in this.__mapRepeaterKeys[outerKey])
						{
							if(innerKey == itemRef.condition)
							{
								this.__mapRepeaterKeys[outerKey][innerKey] = [];
							}
						}
					}
					this.__handleConditions(this.__arrCondition);
					this.__applyWatcher();
					this.__applyRepeaterWatcher();
					break;
				}
			}
		}
	};
	
	NSBinding.prototype.__getRepeaterValuesFromObject = function(arrKeys,item) 
	{
	    var arrValues = [];
	    var objItem = item || this.__model;
	    var self = this;
	    if (arrKeys && arrKeys.length > 0) 
	    {
	    	arrKeys.forEach(function(fromKey) 
	    	{
	    		var itemRef = self.__getRepeaterModelObject(fromKey,objItem);
	    		if(itemRef && itemRef.itemParent)
	    		{
	    			Object.keys(itemRef.itemParent).forEach(
		            function(itemKey) 
		            {
		                if (itemRef.finalKey === itemKey) 
		                {
		                	arrValues.push(itemRef.itemParent[itemKey]);
		                }
		            });
		            if (itemRef.itemParent && typeof itemRef.itemParent === "number" || typeof itemRef.itemParent === "string") 
		            {
		            	arrValues.push(itemRef.itemParent);
		            }
	    		}
	        });
	    }
	    return arrValues;
	};
	
	NSBinding.prototype.__getRepeaterModelObject = function(key,itemRepeater,index)
	{
		var itemParent = null;
		var itemParentOrig = null;
		var item = null;
		var itemOrignal = null;
		var finalKey = "";
		var arrkey = [];
		var isRepeater = false;
		if(key.indexOf("..") === -1)
		{
			arrkey = key.split(".");
		}
		else
		{
			arrkey = key.split("..");
			isRepeater = true;
		}
		if(arrkey && arrkey.length > 0)
		{
			if(isRepeater && itemRepeater)
			{
				itemParent = itemRepeater;
				finalKey = arrkey[1];
				if(this.util.isArray(itemRepeater) && !this.util.isUndefinedOrNull(index))
				{
					itemParent = itemRepeater[index];
				}
				item = itemParent[finalKey];
			}
			else
			{
				for(var count = 0;count < arrkey.length;count++)
				{
					if(count === 0)
					{
						itemParent = this.__model;
						itemParentOrig = this.__orignalModel;
					}
					else
					{
						itemParent = itemParent[finalKey];
						itemParentOrig = itemParentOrig[finalKey];
					}
					if(!itemParent)
					{
						break;
					}
					finalKey = arrkey[count];
					item = itemParent[finalKey];
					itemOrignal = itemParentOrig[finalKey];
				}
			}
		}
		return {itemParent:itemParent,itemParentOrig:itemParentOrig,finalKey:finalKey,item:item,itemOrignal:itemOrignal};
	};
	
	NSBinding.prototype.__observingRepeaters = function(itemChange,mapKey,repeaterCondition)
	{
		
		if(this.__mapRepeaterKeys[mapKey])
		{
			var self = this;
			var replaceValue = function(item)
			{
				if(item["styleProp"])
		    	{
					var value  = oldItem[affectedKey];
		    		if(item["styleProp"] == "display" && self.util.isBoolean(value))
		    		{
		    			value = Boolean.parse(value) ? "" : "none";
		    		}
		    		item.node.style[item["styleProp"]] = value;
		    	}
		    	/*if(self.__isTextNode(item.node))
				{
		    		item.node[item.attributeName] = oldItem[affectedKey];
				}
		    	else
		    	{
		    		item.node[item.attributeName] = oldItem[affectedKey];
		    	}*/
				else
				{
					item.node[item.attributeName] = oldItem[affectedKey];
				}
			};
		    var oldItem = itemChange.obj;
		    var index = itemChange.index;
		    var affectedKey = itemChange.name;
		    var affectedNodes = [];
		    if(repeaterCondition)
		    {
		    	affectedNodes = (this.__mapRepeaterKeys[mapKey] && this.__mapRepeaterKeys[mapKey][repeaterCondition] && this.__mapRepeaterKeys[mapKey][repeaterCondition][index])? this.__mapRepeaterKeys[mapKey][repeaterCondition][index] : [];
		    }
		    else
		    {
		    	Object.keys(this.__mapRepeaterKeys[mapKey]).forEach(function(loopRepeaterCondition,repeaterIndex)
		    	{
		    		var arrControls = self.__mapRepeaterKeys[mapKey][loopRepeaterCondition];
		    		if(arrControls && arrControls.length > 0)
		    		{
		    			affectedNodes = affectedNodes.concat(arrControls);
		    		}
		    	});
		    }
		    affectedNodes.forEach(function(item) 
		    {
		    	if(self.util.isArray(item))
		    	{
		    		item.forEach(function(innerItem)
		    		{
		    			replaceValue(innerItem);
		    		});
		    	}
		    	else
		    	{
		    		replaceValue(item);
		    	}
		    });
		}
	};
	
	NSBinding.prototype.__repeaterWatcher = function(arrData,item,key,newValue,arrayIndex,arrayName,orignalKey)
	{
		var retItem = {instance: "array",arrayName:arrayName,index:arrayIndex,name:key,obj:item,oldValue:item[key],arrData:arrData};
		if (item[key] !== newValue) 
		{
			retItem["type"] = "updated";
	    } 
		else 
		{
			retItem["type"] = "";
	    }
	    return retItem;
	};
	
	/*
	 var arrAddMethods = "push,splice,unshift".split(",");
		var arrDeleteMethods = "pop,shift".split(",");
		var arrChangeMethods = "reverse,sort,splice".split(",");
	 */
	NSBinding.prototype.__convertToNSArray = function(arrData,arrDataCopy) 
	{
		if(arrData && !(arrData instanceof NSArray))
		{
			var self = this;
			var functionCallback = function(methodName,args)
			{
				/*if(methodName === "push")
				{
					//cloning the added item
					args[0] = self.util.cloneObject(args[0],true);
				}
				arrDataCopy[methodName].apply(arrDataCopy,args);*/
			};
			var itemAdded = function(event) 
			{
				for(var count = 0;count < self.__arrCondition.length;count++)
				{
					var item = self.__arrCondition[count];
					if(item.arrDataOrig == arrReturn)
					{
						if(event.item && event.method)
						{
							if(event.method === "push")
							{
								//cloning the added item
								//event.methodArguments[0] = self.util.cloneObject(event.methodArguments[0],true);
								event.item = self.util.cloneObject(event.item,true);
							}
							arrDataCopy[event.method].apply(arrDataCopy,[event.item]);
						}
						//item.arrData = item.arrDataOrig;
						self.__createRepeaterNode(item,event.index);
						self.__applyRepeaterWatcher.bind(self)(event.index);
						break;
					}
				}
			};
			var itemRemoved = function(event) 
			{
				console.log("Removed %o at index %d.", event.item, event.index);
			};
			var itemChanged = function(event) 
			{
				console.log("Set index %d to %o.", event.index, event.item);
			};
			var setting = {functionCallback:functionCallback,
					addHandler:itemAdded,
					removeHandler:itemRemoved,
					changeHandler:itemChanged,
					enableCallbackForInit:false};
			var arrReturn = new NSArray(arrData,setting);
			return arrReturn;
		}
		return arrData;
	};
	
	/******************************************************************************** End of Repeater related functions *********************************************************/
	
	/******************************************************************************** Start of Common functions *********************************************************/
	
	NSBinding.prototype.__performAttributeBinding = function(node,arrBindingKey,arrNewValue,attributeValue) 
	{
		if(node && arrBindingKey && arrBindingKey.length > 0)
		{
			var strValue = attributeValue || node.textContent;
			var length = arrBindingKey.length;
			for (var count = 0; count < length; count++) 
			{
				strValue = strValue.replace(new RegExp("{{" + arrBindingKey[count] + "}}","gi"), arrNewValue[count]);
		        if (!attributeValue)
		        {
		        	node.textContent = strValue;
		        }
		    }
		    return strValue;
		}
	};
	
	NSBinding.prototype.__checkForInput = function(element,property,arrItem,arrKey,isRepeater) 
	{
		if(element && property)
		{
			var self = this;
			arrItem.forEach(function(item,index)
			{
				if(item)
				{
					var key = arrKey[index];
					self.__addInputListerner(element,property,item,key,isRepeater);
				}
			});
		}
	};
	
	NSBinding.prototype.__addInputListerner = function(element,property,item,key,isRepeater) 
	{
		var self = this;
	    var callback = function(event)
	    {
	    	item["itemParent"][item["finalKey"]] = element[property];
	    };
	    this.__registerEvent(element,this.__getInputEvent(element),callback);
	};
	
	NSBinding.prototype.__registerEvent = function(element,eventType,functionName) 
	{
		if(element)
		{
			this.util.addEvent(element,eventType,functionName);
		}
	};
	
	NSBinding.prototype.__getBindingVariables = function(str) 
	{
		if(str == "{{country in countries}}")
		{
			console.log("In {{country in countries}}");
		}
		if(str == "{{approver in designatedApproversListForEmp}}")
		{
			console.log("In {{approver in designatedApproversListForEmp}}");
		}
		if(str && str.indexOf("{{") !== -1)
		{
			return str.trim().match(/{{\s*[\w\.]+\s*}}/g).map(function(x) 
			{
	            return x.match(/[\w\.]+/)[0];
	        });
		}
		return null;
	};
	
	NSBinding.prototype.__isTextNode = function(node)
	{
		if(node && node.nodeType === 3)
		{
			return true;
		}
		return false;
	};
	
	NSBinding.prototype.__isAttributeNameSame = function(attributeName,intendedName)
	{
		return (attributeName === intendedName || attributeName === "data-" + intendedName);
	};
	
	NSBinding.prototype.__getInputEvent = function(element)
	{
		var retValue = null;
		if(element)
		{
			switch(element.type)
			{
				case "checkbox":
					break;
				case "radio":
					break;
				default:
					retValue = "input";
					break;
			}
		}
		return retValue;
	};
	
	NSBinding.prototype.__getInputProperty = function(element)
	{
		var retValue = null;
		if(element)
		{
			switch(element.type)
			{
				case "checkbox":
					break;
				case "radio":
					break;
				default:
					retValue = "value";
					break;
			}
		}
		return retValue;
	};
	
	NSBinding.prototype.setValue = function()
	{
		 
	};
	
	NSBinding.prototype.apply = function()
	{
		
	};
	
	/******************************************************************************** End of Common functions *********************************************************/
	function NSArray(array,setting) 
	{
		var config = null;
		var util = new NSUtil();
		var arrData = [];
		var self = this;
		
		function initialize()
		{
			if(setting)
			{
				config = {
						functionCallback: (setting["functionCallback"] ? util.getFunction(setting["functionCallback"]) : null),
						handler: (setting["handler"] ? util.getFunction(setting["handler"]) : null),
						addHandler: (setting["addHandler"] ? util.getFunction(setting["addHandler"]) : null),
						removeHandler: (setting["removeHandler"] ? util.getFunction(setting["removeHandler"]) : null),
						changeHandler: (setting["changeHandler"] ? util.getFunction(setting["changeHandler"]) : null),
						enableCallbackForInit: Boolean.parse(setting["enableCallbackForInit"])
				};
			}
			Object.getOwnPropertyNames(Array.prototype).forEach(function(name) 
		    {
			    if (!(name in self)) 
			    {
			    	if(typeof Array.prototype[name] === "function")
				  	{
			    		Object.defineProperty(self,name, 
					    {
			    			configurable: false,
					    	enumerable: false,
					    	writable: false,
					    	value: function() 
					  	    {
					    		fireFunctionCallback(name,arguments);
					    		return Array.prototype[name].apply(self,arguments);
					  	    }
					    });
				  	}
			    	else
			    	{
			    		Object.defineProperty(self,name, 
			    		{
			    			configurable: false,
			    			enumerable: false,
			    			writable: false,
			    			value: Array.prototype[name]
			    		});
			    	}
			    }
		    });
			if(array instanceof Array) 
		    {
			   self.push.apply(self,array);
			   config.enableCallbackForInit = true;
		    }
		};
		
		function fireFunctionCallback(methodName,arrArgs) 
		{
			if(config.enableCallbackForInit)
			{
				if(config.functionCallback)
			   	{
			   		config.functionCallback(methodName,arrArgs);
			   	}
			}
		}
		
		function fireCallback(eventType,index,item,methodName,arrArgs) 
		{
		   if(config.enableCallbackForInit)
		   {
			   	var event = {type:eventType,index:index,item:item,method:methodName,methodArguments:arrArgs};
			   	if(eventType === "add" && config.addHandler)
			   	{
			   		config.addHandler(event);
			   	}
			   	else if(eventType === "remove" && config.removeHandler)
			   	{
			   		config.removeHandler(event);
			   	}
			   	else if(eventType === "change" && config.changeHandler)
			   	{
			   		config.changeHandler(event);
			   	}
			   	if(config.handler)
			   	{
			   		config.handler(event);
			   	}
		   }
		};
		
		function initializeIndex(index) 
		{
		    if (!(index in self)) 
		    {
		      Object.defineProperty(self,index, 
		      {
		        configurable: true,
		        enumerable: true,
		        get: function() 
		        {
		        	return arrData[index];
		        },
		        set: function(value) 
		        {
		        	arrData[index] = value;
		        	fireCallback("change",index,value,null,null);
		        }
		      });
		    }
	    };
	   
	    Object.defineProperty(this,"length", 
		{
		 	configurable: false, 
		    enumerable: false,
		    get: function() 
		    {
		    	return arrData.length;
		    },
		    set: function(value) 
		    {
			    var num = Number(value);
			    var length = arrData.length;
			    if (num % 1 === 0 && num >= 0) 
			    {        
			        if (num < length) 
			        {
			        	self.splice(num);
			        } 
			        else if (num > length) 
			        {
			        	self.push.apply(self, new Array(num - length));
			        }
			    }
			    else 
			    {
			    	throw new RangeError("Invalid array length");
			    }
			    arrData.length = num;
		    }
		});
	   
	   Object.defineProperty(this,"splice", 
	   {
		    configurable: false,
		    enumerable: false,
		    writable: false,
		    value: function(index,itemsRemovedCount) 
		    {
		    	var arrRemoved = [],item;
			    index = index == null ? 0 : index < 0 ? arrData.length + index : index;
			    itemsRemovedCount = itemsRemovedCount == null ? arrData.length - index : itemsRemovedCount > 0 ? itemsRemovedCount : 0;
			    while (itemsRemovedCount--) 
			    {
			       item = arrData.splice(index,1)[0];
			       arrRemoved.push(item);
			       delete self[arrData.length];
			       fireFunctionCallback("splice",arguments);
			       fireCallback("remove",index + arrRemoved.length - 1,item,"splice",arguments);
			    }
			    for (var count = 2;count < arguments.length;count++) 
			    {
			        arrData.splice(index,0,arguments[count]);
			        initializeIndex(arrData.length - 1);
			        fireCallback("add",index,arguments[count],"splice",arguments);
			        index++;
			    }
			    return arrRemoved;
		    }
	   });
	   
	   Object.defineProperty(this,"push", 
	   {
		    configurable: false,
		    enumerable: false,
		    writable: false,
		    value: function() 
		    {
		    	fireFunctionCallback("push",arguments);
		    	var index;
		    	for (var count = 0;count < arguments.length;count++)
		    	{
		    		index = arrData.length;
		    		arrData.push(arguments[count]);
		    		initializeIndex(index);
		    		fireCallback("add",index,arguments[count],"push",arguments);
		    	}
		    	return arrData.length;
		    }
	   });
	   
	   Object.defineProperty(this,"pop", 
	   {
		    configurable: false,
		    enumerable: false,
		    writable: false,
		    value: function() 
		    {
		    	fireFunctionCallback("pop",arguments);
		    	if (arrData.length > -1) 
		    	{
		    		var index = arrData.length - 1,
		    		item = arrData.pop();
		    		delete self[index];
		    		fireCallback("remove",index,item,"pop",arguments);
		    		return item;
		    	}
		    }
	   });
	   
	   Object.defineProperty(this,"unshift", 
	   {
		    configurable:false,
		    enumerable:false,
		    writable:false,
		    value: function() 
		    {
		    	fireFunctionCallback("unshift",arguments);
		    	for(var count = 0;count < arguments.length;count++)
		    	{
		    		arrData.splice(count,0,arguments[count]);
		    		initializeIndex(arrData.length - 1);
		    		fireCallback("add",count,arguments[count],"unshift",arguments);
		    	}
		    	for (;count < arrData.length;count++) 
		    	{
		    		fireCallback("change",count,arrData[count],"unshift",arguments);
		    	}
		    	return arrData.length;
		    }
	   });
	   
	   initialize();
	   return this;
	};
	
	return NSBinding;
})();
nsModuleExport(__nsGlobal,"NSBinding",NSBinding);