import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class scores {  



   public static void main( String gargs[] ) throws IOException, InterruptedException  {  
        String filePath = "ScoreScrape.py";     
        String url = "https://cg2022.gems.pro/Result/Event_PO_T_T.aspx?Event_GUID=4a73eb84-2cd9-499b-96c5-bf89e5b11589&SetLanguage=en-CA"; // Basketball URL 
        ProcessBuilder pb = new ProcessBuilder().command("python", "-u", filePath, url);        
        Process p = pb.start(); 
        BufferedReader in = new BufferedReader(new InputStreamReader(p.getInputStream()));
        StringBuilder buffer = new StringBuilder();     
        String line = null;
        while ((line = in.readLine()) != null){           
            buffer.append(line);
        }
        System.out.println(buffer.toString());                      
        in.close();
        System.out.println("For a full list of scores go to: "+ url);
   }  
} 