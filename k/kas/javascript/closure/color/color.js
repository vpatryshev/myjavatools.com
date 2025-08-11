// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Utilities related to color and color conversion.
 * @author dalewis@google.com (Darren Lewis)
 */

goog.provide('goog.color');

/**
 * Parses a color out of a string.
 * @param {String} str Color in some format
 * @return {Object} Contains two properties: 'hex', which is a string
 *   containing a hex representation of the color, as well as 'type', which
 *   a string containing the type of color format passed in (e.g., 'hex',
 *   'rgb').
 */
goog.color.parse = function(str) {
  var result = new Object();
  str = String(str);

  var maybeHex = goog.color.prependPoundIfNecessary_(str);
  if (goog.color.isValidHexColor_(maybeHex)) {
    result.hex = maybeHex;
    result.type = 'hex';
    return result;
  } else {
    var rgb = goog.color.isValidRgbColor_(str);
    if (rgb[0]) {
      result.hex = goog.color.rgbArrayToHex(rgb[1]);
      result.type = 'rgb';
      return result;
    }
  }
  throw Error(str + ' is not a valid color string');
};


/**
 * Parses red, green, blue components out of a valid rgb color string.
 * @param {String} str RGB representation of a color.
 *   {@see goog.color.isValidRgbColor_}
 * @return {Array} array containing [r, g, b], each an int in [0, 255]
 */
goog.color.parseRgb = function(str) {
  var rgb = goog.color.isValidRgbColor_(str);
  if (!rgb[0]) {
    throw Error(str + ' is not a valid RGB color');
  } else {
    return rgb[1];
  }
};


/**
 * Converts a hex representation of a color to RGB.
 * @param {String} hexColor Color to convert
 * @return {String} string of the form 'rgb(R,G,B)' which can be used in 
 *   styles.
 */
goog.color.hexToRgbStyle = function(hexColor) {
  return goog.color.rgbStyle_(goog.color.hexToRgb(hexColor));
};


/**
 * Converts a hex representation of a color to RGB.
 * @param {String} hexColor Color to convert
 * @return {Array} array containing [r, g, b] as ints in [0, 255]
 */
goog.color.hexToRgb = function(hexColor) {
  if (!goog.color.isValidHexColor_(hexColor)) {
    throw Error("'" + hexColor + "' is not a valid hex color");
  }
  if (hexColor.length == 4) { // of the form #RGB
    var r = parseInt(hexColor[1] + hexColor[1], 16);
    var g = parseInt(hexColor[2] + hexColor[2], 16);
    var b = parseInt(hexColor[3] + hexColor[3], 16);
  } else { // of the form #RRGGBB
    var r = parseInt(hexColor.substr(1, 2), 16);
    var g = parseInt(hexColor.substr(3, 2), 16);
    var b = parseInt(hexColor.substr(5, 2), 16);
  }
  return [r, g, b];
};


/**
 * Converts a color from RGB to hex representation.
 * @param {Number} r Amount of red, int between 0 and 255
 * @param {Number} g Amount of green, int between 0 and 255
 * @param {Number} b Amount of blue, int between 0 and 255
 * @return {String} hex representation of the color
 */
goog.color.rgbToHex = function(r, g, b) {
  r = Number(r);
  g = Number(g);
  b = Number(b);
  if (isNaN(r) || r < 0 || r > 255 ||
      isNaN(g) || g < 0 || g > 255 ||
      isNaN(b) || b < 0 || b > 255) {
    throw Error("'(" + r + "," + g + "," + b + "') is not a valid RGB color");
  }
  var hexR = goog.color.prependZeroIfNecessary_(r.toString(16));
  var hexG = goog.color.prependZeroIfNecessary_(g.toString(16));
  var hexB = goog.color.prependZeroIfNecessary_(b.toString(16));
  return '#' + hexR + hexG + hexB;
};


/**
 * Converts a color from RGB to hex representation.
 * @param {Array} rgb Array of [r, g, b], with each value in [0, 255]
 * @return {String} hex representation of the color
 */
goog.color.rgbArrayToHex = function(rgb) {
  return goog.color.rgbToHex(rgb[0], rgb[1], rgb[2]);
};


/**
 * Converts a color from RGB color space to HSL color space.
 * Modified from {@link http://en.wikipedia.org/wiki/HLS_color_space}.
 * @param {Number} r Value of red, in [0, 255]
 * @param {Number} g Value of green, in [0, 255]
 * @param {Number} b Value of blue, in [0, 255]
 * @return {Array} [h, s, l] values for the color, with h an int in [0, 360] 
 * and s and l in [0, 1]
 */
goog.color.rgbToHsl = function(r, g, b) {
  // First must normalize r,g,b to be between 0 and 1
  var normR = r / 255;
  var normG = g / 255;
  var normB = b / 255;
  var normRGB = [normR, normG, normB];
  var max = Math.max.apply(null, normRGB);
  var min = Math.min.apply(null, normRGB);
  var h = 0;
  var s = 0;
  
  // Luminosity is the average of the max and min rgb color intensities
  var l = 0.5 * (max + min);
  
  // The hue is dependent on which color intensity is the max
  if (max == min) {
    // do nothing, since h is already 0 - this is a gray!
  } else if (max == normR) {
    h = 60 * (normG - normB) / (max - min);
  } else if (max == normG) {
    h = 60 * (normB - normR) / (max - min) + 120;
  } else if (max == normB) {
    h = 60 * (normR - normG) / (max - min) + 240;
  }
  
  // Make sure the hue falls between 0 and 360
  h += h < 0 ? 360 : h > 360 ? -360 : 0;
  
  // Now compute the saturation of the color
  if (max == min) {
    // do nothing, since s is already 0
  } else if (0 < l && l <= 0.5) {
    s = (max - min) / (2 * l);
  } else {
    s = (max - min) / (2 - 2 * l);
  }
  
  return [Math.round(h), s, l];
};


