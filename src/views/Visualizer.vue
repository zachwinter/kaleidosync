<template lang="pug">
.visualizer
  Buttons
  transition(name="fadeyn")
    Header(v-if="menuVisible")
  NowPlaying
  transition(name="fade")
    Spinner(v-if="loadingNextSong")
  transition(name="fadey")
    Toast(v-if="toast.visible")
  component(:is="activeVisualizer")
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'
import Buttons from '@/components/Buttons'
import Spinner from '@/components/Spinner'
import NowPlaying from '@/components/NowPlaying'
import Toast from '@/components/Toast'
import { pause } from '@/util/timing'
import Trails from '@/sketches/Trails'
import Fractal from '@/sketches/Fractal'
import Gloop from '@/sketches/Gloop'
import Blobs from '@/sketches/Blobs'
import Kaleidosync from '@/sketches/Kaleidosync'
import Wavesync from '@/sketches/Wavesync'

export default {
  components: {
    Buttons,
    Header,
    NowPlaying,
    Spinner,
    Toast,
    Trails, 
    Fractal, 
    Blobs,
    Kaleidosync,
    Wavesync,
    Gloop
  },
  computed: {
    ...mapState([
      'selectedVisualizer', 
      'headerVisible', 
      'loadingNextSong', 
      'toast',
      'menuVisible'
    ]),
    activeVisualizer () {
      switch (this.selectedVisualizer) {
        case 'trails':
          return 'Trails'
        case 'fractal':
          return 'Fractal'
        case 'blobs':
          return 'Blobs'
        case 'kaleidosync':
          return 'Kaleidosync'
        case 'wavesync':
          return 'Wavesync'
        case 'gloop':
          return 'Gloop'
        default:
          return null
      }
    }
  },
  async mounted () {
    this.$store.dispatch('readTokens')
    this.$store.dispatch('toast', {
      message: 'Connecting to Spotify'
    })
    if (this.$ga) this.$ga.page('/visualizer')
    await pause(1000)
    this.$store.dispatch('getCurrentlyPlaying')
  },
  beforeMount () {
    document.body.addEventListener('mousemove', this.mousemove.bind(this))
    document.body.addEventListener('touchstart', this.mousemove.bind(this))
  },
  beforeDestroy () {
    document.body.removeEventListener('mousemove', this.mousemove.bind(this))
    document.body.removeEventListener('touchstart', this.mousemove.bind(this))
  },
  methods: {
    mousemove () {
      this.$store.dispatch('hover')
    }
  }
}
</script>