import { mapState, mapGetters } from 'vuex'
import Canvas from '@/components/Canvas'
import addRemovedHook from 'vue-removed-hook-mixin'

export default {
  mixins: [addRemovedHook],
  components: { Canvas },
  computed: {
    ...mapState({
      active: ({ spotify }) => spotify.active,
      trackProgress: ({ spotify }) => spotify.trackProgress,
      volumeQueues: ({ spotify }) => spotify.volumeQueues,
      activeIntervals: ({ spotify }) => spotify.activeIntervals,
      trackFeatures: ({ spotify }) => spotify.trackFeatures,
      beatInterval: ({ spotify }) => spotify.beatInterval
    }),
    ...mapGetters([
      'segment',
      'tatum',
      'beat',
      'bar',
      'section'
    ])
  },
  watch: {
    active: {
      handler (val) {
        if (val) {
          this.start()
        } else {
          this.stop()
        }
      }, 
      immediate: true
    },
    'beat' (val, { index }) {
      if (typeof this.onBeat === 'function' && val.index !== index) this.onBeat(val)
    },
    'tatum' (val, { index }) {
      if (typeof this.onTatum === 'function' && val.index !== index) this.onTatum(val)
    },
    'segment' (val, { index }) {
      if (typeof this.onSegment === 'function' && val.index !== index) this.onSegment(val)
    },
    'section' (val, { index }) {
      if (typeof this.onSection === 'function' && val.index !== index) this.onSection(val)
    },
    'bar' (val, { index }) {
      if (typeof this.onBar === 'function' && val.index !== index) this.onBar(val)
    }
  },
  removed () {
    this.__stop__ = true
    this.stop()
  },
  methods: {
    start () {
      requestAnimationFrame(this.tick.bind(this))
    },
    
    stop () {
      cancelAnimationFrame(this.tick.bind(this))
    },

    async tick (now) {
      if (!this.__stop__ && this.active) requestAnimationFrame(this.tick.bind(this))
      await this.$store.dispatch('spotify/tickUpdate')
      if (typeof this.paint === 'function') this.paint(now)
    },

    registerVolumeQueue (name, totalSamples, smoothing) {
      this.$store.dispatch('spotify/registerVolumeQueue', {
        name,
        totalSamples,
        smoothing
      })
    },

    getVolumeQueue (name) {
      return this.volumeQueues[name].volume
    }
  }
}