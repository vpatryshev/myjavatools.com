/**
 *
 * <p>Title: Jsp Pipe</p>
 * <p>Description: runs a jsp as a pipe, returning its output</p>
 * <p>Copyright: Copyright (c) 2002 Vlad Patryshev</p>
 * @author vpatryshev
 * @version 1.0
 */

package jsp;

import java.net.URL;
import java.net.URLConnection;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.io.Writer;
import java.io.OutputStreamWriter;
import java.io.ByteArrayInputStream;
import java.io.StringBufferInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.io.FileInputStream;
import java.util.zip.ZipInputStream;
import java.io.File;
import java.util.zip.ZipEntry;
import java.io.FileOutputStream;
import java.io.StringWriter;

public class Main extends Thread {
  static boolean DEBUG = false;
  static final int port = 8079;
  static final Main me = new Main();
  static String CATALINA_HOME = File.separator + "tmp" + File.separator + "tomcat";
  static String JAVA_HOME = System.getProperty("java.home");
  static boolean tomcatIsRunning = false;

  public static void main(String[] args) {
    try {
      Map argmap = getargs(args);
      if (!argmap.containsKey(".")) {
        argmap.put(".", getContents(System.in));
      }

      URL universalUrl = new URL("http://localhost:" + port + "/r.jsp");
      if (!isTomcatRunning(universalUrl)) {

        me.stopTomcat();
        synchronized (me) {
          me.wait(3000); // 3 seconds must be enough
        }

        if (tomcatIsRunning) {
          System.err.println("Could not kill Tomcat to start, exiting...");
          System.exit(1);
        }
        CATALINA_HOME = new File(CATALINA_HOME).getCanonicalPath();
        if (DEBUG) {
          System.out.println("JAVA_HOME is " + JAVA_HOME);
          System.out.println("CATALINA_HOME is " + CATALINA_HOME);
        }
        me.installTomcat();
        me.start();

        synchronized (me) {
          me.wait(30000);
        }
        if (!tomcatIsRunning) {
          System.err.println("Cannot wait for Tomcat to start, exiting...");
          System.exit(1);
        }
      }

      if (!isTomcatRunning(universalUrl)) {
        System.err.println("Oops, universal jsp not available!");
        System.exit(1);
      }

      System.out.flush();
      System.err.flush();

      processJsp(argmap, universalUrl, System.out);
    }
    catch(Exception e) {
      e.printStackTrace();
    }
  }

  private static void processJsp(Map argmap, URL universalUrl, OutputStream out) throws IOException {
    URLConnection conn = universalUrl.openConnection();
    conn.setDoInput(true);
    conn.setDoOutput(true);
    Writer ow = new OutputStreamWriter(conn.getOutputStream());

    for (Iterator i = argmap.keySet().iterator(); i.hasNext();) {
      String key = (String)i.next();
      ow.write(URLEncoder.encode(key));
      ow.write("=");
      ow.write(URLEncoder.encode((String)argmap.get(key)));
      ow.write("&");
    }
    ow.close();
    conn.connect();
    InputStream is = conn.getInputStream();
    pipe(is, out, true, null);
    is.close();
  }

  private static boolean isTomcatRunning(URL universalUrl) {
    String winky = getContents(universalUrl);

    if (DEBUG) {
      System.out.println("winky is " + winky);
    }

    return winky != null && winky.startsWith(";)");
  }

  static interface Filter {
    public int filter(byte[] in, int size);
  }

  static class Sniffer implements Filter {
    byte[] pattern;
    int ptr;
    boolean matched;

    public Sniffer(String pattern) {
      this.pattern = pattern.getBytes();
      reset();
    }

    public void reset() {
      matched = false;
      ptr = 0;
    }

    public boolean found() { return matched; }

    public int filter(byte[] in, int size) {
      for (int i = 0; !matched && i < size; i++) {
        match(in[i]);
      }
      return 0;
    }

    private void match(byte b) {
      if(b == pattern[ptr++]) {
        matched = ptr >= pattern.length;
      } else {
        ptr = 0;
      }
    }
  }

  static final int BUFFER_SIZE = 65500; // a politically_correct for year 2002 input buffer size

  static void pipe(InputStream in,
                   OutputStream out,
                   boolean isBlocking,
                   Filter filter) throws IOException {
    byte[] buf = new byte[BUFFER_SIZE];
    int nread;
    int navailable;
    int total = 0;
    synchronized (in) {
      while((navailable = isBlocking ? Integer.MAX_VALUE : in.available()) > 0 &&
            (nread = in.read(buf, 0, Math.min(buf.length, navailable))) >= 0) {
        if (filter == null) {
          if (out != null)
            out.write(buf, 0, nread);
        } else {
          if (out != null)
            out.write(buf, 0, filter.filter(buf, nread));
        }
        total += nread;
      }
    }
    out.flush();
  }

  public static String getContents(InputStream is)
    throws IOException {
    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
    pipe(is, buffer, true, null);
    is.close();
    return buffer.toString();
  }

  public static String getContents(URL url) {
    try {
      URLConnection conn = url.openConnection();
      conn.connect();
      return getContents(conn.getInputStream());
    }
    catch(Exception e) {
    }
    return null;
  }

  public static String getContents(String urlstring) {
    try {
      return getContents(new URL(urlstring));
    }
    catch(Exception e) {
    }
    return null;
  }

