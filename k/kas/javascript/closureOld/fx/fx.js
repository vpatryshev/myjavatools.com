// Copyright 2006 Google Inc.
// All Rights Reserved

/**
 * @fileoverview Set of objects that allow animation and visual effects to be
 * easily achieved
 *
 * @author pupius@google.com (Daniel Pupius)
 * (Based loosly on my animation code for 13thparallel.org, with extra
 * inspiration from the DojoToolkit's modifications to my code)
 */

// TODO: Make a single Timer that the animation objects report to

/**
 * Create Namespaces
 */
goog.provide('goog.fx');

goog.provide('goog.fx.Animation');
goog.provide('goog.fx.AnimationEvent');

/**
 * Dependencies
 */
goog.require('goog.events.EventTarget');
goog.require('goog.array');


//==============================================================================
// Constants
//==============================================================================

/**
 * Constant for a stopped animation
 * @type Number
 */
goog.fx.STOPPED = 0;

/**
 * Constant for a paused animation
 * @type Number
 */
goog.fx.PAUSED = -1;

/**
 * Constant for a playing animation
 * @type Number
 */
goog.fx.PLAYING = 1;

/**
 * Event name for play, when played for the first time OR when it is resumed
 * @type String
 */
goog.fx.PLAY = 'play';

/**
 * Event name for begin, only when the animation starts from the beginning
 * @type String
 */
goog.fx.BEGIN = 'begin';

/**
 * Event name for resume; only when animation is restarted after a pause
 * @type String
 */
goog.fx.RESUME = 'resume';

/**
 * Event name for end; when animation comes to the end of its duration OR stop
 * is called
 * @type String
 */
goog.fx.END = 'end';

/**
 * Event name for stop; only when stop is called
 * @type String
 */
goog.fx.STOP = 'stop';

/**
 * Event name for finish; only when animation comes to its end naturally
 * @type String
 */
goog.fx.FINISH = 'finish';

/**
 * Event name for pause; when an animation is paused
 * @type String
 */
goog.fx.PAUSE = 'pause';

/**
 * Event name for onanimate; called each frame of the animation.  This is where
 * the actual animator will listen
 * @type String
 */
goog.fx.ANIMATE = 'animate';


/**
 * Default timeout for animations (in milliseconds)
 * @type Number
 */
goog.fx.TIMEOUT = 20;



//==============================================================================
// Public properties
//==============================================================================

/**
 * Object containing functions for adding acceleration to animations
 * @type Object
 */
goog.fx.easing = {

  /**
   * Ease in - Start slow and speed up
   * @param {Number} t Input between 0 and 1
   * @return {Number} Output between 0 and 1
   */
  easeIn: function(t) {
    return t * t * t;
  },

  /**
   * Ease out - Start fastest and slows to a stop
   * @param {Number} t Input between 0 and 1
   * @return {Number} Output between 0 and 1
   */
  easeOut: function(t) {
    return 1 - Math.pow(1 - t, 3);
  },

  /**
   * Ease in and out - Start slow, speed up, then slow down
   * @param {Number} t Input between 0 and 1
   * @return {Number} Output between 0 and 1
   */
  inAndOut: function(t) {
    return  (3 * t * t) - (2 * t * t * t);
  }
};



/**
 * Constructor for an animation object
 * @param {Array} start Array for start coordinates
 * @param {Array} end Array for end coordinates
 * @param {Nunber} duration Length of animation in milliseconds
 * @param {Function} opt_acc Acceleration function, returns 0-1 for inputs 0-1
 * @constructor
 * @extends goog.events.EventTarget
 */
goog.fx.Animation = function(start, end, duration, opt_acc) {
  goog.events.EventTarget.call(this);

  if (!goog.isArray(start) || !goog.isArray(end)) {
    throw '[goog.fx.Animation] Start and end parameters must be arrays';
    return;
  }

  if (start.length != end.length) {
    throw '[goog.fx.Animation] Start and end points must be the same length';
    return;
  }

  /**
   * Start point
   * @type Array
   */
  this.startPoint_ = start;

  /**
   * End point
   * @type Array
   */
  this.endPoint_ = end;

  /**
   * Duration of animation in milliseconds
   * @type Number
   */
  this.duration_ = duration;

  /**
   * Acceleration function, which must return a number between 0 and 1 for
   * inputs between 0 and 1
   * @type Function
   */
  this.accel_ = opt_acc;

  /**
   * Current state of the animation.  goog.fx.STOPPED, goog.fx.PAUSED,
   * goog.fx.PLAYING
   * @type Number
   */
  this.state_ = goog.fx.STOPPED;

  /**
   * Current coordinate for animation
   * @type Array
   */
  this.coords_ = [];

  /**
   * Current framerate
   * @type Number
   */
  this.fps_ = 0;

  /**
   * Percent of the way through the animation
   *  @type Number
   */
  this.progress_ = 0;

  /**
   * Timestamp for when animation was started
   * @type Date
   */
  this.startTime_ = null;

  /**
   * Timestamp for when animation was started
   * @type Date
   */
  this.endTime_ = null;

  /**
   * Timestamp for when last frame was run
   * @type Date
   */
  this.lastFrame_ = null;

  /**
   * Reference to timeout used for the animation
   * @type Number
   */
  this.timer_ = null;
};

