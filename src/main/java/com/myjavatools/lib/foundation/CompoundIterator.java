/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)CompoundIterator.java	6.0 04/28/06
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * CompoundIterator is an Iterator that walks over iterators of its components,
 * one after another.
 * You are not supposed to use this class directly; it is being used by other
 * classes, like CompoundIterable and CompoundCollection.
 *
 * @version 6.0 04/28/06
 *
 * @see java.util.Iterator
 * @see java.util.Iterable
 * @see Iterators
 * @since 5.0
 */
class CompoundIterator<T>
    implements Iterator<T> {
  private final Iterator<? extends Iterable<? extends T>> outerIterator;
  private Iterator<? extends T> currentIterator = null;

  CompoundIterator(Iterator<? extends Iterable<? extends T>> outerIterator) {
    this.outerIterator = outerIterator;
  }

  /** @return <tt>true</tt> if the iterator has more elements. */
  public boolean hasNext() {
    while (currentIterator == null || !currentIterator.hasNext()) {
      if (!outerIterator.hasNext()) {
        return false;
      } else {
        currentIterator = outerIterator.next().iterator();
      }
    }
    return true;
  }

  /** @return the next element in the iteration. */
  public T next() {
    if (hasNext()) {
      return currentIterator.next();
    }
    throw new NoSuchElementException();
  }

  /**
   * Removes from the underlying collection the last element returned by the
   * iterator.
   */
  public void remove() {
    if (currentIterator == null) throw new IllegalStateException();
    currentIterator.remove();
  }
}
