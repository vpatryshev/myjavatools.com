package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import org.apache.jasper.runtime.*;


public class test1$jsp extends HttpJspBase {


    static {
    }
    public test1$jsp( ) {
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

            // begin [file="/test1.jsp";from=(0,2);to=(13,8)]
                
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
                        
            // end
            // HTML // begin [file="/test1.jsp";from=(13,10);to=(13,30)]
                out.write("Error: The value of ");

            // end
            // begin [file="/test1.jsp";from=(13,33);to=(13,36)]
                out.print(key);
            // end
            // HTML // begin [file="/test1.jsp";from=(13,38);to=(13,43)]
                out.write(" is \"");

            // end
            // begin [file="/test1.jsp";from=(13,46);to=(13,52)]
                out.print(actual);
            // end
            // HTML // begin [file="/test1.jsp";from=(13,54);to=(13,66)]
                out.write("\", must be \"");

            // end
            // begin [file="/test1.jsp";from=(13,69);to=(13,74)]
                out.print(value);
            // end
            // HTML // begin [file="/test1.jsp";from=(13,76);to=(13,78)]
                out.write("\".");

            // end
            // begin [file="/test1.jsp";from=(13,80);to=(17,18)]
                
                        success = false;
                      }
                    }
                    if (success) {
            // end
            // HTML // begin [file="/test1.jsp";from=(17,20);to=(17,27)]
                out.write("Success");

            // end
            // begin [file="/test1.jsp";from=(17,29);to=(18,10)]
                }
                  } else {
            // end
            // HTML // begin [file="/test1.jsp";from=(18,12);to=(28,0)]
                out.write("\r\n<html>\r\n  <head>\r\n    <title>\r\n      test 1\r\n    </title>\r\n  </head>\r\n  <body bgcolor=\"#ffffff\">\r\n    <h1>Test 1. Simple Get</h1>\r\n    <form method=\"get\">\r\n");

            // end
            // begin [file="/test1.jsp";from=(28,2);to=(33,6)]
                  for (java.util.Iterator i = expected.entrySet().iterator();
                         i.hasNext();) {
                      java.util.Map.Entry entry = (java.util.Map.Entry)i.next();
                      String key   = (String)entry.getKey();
                      String value = (String)entry.getValue();
                      
            // end
            // begin [file="/test1.jsp";from=(33,11);to=(33,14)]
                out.print(key);
            // end
            // HTML // begin [file="/test1.jsp";from=(33,16);to=(33,43)]
                out.write(": <input type=\"text\" name=\"");

            // end
            // begin [file="/test1.jsp";from=(33,46);to=(33,49)]
                out.print(key);
            // end
            // HTML // begin [file="/test1.jsp";from=(33,51);to=(33,60)]
                out.write("\" value=\"");

            // end
            // begin [file="/test1.jsp";from=(33,63);to=(33,68)]
                out.print(value);
            // end
            // HTML // begin [file="/test1.jsp";from=(33,70);to=(33,79)]
                out.write("\"/><br />");

            // end
            // begin [file="/test1.jsp";from=(33,81);to=(35,0)]
                
                    }
            // end
            // HTML // begin [file="/test1.jsp";from=(35,2);to=(41,0)]
                out.write("\r\n      <input type=\"submit\">\r\n    </form>\r\n  </body>\r\n</html>\r\n\r\n");

            // end
            // begin [file="/test1.jsp";from=(41,2);to=(41,3)]
                }
            // end
            // HTML // begin [file="/test1.jsp";from=(41,5);to=(42,0)]
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
