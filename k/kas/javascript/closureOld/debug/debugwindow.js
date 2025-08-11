// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the DebugWindow class. Please minimize
 * dependencies this file has on other closure classes as any dependency it
 * takes won't be able to use the logging infrastructure.
 *
 * @author Jon Perlow (jonp@google.com)
 */

goog.provide('goog.debug.DebugWindow');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Formatter');
goog.require('goog.debug.TextFormatter');
goog.require('goog.structs.CircularBuffer');  // ok to use in logging
goog.require('goog.string'); // ok to use in logging

/**
 * Provides a debug DebugWindow that is bound to the goog.debug.Logger.
 * It handles log messages and writes them to the DebugWindow. This doesn't
 * provide a lot of functionality that the old caribou logging infrastructure
 * provided like saving debug logs for exporting to the server. Now that we
 * have an event-based logging infrastructure, we can enscapsulate that
 * functionality in a separate class.
 *
 * @constructor
 * @param {String} opt_identifier Idenitifier for this logging class
 * @param {String} opt_prefix Prefix pre-pended to messages
 */
goog.debug.DebugWindow = function(opt_identifier, opt_prefix) {
  /**
   * Idenitifier for this logging class
   * @type String
   */
  this.identifier_ = opt_identifier || '';

  /**
   * Optional prefix to be prepended to error strings
   * @type String
   */
  this.prefix_ = opt_prefix || '';

  /**
   * Buffer for saving the last 1000 messages
   * @type goog.structs.CircularBuffer
   */
  this.savedMessages_ =
      new goog.structs.CircularBuffer(goog.debug.DebugWindow.MAX_SAVED);


  /**
   * Save the publish handler so it can be removed
   *
   * @type Function
   */
  this.publishHandler_ = this.onPublish_.bind(this);

  /**
   * Formatter for formatted output
   * @type goog.debug.Formatter
   */
  this.formatter_ = new goog.debug.HtmlFormatter(this.prefix_);

  // enable by default
  this.setCapturing(true);

  // capture if cookie is set
  if (this.getCookie_('enabled')) {
    this.setEnabled(true);
  }

  // timer to save the DebugWindow's window position in a cookie
  goog.global.setInterval(this.saveWindowPositionSize_.bind(this), 7500);
};

/**
 * Max number of messages to be saved
 * @type Number
 */
goog.debug.DebugWindow.MAX_SAVED = 500;


/**
 * How long to keep the cookies for in milli seconds
 * @type Number
 */
goog.debug.DebugWindow.COOKIE_TIME = 30 * 24 * 60 * 60 * 1000; // 30-days


/**
 * Printed when the debug window opens
 * @type String
 */
goog.debug.DebugWindow.prototype.welcomeMessage = 'LOGGING';


/**
 * Reference to debug window
 * @type Window
 * @private
 */
goog.debug.DebugWindow.prototype.win_ = null;

/**
 * In the process of opening the window
 * @type Boolean
 * @private
 */
goog.debug.DebugWindow.prototype.winOpening_ = false;


/**
 * Whether we are currently capturing logger output.
 *
 * @type Boolean
 * @private
 */
goog.debug.DebugWindow.prototype.isCapturing_ = false;


/**
 * Whether we are currently enabled. When the DebugWindow is enabled, it tries
 * to keep its window open. When it's disabled, it can still be capturing log
 * output if, but it won't try to write them to the DebugWindow window until
 * it's enabled.
 * @type Boolean
 * @private
 */
goog.debug.DebugWindow.prototype.isEnabled_ = false;


/**
 * Whether we already showed an alert that the DebugWindow was blocked.
 * @type Boolean
 * @private
 */
goog.debug.DebugWindow.showedBlockedAlert_ = false;


/**
 * Whether the DebugWindow is enabled. When the DebugWindow is enabled, it
 * tries to keep its window open and logs all messages to the window.  When the
 * DebugWindow is disabled, it stops logging messages to its window.
 *
 * @return {Boolean} Whether the DebugWindow is enabled.
 */
goog.debug.DebugWindow.prototype.isEnabled = function() {
  return this.enabled_;
};


/**
 * Sets whether the DebugWindow is enabled. When the DebugWindow is enabled, it
 * tries to keep its window open and log all messages to the window. When the
 * DebugWindow is disabled, it stops logging messages to its window. The
 * DebugWindow also saves this state to a cookie so that it's persisted accross
 * application refreshes.
 * @param {Boolean} enable Whether the DebugWindow is enabled
 */
goog.debug.DebugWindow.prototype.setEnabled = function(enable) {
  this.enabled_ = enable;

  if (this.enabled_) {
    this.openWindow_();
  }

  this.setCookie_('enabled', enable ? 1 : 0);
};


/**
 * Whether we are currently capturing logger output.
 * @return {Boolean} whether we are currently capturing logger output.
 */
goog.debug.DebugWindow.prototype.isCapturing = function() {
  return this.isCapturing_
};


/**
 * Sets whether we are currently capturing logger output.
 * @param {Boolean} capturing Whether to capture logger output
 */
goog.debug.DebugWindow.prototype.setCapturing = function(capturing) {
  if (capturing == this.isCapturing_) {
    return;
  }

  // attach or detach ahndler from the root logger
  if (capturing) {
    goog.debug.LogManager.getRoot().addHandler(this.publishHandler_);
  } else {
    goog.debug.LogManager.getRoot().removeHandler(this.publishHandler_);
  }
};


