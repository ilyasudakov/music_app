import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css'

import LoginPage from './components/LoginPage/LoginPage'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import MainPage from './components/MainPage/MainPage'
import { redirectLinkToSpotifyLogin, refreshTokens } from './utils/API/login'
import CallbackPage from './components/CallbackPage/CallbackPage'
import { getUserProfile } from './utils/API/userProfile'

const App = () => {
  const [userData, setUserData] = useState({
    isAuthorized: false,
  })
  const [userLoaded, setUserLoaded] = useState(false)

  const onCallback = (code, res) => {
    setUserData({
      ...userData,
      isAuthorized: true,
      code: code,
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
    })
    console.log('callback: ', res.access_token)

    localStorage.setItem('code', code)
    localStorage.setItem('accessToken', res.access_token)
    localStorage.setItem('refreshToken', res.refresh_token)
    window.location.href = '/'
  }

  const handleSignOff = () => {
    setUserData({
      ...userData,
      isAuthorized: false,
      code: '',
      accessToken: '',
      refreshToken: '',
    })
    localStorage.removeItem('code')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  useEffect(() => {
    const getUserData = (accessToken) => {
      getUserProfile(accessToken)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res)
          setUserLoaded(true)
          setUserData({
            ...userData,
            ...res,
          })
        })
        .catch((error) => {
          refreshTokens(localStorage.getItem('refreshToken'))
            .then((res) => res.json())
            .then((res) => {
              setUserLoaded(true)
              setUserData({
                ...userData,
                isAuthorized: true,
                accessToken: res.access_token,
              })
              localStorage.setItem('accessToken', res.access_token)
            })
            .catch((error) => {
              console.log(error)
            })
        })
    }

    if (
      localStorage.getItem('refreshToken') &&
      !userData.isAuthorized &&
      !userLoaded
    ) {
      setUserData({
        ...userData,
        isAuthorized: true,
        code: localStorage.getItem('code'),
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
      })
      !userLoaded && getUserData(localStorage.getItem('accessToken'))
    }
    // console.log(userData)
  }, [userData, userLoaded])

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route
            exact
            path="/login"
            render={(props) => <LoginPage {...props} />}
          />
          <Route
            exact
            path="/spotify-redirect"
            component={() => {
              window.location.href = redirectLinkToSpotifyLogin()
              return null
            }}
          />
          <Route
            exact
            path="/callback"
            render={() => <CallbackPage onChange={onCallback} />}
          />
          <PrivateRoute
            path="/"
            userData={userData}
            handleSignOff={handleSignOff}
            component={MainPage}
            userLoaded={userLoaded}
          />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
