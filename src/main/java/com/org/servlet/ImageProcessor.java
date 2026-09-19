package com.org.servlet;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.sun.jersey.core.util.Base64;

/**
 * Servlet implementation class ImageProcessor
 */

public class ImageProcessor extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	static int counter = 0;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ImageProcessor() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String fileName = request.getParameter("fileName");
		response.setContentType("image/jpeg");  
	    ServletOutputStream out;  
	    out = response.getOutputStream();  
	    FileInputStream fin = new FileInputStream("target/" + fileName);  
	      
	    BufferedInputStream bin = new BufferedInputStream(fin);  
	    BufferedOutputStream bout = new BufferedOutputStream(out);  
	    int ch =0; ;  
	    while((ch=bin.read())!=-1)  
	    {  
	    bout.write(ch);  
	    }  
	      
	    bin.close();  
	    fin.close();  
	    bout.close();  
	    out.close();  
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		System.out.println(request.getParameterNames());
		String base64data = request.getParameter("imageData");
		String fileName = request.getParameter("fileName");
		File of = new File("target/" + fileName);
		FileOutputStream osf = new FileOutputStream(of);
		try {
			osf.write(Base64.decode(base64data));
			osf.flush();
		} finally {
			osf.close();
		}
		response.getWriter().write("../imageProcessor?fileName=" + fileName);
	}

}