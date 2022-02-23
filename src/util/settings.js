import * as cookies from '@zach.winter/common/js/cookies'

/**
 * @typedef {Object} SettingOptions
 * @property {boolean} session - use session lifetime, (default = false)
 * @property {(val: any) => boolean} validator - allows to validate the value before get() returns it
 */

/**
 * @typedef {Object} Setting
 * @property {() => any} get
 * @property {(val: any) => void} set
 * @property {() => void} remove
 */

/**
 * Creates a readable/writable settings entry with session or permanent lifetime
 * @param {String} key - name of the setting
 * @param {any} [defaultValue] - default value to use if the setting is not stored
 * @param {(val: any) => boolean} [type] - allows to specify a type validator (adding a type validator is recommended because localStorage could have old unexpected values)
 * @param {SettingOptions} [options] - allowes to decide between session or permanent lifetime
 * @returns {Setting} - Setting object
 */
export function setting(key, defaultValue = null, type = null, { session = false, validator } = {}) {
  if (type && validator) {
    throw new Error('Can not set type and validator at the same time!');
  }
  validator = type || validator;

  const storage = _getStorage(session)

  return {
    set(value) {
      const encoded = JSON.stringify(value)
      storage.setItem(key, encoded)
    },
    get() {
      try {
        const encoded = storage.getItem(key)
        const value = JSON.parse(encoded)
        if (validator) return validator(value) ? value : defaultValue
        else if (value != null) return value
        else return defaultValue
      }
      catch (e) {
        return defaultValue
      }
    },
    remove() {
      storage.removeItem(key)
    }
  }
}

/**
 * Clears all stored values
 */
export function resetSettings() {
  _getStorage(true).clear();
  _getStorage(false).clear();
}


export const types = {
  string(value) {
    return typeof value === 'string'
  },
  number(value) {
    return typeof value === 'number'
  },
  boolean(value) {
    return value === true || value === false
  },
  /**
   * @param {array} values - array of allowed values
   */
  enum(values) {
    return (value) => values.includes(value)
  },
}


function _getStorage(session) {
  if (session) {
    if (_storageAvailable('sessionStorage')) return window.sessionStorage
    else if (navigator.cookieEnabled) return _cookieStorage()
  }

  else if (_storageAvailable('localStorage')) return window.localStorage

  // fallback to a simple in memory store
  return _memoryStorage()
}

function _cookieStorage() {
  return {
    setItem(key, value) { cookies.set('setting_' + key, value, null, '/') },
    getItem(key) { return cookies.get('setting_' + key) || null },
    removeItem(key) { cookies.remove('setting_' + key, '/') },
    clear() { for (const key of cookies.keys()) if (key.startsWith('setting_')) cookies.remove(key, '/') }
  }
}

function _memoryStorage() {
  window.memoryStore = window.memoryStore || {};
  return {
    setItem(key, value) { window.memoryStore[key] = value },
    getItem(key) { return window.memoryStore[key] || null },
    removeItem(key) { delete window.memoryStore[key] },
    clear() { window.memoryStore = {} }
  }
}

function _storageAvailable(storageName = 'localStorage') {
  const storage = window[storageName]
  if (typeof storage !== 'undefined') {
    try {
      storage.setItem('feature_test', 'yes')
      if (storage.getItem('feature_test') === 'yes') {
        storage.removeItem('feature_test')
        return true
      }
    } catch (e) {
      // Ignore
    }
  }
  return false
}