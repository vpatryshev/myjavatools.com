package com.myjavatools.web.jboss;

import java.io.File;
import java.net.URL;
import java.net.*;
import com.myjavatools.web.ClientHttpRequest;
import com.myjavatools.xml.XmlData;
import com.myjavatools.xml.BasicXmlData;
import com.myjavatools.xml.XmlWriter;

/**
 * <p>Title: JBoss Deployment Command-line utility</p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: This is public domain;
 * The right of people to use, distribute, copy or improve the contents of the
 * following may not be restricted.</p>
 *
 * @author Vlad Patryshev
 * @version 1.0
 */
public class Deploy {
  private final static String deployURI = "/system/jboss-deploy.jsp";
  private final static String protocol = "http";

  /**
   * Application entry point.
   *
   * @param args String[]
   */
  public static void main(String[] args) {
    URL url = null;
    final String DEFAULT_HOST = "localhost";
    final int DEFAULT_LOCAL_PORT=8080;
    final int DEFAULT_REMOTE_PORT=80;
    String host = DEFAULT_HOST;
    File file = null;
    int port = 80;
    boolean isDebug = false;
    boolean havePort = false;

    for (int i = 0; i < args.length - 1; i+=2) {
      if ("-file".equalsIgnoreCase(args[i])) {
        file = new File(args[i+1]);
      } else if ("-host".equalsIgnoreCase(args[i])) {
        host = args[i+1];
      } else if ("-port".equalsIgnoreCase(args[i])) {
        port = Integer.parseInt(args[i+1]);
        havePort = true;
      } else if ("-debug".equalsIgnoreCase(args[i])) {
        i--;
        isDebug=true;
      } else if ("-help".equalsIgnoreCase(args[i])) {
        help();
      }
    }

    if (!havePort) {
      port = DEFAULT_HOST.equals(host) ? DEFAULT_LOCAL_PORT : DEFAULT_REMOTE_PORT;
    }

    try {
      url = new URL(protocol, host, port, deployURI);
    }
    catch (MalformedURLException ex) {
      complain(ex.getMessage() + ": " + host + ":" + port);
    }

    checkif(url  != null, "url not specified, see -help");
    checkif(file != null, "file not specified, see -help");
    checkif(file.getName().endsWith(".ear"), "file must be .ear");
    checkif(file.isFile(), "Could not find file " + file);
    checkif(file.canRead(), "Cannot read file " + file);

    try {
      XmlData result = new BasicXmlData(ClientHttpRequest.post(url, "debug", "" + isDebug, "file", file));
      if(isDebug) {
        XmlWriter.write(System.out, result);
      }
      XmlData error = result.getKid("error");
      if (error != null) {
        complain(error.getKidValue("stacktrace"));
      } else {
        XmlData received = result.getKid("received");

        System.out.println("File " + received.getAttribute("file") +
                           " size " + received.getAttribute("size"));
      }
    } catch(Exception e) {
      complain(e.getMessage());
    }
    System.exit(0);
  }

  static void checkif(boolean condition, String message) {
    if (!condition) {
      complain(message);
    }
  }

  static void complain(String message) {
    System.err.println(message);
    System.exit(1);
  }

  static void help() {
    System.out.println("JBoss remote deployment utility.\n");
    System.out.println("arguments:");
    System.out.println("\t-help - this help");
    System.out.println("\tfile <file> - the .ear file to deploy");
    System.out.println("\turl <url> the root url of the server to deploy to.");
    System.out.println("\nVlad Patryshev, myjavatools.com");
    System.exit(0);
  }
}
