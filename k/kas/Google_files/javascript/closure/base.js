// Copyright 2006 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Bootstrap for the Google JS Library (Closure)  Also includes
 * stuff taken from //depot/google3/javascript/lang.js
 * @author pupius@google.com (Dan Pupius)
 */

/**
 * This is overridden by the compiler when active
 * @type Boolean
 */
var COMPILED = false;

/**
 * Base namespace for library
 */
var goog = {};


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
goog.global = this;

/**
 * Creates object stubs for a namespace
 * @param {String} name Name of new namespace
 */
goog.createNamespace = function(name) {
  var parts = name.split('.');
  var cur = goog.global;
  for (var part; part = parts.shift(); ) {
    if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};

/**
 * Returns an object based on its fully qualified name
 * @param {String} name The fully qualified name
 * @returns {Object} The object or if not found null
 */
goog.getObjectByName = function(name) {
  var parts = name.split('.');
  var cur = goog.global;
  for (var part; part = parts.shift(); ) {
    if (cur[part]) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};


/**
 * Tells Closure that this files defines an object
 * @param {String} name name of the object that this file defines
 */
goog.provide = function(name) {
  goog.createNamespace(name);
};


if (!COMPILED) {
  /**
   * This object is used to keep track of dependencies and other data that is
   * used for loading scripts
   * @private
   * @type Object
   */
  goog.dependencies_ = {
    pathToNames: {}, // 1 to many
    nameToPath: {}, // 1 to 1
    requires: {}, // 1 to many
    visited: {}, // used when resolving dependencies to prevent us from
                 // visiting the file twice
    written: {} // used to keep track of script files we have written
  };
}


/**
 * Adds a dependency from a file to the files it requires.
 * @param {String} relPath The path to the js file
 * @param {Array} provides An array of strings with the names of the objects
 *                         this file provides.
 * @param {Array} requires An array of strings with the names of the objects
 *                         this file requires.
 */
goog.addDependency = function(relPath, provides, requires) {
  if (!COMPILED) {
    var provide, require;
    // TODO(arv): File name case
    relPath = relPath.toLowerCase().replace(/\\/g, '/');
    var deps = goog.dependencies_;
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = relPath;
      if (!(relPath in deps.pathToNames)) {
        deps.pathToNames[relPath] = {};
      }
      deps.pathToNames[relPath][provide] = true;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(relPath in deps.requires)) {
        deps.requires[relPath] = {};
      }
      deps.requires[relPath][require] = true;
    }
  }
};


if (!COMPILED) {
  /**
   * Resolves dependencies based on the dependencies added using addDependency
   * and calls writeScriptTag_ in the correct order.
   * @private
   */
  goog.writeScripts_ = function() {
    // the scripts we need to write this time
    var scripts = {};
    var deps = goog.dependencies_;

    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // we have already visited this one. We can get here if we have cyclic
      // dependencies
      if (path in deps.visited) {
        if (!(path in scripts)) {
          scripts[path] = true;
        }
        return;
      }

      deps.visited[path] = true;

      for (var requireName in deps.requires[path]) {
        visitNode(deps.nameToPath[requireName]);
      }

      if (!(path in scripts)) {
        scripts[path] = true;
      }
    }

    for (var path in goog.included_) {
      if (!deps.written[path]) {
        // TODO(arv): File name case
        path = path.toLowerCase();
        visitNode(path);
      }
    }

    for (var path in scripts) {
      goog.writeScriptTag_(path);
    }
  };
}

/**
 * By default, copies all members of 'goog' to the global namespace.  We want to
 * keep the goog toplevel NS for future proofing, however, we understand that
 * people may not be worried about collisions and don't want to waste time
 * with the extra 5 chars.
 *
 * This can also be used to globalize whole namespaces, e.g. goog.lang
 * @param {Object} opt_obj The object to get the properties from
 * @param {Object} opt_global The object to add the properties to.
 *
 */
goog.globalize = function(opt_obj, opt_global) {
  goog.mixin((opt_global || goog.global), (opt_obj || goog));
};


/**
 * Require is used for dynamic resolution of dependencies that works in parallel
 * with the BUILD system.<br><br>

 * <pre>
 * The rules are named as so:
 *
 * foobar            Refers to a file foobar/foobar.js.
 *                   The JS namespace will then be goog.foobar.  Base and util
 *                   are currently special cases. Util has :array & goog.array
 *                   yet the files are in util/array.js. :base -> /base.js
 *
 * foobar.monkey     Should refer to foobar/monkey.js; The JS namespace will
 *                   be goog.foobar.monkey
 * </pre>
 * @param {String} rule Rule to include, in the form goog.package.part
 */
