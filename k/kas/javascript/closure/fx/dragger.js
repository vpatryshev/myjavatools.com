// Copyright (C)2006 Google, Inc.
// Author: pupius@google.com (Daniel Pupius)

/**
 * @fileoverview Drag Utilities
 *
 * Provides extensible functionality for drag & drop behaviour
 * 
 * @author pupius@google.com (Daniel Pupius)
 */


goog.provide('goog.fx.Dragger');
goog.provide('goog.fx.DragEvent');

goog.require('goog.math');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');


/**
 * A class that allows mouse based dragging (moving) of an element
 * 
 * @param {Element} target The element that will be dragged
 * @param {Element} opt_handle An optional handle to control the drag, if null
 *                             the target is used
 * @param {goog.math.Rect} opt_limits Object containing left, top, width, height
 * 
 * @extends goog.events.EventTarget
 * @constructor
 */
goog.fx.Dragger = function(target, opt_handle, opt_limits) {

  /**
   * Reference to drag target element
   * @type Element
   */
  this.target = target;

  /**
   * Reference to the handler that inititates the drag
   * @type Boolean
   */
  this.handle = opt_handle || target;
  
  /**
   * Whether dragging is currently enabled
   * @type Boolean
   * @private
   */
  this.enabled_ = true;

  /**
   * Whether object is currently being dragged
   * @type Boolean
   * @private
   */
  this.dragging_ = false;
  
  /**
   * Object representing the limits of the drag region
   * @type goog.math.Rect
   */
  this.limits = opt_limits || new goog.math.Rect();

  /**
   * Reference to a document object to use for the events
   * @type HTMLDocument
   * @private
   */ 
  this.document_ = this.target.ownerDocument || this.target.document;

  /**
   * Current x position of mouse relative to screen
   * @type Number
   */
  this.screenX = 0;
  
  /**
   * Current y position of mouse relative to screen
   * @type Number
   */
  this.screenY = 0;

  /**
   * Current x position of drag relative to target's parent
   * @type Number
   */
  this.deltaX = 0;

  /**
   * Current y position of drag relative to target's parent
   * @type Number
   */
  this.deltaY = 0;


  // Add listeners
  goog.events.listen(this.handle, goog.events.types.MOUSEDOWN,
                     this.startDrag, true, this);

  goog.events.listen(this.document_, goog.events.types.MOUSEMOVE,
                     this.mouseMoved_, false, this);

  goog.events.listen(this.document_, goog.events.types.MOUSEUP,
                     this.endDrag, false, this);

};
goog.fx.Dragger.inherits(goog.events.EventTarget);


/**
 * Constants for event names
 * @type Object
 */
goog.fx.Dragger.prototype.events = {
  START: 'start',
  BEFOREDRAG: 'beforedrag',
  DRAG: 'drag',
  END: 'end'
};


/**
 * Returns true if Dragger is enabled
 * @return {Boolean}
 */
goog.fx.Dragger.prototype.getEnabled = function() {
  return this.enabled_;
};


/**
 * Set whether dragger is enabled
 * @param {Boolean} enabled Whether dragger is enabled
 */
goog.fx.Dragger.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
};


/**
 * Tear down the drag object, removing listeners, and nullify references
 */
goog.fx.Dragger.prototype.dispose = function() {
  if (this.getDisposed()) return;
  goog.events.EventTarget.prototype.dispose.call(this);

  goog.events.unlisten(this.handle, goog.events.types.MOUSEDOWN,
                       this.startDrag, true, this);

  goog.events.unlisten(this.document_, goog.events.types.MOUSEMOVE,
                       this.mouseMoved_, false, this);

  goog.events.unlisten(this.document_, goog.events.types.MOUSEUP,
                       this.endDrag, false, this);
  
  delete this.target;
  delete this.handle;
};


/**
 * Event handler that is used to start the drag
 * @param {goog.events.Event} e Event object
 */
goog.fx.Dragger.prototype.startDrag = function(e) {
  if (this.enabled_ && !this.dragging_) {
    
    // TODO(pupius): Get preventDefault working properly on custom objects that
    // inherit from Event and EventTarget
    /*var rv =*/ this.dispatchEvent(new goog.fx.DragEvent(this.events.START,
                                                          this));
    
    if (1) {        // if (rv !== false) {
    
      this.screenX = e.screenX;
      this.screenY = e.screenY;
  
      this.deltaX = this.target.offsetLeft;
      this.deltaY = this.target.offsetTop;
  
      this.dragging_ = true;
  
      e.preventDefault();
    }
  }
};


