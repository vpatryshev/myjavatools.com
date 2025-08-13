package com.myjavatools.lib;

import junit.framework.*;

public class TestTools
    extends TestCase {
  private Tools tools = null;

  public TestTools(String name) {
    super(name);
  }

  protected void setUp() throws Exception {
    super.setUp();
    /**@todo verify the constructors*/
    tools = null;
  }

  protected void tearDown() throws Exception {
    tools = null;
    super.tearDown();
  }

  public void testBark() {
    String msg = "Test Error Message, just click 'OK'";
    boolean expectedReturn = false;
    boolean actualReturn = tools.bark(msg);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCommandLineArg() {
    assertEquals("return value", "abcd", tools.commandLineArg("abcd"));
    assertEquals("return value", "\"ab cd\"", tools.commandLineArg("ab cd"));
    assertEquals("return value", "\" \"", tools.commandLineArg(" "));
  }

  public void testInform() {
    String msg = "Test Informative Message, just click 'OK'";
    boolean expectedReturn = false;
    boolean actualReturn = tools.inform(msg);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRunCommand1_1() {
    String cmd = "notepad src/com/myjavatools/lib/Tools.java&";
    boolean expectedReturn = true;
    boolean actualReturn = tools.runCommand(cmd);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRunCommand1_2() {
    String cmd = "rmdir xxx";
    boolean expectedReturn = false;
    boolean actualReturn = tools.runCommand(cmd);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRunCommand2_1() {
    String cmd = "cmd /c dir .";
    String dir = "c:\\Program Files";
    boolean expectedReturn = true;
    boolean actualReturn = tools.runCommand(cmd, dir);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testWhether() {
    assertEquals("return value", false, tools.whether("Are you a cat or a dog"));
    assertEquals("return value", true,  tools.whether("Is it true that 0 + 0 = 0"));
  }
}
