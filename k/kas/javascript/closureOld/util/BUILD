# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure - General Utilities
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: pupius@google.com (Daniel Pupius)  
#
# This package contains general utilities.  All packages contained in here are
# direct descendents of the main space:
#
# goog.array           Array interation and manipulation
# goog.math            Math classes and additional methods
# goog.json            JSON parsing and serializing
# goog.object          Methods for iterating and manipulating JS objects
# goog.string          String manipulation
# goog.Uri             Uri building, parsing and formatting
# goog.userAgent       Browser sniffing
# goog.window          Functions for window management
#
################################################################################


js_library(name='array',
           srcs=['array.js'],
           deps=['//javascript/closure:base'])

js_library(name='math',
           srcs=['math.js'],
           deps=['//javascript/closure:base'])

js_library(name='json',
           srcs=['json.js'],
           deps=['//javascript/closure:base'])

js_library(name='object',
           srcs=['object.js'],
           deps=['//javascript/closure:base'])

js_library(name='string',
           srcs=['string.js'],
           deps=['//javascript/closure:base'])

js_library(name='timer',
           srcs=['timer.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/events:eventtarget'])

js_library(name='uri',
           srcs=['uri.js'],
           deps=['//javascript/closure:base',
                 ':string'])

js_library(name='useragent',
           srcs=['useragent.js'],
           deps=['//javascript/closure:base'])

js_library(name='window',
           srcs=['window.js'],
           deps=['//javascript/closure:base'])
                 