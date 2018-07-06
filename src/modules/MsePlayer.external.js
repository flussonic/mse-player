import * as segmentsTypes from '../enums/segments'
import EVENTS from '../enums/events'
import MSG from '../enums/messages'
import * as mseUtils from '../utils/mseUtils'
import 'core-js/fn/array/find'

const TYPE_CONTENT_VIDEO = 'video'
const TYPE_CONTENT_AUDIO = 'audio'

const BUFFER_MODE_SEGMENTS = 'segments'
const BUFFER_MODE_SEQUENCE = 'sequence'

const LIVE = 'live'
const WS_COMMAND_SEEK_LIVE = ''
const WS_COMMAND_SEEK = 'play_from='
const DEFAULT_BUFFER_MODE = BUFFER_MODE_SEQUENCE
const DEFAULT_ERRORS_BEFORE_STOP = 1
const DEFAULT_UPDATE = 100

let errorsCount = 0

export default class MSEPlayer {
  static replaceHttpByWS(url) {
    return mseUtils.replaceHttpByWS(url)
  }

  static isSupported() {
    return mseUtils.isSupportedMSE()
  }
  /**
   *
   * @param media HTMLMediaElement
   * @param urlStream
   *
   */
  constructor(media, urlStream, opts) {
    if (!(media instanceof HTMLMediaElement)) {
      throw new Error(MSG.NOT_HTML_MEDIA_ELEMENT)
    }

    this.media = media
    this.url = urlStream
    this.opts = opts || {}
    this.opts.progressUpdateTime = this.opts.progressUpdateTime || DEFAULT_UPDATE
    this.setBufferMode(this.opts)

    this.opts.errorsBeforeStop = this.opts.errorsBeforeStop ? this.opts.errorsBeforeStop : DEFAULT_ERRORS_BEFORE_STOP

    if (typeof this.opts.errorsBeforeStop !== 'number' || isNaN(this.opts.errorsBeforeStop)) {
      throw new Error('invalid errorsBeforeStop param, should be number')
    }

    this.onProgress = opts && opts.onProgress
    this.onMediaInfo = opts && opts.onMediaInfo
    this.onError = opts && opts.onError

    this.doArrayBuffer = mseUtils.doArrayBuffer.bind(this)
    this.maybeAppend = this.maybeAppend.bind(this)

    this.init()

    this.onAttachMedia({media})
  }

  play(time, videoTrack, audioTack) {
    if (this.opts.debug) {
      console.log('FlussonicMsePlayer: play()')
    }
    return this._play(time, videoTrack, audioTack)
  }

  stop() {
    return this.onMediaDetaching()
  }

  seek(utc) {
    try {
      if (!utc) {
        throw new Error('utc should be "live" or UTC value')
      }
      const commandStr = utc === LIVE
        ? WS_COMMAND_SEEK_LIVE
        : WS_COMMAND_SEEK
      console.log(`${commandStr}${utc}`)
      this.websocket.send(`${commandStr}${utc}`)
      this.afterSeekFlag = true
    } catch (err) {
      console.warn(`onMediaDetaching:${err.message} while calling endOfStream`)
    }
  }

  pause() {
    if (
      this._pause ||
      !this.media ||
      !this.websocket ||
      !this.mediaSource ||
      (this.mediaSource && this.mediaSource.readyState !== 'open') ||
      !this.playPromise
    ) {
      return
    }

    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    this.playPromise.then(pause.bind(this))
    function pause() {
      this.media.pause()
      this.websocket.send('pause')
      this._pause = true
      this.playing = false

      if (this.onPause) {
        try {
          this.onPause()
        } catch (e) {
          console.error('Error ' + e.name + ':' + e.message + '\n' + e.stack)
        }
      }
    }
  }

  setTracks(tracks) {
    if (!this.mediaInfo) {
      console.warn('Media info did not loaded. Should try after onMediaInfo triggered or inside.')
      return
    }

    if (!Array.isArray(tracks)) {
      console.error('tracks should be an Array instance: ["v1", "a1"]')
    }

    const videoTracksStr = tracks
      .filter(id => {
        const stream = this.mediaInfo.streams.find(s => id === s['track_id'])
        return !!stream && stream.content === TYPE_CONTENT_VIDEO
      })
      .join('')

    const audioTracksStr = tracks
      .filter(id => {
        const stream = this.mediaInfo.streams.find(s => id === s['track_id'])
        return !!stream && stream.content === TYPE_CONTENT_AUDIO
      })
      .join('')

    return this._setTracks(videoTracksStr, audioTracksStr)
  }

