//javascript/keyboard/header_gws.js
// Copyright 2008 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Header file for the gws version of keyboard.
 *
 * @author vpatryshev@google.com
 */

/**
 * Global keyboard enabling flag. Need it for gws experiment functionality.
 */
var KBD_enabled = true;

/**
 * Represents window object.
 * @type {Object}
 */
var KBD_window = window;

/**
 * Points to document object. It is set when the keyboard content is built.
 * @type {Object}
 */
var KBD_document;

/**
 * Points to document element object. It is set when the content is built.
 * @type {Object}
 */
var KBD_document_element;

/**
 * Client element, depends on the context; in gws it is document.body.
 * @type {Element}
 */
var KBD_client;

/**
 * Sets variables that point to essential dom properties.
 */
function configureDom() {
  KBD_document = KBD_window.document;
  KBD_document_element = KBD_document.documentElement;
  KBD_client = KBD_document.body;
}

/**
 * Returns an elementy by its id.
 * Not all browsers have getElementById, but gws version of
 * keyboard works only with those that do.
 *
 * @param {string} id Element id.
 * @return {Element} The element found.
 */
function forId(id) {
  return document.getElementById(id);
}

//javascript/keyboard/keyboard.js
// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview This file contains a model of physical keyboard:
 * it is an 'M' in MVC.
 *
 * @author vpatryshev@google.com
 */

/**
 * Removes a DOM element from a DOM element.
 *
 * @param {Element} element The element to delete.
 * @param {Object} opt_from The element to delete from; default is document.
 * @return {boolean} true if the element was found and removed.
 */
function removeElement(element, opt_from) {
  var parent = opt_from || document;
  var children = parent.childNodes;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child === element) {
      parent.removeChild(element);
      return true;
    };

  }
  // apply BFS
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child && removeElement(element, child)) return true;
  }
  return false;
}

/**
 * Returns element's width.
 * @param {Element} element The element which width we measure.
 * @return {number} Element width.
 */
function elementWidth(element) {
  if (!element) return -1;
  var offsetWidth = element['offsetWidth'];
  var clip = element['clip'];
  return offsetWidth || (clip ? clip.width : -1);
}

/**
 * Returns element's height.
 * @param {Element} element The element which height we measure.
 * @return {number} Element height.
 */
function elementHeight(element) {
  if (!element) return -1;
  var offsetHeight = element['offsetHeight'];
  var clip = element['clip'];
  return offsetHeight || (clip ? clip.height : -1);
}

/**
 * Appends 'px' to the value - good for using with loose.dtd where px is
 * required.
 * @param {number} x The value (width, height, x, y).
 * @return {string} x + 'px'.
 */
function px(x) {
  return '' + Math.floor(x) + 'px';
}

/**
 * Encodes a string for display.
 * @param {string} s The string to encode.
 * @return {string} Input string with all unsafe characters are escaped.
 * @private
 */
function htmlEncode(s) {
  var result = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    var code = s.charCodeAt(i);
    result.push('\\\'\"'.indexOf(c) >= 0 || code > 127 || code < 33 ?
                ('&#' + code + ';') : c);
  }
  return result.join('');
}

/**
 * Bit of Event object that determines whether it's 'Meta'.
 * @type {number}
 */
var eventMetaBit = 0;

/**
 * Bit of Event object that determines whether it's 'Ctrl'.
 * @type {number}
 */
var eventCtlBit = 0;

/**
 * Bit of Event object that determines whether it's 'Alt'.
 * @type {number}
 */
var eventAltBit = 0;

/**
 * Bit of Event object that determines whether it's 'Shift'.
 * @type {number}
 */
var eventShiftBit = 0;

if (KBD_window.Event) {
  eventMetaBit = Event.ALT_MASK;
  eventCtlBit = Event.CONTROL_MASK;
  eventAltBit = Event.ALT_MASK;
  eventShiftBit = Event.SHIFT_MASK;
}

/**
 * 'Ctrl' or 'Alt' or 'Meta' mask.
 * On a strange occasion when Event class is not defined, the value is 0.
 * @type {number}
 */
var CTL_ALT_META_MASK = eventMetaBit | eventCtlBit | eventAltBit;

/**
 * Checks whether it is a special character - alt, ctrl, and meta (wtf is it?).
 * @param {Event} event Keyboard event.
 * @return {boolean} true if it is.
 */
function isSpecialEvent(event) {
  return (event.ctrlKey && !event.altKey) ||
         !!(event.modifiers & CTL_ALT_META_MASK);
}

/**
 * Checks whether meta is currently pressed, according to the event.
 * @param {Event} event Keyboard event.
 * @return {boolean} true if is pressed.
 * @private
 */
function isMetaPressed(event) {
  return !!(event.modifiers & eventMetaBit);
}

/**
 * Checks whether ctrl is currently pressed, according to the event.
 * @param {Event} event Keyboard event.
 * @return {boolean} true if is pressed.
 * @private
 */
function isCtrlPressed(event) {
  return event && (event.ctrlKey || !!(event.modifiers & eventCtlBit));
}

/**
 * Checks whether alt is currently pressed, according to the event.
 * @param {Event} event Keyboard event.
 * @param {number} code Key code extracted from event.
 * @return {boolean} true if is pressed.
 * @private
 */
function isAltPressed(event, code) {
  return code == KBD_ALT_CODE ||
         event && (event.altKey || !!(event.modifiers & eventAltBit));
}

/**
 * Checks whether shift is currently pressed, according to the event.
 * @param {Event} event Keyboard event.
 * @param {number} code Key code extracted from event.
 * @return {boolean} true if is pressed.
 * @private
 */
function isShiftPressed(event, code) {
  return code == SHIFT_KEYCODE ||
         event.shiftKey || !!(event.modifiers & eventShiftBit);
}

/**
 * Tooltip text for non-English physical keyboard settings.
 * All disabled by default.
 *
 * @type {Object}
 */
var KBD_oemHint = {'en': '', 'fr': '', 'de': ''};

/**
 * Keyboard state mask for shift.
 * @type {number}
 */
var KBD_SHIFT = 1;

/**
 * Keyboard state mask for caps-lock.
 * @type {number}
 */
var KBD_CAPS = 2;

/**
 * Keyboard state mask for ctrl.
 * @type {number}
 */
var KBD_CTRL = 4;

/**
 * Keyboard state mask for alt.
 * @type {number}
 */
var KBD_ALT = 8;

/**
 * Keyboard state mask for alt and ctrl.
 * @type {number}
 */
var KBD_ALTCTRL = 12;

/**
 * Keyboard state mask for apple.
 * @type {number}
 */
var KBD_APPLE = 16;

/**
 * Code for capslock key.
 * @type {number}
 */
var KBD_CAPSLOCK_CODE = 0x14;

/**
 * Code for AltGr key.
 * @type {number}
 */
var KBD_ALTCTRL_CODE = 0x111;

/**
 * Code for Ctrl key.
 * @type {number}
 */
var KBD_CTRL_CODE = 0x11;

/**
 * Code for alt key.
 * @type {number}
 */
var KBD_ALT_CODE = 0x12;

/**
 * Code for apple key.
 * @type {number}
 */
var KBD_APPLE_CODE = 0xe0;

/**
 * Code for shift key.
 * @type {number}
 */
var SHIFT_KEYCODE = 0x10;

/**
 * Backspace char.
 * @type {string}
 */
var KBD_BACKSPACE = '\b';

/**
 * This is the namespace for external keyboard functions and classes.
 * Two values in gws version common js are referenced from here.
 * @type {Object}
 */
var GKBD = {};

/**
 * @type string Saved user agent string.
 */
GKBD.userAgent = navigator.userAgent.toLowerCase();

/**
 * @type boolean Is the browser Internet Explorer?
 */
GKBD.isIE = GKBD.userAgent.indexOf('msie') > 0 && !window.opera;

/**
 * @type boolean Is the browser Internet Explorer version higher than 7?
 */
GKBD.isIE7orAbove = GKBD.isIE &&
  (function() {
    var values = GKBD.userAgent.match(/msie (\d+)/);
    return values && values.length == 2 && values[1] >= 7;
  })();

/**
 * Keyboard is a representation of a physical keyboard,
 * minus some functional keys that cannot be intercepted anyway.
 * Keyboard owns one or more layouts.
 *
 * @param {Object} layer The layer (View) in which keyboard is displayed.
 * @param {Object} groups Associative array mapping each layout group name
 *                 to an array of layouts.
 * @param {Object} layouts Associative array mapping layout ids to layouts.
 * @param {Object} opt_defaultLayout A default layout instance.
 *
 * @constructor
 */
