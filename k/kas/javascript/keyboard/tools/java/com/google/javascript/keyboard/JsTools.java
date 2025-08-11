// Copyright Google, Inc., 2008

package tools.java.com.google.javascript.keyboard;

import java.applet.Applet;

/**
 * This class contains Java tools to be used in JavaScript.
 * Currently there's just one method, sleep().
 *
 * @author vpatryshev@google.com (Vlad Patryshev) 
 */

public class JsTools extends Applet {
  /**
   * Sleeps given number of milliseconds.
   *
   * @param timeToSleep time to sleep (ms)
   */
  public static void sleep(long timeToSleep) {
    for (long wakeupTime = System.currentTimeMillis() + timeToSleep;
         timeToSleep > 0;
         timeToSleep = wakeupTime - System.currentTimeMillis()) {
      try {
        Thread.sleep(timeToSleep);
      } catch (InterruptedException ie) {
        // ignore it, just repeat until done
      }
    }
  }
}