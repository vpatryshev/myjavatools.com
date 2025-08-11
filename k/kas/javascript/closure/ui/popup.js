// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the Popup class
 *
 * @author Jon Perlow (jonp@google.com)
 */

/**
 * Namespace for Popup
 */
goog.provide('goog.ui.Popup');
goog.require('goog.debug.Logger');
goog.require('goog.style');
goog.require('goog.math');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.dom');
goog.require('goog.userAgent');

/**
 * The Popup class provides functionality for displaying an absolutely
 * positioned element at a particular location in the window. It's designed to
 * be used as the foundation for building controls like a menu or tooltip. The
 * Popup class includes functionality for displaying a Popup near adjacent to
 * an anchor element. It also provides the option for hiding the popup element
 * if the user clicks outside the popup or the popup loses focus.

 * This works cross browser and thus does not use IE's createPopup feature
 * which supports extending outside the edge of the brower window.
 *
 *
 * TODO(jonp) - Smart positioning so that the popup changes the corner of the
 * anchor it displays at if otherwise it would appear offscreen
 *
 * @constructor
 * @extends goog.events.EventTarget
 * @param {Element} opt_element A DOM element for the popup.
 */
goog.ui.Popup = function(opt_element) {

  /**
   * Listener keys for events that need to be unlistened to when the popup
   * is hidden.
   * @type Array&lt;String&gt;
   * @private
   */
  this.listenerKeys_ = [];

  /**
   * The corner of the popup to position
   *
   * @type Number
   * @private
   */
  this.popupCorner_ = goog.ui.Popup.Corner.TOP_LEFT;

  /**
   * Margin for the popup used in positioning algorithms.
   *
   * @type goog.math.Box
   * @private
   */
  this.margin_ = new goog.math.Box(0, 0, 0, 0);

  /**
   * Position of the popup.
   *
   * @type goog.ui.Popup.AnchoredPosition|goog.ui.Popup.AbsolutePosition|
   * goog.ui.Popup.ViewPortPosition
   */
  this.position_ = new goog.ui.Popup.AbsolutePosition(0, 0);

  this.setElement(opt_element);

};
goog.ui.Popup.inherits(goog.events.EventTarget);


/**
 * The popup dom element that this Popup wraps.
 * @type Element
 * @private
 */
goog.ui.Popup.prototype.element_ = null;


/**
 * Whether the Popup dismisses itself it the user clicks outside of it or the
 * popup loses focus
 * @type Boolean
 * @private
 */
goog.ui.Popup.prototype.autoHide_ = true;

/**
 * Whether the popup is currently being shown.
 * @type Boolean
 * @private
 */
goog.ui.Popup.prototype.isVisible_ = false;

/**
 * The time when the popup was last shown.
 * @type Number
 * @private
 */
goog.ui.Popup.prototype.lastShowTime_ = -1;

/**
 * The time when the popup was last hidden.
 * @type Number
 * @private
 */
goog.ui.Popup.prototype.lastHideTime_ = -1;

/**
 * This popup's parent popup
 * @type Popup
 * @private
 */
goog.ui.Popup.prototype.parent_ = null;

/**
 * The time when the popup was last marked to keep showing.
 * @type Number
 * @private
 */
goog.ui.Popup.prototype.lastMarkedTime_ = -1;

/**
 * Enum for representing an element corner for positioning the popup.
 *
 * @type Object
 */
goog.ui.Popup.Corner = {};

/**
 * The value that represents the top-left corner.
 *
 * @type Number
 */
goog.ui.Popup.Corner.TOP_LEFT = 1;

/**
 * The value that represents the top-right corner.
 *
 * @type Number
 */
goog.ui.Popup.Corner.TOP_RIGHT = 2;

/**
 * The value that represents the bottom-left corner.
 *
 * @type Number
 */
goog.ui.Popup.Corner.BOTTOM_LEFT = 3;

/**
 * The value that represents the bottom-right corner.
 *
 * @type Number
 */
goog.ui.Popup.Corner.BOTTOM_RIGHT = 4;

/**
 * Constants for event type fired by Popup
 * @type Object
 */
goog.ui.Popup.Events = {};

/**
 * Event type that indicates the popup is about to be shown.
 * @type Number
 */
