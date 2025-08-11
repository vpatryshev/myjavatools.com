// Copyright 2006 Google Inc.
// All Rights Reserved
/**
 * @fileoverview This file contains an implementation of onscreen keyboard -
 * namely, its Russian script loader.
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */

/**
 * This class is used to load Russian binary keyboard script.

 * It will be loaded together with the Russian Google page, so that even in
 * its obfuscated form it will be exposed, and must be as short as possible.
 */

/**
 * Store the old onload listener
 */
var GKBD.layeroldOnload = window.onload;

var GKBD.layerSCRIPT_TO_LOAD = "bin/kbdr.js";

window.onload = function() {
  // restore the old onload listener
  window.onload = GKBD.layeroldOnload;

  var head = document.getElementsByTagName('head').item(0);
  var scriptTag = document.getElementById('file');

  if (scriptTag) {
    head.removeChild(scriptTag);
  }
  var script = document.createElement('script');
  script.type = 'text/javascript';
//  script.charset = 'utf-8';
  script.id = script.src = GKBD.layerSCRIPT_TO_LOAD;
  head.appendChild(script);
}
