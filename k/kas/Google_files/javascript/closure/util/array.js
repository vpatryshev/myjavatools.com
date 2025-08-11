// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Utilities for manipulating arrays
 *
 * @author pupius@google.com (Daniel Pupius)
 * @author arv@google.com (Erik Arvidsson)
 */


/**
 * Namespace for array utilities
 */
goog.provide('goog.array');


/**
 * Returns the first index of an element inside an array. This returns -1 if
 * the element is not present in the array
 *
 * See {@link http://tinyurl.com/nga8b}
 *
 * @param {Array} arr An array that we are getting the index from
 * @param {Object} obj The object that we are searching for
 * @param {Number) opt_fromIndex The index to start the search at. If left out
 *                               the searching starts at the beginning.
 */
goog.array.indexOf = function(arr, obj, opt_fromIndex) {
  if (arr.indexOf) {
    return arr.indexOf(obj, opt_fromIndex);
  }
  if (Array.indexOf) {
    return Array.indexOf(arr, obj, opt_fromIndex);
  }

  if (opt_fromIndex == null) {
    opt_fromIndex = 0;
  } else if (opt_fromIndex < 0) {
    opt_fromIndex = Math.max(0, arr.length + opt_fromIndex);
  }
  for (var i = opt_fromIndex; i < arr.length; i++) {
    if (arr[i] === obj)
      return i;
  }
  return -1;
};


/**
 * Returns the last index of an element inside an array. This returns -1 if
 * the element is not present in the array
 *
 * See {@link http://tinyurl.com/ru6lg}
 *
 * @param {Array} arr An array that we are getting the index from
 * @param {Object} obj The object that we are searching for
 * @param {Number) opt_fromIndex The index to start the search at. If left out
 *                               the searching starts at the end.
 */
goog.array.lastIndexOf = function(arr, obj, opt_fromIndex) {
  // if undefined or null are passed then that is treated as 0 which will
  // always return -1;
  if (opt_fromIndex == null) {
    opt_fromIndex = arr.length - 1;
  }
  if (arr.lastIndexOf) {
    return arr.lastIndexOf(obj, opt_fromIndex);
  }
  if (Array.lastIndexOf) {
    return Array.lastIndexOf(arr, obj, opt_fromIndex);
  }

  if (opt_fromIndex < 0) {
    opt_fromIndex = Math.max(0, arr.length + opt_fromIndex);
  }
  for (var i = opt_fromIndex; i >= 0; i--) {
    if (arr[i] === obj)
      return i;
  }
  return -1;
};


/**
 * For each element in an array call a function on it.
 *
 * See {@link http://tinyurl.com/jrvcb}
 *
 * @param {Array} arr The array to iterate over
 * @param {Function} f The function to call for every element.This function
 *                     takes 3 arguments (the element, the index and the array)
 *                     and the return value is irrelevant.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 */
goog.array.forEach = function(arr, f, opt_obj) {
  if (arr.forEach) {
    arr.forEach(f, opt_obj);
  } else if (Array.forEach) {
    Array.forEach(arr, f, opt_obj);
  } else {
    var l = arr.length;  // must be fixed during loop... see docs
    for (var i = 0; i < l; i++) {
      f.call(opt_obj, arr[i], i, arr);
    }
  }
};


/**
 * For every element in an array call a function and if that returns true add
 * the element to a new array.
 *
 * See {@link http://tinyurl.com/rmtuo}
 *
 * @param {Array} arr The array to iterate over
 * @param {Function} f The function to call for every element.This function
 *                     takes 3 arguments (the element, the index and the array)
 *                     and should return a Boolean. If the return value is true
 *                     the element is added to the result array. If it is false
 *                     the element is not included.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @return {Array} a new array where only elements that passed the test are
 *                 present
 */
goog.array.filter = function(arr, f, opt_obj) {
  if (arr.filter) {
    return arr.filter(f, opt_obj);
  }
  if (Array.filter) {
    return Array.filter(arr, f, opt_obj);
  }

  var l = arr.length;  // must be fixed during loop... see docs
  var res = [];
  for (var i = 0; i < l; i++) {
    if (f.call(opt_obj, arr[i], i, arr)) {
      res.push(arr[i]);
    }
  }
  return res;
};


/**
 * For every element in the array call a function and insert the result into a
 * new array.
 *
 * See {@link http://tinyurl.com/hlx5p}
 *
 * @param {Array} arr The array to iterate over
 * @param {Function} f The function to call for every element.This function
 *                     takes 3 arguments (the element, the index and the array)
 *                     and should return something. The result will be inserted
 *                     into a new array.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @return {Array} a new array with the results from f
 */
goog.array.map = function(arr, f, opt_obj) {
  if (arr.map) {
    return arr.map(f, opt_obj);
  }
  if (Array.map) {
    return Array.map(arr, f, opt_obj);
  }

  var l = arr.length;  // must be fixed during loop... see docs
  var res = [];
  for (var i = 0; i < l; i++) {
    res.push(f.call(opt_obj, arr[i], i, arr));
  }
  return res;
};


