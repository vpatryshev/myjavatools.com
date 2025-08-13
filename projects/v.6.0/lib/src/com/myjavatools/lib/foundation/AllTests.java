package com.myjavatools.lib.foundation;

import junit.framework.*;

/**
 * <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p></p>
 *
 * <p>Company: My Java Tools</p>
 *
 * @author vlad@myjavatools.com
 * @version 6.0
 */
public class AllTests
    extends TestCase {

  public AllTests(String s) {
    super(s);
  }

  public static Test suite() {
    TestSuite suite = new TestSuite();
    suite.addTestSuite(com.myjavatools.lib.foundation.TestFilter.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestFunction.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestFunction2.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestAbstractMap2.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestIndexedMap2.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestIterators.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestPair.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestObjects.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestPair.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.
                       TestRestrictedFunctionEntrySet.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestRestrictedMapEntrySet.class);
    suite.addTestSuite(com.myjavatools.lib.foundation.TestMaps.class);
    return suite;
  }
}
