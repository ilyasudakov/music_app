import { request } from './request'

export function getUserTopAlbums(offset = 0) {
  return request(
    {
      url: `https://api.spotify.com/v1/me/top/tracks?limit=20&offset=${offset}`,
      method: 'GET',
    },
    'application/json',
    `Bearer ${localStorage.getItem('accessToken')}`,
  )
}

export function getUserTopArtists(offset = 0) {
  return request(
    {
      url: `https://api.spotify.com/v1/me/top/artists?limit=20&offset=${offset}`,
      method: 'GET',
    },
    'application/json',
    `Bearer ${localStorage.getItem('accessToken')}`,
  )
}

export function getUserRecomendations(offset = 0) {
  return request(
    {
      url: `https://api.spotify.com/v1/recommendations?seed_genres=alternative&limit=20&offset=${offset}`,
      method: 'GET',
    },
    'application/json',
    `Bearer ${localStorage.getItem('accessToken')}`,
  )
}
