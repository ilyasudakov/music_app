import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
  //Если пользователь не авторизован и у него нет токена
  //доступа, то редирект на /login, иначе - рендер
  //передаваемого компонента
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('accessToken') ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
)

export default PrivateRoute
