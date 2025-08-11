// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Utilities for string manipulation
 * @author pupius@google.com (Daniel Pupius)
 * @author arv@google.com (Erik Arvidsson)
 */


/**
 * Namespace for string utilities
 */
goog.provide('goog.string');


/**
 * Fast prefix-checker.
 * @param {String} str The string to check
 * @param {String} prefix String that may appear at start
 * @return {Boolean} True/false
 */
goog.string.startsWith = function(str, prefix) {
  return str.indexOf(prefix) == 0;
};


/**
 * Fast suffix-checker.
 * @param {String} str The string to check
 * @param {String} suffix String that may appear at end
 * @return {Boolean} True/false
 */
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.lastIndexOf(suffix, l) == l;
};


/**
 * Does simple python-style string substitution.
 * subs("foo%s hot%s", "bar", "dog") becomes "foobar hotdot".
 * @param {String} str The string containing the pattern
 * @return {String} Processed string
 */
goog.string.subs = function(str /* var_args */) {
  // this appears to be slow, but testing shows it compares more or less equiv.
  // to the regex.exec method.
  for (var i = 1; i < arguments.length; i++) {
    // in case an argument is a Function
    str = str.replace(/\%s/, String(arguments[i]));
  }

  return str;
};


/**
 * Converts multiple whitespace chars (space, new lines and tabs) to a single
 * space, and strips leading and trailing whitespace
 * @param {String} str Input string
 * @return {String} String with collapsed whitespace
 */
goog.string.collapseWhitespace = function(str) {
  return str.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
};


/**
 * Check if a string is empty or contains only whitespaces
 * @param {String} str String to check
 * @return {Boolean}
 */
goog.string.isEmpty = function(str) {
  // testing length == 0 first is actually slower in all browsers (about the
  // same in Opera).
  return /^\s*$/.test(str);
};


/**
 * Check if a string contains all letters
 * @param {String} str String to check
 * @return {Boolean}
 */
goog.string.isAlpha = function(str) {
  return !/[^a-zA-Z]/.test(str);
};


/**
 * Checks if a string contains only numbers
 * @param {String} str String to check
 * @return {Boolean}
 */
goog.string.isNumeric = function(str) {
  return !/[^0-9]/.test(str);
};


/**
 * Check if a string contains only numbers or letters
 * @param {String} str String to check
 * @return {Boolean}
 */
goog.string.isAlphaNumeric = function(str) {
  return !/[^a-zA-Z0-9]/.test(str);
};


/**
 * Check if a character is a space character
 * @param {String} ch Character to check
 * @return {Boolean}
 */
goog.string.isSpace = function(ch) {
  return ch == ' ';
};


/**
 * Takes a string and replaces newlines with a space.  Multiple lines are
 * replaced with a single space
 * @param {String} str
 * @return {String}
 */
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, ' ');
};


/**
 * Replaces Windows and Mac new lines with unix style: \r or \r\n with \n
 * @param {String} str
 * @return {String}
 */
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, '\n');
};


/**
 * Normalizes spaces in a string, replacing all whitespace chars with a space.
 * @param {String} str
 * @return {String}
 */
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|\s/g, ' ');
};


/**
 * Trims white spaces to the left and right of a string
 * @param {String} str
 * @return {String}
 */
goog.string.trim = function(str) {
  return str.replace(/^\s+|\s+$/g, '');
};


/**
 * Trims white spaces to the left of a string
 * @param {String} str
 * @return {String}
 */
goog.string.trimLeft = function(str) {
  return str.replace(/^\s+/, '');
};


/**
 * Trims spaces to the right of a string
 * @param {String} str
 * @return {String}
 */
goog.string.trimRight = function(str) {
  return str.replace(/\s+$/, '');
};


/**
 * String comparator
 *  -1 = str1 less-than str2
 *  0 = str1 equals str2
 *  1 = str1 greater-than str2
 *
 * @param {String} str1
 * @param {String} str2
 * @return {Number}
 */
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();

  if (test1 < test2) {
    return -1;
  } else if (test1 == test2) {
    return 0;
  } else {
    return 1;
  }
};


/**
 * URL-encodes the string
 * @param {String} str
 * @return {String}
 */
goog.string.urlEncode = function(str) {
  return encodeURIComponent(str);
};


/**
 * URL-decodes the string. We need to specially handle '+'s because
 * the javascript library doesn't convert them to spaces
 * @param {String} str
 * @return {String}
 */
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, ' '));
};


/**
 * Converts \n to <br>s or <br />s
 * @param {String} str
 * @param {Boolean} opt_xml Whether to use XML compatible tags
 * @return {String}
 */
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? '<br />' : '<br>');
};


