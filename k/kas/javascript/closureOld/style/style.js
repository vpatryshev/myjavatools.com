// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Utilities for elements styles
 *
 * @author pupius@google.com (Daniel Pupius)
 * @author arv@google.com (Erik Arvidsson)
 */

goog.provide('goog.style');


goog.require('goog.dom');
goog.require('goog.math');
goog.require('goog.userAgent');


/**
 * Sets a style value on multiple elements
 * @param {Element} element The element to change
 * @param {String} style Style name
 * @param {String} value Style value
 */
goog.style.setStyle = function(element, style, value) {
  // Normalize a style of the form 'background-color' to 'backgroundColor'
  element.style[goog.style.toCamelCase(style)] = value;
};


/**
 * Retrieves a style value of a node.
 * @param {Element} element Element to get style of
 * @param {String} style Property to get
 * @return {String} Style value
 */
goog.style.getStyle = function(element, style) {
  return element.style[goog.style.toCamelCase(style)];
};


/**
 * Cross-browser pseudo get computed style. It returns the computed style where
 * available. If not available it tries the cascaded style value (IE
 * currentStyle) and in worst case the inline style value.  It shouldn't be
 * called directly. {@link goog.style.getStyle}
 * @param {Element} element Element to get style of
 * @param {String} style Property to get
 * @return {String} Style value
 * @private
 */
goog.style.getStyle_ = function(element, style) {
  var doc = goog.dom.getOwnerDocument(element);
  var camelCase = goog.style.toCamelCase(style);
  if (doc.defaultView && doc.defaultView.getComputedStyle) { // W3C: computed
    return document.defaultView.getComputedStyle(element, "")[camelCase];
  } else if (element.currentStyle) { // IE: cascaded style
    return element.currentStyle[camelCase];
  } else {
    return element.style[camelCase]; // W3C: inline style
  }
};


/**
 * Sets the top/left values of an element.  If no unit is specified in the
 * argument then it will add px.
 * @param {Element} el Element to move
 * @param {String|Number|goog.math.Coordinate} arg1 Left position or coordinate
 * @param {String|Number} opt_arg2 Top position
 */
goog.style.setPosition = function(el, arg1, opt_arg2) {
  var x, y;
  if (arg1 instanceof goog.math.Coordinate) {
    x = arg1.x;
    y = arg1.y;
  } else {
    x = arg1;
    y = opt_arg2;
  }

  el.style.left = typeof x == 'number' ? Math.round(x) + 'px' : x;
  el.style.top = typeof y == 'number' ? Math.round(y) + 'px' : y;
};


/**
 * Gets the offsetLeft and offsetTop properties of an element and returns them
 * in a Coordinate object
 * @param {Element} element Element
 * @return {goog.math.Coordinate)
 */
goog.style.getPosition = function(element) {
  return new goog.math.Coordinate(element.offsetLeft, element.offsetTop);
};


/**
 * Returns the viewport element for a particular document
 * @param {Node} opt_node DOM node (Document is OK) to get the viewport element of
 * @return {Element} document.documentElement or document.body
 */
goog.style.getClientViewportElement = function(opt_node) {
  var doc;
  if (opt_node) {
    if (opt_node.nodeType == goog.dom.NodeType.DOCUMENT) {
      doc = opt_node;
    } else {
      doc = goog.dom.getOwnerDocument(opt_node);
    }
  } else {
    doc = goog.dom.getDocument();
  }

  // In old IE versions the document.body represented the viewport
  if (goog.userAgent.IE && doc.compatMode != 'CSS1Compat') {
    return doc.body;
  }
  return doc.documentElement;
};


/**
 * Returns a Coordinate object relative to the top-left of the HTML document.
 * Implemented as a single function to save having to do two recursive loops in
 * opera and safari just to get both coordinates.  If you just want one value do
 * use goog.style.getPageOffsetX() and goog.style.getPageOffsetY(), but
 * note if you call both those methods the tree will be analysed twice.
 *
 * TODO(arv): Remove dependency on Yahoo code.
 *
 * Note: this is based on Yahoo's getXY method.
 * @see http://developer.yahoo.net/yui/license.txt
 *
 * @param {Element} el Elements
 * @return {goog.math.Coordinate}
 */
goog.style.getPageOffset = function(el) {
  var doc = goog.dom.getOwnerDocument(el);

  // NOTE(arv) If element is hidden (display none or disconnected or any the
  // ancestors are hidden) we get (0,0) by default but we still do the
  // accumulation of scroll position.

  // TODO(arv): Should we check if the node is disconnected in in that case
  //            return (0,0)?

  var pos = new goog.math.Coordinate(0, 0);
  var viewportElement = goog.style.getClientViewportElement(doc);
  if (el == viewportElement) {
    // viewport is always at 0,0 as that defined the coordinate system for this
    // function - this avoids special case checks in the code below
    return pos;
  }

  var parent = null;
  var box;

  if (el.getBoundingClientRect) { // IE
    box = el.getBoundingClientRect();
    var scrollTop = viewportElement.scrollTop;
    var scrollLeft = viewportElement.scrollLeft;

    return new goog.math.Coordinate(box.left + scrollLeft, box.top + scrollTop);

  } else if (doc.getBoxObjectFor) { // gecko
    // Gecko ignores the scroll values for ancestors, up to 1.9.  See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
    // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

    box = doc.getBoxObjectFor(el);
    pos.x = box.x;
    pos.y = box.y;

  } else { // safari/opera
    pos.x = el.offsetLeft;
    pos.y = el.offsetTop;
    parent = el.offsetParent;
    if (parent != el) {
      while (parent) {
        pos.x += parent.offsetLeft;
        pos.y += parent.offsetTop;
        parent = parent.offsetParent;
      }
    }

    // opera & (safari absolute) incorrectly account for body offsetTop
    if (goog.userAgent.OPERA || (goog.userAgent.SAFARI &&
        goog.style.getStyle_(el, 'position') == 'absolute')) {
      pos.y -= doc.body.offsetTop;
    }
  }

  // accumulate the scroll positions for everything but the viewport element
  parent = el.parentNode;
  while (parent && parent != viewportElement) {
    pos.x -= parent.scrollLeft;
    pos.y -= parent.scrollTop;
    parent = parent.parentNode;
  }
  return pos;
};


