// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Utilities for manipulating the browser's Document Object Model
 * Inspiration taken *heavily* from <http://mochikit.com/>
 *
 * If you want to do extensive DOM building you can create local aliases,
 * such as:<br>
 * var $DIV = goog.dom.createDom.bind(goog.dom, 'div');<br>
 * var $A = goog.dom.createDom.bind(goog.dom, 'a');<br>
 * var $TABLE = goog.dom.createDom.bind(goog.dom, 'table');<br>
 *
 *
 * It may seem weird, but goog.dom is an instance of goog.dom.DomHelper with the
 * default document.  You can use {@link goog.dom.DomHelper} to create new dom
 * helpers that refer to a different document object.  This is useful if you
 * are working with frames or multiple windows.
 *
 * @author pupius@google.com (Daniel Pupius)
 * @author arv@google.com (Erik Arvidsson)
 */


goog.provide('goog.dom');
goog.provide('goog.dom.DomHelper');
goog.provide('goog.dom.NodeType');


goog.require('goog.string');
goog.require('goog.object');
goog.require('goog.array');
goog.require('goog.math');
goog.require('goog.userAgent');


/**
 * Enumeration for DOM node types (for reference)
 * @type Object
 */
goog.dom.NodeType = {
  ELEMENT: 1,
  ATTRIBUTE: 2,
  TEXT: 3,
  CDATA_SECTION: 4,
  ENTITY_REFERENCE: 5,
  ENTITY: 6,
  PROCESSING_INSTRUCTION: 7,
  COMMENT: 8,
  DOCUMENT: 9,
  DOCUMENT_TYPE: 10,
  DOCUMENT_FRAGMENT: 11,
  NOTATION: 12
};


/**
 * This is used when calling methods that depend on a document_ instance
 * @private
 * @return {goog.dom.DomHelper}
 */
goog.dom.getDefaultDomHelper_ = function() {
  if (!goog.dom.defaultDomHelper_) {
    goog.dom.defaultDomHelper_ = new goog.dom.DomHelper;
  }
  return goog.dom.defaultDomHelper_;
};


/**
 * Get the document object being used by the dom library
 * @return {Document} Document object
 */
goog.dom.getDocument = function() {
  return goog.dom.getDefaultDomHelper_().getDocument();
};


/**
 * Alias for getElementById. If a DOM node is passed in then we just return that
 * @param {String|Node} element Element id or a DOM node.
 */
goog.dom.getElement = function(element) {
  return goog.dom.getDefaultDomHelper_().getElement(element);
};


/**
 * Alias for getElement
 * @type Function
 */
goog.dom.$ = goog.dom.getElement;


/**
 * Does a getElementsByTagName and checks class as well
 * @param {String} opt_tag Element id
 * @param {String} opt_class Optional classname
 * @param {Element} opt_el Optional element to look in
 * @return {Array} Array of elements
 */
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getDefaultDomHelper_().getElementsByTagNameAndClass(opt_tag,
                                                                      opt_class,
                                                                      opt_el);
};


/**
 * Alias for getElementsByTagNameAnd Class
 * @type Function
 */
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;


/**
 * Sets a number of properties on a node
 * @param {Element} element DOM node to set properties on
 * @param {Object} properties Hash of property:value pairs
 */
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    if (key == 'style') {
      element.style.cssText = val;
    } else {
      element[key] = val;
    }
  });
};


/**
 * Gets the dimensions of the viewport
 * @param {Window} opt_window Optional window element to test
 * @return {goog.math.Size} Object with values 'w' and 'h'
 */
goog.dom.getViewportSize = function(opt_window) {
  var win = opt_window || goog.global || window;
  var body = win.document.body;

  var w, h;
  if (win.innerWidth) {
    w = win.innerWidth;
    h = win.innerHeight;
  } else if (body && body.parentElement && body.parentElement.clientWidth) {
    w = body.parentElement.clientWidth;
    h = body.parentElement.clientHeight;
  } else if (body && body.clientWidth) {
    w = body.clientWidth;
    h = body.clientHeight;
  }
  return new goog.math.Size(w, h);
};


/**
 * Returns a dom node with a set of attributes.  This function accepts varargs
 * for subsequent nodes to be added.  Subsequent nodes will be added to the
 * first node as childNodes.
 *
 * So:
 * <code>createDom('div', null, createDom('p'), createDom('p'));</code>
 * would return a div with two child paragraphs
 *
 * @param {String} tagName Tag to create
 * @param {Object} var_args Further DOM nodes or strings for text nodes
 * @return {Element} Reference to a DOM node
 */
goog.dom.createDom = function(tagName, var_args) {
  var dh = goog.dom.getDefaultDomHelper_();
  return dh.createDom.apply(dh, arguments);
};


