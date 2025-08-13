package com.myjavatools.lib;

import junit.framework.*;
import java.io.*;
import java.util.*;
import java.util.regex.Pattern;
import static com.myjavatools.lib.Files.*;

public class TestFiles
    extends TestCase {
  private Files files = null;

  public TestFiles(String name) {
    super(name);
  }

  protected void setUp() throws Exception {
    super.setUp();
  }

  protected void tearDown() throws Exception {
    files = null;
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


  public void testRelPath_1() {
    String expectedReturn = "src\\java";
    String actualReturn = relPath("c:\\MyHome\\dev", "c:\\MyHome\\dev\\src\\java");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRelPath_2() {
    String expectedReturn = "jbuilder8/samples/welcome";
    String actualReturn = relPath("/home/zaphod", "/home/zaphod/jbuilder8/samples/welcome");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testRelPath_3() {
    String expectedReturn = "/home/ford/jbuilder8";
    String actualReturn = relPath("/home/zaphod", "/home/ford/jbuilder8");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testSplitPath_1() {
    String[] expectedReturn = new String[] {".", "src.java"};
    String[] actualReturn = splitPath("src.java");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testSplitPath_2() {
    String[] expectedReturn = new String[] {"/home/zaphod/jbuilder8/samples", "welcome"};
    String[] actualReturn = splitPath("/home/zaphod/jbuilder8/samples/welcome");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testSplitPath_3() {
    String[] expectedReturn = new String[] {"MyHome", "dev"};
    String[] actualReturn = splitPath("MyHome\\dev");
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testDirname_1() {
    assertEquals("return value", "/home/zaphod/jbuilder8/samples", dirname("/home/zaphod/jbuilder8/samples/welcome"));
  }


  public void testDirname_2() {
    assertEquals("return value", "MyHome", dirname("MyHome\\dev"));
  }

  public void testDirname_3() {
    assertEquals("return value", ".", dirname("src.java"));
  }

  public void testFilename() {
    String path = "/home/zaphod/jbuilder8/samples/welcome";
    String expectedReturn = "welcome";
    String actualReturn = filename(path);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testPath_1() {
    assertEquals("return value", "c:\\MyHome\\dev\\src\\java", path("c:\\MyHome\\dev", "src\\java"));
  }

  public void testPath_2() {
    assertEquals("return value", "/home/zaphod/jbuilder8/samples/welcome", path("/root/inetd", "/home/zaphod/jbuilder8/samples/welcome"));
  }

  public void testPath_3() {
    assertEquals("return value", "c:\\MyHome\\dev", path("\\Program Files", "c:\\MyHome\\dev"));
  }

  public void testFind() {
    try {
      List expectedReturn = Arrays.asList(new String[] {new File("src\\com\\myjavatools\\lib\\Files.java").getCanonicalPath()});
      List actualReturn = find(new File("."), Pattern.compile("src.*les\\.java$"));
      assertEquals("return value", expectedReturn, actualReturn);
    } catch (Exception ex) {
      fail("problems: " + ex);
    }
  }

  public void testFind1() {
    try {
      List expectedReturn = Arrays.asList(new String[] {new File("src\\com\\myjavatools\\lib\\Files.java").getCanonicalPath()});
      List actualReturn = find(new File("."), Pattern.compile("src.*les\\.java$"));
      assertEquals("return value", expectedReturn, actualReturn);
    }
    catch (Exception ex) {
      fail("problems: " + ex);
    }
  }

  public void testFind2() {
    List expectedReturn = Arrays.asList(new String[] {new File("src\\com\\myjavatools\\lib\\Files.java").getAbsolutePath()});
    List actualReturn = find(".", "src.*les\\.java$");
    assertEquals("return value", expectedReturn, actualReturn);
  }

//  public void testLastModified() {
//    File file = new File("src/com/myjavatools/lib/Objects.java");
//    String expectedReturn = "Thu Mar 18 10:00:18 PST 2004";
//    String actualReturn = lastModified(file);
//    assertEquals("return value", expectedReturn, actualReturn);
//  }

  public void testReadStringFromFile() {
    String path = new File(".").getAbsolutePath();
    String filename = "src/com/myjavatools/lib/foundation/Objects.java";
    String expectedReturn = "/*\r\n *  <p>Title: My Java Tools Library</p>\r\n *\r\n * <p>Description: This is a mixture of useful Java Tools</p>\r\n";
    String actualReturn = readStringFromFile(filename);
    int i = Strings.findDiff(expectedReturn, actualReturn);
    assertEquals(i, expectedReturn.length());
    assertTrue(actualReturn.startsWith(expectedReturn));
  }

  public void testReadBytesFromStream() {
    InputStream is = new ByteArrayInputStream(new byte[] {1, 2, 3, 4, 5});
    byte[] expectedReturn = new byte[] {1, 2, 3, 4, 5};
    byte[] actualReturn = readBytesFromStream(is);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testReadBytesFromFile() {
    String filename = "src/com/myjavatools/lib/Files.java";
    byte[] expectedReturn = new byte[] {47, 42, 13, 10, 32, 42, 32};
    byte[] actualReturn = new byte[7];
    System.arraycopy(readBytesFromFile(filename), 0, actualReturn, 0, 7);
    assertEquals("return value", expectedReturn, actualReturn);
  }

  public void testGetPackage() {
    String basePath = null;
    String currentPath = null;
    String expectedReturn = "com.myjavatools.util";
    String actualReturn = getPackageName("c:\\home\\myjavatools\\src", "c:\\home\\myjavatools\\src\\com\\myjavatools\\util");
    assertEquals("return value", expectedReturn, actualReturn);
    actualReturn = getPackageName("c:\\home\\myjavatools\\src\\java", "c:\\home\\myjavatools\\src\\com\\myjavatools\\util");
    assertNull("must be null", actualReturn);
  }

  public void testPipe() {
    try {
      InputStream is = new FileInputStream("src/com/myjavatools/lib/Files.java");
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      pipe(is, baos, true, new ByteFilter() {
        public byte[] filter(byte[]data, int size) {
          byte[] result = new byte[(size+1)/2];
          for (int i = 0; i < size; i+=2) {
            result[i/2] = data[i];
          }

          return result;
        }
      });
      byte[] expectedReturn = new byte[] {47, 13, 32, 32, 60, 62, 105};
      byte[] actualReturn = new byte[7];
      System.arraycopy(baos.toByteArray(), 0, actualReturn, 0, 7);
      assertEquals("return value", expectedReturn, actualReturn);
    }
    catch (Exception ex) {
      fail("got exception " + Strings.toString(ex));
    }
  }

  public void testPipe1() {
    String sample =
        "Mare bella donna,\n" +
        "Che un bel canzone,\n" +
        "Sai, che ti amo, sempre amo.\n" +
        "Donna bella mare,\n" +
        "Credere, cantare,\n" +
        "Dammi il momento,\n" +
        "Che mi piace piu'!\n" +
        "\n\n" +
        "Uno, uno, uno, un momento,\n" +
        "Uno, uno, uno sentimento,\n" +
        "Uno, uno, uno complimento\n" +
        "E sacramento, sacramento, sacramento…";

    StringWriter w = new StringWriter();

    pipe(new StringReader(sample), w);
    assertEquals("output data", sample, w.toString());
  }
/*
  public void testChdirBug() {
      new File("C:\\tmp\\tmpdir").mkdirs();
      System.setProperty("user.dir", "C:\\tmp");
      File subdir = new File("tmpdir");
      assertEquals("C:\\tmp\\tmpdir", subdir.getAbsolutePath());
      assertTrue(subdir.getAbsoluteFile().isDirectory());
      assertFalse(subdir.isDirectory());
//      fail("Oh shit, can you see...");
  }
*/
//  public void testChdir() {
//    String rootname = "D:\\tmp";
//    String filename = "testfiles.txt";
//    String rootfilename = rootname + File.separator + filename;
//    String expected = "this is a test";
//    writeToFile(expected, rootfilename);
//    System.out.println(getcwd());
//    System.setProperty("user.dir", rootname);
//    //chdir(rootname);
//    assertEquals(rootname, getcwd());
//    System.out.println(getcwd());
//    File file = new File(filename);
//    System.out.println(file.getAbsolutePath());
//    assertEquals(rootfilename, file.getAbsolutePath());
//    File rootfile = file.getAbsoluteFile();
//    assertTrue(rootfile.exists());
//    assertTrue(file.exists());
//
//    String actual = Files.readStringFromFile("testfiles.txt");
//    assertEquals(expected, actual);
//  }

  public void testCopy1() {
    String expectedReturn = "/*\r\n *  <p>Title: My Java Tools Library</p>\r\n *\r\n * <p>Description: This is a mixture of useful Java Tools</p>\r\n";
    copy("src/com/myjavatools/lib/foundation", "/tmp", "Objects.java");
    String actualReturn = readStringFromFile("/tmp/Objects.java");
    int i = Strings.findDiff(expectedReturn, actualReturn);
    assertEquals(i, expectedReturn.length());
    assertTrue(actualReturn.startsWith(expectedReturn));
  }

  public void testCopy2() {
    String expectedReturn = "/*\r\n *  <p>Title: My Java Tools Library</p>\r\n *\r\n * <p>Description: This is a mixture of useful Java Tools</p>\r\n";
    copy(new File("src/com/myjavatools/lib/foundation"), new File("/tmp"), "Objects.java");
    String actualReturn = readStringFromFile("/tmp/Objects.java");
    int i = Strings.findDiff(expectedReturn, actualReturn);
    assertEquals(i, expectedReturn.length());
    assertTrue(actualReturn.startsWith(expectedReturn));
  }

  public void testWriteToFile() {
    try {
      String expectedReturn =
          "/*\r\n *  <p>Title: My Java Tools Library</p>\r\n *";
      String filename1 = "src/com/myjavatools/lib/foundation/Objects.java";
      String filename2 = "/tmp/Objectsx.java";

      File file1 = new File(filename1);
      File file2 = new File(filename2);
      writeToFile(expectedReturn, filename2);
      assertEquals( -1, compare(file1, file2));
      assertEquals(1, compare(file2, file1));
      String actualReturn = readStringFromFile(filename2);
      assertEquals(expectedReturn, actualReturn);
    }
    catch (IOException ex) {
      fail("got " + ex);
    }
  }

  public void testCopyCompare() {
    try {
      String filename1 = "src/com/myjavatools/lib/foundation/Objects.java";
      String filename2 = "/tmp/Objects.java";

      File file1 = new File(filename1);
      File file2 = new File(filename2);
      if (!copy(filename1, filename2)) {
        fail("Failed to copy " + filename1 + " to " + filename2);
      }
      assertEquals(0, compare(file1, file2));
    }
    catch (IOException ex) {
      fail("got " + ex);
    }
  }

  long timeCopy(String name1, String name2) {
    File file1 = new File(name1);
    File file2 = new File(name2);
    file2.delete();
    if (file2.exists()) {
      fail("Could not remove " + file2 + " before copying to it.");
      return -1;
    }
    long t0 = System.nanoTime();

    if (!copy(file1, file2)) {
      fail("Failed to copy " + file1 + " to " + file2);
      return -1;
    }
    long t1 = System.nanoTime();
    return t1 - t0;
  }

  long copyFixture() {
    long time = -1;
    for (int i = 0;
         new File("/tmp/myjavatools/marvin" + i + ".zip").exists();
         i++) {
      time = timeCopy("/tmp/myjavatools/marvin" + i + ".zip",
                      "/tmp/myjavatools/marvin/t" + i + "/m.zip");
    }
    return time;
  }

  long copyTimesFixture(int n) {
    long sum = 0;
    int total = 0;
    for (int i = 0; i < n; i++) {
      long time = copyFixture();
      if (time > 0) {
        sum += time;
        total++;
      }
    }
    return total == 0 ? -1 : sum/total;
  }
/*
  public void testNioCopy1() {
    long timeNio = copyTimesFixture(10);
    if (timeNio > 0) {
      System.out.println("it took " + (timeNio / 1000000000.0) +
                         " seconds to copy with NIO");
    }
    Files.USE_NIO = false;
    long timeOld = copyTimesFixture(10);
    if (timeOld > 0) {
      System.out.println("it took " + (timeOld / 1000000000.0) +
                         "seconds to copy without NIO");
    }

    if (timeNio > 0 && timeOld > 0) {
      long d = timeOld < timeNio ? timeNio - timeOld : timeOld - timeNio;
      System.out.println((timeNio > timeOld ? "Old way is " : "Nio is ") +
                         (d / 1000000.0) + " milliseconds faster");
    }
  }
*/
  /*
  public void testNioCopy2() {
    String filename1 = "/tmp/myjavatools/s0.jar";
    String filename2 = "/tmp/myjavatools/t0/s.jar";
    long t0 = System.nanoTime();

    if (!copy(filename1, filename2)) {
      fail("Failed to copy " + filename1 + " to " + filename2);
    }
    long t1 = System.nanoTime();
    System.out.println("it took " + ((t1 - t0) / 1000000000.0) + "seconds to copy " + filename1 + " with NIO");
    filename1 = "/tmp/myjavatools/s1.jar";
    filename2 = "/tmp/myjavatools/t1/s.jar";
    Files.USE_NIO = false;
    t0 = System.nanoTime();
    if (!copy(filename1, filename2)) {
      fail("Failed to copy " + filename1 + " to " + filename2);
    }
    t1 = System.nanoTime();
    Files.USE_NIO = true;
    System.out.println("it took " + ((t1 - t0) / 1000000000.0) + "seconds to copy " + filename1 + " without NIO");

    File file1 = new File(filename1);
    File file2 = new File(filename2);
    assertTrue(equal(file1, file2));
  }*/
/*
  public void testCopy5() {
    String filename1 = "/tmp/myjavatools/t0";
    String filename2 = "/tmp/myjavatools/test50";
    long t0 = System.nanoTime();

    if (!copy(filename1, filename2)) {
      fail("Failed to copy " + filename1 + " to " + filename2);
    }
    long t1 = System.nanoTime();
    System.out.println("it took " + (t1 - t0) + " to copy " + filename1 + " with NIO");
    File file1 = new File(filename1);
    File file2 = new File(filename2);
    assertTrue(equal(file1, file2));
  }
*/
  public void testCopyAndCompare() {
    copy("src/com/myjavatools/lib", "/tmp/myjavatools/lib");
    String list1 = Strings.join(",", new File("src/com", "myjavatools/lib").list());
    String list2 = Strings.join(",", new File("/tmp",    "myjavatools/lib").list());
    assertEquals(list1, list2);
  }

  public void testSynchronize() {
    File folder1 = new File("src/com");
    File folder2 = new File("/tmp/myjavatools/tmp" + new Date().getTime());
    folder2.mkdirs();
    synchronize(folder1, folder2);
    String list1 = Strings.join(",", new File(folder1, "myjavatools/lib").list());
    String list2 = Strings.join(",", new File(folder2, "myjavatools/lib").list());
    assertEquals(list1, list2);
    deleteFile(folder2);
    assertFalse(folder2.isDirectory());
  }

  public void testBytes1() {
    String path = new File(".").getAbsolutePath();
    String filename = "src/com/myjavatools/lib/foundation/Objects.java";
    String expectedReturn = "/*\r\n *  <p>Title: My Java Tools Library</p>\r\n *\r\n * <p>Description: This is a mixture of useful Java Tools</p>\r\n";
    int i = 0;

    try {
      for (byte b : bytes(new FileInputStream(filename))) {
        assertEquals("byte #" + i, expectedReturn.charAt(i++), b);
      }
    } catch (FileNotFoundException ex) {
      fail(ex.getMessage());
    } catch (StringIndexOutOfBoundsException siobex) {
      // that's good!
    }
  }

  public void testChars1() {
    String path = new File(".").getAbsolutePath();
    String filename = "src/com/myjavatools/lib/foundation/Objects.java";
    String expectedReturn = "/*\r\n *  <p>Title: My Java Tools Library</p>\r\n *\r\n * <p>Description: This is a mixture of useful Java Tools</p>\r\n";
    int i = 0;

    try {
      for (char b : chars(new FileReader(filename))) {
        assertEquals("char #" + i, expectedReturn.charAt(i++), b);
      }
    } catch (FileNotFoundException ex) {
      fail(ex.getMessage());
    } catch (StringIndexOutOfBoundsException siobex) {
      // that's good!
    }
  }

  public void testLines1() {
    String path = new File(".").getAbsolutePath();
    String filename = "src/com/myjavatools/lib/foundation/Objects.java";
    String[] expectedReturn = new String[] {"/*", " *  <p>Title: My Java Tools Library</p>", " *", " * <p>Description: This is a mixture of useful Java Tools</p>"};
    int i = 0;

    try {
      for (String s : lines(new FileReader(filename))) {
        assertEquals("line #" + i, expectedReturn[i++], s);
      }
    } catch (FileNotFoundException ex) {
      fail(ex.getMessage());
    } catch (ArrayIndexOutOfBoundsException siobex) {
      // that's good!
    }
  }

  public void testBytes2() {
    String path = new File(".").getAbsolutePath();
    String filename = "src/com/myjavatools/lib/foundation/Objects.java";
    String expectedReturn = "/*\r\n *  <p>Title: My Java Tools Library</p>\r\n *\r\n * <p>Description: This is a mixture of useful Java Tools</p>\r\n";
    int i = 0;

    try {
      for (byte b : bytes(new File(filename))) {
        assertEquals("byte #" + i, expectedReturn.charAt(i++), b);
      }
    } catch (StringIndexOutOfBoundsException siobex) {
      // that's good!
    }
  }

  public void testChars2() {
    String path = new File(".").getAbsolutePath();
    String filename = "src/com/myjavatools/lib/foundation/Objects.java";
    String expectedReturn = "/*\r\n *  <p>Title: My Java Tools Library</p>\r\n *\r\n * <p>Description: This is a mixture of useful Java Tools</p>\r\n";
    int i = 0;

    try {
      for (char b : chars(new File(filename))) {
        assertEquals("char #" + i, expectedReturn.charAt(i++), b);
      }
    } catch (StringIndexOutOfBoundsException siobex) {
      // that's good!
    }
  }

  public void testLines2() {
    String path = new File(".").getAbsolutePath();
    String filename = "src/com/myjavatools/lib/foundation/Objects.java";
    String[] expectedReturn = new String[] {"/*", " *  <p>Title: My Java Tools Library</p>", " *", " * <p>Description: This is a mixture of useful Java Tools</p>"};
    int i = 0;

    try {
      for (String s : lines(new File(filename))) {
        assertEquals("line #" + i, expectedReturn[i++], s);
      }
    } catch (ArrayIndexOutOfBoundsException siobex) {
      // that's good!
    }
  }

  public void testFiles() {
    int n = 0;
    for (File f : files(new File("src/com/myjavatools/lib/human"))) {
      n++;
//      System.out.println(f);
    }

    assertEquals(3, n);
  }

  public void testTree() {
    Set<File> check = new HashSet<File>();
    check.add(new File("src/com/myjavatools"));
    check.add(new File("src/com/myjavatools/lib"));
    check.add(new File("src/com/myjavatools/lib/foundation"));
    check.add(new File("src/com/myjavatools/lib/human"));

    for (File f : tree(new File("src/com/myjavatools"))) {
//      System.out.println(f);
      assertTrue("must have contained " + f, check.remove(f));
    }
    assertEquals("must be empty now", check.size(), 0);
  }

  public void testTree1() {
    for (File dir : tree(new File("src/com/myjavatools"))) {
      System.out.println(dir);
      for (File f : files(dir)) {
        System.out.println("  " + f);
      }
    }
  }

  public void testTree2() {
    Set<File> check = new HashSet<File>();
    check.add(new File("src/com/myjavatools/lib"));
    check.add(new File("src/com/myjavatools/lib/foundation"));
    check.add(new File("src/com/myjavatools/lib/human"));
    check.add(new File("src/com/myjavatools"));

    for (File f : treePostorder(new File("src/com/myjavatools"))) {
      System.out.println(f);
      assertTrue("must have contained " + f, check.remove(f));
    }
    assertEquals("must be empty now", check.size(), 0);
  }

  public void testTree3() {
    Set<File> check = new HashSet<File>();
    check.add(new File("src/com/myjavatools"));
    check.add(new File("src/com/myjavatools/lib"));
    check.add(new File("src/com/myjavatools/lib/human"));

    for (File f : tree(new File("src/com/myjavatools"),
                       new FileFilter() {
                         public boolean accept(File file) {
                           return !file.getPath().contains("tion");
                         }
                       })) {
      System.out.println(f);
      assertTrue("Should not contain " + f, check.remove(f));
    }
    assertEquals("must be empty now", check.size(), 0);
  }
}