/**
 * Returns the left coordinate of an element relative to the HTML document
 * @param {Element} el Elements
 * @return {Number}
 */
goog.style.getPageOffsetLeft = function(el) {
  return goog.style.getPageOffset(el).x;
};


/**
 * Returns the top coordinate of an element relative to the HTML document
 * @param {Element} el Elements
 * @return {Number}
 */
goog.style.getPageOffsetTop = function(el) {
  return goog.style.getPageOffset(el).y;
};


/**
 * Returns the position of an element relative to another element in the
 * document.  A relative to B
 * @param {Element} a Element who's position we're calculating
 * @param {Element} b Element position is relative to
 * @return {goog.math.Coordinate}
 */
goog.style.getRelativePosition = function(a, b) {
  var ap = goog.style.getPageOffset(a);
  var bp = goog.style.getPageOffset(b);
  return new goog.math.Coordinate(ap.x - bp.x, ap.y - bp.y);
};


/**
 * Sets the top and left of an element such that it will have a
 *
 * @param {Number|goog.math.Coordinate} x Left position or coordinate obj
 * @param {Number} opt_y Top position
 */
goog.style.setPageOffset = function(el, x, opt_y) {
  // Get current pageoffset
  var cur = goog.style.getPageOffset(el);

  if (x instanceof goog.math.Coordinate) {
    opt_y = x.y;
    x = x.x;
  }

  // NOTE(arv): We cannot allow strings for x and y. We could but that would
  // require us to manually transform between different units

  // Work out deltas
  var dx = x - cur.x;
  var dy = opt_y - cur.y;

  // Set position to current left/top + delta
  goog.style.setPosition(el, el.offsetLeft + dx, el.offsetTop + dy);
};


/**
 * Sets the width/height values of an element.  If no unit is specified in the
 * argument then it will add px. (This just sets the CSS width and height
 * properties so it might set content-box or border-box size depending on the
 * box model the browser is using.)
 *
 * @param {Element} element Element to move
 * @param {String|Number|goog.math.Size} w Width or a size object
 * @param {String|Number} opt_h Height
 */
goog.style.setSize = function(element, w, opt_h) {
  var h;
  if (w instanceof goog.math.Size) {
    h = w.height;
    w = w.width;
  } else {
    h = opt_h;
  }

  element.style.width = typeof w == 'number' ? Math.round(w) + 'px' : w;
  element.style.height = typeof h == 'number' ? Math.round(h) + 'px' : h;
};


/**
 * Gets the height and width of an element, even if it's display is none
 * @param {Element} element Element to get width of
 * @return {goog.math.Size} Object with width/height properties
 */
goog.style.getSize = function(element) {
  if (goog.style.getStyle_(element, 'display') != 'none') {
    return new goog.math.Size(element.offsetWidth, element.offsetHeight);
  }

  var style = element.style;
  var originalVisibility = style.visibility;
  var originalPosition = style.position;

  style.visibility = 'hidden';
  style.position = 'absolute';
  style.display = '';

  var originalWidth = element.offsetWidth;
  var originalHeight = element.offsetHeight;

  style.display = 'none';
  style.position = originalPosition;
  style.visibility = originalVisibility;

  return new goog.math.Size(originalWidth, originalHeight);
};


/**
 * Converts a CSS selector in the form style-property to styleProperty
 * @param {String} selector CSS Selector
 * @return {String} Camel case selector
 */
goog.style.toCamelCase = function(selector) {
  return String(selector).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};


/**
 * Converts a CSS selector in the form styleProperty to style-property
 * @param {String} selector Camel case selector
 * @return {String} Selector cased
 */
goog.style.toSelectorCase = function(selector) {
  return selector.replace(/([A-Z])/g, '-$1' ).toLowerCase() ;
};


/**
 * Sets the opacity of a node (x-browser)
 * @param {Element} el Elements
 * @param {Number} alpha Opacity between 0 and 1
 */
goog.style.setOpacity = function(el, alpha) {
  var style = el.style;
  if ('opacity' in style) {
    style.opacity = alpha;
  } else if ('MozOpacity' in style) {
    style.MozOpacity = alpha;
  } else if ('KhtmlOpacity' in style) {
    style.KhtmlOpacity = alpha
  } else if ('filter' in style) {
    // TODO(arv): Overwriting the filter might have undesired side effects.
    style.filter = 'alpha(opacity=' + (alpha * 100) + ')';
  }
};
