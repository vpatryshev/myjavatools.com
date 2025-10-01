/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Function.java	6.0 12/04/06
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */
package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * Function2 is an abstract class that represents the mathematical notion of
 * two-parameter function: X x Y -> Z. To implement a function, you need to define method apply():
 * Z z = function.apply(X x, Y y).
 *
 * @version 6.0 12/06/06
 *
 * @see Filter
 * @see Maps
 * @see Function
 * @since 6.0
 */

public abstract class Function2<X,Y,Z> {

  /**
   * the only method you should implement
   * @param x X the function parameter
   * @param y Y the function parameter
   * @return Z the function value at (x,y)
   */
  public abstract Z apply(X x, Y y);

  /**
   * First component projection.
   * @return Function2 that returns its first parameter
   */
  public static <X,Y> Function2<X,Y,X> p1() {
    return new Function2<X,Y,X>() {
      public X apply(X x, Y y) {
        return x;
      }
    };
  }

  /**
   * Second component projection.
   * @return Function2 that returns its second parameter
   */
  public static <X,Y> Function2<X,Y,Y> p2() {
    return new Function2<X,Y,Y>() {
      public Y apply(X x, Y y) {
        return y;
      }
    };
  }

  /**
   * Converts a two-parameter function to a function on pairs, (X x, Y y).
   * @return Function that takes a pair (actually, a Map.Entry, which is
   * a popular interface that represents pairs of objects) and returns the value
   * of the original function on the components of the pair.
   *
   * That is, for f: X x Y -> Z, the resulting function, when applied to (x,y),
   * will return f(x,y).
   */
  public Function<Map.Entry<X,Y>,Z> toFunction() {
    return new Function<Map.Entry<X,Y>,Z>() {
      public Z apply(Map.Entry<X,Y> pair) {
        return Function2.this.apply(pair.getKey(), pair.getValue());
      }
    };
  }

  /**
   * Creates a two-parameter function for a function defined on pairs.
   *
   * @param f Function that takes Map.Entry as an argument and returns
   * an instance of Z
   * @return Function2 defined on X x Y, such that for X x and Y y it returns
   * f((x,y)).
   */
  public static <X,Y,Z>
      Function2<X,Y,Z> forFunction(final Function<Map.Entry<X,Y>,Z> f) {
    return new Function2<X,Y,Z>() {
      public Z apply(X x, Y y) {
        return f.apply(new Pair<X,Y>(x,y));
      }
    };
  }

  /**
   * Creates a two-parameter function for a "cascade map".
   *
   * @param map &lt;X,Map&lt;Y,Z>>Map
   * @param defaultValue Z default function value for parameters that are not
   * contained as keys in Map
   * @return Function2 defined on <code>X x Y</code> and taking values in
   * <code>Z</code>. For a map <code>m</code>, an <code>X x</code>, and
   * a <code>Y y</code>, the value of the function is calculated like this:
   * <code>m.get(x).get(y)</code>. If any of these get() returns <code>null</code>,
   * the function returns <code>defaultValue</code>.
   */
  public static <X,Y,Z>
      Function2<X,Y,Z> forMap(final Map<X,Map<Y,Z>> map,
                              final Z defaultValue) {
    return new Function2<X,Y,Z>() {
      public Z apply(X x, Y y) {
        Map<? super Y,Z> curry = map.get(x);
        return curry == null || !curry.containsKey(y) ? defaultValue :
               curry.get(y);
      }
    };
  }

  /**
   * Creates a two-parameter function for a "cascade map".
   *
   * @param map &lt;X,Map&lt;Y,Z>>Map
   * @return Function2 defined on <code>X x Y</code> and taking values in
   * <code>Z</code>. For a map <code>m</code>, an <code>X x</code>, and
   * a <code>Y y</code>, the value of the function is calculated like this:
   * <code>m.get(x).get(y)</code>. If any of these get() returns <code>null</code>,
   * the function returns <code>null</code>.
   */
  public static <X,Y,Z> Function2<X,Y,Z> forMap(final Map<X,Map<Y,Z>> map) {
    return forMap(map, null);
  }

