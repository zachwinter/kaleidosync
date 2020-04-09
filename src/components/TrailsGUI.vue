<template lang="pug">
.trails-gui
  form(@submit.prevent)
    //- label.color
    //-   span Background
    //-   Chrome(v-model="background" disableFields=true)
    div(v-for="(group, i) in groups" :key="i").group
      header
        h3 Group {{ i + 1 }}
        button(@click="remove(i)" v-if="groups.length > 1") Remove
      //- label.color
      //-   span Color
      //-   Chrome(v-model="group.color" disableAlpha=true disableFields=true @input="onInput(i)")
      //- label 
      //-   span Blending
      //-   select(v-model="group.blending" @change="onInput(i)" @input="onInput(i)")
      //-     option(v-for="(mode, i) in blending") {{ mode }}
      label
        span Sides
        input(type="range" min="3" max="12" v-model="group.sides" step="1" @change="onInput(i)" @input="onInput(i)")
      label
        span Trail Length
        input(type="range" min="2" max="40" v-model="group.length" step="1" @change="onInput(i)" @input="onInput(i)")
      label
        span Width
        input(type="range" min=".01" max="1" v-model="group.width" step=".01" @change="onInput(i)" @input="onInput(i)")
      label
        span Radius
        input(type="range" min="0" max=".5" v-model="group.radius" step=".01" @change="onInput(i)" @input="onInput(i)")
      label 
        span Rotation
        input(type="range" min="0" max=".15" v-model="group.rotation" step=".01" @change="onInput(i)" @input="onInput(i)")
      label 
        span Bend
        CheckBox(v-model="group.scale" @input="onInput(i)" variant="light" size="sm")
  button(@click="add") Add Ring
</template>

<script>
import { mapState } from 'vuex'
import { Chrome } from 'vue-color'
import { SET_TRAILS_BACKGROUND, SET_TRAILS } from '@/store/mutation-types'
import CheckBox from './CheckBox'
import cloneDeep from 'lodash/cloneDeep'
 
export default {
  components: { Chrome, CheckBox },
  data () {
    return {
      groups: [],
      background: null,
      backgroundColorPickerVisible: true,
      blending: [
        'source-over',
        'source-in',
        'source-out',
        'source-atop',
        'destination-over',
        'destination-in',
        'destination-out',
        'destination-atop',
        'lighter',
        'copy',
        'xor',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity'
      ]
    }
  },
  computed: mapState(['trails', 'trailsBackground']),
  watch: {
    async background (val) {
      await this.$nextTick()
      this.$store.commit(SET_TRAILS_BACKGROUND, val)
    }
  },
  methods: {
    async add () {
      await this.$store.dispatch('addTrailsRing')
      this.groups = cloneDeep(this.trails)
      this.$store.commit(SET_TRAILS, cloneDeep(this.groups))
    },
    async remove (i) {
      this.groups.splice(i, 1)
      await this.$nextTick()
      this.$store.commit(SET_TRAILS, cloneDeep(this.groups))
    },
    async onInput () {
      await this.$nextTick()
      this.$store.commit(SET_TRAILS, cloneDeep(this.groups))
    }
  },
  created () {
    this.background = cloneDeep(this.trailsBackground)
    this.groups = cloneDeep(this.trails)
  }
}
</script>

<style lang="scss" scoped>
.trails-gui {
  @include position(fixed, 0 0 0 null);
  @include share;
  z-index: 99999;
  color: $white;
  background: rgba($black, .2);
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  padding: 30px;
  width: 320px;
}

.group {
  margin-top: 10px;
  padding-top: 5px;
  border-top: 1px solid $white;

  &:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: 0;
  }
}

label {
  @include flex(center, space-between);
  margin-bottom: 5px;
}

.color {
  width: 100%;
  flex-wrap: wrap;

  label { margin: 0; }

  .color-swatch {
    @include size(100px, 20px);
    background: red;
    border-radius: 20px;
  }

  .vc-chrome {
    min-width: 100%;
    max-width: 100%;
    margin: 10px 0;
  }
}


.color {
  @include size(100%, auto);
  border-radius: 50px;
}

span {
  display: block;
  min-width: 100px;
  text-align: left;
}

header {
  @include flex(center, space-between);
  padding: 5px 0 10px 0;
  h3 {
    line-height: 30px;
    margin: 0;
  }
  button {
    width: auto;
    margin: 0;
    padding: 0 10px;
    height: 26px;
    border-width: 2px;
  }
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
  color: white;

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

h3 {
  margin-bottom: 5px;
  text-align: left;
  color: $blue;
}
</style>

<style lang="scss">
.vc-chrome-saturation-wrap {
  padding-bottom: 60px !important;
}
</style>