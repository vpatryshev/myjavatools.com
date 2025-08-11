// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Class for rendering the results of an auto complete and
 * allow the user to select an row
 *
 * @author pupius@google.com (Daniel Pupius)
 */

goog.provide('goog.ui.AutoComplete.Renderer');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.structs');
goog.require('goog.events.EventTarget');
goog.require('goog.userAgent');
goog.require('goog.string');

/**
 * Class for rendering the results of an auto-complete in a drop down list.
 * @constructor
 * @extends goog.events.EventTarget
 */
goog.ui.AutoComplete.Renderer = function(opt_parentNode, opt_customRenderer,
    opt_rightAlign) {
  
  /**
   * Reference to the parent element that will hold the autocomplete elements
   * @type Element
   * @private
   */
  this.parent_ = opt_parentNode || goog.dom.getDocument().body;
  
  /**
   * Whether to reposition the autocomplete UI below the target node
   * @type Boolean
   * @private
   */
  this.reposition_ = !opt_parentNode;
  
  /**
   * Reference to the main element that controls the rendered autocomplete
   * @type Element
   * @private
   */
  this.element_ = null;
  
  /**
   * The current token that has been entered
   * @type String
   * @private
   */
  this.token_ = '';
  
  /**
   * Array used to store the current set of rows being displayed
   * @type Aray
   * @private
   */
  this.rows_ = [];
  
  /**
   * The index of the currently highlighted row
   * @type Number
   */
  this.hilitedRow_ = -1;
  
  /**
   * Store the current state for the renderer
   * @type Boolean
   */
  this.visible_ = false;
  
  /**
   * Classname for the main element
   * @type String
   */
  this.className = 'ac-renderer';
  
  /**
   * Classname for row divs
   * @type String
   */
  this.rowClassName = 'ac-row';
  
  /**
   * Classname for active row div.
   * Active row will have rowClassName & activeClassName
   * @type String
   */
  this.activeClassName = 'active';
  
  /**
   * Event name for highlighting a row
   * @type String
   */
  this.HILITE = 'hilite';

  /**
   * Event name for selecting a row
   * @type String
   */
  this.SELECT = 'select';
  
   /**
   * Custom full renderer
   * @type Function
   */
   this.customRenderer_ = opt_customRenderer;

   /**
   * Determines if the autocomplete will always be right aligned
   * @type Boolean
   */
   this.rightAlign_ = (opt_rightAlign != null) ? opt_rightAlign : false;
  
};
goog.ui.AutoComplete.Renderer.inherits(goog.events.EventTarget);

/**
 * Render the autocomplete UI
 * 
 * @param {Array} rows Matching UI rows
 * @param {String} token Token we are currently matching against
 * @param {Node} opt_target Current HTML node, will position popup beneath this node
 */
goog.ui.AutoComplete.Renderer.prototype.renderRows = function(rows, token,
    opt_target) {
  this.token_ = token;
  this.rows_ = rows;
  this.hilitedRow_ = 0;
  this.target_ = opt_target;
  this.rowDivs_ = [];
  this.redraw();
};


goog.ui.AutoComplete.Renderer.prototype.dismiss = function() {
  this.visible_ = false;
  goog.style.setStyle(this.element_, 'display', 'none');
};

goog.ui.AutoComplete.Renderer.prototype.show = function() {
  this.visible_ = true;
  goog.style.setStyle(this.element_, 'display', 'block');
};


goog.ui.AutoComplete.Renderer.prototype.isVisible = function() {
  return this.visible_;
};


/**
 * Sets the 'active' class of the nth item.
 * @param {Number} index Index of the item to highlight
 */
goog.ui.AutoComplete.Renderer.prototype.hiliteRow = function(index) {
  if (index >= 0 && index < this.element_.childNodes.length) {
    if (this.hilitedRow_ >= 0) {
      goog.dom.classes.remove(this.rowDivs_[this.hilitedRow_],
          this.activeClassName);
    }
    goog.dom.classes.add(this.rowDivs_[index], this.activeClassName);
    this.hilitedRow_ = index;
  }
};


