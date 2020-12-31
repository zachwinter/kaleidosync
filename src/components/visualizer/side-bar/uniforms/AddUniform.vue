<template lang="pug">
.add-uniform
  transition(name="fade" v-for="(type, i) in types" :key="i")
    button(v-if="!adding" @click="onClick(type)") #[icon(name="plus")] {{ type }}
  transition(name="fade"): button(v-if="!adding" @click="$store.dispatch('sketches/addVariant')" :disabled="!canAddVariant") #[icon(name="plus")] Variant
  transition(name="fade"): TextInput(
    v-model="model" 
    v-if="adding" 
    :autofocus="true" 
    :placeholder="`Name your ${type} (esc to cancel)`"
    @keydown.native="onTextInput"
  )
</template>

<script>
import TextInput from '@zach.winter/vue-common/components/forms/TextInput'
import { mapGetters } from 'vuex'

export default {
  components: { TextInput },
  data: () => ({
    adding: false,
    model: '',
    type: null,
    types: ['color', 'boolean', 'number']
  }),
  computed: {
    ...mapGetters(['canAddVariant']),
    validName () {
      return Number(parseInt(this.model[0], 10)) === parseInt(this.model[0], 10)
    }
  },
  methods: {
    reset () {
      this.adding = false
      this.model = ''
    },
    onClick (type) {
      this.type = type
      this.adding = true
    },
    onTextInput ({ code }) {
      if (code === 'Escape') return this.reset()
      if (code !== 'Enter') return
      if (this.validName) {
        return this.$store.dispatch('modals/info', {
          title: 'Oops!',
          message: 'Variable names cannot begin with numbers.'
        })
      }
      this.$emit('add', { type: this.type, name: this.model })
      this.reset()
    }
  }
}
</script>

<style lang="scss">
.add-uniform {
  @include size(100%, $form-control-height);
  @include flex(center, space-evenly, row);
  position: relative;


  button {
    @include strip;
    @include flex(center, center, row);
    height: $form-control-height;
    width: 25%;

    &:disabled { opacity: .5; }

    svg { margin-right: .5rem; }
  }

  input[type="text"] {
    @include position(absolute, 0 null 0 0);
    font-family: 'Open Sans', sans-serif;
    width: 100%;
  }

  input[type="text"] {
    color: $white; 
    text-transform: none;

    &::placeholder {
      text-transform: uppercase;
      color: rgba($white, .3);
      font-family: 'Share', sans-serif;
    }
  }
}
</style>