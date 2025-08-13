package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import org.apache.jasper.runtime.*;


public class test2$jsp extends HttpJspBase {


    static {
    }
    public test2$jsp( ) {
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

            // begin [file="/test2.jsp";from=(0,2);to=(15,8)]
                
                  java.util.Map expected = new java.util.HashMap();
                  expected.put("name", "J.Doe");
                  expected.put("email", "abuse@spamcop.com");
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
            // HTML // begin [file="/test2.jsp";from=(15,10);to=(15,30)]
                out.write("Error: The value of ");

            // end
            // begin [file="/test2.jsp";from=(15,33);to=(15,36)]
                out.print(key);
            // end
            // HTML // begin [file="/test2.jsp";from=(15,38);to=(15,43)]
                out.write(" is \"");

            // end
            // begin [file="/test2.jsp";from=(15,46);to=(15,52)]
                out.print(actual);
            // end
            // HTML // begin [file="/test2.jsp";from=(15,54);to=(15,66)]
                out.write("\", must be \"");

            // end
            // begin [file="/test2.jsp";from=(15,69);to=(15,74)]
                out.print(value);
            // end
            // HTML // begin [file="/test2.jsp";from=(15,76);to=(15,78)]
                out.write("\".");

            // end
            // begin [file="/test2.jsp";from=(15,80);to=(19,18)]
                
                        success = false;
                      }
                    }
                    if (success) {
            // end
            // HTML // begin [file="/test2.jsp";from=(19,20);to=(19,27)]
                out.write("Success");

            // end
            // begin [file="/test2.jsp";from=(19,29);to=(20,10)]
                }
                  } else {
            // end
            // HTML // begin [file="/test2.jsp";from=(20,12);to=(30,0)]
                out.write("\r\n<html>\r\n  <head>\r\n    <title>\r\n      test 2\r\n    </title>\r\n  </head>\r\n  <body bgcolor=\"#ffffff\">\r\n    <h1>Test 2. Simple Post</h1>\r\n    <form method=\"Post\">\r\n");

            // end
            // begin [file="/test2.jsp";from=(30,2);to=(35,6)]
                  for (java.util.Iterator i = expected.entrySet().iterator();
                         i.hasNext();) {
                      java.util.Map.Entry entry = (java.util.Map.Entry)i.next();
                      String key   = (String)entry.getKey();
                      String value = (String)entry.getValue();
                      
            // end
            // begin [file="/test2.jsp";from=(35,11);to=(35,14)]
                out.print(key);
            // end
            // HTML // begin [file="/test2.jsp";from=(35,16);to=(35,43)]
                out.write(": <input type=\"text\" name=\"");

            // end
            // begin [file="/test2.jsp";from=(35,46);to=(35,49)]
                out.print(key);
            // end
            // HTML // begin [file="/test2.jsp";from=(35,51);to=(35,60)]
                out.write("\" value=\"");

            // end
            // begin [file="/test2.jsp";from=(35,63);to=(35,68)]
                out.print(value);
            // end
            // HTML // begin [file="/test2.jsp";from=(35,70);to=(35,79)]
                out.write("\"/><br />");

            // end
            // begin [file="/test2.jsp";from=(35,81);to=(37,0)]
                
                    }
            // end
            // HTML // begin [file="/test2.jsp";from=(37,2);to=(43,0)]
                out.write("\r\n      <input type=\"submit\">\r\n    </form>\r\n  </body>\r\n</html>\r\n\r\n");

            // end
            // begin [file="/test2.jsp";from=(43,2);to=(43,3)]
                }
            // end
            // HTML // begin [file="/test2.jsp";from=(43,5);to=(44,0)]
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
