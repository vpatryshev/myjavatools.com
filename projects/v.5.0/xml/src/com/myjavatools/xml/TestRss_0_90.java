package com.myjavatools.xml;

import junit.framework.*;
import java.util.*;
import java.io.File;
import java.io.*;

public class TestRss_0_90 extends TestCase {
  private Rss localSampleRss = null;
  private String outputFileName = "sample_rss_090_output.xml";

  protected void setUp() throws Exception {
    super.setUp();
    File source = new File("rss.v.0.90.xml");
    Thread t =
    new Thread() {
      public void run() {
        try {
          Thread.currentThread().sleep(1000);
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
        }
        System.out.println("I am still running");
      }
    };
    t.run();
    System.out.println("See the output from another thread");
    t.join();
    localSampleRss = new Rss(source);
  }

  protected void tearDown() throws Exception {
    localSampleRss = null;
    super.tearDown();
  }

  public void testGetCopyright() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getCopyright();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetDescription() {
    String expectedReturn ="the Mozilla Organization web site";
    String actualReturn = localSampleRss.getDescription();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetDocs() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getDocs();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetImage() {
    Rss.Image expectedReturn = new Rss.Image("Mozilla", "http://www.mozilla.org/images/logo.gif", "http://www.mozilla.org");
    Rss.Image actualReturn = localSampleRss.getImage();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetItems() {
    Rss.Item item1 = new Rss.Item("New Status Updates",
                                  "http://www.mozilla.org/status/");
    Collection actualReturn = localSampleRss.getItems();
    assertEquals(1, actualReturn.size());
    assertEquals(item1, localSampleRss.getItem(item1.getTitle()));
  }

  public void testGetLink() {
    String expectedReturn = "http://www.mozilla.org";
    String actualReturn = localSampleRss.getLink();
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
    String expectedReturn = "Mozilla Dot Org";
    String actualReturn = localSampleRss.getTitle();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetVersion() {
    String expectedReturn = "0.90";
    String actualReturn = localSampleRss.getOriginalVersion();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testSave() throws IOException, FileNotFoundException, InstantiationException {
//    try {
      localSampleRss.save(outputFileName);
      Rss another = new Rss(new File(outputFileName));
      assertEquals("must be equal by content, version does not matter",
                   localSampleRss, another);
//    }
//    catch (Exception ex) {
//      ex.printStackTrace();
//      fail("Got exception" + ex);
//    }
  }
}
