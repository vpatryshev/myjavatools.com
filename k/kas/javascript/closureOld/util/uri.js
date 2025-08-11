// Copyright 2006 Google Inc.
// All Rights Reserved.
//
/**
 * @fileoverview Class for parsing and formatting URIs.
 *
 * Use goog.Uri(string) to parse a URI string.  Use goog.Uri.create(...) to
 * create a new instance of the goog.Uri object from Uri parts.
 *
 * e.g: <code>var myUri = new goog.Uri(window.location);</code>
 *
 * Original implementation from google3/javascript by Mike Samuel.  The main
 * changes are to the interface (more like .NETs), though the internal
 * representation is now of un-encoded parts, this will change the behavior
 * slightly.
 *
 * Implements RFC 3986 for parsing/formatting URIs.
 *
 * @author msamuel@google.com (Mike Samuel)
 * @author Ported to Closure by pupius@google.com (Dan Pupius)
 */

goog.provide('goog.Uri');
goog.provide('goog.Uri.QueryData');

goog.require('goog.string');
goog.require('goog.array');
goog.require('goog.structs.Map');


/**
 * This class contains setters and getters for the parts of the URI.
 * The <code>getXyz</code>/<code>setXyz</code> methods return the decoded part
 * -- so<code>goog.Uri.parse('/foo%20bar').getPath()</code> will return the
 * decoded path, <code>/foo bar</code>.
 *
 * The constructor accepts an optional unparsed, raw URI string.  The parser
 * is relaxed, so special characters that aren't escaped but don't cause
 * ambiguities will not cause parse failures.
 *
 * All setters return <code>this</code> and so may be chained, a la
 * <code>goog.Uri.parse('/foo').setFragment('part').toString()</code>.
 *
 * @param {String|goog.Uri} opt_uri Optional String URI to parse
 *        (use goog.Uri.create() to create a URI from parts), or if
 *        a goog.Uri is passed, a clone is created.
 *
 * @constructor
 */
goog.Uri = function(opt_uri) {

  // Parse in the uri string
  var m;
  if (opt_uri instanceof goog.Uri) {
    this.setScheme(opt_uri.getScheme());
    this.setUserInfo(opt_uri.getUserInfo());
    this.setDomain(opt_uri.getDomain());
    this.setPort(opt_uri.getPort());
    this.setPath(opt_uri.getPath());
    this.setQueryData(opt_uri.getQueryData());
    this.setFragment(opt_uri.getFragment());
  } else if (opt_uri && (m = String(opt_uri).match(goog.Uri.getRE_()))) {
    // Set the parts -- decoding as we do so
    this.setScheme(m[1], true);
    this.setUserInfo(m[2], true);
    this.setDomain(m[3], true);
    this.setPort(m[4]);
    this.setPath(m[5], true);
    this.setQueryData(m[6]);
    this.setFragment(m[7], true);

  } else {
    this.queryData_ = new goog.Uri.QueryData(null, this);
  }

};


/**
 * Scheme such as "http"
 * @type String
 * @private
 */
goog.Uri.prototype.scheme_ = '';

/**
 * User credentials in the form "username:password"
 * @type String
 * @private
 */
goog.Uri.prototype.userInfo_ = '';

/**
 * Domain part, e.g. "www.google.com"
 * @type String
 * @private
 */
goog.Uri.prototype.domain_ = '';

/**
 * Port, e.g. 8080.
 * @type Number
 * @private
 */
goog.Uri.prototype.port_ = null;

/**
 * Path, e.g. "/tests/img.png"
 * @type String
 * @private
 */
goog.Uri.prototype.path_ = '';

/**
 * Object representing query data
 * @type goog.Uri.QueryData
 * @private
 */
goog.Uri.prototype.queryData_ = null;

/**
 * The fragment without the #
 * @type String
 * @private
 */
goog.Uri.prototype.fragment_ = '';



/**
 * Returns the string form of the url.
 * @return {String}
 */