goog.ui.Popup.Events.BEFORE_SHOW = 'beforeshow';


/**
 * Event type that indicates the popup was shown.
 * @type Number
 */
goog.ui.Popup.Events.SHOW = 'show';


/**
 * Event type that indicates the popup was hidden.
 * @type Number
 */
goog.ui.Popup.Events.HIDE = 'hide';


/**
 * A time in ms used to debounce events that happen right after each other.
 *
 * A note about why this is necessary. There are two cases to consider.
 * First case, a popup will usually see a focus event right after it's launched
 * because it's typical for it to be launched in a mouse-down event which will
 * then move focus to the launching button. We don't want to think this is a
 * separate user action moving focus. Second case, a user clicks on the
 * launcher button to close the menu. In that case, we'll close the menu in the
 * focus event and then show it again because of the mouse down event, even
 * though the intention is to just close the menu. This workaround appears to
 * be the least intrusive fix.
 *
 * @type Number
 * @private
 */
goog.ui.Popup.DEBOUNCE_DELAY_MS_ = 50;


/**
 * Encapsulates a popup position where the popup is anchored at a corner of
 * an element.
 *
 * When using AnchoredPosition, it is recommended that the popup element
 * specified in the Popup constructor or Popup.setElement be absolutely
 * positioned.
 *
 * @param {Element} element The element to anchor the popup at.
 * @param {Number} corner The corner of the element to anchor the popup at. One
 * of the goog.ui.Popup.Corner constants.
 */
goog.ui.Popup.AnchoredPosition = function(element, corner) {
  this.element = element;
  this.corner = corner;
};


/**
 * Encapsulates a popup position where the popup absolutely positioned by
 * setting the left/top style elements directly to the specified values.
 * The position is generally relative to the element's offsetParent. Normally,
 * this is the document body, but can be another element if the popup element
 * is scoped by an element with relative position.
 *
 * @param {Number|goog.math.Coordinate} arg1 Left position or coordinate
 * @param {Number} opt_arg2 Top position
 */
goog.ui.Popup.AbsolutePosition = function(arg1, opt_arg2) {
  if (arg1 instanceof goog.math.Coordinate) {
    this.coordinate = arg1;
  } else {
    this.coordinate = new goog.math.Coordinate(arg1, opt_arg2);
  }
};


/**
 * Encapsulates a popup position where the popup is positioned according to
 * coordinates relative to the  element's view port (page). This calculates the
 * correct position to use even if the element is relatively positioned to some
 * other element.
 *
 * @param {Number|goog.math.Coordinate} arg1 Left position or coordinate
 * @param {Number} opt_arg2 Top position
 */
goog.ui.Popup.ViewPortPosition = function (arg1, opt_arg2) {
  if (arg1 instanceof goog.math.Coordinate) {
    this.coordinate = arg1;
  } else {
    this.coordinate = new goog.math.Coordinate(arg1, opt_arg2);
  }
};


/**
 * Encapsulates a popup position where the popup is positioned relative to the
 * window (client) coordinates. This calculates the correct position to
 * use even if the element is relatively positioned to some other element. This
 * is for trying to position an element at the spot of the mouse cursor in
 * a MOUSEMOVE event. Just use the event.clientX and event.clientY as the
 * parameters.
 *
 * @param {Number|goog.math.Coordinate} arg1 Left position or coordinate
 * @param {Number} opt_arg2 Top position
 */
goog.ui.Popup.ClientPosition = function(arg1, opt_arg2) {
  if (arg1 instanceof goog.math.Coordinate) {
    this.coordinate = arg1;
  } else {
    this.coordinate = new goog.math.Coordinate(arg1, opt_arg2);
  }
};

/**
 * Returns the dom element that should be used for the popup.
 *
 * @return {Element} The popup element
 */
goog.ui.Popup.prototype.getElement = function(elt) {
  return this.element_;
};


/**
 * Specifies the dom element that should be used for the popup.
 *
 * @param {Element} elt A DOM element for the popup.
 */
goog.ui.Popup.prototype.setElement = function(elt) {
  this.ensureNotVisible_();
  this.element_ = elt;
};


/**
 * Returns whether the Popup dismisses itself when the user clicks outside of
 * it.
 * @return Whether the Popup autohides on an external click
 */
