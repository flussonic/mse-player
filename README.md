# flussonic-mse-player

flussonic-mse-player is a JavaScript library for playing video relies on flussonic backend, HTML5 video and MediaSource Extensions


## Installation

```
npm install --save @flussonic/flussonic-mse-player
```

## Usage

### Construction:

```
const player = new FlussonicMsePlayer(element, url, opts)
```

element - <video> DOM element
url - url of a stream
opts
  onProgress(utc: number) - triggered every 100ms while a stream is playing and gives current playback time
  onMediaInfo(info: MediaInfo) - triggered then metadata of the stream is available. metadata include a common information of the stream such as width, height, information about mbr streams and so on. After this callback triggered you can use getVideoTracks()/getAudioTracks() methods.


### Methods:

play() - start playing

pause() -

stop() - stop playing

seek(utc: number) - seek

setTracks(tracks: Array<Track>)

### Types:

MediaInfo {
  height: number,
  width: number,
  streams: Array<StreamInfo>,
}

StreamInfo {
  bitrate : number,
  codec :  string,
  content :  string,
   fps :  number,
  height :  number,
  length_size :  number,
  level :  string,
  pixel_height :  number,
  pixel_width :  number,
  profile : "Baseline" 
  sar_height :  number, 
  sar_width :  number, 
  size :  string,
  track_id :  string,
  width :  number
}

Track: string