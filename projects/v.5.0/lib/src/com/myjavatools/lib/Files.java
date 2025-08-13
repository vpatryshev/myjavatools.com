/*
 *  <p>Title: My Java Tools Library</p>
 *
 * <p>Description: This is a mixture of useful Java Tools</p>
 *
 * @(#)Files.java	5.0 02/08/05
 *
 * <p>Copyright: This is public domain; The right of people to use, distribute,
 * copy or improve the contents of the following may not be restricted.</p>
 */

package com.myjavatools.lib;

import java.io.*;
import java.util.*;
import java.util.regex.*;
import java.util.zip.*;
import static com.myjavatools.lib.Bytes.*;
import static com.myjavatools.lib.foundation.Iterators.*;
import static com.myjavatools.lib.foundation.Objects.*;
import static com.myjavatools.lib.Strings.*;
import java.nio.channels.FileChannel;
import java.nio.ByteBuffer;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.Channels;
import java.nio.MappedByteBuffer;
import java.net.URL;

/**
 * Files is a utility class that contains static methods for handling files and directories
 *
 * @version 5.0, 02/08/05
 * @since 5.0
 */

public abstract class Files
{
  private static final boolean DEBUG = true;
  private static final char altSeparatorChar = File.separatorChar == '/' ? '\\' : '/';

  /**
   * Calculates full path of a file
   * @param file
   * @return full path
   */
  public static final String getFullPath(File file) {
    try {
      return file.getCanonicalPath();
    }
    catch (IOException ex) {
    }
    return file.getAbsolutePath();
  }

  /**
   * Calculates full path of a file by its path
   * @param path
   * @return full path
   */
  public static final String getFullPath(String path) {
    return getFullPath(new File(path));
  }

  /**
   * Calculates relative path
   *
   * @param dir directory path that is expected to start the file path
   * @param path file path, relativer or not
   * @return if path starts with dir, then the rest of the path, else path
   *
   * <br><br><b>Examples</b>:
   * <li><code>relPath("c:\\MyHome\\dev", "c:\\MyHome\\dev\\src\\java")</code> returns "src\\java";</li>
   * <li><code>relPath("/home/zaphod", "/home/zaphod/jbuilder8/samples/welcome")</code> returns "jbuilder8/samples/welcome";</li>
   * <li><code>relPath("/home/zaphod", "/home/ford/jbuilder8")</code> returns "/home/ford/jbuilder8".</li>
   */

  public static String relPath(String dir, String path) {
    String fullpath = getFullPath(path);
    String fulldir  = getFullPath(dir);
    if (!fullpath.startsWith(fulldir + File.separatorChar)) {
      return path;
    }
    String result = fullpath.substring(fulldir.length() + 1);

    if (dir.indexOf(File.separatorChar)  < 0 &&
        path.indexOf(File.separatorChar) < 0 &&
        (dir.indexOf(altSeparatorChar) >= 0 ||
          path.indexOf(altSeparatorChar) >= 0)) {
        return result.replace(File.separatorChar, altSeparatorChar);
    }
    return result;
  }

  /**
   * Having a directory and file path (relative or absolute) calculates full path
   *
   * @param currentDir directory path
   * @param filepath file path, relative or not
   * @return full file path
   *
   * <br><br><b>Examples</b>:
   * <li><code>path("c:\\MyHome\\dev", "src\\java")</code> returns "c:\\MyHome\\dev\\src\\java";</li>
   * <li><code>path("/root/inetd", "/home/zaphod/jbuilder8/samples/welcome")</code> returns "/home/zaphod/jbuilder8/samples/welcome";</li>
   * <li><code>path("\\Program Files", "c:\\MyHome\\dev")</code> returns "c:\\MyHome\\dev".</li>
   */
  public static String path(String currentDir, String filepath) {
    return (filepath.charAt(0) == File.separatorChar ||
            filepath.charAt(0) == altSeparatorChar   ||
            filepath.indexOf(':') > 0 ||
            isEmpty(currentDir)) ? filepath :
           (currentDir +
            (currentDir.endsWith(File.separator) ? "" : File.separator) +
            filepath);
  }

  /**
   * Splits a path into directory name and file name
   *
   * @param path
   * @return String array consisting of two elements
   *
   * <br><br><b>Examples</b>:
   * <li><code>splitPath("/home/zaphod/jbuilder8/samples/welcome")</code> returns {"/home/zaphod/jbuilder8/samples", "welcome"};</li>
   * <li><code>splitPath("src.java")</code> returns {".", "src.java"};</li>
   * <li><code>splitPath("MyHome\\dev")</code> returns {"MyHome", "dev"}.</li>
   */
  public static String[] splitPath(String path) {
    return new String[] {dirname(path), new File(path).getName()};
  }

  /**
   * Calculates directory path for a file (like in Perl)
   *
   * @param file
   * @return directory path
   *
   * Unlike java.io.File.getParent(), never returns null (see example 2 below).
   *
   * <br><br><b>Examples</b>:
   * <li><code>dirname(new File("/home/zaphod/jbuilder11/samples/welcome"))</code> returns "/home/zaphod/jbuilder8/samples";</li>
   * <li><code>dirname(new File("src.java"))</code> returns ".";</li>
   * <li><code>dirname(new File("MyHome\\dev"))</code> returns "MyHome".</li>
   */
  public static String dirname(File file) {
    String parent = file.getParent();
    if (parent == null) parent = ".";
    if (file.getPath().indexOf(File.separatorChar)  < 0 &&
        file.getPath().indexOf(altSeparatorChar)    >= 0 &&
        parent.indexOf(File.separatorChar) >= 0) {
        parent = parent.replace(File.separatorChar, altSeparatorChar);
    }
    return parent;
  }

  /**
   * Calculates directory path by file path (like in Perl)
   *
   * @param path
   * @return directory path
   *
   * Unlike java.io.File.getParent(), never returns null (see example 2 below).
   *
   * <br><br><b>Examples</b>:
   * <li><code>dirname("/home/zaphod/jbuilder11/samples/welcome")</code> returns "/home/zaphod/jbuilder8/samples";</li>
   * <li><code>dirname("src.java")</code> returns ".";</li>
   * <li><code>dirname("MyHome\\dev")</code> returns "MyHome".</li>
   */
  public static String dirname(String path) {
    String dirname = dirname(new File(path));
    if (path.indexOf(altSeparatorChar) >= 0 &&
        path.indexOf(File.separatorChar) < 0) {
      return dirname.replace(File.separatorChar, altSeparatorChar);
    }
    return dirname;
  }

