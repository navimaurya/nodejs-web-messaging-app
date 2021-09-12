// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"public/js/index.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;

        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        } // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.


        if (previousRequire) {
          return previousRequire(name, true);
        } // Try the node require function if it exists.


        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};
      var module = cache[name] = new newRequire.Module(name);
      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;

  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]); // CommonJS

    if ((typeof exports === "undefined" ? "undefined" : _typeof2(exports)) === "object" && typeof module !== "undefined") {
      module.exports = mainExports; // RequireJS
    } else if (typeof define === "function" && define.amd) {
      define(function () {
        return mainExports;
      }); // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  } // Override the current require with this new one


  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
}({
  "../node_modules/core-js/modules/_global.js": [function (require, module, exports) {
    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self // eslint-disable-next-line no-new-func
    : Function('return this')();
    if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  }, {}],
  "../node_modules/core-js/modules/_core.js": [function (require, module, exports) {
    var core = module.exports = {
      version: '2.6.12'
    };
    if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  }, {}],
  "../node_modules/core-js/modules/_is-object.js": [function (require, module, exports) {
    module.exports = function (it) {
      return _typeof2(it) === 'object' ? it !== null : typeof it === 'function';
    };
  }, {}],
  "../node_modules/core-js/modules/_an-object.js": [function (require, module, exports) {
    var isObject = require('./_is-object');

    module.exports = function (it) {
      if (!isObject(it)) throw TypeError(it + ' is not an object!');
      return it;
    };
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js"
  }],
  "../node_modules/core-js/modules/_fails.js": [function (require, module, exports) {
    module.exports = function (exec) {
      try {
        return !!exec();
      } catch (e) {
        return true;
      }
    };
  }, {}],
  "../node_modules/core-js/modules/_descriptors.js": [function (require, module, exports) {
    // Thank's IE8 for his funny defineProperty
    module.exports = !require('./_fails')(function () {
      return Object.defineProperty({}, 'a', {
        get: function get() {
          return 7;
        }
      }).a != 7;
    });
  }, {
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/_dom-create.js": [function (require, module, exports) {
    var isObject = require('./_is-object');

    var document = require('./_global').document; // typeof document.createElement is 'object' in old IE


    var is = isObject(document) && isObject(document.createElement);

    module.exports = function (it) {
      return is ? document.createElement(it) : {};
    };
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_global": "../node_modules/core-js/modules/_global.js"
  }],
  "../node_modules/core-js/modules/_ie8-dom-define.js": [function (require, module, exports) {
    module.exports = !require('./_descriptors') && !require('./_fails')(function () {
      return Object.defineProperty(require('./_dom-create')('div'), 'a', {
        get: function get() {
          return 7;
        }
      }).a != 7;
    });
  }, {
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_dom-create": "../node_modules/core-js/modules/_dom-create.js"
  }],
  "../node_modules/core-js/modules/_to-primitive.js": [function (require, module, exports) {
    // 7.1.1 ToPrimitive(input [, PreferredType])
    var isObject = require('./_is-object'); // instead of the ES6 spec version, we didn't implement @@toPrimitive case
    // and the second argument - flag - preferred type is a string


    module.exports = function (it, S) {
      if (!isObject(it)) return it;
      var fn, val;
      if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
      if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
      if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
      throw TypeError("Can't convert object to primitive value");
    };
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js"
  }],
  "../node_modules/core-js/modules/_object-dp.js": [function (require, module, exports) {
    var anObject = require('./_an-object');

    var IE8_DOM_DEFINE = require('./_ie8-dom-define');

    var toPrimitive = require('./_to-primitive');

    var dP = Object.defineProperty;
    exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
      anObject(O);
      P = toPrimitive(P, true);
      anObject(Attributes);
      if (IE8_DOM_DEFINE) try {
        return dP(O, P, Attributes);
      } catch (e) {
        /* empty */
      }
      if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
      if ('value' in Attributes) O[P] = Attributes.value;
      return O;
    };
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_ie8-dom-define": "../node_modules/core-js/modules/_ie8-dom-define.js",
    "./_to-primitive": "../node_modules/core-js/modules/_to-primitive.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js"
  }],
  "../node_modules/core-js/modules/_property-desc.js": [function (require, module, exports) {
    module.exports = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
      };
    };
  }, {}],
  "../node_modules/core-js/modules/_hide.js": [function (require, module, exports) {
    var dP = require('./_object-dp');

    var createDesc = require('./_property-desc');

    module.exports = require('./_descriptors') ? function (object, key, value) {
      return dP.f(object, key, createDesc(1, value));
    } : function (object, key, value) {
      object[key] = value;
      return object;
    };
  }, {
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_property-desc": "../node_modules/core-js/modules/_property-desc.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js"
  }],
  "../node_modules/core-js/modules/_has.js": [function (require, module, exports) {
    var hasOwnProperty = {}.hasOwnProperty;

    module.exports = function (it, key) {
      return hasOwnProperty.call(it, key);
    };
  }, {}],
  "../node_modules/core-js/modules/_uid.js": [function (require, module, exports) {
    var id = 0;
    var px = Math.random();

    module.exports = function (key) {
      return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
    };
  }, {}],
  "../node_modules/core-js/modules/_library.js": [function (require, module, exports) {
    module.exports = false;
  }, {}],
  "../node_modules/core-js/modules/_shared.js": [function (require, module, exports) {
    var core = require('./_core');

    var global = require('./_global');

    var SHARED = '__core-js_shared__';
    var store = global[SHARED] || (global[SHARED] = {});
    (module.exports = function (key, value) {
      return store[key] || (store[key] = value !== undefined ? value : {});
    })('versions', []).push({
      version: core.version,
      mode: require('./_library') ? 'pure' : 'global',
      copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
    });
  }, {
    "./_core": "../node_modules/core-js/modules/_core.js",
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_library": "../node_modules/core-js/modules/_library.js"
  }],
  "../node_modules/core-js/modules/_function-to-string.js": [function (require, module, exports) {
    module.exports = require('./_shared')('native-function-to-string', Function.toString);
  }, {
    "./_shared": "../node_modules/core-js/modules/_shared.js"
  }],
  "../node_modules/core-js/modules/_redefine.js": [function (require, module, exports) {
    var global = require('./_global');

    var hide = require('./_hide');

    var has = require('./_has');

    var SRC = require('./_uid')('src');

    var $toString = require('./_function-to-string');

    var TO_STRING = 'toString';
    var TPL = ('' + $toString).split(TO_STRING);

    require('./_core').inspectSource = function (it) {
      return $toString.call(it);
    };

    (module.exports = function (O, key, val, safe) {
      var isFunction = typeof val == 'function';
      if (isFunction) has(val, 'name') || hide(val, 'name', key);
      if (O[key] === val) return;
      if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));

      if (O === global) {
        O[key] = val;
      } else if (!safe) {
        delete O[key];
        hide(O, key, val);
      } else if (O[key]) {
        O[key] = val;
      } else {
        hide(O, key, val);
      } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative

    })(Function.prototype, TO_STRING, function toString() {
      return typeof this == 'function' && this[SRC] || $toString.call(this);
    });
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_uid": "../node_modules/core-js/modules/_uid.js",
    "./_function-to-string": "../node_modules/core-js/modules/_function-to-string.js",
    "./_core": "../node_modules/core-js/modules/_core.js"
  }],
  "../node_modules/core-js/modules/_a-function.js": [function (require, module, exports) {
    module.exports = function (it) {
      if (typeof it != 'function') throw TypeError(it + ' is not a function!');
      return it;
    };
  }, {}],
  "../node_modules/core-js/modules/_ctx.js": [function (require, module, exports) {
    // optional / simple context binding
    var aFunction = require('./_a-function');

    module.exports = function (fn, that, length) {
      aFunction(fn);
      if (that === undefined) return fn;

      switch (length) {
        case 1:
          return function (a) {
            return fn.call(that, a);
          };

        case 2:
          return function (a, b) {
            return fn.call(that, a, b);
          };

        case 3:
          return function (a, b, c) {
            return fn.call(that, a, b, c);
          };
      }

      return function () {
        return fn.apply(that, arguments);
      };
    };
  }, {
    "./_a-function": "../node_modules/core-js/modules/_a-function.js"
  }],
  "../node_modules/core-js/modules/_export.js": [function (require, module, exports) {
    var global = require('./_global');

    var core = require('./_core');

    var hide = require('./_hide');

    var redefine = require('./_redefine');

    var ctx = require('./_ctx');

    var PROTOTYPE = 'prototype';

    var $export = function $export(type, name, source) {
      var IS_FORCED = type & $export.F;
      var IS_GLOBAL = type & $export.G;
      var IS_STATIC = type & $export.S;
      var IS_PROTO = type & $export.P;
      var IS_BIND = type & $export.B;
      var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
      var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
      var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
      var key, own, out, exp;
      if (IS_GLOBAL) source = name;

      for (key in source) {
        // contains in native
        own = !IS_FORCED && target && target[key] !== undefined; // export native or passed

        out = (own ? target : source)[key]; // bind timers to global for call from export context

        exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out; // extend global

        if (target) redefine(target, key, out, type & $export.U); // export

        if (exports[key] != out) hide(exports, key, exp);
        if (IS_PROTO && expProto[key] != out) expProto[key] = out;
      }
    };

    global.core = core; // type bitmap

    $export.F = 1; // forced

    $export.G = 2; // global

    $export.S = 4; // static

    $export.P = 8; // proto

    $export.B = 16; // bind

    $export.W = 32; // wrap

    $export.U = 64; // safe

    $export.R = 128; // real proto method for `library`

    module.exports = $export;
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_core": "../node_modules/core-js/modules/_core.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js",
    "./_ctx": "../node_modules/core-js/modules/_ctx.js"
  }],
  "../node_modules/core-js/modules/_defined.js": [function (require, module, exports) {
    // 7.2.1 RequireObjectCoercible(argument)
    module.exports = function (it) {
      if (it == undefined) throw TypeError("Can't call method on  " + it);
      return it;
    };
  }, {}],
  "../node_modules/core-js/modules/_to-object.js": [function (require, module, exports) {
    // 7.1.13 ToObject(argument)
    var defined = require('./_defined');

    module.exports = function (it) {
      return Object(defined(it));
    };
  }, {
    "./_defined": "../node_modules/core-js/modules/_defined.js"
  }],
  "../node_modules/core-js/modules/_to-integer.js": [function (require, module, exports) {
    // 7.1.4 ToInteger
    var ceil = Math.ceil;
    var floor = Math.floor;

    module.exports = function (it) {
      return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
    };
  }, {}],
  "../node_modules/core-js/modules/_to-absolute-index.js": [function (require, module, exports) {
    var toInteger = require('./_to-integer');

    var max = Math.max;
    var min = Math.min;

    module.exports = function (index, length) {
      index = toInteger(index);
      return index < 0 ? max(index + length, 0) : min(index, length);
    };
  }, {
    "./_to-integer": "../node_modules/core-js/modules/_to-integer.js"
  }],
  "../node_modules/core-js/modules/_to-length.js": [function (require, module, exports) {
    // 7.1.15 ToLength
    var toInteger = require('./_to-integer');

    var min = Math.min;

    module.exports = function (it) {
      return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
    };
  }, {
    "./_to-integer": "../node_modules/core-js/modules/_to-integer.js"
  }],
  "../node_modules/core-js/modules/_array-copy-within.js": [function (require, module, exports) {
    // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
    'use strict';

    var toObject = require('./_to-object');

    var toAbsoluteIndex = require('./_to-absolute-index');

    var toLength = require('./_to-length');

    module.exports = [].copyWithin || function copyWithin(target
    /* = 0 */
    , start
    /* = 0, end = @length */
    ) {
      var O = toObject(this);
      var len = toLength(O.length);
      var to = toAbsoluteIndex(target, len);
      var from = toAbsoluteIndex(start, len);
      var end = arguments.length > 2 ? arguments[2] : undefined;
      var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
      var inc = 1;

      if (from < to && to < from + count) {
        inc = -1;
        from += count - 1;
        to += count - 1;
      }

      while (count-- > 0) {
        if (from in O) O[to] = O[from];else delete O[to];
        to += inc;
        from += inc;
      }

      return O;
    };
  }, {
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_to-absolute-index": "../node_modules/core-js/modules/_to-absolute-index.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js"
  }],
  "../node_modules/core-js/modules/_wks.js": [function (require, module, exports) {
    var store = require('./_shared')('wks');

    var uid = require('./_uid');

    var _Symbol = require('./_global').Symbol;

    var USE_SYMBOL = typeof _Symbol == 'function';

    var $exports = module.exports = function (name) {
      return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
    };

    $exports.store = store;
  }, {
    "./_shared": "../node_modules/core-js/modules/_shared.js",
    "./_uid": "../node_modules/core-js/modules/_uid.js",
    "./_global": "../node_modules/core-js/modules/_global.js"
  }],
  "../node_modules/core-js/modules/_add-to-unscopables.js": [function (require, module, exports) {
    // 22.1.3.31 Array.prototype[@@unscopables]
    var UNSCOPABLES = require('./_wks')('unscopables');

    var ArrayProto = Array.prototype;
    if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});

    module.exports = function (key) {
      ArrayProto[UNSCOPABLES][key] = true;
    };
  }, {
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js"
  }],
  "../node_modules/core-js/modules/es6.array.copy-within.js": [function (require, module, exports) {
    // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
    var $export = require('./_export');

    $export($export.P, 'Array', {
      copyWithin: require('./_array-copy-within')
    });

    require('./_add-to-unscopables')('copyWithin');
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_array-copy-within": "../node_modules/core-js/modules/_array-copy-within.js",
    "./_add-to-unscopables": "../node_modules/core-js/modules/_add-to-unscopables.js"
  }],
  "../node_modules/core-js/modules/_array-fill.js": [function (require, module, exports) {
    // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
    'use strict';

    var toObject = require('./_to-object');

    var toAbsoluteIndex = require('./_to-absolute-index');

    var toLength = require('./_to-length');

    module.exports = function fill(value
    /* , start = 0, end = @length */
    ) {
      var O = toObject(this);
      var length = toLength(O.length);
      var aLen = arguments.length;
      var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
      var end = aLen > 2 ? arguments[2] : undefined;
      var endPos = end === undefined ? length : toAbsoluteIndex(end, length);

      while (endPos > index) {
        O[index++] = value;
      }

      return O;
    };
  }, {
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_to-absolute-index": "../node_modules/core-js/modules/_to-absolute-index.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js"
  }],
  "../node_modules/core-js/modules/es6.array.fill.js": [function (require, module, exports) {
    // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
    var $export = require('./_export');

    $export($export.P, 'Array', {
      fill: require('./_array-fill')
    });

    require('./_add-to-unscopables')('fill');
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_array-fill": "../node_modules/core-js/modules/_array-fill.js",
    "./_add-to-unscopables": "../node_modules/core-js/modules/_add-to-unscopables.js"
  }],
  "../node_modules/core-js/modules/_cof.js": [function (require, module, exports) {
    var toString = {}.toString;

    module.exports = function (it) {
      return toString.call(it).slice(8, -1);
    };
  }, {}],
  "../node_modules/core-js/modules/_iobject.js": [function (require, module, exports) {
    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    var cof = require('./_cof'); // eslint-disable-next-line no-prototype-builtins


    module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
      return cof(it) == 'String' ? it.split('') : Object(it);
    };
  }, {
    "./_cof": "../node_modules/core-js/modules/_cof.js"
  }],
  "../node_modules/core-js/modules/_is-array.js": [function (require, module, exports) {
    // 7.2.2 IsArray(argument)
    var cof = require('./_cof');

    module.exports = Array.isArray || function isArray(arg) {
      return cof(arg) == 'Array';
    };
  }, {
    "./_cof": "../node_modules/core-js/modules/_cof.js"
  }],
  "../node_modules/core-js/modules/_array-species-constructor.js": [function (require, module, exports) {
    var isObject = require('./_is-object');

    var isArray = require('./_is-array');

    var SPECIES = require('./_wks')('species');

    module.exports = function (original) {
      var C;

      if (isArray(original)) {
        C = original.constructor; // cross-realm fallback

        if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;

        if (isObject(C)) {
          C = C[SPECIES];
          if (C === null) C = undefined;
        }
      }

      return C === undefined ? Array : C;
    };
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_is-array": "../node_modules/core-js/modules/_is-array.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/_array-species-create.js": [function (require, module, exports) {
    // 9.4.2.3 ArraySpeciesCreate(originalArray, length)
    var speciesConstructor = require('./_array-species-constructor');

    module.exports = function (original, length) {
      return new (speciesConstructor(original))(length);
    };
  }, {
    "./_array-species-constructor": "../node_modules/core-js/modules/_array-species-constructor.js"
  }],
  "../node_modules/core-js/modules/_array-methods.js": [function (require, module, exports) {
    // 0 -> Array#forEach
    // 1 -> Array#map
    // 2 -> Array#filter
    // 3 -> Array#some
    // 4 -> Array#every
    // 5 -> Array#find
    // 6 -> Array#findIndex
    var ctx = require('./_ctx');

    var IObject = require('./_iobject');

    var toObject = require('./_to-object');

    var toLength = require('./_to-length');

    var asc = require('./_array-species-create');

    module.exports = function (TYPE, $create) {
      var IS_MAP = TYPE == 1;
      var IS_FILTER = TYPE == 2;
      var IS_SOME = TYPE == 3;
      var IS_EVERY = TYPE == 4;
      var IS_FIND_INDEX = TYPE == 6;
      var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
      var create = $create || asc;
      return function ($this, callbackfn, that) {
        var O = toObject($this);
        var self = IObject(O);
        var f = ctx(callbackfn, that, 3);
        var length = toLength(self.length);
        var index = 0;
        var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
        var val, res;

        for (; length > index; index++) {
          if (NO_HOLES || index in self) {
            val = self[index];
            res = f(val, index, O);

            if (TYPE) {
              if (IS_MAP) result[index] = res; // map
              else if (res) switch (TYPE) {
                case 3:
                  return true;
                // some

                case 5:
                  return val;
                // find

                case 6:
                  return index;
                // findIndex

                case 2:
                  result.push(val);
                // filter
              } else if (IS_EVERY) return false; // every
            }
          }
        }

        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
      };
    };
  }, {
    "./_ctx": "../node_modules/core-js/modules/_ctx.js",
    "./_iobject": "../node_modules/core-js/modules/_iobject.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_array-species-create": "../node_modules/core-js/modules/_array-species-create.js"
  }],
  "../node_modules/core-js/modules/es6.array.find.js": [function (require, module, exports) {
    'use strict'; // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

    var $export = require('./_export');

    var $find = require('./_array-methods')(5);

    var KEY = 'find';
    var forced = true; // Shouldn't skip holes

    if (KEY in []) Array(1)[KEY](function () {
      forced = false;
    });
    $export($export.P + $export.F * forced, 'Array', {
      find: function find(callbackfn
      /* , that = undefined */
      ) {
        return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    require('./_add-to-unscopables')(KEY);
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_array-methods": "../node_modules/core-js/modules/_array-methods.js",
    "./_add-to-unscopables": "../node_modules/core-js/modules/_add-to-unscopables.js"
  }],
  "../node_modules/core-js/modules/es6.array.find-index.js": [function (require, module, exports) {
    'use strict'; // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

    var $export = require('./_export');

    var $find = require('./_array-methods')(6);

    var KEY = 'findIndex';
    var forced = true; // Shouldn't skip holes

    if (KEY in []) Array(1)[KEY](function () {
      forced = false;
    });
    $export($export.P + $export.F * forced, 'Array', {
      findIndex: function findIndex(callbackfn
      /* , that = undefined */
      ) {
        return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    require('./_add-to-unscopables')(KEY);
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_array-methods": "../node_modules/core-js/modules/_array-methods.js",
    "./_add-to-unscopables": "../node_modules/core-js/modules/_add-to-unscopables.js"
  }],
  "../node_modules/core-js/modules/_flatten-into-array.js": [function (require, module, exports) {
    'use strict'; // https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray

    var isArray = require('./_is-array');

    var isObject = require('./_is-object');

    var toLength = require('./_to-length');

    var ctx = require('./_ctx');

    var IS_CONCAT_SPREADABLE = require('./_wks')('isConcatSpreadable');

    function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
      var targetIndex = start;
      var sourceIndex = 0;
      var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
      var element, spreadable;

      while (sourceIndex < sourceLen) {
        if (sourceIndex in source) {
          element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];
          spreadable = false;

          if (isObject(element)) {
            spreadable = element[IS_CONCAT_SPREADABLE];
            spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
          }

          if (spreadable && depth > 0) {
            targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
          } else {
            if (targetIndex >= 0x1fffffffffffff) throw TypeError();
            target[targetIndex] = element;
          }

          targetIndex++;
        }

        sourceIndex++;
      }

      return targetIndex;
    }

    module.exports = flattenIntoArray;
  }, {
    "./_is-array": "../node_modules/core-js/modules/_is-array.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_ctx": "../node_modules/core-js/modules/_ctx.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/es7.array.flat-map.js": [function (require, module, exports) {
    'use strict'; // https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap

    var $export = require('./_export');

    var flattenIntoArray = require('./_flatten-into-array');

    var toObject = require('./_to-object');

    var toLength = require('./_to-length');

    var aFunction = require('./_a-function');

    var arraySpeciesCreate = require('./_array-species-create');

    $export($export.P, 'Array', {
      flatMap: function flatMap(callbackfn
      /* , thisArg */
      ) {
        var O = toObject(this);
        var sourceLen, A;
        aFunction(callbackfn);
        sourceLen = toLength(O.length);
        A = arraySpeciesCreate(O, 0);
        flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
        return A;
      }
    });

    require('./_add-to-unscopables')('flatMap');
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_flatten-into-array": "../node_modules/core-js/modules/_flatten-into-array.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_a-function": "../node_modules/core-js/modules/_a-function.js",
    "./_array-species-create": "../node_modules/core-js/modules/_array-species-create.js",
    "./_add-to-unscopables": "../node_modules/core-js/modules/_add-to-unscopables.js"
  }],
  "../node_modules/core-js/modules/_iter-call.js": [function (require, module, exports) {
    // call something on iterator step with safe closing on error
    var anObject = require('./_an-object');

    module.exports = function (iterator, fn, value, entries) {
      try {
        return entries ? fn(anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
      } catch (e) {
        var ret = iterator['return'];
        if (ret !== undefined) anObject(ret.call(iterator));
        throw e;
      }
    };
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js"
  }],
  "../node_modules/core-js/modules/_iterators.js": [function (require, module, exports) {
    module.exports = {};
  }, {}],
  "../node_modules/core-js/modules/_is-array-iter.js": [function (require, module, exports) {
    // check on default Array iterator
    var Iterators = require('./_iterators');

    var ITERATOR = require('./_wks')('iterator');

    var ArrayProto = Array.prototype;

    module.exports = function (it) {
      return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
    };
  }, {
    "./_iterators": "../node_modules/core-js/modules/_iterators.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/_create-property.js": [function (require, module, exports) {
    'use strict';

    var $defineProperty = require('./_object-dp');

    var createDesc = require('./_property-desc');

    module.exports = function (object, index, value) {
      if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
    };
  }, {
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_property-desc": "../node_modules/core-js/modules/_property-desc.js"
  }],
  "../node_modules/core-js/modules/_classof.js": [function (require, module, exports) {
    // getting tag from 19.1.3.6 Object.prototype.toString()
    var cof = require('./_cof');

    var TAG = require('./_wks')('toStringTag'); // ES3 wrong here


    var ARG = cof(function () {
      return arguments;
    }()) == 'Arguments'; // fallback for IE11 Script Access Denied error

    var tryGet = function tryGet(it, key) {
      try {
        return it[key];
      } catch (e) {
        /* empty */
      }
    };

    module.exports = function (it) {
      var O, T, B;
      return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
      : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T // builtinTag case
      : ARG ? cof(O) // ES3 arguments fallback
      : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
    };
  }, {
    "./_cof": "../node_modules/core-js/modules/_cof.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/core.get-iterator-method.js": [function (require, module, exports) {
    var classof = require('./_classof');

    var ITERATOR = require('./_wks')('iterator');

    var Iterators = require('./_iterators');

    module.exports = require('./_core').getIteratorMethod = function (it) {
      if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
    };
  }, {
    "./_classof": "../node_modules/core-js/modules/_classof.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_iterators": "../node_modules/core-js/modules/_iterators.js",
    "./_core": "../node_modules/core-js/modules/_core.js"
  }],
  "../node_modules/core-js/modules/_iter-detect.js": [function (require, module, exports) {
    var ITERATOR = require('./_wks')('iterator');

    var SAFE_CLOSING = false;

    try {
      var riter = [7][ITERATOR]();

      riter['return'] = function () {
        SAFE_CLOSING = true;
      }; // eslint-disable-next-line no-throw-literal


      Array.from(riter, function () {
        throw 2;
      });
    } catch (e) {
      /* empty */
    }

    module.exports = function (exec, skipClosing) {
      if (!skipClosing && !SAFE_CLOSING) return false;
      var safe = false;

      try {
        var arr = [7];
        var iter = arr[ITERATOR]();

        iter.next = function () {
          return {
            done: safe = true
          };
        };

        arr[ITERATOR] = function () {
          return iter;
        };

        exec(arr);
      } catch (e) {
        /* empty */
      }

      return safe;
    };
  }, {
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/es6.array.from.js": [function (require, module, exports) {
    'use strict';

    var ctx = require('./_ctx');

    var $export = require('./_export');

    var toObject = require('./_to-object');

    var call = require('./_iter-call');

    var isArrayIter = require('./_is-array-iter');

    var toLength = require('./_to-length');

    var createProperty = require('./_create-property');

    var getIterFn = require('./core.get-iterator-method');

    $export($export.S + $export.F * !require('./_iter-detect')(function (iter) {
      Array.from(iter);
    }), 'Array', {
      // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
      from: function from(arrayLike
      /* , mapfn = undefined, thisArg = undefined */
      ) {
        var O = toObject(arrayLike);
        var C = typeof this == 'function' ? this : Array;
        var aLen = arguments.length;
        var mapfn = aLen > 1 ? arguments[1] : undefined;
        var mapping = mapfn !== undefined;
        var index = 0;
        var iterFn = getIterFn(O);
        var length, result, step, iterator;
        if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2); // if object isn't iterable or it's array with default iterator - use simple case

        if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
          for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
            createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
          }
        } else {
          length = toLength(O.length);

          for (result = new C(length); length > index; index++) {
            createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
          }
        }

        result.length = index;
        return result;
      }
    });
  }, {
    "./_ctx": "../node_modules/core-js/modules/_ctx.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_iter-call": "../node_modules/core-js/modules/_iter-call.js",
    "./_is-array-iter": "../node_modules/core-js/modules/_is-array-iter.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_create-property": "../node_modules/core-js/modules/_create-property.js",
    "./core.get-iterator-method": "../node_modules/core-js/modules/core.get-iterator-method.js",
    "./_iter-detect": "../node_modules/core-js/modules/_iter-detect.js"
  }],
  "../node_modules/core-js/modules/_to-iobject.js": [function (require, module, exports) {
    // to indexed object, toObject with fallback for non-array-like ES3 strings
    var IObject = require('./_iobject');

    var defined = require('./_defined');

    module.exports = function (it) {
      return IObject(defined(it));
    };
  }, {
    "./_iobject": "../node_modules/core-js/modules/_iobject.js",
    "./_defined": "../node_modules/core-js/modules/_defined.js"
  }],
  "../node_modules/core-js/modules/_array-includes.js": [function (require, module, exports) {
    // false -> Array#indexOf
    // true  -> Array#includes
    var toIObject = require('./_to-iobject');

    var toLength = require('./_to-length');

    var toAbsoluteIndex = require('./_to-absolute-index');

    module.exports = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        var O = toIObject($this);
        var length = toLength(O.length);
        var index = toAbsoluteIndex(fromIndex, length);
        var value; // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare

        if (IS_INCLUDES && el != el) while (length > index) {
          value = O[index++]; // eslint-disable-next-line no-self-compare

          if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
        } else for (; length > index; index++) {
          if (IS_INCLUDES || index in O) {
            if (O[index] === el) return IS_INCLUDES || index || 0;
          }
        }
        return !IS_INCLUDES && -1;
      };
    };
  }, {
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_to-absolute-index": "../node_modules/core-js/modules/_to-absolute-index.js"
  }],
  "../node_modules/core-js/modules/es7.array.includes.js": [function (require, module, exports) {
    'use strict'; // https://github.com/tc39/Array.prototype.includes

    var $export = require('./_export');

    var $includes = require('./_array-includes')(true);

    $export($export.P, 'Array', {
      includes: function includes(el
      /* , fromIndex = 0 */
      ) {
        return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
      }
    });

    require('./_add-to-unscopables')('includes');
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_array-includes": "../node_modules/core-js/modules/_array-includes.js",
    "./_add-to-unscopables": "../node_modules/core-js/modules/_add-to-unscopables.js"
  }],
  "../node_modules/core-js/modules/_iter-step.js": [function (require, module, exports) {
    module.exports = function (done, value) {
      return {
        value: value,
        done: !!done
      };
    };
  }, {}],
  "../node_modules/core-js/modules/_shared-key.js": [function (require, module, exports) {
    var shared = require('./_shared')('keys');

    var uid = require('./_uid');

    module.exports = function (key) {
      return shared[key] || (shared[key] = uid(key));
    };
  }, {
    "./_shared": "../node_modules/core-js/modules/_shared.js",
    "./_uid": "../node_modules/core-js/modules/_uid.js"
  }],
  "../node_modules/core-js/modules/_object-keys-internal.js": [function (require, module, exports) {
    var has = require('./_has');

    var toIObject = require('./_to-iobject');

    var arrayIndexOf = require('./_array-includes')(false);

    var IE_PROTO = require('./_shared-key')('IE_PROTO');

    module.exports = function (object, names) {
      var O = toIObject(object);
      var i = 0;
      var result = [];
      var key;

      for (key in O) {
        if (key != IE_PROTO) has(O, key) && result.push(key);
      } // Don't enum bug & hidden keys


      while (names.length > i) {
        if (has(O, key = names[i++])) {
          ~arrayIndexOf(result, key) || result.push(key);
        }
      }

      return result;
    };
  }, {
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_array-includes": "../node_modules/core-js/modules/_array-includes.js",
    "./_shared-key": "../node_modules/core-js/modules/_shared-key.js"
  }],
  "../node_modules/core-js/modules/_enum-bug-keys.js": [function (require, module, exports) {
    // IE 8- don't enum bug keys
    module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');
  }, {}],
  "../node_modules/core-js/modules/_object-keys.js": [function (require, module, exports) {
    // 19.1.2.14 / 15.2.3.14 Object.keys(O)
    var $keys = require('./_object-keys-internal');

    var enumBugKeys = require('./_enum-bug-keys');

    module.exports = Object.keys || function keys(O) {
      return $keys(O, enumBugKeys);
    };
  }, {
    "./_object-keys-internal": "../node_modules/core-js/modules/_object-keys-internal.js",
    "./_enum-bug-keys": "../node_modules/core-js/modules/_enum-bug-keys.js"
  }],
  "../node_modules/core-js/modules/_object-dps.js": [function (require, module, exports) {
    var dP = require('./_object-dp');

    var anObject = require('./_an-object');

    var getKeys = require('./_object-keys');

    module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
      anObject(O);
      var keys = getKeys(Properties);
      var length = keys.length;
      var i = 0;
      var P;

      while (length > i) {
        dP.f(O, P = keys[i++], Properties[P]);
      }

      return O;
    };
  }, {
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_object-keys": "../node_modules/core-js/modules/_object-keys.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js"
  }],
  "../node_modules/core-js/modules/_html.js": [function (require, module, exports) {
    var document = require('./_global').document;

    module.exports = document && document.documentElement;
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js"
  }],
  "../node_modules/core-js/modules/_object-create.js": [function (require, module, exports) {
    // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
    var anObject = require('./_an-object');

    var dPs = require('./_object-dps');

    var enumBugKeys = require('./_enum-bug-keys');

    var IE_PROTO = require('./_shared-key')('IE_PROTO');

    var Empty = function Empty() {
      /* empty */
    };

    var PROTOTYPE = 'prototype'; // Create object with fake `null` prototype: use iframe Object with cleared prototype

    var _createDict = function createDict() {
      // Thrash, waste and sodomy: IE GC bug
      var iframe = require('./_dom-create')('iframe');

      var i = enumBugKeys.length;
      var lt = '<';
      var gt = '>';
      var iframeDocument;
      iframe.style.display = 'none';

      require('./_html').appendChild(iframe);

      iframe.src = 'javascript:'; // eslint-disable-line no-script-url
      // createDict = iframe.contentWindow.Object;
      // html.removeChild(iframe);

      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
      iframeDocument.close();
      _createDict = iframeDocument.F;

      while (i--) {
        delete _createDict[PROTOTYPE][enumBugKeys[i]];
      }

      return _createDict();
    };

    module.exports = Object.create || function create(O, Properties) {
      var result;

      if (O !== null) {
        Empty[PROTOTYPE] = anObject(O);
        result = new Empty();
        Empty[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

        result[IE_PROTO] = O;
      } else result = _createDict();

      return Properties === undefined ? result : dPs(result, Properties);
    };
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_object-dps": "../node_modules/core-js/modules/_object-dps.js",
    "./_enum-bug-keys": "../node_modules/core-js/modules/_enum-bug-keys.js",
    "./_shared-key": "../node_modules/core-js/modules/_shared-key.js",
    "./_dom-create": "../node_modules/core-js/modules/_dom-create.js",
    "./_html": "../node_modules/core-js/modules/_html.js"
  }],
  "../node_modules/core-js/modules/_set-to-string-tag.js": [function (require, module, exports) {
    var def = require('./_object-dp').f;

    var has = require('./_has');

    var TAG = require('./_wks')('toStringTag');

    module.exports = function (it, tag, stat) {
      if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
        configurable: true,
        value: tag
      });
    };
  }, {
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/_iter-create.js": [function (require, module, exports) {
    'use strict';

    var create = require('./_object-create');

    var descriptor = require('./_property-desc');

    var setToStringTag = require('./_set-to-string-tag');

    var IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

    require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
      return this;
    });

    module.exports = function (Constructor, NAME, next) {
      Constructor.prototype = create(IteratorPrototype, {
        next: descriptor(1, next)
      });
      setToStringTag(Constructor, NAME + ' Iterator');
    };
  }, {
    "./_object-create": "../node_modules/core-js/modules/_object-create.js",
    "./_property-desc": "../node_modules/core-js/modules/_property-desc.js",
    "./_set-to-string-tag": "../node_modules/core-js/modules/_set-to-string-tag.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/_object-gpo.js": [function (require, module, exports) {
    // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
    var has = require('./_has');

    var toObject = require('./_to-object');

    var IE_PROTO = require('./_shared-key')('IE_PROTO');

    var ObjectProto = Object.prototype;

    module.exports = Object.getPrototypeOf || function (O) {
      O = toObject(O);
      if (has(O, IE_PROTO)) return O[IE_PROTO];

      if (typeof O.constructor == 'function' && O instanceof O.constructor) {
        return O.constructor.prototype;
      }

      return O instanceof Object ? ObjectProto : null;
    };
  }, {
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_shared-key": "../node_modules/core-js/modules/_shared-key.js"
  }],
  "../node_modules/core-js/modules/_iter-define.js": [function (require, module, exports) {
    'use strict';

    var LIBRARY = require('./_library');

    var $export = require('./_export');

    var redefine = require('./_redefine');

    var hide = require('./_hide');

    var Iterators = require('./_iterators');

    var $iterCreate = require('./_iter-create');

    var setToStringTag = require('./_set-to-string-tag');

    var getPrototypeOf = require('./_object-gpo');

    var ITERATOR = require('./_wks')('iterator');

    var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`

    var FF_ITERATOR = '@@iterator';
    var KEYS = 'keys';
    var VALUES = 'values';

    var returnThis = function returnThis() {
      return this;
    };

    module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
      $iterCreate(Constructor, NAME, next);

      var getMethod = function getMethod(kind) {
        if (!BUGGY && kind in proto) return proto[kind];

        switch (kind) {
          case KEYS:
            return function keys() {
              return new Constructor(this, kind);
            };

          case VALUES:
            return function values() {
              return new Constructor(this, kind);
            };
        }

        return function entries() {
          return new Constructor(this, kind);
        };
      };

      var TAG = NAME + ' Iterator';
      var DEF_VALUES = DEFAULT == VALUES;
      var VALUES_BUG = false;
      var proto = Base.prototype;
      var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
      var $default = $native || getMethod(DEFAULT);
      var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
      var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
      var methods, key, IteratorPrototype; // Fix native

      if ($anyNative) {
        IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));

        if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
          // Set @@toStringTag to native iterators
          setToStringTag(IteratorPrototype, TAG, true); // fix for some old engines

          if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
        }
      } // fix Array#{values, @@iterator}.name in V8 / FF


      if (DEF_VALUES && $native && $native.name !== VALUES) {
        VALUES_BUG = true;

        $default = function values() {
          return $native.call(this);
        };
      } // Define iterator


      if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
        hide(proto, ITERATOR, $default);
      } // Plug for library


      Iterators[NAME] = $default;
      Iterators[TAG] = returnThis;

      if (DEFAULT) {
        methods = {
          values: DEF_VALUES ? $default : getMethod(VALUES),
          keys: IS_SET ? $default : getMethod(KEYS),
          entries: $entries
        };
        if (FORCED) for (key in methods) {
          if (!(key in proto)) redefine(proto, key, methods[key]);
        } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
      }

      return methods;
    };
  }, {
    "./_library": "../node_modules/core-js/modules/_library.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_iterators": "../node_modules/core-js/modules/_iterators.js",
    "./_iter-create": "../node_modules/core-js/modules/_iter-create.js",
    "./_set-to-string-tag": "../node_modules/core-js/modules/_set-to-string-tag.js",
    "./_object-gpo": "../node_modules/core-js/modules/_object-gpo.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/es6.array.iterator.js": [function (require, module, exports) {
    'use strict';

    var addToUnscopables = require('./_add-to-unscopables');

    var step = require('./_iter-step');

    var Iterators = require('./_iterators');

    var toIObject = require('./_to-iobject'); // 22.1.3.4 Array.prototype.entries()
    // 22.1.3.13 Array.prototype.keys()
    // 22.1.3.29 Array.prototype.values()
    // 22.1.3.30 Array.prototype[@@iterator]()


    module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
      this._t = toIObject(iterated); // target

      this._i = 0; // next index

      this._k = kind; // kind
      // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
    }, function () {
      var O = this._t;
      var kind = this._k;
      var index = this._i++;

      if (!O || index >= O.length) {
        this._t = undefined;
        return step(1);
      }

      if (kind == 'keys') return step(0, index);
      if (kind == 'values') return step(0, O[index]);
      return step(0, [index, O[index]]);
    }, 'values'); // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)

    Iterators.Arguments = Iterators.Array;
    addToUnscopables('keys');
    addToUnscopables('values');
    addToUnscopables('entries');
  }, {
    "./_add-to-unscopables": "../node_modules/core-js/modules/_add-to-unscopables.js",
    "./_iter-step": "../node_modules/core-js/modules/_iter-step.js",
    "./_iterators": "../node_modules/core-js/modules/_iterators.js",
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_iter-define": "../node_modules/core-js/modules/_iter-define.js"
  }],
  "../node_modules/core-js/modules/es6.array.of.js": [function (require, module, exports) {
    'use strict';

    var $export = require('./_export');

    var createProperty = require('./_create-property'); // WebKit Array.of isn't generic


    $export($export.S + $export.F * require('./_fails')(function () {
      function F() {
        /* empty */
      }

      return !(Array.of.call(F) instanceof F);
    }), 'Array', {
      // 22.1.2.3 Array.of( ...items)
      of: function of() {
        var index = 0;
        var aLen = arguments.length;
        var result = new (typeof this == 'function' ? this : Array)(aLen);

        while (aLen > index) {
          createProperty(result, index, arguments[index++]);
        }

        result.length = aLen;
        return result;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_create-property": "../node_modules/core-js/modules/_create-property.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/_strict-method.js": [function (require, module, exports) {
    'use strict';

    var fails = require('./_fails');

    module.exports = function (method, arg) {
      return !!method && fails(function () {
        // eslint-disable-next-line no-useless-call
        arg ? method.call(null, function () {
          /* empty */
        }, 1) : method.call(null);
      });
    };
  }, {
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/es6.array.sort.js": [function (require, module, exports) {
    'use strict';

    var $export = require('./_export');

    var aFunction = require('./_a-function');

    var toObject = require('./_to-object');

    var fails = require('./_fails');

    var $sort = [].sort;
    var test = [1, 2, 3];
    $export($export.P + $export.F * (fails(function () {
      // IE8-
      test.sort(undefined);
    }) || !fails(function () {
      // V8 bug
      test.sort(null); // Old WebKit
    }) || !require('./_strict-method')($sort)), 'Array', {
      // 22.1.3.25 Array.prototype.sort(comparefn)
      sort: function sort(comparefn) {
        return comparefn === undefined ? $sort.call(toObject(this)) : $sort.call(toObject(this), aFunction(comparefn));
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_a-function": "../node_modules/core-js/modules/_a-function.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_strict-method": "../node_modules/core-js/modules/_strict-method.js"
  }],
  "../node_modules/core-js/modules/_set-species.js": [function (require, module, exports) {
    'use strict';

    var global = require('./_global');

    var dP = require('./_object-dp');

    var DESCRIPTORS = require('./_descriptors');

    var SPECIES = require('./_wks')('species');

    module.exports = function (KEY) {
      var C = global[KEY];
      if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
        configurable: true,
        get: function get() {
          return this;
        }
      });
    };
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/es6.array.species.js": [function (require, module, exports) {
    require('./_set-species')('Array');
  }, {
    "./_set-species": "../node_modules/core-js/modules/_set-species.js"
  }],
  "../node_modules/core-js/modules/_date-to-primitive.js": [function (require, module, exports) {
    'use strict';

    var anObject = require('./_an-object');

    var toPrimitive = require('./_to-primitive');

    var NUMBER = 'number';

    module.exports = function (hint) {
      if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
      return toPrimitive(anObject(this), hint != NUMBER);
    };
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_to-primitive": "../node_modules/core-js/modules/_to-primitive.js"
  }],
  "../node_modules/core-js/modules/es6.date.to-primitive.js": [function (require, module, exports) {
    var TO_PRIMITIVE = require('./_wks')('toPrimitive');

    var proto = Date.prototype;
    if (!(TO_PRIMITIVE in proto)) require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));
  }, {
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_date-to-primitive": "../node_modules/core-js/modules/_date-to-primitive.js"
  }],
  "../node_modules/core-js/modules/es6.function.has-instance.js": [function (require, module, exports) {
    'use strict';

    var isObject = require('./_is-object');

    var getPrototypeOf = require('./_object-gpo');

    var HAS_INSTANCE = require('./_wks')('hasInstance');

    var FunctionProto = Function.prototype; // 19.2.3.6 Function.prototype[@@hasInstance](V)

    if (!(HAS_INSTANCE in FunctionProto)) require('./_object-dp').f(FunctionProto, HAS_INSTANCE, {
      value: function value(O) {
        if (typeof this != 'function' || !isObject(O)) return false;
        if (!isObject(this.prototype)) return O instanceof this; // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:

        while (O = getPrototypeOf(O)) {
          if (this.prototype === O) return true;
        }

        return false;
      }
    });
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_object-gpo": "../node_modules/core-js/modules/_object-gpo.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js"
  }],
  "../node_modules/core-js/modules/es6.function.name.js": [function (require, module, exports) {
    var dP = require('./_object-dp').f;

    var FProto = Function.prototype;
    var nameRE = /^\s*function ([^ (]*)/;
    var NAME = 'name'; // 19.2.4.2 name

    NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
      configurable: true,
      get: function get() {
        try {
          return ('' + this).match(nameRE)[1];
        } catch (e) {
          return '';
        }
      }
    });
  }, {
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js"
  }],
  "../node_modules/core-js/modules/_redefine-all.js": [function (require, module, exports) {
    var redefine = require('./_redefine');

    module.exports = function (target, src, safe) {
      for (var key in src) {
        redefine(target, key, src[key], safe);
      }

      return target;
    };
  }, {
    "./_redefine": "../node_modules/core-js/modules/_redefine.js"
  }],
  "../node_modules/core-js/modules/_an-instance.js": [function (require, module, exports) {
    module.exports = function (it, Constructor, name, forbiddenField) {
      if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
        throw TypeError(name + ': incorrect invocation!');
      }

      return it;
    };
  }, {}],
  "../node_modules/core-js/modules/_for-of.js": [function (require, module, exports) {
    var ctx = require('./_ctx');

    var call = require('./_iter-call');

    var isArrayIter = require('./_is-array-iter');

    var anObject = require('./_an-object');

    var toLength = require('./_to-length');

    var getIterFn = require('./core.get-iterator-method');

    var BREAK = {};
    var RETURN = {};

    var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
      var iterFn = ITERATOR ? function () {
        return iterable;
      } : getIterFn(iterable);
      var f = ctx(fn, that, entries ? 2 : 1);
      var index = 0;
      var length, step, iterator, result;
      if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!'); // fast case for arrays with default iterator

      if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
        result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
        if (result === BREAK || result === RETURN) return result;
      } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
        result = call(iterator, f, step.value, entries);
        if (result === BREAK || result === RETURN) return result;
      }
    };

    exports.BREAK = BREAK;
    exports.RETURN = RETURN;
  }, {
    "./_ctx": "../node_modules/core-js/modules/_ctx.js",
    "./_iter-call": "../node_modules/core-js/modules/_iter-call.js",
    "./_is-array-iter": "../node_modules/core-js/modules/_is-array-iter.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./core.get-iterator-method": "../node_modules/core-js/modules/core.get-iterator-method.js"
  }],
  "../node_modules/core-js/modules/_meta.js": [function (require, module, exports) {
    var META = require('./_uid')('meta');

    var isObject = require('./_is-object');

    var has = require('./_has');

    var setDesc = require('./_object-dp').f;

    var id = 0;

    var isExtensible = Object.isExtensible || function () {
      return true;
    };

    var FREEZE = !require('./_fails')(function () {
      return isExtensible(Object.preventExtensions({}));
    });

    var setMeta = function setMeta(it) {
      setDesc(it, META, {
        value: {
          i: 'O' + ++id,
          // object ID
          w: {} // weak collections IDs

        }
      });
    };

    var fastKey = function fastKey(it, create) {
      // return primitive with prefix
      if (!isObject(it)) return _typeof2(it) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;

      if (!has(it, META)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return 'F'; // not necessary to add metadata

        if (!create) return 'E'; // add missing metadata

        setMeta(it); // return object ID
      }

      return it[META].i;
    };

    var getWeak = function getWeak(it, create) {
      if (!has(it, META)) {
        // can't set metadata to uncaught frozen object
        if (!isExtensible(it)) return true; // not necessary to add metadata

        if (!create) return false; // add missing metadata

        setMeta(it); // return hash weak collections IDs
      }

      return it[META].w;
    }; // add metadata on freeze-family methods calling


    var onFreeze = function onFreeze(it) {
      if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
      return it;
    };

    var meta = module.exports = {
      KEY: META,
      NEED: false,
      fastKey: fastKey,
      getWeak: getWeak,
      onFreeze: onFreeze
    };
  }, {
    "./_uid": "../node_modules/core-js/modules/_uid.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/_validate-collection.js": [function (require, module, exports) {
    var isObject = require('./_is-object');

    module.exports = function (it, TYPE) {
      if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
      return it;
    };
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js"
  }],
  "../node_modules/core-js/modules/_collection-strong.js": [function (require, module, exports) {
    'use strict';

    var dP = require('./_object-dp').f;

    var create = require('./_object-create');

    var redefineAll = require('./_redefine-all');

    var ctx = require('./_ctx');

    var anInstance = require('./_an-instance');

    var forOf = require('./_for-of');

    var $iterDefine = require('./_iter-define');

    var step = require('./_iter-step');

    var setSpecies = require('./_set-species');

    var DESCRIPTORS = require('./_descriptors');

    var fastKey = require('./_meta').fastKey;

    var validate = require('./_validate-collection');

    var SIZE = DESCRIPTORS ? '_s' : 'size';

    var getEntry = function getEntry(that, key) {
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return that._i[index]; // frozen object case

      for (entry = that._f; entry; entry = entry.n) {
        if (entry.k == key) return entry;
      }
    };

    module.exports = {
      getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
        var C = wrapper(function (that, iterable) {
          anInstance(that, C, NAME, '_i');
          that._t = NAME; // collection type

          that._i = create(null); // index

          that._f = undefined; // first entry

          that._l = undefined; // last entry

          that[SIZE] = 0; // size

          if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        });
        redefineAll(C.prototype, {
          // 23.1.3.1 Map.prototype.clear()
          // 23.2.3.2 Set.prototype.clear()
          clear: function clear() {
            for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
              entry.r = true;
              if (entry.p) entry.p = entry.p.n = undefined;
              delete data[entry.i];
            }

            that._f = that._l = undefined;
            that[SIZE] = 0;
          },
          // 23.1.3.3 Map.prototype.delete(key)
          // 23.2.3.4 Set.prototype.delete(value)
          'delete': function _delete(key) {
            var that = validate(this, NAME);
            var entry = getEntry(that, key);

            if (entry) {
              var next = entry.n;
              var prev = entry.p;
              delete that._i[entry.i];
              entry.r = true;
              if (prev) prev.n = next;
              if (next) next.p = prev;
              if (that._f == entry) that._f = next;
              if (that._l == entry) that._l = prev;
              that[SIZE]--;
            }

            return !!entry;
          },
          // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
          // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
          forEach: function forEach(callbackfn
          /* , that = undefined */
          ) {
            validate(this, NAME);
            var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
            var entry;

            while (entry = entry ? entry.n : this._f) {
              f(entry.v, entry.k, this); // revert to the last existing entry

              while (entry && entry.r) {
                entry = entry.p;
              }
            }
          },
          // 23.1.3.7 Map.prototype.has(key)
          // 23.2.3.7 Set.prototype.has(value)
          has: function has(key) {
            return !!getEntry(validate(this, NAME), key);
          }
        });
        if (DESCRIPTORS) dP(C.prototype, 'size', {
          get: function get() {
            return validate(this, NAME)[SIZE];
          }
        });
        return C;
      },
      def: function def(that, key, value) {
        var entry = getEntry(that, key);
        var prev, index; // change existing entry

        if (entry) {
          entry.v = value; // create new entry
        } else {
          that._l = entry = {
            i: index = fastKey(key, true),
            // <- index
            k: key,
            // <- key
            v: value,
            // <- value
            p: prev = that._l,
            // <- previous entry
            n: undefined,
            // <- next entry
            r: false // <- removed

          };
          if (!that._f) that._f = entry;
          if (prev) prev.n = entry;
          that[SIZE]++; // add to index

          if (index !== 'F') that._i[index] = entry;
        }

        return that;
      },
      getEntry: getEntry,
      setStrong: function setStrong(C, NAME, IS_MAP) {
        // add .keys, .values, .entries, [@@iterator]
        // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
        $iterDefine(C, NAME, function (iterated, kind) {
          this._t = validate(iterated, NAME); // target

          this._k = kind; // kind

          this._l = undefined; // previous
        }, function () {
          var that = this;
          var kind = that._k;
          var entry = that._l; // revert to the last existing entry

          while (entry && entry.r) {
            entry = entry.p;
          } // get next entry


          if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
            // or finish the iteration
            that._t = undefined;
            return step(1);
          } // return step by kind


          if (kind == 'keys') return step(0, entry.k);
          if (kind == 'values') return step(0, entry.v);
          return step(0, [entry.k, entry.v]);
        }, IS_MAP ? 'entries' : 'values', !IS_MAP, true); // add [@@species], 23.1.2.2, 23.2.2.2

        setSpecies(NAME);
      }
    };
  }, {
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_object-create": "../node_modules/core-js/modules/_object-create.js",
    "./_redefine-all": "../node_modules/core-js/modules/_redefine-all.js",
    "./_ctx": "../node_modules/core-js/modules/_ctx.js",
    "./_an-instance": "../node_modules/core-js/modules/_an-instance.js",
    "./_for-of": "../node_modules/core-js/modules/_for-of.js",
    "./_iter-define": "../node_modules/core-js/modules/_iter-define.js",
    "./_iter-step": "../node_modules/core-js/modules/_iter-step.js",
    "./_set-species": "../node_modules/core-js/modules/_set-species.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_meta": "../node_modules/core-js/modules/_meta.js",
    "./_validate-collection": "../node_modules/core-js/modules/_validate-collection.js"
  }],
  "../node_modules/core-js/modules/_object-pie.js": [function (require, module, exports) {
    exports.f = {}.propertyIsEnumerable;
  }, {}],
  "../node_modules/core-js/modules/_object-gopd.js": [function (require, module, exports) {
    var pIE = require('./_object-pie');

    var createDesc = require('./_property-desc');

    var toIObject = require('./_to-iobject');

    var toPrimitive = require('./_to-primitive');

    var has = require('./_has');

    var IE8_DOM_DEFINE = require('./_ie8-dom-define');

    var gOPD = Object.getOwnPropertyDescriptor;
    exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
      O = toIObject(O);
      P = toPrimitive(P, true);
      if (IE8_DOM_DEFINE) try {
        return gOPD(O, P);
      } catch (e) {
        /* empty */
      }
      if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
    };
  }, {
    "./_object-pie": "../node_modules/core-js/modules/_object-pie.js",
    "./_property-desc": "../node_modules/core-js/modules/_property-desc.js",
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_to-primitive": "../node_modules/core-js/modules/_to-primitive.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_ie8-dom-define": "../node_modules/core-js/modules/_ie8-dom-define.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js"
  }],
  "../node_modules/core-js/modules/_set-proto.js": [function (require, module, exports) {
    // Works with __proto__ only. Old v8 can't work with null proto objects.

    /* eslint-disable no-proto */
    var isObject = require('./_is-object');

    var anObject = require('./_an-object');

    var check = function check(O, proto) {
      anObject(O);
      if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
    };

    module.exports = {
      set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
      function (test, buggy, set) {
        try {
          set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
          set(test, []);
          buggy = !(test instanceof Array);
        } catch (e) {
          buggy = true;
        }

        return function setPrototypeOf(O, proto) {
          check(O, proto);
          if (buggy) O.__proto__ = proto;else set(O, proto);
          return O;
        };
      }({}, false) : undefined),
      check: check
    };
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_ctx": "../node_modules/core-js/modules/_ctx.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js"
  }],
  "../node_modules/core-js/modules/_inherit-if-required.js": [function (require, module, exports) {
    var isObject = require('./_is-object');

    var setPrototypeOf = require('./_set-proto').set;

    module.exports = function (that, target, C) {
      var S = target.constructor;
      var P;

      if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
        setPrototypeOf(that, P);
      }

      return that;
    };
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_set-proto": "../node_modules/core-js/modules/_set-proto.js"
  }],
  "../node_modules/core-js/modules/_collection.js": [function (require, module, exports) {
    'use strict';

    var global = require('./_global');

    var $export = require('./_export');

    var redefine = require('./_redefine');

    var redefineAll = require('./_redefine-all');

    var meta = require('./_meta');

    var forOf = require('./_for-of');

    var anInstance = require('./_an-instance');

    var isObject = require('./_is-object');

    var fails = require('./_fails');

    var $iterDetect = require('./_iter-detect');

    var setToStringTag = require('./_set-to-string-tag');

    var inheritIfRequired = require('./_inherit-if-required');

    module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
      var Base = global[NAME];
      var C = Base;
      var ADDER = IS_MAP ? 'set' : 'add';
      var proto = C && C.prototype;
      var O = {};

      var fixMethod = function fixMethod(KEY) {
        var fn = proto[KEY];
        redefine(proto, KEY, KEY == 'delete' ? function (a) {
          return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
        } : KEY == 'has' ? function has(a) {
          return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
        } : KEY == 'get' ? function get(a) {
          return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
        } : KEY == 'add' ? function add(a) {
          fn.call(this, a === 0 ? 0 : a);
          return this;
        } : function set(a, b) {
          fn.call(this, a === 0 ? 0 : a, b);
          return this;
        });
      };

      if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
        new C().entries().next();
      }))) {
        // create collection constructor
        C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
        redefineAll(C.prototype, methods);
        meta.NEED = true;
      } else {
        var instance = new C(); // early implementations not supports chaining

        var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance; // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false

        var THROWS_ON_PRIMITIVES = fails(function () {
          instance.has(1);
        }); // most early implementations doesn't supports iterables, most modern - not close it correctly

        var ACCEPT_ITERABLES = $iterDetect(function (iter) {
          new C(iter);
        }); // eslint-disable-line no-new
        // for early implementations -0 and +0 not the same

        var BUGGY_ZERO = !IS_WEAK && fails(function () {
          // V8 ~ Chromium 42- fails only with 5+ elements
          var $instance = new C();
          var index = 5;

          while (index--) {
            $instance[ADDER](index, index);
          }

          return !$instance.has(-0);
        });

        if (!ACCEPT_ITERABLES) {
          C = wrapper(function (target, iterable) {
            anInstance(target, C, NAME);
            var that = inheritIfRequired(new Base(), target, C);
            if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
            return that;
          });
          C.prototype = proto;
          proto.constructor = C;
        }

        if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
          fixMethod('delete');
          fixMethod('has');
          IS_MAP && fixMethod('get');
        }

        if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER); // weak collections should not contains .clear method

        if (IS_WEAK && proto.clear) delete proto.clear;
      }

      setToStringTag(C, NAME);
      O[NAME] = C;
      $export($export.G + $export.W + $export.F * (C != Base), O);
      if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);
      return C;
    };
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js",
    "./_redefine-all": "../node_modules/core-js/modules/_redefine-all.js",
    "./_meta": "../node_modules/core-js/modules/_meta.js",
    "./_for-of": "../node_modules/core-js/modules/_for-of.js",
    "./_an-instance": "../node_modules/core-js/modules/_an-instance.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_iter-detect": "../node_modules/core-js/modules/_iter-detect.js",
    "./_set-to-string-tag": "../node_modules/core-js/modules/_set-to-string-tag.js",
    "./_inherit-if-required": "../node_modules/core-js/modules/_inherit-if-required.js"
  }],
  "../node_modules/core-js/modules/es6.map.js": [function (require, module, exports) {
    'use strict';

    var strong = require('./_collection-strong');

    var validate = require('./_validate-collection');

    var MAP = 'Map'; // 23.1 Map Objects

    module.exports = require('./_collection')(MAP, function (get) {
      return function Map() {
        return get(this, arguments.length > 0 ? arguments[0] : undefined);
      };
    }, {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = strong.getEntry(validate(this, MAP), key);
        return entry && entry.v;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
      }
    }, strong, true);
  }, {
    "./_collection-strong": "../node_modules/core-js/modules/_collection-strong.js",
    "./_validate-collection": "../node_modules/core-js/modules/_validate-collection.js",
    "./_collection": "../node_modules/core-js/modules/_collection.js"
  }],
  "../node_modules/core-js/modules/_math-log1p.js": [function (require, module, exports) {
    // 20.2.2.20 Math.log1p(x)
    module.exports = Math.log1p || function log1p(x) {
      return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
    };
  }, {}],
  "../node_modules/core-js/modules/es6.math.acosh.js": [function (require, module, exports) {
    // 20.2.2.3 Math.acosh(x)
    var $export = require('./_export');

    var log1p = require('./_math-log1p');

    var sqrt = Math.sqrt;
    var $acosh = Math.acosh;
    $export($export.S + $export.F * !($acosh // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
    && Math.floor($acosh(Number.MAX_VALUE)) == 710 // Tor Browser bug: Math.acosh(Infinity) -> NaN
    && $acosh(Infinity) == Infinity), 'Math', {
      acosh: function acosh(x) {
        return (x = +x) < 1 ? NaN : x > 94906265.62425156 ? Math.log(x) + Math.LN2 : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_math-log1p": "../node_modules/core-js/modules/_math-log1p.js"
  }],
  "../node_modules/core-js/modules/es6.math.asinh.js": [function (require, module, exports) {
    // 20.2.2.5 Math.asinh(x)
    var $export = require('./_export');

    var $asinh = Math.asinh;

    function asinh(x) {
      return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
    } // Tor Browser bug: Math.asinh(0) -> -0


    $export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {
      asinh: asinh
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/es6.math.atanh.js": [function (require, module, exports) {
    // 20.2.2.7 Math.atanh(x)
    var $export = require('./_export');

    var $atanh = Math.atanh; // Tor Browser bug: Math.atanh(-0) -> 0

    $export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
      atanh: function atanh(x) {
        return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/_math-sign.js": [function (require, module, exports) {
    // 20.2.2.28 Math.sign(x)
    module.exports = Math.sign || function sign(x) {
      // eslint-disable-next-line no-self-compare
      return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
    };
  }, {}],
  "../node_modules/core-js/modules/es6.math.cbrt.js": [function (require, module, exports) {
    // 20.2.2.9 Math.cbrt(x)
    var $export = require('./_export');

    var sign = require('./_math-sign');

    $export($export.S, 'Math', {
      cbrt: function cbrt(x) {
        return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_math-sign": "../node_modules/core-js/modules/_math-sign.js"
  }],
  "../node_modules/core-js/modules/es6.math.clz32.js": [function (require, module, exports) {
    // 20.2.2.11 Math.clz32(x)
    var $export = require('./_export');

    $export($export.S, 'Math', {
      clz32: function clz32(x) {
        return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/es6.math.cosh.js": [function (require, module, exports) {
    // 20.2.2.12 Math.cosh(x)
    var $export = require('./_export');

    var exp = Math.exp;
    $export($export.S, 'Math', {
      cosh: function cosh(x) {
        return (exp(x = +x) + exp(-x)) / 2;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/_math-expm1.js": [function (require, module, exports) {
    // 20.2.2.14 Math.expm1(x)
    var $expm1 = Math.expm1;
    module.exports = !$expm1 // Old FF bug
    || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168 // Tor Browser bug
    || $expm1(-2e-17) != -2e-17 ? function expm1(x) {
      return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
    } : $expm1;
  }, {}],
  "../node_modules/core-js/modules/es6.math.expm1.js": [function (require, module, exports) {
    // 20.2.2.14 Math.expm1(x)
    var $export = require('./_export');

    var $expm1 = require('./_math-expm1');

    $export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {
      expm1: $expm1
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_math-expm1": "../node_modules/core-js/modules/_math-expm1.js"
  }],
  "../node_modules/core-js/modules/_math-fround.js": [function (require, module, exports) {
    // 20.2.2.16 Math.fround(x)
    var sign = require('./_math-sign');

    var pow = Math.pow;
    var EPSILON = pow(2, -52);
    var EPSILON32 = pow(2, -23);
    var MAX32 = pow(2, 127) * (2 - EPSILON32);
    var MIN32 = pow(2, -126);

    var roundTiesToEven = function roundTiesToEven(n) {
      return n + 1 / EPSILON - 1 / EPSILON;
    };

    module.exports = Math.fround || function fround(x) {
      var $abs = Math.abs(x);
      var $sign = sign(x);
      var a, result;
      if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
      a = (1 + EPSILON32 / EPSILON) * $abs;
      result = a - (a - $abs); // eslint-disable-next-line no-self-compare

      if (result > MAX32 || result != result) return $sign * Infinity;
      return $sign * result;
    };
  }, {
    "./_math-sign": "../node_modules/core-js/modules/_math-sign.js"
  }],
  "../node_modules/core-js/modules/es6.math.fround.js": [function (require, module, exports) {
    // 20.2.2.16 Math.fround(x)
    var $export = require('./_export');

    $export($export.S, 'Math', {
      fround: require('./_math-fround')
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_math-fround": "../node_modules/core-js/modules/_math-fround.js"
  }],
  "../node_modules/core-js/modules/es6.math.hypot.js": [function (require, module, exports) {
    // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
    var $export = require('./_export');

    var abs = Math.abs;
    $export($export.S, 'Math', {
      hypot: function hypot(value1, value2) {
        // eslint-disable-line no-unused-vars
        var sum = 0;
        var i = 0;
        var aLen = arguments.length;
        var larg = 0;
        var arg, div;

        while (i < aLen) {
          arg = abs(arguments[i++]);

          if (larg < arg) {
            div = larg / arg;
            sum = sum * div * div + 1;
            larg = arg;
          } else if (arg > 0) {
            div = arg / larg;
            sum += div * div;
          } else sum += arg;
        }

        return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/es6.math.imul.js": [function (require, module, exports) {
    // 20.2.2.18 Math.imul(x, y)
    var $export = require('./_export');

    var $imul = Math.imul; // some WebKit versions fails with big numbers, some has wrong arity

    $export($export.S + $export.F * require('./_fails')(function () {
      return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
    }), 'Math', {
      imul: function imul(x, y) {
        var UINT16 = 0xffff;
        var xn = +x;
        var yn = +y;
        var xl = UINT16 & xn;
        var yl = UINT16 & yn;
        return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/es6.math.log1p.js": [function (require, module, exports) {
    // 20.2.2.20 Math.log1p(x)
    var $export = require('./_export');

    $export($export.S, 'Math', {
      log1p: require('./_math-log1p')
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_math-log1p": "../node_modules/core-js/modules/_math-log1p.js"
  }],
  "../node_modules/core-js/modules/es6.math.log10.js": [function (require, module, exports) {
    // 20.2.2.21 Math.log10(x)
    var $export = require('./_export');

    $export($export.S, 'Math', {
      log10: function log10(x) {
        return Math.log(x) * Math.LOG10E;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/es6.math.log2.js": [function (require, module, exports) {
    // 20.2.2.22 Math.log2(x)
    var $export = require('./_export');

    $export($export.S, 'Math', {
      log2: function log2(x) {
        return Math.log(x) / Math.LN2;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/es6.math.sign.js": [function (require, module, exports) {
    // 20.2.2.28 Math.sign(x)
    var $export = require('./_export');

    $export($export.S, 'Math', {
      sign: require('./_math-sign')
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_math-sign": "../node_modules/core-js/modules/_math-sign.js"
  }],
  "../node_modules/core-js/modules/es6.math.sinh.js": [function (require, module, exports) {
    // 20.2.2.30 Math.sinh(x)
    var $export = require('./_export');

    var expm1 = require('./_math-expm1');

    var exp = Math.exp; // V8 near Chromium 38 has a problem with very small numbers

    $export($export.S + $export.F * require('./_fails')(function () {
      return !Math.sinh(-2e-17) != -2e-17;
    }), 'Math', {
      sinh: function sinh(x) {
        return Math.abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_math-expm1": "../node_modules/core-js/modules/_math-expm1.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/es6.math.tanh.js": [function (require, module, exports) {
    // 20.2.2.33 Math.tanh(x)
    var $export = require('./_export');

    var expm1 = require('./_math-expm1');

    var exp = Math.exp;
    $export($export.S, 'Math', {
      tanh: function tanh(x) {
        var a = expm1(x = +x);
        var b = expm1(-x);
        return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_math-expm1": "../node_modules/core-js/modules/_math-expm1.js"
  }],
  "../node_modules/core-js/modules/es6.math.trunc.js": [function (require, module, exports) {
    // 20.2.2.34 Math.trunc(x)
    var $export = require('./_export');

    $export($export.S, 'Math', {
      trunc: function trunc(it) {
        return (it > 0 ? Math.floor : Math.ceil)(it);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/_object-gopn.js": [function (require, module, exports) {
    // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
    var $keys = require('./_object-keys-internal');

    var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

    exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
      return $keys(O, hiddenKeys);
    };
  }, {
    "./_object-keys-internal": "../node_modules/core-js/modules/_object-keys-internal.js",
    "./_enum-bug-keys": "../node_modules/core-js/modules/_enum-bug-keys.js"
  }],
  "../node_modules/core-js/modules/_string-ws.js": [function (require, module, exports) {
    module.exports = "\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003" + "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
  }, {}],
  "../node_modules/core-js/modules/_string-trim.js": [function (require, module, exports) {
    var $export = require('./_export');

    var defined = require('./_defined');

    var fails = require('./_fails');

    var spaces = require('./_string-ws');

    var space = '[' + spaces + ']';
    var non = "\u200B\x85";
    var ltrim = RegExp('^' + space + space + '*');
    var rtrim = RegExp(space + space + '*$');

    var exporter = function exporter(KEY, exec, ALIAS) {
      var exp = {};
      var FORCE = fails(function () {
        return !!spaces[KEY]() || non[KEY]() != non;
      });
      var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
      if (ALIAS) exp[ALIAS] = fn;
      $export($export.P + $export.F * FORCE, 'String', exp);
    }; // 1 -> String#trimLeft
    // 2 -> String#trimRight
    // 3 -> String#trim


    var trim = exporter.trim = function (string, TYPE) {
      string = String(defined(string));
      if (TYPE & 1) string = string.replace(ltrim, '');
      if (TYPE & 2) string = string.replace(rtrim, '');
      return string;
    };

    module.exports = exporter;
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_defined": "../node_modules/core-js/modules/_defined.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_string-ws": "../node_modules/core-js/modules/_string-ws.js"
  }],
  "../node_modules/core-js/modules/es6.number.constructor.js": [function (require, module, exports) {
    'use strict';

    var global = require('./_global');

    var has = require('./_has');

    var cof = require('./_cof');

    var inheritIfRequired = require('./_inherit-if-required');

    var toPrimitive = require('./_to-primitive');

    var fails = require('./_fails');

    var gOPN = require('./_object-gopn').f;

    var gOPD = require('./_object-gopd').f;

    var dP = require('./_object-dp').f;

    var $trim = require('./_string-trim').trim;

    var NUMBER = 'Number';
    var $Number = global[NUMBER];
    var Base = $Number;
    var proto = $Number.prototype; // Opera ~12 has broken Object#toString

    var BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER;
    var TRIM = ('trim' in String.prototype); // 7.1.3 ToNumber(argument)

    var toNumber = function toNumber(argument) {
      var it = toPrimitive(argument, false);

      if (typeof it == 'string' && it.length > 2) {
        it = TRIM ? it.trim() : $trim(it, 3);
        var first = it.charCodeAt(0);
        var third, radix, maxCode;

        if (first === 43 || first === 45) {
          third = it.charCodeAt(2);
          if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
        } else if (first === 48) {
          switch (it.charCodeAt(1)) {
            case 66:
            case 98:
              radix = 2;
              maxCode = 49;
              break;
            // fast equal /^0b[01]+$/i

            case 79:
            case 111:
              radix = 8;
              maxCode = 55;
              break;
            // fast equal /^0o[0-7]+$/i

            default:
              return +it;
          }

          for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
            code = digits.charCodeAt(i); // parseInt parses a string to a first unavailable symbol
            // but ToNumber should return NaN if a string contains unavailable symbols

            if (code < 48 || code > maxCode) return NaN;
          }

          return parseInt(digits, radix);
        }
      }

      return +it;
    };

    if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
      $Number = function Number(value) {
        var it = arguments.length < 1 ? 0 : value;
        var that = this;
        return that instanceof $Number // check on 1..constructor(foo) case
        && (BROKEN_COF ? fails(function () {
          proto.valueOf.call(that);
        }) : cof(that) != NUMBER) ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
      };

      for (var keys = require('./_descriptors') ? gOPN(Base) : ( // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' + // ES6 (in case, if modules with ES6 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' + 'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger').split(','), j = 0, key; keys.length > j; j++) {
        if (has(Base, key = keys[j]) && !has($Number, key)) {
          dP($Number, key, gOPD(Base, key));
        }
      }

      $Number.prototype = proto;
      proto.constructor = $Number;

      require('./_redefine')(global, NUMBER, $Number);
    }
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_cof": "../node_modules/core-js/modules/_cof.js",
    "./_inherit-if-required": "../node_modules/core-js/modules/_inherit-if-required.js",
    "./_to-primitive": "../node_modules/core-js/modules/_to-primitive.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_object-gopn": "../node_modules/core-js/modules/_object-gopn.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_string-trim": "../node_modules/core-js/modules/_string-trim.js",
    "./_object-create": "../node_modules/core-js/modules/_object-create.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js"
  }],
  "../node_modules/core-js/modules/es6.number.epsilon.js": [function (require, module, exports) {
    // 20.1.2.1 Number.EPSILON
    var $export = require('./_export');

    $export($export.S, 'Number', {
      EPSILON: Math.pow(2, -52)
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/es6.number.is-finite.js": [function (require, module, exports) {
    // 20.1.2.2 Number.isFinite(number)
    var $export = require('./_export');

    var _isFinite = require('./_global').isFinite;

    $export($export.S, 'Number', {
      isFinite: function isFinite(it) {
        return typeof it == 'number' && _isFinite(it);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_global": "../node_modules/core-js/modules/_global.js"
  }],
  "../node_modules/core-js/modules/_is-integer.js": [function (require, module, exports) {
    // 20.1.2.3 Number.isInteger(number)
    var isObject = require('./_is-object');

    var floor = Math.floor;

    module.exports = function isInteger(it) {
      return !isObject(it) && isFinite(it) && floor(it) === it;
    };
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js"
  }],
  "../node_modules/core-js/modules/es6.number.is-integer.js": [function (require, module, exports) {
    // 20.1.2.3 Number.isInteger(number)
    var $export = require('./_export');

    $export($export.S, 'Number', {
      isInteger: require('./_is-integer')
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_is-integer": "../node_modules/core-js/modules/_is-integer.js"
  }],
  "../node_modules/core-js/modules/es6.number.is-nan.js": [function (require, module, exports) {
    // 20.1.2.4 Number.isNaN(number)
    var $export = require('./_export');

    $export($export.S, 'Number', {
      isNaN: function isNaN(number) {
        // eslint-disable-next-line no-self-compare
        return number != number;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/es6.number.is-safe-integer.js": [function (require, module, exports) {
    // 20.1.2.5 Number.isSafeInteger(number)
    var $export = require('./_export');

    var isInteger = require('./_is-integer');

    var abs = Math.abs;
    $export($export.S, 'Number', {
      isSafeInteger: function isSafeInteger(number) {
        return isInteger(number) && abs(number) <= 0x1fffffffffffff;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_is-integer": "../node_modules/core-js/modules/_is-integer.js"
  }],
  "../node_modules/core-js/modules/es6.number.max-safe-integer.js": [function (require, module, exports) {
    // 20.1.2.6 Number.MAX_SAFE_INTEGER
    var $export = require('./_export');

    $export($export.S, 'Number', {
      MAX_SAFE_INTEGER: 0x1fffffffffffff
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/es6.number.min-safe-integer.js": [function (require, module, exports) {
    // 20.1.2.10 Number.MIN_SAFE_INTEGER
    var $export = require('./_export');

    $export($export.S, 'Number', {
      MIN_SAFE_INTEGER: -0x1fffffffffffff
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/_parse-float.js": [function (require, module, exports) {
    var $parseFloat = require('./_global').parseFloat;

    var $trim = require('./_string-trim').trim;

    module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
      var string = $trim(String(str), 3);
      var result = $parseFloat(string);
      return result === 0 && string.charAt(0) == '-' ? -0 : result;
    } : $parseFloat;
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_string-trim": "../node_modules/core-js/modules/_string-trim.js",
    "./_string-ws": "../node_modules/core-js/modules/_string-ws.js"
  }],
  "../node_modules/core-js/modules/es6.number.parse-float.js": [function (require, module, exports) {
    var $export = require('./_export');

    var $parseFloat = require('./_parse-float'); // 20.1.2.12 Number.parseFloat(string)


    $export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {
      parseFloat: $parseFloat
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_parse-float": "../node_modules/core-js/modules/_parse-float.js"
  }],
  "../node_modules/core-js/modules/_parse-int.js": [function (require, module, exports) {
    var $parseInt = require('./_global').parseInt;

    var $trim = require('./_string-trim').trim;

    var ws = require('./_string-ws');

    var hex = /^[-+]?0[xX]/;
    module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
      var string = $trim(String(str), 3);
      return $parseInt(string, radix >>> 0 || (hex.test(string) ? 16 : 10));
    } : $parseInt;
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_string-trim": "../node_modules/core-js/modules/_string-trim.js",
    "./_string-ws": "../node_modules/core-js/modules/_string-ws.js"
  }],
  "../node_modules/core-js/modules/es6.number.parse-int.js": [function (require, module, exports) {
    var $export = require('./_export');

    var $parseInt = require('./_parse-int'); // 20.1.2.13 Number.parseInt(string, radix)


    $export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {
      parseInt: $parseInt
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_parse-int": "../node_modules/core-js/modules/_parse-int.js"
  }],
  "../node_modules/core-js/modules/_object-gops.js": [function (require, module, exports) {
    exports.f = Object.getOwnPropertySymbols;
  }, {}],
  "../node_modules/core-js/modules/_object-assign.js": [function (require, module, exports) {
    'use strict'; // 19.1.2.1 Object.assign(target, source, ...)

    var DESCRIPTORS = require('./_descriptors');

    var getKeys = require('./_object-keys');

    var gOPS = require('./_object-gops');

    var pIE = require('./_object-pie');

    var toObject = require('./_to-object');

    var IObject = require('./_iobject');

    var $assign = Object.assign; // should work with symbols and should have deterministic property order (V8 bug)

    module.exports = !$assign || require('./_fails')(function () {
      var A = {};
      var B = {}; // eslint-disable-next-line no-undef

      var S = Symbol();
      var K = 'abcdefghijklmnopqrst';
      A[S] = 7;
      K.split('').forEach(function (k) {
        B[k] = k;
      });
      return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
    }) ? function assign(target, source) {
      // eslint-disable-line no-unused-vars
      var T = toObject(target);
      var aLen = arguments.length;
      var index = 1;
      var getSymbols = gOPS.f;
      var isEnum = pIE.f;

      while (aLen > index) {
        var S = IObject(arguments[index++]);
        var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
        var length = keys.length;
        var j = 0;
        var key;

        while (length > j) {
          key = keys[j++];
          if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
        }
      }

      return T;
    } : $assign;
  }, {
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_object-keys": "../node_modules/core-js/modules/_object-keys.js",
    "./_object-gops": "../node_modules/core-js/modules/_object-gops.js",
    "./_object-pie": "../node_modules/core-js/modules/_object-pie.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_iobject": "../node_modules/core-js/modules/_iobject.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/es6.object.assign.js": [function (require, module, exports) {
    // 19.1.3.1 Object.assign(target, source)
    var $export = require('./_export');

    $export($export.S + $export.F, 'Object', {
      assign: require('./_object-assign')
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_object-assign": "../node_modules/core-js/modules/_object-assign.js"
  }],
  "../node_modules/core-js/modules/_object-forced-pam.js": [function (require, module, exports) {
    'use strict'; // Forced replacement prototype accessors methods

    module.exports = require('./_library') || !require('./_fails')(function () {
      var K = Math.random(); // In FF throws only define methods
      // eslint-disable-next-line no-undef, no-useless-call

      __defineSetter__.call(null, K, function () {
        /* empty */
      });

      delete require('./_global')[K];
    });
  }, {
    "./_library": "../node_modules/core-js/modules/_library.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_global": "../node_modules/core-js/modules/_global.js"
  }],
  "../node_modules/core-js/modules/es7.object.define-getter.js": [function (require, module, exports) {
    'use strict';

    var $export = require('./_export');

    var toObject = require('./_to-object');

    var aFunction = require('./_a-function');

    var $defineProperty = require('./_object-dp'); // B.2.2.2 Object.prototype.__defineGetter__(P, getter)


    require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
      __defineGetter__: function __defineGetter__(P, getter) {
        $defineProperty.f(toObject(this), P, {
          get: aFunction(getter),
          enumerable: true,
          configurable: true
        });
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_a-function": "../node_modules/core-js/modules/_a-function.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_object-forced-pam": "../node_modules/core-js/modules/_object-forced-pam.js"
  }],
  "../node_modules/core-js/modules/es7.object.define-setter.js": [function (require, module, exports) {
    'use strict';

    var $export = require('./_export');

    var toObject = require('./_to-object');

    var aFunction = require('./_a-function');

    var $defineProperty = require('./_object-dp'); // B.2.2.3 Object.prototype.__defineSetter__(P, setter)


    require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
      __defineSetter__: function __defineSetter__(P, setter) {
        $defineProperty.f(toObject(this), P, {
          set: aFunction(setter),
          enumerable: true,
          configurable: true
        });
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_a-function": "../node_modules/core-js/modules/_a-function.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_object-forced-pam": "../node_modules/core-js/modules/_object-forced-pam.js"
  }],
  "../node_modules/core-js/modules/_object-to-array.js": [function (require, module, exports) {
    var DESCRIPTORS = require('./_descriptors');

    var getKeys = require('./_object-keys');

    var toIObject = require('./_to-iobject');

    var isEnum = require('./_object-pie').f;

    module.exports = function (isEntries) {
      return function (it) {
        var O = toIObject(it);
        var keys = getKeys(O);
        var length = keys.length;
        var i = 0;
        var result = [];
        var key;

        while (length > i) {
          key = keys[i++];

          if (!DESCRIPTORS || isEnum.call(O, key)) {
            result.push(isEntries ? [key, O[key]] : O[key]);
          }
        }

        return result;
      };
    };
  }, {
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_object-keys": "../node_modules/core-js/modules/_object-keys.js",
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_object-pie": "../node_modules/core-js/modules/_object-pie.js"
  }],
  "../node_modules/core-js/modules/es7.object.entries.js": [function (require, module, exports) {
    // https://github.com/tc39/proposal-object-values-entries
    var $export = require('./_export');

    var $entries = require('./_object-to-array')(true);

    $export($export.S, 'Object', {
      entries: function entries(it) {
        return $entries(it);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_object-to-array": "../node_modules/core-js/modules/_object-to-array.js"
  }],
  "../node_modules/core-js/modules/_object-sap.js": [function (require, module, exports) {
    // most Object methods by ES6 should accept primitives
    var $export = require('./_export');

    var core = require('./_core');

    var fails = require('./_fails');

    module.exports = function (KEY, exec) {
      var fn = (core.Object || {})[KEY] || Object[KEY];
      var exp = {};
      exp[KEY] = exec(fn);
      $export($export.S + $export.F * fails(function () {
        fn(1);
      }), 'Object', exp);
    };
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_core": "../node_modules/core-js/modules/_core.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/es6.object.freeze.js": [function (require, module, exports) {
    // 19.1.2.5 Object.freeze(O)
    var isObject = require('./_is-object');

    var meta = require('./_meta').onFreeze;

    require('./_object-sap')('freeze', function ($freeze) {
      return function freeze(it) {
        return $freeze && isObject(it) ? $freeze(meta(it)) : it;
      };
    });
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_meta": "../node_modules/core-js/modules/_meta.js",
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js"
  }],
  "../node_modules/core-js/modules/es6.object.get-own-property-descriptor.js": [function (require, module, exports) {
    // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
    var toIObject = require('./_to-iobject');

    var $getOwnPropertyDescriptor = require('./_object-gopd').f;

    require('./_object-sap')('getOwnPropertyDescriptor', function () {
      return function getOwnPropertyDescriptor(it, key) {
        return $getOwnPropertyDescriptor(toIObject(it), key);
      };
    });
  }, {
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js"
  }],
  "../node_modules/core-js/modules/_own-keys.js": [function (require, module, exports) {
    // all object keys, includes non-enumerable and symbols
    var gOPN = require('./_object-gopn');

    var gOPS = require('./_object-gops');

    var anObject = require('./_an-object');

    var Reflect = require('./_global').Reflect;

    module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
      var keys = gOPN.f(anObject(it));
      var getSymbols = gOPS.f;
      return getSymbols ? keys.concat(getSymbols(it)) : keys;
    };
  }, {
    "./_object-gopn": "../node_modules/core-js/modules/_object-gopn.js",
    "./_object-gops": "../node_modules/core-js/modules/_object-gops.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_global": "../node_modules/core-js/modules/_global.js"
  }],
  "../node_modules/core-js/modules/es7.object.get-own-property-descriptors.js": [function (require, module, exports) {
    // https://github.com/tc39/proposal-object-getownpropertydescriptors
    var $export = require('./_export');

    var ownKeys = require('./_own-keys');

    var toIObject = require('./_to-iobject');

    var gOPD = require('./_object-gopd');

    var createProperty = require('./_create-property');

    $export($export.S, 'Object', {
      getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
        var O = toIObject(object);
        var getDesc = gOPD.f;
        var keys = ownKeys(O);
        var result = {};
        var i = 0;
        var key, desc;

        while (keys.length > i) {
          desc = getDesc(O, key = keys[i++]);
          if (desc !== undefined) createProperty(result, key, desc);
        }

        return result;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_own-keys": "../node_modules/core-js/modules/_own-keys.js",
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_create-property": "../node_modules/core-js/modules/_create-property.js"
  }],
  "../node_modules/core-js/modules/_object-gopn-ext.js": [function (require, module, exports) {
    // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
    var toIObject = require('./_to-iobject');

    var gOPN = require('./_object-gopn').f;

    var toString = {}.toString;
    var windowNames = (typeof window === "undefined" ? "undefined" : _typeof2(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

    var getWindowNames = function getWindowNames(it) {
      try {
        return gOPN(it);
      } catch (e) {
        return windowNames.slice();
      }
    };

    module.exports.f = function getOwnPropertyNames(it) {
      return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
    };
  }, {
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_object-gopn": "../node_modules/core-js/modules/_object-gopn.js"
  }],
  "../node_modules/core-js/modules/es6.object.get-own-property-names.js": [function (require, module, exports) {
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    require('./_object-sap')('getOwnPropertyNames', function () {
      return require('./_object-gopn-ext').f;
    });
  }, {
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js",
    "./_object-gopn-ext": "../node_modules/core-js/modules/_object-gopn-ext.js"
  }],
  "../node_modules/core-js/modules/es6.object.get-prototype-of.js": [function (require, module, exports) {
    // 19.1.2.9 Object.getPrototypeOf(O)
    var toObject = require('./_to-object');

    var $getPrototypeOf = require('./_object-gpo');

    require('./_object-sap')('getPrototypeOf', function () {
      return function getPrototypeOf(it) {
        return $getPrototypeOf(toObject(it));
      };
    });
  }, {
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_object-gpo": "../node_modules/core-js/modules/_object-gpo.js",
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js"
  }],
  "../node_modules/core-js/modules/es7.object.lookup-getter.js": [function (require, module, exports) {
    'use strict';

    var $export = require('./_export');

    var toObject = require('./_to-object');

    var toPrimitive = require('./_to-primitive');

    var getPrototypeOf = require('./_object-gpo');

    var getOwnPropertyDescriptor = require('./_object-gopd').f; // B.2.2.4 Object.prototype.__lookupGetter__(P)


    require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
      __lookupGetter__: function __lookupGetter__(P) {
        var O = toObject(this);
        var K = toPrimitive(P, true);
        var D;

        do {
          if (D = getOwnPropertyDescriptor(O, K)) return D.get;
        } while (O = getPrototypeOf(O));
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_to-primitive": "../node_modules/core-js/modules/_to-primitive.js",
    "./_object-gpo": "../node_modules/core-js/modules/_object-gpo.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_object-forced-pam": "../node_modules/core-js/modules/_object-forced-pam.js"
  }],
  "../node_modules/core-js/modules/es7.object.lookup-setter.js": [function (require, module, exports) {
    'use strict';

    var $export = require('./_export');

    var toObject = require('./_to-object');

    var toPrimitive = require('./_to-primitive');

    var getPrototypeOf = require('./_object-gpo');

    var getOwnPropertyDescriptor = require('./_object-gopd').f; // B.2.2.5 Object.prototype.__lookupSetter__(P)


    require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
      __lookupSetter__: function __lookupSetter__(P) {
        var O = toObject(this);
        var K = toPrimitive(P, true);
        var D;

        do {
          if (D = getOwnPropertyDescriptor(O, K)) return D.set;
        } while (O = getPrototypeOf(O));
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_to-primitive": "../node_modules/core-js/modules/_to-primitive.js",
    "./_object-gpo": "../node_modules/core-js/modules/_object-gpo.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_object-forced-pam": "../node_modules/core-js/modules/_object-forced-pam.js"
  }],
  "../node_modules/core-js/modules/es6.object.prevent-extensions.js": [function (require, module, exports) {
    // 19.1.2.15 Object.preventExtensions(O)
    var isObject = require('./_is-object');

    var meta = require('./_meta').onFreeze;

    require('./_object-sap')('preventExtensions', function ($preventExtensions) {
      return function preventExtensions(it) {
        return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
      };
    });
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_meta": "../node_modules/core-js/modules/_meta.js",
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js"
  }],
  "../node_modules/core-js/modules/es6.object.to-string.js": [function (require, module, exports) {
    'use strict'; // 19.1.3.6 Object.prototype.toString()

    var classof = require('./_classof');

    var test = {};
    test[require('./_wks')('toStringTag')] = 'z';

    if (test + '' != '[object z]') {
      require('./_redefine')(Object.prototype, 'toString', function toString() {
        return '[object ' + classof(this) + ']';
      }, true);
    }
  }, {
    "./_classof": "../node_modules/core-js/modules/_classof.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js"
  }],
  "../node_modules/core-js/modules/_same-value.js": [function (require, module, exports) {
    // 7.2.9 SameValue(x, y)
    module.exports = Object.is || function is(x, y) {
      // eslint-disable-next-line no-self-compare
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    };
  }, {}],
  "../node_modules/core-js/modules/es6.object.is.js": [function (require, module, exports) {
    // 19.1.3.10 Object.is(value1, value2)
    var $export = require('./_export');

    $export($export.S, 'Object', {
      is: require('./_same-value')
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_same-value": "../node_modules/core-js/modules/_same-value.js"
  }],
  "../node_modules/core-js/modules/es6.object.is-frozen.js": [function (require, module, exports) {
    // 19.1.2.12 Object.isFrozen(O)
    var isObject = require('./_is-object');

    require('./_object-sap')('isFrozen', function ($isFrozen) {
      return function isFrozen(it) {
        return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
      };
    });
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js"
  }],
  "../node_modules/core-js/modules/es6.object.is-sealed.js": [function (require, module, exports) {
    // 19.1.2.13 Object.isSealed(O)
    var isObject = require('./_is-object');

    require('./_object-sap')('isSealed', function ($isSealed) {
      return function isSealed(it) {
        return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
      };
    });
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js"
  }],
  "../node_modules/core-js/modules/es6.object.is-extensible.js": [function (require, module, exports) {
    // 19.1.2.11 Object.isExtensible(O)
    var isObject = require('./_is-object');

    require('./_object-sap')('isExtensible', function ($isExtensible) {
      return function isExtensible(it) {
        return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
      };
    });
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js"
  }],
  "../node_modules/core-js/modules/es6.object.keys.js": [function (require, module, exports) {
    // 19.1.2.14 Object.keys(O)
    var toObject = require('./_to-object');

    var $keys = require('./_object-keys');

    require('./_object-sap')('keys', function () {
      return function keys(it) {
        return $keys(toObject(it));
      };
    });
  }, {
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_object-keys": "../node_modules/core-js/modules/_object-keys.js",
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js"
  }],
  "../node_modules/core-js/modules/es6.object.seal.js": [function (require, module, exports) {
    // 19.1.2.17 Object.seal(O)
    var isObject = require('./_is-object');

    var meta = require('./_meta').onFreeze;

    require('./_object-sap')('seal', function ($seal) {
      return function seal(it) {
        return $seal && isObject(it) ? $seal(meta(it)) : it;
      };
    });
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_meta": "../node_modules/core-js/modules/_meta.js",
    "./_object-sap": "../node_modules/core-js/modules/_object-sap.js"
  }],
  "../node_modules/core-js/modules/es7.object.values.js": [function (require, module, exports) {
    // https://github.com/tc39/proposal-object-values-entries
    var $export = require('./_export');

    var $values = require('./_object-to-array')(false);

    $export($export.S, 'Object', {
      values: function values(it) {
        return $values(it);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_object-to-array": "../node_modules/core-js/modules/_object-to-array.js"
  }],
  "../node_modules/core-js/modules/_species-constructor.js": [function (require, module, exports) {
    // 7.3.20 SpeciesConstructor(O, defaultConstructor)
    var anObject = require('./_an-object');

    var aFunction = require('./_a-function');

    var SPECIES = require('./_wks')('species');

    module.exports = function (O, D) {
      var C = anObject(O).constructor;
      var S;
      return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
    };
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_a-function": "../node_modules/core-js/modules/_a-function.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/_invoke.js": [function (require, module, exports) {
    // fast apply, http://jsperf.lnkit.com/fast-apply/5
    module.exports = function (fn, args, that) {
      var un = that === undefined;

      switch (args.length) {
        case 0:
          return un ? fn() : fn.call(that);

        case 1:
          return un ? fn(args[0]) : fn.call(that, args[0]);

        case 2:
          return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);

        case 3:
          return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);

        case 4:
          return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
      }

      return fn.apply(that, args);
    };
  }, {}],
  "../node_modules/core-js/modules/_task.js": [function (require, module, exports) {
    var ctx = require('./_ctx');

    var invoke = require('./_invoke');

    var html = require('./_html');

    var cel = require('./_dom-create');

    var global = require('./_global');

    var process = global.process;
    var setTask = global.setImmediate;
    var clearTask = global.clearImmediate;
    var MessageChannel = global.MessageChannel;
    var Dispatch = global.Dispatch;
    var counter = 0;
    var queue = {};
    var ONREADYSTATECHANGE = 'onreadystatechange';
    var defer, channel, port;

    var run = function run() {
      var id = +this; // eslint-disable-next-line no-prototype-builtins

      if (queue.hasOwnProperty(id)) {
        var fn = queue[id];
        delete queue[id];
        fn();
      }
    };

    var listener = function listener(event) {
      run.call(event.data);
    }; // Node.js 0.9+ & IE10+ has setImmediate, otherwise:


    if (!setTask || !clearTask) {
      setTask = function setImmediate(fn) {
        var args = [];
        var i = 1;

        while (arguments.length > i) {
          args.push(arguments[i++]);
        }

        queue[++counter] = function () {
          // eslint-disable-next-line no-new-func
          invoke(typeof fn == 'function' ? fn : Function(fn), args);
        };

        defer(counter);
        return counter;
      };

      clearTask = function clearImmediate(id) {
        delete queue[id];
      }; // Node.js 0.8-


      if (require('./_cof')(process) == 'process') {
        defer = function defer(id) {
          process.nextTick(ctx(run, id, 1));
        }; // Sphere (JS game engine) Dispatch API

      } else if (Dispatch && Dispatch.now) {
        defer = function defer(id) {
          Dispatch.now(ctx(run, id, 1));
        }; // Browsers with MessageChannel, includes WebWorkers

      } else if (MessageChannel) {
        channel = new MessageChannel();
        port = channel.port2;
        channel.port1.onmessage = listener;
        defer = ctx(port.postMessage, port, 1); // Browsers with postMessage, skip WebWorkers
        // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
      } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
        defer = function defer(id) {
          global.postMessage(id + '', '*');
        };

        global.addEventListener('message', listener, false); // IE8-
      } else if (ONREADYSTATECHANGE in cel('script')) {
        defer = function defer(id) {
          html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
            html.removeChild(this);
            run.call(id);
          };
        }; // Rest old browsers

      } else {
        defer = function defer(id) {
          setTimeout(ctx(run, id, 1), 0);
        };
      }
    }

    module.exports = {
      set: setTask,
      clear: clearTask
    };
  }, {
    "./_ctx": "../node_modules/core-js/modules/_ctx.js",
    "./_invoke": "../node_modules/core-js/modules/_invoke.js",
    "./_html": "../node_modules/core-js/modules/_html.js",
    "./_dom-create": "../node_modules/core-js/modules/_dom-create.js",
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_cof": "../node_modules/core-js/modules/_cof.js"
  }],
  "../node_modules/core-js/modules/_microtask.js": [function (require, module, exports) {
    var global = require('./_global');

    var macrotask = require('./_task').set;

    var Observer = global.MutationObserver || global.WebKitMutationObserver;
    var process = global.process;
    var Promise = global.Promise;
    var isNode = require('./_cof')(process) == 'process';

    module.exports = function () {
      var head, last, notify;

      var flush = function flush() {
        var parent, fn;
        if (isNode && (parent = process.domain)) parent.exit();

        while (head) {
          fn = head.fn;
          head = head.next;

          try {
            fn();
          } catch (e) {
            if (head) notify();else last = undefined;
            throw e;
          }
        }

        last = undefined;
        if (parent) parent.enter();
      }; // Node.js


      if (isNode) {
        notify = function notify() {
          process.nextTick(flush);
        }; // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339

      } else if (Observer && !(global.navigator && global.navigator.standalone)) {
        var toggle = true;
        var node = document.createTextNode('');
        new Observer(flush).observe(node, {
          characterData: true
        }); // eslint-disable-line no-new

        notify = function notify() {
          node.data = toggle = !toggle;
        }; // environments with maybe non-completely correct, but existent Promise

      } else if (Promise && Promise.resolve) {
        // Promise.resolve without an argument throws an error in LG WebOS 2
        var promise = Promise.resolve(undefined);

        notify = function notify() {
          promise.then(flush);
        }; // for other environments - macrotask based on:
        // - setImmediate
        // - MessageChannel
        // - window.postMessag
        // - onreadystatechange
        // - setTimeout

      } else {
        notify = function notify() {
          // strange IE + webpack dev server bug - use .call(global)
          macrotask.call(global, flush);
        };
      }

      return function (fn) {
        var task = {
          fn: fn,
          next: undefined
        };
        if (last) last.next = task;

        if (!head) {
          head = task;
          notify();
        }

        last = task;
      };
    };
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_task": "../node_modules/core-js/modules/_task.js",
    "./_cof": "../node_modules/core-js/modules/_cof.js"
  }],
  "../node_modules/core-js/modules/_new-promise-capability.js": [function (require, module, exports) {
    'use strict'; // 25.4.1.5 NewPromiseCapability(C)

    var aFunction = require('./_a-function');

    function PromiseCapability(C) {
      var resolve, reject;
      this.promise = new C(function ($$resolve, $$reject) {
        if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
        resolve = $$resolve;
        reject = $$reject;
      });
      this.resolve = aFunction(resolve);
      this.reject = aFunction(reject);
    }

    module.exports.f = function (C) {
      return new PromiseCapability(C);
    };
  }, {
    "./_a-function": "../node_modules/core-js/modules/_a-function.js"
  }],
  "../node_modules/core-js/modules/_perform.js": [function (require, module, exports) {
    module.exports = function (exec) {
      try {
        return {
          e: false,
          v: exec()
        };
      } catch (e) {
        return {
          e: true,
          v: e
        };
      }
    };
  }, {}],
  "../node_modules/core-js/modules/_user-agent.js": [function (require, module, exports) {
    var global = require('./_global');

    var navigator = global.navigator;
    module.exports = navigator && navigator.userAgent || '';
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js"
  }],
  "../node_modules/core-js/modules/_promise-resolve.js": [function (require, module, exports) {
    var anObject = require('./_an-object');

    var isObject = require('./_is-object');

    var newPromiseCapability = require('./_new-promise-capability');

    module.exports = function (C, x) {
      anObject(C);
      if (isObject(x) && x.constructor === C) return x;
      var promiseCapability = newPromiseCapability.f(C);
      var resolve = promiseCapability.resolve;
      resolve(x);
      return promiseCapability.promise;
    };
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_new-promise-capability": "../node_modules/core-js/modules/_new-promise-capability.js"
  }],
  "../node_modules/core-js/modules/es6.promise.js": [function (require, module, exports) {
    'use strict';

    var LIBRARY = require('./_library');

    var global = require('./_global');

    var ctx = require('./_ctx');

    var classof = require('./_classof');

    var $export = require('./_export');

    var isObject = require('./_is-object');

    var aFunction = require('./_a-function');

    var anInstance = require('./_an-instance');

    var forOf = require('./_for-of');

    var speciesConstructor = require('./_species-constructor');

    var task = require('./_task').set;

    var microtask = require('./_microtask')();

    var newPromiseCapabilityModule = require('./_new-promise-capability');

    var perform = require('./_perform');

    var userAgent = require('./_user-agent');

    var promiseResolve = require('./_promise-resolve');

    var PROMISE = 'Promise';
    var TypeError = global.TypeError;
    var process = global.process;
    var versions = process && process.versions;
    var v8 = versions && versions.v8 || '';
    var $Promise = global[PROMISE];
    var isNode = classof(process) == 'process';

    var empty = function empty() {
      /* empty */
    };

    var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
    var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;
    var USE_NATIVE = !!function () {
      try {
        // correct subclassing with @@species support
        var promise = $Promise.resolve(1);

        var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
          exec(empty, empty);
        }; // unhandled rejections tracking support, NodeJS Promise without it fails @@species test


        return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
        // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
        // we can't detect it synchronously, so just check versions
        && v8.indexOf('6.6') !== 0 && userAgent.indexOf('Chrome/66') === -1;
      } catch (e) {
        /* empty */
      }
    }(); // helpers

    var isThenable = function isThenable(it) {
      var then;
      return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
    };

    var notify = function notify(promise, isReject) {
      if (promise._n) return;
      promise._n = true;
      var chain = promise._c;
      microtask(function () {
        var value = promise._v;
        var ok = promise._s == 1;
        var i = 0;

        var run = function run(reaction) {
          var handler = ok ? reaction.ok : reaction.fail;
          var resolve = reaction.resolve;
          var reject = reaction.reject;
          var domain = reaction.domain;
          var result, then, exited;

          try {
            if (handler) {
              if (!ok) {
                if (promise._h == 2) onHandleUnhandled(promise);
                promise._h = 1;
              }

              if (handler === true) result = value;else {
                if (domain) domain.enter();
                result = handler(value); // may throw

                if (domain) {
                  domain.exit();
                  exited = true;
                }
              }

              if (result === reaction.promise) {
                reject(TypeError('Promise-chain cycle'));
              } else if (then = isThenable(result)) {
                then.call(result, resolve, reject);
              } else resolve(result);
            } else reject(value);
          } catch (e) {
            if (domain && !exited) domain.exit();
            reject(e);
          }
        };

        while (chain.length > i) {
          run(chain[i++]);
        } // variable length - can't use forEach


        promise._c = [];
        promise._n = false;
        if (isReject && !promise._h) onUnhandled(promise);
      });
    };

    var onUnhandled = function onUnhandled(promise) {
      task.call(global, function () {
        var value = promise._v;
        var unhandled = isUnhandled(promise);
        var result, handler, console;

        if (unhandled) {
          result = perform(function () {
            if (isNode) {
              process.emit('unhandledRejection', value, promise);
            } else if (handler = global.onunhandledrejection) {
              handler({
                promise: promise,
                reason: value
              });
            } else if ((console = global.console) && console.error) {
              console.error('Unhandled promise rejection', value);
            }
          }); // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should

          promise._h = isNode || isUnhandled(promise) ? 2 : 1;
        }

        promise._a = undefined;
        if (unhandled && result.e) throw result.v;
      });
    };

    var isUnhandled = function isUnhandled(promise) {
      return promise._h !== 1 && (promise._a || promise._c).length === 0;
    };

    var onHandleUnhandled = function onHandleUnhandled(promise) {
      task.call(global, function () {
        var handler;

        if (isNode) {
          process.emit('rejectionHandled', promise);
        } else if (handler = global.onrejectionhandled) {
          handler({
            promise: promise,
            reason: promise._v
          });
        }
      });
    };

    var $reject = function $reject(value) {
      var promise = this;
      if (promise._d) return;
      promise._d = true;
      promise = promise._w || promise; // unwrap

      promise._v = value;
      promise._s = 2;
      if (!promise._a) promise._a = promise._c.slice();
      notify(promise, true);
    };

    var $resolve = function $resolve(value) {
      var promise = this;
      var then;
      if (promise._d) return;
      promise._d = true;
      promise = promise._w || promise; // unwrap

      try {
        if (promise === value) throw TypeError("Promise can't be resolved itself");

        if (then = isThenable(value)) {
          microtask(function () {
            var wrapper = {
              _w: promise,
              _d: false
            }; // wrap

            try {
              then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
            } catch (e) {
              $reject.call(wrapper, e);
            }
          });
        } else {
          promise._v = value;
          promise._s = 1;
          notify(promise, false);
        }
      } catch (e) {
        $reject.call({
          _w: promise,
          _d: false
        }, e); // wrap
      }
    }; // constructor polyfill


    if (!USE_NATIVE) {
      // 25.4.3.1 Promise(executor)
      $Promise = function Promise(executor) {
        anInstance(this, $Promise, PROMISE, '_h');
        aFunction(executor);
        Internal.call(this);

        try {
          executor(ctx($resolve, this, 1), ctx($reject, this, 1));
        } catch (err) {
          $reject.call(this, err);
        }
      }; // eslint-disable-next-line no-unused-vars


      Internal = function Promise(executor) {
        this._c = []; // <- awaiting reactions

        this._a = undefined; // <- checked in isUnhandled reactions

        this._s = 0; // <- state

        this._d = false; // <- done

        this._v = undefined; // <- value

        this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled

        this._n = false; // <- notify
      };

      Internal.prototype = require('./_redefine-all')($Promise.prototype, {
        // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
        then: function then(onFulfilled, onRejected) {
          var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
          reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
          reaction.fail = typeof onRejected == 'function' && onRejected;
          reaction.domain = isNode ? process.domain : undefined;

          this._c.push(reaction);

          if (this._a) this._a.push(reaction);
          if (this._s) notify(this, false);
          return reaction.promise;
        },
        // 25.4.5.1 Promise.prototype.catch(onRejected)
        'catch': function _catch(onRejected) {
          return this.then(undefined, onRejected);
        }
      });

      OwnPromiseCapability = function OwnPromiseCapability() {
        var promise = new Internal();
        this.promise = promise;
        this.resolve = ctx($resolve, promise, 1);
        this.reject = ctx($reject, promise, 1);
      };

      newPromiseCapabilityModule.f = newPromiseCapability = function newPromiseCapability(C) {
        return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
      };
    }

    $export($export.G + $export.W + $export.F * !USE_NATIVE, {
      Promise: $Promise
    });

    require('./_set-to-string-tag')($Promise, PROMISE);

    require('./_set-species')(PROMISE);

    Wrapper = require('./_core')[PROMISE]; // statics

    $export($export.S + $export.F * !USE_NATIVE, PROMISE, {
      // 25.4.4.5 Promise.reject(r)
      reject: function reject(r) {
        var capability = newPromiseCapability(this);
        var $$reject = capability.reject;
        $$reject(r);
        return capability.promise;
      }
    });
    $export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
      // 25.4.4.6 Promise.resolve(x)
      resolve: function resolve(x) {
        return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
      }
    });
    $export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
      $Promise.all(iter)['catch'](empty);
    })), PROMISE, {
      // 25.4.4.1 Promise.all(iterable)
      all: function all(iterable) {
        var C = this;
        var capability = newPromiseCapability(C);
        var resolve = capability.resolve;
        var reject = capability.reject;
        var result = perform(function () {
          var values = [];
          var index = 0;
          var remaining = 1;
          forOf(iterable, false, function (promise) {
            var $index = index++;
            var alreadyCalled = false;
            values.push(undefined);
            remaining++;
            C.resolve(promise).then(function (value) {
              if (alreadyCalled) return;
              alreadyCalled = true;
              values[$index] = value;
              --remaining || resolve(values);
            }, reject);
          });
          --remaining || resolve(values);
        });
        if (result.e) reject(result.v);
        return capability.promise;
      },
      // 25.4.4.4 Promise.race(iterable)
      race: function race(iterable) {
        var C = this;
        var capability = newPromiseCapability(C);
        var reject = capability.reject;
        var result = perform(function () {
          forOf(iterable, false, function (promise) {
            C.resolve(promise).then(capability.resolve, reject);
          });
        });
        if (result.e) reject(result.v);
        return capability.promise;
      }
    });
  }, {
    "./_library": "../node_modules/core-js/modules/_library.js",
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_ctx": "../node_modules/core-js/modules/_ctx.js",
    "./_classof": "../node_modules/core-js/modules/_classof.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_a-function": "../node_modules/core-js/modules/_a-function.js",
    "./_an-instance": "../node_modules/core-js/modules/_an-instance.js",
    "./_for-of": "../node_modules/core-js/modules/_for-of.js",
    "./_species-constructor": "../node_modules/core-js/modules/_species-constructor.js",
    "./_task": "../node_modules/core-js/modules/_task.js",
    "./_microtask": "../node_modules/core-js/modules/_microtask.js",
    "./_new-promise-capability": "../node_modules/core-js/modules/_new-promise-capability.js",
    "./_perform": "../node_modules/core-js/modules/_perform.js",
    "./_user-agent": "../node_modules/core-js/modules/_user-agent.js",
    "./_promise-resolve": "../node_modules/core-js/modules/_promise-resolve.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_redefine-all": "../node_modules/core-js/modules/_redefine-all.js",
    "./_set-to-string-tag": "../node_modules/core-js/modules/_set-to-string-tag.js",
    "./_set-species": "../node_modules/core-js/modules/_set-species.js",
    "./_core": "../node_modules/core-js/modules/_core.js",
    "./_iter-detect": "../node_modules/core-js/modules/_iter-detect.js"
  }],
  "../node_modules/core-js/modules/es7.promise.finally.js": [function (require, module, exports) {
    // https://github.com/tc39/proposal-promise-finally
    'use strict';

    var $export = require('./_export');

    var core = require('./_core');

    var global = require('./_global');

    var speciesConstructor = require('./_species-constructor');

    var promiseResolve = require('./_promise-resolve');

    $export($export.P + $export.R, 'Promise', {
      'finally': function _finally(onFinally) {
        var C = speciesConstructor(this, core.Promise || global.Promise);
        var isFunction = typeof onFinally == 'function';
        return this.then(isFunction ? function (x) {
          return promiseResolve(C, onFinally()).then(function () {
            return x;
          });
        } : onFinally, isFunction ? function (e) {
          return promiseResolve(C, onFinally()).then(function () {
            throw e;
          });
        } : onFinally);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_core": "../node_modules/core-js/modules/_core.js",
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_species-constructor": "../node_modules/core-js/modules/_species-constructor.js",
    "./_promise-resolve": "../node_modules/core-js/modules/_promise-resolve.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.apply.js": [function (require, module, exports) {
    // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
    var $export = require('./_export');

    var aFunction = require('./_a-function');

    var anObject = require('./_an-object');

    var rApply = (require('./_global').Reflect || {}).apply;
    var fApply = Function.apply; // MS Edge argumentsList argument is optional

    $export($export.S + $export.F * !require('./_fails')(function () {
      rApply(function () {
        /* empty */
      });
    }), 'Reflect', {
      apply: function apply(target, thisArgument, argumentsList) {
        var T = aFunction(target);
        var L = anObject(argumentsList);
        return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_a-function": "../node_modules/core-js/modules/_a-function.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/_bind.js": [function (require, module, exports) {
    'use strict';

    var aFunction = require('./_a-function');

    var isObject = require('./_is-object');

    var invoke = require('./_invoke');

    var arraySlice = [].slice;
    var factories = {};

    var construct = function construct(F, len, args) {
      if (!(len in factories)) {
        for (var n = [], i = 0; i < len; i++) {
          n[i] = 'a[' + i + ']';
        } // eslint-disable-next-line no-new-func


        factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
      }

      return factories[len](F, args);
    };

    module.exports = Function.bind || function bind(that
    /* , ...args */
    ) {
      var fn = aFunction(this);
      var partArgs = arraySlice.call(arguments, 1);

      var bound = function bound() {
        var args = partArgs.concat(arraySlice.call(arguments));
        return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
      };

      if (isObject(fn.prototype)) bound.prototype = fn.prototype;
      return bound;
    };
  }, {
    "./_a-function": "../node_modules/core-js/modules/_a-function.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_invoke": "../node_modules/core-js/modules/_invoke.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.construct.js": [function (require, module, exports) {
    // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
    var $export = require('./_export');

    var create = require('./_object-create');

    var aFunction = require('./_a-function');

    var anObject = require('./_an-object');

    var isObject = require('./_is-object');

    var fails = require('./_fails');

    var bind = require('./_bind');

    var rConstruct = (require('./_global').Reflect || {}).construct; // MS Edge supports only 2 arguments and argumentsList argument is optional
    // FF Nightly sets third argument as `new.target`, but does not create `this` from it

    var NEW_TARGET_BUG = fails(function () {
      function F() {
        /* empty */
      }

      return !(rConstruct(function () {
        /* empty */
      }, [], F) instanceof F);
    });
    var ARGS_BUG = !fails(function () {
      rConstruct(function () {
        /* empty */
      });
    });
    $export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
      construct: function construct(Target, args
      /* , newTarget */
      ) {
        aFunction(Target);
        anObject(args);
        var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
        if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);

        if (Target == newTarget) {
          // w/o altered newTarget, optimization for 0-4 arguments
          switch (args.length) {
            case 0:
              return new Target();

            case 1:
              return new Target(args[0]);

            case 2:
              return new Target(args[0], args[1]);

            case 3:
              return new Target(args[0], args[1], args[2]);

            case 4:
              return new Target(args[0], args[1], args[2], args[3]);
          } // w/o altered newTarget, lot of arguments case


          var $args = [null];
          $args.push.apply($args, args);
          return new (bind.apply(Target, $args))();
        } // with altered newTarget, not support built-in constructors


        var proto = newTarget.prototype;
        var instance = create(isObject(proto) ? proto : Object.prototype);
        var result = Function.apply.call(Target, instance, args);
        return isObject(result) ? result : instance;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_object-create": "../node_modules/core-js/modules/_object-create.js",
    "./_a-function": "../node_modules/core-js/modules/_a-function.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_bind": "../node_modules/core-js/modules/_bind.js",
    "./_global": "../node_modules/core-js/modules/_global.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.define-property.js": [function (require, module, exports) {
    // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
    var dP = require('./_object-dp');

    var $export = require('./_export');

    var anObject = require('./_an-object');

    var toPrimitive = require('./_to-primitive'); // MS Edge has broken Reflect.defineProperty - throwing instead of returning false


    $export($export.S + $export.F * require('./_fails')(function () {
      // eslint-disable-next-line no-undef
      Reflect.defineProperty(dP.f({}, 1, {
        value: 1
      }), 1, {
        value: 2
      });
    }), 'Reflect', {
      defineProperty: function defineProperty(target, propertyKey, attributes) {
        anObject(target);
        propertyKey = toPrimitive(propertyKey, true);
        anObject(attributes);

        try {
          dP.f(target, propertyKey, attributes);
          return true;
        } catch (e) {
          return false;
        }
      }
    });
  }, {
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_to-primitive": "../node_modules/core-js/modules/_to-primitive.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.delete-property.js": [function (require, module, exports) {
    // 26.1.4 Reflect.deleteProperty(target, propertyKey)
    var $export = require('./_export');

    var gOPD = require('./_object-gopd').f;

    var anObject = require('./_an-object');

    $export($export.S, 'Reflect', {
      deleteProperty: function deleteProperty(target, propertyKey) {
        var desc = gOPD(anObject(target), propertyKey);
        return desc && !desc.configurable ? false : delete target[propertyKey];
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.get.js": [function (require, module, exports) {
    // 26.1.6 Reflect.get(target, propertyKey [, receiver])
    var gOPD = require('./_object-gopd');

    var getPrototypeOf = require('./_object-gpo');

    var has = require('./_has');

    var $export = require('./_export');

    var isObject = require('./_is-object');

    var anObject = require('./_an-object');

    function get(target, propertyKey
    /* , receiver */
    ) {
      var receiver = arguments.length < 3 ? target : arguments[2];
      var desc, proto;
      if (anObject(target) === receiver) return target[propertyKey];
      if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value') ? desc.value : desc.get !== undefined ? desc.get.call(receiver) : undefined;
      if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
    }

    $export($export.S, 'Reflect', {
      get: get
    });
  }, {
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_object-gpo": "../node_modules/core-js/modules/_object-gpo.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.get-own-property-descriptor.js": [function (require, module, exports) {
    // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
    var gOPD = require('./_object-gopd');

    var $export = require('./_export');

    var anObject = require('./_an-object');

    $export($export.S, 'Reflect', {
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
        return gOPD.f(anObject(target), propertyKey);
      }
    });
  }, {
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.get-prototype-of.js": [function (require, module, exports) {
    // 26.1.8 Reflect.getPrototypeOf(target)
    var $export = require('./_export');

    var getProto = require('./_object-gpo');

    var anObject = require('./_an-object');

    $export($export.S, 'Reflect', {
      getPrototypeOf: function getPrototypeOf(target) {
        return getProto(anObject(target));
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_object-gpo": "../node_modules/core-js/modules/_object-gpo.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.has.js": [function (require, module, exports) {
    // 26.1.9 Reflect.has(target, propertyKey)
    var $export = require('./_export');

    $export($export.S, 'Reflect', {
      has: function has(target, propertyKey) {
        return propertyKey in target;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.is-extensible.js": [function (require, module, exports) {
    // 26.1.10 Reflect.isExtensible(target)
    var $export = require('./_export');

    var anObject = require('./_an-object');

    var $isExtensible = Object.isExtensible;
    $export($export.S, 'Reflect', {
      isExtensible: function isExtensible(target) {
        anObject(target);
        return $isExtensible ? $isExtensible(target) : true;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.own-keys.js": [function (require, module, exports) {
    // 26.1.11 Reflect.ownKeys(target)
    var $export = require('./_export');

    $export($export.S, 'Reflect', {
      ownKeys: require('./_own-keys')
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_own-keys": "../node_modules/core-js/modules/_own-keys.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.prevent-extensions.js": [function (require, module, exports) {
    // 26.1.12 Reflect.preventExtensions(target)
    var $export = require('./_export');

    var anObject = require('./_an-object');

    var $preventExtensions = Object.preventExtensions;
    $export($export.S, 'Reflect', {
      preventExtensions: function preventExtensions(target) {
        anObject(target);

        try {
          if ($preventExtensions) $preventExtensions(target);
          return true;
        } catch (e) {
          return false;
        }
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.set.js": [function (require, module, exports) {
    // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
    var dP = require('./_object-dp');

    var gOPD = require('./_object-gopd');

    var getPrototypeOf = require('./_object-gpo');

    var has = require('./_has');

    var $export = require('./_export');

    var createDesc = require('./_property-desc');

    var anObject = require('./_an-object');

    var isObject = require('./_is-object');

    function set(target, propertyKey, V
    /* , receiver */
    ) {
      var receiver = arguments.length < 4 ? target : arguments[3];
      var ownDesc = gOPD.f(anObject(target), propertyKey);
      var existingDescriptor, proto;

      if (!ownDesc) {
        if (isObject(proto = getPrototypeOf(target))) {
          return set(proto, propertyKey, V, receiver);
        }

        ownDesc = createDesc(0);
      }

      if (has(ownDesc, 'value')) {
        if (ownDesc.writable === false || !isObject(receiver)) return false;

        if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
          if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
          existingDescriptor.value = V;
          dP.f(receiver, propertyKey, existingDescriptor);
        } else dP.f(receiver, propertyKey, createDesc(0, V));

        return true;
      }

      return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
    }

    $export($export.S, 'Reflect', {
      set: set
    });
  }, {
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_object-gpo": "../node_modules/core-js/modules/_object-gpo.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_property-desc": "../node_modules/core-js/modules/_property-desc.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js"
  }],
  "../node_modules/core-js/modules/es6.reflect.set-prototype-of.js": [function (require, module, exports) {
    // 26.1.14 Reflect.setPrototypeOf(target, proto)
    var $export = require('./_export');

    var setProto = require('./_set-proto');

    if (setProto) $export($export.S, 'Reflect', {
      setPrototypeOf: function setPrototypeOf(target, proto) {
        setProto.check(target, proto);

        try {
          setProto.set(target, proto);
          return true;
        } catch (e) {
          return false;
        }
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_set-proto": "../node_modules/core-js/modules/_set-proto.js"
  }],
  "../node_modules/core-js/modules/_is-regexp.js": [function (require, module, exports) {
    // 7.2.8 IsRegExp(argument)
    var isObject = require('./_is-object');

    var cof = require('./_cof');

    var MATCH = require('./_wks')('match');

    module.exports = function (it) {
      var isRegExp;
      return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
    };
  }, {
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_cof": "../node_modules/core-js/modules/_cof.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/_flags.js": [function (require, module, exports) {
    'use strict'; // 21.2.5.3 get RegExp.prototype.flags

    var anObject = require('./_an-object');

    module.exports = function () {
      var that = anObject(this);
      var result = '';
      if (that.global) result += 'g';
      if (that.ignoreCase) result += 'i';
      if (that.multiline) result += 'm';
      if (that.unicode) result += 'u';
      if (that.sticky) result += 'y';
      return result;
    };
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js"
  }],
  "../node_modules/core-js/modules/es6.regexp.constructor.js": [function (require, module, exports) {
    var global = require('./_global');

    var inheritIfRequired = require('./_inherit-if-required');

    var dP = require('./_object-dp').f;

    var gOPN = require('./_object-gopn').f;

    var isRegExp = require('./_is-regexp');

    var $flags = require('./_flags');

    var $RegExp = global.RegExp;
    var Base = $RegExp;
    var proto = $RegExp.prototype;
    var re1 = /a/g;
    var re2 = /a/g; // "new" creates a new object, old webkit buggy here

    var CORRECT_NEW = new $RegExp(re1) !== re1;

    if (require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function () {
      re2[require('./_wks')('match')] = false; // RegExp constructor can alter flags and IsRegExp works correct with @@match

      return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
    }))) {
      $RegExp = function RegExp(p, f) {
        var tiRE = this instanceof $RegExp;
        var piRE = isRegExp(p);
        var fiU = f === undefined;
        return !tiRE && piRE && p.constructor === $RegExp && fiU ? p : inheritIfRequired(CORRECT_NEW ? new Base(piRE && !fiU ? p.source : p, f) : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f), tiRE ? this : proto, $RegExp);
      };

      var proxy = function proxy(key) {
        key in $RegExp || dP($RegExp, key, {
          configurable: true,
          get: function get() {
            return Base[key];
          },
          set: function set(it) {
            Base[key] = it;
          }
        });
      };

      for (var keys = gOPN(Base), i = 0; keys.length > i;) {
        proxy(keys[i++]);
      }

      proto.constructor = $RegExp;
      $RegExp.prototype = proto;

      require('./_redefine')(global, 'RegExp', $RegExp);
    }

    require('./_set-species')('RegExp');
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_inherit-if-required": "../node_modules/core-js/modules/_inherit-if-required.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_object-gopn": "../node_modules/core-js/modules/_object-gopn.js",
    "./_is-regexp": "../node_modules/core-js/modules/_is-regexp.js",
    "./_flags": "../node_modules/core-js/modules/_flags.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js",
    "./_set-species": "../node_modules/core-js/modules/_set-species.js"
  }],
  "../node_modules/core-js/modules/es6.regexp.flags.js": [function (require, module, exports) {
    // 21.2.5.3 get RegExp.prototype.flags()
    if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
      configurable: true,
      get: require('./_flags')
    });
  }, {
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_flags": "../node_modules/core-js/modules/_flags.js"
  }],
  "../node_modules/core-js/modules/_string-at.js": [function (require, module, exports) {
    var toInteger = require('./_to-integer');

    var defined = require('./_defined'); // true  -> String#at
    // false -> String#codePointAt


    module.exports = function (TO_STRING) {
      return function (that, pos) {
        var s = String(defined(that));
        var i = toInteger(pos);
        var l = s.length;
        var a, b;
        if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
        a = s.charCodeAt(i);
        return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
      };
    };
  }, {
    "./_to-integer": "../node_modules/core-js/modules/_to-integer.js",
    "./_defined": "../node_modules/core-js/modules/_defined.js"
  }],
  "../node_modules/core-js/modules/_advance-string-index.js": [function (require, module, exports) {
    'use strict';

    var at = require('./_string-at')(true); // `AdvanceStringIndex` abstract operation
    // https://tc39.github.io/ecma262/#sec-advancestringindex


    module.exports = function (S, index, unicode) {
      return index + (unicode ? at(S, index).length : 1);
    };
  }, {
    "./_string-at": "../node_modules/core-js/modules/_string-at.js"
  }],
  "../node_modules/core-js/modules/_regexp-exec-abstract.js": [function (require, module, exports) {
    'use strict';

    var classof = require('./_classof');

    var builtinExec = RegExp.prototype.exec; // `RegExpExec` abstract operation
    // https://tc39.github.io/ecma262/#sec-regexpexec

    module.exports = function (R, S) {
      var exec = R.exec;

      if (typeof exec === 'function') {
        var result = exec.call(R, S);

        if (_typeof2(result) !== 'object') {
          throw new TypeError('RegExp exec method returned something other than an Object or null');
        }

        return result;
      }

      if (classof(R) !== 'RegExp') {
        throw new TypeError('RegExp#exec called on incompatible receiver');
      }

      return builtinExec.call(R, S);
    };
  }, {
    "./_classof": "../node_modules/core-js/modules/_classof.js"
  }],
  "../node_modules/core-js/modules/_regexp-exec.js": [function (require, module, exports) {
    'use strict';

    var regexpFlags = require('./_flags');

    var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
    // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
    // which loads this file before patching the method.

    var nativeReplace = String.prototype.replace;
    var patchedExec = nativeExec;
    var LAST_INDEX = 'lastIndex';

    var UPDATES_LAST_INDEX_WRONG = function () {
      var re1 = /a/,
          re2 = /b*/g;
      nativeExec.call(re1, 'a');
      nativeExec.call(re2, 'a');
      return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
    }(); // nonparticipating capturing group, copied from es5-shim's String#split patch.


    var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
    var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

    if (PATCH) {
      patchedExec = function exec(str) {
        var re = this;
        var lastIndex, reCopy, match, i;

        if (NPCG_INCLUDED) {
          reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
        }

        if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];
        match = nativeExec.call(re, str);

        if (UPDATES_LAST_INDEX_WRONG && match) {
          re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
        }

        if (NPCG_INCLUDED && match && match.length > 1) {
          // Fix browsers whose `exec` methods don't consistently return `undefined`
          // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
          // eslint-disable-next-line no-loop-func
          nativeReplace.call(match[0], reCopy, function () {
            for (i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
        }

        return match;
      };
    }

    module.exports = patchedExec;
  }, {
    "./_flags": "../node_modules/core-js/modules/_flags.js"
  }],
  "../node_modules/core-js/modules/es6.regexp.exec.js": [function (require, module, exports) {
    'use strict';

    var regexpExec = require('./_regexp-exec');

    require('./_export')({
      target: 'RegExp',
      proto: true,
      forced: regexpExec !== /./.exec
    }, {
      exec: regexpExec
    });
  }, {
    "./_regexp-exec": "../node_modules/core-js/modules/_regexp-exec.js",
    "./_export": "../node_modules/core-js/modules/_export.js"
  }],
  "../node_modules/core-js/modules/_fix-re-wks.js": [function (require, module, exports) {
    'use strict';

    require('./es6.regexp.exec');

    var redefine = require('./_redefine');

    var hide = require('./_hide');

    var fails = require('./_fails');

    var defined = require('./_defined');

    var wks = require('./_wks');

    var regexpExec = require('./_regexp-exec');

    var SPECIES = wks('species');
    var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
      // #replace needs built-in support for named groups.
      // #match works fine because it just return the exec results, even if it has
      // a "grops" property.
      var re = /./;

      re.exec = function () {
        var result = [];
        result.groups = {
          a: '7'
        };
        return result;
      };

      return ''.replace(re, '$<a>') !== '7';
    });

    var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = function () {
      // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
      var re = /(?:)/;
      var originalExec = re.exec;

      re.exec = function () {
        return originalExec.apply(this, arguments);
      };

      var result = 'ab'.split(re);
      return result.length === 2 && result[0] === 'a' && result[1] === 'b';
    }();

    module.exports = function (KEY, length, exec) {
      var SYMBOL = wks(KEY);
      var DELEGATES_TO_SYMBOL = !fails(function () {
        // String methods call symbol-named RegEp methods
        var O = {};

        O[SYMBOL] = function () {
          return 7;
        };

        return ''[KEY](O) != 7;
      });
      var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
        // Symbol-named RegExp methods call .exec
        var execCalled = false;
        var re = /a/;

        re.exec = function () {
          execCalled = true;
          return null;
        };

        if (KEY === 'split') {
          // RegExp[@@split] doesn't call the regex's exec method, but first creates
          // a new one. We need to return the patched regex when creating the new one.
          re.constructor = {};

          re.constructor[SPECIES] = function () {
            return re;
          };
        }

        re[SYMBOL]('');
        return !execCalled;
      }) : undefined;

      if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
        var nativeRegExpMethod = /./[SYMBOL];
        var fns = exec(defined, SYMBOL, ''[KEY], function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
          if (regexp.exec === regexpExec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return {
                done: true,
                value: nativeRegExpMethod.call(regexp, str, arg2)
              };
            }

            return {
              done: true,
              value: nativeMethod.call(str, regexp, arg2)
            };
          }

          return {
            done: false
          };
        });
        var strfn = fns[0];
        var rxfn = fns[1];
        redefine(String.prototype, KEY, strfn);
        hide(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) {
          return rxfn.call(string, this, arg);
        } // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) {
          return rxfn.call(string, this);
        });
      }
    };
  }, {
    "./es6.regexp.exec": "../node_modules/core-js/modules/es6.regexp.exec.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_defined": "../node_modules/core-js/modules/_defined.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_regexp-exec": "../node_modules/core-js/modules/_regexp-exec.js"
  }],
  "../node_modules/core-js/modules/es6.regexp.match.js": [function (require, module, exports) {
    'use strict';

    var anObject = require('./_an-object');

    var toLength = require('./_to-length');

    var advanceStringIndex = require('./_advance-string-index');

    var regExpExec = require('./_regexp-exec-abstract'); // @@match logic


    require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match, maybeCallNative) {
      return [// `String.prototype.match` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = defined(this);
        var fn = regexp == undefined ? undefined : regexp[MATCH];
        return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
      }, // `RegExp.prototype[@@match]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
      function (regexp) {
        var res = maybeCallNative($match, regexp, this);
        if (res.done) return res.value;
        var rx = anObject(regexp);
        var S = String(this);
        if (!rx.global) return regExpExec(rx, S);
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;

        while ((result = regExpExec(rx, S)) !== null) {
          var matchStr = String(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
          n++;
        }

        return n === 0 ? null : A;
      }];
    });
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_advance-string-index": "../node_modules/core-js/modules/_advance-string-index.js",
    "./_regexp-exec-abstract": "../node_modules/core-js/modules/_regexp-exec-abstract.js",
    "./_fix-re-wks": "../node_modules/core-js/modules/_fix-re-wks.js"
  }],
  "../node_modules/core-js/modules/es6.regexp.replace.js": [function (require, module, exports) {
    var global = arguments[3];
    'use strict';

    var anObject = require('./_an-object');

    var toObject = require('./_to-object');

    var toLength = require('./_to-length');

    var toInteger = require('./_to-integer');

    var advanceStringIndex = require('./_advance-string-index');

    var regExpExec = require('./_regexp-exec-abstract');

    var max = Math.max;
    var min = Math.min;
    var floor = Math.floor;
    var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
    var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

    var maybeToString = function maybeToString(it) {
      return it === undefined ? it : String(it);
    }; // @@replace logic


    require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
      return [// `String.prototype.replace` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = defined(this);
        var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
        return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
      }, // `RegExp.prototype[@@replace]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        var res = maybeCallNative($replace, regexp, this, replaceValue);
        if (res.done) return res.value;
        var rx = anObject(regexp);
        var S = String(this);
        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);
        var global = rx.global;

        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }

        var results = [];

        while (true) {
          var result = regExpExec(rx, S);
          if (result === null) break;
          results.push(result);
          if (!global) break;
          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        }

        var accumulatedResult = '';
        var nextSourcePosition = 0;

        for (var i = 0; i < results.length; i++) {
          result = results[i];
          var matched = String(result[0]);
          var position = max(min(toInteger(result.index), S.length), 0);
          var captures = []; // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

          for (var j = 1; j < result.length; j++) {
            captures.push(maybeToString(result[j]));
          }

          var namedCaptures = result.groups;

          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }

          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }

        return accumulatedResult + S.slice(nextSourcePosition);
      }]; // https://tc39.github.io/ecma262/#sec-getsubstitution

      function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
        var tailPos = position + matched.length;
        var m = captures.length;
        var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

        if (namedCaptures !== undefined) {
          namedCaptures = toObject(namedCaptures);
          symbols = SUBSTITUTION_SYMBOLS;
        }

        return $replace.call(replacement, symbols, function (match, ch) {
          var capture;

          switch (ch.charAt(0)) {
            case '$':
              return '$';

            case '&':
              return matched;

            case '`':
              return str.slice(0, position);

            case "'":
              return str.slice(tailPos);

            case '<':
              capture = namedCaptures[ch.slice(1, -1)];
              break;

            default:
              // \d\d?
              var n = +ch;
              if (n === 0) return match;

              if (n > m) {
                var f = floor(n / 10);
                if (f === 0) return match;
                if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                return match;
              }

              capture = captures[n - 1];
          }

          return capture === undefined ? '' : capture;
        });
      }
    });
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_to-integer": "../node_modules/core-js/modules/_to-integer.js",
    "./_advance-string-index": "../node_modules/core-js/modules/_advance-string-index.js",
    "./_regexp-exec-abstract": "../node_modules/core-js/modules/_regexp-exec-abstract.js",
    "./_fix-re-wks": "../node_modules/core-js/modules/_fix-re-wks.js"
  }],
  "../node_modules/core-js/modules/es6.regexp.split.js": [function (require, module, exports) {
    'use strict';

    var isRegExp = require('./_is-regexp');

    var anObject = require('./_an-object');

    var speciesConstructor = require('./_species-constructor');

    var advanceStringIndex = require('./_advance-string-index');

    var toLength = require('./_to-length');

    var callRegExpExec = require('./_regexp-exec-abstract');

    var regexpExec = require('./_regexp-exec');

    var fails = require('./_fails');

    var $min = Math.min;
    var $push = [].push;
    var $SPLIT = 'split';
    var LENGTH = 'length';
    var LAST_INDEX = 'lastIndex';
    var MAX_UINT32 = 0xffffffff; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

    var SUPPORTS_Y = !fails(function () {
      RegExp(MAX_UINT32, 'y');
    }); // @@split logic

    require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
      var internalSplit;

      if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
        // based on es5-shim implementation, need to rework it
        internalSplit = function internalSplit(separator, limit) {
          var string = String(this);
          if (separator === undefined && limit === 0) return []; // If `separator` is not a regex, use native split

          if (!isRegExp(separator)) return $split.call(string, separator, limit);
          var output = [];
          var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
          var lastLastIndex = 0;
          var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0; // Make `global` and avoid `lastIndex` issues by working with a copy

          var separatorCopy = new RegExp(separator.source, flags + 'g');
          var match, lastIndex, lastLength;

          while (match = regexpExec.call(separatorCopy, string)) {
            lastIndex = separatorCopy[LAST_INDEX];

            if (lastIndex > lastLastIndex) {
              output.push(string.slice(lastLastIndex, match.index));
              if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
              lastLength = match[0][LENGTH];
              lastLastIndex = lastIndex;
              if (output[LENGTH] >= splitLimit) break;
            }

            if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
          }

          if (lastLastIndex === string[LENGTH]) {
            if (lastLength || !separatorCopy.test('')) output.push('');
          } else output.push(string.slice(lastLastIndex));

          return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
        }; // Chakra, V8

      } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
        internalSplit = function internalSplit(separator, limit) {
          return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
        };
      } else {
        internalSplit = $split;
      }

      return [// `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = defined(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
      }, // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
        if (res.done) return res.value;
        var rx = anObject(regexp);
        var S = String(this);
        var C = speciesConstructor(rx, RegExp);
        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.

        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];

        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;

          if (z === null || (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
            q = advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;

            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }

            q = p = e;
          }
        }

        A.push(S.slice(p));
        return A;
      }];
    });
  }, {
    "./_is-regexp": "../node_modules/core-js/modules/_is-regexp.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_species-constructor": "../node_modules/core-js/modules/_species-constructor.js",
    "./_advance-string-index": "../node_modules/core-js/modules/_advance-string-index.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_regexp-exec-abstract": "../node_modules/core-js/modules/_regexp-exec-abstract.js",
    "./_regexp-exec": "../node_modules/core-js/modules/_regexp-exec.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_fix-re-wks": "../node_modules/core-js/modules/_fix-re-wks.js"
  }],
  "../node_modules/core-js/modules/es6.regexp.search.js": [function (require, module, exports) {
    'use strict';

    var anObject = require('./_an-object');

    var sameValue = require('./_same-value');

    var regExpExec = require('./_regexp-exec-abstract'); // @@search logic


    require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
      return [// `String.prototype.search` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.search
      function search(regexp) {
        var O = defined(this);
        var fn = regexp == undefined ? undefined : regexp[SEARCH];
        return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
      }, // `RegExp.prototype[@@search]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
      function (regexp) {
        var res = maybeCallNative($search, regexp, this);
        if (res.done) return res.value;
        var rx = anObject(regexp);
        var S = String(this);
        var previousLastIndex = rx.lastIndex;
        if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
        var result = regExpExec(rx, S);
        if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
        return result === null ? -1 : result.index;
      }];
    });
  }, {
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_same-value": "../node_modules/core-js/modules/_same-value.js",
    "./_regexp-exec-abstract": "../node_modules/core-js/modules/_regexp-exec-abstract.js",
    "./_fix-re-wks": "../node_modules/core-js/modules/_fix-re-wks.js"
  }],
  "../node_modules/core-js/modules/es6.regexp.to-string.js": [function (require, module, exports) {
    'use strict';

    require('./es6.regexp.flags');

    var anObject = require('./_an-object');

    var $flags = require('./_flags');

    var DESCRIPTORS = require('./_descriptors');

    var TO_STRING = 'toString';
    var $toString = /./[TO_STRING];

    var define = function define(fn) {
      require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
    }; // 21.2.5.14 RegExp.prototype.toString()


    if (require('./_fails')(function () {
      return $toString.call({
        source: 'a',
        flags: 'b'
      }) != '/a/b';
    })) {
      define(function toString() {
        var R = anObject(this);
        return '/'.concat(R.source, '/', 'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
      }); // FF44- RegExp#toString has a wrong name
    } else if ($toString.name != TO_STRING) {
      define(function toString() {
        return $toString.call(this);
      });
    }
  }, {
    "./es6.regexp.flags": "../node_modules/core-js/modules/es6.regexp.flags.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_flags": "../node_modules/core-js/modules/_flags.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js"
  }],
  "../node_modules/core-js/modules/es6.set.js": [function (require, module, exports) {
    'use strict';

    var strong = require('./_collection-strong');

    var validate = require('./_validate-collection');

    var SET = 'Set'; // 23.2 Set Objects

    module.exports = require('./_collection')(SET, function (get) {
      return function Set() {
        return get(this, arguments.length > 0 ? arguments[0] : undefined);
      };
    }, {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
      }
    }, strong);
  }, {
    "./_collection-strong": "../node_modules/core-js/modules/_collection-strong.js",
    "./_validate-collection": "../node_modules/core-js/modules/_validate-collection.js",
    "./_collection": "../node_modules/core-js/modules/_collection.js"
  }],
  "../node_modules/core-js/modules/_wks-ext.js": [function (require, module, exports) {
    exports.f = require('./_wks');
  }, {
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/_wks-define.js": [function (require, module, exports) {
    var global = require('./_global');

    var core = require('./_core');

    var LIBRARY = require('./_library');

    var wksExt = require('./_wks-ext');

    var defineProperty = require('./_object-dp').f;

    module.exports = function (name) {
      var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
      if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, {
        value: wksExt.f(name)
      });
    };
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_core": "../node_modules/core-js/modules/_core.js",
    "./_library": "../node_modules/core-js/modules/_library.js",
    "./_wks-ext": "../node_modules/core-js/modules/_wks-ext.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js"
  }],
  "../node_modules/core-js/modules/_enum-keys.js": [function (require, module, exports) {
    // all enumerable object keys, includes symbols
    var getKeys = require('./_object-keys');

    var gOPS = require('./_object-gops');

    var pIE = require('./_object-pie');

    module.exports = function (it) {
      var result = getKeys(it);
      var getSymbols = gOPS.f;

      if (getSymbols) {
        var symbols = getSymbols(it);
        var isEnum = pIE.f;
        var i = 0;
        var key;

        while (symbols.length > i) {
          if (isEnum.call(it, key = symbols[i++])) result.push(key);
        }
      }

      return result;
    };
  }, {
    "./_object-keys": "../node_modules/core-js/modules/_object-keys.js",
    "./_object-gops": "../node_modules/core-js/modules/_object-gops.js",
    "./_object-pie": "../node_modules/core-js/modules/_object-pie.js"
  }],
  "../node_modules/core-js/modules/es6.symbol.js": [function (require, module, exports) {
    'use strict'; // ECMAScript 6 symbols shim

    var global = require('./_global');

    var has = require('./_has');

    var DESCRIPTORS = require('./_descriptors');

    var $export = require('./_export');

    var redefine = require('./_redefine');

    var META = require('./_meta').KEY;

    var $fails = require('./_fails');

    var shared = require('./_shared');

    var setToStringTag = require('./_set-to-string-tag');

    var uid = require('./_uid');

    var wks = require('./_wks');

    var wksExt = require('./_wks-ext');

    var wksDefine = require('./_wks-define');

    var enumKeys = require('./_enum-keys');

    var isArray = require('./_is-array');

    var anObject = require('./_an-object');

    var isObject = require('./_is-object');

    var toObject = require('./_to-object');

    var toIObject = require('./_to-iobject');

    var toPrimitive = require('./_to-primitive');

    var createDesc = require('./_property-desc');

    var _create = require('./_object-create');

    var gOPNExt = require('./_object-gopn-ext');

    var $GOPD = require('./_object-gopd');

    var $GOPS = require('./_object-gops');

    var $DP = require('./_object-dp');

    var $keys = require('./_object-keys');

    var gOPD = $GOPD.f;
    var dP = $DP.f;
    var gOPN = gOPNExt.f;
    var $Symbol = global.Symbol;
    var $JSON = global.JSON;

    var _stringify = $JSON && $JSON.stringify;

    var PROTOTYPE = 'prototype';
    var HIDDEN = wks('_hidden');
    var TO_PRIMITIVE = wks('toPrimitive');
    var isEnum = {}.propertyIsEnumerable;
    var SymbolRegistry = shared('symbol-registry');
    var AllSymbols = shared('symbols');
    var OPSymbols = shared('op-symbols');
    var ObjectProto = Object[PROTOTYPE];
    var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
    var QObject = global.QObject; // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

    var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild; // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

    var setSymbolDesc = DESCRIPTORS && $fails(function () {
      return _create(dP({}, 'a', {
        get: function get() {
          return dP(this, 'a', {
            value: 7
          }).a;
        }
      })).a != 7;
    }) ? function (it, key, D) {
      var protoDesc = gOPD(ObjectProto, key);
      if (protoDesc) delete ObjectProto[key];
      dP(it, key, D);
      if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
    } : dP;

    var wrap = function wrap(tag) {
      var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);

      sym._k = tag;
      return sym;
    };

    var isSymbol = USE_NATIVE && _typeof2($Symbol.iterator) == 'symbol' ? function (it) {
      return _typeof2(it) == 'symbol';
    } : function (it) {
      return it instanceof $Symbol;
    };

    var $defineProperty = function defineProperty(it, key, D) {
      if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
      anObject(it);
      key = toPrimitive(key, true);
      anObject(D);

      if (has(AllSymbols, key)) {
        if (!D.enumerable) {
          if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
          it[HIDDEN][key] = true;
        } else {
          if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
          D = _create(D, {
            enumerable: createDesc(0, false)
          });
        }

        return setSymbolDesc(it, key, D);
      }

      return dP(it, key, D);
    };

    var $defineProperties = function defineProperties(it, P) {
      anObject(it);
      var keys = enumKeys(P = toIObject(P));
      var i = 0;
      var l = keys.length;
      var key;

      while (l > i) {
        $defineProperty(it, key = keys[i++], P[key]);
      }

      return it;
    };

    var $create = function create(it, P) {
      return P === undefined ? _create(it) : $defineProperties(_create(it), P);
    };

    var $propertyIsEnumerable = function propertyIsEnumerable(key) {
      var E = isEnum.call(this, key = toPrimitive(key, true));
      if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
      return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
    };

    var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
      it = toIObject(it);
      key = toPrimitive(key, true);
      if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
      var D = gOPD(it, key);
      if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
      return D;
    };

    var $getOwnPropertyNames = function getOwnPropertyNames(it) {
      var names = gOPN(toIObject(it));
      var result = [];
      var i = 0;
      var key;

      while (names.length > i) {
        if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
      }

      return result;
    };

    var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
      var IS_OP = it === ObjectProto;
      var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
      var result = [];
      var i = 0;
      var key;

      while (names.length > i) {
        if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
      }

      return result;
    }; // 19.4.1.1 Symbol([description])


    if (!USE_NATIVE) {
      $Symbol = function _Symbol2() {
        if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
        var tag = uid(arguments.length > 0 ? arguments[0] : undefined);

        var $set = function $set(value) {
          if (this === ObjectProto) $set.call(OPSymbols, value);
          if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
          setSymbolDesc(this, tag, createDesc(1, value));
        };

        if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, {
          configurable: true,
          set: $set
        });
        return wrap(tag);
      };

      redefine($Symbol[PROTOTYPE], 'toString', function toString() {
        return this._k;
      });
      $GOPD.f = $getOwnPropertyDescriptor;
      $DP.f = $defineProperty;
      require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
      require('./_object-pie').f = $propertyIsEnumerable;
      $GOPS.f = $getOwnPropertySymbols;

      if (DESCRIPTORS && !require('./_library')) {
        redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
      }

      wksExt.f = function (name) {
        return wrap(wks(name));
      };
    }

    $export($export.G + $export.W + $export.F * !USE_NATIVE, {
      Symbol: $Symbol
    });

    for (var es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
      wks(es6Symbols[j++]);
    }

    for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) {
      wksDefine(wellKnownSymbols[k++]);
    }

    $export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
      // 19.4.2.1 Symbol.for(key)
      'for': function _for(key) {
        return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
      },
      // 19.4.2.5 Symbol.keyFor(sym)
      keyFor: function keyFor(sym) {
        if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');

        for (var key in SymbolRegistry) {
          if (SymbolRegistry[key] === sym) return key;
        }
      },
      useSetter: function useSetter() {
        setter = true;
      },
      useSimple: function useSimple() {
        setter = false;
      }
    });
    $export($export.S + $export.F * !USE_NATIVE, 'Object', {
      // 19.1.2.2 Object.create(O [, Properties])
      create: $create,
      // 19.1.2.4 Object.defineProperty(O, P, Attributes)
      defineProperty: $defineProperty,
      // 19.1.2.3 Object.defineProperties(O, Properties)
      defineProperties: $defineProperties,
      // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
      getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
      // 19.1.2.7 Object.getOwnPropertyNames(O)
      getOwnPropertyNames: $getOwnPropertyNames,
      // 19.1.2.8 Object.getOwnPropertySymbols(O)
      getOwnPropertySymbols: $getOwnPropertySymbols
    }); // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
    // https://bugs.chromium.org/p/v8/issues/detail?id=3443

    var FAILS_ON_PRIMITIVES = $fails(function () {
      $GOPS.f(1);
    });
    $export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
      getOwnPropertySymbols: function getOwnPropertySymbols(it) {
        return $GOPS.f(toObject(it));
      }
    }); // 24.3.2 JSON.stringify(value [, replacer [, space]])

    $JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
      var S = $Symbol(); // MS Edge converts symbol values to JSON as {}
      // WebKit converts symbol values to JSON as null
      // V8 throws on boxed symbols

      return _stringify([S]) != '[null]' || _stringify({
        a: S
      }) != '{}' || _stringify(Object(S)) != '{}';
    })), 'JSON', {
      stringify: function stringify(it) {
        var args = [it];
        var i = 1;
        var replacer, $replacer;

        while (arguments.length > i) {
          args.push(arguments[i++]);
        }

        $replacer = replacer = args[1];
        if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

        if (!isArray(replacer)) replacer = function replacer(key, value) {
          if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
          if (!isSymbol(value)) return value;
        };
        args[1] = replacer;
        return _stringify.apply($JSON, args);
      }
    }); // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)

    $Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf); // 19.4.3.5 Symbol.prototype[@@toStringTag]

    setToStringTag($Symbol, 'Symbol'); // 20.2.1.9 Math[@@toStringTag]

    setToStringTag(Math, 'Math', true); // 24.3.3 JSON[@@toStringTag]

    setToStringTag(global.JSON, 'JSON', true);
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js",
    "./_meta": "../node_modules/core-js/modules/_meta.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_shared": "../node_modules/core-js/modules/_shared.js",
    "./_set-to-string-tag": "../node_modules/core-js/modules/_set-to-string-tag.js",
    "./_uid": "../node_modules/core-js/modules/_uid.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_wks-ext": "../node_modules/core-js/modules/_wks-ext.js",
    "./_wks-define": "../node_modules/core-js/modules/_wks-define.js",
    "./_enum-keys": "../node_modules/core-js/modules/_enum-keys.js",
    "./_is-array": "../node_modules/core-js/modules/_is-array.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_to-primitive": "../node_modules/core-js/modules/_to-primitive.js",
    "./_property-desc": "../node_modules/core-js/modules/_property-desc.js",
    "./_object-create": "../node_modules/core-js/modules/_object-create.js",
    "./_object-gopn-ext": "../node_modules/core-js/modules/_object-gopn-ext.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js",
    "./_object-gops": "../node_modules/core-js/modules/_object-gops.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_object-keys": "../node_modules/core-js/modules/_object-keys.js",
    "./_object-gopn": "../node_modules/core-js/modules/_object-gopn.js",
    "./_object-pie": "../node_modules/core-js/modules/_object-pie.js",
    "./_library": "../node_modules/core-js/modules/_library.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js"
  }],
  "../node_modules/core-js/modules/es7.symbol.async-iterator.js": [function (require, module, exports) {
    require('./_wks-define')('asyncIterator');
  }, {
    "./_wks-define": "../node_modules/core-js/modules/_wks-define.js"
  }],
  "../node_modules/core-js/modules/_string-html.js": [function (require, module, exports) {
    var $export = require('./_export');

    var fails = require('./_fails');

    var defined = require('./_defined');

    var quot = /"/g; // B.2.3.2.1 CreateHTML(string, tag, attribute, value)

    var createHTML = function createHTML(string, tag, attribute, value) {
      var S = String(defined(string));
      var p1 = '<' + tag;
      if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
      return p1 + '>' + S + '</' + tag + '>';
    };

    module.exports = function (NAME, exec) {
      var O = {};
      O[NAME] = exec(createHTML);
      $export($export.P + $export.F * fails(function () {
        var test = ''[NAME]('"');
        return test !== test.toLowerCase() || test.split('"').length > 3;
      }), 'String', O);
    };
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_defined": "../node_modules/core-js/modules/_defined.js"
  }],
  "../node_modules/core-js/modules/es6.string.anchor.js": [function (require, module, exports) {
    'use strict'; // B.2.3.2 String.prototype.anchor(name)

    require('./_string-html')('anchor', function (createHTML) {
      return function anchor(name) {
        return createHTML(this, 'a', 'name', name);
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.big.js": [function (require, module, exports) {
    'use strict'; // B.2.3.3 String.prototype.big()

    require('./_string-html')('big', function (createHTML) {
      return function big() {
        return createHTML(this, 'big', '', '');
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.blink.js": [function (require, module, exports) {
    'use strict'; // B.2.3.4 String.prototype.blink()

    require('./_string-html')('blink', function (createHTML) {
      return function blink() {
        return createHTML(this, 'blink', '', '');
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.bold.js": [function (require, module, exports) {
    'use strict'; // B.2.3.5 String.prototype.bold()

    require('./_string-html')('bold', function (createHTML) {
      return function bold() {
        return createHTML(this, 'b', '', '');
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.code-point-at.js": [function (require, module, exports) {
    'use strict';

    var $export = require('./_export');

    var $at = require('./_string-at')(false);

    $export($export.P, 'String', {
      // 21.1.3.3 String.prototype.codePointAt(pos)
      codePointAt: function codePointAt(pos) {
        return $at(this, pos);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_string-at": "../node_modules/core-js/modules/_string-at.js"
  }],
  "../node_modules/core-js/modules/_string-context.js": [function (require, module, exports) {
    // helper for String#{startsWith, endsWith, includes}
    var isRegExp = require('./_is-regexp');

    var defined = require('./_defined');

    module.exports = function (that, searchString, NAME) {
      if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
      return String(defined(that));
    };
  }, {
    "./_is-regexp": "../node_modules/core-js/modules/_is-regexp.js",
    "./_defined": "../node_modules/core-js/modules/_defined.js"
  }],
  "../node_modules/core-js/modules/_fails-is-regexp.js": [function (require, module, exports) {
    var MATCH = require('./_wks')('match');

    module.exports = function (KEY) {
      var re = /./;

      try {
        '/./'[KEY](re);
      } catch (e) {
        try {
          re[MATCH] = false;
          return !'/./'[KEY](re);
        } catch (f) {
          /* empty */
        }
      }

      return true;
    };
  }, {
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/core-js/modules/es6.string.ends-with.js": [function (require, module, exports) {
    // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
    'use strict';

    var $export = require('./_export');

    var toLength = require('./_to-length');

    var context = require('./_string-context');

    var ENDS_WITH = 'endsWith';
    var $endsWith = ''[ENDS_WITH];
    $export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
      endsWith: function endsWith(searchString
      /* , endPosition = @length */
      ) {
        var that = context(this, searchString, ENDS_WITH);
        var endPosition = arguments.length > 1 ? arguments[1] : undefined;
        var len = toLength(that.length);
        var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
        var search = String(searchString);
        return $endsWith ? $endsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_string-context": "../node_modules/core-js/modules/_string-context.js",
    "./_fails-is-regexp": "../node_modules/core-js/modules/_fails-is-regexp.js"
  }],
  "../node_modules/core-js/modules/es6.string.fixed.js": [function (require, module, exports) {
    'use strict'; // B.2.3.6 String.prototype.fixed()

    require('./_string-html')('fixed', function (createHTML) {
      return function fixed() {
        return createHTML(this, 'tt', '', '');
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.fontcolor.js": [function (require, module, exports) {
    'use strict'; // B.2.3.7 String.prototype.fontcolor(color)

    require('./_string-html')('fontcolor', function (createHTML) {
      return function fontcolor(color) {
        return createHTML(this, 'font', 'color', color);
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.fontsize.js": [function (require, module, exports) {
    'use strict'; // B.2.3.8 String.prototype.fontsize(size)

    require('./_string-html')('fontsize', function (createHTML) {
      return function fontsize(size) {
        return createHTML(this, 'font', 'size', size);
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.from-code-point.js": [function (require, module, exports) {
    var $export = require('./_export');

    var toAbsoluteIndex = require('./_to-absolute-index');

    var fromCharCode = String.fromCharCode;
    var $fromCodePoint = String.fromCodePoint; // length should be 1, old FF problem

    $export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
      // 21.1.2.2 String.fromCodePoint(...codePoints)
      fromCodePoint: function fromCodePoint(x) {
        // eslint-disable-line no-unused-vars
        var res = [];
        var aLen = arguments.length;
        var i = 0;
        var code;

        while (aLen > i) {
          code = +arguments[i++];
          if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
          res.push(code < 0x10000 ? fromCharCode(code) : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00));
        }

        return res.join('');
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_to-absolute-index": "../node_modules/core-js/modules/_to-absolute-index.js"
  }],
  "../node_modules/core-js/modules/es6.string.includes.js": [function (require, module, exports) {
    // 21.1.3.7 String.prototype.includes(searchString, position = 0)
    'use strict';

    var $export = require('./_export');

    var context = require('./_string-context');

    var INCLUDES = 'includes';
    $export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
      includes: function includes(searchString
      /* , position = 0 */
      ) {
        return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_string-context": "../node_modules/core-js/modules/_string-context.js",
    "./_fails-is-regexp": "../node_modules/core-js/modules/_fails-is-regexp.js"
  }],
  "../node_modules/core-js/modules/es6.string.italics.js": [function (require, module, exports) {
    'use strict'; // B.2.3.9 String.prototype.italics()

    require('./_string-html')('italics', function (createHTML) {
      return function italics() {
        return createHTML(this, 'i', '', '');
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.iterator.js": [function (require, module, exports) {
    'use strict';

    var $at = require('./_string-at')(true); // 21.1.3.27 String.prototype[@@iterator]()


    require('./_iter-define')(String, 'String', function (iterated) {
      this._t = String(iterated); // target

      this._i = 0; // next index
      // 21.1.5.2.1 %StringIteratorPrototype%.next()
    }, function () {
      var O = this._t;
      var index = this._i;
      var point;
      if (index >= O.length) return {
        value: undefined,
        done: true
      };
      point = $at(O, index);
      this._i += point.length;
      return {
        value: point,
        done: false
      };
    });
  }, {
    "./_string-at": "../node_modules/core-js/modules/_string-at.js",
    "./_iter-define": "../node_modules/core-js/modules/_iter-define.js"
  }],
  "../node_modules/core-js/modules/es6.string.link.js": [function (require, module, exports) {
    'use strict'; // B.2.3.10 String.prototype.link(url)

    require('./_string-html')('link', function (createHTML) {
      return function link(url) {
        return createHTML(this, 'a', 'href', url);
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/_string-repeat.js": [function (require, module, exports) {
    'use strict';

    var toInteger = require('./_to-integer');

    var defined = require('./_defined');

    module.exports = function repeat(count) {
      var str = String(defined(this));
      var res = '';
      var n = toInteger(count);
      if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");

      for (; n > 0; (n >>>= 1) && (str += str)) {
        if (n & 1) res += str;
      }

      return res;
    };
  }, {
    "./_to-integer": "../node_modules/core-js/modules/_to-integer.js",
    "./_defined": "../node_modules/core-js/modules/_defined.js"
  }],
  "../node_modules/core-js/modules/_string-pad.js": [function (require, module, exports) {
    // https://github.com/tc39/proposal-string-pad-start-end
    var toLength = require('./_to-length');

    var repeat = require('./_string-repeat');

    var defined = require('./_defined');

    module.exports = function (that, maxLength, fillString, left) {
      var S = String(defined(that));
      var stringLength = S.length;
      var fillStr = fillString === undefined ? ' ' : String(fillString);
      var intMaxLength = toLength(maxLength);
      if (intMaxLength <= stringLength || fillStr == '') return S;
      var fillLen = intMaxLength - stringLength;
      var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
      if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
      return left ? stringFiller + S : S + stringFiller;
    };
  }, {
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_string-repeat": "../node_modules/core-js/modules/_string-repeat.js",
    "./_defined": "../node_modules/core-js/modules/_defined.js"
  }],
  "../node_modules/core-js/modules/es7.string.pad-start.js": [function (require, module, exports) {
    'use strict'; // https://github.com/tc39/proposal-string-pad-start-end

    var $export = require('./_export');

    var $pad = require('./_string-pad');

    var userAgent = require('./_user-agent'); // https://github.com/zloirock/core-js/issues/280


    var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);
    $export($export.P + $export.F * WEBKIT_BUG, 'String', {
      padStart: function padStart(maxLength
      /* , fillString = ' ' */
      ) {
        return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_string-pad": "../node_modules/core-js/modules/_string-pad.js",
    "./_user-agent": "../node_modules/core-js/modules/_user-agent.js"
  }],
  "../node_modules/core-js/modules/es7.string.pad-end.js": [function (require, module, exports) {
    'use strict'; // https://github.com/tc39/proposal-string-pad-start-end

    var $export = require('./_export');

    var $pad = require('./_string-pad');

    var userAgent = require('./_user-agent'); // https://github.com/zloirock/core-js/issues/280


    var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);
    $export($export.P + $export.F * WEBKIT_BUG, 'String', {
      padEnd: function padEnd(maxLength
      /* , fillString = ' ' */
      ) {
        return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_string-pad": "../node_modules/core-js/modules/_string-pad.js",
    "./_user-agent": "../node_modules/core-js/modules/_user-agent.js"
  }],
  "../node_modules/core-js/modules/es6.string.raw.js": [function (require, module, exports) {
    var $export = require('./_export');

    var toIObject = require('./_to-iobject');

    var toLength = require('./_to-length');

    $export($export.S, 'String', {
      // 21.1.2.4 String.raw(callSite, ...substitutions)
      raw: function raw(callSite) {
        var tpl = toIObject(callSite.raw);
        var len = toLength(tpl.length);
        var aLen = arguments.length;
        var res = [];
        var i = 0;

        while (len > i) {
          res.push(String(tpl[i++]));
          if (i < aLen) res.push(String(arguments[i]));
        }

        return res.join('');
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_to-iobject": "../node_modules/core-js/modules/_to-iobject.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js"
  }],
  "../node_modules/core-js/modules/es6.string.repeat.js": [function (require, module, exports) {
    var $export = require('./_export');

    $export($export.P, 'String', {
      // 21.1.3.13 String.prototype.repeat(count)
      repeat: require('./_string-repeat')
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_string-repeat": "../node_modules/core-js/modules/_string-repeat.js"
  }],
  "../node_modules/core-js/modules/es6.string.small.js": [function (require, module, exports) {
    'use strict'; // B.2.3.11 String.prototype.small()

    require('./_string-html')('small', function (createHTML) {
      return function small() {
        return createHTML(this, 'small', '', '');
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.starts-with.js": [function (require, module, exports) {
    // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
    'use strict';

    var $export = require('./_export');

    var toLength = require('./_to-length');

    var context = require('./_string-context');

    var STARTS_WITH = 'startsWith';
    var $startsWith = ''[STARTS_WITH];
    $export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
      startsWith: function startsWith(searchString
      /* , position = 0 */
      ) {
        var that = context(this, searchString, STARTS_WITH);
        var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
        var search = String(searchString);
        return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
      }
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_string-context": "../node_modules/core-js/modules/_string-context.js",
    "./_fails-is-regexp": "../node_modules/core-js/modules/_fails-is-regexp.js"
  }],
  "../node_modules/core-js/modules/es6.string.strike.js": [function (require, module, exports) {
    'use strict'; // B.2.3.12 String.prototype.strike()

    require('./_string-html')('strike', function (createHTML) {
      return function strike() {
        return createHTML(this, 'strike', '', '');
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.sub.js": [function (require, module, exports) {
    'use strict'; // B.2.3.13 String.prototype.sub()

    require('./_string-html')('sub', function (createHTML) {
      return function sub() {
        return createHTML(this, 'sub', '', '');
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es6.string.sup.js": [function (require, module, exports) {
    'use strict'; // B.2.3.14 String.prototype.sup()

    require('./_string-html')('sup', function (createHTML) {
      return function sup() {
        return createHTML(this, 'sup', '', '');
      };
    });
  }, {
    "./_string-html": "../node_modules/core-js/modules/_string-html.js"
  }],
  "../node_modules/core-js/modules/es7.string.trim-left.js": [function (require, module, exports) {
    'use strict'; // https://github.com/sebmarkbage/ecmascript-string-left-right-trim

    require('./_string-trim')('trimLeft', function ($trim) {
      return function trimLeft() {
        return $trim(this, 1);
      };
    }, 'trimStart');
  }, {
    "./_string-trim": "../node_modules/core-js/modules/_string-trim.js"
  }],
  "../node_modules/core-js/modules/es7.string.trim-right.js": [function (require, module, exports) {
    'use strict'; // https://github.com/sebmarkbage/ecmascript-string-left-right-trim

    require('./_string-trim')('trimRight', function ($trim) {
      return function trimRight() {
        return $trim(this, 2);
      };
    }, 'trimEnd');
  }, {
    "./_string-trim": "../node_modules/core-js/modules/_string-trim.js"
  }],
  "../node_modules/core-js/modules/_typed.js": [function (require, module, exports) {
    var global = require('./_global');

    var hide = require('./_hide');

    var uid = require('./_uid');

    var TYPED = uid('typed_array');
    var VIEW = uid('view');
    var ABV = !!(global.ArrayBuffer && global.DataView);
    var CONSTR = ABV;
    var i = 0;
    var l = 9;
    var Typed;
    var TypedArrayConstructors = 'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'.split(',');

    while (i < l) {
      if (Typed = global[TypedArrayConstructors[i++]]) {
        hide(Typed.prototype, TYPED, true);
        hide(Typed.prototype, VIEW, true);
      } else CONSTR = false;
    }

    module.exports = {
      ABV: ABV,
      CONSTR: CONSTR,
      TYPED: TYPED,
      VIEW: VIEW
    };
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_uid": "../node_modules/core-js/modules/_uid.js"
  }],
  "../node_modules/core-js/modules/_to-index.js": [function (require, module, exports) {
    // https://tc39.github.io/ecma262/#sec-toindex
    var toInteger = require('./_to-integer');

    var toLength = require('./_to-length');

    module.exports = function (it) {
      if (it === undefined) return 0;
      var number = toInteger(it);
      var length = toLength(number);
      if (number !== length) throw RangeError('Wrong length!');
      return length;
    };
  }, {
    "./_to-integer": "../node_modules/core-js/modules/_to-integer.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js"
  }],
  "../node_modules/core-js/modules/_typed-buffer.js": [function (require, module, exports) {
    'use strict';

    var global = require('./_global');

    var DESCRIPTORS = require('./_descriptors');

    var LIBRARY = require('./_library');

    var $typed = require('./_typed');

    var hide = require('./_hide');

    var redefineAll = require('./_redefine-all');

    var fails = require('./_fails');

    var anInstance = require('./_an-instance');

    var toInteger = require('./_to-integer');

    var toLength = require('./_to-length');

    var toIndex = require('./_to-index');

    var gOPN = require('./_object-gopn').f;

    var dP = require('./_object-dp').f;

    var arrayFill = require('./_array-fill');

    var setToStringTag = require('./_set-to-string-tag');

    var ARRAY_BUFFER = 'ArrayBuffer';
    var DATA_VIEW = 'DataView';
    var PROTOTYPE = 'prototype';
    var WRONG_LENGTH = 'Wrong length!';
    var WRONG_INDEX = 'Wrong index!';
    var $ArrayBuffer = global[ARRAY_BUFFER];
    var $DataView = global[DATA_VIEW];
    var Math = global.Math;
    var RangeError = global.RangeError; // eslint-disable-next-line no-shadow-restricted-names

    var Infinity = global.Infinity;
    var BaseBuffer = $ArrayBuffer;
    var abs = Math.abs;
    var pow = Math.pow;
    var floor = Math.floor;
    var log = Math.log;
    var LN2 = Math.LN2;
    var BUFFER = 'buffer';
    var BYTE_LENGTH = 'byteLength';
    var BYTE_OFFSET = 'byteOffset';
    var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
    var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
    var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET; // IEEE754 conversions based on https://github.com/feross/ieee754

    function packIEEE754(value, mLen, nBytes) {
      var buffer = new Array(nBytes);
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
      var i = 0;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      var e, m, c;
      value = abs(value); // eslint-disable-next-line no-self-compare

      if (value != value || value === Infinity) {
        // eslint-disable-next-line no-self-compare
        m = value != value ? 1 : 0;
        e = eMax;
      } else {
        e = floor(log(value) / LN2);

        if (value * (c = pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }

        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * pow(2, 1 - eBias);
        }

        if (value * c >= 2) {
          e++;
          c /= 2;
        }

        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * pow(2, eBias - 1) * pow(2, mLen);
          e = 0;
        }
      }

      for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8) {
        ;
      }

      e = e << mLen | m;
      eLen += mLen;

      for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8) {
        ;
      }

      buffer[--i] |= s * 128;
      return buffer;
    }

    function unpackIEEE754(buffer, mLen, nBytes) {
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = eLen - 7;
      var i = nBytes - 1;
      var s = buffer[i--];
      var e = s & 127;
      var m;
      s >>= 7;

      for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8) {
        ;
      }

      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;

      for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8) {
        ;
      }

      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : s ? -Infinity : Infinity;
      } else {
        m = m + pow(2, mLen);
        e = e - eBias;
      }

      return (s ? -1 : 1) * m * pow(2, e - mLen);
    }

    function unpackI32(bytes) {
      return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
    }

    function packI8(it) {
      return [it & 0xff];
    }

    function packI16(it) {
      return [it & 0xff, it >> 8 & 0xff];
    }

    function packI32(it) {
      return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
    }

    function packF64(it) {
      return packIEEE754(it, 52, 8);
    }

    function packF32(it) {
      return packIEEE754(it, 23, 4);
    }

    function addGetter(C, key, internal) {
      dP(C[PROTOTYPE], key, {
        get: function get() {
          return this[internal];
        }
      });
    }

    function get(view, bytes, index, isLittleEndian) {
      var numIndex = +index;
      var intIndex = toIndex(numIndex);
      if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
      var store = view[$BUFFER]._b;
      var start = intIndex + view[$OFFSET];
      var pack = store.slice(start, start + bytes);
      return isLittleEndian ? pack : pack.reverse();
    }

    function set(view, bytes, index, conversion, value, isLittleEndian) {
      var numIndex = +index;
      var intIndex = toIndex(numIndex);
      if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
      var store = view[$BUFFER]._b;
      var start = intIndex + view[$OFFSET];
      var pack = conversion(+value);

      for (var i = 0; i < bytes; i++) {
        store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
      }
    }

    if (!$typed.ABV) {
      $ArrayBuffer = function ArrayBuffer(length) {
        anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
        var byteLength = toIndex(length);
        this._b = arrayFill.call(new Array(byteLength), 0);
        this[$LENGTH] = byteLength;
      };

      $DataView = function DataView(buffer, byteOffset, byteLength) {
        anInstance(this, $DataView, DATA_VIEW);
        anInstance(buffer, $ArrayBuffer, DATA_VIEW);
        var bufferLength = buffer[$LENGTH];
        var offset = toInteger(byteOffset);
        if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
        byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
        if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
        this[$BUFFER] = buffer;
        this[$OFFSET] = offset;
        this[$LENGTH] = byteLength;
      };

      if (DESCRIPTORS) {
        addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
        addGetter($DataView, BUFFER, '_b');
        addGetter($DataView, BYTE_LENGTH, '_l');
        addGetter($DataView, BYTE_OFFSET, '_o');
      }

      redefineAll($DataView[PROTOTYPE], {
        getInt8: function getInt8(byteOffset) {
          return get(this, 1, byteOffset)[0] << 24 >> 24;
        },
        getUint8: function getUint8(byteOffset) {
          return get(this, 1, byteOffset)[0];
        },
        getInt16: function getInt16(byteOffset
        /* , littleEndian */
        ) {
          var bytes = get(this, 2, byteOffset, arguments[1]);
          return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
        },
        getUint16: function getUint16(byteOffset
        /* , littleEndian */
        ) {
          var bytes = get(this, 2, byteOffset, arguments[1]);
          return bytes[1] << 8 | bytes[0];
        },
        getInt32: function getInt32(byteOffset
        /* , littleEndian */
        ) {
          return unpackI32(get(this, 4, byteOffset, arguments[1]));
        },
        getUint32: function getUint32(byteOffset
        /* , littleEndian */
        ) {
          return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
        },
        getFloat32: function getFloat32(byteOffset
        /* , littleEndian */
        ) {
          return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
        },
        getFloat64: function getFloat64(byteOffset
        /* , littleEndian */
        ) {
          return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
        },
        setInt8: function setInt8(byteOffset, value) {
          set(this, 1, byteOffset, packI8, value);
        },
        setUint8: function setUint8(byteOffset, value) {
          set(this, 1, byteOffset, packI8, value);
        },
        setInt16: function setInt16(byteOffset, value
        /* , littleEndian */
        ) {
          set(this, 2, byteOffset, packI16, value, arguments[2]);
        },
        setUint16: function setUint16(byteOffset, value
        /* , littleEndian */
        ) {
          set(this, 2, byteOffset, packI16, value, arguments[2]);
        },
        setInt32: function setInt32(byteOffset, value
        /* , littleEndian */
        ) {
          set(this, 4, byteOffset, packI32, value, arguments[2]);
        },
        setUint32: function setUint32(byteOffset, value
        /* , littleEndian */
        ) {
          set(this, 4, byteOffset, packI32, value, arguments[2]);
        },
        setFloat32: function setFloat32(byteOffset, value
        /* , littleEndian */
        ) {
          set(this, 4, byteOffset, packF32, value, arguments[2]);
        },
        setFloat64: function setFloat64(byteOffset, value
        /* , littleEndian */
        ) {
          set(this, 8, byteOffset, packF64, value, arguments[2]);
        }
      });
    } else {
      if (!fails(function () {
        $ArrayBuffer(1);
      }) || !fails(function () {
        new $ArrayBuffer(-1); // eslint-disable-line no-new
      }) || fails(function () {
        new $ArrayBuffer(); // eslint-disable-line no-new

        new $ArrayBuffer(1.5); // eslint-disable-line no-new

        new $ArrayBuffer(NaN); // eslint-disable-line no-new

        return $ArrayBuffer.name != ARRAY_BUFFER;
      })) {
        $ArrayBuffer = function ArrayBuffer(length) {
          anInstance(this, $ArrayBuffer);
          return new BaseBuffer(toIndex(length));
        };

        var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];

        for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
          if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
        }

        if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
      } // iOS Safari 7.x bug


      var view = new $DataView(new $ArrayBuffer(2));
      var $setInt8 = $DataView[PROTOTYPE].setInt8;
      view.setInt8(0, 2147483648);
      view.setInt8(1, 2147483649);
      if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
        setInt8: function setInt8(byteOffset, value) {
          $setInt8.call(this, byteOffset, value << 24 >> 24);
        },
        setUint8: function setUint8(byteOffset, value) {
          $setInt8.call(this, byteOffset, value << 24 >> 24);
        }
      }, true);
    }

    setToStringTag($ArrayBuffer, ARRAY_BUFFER);
    setToStringTag($DataView, DATA_VIEW);
    hide($DataView[PROTOTYPE], $typed.VIEW, true);
    exports[ARRAY_BUFFER] = $ArrayBuffer;
    exports[DATA_VIEW] = $DataView;
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_library": "../node_modules/core-js/modules/_library.js",
    "./_typed": "../node_modules/core-js/modules/_typed.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_redefine-all": "../node_modules/core-js/modules/_redefine-all.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_an-instance": "../node_modules/core-js/modules/_an-instance.js",
    "./_to-integer": "../node_modules/core-js/modules/_to-integer.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_to-index": "../node_modules/core-js/modules/_to-index.js",
    "./_object-gopn": "../node_modules/core-js/modules/_object-gopn.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_array-fill": "../node_modules/core-js/modules/_array-fill.js",
    "./_set-to-string-tag": "../node_modules/core-js/modules/_set-to-string-tag.js"
  }],
  "../node_modules/core-js/modules/es6.typed.array-buffer.js": [function (require, module, exports) {
    'use strict';

    var $export = require('./_export');

    var $typed = require('./_typed');

    var buffer = require('./_typed-buffer');

    var anObject = require('./_an-object');

    var toAbsoluteIndex = require('./_to-absolute-index');

    var toLength = require('./_to-length');

    var isObject = require('./_is-object');

    var ArrayBuffer = require('./_global').ArrayBuffer;

    var speciesConstructor = require('./_species-constructor');

    var $ArrayBuffer = buffer.ArrayBuffer;
    var $DataView = buffer.DataView;
    var $isView = $typed.ABV && ArrayBuffer.isView;
    var $slice = $ArrayBuffer.prototype.slice;
    var VIEW = $typed.VIEW;
    var ARRAY_BUFFER = 'ArrayBuffer';
    $export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {
      ArrayBuffer: $ArrayBuffer
    });
    $export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
      // 24.1.3.1 ArrayBuffer.isView(arg)
      isView: function isView(it) {
        return $isView && $isView(it) || isObject(it) && VIEW in it;
      }
    });
    $export($export.P + $export.U + $export.F * require('./_fails')(function () {
      return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
    }), ARRAY_BUFFER, {
      // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
      slice: function slice(start, end) {
        if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix

        var len = anObject(this).byteLength;
        var first = toAbsoluteIndex(start, len);
        var fin = toAbsoluteIndex(end === undefined ? len : end, len);
        var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(fin - first));
        var viewS = new $DataView(this);
        var viewT = new $DataView(result);
        var index = 0;

        while (first < fin) {
          viewT.setUint8(index++, viewS.getUint8(first++));
        }

        return result;
      }
    });

    require('./_set-species')(ARRAY_BUFFER);
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_typed": "../node_modules/core-js/modules/_typed.js",
    "./_typed-buffer": "../node_modules/core-js/modules/_typed-buffer.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_to-absolute-index": "../node_modules/core-js/modules/_to-absolute-index.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_species-constructor": "../node_modules/core-js/modules/_species-constructor.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_set-species": "../node_modules/core-js/modules/_set-species.js"
  }],
  "../node_modules/core-js/modules/_typed-array.js": [function (require, module, exports) {
    var global = arguments[3];
    'use strict';

    if (require('./_descriptors')) {
      var LIBRARY = require('./_library');

      var global = require('./_global');

      var fails = require('./_fails');

      var $export = require('./_export');

      var $typed = require('./_typed');

      var $buffer = require('./_typed-buffer');

      var ctx = require('./_ctx');

      var anInstance = require('./_an-instance');

      var propertyDesc = require('./_property-desc');

      var hide = require('./_hide');

      var redefineAll = require('./_redefine-all');

      var toInteger = require('./_to-integer');

      var toLength = require('./_to-length');

      var toIndex = require('./_to-index');

      var toAbsoluteIndex = require('./_to-absolute-index');

      var toPrimitive = require('./_to-primitive');

      var has = require('./_has');

      var classof = require('./_classof');

      var isObject = require('./_is-object');

      var toObject = require('./_to-object');

      var isArrayIter = require('./_is-array-iter');

      var create = require('./_object-create');

      var getPrototypeOf = require('./_object-gpo');

      var gOPN = require('./_object-gopn').f;

      var getIterFn = require('./core.get-iterator-method');

      var uid = require('./_uid');

      var wks = require('./_wks');

      var createArrayMethod = require('./_array-methods');

      var createArrayIncludes = require('./_array-includes');

      var speciesConstructor = require('./_species-constructor');

      var ArrayIterators = require('./es6.array.iterator');

      var Iterators = require('./_iterators');

      var $iterDetect = require('./_iter-detect');

      var setSpecies = require('./_set-species');

      var arrayFill = require('./_array-fill');

      var arrayCopyWithin = require('./_array-copy-within');

      var $DP = require('./_object-dp');

      var $GOPD = require('./_object-gopd');

      var dP = $DP.f;
      var gOPD = $GOPD.f;
      var RangeError = global.RangeError;
      var TypeError = global.TypeError;
      var Uint8Array = global.Uint8Array;
      var ARRAY_BUFFER = 'ArrayBuffer';
      var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
      var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
      var PROTOTYPE = 'prototype';
      var ArrayProto = Array[PROTOTYPE];
      var $ArrayBuffer = $buffer.ArrayBuffer;
      var $DataView = $buffer.DataView;
      var arrayForEach = createArrayMethod(0);
      var arrayFilter = createArrayMethod(2);
      var arraySome = createArrayMethod(3);
      var arrayEvery = createArrayMethod(4);
      var arrayFind = createArrayMethod(5);
      var arrayFindIndex = createArrayMethod(6);
      var arrayIncludes = createArrayIncludes(true);
      var arrayIndexOf = createArrayIncludes(false);
      var arrayValues = ArrayIterators.values;
      var arrayKeys = ArrayIterators.keys;
      var arrayEntries = ArrayIterators.entries;
      var arrayLastIndexOf = ArrayProto.lastIndexOf;
      var arrayReduce = ArrayProto.reduce;
      var arrayReduceRight = ArrayProto.reduceRight;
      var arrayJoin = ArrayProto.join;
      var arraySort = ArrayProto.sort;
      var arraySlice = ArrayProto.slice;
      var arrayToString = ArrayProto.toString;
      var arrayToLocaleString = ArrayProto.toLocaleString;
      var ITERATOR = wks('iterator');
      var TAG = wks('toStringTag');
      var TYPED_CONSTRUCTOR = uid('typed_constructor');
      var DEF_CONSTRUCTOR = uid('def_constructor');
      var ALL_CONSTRUCTORS = $typed.CONSTR;
      var TYPED_ARRAY = $typed.TYPED;
      var VIEW = $typed.VIEW;
      var WRONG_LENGTH = 'Wrong length!';
      var $map = createArrayMethod(1, function (O, length) {
        return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
      });
      var LITTLE_ENDIAN = fails(function () {
        // eslint-disable-next-line no-undef
        return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
      });
      var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
        new Uint8Array(1).set({});
      });

      var toOffset = function toOffset(it, BYTES) {
        var offset = toInteger(it);
        if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
        return offset;
      };

      var validate = function validate(it) {
        if (isObject(it) && TYPED_ARRAY in it) return it;
        throw TypeError(it + ' is not a typed array!');
      };

      var allocate = function allocate(C, length) {
        if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
          throw TypeError('It is not a typed array constructor!');
        }

        return new C(length);
      };

      var speciesFromList = function speciesFromList(O, list) {
        return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
      };

      var fromList = function fromList(C, list) {
        var index = 0;
        var length = list.length;
        var result = allocate(C, length);

        while (length > index) {
          result[index] = list[index++];
        }

        return result;
      };

      var addGetter = function addGetter(it, key, internal) {
        dP(it, key, {
          get: function get() {
            return this._d[internal];
          }
        });
      };

      var $from = function from(source
      /* , mapfn, thisArg */
      ) {
        var O = toObject(source);
        var aLen = arguments.length;
        var mapfn = aLen > 1 ? arguments[1] : undefined;
        var mapping = mapfn !== undefined;
        var iterFn = getIterFn(O);
        var i, length, values, result, step, iterator;

        if (iterFn != undefined && !isArrayIter(iterFn)) {
          for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
            values.push(step.value);
          }

          O = values;
        }

        if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);

        for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
          result[i] = mapping ? mapfn(O[i], i) : O[i];
        }

        return result;
      };

      var $of = function of() {
        var index = 0;
        var length = arguments.length;
        var result = allocate(this, length);

        while (length > index) {
          result[index] = arguments[index++];
        }

        return result;
      }; // iOS Safari 6.x fails here


      var TO_LOCALE_BUG = !!Uint8Array && fails(function () {
        arrayToLocaleString.call(new Uint8Array(1));
      });

      var $toLocaleString = function toLocaleString() {
        return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
      };

      var proto = {
        copyWithin: function copyWithin(target, start
        /* , end */
        ) {
          return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
        },
        every: function every(callbackfn
        /* , thisArg */
        ) {
          return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        },
        fill: function fill(value
        /* , start, end */
        ) {
          // eslint-disable-line no-unused-vars
          return arrayFill.apply(validate(this), arguments);
        },
        filter: function filter(callbackfn
        /* , thisArg */
        ) {
          return speciesFromList(this, arrayFilter(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined));
        },
        find: function find(predicate
        /* , thisArg */
        ) {
          return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
        },
        findIndex: function findIndex(predicate
        /* , thisArg */
        ) {
          return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
        },
        forEach: function forEach(callbackfn
        /* , thisArg */
        ) {
          arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        },
        indexOf: function indexOf(searchElement
        /* , fromIndex */
        ) {
          return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
        },
        includes: function includes(searchElement
        /* , fromIndex */
        ) {
          return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
        },
        join: function join(separator) {
          // eslint-disable-line no-unused-vars
          return arrayJoin.apply(validate(this), arguments);
        },
        lastIndexOf: function lastIndexOf(searchElement
        /* , fromIndex */
        ) {
          // eslint-disable-line no-unused-vars
          return arrayLastIndexOf.apply(validate(this), arguments);
        },
        map: function map(mapfn
        /* , thisArg */
        ) {
          return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
        },
        reduce: function reduce(callbackfn
        /* , initialValue */
        ) {
          // eslint-disable-line no-unused-vars
          return arrayReduce.apply(validate(this), arguments);
        },
        reduceRight: function reduceRight(callbackfn
        /* , initialValue */
        ) {
          // eslint-disable-line no-unused-vars
          return arrayReduceRight.apply(validate(this), arguments);
        },
        reverse: function reverse() {
          var that = this;
          var length = validate(that).length;
          var middle = Math.floor(length / 2);
          var index = 0;
          var value;

          while (index < middle) {
            value = that[index];
            that[index++] = that[--length];
            that[length] = value;
          }

          return that;
        },
        some: function some(callbackfn
        /* , thisArg */
        ) {
          return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        },
        sort: function sort(comparefn) {
          return arraySort.call(validate(this), comparefn);
        },
        subarray: function subarray(begin, end) {
          var O = validate(this);
          var length = O.length;
          var $begin = toAbsoluteIndex(begin, length);
          return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(O.buffer, O.byteOffset + $begin * O.BYTES_PER_ELEMENT, toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin));
        }
      };

      var $slice = function slice(start, end) {
        return speciesFromList(this, arraySlice.call(validate(this), start, end));
      };

      var $set = function set(arrayLike
      /* , offset */
      ) {
        validate(this);
        var offset = toOffset(arguments[1], 1);
        var length = this.length;
        var src = toObject(arrayLike);
        var len = toLength(src.length);
        var index = 0;
        if (len + offset > length) throw RangeError(WRONG_LENGTH);

        while (index < len) {
          this[offset + index] = src[index++];
        }
      };

      var $iterators = {
        entries: function entries() {
          return arrayEntries.call(validate(this));
        },
        keys: function keys() {
          return arrayKeys.call(validate(this));
        },
        values: function values() {
          return arrayValues.call(validate(this));
        }
      };

      var isTAIndex = function isTAIndex(target, key) {
        return isObject(target) && target[TYPED_ARRAY] && _typeof2(key) != 'symbol' && key in target && String(+key) == String(key);
      };

      var $getDesc = function getOwnPropertyDescriptor(target, key) {
        return isTAIndex(target, key = toPrimitive(key, true)) ? propertyDesc(2, target[key]) : gOPD(target, key);
      };

      var $setDesc = function defineProperty(target, key, desc) {
        if (isTAIndex(target, key = toPrimitive(key, true)) && isObject(desc) && has(desc, 'value') && !has(desc, 'get') && !has(desc, 'set') // TODO: add validation descriptor w/o calling accessors
        && !desc.configurable && (!has(desc, 'writable') || desc.writable) && (!has(desc, 'enumerable') || desc.enumerable)) {
          target[key] = desc.value;
          return target;
        }

        return dP(target, key, desc);
      };

      if (!ALL_CONSTRUCTORS) {
        $GOPD.f = $getDesc;
        $DP.f = $setDesc;
      }

      $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
        getOwnPropertyDescriptor: $getDesc,
        defineProperty: $setDesc
      });

      if (fails(function () {
        arrayToString.call({});
      })) {
        arrayToString = arrayToLocaleString = function toString() {
          return arrayJoin.call(this);
        };
      }

      var $TypedArrayPrototype$ = redefineAll({}, proto);
      redefineAll($TypedArrayPrototype$, $iterators);
      hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
      redefineAll($TypedArrayPrototype$, {
        slice: $slice,
        set: $set,
        constructor: function constructor() {
          /* noop */
        },
        toString: arrayToString,
        toLocaleString: $toLocaleString
      });
      addGetter($TypedArrayPrototype$, 'buffer', 'b');
      addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
      addGetter($TypedArrayPrototype$, 'byteLength', 'l');
      addGetter($TypedArrayPrototype$, 'length', 'e');
      dP($TypedArrayPrototype$, TAG, {
        get: function get() {
          return this[TYPED_ARRAY];
        }
      }); // eslint-disable-next-line max-statements

      module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
        CLAMPED = !!CLAMPED;
        var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
        var GETTER = 'get' + KEY;
        var SETTER = 'set' + KEY;
        var TypedArray = global[NAME];
        var Base = TypedArray || {};
        var TAC = TypedArray && getPrototypeOf(TypedArray);
        var FORCED = !TypedArray || !$typed.ABV;
        var O = {};
        var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];

        var getter = function getter(that, index) {
          var data = that._d;
          return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
        };

        var setter = function setter(that, index, value) {
          var data = that._d;
          if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
          data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
        };

        var addElement = function addElement(that, index) {
          dP(that, index, {
            get: function get() {
              return getter(this, index);
            },
            set: function set(value) {
              return setter(this, index, value);
            },
            enumerable: true
          });
        };

        if (FORCED) {
          TypedArray = wrapper(function (that, data, $offset, $length) {
            anInstance(that, TypedArray, NAME, '_d');
            var index = 0;
            var offset = 0;
            var buffer, byteLength, length, klass;

            if (!isObject(data)) {
              length = toIndex(data);
              byteLength = length * BYTES;
              buffer = new $ArrayBuffer(byteLength);
            } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
              buffer = data;
              offset = toOffset($offset, BYTES);
              var $len = data.byteLength;

              if ($length === undefined) {
                if ($len % BYTES) throw RangeError(WRONG_LENGTH);
                byteLength = $len - offset;
                if (byteLength < 0) throw RangeError(WRONG_LENGTH);
              } else {
                byteLength = toLength($length) * BYTES;
                if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
              }

              length = byteLength / BYTES;
            } else if (TYPED_ARRAY in data) {
              return fromList(TypedArray, data);
            } else {
              return $from.call(TypedArray, data);
            }

            hide(that, '_d', {
              b: buffer,
              o: offset,
              l: byteLength,
              e: length,
              v: new $DataView(buffer)
            });

            while (index < length) {
              addElement(that, index++);
            }
          });
          TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
          hide(TypedArrayPrototype, 'constructor', TypedArray);
        } else if (!fails(function () {
          TypedArray(1);
        }) || !fails(function () {
          new TypedArray(-1); // eslint-disable-line no-new
        }) || !$iterDetect(function (iter) {
          new TypedArray(); // eslint-disable-line no-new

          new TypedArray(null); // eslint-disable-line no-new

          new TypedArray(1.5); // eslint-disable-line no-new

          new TypedArray(iter); // eslint-disable-line no-new
        }, true)) {
          TypedArray = wrapper(function (that, data, $offset, $length) {
            anInstance(that, TypedArray, NAME);
            var klass; // `ws` module bug, temporarily remove validation length for Uint8Array
            // https://github.com/websockets/ws/pull/645

            if (!isObject(data)) return new Base(toIndex(data));

            if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
              return $length !== undefined ? new Base(data, toOffset($offset, BYTES), $length) : $offset !== undefined ? new Base(data, toOffset($offset, BYTES)) : new Base(data);
            }

            if (TYPED_ARRAY in data) return fromList(TypedArray, data);
            return $from.call(TypedArray, data);
          });
          arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
            if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
          });
          TypedArray[PROTOTYPE] = TypedArrayPrototype;
          if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
        }

        var $nativeIterator = TypedArrayPrototype[ITERATOR];
        var CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
        var $iterator = $iterators.values;
        hide(TypedArray, TYPED_CONSTRUCTOR, true);
        hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
        hide(TypedArrayPrototype, VIEW, true);
        hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

        if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
          dP(TypedArrayPrototype, TAG, {
            get: function get() {
              return NAME;
            }
          });
        }

        O[NAME] = TypedArray;
        $export($export.G + $export.W + $export.F * (TypedArray != Base), O);
        $export($export.S, NAME, {
          BYTES_PER_ELEMENT: BYTES
        });
        $export($export.S + $export.F * fails(function () {
          Base.of.call(TypedArray, 1);
        }), NAME, {
          from: $from,
          of: $of
        });
        if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);
        $export($export.P, NAME, proto);
        setSpecies(NAME);
        $export($export.P + $export.F * FORCED_SET, NAME, {
          set: $set
        });
        $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);
        if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;
        $export($export.P + $export.F * fails(function () {
          new TypedArray(1).slice();
        }), NAME, {
          slice: $slice
        });
        $export($export.P + $export.F * (fails(function () {
          return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
        }) || !fails(function () {
          TypedArrayPrototype.toLocaleString.call([1, 2]);
        })), NAME, {
          toLocaleString: $toLocaleString
        });
        Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
        if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
      };
    } else module.exports = function () {
      /* empty */
    };
  }, {
    "./_descriptors": "../node_modules/core-js/modules/_descriptors.js",
    "./_library": "../node_modules/core-js/modules/_library.js",
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_fails": "../node_modules/core-js/modules/_fails.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_typed": "../node_modules/core-js/modules/_typed.js",
    "./_typed-buffer": "../node_modules/core-js/modules/_typed-buffer.js",
    "./_ctx": "../node_modules/core-js/modules/_ctx.js",
    "./_an-instance": "../node_modules/core-js/modules/_an-instance.js",
    "./_property-desc": "../node_modules/core-js/modules/_property-desc.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_redefine-all": "../node_modules/core-js/modules/_redefine-all.js",
    "./_to-integer": "../node_modules/core-js/modules/_to-integer.js",
    "./_to-length": "../node_modules/core-js/modules/_to-length.js",
    "./_to-index": "../node_modules/core-js/modules/_to-index.js",
    "./_to-absolute-index": "../node_modules/core-js/modules/_to-absolute-index.js",
    "./_to-primitive": "../node_modules/core-js/modules/_to-primitive.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_classof": "../node_modules/core-js/modules/_classof.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_to-object": "../node_modules/core-js/modules/_to-object.js",
    "./_is-array-iter": "../node_modules/core-js/modules/_is-array-iter.js",
    "./_object-create": "../node_modules/core-js/modules/_object-create.js",
    "./_object-gpo": "../node_modules/core-js/modules/_object-gpo.js",
    "./_object-gopn": "../node_modules/core-js/modules/_object-gopn.js",
    "./core.get-iterator-method": "../node_modules/core-js/modules/core.get-iterator-method.js",
    "./_uid": "../node_modules/core-js/modules/_uid.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js",
    "./_array-methods": "../node_modules/core-js/modules/_array-methods.js",
    "./_array-includes": "../node_modules/core-js/modules/_array-includes.js",
    "./_species-constructor": "../node_modules/core-js/modules/_species-constructor.js",
    "./es6.array.iterator": "../node_modules/core-js/modules/es6.array.iterator.js",
    "./_iterators": "../node_modules/core-js/modules/_iterators.js",
    "./_iter-detect": "../node_modules/core-js/modules/_iter-detect.js",
    "./_set-species": "../node_modules/core-js/modules/_set-species.js",
    "./_array-fill": "../node_modules/core-js/modules/_array-fill.js",
    "./_array-copy-within": "../node_modules/core-js/modules/_array-copy-within.js",
    "./_object-dp": "../node_modules/core-js/modules/_object-dp.js",
    "./_object-gopd": "../node_modules/core-js/modules/_object-gopd.js"
  }],
  "../node_modules/core-js/modules/es6.typed.int8-array.js": [function (require, module, exports) {
    require('./_typed-array')('Int8', 1, function (init) {
      return function Int8Array(data, byteOffset, length) {
        return init(this, data, byteOffset, length);
      };
    });
  }, {
    "./_typed-array": "../node_modules/core-js/modules/_typed-array.js"
  }],
  "../node_modules/core-js/modules/es6.typed.uint8-array.js": [function (require, module, exports) {
    require('./_typed-array')('Uint8', 1, function (init) {
      return function Uint8Array(data, byteOffset, length) {
        return init(this, data, byteOffset, length);
      };
    });
  }, {
    "./_typed-array": "../node_modules/core-js/modules/_typed-array.js"
  }],
  "../node_modules/core-js/modules/es6.typed.uint8-clamped-array.js": [function (require, module, exports) {
    require('./_typed-array')('Uint8', 1, function (init) {
      return function Uint8ClampedArray(data, byteOffset, length) {
        return init(this, data, byteOffset, length);
      };
    }, true);
  }, {
    "./_typed-array": "../node_modules/core-js/modules/_typed-array.js"
  }],
  "../node_modules/core-js/modules/es6.typed.int16-array.js": [function (require, module, exports) {
    require('./_typed-array')('Int16', 2, function (init) {
      return function Int16Array(data, byteOffset, length) {
        return init(this, data, byteOffset, length);
      };
    });
  }, {
    "./_typed-array": "../node_modules/core-js/modules/_typed-array.js"
  }],
  "../node_modules/core-js/modules/es6.typed.uint16-array.js": [function (require, module, exports) {
    require('./_typed-array')('Uint16', 2, function (init) {
      return function Uint16Array(data, byteOffset, length) {
        return init(this, data, byteOffset, length);
      };
    });
  }, {
    "./_typed-array": "../node_modules/core-js/modules/_typed-array.js"
  }],
  "../node_modules/core-js/modules/es6.typed.int32-array.js": [function (require, module, exports) {
    require('./_typed-array')('Int32', 4, function (init) {
      return function Int32Array(data, byteOffset, length) {
        return init(this, data, byteOffset, length);
      };
    });
  }, {
    "./_typed-array": "../node_modules/core-js/modules/_typed-array.js"
  }],
  "../node_modules/core-js/modules/es6.typed.uint32-array.js": [function (require, module, exports) {
    require('./_typed-array')('Uint32', 4, function (init) {
      return function Uint32Array(data, byteOffset, length) {
        return init(this, data, byteOffset, length);
      };
    });
  }, {
    "./_typed-array": "../node_modules/core-js/modules/_typed-array.js"
  }],
  "../node_modules/core-js/modules/es6.typed.float32-array.js": [function (require, module, exports) {
    require('./_typed-array')('Float32', 4, function (init) {
      return function Float32Array(data, byteOffset, length) {
        return init(this, data, byteOffset, length);
      };
    });
  }, {
    "./_typed-array": "../node_modules/core-js/modules/_typed-array.js"
  }],
  "../node_modules/core-js/modules/es6.typed.float64-array.js": [function (require, module, exports) {
    require('./_typed-array')('Float64', 8, function (init) {
      return function Float64Array(data, byteOffset, length) {
        return init(this, data, byteOffset, length);
      };
    });
  }, {
    "./_typed-array": "../node_modules/core-js/modules/_typed-array.js"
  }],
  "../node_modules/core-js/modules/_collection-weak.js": [function (require, module, exports) {
    'use strict';

    var redefineAll = require('./_redefine-all');

    var getWeak = require('./_meta').getWeak;

    var anObject = require('./_an-object');

    var isObject = require('./_is-object');

    var anInstance = require('./_an-instance');

    var forOf = require('./_for-of');

    var createArrayMethod = require('./_array-methods');

    var $has = require('./_has');

    var validate = require('./_validate-collection');

    var arrayFind = createArrayMethod(5);
    var arrayFindIndex = createArrayMethod(6);
    var id = 0; // fallback for uncaught frozen keys

    var uncaughtFrozenStore = function uncaughtFrozenStore(that) {
      return that._l || (that._l = new UncaughtFrozenStore());
    };

    var UncaughtFrozenStore = function UncaughtFrozenStore() {
      this.a = [];
    };

    var findUncaughtFrozen = function findUncaughtFrozen(store, key) {
      return arrayFind(store.a, function (it) {
        return it[0] === key;
      });
    };

    UncaughtFrozenStore.prototype = {
      get: function get(key) {
        var entry = findUncaughtFrozen(this, key);
        if (entry) return entry[1];
      },
      has: function has(key) {
        return !!findUncaughtFrozen(this, key);
      },
      set: function set(key, value) {
        var entry = findUncaughtFrozen(this, key);
        if (entry) entry[1] = value;else this.a.push([key, value]);
      },
      'delete': function _delete(key) {
        var index = arrayFindIndex(this.a, function (it) {
          return it[0] === key;
        });
        if (~index) this.a.splice(index, 1);
        return !!~index;
      }
    };
    module.exports = {
      getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
        var C = wrapper(function (that, iterable) {
          anInstance(that, C, NAME, '_i');
          that._t = NAME; // collection type

          that._i = id++; // collection id

          that._l = undefined; // leak store for uncaught frozen objects

          if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        });
        redefineAll(C.prototype, {
          // 23.3.3.2 WeakMap.prototype.delete(key)
          // 23.4.3.3 WeakSet.prototype.delete(value)
          'delete': function _delete(key) {
            if (!isObject(key)) return false;
            var data = getWeak(key);
            if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
            return data && $has(data, this._i) && delete data[this._i];
          },
          // 23.3.3.4 WeakMap.prototype.has(key)
          // 23.4.3.4 WeakSet.prototype.has(value)
          has: function has(key) {
            if (!isObject(key)) return false;
            var data = getWeak(key);
            if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
            return data && $has(data, this._i);
          }
        });
        return C;
      },
      def: function def(that, key, value) {
        var data = getWeak(anObject(key), true);
        if (data === true) uncaughtFrozenStore(that).set(key, value);else data[that._i] = value;
        return that;
      },
      ufstore: uncaughtFrozenStore
    };
  }, {
    "./_redefine-all": "../node_modules/core-js/modules/_redefine-all.js",
    "./_meta": "../node_modules/core-js/modules/_meta.js",
    "./_an-object": "../node_modules/core-js/modules/_an-object.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_an-instance": "../node_modules/core-js/modules/_an-instance.js",
    "./_for-of": "../node_modules/core-js/modules/_for-of.js",
    "./_array-methods": "../node_modules/core-js/modules/_array-methods.js",
    "./_has": "../node_modules/core-js/modules/_has.js",
    "./_validate-collection": "../node_modules/core-js/modules/_validate-collection.js"
  }],
  "../node_modules/core-js/modules/es6.weak-map.js": [function (require, module, exports) {
    'use strict';

    var global = require('./_global');

    var each = require('./_array-methods')(0);

    var redefine = require('./_redefine');

    var meta = require('./_meta');

    var assign = require('./_object-assign');

    var weak = require('./_collection-weak');

    var isObject = require('./_is-object');

    var validate = require('./_validate-collection');

    var NATIVE_WEAK_MAP = require('./_validate-collection');

    var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;
    var WEAK_MAP = 'WeakMap';
    var getWeak = meta.getWeak;
    var isExtensible = Object.isExtensible;
    var uncaughtFrozenStore = weak.ufstore;
    var InternalMap;

    var wrapper = function wrapper(get) {
      return function WeakMap() {
        return get(this, arguments.length > 0 ? arguments[0] : undefined);
      };
    };

    var methods = {
      // 23.3.3.3 WeakMap.prototype.get(key)
      get: function get(key) {
        if (isObject(key)) {
          var data = getWeak(key);
          if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
          return data ? data[this._i] : undefined;
        }
      },
      // 23.3.3.5 WeakMap.prototype.set(key, value)
      set: function set(key, value) {
        return weak.def(validate(this, WEAK_MAP), key, value);
      }
    }; // 23.3 WeakMap Objects

    var $WeakMap = module.exports = require('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true); // IE11 WeakMap frozen keys fix


    if (NATIVE_WEAK_MAP && IS_IE11) {
      InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
      assign(InternalMap.prototype, methods);
      meta.NEED = true;
      each(['delete', 'has', 'get', 'set'], function (key) {
        var proto = $WeakMap.prototype;
        var method = proto[key];
        redefine(proto, key, function (a, b) {
          // store frozen objects on internal weakmap shim
          if (isObject(a) && !isExtensible(a)) {
            if (!this._f) this._f = new InternalMap();

            var result = this._f[key](a, b);

            return key == 'set' ? this : result; // store all the rest on native weakmap
          }

          return method.call(this, a, b);
        });
      });
    }
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_array-methods": "../node_modules/core-js/modules/_array-methods.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js",
    "./_meta": "../node_modules/core-js/modules/_meta.js",
    "./_object-assign": "../node_modules/core-js/modules/_object-assign.js",
    "./_collection-weak": "../node_modules/core-js/modules/_collection-weak.js",
    "./_is-object": "../node_modules/core-js/modules/_is-object.js",
    "./_validate-collection": "../node_modules/core-js/modules/_validate-collection.js",
    "./_collection": "../node_modules/core-js/modules/_collection.js"
  }],
  "../node_modules/core-js/modules/es6.weak-set.js": [function (require, module, exports) {
    'use strict';

    var weak = require('./_collection-weak');

    var validate = require('./_validate-collection');

    var WEAK_SET = 'WeakSet'; // 23.4 WeakSet Objects

    require('./_collection')(WEAK_SET, function (get) {
      return function WeakSet() {
        return get(this, arguments.length > 0 ? arguments[0] : undefined);
      };
    }, {
      // 23.4.3.1 WeakSet.prototype.add(value)
      add: function add(value) {
        return weak.def(validate(this, WEAK_SET), value, true);
      }
    }, weak, false, true);
  }, {
    "./_collection-weak": "../node_modules/core-js/modules/_collection-weak.js",
    "./_validate-collection": "../node_modules/core-js/modules/_validate-collection.js",
    "./_collection": "../node_modules/core-js/modules/_collection.js"
  }],
  "../node_modules/core-js/modules/web.timers.js": [function (require, module, exports) {
    // ie9- setTimeout & setInterval additional parameters fix
    var global = require('./_global');

    var $export = require('./_export');

    var userAgent = require('./_user-agent');

    var slice = [].slice;
    var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

    var wrap = function wrap(set) {
      return function (fn, time
      /* , ...args */
      ) {
        var boundArgs = arguments.length > 2;
        var args = boundArgs ? slice.call(arguments, 2) : false;
        return set(boundArgs ? function () {
          // eslint-disable-next-line no-new-func
          (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
        } : fn, time);
      };
    };

    $export($export.G + $export.B + $export.F * MSIE, {
      setTimeout: wrap(global.setTimeout),
      setInterval: wrap(global.setInterval)
    });
  }, {
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_user-agent": "../node_modules/core-js/modules/_user-agent.js"
  }],
  "../node_modules/core-js/modules/web.immediate.js": [function (require, module, exports) {
    var $export = require('./_export');

    var $task = require('./_task');

    $export($export.G + $export.B, {
      setImmediate: $task.set,
      clearImmediate: $task.clear
    });
  }, {
    "./_export": "../node_modules/core-js/modules/_export.js",
    "./_task": "../node_modules/core-js/modules/_task.js"
  }],
  "../node_modules/core-js/modules/web.dom.iterable.js": [function (require, module, exports) {
    var $iterators = require('./es6.array.iterator');

    var getKeys = require('./_object-keys');

    var redefine = require('./_redefine');

    var global = require('./_global');

    var hide = require('./_hide');

    var Iterators = require('./_iterators');

    var wks = require('./_wks');

    var ITERATOR = wks('iterator');
    var TO_STRING_TAG = wks('toStringTag');
    var ArrayValues = Iterators.Array;
    var DOMIterables = {
      CSSRuleList: true,
      // TODO: Not spec compliant, should be false.
      CSSStyleDeclaration: false,
      CSSValueList: false,
      ClientRectList: false,
      DOMRectList: false,
      DOMStringList: false,
      DOMTokenList: true,
      DataTransferItemList: false,
      FileList: false,
      HTMLAllCollection: false,
      HTMLCollection: false,
      HTMLFormElement: false,
      HTMLSelectElement: false,
      MediaList: true,
      // TODO: Not spec compliant, should be false.
      MimeTypeArray: false,
      NamedNodeMap: false,
      NodeList: true,
      PaintRequestList: false,
      Plugin: false,
      PluginArray: false,
      SVGLengthList: false,
      SVGNumberList: false,
      SVGPathSegList: false,
      SVGPointList: false,
      SVGStringList: false,
      SVGTransformList: false,
      SourceBufferList: false,
      StyleSheetList: true,
      // TODO: Not spec compliant, should be false.
      TextTrackCueList: false,
      TextTrackList: false,
      TouchList: false
    };

    for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
      var NAME = collections[i];
      var explicit = DOMIterables[NAME];
      var Collection = global[NAME];
      var proto = Collection && Collection.prototype;
      var key;

      if (proto) {
        if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
        if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
        Iterators[NAME] = ArrayValues;
        if (explicit) for (key in $iterators) {
          if (!proto[key]) redefine(proto, key, $iterators[key], true);
        }
      }
    }
  }, {
    "./es6.array.iterator": "../node_modules/core-js/modules/es6.array.iterator.js",
    "./_object-keys": "../node_modules/core-js/modules/_object-keys.js",
    "./_redefine": "../node_modules/core-js/modules/_redefine.js",
    "./_global": "../node_modules/core-js/modules/_global.js",
    "./_hide": "../node_modules/core-js/modules/_hide.js",
    "./_iterators": "../node_modules/core-js/modules/_iterators.js",
    "./_wks": "../node_modules/core-js/modules/_wks.js"
  }],
  "../node_modules/regenerator-runtime/runtime.js": [function (require, module, exports) {
    var define;
    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var runtime = function (exports) {
      "use strict";

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined; // More compressible than void 0.

      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }

      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function define(obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.

        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
      }

      exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.

      function tryCatch(fn, obj, arg) {
        try {
          return {
            type: "normal",
            arg: fn.call(obj, arg)
          };
        } catch (err) {
          return {
            type: "throw",
            arg: err
          };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.

      var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.

      function Generator() {}

      function GeneratorFunction() {}

      function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.


      var IteratorPrototype = {};

      IteratorPrototype[iteratorSymbol] = function () {
        return this;
      };

      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

      if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.

      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function (method) {
          define(prototype, method, function (arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function (genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };

      exports.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }

        genFun.prototype = Object.create(Gp);
        return genFun;
      }; // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.


      exports.awrap = function (arg) {
        return {
          __await: arg
        };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);

          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;

            if (value && _typeof2(value) === "object" && hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function (value) {
                invoke("next", value, resolve, reject);
              }, function (err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function (unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function (error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise = // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        } // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).


        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);

      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this;
      };

      exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.

      exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;
        var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
        return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function (result) {
          return result.done ? result.value : iter.next();
        });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            } // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;

            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);

              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;
            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);
            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;
            var record = tryCatch(innerFn, self, context);

            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };
            } else if (record.type === "throw") {
              state = GenStateCompleted; // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.

              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      } // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.


      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];

        if (method === undefined) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError("The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (!info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

          context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.

          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined;
          }
        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        } // The delegate iterator is finished, so forget it and continue with
        // the outer generator.


        context.delegate = null;
        return ContinueSentinel;
      } // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.


      defineIteratorMethods(Gp);
      define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.

      Gp[iteratorSymbol] = function () {
        return this;
      };

      Gp.toString = function () {
        return "[object Generator]";
      };

      function pushTryEntry(locs) {
        var entry = {
          tryLoc: locs[0]
        };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{
          tryLoc: "root"
        }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function (object) {
        var keys = [];

        for (var key in object) {
          keys.push(key);
        }

        keys.reverse(); // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.

        return function next() {
          while (keys.length) {
            var key = keys.pop();

            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          } // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.


          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];

          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1,
                next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined;
              next.done = true;
              return next;
            };

            return next.next = next;
          }
        } // Return an iterator with no values.


        return {
          next: doneResult
        };
      }

      exports.values = values;

      function doneResult() {
        return {
          value: undefined,
          done: true
        };
      }

      Context.prototype = {
        constructor: Context,
        reset: function reset(skipTempReset) {
          this.prev = 0;
          this.next = 0; // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.

          this.sent = this._sent = undefined;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined;
          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                this[name] = undefined;
              }
            }
          }
        },
        stop: function stop() {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;

          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },
        dispatchException: function dispatchException(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;

          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined;
            }

            return !!caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function abrupt(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },
        complete: function complete(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },
        finish: function finish(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        "catch": function _catch(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;

              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }

              return thrown;
            }
          } // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.


          throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined;
          }

          return ContinueSentinel;
        }
      }; // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.

      return exports;
    }( // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    _typeof2(module) === "object" ? module.exports : {});

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }, {}],
  "../node_modules/axios/lib/helpers/bind.js": [function (require, module, exports) {
    'use strict';

    module.exports = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);

        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        return fn.apply(thisArg, args);
      };
    };
  }, {}],
  "../node_modules/axios/lib/utils.js": [function (require, module, exports) {
    'use strict';

    var bind = require('./helpers/bind');
    /*global toString:true*/
    // utils is a library of generic helper functions non-specific to axios


    var toString = Object.prototype.toString;
    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */

    function isArray(val) {
      return toString.call(val) === '[object Array]';
    }
    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */


    function isUndefined(val) {
      return typeof val === 'undefined';
    }
    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */


    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }
    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */


    function isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]';
    }
    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */


    function isFormData(val) {
      return typeof FormData !== 'undefined' && val instanceof FormData;
    }
    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */


    function isArrayBufferView(val) {
      var result;

      if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && val.buffer instanceof ArrayBuffer;
      }

      return result;
    }
    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */


    function isString(val) {
      return typeof val === 'string';
    }
    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */


    function isNumber(val) {
      return typeof val === 'number';
    }
    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */


    function isObject(val) {
      return val !== null && _typeof2(val) === 'object';
    }
    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */


    function isPlainObject(val) {
      if (toString.call(val) !== '[object Object]') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }
    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */


    function isDate(val) {
      return toString.call(val) === '[object Date]';
    }
    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */


    function isFile(val) {
      return toString.call(val) === '[object File]';
    }
    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */


    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }
    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */


    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }
    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */


    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }
    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */


    function isURLSearchParams(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }
    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */


    function trim(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */


    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')) {
        return false;
      }

      return typeof window !== 'undefined' && typeof document !== 'undefined';
    }
    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */


    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      } // Force an array if not already something iterable


      if (_typeof2(obj) !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */


    function merge() {
      var result = {};

      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }

      return result;
    }
    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */


    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }
    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */


    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }

      return content;
    }

    module.exports = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM
    };
  }, {
    "./helpers/bind": "../node_modules/axios/lib/helpers/bind.js"
  }],
  "../node_modules/axios/lib/helpers/buildURL.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./../utils');

    function encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
    }
    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */


    module.exports = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;

      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }

            parts.push(encode(key) + '=' + encode(v));
          });
        });
        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');

        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };
  }, {
    "./../utils": "../node_modules/axios/lib/utils.js"
  }],
  "../node_modules/axios/lib/core/InterceptorManager.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./../utils');

    function InterceptorManager() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */


    InterceptorManager.prototype.use = function use(fulfilled, rejected) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
      });
      return this.handlers.length - 1;
    };
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */


    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */


    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    module.exports = InterceptorManager;
  }, {
    "./../utils": "../node_modules/axios/lib/utils.js"
  }],
  "../node_modules/axios/lib/core/transformData.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./../utils');
    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */


    module.exports = function transformData(data, headers, fns) {
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn(data, headers);
      });
      return data;
    };
  }, {
    "./../utils": "../node_modules/axios/lib/utils.js"
  }],
  "../node_modules/axios/lib/cancel/isCancel.js": [function (require, module, exports) {
    'use strict';

    module.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  }, {}],
  "../node_modules/axios/lib/helpers/normalizeHeaderName.js": [function (require, module, exports) {
    'use strict';

    var utils = require('../utils');

    module.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };
  }, {
    "../utils": "../node_modules/axios/lib/utils.js"
  }],
  "../node_modules/axios/lib/core/enhanceError.js": [function (require, module, exports) {
    'use strict';
    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */

    module.exports = function enhanceError(error, config, code, request, response) {
      error.config = config;

      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code
        };
      };

      return error;
    };
  }, {}],
  "../node_modules/axios/lib/core/createError.js": [function (require, module, exports) {
    'use strict';

    var enhanceError = require('./enhanceError');
    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */


    module.exports = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };
  }, {
    "./enhanceError": "../node_modules/axios/lib/core/enhanceError.js"
  }],
  "../node_modules/axios/lib/core/settle.js": [function (require, module, exports) {
    'use strict';

    var createError = require('./createError');
    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */


    module.exports = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;

      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
      }
    };
  }, {
    "./createError": "../node_modules/axios/lib/core/createError.js"
  }],
  "../node_modules/axios/lib/helpers/cookies.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./../utils');

    module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs support document.cookie
    function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },
        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return match ? decodeURIComponent(match[3]) : null;
        },
        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    }() : // Non standard browser env (web workers, react-native) lack needed support.
    function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() {
          return null;
        },
        remove: function remove() {}
      };
    }();
  }, {
    "./../utils": "../node_modules/axios/lib/utils.js"
  }],
  "../node_modules/axios/lib/helpers/isAbsoluteURL.js": [function (require, module, exports) {
    'use strict';
    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */

    module.exports = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };
  }, {}],
  "../node_modules/axios/lib/helpers/combineURLs.js": [function (require, module, exports) {
    'use strict';
    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */

    module.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
    };
  }, {}],
  "../node_modules/axios/lib/core/buildFullPath.js": [function (require, module, exports) {
    'use strict';

    var isAbsoluteURL = require('../helpers/isAbsoluteURL');

    var combineURLs = require('../helpers/combineURLs');
    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */


    module.exports = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }

      return requestedURL;
    };
  }, {
    "../helpers/isAbsoluteURL": "../node_modules/axios/lib/helpers/isAbsoluteURL.js",
    "../helpers/combineURLs": "../node_modules/axios/lib/helpers/combineURLs.js"
  }],
  "../node_modules/axios/lib/helpers/parseHeaders.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./../utils'); // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers


    var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];
    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */

    module.exports = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) {
        return parsed;
      }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }

          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });
      return parsed;
    };
  }, {
    "./../utils": "../node_modules/axios/lib/utils.js"
  }],
  "../node_modules/axios/lib/helpers/isURLSameOrigin.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./../utils');

    module.exports = utils.isStandardBrowserEnv() ? // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
    function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;
      /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */

      function resolveURL(url) {
        var href = url;

        if (msie) {
          // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href); // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils

        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);
      /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */

      return function isURLSameOrigin(requestURL) {
        var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
      };
    }() : // Non standard browser envs (web workers, react-native) lack needed support.
    function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    }();
  }, {
    "./../utils": "../node_modules/axios/lib/utils.js"
  }],
  "../node_modules/axios/lib/adapters/xhr.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./../utils');

    var settle = require('./../core/settle');

    var cookies = require('./../helpers/cookies');

    var buildURL = require('./../helpers/buildURL');

    var buildFullPath = require('../core/buildFullPath');

    var parseHeaders = require('./../helpers/parseHeaders');

    var isURLSameOrigin = require('./../helpers/isURLSameOrigin');

    var createError = require('../core/createError');

    module.exports = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;

        if (utils.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest(); // HTTP basic authentication

        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true); // Set the request timeout in MS

        request.timeout = config.timeout; // Listen for ready state

        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          } // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request


          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          } // Prepare the response


          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };
          settle(resolve, reject, response); // Clean up request

          request = null;
        }; // Handle browser request cancellation (as opposed to a manual cancellation)


        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError('Request aborted', config, 'ECONNABORTED', request)); // Clean up request

          request = null;
        }; // Handle low level network errors


        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError('Network Error', config, null, request)); // Clean up request

          request = null;
        }; // Handle timeout


        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';

          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }

          reject(createError(timeoutErrorMessage, config, 'ECONNABORTED', request)); // Clean up request

          request = null;
        }; // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.


        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        } // Add headers to the request


        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        } // Add withCredentials to request if needed


        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        } // Add responseType to request if needed


        if (config.responseType) {
          try {
            request.responseType = config.responseType;
          } catch (e) {
            // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
            // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
            if (config.responseType !== 'json') {
              throw e;
            }
          }
        } // Handle progress if needed


        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        } // Not all browsers support upload events


        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken) {
          // Handle cancellation
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (!request) {
              return;
            }

            request.abort();
            reject(cancel); // Clean up request

            request = null;
          });
        }

        if (!requestData) {
          requestData = null;
        } // Send the request


        request.send(requestData);
      });
    };
  }, {
    "./../utils": "../node_modules/axios/lib/utils.js",
    "./../core/settle": "../node_modules/axios/lib/core/settle.js",
    "./../helpers/cookies": "../node_modules/axios/lib/helpers/cookies.js",
    "./../helpers/buildURL": "../node_modules/axios/lib/helpers/buildURL.js",
    "../core/buildFullPath": "../node_modules/axios/lib/core/buildFullPath.js",
    "./../helpers/parseHeaders": "../node_modules/axios/lib/helpers/parseHeaders.js",
    "./../helpers/isURLSameOrigin": "../node_modules/axios/lib/helpers/isURLSameOrigin.js",
    "../core/createError": "../node_modules/axios/lib/core/createError.js"
  }],
  "../node_modules/process/browser.js": [function (require, module, exports) {
    // shim for using process in browser
    var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
    }

    function defaultClearTimeout() {
      throw new Error('clearTimeout has not been defined');
    }

    (function () {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }

      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();

    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
      } // if setTimeout wasn't available but was latter defined


      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }

      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }

    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
      } // if clearTimeout wasn't available but was latter defined


      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }

      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
        }
      }
    }

    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }

      draining = false;

      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }

      if (queue.length) {
        drainQueue();
      }
    }

    function drainQueue() {
      if (draining) {
        return;
      }

      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
      var len = queue.length;

      while (len) {
        currentQueue = queue;
        queue = [];

        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }

        queueIndex = -1;
        len = queue.length;
      }

      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);

      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }

      queue.push(new Item(fun, args));

      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    }; // v8 likes predictible objects


    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }

    Item.prototype.run = function () {
      this.fun.apply(null, this.array);
    };

    process.title = 'browser';
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues

    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function (name) {
      return [];
    };

    process.binding = function (name) {
      throw new Error('process.binding is not supported');
    };

    process.cwd = function () {
      return '/';
    };

    process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
    };

    process.umask = function () {
      return 0;
    };
  }, {}],
  "../node_modules/axios/lib/defaults.js": [function (require, module, exports) {
    var process = require("process");

    'use strict';

    var utils = require('./utils');

    var normalizeHeaderName = require('./helpers/normalizeHeaderName');

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;

      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = require('./adapters/xhr');
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = require('./adapters/http');
      }

      return adapter;
    }

    var defaults = {
      adapter: getDefaultAdapter(),
      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
          return data;
        }

        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }

        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }

        if (utils.isObject(data)) {
          setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
          return JSON.stringify(data);
        }

        return data;
      }],
      transformResponse: [function transformResponse(data) {
        /*eslint no-param-reassign:0*/
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            /* Ignore */
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      maxBodyLength: -1,
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      }
    };
    defaults.headers = {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    };
    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });
    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    module.exports = defaults;
  }, {
    "./utils": "../node_modules/axios/lib/utils.js",
    "./helpers/normalizeHeaderName": "../node_modules/axios/lib/helpers/normalizeHeaderName.js",
    "./adapters/xhr": "../node_modules/axios/lib/adapters/xhr.js",
    "./adapters/http": "../node_modules/axios/lib/adapters/xhr.js",
    "process": "../node_modules/process/browser.js"
  }],
  "../node_modules/axios/lib/core/dispatchRequest.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./../utils');

    var transformData = require('./transformData');

    var isCancel = require('../cancel/isCancel');

    var defaults = require('../defaults');
    /**
     * Throws a `Cancel` if cancellation has been requested.
     */


    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }
    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */


    module.exports = function dispatchRequest(config) {
      throwIfCancellationRequested(config); // Ensure headers exist

      config.headers = config.headers || {}; // Transform request data

      config.data = transformData(config.data, config.headers, config.transformRequest); // Flatten headers

      config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
      utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
        delete config.headers[method];
      });
      var adapter = config.adapter || defaults.adapter;
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config); // Transform response data

        response.data = transformData(response.data, response.headers, config.transformResponse);
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config); // Transform response data

          if (reason && reason.response) {
            reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
          }
        }

        return Promise.reject(reason);
      });
    };
  }, {
    "./../utils": "../node_modules/axios/lib/utils.js",
    "./transformData": "../node_modules/axios/lib/core/transformData.js",
    "../cancel/isCancel": "../node_modules/axios/lib/cancel/isCancel.js",
    "../defaults": "../node_modules/axios/lib/defaults.js"
  }],
  "../node_modules/axios/lib/core/mergeConfig.js": [function (require, module, exports) {
    'use strict';

    var utils = require('../utils');
    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */


    module.exports = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};
      var valueFromConfig2Keys = ['url', 'method', 'data'];
      var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
      var defaultToConfig2Keys = ['baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer', 'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName', 'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress', 'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent', 'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'];
      var directMergeKeys = ['validateStatus'];

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }

        return source;
      }

      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      }

      utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        }
      });
      utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
      utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });
      utils.forEach(directMergeKeys, function merge(prop) {
        if (prop in config2) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });
      var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
      var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
        return axiosKeys.indexOf(key) === -1;
      });
      utils.forEach(otherKeys, mergeDeepProperties);
      return config;
    };
  }, {
    "../utils": "../node_modules/axios/lib/utils.js"
  }],
  "../node_modules/axios/lib/core/Axios.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./../utils');

    var buildURL = require('../helpers/buildURL');

    var InterceptorManager = require('./InterceptorManager');

    var dispatchRequest = require('./dispatchRequest');

    var mergeConfig = require('./mergeConfig');
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */


    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */


    Axios.prototype.request = function request(config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }

      config = mergeConfig(this.defaults, config); // Set config.method

      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      } // Hook up interceptors middleware


      var chain = [dispatchRequest, undefined];
      var promise = Promise.resolve(config);
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });

      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    }; // Provide aliases for supported request methods


    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function (url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function (url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });
    module.exports = Axios;
  }, {
    "./../utils": "../node_modules/axios/lib/utils.js",
    "../helpers/buildURL": "../node_modules/axios/lib/helpers/buildURL.js",
    "./InterceptorManager": "../node_modules/axios/lib/core/InterceptorManager.js",
    "./dispatchRequest": "../node_modules/axios/lib/core/dispatchRequest.js",
    "./mergeConfig": "../node_modules/axios/lib/core/mergeConfig.js"
  }],
  "../node_modules/axios/lib/cancel/Cancel.js": [function (require, module, exports) {
    'use strict';
    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */

    function Cancel(message) {
      this.message = message;
    }

    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;
    module.exports = Cancel;
  }, {}],
  "../node_modules/axios/lib/cancel/CancelToken.js": [function (require, module, exports) {
    'use strict';

    var Cancel = require('./Cancel');
    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */


    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel(message);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `Cancel` if cancellation has been requested.
     */


    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */


    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    module.exports = CancelToken;
  }, {
    "./Cancel": "../node_modules/axios/lib/cancel/Cancel.js"
  }],
  "../node_modules/axios/lib/helpers/spread.js": [function (require, module, exports) {
    'use strict';
    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */

    module.exports = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
  }, {}],
  "../node_modules/axios/lib/helpers/isAxiosError.js": [function (require, module, exports) {
    'use strict';
    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */

    module.exports = function isAxiosError(payload) {
      return _typeof2(payload) === 'object' && payload.isAxiosError === true;
    };
  }, {}],
  "../node_modules/axios/lib/axios.js": [function (require, module, exports) {
    'use strict';

    var utils = require('./utils');

    var bind = require('./helpers/bind');

    var Axios = require('./core/Axios');

    var mergeConfig = require('./core/mergeConfig');

    var defaults = require('./defaults');
    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */


    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context); // Copy axios.prototype to instance

      utils.extend(instance, Axios.prototype, context); // Copy context to instance

      utils.extend(instance, context);
      return instance;
    } // Create the default instance to be exported


    var axios = createInstance(defaults); // Expose Axios class to allow class inheritance

    axios.Axios = Axios; // Factory for creating new instances

    axios.create = function create(instanceConfig) {
      return createInstance(mergeConfig(axios.defaults, instanceConfig));
    }; // Expose Cancel & CancelToken


    axios.Cancel = require('./cancel/Cancel');
    axios.CancelToken = require('./cancel/CancelToken');
    axios.isCancel = require('./cancel/isCancel'); // Expose all/spread

    axios.all = function all(promises) {
      return Promise.all(promises);
    };

    axios.spread = require('./helpers/spread'); // Expose isAxiosError

    axios.isAxiosError = require('./helpers/isAxiosError');
    module.exports = axios; // Allow use of default import syntax in TypeScript

    module.exports.default = axios;
  }, {
    "./utils": "../node_modules/axios/lib/utils.js",
    "./helpers/bind": "../node_modules/axios/lib/helpers/bind.js",
    "./core/Axios": "../node_modules/axios/lib/core/Axios.js",
    "./core/mergeConfig": "../node_modules/axios/lib/core/mergeConfig.js",
    "./defaults": "../node_modules/axios/lib/defaults.js",
    "./cancel/Cancel": "../node_modules/axios/lib/cancel/Cancel.js",
    "./cancel/CancelToken": "../node_modules/axios/lib/cancel/CancelToken.js",
    "./cancel/isCancel": "../node_modules/axios/lib/cancel/isCancel.js",
    "./helpers/spread": "../node_modules/axios/lib/helpers/spread.js",
    "./helpers/isAxiosError": "../node_modules/axios/lib/helpers/isAxiosError.js"
  }],
  "../node_modules/axios/index.js": [function (require, module, exports) {
    module.exports = require('./lib/axios');
  }, {
    "./lib/axios": "../node_modules/axios/lib/axios.js"
  }],
  "messageapp/DataBase.js": [function (require, module, exports) {
    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var DataBase = function DataBase() {
      var _this = this;

      _classCallCheck(this, DataBase);

      _defineProperty(this, "DB", null);

      _defineProperty(this, "connect", function () {
        return new Promise(function (resolve, reject) {
          var con = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
          var version = 1;

          if (con) {
            var req = con.open("App", version);

            req.onerror = function (event) {
              reject(Error(event));
            };

            req.onupgradeneeded = /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
                var db, chl, fnd;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        console.log('OnUpgrade Call'); // Save the IDBDatabase interface

                        db = event.target.result; // Create an objectStore for this database

                        db.createObjectStore("profile", {
                          keyPath: "_id"
                        }); // db.createObjectStore("openedChat", { keyPath: "friend._id" });

                        chl = db.createObjectStore("chatList", {
                          keyPath: "_id"
                        });
                        chl.createIndex('phone', 'friend.phone', {
                          unique: true
                        });
                        fnd = db.createObjectStore("friendList", {
                          keyPath: "friend._id"
                        });
                        fnd.createIndex('phone', 'friend.phone', {
                          unique: true
                        });
                        db.createObjectStore("messages", {
                          keyPath: "_id"
                        });
                        db.createObjectStore("newMessages", {
                          keyPath: "_id"
                        });
                        resolve(db);

                      case 10:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref.apply(this, arguments);
              };
            }();

            req.onsuccess = function () {
              console.log("OnSuccess call");
              var dataBase = req.result;

              dataBase.onversionchange = function () {
                dataBase.close();
                alert("Please reload the App");
              };

              resolve(dataBase);
            };
          }
        });
      });

      _defineProperty(this, "start", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _this.connect();

              case 3:
                return _context2.abrupt("return", _context2.sent);

              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 6]]);
      })));

      _defineProperty(this, "add", /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(transaction, objectStore, data) {
          var i, req;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.prev = 0;

                  if (!(_typeof(data) != 'object')) {
                    _context3.next = 3;
                    break;
                  }

                  return _context3.abrupt("return", Error('Data should be Array.'));

                case 3:
                  if (!(typeof _this.DB != 'undefined')) {
                    _context3.next = 7;
                    break;
                  }

                  _context3.next = 6;
                  return _this.start();

                case 6:
                  _this.DB = _context3.sent;

                case 7:
                  for (i = 0; i < data.length; i++) {
                    req = _this.DB.transaction([transaction], "readwrite").objectStore(objectStore).add(data[i]);

                    req.onerror = function () {
                      return Error("faild");
                    };
                  }

                  return _context3.abrupt("return", true);

                case 11:
                  _context3.prev = 11;
                  _context3.t0 = _context3["catch"](0);
                  return _context3.abrupt("return", 0);

                case 14:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, null, [[0, 11]]);
        }));

        return function (_x2, _x3, _x4) {
          return _ref3.apply(this, arguments);
        };
      }());

      _defineProperty(this, "read", /*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(transaction, objectStore, key) {
          var index,
              _args5 = arguments;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  index = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : null;
                  _context5.prev = 1;
                  return _context5.abrupt("return", new Promise( /*#__PURE__*/function () {
                    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(res, rej) {
                      var req;
                      return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              if (_this.DB) {
                                _context4.next = 4;
                                break;
                              }

                              _context4.next = 3;
                              return _this.start();

                            case 3:
                              _this.DB = _context4.sent;

                            case 4:
                              if (index) {
                                req = _this.DB.transaction([transaction]).objectStore(objectStore).index(index).get(key);
                              } else {
                                req = _this.DB.transaction([transaction]).objectStore(objectStore).get(key);
                              }

                              req.onerror = function (event) {
                                return rej(Error('Unable to find data in database'));
                              };

                              req.onsuccess = function (event) {
                                if (!req.result) return res(null);
                                return res(req.result);
                              };

                            case 7:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _callee4);
                    }));

                    return function (_x8, _x9) {
                      return _ref5.apply(this, arguments);
                    };
                  }()));

                case 5:
                  _context5.prev = 5;
                  _context5.t0 = _context5["catch"](1);
                  return _context5.abrupt("return", 0);

                case 8:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, null, [[1, 5]]);
        }));

        return function (_x5, _x6, _x7) {
          return _ref4.apply(this, arguments);
        };
      }());

      _defineProperty(this, "readAll", /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(transaction, objectStore) {
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.prev = 0;
                  return _context7.abrupt("return", new Promise( /*#__PURE__*/function () {
                    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(resolve, reject) {
                      var req, data;
                      return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              if (_this.DB) {
                                _context6.next = 4;
                                break;
                              }

                              _context6.next = 3;
                              return _this.start();

                            case 3:
                              _this.DB = _context6.sent;

                            case 4:
                              req = _this.DB.transaction(transaction).objectStore(objectStore);
                              data = [];

                              req.openCursor().onsuccess = function (event) {
                                var cursor = event.target.result;

                                if (cursor) {
                                  data.push(cursor.value);
                                  cursor.continue();
                                } else {
                                  return resolve(data);
                                }
                              };

                            case 7:
                            case "end":
                              return _context6.stop();
                          }
                        }
                      }, _callee6);
                    }));

                    return function (_x12, _x13) {
                      return _ref7.apply(this, arguments);
                    };
                  }()));

                case 4:
                  _context7.prev = 4;
                  _context7.t0 = _context7["catch"](0);
                  return _context7.abrupt("return", 0);

                case 7:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, null, [[0, 4]]);
        }));

        return function (_x10, _x11) {
          return _ref6.apply(this, arguments);
        };
      }());

      _defineProperty(this, "update", /*#__PURE__*/function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(transaction, objectStore, data) {
          var req;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.prev = 0;

                  if (!(_typeof(data) != 'object')) {
                    _context8.next = 3;
                    break;
                  }

                  return _context8.abrupt("return", Error('Data should be Array.'));

                case 3:
                  console.log(data);

                  if (!(typeof _this.DB != 'undefined')) {
                    _context8.next = 8;
                    break;
                  }

                  _context8.next = 7;
                  return _this.start();

                case 7:
                  _this.DB = _context8.sent;

                case 8:
                  req = _this.DB.transaction([transaction], "readwrite").objectStore(objectStore).put(data);

                  req.onerror = function () {
                    return Error("faild");
                  }; // req.onsuccess(()=>{
                  //     return true;
                  // });


                  _context8.next = 16;
                  break;

                case 12:
                  _context8.prev = 12;
                  _context8.t0 = _context8["catch"](0);
                  console.log(_context8.t0);
                  return _context8.abrupt("return", 0);

                case 16:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, null, [[0, 12]]);
        }));

        return function (_x14, _x15, _x16) {
          return _ref8.apply(this, arguments);
        };
      }());

      _defineProperty(this, "updateMany", /*#__PURE__*/function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(transaction, objectStore, data) {
          var i, res;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  if (!(_typeof(data) != 'object')) {
                    _context9.next = 2;
                    break;
                  }

                  return _context9.abrupt("return", Error('Data should be Array.'));

                case 2:
                  console.log(data);

                  if (!(typeof _this.DB != 'undefined')) {
                    _context9.next = 7;
                    break;
                  }

                  _context9.next = 6;
                  return _this.start();

                case 6:
                  _this.DB = _context9.sent;

                case 7:
                  for (i = 0; i < data.length; i++) {
                    res = _this.DB.transaction([transaction], "readwrite").objectStore(objectStore).put(data[i]);

                    res.onerror = function () {
                      return Error("faild");
                    };
                  }

                  return _context9.abrupt("return", true);

                case 9:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9);
        }));

        return function (_x17, _x18, _x19) {
          return _ref9.apply(this, arguments);
        };
      }());

      _defineProperty(this, "remove", /*#__PURE__*/function () {
        var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(transaction, objectStore, key) {
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  return _context11.abrupt("return", new Promise( /*#__PURE__*/function () {
                    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(res, rej) {
                      var req;
                      return regeneratorRuntime.wrap(function _callee10$(_context10) {
                        while (1) {
                          switch (_context10.prev = _context10.next) {
                            case 0:
                              if (_this.DB) {
                                _context10.next = 4;
                                break;
                              }

                              _context10.next = 3;
                              return _this.start();

                            case 3:
                              _this.DB = _context10.sent;

                            case 4:
                              req = _this.DB.transaction([transaction], "readwrite").objectStore(objectStore).delete(key);

                              req.onsuccess = function (event) {
                                return res(true);
                              };

                              req.onerror = function (evnt) {
                                return rej(false);
                              };

                            case 7:
                            case "end":
                              return _context10.stop();
                          }
                        }
                      }, _callee10);
                    }));

                    return function (_x23, _x24) {
                      return _ref11.apply(this, arguments);
                    };
                  }()));

                case 1:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11);
        }));

        return function (_x20, _x21, _x22) {
          return _ref10.apply(this, arguments);
        };
      }());

      _defineProperty(this, "clear", /*#__PURE__*/function () {
        var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(transaction, objectStore) {
          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  console.log('clear is called');
                  return _context13.abrupt("return", new Promise( /*#__PURE__*/function () {
                    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(res, rej) {
                      var req;
                      return regeneratorRuntime.wrap(function _callee12$(_context12) {
                        while (1) {
                          switch (_context12.prev = _context12.next) {
                            case 0:
                              if (_this.DB) {
                                _context12.next = 4;
                                break;
                              }

                              _context12.next = 3;
                              return _this.start();

                            case 3:
                              _this.DB = _context12.sent;

                            case 4:
                              req = _this.DB.transaction([transaction], "readwrite").objectStore(objectStore).clear();

                              req.onsuccess = function (event) {
                                return res(true);
                              };

                              req.onerror = function (evnt) {
                                return rej(false);
                              };

                            case 7:
                            case "end":
                              return _context12.stop();
                          }
                        }
                      }, _callee12);
                    }));

                    return function (_x27, _x28) {
                      return _ref13.apply(this, arguments);
                    };
                  }()));

                case 2:
                case "end":
                  return _context13.stop();
              }
            }
          }, _callee13);
        }));

        return function (_x25, _x26) {
          return _ref12.apply(this, arguments);
        };
      }());

      _defineProperty(this, "clearAllObjectStore", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(res, rej) {
                    var req;
                    return regeneratorRuntime.wrap(function _callee14$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            if (_this.DB) {
                              _context14.next = 4;
                              break;
                            }

                            _context14.next = 3;
                            return _this.start();

                          case 3:
                            _this.DB = _context14.sent;

                          case 4:
                            req = _this.DB.transaction(['profile'], "readwrite").objectStore("profile").clear();
                            req = _this.DB.transaction(['chatList'], "readwrite").objectStore("chatList").clear();
                            req = _this.DB.transaction(['friendList'], "readwrite").objectStore("friendList").clear();
                            req = _this.DB.transaction(['messages'], "readwrite").objectStore("messages").clear();
                            req = _this.DB.transaction(['newMessages'], "readwrite").objectStore("newMessages").clear();

                            req.onsuccess = function () {
                              return res(req);
                            };

                            req.onerror = function () {
                              return rej(false);
                            };

                          case 11:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee14);
                  }));

                  return function (_x29, _x30) {
                    return _ref15.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15);
      })));
    };

    module.exports = new DataBase();
  }, {}],
  "messageapp/SynceFromServer.js": [function (require, module, exports) {
    "use strict";

    var _axios = _interopRequireDefault(require("axios"));

    var _DataBase = _interopRequireDefault(require("./DataBase"));

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var Serverindexdb = function Serverindexdb() {
      var _this = this;

      _classCallCheck(this, Serverindexdb);

      _defineProperty(this, "start", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _DataBase.default.clearAllObjectStore();

              case 3:
                _context.next = 5;
                return _this.profile();

              case 5:
                _context.next = 7;
                return _this.setFriendList();

              case 7:
                _context.next = 9;
                return _this.setChatList();

              case 9:
                _context.next = 11;
                return _this.messageOfFriend();

              case 11:
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 13]]);
      })));

      _defineProperty(this, "profile", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return (0, _axios.default)({
                  method: "GET",
                  url: '/api/v0/me'
                });

              case 3:
                res = _context2.sent;

                if (res.data.status === 'success') {
                  console.log(res);
                  window.user = res.data.data; // await DB.add('profile', 'profile', [res.data.data]);
                }

                _context2.next = 11;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                window.user = null;
                console.log(_context2.t0);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      })));

      _defineProperty(this, "setFriendList", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return (0, _axios.default)({
                  method: "GET",
                  url: '/api/v0/getfriends'
                });

              case 3:
                res = _context3.sent;

                if (!(res.data.status === 'success')) {
                  _context3.next = 10;
                  break;
                }

                console.log(res);
                _context3.next = 8;
                return _DataBase.default.clear('friendList', 'friendList');

              case 8:
                _context3.next = 10;
                return _DataBase.default.add('friendList', 'friendList', res.data.data);

              case 10:
                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 12]]);
      })));

      _defineProperty(this, "setChatList", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var res;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return (0, _axios.default)({
                  method: "GET",
                  url: '/api/v0/chatlist'
                });

              case 3:
                res = _context4.sent;

                if (!(res.data.status === 'success')) {
                  _context4.next = 11;
                  break;
                }

                console.log(res);
                _context4.next = 8;
                return _DataBase.default.clear('chatList', 'chatList');

              case 8:
                if (!res.data.total) {
                  _context4.next = 11;
                  break;
                }

                _context4.next = 11;
                return _DataBase.default.add('chatList', 'chatList', res.data.data);

              case 11:
                _context4.next = 16;
                break;

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 13]]);
      })));

      _defineProperty(this, "newMessages", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(resolve, rej) {
                    var res;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.prev = 0;
                            _context5.next = 3;
                            return (0, _axios.default)({
                              method: "GET",
                              url: '/api/v0/newmessages'
                            });

                          case 3:
                            res = _context5.sent;

                            if (!(res.data.status === 'success')) {
                              _context5.next = 10;
                              break;
                            }

                            if (res.data.total) {
                              _context5.next = 7;
                              break;
                            }

                            return _context5.abrupt("return", true);

                          case 7:
                            _context5.next = 9;
                            return _DataBase.default.updateMany('newMessages', 'newMessages', res.data.data);

                          case 9:
                            return _context5.abrupt("return", resolve(res.data));

                          case 10:
                            _context5.next = 16;
                            break;

                          case 12:
                            _context5.prev = 12;
                            _context5.t0 = _context5["catch"](0);
                            clearInterval(window.intervalId);
                            return _context5.abrupt("return", rej(_context5.t0.response.data));

                          case 16:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5, null, [[0, 12]]);
                  }));

                  return function (_x, _x2) {
                    return _ref6.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      })));

      _defineProperty(this, "messageOfFriend", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var sender,
            res,
            data,
            _args7 = arguments;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                sender = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : null;

                if (sender) {
                  _context7.next = 3;
                  break;
                }

                return _context7.abrupt("return", true);

              case 3:
                _context7.prev = 3;
                _context7.next = 6;
                return (0, _axios.default)({
                  method: "POST",
                  url: '/api/v0/receive',
                  data: {
                    sender: sender
                  }
                });

              case 6:
                res = _context7.sent;

                if (!(res.data.status === 'success')) {
                  _context7.next = 12;
                  break;
                }

                data = {
                  _id: sender,
                  data: res.data.data
                };
                _context7.next = 11;
                return _DataBase.default.add('messages', 'messages', [data]);

              case 11:
                return _context7.abrupt("return", data);

              case 12:
                _context7.next = 17;
                break;

              case 14:
                _context7.prev = 14;
                _context7.t0 = _context7["catch"](3);
                console.log(_context7.t0);

              case 17:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[3, 14]]);
      })));

      _defineProperty(this, "sendMessage", /*#__PURE__*/function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(data) {
          var res;
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.prev = 0;
                  _context8.next = 3;
                  return (0, _axios.default)({
                    method: 'POST',
                    url: '/api/v0/send',
                    data: {
                      message: data.message,
                      receiver: data.receiver
                    }
                  });

                case 3:
                  res = _context8.sent;

                  if (!(res.data.status == 'success')) {
                    _context8.next = 6;
                    break;
                  }

                  return _context8.abrupt("return", res.data.data);

                case 6:
                  _context8.next = 13;
                  break;

                case 8:
                  _context8.prev = 8;
                  _context8.t0 = _context8["catch"](0);
                  console.log(_context8.t0);
                  console.log(_context8.t0.response.data);
                  return _context8.abrupt("return", 0);

                case 13:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, null, [[0, 8]]);
        }));

        return function (_x3) {
          return _ref8.apply(this, arguments);
        };
      }());

      _defineProperty(this, "addContact", /*#__PURE__*/function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(contact) {
          var res;
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.prev = 0;
                  _context9.next = 3;
                  return (0, _axios.default)({
                    method: 'post',
                    url: '/api/v0/addcontact',
                    data: {
                      code: contact.code,
                      name: contact.name,
                      number: contact.number,
                      email: contact.email
                    }
                  });

                case 3:
                  res = _context9.sent;

                  if (!(res.data.status == 'success')) {
                    _context9.next = 8;
                    break;
                  }

                  _context9.next = 7;
                  return _DataBase.default.update('friendList', 'friendList', res.data.data);

                case 7:
                  return _context9.abrupt("return", res.data);

                case 8:
                  _context9.next = 13;
                  break;

                case 10:
                  _context9.prev = 10;
                  _context9.t0 = _context9["catch"](0);
                  return _context9.abrupt("return", _context9.t0.response.data);

                case 13:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, null, [[0, 10]]);
        }));

        return function (_x4) {
          return _ref9.apply(this, arguments);
        };
      }());
    };

    module.exports = new Serverindexdb();
  }, {
    "axios": "../node_modules/axios/index.js",
    "./DataBase": "messageapp/DataBase.js"
  }],
  "messageapp/Items.js": [function (require, module, exports) {
    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var Items = function Items() {
      var _this = this;

      _classCallCheck(this, Items);

      _defineProperty(this, "gatTime", function (date) {
        try {
          date = new Date(date);
          var tDate = new Date();
          if (date.getFullYear() != tDate.getFullYear()) return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
          if (date.getMonth() != tDate.getMonth()) return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
          if (date.getDate() != tDate.getDate() && date.getDate() == tDate.getDate() - 1) return "Yesterday";
          if (date.getDate() == tDate.getDate()) return date.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
          return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
        } catch (err) {
          var x = new Date();
          return x.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        }
      });

      _defineProperty(this, "addFriendList", function (data) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var friendBody = $('.sidebar-body #friendListContainer');
        if (!friendBody) return false;
        type = type ? 'avatar-state-success' : null;
        friendBody.append("<li class=\"list-group-item chatListItem-class\" data-navigation-target=\"chats\" data-friend-id=\"".concat(data.friend._id, "\">\n                                <div>\n                                    <figure class=\"avatar ").concat(type, "\">\n                                        <img src=\"").concat(data.friend.image, "\" class=\"rounded-circle\" alt=\"image\">\n                                    </figure>\n                                </div>\n                            <div class=\"users-list-body\">\n                                <div>\n                                    <h5>").concat(data.name, "</h5>\n                                    <p>").concat(data.friend.phone, "</p>\n                                </div>\n                                <div class=\"users-list-action\">\n                                    <div class=\"action-toggle\">\n<!--                                        <div class=\"dropdown\">-->\n<!--                                            <a data-toggle=\"dropdown\" href=\"#\">-->\n<!--                                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-more-horizontal\"><circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle></svg>-->\n<!--                                            </a>-->\n<!--                                            <div class=\"dropdown-menu dropdown-menu-right\">-->\n<!--                                                <a href=\"#\" class=\"dropdown-item\">New chat</a>-->\n<!--                                                <a href=\"#\" data-navigation-target=\"contact-information\" class=\"dropdown-item\">Profile</a>-->\n<!--                                                <div class=\"dropdown-divider\"></div>-->\n<!--                                                <a href=\"#\" class=\"dropdown-item text-danger\">Block</a>-->\n<!--                                            </div>-->\n<!--                                        </div>-->\n                                    </div>\n                                </div>\n                            </div>\n                        </li>"));
      });

      _defineProperty(this, "addChatlist", function (data) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (_typeof(data) !== "object") return false;
        var chatBody = $('.sidebar-body #chatListContainer');
        if (!chatBody) return false;

        if (data.friend._id == data.receiver) {
          data.time = _this.gatTime(data.sent);
        } else {
          data.time = _this.gatTime(data.delivered);
        }

        if (data.friend.name == undefined) data.friend.name = data.friend.phone;
        chatBody.append("<li class=\"list-group-item chatListItem-class\" data-friend-id=\"".concat(data.friend._id, "\">\n                            <div>\n                                <figure class=\"avatar\">\n                                    <img src=\"").concat(data.friend.image, "\" class=\"rounded-circle\" alt=\"image\">\n                                </figure>\n                            </div>\n                            <div class=\"users-list-body\">\n                                <div>\n                                    <h5>").concat(data.friend.name, "</h5>\n                                    <p>").concat(data.message, "</p>\n                                </div>\n                                <div class=\"users-list-action\">\n                                    <small class=\"text-muted\">").concat(data.time, "</small>\n                                    <div class=\"action-toggle\">\n                                        <div class=\"dropdown\">\n<!--                                            <a data-toggle=\"dropdown\" href=\"#\">-->\n<!--                                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-more-horizontal\"><circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle></svg>-->\n<!--                                            </a>-->\n<!--                                            <div class=\"dropdown-menu dropdown-menu-right\">-->\n<!--                                                <a href=\"#\" class=\"dropdown-item\">Add to archive</a>-->\n<!--                                                <div class=\"dropdown-divider\"></div>-->\n<!--                                                <a href=\"#\" class=\"dropdown-item text-danger\">Block</a>-->\n<!--                                                <a href=\"#\" class=\"dropdown-item text-danger\">Delete</a>-->\n<!--                                            </div>-->\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </li>"));
      });

      _defineProperty(this, "addToChat", function (data) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (_typeof(data) !== "object") return false;
        var chatBody = $('.sidebar-body #chatListContainer');
        if (!chatBody) return false;

        var add = function add() {
          data.time = _this.gatTime(new Date());
          if (data.friend.name == undefined) data.friend.name = data.friend.phone;

          if (data.unseen) {
            chatBody.prepend("<li class=\"list-group-item chatListItem-class\" data-friend-id=\"".concat(data.friend._id, "\">\n                                <div>\n                                    <figure class=\"avatar\">\n                                        <img src=\"").concat(data.friend.image, "\" class=\"rounded-circle\" alt=\"image\">\n                                    </figure>\n                                </div>\n                            <div class=\"users-list-body\">\n                                <div>\n                                    <h5 class=\"text-primary\">").concat(data.friend.name, "</h5>\n                                    <p>").concat(data.message, "</p>\n                                </div>\n                                <div class=\"users-list-action\">\n                                    <div class=\"new-message-count\">").concat(data.unseen, "</div>\n                                    <small class=\"text-primary\">").concat(data.time, "</small>\n                                </div>\n                            </div>\n                        </li>"));
          } else {
            chatBody.prepend("<li class=\"list-group-item chatListItem-class open-chat\" data-friend-id=\"".concat(data.friend._id, "\">\n                            <div>\n                                <figure class=\"avatar\">\n                                    <img src=\"").concat(data.friend.image, "\" class=\"rounded-circle\" alt=\"image\">\n                                </figure>\n                            </div>\n                            <div class=\"users-list-body\">\n                                <div>\n                                    <h5>").concat(data.friend.name, "</h5>\n                                    <p>").concat(data.message, "</p>\n                                </div>\n                                <div class=\"users-list-action\">\n                                    <small class=\"text-muted\">").concat(data.time, "</small>\n                                    <div class=\"action-toggle\">\n                                        <div class=\"dropdown\">\n                                            <a data-toggle=\"dropdown\" href=\"#\">\n                                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-more-horizontal\"><circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle></svg>\n                                            </a>\n                                            <div class=\"dropdown-menu dropdown-menu-right\">\n                                                <a href=\"#\" class=\"dropdown-item\">Open</a>\n                                                <a href=\"#\" data-navigation-target=\"contact-information\" class=\"dropdown-item\">Profile</a>\n                                                <a href=\"#\" class=\"dropdown-item\">Add to archive</a>\n                                                <div class=\"dropdown-divider\"></div>\n                                                <a href=\"#\" class=\"dropdown-item text-danger\">Delete</a>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </li>"));
          }

          return true;
        };

        for (var i = 0; i < chatBody.children().length; i++) {
          var child = chatBody.children()[i];

          if (child.dataset.frienId == data.friend._id) {
            child.remove();
            return add();
          }
        }

        return add();
      });

      _defineProperty(this, "openChat", function (data) {
        if (_typeof(data) !== "object") return false;
        var chatBody = $('.content #chatBoxContainer');
        if (!chatBody) return false; // console.log(data)

        if (!data.friend.name) data.friend.name = data.friend.phone;
        chatBody.html(''); //Head

        chatBody.append("<div class=\"chat-header\" style=\" background: #ffffff;\">\n                <div class=\"chat-header-user\">\n                    <figure class=\"avatar\">\n                        <img src=\"".concat(data.friend.image, "\" class=\"rounded-circle\" alt=\"image\">\n                    </figure>\n                    <div>\n                        <h5>").concat(data.friend.name, "</h5>\n                        <small class=\"text-success\">\n                            <i>writing...</i>\n                        </small>\n                    </div>\n                </div>\n                <div class=\"chat-header-action\">\n                    <ul class=\"list-inline\">\n                        <li class=\"list-inline-item d-xl-none d-inline\">\n                            <a href=\"#\" class=\"btn btn-outline-light mobile-navigation-button\">\n                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-menu\"><line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"></line><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"></line><line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\"></line></svg>\n                            </a>\n                        </li>\n                        <li class=\"list-inline-item\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Voice call\">\n                            <a href=\"#\" class=\"btn btn-outline-light text-success\" data-toggle=\"modal\" data-target=\"#call\">\n                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-phone\"><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path></svg>\n                            </a>\n                        </li>\n                        <li class=\"list-inline-item\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Video call\">\n                            <a href=\"#\" class=\"btn btn-outline-light text-warning\" data-toggle=\"modal\" data-target=\"#videoCall\">\n                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-video\"><polygon points=\"23 7 16 12 23 17 23 7\"></polygon><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" ry=\"2\"></rect></svg>\n                            </a>\n                        </li>\n                        <li class=\"list-inline-item\">\n                            <a href=\"#\" class=\"btn btn-outline-light\" data-toggle=\"dropdown\">\n                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-more-horizontal\"><circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle></svg>\n                            </a>\n                            <div class=\"dropdown-menu dropdown-menu-right\">\n                                <a href=\"#\" data-navigation-target=\"contact-information\" class=\"dropdown-item\">Profile</a>\n                                <a href=\"#\" class=\"dropdown-item\">Add to archive</a>\n                                <a href=\"#\" class=\"dropdown-item\">Delete</a>\n                                <div class=\"dropdown-divider\"></div>\n                                <a href=\"#\" class=\"dropdown-item text-danger\">Block</a>\n                            </div>\n                        </li>\n                    </ul>\n                </div>\n            </div>")); //Body

        chatBody.append("<div class=\"chat-body\" style=\"position: relative\">\n                  <div class=\"dropHover\" style=\"\">\n                    <div class=\"dropTextContainer\"><h3 style=\"color: #283954b3;\">Drag &amp; Drop</h3>\n                    </div>\n                  </div> \n                <div class=\"messages\">\n                </div>\n            </div>"); //Footer

        chatBody.append("<div class=\"chat-footer\">\n                <form>\n                    <div>\n                        <button class=\"btn btn-light mr-3\" data-toggle=\"tooltip\" title=\"\" type=\"button\" data-original-title=\"Emoji\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-smile\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"></path><line x1=\"9\" y1=\"9\" x2=\"9.01\" y2=\"9\"></line><line x1=\"15\" y1=\"9\" x2=\"15.01\" y2=\"9\"></line></svg>\n                        </button>\n                    </div>\n                    <input type=\"text\" class=\"form-control\" placeholder=\"Write a message.\">\n                    <div class=\"form-buttons\">\n                        <button class=\"btn btn-light\" data-toggle=\"tooltip\" title=\"\" type=\"button\" data-original-title=\"Add files\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-paperclip\"><path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\"></path></svg>\n                        </button>\n                        <button class=\"btn btn-light d-sm-none d-block\" data-toggle=\"tooltip\" title=\"\" type=\"button\" data-original-title=\"Send a voice record\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-mic\"><path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\"></path><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"></path><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"></line><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"></line></svg>\n                        </button>\n                        <button class=\"btn btn-primary\" type=\"submit\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-send\"><line x1=\"22\" y1=\"2\" x2=\"11\" y2=\"13\"></line><polygon points=\"22 2 15 22 11 13 2 9 22 2\"></polygon></svg>\n                        </button>\n                    </div>\n                </form>\n            </div>");
      });

      _defineProperty(this, "addMessage", function (data) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var chat_body = $('.layout .content .chat .chat-body');

        if (chat_body.length > 0) {
          $('.layout .content .chat .chat-body .messages').append("<div class=\"message-item " + type + "\">\n                        <div class=\"message-avatar\">\n                            <div>\n                                <div class=\"time\">14:50 PM  ".concat(type == 'outgoing-message' ? '<i class="ti-check"></i>' : '', "  </div>\n                            </div>\n                        </div>\n                        <div class=\"message-content\">\n                            ") + data.message + "\n                        </div>\n                    </div>");

          if (!b) {
            setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                        cursorcolor: 'rgba(66, 66, 66, 0.20)',
                        cursorwidth: "4px",
                        cursorborder: '0px'
                      }).resize();

                    case 1:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            })), 200);
          } else {
            setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      chat_body.scrollTop(chat_body.get(0).scrollHeight, -1).niceScroll({
                        cursorcolor: 'rgba(66, 66, 66, 0.20)',
                        cursorwidth: "4px",
                        cursorborder: '0px'
                      }).resize();

                    case 1:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            })), 5);
          } //    Update messagein chat list;


          var chatItem = $('.open-chat .users-list-body p');

          if (chatItem.length) {
            chatItem[0].innerText = data.message;
          }
        }
      });

      _defineProperty(this, "addContact", function (data) {
        var friendBody = document.querySelector('.sidebar-body #friendListContainer');
        if (!friendBody) return false;
        var node = "<div class=\"profile\">\n                                <figure class=\"avatar\">\n                                    <img src=\"".concat(data.friend.image, "\" class=\"rounded-circle\" alt=\"image\">\n                                </figure>\n                            </div>\n                            <div class=\"users-list-body\">\n                                <div>\n                                    <h5>").concat(data.name, "</h5>\n                                    <p>").concat(data.friend.phone, "</p>\n                                </div>\n                                <div class=\"users-list-action\">\n                                    <div class=\"action-toggle\">\n                                        <div class=\"dropdown\">\n                                            <a data-toggle=\"dropdown\" href=\"#\">\n                                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-more-horizontal\"><circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle></svg>\n                                            </a>\n                                            <div class=\"dropdown-menu dropdown-menu-right\">\n                                                <a href=\"#\" class=\"dropdown-item\">New chat</a>\n                                                <a href=\"#\" data-navigation-target=\"contact-information\" class=\"dropdown-item\">Profile</a>\n                                                <div class=\"dropdown-divider\"></div>\n                                                <a href=\"#\" class=\"dropdown-item text-danger\">Block</a>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>");
        var li = document.createElement('li');
        li.setAttribute('class', "list-group-item chatListItem-class");
        li.setAttribute('data-navigation-target', 'chats');
        li.setAttribute('data-friend-id', "".concat(data.friend._id));
        li.innerHTML = node;
        var fnd = document.querySelector("#friendListContainer [data-friend-id~='".concat(data.friend._id, "']"));

        if (fnd) {
          fnd.remove();
        }

        var i = 0;

        do {
          var chield = friendBody.children[i];

          if (chield) {
            console.log(' I am executed');

            if (chield.innerText >= data.name) {
              friendBody.insertBefore(li, chield);
              break;
            }
          } else {
            friendBody.append(li);
            break;
          }

          i++;
        } while (friendBody.children.length + 1 > i);

        var chatFnd = document.querySelector("#chatListContainer [data-friend-id~='".concat(data.friend._id, "']"));

        if (chatFnd) {
          chatFnd.querySelector('h5').innerText = data.name;
        }

        return true;
      });

      _defineProperty(this, "profile", function (data) {
        var contactInformation = document.getElementById('contact-information');
        if (!data || !contactInformation) return false; // data = {email: "ncmaurya99@gmail.com",
        // friend:{
        //     about: "Hey I am using chatX.",
        //      active: "2021-02-26T12:18:44.675Z",
        //      city: null,
        //      image: "http://localhost:3000/users/profile/default.jpg",
        //      phone: 7054468089,
        //      website: null,
        //     code : 91,
        //      _id: "6033d2ef03ff005fb0b8b759",
        // },
        // id: "6038d3f628fcf7c0744a1c20",
        // name: "Navneet Chandra Maurya",
        // user: "6033d2d403ff005fb0b8b758",
        // __v: 0,
        // _id: "6038d3f628fcf7c0744a1c20"
        //  };

        var node = "<header>\n                        <span>Profile</span>\n                        <ul class=\"list-inline\">\n                            <li class=\"list-inline-item\">\n                                <a href=\"#\" class=\"btn btn-outline-light text-danger sidebar-close\">\n                                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-x\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg>\n                                </a>\n                            </li>\n                        </ul>\n                    </header>\n                    <div class=\"sidebar-body\" style=\"overflow: hidden; outline: none; touch-action: none;\" tabindex=\"6\">\n                        <div class=\"pl-4 pr-4\">\n                            <div class=\"text-center\">\n                                <figure class=\"avatar avatar-xl mb-4\">\n                                    <img src=\"".concat(data.friend.image, "\" id=\"profileImage\" class=\"rounded-circle\" alt=\"image\">\n                                </figure>\n                                <h5 class=\"mb-1\" id=\"profileName\">").concat(data.name, "</h5>\n                                <small class=\"text-muted font-italic\">Last seen: ").concat(data.friend.active, "</small>\n                                <ul class=\"nav nav-tabs justify-content-center mt-5\" id=\"myTab\" role=\"tablist\">\n                                    <li class=\"nav-item\">\n                                        <a class=\"nav-link active\" id=\"home-tab\" data-toggle=\"tab\" href=\"#home\" role=\"tab\" aria-controls=\"home\" aria-selected=\"true\">About</a>\n                                    </li>\n                                    <li class=\"nav-item\">\n                                        <a class=\"nav-link\" id=\"profile-tab\" data-toggle=\"tab\" href=\"#profile\" role=\"tab\" aria-controls=\"profile\" aria-selected=\"false\">Media</a>\n                                    </li>\n                                </ul>\n                            </div>\n                            <div class=\"tab-content\" id=\"myTabContent\">\n                                <div class=\"tab-pane fade show active\" id=\"home\" role=\"tabpanel\" aria-labelledby=\"home-tab\">\n                                    <p class=\"text-muted\" id=\"profileAbout\"></p>\n                                    <div class=\"mt-4 mb-4\">\n                                        <h6>Phone</h6>\n                                        <p class=\"text-muted\" id=\"profileNumber\">(+").concat(data.friend.code, ") ").concat(data.friend.phone, "</p>\n                                    </div>\n             ").concat(data.friend.city ? "<div class=\"mt-4 mb-4\">\n                                        <h6>City</h6>\n                                        <p class=\"text-muted\" id=\"profileCity\">".concat(data.friend.city, "</p>\n                                    </div>") : '<div></div>', "\n             ").concat(data.friend.city ? "<div class=\"mt-4 mb-4\">\n                                        <h6>Website</h6>\n                                        <p class=\"text-muted\" id=\"profileCity\">".concat(data.friend.website, "</p>\n                                    </div>") : '<div></div>', "\n<!--                                    <div class=\"mt-4 mb-4\">-->\n<!--                                        <h6 class=\"mb-3\">Social media accounts</h6>-->\n<!--                                        <ul class=\"list-inline social-links\">-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-facebook\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Facebook\">-->\n<!--                                                    <i class=\"fa fa-facebook\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-twitter\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Twitter\">-->\n<!--                                                    <i class=\"fa fa-twitter\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-dribbble\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Dribbble\">-->\n<!--                                                    <i class=\"fa fa-dribbble\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-whatsapp\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Whatsapp\">-->\n<!--                                                    <i class=\"fa fa-whatsapp\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-linkedin\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Linkedin\">-->\n<!--                                                    <i class=\"fa fa-linkedin\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-google\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Google\">-->\n<!--                                                    <i class=\"fa fa-google\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-behance\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Behance\">-->\n<!--                                                    <i class=\"fa fa-behance\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-instagram\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Instagram\">-->\n<!--                                                    <i class=\"fa fa-instagram\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                        </ul>-->\n<!--                                    </div>-->\n<!--                                    <div class=\"mt-4 mb-4\">-->\n<!--                                        <h6 class=\"mb-3\">Settings</h6>-->\n<!--                                        <div class=\"form-group\">-->\n<!--                                            <div class=\"form-item custom-control custom-switch\">-->\n<!--                                                <input type=\"checkbox\" class=\"custom-control-input\" id=\"customSwitch11\">-->\n<!--                                                <label class=\"custom-control-label\" for=\"customSwitch11\">Block</label>-->\n<!--                                            </div>-->\n<!--                                        </div>-->\n<!--                                        <div class=\"form-group\">-->\n<!--                                            <div class=\"form-item custom-control custom-switch\">-->\n<!--                                                <input type=\"checkbox\" class=\"custom-control-input\" checked=\"\" id=\"customSwitch12\">-->\n<!--                                                <label class=\"custom-control-label\" for=\"customSwitch12\">Mute</label>-->\n<!--                                            </div>-->\n<!--                                        </div>-->\n<!--                                        <div class=\"form-group\">-->\n<!--                                            <div class=\"form-item custom-control custom-switch\">-->\n<!--                                                <input type=\"checkbox\" class=\"custom-control-input\" id=\"customSwitch13\">-->\n<!--                                                <label class=\"custom-control-label\" for=\"customSwitch13\">Get-->\n<!--                                                    notification</label>-->\n<!--                                            </div>-->\n<!--                                        </div>-->\n<!--                                    </div>-->\n                                </div>\n                                <div class=\"tab-pane fade\" id=\"profile\" role=\"tabpanel\" aria-labelledby=\"profile-tab\">\n                                    <h6 class=\"mb-3 d-flex align-items-center justify-content-between\">\n                                        <span>Recent Files</span>\n                                        <a href=\"#\" class=\"btn btn-link small\">\n                                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-upload mr-2\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"17 8 12 3 7 8\"></polyline><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"15\"></line></svg> Upload\n                                        </a>\n                                    </h6>\n                                    <div>\n                                        <ul class=\"list-group list-group-flush\">\n                                            <li class=\"list-group-item pl-0 pr-0 d-flex align-items-center\">\n                                                <a href=\"#\">\n                                                    <i class=\"fa fa-file-pdf-o text-danger mr-2\"></i> report4221.pdf\n                                                </a>\n                                            </li>\n                                            <li class=\"list-group-item pl-0 pr-0 d-flex align-items-center\">\n                                                <a href=\"#\">\n                                                    <i class=\"fa fa-image text-muted mr-2\"></i> avatar_image.png\n                                                </a>\n                                            </li>\n                                            <li class=\"list-group-item pl-0 pr-0 d-flex align-items-center\">\n                                                <a href=\"#\">\n                                                    <i class=\"fa fa-file-excel-o text-success mr-2\"></i>\n                                                    excel_report_file2020.xlsx\n                                                </a>\n                                            </li>\n                                            <li class=\"list-group-item pl-0 pr-0 d-flex align-items-center\">\n                                                <a href=\"#\">\n                                                    <i class=\"fa fa-file-text-o text-warning mr-2\"></i> articles342133.txt\n                                                </a>\n                                            </li>\n                                        </ul>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>");
        contactInformation.innerHTML = node;
        contactInformation.classList.add('active');
        return true;
      });

      _defineProperty(this, "me", function (data) {
        var contactInformation = document.getElementById('contact-information');
        if (!data || !contactInformation) return false; // about: "Hey I am using chatX."
        // active: "2021-03-06T09:00:02.072Z"
        // city: null
        // code: 91
        // createdAt: "2021-02-22T15:42:41.170Z"
        // image: "http://localhost:3000/users/profile/default.jpg"
        // name: "Mr. User"
        // phone: 7054468089
        // role: "user"
        // website: null

        console.log(data);
        var node = "<header>\n                        <span>Profile</span>\n                        <ul class=\"list-inline\">\n                            <li class=\"list-inline-item\">\n                                <a href=\"#\" class=\"btn btn-outline-light text-danger sidebar-close\">\n                                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-x\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg>\n                                </a>\n                            </li>\n                        </ul>\n                    </header>\n                    <div class=\"sidebar-body\" style=\"overflow: hidden; outline: none; touch-action: none;\" tabindex=\"6\">\n                        <div class=\"pl-4 pr-4\">\n                            <div class=\"text-center\">\n                                <figure class=\"avatar avatar-xl mb-4\">\n                                    <img src=\"".concat(data.image, "\" id=\"profileImage\" class=\"rounded-circle\" alt=\"image\">\n                                </figure>\n                                <h5 class=\"mb-1\" id=\"profileName\">").concat(data.name, "</h5>\n                                <small class=\"text-muted font-italic\">Last seen: ").concat(data.active, "</small>\n                                <ul class=\"nav nav-tabs justify-content-center mt-5\" id=\"myTab\" role=\"tablist\">\n                                    <li class=\"nav-item\">\n                                        <a class=\"nav-link active\" id=\"home-tab\" data-toggle=\"tab\" href=\"#home\" role=\"tab\" aria-controls=\"home\" aria-selected=\"true\">About</a>\n                                    </li>\n                                    <li class=\"nav-item\">\n                                        <a class=\"nav-link\" id=\"profile-tab\" data-toggle=\"tab\" href=\"#profile\" role=\"tab\" aria-controls=\"profile\" aria-selected=\"false\">Media</a>\n                                    </li>\n                                </ul>\n                            </div>\n                            <div class=\"tab-content\" id=\"myTabContent\">\n                                <div class=\"tab-pane fade show active\" id=\"home\" role=\"tabpanel\" aria-labelledby=\"home-tab\">\n                                    <p class=\"text-muted\" id=\"profileAbout\"></p>\n                                    <div class=\"mt-4 mb-4\">\n                                        <h6>Phone</h6>\n                                        <p class=\"text-muted\" id=\"profileNumber\">(+").concat(data.code, ") ").concat(data.phone, "</p>\n                                    </div>\n             ").concat(data.city ? "<div class=\"mt-4 mb-4\">\n                                        <h6>City</h6>\n                                        <p class=\"text-muted\" id=\"profileCity\">".concat(data.city, "</p>\n                                    </div>") : '<div></div>', "\n             ").concat(data.city ? "<div class=\"mt-4 mb-4\">\n                                        <h6>Website</h6>\n                                        <p class=\"text-muted\" id=\"profileCity\">".concat(data.website, "</p>\n                                    </div>") : '<div></div>', "\n<!--                                    <div class=\"mt-4 mb-4\">-->\n<!--                                        <h6 class=\"mb-3\">Social media accounts</h6>-->\n<!--                                        <ul class=\"list-inline social-links\">-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-facebook\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Facebook\">-->\n<!--                                                    <i class=\"fa fa-facebook\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-twitter\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Twitter\">-->\n<!--                                                    <i class=\"fa fa-twitter\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-dribbble\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Dribbble\">-->\n<!--                                                    <i class=\"fa fa-dribbble\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-whatsapp\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Whatsapp\">-->\n<!--                                                    <i class=\"fa fa-whatsapp\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-linkedin\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Linkedin\">-->\n<!--                                                    <i class=\"fa fa-linkedin\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-google\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Google\">-->\n<!--                                                    <i class=\"fa fa-google\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-behance\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Behance\">-->\n<!--                                                    <i class=\"fa fa-behance\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                            <li class=\"list-inline-item\">-->\n<!--                                                <a href=\"#\" class=\"btn btn-sm btn-floating btn-instagram\" data-toggle=\"tooltip\" title=\"\" data-original-title=\"Instagram\">-->\n<!--                                                    <i class=\"fa fa-instagram\"></i>-->\n<!--                                                </a>-->\n<!--                                            </li>-->\n<!--                                        </ul>-->\n<!--                                    </div>-->\n<!--                                    <div class=\"mt-4 mb-4\">-->\n<!--                                        <h6 class=\"mb-3\">Settings</h6>-->\n<!--                                        <div class=\"form-group\">-->\n<!--                                            <div class=\"form-item custom-control custom-switch\">-->\n<!--                                                <input type=\"checkbox\" class=\"custom-control-input\" id=\"customSwitch11\">-->\n<!--                                                <label class=\"custom-control-label\" for=\"customSwitch11\">Block</label>-->\n<!--                                            </div>-->\n<!--                                        </div>-->\n<!--                                        <div class=\"form-group\">-->\n<!--                                            <div class=\"form-item custom-control custom-switch\">-->\n<!--                                                <input type=\"checkbox\" class=\"custom-control-input\" checked=\"\" id=\"customSwitch12\">-->\n<!--                                                <label class=\"custom-control-label\" for=\"customSwitch12\">Mute</label>-->\n<!--                                            </div>-->\n<!--                                        </div>-->\n<!--                                        <div class=\"form-group\">-->\n<!--                                            <div class=\"form-item custom-control custom-switch\">-->\n<!--                                                <input type=\"checkbox\" class=\"custom-control-input\" id=\"customSwitch13\">-->\n<!--                                                <label class=\"custom-control-label\" for=\"customSwitch13\">Get-->\n<!--                                                    notification</label>-->\n<!--                                            </div>-->\n<!--                                        </div>-->\n<!--                                    </div>-->\n                                </div>\n                                <div class=\"tab-pane fade\" id=\"profile\" role=\"tabpanel\" aria-labelledby=\"profile-tab\">\n                                    <h6 class=\"mb-3 d-flex align-items-center justify-content-between\">\n                                        <span>Recent Files</span>\n                                        <a href=\"#\" class=\"btn btn-link small\">\n                                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-upload mr-2\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"17 8 12 3 7 8\"></polyline><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"15\"></line></svg> Upload\n                                        </a>\n                                    </h6>\n                                    <div>\n                                        <ul class=\"list-group list-group-flush\">\n                                            <li class=\"list-group-item pl-0 pr-0 d-flex align-items-center\">\n                                                <a href=\"#\">\n                                                    <i class=\"fa fa-file-pdf-o text-danger mr-2\"></i> report4221.pdf\n                                                </a>\n                                            </li>\n                                            <li class=\"list-group-item pl-0 pr-0 d-flex align-items-center\">\n                                                <a href=\"#\">\n                                                    <i class=\"fa fa-image text-muted mr-2\"></i> avatar_image.png\n                                                </a>\n                                            </li>\n                                            <li class=\"list-group-item pl-0 pr-0 d-flex align-items-center\">\n                                                <a href=\"#\">\n                                                    <i class=\"fa fa-file-excel-o text-success mr-2\"></i>\n                                                    excel_report_file2020.xlsx\n                                                </a>\n                                            </li>\n                                            <li class=\"list-group-item pl-0 pr-0 d-flex align-items-center\">\n                                                <a href=\"#\">\n                                                    <i class=\"fa fa-file-text-o text-warning mr-2\"></i> articles342133.txt\n                                                </a>\n                                            </li>\n                                        </ul>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>");
        contactInformation.innerHTML = node;
        contactInformation.classList.add('active');
        return true;
      });
    };

    module.exports = new Items();
  }, {}],
  "messageapp/UILocalDb.js": [function (require, module, exports) {
    "use strict";

    var _Items = _interopRequireDefault(require("./Items"));

    var _DataBase = _interopRequireDefault(require("./DataBase"));

    var _SynceFromServer = _interopRequireDefault(require("./SynceFromServer"));

    var _axios = _interopRequireDefault(require("axios"));

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var UILocalDb = function UILocalDb() {
      var _this = this;

      _classCallCheck(this, UILocalDb);

      _defineProperty(this, "OPENEDFRIEND", null);

      _defineProperty(this, "friendList", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _DataBase.default.readAll('friendList', 'friendList');

              case 3:
                data = _context.sent;
                console.log(data);

                if (data.length > 0) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", false);

              case 7:
                data.forEach(function (item, i) {
                  _Items.default.addFriendList(item);
                });
                _context.next = 14;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                return _context.abrupt("return", false);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 10]]);
      })));

      _defineProperty(this, "chatList", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var data;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return _DataBase.default.readAll('chatList', 'chatList');

              case 3:
                data = _context3.sent;

                if (data.length > 0) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", false);

              case 6:
                _context3.next = 8;
                return Promise.all(data.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(item, i) {
                    var fnd;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return _DataBase.default.read('friendList', 'friendList', data[i].friend._id);

                          case 2:
                            fnd = _context2.sent;
                            if (fnd) data[i].friend.name = fnd.name;
                            fnd = null;

                          case 5:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x, _x2) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 8:
                data.forEach(function (item, i) {
                  _Items.default.addChatlist(item);
                });
                _context3.next = 15;
                break;

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                return _context3.abrupt("return", false);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 11]]);
      })));

      _defineProperty(this, "openChat", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var friendId,
            data,
            friend,
            messages,
            _args4 = arguments;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                friendId = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : null;
                _context4.prev = 1;

                if (friendId) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt("return", false);

              case 4:
                _context4.next = 6;
                return _DataBase.default.read('chatList', 'chatList', friendId);

              case 6:
                data = _context4.sent;
                _context4.next = 9;
                return _DataBase.default.read('friendList', 'friendList', friendId);

              case 9:
                friend = _context4.sent;

                if (!data) {
                  _context4.next = 17;
                  break;
                }

                if (friend) data.friend.name = friend.name;
                data.unseen = 0;
                _context4.next = 15;
                return _DataBase.default.update('chatList', 'chatList', data);

              case 15:
                _context4.next = 19;
                break;

              case 17:
                friend.friend.name = friend.name;
                data = friend;

              case 19:
                _this.OPENEDFRIEND = friendId;
                _context4.next = 22;
                return _Items.default.openChat(data);

              case 22:
                _context4.next = 24;
                return _DataBase.default.read('messages', 'messages', friendId);

              case 24:
                messages = _context4.sent;

                if (messages) {
                  _context4.next = 29;
                  break;
                }

                _context4.next = 28;
                return _SynceFromServer.default.messageOfFriend(friendId);

              case 28:
                messages = _context4.sent;

              case 29:
                if (messages) {
                  _context4.next = 31;
                  break;
                }

                return _context4.abrupt("return", true);

              case 31:
                messages.data.forEach(function (item, i) {
                  if (item.sender._id == friendId) {
                    _Items.default.addMessage(item, null, true);
                  } else {
                    _Items.default.addMessage(item, 'outgoing-message', true);
                  }
                });
                _context4.next = 38;
                break;

              case 34:
                _context4.prev = 34;
                _context4.t0 = _context4["catch"](1);
                console.log(_context4.t0);
                return _context4.abrupt("return", false);

              case 38:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[1, 34]]);
      })));

      _defineProperty(this, "me", function () {
        // about: "Hey I am using chatX."
        // active: "2021-03-06T09:00:02.072Z"
        // city: null
        // code: 91
        // createdAt: "2021-02-22T15:42:41.170Z"
        // image: "http://localhost:3000/users/profile/default.jpg"
        // name: "Mr. User"
        // phone: 7054468089
        // role: "user"
        // website: null
        // __v: 0
        // _id: "6033d2ef03ff005fb0b8b759"
        _Items.default.me(window.user);
      });

      _defineProperty(this, "sendMessage", /*#__PURE__*/function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
          var res, me;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (!(_typeof(data) != 'object')) {
                    _context5.next = 2;
                    break;
                  }

                  return _context5.abrupt("return", false);

                case 2:
                  _context5.prev = 2;
                  _context5.next = 5;
                  return _SynceFromServer.default.sendMessage(data);

                case 5:
                  res = _context5.sent;
                  _context5.next = 8;
                  return _DataBase.default.read('messages', 'messages', data.receiver);

                case 8:
                  me = _context5.sent; // console.log(me);

                  if (me) {
                    me.data.push(res);
                  } else {
                    me = {
                      _id: data.receiver,
                      data: [res]
                    };
                  } // console.log(me)


                  _context5.next = 12;
                  return _DataBase.default.update('messages', 'messages', me);

                case 12:
                  return _context5.abrupt("return", res);

                case 15:
                  _context5.prev = 15;
                  _context5.t0 = _context5["catch"](2);
                  console.log(_context5.t0);

                case 18:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, null, [[2, 15]]);
        }));

        return function (_x3) {
          return _ref5.apply(this, arguments);
        };
      }());

      _defineProperty(this, "addToChat", /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(friendId, message) {
          var unseen,
              data,
              d,
              fnd,
              _fnd,
              _args6 = arguments;

          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  unseen = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : null;
                  _context6.next = 3;
                  return _DataBase.default.read('chatList', 'chatList', friendId);

                case 3:
                  data = _context6.sent;
                  d = {
                    friend: {}
                  };

                  if (data) {
                    _context6.next = 22;
                    break;
                  }

                  _context6.next = 8;
                  return _DataBase.default.read('friendList', 'friendList', friendId);

                case 8:
                  fnd = _context6.sent;

                  if (fnd) {
                    _context6.next = 11;
                    break;
                  }

                  return _context6.abrupt("return", false);

                case 11:
                  d.friend.name = fnd.name;
                  d.friend.image = fnd.friend.image;
                  d.friend.phone = fnd.friend.phone;
                  d.friend._id = fnd.friend._id;
                  d.message = message;
                  d._id = fnd.friend._id;
                  d.sender = fnd.user;
                  d.receiver = friendId;
                  data = d;
                  _context6.next = 26;
                  break;

                case 22:
                  _context6.next = 24;
                  return _DataBase.default.read('friendList', 'friendList', data.friend._id);

                case 24:
                  _fnd = _context6.sent;
                  if (_fnd) data.friend.name = _fnd.name;

                case 26:
                  data.message = message;
                  _context6.next = 29;
                  return _DataBase.default.update('chatList', 'chatList', data);

                case 29:
                  if (unseen) data.unseen = unseen;

                  _Items.default.addToChat(data);

                case 31:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        return function (_x4, _x5) {
          return _ref6.apply(this, arguments);
        };
      }());

      _defineProperty(this, "addToChatnew", /*#__PURE__*/function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(friendId, message) {
          var data, unseen, fnd, _message;

          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  // let data = await DB.read('chatList', 'chatList', friendId);
                  data = {
                    friend: {}
                  };
                  unseen = null; // if (!data){

                  _context7.next = 4;
                  return _DataBase.default.read('friendList', 'friendList', friendId);

                case 4:
                  fnd = _context7.sent;

                  if (!fnd) {
                    _context7.next = 16;
                    break;
                  }

                  data.friend.name = fnd.name;
                  data.friend.image = fnd.friend.image;
                  data.friend.phone = fnd.friend.phone;
                  data.friend._id = fnd.friend._id;
                  data.message = message;
                  data._id = fnd.friend._id;
                  data.sender = fnd.user;
                  data.receiver = friendId;
                  _context7.next = 30;
                  break;

                case 16:
                  _context7.next = 18;
                  return _DataBase.default.read('messages', 'messages', friendId);

                case 18:
                  _message = _context7.sent;

                  if (_message) {
                    _context7.next = 21;
                    break;
                  }

                  return _context7.abrupt("return", true);

                case 21:
                  data.friend.name = _message.data[_message.data.length - 1].sender.phone;
                  data.friend.image = '/users/profile/' + _message.data[_message.data.length - 1].sender.image;
                  data.friend.phone = _message.data[_message.data.length - 1].sender.phone;
                  data.friend._id = _message.data[_message.data.length - 1].sender._id;
                  data.message = _message.data[_message.data.length - 1].message;
                  data._id = _message.data[_message.data.length - 1].sender._id;
                  data.sender = _message.data[_message.data.length - 1].sender._id;
                  data.receiver = _message.data[_message.data.length - 1].receiver;
                  unseen = _message.data.length;

                case 30:
                  // } else {
                  //     let fnd = await DB.read('friendList', 'friendList', data.friend._id);
                  //     if (fnd) data.friend.name = fnd.name;
                  // }
                  data.message = message;
                  data.unseen = unseen;
                  _context7.next = 34;
                  return _DataBase.default.update('chatList', 'chatList', data);

                case 34:
                  _Items.default.addToChat(data);

                case 35:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));

        return function (_x6, _x7) {
          return _ref7.apply(this, arguments);
        };
      }());

      _defineProperty(this, "_updateMessage", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                window.intervalId = setInterval( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                  var data, newFriends;
                  return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                      switch (_context10.prev = _context10.next) {
                        case 0:
                          _context10.next = 2;
                          return _SynceFromServer.default.newMessages();

                        case 2:
                          data = _context10.sent;

                          if (!(_typeof(data) != 'object' || !data.total)) {
                            _context10.next = 5;
                            break;
                          }

                          return _context10.abrupt("return", false);

                        case 5:
                          // console.log(data)
                          newFriends = {};
                          _context10.next = 8;
                          return Promise.all(data.data.map( /*#__PURE__*/function () {
                            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(item) {
                              var localMessage;
                              return regeneratorRuntime.wrap(function _callee8$(_context8) {
                                while (1) {
                                  switch (_context8.prev = _context8.next) {
                                    case 0:
                                      _context8.next = 2;
                                      return _DataBase.default.read('messages', 'messages', item.sender._id);

                                    case 2:
                                      localMessage = _context8.sent;

                                      if (localMessage) {
                                        localMessage.data.push(item);
                                      } else {
                                        localMessage = {
                                          _id: item.sender._id,
                                          data: [item]
                                        };
                                      }

                                      _context8.next = 6;
                                      return _DataBase.default.update('messages', 'messages', localMessage);

                                    case 6:
                                      if (item.sender._id == _this.OPENEDFRIEND) {
                                        _Items.default.addMessage(item);
                                      } else {
                                        if (newFriends[item.sender._id]) {
                                          // newFriends[localMessage._id].data.push(item);
                                          newFriends[item.sender._id].message = item.message;
                                          newFriends[item.sender._id].unseen += 1;
                                        } else {
                                          newFriends[item.sender._id] = {};
                                          newFriends[item.sender._id].message = item.message;
                                          newFriends[item.sender._id].unseen = 1;
                                        }
                                      }

                                    case 7:
                                    case "end":
                                      return _context8.stop();
                                  }
                                }
                              }, _callee8);
                            }));

                            return function (_x8) {
                              return _ref10.apply(this, arguments);
                            };
                          }()));

                        case 8:
                          console.log(newFriends, "New chat");
                          _context10.next = 11;
                          return Promise.all(Object.keys(newFriends).map( /*#__PURE__*/function () {
                            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(item, i) {
                              var chatList, chatTags, chatContainer, _i, profileTag;

                              return regeneratorRuntime.wrap(function _callee9$(_context9) {
                                while (1) {
                                  switch (_context9.prev = _context9.next) {
                                    case 0:
                                      _context9.next = 2;
                                      return _DataBase.default.read('chatList', 'chatList', item);

                                    case 2:
                                      chatList = _context9.sent;

                                      if (!chatList) {
                                        _context9.next = 21;
                                        break;
                                      }

                                      chatTags = document.querySelectorAll('#chatListContainer .chatListItem-class ');
                                      chatContainer = document.querySelector('.sidebar-body #chatListContainer');
                                      console.log(chatTags);

                                      if (!chatTags) {
                                        _context9.next = 17;
                                        break;
                                      }

                                      _i = 0;

                                    case 9:
                                      if (!(_i < chatTags.length)) {
                                        _context9.next = 17;
                                        break;
                                      }

                                      profileTag = chatTags[_i];

                                      if (!(profileTag.dataset.friendId === item)) {
                                        _context9.next = 14;
                                        break;
                                      }

                                      profileTag.remove();
                                      return _context9.abrupt("break", 17);

                                    case 14:
                                      _i++;
                                      _context9.next = 9;
                                      break;

                                    case 17:
                                      _context9.next = 19;
                                      return _this.addToChat(item, newFriends[item].message, chatList.unseen);

                                    case 19:
                                      _context9.next = 23;
                                      break;

                                    case 21:
                                      _context9.next = 23;
                                      return _this.addToChatnew(item, newFriends[item].message);

                                    case 23:
                                    case "end":
                                      return _context9.stop();
                                  }
                                }
                              }, _callee9);
                            }));

                            return function (_x9, _x10) {
                              return _ref11.apply(this, arguments);
                            };
                          }()));

                        case 11:
                        case "end":
                          return _context10.stop();
                      }
                    }
                  }, _callee10);
                })), 2000);
                _context11.next = 7;
                break;

              case 4:
                _context11.prev = 4;
                _context11.t0 = _context11["catch"](0);
                return _context11.abrupt("return", false);

              case 7:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[0, 4]]);
      })));

      _defineProperty(this, "addContact", /*#__PURE__*/function () {
        var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(contact) {
          var res;
          return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.prev = 0;

                  if (contact) {
                    _context12.next = 3;
                    break;
                  }

                  return _context12.abrupt("return", false);

                case 3:
                  _context12.next = 5;
                  return _SynceFromServer.default.addContact(contact);

                case 5:
                  res = _context12.sent;

                  if (!(res.status == 'success')) {
                    _context12.next = 9;
                    break;
                  }

                  _Items.default.addContact(res.data);

                  return _context12.abrupt("return", res);

                case 9:
                  _context12.next = 15;
                  break;

                case 11:
                  _context12.prev = 11;
                  _context12.t0 = _context12["catch"](0);
                  console.log(_context12.t0);
                  return _context12.abrupt("return", null);

                case 15:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, null, [[0, 11]]);
        }));

        return function (_x11) {
          return _ref12.apply(this, arguments);
        };
      }());

      _defineProperty(this, "openProfile", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
        var friendId,
            _args14 = arguments;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                friendId = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : null;
                return _context14.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(res, rej) {
                    var friend;
                    return regeneratorRuntime.wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            if (!friendId) friendId = _this.OPENEDFRIEND;
                            _context13.prev = 1;
                            _context13.next = 4;
                            return _DataBase.default.read('friendList', 'friendList', friendId);

                          case 4:
                            friend = _context13.sent;

                            if (!friend) {
                              _context13.next = 7;
                              break;
                            }

                            return _context13.abrupt("return", res(friend));

                          case 7:
                            return _context13.abrupt("return", res(null));

                          case 10:
                            _context13.prev = 10;
                            _context13.t0 = _context13["catch"](1);
                            rej(_context13.t0);

                          case 13:
                          case "end":
                            return _context13.stop();
                        }
                      }
                    }, _callee13, null, [[1, 10]]);
                  }));

                  return function (_x12, _x13) {
                    return _ref14.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      })));
    };

    module.exports = new UILocalDb();
  }, {
    "./Items": "messageapp/Items.js",
    "./DataBase": "messageapp/DataBase.js",
    "./SynceFromServer": "messageapp/SynceFromServer.js",
    "axios": "../node_modules/axios/index.js"
  }],
  "../node_modules/events/events.js": [function (require, module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    'use strict';

    var R = (typeof Reflect === "undefined" ? "undefined" : _typeof2(Reflect)) === 'object' ? Reflect : null;
    var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;

    if (R && typeof R.ownKeys === 'function') {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target);
      };
    }

    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }

    var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
      return value !== value;
    };

    function EventEmitter() {
      EventEmitter.init.call(this);
    }

    module.exports = EventEmitter;
    module.exports.once = once; // Backwards-compat with node 0.10.x

    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.

    var defaultMaxListeners = 10;

    function checkListener(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + _typeof2(listener));
      }
    }

    Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
      enumerable: true,
      get: function get() {
        return defaultMaxListeners;
      },
      set: function set(arg) {
        if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
        }

        defaultMaxListeners = arg;
      }
    });

    EventEmitter.init = function () {
      if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
      }

      this._maxListeners = this._maxListeners || undefined;
    }; // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.


    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
      }

      this._maxListeners = n;
      return this;
    };

    function _getMaxListeners(that) {
      if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }

    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };

    EventEmitter.prototype.emit = function emit(type) {
      var args = [];

      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      var doError = type === 'error';
      var events = this._events;
      if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

      if (doError) {
        var er;
        if (args.length > 0) er = args[0];

        if (er instanceof Error) {
          // Note: The comments on the `throw` lines are intentional, they show
          // up in Node's output if this results in an unhandled exception.
          throw er; // Unhandled 'error' event
        } // At least give some kind of context to the user


        var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
        err.context = er;
        throw err; // Unhandled 'error' event
      }

      var handler = events[type];
      if (handler === undefined) return false;

      if (typeof handler === 'function') {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);

        for (var i = 0; i < len; ++i) {
          ReflectApply(listeners[i], this, args);
        }
      }

      return true;
    };

    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;

      if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener !== undefined) {
          target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object

          events = target._events;
        }

        existing = events[type];
      }

      if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        } // Check for listener leak


        m = _getMaxListeners(target);

        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true; // No error code for this since it is a Warning
          // eslint-disable-next-line no-restricted-syntax

          var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }

      return target;
    }

    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0) return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }

    function _onceWrap(target, type, listener) {
      var state = {
        fired: false,
        wrapFn: undefined,
        target: target,
        type: type,
        listener: listener
      };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }

    EventEmitter.prototype.once = function once(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };

    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    }; // Emits a 'removeListener' event if and only if the listener was removed.


    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === undefined) return this;
      list = events[type];
      if (list === undefined) return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0) this._events = Object.create(null);else {
          delete events[type];
          if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0) return this;
        if (position === 0) list.shift();else {
          spliceOne(list, position);
        }
        if (list.length === 1) events[type] = list[0];
        if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === undefined) return this; // not listening for removeListener, no need to emit

      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
        }

        return this;
      } // emit removeListener for all listeners on all events


      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;

        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }

        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === undefined) return [];
      var evlistener = events[type];
      if (evlistener === undefined) return [];
      if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }

    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };

    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };

    EventEmitter.listenerCount = function (emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };

    EventEmitter.prototype.listenerCount = listenerCount;

    function listenerCount(type) {
      var events = this._events;

      if (events !== undefined) {
        var evlistener = events[type];

        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener !== undefined) {
          return evlistener.length;
        }
      }

      return 0;
    }

    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };

    function arrayClone(arr, n) {
      var copy = new Array(n);

      for (var i = 0; i < n; ++i) {
        copy[i] = arr[i];
      }

      return copy;
    }

    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++) {
        list[index] = list[index + 1];
      }

      list.pop();
    }

    function unwrapListeners(arr) {
      var ret = new Array(arr.length);

      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }

      return ret;
    }

    function once(emitter, name) {
      return new Promise(function (resolve, reject) {
        function eventListener() {
          if (errorListener !== undefined) {
            emitter.removeListener('error', errorListener);
          }

          resolve([].slice.call(arguments));
        }

        ;
        var errorListener; // Adding an error listener is not optional because
        // if an error is thrown on an event emitter we cannot
        // guarantee that the actual event we are waiting will
        // be fired. The result could be a silent way to create
        // memory or file descriptor leaks, which is something
        // we should avoid.

        if (name !== 'error') {
          errorListener = function errorListener(err) {
            emitter.removeListener(name, eventListener);
            reject(err);
          };

          emitter.once('error', errorListener);
        }

        emitter.once(name, eventListener);
      });
    }
  }, {}],
  "messageapp/StartUI.js": [function (require, module, exports) {
    "use strict";

    var _axios = _interopRequireDefault(require("axios"));

    var _Items = _interopRequireDefault(require("./Items"));

    var _UILocalDb = _interopRequireDefault(require("./UILocalDb"));

    var events = _interopRequireWildcard(require("events"));

    var _SynceFromServer = _interopRequireDefault(require("./SynceFromServer"));

    function _getRequireWildcardCache() {
      if (typeof WeakMap !== "function") return null;
      var cache = new WeakMap();

      _getRequireWildcardCache = function _getRequireWildcardCache() {
        return cache;
      };

      return cache;
    }

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      }

      if (obj === null || _typeof2(obj) !== "object" && typeof obj !== "function") {
        return {
          default: obj
        };
      }

      var cache = _getRequireWildcardCache();

      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }

      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }

      newObj.default = obj;

      if (cache) {
        cache.set(obj, newObj);
      }

      return newObj;
    }

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var StartUI = function StartUI() {
      var _this = this;

      _classCallCheck(this, StartUI);

      _defineProperty(this, "startApp", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _SynceFromServer.default.start();

              case 3:
                _context.next = 5;
                return _UILocalDb.default.friendList();

              case 5:
                _context.next = 7;
                return _UILocalDb.default.chatList();

              case 7:
                _this.me();

                _context.next = 10;
                return _UILocalDb.default._updateMessage();

              case 10:
                _this.openChat();

                _this.addContact();

                return _context.abrupt("return", true);

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0, 'From StartUI');
                return _context.abrupt("return", false);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 15]]);
      })));

      _defineProperty(this, "getParentNode", function (element, target) {
        for (; element && element !== document; element = element.parentNode) {
          if (element.matches('.' + target)) return element;
        }

        return null;
      });

      _defineProperty(this, "openChat", function () {
        var friendList = document.querySelector('.sidebar-body #friendListContainer');
        var chatList = document.querySelector('.sidebar-body #chatListContainer');
        if (!friendList || !chatList) return false;

        var dragDrop = function dragDrop() {
          var container = document.querySelector('.chat-body');
          if (!container) return false;
          var newNode = document.createElement("div");
          newNode.className = 'dropHover';
          container.style.position = 'relative';
          container.append(newNode); // container.setAttribute('draggable', true);

          console.log('called');
          container.addEventListener('dragover', function (event) {
            event.preventDefault();
            console.log('start');
          });
          container.addEventListener('dragenter', function (event) {
            event.preventDefault();
            console.log('end');
          });
          container.addEventListener('dragleave', function (event) {
            event.preventDefault();
            console.log('end');
          });
          container.addEventListener('drop', function (event) {
            event.preventDefault();
            console.log(event.dataTransfer.files[0]);
            var file = event.dataTransfer.files[0];

            if (file.type.match(/^image/)) {
              console.log("image");
            }

            if (file.type.match(/^video/)) {
              console.log("video");
            }

            if (file.type.match(/pdf$/)) {
              console.log("pdf");
            }
          }); // const isLink = event.dataTransfer.types.includes("text/uri-list");
          // if (isLink) {
          //     event.preventDefault();
          // }
        };

        var chatOpener = /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
            var chatItem, friendId;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    chatItem = _this.getParentNode(event.target, 'chatListItem-class');

                    if (chatItem) {
                      _context2.next = 4;
                      break;
                    }

                    return _context2.abrupt("return", false);

                  case 4:
                    friendId = chatItem.dataset.friendId;

                    if (friendId) {
                      _context2.next = 7;
                      break;
                    }

                    return _context2.abrupt("return", false);

                  case 7:
                    _context2.next = 9;
                    return _UILocalDb.default.openChat(friendId);

                  case 9:
                    _this.senMessage(friendId);

                    $('.layout .content .sidebar-group').removeClass('mobile-open');
                    chatItem.classList.add("open-chat");
                    dragDrop();

                    _this.openProfile();

                    return _context2.abrupt("return", true);

                  case 17:
                    _context2.prev = 17;
                    _context2.t0 = _context2["catch"](0);
                    console.log(_context2.t0);
                    return _context2.abrupt("return", false);

                  case 21:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, null, [[0, 17]]);
          }));

          return function chatOpener(_x) {
            return _ref2.apply(this, arguments);
          };
        }();

        chatList.addEventListener('click', /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(event) {
            var res;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return chatOpener(event);

                  case 2:
                    res = _context3.sent;

                    if (res) {
                      $("#chatListContainer").find("li.open-chat").removeClass("open-chat");
                    }

                  case 4:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          return function (_x2) {
            return _ref3.apply(this, arguments);
          };
        }(), false);
        friendList.addEventListener('click', /*#__PURE__*/function () {
          var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(event) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return chatOpener(event);

                  case 2:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));

          return function (_x3) {
            return _ref4.apply(this, arguments);
          };
        }(), false);
      });

      _defineProperty(this, "senMessage", function (receiver) {
        var messageInput = document.querySelector('.chat-footer form');
        if (!messageInput) return true;
        messageInput.addEventListener('submit', /*#__PURE__*/function () {
          var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(event) {
            var form, message, res;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    event.preventDefault();
                    form = event.currentTarget;
                    message = form.querySelector('[type=text]');

                    if (message) {
                      _context5.next = 5;
                      break;
                    }

                    return _context5.abrupt("return", true);

                  case 5:
                    if (message.value.trim()) {
                      _context5.next = 7;
                      break;
                    }

                    return _context5.abrupt("return", true);

                  case 7:
                    _Items.default.addMessage({
                      message: message.value
                    }, 'outgoing-message');

                    _context5.next = 10;
                    return _this.addFrineToChatList(receiver, message.value);

                  case 10:
                    _context5.next = 12;
                    return _UILocalDb.default.sendMessage({
                      message: message.value,
                      receiver: receiver
                    });

                  case 12:
                    res = _context5.sent;
                    message.value = null;

                  case 14:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5);
          }));

          return function (_x4) {
            return _ref5.apply(this, arguments);
          };
        }(), false);
      });

      _defineProperty(this, "addFrineToChatList", /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(friendId, message) {
          var chatTags, chatContainer, i, profileTag;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  chatTags = document.querySelectorAll('#chatListContainer .chatListItem-class ');
                  chatContainer = document.querySelector('.sidebar-body #chatListContainer');

                  if (!(!chatTags || !chatContainer)) {
                    _context6.next = 4;
                    break;
                  }

                  return _context6.abrupt("return", false);

                case 4:
                  i = 0;

                case 5:
                  if (!(i < chatTags.length)) {
                    _context6.next = 13;
                    break;
                  }

                  profileTag = chatTags[i];

                  if (!(profileTag.dataset.friendId == friendId)) {
                    _context6.next = 10;
                    break;
                  }

                  profileTag.remove();
                  return _context6.abrupt("break", 13);

                case 10:
                  i++;
                  _context6.next = 5;
                  break;

                case 13:
                  _context6.next = 15;
                  return _UILocalDb.default.addToChat(friendId, message);

                case 15:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        return function (_x5, _x6) {
          return _ref6.apply(this, arguments);
        };
      }());

      _defineProperty(this, "addContact", function () {
        var contacxtForm = document.getElementById('add-contact');
        if (!contacxtForm) return false;
        contacxtForm.addEventListener('submit', /*#__PURE__*/function () {
          var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(event) {
            var code, number, email, name, div, data;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    event.preventDefault();
                    code = contacxtForm.querySelector('#code');
                    number = contacxtForm.querySelector('#number');
                    email = contacxtForm.querySelector('#email');
                    name = contacxtForm.querySelector('#name');

                    if (!(!code || !number || !name)) {
                      _context7.next = 7;
                      break;
                    }

                    return _context7.abrupt("return", false);

                  case 7:
                    if (!(number.value.toString().length != 10)) {
                      _context7.next = 14;
                      break;
                    }

                    div = document.createElement('div');
                    div.setAttribute('class', 'alert alert-danger text-center');
                    div.innerText = "Please provide a valid number.";
                    contacxtForm.prepend(div);
                    setTimeout(function () {
                      contacxtForm.children[0].remove();
                    }, 4000);
                    return _context7.abrupt("return", false);

                  case 14:
                    _context7.next = 16;
                    return _UILocalDb.default.addContact({
                      code: code.value.trim(),
                      number: number.value,
                      name: name.value.trim(),
                      email: email.value.trim()
                    });

                  case 16:
                    data = _context7.sent;
                    setTimeout(function () {
                      document.querySelector('#addFriends .close').click();
                    }, 3000);

                    if (data) {
                      _context7.next = 20;
                      break;
                    }

                    return _context7.abrupt("return", contacxtForm.innerHTML = "<div class=\"alert alert-danger text-center\">Operation failed<div>");

                  case 20:
                    contacxtForm.innerHTML = "<div class=\"alert alert-success text-center\">Your friend <b>".concat(data.data.name, "</b> ").concat(data.operation, ".<div>");

                  case 21:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7);
          }));

          return function (_x7) {
            return _ref7.apply(this, arguments);
          };
        }(), false);
      });

      _defineProperty(this, "openProfile", function () {
        var user = document.querySelector('.chat-header-user');
        if (!user) return false;
        user.style.cursor = 'pointer';
        user.addEventListener('click', /*#__PURE__*/function () {
          var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(event) {
            var friend;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    console.log('clicked');
                    _context8.next = 3;
                    return _UILocalDb.default.openProfile();

                  case 3:
                    friend = _context8.sent;

                    if (friend) {
                      _context8.next = 6;
                      break;
                    }

                    return _context8.abrupt("return", null);

                  case 6:
                    _Items.default.profile(friend);

                    $('.layout .content .sidebar-group').removeClass('mobile-open');
                    return _context8.abrupt("return", true);

                  case 9:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8);
          }));

          return function (_x8) {
            return _ref8.apply(this, arguments);
          };
        }(), false);
      });

      _defineProperty(this, "me", function () {
        var meDoc = document.getElementById('me');
        if (!meDoc) return false;
        meDoc.addEventListener('click', function () {
          console.log("clicked");

          _UILocalDb.default.me();
        }, false);
      });
    };

    module.exports = new StartUI();
  }, {
    "axios": "../node_modules/axios/index.js",
    "./Items": "messageapp/Items.js",
    "./UILocalDb": "messageapp/UILocalDb.js",
    "events": "../node_modules/events/events.js",
    "./SynceFromServer": "messageapp/SynceFromServer.js"
  }],
  "user/auth.js": [function (require, module, exports) {
    "use strict";

    var _axios = _interopRequireDefault(require("axios"));

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var Auth = function Auth() {
      _classCallCheck(this, Auth);

      _defineProperty(this, "login", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var form, usernameIn, passwordIn;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                form = document.getElementById('login-form');
                usernameIn = document.getElementById('username');
                passwordIn = document.getElementById('password');

                if (!(!form || !usernameIn || !passwordIn)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", false);

              case 5:
                form.addEventListener('submit', /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
                    var phone, password, keepLogedIn, res;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            e.preventDefault();
                            _context.prev = 1;
                            phone = usernameIn.value;
                            password = passwordIn.value;
                            keepLogedIn = true;

                            if (phone) {
                              _context.next = 7;
                              break;
                            }

                            return _context.abrupt("return", console.log("Provide a username"));

                          case 7:
                            if (password) {
                              _context.next = 9;
                              break;
                            }

                            return _context.abrupt("return", console.log("Provide a password"));

                          case 9:
                            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password)) {
                              _context.next = 11;
                              break;
                            }

                            return _context.abrupt("return", console.log('Password is not correct.'));

                          case 11:
                            _context.next = 13;
                            return (0, _axios.default)({
                              method: 'POST',
                              url: '/api/v0/login',
                              data: {
                                phone: phone,
                                password: password,
                                keepLogedIn: keepLogedIn
                              }
                            });

                          case 13:
                            res = _context.sent;

                            if (res.data.status === "success") {
                              window.setTimeout(function () {
                                location.assign("/");
                              }, 100);
                            }

                            _context.next = 21;
                            break;

                          case 17:
                            _context.prev = 17;
                            _context.t0 = _context["catch"](1);
                            console.log(_context.t0.response.data);
                            alert(_context.t0.response.data);

                          case 21:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, null, [[1, 17]]);
                  }));

                  return function (_x) {
                    return _ref2.apply(this, arguments);
                  };
                }(), false);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })));
    };

    module.exports = new Auth();
  }, {
    "axios": "../node_modules/axios/index.js"
  }],
  "../node_modules/validator/es/lib/util/assertString.js": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = assertString;

    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    function assertString(input) {
      var isString = typeof input === 'string' || input instanceof String;

      if (!isString) {
        var invalidType = _typeof(input);

        if (input === null) invalidType = 'null';else if (invalidType === 'object') invalidType = input.constructor.name;
        throw new TypeError("Expected a string but received a ".concat(invalidType));
      }
    }
  }, {}],
  "../node_modules/validator/es/lib/toBoolean.js": [function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = toBoolean;

    var _assertString = _interopRequireDefault(require("./util/assertString"));

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function toBoolean(str, strict) {
      (0, _assertString.default)(str);

      if (strict) {
        return str === '1' || /^true$/i.test(str);
      }

      return str !== '0' && !/^false$/i.test(str) && str !== '';
    }
  }, {
    "./util/assertString": "../node_modules/validator/es/lib/util/assertString.js"
  }],
  "index.js": [function (require, module, exports) {
    "use strict";

    require("core-js/modules/es6.array.copy-within.js");

    require("core-js/modules/es6.array.fill.js");

    require("core-js/modules/es6.array.find.js");

    require("core-js/modules/es6.array.find-index.js");

    require("core-js/modules/es7.array.flat-map.js");

    require("core-js/modules/es6.array.from.js");

    require("core-js/modules/es7.array.includes.js");

    require("core-js/modules/es6.array.iterator.js");

    require("core-js/modules/es6.array.of.js");

    require("core-js/modules/es6.array.sort.js");

    require("core-js/modules/es6.array.species.js");

    require("core-js/modules/es6.date.to-primitive.js");

    require("core-js/modules/es6.function.has-instance.js");

    require("core-js/modules/es6.function.name.js");

    require("core-js/modules/es6.map.js");

    require("core-js/modules/es6.math.acosh.js");

    require("core-js/modules/es6.math.asinh.js");

    require("core-js/modules/es6.math.atanh.js");

    require("core-js/modules/es6.math.cbrt.js");

    require("core-js/modules/es6.math.clz32.js");

    require("core-js/modules/es6.math.cosh.js");

    require("core-js/modules/es6.math.expm1.js");

    require("core-js/modules/es6.math.fround.js");

    require("core-js/modules/es6.math.hypot.js");

    require("core-js/modules/es6.math.imul.js");

    require("core-js/modules/es6.math.log1p.js");

    require("core-js/modules/es6.math.log10.js");

    require("core-js/modules/es6.math.log2.js");

    require("core-js/modules/es6.math.sign.js");

    require("core-js/modules/es6.math.sinh.js");

    require("core-js/modules/es6.math.tanh.js");

    require("core-js/modules/es6.math.trunc.js");

    require("core-js/modules/es6.number.constructor.js");

    require("core-js/modules/es6.number.epsilon.js");

    require("core-js/modules/es6.number.is-finite.js");

    require("core-js/modules/es6.number.is-integer.js");

    require("core-js/modules/es6.number.is-nan.js");

    require("core-js/modules/es6.number.is-safe-integer.js");

    require("core-js/modules/es6.number.max-safe-integer.js");

    require("core-js/modules/es6.number.min-safe-integer.js");

    require("core-js/modules/es6.number.parse-float.js");

    require("core-js/modules/es6.number.parse-int.js");

    require("core-js/modules/es6.object.assign.js");

    require("core-js/modules/es7.object.define-getter.js");

    require("core-js/modules/es7.object.define-setter.js");

    require("core-js/modules/es7.object.entries.js");

    require("core-js/modules/es6.object.freeze.js");

    require("core-js/modules/es6.object.get-own-property-descriptor.js");

    require("core-js/modules/es7.object.get-own-property-descriptors.js");

    require("core-js/modules/es6.object.get-own-property-names.js");

    require("core-js/modules/es6.object.get-prototype-of.js");

    require("core-js/modules/es7.object.lookup-getter.js");

    require("core-js/modules/es7.object.lookup-setter.js");

    require("core-js/modules/es6.object.prevent-extensions.js");

    require("core-js/modules/es6.object.to-string.js");

    require("core-js/modules/es6.object.is.js");

    require("core-js/modules/es6.object.is-frozen.js");

    require("core-js/modules/es6.object.is-sealed.js");

    require("core-js/modules/es6.object.is-extensible.js");

    require("core-js/modules/es6.object.keys.js");

    require("core-js/modules/es6.object.seal.js");

    require("core-js/modules/es7.object.values.js");

    require("core-js/modules/es6.promise.js");

    require("core-js/modules/es7.promise.finally.js");

    require("core-js/modules/es6.reflect.apply.js");

    require("core-js/modules/es6.reflect.construct.js");

    require("core-js/modules/es6.reflect.define-property.js");

    require("core-js/modules/es6.reflect.delete-property.js");

    require("core-js/modules/es6.reflect.get.js");

    require("core-js/modules/es6.reflect.get-own-property-descriptor.js");

    require("core-js/modules/es6.reflect.get-prototype-of.js");

    require("core-js/modules/es6.reflect.has.js");

    require("core-js/modules/es6.reflect.is-extensible.js");

    require("core-js/modules/es6.reflect.own-keys.js");

    require("core-js/modules/es6.reflect.prevent-extensions.js");

    require("core-js/modules/es6.reflect.set.js");

    require("core-js/modules/es6.reflect.set-prototype-of.js");

    require("core-js/modules/es6.regexp.constructor.js");

    require("core-js/modules/es6.regexp.flags.js");

    require("core-js/modules/es6.regexp.match.js");

    require("core-js/modules/es6.regexp.replace.js");

    require("core-js/modules/es6.regexp.split.js");

    require("core-js/modules/es6.regexp.search.js");

    require("core-js/modules/es6.regexp.to-string.js");

    require("core-js/modules/es6.set.js");

    require("core-js/modules/es6.symbol.js");

    require("core-js/modules/es7.symbol.async-iterator.js");

    require("core-js/modules/es6.string.anchor.js");

    require("core-js/modules/es6.string.big.js");

    require("core-js/modules/es6.string.blink.js");

    require("core-js/modules/es6.string.bold.js");

    require("core-js/modules/es6.string.code-point-at.js");

    require("core-js/modules/es6.string.ends-with.js");

    require("core-js/modules/es6.string.fixed.js");

    require("core-js/modules/es6.string.fontcolor.js");

    require("core-js/modules/es6.string.fontsize.js");

    require("core-js/modules/es6.string.from-code-point.js");

    require("core-js/modules/es6.string.includes.js");

    require("core-js/modules/es6.string.italics.js");

    require("core-js/modules/es6.string.iterator.js");

    require("core-js/modules/es6.string.link.js");

    require("core-js/modules/es7.string.pad-start.js");

    require("core-js/modules/es7.string.pad-end.js");

    require("core-js/modules/es6.string.raw.js");

    require("core-js/modules/es6.string.repeat.js");

    require("core-js/modules/es6.string.small.js");

    require("core-js/modules/es6.string.starts-with.js");

    require("core-js/modules/es6.string.strike.js");

    require("core-js/modules/es6.string.sub.js");

    require("core-js/modules/es6.string.sup.js");

    require("core-js/modules/es7.string.trim-left.js");

    require("core-js/modules/es7.string.trim-right.js");

    require("core-js/modules/es6.typed.array-buffer.js");

    require("core-js/modules/es6.typed.int8-array.js");

    require("core-js/modules/es6.typed.uint8-array.js");

    require("core-js/modules/es6.typed.uint8-clamped-array.js");

    require("core-js/modules/es6.typed.int16-array.js");

    require("core-js/modules/es6.typed.uint16-array.js");

    require("core-js/modules/es6.typed.int32-array.js");

    require("core-js/modules/es6.typed.uint32-array.js");

    require("core-js/modules/es6.typed.float32-array.js");

    require("core-js/modules/es6.typed.float64-array.js");

    require("core-js/modules/es6.weak-map.js");

    require("core-js/modules/es6.weak-set.js");

    require("core-js/modules/web.timers.js");

    require("core-js/modules/web.immediate.js");

    require("core-js/modules/web.dom.iterable.js");

    require("regenerator-runtime/runtime.js");

    var _axios = _interopRequireDefault(require("axios"));

    var _SynceFromServer = _interopRequireDefault(require("./messageapp/SynceFromServer"));

    var _UILocalDb = _interopRequireDefault(require("./messageapp/UILocalDb"));

    var _StartUI = _interopRequireDefault(require("./messageapp/StartUI"));

    var _auth = _interopRequireDefault(require("./user/auth"));

    var _toBoolean = _interopRequireDefault(require("validator/es/lib/toBoolean"));

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    } // import AppControll from './messageapp/appControll'


    var loginpage = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _auth.default.login();

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function loginpage() {
        return _ref.apply(this, arguments);
      };
    }(); // const startApp = async ()=>{
    //     try {
    //         //Loading user content first time or regreshing contentd
    //         await SynceFromServer.start();
    //         await UiLocalDb.friendList();
    //         await UiLocalDb.chatList();
    //         await UiLocalDb._updateMessage();
    //         StartUI.openChat();
    //         return true;
    //     }catch (err){
    //         console.log(err);
    //         return false;
    //     }
    // }
    //Loading index page


    var index = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var res, _main;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return (0, _axios.default)({
                  method: 'GET',
                  url: '/web'
                });

              case 3:
                res = _context2.sent;

                if (!(res.status === 200)) {
                  _context2.next = 14;
                  break;
                }

                _main = document.getElementById('main');

                if (!_main) {
                  _main = document.createElement("div");
                  _main.id = 'main';
                  document.body.insertBefore(_main, document.body.firstChild);
                }

                _main.innerHTML = res.data;

                if (!(0, _toBoolean.default)(res.headers.auth)) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 11;
                return _StartUI.default.startApp();

              case 11:
                _context2.next = 13;
                return loginpage();

              case 13:
                return _context2.abrupt("return", true);

              case 14:
                _context2.next = 20;
                break;

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0.response.data, "From index");
                return _context2.abrupt("return", false);

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 16]]);
      }));

      return function index() {
        return _ref2.apply(this, arguments);
      };
    }(); //Main funtion for the Page


    var main = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return index();

              case 2:
                if (!_context3.sent) {
                  _context3.next = 4;
                  break;
                }

                console.log('start');

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function main() {
        return _ref3.apply(this, arguments);
      };
    }(); //When document is loaded


    document.onreadystatechange = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(document.readyState === 'interactive')) {
                _context4.next = 4;
                break;
              }

              window.user = null;
              _context4.next = 4;
              return main();

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
  }, {
    "core-js/modules/es6.array.copy-within.js": "../node_modules/core-js/modules/es6.array.copy-within.js",
    "core-js/modules/es6.array.fill.js": "../node_modules/core-js/modules/es6.array.fill.js",
    "core-js/modules/es6.array.find.js": "../node_modules/core-js/modules/es6.array.find.js",
    "core-js/modules/es6.array.find-index.js": "../node_modules/core-js/modules/es6.array.find-index.js",
    "core-js/modules/es7.array.flat-map.js": "../node_modules/core-js/modules/es7.array.flat-map.js",
    "core-js/modules/es6.array.from.js": "../node_modules/core-js/modules/es6.array.from.js",
    "core-js/modules/es7.array.includes.js": "../node_modules/core-js/modules/es7.array.includes.js",
    "core-js/modules/es6.array.iterator.js": "../node_modules/core-js/modules/es6.array.iterator.js",
    "core-js/modules/es6.array.of.js": "../node_modules/core-js/modules/es6.array.of.js",
    "core-js/modules/es6.array.sort.js": "../node_modules/core-js/modules/es6.array.sort.js",
    "core-js/modules/es6.array.species.js": "../node_modules/core-js/modules/es6.array.species.js",
    "core-js/modules/es6.date.to-primitive.js": "../node_modules/core-js/modules/es6.date.to-primitive.js",
    "core-js/modules/es6.function.has-instance.js": "../node_modules/core-js/modules/es6.function.has-instance.js",
    "core-js/modules/es6.function.name.js": "../node_modules/core-js/modules/es6.function.name.js",
    "core-js/modules/es6.map.js": "../node_modules/core-js/modules/es6.map.js",
    "core-js/modules/es6.math.acosh.js": "../node_modules/core-js/modules/es6.math.acosh.js",
    "core-js/modules/es6.math.asinh.js": "../node_modules/core-js/modules/es6.math.asinh.js",
    "core-js/modules/es6.math.atanh.js": "../node_modules/core-js/modules/es6.math.atanh.js",
    "core-js/modules/es6.math.cbrt.js": "../node_modules/core-js/modules/es6.math.cbrt.js",
    "core-js/modules/es6.math.clz32.js": "../node_modules/core-js/modules/es6.math.clz32.js",
    "core-js/modules/es6.math.cosh.js": "../node_modules/core-js/modules/es6.math.cosh.js",
    "core-js/modules/es6.math.expm1.js": "../node_modules/core-js/modules/es6.math.expm1.js",
    "core-js/modules/es6.math.fround.js": "../node_modules/core-js/modules/es6.math.fround.js",
    "core-js/modules/es6.math.hypot.js": "../node_modules/core-js/modules/es6.math.hypot.js",
    "core-js/modules/es6.math.imul.js": "../node_modules/core-js/modules/es6.math.imul.js",
    "core-js/modules/es6.math.log1p.js": "../node_modules/core-js/modules/es6.math.log1p.js",
    "core-js/modules/es6.math.log10.js": "../node_modules/core-js/modules/es6.math.log10.js",
    "core-js/modules/es6.math.log2.js": "../node_modules/core-js/modules/es6.math.log2.js",
    "core-js/modules/es6.math.sign.js": "../node_modules/core-js/modules/es6.math.sign.js",
    "core-js/modules/es6.math.sinh.js": "../node_modules/core-js/modules/es6.math.sinh.js",
    "core-js/modules/es6.math.tanh.js": "../node_modules/core-js/modules/es6.math.tanh.js",
    "core-js/modules/es6.math.trunc.js": "../node_modules/core-js/modules/es6.math.trunc.js",
    "core-js/modules/es6.number.constructor.js": "../node_modules/core-js/modules/es6.number.constructor.js",
    "core-js/modules/es6.number.epsilon.js": "../node_modules/core-js/modules/es6.number.epsilon.js",
    "core-js/modules/es6.number.is-finite.js": "../node_modules/core-js/modules/es6.number.is-finite.js",
    "core-js/modules/es6.number.is-integer.js": "../node_modules/core-js/modules/es6.number.is-integer.js",
    "core-js/modules/es6.number.is-nan.js": "../node_modules/core-js/modules/es6.number.is-nan.js",
    "core-js/modules/es6.number.is-safe-integer.js": "../node_modules/core-js/modules/es6.number.is-safe-integer.js",
    "core-js/modules/es6.number.max-safe-integer.js": "../node_modules/core-js/modules/es6.number.max-safe-integer.js",
    "core-js/modules/es6.number.min-safe-integer.js": "../node_modules/core-js/modules/es6.number.min-safe-integer.js",
    "core-js/modules/es6.number.parse-float.js": "../node_modules/core-js/modules/es6.number.parse-float.js",
    "core-js/modules/es6.number.parse-int.js": "../node_modules/core-js/modules/es6.number.parse-int.js",
    "core-js/modules/es6.object.assign.js": "../node_modules/core-js/modules/es6.object.assign.js",
    "core-js/modules/es7.object.define-getter.js": "../node_modules/core-js/modules/es7.object.define-getter.js",
    "core-js/modules/es7.object.define-setter.js": "../node_modules/core-js/modules/es7.object.define-setter.js",
    "core-js/modules/es7.object.entries.js": "../node_modules/core-js/modules/es7.object.entries.js",
    "core-js/modules/es6.object.freeze.js": "../node_modules/core-js/modules/es6.object.freeze.js",
    "core-js/modules/es6.object.get-own-property-descriptor.js": "../node_modules/core-js/modules/es6.object.get-own-property-descriptor.js",
    "core-js/modules/es7.object.get-own-property-descriptors.js": "../node_modules/core-js/modules/es7.object.get-own-property-descriptors.js",
    "core-js/modules/es6.object.get-own-property-names.js": "../node_modules/core-js/modules/es6.object.get-own-property-names.js",
    "core-js/modules/es6.object.get-prototype-of.js": "../node_modules/core-js/modules/es6.object.get-prototype-of.js",
    "core-js/modules/es7.object.lookup-getter.js": "../node_modules/core-js/modules/es7.object.lookup-getter.js",
    "core-js/modules/es7.object.lookup-setter.js": "../node_modules/core-js/modules/es7.object.lookup-setter.js",
    "core-js/modules/es6.object.prevent-extensions.js": "../node_modules/core-js/modules/es6.object.prevent-extensions.js",
    "core-js/modules/es6.object.to-string.js": "../node_modules/core-js/modules/es6.object.to-string.js",
    "core-js/modules/es6.object.is.js": "../node_modules/core-js/modules/es6.object.is.js",
    "core-js/modules/es6.object.is-frozen.js": "../node_modules/core-js/modules/es6.object.is-frozen.js",
    "core-js/modules/es6.object.is-sealed.js": "../node_modules/core-js/modules/es6.object.is-sealed.js",
    "core-js/modules/es6.object.is-extensible.js": "../node_modules/core-js/modules/es6.object.is-extensible.js",
    "core-js/modules/es6.object.keys.js": "../node_modules/core-js/modules/es6.object.keys.js",
    "core-js/modules/es6.object.seal.js": "../node_modules/core-js/modules/es6.object.seal.js",
    "core-js/modules/es7.object.values.js": "../node_modules/core-js/modules/es7.object.values.js",
    "core-js/modules/es6.promise.js": "../node_modules/core-js/modules/es6.promise.js",
    "core-js/modules/es7.promise.finally.js": "../node_modules/core-js/modules/es7.promise.finally.js",
    "core-js/modules/es6.reflect.apply.js": "../node_modules/core-js/modules/es6.reflect.apply.js",
    "core-js/modules/es6.reflect.construct.js": "../node_modules/core-js/modules/es6.reflect.construct.js",
    "core-js/modules/es6.reflect.define-property.js": "../node_modules/core-js/modules/es6.reflect.define-property.js",
    "core-js/modules/es6.reflect.delete-property.js": "../node_modules/core-js/modules/es6.reflect.delete-property.js",
    "core-js/modules/es6.reflect.get.js": "../node_modules/core-js/modules/es6.reflect.get.js",
    "core-js/modules/es6.reflect.get-own-property-descriptor.js": "../node_modules/core-js/modules/es6.reflect.get-own-property-descriptor.js",
    "core-js/modules/es6.reflect.get-prototype-of.js": "../node_modules/core-js/modules/es6.reflect.get-prototype-of.js",
    "core-js/modules/es6.reflect.has.js": "../node_modules/core-js/modules/es6.reflect.has.js",
    "core-js/modules/es6.reflect.is-extensible.js": "../node_modules/core-js/modules/es6.reflect.is-extensible.js",
    "core-js/modules/es6.reflect.own-keys.js": "../node_modules/core-js/modules/es6.reflect.own-keys.js",
    "core-js/modules/es6.reflect.prevent-extensions.js": "../node_modules/core-js/modules/es6.reflect.prevent-extensions.js",
    "core-js/modules/es6.reflect.set.js": "../node_modules/core-js/modules/es6.reflect.set.js",
    "core-js/modules/es6.reflect.set-prototype-of.js": "../node_modules/core-js/modules/es6.reflect.set-prototype-of.js",
    "core-js/modules/es6.regexp.constructor.js": "../node_modules/core-js/modules/es6.regexp.constructor.js",
    "core-js/modules/es6.regexp.flags.js": "../node_modules/core-js/modules/es6.regexp.flags.js",
    "core-js/modules/es6.regexp.match.js": "../node_modules/core-js/modules/es6.regexp.match.js",
    "core-js/modules/es6.regexp.replace.js": "../node_modules/core-js/modules/es6.regexp.replace.js",
    "core-js/modules/es6.regexp.split.js": "../node_modules/core-js/modules/es6.regexp.split.js",
    "core-js/modules/es6.regexp.search.js": "../node_modules/core-js/modules/es6.regexp.search.js",
    "core-js/modules/es6.regexp.to-string.js": "../node_modules/core-js/modules/es6.regexp.to-string.js",
    "core-js/modules/es6.set.js": "../node_modules/core-js/modules/es6.set.js",
    "core-js/modules/es6.symbol.js": "../node_modules/core-js/modules/es6.symbol.js",
    "core-js/modules/es7.symbol.async-iterator.js": "../node_modules/core-js/modules/es7.symbol.async-iterator.js",
    "core-js/modules/es6.string.anchor.js": "../node_modules/core-js/modules/es6.string.anchor.js",
    "core-js/modules/es6.string.big.js": "../node_modules/core-js/modules/es6.string.big.js",
    "core-js/modules/es6.string.blink.js": "../node_modules/core-js/modules/es6.string.blink.js",
    "core-js/modules/es6.string.bold.js": "../node_modules/core-js/modules/es6.string.bold.js",
    "core-js/modules/es6.string.code-point-at.js": "../node_modules/core-js/modules/es6.string.code-point-at.js",
    "core-js/modules/es6.string.ends-with.js": "../node_modules/core-js/modules/es6.string.ends-with.js",
    "core-js/modules/es6.string.fixed.js": "../node_modules/core-js/modules/es6.string.fixed.js",
    "core-js/modules/es6.string.fontcolor.js": "../node_modules/core-js/modules/es6.string.fontcolor.js",
    "core-js/modules/es6.string.fontsize.js": "../node_modules/core-js/modules/es6.string.fontsize.js",
    "core-js/modules/es6.string.from-code-point.js": "../node_modules/core-js/modules/es6.string.from-code-point.js",
    "core-js/modules/es6.string.includes.js": "../node_modules/core-js/modules/es6.string.includes.js",
    "core-js/modules/es6.string.italics.js": "../node_modules/core-js/modules/es6.string.italics.js",
    "core-js/modules/es6.string.iterator.js": "../node_modules/core-js/modules/es6.string.iterator.js",
    "core-js/modules/es6.string.link.js": "../node_modules/core-js/modules/es6.string.link.js",
    "core-js/modules/es7.string.pad-start.js": "../node_modules/core-js/modules/es7.string.pad-start.js",
    "core-js/modules/es7.string.pad-end.js": "../node_modules/core-js/modules/es7.string.pad-end.js",
    "core-js/modules/es6.string.raw.js": "../node_modules/core-js/modules/es6.string.raw.js",
    "core-js/modules/es6.string.repeat.js": "../node_modules/core-js/modules/es6.string.repeat.js",
    "core-js/modules/es6.string.small.js": "../node_modules/core-js/modules/es6.string.small.js",
    "core-js/modules/es6.string.starts-with.js": "../node_modules/core-js/modules/es6.string.starts-with.js",
    "core-js/modules/es6.string.strike.js": "../node_modules/core-js/modules/es6.string.strike.js",
    "core-js/modules/es6.string.sub.js": "../node_modules/core-js/modules/es6.string.sub.js",
    "core-js/modules/es6.string.sup.js": "../node_modules/core-js/modules/es6.string.sup.js",
    "core-js/modules/es7.string.trim-left.js": "../node_modules/core-js/modules/es7.string.trim-left.js",
    "core-js/modules/es7.string.trim-right.js": "../node_modules/core-js/modules/es7.string.trim-right.js",
    "core-js/modules/es6.typed.array-buffer.js": "../node_modules/core-js/modules/es6.typed.array-buffer.js",
    "core-js/modules/es6.typed.int8-array.js": "../node_modules/core-js/modules/es6.typed.int8-array.js",
    "core-js/modules/es6.typed.uint8-array.js": "../node_modules/core-js/modules/es6.typed.uint8-array.js",
    "core-js/modules/es6.typed.uint8-clamped-array.js": "../node_modules/core-js/modules/es6.typed.uint8-clamped-array.js",
    "core-js/modules/es6.typed.int16-array.js": "../node_modules/core-js/modules/es6.typed.int16-array.js",
    "core-js/modules/es6.typed.uint16-array.js": "../node_modules/core-js/modules/es6.typed.uint16-array.js",
    "core-js/modules/es6.typed.int32-array.js": "../node_modules/core-js/modules/es6.typed.int32-array.js",
    "core-js/modules/es6.typed.uint32-array.js": "../node_modules/core-js/modules/es6.typed.uint32-array.js",
    "core-js/modules/es6.typed.float32-array.js": "../node_modules/core-js/modules/es6.typed.float32-array.js",
    "core-js/modules/es6.typed.float64-array.js": "../node_modules/core-js/modules/es6.typed.float64-array.js",
    "core-js/modules/es6.weak-map.js": "../node_modules/core-js/modules/es6.weak-map.js",
    "core-js/modules/es6.weak-set.js": "../node_modules/core-js/modules/es6.weak-set.js",
    "core-js/modules/web.timers.js": "../node_modules/core-js/modules/web.timers.js",
    "core-js/modules/web.immediate.js": "../node_modules/core-js/modules/web.immediate.js",
    "core-js/modules/web.dom.iterable.js": "../node_modules/core-js/modules/web.dom.iterable.js",
    "regenerator-runtime/runtime.js": "../node_modules/regenerator-runtime/runtime.js",
    "axios": "../node_modules/axios/index.js",
    "./messageapp/SynceFromServer": "messageapp/SynceFromServer.js",
    "./messageapp/UILocalDb": "messageapp/UILocalDb.js",
    "./messageapp/StartUI": "messageapp/StartUI.js",
    "./user/auth": "user/auth.js",
    "validator/es/lib/toBoolean": "../node_modules/validator/es/lib/toBoolean.js"
  }],
  "../node_modules/parcel-bundler/src/builtins/hmr-runtime.js": [function (require, module, exports) {
    var global = arguments[3];
    var OVERLAY_ID = '__parcel__error__overlay__';
    var OldModule = module.bundle.Module;

    function Module(moduleName) {
      OldModule.call(this, moduleName);
      this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
          this._acceptCallbacks.push(fn || function () {});
        },
        dispose: function dispose(fn) {
          this._disposeCallbacks.push(fn);
        }
      };
      module.bundle.hotData = null;
    }

    module.bundle.Module = Module;
    var checkedAssets, assetsToAccept;
    var parent = module.bundle.parent;

    if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
      var hostname = "" || location.hostname;
      var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
      var ws = new WebSocket(protocol + '://' + hostname + ':' + "53263" + '/');

      ws.onmessage = function (event) {
        checkedAssets = {};
        assetsToAccept = [];
        var data = JSON.parse(event.data);

        if (data.type === 'update') {
          var handled = false;
          data.assets.forEach(function (asset) {
            if (!asset.isNew) {
              var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

              if (didAccept) {
                handled = true;
              }
            }
          }); // Enable HMR for CSS by default.

          handled = handled || data.assets.every(function (asset) {
            return asset.type === 'css' && asset.generated.js;
          });

          if (handled) {
            console.clear();
            data.assets.forEach(function (asset) {
              hmrApply(global.parcelRequire, asset);
            });
            assetsToAccept.forEach(function (v) {
              hmrAcceptRun(v[0], v[1]);
            });
          } else if (location.reload) {
            // `location` global exists in a web worker context but lacks `.reload()` function.
            location.reload();
          }
        }

        if (data.type === 'reload') {
          ws.close();

          ws.onclose = function () {
            location.reload();
          };
        }

        if (data.type === 'error-resolved') {
          console.log('[parcel] ✨ Error resolved');
          removeErrorOverlay();
        }

        if (data.type === 'error') {
          console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
          removeErrorOverlay();
          var overlay = createErrorOverlay(data);
          document.body.appendChild(overlay);
        }
      };
    }

    function removeErrorOverlay() {
      var overlay = document.getElementById(OVERLAY_ID);

      if (overlay) {
        overlay.remove();
      }
    }

    function createErrorOverlay(data) {
      var overlay = document.createElement('div');
      overlay.id = OVERLAY_ID; // html encode message and stack trace

      var message = document.createElement('div');
      var stackTrace = document.createElement('pre');
      message.innerText = data.error.message;
      stackTrace.innerText = data.error.stack;
      overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
      return overlay;
    }

    function getParents(bundle, id) {
      var modules = bundle.modules;

      if (!modules) {
        return [];
      }

      var parents = [];
      var k, d, dep;

      for (k in modules) {
        for (d in modules[k][1]) {
          dep = modules[k][1][d];

          if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
            parents.push(k);
          }
        }
      }

      if (bundle.parent) {
        parents = parents.concat(getParents(bundle.parent, id));
      }

      return parents;
    }

    function hmrApply(bundle, asset) {
      var modules = bundle.modules;

      if (!modules) {
        return;
      }

      if (modules[asset.id] || !bundle.parent) {
        var fn = new Function('require', 'module', 'exports', asset.generated.js);
        asset.isNew = !modules[asset.id];
        modules[asset.id] = [fn, asset.deps];
      } else if (bundle.parent) {
        hmrApply(bundle.parent, asset);
      }
    }

    function hmrAcceptCheck(bundle, id) {
      var modules = bundle.modules;

      if (!modules) {
        return;
      }

      if (!modules[id] && bundle.parent) {
        return hmrAcceptCheck(bundle.parent, id);
      }

      if (checkedAssets[id]) {
        return;
      }

      checkedAssets[id] = true;
      var cached = bundle.cache[id];
      assetsToAccept.push([bundle, id]);

      if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        return true;
      }

      return getParents(global.parcelRequire, id).some(function (id) {
        return hmrAcceptCheck(global.parcelRequire, id);
      });
    }

    function hmrAcceptRun(bundle, id) {
      var cached = bundle.cache[id];
      bundle.hotData = {};

      if (cached) {
        cached.hot.data = bundle.hotData;
      }

      if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
        cached.hot._disposeCallbacks.forEach(function (cb) {
          cb(bundle.hotData);
        });
      }

      delete bundle.cache[id];
      bundle(id);
      cached = bundle.cache[id];

      if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        cached.hot._acceptCallbacks.forEach(function (cb) {
          cb();
        });

        return true;
      }
    }
  }, {}]
}, {}, ["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js", "index.js"], null);
},{"process":"node_modules/process/browser.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44885" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","public/js/index.js"], null)
//# sourceMappingURL=/public/js/index.js.map