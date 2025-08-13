package com.myjavatools.xml;

import junit.framework.*;
import java.util.*;
import java.net.URL;
import java.io.File;

public class TestRss_0_92 extends TestCase {
  private Rss localSampleRss = null;
  private Rss data_092 = null;
  private String outputFileName = "sample_rss_092_output.xml";

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

  public static void assertEquals(String message, XmlData expected, XmlData actual) {
    if (expected != null || actual != null) {
      assertEquals(message + " - comparing types:", expected.getType(), actual.getType());
      assertEquals(message + " - comparing values:", expected.getValue(), actual.getValue());
      assertEquals(message + " - comparing attributes:", expected.getAttributes(), actual.getAttributes());
      boolean result = expected.equals(actual);
      assertEquals(message + " - comparing kids:", expected.getAllKids(), actual.getAllKids());
    }
    TestCase.assertEquals(message, expected, actual);
  }

  protected void setUp() throws Exception {
    super.setUp();
    data_092 = new Rss(new URL("http://cyber.law.harvard.edu/blogs/gems/tech/sampleRss092.xml"));
    File source = new File("rss.v.0.92.xml");
    localSampleRss = new Rss(source);
  }

  protected void tearDown() throws Exception {
    localSampleRss = null;
    super.tearDown();
  }


  public void testGetDescription() {
    String expectedReturn ="A high-fidelity Grateful Dead song every day. This is where we're experimenting with enclosures on RSS news items that download when you're not using your computer. If it works (it will) it will be the end of the Click-And-Wait multimedia experience on the Internet.";
    String actualReturn = data_092.getDescription();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetDocs() {
    String expectedReturn = "http://backend.userland.com/rss092";
    String actualReturn = data_092.getDocs();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetImage() {
    Rss.Image expectedReturn = null;
    Rss.Image actualReturn = data_092.getImage();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetItems() {
    Rss.Item item1 = new Rss.Item("It's been a few days since I added a song to the Grateful Dead channel. Now that there are all these new Radio users, many of whom are tuned into this channel (it's #16 on the hotlist of upstreaming Radio users, there's no way of knowing how many non-upstreaming users are subscribing, have to do something about this..). Anyway, tonight's song is a live version of Weather Report Suite from Dick's Picks Volume 7. It's wistful music. Of course a beautiful song, oft-quoted here on Scripting News. <i>A little change, the wind and rain.</i>");
    item1.setEnclosure("http://www.scripting.com/mp3s/weatherReportDicksPicsVol7.mp3",
                       "6182912", "audio/mpeg");

    Rss.Item item2 = new Rss.Item("Kevin Drennan started a <a href=\"http://deadend.editthispage.com/\">Grateful Dead Weblog</a>. Hey it's cool, he even has a <a href=\"http://deadend.editthispage.com/directory/61\">directory</a>. <i>A Frontier 7 feature.</i>");

    item2.setSource("http://scriptingnews.userland.com/xml/scriptingNews2.xml", "Scripting News");

    Collection actualReturn = data_092.getItems();
    assertEquals(22, actualReturn.size());
    assertEquals(item1, data_092.findItemByDescription(item1.getDescription()));
    assertEquals(item1, data_092.findItemByUrl(item1.getEnclosureUrl()));
    assertEquals(item2, data_092.findItemByDescription(item2.getDescription()));
    assertEquals(item2, data_092.findItemByUrl(item2.getSourceUrl()));
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
    String actualReturn = data_092.getManagingEditor();
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
    String expectedReturn = "0.92";
    String actualReturn = data_092.getOriginalVersion();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetWebMaster() {
    String expectedReturn = "dave@userland.com (Dave Winer)";
    String actualReturn = data_092.getWebMaster();
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