  /**
   * Calculates filename by file path (like in Perl)
   *
   * @param path
   * @return file name
   *
   * <br><br><b>Example</b>:
   * <li><code>filename("/home/zaphod/jbuilder11/samples/welcome")</code> returns "welcome".</li>
   */
  public static String filename(String path) {
    return new File(path).getName();
  }

  /**
   * Lists recursively files and directories with name matching a regexp
   *
   * @param subdir where to look
   * @param pattern to match
   * @return List&lt;String> of absolute filepaths
   *
   * <br><br><b>Example</b>:
   * <li><code>find(new File("."), Pattern.compile(".*les\\.java$")))</code> returns
   * Arrays.asList(new String[] {new File("Files.java").getCanonicalPath()}).</li>
   */
  public static List<String> find(File subdir, Pattern pattern) {
    List<String> resultSet = new ArrayList<String>();
    File contents[] = subdir.listFiles();

    for (File file : contents) {
      String path = getFullPath(file);
      if (file.isDirectory()) {
        resultSet.addAll(find(file, pattern));
      } else if (pattern.matcher(path).find()) {
        resultSet.add(path);
      } else {
        path = path.replace(File.separatorChar, '/');
        if (pattern.matcher(path).find()) {
          resultSet.add(path);
        }
      }
    }
    return resultSet;
  }

  /**
   * Lists recursively files and directories with name matching a regexp
   *
   * @param subdir where to look
   * @param pattern to match
   * @return List&lt;String> of absolute filepaths
   *
   * <br><br><b>Example</b>:
   * <li><code>find(".", Pattern.compile(".*les\\.java$")))</code> returns
   * Arrays.asList(new String[] {"Files.java"}).</li>
   */
  public static List<String> find(String subdir, Pattern pattern) {
    return find(new File(subdir), pattern);
  }

  /**
   * Lists recursively files and directories with name matching a regexp
   *
   * @param subdir where to look
   * @param pattern to match
   * @return List&lt;String> of absolute filepaths
   *
   * <br><br><b>Example</b>:
   * <li><code>find(".", ".*les\\.java$")</code> returns
   * Arrays.asList(new String[] {"Files.java"}).</li>
   */
  public static List<String> find(String subdir, String pattern) {
    try {
      return find(subdir, Pattern.compile(pattern, Pattern.CASE_INSENSITIVE));
    } catch (Exception e) {
      return new ArrayList<String>();
    }
  }

  public final static int FIND_FILE      = 1;
  public final static int FIND_DIRECTORY = 2;
  public final static int FIND_ALL       = 3;

  /**
   * Finds latest file or directory or one of these which name matches a pattern
   *
   * @param subdir where to look
   * @param pattern to match
   * @param whatExactly can be FIND_FILE or FIND_DIRECTORY or FIND_ALL
   * @return the path found
   */
  public static String findLatest(String subdir, String pattern, int whatExactly) {
    String currentFile = null;
    long currentTime = 0;
    for (String path : find(subdir, pattern)) {
      File candidate = new File(path);
      boolean isGood = ((candidate.isDirectory() ? FIND_DIRECTORY :
                        candidate.isFile()      ? FIND_FILE      : 0)
                        & whatExactly) != 0;
      if (currentTime < candidate.lastModified() && isGood) {
        try {
          currentTime = candidate.lastModified();
          currentFile = candidate.getCanonicalPath();
        } catch (Exception e) {}
      }
    }
    return currentFile;
  }

  /**
   * Finds latest file or directory which name matches a pattern
   *
   * @param subdir where to look
   * @param pattern to match
   * @return the path found
   */
  public static String findLatest(String subdir, String pattern) {
    return findLatest(subdir, pattern, FIND_ALL);
  }

  /**
   * Finds latest file which name matches a pattern
   *
   * @param subdir where to look
   * @param pattern to match
   * @return the path found
   */
  public static String findLatestFile(String subdir, String pattern) {
    return findLatest(subdir, pattern, FIND_FILE);
  }

  /**
   * Finds latest directory which name matches a pattern
   *
   * @param subdir where to look
   * @param pattern to match
   * @return the path found
   */
  public static String findLatestDirectory(String subdir, String pattern) {
    return findLatest(subdir, pattern, FIND_DIRECTORY);
  }

  /**
   * directoryFilter is a FileFilter that accepts directories only
   */
  static public FileFilter DIRECTORY_FILTER = new FileFilter() {
    public boolean accept(File file) {
      return file.isDirectory();
    }
  };

  /**
   * fileFilter is a FileFilter that accepts files only
   */
  static public FileFilter fileFilter = new FileFilter() {
    public boolean accept(File file) {
      return file.isFile();
    }
  };

  /**
   * Lists subdirectories of a directory
   * @param dir directory name
   * @return an array of subdirectores
   */
  public static final File[] listSubdirectories(File dir) {
    return dir.isDirectory() ? dir.listFiles(DIRECTORY_FILTER) : null;
  }

  /**
   * Lists files in a directory
   * @param dir directory name
   * @return an array of files
   */
  public static final File[] listFiles(File dir) {
    return dir.isDirectory() ? dir.listFiles(fileFilter) : null;
  }

  /**
   * Gets file modification date/time as a string
   * @param file
   * @return file modification time as a string
   *
   * <br><br><b>Example</b>:
   * <li><code>lastModified(new File("src/com/javatools/util/Objects.java"))</code> returns
   * "something".</li>
   */
  public static final String lastModified(File file) {
    return (new Date(file.lastModified())).toString();
  }

  /**
   * Gets current directory path
   *
   * @return the current directory path
   */
  public static String getcwd() {
    File here = new File(".");
    try {
      return here.getCanonicalPath();
    } catch (Exception e) {};
    return here.getAbsolutePath();
//    return System.getProperty("user.dir");
  }

//  /**
//   * Changes current directory
//   *
//   * @param dir to chdir
//   * @return previous current directory
//   */
//  public static String chdir(String dir) {
//    String cwd = System.getProperty("user.dir");
//
//    if (dir != null) System.setProperty("user.dir", dir);
//    return cwd;
//  }

  /**
   * Deletes a file or a directory (with all its contents, they say it is dangerous)
   * @param filename
   * @return true if successful
   *
   * <br><br><b>Bad Example</b>:
   * <li><code>deleteFile("/etc")</code> returns true if the program runs as root.</li>
   */
  public static boolean deleteFile(String filename) {
    return deleteFile(new File(filename));
  }

  /**
   * Deletes a file or a directory (with all its contents, they say it is dangerous)
   * @param file to delete
   * @return true if successful
   *
   */
  public static boolean deleteFile(File file) {
    try {
      if (file.isDirectory()) {
        String fullpath = file.getCanonicalPath();

        for (String filename : file.list()) {
          deleteFile(new File(fullpath, filename));
        }
      }
      return !file.exists() || file.delete();
    } catch (Exception e) {}

    return false;
  }