/**
 * Inherit from EventTarget
 */
goog.fx.Animation.inherits(goog.events.EventTarget);

/**
 * Start or resume an animation
 * @param {Boolean} restart Whether to restart the animation from the beginning
 *                          if it has been paused
 * @return {Boolean} If animation was started
 */
goog.fx.Animation.prototype.play = function(restart) {
  if (restart || this.state_ == goog.fx.STOPPED) {
    this.progress_ = 0;
    this.coords_ = this.startPoint_;
  } else if (this.state_ == goog.fx.PLAYING) {
    return false;
  }

  goog.global.clearTimeout(this.timer_);

  this.startTime_ = (new Date).valueOf();

  if (this.state_ == goog.fx.PAUSED) {
    this.startTime_ -= this.duration_ * this.progress_;
  }

  this.endTime_ = this.startTime_ + this.duration_;
  this.lastFrame_ = this.startTime_;

  if (this.progress_ == 0) {
    this.dispatchAnimationEvent_(goog.fx.BEGIN);
  }

  this.dispatchAnimationEvent_(goog.fx.PLAY);

  if (this.state_ == goog.fx.PAUSED) {
    this.dispatchAnimationEvent_(goog.fx.RESUME);
  }

  this.state_ = goog.fx.PLAYING;

  this.cycle_();

  return true;
};


/**
 * Stop the animation
 * @param {Boolean} gotoEnd If true the animation will move to the end coords
 */
goog.fx.Animation.prototype.stop = function(gotoEnd) {
  goog.global.clearTimeout(this.timer_);
  this.state_ = goog.fx.STOPPED;

  if (gotoEnd) this.progress_ = 1;

  this.updateCoords_(this.progress_);

  this.dispatchAnimationEvent_(goog.fx.STOP);
  this.dispatchAnimationEvent_(goog.fx.END);
};


/**
 * Pause the animation (iff it's playing)
 */
goog.fx.Animation.prototype.pause = function() {
  if (this.state_ == goog.fx.PLAYING) {
    goog.global.clearTimeout(this.timer_);
    this.state_ = goog.fx.PAUSED;

    this.dispatchAnimationEvent_(goog.fx.PAUSE);
  }
};


/**
 * Stops an animation, fires a 'destory' event and then removes all the event
 * handlers to clean up memory
 */
goog.fx.Animation.prototype.destroy = function() {
  this.stop();
  this.dispatchAnimationEvent_(goog.fx.DESTROY);
  goog.events.removeAll(this);

  for (var x in this) {
    this[x] = null;
    delete this[x];
  }
};

/**
 * Handle the actual iteration of the animation in a timeout
 * @private
 */
goog.fx.Animation.prototype.cycle_ = function() {
  goog.global.clearTimeout(this.timer_);

  var now = (new Date).valueOf();
  this.progress_ = (now - this.startTime_) / (this.endTime_ - this.startTime_);

  if (this.progress_ >= 1) this.progress_ = 1;

  this.fps_ = 1000 / (now - this.lastFrame_);
  this.lastFrame_ = now;

  if (goog.isFunction(this.accel_)) {
    this.updateCoords_(this.accel_(this.progress_));
  } else {
    this.updateCoords_(this.progress_);
  }

  // Animation has finished
  if (this.progress_ == 1) {
    this.state_ = goog.fx.STOPPED;

    this.dispatchAnimationEvent_(goog.fx.FINISH);
    this.dispatchAnimationEvent_(goog.fx.END);

  // Animation is still under way
  } else if (this.state_ == goog.fx.PLAYING) {
    this.dispatchAnimationEvent_(goog.fx.ANIMATE);

    var boundfunc = this.cycle_.bind(this);
    this.timer_ = goog.global.setTimeout(boundfunc, goog.fx.TIMEOUT);
  }
};


/**
 * Calculate current coordinates, based on the current state
 * @param {Number} t Percentage of the way through the animation as a decimal
 * @return {Void} Updates this.coords_ instead
 * @private
 */
goog.fx.Animation.prototype.updateCoords_ = function(t) {
  this.coords_ = new Array(this.startPoint_.length);
  for(var i = 0; i < this.startPoint_.length; i++) {
    this.coords_[i] = ((this.endPoint_[i] - this.startPoint_[i]) * t) +
                      this.startPoint_[i];
  }
};


/**
 * Returns an event object for the current animation
 * @param {String} type Event type that will be dispatched
 * @private
 */
goog.fx.Animation.prototype.dispatchAnimationEvent_ = function(type) {
  this.dispatchEvent(new goog.fx.AnimationEvent(type, this));
};


/**
 * Class for an animation event object
 * @param {String} type Event type
 * @param {goog.fx.Animation} anim An animation object
 * @constructor
 */
goog.fx.AnimationEvent = function(type, anim) {
  this.type = type;
  this.coords = anim.coords_;
  this.x = anim.coords_[0];
  this.y = anim.coords_[1];
  this.z = anim.coords_[2];

  this.coordsAsInts = function() {
    var ints = [];
    for (var i = 0; i < anim.coords_.length; i++) {
      ints.push(Math.round(anim.coords_[i]));
    }
    return ints;
  };

  this.duration = anim.duration_;
  this.progress = anim.progress_;
  this.fps = anim.fps_;

  this.state = anim.state_;
  this.anim = anim;
};
