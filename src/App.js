import React, { useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css'

import LoginPage from './components/LoginPage/LoginPage'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import MainPage from './components/MainPage/MainPage'

const App = () => {
  const [userData, setUserData] = useState({
    isAuthorized: false,
  })

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route
            exact
            path="/login"
            render={(props) => <LoginPage {...props} />}
          />
          <PrivateRoute path="/" userData={userData} component={MainPage} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