/**
 * Event handler that is used to end the drag
 * @param {goog.events.Event} e Event object
 */
goog.fx.Dragger.prototype.endDrag = function(e) {
  if (this.dragging_) {
    this.dragging_ = false;

    var x = this.limitX(this.deltaX);    
    var y = this.limitY(this.deltaY);

    this.dispatchEvent(new goog.fx.DragEvent(this.events.END, this, x, y));
  }
};


/**
 * Event handler that is used on mouse move to update the drag
 * @param {goog.events.Event} e Event object
 * @private
 */
goog.fx.Dragger.prototype.mouseMoved_ = function(e) {
  if (this.dragging_ && this.enabled_) {
    
    var dx = e.screenX - this.screenX;
    var dy = e.screenY - this.screenY;

    this.deltaX += dx;
    this.deltaY += dy;
    
    var x = this.limitX(this.deltaX);
    var y = this.limitY(this.deltaY);

    this.screenX = e.screenX;
    this.screenY = e.screenY;
    
    // TODO(pupius): Prevent default should return properly
    /*var rv =*/ this.dispatchEvent(new goog.fx.DragEvent(
        this.events.BEFOREDRAG, this, x, y));

    // Only do the defaultAction and dispatch drag event if predrag didn't
    // prevent default
    if (1) {    // if (rv !== false) {
      this.defaultAction(x, y);
      this.dispatchEvent(new goog.fx.DragEvent(this.events.DRAG, this, x, y));
      e.preventDefault();
    }
  }
};


/**
 * Returns the 'real' x after limits are applied (allows for some
 * limits to be undefined).
 * @param {Number} x X-coordinate to limit
 * @return {Number} The 'real' X-coordinate after limits are applied.
 */
goog.fx.Dragger.prototype.limitX = function(x) {
  var rect = this.limits;
  var maxX = rect.left ? rect.left + (rect.width || 0) : Infinity;
  var minX = rect.left || -Infinity;
  
  return Math.min(maxX, Math.max(minX, x));
};


/**
 * Returns the 'real' y after limits are applied (allows for some
 * limits to be undefined).
 * @param {Number} y Y-coordinate to limit
 * @return {Number} The 'real' Y-coordinate after limits are applied.
 */
goog.fx.Dragger.prototype.limitY = function(y) {
  var rect = this.limits;
  var maxY = rect.top ? rect.top + (rect.height|| 0) : Infinity;
  var minY = rect.top || -Infinity;
    
  return Math.min(maxY, Math.max(minY, y));
};


/**
 * Overridable function for handling the default action of the drag behaviour.
 * Normally this is simply moving the element to x,y though in some cases it
 * might be used to resize the layer.  This is basically a shortcut to
 * implementing a default ondrag event handler.
 * @param {Number} x X-coordinate for target element
 * @param {Number} y Y-coordinate for target element
 */
goog.fx.Dragger.prototype.defaultAction = function(x, y) {
    this.target.style.left = x + 'px';
    this.target.style.top = y + 'px';
};


/**
 * Object representing a drag event
 * @param {String} type Event type
 * @param {goog.fx.Dragger} dragobj Drag object initiating event
 * @param {Number} opt_actX Optional actual x for drag if it has been limited
 * @param {Number} opt_actY Optional actual y for drag if it has been limited
 * @constructor
 * @extends goog.events.Event
 */
goog.fx.DragEvent = function(type, dragobj, opt_actX, opt_actY) {
  goog.events.Event.call(this, type);
  
  /**
   * Event type
   * @type String
   */
  this.type = type;
   
  /**
   * The real x-position of the drag if it has been limited
   * @type Number
   */
  this.left = opt_actX || dragobj.deltaX;
  
  /**
   * The real y-position of the drag if it has been imited
   * @type Number
   */
  this.top = opt_actY || dragobj.deltaY;
  
  /**
   * Reference to the drag object for this event
   * @type goog.fx.Dragger
   */
  this.dragger = dragobj;
};
goog.fx.DragEvent.inherits(goog.events.Event);
