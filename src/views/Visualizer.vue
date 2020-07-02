<template lang="pug">
.visualizer
  Hamburger
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
import Hamburger from '@/components/Hamburger'
import Trails from '@/sketches/Trails'
import Fractal from '@/sketches/Fractal'
import Gloop from '@/sketches/Gloop'
import Flower from '@/sketches/Flower'
import Blobs from '@/sketches/Blobs'
import Kaleidosync from '@/sketches/Kaleidosync'
import Neon from '@/sketches/Neon'
import Zoom from '@/sketches/Zoom'
import Template from '@/sketches/Template'
import Orbs from '@/sketches/Orbs'
import { FETCHING } from '@/store/modules/spotify'
import { SET_TOAST_VISIBLE } from '@/store/modules/ui'

export default {
  components: {
    Buttons,
    Header,
    NowPlaying,
    Spinner,
    Toast,
    Hamburger,
    Announcement,
    Trails, 
    Fractal, 
    Blobs,
    Kaleidosync,
    Neon,
    Gloop,
    Flower,
    Template,
    Zoom,
    Orbs
  },
  computed: {
    ...mapState({
      selectedVisualizer: ({ user }) => user.selectedVisualizer,
      educated: ({ user }) => user.educated,
      loadingNextSong: ({ spotify }) => spotify.loadingNextSong,
      toast: ({ ui }) => ui.toast,
      menuVisible: ({ ui }) => ui.menuVisible,
      initialized: ({ spotify }) => spotify.initialized,
      noPlayback: ({ spotify }) => spotify.noPlayback,
      showSpinner: ({ spotify }) => spotify.status.trackAnalysis === FETCHING
    }),
    activeVisualizer () {
      return this.selectedVisualizer.charAt(0).toUpperCase() + this.selectedVisualizer.slice(1)
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

<style lang="scss">
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity 1s $slide-easing;
}

.component-fade-enter {
  z-index: 1;
  opacity: 0;
}

.component-fade-enter-to {
  z-index: 1;
  opacity: 1;
}

.component-fade-leave {
  z-index: 0;
  opacity: 1;
}

.component-fade-leave-to {
  z-index: 0;
  opacity: 1;
}
</style>