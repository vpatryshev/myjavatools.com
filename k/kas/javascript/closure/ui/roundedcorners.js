// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the RoundedCorners class. This depends on the
 * GSE servlet at com.google.javascript.closure.RoundedCornerServlet. The
 * sevlet provides the images for that this class depends on for generating
 * the rounded corners. See com.google.javascript.closure.RoundedCornerServlet
 * for sample usage.
 *
 * @author Jon Perlow (jonp@google.com)
 */

goog.provide('goog.ui.RoundedCorners');
goog.require('goog.math');
goog.require('goog.userAgent');
goog.require('goog.Uri');
goog.require('goog.color');
goog.require('goog.string');

/**
 * Class for constructing the HTML for a rounded corner border based on the
 * RoundedCornerServlet server class.
 *
 * @constructor
 * @param {goog.Uri} serlvetUri The uri to the RoundedCornerServlet for
 * fetching the rounded corner images.
 */
goog.ui.RoundedCorners = function(servletUri) {
  this.servletUri_ = servletUri;

  /**
   * Size of the border corners
   * @type goog.math.Size
   * @private
   */
  this.size_ = new goog.math.Size(8, 8);

  /**
   * Which corners to show.
   * @type goog.ui.RoundedCorners
   * @private
   */
  this.cornersToShow_ = goog.ui.RoundedCorners.Corners.ALL;
};

/**
 * Foreground color of the rounded corners
 * @type String
 * @private
 */
goog.ui.RoundedCorners.prototype.color_ = '#ff0000';

/**
 * Background color of the rounded corners
 * @type String
 * @private
 */
goog.ui.RoundedCorners.prototype.bgColor_ = '';

/**
 * HTML content that goes inside the template
 * @type String
 * @private
 */
goog.ui.RoundedCorners.prototype.content_ = '';

/**
 * Padding style for the internal content
 * @type String
 * @private
 */
goog.ui.RoundedCorners.prototype.padding_ = '';

/**
 * An explicit height for the HTML. If null, no height is specified
 * @type String
 * @private
 */
goog.ui.RoundedCorners.prototype.height_ = null;

/**
 * The format of the image. Either PNG or GIF
 * @type String
 * @private
 */
goog.ui.RoundedCorners.prototype.imageFormat_ = 'png';


/**
 * Enum for specifying which corners to include
 * @type Object
 */
goog.ui.RoundedCorners.Corners = {};

/**
 * Include all corners.
 * @type Number
 */
goog.ui.RoundedCorners.Corners.ALL = 0;

/**
 * Include just the left corners.
 * @type Number
 */
goog.ui.RoundedCorners.Corners.LEFT = 1;

/**
 * Include just the right corners.
 * @type Number
 */
goog.ui.RoundedCorners.Corners.RIGHT = 2;

/**
 * Include just the top corners.
 * @type Number
 */
goog.ui.RoundedCorners.Corners.TOP = 3;

/**
 * Include just the bottom corners.
 * @type Number
 */
goog.ui.RoundedCorners.Corners.BOTTOM = 4;


/**
 * Returns the foreground color
 * @return {String} The color in hex format
 */
goog.ui.RoundedCorners.prototype.getColor = function() {
  return this.color_;
};


/**
 * Sets the foreground color.
 * @param {String} color The color in a format parsable by goog.color.parse().
 */
goog.ui.RoundedCorners.prototype.setColor = function(color) {
  this.color_ = goog.color.parse(color).hex;
};


/**
 * Returns the background color
 * @return {String} The color in hex format or null for transparent.
 */
goog.ui.RoundedCorners.prototype.getBackgroundColor = function() {
  return this.bgColor_;
};


/**
 * Sets the background color.
 * @param {String} color The color in a format parsable by goog.color.parse()
 * or empty string if transparent.
 */
goog.ui.RoundedCorners.prototype.setBackgroundColor = function(bgColor) {
  if (goog.string.isEmpty(bgColor)) {
    this.bgColor_  = '';
  } else {
    this.bgColor_ = goog.color.parse(bgColor).hex;
  }
};


/**
 * Returns the border thickness. The height and width specifies the width and
 * height of the corner images that form the arcs. The height dictates the
 * thickness of the top and bottom borders and width dicates the thickness of
 * the left and right borders.
 *
 * @return {goog.math.Size} The border size
 */
goog.ui.RoundedCorners.prototype.getBorderThickness = function() {
  return this.size_;
};


/**
 * Sets the border thickness. The height and width specifies the width and
 * height of the corner images that form the arcs. The height dictates the
 * thickness of the top and bottom borders and width dicates the thickness of
 * the left and right borders.
 *
 * @param {goog.math.Size} size The border size
 */
goog.ui.RoundedCorners.prototype.setBorderThickness = function(size) {
  this.size_ = size;
};

/**
 * Returns the explicit height of the element creating the border or background.
 * For the #getBorderHtml case, this usually isn't necessary to set as it will
 * size to content. For the #getBackgroundHtml case, this may be necessary to
 * set in certain cases in IE because of an off-by-1 bug in IE's bottom
 * positioning code.
 *
 * @return {String} The height as a style string (e.g. '2px' or '3em')
 */
