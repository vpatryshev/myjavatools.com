package com.myjavatools.xml;

import junit.framework.*;
import org.xml.sax.*;
import java.io.*;
import java.util.*;
import java.lang.reflect.*;
import java.net.*;

public class TestXmlData
    extends TestCase {

  public static void assertEquals(String message, char[] expectedArray, char[] actualArray) {
    if (expectedArray == null) {
      assertNull(message + ": actual must be null", actualArray);
    }
    assertNotNull(message + ": ctual must not be null", actualArray);

    for (int i = 0; i < Math.max(expectedArray.length, actualArray.length); i++) {
      int pos = Math.max(0, i - 10);
      String prefix = new String(expectedArray, pos, i - pos);
      if (expectedArray[i] != actualArray[i]) {
        i = i;
      }
      assertEquals(message + ": #" + i + " (" + prefix + "...)", expectedArray[i], actualArray[i]);
    }
  }

  private BasicXmlData xmlData = null;
  private String textualForm =
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
      "<person id=\"V-AK 610742\" name=\"Ivan Ivanov\" phone-number=\"any button after the beep\">\n" +
      "  <person name=\"Sergey Ivanov\">Another valuable person</person>\n" +
      "  <entity>totally unknown entity</entity>\n" +
      "  <person name=\"Natasha Ivanova\">Precious child</person>" +
      "Very Important Person Indeed" +
      "</person>\n";


  public TestXmlData(String name) {
    super(name);
  }

  protected void setUp() throws Exception {
    super.setUp();
    /**@todo verify the constructors*/
    xmlData = new BasicXmlData("person", "Very Important Person Indeed");
    xmlData.setAttribute("id", "V-AK 610742");
    xmlData.setAttribute("name", "Ivan Ivanov");
    xmlData.setAttribute("phone-number", "any button after the beep");
    xmlData.addKid(new BasicXmlData("person", "Another valuable person",
                                    new String[] {"name", "Sergey Ivanov"}));
    xmlData.addKid(new BasicXmlData("entity", "totally unknown entity"));
    xmlData.addKid(new BasicXmlData("person", "Precious child", new String[]{"name", "Natasha Ivanova"}));
  }

  protected void tearDown() throws Exception {
    xmlData = null;
    super.tearDown();
  }

  public void testSelectTree() {
    try {
      XmlData actualReturn = xmlData.selectTree("name = \"Natasha Ivanova\"");
      assertNull("must be null", actualReturn);
      actualReturn = xmlData.selectTree(
          "name = \"Ivan Ivanov\" | name = \"Sergey Ivanov\"");
      assertNotNull("must be something there", actualReturn);
    }
    catch (InstantiationException ex) {
      fail("Error while parsing the expression: " + ex);
    }
  }

  public void testSetAttribute() {
    String name = "ssn";
    String value = "n/a";
    assertNull("attribute before call", xmlData.getAttribute(name));
    xmlData.setAttribute(name, value);
    assertEquals("return falue", xmlData.getAttribute(name), value);
  }

  public void testSetAttributes() {
    String[] attributes = new String[] {"cellphone", "Nokia", "car", "Jeep"};
    assertNull("attribute before call", xmlData.getAttribute(attributes[0]));
    assertNull("attribute before call", xmlData.getAttribute(attributes[2]));
//    xmlData.setAttributes(attributes);
    xmlData.setAttributes("cellphone", "Nokia", "car", "Jeep");
    assertEquals("return falue", xmlData.getAttribute(attributes[0]), attributes[1]);
    assertEquals("return falue", xmlData.getAttribute(attributes[2]), attributes[3]);
  }

  public void testSetValue() {
    String v = "Really invaluable person";
    String actualReturn = xmlData.setValue(v).getValue();
    assertEquals("return value", v, actualReturn);
  }

  public void testSetXmlContent() {
    XmlData org = xmlData.getKid("person");
    xmlData.setXmlContent(org);
    assertEquals(org, xmlData);
  }

  public void testSelectTree1() {
    XmlData.Condition condition = null;
    XmlData expectedReturn = xmlData;
    XmlData actualReturn = xmlData.selectTree(condition);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testSave() throws IOException {
    ByteArrayOutputStream os = new ByteArrayOutputStream();
    xmlData.save(os);
    String result = new String(os.toString());
    assertEquals("output", textualForm.toCharArray(), result.toCharArray());
  }

  public void testSatisfies() {
    String expression = null;
    boolean actualReturn = false;
    try {
      actualReturn = xmlData.satisfies(expression);
    }
    catch (InstantiationException ex) {
      fail("Error while parsing the expression: " + ex);
    }
    assertTrue("return value", actualReturn);
  }

  public void testSatisfies1() {
    XmlData.Condition condition1 = new BasicXmlData.Condition() {
      public boolean satisfies(XmlData data) {
        return data.getAttribute("name").indexOf("Ivanov") > 0;
      }
    };
    XmlData.Condition condition2 = new BasicXmlData.Condition() {
      public boolean satisfies(XmlData data) {
        return data.getAttribute("name").indexOf("Petrov") > 0;
      }
    };
    this.assertTrue("condition1", xmlData.satisfies(condition1));
    this.assertFalse("condition2", xmlData.satisfies(condition2));
  }

  public void testEquals() {
    BasicXmlData o = (BasicXmlData)xmlData.clone();
    o.setAttribute("name", o.getAttribute("name"));
    boolean expectedReturn = true;
    assertTrue("return value", xmlData.equals(o));
    o.setAttribute("id", "fake id");
    assertFalse("another return value", o.equals(xmlData));
  }

  public void testGetAllKids() {
    List<XmlData> expectedReturn = new ArrayList<XmlData>();
    Iterator<XmlData> personlist = xmlData.getKids("person").iterator();
    expectedReturn.add(personlist.next().clone());
    expectedReturn.addAll(xmlData.getKids("entity"));
    expectedReturn.add(personlist.next().clone());

    Collection actualReturn = xmlData.getAllKids();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetAttribute() {
    String name = null;
    String expectedReturn = null;
    String actualReturn = xmlData.getAttribute(name);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetAttribute1() {
    String name = null;
    String defaultValue = null;
    String expectedReturn = null;
    String actualReturn = xmlData.getAttribute(name, defaultValue);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testRemoveKid() {
    XmlData tmp = (XmlData)xmlData.clone();
    XmlData kid = tmp.getKid("person");
    tmp.removeKid(kid);
    assertFalse("kid removed, must be different", tmp.equals(xmlData));
  }

  public void testRemoveKids() {
    String type = null;
    Collection<XmlData> expectedReturn = new LinkedList<XmlData>();
    Collection actualReturn = xmlData.removeKids(type);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetXmlContent() {
    assertTrue("return value", xmlData.getXmlContent() == xmlData);
  }

  public void testGetValue() {
    String expectedReturn = "Very Important Person Indeed";
    String actualReturn = xmlData.getValue();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetType() {
    String expectedReturn = "person";
    String actualReturn = xmlData.getType();
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetName() {
    String expectedReturn = "Ivan Ivanov";
    String actualReturn = xmlData.getName();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetKids() {
    String type = null;
    Collection<? extends XmlData> expectedReturn = new LinkedList<XmlData>();
    Collection<? extends XmlData> actualReturn = xmlData.getKids(type);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetKidValue() {
    String type = null;
    String expectedReturn = null;
    String actualReturn = xmlData.getKidValue(type);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetKidCount() {
    String type = null;
    int expectedReturn = 0;
    int actualReturn = xmlData.getKidCount(type);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetKid() {
    String type = null;
    String attribute = null;
    String value = null;
    XmlData expectedReturn = null;
    XmlData actualReturn = xmlData.getKid(type, attribute, value);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetKid2() {
    String type = null;
    String id = null;
    XmlData expectedReturn = null;
    XmlData actualReturn = xmlData.getKid(type, id);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetKid3() {
    String type = null;
    BasicXmlData expectedReturn = null;
    XmlData actualReturn = xmlData.getKid(type);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetId() {
    String expectedReturn = "V-AK 610742";
    String actualReturn = xmlData.getId();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testGetAttributes() {
    Map<String,String> expectedReturn = new HashMap<String,String>();
    expectedReturn.put("phone-number", "any button after the beep");
    expectedReturn.put("name", "Ivan Ivanov");
    expectedReturn.put("id", "V-AK 610742");

    Map actualReturn = xmlData.getAttributes();
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testClone() {
    Object expectedReturn = xmlData;
    Object actualReturn = xmlData.clone();
    assertTrue("must be equal", expectedReturn.equals(actualReturn));
  }

  public void testXmlData() {
    String type = "testtype";
    xmlData = new BasicXmlData(type);
    assertEquals("type", xmlData.getType(), type);
  }

  public void testCast() {
    String packageName = null;
    BasicXmlData expectedReturn = null;
    XmlData actualReturn = null;
    try {
      actualReturn = xmlData.castToPackage(packageName, null);
      this.fail("Should have thrown an exception");
    }
    catch (Exception ex) {
    }
    try {
      actualReturn = xmlData.castToPackage(packageName, BasicXmlData.Policy.SKIP_ON_ERROR);
      assertEquals("return value", expectedReturn, actualReturn);
    }
    catch (Exception ex) {
      fail("Exception " + ex);
    }
  }

  public void testCast1() {
    Map<String, Class<? extends XmlData>> typemap =
        new HashMap<String, Class<? extends XmlData>>();
    BasicXmlData expectedReturn = null;
    XmlData actualReturn = null;
    try {
      actualReturn = xmlData.cast(typemap, null);
      fail("Should have thrown an exception");
    }
    catch (Exception ex) {
    }
    try {
      actualReturn = xmlData.cast(typemap, BasicXmlData.Policy.SKIP_ON_ERROR);
      assertEquals("return value", expectedReturn, actualReturn);
    }
    catch (Exception ex) {
      fail("Exception " + ex);
    }
  }


  public void testCast2() {

    BasicXmlData copy = new BasicXmlData(xmlData);
    assertTrue(copy.castKids("person", Person.class));
    copy.clone();
    assertEquals(xmlData.getKidCount("person"),
                    copy.getKidCount("person"));
  }

  public void testAddKids() {
    Collection<XmlData> kids = new ArrayList<XmlData>();
    kids.add(new BasicXmlData("dog", "$150", new String[] {"name", "Sparky"}));
    kids.add(new BasicXmlData("cat", "just precious", new String[] {"name", "Pussy-pussy"}));
    xmlData.addKids(kids);
    assertNotNull("dog must be there", xmlData.getKid("dog"));
    assertNotNull("cat must be there", xmlData.getKid("cat"));
  }

  public void testAddKid() {
    XmlData kid = null;
    XmlData expectedReturn = null;
    XmlData actualReturn = xmlData.addKid(kid);
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }

  public void testXmlData1() {
    XmlData copy = new BasicXmlData(xmlData);
    assertTrue("copy constructor", copy.equals(xmlData));
  }

  public void testXmlData2() throws IOException, InstantiationException {
    URL url = new URL("http://www.xml.com/cs/xml/query/q/19");
    XmlData quote = new BasicXmlData(url).getKid("channel");
    assertNotNull("XML.com rss sample description", quote.getKidValue("description"));
  }

  public void testXmlData3() {
    String type = "person";
    String value = "Old communist";
    BasicXmlData[] kids = new BasicXmlData[] {xmlData, new BasicXmlData("dog", null, new String[] {"name", "Polkan"})};
    BasicXmlData tmp = new BasicXmlData(type, value, kids);
    assertEquals("Dog", tmp.getKid("dog").getName(), "Polkan");
    assertEquals("Must be a communist", "Old communist", tmp.getValue());
  }

  public void testXmlData4() {
    String type = "person";
    String value = "Old communist";
    BasicXmlData[] kids = new BasicXmlData[] {xmlData, new BasicXmlData("dog", null, new String[] {"name", "Polkan"})};
    String[] attrs = new String[] {"party membership", "Bolshevik", "religion", "Orthodox"};;
    BasicXmlData tmp = new BasicXmlData(type, value, attrs, kids);
    assertEquals("Ivan Ivanov", tmp.getKid("person"), xmlData);
    assertEquals("Dog", tmp.getKid("dog").getName(), "Polkan");
    assertEquals("Orthodox Christian", tmp.getAttribute("religion"), "Orthodox");
  }

  public void testXmlData5() {
    String type = "person";
    String value = "Old communist";
    BasicXmlData[] kidsarray = new BasicXmlData[] {xmlData, new BasicXmlData("dog", null, new String[] {"name", "Polkan"})};
    String[] attrs = new String[] {"party membership", "Bolshevik", "religion", "Orthodox"};;
    BasicXmlData tmp = new BasicXmlData(type, value, attrs, kidsarray);
    assertEquals("Ivan Ivanov", tmp.getKid("person"), xmlData);
    assertEquals("Dog", tmp.getKid("dog").getName(), "Polkan");
    assertEquals("Orthodox Christian", tmp.getAttribute("religion"), "Orthodox");
  }

  public void testXmlData6() {
    String type = "person";
    String value = "Old communist";
    BasicXmlData[] kidsarray = new BasicXmlData[] {xmlData, new BasicXmlData("dog", null, new String[] {"name", "Polkan"})};
    String[] attrs = new String[] {"party membership", "Bolshevik", "religion", "Orthodox"};;
    BasicXmlData tmp = new BasicXmlData(type, value, attrs, kidsarray);
    assertEquals("Dog", tmp.getKid("dog").getName(), "Polkan");
    assertEquals("Orthodox Christian", tmp.getAttribute("religion"), "Orthodox");
  }

  public void testXmlData7() {
    String type = "person";
    String value = "Old communist";
    BasicXmlData[] kidsarray = new BasicXmlData[] {xmlData, new BasicXmlData("dog", null, new String[] {"name", "Polkan"})};
    Collection kids = Arrays.asList(kidsarray);
    Map<String,String> attrs = new HashMap<String, String>();
    attrs.put("religion", "Orthodox");
    BasicXmlData tmp =
        new BasicXmlData(type, value, attrs, kids);
    assertEquals("Ivan Ivanov", tmp.getKid("person"), xmlData);
    assertEquals("Dog", tmp.getKid("dog").getName(), "Polkan");
    assertEquals("Orthodox Christian", tmp.getAttribute("religion"), "Orthodox");
  }

  public void testXmlData8() {
    String type = "person";
    String value = "Old communist";
    BasicXmlData[] kidsarray = new BasicXmlData[] {xmlData, new BasicXmlData("dog", null, new String[] {"name", "Polkan"})};
    Collection kids = Arrays.asList(kidsarray);
    Map attrs = new HashMap();
    attrs.put("religion", "Orthodox");
    BasicXmlData tmp = new BasicXmlData(type, value, attrs, kids);
    assertEquals("Ivan Ivanov", tmp.getKid(0), xmlData);
    assertEquals("Dog", tmp.getKid(1).getName(), "Polkan");
    assertEquals("Orthodox Christian", tmp.getAttribute("religion"), "Orthodox");
  }

  public void testXmlData9() {
    String type = "person";
    String value = "Old communist";
    BasicXmlData[] kidsarray = new BasicXmlData[] {xmlData, new BasicXmlData("dog", null, new String[] {"name", "Polkan"})};
    Collection kids = Arrays.asList(kidsarray);
    BasicXmlData tmp = new BasicXmlData(type, value, kids);
    assertEquals("Ivan Ivanov", tmp.getKid("person"), xmlData);
    assertEquals("Dog", tmp.getKid("dog").getName(), "Polkan");
    assertEquals("Must be a communist", "Old communist", tmp.getValue());
  }

  public void testXmlData13() {
    BasicXmlData tmp = new BasicXmlData("penguin", "Big big penguin that ate all butterfiles in Antarctica");
    assertTrue("no butterflies", tmp.getValue().indexOf("butterfiles") > 0);
    assertEquals("has to be penguin", "penguin", tmp.getType());
  }

  public void testXmlData14() throws IOException, InstantiationException {
    InputStream in = new java.io.ByteArrayInputStream(textualForm.getBytes());
    BasicXmlData tmp = new BasicXmlData(in);
    boolean result = tmp.equals(xmlData);
    this.assertEquals("must be same values", xmlData.getValue(), tmp.getValue());
    this.assertEquals("must be the same", xmlData, tmp);
  }

  public void testXmlData15() {
    BasicXmlData tmp = new BasicXmlData();
    assertEquals("no kids", tmp.getKidCount("person"), 0);
    assertEquals("no attributes", tmp.getAttributes().size(), 0);
    assertNull("no type", tmp.getType());
    assertNull("no value", tmp.getValue());
  }

}

class Person extends BasicXmlData {
  public Person(XmlData org) {
    super(org);
  }
}
