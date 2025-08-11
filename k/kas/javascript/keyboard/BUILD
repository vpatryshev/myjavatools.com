ejs_bin# -*- mode: python; -*-

# Description:
# JavaScript files related to Keyboards.

COPYRIGHT = "/* Copyright 2008 Google Inc.  All Rights Reserved. */ "
WRAPPER = COPYRIGHT + "(function() {%output%})()"
JSCOMPILER_PARAMS = "--variable_renaming=ALL --property_renaming=%s --output_wrapper=\"%s\" --collapse_anonymous_functions --alias_externals "
JSCOMPILER_PARAMS_CONFIGURABLE = JSCOMPILER_PARAMS % ("OFF", WRAPPER)
JSCOMPILER_PARAMS_GWS = JSCOMPILER_PARAMS % ("ALL_UNQUOTED", WRAPPER)

GADGET_WRAPPER = "(function() { %output% })()"
LAYOUT_LOCATION = "//javascript/keyboard:layout/"
RELEASE = "002"
RELEASE_DIR = "release"
release_list = []
BINARY_LOCATION = "http://mw1.google.com/staticfiles/keyboard/bin"

def binfile(locale):
    return "d_%s_%s.js" % (locale, RELEASE)

def url(locale):
    return "%s/%s" % (BINARY_LOCATION, binfile(locale))

