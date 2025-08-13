/**
 *
 * <p>Title: MyJavaTools: XML Data</p>
 * <p>Description: Decorated hierarchical Map that stores Xml-like data.</p>
 * <p>Copyright: This is public domain;
 * The right of people to use, distribute, copy or improve the contents of the
 * following may not be restricted.</p>
 *
 * @author Vlad Patryshev
 * @see http://www.myjavatools.com/projects/PracticalXML/
 *
 * <p>BasicXmlData is a simple container of data usually retrieved from an XML file.
 * It implements XmlData interface (@see com.myjavatools.XmlData).
 * It has a type, a value, a map of attributes and a set of kids (nodes) grouped by their types.
 * Inside a type, kids are arranged as a collection, so that they do have some order.
 * Kids also implement XmlData.
 *
 * <p>Note that the hierarchy is unidirectional: kids have no knowledge of contaners they are members of.
 * This sounds natural when we talk about containers; files do not know about their current location,
 * web pages do not generally know their full url - but somehow in DOM it is all different (and this is what makes it hard to handle: parent references).
 */

package com.myjavatools.xml;

import java.io.*;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Collection;

import org.xml.sax.AttributeList;

public class BasicXmlData implements XmlData
{
  public final static Class XmlDataClass = (new BasicXmlData()).getClass();
  String type = null;
  String value = null;
  Map attributes = new HashMap();
  Map byType = new HashMap();

  /**
   * Default constructor.
   *
   * <p>Creates an empty instance.
   */
  public BasicXmlData() {}

  /**
   * Creates an instance of BasicXmlData of specified type.
   *
   * @param type the type of data, an arbitrary identifier string.
   */
  public BasicXmlData(String type) {
    this();
    this.type = type;
  }

  /**
   * Creates an instance of specified type and with the specified value.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   *
   * <p><b>Example</b>:
   * <li><code>new BasicXmlData("example", "This is an example").save(<i>filename</i>)</code>
   * <br>will result in the following output:
   * <p><pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   *&lt;example&gt;This is an example&lt;/example&gt;
   * </pre></li>
   */
  public BasicXmlData(String type, String value) {
    this(type);
    this.value = value;
  }

  /**
   * Creates an instance of specified type, with the specified value and
   * the kids that are listed in the provided collection.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param kids a Collection of XmlData that attach themselves as kids to the instance being created
   *
   * <p><b>Example</b>:
   * <li><code>new BasicXmlData("example", "This is an example",
   *                       Arrays.asList(new BasicXmlData[] {new BasicXmlData("subexample", "This is a kid of example")}).save(<i>filename</i>)</code>
   * <br>will result in the following output:
   * <p><pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   *&lt;example&gt;
   *  &lt;subexample&gt;This is a kid of example&lt;/subexample&gt;This is an example&lt;/example&gt;
   * </pre></li>
   */
  public BasicXmlData(String type, String value, Collection kids) {
    this(type, value);
    addKids(kids);
  }

  /**
   * Creates an instance of specified type, with the specified value and
   * the kids that are listed in the provided array.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param kids an array of XmlData that attach themselves as kids to the instance being created
   *
   * <p><b>Example</b>:
   * <li><code>new BasicXmlData("example", "This is an example",
   *                       new BasicXmlData[] {new BasicXmlData("subexample", "This is a kid of example")}).save(<i>filename</i>)</code>
   * <br>will result in the following output:
   * <p><pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   *&lt;example&gt;
   *  &lt;subexample&gt;This is a kid of example&lt;/subexample&gt;This is an example&lt;/example&gt;
   * </pre></li>
   */
  public BasicXmlData(String type, String value, BasicXmlData[] kids) {
    this(type, value);
    for (int i = 0; i < kids.length; i++) {
      addKid(kids[i]);
    }
  }

  /**
   * Creates an instance of specified type, with the specified value and
   * the attributes that are listed in the provided array as name-value pairs.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param attributes an String array of name-value pairs
   *
   * <p><b>Example</b>:
   * <li><code>new BasicXmlData("example", "This is an example", new String[] {"id", "0123dx", "name", "Whittman"}).save(<i>filename</i>)</code>
   * <br>will result in the following output:
   * <p><pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   *&lt;example id="0123dx" name="Whittman"&gt;This is an example&lt;/example&gt;
   * </pre></li>
   */
  public BasicXmlData(String type, String value, String[] attributes) {
    this(type, value);
    setAttributes(attributes);
  }

