(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["FlussonicMsePlayer"] = factory();
	else
		root["FlussonicMsePlayer"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.enableLogs = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _getSelfScope = __webpack_require__(50);

function noop() {}

var fakeLogger = {
  trace: noop,
  debug: noop,
  log: noop,
  warn: noop,
  info: noop,
  error: noop
};

var exportedLogger = fakeLogger;

// let lastCallTime;
// function formatMsgWithTimeInfo(type, msg) {
//   const now = Date.now();
//   const diff = lastCallTime ? '+' + (now - lastCallTime) : '0';
//   lastCallTime = now;
//   msg = (new Date(now)).toISOString() + ' | [' +  type + '] > ' + msg + ' ( ' + diff + ' ms )';
//   return msg;
// }

function formatMsg(type, msg) {
  msg = '[' + type + '] > ' + msg;
  return msg;
}

var global = (0, _getSelfScope.getSelfScope)();

function consolePrintFn(type) {
  var func = global.console[type];
  if (func) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[0]) {
        args[0] = formatMsg(type, args[0]);
      }

      func.apply(global.console, args);
    };
  }
  return noop;
}

function exportLoggerFunctions(debugConfig) {
  for (var _len2 = arguments.length, functions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    functions[_key2 - 1] = arguments[_key2];
  }

  functions.forEach(function (type) {
    exportedLogger[type] = debugConfig[type] ? debugConfig[type].bind(debugConfig) : consolePrintFn(type);
  });
}

var enableLogs = exports.enableLogs = function enableLogs(debugConfig) {
  if (debugConfig === true || (typeof debugConfig === 'undefined' ? 'undefined' : _typeof(debugConfig)) === 'object') {
    exportLoggerFunctions(debugConfig,
    // Remove out from list here to hard-disable a log-level
    'trace', 'debug', 'log', 'info', 'warn', 'error');
    // Some browsers don't allow to use bind on console object anyway
    // fallback to default if needed
    try {
      exportedLogger.log();
    } catch (e) {
      exportedLogger = fakeLogger;
    }
  } else {
    exportedLogger = fakeLogger;
  }
};

var logger = exports.logger = exportedLogger;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(20);
var createDesc = __webpack_require__(25);
module.exports = __webpack_require__(5) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(7)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EVENTS = {
  // MediaSource
  MEDIA_SOURCE_SOURCE_OPEN: 'sourceopen',
  MEDIA_SOURCE_SOURCE_ENDED: 'sourceended',
  MEDIA_SOURCE_SOURCE_CLOSE: 'sourceclose',

  // HTMLMediaElement
  MEDIA_ELEMENT_PROGRESS: 'progress',
  MEDIA_ELEMENT_EMPTIED: 'emptied',

  // WebSocket
  WS_OPEN: 'open',
  WS_MESSAGE: 'message',
  WS_ERROR: 'error',
  WS_CLOSE: 'close',

  // Buffer
  BUFFER_UPDATE_END: 'updateend',
  BUFFER_ERROR: 'onerror',
  BUFFER_ABORT: 'onabort'
};

exports.default = EVENTS;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(28);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(38)('wks');
var uid = __webpack_require__(8);
var Symbol = __webpack_require__(0).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorMsg = exports.replaceHttpByWS = exports.checkVideoProgress = exports.MAX_DELAY = undefined;
exports.getMediaSource = getMediaSource;
exports.isAndroid = isAndroid;
exports.isSupportedMSE = isSupportedMSE;
exports.base64ToArrayBuffer = base64ToArrayBuffer;
exports.RawDataToUint8Array = RawDataToUint8Array;
exports.getTrackId = getTrackId;
exports.getRealUtcFromData = getRealUtcFromData;
exports.doArrayBuffer = doArrayBuffer;
exports.debugData = debugData;
exports.pad2 = pad2;
exports.humanTime = humanTime;
exports.logDM = logDM;
exports.showDispatchError = showDispatchError;

var _logger = __webpack_require__(2);

function getMediaSource() {
  if (typeof window !== 'undefined') {
    return window.MediaSource || window.WebKitMediaSource;
  }
}

function isAndroid() {
  var ua = navigator.userAgent;
  return ua.indexOf('Android') !== -1;
}

function isSupportedMSE() {
  // https://bugs.chromium.org/p/chromium/issues/detail?id=539707
  if (isAndroid()) {
    return false;
  }
  var mediaSource = getMediaSource();
  var sourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer;
  var isTypeSupported = mediaSource && typeof mediaSource.isTypeSupported === 'function' && mediaSource.isTypeSupported('video/mp4; codecs="avc1.4d401f,mp4a.40.2"');

  // if SourceBuffer is exposed ensure its API is valid
  // safari and old version of Chrome doe not expose SourceBuffer globally so checking SourceBuffer.prototype is impossible
  var sourceBufferValidAPI = !sourceBuffer || sourceBuffer.prototype && typeof sourceBuffer.prototype.appendBuffer === 'function' && typeof sourceBuffer.prototype.remove === 'function';
  return !!isTypeSupported && !!sourceBufferValidAPI;
}

function base64ToArrayBuffer(base64) {
  return Uint8Array.from(atob(base64), function (c) {
    return c.charCodeAt(0);
  });
}

function RawDataToUint8Array(rawData) {
  // 12,4 = mfhd;20,4 slice - segment.id;36,4 = tfhd;44,4 slice - track.id;64,4 = tfdt
  // 72,8 slice - prestime;84,4 = futc;92,8 slice - real utc;104,4 = trun
  return new Uint8Array(rawData);
}

function getTrackId(data) {
  return data[47];
}

function getRealUtcFromData(view) {
  var pts1 = view[92] << 24 | view[93] << 16 | view[94] << 8 | view[95];
  var pts2 = view[96] << 24 | view[97] << 16 | view[98] << 8 | view[99];
  var realUtc = pts1 + pts2 / 1000000;
  return realUtc;
}

function doArrayBuffer(segment) {

  if (!segment.isInit) {
    // last loaded frame's utc
    this.utc = getRealUtcFromData(segment.data);
    this.lastLoadedUTC = this.utc;
  }

  // this.maybeAppend(segment, isVideo)
}

function debugData(rawData) {
  // const view = RawDataToUint8Array(rawData)
  var view = new Uint8Array(rawData);
  var trackId = getTrackId(view);
  var utc = getRealUtcFromData(view);

  return { trackId: trackId, utc: utc, view: view };
}

var ua = navigator.userAgent;
var MAX_DELAY = exports.MAX_DELAY = /Edge/.test(ua) || /trident.*rv:1\d/i.test(ua) ? 10 // very slow buffers in Edge
: 2;

var checkVideoProgress = exports.checkVideoProgress = function checkVideoProgress(media, player) {
  var maxDelay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAX_DELAY;
  return function (evt) {
    var ct = media.currentTime,
        buffered = media.buffered,
        l = media.buffered.length;


    var removeBufferRange = function removeBufferRange(type, sb, startOffset, endOffset) {
      try {
        for (var i = 0; i < sb.buffered.length; i++) {
          var bufStart = sb.buffered.start(i);
          var bufEnd = sb.buffered.end(i);
          var removeStart = Math.max(bufStart, startOffset);
          var removeEnd = Math.min(bufEnd, endOffset);

          /* sometimes sourcebuffer.remove() does not flush
            the exact expected time range.
            to avoid rounding issues/infinite loop,
            only flush buffer range of length greater than 500ms.
          */
          if (Math.min(removeEnd, bufEnd) - removeStart > 0.5) {
            var currentTime = 'null';
            if (media) {
              currentTime = media.currentTime.toString();
            }

            // logger.log(`sb remove ${type} [${removeStart},${removeEnd}], of [${bufStart},${bufEnd}], pos:${currentTime}`)
            sb.remove(removeStart, removeEnd);
            return true;
          }
        }
      } catch (error) {
        // logger.warn('removeBufferRange failed', error)
      }

      return false;
    };

    if (player) {
      var sourceBuffer = player.sb.sourceBuffer;

      var bufferTypes = Object.keys(sourceBuffer);
      var targetBackBufferPosition = ct - 30;
      // console.log({media, player, sourceBuffer, bufferTypes, targetBackBufferPosition})

      for (var index = bufferTypes.length - 1; index >= 0; index--) {
        var bufferType = bufferTypes[index];
        var sb = sourceBuffer[bufferType];
        if (sb) {
          var _buffered = sb.buffered;
          // when target buffer start exceeds actual buffer start
          if (_buffered.length > 0 && targetBackBufferPosition > _buffered.start(0)) {
            // remove buffer up until current time minus minimum back buffer length (removing buffer too close to current
            // time will lead to playback freezing)
            // credits for level target duration - https://github.com/videojs/http-streaming/blob/3132933b6aa99ddefab29c10447624efd6fd6e52/src/segment-loader.js#L91
            removeBufferRange(bufferType, sb, 0, targetBackBufferPosition);
          }
        }
      }
    }

    if (!l) {
      return;
    }
    var endTime = buffered.end(l - 1);
    var delay = Math.abs(endTime - ct);
    if (player._stalling) {
      player.onEndStalling();
      // если поставлена пауза
      if (media.paused && player._pause && !player.playing) {
        media.currentTime = endTime - 0.0001;
        player.playPromise = media.play();
        player.playPromise.then(function () {
          player._pause = false;
          player.playing = true;
        }).catch(function () {
          return;
        });
      }
    }

    if (delay <= maxDelay) {
      return;
    }

    // if (player.ws.paused && player.sb.segments.length < 100) {
    //   player.ws.resume()
    // }

    _logger.logger.log('nudge', ct, '->', l ? endTime : '-', ct - endTime); //evt, )
    media.currentTime = endTime - 0.2; // (Math.abs(ct - endTime)) //
  };
};

