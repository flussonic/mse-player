const EVENTS = {
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
  BUFFER_ABORT: 'onabort',
}

export default EVENTS
