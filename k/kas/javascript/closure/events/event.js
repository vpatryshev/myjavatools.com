// Copyright 2005 Google Inc.
// All Rights Reserved

/**
 * @fileoverview An base class for  event objects
 * 
 * @author pupius@google.com (Daniel Pupius)
 */

/**
 * Namespace for evevnts
 */
goog.provide('goog.events.Event');

/**
 * An base class for event objects, so that they can support
 * preventDefault and stopPropagation.
 *
 * @param {String} type Event Type
 * @param {Object} opt_target Reference to the object that is the target
 *                            of this event
 * @constructor
 */
goog.events.Event = function(type, opt_target) {

  /**
   * Event type
   * @type String
   */
  this.type = type;
  
  /**
   * Target of the event
   * @type Object
   */
  this.target = opt_target;
};


/**
 * Whether to cancel event in internal capture/bubble processing for IE
 * @type Boolean
 * @private
 */
goog.events.Event.prototype.propagationStopped_ = false;
  
/**
 * Return value for in internal capture/bubble processing for IE
 * @type Boolean
 * @private
 */
goog.events.Event.prototype.returnValue_ = true;


/**
 * Stop event propagation
 */ 
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true;
};
  
/**
 * Prevent the default action, for example a link redirecting to a url
 */ 
goog.events.Event.prototype.preventDefault = function() { 
  this.returnValue_ = false;
};

