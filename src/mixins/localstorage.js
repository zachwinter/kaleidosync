const NAMESPACE = '__KALEIDOSYNC__'

function namespace (key) {
  return `${NAMESPACE}${key}`
}

export default {
  created () {
    this.setStateFromLocalStorage()
  },

  watch: {
    shader () {
      this.saveToLocalStorage()
    },

    uniforms () {
      this.saveToLocalStorage()
    },

    booleans () {
      this.saveToLocalStorage()
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
        uniforms: this.uniforms,
        booleans: this.booleans
      })

      window.localStorage.setItem(this.key, state)
      await this.$nextTick()
      this.initialized = true
    }
  }
}