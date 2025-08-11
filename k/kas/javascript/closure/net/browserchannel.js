// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the BrowserChannel class.  A BrowserChannel
 * simulates a bidirectional socket over HTTP. It is the basis of the
 * YellowJacket IM connections to the server.
 *
 * See http://wiki.corp.google.com/twiki/bin/view/Main/BrowserChannel
 * This doesn't yet completely comform to the design doument as we've done
 * some renaming and cleanup in the design document that hasn't yet been
 * implemented in the protocol.
 *
 * Typical usage will look like
 *  var handler = [handler object];
 *  var channel = new BrowserChannel(clientVersion);
 *  channel.setHandler(handler);
 *  channel.connect('channel/test', 'channel/bind');
 *
 * See goog.net.BrowserChannel.Handler for the handler interface.
 *
 *
 * @author Jon Perlow (jonp@google.com)
 */

/**
 * Namespace for BrowserChannel
 */
goog.provide('goog.net.BrowserChannel');
goog.require('goog.net.BrowserTestChannel');
goog.provide('goog.net.BrowserChannel.LogSaver');
goog.require('goog.net.ChannelRequest');
goog.require('goog.net.ChannelDebug');
goog.require('goog.userAgent');
goog.require('goog.string');
goog.require('goog.Uri');
goog.require('goog.debug.TextFormatter');
goog.require('goog.events.EventTarget');
goog.require('goog.events.Event');


/**
 * Encapsulates the logic for a single BrowserChannel.
 *
 * @param {String} clientVersion An application-specific version number that
 *        is sent to the server when connected.
 * @constructor
 */
goog.net.BrowserChannel = function(clientVersion) {
  /**
   * The application specific version that is passed to the server.
   * @type String
   * @private
   */
  this.clientVersion_ = clientVersion;

  /**
   * The current state of the BrowserChannel. It should be one of the
   * goog.net.BrowserChannel.State constants.
   * @type goog.net.BrowserChannel.State
   * @private
   */
  this.state_ = goog.net.BrowserChannel.State.INIT;

  /**
   * An array of queued maps that need to be sent to the server.
   * @type Array&lt;Object|goog.struct.map&gt;
   * @private
   */
  this.outgoingMaps_ = [];
}


/**
 * Extra parameters to add to all the requests sent to the server.
 * @type Map
 * @private
 */
goog.net.BrowserChannel.prototype.extraParams_ = null;

/**
 * The current BrowserChannelRequest object for the forwarchannel.
 * @type BrowserChannelRequest
 * @private
 */
goog.net.BrowserChannel.prototype.forwardChannelRequest_ = null;

/**
 * The  BrowserChannelRequest object for the backchannel.
 * @type BrowserChannelRequest
 * @private
 */
goog.net.BrowserChannel.prototype.backChannelRequest_ = null;

/**
 * The relative path (in the context of the the page hosting the browser
 * channel) for making requests to the server.
 * @type String
 * @private
 */
goog.net.BrowserChannel.prototype.path_ = null;

/**
 * The absolute URI for the forwardchannel request.
 * @type String
 * @private
 */
goog.net.BrowserChannel.prototype.forwardChannelUri_ = null;

/**
 * The absolute URI for the backchannel request.
 * @type String
 * @private
 */
goog.net.BrowserChannel.prototype.backChannelUri_ = null;

/**
 * A subdomain prefix for using a subdomain in IE for the backchannel
 * requests.
 * @type String
 * @private
 */
goog.net.BrowserChannel.prototype.hostPrefix_ = null;

/**
 * Whether we allow the use of a subdomain in IE for the backchannel requests.
 */
goog.net.BrowserChannel.prototype.allowHostPrefix_ = true;

/**
 * The next id to use for the RID (request identifier) parameter. This
 * identifier uniquely identifies the forward channel request.
 * @type Number
 * @private
 */
goog.net.BrowserChannel.prototype.nextRid_ = 0;

/**
 * The handler that receive callbacks for state changes and data.
 * @type goog.net.BrowserChannel.Handler
 * @private
 */
goog.net.BrowserChannel.prototype.handler_ = null;

/**
 * Timer identifier for asynchrously making a forward channel request.
 * @type Number
 * @private
 */
goog.net.BrowserChannel.prototype.forwardChannelTimerId_ = null;

/**
 * The BrowserTestChannel object which encapsulates the logic for determing
 * interesting network conditions about the client.
 * @type goog.net.BrowserTestChannel
 * @private
 */
goog.net.BrowserChannel.prototype.connectionTest_ = null;

/**
 * Whether the client's network conditions can support chunked responses.
 * @type Boolean
 * @private
 */
goog.net.BrowserChannel.prototype.useChunked_ = null;

/**
 * Whether chunked mode is allowed. In certain debugging situations, it's
 * useful to disable this.
 */
goog.net.BrowserChannel.prototype.allowChunkedMode_ = true;

/**
 * The array identifier of the last array received from the server for the
 * backchannel request.
 * @type Number
 * @private
 */
goog.net.BrowserChannel.prototype.lastArrayId_ = -1;


/**
 * Enum type for the browser channel state machine
 */
goog.net.BrowserChannel.State = {};

/**
 * Value used to indicate the channel is in the closed state.
 * @type Number
 */
goog.net.BrowserChannel.State.CLOSED = 0;

