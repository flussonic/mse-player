# flussonic-mse-player

flussonic-mse-player is a JavaScript library for playing video relies on flussonic backend, HTML5 video and MediaSource Extensions


## Installation

```
npm install --save @flussonic/flussonic-mse-player
```

## Usage

#### Webpack:

```javascript
import FlussonicMsePlayer from '@flussonic/flussonic-mse-player'
...
const player = new FlussonicMsePlayer(element, url, opts)
```

[example](https://github.com/flussonic/mse-player/tree/master/examples/simple)

#### Script tag:

Since the library include via script tag it is accesible at `window.FlussonicMsePlayer`

```html
<script type="text/javascript" src="../../dist/FlussonicMsePlayer.js"></script>
```

```javascript
var FlussonicMsePlayer = window.FlussonicMsePlayer
var player = new FlussonicMsePlayer(element, url, opts)
```

[example](https://github.com/flussonic/mse-player/tree/master/examples/scripttag)

### Static Methods:

- **isSupported()** - return `true` if browser is supported Media Source Extension

-  **replaceHttpByWS(url: string)** - return new url where replaced http(s):// by ws(s)://

### Construction:

```javascript
const player = new FlussonicMsePlayer(element, url, opts)
```

`element` - <video> DOM element

`url` - url of a stream

`opts` is plain object it can include methods:

  - `debug?: boolean` - if `true` then enable logs in browser console. And export methods humanTime, humanDate to window.

  - `progressUpdateTime?: number` - time period for invoking `onProgress`.

  - `connectionRetries?: number` - number of reconnection retries if player can't start playback.

  - `wsReconnect?: boolean` - trying to restart websocket connection on error closing.

  - `preferHQ?: boolean` - if `true`, player will automatically select the highest available quality of the stream.

  - `retryMuted?: boolean` - if `true`, in some cases, due to "Browser Autoplay Policy Changes" it will try to restart playing process with initialy muted video element.

  - `maxBufferDelay?: number` - maxBufferDelay option for sourceBuffer

  - `onProgress(utc: number)` - triggered every 100ms(progressUpdateTime) while a stream is playing and gives current playback time

  - `onMediaInfo(info: MediaInfo)` - triggered when metadata of the stream is available. metadata include a common information of the stream such as width, height, information about mbr streams and so on. After this callback triggered you can use getVideoTracks()/getAudioTracks() methods.

  - `onDisconnect(status: object)` - triggered on websocket connection lost.

  - `onError(error: object)` - triggered on player errors.

  - `onEvent(event: object)` - triggered on player events.

  - `onMuted()` - triggered on player set muted.

  - `onPause()` - triggered on player set paused.

  - `onResume()` - triggered on player gets resumed from pause.

  - `onStats(stats: object)` - triggered on player stats change. Stats include a common ststistics of the stream: endTime, currentTime, videoBuffer, audioBuffer, timestamp, readyState, networkState.

  - `onSeeked()` - triggered when process of seeking is finished

  - `onStartStalling()` - triggered when playing is stalled
  - `onEndStalling()` - triggered when the video tag is progressed(start playing). `onStartStalling()/onEndStalling()` useful callback for implementation loading-spinner.

  - **•••DEPRECATED•••** `bufferMode: 'segments'|'sequence'` - [SourceBuffer Object Append Mode](https://www.w3.org/TR/media-source/#h-sourcebuffer). Default value is `'sequence'`.

  - `errorsBeforeStop: number` - Amount of errors will be happened before invoke the *stop()* method.

### Methods:

- **play(videoTrack?: Track, audioTrack?: Track) => Promise<any>** - start playing.

  Return a `Promise`. Resolved if HTMLMediaElement.play() resolved([HTMLMediaElement.play() Returns a Promise](https://developers.google.com/web/updates/2016/03/play-returns-promise)). Overwise rejected with error message.

  if you do autoplay="true" muted="false" video. The `play` will be rejected([Autoplay Policy Changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes))

  For resolve this behaviour you can mute the video before playing. Or you can process play's rejection and show play button.

- **pause()** - send `pause` command by websocket

- **stop()** - close websocket connection; detach mediaSource from given HTMLMediaElement; invoke the HTMLMediaElement stop method

- **restart()** - perform a full restart of playing process

- **autoTrackSelection(preferBest: boolean) => tracks: Array<TrackId>** - if `true` - returns array with the tracks of highest available quality. If `false` - returns array with the tracks of the lowest available quality.

- **seek(utc: number)** - send `seek` command by websocket

- **setTracks(tracks: Array<TrackId>)** -

### Types:

```flow
type MediaInfo = {
  height: number,
  width: number,
  streams: Array<StreamInfo>,
  activeStreams: ActiveStreams,
}

type StreamInfo = {
  bitrate: number,
  codec: string,
  content: string,
  fps: number,
  height: number,
  length_size: number,
  level: string,
  pixel_height: number,
  pixel_width: number,
  profile: "Baseline",
  sar_height: number,
  sar_width: number,
  size: string,
  track_id: TrackId,
  width: number
}

type ActiveStreams = {
  video: TrackId,
  audio: TrackId,
}

type TrackId = 'a1'|'a2'|'a3'| ... 'aN'|'v1'|'v2'|'v3'| ... 'vN'

type UtcOrLive = number | 'live'

```

## TODO



## CHANGELOG
