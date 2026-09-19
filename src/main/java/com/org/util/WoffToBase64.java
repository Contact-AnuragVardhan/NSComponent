package com.org.util;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

public class WoffToBase64 {

	public static void main(String[] args) {
		try {
            // Replace 'path_to_your_font.woff' with the actual file path
            String filePath = "D:\\New Workspace\\JSLib\\src\\main\\webapp\\lib\\css\\com\\org\\fonts\\fonts\\NSComponentFont.woff";
            
            // Read all bytes from the WOFF file
            byte[] fileContent = Files.readAllBytes(Paths.get(filePath));
            
            // Encode the bytes to Base64
            String base64String = Base64.getEncoder().encodeToString(fileContent);
            
            // Output the Base64-encoded string
            System.out.println("data:application/font-woff;base64," + base64String);
        } catch (Exception e) {
            e.printStackTrace();
        }

	}

}
