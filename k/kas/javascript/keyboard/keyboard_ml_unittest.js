// @author Vlad Patryshev (vpatryshev@google.com)
//
// Unittest for keyboard_ml.js
// Requires keyboard_ml_unittest.hmtl
//

var TEST_MSG = '\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02';

var TITLE_INACTIVE =
    addPointerCursor(
      '<abbr style="border-style:none" title="Malayalam Keyboard"><b>' +
      '&nbsp;&nbsp;&nbsp;' +
      '\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02(\u0D2E\u0D4A\u0D34\u0D3F)' +
      '</b></abbr>');

var TITLE_ACTIVE =
    '<abbr style="border-style:none" title="Malayalam Keyboard"><b>' +
    '&nbsp;&nbsp;&nbsp;\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02(\u0D2E\u0D4A\u0D34\u0D3F)</b></abbr>';

function setUp() {
  GKBD.layer.setup();
  var input = document.getElementById('testarea');
  input.value = '';
  input.focus();
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('ML');
}

function testPresence() {
  assertFalse(GKBD.Layout === undefined);
}

function testSaveRestore() {
  GKBD.layer.showAs_('h');
  expectEqual(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
  document.cookie = 'KBD=0HI3;expires=November 07, 2051';
  GKBD.layer.restore_();
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
}

function testTitleInactive() {
  GKBD.layer.hide_();
  var actual = GKBD.layer.getTitleContent_();
  expectEqual(TITLE_INACTIVE, actual);
}

function testTitleActive() {
  var actual = GKBD.layer.getTitleContent_();
  expectEqual(TITLE_ACTIVE, actual);
}

function testType_n() {
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('1n');
  var expected = '1\u0d28\u0d4d\u200d';
  expectEqual(expected, input.value);
}

function testType_na() {
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('1na');
  var expected = '1\u0d28\u200b';
  expectEqual(expected, input.value);
}

function testType_naa() {
  DEBUG = true;
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('1naa');
  var expected = '1\u0d28\u0d3e';
  expectEqual(expected, input.value);
}

function testType_nt() {
  DEBUG = true;
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('1nt');
  var expected = '1\u0D28\u0D4D\u0D31\u0D4D';
  expectEqual(expected, input.value);
}

function testType_nu() {
  DEBUG = true;
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('1n~');
  var expected = '1\u0D28\u0D4D\u200C';
  expectEqual(expected, input.value);
}
