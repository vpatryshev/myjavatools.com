// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Low level handling of XMLHttpRequest
 * @author arv@google.com (Erik Arvidsson)
 */


/**
 * Namespace for IO
 */
goog.provide('goog.io.XmlHttp');

/**
 * Factory class for creating XMLHttpRequest objects.
 */
goog.io.XmlHttp = function () {
  if (goog.io.XmlHttp.ieProgId_) {
    return new ActiveXObject(goog.io.XmlHttp.ieProgId_);
  } else {
    return new XMLHttpRequest();
  }
};


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
        goog.io.XmlHttp.ieProgId_ = candidate;
        break;
      } catch (e) {
        // do nothing; try next choice
      }
    }

    // couldn't find any matches
    if (!goog.io.XmlHttp.ieProgId_) {
      throw ('Could not create ActiveXObject. ActiveX might be disabled, or ' +
             'msxml might not be installed');
    }
  }
})();
