package com.scraper;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.Character.Subset;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;

public final class Scraper {


    private final String pathToCredentials = "/home/griffin/Documents/active_courses/cosc_4p02/creds.txt";

    
    private String url = "";
    private String user = "";
    private String password = "";
    private Connection connection = null;

    private Scraper() throws IOException {

        // Finding the db connection credentials
        url = findCredentials()[0];
        user = findCredentials()[1];
        password = findCredentials()[2];

        connection = connectToDB();

        // scraping events, create another ____scraper for each page 
        // selects events currently in db, then adds any that aren't there, removes any that were there before and aren't anymore
        CardScraper eventScraper = new CardScraper("events");
        ArrayList<String[]> events = getFromDB("events", new String[]{"name", "date", "description", "link", "imageURL"});
        insertCards(eventScraper, events, "events");
        deleteCards(eventScraper, events, "events");      

        CardScraper newsScraper = new CardScraper("news");
        ArrayList<String[]> news = getFromDB("news", new String[]{"name", "date", "description", "link", "imageURL"});
        insertCards(newsScraper, news, "news");
        deleteCards(newsScraper, news, "news");

        CardScraper alumniScraper = new CardScraper("alumni");
        ArrayList<String[]> alumni = getFromDB("alumni", new String[]{"name", "date", "description", "link", "imageURL"});
        insertCards(alumniScraper, alumni, "alumni");
        deleteCards(alumniScraper, alumni, "alumni");

    }

    public void insertCards(CardScraper cardScraper, ArrayList<String[]> cards, String tableName){
        String sql = "INSERT INTO " + tableName + "(name, date, description, link, imageURL) VALUES(?,?,?,?,?)";
        try {
            PreparedStatement statement = connection.prepareStatement(sql);

            // event format will be: name, date, description, link, imageURL
            for (String[] card : cardScraper.cards) {
                if (!exists(card, cards)){
                    statement.setString(1, card[0]); // set name
                    statement.setString(2, card[1]); // set date
                    statement.setString(3, card[2]); // set description
                    statement.setString(4, card[3]); // set link
                    statement.setString(5, card[4]); // set imageURL
                    statement.addBatch();
                    System.out.println("added to " + tableName + " - " + card[0]);
                }
            }
            statement.executeBatch();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteCards(CardScraper cardScraper, ArrayList<String[]> cards, String tableName){
        String sql = "DELETE FROM " + tableName + " WHERE name=?";
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            for (String[] card : cards) {
                if (!exists(card, cardScraper.cards)){
                    statement.setString(1, card[0]);
                    statement.addBatch();
                    System.out.println("deleted from " + tableName + " - " + card[0]);
                }
            }
            statement.executeBatch();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public boolean exists(String[] tuple, ArrayList<String[]> table){
        for (String[] strings : table) {
            if (Arrays.equals(tuple, strings)) return true;
        }
        return false;
    }

    public ArrayList<String[]> getFromDB(String tableName, String[] headers){
        ArrayList<String[]> toReturn = new ArrayList<>();
        try {
            Statement statement = connection.createStatement();
            String sql = "Select ";
            for (int j=0; j<headers.length; j++) {
                sql += headers[j];
                if ((j+1)<headers.length) sql+=", ";
            }
            sql += " from " + tableName;
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
