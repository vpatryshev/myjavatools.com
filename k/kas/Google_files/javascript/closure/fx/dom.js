// Copyright 2005 Google Inc.
// All Rights Reserved

/**
 * @fileoverview Predefined DHTML animations such as slide, resize and fade.
 * 
 * @Author pupius@google.com (Dan Pupius)
 */

/**
 * Create Namespaces
 */
goog.provide('goog.fx.dom');
goog.provide('goog.fx.dom.PredefinedEffect');
goog.provide('goog.fx.dom.Slide');
goog.provide('goog.fx.dom.SlideFrom');
goog.provide('goog.fx.dom.Scroll');
goog.provide('goog.fx.dom.Resize');
goog.provide('goog.fx.dom.Fade');
goog.provide('goog.fx.dom.FadeOut');
goog.provide('goog.fx.dom.FadeOutAndHide');
goog.provide('goog.fx.dom.FadeIn');
goog.provide('goog.fx.dom.FadeInAndShow');
goog.provide('goog.fx.dom.BgColorTransform');
goog.provide('goog.fx.dom.ColorTransform');

/**
 * Dependencies
 */
goog.require('goog.fx');
goog.require('goog.events');


/**
 * Abstract class that provides reusable functionality for predefined animations
 * that manipulate a single DOM element
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Array} start Array for start coordinates
 * @param {Array} end Array for end coordinates
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.Animation
 * @constructor
 */
goog.fx.dom.PredefinedEffect = function(element, start, end, time, opt_acc) {
  goog.fx.Animation.call(this, start, end, time, opt_acc);
  
  /**
   * DOM Node that will be used in the animation
   * @type Element
   */
  this.element = element;
};
goog.fx.dom.PredefinedEffect.inherits(goog.fx.Animation);


/**
 * Creates an animation object that will slide an element from A to B.  (This
 * in effect automatically sets up the onanimate event for an Animation object)
 * <br><br>
 * Start and End should be 2 dimensional arrays
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Array} start 2D array for start coordinates (X, Y)
 * @param {Array} end 2D array for end coordinates (X, Y)
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.PredefinedEffect
 * @constructor
 */ 
goog.fx.dom.Slide = function(element, start, end, time, opt_acc) {
  goog.fx.dom.PredefinedEffect.apply(this, arguments);
  if (start.length != 2 || end.length != 2) {
    throw '[goog.fxdhtml.Slide] Start and end points must be 2D';
    return;
  }
  
  var events = [goog.fx.BEGIN, goog.fx.ANIMATE, goog.fx.END];
  goog.events.listen(this, events, this.moveIt, false, this);
};
goog.fx.dom.Slide.inherits(goog.fx.dom.PredefinedEffect);


/**
 * Animation event handler that will move an element to a particular position
 * @param {Object} e Animation event object
 */
goog.fx.dom.Slide.prototype.moveIt = function(e) {
  this.element.style.left = Math.round(e.x) + 'px'
  this.element.style.top = Math.round(e.y) + 'px';
};


/**
 * Slides an element from it's current position
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Array} end 2D array for end coordinates (X, Y)
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.Slide
 * @constructor
 */ 
goog.fx.dom.SlideFrom = function(element, end, time, opt_acc) {
  var start = [element.offsetLeft, element.offsetTop];
  goog.events.listen(this, goog.fx.BEGIN, this.setStartCoords, false, this);
  
  goog.fx.dom.Slide.call(this, element, start, end, time, opt_acc);
};
goog.fx.dom.SlideFrom.inherits(goog.fx.dom.Slide);

/**
 * Animation event handler that will set the start coordinate of the animation
 * to the elements current position
 * @param {Object} e Animation event object
 */
goog.fx.dom.SlideFrom.prototype.setStartCoords = function(e) {
  this.startPoint_ = [this.element.offsetLeft, this.element.offsetTop];
};


