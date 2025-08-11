// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the NestedMenu class
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */
goog.provide('goog.ui.NestedMenu');
goog.require('goog.ui.AttachableMenu');

  function describe(item) {
    var s = [];
    for (var x in item) {
      try {
        if (!item[x]) {
          s.push(x);
        } else {
          var value = item[x].toString();
          s.push(x);
          if (value.indexOf('function') >= 0) {
            s.push('()');
          } else {
            s.push(':');
            s.push(value.length < 100 ? value : (value.substring(0,100) + "..."));
          }
        }
      } catch (ex) {
        s.push(' error: ' + ex + ' ');
      }
      s.push(', ');
    }
    return s.join('');
  }
  var patience = 50;
  function debug(msg) {
    if (patience --> 0 && document.getElementById("debug")) {
      document.getElementById("debug").value += goog.now() + "] " + msg + "\n";
    }
  }

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

  for (var i = 0; i < elements.length; i++) {
    this.registerAction_(elements[i], opt_action);
  }
  goog.events.listen(this, goog.ui.MenuBase.Events.ITEM_ACTION,
      this.menuAction_);
};

goog.ui.NestedMenu.inherits(goog.ui.AttachableMenu);

goog.ui.NestedMenu.prototype.menuAction_ = function(event) {
  this.keepVisible_();
  this.actionMap_[event.item.id].call(this, event.item);
};


goog.ui.NestedMenu.prototype.registerAction_ = function(element, action) {
  if (this.isMenuItem_(element)) {
    this.actionMap_[element.id] = function(item) {
      this.hideAll_();
      if (action) {
        action.call(this, item);
      }
    }
  }
};


goog.ui.NestedMenu.prototype.hideChildren_ = function() {
  var item = this.getSelectedItem();
  if (item) {
    var submenu = this.submenuMap_[item.id];
    if (submenu) {
      submenu.hide_();
      submenu.hideChildren_();
    }
  }
}

goog.ui.NestedMenu.prototype.hideAll_ = function() {
  this.hideChildren_();
  this.setSelectedItem(null);
  this.blocked_ = false;
  this.hide_();
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
    submenu.setParent(this);
    this.actionMap_[itemId] = this.activateSubmenu_;
    this.submenuMap_[itemId] = submenu;
  }
};


  goog.ui.NestedMenu.prototype.activateSubmenu_ = function(item) {
    var submenu = this.submenuMap_[item.id];
    if (submenu) {
      submenu.keepVisible_();
      submenu.element_.focus();
    }
  }


  /**
   * Mouse over handler for the menu.
   */
  goog.ui.NestedMenu.prototype.onMouseOver_ = function(e) {
    var eltItem = this.getAncestorMenuItem_(e.target);
    if (eltItem == null) {
      return;
    }

    this.setSelectedItem(eltItem);
  };


  goog.ui.NestedMenu.prototype.pinSubmenu_ = function(element, submenu) {
    var windowWidth = window.innerWidth  ? window.innerWidth  : document.body.clientWidth;
    var leftSpace = parseInt(this.element_.style.left);
    var rightSpace = windowWidth - leftSpace - this.element_.offsetWidth;
    var submenuWidth = goog.style.getSize(submenu.element_).width;
    if (rightSpace > submenuWidth) {
      submenu.setPinnedCorner(goog.ui.Popup.Corner.TOP_LEFT);
      submenu.setPosition(new goog.ui.Popup.AnchoredPosition(element,
          goog.ui.Popup.Corner.TOP_RIGHT));
    } else {
      submenu.setPinnedCorner(goog.ui.Popup.Corner.TOP_RIGHT);
      submenu.setPosition(new goog.ui.Popup.AnchoredPosition(element,
          goog.ui.Popup.Corner.TOP_LEFT));
    }
  }


  goog.ui.NestedMenu.prototype.showSubmenuForItem = function(item) {
    var submenu = this.submenuMap_[item.id];

    if (submenu) {
      this.keepVisible_();
      this.pinSubmenu_(item, submenu);
      submenu.setVisible(true);
    }
  };


  goog.ui.NestedMenu.prototype.startListening_ = function() {
    goog.ui.Popup.prototype.startListening_.call(this);
    this.listenerKeys_.push(
        goog.events.listen(this.element_, goog.events.types.MOUSEOVER,
            this.onMouseOver_, false, this));
    this.listenerKeys_.push(
        goog.events.listen(this.element_, goog.events.types.MOUSEOUT,
            this.onMouseOut_, false, this));
    this.listenerKeys_.push(
        goog.events.listen(this.element_, goog.events.types.MOUSEUP,
            this.onMouseUp_, false, this));
  }



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
  };


  /**
   * Called after the menu is shown. Derived classes can override to hook this
   * event but should make sure to call the parent class method.
   *
   * @private
   */
  goog.ui.NestedMenu.prototype.onShow_ = function() {
    goog.ui.Popup.prototype.onShow_.call(this);
    // register common event handlers for derived classes
    this.listenerKeys_.push(
        goog.events.listen(this.element_, goog.events.types.KEYDOWN,
            this.onKeyDown_, false, this));
    if (!this.parent_) {
      this.element_.focus();
    }
    var position = goog.style.getPosition(this.element_);
    position.x = Math.max(position.x, 0);
    position.y = Math.max(position.y, 0);
    var size = goog.style.getSize(this.element_);
    var windowHeight = window.innerHeight  ? window.innerHeight  : document.body.clientHeight;
    var windowWidth = window.innerWidth  ? window.innerWidth  : document.body.clientWidth;
    position.x = Math.min(position.x, windowWidth - size.width);
    position.y = Math.min(position.y, windowHeight - size.height);
    goog.style.setPosition(this.element_, position);
  };


  goog.ui.NestedMenu.prototype.hideSubmenu_ = function() {
    var item = this.selectedElement_;
    if (item) {
      var submenu = this.submenuMap_[item.id];
      if (submenu) {
        this.hideChildren_();
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
    this.hideSubmenu_();
    goog.ui.AttachableMenu.prototype.setSelectedItem.call(this, elt);
    if (elt) {
      this.showSubmenuForItem(elt);
    }
    this.element_.focus();
  };


  /**
   * Mouse out handler for the menu.
   */
  goog.ui.NestedMenu.prototype.onMouseOut_ = function(e) {
    this.onUserAction_(e);
    var eltItem = this.getAncestorMenuItem_(e.target);
    if (eltItem == null) {
      return;
    }
  };


  /**
   * Key down handler for the menu.
   */
  goog.ui.NestedMenu.prototype.onKeyDown_ = function(e) {
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
        }
        break;
      case 39: /* RIGHT_KEYCODE */
        this.activateSubmenu_(this.getSelectedItem());
        break;
      case 37: /* LEFT_KEYCODE */
      case 27: /* ESC_KEYCODE */
        this.setVisible(false);
        this.setSelectedItem(null);
        if (this.parent_) {
          this.parent_.element_.focus();
        }
        break;
    }
  };
