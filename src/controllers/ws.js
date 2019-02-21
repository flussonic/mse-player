import parseUrl from 'parseurl'
import EVENTS from '../enums/events'

const WS_COMMAND_SEEK_LIVE = ''
const WS_COMMAND_SEEK = 'play_from='
const LIVE = 'live'

import {logger} from '../utils/logger'

export default class WebSocketController {
  constructor(opts) {
    this.opts = opts
    this.init()
    this.onwso = this.open.bind(this)
    this.onwsm = this.handleReceiveMessage.bind(this)
    this.onwse = this.handleError.bind(this)
    this.onwsc = this.onWSClose.bind(this)
  }

  init() {
    this.opened = false
    this.connectionPromise = void 0
    clearTimeout(this.reconnect)
  }

  start(url, time, videoTrack = '', audioTack = '') {
    /**
     * if call ws.send command immediately after start
     * it causes to error message like "ws still in connection status"
     * #6809
     */
    this.socketURL = {url, time, videoTrack, audioTack}

    this.connectionPromise = new Promise((res, rej) => {
      const wsURL = getWSURL(url, time, videoTrack, audioTack)
      this.websocket = new WebSocket(wsURL)
      this.websocket.binaryType = 'arraybuffer'
      // do that for remove event method
      this.websocket.addEventListener(EVENTS.WS_OPEN, this.onwso)
      this.websocket.addEventListener(EVENTS.WS_MESSAGE, this.onwsm)
      this.websocket.addEventListener(EVENTS.WS_ERROR, this.onwse)
      this.websocket.addEventListener(EVENTS.WS_CLOSE, this.onwsc)

      this._openingResolve = res
      // TODO: to think cases when ws can fall
      this._openingReject = rej
    })
    return this.connectionPromise
  }

  open() {
    this.opened = true
    this._openingResolve() // #6809
    this.resume()
    this.websocket.removeEventListener(EVENTS.WS_OPEN, this.onwso)
  }

  send(cmd) {
    this.websocket.send(cmd)
  }

  resume() {
    clearTimeout(this.reconnect)
    logger.log('ws: send resume')
    this.websocket.send('resume')
  }

  pause() {
    logger.log('ws: send pause')
    /**
     * 0 (CONNECTING) The connection is not yet open.
     * 1 (OPEN) The connection is open and ready to communicate.
     * 2 (CLOSING) The connection is in the process of closing.
     * 3 (CLOSED) The connection is closed or couldn't be opened.
     */
    if (this.websocket.readyState === 1) {
      this.websocket.send('pause')
    }
  }

  seek(utc) {
    const commandStr = utc === LIVE ? WS_COMMAND_SEEK_LIVE : WS_COMMAND_SEEK
    logger.log(`${commandStr}${utc}`)
    this.websocket.send(`${commandStr}${utc}`)
  }

  setTracks(videoTrack, audioTrack) {
    this.websocket.send(`set_tracks=${videoTrack}${audioTrack}`)
  }

  handleReceiveMessage(e) {
    this.opts.message(e)
  }

  handleError(...args) {
    if (this.opts.error) {
      this.opts.error(...args)
    }
  }

  onWSClose(event) {
    if (event.wasClean) {
      // alert('Соединение закрыто чисто')
    } else {
      logger.log('WebSocket lost connection') // например, "убит" процесс сервера
      this.destroy()
      const {url, time, videoTrack, audioTack} = this.socketURL
      this.reconnect = setTimeout(() => {
        this.start(url, time, videoTrack, audioTack)
          .then(() => {
            clearTimeout(this.reconnect)
            return
          })
          .catch(() => {
            return
          })
      }, 5000)
    }
    this.opts.closed(event)
  }

  destroy() {
    clearTimeout(this.reconnect)
    if (this.websocket) {
      this.pause()
      this.websocket.removeEventListener(EVENTS.WS_MESSAGE, this.onwsm)
      this.websocket.onclose = function() {} // disable onclose handler first
      this.websocket.close()
      this.init()
    }
  }
}

// TODO
export function getWSURL(url, utc, videoTrack, audioTrack) {
  // TODO: then use @param time it prevent to wrong data from ws(trackID view[47] for example is 100)
  const time = utc

  if (!time && !videoTrack && !audioTrack) {
    return url
  }

  const parsedUrl = parseUrl({url})
  let othersParams = ''

  if (parsedUrl.query) {
    const currentParamsKeysValues = parsedUrl.query.split('&').map(keyValue => keyValue.split('='))

    othersParams = currentParamsKeysValues
      .filter(p => p[0] !== 'from' && p[0] !== 'tracks')
      .map(kv => kv.join('='))
      .join('&')

    logger.log(othersParams)
  }

  const cleanUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}?`
  const tracksExists = !!videoTrack || !!audioTrack

  const ampFrom = tracksExists && !!time && time !== LIVE ? '&' : ''
  const fromQuery = utc === LIVE ? '' : `from=${Math.floor(time)}`

  const resultUrl =
    `${cleanUrl}${tracksExists ? `tracks=${videoTrack}${audioTrack}` : ''}` +
    `${ampFrom}${fromQuery}` +
    `${(tracksExists || (!!time && time !== LIVE)) && !!othersParams ? '&' : ''}${othersParams}`
  return resultUrl
}
