// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the Logger class. Please minimize dependencies
 * this file has on other closure classes as any dependency it takes won't be
 * able to use the logging infrastructure.
 *
 * @author Jon Perlow (jonp@google.com)
 */

goog.provide('goog.debug.Logger');
goog.provide('goog.debug.LogManager');
goog.require('goog.debug');
goog.require('goog.debug.LogRecord');

/**
 * The Logger is an object used for logging debug messages. Loggers are
 * normally named, using a hierarchical dot-separated namespace. Logger names
 * can be arbitrary strings, but they should normally be based on the package
 * name or class name of the logged component, such as goog.net.BrowserChannel.
 *
 * The Logger object is loosely based on the java class
 * java.util.logging.Logger. It supports different levels of filtering for
 * different loggers.
 *
 * The logger object should never be instantiated by application code. It
 * should always use the goog.debug.Logger.getLogger function.
 *
 * @constructor
 * @param {String} name The name of the Logger.
 */
goog.debug.Logger = function(name) {
  /**
   * Name of the Logger. Generally a dot-separated namespace
   * @type String
   * @private
   */
  this.name_ = name;

  /**
   * Parent Logger.
   * @type goog.debug.Logger
   * @private
   */
  this.parent_ = null;

  /**
   * Map of children loggers. The keys are the leaf names of the children and
   * the values are the child loggers.
   * @type Map&lt;String, goog.debug.Logger&gt;
   * @private
   */
  this.children_ = {};

  /**
   * Handlers that are listening to this logger.
   * @type Array&lt;Function&gt;
   * @private
   */
  this.handlers_ = [];
};


/**
 * Level that this logger only filters above. Null indicates it should
 * inherit from the parent.
 * @type goog.debug.Logger.Level
 * @private
 */
goog.debug.Logger.prototype.level_ = null;


/**
 * The Level class defines a set of standard logging levels that
 * can be used to control logging output.  The logging Level objects
 * are ordered and are specified by ordered integers.  Enabling logging
 * at a given level also enables logging at all higher levels.
 * <p>
 * Clients should normally use the predefined Level constants such
 * as Level.SEVERE.
 * <p>
 * The levels in descending order are:
 * <ul>
 * <li>SEVERE (highest value)
 * <li>WARNING
 * <li>INFO
 * <li>CONFIG
 * <li>FINE
 * <li>FINER
 * <li>FINEST  (lowest value)
 * </ul>
 * In addition there is a level OFF that can be used to turn
 * off logging, and a level ALL that can be used to enable
 * logging of all messages.
 *
 * @param {String} name The name of the level
 * @param {Number} value The numeric value of the level.
 * @constructor
 */
goog.debug.Logger.Level = function(name, value) {
  /**
   * The name of the level
   * @type String
   */
  this.name = name;

  /**
   * The numeric value of the level
   * @type Number
   */
  this.value = value;
};


/**
 * OFF is a special level that can be used to turn off logging.
 * This level is initialized to <CODE>Integer.MAX_VALUE</CODE>.
 * @type goog.debug.Logger.Level
 */
goog.debug.Logger.Level.OFF =
    new goog.debug.Logger.Level('OFF', Number.INFINITY);

/**
 * SHOUT is a message level for extra debugging loudness.
 * This level is initialized to <CODE>1200</CODE>.
 * @type goog.debug.Logger.Level
 */
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level('SHOUT', 1200);

/**
 * SEVERE is a message level indicating a serious failure.
 * This level is initialized to <CODE>1000</CODE>.
 * @type goog.debug.Logger.Level
 */
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level('SEVERE', 1000);

/**
 * WARNING is a message level indicating a potential problem.
 * This level is initialized to <CODE>900</CODE>.
 * @type goog.debug.Logger.Level
 */
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level('WARNING', 900);


/**
 * INFO is a message level for informational messages.
 * This level is initialized to <CODE>800</CODE>.
 * @type goog.debug.Logger.Level
 */
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level('INFO', 800);


/**
 * CONFIG is a message level for static configuration messages.
 * This level is initialized to <CODE>700</CODE>.
 * @type goog.debug.Logger.Level
 */
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level('CONFIG', 700);


/**
  * FINE is a message level providing tracing information.
  * This level is initialized to <CODE>500</CODE>.
  * @type goog.debug.Logger.Level
  */
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level('FINE', 500);

/**
  * FINER indicates a fairly detailed tracing message.
  * This level is initialized to <CODE>400</CODE>.
  * @type goog.debug.Logger.Level
  */
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level('FINE', 400);

