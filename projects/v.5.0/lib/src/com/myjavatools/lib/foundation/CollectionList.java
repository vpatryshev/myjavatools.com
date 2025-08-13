/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)CollectionList.java	5.0 11/20/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * CollectionList is a list that consists of
 * Collections, and is viewed as one Collection
 *
 * @version 5.0, 11/20/04
 * @see java.util.Collection
 * @see java.util.Iterator
 * @since 5.0
 */
class CollectionList<T>
    extends AbstractCollection<T> {

    /**
     * the list of collections
     */
    List<Collection<T>> collectionList;

  CollectionList(Collection<T>... components) {
    collectionList = new ArrayList<Collection<T>>(components.length);

    for (Collection<T> component : components) {
      addAll(component);
    }
  }
  /**
   * Clears all the collections, then removes them from the list
   */
  public void clear() {
    for (Collection<T> collection : collectionList) {
      collection.clear();
    }
    collectionList.clear();
  }

  /**
   * Cleans the internal list, removing empty collections
   */
  private void cleanList() {
    for (Iterator<Collection<T>> i = collectionList.iterator(); i.hasNext();) {
      if (i.next().isEmpty()) {
        i.remove();
      }
    }
  }

  /**
   * Removes from this collection all of its elements that are contained in
   * the specified collection. <p>
   *
   * This implementation iterates over the list, removing the
   * specified elements from each collection. The empty collections
   * are then removed from the list.
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
    for (Collection<T> component : collectionList) {
      wasChanged |= component.removeAll(toRemove);
    }

    if (wasChanged) {
      cleanList();
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

    collectionList.add((Collection<T>)toAdd);
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
    return collectionList.add(Collections.singletonList(element));
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
    for (Collection<T> collection : collectionList) {
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
    return new Iterator<T>() {
      Iterator <Collection<T>> outerLoop = collectionList.iterator();
      Collection<T> currentCollection = null;
      boolean haveCurrent = false;
      T current = null;
      Iterator<T> innerLoop = null;

      public void remove() {
        if (haveCurrent) {
          try {
            innerLoop.remove();
          } catch (UnsupportedOperationException uoe) {
            if (currentCollection.size() == 1 &&
                currentCollection.contains(current)) {
              outerLoop.remove();
            }
          }
          if (currentCollection.isEmpty()) {
            outerLoop.remove();
          }
          haveCurrent = false;
        } else {
          throw new IllegalStateException();
        }
      }

      public boolean hasNext() {
        haveCurrent = false;
        while (innerLoop == null ||
              !innerLoop.hasNext()) {
          if (!outerLoop.hasNext()) {
            return false;
          }
          currentCollection = outerLoop.next();
          innerLoop = currentCollection.iterator();
        }
        return true;
      }

      public T next() {
        if (!hasNext()) {
          throw new NoSuchElementException();
        }
        current = innerLoop.next();
        haveCurrent = true;
        return current;
      }
    };
  }
}