CONFIG = {
  "ar": { "layouts": ["MiddleEastern/AR.js"],
          "gadget": "gadget_head_ar.xml",
          "release": "yes",
          "smallmonkey": "yes",
          "gws": "d"
        },
  "az": { "layouts": ["MiddleEastern/AZ_LATN.js"]
        },
  "be": { "layouts": ["EastEuropean/BE.js"],
          "release": "yes",
          "smallmonkey": "yes",
        },
  "bg": { "layouts": ["EastEuropean/BG.js"],
          "release": "yes",
          "smallmonkey": "yes",
        },
  "bn": { "layouts": ["Asian/BN.js"],
          "release": "yes",
          "smallmonkey": "yes",
        }, 
  "cs": { "layouts": ["EastEuropean/CS.js"],
          "release": "yes",
          "smallmonkey": "yes",
        },
  "cy": { "layouts": ["WestEuropean/CY.js"]
        },
  "dvorak": { "layouts": ["WestEuropean/EN_DVORAK.js"],
          "gadget": "gadget_head_dvorak.xml",
        },
  "colemak": { "layouts": ["WestEuropean/EN_COLEMAK.js"],
          "gadget": "gadget_head_colemak.xml",
        },
  "el": { "layouts": ["EastEuropean/EL.js"],
          "release": "yes",
          "smallmonkey": "yes",
        },
  "es": { "layouts": ["WestEuropean/ES.js"]
        },
  "et": { "layouts": ["EastEuropean/ET.js"],
          "release": "yes",
          "smallmonkey": "yes",
        },
  "fa": { "layouts": ["MiddleEastern/FA.js"],
          "release": "yes",
          "smallmonkey": "yes"
        },
  "fi": { "layouts": ["WestEuropean/FI.js"],
          "gadget": "gadget_head_fi.xml",
          "release": "yes",
          "smallmonkey": "yes",
        },
  "fo": { "layouts": ["WestEuropean/FO.js"]
        },
  "gu": { "layouts": ["Asian/GU.js"],
          "release": "yes",
          "smallmonkey": "yes",
        },
  "he": { "layouts": ["MiddleEastern/HE.js"]
        },
  "hi": { "layouts": ["Asian/HI.js"],
          "gadget": "gadget_head_hi.xml",
          "release": "yes",
          "smallmonkey": "yes",
        },
  "hr": { "layouts": ["EastEuropean/HR.js"],
          "release": "yes",
          "smallmonkey": "yes",
        },
  "hu": { "layouts": ["EastEuropean/HU.js"],
          "gadget": "gadget_head_hu.xml",
          "release": "yes",
          "smallmonkey": "yes",
        },
  "hy": { "layouts": ["MiddleEastern/HY.js"],
          "release": "yes",
          "smallmonkey": "yes"
        },
  "il": { "layouts": [
            "EastEuropean/RU.js",
            "WestEuropean/EN_GB.js",
            "MiddleEastern/AR.js",
            "MiddleEastern/HE.js"
          ],
          "srcs": ["keyboard_il.js"],
          "gadget": "gadget_head_il.xml",
          "release": "yes",
          "smallmonkey": "yes",
        },
  "is": { "layouts": ["WestEuropean/IS.js"],
          "release": "yes"
        },
  "ka": { "layouts": ["MiddleEastern/KA.js"],
          "release": "yes"
        },
  "kk": { "layouts": ["Asian/KK.js"],
          "release": "yes"
        },
  "km": { "layouts": ["Asian/KM.js"],
          "release": "yes"
        },
  "kn": { "layouts": ["Asian/KN.js"],
          "release": "yes"
        },
  "lt": { "layouts": ["EastEuropean/LT.js"],
          "release": "yes"
        },
  "lv": { "layouts": ["EastEuropean/LV.js"],
          "release": "yes"
        },
  "mk": { "layouts": ["EastEuropean/MK.js"],
          "release": "yes"
        },
  "ml": { "layouts": ["Asian/ML_inscript.js",
                      "Asian/ML.js"],
          "srcs": ["keyboard_ml.js"],
          "gadget": "gadget_head_ml.xml",
          "release": "yes",
          "smallmonkey": "yes",
        },
  "mn": { "layouts": ["Asian/MN.js"],
          "release": "yes"
        },
  "mr": { "layouts": ["Asian/MR.js"],
          "release": "yes"
        },
  "mt": { "layouts": ["WestEuropean/MT.js"]
        },
  "ne": { "layouts": ["Asian/NE.js"]
        },
  "no": { "layouts": ["WestEuropean/NO.js"],
          "release": "yes"
        },
  "or": { "layouts": ["Asian/OR.js"]
        },
  "pa": { "layouts": ["Asian/PA.js"]
        },
  "pl": { "layouts": ["EastEuropean/PL.js"],
          "release": "yes",
          "smallmonkey": "yes",
        },
  "ps": { "layouts": ["MiddleEastern/PS.js"],
          "release": "yes"
        },
  "ro": { "layouts": ["EastEuropean/RO.js"],
          "release": "yes"
        },
  "ru": { "layouts": [
            "WestEuropean/EN.js",
            "EastEuropean/RU_LATN.js",
            "EastEuropean/RU.js"
          ],
          "srcs": ["keyboard_ru.js"],
          "gadget": "gadget_head_ru.xml",
          "release": "yes",
          "smallmonkey": "yes",
          "gws": "f"
        },
  "ru_kiosk":
         { "layouts": [
            "WestEuropean/EN.js",
            "EastEuropean/RU.js"
          ],
          "srcs": ["keyboard_ru_kiosk.js"],
        },
  "si": { "layouts": ["Asian/SI.js"],
          "release": "yes"
        },
  "sk": { "layouts": ["EastEuropean/SK.js"],
          "release": "yes"
        },
  "special": { "layouts": [
                 "EastEuropean/EL.js",
                 "Special/_A.js",
                 "Special/_M.js"
                ],
               "srcs": ["keyboard_special.js"],
               "gadget": "gadget_head_special.xml",
               "release": "yes",
        },
  "sq": { "layouts": ["EastEuropean/SQ.js"],
          "release": "yes"
        },
  "sr": { "layouts": ["EastEuropean/SR_CYRL_CS.js"],
          "release": "yes"
        },
  "ta": { "layouts": ["Asian/TA.js"],
          "release": "yes"
        },
  "te": { "layouts": ["Asian/TE.js"],
          "release": "yes"
        },
  "tg": { "layouts": ["Asian/TG.js"],
          "release": "yes"
        },
  "th": { "layouts": ["Asian/TH.js"],
          "release": "yes"
        },
  "tk": { "layouts": ["Asian/TK.js"],
          "release": "yes"
        },
  "tr": { "layouts": ["MiddleEastern/TR.js"],
          "gadget": "gadget_head_tr.xml",
          "release": "yes",
          "smallmonkey": "yes",
        },
  "tt": { "layouts": ["Asian/TT.js"],
          "release": "yes"
        },
  "ua": { "layouts": [
            "WestEuropean/EN.js",
            "EastEuropean/RU.js",
            "EastEuropean/UK.js"],
          "srcs": ["keyboard_ua.js"],
          "gadget": "gadget_head_ua.xml",
          "release": "yes",
          "smallmonkey": "yes",
        },
  "ug": { "layouts": ["Asian/UG.js"],
          "release": "yes"
        },
  "ur": { "layouts": ["MiddleEastern/UR.js"],
          "release": "yes"
        },
  "uz": { "layouts": ["Asian/UZ.js"],
          "release": "yes",
          "smallmonkey": "yes",
        },
}

subinclude('//tools/build_defs:fileset')

js_library(name = "keyboard_library",
           srcs = ["header.js",
                   "keyboard.js",
                   "kbdlayout.js",
                   "kbdlayer.js",
                   "export.js"])

js_library(name="draggable_keyboard_library",
           srcs = ["kbdlayerdrag.js"],
           deps = [":keyboard_library"])

js_library(name="gws_keyboard_library",
           srcs = ["header_gws.js",
                   "keyboard.js",
                   "kbdlayout.js",
                   "kbdlayer.js"]
                   )

extralib = {'d': ["kbdlayerdrag.js"], 'f': []}

# Externs (concatenated since only one externs file is allowed in js_binary)
genrule(name = "externs",
        srcs = [ "externs.js",
                 "//javascript:externs.js" ],
        outs = [ "externs.out.js" ],
        cmd = "cat $(SRCS) > $@")

# Generate all available keyboards
for locale in CONFIG:
  js_library(name = locale + "_lib",
             srcs =  CONFIG[locale].get("srcs",[]) + [LAYOUT_LOCATION + layout for layout in CONFIG[locale]["layouts"]],
             deps = [":keyboard_library"]
          )

  js_library(name = locale + "_gws_lib",
             srcs =  CONFIG[locale].get("srcs",[]) + [LAYOUT_LOCATION + layout for layout in CONFIG[locale]["layouts"]],
             deps = [":gws_keyboard_library"]
          )

