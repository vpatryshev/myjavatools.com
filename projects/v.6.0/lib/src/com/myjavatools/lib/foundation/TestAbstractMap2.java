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
public class TestAbstractMap2 extends TestCase {
  private AbstractMap2<String,Integer,String> testMap = null;
  private Set<Map2.Entry<String,Integer,String>> entrySet =
      new HashSet<Map2.Entry<String,Integer,String>>();

  private class MockMap2 extends AbstractMap2<String,Integer,String> {
    Set<Map2.Entry<String,Integer,String>> entrySet;

    MockMap2(Set<Map2.Entry<String,Integer,String>> entrySet) {
      this.entrySet = entrySet;
    }
    public Set<Map2.Entry<String,Integer,String>> entrySet() {
      return entrySet;
    }
    public Set<String> keySet1() {
      Set<String> result = new HashSet<String>();
      for (Map2.Entry<String,Integer,String> e : entrySet) {
        result.add(e.getKey1());
      }
      return result;
    }
    public Set<Integer> keySet2() {
      Set<Integer> result = new HashSet<Integer>();
      for (Map2.Entry<String,Integer,String> e : entrySet) {
        result.add(e.getKey2());
      }
      return result;
    }
  };

  protected void setUp() throws Exception {
    super.setUp();
    testMap = new MockMap2(entrySet);
    add("just a test", 17, "test number 17");
  }

  private void add(String k1, int k2, String v) {
    entrySet.add(new AbstractMap2.Entry<String,Integer,String>(k1, k2, v));
  }

  protected void tearDown() throws Exception {
    testMap = null;
    super.tearDown();
  }

  public void testClear() {
    assertFalse(entrySet.isEmpty());
    testMap.clear();
    assertTrue(testMap.isEmpty());
    assertTrue(entrySet.isEmpty());
  }

  public void testContainsKeyPair1() {
    Integer key1 = new Integer(17);
    String key2 = "just a test";
    boolean expectedReturn = false;
    boolean actualReturn = testMap.containsKeyPair(key1, key2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testContainsKeyPair2() {
    Integer key2 = new Integer(17);
    String key1 = "just a test";
    boolean expectedReturn = true;
    boolean actualReturn = testMap.containsKeyPair(key1, key2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testContainsKeyPair3() {
    Integer key2 = new Integer(18);
    String key1 = "just a test";
    boolean expectedReturn = false;
    boolean actualReturn = testMap.containsKeyPair(key1, key2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testContainsKeyPair4() {
    Integer key2 = new Integer(17);
    String key1 = "just a test?";
    boolean expectedReturn = false;
    boolean actualReturn = testMap.containsKeyPair(key1, key2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testContainsValue1() {
    Object value = null;
    boolean expectedReturn = false;
    boolean actualReturn = testMap.containsValue(value);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testContainsValue2() {
    Object value = ":)";
    boolean expectedReturn = false;
    boolean actualReturn = testMap.containsValue(value);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testContainsValue3() {
    Object value = "test number 17";
    boolean expectedReturn = true;
    boolean actualReturn = testMap.containsValue(value);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEntrySet() {
    Set expectedReturn =
        Collections.singleton(
          new AbstractMap2.Entry<String,Integer,String>
          ("just a test", 17, "test number 17"));
    Set actualReturn = testMap.entrySet();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqual1() {
    Object o1 = null;
    Object o2 = null;
    boolean expectedReturn = true;
    boolean actualReturn = testMap.equal(o1, o2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqual2() {
    Object o1 = null;
    Object o2 = "";
    boolean expectedReturn = false;
    boolean actualReturn = testMap.equal(o1, o2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqual3() {
    Object o2 = null;
    Object o1 = "";
    boolean expectedReturn = false;
    boolean actualReturn = testMap.equal(o1, o2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqual4() {
    Object o2 = "xx";
    Object o1 = "";
    boolean expectedReturn = false;
    boolean actualReturn = testMap.equal(o1, o2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqual5() {
    Object o2 = "xx";
    Object o1 = "xx";
    boolean expectedReturn = true;
    boolean actualReturn = testMap.equal(o1, o2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEquals() {
    Set<Map2.Entry<String,Integer,String>> e1 =
        new HashSet<Map2.Entry<String,Integer,String>>();
    AbstractMap2<String,Integer,String> o = new MockMap2(e1);
    assertFalse(testMap.equals(e1));
    e1.add(
      new AbstractMap2.Entry<String,Integer,String>(
        "just a test", 17, "test number 17"));
    assertTrue(testMap.equals(o));
    e1.add(
      new AbstractMap2.Entry<String,Integer,String>(
        "just a test", 18, "test number 17"));
    assertFalse(testMap.equals(e1));
  }

  public void testGet() {
    String actualReturn = testMap.get("just a test", 17);
    assertEquals("return value", "test number 17", actualReturn);
  }

  public void testHashCode() {
    int expectedReturn = -70426093;
    int actualReturn = testMap.hashCode();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmpty() {
    boolean expectedReturn = false;
    boolean actualReturn = testMap.isEmpty();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testKeySet1() {
    Set<String> expectedReturn =
        new HashSet<String>() {{ add("just a test"); }};
    Set actualReturn = testMap.keySet1();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testKeySet2() {
    Set<Integer> expectedReturn = new HashSet<Integer>() {{ add(17); }};
    Set actualReturn = testMap.keySet2();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testPut() {
    try {
      assertEquals("test number 17", testMap.put("just a test", 17, ":)"));
      fail("Must not be implemented");
    } catch (UnsupportedOperationException uoe) {
      // good
    }
  }

  public void testPutAll() {
    Set<Map2.Entry<String,Integer,String>> e1 =
        new HashSet<Map2.Entry<String,Integer,String>>();
    AbstractMap2<String,Integer,String> o = new MockMap2(e1);
    e1.add(
      new AbstractMap2.Entry<String,Integer,String>(
        "just a test", 17, "test number 17"));
    e1.add(
      new AbstractMap2.Entry<String,Integer,String>(
        "just a test", 18, "test number 17"));
    try {
      testMap.putAll(o);
      fail("This op should not be implemented here");
    } catch (UnsupportedOperationException uoe) {
      // good, good
    }
//    assertEquals(2, abstractMap2.size());
  }

  public void testRemove() {
    entrySet.add(new AbstractMap2.Entry("just a test!", 18, ":)"));
    assertEquals(2, testMap.size());
    assertEquals("test number 17", testMap.remove("just a test", 17));
    assertEquals(1, testMap.size());
  }

  public void testSize() {
    int expectedReturn = 1;
    int actualReturn = testMap.size();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToString() {
    String expectedReturn = "{(just a test,17)->test number 17}";
    String actualReturn = testMap.toString();
    assertEquals("return value", expectedReturn, actualReturn);
    entrySet.add(new AbstractMap2.Entry("just a test!", 18, ":)"));
    expectedReturn = "{(just a test,17)->test number 17,(just a test!,18)->:)}";
    actualReturn = testMap.toString();
  }

  public void testValues() {
    Collection<String> expectedReturn = Arrays.asList("test number 17");
    Collection actualReturn = new ArrayList<String>(testMap.values());
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCurry1() {
    assertEquals(0, testMap.curry1("not just a test").size());
    assertEquals(new HashMap<Integer,String>() {{ put(17, "test number 17");}},
                 testMap.curry1("just a test"));
  }

  public void testCurry2() {
    assertEquals(0, testMap.curry2(18).size());
    assertEquals(new HashMap<String,String>()
                     {{ put("just a test", "test number 17");}},
                 testMap.curry2(17));
  }
}