/**
  * FINEST indicates a highly detailed tracing message.
  * This level is initialized to <CODE>300</CODE>.
  * @type goog.debug.Logger.Level
  */

goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level('FINE', 300);

/**
  * ALL indicates that all messages should be logged.
  * This level is initialized to <CODE>Number.MIN_VALUE</CODE>.
  * @type goog.debug.Logger.Level
  */
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level('ALL', 0);


/**
 * Find or create a logger for a named subsystem. If a logger has already been
 * created with the given name it is returned. Otherwise a new logger is
 * created. If a new logger is created its log level will be configured based
 * on the LogManager configuration and it will configured to also send logging
 * output to its parent's handlers. It will be registered in the LogManager
 * global namespace.
 *
 * @param {String} name A name for the logger. This should be a dot-separated
 * name and should normally be based on the package name or class name of the
 * subsystem, such as goog.net.BrowserChannel.
 * @return {goog.debug.Logger} The named logger.
 */
goog.debug.Logger.getLogger = function(name) {
  return goog.debug.LogManager.getLogger(name);
};


/**
 * Gets the name of this logger.
 * @return {String} The name of this logger.
 */
goog.debug.Logger.prototype.getName = function() {
  return this.name_;
};


/**
 * Adds a handler to the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 */
goog.debug.Logger.prototype.addHandler = function(handler) {
  this.handlers_.push(handler);
};


/**
 * Removes a handler from the logger. This doesn't use the event system because
 * we want to be able to add logging to the event system.
 */
goog.debug.Logger.prototype.removeHandler = function(handler) {
  // doesn't use goog.array.remove because don't want to take dependency from
  // logging code
  for (var i = 0; i < this.handlers_.length; i++) {
    if (this.handlers_[i] == handler) {
      this.handlers_.splice(i, 1);
      return true;
    }
  }
  return false;
};


/**
 * Returns the parent of this logger.
 * @return {goog.debug.Logger} The parent logger or null if this is the root.
 */
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_;
};


/**
 * Returns the children of this logger as a map of the child name to the logger.
 * @return {Map&lt;String, goog.debug.Logger&gt;} The map where the keys are
 * the child leaf names and the values are the Logger objects.
 */
goog.debug.Logger.prototype.getChildren = function() {
  return this.children_;
};


/**
 * Set the log level specifying which message levels will be logged by this
 * logger. Message levels lower than this value will be discarded.
 * The level value Level.OFF can be used to turn off logging. If the new level
 * is null, it means that this node should inherit its level from its nearest
 * ancestor with a specific (non-null) level value.
 *
 * @param {goog.debug.Logger.Level} level The new level.
 */
goog.debug.Logger.prototype.setLevel = function(level) {
  this.level_ = level;
};


/**
 * Check if a message of the given level would actually be logged by this
 * logger. This check is based on the Loggers effective level, which may be
 * inherited from its parent.
 * @param {goog.debug.Logger.Level} level The level to check.
 * @return {Boolean} Whether the message would be logged.
 */
goog.debug.Logger.prototype.isLoggable = function(level) {
  if (this.level_) {
    return level.value >= this.level_.value;
  }
  if (this.parent_) {
    return this.parent_.isLoggable(level);
  }
  return false;
};


/**
 * Log a message. If the logger is currently enabled for the
 * given message level then the given message is forwarded to all the
 * registered output Handler objects.
 * @param {goog.debug.Logger.Level} level One of the level identifiers
 * @param {String} msg The string message
 * @param {Object} opt_exception An exception associated with the message
 */
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
  // java caches the effective level, not sure it's necessary here
  if (!this.isLoggable(level)) {
    return;
  }

  var logRecord = new goog.debug.LogRecord(level, String(msg), this.name_);
  if (opt_exception) {
    logRecord.setException(opt_exception);
    logRecord.setExceptionText(
        goog.debug.exposeException(opt_exception, arguments.callee.caller));
  }
  this.logRecord(logRecord);
};


/**
 * Log a message at the Logger.Level.SHOUT level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {String} msg The string message
 * @param {Object} opt_exception An exception associated with the message
 */
goog.debug.Logger.prototype.shout = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.SHOUT, msg, opt_exception);
};


/**
 * Log a message at the Logger.Level.SEVERE level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {String} msg The string message
 * @param {Object} opt_exception An exception associated with the message
 */
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception);
};


/**
 * Log a message at the Logger.Level.SEVERE level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {String} msg The string message
 * @param {Object} opt_exception An exception associated with the message
 */
goog.debug.Logger.prototype.warning = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception);
};


