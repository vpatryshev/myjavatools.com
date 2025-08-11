// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Logging and debugging utilities
 * 
 * @author pupius@google.com (Daniel Pupius) [Based on Caribou's debug code]
 */

goog.provide('goog.debug');
goog.require('goog.array');
goog.require('goog.string');


/**
 * Catch onerror events fired by windows and similar objcets.
 * @param {goog.debug.Logger} opt_logger Which logger should catch the errors
 * @param {Boolean} opt_cancel Whether to stop the error from reaching the
 * @param {Object} opt_target Object that fires onerror events
 * browser
 */
goog.debug.catchErrors = function(opt_logger, opt_cancel, opt_target) {
  var logger = opt_logger || goog.debug.LogManager.getRoot();
  var target = opt_target || goog.global;
  var oldErrorHandler = target.onerror;
  target.onerror = function(message, url, line) {
    if (oldErrorHandler) {
      oldErrorHandler(message, url, line);
    }
    var file = String(url).split(/[\/\\]/).pop();
    logger.severe('Error: ' + message + ' (' + file + ' @ Line: ' + line + ')');
    return Boolean(opt_cancel);
  };  
};


/**
 * Creates a string representing an object and all it's properties
 * @param {Object} obj Object to expose
 * @return {String}
 */
goog.debug.expose = function(obj) {
  if (obj == null) return 'NULL';
  var str = [];
  for (var x in obj) {
    var s = x + ' = ';
    try {
      s += obj[x];
    } catch (e) {
      s += '*** ' + e + ' ***';
    }
    str.push(s);
  }
  return str.join('\n');
};


/**
 * Recursively outputs a nested array as a string
 * @param {Array} arr The array
 * @return {String} String representing nested array
 */
goog.debug.exposeArray = function(arr) {
  var str = [];
  for (var i = 0; i < arr.length; i++) {
    if (goog.isArray(arr[i])) {
      str.push(goog.debug.exposeArray(arr[i]));
    } else {
      str.push(arr[i]);
    }
  }
  return '[ ' + str.join(', ') + ' ]';
};


/**
 * Expose an exception that has been caught by a try...catch and outputs the
 * error with a stack trace
 * @param {Object} err Error object or string
 * @param {Function} opt_fn Optional function to start stack trace from.
 * @return {String} Details of exception
 */
goog.debug.exposeException = function(err, opt_fn) {  
  var e = goog.debug.normalizeErrorObject(err);
     
  // Create the error message
  var error = 'Message: ' + goog.string.htmlEscape(e.message) + 
      '\nUrl: <a href="view-source:' + e.filename + '" target="_new">' +
      e.fileName + '</a>\nLine: ' + e.lineNumber + '\n\nBrowser stack:\n' + 
      goog.string.htmlEscape(e.stack, '-> ') + 
      '[end]\n\nJS stack traversal:\n' + goog.string.htmlEscape(
          goog.debug.getStacktrace(opt_fn || arguments.callee), '-> ');
    
  return error;
};


/**
 * Normalizes the error/exception object between browsers
 * @param {Error|String} err Raw error object
 * @return {Error} Normalized error object
 */
goog.debug.normalizeErrorObject = function(err) {
  return (typeof err == 'string') ?
      {
        message: err,
        name: 'Unknown error',
        lineNumber: 'Not available',
        fileName: goog.global.document.location.href,
        stack: 'Not available'
      } :
        
    // IE Error object
    (!err.lineNumber || !err.fileName || !err.stack) ?
      {
        message: err.message,
        name: err.name,
        lineNumber: 'Not available',
        fileName: goog.global.document.location.href,
        stack: 'Not available'
      } :
        
    // Standards error object
      err;
};


/**
 * Max length of stack to try and output
 * @type Number
 */
goog.debug.MAX_STACK_DEPTH = 50;


/**
 * Recursive function to get the stack trace, given a current function
 * on the call stack
 * @param {Function} fn the current function on the call stack
 * @return {String} Stack trace
 */
goog.debug.getStacktrace = function(fn, opt_visited) {
  var out = '';

  var visited = opt_visited || [];
  
  // Circular reference, certain functions like bind seem to cause a recursive
  // loop so we need to catch circular references
  if (goog.array.contains(visited, fn)) {
    out += '[...circular reference...]';
    
  // Traverse the call stack until function not found or max depth is reached
  } else if (fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
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
    visited.push(fn);
    out += ')\n' + goog.debug.getStacktrace(fn.caller, visited);
  
  } else if (fn) {
    out += '[...long stack...]';
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
  if (!goog.debug.fnNameCache_[fn]) {
    var matches = /function ([^\(]+)/.exec(String(fn));
    if (matches) {
      var method = matches[1];
      // unobfuscate unique names generated by JSCompiler - they are surrounded
      // by dollar signs and have dollar signs substituted for dots.
      var hasDollarSigns = /^\$(.+)\$$/.exec(method);
      if (hasDollarSigns) {
        method = hasDollarSigns[1].replace(/\${1,2}/g, '.');
      }
      goog.debug.fnNameCache_[fn] = method;
    } else {
      goog.debug.fnNameCache_[fn] = '[Anonymous]';
    }
  }
  
  return goog.debug.fnNameCache_[fn];
};


/**
 * Tries to get an anonymous functions name by searching the entire object tree,
 * this currently is only known to work in FF and is slow.
 * @param {Function} fn Function to get name of
 * @param {Object} opt_obj Object to look in (recursive)
 * @param {String} opt_prefix Object path calculated so far
 * @param {Number} opt_depth Recursion depth (max = 6)
 * @return {String} Function's name
 * @private
 */
goog.debug.getAnonFunctionName_ = function(fn, opt_obj, opt_prefix, opt_depth) {
  // This doesn't work in IE, so do a loose check and return
  if (document.all) {
    return '';
  }
  
  var obj = opt_obj || goog.global;
  var prefix = opt_prefix || '';
  var depth = opt_depth || 0;
  
  if (obj == fn) {
    return prefix;
  }

  for (var i in obj) {

    // If java is not installed, accessing the prototype of Packages will crash 
    // FF. See https://bugzilla.mozilla.org/show_bug.cgi?id=312946 for details.    
    if (i == 'Packages' || i == 'sun' || i == 'netscape' || i == 'java') {
      continue;
    }
    
    if (obj[i] == fn) {
      return prefix + i;
    }
    
    if ((typeof obj[i] == 'function' || typeof obj[i] == 'object') &&
        obj[i] != goog.global &&
        obj[i] != goog.global.document &&
        obj.hasOwnProperty(i) &&
        depth < 6) {
      var rv = goog.debug.getAnonFunctionName_(fn, obj[i], 
                                               prefix + i + '.', depth + 1);
      if (rv) return rv;
    }
  }
  
  return '';
};


/**
 * Hash map for storing function names that have already been looked up.
 * @type Object
 * @private
 */
goog.debug.fnNameCache_ = {};
