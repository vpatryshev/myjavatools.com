package com.myjavatools.web;

import junit.framework.*;
import java.net.URL;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;

public class TestCase2 extends TestCase {
  protected void setUp() throws Exception {
    super.setUp();
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  String testJsp  = "/HttpClientTest/test2.jsp";

  public void test1() {
    try {
      URL url = new URL("http://localhost:" + AllTests.TEST_PORT +
                        testJsp);
      ClientHttpRequest request = new ClientHttpRequest(url);
      request.setParameter("name", "J.Doe");
      request.setParameter("email", "abuse@spamcop.com");
      InputStream is = request.post();
      String result = new LineNumberReader(new InputStreamReader(is)).readLine();
      assertEquals("Success", result);
    } catch (Exception e) {
      this.fail(e.getMessage());
    }
  }

  public void test2() {
    try {
      URL url = new URL("http://localhost:" + AllTests.TEST_PORT +
                        testJsp);
      ClientHttpRequest request = new ClientHttpRequest(url);
      request.post(new String[] {"name", "J.Doe","email", "abuse@spamcop.com"});
      InputStream is = request.post();
      String result = new LineNumberReader(new InputStreamReader(is)).readLine();
      assertEquals("Success", result);
    } catch (Exception e) {
      this.fail(e.getMessage());
    }
  }

  public void test3() {
    try {
      URL url = new URL("http://localhost:" + AllTests.TEST_PORT +
                        testJsp);
      ClientHttpRequest request = new ClientHttpRequest(url);
      request.post("name", "J.Doe","email", "abuse@spamcop.com");
      InputStream is = request.post();
      String result = new LineNumberReader(new InputStreamReader(is)).readLine();
      assertEquals("Success", result);
    } catch (Exception e) {
      this.fail(e.getMessage());
    }
  }

  public void test4() {
    try {
      URL url = new URL("http://localhost:" + AllTests.TEST_PORT +
                        testJsp);
      InputStream is = ClientHttpRequest.post(url,
                                              new String[] {"name", "J.Doe",
                                                            "email", "abuse@spamcop.com"});
      String result = new LineNumberReader(new InputStreamReader(is)).readLine();
      assertEquals("Success", result);
    } catch (Exception e) {
      this.fail(e.getMessage());
    }
  }
}
