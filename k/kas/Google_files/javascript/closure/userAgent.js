// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Browser detection
 * @author pupius@google.com (Daniel Pupius)
 * - Taken from java/com/google/caribou/ui/fin/jsdata/base/browser.js
 */

/**
 * Namespace for user agent
 */
goog.provide('goog.userAgent');

// TODO: This needs cleaning up.
(function() {
  
  var agt = navigator.userAgent.toLowerCase();

  // verify using document.all that user agent isn't being spoofed
  // (Opera is the only other browser that implements document.all)
  var is_opera = (agt.indexOf('opera') != -1);
  var is_ie = (agt.indexOf('msie') != -1) && document.all && !is_opera;
  var is_ie5 = is_ie && (agt.indexOf('msie 5') != -1);
  var is_ie6 = is_ie && (agt.indexOf('msie 6') != -1);
  var is_ie7 = is_ie && (agt.indexOf('msie 7') != -1);
  var is_konqueror = (agt.indexOf('konqueror') != -1);
  var is_safari = (agt.indexOf('safari') != -1) || is_konqueror;
  
  var is_safari_420plus = false;
  if (is_safari) {
    var match = / applewebkit\/(\d+)/i.exec(agt);
    if (match) {
      is_safari_420plus = match[1] >= 420;
    }
  }

  var is_camino = (agt.indexOf('camino') != -1);
  var is_nav = !is_ie && !is_safari &&
               ((agt.indexOf('mozilla') != -1) || is_opera);
  var is_moz_17plus = false;
  var is_moz_18plus = false;
  if (is_nav && !is_opera) {
    // Mozilla useragents end like this: 'rv:1.8b4)'. 
    var moz_match = /rv:(\d\.\d)[^\)]*\)/i.exec(agt);
    if (moz_match) {
      is_moz_17plus = moz_match[1] >= 1.7;
      is_moz_18plus = moz_match[1] >= 1.8;
    }
  }
  
  var is_ns7 = (agt.indexOf('netscape/7') != -1);
  var is_ns8 = (agt.indexOf('netscape/8') != -1);
  var is_ns8ie = is_ns8 && (agt.indexOf('msie') != -1);
  var is_ns8ff = is_ns8 && (agt.indexOf('gecko') != -1);
  
  var is_mac = (agt.indexOf('macintosh') != -1) ||
               (agt.indexOf('mac_powerpc') != -1);
  var is_linux = (agt.indexOf('linux') != -1);
  var is_winxp = (agt.indexOf('windows nt 5.1') != -1) ||
                 (agt.indexOf('windows xp') != -1);
  var is_win2k = (agt.indexOf('windows nt 5.0') != -1) ||
                 (agt.indexOf('windows 2000') != -1);
  var is_winnt5 = is_winxp || is_win2k || (agt.indexOf('windows nt 5') != -1);
  
  
  goog.userAgent.isOpera = is_opera;
  goog.userAgent.isIE = is_ie;
  goog.userAgent.isIE5 = is_ie5;
  goog.userAgent.isIE6 = is_ie6;
  goog.userAgent.isIE7 = is_ie7;
  goog.userAgent.isKonqueror = is_konqueror;
  goog.userAgent.isSafari = is_safari;
  goog.userAgent.isSafari420Plus = is_safari_420plus;
  goog.userAgent.isCamino = is_camino;
  goog.userAgent.isNav = is_nav;
  goog.userAgent.isMoz17plus = is_moz_17plus;
  goog.userAgent.isMoz18plus = is_moz_18plus;
  goog.userAgent.isNS7 = is_ns7;
  goog.userAgent.isNS8 = is_ns8;
  goog.userAgent.isNS8IE = is_ns8ie;
  goog.userAgent.isNS8FF = is_ns8ff;

  goog.userAgent.isMac = is_mac;
  goog.userAgent.isLinux = is_linux;
  goog.userAgent.isWinXP = is_winxp;
  goog.userAgent.isWin2k = is_win2k;
  goog.userAgent.isWinNT5 = is_winnt5;
  
})();
