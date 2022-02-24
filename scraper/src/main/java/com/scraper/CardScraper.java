package com.scraper;

import java.io.IOException;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public final class CardScraper extends Scraper{

    /**
     * 
     * @param cardType - - should always equal name of table that this scraper populates
     * @throws IOException
     */
    public CardScraper(String cardType) throws IOException {
        super(cardType);
        
        patterns.put("link", Pattern.compile("(?<=3\"> <a href=\")(.*)(?=\" title)", Pattern.CASE_INSENSITIVE));
        patterns.put("name", Pattern.compile("(?<=\"h4 card-title\">)(.*)(?=</h1>)", Pattern.CASE_INSENSITIVE));
        patterns.put("date", Pattern.compile("(?<=text-muted\">)(.*)(?=</small>)", Pattern.CASE_INSENSITIVE));
        patterns.put("image", Pattern.compile("(?<=image:url\\()(.*)(?=\\)\" alt=)", Pattern.CASE_INSENSITIVE));
        patterns.put("description", Pattern.compile("(?<=<p>)(.*)(?=</p>)", Pattern.CASE_INSENSITIVE));


        // rewriting "link" pattern, only in alumni searching
        if (cardType=="alumni"){
            patterns.put("link", Pattern.compile("(?<=3\"> <a href=\")(.*)(?=\" class=\"btn btn-sm red\")", Pattern.CASE_INSENSITIVE));
        }
        
        
        Elements elements = doc.body().getElementsByClass("card rounded shadow");


        for (Element el : elements){

            matchers = new HashMap<String, Matcher>();

            patterns.forEach((key, value) -> {
                matchers.put(key, value.matcher(el.toString()));
            });

            matchers.forEach((key, value) -> {
                value.find();
            });

            if (matchers.get("link")!=null 
                && matchers.get("name") != null 
                && matchers.get("description") != null 
                && matchers.get("image") != null 
                && matchers.get("date") != null ){
                if (items.size()>0){
                    if (!matchers.get("link").group(1).contains(items.get(items.size()-1)[0])){
                        items.add(
                            new String[]{
                                matchers.get("name").group(1), 
                                matchers.get("date").group(1), 
                                matchers.get("description").group(1), 
                                matchers.get("link").group(1), 
                                matchers.get("image").group(1)
                            }
                        );
                    }
                }
                else {
                    items.add(
                        new String[]{
                            matchers.get("name").group(1), 
                            matchers.get("date").group(1), 
                            matchers.get("description").group(1), 
                            matchers.get("link").group(1), 
                            matchers.get("image").group(1)
                        }
                    );
                }
            }

        }
        printItems();
    }


    public static void main(String[] args) throws IOException {
        CardScraper a = new CardScraper("alumni");
    }
    
}
