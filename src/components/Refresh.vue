<template lang="pug">
.refresh
  transition(name="fadeyn")
    button(v-if="!menuVisible && hover" @click="ping"): RefreshIcon
</template>

<script>
import { mapState } from 'vuex'
import RefreshIcon from '@/assets/svg/refresh.svg'

export default {
  components: { RefreshIcon },
  computed: mapState({
    menuVisible: ({ ui }) => ui.menuVisible,
    hover: ({ ui }) => ui.hover
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