// Copyright 2008 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Header file for the gws version of keyboard.
 *
 * @author vpatryshev@google.com
 */

/**
 * Global keyboard enabling flag. Need it for gws experiment functionality.
 */
var KBD_enabled = true;

/**
 * Represents window object.
 * @type {Object}
 */
var KBD_window = window;

/**
 * Points to document object. It is set when the keyboard content is built.
 * @type {Object}
 */
var KBD_document;

/**
 * Points to document element object. It is set when the content is built.
 * @type {Object}
 */
var KBD_document_element;

/**
 * Client element, depends on the context; in gws it is document.body.
 * @type {Element}
 */
var KBD_client;

/**
 * Sets variables that point to essential dom properties.
 */
function configureDom() {
  KBD_document = KBD_window.document;
  KBD_document_element = KBD_document.documentElement;
  KBD_client = KBD_document.body;
}

/**
 * Returns an elementy by its id.
 * Not all browsers have getElementById, but gws version of
 * keyboard works only with those that do.
 *
 * @param {string} id Element id.
 * @return {Element} The element found.
 */
function forId(id) {
  return document.getElementById(id);
}
