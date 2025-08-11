// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Utilities for adding, removing and setting classes.
 *
 * @author pupius@google.com (Daniel Pupius)
 * @author arv@google.com (Erik Arvidsson)
 */


goog.provide('goog.dom.classes');


goog.require('goog.array');


/**
 * Sets the entire classname of an element
 * @param {Element} element DOM node to set class of
 * @param {String} className Class name(s)
 */
goog.dom.classes.set = function(element, className) {
  element.className = className;
};


/**
 * Gets an array of classnames on an element
 * @param {Element} element DOM node to get class of
 * @return {Array} Classnames
 */
goog.dom.classes.get = function(element) {
  return element.className.split(' ');
};


/**
 * Adds a class or classes to an element
 * @param {Element} element DOM node to add class to
 * @param {String} var_args Class names
 * @return {Boolean} Whether class was added (or all classes were added)
 */
goog.dom.classes.add = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);

  var rv = 1;

  for (var i = 0; i < args.length; i++) {
    if (classes.length == 0) {
      element.className = arguments[i];
      rv &= 1;

    } else if (!goog.array.contains(classes, args[i])) {
      classes.push(args[i]);
      element.className = classes.join(' ');
      rv &= 1;

    } else {
      rv &= 0;
    }
  }

  return Boolean(rv);
};


/**
 * Removes a class or classes from an element
 * @param {Element} element DOM node to remove class from
 * @param {String} var_args Class name
 * @return {Boolean} Whether class was removed
 */
goog.dom.classes.remove = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);

  var rv = 0;
  for (var i = 0; i < classes.length; i++) {
    if (goog.array.contains(args, classes[i])) {
      goog.array.splice(classes, i--, 1);
      rv++;
    }
  }
  element.className = classes.join(' ');

  return rv == args.length;
};


/**
 * Switches a class on an element from one to another without disturbing other
 * classes.  If the fromClass isn't removed the toClass won't be added
 * @param {Element} element DOM node to swap classes on
 * @param {String} fromClass Class to remove
 * @param {String} toClass Class to add
 * @return {Boolean} Whether classes were switched
 */
goog.dom.classes.swap = function(element, fromClass, toClass) {
  var removed = goog.dom.classes.remove(element, fromClass);
  if (removed) {
    goog.dom.classes.add(element, toClass);
  }

  return removed;
};


/**
 * Returns true if an element has a class
 * @param {Element} element DOM node to test
 * @param {String} className Classname to test for
 * @return {Boolean} If element has the class
 */
goog.dom.classes.has = function(element, className) {
  return goog.array.contains(goog.dom.classes.get(element), className);
};


/**
 * If an element has a class it will remove it, if it doesn't have it it will
 * add it.  Won't affect other classes on the node.
 * @param {Element} element DOM node to toggle class on
 * @param {String} className Class to toggle
 * @returns {Boolean} True if class was added, false if it was removed
 * (basically whether element has the class after this function has been
 * called)
 */
goog.dom.classes.toggle = function(element, className) {
  if(goog.dom.classes.has(element, className)) {
    goog.dom.classes.remove(element, className);
    return false;
  } else {
    goog.dom.classes.add(element, className);
    return true;
  }
};
