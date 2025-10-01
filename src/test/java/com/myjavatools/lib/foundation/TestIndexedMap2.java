package com.myjavatools.lib.foundation;

import junit.framework.*;
import java.util.*;
import com.myjavatools.lib.foundation.AbstractMap2.*;

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
public class TestIndexedMap2 extends TestCase {
  private IndexedMap2<String,Integer,String> testMap = null;
  Set<Map2.Entry<String,Integer,String>> entrySet = null;

  protected void setUp() throws Exception {
    super.setUp();
    entrySet = new HashSet<Map2.Entry<String,Integer,String>>();
    testMap = new IndexedMap2<String,Integer,String>() {
      public Set<Map2.Entry<String,Integer,String>> entrySet() {
        return entrySet;
      }
    };
    testMap.put("just a test", 17, "test number 17");
  }

  protected void tearDown() throws Exception {
    testMap = null;
    super.tearDown();
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

  public void testCurry11() {
    String key1 = null;
    Map<Integer,String> expectedReturn = new HashMap<Integer,String>();
    Map<Integer,String> actualReturn = testMap.curry1(key1);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCurry12() {
    String key1 = "bad key";
    Map<Integer,String> expectedReturn = new HashMap<Integer,String>();
    Map<Integer,String> actualReturn = testMap.curry1(key1);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCurry13() {
    String key1 = "just a test";
    Map<Integer,String> expectedReturn = new HashMap<Integer,String>();
    expectedReturn.put(17, "test number 17");
    Map<Integer,String> actualReturn = testMap.curry1(key1);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCurry21() {
    Integer key2 = null;
    Map<String,String> expectedReturn = new HashMap<String,String>();
    Map<String,String> actualReturn = testMap.curry2(key2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCurry22() {
    Map<String,String> expectedReturn = new HashMap<String,String>();
    Map<String,String> actualReturn = testMap.curry2(18);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCurry23() {
    Map<String,String> expectedReturn = new HashMap<String,String>();
    expectedReturn.put("just a test", "test number 17");
    Map<String,String> actualReturn = testMap.curry2(17);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGet() {
    String actualReturn = testMap.get("just a test", 17);
    assertEquals("return value", "test number 17", actualReturn);
  }

  public void testKeySet1() {
    Set<String> expectedReturn = new HashSet<String>();
    expectedReturn.add("just a test");
    Set actualReturn = testMap.keySet1();
    assertEquals(expectedReturn, actualReturn);
  }

  public void testKeySet2() {
    Set<Integer> expectedReturn = new HashSet<Integer>();
    expectedReturn.add(17);
    Set actualReturn = testMap.keySet2();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testPut1() {
    String actualReturn = testMap.put("just a test", 17, "new test number 17");
    assertEquals("return value", "test number 17", actualReturn);
    assertEquals(1, testMap.size());
  }

  public void testPut2() {
    String actualReturn = testMap.put("just a test.", 18, "new test number 18");
    assertEquals("return value", null, actualReturn);
    assertEquals(2, testMap.size());
  }

  public void testGetEntry() {
    Map2.Entry<String,Integer,String> entry = testMap.getEntry("just a test", 17);
    Map2.Entry<String,Integer,String> contained =
        entrySet.iterator().next();
    assertEquals(entry, contained);
    assertEquals(entry.hashCode(), contained.hashCode());

    HashSet<Map2.Entry<String,Integer,String>> s = new HashSet<Map2.Entry<String,Integer,String>>();
    s.add(contained);
    assertTrue(s.contains(entry));
    assertTrue(s.contains(contained));
    assertTrue(testMap.entrySet() == entrySet);
    assertTrue(entrySet.contains(contained));
    assertTrue(entrySet.contains(entry));
    assertTrue(testMap.entrySet().contains(contained));
    assertTrue(testMap.entrySet().contains(entry));
  }

  public void testRemove() {
    testMap.put("just a test.", 18, "new test number 18");
    assertEquals(2, testMap.size());
    String actualReturn = testMap.remove("just a test", 17);
    assertEquals(1, testMap.size());
    assertEquals("test number 17", actualReturn);
    assertEquals("new test number 18", testMap.remove("just a test.", 18));
    assertEquals(0, testMap.size());
  }
}
