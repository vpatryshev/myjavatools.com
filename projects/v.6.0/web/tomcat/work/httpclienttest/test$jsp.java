package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import org.apache.jasper.runtime.*;


public class test$jsp extends HttpJspBase {


    static {
    }
    public test$jsp( ) {
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

            // HTML // begin [file="/test.jsp";from=(0,0);to=(1,0)]
                out.write("<html>\r\n");

            // end
            // begin [file="/test.jsp";from=(1,2);to=(47,0)]
                
                        java.lang.StringBuffer msg = new java.lang.StringBuffer("Request params:\n");
                System.out.println("id=" + request.getParameter("id"));
                        java.util.Enumeration enum = request.getParameterNames();
                        while (enum.hasMoreElements())
                        {
                                String str = (String)enum.nextElement();
                                String values[] = request.getParameterValues(str);
                                if (values==null)                       // impossible!
                                {
                                        continue;
                                }
                
                                // the param name
                                msg.append('\t').append(str).append('[');
                
                                int sz = values.length;
                                if (sz > 0)
                                {
                                        StringBuffer bf = new StringBuffer();
                                        for (int j = 0; j < sz; j++)
                                        {
                                                if (j > 0)
                                                {
                                                        bf.append(';');
                                                }
                                                bf.append(values[j]);
                                        }
                                        msg.append(bf.toString());
                                }
                                msg.append(']').append('\n');
                        }
                        System.out.println(msg.toString());
                
                        enum = request.getHeaderNames();
                        String sName;
                        String sValue;
                        while (enum.hasMoreElements())
                        {
                                sName = (String) enum.nextElement();
                                sValue = request.getHeader(sName);
                                System.out.println(sName + "=" + sValue);
                        }
                
                        System.out.println("Request URL: " + request.getRequestURL());
                        System.out.println("Servlet Path: " + request.getServletPath());
            // end
            // HTML // begin [file="/test.jsp";from=(47,2);to=(61,39)]
                out.write("\r\n\r\n\r\n<head>\r\n<title>\r\ntest\r\n</title>\r\n</head>\r\n<body bgcolor=\"#ffffff\">\r\n<h1>\r\nTest JSP\r\n</h1>\r\n<form method=\"post\" enctype=\"multipart/form-data\">\r\n<br><br>\r\nId:<input type=\"text\" name=\"id\" value=\"");

            // end
            // begin [file="/test.jsp";from=(61,42);to=(61,71)]
                out.print(System.currentTimeMillis()/10);
            // end
            // HTML // begin [file="/test.jsp";from=(61,73);to=(65,52)]
                out.write("\"/><br />\r\ndbOp:<input type=\"text\" name=\"dbOp\" value=\"addPatient\"/><br />\r\nfirst name:<input type=\"text\" name=\"firstname\" value=\"John\"/><br>\r\nlast name:<input type=\"text\" name=\"lastname\" value=\"Dough\"/> <br />\r\nmiddle name:<input type=\"text\" name=\"middle\" value=\"");

            // end
            // begin [file="/test.jsp";from=(65,55);to=(65,100)]
                out.print((char)('A' + System.currentTimeMillis() % 26));
            // end
            // HTML // begin [file="/test.jsp";from=(65,102);to=(66,45)]
                out.write(".\"/><br>\r\nmonth:<input type=\"text\" name=\"month\" value=\"");

            // end
            // begin [file="/test.jsp";from=(66,48);to=(66,83)]
                out.print(new java.util.Date().getMonth() + 1);
            // end
            // HTML // begin [file="/test.jsp";from=(66,85);to=(67,41)]
                out.write("\"/><br>\r\nday:<input type=\"text\" name=\"day\" value=\"");

            // end
            // begin [file="/test.jsp";from=(67,44);to=(67,78)]
                out.print(new java.util.Date().getDate() + 1);
            // end
            // HTML // begin [file="/test.jsp";from=(67,80);to=(69,48)]
                out.write("\"/><br />\r\nyear: <input type=\"text\" name=\"year\" value=\"1961\" /><br />\r\nstreet: <input type=\"text\" name=\"street\" value=\"");

            // end
            // begin [file="/test.jsp";from=(69,51);to=(69,93)]
                out.print(System.currentTimeMillis() % 100 * 5 + 100);
            // end
            // HTML // begin [file="/test.jsp";from=(69,95);to=(78,0)]
                out.write(", Esteban Way\" /><br>\r\ncity: <input type=\"text\" name=\"city\" value=\"Concord\" /><br>\r\ndoctor: <input type=\"text\" name=\"doctor\" value=\"Welby\" /><br />\r\nproblems: <input type=\"text\" name=\"problems\" size=\"60\" value=\"Patient complains of feeling tired. Has back pain.\"/><br>\r\nprescription: <input type=\"text\" name=\"meds\" size=\"40\" value=\"One childs asprin daily\"/><br />\r\n  <input type=\"submit\" name=\"Submit\" value=\"Submit\">\r\n</form>\r\n</body>\r\n</html>\r\n");

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
