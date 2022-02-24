package com.scraper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

         
public final class SportScraper extends Scraper{

    /**
     * 
     * @param type - should always equal name of table that this scraper populates
     * @throws IOException
     */
    public SportScraper(String type) throws IOException {
        super(type);
        

    }

}
