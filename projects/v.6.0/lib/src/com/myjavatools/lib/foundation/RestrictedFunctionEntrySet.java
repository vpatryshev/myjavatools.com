package com.myjavatools.lib.foundation;

import java.util.*;

/**
 *  <p>Title: My Java Tools Library, foundations, RestrictedFunctionEntrySet</p>
 *
 * <p>Description: This helper class represents an entry set for a map
 * restricted to a set of keys; it is used in Maps class.</p>
 *
 * @(#)RestrictedFunctionEntrySet.java	6.0 04/25/06
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */
class RestrictedFunctionEntrySet<X,Y> extends AbstractSet<Map.Entry<X,Y>> {
  /**
   * the function
   */
  private Function<X,Y> function;

  /**
   * the set of keys
   */
  private Set<? extends X> keys;

  /**
   * Constructor, creates an instance of RestrictedFunctionEntrySet
   * @param function Function
   * @param keys Set key set
   */
  public RestrictedFunctionEntrySet(Function<X,Y> function, Set<? extends X> keys) {
    super();
    this.function = function;
    this.keys = Collections.unmodifiableSet(keys);
  }

/**
 * Constructor, creates an instance of RestrictedFunctionEntrySet
 * @param function Function
 * @param keys Collection key collection
 *
 * Note. This constructor creates a new HashSet that contains the keys.
 */
public RestrictedFunctionEntrySet(Function<X,Y> function, Collection<? extends X> keys) {
  this(function, new HashSet<X>(keys));
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
      Iterator<? extends X> baseIterator = getKeys().iterator();
      X currentKey;
      boolean haveKey = false;

      public void remove() {
        baseIterator.remove();
      }

      public boolean hasNext() {
        while(!haveKey && baseIterator.hasNext()) {
          currentKey = baseIterator.next();
          haveKey = isValidKey(currentKey);
        }
        return haveKey;
      }

      public Map.Entry<X,Y> next() {
        if (!hasNext()) throw new NoSuchElementException();

        haveKey = false;
        return new LazyPair<X,Y>(currentKey, function);
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

      if (!isValidKey(entry.getKey())) {
        return false;
      }
      if (!function.apply((X)entry.getKey()).equals(entry.getValue())) {
        return false;
      }
    }
    return true;
  }

  /**
   * creates an array of entries from this entry set
   * @return Map.Entry&lt;X,Y>[]
   */
  public Map.Entry<X,Y>[] toArray() {
    return toArray(null);
  }

  /**
   * produces an array of entries from this entry set
   * @param array Map.Entry[] suggested storage for results
   * @return Map.Entry[] resulting array
   */
  public Map.Entry<X,Y>[] toArray(Map.Entry<X,Y>[] array) {
    if (array == null) {
      array = (Map.Entry<X,Y>[])(new Map.Entry[size()]);
    } else if (array.length < size()) {
      array = (Map.Entry<X,Y>[])java.lang.reflect.Array.
           newInstance(array.getClass().getComponentType(), size());
    }
    int i = 0;
    for (Map.Entry<X,Y> entry : this) {
      array[i++] = entry;
    }
    return array;
  }

  protected Set<? extends X> getKeys() {
    return keys;
  }

  protected boolean isValidKey(Object key) {
    return keys.contains(key);
  }
}
