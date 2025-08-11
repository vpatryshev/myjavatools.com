# -*- mode: python; -*-

VERSION = "1.1"

# Description:
# JavaScript files related to Keyboards.

subinclude('//tools/build_defs:fileset')

js_library(name = "keyboard_library",
           srcs = ["keyboard.js",
                   "kbdlayer.js",
                   "kbdlayout.js"],
           deps = [ "//javascript:base",
                    "//javascript:menu"],)

js_library(name="all_layouts",
           srcs = ["kbd.js"],
           deps = [":keyboard_library"]
           )

js_binary(name = "keyboard_all_layouts",
          compile=1,
          externs="//javascript:externs.js",
          srcs = [ ":all_layouts"],
          )

# Russian language pack
#
js_library(name="russia",
           srcs = ["kbd_russia.js"],
           deps = [":keyboard_library"]
           )

js_binary(name = "keyboard_russia",
          compile=1,
          srcs = [ ":russia"],
          externs="//javascript:externs.js"
          )

# Indian languages pack (~10 languages)
#
js_library(name="india",
           srcs = ["kbd_india.js"],
           deps = [":keyboard_library"]
           )

js_binary(name = "keyboard_india",
          compile=1,
           srcs = [ ":india"],
           externs="//javascript:externs.js"
           )

# static files used by the library
Fileset(name = "keyboard_files",
        entries = [FilesetEntry(srcdir="//javascript/keyboard/images",
                                destdir="images"),
                   FilesetEntry(srcdir="//javascript/keyboard/layout",
                                destdir="layout"),
                                ],
        out = "kbdfiles")

# TODO: add unittests, check how it works      

