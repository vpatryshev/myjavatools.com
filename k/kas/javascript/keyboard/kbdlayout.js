// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview This file contains an implementation of Keyboard Layout class.
 * Layout data are passed to the class constructor as an associative array,
 * and parsed into a structure that is more efficient to use. Roughly speaking,
 * layout consists of some identification data (name, id, etc), key mapping,
 * and transformation. Transformation rules are used to convert sequences
 * of key inputs to one or more characters in the input field.
 *
 * @author vpatryshev@google.com
 */

/**
 * Creates a function that returns the specified value.
 * @param {*} value The value to return.
 *
 * @return {Function} A function that always returns the value specified.
 */
function returnValue(value) {
  return function() {
    return value;
  }
}

/**
 * Builds a &lt;abbr&gt; element out of title and text.
 * This method is used here and in keyboard.js, to generate pieces of
 * keyboard html.
 *
 * @param {string} text Main text.
 * @param {string} title Tooltip text.
 * @return {string} A chunk of html with abbr tag.
 * @private
 */
GKBD.abbr_ = function(text, title) {
  return title == text ? text :
         text.indexOf('<abbr') >= 0 ? text :
         ['<abbr style="border-style:none" title="',
          title,
          '">',
          text,
          '</abbr>'].join('');
};

/**
 * Keyboard layout constructor
 *
 * @param {Object} source An associative array with layout descriptor,
 *                has the following entries:
 *        id: a complex structure, a sequence of colon-separated components.
 *            The first component either contains layout id, or can consist of
 *            two components:
 *            layout id followed by a short id, separated by a comma,
 *            e.g. RU_LATN,ru.
 *            next goes name: layout name, in plain English (e.g. 'Japanese').
 *            next goes optional native name - layout name in the language
 *            of this layout. @see #parseId for more details.
 *        capslock: an associative array with titles for capslock button
 *                  (e.g. {'':'\u7247\u4eee\u540d','l':'\u5e73\u4eee\u540d'}
 *                  for hiragana/katakana: keys correspond to keyboard states)
 *        mappings: an associative array with keycode mapping
 *                  for various shift/capslock/AltGr states;
 *                  for detailed description @see #copyMapping
 *        transformation: a transformation map for key combinations
 *                        @see #addTransformation for detailed description
 * @constructor
 */
