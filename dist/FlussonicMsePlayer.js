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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.enableLogs = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _getSelfScope = __webpack_require__(19);

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

      args && func.apply(global.console, args);
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-env browser */

/* eslint-disable no-undef, no-use-before-define, new-cap */
module.exports = function (content, workerConstructor, workerOptions, url) {
  var globalScope = self || window;

  try {
    try {
      var blob;

      try {
        // New API
        blob = new globalScope.Blob([content]);
      } catch (e) {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = globalScope.BlobBuilder || globalScope.WebKitBlobBuilder || globalScope.MozBlobBuilder || globalScope.MSBlobBuilder;
        blob = new BlobBuilder();
        blob.append(content);
        blob = blob.getBlob();
      }

      var URL = globalScope.URL || globalScope.webkitURL;
      var objectURL = URL.createObjectURL(blob);
      var worker = new globalScope[workerConstructor](objectURL, workerOptions);
      URL.revokeObjectURL(objectURL);
      return worker;
    } catch (e) {
      return new globalScope[workerConstructor]("data:application/javascript,".concat(encodeURIComponent(content)), workerOptions);
    }
  } catch (e) {
    if (!url) {
      throw Error("Inline worker is not supported");
    }

    return new globalScope[workerConstructor](url, workerOptions);
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorMsg = exports.replaceHttpByWS = exports.checkVideoProgress = undefined;
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

var _logger = __webpack_require__(0);

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

var checkVideoProgress = exports.checkVideoProgress = function checkVideoProgress(media, player) {
  return function () {
    var ct = media.currentTime,
        buffered = media.buffered,
        l = media.buffered.length;


    var debounce = function debounce(func, wait, immediate) {
      var timeout = void 0;
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
            // let currentTime = 'null';
            // if (media) {
            //   currentTime = media.currentTime.toString();
            // }
            if (sb.updating) {
              return;
            }
            // logger.log(`sb remove ${type} [${removeStart},${removeEnd}], of [${bufStart},${bufEnd}], pos:${currentTime}`)
            sb.remove(removeStart, removeEnd);
            return true;
          }
        }
      } catch (error) {
        _logger.logger.warn('removeBufferRange failed', error);
      }

      return false;
    };

    if (player) {
      var sourceBuffer = player.sb.sourceBuffer;

      var bufferTypes = Object.keys(sourceBuffer);
      var targetBackBufferPosition = ct - 30;

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
            debounce(removeBufferRange(bufferType, sb, 0, targetBackBufferPosition), 100);
          }
        }
      }
    }

    if (player.media.readyState <= 2 && player.media.networkState === 2) {
      player.onStartStalling();
    } else if (player.media.readyState > 2) {
      player.onEndStalling();
    }

    if (!l) {
      return;
    }
    var endTime = buffered.end(l - 1);
    var delay = Math.abs(endTime - ct);
    // if (player._stalling) {
    //   // player.onEndStalling()
    //   // если поставлена пауза
    //   if (media.paused && player._pause && !player.playing) {
    //     media.currentTime = endTime - 0.0001
    //     player.playPromise = media.play()
    //     player.playPromise
    //       .then(() => {
    //         player._pause = false
    //         player.playing = true
    //       })
    //       .catch(() => {
    //         return
    //       })
    //   }
    // }

    if (player.playerStatsObject) {
      player.playerStatsObject.bytes = player.sb.totalBytesCollected;
      player.playerStatsObject.updated_at = Date.now();
      if (player.playing) {
        if (player.playbackSegmentStart) {
          var playerIns = player.playerStatsObject.application;

          if (playerIns) {
            var vQuality = player.media.getVideoPlaybackQuality();
            var corruptedVideoFrames = vQuality.corruptedVideoFrames,
                droppedVideoFrames = vQuality.droppedVideoFrames,
                totalVideoFrames = vQuality.totalVideoFrames;
            var live_duration = playerIns.live_duration;

            live_duration += player.playerStatsObject.updated_at - player.playbackSegmentStart;
            player.addPlayerStat('live_duration', false, live_duration);
            player.addPlayerStat('total_video_frames', false, totalVideoFrames);
            player.addPlayerStat('dropped_video_frames', false, droppedVideoFrames);
            player.addPlayerStat('corrupted_video_frames', false, corruptedVideoFrames);
          }
        }
        player.playbackSegmentStart = player.playerStatsObject.updated_at;
      }

      player.addStat({
        updated_at: player.playerStatsObject.updated_at,
        bytes: player.sb.totalBytesCollected
      });
    }

    if (delay <= player.opts.maxBufferDelay) {
      return;
    }

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

function showDispatchError(e) {
  var err = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if ('data' in e) {
    var rawData = e.data;
    var isDataAB = rawData instanceof ArrayBuffer;
    if (isDataAB) {
      _logger.logger.error('Data:', debugData(e.data));
    }
  }

  _logger.logger.error(errorMsg(e), err);

  if (this.media && 'error' in this.media) {
    _logger.logger.error('MediaError:', this.media.error);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var VIDEO = exports.VIDEO = 'video';
var AUDIO = exports.AUDIO = 'audio';

/***/ }),
/* 4 */
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
  MEDIA_ELEMENT_PLAY: 'play',
  MEDIA_ELEMENT_PAUSE: 'pause',
  MEDIA_ELEMENT_PROGRESS: 'progress',
  MEDIA_ELEMENT_EMPTIED: 'emptied',
  MEDIA_ELEMENT_SUSPEND: 'suspend',
  MEDIA_ELEMENT_STALLED: 'stalled',
  MEDIA_ELEMENT_WAITING: 'waiting',
  MEDIA_ELEMENT_RATECHANGE: 'ratechange',
  MEDIA_ELEMENT_PLAYING: 'playing',

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MsePlayer = __webpack_require__(7);

