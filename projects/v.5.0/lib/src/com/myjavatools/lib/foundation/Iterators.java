/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Iterators.java	5.0 01/29/05
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the content of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;
import com.myjavatools.lib.Files;

/**
 * Iterators is a utility class that contains static methods for iterators
 *
 * @version 5.0, 01/29/05
 * @see java.util.Collection
 * @see java.util.Iterator
 * @see Filter
 * @since 5.0
 */
public class Iterators {
  /**
   * Creates an Iterator view of an Iterable consisting of Iterators
   *
   * @param outerLoop Iterable &lt;? extends Iterator&lt;T>> source iterators
   * @return Iterator a compound iterator that scans the first iterator from
   * the sequence, then the second, etc.
   *
   * Can be used with varargs: <code>cat(iterator1, iterator2, iterator3)</code> and
   * with arrays: <code>cat(iterators[])</code>.
   *
   * <p><b>Example</b>:
   * <pre><code>
   * List list1 = Arrays.asList(new String[] {"One", "Two", "Three"});
   * List list2 = Arrays.asList(new String[] {"Four", "Five", "Six"});
   * List list3 = Arrays.asList(new String[] {"One", "Two", "Three", "Four", "Five", "Six"}
   * cat(Arrays.asList(new Iterator {list1.iterator(), list2.iterator()}))</code></pre>
   * returns the same as list3.iterator().</p>
   */

  public static <T> Iterator<T> cat(final Iterable <? extends Iterator<T>> outerLoop) {
    return new Iterator<T>() {
      Iterator <? extends Iterator<T>> iterator = outerLoop.iterator();
      Iterator<T> current = null;

      public boolean hasNext() {
        while (current == null || !current.hasNext()) {
          if (!iterator.hasNext()) {
            return false;
          }
          current = iterator.next();
        }
        return true;
      }

      public T next() {
        if (hasNext()) {
          return current.next();
        }
        throw new NoSuchElementException();
      }

      public void remove() throws IllegalStateException {
        if (current != null) {
          current.remove();
        } else {
          throw new IllegalStateException();
        }
      }
    };
  }

  /**
   * Creates an Iterator view of a sequence of Iterators
   *
   * @param components Iterator[] source iterators
   * @return Iterator a compound iterator that scans the first iterator from
   * the sequence, then the second, etc.
   *
   * Can be used with varargs: <code>cat(iterator1, iterator2, iterator3)</code> and
   * with arrays: <code>cat(iterators[])</code>.
   *
   * <p><b>Example</b>:
   * <pre><code>
   * List list1 = Arrays.asList(new String[] {"One", "Two", "Three"});
   * List list2 = Arrays.asList(new String[] {"Four", "Five", "Six"});
   * List list3 = Arrays.asList(new String[] {"One", "Two", "Three", "Four", "Five", "Six"}
   * cat(list1.iterator(), list2.iterator())</code></pre>
   * returns the same as list3.iterator().</p>
   */

  public static <T> Iterator<T> cat(Iterator<T>... components) {
    return cat(Arrays.asList(components));
  }

  /**
   * Concatenates vararg Iterables into one List
   * @param elements Iterable&lt;? extends X>...
   * @return an Iterable view that has elements of the component Iterables.
   *
   * <br><br><b>Example</b>:
   * <li><code>cat(Arrays.asList(new String[] {"a", "b", "c"}), Arrays.asList(new String[] {"b", "a", "d"}))</code>
   * returns the same Iterable as <code>Arrays.asList(new String[] {"a", "b", "c", "b", "a", "d"})</code>.</li>
   */
  public static <X> Iterable<X> cat(Iterable<? extends X>... elements) {
    return new CompoundIterable<X>(elements);
  }

  /**
   * Concatenates vararg Collections into one List
   * @param elements Collection&lt;? extends T>...
   * @return an Collection view that has elements of the component Collections.
   *
   * <br><br><b>Example</b>:
   * <li><code>cat(Arrays.asList(new String[] {"a", "b", "c"}), Arrays.asList(new String[] {"b", "a", "d"}))</code>
   * returns the same Collection as <code>Arrays.asList(new String[] {"a", "b", "c", "b", "a", "d"})</code>.</li>
   */
  public static <T> Collection<T> cat(final Collection<? extends T>... elements) {
    return new CompoundCollection<T>(elements);
  }

  /**
   * returns an iterable good for using in a foreach loop
   * @param sequence CharSequence to scan
   * @return Iterable&lt;Character>
   *
   * <br><br><b>Example</b>:
   * <li><code>for (char c : chars("this is an example"){
   *     System.out.println("Character " + c);
   * }
   * </code></li>
   *
   */
  public static Iterable<Character> chars(final CharSequence sequence) {
  return new Iterable<Character>() {
      public Iterator<Character> iterator() {
        return new Iterator<Character>() {
          int index = 0;
          public boolean hasNext() {
            return index < sequence.length();
          }
          public void remove() {
            throw new UnsupportedOperationException();
          }
          public Character next() {
            return sequence.charAt(index++);
          }
        };
      }
    };
  }

  /**
   * EmptyIterator is a helper class that does not contain
   * any elements and throws an exception when next()
   * is called. The exception message can be customized.
   * @version 5.0
   */
  public static class EmptyIterator<T> implements Iterator<T> {
    NoSuchElementException exception;

    public EmptyIterator(String message) {
      exception = new NoSuchElementException(message);
    }

    public EmptyIterator() {
      exception = new NoSuchElementException();
    }

    public boolean hasNext() {
      return false;
    }

    public T next() {
      throw exception;
    }

    public void remove() {
      throw new UnsupportedOperationException();
    }
  }
}
