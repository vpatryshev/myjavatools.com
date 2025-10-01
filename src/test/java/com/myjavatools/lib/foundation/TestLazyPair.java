package com.myjavatools.lib.foundation;

import junit.framework.*;

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
public class TestLazyPair extends TestCase {
  private LazyPair<Integer,String> lazyPair = null;

  protected void setUp() throws Exception {
    super.setUp();
    lazyPair =
        new LazyPair<Integer,String>(420,
                                     new Function<Integer,String>() { public String apply(Integer n) { return "" + n; }});
  }

  protected void tearDown() throws Exception {
    lazyPair = null;
    super.tearDown();
  }

  public void testRight() {
    String expectedReturn = "420";
    String actualReturn = lazyPair.right();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqualsNegative1() {
    Object x = new Pair<Integer,String>(420, "421");
    boolean expectedReturn = false;
    boolean actualReturn = lazyPair.equals(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqualsNegative2() {
    Object x = new Pair<Integer,String>(421, "420");
    boolean expectedReturn = false;
    boolean actualReturn = lazyPair.equals(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqualsPositive() {
    Object x = new Pair<Integer,String>(420, "420");
    boolean expectedReturn = true;
    boolean actualReturn = lazyPair.equals(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetKey() {
    Integer expectedReturn = 420;
    Integer actualReturn = lazyPair.getKey();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetValue() {
    String expectedReturn = "420";
    String actualReturn = lazyPair.getValue();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testHashCode() {
    int expectedReturn = 67110;
    int actualReturn = lazyPair.hashCode();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testLeft() {
    Integer expectedReturn = 420;
    Integer actualReturn = lazyPair.left();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRight1() {
    String expectedReturn = "420";
    String actualReturn = lazyPair.right();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testSetValue() {
    String value = "42";
    try {
      lazyPair.setValue(value);
    } catch (Exception e) {
      assertEquals("Something wrong thrown", "java.lang.UnsupportedOperationException", e.toString());
      return;
    }
    fail("Oops... had to throw an exception");
  }

  public void testSwap() {
    Pair<String,Integer> expectedReturn = new Pair<String,Integer>("420", 420);
    Pair actualReturn = lazyPair.swap();
    assertEquals("return value", expectedReturn, actualReturn);
  }
}
