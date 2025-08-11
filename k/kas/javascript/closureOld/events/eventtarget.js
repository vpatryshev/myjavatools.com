// Copyright 2005 Google Inc.
// All Rights Reserved

/**
 * @fileoverview Implementation of EventTarget as defined by W3C DOM 2/3
 * @author arv@google.com (Erik Arvidsson) [Original implementation]
 * @author pupius@google.com (Daniel Pupius) [Port to use goog.events]
 */

/**
 * Namespace for events
 */
goog.provide('goog.events.EventTarget');

/**
 * Dependencies
 * @requires goog.events
 */
goog.require('goog.events');
goog.require('goog.events.CustomEvent');


/**
 * This implements the EventTarget interface as defined by W3C DOM 2/3. The
 * main difference from the spec is that the this does not know about event
 * propagation and therefore the flag whether to use bubbling or captureing is
 * not used.<br><br>
 *
 * Another difference is that event objects do not really have to implement
 * the Event interface. An object is treated as an event object if it has a
 * type property.<br><br>
 *
 * It also allows you to pass a string instead of an event object and in that
 * case an event like object is created with the type set to the string value.<br><br>
 *
 * Example usage:
 * <pre>
 *   var et = new goog.events.EventTarget;
 *   function f(e) {
 *      alert("Type: " + e.type + "\nTarget: " + e.target);
 *   }
 *   et.addEventListener("foo", f);
 *   ...
 *   et.dispatchEvent({type: "foo"}); // will call f
 *   // or et.dispatchEvent("foo");
 *   ...
 *   et.removeEventListener("foo", f);
 *
 *  // You can also use the EventHandler interface:
 *  var eh = {
 *    handleEvent: function(e) {
 *      ...
 *    }
 *  };
 *  et.addEventListener("bar", eh);
 * </pre>
 *
 * @constructor
 */
goog.events.EventTarget = function() { };


/**
 * Adds an event listener to the event target. The same handler can only be
 * added once per the type. Even if you add the same handler multiple times
 * using the same type then it will only be called once when the event is
 * dispatched<br><br>
 *
 * Supported for legacy but use goog.events.listen(src, type, handler) instead.
 *
 * @param {String} type The type of the event to listen for
 * @param {Function} handler The function to handle the event. The handler can
 *                           also be an object that implements the handleEvent
 *                           method which takes the event object as argument.
 * @param {Boolean} opt_capture In DOM-compliant browsers, this determines
 *                              whether the listener is fired during the
 *                              capture or bubble phase of the event.
 * @param {Object} opt_handlerScope Object in who's scope to call the listener
 */
goog.events.EventTarget.prototype.addEventListener = function(
    type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope);
};


/**
 * Removes an event listener from the event target. The handler must be the
 * same object as the one added. If the handler has not been added then
 * nothing is done.
 * @param {String} type The type of the event to listen for
 * @param {Function} handler The function to handle the event. The handler can
 *                           can also be an object that implements the
 *                           handleEvent method which takes the event obejct as
 *                           argument.
 * @param {Boolean} opt_capture In DOM-compliant browsers, this determines
 *                              whether the listener is fired during the
 *                              capture or bubble phase of the event.
 * @param {Object} opt_handlerScope Object in who's scope to call the listener
 */
goog.events.EventTarget.prototype.removeEventListener = function(
    type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
};


/**
 * Dispatches an event (or event like object) and calls all listeners
 * listening for events of this type. The type of the event is decided by the
 * type property on the event object.
 *
 * If any of the listeners returns false OR calls preventDefault then this
 * function will return false.  If one of the capture listeners calls
 * stopPropagation, then the bubble listeners won't fire.
 *
 * @param {String|goog.events.CustomEvent|goog.events.Event} e Event object.
 * @returns {Boolean} If anyone called preventDefault on the event object (or
 *                    if any of the handlers returns false this will also
 *                    return false.
 */
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  // If accepting a string, create a custom event object so that preventDefault
  // and stopPropagation work with the event.
  if (goog.isString(e)) {
    e = new goog.events.CustomEvent(e, this);
  } else {
    e.target = e.target || this;
  }

  return goog.events.fireListeners_(this, e.type, true, [e]) &&
         (e.propagationStopped_ ||
           goog.events.fireListeners_(this, e.type, false, [e])) &&
         e.returnValue_ !== false;
};


/**
 * Whether object has been disposed
 * @private
 * @type Boolean
 */
goog.events.EventTarget.prototype.disposed_ = false;


/**
 * Get the disposed property of this object
 * @return {Boolean}
 */
goog.events.EventTarget.prototype.getDisposed = function() {
  return this.disposed_;
};


/**
 * Unattach listeners from this object.  Classes that extend EventTarget may
 * need to override this method in order to remove references to DOM Elements
 * and additional listeners, it should be something like this:
 * <pre>
 * MyClass.prototype.dispose = function() {
 *   if (this.getDisposed()) return;
 *   goog.events.EventTarget.prototype.dispose.call(this);
 *
 *   // Dispose logic for MyClass
 * };
 * </pre>
 */
goog.events.EventTarget.prototype.dispose = function() {
  if (!this.disposed_) {
    goog.events.removeAll(this);
    this.disposed_ = true;
  }
};


/**
 * Used to tell if an event is a real event in goog.events.listen() so we don't
 * get listen() calling addEventListener() and vice-versa
 * @type Boolean
 * @private
 */
goog.events.EventTarget.prototype.customEvent_ = true;

