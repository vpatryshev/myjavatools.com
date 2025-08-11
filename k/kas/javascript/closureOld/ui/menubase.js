// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the MenuBase class
 *
 * @author Jon Perlow (jonp@google.com)
 */

goog.provide('goog.ui.MenuBase');
goog.require('goog.ui.Popup');
goog.require('goog.ui.ItemEvent');
goog.require('goog.dom.classes');
goog.require('goog.events.Event');

/**
 * The MenuBase class provides an abstract base class for different
 * implementations of menu controls.
 *
 * @constructor
 * @extends goog.ui.Popup
 */
goog.ui.MenuBase = function(element) {
  goog.ui.Popup.call(this, element);

  /**
   * Listener keys for events that need to be unlistened to when the popup
   * is hidden.
   * @type Array&lt;String&gt;
   * @private
   */
  this.listenerKeys_ = [];
};
goog.ui.MenuBase.inherits(goog.ui.Popup);


/**
 * Events fired by the Menu
 */
goog.ui.MenuBase.Events = {};


/**
 * Event fired by the Menu when an item is "clicked".
 */
goog.ui.MenuBase.Events.ITEM_ACTION = 'itemaction';



/**
 * Called after the menu is shown. Derived classes can override to hook this
 * event but should make sure to call the parent class method.
 *
 * @private
 */
goog.ui.MenuBase.prototype.onShow_ = function() {
  goog.ui.Popup.prototype.onShow_.call(this);
  // register common event handlers for derived classes
  this.listenerKeys_.push(
      goog.events.listen(this.element_, goog.events.types.MOUSEOVER,
          this.onMouseOver_, false, this));
  this.listenerKeys_.push(
      goog.events.listen(this.element_, goog.events.types.MOUSEOUT,
          this.onMouseOut_, false, this));
  this.listenerKeys_.push(
      goog.events.listen(this.element_, goog.events.types.MOUSEUP,
          this.onMouseUp_, false, this));
  this.listenerKeys_.push(
      goog.events.listen(this.element_, goog.events.types.KEYDOWN,
          this.onKeyDown_, false, this));
};

/**
 * Called after the menu is hidden. Derived classes can override to hook this
 * event but should make sure to call the parent class method.
 *
 * @private
 */
goog.ui.MenuBase.prototype.onHide_ = function(e) {
  goog.ui.Popup.prototype.onHide_.call(this);

  // remove listeners when hidden
  for (var i=0; i < this.listenerKeys_.length; i++) {
    goog.events.unlistenByKey(this.listenerKeys_[i]);
  }
  this.listenerKeys_.length = 0;
};


/**
 * Returns the selected item
 *
 * @return {Object} The item selected or null if no item is selected
 * @abstract
 */
goog.ui.MenuBase.prototype.getSelectedItem = function() {
};


/**
 * Sets the selected item
 *
 * @param {Object} item The item to select. The type of this item is specific
 * to the menu class.
 * @abstract
 */
goog.ui.MenuBase.prototype.setSelectedItem = function(item) {
};


/**
 * Mouse over handler for the menu. Derived classes should override.
 *
 * @param {goog.events.Event} The event object
 */
goog.ui.MenuBase.prototype.onMouseOver_ = function(e) {
};


/**
 * Mouse out handler for the menu. Derived classes should override.
 *
 * @param {goog.events.Event} The event object
 */
goog.ui.MenuBase.prototype.onMouseOut_ = function(e) {
};


/**
 * Mouse up handler for the menu. Derived classes should override.
 *
 * @param {goog.events.Event} The event object
 */
goog.ui.MenuBase.prototype.onMouseUp_ = function(e) {
};


/**
 * Key down handler for the menu. Derived classes should override.
 *
 * @param {goog.events.Event} The event object
 */
goog.ui.MenuBase.prototype.onKeyDown_ = function(e) {
};

