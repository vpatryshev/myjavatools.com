// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the LogRecord class. Please minimize
 * dependencies this file has on other closure classes as any dependency it
 * takes won't be able to use the logging infrastructure.
 *
 * @author Jon Perlow (jonp@google.com)
 */

goog.provide('goog.debug.LogRecord');

/**
 * LogRecord objects are used to pass logging requests between
 * the logging framework and individual log Handlers.
 * @constructor
 * @param {goog.debug.Logger.Level} level One of the level identifiers
 * @param {String} msg The string message
 * @param {String} loggerName The name of the source logger
 */
goog.debug.LogRecord = function(level, msg, loggerName) {
  /**
   * Sequence number for the LogRecord. Each record has a unique sequence number
   * that is greater than all log records created before it.
   * @type Number
   * @private
   */
  this.sequenceNumber_ = goog.debug.LogRecord.nextSequenceNumber_++;

  /**
   * Time the LogRecord was created.
   * @type Number
   * @private
   */
  this.time_ = goog.now();

  /**
   * Level of the LogRecord
   * @type goog.debug.Logger.Level
   * @private
   */
  this.level_ = level;

  /**
   * Message associated with the record
   * @type String
   * @private
   */
  this.msg_ = msg;


  /**
   * Name of the logger that created the record.
   * @type String
   * @private
   */
  this.loggerName_ = loggerName;
};

/**
 * Exception associated with the record
 * @type Object
 * @private
 */
goog.debug.LogRecord.prototype.exception_ = null;

/**
 * Exception text associated with the record
 * @type String
 * @private
 */
goog.debug.LogRecord.prototype.exceptionText_ = null;


/**
 * A sequence counter for assigning increasing sequence numbers to LogRecord
 * objects.
 * @type Number
 * @private
 */
goog.debug.LogRecord.nextSequenceNumber_ = 0;


/**
 * Get the source Logger's name.
 *
 * @return {String} source logger name (may be null)
 */
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_
};


/**
 * Get the exception that is part of the log record.
 *
 * @return {Object} the exception
 */
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_;
};


/**
 * Set the exception that is part of the log record.
 *
 * @param {Object} exception the exception
 */
goog.debug.LogRecord.prototype.setException = function(exception) {
  this.exception_ = exception;
};


/**
 * Get the exception text that is part of the log record.
 *
 * @return {String} Exception text
 */
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_;
};


/**
 * Set the exception text that is part of the log record.
 *
 * @param {String} text The exception text
 */
goog.debug.LogRecord.prototype.setExceptionText = function(text) {
  this.exceptionText_ = text;
};


/**
 * Get the source Logger's name.
 *
 * @param {String} loggerName source logger name (may be null)
 */
goog.debug.LogRecord.prototype.setLoggerName = function(loggerName) {
  this.loggerName_ = loggerName;
};


/**
 * Get the logging message level, for example Level.SEVERE.
 * @return {goog.debug.Logger.Level} the logging message level
 */
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_;
};


/**
 * Set the logging message level, for example Level.SEVERE.
 * @param {goog.debug.Logger.Level} level the logging message level
 */
goog.debug.LogRecord.prototype.setLevel = function(level) {
  this.level_ = level;
};


/**
 * Get the "raw" log message, before localization or formatting.
 *
 * @return {String} the raw message string
 */
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_;
};


/**
 * Set the "raw" log message, before localization or formatting.
 *
 * @param {String} msg the raw message string
 */
goog.debug.LogRecord.prototype.setMessage = function(msg) {
  this.msg_ = msg;
};


/**
 * Get event time in milliseconds since 1970.
 *
 * @return {Number} event time in millis since 1970
 */
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_;
};


/**
 * Set event time in milliseconds since 1970.
 *
 * @param {Number} time event time in millis since 1970
 */
goog.debug.LogRecord.prototype.setMillis = function(time) {
  this.time_ = time;
};


/**
 * Get the sequence number.
 * <p>
 * Sequence numbers are normally assigned in the LogRecord
 * constructor, which assigns unique sequence numbers to
 * each new LogRecord in increasing order.
 * @return {Number} the sequence number
 */
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_;
};