GKBD.Keyboard = function(layer, groups, layouts, opt_defaultLayout) {
  var self = this;
  var contentBuffer = [];
  var myState = 0;

  /**
   * Exposes the state, for testing purposes.
   * @return {number} The keyboard state.
   */
  self.getState = function() {
    return myState;
  }

  var isPressed = false;
  var isShiftClicked = false;
  var isDown = false;
  var currentCode = -1;
  var layoutId = '';
  var defaultLayout = opt_defaultLayout;

  /**
   * Layout switch history.
   * @type {Array.<string>}
   * @private
   */
  self.history_ = [];

  /**
   * Layout groups.
   * @type {Object}
   * @private
   */
  self.groups_ = groups;

  /**
   * Keyboard stale from configuration.
   * @type {number}
   * @private
   */
  self.scale_ = 1;

  /**
   * Current zoom scale.
   * @type {number}
   * @private
   */
  self.localscale_ = 1;

  /**
   * Contains buttons, referenced by key codes.
   * @type {Object}
   * @private
   */
  self.keys_ = {};

  /**
   * Current oem id - default is English layout.
   * @type {string}
   * @private
   */
  self.oemId_ = 'en';

  layoutId = defaultLayout ? defaultLayout.getId_() : '??';

  /**
   * OEM keyboard layout - button assignments and button widths.
   * @private
   */
  var physicalLayout = [
    {
      c: '\u00c01234567890m=',
      w: [27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 69]
    },
    {
      c: 'QWERTYUIOP\u00db\u00dd\u00dc',
      l: 39,
      w: [27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 57]
    },
    {
      c: 'ASDFGHJKL;\u00de',
      w: [54, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27],
      r: 67
    },
    {
      c: 'ZXCVBNM\u00bc\u00be\u00bf',
      w: [67, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 84]
    },
    {
      l: 80,
      w: [151],
      h: 22,
      r: 60
    }
  ];

  /**
   * OEM keyboard remapping table:
   * for each type (de, fr) we map a keyboard char to its "actual"
   * English counterpart: e.g. French AZERTY is decoded as QWERTY, etc.
   */
  var oemRemap = {
    'de': {
      'Y': 90,  //'Z'.charCodeAt(0),
      'Z': 89,  //'Y'.charCodeAt(0),
      '\u00dc': 0xc0,
      '\u00db': 109,  //'m'.charCodeAt(0),
      '\u00dd': 61,  //'='.charCodeAt(0),
      ';': 0xdb,
      '=': 0xdd,
      '\u00bf': 0xdc,
      '\u00cc': 59,  //';'.charCodeAt(0),
      'm': 0xbf
    },
    'fr': {
      'Q': 65,  //'A'.charCodeAt(0),
      'A': 81,  //'Q'.charCodeAt(0),
      'Z': 87,  //'W'.charCodeAt(0),
      'W': 90,  //'Z'.charCodeAt(0),
      '\u00dd': 0xdb,
      ';': 0xdd,
      'M': 59,  //';'.charCodeAt(0),
      '\u00c0': 0xde,
      '\u00de': 0xc0,
      '\u00bc': 77,  //'M'.charCodeAt(0),
      '\u00be': 0xbc,
      '\u00bf': 0xbe,
      '\u00df': 0xbf,
      '\u00db': 109  //'m'.charCodeAt(0)
    }
  };

  /**
   * Maps variants of keycodes for certain keys to the main English keycode
   * @private
   */
  var mergeCodes = {
    0xbd : 109,  //'m,'.charCodeAt(0),
    0xbb : 61,  //'='.charCodeAt(0),
    0xba : 59  //';'.charCodeAt(0)
  };

  /** Three physical keyboard layouts known in this world */
  var oems = 'endefr';

  /**
   * Sets keyboard state. Debug output commented out in production.
   *
   * @param {number} value New state.
   * @return {boolean} true if state was changed.
   */
  function setState(value) {
    var isChanged = myState != value;
    myState = value;
    if (isChanged) self.reassignButtons_();
    return isChanged;
  }

  /**
   * State setter exported as private.
   * @private
   */
  self.setState_ = setState;

  /**
   * Sets new oem id. There are three known oem ids for three different physical
   * keyboard layouts: generic (qwerty), French (azerty), German (qwertz).
   * Their ids are en, fr, de.
   *
   * @param {string} newOemId New id (see above).
   * @private
   */
  self.setOemId_ = function(newOemId) {
    self.oemId_ = newOemId;
    self.updateTitle_();
    layer.save_();
  };

  /**
   * Draws the whole keyboard.
   * Keyboard consists of four rows of key characters, as you can see from the
   * code below.
   * @private
   */
  self.drawKeyboard_ = function() {
    self.content_ = '';
    contentBuffer = ['<form style="margin-bottom:0" action="">'];
    var row = physicalLayout[0];
    // "1" to "+" buttons, and custom "backspace button"
    leftpad(row.l, row.h);
    drawRow(row, 0);
    drawButton(KBD_BACKSPACE, 'Backspace', row.w[13], .53);
    rightpad(row.r);

    row = physicalLayout[1];
    // "Q" to "|" buttons
    leftpad(row.l, row.h);
    drawRow(row, 0);
    rightpad(row.r);

    row = physicalLayout[2];
    // Custom "CapsLock", "A" to "'" buttons, optional "Enter" button
    leftpad(row.l);
    var clTitle = self.getCapslockTitle_();
    drawButtonWithStyle('\u0014', clTitle, row.w[0],
        buttonHeight, clTitle.length * .25);
    drawRow(row, 1);
    layer.hasEnter ? drawButton('\n', 'Enter', row.r, .9) :
        rightpad(row.r);

    row = physicalLayout[3];
    // Custom "Shift", Z to "?" buttons, and custom "alt ctrl"
    leftpad(row.l, row.h);
    drawButton('\u0010', 'Shift', row.w[0], .9);
    drawRow(row, 1);
    drawButton('\u0111', 'Alt+Ctrl', row.w[11], .85);
    rightpad(row.r);

    if (layer.hasSpacebar) {
      row = physicalLayout[4];
      leftpad(row.l, row.h);
      drawButtonWithStyle(' ', ' ', row.w[0],
          Math.round(row.h * self.scale_), 1);
      rightpad(row.r);
    }
    print('</form>');
    self.content_ = contentBuffer.join('');
  };

  /**
   * Serializes current keyboard state.
   * @return {string} Serialized state.
   * @private
   */
  self.serialize_ = function() {
    return oems.indexOf(self.oemId_) + self.history_.join('');
  };

  /**
   * Deserializes keyboard state.
   * @param {string} opt_data Keyboard state, as returned by serialize_();
   *                 if empty, set the default state of the keyboard.
   * @private
   */
  self.deserialize_ = function(opt_data) {
    if (!opt_data) {
      self.switchTo_(defaultLayout ? defaultLayout.getId_() : '??');
    } else {
      var oempos = opt_data.charCodeAt(0) - 48;
      var id = opt_data.substring(opt_data.length - 2);
      self.oemId_ = oems.substring(oempos, oempos + 2);
      self.switchTo_(id);
    }
  };

  /**
   * @return {Function} A layout switch function.
   * @private
   */
  self.getSwitcher_ = function() {
    return function(item) {
      layer.switchTo_(item.id);
    };
  };

  /**
   * Sets default layout.
   * @param {GKBD.Layout} layout Keyboard layout.
   * @private
   */
  self.setDefaultLayout_ = function(layout) {
    defaultLayout = layout;
  };

  /**
   * Switches between layouts.
   * @param {string} opt_id Id of the layout to switch to.
   *    If id is missing, switches to default layout.
   * @private
   */
  self.switchTo_ = function(opt_id) {
    var candidate;
    if (opt_id) {
      candidate = layouts[opt_id] ||
                  layouts[opt_id.toUpperCase()] ||
                  layouts[opt_id.substring(0, 2).toUpperCase()];
      layoutId = opt_id;
    }
    if (!candidate) {
      layoutId = defaultLayout ? defaultLayout.getId_() : '??';
      layer.setLayout_(defaultLayout);
      return;
    }

    if (self.layout_ && self.layout_.getId_() == opt_id) {
      return;
    }

    if (candidate.load_()) {
      layer.setLayout_(candidate);
    }
  };

  /**
   * Updates keyboard title.
   * @private
   */
  self.updateTitle_ = function() {
    var oemText = self.oemId_ == 'en' ? '' : KBD_oemHint[self.oemId_];
    if (self.layout_) {
      layer.setTitle_(
          self.layout_.getTitle_(),
          self.layout_.getShortTitle_(),
          oemText);
    } else {
      var title = '(loading...)'
      layer.setTitle_(title, title, oemText);
    }
  };

  /**
   * Sets a new keyboard layout.
   * @param {GKBD.Layout} layout The new layout.
   * @private
   */
  self.setLayout_ = function(layout) {
    if (self.layout_ != layout) {
      self.layout_ = layout;
      self.updateTitle_();
      self.reassignButtons_();
      var id = layout.getId_();
      for (var i = 0; i < self.history_.length; i++) {
        if (self.history_[i] == id) {
          self.history_.splice(i, 1);
        }
      }
      self.history_.push(id);
      if (self.history_.length > layer.historySize_) self.history_.shift();
    }
  };

  /**
   * Draws itself in a DOM element (probably a layer)
   * @private
   */
  self.draw_ = function() {
    self.updateTitle_();
    layer.setContent_(self.content_);
  };

  /**
   * Outputs html content.
   * @param {string} var_args The strings to add to content.
   */
  function print(var_args) {
    for (var i = 0; i < arguments.length; i++) {
      contentBuffer.push(arguments[i]);
    }
  };

  /**
   * Outputs a table cell of specified width.
   * @param {number} width Cell width.
   * @private
   */
  function emptySpace(width) {
    if (width) print('<td style="width:', px(width * self.scale_), '"/>');
  };

  /**
   * Outputs keyboard's left padding element.
   * @param {number} width Pad width.
   * @param {number} opt_height Pad height, if present.
   * @private
   */
  function leftpad(width, opt_height) {
    var height = (GKBD.isIE ? self.scale_ : .5) *
                 (opt_height || DEFAULT_BUTTON_HEIGHT);
    print('<table style="table-layout:fixed;margin-left:auto;' +
          'margin-right:auto;empty-cells:show;border-collapse:collapse" ' +
          'border="0" width="100%" cellspacing="0" cellpadding="0">' +
          '<tr align="center" style="height:', px(height), '">');
    if (width) {
      emptySpace(width);
    }
  };

  /**
   * Outputs keyboard's right padding element.
   * @param {number} width Pad width.
   * @private
   */
  function rightpad(width) {
    emptySpace(width);
    print('</tr></table>\n');
  };

  /**
   * class tag for buttons. Makes it easier to recognize them.
   * @type {string}
   */
  self.BUTTON_CLASSNAME = 'kbdButton';

  /**
   * Is the client Linux?
   * @type {boolean}
   */
  var isLinux = GKBD.userAgent.indexOf('linux') > -1;

  /**
   * Is the client Mac?
   * @type {boolean}
   */
  var isMac = GKBD.userAgent.indexOf('mac') > -1;

  /**
   * @type number Initial buttons font size.
   */
  var DEFAULT_FONT_SIZE = (isLinux || isMac || GKBD.isIE) ? 18 : 14;

  /**
   * @type number Initial button height.
   */
  var DEFAULT_BUTTON_HEIGHT = 30;

  /**
   * @type number Current button height.
   */
  var buttonHeight = DEFAULT_BUTTON_HEIGHT;

  /**
   * Draws a keyboard button.
   * @param {string} c The character for the button's OEM code.
   * @param {string} text The text to display on the button.
   * @param {number} width Button width.
   * @param {number} height Button heigth.
   * @param {number} fontScale Text size scale, for long texts, % to generic.
   * @param {string} opt_style Button style additions.
   * @private
   */
  function drawButtonWithStyle(c, text, width, height, fontScale, opt_style) {
    var fontSize = DEFAULT_FONT_SIZE * fontScale * self.localscale_;
    if (GKBD.isIE && !GKBD.isIE7orAbove) fontSize *= self.scale_;
    width = width * self.scale_;
    var code = c.charCodeAt(0);
    self.keys_[code] = undefined;
    var id = 'K' + code;
    print('<td style="margin:0; width:',
        width > 0 ? px(width) : '1px; visibility:hidden');
    print('"><input type="button" class="', self.BUTTON_CLASSNAME,
        '" id="', id);
    print('" name="', id, '" value="');

    if (text != '\u0000') {
      print(htmlEncode(text));
    }
    print('" style="width:100%;height:', px(height));
    print(';font-size:', px(fontSize));
    if (opt_style) print(';', opt_style);
    print('"/></td>');
  };

  /**
   * Draws a keyboard button.
   * @param {string} c The character for the button's OEM code.
   * @param {string} text The text to display on the button.
   * @param {number} width Button width.
   * @param {number?} opt_fontScale Text size scale; default is 1.
   * @private
   */
  function drawButton(c, text, width, opt_fontScale) {
    drawButtonWithStyle(c, text, width, buttonHeight, (opt_fontScale || 1));
  };

  /**
   * Draws a row of character buttons.
   * @param {Array} rowDescriptor An object describing the row.
   * @param {number} from Widths index, shows where button widths start.
   * @private
   */
  function drawRow(rowDescriptor, from) {
    for (var i = 0; i < rowDescriptor.c.length; i++) {
      var code = rowDescriptor.c.charAt(i);
      drawButton(code, code, rowDescriptor.w[i + from], rowDescriptor.h);
    }
  };

  /**
   * Transforms an incoming character, together with the previous sequence, into
   * a new character sequence, according to the transformation table.
   * E.g. if you type a '^' followed by 'o', you'll have an 'o circonflexe'.
   * And so on; in Japanese you can modify 'ha' to produce 'ba' or 'pa'.
   * See the tables.
   * @param {string} c The character to transform.
   * @return {string} Transformed sequence of characters.
   * @private
   */
  self.transform_ = function(c) {
    return self.layout_ && self.layout_.isInitialized ?
           self.layout_.transform_(c) :
           {chars: c};
  };

  /**
   * Clears transformation buffer.
   */
  function clearBuffer() {
    if (self.layout_) self.layout_.clearBuffer_();
  }

  /**
   * Processes a single input which may consist of several character(s).
   * Processing consists of inserting the characters into the consumer
   * input field.
   *
   * @param {Object} data A hash with two values:
   *        back {Number} Number of chars to replace (back from cursor position)
   *        chars {String} Characters to insert.
   */
  function processInput(data) {
    layer.replaceChars_(data);
  };

  /**
   * Data to interpret for backspace character.
   * @type {Object}
   */
  var backspaceData = {
    back: 1,
    chars: ''
  };

  /**
   * Onclick actions for special keys.
   */
  var specialKeyDispatch = {
    'K8': function() {
      clearBuffer();
      processInput(backspaceData);
    },
    'K10': function() {
      layer.processEnter();
    },
    'K16': function() {
      isShiftClicked = !isShiftClicked;
      doShift(!isShiftState());
    },
    'K20': function() {
      doCapslock();
    },
    'K273': function() {
      doAltGr();
    }
  };

  /**
   * Default onclick function.
   * @param {Element} element The button that is clicked.
   */
  self.buttonOnclick = function(element) {
    processInput(self.transform_(element.value));
  }

  /**
   * Builds a listener
   * @param {Function} listener The listener function.
   * @this Element The element to which the listener is attached.
   * @return {Function} The onclick listener.
   */
  function listenWith(listener) {
    return function() {
      listener(this);
      visualizeClick(this);
    };
  }

  /**
   * Links all our keyboard keys (four rows) to the buttons drawn in the
   * onscreen keyboard. The buttons are identified by their ids, which are
   * letter 'K' followed by the key code.
   */
  self.setListeners_ = function() {
    for (var code in self.keys_) {
      var id = 'K' + code;
      if (code.charCodeAt(0) < 58) { // what is it about 58?!
        var element = forId(id);
        self.keys_[code] = element;
        if (element) {
          element.onclick =
              listenWith(specialKeyDispatch[id] || self.buttonOnclick);
        }
      }
    }
  };

  /**
   * Checks whether keyboard shift is on
   * @return {boolean} Is shift on?
   */
  function isShiftState() {
    return (myState & KBD_SHIFT) == KBD_SHIFT;
  };

  /**
   * Checks whether keyboard capslock is on
   * @return {boolean} true Is capslock on?
   */
   function isCapsLockState() {
    return (myState & KBD_CAPS) == KBD_CAPS;
  };

  /**
   * Checks whether keyboard alt-gr state is on
   * @return {boolean} true Is alt-gr on?
   */
  function isAltGrState() {
    return (myState & KBD_ALTCTRL) == KBD_ALTCTRL;
  }

  /**
   * Gets a string representation of the keyboard status
   * @return {string} Status string.
   */
   function getStatus() {
     return (isShiftState() ? 's' : '') +
            (isAltGrState() ? 'c' : '') +
            (isCapsLockState() ? 'l' : '');
  };

  /**
   * Returns a keyboard button object for the keycode.
   * @param {number} keycode The OEM code from the keyboard (hopefully).
   * @return {Element} Matching button.
   * @private
   */
  function getButton(keycode) {
    return self.keys_[keycode];
  };

  /**
   * Resizes the keyboard on the screen according to text size.
   * @param {number} newScale New scale to resixe to.
   * @return {boolean} true if resize succeeded.
   */
  self.resizeTo_ = function(newScale) {
    if (newScale < 0) return false;
    self.scale_ = newScale;
    buttonHeight = Math.round(DEFAULT_BUTTON_HEIGHT * self.scale_);
    self.drawKeyboard_();
    layer.setContent_(self.content_);
    self.reassignButtons_();
    layer.resize_(newScale / self.localscale_);
    return true;
  };

  /**
   * Checks the changes in text size and resizes the keyboard if necessary.
   * @param {boolean} opt_required If true, resize is required.
   * @return {boolean} Whether it was actually resized.
   */
  self.tryResize_ = function(opt_required) {
    if (layer) {
      var newScale = layer.getScale_();

      if (opt_required || ((newScale < 5) &&
          (newScale > self.scale_ * 1.1 ||
           newScale < self.scale_) &&
          (newScale > 0.3))) {
        return self.resizeTo_(newScale);
      } else {
        return false;
      }
    }
  };

  /**
   * Gets current title for capslock button
   * @return {string} Title for Capslock button in current keyboard state.
   * @private
   */
  self.getCapslockTitle_ = function() {
    return (self.layout_ && self.layout_.capslockTitles_) ?
            self.layout_.capslockTitles_[isCapsLockState() ? 'l' : ''] :
            'C/Lk';
  };

  /**
   * Highlights (or unhighlights) the button (to visualize clicks).
   * @param {Element} button Button to highlight.
   * @param {boolean} condition On or off.
   */
  function highlight(button, condition) {
    if (button && button.style) {
      button.style.fontWeight = condition ? 'bold' : '';
    }
  }

  /**
   * Assigns to buttons their values from current mapping.
   */
  self.reassignButtons_ = function() {
    if (!self.layout_) {
      return;
    }
    var mapping = self.layout_.getMapping_(getStatus());
    var capslockButton = getButton(KBD_CAPSLOCK_CODE);
    if (capslockButton) {
      capslockButton.value = self.getCapslockTitle_();
      capslockButton.defaultValue = capslockButton.value;
      highlight(capslockButton, isCapsLockState());
    }
    highlight(getButton(SHIFT_KEYCODE), isShiftState());
    highlight(getButton(KBD_ALTCTRL_CODE), isAltGrState());
    if (mapping) {
      for (var i in mapping) {
        var value = mapping[i];
        if (typeof value === 'string') {
          var button = getButton(i.charCodeAt(0));
          if (button) {
            button.value = mapping[i];
          }
        }
      }
    }
  };

  /**
   * Processes capslock being pressed.
   * @private
   */
  function doCapslock() {
    setState(myState ^ KBD_CAPS);
    layer.redirectFocus_();
  };

  /**
   * Processes shift state change.
   * @param {boolean} newShift A new value of keyboard shift status.
   * @return {boolean} true if status did not change.
   */
  function doShift(newShift) {
    if (newShift == isShiftState()) {
      return true;
    }
    var newValue = newShift ? KBD_SHIFT : 0;
    setState(myState & ~KBD_SHIFT | newValue);
    layer.redirectFocus_();
    return false;
  };

  /**
   * Processes altGr state change
   * @param {Object} opt_newAltGr A new value of keyboard altGr status (0/1).
   */
  function doAltGr(opt_newAltGr) {
    setState((opt_newAltGr || !isAltGrState()) ?
        (myState | KBD_ALTCTRL) : (myState & ~KBD_ALTCTRL));
    layer.redirectFocus_();
  };

  /**
   * Returns unified English keycode for an event
   * 'unified' means that some browsers map some keyboard keys to different
   * codes; 'English' means that the actual keyboard may be French or German;
   * this is specified on this.oemId_ variable.
   * @param {Event} event Keyboard event.
   * @return {number} Key code.
   * @private
   */
  function getEventCode(event) {
    var code = event.which || event.keyCode || event.charCode;
    var remap = oemRemap[self.oemId_];
    if (remap) {
      code = remap[String.fromCharCode(code)] || code;
    }
    return mergeCodes[code] || code;
  };

  /**
   * Wraps event listener for standard keyboard processing.
   * @param {Function} listener Listener function.
   * @return {Function} Function that provides event and sets its return value.
   */
  function wrapEventListener(listener) {
    return function(event) {
      event = event || KBD_window.event;
      event.returnValue = listener(event);
      return event.returnValue;
    };
  }

  /**
   * Maps hot keys to actions
   */
  var hotKeyActions = {
    'G': function() { layer.toggle_(); },
    '\u00bc': function() { layer.nextLayout_(layoutId, -1); },
    '\u00be': function() { layer.nextLayout_(layoutId, 1); }
  };

  /**
   * Acts on hot key with given code.
   * @param {number} code Key code.
   * @return {boolean} true if event is consumed here.
   */
  function onHotkey(code) {
    if (myState != KBD_CTRL) return false;
    var key = String.fromCharCode(code);
    var action = hotKeyActions[key];
    if (!action) return false;
    action();
    return true;
  }

  /**
   * @return {boolean} true if our keyboard is present and listening.
   */
  function listening() {
    return layer && layer.isListening_ && layer.isListening_();
  }

  /**
   * Processes "key up" events.
   * @param {Event} event Keyboard event.
   * @return {boolean} true if need further propagation.
   */
  var onKeyUp = wrapEventListener(function(event) {
    if (!listening()) {
      return true;
    }
    var code = getEventCode(event);
    doShift(code != SHIFT_KEYCODE && isShiftPressed(event, code));
    isPressed = false;
    isShiftClicked = false;
    if (!isCtrlPressed(event)) setState(myState & ~KBD_CTRL);
    if (!isAltPressed(event, code)) setState(myState & ~KBD_ALT);
    if (code == KBD_APPLE_CODE || (myState & KBD_APPLE)) {
      setState(myState & ~KBD_APPLE);
      return true;
    }

    if (isSpecialEvent(event)) {
      if (isMetaPressed(event)) doAltGr(false);
      return true;
    }
    isDown = false;

    if (code == KBD_CAPSLOCK_CODE) {
      doCapslock();
    }

    return false;
  });

  /**
   * Processes "key down" events.
   * @param {Event} event Keyboard event.
   * @return {boolean} false if event processing if finished here,
   * true if need more.
   */
  var onKeyDown = wrapEventListener(function(event) {
    var code = getEventCode(event);
    if (!listening()) {
      return event.returnValue = true;
    }
    isPressed = true;
    var target = event.target || event.srcElement;
    // TODO(vpatryshev): check if we can get rid of the following line  
    layer.setFocusListener(target);

    if (target) try {
      target.onfocus();
    } catch (e) {
      // silently ignore the failure
    }
    if (code == KBD_CAPSLOCK_CODE) {
      return event.returnValue = true;
    }

    if (code == KBD_APPLE_CODE || (myState & KBD_APPLE)) {
      setState(myState | KBD_APPLE);
      return event.returnValue = true;
    }

    if (isMetaPressed(event)) {
      doAltGr(isMetaPressed(event));
      return event.returnValue = true;
    }

    if (isCtrlPressed(event)) setState(myState | KBD_CTRL);
    if (isAltPressed(event, code)) setState(myState | KBD_ALT);

    if (isSpecialEvent(event) ||
        code == KBD_CTRL_CODE ||
        code == KBD_ALT_CODE) {
      return event.returnValue = !onHotkey(code);
    }

    if (code == SHIFT_KEYCODE) {
      return event.returnValue = doShift(true);
    }
    return event.returnValue = processRegularButtonDown(event, code, target);
  });

  /**
   * Processes regular button down event.
   * 
   * @param {Event} event Button event.
   * @param {number} code Cey code.
   * @param {Element} target The target element that will receive input.
   * @return {boolean} true of event should propagate.
   */
  function processRegularButtonDown(event, code, target) {
    isDown = true;
    currentCode = code;

    // this additional shift processing is needed
    // for the browsers that do not return Shift Down event,
    // but instead provide shift bit with the regular key event.
    // In this case we have to both react to shift change and process the key.
    if (!isShiftClicked) {
      doShift(isShiftPressed(event, code));
    }
    isShiftClicked = false;

    var button = getButton(code);

    if (button) {
      // Note regarding this "redirectfocus".
      // In NS9, if the tab where it is all happening is not visible,
      // the event is being ignored.
      layer.redirectFocus_();
      var focusSwitcher = KBD_window['_kbdSI'];
      if (target && focusSwitcher &&
          self.BUTTON_CLASSNAME != target['className']) {
        focusSwitcher(target);
      }

      button.onclick();
    } else {
      isPressed = false;
      clearBuffer();
    }
    return !button;
  }

  /**
   * Processes a 'key pressed' event. In most cases this method is not called,
   * since 'key up' and 'key down' do all the job - but on some occasions
   * in some browsers we have to deal with this event, too.
   *
   * @param {Event} event Keyboard event.
   * @return {boolean} false if event processing if finished here, else true.
   */
  var onKeyPress = wrapEventListener(function(event) {
    if (!listening()) {
      return true;
    }

    if (myState & KBD_APPLE) {
      return true;
    }

    if (myState == KBD_CTRL) {
      return true;
    }

    if (isPressed || !isDown) {
      isPressed = false;
      return false;
    }

    // curious linux Firefox behavior; ignore capslock
    if (listening() && currentCode != KBD_CAPSLOCK_CODE) {
      var button = getButton(currentCode);

      if (button) {
        if (isDown) {
          clearBuffer();
        } else {
          button.onclick();
          isDown = false;
        }
        return false;
      }
    }

    clearBuffer();
    isPressed = false;
    return true;
  });

  /**
   * These three variables save original keyboard listeners
   */
  var savedOnkeyup;
  var savedOnkeydown;
  var savedOnkeypress;


  /**
   * Starts listening to keyboard events.
   */
  self.startListening_ = function() {
    if (KBD_document.onkeyup != onKeyUp) {
      savedOnkeyup = KBD_document.onkeyup;
      KBD_document.onkeyup = onKeyUp;
    }
    if (KBD_document.onkeydown != onKeyDown) {
      savedOnkeydown = KBD_document.onkeydown;
      KBD_document.onkeydown = onKeyDown;
    }
    if (KBD_document.onkeypress != onKeyPress) {
      savedOnkeypress = KBD_document.onkeypress;
      KBD_document.onkeypress = onKeyPress;
    }
  };

  /**
   * Stops listening to key events.
   */
  self.stopListening_ = function() {
    self.startListening_();
    return; // have to listen to hotkeys
    if (KBD_document.onkeyup == onKeyUp) {
      KBD_document.onkeyup = savedOnkeyup;
    }
    if (KBD_document.onkeydown == onKeyDown) {
      KBD_document.onkeydown = savedOnkeydown;
    }
    if (KBD_document.onkeypress == onKeyPress) {
      KBD_document.onkeypress = savedOnkeypress;
    }
  };

  /**
   * Visualizes button click. Flashes button color for 70 ms.
   * Implementation notes. Flashing layer background color does not work on Mac.
   * Flashing button background color leads to dropping "default button style"
   * on windows.
   * @param {Object} button The button to highlight.
   */
  function visualizeClick(button) {
    var prevcolor = button.style.backgroundColor;
    button.style.backgroundColor = 'cfcfcf';
    button.style.padding = 0;
    // Get the cached timeout action or create a new one; save it.
    // Caching the function saves us from creating a new instance every
    // button click - which would be essentially a memory leak.
    button.flash = button.flash ||
        function() {
          button.style.backgroundColor = prevcolor;
        };
    KBD_window.setTimeout(button.flash, 70);
  }
};

