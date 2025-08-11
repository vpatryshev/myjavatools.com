// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Utilities for manipulating objects/maps/hashes.
 * @author pupius@google.com (Daniel Pupius)
 * @author arv@google.com (Erik Arvidsson)
 */

// NOTE(arv): This does not use hasOwnProperty because some (not so) old
//            browsers failed to implement ECMAScript. Also that would prevent
//            us from using 'hasOwnProperty' as a key


/**
 * Namespace for object utilities
 */
goog.provide('goog.object');


/**
 * For each element in an object/map/hash call a function on it.
 *
 * @param {Object} obj The object to iterate over
 * @param {Function} f The function to call for every element. This function
 *                     takes 3 arguments (the element, the index and the object)
 *                     and the return value is irrelevant.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 */
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};


/**
 * For every element in an object/map/hash call a function and if that returns
 * true add the element to a new object.
 *
 * @param {Object} obj The object to iterate over
 * @param {Function} f The function to call for every element. This function
 *                     takes 3 arguments (the element, the index and the object)
 *                     and should return a Boolean. If the return value is true
 *                     the element is added to the result object. If it is false
 *                     the element is not included.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @return {Object} a new object where only elements that passed the test are
 *                 present
 */
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key];
    }
  }
  return res;
};


/**
 * For every element in the object/map/hash call a function and insert the
 * result into a new object.
 *
 * @param {Object} obj The object to iterate over
 * @param {Function} f The function to call for every element. This function
 *                     takes 3 arguments (the element, the index and the object)
 *                     and should return something. The result will be inserted
 *                     into a new object.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @return {Object} a new object with the results from f
 */
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
};


/**
 * Go through all elements in the object/map/hash. Call f for all these and if
 * any of them returns true this returns true (without checking the rest). If
 * all returns false this will return false.
 *
 * @param {Object} obj The object to check
 * @param {Function} f The function to call for every element.This function
 *                     takes 3 arguments (the element, the index and the object)
 *                     and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @return {Boolean} true if any element passes the test
 */
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return true;
    }
  }
  return false;
};


/**
 * Go through all elements in the object/map/hash. Call f for all these and if
 * all of them returns true this returns true. If any returns false it will
 * return false at this point and not continue to check the remaining elements.
 *
 * @param {Object} obj The object to check
 * @param {Function} f The function to call for every element.This function
 *                     takes 3 arguments (the element, the index and the object)
 *                     and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @return {Boolean} false if any element fails the test
 */
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return false;
    }
  }
  return true;
};


/**
 * The number of key value pairs in the object map
 * @param {Object} obj The object to get the numbers of key-value-pairs
 * @return {Number}
 */
goog.object.getCount = function(obj) {
  // JS1.5 has __count__ but it has been depreciated so it raises a warning...
  // in other words do not use. Also __count__ only includes the fields on the
  // actual object and not in the prototype chain.
  var rv = 0;
  for (var key in obj) {
    rv++;
  }
  return rv;
};


/**
 * Whether the object/hash/map contains the given object
 * @param {Object} obj The object to test if the element is contained within
 * @param {Object} val The object to test for
 * @return {Boolean} true if present, false otherwise
 */
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};


/**
 * This returns the values of the object/map/hash
 * @param {Object} obj The object to get the values for
 * @return {Array} the values in the object/map/hash
 */
goog.object.getValues = function(obj) {
  var res = [];
  for (var key in obj) {
    res.push(obj[key]);
  }
  return res;
};


/**
 * This returns the keys of the object/map/hash
 * @param {Object} obj The object to get the keys for
 * @return {Array} Array of String values
 */
goog.object.getKeys = function(obj) {
  var res = [];
  for (var key in obj) {
    res.push(key);
  }
  return res;
};


/**
 * Whether the object/map/hash contains the given key
 * @param {Object} obj The object to check the key for
 * @param {String} key The key to check for
 * @return {Boolean} true if the map contains the key
 */
goog.object.containsKey = function(obj, key) {
  return key in obj;
};


/**
 * Whether the object/map/hash contains the given value. This is O(n)
 * @param {Object} obj The object to check if it contains the value
 * @param {Object} val The value to check for.
 * @return {Boolean} true if the map contains the value
 */
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
};


/**
 * Whether the object/map/hash is empty
 * @param {Object} obj The object to test whether it is empty
 * @return {Boolean} true if empty
 */
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};


/**
 * Removes all key value pairs from the object/map/hash
 * @param {Object} obj The object to clear
 */
goog.object.clear = function(obj) {
  // Some versions of IE has problems if we delete keys from the beginning
  var keys = goog.object.getKeys(obj);
  for (var i = keys.length - 1; i >= 0; i--) {
    goog.object.remove(obj, keys[i]);
  }
};


/**
 * Removes a key value pair based on the key
 * @param {Object} obj The object to remove the key from
 * @param {String} key The key to remove
 * @return {Boolean} True if an element was removed
 */
goog.object.remove = function(obj, key) {
  var rv;
  if ((rv = key in obj)) {
    delete obj[key];
  }
  return rv;
};


/**
 * Adds a key value pair to the object. This throws an exception if the key is
 * already in use. Use set if you want to change an existing pair
 * @param {Object} obj The object
 * @param {String} key The key to add
 * @param {Object} val The value to add
 */
goog.object.add = function(obj, key, val) {
  if (key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};


/**
 * Returns the value for the given key
 * @param {Object} obj The object to get the value for
 * @param {String} key The key to get the value for
 * @param {Object} opt_val The value to return if no item is found for the
 *                         given key
 * @return {Object} the value for the given key
 */
goog.object.get = function(obj, key, opt_val) {
  if (key in obj) {
    return obj[key];
  }
  return opt_val;
};

/**
 * Adds a key value pair to the object/map/hash
 * @param {Object} obj The object to add the key value pair to
 * @param {String} key The key
 * @param {Object} value The value to add
 */
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};


/**
 * Does a flat clone of the object
 * @param {Object} obj Object to clone
 * @return {Object} Clone of the input object
 */
goog.object.clone = function(obj) {
  // we canot use the prototype trick because a lot of methods depend on where
  // the actual key is set.

  var res = {};
  for (var key in obj) {
    res[key] = obj[key];
  }
  return res;
  // we could also use goog.mixin but I wanted this to be independent from that
};
