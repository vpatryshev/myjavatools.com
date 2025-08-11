# -*- mode: python; -*-
VERSION = '1.0'

################################################################################ 
# Closure - Datasource
# Copyright 2006 Google Inc.
# All Rights Reserved.
# Author: uidude@google.com (Evan Gilbert) 
#
# Generic data API for JS
#
################################################################################

                
js_library(name='datasourceAll',
           srcs=[
                 ],
           deps=[':datasourceXml',
                 ':datasourceJs',
                ]) 
                 
js_library(name='datasourceCore',
           srcs=[
                 'datasource.js',
                 'datamanager.js'
                 ],
           deps=['//javascript/closure:base',
                 '//javascript/closure/dom',
                 '//javascript/closure/structs:map',
                 '//javascript/closure/structs:set',
                 '//javascript/closure/util:uri',
                 '//javascript/closure/debug:consoleDebug'
                ])
                
js_library(name='datasourceJs',
           srcs=[
                 'jsdatasource.js'
                 ],
           deps=[':datasourceCore'])    
                   
js_library(name='datasourceXml',
           srcs=[
                 'xmldatasource.js',
                 ],
           deps=[':datasourceCore',
                 '//javascript/closure/dom:xml',
                 '//javascript/closure/net:xmlhttp'
                 ])   
                 
js_library(name='expr',
           srcs=[
                 'expr.js',
                 ],
           deps=[':datasourceCore'
                 ])   
                 