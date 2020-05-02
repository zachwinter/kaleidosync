import cloneDeep from "lodash/cloneDeep"

const NAMESPACE = '__KALEIDOSYNC__'

function namespace (key) {
  return `${NAMESPACE}${key}`
}

export default {
  created () {
    this.setStateFromLocalStorage()
  },

  watch: {
    shader (val) {
      this.saveValue('shader', val)
    },

    uniforms (val) {
      this.saveValue('uniforms', val)
    }
  },

  data: () => ({
    initialized: false
  }),

  computed: {
    key () {
      return namespace(this.$options.name)
    }
  },

  methods: {
    saveValue (key, val) {
      if (!this.initialized) return
      const state = this.getState()
      state[key] = cloneDeep(val)
      this.saveToLocalStorage()
    },

    getState () {
      const state = window.localStorage.getItem(this.key)
      return JSON.parse(state)
    },

    async setStateFromLocalStorage () {
      const state = this.getState()
      if (!state || state.version !== this.version) {
        return this.saveToLocalStorage()
      }
      for (let key in state) {
        this[key] = state[key]
      }
      await this.$nextTick()
      this.initialized = true
    },

    async saveToLocalStorage() {
      const state = JSON.stringify({
        version: this.version,
        shader: this.shader,
        uniforms: this.uniforms
      })

      window.localStorage.setItem(this.key, state)
      await this.$nextTick()
      this.initialized = true
    }
  }
}