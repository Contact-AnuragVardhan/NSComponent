"use strict";
var NSFilter = (function()
{
	function NSFilter(data,filter,setting,recordLimit,isHierarchical,childField,filterFunction,hierarchyFilterChildren,arrIgnoreKeysInCloneDataSource) 
	{
		this.EXACT = "exact";
		this.STARTS_WITH = "startsWith";
		this.ENDS_WITH = "endsWith";
		this.CONTAINS = "contains";
		
		this.IS_FOUND_FIELD = "__nsFilter__found";
		
		this.util = new NSUtil();
		this.__data = data;
		this.__filter = filter;
		this.__setting = setting;
		this.__recordLimit = (parseInt(recordLimit) > 0) ? recordLimit : -1;
		this.__isHierarchical = this.util.isUndefined(isHierarchical) ? false : Boolean.parse(isHierarchical);
		this.__childField = childField ? childField : "children";
		this.__filterFunction = filterFunction;
		this.__hierarchyFilterChildren = hierarchyFilterChildren;
		this.__arrIgnoreKeysInCloneDataSource = arrIgnoreKeysInCloneDataSource;
		this.__ignoreSameLevelNode = true;
	}
	
	NSFilter.prototype.execute = function(data,filter,setting,recordLimit,isHierarchical,childField,filterFunction,hierarchyFilterChildren,arrIgnoreKeysInCloneDataSource) 
	{ 
		data = data ? data : this.__data;
		filter = filter ? filter : this.__filter;
		setting = setting ? setting : this.__setting;
		recordLimit = (parseInt(recordLimit) > 0) ? recordLimit : this.__recordLimit;
		isHierarchical = this.util.isUndefined(isHierarchical) ? Boolean.parse(this.__isHierarchical) : Boolean.parse(isHierarchical);
		childField = childField ? childField : this.__childField;
		filterFunction = filterFunction ? filterFunction : this.__filterFunction;
		hierarchyFilterChildren = hierarchyFilterChildren ? hierarchyFilterChildren : this.__hierarchyFilterChildren;
		arrIgnoreKeysInCloneDataSource = this.util.isUndefinedOrNull(arrIgnoreKeysInCloneDataSource) ? this.__arrIgnoreKeysInCloneDataSource : arrIgnoreKeysInCloneDataSource;
		if(data && filter)
		{
			var dataSource = data.slice(0);
			var arrFilter = [];
			var self = this;
			var callFilterFunction = function(source,level,parentItem)
			{
				var arrReturn = [];
				for (var count = 0; count < source.length; count++) 
				{
					var item = source[count];
					var found = false;
					if(isHierarchical && item[childField] && item[childField].length > 0 )
					{
						var arrChild = callFilterFunction(item[childField],level + 1,item);
						if(arrChild && arrChild.length > 0)
						{
							found = true;
							if(self.__ignoreSameLevelNode)
							{
					            item[childField] = arrChild;
							}
							arrReturn.push(item);
						}
					}
					if(!found && self.__filterItem(item,filter,setting,isHierarchical,childField,parentItem,filterFunction))
					{
						if(isHierarchical && hierarchyFilterChildren)
						{
							var arrChildren = item[childField];
							if(arrChildren && arrChildren.length > 0)
							{
								var childItem = null;
								var childLength = arrChildren.length;
								for(var childCount = childLength - 1;childCount > -1;childCount--)
								{
									childItem = arrChildren[childCount];
									if(childItem)
									{
										if(!hierarchyFilterChildren(childItem,childCount,childItem[self.IS_FOUND_FIELD],filter,setting,item))
										{
											arrChildren.splice(childCount, 1);
										}
									}
								}
							}
						}
						found = true;
						arrReturn.push(item);
						if(!isHierarchical && recordLimit > 0 && arrReturn.length >= recordLimit)
						{
							break;
						}
					}
				}
				//return false;
				return arrReturn;
			};
			var callNonHierarchicalFilterFunction = function(source)
			{
				var arrReturn = [];
				for (var count = 0; count < source.length; count++) 
				{
					var item = source[count];
					if(self.__filterItemNonHierarchical(item,filter,setting,filterFunction))
					{
						arrReturn.push(item);
					}
				}
				return arrReturn;
			};
			dataSource = this.util.cloneObject(dataSource,isHierarchical,[],arrIgnoreKeysInCloneDataSource);
			if(isHierarchical)
			{
				arrFilter = callFilterFunction(dataSource,1,null);
			}
			else
			{
				arrFilter = callNonHierarchicalFilterFunction(dataSource);
			}
			return arrFilter;
		}
		return data;
	};
	
	NSFilter.prototype.__filterItemNonHierarchical = function(item,filter,setting,filterFunction) 
	{
		var retValue = false;
		if(filterFunction)
		{
			retValue = filterFunction(item,filter,setting);
			this.__setItem(item,retValue);
			return retValue;
		}
		else if(filter instanceof Function) 
	    {
			retValue = filter(item,setting);
	        this.__setItem(item,retValue);
	        return retValue;
	    }
	    else if(filter instanceof Array) 
	    {
	        for (var count = 0; count < filter.length; ++count) 
	        {
	            if (this.__filterItemNonHierarchical(item,filter[count],setting,filterFunction))
	            {
	            	this.__setItem(item,true);
	            	return true;
	            }
	        }
	        return false;
	    }
	    else if(setting.type === "date" && filter)
	    {
	        return this.__filterDate(item,filter,setting);
	    }
	    else if(typeof(item) === "string" && filter)
	    {
	        return this.__filterString(item,filter,setting);
	    }
	    else if (item === item + 0 && filter)
	    {
	        return this.__filterNumeric(item,filter);
	    }
	    else if(typeof (filter) === "object") 
	    {
	        for(var key in filter) 
	        {
	        	var tempSetting = {};
	        	if(setting && setting[key])
	        	{
	        		tempSetting = setting[key];
	        	}
	            if(!this.__filterItemNonHierarchical(item[key],filter[key],tempSetting,filterFunction))
	            {
	            	return false;
	            }
	        }
	        this.__setItem(item,true);
	        return true;
	    }
		retValue = (filter == item);
	    this.__setItem(item,retValue);
	    return retValue;
	};
	
	NSFilter.prototype.__filterItem = function(item,filter,setting,isHierarchical,childField,parentItem,filterFunction) 
	{
		var retValue = false;
		if(filterFunction)
		{
			retValue = filterFunction(item,filter,setting,isHierarchical,childField,parentItem);
			this.__setItem(item,retValue);
			return retValue;
		}
		else if(filter instanceof Function) 
	    {
			retValue = filter(item,setting);
	        this.__setItem(item,retValue);
	        return retValue;
	    }
	    else if(filter instanceof Array) 
	    {
	        for (var count = 0; count < filter.length; ++count) 
	        {
	            if (this.__filterItem(item,filter[count],setting,isHierarchical,childField,parentItem,filterFunction))
	            {
	            	this.__setItem(item,true);
	            	return true;
	            }
	        }
	        return false;
	    }
	    else if(setting.type === "date" && filter)
	    {
	        return this.__filterDate(item,filter,setting);
	    }
	    else if(typeof(item) === "string" && filter)
	    {
	        return this.__filterString(item,filter,setting);
	    }
	    else if (item === item + 0 && filter)
	    {
	        return this.__filterNumeric(item,filter);
	    }
	    else if(typeof (filter) === "object") 
	    {
	        for(var key in filter) 
	        {
	        	if(isHierarchical && key === childField)
	        	{
	        		continue;
	        	}
	        	var tempSetting = {};
	        	if(setting && setting[key])
	        	{
	        		tempSetting = setting[key];
	        	}
	            if(!this.__filterItem(item[key],filter[key],tempSetting,isHierarchical,childField,parentItem,filterFunction))
	            {
	            	return false;
	            }
	        }
	        this.__setItem(item,true);
	        return true;
	    }
		retValue = (filter == item);
	    this.__setItem(item,retValue);
	    return retValue;
	};
	
	NSFilter.prototype.__setItem = function(item,isFound)
	{
		if(item && typeof (item) === "object" && isFound)
		{
			item[this.IS_FOUND_FIELD] = true;
		}
	};
	
	NSFilter.prototype.__filterNumeric= function(value,searchParam)
	{
		var retValue = false;
		value = parseFloat(value);
		if(!isNaN(value))
		{
			if(/<=/.test(searchParam)) // first checks if there is an operator (<,>,<=,>=)
			{
				retValue = (value <= parseFloat(searchParam.replace(/<=/,"")));
			}
			else if(/>=/.test(searchParam))
			{
				retValue = (value >= parseFloat(searchParam.replace(/>=/,"")));
			}
			else if(/</.test(searchParam))
			{
				retValue = (value < parseFloat(searchParam.replace(/</,"")));
			}
			else if(/>/.test(searchParam))
			{
				retValue = (value > parseFloat(searchParam.replace(/>/,"")));
			}
			else
			{
				retValue = (value === parseFloat(searchParam));
			}
		}
		return retValue;
	};
	
	NSFilter.prototype.__filterDate= function(value,searchParam,setting)
	{
		var retValue = false;
		var self = this;
		var matchValue = function(compareValue,opt)
		{
			var compValue = false;
			if(self.util.isUndefinedOrNull(value))
			{
				compValue = false;
			}
			else
			{
				var newVal = self.__getDate(value,setting.cellFormat);
				if(newVal)
				{
					newVal.setHours(0, 0, 0, 0);
					compareValue.setHours(0, 0, 0, 0);
					switch(opt)
					{
						case "equals":
							if (compareValue.getTime() === newVal.getTime()) 
							{
								compValue = true;
				            }
						break;
						case "greaterThan":
							if (compareValue.getTime() < newVal.getTime()) 
							{
								compValue = true;
				            }
						break;
						case "lessThan":
							if (compareValue.getTime() > newVal.getTime()) 
							{
								compValue = true;
				            }
						break;
						case "notEqual":
							if (compareValue.getTime() != newVal.getTime()) 
							{
								compValue = true;
				            }
						break;
					}
				}
				else
				{
					self.util.warning("NSFilter",value + " cannot be converted to date Object for given cell format");
					compValue = false;
				}
			}
			return compValue;
		};
		var processDate = function(date,type)
		{
			var compValue = false;
			if(date && matchType1)
			{
				if(!date || !Object.prototype.toString.call(date) === '[object Date]')
				{
					compValue = true;
				}
				else if(setting.comparator)
				{
					compValue = setting.comparator(value,date,setting);
				}
				else
				{
					compValue = matchValue(date,type);
				}
			}
			return compValue;
		};
		if(setting.matchType1 || setting.matchType2)
		{
			var matchType1 = setting.matchType1;
			var firstDate = setting.firstDate;
			var operation = setting.operation;
			var matchType2 = setting.matchType2;
			var secondDate = setting.secondDate;
			if(this.util.isUndefinedOrNull(value))
			{
				retValue = false;
			}
			else if(firstDate && secondDate && matchType1 && matchType2 && operation)
			{
				var firstVal = processDate(firstDate,matchType1);
				var secondVal = processDate(secondDate,matchType2);
				switch(operation)
				{
					case "and":
						retValue = (firstVal && secondVal);
					break;
					case "or":
						retValue = (firstVal || secondVal);
					break;
				}
			}
			else if(firstDate && matchType1)
			{
				retValue = processDate(firstDate,matchType1);
			}
			else if(secondDate && matchType2)
			{
				retValue = processDate(secondDate,matchType2);
			}
			else
			{
				retValue = true;
			}
		}
		else
		{
			if(!searchParam || !Object.prototype.toString.call(searchParam) === '[object Date]')
			{
				retValue = true;
			}
			else if(setting.comparator)
			{
				retValue = setting.comparator(value,searchParam,setting);
			}
			else if(this.util.isUndefinedOrNull(value))
			{
				retValue = false;
			}
			else
			{
				retValue = matchValue(searchParam,"equals");
			}
		}
		return retValue;
	};
	
	NSFilter.prototype.__filterString= function(value,searchParam,setting)
	{
		var regExp = null;
		var regExpModifier = "g";
		var startWithChar = "(^)";
		var endsWithChar = "($)";
		var searchString = "";
		var isCaseSensitive = false;
		var isMultiline = false;
		var matchType = this.CONTAINS;
		if(setting)
		{
			isCaseSensitive = Boolean.parse(setting["caseSensitive"]);
			isMultiline = Boolean.parse(setting["multiline"]);
			matchType = setting["matchType"] ? setting["matchType"] : matchType;
		}
		if(!isCaseSensitive)
		{
			regExpModifier += "i";
		}
		if(isMultiline)
		{
			regExpModifier += "m";
		}
		searchParam = this.__removeSpecialCharacter(searchParam);
		if(matchType === this.EXACT)
		{
			searchString = startWithChar + searchParam + endsWithChar;
		}
		else if(matchType === this.STARTS_WITH)
		{
			searchString = startWithChar + searchParam;
		}
		else if(matchType === this.ENDS_WITH)
		{
			searchString = searchParam + endsWithChar;
		}
		else 
		{
			searchString = searchParam;
		}
		regExp = new RegExp(searchString,regExpModifier);
		return regExp.test(value);
	};
	
	NSFilter.prototype.__removeSpecialCharacter = function(text)
	{
		function replaceEscape(char)
		{
			if(text)
			{
				var exp = new RegExp("\\" + char,"g");
				text = text.replace(exp,"\\" + char);
			}
		}
		var specialChar = ['\\','[','^','$','.','|','?','*','+','(',')'];
		for(var count = 0;count < specialChar.length;count++) 
		{
			replaceEscape(specialChar[count]);
		}
		return text;
	};
	
	//ref from : https://stackoverflow.com/questions/7445328/check-if-a-string-is-a-date-value
	NSFilter.prototype.__getDate = function(value,arrFormat) 
	{
		if(value)
		{
			var dateFormat;
		    if (Object.prototype.toString.call(value) === '[object Date]') 
		    {
		        return value;
		    }
		    if(arrFormat)
		    {
		    	var dateUtil = new NSDateUtil();
		    	if(!this.util.isArray(arrFormat))
		    	{
		    		arrFormat = [arrFormat];
		    	}
		    	for(var count = 0;count < arrFormat.length;count++)
		    	{
		    		var format = arrFormat[count];
		    		var date = dateUtil.parseString(value,format);
		    		if(date)
		    		{
		    			return date;
		    		}
		    	}
		    }
		    else
		    {
		    	if (typeof value.replace === 'function') 
			    {
			        value.replace(/^\s+|\s+$/gm, '');
			    }
			    dateFormat = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
			    if(dateFormat.test(value))
			    {
			    	return new Date(value);//Date.parse(value);
			    }
		    }
		}
	    return null;
	};
	
	return NSFilter;
})();
nsModuleExport(__nsGlobal,"NSFilter",NSFilter);