/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)CompoundCollection.java	6.0 04/28/06
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * CompoundCollection is a Collection that consists of other Collections,
 * viewed as one Collection.
 *
 * @version 6.0 04/28/06
 * @see java.util.Collection
 * @see Iterators
 * @since 5.0
 */
class CompoundCollection<T> extends ShrinkingCompoundCollection<T> {

  /**
   * This collection takes bulk additions.
   */
  List<Collection<? extends T>> bulkAppendage;

  /**
   * This collection takes bulk additions.
   */
  List<T> appendage;

  /**
   * Instantiates a compound collection from vararg list of components.
   * @param components Collection[]
   */
  public CompoundCollection(Collection<? extends T>... components) {
    this(Arrays.asList(components));
  }

  /**
   * Instantiates a compound collection, saving appendageCollection
   * for future use.
   * @param components Collection
   * @param bulkAppendage Collection that will be used for adding new collections
   * @param dummy to differentiate this constructor
   */
  private CompoundCollection(
      Collection<? extends Collection<? extends T>> components,
      List<Collection<? extends T>> bulkAppendage,
      boolean dummy) {
    super(new ShrinkingCompoundCollection<Collection<? extends T>>
          (components, bulkAppendage));
    this.bulkAppendage = bulkAppendage;
    this.appendage = new LinkedList<T>();

    this.bulkAppendage.add(this.appendage);
  }

  /**
   * Instantiates a compound collection from a collection of components.
   * @param components Collection
   */
  public CompoundCollection(Collection<? extends Collection<? extends T>> components) {
    this(components, new LinkedList<Collection<? extends T>>(), false);
  }

  /**
   * Adds the specified collection to the list, so that
   * its element can be listed as the elements of this view collection.
   * No action if the collection being added is empty.<p>
   *
   * @param toAdd collection to add to this collection.
   * @return <tt>true</tt> if this collection has changed
   * as a result of the call.
   * @see #add(Object)
   */
  public boolean addAll(Collection<? extends T> toAdd) {
    if (toAdd.isEmpty()) return false;
    bulkAppendage.add(toAdd);
    return true;
  }

  /**
   * Adds an element to the collection.  Returns <tt>true</tt>
   * meaning the collection changed as a result of the call.
   * In this implementation, a singlton collection containing the element is
   * being added.<p>
   *
   * @param element element being added to this collection.
   * @return <tt>true</tt> if the collection changed as a result of the call.
   */
  public boolean add(T element) {
    return appendage.add(element);
  }
}
