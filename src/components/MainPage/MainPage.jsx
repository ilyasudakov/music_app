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

const EMPTY_ARRAY = new Array(20)

const MainPage = (props) => {
  const loadTopSongs = (pagesNew, offset) => {
    setPages({
      ...pagesNew,
      'top-songs': {
        ...pagesNew['top-songs'],
        isLoading: true,
      },
    })
    getUserTopAlbums(offset)
      .then((res) => res.json())
      .then((res) => {
        setPages({
          ...pagesNew,
          'top-songs': {
            ...pagesNew['top-songs'],
            isLoading: false,
            data: {
              ...res,
              items: [...pagesNew['top-songs'].data.items, ...res.items],
            },
            // offset: pagesNew['top-songs'].offset + 20,
            loadedData: true,
          },
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const loadTopArtists = (pagesNew, offset) => {
    setPages({
      ...pagesNew,
      'top-artists': {
        ...pagesNew['top-artists'],
        isLoading: true,
      },
    })
    getUserTopArtists(offset)
      .then((res) => res.json())
      .then((res) => {
        setPages({
          ...pagesNew,
          'top-artists': {
            ...pagesNew['top-artists'],
            isLoading: false,
            data: {
              ...res,
              items: [...pagesNew['top-artists'].data.items, ...res.items],
            },
            // offset: pagesNew['top-artists'].offset + 20,
            loadedData: true,
          },
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const loadUserRecomendations = (pagesNew, offset) => {
    setPages({
      ...pagesNew,
      recomendations: {
        ...pagesNew['recomendations'],
        isLoading: true,
      },
    })
    getUserRecomendations(offset)
      .then((res) => res.json())
      .then((res) => {
        setPages({
          ...pagesNew,
          recomendations: {
            ...pagesNew['recomendations'],
            isLoading: false,
            data: [...pagesNew['recomendations'].data, ...res.tracks],
            // offset: pagesNew['recomendations'].offset + 20,
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
        items: [],
      },
      loadedData: false,
      offset: 0,
      loadFunction: (pagesNew, offset) => loadTopSongs(pagesNew, offset),
    },
    'top-artists': {
      active: false,
      isLoading: false,
      data: {
        items: [],
      },
      loadedData: false,
      offset: 0,
      loadFunction: (pagesNew, offset) => loadTopArtists(pagesNew, offset),
    },
    recomendations: {
      active: false,
      isLoading: false,
      data: [],
      loadedData: false,
      offset: 0,
      loadFunction: (pagesNew, offset) =>
        loadUserRecomendations(pagesNew, offset),
    },
  })

  useEffect(() => {
    Object.entries(pages).map((page) => {
      if (!props.userLoaded) {
        return null
      }
      if (page[1].active && !page[1].loadedData && !page[1].isLoading) {
        page[1].loadFunction(pages, page[1].offset)
      }
      return null
    })
    console.log(pages)
  }, [props.userLoaded, pages])

  const handleLoadMoreItems = (name) => {
    setPages({
      ...pages,
      [name]: {
        ...pages[name],
        offset: pages[name].offset + 20,
        loadedData: false,
      },
    })
  }

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
          handleLoadMoreItems={handleLoadMoreItems}
          loadedData={pages['top-songs'].loadedData}
          offset={pages['top-songs'].offset}
          // loadedData={false}
          // offset={0}
        />
        <TopArtistsListComponent
          topItems={pages['top-artists'].data}
          isLoading={pages['top-artists'].isLoading}
          isHidden={!pages['top-artists'].active}
          loadedData={pages['top-artists'].loadedData}
          handleLoadMoreItems={handleLoadMoreItems}
          offset={pages['top-artists'].offset}
          // loadedData={false}
        />
        <RecomendationsListComponent
          topItems={pages['recomendations'].data}
          isLoading={pages['recomendations'].isLoading}
          isHidden={!pages['recomendations'].active}
          loadedData={pages['recomendations'].loadedData}
          handleLoadMoreItems={handleLoadMoreItems}
          offset={pages['recomendations'].offset}
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
            !props.loadedData && props.offset + 20 > index
              ? 'main-page__list-item--placeholder'
              : ''
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
      {props.topItems.items.length < 60 && (
        <button
          className="main-page__button"
          onClick={(event) => {
            event.preventDefault()
            props.handleLoadMoreItems('top-songs')
          }}
        >
          <span>Загрузить еще</span>
        </button>
      )}
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
      {props.topItems.items.length < 60 && (
        <button
          className="main-page__button"
          onClick={(event) => {
            event.preventDefault()
            props.handleLoadMoreItems('top-artists')
          }}
        >
          <span>Загрузить еще</span>
        </button>
      )}
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
          props.handleLoadMoreItems('recomendations')
        }}
      >
        <span>Загрузить еще</span>
      </button>
      {/* <LoadingIndicator isLoading={props.isLoading} /> */}
    </div>
  )
}
