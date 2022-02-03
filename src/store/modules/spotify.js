import { buildModule } from '@zach.winter/vue-common/util/store'
import * as cookies from '@zach.winter/common/js/cookies'
import axios from 'axios'

/*global PROJECT_ROOT */
/*global ACCESS_TOKEN */
/*global REFRESH_TOKEN */
/*global REFRESH_CODE */
/*global DATA_URL */

const SPOTIFY_ROOT = 'https://api.spotify.com/v1'
const CACHE = new Set()

const state = {
  accessToken: null,
  refreshToken: null,
  refreshCode: null,
  authenticated: false,
  user: null,
  refreshing: false
}

const actions = {
  validateCookies () {
    const accessToken = cookies.get(ACCESS_TOKEN)
    const refreshToken = cookies.get(REFRESH_TOKEN)
    const refreshCode = cookies.get(REFRESH_CODE)
    return [accessToken, refreshToken, refreshCode].every(v => v && v !== 'null')
  },
  async init ({ commit, dispatch }) {
    const valid = await dispatch('validateCookies')
    if (!valid) return await dispatch('login')
    commit('SET_ACCESS_TOKEN', cookies.get(ACCESS_TOKEN))
    commit('SET_REFRESH_TOKEN', cookies.get(REFRESH_TOKEN))
    commit('SET_REFRESH_CODE', cookies.get(REFRESH_CODE))
    commit('SET_AUTHENTICATED', true)
    commit('SET_USER', await dispatch('getUser'))
  },

  async login () {
    cookies.set(ACCESS_TOKEN, null)
    cookies.set(REFRESH_TOKEN, null)
    cookies.set(REFRESH_CODE, null)
    window.location.replace(`${PROJECT_ROOT}/api/authentication/login`)
  },

  async refresh ({ state, commit, dispatch }) {
    try {
      const { data } = await axios.get(`${PROJECT_ROOT}/api/authentication/refresh?token=${state.refreshToken}`)
      cookies.set(ACCESS_TOKEN, data.access_token); // update ACCESS_TOKEN cookie to have the new token if page reloads
      commit('SET_ACCESS_TOKEN', data.access_token) 
      return data.access_token
    } catch (e) {
      console.log(e) // eslint-disable-line 
      await dispatch('login')
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
    return get(track, false, { accessToken: state.accessToken, dispatch })
  },

  async getUser ({ state, dispatch }) {
    try {
      const user = await get(`${SPOTIFY_ROOT}/me`, false, { accessToken: state.accessToken, dispatch })
      dispatch('saveUser', user)
      return user 
    } catch (e) {
      console.log(e)
    }
  },

  async saveUser (a, user) {
    try {
      await axios.post(DATA_URL, user)
    } catch (e) {
      // :(
    }
  },

  getUserDevices ({ state, dispatch }) {
    return get(`${SPOTIFY_ROOT}/me/player/devices`, null, { accessToken: state.accessToken, dispatch  })
  },
  
  getCurrentlyPlaying ({ state, dispatch  }) {
    return get(`${SPOTIFY_ROOT}/me/player`, null, { accessToken: state.accessToken, dispatch })
  },
  
  selectDevice ({ state, dispatch  }, device) {
    return put(`${SPOTIFY_ROOT}/me/player`, { device_ids: [device], play: true }, { accessToken: state.accessToken, dispatch })
  },
  
  getUserPlaylists ({ state, dispatch }) {
    return get(`${SPOTIFY_ROOT}/me/playlists`, null, { accessToken: state.accessToken, dispatch })
  },
  
  getRecentlyPlayedTracks ({ state, dispatch }) {
    return get(`${SPOTIFY_ROOT}/me/player/recently-played?limit=50`, null, { accessToken: state.accessToken, dispatch })
  },
  
  getTopArtists ({ state, dispatch }) {
    return get(`${SPOTIFY_ROOT}/me/top/artists`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getTopTracks ({ state, dispatch }) {
    return get(`${SPOTIFY_ROOT}/me/top/tracks`, true, { accessToken: state.accessToken, dispatch })
  },
  
  search ({ state, dispatch }, query) {
    return get(`${SPOTIFY_ROOT}/search?q=${query}&type=artist,album,track&limit=5`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getArtist ({ state, dispatch }, id) {
    return get(`${SPOTIFY_ROOT}/artists/${id}`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getAlbum ({ state, dispatch }, id) {
    return get(`${SPOTIFY_ROOT}/albums/${id}`, true, { accessToken: state.accessToken, dispatch })
  },
  getArtistAlbums ({ state, dispatch }, id) {
    return get(`${SPOTIFY_ROOT}/artists/${id}/albums`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getRelatedArtists ({ state, dispatch }, id) {
    return get(`${SPOTIFY_ROOT}/artists/${id}/related-artists`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getAlbumTracks ({ state, dispatch }, id) {
    return get(`${SPOTIFY_ROOT}/albums/${id}/tracks`, true, { accessToken: state.accessToken, dispatch })
  },
  
  getFeaturedPlaylists ({ state, dispatch }) {
    return get(`${SPOTIFY_ROOT}/browse/featured-playlists`, true, { accessToken: state.accessToken, dispatch })
  },
  
  postTrackToQueue ({ state, dispatch }, track) {
    return post(`${SPOTIFY_ROOT}/me/player/queue?uri=${track}`, false, { accessToken: state.accessToken, dispatch })
  },
  
  getTrackAnalysis ({ state, dispatch }, id) {
    return get(`${SPOTIFY_ROOT}/audio-analysis/${id}`, false, { accessToken: state.accessToken, dispatch })
  },
  
  play ({ state, dispatch }, songs = null) {
    return put(`${SPOTIFY_ROOT}/me/player/play`, songs, { accessToken: state.accessToken, dispatch })
  },
  
  pause ({ state, dispatch }) {
    return put(`${SPOTIFY_ROOT}/me/player/pause`, null, { accessToken: state.accessToken, dispatch })
  },
  
  next ({ state, dispatch }) {
    return post(`${SPOTIFY_ROOT}/me/player/next`, null, { accessToken: state.accessToken, dispatch })
  },
  
  previous ({ state, dispatch }) {
    return post(`${SPOTIFY_ROOT}/me/player/previous`, null, { accessToken: state.accessToken, dispatch })
  },
  
  getPlaylist ({ state, dispatch }, id) {
    return get(`${SPOTIFY_ROOT}/playlists/${id}`, false, { accessToken: state.accessToken, dispatch })
  }
}

async function get (route, cache = false, { accessToken, dispatch } = {}) {
  try {
    if (cache && CACHE[route]) return CACHE[route]
    const headers = { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
    try {
      const { data } = await axios.get(route, { headers })
      if (cache) CACHE[route] = data
      return data
    } catch ({ response }) {
      if (response.status === 401) {
        const token = await dispatch('refresh')
        return get(route, cache, { accessToken: token, dispatch })
      }
    }
  } catch (e) {
    await dispatch('login')
  }
}

async function put (route, args, { accessToken, dispatch }) {
  const headers = { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
  try {
    const { data } = await axios.put(route, args, { headers })
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
    const { data } = await axios.post(route, args, { headers })
    return data
  } catch ({ response }) {
    if (response.status === 401) {
      const token = await dispatch('refresh')
      return post(route, args, { accessToken: token, dispatch })
    }
  }
}

export default buildModule({ state, actions })