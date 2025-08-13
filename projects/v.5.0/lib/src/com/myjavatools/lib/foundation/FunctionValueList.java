/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)FunctionValueList.java	5.0 11/20/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */
package com.myjavatools.lib.foundation;

import java.util.Iterator;
import java.util.AbstractList;
import java.util.List;

/**
 * FunctionValueList is a helper class that represents List of values
 * of a Function on a specific List
 *
 * Note that this class does not take any additional memory; lazy evaluation uses
 * only the keyset provided
 *
 * @version 5.0, 11/24/04
 *
 * @see Function
 * @see FunctionalMap
 * @see Maps
 * @see java.util.Map
 * @since 5.0
 */

class FunctionValueList<X,Y> extends AbstractList<Y> {
  private Function<X,Y> function;
  private List<X> domain;

  private static <T> boolean equal(T a, T b) {
    return a == null ? b == null : a.equals(b);
  }

  /**
   * creates a new FunctionValueList from a function and a collection
   * @param function Function&lt;X,Y>
   * @param domain List&lt;X>
   */
  public FunctionValueList(Function<X,Y> function, List<X>domain) {
    this.function = function;
    this.domain   = domain;
  }

  /**
   * Returns <tt>true</tt> if the function maps one or more keys from domain
   * to the specified value.
   *
   * @param value value whose presence in this map is to be tested.
   * @return <tt>true</tt> if the function's value on one or more keys is the specified
   *   value.
   * Note that this method is extremely inefficient - as probably any implementation
   * of contains() on an unstructured, non-indexed collection.
   */
  public boolean contains(Object value) {
    for (X key : domain) {
      if (equal(function.apply(key), value)) {
        return true;
      }
    }
    return false;
  }


  /**
   * Returns the number of elements in this collection.
   *
   * @return the number of elements in this collection.
   */
  public int size() {
    return domain.size();
  }

  /**
   * returns an Iterator that scans over the values of function on domain
   * @return Iterator
   */
  public Iterator<Y> iterator() {
    return function.apply(domain.iterator());
  }

  /**
   * Returns the element at the specified position in this list.
   *
   * @param index index of element to return.
   * @return the element at the specified position in this list.
   *
   * @throws IndexOutOfBoundsException if the index is out of range (index
   * 		  &lt; 0 || index &gt;= size()).
   */
  public Y get(int index) {
    return function.apply(domain.get(index));
  }
}
