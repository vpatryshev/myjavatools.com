// Copyright 2006 Google Inc.
// All Rights Reserved
/**
 * @fileoverview This file contains an implementation of onscreen keyboard -
 * namely, its Russian script loader.
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */

/**
 * This class is used to load keyboard scripts (listed below).
 * Each script has to call KBD_loader.done() in the end, to report.
 * It will be loaded together with the Russian Google page, so that even in
 * its obfuscated form it will be exposed, and must be as short as possible.
 *
 * Since those classes are compiled separately, we have to use leading
 * underscore - making this identifier global.
 */
var _KBDloader = {l: ['keyboard',
                      'kbdlayerhtml',
                      'kbdlayer',
                      'kbdlayout',
                      'kbd_russian']};
/**
 * This variable will disappear in binary - meaning that it can be used for
 * detecting whether the code works in binary environment.
 */
var KBD_loader = _KBDloader;

/**
 * Scripts call _KBDloader.next() to tell the loader to load the next script
 */
_KBDloader.next = function() {
  if (this.l.length > 0) {
    var head = document.getElementsByTagName('head').item(0);
    var scriptTag = document.getElementById('file');

    if (scriptTag) {
      head.removeChild(scriptTag);
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = script.src = 'Google_files/' + this.l.shift() + '.js';
    head.appendChild(script);
  }
}

/**
 * @type Function Old onload listener.
 */
GKBD.layeroldOnload = window.onload;

/**
 * Start loading!
 */
window.onload = function() {
  window.onload = GKBD.layeroldOnload;
  _KBDloader.next();
}