goog.ui.AutoComplete.Renderer.prototype.hiliteId = function(id) {
  for (var i = 0; i < this.rows_.length; i++) {
    if (this.rows_[i].id == id) {
      this.hiliteRow(i);
      return;
    }
  }  
};


/**
 * Redraw (or draw if this is the first call) the rendered auto-complete drop
 * down
 */
goog.ui.AutoComplete.Renderer.prototype.redraw = function() { 
  // If the main HTML element hasn't been made yet, create it and append it
  // to the parent. 
  if (!this.element_) {
    // Make element and add it to the parent
    this.element_ = goog.dom.createElement('div');
    goog.dom.classes.add(this.element_, this.className);
    goog.dom.appendChild(this.parent_, this.element_);
    
    // Add this object as an event handler
    goog.events.listen(this.element_, goog.events.types.CLICK, 
                       this.handleClick_, false, this);
    goog.events.listen(this.element_, goog.events.types.MOUSEOVER,
                       this.handleMouseOver_, false, this);
  }
  
  // Remove the current child nodes
  this.rowDivs_.length = 0;
  goog.dom.removeChildren(this.element_);
  
  // Generate the new rows (use forEach so we can change rows_ from an
  // array to a different datastructure if required)
  if (this.customRenderer_ && this.customRenderer_.render) {
    this.customRenderer_.render(this, this.element_, this.rows_, this.token_);
  } else {
    goog.structs.forEach(this.rows_, function(row) {
      goog.dom.appendChild(this.element_, this.renderRowHtml(row, this.token_));
    }, this);
  }

  // Don't show empty result sets
  if (this.rows_.length == 0) {
    this.dismiss();
  } else {
    this.show();
  }

  // Fix bug on Firefox on Mac where scrollbars can show through a floating div
  this.preventMacScrollbarResurface_(this.element_);

  // Reposition below the location node, if exists
  if (this.target_ && this.reposition_) {
    var topLeft = goog.style.getPageOffset(this.target_);
    var locationNodeSize = goog.style.getSize(this.target_);
    var viewSize = goog.style.getSize(goog.style.getClientViewportElement());
    var elSize = goog.style.getSize(this.element_);
    topLeft.y = locationNodeSize.height + topLeft.y;
    // If past right edge of screen, align with right side of location node
    if (this.rightAlign_ || topLeft.x + elSize.width > viewSize.width) {
      topLeft.x = topLeft.x + locationNodeSize.width - elSize.width;
    }
    goog.style.setPageOffset(this.element_, topLeft);
  }
};


/**
 * Prevents scrollbars that are below the node from resurfacing through the
 * node. This is a known bug in Firefox on Mac.
 *
 * @param {Node} node The node to prevent scrollbars from resurfacing through
 * @private
 */
goog.ui.AutoComplete.Renderer.prototype.preventMacScrollbarResurface_ = 
    function(node) {
  if(goog.userAgent.GECKO
      && goog.string.contains(goog.userAgent.PLATFORM, "Mac")) {
    node.style.width = "";
    node.style.overflow = "visible";
    node.style.width = node.offsetWidth;
    node.style.overflow = "auto";
  }
};


/**
 * Generic function that takes a row and renders a DOM structure for that row,
 * highlighting the token.
 * 
 * Normally this will only be matching a maximum of 20 or so items.  Even with
 * 40 rows, DOM this building is fine.
 * 
 * @param {Object} row Object representing row
 * @param {String} token Token to highlight
 * @param {Node} node The node to render into
 * @private
 */
goog.ui.AutoComplete.Renderer.prototype.renderRowContents_ = 
    function(row, token, node) {
  node.innerHTML = goog.string.htmlEscape(row.data.toString());
};


/**
 * Goes through a node an all of it's child nodes, replacing HTML text that
 * matches a token with <b>token</b>
 * 
 * @param {Node} node Node to match
 * @param {String} token Token to match
 */
