// Copyright 2007 Vlad Patryshev
//

/**
 * JavaScript-based Forth.
 * Array Interpreter.
 *
 *  @author vpatryshev@google.com
 */

/**
 * InputStream class. Reads characters and words.
 * Instantiates from a string.
 */
function InputStream(s) {
  var self = this;
  var pos = 0;
	
  /** @return true if the stream has more characters to read */
  self.hasNext = function() {
    return pos < s.length;
  }
	
  /**
   * Reads the next caracter and moves the read pointer forward.
   * @return the next character from the stream
   * @throws an exception if there are no characters to read
   */
  self.next = function() {
    if (!self.hasNext()) throw "EOF";
    return s.charAt(pos++);
  }

  /**
   * Returns the next caracter, keeping the read pointer intact.
   * @return the next character from the stream
   * @throws an exception if there are no characters to read
   */
  self.peek = function() {
    if (!self.hasNext()) throw "EOF";
    return s.charAt(pos);
  }

  /**
   * @return read pointer position
   */
  self.position = function() {
    return pos;
  }

  /**
   * Reads a word from the stream.
   * @param separator (String) separates the word
   * @return the word separated by the separator, or
   *         ending the input
   * @throws an exception if there's nothing to read
   */

  self.nextWord = function(separator) {
    if (!self.hasNext()) throw "EOF";
    var out = [];
    do {
      var c = s.charAt(pos);
      switch (c) {
        case separator:
          break;
        case '\\':
          ++pos;
        default:
          out.push(s.charAt(pos));
      }
    } while (++pos < s.length && c != separator);

    var result = out.join("");
    if (inputdebug) alert("new pos=" + pos + ", result=|" + result + "|");
    return result;
  }
}
var inputdebug = false;
/**
 * Constructor.
 */
