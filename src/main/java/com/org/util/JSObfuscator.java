package com.org.util;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import org.json.simple.JSONObject;

import com.google.gson.Gson;

public class JSObfuscator 
{
	public String getObfuscatedCode(String code) throws Exception 
	{
		//String url = "http://localhost:3000/obfuscate";
		String url = "https://obfuscator.io/obfuscate";
		JSONObject parent = new JSONObject();
		JSONObject options = new JSONObject();
		options.put("compact", true);
		options.put("controlFlowFlattening", false);
		options.put("controlFlowFlatteningThreshold", 0.75);
		options.put("deadCodeInjection", false);
		options.put("deadCodeInjectionThreshold", 0.4);
		options.put("debugProtection", false);
		options.put("debugProtectionInterval", false);
		options.put("disableConsoleOutput", false);
		//options.put("domainLock",[]);
		options.put("hydrated", true);
		options.put("identifierNamesGenerator", "hexadecimal");
		options.put("identifiersPrefix", "");
		options.put("renameGlobals", false);
		//options.put("reservedNames", new String[] {"NSContainerBase"});
		//options.put("reservedStrings", new String[] {"NSContainerBase"});
		options.put("rotateStringArray", true);
		options.put("rotateStringArrayEnabled", true);
		options.put("seed", 0);
		options.put("selfDefending", false);
		options.put("sourceMap", false);
		options.put("sourceMapBaseUrl", "");
		options.put("sourceMapFileName", "");
		options.put("sourceMapMode", "inline");
		options.put("sourceMapSeparate", false);
		options.put("stringArray", true);
		options.put("stringArrayEncoding", false);
		options.put("stringArrayEncodingEnabled", true);
		options.put("stringArrayThreshold", 0.8);
		options.put("stringArrayThresholdEnabled", true);
		options.put("target", "browser");
		options.put("transformObjectKeys", false);
		options.put("unicodeEscapeSequence", false);
		parent.put("code",code);
		parent.put("options", options);
		
		//System.setProperty("https.proxyHost", "applicationwebproxy.nomura.com");
        //System.setProperty("https.proxyPort", "80");
		
		URL obj = new URL(url);
		//HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

		con.setRequestMethod("POST");
		con.setRequestProperty("Accept", "application/json");
		con.setRequestProperty("Content-type", "application/json");
		con.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36");
		
		con.setDoOutput(true);
        con.setDoInput(true);
        
        OutputStream os = con.getOutputStream();
        os.write(parent.toString().getBytes());
        os.close();
        
        InputStream in = new BufferedInputStream(con.getInputStream());
        String result = org.apache.commons.io.IOUtils.toString(in);
        
        Gson gson = new Gson();
        Map map = gson.fromJson(result, Map.class);
        //System.out.println(map.get("code"));
        
        in.close();
        con.disconnect();
        
        return (String)map.get("code");
	}
}   