//javascript/keyboard/kbdlayout.js
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
  var CODES =
    ['\u00c0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'm', '=',
     'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
          '\u00db', '\u00dd', '\u00dc',
     'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\u00de',
     'Z', 'X', 'C', 'V', 'B', 'N', 'M', '\u00bc', '\u00be', '\u00bf'];

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
            parsed[CODES[i]] = allChars.charAt(i);
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
          var c = CODES[j];
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

//javascript/keyboard/kbdlayer.js
// Copyright 2006 Google Inc. All Rights Reserved.

/**
 * @fileoverview This file contains an implementation of Keyboard Layer class.
 *
 * It is a singleton, and the instance is called GKBD.layer.
 * All layer-related functionality, all communications with consumer input
 * fields for keyboard input, and cookie extange is here. It is 'C' in MVC.
 * Some code is borrowed from common.js, with the sole purpose of minimizing
 * the size of the binary.
 *
 *  @author vpatryshev@google.com
 */

/**
 * Html word.
 * @type {string}
 */
var ABSOLUTE = 'absolute';

/**
 * Html word.
 * @type {string}
 */
var FIXED = 'fixed';

/**
 * Html word.
 * @type {string}
 */
var HIDDEN = 'hidden';

/**
 * Html word.
 * @type {string}
 */
