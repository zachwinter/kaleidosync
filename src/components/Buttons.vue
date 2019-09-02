<template lang="pug">
.container
  transition(name="fadeyn")
    .hamburger-container(v-if="menuVisible || hover" :class="{ open }" @click="toggleMenu")
      .hamburger
        .inner
        .inner
  transition(name="fadeyn")
    button.fullscreen(v-if="(!menuVisible && hover) && offerFullscreen" @click="fullScreen")
      svg(viewBox="0 0 482.239 482.239" xmlns="http://www.w3.org/2000/svg")
        path(d="m0 17.223v120.56h34.446v-103.337h103.337v-34.446h-120.56c-9.52 0-17.223 7.703-17.223 17.223z")
        path(d="m465.016 0h-120.56v34.446h103.337v103.337h34.446v-120.56c0-9.52-7.703-17.223-17.223-17.223z")
        path(d="m447.793 447.793h-103.337v34.446h120.56c9.52 0 17.223-7.703 17.223-17.223v-120.56h-34.446z")
        path(d="m34.446 344.456h-34.446v120.56c0 9.52 7.703 17.223 17.223 17.223h120.56v-34.446h-103.337z")
</template>

<script>
import { SET_MENU_VISIBLE } from '@/vuex/mutation-types'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      open: false,
      offerFullscreen: false,
      isFullscreen: false
    }
  },
  computed: {
    ...mapState(['menuVisible', 'hover'])
  },
  methods: {
    toggleMenu() {
      this.open = !this.open;
      this.$store.commit(SET_MENU_VISIBLE, this.open)
    },
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


  &.open {
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

.fullscreen {
  @include size(80px, 80px);
  @include position(fixed, 140px null null 30px);
  z-index: 100000;
  background: black;
  padding: 30px;
  border: 0;
  outline: 0;
  
  &:hover { outline: 0; }

  @include max-width(header) {
    @include size(40px);
    padding: 10px;
    top: 90px;
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
