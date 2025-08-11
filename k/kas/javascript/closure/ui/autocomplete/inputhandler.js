// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Class for managing the interactions between an 
 * auto-complete object and a text-input or textarea.
 *
 * @author pupius@google.com (Daniel Pupius)
 */

goog.provide('goog.ui.AutoComplete.InputHandler');

goog.require('goog.ui.AutoComplete');
goog.require('goog.dom.selection');
goog.require('goog.events');
goog.require('goog.string');
goog.require('goog.userAgent');


/**
 * Class for managing the interaction between an auto-complete object and a
 * text-input or textarea
 * @param {String} opt_separators Seperators to split multiple entries
 * @param {String} opt_literals Characters used to delimit text literals
 * @param {Boolean} opt_multi Whether to allow multiple entries (Default: true)
 */
goog.ui.AutoComplete.InputHandler = function(opt_separators, opt_literals,
    opt_multi) {
  
  /**
   * Instance of an autocomplete object
   * @type goog.ui.AutoComplete
   */
  this.ac_ = null;
    
  /**
   * Array of elements that this input handler has been bound to
   * @type Array
   */
  this.elements_ = [];
  
  /**
   * Characters that can be used to split multiple entries in an input string
   * @type String
   */
  this.separators_ = opt_separators || ';,';
  
  /**
   * The separator we use to reconstruct the string
   * @type String
   */
  this.defaultSeparator_ = this.separators_.substring(0, 1);
  
  /**
   * Regular expression used from trimming tokens
   * @type RegExp
   */
  this.trimmer_ = new RegExp('/^[\s' + this.separators_ + ']+|[\s' + 
      this.separators_ + ']+$/g');
  
  
  /**
   * Regular expression to test whether a separator exists
   * @type RegExp
   */
   this.separatorCheck_ = new RegExp('\s*[' + this.separators_ + ']$');
   
   
  /**
   * Characters that are used to delimit literal text. Separarator characters
   * found within literal text are not processed as separators
   * @type String
   */
   this.literals_ = opt_literals || '';
   
   
  /**
   * Time in milliseconds to throttle the keyevents with
   * @type Number
   */
  this.throttleTime_ = 50;
  
  /**
   * Result of the key throttling timeout
   * @type Number
   */
  this.keyTimer_ = null;
  
  /**
   * Reference to the current object which is providing input, for example 
   * text area or input box.
   * @type Object
   */
  this.currentTarget_ = null;
  
  /**
   * Index of the token that is currently being edited
   * @type Number
   */
  this.currentTokenIndex_ = 0;

  /**
   * Whether this input accepts multiple values
   * @type Boolean
   */
  this.multi_ = (opt_multi != null) ? opt_multi : true;
};


/**
 * Standard list separators
 */
goog.ui.AutoComplete.InputHandler.STANDARD_LIST_SEPARATORS = ',;';


/**
 * Literals for quotes
 */
goog.ui.AutoComplete.InputHandler.QUOTE_LITERALS = '\'"';


/**
 * Attach the input handler to an element such as a textarea or input box.  The 
 * element could basically be anything as long as it exposes the correct
 * interface and events
 * @param {Element} var_args Variable arguments for elements to bind to
 */
goog.ui.AutoComplete.InputHandler.prototype.attachInputs = function(var_args) {
  for (var i = 0; i < arguments.length; i++) {
    var el = arguments[i];
    
    this.elements_.push(el);
                  
    goog.events.listen(el, goog.events.types.KEYPRESS, this.keyPressEvent_,
        false, this);
    goog.events.listen(el, goog.events.types.KEYDOWN, this.keyDownEvent_,
        false, this);
        
    var focusEvents = [goog.events.types.FOCUS, goog.events.types.CLICK];               
    goog.events.listen(el, focusEvents, this.focusEvent_, false, this);             
    goog.events.listen(el, goog.events.types.BLUR, this.blurEvent_, false, this);
  }
};


/**
 * Attach an instance of an AutoComplete
 * @param {goog.ui.AutoComplete} ac Autocomplete object
 */
goog.ui.AutoComplete.InputHandler.prototype.attachAutoComplete = function(ac) {
  this.ac_ = ac;  
};


/**
 * Selects the given row.
 * @param {Object} row The row to select.
 */
goog.ui.AutoComplete.InputHandler.prototype.selectRow = function(row) {
  if (this.multi_) {
    var target = this.currentTarget_;
    var index = this.currentTokenIndex_;
    
    // Break up the current input string
    var entries = this.splitInput_(target.value);
    
    // Work out what the new value should be, taking into account any whitespace
    var replaceValue = entries[index].replace(this.trim_(entries[index]),
        row.toString());
    
    // Only add punctuation if there isn't already a separator available
    if (!this.separatorCheck_.test(replaceValue)) {
      replaceValue = goog.string.trimRight(replaceValue) + 
                     this.defaultSeparator_ + ' ';
    }
    
    // Replace the value in the array
    entries[index] = replaceValue;
  
    // Join the array and replace the contents of the input           
    target.value = entries.join('');
    
    // Calculate which position to put the cursor at
    var str = ''
    var pos = 0;
    for (var i = 0; i <= index; i++) {
      pos += entries[i].length;  
    }
    
    // Set the cursor
    goog.dom.selection.setStart(target, pos);
    goog.dom.selection.setEnd(target, pos);
  } else {
    this.currentTarget_.value = row.toString();
  }
};


/**
 * Handle KEYPRESS events - used to process all normal characters
 *   (although fires on all events in FF, so have to specifically ignore 
 *    characters handled by KEYDOWN)
 * @type {goog.events.Event} e Browser event object
 */
