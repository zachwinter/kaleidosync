<template lang="pug">
.full-screen(v-if="offerFullscreen")
  IconButton(icon="expand" @click.native="$store.dispatch('ui/toggleFullScreen')")
</template>

<script>
import IconButton from '@/components/common/IconButton'

export default {
  components: { IconButton },
  data: () => ({
    offerFullscreen: false
  }),
  created () {
    if (document.fullscreenEnabled === true) {
      this.offerFullscreen = true
      document.onfullscreenchange = () => {
        if (!document.fullscreen) {
          this.$store.commit('ui/SET_FULL_SCREEN', false)
          //document.body.style.cursor = 'default'
        } else {
          //document.body.style.cursor = 'none'
        }
      }
    }
  },
}
</script>