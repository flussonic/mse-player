import parseUrl from 'parseurl'
import EVENTS from '../enums/events'

const WS_COMMAND_SEEK_LIVE = ''
const WS_COMMAND_SEEK = 'play_from='
const LIVE = 'live'

import {logger} from '../utils/logger'

export default class WebSocketController {
  constructor(opts) {
    this.opts = opts
    this.onwso = this.open.bind(this)
  }

  start(url, time, videoTrack = '', audioTack = '') {
    const wsURL = getWSURL(url, time, videoTrack, audioTack)

    this.websocket = new WebSocket(wsURL)
    this.websocket.binaryType = 'arraybuffer'
    // do that for remove event method
    this.websocket.addEventListener(EVENTS.WS_OPEN, this.onwso)
    this.websocket.addEventListener(EVENTS.WS_MESSAGE, this.opts.message)
  }

  open() {
    this.resume()
    this.websocket.removeEventListener(EVENTS.WS_OPEN, this.onwso)
  }

  send(cmd) {
    this.websocket.send(cmd)
  }

  resume() {
    this.websocket.send('resume')
  }

  pause() {
    this.websocket.send('pause')
  }

  seek(utc) {
    const commandStr = utc === LIVE
      ? WS_COMMAND_SEEK_LIVE
      : WS_COMMAND_SEEK
    logger.log(`${commandStr}${utc}`)
    this.websocket.send(`${commandStr}${utc}`)
  }

  setTracks(videoTrack, audioTrack) {
    this.websocket.send(`set_tracks=${videoTrack}${audioTrack}`)
  }

  destroy() {
    if (this.websocket) {
      this.websocket.removeEventListener(EVENTS.WS_MESSAGE, this.onwsdm)
      this.websocket.onclose = function() {} // disable onclose handler first
      this.websocket.close()
      this.onwsdm = null
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
