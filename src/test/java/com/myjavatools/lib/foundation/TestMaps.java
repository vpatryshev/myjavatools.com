package com.myjavatools.lib.foundation;

import junit.framework.*;
import java.util.*;
import java.util.Map.*;

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
public class TestMaps extends TestCase {

  protected void setUp() throws Exception {
    super.setUp();
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  public void testArrayToMap1() {
    Object[] nameValuePairs = {};
    Map<String,Number> expectedReturn = new HashMap<String,Number>();
    Map<String,Number> actualReturn = Maps.arrayToMap(nameValuePairs);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testArrayToMap2() {
    Object[] nameValuePairs = {"one", new Integer(1), "two", new Integer(2)};
    Map<String,Number> expectedReturn = new HashMap<String,Number>();
    expectedReturn.put("one", 1);
    expectedReturn.put("two", 2);
    Map<String,Number> actualReturn = Maps.arrayToMap(nameValuePairs);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCompose() {
    Map<String,Number> f = Maps.arrayToMap(new Object[]{"one", new Integer(1), "two", new Integer(2), "three", new Integer(3)});
    Map<Number,String> g = Maps.arrayToMap(new Object[]{new Integer(2), "II", new Integer(3), "III", new Integer(4), "IV"});
    Map<String,String> expectedReturn = Maps.arrayToMap(new Object[]{"two", "II", "three", "III", "one", null});
    Map actualReturn = Maps.compose(f, g);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testInverse() throws InstantiationException {
    Map<String,Number> f = Maps.arrayToMap(new Object[]{"one", new Integer(1), "two", new Integer(2), "three", new Integer(3)});
    Map<Number,String> expectedReturn = Maps.arrayToMap(new Object[]{new Integer(1), "one", new Integer(2), "two", new Integer(3), "three"});
    Map actualReturn = Maps.inverse(f);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testInverseNegative() throws InstantiationException {
    Map<String,Number> f = Maps.arrayToMap(new Object[]{"one", new Integer(1), "two", new Integer(2), "three", new Integer(3), "four", new Integer(2)});
    try {
      Map actualReturn = Maps.inverse(f);
      fail("Should have thrown an exception");
    } catch (InstantiationException e) {
      assertEquals("non-invertible map", e.getMessage());
    }
  }

  public void testMap() {
    Map <Number,String> m = Maps.toMap(new Object[] {new Integer(1), "I", new Integer(2), "II", new Integer(3), "III"});
    Collection<Integer> domain = new HashSet<Integer>(Arrays.asList(1, 3));
    Set<String> expectedReturn = new HashSet<String>(Arrays.asList("I", "III"));
    Set<String> actualReturn = new HashSet<String>(Maps.map(m, domain));
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testMap1() {
    Map <Number,String> m = Maps.toMap(new Object[] {new Integer(1), "I", new Integer(2), "II", new Integer(3), "III"});
    Iterable<Integer> domain = new HashSet<Integer>(Arrays.asList(1, 3));
    Set<String> expectedReturn = new HashSet<String>(Arrays.asList("I", "III"));
    Iterable<String> actualReturn = Maps.map(m, domain);
    Iterator<String> i = actualReturn.iterator();
    assertTrue(expectedReturn.contains(i.next()));
    assertTrue(expectedReturn.contains(i.next()));
    assertFalse(i.hasNext());
  }

  public void testMap2() {
    Map <Number,String> m = Maps.toMap(new Object[] {new Integer(1), "I", new Integer(2), "II", new Integer(3), "III"});
    Iterator<Integer> domain = Arrays.asList(1, 3).iterator();
    List<String> expectedReturn = Arrays.asList("I", "III");
    Iterator<String> actualReturn = Maps.map(m, domain);
    assertEquals("I", actualReturn.next());
    assertEquals("III", actualReturn.next());
    assertFalse(actualReturn.hasNext());
  }

  public void testMap3() {
    Map <Number,String> m = Maps.toMap(new Object[] {new Integer(1), "I", new Integer(2), "II", new Integer(3), "III"});
    List<Integer> domain = Arrays.asList(1, 3);
    List<String> expectedReturn = Arrays.asList("I", "III");
    List<String> actualReturn = Maps.map(m, domain);
    assertEquals("return value", expectedReturn, new ArrayList<String>(actualReturn));
  }

  public void testResolve1() {
    Map <Number,String> m = Maps.toMap(new Object[] {new Integer(1), "odd", new Integer(2), "even", new Integer(3), "odd", new Integer(-3), "odd"});
    Set<Number> expectedReturn = new HashSet<Number>(Arrays.asList(1, 3, -3));
    Set<Number> actualReturn = Maps.resolveToSet(m, "odd");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testResolve2() {
    Map <Number,String> m = Maps.toMap(new Object[] {new Integer(1), "odd", new Integer(2), "even", new Integer(3), "odd", new Integer(-3), "odd"});
    Set<Number> expectedReturn = new HashSet<Number>();
    Set<Number> actualReturn = Maps.resolveToSet(m, "queer");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRestrict() {
    Map <Number,String> m = Maps.toMap(new Object[] {new Integer(1), "I", new Integer(2), "II", new Integer(3), "III"});
    Collection<Integer> keys = Arrays.asList(1, 3);
    Map<Number,String> expectedReturn = Maps.toMap(new Object[] {new Integer(1), "I", new Integer(3), "III"});
    Map<Number,String> actualReturn = Maps.restrict(m, keys);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRestrict1() {
    Map <Number,String> m = Maps.toMap(new Object[] {new Integer(1), "I", new Integer(2), "II", new Integer(3), "III"});
    Set<Integer> keys = new HashSet<Integer>(Arrays.asList(1, 3));
    Map<Number,String> expectedReturn = Maps.toMap(new Object[] {new Integer(1), "I", new Integer(3), "III"});
    Map<Number,String> actualReturn = Maps.restrict(m, keys);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRevert() {
    Map <Number,String> m =
        Maps.toMap(new Object[] {new Integer(1), "odd", new Integer(2), "even", new Integer(3), "odd", new Integer(-3), "odd"});
    Map<String,Set<Number>> expectedReturn = new HashMap<String,Set<Number>>();
    expectedReturn.put("odd", new HashSet<Number>(Arrays.asList(1,3,-3)));
    expectedReturn.put("even", new HashSet<Number>(Arrays.asList(2)));
    Map actualReturn = Maps.revert(m);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToMap() {
    Entry<String,Number>[] pairs = (Entry<String,Number>[]) new Entry[] {new Pair<String,Number>("tizenegy", 11), new Pair<String,Number>("nihyaku", 200)};
    Map<String,Number> expectedReturn = new HashMap<String,Number>();
    expectedReturn.put("tizenegy", 11);
    expectedReturn.put("nihyaku", 200);
    Map actualReturn = Maps.toMap(pairs);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToMap1() {
    Object[] pairs = {"trois", new Integer(3), "vier", new Integer(4)};
    Map<String,Number> expectedReturn = new HashMap<String,Number>();
    expectedReturn.put("vier", 4);
    expectedReturn.put("trois", 3);
    Map actualReturn = Maps.toMap(pairs);
    assertEquals("return value", expectedReturn, actualReturn);
   /**@todo fill in the test code*/
  }

  public void testToMap2() {
    Integer key = 7;
    String value = "sizim";
    Map<Integer,String> expectedReturn = new HashMap<Integer,String>();
    expectedReturn.put(7, "sizim");
    Map actualReturn = Maps.toMap(key, value);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToMap3() {
    Integer key1 = 7;
    String value1 = "sizim";
    Integer key2 = 2;
    String value2 = "dwa";
    Map<Integer,String> expectedReturn = new HashMap<Integer,String>();
    expectedReturn.put(key1, value1);
    expectedReturn.put(key2, value2);
    Map actualReturn = Maps.toMap(key1, value1, key2, value2);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToMap4() {
    Integer key1 = 1;
    String value1 = "jeden";
    Integer key2 = 2;
    String value2 = "dwa";
    Integer key3 = 3;
    String value3 = "trzy";
    Map<Integer,String> expectedReturn = new HashMap<Integer,String>();
    expectedReturn.put(key1, value1);
    expectedReturn.put(key2, value2);
    expectedReturn.put(key3, value3);

   Map actualReturn = Maps.toMap(key1, value1, key2, value2, key3, value3);
    assertEquals("return value", expectedReturn, actualReturn);
  }
}
