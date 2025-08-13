package com.myjavatools.lib;

import junit.framework.*;
import java.io.*;
import java.util.*;
import java.util.regex.PatternSyntaxException;
import java.util.regex.Pattern;
import static com.myjavatools.lib.Strings.*;

public class TestStrings
    extends TestCase {

  public TestStrings(String name) {
    super(name);
  }

  protected void setUp() throws Exception {
    super.setUp();
    /**@todo verify the constructors*/
  }

  protected void tearDown() throws Exception {
    super.tearDown();
  }

  public static void assertEquals(String message, Object[] expectedArray, Object[] actualArray) {
    if (expectedArray == null) {
      assertNull(message + ": actual must be null", actualArray);
    }
    assertNotNull(message + ": actual must not be null", actualArray);

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
    assertNotNull(message + ":actual must not be null", actualArray);

    for (int i = 0; i < Math.max(expectedArray.length, actualArray.length); i++) {
      assertEquals(message + ": #" + i, expectedArray[i], actualArray[i]);
    }
  }

  public static <T> void assertEquals(String message,
                                      Iterable<? extends T> expected,
                                      Iterable<? extends T> actual) {
    if (expected == null) {
      assertNull(message + ": actual must be null", actual);
    }
    assertNotNull(message + ":actual must not be null", actual);

    Iterator<? extends T> exp = expected.iterator();
    Iterator<? extends T> act = actual.iterator();
    int i = 0;
    while(exp.hasNext()) {
      assertTrue(message + ": actual must have element #" + i,
                 act.hasNext());
      assertEquals(message + ": #" + i, exp.next(), act.next());
      i++;
    }

    assertFalse(message + ": actual must have " + i + " elements",
                act.hasNext());
  }

  public void testCountTrailingSpaces() {
    String s = null;
    int expectedReturn = 3;
    int actualReturn = countTrailingSpaces(" this is a string   ");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToSgmlEncoding() {
    String s = "<i>Feliz Año Nuevo</i>\n";
    String expectedReturn = "&lt;i&gt;Feliz A&#241;o Nuevo&lt;/i&gt;\n";
    String actualReturn = toSgmlEncoding(s);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testHtmlEncode() {
    String s = "<i>Feliz Año Nuevo</i>\n";
    String expectedReturn = "&lt;i&gt;Feliz A&#241;o Nuevo&lt;/i&gt;\n";
    String actualReturn = toSgmlEncoding(s);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testUnpack() {
    String string = "\u2367\uabef";
    byte[] expectedReturn = new byte[] {0x23, 0x67, (byte)0xab, (byte)0xef};
    byte[] actualReturn = unpack(string);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testDecode() throws IOException, UnsupportedEncodingException {
    byte[] bytes = new byte[] {0x41, (byte)0xc3, (byte)0xb1, 0x6f, 0x20, 0x4e, 0x75, 0x65, 0x76, 0x6f};
    String expectedReturn = "Año Nuevo";
    String actualReturn = decode(bytes, "UTF8");
    assertEquals("return value", expectedReturn, actualReturn);
    bytes = new byte[] {0x41, (byte)0x96, 0x6f, 0x20, 0x4e, 0x75, 0x65, 0x76, 0x6f};
    actualReturn = decode(bytes, "MacRoman");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToHex() {
    char ch = '\u00af';
    String expectedReturn = "00af";
    String actualReturn = toHex(ch);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToReadable() {
    String s = "\t¡Hola señor!\n";
    String expectedReturn = "..Hola se.or!.";
    String actualReturn = toReadable(s);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToReadable1() {
    String s = "\t¡Hola señor!\n";
    String expectedReturn = "Hola se.or";
    String actualReturn = toReadable(s.toCharArray(), 2, 12);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testUnzip() throws IOException, UnsupportedEncodingException {
    String zippedString = "\u78da\uf348\ucdc9\uc957\u08cf\u2fca\u4901\u0018\u0b04\u1d00";
    String expectedReturn = "Hello World";
    String actualReturn = unzip(zippedString);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToHexReadable() {
        byte[] data = new byte[] {1, 2, 48};
    String expectedReturn = "01 02 30 \r\n";
    String actualReturn = toHexReadable(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testAsProperties() {
        String[] pairs = new String[] {"1", "one", "2", "two", "3", "three"};
    Properties expectedReturn = new Properties();
    expectedReturn.setProperty("1", "one");
    expectedReturn.setProperty("2", "two");
    expectedReturn.setProperty("3", "three");
    Properties actualReturn = asProperties(pairs);
    assertEquals("return value", expectedReturn, actualReturn);
  }

//  public void testFormat2() {
//    String expectedReturn = "Life is struggle";
//    String actualReturn = format("{0} is {1}", "Life", "struggle");
//    assertEquals("return value", expectedReturn, actualReturn);
//  }

  public void testGrep() throws PatternSyntaxException {
    String[] source = new String[] {"good", "bad", "ugly"};
    String regexp = "g.";
    List<String> expectedReturn = new ArrayList<String>();
    expectedReturn.add("good");
    expectedReturn.add("ugly");
    List actualReturn = grep(source, regexp);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToPropertiesEncoding() {
    assertEquals("return value", toPropertiesEncoding('\u00af', false), "\\u00af");
    assertEquals("return value", toPropertiesEncoding('\u00af', true), "\\u00AF");
    assertEquals("return value", toPropertiesEncoding('a', false), "a");
  }

  public void testTextHeight() {
    assertEquals("return value", 3, textHeight("One\nTwo\nThree"));
    assertEquals("return value", 5, textHeight("\nOne\nTwo\nThree\n"));
  }

  public void testJoin() {
    assertEquals("return value", "1, 555", join(", ", new Long[] {new Long(1), new Long(555)}));
    assertEquals("return value", "Here and there and everywhere", join(" and ", new String[] {"Here", "there", "everywhere"}));
  }

  public void testHasAlpha() {
    assertTrue("return value", hasAlpha("2OO2"));
    assertTrue("return value", hasAlpha("This is a string"));
    assertFalse("return value", hasAlpha("+"));
    assertFalse("return value", hasAlpha("1900"));
    assertFalse("return value", hasAlpha("|1!*"));
  }

  public void testSplit1() {
    String source = "a,ab,abcde";
    String separator = ",";
    Collection<CharSequence> expectedReturn = new ArrayList<CharSequence>();
    expectedReturn.add("a");
    expectedReturn.add("ab");
    expectedReturn.add("abcde");

    Iterable<CharSequence> actualReturn = split(separator, source);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testSplit2() {
    String source = "a:ab:abcde:";
    String separator = ":";
    List<String> expectedReturn = new ArrayList<String>();
    expectedReturn.add("a");
    expectedReturn.add("ab");
    expectedReturn.add("abcde");
    expectedReturn.add("");

    Iterable<CharSequence> actualReturn = split(separator, source);
    assertEquals("return value", expectedReturn, actualReturn);
  }


  public void testSplit1r() {
    String source = "a,ab,abcde";
    String separator = ",";
    Collection<CharSequence> expectedReturn = new ArrayList<CharSequence>();
    expectedReturn.add("a");
    expectedReturn.add("ab");
    expectedReturn.add("abcde");

    Iterable<CharSequence> actualReturn =
        Strings.split(Pattern.compile(separator), source);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testSplit2r() {
    String source = "a:ab:abcde:";
    String separator = ":";
    List<String> expectedReturn = new ArrayList<String>();
    expectedReturn.add("a");
    expectedReturn.add("ab");
    expectedReturn.add("abcde");
    expectedReturn.add("");

    Iterable<CharSequence> actualReturn =

        split(Pattern.compile(separator), source);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToCEncoding() {
    assertEquals("return value", "\\nFeliz A\\xf1o Nuevo\\n", toCEncoding("\nFeliz Año Nuevo\n"));
  }

  public void testToJavaEncoding() {
    assertEquals("return value", "\\nFeliz A\\u00f1o Nuevo\\n\\0", toJavaEncoding("\nFeliz Año Nuevo\n\0"));
  }

  public void testDecodeJavaString() {
    assertEquals("return value", "This is a string", decodeJavaString("This is a string"));
    String expected = decodeJavaString("\\nFeliz A\\u00F1o Nuevo\\n");
    assertEquals("return value", "\nFeliz Año Nuevo\n", expected);
  }

  public void testZip() throws IOException, UnsupportedEncodingException {
    String source = "Hello World";
    String expectedReturn = "\u78da\uf348\ucdc9\uc957\u08cf\u2fca\u4901\u0018\u0b04\u1d00";
    String actualReturn = zip(source);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testCrc32() throws IOException, UnsupportedEncodingException {
    String string = "Hello World";
    long expectedReturn = 2178450716l;
    long actualReturn = crc32(string);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testHexDump() {
        char[] data = new char[] {1, 'a', 'b', '\n', 'c'};
        String expectedReturn = "\r\n0000: 0001 0061 0062 000a 0063                                                        | .ab.c\r\n";
    String actualReturn = hexDump(data);
    int diffidx = findDiff(expectedReturn, actualReturn);
    assertEquals("difference", -1, diffidx);
  }

//  public void testFormat3() {
//        assertEquals("return value", "2 + 2 = 5",
//                     format("{0} + {1} = {2}", new Byte((byte)2), new Byte((byte)2), new Long(5)));
//  }

  public void testCountLeadingSpaces() {
    assertEquals("return value", 1, countLeadingSpaces(" this is a string   "));
  }

  public void testToJavaEncoding1() {
    assertEquals("return value", "\\nFeliz A\\u00f1o Nuevo\\n\\16", toJavaEncoding("\nFeliz Año Nuevo\n\u000e"));
  }

  public void testToJavaHexEncoding() {
    assertEquals("return value", "\\u00af", toJavaHexEncoding('\u00af', false));
  }

  public void testToJavaHexEncoding1() {
    assertEquals("return value", "\\u00af", toJavaHexEncoding('\u00af'));
  }

  public void testToJavaOctalEncoding() {
    assertEquals("return value", "\\1", toJavaOctalEncoding('\u0001'));
    assertEquals("return value", "\\14", toJavaOctalEncoding('\u000c'));
    assertEquals("return value", "\\377", toJavaOctalEncoding('\u00ff'));
  }

  public void testExtractValue1() {
    String expectedReturn = "abcd";
    String actualReturn = extractValue("java.home=\"c:\\java\\jdk1.4.1\"\nx=\"abcd\"", "x");
    assertEquals("return value", expectedReturn, actualReturn);
  }
  public void testExtractValue2() {
    String expectedReturn = "c:\\java\\jdk1.4.1";
    String actualReturn = extractValue(
          "java.home=\"c:\\java\\jdk1.4.1\"\nx=\"abcd\"", "java.home");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testJoin1() {
    assertEquals("return value", "", join(", ", (Collection)null));
    assertEquals("return value", "", join(":", new HashSet()));
  }

  public void testJoin2() {
    String separator = ", ";
    List<String> list = new ArrayList<String>();
    list.add("entry1"); list.add("entry2");
    String expectedReturn = "entry1, entry2";
    String actualReturn = join(separator, list);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToHexReadable1() {
    String actual = toHexReadable(new char[] {1, 'a', 'b', '\n', 'c'});
    String expected = "0001 0061 0062 000a 0063 \r\n";
    int diffidx = findDiff(actual, expected);
    assertEquals("return value", expected, actual);
  }

  public void testHexDump1() {
    String data = "\u0001ab\nc";
    String expectedReturn = "\r\n0000: 0001 0061 0062 000a 0063                                                        | .ab.c\r\n";
    String actualReturn = hexDump(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToHexReadable2() {
    byte[] data = new byte[] {1, 2, 48};
    String expectedReturn = "02 30 \r\n";
    String actualReturn = toHexReadable(data, 1, 3);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToJavaEncoding2() {
    assertEquals("return value", "\\u00af", toJavaEncoding('\u00af', false));
    assertEquals("return value", "\\u00AF", toJavaEncoding('\u00af', true));
    assertEquals("return value", "\\n",     toJavaEncoding('\n', true));
    assertEquals("return value", "\\16",     toJavaEncoding('\16', true));
    assertEquals("return value", "\\0",     toJavaEncoding('\0', true));
    assertEquals("return value", "a",       toJavaEncoding('a',      true));
  }

  public void testCountChar() {
    assertEquals("return value", 3, countChar("Goodness me, a clock has struck", 'o'));
  }

  public void testToJavaEncoding3() {
    String actual;
    assertEquals("return value", "\\u00af", toJavaEncoding('\u00af', false, false));
    actual = toJavaEncoding('\u00af', true, true);
    assertEquals("return value", "\\u00AF", actual);
    assertEquals("return value", "\\12",    toJavaEncoding('\n',     false, false));
    assertEquals("return value", "\\n",     toJavaEncoding('\n',     true,  true));
    assertEquals("return value", "a",       toJavaEncoding('a',      true));
  }

  public void testSgmlEntity() {
    assertEquals("return value", "&#24747;",    sgmlEntity('\u60ab'));
    assertEquals("return value", "&amp;",    sgmlEntity('&'));
    assertEquals("return value", "&lt;",     sgmlEntity('<'));
    assertEquals("return value", null,       sgmlEntity('X'));
    assertEquals("return value", null,       sgmlEntity('\n'));
  }

  public void testHexDump2() {
    byte[] data = new byte[] {1, 'a', 'b', '\n', 'c'};
    String expectedReturn = "\r\n0000: 01 61 62 0a 63                                  | \u00b7 a b \u00b7 c \r\n";
    String actualReturn = hexDump(data);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToHex1() {
    assertEquals("return value", "4d2", toHex(1234));
  }

  public void testToStrings() {
    Object[] object = new Object[] { new Integer(22), new Boolean(false), "wow"};
    String[] expectedReturn =  new String[] {"22", "false", "wow"};
    String[] actualReturn = toStrings(object);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testPack() {
    String expectedReturn = "\u2367\uabef";
    String actualReturn = pack(new byte[] {0x23, 0x67, (byte)0xab, (byte)0xef});
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGrep1() {
    String[] source = new String[] {"good", "bad", "ugly"};

    Pattern regexp = null;
    try {
      regexp = Pattern.compile("g.");
    }
    catch (PatternSyntaxException ex) {
      fail(ex.toString());
    }
    List<String> expectedReturn = new ArrayList<String>();
    expectedReturn.add("good");
    expectedReturn.add("ugly");
    List actualReturn = grep(source, regexp);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToHexReadable3() {
    String s = "\u0001ab\nc";
    String expectedReturn = "0001 0061 0062 000a 0063 \r\n";
    String actualReturn = toHexReadable(s);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testNeedsEncoding() {
    assertTrue("return value", needsEncoding('\u00af'));
    assertFalse("return value", needsEncoding('a'));
  }

  public void testFill() {
    String actualReturn = fill('*', 10);
    assertEquals("return value", "**********", actualReturn);
  }

  public void testToJavaEncoding4() {
    assertEquals("return value", "\\u00af", toJavaEncoding('\u00af'));
    assertEquals("return value", "\\n",     toJavaEncoding('\n'));
    assertEquals("return value", "a",       toJavaEncoding('a'));
  }

  public void testZip2bytes() throws IOException, UnsupportedEncodingException {
    String source = "Hello World";
    byte[] expectedReturn = new byte[] {0x78, (byte)0xda, (byte)0xf3, 0x48, (byte)0xcd, (byte)0xc9, (byte)0xc9, 0x57, (byte)0x08, (byte)0xcf, 0x2f, (byte)0xca, 0x49, 0x01, 0x00, 0x18, 0x0b, 0x04, 0x1d, 0x00};
    byte[] actualReturn = zip2bytes(source);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToHex2() {
    assertEquals("return value", "12BC", toHex('\u12bc', true));
    assertEquals("return value", "00af", toHex('\u00af', false));
  }

//  public void testFormat1() {
//    assertEquals("return value", "12 Monkeys", format("{0} Monkeys", new Long(12)));
//  }

  public void testToHex3() {
    assertEquals("return value", "9b", toHex((byte)155));
  }

  public void testNeedsEncoding1() {
    assertTrue("return value", needsEncoding("Feliz Año Nuevo"));
    assertFalse("return value", needsEncoding("Feliz Navedad"));
  }

  public void testUnzip1() throws IOException, UnsupportedEncodingException {
    byte[] zippedBytes = new byte[] {0x78, (byte)0xda, (byte)0xf3, 0x48, (byte)0xcd, (byte)0xc9, (byte)0xc9, 0x57, 0x08, (byte)0xcf, 0x2f, (byte)0xca, 0x49, 0x01, 0x00, 0x18, 0x0b, 0x04, 0x1d, 0x00};
    String expectedReturn = "Hello World";
    String actualReturn = unzip(zippedBytes);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testToHex4() {
    assertEquals("return value", "006B006C12BC", toHex("kl\u12bc", true));
    assertEquals("return value", "006b006c12bc", toHex("kl\u12bc", false));
  }

  public void testToCEncoding1() {
    assertEquals("return value", "\\xabcd", toCEncoding('\uabcd'));
    assertEquals("return value", "\\xaf",   toCEncoding('\u00af'));
    assertEquals("return value", "\\n",     toCEncoding('\n'));
    assertEquals("return value", "a",       toCEncoding('a'));
  }

  public void testIsAlpha() {
    assertTrue("must be alpha", isAlpha('a'));
    assertTrue("must be alpha", isAlpha('O'));
    assertTrue("must be alpha", isAlpha('I'));
    assertTrue("must be alpha", isAlpha('l'));
    assertFalse("can't be alpha", isAlpha('+'));
    assertFalse("can't be alpha", isAlpha('0'));
    assertFalse("can't be alpha", isAlpha('|'));
    assertFalse("can't be alpha", isAlpha('1'));
  }

  public void testTextWidth() {
    assertEquals("return value", 5, textWidth("One\nTwo\nThree"));
  }

  public void testToJavaEncoding5() {
    String actual = toJavaEncoding("\nFeliz Año Nuevo\n", true, false);
    assertEquals("return value", "\\12Feliz A\\u00F1o Nuevo\\12", actual);
    assertEquals("return value", "\\nFeliz A\\u00F1o Nuevo\\n", toJavaEncoding("\nFeliz Año Nuevo\n", true, true));
    assertEquals("return value", "\\nFeliz A\\u00f1o Nuevo\\n", toJavaEncoding("\nFeliz Año Nuevo\n", false, true));
  }

  public void testZip8bit() throws IOException, UnsupportedEncodingException {
    String expectedReturn = "x\u00da\u00f3H\u00cd\u00c9\u00c9W\b\u00cf/\u00caI\u0001\u0000\u0018\u000b\u0004\u001d\u0000";
    String actualReturn = zip8bit("Hello World");
    assertEquals("return value", expectedReturn, actualReturn);
    /**@todo fill in the test code*/
  }
/*
  public void testIsVowel() {
    assertFalse("can't be vowel", isVowel('x'));
    assertTrue("must be vowel", isVowel('U'));
  }
*/
  public void testEncode() throws IOException, UnsupportedEncodingException {
    String s = "Año Nuevo";
    String encoding = null;
    byte[] expectedReturn =  new byte[] {0x41, (byte)0xc3, (byte)0xb1, 0x6f, 0x20, 0x4e, 0x75, 0x65, 0x76, 0x6f};
    byte[] actualReturn = encode(s, "UTF8");
    assertEquals("return value", expectedReturn, actualReturn);
    expectedReturn = new byte[] {0x41, (byte)0x96, 0x6f, 0x20, 0x4e, 0x75, 0x65, 0x76, 0x6f};
    actualReturn   = encode("Año Nuevo", "MacRoman");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testWordCount() {
    assertEquals("return value", 3, wordCount("This is life!"));
    assertEquals("return value", 4, wordCount("C'est la vie !"));
  }

  public void testIndexOf1() {
    String t1 = "ABCDefghDB";
    assertEquals(indexOf(t1, 'A', 0), t1.indexOf('A', 0));
    assertEquals(indexOf(t1, 'A', 1), t1.indexOf('A', 1));
    for (int i = 0; i < 10; i++) {
      assertEquals(indexOf(t1, 'B', i), t1.indexOf('B', i));
    }
  }

  public void testIndexOf2() {
    String t1 = "ABCDefghDB";
    String t2 = "ABCDefghijk";
    for (int i = 0; i < t2.length(); i++) {
      assertEquals(indexOf(t1, t2.charAt(i)),
                        t1.indexOf(    t2.charAt(i)));
    }
  }

  public void testLastIndexOf() {
    String t1 = "ABCDefghDB";
    String t2 = "ABCDefghijk";
    for (int i = 0; i < t2.length(); i++) {
      assertEquals(lastIndexOf(t1, t2.charAt(i)),
                        t1.lastIndexOf(    t2.charAt(i)));
    }
  }

  public void testIndexOf3() {
    String t1 = "ABCDefghDABCdefAB";
    String t2 = "ABC";
    for (int i = 0; i < 20; i++) {
      assertEquals(indexOf(t1, t2, i),
                        t1.indexOf(    t2, i));
    }
  }

  public void testIndexOf4() {
    String t1 = "ABCDefghDABCdefAB";
    String t2 = 'x' + t1 + 'y';
    for (int i = 0; i < 20; i++) {
      for (int j = i; j < 20; j++) {
        if (indexOf(t1, t2.subSequence(i, j)) !=
                     t1.indexOf(t2.substring(i, j))) {
                   int k = indexOf(t1, t2.subSequence(i, j));
                   System.out.println("oops");
        }
        assertEquals(indexOf(t1, t2.subSequence(i, j)),
                     t1.indexOf(t2.substring(i, j)));
      }
    }
  }

  public void testIsAlmostEmpty() {
    assertTrue("must be almost empty", isAlmostEmpty(""));
    assertTrue("must be almost empty", isAlmostEmpty(null));
    assertTrue("must be almost empty", isAlmostEmpty("\n   \r \n"));
    assertFalse("must be non-empty",   isAlmostEmpty("."));
    assertFalse("must be non-empty",   isAlmostEmpty("Contains data!"));
  }

  public void testToSgmlEncoding1() {
    assertEquals("return value", "&#10;", toSgmlEncoding('\n'));
  }

  public void testReplace() {
    String where = null;
    String oldSubstring = null;
    String newSubstring = null;
    String expectedReturn = null;
    String actualReturn = replace(where, oldSubstring, newSubstring);
    assertEquals("return value", expectedReturn, actualReturn);
    assertEquals("return value", "God hates you", replaceAll("God loves you", "love", "hate"));
    assertEquals("return value", "All you need is me, love!", replace("All you need is love, love!", "love", "me"));
  }

  public void testToPropertiesEncoding1() {
    assertEquals("return value", toPropertiesEncoding('\u00af'), "\\u00af");
    assertEquals("return value", toPropertiesEncoding('a'), "a");
  }

  public void testToString() {
    String s = null;
    String expected = "java.lang.NullPointerException\r\n" +
    "\tat com.myjavatools.lib.TestStrings";

    try {
      s.toString();
      s = "?";
    } catch (Exception e) {
      String returned = Strings.toString(e); //!!! does not compile if Strings is missing.
      assertTrue("returnValue is " + returned, returned.startsWith(expected));
    }
    assertNull(s);
  }

  public void testChars1() {
    String t = "this is the string";
    Iterator<Character> it = chars(t).iterator();
    for (int i = 0; i < t.length(); i++) {
      assertEquals(t.charAt(i), it.next());
    }
    assertFalse(it.hasNext());
  }

  public void testChars2() {
    assertFalse(chars("").iterator().hasNext());
  }
}
