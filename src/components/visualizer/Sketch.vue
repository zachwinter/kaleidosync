<template lang="pug">
Renderer(
  v-if="activeSketch"
  ref="renderer" 
  :sketch="sketch"
  :autosize="true",
  :activeIntervals="activeIntervals"
  :beatInterval="beatInterval"
  :volume="volume"
  :hidpi="hidpi"
  :stayAlive="true"
)
</template>

<script>
import { bind } from '@zach.winter/vue-common/util/store'
import { mapGetters } from 'vuex'
import Renderer from '@/components/common/Renderer'
import { timer } from '@zach.winter/common/js/timing'
import { interpolate } from 'd3-interpolate'
import { buildUniforms, getTweenableChanges, getBooleanChanges } from '@/util/uniforms'
import cloneDeep from 'lodash/cloneDeep'

let _stop = null

export default {
  components: { Renderer },
  data: () => ({
    intervalIndex: 0,
    activeIntervals: null,
    volume: 0
  }),
  computed: {
    ...mapGetters(['legacy']),
    ...bind([
      'player/shuffleVariants',
      'player/shuffleInterval',
      'player/shuffleIntervalMultiplier',
      'player/volumeQueues', 
      'player/beatInterval',
      'player/connected',
      'player/paused',
      'ui/fullScreen',
      'visualizer/hidpi',
      'visualizer/activeSketch',
      'visualizer/activeVariant',
      'visualizer/selectingSketch',
      'visualizer/sketch',
      'visualizer/tweenDuration'
    ]),
    sketchId () {
      return this.activeSketch?._id || null
    }
  },
  watch: {
    fullScreen () {
      this.$refs.renderer.onResize()
    },
    activeSketch: {
      handler (sketch) {
        this.setSketch(sketch)
      },
      immediate: true
    },
    activeVariant (i) {
      if (this.selectingSketch) return
      const from = this.sketch.uniforms
      const to = this.activeSketch.uniforms[i]
      this.tween({ from, to })
    },
    sketch (to, from) {
      if (this.selectingSketch || !from) return
      const booleanChanges = getBooleanChanges(to, from)
      if (booleanChanges.length) this.tween({ to, from })
    },
    async sketchId () {
      this.intervalIndex = 0
    },
    activeIntervals (val) {
      if (!val || !this.shuffleVariants) return
      const interval = val[this.shuffleInterval]
      if (!interval || this.intervalIndex === interval.index) return
      const totalVariants = this.activeSketch.uniforms.length - 1
      this.intervalIndex = interval.index
      if (this.intervalIndex % this.shuffleIntervalMultiplier !== 0) return
      this.$store.commit('visualizer/SET_TWEEN_DURATION', interval.duration * this.shuffleIntervalMultiplier / 2)
      if (this.activeVariant >= totalVariants) {
        this.$store.commit('visualizer/SET_ACTIVE_VARIANT', 0)
      } else {
        this.$store.commit('visualizer/SET_ACTIVE_VARIANT', this.activeVariant + 1)
      } 
    }
  },
  created () {
    this.setSketch(this.activeSketch)
  },
  async mounted () {
    this._t = window.__KALEIDOSYNC_LOOP__.watch('tick', async (now) => {
      if (this.legacy) {
        await this.$store.dispatch('player/legacySync')
      } else {
        await this.$store.dispatch('player/sync')
      }
      if (this.$refs.renderer) this.$refs.renderer.tick(now) 
    }).id
    this._aI = window.__KALEIDOSYNC_LOOP__.watch('activeIntervals', val => this.activeIntervals = Object.freeze(val)).id
    this._v = window.__KALEIDOSYNC_LOOP__.watch('volume', val => this.volume = Object.freeze(val)).id
  },
  beforeDestroy () {
    window.__KALEIDOSYNC_LOOP__.unwatch('tick', this._t)
    window.__KALEIDOSYNC_LOOP__.unwatch('activeIntervals', this._aI)
    window.__KALEIDOSYNC_LOOP__.unwatch('volume', this._v)
  },
  methods: {
    setSketch (sketch) {
      if (!sketch) return
      const { shader, uniforms: u, _id } = sketch
      try {
        if (typeof _stop === 'function') _stop()
        const uniforms = buildUniforms(u[0])
        this.$store.commit('visualizer/SET_ACTIVE_VARIANT', 0)
        this.$store.commit('visualizer/SET_SKETCH', { shader, uniforms, _id })
      } catch (e) {
        console.log(e)
      }
    },
    async tween ({ from, to }) {
      const tweenableChanges = getTweenableChanges(to, from)
      const booleanChanges = getBooleanChanges(to, from)
      const interpolators = Object.keys(tweenableChanges).reduce((acc, key) => {
        acc[key] = tweenableChanges[key].reduce((acc, change) => {
          acc[change] = interpolate(from[key][change], to[key][change])
          return acc
        }, {})
        return acc
      }, {})
      const uniforms = cloneDeep(from)
      if (typeof _stop === 'function') _stop()
      await timer(this.tweenDuration || 350, ({ progress, stop }) => {
        _stop = stop
        Object.keys(interpolators).forEach(key => {
          Object.keys(interpolators[key]).forEach(interpolator => {
            uniforms[key][interpolator] = interpolators[key][interpolator](progress)
          })
        })
        booleanChanges.forEach(key => {
          uniforms[key].value = to[key].value
          uniforms[`${key}Tween`] = { value: true, type: 'boolean', visible: false }
          uniforms[`${key}TweenProgress`] = { value: progress, type: 'number', visible: false }
        })
        this.$store.commit('visualizer/SET_SKETCH', { shader: this.sketch.shader, uniforms, _id: this.sketch._id })
      })
      this.$store.commit('visualizer/SET_TWEEN_DURATION', null)
      booleanChanges.forEach(key => {
        uniforms[`${key}Tween`] = { value: false, type: 'boolean', visible: false }
        uniforms[`${key}TweenProgress`] = { value: 0, type: 'number', visible: false }
      })
      this.$store.commit('visualizer/SET_SKETCH', { shader: this.sketch.shader, uniforms, _id: this.sketch._id })
    }
  }
}
</script>