for locale in CONFIG.keys():
  for kind in "df": # draggable or fixed
    binary_name = "%s_%s_%s" % (kind, locale, RELEASE)

    js_binary(name = binary_name,
              compile=1,
              srcs = [":%s_lib" % locale] + extralib[kind],
              externs = "externs.out.js",
              defs=[JSCOMPILER_PARAMS_CONFIGURABLE],
             )

    if (CONFIG[locale].get("gws", "")):
        js_binary(name = "gws_" + binary_name,
                  compile=1,
                  srcs = [":%s_gws_lib" % locale] + extralib[kind],
                  externs = "//javascript:externs.js",
                  defs=[JSCOMPILER_PARAMS_GWS],
                 )

    if (CONFIG[locale].get("release", "")):
      release_list.append(binary_name + ".js")
#      genrule(name="release_%s_%s" % (kind, locale),
#              srcs = [binary_name + ".js"],
#              outs = [RELEASE_DIR + "bin/" + binary_name],
#              cmd = "cp $(SRCS) $@")

  js_binary(name="gadget_%s_bin" % locale,
            compile=1,
            srcs = [":%s_lib" % locale] + ["kbdgadget.js"],
            externs = "externs.out.js",
            defs=[JSCOMPILER_PARAMS_CONFIGURABLE],
           )

  genrule(name="gadget_%s" % locale,
          srcs = [CONFIG[locale].get('gadget', "gadget_head.xml"),
                  "gadget_%s_bin.js" % locale,
                  "gadget_tail.xml"],
          outs = ["kbd_%s_gadget.xml" % locale ],
          cmd = "cat $(SRCS) > $@")

  if (CONFIG[locale].get("smallmonkey", "")):
    genrule(name="greasmonkey_load_%s" % locale,
            outs = ["greasemonkey_load_%s.js" % locale],
            cmd = "echo \"(\'%s\')\" > $@" % url(locale)
           )  

    genrule(name="greasemonkey_%s" % locale,
            srcs = ["greasemonkey_smallhead.js",
                    "greasemonkey_load_%s.js" % locale,
                   ],
            outs = ["keyboard_%s.user.js" % locale ],
            cmd = "cat $(SRCS) > $@",
#            deps=["greasemonkey_load_%s" % locale]
           )
  else:
    genrule(name="greasemonkey_%s" % locale,
            srcs = ["greasemonkey_head.js",
                    binfile(locale)],
            outs = ["keyboard_%s.user.js" % locale ],
            cmd = "cat $(SRCS) > $@")

Fileset(name = "all_released",
        entries = [ FilesetEntry(files = release_list,
                                 destdir = "bin") ],
        out = RELEASE_DIR,
       )        

#genrule(name="tar_release",  
#        srcs = [":all_released"],
#        outs = [ "keyboard.tar" ],
#        deps = [":all_released"],
#        cmd = ("echo tar --create --file=$@ --dereference --directory=" + RELEASE_DIR + " bin/* > keyboard.tar")
#       )

#js_library(name="all_layouts",
#           srcs = ["kbdmenu.js", "kbd.js", "menu.js"],
#           deps = [":draggable_keyboard_library",
#                   "//javascript/closure:all"],
#           )

#js_binary(name = "keyboard_all",
#          compile=1,
#          externs="//javascript:externs.js",
#          srcs = [ ":all_layouts"],
#          )

# Indic languages pack (~10 languages)
#
#js_library(name="india",
#           srcs = ["kbd_india.js"],
#           deps = [":keyboard_library"]
#           )

#js_binary(name = "keyboard_india",
#          compile=1,
#          srcs = [ ":india"],
#          externs="//javascript:externs.js"
#          )

# static files used by the library
Fileset(name = "keyboard_files",
        entries = [
                   FilesetEntry(srcdir="//javascript/keyboard:layout",
                                destdir="layout"),
                  ],
        out = "kbdfiles")

js_test(name = "kbdlayout_unittest",
            srcs = [ "unittest_util.js",
                   ],
            deps = [ ":keyboard_library" ],
            html_body="kbdlayout_unittest.html" )

js_test(name = "keyboard_unittest",
            srcs = [ "unittest_util.js",
                   ],
            deps = [ ":keyboard_library" ],
            html_body="keyboard_unittest.html" )

js_test(name = "kbdlayer_unittest",
            srcs = [ "unittest_util.js",
                   ],
            deps = [ ":keyboard_library" ],
            html_body="kbdlayer_unittest.html" )

TEST_LOCALES = ["ar", "fi", "hi", "hu", "il", "ml", "ru", "tr", "ua"];

# TODO(vpatryshev): add tests for binaries (incl. gws)

for locale in TEST_LOCALES:
  js_test(name = "keyboard_%s_unittest" % locale,
              srcs = ["keyboard_%s_unittest.html" % locale,
                      "unittest_util.js"],
              deps = [ ":%s_lib" % locale ]
             )

# Layouts that are not available otherwises
exports_files(['layout/WestEuropean/FR.js']);
