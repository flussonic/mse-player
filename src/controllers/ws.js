import parseUrl from 'parseurl';
// import EVENTS from '../enums/events'

import Worker from '../workers/ws.worker.js';

const WS_COMMAND_SEEK_LIVE = '';
const WS_COMMAND_SEEK = 'play_from=';
const LIVE = 'live';

import { logger } from '../utils/logger';

export default class WebSocketController {
  constructor(opts) {
    this.opts = opts;
    this.init();
    this.onwso = this.open.bind(this);
    this.onwsm = this.handleReceiveMessage.bind(this);
    this.onwse = this.handleError.bind(this);
    this.onwsc = this.onWSClose.bind(this);
  }

  init() {
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
      this.wsWorker = new Worker();
      this.wsWorker.onmessage = this.onWorkerMessage.bind(this);
    }
  }

  onWorkerMessage(message) {
    const { data } = message;
    const { command } = data;
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
  }

  start(url, time, videoTrack = '', audioTack = '') {
    /**
     * if call ws.send command immediately after start
     * it causes to error message like "ws still in connection status"
     * #6809
     */
    this.connectionPromise = new Promise((res, rej) => {
      this.socketURL = { url, time, videoTrack, audioTack };
      const wsURL = getWSURL(url, time, videoTrack, audioTack);
      this.wsWorker.postMessage({
        command: 'start',
        commandObj: wsURL,
      });

      this._openingResolve = res;
      // TODO: to think cases when ws can fall
      this._openingReject = rej;
    });

    return this.connectionPromise;
  }

  open() {
    this.opened = true;
    this.paused = true;
    this._openingResolve(); // #6809
  }

  send(cmd) {
    this.wsWorker.postMessage({
      command: 'send',
      commandObj: cmd,
    });
  }

  resume() {
    clearTimeout(this.reconnect);
    logger.log('ws: send resume');
    // if (this.websocket.readyState === 0) {
    //   return setTimeout(() => this.resume(), 500)
    // } else {
    this.send('resume');
    this.paused = false;
    // }
  }

  pause() {
    logger.log('ws: send pause');
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
  }

  seek(utc) {
    const commandStr = utc === LIVE ? WS_COMMAND_SEEK_LIVE : WS_COMMAND_SEEK;
    logger.log(`${commandStr}${utc}`);
    this.send(`${commandStr}${utc}`);
  }

  setTracks(videoTrack, audioTrack = null) {
    this.send(`set_tracks=${videoTrack}${audioTrack}`);
  }

  handleReceiveMessage(e) {
    this.opts.message(e);
  }

  handleError(...args) {
    if (this.opts.error) {
      this.opts.error(...args);
    }
  }

  onWSClose(event) {
    logger.log('WebSocket lost connection with code ', event.code + ' and reason: ' + event.reason); // например, "убит" процесс сервера
    if (this.opts.error) {
      this.opts.error({
        error: 'WebSocket lost connection',
        err: `WebSocket lost connection with code ${event.code} and reason: ${event.reason}`,
        code: event.code,
      });
    }
    if (this.opts.wsReconnect) {
      if (event.wasClean && event.code !== 1000 && event.code !== 1006) {
        logger.log('Clean websocket stop');
        this.destroy();
      } else {
        const { url, /* time, */ videoTrack, audioTack } = this.socketURL;
        this.reconnect = setTimeout(() => {
          this.start(url, /*time, */ videoTrack, audioTack)
            .then(() => {
              clearTimeout(this.reconnect);
              return;
            })
            .catch(() => {
              this.destroy();
              return;
            });
        }, 5000);
      }
    }
    if (this.opts.closed) {
      this.opts.closed(event);
    }
  }

  destroy() {
    // if (this.websocket) {
    //   // this.pause()
    //   this.websocket.removeEventListener(EVENTS.WS_MESSAGE, this.onwsm)
    //   this.websocket.removeEventListener(EVENTS.WS_CLOSE, this.onwsc)
    //   this.websocket.close()
    //   this.websocket.onclose = void 0 // disable onclose handler first
    //   this.websocket = void 0
    this.wsWorker.postMessage({
      command: 'disconnect',
    });
    clearTimeout(this.reconnect);
    this.reconnect = void 0;
    this.init();
    // }
  }
}

// TODO
export function getWSURL(url, utc, videoTrack, audioTrack) {
  // TODO: then use @param time it prevent to wrong data from ws(trackID view[47] for example is 100)
  // const time = utc
  utc = LIVE;
  const time = utc;

  if (!time && !videoTrack && !audioTrack) {
    return url;
  }

  const parsedUrl = parseUrl({ url });
  let othersParams = '';

  if (parsedUrl.query) {
    const currentParamsKeysValues = parsedUrl.query.split('&').map((keyValue) => keyValue.split('='));

    othersParams = currentParamsKeysValues
      .filter((p) => p[0] !== 'from' && p[0] !== 'tracks')
      .map((kv) => kv.join('='))
      .join('&');

    logger.log(othersParams);
  }

  const cleanUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}?`;
  const tracksExists = !!videoTrack || !!audioTrack;
  const ampFrom = tracksExists && !!time && time !== LIVE ? '&' : '';
  let fromQuery = utc === LIVE ? '' : `from=${Math.floor(time)}`;
  if (!utc) {
    fromQuery = '';
  }
  const resultUrl =
    `${cleanUrl}${tracksExists ? `tracks=${videoTrack}${audioTrack}` : ''}` +
    `${ampFrom}${fromQuery}` +
    `${(tracksExists || (!!time && time !== LIVE)) && !!othersParams ? '&' : ''}${othersParams}`;
  return resultUrl;
}
