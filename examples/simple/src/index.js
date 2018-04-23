// import FlussonicMsePlayer from '@flussonic/flussonic-mse-player'
import FlussonicMsePlayer from '../../../dist/FlussonicMsePlayer'

window.onload = onLoad()

function onLoad() {
  const element = document.getElementById('player')
  const streamName = 'aaa'
  const url = `ws://localhost:8080/${streamName}/mse_ld?tracks=v1`

  const videoTracksSelect = document.getElementById('videoTracks')
  const audioTracksSelect = document.getElementById('audioTracks')
  const mbrControls = document.querySelector('.mbr-controls')

  const opts = {
    bufferMode: 'sequence',
    onProgress: currentTime => console.log(currentTime, arguments),
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
    onError: () => {
      if (window.player.stopPromise) {
        window.player.stopPromise.then(() => {
          window.player.setBufferMode('segments')
          window.player.play()
        })

      }
    },
  }

  window.player = new FlussonicMsePlayer(element, url, opts)

  window.setTracks = () => {
    const videoTrackId = videoTracksSelect.options[videoTracksSelect.selectedIndex].value
    const audioTrackId = audioTracksSelect.options[audioTracksSelect.selectedIndex].value
    window.player.setTracks([videoTrackId, audioTrackId])
  }

  window.seek = () => {
    const element = document.getElementById('seek')
    let value
    if (!element || element instanceof HTMLInputElement) {
      value = parseInt(element.value, 10)
      value = value > 0 ? value : void 0
    }
    if (value) {
      window.player.seek(value)
    } else throw new Error('incorrect input!')
  }
}
