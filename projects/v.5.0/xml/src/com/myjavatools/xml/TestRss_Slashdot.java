package com.myjavatools.xml;

import junit.framework.*;
import java.util.*;
import java.net.URL;
import java.io.File;

public class TestRss_Slashdot extends TestCase {
  private Rss localSampleRss = null;
  private String outputFileName = "sample_rss_slashdot_output.xml";

  protected void setUp() throws Exception {
    super.setUp();
    /**@todo verify the constructors*/
    File source = new File("slashdot.rss.xml");
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
    String expectedReturn ="News for nerds, stuff that matters";
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
    Rss.Image expectedReturn = new Rss.Image("Slashdot: ", null,
                                             "http://images.slashdot.org/topics/topicslashdot.gif",
                                             "http://slashdot.org/", "31", "88");
    Rss.Image actualReturn = localSampleRss.getImage();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetItems() {
    Rss.Item item1 = new Rss.Item("A Flying Leap for Cars?",
                                  "http://slashdot.org/article.pl?sid=04/08/26/1319215",
                                  "pillageplunder writes \"Businessweek has a story about flying cars and how they could be an actual viable thing in less than 10 years. First flying taxis, then, like the Jetsons, personal flying cars. Several are already on the board, with Honda and Toyota already having prototypes of small flying devices. Even General Electric is getting in on the deal, developing a small jet engine for Honda. So...would you buy one?\"",
                                  "michael", "2004-08-26T14:56:00+00:00", "tech", null);
    item1.addKid(new BasicXmlData("slash:section", "mainpage"));
    item1.addKid(new BasicXmlData("slash:department", "RSN"));
    item1.addKid(new BasicXmlData("slash:comments", "94"));
    item1.addKid(new BasicXmlData("slash:hitparade", "94,90,71,37,13,5,1"));
    Collection actualReturn = localSampleRss.getItems();
    assertEquals(10, actualReturn.size());
    Rss.Item item1a = localSampleRss.getItem(item1.getTitle());
    assertEquals(item1.getDescription(), item1a.getDescription());
    assertEquals(item1, item1a);
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
    String expectedReturn = "http://slashdot.org/";
    String actualReturn = localSampleRss.getLink();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetManagingEditor() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getManagingEditor();
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
    Rss.TextInput expectedReturn = new Rss.TextInput("Search Slashdot", "Search Slashdot stories", "query", "http://slashdot.org/search.pl");
    Rss.TextInput actualReturn = localSampleRss.getTextInput();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetTitle() {
    String expectedReturn = "Slashdot: ";
    String actualReturn = localSampleRss.getTitle();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetVersion() {
    String expectedReturn = "1.0";
    String actualReturn = localSampleRss.getOriginalVersion();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetWebMaster() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getWebMaster();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testSave() {
    try {
      localSampleRss.save(outputFileName);
      Rss another = new Rss(new File(outputFileName));
      another.debug(true);
      assertEquals("must be equal by content, version does not matter",
                   localSampleRss, another);
      another.debug(false);
    }
    catch (Exception ex) {
      fail("Got exception" + ex);
    }
  }
}