/**
 * Creates an animation object that will scroll an element from A to B.<br><br>
 * 
 * Start and End should be 2 dimensional arrays
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Array} start 2D array for start scroll left and top
 * @param {Array} end 2D array for end scroll left and top
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.PredefinedEffect
 * @constructor
 */ 
goog.fx.dom.Scroll = function(element, start, end, time, opt_acc) {
  goog.fx.dom.PredefinedEffect.apply(this, arguments);
  if (start.length != 2 || end.length != 2) {
    throw '[goog.fx.dom.Scroll] Start and end points must be 2D';
    return;
  }
  
  var events = [goog.fx.BEGIN, goog.fx.ANIMATE, goog.fx.END];
  goog.events.listen(this, events, this.scrollIt, fase, this);
};
goog.fx.dom.Scroll.inherits(goog.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will set the scroll posiiton of an element
 * @param {Object} e Animation event object
 */
goog.fx.dom.Scroll.prototype.scrollIt = function(e) {
  this.element.scrollLeft = Math.round(e.x);
  this.element.scrollTop = Math.round(e.y);
};


/**
 * Creates an animation object that will resize an element between two widths 
 * and heights <br><br>
 *
 * Start and End should be 2 dimensional arrays
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Array} start 2D array for start width and height
 * @param {Array} end 2D array for end width and height
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.PredefinedEffect
 * @constructor
 */ 
goog.fx.dom.Resize = function(element, start, end, time, opt_acc) {
  goog.fx.dom.PredefinedEffect.apply(this, arguments);
  if (start.length != 2 || end.length != 2) {
    throw '[goog.fx.dom.Resize] Start and end points must be 2D';
    return;
  }
  
  var events = [goog.fx.BEGIN, goog.fx.ANIMATE, goog.fx.END];
  goog.events.listen(this, events, this.sizeIt, false, this);
};
goog.fx.dom.Resize.inherits(goog.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will resize an element by setting it's width and
 * height
 * @param {Object} e Animation event object
 */
goog.fx.dom.Resize.prototype.sizeIt = function(e) {
  this.element.style.width = Math.round(e.x) + 'px'
  this.element.style.height = Math.round(e.y) + 'px';
};


/**
 * Creates an animation object that fades the opacity of an element between two
 * limits.<br><br>
 *
 * Start and End should be floats between 0 and 1
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Array|Number} start 1D Array or Number with start opacity
 * @param {Array|Number} end 1D Array or Number for end opacity
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.PredefinedEffect
 * @constructor
 */
goog.fx.dom.Fade = function(element, start, end, time, opt_acc) {
  if (goog.isNumber(start)) start = [start];
  if (goog.isNumber(end)) end = [end];
  
  goog.fx.dom.PredefinedEffect.call(this, element, start, end, time, opt_acc);
  
  if (start.length != 1 || end.length != 1) {
    throw '[goog.fx.dom.Fade] Start and end points must be 1D';
    return;
  }
  
  var events = [goog.fx.BEGIN, goog.fx.ANIMATE, goog.fx.END];
  goog.events.listen(this, events, this.fadeIt, false, this);
};
goog.fx.dom.Fade.inherits(goog.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will set the opacity of an element
 * @param {Object} e Animation event object
 */
goog.fx.dom.Fade.prototype.fadeIt = function(e) {
  this.element.style.filter = 'Alpha(Opacity=' + (e.x * 100) + ')';
  this.element.style.opacity = e.x;
  this.element.style.MozOpacity = e.x;
  this.element.style.KhtmlOpacity = e.x;
};

/**
 * Animation event handler that will show the element
 * @param {Object} e Animation event object
 */
goog.fx.dom.Fade.prototype.show = function(e) {
  this.element.style.display = '';
};

/**
 * Animation event handler that will hide the element
 * @param {Object} e Animation event object
 */
goog.fx.dom.Fade.prototype.hide = function(e) {
  this.element.style.display = 'none';
};


/**
 * Fades an element out from full opacity to completely transparent
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.Fade
 * @constructor
 */
goog.fx.dom.FadeOut = function(element, time, opt_acc) {
  goog.fx.dom.Fade.call(this, element, 1, 0, time, opt_acc);
};
goog.fx.dom.FadeOut.inherits(goog.fx.dom.Fade);


/**
 * Fades an element in from completely transparent to fully opacity
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.Fade
 * @constructor
 */
goog.fx.dom.FadeIn = function(element, time, opt_acc) {
  goog.fx.dom.Fade.call(this, element, 0, 1, time, opt_acc);
};
goog.fx.dom.FadeIn.inherits(goog.fx.dom.Fade);


/**
 * Fades an element out from full opacity to completely transparent and then
 * sets the display to 'none'
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.Fade
 * @constructor
 */
goog.fx.dom.FadeOutAndHide = function(element, time, opt_acc) {
  goog.fx.dom.Fade.call(this, element, 1, 0, time, opt_acc);
  
  goog.events.listen(this, [goog.fx.BEGIN, goog.fx.END], this.show, false, this);
};
goog.fx.dom.FadeOutAndHide.inherits(goog.fx.dom.Fade);


/**
 * Sets an element's display to be visible and then fades an element in from
 * completely transparent to fully opacity
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.Fade
 * @constructor
 */
goog.fx.dom.FadeInAndShow = function(element, time, opt_acc) {
  goog.fx.dom.Fade.call(this, element, 0, 1, time, opt_acc);
  goog.events.listen(this, goog.fx.BEGIN, this.show, false, this);
};
goog.fx.dom.FadeInAndShow.inherits(goog.fx.dom.Fade);


/**
 * Provides a transformation of an elements background-color.<br><br>
 *
 * Start and End should be 3D arrays representing R,G,B
 *
 * @param {Element} element Dom Node to be used in the animation
 * @param {Array} start 3D Array for RGB of start color
 * @param {Array} end 3D Array for RGB of end color
 * @param {Nunber} time Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @extends goog.fx.dom.PredefinedEffect
 * @constructor
 */
goog.fx.dom.BgColorTransform = function(element, start, end, dur, opt_acc) {
  goog.fx.dom.PredefinedEffect.apply(this, arguments);
  
  if (start.length != 3 || end.length != 3) {
    throw '[goog.fx.dom.BgColorTransform] Start and end points must be 3D';
    return;
  }
  
  var events = [goog.fx.BEGIN, goog.fx.ANIMATE, goog.fx.END];
  goog.events.listen(this, events, this.setColor, false, this);
};
goog.fx.dom.BgColorTransform.inherits(goog.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will set the background-color of an element
 * @param {Object{ e Animation event object
 */
goog.fx.dom.BgColorTransform.prototype.setColor = function(e) {
  var color = 'rgb(' + e.coordsAsInts().join(',') + ')';
  this.element.style.backgroundColor = color;
};


/**
 * Provides a transformation of an elements color.
 *
 * Start and End should be 3D arrays representing R,G,B
 */
goog.fx.dom.ColorTransform = function(element, start, end, time, opt_acc) {
  goog.fx.dom.PredefinedEffect.apply(this, arguments);

  if (start.length != 3 || end.length != 3) {
    throw '[goog.fx.dom.ColorTransform] Start and end points must be 3D';
    return;
  }

  var events = [goog.fx.BEGIN, goog.fx.ANIMATE, goog.fx.END];
  goog.events.listen(this, events, this.setColor, false, this);
};
goog.fx.dom.ColorTransform.inherits(goog.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will set the color of an element
 * @param {Object{ e Animation event object
 */
goog.fx.dom.ColorTransform.prototype.setColor = function(e) {
  var color = 'rgb(' + e.coordsAsInts().join(',') + ')';
  this.element.style.color = 'rgb(' + color + ')';
};

