// Copyright Google, Inc., 2006
// @author Vlad Patryshev (vpatryshev@google.com)
//
// Unittest for keyboard_ru.js
// Requires keyboard_ru_unittest.hmtl
//

var titleInactive =
    '<span style="cursor:pointer;color:#676767;font-weight:bold"> ' +
    '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430' +
    '</span>';

var english =
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'EN\');">English</a>';

var standardOn = '<abbr style="border-style:none" title="Russian keyboard">' +
    '<b>&nbsp;&nbsp;&nbsp;Русская&nbsp;клавиатура</b></abbr>';

var standard =
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'RU\');">стандартная</a>';

var translitOn = '<abbr style="border-style:none" title="Russian keyboard">' +
    '<b>&nbsp;&nbsp;&nbsp;Клавиатура translit</b></abbr>';

var translit =
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'Ru\');">транслит</a>';

var titleStandardActiveEnglishFirst =
    [standardOn, english, translit].join('&nbsp;&nbsp;');

var titleStandardActiveTranslitFirst =
    [standardOn, english, translit].join('&nbsp;&nbsp;');

var titleTranslitActive =
    [translitOn, english, standard].join('&nbsp;&nbsp;');

function keyboardObject() { return GKBD.layer.keyboard_; }

function KBD_debug() {};

function setUp() {
  GKBD.layer.setup();
  GKBD.layer.switchTo_('EN');
  GKBD.layer.switchTo_('Ru');
  GKBD.layer.switchTo_('RU');
  var input = document.getElementById('testarea');
  input.value = '';
  input.focus();
}

function buildEvent(key) {
  return{target:   document.getElementById('testarea'),
         which:    key.toUpperCase().charCodeAt(0),
         shiftKey: key == key.toUpperCase()};
}

function pressAndRelease(key) {
  var result = {};
  var event = buildEvent(key);
  result.fromKeyDown = document.onkeydown(event);
  result.fromKeyPress = document.onkeypress(event);
  result.fromKeyUp = document.onkeyup(event);
  return result;
}

function type(s) {
  var input = document.getElementById('testarea');
  for (var i = 0; i < s.length; i++) {
    pressAndRelease(s.charAt(i));
  }
}

function testPresence() {
  assertFalse(GKBD.Layout === undefined);
}

function testKeyboardPresence() {
  assertFalse(GKBD.layer.keyboard_ === undefined);
}

function testSwitchTo() {
  document.cookie = 'KBD=0RU0;expires=November 07, 2051';
  GKBD.layer.restore_();
  assertEquals("0RU", keyboardObject().serialize_());
  GKBD.layer.switchTo_('Ru');
  assertEquals("0Ru", keyboardObject().serialize_());
}

function testSaveRestore_step1() {
  GKBD.layer.showAs_('h');
  GKBD.layer.switchTo_('Ru');
  expectEqual(titleInactive, GKBD.layer.getTitleContent_(),
      "Ru:Inactive Title");
}

function testSaveRestore_step2() {
  GKBD.layer.showAs_('h');
  GKBD.layer.switchTo_('Ru');
  expectEqual(titleInactive, GKBD.layer.getTitleContent_(),
      "Ru:Inactive Title");
  document.cookie = 'KBD=0RU3;expires=November 07, 2051';
  GKBD.layer.restore_();
  expectEqual(titleInactive, GKBD.layer.getTitleContent_(),
      "RU:Inactive Title");
  assertTrue('hm'.indexOf(GKBD.layer.visibility_) >= 0);
}

function testSaveRestore_step3() {
  GKBD.layer.showAs_('h');
  GKBD.layer.switchTo_('Ru');
  expectEqual(titleInactive, GKBD.layer.getTitleContent_(),
      "Ru:Inactive Title");
  document.cookie = 'KBD=0RU3;expires=November 07, 2051';
  GKBD.layer.restore_();
  expectEqual(titleInactive, GKBD.layer.getTitleContent_(),
      "RU:Inactive Title");
  assertTrue('hm'.indexOf(GKBD.layer.visibility_) >= 0);
  document.cookie = 'KBD=0Ru0;expires=November 07, 2051';
  GKBD.layer.restore_();
  expectEqual(titleTranslitActive, GKBD.layer.getTitleContent_(),
      "Translit Inactive Title");
  assertEquals('v', GKBD.layer.visibility_);
}

function testTitleInactive() {
  GKBD.layer.hide_();
  assertEquals("0RU-2", getCookie());
  assertFalse(keyboardObject().layout_ === undefined);
  expectEqual(titleInactive, GKBD.layer.getTitleContent_());
}

function testTitleActive() {
  document.cookie = 'KBD=0RU3;expires=November 07, 2051';
  activateKeyboard();
  assertEquals("0RU", keyboardObject().serialize_());
  assertFalse(keyboardObject().layout_ === undefined);
  var actual = GKBD.layer.getTitleContent_();
assertEquals(titleStandardActiveEnglishFirst, titleStandardActiveTranslitFirst)
  if (actual != titleStandardActiveEnglishFirst &&
      actual != titleStandardActiveTranslitFirst) {
    expectEqual(titleStandardActiveEnglishFirst, GKBD.layer.getTitleContent_());
  }
}

function testInput2() {
  activateKeyboard();
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  pressAndRelease('F');
  assertEquals('\u0410', input.value);
  pressAndRelease('Z');
  assertEquals('\u0410\u042f', input.value);
}

function testType1() {
  activateKeyboard();
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('Heccrfz rkfdbfnehf');
  assertEquals('\u0420\u0443\u0441\u0441\u043a\u0430\u044f' +
               '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430',
               input.value);
}

function testType2() {
  activateKeyboard();
  GKBD.layer.switchTo_('Ru');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('Russkaq klaviatura');
  assertEquals('\u0420\u0443\u0441\u0441\u043a\u0430\u044f' +
               '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430',
               input.value);
}

function testAcceptKey() {
  var result = pressAndRelease("A");
  assertFalse("keydown should have accepted", result.fromKeyDown);
  assertFalse("keypress should have accepted", result.fromKeyPress);
}

function testHaveButton() {
  assertEquals('\u0420', keyboardObject().keys_[72].value);
  assertEquals(undefined, keyboardObject().keys_[32]);
}

function testPassKey() {
  var result = pressAndRelease(" ");
  assertTrue("keydown should have passed", result.fromKeyDown);
  assertTrue("keypress should have passed", result.fromKeyPress);
  assertTrue("keyup should have passed", result.fromKeyUp);
}

function testDeadKeys1() {
  activateKeyboard();
  GKBD.layer.switchTo_('Ru');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('yyoojjoo');
  assertEquals('\u044b\u0451\u043e\u0439\u0451\u043e',
               input.value);
}

function testDeadKeys2() {
  activateKeyboard();
  GKBD.layer.switchTo_('Ru');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('YYOOJJOO');
  assertEquals('\u042b\u0401\u041e\u0419\u0401\u041e',
               input.value);
}