  /**
   *
   *  Private members
   *
   */
  _log(msg) {
    if (this.opts.debug) {
      console.log(msg)
    }
  }

  _play(time, videoTrack, audioTack) {
    return new Promise((resolve, reject) => {
      if (this.playing) {
        this._log('_play: terminate because already has been playing')
        return resolve()
      }

      if (this._pause && !this.afterSeekFlag) {
        this._resume()
        this._log('_play: terminate because _paused and should resume')
        return resolve()
      }

      // TODO: to observe this case, I have no idea when it fired
      if (!this.mediaSource) {
        this.onAttachMedia({media: this.media})
        this.onsoa = this._play.bind(this, time, videoTrack, audioTack)
        this.mediaSource.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onsoa)
        console.warn('mediaSource did not create')
        this.resolveThenMediaSourceOpen = this.resolveThenMediaSourceOpen
          ? this.resolveThenMediaSourceOpen
          : resolve
        this.rejectThenMediaSourceOpen = this.rejectThenMediaSourceOpen
            ? this.rejectThenMediaSourceOpen
            : reject
        return
      }

      this.playTime = time
      this.videoTrack = videoTrack
      this.audioTack = audioTack

      // deferring execution
      if (this.mediaSource && this.mediaSource.readyState !== 'open') {
        console.warn('readyState is not "open"')
        this.shouldPlay = true
        this.resolveThenMediaSourceOpen = this.resolveThenMediaSourceOpen
          ? this.resolveThenMediaSourceOpen
          : resolve
        this.rejectThenMediaSourceOpen = this.rejectThenMediaSourceOpen
          ? this.rejectThenMediaSourceOpen
          : reject
        return
      }

      this._pause = false
      this.playing = true

      const startWS = mseUtils.startWebSocket(this.url, time, videoTrack, audioTack)

      startWS.bind(this)()

      // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
      this.playPromise = this.media.play()
      this.startProgressTimer()
      this.playing = true

      this.playPromise.then(() => {
        if (this.resolveThenMediaSourceOpen) {
          this.resolveThenMediaSourceOpen()
          this.resolveThenMediaSourceOpen = void 0
          this.rejectThenMediaSourceOpen = void 0
        }
      }, () => {
        if (this.rejectThenMediaSourceOpen) {
          this.rejectThenMediaSourceOpen()
          this.resolveThenMediaSourceOpen = void 0
          this.rejectThenMediaSourceOpen = void 0
        }
      })
      return this.playPromise
    })
  }

  init() {
    this._buffers = {}
    this._queues = {}
    this.playing = false

    // flag to pending execution(true)
    this.shouldPlay = false

    // store to execute pended method play
    this.playTime = void 0
    this.audioTack = ''
    this.videoTrack = ''
    this.endProgressTimer()
  }

  _resume() {
    this.websocket.send('resume')
    this.playPromise = this.media.play()
    this._pause = false
    this.playing = true
  }

  onMediaDetaching() {
    if (this.stopRunning) {
      console.log('stop is running.')
      return
    }
    this.stopRunning = true
    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    const bindedMD = this.handlerMediaDetaching.bind(this)
    if (this.playPromise) {
      // there are two cases:
      // resolved/rejected
      // both required to shutdown ws, mediasources and etc.
      return this.playPromise.then(bindedMD, bindedMD)
    }
    if (!this.playPromise) {
      return this.handlerMediaDetaching()
    }
  }

  handlerMediaDetaching() {
    console.info('media source detaching')

    let mediaEmptyPromise

    // destroy media source and detach from media element
    this.removeMediaSource()

    if (this.media) {
      this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_PROGRESS, this.oncvp) // checkVideoProgress
      mediaEmptyPromise = new Promise(resolve => {
        this._onmee = this.onMediaElementEmptied(resolve).bind(this)
      })
      mediaEmptyPromise.then(() => this.stopRunning = false)
      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_EMPTIED, this._onmee)
    }

    this.oncvp = null

    this.mediaSource = null

    this.init()
    this.destroyWebsocket()

    return mediaEmptyPromise
  }

  removeMediaSource() {
    const ms = this.mediaSource
    if (ms) {
      if (ms.readyState === 'open') {
        try {
          // endOfStream could trigger exception if any sourcebuffer is in updating state
          // we don't really care about checking sourcebuffer state here,
          // as we are anyway detaching the MediaSource
          // let's just avoid this exception to propagate
          ms.endOfStream()
        } catch (err) {
          console.warn(`onMediaDetaching:${err.message} while calling endOfStream`)
        }
      }

      ms.removeEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onmso)
      ms.removeEventListener(EVENTS.MEDIA_SOURCE_SOURCE_ENDED, this.onmse)
      ms.removeEventListener(EVENTS.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc)
      this.onmso = null
      this.onmse = null
      this.onmsc = null
    }

    // Detach properly the MediaSource from the HTMLMediaElement as
    // suggested in https://github.com/w3c/media-source/issues/53.
    URL.revokeObjectURL(this.media.src)
    this.media.removeAttribute('src')
    this.media.load()
  }

  destroyWebsocket() {
    if (this.websocket) {
      this.websocket.removeEventListener(EVENTS.WS_MESSAGE, this.onwsdm)
      this.websocket.onclose = function() {} // disable onclose handler first
      this.websocket.close()
      this.onwsdm = null
    }
  }

  onMediaElementEmptied(resolve) {
    if (this._onmee && this.media) {
      this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_EMPTIED, this._onmee)
      this._onmee = void 0
    }
    return resolve()
  }

  onAttachMedia(data) {
    this.media = data.media
    const media = this.media
    if (media) {
      // setup the media source
      const ms = (this.mediaSource = new MediaSource())
      //Media Source listeners

      this.onmse = this.onMediaSourceEnded.bind(this)
      this.onmsc = this.onMediaSourceClose.bind(this)

      ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_ENDED, this.onmse)
      ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc)
      // link video and media Source
      media.src = URL.createObjectURL(ms)

      this.oncvp = mseUtils.checkVideoProgress(media).bind(this)
      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_PROGRESS, this.oncvp)
      return new Promise(resolve => {
        this.onmso = this.onMediaSourceOpen.bind(this, resolve)
        ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onmso)
      })
    }
  }

  onMediaSourceOpen(resolve) {
    resolve()
    let mediaSource = this.mediaSource
    if (mediaSource) {
      // once received, don't listen anymore to sourceopen event
      mediaSource.removeEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onmso)
    }

    // play was called but stoped and was pend(1.readyState is not open)
    // and time is come to execute it
    if (this.shouldPlay) {
      console.info(
        `readyState now is ${this.mediaSource.readyState}, and will be played`,
        this.playTime,
        this.audioTack,
        this.videoTrack
      )
      this.shouldPlay = false
      this._play(this.playTime, this.audioTack, this.videoTrack)
    }
  }

  onWebsocketOpen() {
    this.websocket.send('resume')
    this.websocket.removeEventListener(EVENTS.WS_OPEN, this.onwso)
  }

  dispatchMessage(e) {
    try {
      if (this._pause || !this.playing) {
        return
      }

      const rawData = e.data
      if (rawData instanceof ArrayBuffer) {
        this.doArrayBuffer(rawData, this.maybeAppend)
      } else {
        this.procInitSegment(rawData)
        this.afterSeekFlag = false
      }
    } catch (err) {
      console.error(mseUtils.errorMsg(e), err)

      if (this.media && this.media.error) {
        console.error('MediaError:', this.media.error)
      }

      if (e.data instanceof ArrayBuffer) {
        console.error('Data:', mseUtils.debugData(e.data))
      }
      errorsCount++
      if (errorsCount >= this.opts.errorsBeforeStop) {
        this.stopPromise = this.stop()
      }

      if (this.onError) {
        this.onError(err, e)
      }
    }
  }

  // there are two cases
  // 1. this.mediaSource is already exists
  // 2. this.meidaSource is undefined
  procInitSegment(rawData) {
    const data = JSON.parse(rawData)
    if (data.type === segmentsTypes.MSE_INIT_SEGMENT) {
      if (this.onMediaInfo) {
        this.mediaInfo = data.metadata
        try {
          this.onMediaInfo(data.metadata)
        } catch (e) {
          console.error(mseUtils.errorMsg(e))
        }
      }

      // 1.
      if (this.mediaSource && !this.mediaSource.sourceBuffers.length) {
        this.createSourceBuffers(data.tracks)

        // TODO: describe cases
        data.tracks.forEach(track => {
          this.maybeAppend(track.id, mseUtils.base64ToArrayBuffer(track.payload))
        })

        return
      }

      // 2
      if (this.mediaSource && this.mediaSource.sourceBuffers.length) {
        if (this.afterSeekFlag) {
          data.tracks.forEach(track => {
            this.maybeAppend(track.id, mseUtils.base64ToArrayBuffer(track.payload))
          })
          this.afterSeekFlag = false
          return
        }

        this.stop().then(() => {
          setTimeout(() => this.play(), 5000)
        })
      }
      // TODO: describe cases
    } else if (data.type === segmentsTypes.MSE_MEDIA_SEGMENT) {
      this.maybeAppend(data.id, mseUtils.base64ToArrayBuffer(data.payload))
    }
  }

  getVideoTracks() {
    if (!this.mediaInfo) {
      return
    }
    return this.mediaInfo.streams.filter(s => s.content === TYPE_CONTENT_VIDEO)
  }

  getAudioTracks() {
    if (!this.mediaInfo) {
      return
    }
    return this.mediaInfo.streams.filter(s => s.content === TYPE_CONTENT_AUDIO)
  }

  maybeAppend(trackId, binaryData) {

    const buffer = this._buffers[trackId]

    if (this.afterSeekFlag) {

      for(let k in this._buffers) {
        this._buffers[k].abort()
        this._buffers[k].mode = 'sequence'
      }

      this.afterSeekFlag = false
    }
    const queue = this._queues[trackId]
    if (buffer.updating || queue.length > 0) {
      queue.push(binaryData)
    } else {
      buffer.appendBuffer(binaryData)
    }
  }

  startProgressTimer() {
    if (this.onProgress) {
      this.timer = setInterval(this.onTimer.bind(this), this.opts.progressUpdateTime)
    }
  }

  endProgressTimer() {
    clearInterval(this.timer)
    this.timer = void 0
  }

  onTimer() {
    if (!(this.utc && this.utc != this.utcPrev)) {
      return
    }
    try {
      this.onProgress(this.utc)
    } catch (e) {
      console.error(mseUtils.errorMsg(e))
    }

    this.utcPrev = this.utc
  }

  onMediaSourceEnded() {
    console.log('media source ended')
  }

  onMediaSourceClose() {
    console.log('media source closed')
  }

  createSourceBuffers(tracks) {
    tracks.forEach(track => {
      // TODO: use metadata from server
      const mimeType = track.content === 'video' ? 'video/mp4; codecs="avc1.4d401f"' : 'audio/mp4; codecs="mp4a.40.2"'

      this._buffers[track.id] = this.mediaSource.addSourceBuffer(mimeType)
      const buffer = this._buffers[track.id]
      buffer.mode = this.opts && this.opts.bufferMode
      this._queues[track.id] = []
      const queue = this._queues[track.id]

      buffer.addEventListener(EVENTS.BUFFER_UPDATE_END, updateEnd.bind(this))
      buffer.addEventListener(EVENTS.BUFFER_ERROR, onError)
      buffer.addEventListener(EVENTS.BUFFER_ABORT, onAbort)

      function updateEnd() {
        try {
          if (queue.length > 0 && !buffer.updating) {
            buffer.appendBuffer(queue.shift())
          }
        } catch (e) {
          console.error(mseUtils.errorMsg(e), this.media.error)
        }
      }

      function onError() {
        throw new Error('buffer error: ', arguments)
      }

      function onAbort() {
        console.warn('abort buffer')
      }
    })
  }

  _setTracks(videoTrack, audioTrack) {
    this.onMediaDetaching().then(() => {
      this.onAttachMedia({media: this.media})
      this.onsoa = this._play.bind(this, null, videoTrack, audioTrack)
      this.mediaSource.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onsoa)
    })
  }

  setBufferMode(optsOrBufferModeValue) {
    if (typeof optsOrBufferModeValue === 'object') {
      this.opts.bufferMode = optsOrBufferModeValue.bufferMode ? optsOrBufferModeValue.bufferMode : DEFAULT_BUFFER_MODE
    }

    if (typeof optsOrBufferModeValue === 'string') {
      this.opts.bufferMode = optsOrBufferModeValue
    }

    if (this.opts.bufferMode !== BUFFER_MODE_SEGMENTS && this.opts.bufferMode !== BUFFER_MODE_SEQUENCE) {
      throw new Error(
        `invalid bufferMode param, should be undefined or ${BUFFER_MODE_SEGMENTS} or ${BUFFER_MODE_SEQUENCE}.`
      )
    }
  }
}
