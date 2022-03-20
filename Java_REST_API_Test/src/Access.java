import java.time.LocalDate;
import java.time.Month;
import java.time.Period;
import java.time.temporal.ChronoUnit;

public class Access {

    public static String countdown() {

        //https://codeit.blog/2020/12/06/christmas-count-down-clock-with-java/
        LocalDate today = LocalDate.now();//getting current date

        LocalDate GameDayStart = LocalDate.of(2022, Month.AUGUST, 6);// setting first day of sports

        LocalDate nextGame = GameDayStart.withYear(today.getYear());

        //Add 1 if Christmas has past this year
        if (nextGame.isBefore(today) || nextGame.isEqual(today)) {
            nextGame = nextGame.plusYears(1);
        }

        Period p = Period.between(today, nextGame);
        long p2 = ChronoUnit.DAYS.between(today, nextGame);// nanoseconds in days till game
        String x=("There are " + p.getMonths() + " months, and " +
                p.getDays() + " days until the games! (" +
                p2 + " days in total)");
        return x;
    }

    public static String pullReq() {
        return null; 
    }
}
