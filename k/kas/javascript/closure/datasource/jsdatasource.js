// Copyright 2006 Google Inc.
// All Rights Reserved

/**
 * @fileoverview
 * Implementations of DataNode for wrapping JS data
 *
 * @author uidude@google.com (Evan Gilbert)
 */


goog.provide('goog.ds.JsDataSource');
goog.provide('goog.ds.JsonDataSource');

goog.require('goog.dom');
goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.DataManager');
goog.require('goog.ds.LoadState');
goog.require('goog.ds.logger');
goog.require('goog.Uri');


/**
 * Data source whose backing is JavaScript data
 *
 * @param {Object} root The root JS node
 * @param {String} dataName The name of this node relative to the parent node
 * @param {Object} opt_parent Optional parent of this JsDataSource
 *
 * implements goog.ds.DataNode
 * @constructor
 */
goog.ds.JsDataSource = function(root, dataName, opt_parent) {
  this.parent_ = opt_parent;
  this.dataName_ = dataName;
  this.setRoot_(root);
};


/**
 * Sets the root JS object
 * @param {Object} root The root JS object. Can be null
 *
 * @protected
 */
goog.ds.JsDataSource.prototype.setRoot_ = function(root) {
  this.root_ = root;
};


/**
 * Get the value of the node
 * @return {Object} The value of the node, or null if no value
 */
goog.ds.JsDataSource.prototype.get = function() {
  return !goog.isObject(this.root_) ? this.root_ : this.getChildNodes();
};


/**
 * Set the value of the node
 * @param {Object} value The new value of the node
 */
goog.ds.JsDataSource.prototype.set = function(value) {
  if (goog.isObject(this.root_)) {
    throw Error('Can\'t set on group nodes yet');
  }
  
  if (this.parent_) {
    this.parent_.root_[this.dataName_] = value;
  }
  this.root_ = value;
  this.childNodeList_ = null;

  goog.ds.DataManager.getInstance().fireDataChange(this.getDataPath());
};


/**
 * Gets all of the child nodes of the current node.
 * Should return an empty DataNode list if no child nodes.
 * @param {String} opt_selector String selector to choose child nodes
 * @return {goog.ds.DataNodeList} The child nodes
 *
 * TODO(uidude) revisit lazy creation
 */
goog.ds.JsDataSource.prototype.getChildNodes = function(opt_selector) {
  if (!this.root_) {
    return new goog.ds.EmptyNodeList();
  }
  
  if (!opt_selector || opt_selector == goog.ds.STR_ALL_CHILDREN_SELECTOR) {
    this.createChildNodes_(false);
    return this.childNodeList_;
  } else if (opt_selector.indexOf(goog.ds.STR_WILDCARD) == -1) {
    if (this.root_[opt_selector] != null){
      return new goog.ds.BasicNodeList([this.getChildNode(opt_selector)]) 
    } else {
      return new goog.ds.EmptyNodeList();
    }
  } else {
      throw new Error("Selector not supported yet ("+ opt_selector + ")");
  }
    
};
  

/**
 * Creates the DataNodeList with the child nodes for this element.
 * Allows for only building list as needed.
 *
 * @param {Boolean} force Whether to force recreating child nodes
 * @private
 */
goog.ds.JsDataSource.prototype.createChildNodes_ = function(force) {
  if (this.childNodeList_ && !force) {
    return;
  }
  
  if (!goog.isObject(this.root_)) {
    this.childNodeList_ = new goog.ds.EmptyNodeList();
    return;
  }
  
  var childNodeList = new goog.ds.BasicNodeList();
  if (this.root_ != null) {
    var newNode;
    if (goog.isArray(this.root_)) {
      for (var i = 0; i < this.root_.length; i++) {
        // "id" is reserved node name that will map to a named child node
        // TODO(uidude) Configurable logic for choosing idnode
        var name = this.root_[i].id || '[' + i + ']';
        newNode = new goog.ds.JsDataSource(this.root_[i], name, this);
        childNodeList.add(newNode);
      }

    } else {
      for (var name in this.root_) {
        var obj = this.root_[name];
        if (!goog.isFunction(obj)) {
          newNode = new goog.ds.JsDataSource(obj, name, this);
          childNodeList.add(newNode);
        }
      }
    }
  }
  this.childNodeList_ = childNodeList;
};


/**
 * Gets a named child node of the current node
 * @param {String} name The node name
 * @return {goog.ds.DataNode} The child node, or null if no node of
 *  this name exists
 */
goog.ds.JsDataSource.prototype.getChildNode = function(name) {
  if (!this.root_) {
    return null;
  }
  var node = this.getChildNodes().get(name);
  if (!node) {
    this.root_[name] = null;
    node = new goog.ds.JsDataSource(null, name, this);
    if (this.childNodeList_) {
      this.childNodeList_.add(node);
    }
  }
  return node;
};


/**
 * Gets the value of a child node
 * @param {String} name The node name
 * @return {Object} The value of the node, or null if no value or the child node
 *    doesn't exist
 */
goog.ds.JsDataSource.prototype.getChildNodeValue = function(name) {
  if (this.childNodeList_) {
    var node = this.getChildNodes().get(name);
    return node ? node.get() : null;
  } else if (this.root_) {
    return this.root_[name];
  } else {
    return null;
  }
};


