package com.scraper;

import java.util.ArrayList;

public class Venue {

   public String venue;
   public String description;
   public String sport;

   public Venue() {
        this.sport = "";
   }

   public String getSport() {
       return this.sport;
   }

   public String getVenue() {
        return this.venue;
   }

   public void addSport(String sport) {
       if (this.sport.equals("")) {
            this.sport = sport; 
       } else {
            this.sport += ", " + sport;
       }
       
   }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }



}