// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Datastructure: Queue
 *
 * @author ozgur@google.com (Ozgur D. Sahin)
 *
 * This file provides the implementation of a FIFO Queue structure.
 * API is similar to that of com.google.common.collect.IntQueue
 */

// Make sure namespace exists
goog.provide('goog.structs.Queue');


/**
 * Class for FIFO Queue datastructure.
 *
 * @constructor
 */
goog.structs.Queue = function() {
  this.elements_ = [];
};


/**
 * The index of the next element to be removed from the queue.
 * @private
 * @type Number
 */
goog.structs.Queue.prototype.head_ = 0;


/**
 * The index at which the next element would be added to the queue.
 * @private
 * @type Number
 */
goog.structs.Queue.prototype.tail_ = 0;


/**
 * Puts the specified element on this queue.
 * @param {Object} element The element to be added to the queue
 */
goog.structs.Queue.prototype.enqueue = function(element) {
  this.elements_[this.tail_++] = element;
};


/**
 * Retrieves and removes the head of this queue.
 * @return {Object} the element at the head of this queue. Returns 
 * undefined if the queue is empty.
 */
goog.structs.Queue.prototype.dequeue = function() {
  if (this.head_ == this.tail_) {
    return undefined;
  }
  var result = this.elements_[this.head_];
  delete this.elements_[this.head_];
  this.head_++;
  return result;
};


/**
 * Retrieves but does not remove the head of this queue.
 * @return {Object} the element at the head of this queue. Returns 
 * undefined if the queue is empty.
 */
goog.structs.Queue.prototype.peek = function() {
  if (this.head_ == this.tail_) {
    return undefined;
  }
  return this.elements_[this.head_];
};


/**
 * Returns the number of elements in this queue.
 * @return {Number} the number of elements in this queue.
 */
goog.structs.Queue.prototype.getCount = function() {
  return this.tail_ - this.head_;
};


/**
 * Returns true if this queue contains no elements.
 * @return {Boolean} true if this queue contains no elelements.
 */
goog.structs.Queue.prototype.isEmpty = function() {
  return this.tail_ - this.head_ == 0;
};


/**
 * Removes all elements from the queue.
 */
goog.structs.Queue.prototype.clear = function() {
  this.elements_ = [];
  this.head_ = 0;
  this.tail_ = 0;
};