goog.ui.Popup.prototype.getAutoHide = function() {
  return this.autoHide_;
};


/**
 * Sets whether the Popup dismisses itself when the user clicks outside of it.
 * @param {Boolean} autoHide Whether to autohide on an external click
 */
goog.ui.Popup.prototype.setAutoHide = function(autoHide) {
  this.ensureNotVisible_();
  this.autoHide_ = autoHide;
};

/**
 * Returns the time when the popup was last shown.
 *
 * @return {Number} time in ms since epoch when the popup was last shown, or
 * -1 if the popup was never shown
 */
goog.ui.Popup.prototype.getLastShowTime = function() {
  return this.lastShowTime_;
};


/**
 * Returns the time when the popup was last hidden.
 *
 * @return {Number} time in ms since epoch when the popup was last hidden, or
 * -1 if the popup was never hidden or is currently showing
 */
goog.ui.Popup.prototype.getLastHideTime = function() {
  return this.lastHideTime_;
};


/**
 * Helper to throw exception if the popup is showing.
 * @private
 */
goog.ui.Popup.prototype.ensureNotVisible_ = function() {
  if (this.isVisible_) {
    throw Error("Can not change this state of the popup while showing.");
  }
};


/**
 * Returns the corner of the popup to used in the positioning algorithm.
 *
 * @return {Number} Returns the popup corner used for positioning. One of the
 * goog.ui.Popup.Corner constants
 */
goog.ui.Popup.prototype.getPinnedCorner = function() {
  return this.popupCorner_;
};


/**
 * Sets the corner of the popup to used in the positioning algorithm.
 *
 * @param {Number} corner The popup corner used for positioning. One of the
 * goog.ui.Popup.Corner constants
 */
goog.ui.Popup.prototype.setPinnedCorner = function(corner) {
  this.popupCorner_ = corner;
  this.reposition_();
};


/**
 * Returns the position of the popup.
 *
 * @return {goog.ui.Popup.AnchoredPosition|goog.ui.Popup.AbsolutePosition|
 * goog.ui.Popup.ViewPortPosition} The position of the popup.
 */
goog.ui.Popup.prototype.getPosition = function(position) {
  return this.position_;
};


/**
 * Sets the position of the popup.
 *
 * @param {goog.ui.Popup.AnchoredPosition|goog.ui.Popup.AbsolutePosition|
 * goog.ui.Popup.ViewPortPosition} position The position of the popup.
 */
goog.ui.Popup.prototype.setPosition = function(position) {
    this.position_ = position;
    this.reposition_();
};


/**
 * Returns the margin to place around the popup.
 *
 * @return {goog.math.Box} The margin
 */
goog.ui.Popup.prototype.getMargin = function() {
  return this.margin_;
};


/**
 * Sets the margin to place around the popup.
 *
 * @param {goog.math.Box|Number} arg1 Top value or Box
 * @param {Number} opt_arg2 Right value
 * @param {Number} opt_arg3 Bottom value
 * @param {Number} opt_arg4 Left value
 */
goog.ui.Popup.prototype.setMargin = function(arg1, opt_arg2, opt_arg3,
                                             opt_arg4) {
  if (arg1 instanceof goog.math.Box) {
    this.margin_ = arg1;
  } else {
    this.margin_ = new goog.math.Box(arg1, opt_arg2, opt_arg3, opt_arg4);
  }
  this.reposition_();
};


/**
 * Returns whether the popup is currently visible.
 *
 * @return {Boolean} whether the popup is currently visible.
 */
goog.ui.Popup.prototype.isVisible = function() {
  return this.isVisible_;
};


/**
 * Returns whether the popup is currently visible or was visible within about
 * 50 ms ago. This is used by clients to handle a very specific, but common,
 * popup scenario. The button that launches the popup should close the popup
 * on mouse down if the popup is alrady open. The problem is that the popup
 * closes itself during the capture phase of the mouse down and thus the button
 * thinks it's hidden and this should show it again. This method provides a
 * good heuristic for clients. Typically in their event handler they will have
 * code that is:
 *
 * if (menu.isOrWasRecentlyVisible()) {
 *   menu.setVisible(false);
 * } else {
 *   ... // code to position menu and initialize other state
 *   menu.setVisible(true);
 * }
 */
