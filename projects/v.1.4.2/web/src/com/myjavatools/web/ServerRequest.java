package com.myjavatools.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Cookie;
import java.util.Hashtable;
import java.util.Enumeration;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import javax.servlet.ServletInputStream;
import java.util.Locale;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.Math;
import javax.servlet.RequestDispatcher;

import com.myjavatools.lib.Tools;
import java.util.Collections;

/**
 * <p>Title: Server Request class</p>
 * <p>Description: this class helps to handle multipart requests in servlets and jsp.
 * It is indispensable in handling file uploads - there is no "standard" Servlet API for these.</p>
 *
 * @author Vlad Patryshev
 * @version 1.3.1
 */
public class ServerRequest implements HttpServletRequest
{
  private HttpServletRequest org;
  private Hashtable parameters = null;
  private static boolean DEBUG = false;
  public String debugInfo = "com.myjavatools.web.ServerRequest debug info\n";

  /**
   * <p>Title: Complex Value class</p>
   * <p>Description: this class is used in handling multipart request parameter data.
   * In "simple" requests a parameter is a name-value pair; not so with files in multipart request:
   * these have a name, a filename, and the contents of the file.
   * </p>
   * An instance of ComplexValue has a name and a value, and may have other attributes.
   * The value can be treated as binary or a string - the actual nature of the data
   * is not determined; it is all up to the user.</p>
   */
  public class ComplexValue extends Hashtable
  {
    /**
     * Creates a default, empty, ComplexValue
     */
    public ComplexValue() {
      super();
    }

    /**
     * Creates a ComplexValue with a name
     *
     * @param name String the name
     */
    public ComplexValue(String name) {
      this();
      setName(name);
    }

    /**
     * Creates a ComplexValue with a name and a value
     *
     * @param name String the name
     * @param value Object the value
     */
    public void setAttribute(String name, Object value) {
      if (value != null && name != null) {
        put(name, value);
      }
    }

    /**
     * Assigns a value of an attribute to the Complex value
     *
     * @param name String the name of the attribute
     * @param from String a string that, among other things, is supposed
     * to contain something like <pre>name="value"</pre> - and if this is
     * found, the substring within quotes is assumed to be the value
     */
    public void copyAttribute(String name, String from) {
      setAttribute(name, Tools.extractValue(from, name));
    }

    public Object getAttribute(String name) {
      return get(name);
    }

    public String getName()              { return (String)get("name"); }
    public void   setName(String name)   { setAttribute("name", name); }

    public char[] getBinaryValue()       { return (char[])get(".");  }
    public String getValue()             {
      char[] bv = getBinaryValue();
      return bv == null ? null : new String(bv);
    }

    public void   setValue(char[] value) { setAttribute(".", value); }

