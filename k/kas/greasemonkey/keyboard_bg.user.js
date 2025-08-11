// ==UserScript==
// @name          Google Onscreen Keyboard
// @description   This script installs an onscreen keyboard in your Firefox.
//                By default, the keyboard shows up on all pages. You can change it
//                if you go to Tools->Greasemonkey->Manage UserScripts; then replace "*" in Included Pages
//                field with something like *.mywebsite.*
//
//                For more information on greasemonkey check out http://greasemonkey.org
//
// @include       *
// ==/UserScript==
// @author vpatryshev@google.com
//
(function(url) {
  var d = document;
  var head = d.getElementsByTagName('head').item(0);
  var tag = d.getElementById('file');

  if (tag) {
    head.removeChild(tag);
  }
  var s = d.createElement('script');
  s.type = 'text/javascript';
  s.src = url;
  head.appendChild(s);
})('http://mw1.google.com/staticfiles/keyboard/bin/d_bg_002.js')
