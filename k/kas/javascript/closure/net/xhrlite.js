// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Lightweight wrapper class for handling XmlHttpRequests
 * @author pupius@google.com (Daniel Pupius)
 */


goog.provide('goog.net.XhrLite');

goog.require('goog.net.XmlHttp');
goog.require('goog.json');
goog.require('goog.userAgent');
goog.require('goog.structs');
goog.require('goog.structs.Map');


/**
 * Basic class for handling XmlHttpRequests.
 *
 * One off requests can be sent through goog.net.XhrLite.send() or an instance
 * can be created to send multiple requests.  Each request uses it's own
 * XmlHttpRequest object and handles clearing of the event callback to ensure no
 * leaks.
 *
 * XhrLite is not event based but instead uses simple callbacks for when a
 * request has finished, when it is errorred or has succeeded, or when the
 * ready-state changes.  The Ready-state callback goes first, followed by a
 * generic completed callback, and lastly the error or success callback is
 * called if appropriate.
 *
 * The error callback may also be called before completed and ready-state-change
 * if the XmlHttpRequest.open() or .send() methods throw.
 *
 * This class does not support multiple requests, queuing, or prioritization.
 *
 * Tested = IE6, FF1.5, Safari, Opera 8.5
 * Demo depot =   //depot/google3/experimental/users/pupius/closurexhrdemo/...
 * Demo example = http://www/~pupius/closure/demo2/prod.html
 *
 * TODO(pupius): Error cases aren't playing nicely in Safari.
 * TODO(pupius): Test abort() cases
 *
 * @param {Function} opt_callback Optional function to be called when a request
 * has completed
 *
 * @constructor
 */
goog.net.XhrLite = function(opt_callback) {

  /**
   * Map of default headers to add to every request, use:
   * xhrlite.headers.set(name, value)
   * @type goog.structs.Map
   */
  this.headers = new goog.structs.Map();

  /**
   * Whether XmlHttpRequest is active
   * @type Boolean
   * @private
   */
  this.active_ = false;

  /**
   * Reference to an XmlHttpRequest object that is being used for the transfer
   * @type XmlHttpRequest
   * @private
   */
  this.xhr_ = null;

  /**
   * Last URL that was requested
   * @type String
   */
  this.lastUri_ = '';

  /**
   * Callback for when a request ends, whether it fails or not. This is the
   * default callback.
   * @private
   */
  this.completedCallback_ = opt_callback || goog.nullFunction;

  /**
   * Callback for when a request ends and is successful
   * @private
   */
  this.successCallback_ = goog.nullFunction;

  /**
   * Callback for when a request errors
   * default callback.
   * @param {Error} err Error object
   * @private
   */
  this.errorCallback_ = goog.nullFunction;

  /**
   * Callback for when the XHR object changes its readystate
   * default callback.
   * @type Function
   * @private
   */
  this.readyStateChangeCallback_ = goog.nullFunction;
};


/**
 * Static send that creates a short lived instance of XhrLite to send the
 * request.
 * @param {String} url Uri to make request too
 * @param {Function} callback Callback function for when request is completed
 * @param {String} opt_method Send method, default: GET
 * @param {String} opt_content Post data
 * @param {Object|goog.structs.Map} opt_headers Map of headers to add to the
 * request
 */
goog.net.XhrLite.send = function(url, callback, opt_method, opt_content,
                                opt_headers) {
  var x = new goog.net.XhrLite(callback);
  x.send(url, opt_method, opt_content, opt_headers);
};


/**
 * Instance send that actually uses XmlHttpRequest to make a server call.
 * @param {String} url Uri to make request too
 * @param {String} opt_method Send method, default: GET
 * @param {String} opt_content Post data
 * @param {Object|goog.structs.Map} opt_headers Map of headers to add to the
 * request
 */
