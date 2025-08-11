// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the NestedPopup class
 *
 * @uthor Vlad patryshev (vpatryshev@google.com)
 */

/**
 * Namespace for NestedPopup
 */
goog.provide('goog.ui.NestedPopup');
goog.require('goog.ui.Popup');

/**
 * The NestedPopup class is similar to popup ({@see Popup}), but it provides
 * a hierarchical popup structure. It's designed to
 * be used as the foundation for building controls like nested menus.
 *
 * @constructor
 * @extends goog.events.EventTarget
 * @param {Element} element A DOM element for the popup.
 */
goog.ui.NestedPopup = function(element) {
  goog.ui.Popup.call(this, element);
  this.setAutoHide(true);
};

goog.ui.NestedPopup.inherits(goog.ui.Popup);

