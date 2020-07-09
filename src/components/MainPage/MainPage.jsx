import React, { useEffect, useState } from 'react'
import './MainPage.scss'
import {
  getUserTopAlbums,
  getUserRecomendations,
  getUserTopArtists,
} from '../../utils/API/userStatistics'

import accountIcon from '../../assets/account.svg'
import signOutIcon from '../../assets/sign-out.svg'
// import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'

const EMPTY_ARRAY = Array[20]

const MainPage = (props) => {
  const loadTopSongs = (pagesNew) => {
    setPages({
      ...pagesNew,
      'top-songs': {
        ...pagesNew['top-songs'],
        isLoading: true,
      },
    })
    getUserTopAlbums()
      .then((res) => res.json())
      .then((res) => {
        setPages({
          ...pagesNew,
          'top-songs': {
            ...pagesNew['top-songs'],
            isLoading: false,
            data: {
              ...res,
            },
            loadedData: true,
          },
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const loadTopArtists = (pagesNew) => {
    setPages({
      ...pagesNew,
      'top-artists': {
        ...pagesNew['top-artists'],
        isLoading: true,
      },
    })
    getUserTopArtists()
      .then((res) => res.json())
      .then((res) => {
        setPages({
          ...pagesNew,
          'top-artists': {
            ...pagesNew['top-artists'],
            isLoading: false,
            data: {
              ...res,
            },
            loadedData: true,
          },
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const loadUserRecomendations = (pagesNew) => {
    setPages({
      ...pagesNew,
      recomendations: {
        ...pagesNew['recomendations'],
        isLoading: true,
      },
    })
    getUserRecomendations()
      .then((res) => res.json())
      .then((res) => {
        setPages({
          ...pagesNew,
          recomendations: {
            ...pagesNew['recomendations'],
            isLoading: false,
            data: [...res.tracks],
            loadedData: true,
          },
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const [pages, setPages] = useState({
    'top-songs': {
      active: true,
      isLoading: false,
      data: {
        items: [EMPTY_ARRAY],
      },
      loadedData: false,
      loadFunction: (pagesNew) => loadTopSongs(pagesNew),
    },
    'top-artists': {
      active: false,
      isLoading: false,
      data: {
        items: [EMPTY_ARRAY],
      },
      loadedData: false,
      loadFunction: (pagesNew) => loadTopArtists(pagesNew),
    },
    recomendations: {
      active: false,
      isLoading: false,
      data: [EMPTY_ARRAY],
      loadedData: false,
      loadFunction: (pagesNew) => loadUserRecomendations(pagesNew),
    },
  })

  useEffect(() => {
    Object.entries(pages).map((page) => {
      if (!props.userLoaded) {
        return null
      }
      if (page[1].active && !page[1].loadedData && !page[1].isLoading) {
        page[1].loadFunction(pages)
      }
      return null
    })
  }, [props.userLoaded, pages])

  return (
    <div className="main-page">
      <Header {...props} />
      <div className="main-page__content">
        <div className="main-page__menu">
          <div
            className={`main-page__category-name ${
              pages['top-songs'].active
                ? 'main-page__category-name--active'
                : ''
            }`}
            onClick={() =>
              setPages({
                ...Object.fromEntries(
                  Object.entries(pages).map((page) => {
                    return [
                      page[0],
                      {
                        ...page[1],
                        active: false,
                      },
                    ]
                  }),
                ),
                'top-songs': {
                  ...pages['top-songs'],
                  active: true,
                },
              })
            }
          >
            Топ песен
          </div>
          <div
            className={`main-page__category-name ${
              pages['top-artists'].active
                ? 'main-page__category-name--active'
                : ''
            }`}
            onClick={() =>
              setPages({
                ...Object.fromEntries(
                  Object.entries(pages).map((page) => {
                    return [
                      page[0],
                      {
                        ...page[1],
                        active: false,
                      },
                    ]
                  }),
                ),
                'top-artists': {
                  ...pages['top-artists'],
                  active: true,
                },
              })
            }
          >
            Топ исполнителей
          </div>
          <div
            className={`main-page__category-name ${
              pages['recomendations'].active
                ? 'main-page__category-name--active'
                : ''
            }`}
            onClick={() => {
              setPages({
                ...Object.fromEntries(
                  Object.entries(pages).map((page) => {
                    return [
                      page[0],
                      {
                        ...page[1],
                        active: false,
                      },
                    ]
                  }),
                ),
                recomendations: {
                  ...pages['recomendations'],
                  active: true,
                },
              })
            }}
          >
            Рекомендации
          </div>
        </div>
        <TopSongsListComponent
          topItems={pages['top-songs'].data}
          isLoading={pages['top-songs'].isLoading}
          isHidden={!pages['top-songs'].active}
          loadedData={pages['top-songs'].loadedData}
          // loadedData={false}
        />
        <TopArtistsListComponent
          topItems={pages['top-artists'].data}
          isLoading={pages['top-artists'].isLoading}
          isHidden={!pages['top-artists'].active}
          loadedData={pages['top-artists'].loadedData}
          // loadedData={false}
        />
        <RecomendationsListComponent
          topItems={pages['recomendations'].data}
          isLoading={pages['recomendations'].isLoading}
          isHidden={!pages['recomendations'].active}
          loadedData={pages['recomendations'].loadedData}
          // loadedData={false}
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
        <div
          className={`main-page__list-item ${
            !props.loadedData ? 'main-page__list-item--placeholder' : ''
          }`}
          key={index}
        >
          <div className="main-page__position">{`${index + 1}.`}</div>
          <a href={props.loadedData ? item.album.href : '/'}>
            {props.isLoading ? (
              <div className="main-page__img main-page__img--placeholder"></div>
            ) : (
              <img
                className="main-page__img"
                src={props.loadedData ? item.album.images[2].url : ''}
                alt=""
                loading="lazy"
              />
            )}
          </a>
          <div className="main-page__song-info">
            <a href={props.loadedData ? item.href : '/'}>
              {props.loadedData ? item.name : ''}
            </a>
            <a href={props.loadedData ? item.artists[0].href : '/'}>
              {props.loadedData ? item.artists[0].name : ''}
            </a>
          </div>
        </div>
      ))}
      {/* <LoadingIndicator isLoading={props.isLoading} /> */}
      <button
        className="main-page__button"
        onClick={(event) => {
          event.preventDefault()
        }}
      >
        <span>Загрузить еще</span>
      </button>
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
        <div
          className={`main-page__list-item ${
            !props.loadedData ? 'main-page__list-item--placeholder' : ''
          }`}
          key={index}
        >
          <div className="main-page__position">{`${index + 1}.`}</div>
          <a href={props.loadedData ? item.href : '/'}>
            {props.isLoading ? (
              <div className="main-page__img main-page__img--placeholder"></div>
            ) : (
              <img
                className="main-page__img"
                src={props.loadedData ? item.images[2].url : ''}
                alt=""
                loading="lazy"
              />
            )}
          </a>
          <div className="main-page__song-info">
            <a href={props.loadedData ? item.href : ''}>
              {props.loadedData ? item.name : ''}
            </a>
          </div>
        </div>
      ))}
      {/* <LoadingIndicator isLoading={props.isLoading} /> */}
      <button
        className="main-page__button"
        onClick={(event) => {
          event.preventDefault()
        }}
      >
        <span>Загрузить еще</span>
      </button>
    </div>
  )
}

const RecomendationsListComponent = (props) => {
  return (
    <div
      className={`main-page__list main-page__list--top-songs ${
        props.isHidden ? 'main-page__list--hidden' : ''
      }`}
    >
      {props.topItems.map((item, index) => (
        <div
          className={`main-page__list-item ${
            !props.loadedData ? 'main-page__list-item--placeholder' : ''
          }`}
          key={index}
        >
          <a href={props.loadedData ? item.album.href : ''}>
            {props.isLoading ? (
              <div className="main-page__img main-page__img--placeholder"></div>
            ) : (
              <img
                className="main-page__img"
                src={props.loadedData ? item.album.images[2].url : ''}
                alt=""
                loading="lazy"
              />
            )}
          </a>
          <div className="main-page__song-info">
            <a href={props.loadedData ? item.href : ''}>
              {props.loadedData ? item.name : ''}
            </a>
            <a href={props.loadedData ? item.artists[0].href : ''}>
              {props.loadedData ? item.artists[0].name : ''}
            </a>
          </div>
        </div>
      ))}
      <button
        className="main-page__button"
        onClick={(event) => {
          event.preventDefault()
        }}
      >
        <span>Загрузить еще</span>
      </button>
      {/* <LoadingIndicator isLoading={props.isLoading} /> */}
    </div>
  )
}
