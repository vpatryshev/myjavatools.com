// Copyright 2005 Google Inc.
// All Rights Reserved

/**
 * @fileoverview Class to create objects which want to handle multiple events
 * and have their listeners easily cleaned up via a dispose method
 *
 * Example:
 * <pre>
 * function Something() {
 *   goog.events.EventHandler.call(this);
 *
 *   ... set up object ...
 *
 *   // Add event listeners
 *   this.listen(this.starEl, 'click', this.handleStar);
 *   this.listen(this.headerEl, 'click', this.expand);
 *   this.listen(this.collapseEl, 'click', this.collapse);
 *   this.listen(this.infoEl, 'mouseover', this.showHover);
 *   this.listen(this.infoEl, 'mouseout', this.hideHover);
 * }
 * Something.inherits(goog.events.EventHandler);
 *
 * Something.prototype.dispose = function() {
 *   goog.events.EventHandler.prototype.dispose.call(this);
 *   goog.dom.removeNode(this.container);
 * };
 *
 *
 * // Then elsewhere:
 *
 * var activeSomething = null;
 * function openSomething() {
 *   activeSomething = new Something();
 * }
 *
 * function closeSomething() {
 *   if (activeSomething) {
 *     activeSomething.dispose();  // Remove event listeners
 *     activeSomething = null;
 *   }
 * }
 * </pre>
 *
 * @author Daniel Pupius (pupius@google.com)
 */

goog.provide('goog.events.EventHandler');

goog.require('goog.events');
goog.require('goog.object');


/**
 * Super class for objects that want to easily manage a number of event
 * listeners.  It allows a short cut to listen and also provides a quick way
 * to remove all events listeners belonging to this object.
 * @param {Object} opt_handler Object in who's scope to call the listeners
 * @constructor
 */
goog.events.EventHandler = function(opt_handler) {
  this.keys_ = {};
  this.handler_ = opt_handler;
};


/**
 * Listen to an event on a DOM node or EventTarget.  If the function is ommitted
 * then the EventHandler's handleEvent method will be used.
 * @param {goog.events.EventTarget|Element} src Event source
 * @param {String} type Event type to listen for
 * @param {Function} opt_fn Optional function to be used as the listener
 * @param {Boolean} opt_capture Optional whether to use capture phase
 * @param {Object} opt_handler Object in who's scope to call the listener
 */
goog.events.EventHandler.prototype.listen = function(src, type, opt_fn,
                                                     opt_capture,
                                                     opt_handler) {
  var key = goog.events.listen(src, type,opt_fn || this,
                               opt_capture || false,
                               opt_handler || this.handler_ || this);
  this.keys_[key] = true;
};


/**
 * Unlisten on an event
 * @param {goog.events.EventTarget|Element} src Event source
 * @param {String} type Event type to listen for
 * @param {Function} opt_fn Optional function to be used as the listener
 * @param {Boolean} opt_capture Optional whether to use capture phase
 * @param {Object} opt_handler Object in who's scope to call the listener
 */
goog.events.EventHandler.prototype.unlisten = function(src, type, opt_fn,
                                                       opt_capture,
                                                       opt_handler) {

  var key = goog.events.createKey_(src, type, opt_fn || this,
                                   opt_capture || false,
                                   opt_handler || this.handler_ || this);

  goog.events.unlistenByKey(key);
  goog.object.remove(this.keys_, key);
};


/**
 * Whether object has been disposed
 * @private
 * @type Boolean
 */
goog.events.EventHandler.prototype.disposed_ = false;


/**
 * Get the disposed property of this object
 * @return {Boolean}
 */
goog.events.EventHandler.prototype.getDisposed = function() {
  return this.disposed_;
};


/**
 * Dispose of this EventHandler and remove all listeners that it registered.
 */
goog.events.EventHandler.prototype.dispose = function() {
  if (!this.disposed_) {
    this.disposed_ = true;
    goog.object.forEach(this.keys_, function(value, key) {
      goog.events.unlistenByKey(key);
    });
    this.handler_ = null;
  }
};


/**
 * Default event handler
 * @param {goog.events.Event} e Event object
 */
goog.events.EventHandler.prototype.handleEvent = function(e) {
  throw Error('EventHandler.handleEvent not impemented');
};
