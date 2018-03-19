import FlussonicMsePlayer from '@flussonic/flussonic-mse-player'
window.onload = onLoad()

function onLoad() {
  const element = document.getElementById('player')
  const url = 'ws://localhost:8080/clock/mse_ld'
  const videoTracksSelect = document.getElementById('videoTracks')
  const audioTracksSelect = document.getElementById('audioTracks')
  const mbrControls = document.querySelector('.mbr-controls')
  window.player = new FlussonicMsePlayer(element, url)

  window.player.onProgress = (currentTime) => void 0 //console.log(currentTime)

  window.player.onMediaInfo = (rawMetaData) => {
    const videoTracks = window.player.getVideoTracks()
    const audioTracks = window.player.getAudioTracks()
    const videoOptions = videoTracks.map((v, i) => (
      `<option value="${v['track_id']}">${v['bitrate']} ${v['codec']} ${v['fps']} ${v['width']}x${v['height']}</option>`
    ))

    const audioOptions = audioTracks.map(v => (
      `<option value="${v['track_id']}">${v['bitrate']} ${v['codec']} ${v['lang']}</option>`
    ))

    videoTracksSelect.innerHTML = videoOptions.join('')
    audioTracksSelect.innerHTML = audioOptions.join('')

    mbrControls.style.display = 'block'
  }

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