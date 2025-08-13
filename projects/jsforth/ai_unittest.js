// Copyright 2007 Vlad Patryshev
//
/**
 * JavaScript-based Forth.
 * Unittest for Array And String Interpreters (s.b. split?).
 * Requires ai.html
 *
 *  @author vpatryshev@google.com
 */

var track;

var ai;
var dict;

function tr(p) {
  return function() {
    track += p;
  };
}
var stackContent = "?";

var outputBuffer = ["?!"];

function setUp() {
  stackContent = "?";
  track = "";
  outputBuffer = [];
  inputdebug = false;
  ai = new JS4_AI();
  ai.debug = false;
  ai.print = function(value) {
    outputBuffer.push(value);
  }
  ai.stopAfter(500);
  dict = ai.d;
  ai.defineNative("testStack", function() { stackContent = ai.getDs().join(", ");});
}

function rs(string) {
  ai.interpret(string);
}

function r(code) {
  if (arguments.length == 0) throw "bad test, no code";
  ai.compile("test", arguments);
  ai.run("test");
}

function expect(expected) {
  assertEquals(expected, outputBuffer.join(""));
}

function check(code, expected) {
  rs(code);
  expect(expected);
}

/**/
function testInputStreamIterator() {
  var is = new InputStream("abc");
  assertTrue(is.hasNext());
  assertEquals("a", is.next());
  assertTrue(is.hasNext());
  assertEquals("b", is.next());
  assertTrue(is.hasNext());
  assertEquals("c", is.next());
  assertFalse(is.hasNext());
  try {
    var x = is.next();
    fail("Had to throw an exception");
  } catch(e) {
    // good, good!
  }
}
/**/
function testInputStreamWordsEasy() {
  var is = new InputStream("abc def");
  assertEquals("abc", is.nextWord(' '));
  assertTrue(is.hasNext());
  assertEquals("def", is.nextWord(' '));
  assertFalse(is.hasNext());
  try {
    var x = is.nextWord(' ');
    fail("Had to throw an exception");
  } catch(e) {
    // good, good!
  }
}

function testInputStreamWordsHard() {
  var is = new InputStream("abc\\ def\\\\ ghi");
  assertEquals("abc def\\", is.nextWord(' '));
  assertTrue(is.hasNext());
  assertEquals("ghi", is.nextWord(' '));
  assertFalse(is.hasNext());
}

function testInputStreamWithEmptyWords() {
  var is = new InputStream(" abc   def");
  assertEquals("", is.nextWord(' '));
  assertEquals("abc", is.nextWord(' '));
  assertEquals("", is.nextWord(' '));
  assertEquals("", is.nextWord(' '));
  assertEquals("def", is.nextWord(' '));
  assertFalse(is.hasNext());
}

function testEmptyStack() {
  ai.run("testStack");
  assertEquals("", stackContent);
}

function testLinear() {
  r(tr("1"), tr("2"), tr("3"), c("ret"));
  assertEquals("123", track);
}

function testError() {
  try {
    r(0, c("ret"));
    fail("Oops, had to throw actually");
  } catch(e) {
    // good, good.
  }
}

function c(name) {
  return dict[name].value;
}

function testStringLit() {
  r("Hello World", "Kiri-kiri-kiri...", c("."), c("."));
  expect("Kiri-kiri-kiri...Hello World");
}

function testCall() {
  ai.compile("sub1", [tr("1"), tr("2"), c("ret")]);
  r(tr("3"), c("sub1"), tr("4"), c("ret"));
  assertEquals("3124", track);
}

function test2Calls() {
  ai.compile("sub1", [tr("1"), tr("2"), c("ret")]);
  ai.compile("sub2", [tr("3"), c("sub1"), tr("4"), c("ret")]);
  r(tr("5"), c("sub1"), tr("6"), c("sub2"), tr("7"), c("ret"));
  assertEquals("512631247", track);
}

function testDup() {
  r("World", "Hello ", c("dup"), c("."), c("."), c("."), c("ret"));
  expect("Hello Hello World");
}

function testQDup() {
  r("World", "Hello ", c("?dup"), ai.lit(0), c("?dup"), ai.lit(77), c("?dup"), c("."), c("."), c("."), c("."), c("."), c("."), c("ret"));
  expect("77770Hello Hello World");
}

function test2Dup() {
  r("...", "World!", " Hello, ", c("2dup"), c("."), c("."), c("."), c("."), c("."), c("ret"));
  expect(" Hello, World! Hello, World!...");
}

function testDrop() {
  r("Tour", "World", "Hello", c("drop"), c("."), c("."), c("ret"));
  expect("WorldTour");
}

