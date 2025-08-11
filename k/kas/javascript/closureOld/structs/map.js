// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Datastructure: Hash Map
 *
 * @author arv@google.com (Erik Arvidsson)
 *
 * This file contains an implementation of a Map structure. It implements a lot
 * of the methods used in goog.structs so those functions work on hashes.
 */

// NOTE(arv): We can not use hasOwnProperty for a few reasons.
//            1. It does not work in some (not so) old browsers
//            2. It would prevent us from using 'hasOwnProperty' as a key name

// Make sure namespace exists
goog.provide('goog.structs.Map');

goog.require('goog.object');

/**
 * Class for Hash Map datastructure
 * @param {Object} opt_map Optional goog.structs.Map or Object to initialize
 *                         the map with.
 * @constructor
 */
goog.structs.Map = function(opt_map) {
  this.map_ = {};
  if (opt_map) {
    this.addAll(opt_map);
  }
};


/**
 * The number of key value pairs in the map
 * @private
 * @type Number
 */
goog.structs.Map.prototype.count_ = 0;


/**
 * The number of key value pairs in the map
 * @return {Number}
 */
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};


goog.structs.Map.isKey_ = function(s) {
  return s.charAt(0) == ':';
};

goog.structs.Map.getKey_ = function(s) {
  return s.substring(1);
};

goog.structs.Map.makeKey_ = function(s) {
  return ':' + s;
};

/**
 * This returns the values of the map
 * @return {Array} the values in the map
 */
goog.structs.Map.prototype.getValues = function() {
  var rv = [];
  for (var key in this.map_) {
    if (goog.structs.Map.isKey_(key)) {
      rv.push(this.map_[key]);
    }
  }
  return rv;
};


/**
 * This returns the keys of the map
 * @return {Array} Array of String values
 */
goog.structs.Map.prototype.getKeys = function() {
  var rv = [];
  for (var key in this.map_) {
    if (goog.structs.Map.isKey_(key)) {
      rv.push(goog.structs.Map.getKey_(key));
    }
  }
  return rv;
};


/**
 * Whether the map contains the given key
 * @param {String} key The key to check for
 * @return {Boolean} true if the map contains the key
 */
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.makeKey_(key) in this.map_;
};


/**
 * Whether the map contains the given value. This is O(n)
 * @param {Object} val The value to check for.
 * @return {Boolean} true if the map contains the value
 */
goog.structs.Map.prototype.containsValue = function(val) {
  for (var key in this.map_) {
    if (goog.structs.Map.isKey_(key) &&
        this.map_[key] == val) {
      return true;
    }
  }
  return false;
};


/**
 * Whether the map is empty
 * @return {Boolean} true if empty
 */
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0;
};


/**
 * Removes all key value pairs from the map
 */
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.count_ = 0;
};


/**
 * Removes a key value pair based on the key
 * @param {String} key The key to remove
 */
goog.structs.Map.prototype.remove = function(key) {
  if (goog.object.remove(this.map_, goog.structs.Map.makeKey_(key))) {
    this.count_--;
  }
};


/**
 * Returns the value for the given key
 * @param {String} key The key to get the value for
 * @param {Object} opt_val The value to return if no item is found for the
 *                         given key
 * @return {Object} the value for the given key
 */
goog.structs.Map.prototype.get = function(key, opt_val) {
  var internalKey = goog.structs.Map.makeKey_(key);
  if (internalKey in this.map_) {
    return this.map_[internalKey];
  }
  return opt_val;
};


/**
 * Adds a key value pair to the map
 * @param {String} key The key
 * @param {Object} value The value to add
 */
goog.structs.Map.prototype.set = function(key, value) {
  var internalKey = goog.structs.Map.makeKey_(key);
  if (!(internalKey in this.map_)) {
    this.count_++;
  }
  this.map_[internalKey] = value;
};


/**
 * Adds multiple key value pairs from another goog.structs.Map or Object
 * @param {Object} map Object containing the data to add.
 */
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  if (map instanceof goog.structs.Map) {
    keys = map.getKeys();
    values = map.getValues();
  } else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map);
  }
  // we could use goog.array.forEach here but I don't want to introduce that
  // dependency just for this.
  for (var i = 0; i < keys.length; i++) {
    this.set(keys[i], values[i]);
  }
};


