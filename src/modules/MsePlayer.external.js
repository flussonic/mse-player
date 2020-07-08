import 'core-js/fn/array/find'

import WebSocketController from '../controllers/ws'
import BuffersController from '../controllers/buffers'
// import MediaSourceController from '../controllers/mediaSource'

import * as mseUtils from '../utils/mseUtils'
import {logger, enableLogs} from '../utils/logger'

import {MSE_INIT_SEGMENT, EVENT_SEGMENT} from '../enums/segments'
import {AUDIO, VIDEO} from '../enums/common'
import EVENTS from '../enums/events'
import MSG from '../enums/messages'

const WS_EVENT_PAUSED = 'paused'
const WS_EVENT_RESUMED = 'resumed'
const WS_EVENT_SEEKED = 'seeked'
const WS_EVENT_SWITCHED_TO_LIVE = 'switched_to_live'
const WS_EVENT_EOS = 'recordings_ended'
const WS_EVENT_NO_LIVE = 'stream_unavailable'
const WS_EVENT_TRACKS_SWITCHED = 'tracks_switched'
const WS_TRY_RECONNECT = false

const TYPE_CONTENT_VIDEO = VIDEO
const TYPE_CONTENT_AUDIO = AUDIO
const DEFAULT_ERRORS_BEFORE_STOP = 1
const DEFAULT_UPDATE = 100
const DEFAULT_CONNECTIONS_RETRIES = 0
const DEFAULT_RETRY_MUTED = false
const DEFAULT_FORCE_UNMUTED = false
const MAX_BUFFER_DELAY = 2

export default class MSEPlayer {
  static get version() {
    return VERSION
  }

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
   * @param opts
   */

  constructor(media, urlStream, opts = {}) {
    if (opts.debug) {
      enableLogs(true)
      window.humanTime = mseUtils.humanTime
    }

    logger.info('[mse-player]:', MSEPlayer.version)

    this.opts = opts || {}

    this.media = media

    this.url = urlStream

    this.opts.progressUpdateTime = this.opts.progressUpdateTime || DEFAULT_UPDATE

    this.opts.errorsBeforeStop = this.opts.errorsBeforeStop ? this.opts.errorsBeforeStop : DEFAULT_ERRORS_BEFORE_STOP

    if (typeof this.opts.errorsBeforeStop !== 'number' || isNaN(this.opts.errorsBeforeStop)) {
      throw new Error('invalid errorsBeforeStop param, should be number')
    }

    this.opts.connectionRetries = this.opts.connectionRetries || DEFAULT_CONNECTIONS_RETRIES

    if (typeof this.opts.connectionRetries !== 'number' || isNaN(this.opts.connectionRetries)) {
      throw new Error('invalid connectionRetries param, should be number')
    }

    this.opts.wsReconnect = this.opts.wsReconnect ? this.opts.wsReconnect : WS_TRY_RECONNECT

    if (typeof this.opts.wsReconnect !== 'boolean') {
      throw new Error('invalid wsReconnect param, should be boolean')
    }

    this.retry = 0
    this.retryConnectionTimer

    this.opts.retryMuted = this.opts.retryMuted ? this.opts.retryMuted : DEFAULT_RETRY_MUTED

    if (typeof this.opts.retryMuted !== 'boolean') {
      throw new Error('invalid retryMuted param, should be boolean')
    }

    this.opts.maxBufferDelay = this.opts.maxBufferDelay ? this.opts.maxBufferDelay : MAX_BUFFER_DELAY
    const ua = navigator.userAgent
    if (/Edge/.test(ua) || /trident.*rv:1\d/i.test(ua)) {
      this.opts.maxBufferDelay = 10 // very slow buffers in Edge
    }

    if (typeof this.opts.maxBufferDelay !== 'number') {
      throw new Error('invalid maxBufferDelay param, should be number')
    }

    this.onProgress = opts && opts.onProgress
    if (opts && opts.onDisconnect) {
      this.onDisconnect = opts && opts.onDisconnect
    } else {
      this.onDisconnect = (status) => {
        logger.log('[websocket status]:', status)
      }
    }
    this.onMediaInfo = opts && opts.onMediaInfo
    this.onError = opts && opts.onError
    this.onEvent = opts && opts.onEvent
    this.onAutoplay = opts && opts.onAutoplay
    this.onMuted = opts && opts.onMuted
    this.onStats = opts && opts.onStats
    this.onMessage = opts && opts.onMessage

    this.init()

    if (media instanceof HTMLMediaElement) {
      // iOS autoplay with no fullscreen fix
      media.WebKitPlaysInline = true
      media.controls = false
      // this.media.addEventListener('onerror', (err) => { console.log('ERROR', err)})
      // this.media.addEventListener('error', (err) => { console.log('ERROR', err)})
      // this.media.onerror = function() {
      //   console.log("Error " + videoElement.error.code + "; details: " + videoElement.error.message);
      // }
      // this.media.addEventListener('onpause', (err) => { console.log('onpause', err)})

      // this.media.addEventListener('pause', (event) => {
      //   console.log('paused !!!', event);
      // });
    }

    this.ws = new WebSocketController({
      message: this.dispatchMessage.bind(this),
      closed: this.onDisconnect.bind(this),
      error: this.onError,
      wsReconnect: this.opts.wsReconnect,
    })

    /*
     * SourceBuffers Controller
     */
    this.sb = new BuffersController({media})

    this.messageTime = Date.now()
  }