var VISIBLE = 'visible';

/**
 * Html words.
 * @type {string}
 */
var ENDROWENDTABLE = '</tr></table>';

/**
 * Converts a nonnegative number to a string, 62-based.
 * This function is used for packing keyboard location coordinates.
 * @see #toBase62
 *
 * @param {number} n The number to convert.
 * @return {string} A string representing the number.
 */
function toBase62(n) {
  var buf = [];
  if (n <= 0) {
    return '0';
  }
  while (n > 0) {
    var d = n % 62;
    buf.push(String.fromCharCode(d + (d < 10 ? 48 : d < 36 ? 55 : 61)));
    n = Math.floor(n / 62);
  }
  return buf.reverse().join('');
}

/**
 * Converts a string containing a 62-based number, to a number.
 * @see #toBase62
 * @param {string} s The string containing the number.
 * @return {number} Converted number.
 */
function fromBase62(s) {
  var n = 0;
  if (!s) {
    return 0;
  }
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    var d = c - (c < 58 ? 48 : c < 91 ? 55 : 61);
    n = n * 62 + d;
  }
  return n;
}

/**
 * Stops event propagation.
 * @param {Event} event The event which propagation we need to stop.
 */
function stopPropagation(event) {
  event &&
  (event.stopPropagation ? event.stopPropagation() :
                          (event.cancelBubble = true));
}

/** Extracts keyboard cookie value from full cookie text.
 * @param {string} cookie Cookie text.
 * @return {string} A string, or the empty string if no cookie found.
 */
function extractCookieValue(cookie) {
  if (!cookie) return '';
  var matches = cookie.match(/(^|;)KBD=([^;]+)/);

  return !matches ? '' : matches[2];
}

/** Gets keyboard cookie.
 * @return {string} a string, or the empty string if no cookie found.
 */
function getCookie() {
  return extractCookieValue(String(KBD_document.cookie));
}

/**
 * Builds a chunk of html that works like a link and is styled according to
 * Google style requirements.
 * @param {string} content The text.
 * @param {string?} opt_id Element id for this link.
 * @param {string?} opt_onclick A click callback function name.
 * @return {string} A html chunk, span that behaves like a link.
 * @private
 */
GKBD.buildLink_ = function(content, opt_id, opt_onclick) {
  return ['<a style=' +
       '"text-decoration:none;cursor:pointer;font-size:80%;color:',
       GKBD.layer.linkColor,
        '" ' +
       'onmouseover="this.style.textDecoration=\'underline\'" ' +
       'onmouseout="this.style.textDecoration=\'none\'" ',
       opt_id ? ('id="' + opt_id + '" ') : '',
       (opt_onclick ? ('onclick="' + opt_onclick + '"') : ''),
       '>',
       content, '</a>'].join('');
};

/**
 * Known keyboard visibility states.
 * v - active, fully visible
 * M - minimized, active
 * m - minimized, inactive
 * h - hidden, inactive
 * @type {string}
 * @private
 */
var visibilities_ = 'vMmh';

/**
 * Keyboard layer widths, per visibility state.
 * @type {Object}
 */
var WIDTH = {'v': 435, 'M': 330, 'm': 280, 'h': 0};

/**
 * Keyboard layer class.
 *
 * @constructor
 */