  /**
   * Creates or opens a file for output.
   * If subdirectories in the path do not exist, they are created too.
   * If the file exists, it is overwritten, unless <code>append</code> is <b>true</b>.
   * <code>append</code> determines whether to open in <i>append</i> mode
   *
   * @param dirname file location
   * @param filename the name of the file
   * @param append <b>true</b> if open in <i>append</i> mode
   * @return file output stream
   * @throws IOException
   */
  public static FileOutputStream makeFile(String dirname, String filename, boolean append)
    throws IOException {

    if (isEmpty(dirname)) {
      return new FileOutputStream(new File(filename), append);
    } else {
      File dir = new File(dirname);
      if (!dir.isDirectory()) {
        if (dir.exists()) dir.delete();
        dir.mkdirs();
      }
      return new FileOutputStream(new File(dirname, filename), append);
    }
  }

  /**
   * Creates or opens a file for output.
   * If subdirectories in the path do not exist, they are created too.
   * If the file exists, it is overwritten.
   *
   * @param dir file location
   * @param filename the name of the file
   * @return file output stream
   * @throws IOException
   */
  public static FileOutputStream makeFile(String dir, String filename)
    throws IOException {
    return makeFile(dir, filename, false);
  }

  /**
   * Creates or opens a file for output.
   * If subdirectories in the path do not exist, they are created too.
   * If the file exists, it is overwritten, unless <code>append</code> is <b>true</b>.
   * <code>append</code> determines whether to open in <i>append</i> mode
   *
   * @param path [0] is directory name, [1] is file name
   * @param append <b>true</b> if open in <i>append</i> mode
   * @return file output stream
   * @throws IOException
   */
  public static FileOutputStream makeFile(String[] path, boolean append)
    throws IOException {
    return makeFile(path[0], path[1], append);
  }

  /**
   * Creates or opens a file for output.
   * If subdirectories in the path do not exist, they are created too.
   * If the file exists, it is overwritten.
   *
   * @param path String[] - a compound file path, ending with file name
   * @return file output stream
   * @throws IOException
   */
  public static FileOutputStream makeFile(String... path)
    throws IOException {
    return path.length < 1 ? null :
           path.length < 2 ? makeFile(path[0]) :
           path.length < 3 ? makeFile(path[0], path[1]) :
                             makeFile(join(File.separator, path));
  }

  /**
   * Creates or opens a file for output.
   * If subdirectories in the path do not exist, they are created too.
   * If the file exists, it is overwritten, unless <code>append</code> is <b>true</b>.
   * <code>append</code> determines whether to open in <i>append</i> mode
   *
   * @param path file path
   * @param append <b>true</b> if open in <i>append</i> mode
   * @return file output stream
   * @throws IOException
   */
  public static FileOutputStream makeFile(String path, boolean append)
    throws IOException {
    return makeFile(splitPath(path), append);
  }

  /**
   * Creates or opens a file for output.
   * If subdirectories in the path do not exist, they are created too.
   * If the file exists, it is overwritten.
   *
   * @param path file path
   * @return file output stream
   * @throws IOException
   */
  public static FileOutputStream makeFile(String path)
    throws IOException {
    return makeFile(splitPath(path));
  }

  /**
   * Creates or opens a file for output.
   * If subdirectories in the path do not exist, they are created too.
   * If the file exists, it is overwritten, unless <code>append</code> is <b>true</b>.
   * <code>append</code> determines whether to open in <i>append</i> mode
   *
   * @param file the file to open
   * @param append <b>true</b> if open in <i>append</i> mode
   * @return file output stream
   * @throws IOException
   */
  public static FileOutputStream makeFile(File file, boolean append)
    throws IOException {
    return makeFile(file.getCanonicalPath(), append);
  }

  /**
   * Creates or opens a file for output.
   * If subdirectories in the path do not exist, they are created too.
   * If the file exists, it is overwritten.
   *
   * @param file the file to open
   * @return file output stream
   * @throws IOException
   */
  public static FileOutputStream makeFile(File file)
    throws IOException {
    return makeFile(file.getCanonicalPath());
  }

  /**
   * Creates or opens a file for output.
   * If subdirectories in the path do not exist, they are created too.
   * If the file exists, it is overwritten.
   *
   * @param path the file to open
   * @param encoding the encoding to use
   * @return output stream writer
   * @throws IOException
   */
  public static final OutputStreamWriter makeFileWriter(String path, String encoding)
    throws IOException {
    return new OutputStreamWriter(makeFile(path), encoding);
  }

  /**
   * Adjusts buffer size according to Moore's law
   * @param size int original buffer size
   * @param thisYear int the year this specific size was chosen
   * @return int buffer size adjusted by Moore's law: "double it every three years"
   */
  public static final int adjustSizeByMooreLaw(int size, int thisYear) {
    double milli = System.currentTimeMillis();
    double aYear = (double)1000 * 60 * 60 * 24 * (365 * 4 + 1) / 4;
    double q = Math.exp((milli / aYear + 1970 - thisYear) / 3 * Math.log(2));
    return (int)(size * q);
  }

  /**
   * Reads the whole reader contents into a string
   *
   * @param reader the reader to read
   * @return contents as a string, or null if error occurred
   *
   */
  private final static int MAX_BUFFER_SIZE = Files.adjustSizeByMooreLaw(65536, 2004);

  public static final String readString(Reader reader) {
    try {
      StringBuffer buf = new StringBuffer();
      char[] chars = new char[MAX_BUFFER_SIZE];
      int l;
      while ((l = reader.read(chars)) > 0) {
        buf.append(chars, 0, l);
      }
      return buf.toString();
    } catch (Exception e) {
    }
    return null;
  }
  /**
   * Reads the whole file into a string
   *
   * @param file the file to read
   * @return file contents as a string, or null if error occurred
   *
   * <br><br><b>Example</b>:
   * <li><code>readStringFromFile("../src/com/myjavatools/utils/Files.java")</code>
   * returns a string starting with "/**\r\n * &lt;p>Title: MyJavaTools: Files handling Tools&lt;/p>\r\n*".</li>
   */
  public static final String readStringFromFile(File file) {
    try {
      return readString(new FileReader(file));
    } catch (Exception e) {
      if (DEBUG) System.out.println(e);
    }
    return null;
  }

