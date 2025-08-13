<%@ page buffer="none" %><%@ page import="java.util.*" %><%@ page import="java.io.*" %><%
%><?xml version="1.0" encoding="UTF-8"?>
<deploy>
<%
  final int MAX_LOG_SIZE = 100000;


  class MultipartRequest { // does not implement anything ;)
    private HttpServletRequest org;
    private int debugLevel = 10;
    public CharArrayWriter debugInfo = new CharArrayWriter(MAX_LOG_SIZE + 100);
    public PrintWriter printer = new PrintWriter(debugInfo);
    private String filename = null;
    private int filesize = -1;
    BufferedReader reader = null;
    ServletInputStream sis = null;
    String boundary;
    String nlBoundary;
    byte[] nlBoundaryBytes;
    public StringBuffer line;
    private String contentType;

    public String getFilename() { return filename; }
    public int getFilesize() { return filesize; }

    private void print(String s) {
      if (debugLevel <= 0) {
        return;
      }
      if (debugInfo.size() + s.length() < MAX_LOG_SIZE) {
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

    int patience = 20;
    int linenumber = 0;

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

    public String readLine() throws IOException {
      if (debugLevel > 1) print("(#" + linenumber + ")");
      print(":");
      line.delete(0, line.length());

      for (int c  = '\r';
               c != -1 && c != '\n';
               c = getChar()) {
        if (c != '\r') line.append((char)c);
      }
      if (debugLevel > 1) print("\r\n(" + line.length() + ")");
      if (debugLevel > 5) println(line + "||>");
      if (++linenumber > patience) throw new IOException("enough... - ||" + linenumber + "||");
      return line.toString();
    }

    public boolean isBoundary()    {
      return line.toString().startsWith(boundary);
    }

    public boolean isEndBoundary() {
      return line.toString().equals(boundary + "--");
    }

    public int copyTillBoundary(OutputStream output) throws IOException {
      int counter = 0;

      for (int boundaryIndex = 0; boundaryIndex < nlBoundaryBytes.length;) {
        int read = getByte(); //reader.read();
	
        if (read < 0) {
          println("Unexpected end of input...: " + read);
          break;
        }
        byte b = (byte)read;

        if (debugLevel > 7) {
          boolean goodChar = "<&[".indexOf(b) < 0 && b < 'z' && b > ' '; 
          if (counter % 16 == 0) {
            print ("\n" + counter + "] ");
	  }
          print("{" + Integer.toHexString(0xff & b) + ":" +
                         (goodChar ? (char)b : '.') + "}");
        }

        byte expected = nlBoundaryBytes[boundaryIndex++];

        if (boundaryIndex > 1) {
          if (debugLevel > 6 && boundaryIndex > 3) {
            print(" vs {" + Integer.toHexString(expected) + ":" +
                  ((expected < 'z' && expected > ' ') ? (char)expected : '.') + "}");
          }
          if (read != expected) {
            if (debugLevel > 6) print(">" + (boundaryIndex-1) + ".");
            output.write(nlBoundaryBytes, 0, boundaryIndex - 1);
            counter += boundaryIndex - 1;
            boundaryIndex = 1;
            expected = nlBoundaryBytes[0];
          }
        }

//        if (debugLevel > 7) {
//          print("vs {" + Integer.toHexString(expected) + ":" +
//                ((expected < 'z' && expected > ' ') ? (char)expected : '.') + "}");
//        }
        if (read != expected) {
          boundaryIndex = 0;
          output.write(read);
          counter++;
        }
      }
      return counter;
    }

    public MultipartRequest(HttpServletRequest originalRequest) {
      this(originalRequest, 0);
    }

    public MultipartRequest(HttpServletRequest originalRequest, int debugLevel)
    {
      this(originalRequest, new PrintWriter(new CharArrayWriter(MAX_LOG_SIZE + 100)), debugLevel);    
    }

    public MultipartRequest(HttpServletRequest originalRequest, JspWriter writer)
    {
      this(originalRequest, new PrintWriter(writer), 10);
    }

    public MultipartRequest(HttpServletRequest originalRequest, OutputStream stream) {
      this(originalRequest, new PrintWriter(new OutputStreamWriter(stream)), 10);
    }

    public MultipartRequest(HttpServletRequest originalRequest, PrintWriter printer, int debugLevel) {
      this.printer = printer;
      this.debugLevel = debugLevel;
      println("com.borland.servlet.Request debug info");
      org  = originalRequest;
      line = new StringBuffer();
    }


    public String parse(File tmpFolder, File fileLocation)
    throws IOException {
      int expectedSize = 0;
      
//      reader = org.getReader();
      sis = org.getInputStream();
      contentType = org.getContentType();
      if (debugLevel > 3) println("content type: \"" + contentType + "\"");

      if (contentType == null || !contentType.startsWith("multipart/form-data")) {
        throw new IOException("wrong content type, expected multipart: " + contentType);
      }

      print("Will read it...");

      try {
        boundary = readLine();
        nlBoundary = "\r\n" + boundary;
        nlBoundaryBytes = nlBoundary.getBytes();
        if (debugLevel > 3) println(" have boundary: |" + boundary + "|");

        print(" ...past the first boundary!... ");

        while (!isEndBoundary() && readLine() != null) {
          print(".");

          if (!line.toString().startsWith("Content-Disposition: form-data;")) {
            print("(-)");
            continue;
          }

          String name = extractValue(line, "name");
          print("**Got parameter \"" + name + "\"\n");

          if ("debug".equals(name)) {
            debugLevel = 10;
            print ("---DEBUG---\n");
//	    print ("Reader is " + reader);
            try {
	      throw new Exception("---DEBUG---");
	    } catch (Exception x) {
              x.printStackTrace(printer);
	    }
            continue;
          }
 	  
          if ("size".equals(name)) {
            readLine();
	    String theLine = readLine();

	    for (int i = 0; i < theLine.length(); i++) {
	      char c = theLine.charAt(i);
	      if ('0' <= c && c <= '9') expectedSize = expectedSize * 10 + (c - '0');
	    }
	    
            print("expected size: \"" + expectedSize + "\"\n");
//            expectedSize = Integer.parse(debugLevel = 10;
            continue;
          }
 	  
          if (!"file".equals(name)) {
            print("(unknown parameter " + name);
            continue;
          }
          print("(+)");
          filename = extractValue(line, "filename");
          print("filename is " + filename + "\r\n");
          int lastseparator = Math.max(filename.lastIndexOf('/'),
                                       filename.lastIndexOf('\\'));
          String simplename = lastseparator < 0 ? filename :
                              filename.substring(lastseparator+1);
          File file = new File(fileLocation, simplename);
          File tmpFile = File.createTempFile(simplename, null, tmpFolder);

          OutputStream output = new FileOutputStream(tmpFile);
          skipAttributes();
          print(" will read value... ");
          filesize = copyTillBoundary(output);
          println("...received " + filesize + " bytes...");
          output.close();
          if (expectedSize <= 0 || filesize == expectedSize) {
            tmpFile.renameTo(file);
	    return null;
	  } else { 
            return "Wrong file size; expected: " + expectedSize + 
	           ", actual: " + filesize + "; tmp file stored at " + tmpFile;
	  }
        }
      } catch (Exception e) {
        print(e.toString());
        if (debugLevel > 0) {
          StringWriter sw = new StringWriter();
          e.printStackTrace(new PrintWriter(sw));
          print(sw.getBuffer().toString());
        }
        return "Exception " + e;
      }
      return null;
    }

    public void skipAttributes() throws IOException {
      // skipping attributes...
      while (readLine().length() > 0) {
    //    print(";" + line);
      }
    }

    public final String extractValue(StringBuffer input, String name) {
      int iname = input.indexOf(name + "=\"");
      if (iname < 0) return null;

      int ivalue = iname + name.length() + 2;
      int ievalu = input.indexOf("\"", ivalue);
      if (ievalu < 0) return null;

      return input.substring(ivalue, ievalu);
    }
  }

  MultipartRequest rq = new MultipartRequest(request, 0);
  OutputStream logstream = null;
//  logstream = new FileOutputStream("/home/marvin/tkit/tmp/rq.log");
//  MultipartRequest rq = new MultipartRequest(request, logstream);
  rq.println("parsing the request...");
  try {
    String tmpdirname = getServletContext().getAttribute("javax.servlet.context.tempdir").toString();
    File tmpFolder = new File(tmpdirname);
    java.io.File deployFolder = new java.io.File(tmpdirname.substring(0, tmpdirname.indexOf("work") - 1), "deploy");
    String message = rq.parse(tmpFolder, deployFolder);
    if (logstream != null) logstream.close();
//    if (1 + 1 > 1)  throw new Exception("stop it");
    if (rq.debugInfo.size() > 0)
    {%><debug-info>
    <%=rq.debugInfo%>
    </debug-info>
    <%}%>
    
    <%if (message != null) { %>
      <error>
        <%=message%>
      </error>
    <% } else {%>
      <received file="<%=rq.getFilename()%>" size="<%=rq.getFilesize()%>"/>
      <stats 
        bytes="<%=rq.__total%>" 
	calls="<%=rq.__hits%>" 
	average="<%=((float)rq.__total) / rq.__hits%>" 
	size="<%=rq.__MAXBUFSIZE%>"
	maxhits="<%=rq.__maxhits%>"
	hitsthisize="<%=rq.__hitsatthissize%>"/>
    <%}
  } catch (Exception e) {
    %><error>
        <stacktrace><% e.printStackTrace(new java.io.PrintWriter(out));%>
        </stacktrace>
     </error>
     <debug-info><%=rq.debugInfo%></debug-info><%
  }%>
</deploy>
