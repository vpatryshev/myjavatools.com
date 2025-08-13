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
public class TestFunction2 extends TestCase {
  private Function2<Number,String,String> function2 = null;

  protected void setUp() throws Exception {
    super.setUp();
    function2 = new Function2<Number,String,String>() {
      public String apply(Number n, String unit) {
        return unit + "s: " + n;
      }
    };
  }

  protected void tearDown() throws Exception {
    function2 = null;
    super.tearDown();
  }

  public void testApply() {
    Integer x = 5;
    String y = "Jackson";
    String expectedReturn = "Jacksons: 5";
    String actualReturn = function2.apply(x, y);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCompose() {
    Function<Float,Double> f = new Function<Float,Double>() {
      public Double apply(Float x) {
        return (double)x * x;
      }
    };

    Function<String,String> g = new Function<String,String>() {
      public String apply(String s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1);
      }
    };

    Function2<Number,String,String> h = function2;
    String expectedReturn = "Jacksons: 25.0";
    Function2<Float,String,String> composition = Function2.compose(f, g, h);
    String actualReturn = composition.apply(5.f, "jackson");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCompose1() {
    Function2<Number,String,String> f = function2;
    Function<String,String> g = new Function<String,String>() {
      public String apply(String s) {
        return s + ", I think.";
      }
    };

    String expectedReturn = "Stars: 1.0E15, I think.";
    Function2<Number,String,String> composition = function2.compose(f, g);
    String actualReturn = composition.apply(1e15, "Star");
    assertEquals("return value \"" + actualReturn + "\"", expectedReturn, actualReturn);
  }

  public void testCurry1() {
    Integer n = 42;
    Function<String,String> expected = new Function<String,String>() {
      public String apply(String s) {
        return s + "s: 42";
      }
    };
    Function<String,String> actual = function2.curry1(n);

    String test = "";
    for (int i = 0; i < 10; i++) {
      assertEquals(expected.apply(test), actual.apply(test));
      test += ('A' + i);
    }
  }

  public void testCurry2() {
    String s = "pig";
    Function<Number,String> expected = new Function<Number,String>() {
      public String apply(Number n) {
        return "pigs: " + n;
      }
    };
    Function<Number,String> actual = function2.curry2(s);

    for (int i = 0; i < 10; i++) {
      assertEquals(expected.apply(i), actual.apply(i));
    }
  }

  public void testForFunction() {
    Function<Map.Entry<Integer,Integer>,Integer> f =
        new Function<Map.Entry<Integer,Integer>,Integer>() {
      public Integer apply(Map.Entry<Integer, Integer> pair) {
        return pair.getKey() * pair.getValue();
      }
    };
    Function2<Integer,Integer,Integer> expectedReturn =
        new Function2<Integer,Integer,Integer>() {
      public Integer apply(Integer n, Integer m) {
        return n * m;
      }
    };
    Function2 actualReturn = function2.forFunction(f);


    for (int i = -10; i < 10; i++) {
      for (int j = -10; j < 10; j++) {
        assertEquals(expectedReturn.apply(i, j), actualReturn.apply(i, j));
      }
    }
  }

  public void testForMap() {
    Map<String, Map<String, String>> map = new HashMap<String, Map<String, String>> ();
    // Using Crazy Bob's contraption to avoid entia multiplicanda
    map.put("a", new HashMap<String,String>() {{
        put("b", "a and b");
        put("c", "a and c");
      }});
    map.put("b", new HashMap<String,String>() {{
        put("c", "b and c");
        put("d", "b and d");
      }});
    map.put("c", new HashMap<String,String>() {{
        put("d", "c and d");
        put("e", "c and e");
      }});

    final List<String> entries = Arrays.asList("a", "b", "c", "d", "e", "none of the above", "");

    Function2<String,String,String> expectedReturn = new Function2<String,String,String>() {
      public String apply(String s, String t) {
        int is = entries.indexOf(s);
        int it = entries.indexOf(t);
        return is < 3 && is >= 0 && it > is && it < is + 3 ? (s + " and " + t) : null;
      }
    };
    Function2<String,String,String> actualReturn = Function2.forMap(map);

    for (String s : entries) {
      for (String t : entries) {
        assertEquals("return value for " + s + " and " + t,
                     expectedReturn.apply(s, t),
                     actualReturn.apply(s, t));
      }
    }
  }

  public void testForMap1() {
    Map<String, Map<String, String>> map = new HashMap<String, Map<String, String>> ();
    // Using Crazy Bob's contraption to avoid entia multiplicanda
    map.put("a", new HashMap<String,String>() {{
        put("b", "a and b");
        put("c", "a and c");
      }});
    map.put("b", new HashMap<String,String>() {{
        put("c", "b and c");
        put("d", "b and d");
      }});
    map.put("c", new HashMap<String,String>() {{
        put("d", "c and d");
        put("e", "c and e");
      }});

    final List<String> entries = Arrays.asList("a", "b", "c", "d", "e", "none of the above", "");

    Function2<String,String,String> expectedReturn = new Function2<String,String,String>() {
      public String apply(String s, String t) {
        int is = entries.indexOf(s);
        int it = entries.indexOf(t);
        return is < 3 && is >= 0 && it > is && it < is + 3 ? (s + " and " + t) : "wrong answer";
      }
    };

    Function2<String,String,String> actualReturn = function2.forMap(map, "wrong answer");
    for (String s : entries) {
      for (String t : entries) {
        assertEquals("return value for " + s + " and " + t,
                     expectedReturn.apply(s, t),
                     actualReturn.apply(s, t));
      }
    }
  }

  public void testP1() {
    Function2<Integer,Integer,Integer> actualReturn = Function2.p1();
    for (int i = 0; i < 5; i++) {
      for (int j = 0; j < 5; j++) {
        assertEquals(new Integer(i), actualReturn.apply(i, j));
      }
    }
  }

  public void testP2() {
    Function2<Integer,Integer,Integer> actualReturn = Function2.p2();
    for (int i = 0; i < 5; i++) {
      for (int j = 0; j < 5; j++) {
        assertEquals(new Integer(j), actualReturn.apply(i, j));
      }
    }
  }

  public void testSwap() {
    Function2<String,Number,String> expectedReturn = new Function2<String,Number,String>() {
      public String apply(String unit, Number n) {
        return unit + "s: " + n;
      }
    };

    Function2<String,Number,String> actualReturn = function2.swap();
    List<String> units = Arrays.asList("pound", "mile", "gallon");

    for (String unit : units) {
      for (int i = 1; i < 10; i += 2) {
        assertEquals(expectedReturn.apply(unit, i), actualReturn.apply(unit, i));
      }
    }
  }

  public void testToFunction() {
    Function<Map.Entry<Number,String>,String> expectedReturn = new Function<Map.Entry<Number,String>,String>() {
      public String apply(Map.Entry<Number,String> pair) {
        return pair.getValue() + "s: " + pair.getKey();
      }
    };

    Function<Map.Entry<Number,String>,String> actualReturn = function2.toFunction();
    List<String> units = Arrays.asList("pound", "mile", "gallon");

    for (String unit : units) {
      for (int i = 1; i < 10; i += 2) {
        Map.Entry<Number,String> pair = new Pair<Number,String>(i, unit);
        assertEquals(expectedReturn.apply(pair), actualReturn.apply(pair));
      }
    }
  }

  public void testToMap() {
    Map<Integer,Map<String,String>> expected =
        new HashMap<Integer,Map<String,String>>() {{
      put(1, new HashMap<String,String>() {{
          put("horse", "horses: 1");
          put("pig",   "pigs: 1");
        }});
      put(2, new HashMap<String,String>() {{
          put("horse", "horses: 2");
          put("pig",   "pigs: 2");
        }});
        }};

    Map<Number,Map<String,String>> actual =
        function2.toMap(new HashSet<Integer>(java.util.Arrays.asList(2, 1)),
                        new HashSet<String>(java.util.Arrays.asList("pig", "horse")));

    assertEquals(expected, actual);
  }
}
