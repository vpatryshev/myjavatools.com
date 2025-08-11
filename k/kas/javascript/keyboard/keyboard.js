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
 * @param {Object} groups Associative array mapping each layout group name
 *                 to an array of layouts.
 * @param {Object} layouts Associative array mapping layout ids to layouts.
 * @param {Object} opt_defaultLayout A default layout instance.
 *
 * @constructor
 */
GKBD.Keyboard = function(groups, layouts, opt_defaultLayout) {
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

  layoutId = defaultLayout ? defaultLayout.id : '??';

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
   * Sets keyboard state.
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
    GKBD.layer.save_();
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
    GKBD.layer.hasEnter ? drawButton('\n', 'Enter', row.r, .9) :
        rightpad(row.r);

    row = physicalLayout[3];
    // Custom "Shift", Z to "?" buttons, and custom "alt ctrl"
    leftpad(row.l, row.h);
    drawButton('\u0010', 'Shift', row.w[0], .9);
    drawRow(row, 1);
    drawButton('\u0111', 'Alt+Ctrl', row.w[11], .85);
    rightpad(row.r);

    if (GKBD.layer.hasSpacebar) {
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
      GKBD.layer.switchTo_(item.id);
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
      GKBD.layer.setLayout_(defaultLayout);
      return;
    }

    if (self.layout_ && self.layout_.getId_() == opt_id) {
      return;
    }

    if (candidate.load_()) {
      GKBD.layer.setLayout_(candidate);
    }
  };

  /**
   * Updates keyboard title.
   * @private
   */
  self.updateTitle_ = function() {
    var oemText = self.oemId_ == 'en' ? '' : KBD_oemHint[self.oemId_];
    if (self.layout_) {
      GKBD.layer.setTitle_(
          self.layout_.getTitle_(),
          self.layout_.getShortTitle_(),
          oemText);
    } else {
      var title = '(loading...)'
      GKBD.layer.setTitle_(title, title, oemText);
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
      if (self.history_.length > GKBD.layer.historySize_) {
        self.history_.shift();
      }
    }
  };

  /**
   * Draws itself in a DOM element (probably a layer)
   * @private
   */
  self.draw_ = function() {
    self.updateTitle_();
    GKBD.layer.setContent_(self.content_);
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
    GKBD.layer.replaceChars_(data);
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
      GKBD.layer.processEnter();
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
    GKBD.layer.setContent_(self.content_);
    self.reassignButtons_();
    GKBD.layer.resize_(newScale / self.localscale_);
    return true;
  };

  /**
   * Checks the changes in text size and resizes the keyboard if necessary.
   * @param {boolean} opt_required If true, resize is required.
   * @return {boolean} Whether it was actually resized.
   */
  self.tryResize_ = function(opt_required) {
    if (GKBD.layer) {
      var newScale = GKBD.layer.getScale_();

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
    GKBD.layer.redirectFocus_();
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
    GKBD.layer.redirectFocus_();
    return false;
  };

  /**
   * Processes altGr state change
   * @param {Object} opt_newAltGr A new value of keyboard altGr status (0/1).
   */
  function doAltGr(opt_newAltGr) {
    setState((opt_newAltGr || !isAltGrState()) ?
        (myState | KBD_ALTCTRL) : (myState & ~KBD_ALTCTRL));
    GKBD.layer.redirectFocus_();
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
      return event.returnValue = listener(event);
    };
  }

  /**
   * Maps hot keys to actions
   */
  var hotKeyActions = {
    'G': function() { GKBD.layer.toggle_(); },
    '\u00bc': function() { GKBD.layer.nextLayout_(layoutId, -1); },
    '\u00be': function() { GKBD.layer.nextLayout_(layoutId, 1); }
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
    return GKBD.layer && GKBD.layer.isListening_();
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
    GKBD.layer.setFocusListener(target);

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
      GKBD.layer.redirectFocus_();
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
