package com.org.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import javax.servlet.http.HttpServletRequest;

public class Util 
{
	
	public static String getParamValue(HttpServletRequest request,String key) throws Exception
	{
		if(request != null)
		{
			StringBuilder buffer = new StringBuilder();
		    BufferedReader reader = request.getReader();
		    String line;
		    while ((line = reader.readLine()) != null) 
		    {
		        buffer.append(line);
		    }
		    String data = buffer.toString();
		    if(data != null && data.length() > 0)
		    {
		    	JSONParser parser = new JSONParser();
		    	JSONObject json = (JSONObject) parser.parse(data);
		    	return String.valueOf(json.get(key));
		    	/*Map<String,String> map = new HashMap<String, String>();
		    	String[] arrParamValue = data.split("&");
		    	for(String paramValue : arrParamValue)
		    	{
		    		if(paramValue != null)
		    		{
		    			String[] arrData = paramValue.split("=");
		    			if(arrData != null)
		    			{
		    				if(arrData.length == 2)
		    				{
		    					map.put(arrData[0], arrData[1]);
		    				}
		    				else if(arrData.length == 1)
		    				{
		    					map.put(arrData[0], null);
		    				}
		    			}
		    		}
		    	}
		    	return map.get(key);*/
		    }
		}
		return null;
	}

}