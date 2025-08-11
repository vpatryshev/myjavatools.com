// Copyright 2005 Google Inc.
// All Rights Reserved

/**
 * @fileoverview Event Manager
 *
 * Provides an abstracted interface to the browsers' event systems. Based on
 * Aaron's listen(), this uses an indirect lookup of listener functions to avoid
 * circular references between DOM (in IE) or XPCOM (in Mozilla) objects which
 * leak memory. This makes it easier to write OO Javascript/DOM code.<br><br>
 *
 * It simulates capture & bubble in Internet Explorer.<br><br>
 *
 * The listeners will also automagically have their event objects patched, so
 * your handlers don't need to worry about the browser.<br><br>
 *
 * Example usage:<br>
 * <pre>
 * goog.events.listen(myNode, 'click', function(e) { alert('woo') });
 * goog.events.listen(myNode, 'mouseover', mouseHandler, true);
 * goog.events.unlisten(myNode, 'mouseover', mouseHandler, true);
 * goog.events.removeAll(myNode);
 * goog.events.removeAll();
 * </pre>
 *
 * @author aa@google.com (Aaron Boodman) [Original implementation of listen()]
 * @author pupius@google.com (Daniel Pupius) [Port to closure plus capture phase
 *                                            in IE and event object patching]
 *
 * TODO(pupius): Use goog.object iterators and clean up the for...in loops.
 *
 * @supported So far tested in IE6 and FF1.5
 */


goog.provide('goog.events');

goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Listener');
goog.require('goog.array');


/**
 * Container for storing event listeners and their proxies
 * @private
 * @type Object
 */
goog.events.listeners_ = {};


/**
 * Lookup for mapping object hashcodes to listeners
 * @private
 * @type Object
 */
goog.events.lookup_ = {};

/**
 * Adds an event listener for a specific event on a DomNode or an object that
 * has implemented {@link goog.events.EventTarget}
 *
 * @param {EventTarget} src The node to listen to events on
 * @param {String|Array} type Event type or array of event types
 * @param {Function} listener Callback method
 * @param {Boolean} opt_capt Fire in capture phase?
 * @param {Object} opt_handler Element in who's scope to call the listener
 * @return {String} Unique key for the listener
 */
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      goog.events.listen(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }

  var key = goog.events.createKey_(src, type, listener, opt_capt, opt_handler);
  // addEventListener does not allow multiple listeners
  if (key in goog.events.listeners_) {
    return key;
  }

  // create a lookup so we can find the listeners for a particular object
  var hc = goog.getHashCode(src);

  if (!(hc in goog.events.lookup_)) {
    goog.events.lookup_[hc] = {};
  }

  if (!(type in goog.events.lookup_[hc])) {
    goog.events.lookup_[hc][type] = [];
  }

  goog.events.lookup_[hc][type].push(key);

  // use bind for currentTarget
  var proxy = goog.events.handleEvent_.bind(src, key, type);
  goog.events.listeners_[key] = new goog.events.Listener(listener,  proxy, src,
                                                         type, opt_capt,
                                                         opt_handler);

  // Attach the proxy through the browser's API
  if (src.addEventListener) {
    if (src == goog.global || !src.customEvent_) {
      src.addEventListener(type, proxy, opt_capt);
    }
  } else if (src.attachEvent) {
    src.attachEvent("on" + type, proxy);
  } else {
    throw Error("Object {" + src + "} does not support event listeners.");
  }

  return key;
};


/**
 * Removes an event listener which was added with listen().
 *
 * @param {Element} src The node to stop listening to events on
 * @param {String} type The name of the event without the "on" prefix
 * @param {Function} listener The listener function to remove
 * @param {Boolean} opt_capt In DOM-compliant browsers, this determines
 *                            whether the listener is fired during the
 *                            capture or bubble phase of the event.
 * @param {Object} opt_handler Element in who's scope to call the listener
 * @return {Boolean} indicating whether the listener was there to remove
 */
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  var key = goog.events.createKey_(src, type, listener, opt_capt, opt_handler);
  return goog.events.unlistenByKey(key);
};


