package com.org.modified;

import com.org.modified.util.JSCompilerUtil;
import org.mozilla.javascript.Context;

public class JSProcessor {

	public static void main(String[] args) {
		try {
			String jsCode = "\"use strict\";\r\n"
					+ " var x = 10\r\n"
					+ " y = 10;\r\n";
			//String jsCode = "var x = 10;";
			JSCompilerUtil.checkJSCompileTimeErrors(jsCode);
			//System.out.println(JSCompilerUtil.checkSyntaxErrors(jsCode));
			//JSCompilerUtil.checkSyntaxErrors1(jsCode);
			//JSCompilerUtil.checkSyntaxErrors2();
			//System.out.println(Context.getCurrentContext().getImplementationVersion());
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		

	}

}
