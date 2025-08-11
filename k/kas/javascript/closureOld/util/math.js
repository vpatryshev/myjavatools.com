// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Additional mathematical functions
 * @author pupius@google.com (Daniel Pupius)
 */


goog.provide('goog.math');


/**
 * Class for representing sizes, width and heights
 * @param {Number} opt_w Width
 * @param {Number} opt_h Height
 * @constructor
 */
goog.math.Size = function(opt_w, opt_h) {
  /**
   * Width
   * @type Number
   */
  this.width = goog.isDef(opt_w) ? Number(opt_w) : undefined;

  /**
   * Height
   * @type Number
   */
  this.height = goog.isDef(opt_h) ? Number(opt_h) : undefined;

};

/**
 * Returns a nice string representing size
 * @return {String} In the form (50 x 73)
 */
goog.math.Size.prototype.toString = function() {
  return '(' + this.width + ' x ' + this.height + ')';
};


/**
 * Class for representing coordinates and positions
 * @param {Number} opt_x Left
 * @param {Number} opt_y Top
 * @constructor
 */
goog.math.Coordinate = function(opt_x, opt_y) {
  /**
   * X-value
   * @type Number
   */
  this.x = goog.isDef(opt_x) ? Number(opt_x) : undefined;

  /**
   * Y-value
   * @type Number
   */
  this.y = goog.isDef(opt_y) ? Number(opt_y) : undefined;

};

/**
 * Returns a nice string representing dimensions
 * @return {String} In the form (50, 73)
 */
goog.math.Coordinate.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')';
};

/**
 * A number range.
 * @param {Number} a  one end of the range
 * @param {Number} b  the other end of the range.
 */
goog.math.Range = function(a, b) {
  a = Number(a);
  b = Number(b);

  /**
   * The lowest value in the range.
   * @type Number
   */
  this.start = a < b ? a : b;

  /**
   * The highest value in the range.
   * @type Number
   */
  this.end = a < b ? b : a;
};

/**
 * Compares ranges for equality.
 * @param {goog.math.Range} a  a range
 * @param {goog.math.Range} b  a range
 * @return {Boolean} true iff the ranges are equal, or if both are null.
 */
goog.math.Range.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  return a.start == b.start && a.end == b.end;
};

/**
 * Given two ranges on the same dimension, this returns the intersection
 * of those ranges.
 * @param {Range} a  a non-null Range
 * @param {Range} b  a non-null Range
 * @return {Range} A new Range representing the intersection
 *     (including points), or null if there is no intersection.
 */
goog.math.Range.intersection = function(a, b) {
  var c0 = Math.max(a.start, b.start);
  var c1 = Math.min(a.end, b.end);
  return (c0 <= c1) ? new goog.math.Range(c0, c1) : null;
};

/**
 * Given two ranges on the same dimension, this returns a range that covers
 * both those ranges.
 * @param {Range} a  a non-null Range
 * @param {Range} b  a non-null Range
 * @return {Range} A new Range representing the bounding range.
 */
goog.math.Range.boundingRange = function(a, b) {
  return new goog.math.Range(Math.min(a.start, b.start),
                             Math.max(a.end, b.end));
};

/**
 * Class for representing rectangular regions
 * @param {Number} opt_x Left
 * @param {Number} opt_y Top
 * @param {Number} opt_w Width
 * @param {Number} opt_h Height
 * @constructor
 */
goog.math.Rect = function(opt_x, opt_y, opt_w, opt_h) {

  /**
   * Left
   * @type Number
   */
  this.left = goog.isDef(opt_x) ? Number(opt_x) : undefined;

  /**
   * Top
   * @type Number
   */
  this.top = goog.isDef(opt_y) ? Number(opt_y) : undefined;

  /**
   * Width
   * @type Number
   */
  this.width = goog.isDef(opt_w) ? Number(opt_w) : undefined;

  /**
   * Height
   * @type Number
   */
  this.height = goog.isDef(opt_h) ? Number(opt_h) : undefined;

};

