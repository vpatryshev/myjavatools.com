/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Objects.java	5.0 11/15/04
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */


package com.myjavatools.lib.foundation;

import java.util.*;
import java.lang.reflect.Method;

/**
 * Objects is a utility class that contains various unsorted static methods for foundation package
 *
 * @version 5.0, 11/25/04
 * @see Maps
 * @see Function
 * @since 5.0
 */
public abstract class Objects
{
  /**
   * Gets the index of the first element of an array that equals to specified object
   *
   * @param what T the object to look for in array
   * @param array T[] array of objects to look for what
   * @return index of the object in array, or -1 if none found
   *
   * <br><br><b>Examples</b>:
   * <li><code>indexOf("abc", new String[] {"123", "abc", "xyz"}) </code>
   * returns 1;</li>
   *
   * <li><code>indexOf(null, new String[] {"123", "abc", null}) </code>
   * returns 2;</li>
   *
   */
  public static <T> int indexOf(T what, T[] array) {
    return Arrays.asList(array).indexOf(what);
  }

  /**
   * Gets the index of the next element of an array that equals to specified object
   *
   * @param what T the object to look for in array
   * @param array T[] array of objects to look for what
   * @param fromIndex int start search from this position
   * @return index of the object in array, or -1 if none found
   *
   * <br><br><b>Examples</b>:
   * <li><code>indexOf("abc", new String[] {"abc", "abc", "xyz", 1}) </code>
   * returns 1;</li>
   *
   * <li><code>indexOf(null, new String[] {"123", "abc", null}}, 1) </code>
   * returns 2;</li>
   *
   */
  public static <T> int indexOf(T what, T[] array, int fromIndex) {
    for (int i = fromIndex; i < array.length; i++) {
      if ((what == null && array[i] == null) ||
          (what != null && what.equals(array[i]))) return i;
    }
    return -1;
  }

  /**
   * Gets the index of the next element of a list that equals to specified object
   *
   * @param what T the object to look for in list
   * @param list List&lt;T> list of objects to look for what
   * @param fromIndex int start search from this position
   * @return index of the object in list, or -1 if none found
   *
   * <br><br><b>Examples</b>:
   * <li><code>List l = new ArrayList();
   * l.add("abc"); l.add("abc"), l.add("xyz");
   * indexOf("abc", list, 1} </code>
   * returns 1;</li>
   *
   * <li><code>List l = new ArrayList();
   * l.add("abc"); l.add("abc"), l.add(null);
   * indexOf(null, list, 1} </code>
   * returns 2;</li>
   *
   */

  public static <T> int indexOf(T what, List<T> list, int fromIndex) {
    for (int i = fromIndex; i < list.size(); i++) {
      Object current = list.get(i);
      if ((what == current) ||
          (what != null && what.equals(current))) return i;
    }
    return -1;
  }

  /**
   * makes a Set from an array of elements
   *
   * @param elements T[] elements to fill the set
   * @return Set the set that contains all the elements from array
   * if the array is null, returns null
   *
   * <br><br><b>Examples</b>:
   * <li><code>toSet(new String[] {"1", "2", "3").size()</code> return 3;</li>
   * <li><code>toSet(3, 1, 4, 1, 5, 9, 2, 6, 5).size()</code> returns 7.</li>
   * @deprecated since 5.0; the usefulness of this method is doubtful
   */
  public static <T> Set<T> toSet(T... elements) {
    return new LinkedHashSet<T>(Arrays.asList(elements));
  }

  /**
   * In a "creative", anti-scientific way checks whether a string or a container is empty.
   * <br>Accepts a <code>Collection</code>, a <code>Map</code>, an array, a <code>String</code>.
   *
   * @param data a Collection or a Map or an array or a string to check
   * @return true if data is empty
   *
   * <br><br><b>Examples</b>:
   * <li><code>isEmpty(""), isEmpty(null), isEmpty(new HashMap())</code> all return <b>true</b>;</li>
   * <li><code>isEmpty(" "), isEmpty(new int[] {0})</code> returns <b>false</b>.</li>
   */
  public static final  <T> boolean isEmpty(T data) {
    if (data == null) return true;
// attempt 1: array length
    if (data instanceof Object[])   return ((Object[])  data).length == 0;

// attempt 2: isEmpty
    try {
      Method isEmpty = data.getClass().getMethod("isEmpty");
      if (isEmpty != null) {
        return ((Boolean)isEmpty.invoke(data)).booleanValue();
      }
    } catch (Exception e) {}

// attempt 3: size
    try {
      Method size = data.getClass().getMethod("size");
      if (size != null) {
        return ((Integer)size.invoke(data)).intValue() == 0;
      }
    } catch (Exception e) {}
    return (data.toString().length() == 0) ||
           "null".equals(data.toString());
  }

  /**
   * Chooses the first non-empty object out of objects in parameter list.
   *
   * @param arglist the first candidate ...
   * @return the first one of the list of candidates that is not empty, converted to String
   *
   * <br><br><b>Examples</b>:
   * <li><code>oneOf(null, "xyz")</code> returns "xyz";</li>
   * <li><code>oneOf("abc", "xyz")</code> returns "abc";</li>
   * <li><code>oneOf(null, "", "xyz")</code> returns "xyz";</li>
   * <li><code>oneOf("abc", null, "xyz")</code> returns "abc";</li>
   * <li><code>oneOf("", "def", null)</code> returns "def";</li>
   * <li><code>oneOf(null, null, 2)</code> returns 2.</li>
   * <li><code>oneOf("abc", null, "pqr", "xyz")</code> returns "abc";</li>
   * <li><code>oneOf("", "def", null, "xyz")</code> returns "def";</li>
   */
  public static <T> T oneOf(T ... arglist) {
    T candidate = null;
    for (T o : arglist) {
      if (!isEmpty(o)) return o;
      if (o != null) candidate = o;
    }
    return candidate;
  }

  /**
   * Creates set union of two collections
   * @param first Collection<T>
   * @param second Collection<T>
   * @return Set<T> that is a union of first and second as sets.
   * nulls are tolerated and ignored
   *
   * <br><br><b>Example</b>:
   * <li><code>union(Arrays.asList(new String[] {"a", "b", "c"}), Arrays.asList(new String[] {"b", "a", "d"})</code>
   * returns the same list as <code>new HashSet(Arrays.asList(new String[] {"a", "b", "c", "d"}))</code>.</li>
   * @deprecated since 5.0; can do it using ordinary Set.addAll()
   */
  public static <T> Set<T> union(Collection<T> first, Collection<T> second) {
    Set<T> result = new HashSet<T>((first  == null ? 0 : first.size()) +
                                   (second == null ? 0 : second.size()));
    if (first  != null) result.addAll(first);
    if (second != null) result.addAll(second);
    return result;
  }
}
