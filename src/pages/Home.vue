<template lang="pug">
div.home(:style="{ color, transition: `all ${colorTransitionDuration}ms` }")
  div.splash(:class="{ hide }")
    h1(ref="logo")
      span(data-letter="1") K
      span(data-letter="2") a
      span(data-letter="3") l
      span(data-letter="4") e
      span(data-letter="5") i
      span(data-letter="6") d
      span(data-letter="7") o
      span(data-letter="8") s
      span(data-letter="9") y  
      span(data-letter="10") n
      span(data-letter="11" ref="last") c
    div.text
      h2 A Spotify visualizer
      noscript Please enable JavaScript before logging in.
      .buttons
        button(@click="login" :style="{ color, borderColor: color, transition: `opacity ${colorTransitionDuration}ms, transform ${colorTransitionDuration}ms` }") Log In
        .github(:style="{ transition: `all ${colorTransitionDuration}ms` }")
          a(href="https://github.com/zachwinter/kaleidosync" target="_blank")
            GitHub(:color="color", :colorTransitionDuration="colorTransitionDuration")
</template>

<script>
import { mapState } from 'vuex'
import Kaleidosync from '@/sketches/kaleidosync'
import GitHub from '@/components/GitHub'
import { SET_COLOR } from '@/vuex/mutation-types'

export default {
  name: 'home',
  components: { GitHub },
  data () {
    return {
      hide: false
    }
  },
  computed: {
    ...mapState(['color', 'colorTransitionDuration'])
  },
  methods: {
    login () {
      this.hide = true
      this.kaleidosync.sketch.canvas.classList.add('fade-out')
      this.$refs.last.addEventListener('animationend', () => {
        this.$store.dispatch('login')
      })
    } 
  },
  created () {
    this.kaleidosync = new Kaleidosync({
      fixed: true,
      hidpi: false,
      volumeSmoothing: 30
    })

    this.kaleidosync.sketch.canvas.classList.add('fade')

    this.kaleidosync.state.watch('activeColorTheme', (val, old) => {
      if (val.primary === old.primary) return 
      this.$store.commit(SET_COLOR, val.primary)
    })

    this.$store.commit(SET_COLOR, this.kaleidosync.state.activeColorTheme.primary)
  },
  mounted () {
    if (this.$ga) {
      this.$ga.page('/')
    }
  }
}
</script>

<style lang="scss" scoped>
$splash-hide-duration: 300ms;

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; } 
}

.splash {
  z-index: 100;
  animation: fade-in 1000ms linear forwards;
  animation-delay: $splash-hide-duration;
  opacity: 0;
  position: relative;
}

.text {
  @include position(absolute, null 0 0 0);
  transform: translateY(100%);
  text-align: center;
}

h1 {
  @include share;
  @include scale(font-size 170px 56px, line-height 170px 56px);

  span { display: inline-block; }
}

h2 {
  @include scale(font-size 32px 16px, line-height 32px 16px);
  transition: transform $splash-hide-duration $bounce-easing, opacity $splash-hide-duration $bounce-easing;
}

.buttons {
  @include flex;
  margin-top: 30px;
}

button {
  @include button;
  @include flex;
  background: transparent;
  position: relative;

  &:hover {
    background: transparent;
  }
}

.hide {
  @for $i from 1 through 11 {
    @keyframes shwoop-#{$i} {
      0% {
        opacity: 1;
        transform: translateY(0px) scale(1);
      }

      100% {
        opacity: 0;
        transform: translateY(#{random(600) - 300}px) scale(#{random(10)/10});
      }
    }

    h1 span:nth-child(#{$i}) {
      animation: shwoop-#{$i} 950ms $bounce-easing forwards;
      animation-delay: #{$i*30}ms;
    }
  }

  h2, button, .github {
    opacity: 0;
    transform: scale(.7);
  }
}

.github {
  margin-left: 15px;

  a {
    text-align: right;
  }

  svg {
    @include size(40px);
  }
}
</style>

<style lang="scss">
$splash-hide-duration: 500ms;

@keyframes fade-canvas {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fadeout-canvas {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

$canvas-easing: 1400ms $bounce-easing forwards;

canvas.fade {
  @include position(fixed, 0 null null 0);
  animation: fade-canvas $canvas-easing;
  animation-delay: $splash-hide-duration;
  opacity: 0;
  z-index: 0;
}

canvas.fade-out {
  animation: fadeout-canvas $canvas-easing;
}
</style>