// Copyright 2006 Google Inc.
// All Rights Reserved

/**
 * @fileoverview
 * XML utilities
 *
 * @author uidude@google.com (Evan Gilbert)
 */

goog.provide('goog.dom.xml');


/**
 * Creates an XML document appropriate for the current JS runtime
 * @param {String} opt_rootTagName The root tag name
 * @param {String} opt_namespaceUri Namespace URI of the document element
 * @return {Document} The new document
 */
goog.dom.xml.createDocument = function(opt_rootTagName, opt_namespaceUri) {
  if (opt_namespaceUri && !opt_rootTagName) {
    throw Error("Can't create document with namespace and no root tag");
  }
  if (document.implementation && document.implementation.createDocument) {
    return document.implementation.createDocument(opt_namespaceUri || '',
                                                  opt_rootTagName || '',
                                                  null)
  } else if (typeof ActiveXObject != 'undefined') {
    var doc = new ActiveXObject('MSXML2.DOMDocument');
    if (doc) {
      if (opt_rootTagName) {
        doc.appendChild(doc.createNode(goog.dom.NodeType.ELEMENT,
                                       opt_rootTagName,
                                       opt_namespaceUri || ''));
      }
      return doc;
    }
  }
  throw Error('Your browser does not support creating new documents');
};



/**
 * Creates an XML document from a string
 * @param {String} xml The text
 * @return {Document} XML document from the text
 */
goog.dom.xml.loadXml = function(xml) {
  if (typeof DOMParser != 'undefined') {
    return new DOMParser().parseFromString(xml, 'application/xml');
  } else {
    var doc = new ActiveXObject("MSXML2.DOMDocument");
    doc.loadXML(xml);
    return doc;
  }
};


/**
 * Selects a single node using an Xpath expression and a root node
 * @param {Node} node The root node
 * @param {String} path Xpath selector
 * @return {Node} The selected node, or null if no matching node
 */
goog.dom.xml.selectSingleNode = function(node, path) {
  if (typeof node.selectSingleNode != 'undefined') {
    var doc = goog.dom.getOwnerDocument(node);
    if (typeof doc.setProperty != 'undefined') {
      doc.setProperty("SelectionLanguage", "XPath");
    }
    return node.selectSingleNode(path);
  } else if (document.implementation.hasFeature("XPath", "3.0") ) { 
    var doc = goog.dom.getOwnerDocument(node);
    var resolver = doc.createNSResolver(doc.documentElement);
    var result = doc.evaluate(path, node, resolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
  }
}


/**
 * Selects multiple nodes using an Xpath expression and a root node
 * @param {Node} node The root node
 * @param {String} path Xpath selector
 * @return {NodeSet} The selected nodes, or empty array if no matching nodes
 */
goog.dom.xml.selectNodes = function(node, path) {
  if (typeof node.selectNodes != 'undefined') {
    var doc = goog.dom.getOwnerDocument(node);
    if (typeof doc.setProperty != 'undefined') {
      doc.setProperty("SelectionLanguage", "XPath");
    }
    return node.selectNodes(path);
  } else if (document.implementation.hasFeature("XPath", "3.0") ) { 
    var doc = goog.dom.getOwnerDocument(node);
    var resolver = doc.createNSResolver(doc.documentElement);
    var nodes = doc.evaluate(path, node, resolver,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var results = [];
    var count = nodes.snapshotLength;
    for (var i = 0; i < count; i++) {
      results.push(nodes.snapshotItem(i));
    }
    return results;
  } else {
   return [];
  }
}

