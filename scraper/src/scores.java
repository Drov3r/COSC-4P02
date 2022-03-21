import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class scores {  



   public static void main( String gargs[] ) throws IOException, InterruptedException  {  
    String filePath = "ScoreScrape.py";      
        ProcessBuilder pb = new ProcessBuilder().command("python", "-u", filePath, "main33");        
        Process p = pb.start(); 
        BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
        StringBuilder buffer = new StringBuilder();     
        String line = null;
        while ((line = in.readLine()) != null){           
            buffer.append(line);
        }
        int exitCode = p.waitFor();
        System.out.println("The Score is: "+buffer.toString());                
        System.out.println("Process exit value:"+exitCode);        
        in.close();
   }  
} 