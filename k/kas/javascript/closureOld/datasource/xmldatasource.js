// Copyright 2006 Google Inc.
// All Rights Reserved

/**
 * @fileoverview
 * Implementations of DataNode for wrapping XML data
 *
 * @author uidude@google.com (Evan Gilbert)
 */

goog.provide('goog.ds.XmlDataSource');
goog.provide('goog.ds.XmlHttpDataSource');


goog.require('goog.dom');
goog.require('goog.dom.xml');
goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.DataManager');
goog.require('goog.ds.LoadState');
goog.require('goog.ds.logger');
goog.require('goog.net.XmlHttp');
goog.require('goog.string');
goog.require('goog.Uri');


/**
 * Data source whose backing is an xml node
 *
 * @param {Element} node The XML node. Can be null
 * @param {Element} parent Parent of XML element. Can be null
 * @param {String} opt_name The name of this node relative to the parent node
 *
 * @extends goog.ds.DataNode
 * @constructor
 */
goog.ds.XmlDataSource = function(node, parent, opt_name) {
  this.parent_ = parent;
  this.dataName_ = opt_name || (node ? node.nodeName : null);
  this.setNode_(node);
};


/** Constant to select XML attributes for getChildNodes */
goog.ds.XmlDataSource.ATTRIBUTE_SELECTOR_ = '@*';


/**
 * Set the current root nodeof the data source.
 * Can be an attribute node, text node, or element node
 * @param {Element} node The node. Can be null
 *
 * @private
 */
goog.ds.XmlDataSource.prototype.setNode_ = function(node) {
  this.node_ = node;
  if (node != null) {
    switch (node.nodeType) {
      case goog.dom.NodeType.ATTRIBUTE:
      case goog.dom.NodeType.TEXT:
        this.value_ = node.nodeValue;
        break;
      case goog.dom.NodeType.ELEMENT:
        if (node.childNodes.length == 1 &&
            node.firstChild.nodeType == goog.dom.NodeType.TEXT) {
          this.value_ = node.firstChild.nodeValue;
        }
    }
  }
};


/**
 * Creates the DataNodeList with the child nodes for this element.
 * Allows for only building list as needed.
 *
 * @private
 */
goog.ds.XmlDataSource.prototype.createChildNodes_ = function() {
  if (this.childNodeList_) {
    return;
  }
  var childNodeList = new goog.ds.BasicNodeList();
  if (this.node_ != null) {
    var childNodes = this.node_.childNodes;
    for (var i = 0, childNode; childNode = childNodes[i]; i++) {
      if (childNode.nodeType != goog.dom.NodeType.TEXT ||
          !goog.string.isEmpty(childNode.nodeValue)) {
        var newNode = new goog.ds.XmlDataSource(childNode,
            this, childNode.nodeName);
        childNodeList.add(newNode);
      }
    }
  }
  this.childNodeList_ = childNodeList;
};

/**
 * Creates the DataNodeList with the attributes for the element
 * Allows for only building list as needed.
 *
 * @private
 */
goog.ds.XmlDataSource.prototype.createAttributes_ = function() {
  if (this.attributes_) {
    return;
  }
  var attributes = new goog.ds.BasicNodeList();
  if (this.node_ != null) {
    var atts = this.node_.attributes;
    for (var i = 0, att; att = atts[i]; i++) {
      var newNode = new goog.ds.XmlDataSource(att, this, att.nodeName);
      attributes.add(newNode);
    }
  }
  this.attributes_ = attributes;
};


/**
 * Get the value of the node
 * @return {Object} The value of the node, or null if no value
 */
goog.ds.XmlDataSource.prototype.get = function() {
  this.createChildNodes_();
  return this.value_ || this.childNodeList_;
};


/**
 * Set the value of the node
 * @param {Object} value The new value of the node
 */
goog.ds.XmlDataSource.prototype.set = function(value) {
  throw Error('Can\'t set on XmlDataSource yet');
};


/**
 * Gets all of the child nodes of the current node.
 * Should return an empty DataNode list if no child nodes.
 * @param {String} opt_selector String selector to choose child nodes
 * @return {goog.ds.DataNodeList} The child nodes
 */
goog.ds.XmlDataSource.prototype.getChildNodes = function(opt_selector) {
  if (opt_selector && opt_selector == 
      goog.ds.XmlDataSource.ATTRIBUTE_SELECTOR_) {
    this.createAttributes_();
    return this.attributes_;
  } else if (opt_selector == null){
    this.createChildNodes_();
    return this.childNodeList_;
  } else {
    throw new Error("Unsupported selector");
  }
  
};