var _MsePlayer2 = _interopRequireDefault(_MsePlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _MsePlayer2.default;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import MediaSourceController from '../controllers/mediaSource'


var _ws = __webpack_require__(8);

var _ws2 = _interopRequireDefault(_ws);

var _buffers = __webpack_require__(20);

var _buffers2 = _interopRequireDefault(_buffers);

var _statsWorker = __webpack_require__(21);

var _statsWorker2 = _interopRequireDefault(_statsWorker);

var _mseUtils = __webpack_require__(2);

var mseUtils = _interopRequireWildcard(_mseUtils);

var _logger = __webpack_require__(0);

var _segments = __webpack_require__(22);

var _common = __webpack_require__(3);

var _events = __webpack_require__(4);

var _events2 = _interopRequireDefault(_events);

var _messages = __webpack_require__(23);

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
var WS_PREFER_HIGH_QUALITY = false;

var TYPE_CONTENT_VIDEO = _common.VIDEO;
var TYPE_CONTENT_AUDIO = _common.AUDIO;
var DEFAULT_ERRORS_BEFORE_STOP = 1;
var DEFAULT_UPDATE = 500;
var DEFAULT_CONNECTIONS_RETRIES = 0;
var DEFAULT_RETRY_MUTED = false;
// const DEFAULT_FORCE_UNMUTED = false;
var MAX_BUFFER_DELAY = 2;
var DEFAULT_ON_CRASH_TRY_VIDEO_ONLY = true;
var DEFAULT_STATS_SEND = true;

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
      return "22.6.1";
    }
  }]);

  function MSEPlayer(media, urlStream) {
    var _this = this;

    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, MSEPlayer);

    if (opts.debug) {
      (0, _logger.enableLogs)(true);
      window.humanTime = mseUtils.humanTime;
    }

    _logger.logger.info('[mse-player]:', MSEPlayer.version);

    this.opts = opts || {};

    this.media = media;
    this.url = urlStream;
    this.firstStart = true;

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

    this.opts.preferHQ = this.opts.preferHQ ? this.opts.preferHQ : WS_PREFER_HIGH_QUALITY;

    if (typeof this.opts.preferHQ !== 'boolean') {
      throw new Error('invalid preferHQ param, should be boolean');
    }

    this.opts.onCrashTryVideoOnly = this.opts.onCrashTryVideoOnly || DEFAULT_ON_CRASH_TRY_VIDEO_ONLY;

    if (typeof this.opts.onCrashTryVideoOnly !== 'boolean') {
      throw new Error('invalid onCrashTryVideoOnly param, should be boolean');
    }

    this.retry = 0;
    this.retryConnectionTimer;

    this.opts.retryMuted = this.opts.retryMuted ? this.opts.retryMuted : DEFAULT_RETRY_MUTED;

    if (typeof this.opts.retryMuted !== 'boolean') {
      throw new Error('invalid retryMuted param, should be boolean');
    }

    this.opts.maxBufferDelay = this.opts.maxBufferDelay ? this.opts.maxBufferDelay : MAX_BUFFER_DELAY;
    var ua = navigator.userAgent;
    if (/Edge/.test(ua) || /trident.*rv:1\d/i.test(ua)) {
      this.opts.maxBufferDelay = 10; // very slow buffers in Edge
    }

    if (typeof this.opts.maxBufferDelay !== 'number') {
      throw new Error('invalid maxBufferDelay param, should be number');
    }

    if (this.opts.videoQuality) {
      if (typeof this.opts.videoQuality !== 'string') {
        throw new Error('invalid videoQuality param, should be string');
      }
      if (this.opts.videoQuality !== 'highest' && this.opts.videoQuality !== 'lowest') {
        throw new Error('invalid videoQuality param, should be highest or lowest');
      }
    }

    try {
      this.Sentry = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module '@sentry/browser'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
    } catch (e) {
      this.noSentry = true;
    }

    this.opts.sentryConfig = this.opts.sentryConfig ? this.opts.sentryConfig : '';
    if (typeof this.opts.sentryConfig !== 'string') {
      throw new Error('invalid sentryConfig param, should be string');
    }

    if (this.opts.sentryConfig.length && !this.noSentry) {
      this.Sentry.init({
        dsn: this.opts.sentryConfig,
        environment: "production" || false,
        release: 'Mse Player@' + MSEPlayer.version
      });

      document.onerror = function (err) {
        _this.Sentry.captureException(err);
      };
    }

    // Stats block start
    this.opts.statsSendEnable = this.opts.statsSendEnable ? this.opts.statsSendEnable : DEFAULT_STATS_SEND;
    if (typeof this.opts.maxBufferDelay !== 'number') {
      throw new Error('invalid maxBufferDelay param, should be number');
    }

    if (window.Worker) {
      this.statsWorker = new _statsWorker2.default();
      this.statsWorker.onmessage = this.onStatsWorkerMessage.bind(this);

      if (this.opts.statsSendTime) {
        if (typeof this.opts.statsSendTime !== 'number') {
          throw new Error('invalid statsSendTime param, should be number');
        }
        this.statsWorker.postMessage({
          command: 'time',
          commandObj: this.opts.statsSendTime * 1000
        });
      }
      this.statsWorker.postMessage({
        command: 'start',
        commandObj: this.url
      });
      this.statsWorkerStarted = true;
    }

    this.resetStats = function () {
      _this.playerStatsObject = {
        proto: 'mseld',
        user_agent: navigator.userAgent,
        bytes: 0,
        // player info
        application: {
          application_name: 'mseld_player',
          application_version: MSEPlayer.version,
          // counts
          stall_count: 0,
          pause_count: 0,
          error_count: 0,
          reconnect_count: 0,
          bitrate_change_count: 0,
          // durations
          live_duration: 0,
          stall_duration: 0,
          pause_duration: 0,
          // frames stats
          total_video_frames: 0,
          dropped_video_frames: 0,
          corrupted_video_frames: 0
        }
      };
      _this.addStat(_this.playerStatsObject);
      if (!_this.statsWorkerStarted) {
        _this.statsWorker.postMessage({
          command: 'start',
          commandObj: _this.url
        });
        _this.statsWorkerStarted = true;
      }
    };
    // Stats block end

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
    this.onEventCallback = opts && opts.onEvent;
    this.onAutoplay = opts && opts.onAutoplay;
    this.onMuted = opts && opts.onMuted;
    this.onStats = opts && opts.onStats;
    this.onMessage = opts && opts.onMessage;
    this.onPause = opts && opts.onPause;
    this.onResume = opts && opts.onResume;

    if (media instanceof HTMLMediaElement) {
      // iOS autoplay with no fullscreen fix
      media.WebKitPlaysInline = true;
      media.controls = false;
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

    this.messageTime = Date.now();
    this.init();
  }

  MSEPlayer.prototype.play = function play(videoTrack, audioTrack) {
    var _this2 = this;

    _logger.logger.log('[mse-player]: play()');
    if (this.playing) {
      _logger.logger.log('MSE is already playing');
      return;
    }
    if (this.ws && this.ws.websocket && !this._pause) {
      _logger.logger.log('[mse-player]: websocket already opened');
      return;
    }

    return this._play(videoTrack, audioTrack).then(function () {
      _this2.playing = true;
      _this2._stop = false;

      if (_this2.pendingTracks) {
        _this2.setTracks(_this2.pendingTracks);
        _this2.pendingTracks = undefined;
      }
    }).catch(function (error) {
      _this2.onPlayerError(error);
      _logger.logger.error('[mse-player]: got error on play', error);
      _this2.playing = false;
    });
  };

  MSEPlayer.prototype.stop = function stop() {
    var _this3 = this;

    if (this.playPromise) {
      this.onEvent({
        key: Date.now(),
        data: {
          event: 'play_stop'
        }
      });
      this.playerStatsObject.closed_at = Date.now();
      this.addStat({
        closed_at: this.playerStatsObject.closed_at
      });
      if (this.opts.statsSendEnable) {
        this.statsWorkerStarted = false;
      }

      this.playPromise.catch(function () {
        if (_this3.resetTimer) {
          clearTimeout(_this3.resetTimer);
          _this3.resetTimer = void 0;
        }
        if (_this3._stop) {
          _logger.logger.log('[mse-player]: already stopped');
          return;
        }
        return _this3.onMediaDetaching();
      }).finally(function () {
        if (_this3.resetTimer) {
          clearTimeout(_this3.resetTimer);
          _this3.resetTimer = void 0;
        }
        if (_this3._stop) {
          _logger.logger.log('[mse-player]: already stopped');
          return;
        }
        return _this3.onMediaDetaching();
      });
    } else {
      _logger.logger.log('[mse-player]: no playPromise exists, nothing to stop');
    }
    this.firstStart = true;
    delete this.uuid;
  };

  MSEPlayer.prototype.pause = function pause() {
    if (!canPause.bind(this)()) {
      return _logger.logger.log('[mse:playback] can not do pause');
    }
    var binded = _pause.bind(this);
    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    this.playPromise.then(binded, binded).catch(binded, binded);
    function _pause() {
      this.ws.pause();
      this.media.pause();
      this._pause = true;
      this.playing = false;

      this.addPlayerStat('pause_count');
      this.pauseStarted = Date.now();

      if (this.onPause) {
        try {
          this.onPause();
        } catch (e) {
          _logger.logger.error('Error ' + e.name + ':' + e.message + '\n' + e.stack);
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
    var fullRestart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var from = fullRestart ? undefined : this.sb.lastLoadedUTC;

    this.playing = false;
    this.ws.destroy();
    this.ws.init();
    this.ws.start(this.url, from, this.videoTrack, this.audioTrack);

    this.addPlayerStat('reconnect_count');
    this.onEndStalling();
  };

  MSEPlayer.prototype.retryConnection = function retryConnection() {
    var _this4 = this;

    var videoTrack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var audioTrack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (this.retry >= this.opts.connectionRetries) {
      clearInterval(this.retryConnectionTimer);
      return;
    }
    _logger.logger.log('%cconnectionRetry:', 'background: orange;', 'Retrying ' + (this.retry + 1));
    this.mediaSource = void 0;
    this.init();
    this.ws.destroy();
    this.sb.destroy();

    this.play(videoTrack, audioTrack).then(function () {
      _this4.onEndStalling();
    });
    this.retry = this.retry + 1;
  };

  MSEPlayer.prototype.setTracks = function setTracks(data) {
    var _this5 = this;

    var tracks = data;
    if (!this.mediaInfo) {
      _logger.logger.warn('Media info did not loaded. Should try after onMediaInfo triggered or inside.');
      return;
    }

    if (tracks === 'lowest') {
      tracks = this.autoTrackSelection(false);
    } else if (tracks === 'highest') {
      tracks = this.autoTrackSelection(true);
    } else if (!Array.isArray(tracks)) {
      _logger.logger.error('tracks should be an Array instance: ["v1", "a1"]');
      return;
    }

    if (!this.playing) {
      this.pendingTracks = tracks;
      return;
    }

    var videoTracksType = this.mediaInfo.streams ? 'streams' : 'tracks';

    var videoTracksStr = tracks.filter(function (id) {
      var stream = _this5.mediaInfo[videoTracksType].find(function (s) {
        return id === s['track_id'];
      });
      return !!stream && stream.content === TYPE_CONTENT_VIDEO;
    }).join('');

    var audioTracksStr = tracks.filter(function (id) {
      var stream = _this5.mediaInfo[videoTracksType].find(function (s) {
        return id === s['track_id'];
      });
      if (stream) {
        // if (stream.bitrate && stream.bitrate === 0) {
        //   return null
        // }
        return !!stream && stream.content === TYPE_CONTENT_AUDIO;
      } else {
        return null;
      }
    }).join('');

    if (!audioTracksStr.length && !videoTracksStr.length) {
      _logger.logger.warn('No such stream tracks! Setting to default parameters');
      var videoTracks = this.getVideoTracks();
      var audioTracks = this.getAudioTracks();
      if (audioTracks.length) {
        audioTracksStr = audioTracks[0].track_id;
      } else {
        _logger.logger.warn('No audio tracks');
      }
      if (videoTracks.length) {
        // Добавить адаптивный выбор видео дорожки?
        videoTracksStr = videoTracks[0].track_id;
      } else {
        _logger.logger.warn('No video tracks');
      }
    }

    if (!audioTracksStr.length) {
      if (this.sb.sourceBuffer.audio) {
        this.sb.removeSourceBuffer();
      }
      this.media.muted = true;
      _logger.logger.warn('No audio tracks');
    }

    if (videoTracksStr.length && audioTracksStr.length && this.mediaSource.sourceBuffers.length <= 1) {
      this.stop();
      this.media.muted = false;
      this.play();
    }

    this.onStartStalling();
    this.ws.setTracks(videoTracksStr, audioTracksStr);

    this.addPlayerStat('bitrate_change_count');

    this.videoTrack = videoTracksStr;
    this.audioTrack = audioTracksStr;
    // ?
    this._setTracksFlag = true;
    this.waitForInitFrame = true;
  };

  MSEPlayer.prototype.autoTrackSelection = function autoTrackSelection(bestestBest) {
    if (!this.mediaInfo) {
      _logger.logger.warn('Media info did not loaded. Should try after onMediaInfo triggered or inside.');
      return;
    }
    var videoTracks = this.getVideoTracks();
    var audioTracks = this.getAudioTracks();

    var resultVideo = void 0,
        resultAudio = void 0;
    if (bestestBest) {
      var bestVideo = void 0,
          videoParam = void 0;
      if (videoTracks[0].bitrate) {
        videoParam = 'bitrate';
      } else if (videoTracks[0].pixel_width) {
        videoParam = 'pixel_width';
      }
      bestVideo = videoTracks[0][videoParam];
      resultVideo = videoTracks[0].track_id;
      videoTracks.forEach(function (track) {
        if (track[videoParam] > bestVideo) {
          bestVideo = track[videoParam];
          resultVideo = track.track_id;
        }
      });
      if (audioTracks.length) {
        // let bestAudio = audioTracks[0].sample_rate;
        resultAudio = audioTracks[0].track_id;
        audioTracks.forEach(function (track) {
          if (track.sample_rate > bestVideo) {
            // bestAudio = track.sample_rate;
            resultAudio = track.track_id;
          }
        });
      }
    } else {
      var worstVideo = void 0,
          _videoParam = void 0;
      if (videoTracks[0].bitrate) {
        _videoParam = 'bitrate';
      } else if (videoTracks[0].pixel_width) {
        _videoParam = 'pixel_width';
      }
      worstVideo = videoTracks[0][_videoParam];
      resultVideo = videoTracks[0].track_id;
      videoTracks.forEach(function (track) {
        if (track[_videoParam] < worstVideo) {
          worstVideo = track[_videoParam];
          resultVideo = track.track_id;
        }
      });
      if (audioTracks.length) {
        var worstAudio = void 0;
        worstAudio = audioTracks[0].sample_rate;
        resultAudio = audioTracks[0].track_id;
        audioTracks.forEach(function (track) {
          if (track.sample_rate < worstAudio) {
            worstAudio = track.sample_rate;
            resultAudio = track.track_id;
          }
        });
      }
    }

    var resultData = [];
    if (resultVideo && resultVideo.length) {
      resultData.push(resultVideo);
    }
    if (resultAudio && resultAudio.length) {
      resultData.push(resultAudio);
    }
    return resultData;
  };

  /**
   *
   *  Private members
   *
   */

  MSEPlayer.prototype._play = function _play(videoTrack, audioTrack) {
    var _this6 = this;

    this.liveError = false;
    return new Promise(function (resolve, reject) {
      _logger.logger.log('_play', videoTrack, audioTrack);
      if (_this6.playing) {
        var message = '[mse-player] _play: terminate because already has been playing';
        _logger.logger.log(message);
        return resolve({ message: message });
      }

      if (_this6._pause) {
        // should invoke play method of video in onClick scope
        // further logic are duplicated at checkVideoProgress
        // https://github.com/jwplayer/jwplayer/issues/2421#issuecomment-333130812

        if (_this6.ws && _this6.ws.opened === false) {
          _logger.logger.log('WebSocket Closed, trying to restart it');
          _this6._pause = false;
          _this6.restart(true);
          return;
        } else {
          _logger.logger.log('WebSocket is in opened state, resuming');
          _this6._pause = false;
          _this6._resume(); // ws
          if (_this6.pauseStarted) {
            var application = _this6.playerStatsObject.application;

            if (application) {
              var pause_duration = application.pause_duration;

              pause_duration += Date.now() - _this6.pauseStarted;
              _this6.addPlayerStat('pause_duration', false, pause_duration);
              delete _this6.pauseStarted;
            }
          }
        }

        _this6.playPromise = _this6.media.play();
        _logger.logger.log('_play: terminate because _paused and should resume');
        return _this6.playPromise;
      }

      _this6.resetStats();
      _this6.playerStatsObject.opened_at = Date.now();
      _this6.uuid = _this6.generateUUID();
      _this6.addStat({ opened_at: _this6.playerStatsObject.opened_at, id: _this6.uuid });

      _this6.videoTrack = videoTrack;
      _this6.audioTrack = audioTrack;
      _this6._pause = false;

      // TODO: to observe this case, I have no idea when it fired
      if (!_this6.mediaSource) {
        _this6.onAttachMedia({ media: _this6.media }).then(function () {
          _this6.onsoa = _this6._play.bind(_this6, videoTrack, audioTrack);
          _this6.sb.setMediaSource(_this6.mediaSource);
          _this6.mediaSource.addEventListener(_events2.default.MEDIA_SOURCE_SOURCE_OPEN, _this6.onsoa);
          _logger.logger.warn('mediaSource did not create');
          _this6.resolveThenMediaSourceOpen = _this6.resolveThenMediaSourceOpen ? _this6.resolveThenMediaSourceOpen : resolve;
          _this6.rejectThenMediaSourceOpen = _this6.rejectThenMediaSourceOpen ? _this6.rejectThenMediaSourceOpen : reject;
          return;
        });
      }

      // deferring execution
      if (_this6.mediaSource && _this6.mediaSource.readyState !== 'open') {
        _logger.logger.warn('readyState is not "open", it\'s currently ', _this6.mediaSource.readyState);
        _this6.shouldPlay = true;
        _this6.resolveThenMediaSourceOpen = _this6.resolveThenMediaSourceOpen ? _this6.resolveThenMediaSourceOpen : resolve;
        _this6.rejectThenMediaSourceOpen = _this6.rejectThenMediaSourceOpen ? _this6.rejectThenMediaSourceOpen : reject;
        return;
      }

      var ifApple = function ifApple() {
        var iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod', 'Safari'];

        if (navigator.platform) {
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
        if (_this6.media.autoplay && _this6.media.muted !== true && !_this6.opts.retryMuted) {
          if (_this6.onAutoplay && !ifApple()) {
            _this6.onAutoplay(function () {
              _this6.media.muted = false;
              return resolve();
            });
          } else {
            _this6.media.muted = true;
            return resolve();
          }
        } else {
          return resolve();
        }
        reject();
      });

      autoPlayFunc.then(function () {
        _this6.ws.start(_this6.url, _this6.playTime, _this6.videoTrack, _this6.audioTrack).then(function () {
          // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
          _this6.playPromise = _this6.media.play();
          _this6.playPromise.then(function () {
            _this6.onStartStalling(); // switch off at progress checker
            _this6.startProgressTimer();
            if (_this6.resolveThenMediaSourceOpen) {
              _this6._stop = false;
              _this6.resolveThenMediaSourceOpen();
              _this6.resolveThenMediaSourceOpen = void 0;
              _this6.rejectThenMediaSourceOpen = void 0;
              clearInterval(_this6.retryConnectionTimer);
              _this6.retry = 0;
            }
            _this6.onEvent({
              key: Date.now(),
              data: {
                event: 'play_started'
              }
            });
          }).catch(function (err) {
            _logger.logger.log('playPromise rejection.', err);
            // if error, this.ws.connectionPromise can be undefined
            if (_this6.ws.connectionPromise) {
              _this6.ws.connectionPromise.then(function () {
                return _this6.ws.destroy();
              }); // #6694
            }

            if (_this6.opts.retryMuted && _this6.media.muted == false) {
              if (_this6.onMuted) {
                _this6.onMuted();
              }
              _this6.media.muted = true;
              _this6._play( /*from, */videoTrack, audioTrack);
            }

            _this6.onPlayerError({
              error: 'play_promise_reject',
              err: err
            });

            if (_this6.rejectThenMediaSourceOpen) {
              _this6.rejectThenMediaSourceOpen();
              _this6.resolveThenMediaSourceOpen = void 0;
              _this6.rejectThenMediaSourceOpen = void 0;
            }

            if (!_this6.opts.retryMuted) {
              _this6.stop();
            }

            if (_this6.opts.onCrashTryVideoOnly) {
              var activeStreams = _this6.mediaInfo.activeStreams;
              var video = activeStreams.video;

              if (video) {
                _this6._play(video);
              }
            }
          });

          return _this6.playPromise;
        });
      });
    });
  };

  MSEPlayer.prototype.init = function init() {
    var fromStop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    this._pause = false;
    this.playing = false;
    // flag to pending execution(true)
    this.shouldPlay = false;
    // store to execute pended method play
    // this.playTime = void 0
    this.audioTrack = '';
    this.videoTrack = '';
    this.endProgressTimer();

    if (!fromStop) {
      this.onEvent({
        key: Date.now(),
        data: {
          event: 'play_init',
          userInfo: window.navigator.userAgent,
          playerInfo: 'MSEPlayer' + (MSEPlayer.version ? '@' + MSEPlayer.version : '')
        }
      });
    }
  };

  MSEPlayer.prototype._resume = function _resume() {
    this.ws.resume();

    this.onEvent({
      key: Date.now(),
      data: {
        event: 'play_websocket_resume'
      }
    });
  };

  MSEPlayer.prototype.onMediaDetaching = function onMediaDetaching() {
    var _this7 = this;

    if (this.stopRunning) {
      _logger.logger.warn('stop is running.');
      return;
    }
    this.stopRunning = true;
    // workaround pending playPromise state
    // TODO: how to be with pending internal statuses
    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    // const bindedMD =
    this.handlerMediaDetaching.bind(this);
    if (this.playPromise) {
      // there are two cases:
      // resolved/rejected
      // both required to shutdown ws, mediasources and etc.
      this.playPromise.catch(function () {
        return _this7.handlerMediaDetaching();
      }).finally(function () {
        return _this7.handlerMediaDetaching();
      });
    } else {
      return this.handlerMediaDetaching();
    }
  };

  MSEPlayer.prototype.handlerMediaDetaching = function handlerMediaDetaching() {
    var _this8 = this;

    _logger.logger.info('media source detaching');
    return new Promise(function (resolve, reject) {
      // destroy media source and detach from media element
      _this8.removeMediaSource();
      if (!_this8.media) {
        return reject('no media to detach');
      }
      _this8.removeListeners();
      _this8.oncvp = null;
      _this8.mediaSource = null;

      _this8.init(true);
      _this8.ws.destroy();
      _this8.sb.destroy();
      _this8.media.onemptied = function () {
        _logger.logger.log('[mse-player]: media emptied');
        _this8.stopRunning = false;
        _this8._stop = true;
        delete _this8.playPromise;
        return resolve();
      };
    });
  };

  MSEPlayer.prototype.removeMediaSource = function removeMediaSource() {
    var _this9 = this;

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
    var close = function close() {
      _this9.media.src = '';
      _this9.media.load();
      if (_this9.resetTimer) {
        clearTimeout(_this9.resetTimer);
        _this9.resetTimer = void 0;
      }
    };

    this.playPromise && this.playPromise.then(function () {
      close();
    }).catch(function () {
      close();
    });
  };

  MSEPlayer.prototype.onMediaElementEmptied = function onMediaElementEmptied(resolve) {
    if (this.onMediaElementEmptied && this.media) {
      this.media.removeEventListener(_events2.default.MEDIA_ELEMENT_EMPTIED, this.onMediaElementEmptied);
      this._onmee = void 0;
    }
    return resolve;
  };

  MSEPlayer.prototype.onAttachMedia = function onAttachMedia(data) {
    var _this10 = this;

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
      this.eventLog = function (event) {
        if (_this10.onEvent) {
          _this10.onEvent(event);
        }
      };
      this.addListeners();

      if (this.liveError) {
        this.player = void 0;
        return;
      }
      return new Promise(function (resolve) {
        _this10.onmso = _this10.onMediaSourceOpen.bind(_this10, resolve);
        ms.addEventListener(_events2.default.MEDIA_SOURCE_SOURCE_OPEN, _this10.onmso);
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
      _logger.logger.info('readyState now is ' + this.mediaSource.readyState + ', and will be played',
      // this.playTime,
      this.audioTrack, this.videoTrack);
      this._play( /*this.playTime, */this.audioTrack, this.videoTrack);
    }
  };

  MSEPlayer.prototype.onDisconnect = function onDisconnect(event) {
    this.onEvent({
      key: Date.now(),
      data: {
        event: 'play_diconnected'
      }
    });
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

  MSEPlayer.prototype.dispatchMessage = function dispatchMessage(data) {
    var _this11 = this;

    if (this.stopRunning) {
      return;
    }

    if (!this.playerStatsObject.first_byte_at) {
      this.playerStatsObject.first_byte_at = Date.now();
      this.addStat({ first_byte_at: this.playerStatsObject.first_byte_at });
    }

    var rawData = data.rawData,
        parsedData = data.parsedData,
        isDataAB = data.isDataAB;
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
            this.onResume && this.onResume();
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
                _logger.logger.error(err);
              }
            }
            break;
          case WS_EVENT_EOS:
            this._eos = true;
            this.sb.onBufferEos();
            break;
          // if live source is unavailability
          case WS_EVENT_NO_LIVE:
            if ('static' in parsedData && parsedData.static == false) {
              _logger.logger.info('Stream is on on demand mode, waiting for init segment');
              this.onStartStalling();
            } else {
              _logger.logger.warn('do playPromise reject with error');
              if (this.ws.connectionPromise) {
                this.ws.connectionPromise.then(function () {
                  return _this11.ws.pause();
                }); // #6694
              }
              if (!this.liveError) {
                this.onPlayerError({
                  error: 'playPromise reject - stream unavaible'
                });
                this.liveError = true;
              }

              if (this.rejectThenMediaSourceOpen) {
                this.rejectThenMediaSourceOpen();
                this.resolveThenMediaSourceOpen = void 0;
                this.rejectThenMediaSourceOpen = void 0;
              }
              this.playPromise = Promise.reject('stream unavaible');
              this.mediaSource.endOfStream();
            }
            break;
          case WS_EVENT_TRACKS_SWITCHED:
            break;
          default:
            if (this.opts.onEvent) {
              this.opts.onEvent({ error: 'unhandled_event', event: eventType });
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
      mseUtils.showDispatchError.bind(this)(err);
      try {
        if (this.media.error) {
          this.onPlayerError({
            error: 'Media error',
            mediaError: this.media.error
          });
          this.stop();
        } else {
          if (this.mediaInfo && this.mediaInfo.activeStreams) {
            var activeStreams = this.mediaInfo.activeStreams;

            this.setTracks([activeStreams.video ? activeStreams.video : '', activeStreams.audio ? activeStreams.audio : '']);
          }
        }
      } catch (err) {
        this.ws.pause();
      }
    }
  };

  MSEPlayer.prototype.procInitSegment = function procInitSegment(rawData) {
    var _this12 = this;

    var data = JSON.parse(rawData);

    if (data.type !== _segments.MSE_INIT_SEGMENT) {
      return _logger.logger.warn('type is not ' + _segments.MSE_INIT_SEGMENT);
    }

    if (this.waitForInitFrame) {
      this.waitForInitFrame = false;
    }

    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
      this.resetTimer = void 0;
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
      this.sb.doFlush();
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

    var videoIndex = this.sb.videoTrackId && this.sb.videoTrackId.id - 1;
    if (streams[videoIndex] && streams[videoIndex]['track_id']) {
      if (streams[videoIndex].bitrate && streams[videoIndex].bitrate === 0 || streams[videoIndex].height === 0 || streams[videoIndex].width === 0) {
        this.onPlayerError({
          error: 'Video track error'
        });
        return;
      }
      activeStreams.video = streams[videoIndex]['track_id'];
    }

    var audioIndex = this.sb.audioTrackId && this.sb.audioTrackId.id - 1;
    if (audioIndex) {
      if (streams[audioIndex] && streams[audioIndex]['track_id']) {
        if (streams[audioIndex].bitrate && streams[audioIndex].bitrate === 0) {
          this.onPlayerError({
            error: 'Audio track error'
          });
          var idToDelete = void 0;
          data.tracks.forEach(function (item, index) {
            if (item.id === _this12.sb.audioTrackId.id) {
              idToDelete = index;
            }
          });
          data.tracks.splice(idToDelete, 1);
          if (this.sb.sourceBuffer.audio) {
            this.mediaSource.removeSourceBuffer(this.sb.sourceBuffer.audio);
            // this.sb.audioTrackId = void 0
            delete this.sb.sourceBuffer.audio;
          }
        } else {
          activeStreams.audio = streams[audioIndex]['track_id'];
        }
      }
    }

    var activeInfo = _extends({}, metadata, { activeStreams: activeStreams, version: MSEPlayer.version });
    this.playerStatsObject.source_id = data.session_id;
    this.addStat({ source_id: this.playerStatsObject.source_id });
    this.doMediaInfo(activeInfo);
    _logger.logger.log('%cprocInitSegment:', 'background: lightpink;', data);
    this.onEvent({
      key: Date.now(),
      data: _extends({
        event: 'play_metadata'
      }, activeInfo)
    });

    if (this.mediaSource && !this.mediaSource.sourceBuffers.length) {
      this.sb.setMediaSource(this.mediaSource);
      this.sb.createSourceBuffers(data);
    }
    if (!this.liveError) {
      this.sb.createTracks(data.tracks);
    }

    if (this.opts.videoQuality && this.firstStart) {
      var selectedTracks = void 0;
      if (this.opts.videoQuality === 'lowest') {
        selectedTracks = this.autoTrackSelection(false);
      } else if (this.opts.videoQuality === 'highest') {
        selectedTracks = this.autoTrackSelection(true);
      }
      if (selectedTracks[0] !== activeStreams.video || activeStreams.audio && selectedTracks[1] !== activeStreams.audio) {
        this.ws.setTracks(selectedTracks[0] || '', selectedTracks[1] || '');
        return;
      }
      this.firstStart = false;
    }

    if (this.opts.preferHQ) {
      _logger.logger.info('[MSE]: preferHQ option is depricated. Use videoQuality(lowest/highest) instead');
    }

    this.ws.resume();
  };

  MSEPlayer.prototype.doMediaInfo = function doMediaInfo(metadata) {
    _logger.logger.log('%cmediaInfo:', 'background: orange;', metadata);
    this.mediaInfo = metadata;
    if (this.onMediaInfo) {
      try {
        this.onMediaInfo(metadata);
      } catch (e) {
        _logger.logger.error(mseUtils.errorMsg(e));
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
    var _this13 = this;

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
          _this13._pause = false;
          _this13.playing = true;
        });
      }
    }
  };

  MSEPlayer.prototype.onStartStalling = function onStartStalling() {
    var _this14 = this;

    if (this._pause) return;
    if (!this.resetTimer) {
      this.resetTimer = setTimeout(function () {
        _this14.restart();
      }, 60000);
    }

    if (this._stalling) return;
    if (this.opts.onStartStalling) {
      this.opts.onStartStalling();
    }
    this._stalling = true;
    _logger.logger.log('onStartStalling');

    if (this.playerStatsObject.started_at) {
      this.addPlayerStat('stall_count');
      this.startStallingTime = Date.now();
    }
    this.onEvent({
      key: Date.now(),
      data: {
        event: 'play_stalled'
      }
    });
  };

  MSEPlayer.prototype.onEndStalling = function onEndStalling() {
    if (!this._stalling) return;
    if (this.opts.onEndStalling) {
      this.opts.onEndStalling();
    }
    this._stalling = false;
    _logger.logger.log('onEndStalling');

    clearTimeout(this.resetTimer);
    this.resetTimer = void 0;

    if (this.startStallingTime) {
      var application = this.playerStatsObject.application;

      if (application) {
        var stall_duration = application.stall_duration;

        stall_duration += Date.now() - this.startStallingTime;
        this.startStallingTime = null;
        this.addPlayerStat('stall_duration', false, stall_duration);
      }
    }

    this.onEvent({
      key: Date.now(),
      data: {
        event: 'play_resumed'
      }
    });
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
      _logger.logger.error(mseUtils.errorMsg(e));
    }
  };

  MSEPlayer.prototype.onMediaSourceEnded = function onMediaSourceEnded() {
    _logger.logger.log('media source ended');
    try {
      if (this.opts.onEOS) {
        this.opts.onEOS();
      }
    } catch (err) {
      _logger.logger.error('error while proccessing onEOS');
    }
  };

  MSEPlayer.prototype.onMediaSourceClose = function onMediaSourceClose() {
    _logger.logger.log('media source closed');
  };

  MSEPlayer.prototype.onConnectionRetry = function onConnectionRetry() {
    var _this15 = this;

    if (!this.retryConnectionTimer && !this._stop) {
      if (this.retry < this.opts.connectionRetries) {
        this.retryConnectionTimer = setInterval(function () {
          return _this15.retryConnection();
        }, 5000);
      }
    } else if (this.retry >= this.opts.connectionRetries) {
      clearInterval(this.retryConnectionTimer);
    }
  };

  MSEPlayer.prototype.loadingIndication = function loadingIndication(event) {
    var type = event.type;

    if (type === 'playing') {
      this.playing = true;
      this.onEndStalling();

      if (!this.playerStatsObject.started_at) {
        this.playerStatsObject.started_at = Date.now();
        this.addStat({ started_at: this.playerStatsObject.started_at });
      }
    } else if (type === 'waiting') {
      this.playing = false;
      this.onStartStalling();
    }
  };

  MSEPlayer.prototype.onEvent = function onEvent(event) {
    if (this.onEventCallback) {
      this.onEventCallback(event);
    }
  };

  MSEPlayer.prototype.onPlayerError = function onPlayerError(errorData) {
    if (this.playerStatsObject) {
      this.addPlayerStat('error_count');
    }

    this.onError && this.onError(errorData);
  };

  MSEPlayer.prototype.addListeners = function addListeners() {
    if (this.media) {
      // checkVideoProgress
      this.oncvp = mseUtils.checkVideoProgress(this.media, this).bind(this);
      this.media.addEventListener(_events2.default.MEDIA_ELEMENT_PROGRESS, this.oncvp);

      // this.media.addEventListener(EVENTS.MEDIA_ELEMENT_STALLED, this.loadingIndication.bind(this));
      // this.media.addEventListener(EVENTS.MEDIA_ELEMENT_SUSPEND, this.loadingIndication.bind(this));
      // this.media.addEventListener(EVENTS.MEDIA_ELEMENT_RATECHANGE, this.loadingIndication.bind(this));
      this.media.addEventListener(_events2.default.MEDIA_ELEMENT_PLAYING, this.loadingIndication.bind(this));
      this.media.addEventListener(_events2.default.MEDIA_ELEMENT_WAITING, this.loadingIndication.bind(this));
      // this.media.addEventListener(EVENTS.MEDIA_ELEMENT_PAUSE, this.pause.bind(this));
    }
  };

  MSEPlayer.prototype.removeListeners = function removeListeners() {
    if (this.media) {
      this.media.removeEventListener(_events2.default.MEDIA_ELEMENT_PROGRESS, this.oncvp);

      // this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_STALLED, this.loadingIndication.bind(this));
      // this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_SUSPEND, this.loadingIndication.bind(this));
      // this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_RATECHANGE, this.loadingIndication.bind(this));
      this.media.removeEventListener(_events2.default.MEDIA_ELEMENT_PLAYING, this.loadingIndication);
      this.media.removeEventListener(_events2.default.MEDIA_ELEMENT_WAITING, this.loadingIndication);
      // this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_PAUSE, this.pause)
    }
  };

  MSEPlayer.prototype.generateUUID = function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 = typeof performance !== 'undefined' && performance.now && performance.now() * 1000 || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
  };

  MSEPlayer.prototype.addPlayerStat = function addPlayerStat(name) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var application = this.playerStatsObject.application;

    if (application) {
      if (data) {
        application[name] = Math.round(data);
      } else if (count) {
        application[name]++;
      }
      this.playerStatsObject.application = application;
      this.addStat({ application: application });
    }
  };

  MSEPlayer.prototype.addStat = function addStat(data) {
    this.statsWorker && this.statsWorker.postMessage({
      command: 'add',
      commandObj: data
    });
  };

  MSEPlayer.prototype.getStats = function getStats() {
    return _extends({}, this.playerStatsObject, {
      id: this.uuid
    });
  };

  MSEPlayer.prototype.onStatsWorkerMessage = function onStatsWorkerMessage() {
    if (this.opts.statsSendEnable) {
      fetch(this.url + 'sessions/' + this.playerStatsObject.source_id, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(this.getStats())
      });
    }
  };

  return MSEPlayer;
}();

