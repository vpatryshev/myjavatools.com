package com.myjavatools.lib;

import junit.framework.*;
import java.util.*;
import static com.myjavatools.lib.Bytes.*;

public class TestBytes
    extends TestCase {
//  private Objects Objects = null;

  public TestBytes(String name) {
    super(name);
  }

  protected void setUp() throws Exception {
    super.setUp();
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  public static void assertEquals(String message, Object[] expectedArray, Object[] actualArray) {
    if (expectedArray == null) {
      assertNull(message + ": actual must be null", actualArray);
    }
    assertNotNull(message + ": ctual must not be null", actualArray);

    for (int i = 0; i < Math.max(expectedArray.length, actualArray.length); i++) {
      assertEquals(message + ": #" + i, expectedArray[i], actualArray[i]);
    }
  }

  public static void assertEquals(String message, byte[] expectedArray, byte[] actualArray) {
    if (expectedArray == null) {
      assertNull(message + ": actual must be null", actualArray);
    }
    assertNotNull(message + ": ctual must not be null", actualArray);

    for (int i = 0; i < Math.max(expectedArray.length, actualArray.length); i++) {
      assertEquals(message + ": #" + i, expectedArray[i], actualArray[i]);
    }
  }

  public static void assertEquals(String message, char[] expectedArray, char[] actualArray) {
    if (expectedArray == null) {
      assertNull(message + ": actual must be null", actualArray);
    }
    assertNotNull(message + ": ctual must not be null", actualArray);

    for (int i = 0; i < Math.max(expectedArray.length, actualArray.length); i++) {
      assertEquals(message + ": #" + i, expectedArray[i], actualArray[i]);
    }
  }

  public void testCrc32() {
    byte[] data = new byte[] {1, 2, 3};
    long expectedReturn = 1438416925l;
    long actualReturn = crc32(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCrc321() {
    byte[] data = new byte[] {0, 1, 2, 3, 4};
    long expectedReturn = 1438416925l;
    int off = 1;
    int len = 3;
    long actualReturn = crc32(data, off, len);
    assertEquals("return value", expectedReturn, actualReturn);
  }
  public void testToBytes() {
    char[] from = new char[] {0x0123, 0x4567, 0x89ab, 0xcdef};
    byte[] expectedReturn = new byte[]{0x23, 0x67, (byte)0xab, (byte)0xef};
    byte[] actualReturn = toBytes(from);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToBytes1() {
    long from = 0x0123456789abcdefl;
    byte[] expectedReturn = new byte[] {(byte)0xef, (byte)0xcd, (byte)0xab, (byte)0x89, 0x67, 0x45, 0x23, 0x01};
    byte[] actualReturn = toBytes(from);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToChars() {
    byte[] from = new byte[] {0x23, 0x67, (byte)0xab, (byte)0xef};
    char[] expectedReturn = new char[] {0x23, 0x67, 0xab, 0xef};
    char[] actualReturn = toChars(from);
    assertEquals("return value", expectedReturn, actualReturn);
  }
}