/**
 * Value used to indicate the channel has been initialized but hasn't yet
 * initiated connecting to the server.
 * @type Number
 */
goog.net.BrowserChannel.State.INIT = 1;

/**
 * Value used to indicate the channel is in the process of establishing a
 * channel to the server.
 * @type Number
 */
goog.net.BrowserChannel.State.OPENING = 2;

/**
 * Value used to indicate the channel is open.
 * @type Number
 */
goog.net.BrowserChannel.State.OPENED = 3;

/**
 * Maximum number of attempts to connect to the server for forward channel
 * requests.
 * @type Number
 */
goog.net.BrowserChannel.FORWARD_CHANNEL_MAX_RETRIES = 3;

/**
 * The timeout in milliseconds for a forward channel request.
 * @type Number
 */
goog.net.BrowserChannel.FORWARD_CHANNEL_RETRY_TIMEOUT = 20000;

/**
 * Maximum number of attempts to connect to the server for back channel
 * requests that are performed over XMLHTTP.
 * @type Number
 */
goog.net.BrowserChannel.BACK_CHANNEL_XMHTTP_MAX_RETRIES = 3;


/**
 * Enum type for identifying a BrowserChannel error.
 * @type enum
 */
goog.net.BrowserChannel.Error = {};

/**
 * Value that indicates no error has occurred.
 * @type Number
 */
goog.net.BrowserChannel.Error.OK = 0;

/**
 * Value that indicates an error due to a request failing.
 * @type Number
 */
goog.net.BrowserChannel.Error.REQUEST_FAILED = 2;

/**
 * Values that indicates an error due to the user being logged out.
 * @type Number
 */
goog.net.BrowserChannel.Error.LOGGED_OUT = 4;

/**
 * Value that indicates an error due to a response from the server containing
 * no data.
 * @type Number
 */
goog.net.BrowserChannel.Error.NO_DATA = 5;

/**
 * Value that indicates an error due to a response from the server indicating
 * the session id was unknown.
 * @type Number
 */
goog.net.BrowserChannel.Error.UNKNOWN_SESSION_ID = 6;

/**
 * Value that indicates an error due to a response from the server telling
 * the browser to stop the channel.
 * @type Number
 */
goog.net.BrowserChannel.Error.STOP = 7;

/**
 * Value that indicates an error due to a general network error.
 * @type Number
 */
goog.net.BrowserChannel.Error.NETWORK = 8;

/**
 * Value that indicates an error due to the browser channel being blocked by
 * a network administrator.
 * @type Number
 */
goog.net.BrowserChannel.Error.BLOCKED = 9;

/**
 * Value that indicates an error due to bad data being returned from the server.
 * @type Number
 */
goog.net.BrowserChannel.Error.BAD_DATA = 10;

/**
 * Value that indicates an error due to a response that didn't have the magic
 * response cookie prepended to it.
 * @type Number
 */
goog.net.BrowserChannel.Error.BAD_RESPONSE = 11;

/**
 * Singleton event target for firing stat events
 *
 * @type goog.events.EventTarget
 */
goog.net.BrowserChannel.statEventTarget_ = new goog.events.EventTarget();

/**
 * Events fired by BrowserChannel and associated objects
 * @type Object
 */
goog.net.BrowserChannel.Event = {};


/**
 * Stat Event which fires when things of interest happen that mey be useful for
 * applications to know about for stats or debugging purposes. This event fires
 * on the EventTarget returned by getStatEventTarget.
 */
goog.net.BrowserChannel.Event.STAT_EVENT = 'statevent';


/**
 * Event class for goog.net.BrowserChannel.Event.STAT_EVENT
 * @constructor
 * @extends goog.events.Event
 */
goog.net.BrowserChannel.StatEvent = function(browserChannel, stat) {
  goog.events.Event.call(this, goog.net.BrowserChannel.Event.STAT_EVENT,
      browserChannel);

  /**
   * The stat
   * @type goog.net.BrowserChannel.Stat
   */
  this.stat = stat;

};
goog.net.BrowserChannel.StatEvent.inherits(goog.events.Event);


/**
 * Enum that identifies events for statistics that are interesting to track.
 * TODO(jonp) - Change name not to use Event or use EventTarget
 * @type enum
 */
goog.net.BrowserChannel.Stat = {};

/**
 * Stat event that indicates a new connection attempt.
 * @type Number
 */
goog.net.BrowserChannel.Stat.CONNECT_ATTEMPT = 0;

/**
 * Stat event that indicates a connection error due to a general network
 * problem.
 * @type Number
 */
goog.net.BrowserChannel.Stat.ERROR_NETWORK = 1;

/**
 * Stat event that indicates a connection error not due to a general network
 * problem.
 * @type Number
 */
goog.net.BrowserChannel.Stat.ERROR_OTHER = 2;

/**
 * Stat event that indicates the start of test stage one.
 * @type Number
 */
goog.net.BrowserChannel.Stat.TEST_STAGE_ONE_START = 3;


/**
 * Stat event that indicates the channel is blocked by a network administrator.
 * @type Number
 */
goog.net.BrowserChannel.Stat.CHANNEL_BLOCKED = 4;

/**
 * Stat event that indicates the start of test stage two.
 * @type Number
 */
goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_START = 5;

/**
 * Stat event that indicates the first piece of test data was received.
 * @type Number
 */
goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_DATA_ONE = 6;