   /**
    * Reads the whole file into a string
    *
    * @param file the file to read
    * @param encoding the expected encoding
    * @return file contents as a string, or null if error occurred
    *
    */
   public static final String readStringFromFile(File file, String encoding) {
     try {
       return readString(new InputStreamReader(new FileInputStream(file), encoding));
     } catch (Exception e) {
     }
     return null;
   }

  /**
   * Reads the whole file into a string
   *
   * @param filename the file to read
   * @return file contents as a string, or null if error occurred
   *
   * <br><br><b>Example</b>:
   * <li><code>readStringFromFile("../src/com/myjavatools/utils/Files.java")</code>
   * returns a string starting with "/**\r\n * &lt;p>Title: MyJavaTools: Files handling Tools&lt;/p>\r\n*".</li>
   */
  public static final String readStringFromFile(String filename) {
    return readStringFromFile(new File(filename));
  }
  /**
   * Reads the whole input stream into a byte array
   *
   * @param is input stream to read
   * @return file contents as byte array, or null if error occurred
   *
   * <br><br><b>Example</b>:
   * <li><code>readBytesFromStream(new ByteArrayInputStream(new byte[] {1, 2, 3, 4, 5}))</code>
   * returns new byte[] {1, 2, 3, 4, 5}.</li>
   */
  public static final byte[] readBytesFromStream(InputStream is) {
    try {
      ArrayList<byte[]> chunkList = new ArrayList<byte[]>();
      int total = 0;
      int l;

      while ((l = is.available()) > 0) {
        byte[] chunk = new byte[l];
        is.read(chunk);
        chunkList.add(chunk);
        total += l;
      }
      byte[] buffer = new byte[total];
      int pos = 0;
      for (byte[] chunk : chunkList) {
        java.lang.System.arraycopy(chunk, 0, buffer, pos, chunk.length);
      }
      return buffer;
    } catch (Exception e) {
    }
    return null;
  }

  /**
   * Reads the whole input stream into a byte array
   *
   * @param filename file to read
   * @return file contents as byte array, or null if error occurred
   *
   * <br><br><b>Example</b>:
   * <li><code>readBytesFromFile("../src/com/myjavatools/utils/Files.java")</code>
   * returns a byte array starting with {51, 50, 50, 13, 10, 32, 50}.</li>
   */
  public static final byte[] readBytesFromFile(String filename) {
    try {
      File file = new File(filename);
      long fullsize = file.length();
      if (fullsize > Integer.MAX_VALUE) {
        throw new IOException("File too large");
      }
      FileChannel channel = new FileInputStream(file).getChannel();
      MappedByteBuffer buffer = channel.map(FileChannel.MapMode.READ_ONLY, 0, file.length());
      byte[] result = new byte[(int)fullsize];
      buffer.get(result);
      return result;
//      return readBytesFromStream();
    } catch (Exception e) {
    }
    return null;
  }

  /**
   * Creates a file and writes a char sequence into it
   *
   * @param data the char sequence to write to file
   * @param fileTo file path
   * @return file
   */
  public static final File writeToFile(CharSequence data, String fileTo) {
    try {
      File file = new File(fileTo);
      OutputStreamWriter sw = new OutputStreamWriter(makeFile(file));
      write(sw, data);
      sw.close();
      return file;
    } catch (Exception e) {
    }
    return null;
  }

  /**
   * Creates a file and writes chars into it
   *
   * @param data array of characters to write to file
   * @param fileTo file path
   * @return file
   */
  public static final File writeToFile(char[] data, String fileTo) {
    try {
      File file = new File(fileTo);
      OutputStreamWriter sw = new OutputStreamWriter(makeFile(file));
      sw.write(data);
      sw.close();
      return file;
    } catch (Exception e) {
    }
    return null;
  }

  /**
   * Creates a file and writes bytes into it
   *
   * @param data array of bytes to append to the end of file
   * @param fileTo file path
   * @return file
   */
  public static final File writeToFile(byte[] data, String fileTo) {
    try {
      File file = new File(fileTo);
      OutputStream os = makeFile(file);
      os.write(data);
      os.close();
      return file;
    } catch (Exception e) {
    }
    return null;
  }

  /**
   * Writes bytes to a file
   *
   * @see #writeToFile(byte[],String)
   * @return file
   */
  public static final File writeBytesToFile(byte[] data, String fileTo) {
    return writeToFile(data, fileTo);
  }

  /**
   * Creates a file and copies into it bytes from an input stream
   *
   * @param is input stream
   * @param fileTo file path
   * @throws IOException
   * @return file
   */
  public static final File writeToFile(InputStream is, String fileTo)
    throws IOException {
    File file = new File(fileTo);
    OutputStream os = makeFile(file);
    pipe(is, os, false);
    os.close();
    return file;
  }

  /**
   * Appends a char sequence to the end of a file
   *
   * @param data char sequence to append to the end of file
   * @param fileTo file path
   * @return file
   */
  public static final File appendToFile(CharSequence data, String fileTo) {
    try {
      File file = new File(fileTo);
      OutputStreamWriter sw = new OutputStreamWriter(makeFile(file, true));
      write(sw, data);
      sw.close();
      return file;
    } catch (Exception e) {
    }
    return null;
  }

  /**
   * Appends chars to the end of a file
   *
   * @param data array of characters to append to the end of file
   * @param fileTo file path
   * @return file
   */
  public static final File appendToFile(char[] data, String fileTo) {
    try {
      File file = new File(fileTo);
      OutputStreamWriter sw = new OutputStreamWriter(makeFile(file, true));
      sw.write(data);
      sw.close();
      return file;
    } catch (Exception e) {
    }
    return null;
  }

  /**
   * Appends bytes to the end of a file
   *
   * @param data array of characters to append to the end of file
   * @param fileTo file path
   * @return file
   */
  public static final File appendToFile(byte[] data, String fileTo) {
    try {
      File file = new File(fileTo);
      OutputStream os = makeFile(file, true);
      os.write(data);
      os.close();
      return file;
    } catch (Exception e) {
    }
    return null;
  }

  /**
   * Appends bytes to the end of a file
   *
   * @param data chars to append are converted to bytes
   * @param fileTo
   * @return file
   */
  public static final File appendBytesToFile(char[] data, String fileTo) {
    return appendBytesToFile(toBytes((char[])data), fileTo);
  }

  /**
   * Appends bytes to a file
   * @see #appendToFile(byte[],String)
   */
  public static final File appendBytesToFile(byte[] data, String fileTo) {
    return appendToFile(data, fileTo);
  }

