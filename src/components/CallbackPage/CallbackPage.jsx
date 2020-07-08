import React, { useEffect } from 'react'
import { getAccessAndRefreshTokens } from '../../utils/API/login'

const CallbackPage = (props) => {
  useEffect(() => {
    const code = document.location.href.split('=')[1]
    getAccessAndRefreshTokens(code)
      .then((res) => res.json())
      .then((res) => {
        props.onChange(code, res)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return <div></div>
}

export default CallbackPage