/**
 * Removes an event listener which was added with listen() by the key
 * returned by listen().
 *
 * @param {String} key The key returned by listen() for this event listener
 * @return {Boolean} indicating whether the listener was there to remove
 */
goog.events.unlistenByKey = function(key) {
  if (!(key in goog.events.listeners_)) {
    return false;
  }
  var listener = goog.events.listeners_[key];

  var src = listener.src;
  var type = listener.type;
  var proxy = listener.proxy;

  if (src.removeEventListener) {
    if (src == goog.global || !src.customEvent_) {
      src.removeEventListener(type, proxy, listener.capture);
    }
  } else if (src.detachEvent) {
    src.detachEvent("on" + type, proxy);
  }

  delete goog.events.listeners_[key];
  goog.array.remove(goog.events.lookup_[goog.getHashCode(src)][type], key);

  return true;
};


/**
 * Removes all listeners from an object, if no object is specified it will
 * remove all listeners that have been registered.  You can also optionally
 * remove listeners of a particular type or capture phase.
 *
 * @param {Object} opt_obj Object to remove listeners from
 * @param {String} opt_type Type of event to, default is all types
 * @param {Boolean} opt_capt Whether to remove the listeners from the capture or
 * bubble phase.  If unspecified, will remove both
 * @return {Number} Number of listeners removed
 */
goog.events.removeAll = function(opt_obj, opt_type, opt_capt) {
  var count = 0;
  
  if (goog.isDef(opt_obj)) {
    var listeners = goog.events.getAllListeners_(opt_obj, opt_type, opt_capt);
    for (var i = 0; i < listeners.length; i++) {
      var item = listeners[i];   
      if (item) {  
        goog.events.unlistenByKey(goog.events.createKey_(item.src, item.type,
            item.listener, item.capture, item.handler));                                              
        count++;
      }
    }
  } else {   
    for (var key in goog.events.listeners_) {
      goog.events.unlistenByKey(key);                                              
      count++;
    }
  }

  return count;
};


/**
 * Gets all the listeners for a particular object, optionally filtering on type
 * and event phase
 * @param {Object} obj Object to get listeners for
 * @param {String} opt_type Event type
 * @param {Boolean} opt_capt Capture phase?
 * @return {Array} Array of {@link goog.events.Listener} objects
 */
goog.events.getAllListeners_ = function(obj, opt_type, opt_capt) {
  var hc = goog.getHashCode(obj);
  var listeners = [];

  if (hc in goog.events.lookup_) {
    var keyTypes = goog.events.lookup_[hc];

    if (goog.isDef(opt_type)) {
      if (opt_type in keyTypes) {
        goog.events.getAllListenersHelp_(listeners, keyTypes[opt_type],
                                         opt_capt);
      }
    } else {
      for (var type in keyTypes) {
        goog.events.getAllListenersHelp_(listeners, keyTypes[type], opt_capt);
      }
    }
  }

  return listeners;
};


/**
 * Adds the listeners corresponding to the keys array that match the capture
 * phase. Adds all the listeners if capture phase is omitted.
 *
 * @param {Array} listeners Array of listeners to add new listeners to
 * @param {Array} keys Keys of listeners to add
 * @param {Boolean} opt_capt Capture phase
 */
goog.events.getAllListenersHelp_ = function(listeners, keys, opt_capt) {
  // The typeof call is suprisingly expensive. Do it outside of the for loop.
  var isCaptureUndefined = !goog.isDef(opt_capt);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var listener = goog.events.listeners_[key];
    if (isCaptureUndefined || listener.capture == opt_capt) {
      listeners.push(listener);
    }
  }
};


/**
 * Gets the listeners for a given object, type and capture phase. This is
 * considerably faster than goog.events.getAllListeners.
 *
 * @param {Object} obj Object to get listeners for
 * @param {String} type Event type
 * @param {Boolean} capt Capture phase?
 * @return {Array} Array of {@link goog.events.Listener} objects
 */
