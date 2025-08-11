// Copyright 2005 Google Inc.
// All Rights Reserved

/**
 * @fileoverview Class to help the creation of custom events that can support
 * preventDefault and stopPropagation.
 * 
 * @author pupius@google.com (Daniel Pupius)
 */

goog.provide('goog.events.CustomEvent');
goog.require('goog.events.Event');

/**
 * A super-class for custom event objects, so that they can support
 * preventDefault and stopPropagation.
 *
 * TODO(pupius): Does this need removing?  Instead just have Event.
 *
 * @param {String} type Event Type
 * @param {Object} opt_target Reference to the object that is the target
 *                            of this event
 * @constructor
 */
goog.events.CustomEvent = function(type, opt_target) {
  goog.events.Event.call(this, type, opt_target);
};
goog.events.CustomEvent.inherits(goog.events.Event);