function test2Drop() {
  r(" and Village", "World", "Hello, ", "Hola ", "Mundo ", c("2drop"), c("."), c("."), c("."), c("ret"));
  expect("Hello, World and Village");
}

function testSwap() {
  r(" of Magic.", "Hello, ", "World", c("swap"), c("."), c("."), c("."), c("ret"));
  expect("Hello, World of Magic.");
}

function test2Swap() {
  r(" et le soleil", "World, ", "Hello ", "le monde", "salut ", c("2swap"), c("."), c("."), c("."), c("."), c("."), c("ret"));
  expect("Hello World, salut le monde et le soleil");
}

function testMinusRot() {
  r("!", "Hey, ", "Hello, ", "World", c("-rot"), c("."), c("."), c("."), c("."), c("ret"));
  expect("Hello, Hey, World!");
}

function testRot() {
  r("...", "Hey, ", "Hello", "World, ", c("rot"), c("."), c("."), c("."), c("."), c("ret"));
  expect("Hey, World, Hello...");
}

function testOver() {
  r("Hey", "Hello ", "World ", c("over"), c("."), c("."), c("."), c("."), c("ret"));
  expect("Hello World Hello Hey");
}

function testRdrop() {
  ai.compile("sub1", [c("rdrop"), tr("1"), tr("2"), c("ret")]);
  ai.compile("sub2", [tr("3"), c("sub1"), tr("4"), c("ret")]);
  r(tr("5"), c("sub2"), tr("6"), c("ret"));
  assertEquals("53126", track);
}

function testNRot3() {
  r("!", "Hello ", "Hey ", "World", ai.lit(3), c("nrot"), c("."), c("."), c("."), c("."), c("ret"));
  expect("Hey Hello World!");
}

function testNRot2() {
  r("!", "Hey", "Hello, ", "World, ", ai.lit(2), c("nrot"), c("."), c("."), c("."), c("."), c("ret"));
  expect("Hello, World, Hey!");
}

function testNRotm3() {
  r("...", "Hey, ", "Hello", "World, ", ai.lit(-3), c("nrot"), c("."), c("."), c("."), c("."), c("ret"));
  expect("Hey, World, Hello...");
}

function testNRotm2() {
  r("!", "Hey", "Hello, ", "World, ", ai.lit(-2), c("nrot"), c("."), c("."), c("."), c("."), c("ret"));
  expect("Hello, World, Hey!");
}

function testDot1() {
  r("*", c("."), c("ret"));
  expect("*");
}

function testDot2() {
  r("Hello ", c("."), "Forth ", c("."), "Dimension", c("."), c("ret"));
  expect("Hello Forth Dimension");
}

function testDog() {
  var pos = ai.mem().length;
  check('":(" , ":)" , ' + (pos+1) + ' @ .', ":)");
}

function testNegativeDog() {
  try {
    r(ai.lit(17), c("@"), c("."), c("ret"));
    fail("Had to throw an exception!");
  } catch(e) {
    // as designed
  }
}

function testBang() {
  var pos = ai.mem().length;
  r(";(", ":)", ai.lit(pos + 1), c("@"), c("."), ai.lit(pos), c("!"), ai.lit(pos), c("@"), c("."), c("ret"));
  expect(":):)");
}

function testMinus() {
  r(ai.lit(5), ai.lit(3), c("-"), c("."), c("ret"));
  expect("2");
}

function testPlus() {
  r(ai.lit(5.25), ai.lit(3.5), c("+"), c("."), c("ret"));
  expect("8.75");
}

function testMult() {
  r(ai.lit(5.25), ai.lit(-3), c("*"), c("."), c("ret"));
  expect("-15.75");
}

function testDiv() {
  r(ai.lit(5), ai.lit(4), c("/"), c("."), c("ret"));
  expect("1.25");
}

function testBadDiv() {
  r(ai.lit(5), ai.lit(0), c("/"), c("."), c("ret"));
  expect("Infinity");
}

function testRemainder() {
  r(ai.lit(-5.25), ai.lit(4), c("%"), c("."), c("ret"));
  expect("-1.25");
}

function testAdd1() {
  r(ai.lit(-5.25), c("1+"), c("."), c("ret"));
  expect("-4.25");
}

function testSub1() {
  r(ai.lit(-5.25), c("1-"), c("."), c("ret"));
  expect("-6.25");
}

function testMult2() {
  r(ai.lit(-5.25), c("2*"), c("."), c("ret"));
  expect("-10.5");
}

function testDiv2() {
  r(ai.lit(-5.25), c("2/"), c("."), c("ret"));
  expect("-2.625");
}

