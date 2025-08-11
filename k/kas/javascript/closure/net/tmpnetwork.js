// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview tmpnetwork.js contains some temporary networking functions
 * for browserchannel which will be moved at a later date.
 */

/**
 * Namespace for BrowserChannel
 */
goog.provide('goog.net.tmpnetwork');
goog.require('goog.userAgent');

goog.net.HTTP_STATUS_OK_ = 200;
goog.net.HTTP_STATUS_CACHED_ = 304;

goog.net.GOOGLECOM_TIMEOUT = 10000;

/**
 * Ping google to check if an error is a gmail error or user's network error
 */
goog.net.testGoogleCom = function(callback) {
  // We need to add a 'rand' to make sure the response is not fulfilled
  // by browser cache.
  // The 'cleardot.gif' url can't have additional parameters, so we use
  // the url redirector.
  var uri = new goog.Uri("http://www.google.com/url");
  uri = goog.net.makeUniqueUri(uri);
  uri.setParameterValues("q", "http://www.google.com/images/cleardot.gif");
  goog.net.testLoadImage(uri.toString(), goog.net.GOOGLECOM_TIMEOUT, callback);
};

goog.net.testLoadImageWithRetries =
function(url, timeout, callback, retries, opt_pauseBetweenRetriesMS) {
  goog.net.ChannelDebug.debug("TestLoadImageWithRetries: " + 
                              opt_pauseBetweenRetriesMS);
  if (retries == 0) {
    // no more retries, give up
    callback(false);
    return;
  }
  if (!opt_pauseBetweenRetriesMS) {
    opt_pauseBetweenRetriesMS = 0;
  }
  
  retries--;
  goog.net.testLoadImage(url, timeout, function(succeeded) {
    if (succeeded) {
      callback(true);
    } else {
      // try again
      goog.global.setTimeout(function() {
        goog.net.testLoadImageWithRetries(url, timeout, callback, retries,
            opt_pauseBetweenRetriesMS); 
        }, opt_pauseBetweenRetriesMS);
    }
  });  
};
 
goog.net.testLoadImage = function(url, timeout, callback) {
  goog.net.ChannelDebug.debug("TestLoadImage: loading " + url);
  var img = new Image();
  img.onload = function() {
    try {
      goog.net.ChannelDebug.debug("TestLoadImage: loaded");
      goog.net.clearImageCallbacks_(img);
      callback(true);
    } catch (e) {
      goog.net.ChannelDebug.dumpException(e);
    }
  };
  img.onerror = function() {
    try {
      goog.net.ChannelDebug.debug("TestLoadImage: error");
      goog.net.clearImageCallbacks_(img);
      callback(false);
    } catch (e) {
      goog.net.ChannelDebug.dumpException(e);
    }
  };
  img.onabort = function() {
    try {
      goog.net.ChannelDebug.debug("TestLoadImage: abort");
      goog.net.clearImageCallbacks_(img);
      callback(false);
    } catch (e) {
      goog.net.ChannelDebug.dumpException(e);
    }
  };
  img.ontimeout = function() {
    try {
      goog.net.ChannelDebug.debug("TestLoadImage: timeout");
      goog.net.clearImageCallbacks_(img);
      callback(false);
    } catch (e) {
      goog.net.ChannelDebug.dumpException(e);
    }
  };
  
  goog.global.setTimeout(function() {
    if (img.ontimeout) {
      img.ontimeout();
    }
  }, timeout);
  img.src = url;  
};

goog.net.clearImageCallbacks_ = function(img) {
  // clear handlers to avoid memory leaks
  img.onload = img.onerror = img.onabort = img.ontimeout = null;
};


/**
 * Adds a random parameter to a querystring.  If the page is determined to be
 * static, then it won't add the parameter unless opt_force is specified.
 *
 * NOTE(pupius): Check performance considerations in using the goog.Uri class.
 * It definitely makes things neater, but may be overly intensive if called in
 * tight loops.
 *
 * @param {goog.Uri} url uri (uri passed is not modified)
 * @return {goog.Uri} URL
 */
goog.net.makeUniqueUri = function(uri) {
  var uriNew = new goog.Uri(uri);
  uriNew.setParameterValues("zx", goog.net.getRandomString());
  return uriNew;
};

/**
 * Returns a string with at least 64-bits of randomness, e.g. kap3ip-fcj5hg
 *
 * Don't trust Javascript's random function entirely--use a combination of
 * random and current timestamp. Then encode the string in base-36 to
 * make it shorter.
 * @return {String}
 */
goog.net.getRandomString = function() {
  return goog.net.getRandomInteger().toString(36) +
         (goog.net.getRandomInteger() ^ goog.now()).toString(36);
};

/**
 * Returns a random integer in the range [0, 21478483648] using the builtin
 * Math.random() function.
 * @return {Number}
 */
goog.net.getRandomInteger = function() {
  return Math.round(Math.random() * 2147483648);
};
