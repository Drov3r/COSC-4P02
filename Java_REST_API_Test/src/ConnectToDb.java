import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;

public class ConnectToDb {

    private final String pathToCredentials = "C:\\Users\\Justin_Gamer_Zone_PC\\Desktop\\Database\\creds.txt";
    private String url = "";
    private String user = "";
    private String password = "";
    private Connection connection = null;
    
    public ConnectToDb(){
    
        // Finding the db connection credentials
        url = findCredentials()[0];
        user = findCredentials()[1];
        password = findCredentials()[2];

        connection = connectToDB();
    }
    
    public Connection connectToDB(){
        try {
            return DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
             e.printStackTrace();
        }
        return null;
        }

    public String[] findCredentials(){
        String[] toReturn = new String[3];
        File directory = new File(pathToCredentials);
        try {
            BufferedReader br = new BufferedReader(new FileReader(directory));
            StringBuilder sb = new StringBuilder();
            try {
                toReturn[0] = br.readLine(); // read url from text file
                toReturn[1] = br.readLine(); // read username from text file
                toReturn[2] = br.readLine(); // read password from text file
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (FileNotFoundException e) {
             e.printStackTrace();
        }
        return toReturn;
    }

    public ArrayList<String[]> getFromDB(String tableName, String[] headers, String filter, String filterColumn){
        boolean isList = false;
        if (tableName.equals("venues") && filterColumn.equals("sport")){
            isList = true;
        }
        ArrayList<String[]> toReturn = new ArrayList<>();
        try {
            Statement statement = connection.createStatement();
            String sql = "Select ";
            for (int j=0; j<headers.length; j++) {
                sql += headers[j];
                if ((j+1)<headers.length) sql+=", ";
            }
            filter = filter.toLowerCase();
            sql += " from " + tableName;
            if (isList){
                sql += " where LOWER(TRIM(" + filterColumn + ")) LIKE LOWER(TRIM('%" + filter + "%'))";
            }
            else {
                sql += " where LOWER(TRIM(" + filterColumn + ")) LIKE LOWER(TRIM('" + filter + "'))";
            }

            System.out.println(sql);
            
            ResultSet result = statement.executeQuery(sql);
            while (result.next()) {
                String[] temp = new String[headers.length];
                for(int i=0; i<headers.length; i++){
                    temp[i] = result.getString(headers[i]);
                }
                toReturn.add(temp);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return toReturn;


    }
}
