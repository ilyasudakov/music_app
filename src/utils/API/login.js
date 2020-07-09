import { request } from './request'
import * as url from 'url'
url.URLSearchParams = URLSearchParams

export const redirectLinkToSpotifyLogin = () => {
  const scope =
    'user-read-private user-read-email user-read-playback-state user-top-read user-read-currently-playing user-read-recently-played'

  return `https://accounts.spotify.com/authorize?response_type=code&client_id=${
    process.env.REACT_APP_SPOTIFY_CLIENT_ID
  }${
    scope ? '&scope=' + encodeURIComponent(scope) : ''
  }&redirect_uri=${encodeURIComponent(process.env.REACT_APP_SPOTIFY_REDIRECT)}`
}

export function getAccessAndRefreshTokens(code) {
  const data = new URLSearchParams()
  data.append('grant_type', 'authorization_code')
  data.append('code', code)
  data.append('client_id', process.env.REACT_APP_SPOTIFY_CLIENT_ID)
  data.append('client_secret', process.env.REACT_APP_SPOTIFY_CLIENT_SECRET)
  data.append('redirect_uri', process.env.REACT_APP_SPOTIFY_REDIRECT)
  return request(
    {
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      body: data,
      // body: JSON.stringify({
      //   client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      //   client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
      //   grant_type: 'authorization_code',
      //   code: code,
      //   redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT,
      // }),
    },
    'application/x-www-form-urlencoded',
  )
}

export function refreshTokens(refreshToken, accessToken) {
  const data = new URLSearchParams()
  data.append('grant_type', 'refresh_token')
  // data.append('code', code)
  data.append('client_id', process.env.REACT_APP_SPOTIFY_CLIENT_ID)
  data.append('client_secret', process.env.REACT_APP_SPOTIFY_CLIENT_SECRET)
  data.append('redirect_uri', process.env.REACT_APP_SPOTIFY_REDIRECT)
  data.append('refresh_token', refreshToken)
  return request(
    {
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      body: data,
      // body: JSON.stringify({
      //   client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      //   client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
      //   grant_type: 'authorization_code',
      //   code: code,
      //   redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT,
      // }),
    },
    'application/x-www-form-urlencoded',
    // `Basic ${accessToken}`,
  )
}