exports.default = MSEPlayer;
module.exports = exports['default'];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWSURL = getWSURL;

var _parseurl = __webpack_require__(9);

var _parseurl2 = _interopRequireDefault(_parseurl);

var _wsWorker = __webpack_require__(18);

var _wsWorker2 = _interopRequireDefault(_wsWorker);

var _logger = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// import EVENTS from '../enums/events'

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
    // if (this.websocket) {
    //   delete this.websocket
    // }
    if (this.wsWorker) {
      delete this.wsWorker;
    }
    this.opened = false;
    this.connectionPromise = void 0;
    clearTimeout(this.reconnect);
    this.reconnect = void 0;

    if (window.Worker) {
      this.wsWorker = new _wsWorker2.default();
      this.wsWorker.onmessage = this.onWorkerMessage.bind(this);
    }
  };

  WebSocketController.prototype.onWorkerMessage = function onWorkerMessage(message) {
    var data = message.data;
    var command = data.command;

    switch (command) {
      case 'connect':
        this.open();
        break;
      case 'close':
        this.onWSClose(data);
        break;
      case 'error':
        this.handleError(data);
        break;
      default:
        this.handleReceiveMessage(data);
    }
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
    this.connectionPromise = new Promise(function (res, rej) {
      _this.socketURL = { url: url, time: time, videoTrack: videoTrack, audioTack: audioTack };
      var wsURL = getWSURL(url, time, videoTrack, audioTack);
      _this.wsWorker.postMessage({
        command: 'start',
        commandObj: wsURL
      });

      _this._openingResolve = res;
      // TODO: to think cases when ws can fall
      _this._openingReject = rej;
    });

    return this.connectionPromise;
  };

  WebSocketController.prototype.open = function open() {
    if (this.opened) return;

    this.opened = true;
    this.paused = true;
    this._openingResolve(); // #6809
  };

  WebSocketController.prototype.send = function send(cmd) {
    this.wsWorker.postMessage({
      command: 'send',
      commandObj: cmd
    });
  };

  WebSocketController.prototype.resume = function resume() {
    clearTimeout(this.reconnect);
    _logger.logger.log('ws: send resume');
    // if (this.websocket.readyState === 0) {
    //   return setTimeout(() => this.resume(), 500)
    // } else {
    this.send('resume');
    this.paused = false;
    // }
  };

  WebSocketController.prototype.pause = function pause() {
    _logger.logger.log('ws: send pause');
    /**
     * 0 (CONNECTING) The connection is not yet open.
     * 1 (OPEN) The connection is open and ready to communicate.
     * 2 (CLOSING) The connection is in the process of closing.
     * 3 (CLOSED) The connection is closed or couldn't be opened.
     */
    // if (this.websocket.readyState === 1) {
    this.send('pause');
    this.paused = true;
    // }
  };

  WebSocketController.prototype.seek = function seek(utc) {
    var commandStr = utc === LIVE ? WS_COMMAND_SEEK_LIVE : WS_COMMAND_SEEK;
    _logger.logger.log('' + commandStr + utc);
    this.send('' + commandStr + utc);
  };

  WebSocketController.prototype.setTracks = function setTracks(videoTrack) {
    var audioTrack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    this.send('set_tracks=' + videoTrack + audioTrack);
  };

  WebSocketController.prototype.sendStats = function sendStats(data) {
    // console.log(data);
    var encoded = JSON.stringify(data);
    this.send(encoded);
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
    var _this2 = this;

    _logger.logger.log('WebSocket lost connection with code ', event.code + ' and reason: ' + event.reason); // например, "убит" процесс сервера
    if (this.opts.error) {
      this.opts.error({
        error: 'WebSocket lost connection',
        err: 'WebSocket lost connection with code ' + event.code + ' and reason: ' + event.reason,
        code: event.code
      });
    }
    if (this.opts.wsReconnect) {
      if (event.wasClean && event.code !== 1000 && event.code !== 1006) {
        _logger.logger.log('Clean websocket stop');
        this.destroy();
      } else {
        var _socketURL = this.socketURL,
            url = _socketURL.url,
            videoTrack = _socketURL.videoTrack,
            audioTack = _socketURL.audioTack;

        this.reconnect = setTimeout(function () {
          _this2.start(url, /*time, */videoTrack, audioTack).then(function () {
            clearTimeout(_this2.reconnect);
            return;
          }).catch(function () {
            _this2.destroy();
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
    // if (this.websocket) {
    //   // this.pause()
    //   this.websocket.removeEventListener(EVENTS.WS_MESSAGE, this.onwsm)
    //   this.websocket.removeEventListener(EVENTS.WS_CLOSE, this.onwsc)
    //   this.websocket.close()
    //   this.websocket.onclose = void 0 // disable onclose handler first
    //   this.websocket = void 0
    this.wsWorker.postMessage({
      command: 'disconnect'
    });
    clearTimeout(this.reconnect);
    this.reconnect = void 0;
    this.init();
    // }
  };

  return WebSocketController;
}();

// TODO


exports.default = WebSocketController;
function getWSURL(url, utc, videoTrack, audioTrack) {
  // TODO: then use @param time it prevent to wrong data from ws(trackID view[47] for example is 100)
  // const time = utc
  utc = LIVE;
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
  if (!utc) {
    fromQuery = '';
  }
  var resultUrl = '' + cleanUrl + (tracksExists ? 'tracks=' + videoTrack + audioTrack : '') + ('' + ampFrom + fromQuery) + ('' + ((tracksExists || !!time && time !== LIVE) && !!othersParams ? '&' : '') + othersParams);
  return resultUrl;
}

/***/ }),
/* 9 */
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

var url = __webpack_require__(10)
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

  if (search !== null) {
    url.query = query
    url.search = search
  }

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
/* 10 */
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



var punycode = __webpack_require__(11);
var util = __webpack_require__(14);

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
    querystring = __webpack_require__(15);

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
/* 11 */
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(12)(module), __webpack_require__(13)))

/***/ }),
/* 12 */
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
/* 13 */
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(16);
exports.encode = exports.stringify = __webpack_require__(17);


