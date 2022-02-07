package com.scraper;

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

public final class Scraper {

    




    private final String pathToCredentials = "/home/griffin/Documents/active_courses/cosc_4p02/creds.txt";
    
    
    
    private String url = "";
    private String user = "";
    private String password = "";
    private Connection connection = null;
    EventScraper eventScraper = null;

    private Scraper() throws IOException {
        eventScraper = new EventScraper();
        url = findCredentials()[0];
        user = findCredentials()[1];
        password = findCredentials()[2];
        connection = connectToDB();
        //insertEvents();
        String events = getFromDB("SELECT * FROM events");
        System.out.println(events);
    }

    public void insertEvents(){
        String sql = "INSERT INTO events(name, date, description, link, imageURL) VALUES(?,?,?,?,?)";
        try {
            PreparedStatement statement = connection.prepareStatement(sql);

            // event format will be: name, date, description, link, imageURL
            for (String[] event : eventScraper.events) {
                statement.setString(1, event[0]); // set name
                statement.setString(2, event[1]); // set date
                statement.setString(3, event[2]); // set description
                statement.setString(4, event[3]); // set link
                statement.setString(5, event[4]); // set imageURL

                statement.addBatch();
            }
            statement.executeBatch();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public String getFromDB(String sql){
        String toReturn = "";
        try {
            Statement statement = connection.createStatement();
            ResultSet result = statement.executeQuery(sql);
            while (result.next()) {
                toReturn += "\n"
                        + result.getString("name") 
                        + " - " 
                        + result.getString("date")
                        + " - " 
                        + result.getString("description") 
                        + " - " 
                        + result.getString("link")
                        + " - "
                        + result.getString("imageURL") 
                        + "\n";
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return toReturn;
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
    
    public Connection connectToDB(){
        try {
            return DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    public static void main(String[] args) throws IOException {
        Scraper a = new Scraper();
    }
}
