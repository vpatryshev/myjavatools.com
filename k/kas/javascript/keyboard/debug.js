// Copyright 2006 Google Inc.
// All Rights Reserved.

/** 
 *  @fileoverview Debugger functionality.
 *
 *  @author vpatryshev@google.com
 */

/**
 * Output patience. It is not infinite.
 * @type {number}
 * @private
 */
var patience_ = 100;

function KBD_debug(msg, opt_data) {
  try {
    if (patience_-- > 0 && forId('debug')) {
        forId('debug').value += (new Date()).getTime() + '] ' + msg + ' ' +
                                show(opt_data) + '\n';
    }
  } catch(e) {
    alert('debug: ' + e);
  }
}

function show(s, opt_asHex) {
  var buf = [];
  try {
    if (s) {
      for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i);
        var hex = c.toString(16);
        while (hex.length < 4) hex = '0' + hex;
        buf.push((opt_asHex || c > 127 || c < 32) ?
                 ('\\u' + hex) : s.charAt(i));
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
  try {
    for (var x in item) {
      if (!item[x]) {
        s.push(x);
      } else {
        var value = item[x].toString();
        s.push(x);
        if (typeof item[x] == 'function') {
          s.push('()');
        } else {
          s.push(':');
          s.push(value.length < 100 ?
                 value : (value.substring(0, 100) + '...'));
        }
      }
      s.push(', ');
    }
  } catch(e) {
    s.push('\nError:');
    s.push(e);
  }
  return s.join('');
}
