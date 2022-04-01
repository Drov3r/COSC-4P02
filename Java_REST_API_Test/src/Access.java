import java.time.LocalDate;
import java.time.Month;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;

public class Access {

    public static String countdown() {
    	System.out.println("Debug Print #1");
        //https://codeit.blog/2020/12/06/christmas-count-down-clock-with-java/
        LocalDate today = LocalDate.now();//getting current date

        LocalDate GameDayStart = LocalDate.of(2022, Month.AUGUST, 6);// setting first day of sports

        LocalDate nextGame = GameDayStart.withYear(today.getYear());

        //Add 1 if Christmas has past this year
        if (nextGame.isBefore(today) || nextGame.isEqual(today)) {
            nextGame = nextGame.plusYears(1);
        }

        Period p = Period.between(today, nextGame);
        long p2 = ChronoUnit.DAYS.between(today, nextGame);// nanoseconds in days till game starts 
        String x=("There are " + p.getMonths() + " months, and " +
                p.getDays() + " days until the games! (" +
                p2 + " days in total)");
        return x;
    }
       
    public static String whenIsNextEvent (String input) {
        ConnectToDb dbconnect = new ConnectToDb(); 
        String ans = "";
        ArrayList<String[]> nextEvent = dbconnect.getTimeFromDB("sports", new String[]{"time"}, input, "sport");
        ans = "The next " + input + " event will at the following time: " + list(nextEvent);
        return ans;
    }


    public static String list(ArrayList<String[]> outerList){
        String list = "";
        for (int j=0; j<outerList.size(); j++) {
            for (int i=0; i<outerList.get(j).length; i++) {
                list += outerList.get(j)[i];
            } 
            if (j!= outerList.size()-1){
                list += ", ";
            } 
        }
        return list;
    }
    /*Input can be either an event/sport or a venue
    - if event is inputed then a list of venues will be returned
    - if venue is inputed, then a list of events will be returned
    */
    public static String venueOrSport(String input){
        ConnectToDb dbconnect = new ConnectToDb(); 
        String ans = "";
        ArrayList<String[]> venue = dbconnect.getFromDB("venues",new String[]{"venue"},input, "sport");
        ArrayList<String[]> sport = dbconnect.getFromDB("venues",new String[]{"sport"},input, "venue");
        if (sport.size()>0) {
            ans = "The " + input + " venue will host the following events: " + list(sport); 
        } else if (venue.size()>0) {
            ans = "The " + input + " events will be at the following venues: " + list(venue);
        }
       
        return ans;
    }
}
