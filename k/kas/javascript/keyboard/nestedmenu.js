  // Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the NestedMenu class
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */
goog.provide('goog.ui.NestedMenu');
goog.require('goog.ui.AttachableMenu');

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
 * @param {Element} element A DOM element for the popup.
 * @param (Function) opt_action function, takes an event as the parameter.
 * @constructor
 */
goog.ui.NestedMenu = function(element, opt_action) {
  goog.ui.AttachableMenu.call(this, element);
  this.setPinnedCorner(goog.ui.Popup.Corner.TOP_LEFT);
  this.submenuMap_ = {};
  this.actionMap_ = {};
  var elements = this.element_.getElementsByTagName('*');
  var elementCount = elements.length;
  var index;
  for (var i=0; i < elementCount; i++) {
    var element = elements[i];
    if (this.isMenuItem_(element)) {
      this.registerAction_(element.id, opt_action);
    }
  }

  goog.events.listen(this, goog.ui.MenuBase.Events.ITEM_ACTION,
      this.menuAction_);
};

goog.ui.NestedMenu.inherits(goog.ui.AttachableMenu);


goog.ui.NestedMenu.prototype.menuAction_ = function(event) {
  this.keepVisible_();
  this.actionMap_[event.item.id].call(this, event.item);
};


goog.ui.NestedMenu.prototype.registerAction_ = function(id, action) {
  this.actionMap_[id] = function(item) {
    this.hideAll_();
    if (action) {
      action.call(this, item);
    }
  }
};


goog.ui.NestedMenu.prototype.hideAll_ = function() {
  this.setSelectedItem(null);
  this.blocked_ = false;
  this.hide_();
  this.childOpen_ = false;
  if (this.parent_) {
    this.parent_.hideAll_();
  }
}

/**
 * Attaches a submenu to an item of this menu
 * @itemId the item to which to attach the submenu
 * @param submenu the submenu to attach
 */
goog.ui.NestedMenu.prototype.addSubmenu = function (itemId, submenu) {
  var itemElement = document.getElementById(itemId);
  if (this.isMenuItem_(itemElement)) {
    this.attach(submenu);
    submenu.setPinnedCorner(goog.ui.Popup.Corner.TOP_LEFT);
    this.actionMap_[itemId] = function(item) {
      this.showSubmenuForItem(item);
    };
    this.submenuMap_[itemId] = submenu;
  }
};


  /**
   * Mouse over handler for the menu.
   */
  goog.ui.NestedMenu.prototype.onMouseOver_ = function(e) {
    var eltItem = this.getAncestorMenuItem_(e.target);
    if (eltItem) {
      this.setSelectedItem(eltItem);
    }
  };


  /**
   * Shows submenu for specified item.
   *
   * @param item the item for which to show submenu
   */
  goog.ui.NestedMenu.prototype.showSubmenuForItem = function(item) {
    var submenu = this.submenuMap_[item.id];
    if (submenu) {
      this.childOpen_ = true;
      this.keepVisible_();
      submenu.setPosition(new goog.ui.Popup.AnchoredPosition(item,
          goog.ui.Popup.Corner.TOP_RIGHT));
      submenu.setVisible(true);
    }
  };


  goog.ui.NestedMenu.prototype.hideSubmenu_ = function() {
    var item = this.selectedElement_;
    if (item) {
      var submenu = this.submenuMap_[item.id];
      if (submenu) {
        submenu.hide_();
        this.childOpen_ = false;
      }
    }
  };

  /**
   * Sets the specified item as the selected element.
   *
   * @param {Element} item The item to select. The type of this item is specific
   * to the menu class.
   *
   * @override
   */
  goog.ui.NestedMenu.prototype.setSelectedItem = function(elt) {
    if (this.selectedElement_) {
      this.hideSubmenu_();
      goog.dom.classes.remove(this.selectedElement_, this.selectedItemClassName_);
    }

    this.selectedElement_ = elt;

    if (this.selectedElement_) {
      goog.dom.classes.add(this.selectedElement_, this.selectedItemClassName_);
    }

    if (elt) {
      this.showSubmenuForItem(elt);
    }
  };


  /**
   * Mouse out handler for the menu.
   */
  goog.ui.NestedMenu.prototype.onMouseOut_ = function(e) {
    this.onFocusChange(e);
    if (!this.getAncestorMenuItem_(e.target)) {
      return;
    }

    if (!this.childOpen_) {
      this.setSelectedItem(null);
    }
  };
