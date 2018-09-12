import MSEPlayer from './FlussonicMsePlayer'

const rawUrl = 'http://localhost:8080/clock/mse_ld'

test('1. constructor return MSEPlayer instance', () => {
  const url = MSEPlayer.replaceHttpByWS(rawUrl)
  const mse = new MSEPlayer(null, url, {debug: true})

  expect(mse instanceof MSEPlayer).toBe(true)
  expect(mse.url === url).toBe(true)
})

test('2. reject processing play() if this.playing flag is true', () => {
  const url = MSEPlayer.replaceHttpByWS(rawUrl)
  const mse = new MSEPlayer(null, url, {debug: true})
  mse.playing = true
  mse.play().then(data => {
    return expect(data).toEqual({message: '[mse-player] _play: terminate because already has been playing'})
  })
})
