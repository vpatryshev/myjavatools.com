// Copyright Google, Inc., 2006
// @author Vlad Patryshev (vpatryshev@google.com)
//
// Unittest for keyboard_il.js
// Requires keyboard_il_unittest.hmtl
//

var TEST_MSG_HEBREW = '\u05de\u05e7\u05dc\u05d3\u05ea ' +
    '\u05e2\u05d1\u05e8\u05d9\u05ea';
var TEST_MSG_ENGLISH = "English";
var TEST_MSG_RUSSIAN = '\u0420\u0443\u0441\u0441\u043a\u0438\u0439';
var TEST_MSG_ARABIC = '\u0627\u0644\u0639\u0631\u0628\u064a\u0629';

var TITLE_INACTIVE =
    '<span style="cursor:pointer;color:#676767;font-weight:bold"> ' +
    '\u05de\u05e7\u05dc\u05d3\u05ea</span>';

var TITLE_HEBREW_ACTIVE =
    '<abbr style="border-style:none" title="Hebrew keyboard"><b>' +
    '&nbsp;&nbsp;&nbsp;' + TEST_MSG_HEBREW + '</b></abbr>&nbsp;&nbsp;' +
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'EN\');">English</a>&nbsp;&nbsp;' +
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'RU\');">' + TEST_MSG_RUSSIAN + '</a>&nbsp;&nbsp;'+
    '<a style="text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
    'onmouseover="this.style.textDecoration=\'underline\'" ' +
    'onmouseout="this.style.textDecoration=\'none\'" ' +
    'onclick="_kbdS2(\'AR\');">' + TEST_MSG_ARABIC + '</a>'
;

function setUp() {
  GKBD.layer.setup();
  GKBD.layer.switchTo_('HE');
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

function getCookie() {
  var nameeq = 'KBD=';
  var cookie = String(KBD_document.cookie);

  for (var pos = -1; (pos = cookie.indexOf(nameeq, pos + 1)) >= 0;) {
    var i = pos;
    // walk back along string skipping whitespace and looking for a ; before
    // the name to make sure that we don't match cookies whose name contains
    // the given name as a suffix.
    while (i --> 0) {
      var ch = cookie.charAt(i);
      if (ch == ';') {
        i = -1;  // indicate success
        break;
      } else if (' \t'.indexOf(ch) < 0) {
        break;
      }
    }
    if (i == -1) {  // first cookie in the string, or we found a ;
      var end = cookie.indexOf(';', pos);
      if (end < 0) { end = cookie.length; }
      return cookie.substring(pos + nameeq.length, end);
    }
  }
  return "";
}

function testPresence() {
  assertFalse(GKBD.Layout === undefined);
}

function testSaveRestore() {
  GKBD.layer.showAs_('h');
  GKBD.layer.switchTo_('HE');
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
  document.cookie = 'KBD=0HE3;expires=November 07, 2051';
  GKBD.layer.restore_();
  assertEquals(TITLE_INACTIVE, GKBD.layer.getTitleContent_());
}


function testTitleInactive() {
  GKBD.layer.hide_();
  var actual = GKBD.layer.getTitleContent_();
  assertEquals("Got " + show(actual), TITLE_INACTIVE, actual);
}

function testTitleActive() {
  GKBD.layer.showAs_('v');
  assertEquals(TITLE_HEBREW_ACTIVE, GKBD.layer.getTitleContent_());
}

function testTypeRu() {
  GKBD.layer.showAs_('v');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  GKBD.layer.switchTo_('RU');
  type('Heccrfz rkfdbfnehf');
  assertEquals('\u0420\u0443\u0441\u0441\u043a\u0430\u044f' +
               '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430',
               input.value);
}

function testTypeHe() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('HE');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('ERTYUIOPertyuiop');
  assertEquals("Got " + show(input.value),
               'ERTYUIOP\u05e7\u05e8\u05d0\u05d8\u05d5\u05df\u05dd\u05e4',
               input.value);
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

function testTypeEn() {
  GKBD.layer.showAs_('v');
  GKBD.layer.switchTo_('EN');
  var input = document.getElementById('testarea');
  assertEquals('', input.value);
  type('ONCE UPON A MIDNIGHT DREARY, while I pondered, weak and weary');
  assertEquals('ONCEUPONAMIDNIGHTDREARYwhileIponderedweakandweary',
      input.value); // no space bar here! :)
}