goog.Uri.prototype.toString = function() {
  if (this.cachedToString_) {
    return this.cachedToString_;
  }

  var out = [];

  if (this.scheme_) {
    out.push(goog.Uri.encodeSpecialChars_(
        this.scheme_, goog.Uri.reDisallowedInSchemeOrUserInfo_), ':');
  }

  if (this.domain_) {
    out.push('//');

    if (this.userInfo_) {
      out.push(goog.Uri.encodeSpecialChars_(
          this.userInfo_, goog.Uri.reDisallowedInSchemeOrUserInfo_), '@');
    }

    out.push(goog.Uri.encodeString_(this.domain_));

    if (this.port_ != null) {
      out.push(':', String(this.getPort()));
    }
  }

  if (this.path_) {
    out.push(goog.Uri.encodeSpecialChars_(
        this.path_, goog.Uri.reDisallowedInPath_));
  }

  var query = String(this.queryData_);
  if (query) {
    out.push('?', query);
  }

  if (this.fragment_) {
    out.push('#', goog.Uri.encodeString_(this.fragment_));
  }

  return this.cachedToString_ = out.join('');
};


/**
 * Resolves a relative url string to a this base uri.
 *
 * There are several kinds of relative urls:<br>
 * 1. foo - replaces the last part of the path, the whole query and fragment<br>
 * 2. /foo - replaces the the path, the query and fragment<br>
 * 3. //foo - replaces everything from the domain on.  foo is a domain name<br>
 * 4. ?foo - replace the query and fragment<br>
 * 5. #foo - replace the fragment only
 *
 * @param {goog.Uri} relativeUri
 * @return {goog.Uri}
 */
goog.Uri.prototype.resolve = function(relativeUri) {

  var absoluteUri = this.clone();

  // we satisfy these conditions by looking for the first part of relativeUri
  // that is not blank and applying defaults to the rest

  var overridden = relativeUri.hasScheme();

  if (overridden) {
    absoluteUri.setScheme(relativeUri.getScheme());
  } else {
    overridden = relativeUri.hasUserInfo();
  }

  if (overridden) {
    absoluteUri.setUserInfo(relativeUri.getUserInfo());
  } else {
    overridden = relativeUri.hasDomain();
  }

  if (overridden) {
    absoluteUri.setDomain(relativeUri.getDomain());
  } else {
    overridden = relativeUri.hasPort();
  }

  var path = relativeUri.getPath();
  if (overridden) {
    absoluteUri.setPort(relativeUri.getPort());
  } else {
    overridden = relativeUri.hasPath();
    if (overridden) {
      // resolve path properly
      if (!new RegExp("^/").test(path)) {
        // path is relative
        path = absoluteUri.getPath().replace(
            new RegExp("/?[^/]*$"), '/' + path);
      }
    }
  }

  if (overridden) {
    absoluteUri.setPath(path);
  } else {
    overridden = relativeUri.hasQuery();
  }

  if (overridden) {
    absoluteUri.setQueryData(relativeUri.getQuery());
  } else {
    overridden = relativeUri.hasFragment();
  }

  if (overridden) {
    absoluteUri.setFragment(relativeUri.getFragment());
  }

  return absoluteUri;
};


/**
 * Clone the URI instance
 * @return {goog.Uri} New instance of the URI objcet
 */
goog.Uri.prototype.clone = function() {
  return new goog.Uri.create(this.scheme_, this.userInfo_, this.domain_,
                             this.port_, this.path_, this.queryData_,
                             this.fragment_);
};


/**
 * Get the encoded scheme/protocol for the URI
 * @return {String}
 */
goog.Uri.prototype.getScheme = function() {
  return this.scheme_;
};


/**
 * Set the scheme/protocol
 * @param {String} newScheme New scheme value
 * @param {Boolean} opt_decode Optional param for whether to decode new value
 * @return {goog.Uri} Reference to this URI object.
 */
