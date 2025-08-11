// Copyright 2007 Google Inc.
// All Rights Reserved

/**
 * @fileoverview This file contains configuration for Israeli keyboard: two
 * layouts and specific messages for the case of four layouts, Hebrew, Arabic,
 * Russian and English.
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */

/**
 * Id to name map, for this keyboard
 */
var ISRAELI_SET = {
  'EN': 'English',
  'HE': '\u05e2\u05d1\u05e8\u05d9\u05ea',
  'RU': '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
  'AR': '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'
};

/**
 * Configuration for this keyboard
 */
standaloneKeyboard(
    '\u05d4\u05e4\u05e2\u05dc\u05d4',
    '\u05db\u05d9\u05d1\u05d5\u05d9',
    '\u05de\u05e7\u05dc\u05d3\u05ea');

GKBD.layer.loader_ = function(data) {
  var layout = GKBD.layer.addLayout_("-", new GKBD.Layout(data));
  layout.getTitle_ = layout.titleTextBuilder_(ISRAELI_SET);
  GKBD.layer.setDefaultLayout_(layout);
}
