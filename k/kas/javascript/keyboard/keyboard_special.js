// Copyright 2007 Google Inc.
// All Rights Reserved

/**
 * @fileoverview This file contains configuration for Turkish keyboard.
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */
/**
 * Id to name map, for this keyboard
 */
var LAYOUT_SET = {
  '_A': "Arrows",
  '_D': "Ding",
  'EL': "Greek",
  '_M': "Math"
};

/**
 * Configuration for this keyboard
 */
standaloneKeyboard();

GKBD.layer.loader_ = function(data) {
  data.shortTitle = "Special Chars";
  var layout = GKBD.layer.addLayout_("-", new GKBD.Layout(data));
  layout.getTitle_ = layout.titleTextBuilder_(LAYOUT_SET);
  GKBD.layer.setDefaultLayout_(layout);
}
