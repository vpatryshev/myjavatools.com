// Copyright Google, Inc., 2007
// @author Vlad Patryshev (vpatryshev@google.com)
//
// Unittest for keyboard_ua.js
// Requires keyboard_ua_unittest.hmtl
//

var TITLE_INACTIVE =
    '<span style="cursor:pointer;color:#676767;font-weight:bold"> ' +
    '\u043a\u043b\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0430</span>';

var TITLE_ACTIVE_RU =
    '<abbr style="border-style:none" title="Russian keyboard"><b>' +
    '&nbsp;&nbsp;&nbsp;\u0420\u0443\u0441\u0441\u043a\u0430\u044f&nbsp;' +
    '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430</b></abbr>' +
    '&nbsp;&nbsp;' +
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'UK\');">' +
    '\u0443\u043a\u0440</a>&nbsp;&nbsp;' + 
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'EN\');">' +
    'Engl</a>';

var TITLE_ACTIVE_UK =
    '<abbr style="border-style:none" title="Ukrainian keyboard"><b>&nbsp;' +
    '&nbsp;&nbsp;\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430' +
    '&nbsp;\u043a\u043b\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0430</b>' +
    '</abbr>&nbsp;&nbsp;' +
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'RU\');">\u0440\u0443\u0441</a>&nbsp;&nbsp;' +
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'EN\');">' +
    'Engl</a>';

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

function testRestore() {
  GKBD.layer.showAs_('h');
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
  document.cookie = 'KBD=0UK3;expires=November 07, 2051';
  GKBD.layer.restore_();
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
}

function testSave1() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('RU');
  assertEquals('0RU-0', getCookie());
  GKBD.layer.switchTo_('UK');
  assertEquals('0UK-0', getCookie());
}

function testTitleInactive() {
  GKBD.layer.hide_();
  var actual = GKBD.layer.getTitleContent_();
  expectEqual(TITLE_INACTIVE, actual);
}

function testTitleActiveUa() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('UK');
  var actual = GKBD.layer.getTitleContent_();
  expectEqual(TITLE_ACTIVE_UK, actual);
}

function testTitleActiveRu() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('RU');
  var actual = GKBD.layer.getTitleContent_();
  expectEqual(TITLE_ACTIVE_RU, actual);
}

function testInputUa1() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('UK');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  pressAndRelease('S');
  assertEquals("got " + show(input.value), '\u0406', input.value);
}

function testInputUa2() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('UK');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  pressAndRelease('\u00de');
  assertEquals("got " + show(input.value), '\u0404', input.value);
}

function testTypeUa() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('UK');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('op\u00db\u00ddasdfghjkl;\u00dem\u00bc\u00be');
  expectEqual('\u0449\u0437\u0425\u0407\u0444\u0456\u0432\u0430\u043f\u0440\u043e' +
              '\u043b\u0434\u0416\u0404\u044c\u0411\u042e',
              input.value);
}

function testInputRu() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('RU');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  pressAndRelease('F');
  assertEquals('\u0410', input.value);
  pressAndRelease('Z');
  assertEquals('\u0410\u042f', input.value);
}

function testTypeRu() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('RU');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('Heccrfz rkfdbfnehf');
  expectEqual('\u0420\u0443\u0441\u0441\u043a\u0430\u044f' +
              '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430',
              input.value);
}
