package com.scraper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public abstract class Scraper {
    public ArrayList<String[]> items;
    public Document doc;
    public String type;
    Map<String, Pattern> patterns = new HashMap<String, Pattern>();
    Map<String, Matcher> matchers = new HashMap<String, Matcher>();

    public Scraper(String type) throws IOException{
        this.type=type;
        this.items = new ArrayList<>();
        this.doc = null;
        connectToDoc(type);
    }

    public void connectToDoc(String type) throws IOException {
        if (type.equals("events")){
            doc = Jsoup.connect("https://niagara2022games.ca/events/").get();
        } 
        else if (type.equals("news")){
            doc = Jsoup.connect("https://niagara2022games.ca/news/").get();
        }
        else if (type.equals("alumni")){
            doc = Jsoup.connect("https://niagara2022games.ca/about/alumni/").get();
        }
    }

    /* for testing the desired outcome */
    public void printItems(){
        System.out.println();
        for (String[] a : items) {
            for (String b : a) {
                System.out.println(b);
            }
            System.out.println();
        }
    }
}