  /**
   * Creates an instance of specified type, with the specified value,
   * attributes that are listed in the provided array as name-value pairs, and
   * the kids that are listed in the provided collection.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param attributes an String array of name-value pairs
   * @param kids a Collection of XmlData that attach themselves as kids to the instance being created
   *
   * <p><b>Example</b>:
   * <li><code>new BasicXmlData("example", "This is an example",
   *                       new String[] {"id", "007", "name", "Bond"},
   *                       Arrays.asList(new BasicXmlData[] {new BasicXmlData("subexample", "This is a kid of example")}).save(<i>filename</i>)</code>
   * <br>will result in the following output:
   * <p><pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   *&lt;example id="007" name="Bond"&gt;
   *  &lt;subexample&gt;This is a kid of example&lt;/subexample&gt;This is an example&lt;/example&gt;
   * </pre></li>
   */
  public BasicXmlData(String type, String value, String[] attributes, Collection kids) {
    this(type, value, kids);
    setAttributes(attributes);
  }

  /**
   * Creates an instance of BasicXmlData of specified type, with the specified value,
   * attributes that are listed in the provided array as name-value pairs, and
   * the kids that are listed in the provided array of XmlData.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param attributes an String array of name-value pairs
   * @param kids an array of XmlData that attach themselves as kids to the instance being created
   *
   * <p><b>Example</b>:
   * <li><code>new BasicXmlData("example", "This is an example",
   *                       new String[] {"id", "007", "name", "Bond"},
   *                       new BasicXmlData[] {new BasicXmlData("subexample", "This is a kid of example")}).save(<i>filename</i>)</code>
   * <br>will result in the following output:
   * <p><pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   *&lt;example id="007" name="Bond"&gt;
   *  &lt;subexample&gt;This is a kid of example&lt;/subexample&gt;This is an example&lt;/example&gt;
   * </pre></li>
   */
  public BasicXmlData(String type, String value, String[] attributes, BasicXmlData []kids) {
    this(type, value, kids);
    setAttributes(attributes);
  }

  /**
   * Creates an instance of specified type, with the specified value,
   * attributes that are listed in the provided AttributeList.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param attributes an AttributeList (@see org.xml.sax.AttributeList)
   */
  public BasicXmlData(String type, String value, AttributeList attributes) {
    this(type, value);
    setAttributes(attributes);
  }

  /**
   * Creates an instance of specified type, with the specified value,
   * attributes that are listed in the provided AttributeList, and
   * the kids that are listed in the provided collection.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param attributes an AttributeList (@see org.xml.sax.AttributeList)
   * @param kids a Collection of XmlData that attach themselves as kids to the instance being created
   */
  public BasicXmlData(String type, String value, AttributeList attributes, Collection kids) {
    this(type, value, kids);
    setAttributes(attributes);
  }

  /**
   * Creates an instance of specified type, with the specified value,
   * attributes that are listed in the provided AttributeList, and
   * the kids that are listed in the provided array of XmlData.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param attributes an AttributeList (@see org.xml.sax.AttributeList)
   * @param kids an array of XmlData that attach themselves as kids to the instance being created
   */
  public BasicXmlData(String type, String value, AttributeList attributes, BasicXmlData []kids) {
    this(type, value, kids);
    setAttributes(attributes);
  }

  /**
   * Creates an instance of specified type, with the specified value,
   * attributes that are listed in the provided map (name -> value), and
   * the kids that are listed in the provided collection.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param attributes a Map that maps attributes names to values
   * @param kids a Collection of XmlData that attach themselves as kids to the instance being created
   */
  public BasicXmlData(String type, String value, Map attributes, Collection kids) {
    this(type, value, kids);
    this.attributes = attributes;
  }

  /**
   * Creates an instance of specified type, with the specified value,
   * attributes that are listed in the provided Map (name -> value), and
   * the kids that are listed in the provided Map, type->Collection.
   *
   * @param type the type of data, an arbitrary identifier string.
   * @param value the value of data, any string.
   * @param attributes a Map that maps attributes names to values.
   * @param byType a Map that maps types to collections of XmlData kids.
   *
   * <p><b>Example</b>:
   * <li><pre><code>Map attr = new HashMap();
   * Map byType = new HashMap();
   * byType.put("subexample", Arrays.asList(new Object[] {new BasicXmlData("subexample", "This is a kid of example")}));
   * byType.put("feature", Arrays.asList(new Object[] {new BasicXmlData("feature", null, new String[] {"name", "arity", "value", "3"})}));
   * attr.put("id", "008");
   * attr.put("name", "Dumb");
   * new BasicXmlData("example", "This is an example", attr, byType).save(<i>filename</i>)
   * </pre></code>
   * will result in the following output:
   * <p><pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   *&lt;example id="008" name="Dumb"&gt;
   *  &lt;subexample&gt;This is a kid of example&lt;/subexample&gt;
   *  &lt;feature name="arity" value="3"&gt;This is an example&lt;/example&gt;
   * </pre>
   * </li>
   */
  public BasicXmlData(String type, String value, Map attributes, Map byType) {
    this(type, value);
    this.attributes = attributes;
    this.byType = byType;
  }

