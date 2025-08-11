// Copyright Google, Inc., 2007
// @author Vlad Patryshev (vpatryshev@google.com)
//
// Unittest for keyboard_fi.js
// Requires keyboard_fi_unittest.hmtl
//

var TITLE_INACTIVE =
    addPointerCursor(
      '<abbr style="border-style:none" title="Finnish keyboard"><b>' +
      '&nbsp;&nbsp;&nbsp;suomalainen n\u00e4pp\u00e4imist\u00f6</b></abbr>');

var TITLE_ACTIVE =
    '<abbr style="border-style:none" title="Finnish keyboard"><b>' +
    '&nbsp;&nbsp;&nbsp;suomalainen n\u00e4pp\u00e4imist\u00f6</b></abbr>';

function setUp() {
  GKBD.layer.setup();
  var input = document.getElementById('testarea');
  input.value = '';
  input.focus();
}

function pressAndRelease(key) {
  var input = document.getElementById('testarea');
  var event = {target:   input,
               which:    key.toUpperCase().charCodeAt(0),
               shiftKey: key == key.toUpperCase()};
  document.onkeydown(event);
  document.onkeyup(event);
}

function type(s) {
  var input = document.getElementById('testarea');
  for (var i = 0; i < s.length; i++) {
    pressAndRelease(s.charAt(i));
  }
}

function show(s) {
  var buf = [];
  for (var i = 0; i < s.length; i++) {
    var c= s.charCodeAt(i);
    var hex = c.toString(16);
    while (hex.length < 4) hex = '0' + hex;
    buf.push((c < 128 && c > 31) ? s.charAt(i) : ("\\u" + hex));
  }
  return buf.join("");
}

function testPresence() {
  assertFalse(GKBD.Layout === undefined);
}

function testSaveRestore() {
  GKBD.layer.showAs_('h');
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
  document.cookie = 'KBD=0FI3;expires=November 07, 2051';
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

function testTypeFi() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('FI');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('ASDFGHJKL;\u00deasdfghjkl');
  var expected = 'ASDFGHJKL\u00d6\u00c4asdfghjkl';
  assertEquals("Got " + show(input.value) + "\nvs " + show(expected),
               expected,
               input.value);
}
