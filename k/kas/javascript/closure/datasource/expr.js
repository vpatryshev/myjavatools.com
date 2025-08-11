// Copyright 2006 Google Inc.
// All Rights Reserved

/**
 * @fileoverview
 * Expression evaluation utilities. Expression format is very similar to XPath.
 * 
 * Expression details:
 * - Of format A/B/C, which will evaluate getChildNode('A').getChildNode('B').
 *    getChildNodes('C')|getChildNodeValue('C')|getChildNode('C') depending on
 *    call
 * - If expression ends with '/name()', will get the name() of the node
 *    referenced by the preceding path.
 * - If expression ends with '/count()', will get the count() of the nodes that
 *    match the expression referenced by the preceding path.
 * - If expression ends with '?', the value is OK to evaluate to null. This is
 *    not enforced by the expression evaluation functions, instead it is
 *    provided as a flag for client code which may ignore depending on usage
 * - If expression has [INDEX], will use getChildNodes().getByIndex(INDEX)
 * 
 * @author uidude@google.com (Evan Gilbert)
 */


goog.provide('goog.ds.Expr');

goog.require('goog.string');


/**
 * Create a new expression. An expression uses a string expression language, and
 * from this string and a passed in DataNode can evaluate to a value, DataNode,
 * or a DataNodeList.
 * 
 * @param {String} expr The string expression.
 * @constructor
 */
goog.ds.Expr = function(expr) {
  this.setSource_(expr);
};


/**
 * Set the source expression text & parse
 * 
 * @param {String} expr The string expression source
 */
goog.ds.Expr.prototype.setSource_ = function(expr) {
   this.src_ = expr;
  
  // Check whether it can be empty
  if (goog.string.endsWith(expr, goog.ds.Expr.STR_CAN_BE_EMPTY_)) {
    this.canBeEmpty_ = true;
    expr = expr.substring(0, expr.length - 1);
  }

  // Check whether this is an node functino
  if (goog.string.endsWith(expr, goog.ds.Expr.STR_NAME_EXPR_) ||
      goog.string.endsWith(expr, goog.ds.Expr.STR_COUNT_EXPR_) ||
      goog.string.endsWith(expr, goog.ds.Expr.STR_POSITION_EXPR_)){
    var lastPos = expr.lastIndexOf(goog.ds.Expr.STR_SEPARATOR_);
    if (lastPos != -1) {
      this.exprFn_ = expr.substring(lastPos + 1);
      expr = expr.substring(0, lastPos);
    } else {
      this.exprFn_ = expr;
      expr = goog.ds.Expr.STR_CURRENT_NODE_EXPR_;
    }
  }
  
  // Split into component parts
  this.parts_ = expr.split(goog.ds.Expr.STR_SEPARATOR_);
  this.size_ = this.parts_.length;
  this.root_ = this.parts_[0];
  this.last_ = this.parts_[this.size_ - 1];
  
  // Check for an index on the root node
  var indexPos = this.root_.indexOf(goog.ds.Expr.STR_INDEX_START_);
  if (indexPos != -1) {
    this.hasIndex_ = true;
    this.index_ = Number(this.root_.substring(indexPos + 1, 
        this.root_.indexOf(goog.ds.Expr.STR_INDEX_END_)));
    this.root_ = this.root_.substring(0, indexPos);
  }

  // Check whether expression maps to current node, for conventience
  this.isCurrent_ = (expr == goog.ds.Expr.STR_CURRENT_NODE_EXPR_ ||
      expr == goog.ds.Expr.STR_EMPTY_EXPR_);
  
  // Whether this expression is just an attribute (i.e. '@foo')
  this.isJustAttribute_ = 
      goog.string.startsWith(expr, goog.ds.Expr.STR_ATTRIBUTE_START_);
      
  // Whether this expression evaluates to an attribute
  this.isAttribute_ = goog.string.startsWith(this.last_,
      goog.ds.Expr.STR_ATTRIBUTE_START_);

  // Get the attribute name
  if (this.isAttribute_) 
    this.attributeName_ = this.last_.substring(1);
    
  // Check whether this is a common node expression
  this.isAllChildNodes_ = expr == goog.ds.Expr.STR_ALL_CHILD_NODES_EXPR_;
  this.isAllAttributes_ = expr == goog.ds.Expr.STR_ALL_ATTRIBUTES_EXPR_;
  this.isAllElements_ = expr == goog.ds.Expr.STR_ALL_ELEMENTS_EXPR_;
  
  // Set the next expression for recursive evaluation
  if (this.size_ > 1) {
    this.nextExpr = goog.ds.Expr.create(
        this.parts_.slice(1).join(goog.ds.Expr.STR_SEPARATOR_));
  } 
}


