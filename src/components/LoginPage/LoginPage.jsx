import React from 'react'
import './LoginPage.scss'
import { Link } from 'react-router-dom'

const LoginPage = (props) => {
  // const handleLogin = (event) => {
  //   event.preventDefault()
  //   console.log('logging in')
  // }

  return (
    <div className="login-page">
      <div className="login-page__title">
        Авторизуйтесь для просмотра статистики.
      </div>
      <div className="login-page__title login-page__title__small">
        Топы песен, исполнителей и список рекомендаций.
      </div>
      <Link className="login-page__button" to="/spotify-redirect">
        Вход в Spotify
      </Link>
    </div>
  )
}

export default LoginPage
