/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)KeyValueArrayMap.java	5.0 01/30/05
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */
package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * KeyValueArrayMap is a helper class that implements Map which is based on a key/value array
 *
 * Note that this class does not take any additional memory; lazy evaluation uses
 * only the array provided. It is very inefficient; to improve
 * performance, you will have to create a copy of the Map using
 * a concrete Map implementation from Collections framework.
 *
 * @version 5.0, 01/30/05
 *
 * @see Maps
 * @see java.util.Map
 * @since 5.0
 */

public class KeyValueArrayMap<X,Y>
     extends AbstractMap<X,Y> {
  private Object[] keyValueArray;

  /**
   * constructor
   * @param array Object... even elements contains keys, odd elements contain values
   */
  public KeyValueArrayMap(Object... array) {
    this.keyValueArray = array;
  }

  private static boolean equal(Object o1, Object o2) {
    return o1 == null ? o2 == null : o1.equals(o2);
  }

  private int indexOf(Object x) {
    for (int i = 0; i < keyValueArray.length; i+=2) {
      if (equal(keyValueArray[i], x)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Returns <tt>true</tt> if this map contains a mapping for the specified key.
   *
   * @param x key whose presence in this map is to be tested.
   * @return <tt>true</tt> if this map contains a mapping for the specified
   *   key.
   */
  public boolean containsKey(Object x) {
    return indexOf(x) >= 0;
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
        if (o == null) return false;
        if (!(o instanceof Map.Entry)) return false;
        Map.Entry entry = (Map.Entry)o;
        int index = indexOf(entry.getKey());
        if (index < 0) {
          return false;
        }

        return equal(entry.getValue(), keyValueArray[index+1]);
      }

      public int size() {
        return keyValueArray.length / 2;
      }

      public Iterator<Map.Entry<X,Y>> iterator() {
        return new Iterator<Map.Entry<X,Y>>() {
          int index = 0;

          public Map.Entry<X,Y> next() {
            try {
              return new Pair<X, Y> ( (X) keyValueArray[index],
                                                 (Y) keyValueArray[index +
                                                 1]);
            } finally {
              index += 2;
            }
          }

          public boolean hasNext() {
            return index < keyValueArray.length - 1;
          }

          public void remove() {
            throw new UnsupportedOperationException();
          }
        };
      }
    };
  }
}