function testPlusBang() {
  var pos = ai.mem().length + 2;
  r(ai.lit(40), ai.goto(1), 5, ai.lit(2), ai.lit(pos), c("+!"), ai.lit(pos), c("@"), c("."), c("."), c("ret"));
  expect("740");
}

function testMinusBang() {
  var pos = ai.mem().length + 2;
  r(ai.lit(14), ai.goto(1), 5, ai.lit(2), ai.lit(pos), c("-!"), ai.lit(pos), c("@"), c("."), c("."), c("ret"));
  expect("314");
}

function testStarBang() {
  var pos = ai.mem().length + 2;
  r(ai.lit(1), ai.goto(1), 5, ai.lit(2), ai.lit(pos), c("*!"), ai.lit(pos), c("@"), c("."), c("."), c("ret"));
  expect("101");
}

function testDivBangSharp() {
  var pos = ai.mem().length + 2;
  r(ai.lit(25), ai.goto(1), 15, ai.lit(2), ai.lit(pos), c("/!"), ai.lit(pos), c("@"), c("."), c("."), c("ret"));
  expect("7.525");
}

function testDivBangFraction() {
  var pos = ai.mem().length + 2;
  r(ai.lit(25), ai.goto(1), 15, ai.lit(5), ai.lit(pos), c("/!"), ai.lit(pos), c("@"), c("."), c("."), c("ret"));
  expect("325");
}

function testRemainderBang() {
  var pos = ai.mem().length + 2;
  r(ai.lit(80), ai.goto(1), 17, ai.lit(3), ai.lit(pos), c("%!"), ai.lit(pos), c("@"), c("."), c("."), c("ret"));
  expect("280");
}

function testAbs() {
  r(ai.lit(10), c("abs"), c("."), ai.lit(0), c("abs"), c("."), ai.lit(-1), c("abs"),  c("."), c("ret"));
  expect("1001");
}

function testMax() {
  r(ai.lit(11), ai.lit(9), ai.lit(10), c("max"), c("max"), c("."), c("ret"));
  expect("11");
}

function testMin() {
  r(ai.lit(-11), ai.lit(-9), ai.lit(-10), c("min"), c("min"), c("."), c("ret"));
  expect("-11");
}

function testLshiftPositive() {
  r(ai.lit(1), ai.lit(2), c("<<"), c("."), c("ret"));
  expect("4");
}

function testRshiftPositive() {
  r(ai.lit(4), ai.lit(2), c(">>"), c("."), c("ret"));
  expect("1");
}

function testEqualYes() {
  r(ai.lit(-5.25), ai.lit(-5.25), c("="), c("."), c("ret"));
  expect("true");
}

function testEqualNo() {
  r(ai.lit(-5.25), ai.lit(4), c("="), c("."), c("ret"));
  expect("false");
}

function testNEYes() {
  r(ai.lit(-5.25), ai.lit(4), c("<>"), c("."), c("ret"));
  expect("true");
}

function testNENo() {
  r(ai.lit(-5.263), ai.lit(-5.263), c("<>"), c("."), c("ret"));
  expect("false");
}

function testGTYes() {
  r(ai.lit(5.25), ai.lit(4), c(">"), c("."), c("ret"));
  expect("true");
}

function testGTNo1() {
  r(ai.lit(-5.263), ai.lit(-5.263), c(">"), c("."), c("ret"));
  expect("false");
}

function testGTNo2() {
  r(ai.lit(-5.263), ai.lit(-5.262), c(">"), c("."), c("ret"));
  expect("false");
}

function testLTYes() {
  r(ai.lit(-5.25), ai.lit(4), c("<"), c("."), c("ret"));
  expect("true");
}

function testLTNo1() {
  r(ai.lit(-5.263), ai.lit(-5.263), c("<"), c("."), c("ret"));
  expect("false");
}

function testLTNo2() {
  r(ai.lit(-5.263), ai.lit(-5.264), c("<"), c("."), c("ret"));
  expect("false");
}

function testGEYes1() {
  r(ai.lit(5.25), ai.lit(4), c(">="), c("."), c("ret"));
  expect("true");
}

function testGEYes2() {
  r(ai.lit(-5.263), ai.lit(-5.263), c(">="), c("."), c("ret"));
  expect("true");
}

function testGENo() {
  r(ai.lit(-5.263), ai.lit(-5.262), c(">="), c("."), c("ret"));
  expect("false");
}

function testLEYes1() {
  r(ai.lit(-5.25), ai.lit(4), c("<="), c("."), c("ret"));
  expect("true");
}

function testLEYes2() {
  r(ai.lit(-5.263), ai.lit(-5.263), c("<="), c("."), c("ret"));
  expect("true");
}

