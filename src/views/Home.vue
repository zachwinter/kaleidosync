<template lang="pug">
div.home(:class="{ hide, show }")
  div.splash
    h1(ref="logo")
      span(data-letter="1") K
      span(data-letter="2") a
      span(data-letter="3") l
      span(data-letter="4") e
      span(data-letter="5") i
      span(data-letter="6") d
      span(data-letter="7") o
      span(data-letter="8") s
      span(data-letter="9" ref="animate") y  
      span(data-letter="10") n
      span(data-letter="11") c
    div.text
      h2 a Spotify visualizer
      noscript Please enable JavaScript before logging in.
      .buttons
        button(@click="login")
          span Log In
          Spotify
  .links
    .github: a(href="https://github.com/zachwinter/kaleidosync" target="github"): GitHub
    .instagram: a(href="https://instagram.com/zachary.io" target="instagram"): Instagram
</template>

<script>
import GitHub from '@/assets/svg/github.svg'
import Spotify from '@/assets/svg/spotify.svg'
import Instagram from '@/assets/svg/instagram.svg'
import { pause } from '@/util/timing'

export default {
  name: 'home',
  components: { GitHub, Spotify, Instagram },
  data () {
    return {
      show: false,
      hide: false
    }
  },
  methods: {
    async login () {
      this.hide = true
      this.$refs.animate.addEventListener('animationend', () => {
        this.$store.dispatch('spotify/login')
      })
    },
    
    init () {
      this.show = true
      if (this.$ga) {
        this.$ga.page('/')
      }
    }
  },
  async mounted () {
    if (typeof document.fonts.ready !== 'undefined') {
      await document.fonts.ready
      this.init()
    } else {
      await pause(300)
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
$splash-hide-duration: 1000ms;

.splash {
  z-index: 100;
  position: relative;
  opacity: 0;
  transition: opacity $splash-hide-duration;
}

h1 {
  @include scale(font-size 220px 72px, line-height 150px 50px);
  font-family: 'Gochi Hand', cursive;
  font-weight: 400;
  letter-spacing: -.1em;
  
  span { display: inline-block; }
}

h2 {
  @include scale(font-size 32px 16px, line-height 24px 16px);
  font-family: 'Open Sans';
  font-weight: 300;
  transition: transform $splash-hide-duration $bounce-easing, opacity $splash-hide-duration $bounce-easing;
  opacity: .3;
  text-align: center;
}

.buttons {
  @include flex;
  margin-top: 30px
}

button {
  @include button(#65D36E);
  @include flex;
  background: #65D36E;
  color: white;
  position: relative;
  font-size: 24px;
  border: 0;

  &:hover { background: darken(#65D36E, 20%); }

  svg {
    @include size(24px);
    margin-left: 10px;
  }
}

.links {
  @include position(fixed, null null 30px null);
  @include flex;
  opacity: 0;
  transition: all $splash-hide-duration;

  a {
    @include flex;
    text-decoration: none;
    font-weight: bold;
    @include share;
  }

  svg {
    @include size(40px);
    margin-right: 8px;
    transition: fill 200ms ease-in-out;

    &:hover { fill: rgba(0, 0, 0, .5); }
  }
}

.show {
  .splash, .links {
    opacity: 1;
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
        transform: translateY(#{random(200) - 100}px) scale(#{random(10)/10});
      }
    }

    h1 span:nth-child(#{$i}) {
      animation: shwoop-#{$i} 950ms $bounce-easing forwards;
      animation-delay: #{$i*30}ms;
    }
  }

  h2, button, .links {
    opacity: 0;
    transform: scale(.7);
  }
}
</style>