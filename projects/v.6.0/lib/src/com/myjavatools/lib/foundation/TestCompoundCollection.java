package com.myjavatools.lib.foundation;

import junit.framework.*;
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
 * @version 6.0
 */
public class TestCompoundCollection extends TestCase {
  private CompoundCollection<String> compoundCollection = null;

  protected void setUp() throws Exception {
    super.setUp();
    List<String> l1 = new ArrayList<String>();
    List<String> l2 = new ArrayList<String>();
    l1.add("ab"); l1.add("cd");
    l2.add("ef"); l2.add("gh");
    compoundCollection = new CompoundCollection<String>(l1, l2);
  }

  protected void tearDown() throws Exception {
    compoundCollection = null;
    super.tearDown();
  }

  public void testAdd() {
    String element = "ij";
    boolean expectedReturn = true;
    boolean actualReturn = compoundCollection.add(element);
    assertEquals("return value", expectedReturn, actualReturn);
    assertTrue(compoundCollection.contains(element));
  }

  public void testAddAll() {
    Collection toAdd = Arrays.asList("ij", "kl");
    boolean expectedReturn = true;
    boolean actualReturn = compoundCollection.addAll(toAdd);
    assertEquals("return value", expectedReturn, actualReturn);
    assertTrue(compoundCollection.contains("ij"));
    assertTrue(compoundCollection.contains("kl"));
  }

  public void testClear() {
    compoundCollection.clear();
    assert(compoundCollection.isEmpty());
  }

  public void testIterator() {
    Iterator actualReturn = compoundCollection.iterator();

    for (String s : Arrays.asList("ab", "cd", "ef", "gh")) {
      assertEquals(s, actualReturn.next());
    }

    assertFalse(actualReturn.hasNext());
  }

  public void testRemoveAll1() {
    Collection toRemove = Arrays.asList("cd", "ef");
    boolean expectedReturn = true;
    boolean actualReturn = compoundCollection.removeAll(toRemove);
    assertEquals("return value", expectedReturn, actualReturn);
    assertTrue(compoundCollection.contains("ab"));
    assertFalse(compoundCollection.contains("cd"));
    assertFalse(compoundCollection.contains("ef"));
    assertTrue(compoundCollection.contains("gh"));
  }

  public void testRemoveAll2() {
    Collection toRemove = Arrays.asList("gh", "ef", "ij");
    boolean expectedReturn = true;
    boolean actualReturn = compoundCollection.removeAll(toRemove);
    assertEquals("return value", expectedReturn, actualReturn);
    assertTrue(compoundCollection.contains("ab"));
    assertTrue(compoundCollection.contains("cd"));
    assertFalse(compoundCollection.contains("ef"));
    assertFalse(compoundCollection.contains("gh"));
  }

  public void testRemoveAll3() {
    Collection toRemove = Arrays.asList("dc", "fe");
    boolean expectedReturn = false;
    boolean actualReturn = compoundCollection.removeAll(toRemove);
    assertEquals("return value", expectedReturn, actualReturn);
    assertTrue(compoundCollection.contains("ab"));
    assertTrue(compoundCollection.contains("cd"));
    assertTrue(compoundCollection.contains("ef"));
    assertTrue(compoundCollection.contains("gh"));
  }

  public void testSize() {
    int expectedReturn = 4;
    int actualReturn = compoundCollection.size();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCompoundCollection() {
    Collection<? extends Collection<? extends String>> components = Arrays.asList(Arrays.asList("ab", "cd"), Arrays.asList("ef", "gh"));
    Collection<String> actual = new CompoundCollection<String>(components);
    assertEquals(new ArrayList(actual), new ArrayList(compoundCollection));
    assertEquals(Arrays.asList("ab", "cd", "ef", "gh"), new ArrayList(actual));
  }

  public void testCompoundCollection1() {
    Collection components = Arrays.asList(Arrays.asList("ab"), Collections.EMPTY_LIST, Arrays.asList("ef"));
    Collection actual = new CompoundCollection(components);
    assertEquals(Arrays.asList("ab", "ef"), new ArrayList(actual));
  }

  public void testCompoundCollection2() {
    Collection components = Arrays.asList(Arrays.asList("ab", "cd"));
    Collection actual = new CompoundCollection(components);
    assertEquals(Arrays.asList("ab", "cd"), new ArrayList(actual));
  }

  public void testCompoundCollection3() {
    Collection components = Arrays.asList(Collections.EMPTY_LIST, Collections.EMPTY_LIST);
    Collection actual = new CompoundCollection(components);
    assertEquals(0, actual.size());
  }

  public void testCompoundCollection4() {
    compoundCollection = new CompoundCollection(Collections.EMPTY_LIST);
    assertEquals(0, compoundCollection.size());
  }
}
