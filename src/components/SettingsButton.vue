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
button {
  @include size(80px, 80px);
  @include position(fixed, 360px null null 30px);
  z-index: 100000;
  background: black;
  padding: 30px;
  border: 0;
  outline: 0;
  
  &:hover { outline: 0; }

  @include max-width(header) {
    @include size(40px);
    padding: 10px;
    top: 210px;
  }

  svg {
    @include size(100%, auto);
    display: block;

    * {
      fill: white;
      transition: fill 100ms linear;
    }
  }

  &:hover svg * { fill: $blue; }
}
</style>