  /**
   * Creates an instance from another XmlData object (use clone() to get a real deep copy).
   *
   * @param org original XmlData
   */
  public BasicXmlData(XmlData org) {
    this(org.getType(),
         org.getValue(),
         org.getAttributes(),
         org.getAllKids());
  }

  /**
   * Creates an instance from the data read from input stream.
   *
   * @param in input stream
   *
   * @throws java.io.IOException
   * @throws java.lang.InstantiationiException
   */
  public BasicXmlData(InputStream in)
    throws java.io.IOException,
           java.lang.InstantiationException {
    this((new XmlReader(in)).read());
  }

  /**
   * Creates an instance from the data read from a file.
   *
   * @param in file containing XML data
   *
   * @throws java.io.IOException
   * @throws java.lang.InstantiationiException
   */
  public BasicXmlData(File in)
    throws java.io.IOException,
           java.lang.InstantiationException {
    this((new XmlReader(in)).read());
  }

  private static InputStream getInputStream(java.net.URL url)
    throws java.io.IOException,
           java.lang.InstantiationException {
    InputStream input = null;
    java.net.URLConnection conn = url.openConnection();
    conn.connect();
    Object content = conn.getContent();

/*
    if (!conn.getContentType().endsWith("xml")) {
      throw new java.lang.InstantiationException("Url " + url +
                                          " does not provide xml data; it is " +
                                          conn.getContentType());
    }
 */

//    if (content != null &&
//        content instanceof sun.net.www.MeteredStream) {
//      input = (sun.net.www.MeteredStream)content;
//    }
    input = url.openStream();

    if (input == null) {
      throw new java.lang.InstantiationException("Url " + url +
                                                 " does not provide data.");
    }

    return input;
  }

  /**
   * Creates an instance from the data read from URL.
   *
   * @param url url pointing to XML data
   *
   * @throws java.io.IOException
   * @throws java.lang.InstantiationiException
   */
  public BasicXmlData(java.net.URL url)
    throws java.io.IOException,
           java.lang.InstantiationException {
    this(getInputStream(url));
  }

  /**
   * Sets the contents from another XmlData.
   *
   * @param org original XmlData
   */
  public void setXmlContent(XmlData org) {
    type = org.getType();
    value = org.getValue();
    attributes = org.getAttributes();
    byType = new HashMap();
    this.addKids(org.getAllKids());
  }

  /**
   * Gets the contents of this XmlData (that is, itself).
   *
   * @return itself
   */
  public XmlData getXmlContent() {
    return this;
  }

  /**
   * Deep copy of XmlData.
   *
   * @return deep copy of itself
   */
  public XmlData deepCopy() {
    BasicXmlData result = new BasicXmlData(type,
                                 value,
                                 new HashMap(attributes),
                                 new HashMap());
    for (Iterator i = getAllKids().iterator(); i.hasNext();) {
      result.addKid(new BasicXmlData((XmlData)i.next()));
    }
    return result;
  }

  /**
   * Clones of XmlData, same thing as deepCopy.
   *
   * @return deep copy of itself
   */
  public Object clone() {
    return deepCopy();
  }

  /**
   * Compares the specified object with this XmlData for equality.
   * Returns true if the given object is also a XmlData, and the two XmlData
   * represent the same data. More formally, two XmlDatas t1 and t2 represent
   * the same data if t1.type.equals(t2.type) and t1.value.equals(t2.value)
   * and t1.getAttributes.equals(t2.attributes()) and t1.getAllKids().equals(t2.getAllKids()).
   *
   * @param o object to be compared for equality with this XmlData.
   * @return true if the specified object is equal to this XmlData.
   *
   * <p><b>Example</b>:
   * <li>
   * <pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   * &lt;example a1="v1" a2="v2"&gt;
   *   &lt;sub1 ax="vx" ay="vy"/&gt;
   *   &lt;sub2 aa="va" ab="vb"/&gt;
   * &lt;/example&gt;
   * </pre>
   * and
   * <pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   * &lt;example a2="v2" a1="v1"&gt;
   *   &lt;sub2 ab="vb" aa="va"/&gt;
   *   &lt;sub1 ay="vy" ax="vx"/&gt;
   * &lt;/example&gt;
   * </pre>
   * are equal.
   * </li>
   */
  public boolean equals(Object o) {
    if (o == null) return false;
    if (!(o instanceof BasicXmlData)) return false;

    BasicXmlData other = (BasicXmlData)o;

    if (!other.type.equals(type))  return false;
    if (!other.value.equals(value)) return false;

    if (!other.attributes.equals(attributes)) return false;
    if (!other.byType.equals(byType)) return false;

    return true;
  }

