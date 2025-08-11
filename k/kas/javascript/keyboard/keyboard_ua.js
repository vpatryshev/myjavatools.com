// Copyright 2007 Google Inc.
// All Rights Reserved

/**
 * @fileoverview This file contains configuration for Ukrainian/Russian 
 * keyboard.
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */

/**
 * Following are Ukrainian and Russian keyboard layouts.
 */
standaloneKeyboard(
    '\u0432\u043a\u043b',
    '\u0432\u0438\u043a\u043b',
    '\u043a\u043b\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0430');

GKBD.layer.loader_ = function(data) {
  var layout = GKBD.layer.addLayout_("-", new GKBD.Layout(data));
  layout.getTitle_ = layout.titleTextBuilder_(
      {'RU': '\u0440\u0443\u0441',
       'UK': '\u0443\u043a\u0440',
       'EN': 'Engl'});
  GKBD.layer.setDefaultLayout_(layout);
}