GKBD.KBDLayer = function() {
  var self = this;
  var container;
  var containerStyle;
  var defaultLayout;
  var keyboard;
  var isListening = false;
  var oemText = '';
  var groups = {};
  var maxX = 1;
  var homeX = 1;
  var maxY = 1;

  /**
   * Current horizontal keyboard position.
   * @type {number}
   * @private
   */
  self.x_ = -1;

  /**
   * Current vertical keyboard position.
   * @type {number}
   * @private
   */
  self.y_ = -1;

  var targetX = -1;
  var targetY = -1;

  /**
   * Scroll horizontal position.
   * @type {number}
   */
  self.scrollX = 0;

  /**
   * Scroll vertical position.
   * @type {number}
   */
  self.scrollY = 0;

  /**
   * Can minimize this keyboard?
   * @type {boolean}
   * @private
   */
  self.canMinimize_ = true;

  /**
   * Title alignment (either left or right, depending on rtl/ltr).
   * @type {string}
   * @private
   */
  self.titleAlignmnent_ = 'left';

  /**
   * Relative horizontal coordinate.
   * @type {number}
   * @private
   */
  self.relX_ = 0;

  /**
   * Relative vertical coordinate.
   * @type {number}
   * @private
   */
  self.relY_ = 0;

  /**
   * Default visibility.
   * @type {string}
   */
  self.defaultVisibility = 'h';

  /**
   * Current visibility.
   * @type {string}
   * @private
   */
  self.visibility_ = 'h';

  /**
   * Code for hidden visibility. Can change during config.
   * @type {string}
   * @private
   */
  self.hiddenVisibility_ = 'h';

  /**
   * All layouts in this keyboard.
   * @type {Object}
   * @private
   */
  self.layouts_ = {};

  /**
   * All layout ids in this keyboard.
   * @type {Array.<string>}
   */
  var layoutIds = [];

  /**
   * Number of layouts in this keyboard.
   * @type {number}
   */
  var numLayouts = 0;

  /**
   * Layout history depth. Default is 1: no history.
   * @type {number}
   * @private
   */
  self.historySize_ = 1;

  /**
   * Default text color.
   * @type {string}
   * TODO(vpatryshev) make it work
   */
  self.textColor = 'black';

  /**
   * Default link color.
   * @type {string}
   * TODO(vpatryshev) make it work
   */
  self.linkColor = 'blue';

  /**
   * Default background color.
   * @type {string}
   */
  self.bgColor = '#eaf2ff';

  /**
   * Default frame color.
   * @type {string}
   */
  self.frameColor = '#d7e6ff';

  /**
   * Text for "open keyboard" message.
   * @type {string}
   */
  self.msgOpen = '';

  /**
   * Text for "close keyboard" message.
   * @type {string}
   */
  self.msgClose = '';

  /**
   * Keyboard scale.
   * @type {number}
   */
  self.scale = 1;

  /**
   * Kind of keyboard positioning on the document.
   * @type {string}
   * @private
   */
  self.positioning_ = GKBD.isIE ? ABSOLUTE : FIXED;

  /**
   * Does this keyboard have title?
   * @type {boolean}
   * @private
   */
  self.hasTitle_ = true;

  /**
   * Short version of keyboard title.
   * @type {string}
   */
  self.shortTitle = '';
  self.hasSpacebar = false;
  self.hasEnter = false;

  /**
   * Configures the keyboard layout.
   * @param {Object} configuration A hash of configuration parameters.
   */
  self.configure = function(configuration) {
    for (var item in configuration) {
      var goodItem = item.charAt(0) == '_' ? item.substring(1) : item;

      if (configuration.hasOwnProperty(item) &&
        typeof self[goodItem] != 'undefined') {
        self[goodItem] = configuration[item];
      }
    }
  };

  /**
   * Builds the layer for keyboard.
   * @return {GKBD.KBDLayer} New layer.
   */
  function buildKeyboardLayer() {
    var newdiv = KBD_document.createElement('div');
    var style = newdiv.style;
    style.position = self.positioning_;
    style.visibility = 'hidden';
    style.width = '390px';
    style.zIndex = 20001; // livejournal + 1
    style.backgroundColor = self.frameColor;
    newdiv.innerHTML = '<div dir="ltr" id="kbda"><div id="kbd_0"/></div>';
    newdiv.setAttribute('id', 'kbd');
    KBD_client.appendChild(newdiv);
    return newdiv;
  }

  /**
   * Attaches an element to the window, under a given id.
   * @param {Element} element The element to attach.
   * @param {string} id Element id.
   */
  function attachElement(element, id) {
    element.setAttribute('id', id);
    KBD_client.appendChild(element);
  }

  /**
   * Setup queue contains the methods that should be called on setup.
   * The default one connects events and listener objects.
   * The advantages of having a queue for setup are that, first, you do setup
   * only once; and two, to add more setup functionality elsewhere in the code,
   * one just has to push one more function into this queue.
   * @type {Array.<Function>}
   * @private
   */
  self.setupQueue_ = [function() {
    container = buildKeyboardLayer();
    if (!keyboard) {
      keyboard =
      self.keyboard_ =
          new GKBD.Keyboard(self, groups, self.layouts_, defaultLayout);
    }
    self.keyboard_.localscale_ = self.scale;
    containerStyle = container.style;
    containerStyle.position = self.positioning_;

    /**
     * Acts on window resize: resizes this keyboard.
     */
    GKBD.onResize = function() {
      // Snap to home position on resize: need it on IE.
      self.isNearHome_() ? self.goHome_() : self.reposition_();
    };

    var oldOnResize = KBD_window.onresize;

    function myOnResize() {
      GKBD.onResize();
      if (oldOnResize) oldOnResize();
    }

    if (myOnResize != oldOnResize) KBD_window.onresize = myOnResize;

    keyboard.draw_();
    self.setLayout_(defaultLayout, true);

    /**
     * Saves the keyboard layer state in the keyboard cookie.
     * @private
     */
    self.save_ = function() {
      KBD_document.cookie = 'KBD=' + serialize() + ';expires=July 19, 2051';
    };

    if (containerStyle.position == ABSOLUTE) {
      GKBD.onscroll = function() {
        self.scrollX = KBD_document_element && KBD_document_element.scrollLeft;
        if (!self.scrollX) self.scrollX = KBD_client.scrollLeft;
        self.scrollY = KBD_document_element && KBD_document_element.scrollTop;
        if (!self.scrollY) self.scrollY = KBD_client.scrollTop;
        self.moveTo_(self.x_, self.y_);
      };

      var oldOnScroll = KBD_window.onscroll;

      function myOnScroll() {
        KBD_window.onscroll = function() {
          KBD_window.GKBD.onscroll();
          if (oldOnScroll) oldOnScroll();
        }
      }

      if (oldOnScroll != KBD_window.onscroll) KBD_window.onscroll = myOnScroll;
    }
  }];

  /**
   * Setup method. Initializes the keyboard, after the document is loaded.
   */
  self.setup = function() {
    for (var i = 0; i < self.setupQueue_.length; i++) {
      self.setupQueue_[i](self);
    }

    containerStyle.backgroundColor = self.frameColor;
  };

  /**
   * Gets current scale. 
   * @return {number} Best scale for the keyboard.
   * @private
   */
  self.getScale_ = function() {
    var element = forId('kbd_tx');
    return element ? elementHeight(element) / 20 : -1;
  };

  /**
   * @return {number} Keyboard's x coordinate.
   */
  self.left = function() {
    return container.offsetLeft;
  };

  /**
   * @return {number} Keyboard's y coordinate.
   */
  self.top = function() {
    return container.offsetTop;
  };

  /**
   * Returns client height in various possible environments.
   * @author: rlemon
   * @see http://www.codingforums.com/archive/index.php?t-77296.html
   * @see http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
   *
   * @return {number} Client height.
   * @private
   */
  self.clientHeight_ = function() {
    return KBD_window.innerHeight ||
           KBD_document_element.clientHeight ||
           KBD_client.clientHeight;
  };

  /**
   * @return {number} Client width.
   * @private
   */
  self.clientWidth_ = function() {
    return KBD_client.clientWidth;
  }

  /**
   * Calculates the layer size, from container layer size.
   */
  function calculateSize() {
    self.height = elementHeight(container);
    self.width_ = elementWidth(container);
    maxX = self.clientWidth_() - self.width_;
    homeX = self.rtl_ ? 0 : maxX;
    maxY = self.clientHeight_() - self.height;
    targetX = Math.floor(maxX * (self.rtl_ ? self.relX_ :
                                 (1 - self.relX_)) + .5);
    targetY = Math.floor(maxY * (1 - self.relY_) + .5);
  };

  /**
   * Serializes the keyboard layer state, together with the keyboard state.
   * What is stored: layer position; layer visibility, and keyboard state.
   * Some people ask: why serialize? The reason is simple: when the user opens
   * another page, it is natural to expect that keyboard remains where it was,
   * in exactly the same state.
   * @return {string} Serialized keyboard state.
   */
  function serialize() {
    return keyboard.serialize_() + '-' +
        toBase62(Math.floor(2000 * self.relX_) * 4804 +
                 Math.floor(1200 * self.relY_) * 4 +
                 visibilities_.indexOf(self.visibility_));
  };

  /**
   * Tries to deserializes the keyboard layer state.
   * @param {string} data Serialized format from a cookie:
   *     First come keyboard state, then '-',
   *     then position and visibility.
   *     Position and visibility are andcoded like in {@see serialize}.
   */
  function tryDeserialize(data) {
    var kbdEnd = data.indexOf('-');
    var posBegin = kbdEnd + 1;
    if (kbdEnd < 0) {
      kbdEnd = 3;
      posBegin = 3;
    }
    keyboard.deserialize_(data.substring(0, kbdEnd));
    self.relX_ = 0;
    self.relY_ = 0;
    var xyv = fromBase62(data.substring(posBegin));
    var v = visibilities_.charAt(xyv % 4);
    self.deserializePosition_(Math.floor(xyv / 4));
    self.showAs_(v);
  };

  /**
   * Deserializes the keyboard layout state; resets to current state if fails.
   * @param {string} data Cookie data (@see tryDeserialize_).
   */
  function deserialize(data) {
    self.showAsDefault_();
    if (!data) {
      keyboard.deserialize_();
      return;
    }

    try {
      tryDeserialize(data);
    } catch (ex) {
      self.showAsDefault_();
    }

    if (self.visibility_ != 'h') {
      keyboard.tryResize_(true);
    }
  };

  /**
   * Does nothing for uninitialized layer.
   */
  self.save_ = function() {};

  /**
   * Sets our focus listener on an element.
   *
   * @param {Element} element The element that will report onfocus.
   */
  self.setFocusListener = function(element) {
    if (element) {
      var oldListener = element.onfocus;
      if (!oldListener) {
        element.onfocus = function() {
          KBD_window['_kbdSI'](element);
        };
      } else if (oldListener.toString().indexOf('_kbdSI') < 0) {
        element.onfocus = function() {
          KBD_window['_kbdSI'](element);
          oldListener();
        };
      }
    }
  }

  /**
   * Initializes input fields in a given list
   *
   * @param {Array.<Element>} list The list of input elements.
   * @return {boolean} true if at least one such element found.
   */
  function initInputs(list) {
    var found = false;
    for (var i = 0; i < list.length; i++) {
      found = initInput(list[i]) || found;
    }
    return found;
  }

  /**
   * Initializes an input field, so that it can ping the keyboard.
   *
   * @param {Element} element The element that may be initialized.
   * @return {boolean} true if an input was found.
   */
  function initInput(element) {
    if (!element) return false;
    var foundSomething = false;
    var nodeName = element.nodeName.toLowerCase();
    if (nodeName == 'textarea' ||
        nodeName == 'input' && element.type.toLowerCase() == 'text') {
      foundSomething = true;
      if (!element.hasKeyboard) {
        self.setFocusListener(element);
        element.hasKeyboard = true;
      }
    }
    return foundSomething;
  }

  /**
   * How often (once in how many wakeups) dom is rescanned to find new inputs.
   * @type {number}
   */
  var RESCAN_FREQUENCY = 10;

  /**
   * Restores the keyboard layer state.
   * @private
   */
  function restoreKeyboard() {
    configureDom();
    var oldVersion = forId('kbd');
    if (oldVersion) {
      removeElement(oldVersion, KBD_document);
    }
    var isInitialized = false;
    var rescanCounter = 0;

    function refresh() {
      if (rescanCounter == 0) {
        var foundSomething =
            initInputs(KBD_document.getElementsByTagName('textarea')) |
            initInputs(KBD_document.getElementsByTagName('input'));
        if (!foundSomething) {
          return false;
        }
      }
      rescanCounter = (rescanCounter + 1) % RESCAN_FREQUENCY;
      if (!isInitialized) {
        self.setup();
        deserialize(getCookie());
        isInitialized = true;
      }
      return keyboard.tryResize_();
    }

    /**
     * Watches browser text size changes
     * Does it using timer, since there are no events for text size change.
     * A Y-combinator would be handy for a function to reference itself.
     */
    function watch() {
      KBD_window.setTimeout(watch, refresh() ? 130 : 1300);
    };
    watch();
    refresh(); // for testing
  };

  /**
   * Export restoration function, depending on the flag.
   */
  self.restore_ = KBD_enabled ? restoreKeyboard : function(){};

  /**
   * Adds a keyboard layout to the layer.
   * @param {string} groupName Layout group name.
   * @param {GKBD.Layout} layout New layout to add.
   * @return {GKBD.Layout} The layout.
   * @private
   */
  self.addLayout_ = function(groupName, layout) {
    layout.group = groupName;
    if (!self.layouts_[layout.getId_()]) {
      numLayouts++;
      var id = layout.getId_();
      layoutIds.push(id);
      self.layouts_[id] = layout;
      groups[groupName] = groups[groupName] || [];
      groups[groupName].push(layout);
    }
    return layout;
  };

  /**
   * Adds a layout group to the collection of of layouts
   * @param {string} groupName E.g. West-European (EN-US is one).
   * @param {Array.<Object>} source An array of sources (@see layout.js).
   */
  function addGroup(groupName, source) {
    for (var i = 0; i < source.length; i++) {
      self.addLayout_(groupName, new GKBD.Layout(source[i]));
    }
  };

  /**
   * Adds groups of layouts.
   * @param {Array.<object>} groups Groups and their arrays of layouts.
   * @private
   */
  self.addGroups_ = function(groups) {
    for (var name in groups) {
      addGroup(name, groups[name]);
    }
  };

  /**
   * Sets default keyboard layout.
   * Note that it can happen that keyboard is not there yet,
   * so we have to keep it until setup() is called.
   * @param {GKBD.Layout} layout The layout that is assigned to be default.
   * @private
   */
  self.setDefaultLayout_ = function(layout) {
    if (keyboard && layout) {
      keyboard.setDefaultLayout_(layout);
    }
    defaultLayout = layout;
  };

  /**
   * Sets current layout.
   * @param {Object} layout The layout to set.
   * @param {boolean} opt_dontSave If specified, status is not saved.
   * @private
   */
  self.setLayout_ = function(layout, opt_dontSave) {
    if (keyboard && layout) {
      keyboard.setLayout_(layout);
      self.rtl_ = layout.isRtl_();
      calculateSize();
      if (!opt_dontSave) self.save_();
    }
  };

  /**
   * Switches to another keyboard layout. E.g. from Ruritainan to Aramaic.
   * @param {string} layoutId Layout id (which is a two-letter language code).
   * @private
   */
  self.switchTo_ = function(layoutId) {
    if (isListening) {
      keyboard.switchTo_(layoutId);
      if (self.consumer_) {
        self.consumer_.lang = layoutId;
      }
      showAs(self.visibility_); // We need it so that tests see the new mapping.
      self.redirectFocus_();
    }
  };

  /**
   * Switches to next layout from given id; step shows what means 'next'.
   * @param {string} layoutId Id of probably current layout.
   * @param {number} step Step where to move, e.g. -1 means back one,
   *     +2 means 2 forward.
   * @private
   */
  self.nextLayout_ = function(layoutId, step) {
    for (var i = 0; i < layoutIds.length; i++) {
      if (layoutIds[i] == layoutId) {
        self.switchTo_(
            layoutIds[(i + layoutIds.length + step) % layoutIds.length]);
      }
    }
  }

  /**
   * Redirect focus to current consumer. This may be nessesary after, say,
   * a user clicks the keyboard button - the focus then in on the button,
   * and it is not what the user expects.
   * @private
   */
  self.redirectFocus_ = function() {
    try {
      var consumer = self.consumer_;
      if (consumer && consumer.style) {
        var visibility = consumer.style.visibility;
        if (!visibility || visibility == VISIBLE) {
          consumer.focus();
        }
      }
    } catch(e) {
//    silently ignore stale or nonexistent elements
      delete self.consumer_;
    }
  };

  /**
   * Processes 'enter' key. Passes it only if the consumer is text area,
   */
  self.processEnter = function() {
    if (self.consumer_ && (self.consumer_.tagName === 'TEXTAREA')) {
      self.replaceChars_('\n');
    }
  };

  /**
   * Replaces a group of characters in the input field with a new group.
   * We need this to implement input methods, e.g. to make 'dead keys' work.
   *
   * @param {Array} data A hash with two values:
   *     back {Number} Number of chars to replace (back from cursor position)
   *     chars {String} Characters to insert.
   * @private
   */
  self.replaceChars_ = function(data) {
    var n = 0;
    var chars = data;
    if (typeof data != 'string') {
      n = data.back;
      chars = data.chars;
    }

    var subject = self.consumer_;

    if (!subject || (GKBD.isIE && !subject.isContentEditable)) return;
    self.redirectFocus_();
    var value = subject.value || '';
    var from = subject.selectionStart;

    if (!!KBD_document.selection) {
      var range = KBD_document.selection.createRange();
      if (range.parentElement() == subject) {
        range.moveStart('character', -n);
        range.text = chars;
      }
      range.collapse(false);
      range.select();
    } else if (from || from == '0') {
      var to = subject.selectionEnd;
      var head = from > n ? value.substring(0, from - n) : '';
      subject.value = head + chars + value.substring(to, value.length);
      subject.selectionEnd =
          subject.selectionStart = from + chars.length - n;
    } else {
      subject.value = value.length < n ?
                      chars :
                      value.substring(0, value.length - n) + chars;
    }
  };

  /**
   * Sets up keyboard title element.
   *
   * @return {Object} The title element of keyboard layer.
   */
  function setupTitle() {
    var titleArea = forId('kbd_t');
    if (titleArea) {
      self.setTitleMouseActions_(titleArea);
      forId('kbd_ta').onclick = function(event) {
        if (!isEnabled()) {
          minimize();
          stopPropagation(event);
        }
      };
    }
    return titleArea;
  };

  /**
   * Sets mouse actions for the title.
   * @param {Element} element Title element.
   * @private
   */
  self.setTitleMouseActions_ = function(element) {
    // do nothing by default
  };

  /**
   * Wraps a text in gray.
   * @param {string} text The text to make gray.
   * @return {string} the Html chunk.
   */
  function gray(text) {
    return '<span style="cursor:pointer;color:#676767;font-weight:bold"> ' +
    text +
    '</span>';
  }

  /**
   * Sets keyboard title.
   * @param {string} fullText The full title text.
   * @param {string} shortText The short title text.
   * @param {string?} opt_oemText Physical keyboard layout name
   *                             (empty for generic).
   * @private
   */
  self.setTitle_ = function(fullText, shortText, opt_oemText) {
    self.titleText =
        isEnabled() ? fullText : gray(self.shortTitle || shortText);
    oemText = opt_oemText || '';
    drawTitle();
  };

  /**
   * @return {string} Keyboard oem hint text.
   */
  function getOemIdContent() {
    return oemText ?
      ('<font size="-2"><div style="color:' + self.textColor +
       ';border:solid 1px;' +
       'height:1em;width:1.5em">&nbsp;' + oemText + '&nbsp;</div></font>') :
      '';
  };

  /**
   * Returns title context. Need this declared as a function, so that mixins
   * could override the behavior and be able to return fancy titles.
   * @return {string} Title text.
   * @private
   */
  self.getTitleContent_ = function() {
    return self.titleText;
  };

  /**
   * Redraws keyboard title.
   */
  function drawTitle() {
    var titleArea = setupTitle();

    if (titleArea && (self.hasTitle_ || numLayouts > 1)) {
      titleArea.innerHTML = self.getTitleContent_();
      var oemIdArea = forId('kbd_oi');
      if (oemIdArea) {
        oemIdArea.innerHTML = getOemIdContent();
      }
    }
  };

  /**
   * Sets listeners for keyboard buttons.
   * @private
   */
  self.setListeners_ = function() {
    var hideButton = forId('kbd_h');
    if (hideButton) {
      hideButton.onclick = function(event) {
        self.hide_();
        stopPropagation(event);
      };
    }

    var minmaxButton = forId('kbd_mm');
    if (minmaxButton) {
      minmaxButton.onclick = function(event) {
        if (self.visibility_ == 'v') {
          minimize();
        } else if (self.visibility_ == 'M') {
          maximize();
        }
        stopPropagation(event);
      };
    }

    keyboard.setListeners_();
  };

  /**
   * Draws a chunk of html with "open keyboard" message.
   * @return {string} The html chunk.
   */
  function drawOpen() {
    return self.msgOpen && self.msgOpen.charAt(0) != '_'?
           ('<td align="right">' +
            GKBD.buildLink_(self.msgOpen) +
            '</td>') : '';
  }

  /**
   * Builds a chunk of html with "close keyboard" message.
   * @return {string} The html chunk.
   */
  function drawClose() {
    return self.msgClose && self.msgClose.charAt(0) != '_' ?
           ('<td border=1 align=right>' +
            GKBD.buildLink_(self.msgClose, 'kbd_h') +
            '</td>') : '';
  }

  /**
   * Draws minmax action text/icon.
   * Note. Do not inline this function; the multilayout version
   * overrides this method with the one that uses icons.
   * @return {string} A chunk of html with the action text/icon.
   * @private
   */
  self.drawMinMax_ = function() {
    return (isHidden() ? drawOpen : drawClose)();
  };

  /**
   * Builds the content of the keyboard container element.
   * @param {string} text Keyboard html.
   * @return {string} A chunk of html that is keyboard content.
   * @private
   */
  self.buildContent_ = function(text) {
    return [
      '<center style="margin: 0 0;font-family:arial,sans-serif;">' +
      '<table id="kbdt" border="0" width="100%" style="border:none;">' +
      '<tr>' +
      '<td>' +
      '<table id="kbd_ta" border="0" width="100%" style="font-size:',
      Math.round(self.scale * 100),
      '%',
      '">' +
      '<tr><td><span id="kbd_tx" ' +
      'style="visibility:hidden;margin:0px;padding:0px">I</span></td>' +
      '<td id="kbd_t" align="',
      self.titleAlignmnent_,
      '" style="font-size:',
      self.titleHeight_,
      (self.titleCursor_ ? ';cursor:' + self.titleCursor_: ''),
      '">',
      '</td><td align="left" id="kbd_oi" width="3px"></td>',
      '<td style="font-size:',
      self.titleHeight_,
      '">',
      self.drawMinMax_(),
      ENDROWENDTABLE,
      '</td>' +
      '</tr>' +
      '<tr valign="top">' +
      '<td align="center">' +
      '<div id="kbd_mka" style="display:',
      (self.visibility_ == 'v' ? 'block': 'none'),
      '">' +
      '<table border="0" style="border:none;background-color:',
      self.bgColor,
      '">' +
      '<tr><td align="center">',
      text,
      '</td>',
     ENDROWENDTABLE,
     '</div>' +
     '</td>',
     ENDROWENDTABLE,
     '</center>'
    ].join('');
  }

  /**
   * Sets keyboard layer content.
   * @param {string} text The html for the keyboard (and we add the rest).
   * @private
   */
  self.setContent_ = function(text) {
    self.titleHeight_ = px(15 * self.scale);
    var htmlContainer = forId('kbd_0');
    if (!htmlContainer) {
      return;
    }
    htmlContainer.innerHTML = self.buildContent_(text);
    drawTitle();

    self.setListeners_();
  };

  /**
   * Saves relative keyboard position.
   * @private
   */
  self.saveRelativePosition_ = function() {
    calculateSize();
    var previousX = self.relX_;
    var previousY = self.relY_;
    self.relX_ = Math.min(1, (self.rtl_ ? self.x_ : (maxX - self.x_)) / maxX);
    self.relY_ = Math.min(1, 1 - self.y_ / maxY);
    if (previousX != self.relX_ &&
        previousY != self.relY_) {
      self.save_();
    }
  };

  /**
   * Moves keyboard to a different location.
   * @param {number} xNew New x coordinate.
   * @param {number} yNew New y coordinate.
   * @private
   */
  self.moveTo_ = function(xNew, yNew) {
    self.x_ = Math.min(maxX, Math.max(0, xNew));
    self.y_ = Math.min(maxY, Math.max(0, yNew));
    containerStyle.left = px(self.x_ + self.scrollX);
    containerStyle.top = px(self.y_ + self.scrollY);
  };

  /**
   * Repositions the keyboard according to its relative coordinates.
   * @private
   */
  self.reposition_ = function() {

    calculateSize();

    var patience = 3;
    while (patience-- > 0 && (targetX != self.x_ || targetY != self.y_)) {
      self.moveTo_(targetX, targetY);
      calculateSize();
    }
  };

  /**
   * Resizes the layer according to scale.
   * @param {number} scale The scale; 1 is normal size.
   * @private
   */
  self.resize_ = function(scale) {
    if (self.visibility_ != 'h') {
      var width = WIDTH[self.visibility_] * keyboard.localscale_ * scale + 10;
      containerStyle.width = px(width);
      containerStyle.height = px(elementHeight(forId('kbd_0')));
      self.reposition_();
    }
  };

  /**
   * Checks whether the keyboard is near its bottom right corner.
   * @return {boolean} true if keyboard is located near home position.
   * @private
   */
  self.isNearHome_ = function() {
    calculateSize();
    var dist = Math.abs(homeX - self.x_) + Math.abs(maxY - self.y_);
    return dist < 90;
  };

  /**
   * Moves keyboard to its home position (bottom right corner).
   * @private
   */
  self.goHome_ = function() {
    self.relX_ = self.relY_ = 0;
    calculateSize();
    self.moveTo_(homeX, maxY);
    self.reposition_();
    self.saveRelativePosition_();
  };

  /**
   * Is the keyboard visible?
   * @return {boolean} true if it is visible.
   */
  function isVisible() {
    return containerStyle.visibility == VISIBLE &&
           self.visibility_ != self.hiddenVisibility_;
  }

  /**
   * Toggles keyboard visibility.
   * @private
   */
  self.toggle_ = function() {
    if (isVisible()) {
      self.hide_();
    } else if (self.visibility_ == 'M') {
      minimize();
    } else {
      maximize();
    }
  };

  /**
   * @return {boolean} true if keyboard is enabled.
   */
  function isEnabled() {
    return 'vM'.indexOf(self.visibility_) >= 0;
  };

  /**
   * Stops listening to key events.
   * @private
   */
  self.stopListening_ = function() {
    keyboard.stopListening_();
    isListening = false;
  };

  /**
   * Starts listening to keyboard-related events.
   * @private
   */
  self.startListening_ = function() {
    if (!isListening && isEnabled()) {
      keyboard.startListening_();
      isListening = true;
    }
  };

  /**
   * Checks whether keyboard is in listening state.
   * @return {boolean} true if it is listening to key events.
   * @private
   */
  self.isListening_ = function() {
    return isListening;
  };

  /**
   * Detects whether the state hides the keyboard.
   * @param {string?} opt_visibility State to check.
   *        If missing, current state is tested.
   * @return {boolean} true if keyboard is in 'hidden' state.
   */
  function isHidden(opt_visibility) {
    return 'hm'.indexOf(opt_visibility || self.visibility_) >= 0;
  };

  /**
   * This function makes sense for the keyboard that has icons.
   * @param {string} visibility Keyboard visibility status.
   * @private
   */
  self.setMinMaxButton_ = function(visibility) {
  };

  /**
   * Displays the layer either in full ('v') or minimized ('m' or 'M') mode.
   * @param {string} visibility Code for visibility.
   * @private
   */
  self.showAs_ = function(visibility) {
    if (isHidden(visibility)) {
      self.visibility_ = self.hiddenVisibility_;
      self.stopListening_();
      self.redirectFocus_();
      if (self.visibility_ == 'h') {
        containerStyle.visibility = HIDDEN;
        keyboard.updateTitle_();
        return;
      }
    } else {
      keyboard.reassignButtons_();
    }
    if (visibility == 'M' && !self.canMinimize_) {
      visibility = 'v';
    }
    self.visibility_ = visibility;
    keyboard.updateTitle_();
    var contentLayer = forId('kbd_mka');
    if (!contentLayer) {
      return;
    }
    contentLayer.style.display = visibility == 'v' ? 'block' : 'none';
    self.reposition_();
    self.startListening_();
    keyboard.scale_ = 1;
    self.setMinMaxButton_(visibility);
    keyboard.tryResize_(true);

    self.redirectFocus_();
    containerStyle.visibility = VISIBLE;
  };

  /**
   * Shows keyboard in its default state.
   */
  self.showAsDefault_ = function() {
    self.showAs_(self.defaultVisibility);
  }

  /**
   * Maximizes the keyboard.
   */
  function maximize() {
    showAs('v');
  };

  /**
   * Minimizes the keyboard, keeping it active, but showing title only.
   */
  function minimize() {
    showAs(self.canMinimize_ ? 'M' : 'v');
  };

  /**
   * Changes visibility level of the keyboard.
   * @param {string} visibility Visibility to set.
   */
  function showAs(visibility) {
    self.showAs_(visibility);
    self.save_();
    self.keyboard_.tryResize_(true);
  }

  /**
   * Hides and deactivates the keyboard.
   * @private
   */
  self.hide_ = function() {
    showAs(self.hiddenVisibility_);
  };

  /**
   * Shows and activates the keyboard.
   * @private
   */
  self.show_ = function() {
    showAs('v');
  };
};

