// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Datastructure: Set
 *
 * @author arv@google.com (Erik Arvidsson)
 *
 * This class implements a set data structure. Adding and removing is O(1). It
 * supports both object and primitive values. Be careful because you can add
 * both 1 and new Number(1), beacuse these are not the same. You can even add
 * multiple new Number(1) because these are not equal.
 */


goog.provide('goog.structs.Set');

goog.require('goog.structs');
goog.require('goog.structs.Map');


/**
 * Class for Set datastructure
 *
 * @constructor
 *
 * @param {goog.structs.Set} opt_set Initial values to start with
 */
goog.structs.Set = function(opt_set) {
  this.map_ = new goog.structs.Map;
  if (opt_set) {
    this.addAll(opt_set)
  }
};


/**
 * This is used to get the key or the hash. We are not using getHashCode
 * because it only works with objects
 * @private
 * @param {Object} val Object or primitive value to get a key for
 * @return {String} A unique key for this value/object
 */
goog.structs.Set.getKey_ = function (val) {
  var type = typeof val;
  if (type == 'object') {
    return 'o' + goog.getHashCode(val);
  } else {
    return type.substr(0, 1) + val;
  }
};


/**
 * The number of objects in the Set
 * @return {Number}
 */
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
};


/**
 * Add an object to the set
 * @param {Object} obj The object to add
 */
goog.structs.Set.prototype.add = function(obj) {
  this.map_.set(goog.structs.Set.getKey_(obj), obj);
};


/**
 * Adds all objects from one goog.structs.Set to the current one. This one can'
 * take an array as well.
 * @param {Object} set The set or array to add objects from
 */
goog.structs.Set.prototype.addAll = function(set) {
  var values = goog.structs.Set.getValues(set);
  var l = values.length;
  for (var i = 0; i < l; i++) {
    this.add(values[i]);
  }
};


/**
 * Removes an object from the set
 * @param {Object} obj The object to remove
 */
goog.structs.Set.prototype.remove = function(obj) {
  this.map_.remove(goog.structs.Set.getKey_(obj));
};


/**
 * Removes all objects from the set
 */
goog.structs.Set.prototype.clear = function() {
  this.map_.clear();
};


/**
 * Removes all objects from the set
 * @return {Boolean} true if there are no objects in the goog.structs.Set
 */
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};


/**
 * Whether the goog.structs.Set contains an object or not
 * @param {Object} obj The object to test for
 * @return {Boolean} true if the set contains the object
 */
goog.structs.Set.prototype.contains = function(obj) {
  return this.map_.containsKey(goog.structs.Set.getKey_(obj));
};


/**
 * Inserts the objects in the set into a new Array
 * @return {Array} an array with all the values in
 */
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues()
};


/**
 * Does a shallow clone of the goog.structs.Set
 * @return {goog.structs.Set} a new set
 */
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this);
};


/**
 * The number of key value pairs in the map
 * @param {Object} col The collection like object
 * @return {Number}
 */
goog.structs.Set.getCount = function(col) {
  return goog.structs.getCount(col);
};


/**
 * This returns the values of the map
 * @param {Object} col The collection like object
 * @return {Array} the values in the map
 */
goog.structs.Set.getValues = function(col) {
  return goog.structs.getValues(col);
};


/**
 * Whether the collection contains the given value. This is O(n) and uses
 * equals (==) to test the existance
 * @param {Object} col The collection like object
 * @param {Object} val The value to check for.
 * @return {Boolean} true if the map contains the value
 */
goog.structs.Set.contains = function(col, val) {
  return goog.structs.contains(col, val);
};


/**
 * Whether the collection is empty
 * @param {Object} col The collection like object
 * @return {Boolean} true if empty
 */
goog.structs.Set.isEmpty = function(col) {
  return goog.structs.isEmpty(col);
};


/**
 * Removes all the elements from the collection
 * @param {Object} col The collection like object
 */
goog.structs.Set.clear = function(col) {
  goog.structs.clear(col);
};


/**
 * Removes a value from the collection. This is O(n) in some implementations
 * and then uses equal (==) to find the element.
 * @param {Object} col The collection like object
 * @param {Object} val The element to remove
 * @return {Boolean} True if an element was removed
 */
goog.structs.Set.remove = function(col, val) {
  if (typeof col.remove == 'function') {
    return col.remove(val);
  } else if (goog.isArrayLike(col)) {
    return goog.array.remove(col, val);
  } else {
    // this removes based on value not on key.
    var l = col.length;
    for (var key in col) {
      if (col[key] == val) {
        delete col[key];
        return true;
      }
    }
    return false;
  }
};


/**
 * Adds a value to the collection
 *
 * @throws {Exception} If the collection does not have an add method or is not
 *                     array like.
 *
 * @param {Object} col The collection like object
 * @param {Object} val The value to add
 *
 */
goog.structs.Set.add = function(col, val) {
  if (typeof col.add == 'function') {
    col.add(val);
  } else if (goog.isArrayLike(col)) {
    col[col.length] = val; // don't use push because push is not a requirement
                           // for an object to be array like
  } else {
    throw Error('The collection does not know how to add "' + val + '"');
  }
};
