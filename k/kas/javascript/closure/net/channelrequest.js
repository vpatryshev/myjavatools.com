// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the ChannelRequest class. The ChannelRequest
 * object encapsulates the logic for making a single request, either for the
 * forward channel, back channel, or test channel, to the server. It contains
 * the logic for the three types of transports we use in the BrowserChannel:
 * XMLHTTP, Trident ActiveX (ie only), and Image request. It provides retry
 * and timeout detection. This class is part of the BrowserChannel
 * implementation and is not for use by normal application code.
 *
 * @author Jon Perlow (jonp@google.com)
 */

/**
 * Namespace for BrowserChannel
 */
goog.provide('goog.net.ChannelRequest');
goog.require('goog.userAgent');
goog.require('goog.net.XmlHttp');
goog.require('goog.net.XhrLite');
goog.require('goog.net.tmpnetwork');

/**
 * Creates a ChannelRequest object which encapsulates a request to the server.
 * A new ChannelRequest is created for each request to the server.
 *
 * @param {BrowserChannel} channel  The BrowserChannel that owns this request.
 * @param {String} opt_sessionId  The session id for the channel.
 * @param {String} opt_requestId  The request id for this request.
 */
goog.net.ChannelRequest = function(channel, opt_sessionId, opt_requestId) {
  /**
   * The BrowserChannel object that owns the request.
   * @type BrowserChannel or BrowserTestChannel
   * @private
   */
  this.channel_ = channel;

  /**
   * The Session ID for the channel.
   * @type String
   * @private
   */
  this.sid_ = opt_sessionId;

  /**
   * The RID (request ID) for the request.
   * @type String
   * @private
   */
  this.rid_ = opt_requestId;

  /**
   * The timeout in ms before retrying the request or failing.
   * @type Number
   * @private
   */
  this.retryTimeout_ = goog.net.ChannelRequest.TIMEOUT_MS;
};

/**
 * The maximum number of attempts to retry the request before failing.
 * @type Number
 * @private
 */
goog.net.ChannelRequest.prototype.maxRetries_ = 0;

/**
 * Whether the request was successful. This is only set to true after the
 * request successfuly completes.
 * @type Boolean
 * @private
 */
goog.net.ChannelRequest.prototype.successful_ = false;

/**
 * The TimerID of the timer used to detect if the request has timed-out.
 * @type Number
 * @private
 */
goog.net.ChannelRequest.prototype.watchDogTimerId_ = null;

/**
 * The time in the future when the request will timeout.
 * @type Number
 * @private
 */
goog.net.ChannelRequest.prototype.watchDogTimeoutTime_ = null;

/**
 * The attempt number of the current request.
 * @type Number
 * @private
 */
goog.net.ChannelRequest.prototype.retryCount_ = 0;

/**
 * The type of request (XMLHTTP, IMG, Trident)
 * @type Number
 * @private
 */
goog.net.ChannelRequest.prototype.type_ = null;

/**
 * The base Uri for the request. The includes all the parameters except the
 * one that indicates the retry number.
 * @type Uri
 * @private
 */
goog.net.ChannelRequest.prototype.baseUri_ = null;

/**
 * The request Uri that was actually used for the most recent request attempt.
 */
goog.net.ChannelRequest.prototype.requestUri_ = null;

/**
 * The post data, if the request is a post.
 * @type String
 * @private
 */
goog.net.ChannelRequest.prototype.postData_ = null;

/**
 * The XhrLte request if the request is using XMLHTTP
 * @type goog.net.XhrLite
 * @private
 */
goog.net.ChannelRequest.prototype.xmlHttp_ = null;

/**
 * The position of where the next unprocessed chunk starts in the response
 * text.
 * @type Number
 * @private
 */
goog.net.ChannelRequest.prototype.xmlHttpChunkStart_ = null;

/**
 * The Trident instance if the request is using Trident.
 * @type Htmlfile
 * @private
 */
goog.net.ChannelRequest.prototype.trident_ = null;

/**
 * The verb (Get or Post) for the request.
 * @type String
 * @private
 */
goog.net.ChannelRequest.prototype.verb_ = null;

/**
 * The last error if the request failed.
 * @type Number
 * @private
 */
goog.net.ChannelRequest.prototype.lastError_ = null;