/***/ }),
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Worker_fn;

var _inline = __webpack_require__(1);

var _inline2 = _interopRequireDefault(_inline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Worker_fn() {
  return (0, _inline2.default)("/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, { enumerable: true, get: getter });\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// define __esModule on exports\n/******/ \t__webpack_require__.r = function(exports) {\n/******/ \t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n/******/ \t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t}\n/******/ \t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t};\n/******/\n/******/ \t// create a fake namespace object\n/******/ \t// mode & 1: value is a module id, require it\n/******/ \t// mode & 2: merge all properties of value into the ns\n/******/ \t// mode & 4: return value when already ns object\n/******/ \t// mode & 8|1: behave like require\n/******/ \t__webpack_require__.t = function(value, mode) {\n/******/ \t\tif(mode & 1) value = __webpack_require__(value);\n/******/ \t\tif(mode & 8) return value;\n/******/ \t\tif((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;\n/******/ \t\tvar ns = Object.create(null);\n/******/ \t\t__webpack_require__.r(ns);\n/******/ \t\tObject.defineProperty(ns, 'default', { enumerable: true, value: value });\n/******/ \t\tif(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));\n/******/ \t\treturn ns;\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = 0);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ (function(module, exports) {\n\n(function () {\n  //Define WebSocket and protocol variables\n  let websocket = null;\n  let mustStop = false;\n\n  //Define based object response to WebSocketController\n  // let onMessage_response = {\n  //   command: 'incomingMsg',\n  //   msg: null,\n  // }\n\n  //Receive message from WebSocketController\n  self.addEventListener(\n    'message',\n    function (e) {\n      let data = e.data;\n      //Get command parameter to identify operation\n      let command = data.command;\n\n      if (command === 'start') {\n        start(data.commandObj); //Establish WebSocket connection\n        // } else if (command === 'logout') {\n        //   sendOMMmessage(data.commandObj)\n        //   disconnect() //Terminate WebSocket connection\n      } else if (command === 'disconnect') {\n        disconnect();\n      } else if (command === 'send') {\n        sendOMMmessage(data.commandObj);\n      }\n    },\n    false\n  );\n\n  /* -----------------  Application events functions  ----------------- */\n\n  //Establish WebSocket connection\n  function start(wsURL) {\n    websocket = new WebSocket(wsURL);\n    websocket.binaryType = 'arraybuffer';\n    websocket.onopen = onOpen;\n    websocket.onmessage = onMessage;\n    websocket.onerror = onError;\n    websocket.onclose = onClose;\n  }\n\n  function disconnect() {\n    if (websocket) {\n      websocket.close();\n    }\n    mustStop = true;\n    const disconnect_response = {\n      command: 'disconnect',\n      msg: 'Disconnected',\n    };\n    self.postMessage(disconnect_response);\n  }\n\n  //Send message to ADS WebSocket\n  function sendOMMmessage(commandObj) {\n    websocket.send(commandObj);\n  }\n\n  /* -----------------  WS events  ----------------- */\n\n  //Establish WebSocket connection success\n  function onOpen() {\n    const onOpen_response = {\n      command: 'connect',\n      msg: 'Connected',\n    };\n    self.postMessage(onOpen_response);\n  }\n\n  //Receives incoming message from WebSocket\n  function onMessage(event) {\n    const rawData = event.data;\n    const isDataAB = rawData instanceof ArrayBuffer;\n    const parsedData = !isDataAB ? JSON.parse(rawData) : void 0;\n    self.postMessage({ rawData, parsedData, isDataAB });\n  }\n\n  function onError(event) {\n    const onError_response = {\n      command: 'error',\n      msg: JSON.stringify(event),\n    };\n    self.postMessage(onError_response);\n  }\n\n  function onClose(e) {\n    if (mustStop) {\n      return;\n    }\n    const { code, reason } = e;\n    const onClose_response = {\n      command: 'close',\n      data: { code, reason },\n    };\n    self.postMessage(onClose_response);\n  }\n})();\n\n\n/***/ })\n/******/ ]);", "Worker", undefined, __webpack_require__.p + "ws.worker.js");
}
module.exports = exports["default"];

/***/ }),
/* 19 */
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mseUtils = __webpack_require__(2);

