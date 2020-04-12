<template lang="pug">
.fullscreen
  transition(name="fadeyn")
    button(v-if="(!menuVisible && hover) && offerFullscreen" @click="fullScreen")
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
    hover: ({ ui }) => ui.hover
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
  @include position(fixed, 250px null null 30px);
  z-index: 100000;
  background: black;
  padding: 30px;
  border: 0;
  outline: 0;
  
  &:hover { outline: 0; }

  @include max-width(header) {
    @include size(40px);
    padding: 10px;
    top: 150px;
  }

  svg {
    @include size(100%);

    * {
      fill: white;
      transition: fill 100ms linear;
    }
  }

  &:hover svg * { fill: $blue; }
}
</style>