goog.ui.AutoComplete.Renderer.prototype.hiliteMatchingText_ =
    function(node, token) {
  if (node.nodeType == goog.dom.NodeType.TEXT) {
    var text = node.nodeValue;
    token = goog.string.regExpEscape(token);
    // Create a regular expression to match a token at the beginning of a line 
    // or preceeded by non-alpha-numeric characters
    var re = new RegExp('(.*?)(^|\\W+)(' + token + ')', 'gi');
    var textNodes = [];
    var lastIndex = 0;
    
    // Find all matches
    // Note: text.split(re) has inconsistencies between IE and FF, so
    // manually recreated the logic
    var match = re.exec(text);
    while (match) {
      textNodes.push(match[1]);
      textNodes.push(match[2]);
      textNodes.push(match[3]);
      lastIndex = re.lastIndex;
      match = re.exec(text);
    }
    textNodes.push(text.substring(lastIndex));
    
    // Replace the tokens with bolded text
    if (textNodes.length > 1) {
      node.nodeValue = textNodes[0] + textNodes[1];
      var boldTag = goog.dom.createElement('b');
      goog.dom.appendChild(boldTag, goog.dom.createTextNode(textNodes[2]));
      boldTag = node.parentNode.insertBefore(boldTag, node.nextSibling);
      for (var i = textNodes.length - 1; i >= 3 ; i--) {
        node.parentNode.insertBefore(goog.dom.createTextNode(textNodes[i]),
            boldTag.nextSibling);
      }
    }
  } else {
     var child = node.firstChild;
     while (child) {
       var nextChild = child.nextSibling;
       this.hiliteMatchingText_(child, token);
       child = nextChild;
     }
  }
}


/**
 * Render a row by creating a div and then calling row rendering callback or
 * default row handler
 * 
 * @param {Object} row Object representing row
 * @param {String} token Token to highlight
 */
goog.ui.AutoComplete.Renderer.prototype.renderRowHtml = function(row, token) {
      
  // Create and return the node
  var node = goog.dom.createDom('div', {className: this.rowClassName});
  if (this.customRenderer_ && this.customRenderer_.renderRow) {
    this.customRenderer_.renderRow(row, token, node)
  } else {
    this.renderRowContents_(row, token, node);
  }
  
  this.hiliteMatchingText_(node, token);
  
  goog.dom.classes.add(node, this.rowClassName);
  this.rowDivs_.push(node);
  return node;
}


/**
 * Given an event target looks up through the parents till it finds a div.  Once
 * found it will then look to see if that is one of the childnodes, if it is 
 * then the index is returned, otherwise -1 is returned.
 * @param {Element} t HtmlElement
 * @return {Number} Index corresponding to event target
 */
goog.ui.AutoComplete.Renderer.prototype.getRowFromEventTarget_ = function(et) {
  while (et && et.tagName != 'DIV' &&
      !goog.dom.classes.has(et, this.rowClassName)) {
    et = et.parentNode;
  }
  return et ? goog.array.indexOf(this.rowDivs_, et) : -1;
};


/**
 * Handle the click events.  These are redirected to the AutoComplete object
 * which then makes a callback to select the correct row. 
 * @param {goog.events.Event} e Browser event object
 */
goog.ui.AutoComplete.Renderer.prototype.handleClick_ = function(e) {
  var index = this.getRowFromEventTarget_(e.target);
  if (index >= 0) {
    this.dispatchEvent( { type: this.SELECT, row: this.rows_[index].id } );
  }
};


/**
 * Handle the mousing events.  These are redirected to the AutoComplete object
 * which then makes a callback to set the correctly highlighted row.  This is
 * because the AutoComplete can move the focus as well, and there is no sense
 * duplicating the code
 * @param {goog.events.Event} e Browser event object
 */
goog.ui.AutoComplete.Renderer.prototype.handleMouseOver_ = function(e) {
  var index = this.getRowFromEventTarget_(e.target);
  if (index >= 0) {
    this.dispatchEvent( { type: this.HILITE, row: this.rows_[index].id } );
  }
};