var _logger = __webpack_require__(0);

var _common = __webpack_require__(3);

var _events = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BUFFER_MODE_SEQUENCE = 'segments'; // segments
// const BUFFER_MODE_SEQUENCE = 'sequence'; // segments

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
    // this.audioBufferSize = 0;
    // this.videoBufferSize = 0;
    this.totalBytesCollected = 0;
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
      if (s.mime_type) {
        mimeType = s.mime_type;
      }

      sb[s.content] = _this.mediaSource.addSourceBuffer(mimeType);
      sb[s.content].mode = BUFFER_MODE_SEQUENCE;
      // sb[s.content].timestampOffset = 0.25;
      var buffer = sb[s.content];
      if (isVideo) {
        buffer.addEventListener(_events.BUFFER_UPDATE_END, _this.onSBUpdateEnd);
      } else {
        buffer.addEventListener(_events.BUFFER_UPDATE_END, _this.onAudioSBUpdateEnd);
      }
    });
  };

  BuffersController.prototype.onSBUpdateEnd = function onSBUpdateEnd() {
    // if (this._needsFlush) {
    //   logger.log('flushing buffer');
    //   this.doFlush();
    // }

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
        this.videoBufferSize = this.videoBufferSize - segment.data.byteLength;
        this.appended++;
      }
    }
  };

  BuffersController.prototype.onAudioSBUpdateEnd = function onAudioSBUpdateEnd() {
    // if (this._needsFlush) {
    //   logger.log('flushing buffer');
    //   this.doFlush();
    // }

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
        // this.audioBufferSize = this.audioBufferSize - segment.data.byteLength;
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
      this.media.error && _logger.logger.error('Error code:', this.media.error);
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
    data[type].forEach(function (s, index) {
      _this3[s.content === _common.VIDEO ? 'videoTrackId' : 'audioTrackId'] = { index: index, id: s.id };
    });
  };

  BuffersController.prototype.getTypeBytrackId = function getTypeBytrackId(id) {
    if (!this.audioTrackId) {
      return _common.VIDEO;
    }
    return this.audioTrackId.id === id ? _common.AUDIO : _common.VIDEO;
  };

  BuffersController.prototype.procArrayBuffer = function procArrayBuffer(rawData) {
    var segment = this.rawDataToSegmnet(rawData);
    if (segment.type === 'audio') {
      this.segmentsAudio.push(segment);
      // this.audioBufferSize = this.audioBufferSize + segment.data.byteLength;
    } else {
      this.segmentsVideo.push(segment);
      // this.videoBufferSize = this.videoBufferSize + segment.data.byteLength;
    }
    this.totalBytesCollected = this.totalBytesCollected + segment.data.byteLength;

    this.doArrayBuffer(segment);
    if (this.sourceBuffer) {
      if (this.sourceBuffer.video && !this.sourceBuffer.video.updating) {
        this.onSBUpdateEnd();
      }
      if (this.audioTrackId) {
        if (this.sourceBuffer.audio && !this.sourceBuffer.audio.updating) {
          this.onAudioSBUpdateEnd();
        }
      }
    }
  };

  BuffersController.prototype.seek = function seek() {
    for (var k in this.sourceBuffer) {
      this.sourceBuffer[k].abort();
      this.sourceBuffer[k].mode = BUFFER_MODE_SEQUENCE;
      // this.sourceBuffer[k].timestampOffset = this.sourceBuffer[k].timestampOffset - 0.2;
    }

    // this.videoBufferSize = 0
    // this.audioBufferSize = 0
    // this.segmentsVideo = []
    // this.segmentsAudio = []
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
        _logger.logger.error('error while accessing sourceBuffer.buffered');
      }
      this.appended = appended;
      this._setTracksFlag = false;
    }
  };

  // /*
  //   flush specified buffered range,
  //   return true once range has been flushed.
  //   as sourceBuffer.remove() is asynchronous, flushBuffer will be retriggered on sourceBuffer update end
  // */


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

  BuffersController.prototype.addSourceBuffer = function addSourceBuffer() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'audio';

    var sb = this.sourceBuffer;
    var mimeType = type === 'video' ? 'video/mp4; codecs="avc1.4d401f"' : 'audio/mp4; codecs="mp4a.40.2"';
    sb[type] = this.mediaSource.addSourceBuffer(mimeType);
    sb[type].mode = BUFFER_MODE_SEQUENCE;
    // sb[type].timestampOffset = 0.25;
    var buffer = sb[type];
    if (type === 'video') {
      buffer.addEventListener(_events.BUFFER_UPDATE_END, this.onSBUpdateEnd);
    } else {
      buffer.addEventListener(_events.BUFFER_UPDATE_END, this.onAudioSBUpdateEnd);
    }
  };

  BuffersController.prototype.removeSourceBuffer = function removeSourceBuffer() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'audio';

    var buffer = this.sourceBuffer[type];
    if (type === 'audio') {
      buffer.removeEventListener(_events.BUFFER_UPDATE_END, this.onAudioSBUpdateEnd);
    } else {
      buffer.removeEventListener(_events.BUFFER_UPDATE_END, this.onSBUpdateEnd);
    }
    this.mediaSource.removeSourceBuffer(buffer);
    delete this.sourceBuffer[type];
  };

  BuffersController.prototype.destroy = function destroy() {
    this.init();
  };

  return BuffersController;
}();