goog.ui.RoundedCorners.prototype.getExplicitHeight = function() {
  return this.height_;
};


/**
 * Sets the explicit height of the element creating the border or background.
 * For the #getBorderHtml case, this usually isn't necessary to set as it will
 * size to content. For the #getBackgroundHtml case, this may be necessary to
 * set in certain cases in IE because of an off-by-1 bug in IE's bottom
 * positioning code.
 *
 * @param {String} height The height as a style string (e.g. '2px' or '3em')
 */
goog.ui.RoundedCorners.prototype.setExplicitHeight = function(height) {
  this.height_ = height;
};


/**
 * Returns the padding of the rounded corner border.
 *
 * @return {String} The padding as a style string (e.g. '2px 4px')
 *
 */
goog.ui.RoundedCorners.prototype.getPadding = function() {
  return this.padding_;
};


/**
 * Sets the padding of the rounded corner border.
 *
 * @param {String} padding The padding as a style string (e.g. '2px 4px')
 *
 */
goog.ui.RoundedCorners.prototype.setPadding = function(padding) {
  this.padding_ = padding;
};


/**
 * Returns which corners to show
 *
 * @return {goog.ui.RoundedCorners} The corners to show
 *
 */
goog.ui.RoundedCorners.prototype.getCornersToShow = function() {
  return this.cornersToShow_;
};


/**
 * Sets which corners to show
 *
 * @param {goog.ui.RoundedCorners} cornersToShow The corners to show
 *
 */
goog.ui.RoundedCorners.prototype.setCornersToShow = function(cornersToShow) {
  this.cornersToShow_ = cornersToShow;
};


/**
 * Returns the image format. Currently, only png  and gif are supported.
 *
 * @return {String} The image format.
 *
 */
goog.ui.RoundedCorners.prototype.getImageFormat= function() {
  return this.imageFormat_;
};


/**
 * Sets the image format. Currently, only png and gif are supported.
 *
 * @param {String} imageFormat The image format.
 *
 */
goog.ui.RoundedCorners.prototype.setImageFormat = function(imageFormat) {
  if (imageFormat != 'png' && imageFormat != 'gif') {
    throw Error('Image format must be \'png\' or \'gif\'');
  }
  this.imageFormat_ = imageFormat;
};


/**
 * Returns the content of the borders
 *
 * @param {String} The content of the borders.
 */
goog.ui.RoundedCorners.prototype.getContent = function() {
  return this.content_;
};


/**
 * Sets the content of the borders
 *
 * @param {String} The content of the borders.
 */
goog.ui.RoundedCorners.prototype.setContent = function(html) {
  this.content_ = html;
};


/**
 * Returns the HTML of a 9-cell table (when all corners are needed) that uses
 * transparent images in the corners, a solid color on the sides, and the
 * content in the middle cell.
 *
 * @return {String} The html of the table
 */
goog.ui.RoundedCorners.prototype.getBorderHtml = function() {
  // todo (jonp) convert to client-side template mechanism when one exists
  // the html is built like a template so that this can later be
  // converted easily to a templating mechanism like JST.
  var sb = [];
  sb.push('<table border=0 style="empty-cells:show;border-collapse:collapse;' +
          'table-layout:fixed;width:100%;margin:0;padding:0;' +
          'height:{{%heightStyle}}" cellspacing=0 cellpadding=0>');
    if (this.cornersToShow_ != goog.ui.RoundedCorners.Corners.RIGHT) {
      sb.push('<col width="{{%w}}">');
    }
    sb.push('<col>');
    if (this.cornersToShow_ != goog.ui.RoundedCorners.Corners.LEFT) {
      sb.push('<col width="{{%w}}">');
    }
    if (this.cornersToShow_ != goog.ui.RoundedCorners.Corners.BOTTOM) {
      sb.push('<tr>');
        sb.push('<td style="{{%tlStyle}}; width:{{%w}}px; height:{{%h}}px">' +
                '</td>');
        sb.push('<td style="background-color:{{%color}}"></td>');
        sb.push('<td style="{{%trStyle}}; width:{{%w}}px; height:{{%h}}px">' +
                '</td>');
      sb.push('</tr>');
    }
    sb.push('<tr>');
      sb.push('<td style="{{%mlStyle}}; background-color:{{%color}};width:{{%w}}px;"></td>');
      sb.push('<td style="padding: {{%p}}">{{%content}}</td>');
      sb.push('<td style="{{%mrStyle}}; background-color:{{%color}};width:{{%w}}px;"></td>');
    sb.push('</tr>');
    if (this.cornersToShow_ != goog.ui.RoundedCorners.Corners.TOP) {
      sb.push('<tr>');
        sb.push('<td style="{{%blStyle}} width:{{%w}}px; height:{{%h}}px;">' +
                '</td>');
        sb.push('<td style="background-color:{{%color}}"></td>');
        sb.push('<td style="{{%brStyle}};width:{{%w}}px; height:{{%h}}px">' +
                '</td>');
      sb.push('</tr>');
    }
  sb.push('</table>');

  return this.performTemplateSubstitutions_(sb.join(''));
};


