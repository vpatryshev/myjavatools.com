# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure - UI Elements
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: pupius@google.com (Daniel Pupius) 
#
# This package contains UI Widgets
#
################################################################################

js_library(name='menu',
           srcs=[
                 'menubase.js',
                 'attachablemenu.js'
                ],
           deps=[':popup',
                 '//javascript/closure/util:array',
                 '//javascript/closure/util:object',
                 '//javascript/closure/dom:classes',
                 ':itemevent'])
                 
js_library(name='popup',
           srcs=['popup.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/util:math',
                 '//javascript/closure/style:style',
                 '//javascript/closure/events:events',
                 '//javascript/closure/events:eventtarget',
                 '//javascript/closure/events:event',
                 '//javascript/closure/dom:dom'])

js_library(name='itemevent',
           srcs=['itemevent.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/events:event'])