/**
 * Whether to send the Connection:close header as part of the request.
 * @type Boolean
 * @private
 */
goog.net.ChannelRequest.prototype.sendClose_ = true;

/**
 * Whether the request has been cancelled due to a call to cancel.
 * @type Boolean
 * @private
 */
goog.net.ChannelRequest.prototype.cancelled_ = false;

/**
 * Default timeout in MS for a request. The server must return data within this
 * time limit for the request to not timeout.
 * @type Number
 */
goog.net.ChannelRequest.TIMEOUT_MS = 45000;

/**
 * Default timeout in MS between retries.
 * @type Number
 */
goog.net.ChannelRequest.RETRY_DELAY_MS = 2000;

/**
 * Enum for channel requests type
 * @private
 */
goog.net.ChannelRequest.Type = {};

/**
 * Value indicates this is an XMLHTTP request.
 * @type goog.net.ChannelRequest.Type
 * @private
 */
goog.net.ChannelRequest.Type.XML_HTTP = 1;

/**
 * Value indicates this is an IMG request.
 * @type goog.net.ChannelRequest.Type
 * @private
 */
goog.net.ChannelRequest.Type.IMG = 2;

/**
 * Value indicates this is a request that uses the MSHTML ActiveX control.
 * @type goog.net.ChannelRequest.Type
 * @private
 */
goog.net.ChannelRequest.Type.TRIDENT = 3;


/**
 * Enum type for identifying a ChannelRequest error.
 * @type enum
 */
goog.net.ChannelRequest.Error = {};

/**
 * Value indicates a request error due to a non-200 status code.
 * @type goog.net.ChannelRequest.Error
 */
goog.net.ChannelRequest.Error.STATUS = 0;

/**
 * Value indicates a request error due to no data being returned.
 * @type goog.net.ChannelRequest.Error
 */
goog.net.ChannelRequest.Error.NO_DATA = 1;

/**
 * Value indicates a request error due to a timeout.
 * @type goog.net.ChannelRequest.Error
 */
goog.net.ChannelRequest.Error.TIMEOUT = 2;

/**
 * Value indicates a request error due to the server returning an unknown
 * Session ID.
 * @type goog.net.ChannelRequest.Error
 */
goog.net.ChannelRequest.Error.UNKNOWN_SESSION_ID = 3;

/**
 * Value indicates a request error due to bad data being received.
 * @type goog.net.ChannelRequest.Error
 */
goog.net.ChannelRequest.Error.BAD_DATA = 4;

/**
 * Value indicates a request error due to the handler throwing an exception.
 * @type goog.net.ChannelRequest.Error
 */
goog.net.ChannelRequest.Error.HANDLER_EXCEPTION = 5;

/**
 * Sentinel value used to indicate an invalid chunk in a multi-chunk response.
 * @type Object
 * @private
 */
goog.net.ChannelRequest.INVALID_CHUNK = {};

/**
 * Sentinel value used to indicate an incomplete chunk in a multi-chunk
 * response.
 * @type Object
 * @private
 */
goog.net.ChannelRequest.INCOMPLETE_CHUNK = {};


/**
 * Sets the maximum number of retries for a request.
 *
 * @param {Number} maxRetries The maximum number of retries for a request.
 */
goog.net.ChannelRequest.prototype.setMaxRetries =  function(maxRetries) {
    this.maxRetries_ = maxRetries;
};


/**
 * Sets the retry timeout for a request
 *
 * @param {Number} retryTimeout   The timeout in MS for when we either retry the
 *                                request or fail.
 */
goog.net.ChannelRequest.prototype.setRetryTimeout = function(retryTimeout) {
  this.retryTimeout_ = retryTimeout;
};


/**
 * Uses XMLHTTP to send an HTTP POST to the server.
 *
 * @param {Uri} uri               The uri of the request.
 * @param {String} postData       The data for the post body.
 * @param {Boolean} decodeChunks  Whether to the result is expected to be
 *                                encoded for chunking and thus requires
 *                                decoding.
 */
goog.net.ChannelRequest.prototype.xmlHttpPost = function(uri, postData,
                                                         decodeChunks) {
  this.type_ = goog.net.ChannelRequest.Type.XML_HTTP;
  this.baseUri_ = goog.net.makeUniqueUri(uri);
  this.postData_ = postData;
  this.decodeChunks_ = decodeChunks;
  this.sendXmlHttp_();
};