goog.Uri.prototype.setScheme = function(newScheme, opt_decode) {
  delete this.cachedToString_;
  this.scheme_ = opt_decode ? goog.Uri.decodeOrEmpty_(newScheme) : newScheme;

  // remove an : at the end of the scheme so somebody can pass in
  // window.location.protocol
  if (this.scheme_) {
    this.scheme_ = this.scheme_.replace(/:$/, '');
  }
  return this;
};


/**
 * Returns true if the schem has been set
 * @return {Boolean}
 */
goog.Uri.prototype.hasScheme = function() {
  return !!this.scheme_;
};


/**
 * Get the decoded userInfo
 * @return {String}
 */
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_;
};


/**
 * Set the userInfo
 * @param {String} newUserInfo New userInfo value
 * @param {Boolean} opt_decode Optional param for whether to decode new value
 * @return {goog.Uri} Reference to this URI object.
 * @private
 */
goog.Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
  delete this.cachedToString_;
  this.userInfo_ = opt_decode ? goog.Uri.decodeOrEmpty_(newUserInfo) :
                      newUserInfo;
  return this;
};


/**
 * Returns true if the userInfo have been set
 * @return {Boolean}
 */
goog.Uri.prototype.hasUserInfo = function() {
  return !!this.userInfo_;
};


/**
 * Returns the decoded domain
 * @return {String}
 */
goog.Uri.prototype.getDomain = function() {
  return this.domain_;
};


/**
 * Set the domain
 * @param {String} newDomain New domain value
 * @param {Boolean} opt_decode Optional param for whether to decode new value
 * @return {goog.Uri} Reference to this URI object.
 */
goog.Uri.prototype.setDomain = function(newDomain, opt_decode) {
  delete this.cachedToString_;
  this.domain_ = opt_decode ? goog.Uri.decodeOrEmpty_(newDomain) : newDomain;
  return this;
};


/** Returns true if the domain has been set
 * @return {Boolean}
 */
goog.Uri.prototype.hasDomain = function() {
  return !!this.domain_;
};


/**
 * Returns the port number
 * @return {Number}
 */
goog.Uri.prototype.getPort = function() {
  return this.port_;
};


/**
 * Sets the port number
 * @param {Number} newPort Port number
 * @return {goog.Uri} Reference to this URI object.
 */
goog.Uri.prototype.setPort = function(newPort) {
  delete this.cachedToString_;

  if (newPort) {
    newPort = Number(newPort);
    if (isNaN(newPort) || newPort < 0) {
     throw Error('Bad port number ' + newPort);
    }
    this.port_ = newPort;
  } else {
    this.port_ = null;
  }

  return this;
};


/**
 * Returns true if the port has been set
 * @return {Boolean}
 */
goog.Uri.prototype.hasPort = function() {
  return this.port_ != null;
};


/**
 * Get the decoded path
 * @return {String}
 */
goog.Uri.prototype.getPath = function() {
  return this.path_;
};


/**
 * Set the path
 * @param {String} newPath New path value
 * @param {Boolean} opt_decode Optional param for whether to decode new value
 * @return {goog.Uri} Reference to this URI object.
 */
goog.Uri.prototype.setPath = function(newPath, opt_decode) {
  delete this.cachedToString_;
  this.path_ = opt_decode ? goog.Uri.decodeOrEmpty_(newPath) : newPath;
  return this;
};


/**
 * Returns true if the path has been set
 * @return {Boolean}
 */
goog.Uri.prototype.hasPath = function() {
  return !!this.path_;
};


/**
 * Returns true if the query string has been set
 */
goog.Uri.prototype.hasQuery = function() {
  return this.queryData_ !== null && this.queryData_.toString() !== '';
};


/**
 * Sets the query data
 * @param {goog.Uri.QueryData|String} queryData QueryData object
 * @return {goog.Uri} Reference to this URI object.
 */
goog.Uri.prototype.setQueryData = function(queryData) {
  delete this.cachedToString_;

  if (queryData instanceof goog.Uri.QueryData) {
    this.queryData_ = queryData;
    this.queryData_.uri_ = this;
  } else {
    this.queryData_ = new goog.Uri.QueryData(queryData, this);
  }

  return this;
};