/**
 * Go through all elements in the array. Call f for all these and if any of
 * them returns true this returns true (without checking the rest). If all
 * returns false this will return false.
 *
 * See {@link http://tinyurl.com/ekkc2}
 *
 * @param {Array} arr The array to check
 * @param {Function} f The function to call for every element.This function
 *                     takes 3 arguments (the element, the index and the array)
 *                     and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @return {Boolean} true if any element passes the test
 */
goog.array.some = function(arr, f, opt_obj) {
  if (arr.some) {
    return arr.some(f, opt_obj);
  }
  if (Array.some) {
    return Array.some(arr, f, opt_obj);
  }

  var l = arr.length;  // must be fixed during loop... see docs
  for (var i = 0; i < l; i++) {
    if (f.call(opt_obj, arr[i], i, arr)) {
      return true;
    }
  }
  return false;
};


/**
 * Go through all elements in the array. Call f for all these and if all of
 * them returns true this returns true. If any returns false it will return
 * false at this point and not continue to check the remaining elements.
 *
 * See {@link http://tinyurl.com/rx3mg}
 *
 * @param {Array} arr The array to check
 * @param {Function} f The function to call for every element.This function
 *                     takes 3 arguments (the element, the index and the array)
 *                     and should return a Boolean.
 * @param {Object} opt_obj This is used as the 'this' object in f when called.
 * @return {Boolean} false if any element fails the test
 */
goog.array.every = function(arr, f, opt_obj) {
  if (arr.every) {
    return arr.every(f, opt_obj);
  }
  if (Array.every) {
    return Array.every(arr, f, opt_obj);
  }

  var l = arr.length;  // must be fixed during loop... see docs
  for (var i = 0; i < l; i++) {
    if (!f.call(opt_obj, arr[i], i, arr)) {
      return false;
    }
  }
  return true;
};


/**
 * Whether the array contains the given object
 * @param {Array} arr The array to test if the element is contained within
 * @param {Object} obj The object to test for
 * @return {Boolean} true if present, false otherwise
 */
goog.array.contains = function(arr, obj) {
  if (arr.contains) {
    return arr.contains(obj);
  }

  return goog.array.indexOf(arr, obj) > -1;
};


/**
 * Inserts an item into an array, if it's not already in the array
 * @param {Array} arr Array to insert value into in
 * @param {Object} obj Value to add
 */
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};


/**
 * Inserts an object at the given index of the array.
 * @param {Array} arr The array to modify
 * @param {Object} obj The object to insert
 * @param {Number} opt_i The index to insert at. If left out treated as 0.
 *                       Negative number is treated from the end of the array
 */
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};


/**
 * Inserts an object before another object
 * @param {Array} arr The array to modify
 * @param {Object} obj The object to insert
 * @param {Object} opt_obj2 The object that obj should be inserted before. If
 *                          left out or not found obj is inserted at the end.
 */
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) == -1) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};


/**
 * Removes the first occurance of a particular value from an array
 * @param {Array} arr Array to remove value from
 * @param {Object} obj Object to remove
 */
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  if (i != -1) {
    goog.array.removeAt(arr, i);
  }
};


/**
 * Removes the element at index i
 * @param {Array} arr Array to remove value from
 * @param {Number} i The index to remove
 */
goog.array.removeAt = function(arr, i) {
  // use generic form of splice
  Array.prototype.splice.call(arr, i, 1);
};


/**
 * Does a flat clone of the array
 * @param {Array} arr Array to clone
 * @return {Array} Clone of the input array
 */
goog.array.clone = function(arr) {
  if (arr.clone) {
    return arr.clone();
  }
  // generic concat does not seem to work so lets just use plain old instance
  // method
  return arr.concat();
};


/**
 * Adds or removes elements from an array. This is a gereric version of Array
 * splice. This means that it might work on other objects similar to arrays,
 * for example the arguments object.
 *
 * @param {Array} arr The array to modify
 * @param {Number} index Where to start changing the array
 * @param {Number} howMany How many elements to remove (0 means no removal. A
 *                         value below 0 is treated as zero and so is any other
 *                         non number. Numbers are floored.)
 * @param {Object} opt_el The element to insert
 * @return {Array} the removed elements
 */
// TODO(arv): varargs instead of opt_el
goog.array.splice = function (arr, index, howMany, opt_el) {
  return Array.prototype.splice.apply(arr, goog.array.slice(arguments, 1));
};

/**
 * Returns a new array from a segment of an array. This is a generic version of
 * Array slice. This means that it might work on other objects similar to
 * arrays, for example the arguments object.
 *
 * @param {Array} arr The array to get parts of
 * @param {Number} start Where to start the extraction
 * @param {Number} opt_end Where to end the extraction
 * @return {Array} Returns a new array containing the parts of the original
 *                 array.
 */
goog.array.slice = function (arr, start, opt_end) {
  // passing 1 arg to slice is not the same as passing 2 where the second is
  // null or undefined (in that case the second argument is treated as 0).
  // we could use slice on the arguments object and then use apply instead of
  // testing the length
  if (arguments.length <= 2) {
    return Array.prototype.slice.call(arr, start);
  } else {
  return Array.prototype.slice.call(arr, start, opt_end);
  }
};

// TODO(arv): remove these once Pinto has migrated
goog.array.find = goog.array.indexOf;
goog.array.insertValue = goog.array.insert;
goog.array.deleteValue = goog.array.remove;
