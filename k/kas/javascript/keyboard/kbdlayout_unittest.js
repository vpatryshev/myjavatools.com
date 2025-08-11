// Copyright Google, Inc., 2006
// @author Vlad Patryshev (vpatryshev@google.com)
//
// Unittest for kbdlayout.js
// Requires kbdlayout_unittest.hmtl
//

var config = {
  id:'RU_LATN,Ru', name:'Russian (Translit)',
  titleProvider : function() { return "this is a title";},
  shortTitle: "keyboard is disabledd",
  mappings: {
    'sl':{'\u00c0':'\u044a','1':'!','2':'@','3':'"','4':'$','5':'%','6':'^',
          '7':'&','8':'*','9':'(','0':')','m':'_','=':'\u044c' ,
          'Q':'\u044f','W':'\u0436','E':'\u0435','R':'\u0440','T':'\u0442',
          'Y':'\u044b','U':'\u0443','I':'\u0438','O':'\u043e','P':'\u043f',
          '\u00db':'\u0448','\u00dd':'\u0449','\u00dc':'\u044d' ,
          'A':'\u0430','S':'\u0441','D':'\u0434','F':'\u0444','G':'\u0433',
          'H':'\u0447','J':'\u0439','K':'\u043a','L':'\u043b',';':':',
          '\u00de':'"' ,
          'Z':'\u0437','X':'\u0445','C':'\u0446','V':'\u0432','B':'\u0431',
          'N':'\u043d','M':'\u043c','\u00bc':'<','\u00be':'>','\u00bf':'?'
         },
    'l': {'\u00c0':'\u042a','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6',
          '7':'7','8':'8','9':'9','0':'0','m':'-','=':'\u042c' ,
          'Q':'\u042f','W':'\u0416','E':'\u0415','R':'\u0420','T':'\u0422',
          'Y':'\u042b','U':'\u0423','I':'\u0418','O':'\u041e','P':'\u041f',
          '\u00db':'\u0428','\u00dd':'\u0429','\u00dc':'\u042d' ,
          'A':'\u0410','S':'\u0421','D':'\u0414','F':'\u0424','G':'\u0413',
          'H':'\u0427','J':'\u0419','K':'\u041a','L':'\u041b',';':';',
          '\u00de':'\'' ,
          'Z':'\u0417','X':'\u0425','C':'\u0426','V':'\u0412','B':'\u0411',
          'N':'\u041d','M':'\u041c','\u00bc':',','\u00be':'.','\u00bf':'/'
         },
    's': {'\u00c0':'\u042a','1':'!','2':'@','3':'"','4':'$','5':'%','6':'^',
          '7':'&','8':'*','9':'(','0':')','m':'_','=':'\u042c' ,
          'Q':'\u042f','W':'\u0416','E':'\u0415','R':'\u0420','T':'\u0422',
          'Y':'\u042b','U':'\u0423','I':'\u0418','O':'\u041e','P':'\u041f',
          '\u00db':'\u0428','\u00dd':'\u0429','\u00dc':'\u042d',
          'A':'\u0410','S':'\u0421','D':'\u0414','F':'\u0424','G':'\u0413',
          'H':'\u0427','J':'\u0419','K':'\u041a','L':'\u041b',';':':',
          '\u00de':'"' ,
          'Z':'\u0417','X':'\u0425','C':'\u0426','V':'\u0412','B':'\u0411',
          'N':'\u041d','M':'\u041c','\u00bc':'<','\u00be':'>','\u00bf':'?'
         },
    '':  {'\u00c0':'\u044a','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6',
          '7':'7','8':'8','9':'9','0':'0','m':'-','=':'\u044c' ,
          'Q':'\u044f','W':'\u0436','E':'\u0435','R':'\u0440','T':'\u0442',
          'Y':'\u044b','U':'\u0443','I':'\u0438','O':'\u043e','P':'\u043f',
          '\u00db':'\u0448','\u00dd':'\u0449','\u00dc':'\u044d',
          'A':'\u0430','S':'\u0441','D':'\u0434','F':'\u0444','G':'\u0433',
          'H':'\u0447','J':'\u0439','K':'\u043a','L':'\u043b',';':';',
          '\u00de':'\'',
          'Z':'\u0437','X':'\u0445','C':'\u0446','V':'\u0432','B':'\u0431',
          'N':'\u043d','M':'\u043c','\u00bc':',','\u00be':'.','\u00bf':'/'
         },
    'sc':{'=':'+', 'O':'\u0405', 'B':'\u0406', 'Q':'\u0407', 'J':'\u0460',
          'K':'\u047e','\u00c0':'\u0462','T':'\u0464','Z':'\u0466','X':'\u0468',
          'E':'\u046a','R':'\u046c','P':'\u046e','S':'\u0470',
          'A':'\u0472','N':'\u0474','M':'\u0476','W':'\u0478','L':'\u047a',
          ';':'\u047c','\u00db':'{','\u00dd':'}','\u00dc':'|'
         },
    'cl':{'=':'+','O':'\u0405','B':'\u0406','Q':'\u0407','J':'\u0460',
         'K':'\u047e','\u00c0':'\u0462','T':'\u0464','Z':'\u0466','X':'\u0468',
         'E':'\u046a','R':'\u046c','P':'\u046e','S':'\u0470','A':'\u0472',
         'N':'\u0474','M':'\u0476','W':'\u0478','L':'\u047a',';':'\u047c',
         '\u00db':'[','\u00dd':']','\u00dc':'\\'
        },
    'c': {'=':'=','O':'\u0455','B':'\u0456','Q':'\u0457','J':'\u0461',
          'K':'\u047f','\u00c0':'\u0463','T':'\u0465','Z':'\u0467',
          'X':'\u0469','E':'\u046b','R':'\u046d','P':'\u046f','S':'\u0471',
          'A':'\u0473','N':'\u0475','M':'\u0477','W':'\u0479','L':'\u047b',
          ';':'\u047d','\u00db':'[','\u00dd':']','\u00dc':'\\'
         },
    'scl':{'=':'=','O':'\u0455','B':'\u0456','Q':'\u0457','J':'\u0461',
           'K':'\u047f','\u00c0':'\u0463','T':'\u0465','Z':'\u0467',
           'X':'\u0469','E':'\u046b','R':'\u046d','P':'\u046f','S':'\u0471',
           'A':'\u0473','N':'\u0475','M':'\u0477','W':'\u0479','L':'\u047b',
           ';':'\u047d','\u00db':'{','\u00dd':'}','\u00dc':'|'
          }
    },
    transform: {
      //           jo                      ju
      '\u0439\u043e':'\u0451','\u0439\u0443':'\u044e',
      '\u0419\u041e':'\u0401','\u0419\u0423':'\u042e',
      //           yo                      yu
      '\u044b\u043e':'\u0451','\u044b\u0443':'\u044e',
      '\u042b\u041e':'\u0401','\u042b\u0423':'\u042e',
      '21': '\001\0005',
      '[345]6': '\000X',
      'xy' : '',
      'wz' : '!',
      'u!.' : ':)'
    }
};

