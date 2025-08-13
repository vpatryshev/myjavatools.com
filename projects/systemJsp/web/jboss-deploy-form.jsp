<html>
<head>
  <title>JBoss Deployment</title>
</head>
<body>
<h3>JBoss Application Deployment</h3>
<form action="jboss-deploy.jsp" enctype="multipart/form-data" method="POST">
  debug: <input name="debug"  type="checkbox" value="true"/>
  File size: <input type="text" name="size">
  EAR file: <input type="file" name="file" size="60"/>
  <input type="submit" title="deploy application"/>
</form>
</body>
</html>
