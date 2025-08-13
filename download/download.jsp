<%@ page import="java.io.*"
%><%@ page import="java.util.zip.*"
%><%
// Look above... had to do it this way, to avoid emitting any space chars...

final String zipfilename = request.getParameter("name") == null ?
                           "download.zip" :
                           request.getParameter("name");

final int DEFAULT_SIZE = 4096;

class Zipper
{
  ByteArrayOutputStream baos;
  ZipOutputStream zip;

  StringWriter log = new StringWriter();
  boolean    doLog;

  public Zipper(boolean doLog) throws IOException
  {
    baos = new ByteArrayOutputStream(DEFAULT_SIZE);
    zip = new ZipOutputStream(baos);
    zip.setMethod(ZipOutputStream.DEFLATED);
    zip.setLevel(Deflater.BEST_COMPRESSION);
    this.doLog = doLog;
    log("File " + zipfilename + " " + new java.util.Date() + "\n");
  }

  public void log(String s, boolean doit) {
    if (doit) log.write(s);
  }

  public void log(String s) {
    log(s, doLog);
  }

  public int size() {
    return baos.size();
  }

  public void writeTo(OutputStream out) throws IOException {
    baos.writeTo(out);
  }

  private void addFile(ZipEntry ze, InputStream is, boolean fullLog) throws IOException {
    zip.putNextEntry(ze);
    log("added stream " + ze + " (" + ze.getTime() + ") - ", fullLog);
    int bRead;
    int counter = 0;
    byte[] buf = new byte[4096];

    while ((bRead = is.read(buf)) > -1) {
      counter += bRead;
      zip.write(buf, 0, bRead);
    }
    log("" + counter + " bytes.\n");
  }

  public void addFile(String fname, long time, InputStream is, boolean fullLog) throws IOException {
    ZipEntry ze = new ZipEntry(fname);
    ze.setTime(time);
    addFile(ze, is, fullLog);
  }

  public void addFile(String name, File file) throws IOException {
    String path = file.getPath();

    if (file.isFile()) {
      log("added file " + name + " (" + path + ") - ");
      addFile(name, file.lastModified(), new FileInputStream(file), false);
    } else if (file.isDirectory()) {
      File[] contents = file.listFiles();
      log("added directory " + name + " (" + path + ") - " + contents.length + " entries.\n");
      for (int i = 0; i < contents.length; i++) {
        String fileName = name + contents[i].getPath().substring(path.length());
        addFile(fileName, contents[i]);
//        addFile("file_" + i, 0, "directory: " + directoryName + ", file: " + contents[i] + ", name: " + fileName);
      }
    } else {
      log(name + " (" + path + ") - not found.\n");
    }
  }

  public void addFile(String fname, long time, String data) throws IOException {
    addFile(fname, time, data.getBytes());
  }

  public void addFile(ZipEntry ze, byte[]data) throws IOException {
    zip.putNextEntry(ze);
    zip.write(data, 0, data.length);
  }

  public void addFile(String fname, long time, byte[]data) throws IOException {
    ZipEntry ze = new ZipEntry(fname);
    ze.setTime(time == 0 ? new java.util.Date().getTime() : time);
    addFile(ze, data);
  }

  public void close() throws IOException {
    if (doLog) {
      log.close();
      doLog = false;
      addFile(".log", 0, log.toString());
    }
    zip.close();
  }
}

  String base=request.getParameter("resource-base");
  if (base == null) base = ".";
  String absoluteBase = base;
  try {
    absoluteBase = new File(base).getAbsolutePath();
  } catch (Exception e) {}

  String files = request.getParameter("files");
  String[]list = files == null ? new String[0] : files.split(";");

  if (list.length == 0) { %>
    <html><body>
      <b>Error: no files specified for download.</b>
    </body></html>
<%} else {

    Zipper myZipper = new Zipper(request.getParameter("log") != null);

    for (int i = 0; i < list.length; i++) {
      String entry = list[i];
      int idx1 = entry.indexOf('(');
      int idx2 = entry.indexOf(')');
      String name = entry;
      String path = entry;
      File file = new File(path);

      if (idx1 > 0 && idx2 > idx1) {
        name = entry.substring(0, idx1);
        path = entry.substring(idx1 + 1, idx2);
        file = new File(path);
      }

      if (file.isAbsolute()) {
        if (name.startsWith(absoluteBase)) name = name.substring(absoluteBase.length() + 1);
      } else {
        file = new File(absoluteBase, path);
      }

      try {
        myZipper.addFile(name, file);
      } catch (Exception e) {
      }
    }

    try {
      myZipper.close();
      response.setContentType("application/x-zip-compressed");
      response.addHeader("Content-Disposition", "attachment; filename=\"" + zipfilename + "\"");
      response.setContentLength(myZipper.size());
      OutputStream os = response.getOutputStream();
      myZipper.writeTo(os);
      os.close();
    } catch (Exception e) {
    }
  }
%>