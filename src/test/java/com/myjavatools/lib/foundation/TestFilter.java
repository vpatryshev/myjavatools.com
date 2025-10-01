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
public class TestFilter extends TestCase {
  private Filter<String> filter = null;

  protected void setUp() throws Exception {
    super.setUp();
    filter = new Filter<String>() {
      public boolean accept(String s) {
        return s.startsWith("good");
      }
    };
  }

  protected void tearDown() throws Exception {
    filter = null;
    super.tearDown();
  }

  public void testAccept1() {
    String x = "good string";
    boolean expectedReturn = true;
    boolean actualReturn = filter.accept(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testAccept2() {
    String x = "bad string";
    boolean expectedReturn = false;
    boolean actualReturn = filter.accept(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testAccept3() {
    String x = "notgood string";
    boolean expectedReturn = false;
    boolean actualReturn = filter.accept(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testApply1() {
    String x = "good string";
    Boolean expectedReturn = Boolean.TRUE;
    Boolean actualReturn = filter.apply(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testApply2() {
    String x = "bad string";
    Boolean expectedReturn = Boolean.FALSE;
    Boolean actualReturn = filter.apply(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testFilter() {
    Iterable<String> iterable = Arrays.asList("good string", "bad stuff", "good stuff");
    Iterable<String> actualReturn = filter.filter(iterable);
    Iterator<String> i = actualReturn.iterator();
    assertEquals("good string", i.next());
    assertEquals("good stuff", i.next());
    assertFalse(i.hasNext());
  }

  public void testFilter1() {
    Iterator<String> source = Arrays.asList("good string", "bad stuff", "good stuff").iterator();
    Iterator<String> i = filter.filter(source);
    assertEquals("good string", i.next());
    assertEquals("good stuff", i.next());
    assertFalse(i.hasNext());
  }

  public void testFilter2() {
    Iterator<String> source = Arrays.asList("x1", "goodx2", "goodx3", "x4").iterator();
    Iterator<String> i = filter.filter(source);
    for (int k = 0; k < 10; k++) {
      assertTrue(i.hasNext());
    }
    assertEquals("goodx2", i.next());
    for (int k = 0; k < 10; k++) {
      assertTrue(i.hasNext());
    }
    assertEquals("goodx3", i.next());
    assertFalse(i.hasNext());
  }

  public void testFilter3() {
    List<String> baseList = new ArrayList<String>(
          Arrays.asList("x1", "goodx2", "goodx3", "goodx4", "x5"));
    Iterator<String> source = baseList.iterator();
    Iterator<String> i = filter.filter(source);
    assertEquals("goodx2", i.next());
    for (int k = 0; k < 10; k++) {
      assertTrue(i.hasNext());
    }
    assertEquals("goodx3", i.next());
    i.remove();
    for (int k = 0; k < 10; k++) {
      assertTrue(i.hasNext());
    }
    assertEquals("goodx4", i.next());
    assertFalse(i.hasNext());
    assertEquals(4, baseList.size());
  }

  public void testNot() {
    Iterable<String> iterable = Arrays.asList("good string", "bad stuff", "good stuff");
    Iterable<String> expectedReturn = Arrays.asList("bad stuff");
    Iterable<String> actualReturn = Filter.not(filter).filter(iterable);
    Iterator<String> i = actualReturn.iterator();
    assertEquals("bad stuff", i.next());
    assertFalse(i.hasNext());
  }

  public void testAnd() {
    Filter<String> anotherFilter = new Filter<String>() {
      public boolean accept(String s) {
        return s.contains("stuff");
      }
    };
    Iterable<String> iterable = Arrays.asList("good string", "bad stuff", "good stuff", "bad string");
    Iterable<String> actualReturn = Filter.or(filter, anotherFilter).filter(iterable);
    Iterator<String> i = actualReturn.iterator();
    assertEquals("good string", i.next());
    assertEquals("bad stuff", i.next());
    assertEquals("good stuff", i.next());
    assertFalse(i.hasNext());
  }

  public void testOr() {
    Filter<String> anotherFilter = new Filter<String>() {
      public boolean accept(String s) {
        return s.contains("stuff");
      }
    };
    Iterable<String> iterable = Arrays.asList("good string", "bad stuff", "good stuff", "bad string");
    Iterable<String> actualReturn = Filter.or(filter, anotherFilter).filter(iterable);
    Iterator<String> i = actualReturn.iterator();
    assertEquals("good string", i.next());
    assertEquals("bad stuff", i.next());
    assertEquals("good stuff", i.next());
    assertFalse(i.hasNext());
  }

  public void testToFilter() {
    Function<Double,Double> f = new Function<Double,Double>() {
      public Double apply(Double x) {
        return Math.sin(x);
      }
    };

    Iterable<Double> iterable = Arrays.asList(3.2, 1.8, 3.2, 0.1);
    Iterable<Double> expectedReturn = Arrays.asList(1.8, 0.1);
    Iterable<Double> actualReturn = Filter.toFilter(f).filter(iterable);
    Iterator<Double> i = actualReturn.iterator();
    // Note for programmers. Strictly speaking, you should not use equality
    // for doubles.
    assertEquals(1.8, i.next());
    assertEquals(0.1, i.next());
    assertFalse(i.hasNext());
  }
}
