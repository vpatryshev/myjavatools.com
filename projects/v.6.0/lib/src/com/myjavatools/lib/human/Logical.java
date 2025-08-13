/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Logical.java	5.0 11/24/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.human;

import com.myjavatools.lib.foundation.*;

/**
 * Logical is a class that represents a multivalued logic the mathematical notion of
 * function: X -> Y. To implement a function, you need to define method apply():
 * Y y = function.apply(X x).
 *
 * @version 5.0, 11/15/04
 *
 * @see Filter
 * @see Maps
 * @see java.util.Map
 * @since 5.0
 */

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
  static public <T> Predicate<T> and(final Predicate<T> f, final Predicate<T> g) {
    return new Predicate<T>() {
      public LogicalConstant apply(T x) {
        return and(f.apply(x), g.apply(x));
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