/**
 * Alias for createDom
 * @type Function
 */
goog.dom.$dom = goog.dom.createDom;


/**
 * Create a new element
 * @param {String} name Tag name
 * @return {Element}
 */
goog.dom.createElement = function(name) {
  return goog.dom.getDefaultDomHelper_().createElement(name);
};


/**
 * Create a new text node
 * @param {String} content Content
 * @return {Element}
 */
goog.dom.createTextNode = function(content) {
  return goog.dom.getDefaultDomHelper_().createTextNode(content);
};


/**
 * Appends a child to a node
 * @param {Node} parent Parent
 * @param {Node} child Child
 */
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child);
};


/**
 * Removes all the child nodes on a DOM node
 * @param {Node} node Node to remove children from
 */
goog.dom.removeChildren = function(node) {
  // Note: Iterations over live collections can be slow, this is the fastest
  // we could find. The double parenthesis are used to prevent JsCompiler and
  // strict warnings.
  var child;
  while ((child = node.firstChild)) {
    node.removeChild(child);
  }
};


/**
 * Removes a node from its parent
 * @param {Node} node The node to remove
 */
goog.dom.removeNode = function(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
};


/**
 * Returns the first child node that is an element.
 * @param {Node} node The node to get the first child element of
 * @return {Element}
 */
goog.dom.getFirstElementChild = function(node) {
  return goog.dom.getNextElementNode_(node.firstChild, true);
};


/**
 * Returns the last child node that is an element.
 * @param {Node} node The node to get the last child element of
 * @return {Element}
 */
goog.dom.getLastElementChild = function(node) {
  return goog.dom.getNextElementNode_(node.lastChild, false);
};


/**
 * Returns the first next sibling that is an element.
 * @param {Node} node The node to get the next sibling element of
 * @return {Element}
 */
goog.dom.getNextElementSibling = function(node) {
  return goog.dom.getNextElementNode_(node.nextSibling, true);
};


/**
 * Returns the first previous sibling that is an element.
 * @param {Node} node The node to get the previous sibling element of
 * @return {Element}
 */
goog.dom.getPreviousElementSibling = function(node) {
  return goog.dom.getNextElementNode_(node.previousSibling, false);
};


/**
 * Returns the first child node that is an element.
 * @private
 * @param {Node} node The node to get the next element from
 * @param {Boolean} forward Whether to look forwards or backwards
 * @return {Element}
 */
goog.dom.getNextElementNode_ = function(node, forward) {
  while (node && node.nodeType != goog.dom.NodeType.ELEMENT) {
    node = forward ? node.nextSibling : node.previousSibling;
  }
  return node;
};


/**
 * Whether the object looks like a DOM node
 * @param {Object} obj
 * @return {Boolean}
 */
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && obj.nodeType > 0;
};


/**
 * Whether a node contains another node
 * @param {Node} parent The node that should contain the other node
 * @param {Node} descendant The node to test presence of
 * @return {Boolean}
 */
goog.dom.contains = function(parent, descendant) {
  if (descendant == null) {
    return false;
  }
  if (parent == descendant) {
    return true;
  }
  return goog.dom.contains(parent, descendant.parentNode);
};


/**
 * Returns the owner document for a node
 * @param {Node} node The node to get the document for
 * @return {Document} The document owning the node
 */
goog.dom.getOwnerDocument = function(node) {
  // IE5 uses document instead of ownerDocument
  return node.nodeType == goog.dom.NodeType.DOCUMENT ? node :
      node.ownerDocument || node.document;
};


/**
 * Create an instance of a DOM helper with a new document object
 * @param {Document} opt_document Document object to associate with this DOM helper
 * @constructor
 */
goog.dom.DomHelper = function(opt_document) {
  /**
   * Reference to the document object to use
   * @type Document
   */
  this.document_ = opt_document || goog.global.document || document;
};


/**
 * Set the document object
 * @param {Document} document Document object
 */
goog.dom.DomHelper.prototype.setDocument = function(document) {
  this.document_ = document;
};


/**
 * Get the document object being used by the dom library
 * @return {Document} Document object
 */
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_;
};


/**
 * Alias for getElementById. If a DOM node is passed in then we just return that
 * @param {String|Node} element Element id or a DOM node.
 */
goog.dom.DomHelper.prototype.getElement = function(element) {
  if (goog.isString(element)) {
    return this.document_.getElementById(element);
  } else {
    return element;
  }
};


/**
 * Alias for getElement
 * @type Function
 */
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;


