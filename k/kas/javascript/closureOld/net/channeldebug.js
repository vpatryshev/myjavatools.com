// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Definition of the ChannelDebug class. ChannelDebug provides
 * a utility for tracing and debugging the BrowserChannel requests.
 *
 * TODO(jonp) - allow client to specify a custom redaction policy
 * @author Jon Perlow (jonp@google.com)
 */

/**
 * Namespace for BrowserChannel
 */
goog.provide('goog.net.ChannelDebug');
goog.require('goog.structs.CircularBuffer');
goog.require('goog.json');
goog.require('goog.string');
goog.require('goog.debug.Logger');


/**
 * Logs and keeps a buffer of debugging info for the Channel.
 * @private
 */
goog.net.ChannelDebug = {};


goog.net.ChannelDebug.buffer_ = new goog.structs.CircularBuffer(1000);

goog.net.ChannelDebug.logger_ =
    goog.debug.Logger.getLogger('goog.net.BrowserChannel');


/**
 * Called to enable saving of the log.
 */
goog.net.ChannelDebug.setEnableSaving = function(enabled) {
  goog.net.ChannelDebug.captureForRemoteDebugging_ = enabled;
};


/**
 * Logs an XmlHttp request..
 */
goog.net.ChannelDebug.xmlHttpChannelRequest = function(verb, uri, id, attempt,
                                                       postData) {
  goog.net.ChannelDebug.logger_.info(
      'XMLHTTP REQ (' + id + ') [attempt ' + attempt + ']: ' +
      verb + '\n' + uri + '\n' +
      goog.net.ChannelDebug.maybeRedactPostData_(postData));
};


/**
 * Logs the meta data received from an XmlHttp request.
 */
goog.net.ChannelDebug.xmlHttpChannelResponseMetaData =
    function(verb, uri, id, attempt, readyState, statusCode)  {
  goog.net.ChannelDebug.logger_.info(
      'XMLHTTP RESP (' + id + ') [ attempt ' + attempt + ']: ' +
      verb + '\n' + uri + '\n' + readyState + ' ' + statusCode);
};


/**
 * Logs the response data received from an XmlHttp request.
 */
goog.net.ChannelDebug.xmlHttpChannelResponseText =
    function(id, responseText, opt_desc) {
  goog.net.ChannelDebug.logger_.info(
      'XMLHTTP TEXT (' + id + '): ' +
      goog.net.ChannelDebug.redactResponse_(responseText) +
      (opt_desc ? ' ' + opt_desc : ''));
};


/**
 * Logs a Trident ActiveX request.
 */
goog.net.ChannelDebug.tridentChannelRequest =
    function(verb, uri, id, attempt) {
  goog.net.ChannelDebug.logger_.info(
      'TRIDENT REQ (' + id + ') [ attempt ' + attempt + ']: ' +
      verb + '\n' + uri);
};


/**
 * Logs the response text received from a Trident ActiveX request.
 */
goog.net.ChannelDebug.tridentChannelResponseText =
    function(id, responseText) {
  goog.net.ChannelDebug.logger_.info(
      'TRIDENT TEXT (' + id + '): ' +
      goog.net.ChannelDebug.redactResponse_(responseText));
};


/**
 * Logs the done response received from a Trident ActiveX request.
 */
goog.net.ChannelDebug.tridentChannelResponseDone =
    function(id, successful) {
  goog.net.ChannelDebug.logger_.info(
      'TRIDENT TEXT (' + id + '): ' + successful ? 'success' : 'failure');
};


/**
 * Logs a request timeout.
 */
goog.net.ChannelDebug.timeoutResponse = function(uri) {
  goog.net.ChannelDebug.logger_.info('TIMEOUT: ' + uri);
};


/**
 * Logs an info message.
 */
goog.net.ChannelDebug.info = function(text) {
  goog.net.ChannelDebug.logger_.info(text);
};


/**
 * Logs a debug message.
 */
goog.net.ChannelDebug.debug = function(text) {
  goog.net.ChannelDebug.logger_.info(text);
};


/**
 * Logs a warning message.
 */
goog.net.ChannelDebug.warning = function(text) {
  goog.net.ChannelDebug.logger_.warning(text);
};

goog.net.ChannelDebug.dumpException = function(e, opt_msg) {
  goog.net.ChannelDebug.logger_.severe(opt_msg || 'Exception', e);
};


/**
 * Removes potentially private data from a response so that we don't
 * accidentally save private and personal data to the server logs.
 */
goog.net.ChannelDebug.redactResponse_ = function(responseText) {
  // first check if it's not JS - the only non-JS should be the magic cookie
  if (!responseText ||
      responseText == goog.net.BrowserChannel.MAGIC_RESPONSE_COOKIE) {
    return responseText;
  }
  try {
    var responseArray = goog.json.parse(responseText);

    for (var i = 0; i < responseArray.length; i++) {
      if (goog.isArray(responseArray[i])) {
        goog.net.ChannelDebug.maybeRedactArray_(responseArray[i]);
      }
    }

    return goog.json.serialize(responseArray);
  } catch (e) {
    goog.net.ChannelDebug.debug('Exception parsing expected JS array - ' +
                                'probably was not JS');
    return responseText;
  }
};


/**
 * Removes data from a response array that may be sensitive.
 */
goog.net.ChannelDebug.maybeRedactArray_ = function(array) {
  if (array.length < 2) {
    return;
  }
  var dataPart = array[1];
  if (!goog.isArray(dataPart)) {
    return;
  }
  if (dataPart.length < 1) {
    return;
  }

  var type = dataPart[0];
  if (type != 'c' && type != 'noop' && type != 'stop') {
    // redact all fields in the array
    for (var i=1; i < dataPart.length; i++) {
      dataPart[i] = '';
    }
  }
};


/**
 * Removes potentially private data from a request POST body so that we don't
 * accidentally save private and personal data to the server logs.
 */
goog.net.ChannelDebug.maybeRedactPostData_ = function(data) {
  if (!data) {
    return null;
  }
  var out = '';
  var params = data.split('&');
  for (var i=0; i < params.length; i++) {
    var param = params[i];
    var keyValue = param.split('=');
    if (keyValue.length > 1) {
      var key = keyValue[0];
      var value = keyValue[1];

      var keyParts = key.split('_');
      if (keyParts.length >=2 && keyParts[1] == 'type') {
        out += key + '=' + value + '&';
      } else {
        out += key + '=' + 'redacted' + '&';
      }
    }
  }
  return out;
};