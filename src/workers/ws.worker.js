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
      } else if (command === 'send') {
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
