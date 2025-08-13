/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)CompoundCollection.java	5.0 12/03/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * CompoundCollection is a Collection that consists of
 * other Collections, and is viewed as one Collection
 *
 * @version 5.0, 12/03/04
 * @see java.util.Collection
 * @see Iterators
 * @since 5.0
 */
class CompoundCollection<T>
    extends AbstractCollection<T> {

    /**
     * the outer list of collections
     */
    List<Collection<? extends T>> componentList;

  public CompoundCollection(Collection<? extends T>... components) {
    componentList = Arrays.asList(components);
  }

  public CompoundCollection(List<Collection<? extends T>> components) {
    componentList = components;
  }

  /**
   * Clears all the collections,
   */
  public void clear() {
    for (Collection<? extends T> collection : componentList) {
      collection.clear();
    }
  }

  /**
   * Removes from this collection all of its elements that are contained in
   * the specified collection. <p>
   *
   * This implementation iterates over the list, removing the
   * specified elements from each collection.
   *
   * @param toRemove elements to be removed from this collection.
   * @return <tt>true</tt> if this collection changed as a result of the
   *         call.
   * @throws UnsupportedOperationException if the <tt>removeAll</tt> method
   * 	       is not supported by one of the collections, except one
   *         specific case when a collection contains just one
   *         element - in this case this collection is just removed from
   *         the list.
   * @throws NullPointerException if the specified collection is null.
   *
   * @see #remove(Object)
   * @see #contains(Object)
   */
  public boolean removeAll(Collection<?> toRemove) {
    boolean wasChanged = false;
    for (Collection<? extends T> component : componentList) {
      wasChanged |= component.removeAll(toRemove);
    }

    return wasChanged;
  }

  /**
   * Adds the specified collection to the list, so that
   * its element can be listed as the elements of this view collection.
   * No action if the collection being added is empty.<p>
   *
   * @param toAdd collection that is added to this collection.
   * @return <tt>true</tt> if this collection changed as a result of the
   *         call.
   * @throws NullPointerException if the specified collection is null.
   *
   * @see #add(Object)
   */
  public boolean addAll(Collection<? extends T> toAdd) {
    if (toAdd == null || toAdd.isEmpty()) return false;
    Collection<? extends T> x = toAdd;
    componentList.add(null);
    componentList.add(x);
    return true;
  }

  /**
   * Adds the specified element to the collection.  Returns <tt>true</tt>
   * meaning the collection changed as a result of the call.
   * In this implementation, a singlton collection containing the element is
   * added to the list.<p>
   *
   * @param element element being added to this collection.
   * @return <tt>true</tt> if the collection changed as a result of the call.
   */
  public boolean add(T element) {
    Collection<? extends T> l1 = Collections.singletonList(element);
    return componentList.add(l1);
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
    for (Collection<? extends T> collection : componentList) {
      size += collection.size();
    }
    return size;
  }

  /**
   * Returns an iterator over all the elements of listed collections.
   *
   * @return an Iterator.
   */
  public Iterator<T> iterator() {
    Iterator<Collection<? extends T>> i = componentList.iterator();
    return new CompoundIterator<T>(i);
  }

}