/**
 * Uses XMLHTTP to send an HTTP GET to the server.
 *
 * @param {Uri} uri               The uri of the request.
 * @param {Boolean} decodeChunks  Whether to the result is expected to be
 *                                encoded for chunking and thus requires
 *                                decoding.
 * @param {Boolean} opt_noClose   Whether to request that the tcp/ip connection
 *                                should be closed.
 */
goog.net.ChannelRequest.prototype.xmlHttpGet = function(uri, decodeChunks,
                                                        opt_noClose) {
  this.type_ = goog.net.ChannelRequest.Type.XML_HTTP;
  this.baseUri_ = goog.net.makeUniqueUri(uri);
  this.postData_ = null;
  this.decodeChunks_ = decodeChunks;
  if (opt_noClose) {
    this.sendClose_ = false;
  }
  this.sendXmlHttp_();
};


/**
 * Sends a request via XMLHTTP according to the current state of the
 * ChannelRequest object.
 *
 * @private
 */
goog.net.ChannelRequest.prototype.sendXmlHttp_ =  function() {
  // clone the base URI to create the request URI. The request uri has the
  // attempt number as a parameter which helps in debugging.
  this.requestUri_ = this.baseUri_.clone();
  this.requestUri_.setParameterValues('t', this.retryCount_ + 1);

  // send the request either as a POST or GET
  this.xmlHttpChunkStart_ = 0;
  this.xmlHttp_ = new goog.net.XhrLite();
  this.xmlHttp_.setReadyStateChangeCallback(this.xmlHttpHandler_.bind(this,
      this.xmlHttp_));
  if (this.postData_) {
    // todo (jonp) - use POST constant when Dan defines it
    this.verb_ = 'POST';
    var headers = {};
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    this.xmlHttp_.send(this.requestUri_, this.verb_, this.postData_, headers);
  } else {
    // todo (jonp) - use GET constant when Dan defines it
    this.verb_ = 'GET';
    var headers = {};
    if (this.sendClose_) {
      headers['Connection'] = 'close';
    }
    this.xmlHttp_.send(this.requestUri_, this.verb_, null, headers);
  }
  goog.net.ChannelDebug.xmlHttpChannelRequest(this.verb_,
      this.requestUri_, this.rid_, this.retryCount_ + 1,
      this.postData_);
  this.ensureWatchDogTimer_();
};


/**
 * XmlHttp handler
 * @private
 */
goog.net.ChannelRequest.prototype.xmlHttpHandler_ = function(xmlhttp) {
  goog.net.BrowserChannel.onStartExecution();
  try {
    if (xmlhttp == this.xmlHttp_) {
      this.onXmlHttpReadyStateChanged_();
    } else {
      goog.net.ChannelDebug.warning('Called back with an ' +
                                    'unexpected xmlhttp');
    }
  } catch (e) {
    goog.net.ChannelDebug.debug('Failed call to ' +
                                'OnXmlHttpReadyStateChanged_');
    if (this.xmlHttp_ && this.xmlHttp_.getResponseText()) {
      goog.net.ChannelDebug.dumpException(e,
          'ResponseText: ' + this.xmlHttp_.getResponseText());
    } else {
      goog.net.ChannelDebug.dumpException(e, 'No response text');
    }
  } finally {
    goog.net.BrowserChannel.onEndExecution();
  }
};



/**
 * Called by the readystate handler for XMLHTTP requests.
 *
 * @private
 */
