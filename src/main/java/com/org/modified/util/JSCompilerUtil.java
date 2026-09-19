package com.org.modified.util;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.PolyglotException;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;

import com.googlecode.jslint4java.Issue;
import com.googlecode.jslint4java.JSLint;
import com.googlecode.jslint4java.JSLintBuilder;
import com.googlecode.jslint4java.JSLintResult;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import java.io.*;

public class JSCompilerUtil {
	
	public static boolean checkJSCompileTimeErrors(String jsCode) throws Exception {
        try (Context context = Context.create()) {
            Source source = Source.newBuilder("js", jsCode, "script.js").build();
            Value result = context.eval(source);
            return true;
        } catch (PolyglotException e) {
            System.err.print(e.getMessage());
            throw new Exception(e);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e);
        }
    }
	
	public static String checkSyntaxErrors(String jsCode) {
		JSLintBuilder builder = new JSLintBuilder();
		JSLint jsLint = builder.fromDefault();
        JSLintResult result = jsLint.lint("filename.js", jsCode);
        StringBuilder error = new StringBuilder();
        for (Issue issue : result.getIssues()) {
            error.append(issue.toString()).append("\n");
        }
        if (error.length() > 0) {
            return error.toString();
        } else {
            return "No errors";
        }
    }
	
	public static void checkSyntaxErrors1(String jsCode) throws Exception {
		//String eslintPath = "C:/Users/Admin/AppData/Roaming/npm/ng";
		System.setProperty( "user.dir", "F:/New Workspace/EslintInstallation");
	    //ProcessBuilder builder = new ProcessBuilder(eslintPath, "--version");
		File dir = new File("F:/New Workspace/EslintInstallation");
		String[] cmd = {"node", "eslint","main1.js"};
		ProcessBuilder builder = new ProcessBuilder(cmd);
		builder.directory(dir);
	    try {
	      Process process = builder.start();
	      String currentWorkingDirectory = System.getProperty("user.dir");
	      System.out.println("Current working directory: " + currentWorkingDirectory);
	      BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
	      String line = null;
	      while ((line = reader.readLine()) != null) {
	        System.out.println(line);
	      }
	      BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
	      String errorLine;
	      while ((errorLine = errorReader.readLine()) != null) {
	          System.err.println("Error: " + errorLine);
	      }
	    } catch (IOException e) {
	      e.printStackTrace();
	    }
		/*Process process = Runtime.getRuntime().exec("npm install -g eslint");
        int exitValue = process.waitFor();

        if (exitValue == 0) {
            System.out.println("ESLint installed successfully.");
        } else {
            System.out.println("ESLint installation failed with exit code: " + exitValue);
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            String line;
            while ((line = errorReader.readLine()) != null) {
                System.out.println(line);
            }
        }*/
        
		/*File temp = File.createTempFile("tempfile", ".js");
        BufferedWriter bw = new BufferedWriter(new FileWriter(temp));
        bw.write(jsCode);
        bw.close();
        String command = "eslint " + temp.getAbsolutePath();
        Process process = Runtime.getRuntime().exec(command);
        InputStream inputStream = process.getInputStream();
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            System.out.println(line);
        }
        temp.delete();*/
        
        /*try {
            // Start the ESLint process
            Process process = new ProcessBuilder("eslint", "-f", "json", "-").start();
            // Write the code to be linted to the process's input stream
            process.getOutputStream().write(jsCode.getBytes());
            process.getOutputStream().close();
            // Read the process's output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            // Parse the JSON output to check for errors
            // ...
            return "No errors";
        } catch (IOException e) {
            return e.toString();
        }*/
	}
	
	public static void checkSyntaxErrors2() throws Exception {
		System.setProperty( "user.dir", "F:/New Workspace/EslintInstallation");
		File dir = new File("F:/New Workspace/EslintInstallation");
		String[] nodeCommand = {"node", "-v"};
		String[] npmCommand = {"node","npm", "install", "eslint"};

		ProcessBuilder nodePB = new ProcessBuilder(nodeCommand);
		nodePB.directory(dir);
		Process nodeProcess = nodePB.start();
		nodeProcess.waitFor();

		ProcessBuilder npmPB = new ProcessBuilder(npmCommand);
		npmPB.directory(dir);
		Process npmProcess = npmPB.start();
		npmProcess.waitFor();

		// check the standard output and error streams
		InputStream nodeOut = nodeProcess.getInputStream();
		InputStream nodeErr = nodeProcess.getErrorStream();
		InputStream npmOut = npmProcess.getInputStream();
		InputStream npmErr = npmProcess.getErrorStream();
		BufferedReader nodeOutReader = new BufferedReader(new InputStreamReader(nodeOut));
		BufferedReader nodeErrReader = new BufferedReader(new InputStreamReader(nodeErr));
		BufferedReader npmOutReader = new BufferedReader(new InputStreamReader(npmOut));
		BufferedReader npmErrReader = new BufferedReader(new InputStreamReader(npmErr));

		String nodeLine;
		while ((nodeLine = nodeOutReader.readLine()) != null) {
		    System.out.println("Node Output: " + nodeLine);
		}
		while ((nodeLine = nodeErrReader.readLine()) != null) {
		    System.out.println("Node Error: " + nodeLine);
		}
		String npmLine;
		while ((npmLine = npmOutReader.readLine()) != null) {
		    System.out.println("NPM Output: " + npmLine);
		}
		while ((npmLine = npmErrReader.readLine()) != null) {
		    System.out.println("NPM Error: " + npmLine);
		}

		nodeProcess.destroy();
		npmProcess.destroy();

	}
 
}