/**
 * Returns the HTML for a relatively positioned DIV that includes four
 * absolutely positioned DIVs for the corner images and a DIV for the content.
 *
 * @return {String} The html of the table
 */
goog.ui.RoundedCorners.prototype.getBackgroundHtml = function() {
  // todo (jonp) convert to client-side template mechanism when one exists
  // the html is built like a template so that this can later be converted
  // easily to a templating mechanism like JST.
  var sb = [];
  sb.push('<div style="position:relative;padding:{{%p}};' +
          'background-color:{{%color}};height:{{%heightStyle}}">');
    sb.push('<div style="{{%tlStyle}};width:{{%w}}px; height:{{%h}}px;' +
            'position:absolute;top:0;left:0;font-size:0"></div>');
    sb.push('<div style="{{%blStyle}};width:{{%w}}px; height:{{%h}}px;' +
            'position:absolute;bottom:0px;left:0;font-size:0"></div>');
    sb.push('<div style="{{%brStyle}};width:{{%w}}px; height:{{%h}}px;' +
            'position:absolute;bottom:0px;right:0;font-size:0"></div>');
    sb.push('<div style="{{%trStyle}};width:{{%w}}px; height:{{%h}}px;' +
            'position:absolute;top:0;right:0;font-size:0"></div>');
    sb.push('<div>{{%content}}</div>');
  sb.push('</div>');

  return this.performTemplateSubstitutions_(sb.join(''));
};


/**
 * Performs the substitutions in the templates to values determined at runtime.
 */
goog.ui.RoundedCorners.prototype.performTemplateSubstitutions_ =
    function(htmlTemplate) {
  var html = htmlTemplate;
  var ctx = this.getCtx_();
  for (var key in ctx) {
    var regex = new RegExp('{{%' + key + '}}', 'g');
    html = html.replace(regex, ctx[key]);
  }
  return html;
};


/**
 * Returns the context object used by the template mechanism
 * @return {Object} The context object
 */
goog.ui.RoundedCorners.prototype.getCtx_ = function() {
  var colorHex = this.color_.substring(1);
  var ctx = {};
  ctx['tlStyle'] = this.getCornerStyle_('tl');
  ctx['trStyle'] = this.getCornerStyle_('tr');
  ctx['mlStyle'] = '';
  ctx['mrStyle'] = '';
  ctx['blStyle'] = this.getCornerStyle_('bl');
  ctx['brStyle'] = this.getCornerStyle_('br');
  if (this.cornersToShow_ == goog.ui.RoundedCorners.Corners.RIGHT) {
    ctx['tlStyle'] = ctx['mlStyle'] = ctx['blStyle'] = 'display:none';
  } else if (this.cornersToShow_ == goog.ui.RoundedCorners.Corners.LEFT) {
    ctx['trStyle'] = ctx['mrStyle'] = ctx['brStyle'] = 'display:none';
  }

  if (this.height_ != null) {
    ctx['heightStyle'] = this.height_;
  } else {
    ctx['heightStyle'] = goog.userAgent.IE && goog.userAgent.VERSION < 7 ?
                            '0px;' : 'auto;';
  }

  ctx['color'] = this.color_;
  ctx['w'] = this.size_.width;
  ctx['h'] = this.size_.height;
  ctx['p'] = this.padding_;
  ctx['content'] = this.content_;
  return ctx;
};


/**
 * Returns the background image style string that uses AlphaImageLoader for IE6
 * and background-images for other browsers
 * @param {String} The corner of the image
 * @return {String} The style string
 */
goog.ui.RoundedCorners.prototype.getCornerStyle_ = function(corner) {
  var uri = this.createUri_(corner);
  if (goog.string.isEmpty(this.bgColor_) && goog.userAgent.IE &&
      goog.userAgent.VERSION > 5.5 && goog.userAgent.VERSION < 7) {
    // if need transparency, must do this in < IE7
    return 'filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' +
           uri + '\', sizingMethod=\'crop\')';
  } else {
    return 'background: url(' + uri + ') no-repeat top left;';
  }
};


/**
 * Returns the image Uri for a specific corner image.
 * @param {String} corner The corner of the image
 * @return {goog.Uri} The uri.
 * @private
 */
goog.ui.RoundedCorners.prototype.createUri_ = function(corner) {
  // e.g. rc?a=tl&c=#aaa&w=8&h=8
  var uri = new goog.Uri(this.servletUri_);
  uri.setParameterValue('a', corner);
  uri.setParameterValue('c', this.removeHash_(this.color_));
  uri.setParameterValue('bc', this.removeHash_(this.bgColor_));
  uri.setParameterValue('w', this.size_.width);
  uri.setParameterValue('h', this.size_.height);
  uri.setParameterValue('m', this.imageFormat_);
  return uri;
};


/**
 * Helper function to remove hash from the color string
 * @param {String} s The string to remove the has from
 * @return {String} The color name without the hash.
 */
goog.ui.RoundedCorners.prototype.removeHash_ = function(s) {
  if (goog.string.startsWith(s, "#")) {
    return s.substring(1);
  }
  return s;
};
