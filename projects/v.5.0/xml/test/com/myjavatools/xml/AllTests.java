package com.myjavatools.xml;

import junit.framework.*;

public class AllTests
    extends TestCase {

  public AllTests(String s) {
    super(s);
  }

  public static Test suite() {
    TestSuite suite = new TestSuite();
    suite.addTestSuite(com.myjavatools.xml.TestRss_0_90.class);
    suite.addTestSuite(com.myjavatools.xml.TestRss_0_91.class);
    suite.addTestSuite(com.myjavatools.xml.TestRss_0_91_intl.class);
    suite.addTestSuite(com.myjavatools.xml.TestRss_0_92.class);
    suite.addTestSuite(com.myjavatools.xml.TestRss_0_93.class);
    suite.addTestSuite(com.myjavatools.xml.TestRss_0_94.class);
    suite.addTestSuite(com.myjavatools.xml.TestRss_1_0.class);
    suite.addTestSuite(com.myjavatools.xml.TestRss_2_0.class);
    suite.addTestSuite(com.myjavatools.xml.TestRss_Slashdot.class);
    suite.addTestSuite(com.myjavatools.xml.TestXmlData.class);
    return suite;
  }
}
