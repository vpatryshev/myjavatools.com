// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Basic class for matching words in an array
 *
 * @author pupius@google.com (Daniel Pupius)
 */
 
goog.provide('goog.ui.AutoComplete.ArrayMatcher');
goog.require('goog.string');
goog.require('goog.structs');

/**
 * Basic class for matching words in an array
 * @constructor
 * @param {Array} rows Dictionary of items to match.  Can be objects if they
 * have a toString method that returns the value to match against.
 */
goog.ui.AutoComplete.ArrayMatcher = function(rows) {
  this.rows_ =  rows;
};


/**
 * Function used to pass matches to the autocomplete
 * @param {String} token Token to match
 * @param {Number} maxMatches Max number of matches to return
 * @param {Function} matchHandler callback to execute after matching
 */
goog.ui.AutoComplete.ArrayMatcher.prototype.requestMatchingRows =
    function(token, maxMatches, matchHandler) {

  var matches = this.getPrefixMatches(token, maxMatches);
  
  if (matches.length == 0) {
    matches = this.getSimilarRows(token, maxMatches);
  }
  matchHandler(token, matches);
};


/**
 * Matches the token against the start of words in the row.
 * @param {String} token Token to match
 * @param {Number} maxMatches Max number of matches to return
 */
goog.ui.AutoComplete.ArrayMatcher.prototype.getPrefixMatches =
    function(token, maxMatches) {
  var matches = [];
  
  if (token != '') {
    var escapedToken = goog.string.regExpEscape(token);
    var matcher = new RegExp('(^|\\W+)' + escapedToken, 'i');

    goog.structs.some(this.rows_, function(row) {
      if (String(row).match(matcher)) {
        matches.push(row);
      }
      return matches.length >= maxMatches;
    });
  }
  return matches;
};


/**
 * Matches the token against similar rows, by calculating "distance" between the
 * terms. glen@google.com did this.
 * @param {String} token Token to match
 * @param {Number} maxMatches Max number of matches to return
 */
goog.ui.AutoComplete.ArrayMatcher.prototype.getSimilarRows =
    function(token, maxMatches) { 

  var results = [];

  goog.structs.forEach(this.rows_, function(row) {  
    var str = token.toLowerCase();
    var txt = String(row).toLowerCase();
    var score = 0;

    if (txt.indexOf(str) != -1) {
      score = parseInt(txt.indexOf(str) / 4, 10);
      
    } else {
      var arr = str.split('');

      var lastPos = -1;
      var score = 0;
      var penalty = 10;

      for (var i = 0, c; c = arr[i]; i++) {
        var pos = txt.indexOf(c);

        if (pos > lastPos) {
          var diff = (pos - lastPos) - 1;

          if (diff > penalty - 5) {
            diff = penalty - 5;
          }

          score += diff;

          lastPos = pos;
        } else {
          score += penalty;
          penalty += 5;
        }
      }
    }
      
    if (score < str.length * 6) {
      results.push({
        str: row,
        score: score
      });
    }
  });
  
  results.sort(function(a, b) {
    return a.score - b.score;
  });
  
  var matches = [];
  for (var i = 0; i < maxMatches && i < results.length; i++) {
    matches.push(results[i].str);
  }
  
  return matches;
};
