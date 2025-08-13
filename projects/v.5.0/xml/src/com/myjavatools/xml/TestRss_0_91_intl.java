package com.myjavatools.xml;

import junit.framework.*;
import java.util.*;
import java.net.URL;
import java.io.File;

public class TestRss_0_91_intl extends TestCase {
  private Rss localSampleRss = null;
  private Rss data = null;
  private String outputFileName = "sample_rss_091_intl_output.xml";

  public static void assertEquals(String message, char[] expectedArray, char[] actualArray) {
    if (expectedArray == null) {
      assertNull(message + ": actual must be null", actualArray);
    }
    assertNotNull(message + ": actual must not be null", actualArray);

    String errorMsg = expectedArray.length == actualArray.length ? null :
                       message + " - expected length: " + expectedArray.length +
                       ", actual: " + actualArray.length;

    for (int i = 0; i < Math.min(expectedArray.length, actualArray.length); i++) {
      assertEquals(message + ": #" + i, expectedArray[i], actualArray[i]);
    }

    if (errorMsg != null) {
      fail(errorMsg);
    }
  }

  public static void assertEquals(String message, String expected, String actual) {
    if (expected == null || actual == null) {
      TestCase.assertEquals(message, expected, actual);
    } else {
      assertEquals(message, expected.toCharArray(), actual.toCharArray());
    }
  }

  public static void assertEquals(String message,
                                  List list1,
                                  List list2) {
    assertEquals(message + ", size: ", list1.size(), list2.size());
    for (int i = 0; i < list1.size(); i++) {
      assertEquals(message + " [" + i + "]",
                   list1.get(i), list2.get(i));
    }
  }

  public static void assertEquals(String message, XmlData expected, XmlData actual) {
    if (expected != null || actual != null) {
      assertEquals(message + " - comparing types:", expected.getType(), actual.getType());
      assertEquals(message + " - comparing values:", expected.getValue(), actual.getValue());
      assertEquals(message + " - comparing attributes:", expected.getAttributes(), actual.getAttributes());
      boolean result1 = expected.equals(actual);
      boolean result2 = expected.getAllKids().equals(actual.getAllKids());
      assertEquals(message + " - comparing kids:", expected.getAllKids(), actual.getAllKids());
    }
    TestCase.assertEquals(message, expected, actual);
  }

  protected void setUp() throws Exception {
    super.setUp();
    data = new Rss(new URL("http://www.zdnet.fr/feeds/rss/techupdate/"));
    File source = new File("rss.v.0.91.intl.xml");
    localSampleRss = new Rss(source);
  }

  protected void tearDown() throws Exception {
    localSampleRss = null;
    super.tearDown();
  }


  public void testGetDescription() {
    String expectedReturn ="Décisions IT - Solutions et management de projets.";
    String actualReturn = data.getDescription();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetLanguage() {
    String expectedReturn = "fr";
    String actualReturn = localSampleRss.getLanguage();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetLink() {
    String expectedReturn = "http://www.zdnet.fr/techupdate/?rss";
    String actualReturn = localSampleRss.getLink();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetPubDate() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getPubDate();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetRating() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getRating();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetSkipDays() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getSkipDays();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetSkipHours() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getSkipHours();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetTextInput() {
    Rss.TextInput expectedReturn = null;
    Rss.TextInput actualReturn = localSampleRss.getTextInput();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetTitle() {
    String expectedReturn = "Décisions IT - ZDNet.fr";
    String actualReturn = localSampleRss.getTitle();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetVersion() {
    String expectedReturn = "0.91";
    String actualReturn = data.getOriginalVersion();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testSave() {
    try {
      localSampleRss.save(outputFileName);
      Rss another = new Rss(new File(outputFileName));
      assertEquals("must be equal by content, version does not matter",
                   localSampleRss, another);
    }
    catch (Exception ex) {
      fail("Got exception" + ex);
    }
  }
}
