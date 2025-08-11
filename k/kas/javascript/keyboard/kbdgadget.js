// Copyright 2007 Google Inc.
// All Rights Reserved.
/**
 * #fileoverview This file contains igoogle gadget-specific configuration
 * for the keyboard.
 *
 * The configuration consists of ignoring all movements and resizing
 * the keyboard when the container layer is resized.
 *
 *  @author vpatryshev@google.com
 *
 */

/**
 * Sets variables that point to essential dom properties.
 * (Redefining it.)
 */
configureDom = function() {
  KBD_document = KBD_window.document;
  KBD_document_element = KBD_document.documentElement;
  KBD_client = KBD_window['KBD_gadgetClient'];
}

/**
 * Calculates scale for the keyboard, based on gadget dimensions.
 * @return {number} The desired keyboard scale.
 */
function calculateScale() {
  var layer = GKBD.layer;
  return layer.keyboard_.scale_ * layer.clientWidth_() / layer.width_;
}

GKBD.layer.configure({
  defaultVisibility : 'v',
  positioning_: 'relative',
  hasTitle_: false,
  moveTo_: function(x, y) {},
  getScale_: calculateScale
  // A place for MSG_close and MSG_open
});

/**
 * Sets client height for gadget; the height is just
 * the client height of the client element.
 * Overrides the default function.
 */
GKBD.layer.clientHeight_ = function() {
  return KBD_client.clientHeight;
};

var moduleId;

/**
 * Handles a gadget event.
 * @param {string} eventId The id of the event to handle.
 * @param {string} action action name.
 */
function handle(eventId, action) {
  if (!moduleId) moduleId = forId('KBD_anchor').parentNode.id.split('_')[1];
  _IG_AddModuleEventHandler(moduleId, eventId, KBD_window['_kbd' + action]);
}

GKBD.layer.setupQueue_.push(function() {
  handle('zip', 'Hide');
  handle('delete', 'Shutup');
  handle('unzip', 'Show');
  handle('undelete', 'Show');
  GKBD.layer.keyboard_.tryResize_(true);
});

