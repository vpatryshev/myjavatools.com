/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)FileIterator.java	5.0 02/09/05
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib;

import java.util.*;
import java.io.File;
import java.io.FileFilter;

/**
 * FolderIterator is an Iterator that walks over the tree of
 * subfolders in a folder
 * Traversal order is depth-first; can be preorder or postorder.
 * To do breadth-first, we would need a queue; you are welcome to
 * implement it - I do not remember ever requiring breadth-first
 * traversal order for file folders since the time I learned about
 * file folders, which was long ago.
 *
 * @version 5.0, 02/10/05
 *
 * @see java.util.Iterator
 * @see java.util.File
 * @see Iterators
 * @since 5.0
 */
final class FolderIterator
    implements Iterator<File> {
  private File self;
  private final Iterator<File> outerIterator;
  private Iterator<File> current = null;
  private FileFilter filter;
  private final boolean preorder;

  private FolderIterator(final File folder, boolean preorder) {
    this(folder, Files.DIRECTORY_FILTER, preorder);
  }

  private FolderIterator(final File folder,
                         FileFilter filter,
                         boolean preorder) {
    this.self = folder;
    this.filter = filter;
    this.preorder = preorder;
    this.outerIterator = Arrays.asList(folder.listFiles(filter)).
                         iterator();
  }

  private static FileFilter makeDirectoryFilter(final FileFilter filter) {
    return new FileFilter() {
      public boolean accept(File file) {
        return file.isDirectory() && filter.accept(file);
      }
    };
  }

  /**
   * returns a FolderIterator to walk through directory tree,
   * depth-first, preorder
   *
   * @param folder File
   * @return FolderIterator
   */
  public static FolderIterator preorder(File folder) {
    return new FolderIterator(folder, true);
  }

  /**
   * returns a FolderIterator to walk through directory tree,
   * depth-first, preorder, accepting only files that
   * FileFilter filter accepts.
   *
   * @param folder File
   * @param FileFilter filter
   * @return FolderIterator
   */
  public static FolderIterator preorder(File folder,
                                        FileFilter filter) {
    return new FolderIterator(folder,
                              makeDirectoryFilter(filter),
                              true);
  }

  /**
   * returns a FolderIterator to walk through directory tree,
   * depth-first, postorder
   *
   * @param folder File
   * @return FolderIterator
   */
  public static FolderIterator postorder(File folder) {
    return new FolderIterator(folder, false);
  }

  /**
   * returns a FolderIterator to walk through directory tree,
   * depth-first, postorder, accepting only files that
   * FileFilter filter accepts.
   *
   * @param folder File
   * @param FileFilter filter
   * @return FolderIterator
   */
  public static FolderIterator postorder(File folder,
                                         FileFilter filter) {
    return new FolderIterator(folder,
                              makeDirectoryFilter(filter),
                              false);
  }

  /**
   * Returns <tt>true</tt> if the iterator has more elements to scan.
   *
   * @return <tt>true</tt> if the iterator has more elements.
   */
  public boolean hasNext() {
    if (preorder && self != null) {
      return true;
    }
    return haveSubtree() || self != null;
  }

  private boolean haveSubtree() {
    while (current == null || !current.hasNext()) {
      if (outerIterator.hasNext()) {
        current = new FolderIterator(outerIterator.next(), filter, preorder);
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the next element in the iteration.
   *
   * @return the next element in the iteration.
   * @todo Implement this java.util.Iterator method
   */
  public File next() {
    if (preorder && self != null) {
      return self();
    } else if (haveSubtree()) {
      return current.next();
    } else if (!preorder) {
      return self();
    }
    throw new NoSuchElementException();
  }

  private File self() {
    File result = self;
    self = null;
    return result;
  }

  /**
   * Removes from the underlying collection the last element returned by the
   * iterator (optional operation).
   */
  public void remove() {
    throw new UnsupportedOperationException();
  }
}
