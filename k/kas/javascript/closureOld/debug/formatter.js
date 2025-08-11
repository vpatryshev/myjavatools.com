// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of various formatters for logging. Please minimize
 * dependencies this file has on other closure classes as any dependency it
 * takes won't be able to use the logging infrastructure.
 *
 * @author Jon Perlow (jonp@google.com)
 */

goog.provide('goog.debug.Formatter');
goog.provide('goog.debug.HtmlFormatter');
goog.provide('goog.debug.TextFormatter');

/**
 * Base class for Formatters. A Formatter is used to format a LogRecord into
 * something that can be displayed to the user.
 */
goog.debug.Formatter = function(opt_prefix) {
  this.prefix_ = opt_prefix || '';
  this.relativeTimeStart_ = goog.now();
};

/**
 * Whether to show absolute time in the DebugWindow
 * @type Boolean
 */
goog.debug.Formatter.prototype.showAbsoluteTime = true;

/**
 * Whether to show relative time in the DebugWindow
 * @type Boolean
 */
goog.debug.Formatter.prototype.showRelativeTime = true;

/**
 * Whether to show the logger name in the DebugWindow
 * @type Boolean
 */
goog.debug.Formatter.prototype.showLoggerName = true;

/**
 * Formats a record
 * @param {goog.debug.LogRecord} logRecord the logRecord to format
 * @return {String} The formatted string
 */
goog.debug.Formatter.prototype.formatRecord = function(logRecord) {
  throw Error("Must override formatRecord");
};


/**
 * Resets the start relative time.
 */
goog.debug.Formatter.prototype.resetRelativeTimeStart = function() {
  this.relativeTimeStart_ = goog.now();
};


/**
 * Returns a string for the time/date of the LogRecord.
 */
goog.debug.Formatter.getDateTimeStamp_ = function(logRecord) {
  var time = new Date(logRecord.getMillis());
  return goog.debug.Formatter.getTwoDigitString_((time.getFullYear() - 2000)) +
         goog.debug.Formatter.getTwoDigitString_((time.getMonth() + 1)) +
         goog.debug.Formatter.getTwoDigitString_(time.getDate()) + ' ' +
         goog.debug.Formatter.getTwoDigitString_(time.getHours()) + ':' +
         goog.debug.Formatter.getTwoDigitString_(time.getMinutes()) + ':' +
         goog.debug.Formatter.getTwoDigitString_(time.getSeconds()) + '.' +
         goog.debug.Formatter.getTwoDigitString_(
             Math.floor(time.getMilliseconds() / 10));
};

/**
 * Returns the number as a two-digit string, meaning it preprends a 0 if the
 * number if less than 10.
 */
goog.debug.Formatter.getTwoDigitString_ = function(n) {
  if (n < 10) {
    return '0' + n;
  }
  return String(n);
}


/**
 * Returns a string for the number of seconds relative to the start time.
 * Prepads with spaces so that anything less than 1000 seconds takes up the
 * same number of characters for better formatting.
 */
goog.debug.Formatter.getRelativeTime_ = function(logRecord,
                                                  relativeTimeStart) {
  var ms = logRecord.getMillis() - relativeTimeStart;
  var sec = ms/1000;
  var str = sec.toFixed(3);

  var spacesToPrepend = 0;
  if (sec < 1) {
    spacesToPrepend = 2;
  } else {
    while (sec < 100) {
      spacesToPrepend++;
      sec *= 10;
    }
  }
  while (spacesToPrepend-- > 0) {
    str = ' ' + str;
  }
  return str;
};


/**
 * Formatter that returns formatted html. See formatRecord for the classes
 * it uses for various types of formatted output.
 */
goog.debug.HtmlFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.debug.HtmlFormatter.inherits(goog.debug.Formatter);


/**
 * Formats a record
 * @param {goog.debug.LogRecord} logRecord the logRecord to format
 * @return {String} The formatted string as html
 */
goog.debug.HtmlFormatter.prototype.formatRecord = function(logRecord) {
  var className;
  switch (logRecord.getLevel()) {
    case goog.debug.Logger.Level.SHOUT:
      className = 'dbg-sh';
      break;
    case goog.debug.Logger.Level.SEVERE:
      className = 'dbg-sev';
      break;
    case goog.debug.Logger.Level.WARNING:
      className = 'dbg-w';
      break;
    case goog.debug.Logger.Level.INFO:
      className = 'dbg-i';
      break;
  }

  // Build message html
  var sb = [];
  sb.push(this.prefix_);
  sb.push(' ');
  if (this.showAbsoluteTime) {
    sb.push('[' + goog.debug.Formatter.getDateTimeStamp_(logRecord) +'] ');
  }
  if (this.showRelativeTime) {
    sb.push('[');
    sb.push(goog.string.whitespaceEscape(
        goog.debug.Formatter.getRelativeTime_(logRecord,
            this.relativeTimeStart_)));
    sb.push('s] ');
  }

  if (this.showLoggerName) {
    sb.push('[');
    sb.push(goog.string.htmlEscape(logRecord.getLoggerName()));
    sb.push('] ');
  }
  sb.push('<span class="' + className + '">');
  sb.push(goog.string.newLineToBr(goog.string.whitespaceEscape(
      goog.string.htmlEscape(logRecord.getMessage()))));
      
  if (logRecord.getException()) {
    sb.push('<br>');
    sb.push(goog.string.newLineToBr(goog.string.whitespaceEscape(
        logRecord.getExceptionText())));
  }
  sb.push('</span><br>');

  // If the logger is enabled, open window and write html message to log
  // otherwise save it
  return sb.join('');
};


/**
 * Formatter that returns formatted plain text
 */
goog.debug.TextFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.debug.TextFormatter.inherits(goog.debug.Formatter);


/**
 * Formats a record as text
 * @param {goog.debug.LogRecord} logRecord the logRecord to format
 * @return {String} The formatted string
 */
goog.debug.TextFormatter.prototype.formatRecord = function(logRecord) {
  // Build message html
  var sb = [];
  sb.push(this.prefix_);
  sb[sb.length] = ' ';
  if (this.showAbsoluteTime) {
    sb.push('[');
    sb.push(goog.debug.Formatter.getDateTimeStamp_(logRecord));
    sb.push('] ');
  }
  if (this.showRelativeTime) {
    sb.push('[');
    sb.push(goog.debug.Formatter.getRelativeTime_(logRecord,
        this.relativeTimeStart_));
    sb.push('s] ');
  }

  if (this.showLoggerName) {
    sb.push('[' + logRecord.getLoggerName() + '] ');
  }
  sb.push(logRecord.getMessage());
  sb.push('\n');

  // If the logger is enabled, open window and write html message to log
  // otherwise save it
  return sb.join('');
};

