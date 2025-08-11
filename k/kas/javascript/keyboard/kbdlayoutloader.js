// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 *  This file contains an onscreen keyboard layout loader class.
 *
 *  @author vpatryshev@google.com
 */
/**
 * Loads keyboard layout data.
 */
GKBD.Layout.prototype.load_ = function() {
  var location = GKBD['LOCATION_'] || '';
  var LAYOUT_LOCATION = location + 'layout/';
  var self = this;
  var uri = LAYOUT_LOCATION + self.group + '/' + self.id + '.js';
  if (self.error_ || self.loading_) {
    return false;
  }
  self.loading_ = true;
  var head = KBD_document.getElementsByTagName('head').item(0);
  var scriptTag = KBD_document.getElementById('file');

  if(scriptTag) {
    head.removeChild(scriptTag);
  }
  var script = KBD_document.createElement('script');
  script.type = 'text/javascript';
  script.id = uri;
  script.src = uri;
  head.appendChild(script);
  return false;
};
