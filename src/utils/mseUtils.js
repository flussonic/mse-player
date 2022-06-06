import { logger } from '../utils/logger';

export function getMediaSource() {
  if (typeof window !== 'undefined') {
    return window.MediaSource || window.WebKitMediaSource;
  }
}

export function isAndroid() {
  const ua = navigator.userAgent;
  return ua.indexOf('Android') !== -1;
}

export function isSupportedMSE() {
  // https://bugs.chromium.org/p/chromium/issues/detail?id=539707
  if (isAndroid()) {
    return false;
  }
  const mediaSource = getMediaSource();
  const sourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer;
  const isTypeSupported =
    mediaSource &&
    typeof mediaSource.isTypeSupported === 'function' &&
    mediaSource.isTypeSupported('video/mp4; codecs="avc1.4d401f,mp4a.40.2"');

  // if SourceBuffer is exposed ensure its API is valid
  // safari and old version of Chrome doe not expose SourceBuffer globally so checking SourceBuffer.prototype is impossible
  const sourceBufferValidAPI =
    !sourceBuffer ||
    (sourceBuffer.prototype &&
      typeof sourceBuffer.prototype.appendBuffer === 'function' &&
      typeof sourceBuffer.prototype.remove === 'function');
  return !!isTypeSupported && !!sourceBufferValidAPI;
}

export function base64ToArrayBuffer(base64) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export function RawDataToUint8Array(rawData) {
  // 12,4 = mfhd;20,4 slice - segment.id;36,4 = tfhd;44,4 slice - track.id;64,4 = tfdt
  // 72,8 slice - prestime;84,4 = futc;92,8 slice - real utc;104,4 = trun
  return new Uint8Array(rawData);
}

export function getTrackId(data) {
  return data[47];
}

export function getRealUtcFromData(view) {
  const pts1 = (view[92] << 24) | (view[93] << 16) | (view[94] << 8) | view[95];
  const pts2 = (view[96] << 24) | (view[97] << 16) | (view[98] << 8) | view[99];
  const realUtc = pts1 + pts2 / 1000000;
  return realUtc;
}

export function doArrayBuffer(segment) {
  if (!segment.isInit) {
    // last loaded frame's utc
    this.utc = getRealUtcFromData(segment.data);
    this.lastLoadedUTC = this.utc;
  }

  // this.maybeAppend(segment, isVideo)
}

export function debugData(rawData) {
  // const view = RawDataToUint8Array(rawData)
  const view = new Uint8Array(rawData);
  const trackId = getTrackId(view);
  const utc = getRealUtcFromData(view);

  return { trackId, utc, view };
}

