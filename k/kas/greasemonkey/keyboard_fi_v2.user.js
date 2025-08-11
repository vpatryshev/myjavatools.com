// ==UserScript==
// @name          Google Onscreen Keyboard
// @description   This script enables an onscreen keyboard in your Firefox.
//                By default, the keyboard is enabled for all pages. You can limit the pages where it shows up
//                if you go to Tools->Greasemonkey->Manage UserScripts; then you can replace "*" in Included Pages
//                field with something like *.mywebsite.*
//
//                For more information on greasemonkey please check out this site: http://greasemonkey.org
//
// @include       *
// ==/UserScript==
// Feel free to change any of the above settings.
// @author vpatryshev@google.com
//
function _loadKbd(url) {
  var head = document.getElementsByTagName('head').item(0);
  var scriptTag = document.getElementById('file');

  if (scriptTag) {
    head.removeChild(scriptTag);
  }
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = script.src = url;
  head.appendChild(script);
}
_loadKbd('http://mw1.google.com/staticfiles/keyboard/bin/d_fi_002.js')
