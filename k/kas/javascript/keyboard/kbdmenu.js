// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 *  This file contains keyboard menu functionality, plus some helper stuff.
 *
 *  @author vpatryshev@google.com
 *
 */

/**
 * Displays top menu at specified coordinates
 * @param left (Number) horizontal position, in px
 * @param top (Number) vertical position, in px
 */
GKBD.Keyboard.prototype.showTopMenu = function(left, top) {
  this.topMenu.setPinnedCorner(goog.ui.Popup.Corner.TOP_LEFT);
  var pos = new goog.ui.Popup.AbsolutePosition(left, top);
  this.topMenu.setPosition(pos);
  this.topMenu.setVisible(true);
  var self = this;
};


/**
 * An array of choices between different OEM keyboards.
 */
var KBD_oemChoices_ = {
  'en': GKBD.abbr_('qwerty (generic)', 'Click here if your computer has a generic keyboard'),
  'fr': GKBD.abbr_('azerty (French)', 'Click here if your computer has a French keyboard'),
  'de': GKBD.abbr_('qwertz (German)', 'Click here if your computer has a French keyboard')
};


GKBD.layer.haveOemChoiceMenu = true;

/**
 * Produces a list of menu items for a language group.
 *
 * @param groupId (String) language group id
 * @return the list of menu items
 */
GKBD.Keyboard.prototype.listLanguageMenuItems_ = function(groupId) {
  var names = [];
  var name2id = [];
  var group = this.groups_[groupId];

  for (var i = 0; i < group.length; i++) {
    var lang = group[i];
    names.push(lang.getTitle_());
    name2id[lang.getTitle_()] = lang.getId_();
  }

  names.sort();
  var items = [];

  for (var i = 0; i < names.length; i++) {
    items.push(Menu.buildMenuItem_(name2id[names[i]], names[i]));
  }
  return items;
};


/**
 * Build a layer for setup menu
 */
GKBD.Keyboard.prototype.buildSetupMenuLayer = function() {
  var choices = [];

  for (var id in KBD_oemChoices_) {
    choices.push(Menu.buildMenuItem_(id, KBD_oemChoices_[id]));
  }
  return  Menu.makeLayer_('MKD_setupMenu', choices);
};


/**
 * Returns OEM keyboard setup menu - to choose between different physical
 * keyboaards.
 */
GKBD.Keyboard.prototype.buildSetupMenu = function() {
  var self = this;

  function doSetup(item) {
    self.setOemId_(item.id);
  }

  return new Menu(self.buildSetupMenuLayer(), doSetup);
};


/**
 * Builds a submenu for the whole language group
 * @param groupId (String) language group id
 * @param group the associative array with group data
 * @param kbdLayer a layer object for the submenu
 * @param opt_extraItem an optional additional menu item
 *
 * @return an instance of Menu
 */
GKBD.Keyboard.prototype.buildLanguageGroupMenu =
    function(groupId, group, opt_extraItem) {
  var choices = [];
  var items = this.listLanguageMenuItems_(groupId);

  if (opt_extraItem) {
    choices.push(Menu.buildSeparator_());
    items.push(opt_extraItem);
  }
  var groupLayer = Menu.makeLayer_('KBD_menu_' + groupId);
  groupLayer.innerHTML = '<table border="0" ' +
      'style="border-collapse:collapse" cellpadding="0" cellspacing="0">' +
      items.join('') + '</table>';
  return new Menu(groupLayer, this.getSwitcher_());
};


/**
 * Builds top menu in the element provided
 */
GKBD.Keyboard.prototype.buildMenu_ = function() {
  this.topMenu = new Menu(this.menuLayer);

  if (this.history_.length > 1) {
    for (var i = this.history_.length - 1; i >= 0; i--) {
      var id = this.history_[i];
      var m = Menu.buildMenuItem_(id, id);
      // The following does not work, since menus are homogeneous (it's a bug)
      // @TODO(vpatryshev) Fix menu class, and then reenable history display.
      //      this.topMenu.addSubmenu(id, m);
    }
  }

  var total = 0;
  var submenu;
  for (var groupId in this.submenus) {
    total++;
    submenu = this.submenus[groupId];
    this.topMenu.addSubmenu(groupId, submenu);
  }

  if (GKBD.layer.haveOemChoiceMenu) {
    this.topMenu.addSubmenu('setup', this.setupMenu);
  } else if (total == 1) {
	  this.topMenu = submenu;
  }
};


