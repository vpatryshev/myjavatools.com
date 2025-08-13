package com.myjavatools.lib.foundation;

import java.util.Collection;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class j5t {
  public static <T> T[] array(T... elements) {
    return elements;
  }
  public static <T> Collection<T> collect(T... elements) {
    return Arrays.<T>asList(elements);
  }

  public static <T> Collection<Collection<T>> collect(Collection<T>... elements) {
    return Arrays.<Collection<T>>asList(elements);
  }

  public static void test1() {
//    String[] sa = array("a", "bc", "def");
//    Collection<String> sc = collect("a", "bc", "def");
//    Collection<String>[] sca = array(sc, sc);
    Collection<String>sc = new ArrayList<String>();
//    Collection<Date>dc = collect(new Date(), new Date());
    Collection<Collection<String>> scc = collect(sc, sc);
    Collection<Integer> il = Arrays.<Integer>asList(1, 2, 3);
    Arrays.<Collection<Integer>>asList(il);
//    Object[] x = new String[] {"a"};
//    x[0] = 1;

    List<? extends Class<? extends Number>> classes =
        Arrays.<Class<? extends Number>>asList(Integer.class, Double.class);
  }

  public static void test2() {
    String[] sa = array("a", "bc", "def");
    Collection<String> sc = null;//collect("a", "bc", "def");
//    Integer[] ia = array(1, 2, 3);
//    Collection<Integer> ic = collect(2, 3, 5, 7);
  }

}
