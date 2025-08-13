/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)FunctionValueCollection.java	5.0 11/20/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */
package com.myjavatools.lib.foundation;

import java.util.Iterator;
import java.util.Collection;
import java.util.AbstractCollection;

/**
 * FunctionValueCollection is a helper class that represents Collection of values
 * of a Function on a specific Collection
 *
 * Note that this class does not take any additional memory; lazy evaluation uses
 * only the keyset provided
 *
 * @version 5.0, 11/15/04
 *
 * @see Function
 * @see FunctionalMap
 * @see Maps
 * @see java.util.Map
 * @since 5.0
 */

class FunctionValueCollection<Domain,Codomain>
    extends AbstractCollection<Codomain> {
  private Function<Domain,Codomain> function;
  private Collection<Domain> domain;

  /**
   * creates a new FunctionValueCollection from a function and a collection
   * @param function Function&lt;Domain,Codomain>
   * @param domain Collection&lt;Domain>
   */
  public FunctionValueCollection(Function<Domain,Codomain> function,
  Collection<Domain>domain) {
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
    for (Domain key : domain) {
      if (function.apply(key).equals(value)) {
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
  public Iterator<Codomain> iterator() {
    return Iterators.map(function, domain.iterator());
  }
}
