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
public class TestObjects extends TestCase {

  protected void setUp() throws Exception {
    super.setUp();
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  public void testEqual1() {
    Object x = null;
    Object y = null;
    boolean expectedReturn = true;
    boolean actualReturn = Objects.equal(x, y);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqual2() {
    Object x = null;
    Object y = "y";
    boolean expectedReturn = false;
    boolean actualReturn = Objects.equal(x, y);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testEqual3() {
    Object x = "x";
    Object y = null;
    boolean expectedReturn = false;
    boolean actualReturn = Objects.equal(x, y);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testEqual4() {
    Object x = "abc";
    Object y = "abc";
    boolean expectedReturn = true;
    boolean actualReturn = Objects.equal(x, y);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testListIndexOf1() {
    String[] array = {"a", "b", "c"};
    List<String> list = Arrays.asList(array);
    for (int i = 0; i < array.length; i++) {
      int fromIndex = 0;
      int expectedReturn = i;
      int actualReturn = Objects.indexOf(array[i], list, fromIndex);
      assertEquals("return value", expectedReturn, actualReturn);
    }
  }

  public void testListIndexOf2() {
    String[] array = {"a", "b", "c"};
    List<String> list = Arrays.asList(array);
    for (int i = 1; i < array.length; i++) {
      int fromIndex = 1;
      int expectedReturn = i;
      int actualReturn = Objects.indexOf(array[i], list, fromIndex);
      assertEquals("return value", expectedReturn, actualReturn);
    }
  }

  public void testListIndexOf3() {
    String what = "z";
    List<String> list = Arrays.asList("a", "b", "c");
    int fromIndex = 0;
    int expectedReturn = -1;
    int actualReturn = Objects.indexOf(what, list, fromIndex);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testListIndexOf4() {
    String what = "z";
    List<String> list = Collections.EMPTY_LIST;
    int fromIndex = 0;
    int expectedReturn = -1;
    int actualReturn = Objects.indexOf(what, list, fromIndex);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testArrayIndexOf1() {
    String[] array = {"a", "b", "c"};
    for (int i = 0; i < array.length; i++) {
      int fromIndex = 0;
      int expectedReturn = i;
      int actualReturn = Objects.indexOf(array[i], array, fromIndex);
      assertEquals("return value", expectedReturn, actualReturn);
    }
  }

  public void testArrayIndexOf2() {
    String[] array = {"a", "b", "c"};
    for (int i = 1; i < array.length; i++) {
      int fromIndex = 1;
      int expectedReturn = i;
      int actualReturn = Objects.indexOf(array[i], array, fromIndex);
      assertEquals("return value", expectedReturn, actualReturn);
    }
  }

  public void testArrayIndexOf3() {
    String what = "z";
    String[] array = {"a", "b", "c"};
    int fromIndex = 0;
    int expectedReturn = -1;
    int actualReturn = Objects.indexOf(what, array, fromIndex);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testArrayIndexOf4() {
    String what = "z";
    String[] array = {};
    int fromIndex = 0;
    int expectedReturn = -1;
    int actualReturn = Objects.indexOf(what, array, fromIndex);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmptyP1() {
    String data = "a";
    boolean expectedReturn = false;
    boolean actualReturn = Objects.isEmpty(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmptyP2() {
    String[] data = {"x"};
    boolean expectedReturn = false;
    boolean actualReturn = Objects.isEmpty(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmptyP3() {
    Collection<String> data = Arrays.asList("here");
    boolean expectedReturn = false;
    boolean actualReturn = Objects.isEmpty(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmptyN1() {
    Number data = null;
    boolean expectedReturn = true;
    boolean actualReturn = Objects.isEmpty(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmptyN2() {
    String[] data = {};
    boolean expectedReturn = true;
    boolean actualReturn = Objects.isEmpty(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmptyN3() {
    Collection<String> data = new HashSet<String>();
    boolean expectedReturn = true;
    boolean actualReturn = Objects.isEmpty(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmptyN4() {
    String data = "";
    boolean expectedReturn = true;
    boolean actualReturn = Objects.isEmpty(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testIsEmptyN5() {
    String data = "null";
    boolean expectedReturn = true;
    boolean actualReturn = Objects.isEmpty(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testOneOf() {
    String[] arglist = {null, null, "x", null, "y"};
    String expectedReturn = "x";
    String actualReturn = Objects.oneOf(arglist);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToSet() {
    String[] elements = {"a", "b", "c", "b"};
    Set<String> expectedReturn = new HashSet<String>(Arrays.asList("c", "b", "a"));
    Set actualReturn = Objects.toSet(elements);
    assertEquals("return value", expectedReturn, actualReturn);
  }
}
