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
    h2 A Spotify Visualizer
    p A growing collection of {{ sketches.length }} customizable WebGL sketches by #[a(href="https://instagram.com/zachary.io" target="instagram") @zachary.io], with more added every week. 
    .buttons
      button(@click="login")
        span Log In
        icon(name="spotify" set="fab")
      .link: a(href="https://instagram.com/zachary.io" target="instagram"): icon(name="instagram" set="fab")
      .link: a(href="https://github.com/zachwinter/kaleidosync" target="github"): icon(name="github" set="fab")
  Renderer(
    :class="{ visible: showRenderer }"
    class="renderer"
    ref="renderer" 
    :hidpi="false" 
    :stayAlive="true"
    :homepage="true"
    v-if="localShader && localUniforms" 
    :sketch="{ shader: localShader, uniforms: localUniforms }"
  )
  transition(name="fade"): Privacy(v-if="showPrivacyPolicy" @close="showPrivacyPolicy = false")
  button.show-privacy(@click="showPrivacyPolicy = true") Privacy Policy
</template>

<script>
import { buildUniforms } from '@/util/uniforms'
import { bind } from '@zach.winter/vue-common/util/store'
import { mapState } from 'vuex'
import Renderer from '@/components/common/Renderer'
import { pause } from '@zach.winter/common/js/timing'
import Privacy from '@/views/Privacy'

export default {
  name: 'Home',
  components: { Renderer, Privacy },
  data () { 
    return {
      show: false,
      hide: false,
      sketchIndex: 0,
      sketchInterval: null,
      showRenderer: true,
      localShader: null,
      localUniforms: null,
      initialized: false,
      showPrivacyPolicy: false
    }
  },
  computed: {
    ...mapState(['loaded']),
    ...bind([
      'visualizer/activeSketch',
      'visualizer/hidpi',
      'visualizer/sketches',
      'visualizer/activeVariant',
    ]),
    shader () {
      return this.activeSketch?.shader || null
    },
    uniforms () {
      return buildUniforms(this.activeSketch?.uniforms?.[this.activeVariant] || null)
    }
  },
  watch: {
    loaded (val) {
      if (!val) return
      this.localShader = this.shader
      this.localUniforms = this.uniforms
      this.show = true
      if (this.$ga) this.$ga.page('/')
    },
    async activeSketch () {
      if (!this.initialized) return
      this.showRenderer = false
      await pause(1000)
      this.localShader = this.shader
      this.localUniforms = this.uniforms
      this.showRenderer = true
    }
  },
  async mounted () {
    this.id = window.__KALEIDOSYNC_LOOP__.watch('tick', async (now) => {
     if (this.$refs.renderer) this.$refs.renderer.tick(now) 
    })
    this.sketchInterval  = setInterval(() => {
      if (this.sketchIndex === this.sketches.length - 1) {
        this.sketchIndex = 0
      } else {
         this.sketchIndex++
      }
      this.$store.dispatch('visualizer/selectByIndex', this.sketchIndex)
    }, 5000)
    await this.$nextTick()
    this.initialized = true
  },
  beforeDestroy () {
    window.__KALEIDOSYNC_LOOP__.unwatch('tick', this.id)
    clearInterval(this.sketchInterval)
  },
  methods: {
    async login () {
      this.hide = true
      this.$refs.animate.addEventListener('animationend', () => {
        this.$store.dispatch('spotify/login')
      })
    },
    tick (now) {
      requestAnimationFrame(this.tick.bind(this))
      if (this.$refs.renderer) this.$refs.renderer.tick(now)
    }
  },
}
</script>

<style lang="scss" scoped>
$splash-hide-duration: 1000ms;

.home {
  @include page;
  @include flex(center, center, column);
  color: $white;
  opacity: 0;
  text-align: center;
  transition: opacity $splash-hide-duration;
  background: $black;
}

