package com.myjavatools.web;

import junit.framework.*;
import java.net.URL;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.File;
import java.io.Writer;
import java.io.FileWriter;
import java.io.ByteArrayInputStream;

public class TestCase3 extends TestCase {
  protected void setUp() throws Exception {
    super.setUp();
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  String testJsp  = "/HttpClientTest/test3.jsp";
  String testFileName = "testfile.tmp";
  String testFileData = "This is the test file";

  private File makeTestFile() throws java.io.IOException {
    File testFile = new File(testFileName);
    Writer data = new FileWriter(testFile);
    data.write(testFileData);
    data.close();
    return testFile;
  }

  public void test1() {
    try {
      URL url = new URL("http://localhost:" + AllTests.TEST_PORT +
                        testJsp);
      ClientHttpRequest request = new ClientHttpRequest(url);
      request.setParameter("name", "J.Doe");
      request.setParameter("email", "abuse@spamcop.com");
      request.setParameter("file-upload", makeTestFile());
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
      request.post(new Object[] {"name",  "J.Doe",
                                 "email", "abuse@spamcop.com",
                                 "file-upload", makeTestFile()});
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
      request.post("name",  "J.Doe",
                   "email", "abuse@spamcop.com",
                   "file-upload", makeTestFile());
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
                                              new Object[] {"name", "J.Doe",
                                                            "email", "abuse@spamcop.com",
                                                            "file-upload", makeTestFile()});
      String result = new LineNumberReader(new InputStreamReader(is)).readLine();
      assertEquals("Success", result);
    } catch (Exception e) {
      this.fail(e.getMessage());
    }
  }

  public void test5() {
    try {
      URL url = new URL("http://localhost:" + AllTests.TEST_PORT +
                        testJsp);
      ClientHttpRequest request = new ClientHttpRequest(url);
      request.setParameter("name", "J.Doe");
      request.setParameter("email", "abuse@spamcop.com");
      request.setParameter("file-upload",
                           testFileName,
                           new ByteArrayInputStream(testFileData.getBytes()));
      InputStream is = request.post();
      String result = new LineNumberReader(new InputStreamReader(is)).readLine();
    } catch (Exception e) {
      this.fail(e.getMessage());
    }
  }
}
