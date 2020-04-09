<template lang="pug">
.three
</template>

<script>
import * as THREE from 'three'
import visualizer from '@/mixins/visualizer'
import { interpolateBasis } from 'd3-interpolate'
import ease from '@/util/ease'
import { mapState } from 'vuex'

export default {
  mixins: [visualizer],

  props: {
    shader: {
      type: String,
      required: true
    },
    xBase: {
      type: Number,
      required: true
    }, 
    xTick: {
      type: Number,
      required: true
    },
    queues: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    dead: false
  }), 

  computed: mapState(['beatInterval']),

  mounted () {
    this.init()
  },

  destroyed () {
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
      this.uniforms = {
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

      this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
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

      window.addEventListener('resize', () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
      })
    },

    printUniforms () {
      let string = ''
      for (let key in this.uniforms) {
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

    paint (now) {
      const base = parseFloat(this.xBase)
      const tick = parseFloat(this.xTick)
      let volume = 1
      this.queues.forEach(queue => {
        volume *= this.getVolumeQueue(queue.name)
      })
      // const beat = interpolateBasis([base, tick * volume, base])(ease(this.activeIntervals.beats.progress))
      const tatum = interpolateBasis([base, base + (tick * volume), base])(ease(this.activeIntervals[this.beatInterval].progress))
      if (!isNaN(tatum)) this.uniforms.stream.value += tatum 
      this.uniforms.bounce.value = interpolateBasis([1, 5 * volume, 1])(ease(this.activeIntervals.bars.progress))
      this.uniforms.time.value = now
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>