isDefined = function(x) {
  return typeof x != 'undefined';
}

var layout = new GKBD.Layout(config);
var abbr = GKBD.abbr_;

function setUp() {
  if (layout) layout.DEBUG = false;
  abbr = GKBD.abbr_; // Funny. Some browsers run test script in parallel with loading the tested one.
}

function checkEquality(expected, actual, msg) {
  if (typeof expected == 'object') {
    for (key in expected) {
      if (key in actual) {
        checkEquality(expected[key], actual[key], msg + key + ": "); 
      } else {
        fail(msg + " missing " + key);
      }
    }
  } else {
    assertEquals(msg + ': Got ' + show(actual) + ' instead of ' + show(expected),
        expected, actual);
  }
}

function testReturnValue() {
  assertEquals("xxx", returnValue("xxx")());
}

function testPresence0() {
  assertFalse(GKBD === undefined);
}

function testPresence1() {
  assertFalse(GKBD.Layout === undefined);
}

function testPresence2() {
  assertFalse(config === undefined);
}

function testPresence3() {
  assertFalse(GKBD.abbr_ === undefined);
}

function testPresence4() {
  assertFalse(abbr === undefined);
}

function testConstructor() {
  assertFalse(layout === undefined);
}

function testTitle() {
  assertEquals("this is a title", layout.getTitle_());
}

function testId_() {
  assertEquals("Ru", layout.getId_());
}

function testMapping1() {
  var mapping = layout.getMapping_('sc');
  assertEquals('\u047e', mapping['K']);
}

function testMapping2() {
  var mapping = layout.getMapping_('s');
  assertEquals('\u041a', mapping['K']);
}

function testMapping3() {
  var mapping = layout.getMapping_('');
  assertEquals('\u043a', mapping['K']);
}

function testTransform1() {
  assertEquals('a', layout.transform_('a'));
  assertEquals('b', layout.transform_('b'));
}

function testTransform2() {
  assertEquals('b', layout.transform_('b'));
  assertEquals('\u0439', layout.transform_('\u0439'));
}

function testTransform3() {
  assertEquals('\u0439', layout.transform_('\u0439'));
  assertEquals('c', layout.transform_('c'));
}

function testTransform4() {
  assertEquals('c', layout.transform_('c'));
  assertEquals('\u0439', layout.transform_('\u0439'));
  checkEquality({back: 1, chars: '\u0451'}, layout.transform_('\u043e'));
}

function testTransform5() {
  assertEquals('3', layout.transform_('3'));
  assertEquals('2', layout.transform_('2'));
  checkEquality({back: 1, chars:'125'}, layout.transform_('1'));
}

function testTransform6() {
  assertEquals('3', layout.transform_('3'));
  checkEquality({back: 1, chars:'3X'}, layout.transform_('6'));
  assertEquals('a', layout.transform_('a'));
  assertEquals('6', layout.transform_('6'));
  assertEquals('5', layout.transform_('5'));
  checkEquality({back: 1, chars:'5X'}, layout.transform_('6'));
}

function testTransform7() {
  layout.DEBUG = true;
  assertEquals('u',  layout.transform_('u'));
  assertEquals('w',  layout.transform_('w'));
  assertEquals('x',  layout.transform_('x'));
  checkEquality({back: 1, chars:''}, layout.transform_('y'));
  checkEquality({back: 1, chars:'!'},layout.transform_('z'));
  checkEquality({back: 2, chars:':)'},layout.transform_('.'));
}

function testAbbr1() {
  assertEquals(
      '<abbr style="border-style:none" title="t1 here">t2 right here</abbr>',
      abbr("t2 right here", "t1 here"));
}

function testAbbr2() {
  assertEquals('just t1', abbr('just t1', 'just t1'));
}
