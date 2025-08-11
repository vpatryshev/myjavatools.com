// Copyright 2005 Google Inc.
// All Rights Reserved

/**
 * @fileoverview A patched, standardized event object for browser events.
 * 
 * <pre>
 * The patched event object contains the following members:
 * - type           {String}    Event type, e.g. 'click'
 * - timestamp      {Date}      A date object for when the event was fired
 * - target         {Object}    The element that actually triggered the event
 * - currentTarget  {Object}    The element the listener is attached to
 * - relatedTarget  {Object}    For mouseover and mouseout, the previous object
 * - offsetX        {Number}    X-coordinate relative to target
 * - offsetY        {Number}    Y-coordinate relative to target     
 * - clientX        {Number}    X-coordinate relative to viewport
 * - clientY        {Number}    Y-coordinate relative to viewport     
 * - screenX        {Number}    X-coordinate relative to the edge of the screen   
 * - screenY        {Number}    Y-coordinate relative to the edge of the screen
 * - button         {Number}    Mouse button   (TODO: Fix this)
 * - keyCode        {Number}    Key-code (TODO: Tet on various locals)
 * - ctrlKey        {Boolean}   Was ctrl key depressed
 * - altKey         {Boolean}   Was alt key depressed
 * - shiftKey       {Boolean}   Was shift key depressed
 * </pre>
 * 
 * @author pupius@google.com (Daniel Pupius)
 */

goog.provide('goog.events.BrowserEvent');
goog.require('goog.events.Event');

/**
 * Accepts a browser event object and creates a patched, cross browser event
 * object.
 * @param {Object} e Browser event object
 * @param {Object} opt_currentTarget Current target for event
 * @constructor
 */
goog.events.BrowserEvent = function(e, opt_currentTarget) {
  /**
   * Event type
   * @type String
   */
  this.type = e.type;
  
  /**
   * Date object for when the event was created
   * @type Date
   */
  this.timestamp = new Date;

  /**
   * Target that fired the event
   * @type DomNode
   */
  this.target = e.target || e.srcElement;
  
  /**
   * Node that had the listener attached
   * @type DomNode
   */
  this.currentTarget = opt_currentTarget; 
  
  
  /**
   * For mouseover and mouseout events, the related object for the event
   * @type DomNode
   */
  this.relatedTarget = null;
  
  if (goog.isDef(e.relatedTarget)) {
    this.relatedTarget = e.relatedTarget;
  } else if (this.type == goog.events.types.MOUSEOVER) {
    this.relatedTarget = e.fromElement;
  } else if (this.type == goog.events.types.MOUSEOUT) {
    this.relatedTarget = e.toElement;
  }
  
  /**
   * X-coordinate relative to target
   * @type Number
   */
  this.offsetX = goog.isDef(e.layerX) ? e.layerX : e.offsetX;
  
  /**
   * Y-coordinate relative to target
   * @type Number
   */
  this.offsetY = goog.isDef(e.layerY) ? e.layerY : e.offsetY;
  
  /**
   * X-coordinate relative to the window
   * @type Number
   */
  this.clientX = goog.isDef(e.clientX) ? e.clientX : e.pageX;
  
  /**
   * Y-coordinate relative to the window
   * @type Number
   */
  this.clientY = goog.isDef(e.clientY) ? e.clientY : e.pageY;
  
  /**
   * X-coordinate relative to the monitor
   * @type Number
   */
  this.screenX = e.screenX || 0;
  
  /**
   * Y-coordinate relative to the monitor
   * @type Number
   */
  this.screenY = e.screenY || 0;
   
  /**
   * Which mouse button was pressed
   * @type Number
   */
  this.button = e.button;

  
  // TODO: Ensure this keycode stuff makes sense, especially on different
  // keyboard layouts
  /**
   * Keycode of key press
   * @type Number
   */
  this.keyCode = e.keyCode || 0;
  
  /**
   * Keycode of key press
   * @type Number
   */
  this.charCode = e.charCode ||
                 (this.type == goog.events.types.KEYPRESS ? e.keyCode : 0);
  
  /**
   * Whether control was pressed at time of event
   * @type Boolean
   */
  this.ctrlKey = e.ctrlKey;
  
  /**
   * Whether alt was pressed at time of event
   * @type Boolean
   */
  this.altKey = e.altKey;
  
  /**
   * Whether shift was pressed at time of event
   * @type Boolean
   */
  this.shiftKey = e.shiftKey;

  /**
   * Override the stop propogation method and give it access to the original
   * event
   */ 
  this.stopPropagation = function() {
    this.propagationStopped_ = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  };
  
  /**
   * Override preventDefault and allow access to the original event through a 
   * closure
   */ 
  this.preventDefault = function() { 
    this.returnValue_ = false;
    if (!e.preventDefault) {
      e.returnValue = false;
    } else {
      e.preventDefault();
    }
  };

  return this;
};
goog.events.BrowserEvent.inherits(goog.events.Event);
