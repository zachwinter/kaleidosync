<template lang="pug">
.container
  .controls
    div(v-for="(uniform, i) in iterableUniforms" :key="i").uniforms
      DynamicUniform(:uniform="uniform" :index="i" @update="onUpdate" @delete="deleteUniform")
    .adding(v-if="adding")
      input(type="text" v-model="addingModel" autofocus placeholder="Uniform Name")
      button(@click="addUniform") Save
    button(v-else @click="adding = true") Add Uniform
  textarea(v-model="localShader")
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { SET_UNIFORMS, SET_SHADER } from '@/store/modules/flower'
import DynamicUniform from '@/components/DynamicUniform'

const props =  {
  stateKey: {
    type: String,
    required: true
  },
  
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
  components: { DynamicUniform },
  data: () => ({
    model: null,
    addingModel: '',
    adding: false,
    localShader: null
  }),
  computed: {
    iterableUniforms () {
      let arr = []
      for (let key in this.model) {
        arr.push(this.model[key])
      }
      return arr
    }
  },
  watch: {
    uniforms (val) {
      this.model = cloneDeep(val)
    },
    localShader (val) {
      this.$store.commit(`${this.stateKey}/${SET_SHADER}`, val)
    }
  },
  created () {
    this.model = cloneDeep(this.uniforms)
    this.localShader = this.shader
  },
  methods: {
    async onUpdate ({ uniform }) {
      const model = cloneDeep(this.model)
      model[uniform.name] = uniform
      this.$store.commit(`${this.stateKey}/${SET_UNIFORMS}`, model)
    },

    deleteUniform (uniform) {
      delete this.model[uniform]
      this.$store.commit(`${this.stateKey}/${SET_UNIFORMS}`, this.model)
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
      this.$store.commit(`${this.stateKey}/${SET_UNIFORMS}`, model)
      this.adding = false
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  @include position(fixed, 0 0 null null);
  @include flex;
  text-align: center;
  z-index: 200;

  > * + * { margin-top: spacer(.25); }
}

.controls {
  padding: spacer(.5);
  background: rgba(0, 0, 0, .5);
  color: white;

  > * + * { margin-top: spacer(.25); }
}

.uniforms {
  margin: 10px 0;
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

textarea {
  @include position(fixed, null 0 0 0);
  width: 100%;
  font-family: monospace;
  height: 400px;
  border: 0;
  background: rgba(0, 0, 0, .5);
  color: white;
  padding: spacer(.5);
}
</style>