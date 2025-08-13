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
public class TestFunction extends TestCase {
  private Function<Number,String> f = null;

  protected void setUp() throws Exception {
    super.setUp();
    f = new Function<Number,String>() {
      public String apply(Number n) {
        return Integer.toHexString(n.intValue());
      }
    };
  }

  protected void tearDown() throws Exception {
    f = null;
    super.tearDown();
  }

  public void testApply() {
    Iterable<Integer> iterable = Arrays.asList(1, 16, 256);
    Iterable<String> actualReturn = f.apply(iterable);
    Iterator<String> i = actualReturn.iterator();
    assertEquals("1", i.next());
    assertEquals("10", i.next());
    assertEquals("100", i.next());
    assertFalse(i.hasNext());

    i = actualReturn.iterator();
    assertEquals("1", i.next());
    assertEquals("10", i.next());
    assertEquals("100", i.next());
    assertFalse(i.hasNext());
  }

  public void testApply1() {
    Iterator<Integer> iterator = Arrays.asList(1, 16, 256).iterator();
    Iterator<String> i = f.apply(iterator);
    assertEquals("1", i.next());
    assertEquals("10", i.next());
    assertEquals("100", i.next());
    assertFalse(i.hasNext());
  }

  public void testApply2() {
    List<Integer> domain = Arrays.asList(1, 16, 256);
    List<String> expectedReturn = Arrays.asList("1", "10", "100");
    List<String> actualReturn = f.apply(domain);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testApply3() {
    String expectedReturn = "ff";
    String actualReturn = f.apply(255);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCompose() {
    Function<Integer,Integer> g = new Function<Integer,Integer>() {
      public Integer apply(Integer n) {
        return n * n;
      }
    };
    Function<Integer,String> h = Function.compose(g, f);
    assertEquals("19", h.apply(5));
  }

  public void testCompose1() {
    Function<Integer,Integer> g = new Function<Integer,Integer>() {
      public Integer apply(Integer n) {
        return n * n;
      }
    };
    Function<Integer,String> h = f.compose(g);
    assertEquals("19", h.apply(5));
  }

  public void testForMap() {
    Map<Integer,Integer> map = new HashMap<Integer,Integer>();
    map.put(1, 1); map.put(2, 4); map.put(3, 9);
    Function<Integer,Integer> actualReturn = Function.forMap(map);
    assertEquals("return value", 9, actualReturn.apply(3));
    assertEquals("return value", null, actualReturn.apply(4));
  }

  public void testForMap1() {
    Map<Integer,Integer> map = new HashMap<Integer,Integer>();
    map.put(1, 1); map.put(2, 4); map.put(3, 9);
    Function<Integer,Integer> actualReturn = Function.forMap(map, 77);
    assertEquals("return value", 9, actualReturn.apply(3));
    assertEquals("return value", 77, actualReturn.apply(4));
  }

  public void testToMap() {
    Collection<Integer> keys = Arrays.asList(3,4,5,4,3);
    Map<Integer,String> expectedReturn = new HashMap<Integer,String>();
    expectedReturn.put(3, "3");
    expectedReturn.put(4, "4");
    expectedReturn.put(5, "5");
    Map<Number,String> actualReturn = f.toMap(keys);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToMap1() {
    Set<Integer> keys = new HashSet<Integer>(Arrays.asList(3,4,5));
    Map<Integer,String> expectedReturn = new HashMap<Integer,String>();
    expectedReturn.put(3, "3");
    expectedReturn.put(4, "4");
    expectedReturn.put(5, "5");
    Map actualReturn = f.toMap(keys);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testId() {
    Function<String,String> idString = Function.id();
    Function<Integer,Integer> idInteger = Function.id();
    Function<Integer,String> actual = idString.compose(f.compose(idInteger));
    for (int i = -2; i < 4; i++) {
      assertEquals(f.apply(i), actual.apply(i));
    }
  }
}
