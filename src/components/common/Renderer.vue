<template lang="pug">
.renderer(ref="container" :class="{ fixed: !autosize }")
</template>

<script>
import { Uniform } from 'three/src/core/Uniform'
import { Vector2 } from 'three/src/math/Vector2'
import { Vector3 } from 'three/src/math/Vector3'
import { Vector4 } from 'three/src/math/Vector4'
import { Scene } from 'three/src/scenes/Scene'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera'
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial'
import { Mesh } from 'three/src/objects/Mesh'
import { FrontSide } from 'three/src/constants'
import interpolateBasis from 'd3-interpolate/src/basis'
import ease from '@zach.winter/common/js/ease'

export default {
  props: {
    sketch: {
      type: Object
  },
    autosize: {
      type: Boolean,
      default: false
    },
    activeIntervals: {
      type: Object,
      default: null
    },
    beatInterval: {
      type: String,
      default: null
    },
    volume: {
      type: Number,
      default: null
    },
    hidpi: {
      type: Boolean,
      default: true
    },
    patchBools: {
      type: Boolean,
      default: false
    },
    stayAlive: {
      type: Boolean,
      default: false
    },
    homepage: {
      type: Boolean,
      default: false
    }
  },
  
  watch: {
    async sketch (val, old) {
      if (old && val._id !== old._id && JSON.stringify(old.uniforms) === JSON.stringify(val.uniforms)) return
      await this.$nextTick()
      this.buildUniforms()
      this.composeShader()
    },
    async hidpi () {
      await this.$nextTick()
      this.onResize()
    }
  },

  mounted () {
    this.init()
    window.addEventListener('resize', this.onResize.bind(this))
  },

  beforeDestroy () {
    if (!this.homepage) this.die()
  },

  methods: {
    init () {
      this.buildScene()
      this.buildUniforms()
      this.initMaterial()
    },
    buildScene () {
      if (!this.$refs.container) return
      const el = document.createElement('canvas')
      this.$refs.container.appendChild(el)
      const { width, height } = this.getSize()
      this.scene = new Scene()
      this.renderer = new WebGLRenderer({
        canvas: el,
        powerPreference: 'high-performance'
      })
      if (!this.homepage) {
        this.renderer.domElement.addEventListener('webglcontextlost', () => {
          if (this.stayAlive) {
            this.die()
            this.init()
          }
        })
      }
      this.renderer.setClearColor( '#000000', 1 )
      this.camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1)
      this.renderer.setSize(width, height)

      if (this.hidpi) this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      window.renderer = this.renderer
      this.geometry = new PlaneGeometry(2, 2)
    },

    buildUniforms () {
      const { uniforms } = this.sketch

      if (!this._uniforms) {
        const { width, height } = this.getSize()
        this._uniforms = {
          resolution: new Uniform(new Vector2(width, height)),
          time: new Uniform(0),
          stream: new Uniform(0),
          volume: new Uniform(1)
        }
      }

      if (!uniforms) return
      
      const keep = ['time', 'resolution', 'stream', 'volume']

      for (let key in uniforms) {
        switch (uniforms[key].type) {
          case 'number':
            this._uniforms[key] = new Uniform(parseFloat(uniforms[key].value))
            break
          case 'color':
            var [r, g, b] = uniforms[key].value
            this._uniforms[key] = new Uniform(new Vector3(r, g, b))
            break
          case 'boolean':
            this._uniforms[key] = new Uniform(uniforms[key].value)
            if (this.patchBools) {
              this._uniforms[`${key}Tween`] = new Uniform(false)
              this._uniforms[`${key}TweenProgress`] = new Uniform(0)
              keep.push(`${key}Tween`)
              keep.push(`${key}TweenProgress`)
            }
            break
        }
      }

      const uniformKeys = Object.keys(uniforms)

      Object.keys(this._uniforms).forEach(key => {
        if (keep.indexOf(key) !== -1) return
        if (uniformKeys.indexOf(key) === -1) delete this._uniforms[key]
      })
    },

    initMaterial () {
      this.material = new ShaderMaterial({
        uniforms: this._uniforms,
        side: FrontSide,
        vertexShader: `
          ${this.printUniforms()}
          void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader:`
          ${this.printUniforms()}
          ${this.sketch.shader}
        `
      })
      this.mesh = new Mesh(this.geometry, this.material)
      this.scene.add(this.mesh)
    },

    composeShader () {
      this.material.fragmentShader = `
        ${this.printUniforms()}
        ${this.sketch.shader}`
      this.material.needsUpdate = true
    },

    printUniforms () {
      return Object.keys(this._uniforms).reduce((acc, key) => {
        let { value, type } = this._uniforms[key]
        if (typeof value === 'number') type = 'number'
        if (typeof value === 'boolean') type = 'boolean'
        if (value instanceof Vector2) type = 'vec2'
        if (value instanceof Vector3) type = 'vec3'
        if (value instanceof Vector4) type = 'vec4'
        switch (type) {
          case 'number':
            acc += `uniform float ${key};\n`
            break
          case 'boolean':
            acc += `uniform bool ${key};\n`
            break
          case 'vec2':
            acc += `uniform vec2 ${key};\n`
            break
          case 'vec3':
            acc += `uniform vec3 ${key};\n`
            break
          case 'vec4':
            acc += `uniform vec4 ${key};\n`
            break
        }
        return acc
      }, `varying vec2 vUv;`)
    },

    getSize () {
      const parent = this.$el.parentElement
      let width = window.innerWidth
      let height = window.innerHeight
      if (this.autosize) {
        const _styles = window.getComputedStyle(parent)
        const border = parseFloat(_styles['border-right-width'])
        width = parent.offsetWidth - border * (this.hidpi ? Math.min(window.devicePixelRatio, 2) : 1)
        height = parent.offsetHeight - border * (this.hidpi ? Math.min(window.devicePixelRatio, 2) : 1)
      }

      return { width, height }
    },

    async onResize () {
      await this.$nextTick()
      const { width, height } = this.getSize()
      if (this._uniforms) this._uniforms.resolution = new Uniform(new Vector2(width, height))
      this.renderer?.setSize(width, height)
      this.renderer?.setPixelRatio(this.hidpi ? Math.min(window.devicePixelRatio, 2) : 1)
    },

    async tick (now = window.performance.now()) {
      if (this._uniforms) this._uniforms.time.value = now / 1000

      if (this.activeIntervals) {
        const base = parseFloat(this._uniforms.speed.value)
        const tick = parseFloat(this._uniforms.bump.value) * this.volume
        const progress = this.activeIntervals[this.beatInterval].progress
        const stream = interpolateBasis([base, ((base) + (tick)), base])(ease(progress, 'easeOutCubic'))
        if (this._uniforms) {
          this._uniforms.stream.value += stream
          this._uniforms.volume.value = this.volume 
        }
      } else {
       if (this._uniforms) this._uniforms.stream.value = this._uniforms.time.value
       if (this.volume !== null) this._uniforms.volume.value = this.volume
      }

      if (this.sketch.shader) this.renderer.render(this.scene, this.camera)
    },

    die () {
      this.renderer?.forceContextLoss()
      this.renderer = this.renderer || {}
      this.renderer.context = null
      this.renderer?.domElement?.remove()
      this.renderer = null
    }
  }
}
</script>

<style lang="scss">
.renderer {
  &.fixed { @include position(fixed, 0 null null 0); }
}
</style>