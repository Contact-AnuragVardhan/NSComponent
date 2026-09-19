package com.org.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

public class JSMinifier 
{
	private BufferedReader br = null;
	private StringBuilder sbOutput = null;
	
	private final int EOF = 0x003;
	private int theA = 0;
	private int theB = 0;
	private int theLookahead = EOF;
	private int theX = EOF;
	private int theY = EOF;
	
	public String process(String filename)
	{
		try 
		{
			Charset charset = Charset.forName("UTF-8");
			Path pathIn = Paths.get(filename);
			br = Files.newBufferedReader(pathIn, charset);
			
			BufferedWriter bw = Files.newBufferedWriter(pathIn, charset, StandardOpenOption.APPEND);
			bw.write(EOF);
			bw.close();
			
			sbOutput = new StringBuilder();
		
			if (peek() == 0xEF) 
			{
				get();
				get();
				get();
			}
			theA = ' ';
			action(3);
			while (theA != EOF) 
			{
				switch (theA) 
				{
					case ' ':
						action(isAlphanum(theB) ? 1 : 2);
						break;
					case '\n':
						switch (theB) {
						case '{':
						case '[':
						case '(':
						case '+':
						case '-':
						case '!':
						case '~':
							action(1);
							break;
						case ' ':
							action(3);
							break;
						default:
							action(isAlphanum(theB) ? 1 : 2);
						}
						break;
					default:
						switch (theB) {
						case ' ':
							action(isAlphanum(theA) ? 1 : 3);
							break;
						case '\n':
							switch (theA) {
							case '}':
							case ']':
							case ')':
							case '+':
							case '-':
							case '"':
							case '\'':
							case '`':
								action(1);
								break;
							default:
								action(isAlphanum(theA) ? 1 : 3);
							}
							break;
						default:
							action(1);
							break;
						}
				}
			}
			br.close();
		}
		catch(Exception fnfe)
		{
			fnfe.printStackTrace();
		}
		return sbOutput.toString();
	}
	
	public void error(String s){
		System.out.println("JSMIN Error: " + s);
		System.exit(1);
	}
	
	public void putc(int c)
	{
		try 
		{
			if (c != '\n') 
			{
				sbOutput.append((char)c);
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
	}
	
	public boolean isAlphanum(int c){
		return ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || c == '_' || c == '$' || c == '\\' || c > 126);
	}
	
	public int get(){
		
		int c = theLookahead;
		theLookahead = EOF;
		
		try {
		
			if (c == EOF){
				c = br.read();
			}
		
		}
		catch(Exception e){
			e.printStackTrace();
		}
		
		if (c >= ' ' || c == '\n' || c == EOF) {
			return c;
		}
		
		if (c == '\r'  ) {
			//return '\n';
			return ' ';
		}
		
		
		return ' '; 
	
	}
	
	public int peek(){
		theLookahead = get();
    	return theLookahead;
	}
	
	public int next(){
		
		int c = get();
		if  (c == '/') {
			switch (peek()) {
			case '/':
				for (;;) {
					c = get();
					if (c <= '\n') {
						break;
					}
				}
				break;
			case '*':
				get();
				while (c != ' ') {
					switch (get()) {
					case '*':
						if (peek() == '/') {
							get();
							c = ' ';
						}
						break;
					case EOF:
						error("Unterminated comment.");
					}
				}
				break;
			}
		}
		theY = theX;
		theX = c;
		return c;
	}
	
	public void action(int d){
	
		switch (d) {
			case 1:
				putc(theA);
				if (
					(theY == '\n' || theY == ' ') &&
					(theA == '+' || theA == '-' || theA == '*' || theA == '/') &&
					(theB == '+' || theB == '-' || theB == '*' || theB == '/')
				) {
					putc(theY);
				}
			case 2:
				theA = theB;
				if (theA == '\'' || theA == '"' || theA == '`') {
					for (;;) {
						putc(theA);
						theA = get();
						if (theA == theB) {
							break;
						}
						if (theA == '\\') {
							putc(theA);
							theA = get();
						}
						if (theA == EOF) {
							error("Unterminated string literal.");
						}
					}
				}
			case 3:
				theB = next();
				if (theB == '/' && (
					theA == '(' || theA == ',' || theA == '=' || theA == ':' ||
					theA == '[' || theA == '!' || theA == '&' || theA == '|' ||
					theA == '?' || theA == '+' || theA == '-' || theA == '~' ||
					theA == '*' || theA == '/' || theA == '{' || theA == '\n'
				)) {
					putc(theA);
					if (theA == '/' || theA == '*') {
						putc(' ');
					}
					putc(theB);
					for (;;) {
						theA = get();
						if (theA == '[') {
							for (;;) {
								putc(theA);
								theA = get();
								if (theA == ']') {
									break;
								}
								if (theA == '\\') {
									putc(theA);
									theA = get();
								}
								if (theA == EOF) {
									error("Unterminated set in Regular Expression literal.");
								}
							}
						} else if (theA == '/') {
							switch (peek()) {
							case '/':
							case '*':
								error("Unterminated set in Regular Expression literal.");
							}
							break;
						} else if (theA =='\\') {
							putc(theA);
							theA = get();
						}
						if (theA == EOF) {
							error("Unterminated Regular Expression literal.");
						}
						putc(theA);
					}
					theB = next();
				}
		}
	}
}