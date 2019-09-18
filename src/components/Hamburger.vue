<template lang="pug">
.container
  transition(name="fadeyn")
    .hamburger-container(:class="{ open: menuVisible }" @click="toggleMenu" v-if="menuVisible || hover")
      .hamburger
        .inner
        .inner
</template>

<script>
import { mapState } from 'vuex'
import { SET_MENU_VISIBLE } from '@/vuex/mutation-types'

export default {
  computed: {
    ...mapState(['menuVisible', 'hover'])
  },
  methods: {
    toggleMenu() {
      this.$store.commit(SET_MENU_VISIBLE, !this.menuVisible)
    }
  }
}
</script>

<style lang="scss" scoped>
$transition: 300ms $bounce-easing;
$angle: 45deg;  

.hamburger-container {
  @include size(80px, 80px);
  @include position(fixed, 30px null null 30px);
  z-index: 10000;
  background: black;
  padding: 30px;

  @include max-width(header) {
    @include size(40px);
    padding: 10px;
  }

  &:hover {
    .inner, .hamburger:before, .hamburger:after {
      background: $blue;
    }
  }

  &:active {
    .inner, .hamburger:before, .hamburger:after {
      background: $blue;
    }
  }
}

.hamburger {
  @include size(100%);
  position: relative;
  z-index: 100;
}

.inner, .hamburger:before, .hamburger:after {
  @include size(100%, 3px);
  content: '';
  background: white;
  display: block;
  transition: all $transition, background 100ms linear;
}

.inner {
  @include position(absolute, 50% 0 null 0);
  transform: translateY(-50%);
}

.hamburger:before {
  @include position(absolute, 0 0 null 0);
}

.hamburger:after {
  @include position(absolute, null 0 0 0);
} 

.open {
  .inner {
    transform: rotate($angle);
    transform-origin: center center;
  }

  .inner + .inner {
    transform: rotate(-$angle);
    transform-origin: center center;
  }

  .hamburger:before, .hamburger:after {
    opacity: 0;
  }
}
</style>