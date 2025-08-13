<%
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
        %>Error: The value of <%=key%> is "<%=actual%>", must be "<%=value%>".<%
        success = false;
      }
    }
    if (success) {%>Success<%}
  } else {%>
<html>
  <head>
    <title>
      test 1
    </title>
  </head>
  <body bgcolor="#ffffff">
    <h1>Test 1. Simple Get</h1>
    <form method="get">
<%  for (java.util.Iterator i = expected.entrySet().iterator();
         i.hasNext();) {
      java.util.Map.Entry entry = (java.util.Map.Entry)i.next();
      String key   = (String)entry.getKey();
      String value = (String)entry.getValue();
      %><%=key%>: <input type="text" name="<%=key%>" value="<%=value%>"/><br /><%
    }
%>
      <input type="submit">
    </form>
  </body>
</html>

<%}%>
