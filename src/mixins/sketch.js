import localstorage from "./localstorage";
import Scene from '@/components/Scene'

export default {
  mixins: [localstorage],
  components: { Scene },
  methods: {
    update ({ key, value }) {
      this[key] = value
    },

    onReset ({ shader, queues, uniforms, booleans, beatInterval }) {
      this.shader = shader
      this.queues = queues
      this.uniforms = uniforms
      this.beatInterval = beatInterval
      this.booleans = booleans
    },

    copyShader () {
      navigator.clipboard.writeText(this.shader)
    },

    copyUniforms () {
      const uniforms = JSON.stringify(this.uniforms)
      navigator.clipboard.writeText(uniforms)
    }
  }
}