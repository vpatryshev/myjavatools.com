// Copyright 2006 Google Inc.
// All Rights Reserved
/**
 * @fileoverview This file contains an implementation of onscreen keyboard.
 *
 * @author Vlad Patryshev (vpatryshev@google.com)
 */

/**
 * This global function is used in individual layout files to load themselves.
 * @param data description.
 */
GKBD.layer.loader_ = function(data) {
  var dataId = data.id.split(',')[0];
  for (var id in GKBD.layer.layouts_) {
    var layout = GKBD.layer.layouts_[id];
    if (dataId == layout.id) {
      layout.init_(data);
      GKBD.layer.setLayout_(layout);
      return;
    }
  }
};

GKBD.layer.configure( {
  historySize_ : 1} // Must be 4, eventually, but there are menu problems, so...
);

GKBD.LOCATION_ = "javascript/keyboard/";
GKBD.images = "images/";
/**
 * Sets defaults for the full set of layouts which are loaded on demand.
 *
 * Note that an id has now two forms: a long one, which is used for identifying
 * files, and a short one, used as a key and, most importantly, used for
 * storing in our cookie. We need them to be short, to save on cookies.
 * So the short one is strictly two bytes long; it is
 * case-sensitive and can use any characters allowed in cookies.
 * So far we have 'EN', 'En', 'eN', 'en'; if we introduce more
 * English-language layouts, we will probably need to start calling them
 * E1, E2, etc.
 *
 */
var KBD_ENGLISH = new GKBD.Layout(
  {
    id: 'EN',
    name: 'English',
    title: 'English',
    mappings: {
      'sl': {
        '': '~!@#$%^&*()_+' +
            'qwertyuiop{}|' +
            'asdfghjkl:\"' +
            'zxcvbnm<>?'
      },
      'cl,c': {
        '\u00c0':'\\','1':'\u00b1','2':'@','3':'\u00a3','4':'\u00a2','5':'\u00a4','6':'\u00ac','7':'\u00a6','8':'\u00b2','9':'\u00b3','0':'\u00bc','m':'\u00bd','=':'\u00be' ,
        'O':'\u00a7','P':'\u00b6','\u00db':'[','\u00dd':']','\u00dc':'}' ,
        ';':'~','\u00de':'{' ,
        'M':'\u00b5','\u00bc':'\u00af','\u00be':'\u00ad','\u00bf':'\u00b4'
      },
      'l': {
        '': '`1234567890-=' +
              'QWERTYUIOP[]\\' +
            'ASDFGHJKL;\'' +
            'ZXCVBNM,./'
      },
      's': {
        '': '~!@#$%^&*()_+' +
            'QWERTYUIOP{}|' +
            'ASDFGHJKL:\"' +
            'ZXCVBNM<>?'
      },
      '':  {
        '': '`1234567890-=' +
            'qwertyuiop[]\\' +
            'asdfghjkl;\'' +
            'ZXCVBNM,./'
      }
    }
  }
);
GKBD.layer.addLayout_("WestEuropean", KBD_ENGLISH);
GKBD.layer.setDefaultLayout_(KBD_ENGLISH);

