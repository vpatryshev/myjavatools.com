// Copyright Google, Inc., 2007
// @author Vlad Patryshev (vpatryshev@google.com)
//
// Userful funcitons for keyboard unittests
//
var letterA = 'A'.charCodeAt(0);
var letterZ = 'Z'.charCodeAt(0);
var DEBUG = false;

function isUpperCase(c) {
  var code = c.charCodeAt(0);
  return c == c.toUpperCase() && (letterA <= code) && (code <= letterZ);
}

function pressAndRelease(key, opt_isShift) {
  if (window['GKBD']) {
      assertTrue(GKBD.layer.keyboard_.layout_.isInitialized);
  }
  var input = document.getElementById('testarea');
  var event = {target:   input,
               which:    key.toUpperCase().charCodeAt(0),
               shiftKey: opt_isShift || isUpperCase(key)};
  var okd = document.onkeydown;
  var okp = document.onkeypress;
  var oku = document.onkeyup;
  if (!okd) throw 'document.onkeydown not defined';
  if (!oku) throw 'document.onkeyup not defined';
  if (!okp) throw 'document.onkeypress not defined';

  var fromKeyDown = okd(event);
  var fromKeyPress= okp(event);
  var fromKeyUp   = oku(event);
  return {
    fromKeyDown : fromKeyDown,
    fromKeyPress: fromKeyPress,
    fromKeyUp   : fromKeyUp
  };
}

function type(s) {
  for (var i = 0; i < s.length; i++) {
    pressAndRelease(s.charAt(i));
  }
}

function clickKeyButton(key) {
  assertTrue(GKBD.layer.keyboard_.layout_.isInitialized);
  var id = 'K' + key.charCodeAt(0);
  var element = document.getElementById(id);
  assertTrue('Element ' + id + ' should exist', !!element);
  assertTrue('Element ' + id + ' should have an onclick listener',
      !!element.onclick);
  assertTrue('Element ' + id + ' should have value', !!element.value);
  element.onclick();
}

function clickButtons(s) {
  for (var i = 0; i < s.length; i++) {
    clickKeyButton(s.charAt(i));
  }
}

function showString(s) {
  var buf = [];
  try {
    if (s) {
      for (var i = 0; i < s.length; i++) {
        var c= s.charCodeAt(i);
        var hex = c.toString(16);
        while (hex.length < 4) hex = '0' + hex;
        buf.push((c < 128 && c > 31) ? s.charAt(i) : ('\\u' + hex));
      }
    }
  } catch(e) {
    buf.push('\n');
    buf.push(e);
  }
  return buf.join('');
}

function describe(item) {
  var s = [''];
  var x;
  for (x in item) {
    s.push(x);
    try {
      if (item[x]) {
        var value = item[x].toString();
        if (typeof item[x] == 'function') {
          s.push('()');
        } else {
          s.push(':');
          s.push(value.length < 100 ? value : (value.substring(0,100) + '...'));
        }
      }
      } catch(e) {
        s.push('(' + e.message + ')');
      }
      s.push(', ');
  }
  return s.join('');
}

function show(s) {
  return typeof s == 'undefined' ? 'undefined' : 
         typeof s == 'string'    ? showString(s) : describe(s);
}

function activateKeyboard() {
  document.getElementById('kbd_ta').onclick({description: 'clicked this link'});
}

function getTitleContent() {
  return document.getElementById('kbd_t').innerHTML;
}

function stripStyle(s) {
  return s.replace(/<\/?b>/ig, '').replace(/ style="[^"]*"/ig, '');
}

function getStrippedTitleContent() {
  return stripStyle(getTitleContent());
}

function debugInfo(msg) {
  if (DEBUG && !confirm(msg)) throw 'Aborted';
}

function sample(s, index) {
  return s.substring(Math.max(0, index - 25), Math.min(index + 20, s.length));
}

function showDiff(s1, s2) {
  for (var i = 0; i < s1.length && i < s2.length; i++) {
    if (s1.charAt(i) != s2.charAt(i)) {
      return 'diff starting at ' + i + ': ...' +
             sample(s1, i) + '... vs\n ...' + sample(s2, i) + '...';
    }
  }
  return s1.length == s2.length ?  '(strings are equal)' :
         s1.length >  s2.length ? ('missing ' + (s1.length - s2.length) +
                                   ' chars: ' + s1.substring(s2.length)) :
                                  ('extra ' + (s2.length - s1.length) +
                                   ' chars: ' + s2.substring(s1.length))
}

