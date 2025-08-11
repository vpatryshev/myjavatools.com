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
          new GKBD.Keyboard(groups, self.layouts_, defaultLayout);
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
        showAs(self.visibility_); // Need it so that tests see the new mapping.
        self.redirectFocus_();
      }
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
      GKBD.layer.keyboard_ &&
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
 * Onload listener.
 */
GKBD.onload = function() {
  if (GKBD.layer.restore_) GKBD.layer.restore_();
  GKBD.layer.restore_ = null;
};

/**
 * Initialize the keyboard layer.
 */
if (!KBD_window._kbdSignature ||
    KBD_window._kbdSignature != GKBD._kbdSignature) {
  if (KBD_window.addEventListener) {
    KBD_window.addEventListener('load', GKBD.onload, false);
  } else if (KBD_window.attachEvent) {
    KBD_window.attachEvent('onload', GKBD.onload);
  } else {
    // in the unlikely event of a very dumb browser
    /**
     * @type Function Window onload listener.
     */
    KBD_window.onload = GKBD.onload;
  }
  KBD_window._kbdSignature = GKBD._kbdSignature = new Date();
}
