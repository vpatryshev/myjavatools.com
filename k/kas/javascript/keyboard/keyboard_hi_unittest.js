// Copyright Google, Inc., 2007
// @author Vlad Patryshev (vpatryshev@google.com)
//
// Unittest for keyboard_hi.js
// Requires keyboard_hi_unittest.hmtl
//

var TEST_MSG_HINDI = '\u0627\u0644\u0639\u0631\u0628\u064a\u0629';

var TITLE_INACTIVE =
    addPointerCursor(
      '<abbr style="border-style:none" title="Hindi keyboard"><b>' +
      '&nbsp;&nbsp;&nbsp;\u0939\u093f\u0928\u094d\u0926\u0940&nbsp;' +
      '\u0915\u0940\u092c\u094b</b></abbr>');

var TITLE_ACTIVE =
    '<abbr style="border-style:none" title="Hindi keyboard"><b>' +
    '&nbsp;&nbsp;&nbsp;\u0939\u093f\u0928\u094d\u0926\u0940&nbsp;' +
    '\u0915\u0940\u092c\u094b</b></abbr>';

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
  GKBD.layer.showAs_('v');
  var actual = GKBD.layer.getTitleContent_();
  assertEquals("Got " + show(actual) + "\nvs " + show(TITLE_ACTIVE),
      TITLE_ACTIVE, actual);
}

function testTypeHi() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('HI');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('QWERTYUIOPqwertyuiop');
  var expected =
      '\u0914\u0910\u0906\u0908\u090a\u092d\u0919\u0918\u0927\u091d\u094c' +
      '\u0948\u093e\u0940\u0942\u092c\u0939\u0917\u0926\u091c';
  assertEquals("Got " + show(input.value) + "\nvs " + show(expected),
               expected,
               input.value);
}