/**
 * Gets a named child node of the current node
 * @param {String} name The node name
 * @return {goog.ds.DataNode} The child node, or null if
 *   no node of this name exists
 */
goog.ds.XmlDataSource.prototype.getChildNode = function(name) {
  if (goog.string.startsWith(name, goog.ds.STR_ATTRIBUTE_START_)) {
    var att = this.node_.getAttributeNode(name.substring(1));
    return att ? new goog.ds.XmlDataSource(att, this) : null;
  } else {
    return this.getChildNodes().get(name);
  }
};


/**
 * Gets the value of a child node
 * @param {String} name The node name
 * @return {Object} The value of the node, or null if no value or the child node
 *    doesn't exist
 */
goog.ds.XmlDataSource.prototype.getChildNodeValue = function(name) {
  if (goog.string.startsWith(name, goog.ds.STR_ATTRIBUTE_START_)) {
    return this.node_.getAttributeNode(name.substring(1)).nodeValue;
  } else {
    var node = this.getChildNode(name);
    return node ? node.get() : null;
  }
}


/**
 * Get the name of the node relative to the parent node
 * @return {String} The name of the node
 */
goog.ds.XmlDataSource.prototype.getDataName = function() {
  return this.dataName_;
};

/**
 * Setthe name of the node relative to the parent node
 * @param {String} name The name of the node
 */
goog.ds.XmlDataSource.prototype.setDataName = function(name) {
  this.dataName_ = name;
};


/**
 * Gets the a qualified data path to this node
 * @return {String} The data path
 */
goog.ds.XmlDataSource.prototype.getDataPath = function() {
  throw Error('Can\'t getDataPath on XmlDataSource yet');
};


/**
 * Load or reload the backing data for this node
 */
goog.ds.XmlDataSource.prototype.load = function() {
  // Nothing to do
};


/**
 * Gets the state of the backing data for this node
 * @return {goog.ds.LoadState} The state
 */
goog.ds.XmlDataSource.prototype.getLoadState = function() {
  return this.node_ ? goog.ds.LoadState.NOT_LOADED : goog.ds.LoadState.LOADED;
};


/**
 * Creates an XML document with one empty node.
 * Useful for places where you need a node that
 * can be queried against.
 *
 * @return {Document} Document with one empty node
 */
goog.ds.XmlDataSource.createChildlessDocument_ = function() {
  return goog.dom.xml.createDocument('nothing');
};


/**
 * Data source whose backing is an XmlHttpRequest,
 *
 * A URI of an empty string will mean that no request is made
 * and the data source will be a single, empty node.
 *
 * @param {String || goog.Uri} uri URL of the XmlHttpRequest
 * @param {String} name Name of the datasource
 *
 * implements goog.ds.XmlHttpDataSource
 * @constructor
 */
goog.ds.XmlHttpDataSource = function(uri, name) {
  goog.ds.XmlDataSource.call(this, null, null, name);
  if (uri) {
    this.uri_ = new goog.Uri(uri);
  } else {
    this.uri_ = null;
  }
};

goog.ds.XmlHttpDataSource.inherits(goog.ds.XmlDataSource);

/**
* Default load state is NOT_LOADED
*/
goog.ds.XmlHttpDataSource.prototype.loadState_ = goog.ds.LoadState.NOT_LOADED;


/**
 * Load or reload the backing data for this node.
 * Fires the XmlHttpRequest
 */
goog.ds.XmlHttpDataSource.prototype.load = function() {
  if (this.uri_) {
    goog.ds.logger.info('Sending XML request for DataSource ' +
        this.getDataName() + ' to ' + this.uri_);
    this.loadState_ = goog.ds.LoadState.LOADING;
    // TODO(uidude) move to shared xmlhttp when ready
    this.loader_ = new goog.ds.XmlHttp_(this.uri_,
                                        goog.bind(this.success_, this),
                                        goog.bind(this.failure_, this));
  } else {
    this.node_ = goog.ds.XmlDataSource.createChildlessDocument_();
    this.loadState_ = goog.ds.LoadState.NOT_LOADED;
  }
};


/**
 * Gets the state of the backing data for this node
 * @return {goog.ds.LoadState} The state
 */