/**
 * Checks equality of two objects, optionally with a message.
 * When the objects are not equal, a message shows a diff snippet.
 *
 * @param {string|Object} p1 either the message or the first object to compare
 * @param  {Object} p2 the first or the second object to compare
 * @param  {Object} opt_p3 if messsage is present, the second object to compare
 */
function expectEqual(p1, p2, opt_p3) {
  if (opt_p3) {
    assertEquals(p1 + '\n' + showDiff(p2, opt_p3), p2, opt_p3);
  } else {
    assertEquals(showDiff(p1, p2), p1, p2);
  }
}

/**
 * Checks if one string starts with another, optionally with a message.
 * When it does not, a message shows a diff snippet.
 *
 * @param {string} p1 either the message or the first object to compare
 * @param {string} the first or the second object to compare
 * @param {string} opt_p3 if messsage is present, the second object to compare
 */
function expectStartsWith(p1, p2, opt_p3) {
  if (opt_p3) {
    expectEqual(p1, p2, p2.substring(0, opt_p3.length));
  } else {
    expectEqual('\n' + p1, '\n' + p1.substring(0, p2.length));
  }
}

/**
 * Wraps an html snippet into span tags.
 * @param {string} text Html snippet.
 * @return {string} the same snippet wrapped into a span tag.
 */
function span(text) {
  return '<span>' + text + '</span>';
}

/**
 * Adds pointer cursor span to an html snippet.
 * @param {string} text Html snippet.
 * @return {string} the same snippet wrapped into a span with pointer cursor.
 */
function addPointerCursor(text) {
  return '<span style="font-weigth: bold; cursor: pointer; color: #676767">' +
      text +
      '</span>';
}

/**
 * Removes style, font size, td brackets from html snippet.
 *
 * @param {string} s Source string.
 * @return {string} The same html string with style removed.
 */
function removeSomeStyle(s) {
  return s.
      replace(/;font-size:\d+px/g, '').
      replace(/\s+style="[^"]+"/g, '').
      replace(/<td\/>/g, '');
}

/**
 * Checks the title of active keyboard.
 *
 * @param {string} expected Expected title.
 */
function checkActiveTitle(expected) {
  activateKeyboard();
  checkTitle(expected, 'Bad active title:\n');
}

/**
 * Checks the title of inactive keyboard.
 *
 * @param {string} expected Expected title.
 */
function checkInactiveTitle(expected) {
  _kbdHide();
  checkTitle(expected, 'Bad inactive title:\n');
}

/**
 * Checks the title; note, expected must be in lower case,
 * due to browsers incompatibilities.
 *
 * @param {string} expected What we expect.
 * @param {string?} opt_message The message to show in case of error.
 */
function checkTitle(expected, opt_message) {
  var actual = getTitleContent().toLowerCase();
  assertTrue('Title value must be present', !!actual);
  assertTrue('Title value must be longer: ' + actual, actual.length > 5);
  // a bug in IE, not all content is returned...
  var buggedByIE = actual.
      replace(/<abbr style="border-style:none" title="Hindi keyboard">/, '');
  assertTrue((opt_message || 'Bad title:\n') + actual +
             '\nexpected\n' + expected + '\nor at least\n' + buggedByIE,
      actual == expected || actual == buggedByIE);
}

/**
 * Checks save/restore behavior.
 *
 * @param {string} title Expected keyboard title.
 * @param {String} cookie Keyboard cookie (like 'KBD=0AR3').
 */
function checkSaveRestore(title, cookie) {
  assertTrue('"_kbdHide" should be visible in binary', !!window['_kbdHide']);
  _kbdHide();
  checkInactiveTitle(title);
  document.cookie = cookie + ';expires=November 07, 2051';
  _kbdInit();
  checkInactiveTitle(title);
}

/** Gets keyboard cookie.
 * @return {string} a string, or the empty string if no cookie found.
 * This function was customized from common.js.
 */
function getCookie() {
  var cookie = String(document.cookie);
  var values = cookie.match(/^(.+;\\s*)?KBD=([^;]+);?/);
  return value = values.length < 3 ? '' : values[2];
}

function isDefined(v) {
  return typeof v != 'undefined';
};
