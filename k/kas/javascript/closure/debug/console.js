// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Simple logger that logs to the window console if available
 * 
 * Has an autoInstall option which can be put into initialization code, which
 * will start logging if "Debug=true" is in document.location.href
 *
 * @author Evan Gilbert (uidude@google.com)
 */
 
goog.provide('goog.debug.Console');

goog.require('goog.debug.Logger');
goog.require('goog.debug.Formatter');


/**
 * Create and install a log handler that logs to window.console if avaialble
 * @constructor
 */
goog.debug.Console = function() {
  this.publishHandler_ = this.onPublish_.bind(this);
  this.formatter_ = new goog.debug.TextFormatter();
  this.formatter_.showAbsoluteTime = false;
  this.isCapturing_ = false;
  this.logBuffer_ = '';
};


/**
 * Sets whether we are currently capturing logger output.
 * @param {Boolean} capturing Whether to capture logger output
 */
goog.debug.Console.prototype.setCapturing = function(capturing) {
  if (capturing == this.isCapturing_) {
    return;
  }

  // attach or detach ahndler from the root logger
  if (capturing) {
    goog.debug.LogManager.getRoot().addHandler(this.publishHandler_);
  } else {
    goog.debug.LogManager.getRoot().removeHandler(this.publishHandler_);
    this.logBuffer = '';
  }
};


/**
 * Handler for new log requests
 * @param {goog.debug.LogRecord} logRecord The log entry
 */
goog.debug.Console.prototype.onPublish_ = function(logRecord) {
  if (window.console) {
    window.console.log(this.formatter_.formatRecord(logRecord));
  } else {
    this.logBuffer_ += this.formatter_.formatRecord(logRecord);
  }
};


/**
 * Glbale console logger instance
 * @type goog.debug.Console
 */
goog.debug.Console.instance = null;


/**
 * Install the console and start capturing if "Debug=true" is in the page URL
 */
goog.debug.Console.autoInstall = function() {
  if (!goog.debug.Console.instance_) {
    goog.debug.Console.instance = new goog.debug.Console();
  }
  
  if (document.location.href.indexOf('Debug=true') != -1) {
    goog.debug.Console.instance.setCapturing(true);
  }
}


/**
 * Show an alert with all of the captured debug information.
 * Information is only captured if console is not available
 */
goog.debug.Console.show = function() {
  alert(goog.debug.Console.instance.logBuffer_);
}