/**
 * Evaluate an expression on a data node, and return a value
 * Recursively walks through child nodes to evaluate
 * TODO(uidude) Support other expression functions
 * 
 * @param (goog.ds.DataNode) opt_ds Optional datasource to evaluate against.
 *     If not provided, evaluates against DataManager global root
 * @return {Object} Value of the node, or null if doesn't exist
 */
goog.ds.Expr.prototype.getValue = function(opt_ds) {
  if (opt_ds == null)
    opt_ds = goog.ds.DataManager.getInstance();
    
  if (this.exprFn_ == goog.ds.Expr.STR_COUNT_EXPR_) {
    var nodeCount = this.getNodes(opt_ds);
    return nodeCount.getCount();
  }
    
  var paths = this.parts_;
  
  if (paths.length == 0) {
    return opt_ds.get(); 
  } else if (paths.length == 1) {
    return opt_ds.getChildNodeValue(this.root_);
  }
  
  var nextDs = opt_ds.getChildNode(this.root_);
  if (this.hasIndex_ && nextDs) {
    nextDs = nextDs.getChildNodes().getByIndex(this.index_);
  }
  
  if (nextDs == null) {
    return null;
  } else {
    return this.nextExpr.getValue(nextDs);
  }
};


/**
 * Evaluate an expression on a data node, and return matching nodes
 * Recursively walks through child nodes to evaluate
 * 
 * @param (goog.ds.DataNode) opt_ds Optional datasource to evaluate against.
 *     If not provided, evaluates against DataManager global root
 * @return {DataNodeList} Matching nodes
 */
goog.ds.Expr.prototype.getNodes = function(opt_ds) {
  return this.getNodes_(opt_ds, false);
}


/**
 * Evaluate an expression on a data node, and return the first matching node
 * Recursively walks through child nodes to evaluate
 * 
 * @param (goog.ds.DataNode) opt_ds Optional datasource to evaluate against.
 *     If not provided, evaluates against DataManager global root
 * @return {DataNode} Matching nodes, or null if doesn't exist
 */
goog.ds.Expr.prototype.getNode = function(opt_ds) {
  return this.getNodes_(opt_ds, true);
};


/**
 * Evaluate an expression on a data node, and return the first matching node
 * Recursively walks through child nodes to evaluate
 * 
 * @param (goog.ds.DataNode) opt_ds Optional datasource to evaluate against.
 *     If not provide, evaluates against DataManager global root
 * @param (Boolean) opt_selectOne Whether to return single matching DataNode
 *     or matching nodes in DataNodeList
 * @return {DataNode|DataNodeList} Matching node/nodes
 */
goog.ds.Expr.prototype.getNodes_ = function(opt_ds, opt_selectOne) {
  if (opt_ds == null)
    opt_ds = goog.ds.DataManager.getInstance();

  if (this.size_ == 0 && opt_selectOne) {
      return opt_ds;
  } else if (this.size_ == 0 && !opt_selectOne) {
    return new goog.ds.BasicNodeList([opt_ds]);
  } else if (this.size_ == 1 && this.hasIndex_) {
    var node = opt_ds.getChildNode(this.root_);
    var target = node.getChildNodes().getByIndex(this.index_);
    if (opt_selectOne) {
      return target;
    }
    else {
      return new goog.ds.BasicNodeList([target]);
    }
  } else if (this.size_ == 1 && !this.hasIndex_) {
    if (opt_selectOne) {
      return opt_ds.getChildNode(this.root_);
    }
    else {
      return opt_ds.getChildNodes(this.root_);
    }
  } else {
    var nextDs = opt_ds.getChildNode(this.root_);
    if (this.hasIndex_ && nextDs) {
      nextDs = nextDs.getChildNodes().getByIndex(this.index_);
    }
    if (nextDs == null && opt_selectOne) {
      return null;
    } else if (nextDs == null && !opt_selectOne) {
      return new goog.ds.EmptyNodeList();
    }
    return this.nextExpr.getNodes_(nextDs, opt_selectOne);
  }
};


/**
 * Whether the expression can be null.
 * 
 * @type Boolean
 * @private
 */
goog.ds.Expr.prototype.canBeEmpty_ = false;


/**
 * The parsed paths in the expression
 * 
 * @type Array (String)
 * @private
 */
goog.ds.Expr.prototype.parts_ = [];


/**
 * Number of paths in the expression
 * 
 * @type Number
 * @private
 */
goog.ds.Expr.prototype.size_ = null;

/**
 * The root node path in the expression
 * 
 * @type String
 * @private
 */
goog.ds.Expr.prototype.root_ = null;


/**
 * The last path in the expression
 * 
 * @type String
 * @private
 */
