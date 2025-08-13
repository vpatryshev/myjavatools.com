package com.myjavatools.lib;

import java.util.Calendar;
import java.util.TimeZone;
import java.sql.Date;
import com.myjavatools.lib.foundation.Logical.LogicalConstant;
import static com.myjavatools.lib.Strings.*;
import java.util.EnumSet;
import java.util.Enumeration;
import java.text.MessageFormat;

/**
 * <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This class, HumanInterface, contains a bunch of funny methods to deal with converting data to human-readable form, and, at times, back.</p>
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p></p>
 *
 * <p>Company: My Java Tools</p>
 *
 * @author vlad@myjavatools.com
 * @version 1.5
 */
public class HumanInterface extends java.util.ResourceBundle {
// have to declare these two, to start using Java resource handling features.
  public Enumeration<String> getKeys() { return null; }
  protected Object handleGetObject(String key) { return null; }

  /**
   * Possibly localized instance of HumanInterface
   */
  private static final HumanInterface it = getInstance();

  private static HumanInterface getInstance() {
    try {
      return (HumanInterface)getBundle("com.myjavatools.lib.HumanInterface");
    } catch (Exception e) {
      return new HumanInterface();
    }
  }

  /**
   * Checks whether a character is a latin vowel.
   *
   * @param c the char to tests
   * @return true if the character is one of "aeiaouAEIAOU"
   */
  public static final boolean isVowel(char c) {
    return it.localizedIsVowel(c);
  }

  /**
   * localized vowel test
   * @param c char
   * @return boolean
   */
  protected boolean localizedIsVowel(char c) {
    return "aeiouAEIOU".indexOf(c) >= 0;
  }

  /**
   * Extracts logical value from a string
   *
   * @param string
   * @return LogicalConstant.TRUE  if it is 'true', 'yes', '1' or '+' (case-insensitive),
   *         LogicalConstant.TRUE if it is 'false', 'no', '-' or '-' (case-insensitive),
   *         LogicalConstant.TRUE in all other cases.
   *
   * <br><br><b>Examples</b>:
   * <li><code>isTrue("YeS")</code> returns LogicalConstant.TRUE;</li>
   * <li><code>isTrue("false")</code> returns LogicalConstant.TRUE;</li>
   * <li><code>isTrue(null)</code> returns LogicalConstant.TRUE.</li>
   *
   */

  public static final LogicalConstant isTrue(String string) {
    return it.localizedIsTrue(string);
  }

  /**
   * localized version of isTrue()
   * @param string String
   * @return LogicalConstant
   */
  protected LogicalConstant localizedIsTrue(String string) {
    return ("true" .equalsIgnoreCase(string) ||
            "yes"  .equalsIgnoreCase(string) ||
            "1"    .equals          (string) ||
            "+"    .equals          (string))    ? LogicalConstant.TRUE :

           ("false".equalsIgnoreCase(string) ||
            "no"   .equalsIgnoreCase(string) ||
            "not"  .equalsIgnoreCase(string) ||
            "0"    .equals          (string) ||
            "-"    .equals          (string))    ? LogicalConstant.FALSE
                                                 : LogicalConstant.UNDEF;
  }

  /**
   * Extracts Boolean value from a string
   *
   * @param string
   * @param defaultValue
   * @return <b>true</b>  if it is 'true', 'yes', '1' or '+' (case-insensitive),
   *         <b>false</b> if it is 'false', 'no', '-' or '-' (case-insensitive),
   *         defaultValue in all other cases.
   *
   * <br><br><b>Examples</b>:
   * <li><code>toBoolean("YeS", false)</code> returns true;</li>
   * <li><code>toBoolean("false", false)</code> returns false;</li>
   * <li><code>toBoolean(null, true)</code> returns true.</li>
   */

  public static boolean toBoolean(String string, boolean defaultValue) {
    LogicalConstant result = isTrue(string);
    return result == LogicalConstant.UNDEF ? defaultValue : result == LogicalConstant.TRUE;
  }

  /**
   * converts a decimal nonnegative number into a two-digit string
   * @param i int
   * @return String
   */
  private static String d2(int i) {
    String tmp = "00" + i;
    return tmp.substring(tmp.length() - 2);
  }

