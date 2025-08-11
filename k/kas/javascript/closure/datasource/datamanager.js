// Copyright 2006 Google Inc.
// All Rights Reserved

/**
 * @fileoverview
 * Central class for registering and accessing data sources
 * Also handles processing of data events
 *
 * There is a shared global instance that most client code should access via
 * goog.ds.DataManager.getInstance(). However you can also create your own
 * DataManager using new
 *
 * Implements DataNode to provide the top element in a data registry
 * Prepends '$' to top level data names in path to denote they are root object
 *
 * @author uidude@google.com (Evan Gilbert)
 */
goog.provide('goog.ds.DataManager');


goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.DataNode');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');
goog.require('goog.string');


/**
 * Create a DataManger
 * @constructor
 */
goog.ds.DataManager = function() {
  this.dataSources_ = new goog.ds.BasicNodeList();
  this.autoloads_ = new goog.structs.Map();
  this.listeners_ = new goog.structs.Set();
};


/**
 * Global instance
 */
goog.ds.DataManager.instance_ = null;


goog.ds.DataManager.inherits(goog.ds.DataNode);


/**
 * Get the global instance
 */
goog.ds.DataManager.getInstance = function() {
  if (!goog.ds.DataManager.instance_) {
    goog.ds.DataManager.instance_ = new goog.ds.DataManager();
  }
  return goog.ds.DataManager.instance_;
};


/**
 * Add a data source
 * @param {goog.ds.DataNode} ds The data source
 * @param {Boolean} autoload Whether to automatically load the data
 * @param {String} opt_name Optional name, can also get name
 *   from the datasource
 */
goog.ds.DataManager.prototype.addDataSource = function(ds, autoload, opt_name) {
  var name = '$' + (opt_name || ds.getDataName());
  ds.setDataName(name);
  this.dataSources_.add(ds);
  this.autoloads_.set(name, autoload);
};


/**
 * Gets a named child node of the current node.
 *
 * @param {String} name The node name
 * @return {goog.ds.DataNode} The child node,
 *   or null if no node of this name exists
 */
goog.ds.DataManager.prototype.getDataSource = function(name) {
  return this.dataSources_.get(name);
};


/**
 * Get the value of the node
 * @return {Object} The value of the node, or null if no value
 */
goog.ds.DataManager.prototype.get = function() {
  return this.dataSources_;
};


/**
 * Set the value of the node
 * @param {Object} value The new value of the node
 */
goog.ds.DataManager.prototype.set = function(value) {
  throw Error('Can\'t set on DataManager');
};


/**
 * Gets all of the child nodes of the current node.
 * @param {String} opt_selector String selector to choose child nodes
 * Should return an empty DataNode list if no child nodes.
 * 
 * @return {goog.ds.DataNodeList} The child nodes
 */
goog.ds.DataManager.prototype.getChildNodes = function(opt_selector) {
  if (opt_selector) {
    return new goog.ds.BasicNodeList([this.getChildNode(opt_selector)]);
  } else {
    return this.dataSources_;
  }
};


/**
 * Gets a named child node of the current node
 * @param {String} name The node name
 * @return {goog.ds.DataNode} The child node,
 *   or null if no node of this name exists
 */
goog.ds.DataManager.prototype.getChildNode = function(name) {
  return this.dataSources_.get(name);
};


/**
 * Gets the value of a child node
 * @param {String} name The node name
 * @return {Object} The value of the node, or null if no value or the child node
 *    doesn't exist
 */
goog.ds.DataManager.prototype.getChildNodeValue = function(name) {
  return this.dataSources_.get(name).get();
}


/**
 * Get the name of the node relative to the parent node
 * @return {String} The name of the node
 */
goog.ds.DataManager.prototype.getDataName = function() {
  return '';
};


/**
 * Gets the a qualified data path to this node
 * @return {String} The data path
 */
goog.ds.DataManager.prototype.getDataPath = function() {
  return '';
};


/**
 * Load or reload the backing data for this node
 * only loads datasources flagged with autoload
 */
goog.ds.DataManager.prototype.load = function() {
  var len = this.dataSources_.getCount();
  for (var i = 0; i < len; i++) {
    var ds = this.dataSources_.getByIndex(i);
    var autoload = this.autoloads_.get(ds.getDataName());
    if (autoload) {
      ds.load();
    }
  }
}


/**
 * Gets the state of the backing data for this node
 * @return {goog.ds.LoadState} The state
 */
goog.ds.DataManager.prototype.getLoadState = function() {
  throw Error('Will implement DataManager.loadstate soon');
};


/**
 * Whether the value of this node is a homogeneous list of data
 * @return {Boolean} True if a list
 */
goog.ds.DataManager.prototype.isList = function() {
  return false;
}
;

/**
 * Adds a listener
 * Listeners should fire when any data with path that has dataPath as substring
 * is changed.
 * TODO(uidude) Look into better listener handling
 *
 * @param {Function} fn Callback function, signature function(dataPath, id)
 * @param {String} dataPath Fully qualified data path
 * @param {String} opt_id A value passed back to the listener when the dataPath
 *   is matched
 */
goog.ds.DataManager.prototype.addListener = function(fn, dataPath, opt_id) {
  var listener = {dataPath: dataPath, id: opt_id, fn: fn};
  this.listeners_.add(listener);
};


/**
 * Removes listeners with a given callback function, and optional
 * matching dataPath and matching id
 *
 * @param {Function} fn Callback function, signature function(dataPath, id)
 * @param {String} opt_dataPath Fully qualified data path
 * @param {String} opt_id A value passed back to the listener when the dataPath
 *   is matched
 */
goog.ds.DataManager.prototype.removeListeners = function(fn, opt_dataPath,
    opt_id) {
  var listeners = this.listeners_.getValues();
  for (var i = 0; listeners[i]; i++) {
    var listener = listeners[i];
    if (listener.fn == fn &&
        (!opt_dataPath || (opt_dataPath == listener.dataPath)) &&
        (!opt_id || (opt_id == listener.id))) {
      this.listeners_.remove(listener);
    }
  }
}


/**
 * Fire a data change event to all listeners
 * Listeners wiol be fired when any data with path that has dataPath
 * as substring is changed
 * @param {String} dataPath Fully qualified data path
 */
goog.ds.DataManager.prototype.fireDataChange = function(dataPath) {
  var listeners = this.listeners_.getValues();

  for (var i = 0, listener; listener = listeners[i] ; i++) {
    var listener = listeners[i];
    if (goog.string.startsWith(dataPath + '/', listener.dataPath) ||
        listener.dataPath == dataPath) {
      listener.fn(dataPath, listener.id);
    }
  }
};
