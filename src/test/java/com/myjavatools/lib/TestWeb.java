package com.myjavatools.lib;

import junit.framework.*;
import java.util.Map;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.Set;

public class TestWeb
    extends TestCase {
  private Web web = null;

  public TestWeb(String name) {
    super(name);
  }

  protected void setUp() throws Exception {
    super.setUp();
    /**@todo verify the constructors*/

    Map charsets = Charset.availableCharsets();
    for (Iterator i = charsets.entrySet().iterator(); i.hasNext();) {
      Map.Entry entry = (Map.Entry)i.next();
      Charset charset = (Charset)entry.getValue();
      System.out.print(entry.getKey().toString() + ": " + charset + " ");
      Set aliases = charset.aliases();

      for (Iterator j = aliases.iterator(); j.hasNext();) {
        System.out.print(", aka " + j.next());
      }

      System.out.println();
    }

    web = new Web();
  }

  protected void tearDown() throws Exception {
    web = null;
    super.tearDown();
  }

  public void testGetHtmlCharset() {
    String s  = "<html><head><meta HTTP-EQUIV=\"content-type\" CONTENT=\"text/html; charset=shift-jis\">";
    String expectedReturn = "shift-jis";
    String actualReturn = web.getHtmlCharset(s);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetHtmlEncoding() {
    String s  = "<html><head><meta HTTP-EQUIV=\"content-type\" CONTENT=\"text/html; charset=shift-jis\">";
    String expectedReturn = "SJIS";
    String actualReturn = web.getHtmlEncoding(s);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetXmlCharset() {
    String s = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    String expectedReturn = "utf-8";
    String actualReturn = web.getXmlCharset(s);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetXmlEncoding() {
    String s = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    String expectedReturn = "UTF8";
    String actualReturn = web.getXmlEncoding(s);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testUrlEncode() {
    String actual = web.urlEncode("dir", "C:\\Program Files");
    String expected="dir=C%3A%5CProgram+Files";
    assertEquals("return value", expected, actual);
  }
}
