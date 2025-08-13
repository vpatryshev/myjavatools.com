package com.myjavatools.util;

/**
 * <p>Title: Debug</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2002</p>
 * <p>Company: </p>
 * @author unascribed
 * @version 1.0
 */

import java.io.OutputStream;
import java.io.PrintStream;

public class Debug {
  static boolean state = false;

  static PrintStream nullStream = new PrintStream(
                                  new OutputStream()
    {
      public void write(int i) {}
    }
  );

  public static java.io.PrintStream out = nullStream;

  public static void set(boolean doDebug) {
    state = doDebug;
    out = doDebug ? System.out : nullStream;
  }
}