/**
 * Escape double quote '"' characters in addition to '&', '<', '>' so that a
 * string can be included in an HTML tag attribute value within double quotes.
 * @param {String} str String to be escaped.
 * @return The escaped string.
 */
goog.string.htmlEscape = function(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;');
};


/**
 * Unescapes a HTML string.
 *
 * @param {String} str
 * @return {String}
 */
// TODO(arv): Do the XML ones without having to rely on a DOM
goog.string.unescapeEntities = function(str) {
  if (str.indexOf('&') >= 0) {
    var el = document.createElement('a');
    el.innerHTML = str;
    if (el.normalize) {
      el.normalize();
    }
    str = el.firstChild.nodeValue;
    el.innerHTML = '';
  }
  return str;
};

/**
 * Do escaping of whitespace to preserve spatial formatting.  We use #160 to
 * make it safer for xml
 * @param {String} str
 * @param {Boolean} opt_xml Whether to use XML compatible tags
 * @return {String}
 */
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, ' &#160;'), opt_xml);
};


/**
 * Strip ' or " chars around a string
 * @param {String} str
 * @param {String} quotechar
 * @return {String}
 *
 */
goog.string.stripQuotes = function(str, quotechar) {
  if (str.charAt(0) == quotechar && str.charAt(str.length - 1) == quotechar) {
    return str.substring(1, str.length - 1);
  }
  return str;
};


/**
 * Truncates a string to a certain length and adds '...' if necessary
 * @param {String} str
 * @param {Number} chars Max number of characters
 * @param {Boolean} opt_protectEscapedCharacters Whether to protect escaped
 * characters from being cutoff in the middle
 * @return {String}
 */
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }

  if (str.length > chars) {
    str = str.substring(0, chars) + '...';
  }

  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }

  return str;
};


/**
 * Character mappings used internally for goog.string.quote
 * @private
 * @type Object
 */
goog.string.jsEscapeCache_ = {
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\x0B': '\\x0B', // '\v' is not supported in JScript
  '"': '\\"',
  '\'': '\'',
  '\\': '\\'
};


/**
 * Encloses the string in double quotes and escapes characters so that the
 * string is a valid JS string
 * @param {String} s The string to quote
 * @returns {String}
 */
goog.string.quote = function(s) {
  s = String(s);
  if (s.quote) {
    return s.quote();
  } else {
    // TODO(arv): Use a string builder
    var rv = '"';
    for (var i = 0; i < s.length; i++) {
      rv += goog.string.escapeChar(s.charAt(i));
    }
    return rv + '"';
  }
};


/**
 * Takes a character and returns the escaped string for that character. For
 * example escapeChar(String.fromCharCode(15)) -> "\\x0E"
 * @param {String} c The character to escape
 * @return {String}
 */
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    // tab is 9 but handled above
    if (cc < 256) {
      rv = '\\x';
      if (cc < 16 || cc > 256) {
        rv += '0';
      }
    } else {
      rv = '\\u';
      if (cc < 4096) { // \u1000
        rv += '0';
      }
    }
    rv += cc.toString(16).toUpperCase();
  }

  return goog.string.jsEscapeCache_[c] = rv;
};


/**
 * Takes a string and creates a map (Object) where the keys are the characters
 * in the string. The value for the key is set to true. You can then use
 * goog.object.map or goog.array.map to change the values.
 * @param {String} s The string to build the map from
 * @returns {Object}
 */
// TODO(arv): It seems like we should have a generic goog.array.toMap. But do
//            we want a dependency on goog.array in goog.string?
goog.string.toMap = function(s) {
  var rv = {};
  for (var i = 0; i < s.length; i++) {
    rv[s.charAt(i)] = true;
  }
  return rv;
};

/**
 * Characters used in regular expression
 * @private
 * @type Object
 */
goog.string.JS_REG_EXP_ESCAPE_CHAR_MAP_ = goog.string.toMap(
    '()[]{}+-?*.$^|,:#<!\\');


/**
 * Whether a string contains a given character
 * @param {String} s the string to test if it contains a character
 * @param {String} ss Sustring to test for
 * @returns {Boolean} Returns true if the string contains the substring
 */
goog.string.contains = function (s, ss) {
  return s.indexOf(ss) != -1;
};


/**
 * Escapes characters in the string that are not safe to use in a RegExp.
 * @param {String} s The string to escape
 * @returns {String}
 */
goog.string.regExpEscape = function(s) {
  s = String(s);
  var rv = '';
  var c;
    for (var i = 0; i < s.length; i++) {
    c = s.charAt(i);
    // \b is special in regexps
    if (c == '\b') {
      c = '\\x08';
    } else if (c in goog.string.JS_REG_EXP_ESCAPE_CHAR_MAP_) {
      c = '\\' + c;
    }
    rv += c;
  }
  return rv;
};