GKBD.Layout = function(source) {
  /**
   * All possible modifier combinations for key mapping:
   * 's' for shift, 'l' for capslock, 'c' for AltGr
   */
  var MODIFIERS = ['', 's', 'l', 'c', 'sc', 'sl', 'cl', 'scl'];

  /**
   * The array of keyboard key codes, all four rows
   */
  var CODES = '\u00c01234567890m=' +
              'QWERTYUIOP\u00db\u00dd\u00dc' +
              'ASDFGHJKL;\u00de' +
              'ZXCVBNM\u00bc\u00be\u00bf';

  var self = this;

  /**
   * Name of the layout in the appropriate language.
   * @private
   */
  self.nativeName_ = source['name'];

  /**
   * Marks the fact that this layout is fully initialized.
   * @type boolean
   */
  self.isInitialized = false;

  var titleProvider = source.titleProvider;
  var tooltip = source.tooltip;
  var shortId = '??';
  var defaultTitle = '??';
  var mappings = {};
  var transformation = {};
  var view2char = {};
  self.shortTitle_ = source.shortTitle;

  for (var i = 0; i < MODIFIERS.length; i++) {
    mappings[MODIFIERS[i]] = {};
  }

  /**
   * Parses layout id.
   * the layout id may have the following structure:
   * a) id,shortid - id is used for officially referencing the layout file;
   *                 shortid is used for storing layout name in a cookie.
   * b) id,shortid:name[:nativeName] - in addition to ids, we provide
   *                 layout name and layout's native name, in the language.
   *
   & @param {string} fullId The full layout id.
   *
   * Parsed id is stored in the 'id' attribute; shortId, name, nativeName
   * are stored in internal variables and used in various methods.
   */
  function parseId(fullId) {
    var bigid;
    if (fullId.indexOf(':') > 0) {
      var data = fullId.split(/:/);
      bigid = data[0].split(/,/);
      var name = data[1];
      self.nativeName_ = data[data.length > 2 ? 2 : 1];
    } else {
      bigid = fullId.split(/,/);
    }

    self.id = bigid[0];
    shortId = bigid.length > 1 ? bigid[1] : self.id;
    defaultTitle = GKBD.abbr_(self.nativeName_, name);
  }

  /**
   * @return {string} Layout title.
   * @private
   */
  self.getTitle_ = function() {
    return titleProvider ? titleProvider() : defaultTitle;
  };


  /**
   * Builds keyboard title text producer.
   *
   * @param {Object} switchMap Contains a mapping, id->title, for all layouts.
   * @return {Function} A function that html content for the title.
   * @private
   */
  self.titleTextBuilder_ = function(switchMap) {
    return function() {
      var buf = [GKBD.abbr_('<b>&nbsp;' + self.nativeName_ + '</b>',
          tooltip)];
      for (var key in switchMap) {
        var map = switchMap[key];
        if (typeof map === 'string' && shortId != key) {
          if (buf.length > 0) buf.push('&nbsp;&nbsp;');
          buf.push(
              // TODO(vpatryshev): set the listeners using DOM
              GKBD.buildLink_(map, 's2' + key, '_kbdS2(\'' + key + '\');'));
        }
      }
      return buf.join('');
    }
  }

  /**
   * @return {string} Short title for this layout.
   * @private
   */
  self.getShortTitle_ = function() {
    return self.shortTitle_ || self.getTitle_();
  };

  /**
   * @return {string} An id to use within the program.
   * @private
   */
  self.getId_ = function() {
    return shortId;
  };

  /**
   * Copies into itself key mappings for all modifiers.
   *
   * @param {Object} sourceMappings An associative array that for each modifier
   * (or a set of modifiers, represented as a comma-separated string)
   * has an associative array that maps key codes to layout characters.
   * E.g. {'':{'A':'\u0430','B':'\u0431},"s,sl":{'A':'\u0410','B':'\u0411'}}
   * In this example, keys 'A' and 'B' are mapped to Russian small letters
   * 'a' and 'b', but for shift (and for shift+capslock), to capital letters.
   */
  function copyMappings(sourceMappings) {
    for (var mm in sourceMappings) {
      var source = sourceMappings[mm];
      var list = mm.split(/,/);
      if (list.join(',') != mm) {
        list.push(''); // A hack for IE: it splits 'a,b,' into ['a','b']
      }

      var parsed = {};
      if (source) {
        var allChars = source[''];
        if (allChars) {
          // the case when each key is mapped to exactly one char
          for (var i = 0; i < allChars.length; i++) {
            parsed[CODES.charAt(i)] = allChars.charAt(i);
          }
        } else {
          for (var sourceChars in source) {
            var targetChars = source[sourceChars];
            if (typeof targetChars != 'string') continue;
            if (sourceChars.length == 1) {
              // the case of Tamil, with more than 1 char per key
              parsed[sourceChars.charAt(0)] = targetChars;
            } else {
              // one-to-one map
              for (var i = 0; i < sourceChars.length; i++) {
                parsed[sourceChars.charAt(i)] = targetChars.charAt(i);
              }
            }
          }
        }
      }
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m == '-') m = '';
        var mapping = mappings[m];

        for (var j = 0; j < CODES.length; j++) {
          var c = CODES.charAt(j);
          mapping[c] = parsed[c] ? parsed[c] : '';
        }
      }
    }
  };

  /**
   * Initializes a layout from a source (see constructor)
   * @param {Object} source A hash array describing the layout.
   * @return {*} Does not return anything.
   * @private
   */
  self.init_ = function(source) {
    if (source.mappings) {
      copyMappings(source.mappings);
      if (source.capslock) {
        self.capslockTitles_ = source.capslock;
      }

      if (source.view2char) {
        view2char = source.view2char;
      }

      addTransformation(source.transform);
      self.sequence_ = '';
      self.init_ = self.load_ = returnValue(true);
      self.isInitialized = true;

      /**
       * @return {boolean} Is the language right-to-left?
       * @private
       */
      self.isRtl_ = function() {
        return source['direction'] == 'rtl';
      }
    }
  };

  /**
   * Adds a transformation to keyboard layout.
   *
   * A transformation consists of a map that maps
   * character sequences to other character sequences (most probably,
   * to single characters). For instance, '^' followed by 'o' is mapped to
   * 'o circonflex' in French keyboard layout.
   *
   * As a result of interpeting sourceTransformation a trie structure is
   * created in this transformation associative array; leading key segments
   * are mapped to '-'. E.g. 'SHH' -> '?' produces three entries:
   * 'S'->'-', 'SH'->'-', 'SHH'->'\b\b\b?'.
   *
   * @param {Object} sourceTransformation Source transformation.
   *
   * @private
   */
  function addTransformation(sourceTransformation) {
    if (!sourceTransformation) { return; }

    for (var key in sourceTransformation) {
      var transform = sourceTransformation[key];
      if (typeof transform === 'string') {
        addTransformationForKey('', key, transform);
      }
    }
  };

  /**
   * Adds transformation for given key with given prefix.
   *
   * @param {string} prefix Prefix that triggers the transformation.
   * @param {string} key The key for which transformation is being added.
   * @param {string} value The value for transformed string.
   *
   * @private
   */
  function addTransformationForKey(prefix, key, value) {
    var from = key.indexOf('[');
    if (from < 0) {
      addSimpleTranformationForKey(prefix + key, value);
    } else {
      var to = key.indexOf(']');
      var pre = key.substring(0, from);
      var range = key.substring(from + 1, to);
      var post = key.substring(to + 1);
      for (var i = 0; i < range.length; i++) {
        addTransformationForKey(prefix + pre + range.charAt(i), post, value);
      }
    }
  }

  var maxKeySize = 0;

  /**
   * Adds simple transformation for given key with no prefix.
   *
   * @param {string} key The key for which transformation is being added.
   * @param {string} value The value for transformed string.
   *
   * @private
   */
  function addSimpleTranformationForKey(key, value) {
    maxKeySize = Math.max(maxKeySize, key.length)
    for (var pos = 1; pos < key.length; pos++) {
      var subkey = key.substring(0, pos);
      if (typeof transformation[subkey] == 'undefined') {
        transformation[subkey] = '-';
      }
    }
    transformation[key] = value.replace('\000', key.charAt(0))
                               .replace('\001', key.charAt(1))
                               .replace('\002', key.charAt(2));
  }

  /**
   * Returns mapping table for specified caps and shift
   *
   * @param {string} status Keyboard status, a sequence of 'l', 's', 'c' for
   *                        capslock, shift, altgr.
   * @return {Object} The mapping for the status.
   * @private
   */
  self.getMapping_ = function(status) {
    return mappings[status];
  };

  /**
   * Transforms a character, together with previously accumulated ones, into
   * another character or a sequence.
   *
   * @param {string} chars The characters to add to accumulated sequence.
   * @return {Object} The transformed sequence, and the number of
   *     backspaces needed.
   *
   * E.g. if we typed '^' in French, it returns '^', but if we type 'o' after
   * that, it will return '(backspace)(o circonflex)'
   * @private
   */
  self.transform_ = function(chars) {
    if (view2char[chars]) chars = view2char[chars];
    var pos = 0;
    // find the first character listed as the head of transformation key
    if (!transformation['*']) {
      for (pos = 0;
        pos < self.sequence_.length &&
        !transformation[self.sequence_.charAt(pos)];
        pos++) {
      }
    }
    if (pos >= self.sequence_.length) {
      return self.sequence_ = chars; // could not find this sequence
    }
    if (pos > 0) self.sequence_ = self.sequence_.substring(pos);

    var charsAdded = 0;

    for (var i = 0; i < chars.length; i++) {
      self.sequence_ += chars.charAt(i);
      charsAdded++;
      var subsequence = self.sequence_;
      var node = transformation[subsequence];

      while (node === undefined && subsequence.length > 0) {
        subsequence = subsequence.substring(1);
        node = transformation[subsequence];
      }

      // if this is the terminal node, return the result
      if ((node !== undefined) && (node != '-')) {
        var newChars = node + chars.substring(i + 1);
        var back = subsequence.length - charsAdded;
        var to = self.sequence_.length - subsequence.length;
        var from = Math.max(0, to + newChars.length - maxKeySize);
        self.sequence_ = from >= to ? newChars :
                         (self.sequence_.substring(from, to) + newChars);
        return {back: back, chars: newChars};
      }
    }
    // could not find transform
    return chars;
  };

  /**
   * Clears tranformation buffer.
   *
   * @private
   */
  self.clearBuffer_ = function() {
    self.sequence_ = '';
  }

  // Extract packed id information, @see #parseId
  parseId(source.id);

  // now start initializing
  if (source.mappings) {
    self.init_(source);
  }
};
