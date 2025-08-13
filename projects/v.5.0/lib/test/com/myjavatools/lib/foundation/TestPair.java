package com.myjavatools.lib.foundation;

import junit.framework.*;

public class TestPair extends TestCase {

  class Left {
    String value;
    public Left(String value) {
      this.value = value;
    }

    public int hashCode() {
      return value.hashCode();
    }

    public boolean equals(Object x) {
      return x != null && x instanceof Left && ((Left)x).value.equals(value);
    }
  }

  class Right {
    String value;
    public Right(String value) {
      this.value = value;
    }

    public int hashCode() {
      return value.hashCode();
    }

    public boolean equals(Object x) {
      return x != null && x instanceof Right && ((Right)x).value.equals(value);
    }
  }

  class Bad {
    public Bad() {}

    public boolean equals(Object x) {
      return x != null && x.equals(this);
    }
  }

  private Pair<Left,Right> pair = null;

  protected void setUp() throws Exception {
    super.setUp();
    /**@todo verify the constructors*/
    pair = new Pair<Left,Right>(new Left("hidari"), new Right("migi"));
  }

  protected void tearDown() throws Exception {
    pair = null;
    super.tearDown();
  }

  public void testEquals1() {
    Object x = null;
    boolean expectedReturn = false;
    boolean actualReturn = pair.equals(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEquals2() {
    Bad x = new Bad();
    boolean expectedReturn = false;
    boolean actualReturn = pair.equals(x);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEquals3() {
    Bad x = new Bad();
    boolean expectedReturn = false;
    boolean actualReturn = x.equals(pair);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEquals4() {
    Pair<Left,Right> x = new Pair<Left,Right>(new Left("hidari"), new Right("derecha"));
    boolean expectedReturn = false;
    boolean actualReturn = x.equals(pair);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEquals5() {
    Pair<Left,Right> x = new Pair<Left,Right>(new Left("links"), new Right("migi"));
    boolean expectedReturn = false;
    boolean actualReturn = x.equals(pair);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEquals6() {
    Pair<Left,Right> x = new Pair<Left,Right>(new Left("hidari"), new Right("migi"));
    boolean expectedReturn = true;
    boolean actualReturn = x.equals(pair);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetKey() {
    Left expectedReturn = new Left("hidari");
    Left actualReturn = pair.getKey();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetValue() {
    Right expectedReturn = new Right("migi");
    Right actualReturn = pair.getValue();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testHashCode() {
    int unexpectedReturn = new Pair<Right,Left>(pair.right(), pair.left()).hashCode();
    int actualReturn = pair.hashCode();
    assertFalse("must be different", unexpectedReturn == actualReturn);
  }

  public void testLeft() {
    Left expectedReturn = new Left("hidari");
    Left actualReturn = pair.left();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRight() {
    Right expectedReturn = new Right("migi");
    Right actualReturn = pair.right();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testSetValue() {
    Right value = new Right("rechts");
    try {
      Right actualReturn = pair.setValue(value);
      fail("should not do this");
    } catch (UnsupportedOperationException e) {
    }
  }

  public void testSwap() {
    Pair<Right,Left> expectedReturn = new Pair<Right,Left>(pair.right(), pair.left());
    Pair<Right,Left> actualReturn = pair.swap();
    assertEquals("return value", expectedReturn, actualReturn);
  }
}
