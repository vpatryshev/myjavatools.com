package com.myjavatools.web;

import junit.framework.*;

public class AllTests
    extends TestCase {

  static final int TEST_PORT = 8080;

  public AllTests(String s) {
    super(s);
  }

  public static Test suite() {
    TestSuite suite = new TestSuite();
    suite.addTestSuite(TestCase1.class);
    suite.addTestSuite(TestCase2.class);
    suite.addTestSuite(TestCase3.class);
    return suite;
  }
}