goog.events.getListeners = function(obj, type, capt) {
  var hc = goog.getHashCode(obj);
  var listeners = [];

  if (hc in goog.events.lookup_) {
    var keyTypes = goog.events.lookup_[hc];

    if (type in keyTypes) {
      var keys = keyTypes[type];

      for (var i = 0; i < keys.length; i++) {
        var listener = goog.events.listeners_[keys[i]];
        if (listener.capture == capt) {
          listeners.push(listener);
        }
      }

    }
  }

  return listeners;
};

/**
 * Returns true if an object has a listener matching the type and capture phase
 * @param {Object} obj Object to get listeners for
 * @param {String} type Event type
 * @param {Boolean} capt Capture phase?
 * @return {Boolean}
 */
goog.events.hasListener = function(obj, type, capt) {
  var hc = goog.getHashCode(obj);
  if (hc in goog.events.lookup_) {
    var keyTypes = goog.events.lookup_[hc];

    if (type in keyTypes) {
      var keys = keyTypes[type];

      for (var i = 0; i < keys.length; i++) {
        var listener = goog.events.listeners_[keys[i]];
        if (listener.capture == capt) {
          return true;
        }
      }

    }
  }

  return false;
};

/**
* Provides a nice string showing the normalized event objects public members
* @param {Object} e Event Object
* @return {String}
*/
goog.events.expose = function(e) {
  var str = [];
  for (var key in e) {
    if (e[key] && e[key].id) {
      str.push(key + " = " + e[key] + " (" + e[key].id + ")");
    } else {
      str.push(key + " = " + e[key]);
    }
  }
  return str.join('\n');
};


//==============================================================================
// Public Properties
//==============================================================================

/**
 * Constants for event names, use goog.globalize(goog.events.types) to
 * copy to global namespace
 * @type Object
 */
goog.events.types = {
  // Mouse events
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  MOUSEOVER: 'mouseover',
  MOUSEOUT: 'mouseout',
  MOUSEMOVE: 'mousemove',

  // Key events
  KEYPRESS: 'keypress',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',

  // Focus
  BLUR: 'blur',
  FOCUS: 'focus',
  // TODO(pupius): Test these. I experienced problems with DOMFocusIn, the event
  // just wasn't firing.
  FOCUSIN: document.all ? 'focusin' : 'DOMFocusIn',
  FOCUSOUT: document.all ? 'focusout' : 'DOMFocusOut',

  // Forms
  CHANGE: 'change',
  SELECT: 'select',
  SUBMIT: 'submit',

  // Misc
  LOAD: 'load',
  UNLOAD: 'unload',
  HELP: 'help',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  READYSTATECHANGE: 'readystatechange'
};


//==============================================================================
// Private Methods
//==============================================================================


/**
 * Handles an event and dispatches it to the correct listeners. This
 * function is a proxy for the real listener the user specified.
 *
 * @this The object or Element that fired the event
 *
 * @param {String} key Unique key for the listener
 * @param {String} type Event type
 * @return {Boolean} Result of the
 * @private
 */
