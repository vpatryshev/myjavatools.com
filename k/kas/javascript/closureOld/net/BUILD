# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure - Net
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: pupius@google.com (Daniel Pupius) 
#
################################################################################


js_library(name='cookies',
           srcs=['cookies.js'],
           deps=['//javascript/closure:base'])

js_library(name='xhrlite',
           srcs=['xhrlite.js'],
           deps=['//javascript/closure:base',
                 'xmlhttp',
                 '//javascript/closure/util:json',
                 '//javascript/closure/util:useragent',
                 '//javascript/closure/structs:map',])

js_library(name='xmlhttp',
           srcs=['xmlhttp.js'],
           deps=['//javascript/closure:base']);

js_library(name='browserchannel',
           srcs=[
                 'browserchannel.js',
                 'browsertestchannel.js',
                 'channelrequest.js',
                 'tmpnetwork.js',
                 'channeldebug.js',
                ],
           deps=[
                 ':xhrlite',
                 '//javascript/closure/util:useragent',
                 '//javascript/closure/util:string',
                 '//javascript/closure/util:uri',
                 '//javascript/closure/events:eventtarget',
                 '//javascript/closure/debug:debug',
                 '//javascript/closure/structs:circularbuffer',
                 '//javascript/closure/util:json',
                ]);
