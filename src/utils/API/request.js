export const request = (
  options,
  contentType = 'application/json',
  authorization,
) => {
  const headers = new Headers({
    'Content-Type': contentType,
    // ...options.headers,
  })

  authorization && headers.append('Authorization', authorization)

  const defaults = { headers: headers }

  options = Object.assign({}, defaults, options)

  return fetch(options.url, options).then((response) => {
    if (!response.ok) {
      return Promise.reject(response.error)
    }
    return response
  })
}
