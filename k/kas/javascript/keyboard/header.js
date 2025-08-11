// Copyright 2008 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Header file for the versions of the script that are deployed
 * on milliways and used in igoogle, greasemonkey, orkut.
 *
 * @author vpatryshev@google.com
 */

/**
 * Global keyboard enabling flag. Need it for gws experiment functionality.
 */
var KBD_enabled = true;

/**
 * Represents window object. In some contexts (e.g. greasemonkey)
 * window has a very limited functionality, but unsafeWindow has it all.
 * @type {Object}
 */
var KBD_window = (typeof unsafeWindow == 'undefined') ? window : unsafeWindow;

/**
 * Points to document object. It is set when the keyboard content is built.
 * On certain occasions (e.g. greasemonkey) just document may not work.
 * It is set when keyboard is built.
 * @type {Object}
 */
var KBD_document;

/**
 * Points to document element object.
 * It is set when keyboard is built.
 * @type {Object}
 */
var KBD_document_element;

/**
 * Determines whether we are in a gadget.
 * @type {boolean}
 */
var KBD_isGadget;

/**
 * Client element, depends on the context; in plain html it is document.body.
 * @type {Element}
 */
var KBD_client;

/**
 * Sets variables that point to essential dom properties.
 */
function configureDom() {
  KBD_document = KBD_window.document;
  KBD_document_element = KBD_document.documentElement;
  var gadgetClient = KBD_window.KBD_gadgetClient;
  KBD_isGadget = !!gadgetClient;
  KBD_client = gadgetClient || KBD_document.body;
}

/**
 * Returns an elementy by its id, a regular browser version.
 *
 * @param id
 * @private
 */
function forid_regular_(id) {
  return document.getElementById(id);
}

/**
 * Returns an elementy by its id, a crazy browser version.
 *
 * @param id
 * @private
 */
function forid_crazy_(id) {
  return document.all[id];
}

/**
 * Returns an elementy by its id.
 * Not all browsers have getElementById.
 *
 * @type Function
 */
var forId = document.getElementById ? forid_regular_ : forid_crazy_;
