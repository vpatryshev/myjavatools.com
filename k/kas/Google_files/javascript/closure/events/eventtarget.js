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
 * @returns {Void}
 */
goog.events.EventTarget.prototype.addEventListener = function(type, handler) {
  goog.events.listen(this, type, handler);
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
 * @returns {Void}
 */
goog.events.EventTarget.prototype.removeEventListener = function(type, 
                                                                 handler) {
  goog.events.unlisten(this, type, handler);
};


/**
 * Dispatches an event (or event like object) and calls all listeners
 * listening for events of this type. The type of the event is decided by the
 * type property on the event object.
 * @param {Mixed} e Event object (requires a type property). If this is a string 
 *                  we create a new event object with that type.
 * @returns {Boolean} If anyone called preventDefault on the event object (or
 *                    if any of the handlers returns false this will also
 *                    return false.
 */
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  if (goog.isString(e)) {
    e = { type: e };
  }
  
  return goog.events.fireListeners_(this, e.type, false, [e]);
};


/**
 * Whether there are any event listeners added of the given type
 * @param {String} type The type of the event listener to check for
 * @returns {Boolean}
 */
goog.events.EventTarget.prototype.hasEventListener = function(type) {
  return goog.events.getListeners(this, type).length != 0;
};


/**
 * Used to tell if an event is a real event in goog.events.listen() so we don't
 * get listen() calling addEventListener() and vice-versa
 * @type Boolean
 * @private
 */
goog.events.EventTarget.prototype.customEvent_ = true;

