package com.myjavatools.lib.foundation;

import junit.framework.*;
import java.util.*;
import static com.myjavatools.lib.foundation.Iterators.*;

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
 * @version 5.0
 */
public class TestIterators extends TestCase {
  private Iterators iterators = null;

  protected void setUp() throws Exception {
    super.setUp();
    iterators = new Iterators();
  }

  protected void tearDown() throws Exception {
    iterators = null;
    super.tearDown();
  }

  private Integer[] getIntegers(int from, int to) {
    Integer[] result = new Integer[to - from + 1];
    for (int i = 0; i < result.length; i++) {
      result[i] = i + from;
    }
    return result;
  }

  private Collection<Integer> getIntC(int from, int to) {
    return Arrays.asList(getIntegers(from, to));
  }

  private void checkIntIterator(Iterator<Integer>iterator, int from, int to) {
    int i;
    for (i = from; i < to; i++) {
      assertTrue("must have", iterator.hasNext());
      assertEquals(new Integer(i), iterator.next());
    }
    assertFalse("must be enough", iterator.hasNext());
    try{
      iterator.next();
      fail("should have thrown an exception");
    } catch (NoSuchElementException e) {
    }
  }

  private void checkIntIterator(Iterator<Integer>iterator, int from, int to, int step) {
    int i;
    System.out.println("" + from + ".." + to + " (" + step + ")");
    for (i = from; (to - i) * step > 0; i+= step) {
      System.out.print(i + ".. ");
      assertTrue("must have " + i, iterator.hasNext());
      assertEquals(new Integer(i), iterator.next());
    }
    System.out.println();
    assertFalse("must be enough", iterator.hasNext());
    try{
      iterator.next();
      fail("should have thrown an exception");
    } catch (NoSuchElementException e) {
    }
  }

  private void checkDoubleIterator(Iterator<Double>iterator, double from, double to, double step) {

    for (int i = 0; step * (to - from - i * step) > 0; i++) {
      assertTrue("must have", iterator.hasNext());
      assertTrue(Math.abs(from + i * step - iterator.next()) < 0.000001);
    }
    assertFalse("must be enough", iterator.hasNext());
    try{
      iterator.next();
      fail("should have thrown an exception");
    } catch (NoSuchElementException e) {
    }
  }

  public void testCat() {
    Iterable<Integer> actualReturn = Iterators.cat((Collection<Integer>)getIntC(0, 9),
                                                          (Collection<Integer>)getIntC(10, 19),
                                                          (Collection<Integer>)getIntC(20,30));
    checkIntIterator(actualReturn.iterator(), 0, 31);
  }

  public void testCat1() {
    Iterator<Integer> i1 = RangeList.rangeList(2, 6).iterator();
    Iterator<Integer> i2 = RangeList.rangeList(6, 20).iterator();
    Iterator<Integer> i3 = RangeList.rangeList(20,31).iterator();

    List<Iterator<Integer>> l = Arrays.asList(i1, i2, i3);

//    Iterator<Iterator<Integer>> outerIterator = iterators.asList(i1, i2, i3).iterator();
//    checkIntIterator(iterators.cat(outerIterator), 2, 31);
    checkIntIterator(iterators.cat(i1,i2,i3), 2, 31);
  }

  public <X extends Collection<? extends CharSequence>, Y extends CharSequence> void t() {
    Collection<CharSequence> c = null;
    Collection<String> s = null;
    Collection<? extends CharSequence> c1 = null;
    Collection<Y> cy = null;
    X cx = null;
    c1 = c;
    c1 = s;
    c1 = cy;
    c1 = cx;
  }

  public void testCatIterables() {
    Collection<Integer> i1 = getIntC(1, 7);
    Collection<Integer> i2 = getIntC(8, 19);
    Collection<Integer> i3 = getIntC(20,31);

    List<Collection<Integer>> l = Arrays.asList(i1, i2, i3);
    Iterable<Collection<Integer>> i = l;
    Iterable<Integer>it = new CompoundIterable<Integer>(i);
    Iterable<Integer>it1 = Iterators.cat(i1, i2, i3);
    checkIntIterator(Iterators.cat(i1, i2, i3).iterator(), 1, 32);
    List<Collection<Integer>> ll = t(i1, i2, i3);
    String s = "ijk";

    List<String> l2 = t("ab", "cde", "fg", s);
    List<String> l3 = t("dx", "asweiuy", "asd");
    List<List<String>> lll = t(l2, l3);
  }

  private <X> List<X> t(X... e) {
    return Arrays.asList(e);
  }

  public void testGrep() {
    Filter<Integer> filter = new Filter<Integer>() {
      public boolean accept(Integer i) {
        return i % 3 == 0;
      }
    };
    Iterator<Integer> source = RangeList.rangeList(5, 15).iterator();
    Iterator<Integer> actualReturn = filter.filter(source);
    checkIntIterator(actualReturn, 6, 15, 3);
  }

  public void testList() {
    Iterable<Integer> actualReturn = RangeList.rangeList(7, 17);
    this.checkIntIterator(actualReturn.iterator(), 7, 17);
  }

  public void testMap() {
    Function<Integer, Double> function = new Function<Integer, Double>() {
      public Double apply(Integer i) {
        return 2.718 * i + 0.01;
      }
    };

    Iterator<Integer> iterator = RangeList.rangeList(1, 5).iterator();
    Iterator<Double> actualReturn = function.apply(iterator);
    checkDoubleIterator(actualReturn, 2.728, 2.718 * 5 + .01, 2.718);
  }

  public void testRangeList() {
    List<Double> actualReturn = RangeList.rangeList(314, 3.14, -17.3);
    assertTrue(actualReturn.size() > 17);
    checkDoubleIterator(actualReturn.iterator(), 314, 3.14, -17.3);
  }

  public void testRangeIterator1() {
    int from = 0;
    int step = -3;
    for (int to = 10; to > -110; to--) {
      Iterator<Integer> actualReturn = RangeList.rangeList(from, to, step).iterator();
      assertTrue("to " + to, (to >= from) != actualReturn.hasNext());
      checkIntIterator(actualReturn, from, to, step);
    }
  }

  public void testRangeIterator2() {
    int from = 0;
    int step = 7;
    for (int to = -4; to < 110; to++) {
      Iterator<Integer> actualReturn = RangeList.rangeList(from, to, step).iterator();
      assertTrue("to " + to, (to <= from) != actualReturn.hasNext());
      checkIntIterator(actualReturn, from, to, step);
    }
  }

  public void testChars() {
    String t = "this is the string";
    int idx = 0;
    for (char c : chars(t)) {
      assertEquals(t.charAt(idx++), c);
    }
  }

}
