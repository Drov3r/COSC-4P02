package com.scraper;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
import com.gargoylesoftware.htmlunit.html.HtmlData;
import com.gargoylesoftware.htmlunit.html.HtmlDataList;
import com.gargoylesoftware.htmlunit.html.HtmlOption;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlSelect;
import com.gargoylesoftware.htmlunit.html.HtmlTable;
import com.gargoylesoftware.htmlunit.html.HtmlTableBody;
import com.gargoylesoftware.htmlunit.html.HtmlTableCell;
import com.gargoylesoftware.htmlunit.html.HtmlTableDataCell;
import com.gargoylesoftware.htmlunit.html.HtmlTableFooter;
import com.gargoylesoftware.htmlunit.html.HtmlTableHeader;
import com.gargoylesoftware.htmlunit.html.HtmlTableRow;
import com.gargoylesoftware.htmlunit.javascript.host.Element;
import com.gargoylesoftware.htmlunit.javascript.host.html.HTMLTableDataCellElement;

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
