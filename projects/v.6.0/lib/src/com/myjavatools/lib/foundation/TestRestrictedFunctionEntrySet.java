package com.myjavatools.lib.foundation;

import junit.framework.*;
import java.util.Map.*;
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
public class TestRestrictedFunctionEntrySet extends TestCase {
  private RestrictedFunctionEntrySet restrictedFunctionEntrySet = null;

  protected void setUp() throws Exception {
    super.setUp();
    restrictedFunctionEntrySet = new RestrictedFunctionEntrySet<String,String>(new Function<String,String>() {
      public String apply(String s) {
        return s + s;
      }
    }, Arrays.asList("ab", "cd"));
  }

  protected void tearDown() throws Exception {
    restrictedFunctionEntrySet = null;
    super.tearDown();
  }

  public void testAdd() {
    Entry<String,String> toAdd = new Pair<String,String>("xx", "yy");
    boolean expectedReturn = false;
    try {
      boolean actualReturn = restrictedFunctionEntrySet.add(toAdd);
      fail("Should have thrown an exception");
    }
    catch (UnsupportedOperationException ex) {
    }
  }

  public void testAddAll() {
    Collection<Pair<String,String>> toAdd = Arrays.asList(new Pair<String,String>("xx", "yy"));
    boolean expectedReturn = false;
    try {
      boolean actualReturn = restrictedFunctionEntrySet.addAll(toAdd);
      fail("Should have thrown an exception");
    }
    catch (UnsupportedOperationException ex) {
    }
  }

  public void testClear() {
    try {
      restrictedFunctionEntrySet.clear();
      fail("Should have thrown an exception");
    }
    catch (UnsupportedOperationException ex) {
    }
  }

  public void testContainsAllNegative() {
    Collection toCheck = Arrays.asList(new Pair<String,String>("cd", "cdcd"), new Pair<String,String>("xx", "yy"), new Pair<String,String>("ab", "abab"));
    boolean expectedReturn = false;
    boolean actualReturn = restrictedFunctionEntrySet.containsAll(toCheck);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testContainsAllPositive1() {
    Collection toCheck = Collections.EMPTY_LIST;
    boolean expectedReturn = true;
    boolean actualReturn = restrictedFunctionEntrySet.containsAll(toCheck);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testContainsAllPositive2() {
    Collection toCheck = Arrays.asList(new Pair<String,String>("cd", "cdcd"));
    boolean expectedReturn = true;
    boolean actualReturn = restrictedFunctionEntrySet.containsAll(toCheck);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testContainsAllPositive3() {
    Collection toCheck = Arrays.asList(new Pair<String,String>("cd", "cdcd"), new Pair<String,String>("ab", "abab"));
    boolean expectedReturn = true;
    boolean actualReturn = restrictedFunctionEntrySet.containsAll(toCheck);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetKeys() {
    Collection expectedReturn = new HashSet(Arrays.asList("cd", "ab"));
    Collection actualReturn = restrictedFunctionEntrySet.getKeys();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsValidKey() {
    Object key = null;
    boolean expectedReturn = false;
    boolean actualReturn = restrictedFunctionEntrySet.isValidKey(key);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIterator() {
    Iterator<Pair<String,String>> expectedReturn = Arrays.asList(new Pair<String,String>("ab", "abab"), new Pair<String,String>("cd", "cdcd")).iterator();
    Iterator<Pair<String,String>> actualReturn = restrictedFunctionEntrySet.iterator();
    while (expectedReturn.hasNext()) {
      assertTrue(actualReturn.hasNext());
      assertEquals(actualReturn.next(), expectedReturn.next());
    }
    assertFalse(actualReturn.hasNext());
  }

  public void testRemove() {
    Object toRemove = null;
    try {
      boolean actualReturn = restrictedFunctionEntrySet.remove(toRemove);
      fail("Should have thrown an exception");
    }
    catch (UnsupportedOperationException ex) {
    }
  }

  public void testRemoveAll() {
    Collection toRemove = null;
    try {
      boolean actualReturn = restrictedFunctionEntrySet.removeAll(toRemove);
      fail("Should have thrown an exception");
    }
    catch (UnsupportedOperationException ex) {
    }
  }

  public void testRetainAll() {
    Collection toRemove = null;
    try {
      boolean actualReturn = restrictedFunctionEntrySet.retainAll(toRemove);
      fail("Should have thrown an exception");
    }
    catch (UnsupportedOperationException ex) {
    }
  }

  public void testSize() {
    int expectedReturn = 2;
    int actualReturn = restrictedFunctionEntrySet.size();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToArray() {
    Map.Entry[] actualReturn = restrictedFunctionEntrySet.toArray();
    Set<Map.Entry> expectedSet = new HashSet<Map.Entry>(Arrays.asList(new Pair<String,String>("ab", "abab"), new Pair<String,String>("cd", "cdcd")));
    assertEquals(2, actualReturn.length);
    assertTrue(expectedSet.contains(actualReturn[0]));
    assertTrue(expectedSet.contains(actualReturn[1]));
    assertFalse(actualReturn[0].equals(actualReturn[1]));
  }

  public void testToArray1() {
    Map.Entry[] array = {new Pair<String,String>("ab", "abab"), new Pair<String,String>("cd", "cdcd")};
    Map.Entry[] actualReturn = restrictedFunctionEntrySet.toArray(array);
    Set<Map.Entry> expectedSet = new HashSet<Map.Entry>(Arrays.asList(new Pair<String,String>("ab", "abab"), new Pair<String,String>("cd", "cdcd")));
    assertEquals(2, actualReturn.length);
    assertTrue(expectedSet.contains(actualReturn[0]));
    assertTrue(expectedSet.contains(actualReturn[1]));
    assertFalse(actualReturn[0].equals(actualReturn[1]));
  }

  public void testRestrictedFunctionEntrySet1() {
    Function<String,Integer> function = new Function<String,Integer>() {
      public Integer apply(String s) {
        return s.length();
      }
    };
    Set<String> keys = new HashSet<String>(Arrays.asList("a", "bc", "def"));
    RestrictedFunctionEntrySet<String,Integer> entrySet = new RestrictedFunctionEntrySet<String,Integer>(function, keys);
    assertTrue(entrySet.contains(new Pair<String,Integer>("bc", 2)));
    assertTrue(entrySet.contains(new Pair<String,Integer>("bc", 2)));
    assertTrue(entrySet.contains(new Pair<String,Integer>("a", 1)));
    assertFalse(entrySet.contains(new Pair<String,Integer>("b", 1)));
  }


  public void testRestrictedFunctionEntrySet2() {
    Function<String,Integer> function = new Function<String,Integer>() {
      public Integer apply(String s) {
        return s.length();
      }
    };
    Collection keys = Arrays.asList("a", "bc", "def");
    RestrictedFunctionEntrySet<String,Integer> entrySet = new RestrictedFunctionEntrySet<String,Integer>(function, keys);
    assertTrue(entrySet.contains(new Pair<String,Integer>("bc", 2)));
    assertTrue(entrySet.contains(new Pair<String,Integer>("bc", 2)));
    assertTrue(entrySet.contains(new Pair<String,Integer>("a", 1)));
    assertFalse(entrySet.contains(new Pair<String,Integer>("b", 1)));
  }

}
