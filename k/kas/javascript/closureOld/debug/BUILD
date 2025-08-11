# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure - Debug Utilities
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: pupius@google.com (Daniel Pupius) 
#
# This package contains utilities for debugging code and logging output.  It 
# provides goog.debug and goog.debug.Logger.
#
################################################################################


js_library(name='logger',
           srcs=['debug.js',
                 'logger.js',
                 'logrecord.js',
                 'formatter.js'
                 ],
           deps=[ '//javascript/closure:base',
                  '//javascript/closure/util:string',
                  '//javascript/closure/util:array',
                ])   

js_library(name='debug',
           srcs=['debugwindow.js'
                ],
           deps=[':logger',
                 '//javascript/closure:base',
                 '//javascript/closure/util:string',
                 '//javascript/closure/util:array',
                 '//javascript/closure/structs:circularbuffer',
                ])

js_library(name='consoleDebug',
           srcs=['console.js'
                ],
           deps=[':logger',
                 '//javascript/closure:base',
                 '//javascript/closure/util:string',
                 '//javascript/closure/util:array',
                ])           