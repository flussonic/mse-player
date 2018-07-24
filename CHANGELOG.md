18.07.02

- MediaInfo include active streams information
- add transform-object-rest-spread babel plugin
- documentation: `opts:debug`, `MediaInfo`, `TrackId`,. Remove/mark as deprecated `opts:bufferMode`

18.07

- Switching levels(tracks) without detaching MediaSource. Now lib once create 'video' sourcebuffer and 'audio' one. And when invoke setTracks method or receive MSE_INIT_SEGMENT just flush(remove) sourcebuffers and start append new data.

- Add `debug` param. If it `true` then enable logs to console