/**
 * Compares rectangles for equality.
 * @param {goog.math.Rect} a  a rectangle
 * @param {goog.math.Rect} b  a rectangle
 * @return {Boolean} true iff the rectangles are equal, or if both are null.
 */
goog.math.Rect.equals = function(a, b) {
  if (a == b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  return a.left == b.left && a.width == b.width &&
         a.top == b.top && a.height == b.height;
};

/**
 * Returns a nice string representing size and dimensions of rectangle
 * @return {String} In the form (50, 73 - 75w x 25h)
 */
goog.math.Rect.prototype.toString = function() {
  return '(' + this.left + ', ' + this.top + ' - ' + this.width + 'w x ' +
         this.height + 'h)';
};

/**
 * Returns the intersection of two rectangles
 * @param {goog.math.Rect} a  a goog.math.Rect
 * @param {goog.math.Rect} b  a goog.math.Rect
 * @return {goog.math.Rect} a new intersection rect (even if width and height
 *     are 0), or null if there is none, or null if either param is null.
 */
goog.math.Rect.intersection = function(a, b) {
  if (!a || !b) {
    return null;
  }
  var xInt = goog.math.Range.intersection(
      new goog.math.Range(a.left, a.left + a.width),
      new goog.math.Range(b.left, b.left + b.width));
  if (!xInt) {
    return null;
  }
  var yInt = goog.math.Range.intersection(
      new goog.math.Range(a.top, a.top + a.height),
      new goog.math.Range(b.top, b.top + b.height));
  if (!yInt) {
    return null;
  }
  return new goog.math.Rect(xInt.start, yInt.start,
                            xInt.end - xInt.start, yInt.end - yInt.start);
};

/**
 * Class for representing a box. A box is specified as a top, right, bottom,
 * and left. A box is useful for representing margins and padding.
 *
 * @param {Number} opt_top Top
 * @param {Number} opt_right Right
 * @param {Number} opt_bottom Bottom
 * @param {Number} opt_left Left
 * @constructor
 */
goog.math.Box = function(opt_top, opt_right, opt_bottom, opt_left) {
  /**
   * Left
   * @type Number
   */
  this.top = goog.isDef(opt_top) ? Number(opt_top) : undefined;

  /**
   * Top
   * @type Number
   */
  this.right = goog.isDef(opt_right) ? Number(opt_right) : undefined;

  /**
   * Width
   * @type Number
   */
  this.bottom = goog.isDef(opt_bottom) ? Number(opt_bottom) : undefined;

  /**
   * Height
   * @type Number
   */
  this.left = goog.isDef(opt_left) ? Number(opt_left) : undefined;
};

/**
 * Returns a nice string representing the box
 * @return {String} In the form (50t, 73r, 24b, 13l)
 */
goog.math.Box.prototype.toString = function() {
  return '(' + this.top + 't, ' + this.right + 'r, ' + this.bottom + 'b, ' +
         this.left + 'l)';
};

/**
 * Returns the bounding rect containing two rectangles.
 * @param {goog.math.Rect} a  a goog.math.Rect
 * @param {goog.math.Rect} b  a goog.math.Rect
 * @return {goog.math.Rect} a new bounding rect, or null if either rect is null
 */
goog.math.Rect.boundingRect = function(a, b) {
  if (!a || !b) {
    return  null;
  }
  var xBound = goog.math.Range.boundingRange(
      new goog.math.Range(a.left, a.left + a.width),
      new goog.math.Range(b.left, b.left + b.width));
  var yBound = goog.math.Range.boundingRange(
      new goog.math.Range(a.top, a.top + a.height),
      new goog.math.Range(b.top, b.top + b.height));
  return new goog.math.Rect(xBound.start,
                            yBound.start,
                            xBound.end - xBound.start,
                            yBound.end - yBound.start);
};
