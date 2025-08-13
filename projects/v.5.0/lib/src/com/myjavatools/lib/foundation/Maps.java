/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Maps.java	5.0 11/15/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

/**
 * Maps is a utility class that contains static methods for maps
 *
 * @version 5.0, 11/24/04
 * @see java.util.Map
 * @see Function
 * @since 5.0
 */

import java.util.*;
import static com.myjavatools.lib.foundation.Function.*;

public abstract class Maps {

    /**
     * composes two Maps (like functions, see Functions#compose)
     *
     * @param f Map&lt;X,Y> first Map
     * @param g Map&lt;Y,Z> second Map
     * @return Map&lt;X,Z> composition, x -> g(f(x));
     *
     * <br><br><b>Example</b>:
     * <p>Suppose we have the following: <br>
     * <code>Map&lt;Integer,String> f = toMap(new Object[] {1, "one", 2, "two", 3, "three"});<br>
     *       Map&lt;String,String> g = toMap(new String[] {"one", "uno", "two", "dos", "three", "tres"});</code>
     * <p>Then <code>compose(f, g)</code><br>
     * returns the same map as produced by <br>
     * <code>toMap(new Object[] {1, "uno", 2, "dos", 3, "tres"});</code><br>
     */
    public static <X,Y,Z> Map<X,Z> compose(Map<X,Y> f, Map<Y,Z> g) {
    return Function.compose(function(f), function(g)).toMap(f.keySet());
  }

  /**
   * finds all map keys that map to a specified value
   * @param f Map&lt;X,Y>
   * @param y Y - the key
   * @return Set&lt;X> - all X x such that y.equals(f(x)).
   */
  public static <X,Y> Set<X> resolve(Map<X,Y> f, Y y) {
  Set<X> result = new LinkedHashSet<X>();
    for (Map.Entry<X,Y> entry : f.entrySet()) {
      if (y.equals(entry.getValue())) {
        result.add(entry.getKey());
      }
    }
    return result;
  }

  /**
   * reverts a Map f, producing a new one that maps values of f to sets of keys
   * of f
   * @param f Map&lt;X,Y> original map
   * @return Map&lt;Y,Set&lt;X>> resulting map: for each y it returns {x | y.equals(f(x))}
   *
   * This method skips any null keys and values.
   *
   * <br><br><b>Example</b>:
   * <p>Suppose we have the following: <br>
   * <code>Map&lt;String,String> f = toMap(new String[] {"1", "odd", "2", "even", "3", "odd"});<br>
   * <p>Then <code>revert(f)</code><br>
   * returns the same map as produced by <br>
   * <code>Map&lt;String,Collection&lt;String>> g = new Map&lt;String,Collection&lt;String>>;
   * g.put("even", new HashSet(Arrays.asList("2")));
   * g.put("odd", new HashSet(Arrays.asList("1", "3")));
   * </code><br>
   *
   */
  public static <X,Y> Map<Y,Set<X>> revert(Map<X,Y> f) {
    Map<Y,Set<X>> result = new LinkedHashMap<Y,Set<X>>();

    for (Map.Entry<X,Y> entry : f.entrySet()) {
      X x = entry.getKey();
      Y y = entry.getValue();
      Set<X> s = result.get(y);
      if (s == null) {
        result.put(y, s = new LinkedHashSet<X> ());
      }
      s.add(x);
    }
    return result;
  }

  /**
   * Inverses a Map
   *
   * @param f Map&lt;X,Y> to inverse, must be monomorphic (one-to-one)
   * @throws InstantiationException in case f is not one-to-one
   * @return Map&lt;Y,X> inverse to f
   *
   * <br><br><b>Example</b>:
   * <p>Suppose we have the following: <br>
   * <code>Map f = toMap(new String[] {"1", "one", "2", "two", "3", "three"});<br>
   * <p>Then <code>inverse(f)</code><br>
   * returns the same map as produced by <br>
   * <code>toMap(new String[] {"one", "1", "two", "2", "three", "3"});</code><br>
   */

  public static <X, Y> Map<Y,X> inverse(Map<X,Y> f) throws InstantiationException {
    Map<Y,X> result = new LinkedHashMap<Y,X>(f.size());

    for (Map.Entry<X,Y> entry : f.entrySet()) {
      if (result.containsKey(entry.getValue())) {
        throw new InstantiationException("non-invertible map");
      }
      result.put(entry.getValue(), entry.getKey());
    }

    return result;
  }

