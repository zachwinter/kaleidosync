<template lang="pug">
.uniforms(v-if="!shuffleVariants")
  h3 Uniforms
  table(cellspacing="0" cellpadding="0")
    tbody
      Color(v-for="(color, i) in colors" :value="color" @input="onInput" :key="`${i}-color`" @delete="onDelete(color)")
      Boolean(v-for="(boolean, i) in booleans" :value="boolean" @input="onInput" :key="`${i}-bool`" @delete="onDelete(boolean)")
      Number(v-for="(number, i) in numbers" :value="number" @input="onInput" :key="`${i}-number`" @delete="onDelete(number)")
      tr(v-if="devMode"): td(colspan="6"): AddUniform(@add="onAdd")
</template>

<script>
import { bind } from '@zach.winter/vue-common/util/store'
import Number from '@/components/visualizer/side-bar/uniforms/Number'
import Boolean from '@/components/visualizer/side-bar/uniforms/Boolean'
import Color from '@/components/visualizer/side-bar/uniforms/Color'
import AddUniform from '@/components/visualizer/side-bar/uniforms/AddUniform'
import { buildUniforms } from '@/util/uniforms'

export default {
  data: () => ({
    model: []
  }), 
  components: {
    Number, 
    AddUniform, 
    Boolean,
    Color
  },
  computed: {
    ...bind([
      'player/shuffleVariants', 
      'ui/devMode',
      'visualizer/activeSketch',
      'visualizer/activeVariant',
      'visualizer/sketch'
    ]),
    uniforms () {
      if (!this.sketch) return []
      const uniforms = buildUniforms(this.sketch.uniforms)
      return Object.keys(uniforms).map(key => {
        return { ...uniforms[key], name: key }
      }).filter(uniform => uniform.visible !== false)
    },
    numbers () {
      return this.uniforms.filter(val => val.type === 'number')
    },
    booleans () {
      return this.uniforms.filter(val => val.type === 'boolean')
    },
    colors () {
      return this.uniforms.filter(val => val.type === 'color')
    }
  },
  methods: {
    onInput (val) {
      const uniforms = {...this.sketch.uniforms}
      uniforms[val.name] = val
      this.$store.commit('visualizer/SET_SKETCH', { ...this.sketch, uniforms: buildUniforms(uniforms) })
    },

    onAdd ({ type, name }) {
      let uniform
      switch(type) {
        case 'number':
          uniform = {
            name,
            type,
            min: 0,
            max: 1,
            value: 1,
            step: .01
          }
          break
        case 'boolean':
          uniform = {
            name,
            type,
            value: true
          }
          break
        case 'color': 
          uniform = {
            name,
            type,
            value: [1, 1, 1]
          }
          break
      }
      const model = this.model.reduce((acc, val) => {
        acc[val.name] = {...val}
        return acc
      }, {})
      model[name] = uniform
      this.$store.dispatch('visualizer/updateUniforms', model)
    },

    onDelete (uniform) {
      const model = this.model.reduce((acc, val) => {
        acc[val.name] = {...val}
        return acc
      }, {})
      delete model[uniform.name]
      this.$store.dispatch('visualizer/updateUniforms', model)
    }
  }
}
</script>

<style lang="scss">
$border: 1px solid rgba($white, .5);

.uniforms table {
  padding: 0;
  width: 100%;
  margin-bottom: 1rem;
  
  thead td {
    text-align: center;
    font-size: .8rem;
  }

  tbody { background: rgba($black, .5); }
  
  tbody td {
    border-right: $border;
    border-bottom: $border;
    padding: 0 10px;
    height: $form-control-height;
  }

  tbody td:last-child { border-right: 0; }

  tbody tr:last-child td { border-bottom: 0; }

  .close {
    width: 40px; 
    text-align: center;
  }

  .name {
    width: 150px;
    position: relative;
  
    label {
      text-transform: none;
      font-family: 'Open Sans', sans-serif;
      text-transform: none;
    }
  }

  .num { padding: 0; }
}
</style>