/**
 * Returns the query data as as string
 * @return {String} Querystring
 */
goog.Uri.prototype.getQuery = function() {
  return this.queryData_.toString();
};


/**
 * Returns the query data
 * @return {goog.Uri.QueryData} QueryData object
 */
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_;
};


/**
 * Sets the value of the named query parameters, clearing previous values for
 * that key.
 *
 * @param key {String}
 * @param value {String} the new value.
 * @return {goog.Uri} Reference to this URI object.
 */
goog.Uri.prototype.setParameterValue = function(key, value) {
  delete this.cachedToString_;

  this.queryData_.set(key, value);

  return this;
};


/**
 * Sets the values of the named query parameters, clearing previous values for
 * that key.  Not new values will currently be moved to the end of the query
 * string.
 *
 * So, <code>goog.Uri.parse('foo?a=b&c=d&e=f').setParameterValues('c', ['new'])
 * </code> yields <tt>foo?a=b&e=f&c=new</tt>.</p>
 *
 * @param key {String}
 * @param values {Array<string>} the new values.  If values is a single string
 *   then it will be treated as the sole value.
 * @return {goog.Uri} Reference to this URI object.
 */
goog.Uri.prototype.setParameterValues = function(key, values) {
  delete this.cachedToString_;

  if (!goog.isArray(values)) {
    values = [String(values)];
  }

  this.queryData_.setValues(key, values);

  return this;
};


/**
 * Returns the value<b>s</b> for a given cgi parameter as a list of decoded
 * query parameter values.
 * @param {String} name
 * @return {Array<string>}
 */
goog.Uri.prototype.getParameterValues = function(name) {
    return this.queryData_.getValues(name);
};


/**
 * Returns the first value for a given cgi parameter or null if the given
 * parameter name does not appear in the query string.
 * @param {String} paramName Unescaped parameter name
 * @return {String}
 */
goog.Uri.prototype.getParameterValue = function(paramName) {
  return this.queryData_.get(paramName);
};


/**
 * Gets the URI fragment not including the #
 * @return {String}
 */
goog.Uri.prototype.getFragment = function() {
  return this.fragment_;
};


/**
 * Set the URI fragment
 * @param {String} newFragment New fragment value
 * @param {Boolean} opt_decode Optional param for whether to decode new value
 * @return {goog.Uri} Reference to this URI object.
 */
goog.Uri.prototype.setFragment = function(newFragment, opt_decode) {
  delete this.cachedToString_;
  this.fragment_ = opt_decode ? goog.Uri.decodeOrEmpty_(newFragment) :
                   newFragment;
  return this;
};


/**
 * Return true if the URI has a fragment set
 * @return {Boolean}
 */
goog.Uri.prototype.hasFragment = function() {
  return !!this.fragment_;
};


//==============================================================================
// Static members
//==============================================================================




/**
 * Creates a uri from the string form.  Basically an alias of new goog.Uri().
 * If a Uri object is passed to parse then it will return a clone of the object.
 *
 * @param {String|goog.Uri} uri Raw URI string or instance of Uri object
 * @return {goog.Uri}
 */
goog.Uri.parse = function(uri) {
  return uri instanceof goog.Uri ? uri.clone() : new goog.Uri(uri);
};


/**
 * Creates a new goog.Uri object from unencoded parts.
 *
 * @param {String} opt_scheme Scheme/protocol or full URI to parse
 * @param {String} opt_userInfo username:password
 * @param {String} opt_domain www.google.com
 * @param {Number} opt_port 9830
 * @param {String} opt_path /some/path/to/a/file.html
 * @param {String} opt_query a=1&b=2
 * @param {String} opt_fragment The fragment without the #
 *
 * @return {goog.Uri}
 */
