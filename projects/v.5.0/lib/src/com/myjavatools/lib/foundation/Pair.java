
/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Pair.java	5.0 11/25/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.Map;

/**
 * Pair&lt;Left, Right> is a class that represents pairs of objects.
 * It is similar to Map.Entry. Pair is immutable.
 *
 * @version 5.0, 11/25/04
 *
 * @see Map#Entry
 * @since 5.0
 */

public class Pair<Left, Right> implements Map.Entry<Left,Right> {
  final private Left left;
  final private Right right;

  /**
   * Constructor, creates a new pair from two objects.
   * @param left Left
   * @param right Right
   */
  public Pair(Left left, Right right) {
    this.left = left;
    this.right = right;
  }

  /**
   * value setter - unsupported (immutable class)
   * @param value Right ignored
   * @return Right none actually
   * @throws UnsupportedOperationException - always
   */
  public Right setValue(Right value) {
    throw new UnsupportedOperationException();
  }

  /**
   * value getter (to implement Map.Entry)
   * @return Right the map entry value
   */
  public Right getValue() {
    return right();
  }

  /**
   * key getter (to implement Map.Entry)
   * @return Left the map entry key
   */
  public Left getKey() {
    return left();
  }

  private boolean equal(Object x, Object y) {
    return x == null ? y == null : x.equals(y);
  }

  private boolean isEqual(Map.Entry<Left,Right> that) {
    return equal(getKey(),   that.getKey()) &&
           equal(getValue(), that.getValue());
  }

  /**
   * equals method
   * @param x Object to compare to
   * @return boolean true if x is not null and equals(this)
   * equals(Map.Entry) returns true if the two entries have equal key and
   * equal value are equal
   */
  public boolean equals(Object x) {
  // note double dispatch here: if x is Pair, it will use eauals(Map.Entry).
//    return x == null ? false : x.equals(this);
    return x == null ? false : x == this ? true :
           x instanceof Map.Entry ? isEqual((Map.Entry<Left,Right>)x) : false;
  }

  /**
   * some hashcode for Pair made from left and right hash codes
   * @return int
   */
  public int hashCode() {
    return left().hashCode() * 37 + right().hashCode();
  }

  /**
   * left getter
   * @return Left
   */
  public final Left left() {
    return left;
  }

  /**
   * right getter
   * @return Right
   */
  public final Right right() {
    return right;
  }

  /**
   * swaps left and right
   * @return new Pair&lt;Right,Left> (right, left)
   */
  public final Pair<Right,Left> swap() {
    return new Pair<Right,Left>(right, left);
  }
}
