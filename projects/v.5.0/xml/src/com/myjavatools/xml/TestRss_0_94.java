package com.myjavatools.xml;

import junit.framework.*;
import java.util.*;
import java.net.URL;
import java.io.File;

public class TestRss_0_94 extends TestCase {
  private Rss localSampleRss = null;
  private String outputFileName = "sample_rss_094_output.xml";

  protected void setUp() throws Exception {
    super.setUp();
    File source = new File("rss.v.0.93.xml");
    localSampleRss = new Rss(source);
  }

  protected void tearDown() throws Exception {
    localSampleRss = null;
    super.tearDown();
  }


  public static void assertEquals(String message, XmlData expected, XmlData actual) {
    if (expected != null || actual != null) {
      assertEquals(message + " - comparing types:", expected.getType(), actual.getType());
      if (!BasicXmlData.equal(expected.getValue(), actual.getValue())) {
        System.out.println("oops...");
      }
      assertEquals(message + " - comparing values:", expected.getValue(), actual.getValue());
      assertEquals(message + " - comparing attributes:", expected.getAttributes(), actual.getAttributes());
      assertEquals(message + " - comparing number of kids:", expected.getAllKids().size(), actual.getAllKids().size());
      Collection actualKids = actual.getAllKids();
      for (Iterator i = expected.getAllKids().iterator(); i.hasNext();) {
        XmlData element = (XmlData)i.next();
        boolean found = false;
        for (Iterator j = actualKids.iterator(); j.hasNext() && !found;) {
          found = element.equals(j.next());
        }
        assertTrue(message + " - kid " + element.getType() + " missing", found);
      }
//      assertEquals(message + " - comparing kids:", expected.getAllKids(), actual.getAllKids());
    }
    TestCase.assertEquals(message, expected, actual);
  }

  public void testGetDescription() {
    String expectedReturn ="A high-fidelity Grateful Dead song every day. This is where we're experimenting with enclosures on RSS news items that download when you're not using your computer. If it works (it will) it will be the end of the Click-And-Wait multimedia experience on the Internet.";
    String actualReturn = localSampleRss.getDescription();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetDocs() {
    String expectedReturn = "http://backend.userland.com/rss092";
    String actualReturn = localSampleRss.getDocs();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetImage() {
    Rss.Image expectedReturn = null;
    Rss.Image actualReturn = localSampleRss.getImage();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetItems() {
    Rss.Item item1 = new Rss.Item("It's been a few days since I added a song to the Grateful Dead channel. Now that there are all these new Radio users, many of whom are tuned into this channel (it's #16 on the hotlist of upstreaming Radio users, there's no way of knowing how many non-upstreaming users are subscribing, have to do something about this..). Anyway, tonight's song is a live version of Weather Report Suite from Dick's Picks Volume 7. It's wistful music. Of course a beautiful song, oft-quoted here on Scripting News. <i>A little change, the wind and rain.</i>");
    item1.setEnclosure("http://www.scripting.com/mp3s/weatherReportDicksPicsVol7.mp3",
                       "6182912", "audio/mpeg");
    item1.setExpirationDate("Sat, 29 Nov 2003 10:17:13 GMT");

    Rss.Item item2 = new Rss.Item("Kevin Drennan started a <a href=\"http://deadend.editthispage.com/\">Grateful Dead Weblog</a>. Hey it's cool, he even has a <a href=\"http://deadend.editthispage.com/directory/61\">directory</a>. <i>A Frontier 7 feature.</i>");
    item2.setExpirationDate("Mon, 29 Dec 2003 10:17:13 GMT");
    item2.setSource("http://scriptingnews.userland.com/xml/scriptingNews2.xml", "Scripting News");

    Collection actualReturn = localSampleRss.getItems();
    assertEquals(22, actualReturn.size());
    Rss.Item found1 = localSampleRss.findItemByDescription(item1.getDescription());
    assertEquals(item1, found1);
    assertEquals("Item1 by description", item1, localSampleRss.findItemByUrl(item1.getEnclosureUrl()));
    assertEquals("Item2 by description", item2, localSampleRss.findItemByDescription(item2.getDescription()));
    assertEquals("Item2 by url", item2, localSampleRss.findItemByUrl(item2.getSourceUrl()));
  }

  public void testGetLanguage() {
    String expectedReturn = null;
    String actualReturn = localSampleRss.getLanguage();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetLastBuildDate() {
    String expectedReturn = "Fri, 13 Apr 2001 19:23:02 GMT";
    String actualReturn = localSampleRss.getLastBuildDate();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetLink() {
    String expectedReturn = "http://www.scripting.com/blog/categories/gratefulDead.html";
    String actualReturn = localSampleRss.getLink();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetManagingEditor() {
    String expectedReturn = "dave@userland.com (Dave Winer)";
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
    Rss.TextInput expectedReturn = null;
    Rss.TextInput actualReturn = localSampleRss.getTextInput();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetTitle() {
    String expectedReturn = "Dave Winer: Grateful Dead";
    String actualReturn = localSampleRss.getTitle();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetVersion() {
    String expectedReturn = "0.93";
    String actualReturn = localSampleRss.getOriginalVersion();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetWebMaster() {
    String expectedReturn = "dave@userland.com (Dave Winer)";
    String actualReturn = localSampleRss.getWebMaster();
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
