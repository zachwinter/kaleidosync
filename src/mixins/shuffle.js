import { bind } from '@zach.winter/vue-common/util/store'

export default {
  data: () => ({
    intervalIndex: 0,
  }),
  computed: {
    ...bind([
      'player/activeIntervals',
      'player/shuffleVariants',
      'player/shuffleInterval',
      'player/shuffleIntervalMultiplier',
      'visualizer/activeSketch',
      'visualizer/activeVariant',
    ]),
    sketchId () {
      return this.activeSketch?._id || null
    }
  },
  watch: {
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
}