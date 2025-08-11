// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview A timer class to which other classes and objects can
 * listen on.  This is only an abstraction above setInterval
 *
 * @author Daniel Pupius (pupius@google.com)
 */

goog.provide('goog.Timer');
goog.require('goog.events.EventTarget');


/**
 * Class for handling timing events.
 *
 * @param {Number} opt_interval Number of ms between ticks (Default: 1ms)
 * @constructor
 * @extends goog.events.EventTarget
 */
goog.Timer = function(opt_interval) {

  /**
   * Number of ms between ticks
   * @type Number
   * @private
   */
  this.interval_ = opt_interval || 1;

};
goog.Timer.inherits(goog.events.EventTarget);


/**
 * Whether this timer is enabled
 * @type Boolean
 */
goog.Timer.prototype.enabled = false;


/**
 * Variable for storring the result of setInterval
 * @type Number
 * @private
 */
goog.Timer.prototype.timer_ = null;


/**
 * Callback for the setInterval used by the timer
 * @private
 */
goog.Timer.prototype.tick_ = function() {
  if (this.enabled) {
    this.dispatchEvent(goog.Timer.TICK)
  }
};


/**
 * Starts the timer.
 */
goog.Timer.prototype.start = function() {
  this.enabled = true;

  // If there is no interval already registered, start it now
  if (!this.timer_) {
    this.timer_ =
        goog.global.setInterval(this.tick_.bind(this), this.interval_);
  }
};


/**
 * Stops the timer.
 */
goog.Timer.prototype.stop = function() {
  this.enabled = false;
  goog.global.clearInterval(this.timer_);
  this.timer_ = null;
};


/**
 * Disposes the timer.
 */
goog.Timer.prototype.dispose = function() {
  if (!this.disposed_) {
    goog.events.EventTarget.prototype.dispose.call(this);
    this.stop();
  }
};


/**
 * Constant for the timer's event type
 * @type String
 */
goog.Timer.TICK = 'tick';


/**
 * Calls the given function once, after the optional pause
 * @param {Function} listener Function or object that has a handleEvent method
 * @param {Number} opt_interval Number of ms between ticks (Default: 1ms)
 * @param {Object} opt_handler Object in who's scope to call the listener
 */
goog.Timer.callOnce = function(listener, opt_interval, opt_handler) {
  var t = new goog.Timer(opt_interval);
  t.addEventListener(goog.Timer.TICK, listener, false, opt_handler);
  t.addEventListener(goog.Timer.TICK, goog.Timer.handleCallOnceTick_, false);
  t.start();
};


/**
 * Makes sure we dispose the temporary timer object for call once
 * @param {goog.events.Event} e The event object used in the internal tick event
 * @private
 */
goog.Timer.handleCallOnceTick_ = function(e) {
  e.target.dispose();
};
