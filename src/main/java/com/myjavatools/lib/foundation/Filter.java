/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Filter.java	6.0 04/28/06
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * Filter is a Function that returns Boolean values; boolean accept() is
 * an alias for Function.apply(). A good example of Filter is java.io.FileFilter,
 * unfortunately not derived from Filter. To implement this class you should define
 * accept().
 *
 * @version 6.0 04/28/06
 *
 * @see Function
 * @see java.util.Iterator
 * @since 5.0
 */
public abstract class Filter<T> extends Function<T,Boolean> {
    /**
     * checks whether an object is accepted by the filter
     * @param x T an element to check for acceptance
     * @return boolean true if x is accepted, false otherwise
     */
  public abstract boolean accept(T x);

  /**
   * Filter.apply() is the same as accept();
   * @param x T an element to which this filter is applied
   * @return Boolean result of applying this filter to x
   */
  public Boolean apply(T x) {
    return accept(x);
  }

  /**
   * creates a filter that accepts only x such that f(x) > 0
   * @param f Function&lt;T,Double>
   * @return Filter as defined above
   */
  public static <T> Filter<T> toFilter(final Function<T,Double> f) {
    return new Filter<T>() {
      public boolean accept(T x) {
        return f.apply(x) > 0;
      }
    };
  }

  /**
   * Returns filtered iterator
   * @param source Iterator original iterator
   * @return Iterator filtered iterator
   * the resulting iterator will contain only those elements of source that
   * satisfy this filter
   *
   * <p><b>Example</b>:
   * <pre><code>new Filter&lt;String>() { boolean accept(String s) { return s.startsWith("M"); }}.
   * filter(Arrays.asList(new String[] {"New", "Magic", "Logic"}).iterator());
   * </code> </pre>
   * returns an iterator returning just "Magic".</p>
   */
  public Iterator<T> filter(final Iterator<T> source) {
    return new Iterator<T>() {
      T pointer;
      boolean found = false;
      boolean canRemove = false;

      public boolean hasNext() {
        if (found) {
          return true;
        }
        canRemove = false;

        while(source.hasNext()) {
          pointer = source.next();
          if (accept(pointer)) {
            found = true;
            return true;
          }
        }
        return false;
      }

      public T next() throws NoSuchElementException {
        if (!found && !hasNext()) {
          throw new NoSuchElementException();
        } else {
          found = false;
          canRemove = true;
          return pointer;
        }
      }

      public void remove() {
        if (canRemove) {
          source.remove();
          found = false;
        } else {
          throw new IllegalStateException();
        }
      }
    };
  }

  /**
   * filters an Iterable
   * @param iterable Iterable
   * @return Iterable (view) that contains values that this filter approves
   */
  public Iterable<T> filter(final Iterable<T> iterable) {
    return new Iterable<T>() {
      public Iterator<T> iterator() {
        return Filter.this.filter(iterable.iterator());
      }
    };
  }

  /**
   * Creates conjunction of filters.
   * @param filters (vararg)
   * @return Filter that returns true only on those x for which
   * all filters return true
   */
  public static <T> Filter<T> and(final Filter<T>... filters) {
    return new Filter<T>() {
      public boolean accept(T x) {
        for (Filter filter : filters) {
          if (!filter.accept(x)) return false;
        }
        return true;
      }
    };
  }

  /**
   * Creates disjunction of filters.
   * @return Filter that returns false only on those x for which
   * all filters return false
   */
  public static <T> Filter<T> or(final Filter<T>... filters) {
    return new Filter<T>() {
      public boolean accept(T x) {
        for (Filter filter : filters) {
          if (filter.accept(x)) return true;
        }
        return false;
      }
    };
  }

  /**
   * Creates negation of a filter.
   * @param filter Filter
   * @return Filter that returns true on those x for which source filter return false
   */
  public static <T> Filter<T> not(final Filter<T> filter) {
    return new Filter<T>() {
      public boolean accept(T x) {
        return !filter.accept(x);
      }
    };
  }
}
