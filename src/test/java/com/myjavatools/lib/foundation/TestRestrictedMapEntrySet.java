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
public class TestRestrictedMapEntrySet extends TestCase {
  private RestrictedMapEntrySet restrictedMapEntrySet = null;

  protected void setUp() throws Exception {
    super.setUp();
    Map<String,String> map = Maps.toMap("one", "1", "two", "2", "three", "3");
    restrictedMapEntrySet = new RestrictedMapEntrySet<String,String>(map, java.util.Arrays.asList("two", "four"));
  }

  protected void tearDown() throws Exception {
    restrictedMapEntrySet = null;
    super.tearDown();
  }

  public void testIsValidKey() {
    assertFalse("return value for 'one'", restrictedMapEntrySet.isValidKey("one"));
    assertTrue("return value for 'two'", restrictedMapEntrySet.isValidKey("two"));
    assertFalse("return value for 'three'", restrictedMapEntrySet.isValidKey("three"));
    assertFalse("return value for 'four'", restrictedMapEntrySet.isValidKey("four"));
  }

  public void testSize() {
    int expectedReturn = 1;
    int actualReturn = restrictedMapEntrySet.size();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRestrictedMapEntrySet() {
    assertTrue(restrictedMapEntrySet.contains(new Pair<String,String>("two", "2")));
    assertFalse(restrictedMapEntrySet.contains(new Pair<String,String>("one", "1")));
  }

}
