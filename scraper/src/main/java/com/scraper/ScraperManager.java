package com.scraper;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import org.python.antlr.ast.Print;

public final class ScraperManager {

    DatabaseManager dbManager;

    private ScraperManager() throws IOException {

        dbManager = new DatabaseManager();

        String[] cardStrings = { "name", "date", "description", "link", "imageURL" };


        updateDB(
           chooseScraper("events"), 
           cardStrings
        );

        updateDB(
           chooseScraper("news"), 
           cardStrings
        );

        updateDB(
            chooseScraper("alumni"), 
            cardStrings
        );

        updateDB(
            chooseScraper("venues"),
            new String[]{"venue","description","sport"});

        updateDB(
            chooseScraper("sports"), 
            new String[]{"sport","time","category","subCategory","location"});

        generateTextFile();
    }

    /**
     * Determines which scraper to use to get the appropriate data, then run it and return the instance
     * @param tableName
     * @param headers
     * @return
     * @throws IOException
     */
    public Scraper chooseScraper(String tableName) throws IOException{
        Scraper scraper = null;

        if (tableName.equals("events")
            || tableName.equals("alumni")
            || tableName.equals("news")){
                scraper = new CardScraper(tableName);
        }
        else if (tableName.equals("sports")){
            scraper = new SportScraper("sports");
        } else if (tableName.equals("venues")) {
            scraper = new VenueScraper("venues");
        }

        
        return scraper;
        
    }

    /**
     * selects items currently in db, then adds any that aren't there, removes any that were there before and aren't anymore
     */
    public void updateDB(Scraper scraper, String[] headers){
        ArrayList<String[]> itemsInDB = dbManager.getFromDB(scraper.type, headers);
        dbManager.deleteFromDB(scraper, itemsInDB, scraper.type, headers);
        dbManager.insertIntoDB(scraper, itemsInDB, scraper.type, headers);
        
    }

    public void generateTextFile(){
        
        PrintWriter writer;
        try {
            writer = new PrintWriter("all-data.txt", "UTF-8");
            writeToFile("sports",writer);
            writeToFile("venues", writer);
            writeToFile("alumni", writer);
            writeToFile("events", writer);
            writeToFile("news", writer);
            writer.close();
        } catch (FileNotFoundException | UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
    }

    public void writeToFile(String tableName, PrintWriter writer){
        ArrayList<String[]> itemsInDb = dbManager.getFromDB(tableName);
        writer.println(tableName);
        for (String[] arr : itemsInDb){
            for (int i=0; i<arr.length; i++){
                writer.print(arr[i]);
                if ((i+1)<arr.length) writer.print(", "); 
            }
            writer.println();
        }
        writer.println();
        writer.println();
    }

    public static void main(String[] args) throws IOException {
        ScraperManager a = new ScraperManager();
    }
}