goog.require = function(rule) {
  // if the object already exists we do not need do do anything
  // TODO(arv): If we start to support require based on file name this has
  //            to change
  // TODO(arv): If we allow goog.foo.* this has to change
  // TODO(arv): If we implement dynamic load after page load we should probably
  //            not remove this code for the compiled output
  if (!COMPILED) {
    if (goog.getObjectByName(rule)) {
      return;
    }
    var parts = rule.split('.');
    if (parts.shift() == 'goog') {
      var url;
      if (parts.length == 1) {
        if (parts[0] == 'base') {
          url = 'base.js';
        } else if (parts[0] in goog.utilList_) {
          url = 'util/' + parts[0] + '.js';
        } else {
          url = parts[0] + '/' + parts[0] + '.js';
        }
      } else {
        url = parts.join('/') + '.js';
      }
      goog.include(url);

    } else {
      // TODO
      throw new Error('goog.require doesn\'t know how to handle non-goog ' +
                      'libraries yet.  Make me work!');
    }
    goog.writeScripts_();
  }
};

/**
 * Map used to test if a requested package is a util package.
 * @type Object
 * @private
 */
goog.utilList_ = {
  array: 1, date: 1, dom: 1, math: 1, string: 1, style: 1, uid: 1, uri: 1,
  window: 1
};


/**
 * Path for included scripts
 * @type String
 */
goog.basePath = '';


if (!COMPILED) {
  /**
   * Object used to keep track of urls that have already been added.  To stop
   * circular dependencies
   * @type Object
   * @private
   */
  goog.included_ = {};
}


goog.include = function(url) {
  if (!COMPILED) {
    if (!(url in goog.included_)) {
      goog.included_[url] = true;
      //document.writeln('<script type="text/javascript" src="' +
      //  goog.basePath + url + '"></script>');
    }
  }
};


//==============================================================================
// Language Enhancements
//==============================================================================


/**
 * Returns true if the specified value is not |undefined|.
 * @param {Object} val Variable to test
 * @returns {Boolean} Whether variable is defined
 */
goog.isDef = function(val) {
  return typeof val != "undefined";
};


/**
 * Returns true if the specified value is |null|
 * @param {Object} val Variable to test
 * @returns {Boolean} Whether variable is null
 */
goog.isNull = function(val) {
  return val === null;
};


/**
 * Returns true if the specified value is an array
 * @param {Object} val Variable to test
 * @returns {Boolean} Whether variable is an array
 */
goog.isArray = function(val) {
  // we cannot us constructor == Array or instanceof Array because different
  // frames have different Array objects.
  return val instanceof Array || goog.isObject(val) &&
      goog.isFunction(val.join) && goog.isFunction(val.reverse);
};


/**
 * Returns true if the object looks like an array. T o qualify as array like
 * the value needs to be an object and have a Number length property
 * @param {Object} val Variable to test
 * @returns {Boolean} Whether variable is an array
 */
goog.isArrayLike = function(val) {
  return goog.isObject(val) && goog.isNumber(val.length);
};


/**
 * Returns true if the specified value is a string
 * @param {Object} val Variable to test
 * @returns {Boolean} Whether variable is a string
 */
goog.isString = function(val) {
  return typeof val == "string";
};


/**
 * Returns true if the specified value is a boolean
 * @param {Object} val Variable to test
 * @returns {Boolean} Whether variable is boolean
 */
goog.isBoolean = function(val) {
  return typeof val == "boolean";
};


/**
 * Returns true if the specified value is a number
 * @param {Object} val Variable to test
 * @returns {Boolean} Whether variable is a number
 */
goog.isNumber = function(val) {
  return typeof val == "number";
};


/**
 * Returns true if the specified value is a function
 * @param {Object} val Variable to test
 * @returns {Boolean} Whether variable is a function
 */
goog.isFunction = function(val) {
  return typeof val == "function";
};


/**
 * Returns true if the specified value is an object
 * @param {Object} val Variable to test
 * @returns {Boolean} Whether variable is an object
 */
goog.isObject = function(val) {
  return val && typeof val == "object";
};


/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for
 * @returns {Number} The hash code for the object
 */
goog.getHashCode = function(obj) {
  // In IE, DOM nodes do not extend Object so they do not have this method.
  // we need to check hasOwnProperty because the proto might have this set.
  if (obj.hasOwnProperty && obj.hasOwnProperty(goog.hashCodeProperty_)) {
    return obj[goog.hashCodeProperty_];
  }
  if (!obj[goog.hashCodeProperty_]) {
    obj[goog.hashCodeProperty_] = ++goog.hashCodeCounter_;
  }
  return obj[goog.hashCodeProperty_];
};

