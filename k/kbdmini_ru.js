// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 *  #fileoverview This file contains a model of physical keyboard:
 *  it is an 'M' in MVC.
 *
 *  @author vpatryshev@google.com
 *
 */

function barf(msg) {
//  if (!confirm(msg + "\ncontinue?")) throw "Aborted";
}

/**
 * This is the namespace for external keyboard functions and classes. 
 */
var GKBD = {};

/**
 * Checks whether a variable is defined.
 */
GKBD.isDef = function(v) {
  return typeof v != "undefined";
};


/**
 * Returns an element by its id
 * @param id
 * @return an element
 */
var forId = document.getElementById ?
    function(id) {
      return document.getElementById(id);
    } :
    function() {
      return function (id) {
        barf("looking up " + id);
        return document.all[id];
      };
    }();


/**
 * Encodes a string for display
 * @param s {String} The string to encode
 * @return the string where all unsafe characters are escaped
 * @private
 */
function htmlEncode(s) {
  var result = [];
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    var code = s.charCodeAt(i);
    result.push('\\\'\"'.indexOf(c) >= 0 || code > 127 || code < 33 ?
                ("&#" + code + ";") : c);
  }
  return result.join('');
}


// browser detection - from common.js
GKBD.isIE = navigator.userAgent.toLowerCase().indexOf('msie') != -1 &&
            !window.opera;
GKBD.isMobile = navigator.userAgent.toLowerCase().indexOf('ppc') != -1;

/**
 * Marks whether we have 'Event' class available
 */
var EVENTS_DEFINED = GKBD.isDef(window['Event']);


/**
 * "Ctrl" or "Alt" or "Meta" mask
 * On a strange occasion when Event class is not defined, the value is 0.
 */
var CTL_ALT_META = EVENTS_DEFINED ?
    (Event.CONTROL_MASK | Event.ALT_MASK | Event.META_MASK) : 0;


var CTL_ALT = EVENTS_DEFINED ? (Event.CONTROL_MASK || Event.ALT_MASK) : 0;


/**
 * Checks whether it is a special character - alt, ctrl, and meta (wtf is it?)
 * @param event Keyboard event
 */
function isSpecialEvent(event) {
  return (event.ctrlKey && !event.altKey) || (event.modifiers & CTL_ALT_META);
};


/**
 * Checks whether meta is currently pressed, according to the event
 * @param event Keyboard event
 * @return true if is pressed
 * @private
 */
function isMetaPressed(event) {
  return EVENTS_DEFINED && (event.modifiers & Event.META_MASK) ? 1 : 0;
};


/**
 * Checks whether ctrl is currently pressed, according to the event
 * @param event Keyboard event
 * @return true if is pressed
 * @private
 */
function isCtrlPressed(event) {
  return event.ctrlKey ||
         EVENTS_DEFINED && (event.modifiers & Event.CONTROL_MASK) ?
         1 : 0;
};


/**
 * Checks whether alt is currently pressed, according to the event
 * @param event Keyboard event
 * @return true if is pressed
 * @private
 */
function isAltPressed(event) {
  return event.altKey ||
         EVENTS_DEFINED && (event.modifiers & Event.ALT_MASK) ? 1 : 0;
};


/**
 * Checks whether the events will turn the keyboard into Alt-Gr state
 * @param event Keyboard event
 * @return true if ctrl and alt are pressed
 */
function isAltGrEvent(event) {
  return (isCtrlPressed(event) && isAltPressed(event)) ||
         isMetaPressed(event);
};


/**
 * Checks whether shift is currently pressed, according to the event
 * @param event Keyboard event
 * @return true if is pressed
 * @private
 */
function isShiftPressed(event) {
  return event.shiftKey ||
         EVENTS_DEFINED && (event.modifiers & Event.SHIFT_MASK) ? 1 : 0;
};


/**
 * OEM keyboard layout - key widths.
 * @private
 */
var KBD_format = [[0,30,30,30,30,30,30,30,30,30,30,30,30,30,73],
                  [40,30,30,30,30,30,30,30,30,30,30,30,30,63,0],
                  [0,56,30,30,30,30,30,30,30,30,30,30,30,0,74],
                  [0,75,30,30,30,30,30,30,30,30,30,30,93,0]];


/**
 * English OEM keyboard layout - key codes assignment, four rows
 * @private
 */
var KBD_rows = ['\u00c01234567890m=',
                'QWERTYUIOP\u00db\u00dd\u00dc',
                'ASDFGHJKL;\u00de',
                'ZXCVBNM\u00bc\u00be\u00bf'];

/**
 * OEM keyboard remapping table:
 * for each type (de, fr) we map a keyboard char to its "actual"
 * English counterpart, so that, e.g. French AZERTY is decoded as QWERTY, etc.
 */
var KBD_remap = {
  'de': {'Y':'Z'.charCodeAt(0), 'Z':'Y'.charCodeAt(0),
    '\u00dc':0xc0, '\u00db':'m'.charCodeAt(0), '\u00dd':'='.charCodeAt(0),
    ';':0xdb, '=':0xdd, '\u00bf':0xdc,
    '\u00cc':';'.charCodeAt(0), 'm':0xbf},
  'fr': {'Q':'A'.charCodeAt(0), 'A':'Q'.charCodeAt(0), 'Z':'W'.charCodeAt(0),
    'W':'Z'.charCodeAt(0),
    '\u00dd':0xdb, ';':0xdd, 'M':';'.charCodeAt(0),
    '\u00c0':0xde, '\u00de':0xc0, '\u00bc':'M'.charCodeAt(0),
    '\u00be':0xbc, '\u00bf':0xbe, '\u00df':0xbf,
    '\u00db':'m'.charCodeAt(0)}
};


/**
 * Maps variants of keycodes for certain keys to the main English keycode
 * @private
 */
var KBD_mergeCodes = {
  0xbd : 'm'.charCodeAt(0),
  0xbb : '='.charCodeAt(0),
  0xba : ';'.charCodeAt(0)
};


/** Three physical keyboard layouts known in this world */
var KBD_oems = 'endefr';


/**
 * Tooltip text for non-English physical keyboard settings.
 * All disabled by default.
 */
var KBD_oemHint = {"en": "", "fr": "", "de": ""};


/**
 * Keyboard state masks and special key values
 */
var KBD_SHIFT = 1;
var KBD_CAPS = 2;
var KBD_CTRL = 4;
var KBD_ALT = 8;
var KBD_ALTCTRL = 12;
var KBD_APPLE = 16;
var KBD_CAPSLOCK_CODE = 0x14;
var KBD_SHIFT_CODE = 0x10;
var KBD_CTRL_CODE = 0x11;
var KBD_ALT_CODE = 0x12;
var KBD_APPLE_CODE = 0xe0;
GKBD.BACKSPACE = '\u0008';


/**
 * Keyboard is a representation of a physical keyboard,
 * minus some functional keys that cannot be intercepted anyway.
 * Keyboard owns one or more layouts.
 *
 * @param groups Associative array mapping each layout group name
 *                 to an array of layouts
 * @param layouts Associative array mapping layout ids to layouts
 * @param opt_defaultLayout A default layout instance
 *
 * @constructor
 */