  /**
   * Maps a List using Map.
   * If Map m is considered as a map from its keys to its values, then
   * for each x in domain m(x) is calculated and stored into resulting List
   *
   * @param m Map&lt;X,Y> the map
   * @param domain List&lt;X> the domain list
   * @return list List&lt;Y> with the same number of elements as domain, and with elements
   * being values that correspond to the map's keys.
   *
   * <br><br><b>Example</b>:
   * <p>Suppose we have the following: <code>Map m = new HashMap();<br>
   * m.put("a", "ValueOfA"); m.put("b", "ValueOfB"); m.put("c", "ValueOfC");</code>
   * <p>Then <code>map(m, Arrays.asList(new String[] {"b", "x", "b"}))</code>
   * returns a List that contains "ValueOfB", null, and "ValueOfB".
   */
  public static final <X, Y> List<Y> map(Map<X,Y> m, List<X> domain) {
    return function(m).apply(domain);
  }

  /**
   * Restricts a Map to a Collection
   *
   * Resulting Map is a virtual map that has an intersection of
   * map's keyset and keys as a keyset, and maps them to the
   * same values as the original map does.
   *
   * @param map Map
   * @param keys Collection
   * @return Map
   */
  public static final <X,Y> Map<X,Y> restrict(final Map<X,Y> map,
                                            final Collection<X> keys) {
    return new AbstractMap<X,Y>() {
      public Set<Map.Entry<X,Y>> entrySet() {
        return new RestrictedMapEntrySet<X,Y>(map, keys);
      }
    };
  }

  /**
   * Maps a Collection using Map.
   * If Map m is considered as a map from its keys to its values, then
   * for each x in domain m(x) is calculated and stored into resulting List
   *
   * @param m Map&lt;X,Y> the map
   * @param domain Colection&lt;X> the domain list
   * @return Collection&lt;Y> collection consisting of the values of the map corresponding to the keys
   * from domain.
   *
   * <br><br><b>Example</b>:
   * <p>Suppose we have the following: <code>Map&lt;String,String> m = new HashMap&lt;String,String>();<br>
   * m.put("a", "ValueOfA"); m.put("b", "ValueOfB"); m.put("c", "ValueOfC");</code>
   * <p>Then <code>map(m, Arrays.asList(new String[] {"b", "x", "b"}))</code>
   * returns a Collection that contains just "ValueOfB".
   */
  public static final <X, Y>
      Collection<Y> map(Map<X,Y> m, Collection<X> domain) {
    return restrict(m, domain).values();
  }

  /**
   * Maps an Iterator using Map.
   * If Map m is considered as a map from its keys to its values, then
   * the iterator that map returns is the one that,
   * for each x in iterator, returns m(x) is returned by next() call.
   *
   * @param m Map&lt;X,Y> the map
   * @param iterator Iterator&lt;X> the domain iterator
   * @return Iterator&lt;Y> iterator with the same number of elements as domain, and with elements
   * being values that correspond to the map's keys.
   *
   * <br><br><b>Example</b>:
   * <p>Suppose we have the following: <code>Map&lt;String,String> m = new HashMap&lt;String,String>();<br>
   * m.put("a", "ValueOfA"); m.put("b", "ValueOfB"); m.put("c", "ValueOfC");</code>
   * <p>Then <code>map(m, Arrays.asList(new String[] {"b", "x", "b"}).iterator())</code>
   * returns an Iterator that consequently returns "ValueOfB", null, and "ValueOfB".
   */
  public static final <X, Y> Iterator<Y> map(final Map<X,Y> m, final Iterator<X> iterator) {
    return function(m).apply(iterator);
  }

  /**
   * Maps an Iterable using Map.
   * If Map m is considered as a map from its keys to its values, then
   * the iterable that map returns is the one with the iterator that
   * returns m.get(x) is returned by next() call for each x returned by
   * next() of the iterator of the original Iterable.
   *
   * @param m Map&lt;X,Y> the map
   * @param iterable Iterable&lt;X> the domain iterator
   * @return Iterable&lt;Y> iterable with the same number of elements as domain, and with elements
   * being values that correspond to the map's keys.
   *
   * <br><br><b>Example</b>:
   * <p>Suppose we have the following: <code>Map&lt;String,String> m = new HashMap&lt;String,String>();<br>
   * m.put("a", "ValueOfA"); m.put("b", "ValueOfB"); m.put("c", "ValueOfC");</code>
   * <p>Then <code>map(m, Arrays.asList(new String[] {"b", "x", "b"}))</code>
   * returns an Iterable that contains "ValueOfB", null, and "ValueOfB".
   */
  public static final <X, Y> Iterable<Y> map(final Map<X,Y> m, final Iterable<X> iterable) {
    return function(m).apply(iterable);
  }