goog.net.ChannelRequest.prototype.onXmlHttpReadyStateChanged_ = function() {
  var readyState = this.xmlHttp_.getReadyState();
  if (goog.userAgent.IE) {
    if (readyState < goog.net.XmlHttp.ReadyState.COMPLETE) {
      // not yet ready
      return;
    }
  } else {
    // we get partial results in non-IE browsers on ready state interactive
    if (readyState < goog.net.XmlHttp.ReadyState.INTERACTIVE) {
      // not yet ready
      return;
    }
  }

  // got some data so cancel the watchdog timer
  this.cancelWatchDogTimer_();

  var status = this.xmlHttp_.getStatus();
  var responseText = this.xmlHttp_.getResponseText();
  if (!responseText) {
    goog.net.ChannelDebug.debug('No response text for uri ' +
        this.requestUri_ + ' status ' + status);
  }
  this.successful_ = (status == 200);

  goog.net.ChannelDebug.xmlHttpChannelResponseMetaData(this.verb_,
      this.requestUri_, this.rid_, this.retryCount_ + 1, readyState,
      status);

  if (!this.successful_) {
    if (status == 400 &&
        responseText.indexOf('Unknown SID') > 0) {
      // the server error string will include 'Unknown SID' which indicates the
      // server doesn't know about the session (maybe it got restarted, maybe
      // the user got moved to another server, etc.,). Handlers can special
      // case this error
      this.lastError_ = goog.net.ChannelRequest.Error.UNKNOWN_SESSION_ID;
      goog.net.BrowserChannel.notifyStatEvent(
          goog.net.BrowserChannel.Stat.REQUEST_UNKNOWN_SESSION_ID);
    } else {
      this.lastError_ = goog.net.ChannelRequest.Error.STATUS;
      goog.net.BrowserChannel.notifyStatEvent(
          goog.net.BrowserChannel.Stat.REQUEST_BAD_STATUS);
    }
    goog.net.ChannelDebug.xmlHttpChannelResponseText(this.rid_, responseText);
    this.cleanup_();
    this.maybeRetry_();
    return;
  }

  if (readyState == goog.net.XmlHttp.ReadyState.COMPLETE) {
    this.cleanup_();
  }

  if (this.decodeChunks_) {
    while (!this.cancelled_ &&
           this.xmlHttpChunkStart_ < responseText.length) {
      var chunkText = this.getNextChunk_(responseText);
      if (chunkText == goog.net.ChannelRequest.INCOMPLETE_CHUNK) {
        if (readyState == goog.net.XmlHttp.ReadyState.COMPLETE) {
          // should have consumed entire response when the request is done
          this.lastError_ = goog.net.ChannelRequest.Error.BAD_DATA;
          goog.net.BrowserChannel.notifyStatEvent(
              goog.net.BrowserChannel.Stat.REQUEST_INCOMPLETE_DATA);
          this.successful_ = false;
        }
        goog.net.ChannelDebug.xmlHttpChannelResponseText(this.rid_, null,
            '[Incomplete Response]');
        break;
      } else if (chunkText == goog.net.ChannelRequest.INVALID_CHUNK) {
        this.lastError_ = goog.net.ChannelRequest.Error.BAD_DATA;
        goog.net.BrowserChannel.notifyStatEvent(
            goog.net.BrowserChannel.Stat.REQUEST_BAD_DATA);
        goog.net.ChannelDebug.xmlHttpChannelResponseText(this.rid_,
            responseText, '[Invalid Chunk]');
        this.successful_ = false;
        break;
      } else {
        goog.net.ChannelDebug.xmlHttpChannelResponseText(this.rid_, chunkText,
            null);
        this.safeOnRequestData_(chunkText);
      }
    }
    if (readyState == goog.net.XmlHttp.ReadyState.COMPLETE &&
        responseText.length == 0) {
      // also an error if we didn't get any response
      this.lastError_ = goog.net.ChannelRequest.Error.NO_DATA;
      goog.net.BrowserChannel.notifyStatEvent(
          goog.net.BrowserChannel.Stat.REQUEST_NO_DATA);
      this.successful_ = false;
    }
  } else {
    goog.net.ChannelDebug.xmlHttpChannelResponseText(this.rid_, responseText,
        null);
    this.safeOnRequestData_(responseText);
  }

  if (!this.successful_) {
    // we can get set back to unsuccessful if the response
    // wasn't parsed correctly - we make this trigger retry logic
    goog.net.ChannelDebug.xmlHttpChannelResponseText(this.rid_, responseText,
        ['Invalid Chunked Response']);
    this.cleanup_();
    this.maybeRetry_();
    return;
  }

  if (!this.cancelled_) {
    if (readyState == goog.net.XmlHttp.ReadyState.COMPLETE) {
      this.channel_.onRequestComplete(this);
    } else {
      this.ensureWatchDogTimer_();
    }
  }
};


