// Copyright 2006 Google Inc.
// All Rights Reserved.
/**
 * @fileoverview This file contains a part of
 * Keyboard Layer class implementation.
 * This file contains the dragging functionality part.
 *
 *  @author vpatryshev@google.com
 */

/**
 * Set the "can drag" option to true.
 * @type boolean
 * @private
 */
GKBD.layer.canDrag_ = true;

/**
 * Is it dragging rignt now?
 * @type boolean
 */
GKBD.layer.dragging = false;

/**
 * The cursor to show when keyboard is being dragged.
 * @type string
 * @private
 */
GKBD.layer.titleCursor_ = 'move';

/**
 * Sets listeners for mouse on/off actions.
 * @param {Element} element The element to which drag listener is attached.
 * @this Object Keyboard layer.
 * @private
 */
GKBD.layer.setTitleMouseActions_ = function(element) {
  var self = this;
  element.onmousedown = function(event) {
    self.dragOn(event || KBD_window.event);
    return false;
  };

  element.onblur = function(event) {
    self.dragOff();
  };
};

/**
 * Deserializes keyboard position, moving the keyboard to the place encoded
 * in the parameter.
 * @param {number} xyv x and y, coordinates, and v, visibility, as one number.
 * @this Object Keyboard layer.
 * @private
 */
GKBD.layer.deserializePosition_ = function(xyv) {
  var self = this;
  self.relY_ = Math.floor(xyv % 1201) / 1200;
  self.relX_ = Math.floor(xyv / 1201) / 2000;
  self.reposition_();

  if (self.isNearHome_()) {
    self.goHome_();
  }
};

/**
 * Reacts to the end of keyboard dragging action.
 * @this Object Keyboard layer.
 */
GKBD.layer.dragOff = function() {
  var self = this;
  if (self.dragging) {
    self.saveRelativePosition_();
    self.startListening_();
    self.dragging = false;
  }
};

/**
 * Reacts to the start of keyboard dragging action.
 * @param {Event} evt An event (click).
 * @this Object Keyboard layer.
 */
GKBD.layer.dragOn = function(evt) {
  var self = this;
  self.cx = evt.clientX - self.left();
  self.cy = evt.clientY - self.top();
  self.dragging = true;
};

/**
 * Drags the keyboard to the position specified by an event
 *
 * @param {Event} event Mouse move event.
 * @return {boolean} Stopped dragging?
 * @this Object Keyboard layer.
 */
GKBD.layer.drag = function(event) {
  var self = this;
  if (self.dragging) {
    self.moveTo_(event.clientX - self.cx - self.scrollX,
                 event.clientY - self.cy - self.scrollY);
  }
  return !self.dragging;
};

/**
 * Adds dragging functionality to the keyboard layer.
 * @param {Object} self The layer.
 */
GKBD.layer.setupQueue_.push(function(self) {
  self.dragging = false;
  KBD_document.onmousemove = function(event) {
    return self.drag(event || KBD_window.event);
  };

  KBD_document.onmouseup = function() {
    self.dragOff();
    return false;
  };
});
