// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Browser detection
 * @author pupius@google.com (Daniel Pupius)
 * @author arv@google.com (Erik Arvidsson)
 */

/**
 * Namespace for user agent
 */
goog.provide('goog.userAgent');

(function() {
  var ua = navigator.userAgent;

  // Browser
  var isOpera = typeof opera != 'undefined';
  var isIe = !isOpera && ua.indexOf('MSIE') != -1;
  var isGecko = !isOpera && navigator.product == 'Gecko';
  var isKonqueror = !isOpera && ua.indexOf('Konqueror') != -1;
  var isSafari = !isOpera && ua.indexOf('Safari') != -1;
  var isKhtml = isKonqueror || isSafari;

  // Version
  // All browser have different ways to detect the version and they all have
  // different naming schemes
  // version is a string because it may contain 'b', 'a' and so on
  var version, re;
  if (isOpera) {
    version = opera.version();
  } else {
    if (isGecko) {
      re = /rv\:([^\);]+)(\)|;)/;
    } else if (isIe) {
      re = /MSIE\s+([^\);]+)(\)|;)/;
    } else if (isSafari) {
      // AppleWebKit/125.4
      re = /AppleWebKit\/(\S+)/;
    } else if (isKonqueror) {
      // Konqueror/3.1;
      re = /Konqueror\/([^\);]+)(\)|;)/;
    }
    if (re) {
      re.test(ua);
      version = RegExp.$1;
    }
  }


  /**
   * Whether the user agent is Opera
   * @public
   * @type {Boolean}
   */
  goog.userAgent.OPERA = isOpera;


  /**
   * Whether the user agent is Internet Explorer. This includes other browsers
   * using Trident as its rendering engine. For example AOL and Netscape 8
   * @public
   * @type {Boolean}
   */
  goog.userAgent.IE = isIe;


  /**
   * Whether the user agent is Gecko. Gecko is the rendering engine used by
   * Mozilla, Mozilla Firefox, Camino and many more.
   * @public
   * @type {Boolean}
   */
  goog.userAgent.GECKO = isGecko;


  /**
   * Whether the user agent is Konqueror. If this is true then KHTML is also
   * true. KHTML is the rendering engine that Konqueror and Safari uses.
   * @public
   * @type {Boolean}
   */
  goog.userAgent.KONQUEROR = isKonqueror;


  /**
   * Whether the user agent is Safari. If this is true then KHTML is also
   * true. KHTML is the rendering engine that Konqueror and Safari uses.
   * @public
   * @type {Boolean}
   */
  goog.userAgent.SAFARI = isSafari;


  /**
   * Whether the user agent is using KHTML as its rendering engine
   * @public
   * @type {Boolean}
   */
  goog.userAgent.KHTML = isKhtml;


  /**
   * The version of the user agent. This is a string because it might contain
   * 'b' (as in beta) as well as multiple dots.
   * @public
   * @type {String}
   */
  goog.userAgent.VERSION = version;


  /**
   * the platform (operating system) the user agent is running on.
   * @public
   * @type {String}
   */
  goog.userAgent.PLATFORM = navigator.platform;

})();


/**
 * Compares two version numbers
 *
 * @param {String} aV1 Version of first item
 * @param {String} aV2 Version of second item
 *
 * @returns {Number}  1 if first argument is higher
 *                    0 if arguments are equal
 *                   -1 if second argument is higher
 */

goog.userAgent.compare = function(aV1, aV2) {

  // simple, but common case that the version is a valid number
  if (!isNaN(aV1) && !isNaN(aV2)) {
    return aV1 - aV2;
  }

  var v1 = aV1.split('.');
  var v2 = aV2.split('.');
  var numSubversions = Math.min(v1.length, v2.length);

  for (var i = 0; i < numSubversions; i++) {
    if (typeof v2[i] == 'undefined') {
      return 1;
    }

    if (typeof v1[i] == 'undefined') {
      return -1;
    }

    // if numeric version is the same but the second one has a non numeric
    // param we are larger, "1" is larger than "1b"
    if (!isNaN(v1[i]) && isNaN(v2[i]) && v1[i] == parseInt(v2[i], 10)) {
      return 1;
    }
    // and the opposite case "1b" is smaller than "1"
    if (isNaN(v1[i]) && !isNaN(v2[i]) && parseInt(v1[i], 10) == v2[i]) {
      return -1;
    }

    if (v2[i] > v1[i]) {
      return -1;
    } else if (v2[i] < v1[i]) {
      return 1;
    }
  }

  // v2 was never higher or lower than v1
  return 0;
};


/**
 * Whether the user agent version is higher or the same as the given version.
 * @param {String} version The version to check
 * @return {Boolean}
 */
goog.userAgent.isVersion = function(version) {
  return goog.userAgent.compare(goog.userAgent.VERSION, version) >= 0;
};