goog.net.XhrLite.prototype.send = function(url, opt_method, opt_content,
                                          opt_headers) {
  if (this.active_) {
    throw Error('[goog.net.XhrLite] Object is active with another request');
  }

  this.lastUri_ = url;
  this.active_ = true;

  // Use the factory to create the XHR object
  this.xhr_ = new goog.net.XmlHttp();

  // Set up the onreadystatechange callback
  this.xhr_.onreadystatechange = this.onReadyStateChange_.bind(this);

  // Try to open the XmlHttpRequest (always async), if an error occurs here it
  // is generally permission denied
  try {
    this.xhr_.open(opt_method || 'GET', url, true);
  } catch (err) {
    this.error_(err);
    return;
  }

  // Add default headers
  goog.structs.forEach(this.headers, function(value, key) {
    this.xhr_.setRequestHeader(key, value);
  }, this);

  // Add headers specific to this request
  if (opt_headers) {
    goog.structs.forEach(opt_headers, function(value, key) {
      this.xhr_.setRequestHeader(key, value);
    }, this);
  }

  // Try to send the request, or other wise report an error (404 not found)
  try {
    this.xhr_.send(opt_content || null);

  } catch (err) {
    this.error_(err);
  }
};


/**
 * Something errorred, so inactivate, fire error callback and clean up
 * @param {Exception} err Error
 * @private
 */
goog.net.XhrLite.prototype.error_ = function(err) {
  this.active_ = false;
  this.errorCallback_(err);
  this.cleanUpXhr_()
};


/**
 * Abort the current XmlHttpRequest
 */
goog.net.XhrLite.prototype.abort = function() {
  if (this.xhr_) {
    this.xhr_.abort();
    this.active_ = false;
  }
};


/**
 * Nullify all callbacks to reduce risks of leaks.
 */
goog.net.XhrLite.prototype.dispose = function() {
  this.setCompletedCallback(null);
  this.setSuccessCallback(null);
  this.setErrorCallback(null);
  this.setReadyStateChangeCallback(null);
};


/**
 * Internal handler for the XHR object's readystatechange event.  This method
 * checks the status and the readystate and fires the correct callbacks.
 * If the request has ended, the handlers are cleaned up and the XHR object is
 * nullified.
 * @private
 */
goog.net.XhrLite.prototype.onReadyStateChange_ = function() {

  if (goog.userAgent.IE && this.getReadyState() ==
      goog.net.XmlHttp.ReadyState.COMPLETE && this.getStatus() == 2) {
    // NOTE(pupius): In IE if send() errors on a local request the readystate is
    // still changed to COMPLETE.  We need to ignore it and allow the
    // try...catch around send() to pick up the error.

  } else {
    this.readyStateChangeCallback_();

    // readyState indicates the transfer has finished
    if (this.isComplete()) {
      this.active_ = false;

      // Call generic completed callback (this is the default callback that can
      // be set in the constructor)
      this.completedCallback_();

      // Call the specific callbacks for success or failure. Only call the
      // success if the status is 200 (HTTP_OK) or 304 (HTTP_CACHED)
      if (this.isSuccess()) {
        this.successCallback_();
      } else {
        this.errorCallback_(Error(this.getStatusText() + ' [' +
                                  this.getStatus() + ']'));
      }

      this.cleanUpXhr_();
    }
  }
};


/**
 * Remove the listener to protect against leaks, and nullify the XmlHttpRequest
 * object.
 * @private
 */
goog.net.XhrLite.prototype.cleanUpXhr_ = function() {
  if (this.xhr_) {
    // NOTE(pupius): Not nullifying in FireFox can still leak if the callbacks
    // are defined in the same scope as the instance of XhrLite. But, IE doesn't
    // allow you to set the onreadystatechange to NULL so nullFunction is used.
    this.xhr_.onreadystatechange =
        goog.userAgent.IE ? goog.nullFunction : null;
    this.xhr_ = null;
  }
};


/**
 * Set the function to be called when the request completes.  Error or success
 * @param {Function} callback
 */
