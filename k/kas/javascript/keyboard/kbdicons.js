// Copyright 2006 Google Inc.
// All Rights Reserved.
/**
 * @fileoverview This mixin file contains some of icon-displaying functionality
 * for keyboard.
 * @see kbdlayer.html
 * @author vpatryshev@google.com
 *
 */
(function() {
  var location = GKBD['LOCATION_'] || '';

  /**
   * Location of images relative to html in which it runs.
   */
  GKBD.images = location + 'images/';

  var minimizeImage = GKBD.images + 'min_blue';
  var maximizeImage = GKBD.images + 'max_blue';
  var closeImage = GKBD.images + 'x_blue';

  /**
   * Export the function.
   *
   * @type Function
   */
  var _forId = forId;

  /**
   * Outputs code for a keyboard icon.
   * Sample output:
   * <span onMouseover="_forId('ab').src='blue.png'"
   * onMouseout="_forId('ab').src="red.png">
   * <img border="0" id="ab" alt="minimize"
   * height="10" width="10"/></span>
   *
   * @param {string} name Icon name.
   * @param {string} id Element id.
   * @param {string} alt Alt text.
   * @param (string?)  opt_ext Image file extension.
   * @return A piece of html that contains icon reference.
   * @private
   */
  GKBD.layer.drawIcon_ = function(name, id, alt, opt_ext) {
    var self = this;
    var fullname = name + (opt_ext = opt_ext ? ('.' + opt_ext) : '.gif');
    return ['<span onMouseover="_forId(\'',
           id,
           '\').src = \'',
           name,
           '_highlight',
           opt_ext,
           '\';"onMouseout="_forId(\'',
           id,
           '\').src = \'',
           fullname,
           '\';"><img border="0" id="',
           id,
           '" alt="',
           alt,
           '" src="',
           fullname,
           '" ',
           (self.titleHeight_ ?
              (' height="' + self.titleHeight_ +
               '" width="' + self.titleHeight_ + '"') : ''),
           '/></span>'].join('');
  };

  /**
   * Outputs html for a table cell for a keyboard icon.
   * @param {string} name Icon name.
   * @param {string} id Element id.
   * @param {string} alt Alt text.
   * @return A piece of html containg table cell element.
   * @private
   */
  GKBD.layer.drawIconCell_ = function(name, id, alt) {
    var self = this;
    return ['<td id="icon_',
            id,
            '" style=\"cursor:pointer\" width="',
            self.titleHeight_ +
           '" height="',
            self.titleHeight_,
            '">',
            self.drawIcon_(name, id, alt),
            '</td>'].join('');
  };


  /**
   * Draws minmax icon.
   * @return A piece of html.
   * @private
   */
  GKBD.layer.drawMinMax_ = function() {
    var self = this;
    if (self.visibility == 'm') {
      return '';
    }
    var buf = [];
    if (self.canMinimize_) {
      var minmaxImage = GKBD.images + (self.visibility_ == 'M' ?
                        maximizeImage : minimizeImage);
      buf.push(self.drawIconCell_(minmaxImage, 'kbd_mm', 'minimize'));
    }
    buf.push(self.drawIconCell_(closeImage, 'kbd_h', 'hide'));
    return buf.join('');
  };


  /**
   * Sets image for minmax button.
   * @param {string} visibility Keyboard visibility status.
   */
  GKBD.layer.setMinMaxButton = function(visibility) {
    var minmaxButton = _forId('kbd_mm');
    if (minmaxButton) {
      minmaxButton.src = visibility == 'v' ? (minimizeImage + '.gif') :
          (maximizeImage + '.gif');
    }
  }
})();