goog.ds.Expr.prototype.last_ = null;


/**
 * Whether the expression evaluates to current node
 * 
 * @type Boolean
 */
goog.ds.Expr.prototype.isCurrent_ = false;


/**
 * Whether the expression is just an attribute
 * 
 * @type Boolean
 */
goog.ds.Expr.prototype.isJustAttribute_ = false;


/**
 * Whether this expression evaluates to an attribute
 * 
 * @type Boolean
 * @private
 */
goog.ds.Expr.prototype.isAttribute_ = false;


/**
 * Name of the attribute, if isAttribute == true
 * 
 * @type String
 */
goog.ds.Expr.prototype.attributeName_ = null;


/**
 * Does this expression select all DOM-style child nodes (element and text)
 * 
 * @type Boolean
 */
goog.ds.Expr.prototype.isAllChildNodes_ = false;
 

/**
 * Does this expression select all DOM-style attribute nodes (starts with '@')
 * 
 * @type Boolean
 * @private
 */
goog.ds.Expr.prototype.isAllAttributes_ = false;


/**
 * Does this expression select all DOM-style element child nodes
 * 
 * @type Boolean
 * @private
 */
goog.ds.Expr.prototype.isAllElements_ = false;


/**
 * The function used by this expression
 * 
 * @type String
 * @private
 */
goog.ds.Expr.prototype.exprFn_ = null;


/**
 * Get eate an expression from a string, can use cached values
 * 
 * @param {String} expr The expression string
 * @returns {goog.ds.Expr} The expression object
 */
goog.ds.Expr.create = function(expr) {
  var result = goog.ds.Expr.cache_[expr];

  if (result == null) {
    result = new goog.ds.Expr(expr);
    goog.ds.Expr.cache_[expr] = result;
  }
  return result;
}


/** 
 * Cache of pre-parsed expressions 
 * @private
 */
goog.ds.Expr.cache_ = {}


/** Standard strings used in expressions */
goog.ds.Expr.STR_SEPARATOR_ = '/';
goog.ds.Expr.STR_CURRENT_NODE_EXPR_ = '.';
goog.ds.Expr.STR_EMPTY_EXPR_ = '';
goog.ds.Expr.STR_ATTRIBUTE_START_ = '@';
goog.ds.Expr.STR_ALL_CHILD_NODES_EXPR_ = '*|text()';
goog.ds.Expr.STR_ALL_ATTRIBUTES_EXPR_ = '@*';
goog.ds.Expr.STR_ALL_ELEMENTS_EXPR_ = '*';
goog.ds.Expr.STR_NAME_EXPR_ = 'name()';
goog.ds.Expr.STR_COUNT_EXPR_ = 'count()';
goog.ds.Expr.STR_POSITION_EXPR_ = 'position()';
goog.ds.Expr.STR_INDEX_START_ = '[';
goog.ds.Expr.STR_INDEX_END_ = ']';
goog.ds.Expr.STR_CAN_BE_EMPTY_ = '?';


/**
 * Standard expression
 */

/**
 * The current node
 */
goog.ds.Expr.CURRENT = goog.ds.Expr.create(goog.ds.Expr.STR_CURRENT_NODE_EXPR_);

/** 
 * For DOM interop - all DOM child nodes (text + element).
 * Text nodes have dataName #text
 */
goog.ds.Expr.ALL_CHILD_NODES = 
    goog.ds.Expr.create(goog.ds.Expr.STR_ALL_CHILD_NODES_EXPR_);
    
/** 
 * For DOM interop - all DOM element child nodes
 */
goog.ds.Expr.ALL_ELEMENTS = 
    goog.ds.Expr.create(goog.ds.Expr.STR_ALL_ELEMENTS_EXPR_);
    
/** 
 * For DOM interop - all DOM attribute nodes
 * Attribute nodes have dataName starting with "@"
 */
goog.ds.Expr.ALL_ATTRIBUTES = 
    goog.ds.Expr.create(goog.ds.Expr.STR_ALL_ATTRIBUTES_EXPR_);
    
/**
 * Get the dataName of a node
 */
goog.ds.Expr.NAME = goog.ds.Expr.create(goog.ds.Expr.STR_NAME_EXPR_);

/**
 * Get the count of nodes matching an expression
 */
goog.ds.Expr.COUNT = goog.ds.Expr.create(goog.ds.Expr.STR_COUNT_EXPR_);

/**
 * Get the position of the "current" node in the current node list
 * This will only apply for datasources that support the concept of a current
 * node (none exist yet). This is similar to XPath position() and concept of
 * current node
 */
goog.ds.Expr.POSITION = goog.ds.Expr.create(goog.ds.Expr.STR_POSITION_EXPR_);
