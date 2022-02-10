package com.scraper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public final class EventScraper {

    public ArrayList<String[]> events = new ArrayList<>(); // format will be: name, date, description, link, imageURL

    public EventScraper() throws IOException {
        Document doc = Jsoup.connect("https://niagara2022games.ca/events/").get();
        Elements cards = doc.body().getElementsByClass("card rounded shadow");

        Pattern linkPattern = Pattern.compile("(?<=3\"> <a href=\")(.*)(?=\" title)", Pattern.CASE_INSENSITIVE);
        Pattern namePattern = Pattern.compile("(?<=\"h4 card-title\">)(.*)(?=</h1>)", Pattern.CASE_INSENSITIVE);
        Pattern datePattern = Pattern.compile("(?<=text-muted\">)(.*)(?=</small>)", Pattern.CASE_INSENSITIVE);
        Pattern imagePattern = Pattern.compile("(?<=image:url\\()(.*)(?=\\)\" alt=)", Pattern.CASE_INSENSITIVE);
        Pattern descriptionPattern = Pattern.compile("(?<=<p>)(.*)(?=</p>)", Pattern.CASE_INSENSITIVE);

        Matcher linkMatcher = null, nameMatcher = null, descriptionMatcher = null, imageMatcher = null, dateMatcher = null;

        for (Element el : cards){
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
                if (events.size()>0){
                    if (!linkMatcher.group(1).contains(events.get(events.size()-1)[0])){
                        events.add(new String[]{nameMatcher.group(1), dateMatcher.group(1), descriptionMatcher.group(1), linkMatcher.group(1), imageMatcher.group(1)});
                    }
                }
                else {
                    events.add(new String[]{nameMatcher.group(1), dateMatcher.group(1), descriptionMatcher.group(1), linkMatcher.group(1), imageMatcher.group(1)});
                }
            }
        }
    }
}