/**
 * Clones a map and returns a new map
 * @return {goog.structs.Map} a new goo.structs.Map with the same key value
 *                            pairs.
 */
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};





/**
 * This returns the values of the map
 * @param {Object} map The collection like object
 * @return {Array} the values in the map
 */
goog.structs.Map.getCount = function(map) {
  return goog.structs.getCount(map);
};

/**
 * This returns the values of the map
 * @param {Object} map The collection like object
 * @return {Array} the values in the map
 */
goog.structs.Map.getValues = function(map) {
  return goog.structs.getValues(map);
};

/**
 * This returns the keys of the map
 * @param {Object} map The map like structure
 * @return {Array} Array of String values
 */
goog.structs.Map.getKeys = function(map) {
  if (typeof map.getKeys == 'function') {
    return map.getKeys();
  }
  var rv = [];
  if (goog.isArrayLike(map)) {
    for (var i = 0; i < map.length; i++) {
      rv.push(i);
    }
  } else { // Object
    return goog.object.getKeys(map);
  }
  return rv;
};


/**
 * Whether the map contains the given key
 * @param {Object} map The map like structure
 * @param {String} key The key to check for
 * @return {Boolean} true if the map contains the key
 */
goog.structs.Map.containsKey = function(map, key) {
  if (typeof map.containsKey == 'function') {
    return map.containsKey(key);
  }
  if (goog.isArrayLike(map)) {
    return key < map.length;
  }
  // Object
  return goog.object.containsKey(map, key);
};


/**
 * Whether the map contains the given value. This is O(n) and uses
 * equals (==) to test
 * @param {Object} map The map like structure
 * @param {String} val The key to check for
 * @return {Boolean} true if the map contains the key
 */
goog.structs.Map.containsValue = function(map, val) {
  return goog.structs.contains(map, val);
};


/**
 * Whether the map is empty
 * @param {Object} map The map like object
 * @return {Boolean} true if empty
 */
goog.structs.Map.isEmpty = function(map) {
  return goog.structs.isEmpty(map);
};


/**
 * Removes all key value pairs from the map
 * @param {Object} map The map like object
 */
goog.structs.Map.clear = function(map) {
  goog.structs.clear(map);
};


/**
 * Removes a key value pair based on the key
 * @param {Object} map The map like object
 * @param {String} key The key to remove
 * @return {Boolean} True if the map contained the key
 */
goog.structs.Map.remove = function(map, key) {
  if (typeof map.remove == 'function') {
    return map.remove(key);
  }
  if (goog.isArrayLike(map)) {
    return goog.array.removeAt(map, key);
  }
  // Object
  return goog.object.remove(map, key);
};


/**
 * Adds a key value pair to the map. This throws an exception if the key is
 * already in use. Use set if you want to change an existing pair
 * @param {Object} map The map like object
 * @param {String} key The key to add
 * @param {Object} val The value to add
 */
goog.structs.Map.add = function(map, key, val) {
  if (typeof map.add == 'function') {
    map.add(key, val);
  } else if (goog.structs.Map.containsKey(map, key)) {
    throw Error('The collection already contains the key "' + key + '"');
  } else {
    goog.collection.set(map, key, val);
  }
};


/**
 * Returns the value for the given key
 * @param {Object} map The map like object
 * @param {String} key The key to get the value for
 * @param {Object} opt_val The value to return if no item is found for the
 *                         given key
 * @return {Object} the value for the given key
 */
goog.structs.Map.get = function(map, key, opt_val) {
  if (typeof map.get == 'function') {
    return map.get(key, opt_val);
  }
  if (goog.structs.Map.containsKey(map, key)) {
    return map[key];
  }
  return opt_val;
};


/**
 * Sets the value for the given key
 * @param {Object} map The map like object
 * @param {String} key The key to get the value for
 * @param {Object} val The value to add
 */
goog.structs.Map.set = function(map, key, val) {
  if (typeof map.set == 'function') {
    map.set(key, val);
  } else {
    map[key] = val;
  }
};