/**
 * Stat event that indicates that the second piece of test data was received
 * and it was recieved separately from the first.
 * @type Number
 */
goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_DATA_TWO = 7;

/**
 * Stat event that indicates both pieces of test data were received
 * simultaneously.
 * @type Number
 */
goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_DATA_BOTH = 8;

/**
 * Stat event that indicates stage one of the test request failed.
 * @type Number
 */
goog.net.BrowserChannel.Stat.TEST_STAGE_ONE_FAILED = 9;

/**
 * Stat event that indicates stage two of the test request failed.
 * @type Number
 */
goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_FAILED = 10;

/**
 * Stat event that indicates that a buffering proxy is likely between the
 * client and the server.
 * @type Number
 */
goog.net.BrowserChannel.Stat.PROXY = 11;

/**
 * Stat event that indicates that no buffering proxy is likely between the
 * client and the server.
 * @type Number
 */
goog.net.BrowserChannel.Stat.NOPROXY = 12;

/**
 * Stat event that indicates an unknown SID error.
 * @type Number
 */
goog.net.BrowserChannel.Stat.REQUEST_UNKNOWN_SESSION_ID = 13;

/**
 * Stat event that indicates a bad status code was received.
 * @type Number
 */
goog.net.BrowserChannel.Stat.REQUEST_BAD_STATUS = 14;

/**
 * Stat event that indicates incomplete data was received
 * @type Number
 */
goog.net.BrowserChannel.Stat.REQUEST_INCOMPLETE_DATA = 15;

/**
 * Stat event that indicates bad data was received
 * @type Number
 */
goog.net.BrowserChannel.Stat.REQUEST_BAD_DATA = 16;

/**
 * Stat event that indicates no data was received when data was expected.
 * @type Number
 */
goog.net.BrowserChannel.Stat.REQUEST_NO_DATA = 17;

/**
 * Stat event that indicates a request timeout.
 * @type Number
 */
goog.net.BrowserChannel.Stat.REQUEST_TIMEOUT = 18;


/**
 * Magic response cookie that is the response for forward channel requests.
 * @type Number
 */
goog.net.BrowserChannel.MAGIC_RESPONSE_COOKIE = 'y2f%';


/**
 * Allows the application to set an execution hooks for when BrowserChannel
 * starts processing requests. This is useful to track timing or logging
 * special information. The function takes no parameters and return void.
 *
 * @param {Function} startHook  The function for the start hook
 */
goog.net.BrowserChannel.setStartThreadExecutionHook = function(startHook) {
  goog.net.BrowserChannel.startExecutionHook_ = startHook;
};


/**
 * Allows the application to set an execution hooks for when BrowserChannel
 * stops processing requests. This is useful to track timing or logging
 * special information. The function takes no parameters and return void.
 *
 * @param {Function} endHook  The function for the end hook
 */
goog.net.BrowserChannel.setEndThreadExecutionHook = function(endHook) {
  goog.net.BrowserChannel.endExecutionHook_ = endHook;
};


/**
 * Application provided execution hook for the start hook.
 *
 * @type function
 * @private
 */
goog.net.BrowserChannel.startExecutionHook_ = function() { };


/**
 * Application provided execution hook for the end hook.
 *
 * @type function
 * @private
 */
goog.net.BrowserChannel.endExecutionHook_ = function() { };


/**
 * Starts the channel. This initiates connections to the server.
 *
 * @param {String} testPath    The path for the test connection.
 * @param {String} channelPath The path for the channel connection.
 * @param {Map}    extraParams Extra parameter keys and values to add to the
 *                             requests
 */
goog.net.BrowserChannel.prototype.connect = function(testPath, channelPath,
                                                     extraParams) {
  goog.net.ChannelDebug.debug('connect()');

  goog.net.BrowserChannel.notifyStatEvent(
      goog.net.BrowserChannel.Stat.CONNECT_ATTEMPT);

  this.path_ = channelPath;
  this.extraParams_ = extraParams;
  this.connectTest_(testPath);
};


/**
 * Disconnects and closes the channel.
 */
goog.net.BrowserChannel.prototype.disconnect = function() {
  goog.net.ChannelDebug.debug('disconnect()');

  this.cancelRequests_();

  if (this.state_ == goog.net.BrowserChannel.State.OPENED) {
    var rid = this.nextRid_++;
    var uri = this.forwardChannelUri_.clone();
    uri.setParameterValue('SID', this.sid_);
    uri.setParameterValue('RID', rid);
    uri.setParameterValue('TYPE', 'terminate');
    var request = new goog.net.ChannelRequest(this, this.sid_, rid);
    request.imgTagGet(uri);
    this.onClose_();
  }
};


/**
 * Returns the session id of the channel. Only available after the
 * channel has been opened.
 */
goog.net.BrowserChannel.prototype.getSessionId = function() {
  return this.sid_;
};


/**
 * Starts the test channel to determine network conditions.
 *
 * @param {String} testPath  The relative PATH for the test connection.
 * @private
 */
goog.net.BrowserChannel.prototype.connectTest_ = function(testPath) {
  goog.net.ChannelDebug.debug('connectTest_()');
  this.connectionTest_ = new goog.net.BrowserTestChannel(this);
  this.connectionTest_.connect(testPath);
};


/**
 * Starts the regular channel which is run after the test channel is complete.
 * @private
 */
