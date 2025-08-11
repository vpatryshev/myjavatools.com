# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure Base Library
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: pupius@google.com (Daniel Pupius) 
#
# Closure Build Rule Naming Conventions
# 
# js_library:
# -----------------
# foobarAll            Links all scripts in a package foobar/*.js
#
# foobar               Refers to a file foobar/foobar.js.
#                      The JS namespace will then be goog.foobar.  Base and util
#                      are currently special cases. Util has :array & goog.array
#                      yet the files are in util/array.js. :base -> /base.js
#
# foobar.monkey        Should refer to foobar/monkey.js; The JS namespace will 
#                      be goog.foobar.monkey
#
################################################################################


js_library(name='base',
           srcs=['base.js'],
           deps=[])



################################################################################
# Unit Tests
################################################################################

#This is a library that will eventually replace base_unittest (and take its
#name).  It includes a standard JsUnit Test Page, rather than the fragment
#tests currently in use by the Google3 BUILD system.
#Further, we are developing a replacement for the js_unittest rule that will
#allow the running of standard Test Pages using make-dbg.

#This library also includes a dependency on the JsUnit Test Runner, so
#you can run your tests in the standard way using the Test Runner, rather than
#having to use make-dbg.  To do so, open //third_part/java/jsunit/jsunit2.2/testRunner.html
#in a browser and point the test running at base_test.html.

js_unittest(name = 'base_unittest_new',
           deps = [
                   ':all',
                   'all_tests.html',
                   'base_test.html',
                   '//third_party/java/jsunit:jsunit2.2'
           ])



################################################################################
# The whole library 
################################################################################

js_library(name='all',
           srcs=[],
           deps=[':base',
                 '//javascript/closure/color:color',
                 '//javascript/closure/color:names',
                 
                 '//javascript/closure/datasource:datasourceAll',
                 
                 '//javascript/closure/debug:debug',
                 
                 '//javascript/closure/dom:dom',
                 '//javascript/closure/dom:classes',
                 '//javascript/closure/dom:selection',
                 '//javascript/closure/dom:xml',
                 
                 '//javascript/closure/events:events',
                 '//javascript/closure/events:eventtarget',
                 '//javascript/closure/events:eventhandler',
                 '//javascript/closure/events:listener',
                 '//javascript/closure/events:event',
                 '//javascript/closure/events:browserevent',
                 '//javascript/closure/events:customevent',
                 
                 '//javascript/closure/fx:fx',
                 '//javascript/closure/fx:dom',
                 '//javascript/closure/fx:dragger',
                 
                 '//javascript/closure/net:xhrlite',
                 '//javascript/closure/net:xmlhttp',
                 '//javascript/closure/net:cookies',
                 '//javascript/closure/net:browserchannel',
                 
                 '//javascript/closure/structs:structs',
                 '//javascript/closure/structs:map',
                 '//javascript/closure/structs:set',
                 '//javascript/closure/structs:queue',
                 '//javascript/closure/structs:circularbuffer',
                 
                 '//javascript/closure/style:style',
                 
                 '//javascript/closure/util:array',
                 '//javascript/closure/util:json',
                 '//javascript/closure/util:math',
                 '//javascript/closure/util:object',
                 '//javascript/closure/util:string',
                 '//javascript/closure/util:timer',
                 '//javascript/closure/util:uri',
                 '//javascript/closure/util:useragent',
                 '//javascript/closure/util:window',
                 
                 '//javascript/closure/ui:menu',
                 
                 '//javascript/closure/ui/autocomplete:autocomplete',
               ])


js_binary(name='closure',
          srcs=[':all'],
          compile=0,
          externs='',
          defs=[])
               

js_binary(name='closureCompiled',
          srcs=[':all'],
          compile=1,
          externs='//javascript:externs.js',
          defs=['--alias_externals',
	        '--remove_unused_prototype_props',
	        '--collapse_properties',
	        '--mark_as_compiled',
	        '--aggressively_rename_js_prototypes',
                '--check_methods'])
