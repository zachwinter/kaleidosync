<template lang="pug">
div.home(:class="{ hide: hidePage }")
  div.splash(:class="{ hide: hideSplash }")
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
  .github
    a(href="https://github.com/zachwinter/kaleidosync" target="_blank")
      GitHub
</template>

<script>
import GitHub from '@/components/GitHub'
import Star from '@/components/Star'
import Spotify from '@/components/Spotify'

export default {
  name: 'home',
  components: { GitHub, Star, Spotify },
  data () {
    return {
      hideSplash: false,
      hidePage: false,
      stars: null,
      starsLoaded: true
    }
  },
  methods: {
    async login () {
      this.hideSplash = true
      this.hidePage = true
      this.$refs.animate.addEventListener('animationend', () => {
        this.$store.dispatch('login')
      })
    } 
  },
  async created () { 
    const data = await fetch('https://api.github.com/users/zachwinter/repos').then(res => res.json())
    const { stargazers_count } = data.find(d => d.id === 114038493)
    this.stars = stargazers_count
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

@keyframes fade-to-white {
  0% { background: #55FF93; }
  100% { background: #ffffff; }
}

.splash {
  z-index: 100;
  position: relative;
  // animation: fade-in 500ms ease-out forwards;
  // animation-delay: 100ms;
  // opacity: 0;
}

.home {
  @include position(fixed, 0 0 0 0);
  @include flex;
}

.text {
  // @include position(absolute, null 0 0 0);
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
  transition: transform $splash-hide-duration $bounce-easing, opacity $splash-hide-duration $bounce-easing;
  opacity: .3;
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

  &:hover {
    background: darken(#65D36E, 20%);
  }

  svg {
    @include size(24px);
    margin-left: 10px;
  }
}

.splash.hide {
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

  h2, button, .github {
    opacity: 0;
    transform: scale(.7);
  }
}

.github {
  @include position(fixed, null null 30px null);
  
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

    &:hover {
      fill: rgba(0, 0, 0, .5);
    }
  }
}

.hide .github {
  animation: fade-out $splash-hide-duration forwards;
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