/**
 * Gets the formatter for outputting to the debug window. The default formatter
 * is an instance of goog.debug.HtmlFormatter
 * @return {goog.debug.Formatter} The formatter in use
 */
goog.debug.DebugWindow.prototype.getFormatter = function(formatter) {
  return this.formatter_;
};


/**
 * Sets the formatter for outputting to the debug window.
 * @param {goog.debug.Formatter} formatter The formatter to use
 */
goog.debug.DebugWindow.prototype.setFormatter = function(formatter) {
  this.formatter_ = formatter;
};


/**
 * Adds a separator to the debug window.
 */
goog.debug.DebugWindow.prototype.addSeparator = function() {
  this.writeToLog_('<hr>');
};


/**
 * Handler for the publish event from the root logger.
 * @param {goog.debug.LogRecord} logRecord the LogRecord
 */
goog.debug.DebugWindow.prototype.onPublish_ = function(logRecord) {
  var html = this.formatter_.formatRecord(logRecord);

  // If the logger is enabled, open window and write html message to log
  // otherwise save it
  if (this.enabled_) {
    this.openWindow_();
    this.savedMessages_.add(html);
    this.writeToLog_(html);
  } else {
    this.savedMessages_.add(html);
  }
};

/**
 * Write to the log and maybe scroll into view
 * @param {String} html HTML to post to the log
 */
goog.debug.DebugWindow.prototype.writeToLog_ = function(html) {
  if (this.win_) {
    var body = this.win_.document.body;
    var scroll = body &&
               body.scrollHeight - (body.scrollTop + body.clientHeight) <= 100;

    this.win_.document.write(html);

    //TODO(pupius): Throttle this for rapid messages
    if (scroll) {
      this.win_.scrollTo(0, 1000000);
    }
  }
};


/**
 * Writes all saved messages to the DebugWindow.
 */
goog.debug.DebugWindow.prototype.writeSavedMessages_ = function() {
  var messages = this.savedMessages_.getValues();
  for (var i = 0; i < messages.length; i++) {
    this.writeToLog_(messages[i]);
  }
};


/**
 * Opens the debug window if it is not already referenced
 */
goog.debug.DebugWindow.prototype.openWindow_ = function() {
  if ((this.win_ && !this.win_.closed) || this.winOpening_) {
    return;
  }

  var winpos = this.getCookie_('dbg', '0,0,800,500').split(',');
  var x = Number(winpos[0]);
  var y = Number(winpos[1]);
  var w = Number(winpos[2]);
  var h = Number(winpos[3]);

  this.winOpening_ = true;
  this.win_ = window.open('', 'dbg' + this.identifier_, 'width=' + w +
                          ',height=' + h +',toolbar=no,resizable=yes,' +
                          'scrollbars=yes,left=' + x + ',top=' + y +
                          ',screenx=' + x + ',screeny=' + y);

  if (!this.win_) {
    if (!this.showedBlockedAlert_) {
      // only show this once
      alert('Logger popup was blocked');
      this.showedBlockedAlert_ = true;
    }
    this.winOpening_ = false;
  } else {
    this.win_.blur();

    this.win_.document.open();
    this.winOpening_ = false;

    var html = '<style>*{font:normal 14px monospace;}.dbg-sev{color:#F00}' +
               '.dbg-w{color:#E92}.dbg-sh{font-weight:bold;color:#000}' +
               '.dbg-i{color:#888}.dbg-ev{color:#0A0}.dbg-m{color:#990}' +
               '</style>' +
               '<hr><div class="dbg-ev" style="text-align:center">' +
               this.welcomeMessage + '<br><small>Logger: ' +
               this.identifier_ + '</small></div><hr>';

    this.writeToLog_(html);
    this.writeSavedMessages_();
  }
};


/**
 * Save persistant data (using cookies) for 1 month (cookie specific to this
 * logger object)
 * @param {String} key Data name
 * @param {String} value Data value
 */
goog.debug.DebugWindow.prototype.setCookie_ = function(key, value) {
  key += this.identifier_;
  document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' +
    (new Date(goog.now() + goog.debug.DebugWindow.COOKIE_TIME)).toUTCString();
};


/**
 * Retrieve data (using cookies)
 * @param {String} key Data name
 * @param {String} opt_default Optional default value if cookie doesn't exist
 * @return {String} Cookie value
 */
goog.debug.DebugWindow.prototype.getCookie_ = function(key, opt_default) {
  key += this.identifier_;
  var cookie = String(document.cookie);
  var start = cookie.indexOf(key + "=");
  if (start != -1) {
    var end = cookie.indexOf(";", start);
    return decodeURIComponent(cookie.substring(start + key.length + 1,
        end == -1 ? cookie.length : end));
  } else {
    return opt_default || "";
  }
};


/**
 * Saves the window position size to a cookie
 */
goog.debug.DebugWindow.prototype.saveWindowPositionSize_ = function() {
  if (!this.win_ || this.win_.closed) {
    return;
  }
  var x = this.win_.screenX || this.win_.screenLeft || 0;
  var y = this.win_.screenY || this.win_.screenTop || 0;
  var w = this.win_.outerWidth || 800
  var h = this.win_.outerHeight || 500;
  this.setCookie_("dbg", x + "," + y + "," + w + "," + h);
};
