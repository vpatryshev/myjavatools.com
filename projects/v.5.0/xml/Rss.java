package com.myjavatools.xml;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Iterator;
import java.net.URL;
import java.util.Map;
import java.util.Collection;
import java.util.HashMap;

// http://web.resource.org/rss/1.0/spec
// http://www.webreference.com/authoring/languages/xml/rss/intro/
// http://www.xml.com/pub/a/2002/12/18/dive-into-xml.html?page=1
// http://www.xml.com/pub/a/2002/12/18/dive-into-xml.html?page=2
// http://blogs.law.harvard.edu/tech/rss

public class Rss extends BasicXmlData {
  public static final String LATEST_VERSION = "2.0";

  static final XmlData DEFAULT_RSS =
      new BasicXmlData("rss", null,
                       new String[]{"version", LATEST_VERSION},
                       new BasicXmlData[] {new BasicXmlData("channel")});
  private XmlData channel = null;
  private Map itemIndex = new HashMap();

  public class Image extends BasicXmlData {

    public Image(String title, String description, String url, String link, String height, String width) {
      super("image", null, new BasicXmlData[] {
            new BasicXmlData("title", title),
            new BasicXmlData("description", description),
            new BasicXmlData("url", url),
            new BasicXmlData("link", link),
            new BasicXmlData("height", height),
            new BasicXmlData("width", width)
          });
    }

    Image(XmlData imageData) {
      super(imageData);
      setValue(null);
      attributes = new HashMap();
    }

    public String getTitle() { return getKidValue("title"); }
    public String getDescription() { return getKidValue("description"); }
    public String getUrl() { return getKidValue("url"); }
    public String getLink() { return getKidValue("link"); }
    public String getHeight() { return getKidValue("height"); }
    public String getWidth() { return getKidValue("width"); }
  };

  public class TextInput extends BasicXmlData {

    public TextInput(String title, String description, String name, String link) {
      super("textInput", null, new BasicXmlData[] {
            new BasicXmlData("title", title),
            new BasicXmlData("description", description),
            new BasicXmlData("name", name),
            new BasicXmlData("link", link)});
    }

    TextInput(XmlData data) {
      super(data);
      setValue(null);
      attributes = new HashMap();
    }

    public String getTitle() { return getKidValue("title"); }
    public String getDescription() { return getKidValue("description"); }
    public String getName() { return getKidValue("name"); }
    public String getLink() { return getKidValue("link"); }
  }

  public Rss() throws InstantiationException {
    super(DEFAULT_RSS);
    setup();
  }

  public Rss(File file)
      throws FileNotFoundException, IOException, InstantiationException {
    this(new FileInputStream(file));
  }

  public Rss(InputStream is)
      throws IOException, InstantiationException {
    super(is);
    setup();
  }

  public Rss(XmlData source) throws InstantiationException {
    super(source);
    setup();
  }

  public Rss(URL url) throws InstantiationException, IOException {
    super(url);
    setup();
  }

  private void setup() throws InstantiationException {
    channel = getKid("channel");
    XmlData container = channel;
    if (channel == null) {
      throw new InstantiationException("Bad rss: channel missing");
    }

    if ("rdf:RDF".equals(getType())) { // 1.0
      setVersion("1.0");
      container = this;
      channel.addKids(removeKids("item"));
      channel.addKids(removeKids("image"));
      channel.addKids(removeKids("textinput"));
      Collection textInputCollection = channel.getKids("textinput");
      if (textInputCollection != null) {
        for(Iterator i = textInputCollection.iterator(); i.hasNext();) {
          ((BasicXmlData)i.next()).setType("textInput");
        }
      }
    } else if ("rss".equals(getType())) {
    } else {
      throw new InstantiationException("Unknown RSS format");
    }

    channel.castKids("image", Image.class);
    channel.castKids("item", RssItem.class);
    Collection items = channel.getKids("item");
    if (items != null) {
      for (Iterator i = items.iterator(); i.hasNext();) {
        RssItem item = new RssItem((XmlData)i.next());
        itemIndex.put(item.getTitle(), item);
      }
    }
  }