export const checkVideoProgress = (media, player) => () => {
  const {
    currentTime: ct,
    buffered,
    buffered: { length: l },
  } = media;

  const debounce = function (func, wait, immediate) {
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  const removeBufferRange = (type, sb, startOffset, endOffset) => {
    try {
      for (let i = 0; i < sb.buffered.length; i++) {
        let bufStart = sb.buffered.start(i);
        let bufEnd = sb.buffered.end(i);
        let removeStart = Math.max(bufStart, startOffset);
        let removeEnd = Math.min(bufEnd, endOffset);

        /* sometimes sourcebuffer.remove() does not flush
          the exact expected time range.
          to avoid rounding issues/infinite loop,
          only flush buffer range of length greater than 500ms.
        */
        if (Math.min(removeEnd, bufEnd) - removeStart > 0.5) {
          // let currentTime = 'null';
          // if (media) {
          //   currentTime = media.currentTime.toString();
          // }
          if (sb.updating) {
            return;
          }
          // logger.log(`sb remove ${type} [${removeStart},${removeEnd}], of [${bufStart},${bufEnd}], pos:${currentTime}`)
          sb.remove(removeStart, removeEnd);
          return true;
        }
      }
    } catch (error) {
      logger.warn('removeBufferRange failed', error);
    }

    return false;
  };

  if (player) {
    const { sourceBuffer } = player.sb;
    const bufferTypes = Object.keys(sourceBuffer);
    const targetBackBufferPosition = ct - 30;

    for (let index = bufferTypes.length - 1; index >= 0; index--) {
      const bufferType = bufferTypes[index];
      const sb = sourceBuffer[bufferType];
      if (sb) {
        const buffered = sb.buffered;
        // when target buffer start exceeds actual buffer start
        if (buffered.length > 0 && targetBackBufferPosition > buffered.start(0)) {
          // remove buffer up until current time minus minimum back buffer length (removing buffer too close to current
          // time will lead to playback freezing)
          // credits for level target duration - https://github.com/videojs/http-streaming/blob/3132933b6aa99ddefab29c10447624efd6fd6e52/src/segment-loader.js#L91
          debounce(removeBufferRange(bufferType, sb, 0, targetBackBufferPosition), 100);
        }
      }
    }
  }

  if (player.media.readyState <= 2 && player.media.networkState === 2) {
    player.onStartStalling();
  } else if (player.media.readyState > 2) {
    player.onEndStalling();
  }

  if (!l) {
    return;
  }
  const endTime = buffered.end(l - 1);
  const delay = Math.abs(endTime - ct);
  // if (player._stalling) {
  //   // player.onEndStalling()
  //   // если поставлена пауза
  //   if (media.paused && player._pause && !player.playing) {
  //     media.currentTime = endTime - 0.0001
  //     player.playPromise = media.play()
  //     player.playPromise
  //       .then(() => {
  //         player._pause = false
  //         player.playing = true
  //       })
  //       .catch(() => {
  //         return
  //       })
  //   }
  // }

  if (player.playerStatsObject) {
    player.playerStatsObject.bytes = player.sb.totalBytesCollected;
    player.playerStatsObject.updated_at = Date.now();
    if (player.playing) {
      if (player.playbackSegmentStart) {
        const { application: playerIns } = player.playerStatsObject;
        if (playerIns) {
          const vQuality = player.media.getVideoPlaybackQuality();
          const { corruptedVideoFrames, droppedVideoFrames, totalVideoFrames } = vQuality;
          let { live_duration } = playerIns;
          live_duration += player.playerStatsObject.updated_at - player.playbackSegmentStart;
          player.addPlayerStat('live_duration', false, live_duration);
          player.addPlayerStat('total_video_frames', false, totalVideoFrames);
          player.addPlayerStat('dropped_video_frames', false, droppedVideoFrames);
          player.addPlayerStat('corrupted_video_frames', false, corruptedVideoFrames);
        }
      }
      player.playbackSegmentStart = player.playerStatsObject.updated_at;
    }

    player.addStat({
      updated_at: player.playerStatsObject.updated_at,
      bytes: player.sb.totalBytesCollected,
    });
  }

  if (delay <= player.opts.maxBufferDelay) {
    return;
  }

  logger.log('nudge', ct, '->', l ? endTime : '-', ct - endTime); //evt, )
  media.currentTime = endTime - 0.2; // (Math.abs(ct - endTime)) //
};

export const replaceHttpByWS = (url) => url.replace(/^http/, 'ws');

export const errorMsg = (e) => `Error ${e.name}: ${e.message}\n${e.stack}`;

export function pad2(n) {
  return n <= 9 ? '0' + n : '' + n;
}

export function humanTime(utcOrLive, lt = true) {
  // $FlowFixMe: string > 0 is always false
  if (!(utcOrLive > 0)) {
    return '';
  }

  // $FlowFixMe: just for flow
  const utc = utcOrLive;

  let d = new Date();
  d.setTime(utc * 1000);
  let localTime = !(lt === false);

  let h = localTime ? d.getHours() : d.getUTCHours();
  let m = localTime ? d.getMinutes() : d.getUTCMinutes();
  let s = localTime ? d.getSeconds() : d.getUTCSeconds();

  return pad2(h) + ':' + pad2(m) + ':' + pad2(s);
}

export function logDM(isDataAB, parsedData) {
  if (parsedData) {
    logger.log(
      `%c ${parsedData.type} ${parsedData.type === 'event' ? parsedData.event : 'mse_init_segment'}`,
      'background: aquamarine;',
      parsedData
    );
  }
}

let errorsCount = 0;

export function showDispatchError(e, err = '') {
  if ('data' in e) {
    const rawData = e.data;
    const isDataAB = rawData instanceof ArrayBuffer;
    if (isDataAB) {
      logger.error('Data:', debugData(e.data));
    }
  }

  logger.error(errorMsg(e), err);

  if (this.media && 'error' in this.media) {
    logger.error('MediaError:', this.media.error);
  }

  errorsCount++;

  if (errorsCount >= this.opts.errorsBeforeStop) {
    errorsCount = 0;
    this.stopPromise = this.stop();
  }

  if (this.onError) {
    this.onError(err, e);
  }
}

/*
 * debug staff, after each operation you should
 * set count to 0, if you want show info about
 * ArrayBuffer frames
 */
// let count = 0
