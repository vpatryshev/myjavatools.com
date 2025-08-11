/**
 * @fileoverview A test for bookmarklet script loading.
 *
 *  @author vpatryshev@google.com
 */

var GKBD = {
  _kbdSignature: "DALI"
};
//alert("loading bmloadtest...");
alert(this);
/**
 * Onload listener.
 */
GKBD.onload = function() {
  alert("This is GKBD.onload()");
};

if (!window._kbdSignature ||
    window._kbdSignature != GKBD._kbdSignature) {
  if (window.addEventListener) {
    window.addEventListener('load', GKBD.onload, false);
  } else if (window.attachEvent) {
    window.attachEvent('onload', GKBD.onload);
  } else {
    // in the unlikely event of a very dumb browser
    /**
     * @type Function Window onload listener.
     */
    window.onload = GKBD.onload;
    alert("This is the dumbest browser I've seen so far");
  }
  window._kbdSignature = GKBD._kbdSignature = new Date();
}
