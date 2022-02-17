package com.scraper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public final class CardScraper {

    public ArrayList<String[]> items = new ArrayList<>(); // format will be: name, date, description, link, imageURL

    public CardScraper(String cardType) throws IOException {

        Pattern linkPattern = Pattern.compile("(?<=3\"> <a href=\")(.*)(?=\" title)", Pattern.CASE_INSENSITIVE);
        Pattern namePattern = Pattern.compile("(?<=\"h4 card-title\">)(.*)(?=</h1>)", Pattern.CASE_INSENSITIVE);
        Pattern datePattern = Pattern.compile("(?<=text-muted\">)(.*)(?=</small>)", Pattern.CASE_INSENSITIVE);
        Pattern imagePattern = Pattern.compile("(?<=image:url\\()(.*)(?=\\)\" alt=)", Pattern.CASE_INSENSITIVE);
        Pattern descriptionPattern = Pattern.compile("(?<=<p>)(.*)(?=</p>)", Pattern.CASE_INSENSITIVE);

        Document doc = null;
        if (cardType.equals("events")) doc = Jsoup.connect("https://niagara2022games.ca/events/").get();
        else if (cardType.equals("news")) doc = Jsoup.connect("https://niagara2022games.ca/news/").get();
        else if (cardType.equals("alumni")){
            doc = Jsoup.connect("https://niagara2022games.ca/about/alumni/").get();
            linkPattern = Pattern.compile("(?<=3\"> <a href=\")(.*)(?=\" class=\"btn btn-sm red\")", Pattern.CASE_INSENSITIVE);
        } 

        Elements elements = doc.body().getElementsByClass("card rounded shadow");
        Matcher linkMatcher = null, nameMatcher = null, descriptionMatcher = null, imageMatcher = null, dateMatcher = null;

        for (Element el : elements){
            linkMatcher = linkPattern.matcher(el.toString());
            nameMatcher = namePattern.matcher(el.toString());
            dateMatcher = datePattern.matcher(el.toString());
            imageMatcher = imagePattern.matcher(el.toString());
            descriptionMatcher = descriptionPattern.matcher(el.toString());
            linkMatcher.find();
            nameMatcher.find();
            dateMatcher.find();
            imageMatcher.find();
            descriptionMatcher.find();
            if (linkMatcher!=null && nameMatcher != null && descriptionMatcher != null && imageMatcher != null && dateMatcher != null ){
                if (items.size()>0){
                    if (!linkMatcher.group(1).contains(items.get(items.size()-1)[0])){
                        items.add(new String[]{nameMatcher.group(1), dateMatcher.group(1), descriptionMatcher.group(1), linkMatcher.group(1), imageMatcher.group(1)});
                    }
                }
                else {
                    items.add(new String[]{nameMatcher.group(1), dateMatcher.group(1), descriptionMatcher.group(1), linkMatcher.group(1), imageMatcher.group(1)});
                }
            }
        }

        /* for testing the desired outcome
        
        System.out.println();
        for (String[] a : cards) {
            for (String b : a) {
                System.out.println(b);
            }
            System.out.println();
        }
        
        */

    }
    public static void main(String[] args) throws IOException {
        CardScraper a = new CardScraper("alumni");
    }
}
