// Copyright 2006 Google Inc. All Rights Reserved.
/**
 * @fileoverview This file contains most of exported names for keyboard.
 *
 * Export is needed when code outside the keyboard wants to use the api.
 * It is not needed if the keyboard is to be self-contained, like in the case
 * of gws version.
 *
 *  @author vpatryshev@google.com
 */

/**
 * Make the namespace global.
 * @type {Object}
 */
KBD_window.GKBD = GKBD;

/**
 * Configuration function.
 * @deprecated Use KBD_window.GKBD.layer.configure()
 */
KBD_window._kbdConf = GKBD.layer.configure;

/**
 * Hides the keyboard.
 */
KBD_window._kbdHide = function() {
  GKBD.layer.hide_();
};

/**
 * Shows the keyboard.
 */
KBD_window._kbdShow = function() {
  GKBD.layer.show_();
};

/**
 * Switches layout; {see GKBD.layer.switchTo}.
 * @param {string} id Layout id.
 */
KBD_window._kbdS2 = function(id) {
  GKBD.layer.switchTo_(id);
};

/**
 * Alias for GKBD.layer.toggle_.
 * @type {Function}
 */
KBD_window._kbdToggle = GKBD.layer.toggle_;

/**
 * Alias for GKBD.layer.restore_.
 * @type {Function}
 */
KBD_window._kbdInit = GKBD.layer.restore_;