  /**
   * makes a singleton Map&lt;X,Y> from a key-value pair
   *
   * @param key X
   * @param value Y
   * @return Map&lt;X,Y> that has just one key and its value
   *
   * <br><br><b>Example</b>:
   * <li><code>toMap("the key", "This is the value").get("the key");</code>
   * returns "This is the value";</li>
   *
   */
  public static <X,Y> Map<X,Y> toMap(X key, Y value) {
    return new KeyValueArrayMap<X,Y>(key, value);
  }

  /**
   * makes a Map&lt;X,Y> from two key-value pairs
   *
   * @param key1 X first key
   * @param value1 Y first value
   * @param key2 X second key
   * @param value2 Y second value
   * @return Map&lt;X,Y> that has these two keys and values
   *
   * <br><br><b>Example</b>:
   * <li><code>toMap(2, "kaksi", 3, "kolmi").get(3);</code>
   * returns "kolmi";</li>
   */
  public static <X, Y> Map<X, Y> toMap(X key1, Y value1,
                                       X key2, Y value2) {
    return new KeyValueArrayMap<X,Y>(key1, value1, key2, value2);
  }

  /**
   * makes a Map&lt;X,Y> from three key-value pairs
   *
   * @param key1 X first key
   * @param value1 Y first value
   * @param key2 X second key
   * @param value2 Y second value
   * @param key3 X third key
   * @param value3 Y third value
   * @return Map&lt;X,Y> the map that contains these three keys and values
   *
   * <br><br><b>Example</b>:
   * <li><code>toMap("1", "un", "2", "deux", "3", "troix").get("2");</code>
   * returns "deux";</li>
   */
  public static <X, Y> Map<X, Y> toMap(X key1, Y value1,
                                       X key2, Y value2,
                                       X key3, Y value3) {
    return new KeyValueArrayMap<X,Y>(key1, value1, key2, value2, key3, value3);
  }

  /**
   * makes a Map from key-value pairs
   *
   * @param pairs Pair&lt;X,Y>[] the array of key-value pairs
   * @return Map the map that maps left pair elements from <code>pairs</code> array to right elements;
   * if pairs is null, returns null
   *
   * <br><br><b>Example</b>:
   * <li><code>toMap(new Pair&lt;Integer, String>[] {
   *                   new Pair&lt;Integer, String>(1, "un"),
   *                   new Pair&lt;Integer, String>(2, "deux"),
   *                   new Pair&lt;Integer, String>(3, "troix")}).get(2);</code>
   * returns "deux";</li>
   */
  public static <X, Y>
             Map<X, Y> toMap(Map.Entry<X,Y>... pairs) {
    return new KeyValuePairsMap<X,Y>(pairs);
  }

  /**
   * makes a Map from a vararg of key-value pairs
   *
   * @param pairs Object... odd elements of the array are keys, and even elements are values
   * @return Map the map that maps odd elements from <code>pairs</code> array to even elements;
   * if pairs is null, returns null
   *
   * <br><br><b>Example</b>:
   * <li><code>toMap(new Integer(1), "un", new Integer(2), "deux", new Integer(3), "troix"}).get(2);</code>
   * returns "deux";</li>
   *
   * not recommended (but not deprecated) since 5.0 - use map(Pair&lt;S,T>[] pairs) instead
   */
  public static <X, Y>
             Map<X, Y> toMap(Object... pairs) {
      return new KeyValueArrayMap<X,Y>(pairs);
  }

  /**
   * makes a Map from an array key-value pairs
   *
   * @param nameValuePairs Object[] odd elements of the array are keys, and even elements are values
   * @return Map&lt;X,Y> the map that maps odd elements from <code>pairs</code> array to even elements;
   * if pairs is null, returns null
   *
   * <br><br><b>Example</b>:
   * <li><code>arrayToMap(new Object[] {1, "un", 2, "deux", 3, "troix"}).get(2);</code>
   * returns "deux";</li>
   *
   * not recommended (but not deprecated) since 5.0 - use map(Pair&lt;S,T>[] pairs) instead
   */
  public static <X, Y> Map<X, Y> arrayToMap(Object[] nameValuePairs) {
    if (nameValuePairs == null) return null;
    return new KeyValueArrayMap<X,Y>(nameValuePairs);
  }
}