goog.Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port,
                           opt_path, opt_query, opt_fragment) {

  var uri = new goog.Uri();

  uri.setScheme(opt_scheme);
  uri.setUserInfo(opt_userInfo);
  uri.setDomain(opt_domain);
  uri.setPort(opt_port);
  uri.setPath(opt_path);
  uri.setQueryData(opt_query);
  uri.setFragment(opt_fragment);

  return uri;
};


/**
 * Resolves a relative Uri against a base Uri, accepting both strings and
 * Uri objects.
 *
 * @param {String|goog.Uri} base Base Uri
 * @param {String|goog.Uri} rel Relative Uri
 * @return {goog.Uri} Resolved uri
 */
goog.Uri.resolve = function(base, rel) {
  if (!(base instanceof goog.Uri)) {
    base = goog.Uri.parse(base);
  }

  if (!(rel instanceof goog.Uri)) {
    rel = goog.Uri.parse(rel);
  }

  return base.resolve(rel);
};


/**
 * Decodes a value or returns null if it isn't defined or empty
 * @param {String} val Value to decode
 * @return {String} Decoded value
 * @private
 */
goog.Uri.decodeOrEmpty_ = function(val) {
  return val ? goog.string.urlDecode(val) : '';
};


/**
 * URI encode a string, or return null if it's not a string
 * @param {String} unescapedPart Unescaped string
 * @return {String} Escaped string
 */
goog.Uri.encodeString_ = function(unescapedPart) {
  if (goog.isString(unescapedPart)) {
    return encodeURIComponent(unescapedPart);
  }
  return null;
};


/**
 * If unescapedPart is non null, then escapes any characters in it that aren't
 * valid characters in a url and also escapes any special characters that
 * appear in extra.
 *
 * @param {String} unescapedPart
 * @param {RegExp} extra A character set of characters in [\01-\177].
 * @return {String} null iff unescapedPart == null.
 */
goog.Uri.encodeSpecialChars_ = function(unescapedPart, extra) {
  if (goog.isString(unescapedPart)) {
    return encodeURI(unescapedPart).replace(extra, goog.Uri.encodeChar_);
  }
  return null;
};


/**
 * Converts a character in [\01-\177] to its unicode character equivalent.
 * @param {String} ch One character string
 * @return {String} Encoded string
 * @private
 */
goog.Uri.encodeChar_ = function(ch) {
  var n = ch.charCodeAt(0);
  return '%' + ((n >> 4) & 0xf).toString(16) + (n & 0xf).toString(16);
};


/**
 * A regular expression for breaking a URI into its component parts.
 *
 * {@link http://www.gbiv.com/protocols/uri/rfc/rfc3986.html#RFC2234} says
 * As the "first-match-wins" algorithm is identical to the "greedy"
 * disambiguation method used by POSIX regular expressions, it is natural and
 * commonplace to use a regular expression for parsing the potential five
 * components of a URI reference.
 *
 * The following line is the regular expression for breaking-down a
 * well-formed URI reference into its components.
 *
 * <pre>
 * ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
 *  12            3  4          5       6  7        8 9
 * </pre>
 *
 * The numbers in the second line above are only to assist readability; they
 * indicate the reference points for each subexpression (i.e., each paired
 * parenthesis). We refer to the value matched for subexpression <n> as $<n>.
 * For example, matching the above expression to
 * <pre>
 *     http://www.ics.uci.edu/pub/ietf/uri/#Related
 * </pre>
 * results in the following subexpression matches:
 * <pre>
 *    $1 = http:
 *    $2 = http
 *    $3 = //www.ics.uci.edu
 *    $4 = www.ics.uci.edu
 *    $5 = /pub/ietf/uri/
 *    $6 = <undefined>
 *    $7 = <undefined>
 *    $8 = #Related
 *    $9 = Related
 * </pre>
 * where <undefined> indicates that the component is not present, as is the
 * case for the query component in the above example. Therefore, we can
 * determine the value of the five components as
 * <pre>
 *    scheme    = $2
 *    authority = $4
 *    path      = $5
 *    query     = $7
 *    fragment  = $9
 * </pre>
 *
 * msamuel: I have modified the regular expression slightly to expose the
 * userInfo, domain, and port separately from the authority.
 * The modified version yields
 * <pre>
 *    $1 = http              scheme
 *    $2 = <undefined>       userInfo -\
 *    $3 = www.ics.uci.edu   domain       | authority
 *    $4 = <undefined>       port        -/
 *    $5 = /pub/ietf/uri/    path
 *    $6 = <undefined>       query without ?
 *    $7 = Related           fragment without #
 * </pre>
 */