goog.net.BrowserChannel.prototype.connectChannel_ = function() {
  goog.net.ChannelDebug.debug('connectChannel_()');
  this.ensureInState_(goog.net.BrowserChannel.State.INIT);
  this.forwardChannelUri_ =
      this.getForwardChannelUri(this.path_);
  this.ensureForwardChannel_();
};


/**
 * Cancels all outstanding requests.
 * @private
 */
goog.net.BrowserChannel.prototype.cancelRequests_ = function() {
  if (this.backChannelRequest_) {
    this.backChannelRequest_.cancel();
    this.backChannelRequest_ = null;
  }

  if (this.forwardChannelRequest_) {
    this.forwardChannelRequest_.cancel();
    this.forwardChannelRequest_ = null;
  }
};


/**
 * Returns the handler used for channel callback events.
 *
 * @return {goog.net.BrowserChannel.Handler} The handler
 */
goog.net.BrowserChannel.prototype.getHandler = function() {
  return this.handler_;
};


/**
 * Sets the handler used for channel callback events.
 *
 * @param {goog.net.BrowserChannel.Handler} handler The handler to set
 */
goog.net.BrowserChannel.prototype.setHandler = function(handler) {
  this.handler_ = handler;
};


/**
 * Returns whether the channel allows the use of a subdomain. There may be
 * cases where this isn't allowed.
 *
 * @return {Boolean} Whether a host prefix is allowed.
 */
goog.net.BrowserChannel.prototype.getAllowHostPrefix = function() {
  return this.allowHostPrefix_;
};


/**
 * Sets whether the channel allows the use of a subdomain. There may be cases
 * where this isn't allowed, for example, logging in with troutboard where
 * using a subdomain causes Apache to force the user to authenticate twice.
 *
 * @param {Boolean} allowHostPrefix Whether a host prefix is allowed.
 */
goog.net.BrowserChannel.prototype.setAllowHostPrefix =
    function(allowHostPrefix) {
  this.allowHostPrefix_ = allowHostPrefix;
};


/**
 * Returns whether chunked mode is allowed. In certain debugging sitautions,
 * it's useful for the application to have a way to disable chunked mode for a
 * user.
 *
 * @return {Boolean} Whether chunked mode is allowed.
 */
goog.net.BrowserChannel.prototype.getAllowChunkedMode =
    function() {
  return this.allowChunkedMode_;
};


/**
 * Sets whether chunked mode is allowed. In certain debugging sitautions, it's
 * useful for the application to have a way to disable chunked mode for a user.
 *
 * @param {Boolean} allowChunkedMode  Whether chunked mode is allowed.
 */
goog.net.BrowserChannel.prototype.setAllowChunkedMode =
    function(allowChunkedMode) {
  this.allowChunkedMode_ = allowChunkedMode;
};


/**
 * Sends a request to the server. The format of the request is a Map data
 * structure of key/value pairs. These maps are then encoded in a format
 * suitable for the wire and then reconstituted as a Map data structure that
 * the server can process.
 *
 * @param {Object|goog.struct.map} map  The map to send.
 */
goog.net.BrowserChannel.prototype.sendMap = function(map) {
  if (this.state_ == goog.net.BrowserChannel.State.CLOSED) {
    throw Error('Invalid operation: sending map when state is closed');
  }

  this.outgoingMaps_.push(map);
  if (this.state_ == goog.net.BrowserChannel.State.OPENING ||
      this.state_ == goog.net.BrowserChannel.State.OPENED) {
    this.ensureForwardChannel_();
  }
};


/**
 * Returns whether the channel is closed
 *
 * @return {Boolean} true if the channel is closed.
 */
goog.net.BrowserChannel.prototype.isClosed = function() {
  return this.state_ == goog.net.BrowserChannel.State.CLOSED;
};


/**
 * Returns the browser channel state.
 *
 * @return {goog.net.BrowserChannel.State} The current state of the browser
 * channel
 */
goog.net.BrowserChannel.prototype.getState = function() {
  return this.state_;
};


/**
 * Returns whether there are outstanding requests servicing the channel.
 *
 * @return {Boolean} true if there are outstanding requests.
 */
goog.net.BrowserChannel.prototype.hasOutstandingRequests = function() {
  return this.outstandingRequests_() != 0;
};


/**
 * Returns the number of outstanding requests.
 *
 * @return {Number} The number of outstanding requests to the server.
 * @private
 */
goog.net.BrowserChannel.prototype.outstandingRequests_ = function() {
  var count = 0;
  if (this.backChannelRequest_) {
    count++;
  }
  if (this.forwardChannelRequest_) {
    count++;
  }
  return count;
};


/**
 * Ensures that a forward channel request is scheduled.
 *
 * @private
 */
goog.net.BrowserChannel.prototype.ensureForwardChannel_ = function() {
  if (this.forwardChannelRequest_) {
    // connection in process - no need to start a new request
    return;
  }

  if (this.forwardChannelTimerId_) {
    // no need to start a new request - one is already scheduled
    return;
  }

  this.forwardChannelTimmerId_ = goog.net.BrowserChannel.setTimeout(
      this.onStartForwardChannelTimer_.bind(this), 0);
};


/**
 * Timer callback for ensureForwardChannel
 *
 * @private
 */
goog.net.BrowserChannel.prototype.onStartForwardChannelTimer_ = function() {
  this.forwardChannelTimmerId_ = null;
  this.startForwardChannel_();
};