  public static Map getargs(String[]args) {
    Map result = new HashMap();

    for (int i = 0; i < args.length - 1; i++) {
      if (args[i].equals("--param")) {
        String name = args[++i];
        String value = "";
        if (++i < args.length - 1) {
          if (args[i].equals("--value")) {
            value = args[i+1];
          } else if (args[i].equals("--file")) {
            try {
              value = getContents(new FileInputStream(args[++i]));
            } catch (IOException ex) {
            }
          } else if (args[i].equals("--")) {
            try {
              value = getContents(System.in);
            } catch (IOException ex) {
            }
          }
        }
        result.put(name, value);
      } else if (args[i].startsWith("-") &&
                 !args[i+1].startsWith("-")) {
        result.put(args[i].substring(1), args[++i]);
      }
    }
    return result;
  }

  private void installTomcat()
    throws IOException {
    ZipInputStream zis = new ZipInputStream(this.getClass().getResourceAsStream("tc.zip"));
    File location = new File(CATALINA_HOME);
    unzip(zis, location);
  }

  private void launchTomcat() {
    String cmd = getTomcatCmd() + " start";
    if (DEBUG) {
      System.out.println(CATALINA_HOME + "> " + cmd);
    }
    Process process = null;
    try {
      process = Runtime.getRuntime().exec(cmd, null, new File(CATALINA_HOME));
    }
    catch (IOException ex) {
    }
    int result = 0;
    Sniffer sniffer = new Sniffer("Starting service Tomcat-Apache");

    for (boolean isRunning = true; isRunning;) {
      try {
        Thread.sleep(333);
        result = process.exitValue();
        isRunning = false;
      } catch (IllegalThreadStateException ie) {
      } catch (InterruptedException ie) {
      }
      try {
        pipe(process.getErrorStream(), System.err, false, null);
        pipe(process.getInputStream(), System.out, false, sniffer);

        synchronized(this) {
          if (sniffer.found()) {
            tomcatIsRunning = true;
            notify();
            isRunning = false;
          }
        }
      } catch(Exception e) {}
    }
  }

  private void stopTomcat() {
    String cmd = getTomcatCmd() + " stop";
    if (DEBUG) {
      System.out.println(CATALINA_HOME + "> " + cmd);
    }
    Process process = null;
    try {
      process = Runtime.getRuntime().exec(cmd, null, new File(CATALINA_HOME));
    }
    catch (IOException ex) {
    }

    int result = 0;

    for (boolean isRunning = process != null; isRunning;) {
      try {
        Thread.sleep(333);
        result = process.exitValue();
        isRunning = false;
      } catch (IllegalThreadStateException ie) {
      } catch (InterruptedException ie) {
      }
      try {
        pipe(process.getErrorStream(), System.err, false, null);
        pipe(process.getInputStream(), null,      false, null);

        if (!isRunning) {
          tomcatIsRunning = false;
          notify();
        }
      } catch(Exception e) {}
    }
/**/
  }

  private String getTomcatCmd() {
    if (JAVA_HOME.endsWith("jre")) JAVA_HOME=JAVA_HOME.substring(0, JAVA_HOME.length() - 4);
    String JAVA_BIN = JAVA_HOME + File.separator + "bin";
    if (!new File(JAVA_BIN, "java.exe").exists() &&
        !new File(JAVA_BIN, "java")    .exists()) {
      System.err.println("Error: No java found in " + JAVA_HOME);
      System.exit(1);
    }
    String BASEDIR=CATALINA_HOME;
    String JAVA_ENDORSED_DIRS=BASEDIR + File.separator + "bin" + File.pathSeparator +
                              BASEDIR + File.separator + "common" + File.separator + "lib";
    String CLASSPATH = JAVA_HOME + File.separator + "lib" + File.separator + "tools.jar";

    String JIKESPATH="";
    if (System.getProperty("os.name").equals("Darwin")) {
      File OSXHACK=new File("/System/Library/Frameworks/JavaVM.framework/Versions/CurrentJDK/Classes");
      if (OSXHACK.isDirectory()) {
        File[] hackContents = OSXHACK.listFiles();
        for (int i = 0; i < hackContents.length; i++) {
          if(hackContents[i].getName().endsWith(".jar")) {
            try {
              JIKESPATH += File.pathSeparator + hackContents[i].getCanonicalPath();
            }
            catch (IOException ex) {
            }
          }
        }
      }
    }

    String _RUNJAVA  = JAVA_BIN + File.separator + "java";
    if (new File(_RUNJAVA + "w.exe").exists()) _RUNJAVA += "w.exe";

    CLASSPATH += File.pathSeparator + CATALINA_HOME + File.separator + "bin" + File.separator + "bootstrap.jar";

    String CATALINA_BASE   = CATALINA_HOME;
    String CATALINA_TMPDIR = CATALINA_BASE + File.separator + "temp";
    String MAINCLASS="org.apache.catalina.startup.Bootstrap";
    String SECURITY_POLICY_FILE="";

    return _RUNJAVA +
    //                 " -Djava.endorsed.dirs=" + JAVA_ENDORSED_DIRS +
                 " -classpath \"" + CLASSPATH + "\"" +
                 " -Dcatalina.base=" + CATALINA_BASE +
                 " -Dcatalina.home=" + CATALINA_HOME +
                 " -Djava.io.tmpdir="+ CATALINA_TMPDIR +
                 " " + MAINCLASS;
  }

  public void run() {
    launchTomcat();
  }

  private void unzip(ZipInputStream zis, File location) throws IOException {
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
          System.err.println("Could not create directory " + dir.getCanonicalPath());
          System.exit(1);
        }
        OutputStream os = new FileOutputStream(output);
        pipe(zis, os, true, null);
        os.close();
      }
    }
    zis.close();
  }
}