// Copyright 2006 Google Inc.
// All Rights Reserved

/**
 * @fileoverview
 * Generic rich data access API
 *
 * See http://wiki.corp.google.com/twiki/bin/view/Main/ClientDataSource
 *
 * @author uidude@google.com (Evan Gilbert)
 */


goog.provide('goog.ds.BasicNodeList');
goog.provide('goog.ds.DataNode');
goog.provide('goog.ds.DataNodeList');
goog.provide('goog.ds.EmptyNodeList');
goog.provide('goog.ds.LoadState');
goog.provide('goog.ds.logger');


goog.require('goog.structs.Map');
goog.require('goog.debug.Logger');


/**
 * Interface for node in rich data tree.
 *
 * Throws exceptions when accessing unimplemented methods.
 *
 * @constructor
 */
goog.ds.DataNode = function() {};


/**
 * Get the value of the node
 * @return {Object} The value of the node, or null if no value
 */
goog.ds.DataNode.prototype.get = function() {};

/**
 * Set the value of the node
 * @param {Object} value The new value of the node
 */
goog.ds.DataNode.prototype.set = function(value) {};


/**
 * Gets all of the child nodes of the current node.
 * Should return an empty DataNode list if no child nodes.
 * @param {String} opt_selector String selector to choose child nodes
 * @return {goog.ds.DataNodeList} The child nodes
 */
goog.ds.DataNode.prototype.getChildNodes = function(opt_selector) {};


/**
 * Gets a named child node of the current node
 * @param {String} name The node name
 * @return {goog.ds.DataNode} The child node, or null
 * if no node of this name exists
 */
goog.ds.DataNode.prototype.getChildNode = function(name) {};


/**
 * Gets the value of a child node
 * @param {String} name The node name
 * @return {Object} The value of the node, or null if no value or the child node
 *    doesn't exist
 */
goog.ds.DataNode.prototype.getChildNodeValue = function(name) {};


/**
 * Get the name of the node relative to the parent node
 * @return {String} The name of the node
 */
goog.ds.DataNode.prototype.getDataName = function() {};


/**
 * Set the name of the node relative to the parent node
 * @param {String} name The name of the node
 */
goog.ds.DataNode.prototype.setDataName = function(name) {};


/**
 * Gets the a qualified data path to this node
 * @return {String} The data path
 */
goog.ds.DataNode.prototype.getDataPath = function() {};


/**
 * Load or reload the backing data for this node
 */
goog.ds.DataNode.prototype.load = function() {
  this.unimplemented_('load');
};


/**
 * Gets the state of the backing data for this node
 * @return {goog.ds.LoadState} The state
 */
goog.ds.DataNode.prototype.getLoadState = null;
;

/**
 * Whether the value of this node is a homogeneous list of data
 * @return {Boolean} True if a list
 */
goog.ds.DataNode.prototype.isList = function() {}


/**
 * Enum for load state of a DataNode
 */
goog.ds.LoadState = {
  LOADED: 'LOADED',
  LOADING: 'LOADING',
  FAILED: 'FAILED',
  NOT_LOADED: 'NOT_LOADED'
};


/**
 * Interface for node list in rich data tree.
 *
 * Has both map and list-style accessors
 *
 * @constructor
 */
goog.ds.DataNodeList = function() {};


/**
 * Add a node to the node list.
 * If the node has a dataName, uses this for the key in the map.
 *
 * @param {goog.ds.DataNode} node The node to add
 */
goog.ds.DataNodeList.prototype.add = function(node) {};


/**
 * Get a node by string key.
 * Returns null if node doesn't exist.
 *
 * @param {String} key String lookup key
 * @return {DataNode} The node, or null if doesn't exist
 */
goog.ds.DataNodeList.prototype.get = function(key) {};


/**
 * Get a node by index
 * Returns null if the index is out of range
 *
 * @param {Number} index The index of the node
 * @return {goog.ds.DataNode} The node, or null if doesn't exist
 */
goog.ds.DataNodeList.prototype.getByIndex = function(index) {};


/**
 * Gets the size of the node list
 *
 * @return {Number} The size of the list
 */
goog.ds.DataNodeList.prototype.getCount = null;


/**
 * Simple node list implementation with underlying array and map
 * implements goog.ds.DataNodeList
 * 
 * @param {goog.ds.DataNode[]} opt_nodes optional nodes to add to list
 * @constructor
 */
goog.ds.BasicNodeList = function(opt_nodes) {
  this.map_ = new goog.structs.Map();
  this.list_ = [];
  if (opt_nodes) {
    for (var i = 0, node; node = opt_nodes[i]; i++) {
      this.add(node);
    }
  }
};


/**
 * Add a node to the node list.
 * If the node has a dataName, uses this for the key in the map.
 * TODO(uidude) Remove function as well
 *
 * @param {goog.ds.DataNode} node The node to add
 */
goog.ds.BasicNodeList.prototype.add = function(node) {
  this.list_.push(node);
  var dataName = node.getDataName();
  if (dataName != null)
    this.map_.set(dataName, node);
};


/**
 * Get a node by string key.
 * Returns null if node doesn't exist.
 *
 * @param {String} key String lookup key
 * @return {goog.ds.DataNode} The node, or null if doesn't exist
 */
goog.ds.BasicNodeList.prototype.get = function(key) {
  return this.map_.get(key) || null;
};


/**
 * Get a node by index
 * Returns null if the index is out of range
 *
 * @param {Number} index The index of the node
 * @return {goog.ds.DataNode} The node, or null if doesn't exist
 */
goog.ds.BasicNodeList.prototype.getByIndex = function(index) {
  return this.list_[index] || null;
};


/**
 * Gets the size of the node list
 *
 * @return {Number} The size of the list
 */
goog.ds.BasicNodeList.prototype.getCount = function() {
  return this.list_.length;
};


/**
 * Immulatable empty node list
 * @extends goog.ds.BasicNodeList
 * @constructor
 */

goog.ds.EmptyNodeList = function() {
  goog.ds.BasicNodeList.call(this);
};


goog.ds.EmptyNodeList.inherits(goog.ds.BasicNodeList);


/**
 * Add a node to the node list.
 * If the node has a dataName, uses this for the key in the map.
 *
 * @param {goog.ds.DataNode} node The node to add
 */
goog.ds.EmptyNodeList.prototype.add = function(node) {
  throw Error('Can\'t add to EmptyNodeList');
};


/**
 * Constants
 */
goog.ds.STR_ATTRIBUTE_START_ = '@';
goog.ds.STR_ALL_CHILDREN_SELECTOR = "*";
goog.ds.STR_WILDCARD = "*";
goog.ds.STR_PATH_SEPARATOR = "/";
goog.ds.STR_ARRAY_START = "[";


/**
 * Shared logger instance for data package
 * @type goog.debug.Logger
 */
goog.ds.logger = goog.debug.Logger.getLogger('goog.ds');