    public void   setValue(String value) {
      setValue(value.toCharArray());
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

  private class Input {
    BufferedReader reader;
    String boundary;
    String line;
    int position;
    boolean gotBoundary = false;

    Input(HttpServletRequest org) throws IOException {
      this.reader = org.getReader();
      position    = 0;
      line        = "";
      String contentType = org.getContentType();
      if (contentType.startsWith("multipart/form-data")) {
        boundary = "--" + contentType.substring(
                          contentType.indexOf("boundary=") +
                          "boundary=".length());
      }
    }

    boolean ready() throws IOException {
      return position < line.length() || reader.ready();
    }

    String readLine() throws IOException {
      if (position >= line.length()) {
        line     = reader.readLine();
        gotBoundary = isEndBoundary();
//System.err.print("(" + line.length() + ")");
        if (DEBUG) debugInfo += "<br>" + line + "||>";
        position = line == null ? 0 : line.length();
        return line;
      }
      String result = line.substring(position);
      position      = line.length();
      return result;
    }

    boolean isBoundary()    { return line.startsWith(boundary); }
    boolean isEndBoundary() { return line.equals(gotBoundary ? "--" :
                                                   (boundary + "--")); }

    String readTillBoundary() throws IOException {
      StringBuffer buffer = new StringBuffer();
      gotBoundary = false;

      for (int boundaryIndex = 0; boundaryIndex < boundary.length();) {
        char c = (char)reader.read();
        if (c != boundary.charAt(boundaryIndex++)) {
          String s = boundary.substring(0, boundaryIndex - 1);
          buffer.append(s);
            if (DEBUG) {
              String msg = "[" + buffer.length() + "]" + s;
              System.err.print(msg);
              debugInfo += msg;
            }
          boundaryIndex = 0;
          buffer.append(c);
          if (DEBUG) {
            String msg = "[" + Tools.toHex(buffer.length()) +
                         ":" + Tools.toHex((byte)c) + "]" +
                         ((c < 'z' && c > ' ') ? c : '.');
            System.err.print(msg);
            debugInfo += msg;
          }
        }
      }
      gotBoundary = true;
      return buffer.toString();
    }
  }

  public ServerRequest(HttpServletRequest originalRequest) {
    this(originalRequest, false);
  }

  public ServerRequest(HttpServletRequest originalRequest, boolean wantDebug)
  {
    DEBUG = wantDebug;
    org = originalRequest;
    String ct = getContentType();
    if (DEBUG) {
      debugInfo += ct + "\n";
    } else {
      debugInfo = "";
    }

    if (ct != null && ct.startsWith("multipart/form-data")) {
      parameters = new Hashtable();

      Enumeration keys = org.getParameterNames();
      while (keys.hasMoreElements()) {
        String key = (String)keys.nextElement();
        if (DEBUG) debugInfo += " [" + key + "] ";
        parameters.put(key, org.getParameterValues(key));
      }
      if (DEBUG) debugInfo += "Gonna read it...";

      try {
        Input r = new Input(org);

        ComplexValue  value = null;
//System.err.println("looking for the first boundary...");
        while (!r.isEndBoundary() && r.readLine() != null) {
          if (DEBUG) debugInfo +=",";// + r.line + "\n<br>";

          if (r.isBoundary()) {
            if (DEBUG) debugInfo += "\n--boundary--";
        }

        while (!r.isEndBoundary() && r.readLine() != null) {
          if (DEBUG) debugInfo +=".";// + r.line + "\n<br>";

            // okay now, have some data...
//            r.readLine();
            if (DEBUG) debugInfo += ":" + r.line;

            if (!r.line.startsWith("Content-Disposition: form-data;")) {
              continue;
            }

            value = new ComplexValue();
            value.copyAttribute("name", r.line);

            if (value.getName() == null) {
              continue;
            }

            addValue(value);
            if (DEBUG) debugInfo += "name is " + value.getName() + ", value is " + value.toString() + "\n";

            value.copyAttribute("filename", r.line);
            if (DEBUG) debugInfo += "filename is " + value.getAttribute("filename") + "\n";

            while (r.readLine().length() > 0) {
              if (DEBUG) debugInfo += ";" + r.line;

              int seppos = r.line.indexOf(':');
              String attrName  = r.line.substring(0, seppos);
              String attrValue = r.line.substring(seppos+2);
//              System.err.println("attr " + attrName + " = " + attrValue);
              value.setAttribute(attrName, attrValue);
            }
//System.err.println("gonna read value...");
            value.setValue(r.readTillBoundary());
            value.chompValue();
            if (DEBUG) {
              char[] bv = value.getBinaryValue();
              debugInfo += "\nTotal " + (bv == null ? "null" : ("" + bv.length)) +
                  " chars\n  " + value.getName() +
                  " = \"" + value.toString() + "\"\n";
            }
          }
        }
      } catch (Exception e) {
        e.printStackTrace(System.out);
        if (DEBUG) debugInfo += e.toString();
      }
    }
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
//    if (DEBUG) for (int i = 0; i < tmp.length; i++) debugInfo += cv.getName() + "[" + i + "]=\"" + tmp[i] + "\"<br>";
  }

  private void addValue(String name, ComplexValue cv) {
    ComplexValue[] cva = (ComplexValue[])parameters.get(name);
    ComplexValue[] newCva = new ComplexValue[cva == null ? 1 : cva.length + 1];
    if (cva != null) System.arraycopy(cva, 0, newCva, 0, cva.length);
    newCva[newCva.length - 1] = cv;

//    if (DEBUG) debugInfo += "added value # " + newCva.length + " for " + name + "...\n";
    parameters.put(name, newCva);
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

  public void removeParameter(String name) {
    if (parameters != null) parameters.remove(name);
  }

  public ComplexValue getComplexParameter(String name)
  {
    if (parameters == null) return null;
    Object p = parameters.get(name);
    return (p == null) ? null : ((ComplexValue[])p)[0];
  }

  public String getParameter(String name, String attributeName)
  {
    ComplexValue p = getComplexParameter(name);

//    if (DEBUG) debugInfo += "getParameter(" + name + "," + attributeName + ") -> " + p;
//    if (DEBUG) if (p != null) debugInfo += " -> " + p.getAttribute(attributeName);
//    if (DEBUG) debugInfo += "<br>\n";

    return p == null ? null : p.getAttribute(attributeName).toString();
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
    return parameters == null ? org.getParameterMap()
                              : Collections.unmodifiableMap(parameters);
  }
}
