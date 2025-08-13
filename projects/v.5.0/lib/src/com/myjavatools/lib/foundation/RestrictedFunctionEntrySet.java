package com.myjavatools.lib.foundation;

import java.util.*;

/**
 *  <p>Title: My Java Tools Library, foundations, RestrictedFunctionEntrySet</p>
 *
 * <p>Description: This helper class represents an entry set for a map restricted to a
 * collection of keys; it is used in Maps class.</p>
 *
 * @(#)RestrictedFunctionEntrySet.java	5.0 01/26/05
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 *
 *
 *
 */
class RestrictedFunctionEntrySet<X,Y>
    extends AbstractSet<Map.Entry<X,Y>> {
    /**
     * the function
     */
    private Function<X,Y> function;
    /**
     * the collection of keys to which the map is na
     */
    private Collection<X> keys;

    /**
     * Constructor, creates an instance of RestrictedFunctionEntrySet
     * @param function Function
     * @param keys Collection key collection
     */
    public RestrictedFunctionEntrySet(Function<X,Y> function, Collection<X> keys) {
    super();
    this.function = function;
    this.keys = keys;
  }

  /**
   * the size of the map is the size of the background keys collection
   * (I take the liberty to ignore the requirement that keys ought to be
   * non-repeating)
   */

  public int size() {
    return keys.size();
  }
  /**
   * iterator that scans through the entries of this map,
   * that is those that belong to the key collection and are valid
   * @return Iterator
   */
  public Iterator<Map.Entry<X,Y>> iterator() {
    return new Iterator<Map.Entry<X,Y>>() {
      Iterator<X> baseIterator = getKeys().iterator();
      X key;
      boolean haveKey = false;

      public void remove() {
        throw new UnsupportedOperationException();
      }
      public boolean hasNext() {
        if (haveKey) {
          return true;
        }
        while(baseIterator.hasNext()) {
          key = baseIterator.next();
          if (isValidKey(key)) {
            haveKey = true;
            return true;
          }
        }
        return false;
      }
      public Map.Entry<X,Y> next() {
        if (hasNext()) {
          haveKey = false;
          return new Map.Entry<X,Y>() {
            public Y setValue(Y y) {
              throw new UnsupportedOperationException();
            }
            public Y getValue() {
              return function.apply(key);
            }
            public X getKey() {
              return key;
            }
          };
        }
        throw new NoSuchElementException();
      }
    };
  }

  /**
   * operation not supported
   */
  public void clear() {
    throw new UnsupportedOperationException();
  }
  /**
   * operation not supported
   */
  public boolean remove(Object toRemove) {
    throw new UnsupportedOperationException();
  }
  /**
   * operation not supported
   */
  public boolean removeAll(Collection<?> toRemove) {
    throw new UnsupportedOperationException();
  }
  /**
   * operation not supported
   */
  public boolean retainAll(Collection<?> toRemove) {
    throw new UnsupportedOperationException();
  }
  /**
   * operation not supported
   */
  public boolean add(Map.Entry<X,Y> toAdd) {
    throw new UnsupportedOperationException();
  }
  /**
   * operation not supported
   */
  public boolean addAll(Collection<? extends Map.Entry<X,Y>> toAdd) {
    throw new UnsupportedOperationException();
  }
  /**
   * checks whether a collection is contained in this entryset.
   * @param toCheck Collection
   * @return boolean
   */
  public boolean containsAll(Collection<?> toCheck) {
    for (Object element : toCheck) {
      if (!(element instanceof Map.Entry)) {
        return false;
      }
      Map.Entry entry = (Map.Entry)element;

      if (!isValidKey(entry.getKey()) ||
          !getKeys().contains(entry.getKey())) {
        return false;
      }
      if (!function.apply((X)entry.getKey()).equals(entry.getValue())) {
        return false;
      }
    }
    return true;
  }
  /**
   * creates a List copy of this entry set
   * @return List
   */
  private List<Map.Entry<X,Y>> copy() {
    List<Map.Entry<X,Y>> result = new LinkedList<Map.Entry<X,Y>>();
    for (Map.Entry<X,Y> entry : this) {
      result.add(entry);
    }
    return result;
  }
  /**
   * creates an array of entries from this entry set
   * @return Map&lt;X,Y>[]
   */
  public Map<X,Y>[] toArray() {
    return (Map<X,Y>[])copy().toArray();
  }

  /**
   * produces an array of entries from this entry set
   * @param array Map[] suggested storage for results
   * @return Map[] resulting array
   */
  public Map<X,Y>[] toArray(Map<X,Y>[] array) {
    return copy().toArray(array);
  }

  protected Collection<X> getKeys() {
    return keys;
  }

  protected boolean isValidKey(Object key) {
    return true;
  }
}
