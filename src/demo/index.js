import FlussonicMsePlayer from '../FlussonicMsePlayer.js'
import {humanTime} from './utils'
import {decode} from "querystring";

window.onload = onLoad()

function onLoad() {
  var streamer_ws = 'ws://localhost:8080'
  var stream_name = 'clock'

  // parse query string
  var query = window.location.search
  if (query) {
    var qs = decode(query.replace(/^\?/, ""));
    if(qs.host) {
      streamer_ws = qs.host;
    }
    if(qs.name) {
      stream_name = qs.name;
    }
  }
  var url = streamer_ws + '/' + stream_name + '/mse_ld';

  const element = document.getElementById('player')
  const videoTracksSelect = document.getElementById('videoTracks')
  const audioTracksSelect = document.getElementById('audioTracks')
  const mbrControls = document.querySelector('.mbr-controls')
  const utcLabel = document.getElementById('utc')
  const stallingLabel = document.getElementById('stallingLabel')
  const showStallingIndicator = value => {
    stallingLabel.innerText = '' + value
  }

  let showFirstFrameUTC = false

  const opts = {
    debug:true,
    connectionRetries: 10,
    errorsBeforeStop: 10,
    onStartStalling: () => {
      showStallingIndicator('start stalling')
    },
    onEndStalling: () => {
      showStallingIndicator('stop stalling')
    },
    onSeeked: () => {
      showFirstFrameUTC = true
    },
    onProgress: utc => {
      utcLabel.innerText = humanTime(utc)
      if (showFirstFrameUTC) {
        console.log('%c first frame after action: ' + humanTime(utc) + ' ' + utc, 'background: red')
        showFirstFrameUTC = false
      }
    },
    onDisconnect: (status) => {
      console.log('Websocket status:', status)
    },
    onMediaInfo: rawMetaData => {
      console.log('rawMetaData:', rawMetaData)
      const videoTracks = window.player.getVideoTracks()
      const audioTracks = window.player.getAudioTracks()
      const videoOptions = videoTracks.map(
        (v, i) =>
          `<option value="${v['track_id']}">${v['bitrate']} ${v['codec']} ${v['fps']} ${v['width']}x${
            v['height']
          }</option>`
      )

      const audioOptions = audioTracks.map(
        v => `<option value="${v['track_id']}">${v['bitrate']} ${v['codec']} ${v['lang']}</option>`
      )

      videoTracksSelect.innerHTML = videoOptions.join('')
      audioTracksSelect.innerHTML = audioOptions.join('')

      mbrControls.style.display = 'block'
    },
    onError: err => {
      console.log('••••• ERRROR', err)
    },
  }

  window.player = new FlussonicMsePlayer(element, url, opts)
  window.player
    .play()
    .then(success => {
      console.log('resolve', success)
    })
    .catch(err => {
      console.log(err)
    })

  window.setTracks = () => {
    const videoTrackId = videoTracksSelect.options[videoTracksSelect.selectedIndex].value
    const audioTrackId = audioTracksSelect.options[audioTracksSelect.selectedIndex].value
    console.log({videoTracksSelect}, videoTrackId, audioTrackId)
    window.player.setTracks([videoTrackId, audioTrackId])
  }

  window.seek = () => {
    const element = document.getElementById('seek')
    let value
    if (!element || element instanceof HTMLInputElement) {
      if (element.value === 'live') {
        value = 'live'
      } else {
        value = parseInt(element.value, 10)
        value = value > 0 ? value : void 0
      }
    }
    if (value) {
      window.player.seek(value)
    } else throw new Error('incorrect input!')
  }
}