goog.ui.AutoComplete.InputHandler.prototype.keyPressEvent_ = function(e) {
  var key = e.keyCode;
  
  // If a separator, select the highlited item and block the regular event
  if (this.separators_.indexOf(String.fromCharCode(e.charCode)) != -1) {
    if (this.ac_ && this.ac_.selectHilited() && this.multi_) {  
      e.preventDefault();
    }
  // Prevent default on KEYDOWN doesn't stop these events from firing on FF,
  // so need to not reset state in these cases
  } else if (key != 40 && key != 38 && key != 9 && key != 13 && key !=27) {
    // Call the update, but throttle the events
    goog.global.clearTimeout(this.keyTimer_);
    this.keyTimer_ =
        goog.global.setTimeout(this.calculateState_.bind(this, e.currentTarget),
                               this.throttleTime_);
  }
};


/**
 * Handle KEYDOWN events - used for up arrow, down arrow, tab, enter, and escape
 * @type {goog.events.Event} e Browser event object
 */
goog.ui.AutoComplete.InputHandler.prototype.keyDownEvent_ = function(e) {
  var key = e.keyCode;
  
  // Down-Arrow
  if (key == 40) {
    if (this.ac_ && this.ac_.hiliteNext()) {
      e.preventDefault();
    }
    
  // Up-Arrow
  } else if (key == 38) {
    if (this.ac_ && this.ac_.hilitePrev()) {
      e.preventDefault();
    }
      
  // Tab OR enter
  } else if (key == 9 || key == 13) {
    if (this.ac_ && this.ac_.selectHilited() && this.multi_) {  
      e.preventDefault();
    }
    
  // Escape
  } else if (key == 27) {
    if (this.ac_) {
      this.ac_.dismiss();
    }
  }
    
};

/**
 * Handle the element getting focus
 * @type {goog.events.Event} e Browser event object
 */
goog.ui.AutoComplete.InputHandler.prototype.focusEvent_ = function(e) {
  goog.global.clearTimeout(this.blurTimer_);
  this.calculateState_(e.currentTarget);
};


/**
 * Handle the element blurring
 * @type {goog.events.Event} e Browser event object 
 */
goog.ui.AutoComplete.InputHandler.prototype.blurEvent_ = function(e) {
  if (this.ac_) {
    // Pause dismisal slightly to take into account any other events that might
    // fire on the renderer (e.g. a click will lose the focus)
    this.blurTimer_ = goog.global.setTimeout(this.ac_.dismiss.bind(this.ac_), 150);
  }
};


/**
 * Calculate the current state for a particular node
 */
goog.ui.AutoComplete.InputHandler.prototype.calculateState_ = function(target) {
 
  // Get the token and its position
  var caret = goog.dom.selection.getStart(target);
  var token = this.parseToken_(target.value, caret);

  // Set state
  this.currentTarget_ = target;
  this.currentTokenIndex_ = this.getTokenIndex_(target.value, caret);
  
  if (this.ac_) {
    // Send token to AutoComplete
    this.ac_.setTarget(target);
    this.ac_.setToken(goog.string.trim(token));
  }
};


/**
 * Parses a text area or input box for the currently highlighted token
 * @param {String} text String to parse
 * @param {Number} caret Position of cursor in string
 * @return {String} Token to complete
 */
goog.ui.AutoComplete.InputHandler.prototype.parseToken_ = function(text,
                                                                   caret) {
  return this.trim_(this.splitInput_(text)[this.getTokenIndex_(text, caret)]);
};


/**
 * Trims a token of characters that we want to ignore
 * @param {String} text String to trim
 * @return {String} Trimmed string
 */
goog.ui.AutoComplete.InputHandler.prototype.trim_ = function(text) {
  return String(text).replace(this.trimmer_, '');
};


/**
 * Gets the index of the currently highlighted token
 * @param {String} text String to parse
 * @param {Number} caret Position of cursor in string
 * @return {Number} Index of token
 */
goog.ui.AutoComplete.InputHandler.prototype.getTokenIndex_ = function(text,
                                                                      caret) {
  // Split up the input string into multiple entries
  var entries = this.splitInput_(text);
  
  // Calculate which of the entries the cursor is currently in
  var current = 0;
  for (var i = 0, pos = 0; i < entries.length && pos < caret; i++) {
    pos += entries[i].length;
    current = i;
  }
  
  // Get the token for the current item
  return current;  
};


/**
 * Splits an input string of text at the occurance of a character in 
 * {@link goog.ui.AutoComplete.InputHandler.prototype.separators_} and creates
 * an array of tokens.  Each token may contain additional whitespace and
 * formatting marks.  If necessary use 
 * {@link goog.ui.AutoComplete.InputHandler.prototype.trim_} to clean up the
 * entries.
 * 
 * @param {String} text Input text
 * @return {Array} Parsed array
 */
goog.ui.AutoComplete.InputHandler.prototype.splitInput_ = function(text) {
  if (!this.multi_) {
    return [text];
  }
    
  var arr = String(text).split('');
  var parts = [];
  var cache = [];
  
  for (var i = 0, inLiteral = false; i < arr.length; i++) {
    if (this.literals_ && this.literals_.indexOf(arr[i]) != -1) {
      if (!inLiteral) {
        parts.push(cache.join(''));
        cache.length = 0;
      }
      cache.push(arr[i]);
      inLiteral = !inLiteral;
      
    } else if (!inLiteral && this.separators_.indexOf(arr[i]) != -1) {
      cache.push(arr[i]);
      parts.push(cache.join(''));
      cache.length = 0;
      
    } else {
      cache.push(arr[i]);    
    }
  }
  
  parts.push(cache.join(''));

  return parts;
};