  play(time, videoTrack, audioTrack) {
    logger.log('[mse-player]: play()')
    return this._play(time, videoTrack, audioTrack)
      .then(() => {
        this.playing = true
      })
      .catch(() => {
        this.playing = false
      })
  }

  stop() {
    return this.onMediaDetaching()
  }

  seek(utc) {
    if (this.playing) {
      try {
        if (!utc) {
          throw new Error('utc should be "live" or UTC value')
        }
        this.ws.seek(utc)
        this.sb.seek()
        this.onStartStalling()
        // need for determine old frames
        this.seekValue = utc
        this.media.pause()
        this._pause = true
        this.playing = false
      } catch (err) {
        logger.warn(`seek:${err.message}`)
      }
    }
  }

  pause() {
    if (!canPause.bind(this)()) {
      return logger.log('[mse:playback] can not do pause')
    }
    const binded = _pause.bind(this)
    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    this.playPromise.then(binded, binded)
    function _pause() {
      this.ws.pause()
      this.media.pause()
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

    function canPause() {
      if (
        this._pause ||
        !this.playing ||
        !this.media ||
        !this.ws ||
        !this.mediaSource ||
        (this.mediaSource && this.mediaSource.readyState !== 'open') ||
        !this.playPromise
      ) {
        return false
      }
      return true
    }
  }

  restart(fullRestart = true) {
    const from = fullRestart ? undefined : this.sb.lastLoadedUTC

    this.playing = false
    this.ws.destroy()
    this.ws.init()
    this.ws.start(this.url, from, this.videoTrack, this.audioTrack)
    this.onEndStalling()
  }

  retryConnection(time = null, videoTrack = null, audioTrack = null) {
    if (this.retry >= this.opts.connectionRetries) {
      clearInterval(this.retryConnectionTimer)
      return
    }
    logger.log('%cconnectionRetry:', 'background: orange;', `Retrying ${this.retry + 1}`)
    this.mediaSource = void 0
    this.init()
    this.ws.destroy()
    this.sb.destroy()

    this.play(time, videoTrack, audioTrack).then(() => {
      this.onEndStalling()
    })
    this.retry = this.retry + 1
  }

  setTracks(tracks) {
    if (!this.mediaInfo) {
      logger.warn('Media info did not loaded. Should try after onMediaInfo triggered or inside.')
      return
    }

    if (!Array.isArray(tracks)) {
      logger.error('tracks should be an Array instance: ["v1", "a1"]')
    }

    const videoTracksType = this.mediaInfo.streams ? 'streams' : 'tracks'

    let videoTracksStr = tracks
      .filter((id) => {
        const stream = this.mediaInfo[videoTracksType].find((s) => id === s['track_id'])
        return !!stream && stream.content === TYPE_CONTENT_VIDEO
      })
      .join('')

    let audioTracksStr = tracks
      .filter((id) => {
        const stream = this.mediaInfo[videoTracksType].find((s) => id === s['track_id'])
        if (stream) {
          // if (stream.bitrate && stream.bitrate === 0) {
          //   return null
          // }
          return !!stream && stream.content === TYPE_CONTENT_AUDIO
        } else {
          return null
        }
      })
      .join('')

    if (!audioTracksStr && !videoTracksStr) {
      logger.warn('No such stream tracks! Setting to default parameters')
      const videoTracks = this.getVideoTracks()
      const audioTracks = this.getAudioTracks()
      if (audioTracks.length) {
        audioTracksStr = audioTracks[0].track_id
      } else {
        logger.warn('No audio tracks')
      }
      if (videoTracks.length) {
        // Добавить адаптивный выбор видео дорожки?
        videoTracksStr = videoTracks[0].track_id
      } else {
        logger.warn('No video tracks')
      }
    }

    if (!audioTracksStr) {
      if (this.sb.sourceBuffer.audio) {
        this.sb.removeSourceBuffer()
      }
      this.media.muted = true
      logger.warn('No audio tracks')
    }

    if (videoTracksStr && audioTracksStr && this.mediaSource.sourceBuffers.length <= 1) {
      // Решить в задаче #12506
      // this.sb.addSourceBuffer()
    }

    this.onStartStalling()
    this.ws.setTracks(videoTracksStr, audioTracksStr)

    this.videoTrack = videoTracksStr
    this.audioTrack = audioTracksStr
    // ?
    this._setTracksFlag = true
    this.waitForInitFrame = true
  }

  /**
   *
   *  Private members
   *
   */

  _play(from, videoTrack, audioTrack) {
    this.liveError = false
    let canPlay = false
    return new Promise((resolve, reject) => {
      logger.log('_play', from, videoTrack, audioTrack)

      if (this.playing) {
        const message = '[mse-player] _play: terminate because already has been playing'
        logger.log(message)
        return resolve({message})
      }

      if (this._pause) {
        // should invoke play method of video in onClick scope
        // further logic are duplicated at checkVideoProgress
        // https://github.com/jwplayer/jwplayer/issues/2421#issuecomment-333130812

        if (this.ws && this.ws.opened === false) {
          logger.log('WebSocket Closed, trying to restart it')
          this._pause = false
          this.restart()
          return
        } else {
          logger.log('WebSocket is in opened state, resuming')
          this._pause = false
          this._resume() // ws
        }

        this.playPromise = this.media.play()
        logger.log('_play: terminate because _paused and should resume')
        return this.playPromise
      }

      this.playTime = from
      this.videoTrack = videoTrack
      this.audioTrack = audioTrack
      this._pause = false

      // TODO: to observe this case, I have no idea when it fired
      if (!this.mediaSource) {
        this.onAttachMedia({media: this.media}).then(() => {
          this.onsoa = this._play.bind(this, from, videoTrack, audioTrack)
          this.mediaSource.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onsoa)
          logger.warn('mediaSource did not create')
          this.resolveThenMediaSourceOpen = this.resolveThenMediaSourceOpen ? this.resolveThenMediaSourceOpen : resolve
          this.rejectThenMediaSourceOpen = this.rejectThenMediaSourceOpen ? this.rejectThenMediaSourceOpen : reject
          return
        })
      }

      // deferring execution
      if (this.mediaSource && this.mediaSource.readyState !== 'open') {
        logger.warn('readyState is not "open", it\'s currently ', this.mediaSource.readyState)
        this.shouldPlay = true
        this.resolveThenMediaSourceOpen = this.resolveThenMediaSourceOpen ? this.resolveThenMediaSourceOpen : resolve
        this.rejectThenMediaSourceOpen = this.rejectThenMediaSourceOpen ? this.rejectThenMediaSourceOpen : reject
        return
      }

      const ifApple = function () {
        var iDevices = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod', 'Safari']

        if (!!navigator.platform) {
          while (iDevices.length) {
            if (navigator.platform === iDevices.pop()) {
              return true
            }
          }
        }

        return false
      }

      // for autoplay on interaction
      const autoPlayFunc = new Promise((resolve, reject) => {
        if (this.media.autoplay && this.media.muted !== true && !this.opts.retryMuted) {
          if (this.onAutoplay && !ifApple()) {
            this.onAutoplay(() => {
              this.media.muted = false
              return resolve()
            })
          } else {
            this.media.muted = true
            return resolve()
          }
        } else {
          return resolve()
        }
      })

      autoPlayFunc.then(() => {
        this.ws.start(this.url, this.playTime, this.videoTrack, this.audioTrack).then(() => {
          // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
          this.playPromise = this.media.play()
          this.playPromise
            .then(() => {
              this.onStartStalling() // switch off at progress checker
              this.startProgressTimer()
              if (this.resolveThenMediaSourceOpen) {
                this._stop = false
                this.resolveThenMediaSourceOpen()
                this.resolveThenMediaSourceOpen = void 0
                this.rejectThenMediaSourceOpen = void 0
                clearInterval(this.retryConnectionTimer)
                this.retry = 0
              }
            })
            .catch((err) => {
              logger.log('playPromise rejection.', err)
              // if error, this.ws.connectionPromise can be undefined
              if (this.ws.connectionPromise) {
                this.ws.connectionPromise.then(() => this.ws.pause()) // #6694
              }
              // this._pause = true

              if (this.opts.retryMuted && this.media.muted == false) {
                if (this.onMuted) {
                  this.onMuted()
                }
                this.media.muted = true
                this._play(from, videoTrack, audioTrack)
              }

              if (this.onError) {
                this.onError({
                  error: 'play_promise_reject',
                  err,
                })
              }

              if (this.rejectThenMediaSourceOpen) {
                this.rejectThenMediaSourceOpen()
                this.resolveThenMediaSourceOpen = void 0
                this.rejectThenMediaSourceOpen = void 0
              }

              if (!this.opts.retryMuted) {
                this.stop()
              }
            })

          return this.playPromise
        })
      })
    })
  }

