package com.myjavatools.lib.foundation;

import java.util.*;

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
 * @version 5.0
 *
 * AbstractImmutableCollection is a base class for immutable collections
 */

abstract class AbstractImmutableCollection<T> extends AbstractCollection<T> {
  public void clear() {
    throw new UnsupportedOperationException();
  }

  public boolean addAll(Collection<? extends T> x) {
    throw new UnsupportedOperationException();
  }

  public boolean removeAll(Collection<?> x) {
    throw new UnsupportedOperationException();
  }

  public boolean retainAll(Collection<?> x) {
    throw new UnsupportedOperationException();
  }

  public boolean remove(Object x) {
    throw new UnsupportedOperationException();
  }

  public boolean add(T x) {
    throw new UnsupportedOperationException();
  }

  public boolean containsAll(Collection<?> collection) {
    for (Object element : collection) {
      if (!contains(element)) {
        return false;
      }
    }
    return true;
  }

  public boolean isEmpty() {
    return size() == 0;
  }

  public T[] toArray() {
    return toArray((T[])null);
  }

  public <T1>T1[] toArray(T1[] a) {
    Object[] result = a != null && a.length >= size() ?
                      a : new ArrayList<T>(size()).toArray();
    int i = 0;
    for (T element : this) {
      result[i++] = element;
    }

    return (T1[]) result;
  }
}