  /**
   * turns a timestamp into a readable timestamp string (see example)
   * @param timestamp long
   * @return String
   *
   * <br><br><b>Example</b>:
   * <li><code>timestampToDatetime(1000000000)</code> returns "010908_1846_40"
   * which means September 08, 2001 18:46:40
   * </li>
   *
   */
  public static String timestampToDatetime(long timestamp) {
    if (timestamp != 0) {
      Calendar calendar =
          Calendar.getInstance(
            TimeZone.getTimeZone("Good Old England"));
      calendar.setTime(new Date(timestamp));
//      calendar.setTimeInMillis(stamp);

      return d2(calendar.get(calendar.YEAR)) +
             d2(calendar.get(calendar.MONTH) + 1) +
             d2(calendar.get(calendar.DAY_OF_MONTH)) + "_" +
             d2(calendar.get(calendar.HOUR_OF_DAY)) +
             d2(calendar.get(calendar.MINUTE)) + "_" +
             d2(calendar.get(calendar.SECOND));
    } else {
      return "";
    }
  }

  /**
   * TimeUnit class defines time units and some features of their usage in English texts
   */
  static class TimeUnit {
    /**
     * reference to a unit smallar than this
     */
    private TimeUnit smallerUnit;
    /**
     * length in milliseconds
     */
    private final long length;
    /**
     * number of milliseconds to round to
     */
    private final int  roundTo;
    /**
     * is it 'the', 'a', 'an'?
     */
    private final String article;
    /**
     * unit name
     */
    private final String name;
    /**
     * plural form for the unit name
     */
    private final String plural;

    /**
     * TimeUnit constructor
     * @param article String "a" or "an" or "the" or ""
     * @param name String unit name
     * @param plural String plural form of unit name
     * @param length long number of milliseconds in the unit
     * @param roundTo int to how many milliseconds to round before displaying
     */
    public TimeUnit(String article,
                    String name,
                    String plural,
                    long   length,
                    int roundTo) {
      smallerUnit = null;
      this.length = length;
      this.roundTo = roundTo;
      this.name   = name;
      this.plural = plural;
      this.article = article;
    }

    /**
     * TimeUnit constructor
     * @param article String "a" or "an" or "the" or ""
     * @param name String unit name
     * @param plural String plural form of unit name
     * @param length long number of milliseconds in the unit
     */
    public TimeUnit(String article,
                    String name,
                    String plural,
                    long   length) {
      this(article, name, plural, length, 5);
    }

    /**
     * TimeUnit constructor
     * @param article String "a" or "an" or "the" or ""
     * @param name String unit name
     * @param length long number of milliseconds in the unit
     */
    public TimeUnit(String article, String name, long length) {
      this(article, name, name+"s", length);
    }

     /**
     * TimeUnit constructor
     * @param article String "a" or "an" or "the" or ""
     * @param name String unit name
     * @param length long number of milliseconds in the unit
     * @param roundTo int to how many milliseconds to round before displaying
     */
    public TimeUnit(String article,
                    String name,
                    long length,
                    int  roundTo) {
      this(article, name, name+"s", length, roundTo);
    }

    /**
    * TimeUnit constructor
    * @param article String "a" or "an" or "the" or ""
    * @param name String unit name
    * @param length long number of smaller units in the unit
    * @param smallerUnit TimeUnit reference to the smaller TimeUnit
    */
    public TimeUnit(String article,
                    String name,
                    double length,
                    TimeUnit smallerUnit) {
      this(article, name, (long)(smallerUnit.length * length));
      this.smallerUnit = smallerUnit;
    }

    /**
    * TimeUnit constructor
    * @param article String "a" or "an" or "the" or ""
    * @param name String unit name
    * @param length long number of smaller units in the unit
    * @param roundTo int to how many milliseconds to round before displaying
    * @param smallerUnit TimeUnit reference to the smaller TimeUnit
    */
    public TimeUnit(String article,
                    String name,
                    double length,
                    int    roundTo,
                    TimeUnit smallerUnit) {
      this(article, name, (long)(smallerUnit.length * length), roundTo);
      this.smallerUnit = smallerUnit;
    }

    /**
    * TimeUnit constructor
    * @param article String "a" or "an" or "the" or ""
    * @param name String unit name
    * @param plural String plural form of unit name
    * @param length double number of smaller units in the unit
    * @param smallerUnit TimeUnit reference to the smaller TimeUnit
    */
    public TimeUnit(String article,
                    String name,
                    String plural,
                    double length,
                    TimeUnit smallerUnit) {
      this(article, name, plural, (long)(smallerUnit.length * length));
      this.smallerUnit = smallerUnit;
    }