  /**
   * Calculates a java package name by directory name and base directory name
   *
   * @param basePath the base path for code source
   * @param currentPath the path of current directory
   * @return package name
   *
   * <br><br><b>Examples</b>:
   * <li><code>getPackageName("c:\\home\\myjavatools\\src", "c:\\home\\myjavatools\\src\\com\\myjavatools\\util")</code>
   * returns "com.myjavatools.util".</li>
   * <li><code>getPackageName("c:\\home\\myjavatools\\src\\java", "c:\\home\\myjavatools\\src\\com\\myjavatools\\util")</code>
   * returns null.</li>
   *
   */
  public static final String getPackageName(String basePath, String currentPath) {
    String path = relPath(basePath, currentPath);
    return path == null ? null :
           path.equals(currentPath) ? null :
           path.replace(File.separatorChar, '.');
  }

  /**
   * <p>Description: The interface is used to define filters for
   * filtering data in pipes. Filters, similar to those in JSPs, can modify
   * the bytes going from one end of the pipe to another, or just sniff them
   * and act based on results - e.g. count bytes, calculate crc, you name it.</p>
   */
  public interface ByteFilter {
    /**
     * filters data coming from input
     * @param input byte[] input data
     * @param length int number of meaningful bytes
     * @return byte[] result of filtering
     */
    byte[] filter(byte[] input, int length);
  }

  /**
   * <p>Description: Buffering filter stores some data, and these data can be
   * retrieved later.
   * @see #ByteFilter
   */
  public interface BufferingFilter extends ByteFilter {
    /**
     * gets data stored as a result of filtering; no assumption regarding the nature of the data.
     * @return byte[]
     */
    byte[] getBuffer();

    /**
     * clears the filter buffer
     */
    void clear();
  }

  /**
   * pipes data from input stream to output stream, possibly pumping them through
   * the filter (if any)
   * @param in InputStream the source of data
   * @param out OutputStream where the output goes, filtered if filter is present, or unfiltered otherwise
   * @param isBlocking boolean whether input is blocking (in this case the maximum amount is read in one operation; for nonblocking in.available() determines how many bytes can be read)
   * @param filter ByteFilter the filter that applies to data; can be null
   * @throws IOException when input or output fails
   *
   * see the test for examples
   */
  public static void pipe(InputStream in,
                          OutputStream out,
                          boolean isBlocking,
                          ByteFilter filter)
      throws IOException {
    byte[] buf = new byte[MAX_BUFFER_SIZE];
    int nread;
    int navailable;
    int total = 0;
    synchronized (in) {
      while((navailable = isBlocking ? buf.length : in.available()) > 0 &&
            (nread = in.read(buf, 0, Math.min(buf.length, navailable))) >= 0) {
        if (filter == null) {
          out.write(buf, 0, nread);
        } else {
          byte[] filtered = filter.filter(buf, nread);
          out.write(filtered);
        }
        total += nread;
      }
    }
    out.flush();
    buf = null;
  }

  /**
   * pipes data from input stream to output stream
   *
   * @param in InputStream the source of data
   * @param out OutputStream where the output goes, filtered if filter is present, or unfiltered otherwise
   * @param isBlocking boolean whether input is blocking (in this case the maximum amount is read in one operation; for nonblocking in.available() determines how many bytes can be read)
   * @throws IOException when input or output fails
   *
   * see the test for examples
   */
  public static void pipe(InputStream in,
                          OutputStream out,
                          boolean isBlocking)
      throws IOException {
    pipe(in, out, isBlocking, null);
  }

  /**
   * pipes data from input stream to output stream
   *
   * @param in Reader the source of data
   * @param out Writer where the output goes, filtered if filter is present, or unfiltered otherwise
   * @return boolean true if successful, false otherwise
   *
   * see the test for examples
   */
  public static boolean pipe(Reader in, Writer out) {
    if (in == null) {
      return false;
    }
    if (out == null) {
      return false;
    }
    try {
      int c;
      synchronized (in) {
        while(in.ready() && (c = in.read()) > 0) { // have to have in.ready() here, otherwise it will hang!
          out.write(c);
        }
      }
      out.flush();
    } catch(Exception e) {
      return false;
    }
    return true;
  }

  private static boolean COPY_DEBUG = false;

  /**
   * copies a file or a directory from one directory to another
   * @param from directory from where to copy
   * @param to directory where to copy
   * @param what what to copy (file or directory, recursively)
   * @return true if successful
   *
   * <br><br><b>Example</b>:
   * <li><code>copy("c:\\home\\vlad\\dev", "c:\\home\\vlad\\rtm", "contents.xml")</code></li>
   */
  public static boolean copy(String from, String to, String what) {
    return copy(new File(from, what), new File(to, what));
  }

  /**
   * copy copies a file or a directory from one directory to another
   * @param from directory from where to copy
   * @param to directory where to copy
   * @param what what to copy (file or directory, recursively)
   * @return true if successful
   *
   * <br><br><b>Example</b>:
   * <li><code>copy(new File(myHomeDir, "dev"), new File(myHomeDir, "rtm"), "contents.xml")</code></li>
   */
  public static boolean copy(File from, File to, String what) {
    return copy(new File(from, what), new File(to, what));
  }

  /**
   * copy copies a file or a directory to another
   * @param from
   * @param to
   * @return true if successful
   *
   * <br><br><b>Example</b>:
   * <li><code>copy("c:\\home\\vlad\\dev\\contents.xml", "c:\\home\\vlad\\rtm\\contents.rss")</code></li>
   */
   public static boolean copy(String from, String to) {
     return copy(new File(from), new File(to));
   }

  /**
   * copy copies a file or a directory to another
   * @param from
   * @param to
   * @return true if successful
   *
   * <br><br><b>Example</b>:
   * <li><code>copy(new File(myHomeDir, "contents.xml"), new File(mySite, "contents.rss")</code></li>
   */

  public static boolean USE_NIO = true;