var patience = 10;
goog.events.handleEvent_ =  function(key, type) {
  // Get the arguments and remove 'key' and 'type' from it
  var args = goog.array.slice(arguments, 2);

  var listener = goog.events.listeners_[key];

  // Don't catch 'capture' events in IE, we process them manually, unless there
  // is ONLY a capture event in which case, allow it to start the propagation
  if (listener && listener.capture && !listener.src.addEventListener && // !! vpatryshev, 9/22/7 - added listener && to avoid IE errors
      goog.events.hasListener(listener.src, type, false)) {
    return undefined;
  }

  // Caught an IE event (no additional arguments)
  if ((args.length == 0 && window.event) ||
      (args.length == 1 && goog.events.isIeEvent_(args[0]))) {
    var e = args[0] || window.event;
    var evt = new goog.events.BrowserEvent(e, this);

    // Stop the propagation and handle the event stages ourselves
    evt.stopPropagation();
    evt.propagationStopped_ = false;

    // Generate ancestors
    var ancestors = [];
    for (var parent = evt.currentTarget; parent; parent = parent.parentNode) {
      ancestors.push(parent);
    }

    var retval = true;

    // Call capture listeners
    for (var i = ancestors.length - 1; !evt.propagationStopped_ && i >= 0; i--) {
      evt.currentTarget = ancestors[i];
      retval &= goog.events.fireListeners_(ancestors[i], type, true, [evt]);
    }

    // Call bubble listeners
    for (var i = 0; !evt.propagationStopped_ && i < ancestors.length; i++) {
      evt.currentTarget = ancestors[i];
      retval &= goog.events.fireListeners_(ancestors[i], type, false, [evt]);
    }

    return retval;


  // Caught a non-IE DOM event (1 additional argument which is the event object)
  } else if (args.length == 1 && goog.events.isDomEvent_(args[0])) {
    args[0] = new goog.events.BrowserEvent(args[0], this);
    return goog.events.fireListener_(listener, args);


  // Synthetic event, no need to normalize
  } else {
    return goog.events.fireListener_(listener, args);
  }
};


/**
 * Fires an object's listeners of a particular type and phase
 *
 * @param {Object} obj Object who's listeners to call
 * @param {String} type Event type
 * @param {Boolean} capture Which event phase
 * @param {Array} args Array of event arguments
 * @return {Boolean} True if all listeners returned true else false
 * @private
 */
goog.events.fireListeners_ = function(obj, type, capture, args) {
  var listeners = goog.events.getListeners(obj, type, capture);

  var retval = 1;
  for (var i = 0; i < listeners.length; i++) {
    retval &= goog.events.fireListener_(listeners[i], args) !== false;
  }

  return Boolean(retval);
};


/**
 * Fires a listener with a set of arguments
 *
 * @param {Function} listener Function to call
 * @param {Array} args Array of arguments
 * @return {Boolean} Result of listener
 * @private
 */
goog.events.fireListener_ = function(listener, args) {
  return listener.handleEvent.apply(listener, args);
};


/**
 * Takes a node, event, listener, capture flag, and handler to create a key
 * to identify the tuple in the listeners hash.
 *
 * @param {EventTarget} src The node to listen to events on
 * @param {String} type Event type
 * @param {Function} listener Callback method
 * @param {Boolean} opt_capt Fire in capture phase?
 * @param {Object} opt_handler Element in who's scope to call the listener
 * @private
 */
goog.events.createKey_ = function(src, type, listener, opt_capt, opt_handler) {
  var str = goog.getHashCode(src) + '_';
  str += type + '_';
  str += goog.getHashCode(listener) + '_';
  str += (!!opt_capt) + '_';
  if (opt_handler) {
    str += goog.getHashCode(opt_handler);
  }
  return str;
};


/**
 * Checks to see if an object is a DOM event object
 * @param {Object} e Object to test
 * @return {Boolean}
 * @private
 */
goog.events.isDomEvent_ = function(e) {
  return goog.isObject(e) && /event/i.test(e);
};


/**
 * Checks to see if an object is an IE event object by checking for the presence
 * of several proprties.  It could in theory return a false positive.
 * @param {Object} e Object to test
 * @return {Boolean}
 * @private
 */
goog.events.isIeEvent_ = function(e) {
  return goog.isObject(e) &&
         goog.isDef(e.srcElement) &&
         goog.isDef(e.cancelBubble) &&
         goog.isDef(e.type);
};


/**
 * HandleException_ is called when an exception is thrown while a
 * listener is being called. Applications should override this with
 * a specific exception handling implementation.
 * By default we just throw the error
 *
 * @throws Exception
 * @param {object} e Error object
 * @private
 */
goog.events.handleException_ = function(e) {
  throw e;
};