goog.ui.Popup.prototype.isOrWasRecentlyVisible = function() {
  return this.isVisible_ ||
         (goog.now() - this.lastHideTime_ < goog.ui.Popup.DEBOUNCE_DELAY_MS_);
};


/*
 * Sets whether the popup should be visible.
 */
goog.ui.Popup.prototype.setVisible = function(visible) {
  if (visible) {
    if (!this.element_) {
      throw Error("Caller must call setPopupElement before trying to show the" +
                  "popup");
    }
    if (!this.position_) {
      throw Error("Must specify a position for the popup with setPosition " +
                  "before calling setVisible(true)");
    }

    this.reposition_();
    this.show_();
  } else {
    this.hide_();
  }
};


/**
 * Repositions the popup according to the current state
 */
goog.ui.Popup.prototype.reposition_ = function() {
  if (this.position_ instanceof goog.ui.Popup.AnchoredPosition) {
    goog.ui.Popup.positionPopup_(this.position_.element, this.position_.corner,
        this.element_, this.popupCorner_, new goog.math.Coordinate(0, 0),
        this.margin_);
  } else if (this.position_ instanceof goog.ui.Popup.AbsolutePosition) {
    goog.ui.Popup.positionAtCoordinate_(this.position_.coordinate,
        this.element_, this.popupCorner_, this.margin_);
  } else if (this.position_ instanceof goog.ui.Popup.ViewPortPosition) {
    var viewPortElt = goog.style.getClientViewportElement(this.element_);
    goog.ui.Popup.positionPopup_(
        viewPortElt, goog.ui.Popup.Corner.TOP_LEFT, this.element_,
        this.popupCorner_, this.position_.coordinate, this.margin_);
  } else if (this.position_ instanceof goog.ui.Popup.ClientPosition) {
    var viewPortElt = goog.style.getClientViewportElement(this.element_);
    var clientPos = new goog.math.Coordinate(
        this.position_.coordinate.x + viewPortElt.scrollLeft,
        this.position_.coordinate.y + viewPortElt.scrollTop);
    goog.ui.Popup.positionPopup_(
        viewPortElt, goog.ui.Popup.Corner.TOP_LEFT, this.element_,
        this.popupCorner_, clientPos, this.margin_);
  }
};


/**
 * Does the work to show the popup.
 */
goog.ui.Popup.prototype.show_ = function() {
  if (this.isVisible_) {
    // if we are already showing, this function just repositions the popup
    return;
  }

  // give derived classes and handlers a chance to customize popup
  if (!this.onBeforeShow_()) {
    return;
  }

  // set up event handlers
  if (this.autoHide_) {
    this.startListening_();
  }

  // make the popup visible and set focus
  this.element_.style.visibility = 'visible';
  this.isVisible_ = true;

  // notify derived classes and handlers
  this.onShow_();
};


/**
 * Hides the popup. Does nothing it if was opened very recently.
 *
 * @private
 */
goog.ui.Popup.prototype.hide_ = function() {
  if (this.isVisible_) {
    // remove any listeners we attached when showing the popup
    this.stopListening_();

    // hide the popup
    this.element_.style.visibility = 'hidden';
    this.isVisible_ = false;

    // notify derived classes and handlers
    this.onHide_();
  }
};


/**
 * Called before the popup is shown. Derived classes can override to hook this
 * event but should make sure to call the parent class method.
 *
 * @private
 */
goog.ui.Popup.prototype.onBeforeShow_ = function() {
  return this.dispatchEvent(goog.ui.Popup.Events.BEFORE_SHOW);
};

/**
 * Called after the popup is shown. Derived classes can override to hook this
 * event but should make sure to call the parent class method.
 *
 * @private
 */
goog.ui.Popup.prototype.onShow_ = function() {
  this.lastShowTime_ = goog.now();
  this.lastHideTime_ = -1;
  this.dispatchEvent(goog.ui.Popup.Events.SHOW);
};


/**
 * Called after the popup is hidden. Derived classes can override to hook this
 * event but should make sure to call the parent class method.
 *
 * @private
 */
goog.ui.Popup.prototype.onHide_ = function() {
  this.lastHideTime_ = goog.now();
  this.dispatchEvent(goog.ui.Popup.Events.HIDE);
};



