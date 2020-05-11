<template lang="pug">
.refresh
  transition(name="fadeyn")
    button(v-if="!menuVisible && (hover || showSettings)" @click="ping" :disabled="retrying"): RefreshIcon
</template>

<script>
import { mapState } from 'vuex'
import RefreshIcon from '@/assets/svg/refresh.svg'

export default {
  components: { RefreshIcon },
  computed: mapState({
    menuVisible: ({ ui }) => ui.menuVisible,
    hover: ({ ui }) => ui.hover,
    retrying: ({ spotify }) => spotify.retrying,
    showSettings: ({ user }) => user.showSettings
  }),
  methods: {
    ping () {
      this.$store.dispatch('spotify/getCurrentlyPlaying')
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  @include menu-button;
}
</style>