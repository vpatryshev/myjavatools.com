/**
 * <p>Title: MyJavaTools: Server HTTP Request class</p>
 * <p>Description: Adapter Class for HttpServletRequest; handles files
 *    gracefully.</p>
 *
 * <p>Copyright: This is public domain;
 * The right of people to use, distribute, copy or improve the contents of the
 * following may not be restricted.</p>
 *
 * @author Vlad Patryshev
 * @version 1.4
 */
package com.myjavatools.web;

import java.io.*;
import java.security.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

import com.myjavatools.lib.*;

public class ServerHttpRequest implements HttpServletRequest
{
  private HttpServletRequest org;
  ServletInputStream sis = null;
  private Hashtable parameters = null;
  private int debugLevel = 0;
  private static final int MAX_LOG_SIZE = 100000;
  public CharArrayWriter debugInfo =  new CharArrayWriter(MAX_LOG_SIZE + 100);
  private PrintWriter printer = new PrintWriter(debugInfo);

  private void print(String s) {
    if (debugLevel <= 0) {
      return;
    }
    if (debugInfo.size() + (s == null ? 4 : s.length()) < MAX_LOG_SIZE) {
      printer.print(s);
    } else if (debugInfo.size() < MAX_LOG_SIZE) {
      printer.print(" ... ");
    }
    printer.flush();
  }

  private void println(String s) {
    print(s);
    print("\r\n");
  }

  public class ComplexValue extends HashMap
  {
    Map attributes = new HashMap();

    public ComplexValue() {
      super();
    }

    public ComplexValue(String name) {
      this();
      setName(name);
    }

    public void setAttribute(String name, Object value) {
      if (value != null && name != null) {
        attributes.put(name, value);
      }
    }

    public void extractProperty(String name, CharSequence from) {
      put(name, Tools.extractValue(from.toString(), name));
    }

    public Object getAttribute(String name) {
      return attributes.get(name);
    }

    public String getName()              { return (String)get("name");
}
    public void   setName(String name)   { put("name", name); }

    public char[] getBinaryValue()       { return (char[])get(".");  }
    public String getValue()             {
      char[] bv = getBinaryValue();
      return bv == null ? null : new String(bv);
    }

    public void   setValue(char[] value) { put(".", value); }

    public void   setValue(String value) {
      char[] cv = new char[value.length()];
      value.getChars(0, value.length(), cv, 0);
      setValue(cv);
    }

    public void   appendValue(char[] addValue) {
      char[] oldValue = getBinaryValue();
      if (oldValue == null) oldValue = new char[0];
      char[] newValue = new char[oldValue.length + addValue.length];
      System.arraycopy(oldValue, 0, newValue, 0, oldValue.length);
      System.arraycopy(addValue, 0, newValue, oldValue.length, addValue.length);
      setValue(newValue);
    }

    public void appendValue(char c) {
      char[] oldValue = getBinaryValue();
      if (oldValue == null) oldValue = new char[0];
      char[] newValue = new char[oldValue.length + 1];
      System.arraycopy(oldValue, 0, newValue, 0, oldValue.length);
      newValue[oldValue.length] = c;
      setValue(newValue);
    }

    public void appendValue(String value) {
      String v = getValue();
      setValue(v == null ? value : (v + value));
    }

    public int getValueLength()          {
      char[] v = (char[])get(".");
      return v == null ? 0 : v.length;
    }

    public void chompValue() {
      char[] oldValue = getBinaryValue();
      if (oldValue == null) oldValue = new char[0];
      char[] newValue = new char[Math.max(oldValue.length - 2, 0)];
      System.arraycopy(oldValue, 0, newValue, 0, newValue.length);
      setValue(newValue);
    }

    public String toString() {
      return getValue();
    }
  }

  BufferedReader reader;
  String boundary;
  StringBuffer line;
  String nlBoundary;
  byte[] nlBoundaryBytes;

  private static int linepatience = 200;
  private int linenumber = 0;

  private int    __MAXBUFSIZE=1000;
  private byte[] __buf = new byte[__MAXBUFSIZE];
  private int    __bufsize = 0;
  private int    __bufidx = __MAXBUFSIZE;
  public  int    __hits = 0;
  public  int    __total = 0;
  public  int    __maxhits = 0;
  public  int    __hitsatthissize = 0;
  private final boolean doAdjust = true;

