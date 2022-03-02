package com.scraper;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.NicelyResynchronizingAjaxController;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.DomNode;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.HtmlButton;
import com.gargoylesoftware.htmlunit.html.HtmlOption;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlSelect;
import com.gargoylesoftware.htmlunit.html.HtmlTable;
import com.gargoylesoftware.htmlunit.javascript.host.Element;

import org.apache.commons.logging.LogFactory;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;


public abstract class Scraper {
    public ArrayList<String[]> items;
    public Document doc;
    public String type;
    Map<String, Pattern> patterns = new HashMap<String, Pattern>();
    Map<String, Matcher> matchers = new HashMap<String, Matcher>();
    WebClient webClient;
    

    public Scraper(String type) throws IOException{
        this.type=type;
        this.items = new ArrayList<>();
        this.doc = null;
        //this.driver = new FirefoxDriver();
        //this.driver.navigate().to("https://cg2022.gems.pro/Result/Calendar.aspx?SetLanguage=en-CA");
        //WebDriverWait wait = new WebDriverWait(driver, 2);


        this.webClient = new WebClient(BrowserVersion.FIREFOX);




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
        else if (type.equals("sports")){
            webClient.getOptions().setJavaScriptEnabled(true);
            webClient.getOptions().setThrowExceptionOnFailingStatusCode(true);
            webClient.getOptions().setThrowExceptionOnScriptError(true);
            webClient.setAjaxController(new NicelyResynchronizingAjaxController());
            WebRequest req = new WebRequest(new URL("https://cg2022.gems.pro/Result/Calendar.aspx"));
            HtmlPage myPage = webClient.getPage(req);
            //System.out.println(myPage.asNormalizedText());
            int i = webClient.waitForBackgroundJavaScript(1000);
            //System.out.println(i);
            HtmlSelect sel = (HtmlSelect) myPage.getElementById("ctl00_ctl00_ContentPlaceHolderBasicMaster_ContentPlaceHolder1_selGameDay");
            sel.click();
            for (DomNode el : sel.getDomElementDescendants()) {
                if (el.getTextContent().contains("Tuesday, August 16, 2022")){
                    HtmlOption op = (HtmlOption) el;
                    op.click();
                }
                System.out.println(el.getTextContent());
            }

            sel = (HtmlSelect) myPage.getElementById("ctl00_ctl00_ContentPlaceHolderBasicMaster_ContentPlaceHolder1_selSport");
            sel.click();
            for (DomNode el : sel.getDomElementDescendants()) {
                if (el.getTextContent().contains("Athletics")){
                    HtmlOption op = (HtmlOption) el;
                    op.click();
                }
                System.out.println(el.getTextContent());
            }

            for (DomNode table : myPage.getElementsByTagName("table")) {
                System.out.println(table.getTextContent());
            }

            while (i>0){
                i = webClient.waitForBackgroundJavaScript(1000);
                if (i==0){
                    break;
                }
                synchronized (myPage) {
                    try {
                        System.out.println("waitin");
                        myPage.wait(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
            webClient.getAjaxController().processSynchron(myPage, req, false);
            doc = Jsoup.parse(myPage.asXml());
            System.out.println("hi yio");
            //driver.navigate().to("https://cg2022.gems.pro/Result/Calendar.aspx?SetLanguage=en-CA");
        }
        //driver.close();
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
