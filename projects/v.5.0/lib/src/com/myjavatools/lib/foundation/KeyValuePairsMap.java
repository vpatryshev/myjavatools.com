/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)KeyValuePairsMap.java	5.0 01/30/05
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */
package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * KeyValuePairsMap is a helper class that implements Map which is based on a key/value array
 *
 * Note that this class does not take any additional memory; lazy evaluation uses
 * only the array provided. It is very inefficient; to improve
 * performance, you will have to create a copy of the Map using
 * a concrete Map implementation from Collections framework.
 *
 * Another important caveat. It takes a vararg array of Map.Entry instances.
 * It is up to the user to make sure that keys in the entries are all distinct -
 * consider this as a contract that must be stipulated, or else. What else?
 * First, it won't be a map in its regular sense. Second, size() will
 * return the number of entries, not the number of distinct entries.
 * But you can always <code>addAll()</code> this instance to a new Map,
 * and in that other Map all duplications will disappear.
 *
 * @version 5.0, 01/30/05
 *
 * @see Maps
 * @see java.util.Map
 * @since 5.0
 */

public class KeyValuePairsMap<X,Y>
     extends AbstractMap<X,Y> {
  private final List<Map.Entry<X,Y>> pairs;

  /**
   * constructor
   * @param pairs Map.Entry&lt;X,Y>... even elements contains keys, odd elements contain values
   */
  public KeyValuePairsMap(Map.Entry<X,Y>... pairs) {
    this.pairs = Arrays.asList(pairs);
  }

  private static boolean equal(Object o1, Object o2) {
    return o1 == null ? o2 == null : o1.equals(o2);
  }

  /**
   * Returns <tt>true</tt> if this map contains a mapping for the specified key.
   *
   * @param x key whose presence in this map is to be tested.
   * @return <tt>true</tt> if this map contains a mapping for the specified
   *   key.
   */
  public boolean containsKey(Object x) {
    for (Map.Entry<X,Y> pair : pairs) {
      if (equal(pair.getKey(), x)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns a set view of the mappings contained in this map.
   *
   * @return a set view of the mappings contained in this map.
   *
   * Implementation note. Actually no large object is created;
   * the returned set is a lazy evaluation implementation of Set.
   */
  public Set<Map.Entry<X,Y>> entrySet() {
    return new AbstractSet<Map.Entry<X,Y>>() {

      public boolean contains(Object o) {
        return pairs.indexOf(o) >= 0;
      }

      public int size() {
        return pairs.size();
      }

      public Iterator<Map.Entry<X,Y>> iterator() {
        return new Iterator<Map.Entry<X,Y>>() {
          Iterator<Map.Entry<X,Y>> iterator = pairs.iterator();

          public Map.Entry<X,Y> next() {
            return iterator.next();
          }

          public boolean hasNext() {
            return iterator.hasNext();
          }

          public void remove() {
            iterator.remove();
          }
        };
      }
    };
  }
}