  public int getByte() throws IOException {
    if (reader != null) return reader.read();
//      print("^");
//      if (1 == 1) return sis.read();
    if (__bufidx >= __bufsize) {
      if (doAdjust && __maxhits > 3 && __maxhits > 0.6 * __hitsatthissize) {
        __maxhits = __hitsatthissize = 0;
        __MAXBUFSIZE *= 2;
        __buf = new byte[__MAXBUFSIZE];
        println("\n\nResizing buffer to " + __MAXBUFSIZE + "\n\n");
      }

      __bufidx = 0;
      for (int attempt = 0; attempt < 3; attempt++) {
//  	  __bufsize = reader.read(__buf, 0, __MAXBUFSIZE);
        __bufsize = sis.read(__buf, 0, __MAXBUFSIZE);
        if (__bufsize > 0) {
          break;
        }
        print("\nRead failed (" + __bufsize + "), trying again.");
        try {
          Thread.sleep(300 * attempt);
        } catch (Exception e) {
        }
      }

      if (__bufsize == __MAXBUFSIZE) {
        __maxhits++;
      }
      __hits++;
      __hitsatthissize++;
      __total += __bufsize;
    }
    if (__bufsize < 1) {
      println("\n********** Oops... end of input... size is " + __bufsize + "\n**************");
    }
    return __bufidx < __bufsize ? 0xff & __buf[__bufidx++] : -1;
  }

  public char getChar() throws IOException {
    return (char)getByte();
  }


//  private final static int __MAXBUFSIZE = 300;
//  private char[] __buf = new char[__MAXBUFSIZE];
//  private int __bufsize = 0;
//  private int __bufidx = __MAXBUFSIZE;
//
//  private int getChar() throws IOException {
//    if (__bufidx >= __bufsize) {
//      __bufidx = 0;
//      __bufsize = reader.read(__buf, 0, __MAXBUFSIZE);
//      if (debugLevel > 8) {
//        println("\nrequested " + __MAXBUFSIZE + " characters, received " + __bufsize);
//      }
//    }
//
//    int c = __bufidx < __bufsize ? __buf[__bufidx++] : -1;
//
//    if (debugLevel > 7) {
//      boolean goodChar = "<&[".indexOf(c) < 0 && c < 'z' && c > ' ';
//      print("{" + Integer.toHexString((char)c) + ":" +
//                     (goodChar ? (char)c : '.') + "}");
//    }
//    return c;
//  }

  private String readLine() throws IOException {
    if (debugLevel > 9 && linenumber++ > linepatience) {
      throw new IOException("enough... - ||" + linenumber + "/" + linepatience + "||");
    }

    if (debugLevel > 1) {
      print("\n(#" + linenumber + "." + debugLevel + ")");
    }
    line.delete(0, line.length());

    for (int c  = '\r';
             c != -1 && c != '\n';
             c = getChar()) {
      if (c != '\r') line.append((char)c);
    }

    if (debugLevel > 1) print("\r\n(" + line.length() + ")");
    if (debugLevel > 5) println(line + "||>");
    return line.toString();
  }

//  private boolean isBoundary()    {
//    return line.toString().startsWith(boundary);
//  }
//
  private boolean isEndBoundary() {
    return line.toString().equals(/*boundary + */"--");
  }

  private void setBoundary() throws IOException {
    boundary = readLine();
    if (!boundary.startsWith("----")) {
      throw new IOException("wrong multipart request boundary: \"" + boundary + "\"");
    }
    nlBoundary = "\r\n" + boundary;
    nlBoundaryBytes = nlBoundary.getBytes();
    println("got boundary: " + boundary);
  }

  private int copyTillBoundary(OutputStream output) throws IOException
{
    int counter = 0;
//    final int counterpatience = 50000;

    for (int boundaryIndex = 0; boundaryIndex < nlBoundaryBytes.length;) {
      if (debugLevel > 7) {
        if (counter % 16 == 0) {
          print ("\n" + counter + "] ");
        }
      }

      int read = getChar(); //reader.read();

      if (debugLevel > 8) {
        print("-" + boundaryIndex + "-");
      }
      if (read < 0) {
        println("Unexpected end of input...: " + read);
        break;
      }

      char c = (char)read;
      if (debugLevel > 6) {
        print(" \'" + Integer.toHexString(read) + ":" + c + "\' ");
      }

      byte expected = nlBoundaryBytes[boundaryIndex++];

      if (boundaryIndex > 1) {
        if (debugLevel > 6 && boundaryIndex > 1) {
          print(" vs {" + Integer.toHexString(expected) + ":" +
                ((expected < 'z' && expected > ' ') ? (char)expected : '.') +
                " [" + boundaryIndex + "]}");
        }
      }

      if (read != expected) {
        if (debugLevel > 6 && boundaryIndex > 1) {
          print(" (must be data, " + (boundaryIndex - 1) + " chars) ");
        }
        output.write(nlBoundaryBytes, 0, boundaryIndex - 1);
        counter += boundaryIndex;
        expected = nlBoundaryBytes[0];
        boundaryIndex = read == expected ? 1 : 0;
      }

      if (read != expected) {
        if (debugLevel > 6) print (" !" + (char)read + "! ");
        output.write(read);
      }
//      if (counter >= counterpatience) throw new IOException("Too many characters, " + counter);
    }
    return counter;
  }

