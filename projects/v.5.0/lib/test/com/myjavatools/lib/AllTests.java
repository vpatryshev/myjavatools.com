package com.myjavatools.lib;

import junit.framework.*;

public class AllTests
    extends TestCase {

  public AllTests(String s) {
    super(s);
  }

  public static Test suite() {
    TestSuite suite = new TestSuite();
    suite.addTestSuite(com.myjavatools.lib.foundation.TestPair.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestIterators.class);
    suite.addTestSuite(com.myjavatools.lib.TestObjects.class);
    suite.addTestSuite(com.myjavatools.lib.TestStrings.class);
    suite.addTestSuite(com.myjavatools.lib.TestFiles.class);
    suite.addTestSuite(com.myjavatools.lib.TestWeb.class);
    suite.addTestSuite(com.myjavatools.lib.TestTools.class);
    return suite;
  }
}
