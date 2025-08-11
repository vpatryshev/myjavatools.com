// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the AttachableMenu class
 *
 * @author Jon Perlow (jonp@google.com)
 */
goog.provide('goog.ui.AttachableMenu');
goog.require('goog.ui.MenuBase');


/**
 * An implementation of a menu that can attach itself to DOM element that
 * are annotated appropriately.
 *
 * The following attributes are used by the AttachableMenu
 *
 * menu-item - Should be set on DOM elements that function as items in the
 * menu that can be selected.
 * classNameSelected - A class that will be added to the element's class names
 * when the item is selected via keyboard or mouse.
 *
 * TODO(jonp) - Support hierarchical menus
 *
 * @param {Element} element A DOM element for the popup.
 * @constructor
 */
goog.ui.AttachableMenu = function(element) {
  goog.ui.MenuBase.call(this, element);
};
goog.ui.AttachableMenu.inherits(goog.ui.MenuBase);


/**
 * The currently selected element (mouse was moved over it or keyboard arrows)
 */
goog.ui.AttachableMenu.prototype.selectedElement_ = null;


/**
 * Class name to append to a menu item's class when it's selected
 * @type String
 */
goog.ui.AttachableMenu.prototype.itemClassName_ = 'menu-item';

/**
 * Class name to append to a menu item's class when it's selected
 * @type String
 */
goog.ui.AttachableMenu.prototype.selectedItemClassName_ = 'menu-item-selected';


/**
 * Sets the class name to use for menu items
 *
 * @return {String} The class name to use for items.
 */
goog.ui.AttachableMenu.prototype.getItemClassName = function(name) {
  return this.itemClassName_;
};


/**
 * Sets the class name to use for menu items
 *
 * @param {String} name The class name to use for items.
 */
goog.ui.AttachableMenu.prototype.setItemClassName = function(name) {
  this.itemClassName_ = name;
};

/**
 * Sets the class name to use for selected menu items
 * todo(jonp) - reevaluate if we can simulate pseudo classes in IE
 *
 * @return {String} The class name to use for selected items.
 */
goog.ui.AttachableMenu.prototype.getSelectedItemClassName = function(name) {
  return this.selectedItemClassName_;
};


/**
 * Sets the class name to use for selected menu items
 * todo(jonp) - reevaluate if we can simulate pseudo classes in IE
 *
 * @param {String} name The class name to use for selected items.
 */
goog.ui.AttachableMenu.prototype.setSelectedItemClassName = function(name) {
  this.selectedItemClassName_ = name;
};


/**
 * Returns the selected item
 *
 * @return {Element} The item selected or null if no item is selected
 * @override
 */
goog.ui.AttachableMenu.prototype.getSelectedItem = function() {
  return this.selectedElement_;
};


/**
 * Sets the specified item as the selected element.
 *
 * @param {Element} item The item to select. The type of this item is specific
 * to the menu class.
 *
 * @override
 */
goog.ui.AttachableMenu.prototype.setSelectedItem = function(elt) {
  if (this.selectedElement_) {
    goog.dom.classes.remove(this.selectedElement_, this.selectedItemClassName_);
  }

  this.selectedElement_ = elt;

  if (this.selectedElement_) {
    goog.dom.classes.add(this.selectedElement_, this.selectedItemClassName_);
  }
};

/**
 * Called after the menu is shown.
 *
 * @private
 */
goog.ui.AttachableMenu.prototype.onShow_ = function() {
  goog.ui.MenuBase.prototype.onShow_.call(this);

  this.element_.focus();
};


/**
 * Returns the next or previous item. Used for up/down arrows.
 *
 * @param {Boolean} prev True to go to the previous element instead of next
 * @return {Element} The next or previous element.
 */
goog.ui.AttachableMenu.prototype.getNextPrevItem_ = function(prev) {
  // first find the index of the next element
  var elements = this.element_.getElementsByTagName('*');
  var elementCount = elements.length;
  var index;
  // if there is a selected element, find its index and then inc/dec by one
  if (this.selectedElement_) {
    for (var i=0; i < elementCount; i++) {
      if (elements[i] == this.selectedElement_) {
        index = prev ? i - 1 : i + 1;
        break;
      }
    }
  }

  // if no selected element, start from beginning or end
  if (!goog.isDef(index)) {
    index = prev ? elementCount - 1 : 0;
  }

  // if overflowed/underflowed, wrap around
  if (index < 0) {
    index = elementCount - 1;
  } else if (index >= elementCount) {
    index = 0;
  }

  // iterate forward or backwards through the elements finding the next
  // menu item
  for (var i = 0; i < elementCount; i++) {
    var multiplier = prev ? -1 : 1;
    var nextIndex = index + (multiplier * i) % elementCount;
    if (this.isMenuItem_(elements[nextIndex])) {
      return elements[nextIndex];
    }
  }
  return null;
}


/**
 * Mouse over handler for the menu.
 */
goog.ui.AttachableMenu.prototype.onMouseOver_ = function(e) {
  var eltItem = this.getAncestorMenuItem_(e.target);
  if (eltItem == null) {
    return;
  }

  this.setSelectedItem(eltItem);
};


/**
 * Mouse out handler for the menu.
 */
goog.ui.AttachableMenu.prototype.onMouseOut_ = function(e) {
  var eltItem = this.getAncestorMenuItem_(e.target);
  if (eltItem == null) {
    return;
  }

  this.setSelectedItem(null);
};


/**
 * Mouse up handler for the menu.
 */
goog.ui.AttachableMenu.prototype.onMouseUp_ = function(e) {
  var eltItem = this.getAncestorMenuItem_(e.target);
  if (eltItem == null) {
    return;
  }
  this.dispatchEvent(
      new goog.ui.ItemEvent(goog.ui.MenuBase.Events.ITEM_ACTION, this,
          eltItem));
  this.setVisible(false);
};


/**
 * Key down handler for the menu.
 */
goog.ui.AttachableMenu.prototype.onKeyDown_ = function(e) {
  // TODO (arv) - should the key code constants be defined in Events?
  switch (e.keyCode) {
    case 40: /* DOWN_KEYCODE */
      this.setSelectedItem(this.getNextPrevItem_(false));
      break;
    case 38: /* UP_KEYCODE */
      this.setSelectedItem(this.getNextPrevItem_(true));
      break;
    case 13: /* ENTER_KEYCODE */
      if (this.selectedElement_) {
        this.dispatchEvent(
            new goog.ui.ItemEvent(goog.ui.MenuBase.Events.ITEM_ACTION, this,
                this.selectedElement_));
        this.setVisible(false);
      }
    break;
    case 27: /* ESC_KEYCODE */
      this.setVisible(false);
      break;
  }
};


/**
 * Returns whether the specified element is a menu item
 */
goog.ui.AttachableMenu.prototype.isMenuItem_ = function(elt) {
  return goog.dom.classes.has(elt, this.itemClassName_);
};


/**
 * Returns the menu-item scoping the specified element, or null if there is
 * none.
 */
goog.ui.AttachableMenu.prototype.getAncestorMenuItem_ = function(elt) {
  while (elt != null && elt != document.body) {
    if (this.isMenuItem_(elt)) {
      return elt;
    }
    elt = elt.parentNode;
  }
  return null;
};

