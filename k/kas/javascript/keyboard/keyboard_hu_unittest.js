// Copyright Google, Inc., 2007
// @author Vlad Patryshev (vpatryshev@google.com)
//
// Unittest for keyboard_hu.js
// Requires keyboard_hu_unittest.hmtl
//

var TITLE_INACTIVE =
    addPointerCursor(
      '<abbr style="border-style:none" title="Hungarian keyboard"><b>' +
      '&nbsp;&nbsp;&nbsp;magyar billent\u0171zet</b></abbr>');

var TITLE_ACTIVE =
    '<abbr style="border-style:none" title="Hungarian keyboard"><b>' +
    '&nbsp;&nbsp;&nbsp;magyar billent\u0171zet</b></abbr>';

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
  document.cookie = 'KBD=0HU3;expires=November 07, 2051';
  GKBD.layer.restore_();
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
}

function testTitleInactive() {
  GKBD.layer.hide_();
  var actual = GKBD.layer.getTitleContent_();
  assertEquals("Got " + show(actual) + "\nvs " + show(TITLE_INACTIVE),
      TITLE_INACTIVE, actual);
}

function testTitleActive() {
  GKBD.layer.showAs_('v');
  var actual = GKBD.layer.getTitleContent_();
  assertEquals("Got " + show(actual) + "\nvs " + show(TITLE_ACTIVE),
      TITLE_ACTIVE, actual);
}

function testTypeHu() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('HU');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('QWERTYUIOP\u00db\u00dd\u00dcqwertyuiop');
  var expected =
      'QWERTZUIOP\u0151\u00fa\u0171qwertzuiop';
  assertEquals("Got " + show(input.value) + "\nvs " + show(expected),
               expected,
               input.value);
}
