package com.org;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class CreatePackageJson 
{
	//private final String basePath = "C:\\Temp\\Anurag\\Workspace\\JSLib\\src\\main\\webapp\\package";
	private final String basePath = "F:\\New Workspace\\JSLib\\src\\main\\webapp\\package";
	
	private final String newLineChar = "\r\n";
	
	private final String tabLineChar = "\t";
	
	private final String version = "0.4.2";
	
	public static void main(String[] args) 
	{
		try
		{
			CreatePackageJson objCreatePackageJson = new CreatePackageJson();
			objCreatePackageJson.create();
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
		}
	}
	
	public void create() throws Exception
	{
		createBaseFiles();
		createGridFile();
	}
	
	private void createBaseFiles() throws Exception
	{
		Map<String,String> mapDependencies = new HashMap<String, String>();
		mapDependencies.put("nscomputil", version);
		String json = getJSON("nscomputil",version,"NsUtil","nsUtil",null,"NSUtil Class",null);
		createFile("nsUtil",json);
		json = getJSON("nscontainerbase",version,"nsContainerBase","nsContainerBase",mapDependencies,"NSComponent Base Class",null);
		createFile("nsContainerBase",json);
		json = getJSON("nssvg",version,"nsSVG","nsSVG",null,"NSSVG Class",null);
		createFile("nsSVG",json);
		json = getJSON("nspluggins",version,"nsPluggins","nsPluggins",null,"NSPluggins Class",null);
		createFile("nsPluggins",json);
		json = getJSON("nspintip",version,"nsPinTip","nsPinTip",null,"NSPinTip Class",null);
		createFile("nsPinTip",json);
		json = getJSON("nsconsole",version,"nsConsole","nsConsole",null,"NSConsole Class",null);
		createFile("nsConsole",json);
		json = getJSON("nsdateutil",version,"nsDateUtil","nsDateUtil",null,"NSDateUtil Class",null);
		createFile("nsDateUtil",json);
	}
	
	private void createGridFile() throws Exception
	{
//		String json = getJSON("nsprogressbar",version,"nsProgressBar","nsProgressBar",getDependencies(true,null),"NSProgressBar Class",null);
//		createFile("nsProgressBar",json);
		String json = getJSON("nsgrid",version,"nsGrid","nsGrid",getDependencies(true,null),"NSGrid Class",null);
		createFile("nsGrid",json);
		json = getJSON("nslist",version,"nsList","nsList",getDependencies(true,true,false,false,false,null),"NSList Class",null);
		createFile("nsList",json);
		json = getJSON("nsdividerbox",version,"nsDividerBox","nsDividerBox",getDependencies(true,true,false,false,false,null),"NSDividerBox Class",null);
		createFile("nsDividerBox",json);
		json = getJSON("nsnavigation",version,"nsNavigation","nsNavigation",getDependencies(true,true,false,false,false,null),"NSNavigation Class",null);
		createFile("nsNavigation",json);
		json = getJSON("nshorizontalnavigation",version,"nsHorizontalNavigation","nsHorizontalNavigation",getDependencies(true,true,false,false,false,null),"NSHorizontalNavigation Class",null);
		createFile("nsHorizontalNavigation",json);
		json = getJSON("nspagination",version,"nsPagination","nsPagination",getDependencies(true,false,false,false,false,null),"NSPagination Class",null);
		createFile("nsPagination",json);
		json = getJSON("nscompexport",version,"nsExport","nsExport",getDependencies(true,false,false,false,false,null),"NSExport Class",null);
		createFile("nsExport",json);
		json = getJSON("nsrouter",version,"nsRouter","nsRouter",getDependencies(true,false,false,false,false,null),"NSRouter Class",null);
		createFile("nsRouter",json);
		json = getJSON("nsmessagebox",version,"nsMessageBox","nsMessageBox",getDependencies(true,true,false,false,false,null),"NSMessageBox Class",null);
		createFile("nsMessageBox",json);
		json = getJSON("nsdatepicker",version,"nsDatePicker","nsDatePicker",getDependencies(true,true,true,false,true,null),"NSDatePicker Class",null);
		createFile("nsDatePicker",json);
		Map<String,String> mapDep = new HashMap<String, String>();
		mapDep.put("nsgrid", version);
		json = getJSON("nstextbox",version,"nsTextBox","nsTextBox",getDependencies(true,true,false,false,false,mapDep),"NSTextBox Class",null);
		createFile("nsTextBox",json);
		json = getJSON("nsxlsxexport",version,"nsXlsxExport","nsXlsxExport",getDependencies(true,false,false,false,false,null),"NSXlsxExport Class",null);
		createFile("nsXlsxExport",json);
		json = getJSON("nsmultiselectdropdown",version,"nsMultiSelectDropdown","nsMultiSelectDropdown",getDependencies(true,true,false,false,false,null),"NSMultiSelectDropdown Class",null);
		createFile("nsMultiSelectDropdown",json);
		json = getJSON("nstablerowmover",version,"nsTableRowMover","nsTableRowMover",getDependencies(true,false,false,false,false,null),"NSTableRowMover Class",null);
		createFile("nsTableRowMover",json);
		json = getJSON("nsnumerictextbox",version,"nsNumericTextBox","nsNumericTextBox",getDependencies(true,false,false,false,false,null),"NSNumericTextBox Class",null);
		createFile("nsNumericTextBox",json);
		json = getJSON("nstabnavigator",version,"nsTabNavigator","nsTabNavigator",getDependencies(true,true,false,false,false,null),"NSTabNavigator Class",null);
		createFile("nsTabNavigator",json);
		json = getJSON("nsajax",version,"nsAjax","nsAjax",getDependencies(true,false,false,false,false,null),"NSAjax Class",null);
		createFile("nsAjax",json);
		json = getJSON("nscompevent",version,"nsEvent","nsEvent",getDependencies(true,false,false,false,false,null),"nsEvent Class",null);
		createFile("nsEvent",json);
		json = getJSON("nseditor",version,"nsEditor","nsEditor",getDependencies(true,true,false,false,false,null),"NSEditor Class",null);
		createFile("nsEditor",json);
		json = getJSON("nsscroller",version,"nsScroller","nsScroller",getDependencies(true,false,false,false,false,null),"NSScroller Class",null);
		createFile("nsScroller",json);
		json = getJSON("nsdocxexport",version,"nsDocxExport","nsDocxExport",getDependencies(true,false,false,false,false,null),"NSDocxExport Class",null);
		createFile("nsDocxExport",json);
		json = getJSON("nsvirtualscroll",version,"nsVirtualScroll","nsVirtualScroll",getDependencies(true,false,false,false,false,null),"NSVirtualScroll Class",null);
		createFile("nsVirtualScroll",json);
		json = getJSON("nspromise",version,"nsPromise","nsPromise",getDependencies(true,false,false,false,false,null),"NSPromise Class",null);
		createFile("nsPromise",json);
		json = getJSON("nsdashboard",version,"nsDashboard","nsDashboard",getDependencies(true,true,false,false,false,null),"NSDashboard Class",null);
		createFile("nsDashboard",json);
		json = getJSON("nspanel",version,"nsPanel","nsPanel",getDependencies(true,true,false,false,false,null),"NSPanel Class",null);
		createFile("nsPanel",json);
		
		
		/*json = getJSON("nsmenu",version,"nsMenu","nsMenu",getDependencies(true,null),"NSMenu Class",null);
		createFile("nsMenu",json);
		json = getJSON("nspanel",version,"nsPanel","nsPanel",getDependencies(true,null),"NSPanel Class",null);
		createFile("nsPanel",json);
		json = getJSON("nscalendar",version,"nsCalendar","nsCalendar",getDependencies(true,null),"NSCalendar Class",null);
		createFile("nsCalendar",json);*/
	}
	
	private Map<String,String> getDependencies(boolean loadDefault,Map<String,String> mapExtra)
	{
		Map<String,String> mapDependencies = new HashMap<String, String>();
		if(loadDefault)
		{
			mapDependencies = getDependencies(true,true,true,true,true,mapExtra);
		}
		return mapDependencies;
	}
	
	private Map<String,String> getDependencies(boolean includeUtil,boolean includeBase,boolean includeSVG,boolean includePluggins,boolean includeDateUtil,Map<String,String> mapExtra)
	{
		Map<String,String> mapDependencies = new HashMap<String, String>();
		if(includeUtil)
		{
			mapDependencies.put("nscomputil", version);
		}
		if(includeBase)
		{
			mapDependencies.put("nscontainerbase", version);
		}
		if(includeSVG)
		{
			mapDependencies.put("nssvg", version);
		}
		if(includePluggins)
		{
			mapDependencies.put("nspluggins", version);
		}
		if(includeDateUtil)
		{
			mapDependencies.put("nsdateutil", version);
		}
		if(mapExtra != null && mapExtra.size() > 0)
		{
			mapDependencies.putAll(mapExtra);
		}
		return mapDependencies;
	}
	
	private void createFile(String compName,String content) throws IOException
	{
		String filePath = getFilePath(compName);
		FileOutputStream outputStream = new FileOutputStream(filePath);
	    byte[] strToBytes = content.getBytes();
	    outputStream.write(strToBytes);
	    outputStream.close();
	}
	
	private String getJSON(String repository,String version,String title,String mainFile,Map<String,String> dependencies,String description,String[] keywords)
	{
		StringBuilder str = new StringBuilder();
		str.append("{" + newLineChar);
		setKeyValue(str,"name",repository);
		setKeyValue(str,"version",version);
		setKeyValue(str,"title",title);
		setKeyValue(str,"description",description);
		setKeyValue(str,"main",mainFile + ".min.js");
		//setKeyValueArray(str,"files",files);
		setKeyValueMap(str,"dependencies",dependencies);
		setKeyValueArray(str,"keywords",keywords);
		if(str.charAt(str.length() - 3) == ',')
		{
			str.deleteCharAt(str.length() - 3);
		}
		str.append("}" + newLineChar);
		
		return str.toString();
	}
	
	private void setKeyValueMap(StringBuilder str,String key,Map<String,String> mapValue)
	{
		if(mapValue != null && mapValue.size() > 0)
		{
			String finalVal = "";
			for (Map.Entry<String,String> entry : mapValue.entrySet())  
			{
				finalVal += tabLineChar + tabLineChar  + getReplaceString(entry.getKey()) + ": " + getReplaceString(entry.getValue())  + "," + newLineChar;
			}
			int index = finalVal.length() - 3;
			if(finalVal.charAt(index) == ',')
			{
				finalVal = finalVal.substring(0, index) + finalVal.substring(index + 1);
			}
			finalVal = "{" + newLineChar + finalVal + tabLineChar +"}";
			setKeyValueWithoutReplace(str,key,finalVal);
		}
	}
	
	private void setKeyValueArray(StringBuilder str,String key,String[] arrValue)
	{
		if(arrValue != null && arrValue.length > 0)
		{
			String finalVal = "";
			for(String value: arrValue)
			{
				finalVal += tabLineChar + tabLineChar + getReplaceString(value) + "," + newLineChar;
			}
			finalVal = "[" + newLineChar + finalVal + tabLineChar +"]";
			setKeyValueWithoutReplace(str,key,finalVal);
		}
	}
	
	private void setKeyValue(StringBuilder str,String key,String value)
	{
		if(value != null && value.length() > 0)
		{
			String val = tabLineChar + getReplaceString(key) + ": " + getReplaceString(value) + "," + newLineChar;
			str.append(val);
		}
	}
	
	private void setKeyValueWithoutReplace(StringBuilder str,String key,String value)
	{
		if(value != null && value.length() > 0)
		{
			String val = tabLineChar + getReplaceString(key) + ": " + value + "," + newLineChar;
			str.append(val);
		}
	}
	
	private String getReplaceString(String str)
	{
		return "\"" + str + "\"";
	}
	
	private String getFilePath(String compName)
	{
		return basePath + "\\" + compName + "\\package.json";
	}

}