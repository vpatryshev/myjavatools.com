// Copyright Google, Inc., 2007
// @author Vlad Patryshev (vpatryshev@google.com)
//
// Unittest for keyboard_ar.js
// Requires keyboard_ar_unittest.hmtl
//

var TEST_MSG_ARABIC = '\u0627\u0644\u0639\u0631\u0628\u064a\u0629';

var TITLE_INACTIVE =
    addPointerCursor(
        '<abbr style="border-style:none" title="Arabic keyboard"><b>' +
        '&nbsp;&nbsp;&nbsp;\u0644\u0648\u062d\u0629 ' +
        '\u0645\u0641\u0627\u062b\u064a\u062d ' +
        '\u0627\u0644\u0644\u063a\u0629 ' +
        '\u0627\u0644\u0639\u0631\u0628\u064a</b></abbr>');

var TITLE_ACTIVE =
    '<abbr style="border-style:none" title="Arabic keyboard"><b>' +
    '&nbsp;&nbsp;&nbsp;\u0644\u0648\u062d\u0629 ' +
     '\u0645\u0641\u0627\u062b\u064a\u062d ' +
     '\u0627\u0644\u0644\u063a\u0629 ' +
     '\u0627\u0644\u0639\u0631\u0628\u064a</b></abbr>';

function setUp() {
  GKBD.layer.setup();
  var input = document.getElementById('testarea');
  input.value = '';
  input.focus();
}

function testPresence() {
  assertFalse(GKBD.Layout === undefined);
}

function testSaveRestore() {
  GKBD.layer.showAs_('h');
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
  document.cookie = 'KBD=0AR3;expires=November 07, 2051';
  GKBD.layer.restore_();
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
}

function testTitleInactive() {
  GKBD.layer.hide_();
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
}

function testTitleActive() {
  GKBD.layer.showAs_('v');
  assertEquals(TITLE_ACTIVE, GKBD.layer.getTitleContent_());
}

function testTypeAr() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('AR');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('QWERTYUIOPqwertyuiop');
  var expected =
      '\u064e\u064b\u064f\u064c\u0644\u0625\u0625\u2018\u00f7\u00d7\u061b' +
      '\u0636\u0635\u062b\u0642\u0641\u063a\u0639\u0647\u062e\u062d';
  assertEquals("Got " + show(input.value) + "\nvs " + show(expected),
               expected,
               input.value);
}
