package com.org.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class FileMerger 
{
	protected static final String JS = "js";
	protected static final String CSS = "css";
	
	protected static final char LINE_FEED = '\n';
    protected static final char CARRIAGE_RETURN = '\r';
    protected static final char SPACE = ' ';
    protected static final char TAB = '\t';
    
    protected String currentScript = "";
    protected StringBuffer outputBuffer;
    protected int pos;
    protected char ch;
    protected char lastAppend;
    protected boolean endReached;
    protected boolean contentAppendedAfterLastIdentifier = true;
    protected boolean includeNewFile;
    protected boolean includeStartText = false;
    protected boolean isCodeForAngular = false;
    protected boolean jsCompress = false;
    protected boolean jsObfuscate = false;
    
    public boolean getIncludeNewFile() {
		return includeNewFile;
	}

	public void setIncludeNewFile(boolean includeNewFile) {
		this.includeNewFile = includeNewFile;
	}

	public void compressFiles(String[] arrInputFile,String outputFile,String startText) throws Exception
	{
    	if(arrInputFile != null && arrInputFile.length > 0 && outputFile != null)
		{
    		String fileType = "";
    		String separator = "\\";
    		String outputDirPath = outputFile.substring(0,outputFile.lastIndexOf(separator));
    		String outputFileName = outputFile.substring(outputFile.lastIndexOf(separator) + separator.length());
    		String tempDirPath = outputDirPath + separator + "temp";
    		StringBuilder outputScript = new StringBuilder();
    		if(outputFile.endsWith(JS))
    		{
    			fileType = JS;
    		}
    		else if(outputFile.endsWith(CSS))
    		{
    			fileType = CSS;
    		}
    		if(includeStartText)
    		{
    			if(startText != null && startText.length() > 0)
    			{
    				String inputScript = startText;
        			if(JS.equals(fileType))
    				{
        				inputScript = "if(!nsIsWeb())\r\n" +
        						"		{\r\n" + 
        						          inputScript + "\r\n" + 
		    					"		}\r\n";
        						
        				String nsModuleExport = "var nsModuleExport = function(root,name,prototype)\r\n" + 
		    					"	{\r\n" + 
		    					"		if(typeof exports === 'object' && typeof module === 'object')\r\n" + 
		    					"		{\r\n" + 
		    					"			module.exports[name] = prototype;\r\n" + 
		    					"		}\r\n" + 
		    					"		else if (typeof define === \"function\" && define.amd)\r\n" + 
		    					"		{\r\n" + 
		    					"			define(name,[], function () {return prototype;});\r\n" + 
		    					"		}\r\n" + 
		    					"		else if(typeof exports === 'object')\r\n" + 
		    					"		{\r\n" + 
		    					"			exports[name] = prototype;\r\n" + 
		    					"		}\r\n" + 
		    					"		else\r\n" + 
		    					"		{\r\n" + 
		    					"			root[name] = prototype;\r\n" + 
		    					"		}\r\n" + 
		    					"	};"
		    					+ "var __nsGlobal = (function () {\r\n"
		    					+ "	if (typeof globalThis !== \"undefined\") return globalThis;\r\n"
		    					+ "	if (typeof self !== \"undefined\") return self;\r\n"
		    					+ "	if (typeof window !== \"undefined\") return window;\r\n"
		    					+ "	if (typeof global !== \"undefined\") return global;\r\n"
		    					+ "	return Function(\"return this\")();\r\n"
		    					+ "})();";
        				String nsIsWeb = "var nsIsWeb = function(root)\r\n" + 
		    					"	{\r\n" + 
		    					"		if(typeof exports === 'object' && typeof module === 'object')\r\n" + 
		    					"		{\r\n" + 
		    					"			return false;\r\n" + 
		    					"		}\r\n" + 
		    					"		else if (typeof define === \"function\" && define.amd)\r\n" + 
		    					"		{\r\n" + 
		    					"			return false;\r\n" + 
		    					"		}\r\n" + 
		    					"		else if(typeof exports === 'object')\r\n" + 
		    					"		{\r\n" + 
		    					"			return false;\r\n" + 
		    					"		}\r\n" + 
		    					"		else\r\n" + 
		    					"		{\r\n" + 
		    					"			return true;\r\n" + 
		    					"		}\r\n" + 
		    					"	};";
        				nsModuleExport = nsModuleExport + nsIsWeb;
        				if(jsCompress)
    				    {
        					String tempPath = tempDirPath + separator + "startTextFile.js";
        					writeInFile(tempPath,nsModuleExport);
        					JSMinifier objJS = new JSMinifier();
        					nsModuleExport = objJS.process(tempPath);
        					deleteInFile(tempPath);
    				    }
        				outputScript.append(nsModuleExport);
        				if(jsCompress)
    				    {
        					String tempPath = tempDirPath + separator + "startTextFile.js";
        					writeInFile(tempPath,inputScript);
        					JSMinifier objJS = new JSMinifier();
        					inputScript = objJS.process(tempPath);
        					deleteInFile(tempPath);
    				    }
    				}
        			else
        			{
        				String tempPath = tempDirPath + separator + "startTextFile.css";
        				writeInFile(tempPath,inputScript);
        				deleteInFile(tempPath);
        			}
        			outputScript.append(inputScript);
    			}
    		}
    		else if(isCodeForAngular && JS.equals(fileType))
    		{
    			String nsModuleExport = "var nsModuleExport = function(root,name,prototype)\r\n" + 
    					"	{\r\n" + 
    					"		root[name] = prototype;\r\n" +
    					"	};";
    			outputScript.append(nsModuleExport);
    		}
    		for (String filename : arrInputFile)
 		    {
    			if(filename != null && filename.length() > 0)
    			{
    				String inputScript = "";
    				if(JS.equals(fileType))
    				{
    					inputScript = readFile(filename);
    					String tempPath = tempDirPath + separator + outputFileName;
    					writeInFile(tempPath,inputScript);
    				    if(jsCompress)
    				    {
    				    	JSMinifier objJS = new JSMinifier();
        				    inputScript = objJS.process(tempPath);
    				    }
    				}
    				else
    				{
    					//CSSMinifier objCSS = new CSSMinifier();
    				    //inputScript = objCSS.process(filename);
    					inputScript = readFile(filename);
         		    	//inputScript = compressScript(inputScript);
    				}
     		    	//inputScript = inputScript.replaceAll("\\r", "").replaceAll("\\n", "");
     		    	//outputScript.append("\n\r" + "/*********" + filename + "**********/" + "\n\r");
     		    	outputScript.append(inputScript);
    			}
    			else
    			{
    				System.out.println("File Name is empty with array " + arrInputFile.toString() + " and outputFile " + outputFile);
    			}
 		    }
    		deleteDirectory(tempDirPath);
    		String outputScriptStr = outputScript.toString();
     		if(JS.equals(fileType))
 			{
     			if(jsObfuscate && outputScript.toString().length() > 0)
     			{
     				JSObfuscator objJSObfuscator = new JSObfuscator();
     				outputScriptStr = objJSObfuscator.getObfuscatedCode(outputScriptStr);
     				//outputScriptStr = outputScriptStr.replaceAll("nsContainerBase", "NSContainerBase");
     				//outputScriptStr = outputScriptStr.replaceAll("nsDividerBox", "NSDividerBox");
     			}
 			}
    		File file = new File(outputFile);
    		file.getParentFile().mkdirs();
    		FileWriter outputFileWriter = new FileWriter(file);
		    outputFileWriter.write(outputScriptStr);
		    outputFileWriter.close();
		}
	}
	
	public void deleteDirectory(String directoryFilePath) throws IOException
	{
		File file = new File(directoryFilePath);
	    if(file.exists())
	    {
	        do
	        {
	        	deleteFile(file);
	        }
	        while(file.exists());
	    }
	    else
	    {
	        //System.out.println("File or Folder not found : " + directoryFilePath);
	    }
	}
	
	private void writeInFile(String path,String script) throws Exception
	{
		File file = new File(path);
		file.getParentFile().mkdirs();
		FileWriter outputFileWriter = new FileWriter(file);
	    outputFileWriter.write(script);
	    outputFileWriter.close();
	}
	
	private void deleteInFile(String path) throws Exception
	{
		File file = new File(path); 
		file.delete();
		/*if(file.delete()) 
        { 
            System.out.println("startTextFile File deleted successfully"); 
        } 
        else
        { 
            System.out.println("Failed to delete the startTextFile file"); 
        }*/
	}
	
	private void deleteFile(File file)
	{
	    if(file.isDirectory())
	    {
	        String fileList[] = file.list();
	        if(fileList.length == 0)
	        {
	            //System.out.println("Deleting Directory : "+file.getPath());
	            file.delete();
	        }
	        else
	        {
	            int size = fileList.length;
	            for(int i = 0 ; i < size ; i++)
	            {
	                String fileName = fileList[i];
	                //System.out.println("File path : "+file.getPath()+" and name :"+fileName);
	                String fullPath = file.getPath()+"/"+fileName;
	                File fileOrFolder = new File(fullPath);
	                //System.out.println("Full Path :" + fileOrFolder.getPath());
	                deleteFile(fileOrFolder);
	            }
	        }
	    }
	    else
	    {
	        //System.out.println("Deleting file : "+file.getPath());
	        file.delete();
	    }
	}
    
    public String readFile(String fileName) 
    {    
        File file = new File(fileName);    
        char[] buffer = null;    
        try 
        {    
            BufferedReader bufferedReader = new BufferedReader(new FileReader(file));    
            buffer = new char[(int)file.length()];    
            int i = 0;    
            int c = bufferedReader.read();    
            while (c != -1) 
            {    
                buffer[i++] = (char)c;    
                c = bufferedReader.read();    
            }    
        } 
        catch (IOException e) 
        {    
            e.printStackTrace();    
        }    
        return new String(buffer);    
    }
    
}