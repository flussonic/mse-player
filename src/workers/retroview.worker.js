(function () {
  let retroviewURL = null;
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
          retroviewURL = commandObj;
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
    clearInterval(sendingInterval);
    post();
  }

  function addToTable(tData) {
    const { key, data } = tData;
    if (key in jsonTable) {
      jsonTable = { ...jsonTable, [key]: { ...jsonTable[key], ...data } };
    } else {
      jsonTable = { ...jsonTable, ...tData };
    }
    if (data.event && data.event === 'play_stop') {
      stop();
    }
  }

  function roughSizeOfObject(object) {
    let objectList = [];
    let stack = [object];
    let bytes = 0;

    while (stack.length) {
      let value = stack.pop();

      if (typeof value === 'boolean') {
        bytes += 4;
      } else if (typeof value === 'string') {
        bytes += value.length * 2;
      } else if (typeof value === 'number') {
        bytes += 8;
      } else if (
        typeof value === 'object' &&
        objectList.indexOf(value) === -1
      ) {
        objectList.push(value);

        for (let i in value) {
          stack.push(value[i]);
        }
      }
    }
    return bytes;
  }

  function post() {
    console.log('post', {
      jsonTable,
      sendTime,
      tableSize: roughSizeOfObject(jsonTable),
    });
  }
})();