function JS4_AI() {
  var self = this;

  /**
   * Default printer function. You may want to redefine it, right?
   * @param the value to print.
   */
  self.print = function(value) {
    alert(self.debug ? ("ai.print(" + value + ")") : value);
  }

  /**
   * Data Stack. Stores functions, numbers, strings, objects.
   */
  var ds = [];

  /**
   * Return Stack. Stores return pointers. (But you are free to use it.)
   */
  var rs = [];

  /**
   * Instruction Pointer. Points to the next instruction in memory.
   */
  var ip = -1;

  function setIp(newIp) {
    checkPointer(newIp, 0, "previous ip was " + ip + "\n" + self.memdump());
    ip = newIp;
  }

  var patience = Math.MAX_VALUE;
  self.debug = false;

  self.stopAfter = function(nsteps) {
    patience = nsteps;
  }

  self.log = function(message) {
    if (!confirm("ip:" + ip + "\nstack: " + ds.join("|") + "\n" + message + "\nproceed?")) throw "Stopped";
  }

  var constant_types = {'string':1, 'boolean':1, 'object': 1};

  self.step = function(opt_ip) {
    if (0 > patience--) throw "Processor out of patience";
    if (opt_ip) setIp(opt_ip);
    reported = false;
    var value = memory[ip++];
    if (typeof value == 'undefined') {
      throw "Undefined value at ip " + (ip - 1);
    }
    if (self.debug) {
      self.log("running " + value);
    }
    if (typeof value == 'function') {
      value(); // direct call
    } else if (typeof value in constant_types) {
      ds.unshift(value); // obviously a constant
    } else if (typeof value == 'number') {
      rs.unshift(ip); // reference
      setIp(value);
    } else {
      throw "Wrong value type at ip " + (ip - 1) + ": " +
            (typeof value) + " " + value;
    }
  }

  function callCompiled(value) {
    self.stopped = false;
    guard = rs.length;
    setIp(value);
    while (rs.length >= guard && !self.stopped) {
      self.step();
    }
  }

  self.run = function(name) {
    if (typeof dictionary[name].value == 'function') {
      dictionary[name].call();
    } else {
      callCompiled(dictionary[name].value);
    }
  }

  function checkPointer(ptr, lowest, opt_msg) {
    if (typeof ptr != 'number' || ptr >= memory.length || ptr < lowest) {
      throw "seg fault at " + ptr + " " + opt_msg;
    }
  }

  var reported = false;

  self.lit = function(x, name) {
    var entry = function() {
      if (self.debug && patience-- > 0) self.log("constant " + x);
      reported = true;
      push(x);
    }
    entry.word = 'const' + (name ? ('.' + name) : ('"' + x + '"'));
    return entry;
  }

  function swap(i, j) {
    var x = ds[i];
    ds[i] = ds[j];
    ds[j] = x;
  }

  function push(value) {
    ds.unshift(value);
  }

  function pop() {
    return ds.shift();
  }

  function rpop() {
    return rs.shift();
  }

  function rpush(value) {
    return rs.unshift(value);
  }

  function popPtr(lowerLimit) {
    var ptr = pop();
    checkPointer(ptr, lowerLimit);
    return ptr;
  }

  function goto(step) {
    if (self.debug && patience --> 0) self.log("Stepping from " + ip + " by " + step);
    ip += step - 0;
    checkPointer(ip, 0);
    reported = true;
  }

  self.goto = function (step) {
    var result = function() {
      goto(step);
    }
    result.word = "goto" + step;
    return result;
  }

  self.qGoto = function(step) {
    var result = function() {
      if (pop()) {
        goto(step);
      }
    }
    result.word = "?goto" + step;
    return result;
  }

  function abort(message) {
    var result = function() {
      if (pop()) throw message;
    }
    result.word = 'abort"' + message + '"';
    return result;
  }

  var inverseIndex = [];

  self.show = function(x) {
    try {
      return typeof x == 'function' && x.word ? x.word : (inverseIndex[x] || x);
    } catch(e) {
      return x + ": " + e;
    }
  };

  var compiling = false;

  function callerNative(value) {
    return function() { compiling ? memory.push(value) : value();};
  }

  function callerNativeImmediate(value) {
    return function() { value();};
  }

  function callerCompiled(value) {
    return function() { compiling ? memory.push(value) : callCompiled(value);};
  }

  function callerCompiledImmediate(value) {
    return function() { callCompiled(value);};
  }

  function nativeEntry(name, value) {
    this.name = name;
    this.value = value;
    this.call = callerNative(value)
  }

  self.defineNative = function(name, value) {
    dictionary[name] = new nativeEntry(name, value);
    value.word = name;
    self.d2c[name] = self.c2d[name] = name;
  };

  self.defineCompiled = function(name, value) {
    dictionary[name] = {
      name:  name,
      value: value,
      call:  callerCompiled(value)
    };
    inverseIndex[value] = name;
    self.d2c[name] = self.c2d[name] = name;
  };

  self.compile = function(name, code) {
    self.defineCompiled(name, memory.length);
    for (var i = 0; i < code.length; i++) {
      memory.push(code[i]);
    }
  };

  var latest;

  var dictionary = function(source) {
    var dictionary = {};
    for (var id in source) {
      dictionary[id] = new nativeEntry(id, source[id]);
      source[id].word = id;
    }
    return dictionary;
  }({
    error:      function() { throw "error";},
    abort:      abort("aborted"),
    ret:        function() { setIp(rpop()); },
    "@":        function() { push(memory[popPtr(0)]); },
    "!":        function() {
                         var ptr = popPtr(frozen);
                         memory[ptr] = pop();
                       },
    ",":         function() { memory.push(pop()); if (self.debug) self.log(self.memdump())},
    ".":         function() { self.print(pop()); },
    "+":         function() { var x = pop(); ds[0] += x; },
    "+!":        function() { var ptr = popPtr(frozen); memory[ptr] += pop(); },
    "-":         function() { var x = pop(); ds[0] -= x; },
    "-!":        function() { var ptr = popPtr(frozen); memory[ptr] -= pop(); },
    "*":         function() { var x = pop(); ds[0] *= x; },
    "*!":        function() { var ptr = popPtr(frozen); memory[ptr] *= pop(); },
    "/":         function() { var x = pop(); ds[0] /= x; },
    "/!":        function() { var ptr = popPtr(frozen); memory[ptr] /= pop(); },
    "%":         function() { var x = pop(); ds[0] %= x; },
    "%!":        function() { var ptr = popPtr(frozen); memory[ptr] %= pop(); },
    "1+":        function() { ds[0]++; },
    "1-":        function() { ds[0]--; },
    "2*":        function() { ds[0] *= 2; },
    "2/":        function() { ds[0] /= 2; },
    abs:         function() { ds[0] = Math.abs(ds[0]); },
    max:         function() { var x = pop(); ds[0] = Math.max(x, ds[0]); },
    min:         function() { var x = pop(); ds[0] = Math.min(x, ds[0]); },
    "=":         function() { var x = pop(); ds[0] = x == ds[0]; },
    "<":         function() { var x = pop(); ds[0] = x >  ds[0]; },
    ">":         function() { var x = pop(); ds[0] = x <  ds[0]; },
    "<>":        function() { var x = pop(); ds[0] = x != ds[0]; },
    "<=":        function() { var x = pop(); ds[0] = x >= ds[0]; },
    ">=":        function() { var x = pop(); ds[0] = x <= ds[0]; },
    "0":         function() { push(0); },
    "0<":        function() { ds[0] = ds[0] < 0; },
    "0=":        function() { ds[0] = ds[0] == 0; },
    "0>":        function() { ds[0] = ds[0] > 0; },
    "0<>":       function() { ds[0] = ds[0] != 0; },
    and:         function() { var x = pop(); ds[0] = ds[0] && x; },
    or:          function() { var x = pop(); ds[0] = ds[0] || x; },
    not:         function() { ds[0] = !ds[0]; },
    "<<":        function() { var x = pop(); ds[0] <<= x; },
    ">>":        function() { var x = pop(); ds[0] >>= x; },
    dup:         function() { push(ds[0]);},
    "?dup":      function() { if (ds[0]) { push(ds[0]); }},
    "2dup":      function() { push(ds[1]); push(ds[1]);},
    drop:        function() { pop(); },
    "2drop":     function() { pop(); pop(); },
    swap:        function() { swap(0, 1)},
    "2swap":     function() { swap(0, 2); swap(1, 3)},
    over:        function() { push(ds[1]);},
    "-rot":      function() { swap(0, 1); swap(1, 2)},
    rot:         function() { swap(1, 2); swap(0, 1)},
    nrot:        function() { var shift = pop(); // consider using Array.splice
                              if (shift > 0) {
                                for (i = 0; i < shift - 1; i++) {
                                  swap(i, i + 1);
                                }
                              } else if (shift < 0) {
                                for (i = -shift - 1; i > 0; i--) {
                                  swap(i, i - 1);
                                }
                              }
                            },
    rdrop:       function() { rpop(); },
    rpick:       function() { push(rs[pop()]); },
    '1rpick':    function() { push(rs[1]); },
    'r@':        function() { push(rs[0]) },
    'r>':        function() { push(rpop()); },
    '>r':        function() { rpush(pop()); },
    i:           function() { push(rs[0]); },
    j:           function() { push(rs[2]); },
    k:           function() { push(rs[4]); },
    here:        function() { if (self.debug) self.log("here " + memory.length); push(memory.length); },
    allot:       function() { memory[memory.length + Math.max(pop(), 1) - 1] = 0; },
    '@[]':       function() { var index = pop(); ds[0] = ds[0][index]; },
    '![]':       function() {
                              var index = pop();
                              var object = pop();
                              object[index] = pop();
                            },
    '>mark':     function() { dictionary.here.value(); memory.push(self.goto); },
    '>?mark':    function() { dictionary.here.value(); memory.push(self.qGoto); },
    '<mark':     function() { dictionary.here.value(); if (self.debug) self.log(ds.join(" "))},
    '>resolve':  function() { var where = pop(); log(">resolve to " + where); try { memory[where] = memory[where](memory.length - where - 1); } catch (e) { throw e + ":\n" + where + "]" + memory[where]}},
    '<resolve':  function() { memory.push(self.goto(pop() - memory.length - 1)); },
    '<?resolve': function() { memory.push(self.qGoto(pop() - memory.length - 1)); },
    '[':         function() { compiling = false; },
    ']':         function() { compiling = true; },
    leave:       function() { rpop(); rpop(); setIp(rpop()); },
    ';':         function() { memory.push(dictionary.ret.value);
                              compiling = false; },
    define:      function() { latest = input.nextWord(' ');
   							              self.defineCompiled(latest, memory.length);
      if (self.debug) alert(latest + "->" + dictionary[latest].value);
                            },
  	':':         function() { dictionary.define.value();
                              compiling = true;
                            },
    immediate:   function() { var entry = dictionary[latest];
                              entry.immediate = true;
                              entry.call = callerCompiledImmediate(entry.value)},
    "'":         function() { var name = input.nextWord(' ');
                              var entry = dictionary[self.c2d[name]];
                              if (!entry) throw "Could not find " + name;
                              literal(entry.value, name);
                            },
    '"':         function() { literal(input.nextWord('"')); },
    '."':        function() { dictionary['"'].value(); memory.push(dictionary['.'].value)},
    'abort"':    function() { memory.push(abort(input.nextWord('"'))); }
  });

  self.d = dictionary;

  var immediates = ['[', ']', 'leave', ';', ':', "'", 'abort"', '"', '."'];

  for (var i = 0; i < immediates.length; i++) {
    var entry = dictionary[immediates[i]];
    entry.immediate = true;
    entry.call = callerNativeImmediate(entry.value);
  }

  self.memdump = function(opt_pos) {
    var memlog = "";
    for (var i = opt_pos || 0; i < memory.length; i++) {
      memlog += i + "]" + self.show(memory[i]) + "\n";
    }
    return memlog;
  }

  function encrypt(n) {
    var buf = [];
    if (n <= 0) {
      return "$";
    }
    while (n > 0) {
      var d = n % 77;
      buf.push(String.fromCharCode(d + 36));
      n = Math.floor(n / 77);
    }
    return buf.reverse().join('');
  }

  self.c2d = {};
  self.d2c = {};
  self.curId = 0;

  function updateDict(name) {
    var firstChar = name.substring(0, 1);;
    var code = name.charCodeAt(0);
    var shortId = firstChar;
    if (shortId in self.c2d || (code < 58 && code > 48)) {
      shortId = name.length < 3 ? name : name.substring(0, 2);
    }
    if (shortId in self.c2d && name.length > 3) {
      shortId = firstChar + name.substring(2, 3);
    }
    if (shortId in self.c2d) {
      shortId = encrypt(self.curId++);
    }
    self.c2d[shortId] = name;
    self.d2c[name] = shortId;
  }

  var reNumber = new RegExp("^\\-?(\\d+\\.?\\d*|\\d*\\.\\d+)$");

  var input;

  function literal(value, opt_name) {
    if (compiling) {
      if (self.debug) self.log(memory.length + "]\"" + value + "\"" + "\nstack:" + ds.join(","));
      memory.push(self.lit(value, opt_name));
    } else {
      if (self.debug) self.log(value + "->stack");
      push(value);
    }
  }

  self.interpret = function(s) {
    self.stopped = false;
    input = new InputStream(s);
    if (self.debug) self.log("Running " + s + "\nstack:" + ds.join(","));

 	  while (input.hasNext()) {
      if (0 > patience--) throw "Compiler out of patience";
      var value = "";
      var c = input.peek();
      if (c == '"') {
        input.next();
        value += input.nextWord(c);
        literal(value);
       } else {
        value = input.nextWord(' ');
        if (value == "") continue;

        if (value in self.c2d) {
          var id = self.c2d[value];
          var entry = dictionary[id];
          if (self.debug) self.log("word: \"" + entry.name + "\"" + " - " + (compiling ? "compiling" : "running") + " " + (entry.immediate ? " immediate" : "") + "\nstack:" + ds.join(",") + "\n" + entry.call);
          entry.call();
        } else if(reNumber.exec(value)) {
          literal(value - 0);
        } else {
          if (self.debug) self.log(value + " not found.");
          throw "Bad code: \"" + value + "\" at position " + (input.position() - value.length - 1);
        }
      }
    }
    if (self.debug) self.log("end of string, stack:" + ds.join(","));
  }

  /**
   * Main memory. It is under question whether this should come from outside.
   */
  var memory = [function() { self.running = false;}];

  self.mem = function() {
    return memory;
  };

  self.cleanMemory = function() {
    var tmp = [];
    for (var i = 0; i++; i <= frozen) {
      tmp[i] = memory[i];
    }
    memory = tmp;
  };
  // prepare for compilation
  for (var id in dictionary) {
    if (!(id in self.d2c)) updateDict(id);
  }

//  self.debug = true;
  self.interpret(": do ' s , ' >r , ' >r , <m ' 1r , ' r@ , ' 2d , ' . , ' . , ' = , >? s ; im");
  /**
   * Limits write access to memory
   */
  var frozen = memory.length;
//alert(self.memdump())
  self.getDs = function() {
    return ds;
  };

  self.getRs = function() {
    return rs;
  };

  self.getIp = function() {
    return ip;
  };

  for (var id in dictionary) {
    if (!(id in self.d2c)) updateDict(id);
  }
}
