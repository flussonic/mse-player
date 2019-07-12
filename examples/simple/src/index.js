// import FlussonicMsePlayer from '@flussonic/flussonic-mse-player'
import {humanTime} from './utils'

window.onload = onLoad()

function onLoad() {
  const element = document.getElementById('player')
  // const streamName = 'clock'
  // const url = `ws://localhost:8080/${streamName}/mse_ld`
  // const url = ' wss://a-machinskiy.erlyvideo.ru/demo/mse_ld'
  const url = 'wss://a-machinskiy.erlyvideo.ru/testNoSound/mse_ld'
  // const url = 'wss://a-machinskiy.erlyvideo.ru/testSound/mse_ld'
  // const url = `ws://127.0.0.1:7101/live1/mse_ld`
  // const url = `ws://127.0.0.1:7101/transcode1/mse_ld`
  // const url = `ws://127.0.0.1:7121/restream1/mse_ld`

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
    // onDisconnect: (status) => {
    //   console.log('Websocket status:', status)
    // },
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
      console.trace('••••• ERRROR', err)
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