exports.default = BuffersController;
module.exports = exports['default'];

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Worker_fn;

var _inline = __webpack_require__(1);

var _inline2 = _interopRequireDefault(_inline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Worker_fn() {
  return (0, _inline2.default)("/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, { enumerable: true, get: getter });\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// define __esModule on exports\n/******/ \t__webpack_require__.r = function(exports) {\n/******/ \t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n/******/ \t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t}\n/******/ \t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t};\n/******/\n/******/ \t// create a fake namespace object\n/******/ \t// mode & 1: value is a module id, require it\n/******/ \t// mode & 2: merge all properties of value into the ns\n/******/ \t// mode & 4: return value when already ns object\n/******/ \t// mode & 8|1: behave like require\n/******/ \t__webpack_require__.t = function(value, mode) {\n/******/ \t\tif(mode & 1) value = __webpack_require__(value);\n/******/ \t\tif(mode & 8) return value;\n/******/ \t\tif((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;\n/******/ \t\tvar ns = Object.create(null);\n/******/ \t\t__webpack_require__.r(ns);\n/******/ \t\tObject.defineProperty(ns, 'default', { enumerable: true, value: value });\n/******/ \t\tif(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));\n/******/ \t\treturn ns;\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = 0);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ (function(module, exports) {\n\n(function () {\n  let statsURL = null;\n  let sendTime = 60000;\n  let jsonTable = {};\n  let sendingInterval = null;\n\n  self.addEventListener(\n    'message',\n    function (e) {\n      let data = e.data;\n      //Get command parameter to identify operation\n      const { command, commandObj } = data;\n      switch (command) {\n        case 'start':\n          statsURL = commandObj\n            .replace(/ws:/, 'http:')\n            .replace(/wss:/, 'https:')\n            .replace(/mse_ld/, 'sessions');\n          start();\n          break;\n        case 'time':\n          correctSendTime(commandObj);\n          break;\n        case 'stop':\n          stop();\n          break;\n        case 'add':\n          addToTable(commandObj);\n          break;\n        default:\n          break;\n      }\n    },\n    false\n  );\n\n  function correctSendTime(time) {\n    sendTime = time;\n  }\n\n  function start() {\n    sendingInterval = this.setInterval(() => {\n      post();\n    }, sendTime);\n  }\n\n  function stop() {\n    post();\n    clearInterval(sendingInterval);\n  }\n\n  function addToTable(data) {\n    jsonTable = { ...jsonTable, ...data };\n\n    if (data.event && data.event === 'play_stop') {\n      stop();\n    }\n  }\n\n  // function roughSizeOfObject(object) {\n  //   let objectList = [];\n  //   let stack = [object];\n  //   let bytes = 0;\n\n  //   while (stack.length) {\n  //     let value = stack.pop();\n\n  //     if (typeof value === 'boolean') {\n  //       bytes += 4;\n  //     } else if (typeof value === 'string') {\n  //       bytes += value.length * 2;\n  //     } else if (typeof value === 'number') {\n  //       bytes += 8;\n  //     } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {\n  //       objectList.push(value);\n\n  //       for (let i in value) {\n  //         stack.push(value[i]);\n  //       }\n  //     }\n  //   }\n  //   return bytes;\n  // }\n\n  function post() {\n    const { source_id } = jsonTable;\n    fetch(statsURL + `${source_id ? `/${source_id}` : ''}`, {\n      headers: {\n        Accept: 'application/json',\n        'Content-Type': 'application/json',\n      },\n      method: 'PUT',\n      body: JSON.stringify(jsonTable),\n    });\n  }\n})();\n\n\n/***/ })\n/******/ ]);", "Worker", undefined, __webpack_require__.p + "stats.worker.js");
}
module.exports = exports["default"];

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var EVENT_SEGMENT = exports.EVENT_SEGMENT = 'event';
var MSE_INIT_SEGMENT = exports.MSE_INIT_SEGMENT = 'mse_init_segment';
var MSE_MEDIA_SEGMENT = exports.MSE_MEDIA_SEGMENT = 'mse_media_segment';

/***/ }),
/* 23 */
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