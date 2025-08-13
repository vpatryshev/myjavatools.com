package com.myjavatools.lib;

import junit.framework.*;
import java.util.*;
import static com.myjavatools.lib.Bytes.*;
import static com.myjavatools.lib.foundation.Objects.*;
import static com.myjavatools.lib.foundation.Maps.*;

public class TestObjects
    extends TestCase {
//  private Objects Objects = null;

  public TestObjects(String name) {
    super(name);
  }

  protected void setUp() throws Exception {
    super.setUp();
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  public static void assertEquals(String message, Object[] expectedArray, Object[] actualArray) {
    if (expectedArray == null) {
      assertNull(message + ": actual must be null", actualArray);
    }
    assertNotNull(message + ": actual must not be null", actualArray);
    assertEquals("sizes must be equal", expectedArray.length, actualArray.length);

    for (int i = 0; i < Math.min(expectedArray.length, actualArray.length); i++) {
      assertEquals(message + ": #" + i, expectedArray[i], actualArray[i]);
    }
  }

  public static void assertEquals(String message, byte[] expectedArray, byte[] actualArray) {
    if (expectedArray == null) {
      assertNull(message + ": actual must be null", actualArray);
    }
    assertNotNull(message + ": ctual must not be null", actualArray);

    for (int i = 0; i < Math.max(expectedArray.length, actualArray.length); i++) {
      assertEquals(message + ": #" + i, expectedArray[i], actualArray[i]);
    }
  }

  public static void assertEquals(String message, char[] expectedArray, char[] actualArray) {
    if (expectedArray == null) {
      assertNull(message + ": actual must be null", actualArray);
    }
    assertNotNull(message + ": ctual must not be null", actualArray);

    for (int i = 0; i < Math.max(expectedArray.length, actualArray.length); i++) {
      assertEquals(message + ": #" + i, expectedArray[i], actualArray[i]);
    }
  }

  public void testNothing() {
    SortedSet<Integer> ss = new TreeSet<Integer>();
    ss.addAll(Arrays.asList(new Integer[] {3, 17, 60, 2, 28, 2005}));
    assertEquals(6, ss.size());
  }

  public void testToMap() {
    Object[] pairs = new Object[] {1, "one", 2, "two", 3, "three"};
    java.util.Map<Integer, String> expectedReturn = new HashMap<Integer, String>();
    expectedReturn.put(1, "one");
    expectedReturn.put(2, "two");
    expectedReturn.put(3, "three");
    java.util.Map actualReturn = toMap(pairs);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmpty() {
    assertTrue("return value", isEmpty(null));
    assertTrue("return value", isEmpty(new Long[]{}));
    assertTrue("return value", isEmpty(new HashMap()));
    assertTrue("return value", isEmpty(""));
    assertFalse("return value", isEmpty(" "));
  }

  public void testOneOf2() {
    assertEquals("return value", "xyz", oneOf(null, "xyz"));
    assertEquals("return value", "abc", oneOf("abc", "xyz"));
    assertEquals("return value", "", oneOf("", null));
    assertEquals("return value", "abc", oneOf("abc", null));
  }

  public void testOneOf3() {
    assertEquals("return value", "xyz", oneOf(null, "", "xyz"));
    assertEquals("return value", "abc", oneOf("abc", null, "xyz"));
    assertEquals("return value", "def", oneOf("", "def", null));
    assertEquals("return value", "",    oneOf("", null, ""));
  }

  public void testOneOf4() {
    assertEquals("return value", "xyz", oneOf(null, "", null, "xyz"));
    assertEquals("return value", "abc", oneOf("abc", null, "pqr", "xyz"));
    assertEquals("return value", "def", oneOf("", "def", null, "xyz"));
    assertEquals("return value", "",  oneOf("", null, "", null));
  }

  public void testMap() {
    java.util.Map<Integer, String> m = new HashMap<Integer,String>();
    m.put(0xa, "ValueOfA"); m.put(0xb, "ValueOfB"); m.put(0xc, "ValueOfC");
    List<Integer> domain = Arrays.asList(new Integer[] {0xb, 0, 0xb});
    List<String> expectedReturn = Arrays.asList(new String[] {"ValueOfB", null, "ValueOfB"});
    List<String> actualReturn = map(m, (List<Integer>)domain);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testMap1() {
    java.util.Map<Integer,String> m = new HashMap<Integer, String>();
    m.put(1, "One"); m.put(2, "Two"); m.put(3, "Three");
    Collection<Integer> domain = Arrays.asList(new Integer[] {2, 0, 2});
    Collection<String> expectedReturn = new ArrayList<String>(Arrays.asList(new String[] {"Two", "Two"}));
    Collection<String> actualReturn = new ArrayList<String>(map(m, domain));
    Collection ar = actualReturn;
    if(!actualReturn.equals(expectedReturn)) {
      System.out.println("oops1");
    }
    if(!expectedReturn.equals(actualReturn)) {
      System.out.println("oops2");
      expectedReturn.equals(actualReturn);
    }
    assertEquals("return value", expectedReturn, actualReturn);
  }


  public void testMap2() {
    java.util.Map<Integer,String> m = new HashMap<Integer, String>();
    m.put(1, "One"); m.put(2, "Two"); m.put(3, "Three"); m.put(4, "Four");
    java.util.Map<Integer,String> expectedReturn = new TreeMap<Integer,String>();
    expectedReturn.put(2, "Two"); expectedReturn.put(4, "Four");
    Collection<Integer> keys = Arrays.asList(new Integer[] {2,4});
    java.util.Map<Integer,String> actualReturn = restrict(m, keys);
    assertEquals("return value", actualReturn, expectedReturn);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCompose() {
    Map<Integer,String> f = toMap(new Object[] {1, "one", 2, "two", 3, "three"});
    Map<String, Float>  g = toMap(new Object[] {"one", 1.0, "two", 2.0, "three", 3.0});
    Map<Integer,Float> composition = compose(f, g);
    Map<Integer,Float> expected = toMap(new Object[] {1, 1.0, 2, 2.0, 3, 3.0});
    assertEquals("Return value", expected, composition);
  }

  public void testInverse() {
    Map<Integer,String> f = toMap(new Object[] {1, "one", 2, "two", 3, "three"});
    Map<String,Integer> expected = toMap(new Object[] {"one", 1, "two", 2, "three", 3});
    try {
      Map<String,Integer> inverse = inverse(f);
      assertEquals("Return value", expected, inverse);
    } catch (InstantiationException e) {
      fail("got " + e + " - but must be invertible");
    }
    Map<String,String> g = toMap("John", "Doe", "Jack", "Rabbit", "Jane", "Doe");
    try {
      inverse(g);
      fail("Inverse does not exist");
    } catch (InstantiationException e) {
      // Correct, must throw this exception
    }
  }

  public void testIndexOf() {
    assertEquals("must be 1", 1, indexOf("abc", new String[] {"123", "abc", "xyz"}));
    assertEquals("must be 2", 2, indexOf(null,  new String[] {"123", "abc", null}));
    assertEquals("must be 3", 3, indexOf(5,     new Integer[] {-1, 1, 3, 5, 7, 9, 11}));
  }

  public void testIndexOf1() {
    assertEquals("must be 1", 1, indexOf("abc", new String[] {"abc", "abc", "xyz"}, 1));
    assertEquals("must be 2", 2, indexOf(null,  new String[] {"123", "abc", null},  1));
    assertEquals("must be 5", 5, indexOf(14,    new Integer[] {1, 3, 14, 7, 9, 14, 11}, 4));
  }

  public void testIndexOf2() {
    List<String> list = new ArrayList<String>();
    list.add("abc"); list.add("abc"); list.add("xyz"); list.add(null);
    assertEquals("must be 1", 1, indexOf("abc", list, 1));
    assertEquals("must be 3", 3, indexOf(null,  list,  1));
  }

  public void testToMap1() {
    Map<String,String> result = toMap("first", "primero", "second", "segundo", "third", "tercero");
    assertEquals("must be three elements", 3, result.size());
    assertEquals("must be segundo", "segundo", result.get("second"));
  }

  public void testToMap2() {
    Map<String,String> result = toMap("1", "US", "7", "Russia", "49", "Germany", "1", "US");
    assertEquals("must be four elements", 4, result.size());
    assertEquals("must be Germany", "Germany", result.get("49"));
  }
}
