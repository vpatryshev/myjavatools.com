package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * <p>IndexedMap2 is an abstract class that implements a
 * two-parameter map with indexes for both parameters.</p>
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p></p>
 *
 * <p>Company: My Java Tools</p>
 *
 * @author vlad@myjavatools.com
 * @version 6.0 12/10/2006
 */
public abstract class IndexedMap2<X,Y,V> extends AbstractMap2<X,Y,V> {
  Map<X,Map<Y,Entry<X,Y,V>>> index1 = new HashMap<X,Map<Y,Entry<X,Y,V>>>();
  Map<Y,Map<X,Entry<X,Y,V>>> index2 = new HashMap<Y,Map<X,Entry<X,Y,V>>>();

  /**
   * Default constructor.
   */
  public IndexedMap2() {
    super();
  }

  protected Entry<X,Y,V> getEntry(Object key1, Object key2) {
    Map<Y,Entry<X,Y,V>> m = index1.get(key1);
    return m == null ? null : m.get(key2);
  }

  protected Map<Y,Entry<X,Y,V>> ensureSlot1(X key1) {
    Map<Y,Entry<X,Y,V>> m = index1.get(key1);
    if (m == null) {
      index1.put(key1, m = new HashMap<Y,Entry<X,Y,V>>());
    }
    return m;
  }

  protected Map<X,Entry<X,Y,V>> ensureSlot2(Y key2) {
    Map<X,Entry<X,Y,V>> m = index2.get(key2);
    if (m == null) {
      index2.put(key2, m = new HashMap<X,Entry<X,Y,V>>());
    }
    return m;
  }

  /**
   * {@inheritDoc}
   *
   * This implementation uses two indexes.
   */
  @Override
  public V get(X key1, Y key2) {
    Entry<X,Y,V> entry = getEntry(key1, key2);
    return entry == null ? null : entry.getValue();
  }

  /**
   * {@inheritDoc}
   *
   * This implementation uses and updates two indexes.
   */
  public V put(X key1, Y key2, V value) {
    Map<Y,Entry<X,Y,V>> m = ensureSlot1(key1);
    Entry<X,Y,V> oldEntry = m.get(key2);
    if (oldEntry != null) {
      entrySet().remove(oldEntry);
    }

    Entry<X,Y,V> newEntry = new Entry<X,Y,V>(key1, key2, value);
    entrySet().add(newEntry);
    ensureSlot1(key1).put(key2, newEntry);
    ensureSlot2(key2).put(key1, newEntry);
    return oldEntry == null ? null : oldEntry.getValue();
  }

  /**
   * {@inheritDoc}
   *
   * This implementation returns a Set that subclasses AbstractSet and is based
   * on the map's entrySet.
   */
  public Set<X> keySet1() {
    return index1.keySet();
  }

  /**
   * {@inheritDoc}
   *
   * This implementation returns a Set that subclasses AbstractSet and is based
   * on the map's entrySet.
   */
  public Set<Y> keySet2() {
    return index2.keySet();
  }

  /**
   * {@inheritDoc}
   *
   * This implementation uses index to check for key pair presence.
   *
   * @param key1 first key
   * @param key2 second key
   * @return <code>true</code> if this map contains a mapping for the specified
   *            pair of keys.
   */
  @Override
  public boolean containsKeyPair(Object key1, Object key2) {
    return getEntry(key1, key2) != null;
  }

  /**
   * {@inheritDoc}
   *
   * This implementation uses index to retrieve an entry with the specified
   * pair of keys.
   */
//  @Override
  public V remove(X key1, Y key2) {
    Entry<X,Y,V> entry = getEntry(key1, key2);
    if (entry == null) {
      return null;
    }
    entrySet().remove(entry);
    this.ensureSlot1(key1).remove(key2);
    this.ensureSlot2(key2).remove(key1);
    return entry.getValue();
  }

  private Function<Map2.Entry<X,Y,V>, V> entryToValue =
    new Function<Map2.Entry<X,Y,V>,V>() {
      public V apply(Map2.Entry<X,Y,V> entry) {
        return entry.getValue();
      }
    };

  /**
   * {@inheritDoc}
   *
   * This implementation uses the index to return a <code>Map&lt;Y,V></code>
   * view of <code>Map&lt;Y,Entry&lt;X,Y,Z>> map that is stored in index.
   */
  public Map<Y,V> curry1(X key1) {
    Map<Y,Entry<X,Y,V>> entries = index1.get(key1);
    return entries == null ? Collections.EMPTY_MAP :
        Maps.compose(entries, entryToValue);
  }

  /**
   * {@inheritDoc}
   *
   * This implementation uses the index to return a <code>Map&lt;X,V></code>
   * view of <code>Map&lt;Y,Entry&lt;X,Y,Z>> map that is stored in index.
   */
  public Map<X,V> curry2(Y key2) {
    Map<X,Entry<X,Y,V>> entries = index2.get(key2);
    return entries == null ? Collections.EMPTY_MAP :
        Maps.compose(entries, entryToValue);
  }
}