GKBD.layer.addGroups_({
'MiddleEastern': [
  {id:'AR:Arabic:\u0627\u0644\u0639\u0631\u0628\u064a\u0629'},
//    {id:'AZ_CYRL:Azeri (Cyrl):az\u0259rbaycanca'},
  {id:'AZ_LATN,AZ:Azeri (Latn):az\u0259rbaycanca'},
  {id:'FA:Farsi/Persian:\u0641\u0627\u0631\u0633\u06cc'},
  {id:'HE:Hebrew:\u05e2\u05d1\u05e8\u05d9\u05ea'},
  {id:'HY:Armenian:\u0540\u0561\u0575\u0565\u0580\u0567\u0576'},
  {id:'KA:Georgian:\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8'},
  {id:'PS:Pashto:\u067e\u069a\u062a\u0648'},
  {id:'TR:Turkish:T\u00fcrk\u00e7e'},
  {id:'UR:Urdu:\u0627\u0631\u062f\u0648'}],

'EastEuropean': [
  {id:'BE:Belarusian:\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0456'},
  {id:'BG:Bulgarian:\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438'},
  {id:'CS:Czech:\u010ce\u0161tina'},
  {id:'EL:Greek:\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac'},
  {id:'ET:Estonian:Eesti'},
  {id:'HR:Croatian:hrvatski'},
  {id:'HU:Hungarian:magyar'},
  {id:'LT:Lithuanian:Lietuvi\u0173'},
  {id:'LV:Latvian:latvie\u0161u'},
  {id:'MK:Macedonian:\u043c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438'},
  {id:'PL:Polish:polski'},
  {id:'RO:Romanian:Rom\u00e2n\u0103'},
  {id:'RU:Russian:\u0420\u0443\u0441\u0441\u043a\u0438\u0439'},
  {id:'RU_LATN,Ru:Russian (Translit):\u0420\u0443\u0441\u0441\u043a\u0438\u0439 (Translit)'},
  {id:'SK:Slovak:slovensk\u00fd'},
  {id:'SQ:Albanian:shqipe'},
  {id:'SR_CYRL_CS,SR:Serbian (Cyrillic):\u0421\u0440\u043f\u0441\u043a\u0438 (\u040b\u0438\u0440\u0438\u043b\u0438\u0446\u0430)'},
  {id:'SR_LATN_CS,Sr:Serbian (Latin):\u0421\u0440\u043f\u0441\u043a\u0438 (\u041b\u0430\u0442\u0438\u043d\u0438\u0446\u0430)'},
  {id:'UK:Ukrainian:\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430'}],

'WestEuropean': [
  {id:'CY:Welsh:Cymraeg'},
  {id:'DA:Danish:Dansk'},
  {id:'DE:German:Deutsch'},
  {id:'DE_CH,De:German (Switzerland):Deutsch (Schweiz)'},
  {id:'EN_CA,En:English (Canada)'},
  {id:'EN_GB,en:English (UK)'},
  {id:'EN_IE,eN:English (Ireland)'},
  {id:'EN_COLEMAK,Ec:English (Colemak)'},
  {id:'EN_DVORAK,Ed:English (Dvorak)'},  
  {id:'ES:Spanish:espa\u00f1ol'},
  {id:'ES_MX,Es:Spanish (Mexico):espa\u00f1ol (M\u00e9xico)'},
  {id:'FI:Finnish:suomi'},
  {id:'FO:Faroese:f\u00f8royskt'},
  {id:'FR:French:fran\u00e7ais'},
  {id:'FR_BE,Fr:French (Belgium):fran\u00e7ais (Belgique)'},
  {id:'FR_CA,fr:French (Canada):fran\u00e7ais (Canada)'},
  {id:'IS:Icelandic:\u00cdslenska'},
  {id:'IT:Italian:italiano'},
  {id:'MT:Maltese:Malti'},
  {id:'NL:Dutch:Nederlands'},
  {id:'NO:Norwegian:Norwegian'}],
'Asian': [
  {id:'BN:Bengali:\u09ac\u09be\u0982\u09b2\u09be'},
  {id:'GU:Gujarati:\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0'},
  {id:'HI:Hindi:\u0939\u093f\u0902\u0926\u0940'},
  {id:'JA:Japanese:\u65E5\u672C\u8A9E'},
  {id:'JA_LATN,Ja:Japanese (Romaji):\u65E5\u672C\u8A9E (Romaji)'},
  {id:'KK:Kazakh:\u049a\u0430\u0437\u0430\u049b'},
  {id:'KM:Khmer:\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a'},
  {id:'KN:Kannada:\u0c95\u0ca8\u0ccd\u0ca8\u0ca1'},
  {id:'KY:Kyrgyz:\u041a\u044b\u0440\u0433\u044b\u0437'},
  {id:'LO:Lao:\u0ea5\u0eb2\u0ea7'},
  {id:'ML:Malayalam:\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02'},
  {id:'ML_inscript:Malayalam Inscript:\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02 \u0D07\u0D28\u0D4D\u200D\u0D38\u0D4D\u0D15\u0D4D\u0D30\u0D3F\u0D2A\u0D4D\u0D31\u0D4D\u0D31\u0D4D'},
  {id:'MN:Mongolian:\u041c\u043e\u043d\u0433\u043e\u043b'},
  {id:'MR:Marathi:\u092e\u0930\u093e\u0920\u0940'},
  {id:'OR:Oriya:\u0b13\u0b21\u0b3c\u0b3f\u0b06'},
  {id:'PA:Punjabi:\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40'},
  {id:'SI:Sinhalese'},
  {id:'TA:Tamil:\u0ba4\u0bae\u0bbf\u0bb4\u0bcd'},
  {id:'TE:Telugu:\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41'},
  {id:'TH:Thai:\u0e44\u0e17\u0e22'},
  {id:'TK:Turkmen'},
  {id:'TT:Tatar:\u0422\u0430\u0442\u0430\u0440'},
  {id:'UG:Uighur'},
  {id:'UZ:Uzbek:\u040e\u0437\u0431\u0435\u043a'}],
  'Special': [
  {id:'_A:Arrows'},
  {id:'_D:Dings'},
  {id:'_M:Math'}
  ]
});