/**
 * Returns the next chunk of a chunk-encoded response. This is not standard
 * HTTP chunked encoding because browsers don't expose the chunk boundaries to
 * the application through XMLHTTP. So we have an additional chunk encoding at
 * the application level that lets us tell where the beginning and end of
 * individual responses are so that we can only try to eval a complete JS array.
 *
 * The encoding is the size of the chunk encoded as a decimal string followed
 * by a newline followed by the data.
 *
 * @param {String} responseText The response text from the XMLHTTP response.
 * @return {Object} The next chunk string or a sentinel object indicating a
 *                  special condition.
 * @private
 */
goog.net.ChannelRequest.prototype.getNextChunk_ = function(responseText) {
  var sizeStartIndex = this.xmlHttpChunkStart_;
  var sizeEndIndex = responseText.indexOf('\n', sizeStartIndex);
  if (sizeEndIndex == -1) {
    return goog.net.ChannelRequest.INCOMPLETE_CHUNK;
  }

  var sizeAsString = responseText.substring(sizeStartIndex, sizeEndIndex);
  var size = Number(sizeAsString);
  if (isNaN(size)) {
    return goog.net.ChannelRequest.INVALID_CHUNK;
  }

  var chunkStartIndex = sizeEndIndex + 1;
  if (chunkStartIndex + size > responseText.length) {
    return goog.net.ChannelRequest.INCOMPLETE_CHUNK;
  }

  var chunkText = responseText.substr(chunkStartIndex, size);
  this.xmlHttpChunkStart_ = chunkStartIndex + size;
  return chunkText;
};


/**
 * Uses the Trident htmlfile ActiveX control to send a GET request in IE. This
 * is the innovation Kevin Gibbs discovered that lets us get intermediate
 * results in Internet Explorer.
 */
goog.net.ChannelRequest.prototype.tridentGet =
    function(uri, usingSecondaryDomain) {
  this.type_ = goog.net.ChannelRequest.Type.TRIDENT;
  this.baseUri_ = goog.net.makeUniqueUri(uri);
  this.tridentGet_(usingSecondaryDomain);
};


/**
 * Starts the Trident request.
 *
 * @private
 */
goog.net.ChannelRequest.prototype.tridentGet_ =
    function(usingSecondaryDomain) {
  this.trident_ = new ActiveXObject('htmlfile');

  var hostname = '';
  var body = '<html>';
  if (usingSecondaryDomain) {
    hostname = window.location.hostname;
    body += '<script>document.domain="' + hostname + '"</script>';
  }
  body += '</html>';

  this.trident_.open();
  this.trident_.write(body);
  this.trident_.close();

  this.trident_.parentWindow.m = this.onTridentRpcMessage_.bind(this);
  this.trident_.parentWindow.d = this.onTridentDone_.bind(this, true);
  this.trident_.parentWindow.rpcClose = this.onTridentDone_.bind(this, false);

  var div = this.trident_.createElement('div');
  this.trident_.appendChild(div);
  this.requestUri_ = this.baseUri_.clone();
  this.requestUri_.setParameterValue('DOMAIN', hostname);
  this.requestUri_.setParameterValue('t', this.retryCount_ + 1);
  div.innerHTML = '<iframe src="' + this.requestUri_ + '"></iframe>';

  goog.net.ChannelDebug.tridentChannelRequest('GET',
      this.requestUri_, this.rid_, this.retryCount_ + 1);

  this.ensureWatchDogTimer_();
};


/**
 * Callback from the Trident htmlfile ActiveX control for when a new message
 * is received.
 *
 * @param {String} msg The data payload.
 * @private
 */
goog.net.ChannelRequest.prototype.onTridentRpcMessage_ = function(msg) {
  // need to do async b/c this gets called off of the context of the ActiveX
  goog.net.BrowserChannel.setTimeout(
      this.onTridentRpcMessageAsync_.bind(this, msg), 0);
};


/**
 * Callback from the Trident htmlfile ActiveX control for when a new message
 * is received.
 *
 * @param {String} msg  The data payload.
 * @private
 */