/**
 * Prepares the data for building top menu
 * @param kbdLayer
 */
GKBD.Keyboard.prototype.buildMenuData_ = function(kbdLayer) {
  this.menuLayer = Menu.makeLayer_('KBD_mainMenu');
  var choices = [];
  var nGroups = 0;
  var self = this;
  this.submenus = {};
  var groupIds = [];

  for (var groupId in this.groups_) {
    groupIds.push(groupId);
  }

  groupIds.sort();

  for (var i = 0; i < groupIds.length; i++) {
    var groupId = groupIds[i];
    var group = this.groups_[groupId];
    if (group.length > 0) {
      choices.push(Menu.buildTopMenuItem_(groupId, groupId, GKBD.images));
      nGroups++;
    }
  }
  if (nGroups == 0) {
    if (!confirm("No layouts on this keyboard?")) {
      throw Error('No keyboard layouts found');
    }
  }

  // commented out until I figure out how to deal with single-group
  // configurations - Vlad, 10/24/2006
  //  if (nGroups == 1) {
  //    this.topMenu = this.buildLanguageGroupMenu(groupId, group, )
  //  }
  for (var i = 0; i < groupIds.length; i++) {
    var groupId = groupIds[i];
    var group = this.groups_[groupId];
    if (group.length > 0) {
      this.submenus[groupId] =
          this.buildLanguageGroupMenu(groupId, group);
    }
  }

  if (GKBD.layer.haveOemChoiceMenu) {
    choices.push(Menu.buildSeparator_());
    choices.push(Menu.buildTopMenuItem_('setup',
        GKBD.abbr_('Keyboard Setup',
             'Switch between generic, French and German keyboards on your computer'),
        GKBD.images));
    this.setupMenu = this.buildSetupMenu(kbdLayer);
  }

  this.menuLayer.innerHTML = '<table border="0" ' +
      'style="border-collapse:collapse" cellpadding="0" cellspacing="0">' +
      choices.join('') + '</table>';
};


KBD_oemHint = {
  'en': '',
  'fr': GKBD.abbr_('fr', 'Your main keyboard is French (azerty). Use setup menu to change.'),
  'de': GKBD.abbr_('de', 'Your main keyboard is German (qwertz). Use setup menu to change.')
};


/**
 * Opens layout selection menu
 */
GKBD.layer.openMenu = function() {
  var self = this;
  var keyboard = self.keyboard_;
  var wh = KBD_document.body.clientHeight;
  var lowest = wh - 120 * keyboard.scale_;
  var top = self.y_ + 12 * keyboard.scale_;
  top =  Math.floor(top < lowest ? top : lowest);
  var left = Math.floor(self.x_ +
                        (2 + keyboard.layout_.nativeName_.length) * 8 *
                        keyboard.scale_);
  keyboard.buildMenu_();
  keyboard.showTopMenu(left + KBD_document.body.scrollLeft, top + KBD_document.body.scrollTop);
};


KBD_window['_KBD_openMenu'] = function() {
  GKBD.layer.openMenu();
};


/**
 * @return keyboard title html content
 */
GKBD.layer.getTitleContent_ = function() {
  if (!this.titleText) {
    return "(please wait)";
  }
  var icon = '<img border="0" src="' +
             GKBD.images + 'btn_menu6.gif" height="' +
             this.titleHeight_ + '" width="' + this.titleHeight_ + '"/>';
  var titlePlusLink = '<b>' + this.titleText + '</b>&nbsp;&nbsp;&nbsp;' + icon;
  return GKBD.buildLink_(titlePlusLink, 'menu', '_KBD_openMenu();');
};

var closure = KBD_window['goog'];

if (isDef(closure)) {
  closure.require('goog.ui.AttachableMenu');
  GKBD.layer.setupQueue_.push(function(self) {
    self.keyboard_.buildMenuData_(self);
  });
}