var replaceHttpByWS = exports.replaceHttpByWS = function replaceHttpByWS(url) {
  return url.replace(/^http/, 'ws');
};

var errorMsg = exports.errorMsg = function errorMsg(e) {
  return 'Error ' + e.name + ': ' + e.message + '\n' + e.stack;
};

function pad2(n) {
  return n <= 9 ? '0' + n : '' + n;
}

function humanTime(utcOrLive) {
  var lt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  // $FlowFixMe: string > 0 is always false
  if (!(utcOrLive > 0)) {
    return '';
  }

  // $FlowFixMe: just for flow
  var utc = utcOrLive;

  var d = new Date();
  d.setTime(utc * 1000);
  var localTime = !(lt === false);

  var h = localTime ? d.getHours() : d.getUTCHours();
  var m = localTime ? d.getMinutes() : d.getUTCMinutes();
  var s = localTime ? d.getSeconds() : d.getUTCSeconds();

  return pad2(h) + ':' + pad2(m) + ':' + pad2(s);
}

function logDM(isDataAB, parsedData) {
  if (parsedData) {
    _logger.logger.log('%c ' + parsedData.type + ' ' + (parsedData.type === 'event' ? parsedData.event : 'mse_init_segment'), 'background: aquamarine;', parsedData);
  }
}

var errorsCount = 0;

function showDispatchError(e, err) {
  var rawData = e.data;
  var isDataAB = rawData instanceof ArrayBuffer;
  console.error(errorMsg(e), err);

  if (this.media && this.media.error) {
    console.error('MediaError:', this.media.error);
  }

  if (isDataAB) {
    console.error('Data:', debugData(e.data));
  }

  errorsCount++;

  if (errorsCount >= this.opts.errorsBeforeStop) {
    errorsCount = 0;
    this.stopPromise = this.stop();
  }

  if (this.onError) {
    this.onError(err, e);
  }
}

/*
 * debug staff, after each operation you should
 * set count to 0, if you want show info about
 * ArrayBuffer frames
 */
// let count = 0

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var VIDEO = exports.VIDEO = 'video';
var AUDIO = exports.AUDIO = 'audio';

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MsePlayer = __webpack_require__(16);

