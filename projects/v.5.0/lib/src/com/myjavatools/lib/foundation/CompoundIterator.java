/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)CompoundIterator.java	5.0 12/03/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * CompoundIterator is an Iterator that walks over iterators of its components,
 * one after another.
 *
 * @version 5.0, 12/04/04
 *
 * @see java.util.Iterator
 * @see java.util.Iterable
 * @see Iterators
 * @since 5.0
 */
class CompoundIterator<T>
    implements Iterator<T> {
  private final Iterator<? extends Iterable<? extends T>> outerIterator;
  private Iterator<? extends T> current = null;

  public CompoundIterator(Iterator<? extends Iterable<? extends T>> outerIterator) {
    this.outerIterator = outerIterator;
  }

  /**
   * Returns <tt>true</tt> if the iteration has more elements.
   *
   * @return <tt>true</tt> if the iterator has more elements.
   */
  public boolean hasNext() {
    while (current == null || !current.hasNext()) {
      if (!outerIterator.hasNext()) {
        return false;
      } else {
        current = outerIterator.next().iterator();
      }
    }
    return true;
  }

  /**
   * Returns the next element in the iteration.
   *
   * @return the next element in the iteration.
   */
  public T next() {
    if (hasNext()) {
      return current.next();
    }
    throw new NoSuchElementException();
  }

  /**
   * Removes from the underlying collection the last element returned by the
   * iterator (optional operation).
   */
  public void remove() {
    if (current == null) throw new IllegalStateException();
    current.remove();
  }
}