GKBD.Keyboard = function(layer, groups, layouts, opt_defaultLayout) {
  var self = this;
  var contentBuffer = [];
  var myState = 0;
  var isPressed = false;
  var isDown = false;
  var currentCode = -1;
  var layoutId = '';
  var defaultLayout = opt_defaultLayout;
  var cellHeight;
  self.area_ = layer;
  self.groups_ = groups;
  self.layouts_ = layouts;
  setScale(GKBD.isMobile ? .7 : 1);
  self.keys_ = {};
  self.localScale_ = 1;
  layoutId = defaultLayout ? defaultLayout.getId_() : "??";
  self.oemId_ = "en";

  function setScale(scale) {
    self.scale_ = scale;
    cellHeight = Math.round(DEFAULT_HEIGHT * scale);
  }

  /**
   * Draws the whole keyboard
   * Keyboard consists of four rows of key characters, as you can see from the
   * code below
   * @private
   */
  self.drawKeyboard_ = function() {
    contentBuffer = [];
    self.content_ = "";
    var row1 = KBD_format[0];
    leftpad(row1[0]);
    drawRow(KBD_rows[0], row1, 1);
    drawButton(GKBD.BACKSPACE, 'Backspace', row1[14], 60);
    rightpad(0);

    var row2 = KBD_format[1];
    leftpad(row2[0]);
    drawRow(KBD_rows[1], row2, 1);
    rightpad(row2[14]);

    var row3 = KBD_format[2];
    leftpad(row3[0]);
    drawButton('\u0014', self.getCapslockTitle_(), row3[1], 80);
    drawRow(KBD_rows[2], row3, 2);
    drawButton('\u0000', ' ', row3[13]);
    rightpad(row1[14]);

    var row4 = KBD_format[3];
    leftpad(row4[0]);
    drawButton('\u0010', 'Shift', row4[1], 90);
    drawRow(KBD_rows[3], row4, 2);
    drawButton('\u0111', 'Alt', row4[12], 90);
    rightpad(row4[13]);
    self.content_ = contentBuffer.join("");
  };


  /**
   * serializes current keyboard state.
   * @return a string with serialize_d state
   */
  self.serialize_ = function() {
    layoutId = (layoutId + '  ').substring(0,2);
    return KBD_oems.indexOf(self.oemId_) + layoutId;
  };


  /**
   * Deserializes keyboard state
   * @param opt_data {String} keyboard state, as returned by serialize_();
   *                 if empty, set the default state of the keyboard.
   */
  self.deserialize_ = function(opt_data) {
    if (opt_data) {
      var oempos = opt_data.charCodeAt(0) - 48;
      var id = opt_data.substring(1);
      self.oemId_ = KBD_oems.substring(oempos, oempos + 2);
      self.switchTo_(id);
    } else {
      self.switchTo_(defaultLayout ? defaultLayout.getId_() : "??");
    }
  };


  /**
   * @return a layout switch function
   */
  self.getSwitcher_ = function() {
    return function(item) {
      self.area_.switchTo_(item.id);
    }
  };


  /**
   * Sets default layout
   & @param layout Keyboard layout
   */
  self.setDefaultLayout_ = function(layout) {
    defaultLayout = layout;
    self.layout_ = layout;
  };

  /**
   * Switches between layouts
   * @param opt_id {String} Id of the layout to switch to.
   *        if id is missing, switches to default layout
   */
  self.switchTo_ = function(opt_id) {
//alert("switching to " + opt_id)
    var candidate;
    if (opt_id) {
      candidate = self.layouts_[opt_id] ||
                  self.layouts_[opt_id.toUpperCase()] ||
                  self.layouts_[opt_id.substring(0,2).toUpperCase()];
      layoutId = opt_id;
    }

    if (!candidate) {
      layoutId = defaultLayout ? defaultLayout.getId_() : "??";
//      alert("new id " + candidate)
      self.setLayout_(defaultLayout);
    } else if (candidate.load_()) {
      self.setLayout_(candidate);
    }
  };


  /**
   * Updates keyboard title.
   */
  self.updateTitle_ = function() {
    var oemText = self.oemId_ == 'en' ? '' : KBD_oemHint[self.oemId_];
    if (self.layout_) {
      self.area_.setTitle_(self.layout_.getTitle_(),
                           self.layout_.getShortTitle_(),
                           oemText);
    } else {
      self.area_.setTitle_("(please wait)", "(please wait)", oemText);
    }
  };

  /**
   * Sets a new keyboard layout
   * @param layout (@see Layout.js)
   */
  self.setLayout_ = function(layout) {
    if (self.layout_ != layout) {
      self.layout_ = layout;
      self.updateTitle_();
      self.reassignButtons_();
    }
  };

  /**
   * Draws itself in a DOM element (probably a layer)
   */
  self.draw_ = function () {
    self.updateTitle_();
    self.area_.setContent_(self.content_, self.scale_);
  };


  /**
   * Outputs html content
   * @param s {String} The string to add to content
   */
  function print(s) {
    contentBuffer.push(s);
  };


  /**
   * Outputs a table cell of specified width
   * @param width {Number} Cell width
   * @private
   */
  function emptySpace(width) {
    print('<td style="width:' + width * self.localScale_ * self.scale_ +
          '"/>');
  };


  /**
   * Outputs keyboard's left padding element
   * @param size {Number} Pad width
   * @private
   */
  function leftpad(size) {
    var height = GKBD.isIE ? (34 * self.scale_) : 23;
    print('<table style="table-layout:fixed;margin-left:auto;' +
          'margin-right:auto;empty-cells:show;border-collapse:collapse" ' +
          'border=0 width="100%" cellspacing=0 cellpadding=0>' +
          '<tr align=left style="height:' + height + '">');
    emptySpace(size);
  };


  /**
   * Outputs keyboard's right padding element
   * @param size {Number} Pad width
   * @private
   */
  function rightpad(size) {
    emptySpace(size);
    print('</tr></table>\n');
  };


  /**
   * class tag for buttons. Makes it easier to recognize them.
   */
  var BUTTON_CLASSNAME = 'kbdButton';
  var DEFAULT_HEIGHT = GKBD.isMobile ? 25 : 34;

  /**
   * Draws a keyboard button
   * @param c {String} The character for the button's OEM code
   * @param text {String} The text to display on the button
   * @param width {Number{ Button width
   * @param opt_fontSize text size, in % - optional
   * @private
   */
  function drawButton(c, text, width, opt_fontSize) {
    var fontSize = opt_fontSize || 100;
    width = Math.floor(width * self.scale_ * self.localScale_);
    var bumpy = (c == 'F' || c == 'J');
    var code = c.charCodeAt(0);
    print('<td style="width:');

    if (width > 0) {
      print(width);
    } else {
      print('1; visibility:hidden');
    }
//    print('" id="CK');
//    print(code);
    print('"><input type=button ');

    if (code) {
      self.keys_[code] = undefined;
      print('class="' + BUTTON_CLASSNAME + '" id=K');
      print(code);
      print(' ');
    }
    print('value="');

    if (text != '\u0000') {
      print(htmlEncode(text));
    }
    print('" ');
    print('style="width:100%');
    print (';height:' + Math.round(DEFAULT_HEIGHT * self.scale_));
    print(';font-size:' + Math.floor(fontSize * self.localScale_) + '%"');
    print(' onclick="' + keyAction(code));
    print('"/></td>');
  };


  /**
   * Draws a row of character buttons
   * @param buttons {String} A string of keyboard button chars
   * @param widths {Array} And array of button widths
   * @param from (Number) an index into widths, shows where button widths start.
   * @private
   */
  function drawRow(buttons, widths, from) {
    for (var i = 0; i < buttons.length; i++) {
      var code = buttons.charAt(i);
      drawButton(code, code, widths[i + from]);
    }
  };


  /**
   * Transforms an incoming character, together with the previous sequence, into
   * a new character sequence, according to the transformation table.
   * E.g. if you type a '^' followed by 'o', you'll have an 'o circonflexe'.
   * And so on; in Japanese you can modify 'ha' to produce 'ba' or 'pa'.
   * See the tables.
   * @param c {String} The character to transform.
   * @return transformed sequence of characters.
   */
  self.transform_ = function(c) {
    return self.layout_ ? self.layout_.transform_(c) : c;
  };

  var specialKeyDispatch = {
    K8: function() {
      visualizeClick(this);
      self.area_.processInput_(GKBD.BACKSPACE);
    },
    K16: function() {
      visualizeClick(this);
      doShift(!isShiftState());
    },
    K273: function() {
      visualizeClick(this);
      doAltGr();
    },
    K20: function() {
      visualizeClick(this);
      doCapslock();
    }
  };

  function keyListener(id) {
    return specialKeyDispatch[id] ||
      function() {
        visualizeClick(this);
        self.area_.processInput_(self.transform_(this.value));
      };
  }

  function keyAction(id) {
    return specialKeyDispatch[id] ||
      "KBDl_.ka(this);";
  }

  /**
   * Links all our keyboard keys (four rows) to the buttons drawn in the
   * onscreen keyboard. The buttons are identified by their ids, which are
   * letter 'K' followed by the key code.
   */
  self.setKbdListeners_ = function() {
    for (var code in self.keys_) {
      var id = "K" + code;
      var element = forId(id);
      try {
      self.keys_[code] = element;
      if (element) {
//        element.onclick = keyListener(id);
      }
     } catch(e) {alert("setting listeners, got " + e.message + " for " + id);
      throw e;
      }
    }
  };


  /**
   * Checks whether keyboard shift is on
   * @return true if it is
   */
  function isShiftState() {
    return (myState & KBD_SHIFT) == KBD_SHIFT;
  };


  /**
   * Checks whether keyboard capslock is on
   * @return true if it is
   */
   function isCapsLockState() {
    return (myState & KBD_CAPS) == KBD_CAPS;
  };


  /**
   * Checks whether keyboard alt-gr state is on
   * @return true if it is
   */
  function isAltGrState() {
    return (myState & KBD_ALTCTRL) == KBD_ALTCTRL;
  }


  /**
   * Gets a string representation of the keyboard status
   * @return status as string
   */
   function getStatus() {
     return (isShiftState() ? 's' : '') +
            (isAltGrState() ? 'c' : '') +
            (isCapsLockState() ? 'l' : '');
  };

  /**
   * Returns a keyboard button object for the keycode
   * @param keycode {Number} The OEM code from the keyboard (hopefully)
   * @return matching button
   * @private
   */
  function getButton(keycode) {
    return self.keys_[keycode];
  };


  /**
   * @return Keyboard's title element.
   */
  self.getTitleElement = function() {
    var element = forId("kbd_t");
    return (!element || !element["offsetHeight"]) ? undefined : element;
  }

  /**
   * Resizes the keyboard on the screen according to text size
   */
  self.resize_ = function() {
    var sample = self.getTitleElement();
    var newScale = sample ? sample.offsetHeight / 25 : self.scale_;
    setScale(newScale);
    self.area_.resize_(newScale);
    self.drawKeyboard_();
    self.draw_();
    try {
      where=1
    self.reassignButtons_();
  where++
    self.area_.resize_(newScale);
} catch(e) {alert("resize: " + e.message + " at " + where); throw e;}
    return true;
  };


  /**
   * Checks the changes in text size and resizes the keyboard if necessary
   */
  self.watchTextSize_ = function() {
    var sample = self.getTitleElement();
    if (!sample) {
      return false;
    }
    var newScale = sample.offsetHeight / 25;
    if (newScale != self.scale_ && newScale > 0.23) {
      return self.resize_();
    } else {
      return false;
    }
  };


  /**
   * Gets current title for capslock button
   * @return title The title for Capslock button in current keyboard state
   * @private
   */
  self.getCapslockTitle_ = function() {
    var capslockTitle = 'C/Lk';

    if (self.layout_ && self.layout_.capslockTitles_) {
      var clIndex = getStatus().indexOf('l') >= 0 ? 'l' : '';
      capslockTitle = self.layout_.capslockTitles_[clIndex];
    }
    return capslockTitle;
  };

  /**
   * Assigns to buttons their values from current mapping.
   */
  self.reassignButtons_ = function() {
    if (!self.layout_) {
      return;
    }
      var mapping = self.layout_.getMapping_(getStatus());
      var capslockButton = getButton(KBD_CAPSLOCK_CODE);
    try {
where=0;
      where++
      if (capslockButton) {
        where+=1000
        capslockButton.value = self.getCapslockTitle_();
        where++
      }
      where++
      if (mapping) {
        where+=100
        for (var i in mapping) {
          where+=10
          var button = getButton(i.charCodeAt(0));
          where++
          if (button) {
            where+=5
            button.value = mapping[i];
          }
        }
      }
    } catch(e) {alert("rB: " + e.message + "@" + where)}
  };

  /**
   * Processes capslock being pressed.
   * @private
   */
  function doCapslock() {
    myState ^= KBD_CAPS;
    self.reassignButtons_();
    self.area_.redirectFocus_();
  };


  /**
   * Processes shift state change.
   * @param newShift {Boolean} A new value of keyboard shift status
   * @return true if status did not change
   */
  function doShift(newShift) {
    if (newShift == isShiftState()) {
      return true;
    }
    var newValue = newShift ? KBD_SHIFT : 0;
    myState = myState & ~KBD_SHIFT | newValue;
    self.reassignButtons_();
    self.area_.redirectFocus_();
    return false;
  };


  /**
   * Processes altGr state change
   * @param opt_newAltGr {Number} A new value of keyboard altGr status (0/1)
   * @return true if status did not change
   */
  function doAltGr(opt_newAltGr) {
    var newValue = (!GKBD.isDef(opt_newAltGr) ?
                    !isAltGrState() : opt_newAltGr);
    if (newValue) {
      myState |= KBD_ALTCTRL;
    } else {
      myState &= ~KBD_ALTCTRL;
    }

    self.reassignButtons_();
    self.area_.redirectFocus_();
  };


  /**
   * Returns unified English keycode for an event
   * 'unified' means that some browsers map some keyboard keys to different
   * codes; 'English' means that the actual keyboard may be French or German;
   * this is specified on this.oemId_ variable.
   * @param event Keyboard event
   * @return key code
   * @private
   */
  function getEventCode(event) {
    var code = event.which || event.keyCode || event.charCode;
    var remap = KBD_remap[self.oemId_];
    if (remap) {
      code = remap[String.fromCharCode(code)] || code;
    }
    return KBD_mergeCodes[code] || code;
  };


  /**
   * Wraps event listener for standard keyboard processing
   * @param listener function
   * @return a function that provides event, and sets event return value.
   */
  function wrapEventListener(listener) {
    return function(event) {
      event = event || window.event;
      return event.returnValue = listener(event);
    }
  }


  /**
   * Processes "key up" events
   * @param event keyboard event
   * @return true if event processing if finished here, true if need more
   */
  var onKeyUp = wrapEventListener(function(event) {
    if (!isCtrlPressed(event)){
      myState &= ~KBD_CTRL;
    }

    if (!isAltPressed(event)) {
      myState &= ~KBD_ALT;
    }

    var code = getEventCode(event);
    if (code == KBD_APPLE_CODE || (myState & KBD_APPLE)) {
      myState &= ~KBD_APPLE;
      return true;
    }

    if (isSpecialEvent(event)) {
      if (isMetaPressed(event)) {
        doAltGr(0);
      } else if (isCtrlPressed(event)){
        myState &= ~KBD_CTRL;
      } else if (isAltPressed(event)) {
        myState &= ~KBD_ALT;
      }
      self.reassignButtons_();
      return true;
    }
    isPressed = false;
    isDown = false;

    if (code == KBD_CTRL_CODE) {
      myState &= ~KBD_CTRL;
      self.reassignButtons_();
    } else if (code == KBD_ALT_CODE) {
      myState &= ~KBD_ALT;
      self.reassignButtons_();
    }

    doShift(code != KBD_SHIFT_CODE && isShiftPressed(event));

    if (code == KBD_CAPSLOCK_CODE) {
      doCapslock();
    }

    return false;
  });


  /**
   * Processes "key down" events
   * @param event Keyboard event
   * @return true if event processing if finished here, true if need more
   */
  var onKeyDown = wrapEventListener(function(event) {
    var target = event.target || event.srcDocument;
    var focusSwitcher = window['_kbdSI'];
    if (target && focusSwitcher && BUTTON_CLASSNAME != target.className) {
      focusSwitcher(target);
    }

    var code = getEventCode(event);
    if (code == KBD_CAPSLOCK_CODE) {
      return true;
    }

    if (code == KBD_APPLE_CODE || (myState & KBD_APPLE)) {
      myState |= KBD_APPLE;
      return true;
    }

    var changed = false;

    if (isMetaPressed(event)) {
      doAltGr(1);
      changed = true;
    }

    if (isCtrlPressed(event) || code == KBD_CTRL_CODE){
      changed |= !(myState & KBD_CTRL);
      myState |= KBD_CTRL;
    }

    if (isAltPressed(event) || code == KBD_ALT_CODE) {
      changed |= !(myState & KBD_ALT);
      myState |= KBD_ALT;
    }

    if (changed) {
      self.reassignButtons_();
      return true;
    }

    if ((isSpecialEvent(event) ||
        code == KBD_CTRL_CODE ||
        code == KBD_ALT_CODE)
        && !isAltGrEvent(event)) {
      return true;  // Pass non ctrl-alt events up the chain
    }

    if (code == KBD_SHIFT_CODE) {
      isPressed = true;
      return event.returnValue = doShift(true);
    }

    isDown = true;
    currentCode = code;
    var button = getButton(code);
    isPressed = button ? true : false;
    // this additional shift processing is needed
    // for the browsers that do not return Shift Down event,
    // but instead provide shift bit with the regular key event.
    // In this case we have to both react to shift change and process the key.
    doShift(isShiftPressed(event));

    if (button) {
      button.onclick();
    }
    return !isPressed;
  });

  /**
   * Processes a 'key pressed' event. In most cases this method is not called,
   * since 'key up' and 'key down' do all the job - but on some occasions
   * in some browsers we have to deal with this event, too.
   *
   * @param event Keyboard event
   * @return true if event processing if finished here, true if need more
   */
  var onKeyPress = wrapEventListener(function(event) {
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

    var button = getButton(currentCode);
    // curious linux Firefox behavior; ignore capslock
    if (button && currentCode != KBD_CAPSLOCK_CODE) {
      button.click();
      return false;
    }
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
   * Starts listening to keyboard-related events.
   */
  self.startListening_ = function() {6
    var where = 0;
    try {
    if (document.onkeyup != onKeyUp) {
		where=1;
      savedOnkeyup = document.onkeyup;
		where=2;
      document.onkeyup = onKeyUp;
    }
	
    if (document.onkeydown != onKeyDown) {
		where=3;
      savedOnkeydown = document.onkeydown;
		where=4;
      document.onkeydown = onKeyDown;
    }
    if (document.onkeypress != onKeyPress) {
		where=5;
      savedOnkeypress = document.onkeypress;
		where=6;
      document.onkeypress = onKeyPress;
    }
		where=7;
	} catch(e) { 
alert("I won't listen to you - " + where);
//alert("sl: " + e.message + " at " + where) 
	}
  };


  /**
   * Stops listening to key events.
   */
  self.stopListening_ = function() {
    if (document.onkeyup == onKeyUp) {
      document.onkeyup = savedOnkeyup;
    }
    if (document.onkeydown == onKeyDown) {
      document.onkeydown = savedOnkeydown;
    }
    if (document.onkeypress == onKeyPress) {
      document.onkeypress = savedOnkeypress;
    }
  };
}

// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * This file contains onscreen keyboard layout class. Layout data are passed
 * to its constructor as an associative array, and parsed into a structure
 * that is more efficient to use. Roughly speaking, layout consists of some
 * identification data (name, id, etc), key mapping, and transformation.
 * Transformation rules are used to convert sequences of key inputs to one or
 * more characters in the input field.
 *
 * @author vpatryshev@google.com
 */

/**
 * Creates a function that returns the specified value.
 * @param value the value to return.
 *
 * @return a function that always returns the value specified.
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
 * @param text (String)
 * @param title (String)
 */
GKBD.abbr_ = function(text, title) {
  return title == text ? text :
         ('<abbr style="border-style:none" title="' + title + '">' + text +
          '</abbr>');
};

/**
 * Keyboard layout constructor
 *
 * @param source - an associative array with layout descriptor,
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
    ['\u00c0','1','2','3','4','5','6','7','8','9','0','m','=',
     'Q','W','E','R','T','Y','U','I','O','P','\u00db','\u00dd','\u00dc',
     'A','S','D','F','G','H','J','K','L',';','\u00de',
     'Z','X','C','V','B','N','M','\u00bc','\u00be','\u00bf'];

  var self = this;
  var titleProvider = source.titleProvider;
  var name = source.name;
  self.nativeName_ = name;
  var shortId = "??";
  var defaultTitle = "??";
  var mappings = {};
  var transformation = {};
  var view2char = {};
  var shortTitle = source.shortTitle;

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
   & @param fullId (String) - the full id
   *
   * Parsed id is stored in the 'id' attribute; shortId, name, nativeName
   * are stored in internal variables and used in various methods.
   */
  function parseId(fullId) {
    var bigid;
    if (fullId.indexOf(':') > 0) {
      var data = fullId.split(/:/);
      bigid = data[0].split(/,/);
      name = data[1];
      self.nativeName_ = data[data.length > 2 ? 2 : 1];
    } else {
      bigid = fullId.split(/,/);
    }

    self.id = bigid[0];
    shortId = bigid.length > 1 ? bigid[1] : self.id;
    defaultTitle = GKBD.abbr_(self.nativeName_, name);
  }


  /**
   * @return layout title.
   */
  self.getTitle_ = function() {
    return titleProvider ? titleProvider() : defaultTitle;
  };


  /**
   * @return short title for this layout.
   */
  self.getShortTitle_ = function() {
    return shortTitle || self.getTitle_();
  };


  /**
   * @return an id to use within the program
   */
  self.getId_ = function() {
    return shortId;
  };


  /**
   * Copies into itself key mappings for all modifiers.
   *
   * @param sourceMappings an associative array that, for each modifier
   * (or a set of modifiers, represented as a comma-separated string)
   * has an associative array that maps key codes to layout characters.
   * E.g. {'':{'A':'\u0430','B':'\u0431},"s,sl":{'A':'\u0410','B':'\u0411'}}
   * In this example, keys 'A' and 'B' are mapped to Russian small letters
   * 'a' and 'b', but for shift (and for shift+capslock), to capital letters.
   * @private
   */
  function copyMappings(sourceMappings) {
    for (var mm in sourceMappings) {
      var list = mm.split(/,/);
      if (list.join(',') != mm) {
        list.push(''); // A hack for IE: it splits 'a,b,' into ['a','b']
      }
      var source = sourceMappings[mm];
      var parsed = {};
      if (source) {
        for (var sourceChars in source) {
          var targetChars = source[sourceChars];
          for (var i = 0; i < sourceChars.length; i++) {
            parsed[sourceChars.charAt(i)] = targetChars.charAt(i);
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
   * @param source an associative array describing the layout
   * @private
   */
  self.init_ = function(source) {
    if (!source.mappings) {
      return;
    }

    copyMappings(source.mappings);
    if (source.capslock) {
      self.capslockTitles_ = source.capslock;
    }

    if (source.view2char) {
      view2char = source.view2char;
    }

    addTransformation(source.transform);

    self.sequence_ = "";
    self.init_ = self.load_ = returnValue(true);
  };


  /**
   * Adds a transformation to keyboard layout.
   *
   * @param sourceTransformation.
   *
   * A transformation consists of a map (associative array) that maps
   * character sequences to other character sequences (most probably,
   * to single characters). For instance, '^' followed by 'o' is mapped to
   * 'o circonflex' in French keyboard layout.
   *
   * As a result of interpeting sourceTransformation a trie structure is
   * created in this transformation associative array; leading key segments
   * are mapped to '-'. E.g. 'SHH' -> '?' produces three entries:
   * 'S'->'-', 'SH'->'-', 'SHH'->'\b\b\b?'.
   *
   * @private
   */
  function addTransformation(sourceTransformation) {
    if (!sourceTransformation) { return; }

    for (var key in sourceTransformation) {
      var value = '\b' + sourceTransformation[key];
      var bs = '';
      for (var pos = 1; pos < key.length; pos++) {
        bs = bs + '\b';
        var subkey = key.substring(0, pos);
        var subvalue = transformation[subkey];
        if (!subvalue) {
          transformation[subkey] = '-';
        } else if (subvalue != '-'){
          // special case: bs must contain the number of chars in prefix
          bs = '\b\b\b\b\b\b\b'.substring(0,
              subvalue.length - subkey.length + 1);
        }
      }
      transformation[key] = bs + sourceTransformation[key];
    }
  };


  /**
   * Returns mapping table for specified caps and shift
   *
   * @param status {String} keyboard status, a sequence of 'l', 's', 'c' for
   *                        capslock, shift, altgr.
   * @return the mapping for the status
   */
  self.getMapping_ = function(status) {
    return mappings[status];
  };


  /**
   * Transforms a character, together with previously accumulated ones, into
   * another character or a sequence.
   *
   * @param c (String) the character to add to accumulated sequence
   * @return the transformed sequence
   *
   * E.g. if we typed '^' in French, it returns '^', but if we type 'o' after
   * that, it will return '(backspace)(o circonflex)'
   * @private
   */
  self.transform_ = function(c) {
    if (view2char[c]) c = view2char[c];
    self.sequence_ += c;
    var node = transformation[self.sequence_];
    if (!node) {
      self.sequence_ = c;
    } else if (node != '-') {
      return node;
    }
    return c;
  };


  // Extract packed id information, @see #parseId
  parseId(source.id);

  // now start initializing
  if (source.mappings) {
    self.init_(source);
  }
};
/**
 * Popular constants
 */
var ABSOLUTE = 'absolute';
var HIDDEN   = 'hidden';

/**
 * Converts a nonnegative number to a string, 62-based.
 * This function is used for packing keyboard location coordinates.
 * @see #toBase62
 *
 * @param n (Number)
 * @return a string representing the number
 */
function toBase62(n) {
  var buf = [];
  if (n <= 0) {
    return "0";
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
 * @param s (String) the string containing the number.
 * @return converted number
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


/** Gets keyboad cookie.
 * @return a string or the empty string if no cookie found.
 * This function was customized from common.js.
 */
function getCookie() {
  var nameeq = 'KBD=';
  var cookie = String(document.cookie);
  for (var pos = -1; (pos = cookie.indexOf(nameeq, pos + 1)) >= 0;) {
    var i = pos;
    // walk back along string skipping whitespace and looking for a ; before
    // the name to make sure that we don't match cookies whose name contains
    // the given name as a suffix.
    while (i-- > 0) {
      var ch = cookie.charAt(i);
      if (ch == ';') {
        i = -1;  // indicate success
        break;
      } else if (' \t'.indexOf(ch) < 0) {
        break;
      }
    }
    if (-1 === i) {  // first cookie in the string or we found a ;
      var end = cookie.indexOf(';', pos);
      if (end < 0) { end = cookie.length; }
      return cookie.substring(pos + nameeq.length, end);
    }
  }
  return "";
}

/**
 * Builds a chunk of html that works like a link and is styled according to
 * Google style requirements.
 * @param content (String) the text
 * @param opt_onclick (String) on click callback function name
 * @return a html chunk, span that behaves like a link
 */
GKBD.buildFakeLink_ = function(content, opt_onclick) {
  return '<a href="#" style=' +
         '"text-decoration:none;cursor:pointer;font-size:80%;color:blue" ' +
         'onmouseOut="this.style.textDecoration=\'none\'" onclick="' +
         (opt_onclick || "_kbdShow();") + '">' +
         content + '</a>';
};

function describe(x) {
  var doc = [];
  for (var e in x) {
    if (e.indexOf("mage") < 0 && e.indexOf("border") < 0 && e.indexOf("color") < 0 && e.indexOf("margin") < 0) doc.push(e);
  }
  return doc.join(",");
}


/**
 * Builds the layer for keyboard
 */
function buildKeyboardLayer() {
try {
  var newdiv = forId('kbd');
  var style = newdiv.style;
  if (style.position) newdiv.style.position = ABSOLUTE;
  newdiv.style.visibility = HIDDEN;
  newdiv.style.width = 380;
  newdiv.style.backgroundColor = '#d7e6ff';
  newdiv.innerHTML = '<div id="kbda"><div id="kbd_0"/></div>';
} catch(e) {alert("bKL: " + e); throw e;}
}


/**
 * Known keyboard visibility states.
 * v - active, fully visible
 * M - minimized, active
 * m - minimized, inactive
 * h - hidden, inactive
 */
var visibilities = 'vMmh';


/**
 * Keyboard layer widths, per visibility state.
 */
var WIDTH = {'v': 472, 'M':330, 'm': 300, 'h': 0};


/**
 * Keyboard layer class.
 *
 * @constructor
 */
GKBD.KBDLayer = function() {
  var self = this;
  var container;
  var defaultLayout;
  var isListening = false;
  var oemText = '';
  var groups = {};
  var homeX = 1;
  var homeY = 1;

  self.hiddenVisibility_ = 'h';
  self.canMinimize_ = true;
  self.titleAlignmnent_ = 'left';
  self.relX_ = self.relY_ = 0;
  self.scrollX_ = self.scrollY_ = 0;
  self.defaultVisibility_ =
  self.visibility_ = self.hiddenVisibility_;
  self.layouts_ = {};
  self.closeActionContent_ = null;


  /**
   * Configures the keyboard layout.
   * @param configuration (Array) Configuraiton parameters
   */
  self.configure = function(configuration) {
    for (var item in configuration) {
      self[item] = configuration[item];
    }
  }


  /**
   * Setup queue contains the methods that should be called on setup.
   * The default one connects events and listener objects.
   * The advantages of having a queue for setup are that, first, you do setup
   * only once; and two, to add more setup functionality elsewhere in the code,
   * one just has to push one more function into this queue.
   */
  self.setupQueue_ = [function() {
try {
barf("setting up; def layout is " + defaultLayout);
    buildKeyboardLayer();
barf("layer ready")
    self.keyboard_ =
        new GKBD.Keyboard(self, groups, self.layouts_, defaultLayout);
    container = forId('kbd');
    if (container.style.position) container.style.position = 'fixed';

    if (GKBD.isIE && container.style.position) {
      barf("s1")
      container.style.position = 'ABSOLUTE';
      window.attachEvent('onscroll', function() {
        barf("onscroll")
        self.scrollX_ = document.body.scrollLeft;
        self.scrollY_ = document.body.scrollTop;
        move();
      });
    }

    var oldOnresize = window.onresize;
    try {
      window.onresize = function() {
        barf("onresize")
        self.reposition_();
        if (oldOnresize) oldOnresize();
      };
    } catch(e) {
      // ignore this - there's just no way to do onresize
    }
    calculateSize();
    self.keyboard_.draw_();
    self.keyboard_.setLayout_(defaultLayout);

    /**
     * Saves the keyboard layer state in the keyboard cookie.
     */
    self.save_ = function() {
      document.cookie = 'KBD=' + serialize() + ';expires=November 07, 2010';
    };
} catch(e) { alert("oh shit, " + e.message);}

  }];


  /**
   * Setup method. Called when document is already built,
   * to do all initialization.
   */
  self.setup = function() {
    while(self.setupQueue_.length > 0) {
      self.setupQueue_.shift()();
    }
  };

  function clientWidth() {
    return document.body ? document.body.clientWidth : window.screen.availWidth;
  }

  function clientHeight() {
    return document.body ? document.body.clientHeight : window.screen.availHeight;
  }

  /**
   * Calculates the layer size, from container layer size
   */
  function calculateSize() {
    self.height = container.offsetHeight ? container.offsetHeight :
                  container.clip         ? container.clip.height : -1;
    self.width  = container.offsetWidth  ? container.offsetWidth  :
                  container.clip         ? container.clip.width  : -1;
//barf("w:" + window.screen.availWidth + " " + window.screen.width + "\n" + window.screen.height + " " + window.screen.availHeight);
    homeX = clientWidth() - self.width;
    homeY = clientHeight() - self.height;
  };


  /**
   * serializes the keyboard layer state, together with the keyboard state.
   */
  function serialize() {
    var storedVisibility = self.visibility_;
    return self.keyboard_.serialize_() +
        toBase62(Math.floor(2000 * self.relX_) * 4804 +
                 Math.floor(1200 * self.relY_) * 4 +
                 visibilities.indexOf(self.visibility_));
  };


  /**
   * Tries to deserializes the keyboard layer state.
   * @param data {String} serialize_d format from a cookie:
   *             x,y,layoutId,visibility
   *             e.g. 0.5,0.3,RU,v
   *             which means: 0.5 of screen width,
   *             0.3 of screen height, Russian layout, visible.
   */
  function tryDeserialize(data) {
    self.keyboard_.deserialize_(data.substring(0,3));
    self.relX_ = 0;
    self.relY_ = 0;
    var xyv = fromBase62(data.substring(3));
    var v = visibilities.charAt(xyv % 4);
    self.deserializePosition_(Math.floor(xyv / 4));
    self.showAs_(v);
  };


  /**
   * Deserializes the keyboard layout state; resets to current state if fails.
   * @param data (@see tryDeserialize_)
   */
  function deserialize(data) {
    self.showAs_(self.defaultVisibility_);
    if (!data) {
      self.keyboard_.deserialize_();
      return;
    }
    try {
      tryDeserialize(data);
    } catch (ex) {
      try {
        tryDeserialize(current);
      } catch (ex1) {
        self.showAs_(self.defaultVisibility_);  // just in case
      }
    }
  };


  /**
   * Does nothing for uninitialized layer.
   */
  self.save_ = function() {};


  /**
   * Restores the keyboard layer state from the keyboard cookie.
   */
  self.restore_ = function() {
    self.setup();
    var cookie = getCookie();
try {
    deserialize(cookie);
} catch (e) { alert("restore_: " + e)}
  };


  /**
   * Adds a keyboard layout to the layer.
   * @param groupName {String} Layout group name.
   * @param layout New layout to add.
   * @return the layout
   */
  self.addLayout_ = function(groupName, layout) {
    layout.group = groupName;
    if (!self.layouts_[layout.getId_()]) {
      self.layouts_[layout.getId_()] = layout;
      groups[groupName] = groups[groupName] || new Array();
      groups[groupName].push(layout);
    }
    return layout;
  };


  /**
   * Adds a layout group to the collection of of layouts
   * @param groupName {String} E.g. West-European (EN-US is one)
   * @param source An array of layout sources (@see layout.js)
   */
  function addGroup(groupName, source) {
    for (var i = 0; i < source.length; i++) {
      self.addLayout_(groupName, new GKBD.Layout(source[i]));
    }
  };


  /**
   * Adds groups of layouts.
   * @param groups An associative array of groups and their arrays of layouts
   */
  self.addGroups_ = function(groups) {
    for (var name in groups) {
      addGroup(name, groups[name]);
    }
  };


  /**
   * Sets default keyboard layout.
   * @param layout The layout that is assigned to be default.
   */
  self.setDefaultLayout_ = function(layout) {
    if (self.keyboard_) {
      self.keyboard_.setDefaultLayout_(layout);
    }
    defaultLayout = layout;
  };


  /**
   * Switches to another keyboard layout. E.g. from Ruritainan to Aramaic.
   * @param id {String} Layout id (which is a two-letter language code).
   */
  self.switchTo_ = function(id) {
    if (isListening) {
      self.keyboard_.switchTo_(id);
      if (self.consumer) {
        self.consumer.lang = id;
      }
      self.save_();
    }
    self.redirectFocus_();
  };


  /**
   * Redirect focus to current consumer. This may be nessesary after, say,
   * a user clicks the keyboard button - the focus then in on the button,
   * and it is not what the user expects.
   */
  self.redirectFocus_ = function() {
    if (self.consumer) {
      self.consumer.focus();
    }
  };


  /**
   * Replaces a group of characters in the input field with a new group.
   * We need this to implement input methods, e.g. to make 'dead keys' work.
   *
   * @param n {Number} Number of chars to replace (back from cursor position)
   * @param chars {String} Characters to insert
   */
  function replaceChars(n, chars){
    var subject = self.consumer;
    if (!subject) return;
    self.redirectFocus_();
    var value = subject.value;
    var newLength = value.length - n;
    var from  = subject.selectionStart;

    if (GKBD.isDef(document.selection) && document.selection) {
      var range = document.selection.createRange();
      if (range.parentElement() == subject) {
        range.moveStart('character', -n);
        range.text = chars;
      }
      range.collapse(false);
      range.select();
    } else if (from || from=='0') {
      var to   = subject.selectionEnd;
      var head = from > n ? value.substring(0, from - n) : '';
      subject.value = head + chars + value.substring(to, value.length);
      subject.selectionEnd   = //to + chars.length - n;
      subject.selectionStart = from + chars.length - n;
    } else if (newLength < 0) {
      subject.value = chars;
    } else {
      subject.value = value.substring(0, newLength) + chars;
    }
  };


  /**
   * Processes a single input which may consist of several character(s).
   * Processing consists of inserting the characters into the consumer
   * input field.
   * @param c {String} Input character(s)
   */
  self.processInput_ = function(chars) {
    for (var i = 0; i < chars.length; i++) {
      if (chars.charAt(i) != GKBD.BACKSPACE) {
        replaceChars(i, chars.substring(i));
        return;
      }
    }
    replaceChars(chars.length, '');
  };

function setonclick(element, f, what) {
  try {
     element.onclick = f;
   } catch(e) {
//     barf(what + ": " + e);
   }
 }

  /**
   * Sets up keyboard title element.
   *
   * @return the title element of keyboard layer.
   */
  function setupTitle() {
    var titleArea = forId('kbd_t');
    if (titleArea) {

//      barf("ST " + describe(titleArea) + "\n" + describe(document))
      self.setTitleMouseActions_(titleArea);
      setonclick(titleArea, function() {
          if (!isEnabled()) {
            minimize();
          }
        }, "titleArea");
      barf("ST3")
    }
    return titleArea;
  };


  self.setTitleMouseActions_ = function(element) {
    // do nothing by default
  }


  /**
   * Sets keyboard title.
   *
   * @param fullText {String} The full title text.
   * @param shortText (String) The short title text.
   * @param opt_oemText (String) physical keyboard layout name
   *                             (empty for generic).
   */
  self.setTitle_ = function(fullText, shortText, opt_oemText) {
    self.titleText = isEnabled() ? fullText : shortText;
    oemText = opt_oemText || '';
    drawTitle();
  };


  /**
   * @return keyboard oem hint text
   */
  function getOemIdContent() {
    return oemText ?
      ('<font size="-2"><div style="color:black;border:solid 1px;' +
       'height:1em;width:1.5em">&nbsp;' + oemText + '&nbsp;</div></font>') :
      '';
  };


  /**
   * @return title text
   */
  self.getTitleContent_ = function() {
    return self.titleText;
  }


  /**
   * Redraws keyboad title
   */
  function drawTitle() {
barf("dT0")
    var titleArea = setupTitle();
    barf("dT1")
    if (titleArea) {
      barf("dT2")
      titleArea.innerHTML = self.getTitleContent_();
      barf("dT3 " + titleArea.innerHTML)
      var oemIdArea = forId('kbd_oi');
      barf("dT4")
      if (oemIdArea) {
        barf("dT5")
        oemIdArea.innerHTML = getOemIdContent();
      }
    }
    barf("dT6")
  };


  /**
   * Sets listeners for keyboard buttons.
   */
  self.setListeners = function() {
    var hideButton = forId('kbd_h')
    if (hideButton) {
      hideButton.onclick = function() {
        self.hide_();
        self.save_();
      };
    }

    var minmaxButton = forId('kbd_mm');
    if (minmaxButton) {
      minmaxButton.onclick = function() {
        if (self.visibility_ == 'v') {
          minimize();
        } else if (self.visibility_ == 'M') {
          self.showAs_('v');
        }
        self.save_();
      };
    }

    self.keyboard_.setKbdListeners_();
  };


  /**
   * Draws minmax action text/icon
   */
  self.drawMinMax = function() {
    return isHidden() ? '' : self.closeActionContent_;
  };


  /**
   * Sets keyboard layer content
   *
   * @param text  {String} The html for the keyboard (and we add the rest)
   * @param scale {Number} display scale (1 is normal, 0.8 is smaller, etc) -
   *                       helps resize for various text sizes
   */
  self.setContent_ = function(text, scale) {
    self.iconSize_ = Math.floor(15 * scale);
    var htmlContainer = forId('kbd_0');
    htmlContainer.innerHTML =
    ['<center style="margin: 0 0">' +
     '<table id=kbdt border=0 width="100%" style="border:none;">' +
     '<tr>' +
     '<td>' +
     '<table border=0 width="100%">' +
     '<tr>' +
     '<td align=',
     self.titleAlignmnent_,
     (self.titleCursor_ ? ' style="cursor:' + self.titleCursor_ + '"' : ''),
     ' id=kbd_t>',
     '<td align=left id=kbd_oi width=3',
     '</td>',
     self.drawMinMax(),
     '</tr>' +
     '</table>' +
     '</td>' +
     '</tr>' +
     '<tr valign=top>' +
     '<td align=center>' +
     '<span id=kbd_mka style="display:',
     (self.visibility_ == 'v' ? 'block': 'none') + '">',
     '<table border=0 style="border:none;background-color:eaf2ff">' +
     '<tr><td align=center>',
     text,
     '</td></tr></table>' +
    '</span>' +
    '</td>' +
    '</tr>' +
    '</table>' +
    '</center>'].join('');
    drawTitle();
    self.setListeners();

    alert("set the contents " + htmlContainer.innerHTML);
  };


  /**
   * Saves relative keyboard position
   */
  self.saveRelativePosition_ = function() {
    calculateSize();
    var previousX = self.relX_;
    var previousY = self.relY_;
    self.relX_ = Math.min(1, 1 - self.x / homeX);
    self.relY_ = Math.min(1, 1 - self.y / homeY);
    if (previousX != self.relX_ &&
        previousY != self.relY_) {
      self.save_();
    }
  };


  /**
   * Moves keyboard to a different location
   * @param x {Number}
   * @param y {Number}
   */
  self.moveTo_ = function(x, y) {
    self.x = Math.min(homeX, Math.max(0, x));
    self.y = Math.min(homeY, Math.max(0, y));
    move();
  };


  /**
   * Moves the keyboard to its destination, minding the scroll shift.
   */
  function move() {
    if (typeof container.style.left != 'undefined') {
      container.style.left = self.x + self.scrollX_;
      container.style.top  = self.y + self.scrollY_;
    }
  }


  /**
   * Repositions the keyboard according to its relative coordinates.
   */
  self.reposition_ = function() {
    calculateSize();
    var x = Math.floor(homeX * (1 - self.relX_) + .5);
    var y = Math.floor(homeY * (1 - self.relY_) + .5);
    self.moveTo_(x, y);
    self.saveRelativePosition_();
  };


  /**
   * Calculates layer width (based on visibility)
   * @return suggested keyboard layer width
   */
  function calculateWidth() {
    return WIDTH[self.visibility_] * self.keyboard_.localScale_;
  };


  /**
   * Calculates layer height (based on visibility)
   * @return suggested layer height
   */
  function calculateHeight() {
    return forId('kbd_0').offsetHeight;
  };


  /**
   * Resizes the layer according to scale
   * @param scale {Number} the scale; 1 is normal size
   */
  self.resize_ = function(scale) {
    if (self.visibility_ != 'h') {
      container.style.width = (calculateWidth()) * scale + 10;
      container.style.height = calculateHeight();
      calculateSize();
      self.reposition_();
    }
  };


  /**
   * Checks whether the keyboard is near its bottom right corner
   * @return true if keyboard is located near home position
   */
  self.isNearHome_ = function() {
    calculateSize();
    var dist = Math.abs(homeX - self.x) + Math.abs(homeY - self.y);
    return dist < 90;
  };


  /**
   * Moves keyboard to its home position (bottom right corner)
   */
  self.goHome_ = function() {
    calculateSize();
    self.moveTo_(homeX, homeY);
    self.saveRelativePosition_();
  };


  /**
   * Toggles keyboard visibility
   */
  self.toggle_ = function() {
    if (container.style.visibility == 'visible') {
      self.hide_();
    } else if (self.visibility_ == 'M') {
      minimize();
    } else {
      self.showAs_('v');
    }
    self.save_();
  };


  /**
   * Wraps keyboard listener for standard keyboard processing
   * @param listener funciton
   * @return a function that provides event, and sets event return value.
   */
  function wrapKeyboardListener(listener) {
    return function(event) {
      event = event || window.event;
      return event.returnValue = listener(event);
    }
  }


  /**
   * @return true if keyboard is enabled.
   */
  function isEnabled() {
    return 'vM'.indexOf(self.visibility_) >= 0;
  };


  /**
   * Starts listening to keyboard-related events.
   */
  self.startListening_ = function() {
    if (!isListening && isEnabled()) {
      self.keyboard_.startListening_();
      isListening = true;
    }
  };


  /**
   * Detects whether the state hides the keyboard.
   * @param opt_visibility state to check.
   *        If missing, current state is tested.
   */
  function isHidden(opt_visibility) {
    return 'hm'.indexOf(opt_visibility || self.visibility_) >= 0;
  };


  /**
   * This function makes sense for the keyboard that has icons.
   * @param visibility keyboard visibility status
   */
  self.setMinMaxButton_ = function(visibility) {
  }

  /**
   * Displays the layer either in full ('v') or minimized ('m' or 'M') mode.
   * @param visibility (String)
   */
  self.showAs_ = function(visibility) {
try {
    self.setup();
    if (isHidden(visibility)) {
      self.visibility_ = self.hiddenVisibility_;
      if (visibility == 'h') {
        container.style.visibility = HIDDEN;
      }
      self.stopListening_();
      self.redirectFocus_();
    }
    if (visibility == 'M' && !self.canMinimize_) {
      visibility = 'v';
    }
    self.visibility_ = visibility;
    self.keyboard_.reassignButtons_();
    self.keyboard_.updateTitle_();

    var contentLayer = forId('kbd_mka');
    contentLayer.style.display = visibility == 'v' ? 'block' : 'none';
    self.reposition_();
    self.startListening_();
// The following line is really weird. Should now we recalculate keyboard scale?  
//    self.keyboard_.scale_ = 1;
    self.setMinMaxButton_(visibility);
    self.keyboard_.resize_();
    self.keyboard_.watchTextSize_();
    self.redirectFocus_();
    container.style.visibility = 'visible';
} catch(e) { alert("showas failed: " + e.message); }
  }


  /**
   * Minimizes the keyboard, keeping it active, but showing just the title
   */
  function minimize() {
    self.showAs_(self.canMinimize_ ? 'M' : 'v');
  };


  /**
   * Stops listening to key events.
   */
  self.stopListening_ = function() {
    self.keyboard_.stopListening_();
    isListening = false;
  };


  /**
   * Hides and deactivates the keyboard
   */
  self.hide_ = function() {
    if (!isHidden()) {
      self.showAs_(self.hiddenVisibility_);
      self.save_();
    }
  };
}

/**
 * The singleton instance of keyboard layer.
 */
var KBDl_ = GKBD.KBDl_ = new GKBD.KBDLayer();


/**
 * Visualizes button click. Flashes button color for 70 ms.
 * Implementation notes. Flashing layer background color does not work on Mac.
 * Flashing button background color leads to dropping "default button style"
 * on windows.
 * @param button the button to highlight
 */
function visualizeClick(button) {
  button.style.color = 'ffffff';
  // Get the cached timeout action or create a new one; save it.
  // Caching the function saves us from creating a new instance every
  // button click - which would be essentially a memory leak.
  button.flash = button.flash ||
      function() {
        button.style.color = '000000';
      };
  window.setTimeout(button.flash, 70);
}

KBDl_.ka = function(button) {
  visualizeClick(button);
  alert("clicked " + button.value + "\n" + this.keyboard_)
  this.processInput_(this.keyboard_.transform_(button.value));
}

KBDl_.deserializePosition_ = KBDl_.goHome_;

/**
 * Sets a document element to which to send typed or clicked characters.
 * Such an element is called 'consumer'.
 * This is our "API" - an element that wants keyboard input should have
 * onfocus="KBD_sendInputTo(this);..."
 *
 * @param element An input element that will take keyboard keys.
 */
var _kbdSI = function(element) {
  if (element && element != KBDl_.consumer) {
    KBDl_.consumer = element;
    if (element.lang) {
      KBDl_.switchTo_(element.lang);
    }
  }
}


/**
 * hides the keyboard
 */
var _kbdHide = function() {
  KBDl_.hide_();
}

var _kbdShow = function() {
  KBDl_.showAs_('v');
  KBDl_.save_();
}

/**
 * Switches layout; {see KBDl_.switchTo}
 */
var _kbdS2 = function(id) {
  KBDl_.switchTo_(id);
}


/**
 * Stores the previous value of window.onload.
 */
var oldOnload = window.onload;


/**
 * Initialize the keyboard layer.
 */
window.onload = function() {
  KBDl_.restore_();
  if (oldOnload) oldOnload();
}

var MSG_RUSSIAN_KEYBOARD =
    '\u0420\u0443\u0441\u0441\u043a\u0430\u044f&nbsp;' +
    '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430';
var MSG_RUSSIAN_TOOLTIP =
    '\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0430\u044f&nbsp;'+
    '\u0440\u0430\u0441\u043a\u043b\u0430\u0434\u043a\u0430';
var MSG_RUSSIAN_TRANSLIT_TOOLTIP =
    '\u0440\u0430\u0441\u043a\u043b\u0430\u0434\u043a\u0430&nbsp;translit';
var MSG_RUSSIAN_KEYBOARD_TRANSLIT =
    '\u041a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430&nbsp;' +
    '\u0442\u0440\u0430\u043d\u0441\u043b\u0438\u0442';
var MSG_SWITCH_TO_RUSSIAN =
    '\u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0430\u044f';
var MSG_SWITCH_TO_RUSSIAN_TRANSLIT =
    '\u0442\u0440\u0430\u043d\u0441\u043b\u0438\u0442';

function KBD_RusTitleProvider(title, tooltip, msgSwitch, switchTo) {
  return function() {
    return '<b>&nbsp;&nbsp;&nbsp;' +
           GKBD.abbr_(title, tooltip) +
           '</b>&nbsp;&nbsp;&nbsp;' +
           GKBD.buildFakeLink_(msgSwitch, '_kbdS2(\'' + switchTo + '\');');
  }
}
var KBD_TITLE_DISABLED =
    '<span style="cursor:pointer;color:#676767;font-weight:bold"> ' +
    '\u0420\u0443\u0441\u0441\u043a\u0430\u044f&nbsp;' +
    '\u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430' +
    '</span>&nbsp;&nbsp;&nbsp;' +
    GKBD.buildFakeLink_('\u0432\u043a\u043b\u044e\u0447\u0438\u0442\u044c');

GKBD.KBDl_.configure( {
  canMinimize_        : false,
  defaultVisibility_  : 'm',
  hiddenVisibility_   : 'm',
  closeActionContent_ : '<td border=1 align=right>' +
                GKBD.buildFakeLink_('\u0432\u044b\u043a\u043b','_kbdHide();') +
                '</td>'});

GKBD.KBDl_.addLayout_("East-European",
  new GKBD.Layout({id:'RU_LATN,Ru', name:'Russian (Translit)',
  titleProvider : KBD_RusTitleProvider(MSG_RUSSIAN_KEYBOARD_TRANSLIT,
                                       MSG_RUSSIAN_TRANSLIT_TOOLTIP,
                                       MSG_SWITCH_TO_RUSSIAN, 'RU'),
  shortTitle: KBD_TITLE_DISABLED,
  mappings: {
    'sl':{
      '\u00c01234567890m=':
          '\u044a!@"$%^7&*()_\u044c',
      'QWERTYUIOP\u00db\u00dd\u00dc':
          '\u044f\u0436\u0435\u0440\u0442\u044b\u0443\u0438\u043e\u043f' +
          '\u0448\u0449\u044d',
      'ASDFGHJKL;\u00de':
          '\u0430\u0441\u0434\u0444\u0433\u0447\u0439\u043a\u043b:"',
      'ZXCVBNM\u00bc\u00be\u00bf':
          '\u0437\u0445\u0446\u0432\u0431\u043d\u043c<>?'
    },
    'l': {
      '\u00c01234567890m=':
          '\u042a1234567890-=',
      'QWERTYUIOP\u00db\u00dd\u00dc':
          '\u042f\u0416\u0415\u0420\u0422\u042b\u0423\u0418\u041e\u041f' +
          '\u0428\u0429\u042d',
      'ASDFGHJKL;\u00de':
          '\u0410\u0421\u0414\u0424\u0413\u0427\u0419\u041a\u041b;\'',
      'ZXCVBNM\u00bc\u00be\u00bf':
          '\u0417\u0425\u0426\u0412\u0421\u041d\u041c,./'
    },
    's': {
      '\u00c01234567890m=':
          '\u042a!@"$%^7&*()_\u042c',
      'QWERTYUIOP\u00db\u00dd\u00dc':
          '\u042f\u0416\u0415\u0420\u0422\u042b\u0423\u0418\u041e\u041f' +
          '\u0428\u0429\u042d',
      'ASDFGHJKL;\u00de':
          '\u0410\u0421\u0414\u0424\u0413\u0427\u0419\u041a\u041b:"',
      'ZXCVBNM\u00bc\u00be\u00bf':
          '\u0417\u0425\u0426\u0412\u0421\u041d\u041c<>?'
    },
    '':  {
      '\u00c01234567890m=':
          '\u044a1234567890-=',
      'QWERTYUIOP\u00db\u00dd\u00dc':
          '\u044f\u0436\u0435\u0440\u0442\u044b\u0443\u0438\u043e\u043f' +
          '\u0448\u0449\u044d',
      'ASDFGHJKL;\u00de':
          '\u0430\u0441\u0434\u0444\u0433\u0447\u0439\u043a\u043b;\'',
      'ZXCVBNM\u00bc\u00be\u00bf':
          '\u0437\u0445\u0446\u0432\u0431\u043d\u043c,./'
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
  },
  transform: {
  //           jo                      ju                      ja
  '\u0439\u043e':'\u0451','\u0439\u0443':'\u044e','\u0439\u0430':'\u044f',
  '\u0419\u041e':'\u0401','\u0419\u0423':'\u042e','\u0419\u0410':'\u042f',
  //           yo                      yu                      ya
  '\u044b\u043e':'\u0451','\u044b\u0443':'\u044e','\u044b\u0430':'\u044f',
  '\u042b\u041e':'\u0401','\u042b\u0423':'\u042e','\u042b\u0410':'\u044f'
  }
}));

GKBD.KBDl_.setDefaultLayout_(GKBD.KBDl_.addLayout_("-",
  new GKBD.Layout({id:'RU',name:'Russian',
  titleProvider : KBD_RusTitleProvider(MSG_RUSSIAN_KEYBOARD,
                                       MSG_RUSSIAN_TOOLTIP,
                                       MSG_SWITCH_TO_RUSSIAN_TRANSLIT, 'Ru'),
  shortTitle: KBD_TITLE_DISABLED,
  mappings: {
    'sl': {
      '\u00c01234567890m=':
          '\u0451!\"\u2116;%:?*()_+',
      'QWERTYUIOP\u00db\u00dd\u00dc':
          '\u0439\u0446\u0443\u043a\u0435\u043d\u0433\u0448\u0449\u0437' +
          '\u0445\u044a/',
      'ASDFGHJKL;\u00de':
          '\u0444\u044b\u0432\u0430\u043f\u0440\u043e\u043b\u0434\u0436\u044d',
      'ZXCVBNM\u00bc\u00be\u00bf':
          '\u044f\u0447\u0441\u043c\u0438\u0442\u044c\u0431\u044e,'
    },
    'l':  {
      '\u00c01234567890m=':
          '\u04011234567890-=',
      'QWERTYUIOP\u00db\u00dd\u00dc':
          '\u0419\u0426\u0423\u041a\u0415\u041d\u0413\u0428\u0429\u0417' +
          '\u0425\u042a\\',
      'ASDFGHJKL;\u00de':
          '\u0424\u042b\u0412\u0410\u041f\u0420\u041e\u041b\u0414\u0416\u042d',
      'ZXCVBNM\u00bc\u00be\u00bf':
           '\u042f\u0427\u0421\u041c\u0418\u0422\u042c\u0411\u042e.'
          },
    's':  {
      '\u00c01234567890m=':
          '\u0401!\"\u2116;%:?*()_+',
      'QWERTYUIOP\u00db\u00dd\u00dc':
          '\u0419\u0426\u0423\u041a\u0415\u041d\u0413\u0428\u0429\u0417' +
          '\u0425\u042a/',
      'ASDFGHJKL;\u00de':
          '\u0424\u042b\u0412\u0410\u041f\u0420\u041e\u041b\u0414\u0416\u042d',
      'ZXCVBNM\u00bc\u00be\u00bf':
           '\u042f\u0427\u0421\u041c\u0418\u0422\u042c\u0411\u042e,'
    },
    '':   {
      '\u00c01234567890m=':
          '\u04511234567890-=',
      'QWERTYUIOP\u00db\u00dd\u00dc':
          '\u0439\u0446\u0443\u043a\u0435\u043d\u0433\u0448\u0449\u0437' +
          '\u0445\u044a\\',
      'ASDFGHJKL;\u00de':
          '\u0444\u044b\u0432\u0430\u043f\u0440\u043e\u043b\u0434\u0436\u044d',
      'ZXCVBNM\u00bc\u00be\u00bf':
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
})));
