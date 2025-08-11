# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure - Structs
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: pupius@google.com (Daniel Pupius) 
#
# This package contains data structures such as map, queue and set.
#
################################################################################

js_library(name='structs',
           srcs=['structs.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/util:array',
                 '//javascript/closure/util:object'])

js_library(name='map',
           srcs=['map.js'],
           deps=['//javascript/closure:base', ':structs'])

js_library(name='queue',
           srcs=['queue.js'],
           deps=['//javascript/closure:base',
                 ':structs'])

js_library(name='set',
           srcs=['set.js'],
           deps=['//javascript/closure:base',
                 ':map'])

js_library(name='circularbuffer',
           srcs=['circularbuffer.js'],
           deps=['//javascript/closure:base',
                 ':map', ':structs'])
