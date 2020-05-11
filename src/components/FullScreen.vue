<template lang="pug">
.fullscreen
  transition(name="fadeyn")
    button(v-if="(!menuVisible && (hover || showSettings)) && offerFullscreen" @click="fullScreen")
      FullScreenIcon
</template>

<script>
import { mapState } from 'vuex'
import FullScreenIcon from '@/assets/svg/full-screen.svg'

export default {
  components: { FullScreenIcon },
  data () {
    return {
      offerFullscreen: false,
      isFullscreen: false
    }
  },
  computed: mapState({
    menuVisible: ({ ui }) => ui.menuVisible,
    hover: ({ ui }) => ui.hover,
    showSettings: ({ user }) => user.showSettings
  }),
  methods: {
    fullScreen () {
      if (this.isFullscreen) {
        document.exitFullscreen()
      } else {
        document.body.requestFullscreen()
      }
    }
  },
  created () {
    if (document.fullscreenEnabled === true) {
      this.offerFullscreen = true
      document.onfullscreenchange = () => {
        this.isFullscreen = document.fullscreen
      }
      this.isFullscreen = document.fullscreen
    }
  },
  beforeDestroy () {
    document.onfullscreenchange = () => {}
  }
}
</script>

<style lang="scss" scoped>
button { @include menu-button; }
</style>