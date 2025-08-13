/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Function.java	6.0 05/04/06
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */
package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * Function is an abstract class that represents the mathematical notion of
 * function: X -> Y. To implement a function, you need to define method apply():
 * Y y = function.apply(X x).
 *
 * @version 6.0 05/04/06
 *
 * @see Filter
 * @see Maps
 * @see java.util.Map
 * @since 5.0
 */

public abstract class Function<X,Y> {

    /**
     * the only method you should implement
     * @param x X the function parameter
     * @return Y the function value at x
     */
    public abstract Y apply(X x);

  /**
   * Restricts this function to a specified Set, returning a map
   * with keys from the set.
   * @param keys Set&lt;X> keys
   * @return Map&lt;X,Y> that maps keys from the set to function values on those
   * keys
   */
  public Map<X,Y> toMap(final Set<? extends X> keys) {
    return new AbstractMap<X,Y>() {
      Set<Map.Entry<X,Y>> entrySet = new RestrictedMapEntrySet<X,Y>(this, keys);

      public Set<Map.Entry<X,Y>> entrySet() {
        return entrySet;
      }

      public boolean containsKey(Object o) {
        return keys.contains(o);
      }

      public Y get(Object key) {
        return containsKey(key) ? Function.this.apply((X)key) : null;
      }
    };
  }

  /**
   * Restricts this function to a specified Collection, returning a map on the
   * set of collection entries
   * @param keys Collection&lt;X> keys
   * @return Map&lt;X,Y> that maps keys from the collection to function values
   * on those keys
   */
  public Map<X,Y> toMap(Collection<? extends X> keys) {
    return toMap(new HashSet<X>(keys));
  }

  /**
   * turns a Map into a Function
   * @param map Map&lt;X,Y> source map
   * @return Function&lt;X,Y> function that returns map.get(x) for each X x
   */
  public static <X,Y> Function<X,Y> forMap(final Map<X,Y> map) {
    return new Function<X,Y>() {
      public Y apply(X x) {
        return map.get(x);
      }
    };
  }

  /**
   * turns a Map into a Function
   * @param map Map&lt;X,Y> source map
   * @return Function&lt;X,Y> function that returns map.get(x) for each X x
   * @deprecated use forMap instead
   */
  public static <X,Y> Function<X,Y> function(Map<X,Y> map) {
    return forMap(map);
  }

  /**
   * Returns a function defied by a map and a default value
   *
   * @param map Map&lt;X,Y>
   * @param defaultValue Y
   * @return Function f such that f(x)=map.get(x) if map.containsKey(x),
   * and defaultValue otherwise.
   */
  public static <X,Y> Function<X,Y>
        forMap(final Map<? super X,Y> map, final Y defaultValue) {
     return new Function<X,Y>() {
       public Y apply(X x) {
         return map.containsKey(x) ? map.get(x) : defaultValue;
       }
     };
  }

  /**
   * Returns a function defied by a map and a default value
   *
   * @param map Map&lt;X,Y>
   * @param defaultValue Y
   * @return Function f such that f(x)=map.get(x) if map.containsKey(x),
   * and defaultValue otherwise.
   * @deprecated use forMap instead.
   */
  public static <X,Y> Function<X,Y> function(Map<? super X,Y> map, Y defaultValue) {
     return forMap(map, defaultValue);
  }

  /**
   * applies Function to a List
   * @param domain List
   * @return List
   */
  public List<Y> apply(final List<? extends X> domain) {
    return new AbstractList<Y>() {

      /**
       * Returns <tt>true</tt> if the function maps one or more keys from domain
       * to the specified value.
       *
       * @param value value whose presence in this map is to be tested.
       * @return <tt>true</tt> if the function's value on one or more keys is the specified
       *   value.
       * Note that this method is extremely inefficient - as probably any implementation
       * of contains() on an unstructured, non-indexed collection.
       */
      public boolean contains(Object value) {
        for (X x : domain) {
          Y y = Function.this.apply(x);
          if (Objects.equal(y, value)) {
            return true;
          }
        }
        return false;
      }

      /**
       * @return the number of elements in this collection.
       */
      public int size() {
        return domain.size();
      }

      /**
       * @return an Iterator that scans over the values of function on domain
       */
      public Iterator<Y> iterator() {
        return Function.this.apply(domain.iterator());
      }

      /**
       * Returns the element at the specified position in this list.
       *
       * @param index index of element to return.
       * @return the element at the specified position in this list.
       *
       * @throws IndexOutOfBoundsException if the index is out of range (index
       * 		  &lt; 0 || index &gt;= size()).
       */
      public Y get(int index) {
        return Function.this.apply(domain.get(index));
      }
    };
  }

 /**
   * applies Function to an Iterator
   * @param iterator Iterator
   * @return Iterator that lists values of function applied to elements returned
   * by the original iterator
   *
   * <p><b>Example</b>:
   * <pre><code>new Function&lt;String, Integer>() {
   *               Integer apply(String s) { return s.length(); } }.
   *                apply(
   *                Arrays.asList(new String[] {"One", "Two", "Three"}).iterator());</code></pre>
   * returns an iterator returning 3, 3, 5.</p>
   */
  public Iterator<Y> apply(final Iterator<? extends X> iterator) {
    return new Iterator<Y>() {
      public boolean hasNext() {
        return iterator.hasNext();
      }

      public Y next() {
        return Function.this.apply(iterator.next());
      }

      public void remove() {
        iterator.remove();
      }
    };
  }

  /**
   * applies Function to an Iterable
   * @param iterable Iterable
   * @return Iterable that contains values of function applied to elements
   * of the original iterable
   */
  public Iterable<Y> apply(final Iterable<? extends X> iterable) {
    return new Iterable<Y>() {
      public Iterator<Y> iterator() {
        return Function.this.apply(iterable.iterator());
      }
    };
  }

  /**
   * Returns a composition f.g : W->Y of two functions,
   * g:W->X and f(which is this Function): X->Y.
   * Compostion is defined as a function h such that
   * h(x) = f(g(x)) for each w.
   *
   * @param g Function&lt;W,X>
   * @return Function&lt;W,Y> composition of g and f
   */
  public <W> Function<W,Y> compose(Function<W,? extends X> g) {
    return compose(g, this);
  }
  /**
   * Returns a compostion f.g : X->Z of two functions, f: X->Y and g: Y->Z.
   * Compostion is defined as a function h such that
   * h(x) = g(f(x)) for each x.
   *
   * @param f Function&lt;X,Y>
   * @param g Function&lt;Y,Z>
   * @return Function&lt;X,Z> composition of f and g
   */
  public static <X,Y,Z> Function<X,Z> compose(final Function<X,? extends Y> f,
                                              final Function<? super Y,? extends Z> g) {
    return new Function<X,Z> () {
      public Z apply(X x) {
        return g.apply(f.apply(x));
      }
    };
  }

  public static <X> Function<X,X> id() {
    return new Function<X,X>() {
      public X apply(X x) {
        return x;
      }
    };
  }
}
