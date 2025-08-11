// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Datastructure: Hash Map
 *
 * @author arv@google.com (Erik Arvidsson)
 *
 * This file contains an implementation of a Map structure. It implements a lot
 * of the methods used in goog.array so those functions work on hashes.
 */

// TODO(arv): This can be so much simpler if we could use hasOwnProperty but
//            some old Safari versions do not support this ECMAScript Edition 3
//            feature.

// Make sure namespace exists
goog.provide('goog.structs.Map');

/**
 * Class for Hash Map datastructure
 * @param {Object} opt_map Optional goog.structs.Map or Object to initialize
 *                         the map with.
 * @constructor
 */
goog.structs.Map = function(opt_map) {
  this.map_ = {};
  if (opt_map) {
    this.putAll(opt_map);
  }
};


/**
 * The number of key value pairs in the map
 * @type Number
 */
goog.structs.Map.prototype.count = 0;


/**
 * This returns the values of the map
 * @return {Array} the values in the map
 */
goog.structs.Map.prototype.getValues = function() {
  var rv = [];
  for (var key in this.map_) {
    if (key.charAt('0') == ':') {
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
    if (key.charAt('0') == ':') {
      rv.push(key.substr(1));
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
  return ':' + key in this.map_;
};


/**
 * Whether the map contains the given value. This is O(n)
 * @param {Object} val The value to check for.
 * @return {Boolean} true if the map contains the value
 */
goog.structs.Map.prototype.containsValue = function(val) {
  for (var key in this.map_) {
    if (this.map_[key] === val) {
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
  return this.count == 0;
};


/**
 * Removes all key value pairs from the map
 */
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.count = 0;
};


/**
 * Removes a key value pair based on the key
 */
goog.structs.Map.prototype.remove = function(key) {
  if (this.containsKey(key)) {
    delete this.map_[':' + key];
    this.count--;
  }
};


/**
 * Returns the value for the given key
 * @param {String} key The key to get the value for
 * @return {Object} the value for the given key
 */
goog.structs.Map.prototype.get = function(key) {
  return this.map_[':' + key];
};

/**
 * Adds a key value pair to the map
 * @param {String} key The key
 * @param {Object} value The value to add
 */
goog.structs.Map.prototype.put = function(key, value) {
  if (!this.containsKey(key)) {
    this.count++;
  }
  this.map_[':' + key] = value;
};


/**
 * Adds multiple key value pairs from another goog.structs.Map or Object
 * @param {Object} map Object containing the data to add.
 */
goog.structs.Map.prototype.putAll = function(map) {
  if (map instanceof goog.structs.Map) {
    var keys = map.getKeys();
    // we could use goog.array.forEach here but I don't want to introduce that
    // dependency just for this.
    for (var i = 0; i < keys.length; i++) {
      this.put(keys[i], map.get(keys[i]));
    }
  } else {
    for (var key in map) {
      this.put(key, map[key]);
    }
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
 * For each value key pair in an array call a function on it. The function takes
 * three arguments; the value, the key and the map
 *
 * @param {Function} f The function to call for every key value pair. This
 *                     function takes 3 arguments (the avlue, the key and the
 *                     goog.structs.Map) and the return value is irrelevant.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 */
goog.structs.Map.prototype.forEach = function(f, opt_obj) {
  for (var key in this.map_) {
    if (key.charAt(0) == ':') {
      f.call(opt_obj, this.map_[key], key.substr(1), this);
    }
  }
};

/**
 * For every key value pair in the map call a function and if that returns true
 * add the pair to a new goog.structs.Map.
 *
 * @param {Function} f The function to call for every key value pair. This
 *                     function takes 3 arguments (the value, the key and the
 *                     goog.structs.Map) and should return a Boolean. If the
 *                     return value is true the pair is added to the result
 *                     goog.structs.Map. If it is false the pair is not included.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @returns {goog.structs.Map} A new goog.structs.Map where the passed key
 *                             value pairs are present
 */
goog.structs.Map.prototype.filter = function(f, opt_obj) {
  var rv = new goog.structs.Map;
  var cleanedKey, val;
  for (var key in this.map_) {
    if (key.charAt(0) == ':') {
      cleanedKey = key.substr(1);
      val = this.map_[key];
      if (f.call(opt_obj, val, cleanedKey, this)) {
        rv.put(cleanedKey, val);
      }
    }
  }
  return rv;
};

/**
 * For every key value pair in the goog.structs.Map call a function and add
 * the result into a new goog.structs.Map (the key name is kept the same)
 *
 * @param {Function} f The function to call for every key value pair. This
 *                     function takes 3 arguments (the value, the key and the
 *                     goog.structs.Map) and should return something. The
 *                     result will be inserted will be used as the value in the
 *                     new goog.structs.Map.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @returns {Array} A new goog.structs.Map with the old keys and new values.
 */
goog.structs.Map.prototype.map = function(f, opt_obj) {
  var rv = new goog.structs.Map;
  var cleanedKey, val;
  for (var key in this.map_) {
    if (key.charAt(0) == ':') {
      cleanedKey = key.substr(1);
      val = this.map_[key];
      rv.put(cleanedKey, f.call(opt_obj, val, cleanedKey, this));
    }
  }
  return rv;
};


/**
 * Go through all key value pairs in the goog.structs.Map. Call f for all these
 * and if any of them returns true this returns true (without checking the
 * rest). If all returns false this will return false.
 *
 * @param {Function} f The function to call for every key value pair. This
 *                     function takes 3 arguments (the value, the key and the
 *                     goog.structs.Map) and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @returns {Boolean} true if any key value pair passes the test
 */
goog.structs.Map.prototype.some = function(f, opt_obj) {
  for (var key in this.map_) {
    if (key.charAt(0) == ':' &&
        f.call(opt_obj, this.map_[key], key.substr(1), this)) {
      return true;
    }
  }
  return false;
};


/**
 * Go through all key value pairs in the goog.structs.Map. Call f for all these
 * and if all of them returns true this returns true. If any returns false it
 * will return false at this point and not continue to check the remaining
 * key value pairs.
 *
 * @param {Function} f The function to call for every key value pair. This
 *                     function takes 3 arguments (the value, the key and the
 *                     goog.structs.Map) and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @returns {Boolean} true if all key value pair passes the test
 */
goog.structs.Map.prototype.every = function(f, opt_obj) {
  for (var key in this.map_) {
    if (key.charAt(0) == ':' &&
        !f.call(opt_obj, this.map_[key], key.substr(1), this)) {
      return false;
    }
  }
  return true;
};


/**
 * Whether the array contains the given object
 * @param {Array} arr The array to test if the element is contained within
 * @param {Object} obj The object to test for
 * @returns {Boolean} true if present, false otherwise
 */
goog.structs.Map.prototype.contains = function(obj) {
  return this.containsValue(obj);
};