/**
 * Positions a movable element relative to an anchorElement. The caller
 * specifies the corners that should touch. This functions then moves the
 * movable element accordingly.
 *
 * @param {Object} anchorElement The DOM element that is the anchor for where
 * the movable element should position itself.
 * @param {Number} anchorElementCorner The corner of the anchorElement for
 * positioning the movable element. One of the goog.ui.Popup.Corner constants.
 * @param {Object} movableElement The DOM element to move.
 * @param {Number} movableElementCorner The corner of the movableElement that
 * that should be positioned adjacent to the anchorElement. One of the
 * goog.ui.Popup.Corner constants.
 * @param {goog.math.Coordinate} opt_offset An offset specified in pixels.
 * After the normal positioning algorithm is applied, the offset is then
 * applied. Positive coordinates move the popup closer to the center of the
 * anchor element. Negative coordinates move the popup away from the center of
 * the anchor element.
 * @param {goog.math.Box} opt_margin A margin specified in pixels.
 * After the normal positioning algorithm is applied and any offset, the margin
 * is then applied. Positive coordinates move the popup away from the spot it
 * was positioned towards its center. Negative coordiates move it towards the
 * spot it was positioned away from its center.
 *
 * TODO(jonp) - There should be an option that tells the popup to automatically
 * pick different element corners if the preferred element corners would render
 * the popup off the edge of the browser window.
 *
 * I made this a generic static function since I can imagine scenarios where
 * somebody might want this positioning logic without the rest of the Popup
 * functionality.
 */
goog.ui.Popup.positionPopup_ = function(anchorElement, anchorElementCorner,
                                        movableElement, movableElementCorner,
                                        opt_offset, opt_margin) {
  // set top and left to zero so all our measurements are in terms of the
  // natural position of the element. we'll then make some coputations to find
  // out what top and left should be set to in order to satisfy the
  // parameters
  goog.style.setPosition(movableElement, 0, 0);

  // find the vector between the position element and the popup element by
  // finding the positions in page coordinates and then subtracting
  var relativePosPopup = goog.style.getPageOffset(movableElement);
  var relativePosAnchor = goog.style.getPageOffset(anchorElement);

  // set absolutePos for (POPUP_TOP_LEFT, POPUP_TOP_LEFT) case.
  var absolutePos = new goog.math.Coordinate(
      relativePosAnchor.x - relativePosPopup.x,
      relativePosAnchor.y - relativePosPopup.y);

  // offset based on which corner of the element we want to position against
  var offsetXMultiplier = 1;
  var offsetYMultiplier = 1;
  var anchorElementSize = goog.style.getSize(anchorElement);
  switch (anchorElementCorner) {
    case goog.ui.Popup.Corner.TOP_LEFT:
      break;
    case goog.ui.Popup.Corner.TOP_RIGHT:
      absolutePos.x += anchorElementSize.width;
      offsetXMultiplier = -1
      break;
    case goog.ui.Popup.Corner.BOTTOM_LEFT:
      absolutePos.y += anchorElementSize.height;
      offsetYMultiplier = -1;
      break;
    case goog.ui.Popup.Corner.BOTTOM_RIGHT:
      absolutePos.x += anchorElementSize.width;
      absolutePos.y += anchorElementSize.height;
      offsetXMultiplier = -1
      offsetYMultiplier = -1;
      break;
  }

  if (opt_offset) {
    absolutePos.x += offsetXMultiplier * opt_offset.x;
    absolutePos.y += offsetYMultiplier * opt_offset.y;
  }

  goog.ui.Popup.positionAtCoordinate_(absolutePos, movableElement,
      movableElementCorner, opt_margin);
};

/**
 * Positions the specified corner of the movable element at the
 * specified coordinate.
 *
 * @param {goog.math.Coordinate} absolutePos The coordinate to position the
 * element at.
 * @param {Object] movableElement The element to be positioned.
 * @param {Number} movableElementCorner The corner of the movableElement that
 * that should be positioned. One of the goog.ui.Popup.Corner constants.
 */
