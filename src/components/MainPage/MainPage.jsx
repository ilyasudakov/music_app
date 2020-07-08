import React, { useEffect, useState } from 'react'
import './MainPage.scss'
import {
  getUserTopAlbums,
  getUserTopArtists,
} from '../../utils/API/userStatistics'

import accountIcon from '../../assets/account.svg'
import signOutIcon from '../../assets/sign-out.svg'

const MainPage = (props) => {
  const [topSongs, setTopSongs] = useState({ items: [] })
  const [topArtists, setTopArtists] = useState({ items: [] })
  const [curPage, setCurPage] = useState('top-songs')

  useEffect(() => {
    const loadTopStatistics = () => {
      getUserTopAlbums()
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          setTopSongs({ ...res })
        })
        .catch((error) => {
          console.log(error)
        })
      getUserTopArtists()
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
          setTopArtists({ ...res })
        })
        .catch((error) => {
          console.log(error)
        })
    }

    console.log(props.userData)
    props.userLoaded && loadTopStatistics()
  }, [props.userData, props.userLoaded])

  return (
    <div className="main-page">
      <Header {...props} />
      <div className="main-page__content">
        <div className="main-page__menu">
          <div
            className={`main-page__category-name ${
              curPage === 'top-songs' ? 'main-page__category-name--active' : ''
            }`}
            onClick={() => setCurPage('top-songs')}
          >
            Топ песен
          </div>
          <div
            className={`main-page__category-name ${
              curPage === 'top-artists'
                ? 'main-page__category-name--active'
                : ''
            }`}
            onClick={() => setCurPage('top-artists')}
          >
            Топ исполнителей
          </div>
        </div>
        <TopSongsListComponent
          topItems={topSongs}
          isHidden={!(curPage === 'top-songs')}
        />
        <TopArtistsListComponent
          topItems={topArtists}
          isHidden={!(curPage === 'top-artists')}
        />
      </div>
    </div>
  )
}

export default MainPage

const Header = (props) => {
  return (
    <header className="header">
      <img
        className="header__img header__img--avatar"
        src={
          props.userData?.images?.length > 0
            ? props.userData.images[0].url
            : accountIcon
        }
        alt=""
      />
      <span className="header__username">{props.userData?.display_name}</span>
      {/* <span className="header__email">{props.userData.email}</span> */}
      <button
        className="header__button"
        onClick={(event) => {
          event.preventDefault()
          props.handleSignOff()
        }}
      >
        <img className="header__img" src={signOutIcon} alt="" />
        <span>Выйти</span>
      </button>
    </header>
  )
}

const TopSongsListComponent = (props) => {
  return (
    <div
      className={`main-page__list main-page__list--top-songs ${
        props.isHidden ? 'main-page__list--hidden' : ''
      }`}
    >
      {props.topItems.items.map((item, index) => (
        <div className="main-page__list-item" key={index}>
          <a href={item.album.href}>
            <img
              className="main-page__img"
              src={item.album.images[2].url}
              alt=""
            />
          </a>
          <div className="main-page__song-info">
            <a href={item.href}>{item.name}</a>
            <a href={item.artists[0].href}>{item.artists[0].name}</a>
          </div>
        </div>
      ))}
    </div>
  )
}

const TopArtistsListComponent = (props) => {
  return (
    <div
      className={`main-page__list main-page__list--top-artists ${
        props.isHidden ? 'main-page__list--hidden' : ''
      }`}
    >
      {props.topItems.items.map((item, index) => (
        <div className="main-page__list-item" key={index}>
          <a href={item.href}>
            <img className="main-page__img" src={item.images[2].url} alt="" />
          </a>
          <div className="main-page__song-info">
            <a href={item.href}>{item.name}</a>
          </div>
        </div>
      ))}
    </div>
  )
}
