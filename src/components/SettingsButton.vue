<template lang="pug">
.settings
  transition(name="fadeyn")
    button(v-if="(!menuVisible && (hover || showSettings))" @click="$store.dispatch('user/toggleSettings')")
      SettingsIcon
</template>

<script>
import { mapState } from 'vuex'
import SettingsIcon from '@/assets/svg/settings-icon.svg'

export default {
  components: { SettingsIcon },
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
button {@include menu-button; }
</style>