/**
 * The singleton instance of keyboard layer.
 * @type {Object}
 */
GKBD.layer = new GKBD.KBDLayer();

/**
 * In the non-draggable version, the only position avaliable is home
 * (missionary) position.
 * @type {Function}
 * @private
 */
GKBD.layer.deserializePosition_ = GKBD.layer.goHome_;

/**
 * Sets a document element to which to send typed or clicked characters.
 * Such an element is called 'consumer'.
 * This is our "API" - an element that wants keyboard input should have
 * onfocus="_kbdSI(this);..."
 *
 * @param {Element} element An input element that will take keyboard keys.
 * @deprecated Do not use it; keyboard attaches itself to input elements.
 */
KBD_window['_kbdSI'] = function(element) {
  if (element &&
      element != GKBD.layer.consumer_ &&
      element['className'] != GKBD.layer.keyboard_.BUTTON_CLASSNAME) {
    GKBD.layer.consumer_ = element;
    if (element.prompt) element.prompt = null;
    if (element.lang) GKBD.layer.switchTo_(element.lang);
  }
};

/**
 * Hides the keyboard.
 */
KBD_window['_kbdHide'] = function() {
  GKBD.layer.hide_();
};

/**
 * Configures a typical standalone keyboard (no menu).
 * @param {string} opt_msgOpen "Open it" txt.
 * @param {string} opt_msgClose "Close it" text.
 * @param {string} opt_shortTitle Short title for the keyboard.
 */
