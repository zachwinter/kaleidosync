<template lang="pug">
.visualizer
  Buttons(v-if="educated")
  transition(name="fadeyn")
    Header(v-if="menuVisible")
  NowPlaying
  transition(name="fade")
    Spinner(v-if="showSpinner")
  transition(name="fadey")
    Toast(v-if="toast.visible")
  transition(name="fadey")
    Announcement(v-if="!educated")
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
import Announcement from '@/components/Announcement'
import Trails from '@/sketches/Trails'
import Fractal from '@/sketches/Fractal'
import Gloop from '@/sketches/Gloop'
import Flower from '@/sketches/Flower'
import Blobs from '@/sketches/Blobs'
import Kaleidosync from '@/sketches/Kaleidosync'
import Wavesync from '@/sketches/Wavesync'
import { FETCHING } from '@/store/modules/spotify'
import { SET_TOAST_VISIBLE } from '@/store/modules/ui'

export default {
  components: {
    Buttons,
    Header,
    NowPlaying,
    Spinner,
    Toast,
    Announcement,
    Trails, 
    Fractal, 
    Blobs,
    Kaleidosync,
    Wavesync,
    Gloop,
    Flower
  },
  computed: {
    ...mapState({
      selectedVisualizer: ({ ui }) => ui.selectedVisualizer,
      educated: ({ ui }) => ui.educated,
      loadingNextSong: ({ spotify }) => spotify.loadingNextSong,
      toast: ({ ui }) => ui.toast,
      menuVisible: ({ ui }) => ui.menuVisible,
      initialized: ({ spotify }) => spotify.initialized,
      noPlayback: ({ spotify }) => spotify.noPlayback,
      showSpinner: ({ spotify }) => spotify.status.trackAnalysis === FETCHING
    }),
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
        case 'flower':
          return 'Flower'
        default:
          return null
      }
    }
  },
    watch: {
      showSpinner (val) {
        if (val) {
          this.$store.commit(`ui/${SET_TOAST_VISIBLE}`, false)
        }
      }
    },
  created () {
    this.$store.dispatch('ui/resetToast')
  },
  async mounted () {
    this.$store.dispatch('spotify/readTokens')
    this.$store.dispatch('ui/toast', { message: 'Connecting to Spotify' })
    if (this.$ga) this.$ga.page('/visualizer')
    await pause(1000)
    this.$store.dispatch('spotify/getCurrentlyPlaying')
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
      this.$store.dispatch('ui/hover')
    }
  }
}
</script>