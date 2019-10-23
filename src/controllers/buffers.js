import {doArrayBuffer, base64ToArrayBuffer, RawDataToUint8Array, getTrackId} from '../utils/mseUtils'
import {logger} from '../utils/logger'

import {AUDIO, VIDEO} from '../enums/common'
import {BUFFER_UPDATE_END} from '../enums/events'

const BUFFER_MODE_SEQUENCE = 'sequence' // segments

export default class BuffersController {
  constructor(opts = {}) {
    logger.log('create BuffersController')
    this.media = opts.media
    this.init(opts)

    this.doArrayBuffer = doArrayBuffer.bind(this)
    this.maybeAppend = this.maybeAppend.bind(this)
    this.onSBUpdateEnd = this.onSBUpdateEnd.bind(this)
    this.onAudioSBUpdateEnd = this.onAudioSBUpdateEnd.bind(this)
  }

  init(opts = {}) {
    this.flushRange = []
    this.appended = 0
    this.mediaSource = opts.mediaSource
    // this.segments = []
    this.segmentsVideo = []
    this.segmentsAudio = []
    this.sourceBuffer = {}
  }

  setMediaSource(ms) {
    this.mediaSource = ms
  }

  createSourceBuffers(data) {
    const sb = this.sourceBuffer
    data.tracks.forEach(s => {
      const isVideo = s.content === VIDEO
      const mimeType = isVideo ? 'video/mp4; codecs="avc1.4d401f"' : 'audio/mp4; codecs="mp4a.40.2"'

      sb[s.content] = this.mediaSource.addSourceBuffer(mimeType)
      // sb[s.content].timestampOffset = 0.25
      const buffer = sb[s.content]
      if (isVideo) {
        buffer.addEventListener(BUFFER_UPDATE_END, this.onSBUpdateEnd)
      } else {
        buffer.addEventListener(BUFFER_UPDATE_END, this.onAudioSBUpdateEnd)
      }
    })
  }

  onSBUpdateEnd() {
    if (this._needsFlush) {
      logger.log('flushing buffer')
      this.doFlush()
    }

    if (this._needsEos) {
      this.checkEos()
    }

    if (!this._needsFlush && this.segmentsVideo.length) {

      const buffer = this.sourceBuffer.video
      if (buffer) {
        if (buffer.updating) {
          return
        }
        const segment = this.segmentsVideo[0]
        buffer.appendBuffer(segment.data)
        this.segmentsVideo.shift()
        this.appended++
      }
    }
  }

  onAudioSBUpdateEnd() {
    if (this._needsFlush) {
      logger.log('flushing buffer')
      this.doFlush()
    }

    if (this._needsEos) {
      this.checkEos()
    }

    if (!this._needsFlush && this.segmentsAudio.length) {

      const buffer = this.sourceBuffer.audio
      if (buffer) {
        if (buffer.updating) {
          return
        }
        const segment = this.segmentsAudio[0]
        buffer.appendBuffer(segment.data)
        this.segmentsAudio.shift()
        this.appended++
      }
    }
  }

  createTracks(tracks) {
    tracks.forEach(track => {
      const view = base64ToArrayBuffer(track.payload)
      const segment = {
        type: this.getTypeBytrackId(track.id),
        isInit: true,
        data: view,
      }
      this.maybeAppend(segment)
    })
  }

  maybeAppend(segment) {
    if (this._needsFlush) {
      // this.segments.unshift(segment)
      return
    }
    if (!this.media || this.media.error) {
      if (segment.type === 'audio') {
        this.segmentsAudio = []
      } else {
        this.segmentsVideo = []
      }
      logger.error('trying to append although a media error occured, flush segment and abort')
      return
    }
    const buffer = this.sourceBuffer[segment.type]
    if (buffer) {
      if (buffer.updating) {
        // this.segments.unshift(segment)
        return
      }

      buffer.appendBuffer(segment.data)
      if (segment.type === 'audio') {
        this.segmentsAudio.shift()
      } else {
        this.segmentsVideo.shift()
      }
      this.appended++
    }
  }

  setTracksByType(data) {
    const type = data.tracks ? 'tracks' : 'streams'
    if (data[type].length === 1) {
      this.audioTrackId = null
    }
    data[type].forEach(s => {
      this[s.content === VIDEO ? 'videoTrackId' : 'audioTrackId'] = s.id
    })
  }

  getTypeBytrackId(id) {
    return this.audioTrackId === id ? AUDIO : VIDEO
  }

  procArrayBuffer(rawData) {
    const segment = this.rawDataToSegmnet(rawData)
    if (segment.type === 'audio') {
      this.segmentsAudio.push(segment)
    } else {
      this.segmentsVideo.push(segment)
    }

    this.doArrayBuffer(segment)
    if (this.sourceBuffer) {
      if (this.sourceBuffer.video && !this.sourceBuffer.video.updating) {
        this.onSBUpdateEnd()
      }
      if (this.sourceBuffer.audio && !this.sourceBuffer.audio.updating) {
        this.onAudioSBUpdateEnd()
      }
    }
  }

  seek() {
    for (let k in this.sourceBuffer) {
      this.sourceBuffer[k].abort()
      this.sourceBuffer[k].mode = BUFFER_MODE_SEQUENCE
    }

    this.segmentsVideo = []
    this.segmentsAudio = []
  }

