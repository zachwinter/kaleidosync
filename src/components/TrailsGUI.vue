<template lang="pug">
.trails-gui
  form(@submit.prevent )
    label
      span Sides
      input(type="range" :min="minSides" :max="maxSides" v-model="sides" @input="hover")
    label
      span Trail Length
      input(type="range" :min="minTrailLength" :max="maxTrailLength" v-model="trailLength" @input="hover")
    label
      span Width
      input(type="range" :min="minWidthConstant" :max="maxWidthConstant" step=".001" v-model="widthConstant" @input="hover")
    label
      span Glow
      input(type="range" :min="minGlowWidth" :max="maxGlowWidth" v-model="glowWidth" @input="hover")
    label
      span Base Rotation
      input(type="range" :min="minBaseRotation" :max="maxBaseRotation" step=".001" v-model="baseRotation" @input="hover")
    label
      span Flux Rotation
      input(type="range" :min="minFluxRotation" :max="maxFluxRotation" step=".001" v-model="fluxRotation" @input="hover")
    label
      span Smear
      input(type="range" :min="minSmear" :max="maxSmear" step=".05" v-model="smear" @input="hover")
    button(@click="reset") Reset
</template>

<script>
import {
  TRAILS_SET_SIDES,
  TRAILS_SET_WIDTH_CONSTANT,
  TRAILS_SET_TRAIL_LENGTH,
  TRAILS_SET_GLOW_WIDTH,
  TRAILS_SET_ROTATION_CONSTANT,
  TRAILS_SET_SMEAR,
  TRAILS_SET_ROTATION_MULTIPLIER
} from '@/vuex/mutation-types'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      selected: 'Default',
      sketchName: ''
    }
  },
  computed: {
    ...mapState({
      minSides: s => s.visualizers.trails.SIDES.MIN,
      maxSides: s => s.visualizers.trails.SIDES.MAX,
      minTrailLength: s => s.visualizers.trails.TRAIL_LENGTH.MIN,
      maxTrailLength: s => s.visualizers.trails.TRAIL_LENGTH.MAX,
      minWidthConstant: s => s.visualizers.trails.WIDTH_CONSTANT.MIN,
      maxWidthConstant: s => s.visualizers.trails.WIDTH_CONSTANT.MAX,
      minGlowWidth: s => s.visualizers.trails.GLOW_WIDTH.MIN,
      maxGlowWidth: s => s.visualizers.trails.GLOW_WIDTH.MAX,
      minBaseRotation: s => s.visualizers.trails.ROTATION_CONSTANT.MIN,
      maxBaseRotation: s => s.visualizers.trails.ROTATION_CONSTANT.MAX,
      minFluxRotation: s => s.visualizers.trails.ROTATION_MULTIPLIER.MIN,
      maxFluxRotation: s => s.visualizers.trails.ROTATION_MULTIPLIER.MAX,
      minSmear: s => s.visualizers.trails.SMEAR.MIN,
      maxSmear: s => s.visualizers.trails.SMEAR.MAX,
      saved: s => s.saved
    }),

    sides: {
      get () {
        return this.$store.state.visualizers.trails.SIDES.VALUE
      },
      set (value) {
        this.$store.commit(TRAILS_SET_SIDES, parseFloat(value))
      }
    },
    widthConstant: {
      get () {
        return this.$store.state.visualizers.trails.WIDTH_CONSTANT.VALUE
      },
      set (value) {
        this.$store.commit(TRAILS_SET_WIDTH_CONSTANT, parseFloat(value))
      }
    },
    trailLength: {
      get () {
        return this.$store.state.visualizers.trails.TRAIL_LENGTH.VALUE
      },
      set (value) {
        this.$store.commit(TRAILS_SET_TRAIL_LENGTH, parseFloat(value))
      }
    },
    glowWidth: {
      get () {
        return this.$store.state.visualizers.trails.GLOW_WIDTH.VALUE
      },
      set (value) {
        this.$store.commit(TRAILS_SET_GLOW_WIDTH, parseFloat(value))
      }
    },
    baseRotation: {
      get () {
        return this.$store.state.visualizers.trails.ROTATION_CONSTANT.VALUE
      },
      set (value) {
        this.$store.commit(TRAILS_SET_ROTATION_CONSTANT, parseFloat(value))
      }
    },
    fluxRotation: {
      get () {
        return this.$store.state.visualizers.trails.ROTATION_MULTIPLIER.VALUE
      },
      set (value) {
        this.$store.commit(TRAILS_SET_ROTATION_MULTIPLIER, parseFloat(value))
      }
    },
    smear: {
      get () {
        return this.$store.state.visualizers.trails.SMEAR.VALUE
      },
      set (value) {
        this.$store.commit(TRAILS_SET_SMEAR, parseFloat(value))
      }
    }
  },
  methods: {
    reset () {
      this.$store.dispatch('reset')
    },
    hover () {
      this.$store.dispatch('hover')
    }
  }
}
</script>

<style lang="scss" scoped>
.trails-gui {
  @include position(fixed, 30px 30px null null);
  @include share;
  z-index: 99999;
  color: white;
  background: black;
  padding: 15px;
}

label {
  @include flex(center, space-between);
  height: 30px;
}

span {
  display: block;
  min-width: 100px;
  text-align: left;
}

button {
  @include button($white, true);
  width: 100%;
  margin-top: 15px;
  
  &:hover { color: $black }
}

input[type="text"] {
  background: transparent;
  border: 0;
  border-bottom: 2px solid white;
  font-size: 20px;

  &:focus { outline: 0; }

  &::placeholder {
    text-transform: uppercase;
  }
}

input[type=range] {
  -webkit-appearance: none; 
  width: 100px; 
  background: transparent; 
}

input[type=range]::-webkit-slider-thumb {
  @include size(20px);
  -webkit-appearance: none;
  background: $blue;
  border-radius: 100%;
}

input[type="range"]::-webkit-slider-runnable-track {
  @include size(100%, 20px);
  background: $white;
  color: $blue;
  border-radius: 20px;
}

input[type=range]:focus {
  outline: none; 
}

input[type=range]::-ms-track {
  width: 100%;
  cursor: pointer;
  background: transparent; 
  border-color: transparent;
  color: transparent;
}
</style>