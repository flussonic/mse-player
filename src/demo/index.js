import FlussonicMsePlayer from '../FlussonicMsePlayer.js'
import {humanTime} from './utils'
import {decode} from 'querystring'

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

  // let timeLineChart = []
  // let graphUTCLabels = []
  // let graphCurrentTime = []
  // let graphBufferedTime = []
  let graphBufferedLength = []
  let readySt = []
  let mseVideoBufferSize = []
  let mseAudioBufferSize = []

  let messagesUTC = []
  // const messagesTimelag = []

  const opts = {
    debug: true,
    connectionRetries: 0,
    errorsBeforeStop: 10,
    retryMuted: true,
    maxBufferDelay: 2,
    // wsReconnect: true,
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
      // timeLineChart.push({
      //   x: new Date(),
      //   // y: 0,
      // })
      // if (timeLineChart.length === 100) {
      //   timeLineChart.shift()
      // }
      // eventsChart.update()
    },
    onDisconnect: (status) => {
      console.log('Websocket status:', status)
      const restart = () => {
        window.player.restart()
        clearInterval(restartTimer)
      }
      // const restart = window.player.stop().then(() => {
      //   window.player.play()
      //   clearInterval(restartTimer)
      // })
      let restartTimer = setInterval(restart, 10000)
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
      if (typeof err === 'object' && err.type) {
        let color = 'gray'
        switch (err.type) {
          case 'waiting':
            color = 'red'
            break
          case 'playing':
            color = 'green'
            break
          default:
            color = 'gray'
            break
        }
        const time = new Date()
        myChart.xAxis[0].addPlotBand({
          label: {text: err.type},
          color,
          width: 2,
          value: Date.now(time),
          zIndex: 3,
        })
      } else {
        console.log('••••• ERRROR', err)
      }
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
      const {endTime, currentTime, videoBuffer, audioBuffer, timestamp, readyState, networkState} = stats

      mseVideoBufferSize.push([timestamp, videoBuffer])
      mseAudioBufferSize.push([timestamp, audioBuffer])

      const readyIndicator = document.getElementById('indicator')
      readyIndicator.className = ''
      switch (readyState) {
        case 0:
          readyIndicator.classList.add('black')
          break
        case 1:
          readyIndicator.classList.add('gray')
          break
        case 2:
          readyIndicator.classList.add('red')
          break
        case 3:
          readyIndicator.classList.add('yellow')
          break
        case 4:
          readyIndicator.classList.add('green')
          break
        default:
          readyIndicator.classList.add('gray')
          break
      }
      const networkIndicator = document.getElementById('nIndicator')
      networkIndicator.className = ''
      switch (networkState) {
        case 0:
          networkIndicator.classList.add('black')
          break
        case 1:
          networkIndicator.classList.add('yellow')
          break
        case 2:
          networkIndicator.classList.add('green')
          break
        case 3:
          networkIndicator.classList.add('red')
          break
        default:
          networkIndicator.classList.add('gray')
          break
      }

      graphBufferedLength.push([timestamp, (endTime - currentTime) * 1000])
      readySt.push([timestamp, readyState])
    },
    onMessage: (messageStats) => {
      const {utc, messageTimeDiff} = messageStats
      messagesUTC.push([utc, messageTimeDiff])
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

  window.unmute = () => {
    const element = document.getElementById('muted')
    if (window.player && window.player.media) {
      if (window.player.media.muted) {
        window.player.media.muted = false
        element.innerText = 'Mute'
      } else {
        window.player.media.muted = true
        element.innerText = 'Unmute'
      }
    }
  }

  let myChart = Highcharts.stockChart('container', {
    // Create the chart
    chart: {},

    time: {
      useUTC: true,
    },

    rangeSelector: {
      buttons: [
        {
          count: 1,
          type: 'minute',
          text: '1M',
        },
        {
          count: 5,
          type: 'minute',
          text: '5M',
        },
        {
          type: 'all',
          text: 'All',
        },
      ],
      inputEnabled: false,
      selected: 0,
    },

    title: {
      text: 'MSELD Statistics',
    },

    // exporting: {
    //   enabled: false,
    // },

    xAxis: {
      plotBands: [],
      plotLines: [],
    },

    yAxis: [
      {
        title: {
          text: 'Milliseconds',
        },
        align: 'left',
      },
      {
        title: {
          text: 'State',
        },
        opposite: true,
        align: 'right',
        // floor: 0,
        // ceiling: 4,
        max: 4,
      },
    ],

    series: [
      {
        name: 'WS message lag',
        data: [],
      },
      {
        name: 'Media Element have seconds in buffer',
        data: [],
      },
      {
        name: 'Ready State',
        type: 'line',
        yAxis: 1,
        data: [],
        max: 4,
        zones: [
          {
            value: 0,
            color: 'black',
          },
          {
            value: 1,
            color: 'gray',
          },
          {
            value: 2,
            color: 'red',
          },
          {
            value: 3,
            color: 'yellow',
          },
          {
            value: 4,
            color: 'green',
          },
          {
            color: 'gray',
          },
        ],
      },
    ],
  })

  let myMseChart = Highcharts.stockChart('container2', {
    // Create the chart
    chart: {},

    time: {
      useUTC: true,
    },

    rangeSelector: {
      buttons: [
        {
          count: 1,
          type: 'minute',
          text: '1M',
        },
        {
          count: 5,
          type: 'minute',
          text: '5M',
        },
        {
          type: 'all',
          text: 'All',
        },
      ],
      inputEnabled: false,
      selected: 0,
    },

    title: {
      text: 'MSELD Buffer Statistics',
    },

    // xAxis: {
    //   plotBands: [],
    //   plotLines: [],
    // },

    yAxis: [
      {
        title: {
          text: 'Bytes',
        },
        align: 'left',
      },
    ],

    series: [
      {
        name: 'WS audio buffer',
        data: [],
      },
      {
        name: 'WS video buffer',
        data: [],
      },
    ],
  })

  setInterval(() => {
    const prepare = function (data) {
      // const maxElements = 5000
      data.sort((a, b) => {
        return a[0] - b[0]
      })
      // if (data.length >= maxElements) {
      //   data = data.splice(data.length - maxElements, data.length)
      // }
      return data
    }

    messagesUTC = prepare(messagesUTC)
    graphBufferedLength = prepare(graphBufferedLength)
    readySt = prepare(readySt)
    mseAudioBufferSize = prepare(mseAudioBufferSize)
    mseVideoBufferSize = prepare(mseVideoBufferSize)

    myChart.series[0].setData(messagesUTC)
    myChart.series[1].setData(graphBufferedLength)
    myChart.series[2].setData(readySt)

    myMseChart.series[0].setData(mseAudioBufferSize)
    myMseChart.series[1].setData(mseVideoBufferSize)
  }, 5000)
}
