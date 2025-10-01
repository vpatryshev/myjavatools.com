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
 * @version 6.0
 */
package com.myjavatools.lib.foundation;

/**
 * LazyPair&lt;Left, Right> is a pair consisting of key and value; its
 * value won't be calculated until requested.
 * LazyPair is immutable.
 *
 * @version 6.0 04/25/06
 *
 * @see Map#Entry
 * @since 6.0
 */

public class LazyPair<X,Y> extends Pair<X,Y> {
  boolean isCached = false;
  final Function<? super X,Y> function;

  /**
   * Constructor; saves argument and function
   * @param x X
   * @param f Function
   */
  public LazyPair(X x, Function<? super X,Y> f) {
    super(x, null);
    function = f;
  }

  /**
   * right getter
   * @return the value of the function
   */
  public Y right() {
    if (!isCached) {
      right = function.apply(left);
      isCached = true;
    }
    return right;
  }
}
