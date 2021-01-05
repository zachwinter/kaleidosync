import { buildModule } from '@zach.winter/vue-common/util/store'
import { getAuthID } from '@/api/auth'
import * as cookies from '@zach.winter/common/js/cookies'
import axios from 'axios'

const ROOT = 'https://api.spotify.com/v1'
const CACHE = new Set()

const state = {
  accessToken: null,
  refreshToken: null,
  refreshCode: null,
  authenticated: false,
  user: null
}

const actions = {
  async init ({ commit, dispatch }) {
    commit('SET_ACCESS_TOKEN', cookies.get(ACCESS_TOKEN)) // eslint-disable-line 
    commit('SET_REFRESH_TOKEN', cookies.get(REFRESH_TOKEN)) // eslint-disable-line 
    commit('SET_REFRESH_CODE', cookies.get(REFRESH_CODE)) // eslint-disable-line 
    if (!state.accessToken || !state.refreshToken || !state.refreshCode) return dispatch('login')
    commit('SET_AUTHENTICATED', true)
    commit('SET_USER', await dispatch('getUser'))
  },

  async login () {
    cookies.set(ACCESS_TOKEN, null) // eslint-disable-line
    cookies.set(REFRESH_TOKEN, null) // eslint-disable-line
    cookies.set(REFRESH_CODE, null) // eslint-disable-line 
    const { success, auth_id } = await getAuthID()
    if (success) window.location.href = `${PROJECT_ROOT}/api/authentication/login?auth_id=${auth_id}` // eslint-disable-line
  },

  async refresh ({ state, commit, dispatch }) {
    try {
      const { data } = await get(`${PROJECT_ROOT}/api/authentication/refresh?token=${state.refreshToken}`, state) //eslint-disable-line
      commit('SET_ACCESS_TOKEN', data.access_token) 
      return data.access_token
    } catch (e) {
      dispatch('login')
      console.log(e) // eslint-disable-line 
    }
  },

  async getAllPlaylists ({ dispatch }) {
    const { items } = await dispatch('getUserPlaylists')
    const tracks = await Promise.all(items.reduce((acc, item) => {
      acc.push(dispatch('getPlaylistTracks', item.tracks.href))
      return acc
    }, []))
    return items.map((item, i) => {
      return {
        ...item,
        tracks: tracks[i]
      }
    })
  },

  getPlaylistTracks ({ state, dispatch }, track) {
    return get(track, false, { accessToken: state.accessToken, dispatch, dropRoot: true })
  },

  getUser ({ state, dispatch }) {
    return get('me', false, { accessToken: state.accessToken, dispatch })
  },

  getUserDevices ({ state, dispatch }) {
    return get('me/player/devices', null, { accessToken: state.accessToken, dispatch  })
  },
  
  getCurrentlyPlaying ({ state, dispatch  }) {
    return get('me/player', null, { accessToken: state.accessToken, dispatch })
  },
  
  selectDevice ({ state, dispatch  }, device) {
    return put('me/player', { device_ids: [device], play: true }, { accessToken: state.accessToken, dispatch })
  },
  
  getUserPlaylists ({ state, dispatch }) {
    return get('me/playlists', null, { accessToken: state.accessToken, dispatch })
  },
  
  getRecentlyPlayedTracks ({ state, dispatch }) {
    return get('me/player/recently-played?limit=50', null, { accessToken: state.accessToken, dispatch })
  },
  
  getTopArtists ({ state, dispatch }) {
    return get('me/top/artists', true, { accessToken: state.accessToken, dispatch })
  },
  
  getTopTracks ({ state, dispatch }) {
    return get('me/top/tracks', true, { accessToken: state.accessToken, dispatch })
  },
  
  search ({ state, dispatch }, query) {
    return get(`search?q=${query}&type=artist,album,track&limit=5`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getArtist ({ state, dispatch }, id) {
    return get(`artists/${id}`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getAlbum ({ state, dispatch }, id) {
    return get(`albums/${id}`, true, { accessToken: state.accessToken, dispatch })
  },
  getArtistAlbums ({ state, dispatch }, id) {
    return get(`artists/${id}/albums`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getRelatedArtists ({ state, dispatch }, id) {
    return get(`artists/${id}/related-artists`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getAlbumTracks ({ state, dispatch }, id) {
    return get(`albums/${id}/tracks`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getFeaturedPlaylists ({ state, dispatch }) {
    return get('browse/featured-playlists', true, { accessToken: state.accessToken, dispatch })
  },
  
  postTrackToQueue ({ state, dispatch }, track) {
    return post(`me/player/queue?uri=${track}`, false, { accessToken: state.accessToken, dispatch })
  },
  
  getTrackAnalysis ({ state, dispatch }, id) {
    return get(`audio-analysis/${id}`, false, { accessToken: state.accessToken, dispatch })
  },
  
  play ({ state, dispatch }, songs = null) {
    return put('me/player/play', songs, { accessToken: state.accessToken, dispatch })
  },
  
  pause ({ state, dispatch }) {
    return put('me/player/pause', null, { accessToken: state.accessToken, dispatch })
  },
  
  next ({ state, dispatch }) {
    return post('me/player/next', null, { accessToken: state.accessToken, dispatch })
  },
  
  previous ({ state, dispatch }) {
    return post('me/player/previous', null, { accessToken: state.accessToken, dispatch })
  },
  
  getPlaylist ({ state, dispatch }, id) {
    return get(`playlists/${id}`, false, { accessToken: state.accessToken, dispatch })
  }
}

async function get (route, cache = false, { accessToken, dispatch, dropRoot = false }) {
  if (cache && CACHE[route]) return CACHE[route]
  const headers = { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
  try {
    const { data } = await axios.get(dropRoot ? route : `${ROOT}/${route}`, { headers })
    if (cache) CACHE[route] = data
    return data
  } catch ({ response }) {
    if (response.status === 401) {
      const token = await dispatch('refresh')
      return get(route, cache, { accessToken: token, dispatch })
    }
  }
}

async function put (route, args, { accessToken, dispatch }) {
  const headers = { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
  try {
    const { data } = await axios.put(`${ROOT}/${route}`, args, { headers })
    return data
  } catch ({ response }) {
    if (response.status === 401) {
      const token = await dispatch('refresh')
      return put(route, args, { accessToken: token, dispatch })
    }
  }
}

async function post (route, args = {}, { accessToken, dispatch }) {
  const headers = { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
  try {
    const { data } = await axios.post(`${ROOT}/${route}`, args, { headers })
    return data
  } catch ({ response }) {
    if (response.status === 401) {
      const token = await dispatch('refresh')
      return put(route, args, { accessToken: token, dispatch })
    }
  }
}

export default buildModule({ state, actions })