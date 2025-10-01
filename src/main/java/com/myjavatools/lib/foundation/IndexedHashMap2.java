package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * <p>IndexedHashMap2 is an class that implements a
 * two-parameter map with indexes for both parameters; entries are stored
 * in a HashMap.</p>
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p></p>
 *
 * <p>Company: My Java Tools</p>
 *
 * @author vlad@myjavatools.com
 * @version 6.0 12/10/2006
 */
public class IndexedHashMap2<X,Y,V>
    extends IndexedMap2<X,Y,V> {
  Set<Map2.Entry<X,Y,V>> entrySet = new HashSet<Map2.Entry<X,Y,V>>();

  /**
   * {@inheritDoc}
   *
   * This implementation uses HashSet for storing entries.
   */
  public Set<Map2.Entry<X,Y,V>> entrySet() {
    return entrySet;
  }
}