/**
 * Begins a new forward channel operation to the server.
 *
 * @private
 */
goog.net.BrowserChannel.prototype.startForwardChannel_ = function() {
  goog.net.ChannelDebug.debug('startForwardChannel_');

  if (this.state_ == goog.net.BrowserChannel.State.INIT) {
    this.open_();
    this.state_ = goog.net.BrowserChannel.State.OPENING;
  } else if (this.state_ == goog.net.BrowserChannel.State.OPENED) {
    // make sure there is a connection open to receive data
    this.ensureBackChannel_();

    if (!this.okToMakeRequest_()) {
      // channel is cancelled
      return;
    }

    if (this.outgoingMaps_.length == 0) {
      goog.net.ChannelDebug.debug('startForwardChannel_ returned: ' +
                                  'nothing to send');
      // no need to start a new forward channel request
      return;
    }

    if (this.forwardChannelRequest_) {
      goog.net.ChannelDebug.debug('startForwardChannel_ returned: ' +
                                  'connection already in progress');
      // no need to start a new forward channel request
      return;
    }

    this.makeForwardChannelRequest_();
    goog.net.ChannelDebug.debug('startForwardChannel_ finished, sent request');
  }
};


/**
 * Establishes a new channel session with the the server.
 *
 * @private
 */
goog.net.BrowserChannel.prototype.open_ = function() {
  goog.net.ChannelDebug.debug('open_()');
  this.state_ = goog.net.BrowserChannel.State.OPENING;
  this.nextRid_ = Math.floor(Math.random() * 100000);

  var rid = this.nextRid_++;
  var request = new goog.net.ChannelRequest(this, '', rid);
  var requestText = this.dequeueOutgoingMaps_();
  var uri = this.forwardChannelUri_.clone();
  uri.setParameterValue('VER', '4');
  uri.setParameterValue('RID', rid);
  if (this.clientVersion_) {
   uri.setParameterValue('CVER', this.clientVersion_);
  }
  request.xmlHttpPost(uri, requestText, true);
  this.forwardChannelRequest_ = request;
};


/*
 * Makes a forward channel request using XMLHTTP.
 *
 * @private
 */
goog.net.BrowserChannel.prototype.makeForwardChannelRequest_ = function() {
  var rid = this.nextRid_++;
  var uri = this.forwardChannelUri_.clone();
  uri.setParameterValue('VER', 2);
  uri.setParameterValue('SID', this.sid_);
  uri.setParameterValue('RID', rid);
  var requestText = this.dequeueOutgoingMaps_();
  var request = new goog.net.ChannelRequest(this, this.sid_, rid);
  request.setMaxRetries(goog.net.BrowserChannel.FORWARD_CHANNEL_MAX_RETRIES);
  request.setRetryTimeout(
      goog.net.BrowserChannel.FORWARD_CHANNEL_RETRY_TIMEOUT);
  this.forwardChannelRequest_ = request;
  request.xmlHttpPost(uri, requestText, true);
};


/**
 * Returns the request text from the outgoing maps and resets it.
 *
 * @return {String} The encoded request text created from all the currently
 *                  queued outgoing maps.
 * @private
 */
goog.net.BrowserChannel.prototype.dequeueOutgoingMaps_ = function() {
  var sb = ['count=' + this.outgoingMaps_.length];
  for (var i=0; i < this.outgoingMaps_.length; i++) {
    var map = this.outgoingMaps_[i];
    goog.structs.forEach(map, function(value, key, coll) {
      sb.push('req' + i + '_' + key + '=' + encodeURIComponent(value));
    });
  }
  this.outgoingMaps_.length = 0;
  return sb.join('&');
};


/**
 * Ensures there is a backchannel request for receiving data from the server.
 *
 * @private
 */
goog.net.BrowserChannel.prototype.ensureBackChannel_ = function() {
  if (this.backChannelRequest_) {
    // already have one
    return;
  }

  if (!this.okToMakeRequest_()) {
    // channel is cancelled
    return;
  }

  goog.net.ChannelDebug.debug('Creating new HttpRequest');
  this.backChannelRequest_ =
      new goog.net.ChannelRequest(this, this.sid_, 'rpc');
  var uri = this.backChannelUri_.clone();
  uri.setParameterValue('RID', 'rpc');
  uri.setParameterValue('SID', this.sid_);
  uri.setParameterValue('CI', this.useChunked_ ? '0' : '1');
  uri.setParameterValue('AID', this.lastArrayId_);

  if (goog.userAgent.IE) {
    uri.setParameterValue('TYPE', 'html');
    this.backChannelRequest_.tridentGet(uri, Boolean(this.hostPrefix_));
  } else {
    uri.setParameterValue('TYPE', 'xmlhttp');
    this.backChannelRequest_.setMaxRetries(
        goog.net.BrowserChannel.BACK_CHANNEL_XMHTTP_MAX_RETRIES);
    this.backChannelRequest_.xmlHttpGet(uri, true);
  }
  goog.net.ChannelDebug.debug('New Request created');
};


/**
 * Gives the handler a chance to return an error code and stop channel
 * execution. A handler might want to do this to check that the user is still
 * logged in, for example.
 *
 * @private
 */
