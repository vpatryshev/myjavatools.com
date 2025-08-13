package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import org.apache.jasper.runtime.*;


public class test3$jsp extends HttpJspBase {


    static {
    }
    public test3$jsp( ) {
    }

    private static boolean _jspx_inited = false;

    public final void _jspx_init() throws org.apache.jasper.runtime.JspException {
    }

    public void _jspService(HttpServletRequest request, HttpServletResponse  response)
        throws java.io.IOException, ServletException {

        JspFactory _jspxFactory = null;
        PageContext pageContext = null;
        HttpSession session = null;
        ServletContext application = null;
        ServletConfig config = null;
        JspWriter out = null;
        Object page = this;
        String  _value = null;
        try {

            if (_jspx_inited == false) {
                synchronized (this) {
                    if (_jspx_inited == false) {
                        _jspx_init();
                        _jspx_inited = true;
                    }
                }
            }
            _jspxFactory = JspFactory.getDefaultFactory();
            response.setContentType("text/html;ISO-8859-1");
            pageContext = _jspxFactory.getPageContext(this, request, response,
            			"", true, 8192, true);

            application = pageContext.getServletContext();
            config = pageContext.getServletConfig();
            session = pageContext.getSession();
            out = pageContext.getOut();

            // begin [file="/test3.jsp";from=(0,2);to=(25,8)]
                
                  java.util.Map expected = new java.util.HashMap();
                  /*
                <form method="post" action="hi.iq/register.jsp" enctype="multipart/form-data">
                  Name:  <input type="text" name="name" value="J.Doe">
                  email: <input type="text" name="email" value="abuse@spamcop.com">
                  file: <input type="file" name="file-upload">
                  <input type="submit">
                </form>
                */
                
                  expected.put("name", "J.Doe");
                  expected.put("email", "abuse@spamcop.com");
                  expected.put("file-upload", "This is the test file");
                  com.myjavatools.web.ServerRequest myRequest =
                    new com.myjavatools.web.ServerRequest(request);
                  if (myRequest.getParameterNames().hasMoreElements()) {
                    boolean success = true;
                    for (java.util.Iterator i = expected.entrySet().iterator();
                         i.hasNext();) {
                      java.util.Map.Entry entry = (java.util.Map.Entry)i.next();
                      String key   = (String)entry.getKey();
                      String value = (String)entry.getValue();
                      String actual= myRequest.getParameter(key);
                      if (!value.equals(actual)) {
                        
            // end
            // HTML // begin [file="/test3.jsp";from=(25,10);to=(25,30)]
                out.write("Error: The value of ");

            // end
            // begin [file="/test3.jsp";from=(25,33);to=(25,36)]
                out.print(key);
            // end
            // HTML // begin [file="/test3.jsp";from=(25,38);to=(25,43)]
                out.write(" is \"");

            // end
            // begin [file="/test3.jsp";from=(25,46);to=(25,52)]
                out.print(actual);
            // end
            // HTML // begin [file="/test3.jsp";from=(25,54);to=(25,66)]
                out.write("\", must be \"");

            // end
            // begin [file="/test3.jsp";from=(25,69);to=(25,74)]
                out.print(value);
            // end
            // HTML // begin [file="/test3.jsp";from=(25,76);to=(25,78)]
                out.write("\".");

            // end
            // begin [file="/test3.jsp";from=(25,80);to=(29,18)]
                
                        success = false;
                      }
                    }
                    if (success) {
            // end
            // HTML // begin [file="/test3.jsp";from=(29,20);to=(29,27)]
                out.write("Success");

            // end
            // begin [file="/test3.jsp";from=(29,29);to=(30,10)]
                }
                  } else {
            // end
            // HTML // begin [file="/test3.jsp";from=(30,12);to=(40,0)]
                out.write("\r\n<html>\r\n  <head>\r\n    <title>\r\n      test 3\r\n    </title>\r\n  </head>\r\n  <body bgcolor=\"#ffffff\">\r\n    <h1>Test 3. Multipart Post With File</h1>\r\n    <form method=\"Post\">\r\n");

            // end
            // begin [file="/test3.jsp";from=(40,2);to=(45,6)]
                  for (java.util.Iterator i = expected.entrySet().iterator();
                         i.hasNext();) {
                      java.util.Map.Entry entry = (java.util.Map.Entry)i.next();
                      String key   = (String)entry.getKey();
                      String value = (String)entry.getValue();
                      
            // end
            // begin [file="/test3.jsp";from=(45,11);to=(45,14)]
                out.print(key);
            // end
            // HTML // begin [file="/test3.jsp";from=(45,16);to=(45,31)]
                out.write(": <input name=\"");

            // end
            // begin [file="/test3.jsp";from=(45,34);to=(45,37)]
                out.print(key);
            // end
            // HTML // begin [file="/test3.jsp";from=(45,39);to=(45,41)]
                out.write("\" ");

            // end
            // begin [file="/test3.jsp";from=(45,43);to=(46,35)]
                
                      if (key.startsWith("file")) {
            // end
            // HTML // begin [file="/test3.jsp";from=(46,37);to=(48,41)]
                out.write("\r\n        type=\"file\"/>\r\n        Please create a file containing \"");

            // end
            // begin [file="/test3.jsp";from=(48,44);to=(48,49)]
                out.print(value);
            // end
            // HTML // begin [file="/test3.jsp";from=(48,51);to=(48,71)]
                out.write("\" and upload it here");

            // end
            // begin [file="/test3.jsp";from=(48,73);to=(49,14)]
                
                      } else {
            // end
            // HTML // begin [file="/test3.jsp";from=(49,16);to=(51,15)]
                out.write("\r\n        type=\"text\"\r\n        value=\"");

            // end
            // begin [file="/test3.jsp";from=(51,18);to=(51,23)]
                out.print(value);
            // end
            // HTML // begin [file="/test3.jsp";from=(51,25);to=(51,28)]
                out.write("\"/>");

            // end
            // begin [file="/test3.jsp";from=(51,30);to=(52,7)]
                
                      }
            // end
            // HTML // begin [file="/test3.jsp";from=(52,9);to=(53,10)]
                out.write("\r\n    <br />");

            // end
            // begin [file="/test3.jsp";from=(53,12);to=(55,0)]
                
                    }
            // end
            // HTML // begin [file="/test3.jsp";from=(55,2);to=(61,0)]
                out.write("\r\n      <input type=\"submit\">\r\n    </form>\r\n  </body>\r\n</html>\r\n\r\n");

            // end
            // begin [file="/test3.jsp";from=(61,2);to=(61,3)]
                }
            // end
            // HTML // begin [file="/test3.jsp";from=(61,5);to=(62,0)]
                out.write("\r\n");

            // end

        } catch (Throwable t) {
            if (out != null && out.getBufferSize() != 0)
                out.clearBuffer();
            if (pageContext != null) pageContext.handlePageException(t);
        } finally {
            if (_jspxFactory != null) _jspxFactory.releasePageContext(pageContext);
        }
    }
}
