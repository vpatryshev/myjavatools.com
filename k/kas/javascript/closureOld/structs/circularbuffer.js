// Copyright 2006 Google Inc.
// All Rights Reserved.


/**
 * @fileoverview Datastructure: Circular Buffer
 *
 * Implements a buffer with a maximum size. New entries override the oldest
 * entries when the maximum size has been reached.
 *
 * @author Jon Perlow (jonp@google.com)
 */


goog.provide('goog.structs.CircularBuffer');


/**
 * Class for CircularBuffer
 * @param {Number} opt_maxSize The maximum size of the buffer
 * @constructor
 */
goog.structs.CircularBuffer = function(opt_maxSize) {
  /**
   * Maximum size of the the circular array structure
   * @type Number
   * @private
   */
  this.maxSize_ = opt_maxSize || 100;

  /**
   * Underlying array for the CircularBuffer
   * @type Array
   * @private
   */
  this.buff_ = [];
};


/**
 * Index of the the most recent element in the circular array structure
 * @type Number
 * @private
 */
goog.structs.CircularBuffer.prototype.lastPtr_ = 0;


/**
 * Adds an item to the buffer. May remove the oldest item if the buffer is at
 * max size.
 * @param {Object} item   The item to add.
 */
goog.structs.CircularBuffer.prototype.add = function(item) {
  this.buff_[this.lastPtr_] = item;
  this.lastPtr_ = (this.lastPtr_ + 1) % this.maxSize_;
};


/**
 * Returns the item at the specified index.
 * @param {Number} index  The index of the item. The index of an item can change
 *                        after calls to add if the buffer is at maximum size.
 */
goog.structs.CircularBuffer.prototype.get = function(index) {
  index = this.normalizeIndex_(index);
  return this.buff_[index];
};


/**
 * Sets the item at the specified index.
 * @param {Number} index  The index of the item. The index of an item can change
 *                        after calls to add if the buffer is at maximum size.
 * @param {Object} item   The item to add.
 */
goog.structs.CircularBuffer.prototype.set = function(index, item) {
  index = this.normalizeIndex_(index);
  this.buff_[index] = item;
};


/**
 * Returns the current number of items in the buffer.
 * @return {Number} the current number of items in the buffer.
 */
goog.structs.CircularBuffer.prototype.getCount = function() {
  return this.buff_.length;
};


/**
 * Whether the buffer is empty
 * @return {Boolean}
 */
goog.structs.CircularBuffer.prototype.isEmpty = function() {
  return this.buff_.length == 0;
};


/**
 * Empties the current buffer
 */
goog.structs.CircularBuffer.prototype.clear = function() {
  this.buff_.length = 0;
  this.lastPtr_ = 0;
};


/**
 * Returns the values in the buffer
 * @return {Array}
 */
goog.structs.CircularBuffer.prototype.getValues = function() {
  var l = this.getCount();
  var rv = new Array(l);
  for (var i = 0; i < l; i++) {
    rv[i] = this.get(i);
  }
  return rv;
};


/**
 * Returns the indexes in the buffer
 * @return {Array}
 */
goog.structs.CircularBuffer.prototype.getKeys = function() {
  var rv = [];
  var l = this.getCount();
  for (var i = 0; i < l; i++) {
    rv[i] = i;
  }
  return rv;
};


/**
 * Whether the buffer contains the key/index
 * @param {String} key The key/index to check for
 * @return {Boolean}
 */
goog.structs.CircularBuffer.prototype.containsKey = function(key) {
  return key < this.getCount();
};


/**
 * Whether the buffer contains the given value
 * @param {Object} value The value to check for
 * @return {Boolean}
 */
goog.structs.CircularBuffer.prototype.containsValue = function(value) {
  var l = this.getCount();
  for (var i = 0; i < l; i++) {
    if (this.get(i) == value) {
      return true;
    }
  }
  return false;
};


/**
 * Returns the last item inserted into the buffer.
 * @return {Object} The last item inserted into the buffer.
 */
goog.structs.CircularBuffer.prototype.getLast = function() {
  if (this.getCount() == 0) {
    return null;
  }
  return this.get(this.getCount() - 1);
};


/**
 * Helper function to convert an index in the number space of oldest to most
 * newest items in the array to the position that the element will be in the
 * underlying array.
 */
goog.structs.CircularBuffer.prototype.normalizeIndex_ = function(index) {
  if (index >= this.buff_.length) {
    throw Error('Out of bounds exception');
  }

  if (this.buff_.length < this.maxSize_) {
    return index;
  }

  return (this.lastPtr_ + Number(index)) % this.maxSize_;
};