goog.net.BrowserChannel.prototype.okToMakeRequest_ = function() {
  if (this.handler_) {
    var result = this.handler_.okToMakeRequest(this);
    if (result != goog.net.BrowserChannel.Error.OK) {
      goog.net.ChannelDebug.debug('Handler returned error code from ' +
                                  'okToMakeRequest');
      this.signalError_(result);
      return false;
    }
  }
  return true;
};


/**
 * Callback from BrowserTestChannel for when the channel is finished.
 *
 * @param {goog.net.BrowserTestChannel} testChannel The BrowserTestChannel
 * @param {Boolean} useChunked  Whether we can chunk responses
 */
goog.net.BrowserChannel.prototype.testConnectionFinished =
    function(testChannel, useChunked) {
  goog.net.ChannelDebug.debug('Test Connection Finished');

  this.useChunked_ = this.allowChunkedMode_ && useChunked;
  this.connectChannel_();
};


/**
 * Callback from BrowserTestChannel for when the channel has an error.
 *
 * @param {goog.net.BrowserTestChannel} testChannel The BrowserTestChannel
 * @param {Number} errorCode  The error code of the failure.
 */
goog.net.BrowserChannel.prototype.testConnectionFailure =
    function(testConnection, errorCode) {
  goog.net.ChannelDebug.debug('Test Connection Failed');
  this.signalError_(goog.net.BrowserChannel.Error.REQUEST_FAILED);
};


/**
 * Callback from BrowserTestChannel for when the channel is blocked.
 *
 * @param {goog.net.BrowserTestChannel} testChannel The BrowserTestChannel
 */
goog.net.BrowserChannel.prototype.testConnectionBlocked =
    function(testConnection) {
  goog.net.ChannelDebug.debug('Test Connection Blocked');
  this.signalError_(goog.net.BrowserChannel.Error.BLOCKED);
};


/**
 * Callback from ChannelRequest for when new data is received
 *
 * @param {ChannelRequest} request  The request object.
 * @param {String} responseText The text of the response.
 */
goog.net.BrowserChannel.prototype.onRequestData =
    function(request, responseText) {
  if (this.state_ == goog.net.BrowserChannel.State.CLOSED ||
      (this.backChannelRequest_ != request &&
       this.forwardChannelRequest_ != request)) {
    // either CLOSED or a request we don't know about (perhaps an old request)
    return;
  }

  if (this.forwardChannelRequest_ == request &&
      this.state_ == goog.net.BrowserChannel.State.OPENED) {
    // expect magic cookie in response
    if (responseText != goog.net.BrowserChannel.MAGIC_RESPONSE_COOKIE) {
      goog.net.ChannelDebug.debug('Bad data returned - missing/invald ' +
                                  'magic cookie');
      this.signalError_(goog.net.BrowserChannel.Error.BAD_RESPONSE);
    }
  } else {
    if (!goog.string.isEmpty(responseText)) {
      var respArray = goog.json.parse(responseText);
      this.onInput_(respArray);
    }
  }
};


/**
 * Callback from ChannelRequest that indicates a request has completed.
 *
 * @param {ChannelRequest} request  The request object.
 */
goog.net.BrowserChannel.prototype.onRequestComplete =
    function(request) {
  goog.net.ChannelDebug.debug('Request complete');
  var foundRequest = false;
  if (this.backChannelRequest_ == request) {
    this.backChannelRequest_ = null;
    foundRequest = true;
  } else if (this.forwardChannelRequest_ == request) {
    this.forwardChannelRequest_ = null;
    foundRequest = true;
  }

  // return if it was an old request from a previous session
  if (!foundRequest) {
    return;
  }

  if (this.state_ == goog.net.BrowserChannel.State.CLOSED) {
    return;
  }

  if (!request.getSuccess()) {
    goog.net.ChannelDebug.debug('Error: HTTP request failed');
    switch (request.getLastError()) {
      case goog.net.ChannelRequest.ERROR_NO_DATA:
        this.signalError_(goog.net.BrowserChannel.Error.NO_DATA);
        break;
      case goog.net.ChannelRequest.ERROR_BAD_DATA:
        this.signalError_(goog.net.BrowserChannel.Error.BAD_DATA);
        break;
      case goog.net.ChannelRequest.ERROR_UNKNOWN_SESSION_ID:
        this.signalError_(goog.net.BrowserChannel.Error.UNKNOWN_SESSION_ID);
        break;
      default:
        this.signalError_(goog.net.BrowserChannel.Error.REQUEST_FAILED);
        break;
    }
    return;
  }

  this.ensureForwardChannel_();
};


/**
 * Proceses the data returned by the server.
 *
 * @param {Array} respArray The response array returned by the server.
 * @private
 */
goog.net.BrowserChannel.prototype.onInput_ = function(respArray) {
  // respArray is an array of arrays
  for (var i = 0; i < respArray.length; i++) {
    var nextArray = respArray[i];
    this.lastArrayId_ = nextArray[0];
    nextArray = nextArray[1];
    if (this.state_ == goog.net.BrowserChannel.State.OPENING) {
      if (nextArray[0] == 'c') {
        this.sid_ = nextArray[1];
        if (this.allowHostPrefix_) {
          this.hostPrefix_ = nextArray[2];
        } else {
          this.hostPrefix_ = null;
        }
        this.state_ = goog.net.BrowserChannel.State.OPENED;
        if (this.handler_) {
          this.handler_.channelOpened(this);
        }
        this.backChannelUri_ = this.getBackChannelUri(
            this.hostPrefix_, this.path_);
      } else if (nextArray[0] == 'stop') {
        this.signalError_(goog.net.BrowserChannel.Error.STOP);
      }
    } else if (this.state_ == goog.net.BrowserChannel.State.OPENED) {
      if (nextArray[0] == 'stop') {
        this.signalError_(goog.net.BrowserChannel.Error.STOP);
      } else if (nextArray[0] == 'noop') {
        // ignore - noop to keep connection happy
      } else {
        if (this.handler_) {
          this.handler_.channelHandleArray(this, nextArray);
        }
      }
    }
  }
};