goog.ds.XmlHttpDataSource.prototype.getLoadState = function() {
  return this.loadState_;
};


/**
 * Success result. Checks whether valid XML was returned
 * and sets the XML and loadstate.
 * Currently uses internal XMLHTTP implementation pending
 * completion of core Closure XMLHTTP.
 * TODO(uidude): Switch when closure version is completed
 *
 * @private
 */
goog.ds.XmlHttpDataSource.prototype.success_ = function() {
  goog.ds.logger.info('Got data for DataSource ' + this.getDataName());
  var req = this.loader_.getRequest();
  var xml = req.responseXML;

  // Fix for case where IE returns valid XML as text but
  // doesn't parse by default
  if (xml && !xml.hasChildNodes() &&
      goog.isObject(req.responseText)) {
    xml = goog.dom.xml.loadXml(req.responseText);
  }
  // Failure result
  if (!xml || !xml.hasChildNodes()) {
    this.loadState_ = goog.ds.LoadState.FAILED;
    this.node_ = goog.ds.XmlDataSource.createChildlessDocument_();
  }
  else {
    this.loadState_ = goog.ds.LoadState.LOADED;
    this.node_ = xml.documentElement;
  }

  goog.ds.DataManager.getInstance().fireDataChange(this.getDataName());
};


/**
 * Failure result
 *
 * @private
 */
goog.ds.XmlHttpDataSource.prototype.failure_ = function() {
  goog.ds.logger.info('Data retrieve failed for DataSource ' +
      this.getDataName());

  this.loadState_ = goog.ds.LoadState.FAILED;
  this.node_ = goog.ds.XmlDataSource.createChildlessDocument_();

  goog.ds.DataManager.getInstance().fireDataChange(this.getDataName());
};


/**
 *
 * XMLHttp utilities based of Prototype
 * Temporary until closure libraries are complete
 * TODO(uidude) move to common xmlhttp when libraries are complete
 *
 * Build an XmlHttp object
 * @param {String || goog.Uri} uri The URL to send to
 * @param {Function} onload Function to call when xml document loads succesfully
 * @param {Function} opt_onerror Function to call when xml document load fails
 *
 * @constructor
 */
goog.ds.XmlHttp_ = function(uri, onload, opt_onerror) {
  this.req_ = null;
  this.onLoadCallback_ = onload;
  this.onErrorCallback_ = opt_onerror || this.handleDefaultError_;
  this.uri_ = new goog.Uri(uri);
  this.loadXmlDoc_();
}

/**
 * Load the xml document
 */
goog.ds.XmlHttp_.prototype.loadXmlDoc_ = function() {
  this.req_ = new goog.net.XmlHttp();

  if (this.req_) {
    try {
      this.req_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
      this.req_.open('GET', String(this.uri_), true);
      this.req_.send(null);
    }
    catch (err) {
      this.onErrorCallback_.call(this);
    }
  }
}

/**
 * Callback when status changes occur in request
 */
goog.ds.XmlHttp_.prototype.onReadyStateChange_ = function() {
  var req = this.req_;
  var ready = req.readyState;
  if (ready == goog.net.XmlHttp.ReadyState.COMPLETE) {
    var httpStatus = req.status;
    var fn;
    if (httpStatus == 200 || httpStatus == 0) {
      fn = goog.bind(this.onLoad_, this);
    } else {
      fn = goog.bind(this.onError_, this);
    }
    // Onload & onerror can cause threading issues if called directly,
    // as this callback can multi-thread in a non multi-threaded environment
    // setTimeout puts this back in the single threaded land
    window.setTimeout(fn, 10);
  }
}

/**
 * Onload and onerror set a timeout to call the real functions
 * to get around threading issues
 */
goog.ds.XmlHttp_.prototype.onLoad_ = function() {
  this.onLoadCallback_(this);
}

/**
 * Onload and onerror set a timeout to call the real functions
 * to get around threading issues
 */
goog.ds.XmlHttp_.prototype.onError_ = function() {
  this.onErrorCallback_(this);
}


/**
 * Default error function if none is passed in
 */
goog.ds.XmlHttp_.prototype.handleDefaultError_ = function() {
  throw Error('Error fetching data from URL: ' + this.uri_);
}

/**
 * Default error function if none is passed in
 * @return {XMLHttpRequest} the XmlHttpRequest
 */
goog.ds.XmlHttp_.prototype.getRequest = function() {
  return this.req_;
}