var _MsePlayer2 = _interopRequireDefault(_MsePlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _MsePlayer2.default;
module.exports = exports['default'];

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import MediaSourceController from '../controllers/mediaSource'

__webpack_require__(17);

var _ws = __webpack_require__(40);

var _ws2 = _interopRequireDefault(_ws);

var _buffers = __webpack_require__(51);

var _buffers2 = _interopRequireDefault(_buffers);

var _mseUtils = __webpack_require__(12);

var mseUtils = _interopRequireWildcard(_mseUtils);

var _logger = __webpack_require__(2);

var _segments = __webpack_require__(52);

var _common = __webpack_require__(13);

var _events = __webpack_require__(6);

var _events2 = _interopRequireDefault(_events);

var _messages = __webpack_require__(53);

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WS_EVENT_PAUSED = 'paused';
var WS_EVENT_RESUMED = 'resumed';
var WS_EVENT_SEEKED = 'seeked';
var WS_EVENT_SWITCHED_TO_LIVE = 'switched_to_live';
var WS_EVENT_EOS = 'recordings_ended';
var WS_EVENT_NO_LIVE = 'stream_unavailable';
var WS_EVENT_TRACKS_SWITCHED = 'tracks_switched';
var WS_TRY_RECONNECT = false;

var TYPE_CONTENT_VIDEO = _common.VIDEO;
var TYPE_CONTENT_AUDIO = _common.AUDIO;
var DEFAULT_ERRORS_BEFORE_STOP = 1;
var DEFAULT_UPDATE = 100;
var DEFAULT_CONNECTIONS_RETRIES = 0;
var DEFAULT_RETRY_MUTED = false;
var DEFAULT_FORCE_UNMUTED = false;

var MSEPlayer = function () {
  MSEPlayer.replaceHttpByWS = function replaceHttpByWS(url) {
    return mseUtils.replaceHttpByWS(url);
  };

  MSEPlayer.isSupported = function isSupported() {
    return mseUtils.isSupportedMSE();
  };
  /**
   *
   * @param media HTMLMediaElement
   * @param urlStream
   * @param opts
   */

  _createClass(MSEPlayer, null, [{
    key: 'version',
    get: function get() {
      return "20.2.4";
    }
  }]);

  function MSEPlayer(media, urlStream) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, MSEPlayer);

    // debugger
    if (opts.debug) {
      (0, _logger.enableLogs)(true);
      window.humanTime = mseUtils.humanTime;
    }

    _logger.logger.info('[mse-player]:', MSEPlayer.version);

    this.opts = opts || {};

    this.media = media;

    this.url = urlStream;

    this.opts.progressUpdateTime = this.opts.progressUpdateTime || DEFAULT_UPDATE;

    this.opts.errorsBeforeStop = this.opts.errorsBeforeStop ? this.opts.errorsBeforeStop : DEFAULT_ERRORS_BEFORE_STOP;

    if (typeof this.opts.errorsBeforeStop !== 'number' || isNaN(this.opts.errorsBeforeStop)) {
      throw new Error('invalid errorsBeforeStop param, should be number');
    }

    this.opts.connectionRetries = this.opts.connectionRetries || DEFAULT_CONNECTIONS_RETRIES;

    if (typeof this.opts.connectionRetries !== 'number' || isNaN(this.opts.connectionRetries)) {
      throw new Error('invalid connectionRetries param, should be number');
    }

    this.opts.wsReconnect = this.opts.wsReconnect ? this.opts.wsReconnect : WS_TRY_RECONNECT;

    if (typeof this.opts.wsReconnect !== 'boolean') {
      throw new Error('invalid wsReconnect param, should be boolean');
    }

    this.retry = 0;
    this.retryConnectionTimer;

    this.opts.retryMuted = this.opts.retryMuted ? this.opts.retryMuted : DEFAULT_RETRY_MUTED;

    if (typeof this.opts.retryMuted !== 'boolean') {
      throw new Error('invalid retryMuted param, should be boolean');
    }

    this.onProgress = opts && opts.onProgress;
    if (opts && opts.onDisconnect) {
      this.onDisconnect = opts && opts.onDisconnect;
    } else {
      this.onDisconnect = function (status) {
        _logger.logger.log('[websocket status]:', status);
      };
    }
    this.onMediaInfo = opts && opts.onMediaInfo;
    this.onError = opts && opts.onError;
    this.onAutoplay = opts && opts.onAutoplay;
    this.onMuted = opts && opts.onMuted;

    this.init();

    if (media instanceof HTMLMediaElement) {
      // iOS autoplay with no fullscreen fix
      media.WebKitPlaysInline = true;
      // this.media.addEventListener('onerror', (err) => { console.log('ERROR', err)})
      // this.media.addEventListener('error', (err) => { console.log('ERROR', err)})
      // this.media.onerror = function() {
      //   console.log("Error " + videoElement.error.code + "; details: " + videoElement.error.message);
      // }
      // this.media.addEventListener('onpause', (err) => { console.log('onpause', err)})

      // this.media.addEventListener('pause', (event) => {
      //   console.log('paused !!!', event);
      // });
    }

    this.ws = new _ws2.default({
      message: this.dispatchMessage.bind(this),
      closed: this.onDisconnect.bind(this),
      error: this.onError,
      wsReconnect: this.opts.wsReconnect
    });

    /*
     * SourceBuffers Controller
     */
    this.sb = new _buffers2.default({ media: media });
  }

  MSEPlayer.prototype.play = function play(time, videoTrack, audioTrack) {
    var _this = this;

    _logger.logger.log('[mse-player]: play()');
    return this._play(time, videoTrack, audioTrack).then(function () {
      _this.playing = true;
    }).catch(function () {
      _this.playing = false;
    });
  };

  MSEPlayer.prototype.stop = function stop() {
    return this.onMediaDetaching();
  };

  MSEPlayer.prototype.seek = function seek(utc) {
    if (this.playing) {
      try {
        if (!utc) {
          throw new Error('utc should be "live" or UTC value');
        }
        this.ws.seek(utc);
        this.sb.seek();
        this.onStartStalling();
        // need for determine old frames
        this.seekValue = utc;
        this.media.pause();
        this._pause = true;
        this.playing = false;
      } catch (err) {
        _logger.logger.warn('seek:' + err.message);
      }
    }
  };

  MSEPlayer.prototype.pause = function pause() {
    if (!canPause.bind(this)()) {
      return _logger.logger.log('[mse:playback] can not do pause');
    }
    var binded = _pause.bind(this);
    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    this.playPromise.then(binded, binded);
    function _pause() {
      this.ws.pause();
      this.media.pause();
      this._pause = true;
      this.playing = false;

      if (this.onPause) {
        try {
          this.onPause();
        } catch (e) {
          console.error('Error ' + e.name + ':' + e.message + '\n' + e.stack);
        }
      }
    }

    function canPause() {
      if (this._pause || !this.playing || !this.media || !this.ws || !this.mediaSource || this.mediaSource && this.mediaSource.readyState !== 'open' || !this.playPromise) {
        return false;
      }
      return true;
    }
  };

  MSEPlayer.prototype.restart = function restart() {
    var fullRestart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var from = fullRestart ? undefined : this.sb.lastLoadedUTC;

    this.playing = false;
    this.ws.destroy();
    this.ws.init();
    this.ws.start(this.url, from, this.videoTrack, this.audioTrack);
  };

  MSEPlayer.prototype.retryConnection = function retryConnection() {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var videoTrack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var audioTrack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (this.retry >= this.opts.connectionRetries) {
      clearInterval(this.retryConnectionTimer);
      return;
    }
    _logger.logger.log('%cconnectionRetry:', 'background: orange;', 'Retrying ' + (this.retry + 1));
    this.mediaSource = void 0;
    this.init();
    this.ws.destroy();
    this.sb.destroy();

    this.play(time, videoTrack, audioTrack);
    this.retry = this.retry + 1;
  };

  MSEPlayer.prototype.setTracks = function setTracks(tracks) {
    var _this2 = this;

    if (!this.mediaInfo) {
      _logger.logger.warn('Media info did not loaded. Should try after onMediaInfo triggered or inside.');
      return;
    }

    if (!Array.isArray(tracks)) {
      console.error('tracks should be an Array instance: ["v1", "a1"]');
    }

    var videoTracksType = this.mediaInfo.streams ? 'streams' : 'tracks';

    var videoTracksStr = tracks.filter(function (id) {
      var stream = _this2.mediaInfo[videoTracksType].find(function (s) {
        return id === s['track_id'];
      });
      return !!stream && stream.content === TYPE_CONTENT_VIDEO;
    }).join('');

    var audioTracksStr = tracks.filter(function (id) {
      var stream = _this2.mediaInfo[videoTracksType].find(function (s) {
        return id === s['track_id'];
      });
      if (stream && stream.bitrate && stream.bitrate !== 0) {
        return !!stream && stream.content === TYPE_CONTENT_AUDIO;
      } else {
        return null;
      }
    }).join('');

    this.onStartStalling();
    this.ws.setTracks(videoTracksStr, audioTracksStr);

    this.videoTrack = videoTracksStr;
    this.audioTrack = audioTracksStr;
    // ?
    this._setTracksFlag = true;
    this.waitForInitFrame = true;
  };

  /**
   *
   *  Private members
   *
   */

  MSEPlayer.prototype._play = function _play(from, videoTrack, audioTrack) {
    var _this3 = this;

    // debugger
    this.liveError = false;
    var canPlay = false;
    return new Promise(function (resolve, reject) {
      _logger.logger.log('_play', from, videoTrack, audioTrack);

      if (_this3.playing) {
        var message = '[mse-player] _play: terminate because already has been playing';
        _logger.logger.log(message);
        return resolve({ message: message });
      }

      if (_this3._pause) {
        // should invoke play method of video in onClick scope
        // further logic are duplicated at checkVideoProgress
        // https://github.com/jwplayer/jwplayer/issues/2421#issuecomment-333130812

        if (_this3.ws && _this3.ws.opened === false) {
          _logger.logger.log('WebSocket Closed, trying to restart it');
          _this3._pause = false;
          _this3.restart(true);
          return;
        } else {
          _logger.logger.log('WebSocket is in opened state, resuming');
          _this3._pause = false;
          _this3._resume(); // ws
        }

        _this3.playPromise = _this3.media.play();
        _logger.logger.log('_play: terminate because _paused and should resume');
        return _this3.playPromise;
      }

      _this3.playTime = from;
      _this3.videoTrack = videoTrack;
      _this3.audioTrack = audioTrack;
      _this3._pause = false;

      // TODO: to observe this case, I have no idea when it fired
      if (!_this3.mediaSource) {
        _this3.onAttachMedia({ media: _this3.media }).then(function () {
          _this3.onsoa = _this3._play.bind(_this3, from, videoTrack, audioTrack);
          _this3.mediaSource.addEventListener(_events2.default.MEDIA_SOURCE_SOURCE_OPEN, _this3.onsoa);
          _logger.logger.warn('mediaSource did not create');
          _this3.resolveThenMediaSourceOpen = _this3.resolveThenMediaSourceOpen ? _this3.resolveThenMediaSourceOpen : resolve;
          _this3.rejectThenMediaSourceOpen = _this3.rejectThenMediaSourceOpen ? _this3.rejectThenMediaSourceOpen : reject;
          return;
        });
      }

      // deferring execution
      if (_this3.mediaSource && _this3.mediaSource.readyState !== 'open') {
        _logger.logger.warn('readyState is not "open", it\'s currently ', _this3.mediaSource.readyState);
        _this3.shouldPlay = true;
        _this3.resolveThenMediaSourceOpen = _this3.resolveThenMediaSourceOpen ? _this3.resolveThenMediaSourceOpen : resolve;
        _this3.rejectThenMediaSourceOpen = _this3.rejectThenMediaSourceOpen ? _this3.rejectThenMediaSourceOpen : reject;
        return;
      }

      var ifApple = function ifApple() {
        var iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod', 'Safari'];

        if (!!navigator.platform) {
          while (iDevices.length) {
            if (navigator.platform === iDevices.pop()) {
              return true;
            }
          }
        }

        return false;
      };

      // for autoplay on interaction
      var autoPlayFunc = new Promise(function (resolve, reject) {
        if (_this3.media.autoplay && _this3.media.muted !== true && !_this3.opts.retryMuted) {
          if (_this3.onAutoplay && !ifApple()) {
            _this3.onAutoplay(function () {
              _this3.media.muted = false;
              return resolve();
            });
          } else {
            _this3.media.muted = true;
            return resolve();
          }
        } else {
          return resolve();
        }
      });

      autoPlayFunc.then(function () {
        _this3.ws.start(_this3.url, _this3.playTime, _this3.videoTrack, _this3.audioTrack).then(function () {
          // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
          _this3.playPromise = _this3.media.play();
          _this3.startProgressTimer();
          _this3.playPromise.then(function () {
            _this3.onStartStalling(); // switch off at progress checker
            if (_this3.resolveThenMediaSourceOpen) {
              _this3._stop = false;
              _this3.resolveThenMediaSourceOpen();
              _this3.resolveThenMediaSourceOpen = void 0;
              _this3.rejectThenMediaSourceOpen = void 0;
              clearInterval(_this3.retryConnectionTimer);
              _this3.retry = 0;
            }
          }).catch(function (err) {
            _logger.logger.log('playPromise rejection.', err);
            // if error, this.ws.connectionPromise can be undefined
            if (_this3.ws.connectionPromise) {
              _this3.ws.connectionPromise.then(function () {
                return _this3.ws.pause();
              }); // #6694
            }
            // this._pause = true

            if (_this3.opts.retryMuted && _this3.media.muted == false) {
              if (_this3.onMuted) {
                _this3.onMuted();
              }
              _this3.media.muted = true;
              _this3._play(from, videoTrack, audioTrack);
            }

            if (_this3.onError) {
              _this3.onError({
                error: 'play_promise_reject',
                err: err
              });
            }

            if (_this3.rejectThenMediaSourceOpen) {
              _this3.rejectThenMediaSourceOpen();
              _this3.resolveThenMediaSourceOpen = void 0;
              _this3.rejectThenMediaSourceOpen = void 0;
            }

            if (!_this3.opts.retryMuted) {
              _this3.stop();
            }
          });

          return _this3.playPromise;
        });
      });
    });
  };

  MSEPlayer.prototype.init = function init() {
    this._pause = false;
    this.playing = false;
    // flag to pending execution(true)
    this.shouldPlay = false;
    // store to execute pended method play
    this.playTime = void 0;
    this.audioTrack = '';
    this.videoTrack = '';
    this.endProgressTimer();
  };

  MSEPlayer.prototype._resume = function _resume() {
    this.ws.resume();
  };

  MSEPlayer.prototype.onMediaDetaching = function onMediaDetaching() {
    var _this4 = this;

    if (this.stopRunning) {
      _logger.logger.warn('stop is running.');
      return;
    }
    this.stopRunning = true;
    // workaround pending playPromise state
    // TODO: how to be with pending internal statuses
    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    var bindedMD = this.handlerMediaDetaching.bind(this);
    if (this.playPromise) {
      // there are two cases:
      // resolved/rejected
      // both required to shutdown ws, mediasources and etc.
      this.playPromise.then(function () {
        return _this4.handlerMediaDetaching();
      }).catch(function () {
        return _this4.handlerMediaDetaching();
      });
    }
    if (!this.playPromise) {
      return this.handlerMediaDetaching();
    }

    return this.handlerMediaDetaching();
  };

  MSEPlayer.prototype.handlerMediaDetaching = function handlerMediaDetaching() {
    var _this5 = this;

    _logger.logger.info('media source detaching');
    var mediaEmptyPromise = void 0;

    // destroy media source and detach from media element
    this.removeMediaSource();
    this._stop = true;

    if (this.media) {
      this.media.removeEventListener(_events2.default.MEDIA_ELEMENT_PROGRESS, this.oncvp); // checkVideoProgress
      mediaEmptyPromise = new Promise(function (resolve) {
        _this5._onmee = _this5.onMediaElementEmptied(resolve).bind(_this5);
      });
      mediaEmptyPromise.then(function () {
        return _this5.stopRunning = false;
      });
      this.media.addEventListener(_events2.default.MEDIA_ELEMENT_EMPTIED, this._onmee);
    }

    this.oncvp = null;

    this.mediaSource = null;

    this.init();
    this.ws.destroy();
    this.sb.destroy();
    return mediaEmptyPromise;
  };

  MSEPlayer.prototype.removeMediaSource = function removeMediaSource() {
    var ms = this.mediaSource;
    if (ms) {
      if (ms.readyState === 'open') {
        try {
          // endOfStream could trigger exception if any sourcebuffer is in updating state
          // we don't really care about checking sourcebuffer state here,
          // as we are anyway detaching the MediaSource
          // let's just avoid this exception to propagate
          ms.endOfStream();
        } catch (err) {
          _logger.logger.warn('onMediaDetaching:' + err.message + ' while calling endOfStream');
        }
      }

      ms.removeEventListener(_events2.default.MEDIA_SOURCE_SOURCE_OPEN, this.onmso);
      ms.removeEventListener(_events2.default.MEDIA_SOURCE_SOURCE_ENDED, this.onmse);
      ms.removeEventListener(_events2.default.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc);
      this.onmso = null;
      this.onmse = null;
      this.onmsc = null;
    }

    // Detach properly the MediaSource from the HTMLMediaElement as
    // suggested in https://github.com/w3c/media-source/issues/53.
    // URL.revokeObjectURL(this.media.src)
    this.media.removeAttribute('src');
    this.media.load();
  };

  MSEPlayer.prototype.onMediaElementEmptied = function onMediaElementEmptied(resolve) {
    if (this._onmee && this.media) {
      this.media.removeEventListener(_events2.default.MEDIA_ELEMENT_EMPTIED, this._onmee);
      this._onmee = void 0;
    }
    return resolve();
  };

  MSEPlayer.prototype.onAttachMedia = function onAttachMedia(data) {
    var _this6 = this;

    this.media = data.media;
    var media = this.media;
    if (!(media instanceof HTMLMediaElement)) {
      throw new Error(_messages2.default.NOT_HTML_MEDIA_ELEMENT);
    }
    if (media) {
      // setup the media source
      var ms = this.mediaSource = new MediaSource();
      // Media Source listeners
      this.onmse = this.onMediaSourceEnded.bind(this);
      this.onmsc = this.onMediaSourceClose.bind(this);

      ms.addEventListener(_events2.default.MEDIA_SOURCE_SOURCE_ENDED, this.onmse);
      ms.addEventListener(_events2.default.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc);
      // link video and media Source
      media.src = URL.createObjectURL(ms);

      // this.oncvp = this.debounce(mseUtils.checkVideoProgress(media, this).bind(this), 500)
      this.oncvp = mseUtils.checkVideoProgress(media, this).bind(this);
      this.media.addEventListener(_events2.default.MEDIA_ELEMENT_PROGRESS, this.oncvp);
      if (this.liveError) {
        this.player = void 0;
        return;
      }
      return new Promise(function (resolve) {
        _this6.onmso = _this6.onMediaSourceOpen.bind(_this6, resolve);
        ms.addEventListener(_events2.default.MEDIA_SOURCE_SOURCE_OPEN, _this6.onmso);
      });
    }
  };

  MSEPlayer.prototype.onMediaSourceOpen = function onMediaSourceOpen(resolve) {
    resolve();
    var mediaSource = this.mediaSource;
    if (mediaSource) {
      // once received, don't listen anymore to sourceopen event
      mediaSource.removeEventListener(_events2.default.MEDIA_SOURCE_SOURCE_OPEN, this.onmso);
    }

    URL.revokeObjectURL(this.media.src);

    // play was called but stoped and was pend(1.readyState is not open)
    // and time is come to execute it
    if (this.shouldPlay) {
      this.shouldPlay = false;
      _logger.logger.info('readyState now is ' + this.mediaSource.readyState + ', and will be played', this.playTime, this.audioTrack, this.videoTrack);
      this._play(this.playTime, this.audioTrack, this.videoTrack);
    }
  };

  MSEPlayer.prototype.onDisconnect = function onDisconnect(event) {
    if (this.opts.onDisconnect) {
      this.opts.onDisconnect(event);
    }
  };

  // canStartUnmuted() {
  //   if (!this.playing && this.shouldPlay) {
  //     this.shouldPlay = false
  //     this._play(this.playTime, this.audioTrack, this.videoTrack).then(() => {
  //       this.media.muted = false
  //       window.removeEventListener('click', this.canStartUnmuted)
  //       window.removeEventListener('touchstart', this.canStartUnmuted)
  //     })
  //   }
  // }

  MSEPlayer.prototype.dispatchMessage = function dispatchMessage(e) {
    var _this7 = this;

    if (this.stopRunning) {
      return;
    }

    var rawData = e.data;
    var isDataAB = rawData instanceof ArrayBuffer;
    var parsedData = !isDataAB ? JSON.parse(rawData) : void 0;
    // mseUtils.logDM(isDataAB, parsedData)

    try {
      // ArrayBuffer data
      if (isDataAB) {
        // wait for MSE_INIT_SEGMENT
        if (this.waitForInitFrame) {
          return _logger.logger.log('old frames');
        }
        this.sb.procArrayBuffer(rawData);
      }

      /*
       * EVENTS
       */
      if (parsedData && parsedData.type === _segments.EVENT_SEGMENT) {
        var eventType = parsedData[_segments.EVENT_SEGMENT];
        _logger.logger.log('%c ' + parsedData.type + ' ' + (parsedData.type === 'event' ? parsedData.event : 'mse_init_segment'), 'background: aquamarine;', parsedData);
        switch (eventType) {
          case WS_EVENT_RESUMED:
            if (this._pause && !this.playing) {
              // wait for "progress" event, for shift currentTime and start playing
              this.onStartStalling();
            }
            break;
          case WS_EVENT_PAUSED:
            break;
          case WS_EVENT_SEEKED:
          case WS_EVENT_SWITCHED_TO_LIVE:
            this.seekValue = void 0;
            if (this.opts.onSeeked) {
              try {
                this.opts.onSeeked();
              } catch (err) {
                console.error(err);
              }
            }
            break;
          case WS_EVENT_EOS:
            this._eos = true;
            this.sb.onBufferEos();
            break;
          // if live source is unavailability
          case WS_EVENT_NO_LIVE:
            _logger.logger.log('do playPromise reject with error');
            if (this.ws.connectionPromise) {
              this.ws.connectionPromise.then(function () {
                return _this7.ws.pause();
              }); // #6694
            }
            if (!this.liveError) {
              if (this.opts.onError) {
                this.opts.onError({
                  error: 'playPromise reject - stream unavaible'
                });
              }
              this.liveError = true;
            }

            if (this.rejectThenMediaSourceOpen) {
              this.rejectThenMediaSourceOpen();
              this.resolveThenMediaSourceOpen = void 0;
              this.rejectThenMediaSourceOpen = void 0;
            }
            this.playPromise = Promise.reject('stream unavaible');
            this.mediaSource.endOfStream();
            break;
          case WS_EVENT_TRACKS_SWITCHED:
            break;
          default:
            if (this.opts.onError) {
              this.opts.onError({ error: 'unhandled_event', event: eventType });
            }
            _logger.logger.warn('unknown type of event', eventType);
        }
        return;
      }

      // MSE_INIT_SEGMENT
      if (parsedData && parsedData.type === _segments.MSE_INIT_SEGMENT) {
        return this.procInitSegment(rawData);
      }
    } catch (err) {
      mseUtils.showDispatchError.bind(this)(e, err);
      try {
        if (this.mediaInfo && this.mediaInfo.activeStreams) {
          var activeStreams = this.mediaInfo.activeStreams;

          this.setTracks([activeStreams.video ? activeStreams.video : '', activeStreams.audio ? activeStreams.audio : '']);
        }
      } catch (err) {
        this.ws.pause();
      }
    }
  };

  MSEPlayer.prototype.procInitSegment = function procInitSegment(rawData) {
    var data = JSON.parse(rawData);

    if (data.type !== _segments.MSE_INIT_SEGMENT) {
      return _logger.logger.warn('type is not ' + _segments.MSE_INIT_SEGMENT);
    }

    if (this.waitForInitFrame) {
      this.waitForInitFrame = false;
    }

    if (this.sb.isBuffered()) {
      // this.media.pause()
      // this.previouslyPaused = false
      // this._setTracksFlag = true
      // this.immediateSwitch = true
      // const startOffset = 0
      // const endOffset = Infinity
      // // TODO: should invoke remove method of SourceBuffer's
      // this.sb.flushRange.push({start: startOffset, end: endOffset, type: void 0})
      // // attempt flush immediately
      // this.sb.flushBufferCounter = 0
      // this.sb.doFlush()
      this.sb.seek();
    }

    // calc this.audioTrackId this.videoTrackId
    this.sb.setTracksByType(data);

    var metadata = _extends({}, data.metadata, {
      tracks: data.metadata.streams ? data.metadata.streams : data.metadata.tracks,
      streams: data.metadata.streams ? data.metadata.streams : data.metadata.tracks
    });

    var streams = data.metadata.streams;
    if (data.metadata.tracks) {
      streams = data.metadata.tracks;
    }

    var activeStreams = {};

    if (this.sb.videoTrackId) {
      if (streams[this.sb.videoTrackId - 1] && streams[this.sb.videoTrackId - 1]['track_id']) {
        activeStreams.video = streams[this.sb.videoTrackId - 1]['track_id'];
      }
    }

    if (this.sb.audioTrackId) {
      if (streams[this.sb.audioTrackId - 1] && streams[this.sb.audioTrackId - 1]['track_id']) {
        activeStreams.audio = streams[this.sb.audioTrackId - 1]['track_id'];
      }
    } else {
      if (this.mediaSource && this.sb.sourceBuffer && this.sb.sourceBuffer.audio) this.mediaSource.removeSourceBuffer(this.sb.sourceBuffer.audio);
    }

    this.doMediaInfo(_extends({}, metadata, { activeStreams: activeStreams, version: MSEPlayer.version }));
    _logger.logger.log('%cprocInitSegment:', 'background: lightpink;', data);

    if (this.mediaSource && !this.mediaSource.sourceBuffers.length) {
      this.sb.setMediaSource(this.mediaSource);
      this.sb.createSourceBuffers(data);
    }
    if (!this.liveError) {
      this.sb.createTracks(data.tracks);
    }
  };

  MSEPlayer.prototype.doMediaInfo = function doMediaInfo(metadata) {
    _logger.logger.log('%cmediaInfo:', 'background: orange;', metadata);
    if (this.onMediaInfo) {
      this.mediaInfo = metadata;
      try {
        this.onMediaInfo(metadata);
      } catch (e) {
        console.error(mseUtils.errorMsg(e));
      }
    }
  };

  MSEPlayer.prototype.getVideoTracks = function getVideoTracks() {
    if (!this.mediaInfo) {
      return;
    }
    var videoTracksType = this.mediaInfo.streams ? 'streams' : 'tracks';
    return this.mediaInfo[videoTracksType].filter(function (s) {
      return s.content === TYPE_CONTENT_VIDEO;
    });
  };

  MSEPlayer.prototype.getAudioTracks = function getAudioTracks() {
    if (!this.mediaInfo) {
      return;
    }
    var videoTracksType = this.mediaInfo.streams ? 'streams' : 'tracks';
    return this.mediaInfo[videoTracksType].filter(function (s) {
      return s.content === TYPE_CONTENT_AUDIO;
    });
  };

  /**
   * on immediate level switch end, after new fragment has been buffered:
   * - nudge video decoder by slightly adjusting video currentTime (if currentTime buffered)
   * - resume the playback if needed
   */


  MSEPlayer.prototype.immediateLevelSwitchEnd = function immediateLevelSwitchEnd() {
    var _this8 = this;

    var media = this.media;
    if (media && media.buffered.length) {
      this.immediateSwitch = false;
      // if (BufferHelper.isBuffered(media, media.currentTime)) {
      // only nudge if currentTime is buffered
      // media.currentTime -= 0.0001;
      // }
      if (!this.previouslyPaused) {
        this.playPromise = media.play();
        this.playPromise.then(function () {
          _this8._pause = false;
          _this8.playing = true;
        });
      }
    }
  };

  MSEPlayer.prototype.onStartStalling = function onStartStalling() {
    if (this.opts.onStartStalling) {
      this.opts.onStartStalling();
    }
    this._stalling = true;
    _logger.logger.log('onStartStalling');
  };

  MSEPlayer.prototype.onEndStalling = function onEndStalling() {
    if (this.opts.onEndStalling) {
      this.opts.onEndStalling();
    }
    this._stalling = false;
    _logger.logger.log('onEndStalling');
  };

  MSEPlayer.prototype.startProgressTimer = function startProgressTimer() {
    this.timer = setInterval(this.onTimer.bind(this), this.opts.progressUpdateTime);
  };

  MSEPlayer.prototype.endProgressTimer = function endProgressTimer() {
    clearInterval(this.timer);
    this.timer = void 0;
  };

  MSEPlayer.prototype.onTimer = function onTimer() {
    if (this._eos) {
      return _logger.logger.log('nothing to play');
    }

    // #TODO explain
    if (this.immediateSwitch) {
      this.immediateLevelSwitchEnd();
    }

    if (this.sb.lastLoadedUTC === this.utcPrev) {
      // logger.log('%cloaded utc is not change', 'background: orange;', this.sb.lastLoadedUTC, this.utcPrev, this._stalling)
      return;
    }

    if (this._stalling) {
      // logger.log('%cStalling flag is true', 'background: lightred;')
      return;
    }

    this.utcPrev = this.sb.lastLoadedUTC;

    if (!this.onProgress) {
      return;
    }
    try {
      this.onProgress(this.sb.lastLoadedUTC);
    } catch (e) {
      console.error(mseUtils.errorMsg(e));
    }
  };

  MSEPlayer.prototype.onMediaSourceEnded = function onMediaSourceEnded() {
    _logger.logger.log('media source ended');
    try {
      if (this.opts.onEOS) {
        this.opts.onEOS();
      }
    } catch (err) {
      console.error('error while proccessing onEOS');
    }
  };

  MSEPlayer.prototype.onMediaSourceClose = function onMediaSourceClose() {
    _logger.logger.log('media source closed');
  };

  MSEPlayer.prototype.onConnectionRetry = function onConnectionRetry() {
    var _this9 = this;

    if (!this.retryConnectionTimer && !this._stop) {
      if (this.retry < this.opts.connectionRetries) {
        this.retryConnectionTimer = setInterval(function () {
          return _this9.retryConnection();
        }, 5000);
      }
    } else if (this.retry >= this.opts.connectionRetries) {
      clearInterval(this.retryConnectionTimer);
    }
  };

  MSEPlayer.prototype.debounce = function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;
      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  return MSEPlayer;
}();