/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 */
goog.removeHashCode = function(obj) {
  obj.removeAttribute(goog.hashCodeProperty_);
};

/**
 * {String} Name for hash code property
 * @private
 */
goog.hashCodeProperty_ = "closure_hashCode_";

/**
 * {Number} Counter for hash codes.
 * @private
 */
goog.hashCodeCounter_ = 0;


/**
 * Clone an object/array (recursively)
 * @param {Object} proto Object to clone
 * @param {Object} Clone of x;
 */
goog.cloneObject = function(proto) {
  if (proto.clone) return proto.clone();

  if (goog.isObject(proto)) {
    var clone = {};
    for (var i in proto) {
      clone[i] = goog.array.clone(proto[i]);
    }
    return clone;
  }

  return proto;
};


/**
 * Partially applies this function to a particular "this object" and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of |this| "pre-specified".<br><br>
 *
 * Remaining arguments specified at call-time are appended to the pre-
 * specified ones.<br><br>
 *
 * Also see: {@link #partial}.<br><br>
 *
 * Note that bind and partial are optimized such that repeated calls to it do
 * not create more than one function object, so there is no additional cost for
 * something like:<br>
 *
 * <pre>var g = bind(f, obj);
 * var h = partial(g, 1, 2, 3);
 * var k = partial(h, a, b, c);</pre>
 *
 * Usage:
 * <pre>var barMethBound = bind(myFunction, myObj, "arg1", "arg2");
 * barMethBound("arg3", "arg4");</pre>
 *
 * @param fn {Function} A function to partially apply
 * @param self {Object} Specifies the object which |this| should point to
 * when the function is run. If the value is null or undefined, it will default
 * to the global object.
 * @param ... ... Additional arguments that are partially applied to fn*
 *
 * @returns {Function} A partially-applied form of the function bind() was
 * invoked as a method of.
 */
goog.bind = function(fn, self) {
  var boundargs = goog.isDef(fn.boundArgs_) ? fn.boundArgs_ : [];
  boundargs = boundargs.concat(Array.prototype.slice.call(arguments, 2));

  if (goog.isDef(fn.boundSelf_)) {
    self = fn.boundSelf_;
  }

  if (goog.isDef(fn.boundFn_)) {
    fn = fn.boundFn_;
  }

  var newfn = function() {
    // Combine the static args and the new args into one big array
    var args = boundargs.concat(Array.prototype.slice.call(arguments));
    return fn.apply(self, args);
  }

  newfn.boundArgs_ = boundargs;
  newfn.boundSelf_ = self;
  newfn.boundFn_ = fn;

  return newfn;
};


/**
 * Like bind(), except that a "this object" is not required. Useful when the
 * target function is already bound.
 *
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param fn {Function} A function to partially apply
 * @param ... ... Additional arguments that are partially applied to fn
 *
 * @returns {Function} A partially-applied form of the function bind() was
 * invoked as a method of.
 */
goog.partial = function(fn) {
  return goog.bind.apply(
    null, [fn, null].concat(Array.prototype.slice.call(arguments, 1)));
};


/**
 * Copies all the members of a source object to a target object.
 * (It is pretty much a direct copy of dojo.lang.mixin())
 * @param {Object} target Target
 * @param {Object} target Source
 */
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};



//==============================================================================
// Extending Function
//==============================================================================


/**
 * Some old browsers don't have Function.apply. So sad. We emulate it for them.
 * @param {Object} oScope Object's scope with which the Function is applied in
 * @param {Array} args Arguments for the function
 * @return {Object} Value returned from the function
 */
if (!Function.prototype.apply) {
  Function.prototype.apply = function(oScope, args) {
    var sarg = [];
    var rtrn, call;

    if (!oScope) oScope = goog.global;
    if (!args) args = [];

    for (var i = 0; i < args.length; i++) {
      sarg[i] = "args[" + i + "]";
    }

    call = "oScope.__applyTemp__.peek().(" + sarg.join(",") + ");";

    if (!oScope.__applyTemp__) {
      oScope.__applyTemp__ = [];
    }

    oScope.__applyTemp__.push(this);
    rtrn = eval(call);
    oScope.__applyTemp__.pop();

    return rtrn;
  }
}


