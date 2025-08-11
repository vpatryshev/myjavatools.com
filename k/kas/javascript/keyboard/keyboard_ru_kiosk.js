// Copyright 2006 Google Inc.
// All Rights Reserved
/**
 * @fileoverview This file contains configuration for Russian keyboard: two
 * layouts and specific messages for the case of just two layouts, standard
 * and translit.
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */

/**
 * Included are are two Russian keyboard layouts, and a default English one.
 */

standaloneKeyboard(
    '\u0432\u043a\u043b',
    '\u0432\u044b\u043a\u043b',
    '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430');

GKBD.layer.configure( {
    defaultVisibility: 'v',
    hasSpacebar: true,
    hasEnter: true
  }
);

GKBD.layer.loader_ = function(data) {
  var layout = GKBD.layer.addLayout_("-", new GKBD.Layout(data));
  layout.getTitle_ = layout.titleTextBuilder_(
      {'EN': 'Eng',
       'RU': '\u0420\u0443\u0441'
       });

  GKBD.layer.setDefaultLayout_(layout);
}
