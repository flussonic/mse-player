const EVENTS = {
  // MediaSource
  MEDIA_SOURCE_SOURCE_OPEN: 'sourceopen',
  MEDIA_SOURCE_SOURCE_ENDED: 'sourceended',
  MEDIA_SOURCE_SOURCE_CLOSE: 'sourceclose',

  // HTMLMediaElement
  MEDIA_ELEMENT_PROGRESS: 'progress',
  MEDIA_ELEMENT_EMPTIED: 'emptied',

  // WebSocket
  WS_OPEN: 'open',
  WS_MESSAGE :'message',

  // Buffer
  BUFFER_UPDATE_END: 'updateend',
  BUFFER_ERROR: 'onerror',
  BUFFER_ABORT: 'onabort',
}

export default EVENTS
