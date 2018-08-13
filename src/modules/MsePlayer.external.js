import WebSocketController from '../controllers/ws'
import BuffersController from '../controllers/buffers'
import MediaSourceController from '../controllers/mediaSource'

import {MSE_INIT_SEGMENT, EVENT_SEGMENT} from '../enums/segments'

import {AUDIO, VIDEO} from '../enums/common'

import EVENTS from '../enums/events'
const WS_EVENT_PAUSED = 'paused'
const WS_EVENT_RESUMED = 'resumed'
import MSG from '../enums/messages'
import * as mseUtils from '../utils/mseUtils'
import {logger, enableLogs} from '../utils/logger'

import 'core-js/fn/array/find'

const TYPE_CONTENT_VIDEO = VIDEO
const TYPE_CONTENT_AUDIO = AUDIO



const DEFAULT_ERRORS_BEFORE_STOP = 1
const DEFAULT_UPDATE = 100

let errorsCount = 0
let count = 0

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
   * @param opts
   */
  constructor(media, urlStream, opts = {}) {
    console.log('%constructor Tag', 'background: red;')
    this.opts = opts || {}
    if (this.opts.debug) {
      enableLogs(true)
      window.humanTime = mseUtils.humanTime
    }

    this.media = media

    this.url = urlStream

    this.opts.progressUpdateTime = this.opts.progressUpdateTime || DEFAULT_UPDATE

    this.opts.errorsBeforeStop = this.opts.errorsBeforeStop
      ? this.opts.errorsBeforeStop
      : DEFAULT_ERRORS_BEFORE_STOP

    if (typeof this.opts.errorsBeforeStop !== 'number'
        || isNaN(this.opts.errorsBeforeStop)) {
      throw new Error('invalid errorsBeforeStop param, should be number')
    }

    this.onProgress = opts && opts.onProgress
    this.onMediaInfo = opts && opts.onMediaInfo
    this.onError = opts && opts.onError

    // this.doArrayBuffer = mseUtils.doArrayBuffer.bind(this)
    // this.maybeAppend = this.maybeAppend.bind(this)

    this.init()

    if (media instanceof HTMLMediaElement) {
      this.onAttachMedia({media})
    }

    this.ws = new WebSocketController({
      message: this.dispatchMessage.bind(this),
    });

    /*
     * SourceBuffers Controller
     */

    this.sb = new BuffersController()

  }

  play(time, videoTrack, audioTack) {
    if (this.opts.debug) {
      logger.log('[mse-player]: play()')
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
      // @TODO // DEBUG:
      count = 0

      this.ws.seek(utc)
      this.sb.seek()
      // need for determine old frames
      this.seekValue = utc

    } catch (err) {
      logger.warn(`onMediaDetaching:${err.message} while calling endOfStream`)
    }
  }

  pause() {
    if (!canPause.bind(this)()) {
      return logger.log('[dispatchMessage] can not do pause')
    }


    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    this.playPromise.then(pause.bind(this))
    function pause() {
      // DEBUG:
      count = 0

      this.media.pause()

      this.ws.pause()

      this._pause = true
      this.playing = false

      if (this.onPause) {
        try {
          this.onPause()
        } catch (e) {
          logger.error('Error ' + e.name + ':' + e.message + '\n' + e.stack)
        }
      }
    }

    function canPause() {
      if (
        this._pause ||
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

  setTracks(tracks) {
    if (!this.mediaInfo) {
      logger.warn('Media info did not loaded. Should try after onMediaInfo triggered or inside.')
      return
    }

    if (!Array.isArray(tracks)) {
      logger.error('tracks should be an Array instance: ["v1", "a1"]')
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

    this.ws.setTracks(videoTracksStr, audioTracksStr)

    this.videoTrack = videoTracksStr
    this.audioTrack = audioTracksStr
    this._setTracksFlag = true
    this.waitForInitFrame = true
  }

  /**
   *
   *  Private members
   *
   */

  _play(from, videoTrack, audioTack) {
    return new Promise((resolve, reject) => {
      this.onStartStalling() // switch off at progress checker
      if (this.playing) {
        const message = '[mse-player] _play: terminate because already has been playing'
        logger.log(message)
        return resolve({message})
      }

      if (this._pause && !this.afterSeekFlag) {
        this._resume()
        logger.log('_play: terminate because _paused and should resume')
        return resolve()
      }

      // TODO: to observe this case, I have no idea when it fired
      if (!this.mediaSource) {
        this.onAttachMedia({media: this.media})
        this.onsoa = this._play.bind(this, from, videoTrack, audioTack)
        this.mediaSource.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onsoa)
        logger.warn('mediaSource did not create')
        this.resolveThenMediaSourceOpen = this.resolveThenMediaSourceOpen
          ? this.resolveThenMediaSourceOpen
          : resolve
        this.rejectThenMediaSourceOpen = this.rejectThenMediaSourceOpen
            ? this.rejectThenMediaSourceOpen
            : reject
        return
      }

      // deferring execution
      if (this.mediaSource && this.mediaSource.readyState !== 'open') {
        logger.warn('readyState is not "open"')
        this.shouldPlay = true
        this.resolveThenMediaSourceOpen = this.resolveThenMediaSourceOpen
          ? this.resolveThenMediaSourceOpen
          : resolve
        this.rejectThenMediaSourceOpen = this.rejectThenMediaSourceOpen
          ? this.rejectThenMediaSourceOpen
          : reject
        return
      }

      this.playTime = from
      this.videoTrack = videoTrack
      this.audioTack = audioTack
      this._pause = false

      this.ws.start(this.url, this.playTime, this.videoTrack, this.audioTack)

      // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
      this.playPromise = this.media.play()
      this.startProgressTimer()

      this.playPromise.then(() => {
        if (this.resolveThenMediaSourceOpen) {
          this.playing = true
          this.resolveThenMediaSourceOpen()
          this.resolveThenMediaSourceOpen = void 0
          this.rejectThenMediaSourceOpen = void 0
        }
      }, () => {
        if (this.rejectThenMediaSourceOpen) {
          this.playing = false
          this.rejectThenMediaSourceOpen()
          this.resolveThenMediaSourceOpen = void 0
          this.rejectThenMediaSourceOpen = void 0
        }
      })
      return this.playPromise
    })
  }

  init() {
    // start new implementation
    // this.segments = [] // sbc
    // this.sourceBuffer = {} // sbc
    // this.flushRange = [];
    // this.appended = 0;
    // end new inplementation

    this._pause = false
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
    // DEBUG:
    count = 0

    this.ws.resume()
    // this.playPromise = this.media.play()
    // this._pause = false
    // this.playing = true
  }

  onMediaDetaching() {
    if (this.stopRunning) {
      logger.warn('stop is running.')
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
    logger.info('media source detaching')

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
    this.ws.destroy()

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
    URL.revokeObjectURL(this.media.src)
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
      //Media Source listeners

      this.onmse = this.onMediaSourceEnded.bind(this)
      this.onmsc = this.onMediaSourceClose.bind(this)

      ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_ENDED, this.onmse)
      ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc)
      // link video and media Source
      media.src = URL.createObjectURL(ms)

      this.oncvp = mseUtils.checkVideoProgress(media, this).bind(this)
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
      logger.info(
        `readyState now is ${this.mediaSource.readyState}, and will be played`,
        this.playTime,
        this.audioTack,
        this.videoTrack
      )
      this.shouldPlay = false
      this._play(this.playTime, this.audioTack, this.videoTrack)
    }
  }

  dispatchMessage(e) {
    // if (this._pause || !this.playing) {
    //   debugger
    // }

    if (this.stopRunning) {
      return
    }

    const rawData = e.data
    const isDataAB = rawData instanceof ArrayBuffer

    const parsedData = !isDataAB ? JSON.parse(rawData) : void 0

    // count < 10 && logger.log('%c[dispatchMessage]', 'background: aqua;',
    //   isDataAB
    //     ? 'arrayBuffer'
    //     : `${parsedData.type}`,
    //   parsedData && parsedData.type === EVENT_SEGMENT
    //     ? `${parsedData.event}`
    //     : '-',
    //
    // )

    try {
      if (!isDataAB && parsedData.type === EVENT_SEGMENT
          && parsedData[EVENT_SEGMENT] === WS_EVENT_RESUMED) {
        logger.log(`%cEvent ${parsedData.event}`, 'background: purple;', parsedData)
        if (this._pause && !this.playing) {
          this._pause = false
          this.playing = true
          // wait for "progress" event, for shift currentTime and
          // start playing
          if (this.onStartStalling) {
            this.onStartStalling()
          }
          // if (this.media.paused) {
            // this.playPromise = this.media.play()
            // this.playPromise.then(() => {
            //   // debugger
            //   const bufferedEnd = this.media.buffered.end(this.media.buffered.length - 1)
            //   this.media.currentTime = bufferedEnd
            // })
          // }
        }
        return
      }

      if (!isDataAB && parsedData.type === EVENT_SEGMENT
          && parsedData[EVENT_SEGMENT] === WS_EVENT_PAUSED) {
        logger.log(`%cEvent ${parsedData.event}`, 'background: purple;', parsedData)
        return
      }

      if (this._pause && isDataAB) {
        count < 10 && logger.log('[dispatchMessage] frames after pause')
        return
      }

      if (!isDataAB && parsedData.type === EVENT_SEGMENT) {
        logger.log(`%cEvent ${parsedData.event}`, 'background: purple;', parsedData)
      }

      // after seek can receive old frames, it should be filtered
      if (this.isOldFrameAfterSeek(rawData)) {
        return
      }


      // wait for MSE_INIT_SEGMENT
      if (this.waitForInitFrame && isDataAB) {
        return logger.log('old frames')
      }

      // MSE_INIT_SEGMENT
      if (!isDataAB && parsedData.type === MSE_INIT_SEGMENT) {
        logger.log(`%c${MSE_INIT_SEGMENT}`, 'background: aqua;', parsedData)
        this.procInitSegment(rawData)
        return
      }

      // ArrayBuffer data
      if (isDataAB) {
        // if (count < 10 && ++count) {
        //   logger.log(`%cArrayBuffer data`, 'background: burlywood;', parsedData)
        // }
        this.sb.procArrayBuffer(rawData)
        // const segment = this.rawDataToSegmnet(rawData)
        // this.segments.push(segment)
        // this.doArrayBuffer()
      }

    } catch (err) {
      logger.error(mseUtils.errorMsg(e), err)

      if (this.media && this.media.error) {
        logger.error('MediaError:', this.media.error)
      }

      if (isDataAB) {
        logger.error('Data:', mseUtils.debugData(e.data))
      }
      errorsCount++
      if (errorsCount >= this.opts.errorsBeforeStop) {
        errorsCount = 0
        this.stopPromise = this.stop()
      }

      if (this.onError) {
        this.onError(err, e)
      }
    }
  }

  isOldFrameAfterSeek(rawData) {
    if (this.seekValue) {
      let cUtc = 0
      let isDataAB = rawData instanceof ArrayBuffer

      if (!isDataAB) {
        logger.log('not Array buffer')
        return false
      }

      cUtc = mseUtils.getRealUtcFromData(mseUtils.RawDataToUint8Array(rawData))

      if (Math.abs(cUtc - this.seekValue) > 20) {
        logger.warn('%cskip old frame', 'background: orange;',
          mseUtils.humanTime(cUtc), mseUtils.humanTime(this.seekValue),
          cUtc, this.seekValue, cUtc - this.seekValue)
        return true
      } else {
        this.seekNormCount = this.seekNormCount
          ? this.seekNormCount + 1
          : 1
      }

      if (this.seekNormCount > 10) {
        this.seekValue = void 0
        this.seekNormCount = 0
      }
    }
    return false
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
      this.media.pause()
      this.previouslyPaused = false
      this._setTracksFlag = true
      this.immediateSwitch = true
      const startOffset = 0
      const endOffset = Infinity
      // TODO: should invoke remove method of SourceBuffer's
      this.sb.flushRange.push({ start: startOffset, end: endOffset, type: void 0 });
      // attempt flush immediately
      this.sb.flushBufferCounter = 0;
      this.sb.doFlush()
    }

    // calc this.audioTrackId this.videoTrackId
    this.sb.setTracksByType(data)


    const metadata = data.metadata
    const streams = data.metadata.streams

    const activeStreams = {
      video: streams[this.sb.videoTrackId - 1]['track_id'],
      audio: streams[this.sb.audioTrackId - 1]['track_id'],
    }

    this.doMediaInfo({...metadata, activeStreams})
    logger.log(data)

    if (this.mediaSource && !this.mediaSource.sourceBuffers.length) {
      this.sb.setMediaSource(this.mediaSource)
      this.sb.createSourceBuffers(data)
    }
    this.sb.createTracks(data.tracks)
  }

  doMediaInfo(metadata) {
    logger.log(metadata)
    if (this.onMediaInfo) {
      this.mediaInfo = metadata
      try {
        this.onMediaInfo(metadata)
      } catch (e) {
        logger.error(mseUtils.errorMsg(e))
      }
    }
  }

  getVideoTracks() {
    if (!this.mediaInfo) {return}
    return this.mediaInfo.streams
      .filter(s => s.content === TYPE_CONTENT_VIDEO)
  }

  getAudioTracks() {
    if (!this.mediaInfo) {return}
    return this.mediaInfo.streams
      .filter(s => s.content === TYPE_CONTENT_AUDIO)
  }

  /**
   * on immediate level switch end, after new fragment has been buffered:
   * - nudge video decoder by slightly adjusting video currentTime (if currentTime buffered)
   * - resume the playback if needed
   */
  immediateLevelSwitchEnd () {
    const media = this.media
    if (media && media.buffered.length) {
      this.immediateSwitch = false
      // if (BufferHelper.isBuffered(media, media.currentTime)) {
        // only nudge if currentTime is buffered
        // media.currentTime -= 0.0001;
      // }
      if (!this.previouslyPaused) {
        media.play()
      }
    }
  }

  onStartStalling() {
    if (this.opts.onStartStalling) {
      this.opts.onStartStalling()
    }
    this._stalling = true
    logger.log('[dispatchMessage] onStartStalling')
  }

  onEndStalling() {
    if (this.opts.onEndStalling) {
      this.opts.onEndStalling()
    }
    this._stalling = false
    logger.log('[dispatchMessage] onEndStalling')
  }

  startProgressTimer() {
    this.timer = setInterval(this.onTimer.bind(this), this.opts.progressUpdateTime)
  }

  endProgressTimer() {
    clearInterval(this.timer)
    this.timer = void 0
  }

  onTimer() {
    if (!this.playing && this._pause) {
      logger.log('[dispatchMessage] onTimer')
    }

    // #TODO explain
    if (this.immediateSwitch) {
      this.immediateLevelSwitchEnd()
    }

    if (this.sb.lastLoadedUTC === this.utcPrev) {
      logger.log('%c!!!!', 'background: orange;', this.sb.lastLoadedUTC, this.utcPrev, this._stalling)
      return
    }

    if (this._stalling) {
      logger.log('%c[dispatchMessage] •••Stalling•••', 'background: lightred;')
      return
    }

    this.utcPrev = this.sb.lastLoadedUTC

    if (!this.onProgress) {return}
    try {
      this.onProgress(this.sb.lastLoadedUTC)
    } catch (e) {
      logger.error(mseUtils.errorMsg(e))
    }
  }

  onMediaSourceEnded() {
    logger.log('media source ended')
  }

  onMediaSourceClose() {
    logger.log('media source closed')
  }

}
