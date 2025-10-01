package com.myjavatools.lib.foundation;

import java.util.AbstractCollection;
import java.util.AbstractSet;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.HashMap;

/**
 * <p>AbstractMap2 is a partial implementation of
 * two-parameter map.</p>
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p></p>
 *
 * <p>Company: My Java Tools</p>
 *
 * @author vlad@myjavatools.com
 * @version 6.0 12/10/2006
 */
public abstract class AbstractMap2<X,Y,V> implements Map2<X,Y,V> {

  protected static boolean equal(Object o1, Object o2) {
    return o1 == o2 || o1 != null && o1.equals(o2);
  }

  /**
   *  An entry of a two-parameter map.
   */
  public static class Entry<X,Y,V> implements Map2.Entry<X,Y,V> {
    private X key1;
    private Y key2;
    private V value;

    /**
     * Constructor
     * @param key1 X
     * @param key2 Y
     * @param value V
     */
    public Entry(X key1, Y key2, V value) {
      this.key1  = key1;
      this.key2  = key2;
      this.value = value;
    }

    /**
     * {@inheritDoc}
     */
    public X getKey1() {
      return key1;
    }

    /**
     * {@inheritDoc}
     */
    public Y getKey2() {
      return key2;
    }

    /**
     * {@inheritDoc}
     */
    public V getValue() {
      return value;
    }

    /**
     * {@inheritDoc}
     */
    public V setValue(V value) {
      V old = this.value;
      this.value = value;
      return old;
    }

    public boolean equals(Object other) {
      if (other == null || !(other instanceof Map2.Entry)) {
        return false;
      }
      Map2.Entry<X,Y,V> otherEntry = (Map2.Entry<X,Y,V>) other;
      return equal(key1, otherEntry.getKey1()) &&
             equal(key2, otherEntry.getKey2());
    }

    private int hashCode(Object o) {
      return o == null ? 0 : o.hashCode();
    }

    public int hashCode() {
      return (hashCode(key1) * 79 + hashCode(key2)) * 79 + hashCode(value);
    }

    public String toString() {
      StringBuilder sb = new StringBuilder();
      sb.append("(").
         append(getKey1()).
         append(",").
         append(getKey2()).
         append(")->").
         append(getValue());
      return sb.toString();
    }
  }

  /**
   * Default constructor
   */
  public AbstractMap2() {
  }

  /**
   * {@inheritDoc}
   */
  public int size() {
    return entrySet().size();
  }

  /**
   * {@inheritDoc}
   */
  public boolean isEmpty() {
    return size() == 0;
  }

  /**
   * {@inheritDoc}
   */
  public boolean containsValue(Object value) {
    for (Map2.Entry e : entrySet()) {
      if (equal(value, e.getValue())) {
        return true;
      }
    }
    return false;
  }

  /**
   * {@inheritDoc}
   *
   * This implementation iterates over <code>entrySet()</code> searching for an
   * entry with the specified keys.  If such an entry is found,
   * <code>true</code> is returned.  If the iteration terminates without
   * finding such an entry, <code>false</code> is returned.  Note that this
   * implementation requires linear time in the size of the map; many
   * implementations will override this method.
   *
   * @param key1 first key
   * @param key2 second key
   * @return <code>true</code> if this map contains a mapping for the specified
   *            pair of keys.
   */
  public boolean containsKeyPair(Object key1, Object key2) {
    for (Map2.Entry e : entrySet()) {
      if (equal(key1, e.getKey1()) &&
          equal(key2, e.getKey2())) {
        return true;
      }
    }
    return false;
  }

  /**
   * {@inheritDoc}
   *
   * This implementation iterates over <code>entrySet()</code> searching for an
   * entry with the specified pair of keys.  If such an entry is found,
   * the entry's value is returned.  If the iteration terminates without
   * finding such an entry, <code>null</code> is returned.  Note that
   * this implementation requires linear time in the size of the map;
   * many implementations will override this method.
   *
   *
   * @param key1 first key
   * @param key2 second key
   * @return the value to which this map maps the specified keys.
   *
   * @see #containsKeyPair(X,Y)
   */
  public V get(X key1, Y key2) {
    for (Map2.Entry<X,Y,V> e : entrySet()) {
      if (equal(key1, e.getKey1()) &&
          equal(key2, e.getKey2())) {
        return e.getValue();
      }
    }
    return null;
  }

  /**
   * {@inheritDoc}
   *
   * This implementation always throws an
   * <code>UnsupportedOperationException</code>.
   */
  public V put(X key1, Y key2, V value) {
    throw new UnsupportedOperationException();
  }