  /**
   * Saves XmlData to a file.
   *
   * @param filename name of the file to write to
   * @throws java.io.IOException
   */
  public void save(String filename)
    throws java.io.IOException {
    XmlWriter.write(filename, this);
  }

  /**
   * Saves XmlData to a file.
   *
   * @param file file to write to
   * @throws java.io.IOException
   */
  public void save(File file)
    throws java.io.IOException {
    XmlWriter.write(file, this);
  }

  /**
   * Saves XmlData to an output stream.
   *
   * @param os output stream to write to
   * @throws java.io.IOException
   */
  public void save(OutputStream os)
    throws java.io.IOException {
    XmlWriter.write(os, this);
  }

  /**
   * Sets an attribute value.
   *
   * @param name attribute name
   * @param value attribute value
   */
  public void setAttribute(String name, String value) {
    attributes.put(name, value);
  }

  /**
   * Sets attributes from an array of name-value pairs.
   *
   * @param attributes a String array consisting of name-value pairs.
   */
  public void setAttributes(String[] attributes) {
    for (int i = 0; i < attributes.length; i+=2) {
      setAttribute(attributes[i], attributes[i+1]);
    }
  }

  /**
   * Sets attributes from a Map.
   *
   * @param attributes a Map, name -> value.
   */
  public void setAttributes(Map attributes) {
    for (Iterator i = attributes.entrySet().iterator(); i.hasNext();) {
      Map.Entry entry = (Map.Entry)i.next();
      this.attributes.put(entry.getKey(), entry.getValue());
    }
  }

  /**
   * Sets attributes from an AttributeList.
   *
   * @param attributes AttributeList
   */
  public void setAttributes(AttributeList attributes) {
    for (int i = 0; i < attributes.getLength(); i++) {
      setAttribute(attributes.getName(i), attributes.getValue(i));
    }
  }

  /**
   * Gets a Map of attributes.
   *
   * @return a Map that maps attribute names to attribute values, all Strings
   */
  public Map getAttributes() {
    return attributes;
  }

  /**
   * Gets XmlData type, which is just a String.
   *
   * @return the type string
   */
  public String getType() {
    return type;
  }

  /**
   * Gets a value of XmlData, which is just a String.
   *
   * @return the value
   */
  public String getValue() {
    return value;
  }

  /**
   * Sets the value of XmlData.
   *
   * @param v new value for XmlData
   *
   * @return itself
   */
  public XmlData setValue(String v) {
    value = v == null ? v : new String(v);
    return this;
  }

  /**
   * Gets the value of a specified attribute.
   *
   * @param name attribute name
   * @return attribute value
   */
  public String getAttribute(String name) {
    return (String)attributes.get(name);
  }

  /**
   * Gets the value of a specified attribute; if there is none, returns default value.
   *
   * @param name attribute name
   * @param defaultValue
   * @return attribute value or defaultValue
   */
  public String getAttribute(String name, String defaultValue) {
    String result = (String)attributes.get(name);
    return (result == null) ? defaultValue : result;
  }

  /**
   * Gets the name of XmlData, which is the value of attribute "name".
   *
   * <p> Same thing as <code>getAttribute("name")</code>.
   *
   * @return the name string
   */
  public String getName() {
    return getAttribute("name");
  }

  /**
   * Gets the id of XmlData, which is the value of attribute "id".
   *
   * <p> Same thing as <code>getAttribute("id")</code>.
   *
   * @return the id string
   */
  public String getId() {
    return getAttribute("id");
  }

  /**
   * Gets a collection of all kids of XmlData. Normally you would not need it;
   * retrieving kids by type is what one normally does, but you never know...
   *
   * @return a Collection of XmlData that contains all kids
   */
  public Collection getAllKids() {
    ArrayList kids = new ArrayList();

    for (Iterator list = byType.entrySet().iterator();
                  list.hasNext();) {
      kids.addAll((Collection)((Map.Entry)list.next()).getValue());
    }

    return kids;
  }

