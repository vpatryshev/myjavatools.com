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

standaloneKeyboard('\u0432\u043a\u043b\u044e\u0447\u0438\u0442\u044c',
    '\u0432\u044b\u043a\u043b',
    '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430');

GKBD.layer.loader_ = function(data) {
  var layout = GKBD.layer.addLayout_("-", new GKBD.Layout(data));
  layout.getTitle_ = layout.titleTextBuilder_(
      {'EN': 'English',
       'RU': '\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0430\u044f',
       'Ru': '\u0442\u0440\u0430\u043d\u0441\u043b\u0438\u0442'
       });
  GKBD.layer.setDefaultLayout_(layout);
}