/**
 * Converts a color from RGB color space to HSL color space.
 * @param {Array} rgb [r, g, b] values for the color, each in [0, 255]
 * @return {Array} [h, s, l] values for the color, with h in [0, 360] and 
 * s and l in [0, 1]
 */
goog.color.rgbArrayToHsl = function(rgb) {
  return goog.color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
};


/**
 * Converts a color from HSL color space to RGB color space.
 * Modified from {@link http://www.easyrgb.com/math.html}
 * @param {Number} h Hue, in [0, 360]
 * @param {Number} s Saturation, in [0, 1]
 * @param {Number} l Luminosity, in [0, 1]
 * @return {Array} [r, g, b] values for the color, with each an int in [0, 255]
 */
goog.color.hslToRgb = function(h, s, l) {
  /**
   * Helper for hslToRgb.
   * @private
   */
  function hueToRgb_(v1, v2, vH) {
    if (vH < 0) {
      vH += 1;
    } else if (vH > 1) {
      vH -= 1;
    }
    if ((6 * vH) < 1) {
      return (v1 + (v2 - v1) * 6 * vH);
    } else if (2 * vH < 1) {
      return v2;
    } else if (3 * vH < 2) {
      return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
    }
    return v1;
  }

  var r = 0;
  var g = 0;
  var b = 0;
  var normH = h / 360; // normalize h to fall in [0, 1]

  if (s == 0) {
    r = g = b = l * 255;
  } else {
    var temp1 = 0;
    var temp2 = 0;
    if (l <0.5) {
      temp2 = l * (1 + s);
    } else {
      temp2 = l + s - (s * l);
    }
    temp1 = 2 * l - temp2;
    r = 255 * hueToRgb_(temp1, temp2, normH + (1 / 3));
    g = 255 * hueToRgb_(temp1, temp2, normH);
    b = 255 * hueToRgb_(temp1, temp2, normH - (1 / 3));
  }
  
  return [Math.round(r), Math.round(g), Math.round(b)];
};


/**
 * Converts a color from HSL color space to RGB color space.
 * @param {Array} hsl HSL values for the color, h in [0, 360], s and l in 
 *   [0, 1]
 * @return {Array} [r, g, b] values for the color, with each an int in [0, 255]
 */
goog.color.hslArrayToRgb = function(hsl) {
  return goog.color.hslToRgb(hsl[0], hsl[1], hsl[2]);
};


/**
 * Checks if a string is a valid hex color.  We expect strings of the format
 * #RRGGBB (ex: #1b3d5f) or #RGB (ex: #3CA == #33CCAA).
 * @param {String} str String to check
 * @return {Boolean}
 * @private
 */
goog.color.isValidHexColor_ = function(str) {
  return /^#(?:[0-9a-f]{3}){1,2}$/i.test(str);
};


/**
 * Checks if a string is a valid rgb color.  We expect strings of the format
 * '(r, g, b)', or 'rgb(r, g, b)', where each color component is an int in
 * [0, 255].
 * @param {String} str String to check
 * @return {Array} with first element containing {Boolean} indicating validity
 * of string, and second containing the array [r, g, b] with the components of
 * the color if it's valid
 * @private
 */
goog.color.isValidRgbColor_ = function(str) {
  // Each component is separate (rather than using a repeater) so we can
  // capture the match. Also, we explicitly set each component to be either 0,
  // or start with a non-zero, to prevent octal numbers from slipping through.
  if (/^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i.test(str)) {
    var r = RegExp.$1;
    var g = RegExp.$2;
    var b = RegExp.$3;
    if (r >= 0 && r <= 255 &&
        g >= 0 && g <= 255 &&
        b >= 0 && b <= 255) {
      return [true, [r, g, b]];
    }
  }
  return [false];
};


/**
 * Takes a hex value and prepends a zero if it's a single digit.
 * @param {String} hex Hex value to prepend if single digit
 * @return {String} hex value prepended with zero if it was single digit,
 *   otherwise the same value that was passed in
 * @private
 */
goog.color.prependZeroIfNecessary_ = function(hex) {
  return hex.length == 1 ? '0' + hex : hex;
};


/**
 * Takes a string a prepends a '#' sign if one doesn't exist.
 * @param {String} str String to check
 * @return {String} The value passed in, prepended with a '#' if it didn't
 *   already have one
 */
goog.color.prependPoundIfNecessary_ = function(str) {
  return str.substring(0, 1) == '#' ? str : '#' + str;
}


/**
 * Takes an array of [r, g, b] and converts it into a string appropriate for
 * CSS styles.
 * @param {Array} rgb [r, g, b] with each value in [0, 255]
 * @return {String} string of the form 'rgb(r,g,b)'
 * @private
 */
goog.color.rgbStyle_ = function(rgb) {
  return 'rgb(' + rgb.join(',') + ')';
};