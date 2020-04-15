<template lang="pug">
.three
</template>

<script>
import * as THREE from 'three'
import visualizer from '@/mixins/visualizer'
import { interpolateBasis } from 'd3-interpolate'
import ease from '@/util/ease'
// import cloneDeep from 'lodash/cloneDeep'

const DEFAULT_UNIFORMS = {
  resolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
  time: {
    value: 0
  },
  stream: {
    value: 0
  },
  volume: {
    value: 0
  },
  bounce: {
    value: 0
  }
}

export default {
  mixins: [visualizer],

  props: {
    shader: {
      type: String,
      required: true
    },
    queues: {
      type: Array,
      required: true
    },
    uniforms: {
      type: Object,
      required: false
    }
  },

  data: () => ({
    dead: false
  }), 

  watch: {
    async uniforms () {
      await this.$nextTick()
      this.applyUniforms({ update: true })
    },
    shader (val) {
      this.updateShader(val)
    }
  },

  mounted () {
    this.init()
  },

  destroyed () {
    window.removeEventListener('resize', this.onResize.bind(this))
    this.dead = true
    this.renderer.domElement.remove()
  },

  methods: {
    init () {
      this.queues.forEach(({ name, totalSamples, smoothing }) => {
        this.registerVolumeQueue(name, totalSamples, smoothing)
      })
      this.scene = new THREE.Scene()
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setClearColor( '#000000', 1 )
      this.camera = new THREE.PerspectiveCamera(170, window.innerWidth/window.innerHeight, .1, 1000)
      this.camera.position.z = 10
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight,1,1)
      this.clock = new THREE.Clock()
      this.applyUniforms({ init: true })
      this.material = new THREE.ShaderMaterial({
        uniforms: this._uniforms,
        side: THREE.DoubleSide,
        vertexShader: `
          ${this.printUniforms()}
          void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          ${this.printUniforms()}
          ${this.shader}
        `
      })

      this.mesh = new THREE.Mesh(this.geometry, this.material)
      this.scene.add(this.mesh)
      document.body.appendChild(this.renderer.domElement)
      window.addEventListener('resize', this.onResize.bind(this))
    },

    printUniforms () {
      let string = ''
      for (let key in this._uniforms) {
        if (key !== '0') {
          if (key === 'resolution') {
            string += `uniform vec2 ${key};\n`
          } else {
            string += `uniform float ${key};\n`
          }
        }
      }
      string += `
        varying vec2 vUv; 
      `
      return string
    },

    applyUniforms ({ init = false, update = false } = {}) {
      if (init) {
        this._uniforms = {
          ...DEFAULT_UNIFORMS,
          ...this.uniforms
        }
      } else if (update) {
        for (let key in this.uniforms) {
          this._uniforms[key] = this.uniforms[key]
        }
      }
      
      this.updateShader(this.shader)
    },

    updateShader (val) {
      if (!this.material) return
      this.material.fragmentShader = `
        ${this.printUniforms()}
        ${val}
      `
      this.material.needsUpdate = true
    },

    paint (now) {
      const base = parseFloat(this._uniforms.xBase.value)
      const tick = parseFloat(this._uniforms.xTick.value)
      let volume = 1
      this.queues.forEach(queue => {
        volume *= this.getVolumeQueue(queue.name)
      })
      const tatum = interpolateBasis([base, base + (tick * volume), base])(ease(this[this.beatInterval].progress))
      if (!isNaN(tatum)) this._uniforms.stream.value += tatum 
      this._uniforms.bounce.value = interpolateBasis([1, 1 + (3 * volume), 1])(ease(this.beat.progress, 'easeOutCubic'))
      this._uniforms.time.value = now
      this.renderer.render(this.scene, this.camera)
    },

    onResize () {
      if (this._uniforms) this._uniforms.resolution = new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight))
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(window.devicePixelRatio)
    }
  }
}
</script>