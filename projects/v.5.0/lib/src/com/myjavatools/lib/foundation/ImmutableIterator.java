package com.myjavatools.lib.foundation;

import java.util.Iterator;

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
 */
public abstract class ImmutableIterator<T> implements Iterator<T> {

    /**
     * method is not implemented actually
     *
     * @throws UnsupportedOperationException - always
     */
    public void remove() {
    throw new UnsupportedOperationException();
  }
}