/**
 * Does a getElementsByTagName and checks class as well
 * @param {String} opt_tag Element id
 * @param {String} opt_class Optional classname
 * @param {Element} opt_el Optional element to look in
 * @return {Array} Array of elements
 */
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag,
                                                                     opt_class,
                                                                     opt_el) {

  var tag = opt_tag || '*';
  var parent = opt_el || this.document_;

  var els = parent.getElementsByTagName(tag);

  if (opt_class) {
    return goog.array.filter(els, function(el) {
      return goog.array.contains(el.className.split(' '), opt_class);
    });

  } else {
    return els;
  }
};


/**
 * Alias for getElementsByTagNameAnd Class
 * @type Function
 */
goog.dom.DomHelper.prototype.$$ =
    goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;


/**
 * Sets a number of properties on a node
 * @param {Element} element DOM node to set properties on
 * @param {Object} properties Hash of property:value pairs
 */
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;


/**
 * Gets the dimensions of the viewport
 * @param {Window} opt_window Optional window element to test
 * @return {goog.math.Size} Object with values 'w' and 'h'
 */
goog.dom.DomHelper.prototype.getViewportSize = goog.dom.getViewportSize;


/**
 * Returns a dom node with a set of attributes.  This function accepts varargs
 * for subsequent nodes to be added.  Subsequent nodes will be added to the
 * first node as childNodes.
 *
 * So:
 * <code>createDom('div', null, createDom('p'), createDom('p'));</code>
 * would return a div with two child paragraphs
 *
 * @param {String} tagName Tag to create
 * @param {Object} opt_attributes Map of name-value pairs for attributes
 * @param {Object} var_args Further DOM nodes or strings for text nodes
 * @return {Element} Reference to a DOM node
 */
goog.dom.DomHelper.prototype.createDom = function(tagName,
                                                  opt_attributes,
                                                  var_args) {

  // Internet Explorer is dumb: http://msdn.microsoft.com/workshop/author/
  //                            dhtml/reference/properties/name_2.asp
  if (goog.userAgent.IE && opt_attributes && opt_attributes.name) {
    tagName = '<' + tagName + ' name="' +
              goog.string.htmlEscape(opt_attributes.name) + '">';
  }

  var element = this.createElement(tagName);

  if (opt_attributes) {
    goog.dom.setProperties(element, opt_attributes);
  }

  if (arguments.length > 2) {
    var args = goog.array.slice(arguments, 2);
    for (var i = 0; i < args.length; i++) {
      // TODO(pupius): More coercion, ala MochiKit?
      if (goog.isString(args[i])) {
        this.appendChild(element, this.createTextNode(args[i]));
      } else {
        this.appendChild(element, args[i]);
      }
    }
  }

  return element;
};


/**
 * Alias for createDom
 * @type Function
 */
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;


/**
 * Create a new element
 * @param {String} name Tag name
 * @return {Element}
 */
goog.dom.DomHelper.prototype.createElement = function(name) {
  return this.document_.createElement(name);
};


/**
 * Create a new text node
 * @param {String} content Content
 * @return {Element}
 */
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(content);
};


/**
 * Appends a child to a node
 * @param {Node} parent Parent
 * @param {Node} child Child
 */
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;


/**
 * Removes all the child nodes on a DOM node
 * @param {Node} node Node to remove children from
 */
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;


/**
 * Removes a node from its parent
 * @param {Node} node The node to remove
 */
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;


/**
 * Returns the first child node that is an element.
 * @param {Node} node The node to get the first child element of
 * @return {Element}
 */
goog.dom.DomHelper.prototype.getFirstElementChild =
    goog.dom.getFirstElementChild;


/**
 * Returns the last child node that is an element.
 * @param {Node} node The node to get the last child element of
 * @return {Element}
 */
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;


/**
 * Returns the first next sibling that is an element.
 * @param {Node} node The node to get the next sibling element of
 * @return {Element}
 */
goog.dom.DomHelper.prototype.getNextElementSibling =
    goog.dom.getNextElementSibling;


/**
 * Returns the first previous sibling that is an element.
 * @param {Node} node The node to get the previous sibling element of
 * @return {Element}
 */
goog.dom.DomHelper.prototype.getPreviousElementSibling =
    goog.dom.getPreviousElementSibling;


/**
 * Whether the object looks like a DOM node
 * @param {Object} obj
 * @return {Boolean}
 */
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;


/**
 * Whether a node contains another node
 * @param {Node} parent The node that should contain the other node
 * @param {Node} descendant The node to test presence of
 * @return {Boolean}
 */
goog.dom.DomHelper.prototype.contains = goog.dom.contains;


/**
 * Returns the owner document for a node
 * @param {Node} node The node to get the document for
 * @return {Document} The document owning the node
 */
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
