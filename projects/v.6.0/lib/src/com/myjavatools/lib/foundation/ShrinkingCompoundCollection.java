/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)ImmutableCompoundCollection.java	6.0 04/27/06
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * ShrinkingCompoundCollection is a Collection that consists of other
 * Collections, viewed as one Collection; it can only shrink, but cannot
 * add elements.
 *
 * @version 6.0 04/28/06
 * @see java.util.Collection
 * @see Iterators
 * @since 5.0
 */
class ShrinkingCompoundCollection<T> extends AbstractCollection<T> {

  /**
   * the outer collection
   */
  Collection<? extends Collection<? extends T>> mainCollection;

  /**
   * Instantiates a compound collection from vararg list of components.
   * @param components Collection[]
   */
  public ShrinkingCompoundCollection(Collection<? extends T>... components) {
    this(Arrays.asList(components));
  }

  /**
   * Instantiates a compound collection from a collection of components.
   * @param components Collection
   */
  public ShrinkingCompoundCollection(
      Collection<? extends Collection<? extends T>> components) {
    this.mainCollection = components;
  }

  /**
   * Clears all the compound collections,
   */
  public void clear() {
    for (Collection<? extends T> collection : mainCollection) {
      collection.clear();
    }
  }

  /**
   * Removes a single instance of the specified element from this
   * compound collection, if it is present.  More formally,
   * removes an element <tt>e</tt> such that <tt>(o==null ? e==null :
   * o.equals(e))</tt>, if such element is found. Returns <tt>true</tt>
   * if the collection contained the specified element.<p>
   *
   * Note that this implementation can throw an
   * <tt>UnsupportedOperationException</tt> if the component that contains
   * the element throws it on element deletion.
   *
   * @param o element to be removed from this collection, if present.
   * @return <tt>true</tt> if the collection contained the specified
   *         element.
   * @throws UnsupportedOperationException if the component containing the
   * element throws this exception.
   */
  public boolean remove(Object o) {
      for (Collection<? extends T> component : mainCollection) {
        if (component.remove(o)) {
          return true;
        }
      }
      return false;
  }

  /**
   * Removes from this collection all of its elements that are contained in
   * the specified collection. <p>
   *
   * This implementation iterates over the outer collection, removing the
   * specified elements from each inner collection.
   *
   * @param toRemove elements to be removed from this collection.
   * @return <tt>true</tt> if this collection changed as a result of the
   *         call.
   * @throws UnsupportedOperationException if the <tt>removeAll</tt> method
   * 	       is not supported by one of the collections, except one
   *         specific case when a collection contains just one
   *         element - in this case this collection is just removed from
   *         the outer collection.
   *
   * @see #remove(Object)
   * @see #contains(Object)
   */
  public boolean removeAll(Collection<?> toRemove) {
    boolean wasChanged = false;

    for (Collection<? extends T> component : mainCollection) {
      wasChanged |= component.removeAll(toRemove);
    }

    return wasChanged;
  }

  /**
   * Adds the specified collection to the list, so that
   * its element can be listed as the elements of this view collection -
   * unsupported.
   *
   * @param toAdd collection to add to this collection.
   * @return nothing
   * @throws UnsupportedOperationException
   */
  public boolean addAll(final Collection<? extends T> toAdd) {
    throw new UnsupportedOperationException("This class is immutable");
  }

  /**
   * Adds an element to the collection - unsupported.
   *
   * @param element element being added to this collection.
   * @return nothing
   * @throws UnsupportedOperationException
   */
  public boolean add(T element) {
    throw new UnsupportedOperationException("This class is immutable");
  }

  /**
   * Returns the number of elements in this collection.  If the collection
   * contains more than <tt>Integer.MAX_VALUE</tt> elements, returns
   * <tt>Integer.MAX_VALUE</tt>. The size is calculated as the sum of
   * the sizes of its collections.
   *
   * @return the number of elements in this collection.
   */
  public int size() {
    int size = 0;
    for (Collection<? extends T> collection : mainCollection) {
      size += collection.size();
    }
    return size;
  }

  /**
   * Returns an iterator over all the elements of component collections.
   *
   * @return an Iterator.
   */
  public Iterator<T> iterator() {
    Iterator<? extends Collection<? extends T>> i = mainCollection.iterator();
    return new CompoundIterator<T>(i);
  }
}