function testLENo() {
  r(ai.lit(-5.263), ai.lit(-5.264), c("<="), c("."), c("ret"));
  expect("false");
}

function testNE0Yes() {
  r(ai.lit(-5.25), c("0<>"), c("."), c("ret"));
  expect("true");
}

function testNE0No() {
  r(ai.lit(0), c("0<>"), c("."), c("ret"));
  expect("false");
}

function testEQ0Yes() {
  r(ai.lit(0.0), c("0="), c("."), c("ret"));
  expect("true");
}

function testEQ0No() {
  r(ai.lit(-5.25), c("0="), c("."), c("ret"));
  expect("false");
}

function testGT0Yes() {
  r(ai.lit(0.1), c("0>"), c("."), c("ret"));
  expect("true");
}

function testGT0No1() {
  r(ai.lit(-5.25), c("0>"), c("."), c("ret"));
  expect("false");
}

function testGT0No2() {
  r(ai.lit(0), c("0>"), c("."), c("ret"));
  expect("false");
}

function testLT0Yes() {
  r(ai.lit(-0.1), c("0<"), c("."), c("ret"));
  expect("true");
}

function testLT0No1() {
  r(ai.lit(5.25), c("0<"), c("."), c("ret"));
  expect("false");
}

function testLT0No2() {
  r(ai.lit(0), c("0<"), c("."), c("ret"));
  expect("false");
}

function testAnd11() {
  r(true, true, c("and"), c("."), c("ret"));
  expect("true");
}

function testAnd10() {
  r(true, false, c("and"), c("."), c("ret"));
  expect("false");
}

function testAnd01() {
  r(false, true, c("and"), c("."), c("ret"));
  expect("false");
}

function testAnd00() {
  r(false, false, c("and"), c("."), c("ret"));
  expect("false");
}

function testOr11() {
  r(true, true, c("or"), c("."), c("ret"));
  expect("true");
}

function testOr10() {
  r(true, false, c("or"), c("."), c("ret"));
  expect("true");
}

function testOr01() {
  r(false, true, c("or"), c("."), c("ret"));
  expect("true");
}

function testOr00() {
  r(false, false, c("or"), c("."), c("ret"));
  expect("false");
}

function testNot1() {
  r(true, c("not"), c("."), c("ret"));
  expect("false");
}

function testNot2() {
  r(false, c("not"), c("."), c("ret"));
  expect("true");
}

function testGoto() {
  r("un", "happy", c("."), ai.goto(2), "loch", c("."), "ness", c("."), c("ret"));
  expect("happyness");
}

function testQGoto1() {
  r("un", "happy", c("."), true, ai.qGoto(2), "loch", c("."), "ness", c("."), c("ret"));
  expect("happyness");
}

function testQGoto2() {
  r("un", "happy", c("."), false, ai.qGoto(2), "less", c("."), "ness", c("."), c("ret"));
  expect("happylessness");
}

function testObject() {
  r(window, document, c("."), c("."), c("ret"));
  expect("[object HTMLDocument][object Window]");
}

function testObjDog() {
  r(ai, "d2c", c("@[]"), ai.d2c, c("="), c("."), c("ret"));
  expect("true");
}

function testObjBang() {
  r(ai.d2c["error"], c("."), "xxx", ai.d2c, "error", c("![]"), c("ret"));
  assertEquals("xxx", ai.d2c["error"]);
}

function testd2cPresence() {
  assertEquals("< n >", ai.d2c['<'] + " " + ai.d2c['not'] + " " + ai.d2c['>']);
}

function testc2dValidity() {
  for (var c in ai.c2d) {
    assertEquals(c, ai.d2c[ai.c2d[c]]);
  }
}

function testd2cValidity() {
  for (var c in ai.c2d) {
    assertEquals(c, ai.d2c[ai.c2d[c]]);
  }
 
  for (var d in ai.d2c) {
    assertEquals(d, ai.c2d[ai.d2c[d]]);
  }
}

function testRunStringSimple1() {
  check("2 3 + . ", "5");
}

function testRunStringSimple2() {
  check("123 .", "123");
}

function testRunStringSimple3() {
  check('"abc" .', "abc");
}

function testRunStringWithLiterals() {
  check('123 . "abc " . "" . " : " . -1.23 . .5 . 1. .', "123abc  : -1.230.51");
}

function testRunStringWithDoLoopExplicit() {
  rs(': test 10 0 s >r >r [ <m ] 1 rp r@ = [ >? s ] r@ . r> 1+ >r [ <r ] [ >e ] rd rd ;');
  check(' test', "0123456789");
}