function standaloneKeyboard(opt_msgOpen, opt_msgClose, opt_shortTitle) {
  GKBD.layer.configure({
    canMinimize_: false,
    defaultVisibility: 'm',
    hiddenVisibility_: 'm',
    msgOpen: opt_msgOpen || 'on',
    msgClose: opt_msgClose || 'off',
    shortTitle: opt_shortTitle
  });
}

/**
 * Loads the layout from given data.
 * @param {Object} data Contains layout description.
 * @private
 */
GKBD.layer.loader_ = function(data) {
  var layout = GKBD.layer.addLayout_('-', new GKBD.Layout(data));
  layout.getTitle_ = layout.titleTextBuilder_({});
  GKBD.layer.setDefaultLayout_(layout);
  standaloneKeyboard(data.msgOpen, data.msgClose);
};

/**
 * Possibly loads, and then parses the layer.
 * @param {Object} data Contains layout description.
 */
function KBD_loadme(data) {
  GKBD.layer.loader_(data);
}

/**
 * Switches layout; {see GKBD.layer.switchTo}.
 * @param {string} id Layout id.
 */
KBD_window['_kbdS2'] = function(id) {
  GKBD.layer.switchTo_(id);
};

/**
 * Stores the previous value of window.onload.
 * @type Function
 */
var oldOnLoad = KBD_window.onload;

/**
 * Onload listener.
 */
function myOnLoad() {
  if (GKBD.layer.restore_) GKBD.layer.restore_();
  GKBD.layer.restore_ = null;
  if (oldOnLoad) oldOnLoad();
}

/**
 * Initialize the keyboard layer.
 */
if (!KBD_window._kbdSignature ||
    KBD_window._kbdSignature != GKBD._kbdSignature) {
  oldOnLoad = KBD_window.onload;
  KBD_window.onload = myOnLoad;
  KBD_window._kbdSignature = GKBD._kbdSignature = new Date();
}

//javascript/keyboard/keyboard_ru.js
// Copyright 2006 Google Inc.
// All Rights Reserved

/**
 * @fileoverview This file contains configuration for Russian keyboard: two
 * layouts and specific messages for the case of just two layouts, standard
 * and translit.
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */

/**
 * Included are are two Russian keyboard layouts, and a default English one.
 */

standaloneKeyboard('\u0432\u043a\u043b\u044e\u0447\u0438\u0442\u044c',
    '\u0432\u044b\u043a\u043b',
    '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430');

GKBD.layer.loader_ = function(data) {
  var layout = GKBD.layer.addLayout_("-", new GKBD.Layout(data));
  layout.getTitle_ = layout.titleTextBuilder_(
      {'EN': 'English',
       'RU': '\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0430\u044f',
       'Ru': '\u0442\u0440\u0430\u043d\u0441\u043b\u0438\u0442'
       });
  GKBD.layer.setDefaultLayout_(layout);
}

//javascript/keyboard/layout/WestEuropean/EN.js
KBD_loadme({
  id: 'EN',
  name: 'English',
  title: 'English',
  id:'EN,EN:English:English Keyboard',

  mappings: {
    'scl': {
      '': '~\u00b1@\u00a3\u00a2\u00a4\u00ac\u00a6\u00b2\u00b3\u00bc\u00bd\u00be' +
          'qw\u00e9rty\u00fa\u00ed\u00f3p[]\\' +
          '\u00e1sdfghjkl;\'' +
          'zx\u00e7vb\u00f1\u00b5\u00af\u00ad\u00b4'
    },
    'sc': {
      '': '~\u00b1@\u00a3\u00a2\u00a4\u00ac\u00a6\u00b2\u00b3\u00bc\u00bd\u00be' +
          'QW\u00c9RTY\u00da\u00cd\u00d3P[]\\' +
          '\u00c1SDFGHJKL;\'' +
          'ZX\u00c7VB\u00d1\u00b5\u00af\u00ad\u00b4'
    },
    'cl': {
      '': '~\u00b1@\u00a3\u00a2\u00a4\u00ac\u00a6\u00b2\u00b3\u00bc\u00bd\u00be' +
          'QW\u00c9RTY\u00da\u00cd\u00d3P[]\\' +
          '\u00c1SDFGHJKL;\'' +
          'ZX\u00c7VB\u00d1\u00b5\u00af\u00ad\u00b4'
    },
    'c': {
      '': '\u00a7\u00b1\u00b6\u00a3\u00a2\u00a4\u00ac\u00a6\u00b2\u00b3\u00bc\u00bd\u00be' +
          '\u20acw\u00e9rty\u00fa\u00ed\u00f3p[]\\' +
          '\u00e1sdfghjkl;\'' +
          'zx\u00e7vb\u00f1\u00b5\u00af\u00ad\u00b4'
    },
    'sl': {
      '': '~!@#$%^&*()_+' +
          'qwertyuiop{}|' +
          'asdfghjkl:"' +
          'zxcvbnm<>?'
    },
    'l': {
      '': '`1234567890-=' +
          'QWERTYUIOP[]\\' +
          'ASDFGHJKL;\'' +
          'ZXCVBNM,./'
    },
    's': {
      '': '~!@#$%^&*()_+' +
          'QWERTYUIOP{}|' +
          'ASDFGHJKL:"' +
          'ZXCVBNM<>?'
    },
    '': {
      '': '`1234567890-=' +
          'qwertyuiop[]\\' +
          'asdfghjkl;\'' +
          'zxcvbnm,./'
    }
  }
});

