// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Generics method for collection like classes and objects
 *
 * @author arv@google.com (Erik Arvidsson)
 *
 * This file contains functions to work with collections. It supports using
 * Map, Set, Array and Object and other classes that implement collection like
 * methods.
 *
 */


goog.provide('goog.structs');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.structs.Map');
goog.require('goog.structs.Set');


// it is a dictionary if it has getKeys or it is an object that isn't arrayLike


/**
 * The number of key value pairs in the map
 * @param {Object} col The collection like object
 * @return {Number}
 */
goog.structs.getCount = function(col) {
  if (typeof col.getCount == 'function') {
    return col.getCount();
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return col.length;
  }
  return goog.object.getCount(col);
};


/**
 * This returns the values of the map
 * @param {Object} col The collection like object
 * @return {Array} the values in the map
 */
goog.structs.getValues = function(col) {
  if (typeof col.getValues == 'function') {
    return col.getValues();
  }
  if (goog.isString(col)) {
    return col.split('');
  }
  if (goog.isArrayLike(col)) {
    var rv = [];
    var l = col.length;
    for (var i = 0; i < l; i++) {
      rv.push(col[i]);
    }
    return rv;
  }
  return goog.object.getValues(col);
};


/**
 * This returns the keys of the collection. Some collection has no notion of
 * keys/indexes and this will return undefined in those cases
 * @param {Object} col The collection like object
 * @return {Array} the keys in the collection
 */
goog.structs.getKeys = function(col) {
  if (typeof col.getKeys == 'function') {
    return col.getKeys();
  }
  // if we have getValues but no getKeys we know this is a key-less collection
  if (typeof col.getValues == 'function') {
    return undefined;
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    var rv = [];
    var l = col.length;
    for (var i = 0; i < l; i++) {
      rv.push(i);
    }
    return rv;
  }

  return goog.object.getKeys(col);
};


/**
 * Whether the collection contains the given value. This is O(n) and uses
 * equals (==) to test the existance
 * @param {Object} col The collection like object
 * @param {Object} val The value to check for.
 * @return {Boolean} true if the map contains the value
 */
goog.structs.contains = function(col, val) {
  if (typeof col.contains == 'function') {
    return col.contains(val);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.contains(col, val);
  }
  return goog.object.containsValue(col, val);
};


/**
 * Whether the collection is empty
 * @param {Object} col The collection like object
 * @return {Boolean} true if empty
 */
goog.structs.isEmpty = function(col) {
  if (typeof col.isEmpty == 'function') {
    return col.isEmpty();
  }

  // We do not use goog.string.isEmpty because here we treat the string as
  // collection and as such even whitespace matters

  if (goog.isArrayLike(col)|| goog.isString(col)) {
    return goog.array.isEmpty(col);
  }
  return goog.object.isEmpty(col);
};


/**
 * Removes all the elements from the collection
 * @param {Object} col The collection like object
 */
goog.structs.clear = function(col) {
  // NOTE(arv): This should not contain strings because strings are immutable
  if (typeof col.clear == 'function') {
    col.clear();
  } else if (goog.isArrayLike(col)) {
    goog.array.clear(col);
  } else {
    goog.object.clear(col);
  }
};


/**
 * For each value in the collection call a function on it. The function takes
 * three arguments; the value, the key and the collection
 *
 * @param {Object} col The collection like object
 * @param {Function} f The function to call for every value. This
 *                     function takes 3 arguments (the value, undefined and the
 *                     collection) and the return value is irrelevant.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 */
goog.structs.forEach = function(col, f, opt_obj) {
  if (typeof col.forEach == 'function') {
    col.forEach(f, opt_obj);
  } else if (goog.isArrayLike(col) || goog.isString(col)) {
    goog.array.forEach(col, f, opt_obj);
  } else {
    var keys = goog.structs.getKeys(col);
    var values = goog.structs.getValues(col);
    var l = values.length;
    for (var i = 0; i < l; i++) {
      f.call(opt_obj, values[i], keys && keys[i], col);
    }
  }
};


