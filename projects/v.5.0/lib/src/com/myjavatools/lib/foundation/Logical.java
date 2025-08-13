/**
 * <p>Title: MyJavaTools: Logical values and operations</p>
 * <p>Description: Simple intuitionist logic (true, false, undef)
 *
 * Good for Java 5.0 and up.</p>
 * <p>Copyright: This is public domain;
 * The right of people to use, distribute, copy or improve the contents of the
 * following may not be restricted.</p>
 *
 * @version 5.0
 * @author Vlad Patryshev
 */

package com.myjavatools.lib.foundation;

public abstract class Logical {

  static public enum LogicalConstant {
    /**
     * Something we believe is true
     */
    TRUE,
     /**
      * Something we believe is not true
      */
    FALSE,
    /**
     * Something we don't know
     */
    UNDEF
  };

    /**
     * Conjunction of two logical values
     * @param a LogicalConstant
     * @param b LogicalConstant
     * @return LogicalConstant that is a&b
     */
    static public LogicalConstant and(LogicalConstant a, LogicalConstant b) {
    switch (a) {
      case TRUE:
        return b;
      case FALSE:
        return LogicalConstant.FALSE;
      default: //case UNDEF:
        return b == LogicalConstant.TRUE ? a : b;
    }
  }

  /**
   * Disjunction of two logical values
   * @param a LogicalConstant
   * @param b LogicalConstant
   * @return LogicalConstant that is a|b
   */
  static public LogicalConstant or(LogicalConstant a, LogicalConstant b) {
    switch (a) {
      case TRUE:
        return LogicalConstant.TRUE;
      case FALSE:
        return b;
      case UNDEF:
      default:
        return b == LogicalConstant.FALSE ? a : b;
    }
  }

  /**
   * Negation of a logical value
   * @param a LogicalConstant
   * @return LogicalConstant that is !a
   */
  static public LogicalConstant not(LogicalConstant a) {
    switch (a) {
      case FALSE:
        return LogicalConstant.TRUE;
      case TRUE:
      case UNDEF:
      default:
        return LogicalConstant.FALSE;
    }
  }

  /**
   * Conjunction of two predicates
   * @param f Predicate<T>
   * @param g Predicate<T>
   * @return Predicate<T> that is f & g
   */
  static public <T> Predicate<T> and(Predicate<T> f, Predicate<T> g) {
    final Predicate<T> fLocal = f;
    final Predicate<T> gLocal = g;

    return new Predicate<T>() {
      public LogicalConstant apply(T x) {
        return and(fLocal.apply(x), gLocal.apply(x));
      }
    };
  }

  /**
   * Disjunction of two predicates
   * @param f Predicate<T>
   * @param g Predicate<T>
   * @return Predicate<T> that is f | g
   */
  static public <T> Predicate<T> or(Predicate<T> f, Predicate<T> g) {
    final Predicate<T> fLocal = f;
    final Predicate<T> gLocal = g;

    return new Predicate<T>() {
      public LogicalConstant apply(T x) {
        return or(fLocal.apply(x), gLocal.apply(x));
      }
    };
  }

  /**
   * Negation of a predicate
   * @param f Predicate<T>
   * @return Predicate<T> that is !f
   */
  static public <T> Predicate<T> not(Predicate<T> f) {
    final Predicate<T> fLocal = f;

    return new Predicate<T>() {
      public LogicalConstant apply(T x) {
        return not(fLocal.apply(x));
      }
    };
  }
}