  /**
   * Gets a Collection of kids of specified type.
   *
   * @param type type of the kids to choose
   * @return all kids that have specified type
   */
  public Collection getKids(String type) {
    return (Collection)byType.get(type);
  }

  private void setKids(String type, Collection kids) {
    byType.put(type, kids);
  }

  /**
   * Gets the number of kids of specified type.
   *
   * @param type
   * @return the number of such kids
   */
  public int getKidCount(String type) {
    Collection kids = getKids(type);
    return (kids == null) ? 0 : kids.size();
  }

  /**
   * Gets a kid of specified type, if any.
   *
   * @param type type of the kid to chose
   * @return any kid that has this type or null if there is no such kid
   */
  public XmlData getKid(String type) {
    Collection kids = getKids(type);

    if (kids == null) return null;

    return (kids.size() > 0) ? ((BasicXmlData)kids.iterator().next()) : null;
  }

  /**
   * Gets the value of a kid of specified type, if any.
   *
   * @param type
   * @return the value of a kid of specified type or null if there's none
   */
  public String getKidValue(String type) {
    XmlData kid = getKid(type);
    return (kid == null) ? null : kid.getValue();
  }

  /**
   * Gets a kid of specified type that has an attribute with a specified value.
   *
   * @param type type of the kid to choose
   * @param attribute attribute name
   * @param value attribute value
   * @return such a kid, if found, or null otherwise
   */
  public XmlData getKid(String type, String attribute, String value) {
    Collection kids = getKids(type);

    if (kids == null) return null;

    for (Iterator i = kids.iterator(); i.hasNext();) {
      BasicXmlData kid = (BasicXmlData)i.next();
      String attr = kid.getAttribute(attribute);
      if (attr != null && attr.equals(value)) return kid;
    }
    return null;
  }

  /**
   * Gets a kid having specified type and specified id.
   *
   * @param type kid type
   * @param id kid id
   * @return a kid of specified type that has the value named "id" equal to id
   */
  public XmlData getKid(String type, String id) {
    return getKid(type, "id", id);
  }

  /**
   * Adds a kid to the set of kids.
   *
   * @param kid kid to add
   * @return the kid
   */
  public XmlData addKid(XmlData kid) {
    if (kid == null) return kid;

    String type = kid.getType();
    Collection slot = getKids(type);

    if (slot == null)
      byType.put(type, (slot = new ArrayList()));

    slot.add(kid);
    return kid;
  }

  /**
   * Removes a kid from the set of kids.
   *
   * @param kid kid to remove
   */
  public void removeKid(XmlData kid) {
    String type = kid.getType();
    Collection slot = getKids(type);
    if (slot != null) {
      slot.remove(kid);
    }
  }

  /**
   * Adds all XmlData elements from given Collection to the set of kids,
   * skipping elements that are not XmlData.
   *
   * @param kids
   */
  public void addKids(Collection kids) {
    for (Iterator i = kids.iterator(); i.hasNext();) {
      Object next = i.next();
      if (next instanceof BasicXmlData) {
        addKid( (BasicXmlData) next);
      }
    }
    trim();
  }

  /**
   * Removes all kids of given type.
   *
   * @param type type of kids to remove
   * @return Collection of removed kids
   */
  public Collection removeKids(String type) {
    return (Collection)byType.remove(type);
  }

  /**
   *
   * <p>Class Policy defines three different casting policies.
   */

  public static class Policy {
    private Policy() {};

    /**
     * Policy SKIP_ON_ERROR causes casting to ignore nodes that failed to cast.
     */
    public final static Policy SKIP_ON_ERROR = new Policy();

    /**
     * Policy KEEP_ON_ERROR causes casting to keep intact nodes that failed to cast.
     */
    public final static Policy KEEP_ON_ERROR = new Policy();

    /**
     * Policy THROW_ON_ERROR causes casting to throw any exception that happens while casting a node.
     */
    public final static Policy THROW_ON_ERROR = new Policy();
  }

