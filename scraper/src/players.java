import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class players { 
    String filePath = "playerGrabber.py";

    String findPlayer(String firstName, String lastName) throws IOException{
        ProcessBuilder pb = new ProcessBuilder().command("python", "-u", filePath, firstName, lastName);
        Process p;
        try {
            p = pb.start();
            BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuilder buffer = new StringBuilder();    
            String line = null;
            while ((line = in.readLine()) != null){           
                buffer.append(line);
            }
            System.out.println(buffer.toString());                      
            in.close(); 
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
} 