goog.Uri.re_ = null;


/**
 * Function to return regular expression
 * @return {RegExp}
 * @private
 */
goog.Uri.getRE_ = function() {

  if (!goog.Uri.re_) {
    goog.Uri.re_ = new RegExp(
      "^" +
      "(?:" +
        "([^:/?#]+)" +         // scheme
      ":)?" +
      "(?://" +
        "(?:([^/?#]*)@)?" +    // userInfo
        "([^/?#:@]*)" +        // domain
        "(?::([0-9]+))?" +     // port
      ")?" +
      "([^?#]+)?" +            // path
      "(?:\\?([^#]*))?" +      // query
      "(?:#(.*))?" +           // fragment
      "$"
      );
  }

  return goog.Uri.re_;
};


/**
 * Regular expression for characters that are disallowed in the scheme or
 * userInfo part of the URI
 * @private
 */
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;


/**
 * Regular expression for characters that are disallowed in the path
 * @private
 */
goog.Uri.reDisallowedInPath_ = /[\#\?]/g;





/**
 * Class used to represent URI query parameters.  It is essentially a hash of
 * name-value pairs, though a name can be present more than once.
 *
 * Has the same interface as the collections in goog.structs.
 *
 * @param {String} opt_query Optional query string to parse into the object
 * @param {goog.Uri} opt_uri Optional uri object that should have it's cache
 * invalidated when this object updates.
 * @constructor
 */
goog.Uri.QueryData = function(opt_query, opt_uri) {
  /**
   * We need to use a Map because we cannot guarantee that the key names will
   * not be problematic for IE
   * @type Object
   */
  this.keyMap_ = new goog.structs.Map;

  /**
   * Reference to a uri object which uses the query data.  This allows the
   * QueryData object to invalidate the cache
   * @type goog.Uri
   */
  this.uri_ = opt_uri;

  // Parse the query string
  if (opt_query) {
    var pairs = opt_query.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var parts = pairs[i].split('=');
      this.add(goog.string.urlDecode(parts[0]),
               parts.length > 1 ? goog.string.urlDecode(parts[1]) :'');
    }
  }
};


/**
 * The number of params
 * @private
 * @type Number
 */
goog.Uri.QueryData.prototype.count_ = 0;


/**
 * Returns the number of params
 * @returns {Number}
 */
goog.Uri.QueryData.prototype.getCount = function() {
  return this.count_;
};


/**
 * Adds a key value pair.
 * @param {String} key Name
 * @param {String} value Value
 * @returns {goog.Uri.QueryData} Instance of this object
 */
goog.Uri.QueryData.prototype.add = function(key, value) {
  this.invalidateCache_();

  if (!this.containsKey(key)) {
    this.keyMap_.set(key, [value]);
  } else {
    this.keyMap_.get(key).push(value);
  }

  this.count_++;

  return this;
};


/**
 * Removes all the params with the given key.
 * @param {String} key Name
 * @returns {Boolean} Whether any parameter was removed
 */
goog.Uri.QueryData.prototype.remove = function(key) {
  if (this.keyMap_.containsKey(key)) {
    this.invalidateCache_();
    // we need to get it to know how many to decrement the count with
    this.count_ -= this.keyMap_.get(key).length;
    this.keyMap_.remove(key);
  }
  return false;
};


/**
 * Clears the parameters
 */
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_.clear();
  this.count_ = 0;
};


/**
 * Whether we have any parameters
 */
goog.Uri.QueryData.prototype.isEmpty = function() {
  return this.count_ == 0;
};


