package com.scraper;
import java.io.IOException;
import java.util.ArrayList;

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
            chooseScraper("sports"), 
            new String[]{"sport","day","time","category","subCategory","location"});

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
        else {
            scraper = new SportScraper("sports");
        }
        
        return scraper;
        
    }

    /**
     * selects items currently in db, then adds any that aren't there, removes any that were there before and aren't anymore
     */
    public void updateDB(Scraper scraper, String[] headers){
        ArrayList<String[]> itemsInDB = dbManager.getFromDB(scraper.type, headers);
        dbManager.insertIntoDB(scraper, itemsInDB, scraper.type, headers);
        dbManager.deleteFromDB(scraper, itemsInDB, scraper.type);
    }

    public static void main(String[] args) throws IOException {
        ScraperManager a = new ScraperManager();
    }
}
