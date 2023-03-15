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
  let statsURL = null;
  let sendTime = 60000;
  let jsonTable = {};
  let sendingInterval = null;

  self.addEventListener(
    'message',
    function (e) {
      let data = e.data;
      //Get command parameter to identify operation
      const { command, commandObj } = data;
      switch (command) {
        case 'start':
          statsURL = commandObj
            .replace(/ws:/, 'http:')
            .replace(/wss:/, 'https:')
            .replace(/mse_ld/, 'sessions');
          start();
          break;
        case 'time':
          correctSendTime(commandObj);
          break;
        case 'stop':
          stop();
          break;
        case 'add':
          addToTable(commandObj);
          break;
        default:
          break;
      }
    },
    false
  );

  function correctSendTime(time) {
    sendTime = time;
  }

  function start() {
    sendingInterval = this.setInterval(() => {
      post();
    }, sendTime);
  }

  function stop() {
    post();
    clearInterval(sendingInterval);
  }

  function addToTable(data) {
    jsonTable = { ...jsonTable, ...data };

    if (data.event && data.event === 'play_stop') {
      stop();
    }
  }

  // function roughSizeOfObject(object) {
  //   let objectList = [];
  //   let stack = [object];
  //   let bytes = 0;

  //   while (stack.length) {
  //     let value = stack.pop();

  //     if (typeof value === 'boolean') {
  //       bytes += 4;
  //     } else if (typeof value === 'string') {
  //       bytes += value.length * 2;
  //     } else if (typeof value === 'number') {
  //       bytes += 8;
  //     } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
  //       objectList.push(value);

  //       for (let i in value) {
  //         stack.push(value[i]);
  //       }
  //     }
  //   }
  //   return bytes;
  // }

  function post() {
    if (!jsonTable.started_at) {
      return;
    }

    const { source_id } = jsonTable;
    const newUrl = statsURL.replace(/sessions/, `sessions/${source_id ? `${source_id}` : ''}`);
    fetch(newUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(jsonTable),
    });
  }
})();


/***/ })
/******/ ]);