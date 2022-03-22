package com.scraper;

import java.util.ArrayList;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import java.io.IOException;


public class VenueScraper extends Scraper {


    public ArrayList<Venue> arr = new ArrayList<Venue>();

    public VenueScraper(String type) throws IOException {
        super(type);
            Elements articles = doc.getElementsByClass("mt-2 mb-10 pb-10");
            for (Element element: articles) {
                Venue item = new Venue();
                item.setVenue(element.getElementsByClass("h3 mt-6 mb-1").text());
                item.setDescription(element.getElementsByClass("mt-2 mb-10 pb-10").text());
                Elements element2 = element.getElementsByClass("col-2 p-1 p-2 p-lg-3 m-1 bg-white shadow rounded text-center");
                for (Element sport : element2) {
                item.addSport(sport.text());
            }
            items.add(new String[]{item.getVenue(),item.getDescription(),item.getSport()});
            
                for (Venue venue : arr) {
                
                }
        }
        printItems();
    
    }
    public static void main(String[] args) throws IOException {
        VenueScraper s = new VenueScraper("venues");
    }

}
