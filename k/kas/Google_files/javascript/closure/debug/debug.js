// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Logging and debugging utilities
 * This file should have no dependencies outside this file and should be able
 * to run independently
 * 
 * Previous versions did and this can cause a lot of confusion if the errors
 * 
 * @author pupius@google.com (Daniel Pupius) [Based on Caribou's debug code]
 */

// TODO(pupius): Fix remote logging behaviour

// Build namespaces without deps on external files (they might cause errors)

if (!goog) goog = {};
goog.debug = {};


//==============================================================================
// Static constants
//==============================================================================

/**
 * Message constant
 * @type Number
 */
goog.debug.MESSAGE = 0;

/**
 * Application Event constant (signifies a significant occurance, not
 * necessarily a browser event)
 * @type Number
 */
goog.debug.EVENT = 1;

/**
 * Debug constant
 * @type Number
 */
goog.debug.DEBUG = 2;

/**
* Shout constant
* @type Number
*/
goog.debug.SHOUT = 3;

/**
* Warning constant
* @type Number
*/
goog.debug.WARNING = 4;

/**
 * Severe constant (normally errors)
 * @type Number
 */
goog.debug.SEVERE = 5;

/**
 * Max number of messages to be saved
 * @type Number
 */
goog.debug.MAX_SAVED = 500;

/**
 * Max number of messages to be saved before flushing to the server
 * @type Number
 */
goog.debug.FLUSH_COUNT = 100;

/**
 * What minimum level of messages to report to the server
 * @type Number
 */
goog.debug.REPORT_LEVEL = 5;

/**
 * How long to keep the cookies for in milli seconds
 * @type Number
 */
goog.debug.COOKIE_TIME = 30 * 24 * 60 * 60 * 1000; // 30-days

/**
 * Max depth of recursion for stack trace
 * @type Number
 */
goog.debug.MAX_STACK_DEPTH = 25;

/**
 * Constructor for the logging class.
 * 
 * @param {String} identifier Idenitifier for this logging class
 * @param {String} prefix Prefix pre-pended to messages
 * @constructor
 */
goog.debug.Logger = function(identifier, prefix) {
  /**
   * Idenitifier for this logging class
   * @type String
   */
  this.identifier = identifier;
  
  /**
   * Optional prefix to be prepended to error strings
   * @type String
   */
  this.prefix = prefix;
  
  /**
   * If localLogging is on, this determines whether to output to the log window
   * or just save the messages
   * @type Booelan
   */
  this.enabled = this.getCookie('enabled') == '1' ? true : false;
  

  // Handle all errors (would use listen or bind, but want to avoid deps)
  var that = this;
  window.onerror = function(a, b, c) { return that.handleError(a, b, c); };
};



//==============================================================================
// Instance properties
//==============================================================================

/**
 * Whether errors are kept silent
 * @type Boolean
 */
goog.debug.Logger.prototype.maskErrors = true;

/**
 * Whether to log messages and errors at all locally
 * @type Boolean
 */
goog.debug.Logger.prototype.localLogging = true;

/**
 * Whether to log messages remotely
 * @type Boolean
 */
goog.debug.Logger.prototype.remoteLogging = true;

/**
 * Timestamp for working out how long the logging has been running
 * @type Date
 */
goog.debug.Logger.prototype.startTime = new Date();


/**
 * Printed when the debug window opens
 * @type String
 */
goog.debug.Logger.prototype.welcomeMessage = 'LOGGING';

/** 
 * Reference to debug window
 * @type Window
 */
goog.debug.Logger.prototype.win_ = null;

/** 
 * In the preocess of opening the window
 * @type Boolean
 */
goog.debug.Logger.prototype.winOpening_ = false;

/**
 * Buffer for saved messages before being printed out
 * @type Array
 */
goog.debug.Logger.prototype.savedMessages_ = [];

/**
 * Overridable callback for sending errors to the server
 * @param {String} title
 * @param {String} error
 */
goog.debug.Logger.prototype.errorCallback = function(title, error) { }



//==============================================================================
// Logging functions
//==============================================================================

/**
 * Write a debug string to the console, in muted gray
 * @param {String} str Message
 */
goog.debug.Logger.prototype.debug = function(str) {
  this.handleMsg(str, goog.debug.DEBUG);
};


/**
 * Write a debug string to the console, in pylon orange
 * @param {String} str Message
 */
goog.debug.Logger.prototype.warning = function(str) {
  this.handleMsg(str, goog.debug.WARNING);
};


/** 
 * Write a debug string to the console, in bold black.
 * For temporary debugging only.  Never check in code that calls Shout.
 * @param {String} str Message
 */
goog.debug.Logger.prototype.shout = function(str) {
  this.handleMsg(str, goog.debug.SHOUT);
};


/** 
 * Write a debug string to the console, in green, this will also print a <hr>
 * and restart timers
 * @param {String} str Message
 */
goog.debug.Logger.prototype.event = function(str) {
  this.startTime = new Date();
  this.handleMsg(str, goog.debug.EVENT);
};



//==============================================================================
// Debug message handling
//==============================================================================

/**
 * Format a message and print it to the log
 * @param {String} str Message
 * @param {Number} opt_level Error level, see constants
 * @param {Boolean} opt_noescape Don't escape input string
 */
goog.debug.Logger.prototype.handleMsg = function(str, opt_level, opt_noescape) {
  str = String(str);
  
  // If logging is turned on show the message
  if (this.localLogging || this.remoteLogging) {
    var diff = (new Date) - this.startTime;   

    // Build message html
    var html = '';
    
    if (opt_level == goog.debug.EVENT) {
      html += '<hr>';
    }         
               
    html += this.prefix + ' [' + diff + '] <span class="dbg-';
    
    html += opt_level == goog.debug.SEVERE ? 'e' :
            opt_level == goog.debug.EVENT ? 'ev' :
            opt_level == goog.debug.MESSAGE ? 'm' :
            opt_level == goog.debug.WARNING ? 'w' :
            opt_level == goog.debug.SHOUT ? 's' :
            'd';
    
    html += '">';
    
       
    html += !opt_noescape ? goog.debug.escape(str) : str;
    
    html += '</span><br>';

    // If the logger is enabled, open window and write html message to log
    // otherwise save it
    if (this.localLogging && this.enabled) {
      this.openWindow();    
      this.writeToLog(html);
    } else if (this.localLogging) {
      this.saveMessage(html);
    }
    
    // If the error is severe then send the buffered messages to the server
    if (this.remoteLogging && opt_level == goog.debug.SEVERE) {
      this.sendDebugLog();
    }
  }
};


/**
 * Opens the debug window if it is not already referenced
 */
goog.debug.Logger.prototype.openWindow = function() {
  if ((this.win_ == null || this.win_.closed) && !this.winOpening_) {

    var winpos = this.getCookie('dbg', '0,0,800,500').split(',');
    var x = parseInt(winpos[0]);
    var y = parseInt(winpos[1]);
    var w = parseInt(winpos[2]);
    var h = parseInt(winpos[3]);
      
    this.winOpening_ = true;
    this.win_ = window.open('', 'dbg' + this.identifier, 'width=' + w + 
                            ',height=' + h +',toolbar=no,resizable=yes,' +  
                            'scrollbars=yes,left=' + x + ',top=' + y +
                            ',screenx=' + x + ',screeny=' + y);
    
    if (!this.win_) {
      alert('Logger popup was blocked');
      this.winOpening_ = false;
    } else {
      this.win_.blur();
     
      this.win_.document.open();
      this.winOpening_ = false;
      
      var html = '<style>*{font:normal 14px monospace;}.dbg-e{color:#F00}' +
                 '.dbg-w{color:#E92}.dbg-s{font-weight:bold;color:#000}' +
                 '.dbg-d{color:#888}.dbg-ev{color:#0A0}.dbg-m{color:#990}' +
                 '</style><script>' +
                 'setInterval(function() {' +
                   'var x = window.screenX || window.screenLeft || 0;' +
                   'var y = window.screenY || window.screenTop || 0;' +
                   'var w = window.outerWidth || 800;' +
                   'var h = window.outerHeight || 500;' +
                   'if(window.opener&&window.opener.logger)window.opener.' +
                   'logger.setCookie("dbg", x + "," + y + "," + w + "," + h);' +
                 '}, 7500)</script>' +
                 '<hr><div class="dbg-ev" style="text-align:center">' +
                 this.welcomeMessage + '<br><small>Logger: ' + this.identifier + 
                 '</small></div><hr>';
      
      this.writeToLog(html);   
      this.writeSavedMessages();
    }
  }  
};


/**
 * Write to the log and maybe scroll into view
 * @param {String} html HTML to post to the log
 */
goog.debug.Logger.prototype.writeToLog = function(html) {
  var body = this.win_.document.body;
  var scroll = body &&
               body.scrollHeight - (body.scrollTop + body.clientHeight) <= 100;
    
  this.win_.document.write(html);
  
  //TODO(pupius): Throttle this for rapid messages
  if (scroll) {
    this.win_.scrollTo(0, 1000000);
  }
};


/**
 * Save a message that has not been output to the log
 * @param {String} html Message to save
 */
goog.debug.Logger.prototype.saveMessage = function(html) {
  this.savedMessages_.push(html);
  
  // Note: Shift is O(N), but is negligible when buffering only a few hundred
  // items, if the buffer is increased to thousands this needs changing
  if (this.savedMessages_.length > goog.debug.MAX_SAVED) {
    this.savedMessages_.shift();
  }
  
  // For remote debugging: if the message cache is full, send the messages
  // to the server.
  if (this.savedMessages_.length >= goog.debug.FLUSH_COUNT) {
    this.sendDebugLog();
  }
};


/**
 * Write messages that have been saved and not printed to the debug window
 */
goog.debug.Logger.prototype.writeSavedMessages = function() {
  var i = 0;
  while (this.savedMessages_.length > 0) {
    this.writeToLog(this.savedMessages_.shift());
    i++;
  }
};


/** 
 * Report saved errors to the server
 */
goog.debug.Logger.prototype.sendDebugLog = function() {
  if (this.savedMessages_.length > 0) {
    var msg = this.savedMessages_.join('\n');
    this.errorCallback('JS remote debug log', msg);
  }
};



//==============================================================================
// State handling
//==============================================================================

/**
 * Toggles the logging state on and off
 */
goog.debug.Logger.prototype.toggleEnabled = function() {
  this.handleMsg('logging ' + (this.enabled ? 'disabled' : 'enabled'),
                 goog.debug.MESSAGE);
  
  this.setEnabled(!this.enabled);
};


/**
 * Sets the logging mode
 * @pram {Boolean} mode On or off
 */
goog.debug.Logger.prototype.setEnabled = function(mode) {
  this.enabled = mode;
  
  if (mode) {
    this.openWindow(); 
    this.writeSavedMessages();
  }
  
  this.setCookie('enabled', mode ? 1 : 0);
};


//==============================================================================
// Exception and object analysis
//==============================================================================

/**
 * Handle error events from the window object
 * @param {String} msg Error message
 * @param {String} url File error occured in
 * @param {Number} line Line number of error
 * @return {Boolean} If in debug mode false else true and error will not be 
 *                   recorded by the browser
 */
goog.debug.Logger.prototype.handleError = function(msg, url, line) {
  var errorMsg = 'A JavaScript Error Occurred<br>Message: ' + 
                 goog.debug.escape(msg) + '<br>Url: <a href="view-source:' + 
                 url + '" target="_new">' + url + '</a><br>Line: ' + line;
  
  this.handleMsg(errorMsg, goog.debug.SEVERE, true);
  
  // Cancel error if we're not in debug mode
  return this.maskErrors;
};


/**
 * Dump an exception that has been caught by a try...catch
 * @param {Object} err Error object or string
 * @param {String} opt_msg Optional message
 */
goog.debug.Logger.prototype.dumpException = function(err) {  
  
  var e = (typeof err == 'string') ?
            {
              message: err,
              name: 'Unknown error',
              lineNumber: 'Not available',
              fileName: goog.global.document.location.href,
              stack: 'Not available'
            } :
              
          // IE Error object
          (err.number && err.desciption) ?
            {
              message: err.message + ' ' + err.description,
              name: err.name,
              lineNumber: err.number,
              fileName: goog.global.document.location.href,
              stack: 'Not available'
            } :
              
          // Standards error object
            err;
  
  var title = e.name + ': ' + e.message + ' (' + e.lineNumber + ')';
   
  // Create the basic error message
  var error = 'A JavaScript Error Was Caught<br>Message: ' + 
    goog.debug.escape(e.toString()) + '<br>Url: <a href="view-source:' + 
    e.filename + '" target="_new">' + e.fileName + '</a><br>Line: ' + 
    e.lineNumber + '<br><br>Browser stack:<br>' + 
    goog.debug.escape(e.stack, '-> ') + '[end]<br><br>JS stack traversal:<br>' +
    goog.debug.escape(
        goog.debug.getStacktrace(this.dumpException.caller), '-> ') + '<br>';
    
  this.handleMsg(error, goog.debug.SEVERE, true);
  
  // Send error report to the server
  this.errorCallback(title, error);
};



//==============================================================================
// Utilities - Inc. Super lightweight cookie functons
// (to avoid deps on external code that may be causing the errors we're logging)
//==============================================================================

/**
 * Save persistant data (using cookies) for 1 month (cookie specific to this 
 * logger object)
 * @param {String} key Data name
 * @param {String} value Data value
 */
goog.debug.Logger.prototype.setCookie = function(key, value) {
  key += this.identifier;
  document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + 
    (new Date((new Date).valueOf() + goog.debug.COOKIE_TIME)).toUTCString();
};


/**
 * Retrieve data (using cookies)
 * @param {String} key Data name
 * @param {String} opt_default Optional default value if cookie doesn't exist
 * @return {String} Cookie value
 */
goog.debug.Logger.prototype.getCookie = function(key, opt_default) {
  key += this.identifier;
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


//==============================================================================
// Static Helper functions
//==============================================================================

/**
 * Escape html without depending on any external libs
 * @param {String} str String to escape
 * @param {String} opt_indent Optional indent
 * @return {String} Escaped string
 */
goog.debug.escape = function(str, opt_indent) {
  if (!opt_indent) {
    opt_indent = '';
  }
  
  return opt_indent + String(str).replace(/&/g, '&amp;')
                                 .replace(/</g, '&lt;')
                                 .replace(/>/g, '&gt;')
                                 .replace(/\"/g, '&quot;')
                                 .replace(/\n/g, '<br>' + opt_indent);
};


/**
 * Recursively outputs a nested array as a string
 * @param {Array} arr The array
 * @return {String} String representing nested array
 */
goog.debug.exposeArray = function(arr, opt_indent) {
  var ind = opt_indent || '';
  var str = ind + '[\n';
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array || typeof arr[i] == 'object' &&
        typeof arr[i].join == 'function' && 
        typeof arr[i].reverse == 'function') {
      str += goog.debug.exposeArray(arr[i], ind + '..');
    } else {
      str += ind + '..' + arr[i] + '\n';
    }
  }
  str += ind + ']\n';
  return str;
};


/**
 * Creates a string representing an object and all it's properties
 * @param {Object} obj Object to expose
 * @return {String}
 */
goog.debug.expose = function(obj) {
  if (obj == null) return 'NULL';
  var text = '';
  for (var x in obj) {
    text += '\n' + x + ' = ';
    try {
      text += obj[x];
    } catch (e) {
      text += '*** ' + e + ' ***';
    }
  }
  return text;
};


/**
 * Recursive function to get the stack trace, given a current function
 * on the call stack
 * @param {Function} fn the current function on the call stack
 * @return {String} Stack trace
 */
goog.debug.getStacktrace = function(fn, opt_depth) {
  var out = '';

  var depth = (opt_depth || 0) + 1;
  
  // Traverse the call stack until function not found or max depth is reached
  if (fn && depth < goog.debug.MAX_STACK_DEPTH) {
    out += goog.debug.getFunctionName(fn) + '(';
    var args = fn.arguments;
    for (var i = 0; i < args.length; i++) {
      if (i > 0) {
        out += ', ';
      }
      
      var arg = (typeof args[i] == 'object' && args[i].toSource) ? 
                   args[i].toSource() : String(args[i]);
                   
      if (arg.length > 40) {
        arg = arg.substr(0, 40) + '...';
      }
      out += arg;
    }
    out += ')\n' + goog.debug.getStacktrace(fn.caller, depth);
  
  } else if (fn) {
    out += '[...recursion...]';
  } else {
    out += '[end]';
  }
  return out;
};


/**
 * Gets a function name
 * @param {Function} fn Function to get name of
 * @return {String} Function's name
 */
goog.debug.getFunctionName = function(fn) {
  var matches = /function (\w+)/.exec(String(fn));
  
  if (matches) {
    return matches[1];
    
  } else {
    for (var i in window) {
      // If java is not installed, accessing the prototype of Packages will
      // crash FF. So for simpler code ignore these packages in all browsers
      // except IE.
      // See https://bugzilla.mozilla.org/show_bug.cgi?id=312946 for details.
      if (document.all || 
          (i != 'Packages' && i != 'sun' && i != 'netscape' && i != 'java')) {
        if (window[i] && window[i].prototype) {
          for (var j in window[i].prototype) {
            if (window[i].prototype[j] == fn) {
              return i + "." + j;
            }
          }
        }
      }
    }
    return '[Anonymous]';
  }
};
