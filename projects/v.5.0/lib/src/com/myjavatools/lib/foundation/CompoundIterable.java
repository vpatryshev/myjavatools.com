/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)CompoundIterable.java	5.0 12/03/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * CompoundIterable is an Iterable that is composed of several other iterable.
 * Its iterator() returns an iterator that scans through the components'
 * iterators, one after another.
 *
 * @version 5.0, 12/03/04
 *
 * @see java.util.Iterable
 * @see com.myjavatools.lib.foundations.Iterators
 * @since 5.0
 */
public class CompoundIterable<T> implements Iterable<T> {
  private final Iterable<? extends Iterable<? extends T>> components;

  /**
   * builds a CompoundIterable from a vararg list of Iterable components
   * @param components Iterable...
   */
  public CompoundIterable(Iterable<? extends T>... components) {
  this(Arrays.asList(components));
  }

  /**
   * builds a CompoundIterable from an Iterable container of of Iterable components
   * @param components Iterable<? extends Iterable<? extends T>>
   */
  public CompoundIterable(Iterable<? extends Iterable<? extends T>> components) {
    this.components = components;
  }

  public Iterator<T> iterator() {
    return new CompoundIterator<T>(components.iterator());
  }
}
