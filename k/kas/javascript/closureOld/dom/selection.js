// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Utilities for working with selections in input boxes and text
 * areas.
 *
 * @author pupius@google.com (Daniel Pupius)
 * @author arv@google.com (Erik Arvidsson)
 */


goog.provide('goog.dom.selection');


goog.require('goog.userAgent');


/**
 * Sets the place where the selection should start inside a text area or a text
 * input
 * @param {Element} textfield A textarea or text input
 * @param {Number} pos The position to end the selection at
 */
goog.dom.selection.setStart = function(textfield, pos) {
  if (typeof textfield.selectionStart == 'number') {
    textfield.selectionStart = pos;
  } else if (goog.userAgent.IE) {
    // destructuring assignment would have been sweet
    var tmp = goog.dom.selection.getRangeIe_(textfield);
    var range = tmp[0];
    var selectionRange = tmp[1];

    if (!range.inRange(selectionRange)) {
      return;
    }

    // For IE \r\n is 2 characters but move('character', n) passes both
    var value = textfield.value;
    var i = 0;
    var startPos = pos;
    while (i != -1 && i < startPos) {
      i = value.indexOf("\r\n", i);
      if (i != -1 && i < startPos) {
        pos--;
        i++;
      }
    }

    range.collapse(true);
    range.move('character', pos);
    range.select();
  } else {
    throw Error('Cannot set the selection start');
  }
};


/**
 * Return the place where the selection starts inside a text area or a text
 * input
 * @param {Element} textfield A textarea or text input
 * @return {Number}
 */
goog.dom.selection.getStart = function(textfield) {
  if (typeof textfield.selectionStart == 'number') {
    return textfield.selectionStart;
  }

  if (goog.userAgent.IE) {
    var tmp = goog.dom.selection.getRangeIe_(textfield);
    var range = tmp[0];
    var selectionRange = tmp[1];

    if (!range.inRange(selectionRange)) {
      return -1;
    }
    range.setEndPoint("EndToStart", selectionRange);
    return range.text.length;
  }

  throw Error('Cannot get the selection start');
};


/**
 * Sets the place where the selection should end inside a text area or a text
 * input
 * @param {Element} textfield A textarea or text input
 * @param {Number} pos The position to end the selection at
 */
goog.dom.selection.setEnd = function(textfield, pos) {
  if (typeof textfield.selectionEnd == 'number') {
    textfield.selectionEnd = pos;
  } else if (goog.userAgent.IE) {
    var tmp = goog.dom.selection.getRangeIe_(textfield);
    var range = tmp[0];
    var selectionRange = tmp[1];

    if (!range.inRange(selectionRange)) {
      return;
    }
    selectionRange.collapse();
    selectionRange.moveEnd("character",
                           pos - goog.dom.selection.getStart(textfield));
    selectionRange.select();
  } else {
    throw Error('Cannot set the selection end');
  }
};


/**
 * Returns the place where the selection ends inside a text area or a text input
 * @param {Element} textfield A textarea or text input
 * @return {Number}
 */
goog.dom.selection.getEnd = function(textfield) {
  if (typeof textfield.selectionEnd == 'number') {
    return textfield.selectionEnd;
  }

  if (goog.userAgent.IE) {
    var tmp = goog.dom.selection.getRangeIe_(textfield);
    var range = tmp[0];
    var selectionRange = tmp[1];

    if(!range.inRange(selectionRange)) {
      return 0;
    }
    range.setEndPoint('EndToEnd', selectionRange);
    return range.text.length;
  }

  throw Error('Cannot get the selection end');
};


/**
 * Sets the selected text inside a text area or a text input
 * @param {Element} textfield A textarea or text input
 * @param {String} text The text to change the selection to
 */
goog.dom.selection.setText = function (textfield, text) {
  if (typeof textfield.selectionEnd == 'number') {
    var value = textfield.value;
    var oldSelectionStart = textfield.selectionStart;
    var before = value.substr(0, oldSelectionStart);
    var after = value.substr(textfield.selectionEnd);
    textfield.value = before + text + after;
    textfield.selectionStart = oldSelectionStart;
    textfield.selectionEnd = oldSelectionStart + text.length;
  } else if (goog.userAgent.IE) {
    var tmp = goog.dom.selection.getRangeIe_(textfield);
    var range = tmp[0];
    var selectionRange = tmp[1];

    if (!range.inRange(selectionRange)) {
      return;
    }
    // When we set the selection text the selection range is collapsed to the
    // end. We therefore duplicate the current selection so we know where it
    // started. Once we've set the selection text we move the start of the
    // selection range to the old start
    var range2 = selectionRange.duplicate();
    selectionRange.text = text;
    selectionRange.setEndPoint("StartToStart", range2);
    selectionRange.select();
  } else {
    throw Error('Cannot set the selection end');
  }
};


/**
 * Returns the selected text inside a text area or a text input
 * @param {Element} textfield A textarea or text input
 * @return {String}
 */
goog.dom.selection.getText = function(textfield) {
  if (typeof textfield.selectionEnd == 'number') {
    var s = textfield.value;
    return s.substring(textfield.selectionStart, textfield.selectionEnd);
  }

  if (goog.userAgent.IE) {
    var tmp = goog.dom.selection.getRangeIe_(textfield);
    var range = tmp[0];
    var selectionRange = tmp[1];

    if (!range.inRange(selectionRange)) {
      return '';
    }
    return selectionRange.text;
  }

  throw Error('Cannot get the selection text');
};


/**
 * Helper function for returning the range for an object as well as the
 * selection range
 * @private
 * @param {Element} el The element to get the reange for
 * @return {[Range, Range]}
 */
goog.dom.selection.getRangeIe_ = function(el) {
  // getOwnerDocument(): Remove dependency on goog.dom's main namespace b
  var doc = el.ownerDocument || el.document;

  var selectionRange = doc.selection.createRange();
  // el.createTextRange() doesn't work on text areas
  var range;

  if (el.type == 'textarea') {
    range = selectionRange.duplicate();
    range.moveToElementText(el);
  } else {
    range = el.createTextRange();
  }

  return [range, selectionRange];
};
