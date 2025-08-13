package com.myjavatools.lib;

import junit.framework.*;
import static com.myjavatools.lib.human.Logical.*;
import com.myjavatools.lib.foundation.*;
import com.myjavatools.lib.human.Predicate;

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
 * @version 1.5
 */
public class TestLogical extends TestCase {

  protected void setUp() throws Exception {
    super.setUp();
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  public void testAnd() {
    assertEquals("return value", LogicalConstant.TRUE,  and(LogicalConstant.TRUE, LogicalConstant.TRUE));
    assertEquals("return value", LogicalConstant.UNDEF, and(LogicalConstant.UNDEF, LogicalConstant.TRUE));
    assertEquals("return value", LogicalConstant.UNDEF, and(LogicalConstant.TRUE, LogicalConstant.UNDEF));
    assertEquals("return value", LogicalConstant.UNDEF, and(LogicalConstant.UNDEF, LogicalConstant.UNDEF));
    assertEquals("return value", LogicalConstant.FALSE, and(LogicalConstant.TRUE, LogicalConstant.FALSE));
    assertEquals("return value", LogicalConstant.FALSE, and(LogicalConstant.FALSE, LogicalConstant.TRUE));
    assertEquals("return value", LogicalConstant.FALSE, and(LogicalConstant.UNDEF, LogicalConstant.FALSE));
    assertEquals("return value", LogicalConstant.FALSE, and(LogicalConstant.FALSE, LogicalConstant.UNDEF));
    assertEquals("return value", LogicalConstant.FALSE, and(LogicalConstant.FALSE, LogicalConstant.FALSE));
  }

  static final LogicalConstant[] logarray =
      new LogicalConstant[] {
        LogicalConstant.TRUE,
        LogicalConstant.UNDEF,
        LogicalConstant.FALSE
      };

// Wow! Now we get what in c++ is called a function returning a pointer to a function!

  public Predicate<Integer> p(int i) {
    final int shift = i;

    return new Predicate<Integer>() {
      public LogicalConstant apply(Integer x) {
        int idx = (x.intValue() + shift) % 3;
        return logarray[idx];
      }
    };
  }
/*
  public void testAnd1() {
    Predicate<Integer> p00 = and(p(0), p(0));
    assertEquals("return value", LogicalConstant.TRUE,  p00.apply(0));
    assertEquals("return value", LogicalConstant.UNDEF, p00.apply(1));
    assertEquals("return value", LogicalConstant.FALSE, p00.apply(2));
    Predicate<Integer> p01 = and(p(0), p(1));
    assertEquals("return value", LogicalConstant.UNDEF, p01.apply(0));
    assertEquals("return value", LogicalConstant.FALSE, p01.apply(1));
    assertEquals("return value", LogicalConstant.FALSE, p01.apply(2));
    Predicate<Integer> p02 = and(p(0), p(2));
    assertEquals("return value", LogicalConstant.FALSE, p02.apply(0));
    assertEquals("return value", LogicalConstant.UNDEF, p02.apply(1));
    assertEquals("return value", LogicalConstant.FALSE, p02.apply(2));
    Predicate<Integer> p12 = and(p(1), p(2));
    assertEquals("return value", LogicalConstant.FALSE, p12.apply(0));
    assertEquals("return value", LogicalConstant.FALSE, p12.apply(1));
    assertEquals("return value", LogicalConstant.UNDEF, p12.apply(2));
  }

  public void testNot() {
    assertEquals("return value", LogicalConstant.FALSE, not(LogicalConstant.TRUE));
    assertEquals("return value", LogicalConstant.FALSE, not(LogicalConstant.UNDEF));
    assertEquals("return value", LogicalConstant.TRUE,  not(LogicalConstant.FALSE));
  }

  public void testNot1() {
    Predicate<Integer> pnot0 = not(p(0));
    assertEquals("return value", LogicalConstant.FALSE, pnot0.apply(0));
    assertEquals("return value", LogicalConstant.FALSE, pnot0.apply(1));
    assertEquals("return value", LogicalConstant.TRUE,  pnot0.apply(2));
  }

  public void testOr() {
    assertEquals("return value", LogicalConstant.TRUE,  or(LogicalConstant.TRUE, LogicalConstant.TRUE));
    assertEquals("return value", LogicalConstant.TRUE, or(LogicalConstant.UNDEF, LogicalConstant.TRUE));
    assertEquals("return value", LogicalConstant.TRUE, or(LogicalConstant.TRUE, LogicalConstant.UNDEF));
    assertEquals("return value", LogicalConstant.UNDEF, or(LogicalConstant.UNDEF, LogicalConstant.UNDEF));
    assertEquals("return value", LogicalConstant.TRUE, or(LogicalConstant.TRUE, LogicalConstant.FALSE));
    assertEquals("return value", LogicalConstant.TRUE, or(LogicalConstant.FALSE, LogicalConstant.TRUE));
    assertEquals("return value", LogicalConstant.UNDEF, or(LogicalConstant.UNDEF, LogicalConstant.FALSE));
    assertEquals("return value", LogicalConstant.UNDEF, or(LogicalConstant.FALSE, LogicalConstant.UNDEF));
    assertEquals("return value", LogicalConstant.FALSE, or(LogicalConstant.FALSE, LogicalConstant.FALSE));
  }

  public void testOr1() {
    Predicate<Integer> p00 = or(p(0), p(0));
    assertEquals("return value", LogicalConstant.TRUE,  p00.apply(0));
    assertEquals("return value", LogicalConstant.UNDEF, p00.apply(1));
    assertEquals("return value", LogicalConstant.FALSE, p00.apply(2));
    Predicate<Integer> p01 = or(p(0), p(1));
    assertEquals("return value", LogicalConstant.TRUE,  p01.apply(0));
    assertEquals("return value", LogicalConstant.UNDEF, p01.apply(1));
    assertEquals("return value", LogicalConstant.TRUE,  p01.apply(2));
    Predicate<Integer> p02 = or(p(0), p(2));
    assertEquals("return value", LogicalConstant.TRUE,  p02.apply(0));
    assertEquals("return value", LogicalConstant.TRUE,  p02.apply(1));
    assertEquals("return value", LogicalConstant.UNDEF, p02.apply(2));
    Predicate<Integer> p12 = or(p(1), p(2));
    assertEquals("return value", LogicalConstant.UNDEF, p12.apply(0));
    assertEquals("return value", LogicalConstant.TRUE,  p12.apply(1));
    assertEquals("return value", LogicalConstant.TRUE,  p12.apply(2));
  }*/
}
