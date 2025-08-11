// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Low level handling of XMLHttpRequest
 * @author arv@google.com (Erik Arvidsson)
 */


goog.provide('goog.net.XmlHttp');


/**
 * Factory class for creating XMLHttpRequest objects.
 */
goog.net.XmlHttp = function () {
  if (goog.net.XmlHttp.ieProgId_) {
    return new ActiveXObject(goog.net.XmlHttp.ieProgId_);
  } else {
    return new XMLHttpRequest();
  }
};


/**
 * Status constants for XMLHTTP, matches:
 * http://msdn.microsoft.com/library/default.asp?url=/library/
 *   en-us/xmlsdk/html/0e6a34e4-f90c-489d-acff-cb44242fafc6.asp
 * @type Object
 */
goog.net.XmlHttp.ReadyState = {};


/**
 * Constant for when xmlhttprequest.readyState is uninitialized
 * @type Number
 */
goog.net.XmlHttp.ReadyState.UNINITIALIZED = 0;


/**
 * Constant for when xmlhttprequest.readyState is loading
 * @type Number
 */
goog.net.XmlHttp.ReadyState.LOADING = 1;


/**
 * Constant for when xmlhttprequest.readyState is loaded
 * @type Number
 */
goog.net.XmlHttp.ReadyState.LOADED = 2;


/**
 * Constant for when xmlhttprequest.readyState is in an interactive state
 * @type Number
 */
goog.net.XmlHttp.ReadyState.INTERACTIVE = 3;


/**
 * PConstant for when xmlhttprequest.readyState is completed
 * @type Number
 */
goog.net.XmlHttp.ReadyState.COMPLETE = 4;


//initialize the private state used by other functions.
(function () {
  // Nobody (on the web) is really sure which of the progid's listed is totally
  // necessary. It is known, for instance, that certain installations of IE will
  // not work with only Microsoft.XMLHTTP, as well as with MSXML2.XMLHTTP.
  // Safest course seems to be to do this -- include all known progids for
  // XmlHttp.
  if (typeof XMLHttpRequest == 'undefined' &&
      typeof ActiveXObject != 'undefined') {

    // Candidate Active X types.
    var ACTIVE_X_IDENTS = [
        'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0',
        'MSXML2.XMLHTTP', 'MICROSOFT.XMLHTTP.1.0', 'MICROSOFT.XMLHTTP.1',
        'MICROSOFT.XMLHTTP'];
    for (var i = 0; i < ACTIVE_X_IDENTS.length; i++) {
      var candidate = ACTIVE_X_IDENTS[i];

      try {
        new ActiveXObject(candidate);
        goog.net.XmlHttp.ieProgId_ = candidate;
        break;
      } catch (e) {
        // do nothing; try next choice
      }
    }

    // couldn't find any matches
    if (!goog.net.XmlHttp.ieProgId_) {
      throw ('Could not create ActiveXObject. ActiveX might be disabled, or ' +
             'msxml might not be installed');
    }
  }
})();
