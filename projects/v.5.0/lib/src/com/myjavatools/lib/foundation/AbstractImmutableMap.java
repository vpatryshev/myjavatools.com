package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p></p>
 *
 * <p>Company: My Java Tools</p>
 *
 * @author vlad@myjavatools.com
 * @version 5.0
 */
public abstract class AbstractImmutableMap<Domain,Codomain>
    implements Map<Domain,Codomain> {
  /**
   * Removes all mappings from this map (not implemented).
   */
  public void clear() {
    throw new UnsupportedOperationException();
  }

  /**
   * Returns <tt>true</tt> if this map contains no key-value mappings.
   *
   * @return <tt>true</tt> if this map contains no key-value mappings.
   * @todo Implement this java.util.Map method
   */
  public boolean isEmpty() {
    return size() == 0;
  }

  /**
   * Associates the specified value with the specified key in this map
   * (not implemented).
   *
   * @param key key with which the specified value is to be associated.
   * @param value value to be associated with the specified key.
   * @return previous value associated with specified key, or <tt>null</tt> if
   *   there was no mapping for key. A <tt>null</tt> return can also indicate
   *   that the map previously associated <tt>null</tt> with the specified
   *   key, if the implementation supports <tt>null</tt> values.
   */
  public Codomain put(Domain key, Codomain value) {
    throw new UnsupportedOperationException();
  }

  /**
   * Copies all of the mappings from the specified map to this map (not
   * implemented).
   *
   * @param t Mappings to be stored in this map.
   */
  public void putAll(Map<? extends Domain, ? extends Codomain> t) {
    throw new UnsupportedOperationException();
  }

  /**
   * Removes the mapping for this key from this map if it is present (not
   * implemented).
   *
   * @param key key whose mapping is to be removed from the map.
   * @return previous value associated with specified key, or <tt>null</tt> if
   *   there was no mapping for key.
   */
  public Codomain remove(Object o) {
    throw new UnsupportedOperationException();
  }
}