  private String readTillBoundary() throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    copyTillBoundary(baos);
//    return new String(baos.toByteArray()); - can't do that: will try to decode
    String result = new String(Tools.toChars(baos.toByteArray()));
    if (debugLevel > 5) println("\nreadTillBoundary: received " + result.length() + " chars.");
    return result;
  }

  public ServerHttpRequest(HttpServletRequest originalRequest) {
    this(originalRequest, 0);
  }

  public ServerHttpRequest(HttpServletRequest originalRequest, boolean wantDebug)
  {
    this(originalRequest, wantDebug ? 10 : 0);
  }

  public ServerHttpRequest(HttpServletRequest originalRequest, int debugLevel) {
    this(originalRequest, debugLevel, (PrintWriter)null);
  }

  public ServerHttpRequest(HttpServletRequest originalRequest, int debugLevel, OutputStream stream) {
    this(originalRequest, debugLevel, new OutputStreamWriter(stream));
  }

  public ServerHttpRequest(HttpServletRequest originalRequest, int debugLevel, Writer writer) {
    this(originalRequest, debugLevel, new PrintWriter(writer));
  }

  public ServerHttpRequest(HttpServletRequest originalRequest, int debugLevel, javax.servlet.jsp.JspWriter writer) {
    this(originalRequest, debugLevel, new PrintWriter(writer));
  }

  public ServerHttpRequest(HttpServletRequest originalRequest, int debugLevel, PrintWriter printer) {
    this.debugLevel = debugLevel;
    if (printer != null) {
      this.printer = printer;
    }

    try {
        org = originalRequest;
        sis = org.getInputStream();
//
//        reader = org.getReader();
        line        = new StringBuffer();
        String contentType = getContentType();
        if (debugLevel > 3) {
          println("content type: \"" + contentType + "\"");
        }

        if (contentType != null && contentType.startsWith("multipart/form-data")) {
          boundary = "--" + contentType.substring(
                            contentType.indexOf("boundary=") +
                            "boundary=".length());
          parameters = new Hashtable();

          Enumeration keys = org.getParameterNames();
          while (keys.hasMoreElements()) {
            String key = (String)keys.nextElement();
            if (debugLevel > 1) {
              println(" key=" + key + ". ");
            }
            parameters.put(key, org.getParameterValues(key));
          }
          println("Will read it...");

          ComplexValue  value = null;
          setBoundary();
//        while (!r.isEndBoundary() && r.readLine() != null) {
//          if (DEBUG) debugInfo +=",";// + r.line + "\n<br>";
//
//          if (r.isBoundary()) {
//            if (DEBUG) debugInfo += "\n--boundary--";
//          }
//
          if (debugLevel > 1) print("reading lines...");

          while (!isEndBoundary() && readLine() != null) {
            println("*** got line number " + linenumber + ".");

            // okay now, have some data...
//            r.readLine();
            if (debugLevel > 5) {
              print(":" + line);
            }

            if (!line.toString().startsWith("Content-Disposition: form-data;")) {
              if (debugLevel > 1) print("(-)");
              continue;
            }

            value = new ComplexValue();
            value.extractProperty("name", line);

            if (value.getName() != null) {
              addValue(value);
              if (debugLevel > 1) {
                println("name is " + value.getName() + ", value is " +
                        value.toString());
              }
            } else {
              continue;
            }

            value.extractProperty("filename", line);
            if (debugLevel > 1) {
              println("filename is " + value.get("filename"));
            }

            while (readLine().length() > 0) {
              if (debugLevel > 1) {
                println(";");
                println(line.toString());
              }

              int seppos = line.toString().indexOf(':');
              String attrName  = line.substring(0, seppos);
              String attrValue = line.substring(seppos+2);
              value.setAttribute(attrName, attrValue);
              println("got attribute " + attrName + " = \"" + attrValue + "\"");
            }
            println("End of attributes for " + value.getName() + " will read till boundary...");

            String valueValue = readTillBoundary();
            value.setValue(valueValue);
//            value.chompValue();
            char[] bv = value.getBinaryValue();
            if (debugLevel > 1) {
              println("\nTotal " + (bv == null ? "null" : ("" + bv.length)) +
                      " chars");
//              println("   " + value.getName() + " = \"" + value.toString() + "\"");
            }
            print ("\n.......................\ndone with value named \"" + value.getName() +
                   "\", line number is " + linenumber +
                   "\n....................\n");
          }
        }
      } catch (Exception e) {
        if (debugLevel > 3) {
          e.printStackTrace(this.printer);
        } else if (debugLevel > 1) {
          println(e.toString());
        }
      }
      this.printer.flush();
  }

  public String getAuthType()
  {
    return org.getAuthType();
  }
  public Cookie[] getCookies()
  {
    return org.getCookies();
  }
  public long getDateHeader(String name)
  {
    return org.getDateHeader(name);
  }
  public String getHeader(String name)
  {
    return org.getHeader(name);
  }
  public Enumeration getHeaders(String name)
  {
    return org.getHeaders(name);
  }
  public Enumeration getHeaderNames()
  {
    return org.getHeaderNames();
  }
  public int getIntHeader(String name)
  {
    return org.getIntHeader(name);
  }
  public String getMethod()
  {
    return org.getMethod();
  }
  public String getPathInfo()
  {
    return org.getPathInfo();
  }
  public String getPathTranslated()
  {
    return org.getPathTranslated();
  }
  public String getContextPath()
  {
    return org.getContextPath();
  }
  public String getQueryString()
  {
    return org.getQueryString();
  }
  public String getRemoteUser()
  {
    return org.getRemoteUser();
  }
  public boolean isUserInRole(String role)
  {
    return org.isUserInRole(role);
  }
  public Principal getUserPrincipal()
  {
    return org.getUserPrincipal();
  }
  public String getRequestedSessionId()
  {
    return org.getRequestedSessionId();
  }
  public String getRequestURI()
  {
    return org.getRequestURI();
  }
  public String getServletPath()
  {
    return org.getServletPath();
  }
  public HttpSession getSession(boolean create)
  {
    return org.getSession(create);
  }
  public HttpSession getSession()
  {
    return org.getSession();
  }
  public boolean isRequestedSessionIdValid()
  {
    return org.isRequestedSessionIdValid();
  }
  public boolean isRequestedSessionIdFromCookie()
  {
    return org.isRequestedSessionIdFromCookie();
  }
  public boolean isRequestedSessionIdFromURL()
  {
    return org.isRequestedSessionIdFromURL();
  }
  public boolean isRequestedSessionIdFromUrl()
  {
    return org.isRequestedSessionIdFromUrl();
  }
  public Object getAttribute(String name)
  {
    return org.getAttribute(name);
  }
  public Enumeration getAttributeNames()
  {
    return org.getAttributeNames();
  }
  public String getCharacterEncoding()
  {
    String encoding = org.getCharacterEncoding();
    return encoding == null ? "ISO8859_1" : encoding;
  }
  public int getContentLength()
  {
    return org.getContentLength();
  }
  public String getContentType()
  {
    return org.getContentType();
  }
  public ServletInputStream getInputStream() throws IOException
  {
    return org.getInputStream();
  }

  private void addValue(ComplexValue cv) {
    addValue(cv.getName(), cv);
    String[] tmp = getParameterValues(cv.getName());
//    if (debugLevel > 8) for (int i = 0; i < tmp.length; i++) println(cv.getName() + "[" + i + "]=\"" + tmp[i] + "\"");
  }

  private void addValue(String name, ComplexValue cv) {
    ComplexValue[] cva = (ComplexValue[])parameters.get(name);
    ComplexValue[] newCva = new ComplexValue[cva == null ? 1 : cva.length + 1];
    if (cva != null) System.arraycopy(cva, 0, newCva, 0, cva.length);
    newCva[newCva.length - 1] = cv;

//    if (DEBUG) debugInfo += "added value # " + newCva.length + " for " + name + "...\n";
    parameters.put(name, newCva);

    if (debugLevel > 8) {
      println("--PARAMETERS--");
      for (Enumeration e = parameters.keys(); e.hasMoreElements(); ) {
        println("  - " + e.nextElement().toString());
      }
      println("--------------");
    }
  }

  public String getParameter(String name)
  {
    if (parameters == null) return org.getParameter(name);
    Object p = parameters.get(name);
    if (p == null) return null;
    if (p instanceof String[]) return ((String[])p)[0];
    if (p instanceof ComplexValue[]) return  ((ComplexValue[])p)[0].toString();
    return null;
  }

  public void setParameter(String name, String value) {
    if (parameters == null) parameters = new Hashtable();
    parameters.put(name, value);
  }

  public void removeParameter(String name) {
    if (parameters != null) parameters.remove(name);
  }

  public ComplexValue getComplexParameter(String name)
  {
    if (parameters == null) return null;
    Object p = parameters.get(name);
    return (p == null) ? null : ((ComplexValue[])p)[0];
  }

  public String getParameter(String name, String propertyName)
  {
    ComplexValue p = getComplexParameter(name);
    Object result = p == null ? null : p.get(propertyName);
    return result == null ? null : result.toString();
  }

  public String getParameterAttribute(String name, String attributeName)
  {
    ComplexValue p = getComplexParameter(name);
    Object result = p == null ? null : p.getAttribute(attributeName);
    return result == null ? null : result.toString();
  }

  public String getParameterContentType(String name)
  {
    ComplexValue p = getComplexParameter(name);
    Object result = p == null ? null : p.getAttribute("content-type");
    return result == null ? null : result.toString();
  }

  public String getParameterName(String parameter) {
    ComplexValue p = getComplexParameter(parameter);
    return p == null ? parameter : p.getAttribute("filename").toString();
  }

  public char[] getParameterValue(String name)
  {
    ComplexValue p = getComplexParameter(name);
    return p == null ? null : p.getBinaryValue();
  }

  public int getParameterValueLength(String name)
  {
    ComplexValue p = getComplexParameter(name);
    return p == null ? 0 : p.getValueLength();
  }

  public Enumeration getParameterNames()
  {
    if (debugLevel > 8 && parameters != null) {
      println("--getParameterNames--");
      for (Enumeration e = parameters.keys(); e.hasMoreElements(); ) {
        println("  * " + e.nextElement().toString());
      }
      println("--------------");
    }

    return parameters == null ? org.getParameterNames() :
           parameters.keys();
  }

  public String[] getParameterValues(String name)
  {
    if (parameters == null) return org.getParameterValues(name);
    Object p = parameters.get(name);
    if (p == null) return null;
    if (p instanceof String[]) return (String[])p;
    if (p instanceof ComplexValue[]) {

      ComplexValue[] cva = (ComplexValue[])p;
      String[]        sa = new String[cva.length];

      for (int i = 0; i < cva.length; i++) {
        sa[i] = cva[i] == null ? "-null-" : cva[i].toString();
      }
      return sa;
    }
    return null;
  }

  public String getProtocol()
  {
    return org.getProtocol();
  }
  public String getScheme()
  {
    return org.getScheme();
  }
  public String getServerName()
  {
    return org.getServerName();
  }
  public int getServerPort()
  {
    return org.getServerPort();
  }
  public BufferedReader getReader() throws IOException
  {
    return org.getReader();
  }
  public String getRemoteAddr()
  {
    return org.getRemoteAddr();
  }
  public String getRemoteHost()
  {
    return org.getRemoteHost();
  }
  public void setAttribute(String name, Object o)
  {
    org.setAttribute(name, o);
  }
  public void removeAttribute(String name)
  {
    org.removeAttribute(name);
  }
  public Locale getLocale()
  {
    return org.getLocale();
  }
  public Enumeration getLocales()
  {
    return org.getLocales();
  }
  public boolean isSecure()
  {
    return org.isSecure();
  }
  public RequestDispatcher getRequestDispatcher(String path)
  {
    return org.getRequestDispatcher(path);
  }
  public String getRealPath(String path)
  {
    return org.getRealPath(path);
  }

  public StringBuffer getRequestURL() {
    return null;//org.getRequestURL();
  }
  public void setCharacterEncoding(String encoding)
         throws java.io.UnsupportedEncodingException {
//    org.setCharacterEncoding(encoding);
  }

  public java.util.Map getParameterMap() {
    return null;//org.getParameterMap();
  }
}
