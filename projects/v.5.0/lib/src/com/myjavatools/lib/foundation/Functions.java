/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Functions.java	5.0 11/20/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.Map;

/**
 * Functions is a utility class that contains static methods for functions
 *
 * @version 5.0, 11/24/04
 * @see java.util.Map
 * @see Function
 * @since 5.0
 */
public abstract class Functions {

    /**
     * Returns a compostion f.g : X->Z of two functions, f: X->Y and g: Y->Z.
     * Compostion is defined as a function h such that
     * h(x) = g(f(x)) for each x.
     *
     * @param f Function&lt;X,Y>
     * @param g Function&lt;Y,Z>
     * @return Function&lt;X,Z> composition of f and g
     */
    public static <X,Y,Z> Function<X,Z> compose(final Function<X,Y> f,
    final Function<Y,Z> g) {
    return new Function<X,Z>() {
        public Z apply(X x) {
          return g.apply(f.apply(x));
        }
    };
  }

  /**
   * Returns a function defined by a Map
   *
   * @param map Map&lt;X,Y>
   * @return Function&lt;X,Y> f such that f(x) = map.get(x)
   */
  public static <X,Y> Function<X,Y>
  function(final Map<X,Y> map) {
     return new Function<X,Y>() {
       public Y apply(X x) {
         return map.get(x);
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
   */
  public static <X,Y> Function<X,Y>
      function(final Map<X,Y> map,
               final Y defaultValue) {
     return new Function<X,Y>() {
       public Y apply(X x) {
         return map.containsKey(x) ? map.get(x) : defaultValue;
       }
     };
  }
}