  /**
   * {@inheritDoc}
   *
   * This implementation iterates over <code>entrySet()</code> searching for an
   * entry with the specified pair of keys.  If such an entry is found,
   * its value is obtained with its <code>getValue</code> operation,
   * the entry is removed from the collection of entries with the iterator's
   * <tt>remove</tt> operation, and the saved value is returned.  If the
   * iteration terminates without finding such an entry, <code>null</code> is
   * returned.  Note that this implementation requires linear time in the
   * size of the map; many implementations will override this method.<p>
   */
  public V remove(X key1, Y key2) {
    for (Iterator<Map2.Entry<X,Y,V>> i = entrySet().iterator(); i.hasNext();) {
      Map2.Entry<X,Y,V> e = i.next();
      if (equal(key1, e.getKey1()) &&
          equal(key2, e.getKey2())) {
        i.remove();
        return e.getValue();
      }
    }

    return null;
  }

  /**
   * {@inheritDoc}
   *
   * This implementation iterates over the specified map's
   * <code>entrySet()</code> collection, and calls this map's <code>put</code>
   * operation once for each entry returned by the iteration.<p>
   */
  public void putAll(Map2<? extends X, ? extends Y, ? extends V> source) {
    for (Map2.Entry<? extends X, ? extends Y, ? extends V> e : source.entrySet()) {
      put(e.getKey1(), e.getKey2(), e.getValue());
    }
  }

  /**
   * {@inheritDoc}
   *
   * This implementation calls <tt>entrySet().clear()</tt>.
   */
  public void clear() {
      entrySet().clear();
  }

  public abstract Set<X> keySet1();

  public abstract Set<Y> keySet2();

  transient volatile Collection<V> values = null;

  /**
   * {@inheritDoc}
   *
   * This implementation returns a collection  and is based
   * on the map's entrySet.
   */
  public Collection<V> values() {
    if (values == null) {
        values = new AbstractCollection<V>() {
          public Iterator<V> iterator() {
            return new Iterator<V>() {
              private Iterator<Map2.Entry<X,Y,V>> i = entrySet().iterator();

              public boolean hasNext() {
                return i.hasNext();
              }

              public V next() {
                return i.next().getValue();
              }

              public void remove() {
                i.remove();
              }
            };
          }

          public int size() {
            return AbstractMap2.this.size();
          }

          public boolean contains(Object v) {
            return AbstractMap2.this.containsValue(v);
          }
        };
    }
    return values;
  }

  /**
   * {@inheritDoc}
   *
   * This implementation builds the map on every call. Better implementations
   * are available if entries are indexed.
   */
  public Map<Y,V> curry1(X key1) {
    Map<Y,V> result = new HashMap<Y,V>();
    for (Map2.Entry<X,Y,V> e : entrySet()) {
      if (e.getKey1().equals(key1)) {
        result.put(e.getKey2(), e.getValue());
      }
    }
    return result;
  }

  /**
   * {@inheritDoc}
   *
   * This implementation builds the map on every call. Better implementations
   * are available if entries are indexed.
   */
  public Map<X,V> curry2(Y key2) {
    Map<X,V> result = new HashMap<X,V>();
    for (Map2.Entry<X,Y,V> e : entrySet()) {
      if (e.getKey2().equals(key2)) {
        result.put(e.getKey1(), e.getValue());
      }
    }
    return result;
  }

  /**
   * {@inheritDoc}
   */
  public abstract Set<Map2.Entry<X,Y,V>> entrySet();

  /**
   * Compares the specified object with this map for equality.  Returns
   * <code>true</code> if the given object is also a map2 and the two maps
   * represent the same mappings.
   *
   * @param o object to be compared for equality with this map.
   * @return <code>true</code> if the specified object is equal to this map.
   */
  public boolean equals(Object o) {
    if (o == this) {
      return true;
    }

    if (o == null || !(o instanceof Map2)) {
      return false;
    }
    return entrySet().equals(((Map2)o).entrySet());
  }

  /**
   * @return the hash code value for this map.
   */
  public int hashCode() {
    return entrySet().hashCode();
  }

  /**
   * @return a String representation of this map.
   */
  public String toString() {
    StringBuilder sb = new StringBuilder("{");
    for (Map2.Entry<X,Y,V> e : entrySet()) {
      if (sb.length() > 1) {
        sb.append(", ");
      }
      sb.append("(").
         append(e.getKey1()).
         append(",").
         append(e.getKey2()).
         append(")->").
         append(e.getValue());
    }

    sb.append("}");
    return sb.toString();
  }
}
