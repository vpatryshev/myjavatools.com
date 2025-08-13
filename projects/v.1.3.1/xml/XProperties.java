// !!!!!!!!!! Under construction !!!!!!!!!!

package com.borland.xml;

import java.util.ArrayList;
import org.xml.sax.AttributeList;
import java.util.HashMap;
import java.io.InputStream;
import java.io.IOException;
import java.io.File;
import java.net.URL;
import java.util.Iterator;
import java.util.List;
import com.borland.util.*;

public class XProperties
    extends XmlData {

  public XProperties() {
    super("properties");
  }

  public XProperties(XmlData[] kids) {
    super ("properties", null, kids);
  }

  public XProperties(String[] attrs) {
    super ("properties", null, attrs);
  }

  public XProperties(String[] attrs, ArrayList kids) {
    super ("properties", null, attrs, kids);
  }

  public XProperties(String[] attrs, XmlData[] kids) {
    super ("properties", null, attrs, kids);
  }

  public XProperties(AttributeList attrs) {
    super ("properties", null, attrs);
  }

  public XProperties(AttributeList attrs, ArrayList kids) {
    super ("properties", null, attrs, kids);
  }

  public XProperties(AttributeList attrs, XmlData[] kids) {
    super ("properties", null, attrs, kids);
  }

  public XProperties(HashMap attrs, ArrayList kids) {
    super ("properties", null, attrs, kids);
  }

  public XProperties(HashMap attrs, HashMap byType) {
    super ("properties", null, attrs, byType);
  }

  public XProperties(XmlData org) {
    super (org);
  }

  public XProperties(InputStream in) throws IOException, InstantiationException {
    super (in);
  }

  public XProperties(File in) throws IOException, InstantiationException {
    super (in);
  }

  public XProperties(URL url) throws IOException, InstantiationException {
    super (url);
  }

  public void load(InputStream in) throws IOException, InstantiationException {
    setXmlContent(new XmlData(in));
  }

  public String getProperty(String key) {
    List path = Strings.split(key, ".");
    XmlData point = this;
    for(Iterator i = path.iterator(); i.hasNext();) {
      String id = (String)i.next();
    }
    return null;
  }
}
