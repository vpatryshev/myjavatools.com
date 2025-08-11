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
 * @supported So far tested in IE6 and FF1.5
 */

// TODO: Handle PreventDefault properly on custom events and add to EventTarget


/**
 * Namespace for events
 */
goog.provide('goog.events');

/**
 * Dependencies
 * @requires goog.events.Event
 * @requires goog.events.Listener
 * @requires goog.array
 */
goog.require('goog.events.Event');
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
goog.events.keys_ = {};

 
/**
 * Adds an event listener for a specific event on a DomNode or an object that 
 * has implemented {@link goog.events.EventTarget}
 *
 * @param {EventTarget} src The node to listen to events on
 * @param {String|Array} type Event type or array of event types
 * @param {Function} listener Callback method
 * @param {Boolean} opt_capt Fire in capture phase?
 * @param {Object} opt_handler Element in who's scope to call the listener
 */
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      goog.events.listen(src, type[i], listener, opt_capt, opt_handler);
    }
    return;
  }
  
  var key = goog.events.createKey_(src, type, listener, opt_capt, opt_handler);

  // addEventListener does not allow multiple listeners
  if (key in goog.events.listeners_) {
    return key;
  }
  
  // create a lookup so we can find the listeners for a particular object
  var hc = goog.getHashCode(src);
  if (!goog.isArray(goog.events.keys_[hc])) goog.events.keys_[hc] = [];
  goog.events.keys_[hc].push(key);  
  
  // use bind for currentTarget
  var proxy = goog.events.handleEvent_.bind(src, key, type);
  goog.events.listeners_[key] = new goog.events.Listener(listener,  proxy, src,
                                                         type, opt_capt, 
                                                         opt_handler);

  if (src.addEventListener) {
    if (!src.customEvent_) {
      src.addEventListener(type, proxy, opt_capt);
    }
  } else if (src.attachEvent) {
    src.attachEvent("on" + type, proxy);
  } else {
    throw new Error("Object {" + src + "} does not support event listeners.");
  }

  return key;
};


/**
 * Removes an event listener which was added with listen().
 *
 * @param node {Element} The node to stop listening to events on
 * @param event {String} The name of the event without the "on" prefix
 * @param listener {Function} The listener function to remove
 * @param opt_useCapture {Boolean} In DOM-compliant browsers, this determines
 *                                 whether the listener is fired during the
 *                                 capture or bubble phase of the event.
 * @return {Boolean} indicating whether the listener was there to remove
 */
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  var key = goog.events.createKey_(src, type, listener, opt_capt, opt_handler);
  
  if (!(key in goog.events.listeners_)) {
    return false;
  }
  var proxy = goog.events.listeners_[key].proxy;

  if (src.removeEventListener) {
    src.removeEventListener(type, proxy, opt_capt);
  } else if (src.detachEvent) {
    src.detachEvent("on" + type, proxy);
  }

  delete goog.events.listeners_[key];
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
  // TODO: Use an iterator once they work on objects, this will avoid the
  // code replication here.  Can't use for...in on the array 'cause you end off
  // seeing Array.peek
  
  var count = 0;
  
  if (opt_obj) {
    var listeners = goog.events.getListeners(opt_obj, opt_type, opt_capt);
    for (var i = 0; i < listeners.length; i++) {
      var item = listeners[i];
      
      if (item.src.removeEventListener) {
        item.src.removeEventListener(item.type, item.proxy, item.capture);
      } else if (item.src.detachEvent) {
        item.src.detachEvent("on" + item.type, item.proxy);
      }
    
      delete goog.events.listeners_[goog.events.createKey_(item.src,
                                                           item.type, 
                                                           item.listener, 
                                                           item.capture,
                                                           item.handler)];
      count++;
    }
      
  } else {
    for (var key in goog.events.listeners_) {
      var item = goog.events.listeners_[key];
      
      if (item.src.removeEventListener) {
        item.src.removeEventListener(item.type, item.proxy, item.capture);
      } else if (item.src.detachEvent) {
        item.src.detachEvent("on" + item.type, item.proxy);
      }
      
      delete goog.events.listeners_[key];
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
goog.events.getListeners = function(obj, opt_type, opt_capt) {
  var hc = goog.getHashCode(obj);
  if (!(hc in goog.events.keys_)) {
    return [];
  }

  var keys = goog.events.keys_[hc];  
  var listeners = [];
  
  for (var key in goog.events.listeners_) {
    var listener = goog.events.listeners_[key];
    if (goog.array.contains(keys, key) && 
        (!goog.isDef(opt_type) || listener.type == opt_type) && 
        (!goog.isDef(opt_capt) || listener.capture == opt_capt)) {
      listeners.push(listener);
    }
  }

  return listeners;
};


/**
 * Returns true if an object has a listener matching the type and capture phase
 * @param {Object} obj Object to get listeners for
 * @param {String} opt_type Event type
 * @param {Boolean} opt_capt Capture phase?
 * @return {Boolean} 
 */
goog.events.hasListener = function(obj, opt_type, opt_capt) {
  var hc = goog.getHashCode(obj);
  if (!(hc in goog.events.keys_)) {
    return false;
  }

  var keys = goog.events.keys_[hc];  
  
  for (var key in goog.events.listeners_) {
    var listener = goog.events.listeners_[key];
    if (goog.array.contains(keys, key) && 
        (!goog.isDef(opt_type) || listener.type == opt_type) && 
        (!goog.isDef(opt_capt) || listener.capture == opt_capt)) {
      return true;
    }
  }

  return false
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
goog.events.handleEvent_ =  function(key, type) {
  
  // Get the arguments and remove 'key' and 'type' from it
  var args = goog.array.slice(arguments, 2);
  
  var listener = goog.events.listeners_[key];
  
  // Don't catch 'capture' events in IE, we process them manually, unless there 
  // is ONLY a capture event in which case, allow it to start the propagation
  if (listener.capture && !listener.src.addEventListener && 
      goog.events.hasListener(listener.src, type, false)) {
    return;
  }
  
  // Caught an IE event (no additional arguments)
  if ((args.length == 0 && window.event) || 
      (args.length == 1 && goog.events.isIeEvent_(args[0]))) {
    var evt = new goog.events.Event(window.event, this);
  
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
    args[0] = new goog.events.Event(args[0], this);
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
  
  var retval = true;
  for (var i = 0; i < listeners.length; i++) {
    retval &= goog.events.fireListener_(listeners[i], args);
  }
  
  return retval;
}


/**
 * Fires a listener with a set of arguments, catching an error if it occurs.
 * 
 * @param {Function} listener Function to call
 * @param {Array} args Array of arguments
 * @return {Boolean} Result of listener or undefined if there was an error
 * @private
 */
goog.events.fireListener_ = function(listener, args) {
  // Apply the listener in the context of the handler, or default to source
  return listener.listener.apply(listener.handler || listener.src, args);
}


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