goog.ui.Popup.positionAtCoordinate_ = function(absolutePos, movableElement,
                                               movableElementCorner,
                                               opt_margin) {

  var margin = opt_margin ? opt_margin : new goog.math.Box(0, 0, 0, 0);

  // offset based on which corner of the popup we want to position against
  var movableElementSize = goog.style.getSize(movableElement);
  switch (movableElementCorner) {
    case goog.ui.Popup.Corner.TOP_LEFT:
      absolutePos.x += margin.left;
      absolutePos.y += margin.top;
      break;
    case goog.ui.Popup.Corner.TOP_RIGHT:
      absolutePos.x -= movableElementSize.width;
      absolutePos.x -= margin.right;
      absolutePos.y += margin.top;
      break;
    case goog.ui.Popup.Corner.BOTTOM_LEFT:
      absolutePos.y -= movableElementSize.height;
      absolutePos.x += margin.left;
      absolutePos.y -= margin.bottom;
      break;
    case goog.ui.Popup.Corner.BOTTOM_RIGHT:
      absolutePos.x -= movableElementSize.width;
      absolutePos.y -= movableElementSize.height;
      absolutePos.x -= margin.right;
      absolutePos.y -= margin.bottom;
      break;
  }

  goog.style.setPosition(movableElement, absolutePos);
};


/**
 * Acts on user action - either keyboard focus moved, or mouse was clicked.
 * If the event happened within this popup, it is marked as visible, together
 * with its ancestors; otherwise, it is hidden, and the event is passed to
 * its parent for similar processing.
 *
 * @param (Event) event
 *
 * @private
 */
goog.ui.Popup.prototype.onUserAction_ = function(e) {
  if (goog.dom.contains(this.element_, e.target)) {
    this.keepVisible_();
  } else {
    if ((goog.now() - this.lastMarkedTime_) >
        3 * goog.ui.Popup.DEBOUNCE_DELAY_MS_) {

      this.hide_();
      if (this.parent_) {
        this.parent_.onUserAction_(e);
      }
    }
  }
}


/**
 * Mouse down handler for the document on capture phase. Used to hide the
 * popup for auto-hide mode.
 *
 * @param {goog.events.Event} e The event object
 */
goog.ui.Popup.prototype.onDocumentMouseDown_ = function(e) {
  this.onUserAction_(e);
};


/**
 * Focus-in handler(IE) and focus handler (other browsers) for document on the
 * capture phase. Used to hide the popup for auto-hide mode
 *
 * @param {goog.events.Event} e The event object
 */
goog.ui.Popup.prototype.onDocumentFocus_ = function(e) {
  // debounce the initial focus move?
  if (goog.now() - this.lastShowTime_ > goog.ui.Popup.DEBONUCE_DELAY_MS_) {
    this.onUserAction_(e);
  }
};


/**
 * Removes all listeners that we've attached.
 * @private
 */
goog.ui.Popup.prototype.removeListeners_ = function() {
  for (var i=0; i < this.listenerKeys_.length; i++) {
    goog.events.unlistenByKey(this.listenerKeys_[i]);
  }
  this.listenerKeys_.length = 0;
};


/**
 * Stops listening to events.
 * @private
 */
goog.ui.Popup.prototype.stopListening_ = function() {
  this.removeListeners_();
}


/**
 * Starts listening to popup-specific events
 */
goog.ui.Popup.prototype.startListening_ = function() {
  var doc = goog.dom.getOwnerDocument(this.element_);
  this.listenerKeys_.push(
      goog.events.listen(doc, goog.events.types.MOUSEDOWN,
          this.onDocumentMouseDown_, true, this));
  if (goog.userAgent.IE) {
    this.listenerKeys_.push(
        goog.events.listen(doc, goog.events.types.FOCUSIN,
            this.onDocumentFocus_, true, this));
  } else {
    this.listenerKeys_.push(
        goog.events.listen(doc, goog.events.types.FOCUS,
            this.onDocumentFocus_, true, this));
  }
}


/**
 * Sets a parent popup for this popup.
 *
 * @param parent (Popup) the parent to set
 */
goog.ui.Popup.prototype.setParent = function(parent) {
  this.parent_ = parent;
}


/**
 * Ensures visibility of this popup and its ancestors.
 *
 * @private
 */
goog.ui.Popup.prototype.keepVisible_ = function() {
  this.lastMarkedTime_ = goog.now();
  this.show_();

  if (this.parent_) {
    this.parent_.keepVisible_();
  }
}