  isBuffered() {
    let appended = 0
    let sourceBuffer = this.sourceBuffer
    for (let type in sourceBuffer) {
      appended += sourceBuffer[type].buffered.length
    }
    return appended > 0
  }

  doFlush() {
    // loop through all buffer ranges to flush
    while (this.flushRange.length) {
      let range = this.flushRange[0]
      // flushBuffer will abort any buffer append in progress and flush Audio/Video Buffer
      if (this.flushBuffer(range.start, range.end, range.type)) {
        // range flushed, remove from flush array
        this.flushRange.shift()
        this.flushBufferCounter = 0
      } else {
        this._needsFlush = true
        // avoid looping, wait for SB update end to retrigger a flush
        return
      }
    }
    if (this.flushRange.length === 0) {
      // everything flushed
      this._needsFlush = false

      // let's recompute this.appended, which is used to avoid flush looping
      let appended = 0
      let sourceBuffer = this.sourceBuffer
      try {
        for (let type in sourceBuffer) {
          appended += sourceBuffer[type].buffered.length
        }
      } catch (error) {
        // error could be thrown while accessing buffered, in case sourcebuffer has already been removed from MediaSource
        // this is harmess at this stage, catch this to avoid reporting an internal exception
        console.error('error while accessing sourceBuffer.buffered')
      }
      this.appended = appended
      this._setTracksFlag = false
    }
  }

  /*
    flush specified buffered range,
    return true once range has been flushed.
    as sourceBuffer.remove() is asynchronous, flushBuffer will be retriggered on sourceBuffer update end
  */
  flushBuffer(startOffset, endOffset, typeIn) {
    let sb,
      i,
      bufStart,
      bufEnd,
      flushStart,
      flushEnd,
      sourceBuffer = this.sourceBuffer
    if (Object.keys(sourceBuffer).length) {
      logger.log(`flushBuffer,pos/start/end: ${this.media.currentTime.toFixed(3)}/${startOffset}/${endOffset}`)
      // safeguard to avoid infinite looping : don't try to flush more than the nb of appended segments
      if (this.flushBufferCounter < this.appended) {
        for (let type in sourceBuffer) {
          // check if sourcebuffer type is defined (typeIn): if yes, let's only flush this one
          // if no, let's flush all sourcebuffers
          if (typeIn && type !== typeIn) {
            continue
          }

          sb = sourceBuffer[type]
          // we are going to flush buffer, mark source buffer as 'not ended'
          sb.ended = false
          if (!sb.updating) {
            try {
              for (i = 0; i < sb.buffered.length; i++) {
                bufStart = sb.buffered.start(i)
                bufEnd = sb.buffered.end(i)
                // workaround firefox not able to properly flush multiple buffered range.
                if (
                  navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 &&
                  endOffset === Number.POSITIVE_INFINITY
                ) {
                  flushStart = startOffset
                  flushEnd = endOffset
                } else {
                  flushStart = Math.max(bufStart, startOffset)
                  flushEnd = Math.min(bufEnd, endOffset)
                }
                /* sometimes sourcebuffer.remove() does not flush
                   the exact expected time range.
                   to avoid rounding issues/infinite loop,
                   only flush buffer range of length greater than 500ms.
                */
                if (Math.min(flushEnd, bufEnd) - flushStart > 0.5) {
                  this.flushBufferCounter++
                  logger.log(
                    `flush ${type} [${flushStart},${flushEnd}], of [${bufStart},${bufEnd}], pos:${this.media.currentTime}`
                  )
                  sb.remove(flushStart, flushEnd)
                  return false
                }
              }
            } catch (e) {
              logger.warn('exception while accessing sourcebuffer, it might have been removed from MediaSource')
            }
          } else {
            // logger.log('abort ' + type + ' append in progress');
            // this will abort any appending in progress
            // sb.abort();
            logger.warn('cannot flush, sb updating in progress')
            return false
          }
        }
      } else {
        logger.warn('abort flushing too many retries')
      }
      logger.log('buffer flushed')
    }
    // everything flushed !
    return true
  }

  rawDataToSegmnet(rawData) {
    const view = new Uint8Array(rawData)
    const trackId = getTrackId(view)
    const trackType = this.getTypeBytrackId(trackId)
    return {type: trackType, data: view}
  }

  // on BUFFER_EOS mark matching sourcebuffer(s) as ended and trigger checkEos()
  onBufferEos(data = {}) {
    let sb = this.sourceBuffer
    let dataType = data.type
    for (let type in sb) {
      if (!dataType || type === dataType) {
        if (!sb[type].ended) {
          sb[type].ended = true
          logger.log(`${type} sourceBuffer now EOS`)
        }
      }
    }
    this.checkEos()
  }

  // if all source buffers are marked as ended, signal endOfStream() to MediaSource.
  checkEos() {
    let sb = this.sourceBuffer,
      mediaSource = this.mediaSource
    if (!mediaSource || mediaSource.readyState !== 'open') {
      this._needsEos = false
      return
    }
    for (let type in sb) {
      let sbobj = sb[type]
      if (!sbobj.ended) {
        return
      }

      if (sbobj.updating) {
        this._needsEos = true
        return
      }
    }
    logger.log('all media data available, signal endOfStream() to MediaSource and stop loading fragment')
    // Notify the media element that it now has all of the media data
    try {
      mediaSource.endOfStream()
    } catch (e) {
      logger.warn('exception while calling mediaSource.endOfStream()')
    }
    this._needsEos = false
  }

  destroy() {
    this.init()
  }
}
