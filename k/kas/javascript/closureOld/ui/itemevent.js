// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the goog.ui.ItemEvent class
 *
 * @author Jon Perlow (jonp@google.com)
 */

goog.provide('goog.ui.ItemEvent');

/**
 * Generic ui event class for events that take a single item like a menu click
 * event.
 *
 * @constructor
 * @extends goog.events.Event
 * @param {Object} clickedItem The item that was clicked.
 */
goog.ui.ItemEvent = function(type, target, item) {
  goog.events.Event.call(this, type, target);

  /**
   * Item for the event. The type of this object is specific to the type
   * of event. For a menu, it would be the menu item that was clicked. For a
   * listbox selection, it would be the listitem that was selected.
   *
   * @type Object
   */
  this.item = item;
};
goog.ui.ItemEvent.inherits(goog.events.Event);


