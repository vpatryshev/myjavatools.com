# -*- mode: python; -*-

VERSION = '1.0'


################################################################################
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
# js_unittest:
# -----------------
# foobarAll_test       foobar/all_test.html
# foobar_test          foobar/foobar_test.html
# foobar.monkey_test   foobar/monkey_test.html
#
# (tests should link a dependency to the package they are testing)
#
################################################################################



################################################################################
# Bootstrap for the library 
################################################################################

js_library(name='base',
           srcs=['base.js'],
           deps=[])


################################################################################
# Debug
################################################################################
js_library(name='debug',
           srcs=['debug/debug.js'],
           deps=[])

################################################################################
# Utilities
################################################################################

js_library(name='utilAll',
           srcs=[],
           deps=[':base',
                 ':array',
                 ':date',
                 ':dom',
                 ':math',
                 ':string',
                 ':style',
                 ':uid',
                 ':uri'
                ])
                
js_library(name='array',
           srcs=['util/array.js'],
           deps=[':base'])
                
js_library(name='date',
           srcs=['util/date.js'],
           deps=[':base'])
                
js_library(name='dom',
           srcs=['util/dom.js'],
           deps=[':base'])
                
js_library(name='math',
           srcs=['util/math.js'],
           deps=[':base'])
                
js_library(name='string',
           srcs=['util/string.js'],
           deps=[':base'])
                
js_library(name='style',
           srcs=['util/style.js'],
           deps=[':base'])
                
js_library(name='uid',
           srcs=['util/uid.js'],
           deps=[':base'])
                
js_library(name='uri',
           srcs=['util/uri.js'],
           deps=[':base'])


################################################################################
# Events
################################################################################

js_library(name='eventsAll',
           srcs=[],
           deps=[':base',
	         ':events',
	         ':events.event',
		 ':events.listener',
		 ':events.eventtarget'
		])

js_library(name='events',
           srcs=['events/events.js'],
           deps=[':base', ':events.event', ':events.listener', ':array'])
                
js_library(name='events.event',
           srcs=['events/event.js'],
           deps=[':base'])
                
js_library(name='events.listener',
           srcs=['events/listener.js'],
           deps=[':base'])
                
js_library(name='events.eventtarget',
           srcs=['events/eventtarget.js'],
           deps=[':base', ':events'])


################################################################################
# Animation and Effects
################################################################################
   
js_library(name='fxAll',
           srcs=[],
           deps=[':base', ':fx', ':fx.dom'])

js_library(name='fx',
           srcs=['fx/fx.js'],
           deps=[':base', ':events.eventtarget'])

js_library(name='fx.dom',
           srcs=['fx/dom.js'],
           deps=[':base', ':fx', ':events'])


################################################################################
# IO Methods and Classes
################################################################################

js_library(name='ioAll',
           srcs=[],
           deps=[':base', ':io.cookies', ':io.xmlhttp'])

js_library(name='io.cookies',
           srcs=['io/cookies.js'],
           deps=[':base'])

js_library(name='io.xmlhttp',
           srcs=['io/xmlhttp.js'],
           deps=[':base'])


################################################################################
# Data structures such as Set, Map and Queue
################################################################################

js_library(name='structsAll',
           srcs=[],
           deps=[':base',
                 ':structs.circularbuffer',
                 ':structs.map',
                 ':structs.queue',
                 ':structs.set'
                ])

js_library(name='structs.circularbuffer',
           srcs=['structs/circularbuffer.js'],
           deps=[':base'])

js_library(name='structs.map',
           srcs=['structs/map.js'],
           deps=[':base'])

js_library(name='structs.queue',
           srcs=['structs/queue.js'],
           deps=[':base'])

js_library(name='structs.set',
           srcs=['structs/set.js'],
           deps=[':base'])



################################################################################
# Unit Tests
################################################################################

js_unittest(name = 'base_unittest',
            srcs = ['base_test.js'],
            deps = [
                    ':base',
            ])

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
                   ':base',
                   'all_tests.html',
                   'base_test.html',
                   '//third_party/java/jsunit:jsunit2.2'
           ])

################################################################################
# The whole library (uncompiled since this will need to be done by the app
# using it)
################################################################################

js_binary(name='closure',
          srcs=[
               ':base',
               ':debug',
               ':eventsAll',
               ':fxAll',
               ':ioAll',
               ':structsAll',
               ':utilAll'
               ],
          compile=0,
          externs='',
          defs=[
               ])