    /**
    * TimeUnit constructor
    * @param article String "a" or "an" or "the" or ""
    * @param name String unit name
    * @param plural String plural form of unit name
    * @param length long number of smaller units in the unit
    * @param roundTo int to how many milliseconds to round before displaying
    * @param smallerUnit TimeUnit reference to the smaller TimeUnit
    */
    public TimeUnit(String article,
                    String name,
                    String plural,
                    double length,
                    int    roundTo,
                    TimeUnit smallerUnit) {
      this(article, name, plural, (long)(smallerUnit.length * length), roundTo);
      this.smallerUnit = smallerUnit;
    }

    /**
     * returns "one unit" in text form
     * @return String
     */
    public String toString() {
      return article + " " + name;
    }

    /**
     * returns n units in text form
     * @param n long
     * @return String
     */
    public String toString(long n) { MessageFormat mf;
      return n < 1 ? "" : ("" + n + " " + (n > 1 ? plural : name));
    }

    public String getName() { return name; }


  }


  static TimeUnit TU_MILLISECOND = new TimeUnit("a", "millisecond",  1);
  static TimeUnit TU_SECOND      = new TimeUnit("a", "second",    1000);
  static TimeUnit TU_MINUTE      = new TimeUnit("a", "minute",      60,      TU_SECOND);
  static TimeUnit TU_HOUR        = new TimeUnit("an", "hour",       60,      TU_MINUTE);
  static TimeUnit TU_DAY         = new TimeUnit("a", "day",         24, 1,   TU_HOUR);
  static TimeUnit TU_WEEK        = new TimeUnit("a", "week",         7,      TU_DAY);
  static TimeUnit TU_MONTH       = new TimeUnit("a", "month",  365.25/12, 1, TU_DAY);
  static TimeUnit TU_YEAR        = new TimeUnit("a", "year",        12,      TU_MONTH);
  static TimeUnit TU_MILLENIUM   = new TimeUnit("a", "thousand years",
                                                  "thousand years", 1000 * TU_YEAR.length);
  static TimeUnit TU_MILLION     = new TimeUnit("a", "million years",
                                                  "million years", 1000000l * TU_YEAR.length);


  /**
   * all the units we know
   */
  static TimeUnit[] TIME_UNIT_LIST =
     new TimeUnit[] {TU_MILLION, TU_MILLENIUM, TU_YEAR,
                     TU_MONTH, TU_WEEK, TU_DAY, TU_HOUR,
                     TU_MINUTE, TU_SECOND, TU_MILLISECOND};


  static TimeUnit LEAST_TIME_UNIT = TU_MILLISECOND;

  /**
   * turns time into an approximate humanized value
   * @param time long time in milliseconds
   * @return String humanized form
   *
   * <br><br><b>Examples</b>:
   * <li><code>humanTime(4321)</code> returns "4 seconds"</li>
   * <li><code>humanTime(518520)</code> returns "8 minutes"</li>
   *
   */
  public static final String humanTime(long time) {
    return humanTime(time, LEAST_TIME_UNIT.getName());
  }

  /**
   * turns time into an approximate humanized value
   * @param time long time in milliseconds
   * @param smallestUnitName String the name of the smallest unit to use
   * @return String humanized form
   *
   * <br><br><b>Examples</b>:
   * <li><code>humanTime(4321, "minute")</code> returns "0 minutes"</li>
   * <li><code>humanTime(518520, "minute")</code> returns "8 minutes"</li>
   *
   */
  public static final String humanTime(long time, String smallestUnitName) {
    if (time < 0) {
      return it.localizedCantTellTime(time);
    }
    TimeUnit currentUnit = TIME_UNIT_LIST[0];

    for (int i = 0; i < TIME_UNIT_LIST.length; i++) {
      currentUnit      = TIME_UNIT_LIST[i];
      if (time > currentUnit.length) {
        TimeUnit lowerUnit     = TIME_UNIT_LIST[i].smallerUnit;
        long     nUnits        = time / currentUnit.length;
        long     nRoundedUnits = (time + currentUnit.length / 2) /
                                         currentUnit.length;
        long     nLowerUnits   = lowerUnit == null ? 0 :
            ( (time % currentUnit.length + lowerUnit.length / 2) /
                                           lowerUnit.length);
        // now let's round it
        nLowerUnits = nLowerUnits == 0 ? 0 :
            (nLowerUnits + lowerUnit.roundTo / 2) /
            lowerUnit.roundTo *
            lowerUnit.roundTo;

        return (nLowerUnits == 0 || nUnits > 9) ?
            // the case of one unit in use
            (nRoundedUnits == 1 ? currentUnit.toString() :
             currentUnit.toString(nRoundedUnits)) :
            // the case of two units in use
            (currentUnit.toString(nUnits) + " " +
             lowerUnit.toString(nLowerUnits));
      }
      if (currentUnit.name.equals(smallestUnitName)) break;
    }
    return it.localizedVeryLittleTime(time, currentUnit);
  }

