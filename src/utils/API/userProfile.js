import { request } from './request'

//POST-запрос для получения записей продукции по названию категории продукции
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
