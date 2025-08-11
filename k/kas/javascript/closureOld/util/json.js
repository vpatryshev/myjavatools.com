// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview JSON utility functions
 * @author arv@google.com (Erik Arvidsson)
 */

/**
 * Namespace for user agent
 */
goog.provide('goog.json');


/**
 * Tests if a string is an invalid JSON string. This only ensures that we are
 * not using any invalid characters
 * @param {String} s The string to test
 * @return {Boolean}
 */
goog.json.isValid_ = function(s) {
  // Note(arv): I tried other solutions to this (more strict checking, one
  // regexp, loop over chars). The one used at json.org does not correctly
  // work on strings

  if (s == '') {
    return false;
  }

  // remove strings
  s = s.replace(/"(\\.|[^"\\])*"/g, '');

  // If only a string it is valid. Otherwise check for non valid character
  return s == '' || !/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(s);
};


/**
 * Parses a JSON string and returns the result. This throws an exception if
 * the string is an invalid JSON string.
 *
 * If the user agent has built in support for parsing JSON (using
 * <code>String.prototype.toJSON</code>) that will be used.
 *
 * @param {String} s The JSON string to parse
 * @return {Object}
 */
goog.json.parse = function(s) {
  s = String(s);
  if (typeof s.parseJSON == 'function') {
    return s.parseJSON();
  }
  if (goog.json.isValid_(s)) {
    try {
      return eval('(' + s + ')');
    } catch (ex) {
    }
  }
  throw Error('Invalid JSON string: ' + s);
};


/**
 * Serializes an object or a value to a JSON string.
 *
 * If the user agent has built in support for serializing JSON (using
 * <code>Object.prototype.toJSONString</code>) that will be used.
 *
 * @param {Object} object The object to serialize
 * @return {String}
 */
goog.json.serialize = function(object) {
  // null and undefined cannot have properties. (null == undefined)
  if (object != null && typeof object.toJSONString == 'function') {
    return object.toJSONString();
  }
  var sb = [];
  goog.json.serialize_(object, sb);
  return sb.join('');
};


/**
 * Serializes a generic value to a JSON string
 * @private
 * @param {Object} object
 * @param {Array} sb Array used as a string builder
 */
goog.json.serialize_ = function(object, sb) {
  switch (typeof object) {
    case 'string':
      goog.json.serializeString_(object, sb);
      break;
    case 'number':
      goog.json.serializeNumber_(object, sb);
      break ;
    case 'boolean':
      sb.push(object);
      break;
    case 'undefined':
      sb.push('null');
      break;
    case 'object':
      if (object == null) {
        sb.push('null');
        break;
      }
      if (goog.isArray(object)) {
        goog.json.serializeArray_(object, sb);
        break;
      }
      // should we allow new String, new Number and new Boolean to be treated
      // as string, number and boolean? Most implementations do not and the
      // need is not very big
      goog.json.serializeObject_(object, sb);
      break;
    default:
      throw Error('Unknown type: ' + typeof object);
  }
};

/**
 * Character mappings used internally for goog.string.quote
 * @private
 * @type Object
 */
goog.json.charToJsonCharCache_ = {
  '\"': '\\"',
  '\\': '\\\\',
  '/': '\\/',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',

  '\x0B': '\\u000b' // '\v' is not supported in JScript
};


/**
 * Serializes a string to a JSON string
 * @private
 * @param {String} s The string to serialize
 * @param {Array} sb Array used as a string builder
 */
goog.json.serializeString_ = function(s, sb) {
  // The official JSON implementation does not work with international
  // characters.
  sb.push('"', s.replace(/[\\\"\x00-\x1f\x80-\uffff]/g, function(c) {
    // caching the result improves performance by a factor 2-3
    if (c in goog.json.charToJsonCharCache_) {
      return goog.json.charToJsonCharCache_[c];
    }

    var cc = c.charCodeAt(0);
    var rv = '\\u';
    if (cc < 16) {
      rv += '000';
    } else if (cc < 256) {
      rv += '00';
    } else if (cc < 4096) { // \u1000
      rv += '0';
    }
    return goog.json.charToJsonCharCache_[c] = rv + cc.toString(16);
  }), '"');
};


/**
 * Serializes a number to a JSON string
 * @private
 * @param {Number} n The number to serialize
 * @param {Array} sb Array used as a string builder
 */
goog.json.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? n : 'null');
};


/**
 * Serializes an array to a JSON string
 * @private
 * @param {Array} arr The array to serialize
 * @param {Array} sb Array used as a string builder
 */
goog.json.serializeArray_ = function(arr, sb) {
  var l = arr.length;
  sb.push('[');
  var sep = '';
  for (var i = 0; i < l; i++) {
    sb.push(sep)
    goog.json.serialize_(arr[i], sb);
    sep = ',';
  }
  sb.push(']');
};


/**
 * Serializes an object to a JSON string
 * @private
 * @param {Object} obj The object to serialize
 * @param {Array} sb Array used as a string builder
 */
goog.json.serializeObject_ = function(obj, sb) {
  sb.push('{');
  var sep = '';
  for (var key in obj) {
    sb.push(sep);
    goog.json.serializeString_(key, sb);
    sb.push(':');
    goog.json.serialize_(obj[key], sb);
    sep = ',';
  }
  sb.push('}');
};
