package com.myjavatools.lib.foundation;

import java.util.Collection;
import java.util.Set;
import java.util.Map;

/**
 * <p>Map2 is an interface that represents a two-parameter map.</p>
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p></p>
 *
 * <p>Company: My Java Tools</p>
 *
 * @author vlad@myjavatools.com
 * @version 6.0 12/10/2006
 */
public interface Map2<X,Y,V> {
  /**
   * @return the number of key-value mappings in this map.
   */
  int size();

  /**
   * @return <code>true</code> if this map contains no key-value mappings.
   */
  boolean isEmpty();

  /**
   * Returns <code>true</code> if this map contains a mapping for the
   * specified key pair.
   *
   * @param key1 first key.
   * @param key2 second key.
   * @return <code>true</codet> if this map contains a mapping for this
   * key pair.
   */
  boolean containsKeyPair(Object key1, Object key2);

  /**
   * Returns the value to which this map maps the specified key pair, and
   * <code>null</code> if the map contains no mapping for these keys.
   *
   * @param key1 first key.
   * @param key2 second key.
   * @return the value to which this map maps the specified keys, or
   *	       <code>null</code> if the map contains no mapping for these keys.
   *
   * @throws ClassCastException if the key is of an inappropriate type for
   * 		  this map (optional).
   * @throws NullPointerException if the key is <code>null</code> and this map
   *		  does not permit <tt>null</tt> keys (optional).
   *
   * @see #containsKey(Object)
   */
  V get(X key1, Y key2);

  /**
   * Associates the specified value with the specified key pair.
   * If the map previously contained a mapping for this key pair,
   * the old value is replaced by the specified value.
   *
   * @param key1 first key.
   * @param key2 second key.
   * @param value value to be associated with the specified key pair.
   * @return previous value associated with specified key,
   *         or <code>null</code> if there was no mapping for key.
   */
  V put(X key1, Y key2, V value);

  /**
   * Removes the mapping for this key pair from this map if it is present.
   *
   * <p>Returns the value to which the map previously associated the keys, or
   * <tt>null</tt> if the map contained no mapping for this key pair.
   *
   * @param key1 first key.
   * @param key2 second key.
   * @return previous value, or <tt>null</tt>
   *	       if there was no mapping for key.
   */
  V remove(X key1, Y key2);

  /**
   * Copies all of the mappings from the specified map to this map.
   *
   * @param source Mappings to be stored in this map.
   */
  void putAll(Map2<? extends X, ? extends Y, ? extends V> t);

  /**
   * Removes all mappings from this map.
   */
  void clear();

  /**
   * A Map2 has two sets of keys, first component and second component.
   * This method returns an unmodifiable set view of the set of keys of the
   * first component. The set is backed by the map, so changes to the map
   * are reflected in the set. If the map is modified while an iteration over
   * the set is in progress, the results of the iteration are undefined.
   *
   * @return an unmodifiable set view of the keys contained in this map.
   */
  Set<X> keySet1();

  /**
   * A Map2 has two sets of keys, first component and second component.
   * This method returns an unmodifiable set view of the set of keys of the
   * second component. The set is backed by the map, so changes to the map
   * are reflected in the set. If the map is modified while an iteration over
   * the set is in progress, the results of the iteration are undefined.
   *
   * @return an unmodifiable set view of the keys contained in this map.
   */
  Set<Y> keySet2();

  /**
   * Returns a collection view of the values contained in this map.  The
   * collection is backed by the map, so changes to the map are reflected in
   * the collection.  If the map is modified while an
   * iteration over the collection is in progress, the results of the
   * iteration are undefined.
   *
   * @return a collection view of the values contained in this map.
   */
  Collection<V> values();

  /**
   * Currying by first argument. Produces a map that for each Y key2 returns
   * the same value as get(key1, key2) would return. If key1 is not present in
   * the set of keys, an empty map is returned.
   * @param key1 X
   * @return Map<Y,V> resulting map.
   */
  Map<Y,V> curry1(X key1);

  /**
   * Currying by second argument. Produces a map that for each X key1 returns
   * the same value as get(key1, key2) would return. If key2 is not present in
   * the set of keys, an empty map is returned.
   * @param key2 X
   * @return Map<X,V> resulting map.
   */
  Map<X,V> curry2(Y key2);

  /**
   * A map entry (key1-key2-value pair).  The <code>Map.entrySet</code> method
   * returns a collection view of the map, whose elements are of this class.
   * You can use an iterator or a loop to scan through the entries.
   *
   * @see Map2#entrySet()
   */
  interface Entry<X,Y,V> {
    /**
     * @return first key of the entry
     */
    public X getKey1();

    /**
     * @return second key of the entry
     */
    public Y getKey2();

    /**
     * @return entry value
     */
    public V getValue();

    /**
     * Replaces the value corresponding to this entry with the specified
     * value
     *
     * @param value new value to be stored in this entry.
     * @return old value corresponding to the entry.
     */
    V setValue(V value);
  }

  /**
   * Returns a set view of the mappings contained in this map.  Each element
   * in the returned set is a {@link Map2.Entry}.  The set is backed by the
   * map, so changes to the map are reflected in the set, and vice-versa.
   *
   * @return a set view of the mappings contained in this map.
   */
  Set<Map2.Entry<X,Y,V>> entrySet();
}
