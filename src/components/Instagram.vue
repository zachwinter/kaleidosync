<template lang="pug">
  transition(name="fadeyn")
    a(v-if="!menuVisible && (hover || showSettings )" href="https://www.instagram.com/zachary.io" target="instagram"): Instagram
</template>

<script>
import { mapState } from 'vuex'
import Instagram from '@/assets/svg/instagram.svg'

export default {
  components: { Instagram },
  computed: mapState({
    menuVisible: ({ ui }) => ui.menuVisible,
    hover: ({ ui }) => ui.hover,
    showSettings: ({ user }) => user.showSettings
  })
}
</script>

<style lang="scss" scoped>
a { @include menu-button; }
</style>