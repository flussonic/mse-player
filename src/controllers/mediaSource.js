import {logger, enableLogs} from '../utils/logger';

export default class MediaSourceController {
  constructor(opts) {
    logger.log('create BuffersController');
  }

  onAttachMedia(data) {
    this.media = data.media;
    const media = this.media;
    if (!(media instanceof HTMLMediaElement)) {
      throw new Error(MSG.NOT_HTML_MEDIA_ELEMENT);
    }
    if (media) {
      // setup the media source
      const ms = (this.mediaSource = new MediaSource());
      //Media Source listeners

      this.onmse = this.onMediaSourceEnded.bind(this);
      this.onmsc = this.onMediaSourceClose.bind(this);

      ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_ENDED, this.onmse);
      ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc);
      // link video and media Source
      media.src = URL.createObjectURL(ms);

      this.oncvp = mseUtils.checkVideoProgress(media, this).bind(this);
      this.media.addEventListener(EVENTS.MEDIA_ELEMENT_PROGRESS, this.oncvp);
      return new Promise((resolve) => {
        this.onmso = this.onMediaSourceOpen.bind(this, resolve);
        ms.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onmso);
      });
    }
  }

  play() {
    // TODO: to observe this case, I have no idea when it fired
    if (!this.mediaSource) {
      this.onAttachMedia({media: this.media});
      this.onsoa = this._play.bind(this, from, videoTrack, audioTack);
      this.mediaSource.addEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onsoa);
      logger.warn('mediaSource did not create');
      this.resolveThenMediaSourceOpen = this.resolveThenMediaSourceOpen ? this.resolveThenMediaSourceOpen : resolve;
      this.rejectThenMediaSourceOpen = this.rejectThenMediaSourceOpen ? this.rejectThenMediaSourceOpen : reject;
      return;
    }

    // deferring execution
    if (this.mediaSource && this.mediaSource.readyState !== 'open') {
      logger.warn('readyState is not "open"');
      this.shouldPlay = true;
      this.resolveThenMediaSourceOpen = this.resolveThenMediaSourceOpen ? this.resolveThenMediaSourceOpen : resolve;
      this.rejectThenMediaSourceOpen = this.rejectThenMediaSourceOpen ? this.rejectThenMediaSourceOpen : reject;
      return;
    }
  }

  onMediaSourceOpen(resolve) {
    resolve();
    let mediaSource = this.mediaSource;
    if (mediaSource) {
      // once received, don't listen anymore to sourceopen event
      mediaSource.removeEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onmso);
    }

    // play was called but stoped and was pend(1.readyState is not open)
    // and time is come to execute it
    if (this.shouldPlay) {
      logger.info(
        `readyState now is ${this.mediaSource.readyState}, and will be played`,
        // this.playTime,
        this.audioTack,
        this.videoTrack
      );
      this.shouldPlay = false;
      this._play(/*this.playTime, */ this.audioTack, this.videoTrack);
    }
  }

  removeMediaSource() {
    const ms = this.mediaSource;
    if (ms) {
      if (ms.readyState === 'open') {
        try {
          // endOfStream could trigger exception if any sourcebuffer is in updating state
          // we don't really care about checking sourcebuffer state here,
          // as we are anyway detaching the MediaSource
          // let's just avoid this exception to propagate
          ms.endOfStream();
        } catch (err) {
          logger.warn(`onMediaDetaching:${err.message} while calling endOfStream`);
        }
      }

      ms.removeEventListener(EVENTS.MEDIA_SOURCE_SOURCE_OPEN, this.onmso);
      ms.removeEventListener(EVENTS.MEDIA_SOURCE_SOURCE_ENDED, this.onmse);
      ms.removeEventListener(EVENTS.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc);
      this.onmso = null;
      this.onmse = null;
      this.onmsc = null;
    }

    // Detach properly the MediaSource from the HTMLMediaElement as
    // suggested in https://github.com/w3c/media-source/issues/53.
    URL.revokeObjectURL(this.media.src);
    this.media.removeAttribute('src');
    this.media.load();
  }
}