  init() {
    this._pause = false
    this.playing = false
    // flag to pending execution(true)
    this.shouldPlay = false
    // store to execute pended method play
    this.playTime = void 0
    this.audioTrack = ''
    this.videoTrack = ''
    this.endProgressTimer()
  }

  _resume() {
    this.ws.resume()
  }

  onMediaDetaching() {
    if (this.stopRunning) {
      logger.warn('stop is running.')
      return
    }
    this.stopRunning = true
    // workaround pending playPromise state
    // TODO: how to be with pending internal statuses
    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    const bindedMD = this.handlerMediaDetaching.bind(this)
    if (this.playPromise) {
      // there are two cases:
      // resolved/rejected
      // both required to shutdown ws, mediasources and etc.
      this.playPromise
        .then(() => {
          return this.handlerMediaDetaching()
        })
        .catch(() => {
          return this.handlerMediaDetaching()
        })
    }
    if (!this.playPromise) {
      return this.handlerMediaDetaching()
    }

    return this.handlerMediaDetaching()
  }

  handlerMediaDetaching() {
    logger.info('media source detaching')
    let mediaEmptyPromise

    // destroy media source and detach from media element
    this.removeMediaSource()
    this._stop = true

    if (this.media) {
      this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_PROGRESS, this.oncvp) // checkVideoProgress
      this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_SUSPEND, this.errorLog)
      this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_STALLED, this.errorLog)
      this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_WAITING, this.errorLog)
      this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_RATECHANGE, this.errorLog)
      this.media.removeEventListener(EVENTS.MEDIA_ELEMENT_PLAYING, this.errorLog)
      mediaEmptyPromise = new Promise((resolve) => {
        this._onmee = this.onMediaElementEmptied(resolve).bind(this)
      })
      mediaEmptyPromise.then(() => (this.stopRunning = false))
      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_EMPTIED, this._onmee)
    }

    this.oncvp = null
    this.errorLog = null

    this.mediaSource = null

    this.init()
    this.ws.destroy()
    this.sb.destroy()
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
          logger.warn(`onMediaDetaching:${err.message} while calling endOfStream`)
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
    // URL.revokeObjectURL(this.media.src)
    this.media.removeAttribute('src')
    this.media.load()
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
    if (!(media instanceof HTMLMediaElement)) {
      throw new Error(MSG.NOT_HTML_MEDIA_ELEMENT)
    }
    if (media) {
      // setup the media source
      const ms = (this.mediaSource = new MediaSource())
      // Media Source listeners
      this.onmse = this.onMediaSourceEnded.bind(this)
      this.onmsc = this.onMediaSourceClose.bind(this)

      ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_ENDED, this.onmse)
      ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc)
      // link video and media Source
      media.src = URL.createObjectURL(ms)
      this.eventLog = (event) => {
        if (this.onEvent) {
          this.onEvent(event)
        }
      }

      this.oncvp = mseUtils.checkVideoProgress(media, this).bind(this)
      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_PROGRESS, this.oncvp)

      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_WAITING, this.eventLog)
      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_STALLED, this.eventLog)
      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_SUSPEND, this.eventLog)
      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_RATECHANGE, this.eventLog)
      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_PLAYING, this.eventLog)

      if (this.liveError) {
        this.player = void 0
        return
      }
      return new Promise((resolve) => {
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

    URL.revokeObjectURL(this.media.src)

    // play was called but stoped and was pend(1.readyState is not open)
    // and time is come to execute it
    if (this.shouldPlay) {
      this.shouldPlay = false
      logger.info(
        `readyState now is ${this.mediaSource.readyState}, and will be played`,
        this.playTime,
        this.audioTrack,
        this.videoTrack
      )
      this._play(this.playTime, this.audioTrack, this.videoTrack)
    }
  }

  onDisconnect(event) {
    if (this.opts.onDisconnect) {
      this.opts.onDisconnect(event)
    }
  }

  // canStartUnmuted() {
  //   if (!this.playing && this.shouldPlay) {
  //     this.shouldPlay = false
  //     this._play(this.playTime, this.audioTrack, this.videoTrack).then(() => {
  //       this.media.muted = false
  //       window.removeEventListener('click', this.canStartUnmuted)
  //       window.removeEventListener('touchstart', this.canStartUnmuted)
  //     })
  //   }
  // }

  dispatchMessage(e) {
    if (this.stopRunning) {
      return
    }

    const rawData = e.data
    const isDataAB = rawData instanceof ArrayBuffer
    const parsedData = !isDataAB ? JSON.parse(rawData) : void 0
    // mseUtils.logDM(isDataAB, parsedData)

    const messageTimeDiff = Date.now() - this.messageTime
    this.messageTime = Date.now()
    if (this.opts.onMessage) {
      this.opts.onMessage({
        utc: Date.now(),
        messageTimeDiff,
      })
    }

    try {
      // ArrayBuffer data
      if (isDataAB) {
        // wait for MSE_INIT_SEGMENT
        if (this.waitForInitFrame) {
          return logger.log('old frames')
        }
        this.sb.procArrayBuffer(rawData)
      }

      /*
       * EVENTS
       */
      if (parsedData && parsedData.type === EVENT_SEGMENT) {
        const eventType = parsedData[EVENT_SEGMENT]
        logger.log(
          `%c ${parsedData.type} ${parsedData.type === 'event' ? parsedData.event : 'mse_init_segment'}`,
          'background: aquamarine;',
          parsedData
        )
        switch (eventType) {
          case WS_EVENT_RESUMED:
            if (this._pause && !this.playing) {
              // wait for "progress" event, for shift currentTime and start playing
              this.onStartStalling()
            }
            break
          case WS_EVENT_PAUSED:
            break
          case WS_EVENT_SEEKED:
          case WS_EVENT_SWITCHED_TO_LIVE:
            this.seekValue = void 0
            if (this.opts.onSeeked) {
              try {
                this.opts.onSeeked()
              } catch (err) {
                console.error(err)
              }
            }
            break
          case WS_EVENT_EOS:
            this._eos = true
            this.sb.onBufferEos()
            break
          // if live source is unavailability
          case WS_EVENT_NO_LIVE:
            if (parsedData.hasOwnProperty('static') && parsedData.static == false) {
              logger.info('Stream is on on demand mode, waiting for init segment')
              this.onStartStalling()
            } else {
              logger.warn('do playPromise reject with error')
              if (this.ws.connectionPromise) {
                this.ws.connectionPromise.then(() => this.ws.pause()) // #6694
              }
              if (!this.liveError) {
                if (this.opts.onError) {
                  this.opts.onError({
                    error: 'playPromise reject - stream unavaible',
                  })
                }
                this.liveError = true
              }

              if (this.rejectThenMediaSourceOpen) {
                this.rejectThenMediaSourceOpen()
                this.resolveThenMediaSourceOpen = void 0
                this.rejectThenMediaSourceOpen = void 0
              }
              this.playPromise = Promise.reject('stream unavaible')
              this.mediaSource.endOfStream()
            }
            break
          case WS_EVENT_TRACKS_SWITCHED:
            break
          default:
            if (this.opts.onEvent) {
              this.opts.onEvent({error: 'unhandled_event', event: eventType})
            }
            logger.warn('unknown type of event', eventType)
        }
        return
      }

      // MSE_INIT_SEGMENT
      if (parsedData && parsedData.type === MSE_INIT_SEGMENT) {
        return this.procInitSegment(rawData)
      }
    } catch (err) {
      mseUtils.showDispatchError.bind(this)(e, err)
      try {
        if (this.mediaInfo && this.mediaInfo.activeStreams) {
          const {activeStreams} = this.mediaInfo
          this.setTracks([
            activeStreams.video ? activeStreams.video : '',
            activeStreams.audio ? activeStreams.audio : '',
          ])
        }
      } catch (err) {
        this.ws.pause()
      }
    }
  }

  procInitSegment(rawData) {
    const data = JSON.parse(rawData)

    if (data.type !== MSE_INIT_SEGMENT) {
      return logger.warn(`type is not ${MSE_INIT_SEGMENT}`)
    }

    if (this.waitForInitFrame) {
      this.waitForInitFrame = false
    }

    if (this.sb.isBuffered()) {
      // this.media.pause()
      // this.previouslyPaused = false
      // this._setTracksFlag = true
      // this.immediateSwitch = true
      // const startOffset = 0
      // const endOffset = Infinity
      // // TODO: should invoke remove method of SourceBuffer's
      // this.sb.flushRange.push({start: startOffset, end: endOffset, type: void 0})
      // // attempt flush immediately
      // this.sb.flushBufferCounter = 0
      this.sb.doFlush()
      this.sb.seek()
    }

    // calc this.audioTrackId this.videoTrackId
    this.sb.setTracksByType(data)

    const metadata = {
      ...data.metadata,
      tracks: data.metadata.streams ? data.metadata.streams : data.metadata.tracks,
      streams: data.metadata.streams ? data.metadata.streams : data.metadata.tracks,
    }

    let streams = data.metadata.streams
    if (data.metadata.tracks) {
      streams = data.metadata.tracks
    }

    const activeStreams = {}

    const videoIndex = this.sb.videoTrackId && this.sb.videoTrackId.index
    if (streams[videoIndex] && streams[videoIndex]['track_id']) {
      if (
        (streams[videoIndex].bitrate && streams[videoIndex].bitrate === 0) ||
        streams[videoIndex].height === 0 ||
        streams[videoIndex].width === 0
      ) {
        this.onError &&
          this.onError({
            error: 'Video track error',
          })
        return
      }
      activeStreams.video = streams[videoIndex]['track_id']
    }

    const audioIndex = this.sb.audioTrackId && this.sb.audioTrackId.index
    if (audioIndex) {
      if (streams[audioIndex] && streams[audioIndex]['track_id']) {
        if (streams[audioIndex].bitrate && streams[audioIndex].bitrate === 0) {
          this.onError &&
            this.onError({
              error: 'Audio track error',
            })
          let idToDelete
          data.tracks.forEach((item, index) => {
            if (item.id === this.sb.audioTrackId.id) {
              idToDelete = index
            }
          })
          data.tracks.splice(idToDelete, 1)
          if (this.sb.sourceBuffer.audio) {
            this.mediaSource.removeSourceBuffer(this.sb.sourceBuffer.audio)
            // this.sb.audioTrackId = void 0
            delete this.sb.sourceBuffer.audio
          }
        } else {
          activeStreams.audio = streams[audioIndex]['track_id']
        }
      }
    }

    this.doMediaInfo({...metadata, activeStreams, version: MSEPlayer.version})
    logger.log('%cprocInitSegment:', 'background: lightpink;', data)
    if (this.mediaSource && !this.mediaSource.sourceBuffers.length) {
      this.sb.setMediaSource(this.mediaSource)
      this.sb.createSourceBuffers(data)
    }
    if (!this.liveError) {
      this.sb.createTracks(data.tracks)
    }
  }

  doMediaInfo(metadata) {
    logger.log('%cmediaInfo:', 'background: orange;', metadata)
    if (this.onMediaInfo) {
      this.mediaInfo = metadata
      try {
        this.onMediaInfo(metadata)
      } catch (e) {
        console.error(mseUtils.errorMsg(e))
      }
    }
  }

  getVideoTracks() {
    if (!this.mediaInfo) {
      return
    }
    const videoTracksType = this.mediaInfo.streams ? 'streams' : 'tracks'
    return this.mediaInfo[videoTracksType].filter((s) => s.content === TYPE_CONTENT_VIDEO)
  }

  getAudioTracks() {
    if (!this.mediaInfo) {
      return
    }
    const videoTracksType = this.mediaInfo.streams ? 'streams' : 'tracks'
    return this.mediaInfo[videoTracksType].filter((s) => s.content === TYPE_CONTENT_AUDIO)
  }

  /**
   * on immediate level switch end, after new fragment has been buffered:
   * - nudge video decoder by slightly adjusting video currentTime (if currentTime buffered)
   * - resume the playback if needed
   */
  immediateLevelSwitchEnd() {
    const media = this.media
    if (media && media.buffered.length) {
      this.immediateSwitch = false
      // if (BufferHelper.isBuffered(media, media.currentTime)) {
      // only nudge if currentTime is buffered
      // media.currentTime -= 0.0001;
      // }
      if (!this.previouslyPaused) {
        this.playPromise = media.play()
        this.playPromise.then(() => {
          this._pause = false
          this.playing = true
        })
      }
    }
  }

  onStartStalling() {
    if (!this.resetTimer) {
      this.resetTimer = setTimeout(() => {
        this.restart()
      }, 60000)
    }

    if (this._stalling) return
    if (this.opts.onStartStalling) {
      this.opts.onStartStalling()
    }
    this._stalling = true
    logger.log('onStartStalling')
  }

  onEndStalling() {
    if (!this._stalling) return
    if (this.opts.onEndStalling) {
      this.opts.onEndStalling()
    }
    this._stalling = false
    logger.log('onEndStalling')

    clearTimeout(this.resetTimer)
    this.resetTimer = void 0
  }

  startProgressTimer() {
    this.timer = setInterval(this.onTimer.bind(this), this.opts.progressUpdateTime)
  }

  endProgressTimer() {
    clearInterval(this.timer)
    this.timer = void 0
  }

  onTimer() {
    if (this._eos) {
      return logger.log('nothing to play')
    }

    // #TODO explain
    if (this.immediateSwitch) {
      this.immediateLevelSwitchEnd()
    }

    if (this.sb.lastLoadedUTC === this.utcPrev) {
      // logger.log('%cloaded utc is not change', 'background: orange;', this.sb.lastLoadedUTC, this.utcPrev, this._stalling)
      return
    }

    if (this._stalling) {
      // logger.log('%cStalling flag is true', 'background: lightred;')
      return
    }

    this.utcPrev = this.sb.lastLoadedUTC

    if (!this.onProgress) {
      return
    }
    try {
      this.onProgress(this.sb.lastLoadedUTC)
    } catch (e) {
      console.error(mseUtils.errorMsg(e))
    }
  }

  onMediaSourceEnded() {
    logger.log('media source ended')
    try {
      if (this.opts.onEOS) {
        this.opts.onEOS()
      }
    } catch (err) {
      console.error('error while proccessing onEOS')
    }
  }

  onMediaSourceClose() {
    logger.log('media source closed')
  }

  onConnectionRetry() {
    if (!this.retryConnectionTimer && !this._stop) {
      if (this.retry < this.opts.connectionRetries) {
        this.retryConnectionTimer = setInterval(() => this.retryConnection(), 5000)
      }
    } else if (this.retry >= this.opts.connectionRetries) {
      clearInterval(this.retryConnectionTimer)
    }
  }

  debounce(func, wait, immediate) {
    var timeout
    return function () {
      var context = this,
        args = arguments
      var later = function () {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }
}