/**
 * Get the name of the node relative to the parent node
 * @return {String} The name of the node
 */
goog.ds.JsDataSource.prototype.getDataName = function() {
  return this.dataName_;
};


/**
 * Setthe name of the node relative to the parent node
 * @param {String} dataName The name of the node
 */
goog.ds.JsDataSource.prototype.setDataName = function(dataName) {
  this.dataName_ = dataName;
};


/**
 * Gets the a qualified data path to this node
 * @return {String} The data path
 */
goog.ds.JsDataSource.prototype.getDataPath = function() {
  var parentPath = '';
  if (this.parent_) {
    parentPath = this.parent_.getDataPath() +
        (this.dataName_.indexOf(goog.ds.STR_ARRAY_START) != -1 ? '' :
        goog.ds.STR_PATH_SEPARATOR);
  }

  return parentPath + this.dataName_;
};


/**
 * Load or reload the backing data for this node
 */
goog.ds.JsDataSource.prototype.load = function() {
  // Nothing to do
};


/**
 * Gets the state of the backing data for this node
 * TODO(uidude) Discuss null value handling
 * @return {goog.ds.LoadState} The state
 */
goog.ds.JsDataSource.prototype.getLoadState = function() {
  return (this.root_ == null) ?  goog.ds.LoadState.NOT_LOADED :
      goog.ds.LoadState.LOADED;
};


/**
 * Data source whose backing is a JSON-like service, in which
 * retreiving the resource specified by URL with the additional parameter
 * callback. The resource retreived is executable JavaScript that
 * makes a call to the named function with a JavaScript object literal
 * as the only parameter.
 *
 * Example URI could be:
 * http://www.google.com/data/search?q=monkey&callback=mycb
 * which might return the JS:
 * mycb(searchresults:
 *   [{uri: 'http://www.monkey.com', title: 'Site About Monkeys'}]);
 *
 * A URI of an empty string will mean that no request is made
 * and the data source will be a data source with no child nodes
 *
 * @param {String || goog.Uri} uri URI for the request
 * @param {String} name Name of the datasource
 *
 * @extends goog.ds.JsDataSource
 * @constructor
 */
goog.ds.JsonDataSource = function(uri, name) {
  goog.ds.JsDataSource.call(this, null, name, null);
  if (uri) {
    this.uri_ = new goog.Uri(uri);
  } else {
    this.uri_ = null;
  }
};


goog.ds.JsonDataSource.inherits(goog.ds.JsDataSource);


/**
* Default load state is NOT_LOADED
*/
goog.ds.JsonDataSource.prototype.loadState_ = goog.ds.LoadState.NOT_LOADED;


/**
 * Map of all data sources, needed for callbacks
 * Doesn't work unless dataSources is exported (not renamed)
 */
goog.ds.JsonDataSource['dataSources'] = {};


/**
 * Load or reload the backing data for this node.
 * Fires the JsonDataSource
 */
goog.ds.JsonDataSource.prototype.load = function() {
  if (this.uri_) {
    goog.ds.JsonDataSource.dataSources[this.dataName_] = this;
    goog.ds.logger.info('Sending JS request for DataSource ' +
        this.getDataName() + ' to ' + this.uri_);

    this.loadState_ = goog.ds.LoadState.LOADING;

    var uriToCall = new goog.Uri(this.uri_);
    uriToCall.setParameterValues('callback',
        'JsonReceive.' + this.dataName_);

    goog.global['JsonReceive'][this.dataName_] =
       goog.bind(this.receiveData, this);

    var scriptEl = goog.dom.createElement('script');
    scriptEl.src = uriToCall;

    // These two will give feedback on some browsers when a script load fails
    scriptEl.onload = goog.bind(this.onLoad_, this);
    scriptEl.onreadystatechange = goog.bind(this.onReadyState_, this);
    goog.dom.$$('head')[0].appendChild(scriptEl);
  }
  else {
    this.root_ = {};
    this.loadState_ = goog.ds.LoadState.NOT_LOADED;
  }
};


/**
* Onreadystate callback for script.
*
* @param {Event} opt_event The event
*/
goog.ds.JsonDataSource.prototype.onReadyState_ = function(opt_event) {
  // Doesn't do anything yet
};

/**
* Onload callback for script. This is used with a timeout of 0 from the original
* callback to ensure no multithreading issues
*
* @param {Event} opt_event The event
*/
goog.ds.JsonDataSource.prototype.onLoad_ = function(opt_event) {
  // Doesn't do anything yet
};


/**
 * Gets the state of the backing data for this node
 * @return {goog.ds.LoadState} The state
 */
goog.ds.JsonDataSource.prototype.getLoadState = function() {
  return this.loadState_;
};


/**
 * Receives data from a Json request
 * @param {Object} obj The JSON data
 */
goog.ds.JsonDataSource.prototype.receiveData = function(obj) {
  this.setRoot_(obj);
  this.loadState_ = goog.ds.LoadState.LOADED;
  goog.ds.DataManager.getInstance().fireDataChange(this.getDataName());
};


/**
* Temp variable to hold callbacks
* until BUILD supports multiple externs.js files
*/
goog.global['JsonReceive'] = {};