function testDebug3() {
  check('"ba" : abc "jo" d ; abc . . .', "jojoba");
}

function testBackMark() {
  var pos = ai.mem().length;
  check(': xx ." abc" [ <m ] ; .', "" + (pos + 2));
}

function testDo0() {
  var pos = ai.mem().length;
  check(': test 3 0 do "abc" ; . . ', "" + (pos + 5) + (pos + 8));
}

/**/
function testDo() {
  ai.stopAfter(500);
  ai.debug = true;
  var pos = ai.mem().length;
  try {
  check(': test "[test]" . 3 0 do ." +" r@ . ." +" r> 1+ >r [ "(" . 2d . " " . . ")" . <r  d . ">e" ] rd rd ; test', "0123456789\n" + ai.memdump(pos));
}catch (e) { throw e + "\n------------------\n" + ai.memdump(pos);}
  //  ai.debug = true;
}

function testRunWithVoidDoLoop() {
  check(': test 10 10 do  r@ . r> 1+ >r [ <r >e ] rd rd ; test', "");
}

function testLTYesS() {
  check('-5.25 4 < . ', "true");
}

function testLTNo1S() {
  check('-5.263 -5.263 < .', "false");
}

function testLTNo2S() {
  check('-5.262 -5.263 < .', "false");
}

function testBrackets() {
  check(': x "a" . [ "b" . ] ; x', "ba");
}

function testMarkResolveForward() {
  check(': test "it is " . [ >m ] "not " . [ >e ] "just a test" . ; test', "it is just a test");
}

function testMarkQResolveForwardPositive() {
  check(': test "it is " . 1 [ >? ] "not " . [ >e ] "just a test" . ; test', "it is just a test");
}

function testMarkQResolveForwardNegative() {
  check(': test "it is " . 0 [ >? ] "not " . [ >e ] "just a test" . ; test', "it is not just a test");
}

function testInterpret1() {
  var pos = ai.mem().length;
  ai.interpret('123 ] "abc" [');
  assertEquals(pos + 1, ai.mem().length);
  ai.mem()[pos]();
  assertEquals("abc, 123", ai.getDs().join(", "));
}

function testInterpret2() {
  var pos = ai.mem().length;
  ai.interpret('] "abc" "def" [');
  assertEquals(pos + 2, ai.mem().length);
  ai.mem()[pos]();
  assertEquals("abc", ai.getDs()[0]);
  ai.mem()[pos + 1]();
  assertEquals("def", ai.getDs()[0]);
}
/**/
function testDef() {
  ai.interpret(': def1 3 2 + . ; 1 .');
  check('"number " . def1 r', "1number 5");
}

function testDefAndCalls() {
  ai.interpret(': def1 2 + ; : def2 "result is " . 3 def1 . "!" . ;');
  check('def2', "result is 5!");
}

function testApo() {
  var pos = ai.mem().length;
  ai.interpret(": def1 2 + ;");
  check(" : def2 ' def1 . ; def2", "" + pos);
}

function testAbortQPositive() {
  try {
    ai.interpret(': xxx 1 ao abcdef" ;');
    rs('xxx');
    fail("Oops, had to throw actually");
  } catch(e) {
    assertEquals("abcdef", e);
  }
}

function testAbortQNegative() {
  try {
    ai.interpret(': xxx 0 ao abcdef" ;');
    rs('xxx');
  } catch(e) {
    fail("Oops, had to throw actually");
  }
}

function testHere() {
  ai.interpret(': testHere h "abc" , "def" , h - . ;');
  check('testHere', "-2");
}

function testAllot() {
  ai.interpret(': testAllot h 10 al h - . ;');
  check('testAllot', "-10");
}

function testI() {
  check('10 >r 0 >r <m i . r> 1+ d >r 1 rp < <? rd rd', "0123456789");
}

function testJ() {
  check('10 >r 0 >r <m 2 >r 0 >r <m j . r> 1+ d >r 1 rp < <? rd rd r> 1+ d >r 1 rp < <? rd rd', "00112233445566778899");
}

function testK() {
  ai.stopAfter(5000);
  check('10 >r 0 >r <m 2 >r 0 >r <m 2 >r 0 >r <m k . r> 1+ d >r 1 rp < <? rd rd  r> 1+ d >r 1 rp < <? rd rd r> 1+ d >r 1 rp < <? rd rd', "0000111122223333444455556666777788889999");
}

function testQuoteDot() {
  rs(': x ." abc" ." \\"def\\"" ; x');
  alert(ai.memdump(0));
  check(': x ." abc" ." \\"def\\"" ; x', 'abc"def"');
}
/**/