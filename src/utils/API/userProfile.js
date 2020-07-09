import { request } from './request'

export function getUserProfile(accessToken) {
  return request(
    {
      url: 'https://api.spotify.com/v1/me',
      method: 'GET',
    },
    'application/json',
    `Bearer ${accessToken}`,
  )
}

export function getUserPlayingNow(accessToken) {
  return request(
    {
      url: 'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      method: 'GET',
    },
    'application/json',
    `Bearer ${accessToken}`,
  )
}
