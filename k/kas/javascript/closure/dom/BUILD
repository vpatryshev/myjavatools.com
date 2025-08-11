# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure - DOM Utilities
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: pupius@google.com (Daniel Pupius)  
#
# This package contains utilities for manipulating the DOM.
# goog.dom
# goog.dom.classes
# goog.dom.selection
#
################################################################################


js_library(name='dom',
           srcs=['dom.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/util:array',
                 '//javascript/closure/util:object',
                 '//javascript/closure/util:string',
                 '//javascript/closure/util:math',
                 '//javascript/closure/util:useragent',
                ])
                
js_library(name='classes',
           srcs=['classes.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/util:array',
                 ':dom',
                ])
                
js_library(name='selection',
           srcs=['selection.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/util:useragent',
                 ':dom',
                ])

js_library(name='xml',
           srcs=['xml.js'],
           deps=['//javascript/closure:base',
                 ':dom']
           )