/**
 * Helper to ensure the BrowserChannel is in the expected state.
 *
 * @param {Number} state The expected state.
 * @private
 */
goog.net.BrowserChannel.prototype.ensureInState_ = function(state) {
  if (this.state_ != state) {
    throw Error('Invalid operation: expected channel state ' + state +
      ' got channel state ' + this.state_);
  }
};


/**
 * Signals an error has occurred.
 *
 * @param {Number} error  The error code for the failure.
 * @private
 */
goog.net.BrowserChannel.prototype.signalError_ = function(error) {
  goog.net.ChannelDebug.info('Error code ' + error);
  if (error == goog.net.BrowserChannel.Error.REQUEST_FAILED ||
      error == goog.net.BrowserChannel.Error.BLOCKED) {
    // Ping google to check if it's a gmail error or user's network error
    goog.net.testGoogleCom(this.testGoogleComCallback_.bind(this, error));
  } else {
    this.onError_(error);
  }
};


/**
 * Callback for testGoogleCom during error handling.
 *
 * @private
 */
goog.net.BrowserChannel.prototype.testGoogleComCallback_ =
    function (error, networkUp) {
  if (networkUp) {
    goog.net.ChannelDebug.info('Successfully pinged google.com');
    this.onError_(error);
  } else {
    goog.net.ChannelDebug.info('Failed to ping google.com');
    this.onError_(goog.net.BrowserChannel.Error.NETWORK);
  }
};


/**
 * Called when we've determined the final error for a channel. It closes the
 * notifiers the handler of the error and closes the channel.
 *
 * @param {Number} error  The error code for the failure.
 * @private
 */
goog.net.BrowserChannel.prototype.onError_ = function(error) {
  goog.net.ChannelDebug.debug('HttpChannel: error - ' + error);
  if (error == goog.net.BrowserChannel.Error.NETWORK) {
    goog.net.BrowserChannel.notifyStatEvent(
        goog.net.BrowserChannel.Stat.ERROR_NETWORK);
  } else {
    goog.net.BrowserChannel.notifyStatEvent(
        goog.net.BrowserChannel.Stat.ERROR_OTHER);
  }
  this.state_ = goog.net.BrowserChannel.State.CLOSED;
  if (this.handler_) {
    this.handler_.channelError(this, error);
  }
  this.onClose_();
  this.cancelRequests_();
};


/**
 * Called when the channel has been closed. It notifiers the handler of the
 * event.
 *
 * @private
 */
goog.net.BrowserChannel.prototype.onClose_ = function() {
  this.state_ = goog.net.BrowserChannel.State.CLOSED;
  if (this.handler_) {
    this.handler_.channelClosed(this);
  }
};


/**
  * Gets the Uri used for the connection that sends data to the server.
  */
goog.net.BrowserChannel.prototype.getForwardChannelUri =
    function(path) {
  var uri = this.createDataUri(null, path);
  goog.net.ChannelDebug.debug('GetForwardChannelUri: ' + uri);
  return uri;
};


/**
  * Gets the Uri used for the connection that receives data from the server.
  */
goog.net.BrowserChannel.prototype.getBackChannelUri =
    function(hostPrefix, path) {
  var uri = this.createDataUri(goog.userAgent.IE ? hostPrefix : null, path);
  goog.net.ChannelDebug.debug('GetBackChannelUri: ' + uri);
  return uri;
};


/**
 *  Creates a data Uri applying logic for secondary hostprefix and port
 *  overrides.
 */
goog.net.BrowserChannel.prototype.createDataUri =
    function(hostPrefix, path, opt_overridePort) {
  var locationPage = window.location;
  var hostName;
  if (hostPrefix) {
    hostName = hostPrefix + '.' + locationPage.hostname;
  } else {
    hostName = locationPage.hostname;
  }

  var port = opt_overridePort || locationPage.port;

  var uri = goog.Uri.create(locationPage.protocol, null, hostName, port, path);
  if (this.extraParams_) {
    goog.structs.forEach(this.extraParams_, function(value, key, coll) {
      uri.setParameterValue(key, value);
    });
  }
  return uri;
};


/**
 * Wrapper around SafeTimeout which calls the start and end execution hooks
 * with a try...finally block.
 *
 * @param fn {Functon} The callback function
 * @param ms {Number} The time in MS for the timer.
 */
goog.net.BrowserChannel.setTimeout = function(fn, ms) {
  if (!goog.isFunction(fn)) {
    throw Error('Fn must not be null and must be a function');
  }
  return goog.global.setTimeout(function() {
    goog.net.BrowserChannel.onStartExecution();
    try {
      fn();
    } finally {
      goog.net.BrowserChannel.onEndExecution();
    }
  }, ms);
};