goog.net.ChannelRequest.prototype.onTridentRpcMessageAsync_ = function(msg) {
  if (this.cancelled_) {
    return;
  }
  goog.net.ChannelDebug.tridentChannelResponseText(this.rid_, msg);
  this.cancelWatchDogTimer_();
  this.safeOnRequestData_(msg);
  this.ensureWatchDogTimer_();
};


/**
 * Callback from the Trident htmlfile ActiveX control for when the request
 * is complete
 *
 * @param {Boolean} successful Whether the request successfully completed.
 * @private
 */
goog.net.ChannelRequest.prototype.onTridentDone_ = function(successful) {
  // need to do async b/c this gets called off of the context of the ActiveX
  goog.net.BrowserChannel.setTimeout(
      this.onTridentDoneAsync_.bind(this, successful), 0);
};


/**
 * Callback from the Trident htmlfile ActiveX control for when the request
 * is complete
 *
 * @param {Boolean} successful Whether the request successfully completed.
 * @private
 */
goog.net.ChannelRequest.prototype.onTridentDoneAsync_ = function(successful) {
  if (this.cancelled_) {
    return;
  }
  goog.net.ChannelDebug.tridentChannelResponseDone(this.rid_, successful);
  this.cancelWatchDogTimer_();
  this.cleanup_();
  this.successful_ = successful;
  this.channel_.onRequestComplete(this);
};


/**
 * Uses an IMG tag to send an HTTP get to the server. This is only currently
 * used to terminate the connection, as an IMG tag is the most reliable way to
 * send something to the server while the page is getting torn down.
 */
goog.net.ChannelRequest.prototype.sendUsingImgTag = function(uri) {
  this.type_ = goog.net.ChannelRequest.Type.IMG;
  this.baseUri_ = goog.net.makeUniqueUri(uri);
  this.sendUsingImgTag_();
};


/**
 * Starts the IMG request.
 *
 * @private
 */
goog.net.ChannelRequest.prototype.imgTagGet = function() {
  var eltImg = new Image();
  eltImg.src = this.baseUri_;
  this.ensureWatchDogTimer_();
};


/**
 * Cancels the request no matter what the underlying transport is.
 */
goog.net.ChannelRequest.prototype.cancel = function() {
  this.cancelled_ = true;
  this.cancelWatchDogTimer_();
  this.cleanup_();
};


/**
 * Ensures that there is watchdog timeout which is used to ensure that
 * the connection completes in time.
 *
 * @private
 */
goog.net.ChannelRequest.prototype.ensureWatchDogTimer_ = function() {
  this.watchDogTimeoutTime_ = goog.now() + this.retryTimeout_;
  this.startWatchDogTimer_(this.retryTimeout_);
};


/**
 * Starts the watchdog timer which is used to ensure that the connection
 * completes in time.
 *
 * @private
 */
goog.net.ChannelRequest.prototype.startWatchDogTimer_ = function(time) {
  if (this.watchDogTimerID_ != null) {
    // assertion
    throw Error('WatchDog timer not null');
  }
  this.watchDogTimerId_ = goog.net.BrowserChannel.setTimeout(
      this.onWatchDogTimout_.bind(this), time);
};


/**
 * Cancels the watchdog timer if it has been started
 *
 * @private
 */
goog.net.ChannelRequest.prototype.cancelWatchDogTimer_ = function() {
  if (this.watchDogTimerId_) {
    goog.global.clearTimeout(this.watchDogTimerId_);
    this.watchDogTimerId_ = null;
  }
};


/**
 * Called when the watchdog timer is triggered. It also handles a case where it
 * is called too early which we suspect may be happening sometimes
 * (not sure why)
 *
 * @private
 */
goog.net.ChannelRequest.prototype.onWatchDogTimout_ = function() {
  this.watchDogTimerId_ = null;
  var now = goog.now();
  if (now - this.watchDogTimeoutTime_ > 0) {
    this.handleTimeout_();
  } else {
    // got called too early for some reason
    goog.net.ChannelDebug.warning('WatchDog timer called too early');
    this.startWatchDogTimer_(this.watchDogTimeoutTime_ - now);
  }
};


/**
 * Called when the request has actually timed out. Will cleanup and maybe retry
 * the request if we haven't exceeded the retry count.
 *
 * @private
 */
