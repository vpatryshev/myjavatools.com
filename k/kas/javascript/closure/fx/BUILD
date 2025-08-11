# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure - Effects
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: pupius@google.com (Daniel Pupius) 
#
# This package contains classes for performing animations, and managing dragable
# elements.  dom.js contains a number of preset animations such as slide & fade.
#
################################################################################

js_library(name='fx',
           srcs=['fx.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/events:eventtarget',
                 '//javascript/closure/util:array'
                ])

js_library(name='dom',
           srcs=['dom.js'],
           deps=['//javascript/closure:base',
                 ':fx',
                 '//javascript/closure/events:events'
                ])

js_library(name='dragger',
           srcs=['dragger.js'],
           deps=['//javascript/closure:base',
                 ':fx',
                 '//javascript/closure/events:events',
                 '//javascript/closure/events:event',
                 '//javascript/closure/events:eventtarget',
                 '//javascript/closure/util:math'
                ])