  public String getVersion() {
    return getAttribute("version");
  }
  public void setVersion(String version) {
    setAttribute("version", version);
  }
  public String getTitle() {
    return channel.getKidValue("title");
  }
  public void setTitle(String title) {
    channel.setKidValue("title", title);
  }
  public String getDescription() {
    return channel.getKidValue("description");
  }
  public void setDescription(String description) {
    channel.setKidValue("description", description);
  }
  public String getLink() {
    return channel.getKidValue("link");
  }
  public void setLink(String link) {
    channel.setKidValue("link", link);
  }
  public String getLanguage() {
    return channel.getKidValue("language");
  }
  public void setLanguage(String language) {
    channel.setKidValue("language", language);
  }
  public String getRating() {
    return channel.getKidValue("rating");
  }
  public void setRating(String rating) {
    channel.setKidValue("rating", rating);
  }
  public String getCopyright() {
    return channel.getKidValue("copyright");
  }
  public void setCopyright(String copyright) {
    channel.setKidValue("copyright", copyright);
  }
  public String getPubDate() {
    return channel.getKidValue("pubDate");
  }
  public void setPubDate(String pubDate) {
    channel.setKidValue("pubDate", pubDate);
  }
  public String getLastBuildDate() {
    return channel.getKidValue("lastBuildDate");
  }
  public void setLastBuildDate(String lastBuildDate) {
    channel.setKidValue("lastBuildDate", lastBuildDate);
  }
  public String getManagingEditor() {
    return channel.getKidValue("managingEditor");
  }
  public void setManagingEditor(String managingEditor) {
    channel.setKidValue("managingEditor", managingEditor);
  }
  public String getWebMaster() {
    return channel.getKidValue("webMaster");
  }
  public void setWebMaster(String webMaster) {
    channel.setKidValue("webMaster", webMaster);
  }
  public String getSkipHours() {
    return channel.getKidValue("skipHours");
  }
  public void setSkipHours(String skipHours) {
    channel.setKidValue("skipHours", skipHours);
  }
  public String getSkipDays() {
    return channel.getKidValue("skipDays");
  }
  public void setSkipDays(String skipDays) {
    channel.setKidValue("skipDays", skipDays);
  }
  public String getDocs() {
    return channel.getKidValue("docs");
  }
  public void setDocs(String docs) {
    channel.setKidValue("docs", docs);
  }

  public void setImage(Image image) {
    channel.removeKids("image");
    channel.addKid(image);
  }

  public void setImage(String title,
                       String description,
                       String url,
                       String link,
                       String width,
                       String height) {
    setImage(new Image(title, description, url, link, width, height));
  }

  private void setImage(XmlData imageData) {
    if (imageData == null) {
      channel.removeKids("image");
    } else {
      setImage(imageData);
    }
  }
  public Image getImage() {
    return (Image)channel.getKid("image");
  }

  public void setTextInput(TextInput textInput) {
    channel.removeKids("textInput");
    channel.addKid(textInput);
  }

  public void setTextInput(String title, String description, String name, String link) {
    setTextInput(new TextInput(title, description, name, link));
  }

  private void setTextInput(XmlData data) {
    if (data == null) {
      channel.removeKids("textInput");
    } else {
      setTextInput(data);
    }
  }
  public TextInput getTextInput() {
    return (TextInput)channel.getKid("textInput");
  }

  public void addItem(RssItem item) {
    channel.removeKid(getItem(item.getTitle()));
    channel.addKid(item);
    itemIndex.put(item.getTitle(), item);
  }

  public void addItem(String title, String link, String description) {
    addItem(new RssItem(title, link, description));
  }

  private void addItem(XmlData data) {
    addItem(new RssItem(data));
  }

  public Collection getItems() {
    return channel.getKids("item");
  }

  public RssItem getItem(String title) {
    return (RssItem)itemIndex.get(title);
  }

  public RssItem findItemByDescription(String description) {
    Collection itemCollection = channel.getKids("item");
    if (itemCollection == null) return null;
    for (Iterator i = itemCollection.iterator(); i.hasNext();) {
      RssItem item = (RssItem)i.next();
      if (description.equals(item.getDescription())) {
        return item;
      }
    }
    return null;
  }

  public RssItem findItemByUrl(String url) {
    Collection itemCollection = channel.getKids("item");
    if (itemCollection == null) return null;
    for (Iterator i = itemCollection.iterator(); i.hasNext();) {
      RssItem item = (RssItem)i.next();
      if (url.equals(item.getSourceUrl()) ||
          url.equals(item.getEnclosureUrl())) {
        return item;
      }
    }
    return null;
  }

  public void setGenerator(String generator) {
    channel.addKid(new BasicXmlData("generator", generator));
  }

  public String getGenerator() { return channel.getKidValue("generator"); }
  public String getCategory() { return channel.getKidValue("category"); }
  public String getTtl() { return channel.getKidValue("ttl"); }
  public XmlData getCloud() { return channel.getKid("cloud"); }

  public void setCloud(XmlData cloud) {
    channel.removeKids("cloud");
    channel.addKid(cloud);
  }
  public void setCategory(String category) {
    channel.setKidValue("category", category);
  }
  public void setTtl(String ttl) {
    channel.setKidValue("ttl", ttl);
  }
}
