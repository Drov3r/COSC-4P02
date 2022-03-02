package com.scraper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;

         
public final class SportScraper extends Scraper{

    /**
     * 
     * @param type - should always equal name of table that this scraper populates
     * @throws IOException  
     */
    public SportScraper(String type) throws IOException {
        super(type);

        Elements elements = doc.body().getElementsByClass("DataCell");

        /*
        for (Element el : elements){
            System.out.println(el.toString());
        }
        */
    }

    public static void main(String[] args) throws IOException {
        SportScraper s = new SportScraper("sports");
    }

}
