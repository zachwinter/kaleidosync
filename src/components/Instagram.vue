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
a {
  @include size(80px, 80px);
  @include position(fixed, 140px null null 30px);
  z-index: 100000;
  background: black;
  padding: 30px;
  border: 0;
  outline: 0;
  display: block;
  
  &:hover { outline: 0; }

  @include max-width(header) {
    @include size(40px);
    padding: 10px;
    top: 90px;
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