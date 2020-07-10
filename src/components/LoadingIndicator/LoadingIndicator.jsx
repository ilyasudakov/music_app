import React from 'react'
import './LoadingIndicator.scss'

const LoadingIndicator = (props) => {
  return (
    <div
      className={`loading-indicator ${
        !props.isLoading ? 'loading-indicator--hidden' : ''
      }`}
    >
      <span>Загрузка...</span>
    </div>
  )
}

export default LoadingIndicator
