# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure - Events
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: pupius@google.com (Daniel Pupius)  
#
# This package contains Closure's event system. 
#
################################################################################
           
js_library(name='customevent',
           srcs=['customevent.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/events:event'])
                
js_library(name='browserevent',
           srcs=['browserevent.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/events:event'])
                
js_library(name='event',
           srcs=['event.js'],
           deps=['//javascript/closure:base'])
                
js_library(name='listener',
           srcs=['listener.js'],
           deps=['//javascript/closure:base'])


# This is a wierd rule because events.js requires that the others be included
# but only after events has so we have an auxiliary rule to get the order right      
js_library(name='events.aux',
           srcs=['events.js'],
           deps=['//javascript/closure:base'])

js_library(name='events',
           srcs=[],
           deps=[':events.aux',
                 ':browserevent',
                 ':listener',
                 '//javascript/closure/util:array'
                ])
                
js_library(name='eventtarget',
           srcs=['eventtarget.js'],
           deps=['//javascript/closure:base',
                 ':events',
                 ':customevent'])
                
js_library(name='eventhandler',
           srcs=['eventhandler.js'],
           deps=['//javascript/closure:base',
                 '//javascript/closure/util:object',
                 ':events',
                 ':customevent'])
                 