/**
 * Whether there is a parameter with the given name
 * @param {String} key The parameter name to check for
 * @returns {Boolean}
 */
goog.Uri.QueryData.prototype.containsKey = function(key) {
  return this.keyMap_.containsKey(key);
};


/**
 * Whether there is a parameter with the given value
 * @param {String} value The value to check for
 * @returns {Boolean}
 */
goog.Uri.QueryData.prototype.containsValue = function(value) {
  // TODO(arv): This solution goes through all the params even if it was the
  // first param
  var vals = this.getValues();
  return goog.array.contains(vals, value);
};


/**
 * Returns all the keys of the parameters. If a key is used multiple times
 * it will be included multiple times in the returned array
 * @returns {Array}
 */
goog.Uri.QueryData.prototype.getKeys = function() {
  // We need to get the values to know how many keys to add.
  var vals = this.keyMap_.getValues(); // arrays of arrays
  var keys = this.keyMap_.getKeys(); // arrays of strings
  var rv = [];
  for (var i = 0; i < keys.length; i++) {
    for (var j = 0; j < vals[i].length; j++) {
      rv.push(keys[i]);
    }
  }
  return rv
};


/**
 * Returns all the values of the parameters with the given name. If the query
 * data has no such key this will return an empty array. If no key is given
 * all values wil be returned.
 * @param {String} opt_key The name of the parameter to get the values for.
 * @returns {Array}
 */
goog.Uri.QueryData.prototype.getValues = function(opt_key) {
  if (opt_key) {
    if (this.containsKey(opt_key)) {
      return this.keyMap_.get(opt_key);
    } else {
      return [];
    }
  } else {
    // return all values
    var vals = this.keyMap_.getValues(); // arrays of arrays
    // >>> [].concat([0, 1, 2], [3, 4], [5])
    // [0, 1, 2, 3, 4, 5]
    return Array.prototype.concat.apply([], vals);
  }
};


/**
 * Sets a key value pair and removes all other keys with the same value.
 *
 * @param {String} key Name
 * @param {String} value Value
 * @returns {goog.Uri.QueryData} Instance of this object
 */
goog.Uri.QueryData.prototype.set = function(key, value) {
  this.invalidateCache_();

  if (this.containsKey(key)) {
    var old = this.keyMap_.get(key);
    this.count_ -= old.length;
  }

  this.keyMap_.set(key, [value]);
  this.count_++;

  return this;
};


/**
 * Returns the first value associated with the key. If the query data has no
 * such key this will return undefined
 * @param {String} key The name of the parameter to get the value for.
 * @returns {String}
 */
goog.Uri.QueryData.prototype.get = function(key, opt_default) {
  if (this.containsKey(key)) {
    return this.keyMap_.get(key)[0];
  } else {
    return opt_default;
  }
};


/**
 * Sets the values for a key, if the key has already got values defined, this
 * will override the existing values then remove any left over
 * @param {String} key
 * @param {Array} values
 */
goog.Uri.QueryData.prototype.setValues = function(key, values) {
  this.invalidateCache_();

  if (this.containsKey(key)) {
    var old = this.keyMap_.get(key);
    this.count_ -= old.length;
  }

  if (values.length > 0) {
    this.keyMap_.set(key, values);
    this.count_ += values.length;
  }
};


/**
 * This returns the query data encoded as application/x-www-url-encoded
 * @returns {String}
 */
goog.Uri.QueryData.prototype.toString = function() {
  if (this.cachedToString_) {
    return this.cachedToString_;
  }

  var sb = [];
  var keys = this.getKeys();
  var vals = this.getValues();
  for (var i = 0; i < keys.length; i++) {
    sb.push(encodeURIComponent(keys[i]) + '=' + encodeURIComponent(vals[i]));
  }
  return this.cachedToString_ = sb.join('&');
};


/**
 * Invalidate the cache
 */
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  delete this.cachedToString_;
  if (this.uri_) {
    delete this.uri_.cachedToString_;
  }
};
