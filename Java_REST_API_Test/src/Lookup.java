public class Lookup {

	public String countdown() {

	//https://codeit.blog/2020/12/06/christmas-count-down-clock-with-java/
        LocalDate today = LocalDate.now();//getting current date

      LocalDate ChristmasDay = LocalDate.of(2022, Month.JUNE, 1);// setting Christmass day

      LocalDate nextXmas = ChristmasDay.withYear(today.getYear());// Next year Christmas

      //Add 1 if Christmas has past this year
      if (nextXmas.isBefore(today) || nextXmas.isEqual(today)) {
          nextXmas = nextXmas.plusYears(1);
      }

      Period p = Period.between(today, nextXmas);
      long p2 = ChronoUnit.DAYS.between(today, nextXmas);// nanoseconds in days till Christmas
      x=("There are " + p.getMonths() + " months, and " +
                         p.getDays() + " days until The games! (" +
                         p2 + " total)");
      return x;
	}

}
