import React from 'react'
import './LoginPage.scss'
import { Link } from 'react-router-dom'

const LoginPage = (props) => {
  const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in')
  }

  return (
    <div className="login-page">
      <div className="login-page__title">Для начала, авторизуйтесь</div>
      <Link className="login-page__button" to="/spotify-redirect">
        Вход в аккаунт Spotify
      </Link>
    </div>
  )
}

export default LoginPage
