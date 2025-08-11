// Copyright 2005 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Class that can be used to listen to font size changes
 * @author pupius@google.com (Daniel Pupius)
 */

goog.provide('goog.dom.FontSizeMonitor');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');


/**
 * This class can be used to monitor changes in font-size.  Instances will
 * dispatch a "fontsizechange" event.
 * Example usage:
 * <pre>
 * var fms = new goog.dom.FontSizeMonitor();
 * goog.events.listen(fms, 'goog.dom.FontSizeMonitor.CHANGE_EVENT, function(e) {
 *   alert('Font-size was changed');
 * });
 * </pre>
 * @param {goog.Timer} opt_timer Optional timer objectthat can be used instead
 * of an interval.  The monitor will listen on the TICK event.
 * @constructor
 * @extends goog.events.EventTarget
 */
goog.dom.FontSizeMonitor = function(opt_timer) {
  
  // Create a new element and position it off screen.  Use this so we can 
  // guarantee its not going to have a fixed size.
  this.sizeElement_ = goog.dom.createDom(
      'div', { 'style': 'position:absolute;left:-1000px;top:-100px;' }, 'X');
  goog.dom.appendChild(goog.dom.getDocument().body, this.sizeElement_);

  this.lastSize_ = this.sizeElement_.offsetWidth;

  if (opt_timer) {
    goog.events.listen(opt_timer, 'tick', this.checkFontSize_, false, this);
  } else {
    goog.global.setInterval(this.checkFontSize_.bind(this), 50);
  }
};
goog.dom.FontSizeMonitor.inherits(goog.events.EventTarget);


/**
 * Constant for the fontsizechange event
 * @type String
 */
goog.dom.FontSizeMonitor.CHANGE_EVENT = 'fontsizechange';


/**
 * Callback used to check the fontsize, if it has changed this will dispatch
 * a "fontsizechange" event.
 * @private
 */
goog.dom.FontSizeMonitor.prototype.checkFontSize_ = function() {
  var curSize = this.sizeElement_.offsetWidth;
  if (this.lastSize_ != curSize) {
    this.lastSize_ = curSize;
    this.dispatchEvent(goog.dom.FontSizeMonitor.CHANGE_EVENT);
  }
};
