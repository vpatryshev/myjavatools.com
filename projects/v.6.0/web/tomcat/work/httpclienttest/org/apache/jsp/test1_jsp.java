package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class test1_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static java.util.Vector _jspx_dependants;

  public java.util.List getDependants() {
    return _jspx_dependants;
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    JspFactory _jspxFactory = null;
    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      _jspxFactory = JspFactory.getDefaultFactory();
      response.setContentType("text/html");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;


  java.util.Map expected = new java.util.HashMap();
  expected.put("name", "J.Doe");
  expected.put("email", "abuse@spamcop.com");
  if (request.getParameterMap().size() > 0) {
    boolean success = true;
    for (java.util.Iterator i = expected.entrySet().iterator();
         i.hasNext();) {
      java.util.Map.Entry entry = (java.util.Map.Entry)i.next();
      String key   = (String)entry.getKey();
      String value = (String)entry.getValue();
      String actual= request.getParameter(key);
      if (!value.equals(actual)) {
        
      out.write("Error: The value of ");
      out.print(key);
      out.write(" is \"");
      out.print(actual);
      out.write("\", must be \"");
      out.print(value);
      out.write('"');
      out.write('.');

        success = false;
      }
    }
    if (success) {
      out.write("Success");
}
  } else {
      out.write("\r\n");
      out.write("<html>\r\n");
      out.write("  <head>\r\n");
      out.write("    <title>\r\n");
      out.write("      test 1\r\n");
      out.write("    </title>\r\n");
      out.write("  </head>\r\n");
      out.write("  <body bgcolor=\"#ffffff\">\r\n");
      out.write("    <h1>Test 1. Simple Get</h1>\r\n");
      out.write("    <form method=\"get\">\r\n");
  for (java.util.Iterator i = expected.entrySet().iterator();
         i.hasNext();) {
      java.util.Map.Entry entry = (java.util.Map.Entry)i.next();
      String key   = (String)entry.getKey();
      String value = (String)entry.getValue();
      
      out.print(key);
      out.write(": <input type=\"text\" name=\"");
      out.print(key);
      out.write("\" value=\"");
      out.print(value);
      out.write("\"/><br />");

    }

      out.write("\r\n");
      out.write("      <input type=\"submit\">\r\n");
      out.write("    </form>\r\n");
      out.write("  </body>\r\n");
      out.write("</html>\r\n");
      out.write("\r\n");
}
      out.write('\r');
      out.write('\n');
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          out.clearBuffer();
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      if (_jspxFactory != null) _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
