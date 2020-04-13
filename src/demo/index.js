import FlussonicMsePlayer from '../FlussonicMsePlayer.js'
import {humanTime} from './utils'
import {decode} from 'querystring'
// import Chart from 'chart.js'

window.onload = onLoad()

function onLoad() {
  let streamer_ws = 'ws://localhost:8080'
  let stream_name = 'clock'

  // parse query string
  let query = window.location.search
  if (query) {
    let qs = decode(query.replace(/^\?/, ''))
    if (qs.host) {
      streamer_ws = qs.host
    }
    if (qs.name) {
      stream_name = qs.name
    }
  }
  let url = streamer_ws + '/' + stream_name + '/mse_ld'

  const element = document.getElementById('player')
  const videoTracksSelect = document.getElementById('videoTracks')
  const audioTracksSelect = document.getElementById('audioTracks')
  const mbrControls = document.querySelector('.mbr-controls')
  const utcLabel = document.getElementById('utc')
  const stallingLabel = document.getElementById('stallingLabel')
  const showStallingIndicator = (value) => {
    stallingLabel.innerText = '' + value
  }

  let showFirstFrameUTC = false

  let graphUTCLabels = []
  // let graphCurrentTime = []
  // let graphBufferedTime = []
  let graphBufferedLength = []
  let mseVideoBufferSize = []
  let mseAudioBufferSize = []

  const opts = {
    debug: true,
    connectionRetries: 0,
    errorsBeforeStop: 10,
    retryMuted: true,
    maxBufferDelay: 5,
    onStartStalling: () => {
      showStallingIndicator('start stalling')
    },
    onEndStalling: () => {
      showStallingIndicator('stop stalling')
    },
    onSeeked: () => {
      showFirstFrameUTC = true
    },
    onProgress: (utc) => {
      utcLabel.innerText = humanTime(utc)
      if (showFirstFrameUTC) {
        console.log('%c first frame after action: ' + humanTime(utc) + ' ' + utc, 'background: red')
        showFirstFrameUTC = false
      }

      // graphUTC.push(utc)
      // if (!graphUTCLabels.includes(humanTime(utc))) {
      //   graphUTCLabels.push(humanTime(utc))
      //   if (graphUTCLabels.length === 200) {
      //     graphUTCLabels.shift()
      //   }
      // }
      // if (window.player) {
      //   // console.log(window.player.sb.segments.length)
      //   // const audioBytes = JSON.stringify(window.player.sb.segmentsAudio).length * 8
      //   graphSegmentsAudio.push(window.player.sb.segmentsAudio.length)
      //   if (graphSegmentsAudio.length === 200) {
      //     graphSegmentsAudio.shift()
      //   }
      //   // const videoBytes = JSON.stringify(window.player.sb.segmentsVideo).length * 8
      //   graphSegmentsVideo.push(window.player.sb.segmentsVideo.length)
      //   if (graphSegmentsVideo.length === 200) {
      //     graphSegmentsVideo.shift()
      //   }
      // }
      // chart.update()
    },
    onDisconnect: (status) => {
      console.log('Websocket status:', status)
    },
    onMediaInfo: (rawMetaData) => {
      console.log('rawMetaData:', rawMetaData)
      const videoTracks = window.player.getVideoTracks()
      const audioTracks = window.player.getAudioTracks()
      const videoOptions = videoTracks.map(
        (v, i) =>
          `<option value="${v['track_id']}">${v['bitrate']} ${v['codec']} ${v['fps']} ${v['width']}x${v['height']}</option>`
      )

      const audioOptions = audioTracks.map(
        (v) => `<option value="${v['track_id']}">${v['bitrate']} ${v['codec']} ${v['lang']}</option>`
      )

      videoTracksSelect.innerHTML = videoOptions.join('')
      audioTracksSelect.innerHTML = audioOptions.join('')

      mbrControls.style.display = 'block'
    },
    onError: (err) => {
      console.log('••••• ERRROR', err)
    },
    onAutoplay: (func) => {
      // console.log('onAutoplay', func)
      const element = document.getElementById('playButton')
      element.style.display = 'flex'
      window.autoplayFunc = func.bind(this)
      window.addEventListener('click', window.hidePlayButton)
      window.addEventListener('touchstart', window.hidePlayButton)
    },
    onMuted: () => {
      console.log('[onMuted]')
    },
    onStats: (stats) => {
      const maxElements = 30
      // graphUTCLabels.push(humanTime(stats.timestamp))
      const date = new Date(stats.timestamp)
      graphUTCLabels.push(`${date.getMinutes()}:${date.getSeconds()}:${date.getUTCMilliseconds()}`)
      // graphCurrentTime.push(stats.currentTime)
      // graphBufferedTime.push(stats.endTime)
      graphBufferedLength.push(stats.endTime - stats.currentTime)
      mseVideoBufferSize.push(stats.videoBuffer)
      mseAudioBufferSize.push(stats.audioBuffer)
      if (graphUTCLabels.length === maxElements) {
        graphUTCLabels.shift()
      }
      // if (graphCurrentTime.length === maxElements) {
      //   graphCurrentTime.shift()
      // }
      // if (graphBufferedTime.length === maxElements) {
      //   graphBufferedTime.shift()
      // }
      if (graphBufferedLength.length === maxElements) {
        graphBufferedLength.shift()
      }
      if (mseVideoBufferSize.length === maxElements) {
        mseVideoBufferSize.shift()
      }
      if (mseAudioBufferSize.length === maxElements) {
        mseAudioBufferSize.shift()
      }
      // chart.update()
      bufferLenChrt.update()
      bufferChrt.update()
    },
  }

  window.player = new FlussonicMsePlayer(element, url, opts)
  window.play = () => {
    window.player
      .play()
      .then((success) => {
        console.log('resolve', success)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  window.hidePlayButton = () => {
    const element = document.getElementById('playButton')
    element.style.display = 'none'
    window.removeEventListener('click', window.hidePlayButton)
    window.removeEventListener('touchstart', window.hidePlayButton)
    window.autoplayFunc()
  }

  window.play()

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

  // const timeChart = document.getElementById('bufferChart').getContext('2d')
  // const chart = new Chart(timeChart, {
  //   // The type of chart we want to create
  //   type: 'line',

  //   // The data for our dataset
  //   data: {
  //     labels: graphUTCLabels,
  //     datasets: [
  //       {
  //         label: 'Current Time',
  //         backgroundColor: '#FF6B00',
  //         borderColor: '#FF6B00',
  //         data: graphCurrentTime,
  //         fill: true,
  //         pointRadius: 0,
  //       },
  //       {
  //         label: 'Buffered Time',
  //         backgroundColor: '#63d4ff',
  //         borderColor: '#63d4ff',
  //         data: graphBufferedTime,
  //         fill: true,
  //         pointRadius: 0,
  //       },
  //     ],
  //   },

  //   // Configuration options go here
  //   options: {
  //     responsive: true,
  //     elements: {
  //       line: {
  //         tension: 0, // disables bezier curves
  //       },
  //     },
  //     animation: {
  //       duration: 100, // general animation time
  //     },
  //     hover: {
  //       animationDuration: 0, // duration of animations when hovering an item
  //     },
  //     responsiveAnimationDuration: 0, // animation duration after a resize
  //   },
  // })

  const bufferChart = document.getElementById('MSELDBuffers').getContext('2d')
  const bufferChrt = new Chart(bufferChart, {
    type: 'bar',
    data: {
      labels: graphUTCLabels,
      datasets: [
        {
          label: 'MSELD Video Buffer',
          backgroundColor: '#FF6B00',
          borderColor: '#FF6B00',
          data: mseVideoBufferSize,
          fill: true,
        },
        {
          label: 'MSELD Audio Buffer',
          backgroundColor: '#63d4ff',
          borderColor: '#63d4ff',
          data: mseAudioBufferSize,
          fill: true,
        },
      ],
    },
    // Configuration options go here
    options: {
      responsive: true,
      elements: {
        line: {
          tension: 0, // disables bezier curves
        },
      },
      animation: {
        duration: 100, // general animation time
      },
      hover: {
        animationDuration: 0, // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0, // animation duration after a resize
    },
  })

  const bufferLengthChart = document.getElementById('bufferLengthChart').getContext('2d')
  const bufferLenChrt = new Chart(bufferLengthChart, {
    type: 'bar',
    data: {
      labels: graphUTCLabels,
      datasets: [
        {
          label: 'Media Element has MS in buffer',
          backgroundColor: 'red',
          borderColor: 'red',
          data: graphBufferedLength,
          fill: true,
        },
      ],
    },
    // Configuration options go here
    options: {
      responsive: true,
      elements: {
        line: {
          tension: 0, // disables bezier curves
        },
      },
      animation: {
        duration: 100, // general animation time
      },
      hover: {
        animationDuration: 0, // duration of animations when hovering an item
      },
      responsiveAnimationDuration: 0, // animation duration after a resize
    },
  })
}
