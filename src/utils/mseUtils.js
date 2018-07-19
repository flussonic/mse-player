import parseUrl from 'parseurl'

import EVENTS from '../enums/events'
import {logger} from '../utils/logger'

export function getMediaSource() {
  if (typeof window !== 'undefined') {
    return window.MediaSource || window.WebKitMediaSource
  }
}

export function isAndroid() {
  const ua = navigator.userAgent
  return ua.indexOf('Android') !== -1
}

export function isSupportedMSE() {
  // https://bugs.chromium.org/p/chromium/issues/detail?id=539707
  if (isAndroid()) {
    return false
  }
  const mediaSource = getMediaSource()
  const sourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer
  const isTypeSupported =
    mediaSource &&
    typeof mediaSource.isTypeSupported === 'function' &&
    mediaSource.isTypeSupported('video/mp4; codecs="avc1.4d401f,mp4a.40.2"')

  // if SourceBuffer is exposed ensure its API is valid
  // safari and old version of Chrome doe not expose SourceBuffer globally so checking SourceBuffer.prototype is impossible
  const sourceBufferValidAPI =
    !sourceBuffer ||
    (sourceBuffer.prototype &&
      typeof sourceBuffer.prototype.appendBuffer === 'function' &&
      typeof sourceBuffer.prototype.remove === 'function')
  return !!isTypeSupported && !!sourceBufferValidAPI
}

export function base64ToArrayBuffer(base64) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0))
}

export function RawDataToUint8Array(rawData) {
  // 12,4 = mfhd;20,4 slice - segment.id;36,4 = tfhd;44,4 slice - track.id;64,4 = tfdt
  // 72,8 slice - prestime;84,4 = futc;92,8 slice - real utc;104,4 = trun
  const result = new Uint8Array(rawData)
  return result
}
export function getTrackId(data) {
  return data[47]
}

export function getRealUtcFromData(view) {
  const pts1 = (view[92] << 24) | (view[93] << 16) | (view[94] << 8) | view[95]
  const pts2 = (view[96] << 24) | (view[97] << 16) | (view[98] << 8) | view[99]
  const realUtc = pts1 + pts2 / 1000000
  return realUtc
}

export function doArrayBuffer() {
  const segment = this.segments.shift()

  if (!segment.isInit) {
    this.utc = getRealUtcFromData(segment.data)
  }

  this.maybeAppend(segment)
}

export function debugData(rawData) {
  const view = RawDataToUint8Array(rawData)
  const trackId = getTrackId(view)
  const utc = getRealUtcFromData(view)

  return {trackId, utc, view}
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

  const resultUrl =
    `${cleanUrl}${tracksExists ? `tracks=${videoTrack}${audioTrack}` : ''}` +
    `${tracksExists && !!time ? '&' : ''}${!!time ? `from=${Math.floor(time)}` : ''}` +
    `${(tracksExists || !!time) && !!othersParams ? '&' : ''}${othersParams}`
  return resultUrl
}

const ua = navigator.userAgent
export const MAX_DELAY = /Edge/.test(ua) || /trident.*rv:1\d/i.test(ua)
  ? 10 // very slow buffers in Edge
  : 2

export const checkVideoProgress = (media, maxDelay = MAX_DELAY) => evt => {
  const {currentTime: ct, buffered, buffered: {length: l}} = media

  if (!l) {
    return
  }

  const endTime = buffered.end(l - 1)
  const delay = Math.abs(endTime - ct)

  if (delay <= maxDelay) {
    return
  }

  logger.log('nudge', ct, '->', l ? endTime : '-', ct - endTime)//evt, )
  media.currentTime = endTime - 0.2// (Math.abs(ct - endTime)) //
}

export function startWebSocket(url, time, videoTrack = '', audioTack = '') {
  return function() {
    const wsURL = getWSURL(url, time, videoTrack, audioTack)

    this.websocket = new WebSocket(wsURL)
    this.websocket.binaryType = 'arraybuffer'
    // do that for remove event method
    this.onwso = this.onWebsocketOpen.bind(this)
    this.onwsdm = this.dispatchMessage.bind(this)
    this.websocket.addEventListener(EVENTS.WS_OPEN, this.onwso)
    this.websocket.addEventListener(EVENTS.WS_MESSAGE, this.onwsdm)
  }
}

export const replaceHttpByWS = url => url.replace(/^http/, 'ws')

export const errorMsg = e => `Error ${e.name}: ${e.message}\n${e.stack}`

export function pad2(n) {
  return n <= 9 ? '0' + n : '' + n
}

export function humanTime(utcOrLive, lt = true) {
  // $FlowFixMe: string > 0 is always false
  if (!(utcOrLive > 0)) {
    return ''
  }

  // $FlowFixMe: just for flow
  const utc = utcOrLive

  var d = new Date()
  d.setTime(utc * 1000)
  var localTime = !(lt === false)

  var h = localTime ? d.getHours() : d.getUTCHours()
  var m = localTime ? d.getMinutes() : d.getUTCMinutes()
  var s = localTime ? d.getSeconds() : d.getUTCSeconds()

  return pad2(h) + ':' + pad2(m) + ':' + pad2(s)
}