/**
 * An alias to the {@link goog.bind()} global function.
 *
 * Usage:
 * var g = f.bind(obj, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param self {Object} Specifies the object which |this| should point to
 * when the function is run. If the value is null or undefined, it will default
 * to the global object.
 * @returns {Function} A partially-applied form of the function bind() was
 * invoked as a method of.
 */
Function.prototype.bind = function(self) {
  return goog.bind.apply(
    null, [this, self].concat(Array.prototype.slice.call(arguments, 1)));
};


/**
 * An alias to the {@link goog.partial()} global function.
 *
 * Usage:
 * var g = f.partial(arg1, arg2);
 * g(arg3, arg4);
 *
 * @returns {Function} A partially-applied form of the function partial() was
 * invoked as a method of.
 */
Function.prototype.partial = function() {
  return goog.bind.apply(
    null, [this, null].concat(Array.prototype.slice.call(arguments)));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   ParentClass.call(this, a, b);
 * }
 *
 * ChildClass.inherits(ParentClass);
 *
 * var child = new ChildClass("a", "b", "see");
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 *
 * @param {Function} parentCtor Parent class
 */
Function.prototype.inherits = function(parentCtor) {
  var tempCtor = function(){};
  tempCtor.prototype = parentCtor.prototype;
  this.superClass_ = parentCtor.prototype;
  this.prototype = new tempCtor();
};


/**
 * Mixes in an object's properties and methods into the callee's prototype.
 * Basically mixin based inheritance, thus providing an alternative method for
 * adding properties and methods to a class' prototype.
 *
 * <pre>
 * function X() {}
 * X.mixin({
 *   one: 1,
 *   two: 2,
 *   three: 3,
 *   doit: function() { return this.one + this.two + this.three; }
 * });
 *
 * function Y() { }
 * Y.mixin(X.prototype);
 * Y.prototype.four = 15;
 * Y.prototype.doit2 = function() { return this.doit() + this.four; }
 * });
 *
 * // or
 *
 * function Y() { }
 * Y.inherits(X);
 * Y.mixin({
 *   one: 10,
 *   four: 15,
 *   doit2: function() { return this.doit() + this.four; }
 * });
 * </pre>
 *
 * @prop {Object} source from which to copy properties.
 * @see goog.mixin
 */
Function.prototype.mixin = function(source) {
  goog.mixin(this.prototype, source);
};



//==============================================================================
// Extending Array
//==============================================================================

/**
 * Emulate Array.push for browsers which don't have it.
 * @return {Number} New length of array after push
 */
if (!Array.prototype.push) {
  Array.prototype.push = function() {
    for (var i = 0; i < arguments.length; i++) {
      this[this.length] = arguments[i];
    }

    return this.length;
  };
}

/**
 * Emulate Array.pop for browsers which don't have it.
 * @return {Object} Last value in array
 */
if (!Array.prototype.pop) {
  Array.prototype.pop = function() {
    if (!this.length) {
      return;
    }

    var val = this[this.length - 1];

    this.length--;

    return val;
  };
}

/**
 * Returns the last element on an array without removing it.
 * @return {Object} Last item in array
 */
Array.prototype.peek = function() {
  return this[this.length - 1];
};

/**
 * Emulate Array.shift for browsers which don't have it.
 * @return {Object} val Value of item removed from the front of the array
 */
if (!Array.prototype.shift) {
  Array.prototype.shift = function() {
    if (this.length == 0) {
      return; // return undefined
    }

    var val = this[0];

    for (var i = 0; i < this.length - 1; i++) {
      this[i] = this[i+1];
    }

    this.length--;

    return val;
  };
}

/**
 * Emulate Array.unshift for browsers which don't have it.
 * @return {Number} Length of array after unshift
 */
if (!Array.prototype.unshift) {
  Array.prototype.unshift = function() {
    var numArgs = arguments.length;

    for (var i = this.length - 1; i >= 0; i--) {
      this[i + numArgs] = this[i];
    }

    for (var j = 0; j < numArgs; j++) {
      this[j] = arguments[j];
    }

    return this.length;
  };
}

if (!COMPILED) {
  goog.findBasePath_ = function() {
    var scripts = document.getElementsByTagName('script');
    for (var script, i = 0; script = scripts[i]; i++) {
      var src = script.src;
      var l = src.length;
      if (src.substr(l - 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };

  goog.writeScriptTag_ = function(src) {
    if (!goog.dependencies_.written[src]) {
      document.write('<script type="text/javascript" src="' + goog.basePath +
                     src + '"></' + 'script>');
      goog.dependencies_.written[src] = true;
    }
  };

  goog.findBasePath_();
  goog.writeScriptTag_('deps.js');
}