goog.net.ChannelRequest.prototype.handleTimeout_ = function() {
  if (this.successful_) {
    goog.net.ChannelDebug.debug('Received watchdog timeout even though ' +
                                'request loaded successfully');
  }

  goog.net.ChannelDebug.timeoutResponse(this.requestUri_);
  this.cleanup_();

  // set error and maybe retry
  this.lastError_ = goog.net.ChannelRequest.Error.TIMEOUT;
  goog.net.BrowserChannel.notifyStatEvent(
      goog.net.BrowserChannel.Stat.REQUEST_TIMEOUT);
  this.maybeRetry_();
};


/**
 * Retries the current request if we still meet the conditions for retrying.
 */
goog.net.ChannelRequest.prototype.maybeRetry_ = function() {
  if (this.channel_.isClosed() || this.cancelled_) {
    return;
  }

  if (this.lastError_ == goog.net.ChannelRequest.Error.UNKNOWN_SESSION_ID) {
    goog.net.ChannelDebug.info('Unknown Session ID');
    this.channel_.onRequestComplete(this);
  } else if (this.retryCount_ >= this.maxRetries_) {
    goog.net.ChannelDebug.debug('Exceeded max number of retries. ' +
        'Last Error:\n' + this.errorStringFromCode_(this.lastError_));
    this.channel_.onRequestComplete(this);
  } else {
    var that = this;
    goog.net.BrowserChannel.setTimeout(
        this.retry_.bind(this), goog.net.BrowserChannel.DELAY_MS);
  }
};


/**
 * Performs a retry by restarting the request
 *
 * @private
 */
goog.net.ChannelRequest.prototype.retry_ = function() {
  this.retryCount_++;
  if (this.type_ == goog.net.ChannelRequest.Type.XML_HTTP) {
    this.sendXmlHttp_();
  }
};


/**
 * Returns a useful error string for debugging based on the specified error
 * code.
 *
 * @private
 */
goog.net.ChannelRequest.prototype.errorStringFromCode_ = function(errorCode) {
  switch (errorCode) {
    case goog.net.ChannelRequest.Error.STATUS:
      return 'Non-200 return code';
    case goog.net.ChannelRequest.Error.NO_DATA:
      return 'XMLHTTP failure (no data)';
   case goog.net.ChannelRequest.Error.TIMEOUT:
      return 'HttpConnection timeout';
    default:
      return 'Unknown error';
  }
};


/**
 * Cleans up the objects used to make the request. This function is
 * idempotent.
 *
 * @private
 */
goog.net.ChannelRequest.prototype.cleanup_ = function() {
  if (this.xmlHttp_) {
    // clear out this.xmlHttp_ before aborting so we handle getting reentered
    // inside abort
    var xmlhttp = this.xmlHttp_;
    this.xmlHttp_ = null;
    xmlhttp.abort();
  }

  if (this.trident_) {
    this.trident_ = null;
  }
};


/**
 * Indicates whether the request was successful. Only valid after the handler
 * is called to indicate completion of the request.
 *
 * @return {Boolean} True if the request succeeded.
 */
goog.net.ChannelRequest.prototype.getSuccess = function() {
  return this.successful_;
};


/**
 * If the request was not successful, returns the reason.
 *
 * @return {goog.net.ChannelRequest.Error}  The last error.
 */
goog.net.ChannelRequest.prototype.getLastError = function() {
  return this.lastError_;
};


/**
 * Returns the session id for this channel.
 */
goog.net.ChannelRequest.prototype.getSessionId = function() {
  return this.sid_;
};

/**
 * Returns the request id for this request. Each request has a unique request
 * id and the request IDs are a sequential increasing count.
 */
goog.net.ChannelRequest.prototype.getRequestId = function() {
  return this.rid_;
};


/**
 * Helper to call the callback's onRequestData, which catches any
 * exception and cleans up the request.
 */
goog.net.ChannelRequest.prototype.safeOnRequestData_ = function(data) {
  try {
    this.channel_.onRequestData(this, data);
  } catch (e) {
    // todo (jonp) - port mpd's change here
    goog.net.ChannelDebug.dumpException(e, 'Error in httprequest callback');
    this.lastError_ = goog.net.ChannelRequest.Error.HANDLER_EXCEPTION;
    this.cleanup_();
    this.channel_.onRequestComplete(this);
  }
};