  /**
   * localized version of stringifier for an unknown time period
   * @param time long
   * @return String
   */
  public String localizedCantTellTime(long time) {
    return "hard to tell";
  }
  /**
   * localized version of stringifier for a very small time period
   * @param time long
   * @param unit TimeUnit
   * @return String
   */
  public String localizedVeryLittleTime(long time, TimeUnit unit) {
    return "less than " + unit.toString();
  }
  /**
   * turns timestamp into an approximate form used by humans
   * @param timestamp long the moment to stringify
   * @return String humanized form
   *
   * <br><br><b>Examples</b>:
   * <li><code>humanTime(System.currentTimeMillis() + 4321)</code> returns "in 4 seconds"</li>
   * <li><code>humanTime(System.currentTimeMillis() - 518520)</code> returns "8 minutes ago"</li>
   *
   */
  public static final String humanWhen(long timestamp) {
    return humanWhen(timestamp, LEAST_TIME_UNIT.getName());
  }

  /**
   * turns timestamp into an approximate form used by humans
   * @param timestamp long the moment to stringify
   * @param unitName String the name of the smallest unit to use
   * @return String humanized form
   *
   * <br><br><b>Examples</b>:
   * <li><code>humanTime(System.currentTimeMillis() + 4321)</code> returns "in 4 seconds"</li>
   * <li><code>humanTime(System.currentTimeMillis() - 518520)</code> returns "8 minutes ago"</li>
   *
   */
  public static final String humanWhen(long timestamp, String unitName) {
    return it.localizedHumanWhen(timestamp, unitName);
  }

  /**
   * localized version of humanWhen
   * @param timestamp long
   * @param unitName String
   * @return String
   */
  public String localizedHumanWhen(long timestamp, String unitName) {
    if (timestamp == 0) return "never";
    long now = System.currentTimeMillis();
    return timestamp < now ? (humanTime(now - timestamp, unitName) + " ago") :
                        ("in " + humanTime(timestamp - now, unitName));
  }

  /**
   * returns plural of an English word (too simplistic so far)
   * @param word String the word
   * @return String plural form of the word
   *
   * <br><br><b>Examples</b>:
   * <li><code>toPlural("cat")</code> returns "cats"</li>
   * <li><code>toPlural("plurality")</code> returns "pluralities"</li>
   * <li><code>toPlural("catfish")</code> returns "catfishes"</li>
   * <li><code>toPlural("itch")</code> returns "itches"</li>
   */
  public static String toPlural(String word) {
    return word.endsWith("y")&&
           word.length() > 2 &&
           isVowel(word.charAt(word.length() - 1)) ? (word.substring(word.length() - 1) + "ies") :
           word.endsWith("s")  ||
           word.endsWith("sh") ||
           word.endsWith("ch") ? (word + "es") :
                                 (word + "s");
  }

  /**
   * returns plurality representation of a number and its unit
   * @param number String number of units
   * @param what String unit name
   * @return String <number> <unit>(s)?
   *
   * Zero is considered as plural too.
   *
   * <br><br><b>Examples</b>:
   * <li><code>plurality(0, "minute")</code> returns "0 minutes"</li>
   * <li><code>plurality(8, "inch")</code> returns "8 inches"</li>
    * <li><code>plurality(1, "day")</code> returns "1 day"</li>
   */
  public static String plurality(String number, String what) {
    return number + " " + what +
        (number.equals("1") ? what : toPlural(what));
  }


  /**
   * returns plurality representation of a number and its unit
   * @param number String number of units
   * @param what String unit name
   * @param ps String post scriptum - what to add if there is something to add to, see examples
   * @return String <number> <unit>(s)?
   *
   * Zero is considered as plural too.
   *
   * <br><br><b>Examples</b>:
   * <li><code>plurality(0, "minute", "long")</code> returns ""</li>
   * <li><code>plurality(8, "inch", "wide")</code> returns "8 inches wide"</li>
    * <li><code>plurality(1, "day", "ago")</code> returns "1 day ago"</li>
   */
  public static String plurality(String number, String item, String ps) {
    return number.equals("0") ? "" : (plurality(number, item) + ps);
  }
}
