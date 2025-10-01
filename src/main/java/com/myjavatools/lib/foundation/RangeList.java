/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)RangeList.java	6.0 05/04/06
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * RangeList is a class that represents a list of values in a range.
 * It is immutable.
 *
 * @version 6.0 05/04/06
 *
 * @see List
 * @since 5.0
 */

public class RangeList {

  /**
   * Creates a list of integers
   * @param from int
   * @param to int
   * @param step int
   * @return List that "contains" integers from
   * <code>from</code> to <code>to</to> with a step <code>step</step>
   */
  public static List<Integer> rangeList(final int from, int to, final int step) {
    final int sign = step < 0 ? -1 : 1;
    final int size = step == 0 ? 0 :
                     (to - from + step - sign) / step < 0 ? 0 :
                     (to - from + step - sign) / step;
    return new AbstractList<Integer>() {
      public Integer get(int index) {
        if (index < size) {
          return from + step * index;
        } else {
          throw new IndexOutOfBoundsException("" + index + "/" + size);
        }
      }

      public int size() {
        return size;
      }
    };
  }

  /**
   * Creates a list of integers
   * @param from integer
   * @param to int
   * @return List that "contains" integers from <code>from</code> to <code>to</to>
   */
  public static List<Integer> rangeList(int from, int to) {
    return rangeList(from, to, 1);
  }

  /**
   * Creates a list of doubles
   * @param from double
   * @param to double
   * @param step double
   * @return List that "contains" doubles
   * from <code>from</code> to <code>to</to> with a step <code>step</step>
   */
  public static List<Double> rangeList(final double from, final double to, final double step) {
    final int size = step == 0 ? 0 : (int) ( (to - from + step / 2) / step);

    return new AbstractList<Double> () {
      public Double get(int index) {
        if (index < size) {
          return from + step * index;
        } else {
          throw new IndexOutOfBoundsException("" + index + "/" + size);
        }
      }

      public int size() {
        return size;
      }
    };
  }
}
