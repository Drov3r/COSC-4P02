import java.time.LocalDate;
import java.time.Month;
import java.time.Period;
import java.time.temporal.ChronoUnit;

public class Access {

    public static String countdown() {

        //https://codeit.blog/2020/12/06/christmas-count-down-clock-with-java/
        LocalDate today = LocalDate.now();//getting current date

        LocalDate ChristmasDay = LocalDate.of(2022, Month.JUNE, 1);// setting Christmas day

        LocalDate nextXmas = ChristmasDay.withYear(today.getYear());// Next year Christmas

        //Add 1 if Christmas has past this year
        if (nextXmas.isBefore(today) || nextXmas.isEqual(today)) {
            nextXmas = nextXmas.plusYears(1);
        }

        Period p = Period.between(today, nextXmas);
        long p2 = ChronoUnit.DAYS.between(today, nextXmas);// nanoseconds in days till Christmas
        String x=("There are " + p.getMonths() + " months, and " +
                p.getDays() + " days until the games! (" +
                p2 + " total)");
        return x;
    }
}
