<template lang="pug">
.variants(:class="{ custom: !shuffleVariants, hidden: editingUniform }")
  h3 Variants
  .buttons
    button(
      v-for="(variant, i) in activeSketch.uniforms || []" 
      :key="i" 
      :class="{ active: activeVariant === i }" 
      @click="update(i)"
    ) 0{{ i + 1 }}
  .shuffle(v-if="activeSketch.uniforms.length")
    Toggle(v-model="shuffleVariants" label="Shuffle Variants")
    .horizontal(v-if="shuffleVariants")
      p Every
      SelectDropdown(:options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" v-model="shuffleIntervalMultiplier").multiplier
      RadioGroup(:options="shuffleIntervalOptions" name="shuffle-interval" v-model="shuffleInterval").group
  .cta(v-if="shuffleVariants")
    //- p Disable shuffle to customize the visuals yourself!
    button(@click="$store.commit('player/SET_SHUFFLE_VARIANTS', false)").button
      IconButton(icon="sliders-h").icon
      span Customize
</template>

<script>
import { dualBind } from '@zach.winter/vue-common/util/store'
import form from '@zach.winter/vue-common/mixins/form'
import { mapState } from 'vuex'
import IconButton from '@/components/common/IconButton'

export default {
  mixins: [form],
  components: { IconButton },
  computed: {
    ...mapState(['isMobile']),
    ...dualBind([
      'player/shuffleVariants',
      'player/shuffleInterval',
      'player/shuffleIntervalMultiplier',
      'visualizer/activeVariant',
      'visualizer/activeSketch',
      'ui/editingUniform'
    ]),
    shuffleIntervalOptions () {
      return [{
        name: this.shuffleIntervalMultiplier === 1 ? 'Beat' : 'Beats',
        value: 'beats',
      }, {
        name: this.shuffleIntervalMultiplier === 1 ? 'Bar' : 'Bars',
        value: 'bars'
      }]
    },
  },
  methods: {
    update (i) {
      this.$store.dispatch('visualizer/setVariant', { i })
    }
  }
}
</script>

<style lang="scss">
.variants {
  transition: opacity $base-transition;
  
  &.hidden { opacity: 0; }

  .buttons {
    @include flex(center, flex-start, row);

    button {
      @include button;

      &.active { background: lighten($black, 15%); }
    }
  }

  .shuffle {
    height: 30px;
    margin-top: 1rem;

    @include mobile {
      @include flex(flex-start, flex-start, column);
      margin-bottom: 2rem;
    }
  }

  &.custom .shuffle {
    @include mobile {
      margin-bottom: 0;
    }
  }

  .shuffle, .shuffle .form-element, .horizontal {
    display: inline-flex;
    flex-shrink: 0;
  }

  .horizontal {
    @include flex(center, flex-start, row);

    @include mobile {
      margin-top: .5rem;
      margin-bottom: 1rem;
    }
  }

  .form-element {
    margin-right: 1rem;
  }

  .multiplier {
    width: 50px;
    min-width: 50px;
    height: 30px;
    line-height: 30px;
    margin: 0 1rem;
  }

  .cta {
    margin-top: 1rem;
    overflow: hidden;

    p {
      text-transform: none;
      font-family: 'Open Sans', sans-serif;
      font-size: 1.5rem;
    }

    .button {
      @include button;
      @include flex(center, center, row);
      background: transparent;
      color: white;
      border: 1px solid white;
      width: 100%;
      font-size: 18px;

      span {
        padding-left: .25rem;
      }

      &:hover {
        border-color: $red;
        background: $red;
        color: $white;
      }

      &:active {
        transform: scale(.9);
      }
    }

    @include mobile {
      height: auto;
    }
  }
}
</style>