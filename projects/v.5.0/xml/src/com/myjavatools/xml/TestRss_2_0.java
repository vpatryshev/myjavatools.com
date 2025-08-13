package com.myjavatools.xml;

import junit.framework.*;
import java.util.*;
import java.net.URL;
import java.io.File;

public class TestRss_2_0 extends TestCase {
  private Rss localSampleRss = null;
  private String outputFileName = "sample_rss_200_output.xml";

  protected void setUp() throws Exception {
    super.setUp();
//    remoteSampleRss = new Rss(new URL("http://www.xml.com/cs/xml/query/q/19"));
    File source = new File("rss.v.2.0.xml");
    localSampleRss = new Rss(source);
  }

  protected void tearDown() throws Exception {
    localSampleRss = null;
    super.tearDown();
  }

//  public void testGetCopyright() {
//    String expectedReturn = "Copyright 2004, O'Reilly Media, Inc.";
//    String actualReturn = remoteSampleRss.getCopyright();
//    assertEquals("return value", expectedReturn, actualReturn);
//    /**@todo fill in the test code*/
//  }

  public void testGetDescription() {
    String expectedReturn ="XML.com features a rich mix of information and services for the XML community.";
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
    Rss.Image expectedReturn = null;
    Rss.Image actualReturn = localSampleRss.getImage();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetItems() {
    Rss.Item item1 = new Rss.Item("Normalizing XML, Part 2",
                                  "http://www.xml.com/pub/a/2002/12/04/normalizing.html",
                                  "In this second and final look at applying relational normalization techniques to W3C XML Schema data modeling, Will Provost discusses when not to normalize, the scope of uniqueness and the fourth and fifth normal forms.",
                                  "Will Provost", "2002-12-04");
    Rss.Item item2 = new Rss.Item("The .NET Schema Object Model",
                                  "http://www.xml.com/pub/a/2002/12/04/som.html",
                                  "Priya Lakshminarayanan describes in detail the use of the .NET Schema Object Model for programmatic manipulation of W3C XML Schemas.",
                                  "Priya Lakshminarayanan", "2002-12-04");
    Rss.Item item3 = new Rss.Item("SVG's Past and Promising Future",
                                  "http://www.xml.com/pub/a/2002/12/04/svg.html",
                                  "In this month's SVG column, Antoine Quint looks back at SVG's journey through 2002 and looks forward to 2003.",
                                  "Antoine Quint", "2002-12-04");
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

//  public void testGetManagingEditor() {
//    String expectedReturn = "edd@xml.com (Edd Dumbill)";
//    String actualReturn = remoteSampleRss.getManagingEditor();
//    assertEquals("return value", expectedReturn, actualReturn);
//    /**@todo fill in the test code*/
//  }

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
    String expectedReturn = "2.0";
    String actualReturn = localSampleRss.getVersion();
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

  public void testAddItem() {
    // From:	"Asher Szmulewicz" <AsherS@gurunet.com>
    try {
      assertEquals(0, Rss.DEFAULT_RSS.getItemCount());
      Rss myRss = new Rss();
//a few setters then
      Rss.Item item;
      item = new Rss.Item("title", "http://www.mysite.com/rss/myrss.html",
                          "description");
      myRss.addItem(item);
      assertEquals(0, Rss.DEFAULT_RSS.getItemCount());

//    from my debugger the problem is that in addItem getItem(item.getTitle()) returns null
//
//      public void addItem(Item item) {
//      ****channel.removeKid(getItem(item.getTitle()));
//        channel.addKid(item);
//        itemIndex.put(item.getTitle(), item);
//      }

//
//    and in removeKid kid is null
//
//     public void removeKid(XmlData kid) {
//     *****   String type = kid.getType();
//        Collection slot = getKids(type);
//        if (slot != null) {
//          slot.remove(kid);
//        }
//        if (slot.size() == 0) {
//          byType.remove(type);
//        }
//      }
//
//    Did I miss an initialization or should there be a check (kid != null) in removeKid?
//
//    Regards,
//    Asher Szmulewicz
    }
    catch (InstantiationException ex) {
      fail("Oops, should not have occurred: " + ex);
    }

  }

  public void testSetters() {
    try {
      Rss myRss = new Rss();
      myRss.setCategory("testCategory");
      XmlData cloud = new BasicXmlData("cloud");
      myRss.setCloud(cloud);
      myRss.setCopyright("Copyright(c)thgirypoC");
      myRss.setDescription("This is a description");
      myRss.setDocs("testDocs");
      myRss.setGenerator("testGenerator");
      Rss.Image image = new Rss.Image("image title",
                                      "image description",
                                      "http://myjavatools.com",
                                      "http://myjavatools.com/index.xml",
                                      "100", "200");
      myRss.setImage(image);
      myRss.setLanguage("Laputian");
      myRss.setLastBuildDate("Tonight was the last build");
      myRss.setLink("the weakest link");
      myRss.setManagingEditor("Dick Cheney");
      myRss.setPubDate("tomorrow");
      myRss.setRating("what rating?");
      myRss.setSkipDays("Monday and Friday");
      myRss.setSkipHours("9 to 5");
      myRss.setTextInput("text input Title",
                         "text input Description",
                         "textInputName",
                         "textInputLink");
      myRss.setTitle("This is my title");
      myRss.setTtl("forever");
      myRss.setWebMaster("Julia Feld");

      assertEquals("Copyright(c)thgirypoC", myRss.getCopyright());
      assertEquals(cloud, myRss.getCloud());
      assertEquals("testCategory", myRss.getCategory());
      assertEquals("This is a description", myRss.getDescription());
      assertEquals("testDocs", myRss.getDocs());
      assertEquals("testGenerator", myRss.getGenerator());
      assertEquals(image, myRss.getImage());
      assertEquals("Laputian", myRss.getLanguage());
      assertEquals("Tonight was the last build", myRss.getLastBuildDate());
      assertEquals("the weakest link", myRss.getLink());
      assertEquals("Dick Cheney", myRss.getManagingEditor());
      assertEquals("tomorrow", myRss.getPubDate());
      assertEquals("what rating?", myRss.getRating());
      assertEquals("Monday and Friday", myRss.getSkipDays());
      assertEquals("9 to 5", myRss.getSkipHours());
      assertEquals(new Rss.TextInput("text input Title",
                                     "text input Description",
                                     "textInputName",
                                     "textInputLink"),
                   myRss.getTextInput());
      assertEquals("This is my title", myRss.getTitle());
      assertEquals("forever", myRss.getTtl());
      assertEquals("Julia Feld", myRss.getWebMaster());

    }
    catch (InstantiationException ex) {
      fail("should not throw exceptions: " + ex);
    }
  }

  public void testStaticRssGrowth() {
    try {
      assertEquals(0, Rss.DEFAULT_RSS.getItemCount());
      Rss myRss = new Rss(Rss.DEFAULT_RSS);
      assertEquals(0, Rss.DEFAULT_RSS.getItemCount());
      myRss.addItem("item1", "item1link", "Description of item 1");
      assertEquals(0, Rss.DEFAULT_RSS.getItemCount());

      myRss = new Rss(Rss.DEFAULT_RSS);
      myRss.addItem("item2", "item2link", "Description of item 2");

      assertEquals(1, myRss.getItemCount());
    }
    catch (InstantiationException ex) {
      fail("should not throw exceptions: " + ex);
    }
  }
}