@keyframes fadeslide {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

.splash {
  @include size(100vw, 100vh);
  @include position(fixed, 0 0 0 0);
  @include flex;
  color: $white;
  background: $black;
  padding: 5rem;
  /* border-radius:  1000px; */
  @include cascade;
  z-index: 100;
  position: relative;
  background: rgba(0, 0, 0, .7);

  > * {
    @include cascade(5, 50ms);
    animation: fadeslide 1000ms $base-easing forwards;
    opacity: 0;
  }
}

h1 {
  @include scale(font-size 54px 220px, line-height 54px 150px);
  font-family: 'Gochi Hand', cursive;
  font-weight: 100;
  letter-spacing: -.1em;
  position: relative;
  text-shadow: 0 1px 10px rgba(0, 0, 0, .5);;

  span { display: inline-block; }
  
  .beta {
    @include position(absolute, 0 20px null null);
    color: $red;
    font-size: 30px !important; 
    letter-spacing: 0;
    transform: translateX(150%);
    transition: all $splash-hide-duration $bounce-easing;
    opacity: 0;
  }

  @include mobile-landscape {
    font-size: 80px;
    line-height: 80px;
  }
}

h2 {
  @include scale(font-size 16px 40px, line-height 16px 40px);
  display: inline-flex;
  margin: 0 auto;
  font-family: 'share', sans-serif;
  text-transform: uppercase;
  font-weight: 300;
  /* letter-spacing: .05em; */
  /* transition: all $splash-hide-duration $bounce-easing; */
  text-align: center;
  padding: 5px;
  text-shadow: 0 1px 10px rgba(0, 0, 0, .5);

  @include mobile-landscape {
    font-size: 20px;
    line-height: 20px;
  }
}

p {
  @include scale(font-size 18px 20px);
  color: $white;
  margin-top: 1rem;
  /* transition: all $splash-hide-duration $bounce-easing; */
  text-shadow: 0 1px 10px rgba(0, 0, 0, .5);;

  a {
    font-weight: 700;
    color: $blue;

    &:hover { color: $green; }
  }
}

.buttons {
  @include flex(center, center, row);
  /* transition: all $splash-hide-duration $bounce-easing; */
  margin-top: 30px
}


button {
  @include button($spotify-green, $white);
  @include size(140px, 50px);
  @include flex(center, center, row);
  @include share;
  font-size: 22px;
  border-radius: 100px;
  margin-right: 1rem;

  svg {
    margin-left: 1rem;
  }
}

.links {
  @include position(fixed, null 0 30px 0);
  @include flex(center, center, row);
  margin-top: 10px;
  /* transition: all $splash-hide-duration $bounce-easing; */
  margin-top: 2rem;
}

.link {
  @include flex;
  text-decoration: none;
  transition: all 100ms ease-out;
  color: $white;

  &:hover { transform: scale(1.1); }

  svg {
    @include size(30px);
    margin-right: 8px;
  }

  &+.link { margin-left: 5px; }
}

.show {
  opacity: 1;
  .splash, .links, h1 .beta {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(50px);
  }
}

@keyframes fadeOut2 {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(50px);
  }
}

.hide {
  .splash > * {
    animation: none;
    opacity: initial;
  }

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

  h2, p, .buttons, .links {
    animation: fadeOut $splash-hide-duration $bounce-easing forwards !important;
  }

  .show-privacy { animation: fadeOut2 $splash-hide-duration $bounce-easing forwards !important; }
}

.renderer {
  opacity: 0;
  transition: opacity 1000ms $bounce-easing;

  &.visible { opacity: 1; }
}

@keyframes fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.show-privacy {
  @include strip;
  @include position(fixed, null 0 $outer-padding 50%);
  animation: fade 1000ms $base-easing forwards;
  text-align: center;
  transform: translateX(-50%);
  z-index: 100;
  font-size: 1rem;
  font-family: Quicksand;
  text-transform: none;
  font-weight: bold;
  color: $blue;

  &:hover {
    background: none;
    color: $spotify-green;
  }


  @include mobile-landscape {
    @include position(fixed, null 0 $outer-padding / 3 50%);
  }
}
</style>