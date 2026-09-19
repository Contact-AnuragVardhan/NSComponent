package com.org.servlet;

import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.fluttercode.datafactory.impl.DataFactory;

import com.google.gson.Gson;
import com.org.util.Util;

/**
 * Servlet implementation class HierarchicalNonFirstLevelData
 */
public class HierarchicalNonFirstLevelData extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public HierarchicalNonFirstLevelData() {
        super();
        // TODO Auto-generated constructor stub
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		sendData(request,response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		sendData(request,response);
	}
	
	protected void sendData(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		try
		{
			String parentID = Util.getParamValue(request,"parentid");
			List<String> VALUES = Arrays.asList("2", "5", "8");
			if (!VALUES.contains(parentID)) 
			{
				String dataLength = Util.getParamValue(request,"datalength");
				if(dataLength == null)
				{
					dataLength = "10";
				}
				List<Map<String,Object>> lstdata = getData(Integer.parseInt(dataLength),parentID);
				response.setContentType("application/json");
				OutputStream outputStream= response.getOutputStream();
				Gson gson = new Gson();       
				outputStream.write(gson.toJson(lstdata).getBytes());
				outputStream.flush();
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	protected List<Map<String,Object>> getData(int length,String parentID)
	{
		List<Map<String,Object>> lstdata = new ArrayList<Map<String,Object>>();
		DataFactory df = new DataFactory();
		Date minDate = df.getDate(2000, 1, 1);
		Date maxDate = new Date();
		String pattern = "MM-dd-yyyy";
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
		//favorite animal
		String[] values = {"Cat","Dog","Goat","Horse","Sheep"};
		for(int count = 0;count < length;count++)
		{
			Map<String,Object> mapData = new HashMap<String, Object>();
			mapData.put("id", parentID + "" + count);
			mapData.put("firstName", df.getFirstName());
			mapData.put("lastName", df.getLastName());
			mapData.put("city", df.getCity());
			mapData.put("address", df.getAddress());
			mapData.put("phoneNumber", df.getNumberText(10));
			mapData.put("business", df.getBusinessName());
			Date start = df.getDateBetween(minDate, maxDate);
			mapData.put("birthDate", simpleDateFormat.format(start));
			mapData.put("pet", df.getItem(values,80,"None"));
			mapData.put("hobbies", df.getRandomWord(4, 10));
			mapData.put("hasChildren", true);
			lstdata.add(mapData);
		}
		return lstdata;
	}

}