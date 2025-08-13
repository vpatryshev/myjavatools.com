package com.myjavatools.web;

import junit.framework.*;
import java.net.URL;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;

public class TestCase1 extends TestCase {
  protected void setUp() throws Exception {
    super.setUp();
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  public void test1() {
    try {
      URL url = new URL("http://localhost:" + AllTests.TEST_PORT +
                        "/HttpClientTest/test1.jsp?name=J.Doe&email=abuse@spamcop.com");
      InputStream is = url.openStream();
      String result = new LineNumberReader(new InputStreamReader(is)).readLine();
      assertEquals("Success", result);
    } catch (Exception e) {
      this.fail(e.getMessage());
    }
  }
}
