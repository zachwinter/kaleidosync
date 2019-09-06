<template lang="pug">
.visualizer
  Buttons
  transition(name="fadeyn")
    Header(v-if="menuVisible")
  NowPlaying
  transition(name="fade")
    Spinner(v-if="spinnerVisible")
  transition(name="fadey")
    Toast(v-if="toast.visible")
  //- transition(name="fade")
  //-   TrailsGUI(v-if="selectedVisualizer === 'trails'")
</template>

<script>
import { mapState } from 'vuex'
import MultiViz from '@/util/multi-viz'
import NowPlaying from '@/components/NowPlaying'
import Spinner from '@/components/Spinner'
import Toast from '@/components/Toast'
import Buttons from '@/components/Buttons'
import Header from '@/components/Header'
import VISUALIZERS from '@/enums'
import TrailsGUI from '@/components/TrailsGUI'
import {
  SET_SPINNER_VISIBLE,
  SET_TOAST_VISIBLE,
  SET_CURRENTLY_PLAYING,
  SET_HIDE_ALL
} from '@/vuex/mutation-types'

export default {
  name: 'visualizer',
  components: {
    NowPlaying,
    Spinner,
    Toast,
    Buttons,
    Header,
    TrailsGUI
  },
  computed: {
    ...mapState(['menuVisible', 'spinnerVisible', 'hover', 'toast', 'selectedVisualizer']),
  },
  watch: {
    selectedVisualizer (val) {
      this.setVisualizerSize(val)
    }
  },
  methods: {
    mousemove () {
      this.$store.dispatch('hover')
    },
    watchers () {
      this.multiviz.sync.state.watch('loadingNextSong', val => {
        this.$store.commit(SET_SPINNER_VISIBLE, val)
        this.$store.commit(SET_TOAST_VISIBLE, false)
      })

      this.multiviz.sync.state.watch('currentlyPlaying', val => {
        this.$store.commit(SET_CURRENTLY_PLAYING, val)
      }) 

      this.multiviz.sync.state.watch('noPlayback', val => {
        if (val === true) {
          this.$store.commit(SET_HIDE_ALL, true)
          this.$store.dispatch('toast', {
            message: 'No playback detected',
            autoHide: false
          })  
          this.$store.commit(SET_HIDE_ALL, false)
        } else {
          this.$store.commit(SET_TOAST_VISIBLE, false)
        }
      })
    },

    setVisualizerSize (val) {
      const MAX_PIXELS = 400 * 900
      const isMobile = (window.innerWidth * window.innerHeight) <= MAX_PIXELS

      this.multiviz.selectedVisualizer = val
    
      if (val === 'trails') { 
        this.multiviz.sketch.setSize(isMobile)
      }
      
      if (val === 'kaleidosync') {
        this.multiviz.sketch.setSize(isMobile)
      }

      if (val === 'wavesync') {
        this.multiviz.sketch.setSize(isMobile)
      }

      if (val === 'blobs') {
        this.multiviz.sketch.setSize(true)
      }
    }
  },
  mounted () {
    const canvas = document.getElementsByTagName('canvas')[0]

    if (canvas) {
      canvas.remove()
    } 

    this.multiviz = new MultiViz(this.$store)

    this.$store.dispatch('toast', {
      message: 'Connecting to Spotify'
    })

    this.setVisualizerSize(this.selectedVisualizer)

    window.addEventListener('resize', () => {
      this.setVisualizerSize(this.selectedVisualizer)
    })

    this.watchers()

    if (this.$ga) {
      this.$ga.page('/visualizer')

      this.$ga.event({
        eventCategory: 'visualizer',
        eventAction: 'mounted',
        eventLabel: this.selectedVisualizer,
        eventValue: VISUALIZERS[this.selectedVisualizer.toUppercase()].id
      })
    }
  },
  beforeMount () {
    document.body.addEventListener('mousemove', this.mousemove.bind(this))
    document.body.addEventListener('touchstart', this.mousemove.bind(this))
  },
  beforeDestroy () {
    document.body.removeEventListener('mousemove', this.mousemove.bind(this))
    document.body.removeEventListener('touchstart', this.mousemove.bind(this))
  }
}
</script>

<style lang="scss">     
canvas {
  @include position(fixed, 0 null null 0);
  @include size(100%);
  z-index: 0;
}   
</style> 