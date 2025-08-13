package run;

import java.net.*;
import java.io.*;

/**
* <p>Title: run a program <u>from anywhere</u> in the world</p>
* <p>Description: java -jar run.jar [-clean] <url or path of the program file to run> <arguments>
*             or: run [-clean] <url or path of the program to run> <arguments>
* The program can be a jar file, a binary executable, a batch, a shell script.</p>
* @author vpatryshev
* @version 1.1 08/21/2006 (Enforced overwriting of previous version of the file it loads)
* @version 1.2 09/19/2006 (Overwriting of previous version optional - based on timestamp)
*
*/

public class Run {

  static final int BLOCK_SIZE = 256000; // bytes - should grow according t Moore law
  static byte[] buf = new byte[BLOCK_SIZE];
  static final int SLEEP_UNIT = 333;   // msec
  static final String TMP_DIR = "/tmp/runjar";

  static private abstract class FileLoader {

    protected File loadFile(String urlString,
                            URLConnection connection,
                            File programFile) {
      if (programFile.exists()) {
        programFile.delete();
      }
      if (programFile.exists()) {
        System.err.println("Could not delete file " + programFile);
        System.exit( -1);
      }

      try {
        InputStream is = new BufferedInputStream(connection.getInputStream());
        OutputStream os =
            new BufferedOutputStream(new FileOutputStream(programFile));
        pipe(is, os, true);
        os.close();
        is.close();
      } catch (Exception e) {
        System.err.println(urlString + ": " + e.getMessage());
        System.exit(-1);
      }
      return programFile;
    }

    File getLocalFile(String urlString) {
      String filename = urlString.substring(urlString.lastIndexOf('/') + 1);
      return new File(filename);
    }

    File findFile(String urlString) {
      File programFile = getLocalFile(urlString);

      if (!programFile.exists()) {
        try {
          programFile = getTempFile(urlString);
        } catch (IOException e) {
          // Just ignore it, and load a new one.
        }
      }
      return programFile;
    }

    static File getTempFile(String urlString) throws IOException {
      String filename = urlString.substring(urlString.lastIndexOf('/') + 1);
      File here = new File(".");
      File root = new File(here.getAbsolutePath()); // is not it something?

      while (root.getParent() != null &&
             root.getParent() != root.getCanonicalPath()) {
        root = new File(root.getParent()); // that's the way to find the root
      }

      File tmpdir = new File(root, TMP_DIR);
      if (!tmpdir.exists()) tmpdir.mkdirs();

      return tmpdir.exists() ?  new File(tmpdir, filename) :
                                File.createTempFile("", filename, tmpdir);
    }

    public abstract File load(String urlString);
  };

  static final FileLoader KEEP = new FileLoader() {
    public File load(String urlString) {
      File programFile = findFile(urlString);

      try {
        if (!programFile.exists()) {
          loadFile(urlString, new URL(urlString).openConnection(), programFile);
        }
      } catch (Exception e) {
        System.err.println(urlString + ": " + e.getMessage());
        System.exit(-1);
      }

      return programFile;
    }
  };

  static final FileLoader OVERWRITE = new FileLoader() {
    public File load(String urlString) {
      File programFile = getLocalFile(urlString);

      if (programFile.exists()) {
        programFile.delete();
      }

      if (programFile.exists()) {
        try {
          programFile = getTempFile(urlString);
        } catch (Exception e) {
          System.err.println(urlString + ": " + e.getMessage());
          System.exit(-1);
        }
      }

      try {
        loadFile(urlString, new URL(urlString).openConnection(), programFile);
      } catch (Exception e) {
        System.err.println(urlString + ": " + e.getMessage());
        System.exit(-1);
      }
      return programFile;
    }
  };

  static final FileLoader OVERWRITE_IF_NEWER = new FileLoader() {
    public File load(String urlString){
      long localTime = 0L;
      File programFile = findFile(urlString);

      if (programFile.exists()) {
        localTime = programFile.lastModified();
      }

      try {
        URLConnection connection = new URL(urlString).openConnection();
        long remoteTime = connection.getHeaderFieldDate("Date", 0l);

        if (remoteTime > localTime) {
          programFile = loadFile(urlString, connection, programFile);
        }
      } catch (Exception e) {
        System.err.println(urlString + ": " + e.getMessage());
        System.exit(-1);
      }
      return programFile;
    }
  }
;

  public static void main(String[] args) {
    try {
      FileLoader loader = KEEP;

      if (args.length > 0) {
        int argpos = 0;

        if (args[0].equals("-clean") ||
            args[0].equals("-overwrite")) {
          argpos++;
          loader = OVERWRITE;
        } else if (args[0].equals("-newer")) {
          argpos++;
          loader = OVERWRITE_IF_NEWER;
        } else if (args[0].equals("-help")) {
          System.out.println("run.java (url) - downloads and executes a file\n" +
                             "  options:\n" +
                             "    -newer download only if the remote file is newer than the one on your machine\n" +
                             "    -overwrite download every time, overwriting the one you have.");
        }

        String urlString = args[argpos++]; // jar url string
        File programFile = loader.load(urlString);

        String cmd =  getCommand(programFile) + programFile.getAbsolutePath();

        for (int i = argpos; i < args.length; i++) {
          cmd += " \"" + args[i] + "\"";
        }

        File here = new File(".");
        Process process = Runtime.getRuntime().exec(cmd, null, here);
        int result = 0;

        for (boolean isRunning = true; isRunning;) {
          Thread.sleep(SLEEP_UNIT);
          try {
            result = process.exitValue();
            isRunning = false;
          } catch (IllegalThreadStateException ie) {}

          try {
            pipe(System.in, process.getOutputStream(), false);
            pipe(process.getErrorStream(), System.err, false);
            pipe(process.getInputStream(), System.out, false);
          } catch(Exception e) {}
        }
        System.exit(result);
      }
    } catch (Exception e) {
      System.err.println(e);
    }
  }

  static void pipe(InputStream in, OutputStream out, boolean isBlocking)
      throws IOException {
    int nread;
    int navailable;
    while((navailable = isBlocking ? Integer.MAX_VALUE : in.available()) > 0 &&
          (nread = in.read(buf, 0, Math.min(buf.length, navailable))) >= 0) {
      out.write(buf, 0, nread);
    }
    out.flush();
  }

  static String getCommand(File programFile) {
    String name = programFile.getName();
    String cmd = "";
    if (name.endsWith(".jar")) {
      cmd = System.getProperty("java.home") + File.separator +
             "bin" + File.separator +
             "java -jar ";
    } else if (name.endsWith(".bat")){
      cmd = "cmd /c ";
    } else if (name.endsWith(".sh")){
      cmd = "sh ";
    } else if (name.endsWith(".pl")){
      cmd = "perl ";
    } else {
      byte[] buf = new byte[10];
      try {
        String head = new String(buf, 0,
                                 (new FileInputStream(programFile)).read(buf));
        if (head.equals("#!/bin/sh")) {
          cmd = "sh ";
        } else if (head.equals("#!/bin/sh")){
          cmd = "perl ";
        } else if (head.startsWith("MZ")) {
          // it is .exe
        }
      } catch (IOException ex) {}
    }
    return cmd;
  }
}