exports.default = MSEPlayer;
module.exports = exports['default'];

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(18);
module.exports = __webpack_require__(3).Array.find;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(19);
var $find = __webpack_require__(29)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(39)(KEY);


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var core = __webpack_require__(3);
var hide = __webpack_require__(4);
var redefine = __webpack_require__(26);
var ctx = __webpack_require__(9);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
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
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(21);
var IE8_DOM_DEFINE = __webpack_require__(22);
var toPrimitive = __webpack_require__(24);
var dP = Object.defineProperty;

exports.f = __webpack_require__(5) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(5) && !__webpack_require__(7)(function () {
  return Object.defineProperty(__webpack_require__(23)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1);
var document = __webpack_require__(0).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(1);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var hide = __webpack_require__(4);
var has = __webpack_require__(27);
var SRC = __webpack_require__(8)('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(3).inspectSource = function (it) {
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
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 27 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(9);
var IObject = __webpack_require__(30);
var toObject = __webpack_require__(31);
var toLength = __webpack_require__(33);
var asc = __webpack_require__(35);
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
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(10);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(32);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(34);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(36);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1);
var isArray = __webpack_require__(37);
var SPECIES = __webpack_require__(11)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(10);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(0);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(11)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(4)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWSURL = getWSURL;

var _parseurl = __webpack_require__(41);

var _parseurl2 = _interopRequireDefault(_parseurl);

var _events = __webpack_require__(6);

var _events2 = _interopRequireDefault(_events);

var _logger = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WS_COMMAND_SEEK_LIVE = '';
var WS_COMMAND_SEEK = 'play_from=';
var LIVE = 'live';

var WebSocketController = function () {
  function WebSocketController(opts) {
    _classCallCheck(this, WebSocketController);

    this.opts = opts;
    this.init();
    this.onwso = this.open.bind(this);
    this.onwsm = this.handleReceiveMessage.bind(this);
    this.onwse = this.handleError.bind(this);
    this.onwsc = this.onWSClose.bind(this);
  }

  WebSocketController.prototype.init = function init() {
    this.opened = false;
    this.connectionPromise = void 0;
    clearTimeout(this.reconnect);
    this.reconnect = void 0;
  };

  WebSocketController.prototype.start = function start(url, time) {
    var _this = this;

    var videoTrack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var audioTack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    /**
     * if call ws.send command immediately after start
     * it causes to error message like "ws still in connection status"
     * #6809
     */
    this.socketURL = { url: url, time: time, videoTrack: videoTrack, audioTack: audioTack };

    this.connectionPromise = new Promise(function (res, rej) {
      var wsURL = getWSURL(url, time, videoTrack, audioTack);
      _this.websocket = new WebSocket(wsURL);
      _this.websocket.binaryType = 'arraybuffer';
      // do that for remove event method
      _this.websocket.addEventListener(_events2.default.WS_OPEN, _this.onwso);
      _this.websocket.addEventListener(_events2.default.WS_MESSAGE, _this.onwsm);
      _this.websocket.addEventListener(_events2.default.WS_ERROR, _this.onwse);
      _this.websocket.addEventListener(_events2.default.WS_CLOSE, _this.onwsc);

      _this._openingResolve = res;
      // TODO: to think cases when ws can fall
      _this._openingReject = rej;
    });

    return this.connectionPromise;
  };

  WebSocketController.prototype.open = function open() {
    this.opened = true;
    this.paused = true;
    this._openingResolve(); // #6809
    this.resume();
    this.websocket.removeEventListener(_events2.default.WS_OPEN, this.onwso);
  };

  WebSocketController.prototype.send = function send(cmd) {
    this.websocket.send(cmd);
  };

  WebSocketController.prototype.resume = function resume() {
    var _this2 = this;

    clearTimeout(this.reconnect);
    _logger.logger.log('ws: send resume');
    if (this.websocket.readyState === 0) {
      return setTimeout(function () {
        return _this2.resume();
      }, 500);
    } else {
      this.websocket.send('resume');
      this.paused = false;
    }
  };

  WebSocketController.prototype.pause = function pause() {
    _logger.logger.log('ws: send pause');
    /**
     * 0 (CONNECTING) The connection is not yet open.
     * 1 (OPEN) The connection is open and ready to communicate.
     * 2 (CLOSING) The connection is in the process of closing.
     * 3 (CLOSED) The connection is closed or couldn't be opened.
     */
    if (this.websocket.readyState === 1) {
      this.websocket.send('pause');
      this.paused = true;
    }
  };

  WebSocketController.prototype.seek = function seek(utc) {
    var commandStr = utc === LIVE ? WS_COMMAND_SEEK_LIVE : WS_COMMAND_SEEK;
    _logger.logger.log('' + commandStr + utc);
    this.websocket.send('' + commandStr + utc);
  };

  WebSocketController.prototype.setTracks = function setTracks(videoTrack) {
    var audioTrack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    this.websocket.send('set_tracks=' + videoTrack + audioTrack);
  };

  WebSocketController.prototype.handleReceiveMessage = function handleReceiveMessage(e) {
    this.opts.message(e);
  };

  WebSocketController.prototype.handleError = function handleError() {
    if (this.opts.error) {
      var _opts;

      (_opts = this.opts).error.apply(_opts, arguments);
    }
  };

  WebSocketController.prototype.onWSClose = function onWSClose(event) {
    var _this3 = this;

    _logger.logger.log('WebSocket lost connection with code ', event.code + ' and reason: ' + event.reason); // например, "убит" процесс сервера
    if (this.opts.error) {
      this.opts.error({
        error: 'WebSocket lost connection',
        err: 'WebSocket lost connection with code ' + event.code + ' and reason: ' + event.reason
      });
    }
    if (this.opts.wsReconnect) {
      if (event.wasClean && event.code !== 1000 && event.code !== 1006) {
        _logger.logger.log('Clean websocket stop');
        this.destroy();
      } else {
        var _socketURL = this.socketURL,
            url = _socketURL.url,
            time = _socketURL.time,
            videoTrack = _socketURL.videoTrack,
            audioTack = _socketURL.audioTack;

        this.reconnect = setTimeout(function () {
          _this3.start(url, time, videoTrack, audioTack).then(function () {
            clearTimeout(_this3.reconnect);
            return;
          }).catch(function () {
            _this3.destroy();
            return;
          });
        }, 5000);
      }
    }
    if (this.opts.closed) {
      this.opts.closed(event);
    }
  };

  WebSocketController.prototype.destroy = function destroy() {
    if (this.websocket) {
      this.pause();
      this.websocket.removeEventListener(_events2.default.WS_MESSAGE, this.onwsm);
      // this.websocket.onclose = function() {} // disable onclose handler first
      this.websocket.close();
      this.websocket.onclose = void 0; // disable onclose handler first
      clearTimeout(this.reconnect);
      this.reconnect = void 0; // disable onclose handler first
      this.init();
    }
  };

  return WebSocketController;
}();

// TODO


exports.default = WebSocketController;
function getWSURL(url, utc, videoTrack, audioTrack) {
  // TODO: then use @param time it prevent to wrong data from ws(trackID view[47] for example is 100)
  var time = utc;

  if (!time && !videoTrack && !audioTrack) {
    return url;
  }

  var parsedUrl = (0, _parseurl2.default)({ url: url });
  var othersParams = '';

  if (parsedUrl.query) {
    var currentParamsKeysValues = parsedUrl.query.split('&').map(function (keyValue) {
      return keyValue.split('=');
    });

    othersParams = currentParamsKeysValues.filter(function (p) {
      return p[0] !== 'from' && p[0] !== 'tracks';
    }).map(function (kv) {
      return kv.join('=');
    }).join('&');

    _logger.logger.log(othersParams);
  }

  var cleanUrl = parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname + '?';
  var tracksExists = !!videoTrack || !!audioTrack;

  var ampFrom = tracksExists && !!time && time !== LIVE ? '&' : '';
  var fromQuery = utc === LIVE ? '' : 'from=' + Math.floor(time);

  var resultUrl = '' + cleanUrl + (tracksExists ? 'tracks=' + videoTrack + audioTrack : '') + ('' + ampFrom + fromQuery) + ('' + ((tracksExists || !!time && time !== LIVE) && !!othersParams ? '&' : '') + othersParams);
  return resultUrl;
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * parseurl
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var url = __webpack_require__(42)
var parse = url.parse
var Url = url.Url

/**
 * Module exports.
 * @public
 */

module.exports = parseurl
module.exports.original = originalurl

/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */

function parseurl (req) {
  var url = req.url

  if (url === undefined) {
    // URL is undefined
    return undefined
  }

  var parsed = req._parsedUrl

  if (fresh(url, parsed)) {
    // Return cached URL parse
    return parsed
  }

  // Parse the URL
  parsed = fastparse(url)
  parsed._raw = url

  return (req._parsedUrl = parsed)
};

/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */

function originalurl (req) {
  var url = req.originalUrl

  if (typeof url !== 'string') {
    // Fallback
    return parseurl(req)
  }

  var parsed = req._parsedOriginalUrl

  if (fresh(url, parsed)) {
    // Return cached URL parse
    return parsed
  }

  // Parse the URL
  parsed = fastparse(url)
  parsed._raw = url

  return (req._parsedOriginalUrl = parsed)
};

/**
 * Parse the `str` url with fast-path short-cut.
 *
 * @param {string} str
 * @return {Object}
 * @private
 */

function fastparse (str) {
  if (typeof str !== 'string' || str.charCodeAt(0) !== 0x2f /* / */) {
    return parse(str)
  }

  var pathname = str
  var query = null
  var search = null

  // This takes the regexp from https://github.com/joyent/node/pull/7878
  // Which is /^(\/[^?#\s]*)(\?[^#\s]*)?$/
  // And unrolls it into a for loop
  for (var i = 1; i < str.length; i++) {
    switch (str.charCodeAt(i)) {
      case 0x3f: /* ?  */
        if (search === null) {
          pathname = str.substring(0, i)
          query = str.substring(i + 1)
          search = str.substring(i)
        }
        break
      case 0x09: /* \t */
      case 0x0a: /* \n */
      case 0x0c: /* \f */
      case 0x0d: /* \r */
      case 0x20: /*    */
      case 0x23: /* #  */
      case 0xa0:
      case 0xfeff:
        return parse(str)
    }
  }

  var url = Url !== undefined
    ? new Url()
    : {}
  url.path = str
  url.href = str
  url.pathname = pathname
  url.query = query
  url.search = search

  return url
}

/**
 * Determine if parsed is still fresh for url.
 *
 * @param {string} url
 * @param {object} parsedUrl
 * @return {boolean}
 * @private
 */

function fresh (url, parsedUrl) {
  return typeof parsedUrl === 'object' &&
    parsedUrl !== null &&
    (Url === undefined || parsedUrl instanceof Url) &&
    parsedUrl._raw === url
}


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



var punycode = __webpack_require__(43);
var util = __webpack_require__(46);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(47);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports =  true && exports &&
		!exports.nodeType && exports;
	var freeModule =  true && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(this));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(44)(module), __webpack_require__(45)))

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(48);
exports.encode = exports.stringify = __webpack_require__(49);


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelfScope = getSelfScope;
function getSelfScope() {
  // see https://stackoverflow.com/a/11237259/589493
  if (typeof window === 'undefined') {
    /* eslint-disable-next-line no-undef */
    return self;
  } else {
    return window;
  }
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mseUtils = __webpack_require__(12);

var _logger = __webpack_require__(2);

var _common = __webpack_require__(13);

var _events = __webpack_require__(6);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BUFFER_MODE_SEQUENCE = 'sequence'; // segments

var BuffersController = function () {
  function BuffersController() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BuffersController);

    _logger.logger.log('create BuffersController');
    this.media = opts.media;
    this.init(opts);

    this.doArrayBuffer = _mseUtils.doArrayBuffer.bind(this);
    this.maybeAppend = this.maybeAppend.bind(this);
    this.onSBUpdateEnd = this.onSBUpdateEnd.bind(this);
    this.onAudioSBUpdateEnd = this.onAudioSBUpdateEnd.bind(this);
  }

  BuffersController.prototype.init = function init() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.flushRange = [];
    this.appended = 0;
    this.mediaSource = opts.mediaSource;
    // this.segments = []
    this.segmentsVideo = [];
    this.segmentsAudio = [];
    this.sourceBuffer = {};
  };

  BuffersController.prototype.setMediaSource = function setMediaSource(ms) {
    this.mediaSource = ms;
  };

  BuffersController.prototype.createSourceBuffers = function createSourceBuffers(data) {
    var _this = this;

    var sb = this.sourceBuffer;
    data.tracks.forEach(function (s) {
      var isVideo = s.content === _common.VIDEO;
      var mimeType = isVideo ? 'video/mp4; codecs="avc1.4d401f"' : 'audio/mp4; codecs="mp4a.40.2"';

      sb[s.content] = _this.mediaSource.addSourceBuffer(mimeType);
      // sb[s.content].timestampOffset = 0.25
      var buffer = sb[s.content];
      if (isVideo) {
        buffer.addEventListener(_events.BUFFER_UPDATE_END, _this.onSBUpdateEnd);
      } else {
        buffer.addEventListener(_events.BUFFER_UPDATE_END, _this.onAudioSBUpdateEnd);
      }
    });
  };

  BuffersController.prototype.onSBUpdateEnd = function onSBUpdateEnd() {
    if (this._needsFlush) {
      _logger.logger.log('flushing buffer');
      this.doFlush();
    }

    if (this._needsEos) {
      this.checkEos();
    }

    if (!this._needsFlush && this.segmentsVideo.length) {

      var buffer = this.sourceBuffer.video;
      if (buffer) {
        if (buffer.updating) {
          return;
        }
        var segment = this.segmentsVideo[0];
        buffer.appendBuffer(segment.data);
        this.segmentsVideo.shift();
        this.appended++;
      }
    }
  };

  BuffersController.prototype.onAudioSBUpdateEnd = function onAudioSBUpdateEnd() {
    if (this._needsFlush) {
      _logger.logger.log('flushing buffer');
      this.doFlush();
    }

    if (this._needsEos) {
      this.checkEos();
    }

    if (!this._needsFlush && this.segmentsAudio.length) {

      var buffer = this.sourceBuffer.audio;
      if (buffer) {
        if (buffer.updating) {
          return;
        }
        var segment = this.segmentsAudio[0];
        buffer.appendBuffer(segment.data);
        this.segmentsAudio.shift();
        this.appended++;
      }
    }
  };

  BuffersController.prototype.createTracks = function createTracks(tracks) {
    var _this2 = this;

    tracks.forEach(function (track) {
      var view = (0, _mseUtils.base64ToArrayBuffer)(track.payload);
      var segment = {
        type: _this2.getTypeBytrackId(track.id),
        isInit: true,
        data: view
      };
      _this2.maybeAppend(segment);
    });
  };

  BuffersController.prototype.maybeAppend = function maybeAppend(segment) {
    if (this._needsFlush) {
      // this.segments.unshift(segment)
      return;
    }
    if (!this.media || this.media.error) {
      if (segment.type === 'audio') {
        this.segmentsAudio = [];
      } else {
        this.segmentsVideo = [];
      }
      _logger.logger.error('trying to append although a media error occured, flush segment and abort');
      return;
    }
    var buffer = this.sourceBuffer[segment.type];
    if (buffer) {
      if (buffer.updating) {
        // this.segments.unshift(segment)
        return;
      }

      buffer.appendBuffer(segment.data);
      if (segment.type === 'audio') {
        this.segmentsAudio.shift();
      } else {
        this.segmentsVideo.shift();
      }
      this.appended++;
    }
  };

  BuffersController.prototype.setTracksByType = function setTracksByType(data) {
    var _this3 = this;

    var type = data.tracks ? 'tracks' : 'streams';
    if (data[type].length === 1) {
      this.audioTrackId = null;
    }
    data[type].forEach(function (s) {
      _this3[s.content === _common.VIDEO ? 'videoTrackId' : 'audioTrackId'] = s.id;
    });
  };

  BuffersController.prototype.getTypeBytrackId = function getTypeBytrackId(id) {
    return this.audioTrackId === id ? _common.AUDIO : _common.VIDEO;
  };

  BuffersController.prototype.procArrayBuffer = function procArrayBuffer(rawData) {
    var segment = this.rawDataToSegmnet(rawData);
    if (segment.type === 'audio') {
      this.segmentsAudio.push(segment);
    } else {
      this.segmentsVideo.push(segment);
    }

    this.doArrayBuffer(segment);
    if (this.sourceBuffer) {
      if (this.sourceBuffer.video && !this.sourceBuffer.video.updating) {
        this.onSBUpdateEnd();
      }
      if (this.sourceBuffer.audio && !this.sourceBuffer.audio.updating) {
        this.onAudioSBUpdateEnd();
      }
    }
  };

  BuffersController.prototype.seek = function seek() {
    for (var k in this.sourceBuffer) {
      this.sourceBuffer[k].abort();
      this.sourceBuffer[k].mode = BUFFER_MODE_SEQUENCE;
    }

    this.segmentsVideo = [];
    this.segmentsAudio = [];
  };

  BuffersController.prototype.isBuffered = function isBuffered() {
    var appended = 0;
    var sourceBuffer = this.sourceBuffer;
    for (var type in sourceBuffer) {
      appended += sourceBuffer[type].buffered.length;
    }
    return appended > 0;
  };

  BuffersController.prototype.doFlush = function doFlush() {
    // loop through all buffer ranges to flush
    while (this.flushRange.length) {
      var range = this.flushRange[0];
      // flushBuffer will abort any buffer append in progress and flush Audio/Video Buffer
      if (this.flushBuffer(range.start, range.end, range.type)) {
        // range flushed, remove from flush array
        this.flushRange.shift();
        this.flushBufferCounter = 0;
      } else {
        this._needsFlush = true;
        // avoid looping, wait for SB update end to retrigger a flush
        return;
      }
    }
    if (this.flushRange.length === 0) {
      // everything flushed
      this._needsFlush = false;

      // let's recompute this.appended, which is used to avoid flush looping
      var appended = 0;
      var sourceBuffer = this.sourceBuffer;
      try {
        for (var type in sourceBuffer) {
          appended += sourceBuffer[type].buffered.length;
        }
      } catch (error) {
        // error could be thrown while accessing buffered, in case sourcebuffer has already been removed from MediaSource
        // this is harmess at this stage, catch this to avoid reporting an internal exception
        console.error('error while accessing sourceBuffer.buffered');
      }
      this.appended = appended;
      this._setTracksFlag = false;
    }
  };

  /*
    flush specified buffered range,
    return true once range has been flushed.
    as sourceBuffer.remove() is asynchronous, flushBuffer will be retriggered on sourceBuffer update end
  */


  BuffersController.prototype.flushBuffer = function flushBuffer(startOffset, endOffset, typeIn) {
    var sb = void 0,
        i = void 0,
        bufStart = void 0,
        bufEnd = void 0,
        flushStart = void 0,
        flushEnd = void 0,
        sourceBuffer = this.sourceBuffer;
    if (Object.keys(sourceBuffer).length) {
      _logger.logger.log('flushBuffer,pos/start/end: ' + this.media.currentTime.toFixed(3) + '/' + startOffset + '/' + endOffset);
      // safeguard to avoid infinite looping : don't try to flush more than the nb of appended segments
      if (this.flushBufferCounter < this.appended) {
        for (var type in sourceBuffer) {
          // check if sourcebuffer type is defined (typeIn): if yes, let's only flush this one
          // if no, let's flush all sourcebuffers
          if (typeIn && type !== typeIn) {
            continue;
          }

          sb = sourceBuffer[type];
          // we are going to flush buffer, mark source buffer as 'not ended'
          sb.ended = false;
          if (!sb.updating) {
            try {
              for (i = 0; i < sb.buffered.length; i++) {
                bufStart = sb.buffered.start(i);
                bufEnd = sb.buffered.end(i);
                // workaround firefox not able to properly flush multiple buffered range.
                if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 && endOffset === Number.POSITIVE_INFINITY) {
                  flushStart = startOffset;
                  flushEnd = endOffset;
                } else {
                  flushStart = Math.max(bufStart, startOffset);
                  flushEnd = Math.min(bufEnd, endOffset);
                }
                /* sometimes sourcebuffer.remove() does not flush
                   the exact expected time range.
                   to avoid rounding issues/infinite loop,
                   only flush buffer range of length greater than 500ms.
                */
                if (Math.min(flushEnd, bufEnd) - flushStart > 0.5) {
                  this.flushBufferCounter++;
                  _logger.logger.log('flush ' + type + ' [' + flushStart + ',' + flushEnd + '], of [' + bufStart + ',' + bufEnd + '], pos:' + this.media.currentTime);
                  sb.remove(flushStart, flushEnd);
                  return false;
                }
              }
            } catch (e) {
              _logger.logger.warn('exception while accessing sourcebuffer, it might have been removed from MediaSource');
            }
          } else {
            // logger.log('abort ' + type + ' append in progress');
            // this will abort any appending in progress
            // sb.abort();
            _logger.logger.warn('cannot flush, sb updating in progress');
            return false;
          }
        }
      } else {
        _logger.logger.warn('abort flushing too many retries');
      }
      _logger.logger.log('buffer flushed');
    }
    // everything flushed !
    return true;
  };

  BuffersController.prototype.rawDataToSegmnet = function rawDataToSegmnet(rawData) {
    var view = new Uint8Array(rawData);
    var trackId = (0, _mseUtils.getTrackId)(view);
    var trackType = this.getTypeBytrackId(trackId);
    return { type: trackType, data: view };
  };

  // on BUFFER_EOS mark matching sourcebuffer(s) as ended and trigger checkEos()


  BuffersController.prototype.onBufferEos = function onBufferEos() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var sb = this.sourceBuffer;
    var dataType = data.type;
    for (var type in sb) {
      if (!dataType || type === dataType) {
        if (!sb[type].ended) {
          sb[type].ended = true;
          _logger.logger.log(type + ' sourceBuffer now EOS');
        }
      }
    }
    this.checkEos();
  };

  // if all source buffers are marked as ended, signal endOfStream() to MediaSource.


  BuffersController.prototype.checkEos = function checkEos() {
    var sb = this.sourceBuffer,
        mediaSource = this.mediaSource;
    if (!mediaSource || mediaSource.readyState !== 'open') {
      this._needsEos = false;
      return;
    }
    for (var type in sb) {
      var sbobj = sb[type];
      if (!sbobj.ended) {
        return;
      }

      if (sbobj.updating) {
        this._needsEos = true;
        return;
      }
    }
    _logger.logger.log('all media data available, signal endOfStream() to MediaSource and stop loading fragment');
    // Notify the media element that it now has all of the media data
    try {
      mediaSource.endOfStream();
    } catch (e) {
      _logger.logger.warn('exception while calling mediaSource.endOfStream()');
    }
    this._needsEos = false;
  };

  BuffersController.prototype.destroy = function destroy() {
    this.init();
  };

  return BuffersController;
}();

exports.default = BuffersController;
module.exports = exports['default'];

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EVENT_SEGMENT = exports.EVENT_SEGMENT = 'event';
var MSE_INIT_SEGMENT = exports.MSE_INIT_SEGMENT = 'mse_init_segment';
var MSE_MEDIA_SEGMENT = exports.MSE_MEDIA_SEGMENT = 'mse_media_segment';

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MSG = {
  NOT_HTML_MEDIA_ELEMENT: 'media should be an HTMLMediaElement instance'
};

exports.default = MSG;
module.exports = exports['default'];

/***/ })
/******/ ]);
});