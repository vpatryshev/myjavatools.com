package com.myjavatools.xml;

import junit.framework.*;
import java.util.*;
import java.net.URL;
import java.io.File;

public class TestRss_0_91 extends TestCase {
  private Rss localSampleRss = null;
  private Rss data_091 = null;
  private String outputFileName = "sample_rss_091_output.xml";

  protected void setUp() throws Exception {
    super.setUp();
    data_091 = new Rss(new URL("http://www.xml.com/cs/xml/query/q/19"));
    System.out.println("Title:\t" + data_091.getTitle());
    System.out.println("Webmaster:\t" + data_091.getWebMaster());
    System.out.println("Description:\t" + data_091.getDescription());
    for (Iterator i = data_091.getItems().iterator(); i.hasNext();) {
      Object o = i.next();
      Rss.Item item = (Rss.Item)o;
      System.out.println("  Item:\t" + item.getTitle());
      System.out.println("  Description:\t" + item.getDescription());
      System.out.println("  Link:\t" + item.getLink());
      System.out.println();
    }
    File source = new File("rss.v.0.91.xml");
    localSampleRss = new Rss(source);
  }

  protected void tearDown() throws Exception {
    localSampleRss = null;
    super.tearDown();
  }


  public void testGetCopyright() {
    String expectedReturn = "Copyright 2004, O'Reilly Media, Inc.";
    String actualReturn = data_091.getCopyright();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetDescription() {
    String expectedReturn ="XML.com features a rich mix of information and services for the XML community.";
    String actualReturn = data_091.getDescription();
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
    Rss.Image expectedReturn = null;
    Rss.Image actualReturn = localSampleRss.getImage();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetItems() {
    Rss.Item item1 = new Rss.Item("Normalizing XML, Part 2",
                                  "http://www.xml.com/pub/a/2002/12/04/normalizing.html",
                                  "In this second and final look at applying relational normalization techniques to W3C XML Schema data modeling, Will Provost discusses when not to normalize, the scope of uniqueness and the fourth and fifth normal forms.");
    Rss.Item item2 = new Rss.Item("The .NET Schema Object Model",
                                  "http://www.xml.com/pub/a/2002/12/04/som.html",
                                  "Priya Lakshminarayanan describes in detail the use of the .NET Schema Object Model for programmatic manipulation of W3C XML Schemas.");
    Rss.Item item3 = new Rss.Item("SVG's Past and Promising Future",
                                  "http://www.xml.com/pub/a/2002/12/04/svg.html",
                                  "In this month's SVG column, Antoine Quint looks back at SVG's journey through 2002 and looks forward to 2003.");
    Collection actualReturn = localSampleRss.getItems();
    assertEquals(3, actualReturn.size());
    assertEquals(item1, localSampleRss.getItem(item1.getTitle()));
    assertEquals(item2, localSampleRss.getItem(item2.getTitle()));
    assertEquals(item3, localSampleRss.getItem(item3.getTitle()));
  }

  public void testGetLanguage() {
    String expectedReturn = "en-us";
    String actualReturn = localSampleRss.getLanguage();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetLastBuildDate() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getLastBuildDate();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetLink() {
    String expectedReturn = "http://www.xml.com/";
    String actualReturn = localSampleRss.getLink();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetManagingEditor() {
    String expectedReturn = "edd@xml.com (Edd Dumbill)";
    String actualReturn = data_091.getManagingEditor();
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
    String expectedReturn = "XML.com";
    String actualReturn = localSampleRss.getTitle();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetVersion() {
    String expectedReturn = "0.91";
    String actualReturn = localSampleRss.getOriginalVersion();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetWebMaster() {
    String expectedReturn = "peter@xml.com (Peter Wiggin)";
    String actualReturn = data_091.getWebMaster();
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