goog.net.XhrLite.prototype.setCompletedCallback = function(callback) {
  this.completedCallback_ = callback;
};


/**
 * Get the function to be called when the request completes.
 * @return {Function} callback
 */
goog.net.XhrLite.prototype.getCompletedCallback = function() {
  return this.completedCallback_;
};


/**
 * Set the function to be called when the request succeeds
 * @param {Function} callback
 */
goog.net.XhrLite.prototype.setSuccessCallback = function(callback) {
  this.successCallback_ = callback;
};


/**
 * Get the function to be called when the request succeeds
 * @return {Function} callback
 */
goog.net.XhrLite.prototype.getSuccessCallback = function() {
  return this.successCallback_;
};


/**
 * Set the function to be called when the request errors
 * @param {Function} callback
 */
goog.net.XhrLite.prototype.setErrorCallback = function(callback) {
  this.errorCallback_ = callback;
};


/**
 * Get the function to be called when the request errors
 * @return {Function} callback
 */
goog.net.XhrLite.prototype.getErrorCallback = function() {
  return this.errorCallback_;
};


/**
 * Set the function to be called when the readystate changes
 * @param {Function} callback
 */
goog.net.XhrLite.prototype.setReadyStateChangeCallback = function(callback) {
  this.readyStateChangeCallback_ = callback;
};


/**
 * Set the function to be called when the readystate changes
 * @return {Function} callback
 */
goog.net.XhrLite.prototype.getReadyStateChangeCallback = function() {
  return this.readyStateChangeCallback_;
};


/**
 * Is there an active request
 * @return {Boolean}
 */
goog.net.XhrLite.prototype.isActive = function() {
  return this.active_;
};


/**
 * Has the request compeleted
 * @return {Boolean}
 */
goog.net.XhrLite.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
};


/**
 * Has the request compeleted with a success
 * @return {Boolean}
 */
goog.net.XhrLite.prototype.isSuccess = function() {
  switch (this.getStatus()) {
    case 0:         // Used for local XHR requests
    case 200:       // Http Success
    case 304:       // Http Cache
      return true;

    default:
      return false;
  }
};


/**
 * Get the readystate from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @return {Number} goog.net.XmlHttp.ReadyState.*
 */
goog.net.XhrLite.prototype.getReadyState = function() {
  return this.xhr_ ? this.xhr_.readyState :
      goog.net.XmlHttp.ReadyState.UNINITIALIZED;
};


/**
 * Get the status from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @return {Number} Http status
 */
goog.net.XhrLite.prototype.getStatus = function() {
  // NOTE(pupius): IE doesn't like you checking status until the readystate is
  // greater than 2 (i.e. it is recieving or complete).
  return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ?
      this.xhr_.status : -1;
};


/**
 * Get the status text from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @return {String} Status text
 */
goog.net.XhrLite.prototype.getStatusText = function() {
  // NOTE(pupius): IE doesn't like you checking status until the readystate is
  // greater than 2 (i.e. it is recieving or complete).
  return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ?
      this.xhr_.statusText  : '';
};


/**
 * Get the last Uri that was requested
 * @return {String} Last Uri
 */
goog.net.XhrLite.prototype.getLastUri = function() {
  return this.lastUri_;
};


/**
 * Get the response text from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @return {String} Result from the server
 */
goog.net.XhrLite.prototype.getResponseText = function() {
  return this.xhr_ ? this.xhr_.responseText : '';
};


/**
 * Get the response XML from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @return {Document} The DOM Document representing the XML file
 */
goog.net.XhrLite.prototype.getResponseXml = function() {
  return this.xhr_ ? this.xhr_.responseXML : null;
};


/**
 * Get the response and evaluates it as JSON from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @return {Object} JavaScript object
 */
goog.net.XhrLite.prototype.getResponseJson = function() {
  return this.xhr_ ? goog.json.parse(this.xhr_.responseText) : undefined;
};
