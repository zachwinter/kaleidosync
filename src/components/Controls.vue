<template lang="pug">
.container(:class="{ production }")
  transition(name="fade")
    .controls(v-if="(!menuVisible && iterableUniforms.length && showSettings)")
      div
        div(v-for="(uniform, i) in iterableUniforms" :key="i").uniforms
          DynamicUniform(:uniform="uniform" :index="i" @update="onUpdate" @delete="deleteUniform")
        .adding(v-if="adding")
          input(type="text" ref="adding" v-model="addingModel" @input="onAddingChange" placeholder="Uniform Name")
          button(@click="addUniform") Save
        CheckBox(v-model="showShader" label="Show Shader" size="sm" variant="light" v-if="!production").checkbox
        .buttons
          button(v-if="!adding && !production" @click="adding = true") Add Uniform
          button(v-if="adding" @click="adding = false") Cancel
          button(@click="$emit('copyShader')" v-if="!production") Copy Shader
          button(@click="$emit('copyUniforms')" v-if="!production") Copy Uniforms
          button(@click="reset") Reset
          button(@click="$store.dispatch('user/toggleSettings')") Hide
  transition(name="fade")
    textarea(v-model="localShader" v-if="!production && (!menuVisible && showSettings && showShader)" @input="onInput" @keypress="onInput")
    //- textarea(v-model="localShader" @input="onInput")
    //- prism-editor(:code="localShader" v-if="!production && (!menuVisible && showSettings && showShader)" language="javascript" :emitEvents="true" @change="onShaderChange")
</template>

<script>
import { mapState } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import DynamicUniform from '@/components/DynamicUniform'
import CheckBox from '@/components/CheckBox'
import { SET_SHOW_SHADER } from '@/store/modules/user'

const props =  {
  uniforms: {
    type: Object,
    required: true
  },

  shader: {
    type: String,
    required: true
  }
}

export default {
  props,
  components: { DynamicUniform , CheckBox },
  data: () => ({
    model: null,
    addingModel: '',
    adding: false,
    localShader: null,
    production: PRODUCTION // eslint-disable-line
  }),
  computed: {
    ...mapState({
      menuVisible: ({ ui }) => ui.menuVisible,
      hover: ({ ui }) => ui.hover,
      showSettings: ({ user }) => user.showSettings
    }),
    iterableUniforms () {
      let arr = []
      for (let key in this.model) {
        if (!((this.production && key === 'xBase') || this.production && key === 'xTick')) {
          arr.push(this.model[key])
        }
      }
      return arr
    },
    showShader: {
      get () {
        return this.$store.state.user.showShader
      },

      set (val) {
        this.$store.commit(`user/${SET_SHOW_SHADER}`, val)
      }
    }
  },
  watch: {
    uniforms (value) {
      this.model = cloneDeep(value)
    },
    localShader (value) {
      this.$emit('update', { key: 'shader', value })
    }
  },
  created () {
    this.model = cloneDeep(this.uniforms)
    this.localShader = this.shader
  },
  methods: {
    onUpdate ({ uniform }) {
      const model = cloneDeep(this.model)
      model[uniform.name] = uniform
      this.$emit('update', { key: 'uniforms', value: model })
    },

    deleteUniform (uniform) {
      delete this.model[uniform]
      this.$emit('update', { key: 'uniforms', value: this.model })
    },

    addUniform () {
      const model = cloneDeep(this.model)
      model[this.addingModel] = {
        name: this.addingModel,
        min: 0,
        max: 1,
        step: .01,
        value: .5
      }
      this.$emit('update', { key: 'uniforms', value: model })
      this.adding = false
    },
    
    onShaderChange (val) {
      this.localShader = val
    },

    onAddingChange ({ target }) {
      target.focus()
    },

    async reset () {
      this.$emit('reset')
      await this.$nextTick()
      this.localShader = this.shader
    },

    onInput () {
      this.$store.dispatch('ui/hover')
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 500px;

.container {
  @include position(fixed, 30px 30px null null);
  @include flex;
  text-align: center;
  z-index: 200;

  > * + * { margin-top: spacer(.25); }

  @include max-width(mobile) {
    @include position(fixed, auto 0 0 0);
  }

  @include mobile-landscape {
    @include position(fixed, 0 0 0 auto);
  }
}

.controls {
  @include size(100%);
  @include flex;
  background: $black;
  color: white;
  padding: 20px;
}

.checkbox {
  margin: spacer(1) 0;
}

.uniforms {
  width: 100%;
  margin: 10px 0;

  &:first-of-type { margin-top: 0; }
}

.current {
  @include flex(center, space-between);
  $height: 20px;

  select {
    @include size(100%, $height);
    background: transparent;
    color: white;
    margin: 0 5px;
  }

  button {
    height: $height;
  }
}

button {
  @include button($white);
  font-size: 12px;
  padding: 4px 15px;
  height: 40px;
}

input {
  margin: 0 10px;
}

.adding input {
  width: 100%;
  border: 0;
  height: 32px;
  outline: 0;
  background: transparent;
  color: white;
  padding: 30px;
}

p {
  font-size: 12px;
  text-align: center;
  text-transform: uppercase;
}

.prism-editor-wrapper, textarea {
  @include position(fixed, 30px null 210px 140px);
  @include size(700px, auto);
  padding: 20px;
  font-family: monospace;
  border: 0;
  background: rgba($black, .8);
  color: white;
  padding: spacer(.5);
  font-size: 14px;
  text-align: left;
}

.buttons {
  @include flex;

  > * { margin: 0 10px; }
}

.production .buttons {
  @include flex(center, center);
}
</style>

<style lang="scss">
.prism-editor-wrapper {
  padding: 20px !important;
  background: $black !important;
  opacity: .7;
  
  pre, code {
    background: transparent !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
  }
}
</style>