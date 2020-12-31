<template lang="pug">
.education(:class="{ full: legacy }")
  h3 Welcome to Kaleidosync!
  p(v-if="legacy") This version of Kaleidosync only works if you listen to entire songs. If you change songs before a song ends, make sure you click the refresh icon!
  p(v-if="legacy && paused") Play a song to get started!
  p(v-if="!legacy || legacy && !paused") Click the circle at the bottom right to choose one of {{ sketches.length }} customizable visualizers!
  .keyboard(v-if="!isMobile")
    p You can also use the following keyboard shortcuts:
    Keys(:horizontal="true")
  .buttons
    button(@click="dismiss") OK!
</template>

<script>
import Keys from '@/components/visualizer/Keys'
import { mapGetters, mapState } from 'vuex'
import { bind } from '@zach.winter/vue-common/util/store'

export default {
  components: { Keys },
  computed: {
    ...bind([
      'visualizer/sketches',
      'player/paused'
    ]),
    ...mapGetters(['legacy']),
    ...mapState(['isMobile'])
  },
  methods: {
    dismiss () {
      this.$store.commit('education/SET_EDUCATED', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.education {
  @include position(fixed, 0 0 $control-height 0);
  @include flex(center, center, column);
  background: linear-gradient(to bottom, rgba(0, 0, 0, .3), $ui-color);
  color: $white;

  &.full {
    bottom: 0;
  }
}

h3 {
  @include scale(font-size 1.5rem 4rem);
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  max-width: 800px;
  text-align: center;
  padding: 0 2rem;
  margin: 1rem 0;
}

p + p {
  margin-bottom: 1rem;
}

.buttons {
  @include flex(center, center, row);
  margin-top: 1rem;
}

button {
  @include button;
  background: $white;
  color: $black;
  margin: 0 1rem;
}

button {
  border: 2px solid $white;
  color: $white;
  background: transparent;
}
</style>