  public static boolean copy(File from, File to) {
    if (from.isDirectory()) {
      for (String name : Arrays.asList(from.list())) {
        if (!copy(from, to, name)){
          if (COPY_DEBUG) System.out.println("Failed to copy " + name +
                                             " from " + from +
                                             " to "   + to);
          return false;
        }
      }
    } else {
      try {
        FileInputStream  is = new FileInputStream(from);
        FileChannel ifc = is.getChannel();
        FileOutputStream os = makeFile(to);
        if (USE_NIO) {
          FileChannel ofc = os.getChannel();
          ofc.transferFrom(ifc, 0, from.length());
        } else {
          pipe(is, os, false);
        }
        is.close();
        os.close();
      } catch (IOException ex) {
        if (COPY_DEBUG) System.out.println("Failed to copy " + from +
                                           " to " + to +
                                           ": " + ex);
        return false;
      }
    }
    long time = from.lastModified();
    setLastModified(to, time);
    long newtime = to.lastModified();

    if (COPY_DEBUG) {
      if (newtime != time) {
        System.out.println("Failed to set timestamp for file " + to +
                           ": tried " + new Date(time) +
                           ", have " + new Date(newtime));
        to.setLastModified(time);
        long morenewtime = to.lastModified();
        return false;
      } else {
        System.out.println("Timestamp for " + to + " set successfully.");
      }
    }
    return time == newtime;
  }
  /**
   * Sets the last-modified time of the file or directory named by this
   * abstract pathname.
   *
   * The reason for this specific method is Java bug 4243868:
   * http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4243868
   * It does not always work without the trick...
   *
   * @see java.io.File#setLastModified
   *
   * @param file File
   * @param time long
   *
   * @return <code>true</code> if and only if the operation succeeded;
   *          <code>false</code> otherwise
   *
   * @throws  IllegalArgumentException  If the argument is negative
   *
   * @throws  SecurityException
   *          If a security manager exists and its <code>{@link
   *          java.lang.SecurityManager#checkWrite(java.lang.String)}</code>
   *          method denies write access to the named file
   *
   * @since 5.0
   */
  public static boolean setLastModified(File file, long time) {
    if (file.setLastModified(time)) {
      return true;
    }
    System.gc();
    return file.setLastModified(time);
  }

  private static final boolean EQUAL_DEBUG = DEBUG;

  /**
   * compares two files or directories, recursively
   * @param left File
   * @param right File
   * @return boolean
   */

