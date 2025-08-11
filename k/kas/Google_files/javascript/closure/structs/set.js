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

goog.require('goog.structs.Map');
goog.require('goog.array'); // forEach


/**
 * Class for Set datastructure
 *
 * @constructor
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
 * @type Number
 */
goog.structs.Set.prototype.count = 0;


/**
 * Add an object to the set
 * @param {Object} obj The object to add
 * @return {Boolean} true if the object was not already in the set
 */
goog.structs.Set.prototype.add = function(obj) {
  var c = this.count;
  this.map_.put(goog.structs.Set.getKey_(obj), obj);
  this.count = this.map_.count;
  return c != this.count;
};


/**
 * Adds all objects from one goog.structs.Set to the current one. This one can'
 * take an array as well.
 * @param {Object} set The set or array to add objects from
 * @return {Boolean} true if the set changed due to the call
 */
goog.structs.Set.prototype.addAll = function(set) {
  var c = this.count;
  goog.array.forEach(set, function(obj) {
    this.add(obj);
  }, this);
  this.count = this.map_.count;
  return c != this.count;
};


/**
 * Removes an object from the set
 * @param {Object} obj The object to remove
 * @return {Boolean} true if the set contained the object
 */
goog.structs.Set.prototype.remove = function(obj) {
  var c = this.count;
  this.map_.remove(goog.structs.Set.getKey_(obj));
  this.count = this.map_.count;
  return c != this.count;
};


/**
 * Removes all objects from the set
 * @return {Boolean} true if the set changed due to the call
 */
goog.structs.Set.prototype.clear = function() {
  var c = this.count;
  this.map_.clear();
  this.count = this.map_.count;
  return c != this.count;
};


/**
 * Removes all objects from the set
 * @return {Boolean} true if there are no objects in the goog.structs.Set
 */
goog.structs.Set.prototype.isEmpty = function() {
  return this.count == 0;
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
goog.structs.Set.prototype.toArray = function() {
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
 * For each value the set call a function on it. The function takes
 * three arguments; the value, null and the map (null is used as second
 * argument to be consistent with Array map and goog.structs.Map map
 *
 * @param {Function} f The function to call for every value. This
 *                     function takes 3 arguments (the value, null and the
 *                     goog.structs.Set) and the return value is irrelevant.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 */
goog.structs.Set.prototype.forEach = function(f, opt_obj) {
    this.map_.forEach(function(val, key, map) {
      f.call(opt_obj, val, null, this);
    }, this);
};


/**
 * For every value in the set call a function and if that returns true
 * add the value to a new goog.structs.Set.
 *
 * @param {Function} f The function to call for every value. This function
 *                     takes 3 arguments (the value, null and the
 *                     goog.structs.Set) and should return a Boolean. If the
 *                     return value is true the value is added to the result
 *                     goog.structs.Set. If it is false the value is not
 *                     included.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @returns {goog.structs.Set} A new goog.structs.Set where the passed values
 *                             are present/
 */
goog.structs.Set.prototype.filter = function(f, opt_obj) {
  var s = new goog.structs.Set;
  this.map_.forEach(function(val, key, map) {
    if (f.call(opt_obj, val, null, this)) {
      s.add(val);
    }
  }, this);
  return s;
};


/**
 * Go through all values in the goog.structs.Set. Call f for all these
 * and if any of them returns true this returns true (without checking the
 * rest). If all returns false this will return false.
 *
 * @param {Function} f The function to call for every value. This function
 *                     takes 3 arguments (the value, null and the
 *                     goog.structs.Set) and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @returns {Boolean} true if any value passes the test
 */
goog.structs.Set.prototype.some = function(f, opt_obj) {
  return this.map_.some(function (val, key, map) {
    return f.call(opt_obj, val, null, this);
  }, this);
};


/**
 * Go through all values in the goog.structs.Set. Call f for all these and if
 * all of them returns true this returns true. If any returns false it will
 * return false at this point and not continue to check the remaining values.
 *
 * @param {Function} f The function to call for every value. This function
 *                     takes 3 arguments (the value, null and the
 *                     goog.structs.Set) and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @returns {Boolean} true if all values passes the test
 */
goog.structs.Set.prototype.every = function(f, opt_obj) {
  return this.map_.every(function (val, key, map) {
    return f.call(opt_obj, val, null, this);
  }, this);
};