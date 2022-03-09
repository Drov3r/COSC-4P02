package com.scraper;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlTable;
import com.gargoylesoftware.htmlunit.html.HtmlTableBody;
import com.gargoylesoftware.htmlunit.html.HtmlTableRow;
import com.gargoylesoftware.htmlunit.javascript.host.file.FileReader;
import com.google.gson.JsonObject;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

         
public final class SportScraper extends Scraper{

    /**
     * 
     * @param type - should always equal name of table that this scraper populates
     * @throws IOException  
     */
    public SportScraper(String type) throws IOException {
        super(type);

        webClient.getOptions().setJavaScriptEnabled(true);
            HtmlPage myPage = webClient.getPage("https://cg2022.gems.pro/Result/Calendar.aspx?SetLanguage=en-CA&Grouping=S");

            DomNodeList tables = myPage.getElementsByTagName("table");
            HtmlTable table = (HtmlTable) tables.get(2);
            
            List<HtmlTableBody> tableBodies = table.getBodies();

            ArrayList<String[]> tupleList = new ArrayList<>();

            String[] tuple = new String[7];
            String sport = "";
            String tempSport;
            List<HtmlTableRow> tableRows;
            HtmlTableRow currentRow;
            for (int i=1; i<tableBodies.size(); i++){
                tableRows = tableBodies.get(i).getRows();
                for (int k=0; k<tableRows.size(); k++){
                    currentRow = tableRows.get(k);
                    tempSport = currentRow.getCell(1).asNormalizedText();
                    //System.out.println(tempSport);
                    tuple = new String[7];
                    if (tempSport!=""){
                        sport = tempSport;
                    }
                    else if (sport!=""){
                        tuple[0] = sport;                                           // sport
                        tuple[1] = currentRow.getCell(3).asNormalizedText();        // date
                        tuple[2] = currentRow.getCell(4).asNormalizedText();        // time
                        tuple[3] = currentRow.getCell(5).asNormalizedText();        // category
                        tuple[4] = currentRow.getCell(6).asNormalizedText();        // subcategory
                        tuple[5] = currentRow.getCell(7).asNormalizedText();        // location
                        tupleList.add(tuple);
                        items.add(tuple);
                    }
                }
            }

            /*
            for (String[] tuples : tupleList) {
                for (String t : tuples) {
                    System.out.println(t);
                }
                System.out.println();
            }
            */

            // for (String[] t : tupleList) {
            //     String stringToParse = t[4];
            //     // The goal is to put all substrings into categories
            //     // index 0: bracket-level
            //     // index 1: grouping
            //     // index 2: game-number
            //     // index 3 & 4: participants
            //     String[] masterArray = {null,null,null,null,null};

            //     // so lets fill the parsed string into an array,
            //     // unsorted for now, sort the array by category in a bit

            //     // split string by '|' bars
            //     String[] bar = stringToParse.split("|");
            //     if(bar.length > 1){        // check if the string was split at all
            //         masterArray[0] = bar[0];   // save first part of string
            //         stringToParse = bar[1];    // parse rest of string
            //     }
            //     for (String c : bar) {
            //         System.out.println(c + ", ");
            //     }
            //     System.out.println();

            //     // split the string by '-' dash
            //     String[] dash = stringToParse.split("-");
            //     for(int i = 0; i < dash.length; i++){
            //     // check if we already filled the first index
            //         if(masterArray[0] != null){
            //             masterArray[i] = dash[i];
            //         }else {
            //             // offset by 1
            //             masterArray[i + 1] = dash[i];
            //         }
            //     }

            //     // if the master array is not full, check for brackets and split by those
            //     String[] brackets;
            //     if(masterArray[3] != null){
            //         // get the rest of the bracket split
            //         brackets = dash[dash.length-1].split("(");
            //         masterArray[3] = brackets[1]; // fill master array with participants
            //     }

            //     /*
            //     for (String a : masterArray) {
            //         System.out.print(a + ",");
            //     }
            //     */


            // }









            /************************************************************************************************************
             * ***************************************    WIP    ********************************************************
             * **********************************************************************************************************
             */

            JSONObject pythonData = null;
             JSONParser jsonParser = new JSONParser();

             try {
                pythonData = (JSONObject) jsonParser.parse(new java.io.FileReader("scraper/src/schedule.json"));
                Iterator<String> sportKeys = pythonData.keySet().iterator();
                while(sportKeys.hasNext()){
                    String sportName = sportKeys.next();
                    System.out.println(sportName);
                    if (pythonData.get(sportName) instanceof JSONObject){
                        JSONObject sportData = (JSONObject)pythonData.get(sportName);
                        Iterator<String> roundKeys = sportData.keySet().iterator();
                        while(roundKeys.hasNext()){
                            String roundName = roundKeys.next();
                            System.out.println("\t" + roundName);
                            if (sportData.get(roundName) instanceof JSONArray){
                                JSONArray roundData = (JSONArray)sportData.get(roundName);
                                for(Object round : roundData){
                                    System.out.print(round);
                                    //System.out.println(rStrings[0]);
                                }
                            }
                        }
                    }
                }
                // for (int i=0; i< pythonData.size(); i++){
                //     pythonData
                // }
                // System.out.println(pythonData);
                
                
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }






        

            //printItems();
    }

    public static void main(String[] args) throws IOException {
        SportScraper s = new SportScraper("sports");
    }

}
