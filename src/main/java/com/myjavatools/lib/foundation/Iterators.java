/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Iterators.java	6.0 05/04/06
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the content of the following may not be restricted.</p>
 */

package com.myjavatools.lib.foundation;

import java.util.*;

/**
 * Iterators is a utility class that contains static methods for iterators
 *
 * @version 6.0 05/04/06
 * @see java.util.Collection
 * @see java.util.Iterator
 * @see Filter
 * @since 5.0
 */
public abstract class Iterators {

  /**
   * Creates an Iterator view of an Iterable consisting of Iterators
   *
   * @param outerLoop Iterable &lt;? extends Iterator&lt;? extends T>> source iterators
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

  public static <T> Iterator<T> cat(final Iterable <? extends Iterator<? extends T>> outerLoop) {
    return new Iterator<T>() {
      Iterator <? extends Iterator<? extends T>> iterator = outerLoop.iterator();
      Iterator<? extends T> current = null;

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
        if (!hasNext()) throw new NoSuchElementException();
        return current.next();
      }

      public void remove() throws IllegalStateException {
        if (current == null) throw new IllegalStateException();

        current.remove();
      }
    };
  }

  /**
   * Creates an Iterator view of a sequence of Iterators
   *
   * @param components Iterator&lt;? extends T>[] source iterators
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


  public static <T> Iterator<T> cat(Iterator<? extends T>... components) {
    return cat(Arrays.asList(components));
  }

  /**
   * Concatenates vararg Iterables into one List
   * @param elements Iterable&lt;? extends T>...
   * @return an Iterable view that has elements of the component Iterables.
   *
   * <br><br><b>Example</b>:
   * <li><code>cat(Arrays.asList(new String[] {"a", "b", "c"}), Arrays.asList(new String[] {"b", "a", "d"}))</code>
   * returns the same Iterable as <code>Arrays.asList(new String[] {"a", "b", "c", "b", "a", "d"})</code>.</li>
   */
  public static <T> Iterable<T> cat(Iterable<? extends T>... elements) {
    return new CompoundIterable<T>(elements);
  }

  /**
   * Concatenates vararg Collections into one Collection
   * @param elements Collection&lt;T>...
   * @return an Collection view that has elements of the component Collections.
   *
   * <br><br><b>Example</b>:
   * <li><code>cat(Arrays.asList("a", "b", "c"), Arrays.asList("b", "a", "d"))</code>
   * returns the same Collection as <code>Arrays.asList("a", "b", "c", "b", "a", "d")</code>.</li>
   */
  public static <T> Collection<T> cat(Collection<? extends T>... elements) {
    return new CompoundCollection<T>(elements);
  }

  /**
   * Concatenates a collection of collections into one Collection
   * @param elements Collection&lt;? extends Collection&lt;? extends T>>...
   * @return an Collection view that has elements of the component Collections.
   *
   * <br><br><b>Example</b>:
   * <li><code>cat(Arrays.asList(Arrays.asList("a", "b", "c"), Arrays.asList("b", "a", "d"))</code>
   * returns the same Collection as <code>Arrays.asList(new String[] {"a", "b", "c", "b", "a", "d"})</code>.</li>
   */
  public static <T> Collection<T> cat(Collection<Collection<? extends T>> elements) {
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
   * @deprecated This iterable has been moved to Strings
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
