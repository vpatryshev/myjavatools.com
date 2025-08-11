// Copyright 2005 Google Inc.
// All Rights Reserved

/**
 * @fileoverview Listener object
 * @author pupius@google.com (Daniel Pupius)
 */

/**
 * Namespace for events
 */
goog.provide('goog.events.Listener');

/**
 * Simple class that stores information about a listener
 * @param {Function} listener Callback function
 * @param {Function} proxy Wrapper for the listener that patches the event
 * @param {Object} src Source object for the event
 * @param {String} type Event type
 * @param {Boolean} capture Whether in capture or bubble phase
 * @param {Object} handler Object in who's context to execute the callback
 * @constructor
 */
goog.events.Listener = function(listener, proxy, src, type, capture, handler) {
  /**
   * Call back function
   * @type Function
   */
  this.listener = listener;
  
  /** 
   * Proxy for callback that passes through {@link goog.events#HandleEvent_}
   * @type Function
   */
  this.proxy = proxy;
  
  /**
   * Object or node that callback is listening to
   * @type Object
   */
  this.src = src;
  
  /**
   * Type of event
   * @type String
   */
  this.type = type;
  
  /**
   * Whether the listener is being called in the capture or bubble phase
   * @type Boolean
   */
  this.capture = !!capture;
  
  /**
   * Optional object whose context to execute the listener in
   * @type Object
   */
  this.handler = handler;
  
};