  /**
   * Creates a (virtual) map for a two-parameter function.
   * @param xKeys Set the set of keys for the first argument
   * @param yKeys Set the set of keys for the second argument
   * @return Map a cascade map that for an x from xKeys and a y from yKeys
   * get(x).get(y) returns f(x,y).
   */

  public Map<X,Map<Y,Z>> toMap(final Set<? extends X> xKeys,
                               final Set<? extends Y> yKeys) {
    return new AbstractMap<X,Map<Y,Z>>() {
      private final Function<X,Map<Y,Z>> xToMap = new Function<X,Map<Y,Z>>() {
        public Map<Y,Z> apply(X x) {
          return curry1(x).toMap(yKeys);
        }
      };

      public Set<Map.Entry<X,Map<Y,Z>>> entrySet() {
        return new RestrictedFunctionEntrySet<X,Map<Y,Z>>(xToMap, xKeys);
      }
    };
  }

  /**
   * Swaps function arguments.
   *
   * @return Function2 such that its arguments are in reverse order:
   * g(y,x) = f(x,Y).
   */
  public Function2<Y,X,Z> swap() {
    return new Function2<Y,X,Z>() {
      public Z apply(Y y, X x) {
        return Function2.this.apply(x, y);
      }
    };
  }

  /**
   * Curries the function by the first argument.
   * @param x X
   * @return Function that for each <code>Y y</code> returns <code>f(x,y)</code>.
   */
  public Function<Y,Z> curry1(final X x) {
    return new Function<Y,Z>() {
      public Z apply(Y y) {
        return Function2.this.apply(x, y);
      }
    };
  }

  public Z zz(X x) {
    return null;
  }

  /**
   * Curries the function by the second argument.
   * @param y Y
   * @return Function that for each <code>X x</code> returns <code>f(x,y)</code>.
   */
  public Function<X,Z> curry2(final Y y) {
    return new Function<X,Z>() {
      public Z apply(X x) {
        return Function2.this.apply(x, y);
      }
    };
  }

  /**
   * Returns a compostion f.g : XxY->T of a two-parameter function, f: XxY->Z
   * and g: Z->T.
   * Compostion is defined as a function h such that
   * h(x,y) = g(f(x,y)) for each pair x,y.
   *
   * @param f Function2&lt;X,Y,Z>
   * @param g Function&lt;Z,T>
   * @return Function&lt;X,Y,T> composition of f and g
   */
  public static <X,Y,Z,T> Function2<X,Y,T> compose(final Function2<X,Y,? extends Z> f,
                                                   final Function<? super Z,? extends T> g) {
    return new Function2<X,Y,T> () {
      public T apply(X x, Y y) {
        return g.apply(f.apply(x, y));
      }
    };
  }

  /**
   * Returns a compostion (f,g).h : AxB->Z of a two-parameter function,
   * h: XxY->Z and two single-parameter functions, f:A->Z and g:B->Y.
   * Compostion is defined as a function q such that
   * q(a,b) = h(f(a),g(b))) for each pair a,b.
   *
   * @param f Function&lt;A,X>
   * @param g Function&lt;B,Y>
   * @param h Function2&lt;X,Y,Z>
   * @return Function&lt;A,B,Z> composition of (f,g) and h.
   */
  public static <A,B,X,Y,Z> Function2<A,B,Z> compose(final Function<A,? extends X> f,
                                                     final Function<B,? extends Y> g,
                                                     final Function2<? super X,? super Y,? extends Z> h) {
    return new Function2<A,B,Z> () {
      public Z apply(A a, B b) {
        return h.apply(f.apply(a), g.apply(b));
      }
    };
  }
}
