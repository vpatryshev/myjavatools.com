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
standaloneKeyboard('\u0D24\u0D41\u0D31\u0D15\u0D4D\u0D15\u0D42',
                   '\u0D05\u0D1F\u0D2F\u0D4D\u0D15\u0D4D\u0D15\u0D42',
                   '\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02 ' +
                   '\u0D15\u0D40\u0D2C\u0D4B\u0D30\u0D4D\u200D\u0D21\u0D4D');

GKBD.layer.loader_ = function(data) {
  var layout = GKBD.layer.addLayout_("-", new GKBD.Layout(data));
  layout.getTitle_ = layout.titleTextBuilder_(
      {'ML': '\u0D2E\u0D4A\u0D34\u0D3F',
       'Ml': '\u0D07\u0D28\u0D4D\u200D\u0D38\u0D4D\u0D15\u0D4D\u0D30\u0D3F\u0D2A\u0D4D\u0D31\u0D4D\u0D31\u0D4D'
       });
  GKBD.layer.setDefaultLayout_(layout);
}
GKBD.layer.configure({defaultVisibility: 'v'});
