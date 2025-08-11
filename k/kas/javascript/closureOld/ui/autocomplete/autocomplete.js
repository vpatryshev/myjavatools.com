// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Caribou-like AutoComplete logic
 *
 * @author awhyte@google.com (Aaron Whyte)
 *
 */

goog.provide('goog.ui.AutoComplete');
goog.require('goog.array');
goog.require('goog.events');


/**
 * This is the central manager class for an AutoComplete instance.
 * 
 * @param {Object} matcher A data source and row matcher, implements
 *        <code>requestMatchingRows(token, maxMatches, matchCallback)</code>
 * @param {Object} renderer An oblect that implements these methods:
 *        <code>
 *          renderRows(rows);<br>
 *          hiliteId(row autocomplete id);<br>
 *          dismiss();
 *        </code>
 * @param {Object} selectionHandler An oblect that implements
 *        <code>selectRow(row);<br>
 *   
 * @constructor
 */
goog.ui.AutoComplete = function(matcher, renderer, selectionHandler) {
  this.matcher_ = matcher;
  this.selectionHandler_ = selectionHandler;
  
  this.renderer_ = renderer;
  goog.events.listen(renderer, [renderer.HILITE, renderer.SELECT], this);

  this.token_ = "";
  this.maxMatches_ = 10;

  this.rows_ = [];
  this.hiliteId_ = -1;

  this.firstRowId_ = 0;
  this.target_ = null;
};


/**
 * Generic event handler that handles any events this object is listening too
 * @param {goog.events.Event} e Event Object
 */
goog.ui.AutoComplete.prototype.handleEvent = function(e) {
  if (e.target == this.renderer_) {
    switch (e.type) {
      case this.renderer_.HILITE:
        this.hiliteId(e.row);
        break;
  
      case this.renderer_.SELECT:
        this.hiliteId(e.row);
        this.selectHilited();
        break;
    }
  }
};


/**
 * Sets the max number of matches to fetch from the Matcher.
 * 
 * @param {Number} max Max number of matches
 */
goog.ui.AutoComplete.prototype.setMaxMatches = function(max) {
  this.maxMatches_ = max;
};


/**
 * Sets the token to match against.  This triggers calls to the Matcher to
 * fetch the matches (up to maxMatches), and then it triggers a call to
 * <code>renderer.renderRows()</code>.
 * 
 * @param {String} token The string for which to search in the Matcher.
 */
goog.ui.AutoComplete.prototype.setToken = function(token) {
  this.token_ = token;
  this.matcher_.requestMatchingRows(this.token_, this.maxMatches_,
                                       this.matchListener_.bind(this));
};


/**
 * Sets the current target HTML node for displaying autocomplete UI.
 * Can be an implementation specific definition of how to display UI in relation
 * to the target node.
 * This target will be passed into  <code>renderer.renderRows()</code>
 * 
 * @param {String} target The string for which to search in the Matcher.
 */
goog.ui.AutoComplete.prototype.setTarget = function(target) {
  this.target_ = target;
};


/**
 * Moves the hilite to the next row, or does nothing if we're already at the
 * end of the current set of matches.  Calls renderer.hiliteId() when there's
 * something to do.
 */
goog.ui.AutoComplete.prototype.hiliteNext = function() {
  if (this.hiliteId_ >= this.firstRowId_ &&
      this.hiliteId_ < this.firstRowId_ + this.rows_.length - 1) {
    this.hiliteId(this.hiliteId_ + 1);
    return true;
  }
  return false;
};


/**
 * Moves the hilite to the previous row, or does nothing if we're already at
 * the beginning of the current set of matches.  Calls renderer.hiliteId()
 * when there's something to do.
 */
goog.ui.AutoComplete.prototype.hilitePrev = function() {
  if (this.hiliteId_ > this.firstRowId_) {
    this.hiliteId(this.hiliteId_ - 1);
    return true;
  }
  return false;
};


/**
 * Hilites the id if it's valid, otherwise does nothing.
 * @param {Number} id A row id (not index)
 */
goog.ui.AutoComplete.prototype.hiliteId = function(id) {
  if (this.getIndexOfId_(id) != -1) {
    this.hiliteId_ = id;
    this.renderer_.hiliteId(id);
    return true;
  }
  return false;
};


/**
 * If thre are any current matches, this passes the hilited row data to
 * <code>selectionHandler.selectRow()</code>
 */
goog.ui.AutoComplete.prototype.selectHilited = function() {
  var index = this.getIndexOfId_(this.hiliteId_);
  if (index != -1) {
    this.selectionHandler_.selectRow(this.rows_[index]);
    this.dismiss();
    return true;
  }
  return false;
};


/**
 * Clears out the token, rows, and hilite, and calls
 * <code>renderer.dismiss()</code>
 */
goog.ui.AutoComplete.prototype.dismiss = function() {
  this.hiliteId_ = -1;
  this.token_ = '';
  this.firstRowId_ += this.rows_.length;
  this.rows_.length = 0;

  this.renderer_.dismiss();
};


/**
 * Breaks all references and makes this object unusable.
 */
goog.ui.AutoComplete.prototype.destroy = function() {
  for (var key in this) {
    delete this[key];
  }
};


/**
 * Callback passed to Matcher when requesting mathces for a token.
 * This might be called synchronously, or asynchronously, or both, for
 * any implementation of a Matcher.
 * If the Matcher calls this back, with the same token this AutoComplete
 * has set currently, then this will package the mathcing rows in object
 * of the form
 * <pre>
 * { 
 *   id: an integer ID unique to this result set and AutoComplete instance,
 *   data: the raw row data from Matcher
 * }
 * </pre>
 * 
 * @param {String} matchedToken Token that corresponds with the rows
 * @param {Array} rows Set of data that match the given token
 * 
 * @private
 */
goog.ui.AutoComplete.prototype.matchListener_ = function(matchedToken, rows) {
  if (this.token_ != matchedToken) {
    // Matcher's response token doesn't match current token.
    // This is probably an async response that came in after
    // the token was changed, so don't do anything.
    return;
  }
  // Current token matches the matcher's response token.
  this.firstRowId_ += this.rows_.length;
  this.rows_ = rows;
  var rendRows = [];  
  for (var i = 0; i < rows.length; ++i) {
    rendRows.push({
      id: this.getIdOfIndex_(i),
      data: rows[i]
    });
  }
  this.renderer_.renderRows(rendRows, this.token_, this.target_);
  if (rendRows.length != 0) {
    this.hiliteId(this.firstRowId_);
  }
};

/**
 * Gets the index corresponding to a particular id.
 * @param {Number} id A unique id for the row
 * @return {Number} A valid index into rows_, or -1 if the id is invalid
 * @private
 */
goog.ui.AutoComplete.prototype.getIndexOfId_ = function(id) {
  var index = id - this.firstRowId_;
  if (index < 0 || index >= this.rows_.length) {
    return -1;
  }
  return index;
}

/**
 * Gets the id corresponding to a particular index.  (Does no checking.)
 * @param {Number} index The index of a row in the result set
 * @return {Number} The id that currently corresponds to that index.
 * @private
 */
goog.ui.AutoComplete.prototype.getIdOfIndex_ = function(index) {
  return this.firstRowId_ + index;
}
