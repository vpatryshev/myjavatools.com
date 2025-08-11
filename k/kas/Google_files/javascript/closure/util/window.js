// Copyright 2006 Google Inc.
// All rights reserved.

/**
 * @fileoverview Utilities for window manipulation
 * @author hugol@google.com (Harry Ugol)
 * @author erikh@google.com (Erik Hanson)
 */


/**
 * Namespace for window utilities
 */
goog.provide('goog.window');


/**
 * Default height for popup windows
 * @type Number
 */
goog.window.DEFAULT_POPUP_HEIGHT = 500;


/**
 * Default width for popup windows
 * @type Number
 */
goog.window.DEFAULT_POPUP_WIDTH = 690;


/**
 * Default target for popup windows
 * @type Number
 */
goog.window.DEFAULT_POPUP_TARGET = 'google_popup';


/**
 * Opens a new window.
 *
 * @param {Object} linkRef if this is a String, it will be used as the URL
 * of the popped window; otherwise it's assumed to be an HTMLAnchorElement
 * (or some other object with "target" and "href" properties).
 *
 * @param {Object} options supports the following options:
 *  target: (String) target (window name). If null, linkRef.target will
 *          be used. If *that's* null, the default is "google_popup".
 *  width: (Number) window width. If null, the default is 690.
 *  height: (Number) window height. If null, the default is 500.
 *  toolbar: (Boolean) show toolbar
 *  scrollbars: (Boolean) show scrollbars
 *  location: (Boolean) show location
 *  statusbar: (Boolean) show statusbar
 *  menubar: (Boolean) show menubar
 *  resizable: (Boolean) resizable
 *
 * @return {Window} Returns the window object that was opened. This returns
 *                  null if a popup blocker prevented the window from being
 *                  opened.
 */
goog.window.open = function(linkRef, opt_options) {
  if (!opt_options) {
    opt_options = {};
  }

  var href = goog.isString(linkRef) ? linkRef : linkRef.href;
  var target = opt_options.target || linkRef.target;

  var sb = [];
  for (var option in opt_options) {
    switch (option) {
      case 'width':
      case 'height':
        sb.push(option + '=' + opt_options[option]);
        break;
      case 'target':
        break;
      default:
        sb.push(option + '=' + (opt_options[option] ? 1 : 0));
    }
  }
  var optionString = sb.join(',');

  var newWin = goog.global.open(href, target, optionString);
  // newWin is null if a popup blocker prevented the window open.
  return newWin;
}


/**
 * Raise a help popup window, defaulting to "Google standard" size and name.
 *
 * (If your project is using GXPs, consider using {@link PopUpLink.gxp}.)
 *
 * @param {Object} linkRef if this is a String, it will be used as the URL
 * of the popped window; otherwise it's assumed to be an HTMLAnchorElement
 * (or some other object with "target" and "href" properties).
 *
 * @param {Object} options supports the following options:
 *  target: (Object) target (window name). If null, linkRef.target will
 *          be used. If *that's* null, the default is "google_popup".
 *  width: (Number) window width. If null, the default is 690.
 *  height: (Number) window height. If null, the default is 500.
 *  toolbar: (Boolean) show toolbar
 *  scrollbars: (Boolean) show scrollbars
 *  location: (Boolean) show location
 *  statusbar: (Boolean) show statusbar
 *  menubar: (Boolean) show menubar
 *  resizable: (Boolean) resizable
 *
 * @return {Boolean} true if the window was not popped up, false if it was.
 */
goog.window.popup = function(linkRef, opt_options) {
  if (!opt_options) {
    opt_options = {};
  }

  // set default properties
  opt_options.target =
      opt_options.target || linkRef.target || goog.window.DEFAULT_POPUP_TARGET;
  opt_options.width = opt_options.width || goog.window.DEFAULT_POPUP_WIDTH;
  opt_options.height = opt_options.height || goog.window.DEFAULT_POPUP_HEIGHT;

  var newWin = goog.window.open(linkRef, opt_options);
  if (!newWin) {
    return true;
  }
  newWin.focus();

  return false;
}
