package com.myjavatools.lib.foundation;

import java.util.*;
import static com.myjavatools.lib.foundation.Function.*;

/**
 *  <p>Title: My Java Tools Library, foundations, RestrictedMapEntrySet</p>
 *
 * <p>Description: This helper class represents an entry set for a map restricted to a
 * collection of keys; it is used in Maps class.</p>
 *
 * @(#)RestrictedMapEntrySet.java	5.0 01/26/05
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 *
 *
 *
 */
class RestrictedMapEntrySet<X,Y>
    extends RestrictedFunctionEntrySet<X,Y> {
    /**
     * the original map
     */
    private Map<X,Y> map;

    /**
     * Constructor, creates an instance of RestrictedMapEntrySet
     * @param map Map original map
     * @param keys Collection key collection
     */
    public RestrictedMapEntrySet(Map<X,Y> map, Collection<X> keys) {
    super(function(map), keys);
    this.map = map;
  }

  /**
   * calculates the size of restricted map; it takes time, because
   * the algorithm is to scan through all the keys and see if the map
   * is defined on the keys
   */

  public int size() {
    int size = 0;
    for (X key : getKeys()) {
      if (isValidKey(key)) {
        size++;
      }
    }
    return size;
  }

  protected boolean isValidKey(Object key) {
    return map.containsKey(key);
  }
}