/**
 * For every value in the collection call a function and if that returns true
 * add the value to a new collection (Array is returned by default
 *
 * @param {Object} col The collection like object
 * @param {Function} f The function to call for every value. This function
 *                     takes 3 arguments (the value, null and the
 *                     goog.structs.Set) and should return a Boolean. If the
 *                     return value is true the value is added to the result
 *                     goog.structs.Set. If it is false the value is not
 *                     included.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @param {Function} opt_constr If provided this function is used as the
 *                              constructor for the returned collection.
 * @returns {Array} A new collection where the passed values are present.
 */
goog.structs.filter = function(col, f, opt_obj, opt_constr) {
  if (typeof col.filter == 'function') {
    return col.filter(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(col, f, opt_obj);
  }

  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if (keys && goog.structs.Map) {
    rv = new (opt_constr || Object);
    for (var i = 0; i < l; i++) {
      if (f.call(opt_obj, values[i], keys[i], col)) {
        goog.structs.Map.set(rv, keys[i], values[i]);
      }
    }
  } else if (goog.structs.Set) {
    rv = new (opt_constr || Array);
    for (var i = 0; i < l; i++) {
      if (f.call(opt_obj, values[i], undefined, col)) {
        goog.structs.Set.add(rv, values[i]);
      }
    }
  }
  return rv;
};


/**
 * For every value in the collection call a function and add the result into a
 * new collection (defaults to creating a new Array).
 *
 * @param {Object} col The collection like object
 * @param {Function} f The function to call for every value. This function
 *                     takes 3 arguments (the value, undefined and the
 *                     collection) and should return something. The result will
 *                     be used as the value in the new collection.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @param {Function} opt_constr If provided this function is used as the
 *                              constructor for the returned collection.
 * @returns {Array} A new collection with the new values.
 */
goog.structs.map = function(col, f, opt_obj, opt_constr) {
  if (typeof col.map == 'function') {
    return col.map(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map(col, f, opt_obj);
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if (keys && goog.structs.Map) {
    rv = new (opt_constr || Object);
    for (var i = 0; i < l; i++) {
      goog.structs.Map.set(rv,
                           keys[i],
                           f.call(opt_obj, values[i], keys[i], col));
    }
  } else if (goog.structs.Set){
    rv = new (opt_constr || Array);
    for (var i = 0; i < l; i++) {
      goog.structs.Set.add(rv,
                           keys[i],
                           f.call(opt_obj, values[i], undefined, col));
    }
  }
  return rv;
};


/**
 * Go through all the values in the collection. Call f for all these and if any
 * of them returns true this returns true (without checking the rest). If all
 * returns false this will return false.
 *
 * @param {Object} col The collection like object
 * @param {Function} f The function to call for every value. This
 *                     function takes 3 arguments (the value, undefined and the
 *                     collection) and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @returns {Boolean} true if any value passes the test
 */
goog.structs.some = function(col, f, opt_obj) {
  if (typeof col.some == 'function') {
    return col.some(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(col, f, opt_obj);
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0; i < l; i++) {
    if (f.call(opt_obj, values[i], keys && keys[i], col)) {
      return true;
    }
  }
  return false;
};


/**
 * Go through all the values in the collection. Call f for all these and if all
 * of them returns true this returns true. If any returns false it will return
 * false at this point and not continue to check the remaining values.
 *
 * @param {Object} col The collection like object
 * @param {Function} f The function to call for every value. This function
 *                     takes 3 arguments (the value, undefined and the
 *                     collection) and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @returns {Boolean} true if all key value pair passes the test
 */
goog.structs.every = function(col, f, opt_obj) {
  if (typeof col.every == 'function') {
    return col.every(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(col, f, opt_obj);
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0; i < l; i++) {
    if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return false;
    }
  }
  return true;
};