/**
 * Log a message at the Logger.Level.INFO level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {String} msg The string message
 * @param {Object} opt_exception An exception associated with the message
 */
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.INFO, msg, opt_exception);
};


/**
 * Log a message at the Logger.Level.CONFIG level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {String} msg The string message
 * @param {Object} opt_exception An exception associated with the message
 */
goog.debug.Logger.prototype.config = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception);
};


/**
 * Log a message at the Logger.Level.FINE level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {String} msg The string message
 * @param {Object} opt_exception An exception associated with the message
 */
goog.debug.Logger.prototype.fine = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.FINE, msg, opt_exception);
};


/**
 * Log a message at the Logger.Level.FINER level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {String} msg The string message
 * @param {Object} opt_exception An exception associated with the message
 */
goog.debug.Logger.prototype.finer = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.FINER, msg, opt_exception);
};


/**
 * Log a message at the Logger.Level.FINEST level.
 * If the logger is currently enabled for the given message level then the
 * given message is forwarded to all the registered output Handler objects.
 * @param {String} msg The string message
 * @param {Object} opt_exception An exception associated with the message
 */
goog.debug.Logger.prototype.finest = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.FINEST, msg, opt_exception);
};


/**
 * Log a LogRecord. If the logger is currently enabled for the
 * given message level then the given message is forwarded to all the
 * registered output Handler objects.
 * @param {goog.debug.LogRecord} logRecord A log record to log
 */
goog.debug.Logger.prototype.logRecord = function(logRecord) {
  if (!this.isLoggable(logRecord.getLevel())) {
    return;
  }

  var target = this;
  while (target) {
    target.callPublish_(logRecord);
    target = target.getParent();
  }
};


/**
 * Calls the handlers for publish.
 * @param {goog.debug.LogRecord} logRecord The log record to publish.
 */
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
  for (var i = 0; i < this.handlers_.length; i++) {
    this.handlers_[i](logRecord);
  }
};


/**
 * Sets the parent of this logger. This is used for setting up the logger tree.
 * @param {goog.debug.Logger} parent The parent logger.
 * @private
 */
goog.debug.Logger.prototype.setParent_ = function(parent) {
  this.parent_ = parent;
};


/**
 * Adds a child to this logger. This is used for setting up the logger tree.
 * @param {String} name The leaf name of the child.
 * @param {goog.debug.Logger} logger The child logger.
 * @private
 */
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
  this.children_[name] = logger;
};


/**
 * There is a single global LogManager object that is used to maintain a set of
 * shared state about Loggers and log services. This is loosely based on the
 * java class java.util.logging.LogManager.
 *
 */
goog.debug.LogManager = {};

/**
 * Map of logger names to logger objects
 *
 * @type Map&lt;String, goog.debug.Logger&gt;
 * @private
 */
goog.debug.LogManager.loggers_ = {};

/**
 * The root logger which is the root of the logger tree.
 * @type goog.debug.Logger
 * @private
 */
goog.debug.LogManager.rootLogger_ = new goog.debug.Logger('');
goog.debug.LogManager.loggers_[''] = goog.debug.LogManager.rootLogger_;
goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG);


/**
 * Returns the root of the logger tree namespace, the logger with the empty
 * string as its name
 *
 * @return {goog.debug.Logger} The root logger.
 */
goog.debug.LogManager.getRoot = function() {
  return goog.debug.LogManager.rootLogger_;
};


/**
 * Method to find a named logger.
 *
 * @param {String} name A name for the logger. This should be a dot-separated
 * name and should normally be based on the package name or class name of the
 * subsystem, such as goog.net.BrowserChannel.
 * @return {goog.debug.Logger} The named logger.
 */
goog.debug.LogManager.getLogger = function(name) {
  var logger = goog.debug.LogManager.loggers_[name];
  if (logger == null) {
    logger = goog.debug.LogManager.createLogger_(name);
  }
  return logger;
};


/**
 * Creates the named logger. Will also create the parents of the named logger
 * if they don't yet exist.
 * @param {String} name The name of the logger.
 * @return {goog.debug.Logger} The named logger.
 * @private
 */
goog.debug.LogManager.createLogger_ = function(name) {
  // find parent logger
  var logger = new goog.debug.Logger(name);
  var parts = name.split('.');
  var leafName = parts[parts.length - 1];
  parts.length = parts.length - 1;
  var parentName = parts.join('.');
  var parentLogger = goog.debug.LogManager.getLogger(parentName);

  // tell the parent about the child and the child about the parent
  parentLogger.addChild_(leafName, logger);
  logger.setParent_(parentLogger);

  goog.debug.LogManager.loggers_[name] = logger;
  return logger;
};