  /**
   * Casts kids of specified type to a specified class (actually replacing them with the new instances).
   *
   * @param type type of the kids to cast
   * @param clazz class to cast to
   * @return true in case of success, false if casting failed somehow
   *
   * To cast, the class has to have a constructor that takes XmlData as the only argument
   */
  public boolean castKids(String type, Class clazz) {
    try {
      Constructor constructor = clazz.getConstructor(new Class[] {XmlDataClass});

      Collection oldKids = getKids(type);
      Collection newKids = new ArrayList();

      for (Iterator i = oldKids.iterator(); i.hasNext();) {
        BasicXmlData oldKid = (BasicXmlData)i.next();
        BasicXmlData newKid = (BasicXmlData)constructor.newInstance(new Object[] {oldKid} );
        newKids.add(newKid);
      }
      setKids(type, newKids);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  private XmlData cast(Class clazz) throws
      SecurityException, NoSuchMethodException, InvocationTargetException,
      IllegalArgumentException, IllegalAccessException, InstantiationException {
    Constructor constructor = clazz.getConstructor(new Class[] {
        XmlDataClass});
    return (XmlData) constructor.newInstance(new Object[] {this});
  }

  private static XmlData cast(XmlData object, Map typemap, Policy policy)
      throws InstantiationException, NoSuchMethodException, InvocationTargetException,
      IllegalArgumentException, IllegalAccessException {
    if (object instanceof BasicXmlData) {
      return ((BasicXmlData)object).cast(typemap, policy);
    } else if (policy == Policy.THROW_ON_ERROR) {
      throw new InstantiationException("class " + object.getClass() + " does not support casting");
    } else {
      return policy == Policy.KEEP_ON_ERROR ? object : null;
    }
  }

  private static XmlData cast(XmlData object, String packageName, Policy policy)
      throws InstantiationException, NoSuchMethodException, InvocationTargetException,
      IllegalArgumentException, IllegalAccessException, ClassNotFoundException {
    if (object instanceof BasicXmlData) {
      return ((BasicXmlData)object).cast(packageName, policy);
    } else if (policy == Policy.THROW_ON_ERROR) {
      throw new InstantiationException("class " + object.getClass() + " does not support casting");
    } else {
      return policy == Policy.KEEP_ON_ERROR ? object : null;
    }
  }

  /**
   * Casts XmlData and its kids, recursively, to specified classes, according to the typemap.
   *
   * @param typemap maps types to classes. Type is what XmlData considers a type:
   * a string value of type property.
   * @param policy one of the following: Policy.THROW_ON_ERROR (causes an exception
   * in case of any error), Policy.KEEP_ON_ERROR (keeps nodes that cannot be cast),
   * Policy.SKIP_ON_ERROR (ignores nodes that cannot be cast).
   *
   * @return a new instance of the class corresponding, via typemap, to the type of data.

   * @throws InstantiationException
   * @throws NoSuchMethodException
   * @throws InvocationTargetException
   * @throws IllegalArgumentException
   * @throws IllegalAccessException
   * Exception are thrown only if policy is Policy.THROW_ON_ERROR
   */

  public XmlData cast(Map typemap, Policy policy)
      throws InstantiationException, NoSuchMethodException, InvocationTargetException,
      IllegalArgumentException, IllegalAccessException {
    for (Iterator i = getAllKids().iterator(); i.hasNext(); ) {
      XmlData oldKid = (XmlData) i.next();
      XmlData newKid = oldKid instanceof BasicXmlData ? ((BasicXmlData)oldKid).cast(typemap, policy) : oldKid;
      if (newKid != null) {
        removeKid(oldKid);
        addKid(newKid);
      }
    }

    if (policy == Policy.THROW_ON_ERROR) {
      return cast((Class)typemap.get(getType()));
    } else {
      try {
        return cast((Class)typemap.get(getType()));
      } catch (Exception e) {
        return policy == Policy.KEEP_ON_ERROR ? this : null;
      }
    }
  }

  /**
   * Casts XmlData and its kids, recursively, to classes in specified package.
   *
   * @param packageName the name of the package for casting. XmlData types
   * are mapped to classes with the same name inside specified package.
   * packageName can be null: then it is ignored.
   * @param policy one of the following: Policy.THROW_ON_ERROR (causes an exception
   * in case of any error), Policy.KEEP_ON_ERROR (keeps nodes that cannot be cast),
   * Policy.SKIP_ON_ERROR (ignores nodes that cannot be cast).
   *
   * @return a new instance of the class which name is the type of the data
   * @throws InstantiationException
   * @throws NoSuchMethodException
   * @throws InvocationTargetException
   * @throws IllegalArgumentException
   * @throws IllegalAccessException
   * @throws ClassNotFoundException
   * Exception are thrown only if policy is Policy.THROW_ON_ERROR
   */
  public XmlData cast(String packageName, Policy policy)
      throws InstantiationException, NoSuchMethodException, InvocationTargetException,
      IllegalArgumentException, IllegalAccessException, ClassNotFoundException {
    for (Iterator i = getAllKids().iterator(); i.hasNext();) {
      XmlData oldKid = (XmlData)i.next();
      XmlData newKid = cast(oldKid, packageName, policy);
      if (newKid != null) {
        removeKid(oldKid);
        addKid(newKid);
      }
    }
    String className = packageName == null ? "" : (packageName + ".") +
                                  getType();

    if (policy == Policy.THROW_ON_ERROR) {
      return cast(Class.forName(className));
    } else {
      try {
        return cast(Class.forName(className));
      } catch (Exception e) {
        return policy == Policy.KEEP_ON_ERROR ? this : null;
      }
    }
  }

  /**
   * Tries to trim the set of kids, so that there are no spare slots left.
   * <p>This operation does not go deep, since it is assumed that you apply it in the process
   * of building XmlData, and the kids are already trimmed.
   */
  public void trim() {
    for (Iterator list = byType.entrySet().iterator();
                  list.hasNext();) {
      Object candidate = ((Map.Entry)list.next()).getValue();
      if (candidate instanceof ArrayList) {
        ((ArrayList)candidate).trimToSize();
      }
    }
  }

  /**
   *
   * <p>An abstract class that stores an expression used in XmlData search/filtering.</p>
   */

    public static abstract class Expression implements Condition {

      /**
       * Parses a string containing search/selection condition.
       * <p>A condition consist of disjunctions of conjunctions of comparisons.
       * Comparisons compare a node's type, value or attribute value to a string constant.
       *
       * @param source the expression to be parsed
       * @return the internal (tree) representation of expression
       */
    public static Expression parse(String source) {
      return source == null ? null :
             Disjunction.parseDisjunction(source);
    };

    private static class Comparison extends Expression {
      static final int OP_NOP = 0;
      static final int OP_EQ  = 1;
      static final int OP_NE  = 2;
      String name;
      String value;
      int op;

      Comparison(String name, String op, String value) {
        this.name  = name;
        this.op    = op.equals("==") ? OP_EQ :
                     op.equals("=")  ? OP_EQ :
                     op.equals("!=") ? OP_NE :
                                       OP_NOP;
        this.value = value;
      }

      static Comparison parseComparison(String expression) {
        int n0 = 0;
        while (n0 < expression.length() && expression.charAt(n0) == ' ') n0++;
        if (n0 >= expression.length()) return null;
        int n1 = n0+1;
        while (n1 < expression.length() && expression.charAt(n1) != ' ') n1++;
        if (n1 >= expression.length()) return null;

        String name = (expression.charAt(n0) == '"')     ?
                        expression.substring(n0+1, n1-1) :
                        expression.substring(n0,   n1);
        int o0 = n1+1;
        while (o0 < expression.length() && expression.charAt(o0) == ' ') o0++;
        if (o0 >= expression.length()) return null;
        int o1 = o0+1;
        while (o1 < expression.length() && expression.charAt(o1) != ' ') o1++;
        if (o1 >= expression.length()) return null;
        String op = expression.substring(o0, o1);
        int v0 = o1+1;
        while (v0 < expression.length() && expression.charAt(v0) != '"') v0++;
        if (v0 >= expression.length()) return null;
        int v1 = v0+1;
        while (v1 < expression.length() && expression.charAt(v1) != '"') v1++;
        if (v1 >= expression.length()) return null;
        String value = expression.substring(v0+1, v1);
        return new Comparison(name, op, value);
      }

      public boolean satisfies(XmlData entity) {
        String toCompare = name.equals(".") ? entity.getValue() :
                           name.equals(":") ? entity.getType()  :
                           entity.getAttribute(name);
        return (op == OP_EQ) ?  value.equals(toCompare) :
               (op == OP_NE) ? !value.equals(toCompare) : false;
      }
    }

    private static class Conjunction extends Expression {
      Comparison[] comparisons;

      Conjunction(ArrayList comparisonList) {

        comparisons = (Comparison[])comparisonList.toArray(
                        new Comparison[comparisonList.size()]);
      }

      static Conjunction parseConjunction(String expression) {
        ArrayList comparisonList = new ArrayList();
        boolean inQuote = false;
        int last = expression.length();
        for (int i = 0; i < expression.length(); i = last+1) {
          for (last = i; last < expression.length(); last++) {
            char c = expression.charAt(last);
            if (c == '"') {
              inQuote = !inQuote;
            } else if (!inQuote && c == '&') {
              break;
            }
          }
          Comparison comparison = Comparison.parseComparison(expression.substring(i, last));
          if (comparison != null)
            comparisonList.add(comparison);
        }
        return new Conjunction(comparisonList);
      }

      public boolean satisfies(XmlData entity) {
        for (int i = 0; i < comparisons.length; i++) {
          if (!comparisons[i].satisfies(entity)) {
            return false;
          }
        }
        return true;
      }
    }

    private static class Disjunction extends Expression {
      Conjunction[] conjunctions;

      Disjunction(java.util.ArrayList conjunctionList) {
        conjunctions = (Conjunction[])conjunctionList.toArray(
                        new Conjunction[conjunctionList.size()]);
      }

      static Disjunction parseDisjunction(String expression) {
        ArrayList conjunctionList = new ArrayList();
        boolean inQuote = false;
        int last = expression.length();
        for (int i = 0; i < expression.length(); i = last+1) {
          for (last = i; last < expression.length(); last++) {
            char c = expression.charAt(last);
            if (c == '"') {
              inQuote = !inQuote;
            } else if (!inQuote && c == '|') {
              break;
            }
          }
          Conjunction conjunction = Conjunction.parseConjunction(expression.substring(i, last));
          if (conjunction != null)
            conjunctionList.add(conjunction);
        }
        return new Disjunction(conjunctionList);
      }

      public boolean satisfies(XmlData entity) {
        for (int i = 0; i < conjunctions.length; i++) {
          if (conjunctions[i].satisfies(entity)) {
            return true;
          }
        }
        return false;
      }
    }

    public abstract boolean satisfies(XmlData entity);
  }

  /**
   * Checks whether this XmlData node satisfies given condition.
   *
   * @param condition
   * @return true if it does satisfy the condition, false otherwise. Any node satisfies an empty condition.
   * This can look arguable, but you have to believe it, it comes from logic.
   */
  public boolean satisfies(Condition condition) {
    return condition == null ? true : condition.satisfies(this);
  }

  /**
   * Checks whether this XmlData node satisfies given expression (presented as string).
   * <p> the string is parsed first, and then the node is checked against the parsed expression.
   *
   * @param expression
   * @return true if it does satisfy the expression, false otherwise. Note that if
   * the expression is void or invalid, any node satisfies this expression.
   */
  public boolean satisfies(String expression) {
    return satisfies(Expression.parse(expression));
  }

  /**
   * Selects a subtree from XmlData, that is, the tree of those nodes that satisfy a condition.
   *
   * <p> The node is included into the resulting tree iff it satisfies the condition;
   * this filtering operation is applied recursively to its kids.
   *
   * @param condition
   * @return XmlData containing only nodes that satisfy the filter
   */
  public XmlData selectTree(Condition condition) {
    if (condition == null) return this;
    if (!condition.satisfies(this)) return null;

    ArrayList goodKids = new ArrayList();
    for (Iterator i = getAllKids().iterator(); i.hasNext();) {
      XmlData candidate = ((XmlData)i.next()).selectTree(condition);
      if (candidate != null) goodKids.add(candidate);
    }

    return new BasicXmlData(type, value, attributes, goodKids);
  }

  /**
   * Selects a subtree from XmlData, that is, the tree of those nodes that satisfy a condition.
   *
   * <p> The node is included into the resulting tree iff it satisfies the condition;
   * this filtering operation is applied recursively to its kids.
   *
   * @param expression the string that contains a filtering expression
   * @return XmlData containing only nodes that satisfy the expression
   *
   * <p><b>Example</b>:
   * <li>for the following data:
   * <br><pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   * &lt;example a1="v1" a2="v2"&gt;
   *   &lt;sub1 ax="vx" ay="vy"/&gt;
   *   &lt;sub2 aa="va" ab="vb"/&gt;
   * &lt;/example&gt;
   * </pre>
   * <code>selectTree("ax != \"vx\"")</code> and
   * <br><code>selectTree("a1 == \"v1\" || ab == \"vb\"")</code>
   * <br> will select the same subtree,
   * <br><pre>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
   * &lt;example a1="v1" a2="v2"&gt;
   *   &lt;sub2 aa="va" ab="vb"/&gt;
   * &lt;/example&gt;
   * </pre>
   *
   * </li>
   */

  public XmlData selectTree(String expression) {
    return selectTree(Expression.parse(expression));
  }
}