/**
 * Helper function to call the start hook
 */
goog.net.BrowserChannel.onStartExecution = function() {
  goog.net.BrowserChannel.startExecutionHook_();
};


/**
 * Helper function to call the end hook
 */
goog.net.BrowserChannel.onEndExecution = function() {
  goog.net.BrowserChannel.endExecutionHook_();
};


/**
 * Returns the singleton event target for stat events.
 * @return {goog.events.EventTarget} The event target for stat events
 */
goog.net.BrowserChannel.getStatEventTarget = function() {
  return goog.net.BrowserChannel.statEventTarget_;
};


/**
 * Helper function tocall the stat event callback.
 *
 * @param {goog.net.BrowserChannel.Stat} stat The stat.
 */
goog.net.BrowserChannel.notifyStatEvent = function(stat) {
  var target = goog.net.BrowserChannel.statEventTarget_;
  target.dispatchEvent(
      new goog.net.BrowserChannel.StatEvent(target, stat));
};


/**
 * A LogSaver that can be used to accumulate all the debug logs for
 * BrowserChannels so they can be sent to the server when a problem is
 * detected.
 * @return {Boolean} Whether saving is enabled or disabled
 */
goog.net.BrowserChannel.LogSaver = {};

/**
 * Buffer for accumulating the debug log
 * @type goog.structs.CircularBuffer
 * @private
 */
goog.net.BrowserChannel.LogSaver.buffer_ =
    new goog.structs.CircularBuffer(1000);

/**
 * Whether we're currently accumulating the debug log.
 * @type Boolean
 * @private
 */
goog.net.BrowserChannel.LogSaver.enabled_ = false;


/**
 * Formatter for saving logs.
 * @type goog.debug.Formatter
 * @private
 */
goog.net.BrowserChannel.LogSaver.formatter_ = new goog.debug.TextFormatter();

/**
 * Returns whether the LogSaver is enabled.
 * @return {Boolean} Whether saving is enabled or disabled
 */
goog.net.BrowserChannel.LogSaver.isEnabled = function() {
  return goog.net.BrowserChannel.LogSaver.enabled_
};


/**
 * Enables of disables the LogSaver.
 * @param {Boolean} enable Whether to enable or disable saving
 */
goog.net.BrowserChannel.LogSaver.setEnabled = function(enable) {
  if (enable == goog.net.BrowserChannel.LogSaver.enabled_) {
    return;
  }

  var fn = goog.net.BrowserChannel.LogSaver.onPublish_;
  var logger = goog.debug.Logger.getLogger('goog.net');
  if (enable) {
    logger.addHandler(fn);
  } else {
    logger.removeHandler(fn);
  }
};


/**
 * Handler for the publish event from the root logger.
 * @param {goog.debug.LogRecord} logRecord the LogRecord
 */
goog.net.BrowserChannel.LogSaver.onPublish_ = function(logRecord) {
  goog.net.BrowserChannel.LogSaver.buffer_.add(
      goog.net.BrowserChannel.LogSaver.formatter_.formatRecord(logRecord));
};

/**
 * Returns the log as a single string.
 * @return {String} The log as a single string
 */
goog.net.BrowserChannel.LogSaver.getBuffer = function() {
  return goog.net.BrowserChannel.LogSaver.buffer_.getValues().join('');
};


/**
 * Clears the buffer
 */
goog.net.BrowserChannel.LogSaver.clearBuffer = function() {
  goog.net.BrowserChannel.LogSaver.buffer_.clear();
};

/**
 * Interface for the browser channel handler
 * @constructor
 * @abstract
 */
goog.net.BrowserChannel.Handler = function() {
};

/**
 * Whether it's okay to make a request to the server. A handler can return
 * false if the channel should fail. For example, if the user has logged out,
 * the handler may want all requests to fail immediately.
 *
 * @param {goog.net.BrowserChannel} browserChannel The browser channel
 * @return {goog.net.BrowserChannel.Error} An error code. The code should
 * return goog.net.BrowserChannel.Error.OK to indicate it's okay. Any other
 * error code will cause a failure.
 */
goog.net.BrowserChannel.Handler.prototype.okToMakeRequest =
    function(browserChannel) {
  return goog.net.BrowserChannel.Error.OK;
};


/**
 * Indicates the BrowserChannel has successfully negotiated with the server
 * and can now send and receive data.
 *
 * @param {goog.net.BrowserChannel} browserChannel The browser channel
 */
goog.net.BrowserChannel.Handler.prototype.channelOpened =
    function(browserChannel) {
};


/**
 * New input is available for the application to process.
 *
 * @param {goog.net.BrowserChannel} browserChannel The browser channel
 * @param {Array} array The data array
 */
goog.net.BrowserChannel.Handler.prototype.channelHandleArray =
    function(browserChannel, array) {

};


/**
 * Indicates an error occurred on the BrowserChannel.
 *
 * @param {goog.net.BrowserChannel} browserChannel The browser channel
 * @param {goog.net.BrowserChannel.Error} error The error code
 */
goog.net.BrowserChannel.Handler.prototype.channelError =
    function(browserChannel, error) {
};


/**
 * Indicates the BrowserChannel is closed.
 *
 * @param {goog.net.BrowserChannel} browserChannel The browser channel
 */
goog.net.BrowserChannel.Handler.prototype.channelClosed =
    function(browserChannel) {
};