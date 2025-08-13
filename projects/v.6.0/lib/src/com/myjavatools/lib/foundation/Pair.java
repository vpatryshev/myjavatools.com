/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Pair.java	6.0 04/25/06
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
 * @version 6.0 04/25/06
 *
 * @see Map#Entry
 * @since 5.0
 */

public class Pair<Left, Right> implements Map.Entry<Left,Right> {
  protected Left left;
  protected Right right;

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

  protected static boolean pairEqual(Map.Entry pair1, Map.Entry pair2) {
    return pair1 == null ? pair2 == null :
        Objects.equal(pair1.getKey(), pair2.getKey()) &&
        Objects.equal(pair1.getValue(), pair2.getValue());
  }

  /**
   * equals method
   * @param x Object to compare to
   * @return boolean true if x is not null and equals(this)
   * equals(Map.Entry) returns true if the two entries have equal key and
   * equal value are equal
   */
  public boolean equals(Object x) {
    return x == this ||
           x instanceof Map.Entry &&
           pairEqual(this, (Map.Entry<Left,Right>)x);
  }

  protected static int hashCode(Map.Entry pair) {
    return pair.getKey().hashCode() * 37 + pair.getValue().hashCode();
  }

  /**
   * some hashcode for Pair made from left and right hash codes
   * @return int
   */
  public int hashCode() {
    return hashCode(this);
  }

  /**
   * left getter
   * @return Left
   */
  public Left left() {
    return left;
  }

  /**
   * right getter
   * @return Right
   */
  public Right right() {
    return right;
  }

  /**
   * swaps left and right
   * @return new Pair&lt;Right,Left> (right, left)
   */
  public Pair<Right,Left> swap() {
    return new Pair<Right,Left>(right(), left());
  }
}
