// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Factory class to create a simple autocomplete that will match
 * from an array of data.
 *
 * @author pupius@google.com (Daniel Pupius)
 */
 
goog.provide('goog.ui.AutoComplete.Basic');

goog.require('goog.ui.AutoComplete');
goog.require('goog.ui.AutoComplete.InputHandler');
goog.require('goog.ui.AutoComplete.Renderer');
goog.require('goog.ui.AutoComplete.ArrayMatcher');


/**
 * Factory class for building a basic autocomplete widget that autocompletes
 * an inputbox or text area from a data array.
 * @param {Array} data Data array
 * @param {Element} input Input element or text area
 * @param {Boolean} opt_multi Whether to allow multiple entries separated with
 * semi-colons or colons.
 * use similar matches.  i.e. "gost" => "ghost"
 */
goog.ui.AutoComplete.Basic = function(data, input, opt_multi, opt_useSimilar) {
  var matcher = new goog.ui.AutoComplete.ArrayMatcher(data);
  var renderer = new goog.ui.AutoComplete.Renderer();
  var inputhandler =
      new goog.ui.AutoComplete.InputHandler(null, null, !!opt_multi);
  
  goog.ui.AutoComplete.call(this, matcher, renderer, inputhandler);
  
  inputhandler.attachAutoComplete(this);
  inputhandler.attachInputs(input);
};
goog.ui.AutoComplete.Basic.inherits(goog.ui.AutoComplete);