//javascript/keyboard/layout/EastEuropean/RU_LATN.js
KBD_loadme({
  id:'RU_LATN,Ru:Russian (Translit):' +
     '\u041a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430 translit',
  tooltip: 'Russian keyboard',
  msgOpen: '\u0432\u043a\u043b\u044e\u0447\u0438\u0442\u044c',
  msgClose: '\u0432\u044b\u043a\u043b',

  mappings: {
    'sl':{
      '': '\u044a!@#$%^&*()\u044c\u044d' +
          '\u044f\u0436\u0435\u0440\u0442\u044b\u0443\u0438\u043e\u043f' +
          '\u0448\u0449\u044e' +
          '\u0430\u0441\u0434\u0444\u0433\u0447\u0439\u043a\u043b:"' +
          '\u0437\u0445\u0446\u0432\u0431\u043d\u043c<>?'
    },
    'l': {
      '': '\u042a1234567890\u042c\u042d' +
          '\u042f\u0416\u0415\u0420\u0422\u042b\u0423\u0418\u041e\u041f' +
          '\u0428\u0429\u042e' +
          '\u0410\u0421\u0414\u0424\u0413\u0427\u0419\u041a\u041b;\'' +
          '\u0417\u0425\u0426\u0412\u0421\u041d\u041c,./'
    },
    's': {
      '': '\u042a!@#$%^&*()\u042c\u042d' +
          '\u042f\u0416\u0415\u0420\u0422\u042b\u0423\u0418\u041e\u041f' +
          '\u0428\u0429\u042e' +
          '\u0410\u0421\u0414\u0424\u0413\u0427\u0419\u041a\u041b:"' +
          '\u0417\u0425\u0426\u0412\u0421\u041d\u041c<>?'
    },
    '':  {
      '': '\u044a1234567890\u044c\u044d' +
          '\u044f\u0436\u0435\u0440\u0442\u044b\u0443\u0438\u043e\u043f' +
          '\u0448\u0449\u044e' +
          '\u0430\u0441\u0434\u0444\u0433\u0447\u0439\u043a\u043b;\'' +
          '\u0437\u0445\u0446\u0432\u0431\u043d\u043c,./'
    },
    'sc':{
      '\u00c0m=':
          '\u0462_+',
      'QWERTOP\u00db\u00dd\u00dc':
          '\u0407\u0478\u046a\u046c\u0464\u0405\u046e{}|',
      'ASJKL;':
          '\u0472\u0470\u0460\u047e\u047a\u047c',
      'ZXBNM':
          '\u0466\u0468\u0406\u0474\u0476'
    },
    'cl':{
      '\u00c0m=':
          '\u0462-=',
      'QWERTOP\u00db\u00dd\u00dc':
          '\u0407\u0478\u046a\u046c\u0464\u0405\u046e[]\\',
      'ASJKL;':
          '\u0472\u0470\u0460\u047e\u047a\u047c',
      'ZXBNM':
          '\u0466\u0468\u0406\u0474\u0476'
    },
    'c': {
      '\u00c0m=':
          '\u0463-=',
      'QWERTOP\u00db\u00dd\u00dc':
          '\u0457\u0479\u046b\u046d\u0465\u0455\u046f[]\\',
      'ASJKL;':
          '\u0473\u0471\u0461\u047f\u047b\u047d',
      'ZXBNM':
          '\u0467\u0469\u0456\u0475\u0477'
    },
    'scl':{
      '\u00c0m=':
          '\u0463_+',
      'QWERTOP\u00db\u00dd\u00dc':
          '\u0457\u0479\u046b\u046d\u0465\u0455\u046f{}|',
      'ASJKL;':
          '\u0473\u0471\u0461\u047f\u047b\u047d',
      'ZXBNM':
          '\u0467\u0469\u0456\u0475\u0477'
    }
  },
  transform: { // this rare and questionable letter may deserve a transform:
    //           jo                       JO
    '\u0439\u043e':'\u0451', '\u0419\u041e':'\u0401',
    //           yo                       YO
    '\u044b\u043e':'\u0451', '\u042b\u041e':'\u0401'
  }
}
);

//javascript/keyboard/layout/EastEuropean/RU.js
KBD_loadme(
  {
    id:'RU,RU:Russian:\u0420\u0443\u0441\u0441\u043a\u0430\u044f&nbsp;' +
           '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430',
    name:'Russian',
    tooltip: 'Russian keyboard',
    msgOpen: '\u0432\u043a\u043b\u044e\u0447\u0438\u0442\u044c',
    msgClose: '\u0432\u044b\u043a\u043b',
    
    mappings: {
      'sl': {
        '':'\u0451!\"\u2116;%:?*()_+' +
           '\u0439\u0446\u0443\u043a\u0435\u043d\u0433\u0448\u0449\u0437' +
           '\u0445\u044a/' +
           '\u0444\u044b\u0432\u0430\u043f\u0440\u043e\u043b\u0434\u0436\u044d'+
           '\u044f\u0447\u0441\u043c\u0438\u0442\u044c\u0431\u044e,'
      },
      'l':  {
        '':'\u04011234567890-=' +
           '\u0419\u0426\u0423\u041a\u0415\u041d\u0413\u0428\u0429\u0417' +
           '\u0425\u042a\\' +
           '\u0424\u042b\u0412\u0410\u041f\u0420\u041e\u041b\u0414\u0416\u042d' +
           '\u042f\u0427\u0421\u041c\u0418\u0422\u042c\u0411\u042e.'
          },
      's':  {
        '':'\u0401!\"\u2116;%:?*()_+' +
           '\u0419\u0426\u0423\u041a\u0415\u041d\u0413\u0428\u0429\u0417' +
           '\u0425\u042a/' +
           '\u0424\u042b\u0412\u0410\u041f\u0420\u041e\u041b\u0414\u0416\u042d'+
           '\u042f\u0427\u0421\u041c\u0418\u0422\u042c\u0411\u042e,'
        },
      '':   {
        '':'\u04511234567890-=' +
           '\u0439\u0446\u0443\u043a\u0435\u043d\u0433\u0448\u0449\u0437' +
           '\u0445\u044a\\' +
           '\u0444\u044b\u0432\u0430\u043f\u0440\u043e\u043b\u0434\u0436\u044d'+
            '\u044f\u0447\u0441\u043c\u0438\u0442\u044c\u0431\u044e.'
          },
      'sc':{
        '\u00c0=':
            '\u0462+',
        'QWERTOP\u00db\u00dd\u00dc':
            '\u0407\u0478\u046a\u046c\u0464\u0405\u046e{}|',
        'ASJKL;':
            '\u0472\u0470\u0460\u047e\u047a\u047c',
        'ZXBNM':
            '\u0466\u0468\u0406\u0474\u0476'
      },
      'cl':{
        '\u00c0=':
            '\u0462+',
        'QWERTOP\u00db\u00dd\u00dc':
            '\u0407\u0478\u046a\u046c\u0464\u0405\u046e[]\\',
        'ASJKL;':
            '\u0472\u0470\u0460\u047e\u047a\u047c',
        'ZXBNM':
            '\u0466\u0468\u0406\u0474\u0476'
      },
      'c': {
        '\u00c0=':
            '\u0463=',
        'QWERTOP\u00db\u00dd\u00dc':
            '\u0457\u0479\u046b\u046d\u0465\u0455\u046f[]\\',
        'ASJKL;':
            '\u0473\u0471\u0461\u047f\u047b\u047d',
        'ZXBNM':
            '\u0467\u0469\u0456\u0475\u0477'
      },
      'scl':{
        '\u00c0=':
            '\u0463=',
        'QWERTOP\u00db\u00dd\u00dc':
            '\u0457\u0479\u046b\u046d\u0465\u0455\u046f{}|',
        'ASJKL;':
            '\u0473\u0471\u0461\u047f\u047b\u047d',
        'ZXBNM':
            '\u0467\u0469\u0456\u0475\u0477'
      }
    }
  }
);


//javascript/keyboard/kbdlayerdrag.js
// Copyright 2006 Google Inc.
// All Rights Reserved.
/**
 * @fileoverview This file contains a part of
 * Keyboard Layer class implementation.
 * This file contains the dragging functionality part.
 *
 *  @author vpatryshev@google.com
 */

/**
 * Set the "can drag" option to true.
 * @type boolean
 * @private
 */
GKBD.layer.canDrag_ = true;

/**
 * Is it dragging rignt now?
 * @type boolean
 */
GKBD.layer.dragging = false;

/**
 * The cursor to show when keyboard is being dragged.
 * @type string
 * @private
 */
GKBD.layer.titleCursor_ = 'move';

/**
 * Sets listeners for mouse on/off actions.
 * @param {Element} element The element to which drag listener is attached.
 * @this Object Keyboard layer.
 * @private
 */
GKBD.layer.setTitleMouseActions_ = function(element) {
  var self = this;
  element.onmousedown = function(event) {
    self.dragOn(event || KBD_window.event);
    return false;
  };

  element.onblur = function(event) {
    self.dragOff();
  };
};

/**
 * Deserializes keyboard position, moving the keyboard to the place encoded
 * in the parameter.
 * @param {number} xyv x and y, coordinates, and v, visibility, as one number.
 * @this Object Keyboard layer.
 * @private
 */
GKBD.layer.deserializePosition_ = function(xyv) {
  var self = this;
  self.relY_ = Math.floor(xyv % 1201) / 1200;
  self.relX_ = Math.floor(xyv / 1201) / 2000;
  self.reposition_();

  if (self.isNearHome_()) {
    self.goHome_();
  }
};

/**
 * Reacts to the end of keyboard dragging action.
 * @this Object Keyboard layer.
 */
GKBD.layer.dragOff = function() {
  var self = this;
  if (self.dragging) {
    self.saveRelativePosition_();
    self.startListening_();
    self.dragging = false;
  }
};

/**
 * Reacts to the start of keyboard dragging action.
 * @param {Event} evt An event (click).
 * @this Object Keyboard layer.
 */
GKBD.layer.dragOn = function(evt) {
  var self = this;
  self.cx = evt.clientX - self.left();
  self.cy = evt.clientY - self.top();
  self.dragging = true;
};

/**
 * Drags the keyboard to the position specified by an event
 *
 * @param {Event} event Mouse move event.
 * @return {boolean} Stopped dragging?
 * @this Object Keyboard layer.
 */
GKBD.layer.drag = function(event) {
  var self = this;
  if (self.dragging) {
    self.moveTo_(event.clientX - self.cx - self.scrollX,
                 event.clientY - self.cy - self.scrollY);
  }
  return !self.dragging;
};

/**
 * Adds dragging functionality to the keyboard layer.
 * @param {Object} self The layer.
 */
GKBD.layer.setupQueue_.push(function(self) {
  self.dragging = false;
  KBD_document.onmousemove = function(event) {
    return self.drag(event || KBD_window.event);
  };

  KBD_document.onmouseup = function() {
    self.dragOff();
    return false;
  };
});