  public static boolean equal(File left, File right) {
  if (left.isDirectory() && right.isDirectory()) {
      Set<String> leftSet  = new HashSet<String>(Arrays.asList(left.list()));
      Set<String> rightSet = new HashSet<String>(Arrays.asList(right.list()));

      if (leftSet.size() != rightSet.size()) {
        if (EQUAL_DEBUG) {
          System.out.println(left.getPath() + " has " + leftSet.size() +
                             " while " +
                             right.getPath() + " has " + rightSet.size());
        }
        return false;
      }

      for (String name : leftSet) {
        if (rightSet.contains(name)) {
          if (!equal(new File(left, name), new File(right, name))) {
            if (EQUAL_DEBUG) {
              System.out.println(left.getPath() + File.separator + name +
                                 " is different from " +
                                 right.getPath() + File.separator + name);
            }
            return false;
          }
        } else {
          if (EQUAL_DEBUG) {
            System.out.println(right.getPath() + " does not contain " + name);
          }
          return false;
        }
      }
      return true;
    } else if (left.isFile() && right.isFile()) {
      try {
        return compare(left, right) == 0;
      } catch (IOException e) {
        if (EQUAL_DEBUG) {
          System.out.println(e.getMessage() + " while comparing " +
                             left.getPath() + " and " + right.getPath());
        }
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Compare two files
   * @param left
   * @param right
   * @return -1 if left file is older or shorter or "smaller" than right
   *          0 if files are equal
   *          1 if right file is older or shorter or "smaller" than left
   *
   *
   * <br><br><b>Example</b>:
   * <li><code>copy(new File(myHomeDir, "contents.xml"), new File(mySite, "contents.rss");<br>
   * compare(new File(myHomeDir, "contents.xml"), new File(mySite, "contents.rss")</code> returns -1
   * </li>
   */
  public static int compare(File left, File right) throws IOException {
    long lm = left.lastModified() / 1000;
    long rm = right.lastModified() / 1000;
    if (lm < rm) return -1;
    if (lm > rm) return  1;

    long ll = left.length();
    long rl = right.length();
    if (ll < rl) return -1;
    if (ll > rl) return  1;
    InputStream is1 = new BufferedInputStream(new FileInputStream(left));
    InputStream is2 = new BufferedInputStream(new FileInputStream(right));

    for (long i = 0; i < ll; i++) {
      int b1 = is1.read();
      int b2 = is2.read();
      if (b1 < 0) return -1;
      if (b2 < 0) return 1;
      if (b1 != b2) return b1 < b2 ? -1 : 1;
    }
    return 0;
  }

  /**
   * synchronizes two directories, <code>left/what</code> and <code>right/what</code>
   * @param left File first directory that contains directory <code>what
   * @param right File second directory that contains directory <code>what
   * @param what String name of directory which contents is being synchronized
   * @return boolean true if success
   *
   * <br><br><b>Example</b>:
   * <li><code>synchronize(new File(myHomeDir), new File(mySite), "myjavatools.com")</code>
   * will leave subdirectories named <code>myjavatools.com</code> in these two directories absolutely identical.</li>
   */
  public static boolean synchronize(File left, File right, String what)
  {
    return synchronize(new File(left, what), new File(right, what));
  }

  /**
   * synchronizes two directories
   * @param left File first directory
   * @param right File second directory
   * @return boolean true if success
   *
   * <br><br><b>Example</b>:
   * <li><code>synchronize(new File(myHomeDir), new File(myBackupDir))</code>
   * will leave the contents of directories myHomeDIr and myBackupDir absolutely identical.</li>
   */
  public static boolean synchronize(File left, File right) {
    if (left.isDirectory() || right.isDirectory()) {
      String [] leftContents = left.list();
      Set<String> contents = leftContents == null ?
          new LinkedHashSet<String>() :
          new LinkedHashSet<String>(Arrays.asList(leftContents));
      String[] rightContents = right.list();
      if (rightContents != null) {
        contents.addAll(Arrays.asList(rightContents));
      }

      for (String name : contents) {
        if (!synchronize(left, right, name)) return false;
      }
    } else {
      long leftTime = left.lastModified();
      long rightTime = right.lastModified();

      if (left.exists() && (!right.exists() || leftTime < rightTime)) {
        return copy(left, right);
      } else if (right.exists() && (!left.exists() || leftTime > rightTime)) {
        return copy(right, left);
      }
    }
    return true;
  }

  /**
   * unzips an input stream to a specified folder
   * @param zis ZipInputStream the source of zipped files
   * @param location File the folder (directory) where to unzip the files
   * @throws IOException when something went wrong
   * @return boolean true if success, false otherwise
   *
   *
   * <br><br><b>Example</b>:
   * <li><code>unzip(Web.getUrlInputStream(new URL(synchronize(new File(myHomeDir), new File(myBackupDir))</code>
   * will leave the contents of directories myHomeDIr and myBackupDir absolutely identical.</li>
   */
  static public boolean unzip(ZipInputStream zis,
                              File location)
      throws IOException {

    if (!location.exists()) {
      location.mkdirs();
    }

    ZipEntry ze;
    while ((ze = zis.getNextEntry()) != null) {
      File output = new File(location, ze.getName());
      if (ze.isDirectory()) {
        output.mkdirs();
      } else {
        File dir = output.getParentFile();
        if (!dir.isDirectory()) dir.delete();
        dir.mkdirs();
        if (!dir.exists()) {
          System.err.println("Could not create directory " +
                             dir.getCanonicalPath());
          return false;
        }
        OutputStream os = new FileOutputStream(output);
        pipe(zis, os, true);
        os.close();
      }
    }
    zis.close();
    return true;
  }

  /**
   * installs files from a resource archive
   * Reads a specified resource for aspecified class, unzips it to a specified directory
   * @param clazz Class the class whose package contains the archive as a resource
   * @param resourceArchiveName String the name of resource containing the archive
   * @param location File directory where the archive is unzipped
   * @throws IOException if something goes wrong
   * @return boolean true if success, false if failed
   */

  public static boolean install(Class clazz,
                                String resourceArchiveName,
                                File location)
    throws IOException {
    ZipInputStream zis = new
      ZipInputStream(clazz.getResourceAsStream(resourceArchiveName));
    return unzip(zis, location);
  }

  /**
   * installs files from a URL
   * Reads the contents of the specified URL, unzips it to a specified directory
   * @param URL url the url containing an archive to install
   * @param location File directory where the archive is unzipped
   * @throws IOException if something goes wrong
   * @return boolean true if success, false if failed
   */

  public static boolean install(URL url,
                                File location)
    throws IOException {
    return unzip(new ZipInputStream(url.openStream()),
                 location);
  }

  /**
   * installs files from a URL
   * Reads the contents of the specified URL, unzips it to a specified directory
   * @param String urlString the string with the url containing an archive to install
   * @param location File directory where the archive is unzipped
   * @throws IOException if something goes wrong
   * @return boolean true if success, false if failed
   */

  public static boolean install(String urlString,
                                String directoryName)
    throws IOException {
    return unzip(new ZipInputStream(new URL(urlString).openStream()),
                 new File(directoryName));
  }

  /**
   * installs files from a resource archive
   * Reads a specified resource for aspecified class, unzips it to a specified directory
   * @param clazz Class the class whose package contains the archive as a resource
   * @param resourceArchiveName String the name of resource containing the archive
   * @param folderName String name of directory where the archive is unzipped
   * @throws IOException if something goes wrong
   * @return boolean true if success, false if failed
   */
  public static boolean install(Class clazz,
                                String resourceArchiveName,
                                String folderName)
    throws IOException {
    return install(clazz, resourceArchiveName, new File(folderName));
  }

  private static class ByteIterator implements Iterator<Byte> {
    IOException exception = null;
    byte next;
    boolean have = false;
    InputStream is = null;

    private ByteIterator(InputStream is) {
      this.is = is;
    }

    public boolean hasNext() {
      if (have) {
        return true;
      } else if (is == null) {
        return false;
      } else {
        try {
          int input = is.read();
          if (input < 0) {
            close();
          } else {
            have = true;
            next = (byte)input;
          }
        }
        catch (IOException ex) {
          exception = ex;
          close();
        }
      }
      return is != null;
    }

    public Byte next() {
      if (!hasNext()) {
        throw exception == null ?
            new NoSuchElementException() :
            new NoSuchElementException(exception.getMessage());
      }
      have = false;
      return next;
    }

    public void remove() {
      throw new UnsupportedOperationException();
    }

    private void close() {
      if (is != null) {
        try {
          is.close();
        } catch (Exception e) {}
      }
      is = null;
    }

    protected void finalize() {
      close();
    }
  }

  /**
   * returns an Iterable&lt;Byte> enclosure that scans over the bytes returned by InputStream
   * @param is InputStream the stream to scan
   * @return Iterable&lt;Byte> the enclosure
   *
   * The Iterator returned by the Iterable is a singleton;
   * you cannot expect to get a fresh Iterator by calling
   * iterator() several times.
   *
   * <br><br><b>Example</b>:<br><br>
   * <code>
   *    for(byte b : bytes(new java.net.URL("http://yahoo.com").openSream())) {
   *      System.out.println(b);
   *    }
   * </code>
   */
  public static Iterable<Byte> bytes(final InputStream is) {

    return new Iterable<Byte>() {
      private final Iterator<Byte> iterator =
        new ByteIterator(is);

      public Iterator<Byte> iterator() {
        return iterator;
      }
    };
  }

  /**
   * returns an Iterable&lt;Byte> that scans over the bytes in a File
   * @param file File the file to scan
   * @return Iterable&lt;Byte> the Iterable
   *
   * <br><br><b>Example</b>:<br><br>
   *
   * <code><pre>
   *    for(byte b : bytes(new File("notepad.exe"))) {
   *      System.out.println(b);
   *    }
   * </pre></code>
   */
  public static Iterable<Byte> bytes(final File file) {

    return new Iterable<Byte>() {
      public Iterator<Byte> iterator() {
        try {
          return new ByteIterator(new FileInputStream(file));
        } catch (IOException e) {
          return new EmptyIterator<Byte>(e.getMessage());
        }
      }
    };
  }

  private static class CharIterator implements Iterator<Character> {
    IOException exception = null;
    Reader reader;
    char next;
    boolean have = false;

    private CharIterator(Reader reader) {
      this.reader = reader;
    }
    public boolean hasNext() {
      if (have) {
        return true;
      } else if (reader == null) {
        return false;
      } else {
        try {
          int input = reader.read();
          if (input < 0) {
            close();
          } else {
            have = true;
            next = (char)input;
            return true;
          }
        }
        catch (IOException ex) {
          exception = ex;
          close();
        }
        return reader != null;
      }
    }

    public Character next() {
      if (!hasNext()) {
        throw exception == null ?
            new NoSuchElementException() :
            new NoSuchElementException(exception.getMessage());
      }
      have = false;
      return next;
    }

    public void remove() {
      throw new UnsupportedOperationException();
    }

    private void close() {
      if (reader != null) {
        try {
          reader.close();
        } catch (Exception e) {}
      }
      reader = null;
    }

    protected void finalize() {
      close();
    }
  }

  /**
   * returns an Iterable&lt;Character> enclosure that scans over the characters returned by Reader
   * @param reader Reader the reader to scan
   * @return Iterable&lt;Character> the Iterable enclosure
   *
   * The Iterator returned by the Iterable is a singleton;
   * you cannot expect to get a fresh Iterator by calling
   * iterator() several times.
   * <br>
   * Usage example:<br><br>
   *
   * <code>
   *    for(char c : chars(new InputStreamReader(new java.net.URL("http://yahoo.com").openSream()))) {
   *      System.out.println("[" + c + "]");
   *    }
   * </code>
   */
  public static Iterable<Character> chars(final Reader reader) {

    return new Iterable<Character>() {

      private final Iterator<Character> iterator =
        new CharIterator(reader);

      public Iterator<Character> iterator() {
        return iterator;
      }
    };
  }

  /**
   * returns an Iterable&lt;Character> that scans over the characters in a File
   * @param file File the file to scan
   * @return Iterable&lt;Character> the Iterable
   * <br>
   * Usage example:<br><br>
   *
   * <code>
   *    for(char c : bytes(new File("readme.html"))) {
   *      System.out.println("[" + c + "]");
   *    }
   * </code>
   */
  public static Iterable<Character> chars(final File file) {

    return new Iterable<Character>() {
      public Iterator<Character> iterator() {
        try {
          return new CharIterator(new FileReader(file));
        } catch (IOException e) {
          return new EmptyIterator<Character>(e.getMessage());
        }
      }
    };
  }

  private static class LineIterator implements Iterator<String> {
    LineNumberReader lr;
    IOException exception = null;
    String next;
    boolean have = false;

    private LineIterator(Reader reader) {
      lr = new LineNumberReader(reader);
    }
    public boolean hasNext() {
      if (have) {
        return true;
      } else if (lr == null) {
        return false;
      } else {
        try {
          next = lr.readLine();
          if (next == null) {
            close();
          } else {
            have = true;
            return true;
          }
        }
        catch (IOException ex) {
          exception = ex;
          close();
        }
        return false;
      }
    }

    public String next() {
      if (!hasNext()) {
        throw exception == null ?
            new NoSuchElementException() :
            new NoSuchElementException(exception.getMessage());
      }
      have = false;
      return next;
    }

    public void remove() {
      throw new UnsupportedOperationException();
    }

    private void close() {
      if (lr != null) {
        try {
          lr.close();
        } catch (Exception e) {}
      }
      lr = null;
    }

    protected void finalize() {
      close();
    }
  }

  /**
   * returns an Iterable&lt;String> enclosure that scans over the lines returned by Reader
   * @param reader Reader the reader to scan
   * @return Iterable&lt;String> the Iterable enclosure
   *
   * The Iterator returned by the Iterable is a singleton;
   * you cannot expect to get a fresh Iterator by calling
   * iterator() several times.
   * <br>
   * Usage example:<br><br>
   *
   * <code>
   *    for(String line : chars(new LineNumberReader(new java.net.URL("http://yahoo.com").openSream()))) {
   *      System.out.println(">" + line);
   *    }
   * </code>
   */
  public static Iterable<String> lines(final Reader reader) {

    return new Iterable<String>() {
      private final Iterator<String> iterator =
        new LineIterator(reader);

      public Iterator<String> iterator() {
        return iterator;
      }
    };
  }

  /**
   * returns an Iterable&lt;String> that scans over the lines in a File
   * @param file File the file to scan
   * @return Iterable&lt;String> the Iterable
   *
   * Usage example:
   *
   * <code>
   *    for(String line : lines(new File("readme.txt"))) {
   *      System.out.println(">" + line);
   *    }
   * </code>
   */
  public static Iterable<String> lines(final File file) {

    return new Iterable<String>() {
      public Iterator<String> iterator() {
        try {
          return new LineIterator(new FileReader(file));
        } catch (IOException e) {
          return new EmptyIterator<String>(e.getMessage());
        }
      }
    };
  }

  /**
   * Returns an Iterable&lt;File> that scans, recursively, through
   * the directory structure.
   * Traversal order is depth-first, preorder
   *
   * @param folder File starting directory
   * @return Iterable&lt;File> the tree scanner
   *
   * Usage examples:
   *
   * <code>
   *    for(File subfolder : tree(new File("."))) {
   *      System.out.println(subfolder.getCanonicalPath());
   *    }
   *
   *    for(File folder : tree(new File("."))) {
   *      System.out.println(file.getCanonicalPath());
   *
   *      for (File file : files(folder)) {
   *        System.out.println("  " + file.getName());
   *      }
   *    }
   * </code>
   */
  public static Iterable<File> tree(final File folder) {
  return new Iterable<File>() {
      public Iterator<File> iterator() {
        return FolderIterator.preorder(folder);
      }
    };
  }

  /**
   * Returns an Iterable&lt;File> that scans, recursively, through
   * the directory structure.
   * Traversal order is depth-first, preorder
   *
   * @param folder File starting directory
   * @return Iterable&lt;File> the tree scanner
   *
   * Usage examples:
   *
   * <code>
   *    for(File subfolder : tree(new File("."))) {
   *      System.out.println(subfolder.getCanonicalPath());
   *    }
   *
   *    for(File folder : tree(new File("."))) {
   *      System.out.println(file.getCanonicalPath());
   *
   *      for (File file : files(folder)) {
   *        System.out.println("  " + file.getName());
   *      }
   *    }
   * </code>
   */
  public static Iterable<File> tree(final File folder,
                                    final FileFilter filter) {
  return new Iterable<File>() {
      public Iterator<File> iterator() {
        return FolderIterator.preorder(folder, filter);
      }
    };
  }

  /**
   * Returns an Iterable&lt;File> that scans, recursively,
   * through the directory structure.
   *
   * Traversal order is depth-first, postorder
   *
   * @param folder File starting directory
   * @return Iterable&lt;File> the tree scanner
   *
   * Usage examples:
   *
   * <code>
   *    for(File subfolder : treePostorder(new File("."))) {
   *      System.out.println(subfolder.getCanonicalPath());
   *    }
   *
   *    for(File folder : treePostorder(new File("."))) {
   *      System.out.println(file.getCanonicalPath());
   *
   *      for (File file : files(folder)) {
   *        System.out.println("  " + file.getName());
   *      }
   *    }
   * </code>
   */
  public static Iterable<File> treePostorder(final File folder) {
  return new Iterable<File>() {
      public Iterator<File> iterator() {
        return FolderIterator.postorder(folder);
      }
    };
  }

  /**
   * Returns an Iterable&lt;File> that scans all files in the folder
   * @param folder File directory to scan
   * @return Iterable&lt;File> the scanner
   * <br>
   * Usage example:<br><br>
   *
   * <code>
   *    for (File file : files(new File(".")) {
   *      System.out.println(file.getName());
   *    }
   * </code>
   */
  public static Iterable<File> files(final File folder) {
    return Arrays.asList(listFiles(folder));
  }
}

