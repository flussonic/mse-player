/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

(function () {
  //Define WebSocket and protocol variables
  let websocket = null;
  let mustStop = false;

  //Define based object response to WebSocketController
  // let onMessage_response = {
  //   command: 'incomingMsg',
  //   msg: null,
  // }

  //Receive message from WebSocketController
  self.addEventListener(
    'message',
    function (e) {
      let data = e.data;
      //Get command parameter to identify operation
      let command = data.command;

      if (command === 'start') {
        start(data.commandObj); //Establish WebSocket connection
        // } else if (command === 'logout') {
        //   sendOMMmessage(data.commandObj)
        //   disconnect() //Terminate WebSocket connection
      } else if (command === 'disconnect') {
        disconnect();
      } else {
        sendOMMmessage(data.commandObj);
      }
    },
    false
  );

  /* -----------------  Application events functions  ----------------- */

  //Establish WebSocket connection
  function start(wsURL) {
    websocket = new WebSocket(wsURL);
    websocket.binaryType = 'arraybuffer';
    websocket.onopen = onOpen;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
    websocket.onclose = onClose;
  }

  function disconnect() {
    if (websocket) {
      websocket.close();
    }
    mustStop = true;
    const disconnect_response = {
      command: 'disconnect',
      msg: 'Disconnected',
    };
    self.postMessage(disconnect_response);
  }

  //Send message to ADS WebSocket
  function sendOMMmessage(commandObj) {
    websocket.send(commandObj);
  }

  /* -----------------  WS events  ----------------- */

  //Establish WebSocket connection success
  function onOpen() {
    const onOpen_response = {
      command: 'connect',
      msg: 'Connected',
    };
    self.postMessage(onOpen_response);
  }

  //Receives incoming message from WebSocket
  function onMessage(event) {
    const rawData = event.data;
    const isDataAB = rawData instanceof ArrayBuffer;
    const parsedData = !isDataAB ? JSON.parse(rawData) : void 0;
    self.postMessage({ rawData, parsedData, isDataAB });
  }

  function onError(event) {
    const onError_response = {
      command: 'error',
      msg: JSON.stringify(event),
    };
    self.postMessage(onError_response);
  }

  function onClose(e) {
    if (mustStop) {
      return;
    }
    const { code, reason } = e;
    const onClose_response = {
      command: 'close',
      data: { code, reason },
    };
    self.postMessage(onClose_response);
  }
})();


/***/ })
/******/ ]);